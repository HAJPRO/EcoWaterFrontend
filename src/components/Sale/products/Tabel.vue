<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import moment from "moment-timezone";

// --- COMPONENTS ---
import DataTable from "../../../UI/DataTable.vue"; 
import AddProductModal from "../../../components/Sale/products/AddProductModal.vue";
import DetailProductModal from "../../../components/Sale/products/DetailProductModal.vue";

// --- STORE ---
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";
const store_products = ProductsManagmentStore();
const { products, all_length } = storeToRefs(store_products);

// --- 1. CONFIGURATION (Jadval Ustunlari) ---
const columns = [
  { key: 'code', label: 'Kodi', width: '140px', fixed: 'left', sortable: true },
  { key: 'pro_name', label: 'Nomi', width: '220px', sortable: true },
  { key: 'pro_category', label: 'Kategoriya', width: '180px' },
  // Vaqt ustunlari
  { key: 'productionStarteddAt', label: 'Boshlangan', width: '160px', align: 'center' },
  { key: 'productionStoppedAt', label: 'To\'xtatilgan', width: '160px', align: 'center' },
  
  { key: 'status', label: 'Holat', width: '120px', align: 'center' },
  { key: 'actions', label: '', width: '80px', fixed: 'right', align: 'center' }
];

// --- 2. STATE ---
// Qidiruv filtrlari
const filter = reactive({
  code: "",
  name: ""
});

const selectedIds = ref([]);
const activeDropdown = ref(null);
const isExportDropdownOpen = ref(false);
const currentPage = ref(1);

// --- 3. METHODS (ACTIONS) ---

// Ma'lumotlarni yuklash
const loadData = () => {
  // Store'dagi GetAll funksiyasiga filtrlarni yuborish kerak (agar API qo'llasa)
  store_products.GetAll({ 
    page: currentPage.value, 
    limit: 10,
    search: filter // Yoki alohida code/name parametrlari
  });
};

onMounted(() => {
  loadData();
});

// Qidiruvni kuzatish (Oddiy watch)
watch([() => filter.code, () => filter.name], () => {
  // Bu yerda debounce ishlatsa yaxshi bo'ladi
  currentPage.value = 1;
  loadData();
});

// Modallar
const openAddModal = () => {
  store_products.AddProductModal({
    title: `shakillantirish`,
    action: `create`,
  });
};

const handleExport = (type) => {
  // Export funksiyasini ulash
  isExportDropdownOpen.value = false;
  ElMessage.success(`${type.toUpperCase()} yuklanmoqda...`);
};

// Row Actions
const rowActions = [
  { 
    label: "Batafsil", 
    action: 'view', 
    icon: "fa-solid fa-eye", 
    colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
  },
  { 
    label: "O'zgartirish", 
    action: 'edit', 
    icon: "fa-solid fa-pen-to-square", 
    colorClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" 
  },
  { 
    label: "Excel", 
    action: 'excel', 
    icon: "fa-solid fa-file-excel", 
    colorClass: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
  },
  { 
    label: "O'chirish", 
    action: 'delete', 
    icon: "fa-solid fa-trash", 
    colorClass: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" 
  },
];

const handleAction = (actionName, row) => {
  activeDropdown.value = null;
  
  if (actionName === 'view') {
    store_products.DetailOrderModal({ id: row._id });
  } else if (actionName === 'edit') {
    store_products.AddProductModal({
      id: row._id,
      title: `o'zgartirish`,
      action: `update`,
    });
  } else if (actionName === 'excel') {
    // Excel export logic
    console.log("Excel export:", row._id);
  } else if (actionName === 'delete') {
    store_products.DeleteById({ id: row._id });
  }
};

// Utils
const formatDate = (date) => {
  if (!date) return "-";
  return moment.utc(date).tz("Asia/Tashkent").format("DD.MM.YYYY HH:mm:ss");
};

const handlePageChange = (page) => {
  currentPage.value = page;
  loadData();
};
</script>

