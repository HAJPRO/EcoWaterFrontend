<script setup>
import { ref, onMounted } from "vue";
import { RoleStore } from "../../../stores/Admin/role.store";
const store_role = RoleStore();
import { storeToRefs } from "pinia";
const { is_modal_role, model } = storeToRefs(store_role);
const formRef = ref();
const Save = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_role.CreateRole(model.value);
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
  <el-dialog v-model="is_modal_role" title="Add role modal" width="600">
    <span>
      <el-form
        :model="model"
        ref="formRef"
        label-width="auto"
        size="small"
        label-position="top"
        class="filter-box md:grid md:grid-cols-12 gap-2 sm:flex sm:flex-wrap rounded shadow-md bg-white p-2 mt-1 mb-1 text-[12px]"
      >
        <div class="mb-1 col-span-6">
          <el-form-item label="Role name" prop="role_name" :rules="rules">
            <el-input
              required
              v-model="model.role_name"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-6">
          <el-form-item label="Value" prop="value" :rules="rules">
            <el-input
              required
              v-model="model.value"
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
