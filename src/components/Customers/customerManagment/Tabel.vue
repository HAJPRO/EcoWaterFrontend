<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import moment from "moment-timezone";

// --- COMPONENTS ---
import DataTable from "../../../UI/DataTable.vue"; 
import CustomModal from "../../../components/Customers/customerManagment/AddCustomModal.vue";
import DetailInfoModal from "./DetailInfoModal.vue"; // Yo'l to'g'riligini tekshiring

// --- STORE ---
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
const store = CustomerManagmentStore();
const { customers, all_length, isActive } = storeToRefs(store);

// --- 1. CONFIGURATION (Jadval Ustunlari) ---
const columns = [
  { key: 'fullname', label: 'F.I.O', width: '220px', fixed: 'left', sortable: true },
  { key: 'phoneNumber', label: 'Telefon', width: '140px' },
  { key: 'address', label: 'Manzil', width: '200px' },
  { key: 'balance', label: 'Hisob-kitob', width: '180px', align: 'center' }, // Kredit/Debitor
  { key: 'createdAt', label: 'Registratsiya', width: '150px', align: 'center' },
  { key: 'status', label: 'Holat', width: '120px', align: 'center' },
  { key: 'actions', label: '', width: '80px', fixed: 'right', align: 'center' }
];

// --- 2. STATE ---
const filter = reactive({
  fullname: "",
  sort: "",
});
const selectedIds = ref([]);
const activeDropdown = ref(null);
const isExportDropdownOpen = ref(false);
const currentPage = ref(1);

// --- 3. METHODS (ACTIONS) ---

// Ma'lumotlarni yuklash
const loadData = () => {
  store.GetAll({ 
    status: isActive.value, 
    page: currentPage.value, 
    limit: 10,
    filter: filter // Filterni yuborish
  });
};

onMounted(() => {
  loadData();
});

// Qidiruv (Debounce o'rniga oddiy watch, kerak bo'lsa lodash debounce qo'shing)
watch(() => filter.fullname, () => {
  currentPage.value = 1; // Qidirganda 1-sahifaga qaytish
  loadData();
});

// Modallar
const openAddModal = () => {
  store.AddCustomModal({
    action: "create",
    title: "Mijoz kartasini shakillantirish",
  });
};

const handleExport = (type) => {
  // store.ExportExcel() funksiyasini shu yerga ulaysiz
  console.log("Exporting:", type);
  isExportDropdownOpen.value = false;
  ElMessage.success(`${type.toUpperCase()} yuklanmoqda...`);
};

// Row Actions
const rowActions = [
  { 
    label: "Batafsil", 
    action: 'view', 
    icon: "fa-solid fa-magnifying-glass", 
    colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
  },
  { 
    label: "O'zgartirish", 
    action: 'edit', 
    icon: "fa-solid fa-pen-to-square", 
    colorClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" 
  },
  { 
    label: "Excel", 
    action: 'excel', 
    icon: "fa-solid fa-file-excel", 
    colorClass: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
  },
  { 
    label: "O'chirish", 
    action: 'delete', 
    icon: "fa-solid fa-trash", 
    colorClass: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" 
  },
];

const handleAction = (actionName, row) => {
  activeDropdown.value = null;
  
  if (actionName === 'view') {
    store.AddDetailModal({ id: row._id });
  } else if (actionName === 'edit') {
    store.AddCustomModal({
      id: row._id,
      action: "update",
      title: "Mijoz kartasini o'zgartirish",
    });
  } else if (actionName === 'excel') {
    // store.ExportExcel(row._id);
    ElMessage.info("Excel generatsiya qilinmoqda...");
  } else if (actionName === 'delete') {
    store.DeleteById({ id: row._id });
  }
};

// Utils
const copyToClipboard = (text) => {
  if(!text) return;
  navigator.clipboard.writeText(text)
    .then(() => ElMessage.success("Nusxalandi: " + text))
    .catch(() => ElMessage.error("Xatolik"));
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("uz-UZ").format(price || 0);
};

const formatDate = (date) => {
  if (!date) return "-";
  return moment.utc(date).tz("Asia/Tashkent").format("DD.MM.YYYY HH:mm");
};

const handlePageChange = (page) => {
  currentPage.value = page;
  loadData();
};
</script>

