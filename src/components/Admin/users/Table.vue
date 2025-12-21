<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { UserStore } from "../../../stores/Admin/user.store";
import moment from "moment-timezone";

// UI Components
import DataTable from "../../../UI/DataTable.vue";
import Select from "../../../UI/Select.vue";
import Button from "../../../UI/Button.vue";
import ExportDropdown from "../../../UI/ExportDropdown.vue";

const store = UserStore();
const { items } = storeToRefs(store);

// --- STATE ---
const searchText = ref("");
const filterRole = ref(null);

// --- CONFIGURATION (Table Columns) ---
const columns = [
  { key: 'username', label: 'Foydalanuvchi nomi', width: '220px', fixed: 'left', sortable: true },
  { key: 'department', label: 'Bo\'lim', width: '180px' },
  { key: 'role', label: 'Rol', width: '150px', align: 'center' },
  { key: 'permissions', label: 'Ruxsatlar', width: '250px' },
  { key: 'status', label: 'Holati', width: '130px', align: 'center' },
  { key: 'actions', label: 'Amallar', width: '100px', fixed: 'right', align: 'center' }
];

// Role Options for Filter
const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'User', value: 'user' }
];

// --- METHODS ---
const update = (id) => {
  store.UpdateUserModal({ id });
};

const deleteUser = (id) => {
  // store.DeleteUser(id);
  console.log("Delete user:", id);
};

// --- COMPUTED (Filtering) ---
const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesSearch = !searchText.value || 
      item.username?.toLowerCase().includes(searchText.value.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchText.value.toLowerCase());
    
    const matchesRole = !filterRole.value || item.role === filterRole.value;
    
    return matchesSearch && matchesRole;
  });
});
onMounted(async () =>{
  store.GetUsers()
})
</script>

<template>
  <div class="flex flex-col gap-4 p-2 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen font-sans">
    
    <div class="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all">
      <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div class="relative w-full sm:w-80 group">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
          <input 
            v-model="searchText" 
            placeholder="Foydalanuvchi yoki bo'lim..." 
            class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
          >
        </div>

        <div class="w-full sm:w-48 transition-all">
          <Select 
            v-model="filterRole" 
            :options="roleOptions" 
            placeholder="Barcha rollar" 
            clearable
            class="w-full"
          />
        </div>
      </div>

      <div class="flex items-center gap-3 w-full lg:w-auto justify-end">
        <ExportDropdown class="shrink-0" />
        <div class="hidden lg:block w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
        <Button 
          variant="primary" 
          left-icon="fa-solid fa-user-plus" 
          @click="store.AddUserModal()"
          size="sm"
          class="shadow-lg shadow-indigo-500/25 active:scale-95 transition-all font-bold whitespace-nowrap px-6 rounded-xl"
        >
          Yangi foydalanuvchi
        </Button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <DataTable 
        :items="filteredItems" 
        :columns="columns" 
        height="65vh"
        class="modern-table"
      >
        <template #username="{ row }">
          <div class="flex items-center gap-3.5 py-1">
            <div class="relative group">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-200 dark:shadow-none group-hover:rotate-6 transition-transform">
                {{ row.username?.charAt(0).toUpperCase() }}
              </div>
              <div v-if="row.status === 'offline'" class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
            </div>
            <div class="flex flex-col leading-tight">
              <span class="font-bold text-slate-800 dark:text-slate-100 text-[14px]">{{ row.username }}</span>
              <span class="text-[11px] text-slate-400 font-medium italic mt-0.5">@{{ row.username?.toLowerCase() }}</span>
            </div>
          </div>
        </template>

        <template #department="{ row }">
          <div class="flex flex-col">
            <span class="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{{ row.department || '---' }}</span>
            <span class="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Tizim bo'limi</span>
          </div>
        </template>

        <template #role="{ row }">
          <div :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm',
            row.role === 'admin' 
              ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' 
              : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20'
          ]">
            <i :class="['fa-solid mr-1.5', row.role === 'admin' ? 'fa-shield-halved' : 'fa-user-tie']"></i>
            {{ row.role }}
          </div>
        </template>

        <template #permissions="{ row }">
          <div class="flex flex-wrap gap-1.5 max-w-[240px]">
            <span v-for="p in row.permissions?.slice(0, 3)" :key="p" 
              class="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
              {{ p }}
            </span>
            <div v-if="row.permissions?.length > 3" 
                 class="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-500/20 cursor-help"
                 :title="row.permissions.join(', ')">
              +{{ row.permissions.length - 3 }}
            </div>
          </div>
        </template>

        <template #status="{ row }">
          <div class="flex justify-center">
            <div :class="[
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all',
              row.status === 'offline' 
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' 
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
            ]">
              <span class="relative flex h-2 w-2">
                <span :class="['animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', row.status === 'offline' ? 'bg-emerald-400' : 'bg-slate-300']"></span>
                <span :class="['relative inline-flex rounded-full h-2 w-2', row.status === 'offline' ? 'bg-emerald-500' : 'bg-slate-400']"></span>
              </span>
              {{ row.status === 'offline' ? 'Faol' : 'Nofaol' }}
            </div>
          </div>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center justify-center gap-2">
            <button 
              @click="update(row._id)" 
              class="w-9 h-9 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 rounded-xl transition-all duration-300 shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800"
            >
              <i class="fa-solid fa-user-gear text-sm"></i>
            </button>
            <button 
              @click="deleteUser(row._id)" 
              class="w-9 h-9 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800"
            >
              <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
          </div>
        </template>

      </DataTable>
    </div>

   
  </div>
</template>

<style scoped>
/* Keraksiz CSS larni olib tashladik, Tailwind orqali boshqardik */
</style>