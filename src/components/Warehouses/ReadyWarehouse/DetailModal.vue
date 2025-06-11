<script setup>
import { ElMessage } from "element-plus";
import { Check } from "@element-plus/icons-vue";
import { onMounted, ref, computed, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";
import TransferModal from "./TransferModal.vue";

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
    Title.value = "Chiqarilgan";
    isActive.value = 2;
  }
};
const transfer = ref(false);
const outputQuantity = ref();
const ProductOutputModal = (id) => {
  transfer.value = true;

  // store_rw.TransferModal({ id, action: "output" });
};
const onDialogClose = () => {
  transfer.value = false;
};
const OutputSave = (data) => {
  // 1. Chiqarilayotgan qiymat mavjudligini tekshirish
  if (
    data.outputQuantity === undefined ||
    data.outputQuantity === null ||
    data.outputQuantity === "" ||
    isNaN(data.outputQuantity)
  ) {
    ElMessage.error("Iltimos, chiqarilayotgan miqdorni kiriting");
    return false;
  }

  // 2. Qiymat manfiy bo'lmasligi kerak
  if (Number(data.outputQuantity) < 0 || Number(data.outputQuantity) === 0) {
    ElMessage.error("Qiymat manfiy yoki nol bo'lishi mumkin emas");
    return false;
  }

  // 3. Chiqarilayotgan miqdor mavjud miqdordan oshmasligi kerak
  if (Number(data.outputQuantity) > Number(data.quantity)) {
    ElMessage.error("Chiqarilayotgan miqdor mavjud miqdordan oshib ketdi");
    return false;
  }

  // ✅ Hammasi yaxshi bo‘lsa
  store_rw.OutputProduct(data);
};
const OutputSaveAll = () => {
  const validRows = [];

  for (const row of product.value.products) {
    if (
      row.outputQuantity === undefined ||
      row.outputQuantity === null ||
      row.outputQuantity === "" ||
      isNaN(row.outputQuantity)
    ) {
      continue; // qiymat yo'q — tashlab ketamiz
    }

    if (Number(row.outputQuantity) <= 0) {
      ElMessage.error(
        `Qiymat 0 yoki manfiy bo'lishi mumkin emas (Mahsulot: ${row.product})`
      );
      return;
    }

    if (Number(row.outputQuantity) > Number(row.quantity)) {
      ElMessage.error(
        `Mahsulot: ${row.product} — chiqarilayotgan miqdor mavjudidan oshib ketdi`
      );
      return;
    }

    validRows.push(row);
  }

  if (validRows.length === 0) {
    ElMessage.warning("Hech qanday to'g'ri kiritilgan qator yo‘q");
    return;
  }

  // Barchasini backendga yuborish (yoki store orqali)
  store_rw.OutputProduct(validRows); // bu siz yaratadigan massiv saqlovchi funksiya

  ElMessage.success("Barcha to‘g‘ri kiritilgan miqdorlar saqlandi");
};

