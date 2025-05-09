<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref, computed ,watch} from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";
import { ReadyWarehouseStore } from "../../../stores/Warehouses/r-warehouse/warehouse.store";
const store_rw = ReadyWarehouseStore();
import { storeToRefs } from "pinia";
const { product_modal, product, model } = storeToRefs(store_rw);

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
const totalPrice = computed(() => {
  const quantity = model.value?.quantity ?? 0;
  const salePrice = model.value?.salePrice ?? 0;
  return quantity * salePrice;
});
// totalAmount ni ref bilan aniqlash
const totalAmount = ref(0);

// Watcher uchun
watch(
  () => model.value.products, // Kuzatadigan massiv
  (newProducts) => {
    if (newProducts?.length > 0) {
      totalAmount.value = newProducts.reduce(
        (a, b) => a + Number(b.totalPrice),
        0
      );
    } else {
      totalAmount.value = 0;
    }
  },
  { immediate: true } // Dastlabki qiymatni ham yangilash uchun
);
console.log(totalAmount.value);




const PlusProduct = () => {
  // Yangi mahsulot yaratish
  const product = {
    id: uuidv4(),
    product: model.value.product || "",                  // Agar mavjud bo‘lmasa, bo‘sh qiymat berish
    category: model.value.category || "",                // Agar mavjud bo‘lmasa, bo‘sh qiymat berish
    quantity: model.value.quantity || "",                // Agar mavjud bo‘lmasa, bo‘sh qiymat berish
    packagingType: model.value.packagingType || "",      // Agar mavjud bo‘lmasa, bo‘sh qiymat berish
    costPrice: model.value.costPrice || "",              // Agar mavjud bo‘lmasa, bo‘sh qiymat berish
    salePrice: model.value.salePrice || "",              // Agar mavjud bo‘lmasa, bo‘sh qiymat berish
    totalPrice: totalPrice || 0,            // Agar mavjud bo‘lmasa, bo‘sh qiymat berish
    manufactureDate: model.value.manufactureDate || "",  // Agar mavjud bo‘lmasa, bo‘sh qiymat berish
    expireDate: model.value.expireDate || ""             // Agar mavjud bo‘lmasa, bo‘sh qiymat berish
  };
  model.value.products.push(product);
};

const formRef = ref(null);
const SaveValidate = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid === true) {
      store_rw.Create(model.value);
    } else {
      ElMessage.error("Iltimos barcha maydonlarni to'ldiring !");
      return false;
    }
  });
};
const DeleteById = (id) => {
  const filterLoad = model.value.products.filter((item) => {
    return item.id !== id;
  });
  model.value.products = filterLoad;
};


