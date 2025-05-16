<script setup>
import { ref, onMounted } from "vue";
import { RoleStore } from "../../../../stores/Admin/role.store";
import { PermissionStore } from "../../../../stores/Admin/permission.store";

const store_role = RoleStore();
const store_permission = PermissionStore();

import { storeToRefs } from "pinia";
const { role_modal, model } = storeToRefs(store_role);
const { permissions } = storeToRefs(store_permission);

const dialogWidth = ref("");
window.addEventListener("devicemotion", () => {
  dialogWidth.value =
    window.innerWidth > 1400
      ? "1300"
      : window.innerWidth > 1000
      ? "1000"
      : window.innerWidth > 800
      ? "800"
      : window.innerWidth > 600
      ? "600"
      : "450";
});
window.addEventListener("resize", () => {
  dialogWidth.value =
    window.innerWidth > 1400
      ? "1500"
      : window.innerWidth > 1000
      ? "1000"
      : window.innerWidth > 800
      ? "800"
      : window.innerWidth > 600
      ? "600"
      : "450";
});
const formRef = ref();
const Save = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_role.Create(model.value);
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
  <el-dialog v-model="role_modal" :width="dialogWidth">
    <span>
      <div
        class="bg-slate-100 font-semibold text-[15px] p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
      >
        <i class="fa-solid fa-shield fa-md mr-3"></i> Rol qo'shish
      </div>
      <el-form
        :model="model"
        ref="formRef"
        label-width="auto"
        size="small"
        label-position="top"
        class="filter-box md:grid md:grid-cols-12 gap-2 sm:flex sm:flex-wrap rounded shadow-md bg-white p-2 mt-1 mb-1 text-[12px]"
      >
        <div class="mb-1 col-span-4">
          <el-form-item label="Rol nomi" prop="name" :rules="rules">
            <el-input
              required
              v-model="model.name"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Value" prop="value" :rules="rules">
            <el-input
              required
              v-model="model.value"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Ruxsatlar" prop="permissions" :rules="rules">
            <el-select
              multiple
              v-model="model.permissions"
              placeholder="..."
              size="smal"
              style="width: 100%"
              @click="Type({ type: `color` })"
              @change="ChangeNeighborhood($event)"
            >
              <template #prefix>
                <i
                  @click.stop="
                    Plus({
                      title: `Mato rangi qo'shish`,
                      state: `doc_type`,
                    })
                  "
                  class="fa-solid fa-plus cursor-pointer"
                ></i>
              </template>
              <el-option
                v-for="item in permissions"
                :key="item._id"
                :label="item.name"
                :value="item.name"
              >
                <template #default>
                  <div class="flex justify-between items-center w-full">
                    <span>{{ item.name }}</span>
                    <div class="text-red-500 cursor-pointer">
                      <span>{{ item.value }}</span>
                    </div>
                  </div>
                </template>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-12">
          <el-form-item label="Qo'shimcha ma'lumot" prop="discription">
            <el-input
              type="textarea"
              v-model="model.description"
              placeholder="Bu yerga yozing..."
              :rows="4"
              clearable
            />
          </el-form-item>
        </div>
      </el-form>
      <div class="flex justify-end bg-[#e8eded] p-2 rounded">
        <el-button
          @click="Save(formRef)"
          style="
            width: 190px;
            background-color: #36d887;
            color: white;
            border: none;
            cursor: pointer;
            padding: 15px;
          "
        >
          <i class="fa-solid fa-check mr-2 fa-md"></i>Saqlash
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>
