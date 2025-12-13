<script setup>
  import AddOrderModal from './AddOrderModal.vue';
import { ref, computed, shallowRef } from 'vue';
import { ElMessage } from 'element-plus'; // Faqat xabarlar uchun
import { storeToRefs } from 'pinia';
import { OrderManagmentStore } from '../../../stores/Sale/orders/orders.store'; // Agar Store ishlatilsa

// --- UI COMPONENTS ---
import DataTable from '../../../UI/DataTable.vue';
import Button from '../../../UI/Button.vue';
import ExportDropdown from '../../../UI/ExportDropdown.vue';

const store_orders = OrderManagmentStore();
const openAddModal = () => {
  store_orders.AddOrderModal({ title: `shakillantirish`, action: `create` }) 
};

// --- 1. CONFIGURATION (Jadval Ustunlari) ---
const columns = [
  { key: 'order_number', label: 'Buyurtma', width: '140px', fixed: 'left', sortable: true },
  { key: 'customer.name', label: 'Mijoz', width: '200px', sortable: true },
  { key: 'region', label: 'Hudud', width: '140px' },
  { key: 'payment_method', label: 'To\'lov', width: '130px', align: 'center' },
  { key: 'driver', label: 'Haydovchi', width: '140px' },
  { key: 'weight', label: 'Og\'irlik', width: '110px', align: 'center' },
  { key: 'createdAt', label: 'Vaqt', width: '150px', align: 'center', sortable: true },
  { key: 'total_amount', label: 'Summa', width: '150px', align: 'right', sortable: true },
  { key: 'status', label: 'Holat', width: '150px', align: 'center' },
  { key: 'actions', label: '', width: '70px', fixed: 'right', align: 'center' }
];

// --- 2. DATA (MOCK DATA) ---
// Haqiqiy loyihada bu Store dan keladi
const orders = shallowRef(Array.from({ length: 40 }).map((_, i) => ({
  id: i + 1,
  order_number: `ORD-${7829 + i}`,
  customer: { 
    artikul: `A${101 + i}`, 
    name: ['Ali Valiyev', 'Vali Ganiyev', 'Sardor Komilov', 'Dildora Alimova', 'Jasur Rahimov'][i % 5],
    phone: `+998 90 123 45 ${String(i).padStart(2, '0')}`
  },
  region: ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Xorazm'][i % 5],
  payment_method: ['Naqd', 'Payme', 'Click', 'Pul o\'tkazish'][i % 4],
  driver: ['Hasan', 'Husan', 'Botir', 'Sobir'][i % 4],
  weight: `${(Math.random() * 10 + 1).toFixed(1)} kg`,
  createdAt: '2025-11-10 14:30',
  total_amount: (Math.floor(Math.random() * 20) + 5) * 100000,
  status: ['Yangi', 'Yetkazib berilmoqda', 'Yetkazib berildi', 'Bekor qilingan', 'Arxiv'][i % 5]
})));

// --- 3. STATE ---
const searchText = ref('');
const selectedIds = ref([]);
const activeDropdown = ref(null); // Qaysi qatorning menyusi ochiq

// --- COMPUTED (FILTER) ---
const filteredItems = computed(() => {
  const s = searchText.value.toLowerCase();
  if (!s) return orders.value;
  return orders.value.filter(o => 
    o.order_number.toLowerCase().includes(s) || 
    o.customer.name.toLowerCase().includes(s)
  );
});

// --- UTILS ---
const formatPrice = (p) => new Intl.NumberFormat('uz-UZ').format(p);

const getStatusBadge = (status) => {
  const styles = {
    'Yangi': 'bg-emerald-50 text-emerald-700 border-emerald-200 icon-emerald',
    'Yetkazib berilmoqda': 'bg-amber-50 text-amber-700 border-amber-200 icon-amber',
    'Yetkazib berildi': 'bg-blue-50 text-blue-700 border-blue-200 icon-blue',
    'Arxiv': 'bg-slate-50 text-slate-600 border-slate-200 icon-slate',
    'Bekor qilingan': 'bg-rose-50 text-rose-700 border-rose-200 icon-rose',
  };
  return styles[status] || 'bg-gray-50 text-gray-600 border-gray-200';
};

const getStatusIcon = (status) => {
  const icons = {
    'Yangi': 'fa-solid fa-circle-check',
    'Yetkazib berilmoqda': 'fa-solid fa-truck-fast',
    'Yetkazib berildi': 'fa-solid fa-box-open',
    'Arxiv': 'fa-solid fa-box-archive',
    'Bekor qilingan': 'fa-solid fa-ban',
  };
  return icons[status] || 'fa-solid fa-circle';
};

