<template>
  <div class="h-screen w-full  rounded-lg bg-[#F8FAFC] dark:bg-[#0B1120] flex font-sans overflow-hidden text-slate-800 dark:text-slate-200 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
    
    <div v-show="!isCartFull" class="flex-1 flex flex-col min-w-0 bg-[#F1F5F9] dark:bg-[#0B1120] relative z-0 border-r border-slate-200 dark:border-slate-800">
      
      <header class="h-16 shrink-0 bg-white/90 dark:bg-[#151E32]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-5 sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <i class="fa-solid fa-cube text-lg"></i>
          </div>
          <h1 class="text-base font-bold tracking-tight">Ecowater <span class="text-indigo-600 dark:text-indigo-400">POS</span></h1>
        </div>
        <div class="flex items-center gap-2">
          <div class="hidden lg:block text-right mr-3 pr-3 border-r border-slate-200 dark:border-slate-700">
            <div class="text-xs font-bold font-mono text-slate-700 dark:text-slate-200">{{ currentTime }}</div>
            <div class="text-[10px] text-slate-400 uppercase tracking-wide">{{ currentDate }}</div>
          </div>
          <button @click="toggleTheme" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:text-amber-500 transition flex items-center justify-center">
            <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
          </button>
        </div>
      </header>

      <div class="px-5 py-4 flex gap-3 shrink-0 z-10 sticky top-16 bg-[#F1F5F9]/95 dark:bg-[#0B1120]/95 backdrop-blur-sm">
        <div class="relative w-[220px]" ref="categoryMenuRef">
          <button @click="showCategoryMenu = !showCategoryMenu" class="w-full h-11 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between px-3 hover:border-indigo-500 transition shadow-sm group">
            <div class="flex items-center gap-2 overflow-hidden">
              <div class="w-6 h-6 rounded bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-500 text-xs">
                <i :class="selectedCategoryIcon"></i>
              </div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ activeCategory }}</span>
            </div>
            <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200" :class="{'rotate-180': showCategoryMenu}"></i>
          </button>
          
          <transition name="dropdown">
            <div v-if="showCategoryMenu" class="absolute top-[calc(100%+6px)] left-0 w-full bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-30 p-2">
              <input v-model="categorySearch" type="text" placeholder="Izlash..." class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-500 mb-1">
              <div class="max-h-56 overflow-y-auto thin-scroll space-y-0.5">
                <button v-for="cat in filteredCategories" :key="cat.name" @click="selectCategory(cat)" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 transition" :class="activeCategory === cat.name ? 'text-indigo-600 font-bold bg-indigo-50 dark:bg-slate-800' : 'text-slate-600 dark:text-slate-400'">
                  <i :class="cat.icon"></i> {{ cat.name }}
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div class="relative flex-1 group">
          <i class="fa-solid fa-barcode absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
          <input v-model="productSearch" type="text" placeholder="Mahsulot nomi yoki shtrix kodi..." class="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm outline-none">
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-5 pb-5 custom-scroll-left">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            @click="addToCart(product)"
            class="group bg-white dark:bg-[#1E293B] rounded-2xl p-2.5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all duration-200 active:scale-[0.97] select-none flex flex-col relative overflow-hidden"
          >
            <div class="aspect-[4/3] rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden mb-2.5 relative">
              <img :src="product.image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
              <div class="absolute bottom-1 right-1 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[9px] text-white font-bold shadow-sm">
                {{ product.stock }}
              </div>
              <div class="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div class="bg-white/90 dark:bg-slate-800/90 rounded-full p-2.5 shadow-lg text-indigo-600 dark:text-indigo-400 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                   <i class="fa-solid fa-cart-plus text-lg"></i>
                 </div>
              </div>
            </div>
            
            <div class="mt-auto px-1">
              <h3 class="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1 mb-0.5">{{ product.name }}</h3>
              <span class="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{{ formatPrice(product.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-[420px]  lg:w-[460px] shrink-0 bg-white dark:bg-[#111827] shadow-2xl z-1 flex flex-col h-full border-l border-slate-200 dark:border-slate-800">
      
      <div class="shrink-0 bg-slate-50 dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-700 px-3 pt-3 flex items-end gap-1 overflow-x-auto no-scrollbar z-none">
        <button 
          v-for="session in sessions" :key="session.id" 
          @click="activeSessionId = session.id"
          class="relative px-3 py-2.5 rounded-t-lg text-[10px] font-bold transition-all min-w-[100px] flex items-center justify-between gap-2 border-t border-x border-transparent"
          :class="activeSessionId === session.id 
            ? 'bg-white dark:bg-[#111827] text-indigo-600 dark:text-indigo-400 border-slate-200 dark:border-slate-800 !border-b-transparent z-1' 
            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <span>{{ session.name }}</span>
          <span v-if="sessions.length > 1" @click.stop="removeSession(session.id)" class="hover:text-red-500"><i class="fa-solid fa-xmark"></i></span>
        </button>
        <button @click="addSession" class="w-8 h-8 mb-1 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition"><i class="fa-solid fa-plus text-xs"></i></button>
      </div>

      <div class="shrink-0 p-4 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-slate-800 z-1">
        <div class="relative mb-3" ref="customerDropdownRef">
          <label class="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 block pl-1">Mijoz</label>
          <button 
            @click="showCustomerList = !showCustomerList"
            class="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border transition-all rounded-xl flex items-center justify-between group"
            :class="!activeSessionData.customerId ? 'border-rose-300 dark:border-rose-900/50 hover:border-rose-400' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'"
          >
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                {{ activeCustomer ? activeCustomer.name.charAt(0) : '!' }}
              </div>
              <div class="flex flex-col text-left truncate">
                <span class="text-xs font-bold text-slate-800 dark:text-white leading-none mb-1 truncate">
                  {{ activeCustomer ? activeCustomer.name : 'Mijozni tanlang' }}
                </span>
                <div class="flex items-center gap-2 text-[10px]" v-if="activeCustomer">
                   <span class="font-mono text-slate-500">{{ activeCustomer.phone }}</span>
                   <span class="w-px h-2.5 bg-slate-300 dark:bg-slate-600"></span>
                   <span class="font-bold" :class="activeCustomer.balance >= 0 ? 'text-emerald-500' : 'text-rose-500'">{{ formatPrice(activeCustomer.balance) }}</span>
                </div>
                <span v-else class="text-[9px] text-rose-500 font-bold uppercase">Majburiy</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-down text-xs text-slate-400 transition-transform" :class="{'rotate-180': showCustomerList}"></i>
          </button>

          <transition name="dropdown">
            <div v-if="showCustomerList" class="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 p-2">
              <input v-model="customerSearch" type="text" placeholder="Mijoz izlash..." class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-500 mb-1">
              <div class="max-h-48 overflow-y-auto thin-scroll">
                <button v-for="c in filteredCustomers" :key="c.id" @click="selectCustomer(c)" class="w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between transition text-left border-b border-slate-50 dark:border-slate-700 last:border-0 group">
                  <div>
                    <div class="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600">{{ c.name }}</div>
                    <div class="text-[9px] text-slate-400 font-mono">{{ c.phone }}</div>
                  </div>
                  <div class="text-right">
                     <div class="text-[9px] text-slate-400">Balans</div>
                     <div class="text-[10px] font-bold" :class="c.balance >= 0 ? 'text-emerald-500' : 'text-rose-500'">{{ formatPrice(c.balance) }}</div>
                  </div>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div class="relative" ref="supplierDropdownRef">
          <label class="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 block pl-1">Yetkazib beruvchi</label>
          <button @click="showSupplierList = !showSupplierList" class="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs hover:border-orange-300 transition group shadow-sm"
          :class="!activeSessionData.supplierId ? 'border-rose-300 dark:border-rose-900/50 hover:border-rose-400' : 'border-slate-200 dark:border-slate-700 hover:border-orange-400'">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-truck-ramp-box" :class="!activeSessionData.supplierId ? 'text-rose-500' : 'text-orange-500'"></i>
              <div class="flex flex-col text-left">
                  <span class="font-bold text-xs" :class="!activeSessionData.supplierId ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'">
                    {{ activeSupplier ? activeSupplier.company : "Tanlanmagan" }}
                  </span>
                  <span class="text-[9px] text-slate-400" v-if="activeSupplier">{{ activeSupplier.phone }} • {{ activeSupplier.orders }} zakaz</span>
                  <span class="text-[9px] text-rose-400 font-bold uppercase" v-else>Majburiy</span>
              </div>
            </div>
            <i class="fa-solid fa-caret-down text-[10px] text-slate-400"></i>
          </button>

          <transition name="dropdown">
            <div v-if="showSupplierList" class="absolute top-[calc(100%+4px)] w-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-xl z-50 p-2 overflow-hidden">
              <input v-model="supplierSearch" type="text" placeholder="Yetkazuvchi izlash..." class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-orange-400 mb-1">
              <div class="max-h-40 overflow-y-auto thin-scroll space-y-0.5">
                <button @click="selectSupplier(null)" class="w-full text-left px-3 py-2 text-xs font-bold text-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                  Do'kon zaxirasidan
                </button>
                <button v-for="s in filteredSuppliers" :key="s.id" @click="selectSupplier(s)" class="w-full text-left px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 last:border-0 group">
                  <div>
                      <div class="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-orange-500">{{ s.company }}</div>
                      <div class="text-[9px] text-slate-400">{{ s.phone }}</div>
                  </div>
                  <span class="text-[9px] bg-orange-50 dark:bg-slate-600 px-1 rounded font-bold text-orange-600 dark:text-orange-300">{{ s.orders }} zakaz</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 custom-scroll-indigo bg-white dark:bg-[#111827] relative min-h-0">
        <div v-if="activeSessionData.cart.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 select-none">
          <i class="fa-solid fa-basket-shopping text-4xl mb-3 opacity-40"></i>
          <p class="text-xs font-bold uppercase tracking-wider opacity-70">Savat bo'sh</p>
        </div>

        <transition-group name="list" tag="div" class="space-y-3">
          <div 
            v-for="item in activeSessionData.cart" 
            :key="item.id" 
            class="group bg-slate-50 dark:bg-[#1E293B] p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 transition-all flex gap-3 select-none"
          >
            <img :src="item.image" class="w-14 h-14 rounded-xl object-cover bg-white shrink-0">
            <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div class="flex justify-between items-start">
                <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{{ item.name }}</h4>
                <span class="text-xs font-bold text-slate-900 dark:text-white">{{ formatPrice(item.price * item.qty) }}</span>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-[10px] text-slate-400 font-mono">{{ formatPrice(item.price) }}</span>
                <div class="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 h-6">
                  <button @click="changeQty(item, -1)" class="w-6 h-full flex items-center justify-center text-[10px] text-slate-500 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 rounded transition"><i class="fa-solid fa-minus"></i></button>
                  <span class="w-7 text-center text-[10px] font-bold text-slate-700 dark:text-white">{{ item.qty }}</span>
                  <button @click="changeQty(item, 1)" class="w-6 h-full flex items-center justify-center text-[10px] text-slate-500 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-800 rounded transition"><i class="fa-solid fa-plus"></i></button>
                </div>
              </div>
            </div>
            <button @click="removeItem(item.id)" class="self-center p-2 text-slate-300 hover:text-rose-500 rounded-lg transition opacity-0 group-hover:opacity-100">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </transition-group>
      </div>

      <div class="shrink-0 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50">
        
        <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800 mb-4">
            <div class="grid grid-cols-2 gap-4 text-xs mb-3">
                <div class="space-y-1">
                    <div class="flex justify-between text-slate-500">
                        <span>Oraliq</span>
                        <span class="font-bold text-slate-800 dark:text-slate-200">{{ formatPrice(subtotal) }}</span>
                    </div>
                    <label class="flex justify-between items-center cursor-pointer group">
                        <div class="flex items-center gap-1.5">
                            <input type="checkbox" v-model="taxEnabled" class="accent-indigo-500 w-3 h-3 rounded-sm">
                            <span class="group-hover:text-indigo-600 transition">QQS 12%</span>
                        </div>
                        <span class="font-bold text-slate-700 dark:text-slate-300">{{ formatPrice(taxAmount) }}</span>
                    </label>
                </div>
                <div class="border-l border-slate-200 dark:border-slate-700 pl-4 flex flex-col justify-center">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-slate-500 flex items-center gap-1"><i class="fa-solid fa-tag text-indigo-400"></i> Chegirma</span>
                        <span v-if="discountPercent > 0" class="text-rose-500 font-bold text-[10px]">-{{ formatPrice(discountAmount) }}</span>
                    </div>
                    <div class="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus-within:ring-1 ring-indigo-500 transition">
                        <input v-model.number="discountPercent" type="number" min="0" max="100" class="w-full text-right bg-transparent font-bold text-indigo-600 outline-none placeholder:text-slate-300" placeholder="0">
                        <span class="text-slate-400 font-bold ml-1">%</span>
                    </div>
                </div>
            </div>

            <div class="border-t border-dashed border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-end">
                <div class="flex flex-col">
                    <span class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Jami to'lov</span>
                    <span class="text-[9px] text-emerald-500 font-bold" v-if="isValidSale">Tayyor</span>
                </div>
                <span class="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{{ formatPrice(grandTotal) }}</span>
            </div>
        </div>

        <div class="grid grid-cols-4 gap-2 mb-3">
          <button 
            v-for="pm in paymentMethods" :key="pm.value" @click="paymentType = pm.value"
            class="flex flex-col items-center justify-center py-2.5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group"
            :class="paymentType === pm.value 
              ? 'bg-white dark:bg-slate-800 border-indigo-600 text-indigo-600 shadow-md transform -translate-y-1' 
              : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
          >
            <i :class="pm.icon" class="text-sm mb-1 transition-transform group-hover:scale-110"></i>
            <span class="text-[8px] font-bold uppercase">{{ pm.label }}</span>
            <div v-if="paymentType === pm.value" class="absolute top-0 right-0 w-3 h-3 bg-indigo-600 rounded-bl-lg"></div>
          </button>
        </div>

        <button 
          @click="processSale"
          :disabled="!isValidSale"
          class="w-full h-12 rounded-2xl font-bold shadow-xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide"
          :class="isValidSale 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30' 
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-70'"
        >
          <i class="fa-solid" :class="isValidSale ? 'fa-check-circle' : 'fa-lock'"></i>
          {{ isValidSale ? "To'lovni qabul qilish" : "Ma'lumotlar yetarli emas" }}
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
import { OrderManagmentStore } from "../../../stores/Sale/orders/orders.store";
const store_orders = OrderManagmentStore();

import { storeToRefs } from "pinia";
const { order_modal, drivers, driver_binding_modal } =
  storeToRefs(store_orders);
// --- 🛠️ Data ---
const categories = [
  { name: "Barchasi", icon: "fa-solid fa-border-all" },
  { name: "Elektronika", icon: "fa-solid fa-microchip" },
  { name: "Oziq-ovqat", icon: "fa-solid fa-burger" },
  { name: "Kiyim", icon: "fa-solid fa-shirt" },
  { name: "Sport", icon: "fa-solid fa-person-running" }
]

const products = ref(Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Mahsulot ${i + 1} Premium`,
  price: Math.floor(Math.random() * 500) + 10,
  category: ["Elektronika", "Oziq-ovqat", "Kiyim", "Sport"][i % 4],
  image: `https://picsum.photos/200/200?random=${i + 150}`,
  stock: Math.floor(Math.random() * 50) + 5
})))

