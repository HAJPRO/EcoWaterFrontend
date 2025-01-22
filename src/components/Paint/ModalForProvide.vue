<script setup>
import { ref } from "vue";

import { PaintPlanStore } from "../../stores/Paint/paintPlan.store";
const store = PaintPlanStore();
import { storeToRefs } from "pinia";
const { is_provide, confirm_model, card_id, item } = storeToRefs(store);
import { HelpersStore } from "../../stores/Helpers/helper.store.js";
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
const formRef = ref();
const SaveToProvideValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      SaveToProvideAndAccept();
    } else {
      return false;
    }
  });
};
const SaveToProvideAndAccept = async () => {
  store.AcceptAndCreate(confirm_model.value);
  is_provide.value = false;
  confirm_model.value = {};
};
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <AddOptionModal v-if="is_modal === true" />
  <el-dialog v-model="is_provide" width="600">
    <div
      class="font-semibold rounded text-[15px] p-1 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887] mt-2"
    >
      <h3>Taminot uchun kerakli mahsulotlar qo'shish</h3>
    </div>
    <span>
      <el-form
        ref="formRef"
        :model="confirm_model"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="mb-1 col-span-4">
          <el-form-item label="Pus (kg)" prop="pus" :rules="rules">
            <el-input
              v-model="confirm_model.pus"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Fike (kg)" prop="fike" :rules="rules">
            <el-input
              v-model="confirm_model.fike"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item
            label="Rang miqdori"
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
        <div class="mb-1 col-span-6">
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

        <div class="mb-1 col-span-6">
          <el-form-item
            label="Tayyorlash muddati"
            prop="delivery_time_provide"
            :rules="rules"
          >
            <el-date-picker
              style="width: 100%"
              v-model="confirm_model.delivery_time_provide"
              clearable
              type="date"
              placeholder="..."
              size="smal"
            />
          </el-form-item>
        </div>
      </el-form>
    </span>
    <span class="">
      <div
        class="font-semibold rounded text-[15px] p-1 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887] mt-2"
      >
        <h3>To'quv uchun talabnoma qo'shish</h3>
      </div>
      <el-form
        ref="formRef"
        :model="confirm_model"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-8 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="mb-1 col-span-4">
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
        <div class="mb-1 col-span-4">
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
    <el-dialog
      v-model="innerVisible"
      width="500"
      title="Inner Dialog"
      append-to-body
    >
      <span>This is the inner Dialog</span>
    </el-dialog>
    <template #footer>
      <div class="dialog-footer">
        <router-link
          to=""
          @click="SaveToProvideValidate(formRef)"
          class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mb-1 mt-2 text-sm font-medium text-center text-white bg-[#36d887] text-bold rounded"
        >
          <i class="mr-2 fa-solid fa-check fa-sm"></i>Yuborish</router-link
        >
      </div>
    </template>
  </el-dialog>
</template>
