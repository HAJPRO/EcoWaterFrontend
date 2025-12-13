<script setup>
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";
import { ElMessage } from "element-plus";

// --- COMPONENTS ---
import Modal from "../../../UI/Modal.vue"; // <--- YANGI MODAL
import Button from "../../../UI/Button.vue"; 
import Select from "../../../UI/Select.vue";

const store_product = ProductsManagmentStore();
const { product_modal, model, TitleAction } = storeToRefs(store_product);

// --- STATE (Select Options & Logic) ---
const categoryes = ref([{ id: 1, name: "Gazli ichimliklar" }, { id: 2, name: "Gazsiz" }]);
const saleTypes = ref([{ id: 1, name: "Dona" }, { id: 2, name: "Blok" }]);
const packingTypes = ref([{ id: 1, name: "0.5 L" }, { id: 2, name: "1.0 L" }]);
const errors = reactive({});

// --- HELPERS ---
const formatPrice = (p) => p ? new Intl.NumberFormat("uz-UZ").format(p) : "0";

// --- ACTIONS ---
const handleClose = () => {
  store_product.product_modal = false;
  errors.value = {};
};

const handleAddOption = (type) => ElMessage.info(`${type} qo'shish...`);

const PlusProduct = () => {
  if (!model.value.packingType || !model.value.buying_price) {
    ElMessage.warning("Qadoq va Narxni kiriting!");
    return;
  }
  const data = {
    id: uuidv4(),
    packingType: model.value.packingType,
    buying_price: Number(model.value.buying_price),
    block_buying_price: Number(model.value.block_buying_price || 0),
  };
  if (!model.value.products) model.value.products = [];
  model.value.products.push(data);
  model.value.packingType = ""; model.value.buying_price = ""; model.value.block_buying_price = "";
};

const DeleteById = (id) => {
  model.value.products = model.value.products.filter(i => i.id !== id);
};

const SaveProduct = () => {
  errors.code = !model.value.code;
  errors.pro_name = !model.value.pro_name;
  errors.pro_category = !model.value.pro_category;
  
  if (errors.code || errors.pro_name || errors.pro_category) return;

  store_product.Create({ action: TitleAction.value.action, model: model.value });
  handleClose();
};
</script>

<template>
  <Modal
    v-model="product_modal"
    :title="'Mahsulot ' + TitleAction.title"
    subtitle="Ombor boshqaruvi"
    icon="fa-solid fa-box-open"
    width="max-w-4xl"
    @close="handleClose"
  >
    
    <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
      <h4 class="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
        Asosiy Ma'lumotlar
      </h4>
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 sm:col-span-3">
          <label class="form-label required">Kodi</label>
          <input v-model="model.code" type="text" class="form-input" :class="{'!border-rose-500': errors.code}" placeholder="001" />
        </div>
        <div class="col-span-12 sm:col-span-9">
          <label class="form-label required">Nomi</label>
          <input v-model="model.pro_name" type="text" class="form-input" :class="{'!border-rose-500': errors.pro_name}" placeholder="Coca Cola" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label class="form-label required">Kategoriyasi</label>
          <Select
            v-model="model.pro_category"
            :options="categoryes"
            labelKey="name" valueKey="name"
            placeholder="Tanlang..."
            allowAdd searchable
            :error="!!errors.pro_category"
            @add="handleAddOption('pro_category')"
          />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label class="form-label">Sotuv turi</label>
          <Select v-model="model.sale_type" :options="saleTypes" labelKey="name" valueKey="name" placeholder="Tanlang..." allowAdd @add="handleAddOption('sale_type')" />
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
      <h4 class="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
        Narx va Qadoq
      </h4>
      <div class="grid grid-cols-12 gap-4 items-end">
        <div class="col-span-12 sm:col-span-4">
          <label class="form-label">Qadoq turi</label>
          <Select v-model="model.packingType" :options="packingTypes" labelKey="name" valueKey="name" placeholder="0.5L..." allowAdd searchable @add="handleAddOption('packingType')" />
        </div>
        <div class="col-span-12 sm:col-span-3">
          <label class="form-label">Narx (Dona)</label>
          <div class="relative"><input v-model="model.buying_price" type="number" class="form-input pr-10" placeholder="0" /><span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">UZS</span></div>
        </div>
        <div class="col-span-12 sm:col-span-3">
          <label class="form-label">Narx (Blok)</label>
          <div class="relative"><input v-model="model.block_buying_price" type="number" class="form-input pr-10" placeholder="0" /><span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">UZS</span></div>
        </div>
        <div class="col-span-12 sm:col-span-2">
          <Button variant="success" block left-icon="fa-solid fa-plus" @click="PlusProduct">Qo'shish</Button>
        </div>
      </div>

      <div class="mt-6 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-bold uppercase text-[11px]">
            <tr><th class="px-4 py-3 w-12">№</th><th class="px-4 py-3">Qadoq</th><th class="px-4 py-3 text-right">Dona</th><th class="px-4 py-3 text-right">Blok</th><th class="px-4 py-3 w-16"></th></tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
            <tr v-if="!model.products?.length"><td colspan="5" class="px-4 py-6 text-center text-slate-400">Narxlar yo'q</td></tr>
            <tr v-for="(row, index) in model.products" :key="row.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <td class="px-4 py-3 text-center text-slate-400">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-semibold">{{ row.packingType }}</td>
              <td class="px-4 py-3 text-right font-mono text-emerald-600">{{ formatPrice(row.buying_price) }}</td>
              <td class="px-4 py-3 text-right font-mono text-indigo-600">{{ formatPrice(row.block_buying_price) }}</td>
              <td class="px-4 py-3 text-center">
                <button @click="DeleteById(row.id)" class="text-slate-400 hover:text-rose-500 p-1.5"><i class="fa-solid fa-trash-can"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template #footer>
       <Button size="md" variant="danger" left-icon="fa fa-xmark" @click="handleClose">Bekor qilish</Button>
       <Button
       size="md" 
         :variant="TitleAction.action === 'create' ? 'primary' : 'success'" 
         left-icon="fa-solid fa-check" 
         @click="SaveProduct"
       >
         {{ TitleAction.action === "create" ? "Saqlash" : "Yangilash" }}
       </Button>
    </template>

  </Modal>
</template>

<style scoped>
.required::after { content: " *"; @apply text-rose-500; }
.form-label { @apply block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide; }
.form-input { @apply w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none; }
</style>