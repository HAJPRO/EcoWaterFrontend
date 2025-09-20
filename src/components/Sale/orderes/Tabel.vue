<script setup>
import { TableHeaderStyle , TableStyle, formatPrice,   opened,
  toggle,
  enter,
  leave} from "../../../utils/TableOptions/useTableOptions";
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const permissions = ref(JSON.parse(Cookies.get("account")).permissions);
const actions = ref(JSON.parse(Cookies.get("account")).actions);

import { ref, onMounted } from "vue";
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
import { OrderManagmentStore } from "../../../stores/Sale/orders/orders.store";

import OrderModal from "../../../components/Sale/orderes/AddOrderModal.vue";
import DetailOrderModal from "../../../components/Sale/orderes/DetailOrderModal.vue";

import moment from "moment-timezone";

const store = CustomerManagmentStore();
const store_order = OrderManagmentStore();

import { storeToRefs } from "pinia";

const { orders, all_length, customers, model, isActive } =
  storeToRefs(store_order);
const {} = storeToRefs(store);
const comRows = ref({});
const AddCustomModal = () => {
  store_order.AddOrderModal();
  store.GetAll({ status: 0 });
};
const detailOrderModal = (id) => {
  store_order.DetailOrderModal({ id });
};
const handleCurrentChange = (page) => {
  store_order.GetAll({ status: isActive.value, page: page, limit: 10 });
};
const deleteById = (id) => {
  store_order.DeleteById({ id });
};
const UpdateById = (id) => {
  store_order.GetById({ id });
};

const filter = ref({
  fullname: null,
  sort: "",
});
const FilterByFullname = () => {
  store_order.GetAll({ filter: filter.value });
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
  <OrderModal />
  <DetailOrderModal />
  <div class="">
    <div class="">
      <div class="rounded-md text-[11px]">
        <el-table
         :header-cell-style="TableHeaderStyle"
          stripe
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
  prop="orderNumber"
  label="Buyurtma nomeri"
  :min-width="180"
  :max-width="320"
  header-align="center"
  align="center"
>
  <template #default="{ row }">
    <router-link
      to=""
      class="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg px-3 py-1.5 text-[12px] transition-colors duration-200"
    >
      <i class="fa-solid fa-box text-blue-500"></i>
      <span class="truncate">{{ row.orderNumber }}</span>
    </router-link>
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
  label="Jami (sum)"
  :min-width="200"
  :max-width="320"
  header-align="center"
  align="center"
>
  <template #default="{ row }">
    <router-link
      to=""
      class="inline-flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg px-3 py-1.5 text-[12px] transition-colors duration-200"
    >
      <i class="fa-solid fa-sack-dollar text-green-500"></i>
      <span class="truncate">
        {{ row.totalAmount ? formatPrice(row.totalAmount) : 0 }} sum
      </span>
    </router-link>
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
            :min-width="180"
            :max-width="400"
            header-align="center"
            align="center"
          >
            <template #default="{ row }">
              <router-link
                to=""
                :class="[
                  'cursor-pointer inline-flex items-center gap-1 hover:bg-opacity-90 font-medium rounded-md text-[12px] w-full p-[5px] sm:w-auto text-center',
                  row.status === 'Yangi buyurtma'
                    ? 'bg-blue-200 text-blue-900'
                    : row.status === 'Yetkazib berilmoqda'
                    ? 'bg-yellow-200 text-yellow-900'
                    : row.status === 'Yetkazib berildi'
                    ? 'bg-green-200 text-green-900'
                    : row.status === 'Bekor qilindi'
                    ? 'bg-red-200 text-red-900'
                    : 'bg-gray-200 text-gray-800',
                ]"
              >
                <i
                  :class="
                    row.status === 'Yangi buyurtma'
                      ? 'fa-solid fa-bell text-blue-700'
                      : row.status === 'Yetkazib berilmoqda'
                      ? 'fa-solid fa-truck-fast text-yellow-700'
                      : row.status === 'Yetkazib berildi'
                      ? 'fa-solid fa-circle-check text-green-700'
                      : row.status === 'Bekor qilindi'
                      ? 'fa-solid fa-xmark text-red-700'
                      : 'fa-solid fa-question-circle text-gray-700'
                  "
                ></i>
                {{ row.status }}
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
                      @click="detailOrderModal(row._id)"
                      ><template #default=""
                        ><div>
                          <i class="text-black fa-solid fa-eye fa-sm mr-2"></i
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
        <div
         class="flex justify-between flex-wrap font-semibold text-[11px] shadow border-b-[1px] border-[#36d887] rounded-b-md"
        >
          <div
             class="sticky flex justify-between flex-wrap bg-white dark:bg-slate-600 pr-2 pl-2 w-full mx-auto rounded-b-md"
          >
            <div class="flex gap-2 flex-wrap">
              <div
                class="my-2 text-[11px] items-center font-medium text-center text-white"
              >
                <el-tooltip
                  content="Buyurtmani mijoz F.I.O,telefon nomeri va buyurtma nomeri bilan izlash!"
                  placement="bottom"
                  effect="dark"
                >
                  <el-input
                    @input="FilterByFullname"
                    v-model="filter.fullname"
                    clearable
                    size="smal"
                    type="String"
                    placeholder="Izlash..."
                    style="width: 150px; font-size: 12px"
                  />
                </el-tooltip>
              </div>

             

              <el-select placeholder="Excel" class="w-32 my-2">
                <el-option @click="ExportExcel()" label="Excel" value="excel">
                  <i class="fa-solid fa-file-excel mr-2 fa-xm"></i
                  >Excel</el-option
                >
                <el-option label="Pdf" value="pdf">
                  <i class="fa-solid fa-file-pdf mr-2 fa-xm"></i>Pdf</el-option
                >
                <el-option label="Word" value="word">
                  <i class="fa-solid fa-file-word mr-2 fa-xm"></i
                  >Word</el-option
                >
              </el-select>
              <div class="mt-2.5">
                <el-button
                  @click="AddCustomModal()"
                  size="small"
                  style="
                    background-color: #36d887;
                    color: white;
                    border: none;
                    padding: 15px;
                  "
                >
                  <i class="mr-2 fa-solid fa-plus fa-sm"></i>Buyurtma
                  qo'shish</el-button
                >
              </div>
            </div>

            <div class="block pt-3">
              <!-- Pagination -->
              <el-pagination
                small
                @current-change="handleCurrentChange"
                :page-size="10"
                layout="prev, pager, next"
                :total="all_length.all"
                class="custom-pagination"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.col_span {
  display: grid;
  grid-column: 7;
}
.custom-pagination .el-pager li.is-active {
  background-color: #36d887 !important;
  color: white !important;
  border-radius: 5px;
}
</style>
