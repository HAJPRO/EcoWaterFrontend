<script setup>
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const permissions = ref(JSON.parse(Cookies.get("account")).permissions);
const actions = ref(JSON.parse(Cookies.get("account")).actions);

import { ref, onMounted } from "vue";
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
import { OrderManagmentStore } from "../../../stores/Sale/orders/orders.store";

import OrderModal from "../../../components/Sale/orderes/AddOrderModal.vue";
import DetailOrderModal from "../../../components/Sale/orderes/DetailOrderModal.vue";

import moment from "moment-timezone";

const store = CustomerManagmentStore();
const store_order = OrderManagmentStore();

import { storeToRefs } from "pinia";

  const { orders, all_length, customers, model, isActive } =
  storeToRefs(store_order);
  const {  } =
  storeToRefs(store);

const AddCustomModal =  () => {
  store_order.AddOrderModal()
   store.GetAll({status : 0});
}
const detailOrderModal =  (id) => {
  store_order.DetailOrderModal({id})
}
const handleCurrentChange = (page) => {
  
  store_order.GetAll({status : isActive.value, page : page, limit:5});
};
const deleteById = (id) => {
  store.DeleteById({id});
};
const UpdateById = (id) => {
  store.GetById({id});
};
const formatPrice = (price) => {
  return new Intl.NumberFormat("uz-UZ").format(price);
};
onMounted(()=>{
  // GetAllCustomers()
})
</script>
<template>
<OrderModal/>
<DetailOrderModal/>
  <div class="">
    <div class="">
      <div class="rounded-md text-[11px]">
        <el-table
          :header-cell-style="{
            background: '#e8eded',
            border: '0.2px solid #e1e1e3',
          }"
          load
          style="font-size: 12px"
          size="small"
          class="w-full"
          header-align="right"
          :max-height="600"
          empty-text="Mahsulot qo'shilmagan... "
          :data="orders"
          border
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
            prop="orderNumber"
            label="Buyurtma nomeri"
            :min-width="100"
            :max-width="400"
            header-align="center"
            align="center"
          ><template #default="{row}"><div class="text-red-500 font-semibold">{{row.orderNumber}}</div></template></el-table-column>
          <el-table-column
            prop="fullname"
            label="F.I.O"
            :min-width="100"
            :max-width="400"
            header-align="center"
            align="center"
          > <template #default="{row}">{{row.customerId.fullname}}</template></el-table-column>
          <el-table-column
            align="center"
            header-align="center"
            prop="customerId.artikul"
            label="Artikul"
            :min-width="100"
            :max-width="400"
          />
            <el-table-column
            label="Kategoriyasi"
          :min-width="150"
          :max-width="400"
            header-align="center"
            align="center"
            ><template #default="scope">{{
             scope.row.customerId.category
            }}</template></el-table-column
          >
           <el-table-column
            align="center"
            header-align="center"
            prop="customerId.address.region"
            label="Viloyat"
            :min-width="100"
            :max-width="400"
          />
            <el-table-column
            align="center"
            header-align="center"
            prop="customerId.address.district"
            label="Tuman"
            :min-width="100"
            :max-width="400"
          />
           <el-table-column
            align="center"
            header-align="center"
            prop="customerId.address.neighborhood"
            label="Mahalla"
            :min-width="100"
            :max-width="400"
          />
             <el-table-column
            align="center"
            header-align="center"
            prop="customerId.address.street"
            label="Ko'cha"
            :min-width="100"
            :max-width="400"
          />
           <el-table-column
            align="center"
            header-align="center"
            prop="customerId.phoneNumber"
            label="Telefon"
            :min-width="100"
            :max-width="400"
          />

       
        
           <el-table-column
            label="Bonus ball"
            :min-width="100"
            header-align="center"
            align="center"
            ><template #default="scope">{{ 
             0
            }}</template></el-table-column
          >
             <el-table-column
            label="Jami (sum)"
            :min-width="100"
            header-align="center"
            align="center"
            ><template #default="{row}">  <div class="text-red-500 font-semibold">{{ 
        row.totalAmount ?  formatPrice(row.totalAmount) : 0
            }} sum</div></template></el-table-column
          >
           <el-table-column  label="🕒 Vaqt maydoni"
          :min-width="150"
          :max-width="400"
            header-align="center"
            align="center">
             <el-table-column
            label="Yaratilgan"
          :min-width="150"
          :max-width="400"
            header-align="center"
            align="center"
            ><template #default="scope">
                <div class="text-gray-900 font-semibold">
               {{
                scope.row.createdAt
                  ? moment
                      .utc( scope.row.createdAt) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}
                </div>
            
            </template></el-table-column
          >
              <el-table-column
            label="Yetkazish muddati"
          :min-width="150"
          :max-width="400"
            header-align="center"
            align="center"
            ><template #default="scope">
                <div class="text-blue-600 font-semibold">
               {{
                scope.row.deliveryTime
                  ? moment
                      .utc( scope.row.deliveryTime) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}
                </div>
            
            </template></el-table-column
          >
              <el-table-column
            label="Haydovchiga yuborildi"
          :min-width="150"
          :max-width="400"
            header-align="center"
            align="center"
            ><template #default="scope">
                <div class="text-yellow-600 font-semibold">
               {{
                scope.row.driverSentToTime
                  ? moment
                      .utc( scope.row.driverSentToTime) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}
                </div>
            </template></el-table-column
          >
               <el-table-column
            label="Haydovchi qabul qildi "
          :min-width="150"
          :max-width="400"
            header-align="center"
            align="center"
            ><template #default="scope">
               <div class="text-purple-600 font-semibold">
               {{
                scope.row.driverAcceptedTime
                  ? moment
                      .utc( scope.row.driverAcceptedTime) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}
               </div>
            
            </template></el-table-column
          >
                  <el-table-column
            label="Yetkazib berildi"
          :min-width="150"
          :max-width="400"
            header-align="center"
            align="center"
            ><template #default="scope">
              <div class="text-green-600 font-semibold">
               {{
                scope.row.driverArrivedTime
                  ? moment
                      .utc( scope.row.driverArrivedTime) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}</div>
            
            </template></el-table-column
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Holati"
            :min-width="170"
              :max-width="400"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <router-link
                to=""
                class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
              >
                {{ scope.row.status }}
              </router-link>
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
                  <el-dropdown-menu slot="dropdown" append-to-body class="z-50">
                    <el-dropdown-item
                      class="text-[13px] text-green-600"
                      @click="detailOrderModal(row._id)"
                      ><template #default=""
                        ><div>
                          <i class="text-black fa-solid fa-eye fa-sm mr-2"></i
                          >Batafsil 
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
                      @click="deleteById(row._id)"
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
        <div
          class="flex justify-between flex-wrap font-semibold text-[11px] p-1 shadow border-b-[1px] border-[#36d887]"
        >
          <div
            class="sticky flex justify-between flex-wrap bg-white pr-2 pl-2 w-full mx-auto"
          >
            <div class="flex gap-2 flex-wrap">
              <div
                class="my-2 text-[11px] items-center font-medium text-center text-white"
              >
                <el-input
                  clearable
                  size="smal"
                  type="String"
                  placeholder="Arikul bo'yicha..."
                  style="width: 150px; font-size: 12px"
                />
              </div>

              <div
                class="my-2 text-[11px] items-center font-medium text-center text-white"
              >
                <el-input
                  clearable
                  size="smal"
                  type="String"
                  placeholder="Yil bo'yicha..."
                  style="width: 150px; font-size: 12px"
                />
              </div>

              <el-select placeholder="Excel" class="w-32 my-2">
                <el-option @click="ExportExcel()" label="Excel" value="excel">
                  <i class="fa-solid fa-file-excel mr-2 fa-xm"></i
                  >Excel</el-option
                >
                <el-option label="Pdf" value="pdf">
                  <i class="fa-solid fa-file-pdf mr-2 fa-xm"></i>Pdf</el-option
                >
                <el-option label="Word" value="word">
                  <i class="fa-solid fa-file-word mr-2 fa-xm"></i
                  >Word</el-option
                >
              </el-select>
              <div class="mt-2.5">
                <el-button
                  @click="AddCustomModal()"
                  size="small"
                  style="
                    background-color: #36d887;
                    color: white;
                    border: none;
                    padding: 15px;
                  "
                >
                  <i class="mr-2 fa-solid fa-plus fa-sm"></i>Buyurtma
                  qo'shish</el-button
                >
              </div>
            </div>

            <div class="block pt-3">
              <!-- Pagination -->
              <el-pagination
                small
                @current-change="handleCurrentChange"
                :page-size="5"
                layout="prev, pager, next"
                :total="all_length.all"
                class="custom-pagination"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.col_span {
  display: grid;
  grid-column: 7;
}
.custom-pagination .el-pager li.is-active {
  background-color: #36d887 !important;
  color: white !important;
  border-radius: 5px;
}
</style>