const customers = ref([
  { id: 1, name: "Ali Valiyev", balance: 1200000, phone: "+998 90 123 45 67" },
  { id: 2, name: "Maftuna Z.", balance: -300000, phone: "+998 93 987 65 43" }
])

const suppliers = ref([
  { id: 1, company: "Global Trade LLC", phone: "+998 90 111 22 33", orders: 12 },
  { id: 2, company: "Local Farmer Best", phone: "+998 93 444 55 66", orders: 5 }
])

const paymentMethods = [
  { value: "naqd", label: "Naqd", icon: "fa-solid fa-money-bill-1-wave" },
  { value: "karta", label: "Karta", icon: "fa-brands fa-cc-visa" },
  { value: "click", label: "Payme", icon: "fa-solid fa-mobile-screen-button" },
  { value: "qarz", label: "Nasiya", icon: "fa-solid fa-file-invoice" }
]

// State
const isDark = ref(false)
const isCartFull = ref(false)
const currentTime = ref("")
const currentDate = ref("")
const productSearch = ref("")
const activeCategory = ref("Barchasi")

// Dropdown State
const showCategoryMenu = ref(false)
const categorySearch = ref("")
const categoryMenuRef = ref(null)
const showCustomerList = ref(false)
const customerSearch = ref("")
const customerDropdownRef = ref(null)
const showSupplierList = ref(false)
const supplierSearch = ref("")
const supplierDropdownRef = ref(null)

