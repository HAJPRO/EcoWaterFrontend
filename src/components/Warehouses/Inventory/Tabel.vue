<template>
  <div class="h-screen w-full rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] flex font-sans overflow-hidden text-slate-800 dark:text-slate-200 selection:bg-blue-500 selection:text-white transition-colors duration-300">
    
    <div class="flex-1 flex flex-col min-w-0 bg-[#F1F5F9] dark:bg-[#0F172A] relative z-0 border-r border-slate-300 dark:border-slate-800">
      
      <header class="h-16 shrink-0 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-5 sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <i class="fa-solid fa-clipboard-check text-lg"></i>
          </div>
          <h1 class="text-base font-bold tracking-tight">Ecowater <span class="text-blue-600 dark:text-blue-400">AUDIT</span></h1>
        </div>
        <div class="flex items-center gap-2">
           <div class="hidden lg:block text-right mr-3 pr-3 border-r border-slate-300 dark:border-slate-600">
            <div class="text-xs font-bold font-mono text-slate-700 dark:text-slate-200">{{ currentTime }}</div>
            <div class="text-[10px] text-slate-400 uppercase tracking-wide">{{ currentDate }}</div>
          </div>
          <button @click="toggleTheme" class="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 hover:text-amber-500 transition flex items-center justify-center">
            <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
          </button>
        </div>
      </header>

      <div class="px-5 py-4 flex gap-3 shrink-0 z-10 sticky top-16 bg-[#F1F5F9]/95 dark:bg-[#0F172A]/95 backdrop-blur-sm">
        <div class="relative w-[220px]" ref="categoryMenuRef">
          <button @click="showCategoryMenu = !showCategoryMenu" class="w-full h-11 bg-white dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between px-3 hover:border-blue-500 transition shadow-sm group">
            <div class="flex items-center gap-2 overflow-hidden">
              <div class="w-6 h-6 rounded bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-blue-600 text-xs">
                <i :class="selectedCategoryIcon"></i>
              </div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ activeCategory }}</span>
            </div>
            <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200" :class="{'rotate-180': showCategoryMenu}"></i>
          </button>
          
          <transition name="dropdown">
            <div v-if="showCategoryMenu" class="absolute top-[calc(100%+6px)] left-0 w-full bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-30 p-2">
              <button v-for="cat in categories" :key="cat.name" @click="selectCategory(cat)" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-blue-50 dark:hover:bg-slate-700 transition" :class="activeCategory === cat.name ? 'text-blue-600 font-bold bg-blue-50 dark:bg-slate-700' : 'text-slate-600 dark:text-slate-400'">
                <i :class="cat.icon"></i> {{ cat.name }}
              </button>
            </div>
          </transition>
        </div>

        <div class="relative flex-1 group">
          <i class="fa-solid fa-barcode absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
          <input v-model="productSearch" type="text" placeholder="Skaner yoki nomini yozing..." class="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none">
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-5 pb-5 custom-scroll-blue">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            @click="addToAudit(product)"
            class="group bg-white dark:bg-[#1E293B] rounded-2xl p-2.5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all duration-200 active:scale-[0.97] select-none flex flex-col relative overflow-hidden"
            :class="{'ring-2 ring-blue-500/50': isProductInAudit(product.id)}"
          >
            <div class="absolute top-2 left-2 z-10 bg-slate-100 dark:bg-slate-800/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-sm">
                <i class="fa-solid fa-database mr-1 text-blue-500"></i> {{ product.systemStock }}
            </div>

            <div class="aspect-[4/3] rounded-xl bg-slate-100 dark:bg-slate-900 overflow-hidden mb-2.5 relative">
              <img :src="product.image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
              <div class="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div class="bg-white/90 dark:bg-slate-800/90 rounded-full p-2.5 shadow-lg text-blue-600 dark:text-blue-400 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                   <i class="fa-solid fa-check text-lg"></i>
                 </div>
              </div>
            </div>
            
            <div class="mt-auto px-1">
              <h3 class="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1 mb-0.5">{{ product.name }}</h3>
              <div class="flex justify-between items-center text-[10px] text-slate-400">
                 <span>Narx:</span>
                 <span class="font-mono text-slate-600 dark:text-slate-300">{{ formatPrice(product.price) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-[480px] lg:w-[550px] shrink-0 bg-white dark:bg-[#0B1120] shadow-2xl z-10 flex flex-col h-full border-l border-slate-300 dark:border-slate-700">
      
      <div class="shrink-0 bg-slate-100 dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-700 px-3 pt-3 flex items-end gap-1 overflow-x-auto no-scrollbar">
        <button 
          v-for="session in sessions" :key="session.id" 
          @click="activeSessionId = session.id"
          class="relative px-3 py-2.5 rounded-t-lg text-[10px] font-bold transition-all min-w-[130px] flex items-center justify-between gap-2 border-t border-x border-transparent"
          :class="activeSessionId === session.id 
            ? 'bg-white dark:bg-[#0B1120] text-blue-600 dark:text-blue-400 border-slate-200 dark:border-slate-700 !border-b-transparent z-10' 
            : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'"
        >
          <span><i class="fa-solid fa-list-check mr-1"></i> {{ session.name }}</span>
          <span v-if="sessions.length > 1" @click.stop="removeSession(session.id)" class="hover:text-red-500"><i class="fa-solid fa-xmark"></i></span>
        </button>
        <button @click="addSession" class="w-8 h-8 mb-1 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition"><i class="fa-solid fa-plus text-xs"></i></button>
      </div>

      <div class="shrink-0 p-4 bg-white dark:bg-[#0B1120] border-b border-slate-100 dark:border-slate-800 z-10 flex items-center justify-between">
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mas'ul shaxs</div>
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-2">
                <div class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]"><i class="fa-solid fa-user"></i></div>
                Admin User
            </div>
          </div>
          <div class="text-right">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Holat</div>
              <div class="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full inline-block mt-0.5">Jarayonda</div>
          </div>
      </div>

      <div class="flex-1 overflow-y-auto p-3 custom-scroll-blue bg-slate-50/50 dark:bg-[#0B1120] relative min-h-0">
        <div v-if="activeSessionData.items.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 select-none">
          <i class="fa-solid fa-scale-balanced text-4xl mb-3 opacity-40"></i>
          <p class="text-xs font-bold uppercase tracking-wider opacity-70">Tekshiruv ro'yxati bo'sh</p>
        </div>

        <transition-group name="list" tag="div" class="space-y-2">
          <div 
            v-for="item in activeSessionData.items" 
            :key="item.id" 
            class="group bg-white dark:bg-[#1E293B] p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all select-none relative"
            :class="{
                'border-l-4 !border-l-emerald-500': getDiff(item) === 0,
                'border-l-4 !border-l-rose-500': getDiff(item) < 0,
                'border-l-4 !border-l-amber-500': getDiff(item) > 0
            }"
          >
            <div class="flex gap-3 items-center">
                <img :src="item.image" class="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0">
                
                <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">{{ item.name }}</h4>
                    <div class="flex items-center gap-3 text-[10px] text-slate-500">
                        <span class="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">Tizimda: <b>{{ item.systemStock }}</b></span>
                        <span class="font-mono">{{ formatPrice(item.price) }}</span>
                    </div>
                </div>

                <div class="flex flex-col items-end gap-1">
                    <label class="text-[8px] uppercase font-bold text-slate-400">Sanaldi (Fakt)</label>
                    <div class="flex items-center">
                        <input 
                            v-model.number="item.countedStock" 
                            type="number" 
                            class="w-20 h-9 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-center text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            :class="{
                                'text-rose-600': getDiff(item) < 0,
                                'text-emerald-600': getDiff(item) === 0,
                                'text-amber-600': getDiff(item) > 0
                            }"
                        >
                    </div>
                </div>

                <button @click="removeItem(item.id)" class="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-rose-500 transition"><i class="fa-solid fa-trash-can text-xs"></i></button>
            </div>

            <div class="flex justify-between items-center mt-2 pt-1 border-t border-dashed border-slate-100 dark:border-slate-700/50">
                <div class="text-[10px] font-bold">
                    <span v-if="getDiff(item) === 0" class="text-emerald-500 flex items-center gap-1"><i class="fa-solid fa-check-circle"></i> Farq yo'q</span>
                    <span v-else-if="getDiff(item) < 0" class="text-rose-500 flex items-center gap-1"><i class="fa-solid fa-circle-exclamation"></i> Kamomat: {{ getDiff(item) }} ta</span>
                    <span v-else class="text-amber-500 flex items-center gap-1"><i class="fa-solid fa-arrow-trend-up"></i> Ortiqcha: +{{ getDiff(item) }} ta</span>
                </div>
                <div class="text-[10px] font-mono font-bold" :class="getDiffValue(item) < 0 ? 'text-rose-500' : (getDiffValue(item) > 0 ? 'text-amber-500' : 'text-slate-300')">
                    {{ formatPrice(getDiffValue(item)) }}
                </div>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="shrink-0 bg-white dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-700 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50">
        
        <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-2.5 border border-rose-100 dark:border-rose-900/50 flex flex-col justify-center">
                <span class="text-[9px] font-bold uppercase text-rose-400 tracking-wider mb-0.5">Jami Kamomat</span>
                <span class="text-sm font-black text-rose-600 dark:text-rose-400">{{ formatPrice(totalShortageValue) }}</span>
                <span class="text-[9px] text-rose-400/80">{{ totalShortageQty }} ta mahsulot</span>
            </div>
             <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-2.5 border border-amber-100 dark:border-amber-900/50 flex flex-col justify-center">
                <span class="text-[9px] font-bold uppercase text-amber-500 tracking-wider mb-0.5">Jami Ortiqcha</span>
                <span class="text-sm font-black text-amber-600 dark:text-amber-400">+{{ formatPrice(totalSurplusValue) }}</span>
                 <span class="text-[9px] text-amber-500/80">{{ totalSurplusQty }} ta mahsulot</span>
            </div>
        </div>

        <div class="flex items-center justify-between mb-3 px-1">
             <div class="text-xs text-slate-500">Jami tekshirildi: <b>{{ activeSessionData.items.length }}</b> pozitsiya</div>
             <div class="text-xs font-bold" :class="netDiffValue >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                Sof Farq: {{ formatPrice(netDiffValue) }}
             </div>
        </div>

        <button 
          @click="finishAudit"
          :disabled="activeSessionData.items.length === 0"
          class="w-full h-12 rounded-2xl font-bold shadow-xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide"
          :class="activeSessionData.items.length > 0
            ? 'bg-slate-800 hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-slate-500/30' 
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-70'"
        >
          <i class="fa-solid fa-file-signature"></i>
          Reviziyani Yakunlash
        </button>
      </div>

    </div>

    <transition name="toast">
      <div v-if="toast.show" class="fixed top-20 right-6 z-[100] px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl border border-white/20 flex items-center gap-3" :class="toast.type === 'error' ? 'bg-rose-500/95 text-white' : 'bg-slate-800/95 text-white'">
        <i :class="toast.type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check'"></i>
        <span class="text-xs font-bold tracking-wide">{{ toast.message }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, reactive } from "vue"

// --- 🛠️ Mock Data ---
const categories = [
  { name: "Barchasi", icon: "fa-solid fa-border-all" },
  { name: "Ichimliklar", icon: "fa-solid fa-bottle-water" },
  { name: "Sneklar", icon: "fa-solid fa-cookie-bite" },
  { name: "Xo'jalik", icon: "fa-solid fa-soap" }
]

const products = ref(Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `Mahsulot ${i + 1} - ${['Coca Cola 1.5L', 'Fanta 0.5L', 'Pepsi 1L', 'Chips Lays'][i % 4]}`,
  price: Math.floor(Math.random() * 500) * 100 + 5000,
  category: ["Ichimliklar", "Sneklar", "Xo'jalik"][i % 3],
  image: `https://picsum.photos/200/200?random=${i + 300}`,
  systemStock: Math.floor(Math.random() * 50) + 10 // Tizimdagi qoldiq
})))

