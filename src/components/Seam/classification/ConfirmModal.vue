<script setup>
import { ref } from "vue";
import { SeamInClassificationStore } from "../../../stores/Seam/Classification/classification.store";
const store_classification = SeamInClassificationStore();
import { storeToRefs } from "pinia";
const { is_modal, report_form } = storeToRefs(store_classification);
const model = ref({
  quantity: "",
  unit: "",
  date: "",
});
const Accept = (index) => {
  store_classification.Accept(index);
};
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
  <el-dialog v-model="is_modal" title="Qabul qilish oynasi" width="800">
    <div class="shadow-md rounded">
      <div
        class="flex justify-between flex-wrap font-semibold text-[11px] p-1 bg-slate-100 shadow"
      >
        <div>Party num: {{ report_form.party_number }}</div>
        <div
          class="bg-red-50 p-1 rounded text-[11px] border-[1px] border-red-500"
        >
          {{ report_form.status }}
        </div>
        <div>Buyurtmach:{{ report_form.customer_name }}</div>
      </div>
      <el-table
        :data="report_form.report_box"
        load
        class="w-full"
        header-align="center"
        empty-text="Mahsulot tanlanmagan... "
        border
        align="center"
        style="width: 100%; font-size: 13px"
        min-height="250"
        max-height="250"
      >
        <el-table-column
          align="center"
          header-align="center"
          type="index"
          prop="index"
          fixed="left"
          label="№"
          width="60"
        />

        <el-table-column
          header-align="center"
          align="center"
          prop="quantity"
          label="Miqdori"
          width="180"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="unit"
          label="Birligi"
          width="150"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="date"
          label="Vaqti"
          width="150"
          ><template #default="scope">{{
            String(scope.row.date).substring(0, 10)
          }}</template></el-table-column
        >
        <el-table-column
          header-align="center"
          align="center"
          label="Holati"
          width="150"
          ><template #default="scope">
            <router-link
              to=""
              class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
            >
              {{ scope.row.status }}
            </router-link></template
          ></el-table-column
        >

        <el-table-column
          align="center"
          fixed="right"
          label=""
          width="80"
          header-align="center"
        >
          <template #default="scope">
            <router-link
              v-if="scope.row.status === `Tasnifga yuborildi`"
              @click="Accept(scope.$index)"
              to=""
              class="inline-flex items-center mt-4 ml-2 text-red hover:bg-yellow-400 font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
            >
              <i class="text-red fa-solid fa-check fa-md"></i>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow"
      >
        <div>Buyurtma: {{ 0 }}</div>
        <div>Bajarildi: {{ report_form.done }}</div>
        <div>
          Qoldi:
          {{ 0 }}
        </div>
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