// Logic
const sessions = ref([{ id: 1, name: "Chek #1", cart: [], customerId: null, supplierId: null }])
const activeSessionId = ref(1)

const activeSessionData = computed(() => sessions.value.find(s => s.id === activeSessionId.value) || sessions.value[0])
const activeCustomer = computed(() => customers.value.find(c => c.id === activeSessionData.value.customerId) || null)
const activeSupplier = computed(() => suppliers.value.find(s => s.id === activeSessionData.value.supplierId) || null)

const selectedCategoryIcon = computed(() => categories.find(c => c.name === activeCategory.value)?.icon || 'fa-solid fa-layer-group')

const filteredCategories = computed(() => categorySearch.value ? categories.filter(c => c.name.toLowerCase().includes(categorySearch.value.toLowerCase())) : categories)
const filteredCustomers = computed(() => customerSearch.value ? customers.value.filter(c => c.name.toLowerCase().includes(customerSearch.value.toLowerCase()) || c.phone.includes(customerSearch.value)) : customers.value)
const filteredSuppliers = computed(() => supplierSearch.value ? suppliers.value.filter(s => s.company.toLowerCase().includes(supplierSearch.value.toLowerCase())) : suppliers.value)

const filteredProducts = computed(() => {
  let list = products.value
  if (activeCategory.value !== "Barchasi") list = list.filter(p => p.category === activeCategory.value)
  if (productSearch.value) list = list.filter(p => p.name.toLowerCase().includes(productSearch.value.toLowerCase()))
  return list
})

