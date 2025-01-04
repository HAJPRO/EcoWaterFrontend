<script setup>
import { ref, onMounted } from "vue";
import { UserStore } from "../../../stores/Admin/user.store";
const store_user = UserStore();
import { storeToRefs } from "pinia";
const { is_modal, model, departments, permissions, roles } =
  storeToRefs(store_user);
const formRef = ref();
const Save = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_user.CreateUser(model.value);
    } else {
      return false;
    }
  });
};
const actions = ref([
  { id: 1, name: "Create", value: 1 },
  { id: 2, name: "Read", value: 2 },
  { id: 3, name: "Update", value: 3 },
  { id: 4, name: "Delete", value: 4 },
]);
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <el-dialog v-model="is_modal" title="Add user modal" width="600">
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
          <el-form-item label="Username" prop="username" :rules="rules">
            <el-input
              required
              v-model="model.username"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Password" prop="password" :rules="rules">
            <el-input
              required
              v-model="model.password"
              clearable
              class="w-[100%]"
              size="smal"
              type="Password"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Department" prop="department" :rules="rules">
            <el-select v-model="model.department" placeholder="..." size="smal">
              <el-option
                v-for="item in departments"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Role" prop="role" :rules="rules">
            <el-select v-model="model.role" placeholder="..." size="smal">
              <el-option
                v-for="item in roles"
                :key="item._id"
                :label="item.role_name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Permissions" prop="permissions" :rules="rules">
            <el-select
              v-model="model.permissions"
              multiple
              collapse-tags
              placeholder="..."
              size="smal"
            >
              <el-option
                v-for="item in permissions"
                :key="item._id"
                :label="item.permission_name"
                :value="item.permission_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Actions" prop="actions" :rules="rules">
            <el-select
              v-model="model.actions"
              multiple
              collapse-tags
              placeholder="..."
              size="smal"
            >
              <el-option
                v-for="item in actions"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
