<script setup>
import { ref } from "vue";
import { HRAppealsStore } from "../../../stores/HR/Appeals/appeals.store";
const store_appeals = HRAppealsStore();
import { storeToRefs } from "pinia";
const { items } = storeToRefs(store_appeals);
const ReplyMessageModal = (id) => {
  store_appeals.ReplyMessageModal(id);
};
const Delete = (id) => {
  store_appeals.Delete(id);
};
</script>
<template>
  <div class="">
    <div class="">
      <div class="rounded text-[11px]">
        <el-table
          style="font-size: 12px"
          load
          size="small"
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
            width="80"
          />
          <el-table-column
            prop="message"
            label="Muroajaat matni"
            width="870"
            header-align="center"
            align="center"
          />

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
            width="300"
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
            width="200"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <router-link
                @click="ReplyMessageModal(scope.row._id)"
                to=""
                class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-message fa-solid fa-md"></i>
              </router-link>
              <router-link
                @click="Delete(scope.row._id)"
                to=""
                class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-trash fa-solid fa-trash fa-md"></i>
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
