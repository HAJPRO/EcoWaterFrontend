<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import moment from "moment-timezone";

// --- COMPONENTS ---
import DataTable from "../../../UI/DataTable.vue"; 
import AddProductModal from "../../../components/Warehouses/ReadyWarehouse/AddProductModal.vue";
import DetailModal from "../../../components/Warehouses/ReadyWarehouse/DetailModal.vue";
import ExportDropdown from "../../../UI/ExportDropdown.vue";
import Button from "../../../UI/Button.vue";
import Select from "../../../UI/Select.vue";

// --- STORE ---
import { ReadyWarehouseStore } from "../../../stores/Warehouses/r-warehouse/warehouse.store";
import { WarehouseInputStore } from "../../../stores/Warehouses/input/input.store";
const store_rw = ReadyWarehouseStore();
const store_input = WarehouseInputStore();
const { products, isActive } = storeToRefs(store_rw);
// --- STATE ---
const searchText = ref('');
const selectedIds = ref([]);
const activeDropdown = ref(null);
const currentPage = ref(1);

// Filtrlar holati
const isFilterVisible = ref(false);
const isDateDropdownOpen = ref(false);
const dateDropdownRef = ref(null);

const filters = ref({
  manufacturer: '',
  status: '',
  startDate: '',
  endDate: ''
});

// --- CONFIGURATION ---
const columns = [
  { key: 'partyNumber', label: 'Faktura №', width: '200px', fixed: 'left', sortable: true },
  
  { key: 'branchId', label: 'Zavod', width: '150px', align: 'center' },
  { key: 'supplierId', label: 'Yetkazib beruvchi', width: '150px', align: 'center' },
  { key: 'supplierId', label: 'Qabul qiluvchi', width: '150px', align: 'center' },
  { key: 'totalAmount', label: 'Jami Summa', width: '150px', align: 'right', sortable: true },
  { key: 'date', label: 'Kirim Sanasi', width: '180px', align: 'center' },
  { key: 'note', label: 'Izoh', width: '200px' },
  { key: 'actions', label: '', width: '80px', fixed: 'right', align: 'center' }
];

const statusOptions = [
  { label: 'Sotuvda', value: 'active', icon: 'fa-solid fa-circle-check text-emerald-500' },
  { label: 'Tugagan', value: 'finished', icon: 'fa-solid fa-hourglass-end text-rose-500' },
];

const rowActions = [
  { label: "Batafsil", action: 'view', icon: "fa-solid fa-eye", colorClass: "text-indigo-500 bg-indigo-50" },
  { label: "Tahrir", action: 'edit', icon: "fa-solid fa-pen", colorClass: "text-amber-500 bg-amber-50" },
  { label: "O'chirish", action: 'delete', icon: "fa-solid fa-trash", colorClass: "text-rose-500 bg-rose-50" },
];

// --- COMPUTED ---
const manufacturerOptions = computed(() => {
  const map = new Map();
  products.value.forEach(p => {
    const mName = typeof p.product === 'object' ? p.product.manufacturer : p.manufacturer;
    if (mName) map.set(mName, { label: mName, value: mName });
  });
  return Array.from(map.values());
});

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const productName = typeof p.product === 'object' ? p.product.name : p.product;
    const matchesSearch = !searchText.value || 
      p.partyNumber?.toLowerCase().includes(searchText.value.toLowerCase()) ||
      productName?.toLowerCase().includes(searchText.value.toLowerCase());

    const mName = typeof p.product === 'object' ? p.product.manufacturer : p.manufacturer;
    const matchesMan = !filters.value.manufacturer || mName === filters.value.manufacturer;

    let matchesStatus = true;
    if (filters.value.status) {
      const isSoldOut = p.totalRemainderPrice === 0 || p.status === 'sold_out';
      matchesStatus = filters.value.status === 'finished' ? isSoldOut : !isSoldOut;
    }

    let matchesDate = true;
    if (filters.value.startDate || filters.value.endDate) {
      const pDate = new Date(p.receivedDate || p.createdAt);
      if (filters.value.startDate && pDate < new Date(filters.value.startDate)) matchesDate = false;
      if (filters.value.endDate) {
        const end = new Date(filters.value.endDate);
        end.setHours(23, 59, 59);
        if (pDate > end) matchesDate = false;
      }
    }
    return matchesSearch && matchesMan && matchesStatus && matchesDate;
  });
});

