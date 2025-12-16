<script setup>
import { ref, computed, onMounted, onUnmounted, reactive, watch } from "vue"
import { storeToRefs } from "pinia"
// Store va Service importlari (Yo'llarni loyihangizga qarab tekshiring)
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store"
import { WarehouseInputStore } from "../../../stores/Warehouses/input/input.store" // Yangi Store

// --- STORE BOSHQARUVI ---
const productStore = ProductsManagmentStore()
const inputStore = WarehouseInputStore()
// Katalog va qidiruv uchun
const { products } = storeToRefs(productStore)

// Kirim hujjatining holati uchun (Store dan to'g'ridan-to'g'ri bog'lanish)
const { 
    document: documents, // documents.value ichida partyNumber, items, supplierId bor
    isSubmitting, 
    totalSum, // Store'dagi getter
    isValid: isValidInbound 
} = storeToRefs(inputStore)


// --- LOKAL STATE ---
const isDark = ref(false)
const mobileTab = ref('catalog')
const productSearch = ref("")
const showAddDocModal = ref(false)
const newDocName = ref("")
const showCategoryDropdown = ref(false)
const categoryDropdownRef = ref(null)
const showSupplierList = ref(false)
const supplierDropdownRef = ref(null)
const activeCategory = ref("All")
const currentTime = ref("")

// Static/Mock Data
const categories = ["All", "Gazli ichimliklar", "Gazsiz ichimliklar", "Sharbatlar", "Sneklar", "Xo'jalik"]
const suppliers = ref([
    { id: "sup_001", company: "Mega Distribution", phone: "+998 90 123 00 00" }, 
    { id: "sup_002", company: "Local Farmer LLC", phone: "+998 93 999 88 77" }
])
const paymentTypes = [
    { value: "debt", label: "Nasiya", icon: "fa-solid fa-file-contract" }, 
    { value: "cash", label: "Naqd", icon: "fa-solid fa-money-bill" }
]
const selectedPaymentType = ref("debt") // Lokal UI holati
const toast = reactive({ show: false, message: "" }) // Lokal toast

// --- COMPUTED / GETTERS ---
// Store'da bitta document bor. Uni "Active Document" deb chaqiramiz.
const activeDocument = computed(() => documents.value) 
const activeSupplier = computed(() => suppliers.value.find(s => s.id === activeDocument.value.supplierId) || null)
const grandTotal = computed(() => totalSum.value) // Store getteridan foydalanish

// Katalog filtrlash (Store ma'lumotlari asosida)
const filteredProducts = computed(() => {
    let list = products.value || []
    if (activeCategory.value !== 'All') {
        list = list.filter(p => p.category === activeCategory.value)
    }
    // Search store tomonidan serverda filtrlanadi, shuning uchun bu yerda productSearch ishlatilmaydi
    return list
})

const isAdded = (p) => activeDocument.value.items.some(i => i.productId === p._id)

// --- WATCHERS ---
// Qidiruv o'zgarganda Store ga so'rov yuborish
let searchTimeout;
watch(productSearch, (val) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        productStore.setSearch(val);
    }, 400); // Debounce
})

// --- ACTIONS ---

// 1. UI Actions
const selectCategory = (cat) => { 
    activeCategory.value = cat; 
    showCategoryDropdown.value = false 
    // Agar Store category filterini qilsa, bu yerda uni chaqirish kerak
    // productStore.GetAll({ category: cat }) 
}
const selectSupplier = (s) => { 
    inputStore.document.supplierId = s.id; 
    showSupplierList.value = false 
}

// 2. Mahsulotni "Kirim" ro'yxatiga qo'shish
const addToInbound = (p) => { 
    inputStore.addItem(p);
}

// 3. Mahsulotni ro'yxatdan o'chirish (Store chaqiruvi)
const removeItem = (id) => inputStore.removeItem(id);

// 4. Miqdorni o'zgartirish (Store chaqiruvi)
const changeQty = (item, delta) => { 
    const newQty = item.qty + delta;
    if (newQty > 0) {
      inputStore.updateItem(item.productId, { qty: newQty });
    } else {
      inputStore.removeItem(item.productId);
    }
}

