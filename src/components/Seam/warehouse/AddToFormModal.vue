<script setup>
import { onMounted, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { SeamWarehouseStore } from "../../../stores/Seam/Warehouse/warehouse.store";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "./../../../utils/Loader";
import { HelpersStore } from "../../../stores/Helpers/helper.store";
const store_warehouse = SeamWarehouseStore();
const store_helpers = HelpersStore();
import { storeToRefs } from "pinia";
const { modal, is_create_modal } = storeToRefs(store_warehouse);
const { options, is_modal } = storeToRefs(store_helpers);
const Type = (type) => {
  store_helpers.SelectType(type);
};

const ChangeMaterialName = (value) => {
  modal.value.model.material_name = value;
};
const ChangeMaterialType = (value) => {
  modal.value.model.material_type = value;
};
const ChangeColor = (value) => {
  modal.value.model.color = value;
};
const ChangeUnit = (value) => {
  modal.value.model.unit = value;
};

const order = ref({
  input: [],
  customer_name: "",
  order_number: "",
  artikul: "",
});
const formRef = ref();
const PlusValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      PlusOrder();
    } else {
      return false;
    }
  });
};
const PlusOrder = async () => {
  try {
    order.value.input.push({
      id: uuidv4(),
      material_name: modal.value.model.material_name,
      material_type: modal.value.model.material_type,
      color: modal.value.model.color,
      width: modal.value.model.width,
      grammage: modal.value.model.grammage,
      unit: modal.value.model.unit,
      quantity: modal.value.model.quantity,
    });

    order.value.customer_name = modal.value.model.customer_name;
    order.value.order_number = modal.value.model.order_number;
    order.value.artikul = modal.value.model.artikul;
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
};
const Save = async () => {
  try {
    if (order.value.input.length <= 0) {
      return ToastifyService.ToastError({ msg: "Mahsulot qo'shilmagan !" });
    } else {
      store_warehouse.create(order.value);
      order.value.input = [];
      modal.value.model = {};
    }
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
};
const deleteById = (id) => {
  const filterLoad = order.value.input.filter((item) => {
    return item.id !== id;
  });
  order.value.input = filterLoad;
};
onMounted(async () => {
  try {
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.message });
  }
});
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <div>
    <el-dialog v-model="modal.is_modal" width="1200">
      <span>
        <div
          class="bg-slate-100 font-semibold text-[15px] p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          Skladga mahsulot qo'shish
        </div>
        <el-form
          ref="formRef"
          :model="modal.model"
          label-width="auto"
          class="filter-box bg-white md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
          size="small"
          label-position="top"
        >
          <div class="mb-1 col-span-2">
            <el-form-item
              label="Buyurtmachi nomi"
              prop="customer_name"
              :rules="rules"
            >
              <el-input
                required
                v-model="modal.model.customer_name"
                clearable
                class="w-[100%]"
                size="smal"
                type="String"
                placeholder="..."
              />
            </el-form-item>
          </div>
          <div class="mb-1 col-span-2">
            <el-form-item label="Artikul" prop="artikul" :rules="rules">
              <el-input
                required
                v-model="modal.model.artikul"
                clearable
                class="w-[100%]"
                size="smal"
                type="String"
                placeholder="..."
              />
            </el-form-item>
          </div>
          <div class="mb-1 col-span-2">
            <el-form-item
              label="Buyurtma nomeri"
              prop="order_number"
              :rules="rules"
            >
              <el-input
                required
                v-model="modal.model.order_number"
                clearable
                class="w-[100%]"
                size="smal"
                type="String"
                placeholder="..."
              />
            </el-form-item>
          </div>
          <div class="mb-1 col-span-2">
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
          <div class="mb-1 col-span-2">
            <el-form-item label="Mato turi" prop="material_type" :rules="rules">
              <el-input
                required
                v-model="modal.model.material_type"
                clearable
                class="w-[100%]"
                size="smal"
                type="String"
                placeholder="..."
              >
                <template #append>
                  <el-select
                    v-model="modal.model.material_type"
                    @click="Type({ type: `material_type` })"
                    @change="ChangeMaterialType($event)"
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
          <div class="mb-1 col-span-2">
            <el-form-item label="Mato rangi" prop="color" :rules="rules">
              <el-input
                required
                v-model="modal.model.color"
                clearable
                class="w-[100%]"
                size="smal"
                type="String"
                placeholder="..."
              >
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
          <div class="mb-1 col-span-2">
            <el-form-item label="Eni" prop="width" :rules="rules">
              <el-input
                required
                v-model="modal.model.width"
                clearable
                class="w-[100%]"
                size="smal"
                type="Number"
                placeholder="..."
              />
            </el-form-item>
          </div>
          <div class="mb-1 col-span-3">
            <el-form-item label="Grammage" prop="grammage" :rules="rules">
              <el-input
                required
                v-model="modal.model.grammage"
                clearable
                class="w-[100%]"
                size="smal"
                type="Number"
                placeholder="..."
              />
            </el-form-item>
          </div>
          <div class="mb-1 col-span-3">
            <el-form-item
              label="Buyurtma miqdori"
              prop="quantity"
              :rules="rules"
            >
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
          <div class="mb-1 col-span-2">
            <el-form-item label="Birlik" prop="unit" :rules="rules">
              <el-input
                required
                v-model="modal.model.unit"
                clearable
                class="w-[100%]"
                size="smal"
                type="String"
                placeholder="..."
              >
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

          <div class="mb-1 col-span-2">
            <el-form-item label=".">
              <el-button
                @click="PlusValidate(formRef)"
                style="
                  background-color: #36d887;
                  color: white;
                  border: none;
                  cursor: pointer;
                  width: 100%;
                  padding: 15px;
                "
              >
                <i class="fa-solid fa-plus mr-2 fa-md"></i> Qo'shish
              </el-button>
            </el-form-item>
          </div>
        </el-form>
        <div class="mt-3 grid grid-cols-12 gap-2">
          <div
            class="col-span-3 min-h-[100px] max-h-[200px]shadow-md rounded-md bg-white text-center text-slate-500 font-semibold text-[14px] p-4 cursor-pointer border-t-[1px] border-b-[1px] border-[#36d887]"
          >
            <div class="mt-2 bg-[#e8eded] p-2 rounded">
              Buyurtma nomeri: {{ modal.model.order_number }}
            </div>
            <div class="mt-4 bg-[#e8eded] p-2 rounded">
              Buyurtmachi: {{ modal.model.customer_name }}
            </div>
            <div class="mt-4 bg-[#e8eded] p-2 rounded">
              Artikul: {{ modal.model.artikul }}
            </div>
          </div>
          <div class="col-span-9 shadow-md bg-white rounded min-h-[15px]">
            <el-table
              :header-cell-style="{
                background: '#e8eded',
                border: '0.2px solid #e1e1e3',
              }"
              load
              style="font-size: 12px"
              size="small"
              class="w-full"
              header-align="center"
              empty-text="Mahsulot tanlanmagan... "
              border
              height="150"
              :data="order.input"
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
                prop="material_name"
                label="Nomi"
                width="150"
                header-align="center"
                align="center"
              />

              <el-table-column
                prop="material_type"
                label="Turi"
                width="150"
                header-align="center"
                align="center"
              />

              <el-table-column
                prop="color"
                label="Rangi"
                width="150"
                header-align="center"
                align="center"
              />
              <el-table-column
                prop="width"
                label="Eni"
                width="150"
                header-align="center"
                align="center"
              />
              <el-table-column
                prop="grammage"
                label="Grammage"
                width="150"
                header-align="center"
                align="center"
              />
              <el-table-column
                fixed="right"
                prop="order_quantity"
                label="Miqdori"
                width="150"
                header-align="center"
                align="center"
                ><template #default="scope"
                  ><div class="text-red-500">
                    {{ scope.row.quantity }} {{ scope.row.unit }}
                  </div></template
                ></el-table-column
              >
              <el-table-column
                prop="unit"
                label="Birligi"
                width="100"
                header-align="center"
                align="center"
              />

              <el-table-column
                fixed="right"
                prop="id"
                label=""
                width="120"
                header-align="center"
                align="center"
              >
                <template #default="scope">
                  <router-link
                    to=""
                    @click="deleteById(scope.row.id)"
                    class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                  >
                    <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
            <div class="flex justify-end col-span-10 p-1 bg-white">
              <el-button
                size="smal"
                @click="Save()"
                style="
                  width: 190px;
                  background-color: #36d887;
                  color: white;
                  border: none;
                  cursor: pointer;
                  padding: 15px;
                "
              >
                <i class="fa-solid fa-check mr-2 fa-md"></i> Saqlash
              </el-button>
            </div>
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
        <div class="dialog-footer"></div>
      </template>
    </el-dialog>
  </div>
</template>