// State
const isDark = ref(false)
const currentTime = ref("")
const currentDate = ref("")
const productSearch = ref("")
const activeCategory = ref("Barchasi")
const showCategoryMenu = ref(false)
const categoryMenuRef = ref(null)

// Logic
const sessions = ref([{ id: 1, name: "Reviziya #1", items: [] }])
const activeSessionId = ref(1)

const activeSessionData = computed(() => sessions.value.find(s => s.id === activeSessionId.value) || sessions.value[0])
const selectedCategoryIcon = computed(() => categories.find(c => c.name === activeCategory.value)?.icon || 'fa-solid fa-layer-group')

const filteredProducts = computed(() => {
  let list = products.value
  if (activeCategory.value !== "Barchasi") list = list.filter(p => p.category === activeCategory.value)
  if (productSearch.value) list = list.filter(p => p.name.toLowerCase().includes(productSearch.value.toLowerCase()))
  return list
})

// Helper to check if added
const isProductInAudit = (id) => activeSessionData.value.items.some(i => i.id === id)

// --- Calculations ---
const getDiff = (item) => (item.countedStock || 0) - item.systemStock
const getDiffValue = (item) => getDiff(item) * item.price

// Stats
const totalShortageValue = computed(() => activeSessionData.value.items.reduce((sum, item) => {
    const val = getDiffValue(item)
    return val < 0 ? sum + Math.abs(val) : sum
}, 0))

