<script setup>
import { ref } from "vue";
import { SeamInFormStore } from "../../../stores/Seam/Form/form.store";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
const { is_modal, model } = storeToRefs(store_form);

const formRef = ref();
const Save = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_form.CreaetInfoToForm(model.value);
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
    v-model="is_modal"
    title="Bichuv parametrlarini qo'shish"
    width="800"
  >
    <span>
      <el-form
        :model="model"
        ref="formRef"
        label-width="auto"
        size="small"
        label-position="top"
        class="filter-box md:grid md:grid-cols-12 gap-2 sm:flex sm:flex-wrap rounded shadow-md bg-white p-2 mt-1 mb-1 text-[12px]"
      >
        <div class="mb-1 col-span-4">
          <el-form-item
            label="Pastal miqdori (kg)"
            prop="pastal_quantity"
            :rules="rules"
          >
            <el-input
              required
              v-model="model.pastal_quantity"
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
            label="Atxod miqdori (kg)"
            prop="waste_quantity"
            :rules="rules"
          >
            <el-input
              required
              v-model="model.waste_quantity"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Fakt gramaj" prop="fact_gramage" :rules="rules">
            <el-input
              required
              v-model="model.fact_gramage"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
      </el-form>
    </span>
    <el-dialog
      v-model="innerVisible"
      width="600"
      title="Inner Dialog"
      append-to-body
    >
    </el-dialog>
    <template #footer>
      <div class="dialog-footer">
        <router-link
          to=""
          @click="Save(formRef)"
          class="inline-flex text-[12px] items-center ml-2 px-3 py-1 mb-1 mt-2 text-sm font-medium text-center text-white bg-[#36d887] text-bold rounded"
        >
          <i class="mr-2 fa-solid fa-check fa-sm"></i>Yuborish</router-link
        >
      </div>
    </template>
  </el-dialog>
</template>
