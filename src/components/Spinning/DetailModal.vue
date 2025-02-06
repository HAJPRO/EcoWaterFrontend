<script setup>
import { format } from "date-fns";
import { onMounted, ref } from "vue";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { SpinningPlanStore } from "../../stores/Spinning/spinningPlan.store";
const spinning_store = SpinningPlanStore();
import { storeToRefs } from "pinia";
const { detail, is_detail_modal, is_report } = storeToRefs(spinning_store);
const AcceptAndCreate = () => {
  spinning_store.AcceptAndCreate();
};
const ProvideModal = () => {
  spinning_store.ProvideModal();
};
const ReportModal = () => {
  spinning_store.ReportModal();
  s;
};
onMounted(async () => {
  try {
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
});
</script>

<template>
  <el-dialog v-model="is_detail_modal" width="1000">
    <span>
      <div class="mt-3 grid grid-cols-12 gap-2">
        <div
          v-if="detail.order_number"
          class="col-span-3 min-h-[200px] max-h-[300px] shadow-md rounded-md bg-white text-center text-slate-500 font-semibold text-[13px] p-4 cursor-pointer border-t-[1px] border-b-[1px] border-[#36d887]"
        >
          <div class="bg-[#e8eded] p-2 rounded">
            Buyurtma nomeri: {{ detail.order_number }}
          </div>
          <div class="mt-2 bg-[#e8eded] p-2 rounded">
            Buyurtmachi: {{ detail.customer_name }}
          </div>
          <div class="mt-2 bg-[#e8eded] p-2 rounded">
            Artikul: {{ detail.artikul }}
          </div>
          <div class="mt-2 bg-[#e8eded] p-2 rounded">
            Muddati:
            {{
              format(
                detail.delivery_time_spinning
                  ? detail.delivery_time_spinning
                  : detail.delivery_time_weaving,
                "dd.MM.yyyy HH:mm"
              )
            }}
          </div>
        </div>
        <div class="col-span-9 shadow-md bg-white rounded min-h-[15px]">
          <el-table
            :data="
              detail.spinning_products
                ? detail.spinning_products
                : detail.weaving_products
            "
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            class="w-full"
            header-align="center"
            style="width: 100%; font-size: 12px"
            empty-text="Mahsulot tanlanmagan... "
            border="true"
            height="150"
            size="small"
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
              prop="yarn_name"
              label="Ip nomi"
              :min-width="150"
              :max-width="200"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="yarn_type"
              label="Ip turi"
              :min-width="150"
              :max-width="200"
              header-align="center"
              align="center"
            />

            <el-table-column
              prop="yarn_quantity"
              label="Ip miqdori (kg)"
              :min-width="150"
              :max-width="200"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="likra_type"
              label="Likra turi"
              :min-width="150"
              :max-width="200"
              header-align="center"
              align="center"
              ><template #default="scope"
                ><div>
                  {{ scope.row.likra_type ? scope.row.likra_type : `-` }}
                </div></template
              ></el-table-column
            >
            <el-table-column
              prop="melaks_type"
              label="Melaks ip turi"
              :min-width="150"
              :max-width="200"
              header-align="center"
              align="center"
              ><template #default="scope"
                ><div>
                  {{ scope.row.melaks_type ? scope.row.melaks_type : `-` }}
                </div></template
              ></el-table-column
            >
            <el-table-column
              prop="polister_type"
              label="Polister turi"
              :min-width="150"
              :max-width="200"
              header-align="center"
              align="center"
              ><template #default="scope"
                ><div>
                  {{ scope.row.polister_type ? scope.row.polister_type : `-` }}
                </div></template
              ></el-table-column
            >

            <el-table-column
              prop="id"
              fixed="right"
              :min-width="100"
              :max-width="200"
              header-align="center"
              align="center"
              ><template #default="scope">
                <div>
                  <router-link
                    to=""
                    @click="deleteByIdSpinning(scope.row.id)"
                    class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                  >
                    <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                  </router-link>
                </div> </template
            ></el-table-column>
          </el-table>
          <div class="flex justify-end col-span-10 p-1 mt-1 bg-white">
            <el-button
              v-if="is_report"
              size="smal"
              @click="ReportModal()"
              style="
                background-color: #36d887;
                color: white;
                border: none;
                cursor: pointer;
                padding: 15px;
              "
            >
              <i class="fa-solid fa-plus mr-2 fa-md"></i> Hisobot
            </el-button>
            <el-button
              v-if="is_report === false"
              size="smal"
              @click="ProvideModal()"
              style="
                background-color: #36d887;
                color: white;
                border: none;
                cursor: pointer;
                padding: 15px;
              "
            >
              <i class="fa-solid fa-check mr-2 fa-md"></i> Qabul qilish
            </el-button>
            <el-button
              v-if="is_report === false"
              size="smal"
              @click="Cancel()"
              style="
                background-color: red;
                color: white;
                border: none;
                cursor: pointer;
                padding: 15px;
              "
            >
              <i class="fa-solid fa-xmark mr-2 fa-md"></i> Bekor qilish
            </el-button>
          </div>
        </div>
      </div>
    </span>
    <el-dialog
      v-model="innerVisible"
      width="500"
      title="Inner Dialog"
      append-to-body
    >
      <span>This is the inner Dialog</span>
    </el-dialog>
    <template #footer>
      <div class="dialog-footer"></div>
    </template>
  </el-dialog>
</template>
