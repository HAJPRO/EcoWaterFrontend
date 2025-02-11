<script setup>
import { format } from "date-fns";
import { ref } from "vue";
import { SaleStore } from "../../stores/Sale/sale.store";
const store_sale = SaleStore();
import { storeToRefs } from "pinia";
const { items, all_length } = storeToRefs(store_sale);
const ExportExcel = async (id) => {
  store_sale.ExportExcelById(id);
};
const handleCurrentChange = (page) => {
  store_sale.getAll({ status: 1, page: page, limit: 15 });
};
const isModal = ref(false);
const DetailModal = async (id) => {
  await store_sale.DetailModal(id);
};
const UpdateById = async (id) => {
  await store_sale.UpdateModal(id);
};
const deleteById = async (id) => {
  await store_sale.DeleteById(id);
};
const proccessModalById = async (id) => {
  await store_sale.AllOrderProccessById({ id });
};
</script>
<template>
  <div class="shadow-md rounded min-h-[15px]">
    <el-table
      :header-cell-style="{
        background: '#e8eded',
        border: '0.2px solid #e1e1e3',
      }"
      size="small"
      show-header="true"
      class="w-full"
      header-align="center"
      hight="4"
      style="width: 100%; font-size: 12px"
      empty-text="Mahsulot tanlanmagan... "
      :data="items"
      border="true"
      fit="true"
      min-height="200"
      max-height="680"
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
        label="Buyurtmachi"
        :min-width="150"
        :max-width="300"
      />
      <el-table-column
        align="center"
        header-align="center"
        prop="artikul"
        label="Artikul"
        :min-width="150"
        :max-width="300"
      />

      <el-table-column
        align="center"
        header-align="center"
        prop="order_number"
        label="Buyurtma nomeri"
        :min-width="150"
        :max-width="300"
      />
      <el-table-column
        prop="order_quantity"
        label="Buyurtma miqdori"
        :min-width="150"
        :max-width="300"
        header-align="center"
        align="center"
        ><template #default="scope"
          ><div class="text-red-500">
            {{ scope.row.order_quantity }}
          </div></template
        ></el-table-column
      >

      <el-table-column
        label="Muddati"
        :min-width="150"
        :max-width="300"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          {{ format(scope.row.delivery_time, "dd.MM.yyyy HH:mm") }}
        </template>
      </el-table-column>
      <el-table-column
        label="Tasdiqlangan vaqti"
        :min-width="100"
        :max-width="300"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          {{
            scope.row.received_time
              ? format(scope.row.received_time, "dd.MM.yyyy HH:mm")
              : "-"
          }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="order_status"
        label="Holati"
        :min-width="150"
        :max-width="350"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            to=""
            :class="{ status_bg: scope.row.status === 'Tasdiqlanmagan' }"
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
        width="60"
        header-align="center"
        align="center"
      >
        <template #default="{ row }">
          <!-- Dropdown -->
          <el-dropdown
            trigger="click"
            class="relative"
            :popper-options="{
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: { boundary: 'window' },
                },
              ],
            }"
          >
            <el-button type="text" class="text-sm; text-gray-500">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu slot="dropdown" append-to-body class="z-50">
                <el-dropdown-item
                  class="text-[13px]"
                  @click="DetailModal(row._id)"
                  ><template #default="scope"
                    ><div>
                      <i class="text-black fa-solid fa-check fa-md mr-2"></i
                      >Tasdiqlash
                    </div>
                  </template></el-dropdown-item
                >
                <el-dropdown-item
                  class="text-[13px]"
                  @click="UpdateById(row._id)"
                  ><template #default="{ row }"
                    ><div>
                      <i class="text-black fa-solid fa-pen fa-sm mr-1"></i>
                      Yangilash
                    </div>
                  </template></el-dropdown-item
                >
                <el-dropdown-item
                  class="text-[13px]"
                  @click="proccessModalById(row._id)"
                  ><template #default="{ row }"
                    ><div>
                      <i class="text-black fa-solid fa-eye fa-sm mr-1"></i>
                      Jarayon
                    </div>
                  </template></el-dropdown-item
                >
                <el-dropdown-item
                  class="text-[13px]"
                  @click="ExportExcel(row._id)"
                  ><template #default="{ row }"
                    ><div>
                      <i
                        class="text-black fa-solid fa-file-excel fa-sm mr-1"
                      ></i>
                      Excel
                    </div>
                  </template></el-dropdown-item
                >
                <el-dropdown-item
                  v-if="row.status === 'Tasdiqlanmagan'"
                  @click="deleteById(row._id)"
                  class="text-red-500 text-[13px]"
                >
                  <template #default=""
                    ><div>
                      <i class="text-black fa-solid fa-trash fa-sm mr-1"></i>
                      O'chirish
                    </div>
                  </template>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- // -->
    <div
      class="flex justify-between flex-wrap font-semibold text-[12px] shadow border-b-[1px] border-[#36d887]"
    >
      <div class="flex justify-between bg-white pr-2 pl-2 w-full mx-auto">
        <div class="flex gap-2 my-2 mt-4">
          <div
            class="text-[12px] items-center font-medium text-center text-white"
          >
            <el-input
              clearable
              size="smal"
              type="String"
              placeholder="F.I.O ..."
              style="width: 200px; font-size: 12px"
            />
          </div>
          <router-link
            @click="ExportExcel()"
            to=""
            class="py-[7px] px-5 rounded text-[11px] items-center text-center font-bold bg-gray-700 text-white"
          >
            <i class="fa-solid fa-file-excel mr-2 fa-xm"></i>
            Excel
          </router-link>
        </div>

        <div class="block pt-5">
          <el-pagination
            small
            @current-change="handleCurrentChange"
            :page-size="15"
            layout="prev, pager, next"
            :total="all_length.sale_length"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.status_bg {
  background-color: rgb(243, 147, 147);
  color: white;
}
</style>
