<script setup>
import {dialogWidth} from "../../../utils/dialogOptions/useDialogWidth";
import { TableHeaderStyle , TableStyle, formatPrice,   opened,
  toggle,
  enter,
  leave} from "../../../utils/TableOptions/useTableOptions";
import { ElMessage } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";

import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
const store_customer = CustomerManagmentStore();
import { storeToRefs } from "pinia";
const { detail_modal, orders } = storeToRefs(store_customer);


const isActive = ref(1);
const Title = ref("Kiritilgan");
const ActiveTabLink = (num) => {
  if (num === 1) {
    Title.value = "Kiritilgan";
    isActive.value = 1;
  }
  if (num === 2) {
    Title.value = "Chiqarlilgan";
    isActive.value = 2;
  }
};
const transferModal = (id) => {
  store_rw.TransferModal(id);
};
onMounted(async () => {
  try {
  } catch (error) {
    console.log(error);
  }
});
// Jami (sum) ni hisoblaydigan funksiya
const getSummaries = ({ columns, data }) => {
  const sums = [];

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "Jami:"; // 1-ustun nomiga yoziladi
      return;
    }

    const prop = column.property;
    if (prop === "totalAmount") {
      const total = data.reduce((acc, row) => {
        const val = Number(row[prop]);
        return isNaN(val) ? acc : acc + val;
      }, 0);

      sums[index] = formatPrice(total) + " sum";
    } else {
      sums[index] = "";
    }
  });

  return sums;
};

const ExportExcel = async () => {
  store_customer.ExcelExportOrdersByCustomer(orders.value);
};

const dateRange = ref([]); // [startDate, endDate]

const filterByDate = () => {
  if (dateRange.value.length === 2) {
    const [start, end] = dateRange.value;
    console.log("Boshlanish:", start);
    console.log("Tugash:", end);
  }
};
const timeFields = (row) => {
  return [
    {
      label: "Registratsiya",
      value: row.createdAt,
      icon: "fa-regular fa-calendar-check",
      iconColor: "text-blue-500",
      bg: "bg-blue-50",
      border: "border border-blue-200",
      textColor: "text-blue-600",
    },
    {
      label: "Yetkazib berish vaqti",
      value: row.deliveryTimedeliveryTime,
      icon: "fa-solid fa-clock",
      iconColor: "text-indigo-500",
      bg: "bg-indigo-50",
      border: "border border-indigo-200",
      textColor: "text-indigo-600",
    },
    {
      label: "Haydovchiga jo'natildi",
      value: row.driverSentToTime,
      icon: "fa-solid fa-car-side",
      iconColor: "text-purple-500",
      bg: "bg-purple-50",
      border: "border border-purple-200",
      textColor: "text-purple-600",
    },
    {
      label: "Haydovchi qabul qildi",
      value: row.driverAcceptedTime,
      icon: "fa-regular fa-hourglass-half",
      iconColor: "text-yellow-500",
      bg: "bg-yellow-50",
      border: "border border-yellow-200",
      textColor: "text-yellow-600",
    },
    {
      label: "Yetkazib berildi",
      value: row.driverArrivedTime,
      icon: "fa-solid fa-check-circle",
      iconColor: "text-indigo-500",
      bg: "bg-indigo-50",
      border: "border border-indigo-200",
      textColor: "text-indigo-600",
    },
   
    {
      label: "Bekor qilingan",
      value: row.canceleddAt,
      icon: "fa-solid fa-ban",
      iconColor: "text-red-500",
      bg: "bg-red-50",
      border: "border border-red-200",
      textColor: "text-red-600",
    },
  ];
};
</script>
<template>
  <div>
    <el-dialog
      v-model="detail_modal"
      :width="dialogWidth"
      :before-close="handleClose"
      class="rounded-md p-4 shadow-lg custom-modal mt-2 bg-white dark:bg-slate-700"
    >
      <template #header>
        <div class="flex items-center justify-between border-b pb-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-box text-lg text-blue-500"></i>
            <h3 class="text-xl font-semibold text-slate-500 dark:text-slate-200">
              {{ orders[0] ? orders[0].customerId.fullname : "Mijoz" }}
            </h3>
          </div>
          <div>
            <router-link
              @click="ActiveTabLink(1)"
              to=""
              :class="{ activeTab: isActive === 1 }"
              class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
            >
              <i class="fa-solid fa-comment-dollar mr-2 fa-lg"></i> Debitor
              <div class="flex flex-shrink-0 ml-2">
                <span
                  :class="{ activeTabIcon: isActive === 1 }"
                  class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-red-500 px-3 py-2 rounded"
                >
                  {{ (all_length ? all_length.all : 0) || 0 }}</span
                >
              </div>
            </router-link>
            <router-link
              @click="ActiveTabLink(2)"
              to=""
              :class="{ activeTab: isActive === 2 }"
              class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
            >
              <i class="fa-solid fa-circle-dollar-to-slot mr-2 fa-lg"></i>
              Kreditor
              <div class="flex flex-shrink-0 ml-2">
                <span
                  :class="{ activeTabIcon: isActive === 2 }"
                  class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
                >
                  {{ (all_length ? all_length.all : 0) || 0 }}</span
                >
              </div>
            </router-link>
          </div>
        </div>
      </template>

      <div class="grid 2xl:grid-cols-12 xs:grid-cols-6 gap-2 mt-1 text-sm">
        

        <!--  mahsulotlar jadvali-->
        <div
          class="col-span-12 bg-white border rounded-lg shadow-sm overflow-hidden"
        >
          <div
            class="bg-gradient-to-r from-green-500 to-indigo-500 text-white px-4 py-1 text-center"
          >
            <i class="fa-solid fa-calendar-days mr-2"></i>Mijoz
            {{ orders[0] ? orders[0].customerId.fullname : "Mijoz" }} ning
            buyurtmalar jadvali
          </div>
          <el-table
            :header-cell-style="TableHeaderStyle"
          stripe
           show-summary
            :summary-method="getSummaries"
            :default-sort="[
              { prop: 'status', order: 'descending' },
              { prop: 'orderNumber', order: 'descending' },
            ]"
          highlight-current-row
          :data="orders"
          size="small"
          :border="true"
          show-header
          header-align="center"
          empty-text="Ma'lumot yo'q..."
          :style="TableStyle"
          class="rounded-t-md border-t-[1px] border-[#36d887]"
          :max-height="600"
          >
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
  fixed="left"
  prop="orderNumber"
  label="Buyurtma nomeri"
  :min-width="160"
  :max-width="300"
  sortable
  header-align="center"
  align="center"
