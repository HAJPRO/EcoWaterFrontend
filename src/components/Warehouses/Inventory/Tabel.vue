<template>
  <div class="h-screen w-full bg-[#F1F5F9] dark:bg-[#020617] flex flex-col font-sans overflow-hidden text-slate-600 dark:text-slate-400 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
    
    <header class="h-16 shrink-0 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-5 z-50 shadow-sm relative">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center rounded-xl shadow-lg shadow-indigo-500/20">
          <i class="fa-solid fa-boxes-stacked text-sm"></i>
        </div>
        <div>
          <h1 class="text-base font-black text-slate-800 dark:text-white leading-none tracking-tight">Pro<span class="text-indigo-600">Audit</span></h1>
          <div class="flex items-center gap-1.5 mt-0.5">
             <span class="relative flex h-1.5 w-1.5">
               <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
             </span>
             <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Live</span>
          </div>
        </div>
      </div>
      
      <div class="hidden xl:flex items-center gap-6 bg-slate-50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-2 border-r border-slate-200 dark:border-slate-600 pr-4">
              <div class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User">
              </div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Admin User</span>
          </div>
          <div class="flex items-center gap-2">
              <i class="fa-regular fa-clock text-slate-400"></i>
              <span class="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ sessionDuration }}</span>
          </div>
      </div>

      <div class="flex items-center gap-3">
         <button @click="toggleTheme" class="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
         </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden relative z-0">
      
      <div 
        class="flex-1 flex flex-col min-w-0 bg-[#F1F5F9] dark:bg-[#020617] relative transition-transform duration-300"
        :class="mobileTab === 'catalog' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 absolute lg:relative inset-0'"
      >
        <div class="px-5 py-4 sticky top-0 z-30 bg-[#F1F5F9]/95 dark:bg-[#020617]/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 flex gap-3">
           
           <div class="relative group flex-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa-solid fa-magnifying-glass text-slate-400 group-focus-within:text-indigo-600 transition-colors text-sm"></i>
              </div>
              <input 
                  v-model="productSearch" 
                  type="text" 
                  placeholder="Qidirish (Nomi, ID)..." 
                  class="block w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-white placeholder:font-normal"
              >
           </div>

           <div class="relative" ref="categoryDropdownRef">
               <button 
                  @click="showCategoryDropdown = !showCategoryDropdown"
                  class="h-11 px-4 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm whitespace-nowrap active:scale-95"
               >
                   <i class="fa-solid fa-layer-group text-sm"></i>
                   <span class="hidden sm:inline">{{ activeCategory === 'All' ? 'Barcha Bo\'limlar' : activeCategory }}</span>
                   <span class="sm:hidden">{{ activeCategory === 'All' ? 'Bo\'limlar' : activeCategory }}</span>
                   <i class="fa-solid fa-chevron-down text-[10px] ml-1 opacity-50 transition-transform duration-200" :class="{'rotate-180': showCategoryDropdown}"></i>
               </button>

               <transition name="scale">
                   <div v-if="showCategoryDropdown" class="absolute top-14 right-0 w-56 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 p-1.5 overflow-hidden origin-top-right ring-1 ring-black/5">
                       <div class="max-h-64 overflow-y-auto custom-scroll">
                           <button 
                              v-for="cat in categories" :key="cat"
                              @click="selectCategory(cat)"
                              class="w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between group"
                              :class="activeCategory === cat ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-600 dark:text-slate-300'"
                           >
                               <span>{{ cat === 'All' ? 'Barchasi' : cat }}</span>
                               <i v-if="activeCategory === cat" class="fa-solid fa-check text-indigo-500"></i>
                           </button>
                       </div>
                   </div>
               </transition>
           </div>
        </div>

        <div class="flex-1 overflow-y-auto px-5 pb-24 lg:pb-6 custom-scroll">
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              @click="addToAudit(product)"
              class="group relative bg-white dark:bg-[#0F172A] rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
              :class="{'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-[#020617] border-emerald-500': isAdded(product)}"
            >
              <div class="aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden relative mb-2">
                 <img :src="product.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0">
                 
                 <div class="absolute top-2 left-2 bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-white/20">
                     <i class="fa-solid fa-database text-[9px] text-indigo-500"></i>
                     <span class="text-[10px] font-black text-slate-800 dark:text-white">{{ product.systemStock }}</span>
                 </div>

                 <div class="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                         <i class="fa-solid fa-plus text-sm"></i>
                     </div>
                 </div>

                 <transition name="pop">
                    <div v-if="isAdded(product)" class="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-[#0F172A]">
                        <i class="fa-solid fa-check text-[10px]"></i>
                    </div>
                 </transition>
              </div>

              <div class="px-1 flex-1 flex flex-col justify-between">
                 <div>
                     <div class="flex items-center gap-1 mb-1">
                         <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                         <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{{ product.category }}</span>
                     </div>
                     <h3 class="text-xs font-bold text-slate-800 dark:text-white leading-tight line-clamp-2 min-h-[2rem]" :title="product.name">{{ product.name }}</h3>
                 </div>
                 
                 <div class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                     <span class="text-[10px] text-slate-400">Narx:</span>
                     <span class="text-xs font-black text-slate-700 dark:text-slate-200 font-mono">{{ formatPriceCompact(product.price) }}</span>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div 
        class="flex flex-col w-full lg:w-[500px] xl:w-[600px] bg-white dark:bg-[#0F172A] border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 absolute lg:relative inset-0 lg:inset-auto z-40 lg:z-auto"
        :class="mobileTab === 'audit' ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
      >
        
        <div class="shrink-0 bg-slate-50 dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 pt-3 px-3 pb-0">
            <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <button @click="mobileTab = 'catalog'" class="lg:hidden w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mr-2 text-slate-500 shadow-sm"><i class="fa-solid fa-arrow-left"></i></button>

                <div 
                    v-for="session in sessions" :key="session.id"
                    @click="activeSessionId = session.id"
                    class="group relative pl-3 pr-7 py-2 rounded-t-lg text-[11px] font-bold border-t border-x cursor-pointer select-none min-w-[120px] transition-all"
                    :class="activeSessionId === session.id 
                        ? 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 border-b-white dark:border-b-[#0F172A] text-indigo-600 dark:text-indigo-400 mb-[-1px] z-10' 
                        : 'bg-slate-200/50 dark:bg-slate-900 border-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'"
                >
                    <span class="block truncate max-w-[90px]">{{ session.name }}</span>
                    <button v-if="sessions.length > 1" @click.stop="deleteSession(session.id)" class="absolute right-1 top-2 w-5 h-5 flex items-center justify-center rounded-md hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition"><i class="fa-solid fa-times text-[10px]"></i></button>
                </div>

                <button @click="showAddSessionModal = true" class="w-8 h-8 mb-1 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition ml-1"><i class="fa-solid fa-plus text-xs"></i></button>
            </div>
        </div>

        <div class="shrink-0 p-3 bg-white dark:bg-[#0F172A] border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
             <div class="bg-rose-50 dark:bg-rose-900/10 rounded-lg px-3 py-2 border border-rose-100 dark:border-rose-900/30 flex justify-between items-center">
                 <span class="text-[10px] font-bold text-rose-500 uppercase">Kamomat</span>
                 <span class="text-xs font-black text-rose-600">{{ formatPriceCompact(totalShortageValue) }}</span>
             </div>
             <div class="bg-amber-50 dark:bg-amber-900/10 rounded-lg px-3 py-2 border border-amber-100 dark:border-amber-900/30 flex justify-between items-center">
                 <span class="text-[10px] font-bold text-amber-500 uppercase">Ortiqcha</span>
                 <span class="text-xs font-black text-amber-600">+{{ formatPriceCompact(totalSurplusValue) }}</span>
             </div>
        </div>

        <div class="flex-1 overflow-y-auto p-3 bg-slate-50/50 dark:bg-[#020617] custom-scroll-blue pb-24 lg:pb-3">
          
          <transition-group name="list" tag="div" class="space-y-2">
            <div 
              v-for="item in activeSession.items" 
              :key="item.id" 
              class="group relative bg-white dark:bg-[#0F172A] rounded-xl border p-2 shadow-sm transition-all duration-200 hover:shadow-md"
              :class="{
                  'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20': isMatched(item),
                  'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20': getDiff(item) < 0,
                  'border-amber-500 ring-1 ring-amber-500 bg-amber-50/20': getDiff(item) > 0,
                  'border-slate-200 dark:border-slate-700': !item.touched && !isMatched(item)
              }"
            >
              <div class="flex items-center gap-3">
                  <img :src="item.image" class="w-12 h-12 rounded-lg bg-slate-100 object-cover border border-slate-100 dark:border-slate-700">

                  <div class="flex-1 min-w-0">
                      <h4 class="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 mb-0.5">{{ item.name }}</h4>
                      <div class="flex items-center gap-2">
                          <span class="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 rounded border border-slate-200 dark:border-slate-700">Tizim: {{ item.systemStock }}</span>
                          
                          <transition name="pop">
                              <span v-if="item.touched && getDiff(item) !== 0" class="text-[9px] font-black uppercase px-1.5 rounded text-white" :class="getDiff(item) < 0 ? 'bg-rose-500' : 'bg-amber-500'">
                                  {{ getDiff(item) < 0 ? 'Kam' : 'Ko\'p' }}: {{ Math.abs(getDiff(item)) }}
                              </span>
                          </transition>
                      </div>
                  </div>

                  <div class="flex items-center bg-slate-50 dark:bg-[#020617] rounded-lg border border-slate-200 dark:border-slate-600 h-10 p-0.5">
                      <button @click="changeQty(item, -1)" class="w-9 h-full flex items-center justify-center rounded bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-rose-500 active:scale-95 transition border border-slate-100 dark:border-slate-700"><i class="fa-solid fa-minus text-[10px]"></i></button>
                      
                      <input 
                          v-model.number="item.countedStock" 
                          @focus="item.touched = true"
                          type="number" 
                          class="w-24 h-full bg-transparent text-center text-lg font-bold outline-none appearance-none transition-colors"
                          :class="{
                              'text-emerald-600': isMatched(item),
                              'text-rose-600': getDiff(item) < 0,
                              'text-amber-600': getDiff(item) > 0,
                              'text-slate-800 dark:text-white': !item.touched
                          }"
                      >

                      <button @click="changeQty(item, 1)" class="w-9 h-full flex items-center justify-center rounded bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-emerald-500 active:scale-95 transition border border-slate-100 dark:border-slate-700"><i class="fa-solid fa-plus text-[10px]"></i></button>
                  </div>

                  <button 
                      @click="setMatch(item)"
                      class="w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-95 border shadow-sm ml-1"
                      :class="isMatched(item) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-600 text-slate-300 hover:text-indigo-600 hover:border-indigo-400'"
                      title="Tizim bilan tenglash"
                  >
                      <i class="fa-solid" :class="isMatched(item) ? 'fa-check' : 'fa-equals'"></i>
                  </button>
                  
                  <button @click="removeItem(item.id)" class="w-7 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"><i class="fa-solid fa-trash-can text-xs"></i></button>
              </div>
            </div>
          </transition-group>
        </div>

        <div class="shrink-0 p-4 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-700 z-30 pb-24 lg:pb-4 shadow-[-5px_0_15px_rgba(0,0,0,0.05)]">
            <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Sof Farq:</span>
                <span class="text-xl font-black font-mono tracking-tight" :class="netDiffValue >= 0 ? 'text-emerald-600' : 'text-rose-600'">{{ formatPrice(netDiffValue) }}</span>
            </div>
            <button 
                @click="finishSession"
                class="w-full h-11 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
                <i class="fa-solid fa-save"></i> Reviziyani Yopish
            </button>
        </div>

      </div>
    </div>

    <div class="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-700 flex z-50 pb-safe">
      <button @click="mobileTab = 'catalog'" class="flex-1 py-3 flex flex-col items-center justify-center gap-1 border-t-2 transition-colors" :class="mobileTab === 'catalog' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-400'">
        <i class="fa-solid fa-boxes-stacked text-lg"></i>
        <span class="text-[10px] font-bold">Katalog</span>
      </button>
      <div class="w-px h-8 bg-slate-200 dark:bg-slate-700 self-center"></div>
      <button @click="mobileTab = 'audit'" class="flex-1 py-3 flex flex-col items-center justify-center gap-1 border-t-2 transition-colors relative" :class="mobileTab === 'audit' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-400'">
        <i class="fa-solid fa-list-check text-lg"></i>
        <span class="text-[10px] font-bold">Reviziya</span>
        <span v-if="activeSession.items.length" class="absolute top-2 right-12 w-2 h-2 bg-rose-500 rounded-full animate-pulse border border-white"></span>
      </button>
    </div>

    <transition name="toast">
        <div v-if="toast.show" class="fixed top-20 right-5 z-[100] bg-white dark:bg-[#1E293B] border-l-4 border-emerald-500 rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[300px] animate-bounce-in">
            <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-check"></i>
            </div>
            <div>
                <h4 class="text-xs font-bold text-slate-800 dark:text-white uppercase">Muvaffaqiyatli</h4>
                <p class="text-xs text-slate-500">{{ toast.message }}</p>
            </div>
        </div>
    </transition>

    <transition name="fade">
        <div v-if="showAddSessionModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
            <div class="bg-white dark:bg-[#1E293B] w-full max-w-xs rounded-xl shadow-2xl overflow-hidden scale-100 transition-all">
                <div class="bg-slate-50 dark:bg-[#111827] px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide">Yangi Zona</h3>
                    <button @click="showAddSessionModal = false" class="text-slate-400 hover:text-rose-500"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="p-5">
                    <label class="block text-xs font-bold text-slate-500 mb-2">Zona Nomi</label>
                    <input v-model="newSessionName" @keyup.enter="createNewSession" type="text" placeholder="Masalan: Ombor 2..." class="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg px-3 text-sm font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none dark:bg-[#0B1120] dark:text-white transition-all">
                </div>
                <div class="px-5 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                    <button @click="showAddSessionModal = false" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition">Bekor</button>
                    <button @click="createNewSession" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition">Saqlash</button>
                </div>
            </div>
        </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from "vue"

