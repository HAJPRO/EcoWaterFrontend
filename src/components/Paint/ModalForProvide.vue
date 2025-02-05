<script setup>
import { format } from "date-fns";
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
const ChangeYarnLength = (value) => {
  confirm_model.yarn_length = value;
};
const ChangePolisterType = (value) => {
  confirm_model.polister_type = value;
};
const ChangePusFieneType = (value) => {
  confirm_model.pus_fiene = value;
};
const ChangeColorPantonCode = (value) => {
  confirm_model.color_code = value;
};
const ChangeColorType = (value) => {
  confirm_model.color_type = value;
};
const RefProvide = ref();
const products = ref([]);

const RefWeaving = ref();
const weaving = ref([]);
const AddWeaving = async (RefWeaving) => {
  await RefWeaving.validate((valid) => {
    if (
      valid === true &&
      confirm_model.value.raw_material_quantity > 0 &&
      confirm_model.value.width > 0 &&
      confirm_model.value.grammage > 0
    ) {
      weaving.value.push({
        id: uuidv4(),
        material_name: confirm_model.value.material_name,
        material_type: confirm_model.value.material_type,
        raw_material_quantity: confirm_model.value.raw_material_quantity,
        width: confirm_model.value.width,
        grammage: confirm_model.value.grammage,
        yarn_length: confirm_model.value.yarn_length,
        polister_type: confirm_model.value.polister_type,
        pus_fiene: confirm_model.value.pus_fiene,
        color_code: confirm_model.value.color_code,
        color_type: confirm_model.value.color_type,
        print: confirm_model.value.print,
        description: confirm_model.value.description,
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
      accumulator + Number(currentValue.raw_material_quantity),
    initialValue.value
  );
  if (weaving.value.length > 0) {
    store.AcceptAndCreate({
      weaving_quantity: total.value,
      delivery_time_weaving: confirm_model.value.delivery_time_weaving,
      weaving: weaving.value,
    });

    is_provide.value = false;
    confirm_model.value = {};
  } else {
    return ToastifyService.ToastError({
      msg: "Kerakli mahsulotlar qo'shilmagan",
    });
  }
};
const deleteByIdWeaving = (id) => {
  const filterLoad = weaving.value.filter((item) => {
    return item.id !== id;
  });
  weaving.value = filterLoad;
};

const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <AddOptionModal v-if="is_modal === true" />
  <el-dialog v-model="is_provide" width="1200">
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
        <div class="col-span-3">
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
        <div class="col-span-3">
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
        <div class="col-span-3">
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
        <div class="col-span-3">
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
        <div class="col-span-3">
          <el-form-item label="Ip uzunligi" prop="yarn_length" :rules="rules">
            <el-input
              required
              v-model="confirm_model.yarn_length"
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
                        title: `Ip uzunligi qo'shish`,
                        state: `yarn_length`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.yarn_length"
                  @click="Type({ type: `yarn_length` })"
                  @change="ChangeYarnLength($event)"
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
        <div class="col-span-3">
          <el-form-item
            label="Polister turi"
            prop="polister_type"
            :rules="rules"
          >
            <el-input
              required
              v-model="confirm_model.polister_type"
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
                        title: `Polister tur qo'shish`,
                        state: `polister_type`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.polister_type"
                  @click="Type({ type: `polister_type` })"
                  @change="ChangePolisterType($event)"
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
        <div class="col-span-3">
          <el-form-item label="Pus/Fiene" prop="pus_fiene" :rules="rules">
            <el-input
              required
              v-model="confirm_model.pus_fiene"
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
                        title: `Pus/Fiene qo'shish`,
                        state: `pus_fiene`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.pus_fiene"
                  @click="Type({ type: `pus_fiene` })"
                  @change="ChangePusFieneType($event)"
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
        <div class="col-span-3">
          <el-form-item
            label="Rang/Panton kod"
            prop="color_code"
            :rules="rules"
          >
            <el-input
              required
              v-model="confirm_model.color_code"
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
                        title: `Rang/Panton kod qo'shish`,
                        state: `color_code`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.color_code"
                  @click="Type({ type: `color_code` })"
                  @change="ChangeColorPantonCode($event)"
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
        <div class="col-span-3">
          <el-form-item label="Bo'yoq turi" prop="color_type" :rules="rules">
            <el-input
              required
              v-model="confirm_model.color_type"
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
                        title: `Bo'yoq turi qo'shish`,
                        state: `color_type`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.color_type"
                  @click="Type({ type: `color_type` })"
                  @change="ChangeColorType($event)"
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
        <div class="col-span-3">
          <el-form-item label="Pechat" prop="print">
            <el-input
              v-model="confirm_model.print"
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
                        title: `Pechat qo'shish`,
                        state: `print`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.print"
                  @click="Type({ type: `print` })"
                  @change="ChangePrint($event)"
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
        <div class="col-span-3">
          <el-form-item
            label="Xom mato miqdori (kg)"
            prop="raw_material_quantity"
            :rules="rules"
          >
            <el-input
              v-model="confirm_model.raw_material_quantity"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-3">
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
        <div class="col-span-12">
          <el-form-item label="Tavfsif" prop="description">
            <el-input
              type="textarea"
              placeholder="Buyurtma haqida tavfsif kiritish..."
              v-model="confirm_model.description"
              maxlength="50"
              show-word-limit
            >
            </el-input>
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
              prop="yarn_length"
              label="Ip uzunligi"
              header-align="center"
              align="center"
              :min-width="150"
              :max-width="200"
            />
            <el-table-column
              prop="polister_type"
              label="Polister turi"
              header-align="center"
              align="center"
              :min-width="150"
              :max-width="200"
            />
            <el-table-column
              prop="pus_fiene"
              label="Pus/Fien"
              header-align="center"
              align="center"
              :min-width="150"
              :max-width="200"
            />
            <el-table-column
              prop="color_code"
              label="Rang kode"
              header-align="center"
              align="center"
              :min-width="150"
              :max-width="200"
            />
            <el-table-column
              prop="color_type"
              label="Bo'yoq turi"
              header-align="center"
              align="center"
              :min-width="150"
              :max-width="200"
            />
            <el-table-column
              prop="print"
              label="Pechat"
              header-align="center"
              align="center"
              :min-width="150"
              :max-width="200"
              ><template #default="scope"
                ><div>
                  {{ scope.row.print ? scope.row.print : "-" }}
                </div></template
              ></el-table-column
            >
            <el-table-column
              fixed="right"
              prop="raw_material_quantity"
              label="Xom mato miqdori"
              :min-width="150"
              :max-width="200"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="delivery_time_weaving"
              label="Muddati"
              :min-width="150"
              :max-width="200"
              header-align="center"
              align="center"
              ><template #default="scope">
                {{
                  format(scope.row.delivery_time_weaving, "dd.MM.yyyy HH:mm")
                }}
              </template></el-table-column
            >
            <el-table-column
              prop="description"
              label="Tavfsif"
              header-align="center"
              align="center"
              :min-width="300"
              :max-width="400"
              ><template #default="scope"
                ><div>
                  {{ scope.row.description ? scope.row.description : `-` }}
                </div></template
              ></el-table-column
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

    <el-dialog
      v-model="innerVisible"
      width="500"
      title="Inner Dialog"
      append-to-body
    >
      <span>This is the inner Dialog</span>
    </el-dialog>
    <template #footer>
      <div class="dialog-footer rounded">
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
