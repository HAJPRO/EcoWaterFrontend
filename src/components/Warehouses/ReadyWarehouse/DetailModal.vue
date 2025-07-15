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
const updateDialogWidth = () => {
  const w = window.innerWidth;
  dialogWidth.value =
    w > 1600
      ? 1400
      : w > 1200
      ? 1100
      : w > 992
      ? 980
      : w > 768
      ? 750
      : w > 480
      ? 470
      : 350;
};

const total_amount = ref(0); // dona soni
const total_price_amount = ref(0); // umumiy summa (totalPrice)

const getSummaries = ({ columns, data }) => {
  const sums = [];

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "Jami:";
      return;
    }

    const prop = column.property;

    if (prop === "quantity") {
      const totalQty = data.reduce((acc, row) => {
        const qty = Number(row.quantity);
        return isNaN(qty) ? acc : acc + qty;
      }, 0);

      sums[index] = `${totalQty.toLocaleString()} dona`;
      total_amount.value = totalQty;
    } else if (prop === "totalPrice") {
      const totalPrice = data.reduce((acc, row) => {
        const price = Number(row.totalPrice);
        return isNaN(price) ? acc : acc + price;
      }, 0);

      sums[index] = `${totalPrice.toLocaleString()} so'm`;
      total_price_amount.value = totalPrice;
    } else {
      sums[index] = "";
    }
  });

  return sums;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("uz-UZ").format(price);
};
const deleteById = (payload) => {
  store_rw.DeleteById(payload);
};
const isActive = ref(1);
const Title = ref("Kiritilgan");
const ActiveTabLink = (num) => {
  if (num === 1) {
    Title.value = "Kiritilgan";
    isActive.value = 1;
  }
  if (num === 3) {
    Title.value = "Chiqarilgan";
    isActive.value = 3;
  }
  if (num === 2) {
    Title.value = "Qolgan";
    isActive.value = 2;
  }
};

