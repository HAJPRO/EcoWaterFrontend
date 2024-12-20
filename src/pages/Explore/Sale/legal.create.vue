<script setup>
import { onMounted, ref } from "vue";
import Title from "@/components/Title.vue";
import AddProInfoModal from "../../../components/Sale/AddProInfoModal.vue";
import { SaleLegalService } from "@/ApiServices/Sale/saleLegal.service";
import { ToastifyService } from "../../../utils/Toastify.js";
import { useRouter } from "vue-router";
const router = useRouter();
import { SaleStore } from "../../../stores/Sale/sale.store";
const store_sale = SaleStore();
import { storeToRefs } from "pinia";
const { plus_type_modal, plus_name_modal } = storeToRefs(store_sale);

const units = ref([
  { id: 1, name: "Kg" },
  { id: 2, name: "Metr" },
  { id: 3, name: "Dona" },
  { id: 4, name: "Pachka" },
]);
const model = ref({});
const getModel = async () => {
  const data = await SaleLegalService.getModel();
  model.value = data.data;
};

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
const orders = ref([]);
const PlusOrder = async () => {
  try {
    orders.value.push(model.value);
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
};
const Save = async () => {
  try {
    const data = await SaleLegalService.create(model.value);
    model.value = {};
    const TimeOut = () => {
      window.location.href = "/explore/sale/legal";
    };
    ToastifyService.ToastSuccess({ msg: data.data.msg });
    setTimeout(TimeOut, 1500);
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
};
const PlusProType = () => {
  store_sale.PlusProTypeModal();
};
const PlusProName = () => {
  store_sale.PlusProNameModal();
};
onMounted(async () => {
  try {
    await getModel();
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
  <AddProInfoModal v-if="plus_type_modal || plus_name_modal" />
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
              <i
                @click="PlusProName()"
                class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
              ></i>
            </template>
            <template #append>
              <el-select size="smal" style="width: 100px">
                <el-option label="Restaurant" value="1" />
                <el-option label="Order No." value="2" />
                <el-option label="Tel" value="3" />
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
              <i
                @click="PlusProType()"
                class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
              ></i>
            </template>
            <template #append>
              <el-select size="smal" style="width: 100px">
                <el-option label="Restaurant" value="1" />
                <el-option label="Order No." value="2" />
                <el-option label="Tel" value="3" />
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
          />
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
        <el-form-item label="Birligi" prop="unit" :rules="rules">
          <el-select
            required
            size="smal"
            v-model="model.unit"
            clearable
            placeholder="..."
          >
            <el-option
              v-for="item in units"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="mb-1 col-span-2">
        <el-form-item
          label="Tayyorlash muddati"
          prop="delivery_time"
          :rules="rules"
        >
          <el-date-picker
            :disabled="orders.length"
            required
            v-model="model.delivery_time"
            clearable
            style="width: 100%"
            size="smal"
            type="date"
            placeholder="..."
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

    <div class="shadow-md rounded min-h-[15px]">
      <el-table
        load
        class="w-full"
        header-align="center"
        hight="4"
        style="width: 100%; font-size: 13px"
        empty-text="Mahsulot tanlanmagan... "
        :data="orders"
        border
        min-height="300"
        max-height="400"
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
          header-align="center"
          prop="customer_name"
          label="Buyurtmachi"
          width="200"
        />

        <el-table-column
          header-align="center"
          prop="order_number"
          label="Buyurtma nomeri"
          width="200"
        />
        <el-table-column
          prop="pro_type"
          label="Turi"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="pro_name"
          label="Nomi"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="pro_color"
          label="Rangi"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="order_quantity"
          label="Miqdori"
          width="180"
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
          prop="delivery_time"
          label="Muddati"
          width="190"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <el-date-picker
              style="width: 100%"
              disabled
              v-model="scope.row.delivery_time"
              clearable
              type="date"
              placeholder=""
              size="smal"
            />
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          prop="id"
          label=""
          width="200"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <router-link
              to=""
              @click="deleteById(scope.row._id)"
              class="inline-flex items-center mt-4 ml-2 text-white bg-red-500 hover:bg-red-600 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
            >
              <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end col-span-10 p-3">
        <el-button
          size="smal"
          @click="PlusValidate(formRef)"
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
</template>
