<script setup>
import { onMounted, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import Title from "../../../../components/Title.vue";

// --- ECHARTS CORE ---
import { use } from "echarts/core";
import VChart from "vue-echarts";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  AxisPointerComponent,
} from "echarts/components";
import * as echarts from "echarts/core";

// --- STORE ---
import { SaleStatisticsStore } from "../../../../stores/Dashboard/statistics/saleStatistic.store";

const store_sale_statistics = SaleStatisticsStore();
const { metrics, charBarOptions, charLineOptions, topDrivers, topCustomers } = storeToRefs(store_sale_statistics);

use([
  CanvasRenderer, BarChart, LineChart, TitleComponent, TooltipComponent, 
  GridComponent, LegendComponent, MarkLineComponent, MarkPointComponent,
  AxisPointerComponent
]);

const isDark = ref(document.documentElement.classList.contains('dark'));

// --- PREMIUM SMART CHART ENGINE ---
const getSmartOptions = (seriesData, chartType) => ({
  backgroundColor: 'transparent',
  animationDuration: 3500,
  animationEasing: 'cubicInOut',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      lineStyle: { color: '#6366f1', width: 2, type: 'dashed', opacity: 0.5 }
    },
    backgroundColor: isDark.value ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    padding: [12, 18],
    shadowBlur: 20,
    shadowColor: 'rgba(0,0,0,0.1)',
    textStyle: { fontFamily: 'Inter', color: isDark.value ? '#f1f5f9' : '#1e293b' },
    formatter: (params) => {
      let res = `<div style="font-weight: 800; margin-bottom: 8px; font-size: 11px; text-transform: uppercase; color: #94a3b8;">${params[0].axisValue} tahlili</div>`;
      params.forEach(p => {
        res += `<div style="display: flex; justify-content: space-between; gap: 30px; margin-top: 5px;">
                  <span style="font-size: 13px; font-weight: 600;"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background-color:${p.color};margin-right:8px;"></span>${p.seriesName}</span>
                  <span style="font-weight: 900; color:${isDark.value ? '#fff' : '#000'}">${p.value.toLocaleString()} so'm</span>
                </div>`;
      });
      return res;
    }
  },
  legend: { 
    top: '2%', 
    right: '2%', 
    icon: 'roundRect', 
    itemWidth: 12,
    textStyle: { color: '#94a3b8', fontWeight: 600, fontSize: 11 } 
  },
  grid: { top: '15%', left: '1%', right: '1%', bottom: '5%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#94a3b8', fontSize: 11, margin: 15 }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: isDark.value ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)', type: 'dashed' } },
    axisLabel: { color: '#94a3b8', fontSize: 11 }
  },
  series: (seriesData.value || []).map(s => ({
    name: s.name,
    type: chartType,
    smooth: 0.45,
    showSymbol: false,
    emphasis: { focus: 'series' },
    data: s.data,
    barWidth: '18%',
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: chartType === 'bar' ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: s.name === 'Gazli' ? '#6366f1' : s.name === 'Gazsiz' ? '#a855f7' : '#ec4899' },
        { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
      ]) : null
    },
    lineStyle: { width: 4, cap: 'round', shadowBlur: 10, shadowColor: 'rgba(99, 102, 241, 0.2)' },
    areaStyle: chartType === 'line' ? {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: s.name === 'Eco Water' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)' },
        { offset: 1, color: 'transparent' }
      ])
    } : null,
    markLine: {
      silent: true,
      symbol: 'none',
      label: { show: false },
      lineStyle: { color: '#94a3b8', opacity: 0.2, type: 'dotted' },
      data: [{ type: 'average', name: 'O\'rtacha' }]
    }
  }))
});

const barOptions = computed(() => getSmartOptions(charBarOptions, 'bar'));
const lineOptions = computed(() => getSmartOptions(charLineOptions, 'line'));

const formatPrice = (p) => new Intl.NumberFormat("uz-UZ").format(p || 0);

onMounted(() => store_sale_statistics.GetSaleStatistics());
</script>

