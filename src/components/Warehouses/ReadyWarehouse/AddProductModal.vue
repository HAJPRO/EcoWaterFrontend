<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref, computed, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";
import { ReadyWarehouseStore } from "../../../stores/Warehouses/r-warehouse/warehouse.store";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";

const store_rw = ReadyWarehouseStore();
const store_pro = ProductsManagmentStore();
import { storeToRefs } from "pinia";
const { product_modal, product, model, ModalAction } = storeToRefs(store_rw);
const { product: pro, products } = storeToRefs(store_pro);

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
const formatPrice = (price) => {
  return new Intl.NumberFormat("uz-UZ").format(price);
};
const totalPrice = computed(() => {
  const quantity = model.value?.quantity ?? 0;
  const salePrice = model.value?.salePrice ?? 0;
  return quantity * salePrice;
});
const totalAmount = computed(() => {
  const products = model.value.products || [];
  return products.reduce((sum, item) => {
    const price =
      typeof item.totalPrice === "object" && "value" in item.totalPrice
        ? Number(item.totalPrice.value || 0)
        : Number(item.totalPrice || 0);
    return sum + price;
  }, 0);
});
// Watch qilish
watch(totalAmount, (newVal) => {
  model.value.totalAmount = newVal;
  model.value.totalRemainderPrice = newVal;
});

const newDataArray = ref([]);
const PlusProduct = () => {
  // ✅ 1. Bo‘sh qiymatlar tekshiruvi
  if (!model.value.product) {
    ElMessage.error("Mahsulot nomi kiritilmagan");
    return;
  }
  if (!model.value.quantity || isNaN(model.value.quantity)) {
    ElMessage.error("Miqdor noto‘g‘ri yoki kiritilmagan");
    return;
  }
  if (!model.value.unit) {
    ElMessage.error("O‘lchov birligi tanlanmagan");
    return;
  }
  if (
    model.value.unit === "Blok" &&
    (!model.value.blockCostPrice || isNaN(model.value.blockCostPrice))
  ) {
    ElMessage.error("Blok narxi noto‘g‘ri yoki kiritilmagan");
    return;
  }
  if (
    model.value.unit !== "Blok" &&
    (!model.value.costPrice || isNaN(model.value.costPrice))
  ) {
    ElMessage.error("Narx noto‘g‘ri yoki kiritilmagan");
    return;
  }
  if (!model.value.packagingType) {
    ElMessage.error("Qadoqlash turi tanlanmagan");
    return;
  }

  // ✅ 2. Mahsulot obyektini yaratish
  const product = {
    id: uuidv4(),
    product: model.value.product,
    code: model.value.code || "",
    quantity: Number(model.value.quantity),
    packagingType: model.value.packagingType,
    costPrice: Number(model.value.costPrice) || 0,
    unit: model.value.unit,
    totalPrice:
      model.value.unit === "Blok"
        ? Number(model.value.quantity) * Number(model.value.blockCostPrice)
        : Number(model.value.quantity) * Number(model.value.costPrice),
    manufactureDate: model.value.manufactureDate || "",
    expireDate: model.value.expireDate || "",
    registeredAt: model.value.registeredAt || "",

    status:
      ModalAction.value.action === "update"
        ? "Yangi qo'shilgan"
        : "Dastlab qo'shilgan",
  };

  // ✅ 3. Qo‘shish
  ModalAction.value.action === "update"
    ? newDataArray.value.push(product)
    : model.value.products.push(product);

  // ✅ 4. Formani tozalash
  model.value.quantity = "";
  model.value.packagingType = "";
  model.value.costPrice = "";
  model.value.blockCostPrice = "";
  model.value.unit = "";

  ElMessage.success("Mahsulot muvaffaqiyatli qo‘shildi");
};

