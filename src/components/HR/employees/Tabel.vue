<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import moment from "moment-timezone";

// --- CUSTOM UI COMPONENTS ---
import DataTable from "../../../UI/DataTable.vue";
import Button from "../../../UI/Button.vue";
import ExportDropdown from "../../../UI/ExportDropdown.vue";

// --- MODALS ---
import EmployeeModal from "../../../components/HR/employees/AddEmployeeModal.vue";
import DetailInfoEmployeeModal from "../../../components/HR/employees/DetailInfoEmployeeModal.vue";

// --- STORE ---
import { EmployeeManagmentStore } from "../../../stores/HR/employee/employee.store";
const store = EmployeeManagmentStore();
const { employees, isActive } = storeToRefs(store);

// --- 1. CONFIGURATION ---
const columns = [
  { key: 'fullname', label: 'Xodim Ma\'lumoti', width: '280px', fixed: 'left', sortable: true },
  { key: 'workInfo', label: "Bo'lim va Lavozim", width: '220px' },
  { key: 'contactInfo', label: 'Aloqa va Manzil', width: '250px' },
  { key: 'registeredAt', label: 'Sana', width: '130px', align: 'center' },
  { key: 'status', label: 'Holat', width: '120px', align: 'center' },
  { key: 'actions', label: '', width: '70px', fixed: 'right', align: 'center' }
];

// --- 2. STATE ---
const searchText = ref('');
const selectedIds = ref([]);
const activeDropdown = ref(null);
const currentPage = ref(1);

// --- 3. ACTIONS ---
const loadData = () => {
  store.GetAll({ 
    status: isActive.value || 'active', 
    page: currentPage.value, 
    limit: 15,
    search: searchText.value 
  });
};

onMounted(() => {
  loadData();
  // Tashqariga bosilganda menyuni yopish mantiqi
  document.addEventListener('click', () => {
    activeDropdown.value = null;
  });
});

watch(searchText, () => {
  currentPage.value = 1;
  loadData();
});

const handleAction = (actionName, row) => {
  activeDropdown.value = null;
  if (actionName === 'view') store.DetailInfoEmployeeModal(row._id);
  else if (actionName === 'edit') store.GetById({ id: row._id, status: "update" });
  else if (actionName === 'delete') store.DeleteById({ id: row._id });
};