<template>
  <AddProductModal />
  <DetailProductModal />

  <div class="h-screen flex flex-col gap-2 p-1 text-slate-700 dark:text-slate-300 font-sans overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
    
    <div class="flex-none flex flex-col sm:flex-row justify-between items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md z-10">
      
      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div class="relative w-full sm:w-48 group">
            <i class="fa-solid fa-qrcode absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
            <input 
              v-model="filter.code" 
              placeholder="Kodi bo'yicha..." 
              class="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
            >
          </div>

          <div class="relative w-full sm:w-64 group">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
            <input 
              v-model="filter.name" 
              placeholder="Nomi bo'yicha..." 
              class="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
            >
          </div>
      </div>

      <div class="flex gap-2 w-full sm:w-auto">
         <div class="relative">
            <button 
              @click.stop="isExportDropdownOpen = !isExportDropdownOpen" 
              class="btn-secondary w-full sm:w-auto group relative overflow-hidden"
              :class="{'border-indigo-500 ring-1 ring-indigo-500/20': isExportDropdownOpen}"
            >
              <span class="relative z-40 flex items-center">
                <i class="fa-solid fa-cloud-arrow-down mr-2.5 text-slate-400 group-hover:text-indigo-600 transition-colors text-lg"></i> 
                <span class="font-semibold text-slate-600 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">Export</span>
                <i class="fa-solid fa-chevron-down ml-2.5 text-[10px] text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-indigo-600': isExportDropdownOpen}"></i>
              </span>
            </button>
            
            <transition name="dropdown-zoom">
              <div 
                v-if="isExportDropdownOpen" 
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 z-40 overflow-hidden origin-top-right p-1"
              >
                 <button @click="handleExport('excel')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors text-xs font-medium text-slate-600 dark:text-slate-300">
                    <i class="fa-solid fa-file-excel text-emerald-500"></i> Excel
                 </button>
                 <button @click="handleExport('pdf')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors text-xs font-medium text-slate-600 dark:text-slate-300">
                    <i class="fa-solid fa-file-pdf text-rose-500"></i> PDF
                 </button>
                 <button @click="handleExport('word')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors text-xs font-medium text-slate-600 dark:text-slate-300">
                    <i class="fa-solid fa-file-word text-blue-500"></i> Word
                 </button>
              </div>
            </transition>
         </div>

         <button @click="openAddModal" class="btn-primary w-full sm:w-auto">
            <i class="fa-solid fa-plus mr-2"></i> Mahsulot qo'shish
         </button>
      </div>
    </div>

    <DataTable 
      :items="products" 
      :columns="columns" 
      v-model:selected="selectedIds"
    >
      <template #code="{ row }">
        <span class="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded cursor-pointer hover:underline hover:text-indigo-700" @click="console.log('Open detail')">
          <i class="fa-solid fa-qrcode mr-1 text-[10px]"></i>
          {{ row.code }}
        </span>
      </template>

      <template #pro_name="{ row }">
        <span class="font-medium text-slate-700 dark:text-slate-200 text-sm">
           {{ row.pro_name }}
        </span>
      </template>

      <template #pro_category="{ row }">
         <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{{ row.pro_category }}</span>
      </template>

      <template #productionStarteddAt="{ row }">
         <span class="text-[10px] text-slate-500 font-mono block">{{ formatDate(row.productionStarteddAt) }}</span>
      </template>
      <template #productionStoppedAt="{ row }">
         <span class="text-[10px] text-blue-500 font-mono block">{{ formatDate(row.productionStoppedAt) }}</span>
      </template>

      <template #status="{ row }">
        <div class="flex justify-center">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm flex items-center gap-1.5"
            :class="[
                row.status === 'Active'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            ]">
            <i :class="row.status === 'Active' ? 'fa-solid fa-circle-check' : 'fa-solid fa-hourglass-start'"></i>
            {{ row.status }}
            </span>
        </div>
      </template>

      <template #actions="{ row }">
        <div class="relative flex items-center justify-center">
          <button 
            @click.stop="activeDropdown = activeDropdown === row._id ? null : row._id" 
            class="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ease-out outline-none"
            :class="[
              activeDropdown === row._id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 transform scale-110' 
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200'
            ]"
          >
            <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
          </button>

          <transition name="dropdown-pop">
            <div 
              v-if="activeDropdown === row._id" 
              class="absolute right-10 top-1/2 -translate-y-1/2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 p-2 z-60 origin-right"
            >
              <div class="px-3 py-2 mb-1 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Amallar</span>
                  <button @click.stop="activeDropdown = null" class="text-slate-400 hover:text-rose-500"><i class="fa-solid fa-xmark text-xs"></i></button>
              </div>

              <div class="flex flex-col gap-1">
                <button 
                  v-for="(btn, index) in rowActions" 
                  :key="index" 
                  @click.stop="handleAction(btn.action, row)"
                  class="group w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <div 
                    class="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110"
                    :class="btn.colorClass"
                  >
                    <i :class="btn.icon" class="text-xs"></i>
                  </div>
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                    {{ btn.label }}
                  </span>
                </button>
              </div>
              <div class="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-t border-r border-slate-100 dark:border-slate-700 rotate-45"></div>
            </div>
          </transition>
        </div>
      </template>
    </DataTable>

 

  </div>
</template>

<style scoped>
.btn-primary { @apply bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center; }
.btn-secondary { @apply bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all flex items-center justify-center active:scale-95 shadow-sm; }
.no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Dropdown Animations */
.dropdown-scale-enter-active, .dropdown-scale-leave-active, 
.dropdown-pop-enter-active, .dropdown-pop-leave-active,
.dropdown-zoom-enter-active, .dropdown-zoom-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-pop-enter-from, .dropdown-pop-leave-to {
  opacity: 0; transform: translateY(-50%) scale(0.8) translateX(10px);
}
.dropdown-zoom-enter-from, .dropdown-zoom-leave-to {
  opacity: 0; transform: scale(0.95) translateY(-10px);
}
</style>