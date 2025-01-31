<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { ToastifyService } from "../../utils/Toastify";
import { PaintPlanStore } from "../../stores/Paint/paintPlan.store";
import AddOptionModal from "../../components/Helpers/AddOptionsModal.vue";
const store = PaintPlanStore();
import { storeToRefs } from "pinia";
const { is_provide, confirm_model, card_id, item, detail } = storeToRefs(store);
import { HelpersStore } from "../../stores/Helpers/helper.store.js";
import { color } from "echarts";
const store_helpers = HelpersStore();
const { options, is_modal } = storeToRefs(store_helpers);
const Type = (type) => {
  store_helpers.SelectType(type);
};
const Plus = (data) => {
  store_helpers.PlusModal(data);
};
const ChangePusName = (value) => {
  confirm_model.pus_name = value;
};
const ChangePusType = (value) => {
  confirm_model.pus_type = value;
};
const ChangeFikeName = (value) => {
  confirm_model.fike_name = value;
};
const ChangeFikeType = (value) => {
  confirm_model.fike_type = value;
};
const RefProvide = ref();
const products = ref([]);
const AddProvide = async (RefProvide) => {
  await RefProvide.validate((valid) => {
    if (valid === true) {
      products.value.push({
        id: uuidv4(),
        pus_name: confirm_model.value.pus_name,
        pus_type: confirm_model.value.pus_type,
        pus_quantity: confirm_model.value.pus_quantity,
        fike_name: confirm_model.value.fike_name,
        fike_type: confirm_model.value.fike_type,
        fike_quantity: confirm_model.value.fike_quantity,
        color: confirm_model.value.color,
        color_quantity: confirm_model.value.color_quantity,
        delivery_time_provide: confirm_model.value.delivery_time_provide,
      });
    } else {
      return false;
    }
  });
};
const RefWeaving = ref();
const weaving = ref([]);
const AddWeaving = async (RefWeaving) => {
  await RefWeaving.validate((valid) => {
    if (
      valid === true &&
      confirm_model.value.order_quantity > 0 &&
      confirm_model.value.width > 0 &&
      confirm_model.value.grammage > 0
    ) {
      weaving.value.push({
        id: uuidv4(),
        material_name: confirm_model.value.material_name,
        material_type: confirm_model.value.material_type,
        order_quantity: confirm_model.value.order_quantity,
        width: confirm_model.value.width,
        grammage: confirm_model.value.grammage,
        delivery_time_weaving: confirm_model.value.delivery_time_weaving,
      });
    } else {
      return false;
    }
  });
};
const total = ref();
const SaveToProvideAndAccept = async () => {
  const initialValue = ref(0);
  total.value = weaving.value.reduce(
    (accumulator, currentValue) =>
      accumulator + Number(currentValue.order_quantity),
    initialValue.value
  );
  if (products.value.length > 0 && weaving.value.length > 0) {
    store.AcceptAndCreate({
      weaving_quantity: total.value,
      delivery_time_weaving: confirm_model.value.delivery_time_weaving,
      products: products.value,
      weaving: weaving.value,
    });

    is_provide.value = false;
    confirm_model.value = {};
  } else {
    return ToastifyService.ToastError({
      msg: "Taminot uchun kerakli mahsulotlar qo'shilmagan",
    });
  }
};
const deleteByIdWeaving = (id) => {
  const filterLoad = weaving.value.filter((item) => {
    return item.id !== id;
  });
  weaving.value = filterLoad;
};
const deleteByIdProvide = (id) => {
  const filterLoad = products.value.filter((item) => {
    return item.id !== id;
  });
  products.value = filterLoad;
};
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <AddOptionModal v-if="is_modal === true" />
  <el-dialog v-model="is_provide" width="900">
    <span class="">
      <div
        class="font-semibold rounded text-[14px] p-1 mb-2 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887] mt-2"
      >
        <h3>To'quv uchun talabnoma qo'shish</h3>
      </div>

      <el-form
        ref="RefWeaving"
        :model="confirm_model"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="col-span-4">
          <el-form-item label="Mato nomi" prop="material_name" :rules="rules">
            <el-select
              v-model="confirm_model.material_name"
              size="smal"
              style="width: 100%"
              placeholder="..."
            >
              <el-option
                v-for="item in detail.sale_products"
                :key="item._id"
                :label="item.material_name"
                :value="item.material_name"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Mato turi" prop="material_type" :rules="rules">
            <el-select
              v-model="confirm_model.material_type"
              size="smal"
              style="width: 100%"
              placeholder="..."
            >
              <el-option
                v-for="item in detail.sale_products"
                :key="item._id"
                :label="item.material_type"
                :value="item.material_type"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Eni" prop="width" :rules="rules">
            <el-input
              v-model="confirm_model.width"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Grammage" prop="grammage" :rules="rules">
            <el-input
              v-model="confirm_model.grammage"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item
            label="Miqdori (kg)"
            prop="order_quantity"
            :rules="rules"
          >
            <el-input
              v-model="confirm_model.order_quantity"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item
            label="Muddati"
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
      <div class="flex justify-end">
        <el-button
          class="mr-2"
          size="smal"
          @click="AddWeaving(RefWeaving)"
          style="
            background-color: #36d887;
            color: white;
            border: none;
            width: 150px;
            margin-bottom: 4px;
            font-size: 12px;
          "
          ><i class="mr-2 fa-solid fa-plus fa-sm"></i>Qo'shish
        </el-button>
      </div>
      <div class="mt-3 grid grid-cols-12 gap-2">
        <div class="col-span-12 shadow-md bg-white rounded min-h-[15px]">
          <el-table
            :data="weaving"
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            class="w-full"
            header-align="center"
            style="width: 100%; font-size: 12px"
            empty-text="Mahsulot tanlanmagan... "
            border="true"
            height="150"
            size="small"
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
              label="Mato nomi"
              width="200"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="material_type"
              label="Mato turi"
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
            />
            <el-table-column
              prop="delivery_time_weaving"
              label="Muddati"
              width="200"
              header-align="center"
              align="center"
              ><template #default="scope">
                {{ String(scope.row.delivery_time_weaving).substring(0, 15) }}
              </template></el-table-column
            >

            <el-table-column
              prop="id"
              fixed="right"
              width="110"
              header-align="center"
              align="center"
              ><template #default="scope">
                <div>
                  <router-link
                    to=""
                    @click="deleteByIdWeaving(scope.row.id)"
                    class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                  >
                    <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                  </router-link>
                </div> </template
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </span>
    <div
      class="font-semibold rounded text-[14px] p-1 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887] mt-2"
    >
      <h3>Taminot uchun talabnoma qo'shish</h3>
    </div>
    <span>
      <el-form
        ref="RefProvide"
        :model="confirm_model"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="col-span-4">
          <el-form-item label="Pus nomi" prop="pus_name" :rules="rules">
            <el-input
              required
              v-model="confirm_model.pus_name"
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
                        title: `Pus nomini qo'shish`,
                        state: `pus_name`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.pus_name"
                  @click="Type({ type: `pus_name` })"
                  @change="ChangePusName($event)"
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
        <div class="col-span-4">
          <el-form-item label="Pus turi" prop="pus_type" :rules="rules">
            <el-input
              required
              v-model="confirm_model.pus_type"
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
                        title: `Pus turini qo'shish`,
                        state: `pus_type`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.pus_type"
                  @click="Type({ type: `pus_type` })"
                  @change="ChangePusType($event)"
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
        <div class="col-span-4">
          <el-form-item label="Pus (kg)" prop="pus_quantity" :rules="rules">
            <el-input
              v-model="confirm_model.pus_quantity"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Fike nomi" prop="fike_name" :rules="rules">
            <el-input
              required
              v-model="confirm_model.fike_name"
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
                        title: `Fike nomini qo'shish`,
                        state: `fike_name`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.fike_name"
                  @click="Type({ type: `fike_name` })"
                  @change="ChangeFikeName($event)"
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
        <div class="col-span-4">
          <el-form-item label="Fike turi" prop="fike_type" :rules="rules">
            <el-input
              required
              v-model="confirm_model.fike_type"
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
                        title: `Fike turini qo'shish`,
                        state: `fike_type`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.fike_type"
                  @click="Type({ type: `fike_type` })"
                  @change="ChangeFikeType($event)"
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
        <div class="col-span-4">
          <el-form-item label="Fike (kg)" prop="fike_quantity" :rules="rules">
            <el-input
              v-model="confirm_model.fike_quantity"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Rang nomi" prop="color" :rules="rules">
            <el-select
              v-model="confirm_model.color"
              size="smal"
              style="width: 100%"
              placeholder="..."
            >
              <el-option
                v-for="item in detail.sale_products"
                :key="item._id"
                :label="item.color"
                :value="item.color"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item
            label="Rang miqdori (kg)"
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

        <div class="col-span-4">
          <el-form-item
            label="Tayyorlash muddati"
            prop="delivery_time_provide"
            :rules="rules"
          >
            <el-date-picker
              :disabled="products.length > 0"
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
      <div class="flex justify-end">
        <el-button
          class="mr-2"
          size="smal"
          @click="AddProvide(RefProvide)"
          style="
            background-color: #36d887;
            color: white;
            border: none;
            width: 150px;
            margin-bottom: 4px;
            font-size: 12px;
          "
          ><i class="mr-2 fa-solid fa-plus fa-sm"></i>Qo'shish
        </el-button>
      </div>
      <div class="mt-2 grid grid-cols-12 gap-2">
        <div class="col-span-12 shadow-md bg-white rounded min-h-[15px]">
          <el-table
            :data="products"
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            class="w-full"
            header-align="center"
            style="width: 100%; font-size: 12px"
            empty-text="Mahsulot tanlanmagan... "
            border="true"
            height="150"
            size="small"
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
              prop="pus_name"
              label="Pus nomi"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="pus_type"
              label="Pus turi"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="pus_quantity"
              label="Pus miqdori"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="fike_name"
              label="Fike nomi"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="fike_type"
              label="Fike turi"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="fike_quantity"
              label="Fike miqdori"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="color"
              label="Rang nomi"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="color"
              label="Rang nomi"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="color_quantity"
              label="Rang miqdori"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="id"
              fixed="right"
              width="100"
              header-align="center"
              align="center"
              ><template #default="scope">
                <div>
                  <router-link
                    to=""
                    @click="deleteByIdProvide(scope.row.id)"
                    class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                  >
                    <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                  </router-link>
                </div> </template
            ></el-table-column>
          </el-table>
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
      <div class="dialog-footer bg-slate-100 shadow p-1 rounded">
        <el-button
          size="smal"
          @click="SaveToProvideAndAccept()"
          style="
            background-color: #36d887;
            color: white;
            border: none;
            margin-bottom: 4px;
            width: 100%;
            font-size: 12px;
          "
        >
          <i class="mr-2 fa-solid fa-check fa-sm"></i>Yuborish
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
