<script setup>
import MapView from "../../Customers/customerManagment/MapView.vue";
import { ElMessage } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
import { OrderManagmentStore } from "../../../stores/Sale/orders/orders.store";

import { AddressStore } from "../../../stores/Helpers/address/address.store";
const store_address = AddressStore();
const store_customers = CustomerManagmentStore();
const store_orders = OrderManagmentStore();

import { storeToRefs } from "pinia";
const { custom_modal, modal, action, customers } = storeToRefs(store_customers);
const { order_modal, drivers, driver_binding_modal } =
  storeToRefs(store_orders);

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
const model = ref({
  fullname: "",
  deliveryTime: "",
});
const AddCustomeModal = () => {
  store_customers.AddCustomModal();
};
const ChangeCustomerFullname = async (id) => {
  model.value.fullname = id;
};

const formRef = ref();
const PlusValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_orders.UpdateById(model.value);
    } else {
      ElMessage.error("Iltimos barcha maydonlarni to'ldiring !");
      return false;
    }
  });
};

const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});

const filter = ref({
  fullname: "",
});

// Faqat fullname boshlanishi bo‘yicha filter
const filteredDrivers = computed(() => {
  if (!filter.value.fullname) return drivers.value;
  const query = filter.value.fullname.toLowerCase();
  return drivers.value.filter((driver) => {
    const name = driver.fullname.toLowerCase();
    return name.startsWith(query) || name === query;
  });
});

let map = ref(null);
onMounted(async () => {
  try {
  } catch (error) {
    console.log(error);
  }
});
</script>
<template>
  <div>
    <el-dialog v-model="driver_binding_modal" :width="500" class="mt-2">
      <span>
        <div
          class="bg-slate-100 font-semibold text-[15px] p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          <i class="fa-solid fa-car-side fa-md mr-3"></i> Buyurtmaga haydovchi
          biriktirish
        </div>
        <el-form
          ref="formRef"
          :model="model"
          label-width="auto"
          class="filter-box grid grid-cols-12 bg-[#e8eded] md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 text-[13px]"
          size="small"
          label-position="top"
        >
          <div class="mb-1 col-span-6">
            <el-form-item
              label="Haydovchi tanlang"
              prop="fullname"
              :rules="rules"
            >
              <el-select
                v-model="model.fullname"
                placeholder="..."
                size="smal"
                style="width: 100%"
                @change="ChangeCustomerFullname($event)"
                :no-data-text="'Haydovchi topilmadi'"
              >
                <!-- ➕ ICON qo‘shish -->
                <template #prefix>
                  <i
                    @click.stop="AddCustomeModal()"
                    class="fa-solid fa-plus cursor-pointer"
                  ></i>
                </template>

                <!-- 🔍 FILTER INPUT QO‘SHAMIZ -->
                <template #header>
                  <div class="p-1 w-full bg-white">
                    <el-input
                      v-model="filter.fullname"
                      placeholder="Ism bo‘yicha izlang..."
                      size="smal"
                      clearable
                      class="w-full"
                      @input="FilterByFullname"
                    />
                  </div>
                </template>

                <!-- 🔁 OPTIONLAR -->
                <el-option
                  v-for="item in filteredDrivers"
                  :key="item._id"
                  :label="item.fullname"
                  :value="item._id"
                >
                  <template #default>
                    <div
                      class="flex justify-between items-center w-full text-[12px]"
                    >
                      <span class="text-[14px] font-semibold">{{
                        item.fullname
                      }}</span>
                      <span class="ml-4 text-red-500 font-semibold">
                        <i
                          class="fa-solid fa-car text-red-500 cursor-pointer fa-xs mr-1"
                        ></i>
                        {{ item.carNumber ? item.carNumber : "-" }}
                        {{ item.carType ? item.carType : "" }}
                      </span>
                      <span class="ml-4 text-green-700"
                        >Vil:{{ item.address.region }}</span
                      >
                      <span class="ml-4 text-blue-500 font-semibold"
                        >Tel:{{ item.phoneNumber }}</span
                      >
                    </div>
                  </template>
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="mb-1 col-span-6">
            <el-form-item
              label="Yetkazib berish muddati"
              prop="deliveryTime"
              :rules="rules"
            >
              <el-date-picker
                v-model="model.deliveryTime"
                type="date"
                placeholder="..."
                size="smal"
                class="w-full"
              />
            </el-form-item>
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
</style>