<template>
  <div class="p-6 bg-[#f8fafc] dark:bg-[#030712] min-h-screen font-['Inter'] transition-colors duration-500">
    
    <Title>
      <template v-slot:title>
        <h3><i class="fa-solid fa-chart-pie mr-3 fa-lg"></i>Sotuv statistikasi</h3> 
      </template>
    </Title>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-4">
      <div v-for="(m, idx) in metrics" :key="idx" 
           class="group relative bg-white dark:bg-white/[0.02] backdrop-blur-3xl p-8 rounded-[3rem] border border-slate-100 dark:border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:border-indigo-500/40 transition-all duration-700 animate-entrance overflow-hidden"
           :style="{ animationDelay: (idx * 150) + 'ms' }">
        
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

        <div class="flex justify-between items-center relative z-10 mb-10">
           <div :class="[
             'w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-3xl shadow-2xl transition-all duration-500 group-hover:rotate-[10deg]',
             idx === 0 ? 'bg-indigo-600 text-white shadow-indigo-200' : 
             idx === 1 ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-pink-600 text-white shadow-pink-200'
           ]">
             <i :class="idx === 0 ? 'fa-solid fa-bolt-lightning' : idx === 1 ? 'fa-solid fa-users-viewfinder' : 'fa-solid fa-truck-fast'"></i>
           </div>
           <div :class="m.change >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'" 
                class="px-4 py-2 rounded-xl text-[11px] font-black tracking-tighter border border-transparent dark:border-white/5">
             {{ m.change >= 0 ? '+' : '' }}{{ m.change }}%
           </div>
        </div>

        <div class="relative z-10">
          <p class="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{{ m.title }}</p>
          <h3 class="text-4xl font-[1000] text-slate-900 dark:text-white mt-1 tabular-nums tracking-tighter">{{ formatPrice(m.value) }}</h3>
          
          <div class="mt-8 flex items-center gap-3">
             <div class="flex-1 h-[3px] bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 w-0 group-hover:w-full"></div>
             </div>
             <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{{ m.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
      <div class="bg-white dark:bg-[#0c1120] p-10 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-2xl h-[540px] group transition-all animate-slide-up">
        <div class="flex items-center justify-between mb-10">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
               <span class="w-10 h-[2px] bg-indigo-500 rounded-full"></span> Kategoriya Tahlili
            </h3>
            <div class="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-xs text-indigo-500 group-hover:scale-110 transition-transform"><i class="fa-solid fa-chart-column"></i></div>
        </div>
        <v-chart :option="barOptions" autoresize />
      </div>

      <div class="bg-white dark:bg-[#0c1120] p-10 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-2xl h-[540px] group transition-all animate-slide-up" style="animation-delay: 200ms;">
        <div class="flex items-center justify-between mb-10">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
               <span class="w-10 h-[2px] bg-pink-500 rounded-full"></span> Brendlar Dinamikasi
            </h3>
            <div class="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg">FOCUS: ON</div>
        </div>
        <v-chart :option="lineOptions" autoresize />
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-10">
      
      <div class="bg-white dark:bg-white/[0.02] rounded-[4rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden animate-slide-up" style="animation-delay: 400ms;">
        <div class="px-12 py-10 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.01]">
          <h3 class="text-2xl font-[1000] text-slate-900 dark:text-white tracking-tighter">Elite Drivers</h3>
          <i class="fa-solid fa-award text-3xl text-amber-500 animate-pulse"></i>
        </div>
        <div class="p-10 space-y-6">
          <div v-for="(row, i) in topDrivers" :key="i" class="group flex items-center justify-between p-6 bg-slate-50/30 dark:bg-white/[0.02] rounded-[2.8rem] border border-transparent hover:border-indigo-500/30 hover:bg-white dark:hover:bg-white/[0.05] transition-all duration-500 cursor-pointer">
            <div class="flex items-center gap-6">
              <div class="relative">
                <img :src="`https://ui-avatars.com/api/?name=${row.info?.fullname || 'Driver'}&background=random&bold=true&size=128`" class="w-20 h-20 rounded-[2.2rem] object-cover shadow-2xl group-hover:scale-110 transition-transform duration-700">
                <div class="absolute -top-3 -left-3 w-10 h-10 bg-slate-900 text-white text-[11px] flex items-center justify-center font-black rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl group-hover:bg-indigo-600 transition-colors">#{{ i + 1 }}</div>
              </div>
              <div>
                <h4 class="font-black text-slate-900 dark:text-white text-xl">{{ row.info?.fullname || 'Anonym' }}</h4>
                <div class="flex items-center gap-3 mt-2">
                    <span class="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded-full uppercase">PRO</span>
                    <span class="text-slate-400 text-xs font-bold">{{ row.info?.phoneNumber }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-[1000] text-indigo-600 tabular-nums">{{ formatPrice(row.totalSales) }}</div>
              <p class="text-[10px] font-black text-slate-400 uppercase mt-1 italic">{{ row.count }} orders</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-white/[0.02] rounded-[4rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden animate-slide-up" style="animation-delay: 600ms;">
        <div class="px-12 py-10 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.01]">
          <h3 class="text-2xl font-[1000] text-slate-900 dark:text-white tracking-tighter">Premium VIP</h3>
          <i class="fa-solid fa-gem text-3xl text-indigo-500"></i>
        </div>
        <div class="p-10 space-y-6">
          <div v-for="(row, i) in topCustomers" :key="i" class="group flex items-center justify-between p-6 bg-slate-50/30 dark:bg-white/[0.02] rounded-[2.8rem] border border-transparent hover:border-emerald-500/30 transition-all duration-500 cursor-pointer">
            <div class="flex items-center gap-6">
              <div class="w-20 h-20 rounded-[2.2rem] bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 flex items-center justify-center text-emerald-600 text-3xl font-black transition-all group-hover:rotate-12 group-hover:scale-110 shadow-inner">
                {{ (row.info?.fullname || 'C').charAt(0) }}
              </div>
              <div>
                <h4 class="font-black text-slate-900 dark:text-white text-xl">{{ row.info?.fullname || 'Client' }}</h4>
                <p class="text-slate-400 text-[10px] font-black uppercase mt-1 tracking-widest italic text-emerald-500">Elite Loyalty</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-[1000] text-emerald-600 tabular-nums">{{ formatPrice(row.totalSales) }}</div>
              <div class="mt-4 w-32 h-[3px] bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 w-0 group-hover:w-[95%] transition-all duration-1000 shadow-[0_0_10px_#10b981]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

/* --- PREMIUM KEYFRAME ANIMATIONS --- */
@keyframes entrance {
  0% { opacity: 0; transform: translateY(40px) scale(0.98); filter: blur(15px); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(80px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-entrance { animation: entrance 1s cubic-bezier(0.19, 1, 0.22, 1) forwards; opacity: 0; }
.animate-slide-up { animation: slideUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; opacity: 0; }

/* Dashboard Design Elements */
.tabular-nums { font-variant-numeric: tabular-nums; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 20px; }

/* Ambient background effect */
.p-6::before {
  content: "";
  position: fixed;
  top: -10%; left: 50%; width: 60%; height: 60%;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.04) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
</style>