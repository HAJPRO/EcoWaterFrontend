<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus"; // Xabarlar uchun
import moment from "moment-timezone";

// --- COMPONENTS ---
import DataTable from '../../../UI/DataTable.vue' // Sizning yangi jadval komponentingiz
import EmployeeModal from "../../../components/HR/employees/AddEmployeeModal.vue";
import DetailInfoEmployeeModal from "../../../components/HR/employees/DetailInfoEmployeeModal.vue";

// --- STORE ---
import { EmployeeManagmentStore } from "../../../stores/HR/employee/employee.store";
const store = EmployeeManagmentStore();
const { employees, all_length, isActive } = storeToRefs(store);

// --- 1. CONFIGURATION (Jadval Ustunlari) ---
const columns = [
  { key: 'fullname', label: 'F.I.O', width: '250px', fixed: 'left', sortable: true },
  { key: 'department', label: "Bo'lim", width: '150px' },
  { key: 'position', label: 'Lavozim', width: '150px' },
  { key: 'phoneNumber', label: 'Telefon', width: '160px' },
  { key: 'address', label: 'Manzil', width: '180px' },
  { key: 'registeredAt', label: 'Sana', width: '160px', align: 'center', sortable: true },
  { key: 'status', label: 'Holat', width: '120px', align: 'center' },
  { key: 'actions', label: '', width: '80px', fixed: 'right', align: 'center' }
]

// --- 2. STATE ---
const searchText = ref('')
const selectedIds = ref([])
const activeDropdown = ref(null)
const isExportDropdownOpen = ref(false)
const currentPage = ref(1)

// --- 3. METHODS (ACTIONS) ---

// Ma'lumotlarni yuklash
const loadData = () => {
  store.GetAll({ 
    status: isActive.value || 'active', // Default holat
    page: currentPage.value, 
    limit: 10,
    search: searchText.value // Agar API qidiruvni qo'llab quvvatlasa
  });
};

onMounted(() => {
  loadData();
});

// Qidiruv (Debounce o'rniga oddiy watch qo'ydim, kerak bo'lsa debounce qo'shasiz)
watch(searchText, () => {
  loadData();
});

// Modal Actions
const openAddModal = () => {
  store.AddEmployeeModal();
};

const handleExport = (type) => {
  store.ExportExcel({ type }); // Store'dagi export funksiyasi
  isExportDropdownOpen.value = false;
  ElMessage.success(`${type.toUpperCase()} yuklanmoqda...`);
};

// Row Actions (View, Edit, Delete)
const rowActions = [
  { 
    label: "Batafsil", 
    action: 'view', 
    icon: "fa-solid fa-eye", 
    colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
  },
  { 
    label: "Tahrirlash", 
    action: 'edit', 
    icon: "fa-solid fa-pen-to-square", 
    colorClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
  },
  { 
    label: "O'chirish", 
    action: 'delete', 
    icon: "fa-solid fa-trash-can", 
    colorClass: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" 
  },
]

const handleAction = (actionName, row) => {
  activeDropdown.value = null; // Menyuni yopish
  
  if (actionName === 'view') {
    store.DetailInfoEmployeeModal({ id: row._id });
  } else if (actionName === 'edit') {
    store.GetById({ id: row._id, status: "update" });
  } else if (actionName === 'delete') {
    store.DeleteById({ id: row._id });
  }
}

// Utils
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => ElMessage.success("Nusxalandi: " + text))
    .catch(() => ElMessage.error("Xatolik yuz berdi"));
};

const formatDate = (date) => {
  if (!date) return "-";
  return moment.utc(date).tz("Asia/Tashkent").format("DD.MM.YYYY HH:mm");
};

// Pagination handler
const handlePageChange = (page) => {
  currentPage.value = page;
  loadData();
};
</script>

