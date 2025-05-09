<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";
const store_product = ProductsManagmentStore();
import { storeToRefs } from "pinia";
const { product_modal, model } = storeToRefs(store_product);

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

const AddProductModal = () => {
  store_product.AddProductModal();
};
const ChangeCustomerFullname = async (id) => {
  model.value.fullname = id;
  store_customers.GetById({ id, status: "order" });
};
const ChangeProductType = async (e) => {
  model.value.product.pro_type = e;
};
const ChangeProductName = async (e) => {
  model.value.product.pro_name = e;
};

const units = ref([
  { id: 1, name: "Litr" },
  { id: 2, name: "Dona" },
  { id: 3, name: "Blok" },
]);
const products = ref([
  { id: 1, type: "Gazli", name: "Kola" },
  { id: 2, type: "Gazli", name: "Chortoq" },
  { id: 3, type: "Gazli", name: "Fanta" },
]);
const categoryes = ref([
  { id: 1, name: "Gazli" },
  { id: 2, name: "Gazsiz" },
  { id: 3, name: "Sharbatlar" },
]);
const packingTypes = ref([
  { id: 1, name: "0.5 l" },
  { id: 2, name: "1 l" },
  { id: 3, name: "1.5 l" },
  { id: 4, name: "2 l" },
  { id: 6, name: "5 l" },
  { id: 7, name: "10 l" },
  { id: 8, name: "20 l" },
]);
const proQualityes = ref([
  { id: 1, name: "Oliy" },
  { id: 2, name: "O'rta" },
  { id: 3, name: "Standart" },
]);
const saleTypes = ref([
  { id: 1, name: "Dona" },
  { id: 2, name: "Litr" },
  { id: 3, name: "Blok" },
  { id: 4, name: "Kg" },
  { id: 5, name: "Tonna" },
]);
const Products = ref([]);
const PlusProduct = () => {
  if (
    model.value.packingType === "" ||
    model.value.cost_price === "" ||
    model.value.buying_price === ""
  ) {
    ElMessage.error("Iltimos barcha maydonlarni to'ldiring !");
  } else {
    const data = {
      id: uuidv4(),
      packingType: model.value.packingType,
      cost_price: Number(model.value.cost_price),
      buying_price: Number(model.value.buying_price),
    };
    Products.value.push(data);
  }
};
const formRef = ref();
const PlusValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      const main = {
        code: model.value.code,
        pro_name: model.value.pro_name,
        pro_category: model.value.pro_category,
        pro_quality: model.value.pro_quality,
        sale_type: model.value.sale_type,
        pro_image_url: model.value.pro_image_url,
        productionStarteddAt: new Date(),
      };
      store_product.Create({...main, products :  Products.value});
    } else {
      ElMessage.error("Iltimos barcha maydonlarni to'ldiring !");
      return false;
    }
  });
};

