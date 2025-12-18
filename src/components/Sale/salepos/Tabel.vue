<template>
  <div class="h-screen w-full bg-[#F1F5F9] dark:bg-[#020617] flex flex-col lg:flex-row font-sans overflow-hidden text-slate-600 dark:text-slate-400 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
    
    <div class="flex-1 flex flex-col min-w-0 h-full relative z-0 transition-all duration-300" :class="mobileTab === 'catalog' ? 'flex' : 'hidden lg:flex'">
      
      <header class="h-20 shrink-0 bg-white/80 dark:bg-[#0F172A]/90 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-6 z-50 sticky top-0">
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg">
            <i class="fa-solid fa-calculator text-xl"></i>
          </div>
          <div class="flex flex-col">
            <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-white leading-none">Sotuv<span class="text-indigo-600 dark:text-indigo-400">POS</span></h1>
            <div class="flex items-center gap-2 mt-1.5">
               <span class="relative flex h-2 w-2">
                 <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tizim Aloqada</p>
            </div>
          </div>
        </div>
        
        <div class="hidden xl:flex items-center gap-6 bg-slate-50/80 dark:bg-slate-800/50 px-6 py-2.5 rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
            <div class="flex items-center gap-3 border-r border-slate-200 dark:border-slate-600 pr-6">
                <div class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                    <i class="fa-solid fa-store"></i>
                </div>
                <div class="flex flex-col">
                    <span class="text-[9px] font-bold text-slate-400 uppercase">Filial</span>
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Markaziy Kassa</span>
                </div>
            </div>
            <div class="flex flex-col">
                <span class="text-[9px] font-bold text-slate-400 uppercase">Vaqt</span>
                <span class="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">{{ currentTime }}</span>
            </div>
        </div>

        <div class="flex items-center gap-4">
            <button @click="toggleTheme" class="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-500 transition-all flex items-center justify-center shadow-sm">
              <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
            </button>
        </div>
      </header>

      <div class="px-5 py-4 flex gap-3 shrink-0 z-10 sticky top-16 bg-[#F1F5F9]/95 dark:bg-[#020617]/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <Select v-model="searchCategoryData" :options="categories" placeholder="Kategoriya..." searchable clearable size="middle" iconPre="fa-solid fa-layer-group" labelKey="name" valueKey="_id" style="width: 40%;"></Select>
        <div class="relative flex-1 group">
          <i class="fa-solid fa-barcode absolute left-4 top-4 text-slate-400"></i>
          <input v-model="productSearch" type="text" placeholder="Mahsulot qidiruvi..." class="w-full h-12 pl-11 pr-4 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none">
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-5 pb-32 lg:pb-5 custom-scroll">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          <div v-for="product in filteredProducts" :key="product.id" @click="product.stock > 0 ? addToCart(product) : null"
            class="group relative bg-white dark:bg-[#0F172A] rounded-2xl p-2.5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer flex flex-col overflow-hidden"
            :class="[product.stock <= 0 ? 'opacity-60 grayscale' : 'hover:shadow-xl hover:-translate-y-1', {'ring-2 ring-indigo-500 border-indigo-500': getItemQty(product.id) > 0}]">
            <div class="aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden relative mb-2.5">
               <img :src="product.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
               <div class="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-lg text-[9px] font-bold text-white border border-white/10 flex items-center gap-1">
                   <i class="fa-solid fa-layer-group text-[8px]"></i> {{ product.stock }} {{ product.unit }}
               </div>
               <div v-if="getItemQty(product.id) > 0" class="absolute bottom-2 right-2 min-w-[28px] h-7 px-1.5 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-white z-10">
                 {{ getItemQty(product.id) }}
               </div>
            </div>
            <div class="px-1 flex-1 flex flex-col">
               <h3 class="text-xs font-bold text-slate-800 dark:text-white line-clamp-2 mb-2 min-h-[2rem]">{{ product.name }}</h3>
               <div class="mt-auto border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between items-center">
                   <span class="text-[10px] text-slate-400">{{ product.category }}</span>
                   <span class="text-sm font-black text-slate-800 dark:text-slate-100">{{ formatPrice(product.price) }}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-[#111827] flex flex-col shadow-2xl lg:border-l border-slate-200 dark:border-slate-800 lg:w-[450px] xl:w-[500px] h-full overflow-hidden" :class="mobileTab === 'cart' ? 'flex fixed inset-0 z-50' : 'hidden lg:flex lg:static'">
      
      <div class="shrink-0 bg-slate-50 dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-700 px-3 pt-3 flex items-end gap-1 overflow-x-auto no-scrollbar">
        <button @click="mobileTab = 'catalog'" class="lg:hidden w-10 h-10 mb-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 flex items-center justify-center mr-2 text-slate-500 shadow-sm"><i class="fa-solid fa-arrow-left"></i></button>
        <button v-for="session in sessions" :key="session.id" @click="activeSessionId = session.id" class="relative px-4 py-3 rounded-t-xl text-[11px] font-bold transition-all min-w-[110px] flex items-center justify-between gap-2 border-t border-x border-transparent" :class="activeSessionId === session.id ? 'bg-white dark:bg-[#111827] text-indigo-600 border-slate-200 !border-b-transparent z-10' : 'text-slate-500'">
          <span>{{ session.name }}</span>
          <span v-if="sessions.length > 1" @click.stop="removeSession(session.id)" class="hover:text-red-500 w-5 h-5 flex items-center justify-center rounded-full transition"><i class="fa-solid fa-xmark"></i></span>
        </button>
        <button @click="addSession" class="w-10 h-10 mb-1 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600"><i class="fa-solid fa-plus"></i></button>
      </div>

      <div class="shrink-0 p-4 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-slate-800 z-10 grid grid-cols-2 gap-3">
        <Select v-model="activeSessionData.customerId" :options="customers" label="Mijoz" placeholder="Tanlang..." searchable clearable searchableIcon size="middle" iconPre="fa-solid fa-user" required labelKey="fullname" valueKey="_id" dropdownWidth="300ox">
         <template #option="{ option }">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
           <i class="fas fa-user"></i>
        </div>
        
        <div class="flex flex-col">
           <span class="font-black text-sm">{{ option.fullname }}</span>
           <div class="flex items-center gap-2">
              <span class="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 uppercase">
                {{ option.phoneNumber }}
              </span>
              <span class="text-[10px] text-indigo-500 font-bold italic">{{ option.position }}</span>
           </div>
        </div>
      </div>
    </template>
        </Select>
        <Select v-model="activeSessionData.supplierId" :options="drivers" label="Haydovchi" placeholder="Tanlang..." clearable searchable searchableIcon size="middle" iconPre="fa-solid fa-car" required labelKey="fullname" valueKey="_id">
          <template #option="{ option }">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
           <i class="fas fa-car"></i>
        </div>
        
        <div class="flex flex-col">
           <span class="font-black text-sm">{{ option.fullname }}</span>
           <div class="flex items-center gap-2">
              <span class="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 uppercase">
                {{ option.phoneNumber }}
              </span>
              <span class="text-[10px] text-indigo-500 font-bold italic">{{ option.position }}</span>
           </div>
        </div>
      </div>
    </template>
        </Select>
      </div>

      <div class="flex-1 overflow-y-auto p-4 custom-scroll bg-white dark:bg-[#111827] relative">
          <div v-if="activeSessionData.cart.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 select-none">
              <i class="fa-solid fa-basket-shopping text-4xl mb-4 opacity-40"></i>
              <p class="text-sm font-bold uppercase tracking-wider opacity-70">Savat bo'sh</p>
          </div>

          <transition-group name="list" tag="div" class="space-y-3">
              <div v-for="item in activeSessionData.cart" :key="item.id" class="group flex items-center gap-3 p-3 bg-white dark:bg-[#151E32] rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm hover:border-indigo-300 transition-all">
                  <img :src="item.image" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-700">
                  <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start">
                          <h4 class="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 pr-6 mb-1">{{ item.name }}</h4>
                          <button @click="removeItem(item.id)" class="text-slate-300 hover:text-rose-500 transition"><i class="fa-solid fa-trash-can text-xs"></i></button>
                      </div>
                      <div class="flex flex-col">
                          <span class="text-[10px] text-slate-400 font-mono">{{ formatPrice(item.price) }} x {{ item.qty }}</span>
                          <span class="text-sm font-black text-slate-900 dark:text-white">{{ formatPrice(item.price * item.qty) }}</span>
                      </div>
                  </div>
                  <div class="flex items-center bg-slate-50 dark:bg-[#020617] rounded-xl border border-slate-200 dark:border-slate-700 h-10 p-1 shrink-0">
                      <button @click="changeQty(item, -1)" class="w-8 h-full flex items-center justify-center text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-800 rounded-lg shadow-sm"><i class="fa-solid fa-minus text-[10px]"></i></button>
                      <input v-model.number="item.qty" type="number" @input="validateInput(item)" class="w-32 rounded-lg h-full bg-transparent text-center text-sm font-black text-indigo-600 outline-none">
                      <button @click="changeQty(item, 1)" class="w-8 h-full flex items-center justify-center text-slate-400 hover:text-emerald-500 bg-white dark:bg-slate-800 rounded-lg shadow-sm"><i class="fa-solid fa-plus text-[10px]"></i></button>
                  </div>
              </div>
          </transition-group>
      </div>

      <div class="shrink-0 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 p-4 pb-safe-offset shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
          <div class="flex items-center justify-between mb-4">
              <div class="flex gap-2">
                  <button @click="taxEnabled = !taxEnabled" class="h-10 px-3 rounded-xl border flex items-center gap-2 transition-all" :class="taxEnabled ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-700'">
                      <i class="fa-solid fa-circle-check" :class="taxEnabled ? 'text-indigo-600' : 'text-slate-300'"></i>
                      <span class="text-[11px] font-bold">QQS 12%</span>
                  </button>
                  <div class="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center gap-1">
                      <input v-model.number="discountPercent" type="number" class="w-32 bg-transparent rounded-lg text-center text-sm font-bold outline-none" placeholder="0">
                      <span class="text-[11px] font-bold text-slate-400">%</span>
                  </div>
              </div>
              <div class="text-right">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Jami</span>
                  <span class="text-lg font-black text-indigo-600 dark:text-indigo-400">{{ formatPrice(grandTotal) }}</span>
              </div>
          </div>

          <div class="grid grid-cols-4 gap-2 mb-4">
              <button v-for="pm in paymentMethods" :key="pm.value" @click="paymentType = pm.value" class="flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all relative" :class="paymentType === pm.value ? `bg-${pm.color}-50 border-${pm.color}-500 text-${pm.color}-700 dark:bg-${pm.color}-900/20 dark:text-${pm.color}-300` : 'bg-white border-slate-100 text-slate-400 dark:bg-slate-800 dark:border-slate-700'">
                  <i :class="pm.icon" class="text-sm mb-1"></i>
                  <span class="text-[9px] font-black uppercase">{{ pm.label }}</span>
                  <div v-if="paymentType === pm.value" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[8px] flex items-center justify-center border-2 border-white"><i class="fa-solid fa-check"></i></div>
              </button>
          </div>

          <button @click="processSale" class="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-between px-6" :disabled="activeSessionData.cart.length === 0">
              <span class="flex flex-col items-start">
                  <span class="text-[9px] font-normal opacity-70 italic lowercase">tranzaksiyani</span>
                  <span>Yakunlash</span>
              </span>
              <i class="fa-solid fa-arrow-right-long text-lg"></i>
          </button>
      </div>
    </div>

    <div class="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#0F172A] border-t border-slate-200 z-50 flex" v-if="mobileTab !== 'cart'">
      <button @click="mobileTab = 'catalog'" class="flex-1 py-3 flex flex-col items-center justify-center gap-1" :class="mobileTab === 'catalog' ? 'text-indigo-600' : 'text-slate-400'">
        <i class="fa-solid fa-boxes-stacked text-xl"></i>
        <span class="text-[10px] font-bold">Katalog</span>
      </button>
      <button @click="mobileTab = 'cart'" class="flex-1 py-3 flex flex-col items-center justify-center gap-1 relative" :class="mobileTab === 'cart' ? 'text-indigo-600' : 'text-slate-400'">
        <div class="relative">
            <i class="fa-solid fa-cart-shopping text-xl"></i>
            <span v-if="activeSessionData.cart.length > 0" class="absolute -top-2 -right-3 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-bounce">{{ activeSessionData.cart.length }}</span>
        </div>
        <span class="text-[10px] font-bold">Savat</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { storeToRefs } from 'pinia';
import { useToast } from "../../../UI/utils/useToast";
import Select from "../../../UI/Select.vue"

// --- STORES ---
import { SaleposManagmentStore } from "../../../stores/Sale/salepos/salepos.store"
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store"
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store"
import { EmployeeManagmentStore } from "../../../stores/HR/employee/employee.store"

const { toast } = useToast();
const store_product = ProductsManagmentStore()
const store_customer = CustomerManagmentStore()
const store_drivers = EmployeeManagmentStore()
const store_salepos = SaleposManagmentStore()

const { products: rawProducts } = storeToRefs(store_product)
const { customers } = storeToRefs(store_customer) 
const { employees: drivers } = storeToRefs(store_drivers)

const { 
    sessions, 
    activeSessionId, 
    discountPercent, 
    taxEnabled, 
    paymentType,
    activeSessionData, 
    grandTotal 
} = storeToRefs(store_salepos)

// --- LOCAL STATES ---
const isDark = ref(false)
const mobileTab = ref('catalog')
const productSearch = ref("")
const searchCategoryData = ref(null) // Tanlangan kategoriya ID si
const currentTime = ref("")

const paymentMethods = [
    { value: "naqd", label: "Naqd", icon: "fa-solid fa-money-bill-1-wave", color: "emerald" },
    { value: "karta", label: "Karta", icon: "fa-regular fa-credit-card", color: "blue" },
    { value: "click", label: "Click", icon: "fa-solid fa-mobile-screen", color: "sky" },
    { value: "qarz", label: "Nasiya", icon: "fa-solid fa-file-invoice", color: "rose" }
]

// --- COMPUTED ---
const products = computed(() => {
    if (!rawProducts.value) return [];
    return rawProducts.value.map((item, index) => ({
        id: item._id,
        name: item.name || 'Nomsiz',
        image: item.image || `https://picsum.photos/200/200?random=${index}`,
        price: item.salePrice || 0,
        stock: item.totalStock || 0,
        unit: item.unit || 'dona',
        category: item.category || 'Barchasi'
    }))
})

const categories = computed(() => {
    const list = [...new Set(products.value.map(p => p.category))];
    return [{ _id: null, name: "Barchasi" }, ...list.map(c => ({ _id: c, name: c }))];
})

const filteredProducts = computed(() => {
    let list = products.value;
    if (searchCategoryData.value) {
        list = list.filter(p => p.category === searchCategoryData.value);
    }
    if (productSearch.value) {
        const s = productSearch.value.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(s));
    }
    return list;
})

