<script setup>
import { onMounted, computed, ref, watch } from "vue";
import moment from "moment-timezone";
import { storeToRefs } from "pinia";
import Title from "../../../../components/Title.vue";

// --- ECHARTS IMPORTS ---
import { use } from "echarts/core";
import VChart from "vue-echarts";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";

// --- STORE ---
import { SaleStatisticsStore } from "../../../../stores/Dashboard/statistics/saleStatistic.store";
const store_sale_statistics = SaleStatisticsStore();
const { metrics, barSeries, lineSeries, TopDrivers, TopCustomers } = storeToRefs(store_sale_statistics);

// Echarts Register
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

// --- DARK MODE LOGIC (Loyiha global storiga ulash kerak) ---
// Hozircha lokal test uchun:
const isDark = ref(false); 
const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (isDark.value) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
};

// --- CHART OPTIONS (Dinamik) ---
const commonChartOptions = computed(() => ({
  textStyle: { fontFamily: 'Inter, sans-serif' },
  backgroundColor: 'transparent',
  grid: { top: '15%', left: '3%', right: '4%', bottom: '10%', containLabel: true },
}));

// Bar Chart
const chartOptions = computed(() => ({
  ...commonChartOptions.value,
  title: { 
      text: "Oylik sotuvlar (Kategoriya)", 
      left: "left", 
      textStyle: { fontSize: 14, color: isDark.value ? '#94a3b8' : '#64748b' } 
  },
  tooltip: { 
      trigger: 'axis', 
      backgroundColor: isDark.value ? '#1e293b' : 'rgba(255, 255, 255, 0.95)', 
      borderColor: isDark.value ? '#334155' : '#e2e8f0',
      textStyle: { color: isDark.value ? '#e2e8f0' : '#333' } 
  },
  legend: { 
      bottom: 0, 
      icon: 'circle',
      textStyle: { color: isDark.value ? '#94a3b8' : '#64748b' }
  },
  xAxis: {
    type: 'category',
    data: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: isDark.value ? '#64748b' : '#94a3b8' }
  },
  yAxis: { 
      type: 'value', 
      splitLine: { lineStyle: { type: 'dashed', color: isDark.value ? '#334155' : '#e2e8f0' } },
      axisLabel: { color: isDark.value ? '#64748b' : '#94a3b8' }
  },
  series: barSeries.value.map(s => ({ ...s, type: 'bar', barWidth: '15%', itemStyle: { borderRadius: [4, 4, 0, 0] } })),
}));

// Line Chart
const lineChartOptions = computed(() => ({
  ...commonChartOptions.value,
  title: { 
      text: "Oylik sotuvlar (Mahsulot)", 
      left: "left", 
      textStyle: { fontSize: 14, color: isDark.value ? '#94a3b8' : '#64748b' } 
  },
  tooltip: { 
      trigger: "axis",
      backgroundColor: isDark.value ? '#1e293b' : 'rgba(255, 255, 255, 0.95)', 
      borderColor: isDark.value ? '#334155' : '#e2e8f0',
      textStyle: { color: isDark.value ? '#e2e8f0' : '#333' }
  },
  legend: { 
      bottom: 0, 
      icon: 'roundRect',
      textStyle: { color: isDark.value ? '#94a3b8' : '#64748b' }
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: isDark.value ? '#64748b' : '#94a3b8' }
  },
  yAxis: { 
      type: "value", 
      splitLine: { lineStyle: { type: 'dashed', color: isDark.value ? '#334155' : '#e2e8f0' } },
      axisLabel: { color: isDark.value ? '#64748b' : '#94a3b8' }
  },
  series: lineSeries.value.map(s => ({ ...s, type: 'line', smooth: true, symbolSize: 6, lineStyle: { width: 3 } })),
}));

// --- UTILS ---
const formatPrice = (price) => {
  return new Intl.NumberFormat("uz-UZ").format(price || 0);
};

// Hover state
const hoveredRowId = ref(null);
const setHover = (id) => hoveredRowId.value = id;
const clearHover = () => hoveredRowId.value = null;