>
  <template #default="{ row }">
    <el-tooltip placement="left" effect="light" popper-class="custom-tooltip">
      <!-- Tooltip ichidagi kontent -->
      <template #content>
        <div
          class="bg-white shadow-lg rounded-md p-3 text-left space-y-4"
          style="width: 480px; max-height: 500px; overflow-y: auto"
        >
          <!-- Agar haydovchi va mahsulotlar bo‘lsa -->
          <div v-if="row">
            <el-table
             :header-cell-style="TableHeaderStyle({background : `#bfdbfe`})"
          stripe
          highlight-current-row
          :data="row.products"
          size="small"
          :border="true"
          show-header
          header-align="center"
          empty-text="Ma'lumot yo'q..."
          :style="TableStyle"
          class="rounded-md border-[1px] border-blue-600"
          :max-height="600"
            >
              <el-table-column
              fixed="left"
                type="index"
                label="№"
                width="50"
                align="center"
              />
              <el-table-column
                prop="pro_type"
                label="Turi"
                :min-width="100"
                align="center"
              >
                <template #default="{ row }">
                  <span class="text-indigo-600 font-medium">
                    {{ row.pro_type }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                prop="pro_name"
                label="Nomi"
                :min-width="120"
                align="center"
              />

              <el-table-column
                prop="pro_quantity"
                label="Miqdori"
                :min-width="100"
                align="center"
              >
                <template #default="{ row }">
                  <span class="text-green-600 font-medium">
                    {{ formatPrice(row.pro_quantity) }} {{ row.pro_unit }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                prop="pro_price"
                label="Narxi (sum)"
                :min-width="120"
                align="center"
              >
                <template #default="{ row }">
                  <span class="text-red-500 font-medium">
                    {{ formatPrice(row.pro_price) }} sum
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                prop="pro_total_price"
                label="Jami (sum)"
                :min-width="140"
                align="center"
              >
                <template #default="{ row }">
                  <div
                    :class="[
                      'inline-flex items-center gap-2 font-medium rounded-md px-2 py-1 text-[12px]',
                      row.pro_total_price > 0
                        ? 'bg-green-50 text-green-700'
                        : row.pro_total_price < 0
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-50 text-gray-500',
                    ]"
                  >
                    <i
                      :class="[
                        'fa-solid fa-sack-dollar',
                        row.pro_total_price > 0
                          ? 'text-green-500'
                          : row.pro_total_price < 0
                          ? 'text-red-500'
                          : 'text-gray-400',
                      ]"
                    ></i>
                    <span class="truncate">
                      {{ row.pro_total_price ? formatPrice(row.pro_total_price) : 0 }} sum
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <!-- Umumiy summasi -->
<div class="flex justify-end mt-4 w-full">
  <div
    class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-semibold px-5 py-2 rounded-lg text-sm shadow-sm hover:bg-blue-100 transition-colors duration-200"
  >
    <i class="fa-solid fa-wallet text-blue-500"></i>
    <span>
      Jami: {{ formatPrice(row.totalAmount) }} sum
    </span>
  </div>