const pakings = ref([
  { id: 1, name: "Litr" },
  { id: 2, name: "Dona" },
  { id: 3, name: "Blok" },
]);
const products = ref([
  { id: 1, type : "Gazli", name: "Kola 0.5 l" },
  { id: 2, type : "Gazli",  name: "Chortoq 1.5 l" },
  { id: 3, type : "Gazli", name: "Fanta 1 l" },
]);
const productsType = ref([
  { id: 1, name: "Gazli" },
  { id: 2,  name: "Gazsiz" },
  { id: 3, name: "Sharbatlar" },
]);
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
onMounted(async () => {
  try {
  } catch (error) {
    console.log(error);
  }
});
</script>
<template>
  <div>
    <el-dialog
      v-model="product_modal"
      :width="dialogWidth"
      :before-close="handleClose"
      class="rounded-md p-4 shadow-lg custom-modal"
    >
      <template #header>
        <div class="flex items-center justify-between border-b pb-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-box text-lg text-green-600"></i>
            <h3 class="text-xl font-semibold text-gray-500">
              Mahsulot qo'shish
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
                <el-form-item
                  label="Ishlab chiqaruvchi korxona"
                  prop="manufacturer"
                  :rules="rules"
                >
                  <el-select
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
                      v-for="item in products"
                      :key="item._id"
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
                  label="Yetkazib beruvchi"
                  prop="supplier"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.supplier"
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
                      v-for="item in products"
                      :key="item._id"
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
                  :rules="rules"
                >
                  <el-select
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
                      v-for="item in products"
                      :key="item._id"
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
                  label="Mahsulotni qabul qiluvchi "
                  prop="receivedBy"
                  :rules="rules"
                >
                  <el-select
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
                      v-for="item in products"
                      :key="item._id"
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

            
            </div>
          </div>
          <!-- //   Mahsulot ma'lumotlari -->
          <div
            class="mb-1 col-span-9 bg-[#e8eded] p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="bg-slate-100 font-semibold text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
             Mahsulot ma'lumotlari
            </h1>
            <div class="grid grid-cols-12 gap-1">
              <div class="mb-1 col-span-3">
                <el-form-item
                  label="Nomi"
                  prop="product"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.product"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `product` })"
                    @change="ChangePackingType($event)"
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
                <el-form-item
                  label="Kategorya"
                  prop="category"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.category"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `category` })"
                    @change="ChangePackingType($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `category`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in products"
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
                <el-form-item
                  label="Ishlab chiqarilgan sana"
                  prop="manufactureDate"
                  :rules="rules"
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
                <el-form-item
                  label="Yaroqlilik muddati"
                  prop="expireDate"
                  :rules="rules"
                >
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
                <el-form-item
                  label="Qadoq turi"
                  prop="packagingType"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.packagingType"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `packagingType` })"
                    @change="ChangePackingType($event)"
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
                      v-for="item in products"
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
                <el-form-item
                  label="Miqdori"
                  prop="quantity"
                  :rules="rules"
                >
                  <el-input
                    required
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
                <el-form-item
                  label="Tan narxi (sum)"
                  prop="costPrice"
                  :rules="rules"
                >
                  <el-input
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
              <div class="mb-1 col-span-3">
                <el-form-item
                  label="Sotuv narxi (sum)"
                  prop="salePrice"
                  :rules="rules"
                >
                  <el-input
                    required
                    v-model="model.salePrice"
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
            <div
              class="col-span-12 cursor-pointer flex justify-end text-[12px] font-semibold border-b-[1px] border-green-600"
            >
              <div
                class="mb-3 mt-3 col-span-3 w-auto text-center text-white font-semibold bg-purple-600 rounded-sm px-5 py-1 hover:bg-purple-700"
                @click="PlusProduct()"
              >
                <i class="fa-solid fa-plus mr-2 fa-md"></i> Qo'shish
              </div>
            </div>
            <el-table
              :header-cell-style="{
                background: '#fef9c3',
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
              height="220"
              :data="model.products"
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
                prop="PackingType"
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
                prop="category"
                label="kategorya"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-red-500">
                    {{ row.PackingType }}
                  </div></template
                ></el-table-column
              >
                  <el-table-column  label="🕒 Vaqt maydoni"
          :min-width="150"
          :max-width="400"
            header-align="center"
            align="center">
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
                      .utc( scope.row.manufactureDate) // 🟢 UTC formatda olish
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
                      .utc( scope.row.expireDate) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}
                </div>
            
            </template></el-table-column
          >
               <el-table-column
                prop="packagingType"
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
          </el-table-column>
           <el-table-column  label="💵 Narx maydoni"
          :min-width="150"
          :max-width="400"
            header-align="center"
            align="center">
              <el-table-column
                prop="costPrice"
                label="Tan narxi (sum)"
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
                prop="salePrice"
                label="Sotuv narxi (sum)"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-purple-600">
                    {{ row.salePrice ? formatPrice(row.salePrice) : 0 }}
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
                    {{ row.quantity ? formatPrice(row.quantity) : 0 }} {{row.packagingType}}
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
                    {{ row.quantity ? formatPrice(row.quantity * row.salePrice) : 0 }} sum
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
           <div class="bg-white p-2 rounded-md flex justify-end">
  <div
    class="mb-1 col-span-12 w-full flex justify-end text-purple-600 font-semibold bg-purple-100 rounded-md p-2"
  >
    Jami :
    {{model.totalAmount ?  formatPrice(model.totalAmount) : 0}} so'm
  </div>
</div>

          </div>
        </el-form>
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
            <div
              class="mb-1 col-span-3 w-auto text-center text-white text-[13px] font-semibold bg-red-600 rounded-[4px] px-4 py-[5px] hover:bg-red-700 cursor-pointer"
              @click="Cancel()"
            >
              <i class="fa-solid fa-xmark mr-2 fa-md"></i> Bekor qilish
            </div>
            <div
              class="mb-1 col-span-3 w-auto text-center text-white text-[13px] font-semibold bg-green-500 rounded-[4px] px-4 py-[5px] hover:bg-green-600 cursor-pointer"
              @click="SaveValidate()"
            >
              <i class="fa-solid fa-check mr-2 fa-md"></i> Saqlah
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