// Calculations (Percent Discount)
const subtotal = computed(() => activeSessionData.value.cart.reduce((sum, item) => sum + (item.price * item.qty), 0))
const taxEnabled = ref(false)
const discountPercent = ref(0)
const discountAmount = computed(() => subtotal.value * (discountPercent.value / 100))
const taxAmount = computed(() => taxEnabled.value ? subtotal.value * 0.12 : 0)
const grandTotal = computed(() => Math.max(0, subtotal.value + taxAmount.value - discountAmount.value))
const paymentType = ref("naqd")

// Validatsiya
const isValidSale = computed(() => activeSessionData.value.cart.length > 0 && activeSessionData.value.customerId && activeSessionData.value.supplierId)

// Actions
const selectCategory = (cat) => { activeCategory.value = cat.name; showCategoryMenu.value = false; categorySearch.value = "" }
const selectCustomer = (c) => { activeSessionData.value.customerId = c.id; showCustomerList.value = false; customerSearch.value = "" }
const selectSupplier = (s) => { activeSessionData.value.supplierId = s ? s.id : null; showSupplierList.value = false; supplierSearch.value = "" }

const addToCart = (product) => {
  const cart = activeSessionData.value.cart
  const item = cart.find(i => i.id === product.id)
  if (item) {
    if (item.qty < product.stock) item.qty++
    else showToast("Ombor zaxirasi tugadi!", "error")
  } else {
    cart.push({ ...product, qty: 1 })
  }
}