</div>

          </div>

          <!-- Agar topilmasa -->
          <div v-else class="text-center text-gray-500 font-medium">
            Ma'lumot topilmadi
          </div>
        </div>
      </template>

      <!-- Asosiy ko‘rinishi -->
      <router-link
        to=""
        class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md px-3 py-1.5 text-[13px] transition-colors duration-200"
      >
        <i class="fa-solid fa-receipt text-gray-500"></i>
        <span>{{ row.orderNumber }}</span>
      </router-link>
    </el-tooltip>
  </template>
</el-table-column>

              <el-table-column
  label="Mijoz ma'lumotlari"
  :min-width="500"
  :max-width="600"
  align="center"
>
  <template #default="{ row }">
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm text-left">
      <!-- Toggle Button -->
      <button
        class="w-full flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition py-2"
        @click="toggle('comRows', row._id)"
      >
        <i
          :class="[
            'fa-solid transition-transform duration-200',
            opened.comRows?.[row._id] ? 'fa-chevron-down' : 'fa-chevron-right',
          ]"
        ></i>
        {{
          opened.comRows?.[row._id]
            ? "Ma'lumotlarni yopish"
            : "Ma'lumotlarni ko‘rish"
        }}
      </button>

      <!-- Customer Details -->
      <transition name="expand" @enter="enter" @leave="leave">
        <div
          v-show="opened.comRows?.[row._id]"
          class="overflow-hidden border-t border-gray-100"
        >
          <div class="grid grid-cols-2 gap-x-4 gap-y-3 p-2 text-[12px] text-gray-700">
            <!-- F.I.O -->
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full text-[10px]">
                <i class="fa-solid fa-user"></i>
              </span>
              <div>
                <div class="text-[11px] text-gray-500">F.I.O</div>
                <div class="font-medium truncate">
                  {{ row.customerId.fullname || "—" }}
                </div>
              </div>
            </div>

            <!-- Viloyat -->
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 flex items-center justify-center bg-green-100 text-green-500 rounded-full text-[10px]">
                <i class="fa-solid fa-map"></i>
              </span>
              <div>
                <div class="text-[11px] text-gray-500">Viloyat</div>
                <div class="font-medium">
                  {{ row.customerId.address?.region || "—" }}
                </div>
              </div>
            </div>

            <!-- Tuman -->
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 flex items-center justify-center bg-teal-100 text-teal-500 rounded-full text-[10px]">
                <i class="fa-solid fa-location-dot"></i>
              </span>
              <div>
                <div class="text-[11px] text-gray-500">Tuman</div>
                <div class="font-medium">
                  {{ row.customerId.address?.district || "—" }}
                </div>
              </div>
            </div>

            <!-- Mahalla -->
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 flex items-center justify-center bg-orange-100 text-orange-500 rounded-full text-[10px]">
                <i class="fa-solid fa-house"></i>
              </span>
              <div>
                <div class="text-[11px] text-gray-500">Mahalla</div>
                <div class="font-medium">
                  {{ row.customerId.address?.neighborhood || "—" }}
                </div>
              </div>
            </div>

            <!-- Ko‘cha -->
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 flex items-center justify-center bg-purple-100 text-purple-500 rounded-full text-[10px]">
                <i class="fa-solid fa-road"></i>
              </span>
              <div>
                <div class="text-[11px] text-gray-500">Ko‘cha</div>
                <div class="font-medium">
                  {{ row.customerId.address?.street || "—" }}
                </div>
              </div>
            </div>

            <!-- Telefon -->
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 flex items-center justify-center bg-pink-100 text-pink-500 rounded-full text-[10px]">
                <i class="fa-solid fa-phone"></i>
              </span>
              <div>
                <div class="text-[11px] text-gray-500">Telefon</div>
                <div class="font-medium">
                  {{ row.customerId.phoneNumber || "—" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>
</el-table-column>

            <el-table-column
              label="Bonus ball"
              :min-width="100"
              header-align="center"
              align="center"
              ><template #default="scope">{{ 0 }}</template></el-table-column
            >
        <el-table-column
  prop="totalAmount"
  label="Jami (sum)"
  :min-width="160"
  :max-width="280"
  header-align="center"
  align="center"
>
  <template #default="{ row }">
    <div
      :class="[
        'inline-flex items-center gap-2 font-medium rounded-lg px-3 py-1.5 text-[12px] transition-colors duration-200',
        row.totalAmount > 0
          ? 'bg-green-50 text-green-700 hover:bg-green-100'
          : row.totalAmount < 0
          ? 'bg-red-50 text-red-700 hover:bg-red-100'
          : 'bg-gray-50 text-gray-500 hover:bg-gray-100',
      ]"
    >
      <i
        :class="[
          'fa-solid fa-sack-dollar',
          row.totalAmount > 0
            ? 'text-green-500'
            : row.totalAmount < 0
            ? 'text-red-500'
            : 'text-gray-400',
        ]"
      ></i>
      <span class="truncate">
        {{ row.totalAmount ? formatPrice(row.totalAmount) : 0 }} sum
      </span>
    </div>
  </template>