// --- METHODS ---
const getItemQty = (id) => activeSessionData.value.cart.find(i => i.id === id)?.qty || 0

const addToCart = (p) => {
    const item = activeSessionData.value.cart.find(i => i.id === p.id)
    if (item) {
        if (item.qty < p.stock) item.qty++;
        else toast.error("Zaxira yetarli emas!");
    } else {
        activeSessionData.value.cart.push({ ...p, qty: 1 });
    }
}

const changeQty = (item, delta) => {
    const p = products.value.find(prod => prod.id === item.id);
    if (delta > 0 && item.qty >= p.stock) {
        toast.error("Maksimal miqdor!");
        return;
    }
    if (item.qty + delta > 0) item.qty += delta;
    else removeItem(item.id);
}

const removeItem = (id) => {
    activeSessionData.value.cart = activeSessionData.value.cart.filter(i => i.id !== id);
}

// const processSale = async () => {
//     const payload = {
//         items: activeSessionData.value.cart.map(i => ({
//             product: i.id,
//             quantity: i.qty,
//             salePrice: i.price
//         })),
//         customerId: activeSessionData.value.customerId,
//         supplierId: activeSessionData.value.supplierId,
//         discountPercent: discountPercent.value,
//         taxEnabled: taxEnabled.value,
//         paymentType: paymentType.value,
//         grandTotal: grandTotal.value
//     };