// Marja hisoblash (Foyda foizi)
const getMargin = (item) => { 
    if(!item.costPrice || item.costPrice === 0) return 100; 
    if(!item.sellingPrice) return 0;
    return Math.round(((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100) 
}

// 5. Document Management (Store logicga o'tkazilmagan UI)
const createNewDocument = () => {
    if (newDocName.value.trim()) {
        const id = Date.now()
        // Bu yerda yangi document yaratish logikasi lokal qoldi (Agar tabs kerak bo'lsa)
        documents.value.push({ id, name: newDocName.value, items: [], supplierId: null })
        activeDocId.value = id; newDocName.value = ""; showAddDocModal.value = false
    }
}
const deleteDocument = (id) => {
    if(confirm("Hujjatni o'chirmoqchimisiz?")) {
        documents.value = documents.value.filter(s => s.id !== id)
        activeDocId.value = documents.value[0]?.id || null
        if(documents.value.length === 0) inputStore.clearDocument() // Bo'sh bo'lsa tozalash
    }
}

// 6. API ACTIONS (SAVE)
const processInbound = async () => {
    // Store ichidagi saqlash funksiyasini chaqiramiz
    await inputStore.saveInput();

    // Muvaffaqiyatli saqlangandan so'ng Store o'zi tozalaydi, 
    // Faqat lokal Toastni ko'rsatishimiz kerak (Agar Store o'zi ko'rsatmasa).
    // Store da ToastifyService ishlatilgan, shuning uchun bu yerda faqat UI animatsiyasi qoladi.
    
    if (!inputStore.isSubmitting) { // Store saqlab bo'lgan bo'lsa
        toast.message = `Kirim muvaffaqiyatli!`; // Aniq summani Store qaytarishi kerak
        toast.show = true
        setTimeout(() => toast.show = false, 3000)
    }
}

// --- UTILS ---
const toggleTheme = () => { isDark.value = !isDark.value; document.documentElement.classList.toggle("dark", isDark.value) }
const formatPrice = (v) => new Intl.NumberFormat('uz-UZ').format(v) + " so'm"
const formatPriceCompact = (v) => new Intl.NumberFormat('uz-UZ', { notation: "compact" }).format(v)

const handleClickOutside = (e) => {
    if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target)) showCategoryDropdown.value = false
    if (supplierDropdownRef.value && !supplierDropdownRef.value.contains(e.target)) showSupplierList.value = false
}

// --- LIFECYCLE ---
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    // Vaqt
    setInterval(() => { currentTime.value = new Date().toLocaleTimeString('uz-UZ', {hour:'2-digit', minute:'2-digit'}) }, 1000)
    // Mahsulotlarni yuklash
    inputStore.fetchCatalog(); 
})

onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="h-screen w-full bg-[#F0FDFA] dark:bg-[#020617] flex flex-col font-sans overflow-hidden text-slate-600 dark:text-slate-400 selection:bg-teal-500 selection:text-white transition-colors duration-300">
    
    <header class="h-16 shrink-0 bg-white dark:bg-[#0F172A] border-b border-teal-100 dark:border-slate-800 flex items-center justify-between px-5 z-50 shadow-sm relative">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center rounded-xl shadow-lg shadow-teal-500/20">
          <i class="fa-solid fa-truck-ramp-box text-sm"></i>
        </div>
        <div>
          <h1 class="text-base font-black text-slate-800 dark:text-white leading-none tracking-tight">Eco<span class="text-teal-600">Inbound</span></h1>
          <div class="flex items-center gap-1.5 mt-0.5">
             <span class="relative flex h-1.5 w-1.5">
               <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
               <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
             </span>
             <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kirim Bo'limi</span>
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
              <span class="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">{{ currentTime }}</span>
          </div>
      </div>

      <div class="flex items-center gap-3">
         <button @click="toggleTheme" class="w-9 h-9 rounded-xl hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-500 transition flex items-center justify-center border border-transparent hover:border-teal-100 dark:hover:border-slate-700">
            <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
         </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden relative z-0">
      
      <div 
        class="flex-1 flex flex-col min-w-0 bg-[#F0FDFA] dark:bg-[#020617] relative transition-transform duration-300"
        :class="mobileTab === 'catalog' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 absolute lg:relative inset-0'"
      >
        <div class="px-5 py-4 sticky top-0 z-30 bg-[#F0FDFA]/95 dark:bg-[#020617]/95 backdrop-blur-md border-b border-teal-100/50 dark:border-slate-800/50 flex gap-3">
           
           <div class="relative group flex-1">
             <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-teal-600 transition-colors text-sm"></i>
             <input 
                 v-model="productSearch" 
                 type="text" 
                 placeholder="Mahsulot qidirish..." 
                 class="block w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0F172A] border border-teal-100 dark:border-slate-700 rounded-xl text-sm font-semibold shadow-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 dark:text-white"
             >
           </div>

           <div class="relative" ref="categoryDropdownRef">
               <button 
                  @click="showCategoryDropdown = !showCategoryDropdown"
                  class="h-11 px-4 bg-white dark:bg-[#0F172A] border border-teal-100 dark:border-slate-700 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 transition shadow-sm whitespace-nowrap active:scale-95"
               >
                   <i class="fa-solid fa-filter"></i>
                   <span class="hidden sm:inline">{{ activeCategory === 'All' ? 'Bo\'limlar' : activeCategory }}</span>
                   <i class="fa-solid fa-chevron-down text-[10px] ml-1 opacity-50 transition-transform duration-200" :class="{'rotate-180': showCategoryDropdown}"></i>
               </button>

               <transition name="scale">
                   <div v-if="showCategoryDropdown" class="absolute top-12 right-0 w-56 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-teal-100 dark:border-slate-700 z-50 p-1.5 overflow-hidden origin-top-right ring-1 ring-black/5">
                       <div class="max-h-64 overflow-y-auto custom-scroll">
                           <button 
                              v-for="cat in categories" :key="cat"
                              @click="selectCategory(cat)"
                              class="w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl hover:bg-teal-50 dark:hover:bg-slate-800 transition flex items-center justify-between"
                              :class="activeCategory === cat ? 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' : 'text-slate-600 dark:text-slate-300'"
                           >
                               <span>{{ cat === 'All' ? 'Barchasi' : cat }}</span>
                               <i v-if="activeCategory === cat" class="fa-solid fa-check text-teal-500"></i>
                           </button>
                       </div>
                   </div>
               </transition>
           </div>
        </div>

        <div class="flex-1 overflow-y-auto px-5 pb-24 lg:pb-6 custom-scroll-teal">
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            
            <div
              v-for="product in filteredProducts"
              :key="product._id"
              @click="addToInbound(product)"
              class="group relative bg-white dark:bg-[#0F172A] rounded-2xl p-2 border border-teal-50 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
              :class="{'ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-[#020617] border-teal-500': isAdded(product)}"
            >
              <div class="aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden relative mb-2">
                 <img :src="product.image || 'https://via.placeholder.com/150'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0">
                 
                 <div class="absolute top-2 left-2 bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-white/20">
                     <i class="fa-solid fa-warehouse text-[9px] text-teal-500"></i>
                     <span class="text-[10px] font-black text-slate-800 dark:text-white">{{ product.totalStock }}</span>
                 </div>

                 <div class="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                         <i class="fa-solid fa-plus text-lg"></i>
                     </div>
                 </div>

                 <transition name="pop">
                    <div v-if="isAdded(product)" class="absolute bottom-2 right-2 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-[#0F172A]">
                        <i class="fa-solid fa-check text-xs"></i>
                    </div>
                 </transition>
              </div>

              <div class="px-1 flex-1 flex flex-col">
                 <h3 class="text-xs font-bold text-slate-800 dark:text-white leading-tight line-clamp-2 min-h-[2rem] mb-2">{{ product.name }}</h3>
                 <div class="mt-auto border-t border-slate-100 dark:border-slate-800 pt-2 flex flex-col gap-1">
                     <div class="flex justify-between items-center text-[10px]">
                         <span class="text-slate-400">Oxirgi kelish:</span>
                         <span class="font-mono font-bold text-slate-600 dark:text-slate-300">{{ formatPriceCompact(product.costPrice) }}</span>
                     </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div 
        class="flex flex-col w-full lg:w-[500px] xl:w-[600px] bg-white dark:bg-[#0F172A] border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 absolute lg:relative inset-0 lg:inset-auto z-40 lg:z-auto"
        :class="mobileTab === 'inbound' ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
      >
        
        <div class="shrink-0 bg-slate-50 dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 pt-3 px-3">
            <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <button @click="mobileTab = 'catalog'" class="lg:hidden w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mr-2 text-slate-500 shadow-sm"><i class="fa-solid fa-arrow-left"></i></button>

                <div class="group relative pl-3 pr-7 py-2 rounded-t-lg text-[11px] font-bold border-t border-x cursor-pointer select-none min-w-[120px] transition-all bg-white dark:bg-[#1E293B] border-teal-500 text-teal-600 shadow-sm ring-1 ring-teal-500/20 z-10">
                    <span class="block truncate max-w-[90px]">{{ activeDocument.partyNumber || 'Yangi Faktura' }}</span>
                </div>
            </div>
        </div>

        <div class="shrink-0 p-4 bg-white dark:bg-[#0F172A] border-b border-slate-100 dark:border-slate-800">
             <div class="relative mb-3">
                <button 
                    @click="showSupplierList = !showSupplierList"
                    class="w-full flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-teal-400 transition group"
                >
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-orange-500 flex items-center justify-center shrink-0 shadow-sm">
                            <i class="fa-solid fa-truck-field"></i>
                        </div>
                        <div class="text-left">
                            <div class="text-xs font-bold text-slate-800 dark:text-white" :class="!activeDocument.supplierId && 'text-rose-500'">{{ activeSupplier ? activeSupplier.company : 'Yetkazib beruvchini tanlang' }}</div>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform" :class="{'rotate-180': showSupplierList}"></i>
                </button>

                <transition name="dropdown">
                    <div v-if="showSupplierList" class="absolute top-14 left-0 w-full bg-white dark:bg-[#1E293B] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                        <div class="max-h-48 overflow-y-auto thin-scroll">
                            <button v-for="s in suppliers" :key="s.id" @click="selectSupplier(s)" class="w-full p-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-left border-b border-slate-100 dark:border-slate-800 last:border-0 flex justify-between items-center group">
                                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-600">{{ s.company }}</span>
                                <i v-if="activeDocument.supplierId === s.id" class="fa-solid fa-check text-teal-500"></i>
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto p-3 bg-slate-50/50 dark:bg-[#020617] custom-scroll-teal pb-32 lg:pb-3">
          
          <div v-if="activeDocument.items.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-50 select-none">
             <div class="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                 <i class="fa-solid fa-cart-flatbed text-3xl text-slate-400"></i>
             </div>
             <p class="text-sm font-bold text-slate-600 dark:text-slate-300">Ro'yxat bo'sh</p>
          </div>

          <transition-group name="list" tag="div" class="space-y-4">
            <div 
              v-for="item in activeDocument.items" 
              :key="item.id" 
              class="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-3 relative group hover:shadow-md transition-all"
            >
              <div class="flex justify-between items-center mb-3">
                  <div class="flex items-center gap-3">
                      <img :src="item.image" class="w-10 h-10 rounded-lg bg-slate-100 object-cover border border-slate-100 dark:border-slate-700">
                      <h4 class="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 w-40">{{ item.name }}</h4>
                  </div>
                  <button @click="removeItem(item.id)" class="text-slate-300 hover:text-rose-500 transition px-2"><i class="fa-solid fa-trash-can text-sm"></i></button>
              </div>

              <div class="grid grid-cols-12 gap-2">
                  
                  <div class="col-span-4">
                      <label class="text-[8px] font-bold text-slate-400 uppercase ml-1 block mb-1">Tan Narx</label>
                      <input 
                          v-model.number="item.costPrice" 
                          type="number" 
                          class="w-full h-10 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none transition-all dark:text-white"
                          placeholder="0"
                      >
                  </div>

                  <div class="col-span-4">
                      <label class="text-[8px] font-bold text-teal-500 uppercase ml-1 block mb-1 flex justify-between">
                          Sotuv <span :class="getMargin(item) > 0 ? 'text-emerald-500' : 'text-rose-500'">{{ getMargin(item) }}%</span>
                      </label>
                      <input 
                          v-model.number="item.sellingPrice" 
                          type="number" 
                          class="w-full h-10 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-teal-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                          placeholder="0"
                      >
                  </div>

                  <div class="col-span-4">
                      <label class="text-[8px] font-bold text-slate-400 uppercase ml-1 block mb-1">Miqdor</label>
                      <div class="flex items-center h-10 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                          <button @click="changeQty(item, -1)" class="w-8 h-full flex items-center justify-center text-slate-400 hover:text-rose-500 active:scale-90 transition rounded-l-xl"><i class="fa-solid fa-minus text-[9px]"></i></button>
                          
                          <input 
                              v-model.number="item.qty" 
                              type="number" 
                              class="flex-1 w-full bg-transparent text-center text-sm font-black outline-none appearance-none dark:text-white"
                          >
                          
                          <button @click="changeQty(item, 1)" class="w-8 h-full flex items-center justify-center text-slate-400 hover:text-teal-500 active:scale-90 transition rounded-r-xl"><i class="fa-solid fa-plus text-[9px]"></i></button>
                      </div>
                  </div>

              </div>

              <div class="mt-2 pt-2 border-t border-slate-50 dark:border-slate-700/50 flex justify-end">
                  <span class="text-[9px] text-slate-400 font-bold uppercase mr-2 mt-0.5">Jami:</span>
                  <span class="text-xs font-black text-slate-800 dark:text-white">{{ formatPrice(item.costPrice * item.qty) }}</span>
              </div>

            </div>
          </transition-group>
        </div>

        <div class="shrink-0 p-4 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-700 z-30 pb-24 lg:pb-4 shadow-[-5px_0_15px_rgba(0,0,0,0.05)]">
            <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Jami Summa:</span>
                <span class="text-xl font-black font-mono tracking-tight text-slate-900 dark:text-white">{{ formatPrice(grandTotal) }}</span>
            </div>
            
            <div class="grid grid-cols-2 gap-2 mb-3">
                <button v-for="pt in paymentTypes" :key="pt.value" @click="selectedPaymentType = pt.value" class="py-2 rounded-lg border text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-all" :class="selectedPaymentType === pt.value ? 'bg-teal-50 border-teal-500 text-teal-600 dark:bg-teal-900/30' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700'">
                    <i :class="pt.icon"></i> {{ pt.label }}
                </button>
            </div>

            <button 
                @click="processInbound"
                :disabled="!isValidInbound"
                class="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg active:translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span v-if="isSubmitting"><i class="fa-solid fa-spinner fa-spin"></i> Saqlanmoqda...</span>
                <span v-else><i class="fa-solid fa-check-circle"></i> Tasdiqlash</span>
            </button>
        </div>

      </div>
    </div>

    <div class="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-700 flex z-50 pb-safe">
      <button @click="mobileTab = 'catalog'" class="flex-1 py-3 flex flex-col items-center justify-center gap-1 border-t-2 transition-colors" :class="mobileTab === 'catalog' ? 'border-teal-600 text-teal-600 bg-teal-50/50' : 'border-transparent text-slate-400'">
        <i class="fa-solid fa-boxes-stacked text-lg"></i>
        <span class="text-[10px] font-bold">Katalog</span>
      </button>
      <div class="w-px h-8 bg-slate-200 dark:bg-slate-700 self-center"></div>
      <button @click="mobileTab = 'inbound'" class="flex-1 py-3 flex flex-col items-center justify-center gap-1 border-t-2 transition-colors relative" :class="mobileTab === 'inbound' ? 'border-teal-600 text-teal-600 bg-teal-50/50' : 'border-transparent text-slate-400'">
        <i class="fa-solid fa-dolly text-lg"></i>
        <span class="text-[10px] font-bold">Kirim</span>
        <span v-if="activeDocument.items.length" class="absolute top-2 right-12 w-2 h-2 bg-rose-500 rounded-full animate-pulse border border-white"></span>
      </button>
    </div>

    <transition name="fade">
        <div v-if="showAddDocModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
            <div class="bg-white dark:bg-[#1E293B] w-full max-w-xs rounded-xl shadow-2xl overflow-hidden scale-100 transition-all">
                <div class="bg-slate-50 dark:bg-[#111827] px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide">Yangi Kirim</h3>
                    <button @click="showAddDocModal = false" class="text-slate-400 hover:text-rose-500"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="p-5">
                    <label class="block text-xs font-bold text-slate-500 mb-2">Hujjat Nomi</label>
                    <input v-model="newDocName" @keyup.enter="createNewDocument" type="text" placeholder="Masalan: Faktura #55..." class="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg px-3 text-sm font-bold focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none dark:bg-[#0B1120] dark:text-white transition-all">
                </div>
                <div class="px-5 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                    <button @click="showAddDocModal = false" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition">Bekor</button>
                    <button @click="createNewDocument" class="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition">Yaratish</button>
                </div>
            </div>
        </div>
    </transition>

    <transition name="toast">
        <div v-if="toast.show" class="fixed top-20 right-5 z-[100] bg-white dark:bg-[#1E293B] border-l-4 border-teal-500 rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[300px]">
            <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0"><i class="fa-solid fa-check"></i></div>
            <div>
                <h4 class="text-xs font-bold text-slate-800 dark:text-white uppercase">Muvaffaqiyatli</h4>
                <p class="text-xs text-slate-500">{{ toast.message }}</p>
            </div>
        </div>
    </transition>

  </div>
</template>

<style scoped>
.custom-scroll-teal::-webkit-scrollbar { width: 5px; }
.custom-scroll-teal::-webkit-scrollbar-thumb { background-color: #99f6e4; border-radius: 4px; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.list-enter-active, .list-leave-active { transition: all 0.2s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-5px); }
.pop-enter-active { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from { transform: scale(0); }
.scale-enter-active { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-enter-from { transform: scale(0.9) opacity(0); }
.toast-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-enter-from { transform: translateX(20px); opacity: 0; }
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
</style>