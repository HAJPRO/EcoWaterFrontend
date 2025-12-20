<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import moment from "moment-timezone";

// --- STORES ---
import { EmployeeManagmentStore } from "../../../stores/HR/employee/employee.store";

// --- CUSTOM UI COMPONENTS ---
import BaseModal from "../../../UI/Modal.vue";
import DataTable from "../../../UI/DataTable.vue";
import Button from "../../../UI/Button.vue";
import ExportDropdown from "../../../UI/ExportDropdown.vue";

const store_employee = EmployeeManagmentStore();
const { detail_employee_modal, orders, all_length } = storeToRefs(store_employee);

// --- STATE ---
const activeTab = ref('all'); 
const expandedRows = ref([]); 
const dateRange = ref({ start: null, end: null });

// --- COLUMNS (Professional Configuration) ---
const columns = [
  { key: 'orderNumber', label: 'Buyurtma №', width: '150px', fixed: 'left' },
  { key: 'customer', label: 'Mijoz & Manzil', width: '240px' },
  { key: 'createdAt', label: 'Sana & Vaqt', width: '150px', align: 'center' },
  { key: 'totalAmount', label: 'Tranzaksiya', width: '160px', align: 'right' },
  { key: 'status', label: 'Holat', width: '150px', align: 'center' },
  { key: 'actions', label: '', width: '50px', fixed: 'right', align: 'center' }
];

// --- ANALYTICS COMPUTED ---
const employeeInfo = computed(() => orders.value[0]?.driverId || { fullname: "Xodim" });

const stats = computed(() => {
  const data = orders.value || [];
  const total = data.reduce((acc, row) => acc + (Number(row.totalAmount) || 0), 0);
  const deliveredCount = data.filter(o => o.status === 'Yetkazib berildi').length;
  
  return {
    total,
    count: data.length,
    successRate: data.length > 0 ? Math.round((deliveredCount / data.length) * 100) : 0,
    average: data.length > 0 ? Math.round(total / data.length) : 0
  };
});

// --- HELPERS ---
const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price || 0);

const getStatusBadge = (status) => {
  const styles = {
    'Yetkazib berildi': 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400',
    'Bekor qilingan': 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400',
    'Yetkazib berilmoqda': 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400',
    'Yangi': 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400'
  };
  return styles[status] || 'text-slate-500 bg-slate-50 border-slate-100';
};

// --- ACTIONS ---
const handleClose = () => {
  store_employee.detail_employee_modal = false;
  expandedRows.value = [];
};

const toggleExpand = (id) => {
  expandedRows.value = expandedRows.value.includes(id) 
    ? expandedRows.value.filter(rowId => rowId !== id) 
    : [...expandedRows.value, id];
};

const handleExport = (type) => {
  store_employee.ExcelExportOrdersByCustomer(orders.value);
  ElMessage.success(`Hisobot (${type}) tayyorlanmoqda...`);
};
</script>

