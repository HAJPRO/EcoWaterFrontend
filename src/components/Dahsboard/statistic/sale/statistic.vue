<script setup>
import { onMounted, computed, ref, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { use } from "echarts/core";
import VChart from "vue-echarts";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent, TooltipComponent, GridComponent, LegendComponent,
  MarkLineComponent, MarkPointComponent, AxisPointerComponent,
  DataZoomComponent, ToolboxComponent
} from "echarts/components";
import * as echarts from "echarts/core";
import { SaleStatisticsStore } from "../../../../stores/Dashboard/statistics/saleStatistic.store";

const store_sale_statistics = SaleStatisticsStore();
const { metrics, charLineOptions, topDrivers, topSellers, topCustomers, loading } = storeToRefs(store_sale_statistics);

use([
  CanvasRenderer, BarChart, LineChart, TitleComponent, TooltipComponent, 
  GridComponent, LegendComponent, MarkLineComponent, MarkPointComponent,
  AxisPointerComponent, DataZoomComponent, ToolboxComponent
]);

const isDark = ref(document.documentElement.classList.contains('dark'));
const activeFilter = ref('day'); 
const chartType = ref('line'); 
const showDatePicker = ref(false);
const dateRange = ref({ start: '', end: '' });

// --- 🔵 FILTRLAR UCHUN STANDART SHABLONLAR ---
const getFullPeriodTemplate = (filterType) => {
  if (filterType === 'day') return Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  if (filterType === 'week') return ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];
  if (filterType === 'month') return ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
  return [];
};

const getOptions = computed(() => {
  // Backenddan kelgan tayyor ma'lumotlar
  // Agar ma'lumot kelmagan bo'lsa, xatolik bermasligi uchun bo'sh massivlar
  const finalLabels = charLineOptions.value?.labels || [];
  const finalSeries = charLineOptions.value?.series || [];

  return {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'axis', 
      axisPointer: { type: 'cross' }, 
      backgroundColor: isDark.value ? '#0f172a' : '#ffffff', 
      borderRadius: 12, 
      textStyle: { color: isDark.value ? '#f1f5f9' : '#1e293b' } 
    },
    legend: { show: true, top: '0%', textStyle: { color: '#94a3b8', fontWeight: '800' } },
    grid: { top: '15%', left: '2%', right: '2%', bottom: '5%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: finalLabels, 
      axisLine: { show: false }, 
      axisLabel: { 
        color: '#94a3b8', 
        fontSize: 10, 
        // Kunlik filtrda soatlarni chiroyli ko'rsatish (har 2 tadan birini)
        interval: activeFilter.value === 'day' ? 2 : 0 
      } 
    },
    yAxis: { 
      type: 'value', 
      splitLine: { 
        lineStyle: { color: isDark.value ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)', type: 'dashed' } 
      }, 
      axisLabel: { 
        color: '#94a3b8', 
        formatter: (v) => v >= 1000 ? (v/1000) + 'k' : v 
      } 
    },
    series: finalSeries.map((s, idx) => ({
      name: s.name, 
      type: chartType.value, 
      data: s.data, 
      smooth: 0.45, 
      symbolSize: 6,
      itemStyle: { 
        color: idx === 0 ? '#6366f1' : '#10b981', 
        borderRadius: [4, 4, 0, 0] 
      },
      areaStyle: chartType.value === 'line' ? { 
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: idx === 0 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.1)' }, 
          { offset: 1, color: 'transparent' }
        ]) 
      } : null
    }))
  };
});

const handlePeriodChange = async (type) => {
  activeFilter.value = type;
  showDatePicker.value = false;
  await store_sale_statistics.GetSaleStatistics({ period: type });
  nextTick(() => window.dispatchEvent(new Event('resize')));
};

const applyCustomRange = async () => {
  if (dateRange.value.start && dateRange.value.end) {
    activeFilter.value = 'custom';
    showDatePicker.value = false;
    await store_sale_statistics.GetSaleStatistics({ period: 'custom', start: dateRange.value.start, end: dateRange.value.end });
  }
};

const formatPrice = (p) => new Intl.NumberFormat("uz-UZ").format(p || 0);

const chartHeader = computed(() => {
  const map = {
    day: { title: "Bugungi Soatbay Analiz", subtitle: "24 soatlik savdo dinamikasi" },
    week: { title: "Haftalik Sotuvlar", subtitle: "Hafta kunlari bo'yicha tahlil" },
    month: { title: "Yillik Monitoring", subtitle: "Oylar bo'yicha daromad oqimi" },
    custom: { title: "Maxsus Davr Tahlili", subtitle: `${dateRange.value.start} - ${dateRange.value.end}` }
  };
  return map[activeFilter.value] || { title: "Statistika", subtitle: "" };
});

onMounted(() => store_sale_statistics.GetSaleStatistics({ period: 'day' }));
</script>

<template>
  <div class="p-6 md:p-10 bg-[#f8fafc] dark:bg-[#020617] min-h-screen font-['Inter'] transition-all duration-700">
    
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12 relative z-[100]">
      <div>
        <h1 class="text-3xl font-[1000] text-slate-900 dark:text-white tracking-tighter italic uppercase group">
