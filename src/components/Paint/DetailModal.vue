<script setup>
import { onMounted, ref } from "vue";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { PaintPlanStore } from "../../stores/Paint/paintPlan.store";
const store_paint = PaintPlanStore();
import { storeToRefs } from "pinia";
const { detail, is_detail_modal, is_report } = storeToRefs(store_paint);
// const AcceptAndCreate = () => {
//   store_paint.AcceptAndCreate();
// };
const ProvideModal = () => {
  store_paint.ProvideModal();
};
const ReportModal = () => {
  store_paint.ReportModal();
};
onMounted(async () => {
  try {
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
});
</script>

<template>
  <el-dialog v-model="is_detail_modal" width="1200">
    <span>
      <div class="mt-3 grid grid-cols-12 gap-2">
        <div
          v-if="is_report === true"
          class="col-span-12 shadow-md bg-white rounded min-h-[15px]"
        >
          <div
            class="bg-slate-100 font-semibold p-1 mb-1 text-[15px] align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
          >
            To'quv talabnoma jadvali
          </div>
          <div
            v-if="detail.order_number"
            class="flex justify-between text-[11px] font-semibold"
          >
            <div class="">Buyurtma nomeri: {{ detail.order_number }}</div>
            <div class="">Buyurtmachi: {{ detail.customer_name }}</div>
            <div class="">Artikul: {{ detail.artikul }}</div>
            <div class="">
              Muddati:
              {{ String(detail.delivery_time).substring(0, 10) }}
            </div>
          </div>
          <el-table
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            style="font-size: 12px"
            size="small"
            class="w-full"
            header-align="center"
            empty-text="Mahsulot tanlanmagan... "
            :data="detail.sale_products"
            border="true"
            height="150"
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
              prop="material_name"
              label="Mato nomi"
              width="300"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="material_type"
              label="Mato turi"
              width="250"
              header-align="center"
              align="center"
            />
            <el-table-column
              fixed="right"
              label="Miqdori"
              width="250"
              header-align="center"
              align="center"
              ><template #default="scope"
                ><div class="text-red-500">
                  {{ String(scope.row.sale_quantity).substring(0, 10) }}
                </div></template
              ></el-table-column
            >

            <el-table-column
              label="Muddati"
              width="200"
              header-align="center"
              align="center"
              ><template #default="scope"
                ><div class="">
                  {{ String(scope.row.delivery_time_weaving).substring(0, 10) }}
                </div></template
              ></el-table-column
            >

            <el-table-column
              fixed="right"
              prop="id"
              label=""
              width="120"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                <router-link
                  to=""
                  @click="deleteById(scope.row.id)"
                  class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                >
                  <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="col-span-12 shadow-md bg-white rounded min-h-[15px]">
          <div
            class="bg-slate-100 font-semibold p-1 mb-1 text-[15px] align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
          >
            Bo'yoq talabnoma jadvali
          </div>
          <div
            v-if="detail.order_number"
            class="flex justify-between text-[11px] font-semibold"
          >
            <div class="">Buyurtma nomeri: {{ detail.order_number }}</div>
            <div class="">Buyurtmachi: {{ detail.customer_name }}</div>
            <div class="">Artikul: {{ detail.artikul }}</div>
            <div class="">
              Muddati:
              {{ String(detail.delivery_time).substring(0, 10) }}
            </div>
          </div>
          <el-table
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            style="font-size: 12px"
            size="small"
            class="w-full"
            header-align="center"
            empty-text="Mahsulot tanlanmagan... "
            :data="detail.sale_products"
            border="true"
            height="150"
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
              prop="material_name"
              label="Nomi"
              width="200"
              header-align="center"
              align="center"
            />

            <el-table-column
              prop="material_type"
              label="Turi"
              width="200"
              header-align="center"
              align="center"
            />

            <el-table-column
              prop="color"
              label="Rangi"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="width"
              label="Eni"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="grammage"
              label="Grammage"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              fixed="right"
              label="Miqdori"
              width="150"
              header-align="center"
              align="center"
              ><template #default="scope"
                ><div class="text-red-500">
                  {{ scope.row.order_quantity }} {{ scope.row.unit }}
                </div></template
              ></el-table-column
            >

            <el-table-column
              fixed="right"
              prop="id"
              label=""
              width="120"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                <router-link
                  to=""
                  @click="deleteById(scope.row.id)"
                  class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                >
                  <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end col-span-10 p-1 mt-1 bg-white">
            <el-button
              v-if="is_report === true"
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