<template>
  <BaseModal
    v-model="detail_employee_modal"
    :title="employeeInfo.fullname"
    subtitle="Xizmat ko'rsatish tahlili va buyurtmalar tarixi"
    icon="fa-solid fa-user-gear"
    width="max-w-6xl"
    @close="handleClose"
  >
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jami Yetkazmalar</p>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-black text-slate-800 dark:text-white">{{ stats.count }}</span>
            <span class="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <i class="fa-solid fa-arrow-up text-[10px]"></i> 100%
            </span>
          </div>
        </div>

        <div class="p-4 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Umumiy Qiymat</p>
          <div class="text-2xl font-mono font-black text-indigo-600 dark:text-indigo-400 leading-none">
            {{ formatPrice(stats.total) }} <small class="text-[10px] font-bold">UZS</small>
          </div>
        </div>

        <div class="p-4 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Samaradorlik</p>
          <div class="flex items-center gap-3">
            <span class="text-2xl font-black text-slate-800 dark:text-white">{{ stats.successRate }}%</span>
            <div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full transition-all duration-1000" :style="{ width: stats.successRate + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-[1.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/30">
          <p class="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">O'rtacha xizmat qiymati</p>
          <div class="text-2xl font-mono font-black">{{ formatPrice(stats.average) }}</div>
        </div>
      </div>

      <div class="flex flex-wrap justify-between items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-[1.5rem] border border-slate-200 dark:border-slate-700">
        <div class="flex p-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <button v-for="t in ['all', 'delivered', 'cancelled']" :key="t" 
            @click="activeTab = t"
            class="px-5 py-2 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-all"
            :class="activeTab === t ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'"
          >
            {{ t === 'all' ? 'Barchasi' : t === 'delivered' ? 'Bajarilgan' : 'Bekor bo\'lgan' }}
          </button>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <i class="fa-regular fa-calendar-range text-indigo-500"></i>
            <input type="date" v-model="dateRange.start" class="bg-transparent border-none text-[11px] font-black outline-none text-slate-600">
            <span class="text-slate-300">→</span>
            <input type="date" v-model="dateRange.end" class="bg-transparent border-none text-[11px] font-black outline-none text-slate-600">
          </div>
          <ExportDropdown @select="handleExport" />
        </div>
      </div>

      <div class="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <DataTable :items="orders" :columns="columns" class="!text-[13px]">
          
          <template #orderNumber="{ row }">
            <div class="flex items-center gap-3 py-1">
              <div class="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
              <div class="flex flex-col">
                <span class="font-mono font-black text-slate-800 dark:text-slate-100">#{{ row.orderNumber }}</span>
                <span class="text-[9px] font-bold text-slate-400 uppercase">ID: {{ row._id.slice(-6) }}</span>
              </div>
            </div>
          </template>

          <template #customer="{ row }">
            <div class="flex flex-col gap-0.5 leading-tight">
              <span class="font-black text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{{ row.customerId?.fullname }}</span>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-location-dot text-[9px] text-rose-500"></i>
                <span class="text-[10px] text-slate-400 font-medium truncate">{{ row.customerId?.address?.region || 'Manzil kiritilmagan' }}</span>
              </div>
            </div>
          </template>

          <template #createdAt="{ row }">
            <div class="flex flex-col items-center">
              <span class="font-black text-slate-700 dark:text-slate-300 text-[11px]">{{ moment(row.createdAt).format("DD-MMM, YYYY") }}</span>
              <span class="text-[10px] text-slate-400 font-mono tracking-widest mt-0.5 uppercase">{{ moment(row.createdAt).format("HH:mm") }}</span>
            </div>
          </template>

          <template #totalAmount="{ row }">
            <div class="flex flex-col items-end pr-2">
              <span class="font-black text-slate-900 dark:text-white font-mono text-sm tracking-tighter">{{ formatPrice(row.totalAmount) }}</span>
              <span class="text-[8px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">uzs</span>
            </div>
          </template>

          <template #status="{ row }">
            <div class="flex justify-center">
              <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-tighter flex items-center gap-1.5" :class="getStatusBadge(row.status)">
                <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {{ row.status }}
              </span>
            </div>
          </template>

          <template #actions="{ row }">
            <button @click="toggleExpand(row._id)" 
              class="w-9 h-9 flex items-center justify-center rounded-2xl transition-all duration-300 group"
              :class="expandedRows.includes(row._id) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600'"
            >
              <i class="fa-solid" :class="expandedRows.includes(row._id) ? 'fa-minus' : 'fa-plus'"></i>
            </button>
          </template>

          <template #expand="{ row }">
            <div v-if="expandedRows.includes(row._id)" class="p-6 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="item in row.items" :key="item._id" 
                  class="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-3 group hover:border-indigo-400 transition-all"
                >
                  <div class="flex justify-between items-start">
                    <span class="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">{{ item.name }}</span>
                    <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-[9px] font-black text-slate-500 uppercase">{{ item.unit }}</span>
                  </div>
                  <div class="flex justify-between items-end pt-3 border-t border-slate-50 dark:border-slate-700">
                    <div class="flex flex-col">
                      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Soni</span>
                      <span class="text-xs font-black text-indigo-600">{{ item.quantity }}</span>
                    </div>
                    <div class="flex flex-col items-end">
                      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Jami</span>
                      <span class="text-xs font-mono font-black text-slate-900 dark:text-white">{{ formatPrice(item.quantity * item.salePrice) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-6 px-4 text-slate-500">
          <div class="flex flex-col">
            <span class="text-[9px] font-black uppercase opacity-60">To'lov holati</span>
            <span class="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
              <i class="fa-solid fa-shield-check"></i> To'liq yopilgan
            </span>
          </div>
        </div>
        <div class="flex gap-3">
          <Button variant="secondary" left-icon="fa-solid fa-print" @click="handlePrint" class="!rounded-xl px-6 font-black uppercase text-[11px]">Chop etish</Button>
          <Button variant="danger" left-icon="fas fa-xmark" @click="handleClose" class="!rounded-xl px-6 font-black uppercase text-[11px]">Yopish</Button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
button { transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; filter: invert(0.5); opacity: 0.6; }
</style>