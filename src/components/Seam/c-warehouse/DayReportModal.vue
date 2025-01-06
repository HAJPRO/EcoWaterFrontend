<script setup>
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const permissions = ref(JSON.parse(Cookies.get("account")).permissions);
const actions = ref(JSON.parse(Cookies.get("account")).actions);

import { ref } from "vue";
import { SeamInCWarehouseStore } from "../../../stores/Seam/C-Warehouse/c-warehouse.store";
const store_c_warehouse = SeamInCWarehouseStore();
import { storeToRefs } from "pinia";
const { reports, is_modal } = storeToRefs(store_c_warehouse);
const Accept = (id) => {
  store_c_warehouse.Accept(id);
};
</script>
<template>
  <el-dialog
    v-model="is_modal"
    title="Upakovkadan kelgan mahsulotlar"
    width="800"
  >
    <div class="shadow-md rounded">
      <div
        class="flex justify-between flex-wrap font-semibold text-[11px] p-1 bg-slate-100 shadow"
      >
        <div>Party num:</div>
        <div
          class="bg-red-50 p-1 rounded text-[11px] border-[1px] border-red-500"
        >
          Jarayonda
        </div>
        <div>Buyurtmach:</div>
      </div>
      <el-table
        :data="reports.report"
        load
        class="w-full"
        header-align="center"
        hight="5"
        empty-text="Mahsulot tanlanmagan... "
        border
        style="font-size: 12px"
        min-height="200"
        max-height="200"
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
          prop="quantity"
          label="Miqdori"
          width="180"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="unit"
          label="Birligi"
          width="150"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="date"
          label="Vaqti"
          width="150"
          ><template #default="scope">{{
            String(scope.row.date).substring(0, 10)
          }}</template></el-table-column
        >
        <el-table-column
          align="center"
          fixed="right"
          header-align="center"
          label="Holati"
          width="150"
          ><template #default="scope">
            <router-link
              to=""
              class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
            >
              {{ scope.row.status }}
            </router-link></template
          ></el-table-column
        >

        <el-table-column
          fixed="right"
          label=""
          width="80"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <router-link
              v-if="
                scope.row.status === `Skladga yuborildi` &&
                permissions.includes('seam clothes warehouse')
              "
              @click="Accept(scope.$index)"
              to=""
              class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#d7ebeb] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
            >
              <i class="text-red fa-solid fa-check fa-sm"></i>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow"
      >
        <div>Buyurtma: {{ 0 }}</div>
        <div>Bajarildi: {{ reports ? reports.done_packing : 0 }}</div>
        <div>
          Qoldi:
          {{ 0 }}
        </div>
      </div>
    </div>
    <el-dialog
      v-model="innerVisible"
      width="600"
      title="Inner Dialog"
      append-to-body
    >
    </el-dialog>
    <template #footer>
      <div class="dialog-footer"></div>
    </template>
  </el-dialog>
</template>
