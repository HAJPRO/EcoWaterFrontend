<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import moment from "moment-timezone";

// --- COMPONENTS ---
import DataTable from "../../../../UI/DataTable.vue"; 
import PermissionModal from "./AddPermissionModal.vue";
import RoleModal from "./AddRoleModel.vue";

// --- STORES ---
import { PermissionStore } from "../../../../stores/Admin/permission.store";
import { RoleStore } from "../../../../stores/Admin/role.store";

const store_role = RoleStore();
const store_permission = PermissionStore();

const { roles } = storeToRefs(store_role);
const { permissions, status } = storeToRefs(store_permission); // status: 1=Role, 2=Permission

// --- 1. CONFIGURATION (Jadval Ustunlari) ---
const commonColumns = [
  { key: 'name', label: 'Nomi', width: '200px', fixed: 'left', sortable: true },
  { key: 'value', label: 'Qiymati (Value)', width: '200px' },
  { key: 'description', label: "Ma'lumot", width: '300px' },
  { key: 'createdAt', label: 'Yaratilgan sana', width: '180px', align: 'center' },
  { key: 'status', label: 'Holat', width: '120px', align: 'center' },
  { key: 'actions', label: '', width: '80px', fixed: 'right', align: 'center' }
];

// Hozirgi holatga qarab ma'lumotlarni tanlash
const currentData = computed(() => status.value === 1 ? roles.value : permissions.value);

// --- 2. STATE ---
const searchText = ref("");
const selectedIds = ref([]);
const activeDropdown = ref(null); // Jadval ichidagi dropdown IDsi
const isExportDropdownOpen = ref(false); // Export dropdown holati
const currentPage = ref(1);

// --- 3. CLICK OUTSIDE LOGIC (Tashqariga bosganda yopish) ---
const closeDropdowns = (event) => {
  // 1. Export Dropdownni yopish
  const exportWrapper = event.target.closest('.export-wrapper');
  if (!exportWrapper && isExportDropdownOpen.value) {
    isExportDropdownOpen.value = false;
  }

  // 2. Row Action Dropdownni yopish
  const actionWrapper = event.target.closest('.action-wrapper');
  if (!actionWrapper && activeDropdown.value !== null) {
    activeDropdown.value = null;
  }
};

onMounted(() => {
  store_role.GetAll(); 
  store_permission.GetAll();
  // Ekranning istalgan joyiga bosilganda tekshirish
  window.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdowns);
});

// --- 4. METHODS ---

// Modallar (Universal funksiya)
const openAddModal = (status) => {
  if (status === 1) {
    store_role.AddRoleModal(); // Rol qo'shish
  } else {
    store_permission.AddPermissionModal(); // Ruxsat qo'shish
  }
};

const handleExport = (type) => {
  isExportDropdownOpen.value = false;
  ElMessage.success(`${type.toUpperCase()} yuklanmoqda...`);
};