// Siz xohlagan rangli ikonkalarga ega amallar ro'yxati
const rowActions = [
  { label: "Batafsil", action: 'view', icon: "fa-solid fa-eye", colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { label: "Tahrirlash", action: 'edit', icon: "fa-solid fa-pen-to-square", colorClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { label: "O'chirish", action: 'delete', icon: "fa-solid fa-trash-can", colorClass: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
];

// --- UTILS ---
const formatDate = (date) => date ? moment(date).tz("Asia/Tashkent").format("DD.MM.YYYY") : "-";
const copyToClipboard = (text) => {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => ElMessage.success("Nusxalandi"));
};
</script>

<template>
  <EmployeeModal />
  <DetailInfoEmployeeModal />

  <div class="h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] p-3 gap-3 font-sans overflow-hidden">
    
    <header class="flex-none flex flex-col lg:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 z-10">
      <div class="flex items-center gap-3 w-full lg:w-auto">
        <div class="relative w-full sm:w-80 group">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
          <input 
            v-model="searchText" 
            placeholder="Xodimni izlash..." 
            class="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
          >
        </div>
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <ExportDropdown @select="(type) => store.ExportExcel({type})" />
        <Button size="sm" variant="primary" left-icon="fa-solid fa-user-plus" @click="store.AddEmployeeModal()">
          Xodim qo'shish
        </Button>
      </div>
    </header>

    <main class="flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
      <DataTable :items="employees" :columns="columns" v-model:selected="selectedIds">
        
        <template #fullname="{ row }">
          <div class="flex items-center gap-4 py-1">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-500/20">
              {{ row.fullname ? row.fullname.charAt(0).toUpperCase() : 'U' }}
            </div>
            <div class="flex flex-col overflow-hidden">
              <span class="font-bold text-slate-700 dark:text-slate-100 text-sm truncate hover:text-indigo-600 cursor-pointer transition-colors" @click="handleAction('view', row)">
                {{ row.fullname }}
              </span>
              <span class="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">ID: {{ row._id?.slice(-6).toUpperCase() }}</span>
            </div>
          </div>
        </template>

        <template #workInfo="{ row }">
          <div class="flex flex-col">
            <span class="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">{{ row.department }}</span>
            <span class="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{{ row.position }}</span>
          </div>
        </template>

        <template #contactInfo="{ row }">
          <div class="flex flex-col gap-1 py-1">
            <div @click.stop="copyToClipboard(row.phoneNumber)" class="group flex items-center gap-2 cursor-pointer w-fit">
              <i class="fa-solid fa-phone text-[9px] text-slate-300 group-hover:text-indigo-500 transition-colors"></i>
              <span class="font-mono text-xs text-slate-600 dark:text-indigo-400 group-hover:text-indigo-600 transition-colors">{{ row.phoneNumber }}</span>
            </div>
            <div class="flex items-start gap-2 max-w-[200px]">
              <i class="fa-solid fa-location-dot text-[9px] text-slate-300 mt-1"></i>
              <span class="text-[11px] text-slate-500 dark:text-slate-500 italic line-clamp-2 leading-tight" :title="row.address">
                {{ row.address.region || 'Manzil kiritilmagan' }}, {{ row.address.district || 'Manzil kiritilmagan' }}, {{ row.address.neighborhood || 'Manzil kiritilmagan' }}, {{ row.address.street || 'Manzil kiritilmagan' }}, {{ row.address.house || 'Manzil kiritilmagan' }}
              </span>
            </div>
          </div>
        </template>
          <template #registeredAt="{ row }">
  <div class="flex flex-col gap-1 py-1 group">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 transition-colors group-hover:border-indigo-200">
        <i class="fa-regular fa-calendar-check text-[11px] text-slate-400 group-hover:text-indigo-500 transition-colors"></i>
      </div>
      <div class="flex flex-col leading-none">
        <span class="text-[12px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">
          {{ formatDate(row.registeredAt) }}
        </span>
        <span class="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
          Ro'yxatdan o'tdi
        </span>
      </div>
    </div>

    <div class="flex items-center gap-1.5 ml-9 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div class="w-1 h-1 rounded-full bg-indigo-400"></div>
      <span class="text-[10px] text-indigo-500 font-medium italic">
        {{ moment(row.registeredAt).fromNow() }}
      </span>
    </div>
  </div>
</template>

        <template #status="{ row }">
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm flex items-center gap-2 w-fit mx-auto"
            :class="row.status === 'active' || row.status === 'Online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'">
            <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="row.status === 'active' || row.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
            {{ row.status === 'active' || row.status === 'offline' ? 'Aktiv' : 'Nofaol' }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="relative flex justify-center row-action-wrapper">
            <button 
              @click.stop="activeDropdown = activeDropdown === row._id ? null : row._id" 
              class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 transition-all"
              :class="{'bg-indigo-50 text-indigo-600 shadow-inner': activeDropdown === row._id}"
            >
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <transition name="dropdown-pop">
              <div 
                v-if="activeDropdown === row._id" 
                class="absolute right-8 top-0 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-700 p-1.5 z-50 origin-top-right"
              >
                <div class="px-2 py-1.5 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center mb-1">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Boshqaruv</span>
                    <i class="fa-solid fa-bolt text-amber-400 text-[10px]"></i>
                </div>
                <div class="flex flex-col gap-0.5">
                  <button 
                    v-for="(btn, index) in rowActions" 
                    :key="index" 
                    @click.stop="handleAction(btn.action, row)"
                    class="group w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left"
                  >
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110" :class="btn.colorClass">
                      <i :class="btn.icon" class="text-[11px]"></i>
                    </div>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{{ btn.label }}</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </template>

      </DataTable>
    </main>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }

/* Dropdown Animation (O'sha silliq pop-up) */
.dropdown-pop-enter-active, 
.dropdown-pop-leave-active { 
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); 
}
.dropdown-pop-enter-from, 
.dropdown-pop-leave-to { 
  opacity: 0; 
  transform: scale(0.9) translateX(15px); 
}
</style>