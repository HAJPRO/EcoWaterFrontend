<script setup>
import { ref, onMounted } from "vue";
import { SpinningPlanStore } from "../../stores/Spinning/spinningPlan.store";
const store_spinning = SpinningPlanStore();
import { storeToRefs } from "pinia";
const openModalById = async (id) => {
  await store_spinning.openModalById({ id });
};
const { items, is_active } = storeToRefs(store_spinning);
const DetailModal = async (id) => {
  store_spinning.DetailModal(id);
};
</script>
<template>
  <div class="shadow-md rounded">
    <el-table
      :header-cell-style="{
        background: '#e8eded',
        border: '0.2px solid #e1e1e3',
      }"
      size="small"
      show-header="true"
      load
      border="true"
      header-align="center"
      empty-text="Mahsulot tanlanmagan... "
      :data="items"
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
        align="center"
        header-align="center"
        prop="customer_name"
        label="Buyurtmachi nomi"
        width="250"
      />
      <el-table-column
        align="center"
        header-align="center"
        prop="order_number"
        label="Buyurtma nomeri"
        width="250"
      />
      <el-table-column
        prop="artikul"
        label="Artikul"
        width="200"
        header-align="center"
        align="center"
      />

      <el-table-column
        prop="spinning_quantity"
        label="Miqdori"
        width="250"
        header-align="center"
        align="center"
        ><template #default="scope">
          <div class="text-red-500">{{ scope.row.spinning_quantity }} kg</div>
        </template>
      </el-table-column>
      <el-table-column
        label="Muddati"
        width="250"
        header-align="center"
        align="center"
        ><template #default="scope"
          ><div>
            {{ String(scope.row.delivery_time_spinning).substring(0, 10) }}
          </div></template
        ></el-table-column
      >

      <el-table-column
        fixed="right"
        label="Holati"
        width="200"
        header-align="center"
        align="center"
      >
        <template #default="">
          <router-link
            to=""
            class="inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#e1e1e3] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
          >
            Yigiruvga yuborildi
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="id"
        label=""
        width="200"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            v-show="scope.row.status === `Jarayonda`"
            to=""
            @click="DetailModal(scope.row._id)"
            class="inline-flex items-center ml-2 text-red hover:bg-[#e1e1e3] font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
          >
            <i class="text-black fa-sharp fa-solid fa-check fa-xs"></i>
          </router-link>
          <router-link
            v-show="scope.row.order_status === `To'quvga yuborildi`"
            to=""
            class="inline-flex items-center ml-2 text-red hover:bg-[#e1e1e3] font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
          >
            <i class="text-black fa-trash fa-solid fa-trash fa-xs"></i>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
