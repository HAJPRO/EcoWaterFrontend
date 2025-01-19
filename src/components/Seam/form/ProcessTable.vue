<script setup>
import { ref } from "vue";
import { SeamInFormStore } from "../../../stores/Seam/Form/form.store";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
const { items } = storeToRefs(store_form);
const Report = (id) => {
  store_form.ReportModal(id);
};
</script>
<template>
  <div class="">
    <div class="">
      <div class="rounded text-[11px]">
        <el-table
          style="font-size: 12px"
          size="small"
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
            prop="party_number"
            label="Partya nomeri"
            width="150"
            header-align="center"
            align="center"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="customer_name"
            label="Buyurtmachi"
            width="200"
          />

          <el-table-column
            align="center"
            header-align="center"
            prop="artikul"
            label="Artikul"
            width="200"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="material_name"
            label="Mato nomi"
            width="200"
          />
          <el-table-column
            prop="color"
            label="Rangi"
            width="100"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="sort"
            label="Sort"
            width="100"
            header-align="center"
            align="center"
          />
          <el-table-column
            fixed="right"
            prop="quantity"
            label="Miqdori"
            width="200"
            header-align="center"
            align="center"
            ><template #default="scope">
              <div class="text-red-500">
                {{ scope.row.quantity }} {{ scope.row.unit }}
              </div>
            </template></el-table-column
          >

          <el-table-column
            prop="createdAt"
            label="Vaqti"
            width="200"
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
                @click="Report(scope.row._id)"
                to=""
                class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-plus fa-solid fa-sm"></i>
              </router-link>
              <router-link
                v-if="
                  (role === 5 &&
                    permissions.includes('seam accountant') &&
                    actions.includes(4)) ||
                  (role === 5 &&
                    permissions.includes('form') &&
                    actions.includes(4)) ||
                  role === 1000
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
