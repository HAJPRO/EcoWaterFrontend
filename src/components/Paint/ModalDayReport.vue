<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { PaintPlanStore } from "../../stores/Paint/paintPlan.store";
const store_paint = PaintPlanStore();
import { storeToRefs } from "pinia";
const isActive = ref(1);
const ActiveTabLink = (status) => {
  isActive.value = status;
};
const {
  is_report_modal,
  report_weaving,
  report_paint,
  detail,
  DonePaint,
  DoneWeaving,
} = storeToRefs(store_paint);

const model = ref({
  input_plan_id: detail.value._id,
  order_number: detail.value.order_number,
  material_name: "",
  material_type: "",
  quantity: "",
  unit: "",
});
const units = ref([
  { id: 1, name: "Kg" },
  { id: 2, name: "Metr" },
  { id: 3, name: "Dona" },
  { id: 4, name: "Pachka" },
]);
const rules = ref([
  {
    required: true,
    message: `Maydon to'ldirilishi zarur !`,
    trigger: "blur",
  },
]);

const residue = ref();
const is_residue = ref(false);
const MatchResidue = (quantity) => {
  residue.value = detail.value.sale_quantity - DonePaint.value;
  if (quantity > residue.value) {
    is_residue.value = true;
  } else {
    is_residue.value = false;
  }
};
const formRef = ref();
const CreateDayReport = async (formRef) => {
  await formRef.validate((valid) => {
    if (
      valid === true &&
      model.value.quantity > 0 &&
      model.value.quantity <= residue.value
    ) {
      store_paint.CreateDayReport(model.value);
    } else {
      return false;
    }
  });
};
</script>
<template>
  <el-dialog v-model="is_report_modal" width="1000">
    <span>
      <div class="col-span-9 grid-flow-col flex-wrap">
        <router-link
          to=""
          @click="ActiveTabLink(1)"
          :class="{ activeTab: isActive === 1 }"
          class="inline-flex text-[13px] items-center mr-2 px-4 py-1 mb-1 text-sm font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
        >
          <i class="fa-solid fa-info mr-2 fa-xm"></i> To'quv hisobot
          <div class="flex flex-shrink-0 ml-2">
            <span
              :class="{ activeTabIcon: isActive === 1 }"
              class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
            >
              {{ report_weaving ? report_weaving.length : 0 }}</span
            >
          </div>
        </router-link>
        <router-link
          @click="ActiveTabLink(2)"
          to=""
          :class="{ activeTab: isActive === 2 }"
          class="inline-flex text-[13px] items-center mr-2 px-4 py-1 mb-1 text-sm font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
        >
          <i class="fa-solid fa-info mr-2 fa-xm"></i> Bo'yoq hisobot
          <div class="flex flex-shrink-0 ml-2">
            <span
              :class="{ activeTabIcon: isActive === 2 }"
              class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
            >
              {{ report_paint ? report_paint.length : 0 }}</span
            >
          </div>
        </router-link>
      </div>

      <div v-if="isActive === 1" class="weaving">
        <div
          class="bg-slate-100 font-semibold p-1 mb-1 text-[15px] align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          To'quv hisoboti
        </div>
        <div class="flex justify-between text-[11px] font-semibold">
          <div>Buyurtmachi: {{ detail.customer_name }}</div>
          <div>Artikul: {{ detail.artikul }}</div>
          <div>Buyurtma nomeri: {{ detail.order_number }}</div>
        </div>
        <div class="shadow-md rounded">
          <el-table
            :data="report_weaving"
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            class="w-full"
            header-align="center"
            empty-text="Mahsulot tanlanmagan... "
            border
            style="width: 100%; font-size: 12px"
            min-height="200"
            max-height="200"
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
              header-align="center"
              prop="material_name"
              label="Mato nomi"
              width="180"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="material_type"
              label="Mato turi"
              width="150"
              align="center"
            />
            <el-table-column
              fixed="right"
              header-align="center"
              prop="quantity"
              label="Miqdori"
              width="150"
              align="center"
              ><template #default="scope"
                ><div class="text-red-500 font-semibold">
                  {{ scope.row.quantity }} {{ scope.row.unit }}
                </div></template
              ></el-table-column
            >

            <el-table-column
              header-align="center"
              label="Vaqt"
              width="150"
              align="center"
              ><template #default="scope">{{
                String(scope.row.createdAt).substring(0, 10)
              }}</template></el-table-column
            >
            <el-table-column
              fixed="right"
              label="Holati"
              width="180"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                <router-link
                  to=""
                  class="inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#e1e1e3] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
                >
                  {{ scope.row.status }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label=""
              width="100"
              header-align="center"
              align="center"
            >
              <template #default="">
                <router-link
                  to=""
                  class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#e8eded] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                >
                  <i class="text-red fa-solid fa-pen fa-xs fa- fa-xs"></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          class="flex justify-between flex-wrap font-semibold text-[12px] p-[6px] bg-slate-100 shadow border-b-[1px] border-[#36d887]"
        >
          <div class="mt-2">
            Buyurtma:
            {{ detail ? detail.weaving_quantity : 0 }} kg
          </div>
          <div class="mt-2">Bajarildi: {{ DoneWeaving }} kg</div>
          <div class="mt-2">
            Qoldi:
            {{ DoneWeaving >= 0 ? detail.weaving_quantity - DoneWeaving : 0 }}
            kg
          </div>
          <div v-if="detail.weaving_quantity - DoneWeaving <= 0">
            <el-button
              @click="CreateDayReport(formRef)"
              style="
                background: linear-gradient(
                  90deg,
                  rgba(200, 200, 200, 1) 0%,
                  rgba(54, 216, 135, 1) 35%,
                  rgba(200, 200, 200, 1) 100%
                );
                color: rgb(80, 79, 79);
                border: none;
                cursor: pointer;
                width: 100%;
                padding: 12px;
                font-size: 12px;
                border: 1px solid #36d887;
                font-weight: bold;
                border: none;
              "
            >
              To'quv partyani yakunladi
            </el-button>
          </div>
        </div>
      </div>
      <div v-if="isActive === 2" class="paint">
        <div class="text-[15px] bg-white rounded shadow hover:shadow-md mt-2">
          <div
            class="bg-slate-100 font-semibold p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
          >
            {{
              detail.sale_quantity - DonePaint <= 0
                ? `Bo'yoq hisoboti`
                : ` Bo'yoq hisobot qo'shish`
            }}
          </div>

          <el-form
            v-if="detail.sale_quantity - DonePaint > 0"
            ref="formRef"
            :model="model"
            label-width="auto"
            class="filter-box md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded p-2 mt-1 mb-1 text-[12px]"
            label-position="top"
            status-icon
            size="smal"
          >
            <div class="col-span-3">
              <el-form-item
                :disabled="is_residue"
                label="Mato nomi"
                prop="material_name"
                :rules="rules"
              >
                <el-select
                  :disabled="is_residue"
                  required
                  v-model="model.material_name"
                  style="width: 100%"
                  placeholder="..."
                >
                  <el-option
                    :disabled="is_residue"
                    v-for="item in detail.sale_products"
                    :key="item._id"
                    :label="item.material_name"
                    :value="item.material_name"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-2">
              <el-form-item
                :disabled="is_residue"
                label="Turi"
                prop="material_type"
                :rules="rules"
              >
                <el-select
                  :disabled="is_residue"
                  required
                  v-model="model.material_type"
                  style="width: 100%"
                  placeholder="..."
                >
                  <el-option
                    :disabled="is_residue"
                    v-for="item in detail.sale_products"
                    :key="item._id"
                    :label="item.material_type"
                    :value="item.material_type"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-3">
              <el-form-item
                label="Miqdori (kg)"
                prop="quantity"
                :rules="[
                  { required: true, message: `Maydon to'ldirilishi zarur !` },
                  { type: 'number', message: `Qiymat musbat bo'lishi zarur` },
                ]"
              >
                <el-input
                  @input="MatchResidue(model.quantity)"
                  v-model.number="model.quantity"
                  clearable
                  class="w-[100%]"
                  type="String"
                  placeholder="..."
                />
                <div v-if="is_residue" class="text-red-500 text-[12px]">
                  Qoldiqdan oshib ketdi !
                </div>
              </el-form-item>
            </div>
            <div class="col-span-2">
              <el-form-item
                :disabled="is_residue"
                label="Birligi"
                prop="unit"
                :rules="rules"
              >
                <el-select
                  :disabled="is_residue"
                  required
                  v-model="model.unit"
                  clearable
                  placeholder="..."
                >
                  <el-option
                    :disabled="is_residue"
                    v-for="item in units"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="mb-1 col-span-2">
              <el-form-item label=".">
                <el-button
                  @click="CreateDayReport(formRef)"
                  style="
                    background-color: #36d887;
                    color: white;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                    padding: 15px;
                  "
                >
                  <i class="fa-solid fa-plus mr-2 fa-md"></i> Qo'shish
                </el-button>
              </el-form-item>
            </div>
          </el-form>

          <div class="flex justify-between text-[11px] font-semibold">
            <div>Buyurtmachi: {{ detail.customer_name }}</div>
            <div>Artikul: {{ detail.artikul }}</div>
            <div>Buyurtma nomeri: {{ detail.order_number }}</div>
          </div>
          <div class="shadow-md rounded">
            <el-table
              :data="report_paint"
              :header-cell-style="{
                background: '#e8eded',
                border: '0.2px solid #e1e1e3',
              }"
              load
              class="w-full"
              header-align="center"
              empty-text="Mahsulot tanlanmagan... "
              border
              style="width: 100%; font-size: 12px"
              min-height="200"
              max-height="200"
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
                header-align="center"
                prop="material_name"
                label="Mato nomi"
                width="180"
                align="center"
              />
              <el-table-column
                header-align="center"
                prop="material_type"
                label="Mato turi"
                width="150"
                align="center"
              />
              <el-table-column
                fixed="right"
                header-align="center"
                prop="quantity"
                label="Miqdori"
                width="150"
                align="center"
                ><template #default="scope"
                  ><div class="text-red-500 font-semibold">
                    {{ scope.row.quantity }} {{ scope.row.unit }}
                  </div></template
                ></el-table-column
              >

              <el-table-column
                header-align="center"
                label="Vaqt"
                width="150"
                align="center"
                ><template #default="scope">{{
                  String(scope.row.createdAt).substring(0, 10)
                }}</template></el-table-column
              >
              <el-table-column
                fixed="right"
                label="Holati"
                width="180"
                header-align="center"
                align="center"
              >
                <template #default="scope">
                  <router-link
                    to=""
                    class="inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#e1e1e3] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
                  >
                    {{ scope.row.status }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label=""
                width="100"
                header-align="center"
                align="center"
              >
                <template #default="">
                  <router-link
                    to=""
                    class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#e8eded] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                  >
                    <i class="text-red fa-solid fa-pen fa-xs fa- fa-xs"></i>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
            <div
              class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow border-b-[1px] border-[#36d887]"
            >
              <div class="mt-2">
                Buyurtma:
                {{ detail ? detail.sale_quantity : 0 }} kg
              </div>
              <div class="mt-2">Bajarildi: {{ DonePaint }} kg</div>
              <div class="mt-2">
                Qoldi:
                {{ DonePaint >= 0 ? detail.sale_quantity - DonePaint : 0 }} kg
              </div>
              <div v-if="detail.sale_quantity - DonePaint <= 0">
                <el-button
                  style="
                    background: linear-gradient(
                      90deg,
                      rgba(200, 200, 200, 1) 0%,
                      rgba(54, 216, 135, 1) 35%,
                      rgba(200, 200, 200, 1) 100%
                    );
                    color: rgb(80, 79, 79);
                    border: none;
                    cursor: pointer;
                    width: 100%;
                    padding: 12px;
                    font-size: 12px;
                    border: 1px solid #36d887;
                    font-weight: bold;
                    border: none;
                  "
                >
                  Bo'yoq partyani yakunladi
                </el-button>
              </div>
            </div>
          </div>
        </div>
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
    <template #footer>
      <!-- <div>
        <el-button
          v-if="detail.sale_quantity - DonePaint <= 0"
          @click="CreateDayReport(formRef)"
          style="
            background: linear-gradient(
              90deg,
              rgba(200, 200, 200, 1) 0%,
              rgba(54, 216, 135, 1) 35%,
              rgba(200, 200, 200, 1) 100%
            );
            color: rgb(80, 79, 79);
            border: none;
            cursor: pointer;
            width: 100%;
            padding: 15px;
            font-size: 12px;
            border: 1px solid #36d887;
            font-weight: bold;
            border: none;
          "
        >
          Bo'yoq partyani yakunladi
        </el-button>
      </div> -->
    </template>
  </el-dialog>
</template>
