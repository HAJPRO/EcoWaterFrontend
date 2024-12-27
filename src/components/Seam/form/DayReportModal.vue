<script setup>
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import { SeamInFormStore } from "../../../stores/Seam/Form/form.store";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
const { is_confirm, report } = storeToRefs(store_form);
const model = ref({
  id: uuidv4(),
  quantity: "",
  unit: "",
  date: new Date(),
  status: "Tasnifga yuborildi",
});
const units = ref([
  { id: 1, name: "Dona" },
  { id: 2, name: "Pachka" },
  { id: 3, name: "Kg" },
]);
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
    width="800"
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
        <div class="mb-1 col-span-6">
          <el-form-item label="Miqdori" prop="quantity" :rules="rules">
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
        <div class="mb-1 col-span-6">
          <el-form-item label="Birligi" prop="unit" :rules="rules">
            <el-select
              required
              size="smal"
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
        <!-- <div class="mb-1 col-span-4">
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
        </div> -->
        <div class="col-span-12 flex justify-end">
          <div></div>
          <el-button
            size="small"
            @click="Save(formRef)"
            style="
              background-color: #36d887;
              color: white;
              border: none;
              margin-bottom: 4px;
            "
            ><i class="mr-2 fa-solid fa-check fa-sm"></i>Yuborish
          </el-button>
        </div>
      </el-form>
    </span>
    <div class="shadow-md rounded">
      <div
        class="flex justify-between flex-wrap font-semibold text-[11px] p-1 bg-slate-100 shadow"
      >
        <div>Party num:</div>
        <div
          class="bg-red-50 p-1 rounded text-[11px] border-[1px] border-red-500"
        >
          {{ report.report_data.status }}
        </div>
        <div>Buyurtmach:</div>
      </div>
      <el-table
        :data="report.report_data.report_box"
        load
        class="w-full"
        header-align="center"
        hight="5"
        empty-text="Mahsulot tanlanmagan... "
        border
        style="font-size: 12px"
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
          align="center"
          header-align="center"
          prop="quantity"
          label="Miqdori"
          width="180"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="unit"
          label="Birligi"
          width="150"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="date"
          label="Vaqti"
          width="150"
          ><template #default="scope">{{
            String(scope.row.date).substring(0, 10)
          }}</template></el-table-column
        >
        <el-table-column
          align="center"
          fixed="right"
          header-align="center"
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
          fixed="right"
          label=""
          width="80"
          header-align="center"
          align="center"
        >
          <template #default="">
            <router-link
              to=""
              class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#d7ebeb] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
            >
              <i class="text-red fa-solid fa-trash fa-sm"></i>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow"
      >
        <div>
          Buyurtma: {{ report ? report.report_data.pastal_quantity : 0 }}
        </div>
        <div>Bajarildi: {{ report.done ? report.done : 0 }}</div>
        <div>
          Qoldi:
          {{
            report.done ? report.report_data.pastal_quantity - report.done : 0
          }}
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
