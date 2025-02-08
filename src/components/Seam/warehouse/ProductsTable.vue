<script setup>
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const permissions = ref(JSON.parse(Cookies.get("account")).permissions);
const actions = ref(JSON.parse(Cookies.get("account")).actions);
import { format } from "date-fns";
import { ref, onMounted } from "vue";
import AddToFormModal from "../../../components/Seam/warehouse/AddToFormModal.vue";
import { SeamWarehouseStore } from "../../../stores/Seam/Warehouse/warehouse.store";
const store_warehouse = SeamWarehouseStore();
import { HelpersStore } from "../../../stores/Helpers/helper.store";
const store_heloers = HelpersStore();
import { storeToRefs } from "pinia";
const { form_modal, model, items, total_product } =
  storeToRefs(store_warehouse);
const currentPage = ref(1);
const handleCurrentChange = (page) => {
  store_warehouse.GetAll({ page, status: 1, limit: 10 });
  currentPage.value = page;
};
const AddForm = async (id) => {
  await store_warehouse.AddFormModal(id);
};
const GetOne = async (id) => {
  await store_warehouse.GetOne(id);
};
onMounted(async () => {
  await store_warehouse.GetAll();
});
</script>
<template>
  <AddToFormModal />
  <div class="">
    <div class="">
      <div
        v-if="
          role === 1000 ||
          (role === 5 && permissions.includes('seam raw warehouse'))
        "
        class="flex justify-end bg-white p-1 rounded"
      >
        <div></div>
        <el-button
          @click="AddForm()"
          size="small"
          style="
            background-color: #36d887;
            color: white;
            border: none;
            padding: 14px;
          "
        >
          <i class="mr-2 fa-solid fa-plus fa-sm"></i>Masulot qo'shish</el-button
        >
      </div>
      <div class="rounded text-[11px]">
        <el-table
          :header-cell-style="{
            background: '#e8eded',
            border: '0.2px solid #e1e1e3',
          }"
          load
          style="font-size: 12px"
          size="small"
          class="w-full"
          header-align="right"
          :min-height="200"
          :max-height="450"
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
            prop="order_number"
            label="Buyurtma nomeri"
            :min:width="200"
            :max:width="300"
            header-align="center"
            align="center"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="customer_name"
            label="Buyurtmachi"
            :min:width="200"
            :max:width="300"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="artikul"
            label="Artikul"
            :min:width="200"
            :max:width="300"
          />
          <el-table-column
            fixed="right"
            prop="quantity"
            label="Miqdori"
            :min:width="200"
            :max:width="300"
            header-align="center"
            align="center"
            ><template #default="scope"
              ><div class="text-red-500">
                {{ scope.row.quantity }}
              </div></template
            ></el-table-column
          >

          <el-table-column
            label="Yuborilgan vaqti"
            width="190"
            header-align="center"
            align="center"
            ><template #default="scope">{{
              format(scope.row.createdAt, "dd.MM.yyyy HH:mm")
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
                @click="GetOne(scope.row._id)"
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
                <i class="text-black fa-trash fa-solid fa-plus fa-sm"></i>
              </router-link>
              <router-link
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
                class="inline-flex items-center ml-2 text-red hover:bg-red-600 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-black fa-trash fa-solid fa-trash fa-sm"></i>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div
          class="flex justify-between flex-wrap font-semibold text-[12px] p-1 shadow border-b-[1px] border-[#36d887]"
        >
          <div
            class="sticky flex justify-between bg-white pr-2 pl-2 w-full mx-auto"
          >
            <div class="flex gap-2">
              <div
                class="my-2 text-[11px] items-center font-medium text-center text-white"
              >
                <el-input
                  clearable
                  size="smal"
                  type="String"
                  placeholder="Partya nomer bo'yicha..."
                  style="width: 150px; font-size: 12px"
                />
              </div>

              <div
                class="my-2 text-[11px] items-center font-medium text-center text-white"
              >
                <el-input
                  clearable
                  size="smal"
                  type="String"
                  placeholder="Yil bo'yicha..."
                  style="width: 150px; font-size: 12px"
                />
              </div>

              <router-link
                @click="ExportExcel()"
                to=""
                class="py-[7px] my-2 px-5 rounded text-[11px] items-center text-center font-bold bg-gray-700 text-white"
              >
                <i class="fa-solid fa-file-excel mr-2 fa-xm"></i>
                Excel
              </router-link>
            </div>

            <div class="block pt-3">
              <el-pagination
                small
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="10"
                layout="prev, pager, next"
                :total="total_product"
              >
              </el-pagination>
            </div>
          </div>
        </div>
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
