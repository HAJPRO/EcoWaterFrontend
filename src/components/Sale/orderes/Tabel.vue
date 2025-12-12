<script setup>
import { ref, computed, shallowRef } from 'vue'
import DataTable from '../../../UI/DataTable.vue' // <-- Yangi komponentni import qildik

// --- 1. CONFIGURATION (Jadval Ustunlari) ---
// fixed: 'left' | 'right' -> ustunni qotirish
// sortable: true -> saralash tugmasi chiqadi
// width: ustun kengligi (majburiy sticky ishlashi uchun)
const columns = [
  { key: 'order_number', label: 'Buyurtma', width: '150px', fixed: 'left', sortable: true },
  { key: 'customer.name', label: 'Mijoz', width: '220px', sortable: true },
  { key: 'customer.phone', label: 'Telefon', width: '160px' },
  { key: 'region', label: 'Viloyat', width: '140px' },
  { key: 'payment_method', label: 'To\'lov', width: '140px' },
  { key: 'driver', label: 'Haydovchi', width: '140px' },
  { key: 'weight', label: 'Og\'irlik', width: '120px', align: 'center' },
  { key: 'createdAt', label: 'Vaqt', width: '160px', align: 'center', sortable: true },
  { key: 'total_amount', label: 'Summa', width: '160px', align: 'right', sortable: true },
  { key: 'status', label: 'Holat', width: '160px', align: 'center' },
  { key: 'actions', label: '', width: '80px', fixed: 'right', align: 'center' }
]

// --- 2. DATA (MOCK) ---
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
  createdAt: '2025-11-10T08:00:00Z',
  total_amount: (Math.floor(Math.random() * 20) + 5) * 100000,
  status: ['Yangi buyurtma', 'Yetkazib berilmoqda', 'Yetkazib berildi', 'Bekor qilingan', 'Arxivlangan'][i % 5]
})))

// --- 3. STATE ---
const searchText = ref('')
const selectedIds = ref([])
const activeDropdown = ref(null)
const isExportDropdownOpen = ref(false)

// --- COMPUTED (SEARCH FILTER) ---
// Jadval komponenti faqat tayyor datani ko'rsatadi, qidiruvni shu yerda qilamiz
const filteredItems = computed(() => {
  const s = searchText.value.toLowerCase()
  return orders.value.filter(o => 
    o.order_number.toLowerCase().includes(s) || 
    o.customer.name.toLowerCase().includes(s)
  )
})

// --- UTILS ---
const formatDate = (d) => new Intl.DateTimeFormat('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
const formatPrice = (p) => new Intl.NumberFormat('uz-UZ').format(p)

// Actions
// --- ACTION BUTTONS CONFIGURATION ---
// Ikonkalar "fa-solid" ekanligiga ishonch hosil qiling
const rowActions = [
  { 
    label: "Ko'rish", 
    action: 'view', 
    icon: "fa-solid fa-eye", // Aniq klass
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

// Tugma bosilganda ishlaydigan funksiya
const handleAction = (actionName, row) => {
  console.log(actionName, row);
  // activeDropdown.value = null; // Menyuni yopish
}
</script>

<template>
  <div class="h-screen flex flex-col gap-2 p-1 text-slate-700 dark:text-slate-300 font-sans overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
    
    <div class="flex-none flex flex-col sm:flex-row justify-between items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md z-10">
      
      <div class="relative w-full sm:w-72 group">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xs"></i>
        <input 
          v-model="searchText" 
          placeholder="Qidiruv (Ism, ID)..." 
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

                 <button class="w-full text-left p-3 rounded-xl hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 flex items-start gap-4 transition-all group/item mb-1 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-lg shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-transform duration-300">
                      <i class="fa-solid fa-file-excel"></i>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                         <span class="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover/item:text-emerald-700 transition-colors">Excel Report</span>
                         <span class="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">PRO</span>
                      </div>
                      <div class="text-[11px] text-slate-400 mt-0.5">To'liq jadval (.xlsx)</div>
                    </div>
                 </button>

                 <button class="w-full text-left p-3 rounded-xl hover:bg-rose-50/50 dark:hover:bg-rose-900/10 flex items-start gap-4 transition-all group/item border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20">
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
         <button class="btn-primary w-full sm:w-auto"><i class="fa-solid fa-plus mr-2"></i> Qo'shish</button>
      </div>
    </div>

    <DataTable 
      :items="filteredItems" 
      :columns="columns" 
      v-model:selected="selectedIds"
    >
      <template #order_number="{ row }">
        <span class="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{{ row.order_number }}</span>
      </template>

      <template #customer.name="{ row }">
        <div>
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{ row.customer.name }}</span><br>
          <span class="text-[10px] text-slate-400 font-mono">{{ row.customer.artikul }}</span>
        </div>
      </template>

      <template #payment_method="{ row }">
        <span class="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">{{ row.payment_method }}</span>
      </template>

      <template #weight="{ row }">
        <span class="font-mono text-xs">{{ row.weight }}</span>
      </template>

      <template #createdAt="{ row }">
        <span class="text-xs">{{ formatDate(row.createdAt) }}</span>
      </template>

      <template #total_amount="{ row }">
        <span class="font-mono font-medium text-emerald-600">{{ formatPrice(row.total_amount) }}</span>
      </template>

      <template #status="{ row }">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm"
          :class="{
            'bg-emerald-50 text-emerald-700 border-emerald-200': row.status === 'Yangi buyurtma',
            'bg-amber-50 text-amber-700 border-amber-200': row.status === 'Yetkazib berilmoqda',
            'bg-blue-50 text-blue-700 border-blue-200': row.status === 'Yetkazib berildi',
            'bg-slate-50 text-slate-600 border-slate-200': row.status === 'Arxivlangan',
            'bg-red-50 text-red-700 border-red-200': row.status === 'Bekor qilingan',
          }">{{ row.status }}</span>
      </template>

   <template #actions="{ row }">
    <div class="relative flex items-center justify-center">
      
      <button 
        @click.stop="activeDropdown = activeDropdown === row.id ? null : row.id" 
        class="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ease-out outline-none"
        :class="[
          activeDropdown === row.id 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 transform scale-110' 
            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200'
        ]"
      >
        <i class="fa-solid fa-ellipsis-vertical text-lg"></i>
      </button>

      <transition name="dropdown-pop">
        <div 
          v-if="activeDropdown === row.id" 
          class="absolute right-10 top-1/2 -translate-y-1/2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 p-2 z-60 origin-right"
        >
          <div class="px-3 py-2 mb-1 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
             <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: #{{ row.order_number || row.id }}</span>
             <button @click.stop="activeDropdown = null" class="text-slate-400 hover:text-rose-500"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="flex flex-col gap-1">
            <button 
              v-for="(btn, index) in rowActions" 
              :key="index" 
              @click.stop="handleAction(btn.action, row)"
              class="group w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <div 
                class="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110"
                :class="btn.colorClass"
              >
                <i :class="btn.icon" class="text-sm"></i>
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