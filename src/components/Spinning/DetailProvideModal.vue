<script setup>
import { ref } from "vue";
import { SpinningPlanStore } from "../../stores/Spinning/spinningPlan.store";
const store_spinning = SpinningPlanStore();
import { storeToRefs } from "pinia";
const { detail_spinning_modal, detail_provide } = storeToRefs(store_spinning);
</script>
<template>
  <div>
    <el-dialog v-model="detail_spinning_modal" width="1000">
      <span>
        <div class="shadow-md rounded">
          <div
            class="bg-slate-100 font-semibold p-1 mb-1 text-[15px] align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
          >
            Buyurtma ma'lumotlari
          </div>
          <el-table
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            size="small"
            show-header="true"
            load
            class="w-full"
            header-align="center"
            empty-text="Mahsulot tanlanmagan... "
            :data="detail_provide.delivery_product_box"
            border="true"
            style="width: 100%; font-size: 12px"
            :min-height="100"
            :max-height="400"
          >
            <el-table-column
              header-align="center"
              align="center"
              type="index"
              prop="index"
              fixed="left"
              label="№"
              :max-width="80"
              :min-width="60"
            />
            <el-table-column
              header-align="center"
              prop="begunok_name"
              label="Begunok nomi"
              :max-width="200"
              :min-width="150"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="begunok_type"
              label="Begunok turi"
              :max-width="200"
              :min-width="150"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="begunok_quantity"
              label="Begunok miqdori(kg)"
              :max-width="200"
              :min-width="150"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="latun_name"
              label="Latun nomi"
              :max-width="200"
              :min-width="150"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="latun_type"
              label="Latun turi"
              :max-width="200"
              :min-width="150"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="latun_quantity"
              label="Latun miqdori(kg)"
              :max-width="200"
              :min-width="150"
              align="center"
            />

            <el-table-column
              fixed="right"
              label="Muddati"
              :max-width="300"
              :min-width="150"
              header-align="center"
              align="center"
              ><template #default="scope">
                <div class="text-red-500">
                  {{ String(scope.row.delivery_time_provide).substring(0, 10) }}
                </div>
              </template></el-table-column
            >

            <el-table-column
              fixed="right"
              prop="id"
              label=""
              :max-width="200"
              :min-width="100"
              header-align="center"
              align="center"
            >
              <template #default="">
                <router-link
                  to=""
                  class="inline-flex items-center ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
                >
                  <i class="text-black fa-check fa-solid fa-xs"></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </span>

      <el-dialog
        v-model="innerVisible"
        width="600"
        title="Inner Dialog"
        append-to-body
      >
        <span>Cancel And Of Reason</span>
      </el-dialog>
      <template #footer> </template>
    </el-dialog>
  </div>
</template>
