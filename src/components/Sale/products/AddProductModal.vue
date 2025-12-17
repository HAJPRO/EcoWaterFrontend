<script setup>
import { ref, reactive, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";
import { ElMessage } from "element-plus";

// --- COMPONENTS ---
import Modal from "../../../UI/Modal.vue";
import Button from "../../../UI/Button.vue"; 
import Select from "../../../UI/Select.vue";

const store_product = ProductsManagmentStore();
const { product_modal, model, TitleAction } = storeToRefs(store_product);

// --- STATE (Select Options) ---
const categoryes = ref([
    { id: 1, name: "Gazli ichimliklar" }, 
    { id: 2, name: "Gazsiz ichimliklar" },
    { id: 3, name: "Sharbatlar" },
    { id: 4, name: "Sneklar" }
]);

const units = ref([
    { id: 'dona', name: 'Dona' },
    { id: 'kg', name: 'Kilogram (kg)' },
    { id: 'litr', name: 'Litr (l)' },
    { id: 'blok', name: 'Blok/Upakovka' },
    { id: 'metr', name: 'Metr' },
    { id: 'qop', name: 'Qop' }
]);

const errors = reactive({});


// --- HISOBLASH MANTIQI FUNKSIYALARI ---

// Sotuv Narxini (Sale Price) hisoblash: SP = CP * (1 + M/100)
const calculateSalePrice = (cost, margain) => {
    if (cost > 0) {
        const newSale = cost * (1 + margain / 100);
        return parseFloat(newSale.toFixed(2)); 
    }
    return 0;
};

// Ustamani (Margain) hisoblash: M = ((SP - CP) / CP) * 100
const calculateMargain = (cost, sale) => {
    if (cost > 0) {
        const newMargain = ((sale - cost) / cost) * 100;
        return parseFloat(newMargain.toFixed(2));
    }
    return 0;
};


// --- NARXLARNI KUZATUVCHILAR (WATCHERS) ---

// 1. Cost Price (Tan narx) o'zgarganda: Sale Price va Margainni sinxronlash
watch(() => model.value.costPrice, (newCost) => {
    const sale = model.value.salePrice || 0;
    const margain = model.value.margainPercent || 0;

    if (newCost > 0) {
        // Agar Ustama mavjud bo'lsa, Sotuv narxini Ustamadan hisoblash (bu Ustama maydonining ustuvorligini bildiradi)
        if (margain !== 0) {
             model.value.salePrice = calculateSalePrice(newCost, margain);
        } else if (sale > 0) {
             // Aks holda, agar Sotuv Narxi kiritilgan bo'lsa, Ustamani qayta hisoblash
             model.value.margainPercent = calculateMargain(newCost, sale);
        }
    } else {
        // Tannarx 0 bo'lsa, barchasini 0 ga tenglash
        model.value.margainPercent = 0;
        model.value.salePrice = 0;
    }
}, { immediate: true });


// 2. Margain Percent (Ustama %) o'zgarganda: Sotuv Narxini avtomat hisoblash (Sizning 1-talabingiz)
watch(() => model.value.margainPercent, (newMargain) => {
    const cost = model.value.costPrice || 0;
    
    // Faqat tannarx kiritilgan bo'lsagina hisoblaymiz
    if (cost > 0) {
        model.value.salePrice = calculateSalePrice(cost, newMargain);
    }
});


// 3. Sale Price (Sotuv Narxi) o'zgarganda: Ustamani avtomat hisoblash (Sizning 2-talabingiz)
watch(() => model.value.salePrice, (newSale) => {
    const cost = model.value.costPrice || 0;

    // Faqat tannarx kiritilgan bo'lsagina hisoblaymiz
    if (cost > 0) {
        model.value.margainPercent = calculateMargain(cost, newSale);
    } else {
        model.value.margainPercent = 0;
    }
});


// --- HELPERS ---
const handleClose = () => {
    store_product.closeModal();
    Object.keys(errors).forEach(key => delete errors[key]);
};

const handleAddOption = (type) => ElMessage.info(`${type} yangi varianti qo'shilmoqda...`);

// --- ACTIONS ---
const SaveProduct = async () => {
    // 1. Validatsiya
    errors.code = !model.value.code;
    errors.name = !model.value.name;
    errors.category = !model.value.category;
    errors.salePrice = !model.value.salePrice || model.value.salePrice <= 0;
    
    if (errors.code || errors.name || errors.category || errors.salePrice) {
        ElMessage.warning("Iltimos, majburiy maydonlarni to'ldiring!");
        return;
    }

    // 2. Store orqali saqlash (Create yoki Update avtomatik aniqlanadi)
    await store_product.SaveProduct();
};
</script>

<template>
  <Modal
    v-model="product_modal"
    :title="TitleAction.title"
    subtitle="Ombor va Savdo boshqaruvi"
    icon="fa-solid fa-box-open"
    width="max-w-[85vw]" 
    @close="handleClose"
  >
    
    <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
      <h4 class="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
        Asosiy Ma'lumotlar
      </h4>
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 sm:col-span-4">
          <label class="form-label required">Shtrix Kod</label>
          <div class="relative">
              <i class="fa-solid fa-qrcode absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input v-model.number="model.code" type="number" class="form-input pl-9 font-mono" :class="{'!border-rose-500': errors.code}" placeholder="Masalan: 47800..." />
          </div>
        </div>
        
        <div class="col-span-12 sm:col-span-8">
          <label class="form-label required">Mahsulot Nomi</label>
          <input v-model="model.name" type="text" class="form-input" :class="{'!border-rose-500': errors.name}" placeholder="Masalan: Coca Cola 1.5L" />
        </div>
        
        <div class="col-span-12 sm:col-span-6">
          <label class="form-label required">Kategoriyasi</label>
          <Select
            v-model="model.category"
            :options="categoryes"
            labelKey="name" valueKey="name"
            placeholder="Tanlang..."
            allowAdd searchable
            :error="!!errors.category"
            @add="handleAddOption('Kategoriya')"
          />
        </div>
        
        <div class="col-span-12 sm:col-span-3">
          <label class="form-label required">O'lchov Birligi</label>
          <Select 
            v-model="model.unit" 
            :options="units" 
            labelKey="name" valueKey="id" 
            placeholder="Dona" 
          />
        </div>

        <div class="col-span-12 sm:col-span-3">
            <label class="form-label">Qadoq Hajmi</label>
            <div class="relative">
                <input v-model.number="model.packSize" type="number" min="1" class="form-input text-center" placeholder="1" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">x</span>
            </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
      <h4 class="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2 flex justify-between">
        <span>Moliya va Zaxira</span>
        <i class="fa-solid fa-coins opacity-50"></i>
      </h4>
      
      <div class="grid grid-cols-12 gap-5">
        
        <div class="col-span-12 sm:col-span-3">
          <label class="form-label text-slate-500">Kelish Narxi (Tan narx)</label>
          <div class="relative group">
              <input v-model.number="model.costPrice" type="number" class="form-input pr-12 group-focus-within:border-slate-400" placeholder="0" />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">UZS</span>
          </div>
        </div>
   <div class="col-span-12 sm:col-span-3">
          <label class="form-label required text-emerald-600 dark:text-emerald-400">Ustama (%)</label>
          <div class="relative group">
              <input v-model.number="model.margainPercent" type="number" class="form-input pr-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/10 font-bold text-emerald-700 dark:text-emerald-400" :class="{'!border-rose-500': errors.salePrice}" placeholder="0" />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 text-xs font-black">%</span>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-3">
          <label class="form-label required text-emerald-600 dark:text-emerald-400">Sotuv Narxi</label>
          <div class="relative group">
              <input v-model.number="model.salePrice" type="number" class="form-input pr-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/10 font-bold text-emerald-700 dark:text-emerald-400" :class="{'!border-rose-500': errors.salePrice}" placeholder="0" />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 text-xs font-black">UZS</span>
          </div>
        </div>

        <div class="col-span-12 sm:col-span-3">
          <label class="form-label">Boshlang'ich Qoldiq</label>
          <div class="relative">
              <input v-model.number="model.totalStock" type="number" class="form-input pr-12 text-center" placeholder="0" />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold uppercase">{{ model.unit || 'dona' }}</span>
          </div>
        </div>

        <div class="col-span-12">
            <label class="form-label">Qo'shimcha ma'lumot (Opsional)</label>
            <textarea v-model="model.description" rows="2" class="form-input resize-none" placeholder="Mahsulot haqida qisqacha..."></textarea>
        </div>

      </div>
    </div>

    <template #footer>
       <Button size="md" variant="secondary" left-icon="fa fa-xmark" @click="handleClose">Bekor qilish</Button>
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
.form-label { @apply block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide; }
.form-input { @apply w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none focus:bg-white dark:focus:bg-slate-950; }

/* Raqamli inputlarda strelkalarni yo'qotish */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>