Sotuvlar tahlili <span class="text-indigo-600 group-hover:animate-pulse">.</span>
        </h1>
        <p class="text-slate-500 font-bold uppercase text-[10px] mt-3 tracking-[0.4em]">Statistika va Analitika Paneli</p>
      </div>

      <div class="flex flex-wrap items-center gap-4 bg-white/60 dark:bg-white/[0.02] p-2 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl backdrop-blur-3xl">
        <div class="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl">
          <button v-for="f in [{id:'day', n:'Bugun'}, {id:'week', n:'Hafta'}, {id:'month', n:'Oy'}]" 
            :key="f.id" @click="handlePeriodChange(f.id)"
            :class="['px-7 py-2.5 rounded-xl text-xs font-black transition-all duration-500', 
            activeFilter === f.id ? 'bg-white dark:bg-indigo-600 shadow-xl text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-indigo-400']">
            {{ f.n }}
          </button>
        </div>
        <button @click="showDatePicker = !showDatePicker" :class="['px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all', activeFilter === 'custom' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 bg-slate-200/50 dark:bg-slate-800/50']"><i class="fa-solid fa-calendar-alt"></i> Oraliq</button>
        
        <div class="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl">
          <button @click="chartType = 'line'" :class="['w-11 h-11 flex items-center justify-center rounded-xl transition-all', chartType === 'line' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-lg' : 'text-slate-400']"><i class="fa-solid fa-chart-line"></i></button>
          <button @click="chartType = 'bar'" :class="['w-11 h-11 flex items-center justify-center rounded-xl transition-all', chartType === 'bar' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-lg' : 'text-slate-400']"><i class="fa-solid fa-chart-bar"></i></button>
        </div>
      </div>
      
      <transition name="fade-slide">
        <div v-if="showDatePicker" class="absolute top-full right-0 mt-5 p-8 bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-white/10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] z-[110] w-[340px]">
          <div class="space-y-4">
            <div class="group relative"><label class="scoped-label">Boshlanish</label><input type="date" v-model="dateRange.start" class="scoped-date-field"></div>
            <div class="group relative"><label class="scoped-label">Tugash</label><input type="date" v-model="dateRange.end" class="scoped-date-field"></div>
            <button @click="applyCustomRange" class="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase hover:bg-indigo-700 shadow-xl transition-all">Analiz qilish</button>
          </div>
        </div>
      </transition>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
      <div v-for="(m, idx) in metrics" :key="idx" class="metric-card-pro group overflow-hidden">
        <div class="flex justify-between items-start mb-8 relative z-10">
          <div :class="['w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-3xl shadow-2xl transition-all group-hover:rotate-12', 
            idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-emerald-500' : 'bg-rose-600']" class="text-white">
            <i :class="`fa-solid ${m.icon}`"></i>
          </div>
          <div :class="m.change >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'" class="px-4 py-2 rounded-xl text-[11px] font-black italic shadow-inner">
            {{ m.change >= 0 ? '↑' : '↓' }} {{ Math.abs(m.change) }}%
          </div>
        </div>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{{ m.title }}</p>
        <h3 class="text-4xl font-[1000] text-slate-900 dark:text-white tracking-tighter tabular-nums">{{ formatPrice(m.value) }}</h3>
      </div>
      <div v-if="!metrics.length && loading" v-for="i in 3" class="metric-card-pro animate-pulse bg-slate-200 dark:bg-slate-800 h-[180px]"></div>
    </div>

    <div class="chart-pro-container group mb-12 relative z-10">
      <div v-if="loading" class="chart-loader-overlay z-[50]"><div class="loader-spinner"></div></div>
      <div class="flex justify-between items-center mb-10 px-4">
        <div>
          <h2 class="text-2xl font-black dark:text-white tracking-tighter uppercase italic transition-all duration-500">{{ chartHeader.title }}</h2>
          <p class="text-[10px] text-slate-400 font-bold uppercase mt-1 italic transition-all duration-500">{{ chartHeader.subtitle }}</p>
        </div>
      </div>
      <div class="h-[520px] w-full">
        <v-chart :option="getOptions" :update-options="{ notMerge: true }" autoresize />
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div class="insight-container-modern group">
        <div class="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.01]">
          <div><h3 class="font-black dark:text-white uppercase tracking-widest text-sm italic text-amber-500">Top Drivers</h3><p class="text-[9px] text-slate-400 font-bold uppercase mt-1">Reyting</p></div>
          <i class="fa-solid fa-crown text-amber-500 text-2xl group-hover:scale-125 transition-transform"></i>
        </div>
        <div class="p-4 h-[400px] overflow-y-auto custom-scrollbar">
          <div class="space-y-3 pr-2">
            <div v-for="(row, i) in topDrivers" :key="i" class="list-row group/item">
              <div class="flex items-center gap-4">
                <span class="text-xl font-[1000] text-slate-200 group-hover/item:text-amber-500 italic w-8">#{{ i + 1 }}</span>
                <img :src="`https://ui-avatars.com/api/?name=${row.info?.fullname}&background=random&bold=true`" class="w-12 h-12 rounded-2xl shadow-lg transition-all group-hover/item:scale-110">
                <div><p class="font-black text-slate-800 dark:text-white text-sm leading-tight truncate w-[100px]">{{ row.info?.fullname }}</p><p class="text-[9px] text-slate-400 font-bold mt-1">{{ row.count }} orders</p></div>
              </div>
              <div class="font-[1000] text-amber-600 text-sm tabular-nums">{{ formatPrice(row.totalSales) }}</div>
            </div>
            <div v-if="!topDrivers.length && !loading" class="text-center py-10 text-slate-400 text-xs italic">Ma'lumot topilmadi</div>
          </div>
        </div>
      </div>

      <div class="insight-container-modern group">
        <div class="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.01]">
          <div><h3 class="font-black dark:text-white uppercase tracking-widest text-sm italic text-indigo-500">Top Sellers</h3><p class="text-[9px] text-slate-400 font-bold uppercase mt-1">Savdo hajmi</p></div>
          <i class="fa-solid fa-bolt-lightning text-indigo-500 text-xl group-hover:scale-125 transition-transform"></i>
        </div>
        <div class="p-4 h-[400px] overflow-y-auto custom-scrollbar">
          <div class="space-y-3 pr-2">
            <div v-for="(row, i) in topSellers" :key="i" class="list-row group/item">
              <div class="flex items-center gap-4">
                <span class="text-xl font-[1000] text-slate-200 group-hover/item:text-indigo-500 italic w-8">#{{ i + 1 }}</span>
                <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-[1000] text-lg shadow-inner">{{ (row.info?.fullname || 'S').charAt(0) }}</div>
                <div><p class="font-black text-slate-800 dark:text-white text-sm leading-tight truncate w-[100px]">{{ row.info?.fullname }}</p><p class="text-[9px] text-emerald-500 font-[1000] uppercase mt-1 tracking-tighter">Sotuvchi</p></div>
              </div>
              <div class="font-[1000] text-indigo-600 text-sm tabular-nums">{{ formatPrice(row.totalSales) }}</div>
            </div>
            <div v-if="!topSellers.length && !loading" class="text-center py-10 text-slate-400 text-xs italic">Ma'lumot topilmadi</div>
          </div>
        </div>
      </div>

      <div class="insight-container-modern group">
        <div class="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.01]">
          <div><h3 class="font-black dark:text-white uppercase tracking-widest text-sm italic text-rose-500">Top Clients</h3><p class="text-[9px] text-slate-400 font-bold uppercase mt-1">Sodiq mijozlar</p></div>
          <i class="fa-solid fa-gem text-rose-500 text-xl animate-pulse"></i>
        </div>
        <div class="p-4 h-[400px] overflow-y-auto custom-scrollbar">
          <div class="space-y-3 pr-2">
            <div v-for="(row, i) in topCustomers" :key="i" class="list-row group/item">
              <div class="flex items-center gap-4">
                <span class="text-xl font-[1000] text-slate-200 group-hover/item:text-rose-500 italic w-8">#{{ i + 1 }}</span>
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white font-[1000] text-lg shadow-lg">{{ (row.info?.fullname || 'C').charAt(0) }}</div>
                <div><p class="font-black text-slate-800 dark:text-white text-sm leading-tight truncate w-[100px]">{{ row.info?.fullname }}</p><p class="text-[9px] text-rose-400 font-[1000] uppercase mt-1 tracking-tighter">Loyal</p></div>
              </div>
              <div class="font-[1000] text-slate-900 dark:text-white text-sm tabular-nums">{{ formatPrice(row.totalSales) }}</div>
            </div>
            <div v-if="!topCustomers.length && !loading" class="text-center py-10 text-slate-400 text-xs italic">Ma'lumot topilmadi</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

