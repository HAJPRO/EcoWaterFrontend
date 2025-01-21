<script setup>
import { onMounted, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import Title from "@/components/Title.vue";
import { SeamInFormStore } from "../../../stores/Seam/Form/form.store.js";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
import { ToastifyService } from "../../../utils/Toastify.js";
const { reports, model } = storeToRefs(store_form);
const isActive = ref(1);
const ActiveTabLink = (data) => {
  store_form.GetOneReportPastal(data);
  isActive.value = data.index;
};

const report_box = ref({
  pastal_quantity: "",
  head_pack: "",
  waste_quantity: "",
  fact_gramage: "",
  products: [],
});
const formRef = ref();
const AddReportData = async (formRef) => {
  await formRef.validate((valid) => {
    if (matchPastal.value === true) {
      return ToastifyService.ToastError({
        msg: "Mahsulot yetarli emas !",
      });
    }
    if (
      valid === true &&
      model.value.pastal_quantity > 0 &&
      model.value.head_pack > 0 &&
      model.value.waste_quantity > 0 &&
      model.value.quantity > 0 &&
      matchPastal.value === false
    ) {
      store_form.GetOneReportPastal();
      const product = ref({
        id: uuidv4(),
        model_name: model.value.model_name,
        quantity: model.value.quantity,
        size: model.value.size,
        unit: model.value.unit,
        date: new Date(),
      });
      report_box.value.products.push(product.value);
      FaktgramajCalculator();
    } else {
      return ToastifyService.ToastError({
        msg: "Mahsulot qo'shilmagan yoki qiymat manfiy kiritildi!",
      });
    }
  });
};
const total = ref("");
const FaktgramajCalculator = () => {
  const initialValue = ref(0);
  total.value = report_box.value.products.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue.quantity),
    initialValue.value
  );
  model.value.fact_gramage =
    Number(model.value.pastal_quantity) / Number(total.value);
  report_box.value.pastal_quantity = model.value.pastal_quantity;
  report_box.value.head_pack = model.value.head_pack;
  report_box.value.waste_quantity = model.value.waste_quantity;
  report_box.value.fact_gramage = model.value.fact_gramage;
};
const matchPastal = ref(false);
const MatchPastal = (data) => {
  if (reports.value.report.info) {
    const match = reports.value.report.info.quantity - data;
    if (match >= 0) {
      matchPastal.value = false;
    } else {
      matchPastal.value = true;
    }
  } else {
    return;
  }
};
const Save = async () => {
  try {
    if (report_box.value.products.length <= 0) {
      return ToastifyService.ToastError({ msg: "Mahsulot qo'shilmagan !" });
    } else {
      await store_form.CreateDayReport(report_box.value);
      report_box.value = {
        pastal_quantity: "",
        head_pack: "",
        waste_quantity: "",
        fact_gramage: "",
        products: [],
      };
      model.value = {};
    }
  } catch (error) {
    return ToastifyService.ToastError({ msg: "Mahsulot qo'shilmagan !" });
  }
};
const Update = async (formRef) => {
  await formRef.validate((valid) => {
    if (matchPastal.value === true) {
      return ToastifyService.ToastError({
        msg: "Mahsulot yetarli emas !",
      });
    }
    if (
      valid === true &&
      model.value.pastal_quantity > 0 &&
      model.value.head_pack > 0 &&
      model.value.waste_quantity > 0 &&
      model.value.quantity > 0 &&
      matchPastal.value === false
    ) {
      store_form.UpdateReport(model.value);
    } else {
      return ToastifyService.ToastError({
        msg: "Mahsulot qo'shilmagan yoki qiymat manfiy kiritildi!",
      });
    }
  });
};
const is_update = ref(false);
const GetOneForUpdate = (id) => {
  is_update.value = true;
  store_form.GetOneForUpdate(id);
};
const CancelUpdate = () => {
  is_update.value = false;
  model.value = {};
  reports.value.update = false;
};
const ChangeModelName = (value) => {
  model.model_name = value;
};
const options = ref([
  { id: 1, name: "Hujy" },
  { id: 2, name: "Ko'ylak" },
  { id: 3, name: "Jinfir" },
]);
const units = ref([
  { id: 1, name: "Dona" },
  { id: 2, name: "Pachka" },
  { id: 3, name: "Kg" },
]);
const Type = (type) => {
  store_helpers.SelectType(type);
};
const Plus = (data) => {
  store_helpers.PlusModal(data);
};
const ChangeMaterialName = (value) => {
  model.pro_name = value;
};
const ChangeMaterialType = (value) => {
  model.pro_type = value;
};
const ChangeColor = (value) => {
  model.pro_color = value;
};
const ChangeUnit = (value) => {
  model.unit = value;
};

