<script setup>
import { ref, onMounted } from "vue";
import { HelpersStore } from "../../stores/Helpers/helper.store";
const store = HelpersStore();
import { storeToRefs } from "pinia";
const { is_modal_name } = storeToRefs(store);
const MaterialRef = ref();
const CreateName = async (MaterialRef) => {
  await MaterialRef.validate((valid) => {
    if (valid === true) {
      store.CreateMaterialName(model.value);
      model.value = {
        department: "",
        name: "",
      };
    } else {
      return false;
    }
  });
};
const model = ref({
  department: "",
  name: "",
});
const departments = ref([
  { id: 1, name: "Sotuv" },
  { id: 2, name: "Bo'yoq" },
  { id: 3, name: "To'quv" },
  { id: 4, name: "Yigiruv" },
  { id: 5, name: "Tikuv" },
  { id: 6, name: "Taminot" },
]);

const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
onMounted(() => {});
</script>

<template>
  <el-dialog
    v-model="is_modal_name"
    title="Material nomi qo'shish "
    width="500"
  >
    <span>
      <el-form
        ref="MaterialRef"
        :model="model"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-10 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="mb-1 col-span-5">
          <el-form-item label="Bo'lim" prop="department" :rules="rules">
            <el-select
              v-model="model.department"
              required
              size="smal"
              style="width: 100%"
              placeholder="Bo'limni tanlang"
            >
              <el-option
                v-for="item in departments"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-5">
          <el-form-item label="Nomi" prop="name" :rules="rules">
            <el-input
              required
              v-model="model.name"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="Nomini kiriting"
            />
          </el-form-item>
        </div>
      </el-form>
      <div class="flex justify-end mb-1 col-span-5">
        <div></div>
        <el-button
          size="small"
          @click="CreateName(MaterialRef)"
          style="
            background-color: #36d887;
            color: white;
            border: none;
            cursor: pointer;
          "
        >
          <i class="fa-solid fa-check mr-2 fa-md"></i> Saqlash
        </el-button>
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
    <template #footer> </template>
  </el-dialog>
</template>
