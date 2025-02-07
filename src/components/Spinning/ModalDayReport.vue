<script setup>
import { format } from "date-fns";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { SpinningPlanStore } from "../../stores/Spinning/spinningPlan.store";
const store_spinning = SpinningPlanStore();
import { storeToRefs } from "pinia";
const { is_report_modal, report_spinning, detail, DoneSpinning } =
  storeToRefs(store_spinning);

const model = ref({
  input_plan_id: detail.value._id,
  order_number: detail.value.order_number,
  yarn_name: "",
  yarn_type: "",
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
  residue.value = detail.value.weaving_quantity - DoneSpinning.value;

  if (quantity > residue.value) {
    is_residue.value = true;
  } else {
    is_residue.value = false;
  }
};
const formRef = ref();
const CreateDayReport = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true && model.value.quantity > 0) {
      store_spinning.CreateDayReport(model.value);
    } else {
      return false;
    }
  });
};
</script>
<template>
  <el-dialog v-model="is_report_modal" width="1000">
    <span>
      <div class="text-[15px] bg-white rounded shadow hover:shadow-md mt-2">
        <div
          class="bg-slate-100 font-semibold p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          {{
            detail.weaving_quantity - DoneSpinning > 0
              ? ` Yigiruv hisobot qo'shish`
              : `Yigiruv hisoboti`
          }}
        </div>
        <el-form
          v-if="detail.weaving_quantity - DoneSpinning > 0"
          ref="formRef"
          :model="model"
          label-width="auto"
          class="filter-box md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded p-2 mt-1 mb-1 text-[12px]"
          label-position="top"
          status-icon
          size="smal"
        >
          <div class="col-span-3">
            <el-form-item label="Ip nomi" prop="yarn_name" :rules="rules">
              <el-select
                :disabled="is_residue"
                required
                v-model="model.yarn_name"
                style="width: 100%"
                placeholder="..."
              >
                <el-option
                  v-for="item in detail.weaving_products"
                  :key="item._id"
                  :label="item.yarn_name"
                  :value="item.yarn_name"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item label="Ip turi" prop="yarn_type" :rules="rules">
              <el-select
                :disabled="is_residue"
                required
                v-model="model.yarn_type"
                style="width: 100%"
                placeholder="..."
              >
                <el-option
                  v-for="item in detail.weaving_products"
                  :key="item._id"
                  :label="item.yarn_type"
                  :value="item.yarn_type"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
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
            <el-form-item label="Birligi" prop="unit" :rules="rules">
              <el-select
                :disabled="is_residue"
                required
                v-model="model.unit"
                clearable
                placeholder="..."
              >
                <el-option
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
          <div>
            Muddati:
            {{ format(detail.delivery_time_weaving, "dd.MM.yyyy HH:mm") }}
          </div>
        </div>
        <div class="shadow-md rounded">
          <el-table
            :data="report_spinning"
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
              prop="yarn_name"
              label="Ip nomi"
              width="180"
              align="center"
            />
            <el-table-column
              header-align="center"
              prop="yarn_type"
              label="Ip turi"
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
              ><template #default="scope">
                {{ format(scope.row.createdAt, "dd.MM.yyyy HH:mm") }}</template
              ></el-table-column
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
              {{ detail ? detail.weaving_quantity : 0 }} kg
            </div>
            <div class="mt-2">Bajarildi: {{ DoneSpinning }} kg</div>
            <div class="mt-2">
              Qoldi:
              {{ detail.weaving_quantity - DoneSpinning }}
              kg
            </div>
            <div v-if="detail.weaving_quantity - DoneSpinning <= 0" class="">
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
                Yigiruv partyani yakunladi
              </el-button>
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
    <template #footer> </template>
  </el-dialog>
</template>
