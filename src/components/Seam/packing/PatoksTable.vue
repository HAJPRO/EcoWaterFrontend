<script setup>
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const permissions = ref(JSON.parse(Cookies.get("account")).permissions);
const actions = ref(JSON.parse(Cookies.get("account")).actions);
import { ref } from "vue";
import { SeamInPackingStore } from "../../../stores/Seam/Packing/packing.store";
const store_packing = SeamInPackingStore();
import { storeToRefs } from "pinia";
const { items } = storeToRefs(store_packing);
const Confirm = (id) => {
  store_packing.ConfirmAndCreteProcess({ id });
};
</script>
<template>
  <div class="">
    <div class="">
      <div class="rounded text-[11px]">
        <el-table
          style="font-size: 12px"
          load
          class="w-full"
          header-align="right"
          header-hight="1"
          max-height="400"
          empty-text="Mahsulot qo'shilmagan... "
          :data="items"
          border
        >
          <el-table-column
            header-align="center"
            align="center"
            type="index"
            prop="index"
            fixed="left"
            label="№"
            width="50"
          />
          <el-table-column
            prop="warehouse.party_number"
            label="Partya nomeri"
            width="300"
            header-align="center"
            align="center"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="warehouse.customer_name"
            label="Buyurtmachi"
            width="200"
          />

          <el-table-column
            align="center"
            header-align="center"
            prop="warehouse.material_name"
            label="Mato nomi"
            width="200"
          />
          <el-table-column
            prop="warehouse.color"
            label="Rangi"
            width="200"
            header-align="center"
            align="center"
          />

          <el-table-column
            align="center"
            prop="warehouse.sort"
            label="Sorti"
            width="180"
            header-align="center"
          />
          <el-table-column
            prop="createdAt"
            label="Vaqti"
            width="190"
            header-align="center"
            align="center"
            ><template #default="scope">{{
              String(scope.row.createdAt).substring(0, 10)
            }}</template></el-table-column
          >
          <el-table-column
            fixed="right"
            label="Holati"
            width="200"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <router-link
                to=""
                class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
              >
                {{ scope.row.processing }}
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
                v-if="
                  (role === 5 && permissions.includes('packing')) ||
                  role === 1000
                "
                @click="Confirm(scope.row._id)"
                to=""
                class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-check fa-solid fa-sm"></i>
              </router-link>
              <router-link
                v-if="
                  (role === 5 &&
                    permissions.includes('packing') &&
                    actions.includes(4)) ||
                  role === 1000 ||
                  (role === 5 &&
                    permissions.includes('seam accountant') &&
                    actions.includes(4))
                "
                to=""
                class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-trash fa-solid fa-trash fa-sm"></i>
              </router-link>
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
