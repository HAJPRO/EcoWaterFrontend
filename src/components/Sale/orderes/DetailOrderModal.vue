<script setup>
import {dialogWidth} from "../../../utils/dialogOptions/useDialogWidth.js"
import {TableHeaderStyle,TableStyle,formatPrice} from "../../../utils/TableOptions/useTableOptions.js"
import MapView from "../../Customers/customerManagment/MapView.vue";
import AddCustomerModal from "../../Customers/customerManagment/AddCustomModal.vue";
import DriverBindingModal from "../../Sale/orderes/DriverBindingModal.vue";

import { ElMessage } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
import { OrderManagmentStore } from "../../../stores/Sale/orders/orders.store";

import { AddressStore } from "../../../stores/Helpers/address/address.store";
const store_address = AddressStore();
const store_customers = CustomerManagmentStore();
const store_orders = OrderManagmentStore();

import { storeToRefs } from "pinia";

const { order_modal, order, model, order_detail_modal } =
  storeToRefs(store_orders);



const GetAllCustomers = () => {
  store_customers.GetAll();
};
const AddCustomeModal = () => {
  store_customers.AddCustomModal();
};
const driverBindingModal = (id) => {
  store_orders.DriverBindingModal(id);
};

let map = ref(null);
onMounted(async () => {
  try {
    GetAllCustomers();
  } catch (error) {
    console.log(error);
  }
});
const showCustomerInfo = ref(false);
</script>
<template>
  <DriverBindingModal/>
  <AddCustomerModal />
  <el-dialog
    v-model="order_detail_modal"
    :width="dialogWidth"
    class="rounded-lg shadow-xl p-3 overflow-hidden"
  >
    <!-- Header -->
   <template #header>
        <div class="flex items-center justify-between border-b pb-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-file-invoice text-blue-500 fa-lg"></i>
            <h3 class="text-lg font-semibold text-slate-500 dark:text-slate-300">
              Buyurtmaning batafsil malumoti
            </h3>
              <el-tag
          :type="order.status === 'Yangi buyurtma' ? 'success' : 'info'"
          effect="dark"
          size="small"
        >
          {{ order.status }}
        </el-tag>
          </div>
        </div>
      </template>

    <!-- Body -->
    <div class="p-4 space-y-4 bg-gray-50">
      <!-- Customer Info -->
      <div class="bg-white rounded-xl shadow-md border p-5">
    <!-- Header with Toggle Button -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base font-semibold text-gray-700 flex items-center gap-2">
        <span class="w-7 h-7 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full">
          <i class="fa-solid fa-user"></i>
        </span>
        Mijoz ma’lumotlari
      </h2>

      <button
        @click="showCustomerInfo = !showCustomerInfo"
        class="text-sm px-3 py-1 rounded-md border text-indigo-600 hover:bg-indigo-50 transition"
      >
        {{ showCustomerInfo ? "Yopish" : "Ko‘rish" }}
      </button>
    </div>

    <!-- Customer Info -->
    <div v-show="showCustomerInfo" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      <div class="flex flex-col">
        <span class="text-xs text-gray-500">F.I.O</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.fullname || "-" }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Kategoriya</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.category || "-" }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Artikul</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.artikul || "-" }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Daraja</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.position || "-" }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Reyting</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.ratings || 0 }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Telefon</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.phoneNumber || "-" }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Viloyat</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.address?.region || "-" }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Tuman</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.address?.district || "-" }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Mahalla</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.address?.neighborhood || "-" }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Ko‘cha</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.address?.street || "-" }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Uy</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.address?.house || "-" }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Email</span>
        <span class="font-medium text-gray-800">{{ order.customerId?.email || "-" }}</span>
      </div>
    </div>
  </div>


      <!-- Order Products -->
      <div class="bg-white rounded-xl shadow-sm border p-4">
        <h2 class="text-sm font-semibold text-gray-600 border-b pb-2 mb-3">
          📦 Buyurtma mahsulotlari
        </h2>
        <el-table
          :data="order.products"
          border
          size="small"
          class="rounded-lg"
          :header-cell-style="{ background: '#f9fafb', color: '#374151' }"
        >
          <el-table-column type="index" width="50" label="№" align="center" />
          <el-table-column prop="pro_name" label="Mahsulot" min-width="120" />
          <el-table-column prop="packingType" label="Qadoq" min-width="100" />
          <el-table-column
            prop="pro_quantity"
            label="Miqdor"
            align="center"
            min-width="100"
          >
            <template #default="{ row }">
              <span class="text-green-600 font-medium">
                {{ formatPrice(row.pro_quantity) }} {{ row.pro_unit }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="pro_price"
            label="Narxi"
            align="center"
            min-width="100"
          >
            <template #default="{ row }">
              <span class="text-red-600 font-medium">
                {{ formatPrice(row.pro_price) }} so‘m
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="pro_total_price"
            label="Jami"
            align="center"
            min-width="120"
          >
            <template #default="{ row }">
              <span class="text-purple-600 font-semibold">
                {{ formatPrice(row.pro_total_price) }} so‘m
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!-- Total -->
        <div class="flex justify-end mt-3">
          <div class="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold">
            Jami: {{ formatPrice(order.totalAmount) }} so‘m
          </div>
        </div>
      </div>
    </div>

    <template #footer>
        <div class="flex justify-between items-center mt-2 border-t pt-2  ml-4">
       
          <div
            class="col-span-12 cursor-pointer flex justify-end text-[12px] font-semibold gap-2"
          >
            <div
              v-if="order.status === `Yangi buyurtma`"
              class="mb-1 col-span-3 w-auto text-center text-white font-semibold bg-purple-600 rounded-[4px] px-4 py-[7px] hover:bg-purple-700"
              @click="driverBindingModal(order._id)"
            >
              <i class="fa-solid fa-car-side mr-2 fa-md"></i> Haydovchiga
              biriktirish
            </div>
            <div
              v-if="order.status === `Yangi buyurtma`"
              class="mb-1 col-span-3 w-auto text-center text-white font-semibold bg-[#36d887] rounded-[4px] px-4 py-[7px] hover:bg-green-500"
              @click="PlusProduct()"
            >
              <i class="fa-solid fa-pen mr-2 fa-md"></i> O'zgartirish
            </div>
            <div
              class="mb-1 col-span-3 w-auto text-center text-white font-semibold bg-red-600 rounded-[4px] px-5 py-[7px] hover:bg-red-700"
              @click="PlusProduct()"
            >
              <i class="fa-solid fa-xmark mr-2 fa-md"></i> Bekor qilish
            </div>
          </div>
        
        </div>
      </template>
  </el-dialog>
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
