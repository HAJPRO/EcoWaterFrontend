<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import moment from "moment-timezone";

// --- UI COMPONENTS ---
import DataTable from "../../../UI/DataTable.vue";
import Button from "../../../UI/Button.vue";
import ExportDropdown from "../../../UI/ExportDropdown.vue"; // Yangi qo'shildi

// --- MODALS ---
import CustomModal from "../../../components/Customers/customerManagment/AddCustomModal.vue";
import DetailInfoModal from "./DetailInfoModal.vue";

// --- STORE ---
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
const store = CustomerManagmentStore();
const { customers, isActive } = storeToRefs(store);

// --- 1. CONFIGURATION ---
const columns = [
  { key: 'fullname', label: 'F.I.O', width: '220px', fixed: 'left', sortable: true },
  { key: 'phoneNumber', label: 'Telefon', width: '140px' },
  { key: 'address', label: 'Manzil', width: '200px' },
  { key: 'balance', label: 'Hisob-kitob', width: '180px', align: 'center' },
  { key: 'createdAt', label: 'Registratsiya', width: '150px', align: 'center' },
  { key: 'status', label: 'Holat', width: '120px', align: 'center' },
  { key: 'actions', label: '', width: '70px', fixed: 'right', align: 'center' }
];

// --- 2. STATE ---
const filter = reactive({ fullname: "", sort: "" });
const selectedIds = ref([]);
const activeDropdown = ref(null);
const currentPage = ref(1);

// --- 3. METHODS ---
const loadData = () => {
  store.GetAll({ 
    status: isActive.value, 
    page: currentPage.value, 
    limit: 10, 
    filter 
  });
};

onMounted(() => loadData());

watch(() => filter.fullname, () => {
  currentPage.value = 1;
  loadData();
});

// Modal Actions
const openAddModal = () => {
  store.AddCustomModal({ action: "create", title: "Mijoz kartasini shakillantirish" });
};

// Export (ExportDropdown komponentidan keladigan event)
const handleExport = (type) => {
  ElMessage.success(`${type.toUpperCase()} yuklanmoqda...`);
  // store.Export(type);
};