const isDark = ref(false)
const mobileTab = ref('catalog')
const productSearch = ref("")
const showAddSessionModal = ref(false)
const newSessionName = ref("")
const showCategoryDropdown = ref(false)
const categoryDropdownRef = ref(null)
const activeCategory = ref("All")

// Time Logic
const sessionDuration = ref("00:00:00")
let timerInterval = null

// Toast Logic
const toast = reactive({ show: false, message: "" })
const showToast = (message) => {
    toast.message = message; toast.show = true
    setTimeout(() => toast.show = false, 3000)
}

// Data
const categories = ["All", "Oziq-ovqat", "Ichimlik", "Non", "Shirinlik", "Xo'jalik", "Sut mahsulotlari", "Go'sht", "Meva-sabzavot"]
const sessions = ref([{ id: 1, name: "Asosiy Zal", items: [] }])
const activeSessionId = ref(1)

const products = ref(Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  name: `Mahsulot ${i + 1} Premium Sifat`,
  price: Math.floor(Math.random() * 500) * 100 + 5000,
  image: `https://picsum.photos/200/200?random=${i + 150}`,
  systemStock: Math.floor(Math.random() * 100) + 10,
  category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1]
})))

// Computed
const activeSession = computed(() => sessions.value.find(s => s.id === activeSessionId.value) || sessions.value[0])
const filteredProducts = computed(() => {
    let list = products.value
    if (activeCategory.value !== 'All') list = list.filter(p => p.category === activeCategory.value)
    if (productSearch.value) list = list.filter(p => p.name.toLowerCase().includes(productSearch.value.toLowerCase()))
    return list
})