<template>
  <CustomModal />
  <DetailInfoModal />

  <div class="h-screen flex flex-col gap-2 p-1 text-slate-700 dark:text-slate-300 font-sans overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
    
  <div class="flex-none flex flex-col sm:flex-row justify-between items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md z-10">
      
      <div class="relative w-full sm:w-72 group">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
        <input 
          v-model="filter.fullname" 
          placeholder="F.I.O yoki Telefon orqali izlash..." 
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
                class="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 z-40 overflow-hidden origin-top-right p-2"
              >
                 <div class="px-2 pb-2 mb-1 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
                    <span class="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">Formatni tanlang</span>
                 </div>

                 <button @click="handleExport('excel')" class="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 flex items-start gap-3 transition-all group/item mb-1 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20">
                    <div class="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-base shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-transform duration-300">
                      <i class="fa-solid fa-file-excel"></i>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                          <span class="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover/item:text-emerald-700 transition-colors">Excel Report</span>
                          <span class="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">PRO</span>
                      </div>
                      <div class="text-[10px] text-slate-400 mt-0.5">To'liq jadval (.xlsx)</div>
                    </div>
                 </button>

                 <button @click="handleExport('pdf')" class="w-full text-left p-2.5 rounded-xl hover:bg-rose-50/50 dark:hover:bg-rose-900/10 flex items-start gap-3 transition-all group/item border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20">
                    <div class="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 flex items-center justify-center text-base shadow-sm group-hover/item:scale-110 group-hover/item:-rotate-3 transition-transform duration-300">
                      <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <div>
                      <div class="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover/item:text-rose-700 transition-colors">PDF Document</div>
                      <div class="text-[10px] text-slate-400 mt-0.5">Chop etish uchun (.pdf)</div>
                    </div>
                 </button>
              </div>
            </transition>
         </div>

         <button @click="openAddModal" class="btn-primary w-full sm:w-auto">
            <i class="fa-solid fa-plus mr-2 text-sm"></i> 
            <span class="text-sm">Mijoz qo'shish</span>
         </button>
      </div>
    </div>

    <DataTable 
      :items="customers" 
      :columns="columns" 
      v-model:selected="selectedIds"
    >
      <template #fullname="{ row }">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                {{ row.fullname ? row.fullname.charAt(0).toUpperCase() : 'M' }}
            </div>
            <div class="flex flex-col">
                <span class="font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-indigo-600 hover:underline" @click="handleAction('view', row)">
                    {{ row.fullname || "Nomsiz mijoz" }}
                </span>
                <span class="text-[10px] text-slate-400">ID: {{ row._id ? row._id.slice(-6) : '---' }}</span>
            </div>
        </div>
      </template>

      <template #phoneNumber="{ row }">
        <div @click="copyToClipboard(row.phoneNumber)" class="group flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors w-fit">
            <span class="font-mono text-xs">{{ row.phoneNumber }}</span>
            <i class="fa-regular fa-copy text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"></i>
        </div>
      </template>

      <template #address="{ row }">
         <div class="text-xs flex flex-col">
            <span class="font-medium text-slate-600 dark:text-slate-300">{{ row.address?.region || "-" }}</span>
            <span class="text-[10px] text-slate-400">{{ row.address?.district || "-" }}</span>
         </div>
      </template>

      <template #balance="{ row }">
        <div class="flex flex-col gap-1 items-center w-full">
            <div class="flex justify-between w-full max-w-[140px] text-[10px] bg-red-50 dark:bg-red-900/10 px-2 py-0.5 rounded text-red-600 border border-red-100 dark:border-red-900/20">
                <span>Kredit:</span>
                <span class="font-bold">{{ formatPrice(150000) }}</span> </div>
            <div class="flex justify-between w-full max-w-[140px] text-[10px] bg-green-50 dark:bg-green-900/10 px-2 py-0.5 rounded text-green-600 border border-green-100 dark:border-green-900/20">
                <span>Debitor:</span>
                <span class="font-bold">{{ formatPrice(0) }}</span> </div>
        </div>
      </template>

      <template #createdAt="{ row }">
         <span class="text-xs font-mono text-slate-500">{{ formatDate(row.createdAt) }}</span>
      </template>

      <template #status="{ row }">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm flex items-center justify-center gap-1.5 w-fit mx-auto"
          :class="[
            row.status === 'Aktiv'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-rose-50 text-rose-700 border-rose-200'
          ]">
          <i :class="row.status === 'Aktiv' ? 'fa-solid fa-circle-check' : 'fa-solid fa-hourglass-start'"></i>
          {{ row.status }}
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
/* BUTTON STYLES (Ixcham va Inputga mos) */
.btn-primary { 
  @apply bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm shadow-indigo-500/20 transition-all flex items-center justify-center; 
}

.btn-secondary { 
  @apply bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-all flex items-center justify-center active:scale-95 shadow-sm; 
}
</style>