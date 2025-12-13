<script setup>
import { ref, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus"; // Faqat logika uchun
import moment from "moment-timezone";

// --- STORES ---
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";

// --- CUSTOM UI COMPONENTS ---
import BaseModal from "../../../UI/Modal.vue";
import DataTable from "../../../UI/DataTable.vue";
import Button from "../../../UI/Button.vue";
import ExportDropdown from "../../../UI/ExportDropdown.vue";

const store_customer = CustomerManagmentStore();
const { detail_modal, orders, all_length } = storeToRefs(store_customer);

// --- STATE ---
const activeTab = ref('debitor'); // 'debitor' | 'kreditor'
const dateRange = ref({ start: null, end: null }); // Sana filteri (Custom date picker kerak bo'ladi yoki native)
const expandedRows = ref([]); // Qaysi qatorlar ochiq

// --- COLUMNS CONFIGURATION ---
const columns = [
  { key: 'index', label: '#', width: '50px', align: 'center' },
  { key: 'orderNumber', label: 'Buyurtma №', width: '140px', sortable: true },
  { key: 'createdAt', label: 'Sana', width: '140px', align: 'center' },
  { key: 'totalAmount', label: 'Summa', width: '160px', align: 'right', sortable: true },
  { key: 'status', label: 'Holat', width: '140px', align: 'center' },
  { key: 'actions', label: '', width: '60px', align: 'center' }
];

// --- COMPUTED ---
const modalTitle = computed(() => {
  return orders.value[0]?.customerId?.fullname 
    ? `${orders.value[0].customerId.fullname} - Buyurtmalar Tarixi` 
    : "Mijoz Tafsilotlari";
});

// Jami summa (Footer uchun)
const totalSum = computed(() => {
  return orders.value.reduce((acc, row) => acc + (Number(row.totalAmount) || 0), 0);
});

// --- HELPERS ---
const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price || 0);
const formatDate = (date) => date ? moment(date).format("DD.MM.YYYY HH:mm") : "-";

// Status Style
const getStatusBadge = (status) => {
  const styles = {
    'Yetkazib berildi': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Bekor qilingan': 'bg-rose-50 text-rose-700 border-rose-200',
    'Yangi': 'bg-blue-50 text-blue-700 border-blue-200'
  };
  return styles[status] || 'bg-gray-50 text-gray-600 border-gray-200';
};

// --- ACTIONS ---
const handleClose = () => {
  store_customer.detail_modal = false;
  expandedRows.value = [];
};

const handleTabChange = (tab) => {
  activeTab.value = tab;
  // Agar backendda tabga qarab API call bo'lsa shu yerda chaqiriladi
  // Masalan: store_customer.getOrders(tab);
};

const toggleExpand = (rowId) => {
  if (expandedRows.value.includes(rowId)) {
    expandedRows.value = expandedRows.value.filter(id => id !== rowId);
  } else {
    expandedRows.value.push(rowId);
  }
};

const handleExport = (type) => {
  store_customer.ExcelExportOrdersByCustomer(orders.value); // Store dagi funksiya
  ElMessage.success(`${type} yuklanmoqda...`);
};

// Vaqt oralig'i (Native input orqali oddiy yechim)
const handleDateChange = () => {
  console.log("Filter dates:", dateRange.value);
};
</script>

<template>
  <BaseModal
    v-model="detail_modal"
    :title="modalTitle"
    subtitle="Buyurtmalar va to'lovlar tarixi"
    icon="fa-solid fa-file-invoice-dollar"
    width="max-w-6xl"
    @close="handleClose"
  >
    
    <div class="grid grid-cols-12 gap-4 mb-6">
      <div class="col-span-12 md:col-span-6 flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <button 
          @click="handleTabChange('debitor')"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
          :class="activeTab === 'debitor' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        >
          <i class="fa-solid fa-arrow-trend-down"></i>
          Debitor (Qarzdorlik)
          <span class="ml-2 bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full">{{ all_length?.debitor || 0 }}</span>
        </button>
        <button 
          @click="handleTabChange('kreditor')"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
          :class="activeTab === 'kreditor' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        >
          <i class="fa-solid fa-arrow-trend-up"></i>
          Kreditor (Haqdorlik)
          <span class="ml-2 bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full">{{ all_length?.kreditor || 0 }}</span>
        </button>
      </div>

      <div class="col-span-12 md:col-span-6 flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3">
         <i class="fa-regular fa-calendar text-slate-400"></i>
         <input v-model="dateRange.start" type="date" class="bg-transparent border-none text-sm text-slate-600 outline-none w-full" @change="handleDateChange">
         <span class="text-slate-400">→</span>
         <input v-model="dateRange.end" type="date" class="bg-transparent border-none text-sm text-slate-600 outline-none w-full" @change="handleDateChange">
      </div>
    </div>

    <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
      
      <div class="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
         <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-list-check text-indigo-500"></i> Barcha operatsiyalar   <span class="text-xs font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
            {{ orders.length }} ta
            
         </span>
         </h4>
          <div v-if="orders.length > 0" class=" flex justify-end">
       <div class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 px-6 py-1 rounded-xl flex items-center gap-4">
          <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest">Jami Summa:</span>
          <span class="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{{ formatPrice(totalSum) }} so'm</span>
       </div>
    </div>
        
          <ExportDropdown @select="handleExport" />
         
      </div>
      

      <DataTable 
        :items="orders" 
        :columns="columns"
        :show-index="false"
      >
        <template #index="{ index }">
           <span class="text-slate-400 text-xs">{{ index + 1 }}</span>
        </template>

        <template #orderNumber="{ row }">
           <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800">
              {{ row.orderNumber }}
           </span>
           
        </template>

        <template #createdAt="{ row }">
           <div class="text-xs text-slate-500 flex flex-col items-center">
              <span class="font-medium text-slate-700 dark:text-slate-300">{{ formatDate(row.createdAt).split(' ')[0] }}</span>
              <span class="text-[10px]">{{ formatDate(row.createdAt).split(' ')[1] }}</span>
           </div>
        </template>

        <template #totalAmount="{ row }">
           <span class="font-bold text-slate-700 dark:text-slate-200 font-mono">{{ formatPrice(row.totalAmount) }}</span>
        </template>

        <template #status="{ row }">
           <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border" :class="getStatusBadge(row.status)">
              {{ row.status }}
           </span>
        </template>

        <template #actions="{ row }">
           <button 
             @click="toggleExpand(row._id)" 
             class="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
             :class="expandedRows.includes(row._id) ? 'bg-indigo-100 text-indigo-600 rotate-180' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'"
           >
              <i class="fa-solid fa-chevron-down text-xs"></i>
           </button>
        </template>

        </DataTable>

      </div>

    

    <template #footer>
       <div class="flex justify-between w-full">
          <!-- <ExportDropdown @select="handleExport" /> -->
           <div></div>
          <Button size="md" variant="danger" left-icon="fas fa-xmark" @click="handleClose">Yopish</Button>
       </div>
    </template>

  </BaseModal>
</template>

<style scoped>
/* Tabs Active Transition */
button { transition: all 0.2s ease-in-out; }
</style>