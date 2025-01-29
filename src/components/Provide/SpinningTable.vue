<script setup>
import { ProvidePlanStore } from "../../stores/Provide/provideStore";
const store_provide = ProvidePlanStore();
import { storeToRefs } from "pinia";
const { data, is_active } = storeToRefs(store_provide);
const OpenModalById = async (id) => {
  await store_provide.openModalById({ id });
};
</script>
<template>
  <div v-if="is_active === 4" class="shadow-md rounded min-h-[15px]">
    <el-table
      :header-cell-style="{
        background: '#e8eded',
        border: '0.2px solid #e1e1e3',
      }"
      size="small"
      load
      class="w-full"
      header-align="center"
      empty-text="Mahsulot tanlanmagan... "
      :data="data"
      border
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
        width="80"
      />
      <el-table-column
        prop="delivery_product_box.latun"
        label="Latun (kg)"
        width="250"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="delivery_product_box.begunok"
        label="Begunok (kg)"
        width="250"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="delivery_product_box.duration_time"
        label="Yetkazish vaqti"
        width="250"
        header-align="center"
        align="center"
      />
      <el-table-column
        fixed="right"
        prop="status"
        label="Holati"
        width="150"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            to=""
            class="inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
          >
            {{ scope.row.status }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="id"
        label=""
        width="150"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            v-if="scope.row.status === `Tasdiqlanmagan`"
            to=""
            @click="OpenModalById(scope.row._id)"
            class="inline-flex items-center mt-4 ml-2 text-red bg-[#eedc36] hover:bg-yellow-400 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
          >
            <i class="text-red fa-solid fa-check fa-xs fa- fa-xs"></i>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