// Row Actions (Dropdown)
const rowActions = [
  { label: "Batafsil", action: 'view', icon: "fa-solid fa-magnifying-glass", colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { label: "O'zgartirish", action: 'edit', icon: "fa-solid fa-pen-to-square", colorClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { label: "Excel", action: 'excel', icon: "fa-solid fa-file-excel", colorClass: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  { label: "O'chirish", action: 'delete', icon: "fa-solid fa-trash", colorClass: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
];

const handleAction = (actionName, row) => {
  activeDropdown.value = null;
  if (actionName === 'view') store.AddDetailModal({ id: row._id });
  else if (actionName === 'edit') store.AddCustomModal({ id: row._id, action: "update", title: "Mijozni tahrirlash" });
  else if (actionName === 'delete') store.DeleteById({ id: row._id });
};

// Utils
const copyToClipboard = (text) => {
  if(!text) return;
  navigator.clipboard.writeText(text).then(() => ElMessage.success("Nusxalandi"));
};

const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price || 0);
const formatDate = (date) => date ? moment.utc(date).tz("Asia/Tashkent").format("DD.MM.YYYY HH:mm") : "-";

// Status Helper
const getStatusBadge = (status) => {
  return status === 'Aktiv' 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    : 'bg-rose-50 text-rose-700 border-rose-200';
};
</script>

<template>
  <CustomModal />
  <DetailInfoModal />

  <div class="h-screen flex flex-col gap-2 p-1 text-slate-700 dark:text-slate-300 font-sans overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
    
    <div class="flex-none flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md z-10">
      
      <div class="relative w-full sm:w-72 group">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
        <input 
          v-model="filter.fullname" 
          placeholder="F.I.O yoki Telefon..." 
          class="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
        >
      </div>

      <div class="flex gap-2 w-full sm:w-auto">
         <ExportDropdown @select="handleExport" />

         <Button 
         size="sm"
           variant="primary" 
           left-icon="fa-solid fa-plus"
           @click="openAddModal"
         >
           Mijoz qo'shish
         </Button>
      </div>
    </div>

    <DataTable 
      :items="customers" 
      :columns="columns" 
      v-model:selected="selectedIds"
    >
      <template #fullname="{ row }">
        <div class="flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
             {{ row.fullname ? row.fullname.charAt(0).toUpperCase() : 'M' }}
           </div>
           <div class="flex flex-col">
             <span class="font-semibold text-slate-700 dark:text-slate-200 text-sm hover:text-indigo-600 cursor-pointer" @click="handleAction('view', row)">
                {{ row.fullname || "Nomsiz" }}
             </span>
             <span class="text-[10px] text-slate-400">ID: {{ row._id ? row._id.slice(-6) : '---' }}</span>
           </div>
        </div>
      </template>

      <template #phoneNumber="{ row }">
        <div @click="copyToClipboard(row.phoneNumber)" class="group flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors w-fit p-1 rounded hover:bg-slate-50">
           <span class="font-mono text-xs text-slate-600 dark:text-slate-400">{{ row.phoneNumber }}</span>
           <i class="fa-regular fa-copy text-[10px] opacity-0 group-hover:opacity-100 text-slate-400"></i>
        </div>
      </template>

      <template #address="{ row }">
         <div class="flex flex-col text-xs">
            <span class="font-medium text-slate-700 dark:text-slate-300">{{ row.address?.region || "-" }}</span>
            <span class="text-[10px] text-slate-400">{{ row.address?.district || "" }}</span>
         </div>
      </template>

      <template #balance="{ row }">
        <div class="flex flex-col gap-1 w-full max-w-[160px] mx-auto">
           <div class="flex justify-between px-2 py-0.5 bg-rose-50 dark:bg-rose-900/10 text-rose-600 border border-rose-100 dark:border-rose-900/20 rounded text-[10px]">
              <span>Kredit:</span> <span class="font-bold">{{ formatPrice(150000) }}</span>
           </div>
           <div class="flex justify-between px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border border-emerald-100 dark:border-emerald-900/20 rounded text-[10px]">
              <span>Debitor:</span> <span class="font-bold">{{ formatPrice(0) }}</span>
           </div>
        </div>
      </template>

      <template #createdAt="{ row }">
         <span class="text-xs text-slate-500 font-mono">{{ formatDate(row.createdAt) }}</span>
      </template>

      <template #status="{ row }">
        <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border shadow-sm flex items-center justify-center gap-1.5 w-fit mx-auto"
          :class="getStatusBadge(row.status)">
          <i :class="row.status === 'Aktiv' ? 'fa-solid fa-circle-check' : 'fa-solid fa-hourglass-start'"></i>
          {{ row.status }}
        </span>
      </template>

      <template #actions="{ row }">
        <div class="relative flex justify-center row-action-wrapper">
          <button 
            @click.stop="activeDropdown = activeDropdown === row._id ? null : row._id" 
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
            :class="{'bg-indigo-50 text-indigo-600': activeDropdown === row._id}"
          >
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>

          <transition name="dropdown-pop">
            <div 
              v-if="activeDropdown === row._id" 
              class="absolute right-8 top-0 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 p-1.5 z-50 origin-top-right"
            >
              <div class="px-2 py-1.5 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center mb-1">
                  <span class="text-[9px] font-bold text-slate-400 uppercase">Amallar</span>
                  <button @click.stop="activeDropdown = null" class="text-slate-300 hover:text-rose-500"><i class="fa-solid fa-xmark text-xs"></i></button>
              </div>
              <div class="flex flex-col gap-0.5">
                <button 
                  v-for="(btn, index) in rowActions" 
                  :key="index" 
                  @click.stop="handleAction(btn.action, row)"
                  class="group w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <div class="w-6 h-6 rounded-md flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110" :class="btn.colorClass">
                    <i :class="btn.icon" class="text-[10px]"></i>
                  </div>
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{{ btn.label }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </template>
    </DataTable>

  </div>
</template>

<style scoped>
/* Scrollbar */
.no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Dropdown Animation */
.dropdown-pop-enter-active, .dropdown-pop-leave-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.dropdown-pop-enter-from, .dropdown-pop-leave-to { opacity: 0; transform: scale(0.9) translateX(10px); }
</style>