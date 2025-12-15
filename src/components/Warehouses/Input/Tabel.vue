<template>
  <div class="h-screen w-full rounded-lg bg-[#F0FDFA] dark:bg-[#064E3B]/10 flex font-sans overflow-hidden text-slate-800 dark:text-slate-200 selection:bg-teal-500 selection:text-white transition-colors duration-300">
    
    <div class="flex-1 flex flex-col min-w-0 bg-[#F0FDFA] dark:bg-[#022C22] relative z-0 border-r border-teal-200 dark:border-teal-900/50">
      
      <header class="h-16 shrink-0 bg-white/90 dark:bg-[#064E3B]/90 backdrop-blur-xl border-b border-teal-100 dark:border-teal-900 flex items-center justify-between px-5 sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <i class="fa-solid fa-boxes-stacked text-lg"></i>
          </div>
          <h1 class="text-base font-bold tracking-tight">Ecowater <span class="text-teal-600 dark:text-teal-400">WAREHOUSE</span></h1>
        </div>
        <div class="flex items-center gap-2">
           <div class="hidden lg:block text-right mr-3 pr-3 border-r border-teal-100 dark:border-teal-800">
            <div class="text-xs font-bold font-mono text-slate-700 dark:text-slate-200">{{ currentTime }}</div>
            <div class="text-[10px] text-slate-400 uppercase tracking-wide">{{ currentDate }}</div>
          </div>
          <button @click="toggleTheme" class="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/50 hover:text-amber-500 transition flex items-center justify-center">
            <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
          </button>
        </div>
      </header>

      <div class="px-5 py-4 flex gap-3 shrink-0 z-10 sticky top-16 bg-[#F0FDFA]/95 dark:bg-[#022C22]/95 backdrop-blur-sm">
        <div class="relative w-[220px]" ref="categoryMenuRef">
          <button @click="showCategoryMenu = !showCategoryMenu" class="w-full h-11 bg-white dark:bg-[#064E3B] border border-teal-100 dark:border-teal-800 rounded-xl flex items-center justify-between px-3 hover:border-teal-500 transition shadow-sm group">
            <div class="flex items-center gap-2 overflow-hidden">
              <div class="w-6 h-6 rounded bg-teal-50 dark:bg-teal-900 flex items-center justify-center text-teal-600 text-xs">
                <i :class="selectedCategoryIcon"></i>
              </div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ activeCategory }}</span>
            </div>
            <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200" :class="{'rotate-180': showCategoryMenu}"></i>
          </button>
          
          <transition name="dropdown">
            <div v-if="showCategoryMenu" class="absolute top-[calc(100%+6px)] left-0 w-full bg-white dark:bg-[#064E3B] rounded-xl shadow-xl border border-teal-100 dark:border-teal-800 overflow-hidden z-30 p-2">
              <button v-for="cat in categories" :key="cat.name" @click="selectCategory(cat)" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-teal-50 dark:hover:bg-teal-900 transition" :class="activeCategory === cat.name ? 'text-teal-600 font-bold bg-teal-50 dark:bg-teal-900' : 'text-slate-600 dark:text-slate-400'">
                <i :class="cat.icon"></i> {{ cat.name }}
              </button>
            </div>
          </transition>
        </div>

        <div class="relative flex-1 group">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-teal-500 transition-colors"></i>
          <input v-model="productSearch" type="text" placeholder="Mahsulot nomi yoki shtrix kodi..." class="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#064E3B] border border-teal-100 dark:border-teal-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm outline-none">
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-5 pb-5 custom-scroll-teal">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            @click="addToInbound(product)"
            class="group bg-white dark:bg-[#064E3B] rounded-2xl p-2.5 border border-teal-50 dark:border-teal-800 shadow-sm hover:shadow-xl hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer transition-all duration-200 active:scale-[0.97] select-none flex flex-col relative overflow-hidden"
          >
            <div class="aspect-[4/3] rounded-xl bg-slate-50 dark:bg-[#022C22] overflow-hidden mb-2.5 relative">
              <img :src="product.image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
              <div class="absolute bottom-1 right-1 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[9px] text-white font-bold shadow-sm">
                <i class="fa-solid fa-warehouse mr-1 text-[8px] text-slate-300"></i>{{ product.currentStock }}
              </div>
              <div class="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div class="bg-white/90 dark:bg-teal-900/90 rounded-full p-2.5 shadow-lg text-teal-600 dark:text-teal-400 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                   <i class="fa-solid fa-plus text-lg"></i>
                 </div>
              </div>
            </div>
            
            <div class="mt-auto px-1">
              <h3 class="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1 mb-0.5">{{ product.name }}</h3>
              <div class="flex justify-between items-center text-[10px] text-slate-400">
                 <span>Tan narx:</span>
                 <span class="font-mono text-slate-600 dark:text-slate-300">{{ formatPrice(product.lastCostPrice) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-[450px] lg:w-[500px] shrink-0 bg-white dark:bg-[#111827] shadow-2xl z-10 flex flex-col h-full border-l border-slate-200 dark:border-slate-800">
      
      <div class="shrink-0 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 px-3 pt-3 flex items-end gap-1 overflow-x-auto no-scrollbar">
        <button 
          v-for="doc in documents" :key="doc.id" 
          @click="activeDocId = doc.id"
          class="relative px-3 py-2.5 rounded-t-lg text-[10px] font-bold transition-all min-w-[120px] flex items-center justify-between gap-2 border-t border-x border-transparent"
          :class="activeDocId === doc.id 
            ? 'bg-white dark:bg-[#111827] text-teal-600 dark:text-teal-400 border-slate-200 dark:border-slate-800 !border-b-transparent z-10' 
            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <span><i class="fa-solid fa-file-invoice mr-1"></i> {{ doc.name }}</span>
          <span v-if="documents.length > 1" @click.stop="removeDocument(doc.id)" class="hover:text-red-500"><i class="fa-solid fa-xmark"></i></span>
        </button>
        <button @click="addDocument" class="w-8 h-8 mb-1 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition"><i class="fa-solid fa-plus text-xs"></i></button>
      </div>

      <div class="shrink-0 p-4 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-slate-800 z-10">
        <div class="relative" ref="supplierDropdownRef">
          <label class="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 block pl-1">Yetkazib beruvchi</label>
          <button 
            @click="showSupplierList = !showSupplierList"
            class="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border transition-all rounded-xl flex items-center justify-between group"
            :class="!activeDocumentData.supplierId ? 'border-rose-300 dark:border-rose-900/50 hover:border-rose-400' : 'border-teal-200 dark:border-teal-700 hover:border-teal-400'"
          >
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                <i class="fa-solid fa-truck-field"></i>
              </div>
              <div class="flex flex-col text-left truncate">
                <span class="text-xs font-bold text-slate-800 dark:text-white leading-none mb-1 truncate">
                  {{ activeSupplier ? activeSupplier.company : 'Yetkazib beruvchini tanlang' }}
                </span>
                <span v-if="activeSupplier" class="text-[10px] text-slate-500 font-mono">{{ activeSupplier.phone }}</span>
                <span v-else class="text-[9px] text-rose-500 font-bold uppercase">Majburiy</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-down text-xs text-slate-400 transition-transform" :class="{'rotate-180': showSupplierList}"></i>
          </button>

          <transition name="dropdown">
            <div v-if="showSupplierList" class="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 p-2">
              <div class="max-h-48 overflow-y-auto thin-scroll">
                <button v-for="s in suppliers" :key="s.id" @click="selectSupplier(s)" class="w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between transition text-left border-b border-slate-50 dark:border-slate-700 last:border-0 group">
                  <div>
                    <div class="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-600">{{ s.company }}</div>
                    <div class="text-[9px] text-slate-400 font-mono">{{ s.phone }}</div>
                  </div>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-3 custom-scroll-teal bg-slate-50/50 dark:bg-[#111827] relative min-h-0">
        <div v-if="activeDocumentData.items.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 select-none">
          <i class="fa-solid fa-dolly text-4xl mb-3 opacity-40"></i>
          <p class="text-xs font-bold uppercase tracking-wider opacity-70">Ro'yxat bo'sh</p>
        </div>

        <transition-group name="list" tag="div" class="space-y-3">
          <div 
            v-for="item in activeDocumentData.items" 
            :key="item.id" 
            class="group bg-white dark:bg-[#1E293B] p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-300 dark:hover:border-teal-600 transition-all select-none relative"
          >
            <div class="flex justify-between items-start mb-2">
               <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">{{ item.id }}</div>
                  <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{{ item.name }}</h4>
               </div>
               <button @click="removeItem(item.id)" class="text-slate-300 hover:text-rose-500 transition"><i class="fa-solid fa-times text-xs"></i></button>
            </div>

            <div class="grid grid-cols-12 gap-2 items-end">
              
              <div class="col-span-4">
                 <label class="text-[8px] font-bold text-slate-400 uppercase pl-1 block mb-1">Kelish (Tan)</label>
                 <div class="relative">
                    <input v-model.number="item.costPrice" type="number" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition" placeholder="0">
                 </div>
              </div>

              <div class="col-span-4">
                 <label class="text-[8px] font-bold text-teal-500 uppercase pl-1 block mb-1">Sotuv</label>
                 <div class="relative">
                    <input v-model.number="item.sellingPrice" type="number" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition" placeholder="0">
                 </div>
              </div>

              <div class="col-span-4">
                 <label class="text-[8px] font-bold text-slate-400 uppercase pl-1 block mb-1">Miqdor</label>
                 <div class="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 h-[30px]">
                    <button @click="changeQty(item, -1)" class="w-7 h-full flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 rounded-l-lg transition"><i class="fa-solid fa-minus text-[10px]"></i></button>
                    <input v-model.number="item.qty" type="number" class="w-full text-center bg-transparent text-xs font-bold text-slate-800 dark:text-white outline-none appearance-none">
                    <button @click="changeQty(item, 1)" class="w-7 h-full flex items-center justify-center text-slate-500 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-800 rounded-r-lg transition"><i class="fa-solid fa-plus text-[10px]"></i></button>
                 </div>
              </div>
            </div>

            <div class="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-slate-100 dark:border-slate-700/50">
               <div class="flex gap-2">
                  <span class="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 rounded">Margin: <span :class="getMargin(item) > 0 ? 'text-emerald-500' : 'text-rose-500'">{{ getMargin(item) }}%</span></span>
               </div>
               <div class="text-xs font-black text-slate-800 dark:text-slate-100">{{ formatPrice(item.costPrice * item.qty) }}</div>
            </div>

          </div>
        </transition-group>
      </div>

      <div class="shrink-0 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50">
        
        <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800 mb-4">
            <div class="flex justify-between items-end mb-1">
                <span class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Jami Kirim Summasi</span>
                <span class="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{{ formatPrice(grandTotal) }}</span>
            </div>
            <div class="text-right text-[10px] text-slate-400">
               {{ totalItemsCount }} ta mahsulot
            </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mb-3">
          <button 
            v-for="pt in paymentTypes" :key="pt.value" @click="selectedPaymentType = pt.value"
            class="flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-200 text-[10px] font-bold uppercase"
            :class="selectedPaymentType === pt.value 
              ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-600 dark:text-teal-400' 
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'"
          >
            <i :class="pt.icon"></i> {{ pt.label }}
          </button>
        </div>

        <button 
          @click="processInbound"
          :disabled="!isValidInbound"
          class="w-full h-12 rounded-2xl font-bold shadow-xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide"
          :class="isValidInbound 
            ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-teal-500/30' 
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-70'"
        >
          <i class="fa-solid" :class="isValidInbound ? 'fa-check-circle' : 'fa-lock'"></i>
          {{ isValidInbound ? "Kirimni Tasdiqlash" : "Ma'lumotlar yetarli emas" }}
        </button>
      </div>

    </div>

    <transition name="toast">
      <div v-if="toast.show" class="fixed top-20 right-6 z-[100] px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl border border-white/20 flex items-center gap-3" :class="toast.type === 'error' ? 'bg-rose-500/95 text-white' : 'bg-emerald-600/95 text-white'">
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
  { name: "Xom-ashyo", icon: "fa-solid fa-cube" },
  { name: "Tayyor mahsulot", icon: "fa-solid fa-box-open" },
  { name: "Qadoqlash", icon: "fa-solid fa-tape" }
]

const products = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Mahsulot ${i + 1} (SKU-${1000+i})`,
  lastCostPrice: Math.floor(Math.random() * 400) * 100 + 1000, // Eski kelish narxi
  sellingPrice: Math.floor(Math.random() * 600) * 100 + 5000, // Eski sotuv narxi
  category: ["Xom-ashyo", "Tayyor mahsulot", "Qadoqlash"][i % 3],
  image: `https://picsum.photos/200/200?random=${i + 50}`,
  currentStock: Math.floor(Math.random() * 100)
})))

