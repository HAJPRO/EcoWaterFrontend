<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";

import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
const store_customer = CustomerManagmentStore();
import { storeToRefs } from "pinia";
const { detail_modal, orders } = storeToRefs(store_customer);

const dialogWidth = ref("");
window.addEventListener("devicemotion", () => {
  dialogWidth.value =
    window.innerWidth > 1400
      ? "1300"
      : window.innerWidth > 1000
      ? "1000"
      : window.innerWidth > 800
      ? "800"
      : window.innerWidth > 600
      ? "600"
      : "450";
});
window.addEventListener("resize", () => {
  dialogWidth.value =
    window.innerWidth > 1400
      ? "1500"
      : window.innerWidth > 1000
      ? "1000"
      : window.innerWidth > 800
      ? "800"
      : window.innerWidth > 600
      ? "600"
      : "450";
});
const formatPrice = (num) => {
  const val = Number(num);
  return isNaN(val) ? "0" : val.toLocaleString("uz-UZ");
};

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
</script>
<template>
  <div>
    <el-dialog
      v-model="detail_modal"
      :width="dialogWidth"
      :before-close="handleClose"
      class="rounded-md p-4 shadow-lg custom-modal mt-2"
    >
      <template #header>
        <div class="flex items-center justify-between border-b pb-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-box text-lg text-blue-500"></i>
            <h3 class="text-xl font-semibold text-gray-500">
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
        <!-- Tafsilotlar -->
        <!-- <div
          class="grid grid-cols-12 gap-2 col-span-6 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <div class="col-span-6 p-1 bg-slate-200 rounded-md">
            <strong><i class="fa-solid fa-barcode mr-1"></i> Kodi:</strong>
            {{ 0 }}
          </div>
          <div class="col-span-6 p-1 bg-slate-200 rounded-md">
            <strong
              ><i class="fa-solid fa-layer-group mr-1"></i> Kategoriya:</strong
            >
            {{ 0 }}
          </div>
          <div class="col-span-6 p-1 bg-slate-200 rounded-md">
            <strong
              ><i class="fa-solid fa-star mr-1"></i> Sifat darajasi:</strong
            >
            {{ 0 }}
          </div>
          <div class="col-span-6 p-1 bg-slate-200 rounded-md">
            <strong><i class="fa-solid fa-tags mr-1"></i> Sotuv turi:</strong>
            {{ product?.sale_type }}
          </div>
          <div class="col-span-6 p-1 bg-slate-200 rounded-md">
            <strong
              ><i class="fa-solid fa-calendar-check mr-1"></i> Ishlab chiqarish
              boshlangan:</strong
            >
            {{ 0 }}
          </div>
          <div class="col-span-6 p-1 bg-slate-200 rounded-md">
            <strong
              ><i class="fa-solid fa-calendar-xmark mr-1"></i> Ishlab chiqarish
              to'xtatilgan:</strong
            >
            {{ 0 }}
          </div>
          <div class="col-span-6 p-1 bg-slate-200 rounded-md">
            <strong
              ><i class="fa-solid fa-boxes-stacked mr-1"></i> Umumiy
              sotilgan:</strong
            >
            {{ 0 }} dona
          </div>
          <div class="col-span-6 p-1 bg-slate-200 rounded-md">
            <strong
              ><i class="fa-solid fa-money-bill-wave mr-1"></i> Umumiy
              tushum:</strong
            >
            {{ formatPrice(0) }}
          </div>
          <div class="col-span-6 p-1 bg-slate-200 rounded-md">
            <strong><i class="fa-solid fa-building mr-1"></i> Filial:</strong>
            {{ 0 }}
          </div>
          <div
            class="col-span-6 flex items-center gap-2 p-1 bg-slate-200 rounded-md"
          >
            <strong
              ><i class="fa-solid fa-circle-info mr-1"></i> Holati:</strong
            >
            <el-tag
              :type="data?.status === 'Aktive' ? 'success' : 'info'"
              size="small"
            >
              {{ 0 }}
            </el-tag>
          </div>
        </div> -->

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
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            show-summary
            :summary-method="getSummaries"
            :default-sort="[
              { prop: 'status', order: 'descending' },
              { prop: 'orderNumber', order: 'descending' },
            ]"
            stripe
            highlight-current-row
            load
            style="font-size: 12px"
            size="small"
            class="w-full my-summary-table"
            header-align="right"
            :max-height="600"
            empty-text="Mahsulot qo'shilmagan... "
            :data="orders"
            border
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
              :min-width="150"
              :max-width="400"
              sortable
              header-align="center"
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
                      style="width: auto; max-height: 1200px; overflow-y: auto"
                    >
                      <div v-if="row.driverId.fullname">
                        <el-table
                          :header-cell-style="{
                            background: '#e8ed90',
                            border: '0.2px solid #e1e1e3',
                          }"
                          border
                          stripe
                          highlight-current-row
                          class="gradient-header-table rounded-none"
                          load
                          style="font-size: 12px"
                          size="small"
                          header-align="center"
                          empty-text="Mahsulot qo'shilmagan... "
                          height="160"
                          :data="row.products"
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
                            prop="pro_type"
                            label="Turi"
                            :min-width="100"
                            :max-width="400"
                            header-align="center"
                            align="center"
                          >
                            <template #default="{ row }"
                              ><div class="text-red-500">
                                {{ row.pro_type }}
                              </div></template
                            ></el-table-column
                          >
                          <el-table-column
                            prop="pro_name"
                            label="Nomi"
                            :min-width="100"
                            :max-width="400"
                            header-align="center"
                            align="center"
                          />

                          <el-table-column
                            prop="pro_quantity"
                            label="Miqdori"
                            :min-width="100"
                            :max-width="400"
                            header-align="center"
                            align="center"
                          >
                            <template #default="{ row }"
                              ><div class="text-green-600">
                                {{ formatPrice(row.pro_quantity) }}
                                {{ row.pro_unit }}
                              </div></template
                            ></el-table-column
                          >
                          <el-table-column
                            prop="pro_price"
                            label="Narxi (sum)"
                            :min-width="100"
                            :max-width="400"
                            header-align="center"
                            align="center"
                          >
                            <template #default="{ row }"
                              ><div class="text-red-600">
                                {{ formatPrice(row.pro_price) }} sum
                              </div></template
                            ></el-table-column
                          >

                          <el-table-column
                            prop="pro_total_price"
                            label="Jami (sum)"
                            :min-width="100"
                            :max-width="400"
                            header-align="center"
                            align="center"
                            ><template #default="{ row }"
                              ><div class="text-purple-600">
                                {{ formatPrice(row.pro_total_price) }} sum
                              </div></template
                            ></el-table-column
                          >

                          <!-- <el-table-column
                            fixed="right"
                            prop="id"
                            label=""
                            :min-width="60"
                            :max-width="100"
                            header-align="center"
                            align="center"
                          >
                            <template #default="scope">
                              <router-link
                                to=""
                                @click="DeleteById(scope.row.id)"
                                class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                              >
                                <i
                                  class="text-black fa-sharp fa-solid fa-trash fa-xs"
                                ></i>
                              </router-link>
                            </template>
                          </el-table-column> -->
                        </el-table>
                        <div class="bg-white p-2 rounded-md flex justify-end">
                          <div
                            class="mb-1 col-span-12 w-full flex justify-end text-purple-600 font-semibold bg-purple-100 rounded-md p-2"
                          >
                            Jami :
                            {{ formatPrice(row.totalAmount) }} sum
                          </div>
                        </div>
                      </div>
                      <div
                        class="text-center font-semibold text-gray-800"
                        v-else
                      >
                        Topilmadi
                      </div>
                    </div>
                  </template>

                  <div class="text-red-500 cursor-pointer hover:underline">
                    <router-link
                      to=""
                      class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
                    >
                      {{ row.orderNumber }}
                    </router-link>
                  </div>
                </el-tooltip>
              </template></el-table-column
            >
            <el-table-column
              prop="fullname"
              label="F.I.O"
              :min-width="100"
              :max-width="400"
              header-align="center"
              align="center"
            >
              <template #default="{ row }">{{
                row.customerId.fullname
              }}</template></el-table-column
            >
            <el-table-column
              align="center"
              header-align="center"
              prop="customerId.artikul"
              label="Artikul"
              :min-width="100"
              :max-width="400"
            />
            <el-table-column
              label="Kategoriyasi"
              :min-width="150"
              :max-width="400"
              header-align="center"
              align="center"
              ><template #default="scope">{{
                scope.row.customerId.category
              }}</template></el-table-column
            >
            <el-table-column
              align="center"
              header-align="center"
              prop="customerId.address.region"
              label="Viloyat"
              :min-width="100"
              :max-width="400"
            />
            <el-table-column
              align="center"
              header-align="center"
              prop="customerId.address.district"
              label="Tuman"
              :min-width="100"
              :max-width="400"
            />
            <el-table-column
              align="center"
              header-align="center"
              prop="customerId.address.neighborhood"
              label="Mahalla"
              :min-width="100"
              :max-width="400"
            />
            <el-table-column
              align="center"
              header-align="center"
              prop="customerId.address.street"
              label="Ko'cha"
              :min-width="100"
              :max-width="400"
            />
            <el-table-column
              align="center"
              header-align="center"
              prop="customerId.phoneNumber"
              label="Telefon"
              :min-width="100"
              :max-width="400"
            />

            <el-table-column
              label="Bonus ball"
              :min-width="100"
              header-align="center"
              align="center"
              ><template #default="scope">{{ 0 }}</template></el-table-column
            >
            <el-table-column
              prop="totalAmount"
              fixed="right"
              label="Jami (sum)"
              :min-width="200"
              :max-width="400"
              header-align="center"
              align="center"
              ><template #default="{ row }">
                <div class="text-red-500 font-semibold">
                  {{ row.totalAmount ? formatPrice(row.totalAmount) : 0 }} sum
                </div></template
              ></el-table-column
            >
            <el-table-column
              label="🕒 Vaqt maydoni"
              :min-width="150"
              :max-width="400"
              header-align="center"
              align="center"
            >
              <el-table-column
                label="Yaratilgan"
                :min-width="150"
                :max-width="400"
                header-align="center"
                align="center"
                ><template #default="scope">
                  <div class="text-gray-900 font-semibold">
                    {{
                      scope.row.createdAt
                        ? moment
                            .utc(scope.row.createdAt) // 🟢 UTC formatda olish
                            .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                            .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                        : "-"
                    }}
                  </div>
                </template></el-table-column
              >
              <el-table-column
                label="Yetkazish muddati"
                :min-width="150"
                :max-width="400"
                header-align="center"
                align="center"
                ><template #default="scope">
                  <div class="text-blue-600 font-semibold">
                    {{
                      scope.row.deliveryTime
                        ? moment
                            .utc(scope.row.deliveryTime) // 🟢 UTC formatda olish
                            .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                            .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                        : "-"
                    }}
                  </div>
                </template></el-table-column
              >
              <el-table-column
                label="Haydovchiga yuborildi"
                :min-width="150"
                :max-width="400"
                header-align="center"
                align="center"
                ><template #default="scope">
                  <div class="text-yellow-600 font-semibold">
                    {{
                      scope.row.driverSentToTime
                        ? moment
                            .utc(scope.row.driverSentToTime) // 🟢 UTC formatda olish
                            .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                            .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                        : "-"
                    }}
                  </div>
                </template></el-table-column
              >
              <el-table-column
                label="Haydovchi qabul qildi "
                :min-width="150"
                :max-width="400"
                header-align="center"
                align="center"
                ><template #default="scope">
                  <div class="text-purple-600 font-semibold">
                    {{
                      scope.row.driverAcceptedTime
                        ? moment
                            .utc(scope.row.driverAcceptedTime) // 🟢 UTC formatda olish
                            .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                            .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                        : "-"
                    }}
                  </div>
                </template></el-table-column
              >
              <el-table-column
                label="Yetkazib berildi"
                :min-width="150"
                :max-width="400"
                header-align="center"
                align="center"
                ><template #default="scope">
                  <div class="text-green-600 font-semibold">
                    {{
                      scope.row.driverArrivedTime
                        ? moment
                            .utc(scope.row.driverArrivedTime) // 🟢 UTC formatda olish
                            .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                            .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                        : "-"
                    }}
                  </div>
                </template></el-table-column
              >
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
        <div class="flex justify-between items-center mt-2 border-t pt-2">
          <el-select placeholder="Export" class="w-32 my-2">
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

          <div class="flex gap-3">
            <!-- <div
              class="mb-1 col-span-3 w-auto text-center text-white text-[13px] font-semibold bg-red-600 rounded-[4px] px-4 py-[5px] hover:bg-red-700"
              @click="driverBindingModal(order._id)"
            >
              <i class="fa-solid fa-xmark mr-2 fa-md"></i> Bekor qilish
            </div> -->
            <div
              class="mb-1 col-span-3 w-auto text-center text-white text-[13px] font-semibold bg-green-500 rounded-[4px] px-4 py-[5px] hover:bg-green-600"
              @click="printData()"
            >
              <i class="fa-solid fa-print mr-2 fa-md"></i> Chop etish
            </div>
          </div>
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