const changeQty = (item, delta) => {
  const target = activeSessionData.value.cart.find(i => i.id === item.id)
  if (!target) return
  if (target.qty + delta > 0) target.qty += delta
  else removeItem(item.id)
}

const removeItem = (id) => { activeSessionData.value.cart = activeSessionData.value.cart.filter(i => i.id !== id) }

const addSession = () => {
  const id = Date.now()
  sessions.value.push({ id, name: `Chek #${sessions.value.length + 1}`, cart: [], customerId: null, supplierId: null })
  activeSessionId.value = id
}

const removeSession = (id) => {
  if (sessions.value.length <= 1) return
  const idx = sessions.value.findIndex(s => s.id === id)
  sessions.value = sessions.value.filter(s => s.id !== id)
  if (activeSessionId.value === id) activeSessionId.value = sessions.value[Math.max(0, idx - 1)].id
}

const processSale = () => {
  if (!activeSessionData.value.customerId) return showToast("Mijozni tanlang!", "error")
  if (!activeSessionData.value.supplierId) return showToast("Yetkazib beruvchini tanlang!", "error")
  if (activeSessionData.value.cart.length === 0) return showToast("Savat bo'sh!", "error")
  
  showToast(`Sotuv muvaffaqiyatli: ${formatPrice(grandTotal.value)}`)
  activeSessionData.value.cart = []
  discountPercent.value = 0
  activeSessionData.value.customerId = null
  activeSessionData.value.supplierId = null
}

