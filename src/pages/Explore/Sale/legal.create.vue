<script setup>
import { onMounted, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import Title from "@/components/Title.vue";
import AddOptionModal from "../../../components/Helpers/AddOptionsModal.vue";
import { SaleLegalService } from "@/ApiServices/Sale/saleLegal.service";
import { ToastifyService } from "../../../utils/Toastify.js";
import { SaleStore } from "../../../stores/Sale/sale.store";
const store_sale = SaleStore();
import { HelpersStore } from "../../../stores/Helpers/helper.store.js";
const store_heloers = HelpersStore();
import { storeToRefs } from "pinia";
const {} = storeToRefs(store_sale);
const { options, is_modal } = storeToRefs(store_heloers);
const Type = (type) => {
  store_heloers.SelectType(type);
};
const Plus = (data) => {
  store_heloers.PlusModal(data);
};
const ChangeMaterialName = (value) => {
  model.pro_name = value;
};
const ChangeMaterialType = (value) => {
  model.pro_type = value;
};
const ChangeColor = (value) => {
  model.pro_color = value;
};
const ChangeUnit = (value) => {
  model.unit = value;
};
const model = ref({});
const GetModel = async () => {
  const data = await SaleLegalService.getModel();
  model.value = data.data;
};

const order = ref({
  products: [],
  customer_name: "",
  order_number: "",
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
    order.value.products.push({
      id: uuidv4(),
      pro_name: model.value.pro_name,
      pro_type: model.value.pro_type,
      pro_color: model.value.pro_color,
      pro_width: model.value.pro_width,
      grammaj: model.value.grammaj,
      unit: model.value.unit,
      order_quantity: model.value.order_quantity,
    });

    order.value.customer_name = model.value.customer_name;
    order.value.order_number = model.value.order_number;
    order.value.delivery_time = model.value.delivery_time;
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
      const data = await SaleLegalService.create(order.value);

      if (data) {
        order.value.products = [];
        GetModel();
      }
      ToastifyService.ToastSuccess({ msg: data.data.msg });
    }
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
};
const deleteById = (id) => {
  const filterLoad = order.value.products.filter((item) => {
    return item.id !== id;
  });
  order.value.products = filterLoad;
};
onMounted(async () => {
  try {
    await GetModel();
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
  <div>
    <Title>
      <template v-slot:title>
        <h3>Sotuv karta yaratish</h3>
      </template>
    </Title>
    <el-form
      ref="formRef"
      :model="model"
      label-width="auto"
      class="filter-box bg-white md:grid md:grid-cols-10 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
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
            :disabled="order.products.length"
            required
            v-model="model.customer_name"
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
            v-model="model.order_number"
            clearable
            class="w-[100%]"
            size="smal"
            type="String"
            placeholder="..."
          />
        </el-form-item>
      </div>
      <div class="mb-1 col-span-2">
        <el-form-item label="Mahsulot nomi" prop="pro_name" :rules="rules">
          <el-input
            required
            v-model="model.pro_name"
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
                v-model="model.pro_name"
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
        <el-form-item label="Mahsulot turi" prop="pro_type" :rules="rules">
          <el-input
            required
            v-model="model.pro_type"
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
                v-model="model.pro_type"
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
        <el-form-item label="Mahsulot rangi" prop="pro_color" :rules="rules">
          <el-input
            required
            v-model="model.pro_color"
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
                v-model="model.pro_color"
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
        <el-form-item label="Eni" prop="pro_width" :rules="rules">
          <el-input
            required
            v-model="model.pro_width"
            clearable
            class="w-[100%]"
            size="smal"
            type="Number"
            placeholder="..."
          />
        </el-form-item>
      </div>
      <div class="mb-1 col-span-2">
        <el-form-item label="Grammaji" prop="grammaj" :rules="rules">
          <el-input
            required
            v-model="model.grammaj"
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
            v-model="model.order_quantity"
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
            v-model="model.unit"
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
                v-model="model.unit"
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
            v-model="model.delivery_time"
            style="width: 100%"
            clearable
            type="date"
            placeholder="..."
            size="smal"
          />
        </el-form-item>
      </div>
      <div class="flex justify-end col-span-10 p-2">
        <el-button
          @click="PlusValidate(formRef)"
          style="
            background-color: #36d887;
            color: white;
            border: none;
            cursor: pointer;
            padding: 15px;
          "
        >
          <i class="fa-solid fa-plus mr-2 fa-md"></i> Qo'shish
        </el-button>
      </div>
    </el-form>
    <div class="mt-3 grid grid-cols-12 gap-2">
      <div
        class="col-span-3 h-[300px] shadow-md rounded-md bg-white text-center text-slate-500 font-semibold text-[14px] p-4 cursor-pointer border-t-[1px] border-b-[1px] border-[#36d887]"
      >
        <div class="mt-14 bg-slate-200 p-2 rounded">
          Buyurtma nomeri: {{ model.order_number }}
        </div>
        <div class="mt-4 bg-slate-200 p-2 rounded">
          Buyurtmachi: {{ model.customer_name }}
        </div>
        <div class="mt-4 bg-slate-200 p-2 rounded">
          Muddat : {{ String(model.delivery_time).substring(0, 15) }}
        </div>
      </div>
      <div class="col-span-9 shadow-md bg-white rounded min-h-[15px]">
        <el-table
          load
          class="w-full"
          header-align="center"
          hight="4"
          style="width: 100%; font-size: 12px"
          empty-text="Mahsulot tanlanmagan... "
          :data="order.products"
          border
          height="240"
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
            prop="pro_name"
            label="Nomi"
            width="300"
            header-align="center"
            align="center"
          />

          <el-table-column
            prop="pro_type"
            label="Turi"
            width="200"
            header-align="center"
            align="center"
          />

          <el-table-column
            prop="pro_color"
            label="Rangi"
            width="200"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="order_quantity"
            label="Miqdori"
            width="280"
            header-align="center"
            align="center"
          />
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
            width="100"
            header-align="center"
            align="center"
          >
            <template #default="scope">
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
        <div class="flex justify-end col-span-10 p-3 bg-white">
          <el-button
            size="smal"
            @click="Save()"
            style="
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
  </div>
</template>
