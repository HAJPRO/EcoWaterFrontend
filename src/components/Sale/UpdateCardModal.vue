<script setup>
import { format } from "date-fns";
import { onMounted, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import AddOptionModal from "../../components/Helpers/AddOptionsModal.vue";
import { SaleService } from "../../ApiServices/Sale/sale.service";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { SaleStore } from "../../stores/Sale/sale.store";
import { HelpersStore } from "../../stores/Helpers/helper.store.js";
const store_sale = SaleStore();
const store_helpers = HelpersStore();
import { storeToRefs } from "pinia";
const { update_model, is_update_modal } = storeToRefs(store_sale);
const { options, is_modal } = storeToRefs(store_helpers);
const is_edit = ref(false);
const IsEdit = () => {
  is_edit.value = false;
  product.value = {};
};
const itemExists = ref();
itemExists.value = update_model.value.sale_products;
const product = ref({
  customer_name: update_model.value.customer_name,
  order_number: update_model.value.order_number,
  artikul: update_model.value.artikul,
  material_name: "",
  material_type: "",
  color: "",
  width: "",
  grammage: "",
  order_quantity: "",
  unit: "",
  delivery_time: update_model.value.customer_name,
});
const ProductById = (id) => {
  product.value = {
    customer_name: update_model.value.customer_name,
    order_number: update_model.value.order_number,
    artikul: update_model.value.artikul,
    delivery_time: update_model.value.customer_name,
    ...itemExists.value[id],
  };
  is_edit.value = true;
};

const Type = (type) => {
  store_helpers.SelectType(type);
};
const Plus = (data) => {
  store_helpers.PlusModal(data);
};
const ChangeMaterialName = (value) => {
  model.material_name = value;
};
const ChangeMaterialType = (value) => {
  model.material_type = value;
};
const ChangeColor = (value) => {
  model.color = value;
};
const ChangeUnit = (value) => {
  model.unit = value;
};

const order = ref({
  products: [],
  customer_name: "",
  order_number: "",
  artikul: "",
  delivery_time: "",
});
const formRef = ref();
const PlusValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      PlusOrder();
    } else {
      return false;
    }
  });
};
const PlusOrder = async () => {
  try {
    itemExists.value.push({
      id: uuidv4(),
      customer_name: product.value.customer_name,
      order_number: product.value.order_number,
      artikul: product.value.artikul,
      delivery_time: product.value.delivery_time,
      material_name: product.value.material_name,
      material_type: product.value.material_type,
      color: product.value.color,
      width: product.value.width,
      grammage: product.value.grammage,
      unit: product.value.unit,
      order_quantity: product.value.order_quantity,
    });
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
};
const Save = async () => {
  try {
    if (
      order.value.products.length <= 0 &&
      order.value.customer_name === "" &&
      order.value.order_number === "" &&
      order.value.delivery_time === ""
    ) {
      return ToastifyService.ToastError({ msg: "Mahsulot qo'shilmagan !" });
    } else {
      const loader = loading.show();
      const data = await SaleService.create(order.value);
      store_sale.getAll({ status: 1 });
      if (data) {
        order.value.products = [];
        model.value = {};
      }
      ToastifyService.ToastSuccess({ msg: data.data.msg });
      loader.hide();
    }
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
};
const deleteById = (id) => {
  const filterLoad = itemExists.value.filter((item) => {
    return item.id !== id;
  });
  itemExists.value = filterLoad;
};
onMounted(async () => {
  try {
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
});
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>

<template>
  <AddOptionModal v-if="is_modal === true" />
  <el-dialog v-model="is_update_modal" width="1200">
    <span>
      <div
        class="bg-slate-100 font-semibold text-[15px] p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
      >
        Sotuv karta o'zgartirish
      </div>
      <el-form
        :model="product"
        ref="formRef"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="mb-1 col-span-2">
          <el-form-item
            label="Buyurtmachi nomi"
            prop="customer_name"
            :rules="rules"
          >
            <el-input
              required
              v-model="product.customer_name"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-2">
          <el-form-item label="Artikul" prop="artikul" :rules="rules">
            <el-input
              required
              v-model="product.artikul"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-2">
          <el-form-item
            label="Buyurtma nomeri"
            prop="order_number"
            :rules="rules"
          >
            <el-input
              disabled
              required
              v-model="product.order_number"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-2">
          <el-form-item label="Mato nomi" prop="material_name" :rules="rules">
            <el-input
              required
              v-model="product.material_name"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #prepend>
                <div class="w-[8px] items-start text-center">
                  <i
                    @click="
                      Plus({
                        title: `Material nomi qo'shish`,
                        state: `material_name`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="product.material_name"
                  @click="Type({ type: `material_name` })"
                  @change="ChangeMaterialName($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in options"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-2">
          <el-form-item label="Mato turi" prop="material_type" :rules="rules">
            <el-input
              required
              v-model="product.material_type"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #prepend>
                <div class="w-[8px] items-start text-center">
                  <i
                    @click="
                      Plus({
                        title: `Material tur  qo'shish`,
                        state: `material_type`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="product.material_type"
                  @click="Type({ type: `material_type` })"
                  @change="ChangeMaterialType($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in options"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-2">
          <el-form-item label="Mato rangi" prop="color" :rules="rules">
            <el-input
              required
              v-model="product.color"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #prepend>
                <div class="w-[8px] items-start text-center">
                  <i
                    @click="
                      Plus({
                        title: `Rang qo'shish`,
                        state: `color`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="product.color"
                  @click="Type({ type: `color` })"
                  @change="ChangeColor($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in options"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-2">
          <el-form-item label="Eni" prop="width" :rules="rules">
            <el-input
              required
              v-model="product.width"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-2">
          <el-form-item label="Grammage" prop="grammage" :rules="rules">
            <el-input
              required
              v-model="product.grammage"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-2">
          <el-form-item
            label="Buyurtma miqdori"
            prop="order_quantity"
            :rules="rules"
          >
            <el-input
              required
              v-model="product.order_quantity"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-2">
          <el-form-item label="Birlik" prop="unit" :rules="rules">
            <el-input
              required
              v-model="product.unit"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #prepend>
                <div class="w-[8px] items-start text-center">
                  <i
                    @click="
                      Plus({
                        title: `Birlik qo'shish`,
                        state: `unit`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="product.unit"
                  @click="Type({ type: `unit` })"
                  @change="ChangeUnit($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in options"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-2">
          <el-form-item
            label="Tayyorlash muddati"
            prop="delivery_time"
            :rules="rules"
          >
            <el-date-picker
              :disabled="order.products.length"
              required
              v-model="update_model.delivery_time"
              style="width: 100%"
              clearable
              type="date"
              placeholder="..."
              size="smal"
              default="10.10.2025"
            />
          </el-form-item>
        </div>
        <div v-if="is_edit === false" class="mb-1 col-span-2">
          <el-form-item label=".">
            <el-button
              @click="PlusValidate(formRef)"
              style="
                background-color: #36d887;
                color: white;
                border: none;
                cursor: pointer;
                width: 100%;
                padding: 15px;
              "
            >
              <i class="fa-solid fa-plus mr-2 fa-md"></i> Qo'shish
            </el-button>
          </el-form-item>
        </div>
        <div v-if="is_edit === true" class="mb-1 col-span-2">
          <el-form-item label=".">
            <el-button
              @click="IsEdit()"
              style="
                background-color: #36d887;
                color: white;
                border: none;
                cursor: pointer;
                width: 100%;
                padding: 15px;
              "
            >
              <i class="fa-solid fa-plus mr-2 fa-md"></i> O'zgartirish
            </el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="mt-3 grid grid-cols-12 gap-2">
        <div
          class="col-span-3 h-[250px] shadow-md rounded-md bg-white text-center text-slate-500 font-semibold text-[14px] p-4 cursor-pointer border-t-[1px] border-b-[1px] border-[#36d887]"
        >
          <div class="mt-2 bg-[#e8eded] p-2 rounded">
            Buyurtma nomeri: {{ update_model.order_number }}
          </div>
          <div class="mt-4 bg-[#e8eded] p-2 rounded">
            Buyurtmachi: {{ update_model.customer_name }}
          </div>
          <div class="mt-4 bg-[#e8eded] p-2 rounded">
            Artikul: {{ update_model.artikul }}
          </div>
          <div class="mt-4 bg-[#e8eded] p-2 rounded">
            Muddati:
            {{ format(update_model.delivery_time, "dd.MM.yyyy HH:mm") }}
          </div>
        </div>
        <div class="col-span-9 shadow-md bg-white rounded min-h-[15px]">
          <el-table
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            style="font-size: 12px"
            size="small"
            class="w-full"
            header-align="center"
            empty-text="Mahsulot tanlanmagan... "
            :data="itemExists"
            border
            height="200"
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
              prop="material_name"
              label="Nomi"
              width="150"
              header-align="center"
              align="center"
            />

            <el-table-column
              prop="material_type"
              label="Turi"
              width="150"
              header-align="center"
              align="center"
            />

            <el-table-column
              prop="color"
              label="Rangi"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="width"
              label="Eni"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="grammage"
              label="Grammage"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              fixed="right"
              prop="order_quantity"
              label="Miqdori"
              width="150"
              header-align="center"
              align="center"
              ><template #default="scope"
                ><div class="text-red-500">
                  {{ scope.row.order_quantity }} {{ scope.row.unit }}
                </div></template
              ></el-table-column
            >
            <el-table-column
              prop="unit"
              label="Birligi"
              width="100"
              header-align="center"
              align="center"
            />

            <el-table-column
              fixed="right"
              prop="id"
              label=""
              width="120"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                <router-link
                  to=""
                  @click="ProductById(scope.$index)"
                  class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                >
                  <i class="text-black fa-solid fa-pen fa-xs"></i>
                </router-link>
                <router-link
                  to=""
                  @click="deleteById(scope.row.id)"
                  class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                >
                  <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end col-span-10 p-1 bg-white">
            <el-button
              size="smal"
              @click="Save()"
              style="
                width: 190px;
                background-color: #36d887;
                color: white;
                border: none;
                cursor: pointer;
                padding: 15px;
              "
            >
              <i class="fa-solid fa-check mr-2 fa-md"></i> Saqlash
            </el-button>
          </div>
        </div>
      </div>
    </span>
    <el-dialog
      v-model="innerVisible"
      width="500"
      title="Inner Dialog"
      append-to-body
    >
      <span>This is the inner Dialog</span>
    </el-dialog>
    <template #footer>
      <div class="dialog-footer"></div>
    </template>
  </el-dialog>
</template>