const suppliers = ref([
  { id: 1, company: "Mega Distribution", phone: "+998 90 123 00 00" },
  { id: 2, company: "Local Farmer Co.", phone: "+998 93 999 88 77" },
  { id: 3, company: "China Import LLC", phone: "+998 97 555 44 22" }
])

// State
const isDark = ref(false)
const currentTime = ref("")
const currentDate = ref("")
const productSearch = ref("")
const activeCategory = ref("Barchasi")

// UI Controls
const showCategoryMenu = ref(false)
const categoryMenuRef = ref(null)
const showSupplierList = ref(false)
const supplierDropdownRef = ref(null)

// Inbound Logic
const documents = ref([{ id: 1, name: "Kirim #1", items: [], supplierId: null }])
const activeDocId = ref(1)
const selectedPaymentType = ref("debt") // default: nasiya

const paymentTypes = [
    { value: "debt", label: "Nasiya (Qarz)", icon: "fa-solid fa-file-contract" },
    { value: "cash", label: "Naqd To'lov", icon: "fa-solid fa-money-bill" }
]

const activeDocumentData = computed(() => documents.value.find(d => d.id === activeDocId.value) || documents.value[0])
const activeSupplier = computed(() => suppliers.value.find(s => s.id === activeDocumentData.value.supplierId) || null)
const selectedCategoryIcon = computed(() => categories.find(c => c.name === activeCategory.value)?.icon || 'fa-solid fa-layer-group')

