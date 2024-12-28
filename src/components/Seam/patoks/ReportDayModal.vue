<script setup>
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import { SeamInPatoksStore } from "../../../stores/Seam/Patoks/patoks.store";
const store_patoks = SeamInPatoksStore();
import { storeToRefs } from "pinia";
const { is_modal, reports } = storeToRefs(store_patoks);

const model = ref({
  id: uuidv4(),
  quantity: "",
  unit: "",
  date: new Date(),
  patok: "",
  status: "",
});
const Accept = (index) => {
  store_patoks.Accept(index);
};
const formRef = ref();
const Save = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_patoks.CreateDayReport(model.value);
    } else {
      return false;
    }
  });
};
const PatokStatus = (patok) => {
  model.value.status = patok;
};
const units = ref([
  { id: 1, name: "Dona" },
  { id: 2, name: "Pachka" },
  { id: 3, name: "Kg" },
]);
const patoks = ref([
  { id: 1, name: "Patok 1" },
  { id: 2, name: "Patok 2" },
  { id: 3, name: "Patok 3" },
  { id: 4, name: "Patok 4" },
  { id: 5, name: "Patok 5" },
  { id: 6, name: "Patok 6" },
  { id: 7, name: "Patok 7" },
  { id: 8, name: "Patok 8" },
]);
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <el-dialog v-model="is_modal" title="Kunlik hisobot oynasi " width="854">
    <div class="shadow-md rounded">
      <div
        class="flex justify-end flex-wrap font-semibold text-[11px] p-1 bg-slate-100 shadow"
      >
        <div
          class="bg-red-50 p-1 rounded text-[11px] border-[1px] border-red-500"
        >
          Jarayonda
        </div>
      </div>
      <el-table
        :data="reports.classification.report_box"
        load
        class="w-full"
        header-align="center"
        empty-text="Mahsulot tanlanmagan... "
        border
        align="center"
        style="font-size: 12px"
        min-height="200"
        max-height="200"
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
          width="200"
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
              v-if="scope.row.status === `Patokga yuborildi`"
              @click="Accept(scope.$index)"
              to=""
              class="inline-flex items-center mt-4 ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-2 text-center"
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
        <div>Bajarildi: {{ reports.done_classification }}</div>
        <div>
          Qoldi:
          {{ 0 }}
        </div>
      </div>
    </div>

    <div class="text-[13px] bg-white rounded shadow hover:shadow-md mt-4">
      <div
        class="bg-slate-100 font-semibold p-1 text-[14px] mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
      >
        Patok hisobot qo'shish
      </div>
      <el-form
        :model="model"
        ref="formRef"
        label-width="auto"
        size="small"
        label-position="top"
        class="filter-box md:grid md:grid-cols-12 gap-2 sm:flex sm:flex-wrap rounded shadow mb-1 bg-white p-1 text-[12px]"
      >
        <div class="mb-1 col-span-4">
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
        <div class="mb-1 col-span-4">
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
        <div class="mb-1 col-span-4">
          <el-form-item label="Patoklar" prop="patok" :rules="rules">
            <el-select
              @change="PatokStatus(model.patok)"
              required
              size="smal"
              v-model="model.patok"
              clearable
              placeholder="..."
            >
              <el-option
                v-for="item in patoks"
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
      <div class="shadow-md rounded">
        <div
          class="flex justify-end flex-wrap font-semibold text-[11px] p-1 bg-slate-100 shadow"
        >
          <div
            class="bg-red-50 p-1 rounded text-[11px] border-[1px] border-red-500"
          >
            Jarayonda
          </div>
        </div>
        <el-table
          :data="reports.report_box_patoks"
          load
          style="font-size: 12px"
          class="w-full"
          header-align="center"
          empty-text="Mahsulot tanlanmagan... "
          border
          align="center"
          min-height="180"
          max-height="180"
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
            width="200"
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
            width="120"
            header-align="center"
            align="center"
          >
            <template #default="">
              <router-link
                @click="Accept(scope.$index)"
                to=""
                class="inline-flex items-center mt-4 ml-2 text-red hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-2 text-center"
              >
                <i class="text-red fa-solid fa-check fa-md"></i>
              </router-link>
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
          <div>Buyurtma: {{ 0 }}</div>
          <div>Bajarildi: {{ reports.done_patoks }}</div>
          <div>
            Qoldi:
            {{ 0 }}
          </div>
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
