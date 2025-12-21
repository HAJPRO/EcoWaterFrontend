<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import moment from 'moment-timezone';

// --- UI COMPONENTS ---
import Modal from "../../../UI/Modal.vue"; 
import DataTable from "../../../UI/DataTable.vue"; 

// --- STORE ---
import { ReadyWarehouseStore } from "../../../stores/Warehouses/r-warehouse/warehouse.store";
const store_rw = ReadyWarehouseStore();
const { detail_modal, product } = storeToRefs(store_rw);

// --- TABLE COLUMNS ---
const columns = computed(() => [
  { key: 'productInfo', label: 'Mahsulot Tafsiloti', width: '300px' },
  { key: 'dates', label: 'Sana va Muddatlar', width: '250px' },
  { key: 'stockInfo', label: 'Ombordagi qoldiq', width: '150px', align: 'center' },
  { key: 'financials', label: 'Narxlar (UZS)', width: '200px', align: 'right' },
  { key: 'amount', label: 'Jami Qiymat', width: '200px', align: 'right' },
  { key: 'actions', label: 'Amallar', width: '80px', fixed: 'right', align: 'center' },
]);

// --- FORMATTING METHODS ---
const formatPrice = (p) => new Intl.NumberFormat("uz-UZ").format(p || 0);

// Kirim qilingan sana va vaqt uchun professional format
const formatEntryDate = (d) => d ? moment(d).tz("Asia/Tashkent").format("DD.MM.YYYY") : "---";
const formatEntryTime = (d) => d ? moment(d).tz("Asia/Tashkent").format("HH:mm") : "--:--";

const formatDateOnly = (d) => d ? moment(d).tz("Asia/Tashkent").format("DD.MM.YYYY") : "-";

const closeDetail = () => {
  store_rw.$patch({ detail_modal: false });
};

const isExpired = (date) => moment().isAfter(date);
const isNearExpiry = (date) => moment().add(2, 'months').isAfter(date) && !isExpired(date);
</script>

