<script setup>
import { ref, onMounted } from "vue";
import { SeamWarehouseStore } from "../../../stores/Seam/Warehouse/warehouse.store";
const store_warehouse = SeamWarehouseStore();
import { HelpersStore } from "../../../stores/Helpers/helper.store";
const store_heloers = HelpersStore();
import { storeToRefs } from "pinia";
const { modal } = storeToRefs(store_warehouse);

const { options } = storeToRefs(store_heloers);

const formRef = ref();
const Save = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_warehouse.Create(modal.model.value);
    } else {
      return false;
    }
  });
};
const Type = (type) => {
  store_heloers.SelectType(type);
};
const Plus = (data) => {
  store_heloers.PlusModal(data);
};
const ChangeMaterialName = (value) => {
  modal.model.material_name = value;
};
const ChangeColor = (value) => {
  modal.model.color = value;
};

const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <el-dialog v-model="modal.is_modal" :title="modal.title" width="800">
    <span>
      <el-form
        :model="modal.model"
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
              v-model="modal.model.party_number"
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
              v-model="modal.model.customer_name"
              clearable
              class="w-[100%]"
              size="smal"
              type="text"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="Artikul" prop="artikul" :rules="rules">
            <el-input
              required
              v-model="modal.model.artikul"
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
              v-model="modal.model.material_name"
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
                        title: `Mato nomi qo'shish`,
                        state: `material_name`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="modal.model.material_name"
                  @click="Type({ type: `material_name` })"
                  @change="ChangeMaterialName($event)"
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
        <div class="mb-1 col-span-4">
          <el-form-item label="Rangi" prop="color" :rules="rules">
            <el-input
              required
              v-model="modal.model.color"
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
                      Plus({ title: `Rang nomi qo'shish`, state: `color` })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="modal.model.color"
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
        <div class="mb-1 col-span-4">
          <el-form-item label="Miqdori" prop="quantity" :rules="rules">
            <el-input
              required
              v-model="modal.model.quantity"
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
              v-model="modal.model.unit"
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
                      Plus({ title: `Birlik nomi qo'shish`, state: `unit` })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="modal.model.unit"
                  @click="Type({ type: `unit` })"
                  @change="ChangeUnit($event)"
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
        <div class="mb-1 col-span-4">
          <el-form-item label="Sort" prop="sort" :rules="rules">
            <el-input
              required
              v-model="modal.model.sort"
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
                      Plus({ title: `Sort nomi qo'shish`, state: `sort` })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="modal.model.sort"
                  @click="Type({ type: `sort` })"
                  @change="ChangeSort($event)"
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
