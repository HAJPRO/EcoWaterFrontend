<script setup>
import { ref } from "vue";
import { SaleStore } from "../../stores/Sale/sale.store";
const store_sale = SaleStore();
import { storeToRefs } from "pinia";
const { plus_type_modal, plus_name_modal } = storeToRefs(store_sale);
const proRef = ref();
const PlusName = async () => {
  await store_sale.CreateProName(model.value);
};
const CreateName = async (proRef) => {
  await proRef.validate((valid) => {
    if (valid === true) {
      PlusName();
      model.value = {
        code: "",
        name: "",
      };
    } else {
      return false;
    }
  });
};
const typeRef = ref();
const PlusType = async () => {
  await store_sale.CreateProType(model.value);
};
const CreateType = async (proRef) => {
  await proRef.validate((valid) => {
    if (valid === true) {
      PlusType();
      model.value = {
        code: "",
        name: "",
      };
    } else {
      return false;
    }
  });
};

const model = ref({
  code: "",
  name: "",
});
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>

<template>
  <el-dialog
    v-model="plus_type_modal"
    title="Mahsulot tur qo'shish "
    width="500"
  >
    <span>
      <el-form
        ref="proRef"
        :model="model"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-10 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="mb-1 col-span-5">
          <el-form-item label="Kod" prop="code" :rules="rules">
            <el-input
              required
              v-model="model.code"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
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
              placeholder="..."
            />
          </el-form-item>
        </div>
      </el-form>
      <div class="flex justify-end mb-1 col-span-5">
        <div></div>
        <el-button
          size="small"
          @click="CreateName(proRef)"
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
  <el-dialog
    v-model="plus_name_modal"
    title="Mahsulot nom qo'shish "
    width="500"
  >
    <span>
      <el-form
        ref="typeRef"
        :model="model"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-10 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="mb-1 col-span-5">
          <el-form-item label="Kod" prop="code" :rules="rules">
            <el-input
              required
              v-model="model.code"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
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
              placeholder="..."
            />
          </el-form-item>
        </div>
      </el-form>
      <div class="flex justify-end mb-1 col-span-5">
        <div></div>
        <el-button
          size="small"
          @click="CreateType(typeRef)"
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
