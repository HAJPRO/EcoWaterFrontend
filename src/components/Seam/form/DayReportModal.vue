<script setup>
import { ref } from "vue";
import { SeamInFormStore } from "../../../stores/Seam/Form/form.store";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
const { is_confirm, report } = storeToRefs(store_form);
const model = ref({
  quantity: "",
  unit: "",
  date: "",
});
const formRef = ref();
const Save = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_form.CreateDayReport(model.value);
    } else {
      return false;
    }
  });
};
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <el-dialog
    v-model="report.is_modal"
    title="Kunlik hisobot qo'shish oynasi"
    width="700"
  >
    <span>
      <el-form
        :model="model"
        ref="formRef"
        label-width="auto"
        size="small"
        label-position="top"
        class="filter-box md:grid md:grid-cols-12 gap-2 sm:flex sm:flex-wrap rounded shadow mb-1 bg-white p-1 text-[12px]"
      >
        <div class="mb-1 col-span-4">
          <el-form-item label="Miqdori (kg)" prop="quantity" :rules="rules">
            <el-input
              required
              v-model="model.quantity"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Birligi" prop="unit" :rules="rules">
            <el-input
              required
              v-model="model.unit"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Vaqt" prop="date" :rules="rules">
            <el-date-picker
              v-model="model.date"
              style="width: 100%"
              clearable
              type="date"
              placeholder="..."
              size="smal"
            />
          </el-form-item>
        </div>
        <div class="col-span-12 flex justify-end">
          <div></div>
          <router-link
            to=""
            @click="Save(formRef)"
            class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mb-1 mt-2 text-sm font-medium text-center text-white bg-[#36d887] text-bold rounded"
          >
            <i class="mr-2 fa-solid fa-check fa-sm"></i>Yuborish</router-link
          >
        </div>
      </el-form>
    </span>
    <div class="shadow-md rounded">
      <el-table
        :data="Model"
        load
        class="w-full"
        header-align="center"
        hight="5"
        empty-text="Mahsulot tanlanmagan... "
        border
        style="width: 100%; font-size: 13px"
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
          label="Vaqti"
          width="150"
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
      <div
        class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow"
      >
        <div>Buyurtma:</div>
        <div>Bajarildi:</div>
        <div>Qoldi:</div>
      </div>
    </div>
    <el-dialog
      v-model="innerVisible"
      width="600"
      title="Inner Dialog"
      append-to-body
    >
    </el-dialog>
    <template #footer>
      <div class="dialog-footer"></div>
    </template>
  </el-dialog>
</template>