const formRef = ref(null);
const SaveValidate = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid === true) {
      if (ModalAction.value.action === "update") {
        const newData = {
          newDataArray: newDataArray.value,
          id: model.value._id,
        };
        store_rw.Create({
          model: newData,
          action: ModalAction.value.action,
        });
        newDataArray.value = [];
      } else {
        store_rw.Create({
          model: model.value,
          action: ModalAction.value.action,
        });
      }
    } else {
      ElMessage.error("Iltimos barcha maydonlarni to'ldiring !");
      return false;
    }
  });
};
const DeleteById = (id) => {
  if (ModalAction.value.action === `update`) {
    const filterLoad = newDataArray.value.filter((item) => {
      return item.id !== id;
    });

    newDataArray.value = filterLoad;
  } else {
    const filterLoad = model.value.products.filter((item) => {
      return item.id !== id;
    });

    model.value.products = filterLoad;
  }
};
watch(
  () => model.value.product,
  (newValue) => {
    ChangeName(newValue);
    ChangePacking(newValue);
  }
);
const pakings = ref();
const SelectedProduct = ref();
const ChangeName = (value) => {
  const selectedProduct = products.value.find(
    (item) => item.pro_name === value
  );
  if (selectedProduct) {
    model.value.category = selectedProduct.pro_category;
    model.value.code = selectedProduct.code;
    pakings.value = selectedProduct.products;
    SelectedProduct.value = selectedProduct;
  }
};
const ChangePacking = (value) => {
  const selectedProduct = products.value.find(
    (item) => item.pro_name === value
  );
  if (SelectedProduct.value) {
    const selectedPacking = SelectedProduct.value.products.find(
      (item) => item.packingType === value
    );

    if (selectedPacking) {
      model.value.packagingType = selectedPacking.packingType;
      model.value.costPrice = selectedPacking.buying_price;
      model.value.blockCostPrice = selectedPacking.block_cost_price;
    }
  }
};
const ChangeUnit = (value) => {
  model.value.unit = value;
};

