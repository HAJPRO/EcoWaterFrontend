<script setup>
import { format } from "date-fns";
import { PaintPlanStore } from "../../stores/Paint/paintPlan.store";
const store_paint = PaintPlanStore();
import { storeToRefs } from "pinia";
const { items, is_active } = storeToRefs(store_paint);

const DetailModalProvide = (id) => {
  store_paint.DetailModalProvide({ id, department: 2 });
};
</script>
<template>
  <div v-if="is_active === 5" class="shadow-md rounded min-h-[15px]">
    <el-table
      :header-cell-style="{
        background: '#e8eded',
        border: '0.2px solid #e1e1e3',
      }"
      size="small"
      show-header="true"
      load
      border="true"
      class="w-full"
      header-align="center"
      empty-text="Mahsulot tanlanmagan... "
      :data="items"
      align="center"
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
        prop="customer_name"
        label="Buyurtmachi nomi"
        width="200"
        align="center"
      />
      <el-table-column
        header-align="center"
        prop="order_number"
        label="Buyurtma nomeri"
        width="200"
        align="center"
      />
      <el-table-column
        header-align="center"
        prop="artikul"
        label="Artikul"
        width="200"
        align="center"
      />
      <el-table-column
        header-align="center"
        label="Sotuv"
        width="200"
        align="center"
      >
        <el-table-column
          label="Miqdori"
          width="180"
          header-align="center"
          align="center"
          ><template #default="scope"
            ><div class="text-red-500">
              {{ scope.row.sale_quantity }}
            </div></template
          ></el-table-column
        >
        <el-table-column
          prop="delivery_time"
          label="Muddati"
          width="190"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            {{ format(scope.row.delivery_time_sale, "dd.MM.yyyy HH:mm") }}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        header-align="center"
        label="To'quv"
        width="200"
        align="center"
      >
        <el-table-column
          label="Miqdori"
          width="180"
          header-align="center"
          align="center"
        >
          <template #default="scope"
            ><div class="text-red-500">
              {{ scope.row.weaving_quantity }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Muddati"
          width="190"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            {{ String(scope.row.delivery_time_weaving).substring(0, 10) }}
          </template>
        </el-table-column>
      </el-table-column>

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
            class="inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
          >
            {{ scope.row.provide_status }}
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
          <!-- <router-link
            to=""
            @click="openReportModalById(scope.row._id)"
            class="inline-flex items-center ml-2 text-red hover:bg-[#e1e1e3] font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
          >
            <i class="text-black fa-check fa-solid fa-file-lines fa-xs"></i>
          </router-link> -->
          <router-link
            to=""
            @click="GetOneOrderReport(scope.row._id)"
            class="inline-flex items-center ml-2 text-red hover:bg-[#e1e1e3] font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
          >
            <i class="text-black fa-plus fa-solid fa-file-lines fa-xs"></i>
          </router-link>
          <!-- <router-link
            to=""
            class="inline-flex items-center ml-2 text-red hover:bg-[#e1e1e3] font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
          >
            <i class="text-black fa-trash fa-solid fa-trash fa-xs"></i>
          </router-link> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
