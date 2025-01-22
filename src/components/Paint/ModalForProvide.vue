<script setup>
const i = ref([
  { name: "sasha", age: 25 },
  { name: "namim", age: 30 },
]);
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { ToastifyService } from "../../utils/Toastify";
import { PaintPlanStore } from "../../stores/Paint/paintPlan.store";
const store = PaintPlanStore();
import { storeToRefs } from "pinia";
const { is_provide, confirm_model, card_id, item } = storeToRefs(store);
import { HelpersStore } from "../../stores/Helpers/helper.store.js";
import { color } from "echarts";
const store_helpers = HelpersStore();
const { options, is_modal } = storeToRefs(store_helpers);
const Type = (type) => {
  store_helpers.SelectType(type);
};
const Plus = (data) => {
  store_helpers.PlusModal(data);
};
const ChangeColor = (value) => {
  confirm_model.color = value;
};
const RefProvide = ref();
const colors = ref([]);
const AddProvide = async (RefProvide) => {
  await RefProvide.validate((valid) => {
    if (valid === true) {
      colors.value.push({
        id: uuidv4(),
        color: confirm_model.value.color,
        color_quantity: confirm_model.value.color_quantity,
      });
    } else {
      return false;
    }
  });
};
const RefWeaving = ref();
const SaveToProvideValidate = async (RefWeaving) => {
  await RefWeaving.validate((valid) => {
    if (valid === true && colors.value.length > 0) {
      SaveToProvideAndAccept();
    } else {
      return ToastifyService.ToastError({
        msg: "Taminot uchun kerakli mahsulotlar qo'shilmagan",
      });
    }
  });
};
const SaveToProvideAndAccept = async () => {
  store.AcceptAndCreate({
    pus: confirm_model.value.pus,
    fike: confirm_model.value.fike,
    delivery_time_provide: confirm_model.value.delivery_time_provide,
    weaving_qauntity: confirm_model.value.weaving_qauntity,
    delivery_time_weaving: confirm_model.value.delivery_time_weaving,
    colors: colors.value,
  });
  is_provide.value = false;
  confirm_model.value = {};
};
const deleteById = (id) => {
  const filterLoad = colors.value.filter((item) => {
    return item.id !== id;
  });
  colors.value = filterLoad;
};
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <AddOptionModal v-if="is_modal === true" />
  <el-dialog v-model="is_provide" width="700">
    <span class="">
      <div
        class="font-semibold rounded text-[14px] p-1 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887] mt-2"
      >
        <h3>To'quv uchun talabnoma qo'shish</h3>
      </div>
      <el-form
        ref="RefWeaving"
        :model="confirm_model"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-8 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="col-span-4">
          <el-form-item
            label="Xom mato miqdori (kg)"
            prop="weaving_qauntity"
            :rules="rules"
          >
            <el-input
              v-model="confirm_model.weaving_qauntity"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item
            label="Tayyorlash muddati"
            prop="delivery_time_weaving"
            :rules="rules"
          >
            <el-date-picker
              style="width: 100%"
              v-model="confirm_model.delivery_time_weaving"
              clearable
              type="date"
              placeholder="..."
              size="smal"
            />
          </el-form-item>
        </div>
      </el-form>
    </span>
    <div
      class="font-semibold rounded text-[14px] p-1 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887] mt-2"
    >
      <h3>Taminot uchun kerakli mahsulotlar qo'shish</h3>
    </div>
    <span>
      <el-form
        ref="RefProvide"
        :model="confirm_model"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="col-span-4">
          <el-form-item label="Pus (kg)" prop="pus" :rules="rules">
            <el-input
              :disabled="colors.length > 0"
              v-model="confirm_model.pus"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Fike (kg)" prop="fike" :rules="rules">
            <el-input
              :disabled="colors.length > 0"
              v-model="confirm_model.fike"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item
            label="Rang miqdori (kg)"
            prop="color_quantity"
            :rules="rules"
          >
            <el-input
              v-model="confirm_model.color_quantity"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Rang" prop="color" :rules="rules">
            <el-input
              required
              v-model="confirm_model.color"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #prepend>
                <div class="w-[8px] items-start text-center">
                  <i
                    @click="
                      Plus({
                        title: `Rang qo'shish`,
                        state: `color`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.color"
                  @click="Type({ type: `color` })"
                  @change="ChangeColor($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in options"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <div class="col-span-6">
          <el-form-item
            label="Tayyorlash muddati"
            prop="delivery_time_provide"
            :rules="rules"
          >
            <el-date-picker
              :disabled="colors.length > 0"
              style="width: 100%"
              v-model="confirm_model.delivery_time_provide"
              clearable
              type="date"
              placeholder="..."
              size="smal"
            />
          </el-form-item>
        </div>
        <div class="col-span-2">
          <el-form-item label=".">
            <el-button
              size="smal"
              @click="AddProvide(RefProvide)"
              style="
                background-color: #36d887;
                color: white;
                border: none;
                margin-bottom: 4px;
                width: 100%;
                font-size: 12px;
              "
              ><i class="mr-2 fa-solid fa-plus fa-sm"></i>Qo'shish
            </el-button></el-form-item
          >
        </div>
      </el-form>
      <div class="mt-3 grid grid-cols-12 gap-2">
        <div
          class="col-span-4 h-[155px] shadow-md rounded-md bg-white text-center text-slate-500 font-semibold text-[12px] p-4 cursor-pointer border-t-[1px] border-b-[1px] border-[#36d887]"
        >
          <div class="mt-1 bg-[#e8eded] p-2 rounded">
            Pus:
            {{ confirm_model.pus ? confirm_model.pus : 0 }}
            kg
          </div>
          <div class="mt-2 bg-[#e8eded] p-2 rounded">
            Fike:
            {{ confirm_model.fike ? confirm_model.pus : 0 }}
            kg
          </div>
          <div class="mt-2 bg-[#e8eded] p-2 rounded">
            Mudati:
            {{
              confirm_model.delivery_time_provide
                ? String(confirm_model.delivery_time_provide).substring(0, 15)
                : 0
            }}
          </div>
        </div>
        <div class="col-span-8 shadow-md bg-white rounded min-h-[15px]">
          <el-table
            :data="colors"
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
              prop="color"
              label="Rang"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="color"
              label="Rang"
              width="150"
              header-align="center"
              align="center"
            />

            <el-table-column
              prop="color_quantity"
              label="Miqdori"
              width="150"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="id"
              fixed="right"
              width="100"
              header-align="center"
              align="center"
              ><template #default="scope">
                <div>
                  <router-link
                    to=""
                    @click="deleteById(scope.row.id)"
                    class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                  >
                    <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                  </router-link>
                </div> </template
            ></el-table-column>
          </el-table>
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
      <div class="dialog-footer bg-slate-100 shadow p-1 rounded">
        <router-link
          to=""
          @click="SaveToProvideValidate(RefWeaving)"
          class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mt-2 text-sm font-medium text-center text-white bg-[#36d887] text-bold rounded"
        >
          <i class="mr-2 fa-solid fa-check fa-sm"></i>Yuborish</router-link
        >
      </div>
    </template>
  </el-dialog>
</template>
