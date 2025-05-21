<script setup>
import moment from "moment-timezone";
import { onMounted, ref, computed } from "vue";
import Title from "../../../../components/Title.vue";
import { SaleStatisticsStore } from "../../../../stores/Dashboard/statistics/saleStatistic.store";
const store_sale_statistics = SaleStatisticsStore();
import { storeToRefs } from "pinia";
const { metrics, barSeries, lineSeries, TopDrivers, TopCustomers } =
  storeToRefs(store_sale_statistics);
import { ElCard, ElTable, ElTableColumn, ElAvatar } from "element-plus";
import "element-plus/dist/index.css";

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

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

const chartOptions = computed(() => ({
  title: {
    text: "Oylik sotuvlar (Ustunli)",
    left: "center",
  },
  tooltip: {},
  legend: {
    data: ["Gazli", "Gazsiz", "Sharbatlar"],
    top: "bottom",
  },
  xAxis: {
    data: [
      "Yanvar",
      "Fevral",
      "Mart",
      "Aprel",
      "May",
      "Iyun",
      "Iyul",
      "Avgust",
      "Sentabr",
      "Oktabr",
      "Noyabr",
      "Dekabr",
    ],
  },
  yAxis: {},
  series: barSeries.value,
}));

const lineChartOptions = computed(() => ({
  title: {
    text: "Oylik sotuvlar (Chiziqli)",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["Kola", "Fanta", "Chortoq", "Eco Water"],
    top: "bottom",
  },
  xAxis: {
    type: "category",
    data: [
      "Yanvar",
      "Fevral",
      "Mart",
      "Aprel",
      "May",
      "Iyun",
      "Iyul",
      "Avgust",
      "Sentabr",
      "Oktabr",
      "Noyabr",
      "Dekabr",
    ],
  },
  yAxis: {
    type: "value",
  },
  series: lineSeries.value,
}));

const formatPrice = (price) => {
  return new Intl.NumberFormat("uz-UZ").format(price);
};