const filteredProducts = computed(() => {
  let list = products.value
  if (activeCategory.value !== "Barchasi") list = list.filter(p => p.category === activeCategory.value)
  if (productSearch.value) list = list.filter(p => p.name.toLowerCase().includes(productSearch.value.toLowerCase()))
  return list
})

// Calculations
const grandTotal = computed(() => activeDocumentData.value.items.reduce((sum, item) => sum + (item.costPrice * item.qty), 0))
const totalItemsCount = computed(() => activeDocumentData.value.items.reduce((sum, item) => sum + item.qty, 0))

// Validation
const isValidInbound = computed(() => activeDocumentData.value.items.length > 0 && activeDocumentData.value.supplierId)

// Actions
const selectCategory = (cat) => { activeCategory.value = cat.name; showCategoryMenu.value = false }
const selectSupplier = (s) => { activeDocumentData.value.supplierId = s.id; showSupplierList.value = false }

const addToInbound = (product) => {
  const items = activeDocumentData.value.items
  const existing = items.find(i => i.id === product.id)
  
  if (existing) {
    existing.qty++
  } else {
    items.push({
      id: product.id,
      name: product.name,
      // Kirimda default qiymat sifatida oxirgi narxlarni olamiz
      costPrice: product.lastCostPrice, 
      sellingPrice: product.sellingPrice,
      qty: 1
    })
  }
}

