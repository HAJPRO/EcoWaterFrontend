<script setup>
import { format } from "date-fns";
import { onMounted, ref } from "vue";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { WeavingPlanStore } from "../../stores/Weaving/weaving_plan.store";
const weaving_store = WeavingPlanStore();
import { storeToRefs } from "pinia";
const { detail, is_detail_modal, is_report } = storeToRefs(weaving_store);
const isActive = ref(2);
const ActiveTabLink = (status) => {
  isActive.value = status;
};
const ProvideModal = () => {
  weaving_store.ProvideModal();
};
const ReportModal = () => {
  weaving_store.ReportModal();
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
    <div class="mt-3 grid grid-cols-12 gap-2">
      <div class="col-span-9 grid-flow-col flex-wrap">
        <router-link
          to=""
          v-if="is_report === true"
          @click="ActiveTabLink(1)"
          :class="{ activeTab: isActive === 1 }"
          class="inline-flex text-[13px] items-center mr-2 px-4 py-1 mb-1 text-sm font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
        >
          <i class="fa-solid fa-info mr-2 fa-xm"></i> Yigiruv talabnoma
          <div class="flex flex-shrink-0 ml-2">
            <span
              :class="{ activeTabIcon: isActive === 1 }"
              class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
            >
              {{
                detail.weaving_products ? detail.weaving_products.length : 0
              }}</span
            >
          </div>
        </router-link>
        <router-link
          @click="ActiveTabLink(2)"
          to=""
          :class="{ activeTab: isActive === 2 }"
          class="inline-flex text-[13px] items-center mr-2 px-4 py-1 mb-1 text-sm font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
        >
          <i class="fa-solid fa-info mr-2 fa-xm"></i> Bo'yoq talabnoma
          <div class="flex flex-shrink-0 ml-2">
            <span
              :class="{ activeTabIcon: isActive === 2 }"
              class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
            >
              {{ detail.sale_products ? detail.sale_products.length : 0 }}</span
            >
          </div>
        </router-link>
      </div>
      <div
        v-if="is_report === true && isActive === 1"
        class="col-span-12 shadow-md bg-white rounded min-h-[15px]"
      >
        <div
          class="bg-slate-100 font-semibold p-1 mb-1 text-[15px] align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          Yigiruv talabnoma jadvali
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
            {{ format(detail.delivery_time_spinning, "dd.MM.yyyy HH:mm") }}
          </div>
        </div>
        <el-table
          :data="detail.spinning_products"
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
      </div>
      <div
        v-if="isActive === 2"
        class="col-span-12 shadow-md bg-white rounded min-h-[15px]"
      >
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
            {{
              format(
                detail.delivery_time_weaving
                  ? detail.delivery_time_weaving
                  : detail.delivery_time_paint,
                "dd.MM.yyyy HH:mm"
              )
            }}
          </div>
        </div>
        <el-table
          :data="
            detail.weaving_products
              ? detail.weaving_products
              : detail.paint_products
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
            prop="material_name"
            label="Mato nomi"
            width="200"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="material_type"
            label="Mato turi"
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
            prop="yarn_length"
            label="Ip uzunligi"
            header-align="center"
            align="center"
            :min-width="150"
            :max-width="200"
          />
          <el-table-column
            prop="polister_type"
            label="Polister turi"
            header-align="center"
            align="center"
            :min-width="150"
            :max-width="200"
          />
          <el-table-column
            prop="pus_fiene"
            label="Pus/Fien"
            header-align="center"
            align="center"
            :min-width="150"
            :max-width="200"
          />
          <el-table-column
            prop="color_code"
            label="Rang kod"
            header-align="center"
            align="center"
            :min-width="150"
            :max-width="200"
          />
          <el-table-column
            prop="color_type"
            label="Bo'yoq turi"
            header-align="center"
            align="center"
            :min-width="150"
            :max-width="200"
          />
          <el-table-column
            prop="print"
            label="Pechat"
            header-align="center"
            align="center"
            :min-width="150"
            :max-width="200"
            ><template #default="scope"
              ><div>
                {{ scope.row.print ? scope.row.print : "-" }}
              </div></template
            ></el-table-column
          >
          <el-table-column
            fixed="right"
            prop="raw_material_quantity"
            label="Xom mato miqdori"
            :min-width="150"
            :max-width="200"
            header-align="center"
            align="center"
          />
          <!-- <el-table-column
                prop="delivery_time_weaving"
                label="Muddati"
                :min-width="150"
                :max-width="200"
                header-align="center"
                align="center"
                ><template #default="scope">
                  <div>
                    {{
                      format(
                        scope.row.delivery_time_weaving,
                        "dd.MM.yyyy HH:mm"
                      )
                    }}
                  </div>
                </template></el-table-column
              > -->
          <el-table-column
            prop="description"
            label="Tavfsif"
            header-align="center"
            align="center"
            :min-width="300"
            :max-width="400"
            ><template #default="scope"
              ><div>
                {{ scope.row.description ? scope.row.description : `-` }}
              </div></template
            ></el-table-column
          >
          <el-table-column
            prop="id"
            fixed="right"
            width="110"
            header-align="center"
            align="center"
            ><template #default="scope">
              <div>
                <router-link
                  to=""
                  @click="deleteByIdWeaving(scope.row.id)"
                  class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                >
                  <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                </router-link>
              </div> </template
          ></el-table-column>
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
