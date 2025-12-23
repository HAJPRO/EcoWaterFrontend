<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import moment from "moment-timezone";
import { SaleposManagmentStore } from "../../../stores/Sale/salepos/salepos.store";

// --- UI COMPONENTS ---
import BaseModal from "../../../UI/Modal.vue";
import DataTable from "../../../UI/DataTable.vue";
import Button from "../../../UI/Button.vue";
import Input from "../../../UI/Input.vue";
import Select from "../../../UI/Select.vue";
import Badge from "../../../UI/Badge.vue";
import ExportDropdown from "../../../UI/ExportDropdown.vue";

const store_sale = SaleposManagmentStore();
const { detail_modal, customerSalesById } = storeToRefs(store_sale);

const expandedRows = ref([]);

// --- 🟢 FILTRLAR STATE ---
const isFilterVisible = ref(false); 
const isDateDropdownOpen = ref(false);
const dateDropdownRef = ref(null);

const filters = ref({
  author: '',
  driver: '',
  paymentType: '',
  startDate: '',
  endDate: ''
});

// --- 🟢 DINAMIK OPTIONS (customerSalesById dan avtomatik yig'ish) ---
const authorOptions = computed(() => {
  const map = new Map();
  map.set('all', { label: "Barcha sotuvchilar", value: "" });
  (customerSalesById.value || []).forEach(s => { 
    if(s.author?._id) map.set(s.author._id, { label: s.author.fullname, value: s.author._id })
  });
  return Array.from(map.values());
});

const driverOptions = computed(() => {
  const map = new Map();
  map.set('all', { label: "Barcha haydovchilar", value: "" });
  (customerSalesById.value || []).forEach(s => { 
    if(s.driverId?._id) map.set(s.driverId._id, { label: s.driverId.fullname, value: s.driverId._id })
  });
  return Array.from(map.values());
});

const paymentOptions = computed(() => {
  const map = new Map();
  map.set('all', { label: "Barcha to'lovlar", value: "" });
  (customerSalesById.value || []).forEach(s => { 
    if(s.paymentType) map.set(s.paymentType, { label: s.paymentType.toUpperCase(), value: s.paymentType });
  });
  return Array.from(map.values());
});

// --- 🟢 PROFESSIONAL FILTRLASH MANTIQI ---
const filteredSales = computed(() => {
  const data = customerSalesById.value || [];
  return data.filter(sale => {
    const matchesAuthor = !filters.value.author || sale.author?._id === filters.value.author;
    const matchesDriver = !filters.value.driver || sale.driverId?._id === filters.value.driver;
    const matchesPayment = !filters.value.paymentType || sale.paymentType === filters.value.paymentType;

    let matchesDate = true;
    if (filters.value.startDate || filters.value.endDate) {
      const saleMoment = moment(sale.date);
      if (filters.value.startDate && saleMoment.isBefore(moment(filters.value.startDate).startOf('day'))) matchesDate = false;
      if (filters.value.endDate && saleMoment.isAfter(moment(filters.value.endDate).endOf('day'))) matchesDate = false;
    }
    return matchesAuthor && matchesDriver && matchesPayment && matchesDate;
  });
});

// --- 🟢 REAKTIV ANALITIKA ---
const stats = computed(() => {
  const data = filteredSales.value;
  const total = data.reduce((a, b) => a + Number(b.totalAmount), 0);
  const count = data.length;
  return {
    total,
    count,
    average: count > 0 ? Math.round(total / count) : 0,
    lastPurchase: data.length > 0 ? data[0].date : null
  };
});

// --- METHODS ---
const resetFilters = () => {
  filters.value = { author: '', driver: '', paymentType: '', startDate: '', endDate: '' };
};

const formatPrice = (p) => new Intl.NumberFormat("uz-UZ").format(p || 0);

const toggleExpand = (id) => {
  expandedRows.value = expandedRows.value.includes(id) 
    ? expandedRows.value.filter(i => i !== id) 
    : [...expandedRows.value, id];
};

const handleClickOutsideDate = (event) => {
  if (dateDropdownRef.value && !dateDropdownRef.value.contains(event.target)) {
    isDateDropdownOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutsideDate));
onUnmounted(() => document.removeEventListener('click', handleClickOutsideDate));

