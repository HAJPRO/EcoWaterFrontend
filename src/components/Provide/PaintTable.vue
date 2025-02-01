<script setup>
import { ProvidePlanStore } from "../../stores/Provide/provideStore.js";
const store_provide = ProvidePlanStore();
import { storeToRefs } from "pinia";
const { items, is_active } = storeToRefs(store_provide);
const OpenModalById = async (id) => {
  await store_provide.openModalById({ id });
};
const DetailModal = (id) => {
  store_provide.DetailModal({ id, department: 2 });
};
</script>
<template>
  <div v-if="is_active === 1" class="shadow-md rounded min-h-[15px]">
    <el-table
      :header-cell-style="{
        background: '#e8eded',
        border: '0.2px solid #e1e1e3',
      }"
      size="small"
      show-header="true"
      load
      class="w-full"
      header-align="center"
      empty-text="Mahsulot tanlanmagan... "
      :data="items"
      border="true"
      style="width: 100%; font-size: 12px"
      min-height="300"
      max-height="350"
    >
      <el-table-column
        header-align="center"
        align="center"
        type="index"
        prop="index"
        fixed="left"
        label="№"
        :max-width="80"
        :min-width="60"
      />
      <el-table-column
        header-align="center"
        prop="department"
        label="Bo'lim"
        :max-width="300"
        :min-width="150"
        align="center"
      />
      <el-table-column
        header-align="center"
        prop="username"
        label="Xodim"
        :max-width="300"
        :min-width="150"
        align="center"
      />
      <el-table-column
        header-align="center"
        prop="customer_name"
        label="Buyurtmachi"
        :max-width="300"
        :min-width="150"
        align="center"
      />
      <el-table-column
        header-align="center"
        prop="artikul"
        label="Artikul"
        :max-width="300"
        :min-width="150"
        align="center"
      />
      <el-table-column
        header-align="center"
        prop="order_number"
        label="Buyurtma nomeri"
        :max-width="300"
        :min-width="150"
        align="center"
      />
      <el-table-column
        fixed="right"
        label="Muddati"
        :max-width="300"
        :min-width="150"
        header-align="center"
        align="center"
        ><template #default="scope">
          <div class="text-red-500">
            {{ String(scope.row.delivery_time_provide).substring(0, 10) }}
          </div>
        </template></el-table-column
      >
      <el-table-column
        fixed="right"
        prop="status"
        label="Holati"
        :max-width="300"
        :min-width="150"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            to=""
            class="inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
          >
            {{ scope.row.status }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="id"
        label=""
        :max-width="200"
        :min-width="100"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            @click="DetailModal(scope.row._id)"
            to=""
            class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
          >
            <i class="text-black fa-check fa-solid fa-xs"></i>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