// --- METHODS ---
const loadData = () => {
  store_rw.GetAll({ status: isActive.value, page: currentPage.value, limit: 15 });
};

// DIQQAT: handleAction faqat bir marta e'lon qilinishi kerak
const handleAction = (actionName, row) => {
  activeDropdown.value = null; 
  if (actionName === 'view') store_rw.DetailModal(row._id);
  else if (actionName === 'edit') store_rw.UpdateModal({ id: row._id });
  else if (actionName === 'delete') store_rw.DeleteById({ id: row._id, action: 4 });
};

const handleExport = (type) => {
  ElMessage.success(`${type.toUpperCase()} yuklanmoqda...`);
};

const resetFilters = () => {
  filters.value = { manufacturer: '', status: '', startDate: '', endDate: '' };
};

const setShortcutDate = (type) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  if (type === 'today') {
    filters.value.startDate = today;
    filters.value.endDate = today;
  } else if (type === 'week') {
    const start = new Date();
    start.setDate(now.getDate() - 7);
    filters.value.startDate = start.toISOString().split('T')[0];
    filters.value.endDate = today;
  }
};

const formatPrice = (p) => p ? new Intl.NumberFormat("uz-UZ").format(p) : '0';
const formatDate = (d) => d ? moment.utc(d).tz("Asia/Tashkent").format("DD.MM.YYYY HH:mm") : "-";

onMounted(() => {
  // store_rw.GetAll({status :"", page:1})
  loadData();
  document.addEventListener('click', (e) => {
    if (dateDropdownRef.value && !dateDropdownRef.value.contains(e.target)) isDateDropdownOpen.value = false;
  });
});
</script>