<template>
  <Modal 
    v-model="detail_modal" 
    :title="`Partiya Tafsiloti: ${product?.partyNumber}`"
    width="95vw"
    custom-class="modern-modal"
    @close="closeDetail"
  >
    <div class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="stat-card group hover:border-blue-500/50">
          <div class="icon-box bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-hashtag text-xl"></i>
          </div>
          <div class="flex flex-col">
            <span class="stat-label">Partiya raqami</span>
            <span class="stat-value font-mono">{{ product?.partyNumber || '---' }}</span>
          </div>
        </div>

        <div class="stat-card group hover:border-emerald-500/50">
          <div class="icon-box bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-wallet text-xl"></i>
          </div>
          <div class="flex flex-col">
            <span class="stat-label">Jami kirim qiymati</span>
            <span class="stat-value text-emerald-600">
              {{ formatPrice(product?.totalAmount) }} <small class="text-[10px] font-bold">UZS</small>
            </span>
          </div>
        </div>

        <div class="stat-card group hover:border-indigo-500/50">
          <div class="icon-box bg-indigo-500/10 text-indigo-600 group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-clock-rotate-left text-xl"></i>
          </div>
          <div class="flex flex-col">
            <span class="stat-label">Kirim qilingan vaqt</span>
            <div class="flex items-center gap-2">
              <span class="stat-value text-indigo-600">{{ formatEntryDate(product?.createdAt) }}</span>
              <span class="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-lg text-sm font-bold font-mono">
                {{ formatEntryTime(product?.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="table-container shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <div class="table-header">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-4">
              <div class="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full"></div>
              <h4 class="header-title">Ombordagi mavjud mahsulotlar</h4>
            </div>
            <div class="text-[10px] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-bold text-slate-500">
              Jami: {{ product?.items?.length || 0 }} turdagi mahsulot
            </div>
          </div>
        </div>

        <DataTable :items="product?.items || []" :columns="columns" height="55vh">
          
          <template #productInfo="{ row }">
            <div class="flex items-center gap-4 py-3">
              <div class="product-icon group">
                <i class="fa-solid fa-box group-hover:scale-110 transition-transform"></i>
              </div>
              <div class="flex flex-col">
                <span class="product-name">{{ row.product?.name || 'Mahsulot nomi' }}</span>
                <span class="product-uid uppercase tracking-widest font-bold">UID: {{ row._id?.slice(-8) }}</span>
              </div>
            </div>
          </template>

          <template #dates="{ row }">
            <div class="flex flex-col gap-2">
              <div class="date-row">
                <i class="fa-solid fa-calendar-plus text-slate-400"></i>
                <span class="text-slate-500">Kirim:</span>
                <span class="font-bold text-slate-700 dark:text-slate-300">{{ formatDateOnly(row.createdAt) }}</span>
              </div>
              <div :class="['date-row p-1 rounded-md px-2 border', isExpired(row.expireDate) ? 'bg-rose-50 border-rose-100 text-rose-600' : isNearExpiry(row.expireDate) ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400']">
                <i class="fa-solid fa-hourglass-half"></i>
                <span class="font-bold">Muddati: {{ formatDateOnly(row.expireDate) }}</span>
              </div>
            </div>
          </template>

          <template #stockInfo="{ row }">
            <div class="flex flex-col items-center">
              <span class="text-lg font-black text-slate-800 dark:text-white leading-none">{{ row.qty }}</span>
              <span class="text-[9px] font-bold uppercase text-slate-400 mt-1 tracking-widest">{{ row.unit || 'dona' }}</span>
            </div>
          </template>

          <template #financials="{ row }">
            <div class="price-stack">
              <div class="flex items-center justify-end gap-2">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Sotuv:</span>
                <span class="font-black text-slate-800 dark:text-slate-200">{{ formatPrice(row.salePrice) }}</span>
              </div>
              <div class="flex items-center justify-end gap-2">
                <span class="text-[10px] text-emerald-500 font-bold uppercase">Tan:</span>
                <span class="font-bold text-emerald-600 italic">{{ formatPrice(row.costPrice) }}</span>
              </div>
            </div>
          </template>

          <template #amount="{ row }">
            <div class="flex flex-col items-end">
              <span class="text-sm font-black text-slate-800 dark:text-white">{{ formatPrice(row.salePrice * row.qty) }}</span>
              <span class="text-[9px] font-bold text-slate-400 uppercase italic">Tan: {{ formatPrice(row.costPrice * row.qty) }}</span>
            </div>
          </template>

          <template #actions="{ row }">
            <el-dropdown trigger="click">
              <button class="action-btn"><i class="fa-solid fa-ellipsis-h"></i></button>
              <template #dropdown>
                <el-dropdown-menu class="modern-dropdown">
                  <el-dropdown-item @click="store_rw.UpdateProduct(row._id)">
                    <i class="fa-solid fa-pen-to-square text-blue-500 mr-2"></i> Tahrirlash
                  </el-dropdown-item>
                  <el-dropdown-item divided class="text-rose-500" @click="store_rw.DeleteById({ id: row._id, action: 2 })">
                    <i class="fa-solid fa-trash-can mr-2"></i> O'chirish
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>

        </DataTable>
      </div>

      <div class="footer-bar">
        <div class="flex items-center gap-4">
          <div class="legend-item"><span class="dot bg-emerald-500 shadow-emerald-500/50 shadow-lg"></span>Sifatli</div>
          <div class="legend-item"><span class="dot bg-amber-500 shadow-amber-500/50 shadow-lg"></span>Yaroqlilik muddati yaqin</div>
          <div class="legend-item"><span class="dot bg-rose-500 shadow-rose-500/50 shadow-lg animate-pulse"></span>Muddati o'tgan</div>
        </div>
        <div class="update-tag">
          <i class="fa-solid fa-sync-alt animate-spin-slow"></i>
          Ma'lumotlar yangilandi: {{ formatEntryDate(new Date()) }}
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
/* CARD & UI ELEMENTS */
.stat-card {
  @apply bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] flex items-center gap-5 transition-all duration-300;
}
.icon-box {
  @apply w-14 h-14 rounded-2xl flex items-center justify-center shrink-0;
}
.stat-label {
  @apply text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1;
}
.stat-value {
  @apply text-xl font-black text-slate-800 dark:text-white tracking-tight;
}

/* TABLE STYLES */
.table-container {
  @apply rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden;
}
.table-header {
  @apply px-8 py-5 border-b border-slate-50 dark:border-slate-800 bg-slate-50/20 backdrop-blur-sm;
}
.header-title {
  @apply text-xs font-black uppercase tracking-[0.2em] text-slate-500;
}

.product-icon {
  @apply w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm border border-slate-200 dark:border-slate-700;
}
.product-name {
  @apply font-black text-slate-700 dark:text-slate-100 text-sm;
}
.product-uid {
  @apply text-[8px] font-mono text-indigo-400 mt-0.5;
}

.date-row {
  @apply flex items-center gap-2 text-[11px] font-medium;
}

.price-stack {
  @apply flex flex-col gap-0.5;
}

.action-btn {
  @apply w-9 h-9 flex items-center justify-center rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-400 hover:text-indigo-600 transition-all;
}

.footer-bar {
  @apply flex flex-col md:flex-row justify-between items-center px-8 py-5 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800;
}
.legend-item {
  @apply flex items-center gap-2 text-[10px] font-black uppercase text-slate-500;
}
.legend-item .dot {
  @apply w-2.5 h-2.5 rounded-full;
}
.update-tag {
  @apply flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
</style>