const deleteById = (id) => {
  const filterLoad = report_box.value.products.filter((item) => {
    return item.id !== id;
  });
  report_box.value.products = filterLoad;
  FaktgramajCalculator();
};
onMounted(async () => {
  try {
    ActiveTabLink();
  } catch (error) {}
});
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>

<template>
  <div>
    <el-dialog v-model="reports.is_modal" width="1300">
      <div class="bg-white p-1 text-[10px] rounded shadow">
        <div
          class="font-semibold rounded text-[15px] p-1 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887]"
        >
          <h3>Kesim hisobotini shakilantirish</h3>
        </div>
        <div
          v-if="reports.report.info"
          class="flex justify-between flex-wrap font-semibold rounded text-[12px] p-1 mt-2 bg-slate-100 shadow"
        >
          <div>Partya nomeri: {{ reports.report.info.party_number }}</div>
          <div>Buyurtmachi: {{ reports.report.info.customer_name }}</div>
          <div>Artikul: {{ reports.report.info.artikul }}</div>
        </div>
        <div class="box flex col-span-12 gap-2">
          <div class="left col-span-6 mt-2">
            <el-form
              :model="model"
              ref="formRef"
              label-width="auto"
              size="small"
              label-position="top"
              class="filter-box md:grid md:grid-cols-6 sm:flex sm:flex-wrap gap-1"
            >
              <div class="mb-1 col-span-2">
                <el-form-item
                  label="Pastal og'irligi (kg)"
                  prop="pastal_quantity"
                  :rules="rules"
                >
                  <el-input
                    @input="MatchPastal(model.pastal_quantity)"
                    :disabled="
                      report_box.products.length > 0 || reports.update === true
                    "
                    required
                    v-model="model.pastal_quantity"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="Number"
                    placeholder="..."
                  />
                  <div v-if="matchPastal === true" class="text-red-500">
                    Mahsulot yetarli emas! {{ reports.report.info.quantity
                    }}{{ reports.report.info.unit }} dan oshdi
                  </div>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-2">
                <el-form-item
                  label="To'p boshi (kg)"
                  prop="head_pack"
                  :rules="rules"
                >
                  <el-input
                    :disabled="report_box.products.length > 0"
                    required
                    v-model="model.head_pack"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="Number"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-2">
                <el-form-item
                  label="Qiyqim (kg)"
                  prop="waste_quantity"
                  :rules="rules"
                >
                  <el-input
                    :disabled="report_box.products.length > 0"
                    required
                    v-model="model.waste_quantity"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="Number"
                    placeholder="..."
                  />
                </el-form-item>
              </div>

              <div class="mb-1 col-span-3">
                <el-form-item label="Madel" prop="model_name" :rules="rules">
                  <el-input
                    required
                    v-model="model.model_name"
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
                              title: `Madel qo'shish`,
                              state: `model_name`,
                            })
                          "
                          class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                        ></i>
                      </div>
                    </template>
                    <template #append>
                      <el-select
                        v-model="model.model_name"
                        @click="Type({ type: `model_name` })"
                        @change="ChangeModelName($event)"
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
              <div class="mb-1 col-span-3">
                <el-form-item label="Razmer" prop="size" :rules="rules">
                  <el-input
                    required
                    v-model="model.size"
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
                              title: `Madel qo'shish`,
                              state: `model_name`,
                            })
                          "
                          class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                        ></i>
                      </div>
                    </template>
                    <template #append>
                      <el-select
                        v-model="model.size"
                        @click="Type({ type: `model_name` })"
                        @change="ChangeModelName($event)"
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
              <div class="mb-1 col-span-2">
                <el-form-item label="Birligi" prop="unit" :rules="rules">
                  <el-select
                    required
                    size="smal"
                    v-model="model.unit"
                    clearable
                    placeholder="..."
                  >
                    <el-option
                      v-for="item in units"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-if="is_update === false" class="mb-1 col-span-2">
                <el-form-item label=".">
                  <el-button
                    size="smal"
                    @click="AddReportData(formRef)"
                    style="
                      background-color: #36d887;
                      color: white;
                      border: none;
                      margin-bottom: 4px;
                      width: 100%;
                    "
                    ><i class="mr-2 fa-solid fa-plus fa-sm"></i>Qo'shish
                  </el-button>
                </el-form-item>
              </div>
              <div
                v-if="is_update === true"
                class="mb-1 col-span-2 flex justify-between"
              >
                <el-form-item label=".">
                  <el-button
                    size="smal"
                    @click="Update(formRef)"
                    style="
                      background-color: #36d887;
                      color: white;
                      border: none;
                      margin-bottom: 4px;
                      width: 150px;
                    "
                    ><i class="mr-2 fa-solid fa-check fa-sm"></i>Yangilash
                  </el-button>
                </el-form-item>
                <el-form-item label=".">
                  <el-button
                    class="bg-red-500"
                    size="smal"
                    @click="CancelUpdate()"
                    style="
                      background-color: red;
                      color: white;
                      border: none;
                      margin-bottom: 4px;
                      width: 100%;
                    "
                    ><i class="fa-solid fa-xmark fa-sm"></i>
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="right col-span-6">
            <div class="mt-3 grid grid-cols-12 gap-2">
              <div class="col-span-12 shadow-md bg-white rounded min-h-[15px]">
                <div
                  class="flex justify-between flex-wrap font-semibold rounded text-[12px] p-1 bg-slate-100 shadow"
                >
                  <div>
                    Pastal:
                    {{
                      report_box.products.length > 0 ? model.pastal_quantity : 0
                    }}
                    kg
                  </div>
                  <div>
                    To'pboshi:
                    {{ report_box.products.length > 0 ? model.head_pack : 0 }}
                    kg
                  </div>
                  <div>
                    Qiyqim:
                    {{
                      report_box.products.length > 0 ? model.waste_quantity : 0
                    }}
                    kg
                  </div>
                </div>
                <el-table
                  :data="report_box.products"
                  load
                  class="w-full"
                  header-align="center"
                  style="width: 100%; font-size: 12px"
                  empty-text="Mahsulot tanlanmagan... "
                  border
                  height="160"
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
                    prop="model_name"
                    label="Model nomi"
                    width="200"
                    header-align="center"
                    align="center"
                  />

                  <el-table-column
                    prop="size"
                    label="Razmer"
                    width="100"
                    header-align="center"
                    align="center"
                  />

                  <el-table-column
                    prop="quantity"
                    label="Miqdori"
                    width="150"
                    header-align="center"
                    align="center"
                  />
                  <el-table-column
                    prop="unit"
                    label="Birligi"
                    width="100"
                    header-align="center"
                    align="center"
                  />
                  <el-table-column
                    prop="date"
                    label="Vaqt"
                    width="150"
                    header-align="center"
                    align="center"
                    ><template #default="scope"
                      ><div>
                        {{ String(scope.row.date).substring(0, 15) }}
                      </div></template
                    ></el-table-column
                  >

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
                        <i
                          class="text-black fa-sharp fa-solid fa-trash fa-xs"
                        ></i>
                      </router-link>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  class="flex justify-between flex-wrap font-semibold rounded text-[12px] p-1 bg-slate-100 shadow"
                >
                  <div>
                    Jami: {{ report_box.products.length > 0 ? total : 0 }}
                  </div>
                  <div>
                    Factgramaj:
                    {{
                      report_box.products.length > 0
                        ? model.fact_gramage.toFixed(3)
                        : 0
                    }}
                  </div>
                </div>
                <div class="flex justify-end col-span-4 p-1 mt-2 bg-white">
                  <el-button
                    size="smal"
                    @click="Save()"
                    style="
                      background-color: #36d887;
                      color: white;
                      border: none;
                      cursor: pointer;
                      padding: 15px;
                      width: 200px;
                    "
                  >
                    <i class="fa-solid fa-check mr-2 fa-md"></i> Saqlash
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="reports.report.form">
        <div
          class="font-semibold rounded text-[15px] p-1 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887] mt-2"
        >
          <h3>Hisobotlar</h3>
        </div>
        <div
          class="grid grid-cols-12 grid-flow-col justify-between bg-white rounded-md shadow-md p-2 mb-2"
        >
          <div
            v-if="reports.report.form"
            class="col-span-12 grid-flow-col flex-wrap"
          >
            <router-link
              v-for="(item, index) in reports.report.form"
              :key="item._id"
              to=""
              @click="ActiveTabLink({ index: index + 1, id: item._id })"
              :class="{ activeTab: isActive === index + 1 }"
              class="inline-flex text-[13px] mr-1 items-center px-4 py-1 mb-1 text-sm font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
            >
              <i class="fa-solid fa-info mr-2 fa-xm"></i> Pastal {{ index + 1 }}
            </router-link>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-12 gap-2">
          <div
            class="col-span-3 h-[208px] shadow-md rounded-md bg-white text-center text-slate-500 font-semibold text-[14px] p-4 cursor-pointer border-t-[1px] border-b-[1px] border-[#36d887]"
          >
            <div class="mt-3 bg-slate-200 p-2 rounded">
              Pastal:
              {{
                reports.product.form.length > 0
                  ? reports.product.form[0].pastal_quantity
                  : 0
              }}
              kg
            </div>
            <div class="mt-4 bg-slate-200 p-2 rounded">
              To'pboshi:
              {{
                reports.product.form.length > 0
                  ? reports.product.form[0].head_pack
                  : 0
              }}
              kg
            </div>
            <div class="mt-4 bg-slate-200 p-2 rounded">
              Qiyqim:
              {{
                reports.product.form.length > 0
                  ? reports.product.form[0].waste_quantity
                  : 0
              }}
              kg

              <!-- <div v-if="reports.product.form[0]" class="flex justify-end">
                <i
                  class="text-black fa-sharp fa-solid fa-pen fa-xs mr-2 mt-[-10px] hover:bg-slate-300"
                ></i>
              </div> -->
            </div>
          </div>
          <div class="col-span-9 shadow-md bg-white rounded min-h-[15px]">
            <el-table
              :data="reports.product.products"
              load
              show-summary
              class="w-full"
              header-align="center"
              style="width: 100%; font-size: 12px"
              empty-text="Mahsulot tanlanmagan... "
              border
              height="180"
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
                prop="model_name"
                label="Model nomi"
                width="200"
                header-align="center"
                align="center"
              />

              <el-table-column
                prop="size"
                label="Razmer"
                width="100"
                header-align="center"
                align="center"
              />

              <el-table-column
                sortable
                prop="quantity"
                label="Miqdori"
                width="150"
                header-align="center"
                align="center"
              />
              <el-table-column
                prop="unit"
                label="Birligi"
                width="150"
                header-align="center"
                align="center"
              />
              <el-table-column
                prop="date"
                label="Vaqt"
                width="200"
                header-align="center"
                align="center"
                ><template #default="scope"
                  ><div>
                    {{ String(scope.row.date).substring(0, 10) }}
                  </div></template
                ></el-table-column
              >

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
                    @click="GetOneForUpdate(scope.row._id)"
                    class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                  >
                    <i class="text-black fa-sharp fa-solid fa-pen fa-xs"></i>
                  </router-link>
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
            <div
              class="flex justify-between flex-wrap font-semibold rounded text-[12px] p-1 bg-slate-100 shadow"
            >
              <!-- <div>Jami: {{ reports.product.form ? reports.total : 0 }}</div> -->
              <div></div>
              <div>
                Factgramaj:
                {{
                  reports.product.form.length > 0
                    ? reports.product.form[0].fact_gramage.toFixed(3)
                    : 0
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.activeTab {
  border-bottom: 2px solid #36d887;
}
</style>
