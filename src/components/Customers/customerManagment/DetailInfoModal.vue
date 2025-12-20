<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import moment from "moment-timezone";
import { SaleposManagmentStore } from "../../../stores/Sale/salepos/salepos.store";

// UI COMPONENTS
import BaseModal from "../../../UI/Modal.vue";
import DataTable from "../../../UI/DataTable.vue";
import Button from "../../../UI/Button.vue";
import ExportDropdown from "../../../UI/ExportDropdown.vue";

const store_sale = SaleposManagmentStore();
const { detail_modal, customerSalesById } = storeToRefs(store_sale);

const expandedRows = ref([]);

// --- ANALITIK HISOB-KITOBYAR ---
const stats = computed(() => {
  const data = customerSalesById.value || [];
  const total = data.reduce((a, b) => a + Number(b.totalAmount), 0);
  const count = data.length;
  return {
    total,
    count,
    average: count > 0 ? Math.round(total / count) : 0,
    lastPurchase: data.length > 0 ? data[0].date : null
  };
});

const columns = [
  { key: 'orderNumber', label: 'Buyurtma va Tafsilot', width: '220px' },
  { key: 'driverId.fullname', label: 'Haydovchi', width: '200px' },
  { key: 'author.fullname', label: 'Sotuvchi', width: '200px' },
  { key: 'date', label: 'Sana/Vaqt', width: '140px', align: 'center' },
  { key: 'paymentType', label: 'To\'lov', width: '120px', align: 'center' },
  { key: 'totalAmount', label: 'Jami Summa', width: '160px', align: 'right' },
  { key: 'status', label: 'Holat', width: '150px', align: 'center' },
  { key: 'actions', label: '', width: '50px', align: 'center' }
];

const formatPrice = (p) => new Intl.NumberFormat("uz-UZ").format(p || 0);

const getStatusBadge = (s) => {
  const styles = {
    'Yetkazib berildi': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Bekor qilindi': 'bg-rose-50 text-rose-600 border-rose-100',
    'Yangi': 'bg-blue-50 text-blue-600 border-blue-100'
  };
  return styles[s] || 'bg-slate-50 text-slate-500 border-slate-200';
};

const toggleExpand = (id) => {
  expandedRows.value = expandedRows.value.includes(id) 
    ? expandedRows.value.filter(i => i !== id) 
    : [...expandedRows.value, id];
};
const customerName = computed(() => {
  // customerSalesById'ning birinchi elementidan mijoz nomini olamiz
  const name = customerSalesById.value?.[0]?.customerId?.fullname;
  return name ? name.toUpperCase() : "MIJOZ";
});
</script>