// --- ACTIONS ---
const rowActions = [
  { label: "Ko'rish", action: 'view', icon: "fa-solid fa-eye", colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { label: "Tahrirlash", action: 'edit', icon: "fa-solid fa-pen-to-square", colorClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { label: "O'chirish", action: 'delete', icon: "fa-solid fa-trash-can", colorClass: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
];

const handleAction = (actionName, row) => {
  activeDropdown.value = null; // Menyuni yopish
  if(actionName === 'delete') {
    ElMessage.error(`Buyurtma ${row.order_number} o'chirildi`);
  } else {
    ElMessage.info(`${actionName}: ${row.order_number}`);
  }
};

const handleExport = (type) => {
  ElMessage.success(`${type.toUpperCase()} eksport qilinmoqda...`);
};


</script>

<template>
  <AddOrderModal />
  <div class="h-screen flex flex-col gap-2 p-1 text-slate-700 dark:text-slate-300 font-sans overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
    
    <div class="flex-none flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm transition-all z-10">
      
      <div class="relative w-full sm:w-72 group">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
        <input 
          v-model="searchText" 
          placeholder="Qidiruv (ID, Mijoz)..." 
          class="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm placeholder:text-slate-400"
        >
      </div>

      <div class="flex gap-2 w-full sm:w-auto">
        
        <ExportDropdown @select="handleExport" />

        <Button 
        size="sm"
          variant="primary" 
          left-icon="fa-solid fa-plus"
          @click="openAddModal()"
        >
          Buyurtma
        </Button>
      </div>
    </div>

    <DataTable 
      :items="filteredItems" 
      :columns="columns" 
      v-model:selected="selectedIds"
    >
      <template #order_number="{ row }">
        <span class="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800">
          {{ row.order_number }}
        </span>
      </template>

      <template #customer.name="{ row }">
        <div class="flex flex-col">
          <span class="font-semibold text-slate-700 dark:text-slate-200 text-sm leading-tight">{{ row.customer.name }}</span>
          <div class="flex items-center gap-2 mt-0.5">
             <span class="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">{{ row.customer.artikul }}</span>
             <span class="text-[10px] text-slate-500">{{ row.customer.phone }}</span>
          </div>
        </div>
      </template>

      <template #region="{ row }">
         <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">{{ row.region }}</span>
      </template>

      <template #payment_method="{ row }">
        <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
           {{ row.payment_method }}
        </span>
      </template>

      <template #weight="{ row }">
        <span class="font-mono text-xs text-slate-500">{{ row.weight }}</span>
      </template>

      <template #createdAt="{ row }">
        <span class="text-xs text-slate-500">{{ row.createdAt }}</span>
      </template>

      <template #total_amount="{ row }">
        <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
           {{ formatPrice(row.total_amount) }}
        </span>
      </template>

      <template #status="{ row }">
        <div class="flex justify-center">
           <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border shadow-sm flex items-center gap-1.5 min-w-[100px] justify-center"
             :class="getStatusBadge(row.status)">
             <i :class="getStatusIcon(row.status)"></i>
             {{ row.status }}
           </span>
        </div>
      </template>

      <template #actions="{ row }">
        <div class="relative flex items-center justify-center row-action-wrapper">
          <button 
            @click.stop="activeDropdown = activeDropdown === row.id ? null : row.id" 
            class="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ease-out outline-none"
            :class="[
              activeDropdown === row.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 transform scale-110' 
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200'
            ]"
          >
            <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
          </button>

          <transition name="dropdown-pop">
            <div 
              v-if="activeDropdown === row.id" 
              class="absolute right-10 top-1/2 -translate-y-1/2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 p-1.5 z-60 origin-right"
            >
              <div class="px-2 py-1.5 mb-1 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
                  <span class="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Amallar</span>
                  <button @click.stop="activeDropdown = null" class="text-slate-300 hover:text-rose-500"><i class="fa-solid fa-xmark text-xs"></i></button>
              </div>

              <div class="flex flex-col gap-0.5">
                <button 
                  v-for="(btn, index) in rowActions" 
                  :key="index" 
                  @click.stop="handleAction(btn.action, row)"
                  class="group w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <div class="w-6 h-6 rounded-lg flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110" :class="btn.colorClass">
                    <i :class="btn.icon" class="text-[10px]"></i>
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
/* Button va Dropdown transitionlar */
.no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.dropdown-pop-enter-active,
.dropdown-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-pop-enter-from,
.dropdown-pop-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.9) translateX(10px);
}
</style>