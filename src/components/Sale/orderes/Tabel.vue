<script setup>
// --- CORE IMPORTS ---
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';

// --- STORES ---
import { OrderManagmentStore } from '../../../stores/Sale/orders/orders.store';
import { SaleposManagmentStore } from '../../../stores/Sale/salepos/salepos.store';

// --- UI COMPONENTS ---
import AddOrderModal from './AddOrderModal.vue';
import DataTable from '../../../UI/DataTable.vue';
import Button from '../../../UI/Button.vue';
import ExportDropdown from '../../../UI/ExportDropdown.vue';
import Modal from '../../../UI/Modal.vue'; 

// --- INITIALIZATION ---
const store_orders = OrderManagmentStore();
const store_salepos = SaleposManagmentStore();
const { sales } = storeToRefs(store_salepos);

// --- STATE ---
const searchText = ref('');
const selectedIds = ref([]);
const activeDropdown = ref(null);
const isDetailModalOpen = ref(false);
const selectedOrder = ref(null);

// --- CONFIGURATION ---
const columns = [
  { key: 'orderNumber', label: 'Buyurtma', width: '130px', fixed: 'left', sortable: true },
  { key: 'author.fullname', label: 'Sotuvchi', width: '130px', sortable: true },
  { key: 'customerId.fullname', label: 'Mijoz', width: '220px', sortable: true },
  { key: 'driverId.fullname', label: 'Haydovchi', width: '160px' },
  { key: 'paymentType', label: 'To\'lov', width: '110px', align: 'center' },
  { key: 'date', label: 'Vaqt', width: '130px', align: 'center', sortable: true },
  { key: 'totalAmount', label: 'Summa', width: '150px', align: 'right', sortable: true },
  { key: 'status', label: 'Holat', width: '150px', align: 'center' },
  { key: 'actions', label: '', width: '50px', fixed: 'right', align: 'center' }
];

// Modal ichidagi mahsulotlar jadvali uchun ustunlar
const itemColumns = [
  { key: 'name', label: 'Mahsulot nomi', sortable: false },
  { key: 'quantity', label: 'Miqdor', width: '100px', align: 'center' },
  { key: 'salePrice', label: 'Narx', width: '120px', align: 'right' },
  { key: 'total', label: 'Jami', width: '130px', align: 'right' }
];

const rowActions = [
  { label: "Batafsil", action: 'view', icon: "fa-solid fa-eye", colorClass: "text-indigo-500 bg-indigo-50" },
  { label: "Tahrir", action: 'edit', icon: "fa-solid fa-pen", colorClass: "text-amber-500 bg-amber-50" },
  { label: "O'chirish", action: 'delete', icon: "fa-solid fa-trash", colorClass: "text-rose-500 bg-rose-50" },
];
// --- 🕒 VAQTNI TO'LIQ FORMATLASH ---
const formatDateTime = (date) => {
  if (!date) return { fullDate: '—', time: '', year: '' };
  const d = new Date(date);
  
  return {
    dayMonth: d.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short' }), // 20-Dek
    year: d.getFullYear(), // 2025
    time: d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) // 14:30
  };
};
// --- METHODS ---
const formatPrice = (p) => new Intl.NumberFormat('uz-UZ').format(p);

const handleAction = (actionName, row) => {
  activeDropdown.value = null;
  if (actionName === 'view') {
    selectedOrder.value = row;
    isDetailModalOpen.value = true;
  }
};

const getStatusBadge = (status) => {
  const styles = {
    'Yangi': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    'Yetkazib berilmoqda': 'text-amber-600 bg-amber-50 border-amber-100',
    'Yetkazib berildi': 'text-blue-600 bg-blue-50 border-blue-100',
    'Bekor qilindi': 'text-rose-600 bg-rose-50 border-rose-100',
  };
  return styles[status] || 'text-slate-500 bg-slate-50 border-slate-100';
};

onMounted(() => store_salepos.GetAll());
</script>

