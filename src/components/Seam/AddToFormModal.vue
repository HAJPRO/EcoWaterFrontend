<script setup>
import { ref, onMounted } from "vue";
import { SeamStore } from "../../stores/Seam/seam.store";
const store_seam = SeamStore();
import { HelpersStore } from "../../stores/Helpers/helper.store";
const store_heloers = HelpersStore();
import { storeToRefs } from "pinia";
const { form_modal, model } = storeToRefs(store_seam);
const { material_names } = storeToRefs(store_heloers);
const unites = ref([
  { id: 1, name: "dona" },
  { id: 2, name: "pachka" },
  { id: 3, name: "metr" },
  { id: 4, name: "kg" },
  { id: 5, name: "tonna" },
]);
const colors = ref([
  { id: 1, name: "qizil" },
  { id: 2, name: "yashil" },
  { id: 3, name: "sariq" },
  { id: 4, name: "jigar" },
  { id: 5, name: "qora" },
]);
const sorts = ref([
  { id: 1, name: "sort 1" },
  { id: 2, name: "sort 2" },
  { id: 3, name: "sort 3" },
]);
const formRef = ref();
const Save = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_seam.CreaetToForm(model.value);
    } else {
      return false;
    }
  });
};
const PlusMaterialName = () => {
  store_heloers.PlusMaterialNameModal();
};
const ChangeMaterialName = (value) => {
  model.material_name = value;
};
const PlusColor = () => {
  store_heloers.PlusMaterialNameModal();
};
const ChangeColor = (value) => {
  model.color = value;
};

const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <el-dialog v-model="form_modal" title="Bichuvga mato chiqarish  " width="800">
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
            label="Partya nomeri"
            prop="party_number"
            :rules="rules"
          >
            <el-input
              required
              v-model="model.party_number"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Buyurtmachi" prop="customer_name" :rules="rules">
            <el-input
              required
              v-model="model.customer_name"
              clearable
              class="w-[100%]"
              size="smal"
              type="text"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Mato nomi" prop="material_name" :rules="rules">
            <el-input
              required
              v-model="model.material_name"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #prepend>
                <div class="w-[8px] items-start text-center">
                  <i
                    @click="PlusMaterialName()"
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="model.material_name"
                  @change="ChangeMaterialName($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in material_names"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Rangi" prop="color" :rules="rules">
            <el-input
              required
              v-model="model.color"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #prepend>
                <div class="w-[8px] items-start text-center">
                  <i
                    @click="PlusColor()"
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="model.color"
                  @change="ChangeColor($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in colors"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </div>
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
            <el-input
              required
              v-model="model.unit"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #prepend>
                <div class="w-[8px] items-start text-center">
                  <i
                    @click="PlusUnit()"
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="model.unit"
                  @change="ChangeUnit($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in unites"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Sort" prop="sort" :rules="rules">
            <el-input
              required
              v-model="model.sort"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #prepend>
                <div class="w-[8px] items-start text-center">
                  <i
                    @click="PlusSort()"
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="model.sort"
                  @change="ChangeSort($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in sorts"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-input>
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