const ProductInputModal = (id) => {
  store_rw.TransferModal({ id, action: "input" });
};
const ReturnProduct = (id) => {
  console.log("vazvirat id : ", id);
};
const recipientes = ref([{ id: 1, name: "Sklad 2" }]);
onMounted(async () => {
  try {
  } catch (error) {
    console.log(error);
  }
});
</script>
<template>
  <TransferModal />
  <div>
    <el-dialog
      v-model="detail_modal"
      :width="dialogWidth"
      :before-close="handleClose"
      class="rounded-md p-4 shadow-lg custom-modal"
      @close="onDialogClose"
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
              <i class="fa-solid fa-boxes-stacked mr-2"></i> Qolgan mahsulotlar
              <div class="flex flex-shrink-0 ml-2">
                <span
                  :class="{ activeTabIcon: isActive === 1 }"
                  class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
                >
                  {{
                    (product.products ? product.products.length : 0) || 0
                  }}</span
                >
              </div>
            </router-link>
            <router-link
              @click="ActiveTabLink(2)"
              to=""
              :class="{ activeTab: isActive === 2 }"
              class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium bg-[#e4e9e9] text-bold rounded"
            >
              <i class="fa-solid fa-boxes-stacked mr-2"></i> Chiqarilgan
              mahsulotlar
              <div class="flex flex-shrink-0 ml-2">
                <span
                  :class="{ activeTabIcon: isActive === 2 }"
                  class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-red-500 px-3 py-2 rounded"
                >
                  {{ (product.output ? product.output.length : 0) || 0 }}</span
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
            <i class="fa-solid fa-boxes-stacked mr-3 fa-md"></i> {{ Title }}
            mahsulotlar jadvali
          </div>
          <el-table
            :data="Title === 'Kiritilgan' ? product?.products : product?.output"
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
            height="300"
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
              ><template #default="{ row }"
                ><div class="text-yellow-600">
                  {{ row.quantity }} {{ row.unit ? row.unit : "" }}
                </div></template
              ></el-table-column
            >
            <el-table-column
              label="Jami (sum)"
              prop="totalPrice"
              :min-width="200"
              :max-width="400"
              header-align="center"
              align="center"
              ><template #default="{ row }"
                ><div class="text-center text-red-500 font-semibold">
                  {{ row.totalPrice ? formatPrice(row.totalPrice) : 0 }} sum
                </div></template
              ></el-table-column
            >
            <el-table-column
              fixed="right"
              label="Holati"
              :min-width="170"
              :max-width="400"
              header-align="center"
              align="center"
            >
              <template #default="{ row }">
                <router-link
                  to=""
                  :class="[
                    'cursor-pointer inline-flex items-center gap-1 hover:bg-opacity-90 font-medium rounded-md text-[12px] w-full p-[5px] sm:w-auto text-center',
                    row.status
                      ? 'bg-green-200 text-green-900'
                      : 'bg-red-200 text-red-900',
                  ]"
                >
                  <i
                    :class="
                      row.status
                        ? 'fa-solid fa-circle-check text-green-700'
                        : 'fa-solid fa-hourglass-start text-red-700'
                    "
                  ></i>
                  {{ row.status ? row.status : "Dastlab kiritilgan" }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              v-if="transfer && Title === `Kiritilgan`"
              :min-width="600"
              :max-width="800"
              header-align="center"
              prop="outputInfo"
              align="center"
              label="Mahsulot chiqarish malumotlari"
            >
              <template #default="{ row }">
                <div class="flex gap-2 items-center text-center">
                  <el-input
                    v-model="row.outputQuantity"
                    type="number"
                    placeholder="Miqdor kiriting"
                    :rules="[
                      {
                        required: true,
                        message: 'Miqdorni kiriting',
                        trigger: 'blur',
                      },
                    ]"
                  />
                  <el-select
                    v-model="row.outputRecipient"
                    placeholder="Qayerga chiqarilyapti"
                    size="smal"
                    style="width: 100%"
                    @change="ChangeProductName($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="AddProductNameModal()"
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in recipientes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item.id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                  <el-select
                    v-model="row.outputResponsible"
                    placeholder="Masul xodim"
                    size="smal"
                    style="width: 100%"
                    @change="ChangeProductName($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="AddProductNameModal()"
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in recipientes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item.id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                  <div
                    class="mb-1 col-span-3 w-auto text-center text-white text-[12px] font-semibold bg-indigo-500 rounded-[4px] px-3 py-[4px] hover:bg-indigo-600 cursor-pointer"
                    @click="OutputSave(row)"
                  >
                    Saqlash
                  </div>
                </div>
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
                        v-if="Title === `Kiritilgan`"
                        class="text-[13px] text-green-600"
                        @click="ProductOutputModal(row._id)"
                        ><template #default=""
                          ><div>
                            <i
                              class="text-black fa-solid fa-angles-left fa-sm mr-2"
                            ></i
                            >Mahsulot chiqarish
                          </div>
                        </template></el-dropdown-item
                      >
                      <el-dropdown-item
                        v-if="Title === `Chiqarilgan`"
                        class="text-[13px] text-green-600"
                        @click="ReturnProduct(row._id)"
                        ><template #default=""
                          ><div>
                            <i
                              class="text-black fa-solid fa-angles-down fa-sm mr-2"
                            ></i
                            >Mahsulotni qaytarish (возврат)
                          </div>
                        </template></el-dropdown-item
                      >
                      <el-dropdown-item
                        v-if="Title === `Kiritilgan`"
                        class="text-[13px]"
                        @click="ProductInputModal(row._id)"
                        ><template #default="{}"
                          ><div>
                            <i
                              class="text-black fa-solid fa-angles-right fa-sm mr-2"
                            ></i>
                            Mahsulot kiritish
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
            class="bg-white text-gray-600 text-[12px] font-semibold px-4 py-1 text-center flex items-center justify-between"
          >
            <div>
              Qolgan:
              {{
                product.totalRemainderPrice
                  ? formatPrice(product.totalRemainderPrice)
                  : 0
              }}
              so'm
            </div>
            <div>
              Chiqarilgan:
              {{
                product.totalOutputPrice
                  ? formatPrice(product.totalOutputPrice)
                  : 0
              }}
              so'm
            </div>
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
              v-if="transfer && Title === 'Kiritilgan'"
              class="mb-1 col-span-3 w-auto text-center text-white text-[13px] font-semibold bg-purple-500 rounded-[4px] px-4 py-[5px] hover:bg-purple-600 cursor-pointer"
              @click="OutputSaveAll()"
            >
              <i class="fa-solid fa-check mr-2 fa-md"></i> Barchasini saqlash
            </div>
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