const totalShortageQty = computed(() => activeSessionData.value.items.reduce((sum, item) => {
    const diff = getDiff(item)
    return diff < 0 ? sum + Math.abs(diff) : sum
}, 0))

const totalSurplusValue = computed(() => activeSessionData.value.items.reduce((sum, item) => {
    const val = getDiffValue(item)
    return val > 0 ? sum + val : sum
}, 0))

const totalSurplusQty = computed(() => activeSessionData.value.items.reduce((sum, item) => {
    const diff = getDiff(item)
    return diff > 0 ? sum + diff : sum
}, 0))

const netDiffValue = computed(() => totalSurplusValue.value - totalShortageValue.value)

// --- Actions ---
const selectCategory = (cat) => { activeCategory.value = cat.name; showCategoryMenu.value = false }

const addToAudit = (product) => {
  const items = activeSessionData.value.items
  const existing = items.find(i => i.id === product.id)
  
  if (existing) {
    showToast("Bu mahsulot allaqachon ro'yxatda!", "error")
    // Real proyektda bu inputga focus qaratishi mumkin
  } else {
    items.unshift({
      ...product,
      countedStock: 0 // Default 0 to force counting. Or use product.systemStock if you trust system.
    })
    showToast("Ro'yxatga qo'shildi")
  }
}