const categoryes = ref([
  { id: 1, name: "Gazli" },
  { id: 2, name: "Gazsiz" },
  { id: 3, name: "Sharbatlar" },
]);
const suppliers = ref([{ id: 1, name: "Eco Water MCHJ" }]);
const manufacturers = ref([{ id: 1, name: "Eco Water MCHJ" }]);
const units = ref([
  { id: 1, name: "Dona" },
  { id: 2, name: "Blok" },
  { id: 3, name: "Kg" },
  { id: 4, name: "litr" },
  { id: 5, name: "Metr" },
  { id: 6, name: "Tona" },
  { id: 7, name: "Quti" },
  { id: 8, name: "Boshqa" },
]);
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});

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
onMounted(() => {
  updateDialogWidth();
  window.addEventListener("resize", updateDialogWidth);
  store_pro.GetAll({ status: 0 });
});
</script>
<template>
  <div>
    <el-dialog
      v-model="product_modal"
      :width="dialogWidth"
      :before-close="handleClose"
      class="rounded-md p-4 shadow-lg custom-modal mt-2"
    >
      <template #header>
        <div class="flex items-center justify-between border-b pb-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-box text-lg text-blue-600"></i>
            <h3 class="text-xl font-semibold text-gray-500">
              {{ ModalAction.title }}
            </h3>
          </div>
        </div>
      </template>
      <div>
        <el-form
          ref="formRef"
          :model="model"
          label-width="auto"
          class="filter-box grid grid-cols-12 bg-[#e8eded] md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 text-[13px]"
          size="small"
          label-position="top"
        >
          <!-- //  Asosiy ma'lumotlari -->
          <div
            class="mb-1 col-span-3 bg-[#e8eded] p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="bg-slate-100 font-semibold text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Asosiy ma'lumotlari
            </h1>
            <div class="grid grid-cols-12 gap-1">
              <div class="mb-1 col-span-12">
                <el-form-item
                  label="Partya nomer"
                  prop="partyNumber"
                  :rules="rules"
                >
                  <el-input
                    disabled
                    required
                    v-model="model.partyNumber"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="String"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-12">
                <el-form-item label="Nomi" prop="product" :rules="rules">
                  <el-select
                    :disabled="model.products?.length > 0"
                    v-model="model.product"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `product` })"
                    @change="ChangeName($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `product`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in products"
                      :key="item._id"
                      :label="item.pro_name"
                      :value="item.pro_name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.pro_name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-12">
                <el-form-item
                  label="Ishlab chiqaruvchi korxona"
                  prop="manufacturer"
                  :rules="rules"
                >
                  <el-select
                    :disabled="model.products?.length > 0"
                    v-model="model.manufacturer"
                    placeholder="..."
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
                      v-for="item in manufacturers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="mb-1 col-span-12">
                <el-form-item
                  label="Mahsulotni jo'natgan xodim "
                  prop="senderEmployee"
                >
                  <el-select
                    :disabled="model.products?.length > 0"
                    v-model="model.senderEmployee"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `senderEmployee` })"
                    @change="ChangeProductCategory($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `senderEmployee`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in manufacturers"
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
                </el-form-item>
              </div>
              <div class="mb-1 col-span-12">
                <el-form-item
                  label="Mahsulotni qabul qiluvchi "
                  prop="receivedBy"
                >
                  <el-select
                    :disabled="model.products?.length > 0"
                    v-model="model.receivedBy"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `receivedBy` })"
                    @change="ChangeProductCategory($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `receivedBy`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in manufacturers"
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
                </el-form-item>
              </div>
            </div>
          </div>
          <!-- //   Mahsulot ma'lumotlari -->
          <div
            class="mb-1 col-span-9 bg-white p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="bg-slate-100 font-semibold text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Mahsulot ma'lumotlari
            </h1>
            <div class="grid grid-cols-12 gap-1">
              <div class="mb-1 col-span-3">
                <el-form-item label="Kodi" prop="code">
                  <el-input
                    disabled
                    required
                    v-model="model.code"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="text"
                    maxlength="9"
                    placeholder="..."
                  />
                </el-form-item>
              </div>

              <div class="mb-1 col-span-3">
                <el-form-item
                  label="Ishlab chiqarilgan sana"
                  prop="manufactureDate"
                >
                  <el-date-picker
                    required
                    v-model="model.manufactureDate"
                    style="width: 100%"
                    clearable
                    type="date"
                    placeholder="..."
                    size="smal"
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-3">
                <el-form-item label="Yaroqlilik muddati" prop="expireDate">
                  <el-date-picker
                    required
                    v-model="model.expireDate"
                    style="width: 100%"
                    clearable
                    type="date"
                    placeholder="..."
                    size="smal"
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-3">
                <el-form-item label="Registratsiya sanasi" prop="registeredAt">
                  <el-date-picker
                    required
                    v-model="model.registeredAt"
                    style="width: 100%"
                    clearable
                    type="date"
                    placeholder="..."
                    size="smal"
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-3">
                <el-form-item label="Qadoq turi" prop="packagingType">
                  <el-select
                    v-model="model.packagingType"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `packagingType` })"
                    @change="ChangePacking($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `packagingType`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in pakings"
                      :key="item.id"
                      :label="item.packingType"
                      :value="item.packingType"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.packingType }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-3">
                <el-form-item label="Miqdori" prop="quantity">
                  <el-input
                    v-model="model.quantity"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="Number"
                    maxlength="9"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-3">
                <el-form-item label="Birligi" prop="unit">
                  <el-select
                    v-model="model.unit"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `unit` })"
                    @change="ChangeUnit($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `unit`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in units"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-3">
                <el-form-item label="Sotuv narxi dona (sum)" prop="costPrice">
                  <el-input
                    disabled
                    required
                    v-model="model.costPrice"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="Number"
                    maxlength="9"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
            </div>
            <div class="flex justify-end items-center mt-2 border-t pt-2">
              <div class="flex gap-3">
                <div
                  class="mb-1 col-span-3 w-auto text-center cursor-pointer text-white text-[13px] font-semibold bg-blue-500 rounded-[4px] px-4 py-[6px] hover:bg-blue-600"
                  @click="PlusProduct()"
                >
                  <i class="fa-solid fa-plus mr-2 fa-md"></i>
                  Qo'shish
                </div>
              </div>
            </div>
            <el-table
              :header-cell-style="{
                background: '#E3F4FB', // Soft, light cyan-blue
                border: '1px solid #D1E3ED', // Very light border for separation
                color: '#1E3A8A', // Deep indigo for strong text contrast
                fontWeight: '600', // Semi-bold for emphasis
                textAlign: 'center',
                fontSize: '10px', // Optional: for tidiness
              }"
              :data="
                ModalAction.action === 'update' ? newDataArray : model.products
              "
              show-summary
              :summary-method="getSummaries"
              stripe
              highlight-current-row
              load
              style="font-size: 11px"
              size="small"
              class="el-table-custom w-full text-gray-700 bg-white rounded-md shadow-sm"
              header-align="center"
              empty-text="Mahsulot qo'shilmagan... "
              border="true"
              max-height="300"
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
                label="Nomi"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-red-500">
                    {{ row.product }}
                  </div></template
                ></el-table-column
              >
              <el-table-column
                prop="code"
                label="Kodi"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-red-500">
                    {{ row.code }}
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
                  label="Ishlab chiqarilgan sana"
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
                  label="Yaroqlilik muddati"
                  :min-width="150"
                  :max-width="400"
                  header-align="center"
                  align="center"
                  ><template #default="scope">
                    <div class="text-blue-600 font-semibold">
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
                    <div class="text-blue-600 font-semibold">
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
                fixed="right"
                label="💵 Narx maydoni"
                :min-width="150"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <el-table-column
                  prop="costPrice"
                  label="Sotuv narxi dona (sum)"
                  :min-width="100"
                  :max-width="400"
                  header-align="center"
                  align="center"
                >
                  <template #default="{ row }"
                    ><div class="text-green-600">
                      {{ row.costPrice ? formatPrice(row.costPrice) : 0 }}
                    </div></template
                  ></el-table-column
                >
                <el-table-column
                  prop="quantity"
                  label="Miqdori"
                  :min-width="100"
                  :max-width="400"
                  header-align="center"
                  align="center"
                >
                  <template #default="{ row }"
                    ><div class="text-purple-600">
                      {{ row.quantity ? formatPrice(row.quantity) : 0 }}
                      {{ row.unit }}
                    </div></template
                  ></el-table-column
                >
                <el-table-column
                  label="Qadoq turi"
                  :min-width="100"
                  :max-width="400"
                  header-align="center"
                  align="center"
                >
                  <template #default="{ row }"
                    ><div class="text-red-500">
                      {{ row.packagingType }}
                    </div></template
                  ></el-table-column
                >
                <el-table-column
                  prop="totalPrice"
                  label="Jami (sum)"
                  :min-width="100"
                  :max-width="400"
                  header-align="center"
                  align="center"
                >
                  <template #default="{ row }"
                    ><div class="text-purple-600">
                      {{
                        row.quantity
                          ? row.unit === "Blok"
                            ? formatPrice(row.quantity * row.blockCostPrice)
                            : formatPrice(row.quantity * row.costPrice)
                          : 0
                      }}
                      sum
                    </div></template
                  ></el-table-column
                >
              </el-table-column>
              <el-table-column
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
                    <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
            <div
              v-if="ModalAction.action !== `update`"
              class="bg-white p-2 rounded-md flex justify-end"
            >
              <div
                class="mb-1 col-span-12 w-full flex justify-end text-purple-600 font-semibold bg-purple-100 rounded-md p-2"
              >
                Jami :
                {{
                  ModalAction.action === `update`
                    ? 0
                    : formatPrice(model.totalAmount)
                }}
                so'm
              </div>
            </div>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="flex justify-between items-center mt-1 border-t pt-2">
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

          <div class="flex gap-3">
            <div
              class="mb-1 col-span-3 w-auto text-center text-white text-[13px] font-semibold bg-red-600 rounded-[4px] px-4 py-[6px] hover:bg-red-700 cursor-pointer"
              @click="Cancel()"
            >
              <i class="fa-solid fa-xmark mr-2 fa-md"></i> Bekor qilish
            </div>
            <div
              class="mb-1 col-span-3 w-auto text-center cursor-pointer text-white text-[13px] font-semibold bg-green-500 rounded-[4px] px-4 py-[6px] hover:bg-green-600"
              @click="SaveValidate()"
            >
              <i class="fa-solid fa-check mr-2 fa-md"></i>
              {{ ModalAction.action === "create" ? "Saqlash" : "O'zgartirish" }}
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
</style>
