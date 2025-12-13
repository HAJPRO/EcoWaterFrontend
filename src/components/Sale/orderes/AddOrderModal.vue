<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ElMessage } from "element-plus"; // Faqat xabarlar (Toast) uchun

// --- STORES ---
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
import { OrderManagmentStore } from "../../../stores/Sale/orders/orders.store";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";

// --- CUSTOM UI COMPONENTS ---
import BaseModal from "../../../UI/Modal.vue";
import BaseSelect from "../../../UI/Select.vue";
import Button from "../../../UI/Button.vue";
import AddCustomerModal from "../../Customers/customerManagment/AddCustomModal.vue";

const store_customers = CustomerManagmentStore();
const store_orders = OrderManagmentStore();
const store_products = ProductsManagmentStore();

const { custom_modal, customers } = storeToRefs(store_customers);
const { order_modal, model } = storeToRefs(store_orders);
const { products: productsOptions } = storeToRefs(store_products);

// --- STATE ---
const localProducts = ref([]); 
const currentPackings = ref([]); 
const errors = reactive({});

// Static options
const units = ref([
  { id: 1, name: "Dona" },
  { id: 2, name: "Blok" },
]);

// --- COMPUTED ---
const currentLineTotal = computed(() => {
  const qty = Number(model.value.product.pro_quantity) || 0;
  const price = Number(model.value.product.pro_price) || 0;
  return qty * price;
});

const grandTotal = computed(() => {
  return localProducts.value.reduce((sum, item) => sum + item.pro_total_price, 0);
});

const selectedCustomerInfo = computed(() => {
  if (!model.value.fullname) return null;
  return customers.value.find(c => c._id === model.value.fullname);
});

// --- HELPERS ---
const formatPrice = (price) => {
  if (!price && price !== 0) return "0";
  return new Intl.NumberFormat("uz-UZ").format(price);
};

// --- LOGIC ---
const handleClose = () => {
  store_orders.order_modal = false;
  localProducts.value = [];
  errors.value = {};
  model.value.product = { pro_quantity: "", pro_price: "" };
  model.value.fullname = "";
};

const handleAddCustomer = () => {
  store_customers.AddCustomModal();
};

const handleProductChange = (proName) => {
  const selected = productsOptions.value.find(p => p.pro_name === proName);
  if (selected) {
    model.value.product.pro_name = proName;
    currentPackings.value = selected.products || [];
    model.value.product.packingType = "";
    model.value.product.pro_unit = "";
    model.value.product.pro_price = "";
  }
};

const handleUnitChange = (unit) => {
  model.value.product.pro_unit = unit;
  const packingObj = currentPackings.value.find(p => p.packingType === model.value.product.packingType);
  if (packingObj) {
    if (unit === 'Blok') {
      model.value.product.pro_price = packingObj.block_buying_price;
    } else {
      model.value.product.pro_price = packingObj.buying_price;
    }
  }
};

const addToTable = () => {
  const p = model.value.product;
  if (model.value.fullname) { ElMessage.warning("Avval mijozni tanlang!"); return; }
  if (!p.pro_name || !p.packingType || !p.pro_unit || !p.pro_quantity) {
    ElMessage.warning("Mahsulot ma'lumotlarini to'liq kiriting!");
    return;
  }

  localProducts.value.push({
    id: uuidv4(),
    pro_name: p.pro_name,
    packingType: p.packingType,
    pro_unit: p.pro_unit,
    pro_quantity: Number(p.pro_quantity),
    pro_price: Number(p.pro_price),
    pro_total_price: currentLineTotal.value
  });

  model.value.product.pro_quantity = "";
};

const removeFromTable = (id) => {
  localProducts.value = localProducts.value.filter(i => i.id !== id);
};

const saveOrder = () => {
  if (localProducts.value.length === 0) {
    ElMessage.error("Buyurtma ro'yxati bo'sh!");
    return;
  }
  store_orders.Create({
    products: localProducts.value,
    customerId: model.value.fullname,
    totalAmount: grandTotal.value,
  });
  handleClose();
};

onMounted(() => {
  store_products.GetAll({ status: 0 });
});
</script>