// Logic
const isAdded = (p) => activeSession.value.items.some(i => i.id === p.id)
const getDiff = (item) => (item.countedStock || 0) - item.systemStock
const getDiffValue = (item) => getDiff(item) * item.price
const isMatched = (item) => item.touched && getDiff(item) === 0

// Stats
const totalShortageValue = computed(() => activeSession.value.items.reduce((s, i) => getDiffValue(i) < 0 ? s + Math.abs(getDiffValue(i)) : s, 0))
const totalSurplusValue = computed(() => activeSession.value.items.reduce((s, i) => getDiffValue(i) > 0 ? s + getDiffValue(i) : s, 0))
const netDiffValue = computed(() => totalSurplusValue.value - totalShortageValue.value)

// Actions
const selectCategory = (cat) => { activeCategory.value = cat; showCategoryDropdown.value = false }
const addToAudit = (p) => { if (!isAdded(p)) activeSession.value.items.unshift({ ...p, countedStock: 0, touched: false }) }
const removeItem = (id) => activeSession.value.items = activeSession.value.items.filter(i => i.id !== id)
const changeQty = (item, delta) => { item.touched = true; const val = (item.countedStock || 0) + delta; if (val >= 0) item.countedStock = val }
const setMatch = (item) => { item.touched = true; item.countedStock = item.systemStock }