const currentData = computed(() => {
  if (!product.value) return [];
  if (isActive.value === 1) return product.value.input || [];
  if (isActive.value === 2) return product.value.products || [];
  if (isActive.value === 3) return product.value.output || [];

  return [];
});
const transfer = ref(false);
const outputQuantity = ref();
const ProductOutputModal = (id) => {
  transfer.value = !transfer.value;

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
const ReturnProduct = (id) => {};
const AddProductModal = (id) => {
  store_rw.AddProductModal({
    id: product.value._id,
    title: "Mahsulotni kirim qilish",
    action: "update",
  });
};
const recipientes = ref([
  { id: 2, name: "Sotuv" },
  { id: 1, name: "Sklad 2" },
]);
onMounted(() => {
  updateDialogWidth();
  window.addEventListener("resize", updateDialogWidth);
});
</script>
<template>
  <TransferModal />
  <div>
    <el-dialog
      v-model="detail_modal"
      :width="dialogWidth"
      :before-close="handleClose"
      class="rounded-md p-4 shadow-lg custom-modal mt-4"
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
          <div class="flex flex-wrap bg-white rounded-md">
            <!-- Kiritilgan mahsulotlar -->
            <router-link
              @click="ActiveTabLink(1)"
              to=""
              :class="[
                'inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium rounded transition-colors duration-200',
                isActive === 1
                  ? 'bg-green-200 text-green-900'
                  : 'bg-gray-200 text-gray-700',
              ]"
            >
              <i
                class="fa-solid fa-circle-arrow-down mr-2 fa-lg"
                :class="isActive === 1 ? 'text-green-700' : 'text-gray-500'"
              ></i>
              Kiritilgan mahsulotlar
              <div class="flex flex-shrink-0 ml-2">
                <span
                  class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white px-3 py-2 rounded"
                  :class="isActive === 1 ? 'bg-green-600' : 'bg-red-600'"
                >
                  {{ product.input ? product.input.length : 0 }}
                </span>
              </div>
            </router-link>
            <!-- Qolgan mahsulotlar -->
            <router-link
              @click="ActiveTabLink(2)"
              to=""
              :class="[
                'inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium rounded transition-colors duration-200',
                isActive === 2
                  ? 'bg-blue-200 text-blue-900'
                  : 'bg-gray-200 text-gray-700',
              ]"
            >
              <i
                class="fa-solid fa-boxes-stacked mr-2"
                :class="isActive === 2 ? 'text-blue-700' : 'text-gray-500'"
              ></i>
              Qolgan mahsulotlar
              <div class="flex flex-shrink-0 ml-2">
                <span
                  class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white px-3 py-2 rounded"
                  :class="isActive === 2 ? 'bg-blue-600' : 'bg-red-600'"
                >
                  {{ product.products ? product.products.length : 0 }}
                </span>
              </div>
            </router-link>

            <!-- Chiqarilgan mahsulotlar -->
            <router-link
              @click="ActiveTabLink(3)"
              to=""
              :class="[
                'inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium rounded transition-colors duration-200',
                isActive === 3
                  ? 'bg-purple-200 text-purple-900'
                  : 'bg-gray-200 text-gray-700',
              ]"
            >
              <i
                class="fa-solid fa-circle-arrow-up mr-2 fa-lg"
                :class="isActive === 3 ? 'text-purple-700' : 'text-gray-500'"
              ></i>
              Chiqarilgan mahsulotlar
              <div class="flex flex-shrink-0 ml-2">
                <span
                  class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white px-3 py-2 rounded"
                  :class="isActive === 3 ? 'bg-purple-600' : 'bg-red-600'"
                >
                  {{ product.output ? product.output.length : 0 }}
                </span>
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
            :data="currentData"
            show-summary
            :summary-method="getSummaries"
            :header-cell-style="{
              background: '#E3F4FB', // Soft, light cyan-blue
              border: '1px solid #D1E3ED', // Very light border for separation
              color: '#1E3A8A', // Deep indigo for strong text contrast
              fontWeight: '600', // Semi-bold for emphasis
              textAlign: 'center',
              fontSize: '10px', // Optional: for tidiness
            }"
            stripe
            highlight-current-row
            load
            style="font-size: 11px"
            size="small"
            class="el-table-custom w-full text-gray-700 bg-white rounded-md shadow-sm"
            header-align="center"
            empty-text="Mahsulot qo'shilmagan... "
            border="true"
            max-height="500"
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
            />
            <el-table-column
              label="Kodi"
              prop="code"
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
              label="Sotuv narxi dona (sum)"
              prop="costPrice"
              :min-width="200"
              :max-width="400"
              header-align="center"
              align="center"
            />

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
              <el-table-column
                label="Registratsiya"
                :min-width="150"
                :max-width="400"
                header-align="center"
                align="center"
                ><template #default="scope">
                  <div class="text-gray-900 font-semibold">
                    {{
                      scope.row.registeredAt
                        ? moment
                            .utc(scope.row.registeredAt) // 🟢 UTC formatda olish
                            .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                            .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                        : "-"
                    }}
                  </div>
                </template></el-table-column
              >
            </el-table-column>
            <el-table-column
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
              label="Miqdori"
              prop="quantity"
              :min-width="100"
              :max-width="400"
              header-align="center"
              align="center"
              ><template #default="{ row }"
                ><div class="text-blue-600">
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
              v-if="transfer && isActive === 2"
              :min-width="600"
              :max-width="800"
              header-align="center"
              prop="outputInfo"
              align="center"
              label="Mahsulot chiqarish malumotlarini kiritish !"
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
                      {
                        validator: (rule, value, callback) => {
                          const quantity = Number(value);
                          const max = Number(row.quantity); // mavjud miqdor
                          if (quantity > max) {
                            callback(
                              new Error(`Miqdor ${max} dan oshmasligi kerak`)
                            );
                          } else {
                            callback();
                          }
                        },
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
                  <el-date-picker
                    v-model="row.outputRegisteredAt"
                    style="width: 100%"
                    clearable
                    type="date"
                    placeholder="..."
                    size="smal"
                  />
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
                        v-if="isActive === 2"
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
                        @click="deleteById({ id: row._id, action: isActive })"
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
            <div>
              Kirim:
              {{ product.totalAmount ? formatPrice(product.totalAmount) : 0 }}
              so'm
            </div>
            <div>
              Qoldiq:
              {{
                product.totalRemainderPrice
                  ? formatPrice(product.totalRemainderPrice)
                  : 0
              }}
              so'm
            </div>
            <div>
              Chiqim
              {{
                product.totalOutputPrice
                  ? formatPrice(product.totalOutputPrice)
                  : 0
              }}
              so'm
            </div>
          </div> -->
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center mt-2 border-t pt-2">
          <div class="flex gap-2">
            <div
              class="text-[11px] items-center font-medium text-center text-white"
            >
              <el-input
                clearable
                size="smal"
                type="String"
                placeholder="Izlash..."
                style="width: 150px; font-size: 12px"
              />
            </div>
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

          <div class="flex gap-3">
            <!-- <div
              class="mb-1 col-span-3 w-auto text-center text-white text-[13px] font-semibold bg-red-600 rounded-[4px] px-4 py-[5px] hover:bg-red-700"
              @click="driverBindingModal(order._id)"
            >
              <i class="fa-solid fa-xmark mr-2 fa-md"></i> Bekor qilish
            </div> -->

            <div class="flex justify-start bg-white p-2 gap-2">
              <div
                v-if="isActive === 1"
                @click="AddProductModal()"
                class="text-white text-[12px] font-semibold bg-green-500 rounded-[4px] px-4 py-[6px] hover:bg-green-600 cursor-pointer"
              >
                <i
                  class="fa-solid fa-circle-arrow-down mr-2 text-white fa-md fa-lg"
                ></i>
                Mahsulot kirim qilish (Приход)
              </div>
              <div
                v-if="transfer && isActive === 2"
                @click="OutputSaveAll()"
                class="text-white text-[12px] font-semibold bg-purple-500 rounded-[4px] px-4 py-[6px] hover:bg-purple-600 cursor-pointer"
              >
                <i
                  class="fa-solid fa-circle-check mr-2 fa-md text-white fa-md"
                ></i>
                Barchasini saqlash
              </div>
              <div
                v-if="isActive === 2"
                @click="ProductOutputModal()"
                class="text-white text-[12px] font-semibold bg-blue-500 rounded-[4px] px-4 py-[6px] hover:bg-blue-600 cursor-pointer"
              >
                <i
                  v-if="transfer === false"
                  class="fa-solid fa-circle-arrow-up mr-2 text-white fa-lg"
                ></i>
                <i
                  v-if="transfer === true"
                  class="fa-solid fa-xmark mr-2 text-white fa-md"
                ></i>
                {{
                  transfer === false ? ` Mahsulot chiqarish (расход)` : `Yopish`
                }}
              </div>
              <div
                v-if="isActive === 3"
                @click="ProductOutputModal()"
                class="text-white text-[12px] font-semibold bg-purple-500 rounded-[4px] px-4 py-[6px] hover:bg-purple-600 cursor-pointer"
              >
                <i
                  v-if="transfer === false"
                  class="fa-solid fa-circle-arrow-left mr-2 text-white fa-lg"
                ></i>
                <i
                  v-if="transfer === true"
                  class="fa-solid fa-xmark mr-2 text-white fa-md"
                ></i>
                {{
                  transfer === false
                    ? ` Mahsulotni qaytarish (возврат)`
                    : `Yopish`
                }}
              </div>
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
