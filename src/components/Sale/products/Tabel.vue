<script setup>
import { ref, onMounted, onUnmounted, reactive, watch } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
// Moment kerak emas, chunki narx va sonni chiqaramiz
// import moment from "moment-timezone"; 

import Button from '../../../UI/Button.vue';
import ExportDropdown from '../../../UI/ExportDropdown.vue';
import DataTable from "../../../UI/DataTable.vue"; 
import AddProductModal from "../../../components/Sale/products/AddProductModal.vue";
import DetailProductModal from "../../../components/Sale/products/DetailProductModal.vue";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";

const store = ProductsManagmentStore();
// pagination va products ni olamiz
const { products, pagination } = storeToRefs(store);

// --- 1. CONFIGURATION (Yangi Modelga moslash) ---
const columns = [
  { key: 'code', label: 'Kodi', width: '140px', fixed: 'left', sortable: true },
  { key: 'name', label: 'Nomi', width: '220px', sortable: true }, // pro_name -> name
  { key: 'category', label: 'Kategoriya', width: '150px' }, // pro_category -> category
  { key: 'salePrice', label: 'Sotuv Narxi', width: '160px', align: 'right' }, // Yangi
  { key: 'totalStock', label: 'Jami Qoldiq', width: '160px', align: 'center' }, // Yangi
  { key: 'status', label: 'Holat', width: '120px', align: 'center' },
  { key: 'actions', label: '', width: '80px', fixed: 'right', align: 'center' }
];

// --- 2. STATE ---
const searchQuery = ref(""); // Qidiruv uchun yagona o'zgaruvchi
const selectedIds = ref([]);
const activeDropdown = ref(null);
const isExportDropdownOpen = ref(false);
const exportDropdownRef = ref(null);

// --- 3. CLICK OUTSIDE LOGIC (O'zgarishsiz) ---
const handleClickOutside = (event) => {
  if (isExportDropdownOpen.value && exportDropdownRef.value && !exportDropdownRef.value.contains(event.target)) {
    isExportDropdownOpen.value = false;
  }
  if (activeDropdown.value !== null) {
    const isClickInsideAction = event.target.closest('.row-action-wrapper');
    if (!isClickInsideAction) {
      activeDropdown.value = null;
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // Dastlabki yuklash
  store.GetAll();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// --- METHODS ---

// Qidiruvni kuzatish (Debounce qilish tavsiya etiladi, lekin hozircha oddiy watch)
watch(searchQuery, (val) => {
  store.setSearch(val);
});

const openAddModal = () => {
  store.openAddModal(); // Store ichidagi methodni chaqiramiz
};

const handleExport = (type) => {
  isExportDropdownOpen.value = false;
  ElMessage.success(`${type.toUpperCase()} yuklanmoqda...`);
};

// Actions Konfiguratsiyasi
const rowActions = [
  { label: "Batafsil", action: 'view', icon: "fa-solid fa-eye", colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { label: "O'zgartirish", action: 'edit', icon: "fa-solid fa-pen-to-square", colorClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { label: "Excel", action: 'excel', icon: "fa-solid fa-file-excel", colorClass: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  { label: "O'chirish", action: 'delete', icon: "fa-solid fa-trash", colorClass: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
];

const handleAction = (actionName, row) => {
  activeDropdown.value = null;
  
  if (actionName === 'view') {
    store.GetOne(row._id); // Detal modalni store ichida ochadi yoki state yangilaydi
  } else if (actionName === 'edit') {
    store.openEditModal(row._id);
  } else if (actionName === 'excel') {
    console.log("Excel export:", row._id);
  } else if (actionName === 'delete') {
    store.DeleteById(row._id);
  }
};

// Formatlash yordamchilari
const formatPrice = (value) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(value);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat('uz-UZ').format(value);
};
</script>

<template>
  <AddProductModal />
  <DetailProductModal />

  <div class="h-screen flex flex-col gap-2 p-1 text-slate-700 dark:text-slate-300 font-sans overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
    
    <div class="flex-none flex flex-col sm:flex-row justify-between items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md z-10">
      
      <div class="relative w-full sm:w-72 group">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
        <input 
          v-model="searchQuery" 
          placeholder="Nomi yoki kodi orqali izlash..." 
          class="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
        >
      </div>

      <div class="flex gap-2 w-full sm:w-auto">
       <ExportDropdown @select="handleExport" />

        <Button 
          @click="openAddModal"
          variant="primary" 
          size="sm" 
          left-icon="fa-solid fa-plus"
        >
          Qo'shish
        </Button>
      </div>
    </div>

    <DataTable 
      :items="products" 
      :columns="columns" 
      v-model:selected="selectedIds"
    >
      <template #code="{ row }">
        <span class="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded cursor-pointer hover:underline hover:text-indigo-700">
          <i class="fa-solid fa-qrcode mr-1 text-[10px]"></i>
          {{ row.code }}
        </span>
      </template>

      <template #name="{ row }">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded bg-slate-100 flex-shrink-0 overflow-hidden">
                <img :src="row.image || 'https://via.placeholder.com/40'" class="w-full h-full object-cover">
            </div>
            <span class="font-medium text-slate-700 dark:text-slate-200 text-sm leading-tight line-clamp-2">{{ row.name }}</span>
        </div>
      </template>

      <template #category="{ row }">
         <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">{{ row.category }}</span>
      </template>

      <template #salePrice="{ row }">
         <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded block text-right">
             {{ formatPrice(row.salePrice) }}
         </span>
      </template>

      <template #totalStock="{ row }">
         <div class="flex flex-col items-center">
             <span class="text-xs font-black text-slate-700 dark:text-white">{{ formatNumber(row.totalStock) }}</span>
             <span class="text-[9px] text-slate-400 uppercase">{{ row.unit }}</span>
         </div>
      </template>

      <template #status="{ row }">
        <div class="flex justify-center">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm flex items-center gap-1.5"
            :class="[
                row.status === 'active'
                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
            ]">
            <i :class="row.status === 'active' ? 'fa-solid fa-circle-check' : 'fa-solid fa-archive'"></i>
            {{ row.status === 'active' ? 'Aktiv' : 'Arxiv' }}
            </span>
        </div>
      </template>

      <template #actions="{ row }">
        <div class="relative flex items-center justify-center row-action-wrapper">
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
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110" :class="btn.colorClass">
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
/* Button styles */
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