onMounted(() => {
  try {
    store_sale_statistics.GetSaleStatistics();
  } catch (error) {
    console.log(error);
  }
});
</script>
<template>
  <Title>
    <template v-slot:title>
      <h3>
        <i class="fa-solid fa-chart-line mr-3 fa-md"></i>Sotuv statistikasi
      </h3>
    </template>
  </Title>
  <div class="p-2 grid grid-cols-12 gap-2">
    <div class="grid grid-cols-1 col-span-12 md:grid-cols-3 gap-2">
      <el-card
        v-for="metric in metrics"
        :key="metric.title"
        :class="[
          'rounded-2xl shadow text-gray-900',
          metric.change > 0
            ? 'bg-green-50'
            : metric.change < 0
            ? 'bg-purple-50'
            : 'bg-gray-50',
        ]"
      >
        <div
          class="flex flex-col items-center justify-center text-center h-24 gap-1"
        >
          <div class="text-sm text-gray-500 flex items-center gap-1">
            {{ metric.title }}
            <el-tooltip content="Qo'shimcha ma'lumot" placement="top">
              <i class="el-icon-info text-gray-400" />
            </el-tooltip>
          </div>
          <div class="text-2xl font-bold text-gray-800">
            {{ metric.value.toLocaleString() }}
          </div>
          <div
            class="text-xs flex items-center gap-1"
            :class="
              metric.change > 0
                ? 'text-green-600'
                : metric.change < 0
                ? 'text-red-600'
                : 'text-gray-500'
            "
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
    <el-card class="2xl:col-span-12 xs:col-span-12 rounded-2xl shadow-md">
      <h2
        class="text-lg text-center bg-slate-100 p-2 text-gray-500 rounded-md font-semibold mb-6"
      >
        Sotuvlar statistikasi yo'nalishlar bo'yicha
      </h2>
      <v-chart class="h-96 w-full" :option="chartOptions" autoresize />
    </el-card>

    <!-- 2-chi grafik (line) -->
    <el-card class="2xl:col-span-12 xs:col-span-12 rounded-2xl shadow-md">
      <h2
        class="text-lg text-center bg-slate-100 p-2 text-gray-500 rounded-md font-semibold mb-6"
      >
        Sotuvlar statistikasi mahsulot turlari bo'yicha
      </h2>
      <v-chart class="h-96" :option="lineChartOptions" autoresize />
    </el-card>
    <!-- 3-chi grafik (haydovchilar ) -->
    <el-card
      class="col-span-12 mt-4 rounded-2xl shadow-md overflow-visible relative z-30"
    >
      <h2
        class="text-lg text-center bg-slate-100 p-2 text-gray-500 rounded-md font-semibold mb-6"
      >
        Aktiv haydovchilar ro'yxati
      </h2>
      <el-table
        :data="TopDrivers"
        class="overflow-visible relative z-30"
        style="border-radius: 12px; width: 100%"
      >
        <el-table-column label="Xodim" width="250">
          <template #default="{ row }">
            <el-tooltip
              placement="right"
              effect="light"
              popper-class="custom-tooltip"
            >
              <template #content>
                <img
                  :src="
                    row.driver.avatar ||
                    'https://easy-feedback.com/wp-content/uploads/2022/10/Employee-Journey-What-it-is-and-how-to-improve-it-768x512.jpg'
                  "
                  class="w-48 h-48 rounded-lg shadow-xl border object-cover"
                  alt="Driver avatar"
                />
              </template>
              <div class="flex items-center gap-3 cursor-pointer">
                <el-avatar
                  :src="
                    row.driver.avatar ||
                    'https://easy-feedback.com/wp-content/uploads/2022/10/Employee-Journey-What-it-is-and-how-to-improve-it-768x512.jpg'
                  "
                  size="medium"
                />
                <span class="font-medium">{{ row.driver.fullname }}</span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          type="index"
          prop="index"
          fixed="left"
          label="№"
          width="60"
        />

        <el-table-column
          align="center"
          header-align="center"
          prop="driver.department"
          label="Bo'lim"
          :min-width="100"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="driver.position"
          label="Lavozim"
          :min-width="200"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="driver.role"
          label="Rol"
          :min-width="100"
          :max-width="400"
        >
          <template #default="{ row }">
            <el-tooltip placement="left" effect="blue">
              <template #content>
                <div
                  class="bg-[#e8eded] text-white p-4 rounded text-left space-y-3"
                  style="width: 300px; max-height: 1200px; overflow-y: auto"
                >
                  <div v-if="row.roles && row.roles.length">
                    <div
                      class="bg-white p-2 rounded mb-2"
                      v-for="(role, index) in row.roles"
                      :key="index"
                    >
                      <div
                        class="text-center font-semibold text-[16px] text-white p-2 bg-purple-500 rounded mb-1"
                      >
                        {{ role.name }}
                      </div>
                      <ul class="ml-4 list-disc mb-3 text-purple-600">
                        <div
                          class=""
                          v-for="(permission, pIndex) in role.permissions"
                          :key="pIndex"
                        >
                          {{ permission }}
                        </div>
                      </ul>
                    </div>
                  </div>
                  <div class="text-center font-semibold text-gray-800" v-else>
                    Rol topilmadi
                  </div>
                </div>
              </template>

              <div class="text-purple-500 cursor-pointer hover:underline">
                Ko'rish
              </div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          header-align="center"
          prop="driver.address.region"
          label="Viloyat"
          :min-width="100"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="driver.address.district"
          label="Tuman"
          :min-width="100"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="driver.address.neighborhood"
          label="Mahalla"
          :min-width="100"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="driver.address.street"
          label="Ko'cha"
          :min-width="100"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="driver.phoneNumber"
          label="Telefon"
          :min-width="100"
          :max-width="400"
          ><template #default="{ row }"
            ><div class="font-semibold text-blue-600">
              <i class="fas fa-phone text-gray-500 fa-sm mr-2"></i>
              {{ row.phoneNumber }}
            </div></template
          ></el-table-column
        >

        <el-table-column
          label="Bonus ball"
          :min-width="100"
          header-align="center"
          align="center"
          ><template #default="scope">{{ 0 }}</template></el-table-column
        >
        <el-table-column
          label="Ishga qabul qilingan sana"
          :min-width="150"
          :max-width="400"
          header-align="center"
          align="center"
          ><template #default="scope">
            {{
              scope.row.driver.registeredAt
                ? moment
                    .utc(scope.row.registeredAt) // 🟢 UTC formatda olish
                    .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                    .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                : "-"
            }}
          </template></el-table-column
        >
        <el-table-column
          fixed="right"
          label="Sotuv miqdori (so'mda)"
          :min-width="300"
          :max-width="400"
          header-align="center"
          align="center"
        >
          <template #default="{ row }"
            ><div
              class="bg-green-300 p-2 rounded-md text-gray-800 font-semibold text-[12px]"
            >
              {{
                row.driver.totalSales ? formatPrice(row.driver.totalSales) : 0
              }}
              so'm
            </div></template
          ></el-table-column
        >
        <el-table-column
          fixed="right"
          label="Holati"
          :min-width="100"
          :max-width="400"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <router-link
              to=""
              class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
            >
              {{ scope.row.driver.status }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          prop="id"
          label=""
          width="60"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <!-- Dropdown -->
            <el-dropdown
              trigger="click"
              class="relative"
              :popper-options="{
                modifiers: [
                  {
                    name: 'preventOverflow',
                    options: { boundary: 'window' },
                  },
                ],
              }"
            >
              <el-button type="text" class="text-sm; text-gray-500">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu slot="dropdown" append-to-body class="z-50">
                  <el-dropdown-item
                    class="text-[13px] text-green-600"
                    @click="GetOne(row._id)"
                    ><template #default=""
                      ><div>
                        <i
                          class="text-black fa-solid fa-magnifying-glass fa-sm mr-2"
                        ></i
                        >Batafsil
                      </div>
                    </template></el-dropdown-item
                  >

                  <el-dropdown-item
                    class="text-[13px] text-indigo-600"
                    @click="UpdateById(row._id)"
                    ><template #default="{}"
                      ><div>
                        <i
                          class="text-black fa-solid fa-pen-to-square fa-pen-to-square fa-sm mr-1"
                        ></i>
                        O'zgatirish
                      </div>
                    </template></el-dropdown-item
                  >
                  <el-dropdown-item
                    class="text-[13px] text-yellow-500"
                    @click="ExportExcel(row._id)"
                    ><template #default="{}"
                      ><div>
                        <i
                          class="text-black fa-solid fa-file-excel fa-sm mr-1"
                        ></i>
                        Excel
                      </div>
                    </template></el-dropdown-item
                  >
                  <el-dropdown-item
                    class="text-[13px]"
                    @click="updateById(row._id)"
                  >
                    <template #default>
                      <div>
                        <i
                          class="text-black fa-solid fa-box-archive fa-sm mr-1"
                        ></i>
                        Arxivlash
                      </div>
                    </template>
                  </el-dropdown-item>

                  <el-dropdown-item
                    @click="deleteById(row._id)"
                    class="text-red-500 text-[13px]"
                  >
                    <template #default=""
                      ><div>
                        <i class="text-black fa-solid fa-trash fa-sm mr-1"></i>
                        O'chirish
                      </div>
                    </template>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- //// -->
    <!-- 4-chi grafik (Mijozlar ) -->
    <el-card
      class="col-span-12 mt-4 rounded-2xl shadow-md overflow-visible relative z-30"
    >
      <h2
        class="text-lg text-center bg-slate-100 p-2 text-gray-500 rounded-md font-semibold mb-6"
      >
        Aktiv mijozlar ro'yxati
      </h2>
      <el-table
        :data="TopCustomers"
        class="overflow-visible relative z-30"
        style="border-radius: 12px; width: 100%"
      >
        <el-table-column label="Mijoz" width="250">
          <template #default="{ row }">
            <el-tooltip
              placement="right"
              effect="light"
              popper-class="custom-tooltip"
            >
              <template #content>
                <img
                  :src="
                    row.customer.avatar ||
                    'https://easy-feedback.com/wp-content/uploads/2022/10/Employee-Journey-What-it-is-and-how-to-improve-it-768x512.jpg'
                  "
                  class="w-48 h-48 rounded-lg shadow-xl border object-cover"
                  alt="Driver avatar"
                />
              </template>
              <div class="flex items-center gap-3 cursor-pointer">
                <el-avatar
                  :src="
                    row.customer.avatar ||
                    'https://easy-feedback.com/wp-content/uploads/2022/10/Employee-Journey-What-it-is-and-how-to-improve-it-768x512.jpg'
                  "
                  size="medium"
                />
                <span class="font-medium">{{ row.customer.fullname }}</span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          type="index"
          prop="index"
          fixed="left"
          label="№"
          width="60"
        />

        <el-table-column
          align="center"
          header-align="center"
          prop="customer.position"
          label="Darajasi"
          :min-width="100"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="customer.address.region"
          label="Viloyat"
          :min-width="100"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="customer.address.district"
          label="Tuman"
          :min-width="100"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="customer.address.neighborhood"
          label="Mahalla"
          :min-width="100"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="customer.address.street"
          label="Ko'cha"
          :min-width="100"
          :max-width="400"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="customer.phoneNumber"
          label="Telefon"
          :min-width="100"
          :max-width="400"
          ><template #default="{ row }"
            ><div class="font-semibold text-blue-600">
              <i class="fas fa-phone text-gray-500 fa-sm mr-2"></i>
              {{ row.phoneNumber }}
            </div></template
          ></el-table-column
        >

        <el-table-column
          label="Bonus ball"
          :min-width="100"
          :max-width="400"
          header-align="center"
          align="center"
          ><template #default="scope">{{ 0 }}</template></el-table-column
        >
        <el-table-column
          label="Jami buyurtmalari"
          :min-width="150"
          :max-width="400"
          header-align="center"
          align="center"
          ><template #default="scope">{{ 0 }}</template></el-table-column
        >
        <el-table-column
          label="Mijoz bo'lgan sana"
          :min-width="200"
          :max-width="400"
          header-align="center"
          align="center"
          ><template #default="scope">
            {{
              scope.row.customer.registeredAt
                ? moment
                    .utc(scope.row.registeredAt) // 🟢 UTC formatda olish
                    .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                    .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                : "-"
            }}
          </template></el-table-column
        >
        <el-table-column
          fixed="right"
          label="Sotuv miqdori (so'mda)"
          :min-width="300"
          :max-width="400"
          header-align="center"
          align="center"
        >
          <template #default="{ row }"
            ><div
              class="bg-green-300 p-2 rounded-md text-gray-800 font-semibold text-[12px]"
            >
              {{
                row.customer.totalSales
                  ? formatPrice(row.customer.totalSales)
                  : 0
              }}
              so'm
            </div></template
          ></el-table-column
        >
        <el-table-column
          fixed="right"
          label="Holati"
          :min-width="100"
          :max-width="400"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <router-link
              to=""
              class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
            >
              {{ scope.row.customer.status }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          prop="id"
          label=""
          width="60"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <!-- Dropdown -->
            <el-dropdown
              trigger="click"
              class="relative"
              :popper-options="{
                modifiers: [
                  {
                    name: 'preventOverflow',
                    options: { boundary: 'window' },
                  },
                ],
              }"
            >
              <el-button type="text" class="text-sm; text-gray-500">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu slot="dropdown" append-to-body class="z-50">
                  <el-dropdown-item
                    class="text-[13px] text-green-600"
                    @click="GetOne(row._id)"
                    ><template #default=""
                      ><div>
                        <i
                          class="text-black fa-solid fa-magnifying-glass fa-sm mr-2"
                        ></i
                        >Batafsil
                      </div>
                    </template></el-dropdown-item
                  >

                  <el-dropdown-item
                    class="text-[13px] text-indigo-600"
                    @click="UpdateById(row._id)"
                    ><template #default="{}"
                      ><div>
                        <i
                          class="text-black fa-solid fa-pen-to-square fa-pen-to-square fa-sm mr-1"
                        ></i>
                        O'zgatirish
                      </div>
                    </template></el-dropdown-item
                  >
                  <el-dropdown-item
                    class="text-[13px] text-yellow-500"
                    @click="ExportExcel(row._id)"
                    ><template #default="{}"
                      ><div>
                        <i
                          class="text-black fa-solid fa-file-excel fa-sm mr-1"
                        ></i>
                        Excel
                      </div>
                    </template></el-dropdown-item
                  >
                  <el-dropdown-item
                    class="text-[13px]"
                    @click="updateById(row._id)"
                  >
                    <template #default>
                      <div>
                        <i
                          class="text-black fa-solid fa-box-archive fa-sm mr-1"
                        ></i>
                        Arxivlash
                      </div>
                    </template>
                  </el-dropdown-item>

                  <el-dropdown-item
                    @click="deleteById(row._id)"
                    class="text-red-500 text-[13px]"
                  >
                    <template #default=""
                      ><div>
                        <i class="text-black fa-solid fa-trash fa-sm mr-1"></i>
                        O'chirish
                      </div>
                    </template>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- //// -->
  </div>
</template>

<style scoped>
.custom-tooltip {
  padding: 0; /* tooltip ichidagi bo‘sh joylarni olib tashlash */
  background: transparent; /* fonni shaffof qilish */
  box-shadow: none; /* soyani olib tashlash */
}
</style>