<template>
  <AddOrderModal />
  
  <div class="h-screen flex flex-col p-1 bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
    
    <header class="flex-none flex items-center justify-between gap-2 mb-1 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div class="relative w-80 group">
        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs transition-colors group-focus-within:text-indigo-500"></i>
        <input v-model="searchText" placeholder="ID yoki Ism bo'yicha qidiruv..." class="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" />
      </div>
      <div class="flex items-center gap-2">
        <ExportDropdown />
        <Button variant="primary" size="sm" class="!rounded-xl px-4 font-bold" @click="store_orders.AddOrderModal({ title: 'Yangi sotuv', action: 'create' })">
          <i class="fa-solid fa-plus mr-2"></i> Yangi Sotuv
        </Button>
      </div>
    </header>

    <main class="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <DataTable :items="sales" :columns="columns" v-model:selected="selectedIds" class="text-[13px]">
        
       <template #orderNumber="{ row }">
  <div class="flex items-center group ml-1">
    <div class="w-1 h-3 bg-indigo-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <span class="font-mono text-[12.5px] font-black text-slate-900 dark:text-slate-100 tracking-tighter">
      #{{ row.orderNumber }}
    </span>
  </div>
</template>
<template #author.fullname="{ row }">
  <div class="flex items-center gap-2.5 py-1 text-left">
    <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-[10px] border border-slate-200 dark:border-slate-700">
      {{ row.author?.fullname?.charAt(0) || '?' }}
    </div>
    <div class="flex flex-col min-w-0">
      <span class="font-bold text-slate-800 dark:text-slate-200 text-[13px] leading-tight truncate">
        {{ row.author?.fullname }}
      </span>
      <span class="text-[10.5px] text-slate-400 font-medium tracking-tight mt-0.5">
        <i class="fa-solid fa-phone text-[9px] opacity-70 mr-1"></i>{{ row.author?.phoneNumber }}
      </span>
    </div>
  </div>
</template>
<template #customerId.fullname="{ row }">
  <div class="flex items-center gap-2.5 py-1 text-left">
    <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-[10px] border border-slate-200 dark:border-slate-700">
      {{ row.customerId?.fullname?.charAt(0) || '?' }}
    </div>
    <div class="flex flex-col min-w-0">
      <span class="font-bold text-slate-800 dark:text-slate-200 text-[13px] leading-tight truncate">
        {{ row.customerId?.fullname }}
      </span>
      <span class="text-[10.5px] text-slate-400 font-medium tracking-tight mt-0.5">
        <i class="fa-solid fa-phone text-[9px] opacity-70 mr-1"></i>{{ row.customerId?.phoneNumber }}
      </span>
    </div>
  </div>
</template>



<template #driverId.fullname="{ row }">
  <div class="flex items-center gap-2">
    <div class="relative">
      <div class="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
        <i class="fa-solid fa-user-tie text-[10px]"></i>
      </div>
      <div v-if="row.driverId" class="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 border border-white rounded-full"></div>
    </div>
    <span class="text-[12px] font-semibold text-slate-600 dark:text-slate-400 truncate w-32">
      {{ row.driverId?.fullname || '—' }}
    </span>
  </div>
</template>
<template #paymentType="{ row }">
  <div class="flex justify-center">
    <div :class="[
      'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border',
      row.paymentType === 'cash' 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400' 
        : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400'
    ]">
      <i :class="row.paymentType === 'cash' ? 'fa-solid fa-money-bill-wave' : 'fa-solid fa-credit-card'"></i>
      {{ row.paymentType === 'cash' ? 'Naqd' : 'Karta' }}
    </div>
  </div>
</template>
<template #date="{ row }">
  <div class="flex flex-col items-center justify-center py-1 group min-w-[100px]">
    <div class="flex flex-col items-center leading-none">
      <span class="text-[12px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">
        {{ formatDateTime(row.date).dayMonth }}
      </span>
      <span class="text-[9px] font-bold text-slate-400 mt-0.5 tracking-widest">
        {{ formatDateTime(row.date).year }}
      </span>
    </div>
    
    <div class="mt-1.5 flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-inner">
      <i class="fa-regular fa-clock text-[9px] text-indigo-500"></i>
      <span class="text-[10px] font-mono font-black text-slate-600 dark:text-slate-400">
        {{ formatDateTime(row.date).time }}
      </span>
    </div>
  </div>
</template>
<template #totalAmount="{ row }">
  <div class="flex flex-col items-end pr-2 group">
    <span class="font-mono font-black text-slate-900 dark:text-white text-[14px] tracking-tighter group-hover:text-indigo-600 transition-colors">
      {{ formatPrice(row.totalAmount) }}
    </span>
    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">UZS</span>
  </div>