onMounted(() => {
  try {
    store_sale_statistics.GetSaleStatistics();
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div class="p-2 font-sans text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
    
 <Title>
      <template v-slot:title>
        <h3><i class="fa-solid fa-chart-pie mr-3 fa-lg"></i>Sotuv statistikasi</h3> 
      </template>
    </Title>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 mt-2">
      <div 
        v-for="(metric, index) in metrics" 
        :key="index"
        class="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group hover:shadow-md transition-all duration-300"
      >
        <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 dark:opacity-20 transition-transform group-hover:scale-110"
             :class="metric.change >= 0 ? 'bg-emerald-500' : 'bg-rose-500'"></div>

        <div class="flex justify-between items-start mb-2 relative z-10">
            <div>
                <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ metric.title }}</p>
                <h3 class="text-2xl font-bold text-slate-800 dark:text-white mt-1">{{ metric.value?.toLocaleString() }}</h3>
            </div>
            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
                 :class="metric.change >= 0 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'">
                 <i :class="metric.change >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'"></i>
            </div>
        </div>
        
        <div class="flex items-center gap-2 text-xs font-medium relative z-10">
            <span :class="metric.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'" class="flex items-center gap-1">
                {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
            </span>
            <span class="text-slate-400 dark:text-slate-500">{{ metric.text }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors">
        <v-chart class="h-80 w-full" :option="chartOptions" autoresize />
      </div>
      <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors">
        <v-chart class="h-80 w-full" :option="lineChartOptions" autoresize />
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col transition-colors">
        <div class="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
             <h3 class="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <i class="fa-solid fa-trophy text-amber-400"></i> Top Haydovchilar
             </h3>
             <button class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Barchasi</button>
        </div>
        <div class="flex-1 overflow-x-auto p-2">
            <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-400 font-semibold uppercase">
                    <tr>
                        <th class="px-3 py-2 rounded-l-lg">№</th>
                        <th class="px-3 py-2">Xodim</th>
                        <th class="px-3 py-2">Bo'lim/Rol</th>
                        <th class="px-3 py-2 text-right rounded-r-lg">Sotuv</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-700">
                    <tr v-for="(row, i) in TopDrivers" :key="i" class="group hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors relative">
                        <td class="px-3 py-3 font-mono text-slate-400">{{ i + 1 }}</td>
                        <td class="px-3 py-3 relative">
                            <div class="flex items-center gap-3 cursor-pointer"
                                 @mouseenter="setHover('d-'+i)" @mouseleave="clearHover()">
                                <img :src="row.driver.avatar || 'https://ui-avatars.com/api/?name='+row.driver.fullname+'&background=random'" 
                                     class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-600">
                                <div>
                                    <div class="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{{ row.driver.fullname }}</div>
                                    <div class="text-[10px] text-slate-400 dark:text-slate-500">{{ row.driver.phoneNumber }}</div>
                                </div>
                            </div>
                            
                            <transition name="fade">
                                <div v-if="hoveredRowId === 'd-'+i" 
                                     class="absolute left-10 bottom-full mb-2 z-50 w-48 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-xl border border-slate-100 dark:border-slate-600 pointer-events-none">
                                    <img :src="row.driver.avatar || 'https://ui-avatars.com/api/?name='+row.driver.fullname+'&background=random'" 
                                         class="w-full h-48 object-cover rounded-lg">
                                    <div class="text-center p-1 font-bold text-xs text-slate-600 dark:text-slate-300">{{ row.driver.fullname }}</div>
                                </div>
                            </transition>
                        </td>
                        <td class="px-3 py-3">
                            <div class="text-slate-600 dark:text-slate-300 font-medium">{{ row.driver.position }}</div>
                            <div class="flex gap-1 mt-1">
                                <span v-for="r in row.roles" :key="r.name" 
                                      class="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded text-[9px] font-bold">
                                    {{ r.name }}
                                </span>
                            </div>
                        </td>
                        <td class="px-3 py-3 text-right">
                            <div class="font-bold text-emerald-600 dark:text-emerald-400">{{ formatPrice(row.driver.totalSales) }}</div>
                            <div class="text-[9px] text-slate-400">so'm</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col transition-colors">
        <div class="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
             <h3 class="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <i class="fa-solid fa-users text-blue-400"></i> Top Mijozlar
             </h3>
             <button class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Barchasi</button>
        </div>
        <div class="flex-1 overflow-x-auto p-2">
            <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-400 font-semibold uppercase">
                    <tr>
                        <th class="px-3 py-2 rounded-l-lg">№</th>
                        <th class="px-3 py-2">Mijoz</th>
                        <th class="px-3 py-2">Manzil</th>
                        <th class="px-3 py-2 text-right rounded-r-lg">Xarid</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-700">
                    <tr v-for="(row, i) in TopCustomers" :key="i" class="group hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors relative">
                        <td class="px-3 py-3 font-mono text-slate-400">{{ i + 1 }}</td>
                        <td class="px-3 py-3 relative">
                             <div class="flex items-center gap-3 cursor-pointer"
                                 @mouseenter="setHover('c-'+i)" @mouseleave="clearHover()">
                                <img :src="row.customer.avatar || 'https://ui-avatars.com/api/?name='+row.customer.fullname+'&background=random'" 
                                     class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-600">
                                <div>
                                    <div class="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{{ row.customer.fullname }}</div>
                                    <div class="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                        <span class="w-2 h-2 rounded-full" :class="row.customer.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                                        {{ row.customer.status }}
                                    </div>
                                </div>
                            </div>

                             <transition name="fade">
                                <div v-if="hoveredRowId === 'c-'+i" 
                                     class="absolute left-10 bottom-full mb-2 z-50 w-48 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-xl border border-slate-100 dark:border-slate-600 pointer-events-none">
                                    <img :src="row.customer.avatar || 'https://ui-avatars.com/api/?name='+row.customer.fullname+'&background=random'" 
                                         class="w-full h-48 object-cover rounded-lg">
                                    <div class="text-center p-1 font-bold text-xs text-slate-600 dark:text-slate-300">{{ row.customer.fullname }}</div>
                                </div>
                            </transition>
                        </td>
                        <td class="px-3 py-3">
                            <div class="text-slate-600 dark:text-slate-300 font-medium">{{ row.customer.address?.region }}</div>
                            <div class="text-[10px] text-slate-400 dark:text-slate-500">{{ row.customer.address?.district }}</div>
                        </td>
                        <td class="px-3 py-3 text-right">
                            <div class="font-bold text-blue-600 dark:text-blue-400">{{ formatPrice(row.customer.totalSales) }}</div>
                            <div class="text-[9px] text-slate-400">so'm</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
/* Tooltip animatsiyasi */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>