<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";
import { ProductsManagmentStore } from "../../../stores/Sale/products/product.store";
const store_products = ProductsManagmentStore();
import { storeToRefs } from "pinia";
const {  product_detail_modal, product } = storeToRefs(store_products);

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
const printData = ()=> {
   window.print();
}
onMounted(async () => {
  try {
    GetAllCustomers();
  } catch (error) {
    console.log(error);
  }
});
const data = ref(
  {
  productName: "Sharbat Mango",
  productCode: "PRD-2024",
  quantity: 1200,
  totalAmount: 24000000,
  branch: "G'ijduvon tumani filiali",
  source: "Online",
  salesByDate: [
    { date: "2025-05-01", quantity: 300, amount: 6000000 },
    { date: "2025-05-02", quantity: 400, amount: 8000000 },
    { date: "2025-05-03", quantity: 500, amount: 10000000 },
  ]
}

)
</script>
<template>
  <div>
    <el-dialog
      v-model="product_detail_modal"
      :width="dialogWidth"
      :before-close="handleClose"
      class="rounded-md p-4 shadow-lg custom-modal"
    >
      <template #header>
        <div class="flex items-center justify-between border-b pb-1">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-box text-lg text-blue-500"></i>
            <h3 class="text-xl font-semibold text-gray-500">
              Mahsulot nomi {{ product?.pro_name || 'Mahsulot nomi' }}
            </h3>
          </div>
        </div>
      </template>

    <div class="grid 2xl:grid-cols-12 xs:grid-cols-6  gap-2 mt-2 text-sm">
  <!-- Tafsilotlar -->
  <div class="grid grid-cols-12 gap-2  col-span-6 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
    <div class="col-span-6 p-1 bg-slate-200 rounded-md"><strong><i class="fa-solid fa-barcode mr-1 "></i> Kodi:</strong> {{ product?.code }}</div>
    <div class="col-span-6  p-1 bg-slate-200 rounded-md"><strong><i class="fa-solid fa-layer-group mr-1"></i> Kategoriya:</strong> {{ product?.pro_category }}</div>
    <div class="col-span-6 p-1 bg-slate-200 rounded-md"><strong><i class="fa-solid fa-star mr-1"></i> Sifat darajasi:</strong> {{ product?.pro_quality }}</div>
    <div class="col-span-6 p-1 bg-slate-200 rounded-md"><strong><i class="fa-solid fa-tags mr-1"></i> Sotuv turi:</strong> {{ product?.sale_type }}</div>
    <div class="col-span-6 p-1 bg-slate-200 rounded-md">
      <strong><i class="fa-solid fa-calendar-check mr-1"></i> Ishlab chiqarish boshlangan:</strong>
      {{
        product.productionStarteddAt
          ? moment.utc(product.productionStarteddAt).tz('Asia/Tashkent').format('DD.MM.YYYY HH:mm:ss')
          : '-'
      }}
    </div>
      <div class="col-span-6 p-1 bg-slate-200 rounded-md">
      <strong><i class="fa-solid fa-calendar-xmark mr-1"></i> Ishlab chiqarish to'xtatilgan:</strong>
      {{
        product.productionStopeddAt
          ? moment.utc(product.productionStopeddAt).tz('Asia/Tashkent').format('DD.MM.YYYY HH:mm:ss')
          : 'No'
      }}
    </div>
    <div class="col-span-6 p-1 bg-slate-200 rounded-md"><strong><i class="fa-solid fa-boxes-stacked mr-1"></i> Umumiy sotilgan:</strong> {{ data?.quantity }} dona</div>
    <div class="col-span-6 p-1 bg-slate-200 rounded-md"><strong><i class="fa-solid fa-money-bill-wave mr-1"></i> Umumiy tushum:</strong> {{ formatPrice(data?.totalAmount) }}</div>
    <div class="col-span-6 p-1 bg-slate-200 rounded-md"><strong><i class="fa-solid fa-building mr-1"></i> Filial:</strong> {{ data?.branch }}</div>
    <div class="col-span-6 flex items-center gap-2 p-1  bg-slate-200 rounded-md">
      <strong><i class="fa-solid fa-circle-info mr-1"></i> Holati:</strong>
      <el-tag :type="data?.status === 'Aktive' ? 'success' : 'info'" size="small">
        {{ product?.status }}
      </el-tag>
    </div>
  </div>

  <!-- Sotuvlar jadvali -->
  <div class=" col-span-6 bg-white border rounded-lg shadow-sm overflow-hidden">
    <div class="bg-gradient-to-r from-green-500 to-indigo-500 text-white px-4 py-2">
      <i class="fa-solid fa-calendar-days mr-2"></i> 🗓 Sotuv kunlari
    </div>
    <el-table :data="data?.salesByDate" size="small" border stripe highlight-current-row class="rounded-none">
      <el-table-column label="📅 Sana" prop="date" width="120" />
      <el-table-column label="🔢 Soni" prop="quantity" width="80" />
      <el-table-column label="💵 Tushum" prop="amount" :formatter="row => formatPrice(row.amount)" />
    </el-table>
  </div>
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
              class="mb-1 col-span-3 w-auto text-center text-white text-[13px] font-semibold bg-red-600 rounded-[4px] px-4 py-[5px] hover:bg-red-700"
              @click="driverBindingModal(order._id)"
            >
              <i class="fa-solid fa-xmark mr-2 fa-md"></i> Bekor qilish
            </div>
            <div
              class="mb-1 col-span-3 w-auto text-center text-white text-[13px] font-semibold bg-green-500 rounded-[4px] px-4 py-[5px] hover:bg-green-600"
              @click="printData()"
            >
              <i class="fa-solid fa-print mr-2 fa-md"></i> Chop etish
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