</el-table-column>

          <el-table-column label="🕒 Vaqt maydoni" min-width="240" align="center">
          <template #default="{ row }">
            <div
              class="bg-white border border-gray-200 rounded-lg p-2 shadow-sm text-left"
            >
              <!-- Toggle Button -->
              <button
                class="w-full flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                @click="toggle('timeRows', row._id)"
              >
                <i
                  :class="[
                    'fa-solid transition-transform duration-200',
                    opened.timeRows[row._id]
                      ? 'fa-chevron-down'
                      : 'fa-chevron-right',
                  ]"
                ></i>
                {{
                  opened.timeRows[row._id]
                    ? "Vaqt maydonini yopish"
                    : "Vaqt maydonini ko‘rish"
                }}
              </button>

              <!-- Time Details -->
              <transition name="expand" @enter="enter" @leave="leave">
                <div v-show="opened.timeRows[row._id]" class="overflow-hidden">
                  <ul
                    class="space-y-1 max-h-36 overflow-y-auto pr-1 custom-scroll text-[10px] mt-2"
                  >
                    <li
                      v-for="(item, index) in timeFields(row)"
                      :key="index"
                      :class="[
                        'flex items-center gap-2 p-1 rounded-md hover:opacity-90 transition',
                        item.bg,
                        item.border,
                      ]"
                    >
                      <i :class="[item.icon, item.iconColor]"></i>
                      <div class="flex flex-col items-start leading-tight">
                        <span :class="item.textColor + ' font-bold'">{{
                          item.label
                        }}</span>
                        <span class="truncate" :title="item.value">
                          {{
                            item.value
                              ? moment
                                  .utc(item.value)
                                  .tz("Asia/Tashkent")
                                  .format("DD.MM.YYYY HH:mm:ss")
                              : "—"
                          }}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </transition>
            </div>
          </template>
        </el-table-column>
            <el-table-column
              fixed="right"
              label="Holati"
              :min-width="170"
              :max-width="400"
              header-align="center"
              sortable
              align="center"
            >
              <template #default="{ row }">
                <el-tooltip
                  placement="left"
                  effect="light"
                  popper-class="custom-tooltip"
                >
                  <template #content>
                    <div
                      class="bg-[#e8eded] text-white p-4 rounded text-left space-y-3"
                      style="width: 300px; max-height: 1200px; overflow-y: auto"
                    >
                      <div v-if="row.driverId.fullname">
                        <div class="bg-white p-2 rounded mb-2">
                          <div
                            class="text-center font-semibold text-[16px] text-white p-2 bg-purple-500 rounded mb-1"
                          >
                            {{ row.driverId.fullname }}
                            {{ row.driverId.carNumber }}
                          </div>
                        </div>
                      </div>
                      <div
                        class="text-center font-semibold text-gray-800"
                        v-else
                      >
                        Rol topilmadi
                      </div>
                    </div>
                  </template>

                  <div class="text-purple-500 cursor-pointer hover:underline">
                    <router-link
                      to=""
                      class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
                    >
                      {{ row.status }}
                    </router-link>
                  </div>
                </el-tooltip>
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
                    <el-dropdown-menu
                      slot="dropdown"
                      append-to-body
                      class="z-50"
                    >
                      <el-dropdown-item
                        class="text-[13px] text-green-600"
                        @click="detailOrderModal(row._id)"
                        ><template #default=""
                          ><div>
                            <i class="text-black fa-solid fa-eye fa-sm mr-2"></i
                            >Batafsil
                          </div>
                        </template></el-dropdown-item
                      >

                      <el-dropdown-item
                        class="text-[13px] text-yellow-500"
                        @click="ExportExcel(orders.value)"
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
                        class="text-[13px] text-indigo-600"
                        @click="UpdateById(row._id)"
                        ><template #default="{}"
                          ><div>
                            <i
                              class="text-black fa-solid fa-pen fa-sm mr-1"
                            ></i>
                            O'zgatirish
                          </div>
                        </template></el-dropdown-item
                      >
                      <el-dropdown-item
                        @click="deleteById(row._id)"
                        class="text-red-500 text-[13px]"
                      >
                        <template #default=""
                          ><div>
                            <i
                              class="text-black fa-solid fa-trash fa-sm mr-1"
                            ></i>
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
          <!-- <div
            class="bg-white text-gray-600 text-[12px] font-semibold px-4 py-1 text-center flex items-center justify-between"
          >
            <div>Kiritilgan: 0</div>
            <div>Skladda qoldi: 0</div>
          </div> -->
        </div>
      </div>

      <template #footer>
        <div class="flex flex-col gap-2 mt-2 border-t pt-2">
          <!-- 📅 Sana oralig‘i filteri -->
          <div class="flex items-center gap-4">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="→"
              start-placeholder="Boshlanish sanasi"
              end-placeholder="Tugash sanasi"
              format="YYYY-MM-DD"
              class="w-50"
              @change="filterByDate"
            />

            <el-select placeholder="Export" class="w-32">
              <el-option @click="ExportExcel()" label="Excel" value="excel">
                <i class="fa-solid fa-file-excel mr-2 fa-xm"></i> Excel
              </el-option>
              <el-option label="Pdf" value="pdf">
                <i class="fa-solid fa-file-pdf mr-2 fa-xm"></i> Pdf
              </el-option>
              <el-option label="Word" value="word">
                <i class="fa-solid fa-file-word mr-2 fa-xm"></i> Word
              </el-option>
            </el-select>
          </div>

          <!-- 👇 Tugmalar -->
          <!-- <div class="flex justify-end gap-3">
            <div
              class="mb-1 w-auto text-center text-white text-[13px] font-semibold bg-green-500 rounded-[4px] px-4 py-[5px] hover:bg-green-600"
              @click="printData()"
            >
              <i class="fa-solid fa-print mr-2 fa-md"></i> Chop etish
            </div>
          </div> -->
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.custom-modal {
  background-color: #fefefe;
  transition: all 0.3s ease;
}

.custom-modal .el-dialog__body {
  padding: 20px 24px;
}

.custom-modal .el-dialog__footer {
  padding: 20px 24px;
}

.el-tag {
  font-size: 12px;
}

.el-table th {
  background: #f4f7fa;
  color: #333;
  font-weight: 600;
}

.el-button {
  transition: 0.2s ease-in-out;
}

.el-button:hover {
  transform: translateY(-1px);
}
.activeTab {
  transition-duration: 0.6s;
  background: #36d887;
  color: whitesmoke;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: bold;
}
.activeTabIcon {
  background: whitesmoke;
  color: black;
}
.my-summary-table .el-table__footer-wrapper {
  background-color: #f0f9eb;
  font-weight: 600;
  color: #67c23a; /* yashil rang */
}
</style>