<template>
  <AddProductModal />
  <DetailModal />

  <div class="h-screen flex flex-col gap-2 p-1 font-sans no-scrollbar bg-slate-50 dark:bg-slate-900/50">
    
    <div class="flex-none flex flex-col sm:flex-row justify-between items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm relative z-30">
      <div class="flex items-center gap-2 w-full sm:w-auto text-slate-700 dark:text-slate-300">
        <div class="relative w-full sm:w-72 group">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
          <input v-model="searchText" placeholder="Izlash..." class="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none">
        </div>
        <button @click="isFilterVisible = !isFilterVisible" 
          :class="isFilterVisible ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-600 border-slate-200'"
          class="flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold transition-all shadow-sm">
          <i class="fa-solid fa-filter"></i>
          <span class="hidden sm:inline">Filtr</span>
        </button>
      </div>

      <div class="flex gap-2 w-full sm:w-auto">
        <ExportDropdown @select="handleExport" />
        <Button size="sm" variant="primary" left-icon="fa-solid fa-plus" @click="store_rw.AddProductModal({ title: 'Kirm qilish', action: 'create' })">Kirm qilish</Button>
      </div>
    </div>

    <transition name="filter-slide">
      <div v-if="isFilterVisible" class="flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 mb-2 shadow-xl relative overflow-visible z-20">
        <div class="absolute top-6 left-0 w-1.5 h-10 bg-indigo-600 rounded-r-full"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
          <div class="lg:col-span-3">
            <Select v-model="filters.manufacturer" :options="manufacturerOptions" label="Ishlab chiqaruvchi" placeholder="Barchasi" searchable clearable />
          </div>
          <div class="lg:col-span-3">
            <Select v-model="filters.status" :options="statusOptions" label="Holati" placeholder="Barchasi" iconKey="icon" clearable />
          </div>
          <div class="sm:col-span-2 lg:col-span-6 flex flex-col gap-2 relative mt-1" ref="dateDropdownRef">
            <label class="text-[10px] font-black text-slate-400 dark:text-slate-500  tracking-widest ml-1">Vaqt oralig'i</label>
            <div class="flex items-center gap-2">
              <div @click.stop="isDateDropdownOpen = !isDateDropdownOpen"
                class="flex-1 flex items-center justify-between px-4 h-[42px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer">
                <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                  {{ filters.startDate || '...' }} — {{ filters.endDate || '...' }}
                </span>
                <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform" :class="{'rotate-180': isDateDropdownOpen}"></i>
              </div>
              <button v-if="filters.startDate || filters.endDate" @click="resetFilters" class="w-10 h-[42px] flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white border border-rose-100 transition-all">
                <i class="fa-solid fa-arrow-rotate-left text-xs"></i>
              </button>
            </div>
            <transition name="dropdown-pop">
              <div v-if="isDateDropdownOpen" class="absolute top-full left-0 mt-2 w-full min-w-[300px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-[100] p-4">
                <div class="flex flex-col gap-4">
                  <div class="flex gap-2">
                    <button @click="setShortcutDate('today')" class="shortcut-tag">Bugun</button>
                    <button @click="setShortcutDate('week')" class="shortcut-tag">Hafta</button>
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                    <input type="date" v-model="filters.startDate" class="date-input-field">
                    <input type="date" v-model="filters.endDate" class="date-input-field">
                  </div>
                  <button @click="isDateDropdownOpen = false" class="w-full py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase">Tayyor</button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>

 <DataTable :items="filteredProducts" :columns="columns" v-model:selected="selectedIds" class="modern-table">
  
  <template #partyNumber="{ row }">
    <div class="flex items-center gap-3 py-1">
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
          <span class="font-black text-slate-800 dark:text-slate-100 tracking-tight text-sm uppercase">
            {{ row.partyNumber }}
          </span>
        </div>
        <span class="text-[9px] text-slate-400 font-mono tracking-widest uppercase pl-3.5">
          ID: {{ row._id.slice(-6) }}
        </span>
      </div>
    </div>
  </template>

  <template #branchId="{ row }">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700">
        <i class="fa-solid fa-industry text-[11px]"></i>
      </div>
      <div class="flex flex-col">
        <span class="text-[11px] font-black text-slate-700 dark:text-slate-200 leading-tight">
          {{ row.branchId || 'Asosiy Baza' }}
        </span>
        <span class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Zavod/Filial</span>
      </div>
    </div>
  </template>

  <template #supplierId="{ row }">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-500/20 w-fit">
        <i class="fa-solid fa-truck-fast text-[10px]"></i>
        <span class="text-[10px] font-black tracking-tight">{{ row.supplierId || 'Markaziy Sklad' }}</span>
      </div>
      <span class="text-[9px] text-slate-400 font-medium italic pl-1 flex items-center gap-1">
        <i class="fa-solid fa-circle-check text-[8px] text-emerald-500"></i>
        Logistika tasdiqlangan
      </span>
    </div>
  </template>

  <template #totalAmount="{ row }">
    <div class="flex flex-col items-end group pr-4">
      <div class="flex items-baseline gap-1.5">
        <span class="text-[14px] font-black font-mono text-emerald-600 dark:text-emerald-400">
          {{ formatPrice(row.totalAmount) }}
        </span>
        <span class="text-[8px] font-black text-slate-400 uppercase">uzs</span>
      </div>
      <div class="h-[1.5px] w-8 bg-emerald-500/30 rounded-full group-hover:w-full transition-all duration-500"></div>
    </div>
  </template>

  <template #date="{ row }">
    <div class="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 min-w-[110px]">
      <span class="text-[11px] font-black text-slate-700 dark:text-slate-200">
        {{ formatDate(row.date).split(' ')[0] }}
      </span>
      <div class="flex items-center gap-1.5 mt-1 text-indigo-500">
        <i class="fa-regular fa-clock text-[10px]"></i>
        <span class="text-[10px] font-mono font-bold tracking-tighter">
          {{ formatDate(row.date).split(' ')[1] }}
        </span>
      </div>
    </div>
  </template>

  <template #note="{ row }">
    <div class="max-w-[200px]">
      <p class="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 leading-relaxed">
        {{ row.note || '---' }}
      </p>
    </div>
  </template>

   <template #actions="{ row }">
        <div class="flex justify-center items-center h-full">
          <el-dropdown trigger="click" placement="bottom-end">
            <button class="action-btn-modern group">
              <i class="fa-solid fa-ellipsis-h transition-transform duration-300 group-hover:rotate-90"></i>
            </button>

            <template #dropdown>
              <div class="modern-menu-container">
                <div class="menu-header">
                  <span class="title">Amallar: №{{ row.partyNumber }}</span>
                </div>
                <div class="p-1.5 space-y-1">
                  <el-dropdown-item 
                    v-for="btn in rowActions" 
                    :key="btn.action" 
                    @click="handleAction(btn.action, row)" 
                    class="modern-item group/item"
                  >
                    <div class="item-icon transition-all duration-300 shadow-sm" :class="btn.colorClass">
                      <i :class="btn.icon"></i>
                    </div>
                    <span class="label">{{ btn.label }}</span>
                  </el-dropdown-item>
                </div>
              </div>
            </template>
          </el-dropdown>
        </div>
      </template>