<template>
  <BaseModal
    v-model="detail_modal"
    title="Analitikasi & Xaridlar tarixi"
    icon="fa-solid fa-chart-line"
    width="max-w-6xl"
  >
  <template #header>
    <div class="flex items-center gap-4 py-2">
      <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
        <i class="fa-solid fa-user-tie text-xl"></i>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
           <span class="text-[10px] font-black uppercase text-indigo-500 tracking-[0.3em] leading-none">Mijoz Analitikasi</span>
           <div class="w-1 h-1 rounded-full bg-slate-300"></div>
           <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarix: {{ customerSalesById.length }} ta buyurtma</span>
        </div>
        <h2 class="text-2xl font-black text-slate-800 dark:text-white tracking-tighter mt-1">
          {{ customerName }} <span class="text-indigo-600">.</span>
        </h2>
      </div>
    </div>
  </template>
  
    <div class="space-y-6 p-1">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-[1.25rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600"><i class="fa-solid fa- wallet"></i></div>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Umumiy Savdo</span>
          </div>
          <h3 class="text-xl font-mono font-black text-slate-800 dark:text-white">{{ formatPrice(stats.total) }} <small class="text-[10px] font-bold">UZS</small></h3>
        </div>

        <div class="p-4 rounded-[1.25rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600"><i class="fa-solid fa-cart-shopping"></i></div>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buyurtmalar</span>
          </div>
          <h3 class="text-xl font-black text-slate-800 dark:text-white">{{ stats.count }} <small class="text-[10px] font-bold text-slate-400 uppercase">Tranzaksiya</small></h3>
        </div>

        <div class="p-4 rounded-[1.25rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600"><i class="fa-solid fa-scale-balanced"></i></div>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">O'rtacha xarid</span>
          </div>
          <h3 class="text-xl font-mono font-black text-slate-800 dark:text-white">{{ formatPrice(stats.average) }}</h3>
        </div>

        <div class="p-4 rounded-[1.25rem] bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white"><i class="fa-solid fa-calendar-check"></i></div>
            <span class="text-[10px] font-black uppercase tracking-widest opacity-80">Oxirgi xarid</span>
          </div>
          <h3 class="text-sm font-bold truncate">{{ stats.lastPurchase ? moment(stats.lastPurchase).format('DD-MMMM, YYYY') : '—' }}</h3>
          <p class="text-[10px] opacity-60 font-medium">Asia/Tashkent vaqti bilan</p>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="flex justify-between gap-2 bg-transparent p-4 w-full">
          <div></div>
         <ExportDropdown class=" " variant="danger" size="md" leftIcon="fas fa-xmark"  @click="close"/>
        </div>
        <DataTable :items="customerSalesById" :columns="columns" class="!text-[13px]">
          
          <template #orderNumber="{ row }">
            <div class="flex flex-col py-1">
              <span class="font-mono font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{{ row.orderNumber }}</span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 rounded uppercase">ID: {{ row._id.slice(-6) }}</span>
              </div>
            </div>
          </template>

          <template #date="{ row }">
            <div class="flex flex-col items-center">
              <span class="font-black text-slate-700 dark:text-slate-300 text-[11px]">{{ moment(row.date).format('DD.MM.YYYY') }}</span>
              <span class="text-[10px] text-slate-400 font-mono">{{ moment(row.date).format('HH:mm') }}</span>
            </div>
          </template>
 <template #driverId.fullname="{ row }">
  <div class="flex items-center gap-2.5 py-1">
    <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-500 shrink-0 shadow-sm transition-transform group-hover:scale-105">
      <i class="fa-solid fa-steering-wheel text-[12px]"></i>
    </div>

    <div class="flex flex-col min-w-0">
      <div class="flex items-center gap-1.5">
        <span class="text-[13px] font-black text-slate-700 dark:text-slate-200 truncate leading-tight tracking-tight uppercase">
          {{ row.driverId?.fullname || 'Tayinlanmagan' }}
        </span>
      </div>
      
      <div class="flex items-center gap-1.5 mt-0.5 group/phone cursor-pointer hover:text-indigo-600 transition-colors">
        <i class="fa-solid fa-phone text-[9px] text-slate-400 group-hover/phone:text-indigo-500"></i>
        <span class="text-[10.5px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-tighter italic">
          {{ row.driverId?.phoneNumber || 'Aloqa yo\'q' }}
        </span>
      </div>
    </div>
  </div>
</template>
<template #author.fullname="{ row }">
  <div class="flex items-center gap-2.5 py-1">
    <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-500 shrink-0 shadow-sm transition-transform group-hover:scale-105">
      <i class="fa-solid fa-steering-wheel text-[12px]"></i>
    </div>

    <div class="flex flex-col min-w-0">
      <div class="flex items-center gap-1.5">
        <span class="text-[13px] font-black text-slate-700 dark:text-slate-200 truncate leading-tight tracking-tight uppercase">
          {{ row.author?.fullname || 'Tayinlanmagan' }}
        </span>
      </div>
      
      <div class="flex items-center gap-1.5 mt-0.5 group/phone cursor-pointer hover:text-indigo-600 transition-colors">
        <i class="fa-solid fa-phone text-[9px] text-slate-400 group-hover/phone:text-indigo-500"></i>
        <span class="text-[10.5px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-tighter italic">
          {{ row.driverId?.phoneNumber || 'Aloqa yo\'q' }}
        </span>
      </div>
    </div>
  </div>
</template>
          <template #paymentType="{ row }">
             <span class="text-[10px] font-black uppercase text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md">
                <i class="fa-solid fa-money-bill-transfer mr-1 opacity-50"></i> {{ row.paymentType || 'CASH' }}
             </span>
          </template>

          <template #totalAmount="{ row }">
            <div class="flex flex-col items-end">
                <span class="font-black text-slate-900 dark:text-white font-mono text-[14px] tracking-tight">{{ formatPrice(row.totalAmount) }}</span>
                <span class="text-[9px] font-bold text-indigo-500 uppercase tracking-widest leading-none">Summa</span>
            </div>
          </template>

          <template #status="{ row }">
              <span class="px-4 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest flex items-center gap-2 justify-center" :class="getStatusBadge(row.status)">
                <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {{ row.status || 'Bajarildi' }}
              </span>
          </template>

          <template #actions="{ row }">
             <button @click="toggleExpand(row._id)" class="w-8 h-8 flex items-center justify-center rounded-xl transition-all" :class="expandedRows.includes(row._id) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:text-indigo-600'">
                <i class="fa-solid" :class="expandedRows.includes(row._id) ? 'fa-minus' : 'fa-plus'"></i>
             </button>
          </template>

          <template #expand="{ row }">
            <div v-if="expandedRows.includes(row._id)" class="p-6 bg-slate-50/80 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
               <div class="flex items-center gap-3 mb-4">
                  <div class="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Savat tarkibi</span>
                  <div class="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
               </div>
               <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div v-for="item in row.items" :key="item._id" class="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-indigo-500 transition-all">
                     <div class="flex justify-between items-start mb-3">
                        <div class="flex flex-col">
                           <span class="text-[13px] font-black text-slate-800 dark:text-slate-100">{{ item.name }}</span>
                           <span class="text-[10px] text-slate-400 font-mono">Lot: {{ item.partyNumber || 'N/A' }}</span>
                        </div>
                        <span class="text-[10px] font-black bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-500 border border-slate-200 dark:border-slate-700 uppercase">{{ item.unit || 'ta' }}</span>
                     </div>
                     <div class="flex justify-between items-end border-t border-slate-50 dark:border-slate-700 pt-3 mt-1">
                        <div class="flex flex-col">
                           <span class="text-[9px] font-bold text-slate-400 uppercase">Narxi</span>
                           <span class="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{{ formatPrice(item.salePrice) }}</span>
                        </div>
                        <div class="flex flex-col items-center">
                           <span class="text-[9px] font-bold text-slate-400 uppercase">Soni</span>
                           <span class="text-xs font-black text-indigo-600">{{ item.quantity }}</span>
                        </div>
                        <div class="flex flex-col items-end">
                           <span class="text-[9px] font-bold text-slate-400 uppercase">Jami</span>
                           <span class="text-sm font-mono font-black text-slate-900 dark:text-white">{{ formatPrice(item.quantity * item.salePrice) }}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <template #footer="{ close }">
      <div class="flex justify-between items-center w-full bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl">
         <div class="flex items-center gap-3 pl-4">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ma'lumotlar real vaqt rejimida yangilandi</span>
         </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
button { transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); }

/* Custom Scrollbar for better UI */
:deep(.custom-scrollbar)::-webkit-scrollbar {
  width: 6px;
}
:deep(.custom-scrollbar)::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>