const columns = [
  { key: 'orderNumber', label: 'Buyurtma', width: '130px', fixed: 'left' },
  { key: 'author.fullname', label: 'Xizmat Ko\'rsatuvchi', width: '220px' },
  { key: 'driverId.fullname', label: 'Logistika/Haydovchi', width: '220px' },
  { key: 'date', label: 'Vaqt', width: '130px', align: 'center' },
  { key: 'totalAmount', label: 'Summa', width: '160px', align: 'right' },
  { key: 'status', label: 'Holat', width: '140px', align: 'center' },
  { key: 'actions', label: '', width: '60px', align: 'center' }
];
</script>

<template>
  <BaseModal v-model="detail_modal" width="max-w-[98vw]" class="premium-modal">
    
    <template #header>
      <div class="flex items-center justify-between w-full px-4 py-2 bg-transparent">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 rounded-2xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 rotate-3">
            <i class="fa-solid fa-chart-line-up text-2xl"></i>
          </div>
          <div class="flex flex-col text-left">
            <div class="flex items-center gap-2">
               <span class="text-[10px] font-black uppercase text-indigo-500 dark:text-indigo-400 tracking-[0.3em]">Smart Insights</span>
               <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mt-0.5">
              {{ customerSalesById?.[0]?.customerId?.fullname || 'Mijoz Ma\'lumotlari' }}
            </h2>
          </div>
        </div>
        <Button @click="detail_modal = false" variant="light" class="!rounded-full !w-11 !h-11 !p-0 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
            <i class="fa-solid fa-xmark text-lg"></i>
        </Button>
      </div>
    </template>

    <div class="space-y-6 p-4 bg-[#f8fafc]/50 dark:bg-slate-950/50 min-h-[85vh]">
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4"><i class="fa-solid fa-wallet text-xl"></i></div>
          <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Filtrlangan Savdo</p>
          <h3 class="text-2xl font-mono font-black text-slate-900 dark:text-white tracking-tighter leading-none">{{ formatPrice(stats.total) }} <span class="text-xs opacity-40 font-sans">UZS</span></h3>
        </div>

        <div class="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4"><i class="fa-solid fa-shopping-bag text-xl"></i></div>
          <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Buyurtmalar</p>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white leading-none">{{ stats.count }} <small class="text-xs font-medium opacity-40">ta</small></h3>
        </div>

        <div class="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4"><i class="fa-solid fa-chart-pie text-xl"></i></div>
          <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">O'rtacha Chek</p>
          <h3 class="text-2xl font-mono font-black text-slate-900 dark:text-white leading-none">{{ formatPrice(stats.average) }}</h3>
        </div>

        <div class="p-6 rounded-[2.5rem] bg-slate-900 dark:bg-indigo-600 text-white shadow-2xl relative overflow-hidden group">
          <div class="relative z-10 flex flex-col h-full justify-between">
            <div class="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4 backdrop-blur-md border border-white/10"><i class="fa-solid fa-calendar-star text-xl"></i></div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Oxirgi Xarid</p>
              <h3 class="text-lg font-black tracking-tight leading-none text-white">{{ stats.lastPurchase ? moment(stats.lastPurchase).format('DD MMM, YYYY') : '—' }}</h3>
            </div>
          </div>
          <i class="fa-solid fa-history absolute -right-4 -bottom-4 text-7xl opacity-10 -rotate-12 transition-transform duration-700 group-hover:rotate-0"></i>
        </div>
      </div>

      <div class="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-visible z-[50]">
        <div class="px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div class="flex items-center gap-4">
             <button @click="isFilterVisible = !isFilterVisible" 
               :class="isFilterVisible ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'"
               class="flex items-center gap-3 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
               <i class="fa-solid" :class="isFilterVisible ? 'fa-xmark' : 'fa-sliders'"></i> {{ isFilterVisible ? 'Yopish' : 'Filtrlash' }}
             </button>
             <Badge v-if="filteredSales.length !== customerSalesById.length" variant="rose" size="sm" class="!px-3 !py-1">{{ filteredSales.length }} natija</Badge>
          </div>
          
          <div class="flex items-center gap-3">
             <Button v-if="isFilterVisible" @click="resetFilters" variant="light" size="sm" class="!text-rose-500 dark:!bg-rose-500/10 !border-none !px-4 !h-10">
                <i class="fa-solid fa-rotate-right mr-2 text-[10px]"></i> Tozalash
             </Button>
             <div class="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
             <ExportDropdown variant="primary" class="!rounded-2xl shadow-lg shadow-indigo-500/20" />
          </div>
        </div>

        <transition name="filter-slide">
          <div v-if="isFilterVisible" class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 items-end">
              <div class="lg:col-span-3 space-y-2 text-left">
                <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Sotuvchi</label>
                <Select v-model="filters.author" :options="authorOptions" searchable clearable class="!bg-slate-50 dark:!bg-slate-800 !rounded-2xl border-none shadow-inner" />
              </div>

              <div class="lg:col-span-3 space-y-2 text-left">
                <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Logistika / Haydovchi</label>
                <Select v-model="filters.driver" :options="driverOptions" searchable clearable class="!bg-slate-50 dark:!bg-slate-800 !rounded-2xl border-none shadow-inner" />
              </div>

              <div class="lg:col-span-2 space-y-2 text-left">
                <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">To'lov uslubi</label>
                <Select v-model="filters.paymentType" :options="paymentOptions" clearable class="!bg-slate-50 dark:!bg-slate-800 !rounded-2xl border-none shadow-inner" />
              </div>

              <div class="lg:col-span-4 space-y-2 relative text-left" ref="dateDropdownRef">
                <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Vaqt oralig'i</label>
                <div @click.stop="isDateDropdownOpen = !isDateDropdownOpen"
                  class="flex items-center justify-between px-5 h-[48px] bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl cursor-pointer hover:border-indigo-400 transition-all shadow-inner">
                  <div class="flex items-center gap-3">
                    <i class="fa-solid fa-calendar-range text-indigo-500 text-sm"></i>
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {{ filters.startDate || filters.endDate ? (filters.startDate + ' → ' + filters.endDate) : 'Barcha davr' }}
                    </span>
                  </div>
                  <i class="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
                </div>

                <transition name="dropdown-pop">
                  <div v-if="isDateDropdownOpen" class="absolute top-full left-0 mt-3 w-full min-w-[320px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] shadow-2xl z-[100] p-6 ring-1 ring-slate-900/5">
                    <div class="grid grid-cols-2 gap-4 mb-5">
                      <div class="text-left flex flex-col gap-1">
                        <span class="text-[9px] font-black text-slate-400 uppercase ml-1">Boshlanish</span>
                        <input type="date" v-model="filters.startDate" class="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-900 border-none rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" />
                      </div>
                      <div class="text-left flex flex-col gap-1">
                        <span class="text-[9px] font-black text-slate-400 uppercase ml-1">Tugash</span>
                        <input type="date" v-model="filters.endDate" class="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-900 border-none rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" />
                      </div>
                    </div>
                    <Button @click="isDateDropdownOpen = false" variant="primary" class="w-full !rounded-xl font-black uppercase tracking-widest text-[10px] py-3.5">Tasdiqlash</Button>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden z-10">
        <DataTable :items="filteredSales" :columns="columns" class="premium-table">
          
          <template #orderNumber="{ row }">
            <div class="flex items-center gap-4 py-2 ml-2">
              <div class="w-1 h-8 bg-indigo-500 rounded-full"></div>
              <div class="flex flex-col text-left">
                <span class="font-mono font-black text-slate-900 dark:text-white tracking-tighter text-[15px]">#{{ row.orderNumber }}</span>
                <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase italic">TRX: {{ row._id.slice(-6).toUpperCase() }}</span>
              </div>
            </div>
          </template>

          <template #author.fullname="{ row }">
            <div class="flex items-center gap-3 py-1 text-left">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs border border-indigo-100 dark:border-indigo-800/50 uppercase">
                {{ row.author?.fullname?.charAt(0) || 'S' }}
              </div>
              <div class="flex flex-col">
                <span class="text-[13px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight leading-none mb-1">{{ row.author?.fullname || '—' }}</span>
                <span class="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 italic">{{ row.author?.phoneNumber || 'n/a' }}</span>
              </div>
            </div>
          </template>

          <template #driverId.fullname="{ row }">
            <div class="flex items-center gap-3 py-1 text-left">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                <i class="fa-solid fa-truck-steering text-sm"></i>
              </div>
              <div class="flex flex-col">
                <span class="text-[13px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight leading-none mb-1">{{ row.driverId?.fullname || 'Tayinlanmagan' }}</span>
                <span class="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 italic">{{ row.driverId?.phoneNumber || '—' }}</span>
              </div>
            </div>
          </template>

          <template #date="{ row }">
            <div class="flex flex-col items-center">
              <span class="font-black text-slate-900 dark:text-white text-[12px] uppercase">{{ moment(row.date).format('DD MMM, YYYY') }}</span>
              <div class="flex items-center gap-1.5 mt-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md">
                <i class="fa-solid fa-clock text-[9px] text-indigo-500"></i>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold">{{ moment(row.date).format('HH:mm') }}</span>
              </div>
            </div>
          </template>

          <template #totalAmount="{ row }">
            <div class="flex flex-col items-end px-2">
              <span class="font-black text-slate-900 dark:text-white font-mono text-[17px] tracking-tighter leading-none">{{ formatPrice(row.totalAmount) }}</span>
              <div class="flex items-center gap-1.5 mt-1.5">
                <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">UZS</span>
                <Badge :variant="row.paymentType === 'CASH' ? 'emerald' : 'indigo'" size="sm" outline class="!font-black !px-2 !rounded-md">{{ row.paymentType || 'CASH' }}</Badge>
              </div>
            </div>
          </template>

          <template #status="{ row }">
            <Badge :variant="row.status === 'Bekor qilindi' ? 'rose' : (row.status === 'Yangi' ? 'indigo' : 'emerald')" dot outline class="min-w-[130px] !py-1.5">
              {{ row.status || 'Bajarildi' }}
            </Badge>
          </template>

          <template #actions="{ row }">
            <Button @click="toggleExpand(row._id)" variant="light" class="!rounded-2xl !w-11 !h-11 !p-0 border border-slate-100 dark:border-slate-800 hover:!bg-indigo-600 hover:!text-white shadow-sm transition-all duration-300">
              <i class="fa-solid transition-transform duration-500 text-sm" :class="[expandedRows.includes(row._id) ? 'fa-minus' : 'fa-plus']"></i>
            </Button>
          </template>

          <template #expand="{ row }">
            <div v-if="expandedRows.includes(row._id)" class="p-8 bg-[#fdfdff] dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4 duration-500">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Buyurtma Detallari</h4>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="item in row.items" :key="item._id" class="group bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden text-left">
                  <div class="relative z-10">
                    <div class="flex justify-between items-start mb-4">
                      <span class="text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-tight">{{ item.name }}</span>
                      <Badge variant="indigo" size="sm" outline>{{ item.unit || 'ta' }}</Badge>
                    </div>
                    <div class="flex justify-between pt-5 border-t border-slate-50 dark:border-slate-800 mt-4">
                      <div><span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Dona Narxi</span><span class="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{{ formatPrice(item.salePrice) }}</span></div>
                      <div class="text-right"><span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Jami ({{ item.quantity }})</span><span class="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono italic">{{ formatPrice(item.quantity * item.salePrice) }}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.filter-slide-enter-active, .filter-slide-leave-active { transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28); max-height: 800px; }
.filter-slide-enter-from, .filter-slide-leave-to { max-height: 0; opacity: 0; transform: translateY(-15px); }

.dropdown-pop-enter-active, .dropdown-pop-leave-active { transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
.dropdown-pop-enter-from, .dropdown-pop-leave-to { opacity: 0; transform: translateY(-10px) scale(0.95); }

.premium-table :deep(th) { font-size: 10px !important; font-weight: 900 !important; text-transform: uppercase !important; letter-spacing: 0.2em !important; color: #94a3b8 !important; padding: 1.5rem 1rem !important; border: none !important; }
.premium-table :deep(tbody tr:not(.v-data-table__expanded__content)) { transition: all 0.3s; }
.premium-table :deep(tbody tr:hover:not(.v-data-table__expanded__content)) { background-color: rgba(79, 70, 229, 0.02) !important; }

input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; filter: invert(0.5); }
</style>