const removeItem = (id) => { activeSessionData.value.items = activeSessionData.value.items.filter(i => i.id !== id) }

const addSession = () => {
  const id = Date.now()
  sessions.value.push({ id, name: `Zona ${sessions.value.length + 1}`, items: [] })
  activeSessionId.value = id
}

const removeSession = (id) => {
  if (sessions.value.length <= 1) return
  const idx = sessions.value.findIndex(s => s.id === id)
  sessions.value = sessions.value.filter(s => s.id !== id)
  if (activeSessionId.value === id) activeSessionId.value = sessions.value[Math.max(0, idx - 1)].id
}

const finishAudit = () => {
    // Backend Payload tayyorlash
    const payload = {
        session_name: activeSessionData.value.name,
        total_shortage: totalShortageValue.value,
        total_surplus: totalSurplusValue.value,
        details: activeSessionData.value.items.map(i => ({
            product_id: i.id,
            system_stock: i.systemStock,
            actual_stock: i.countedStock,
            diff: getDiff(i)
        }))
    }
    console.log("Audit Payload:", payload)
    showToast("Reviziya hujjati saqlandi!", "success")
    
    // Reset or New Session
    activeSessionData.value.items = []
}

const formatPrice = (val) => new Intl.NumberFormat('uz-UZ').format(val) + " so'm"
const toggleTheme = () => { isDark.value = !isDark.value; document.documentElement.classList.toggle("dark", isDark.value) }

// Toast Logic
const toast = reactive({ show: false, message: "", type: "success" })
let toastTimer
const showToast = (msg, type="success") => {
  toast.message = msg; toast.type = type; toast.show = true
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.show = false, 2500)
}

const handleClickOutside = (e) => {
  if (categoryMenuRef.value && !categoryMenuRef.value.contains(e.target)) showCategoryMenu.value = false
}

let timer
onMounted(() => {
  timer = setInterval(() => {
    const d = new Date()
    currentTime.value = d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    currentDate.value = d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', weekday: 'long' })
  }, 1000)
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => { clearInterval(timer); document.removeEventListener('click', handleClickOutside) })
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: 0; }

.custom-scroll-blue::-webkit-scrollbar { width: 4px; }
.custom-scroll-blue::-webkit-scrollbar-track { background: transparent; }
.custom-scroll-blue::-webkit-scrollbar-thumb { background-color: #93c5fd; border-radius: 10px; }
.dark .custom-scroll-blue::-webkit-scrollbar-thumb { background-color: #1e40af; }

/* Transitions */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.96); }

.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-10px); }

.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-20px) scale(0.9); }
</style>