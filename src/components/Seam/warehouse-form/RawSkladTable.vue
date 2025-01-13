<script setup>
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const permissions = ref(JSON.parse(Cookies.get("account")).permissions);
const actions = ref(JSON.parse(Cookies.get("account")).actions);

import { ref, onMounted } from "vue";
import { SeamFormWarehouseStore } from "../../../stores/Seam/FormWarehouse/warehouse.store";
const store_form_warehouse = SeamFormWarehouseStore();
const Accept = (id) => {
  store_form_warehouse.AcceptAndCreate(id);
};
// import { HelpersStore } from "../../../stores/Helpers/helper.store";
// const store_heloers = HelpersStore();
import { storeToRefs } from "pinia";
const { items } = storeToRefs(store_form_warehouse);
</script>
<template>
  <AddToFormModal />
  <div class="">
    <div class="">
      <div class="rounded text-[11px]">
        <el-table
          :data="items"
          style="font-size: 12px"
          load
          class="w-full"
          header-align="right"
          header-hight="1"
          max-height="400"
          empty-text="Mahsulot qo'shilmagan... "
          size="small"
          border
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
            prop="warehouse.party_number"
            label="Partya nomeri"
            width="150"
            header-align="center"
            align="center"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="warehouse.customer_name"
            label="Buyurtmachi"
            width="250"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="warehouse.artikul"
            label="Artikul"
            width="100"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="warehouse.material_name"
            label="Mato nomi"
            width="150"
          />
          <el-table-column
            prop="warehouse.color"
            label="Rangi"
            width="100"
            header-align="center"
            align="center"
          />
          <el-table-column
            fixed="right"
            prop="quantity"
            label="Miqdori"
            width="150"
            header-align="center"
            align="center"
            ><template #default="scope"
              ><div class="text-red-500">
                {{ scope.row.quantity }} {{ scope.row.unit }}
              </div></template
            ></el-table-column
          >

          <!-- <el-table-column
            align="center"
            prop="unit"
            label="Birligi"
            width="100"
            header-align="center"
          /> -->
          <el-table-column
            align="center"
            prop="warehouse.sort"
            label="Sorti"
            width="100"
            header-align="center"
          />
          <el-table-column
            prop="transactionDateOutput"
            label="Vaqti"
            width="150"
            header-align="center"
            align="center"
            ><template #default="scope">{{
              String(scope.row.transactionDateOutput).substring(0, 10)
            }}</template></el-table-column
          >
          <el-table-column
            fixed="right"
            label="Holati"
            width="250"
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
            width="100"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <router-link
                @click="Accept(scope.row._id)"
                v-if="
                  (role === 5 &&
                    permissions.includes('seam accountant') &&
                    actions.includes(4)) ||
                  (role === 5 &&
                    permissions.includes('seam raw warehouse') &&
                    actions.includes(4)) ||
                  role === 1000
                "
                to=""
                class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-check fa-solid fa-sm"></i>
              </router-link>
              <!-- <router-link
                v-if="
                  (role === 5 &&
                    permissions.includes('seam accountant') &&
                    actions.includes(4)) ||
                  (role === 5 &&
                    permissions.includes('seam raw warehouse') &&
                    actions.includes(4)) ||
                  role === 1000
                "
                to=""
                class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-solid fa-trash fa-sm"></i>
              </router-link> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<style scoped>
.col_span {
  display: grid;
  grid-column: 7;
}
</style>