<template>
  <EmployeeModal />
  <DetailInfoEmployeeModal />

  <div class="h-screen flex flex-col gap-2 p-1 text-slate-700 dark:text-slate-300 font-sans overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
    
    <div class="flex-none flex flex-col sm:flex-row justify-between items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md z-10">
      
      <div class="relative w-full sm:w-72 group">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
        <input 
          v-model="searchText" 
          placeholder="Qidiruv (F.I.O, Bo'lim)..." 
          class="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
        >
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
                class="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 z-40 overflow-hidden origin-top-right p-2"
              >
                 <div class="px-2 pb-2 mb-1 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
                    <span class="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">Formatni tanlang</span>
                 </div>

                 <button @click="handleExport('excel')" class="w-full text-left p-3 rounded-xl hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 flex items-start gap-4 transition-all group/item mb-1 border border-transparent hover:border-emerald-100">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-lg shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-transform duration-300">
                      <i class="fa-solid fa-file-excel"></i>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                          <span class="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover/item:text-emerald-700 transition-colors">Excel Report</span>
                      </div>
                      <div class="text-[11px] text-slate-400 mt-0.5">Xodimlar ro'yxati (.xlsx)</div>
                    </div>
                 </button>

                 <button @click="handleExport('pdf')" class="w-full text-left p-3 rounded-xl hover:bg-rose-50/50 dark:hover:bg-rose-900/10 flex items-start gap-4 transition-all group/item border border-transparent hover:border-rose-100">
                    <div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 flex items-center justify-center text-lg shadow-sm group-hover/item:scale-110 group-hover/item:-rotate-3 transition-transform duration-300">
                      <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <div>
                      <div class="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover/item:text-rose-700 transition-colors">PDF Document</div>
                      <div class="text-[11px] text-slate-400 mt-0.5">Chop etish uchun (.pdf)</div>
                    </div>
                 </button>
              </div>
            </transition>
         </div>
         
         <button @click="openAddModal" class="btn-primary w-full sm:w-auto">
            <i class="fa-solid fa-plus mr-2"></i> Xodim qo'shish
         </button>
      </div>
    </div>

    <DataTable 
      :items="employees" 
      :columns="columns" 
      v-model:selected="selectedIds"
    >
      <template #fullname="{ row }">
        <div>
          <span class="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline" @click="handleAction('view', row)">
            {{ row.fullname }}
          </span>
          <div v-if="row.roles && row.roles.length" class="text-[10px] text-slate-400 mt-0.5 flex gap-1">
             <span v-for="role in row.roles" :key="role._id" class="bg-indigo-50 text-indigo-600 px-1 rounded">
                {{ role.name }}
             </span>
          </div>
        </div>
      </template>

      <template #phoneNumber="{ row }">
        <div @click="copyToClipboard(row.phoneNumber)" class="group flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors">
            <span class="font-mono text-xs">{{ row.phoneNumber }}</span>
            <i class="fa-solid fa-copy text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"></i>
        </div>
      </template>

      <template #address="{ row }">
        <div class="text-xs">
            <div v-if="row.address">
                <span class="font-medium text-slate-600 dark:text-slate-300">{{ row.address.region }}</span>,
                <span class="text-slate-400">{{ row.address.district }}</span>
            </div>
            <div v-else class="text-slate-400">-</div>
        </div>
      </template>

      <template #registeredAt="{ row }">
        <span class="text-xs font-mono text-slate-500">{{ formatDate(row.registeredAt) }}</span>
      </template>

      <template #status="{ row }">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm flex items-center justify-center gap-1.5 w-fit mx-auto"
          :class="{
            'bg-emerald-50 text-emerald-700 border-emerald-200': row.status === 'Online' || row.status === 'active',
            'bg-rose-50 text-rose-700 border-rose-200': row.status !== 'Online' && row.status !== 'active',
          }">
          <i :class="row.status === 'Online' || row.status === 'active' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
          {{ row.status === 'Online' ? 'Aktiv' : 'Nofaol' }}
        </span>
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

/* Dropdown Scale Animation */
.dropdown-scale-enter-active,
.dropdown-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ANIMATSIYA: Pop Effect */
.dropdown-pop-enter-active,
.dropdown-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-pop-enter-from,
.dropdown-pop-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.8) translateX(10px);
}

/* ZOOM ANIMATION */
.dropdown-zoom-enter-active,
.dropdown-zoom-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-zoom-enter-from,
.dropdown-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>