const formatPrice = (val) => new Intl.NumberFormat('uz-UZ').format(val * 12500) + " so'm"
const toggleTheme = () => { isDark.value = !isDark.value; document.documentElement.classList.toggle("dark", isDark.value) }

const toast = reactive({ show: false, message: "", type: "success" })
let toastTimer
const showToast = (msg, type="success") => {
  toast.message = msg; toast.type = type; toast.show = true
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.show = false, 2500)
}

const handleClickOutside = (e) => {
  if (categoryMenuRef.value && !categoryMenuRef.value.contains(e.target)) showCategoryMenu.value = false
  if (customerDropdownRef.value && !customerDropdownRef.value.contains(e.target)) showCustomerList.value = false
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
/* 🟡 Universal Scroll Hide */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: 0; }

/* 🔵 Chap taraf skroll (Visible - Thin) */
.custom-scroll-left::-webkit-scrollbar { width: 4px; }
.custom-scroll-left::-webkit-scrollbar-track { background: transparent; }
.custom-scroll-left::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
.dark .custom-scroll-left::-webkit-scrollbar-thumb { background-color: #334155; }

/* 🟣 O'ng taraf skroll (Visible - Thin - Indigo) */
.custom-scroll-indigo::-webkit-scrollbar { width: 4px; }
.custom-scroll-indigo::-webkit-scrollbar-track { background: transparent; }
.custom-scroll-indigo::-webkit-scrollbar-thumb { background-color: #a5b4fc; border-radius: 10px; }
.dark .custom-scroll-indigo::-webkit-scrollbar-thumb { background-color: #6366f1; }

/* Transitions */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.96); }

.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-10px); }

.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-20px) scale(0.9); }
</style>