<script setup>
import { ref } from "vue";
import { SaleStore } from "../../stores/Sale/sale.store";
const store_sale = SaleStore();
import { storeToRefs } from "pinia";
const { items } = storeToRefs(store_sale);
const ExportExcel = async (id) => {
  store_sale.ExportExcelById(id);
};
const isModal = ref(false);

const DetailModal = async (id) => {
  await store_sale.DetailModal(id);
};
const deleteById = async (id) => {
  await store_sale.DeleteById(id);
};
const proccessModalById = async (id) => {
  await store_sale.AllOrderProccessById({ id });
};
</script>
<template>
  <div class="shadow-md rounded min-h-[15px]">
    <el-table
      :header-cell-style="{
        background: '#e8eded',
        border: '0.2px solid #e1e1e3',
      }"
      size="small"
      show-header="true"
      class="w-full"
      header-align="center"
      hight="4"
      style="width: 100%; font-size: 12px"
      empty-text="Mahsulot tanlanmagan... "
      :data="items"
      border="true"
      fit="true"
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
        :min-width="60"
        :max-width="80"
      />

      <el-table-column
        align="center"
        header-align="center"
        prop="customer_name"
        label="Buyurtmachi"
        :min-width="200"
        :max-width="300"
      />
      <el-table-column
        align="center"
        header-align="center"
        prop="artikul"
        label="Artikul"
        :min-width="200"
        :max-width="300"
      />

      <el-table-column
        align="center"
        header-align="center"
        prop="order_number"
        label="Buyurtma nomeri"
        :min-width="200"
        :max-width="300"
      />
      <el-table-column
        prop="order_quantity"
        label="Miqdori"
        :min-width="200"
        :max-width="300"
        header-align="center"
        align="center"
        ><template #default="scope"
          ><div class="text-red-500">
            {{ scope.row.order_quantity }}
          </div></template
        ></el-table-column
      >

      <el-table-column
        label="Muddati"
        :min-width="200"
        :max-width="300"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          {{ String(scope.row.delivery_time).substring(0, 10) }}
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        prop="order_status"
        label="Holati"
        :min-width="250"
        :max-width="350"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            to=""
            @click="statusModalById(scope.row._id)"
            :class="{ status_bg: scope.row.status === 'Tasdiqlanmagan' }"
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
        :min-width="250"
        :max-width="300"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            to=""
            @click="DetailModal(scope.row._id)"
            class="inline-flex items-center mt-1 ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
          >
            <i class="text-black fa-solid fa-check fa-xs fa- fa-xs"></i>
          </router-link>
          <router-link
            to=""
            @click="proccessModalById(scope.row._id)"
            class="inline-flex items-center mt-1 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
          >
            <i class="text-black fa-sharp fa-solid fa-info fa-xs"></i>
          </router-link>
          <!-- <router-link
            v-show="scope.row.status === 'Tasdiqlanmagan'"
            to=""
            @click="getByIdForUpdate(scope.row._id)"
            class="inline-flex items-center mt-1 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
          >
            <i class="text-black fa-sharp fa-solid fa-edit fa-xs"></i>
          </router-link> -->
          <router-link
            to=""
            @click="deleteById(scope.row._id)"
            class="inline-flex items-center mt-1 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
          >
            <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
          </router-link>
          <router-link
            to=""
            @click="ExportExcel(scope.row._id)"
            class="inline-flex items-center mt-1 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
          >
            <i class="text-black fa-solid fa-file-excel fa-xs"></i>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- // -->
  </div>
</template>
<style scoped>
.status_bg {
  background-color: rgb(243, 147, 147);
  color: white;
}
</style>