const DeleteById = (id) => {
  const filterLoad = Products.value.filter((item) => {
    return item.id !== id;
  });
  Products.value = filterLoad;
};
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
    <el-dialog v-model="product_modal" :width="dialogWidth" class="mt-2">
      <span>
        <div
          class="bg-slate-100 font-semibold text-[15px] p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          <i class="fa-solid fa-gift fa-md mr-3"></i> Mahsulot qo'shish
        </div>
        <el-form
          ref="formRef"
          :model="model"
          label-width="auto"
          class="filter-box grid grid-cols-12 bg-[#e8eded] md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 text-[13px]"
          size="small"
          label-position="top"
        >
          <!-- //  Mahsulot ma'lumotlari -->
          <div
            class="mb-1 col-span-7 bg-[#e8eded] p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="bg-slate-100 font-semibold text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Mahsulot ma'lumotlari
            </h1>
            <div class="grid grid-cols-12 gap-1">
              <div class="mb-1 col-span-4">
                <el-form-item label="Kodi" prop="code" :rules="rules">
                  <el-input
                    required
                    v-model="model.code"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="String"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item label="Nomi" prop="pro_name" :rules="rules">
                  <el-select
                    v-model="model.pro_name"
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

              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Kategoryasi"
                  prop="pro_category"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.pro_category"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `pro_category` })"
                    @change="ChangeProductCategory($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `pro_category`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in categoryes"
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
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Sifat darajasi"
                  prop="pro_quality"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.pro_quality"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `pro_quality` })"
                    @change="ChangeProductQuality($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi darajasini qo'shish`,
                            state: `pro_quality`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in proQualityes"
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
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Sotuv turi"
                  prop="sale_type"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.sale_type"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `sale_type ` })"
                    @change="ChangeProductSaleType($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `sale_type`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in saleTypes"
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
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Ishlab chiqarish boshlangan"
                  prop="productionStarteddAt"
                  :rules="rules"
                >
                  <el-date-picker
                    required
                    v-model="model.productionStarteddAt"
                    style="width: 100%"
                    clearable
                    type="date"
                    placeholder="..."
                    size="smal"
                  />
                </el-form-item>
              </div>
              <div class="col-span-12 p-1 rounded-md">
                <el-form-item label="Rasm" prop="pro_image_url">
                  <el-upload
                    class="w-full"
                    v-model:file-list="ImagesList"
                    list-type="picture-card"
                    :before-upload="handleBeforeUpload"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-change="handleFileChange"
                    :limit="limit"
                    :on-exceed="handleExceed"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </el-upload>

                  <el-dialog
                    class="mt-16"
                    v-model="dialogVisible"
                    width="500"
                    :style="{ height: '650px' }"
                  >
                    <img
                      class="w-full h-[600px] rounded-md"
                      :src="dialogImageUrl"
                      alt="Preview Image"
                    />
                  </el-dialog>
                </el-form-item>
              </div>
            </div>
          </div>
          <!-- //  Narx ma'lumotlari -->
          <div
            class="mb-1 col-span-5 bg-[#e8eded] p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="bg-slate-100 font-semibold text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Narx ma'lumotlari
            </h1>
            <div class="grid grid-cols-12 gap-1">
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Qadoq turlari"
                  prop="packingType"
                  :rules="rules"
                >
                  <el-select
                    v-model="model.packingType"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `packingType` })"
                    @change="ChangePackingType($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `packingType`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in packingTypes"
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
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Tan narxi (sum)"
                  prop="cost_price"
                  :rules="rules"
                >
                  <el-input
                    required
                    v-model="model.cost_price"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="Number"
                    maxlength="9"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Sotuv narxi (sum)"
                  prop="buying_price"
                  :rules="rules"
                >
                  <el-input
                    required
                    v-model="model.buying_price"
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
              class="col-span-12 cursor-pointer flex justify-end text-[12px] font-semibold border-b-[1px] border-purple-600"
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
              height="220"
              :data="Products"
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
                label="Turi"
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
              <el-table-column
                prop="cost_price"
                label="Tan narxi (sum)"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-green-600">
                    {{ row.cost_price ? formatPrice(row.cost_price) : 0 }}
                  </div></template
                ></el-table-column
              >

              <el-table-column
                prop="buying_price"
                label="Sotuv narxi (sum)"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-purple-600">
                    {{ row.buying_price ? formatPrice(row.buying_price) : 0 }}
                  </div></template
                ></el-table-column
              >
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
          </div>
        </el-form>

        <div class="flex justify-end bg-[#e8eded] p-2 rounded">
          <el-button
            @click="PlusValidate(formRef)"
            style="
              width: 190px;
              background-color: #36d887;
              color: white;
              border: none;
              cursor: pointer;
              padding: 15px;
            "
          >
            <i class="fa-solid fa-check mr-2 fa-md"></i>Saqlash
          </el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.image-uploader-card {
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.image-uploader {
  width: 100%;
  min-height: 200px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 32px;
  color: #409eff;
  margin-bottom: 10px;
}
#map {
  height: 300px;
  width: 100%;
}
.el-form-item {
  width: 100%; /* El-form-item kengligini to'liq qilish */
}

.el-date-picker {
  width: 100% !important; /* El-date-picker kengligini to'liq qilish */
}
</style>
