<template>
 <Title>
      <template v-slot:title>
        <h3><i class="fa-solid fa-chart-line mr-3 fa-md"></i>Sotuv statistikasi</h3> 
      </template>
    </Title>
  <div class="p-2 grid grid-cols-12 gap-2">
      <div class="grid grid-cols-1 col-span-12 md:grid-cols-3 gap-2">
    <el-card
      v-for="metric in metrics"
      :key="metric.title"
      :class="[
        'rounded-2xl shadow text-gray-900',
        metric.change > 0 ? 'bg-green-50' : metric.change < 0 ? 'bg-purple-50' : 'bg-gray-50'
      ]"
    >
      <div class="flex flex-col items-center justify-center text-center h-24 gap-1">
        <div class="text-sm text-gray-500 flex items-center gap-1">
          {{ metric.title }}
          <el-tooltip content="Qo'shimcha ma'lumot" placement="top">
            <i class="el-icon-info text-gray-400" />
          </el-tooltip>
        </div>
        <div class="text-2xl font-bold text-gray-800">{{ metric.value.toLocaleString() }}</div>
        <div
          class="text-xs flex items-center gap-1"
          :class="metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-500'"
        >
          {{ metric.text }}
          <span v-if="metric.change !== 0">
            {{ Math.abs(metric.change) }}%
            <span v-if="metric.change > 0">▲</span>
            <span v-else>▼</span>
          </span>
        </div>
      </div>
    </el-card>
  </div>  
  
    <!-- 1-chi grafik (bar) -->
    <el-card class="2xl:col-span-6 xs:col-span-12 rounded-2xl shadow-md">
      <h2 class="text-lg text-center bg-slate-100 p-2 text-gray-500 rounded-md font-semibold mb-6">Sotuvlar statistikasi yo'nalishlar bo'yicha</h2>
      <v-chart class="h-96" :option="chartOptions" autoresize />
    </el-card>

    <!-- 2-chi grafik (line) -->
    <el-card class="2xl:col-span-6  xs:col-span-12 rounded-2xl shadow-md">
      <h2 class="text-lg text-center bg-slate-100 p-2 text-gray-500 rounded-md font-semibold mb-6">Sotuvlar statistikasi mahsulot turlari bo'yicha</h2>
      <v-chart class="h-96" :option="lineChartOptions" autoresize />
    </el-card>
    <!-- 3-chi grafik (xodimlar ) -->
     <el-card class="col-span-12 mt-4 rounded-2xl shadow-md">
    <h2 class="text-lg text-center bg-slate-100 p-2 text-gray-500 rounded-md font-semibold mb-6">Aktiv xodimlar ro'yxati</h2>
    <el-table :data="activeEmployees" class="w-full" style="border-radius: 12px">
      <!-- Profil rasmi va ismi -->
      <el-table-column label="Xodim" width="250">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <el-avatar :src="row.avatar" size="medium" />
            <span class="font-medium">{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- Lavozimi -->
      <el-table-column prop="position" label="Lavozimi" />

   

      <!-- Telefon raqami -->
      <el-table-column label="Telefon">
        <template #default="{ row }">
          <span class="text-sm text-gray-700">{{ row.phone }}</span>
        </template>
      </el-table-column>

   

      <!-- Ishga kirish sanasi -->
      <el-table-column label="Ishga kirish sanasi">
        <template #default="{ row }">
          <span class="text-sm text-gray-700">{{ row.hireDate }}</span>
        </template>
      </el-table-column>

      <!-- Tug'ilgan sana -->
      <el-table-column label="Tug'ilgan sana">
        <template #default="{ row }">
          <span class="text-sm text-gray-700">{{ row.birthDate }}</span>
        </template>
      </el-table-column>

      <!-- Manzil -->
      <el-table-column label="Manzil">
        <template #default="{ row }">
          <span class="text-sm text-gray-700">{{ row.address }}</span>
        </template>
      </el-table-column>

      <!-- Ijtimoiy tarmoq havolalari -->
      <el-table-column label="Ijtimoiy tarmoq">
        <template #default="{ row }">
          <a :href="row.socialProfile" target="_blank" class="text-blue-500 text-sm">Profilni ko'rish</a>
        </template>
      </el-table-column>
         <!-- Holati -->
      <el-table-column label="Holati">
        <template #default="{ row }">
          <span
            class="px-2 py-1 rounded-full text-white text-xs"
            :class="row.status === 'Aktiv' ? 'bg-green-500' : 'bg-gray-400'"
          >
            {{ row.status }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
 
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Title from "../../../../components/Title.vue";

import { ElCard, ElTable, ElTableColumn, ElAvatar } from 'element-plus'
import 'element-plus/dist/index.css'

import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,
  LineChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
])