const changeQty = (item, delta) => {
  if (item.qty + delta > 0) item.qty += delta
  else removeItem(item.id)
}

const removeItem = (id) => { activeDocumentData.value.items = activeDocumentData.value.items.filter(i => i.id !== id) }

const getMargin = (item) => {
    if(!item.costPrice || item.costPrice === 0) return 100
    const margin = ((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100
    return Math.round(margin)
}

const addDocument = () => {
  const id = Date.now()
  documents.value.push({ id, name: `Kirim #${documents.value.length + 1}`, items: [], supplierId: null })
  activeDocId.value = id
}

const removeDocument = (id) => {
  if (documents.value.length <= 1) return
  const idx = documents.value.findIndex(s => s.id === id)
  documents.value = documents.value.filter(s => s.id !== id)
  if (activeDocId.value === id) activeDocId.value = documents.value[Math.max(0, idx - 1)].id
}

const processInbound = () => {
  if (!isValidInbound.value) return
  
  // Backendga ketadigan data strukturasi
  const payload = {
      supplier_id: activeDocumentData.value.supplierId,
      total_amount: grandTotal.value,
      payment_type: selectedPaymentType.value,
      items: activeDocumentData.value.items.map(i => ({
          product_id: i.id,
          qty: i.qty,
          cost_price: i.costPrice,
          new_selling_price: i.sellingPrice
      }))
  }
  
  console.log("Backend Payload:", payload)
  showToast(`Kirim qilindi: ${formatPrice(grandTotal.value)}`, "success")
  
  // Tozalash
  activeDocumentData.value.items = []
  activeDocumentData.value.supplierId = null
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
  if (supplierDropdownRef.value && !supplierDropdownRef.value.contains(e.target)) showSupplierList.value = false
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

.custom-scroll-teal::-webkit-scrollbar { width: 4px; }
.custom-scroll-teal::-webkit-scrollbar-track { background: transparent; }
.custom-scroll-teal::-webkit-scrollbar-thumb { background-color: #99f6e4; border-radius: 10px; }
.dark .custom-scroll-teal::-webkit-scrollbar-thumb { background-color: #115e59; }

/* Transitions same as before */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.96); }

.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-10px); }

.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-20px) scale(0.9); }
</style>