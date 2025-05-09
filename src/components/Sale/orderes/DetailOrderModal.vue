<script setup>
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
const {  } = storeToRefs(store_customers);
const { order_modal, order, model, order_detail_modal } = storeToRefs(store_orders);

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
</script>
<template>
  <AddCustomerModal v-if="custom_modal === true" />
  <DriverBindingModal  />

  <div>
    <el-dialog v-model="order_detail_modal" :width="dialogWidth" class="mt-2">
      <span>
        <div
          class="bg-slate-100 font-semibold text-[15px] p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          <i class="fa-solid fa-cart-plus fa-md mr-3"></i> Buyurtmaning batafsil
          malumoti
        </div>
        <div
          class="filter-box bg-[#e8eded] md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 text-[13px]"
        >
          <!-- //  Asosiy ma'lumotlar -->
          <div
            class="mb-1 col-span-6 p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="font-semibold bg-slate-100 text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Buyurtmachi ma'lumotlari
            </h1>

      
 <ul class="mt-2 w-full flex gap-2 cursor-pointer flex-wrap">
  <li 
    class="w-auto p-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">1.</span>
    <span class="text-white font-semibold text-[12px]">
      {{order.customerId.fullname}}
    </span>
  </li>
 
   <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">2.</span>
    <span class="text-white font-semibold text-[12px]">
      {{order.customerId.category}}
    </span>
  </li>
   <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">3.</span>
    <span class="text-white font-semibold text-[12px]">
      Artikul: {{order.customerId.artikul}}
    </span>
  </li>
    <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">4.</span>
    <span class="text-white font-semibold text-[12px]">
      Daraja: {{order.customerId.position}}
    </span>
  </li>
    <li 
    class="w-auto p-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">5.</span>
    <span class="text-white font-semibold text-[12px]">
      Reyting : {{order.customerId.ratings ? order.customerId.ratings : 0 }}
    </span>
  </li>
   <li 
    class="w-auto p-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">6.</span>
    <span class="text-white font-semibold text-[12px]">
      Passport : {{order.customerId.passportNumber ? order.customerId.passportNumber : '-' }}
    </span>
  </li>
   <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">7.</span>
    <span class="text-white font-semibold text-[12px]">
      INN : {{order.customerId.inn ? order.customerId.inn : '-' }}
    </span>
  </li>

    <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">8.</span>
    <span class="text-white font-semibold text-[12px]">
      Viloyat : {{order.customerId.address.region ? order.customerId.address.region : '-' }}
    </span>
  </li>
    <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">9.</span>
    <span class="text-white font-semibold text-[12px]">
      Tuman : {{order.customerId.address.district ? order.customerId.address.district : '-' }}
    </span>
  </li>
   <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">10.</span>
    <span class="text-white font-semibold text-[12px]">
      Mahalla : {{order.customerId.address.neighborhood ? order.customerId.address.neighborhood : '-' }}
    </span>
  </li>
  <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">11.</span>
    <span class="text-white font-semibold text-[12px]">
      Ko'cha : {{order.customerId.address.street ? order.customerId.address.street : '-' }}
    </span>
  </li>
  <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">12.</span>
    <span class="text-white font-semibold text-[12px]">
     Uy : {{order.customerId.address.house ? order.customerId.address.house : '-' }}
    </span>
  </li>
  <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">12.</span>
    <span class="text-white font-semibold text-[12px]">
     Kordinata : {{order.customerId.location.lat ? order.customerId.location.lat : '-' }} - {{order.customerId.location.long ? order.customerId.location.long : '-' }}
    </span>
  </li>
   <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">13.</span>
    <span class="text-white font-semibold text-[12px]">
     Telefon : {{order.customerId.phoneNumber ? order.customerId.phoneNumber : '-' }}
    </span>
  </li>
   <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">14.</span>
    <span class="text-white font-semibold text-[12px]">
     Email : {{order.customerId.email ? order.customerId.email : '-' }}
    </span>
  </li>
    <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">15.</span>
    <span class="text-white font-semibold text-[12px]">
     Telegram : {{order.customerId.telegram ? order.customerId.telegram : '-' }}
    </span>
  </li>
     <li 
    class="w-auto p-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">16.</span>
    <span class="text-white font-semibold text-[12px]">
     Registratsiya :    {{
                order.customerId.registeredAt 
                  ? moment
                      .utc( order.customerId.registeredAt ) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}
    </span>
  </li>
   <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">17.</span>
    <span class="text-white font-semibold text-[12px]">
     Holati : {{order.customerId.status ? order.customerId.status : '-' }}
    </span>
  </li>

    <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">18.</span>
    <span class="text-white font-semibold text-[12px]">
    Buyurtmani yetkazib berish muddati :    {{
                order.deliveryTime 
                  ? moment
                      .utc( order.deliveryTime ) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}
    </span>
  </li>

     <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">18.</span>
    <span class="text-white font-semibold text-[12px]">
    Buyurtma qabul qilingan vaqti :    {{
                order.driverAcceptedTime 
                  ? moment
                      .utc( order.driverAcceptedTime ) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}
    </span>
  </li>
    <li 
    class="w-auto p-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">19.</span>
    <span class="text-white font-semibold text-[12px]">
    Buyurtma yetkazilgan vaqti :    {{
                order.driverArrivedTime 
                  ? moment
                      .utc( order.driverArrivedTime ) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}
    </span>
  </li>

    <li 
    class="w-auto p-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-md shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center"
  >
    <span class="text-white font-semibold text-[12px] mr-2">20.</span>
    <span class="text-white font-semibold text-[12px]">
    Jami buyurtmalari soni :    {{
                order.customerId.totalOrders 
                  ? order.customerId.totalOrders
                  : "0"
              }}
    </span>
  </li>
</ul>



          </div>
          <!-- //  Buyurtma ma’lumotlari -->
          <div
            class="mb-1 col-span-6 bg-[#e8eded] p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="bg-slate-100 font-semibold text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Buyurtma ma'lumotlari
            </h1>
            <div class="grid grid-cols-12 gap-1"></div>

            <el-table
              :header-cell-style="{
                background: '#e8ed90',
                border: '0.2px solid #e1e1e3',
              }"
              load
              style="font-size: 12px"
              size="small"
              class="w-full mt-2"
              header-align="center"
              empty-text="Mahsulot qo'shilmagan... "
              border
              height="160"
              :data="order.products"
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
                prop="pro_type"
                label="Turi"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-red-500">
                    {{ row.pro_type }}
                  </div></template
                ></el-table-column
              >
              <el-table-column
                prop="pro_name"
                label="Nomi"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              />

              <el-table-column
                prop="pro_quantity"
                label="Miqdori"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-green-600">
                    {{ formatPrice(row.pro_quantity) }} {{ row.pro_unit }}
                  </div></template
                ></el-table-column
              >
              <el-table-column
                prop="pro_price"
                label="Narxi (sum)"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
              >
                <template #default="{ row }"
                  ><div class="text-red-600">
                    {{ formatPrice(row.pro_price) }} sum
                  </div></template
                ></el-table-column
              >

              <el-table-column
                prop="pro_total_price"
                label="Jami (sum)"
                :min-width="100"
                :max-width="400"
                header-align="center"
                align="center"
                ><template #default="{ row }"
                  ><div class="text-purple-600">
                    {{ formatPrice(row.pro_total_price) }} sum
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
            <div class="bg-white p-2 rounded-md flex justify-end">
              <div
                class="mb-1 col-span-12 w-full flex justify-end text-purple-600 font-semibold bg-purple-100 rounded-md p-2"
              >
                Jami :
                {{ formatPrice(order.totalAmount) }} sum
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end bg-[#e8eded] p-2 rounded">
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