const chartOptions = ref({
  title: {
    text: 'Oylik sotuvlar (Ustunli)',
    left: 'center'
  },
  tooltip: {},
  legend: {
    data: ['Gazli', 'Gazsiz', 'Sharbatli'],
    top: 'bottom'
  },
  xAxis: {
    data: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul']
  },
  yAxis: {},
  series: [
    {
      name: 'Gazli',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110, 95] // 7 ta qiymat
    },
    {
      name: 'Gazsiz',
      type: 'bar',
      data: [60, 100, 90, 130, 180, 140, 160] // 7 ta qiymat
    },
    {
      name: 'Sharbatli',
      type: 'bar',
      data: [30, 50, 45, 65, 90, 75, 85] // 7 ta qiymat
    }
  ]
})

const lineChartOptions = ref({
  title: {
    text: 'Oylik sotuvlar (Chiziqli)',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Coca Cola', 'Fanta', 'Chortoq'],
    top: 'bottom'
  },
  xAxis: {
    type: 'category',
    data: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', ]
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Coca Cola',
      type: 'line',
      data: [120, 200, 150, 80, 70, 110, 95, 130, 160, 140, 180, 175]
    },
    {
      name: 'Fanta',
      type: 'line',
      data: [60, 100, 90, 130, 180, 140, 160, 155, 175, 190, 200, 210]
    },
    {
      name: 'Chortoq',
      type: 'line',
      data: [30, 50, 45, 65, 90, 75, 85, 95, 100, 105, 110, 120]
    }
  ]
})


// Statik aktiv xodimlar ro'yxati (rasmlar bilan)
 const activeEmployees = ref([
      {
        id: 1,
        name: 'Ali Karimov',
        position: 'Boshqaruvchi',
        status: 'Aktiv',
        avatar: 'https://i.pravatar.cc/100?img=1',
        phone: '+998 90 123 45 67',
        email: 'ali.karimov@example.com',
        hireDate: '2021-05-15',
        birthDate: '1985-02-20',
        address: 'Toshkent, Chilonzor',
        socialProfile: 'https://www.linkedin.com/in/alikarimov/',
      },
      {
        id: 2,
        name: 'Dilorom Ismoilova',
        position: 'Moliyaviy boshqaruvchi',
        status: 'Aktiv',
        avatar: 'https://i.pravatar.cc/100?img=2',
        phone: '+998 90 234 56 78',
        email: 'dilorom.ismailova@example.com',
        hireDate: '2020-08-25',
        birthDate: '1990-11-10',
        address: 'Toshkent, Yunusobod',
        socialProfile: 'https://www.linkedin.com/in/diloromismailova/',
      },
      {
        id: 3,
        name: 'Sanjarbek Tursunov',
        position: 'Texnik mutaxassis',
        status: 'Noaktiv',
        avatar: 'https://i.pravatar.cc/100?img=3',
        phone: '+998 90 345 67 89',
        email: 'sanjarbek.tursunov@example.com',
        hireDate: '2019-12-05',
        birthDate: '1988-03-15',
        address: 'Toshkent, Mirobod',
        socialProfile: 'https://www.linkedin.com/in/sanjarbehtursunov/',
      },
    ]);
// Statik metrik ma'lumotlar
const metrics = [
  {
    title: 'Kunlik suv iste’moli (m³)',
    value: 18250,
    change: 12,
    text: 'kechagiga nisbatan'
  },
  {
    title: 'Oylik to‘langan hisob-kitoblar',
    value: 514200,
    change: -7,
    text: 'oylik taqqoslash'
  },
  {
    title: 'Yangi ulanuvchilar soni',
    value: 350,
    change: 5,
    text: 'kechagiga nisbatan'
  }
]
</script>


<style scoped>
</style>