const createNewSession = () => {
    if (newSessionName.value.trim()) {
        const id = Date.now()
        sessions.value.push({ id, name: newSessionName.value, items: [] })
        activeSessionId.value = id; newSessionName.value = ""; showAddSessionModal.value = false
    }
}
const deleteSession = (id) => {
     if(confirm("Ushbu zonani o'chirmoqchimisiz?")) {
        sessions.value = sessions.value.filter(s => s.id !== id)
        activeSessionId.value = sessions.value[0]?.id || null
        if(sessions.value.length === 0) sessions.value.push({ id: Date.now(), name: "Yangi Zona", items: [] })
    }
}

const finishSession = () => {
    showToast("Reviziya muvaffaqiyatli saqlandi va yopildi!")
}

const toggleTheme = () => { isDark.value = !isDark.value; document.documentElement.classList.toggle("dark", isDark.value) }
const formatPrice = (val) => new Intl.NumberFormat('uz-UZ').format(val)
const formatPriceCompact = (val) => new Intl.NumberFormat('uz-UZ', { notation: "compact", compactDisplay: "short" }).format(val)

const handleClickOutside = (e) => {
    if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target)) showCategoryDropdown.value = false
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    const start = Date.now()
    timerInterval = setInterval(() => {
        const diff = Math.floor((Date.now() - start) / 1000)
        const h = Math.floor(diff / 3600).toString().padStart(2, '0')
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
        const s = (diff % 60).toString().padStart(2, '0')
        sessionDuration.value = `${h}:${m}:${s}`
    }, 1000)
})

onUnmounted(() => { clearInterval(timerInterval); document.removeEventListener('click', handleClickOutside) })
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
.custom-scroll-blue::-webkit-scrollbar { width: 5px; }
.custom-scroll-blue::-webkit-scrollbar-thumb { background-color: #94a3b8; border-radius: 4px; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.list-enter-active, .list-leave-active { transition: all 0.2s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-5px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.scale-enter-active { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-enter-from { transform: scale(0.9) opacity(0); }
.pop-enter-active { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from { transform: scale(0); }
.toast-enter-active { animation: toast-in 0.3s; }
.toast-leave-active { animation: toast-in 0.3s reverse; }
@keyframes toast-in {
    0% { transform: translateY(-20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
</style>