</template>

<template #status="{ row }">
  <div class="flex justify-center">
    <div class="flex items-center gap-2 px-3 py-1 rounded-full text-[10.5px] font-black uppercase border shadow-sm transition-all hover:brightness-95"
      :class="getStatusBadge(row.status)">
      <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {{ row.status }}
    </div>
  </div>
</template>

<template #actions="{ row }">
  <div class="flex justify-center">
    <button 
     @click.stop="activeDropdown = activeDropdown === row._id ? null : row._id"
      class="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300"
      :class="activeDropdown === row._id ? 'bg-indigo-600 text-white shadow-lg rotate-90' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
    >
      <i class="fa-solid fa-ellipsis-vertical text-[14px]"></i>
    </button>
    <transition name="dropdown-pop">
              <div v-if="activeDropdown === row._id" class="absolute right-8 top-0 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-1 z-50">
                <button v-for="btn in rowActions" :key="btn.action" @click.stop="handleAction(btn.action, row)" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group">
                  <div class="w-5 h-5 rounded flex items-center justify-center text-[10px]" :class="btn.colorClass">
                    <i :class="btn.icon"></i>
                  </div>
                  <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600">{{ btn.label }}</span>
                </button>
              </div>
            </transition>
  </div>
</template>
      </DataTable>
    </main>

    <Modal v-model="isDetailModalOpen" title="Buyurtma tafsiloti" :subtitle="`Mijoz: ${selectedOrder?.customerId?.fullname}`" width="max-w-3xl" icon="fa-solid fa-file-invoice-dollar">
      <div class="space-y-6">
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-500 shadow-sm"><i class="fa-solid fa-user "></i></div>
            <div><p class="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Sotuvchi</p><p class="text-sm font-bold truncate">{{ selectedOrder?.author?.fullname || '—' }}</p></div>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-500 shadow-sm"><i class="fa-solid fa-truck"></i></div>
            <div><p class="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Haydovchi</p><p class="text-sm font-bold truncate">{{ selectedOrder?.driverId?.fullname || '—' }}</p></div>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-blue-500 shadow-sm"><i class="fa-solid fa-wallet"></i></div>
            <div><p class="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">To'lov turi</p><p class="text-sm font-bold uppercase">{{ selectedOrder?.paymentType }}</p></div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <DataTable :items="selectedOrder?.items || []" :columns="itemColumns" class="!text-[12px] bg-slate-50/50">
            <template #name="{ row }">
              <div class="flex flex-col">
                <span class="font-bold text-slate-700 dark:text-slate-200">{{ row.name }}</span>
                <span class="text-[9px] font-mono text-slate-400">Lot: {{ row.partyNumber }}</span>
              </div>
            </template>
            <template #quantity="{ row }">
              <span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-black">{{ row.quantity }} {{ row.unit }}</span>
            </template>
            <template #salePrice="{ row }">
              <span class="font-mono text-slate-500">{{ formatPrice(row.salePrice) }}</span>
            </template>
            <template #total="{ row }">
              <span class="font-mono font-black text-slate-900 dark:text-white">{{ formatPrice(row.quantity * row.salePrice) }}</span>
            </template>
          </DataTable>
        </div>

        <div class="flex justify-between items-center bg-indigo-600 p-5 rounded-[2rem] text-white shadow-lg shadow-indigo-500/30">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl"><i class="fa-solid fa-calculator"></i></div>
            <div class="flex flex-col">
              <span class="text-[10px] font-bold uppercase opacity-70 tracking-[0.2em]">Umumiy to'lov</span>
              <span class="text-2xl font-mono font-black leading-none">{{ formatPrice(selectedOrder?.totalAmount) }} <small class="text-xs font-normal italic">uzs</small></span>
            </div>
          </div>
          <Button variant="secondary" @click="isDetailModalOpen = false" class="!bg-white !text-indigo-600 !rounded-xl !px-6 font-black uppercase text-xs">Yopish</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.dropdown-pop-enter-active, .dropdown-pop-leave-active { transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
.dropdown-pop-enter-from, .dropdown-pop-leave-to { opacity: 0; transform: translateY(-8px) scale(0.95); }
</style>