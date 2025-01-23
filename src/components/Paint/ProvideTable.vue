<script setup>
import { ref, onMounted } from "vue";
import { PaintPlanStore } from "../../stores/Paint/paintPlan.store";
const store_paint = PaintPlanStore();
import { storeToRefs } from "pinia";
const { items, is_active } = storeToRefs(store_paint);
const OpenModalById = async (id) => {
  await store_paint.openModalById({ id, is_modal: true });
};
</script>
<template>
  <div class="shadow rounded">
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
        width="60"
      />
      <el-table-column
        header-align="center"
        prop="department"
        label="Bo'lim"
        width="250"
        align="center"
      />
      <el-table-column
        header-align="center"
        prop="delivery_product_box.pus"
        label="Pus"
        width="200"
        align="center"
      />
      <el-table-column
        header-align="center"
        prop="delivery_product_box.fike"
        label="Fike"
        width="200"
        align="center"
      />
      <el-table-column
        prop="delivery_product_box.color"
        label="Rang kod"
        width="180"
        header-align="center"
        align="center"
      />
      <el-table-column
        fixed="right"
        prop="delivery_product_box.color_quantity"
        label="Miqdori(kg)"
        width="180"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="delivery_product_box.delivery_time_provide"
        label="Muddati"
        width="250"
        header-align="center"
        align="center"
      />
      <el-table-column
        fixed="right"
        prop="status"
        label="Holati"
        width="200"
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
        width="150"
        header-align="center"
        align="center"
      >
        <template #default="">
          <router-link
            to=""
            class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
          >
            <i class="text-black fa-trash fa-solid fa-trash fa-xs"></i>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
