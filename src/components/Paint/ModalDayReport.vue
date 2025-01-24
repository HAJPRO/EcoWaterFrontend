<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { PaintPlanStore } from "../../stores/Paint/paintPlan.store";
const store_paint = PaintPlanStore();
import { storeToRefs } from "pinia";
const { is_report_modal, report, detail } = storeToRefs(store_paint);

const model = ref({
  id: uuidv4(),
  material_name: "",
  material_type: "",
  quantity: "",
  unit: "",
  date: new Date(),
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

const formRef = ref();
const PlusValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      model.value = {
        quantity: "",
        unit: "",
        date: "",
      };
    } else {
      return false;
    }
  });
};
</script>
<template>
  <el-dialog v-model="is_report_modal" width="900">
    <span>
      <div class="flex justify-between text-[12px] font-semibold">
        <div>Buyurtmachi: {{ detail.card.customer_name }}</div>
        <div>Artikul: {{ detail.card.artikul }}</div>
        <div>Buyurtma nomeri: {{ detail.card.order_number }}</div>
      </div>
      <div
        class="bg-slate-100 font-semibold p-1 mb-1 text-[15px] align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
      >
        To'quv hisoboti
      </div>
      <div class="shadow-md rounded">
        <el-table
          :header-cell-style="{
            background: '#e8eded',
            border: '0.2px solid #e1e1e3',
          }"
          load
          class="w-full"
          header-align="center"
          empty-text="Mahsulot tanlanmagan... "
          border="true"
          style="width: 100%; font-size: 12px"
          min-height="150"
          max-height="150"
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
            prop="name"
            label="Mato nomi"
            width="180"
          />
          <el-table-column
            header-align="center"
            prop="quantity"
            label="Miqdori"
            width="180"
          />
          <el-table-column
            header-align="center"
            prop="unit"
            label="Birligi"
            width="150"
          />
          <el-table-column
            header-align="center"
            prop="date"
            label="Sana"
            width="250"
          />
          <el-table-column
            fixed="right"
            label=""
            width="127"
            header-align="center"
            align="center"
          >
            <template #default="">
              <router-link
                to=""
                class="inline-flex items-center mt-4 ml-2 text-red bg-[#eedc36] hover:bg-yellow-400 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i class="text-red fa-solid fa-check fa-xs fa- fa-xs"></i>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        class="flex justify-between flex-wrap font-semibold text-[12px] mb-2 p-1 bg-slate-100 shadow border-b-[1px] border-[#36d887]"
      >
        <div>
          Buyurtma:
          {{ detail.card ? detail.card.weaving_qauntity : 0 }} kg
        </div>
        <div>Bajarildi: {{ 0 }} kg</div>
        <div>
          Qoldi:
          {{ 0 }} kg
        </div>
      </div>
      <div class="text-[15px] bg-white rounded shadow hover:shadow-md mt-2">
        <div
          class="bg-slate-100 font-semibold p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          Bo'yoq hisobot qo'shish
        </div>
        <el-form
          ref="formRef"
          :model="model"
          label-width="auto"
          class="filter-box md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded p-2 mt-1 mb-1 text-[12px]"
          label-position="top"
          status-icon
          size="smal"
        >
          <div class="col-span-3">
            <el-form-item label="Mato nomi" prop="material_name" :rules="rules">
              <el-select
                required
                v-model="model.material_name"
                style="width: 100%"
                placeholder="..."
              >
                <el-option
                  v-for="item in detail.products"
                  :key="item._id"
                  :label="item.product_name"
                  :value="item.product_name"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label="Turi" prop="material_type" :rules="rules">
              <el-select
                required
                v-model="model.material_type"
                style="width: 100%"
                placeholder="..."
              >
                <el-option
                  v-for="item in detail.products"
                  :key="item._id"
                  :label="item.product_type"
                  :value="item.product_type"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item label="Miqdori (kg)" prop="qauntity" :rules="rules">
              <el-input
                v-model="model.qauntity"
                clearable
                class="w-[100%]"
                type="Number"
                placeholder="..."
              />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label="Birligi" prop="unit" :rules="rules">
              <el-select
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
                @click="PlusValidate(formRef)"
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
        <div class="shadow-md rounded">
          <el-table
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            class="w-full"
            header-align="center"
            hight="5"
            empty-text="Mahsulot tanlanmagan... "
            border
            style="width: 100%; font-size: 12px"
            min-height="170"
            max-height="170"
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
              prop="name"
              label="Mato nomi"
              width="180"
            />
            <el-table-column
              header-align="center"
              prop="quantity"
              label="Miqdori"
              width="180"
            />
            <el-table-column
              header-align="center"
              prop="unit"
              label="Birligi"
              width="150"
            />
            <el-table-column
              header-align="center"
              prop="date"
              label="Sana"
              width="250"
            />
            <el-table-column
              fixed="right"
              label=""
              width="127"
              header-align="center"
              align="center"
            >
              <template #default="">
                <router-link
                  to=""
                  class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#e8eded] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                >
                  <i class="text-red fa-solid fa-check fa-xs fa- fa-xs"></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <div
            class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow border-b-[1px] border-[#36d887]"
          >
            <div>
              Buyurtma:
              {{ detail.card ? detail.card.order_quantity : 0 }} kg
            </div>
            <div>Bajarildi: {{ 0 }} kg</div>
            <div>
              Qoldi:
              {{ 0 }} kg
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