</DataTable>
  </div>
</template>

<style scoped>
/* --- TRANSITIONS & ANIMATIONS --- */
.filter-slide-enter-active, 
.filter-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 400px;
  opacity: 1;
}

.filter-slide-enter-from, 
.filter-slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes menu-pop {
  0% { opacity: 0; transform: scale(0.95) translateY(-10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* --- ACTION BUTTON (TRIGGER) --- */
.action-btn-modern {
  @apply w-8 h-8 flex items-center justify-center rounded-lg 
         bg-transparent text-slate-400 border border-transparent
         transition-all duration-200 outline-none;
}

.action-btn-modern:hover {
  @apply bg-slate-100 dark:bg-slate-800 text-indigo-600 border-slate-200 dark:border-slate-700;
}

/* --- DROPDOWN CONTAINER --- */
.modern-menu-container {
  @apply bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800
         shadow-[0_12px_30px_-10px_rgba(0,0,0,0.15)] rounded-xl min-w-[180px] 
         overflow-hidden py-1;
  animation: menu-pop 0.2s ease-out;
}

.menu-header {
  @apply px-4 py-2 border-b border-slate-100 dark:border-slate-800 
         bg-slate-50/50 dark:bg-slate-900/50 mb-1;
}

.menu-header .title {
  @apply text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center;
}

/* --- MENU ITEMS --- */
.modern-item {
  @apply flex items-center gap-3 px-3 py-2 mx-1 rounded-lg
         transition-colors duration-150 cursor-pointer !important;
}

.item-icon {
  @apply w-7 h-7 flex items-center justify-center rounded-md 
         text-xs transition-colors duration-200 bg-slate-50 dark:bg-slate-800;
}

.modern-item .label {
  @apply text-xs font-semibold text-slate-600 dark:text-slate-300;
}

/* --- HOVER STATES (Clean & Minimal) --- */
.modern-item:hover {
  @apply bg-slate-100 dark:bg-slate-800 !important;
}

.modern-item:hover .label {
  @apply text-slate-900 dark:text-white;
}

/* Hoverda ikonkalarga rang berish (Faqat ikonkaning o'ziga) */
.modern-item:hover .bg-indigo-50 { @apply text-indigo-600 bg-indigo-100; }
.modern-item:hover .bg-amber-50 { @apply text-amber-600 bg-amber-100; }
.modern-item:hover .bg-rose-50 { @apply text-rose-600 bg-rose-100; }

/* --- FILTER & SHORTCUT ELEMENTS --- */
.shortcut-tag {
  @apply px-3 py-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 
         dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700
         hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all;
}

.date-input-field {
  @apply bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 
         rounded-xl px-3 py-2 text-xs font-medium outline-none 
         focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all;
}

/* --- UTILITIES --- */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

:deep(.el-dropdown-menu) {
  @apply p-0 border-none bg-transparent shadow-none !important;
}

:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: transparent !important;
}
</style>

