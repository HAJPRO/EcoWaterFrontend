<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";
import { ReadyWarehouseStore } from "../../../stores/Warehouses/r-warehouse/warehouse.store";
const store_rw = ReadyWarehouseStore();
import { storeToRefs } from "pinia";
const { detail_modal, product } = storeToRefs(store_rw);

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
const formatPrice = (price) => {
  return new Intl.NumberFormat("uz-UZ").format(price);
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
onMounted(async () => {
  try {
  } catch (error) {
    console.log(error);
  }
});
const data = ref({
  productName: "Sharbat Mango",
  productCode: "PRD-2024",
  quantity: 1200,
  totalAmount: 24000000,
  branch: "G'ijduvon tumani filiali",
  source: "Online",
  salesByDate: [
    { date: "2025-05-01", quantity: 300, amount: 6000000 },
    { date: "2025-05-02", quantity: 400, amount: 8000000 },
    { date: "2025-05-03", quantity: 500, amount: 10000000 },
  ],
});
</script>
<template>
  <div>
    <el-dialog
      v-model="detail_modal"
      :width="dialogWidth"
      :before-close="handleClose"
      class="rounded-md p-4 shadow-lg custom-modal"
    >
      <template #header>
        <div class="flex items-center justify-between border-b pb-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-box text-lg text-blue-500"></i>
            <h3 class="text-xl font-semibold text-gray-500">
              {{ product?.partyNumber }}
            </h3>
          </div>
          <div>
            <router-link
              @click="ActiveTabLink(1)"
              to=""
              :class="{ activeTab: isActive === 1 }"
              class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
            >
              <i class="fa-solid fa-boxes-stacked mr-2"></i> Kiritilganlar
              <div class="flex flex-shrink-0 ml-2">
                <span
                  :class="{ activeTabIcon: isActive === 1 }"
                  class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
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
              <i class="fa-solid fa-boxes-stacked mr-2"></i> Chiqarilganlar
              <div class="flex flex-shrink-0 ml-2">
                <span
                  :class="{ activeTabIcon: isActive === 2 }"
                  class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-red-500 px-3 py-2 rounded"
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
            <i class="fa-solid fa-calendar-days mr-2"></i> {{ Title }}
            mahsulotlar jadvali
          </div>
          <el-table
            :data="product?.products"
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            style="font-size: 12px"
            class="w-full rounded-none"
            empty-text="Mahsulot qo'shilmagan... "
            size="small"
            border
            stripe
            highlight-current-row
            height="200"
          >
            <el-table-column
              header-align="center"
              align="center"
              type="index"
              prop="index"
              fixed="left"
              label="🔢 №"
              width="60"
            />
            <el-table-column
              label=" Nomi"
              prop="product"
              :min-width="100"
              :max-width="400"
              header-align="center"
              align="center"
              fixed="left"
            />
            <el-table-column
              label="Kategorya"
              prop="category"
              :min-width="100"
              :max-width="400"
              header-align="center"
              align="center"
            />
            <el-table-column
              label="Qadoq turi"
              prop="packagingType"
              :min-width="100"
              :max-width="400"
              header-align="center"
              align="center"
            />
            <el-table-column
              label="Tan narxi dona (sum)"
              prop="costPrice"
              :min-width="200"
              :max-width="400"
              header-align="center"
              align="center"
            />
            <el-table-column
              label="Tan narxi blok (sum)"
              prop="blockCostPrice"
              :min-width="200"
              :max-width="400"
              header-align="center"
              align="center"
              ><template #default="{ row }"
                ><div>
                  {{ row.blockCostPrice ? row.blockCostPrice : 0 }}
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
                label="Ishlab chiqarilgan"
                :min-width="150"
                :max-width="400"
                header-align="center"
                align="center"
                ><template #default="scope">
                  <div class="text-gray-900 font-semibold">
                    {{
                      scope.row.manufactureDate
                        ? moment
                            .utc(scope.row.manufactureDate) // 🟢 UTC formatda olish
                            .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                            .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                        : "-"
                    }}
                  </div>
                </template></el-table-column
              >
              <el-table-column
                label="Yaroqli muddati"
                :min-width="150"
                :max-width="400"
                header-align="center"
                align="center"
                ><template #default="scope">
                  <div class="text-gray-900 font-semibold">
                    {{
                      scope.row.expireDate
                        ? moment
                            .utc(scope.row.expireDate) // 🟢 UTC formatda olish
                            .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                            .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                        : "-"
                    }}
                  </div>
                </template></el-table-column
              >
            </el-table-column>
            <el-table-column
              label="Miqdori"
              prop="quantity"
              :min-width="100"
              :max-width="400"
              header-align="center"
              align="center"
            />
            <el-table-column
              label="Jami (sum)"
              prop="totalPrice"
              :min-width="200"
              :max-width="400"
              header-align="center"
              align="center"
              ><template #default="{ row }"
                ><div class="text-center text-red-500 font-semibold">
                  {{ row.totalPrice ? row.totalPrice : 0 }} sum
                </div></template
              ></el-table-column
            >
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
                        @click="detailModal(row._id)"
                        ><template #default=""
                          ><div>
                            <i
                              class="text-black fa-solid fa-angles-left fa-sm mr-2"
                            ></i
                            >Ko'chirish
                          </div>
                        </template></el-dropdown-item
                      >
                      <!-- <el-dropdown-item
                      class="text-[13px]"
                      @click="updateById(row._id)"
                      ><template #default="{}"
                        ><div>
                          <i
                            class="text-black fa-solid fa-xmark fa-sm mr-1"
                          ></i>
                          Bekor qilish
                        </div>
                      </template></el-dropdown-item
                    > -->

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
          <div
            class="bg-white text-gray-600 text-[12px] font-semibold px-4 py-1 text-center flex items-center justify-between"
          >
            <div>Kiritilgan: 0</div>
            <div>Skladda qoldi: 0</div>
          </div>
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
</style>
