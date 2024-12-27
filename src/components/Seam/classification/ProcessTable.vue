<script setup>
import { ref } from "vue";
import { SeamInClassificationStore } from "../../../stores/Seam/Classification/classification.store";
const store_classification = SeamInClassificationStore();
import { storeToRefs } from "pinia";
const { items } = storeToRefs(store_classification);
const Confirm = (id) => {
  store_classification.ConfirmModal(id);
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
            width="200"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="warehouse.customer_name"
            label="Buyurtmachi"
            width="200"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="warehouse.material_name"
            label="Mato"
            width="200"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="warehouse.color"
            label="Rangi"
            width="200"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="warehouse.sort"
            label="Sort"
            width="200"
            header-align="center"
            align="center"
          />
          <el-table-column
            fixed="right"
            align="center"
            header-align="center"
            prop="form_item.head_pack"
            label="To'p boshi (kg)"
            width="130"
            ><template #default="scope">
              <div
                class="cursor-pointer inline-flex items-center text-red-500 hover:bg-slate-300 font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
              >
                {{ scope.row.form_item.head_pack }}
              </div></template
            ></el-table-column
          >
          <el-table-column
            fixed="right"
            align="center"
            header-align="center"
            prop="form_item.pastal_quantity"
            label="Pastal miqdori (kg)"
            width="140"
            ><template #default="scope">
              <div
                class="cursor-pointer inline-flex items-center text-red-500 hover:bg-slate-300 font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
              >
                {{ scope.row.form_item.pastal_quantity }}
              </div></template
            ></el-table-column
          >

          <el-table-column
            fixed="right"
            align="center"
            header-align="center"
            prop="form_item.waste_quantity"
            label="Atxod miqdori (kg)"
            width="140"
            ><template #default="scope">
              <div
                class="cursor-pointer inline-flex items-center text-red-500 hover:bg-slate-300 font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
              >
                {{ scope.row.form_item.waste_quantity }}
              </div></template
            ></el-table-column
          >
          <el-table-column
            fixed="right"
            prop="form_item.fact_gramage"
            label="Fakt gramaj"
            width="100"
            header-align="center"
            align="center"
            ><template #default="scope">
              <div
                class="cursor-pointer inline-flex items-center text-red-500 hover:bg-slate-300 font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
              >
                {{ scope.row.form_item.fact_gramage }}
              </div>
            </template></el-table-column
          >
          <el-table-column
            label="Vaqti"
            width="100"
            header-align="center"
            align="center"
            ><template #default="scope">{{
              String(scope.row.createdAt).substring(0, 10)
            }}</template></el-table-column
          >
          <el-table-column
            fixed="right"
            label="Holati"
            width="150"
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
                @click="Confirm(scope.row._id)"
                to=""
                class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-check fa-solid fa-sm"></i>
              </router-link>
              <router-link
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