//     const success = await store_salepos.CreateSaleTransaction(payload);
//     if (success) {
//         mobileTab.value = 'catalog';
//         store_product.GetAll(); // Qoldiqlarni yangilash
//     }
// }

const processSale = async () => {
    // 1. Payloadni shakllantirish uchun zaruriy hisob-kitoblar va ma'lumotlarni yig'ish

    // Savatdagi ma'lumotlarni server qabul qiladigan formatga o'tkazish
    const cartItems = activeSessionData.value.cart.map(item => ({
        productId: item.id, // Mahsulot IDsi (Backendga yuboriladigan ID)
        quantity: item.qty,
        salePrice: item.price,
        totalAmount: item.price * item.qty,
        unit: item.unit
    }));

    // Hisoblangan qiymatlar
    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const calculatedDiscountAmount = (subtotal * discountPercent.value) / 100;
    const totalAfterDiscount = subtotal - calculatedDiscountAmount;
    const taxRate = taxEnabled.value ? 0.12 : 0;
    const calculatedTaxAmount = taxEnabled.value ? totalAfterDiscount * taxRate : 0;

    // 2. Yakuniy Payloadni tuzish
    const payload = {
        // Asosiy ma'lumotlar
        type: 'sale', 
        branchId: 1, // Joriy filial IDsi (dynamic bo'lishi kerak)

        // Savat ma'lumotlari
        items: cartItems,
        
        // Mijoz va Haydovchi/Yetkazib beruvchi IDlari
        customerId: activeSessionData.value.customerId || null,
        driverId: activeSessionData.value.supplierId || null, 
        
        // Narx va To'lov hisobi (Bu Pinia'dan olingan grandTotal bilan mos kelishi shart)
        subtotal: subtotal, 
        discountPercent: discountPercent.value,
        discountAmount: calculatedDiscountAmount,
        totalAfterDiscount: totalAfterDiscount,
        taxEnabled: taxEnabled.value,
        taxRate: taxRate,
        taxAmount: calculatedTaxAmount,
        grandTotal: grandTotal.value,
        
        // To'lov turi
        paymentType: paymentType.value,
        paymentStatus: paymentType.value === 'qarz' ? 'pending' : 'cash',

        // Vaqt tamg'asi
        date: new Date().toISOString()
    };

    // Professional: Payloadni tekshirish uchun konsolga chiqarish
    console.groupCollapsed(`🚀 To'lov Yakunlash Payload - Seans ID: ${activeSessionId.value}`);

    // 3. Pinia actionni chaqirish va payloadni uzatish
    // store_salepos.CreateSaleTransaction endi to'g'ridan-to'g'ri payloadni qabul qiladi
    const success = await store_salepos.CreateSaleTransaction(payload);

    // 4. Muvaffaqiyatli bo'lsa UI feedback berish
    if (success) { 
        showToast(`To'lov qabul qilindi: ${formatPrice(store_salepos.grandTotal)}`, 'success');
        mobileTab.value = 'catalog';
    } else {
        // Xato xabari Pinia Store ichidan keladi, agar kerak bo'lsa
        showToast("Tranzaksiya muvaffaqiyatsiz tugadi (Pinia tekshiruvi)", 'error');
    }
}


const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark");
}

const formatPrice = (v) => new Intl.NumberFormat('uz-UZ').format(v) + " so'm";

onMounted(() => {
    setInterval(() => {
        currentTime.value = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    }, 1000);
    store_product.GetAll();
    store_customer.GetAll();
    store_drivers.GetAll();
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-10px); }
.pop-enter-active { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from { transform: scale(0); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
</style>