// Row Actions
const rowActions = [
  { label: "Batafsil", action: 'view', icon: "fa-solid fa-eye", colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { label: "O'zgartirish", action: 'edit', icon: "fa-solid fa-pen-to-square", colorClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { label: "O'chirish", action: 'delete', icon: "fa-solid fa-trash", colorClass: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
];

const handleAction = (actionName, row) => {
  activeDropdown.value = null;
  if (actionName === 'edit') {
     console.log("Edit:", row);
  } else if (actionName === 'delete') {
     console.log("Delete:", row);
  }
};

// Utils
const formatDate = (date) => {
  if (!date) return "-";
  return moment.utc(date).tz("Asia/Tashkent").format("DD.MM.YYYY HH:mm");
};

const handlePageChange = (page) => {
  currentPage.value = page;
};
</script>

<template>
  <RoleModal />
  <PermissionModal />

  <div class="h-screen flex flex-col gap-2 p-1 text-slate-700 dark:text-slate-300 font-sans overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
    
    <div class="flex-none flex flex-col sm:flex-row justify-between items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md z-10">
      
      <div class="relative w-full sm:w-72 group">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
        <input 
          v-model="searchText" 
          :placeholder="status === 1 ? 'Rol nomi bo\'yicha...' : 'Ruxsat nomi bo\'yicha...'" 
          class="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
        >
      </div>

      <div class="flex gap-2 w-full sm:w-auto items-center">
         
         <div class="relative export-wrapper">
            <button 
              @click.stop="isExportDropdownOpen = !isExportDropdownOpen" 
              class="btn-secondary w-full sm:w-auto group relative overflow-hidden"
              :class="{'border-indigo-500 ring-1 ring-indigo-500/20': isExportDropdownOpen}"
            >
              <span class="relative z-40 flex items-center">
                <i class="fa-solid fa-cloud-arrow-down mr-2 text-slate-400 group-hover:text-indigo-600 transition-colors text-sm"></i> 
                <span class="font-semibold text-sm text-slate-600 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">Export</span>
                <i class="fa-solid fa-chevron-down ml-2 text-[10px] text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-indigo-600': isExportDropdownOpen}"></i>
              </span>
            </button>
            
            <transition name="dropdown-zoom">
              <div 
                v-if="isExportDropdownOpen" 
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 z-40 overflow-hidden origin-top-right p-1"
              >
                 <button @click="handleExport('excel')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 flex items-center gap-3 transition-all group/item mb-1">
                    <i class="fa-solid fa-file-excel text-emerald-500 text-lg"></i>
                    <span class="text-xs font-medium text-slate-600 dark:text-slate-300">Excel Report</span>
                 </button>
                 <button @click="handleExport('pdf')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50/50 dark:hover:bg-rose-900/10 flex items-center gap-3 transition-all group/item">
                    <i class="fa-solid fa-file-pdf text-rose-500 text-lg"></i>
                    <span class="text-xs font-medium text-slate-600 dark:text-slate-300">PDF Document</span>
                 </button>
              </div>
            </transition>
         </div>

         <button @click="openAddModal(1)" class="btn-primary w-full sm:w-auto">
            <i class="fa-solid fa-plus mr-2 text-sm"></i> 
            <span class="text-sm">
                {{ status === 1 ? "Rol qo'shish" : "Ruxsat qo'shish" }}
            </span>
         </button>
              <button  @click="openAddModal(2)" class="btn-secondary w-full sm:w-auto">
            <i class="fa-solid fa-plus mr-2 text-sm"></i> 
            <span class="text-sm">
                {{ status === 2 ? "Ruxsats qo'shish" : "Ruxsat qo'shish" }}
            </span>
         </button>
      </div>
    </div>

    <DataTable 
      :items="currentData" 
      :columns="commonColumns" 
      v-model:selected="selectedIds"
    >
      <template #name="{ row }">
        <span class="font-semibold text-slate-700 dark:text-slate-200">{{ row.name }}</span>
      </template>

      <template #value="{ row }">
        <span class="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
            {{ row.value }}
        </span>
      </template>

      <template #description="{ row }">
         <span class="text-xs text-slate-500 truncate block max-w-[300px]">{{ row.description || '-' }}</span>
      </template>

      <template #createdAt="{ row }">
         <span class="text-xs font-mono text-slate-500">{{ formatDate(row.createdAt) }}</span>
      </template>

      <template #status>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm flex items-center justify-center gap-1.5 w-fit mx-auto bg-emerald-50 text-emerald-700 border-emerald-200">
          <i class="fa-solid fa-circle-check"></i> Aktiv
        </span>
      </template>

      <template #actions="{ row }">
        <div class="relative flex items-center justify-center action-wrapper">
          <button 
            @click.stop="activeDropdown = activeDropdown === row._id ? null : row._id" 
            class="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ease-out outline-none text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            :class="{'bg-indigo-600 text-white shadow-lg': activeDropdown === row._id}"
          >
            <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
          </button>

          <transition name="dropdown-pop">
            <div v-if="activeDropdown === row._id" class="absolute right-10 top-1/2 -translate-y-1/2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-1 z-50">
              <div class="flex flex-col gap-0.5">
                <button v-for="(btn, index) in rowActions" :key="index" @click.stop="handleAction(btn.action, row)" class="group w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm" :class="btn.colorClass">
                    <i :class="btn.icon" class="text-xs"></i>
                  </div>
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ btn.label }}</span>
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
/* TUGMALAR STILI (IXCHAMLASHTIRILDI):
   px-4 py-1.5 -> Input balandligi bilan bir xil bo'lishi uchun (padding-y kamaytirildi)
*/
.btn-primary { 
  @apply bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm shadow-indigo-500/20 transition-all flex items-center justify-center; 
}

.btn-secondary { 
  @apply bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-all flex items-center justify-center active:scale-95 shadow-sm; 
}

.no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Animatsiyalar */
.dropdown-pop-enter-active, .dropdown-pop-leave-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.dropdown-pop-enter-from, .dropdown-pop-leave-to { opacity: 0; transform: translateY(-50%) scale(0.9) translateX(10px); }

.dropdown-zoom-enter-active, .dropdown-zoom-leave-active { transition: all 0.2s ease; }
.dropdown-zoom-enter-from, .dropdown-zoom-leave-to { opacity: 0; transform: scale(0.95) translateY(-5px); }
</style>