/* --- CUSTOM SCROLLBAR --- */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #6366f133; border-radius: 20px; transition: all 0.3s; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #6366f188; }

/* --- UI COMPONENTS --- */
.scoped-date-field { @apply w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-5 text-xs font-black dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all cursor-pointer; }
.scoped-label { @apply absolute left-4 -top-2 px-2 bg-white dark:bg-[#0f172a] text-[9px] font-black text-indigo-500 uppercase z-10; }
.metric-card-pro { @apply bg-white dark:bg-white/[0.02] p-10 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl transition-all duration-500 hover:-translate-y-2 relative; }
.chart-pro-container { @apply bg-white dark:bg-[#0b0f1a] p-12 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden transition-all duration-700; }
.insight-container-modern { @apply bg-white dark:bg-white/[0.02] rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden transition-all duration-500; }
.list-row { @apply flex items-center justify-between p-5 bg-slate-50/50 dark:bg-white/[0.02] rounded-[2.5rem] border border-transparent hover:border-indigo-500/10 hover:bg-white dark:hover:bg-white/[0.05] transition-all duration-500; }
.chart-loader-overlay { @apply absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-md rounded-[4rem]; }
.loader-spinner { @apply w-14 h-14 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin; }
.tabular-nums { font-variant-numeric: tabular-nums; }
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>