<template>
  <AddCustomerModal v-if="custom_modal" />

  <BaseModal
    v-model="order_modal"
    title="Buyurtma yaratish"
    subtitle="Yangi savdo amaliyoti"
    icon="fa-solid fa-cart-shopping"
    width="max-w-6xl"
    @close="handleClose"
  >
    
    <div class="relative z-50 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <div class="grid grid-cols-12 gap-6 items-start">
        <div class="col-span-12 md:col-span-12 lg:col-span-12">
          <label class="form-label required">Mijoz (F.I.O)</label>
          <BaseSelect
            v-model="model.fullname"
            :options="customers"
            labelKey="fullname"
            valueKey="_id"
            placeholder="Mijozni qidiring..."
            searchable
            allowAdd
            @add="handleAddCustomer"
          />
        </div>

        <div v-if="selectedCustomerInfo" class="col-span-12 md:col-span-7 lg:col-span-8">
          <div class="flex flex-wrap gap-4 pt-6 text-sm text-slate-600 dark:text-slate-400">
             <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-600">
                <i class="fa-solid fa-phone text-indigo-500"></i>
                <span>{{ selectedCustomerInfo.phoneNumber || 'Tel yo\'q' }}</span>
             </div>
             <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-600">
                <i class="fa-solid fa-location-dot text-indigo-500"></i>
                <span>{{ selectedCustomerInfo.address?.region || '-' }}</span>
             </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-40 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6 overflow-visible">
      
      <h4 class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-4 flex items-center gap-2">
        <i class="fa-solid fa-plus-circle"></i> Mahsulot qo'shish
      </h4>
      
      <div class="grid grid-cols-12 gap-4 items-end relative">
        
        <div class="col-span-12 sm:col-span-6 lg:col-span-3">
          <label class="form-label required">Mahsulot</label>
          <BaseSelect
            v-model="model.product.pro_name"
            :options="productsOptions"
            labelKey="pro_name"
            valueKey="pro_name"
            placeholder="Tanlang..."
            searchable
            @update:modelValue="handleProductChange"
          />
        </div>

        <div class="col-span-12 sm:col-span-6 lg:col-span-2">
          <label class="form-label required">Qadoq</label>
          <BaseSelect
            v-model="model.product.packingType"
            :options="currentPackings"
            labelKey="packingType"
            valueKey="packingType"
            placeholder="..."
          />
        </div>

        <div class="col-span-12 sm:col-span-6 lg:col-span-2">
          <label class="form-label required">Birlik</label>
          <BaseSelect
            v-model="model.product.pro_unit"
            :options="units"
            labelKey="name"
            valueKey="name"
            placeholder="..."
            @update:modelValue="handleUnitChange"
          />
        </div>

        <div class="col-span-12 sm:col-span-6 lg:col-span-2">
          <label class="form-label required">Miqdor</label>
          <input 
            v-model="model.product.pro_quantity" 
            type="number" 
            class="form-input" 
            placeholder="0"
          />
        </div>

        <div class="col-span-12 sm:col-span-6 lg:col-span-2">
          <label class="form-label required">Narx</label>
          <div class="relative">
             <input 
               v-model="model.product.pro_price" 
               type="number" 
               class="form-input pr-10" 
               placeholder="0"
             />
             <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">so'm</span>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-1">
          <button 
            @click="addToTable"
            class="w-full h-[42px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 active:scale-95 transition-all flex items-center justify-center"
          >
            <i class="fa-solid fa-arrow-down text-lg"></i>
          </button>
        </div>
      </div>

      <div class="flex justify-end mt-2 text-xs">
         <span class="text-slate-500">Joriy qator summasi:</span>
         <span class="ml-2 font-bold text-indigo-600">{{ formatPrice(currentLineTotal) }} so'm</span>
      </div>
    </div>

    <div class="relative z-30 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
      <table class="w-full text-sm text-left">
        <thead class="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 font-bold uppercase text-[11px] tracking-wider">
          <tr>
            <th class="px-4 py-3 w-10 text-center">#</th>
            <th class="px-4 py-3">Mahsulot</th>
            <th class="px-4 py-3">Qadoq</th>
            <th class="px-4 py-3 text-right">Miqdor</th>
            <th class="px-4 py-3 text-right">Narx</th>
            <th class="px-4 py-3 text-right">Jami</th>
            <th class="px-4 py-3 w-12 text-center"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr v-if="localProducts.length === 0">
            <td colspan="7" class="px-4 py-12 text-center text-slate-400 italic">Savat bo'sh</td>
          </tr>
          <tr v-for="(item, index) in localProducts" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
            <td class="px-4 py-3 text-center text-slate-400 text-xs">{{ index + 1 }}</td>
            <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">{{ item.pro_name }}</td>
            <td class="px-4 py-3 text-slate-500 text-xs">{{ item.packingType }}</td>
            <td class="px-4 py-3 text-right">
              <span class="font-bold text-slate-700 dark:text-slate-200">{{ item.pro_quantity }}</span> 
              <span class="text-xs text-slate-400 ml-1">{{ item.pro_unit }}</span>
            </td>
            <td class="px-4 py-3 text-right text-slate-600 font-mono text-xs">{{ formatPrice(item.pro_price) }}</td>
            <td class="px-4 py-3 text-right font-bold text-emerald-600 font-mono">{{ formatPrice(item.pro_total_price) }}</td>
            <td class="px-4 py-3 text-center">
              <button @click="removeFromTable(item.id)" class="text-slate-400 hover:text-rose-500 transition-colors">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="localProducts.length > 0" class="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
           <tr>
             <td colspan="5" class="px-4 py-3 text-right font-bold uppercase text-xs tracking-wider">Umumiy Summa:</td>
             <td class="px-4 py-3 text-right font-extrabold text-indigo-600 text-lg">{{ formatPrice(grandTotal) }} so'm</td>
             <td></td>
           </tr>
        </tfoot>
      </table>
    </div>

    <div class="h-40"></div>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-xs text-slate-400">Jami {{ localProducts.length }} ta mahsulot</div>
        <div class="flex gap-3">
          <Button variant="danger" left-icon="fa-solid fa-xmark" @click="handleClose">Bekor qilish</Button>
          <Button variant="primary" left-icon="fa-solid fa-check" @click="saveOrder">Tasdiqlash</Button>
        </div>
      </div>
    </template>

  </BaseModal>
</template>

<style scoped>
.required::after { content: " *"; @apply text-rose-500; }
.form-label { @apply block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide; }
.form-input { @apply w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none; }
</style>