<script setup>
import { onMounted, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import Title from "@/components/Title.vue";
import { SeamInFormStore } from "../../../../stores/Seam/Form/form.store.js";
import { HelpersStore } from "../../../../stores/Helpers/helper.store.js";
const store_form = SeamInFormStore();
const store_helpers = HelpersStore();
import { storeToRefs } from "pinia";
import { ToastifyService } from "../../../../utils/Toastify.js";
const { reports } = storeToRefs(store_form);
const {} = storeToRefs(store_helpers);
const model = ref({
  id: uuidv4(),
  pastal_quantity: "",
  head_pack: "",
  waste_quantity: "",
  fact_gramage: "",
  model_name: "",
  quantity: "",
  size: "",
  unit: "",
  total: "",
  status: "Tasnifga yuborildi",
});
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
    if (valid === true) {
      const product = ref({
        id: uuidv4(),
        model_name: model.value.model_name,
        quantity: model.value.quantity,
        size: model.value.size,
        unit: model.value.unit,
        status: "Tasnifga yuborildi",
        date: new Date(),
      });

      (report_box.value.pastal_quantity = model.value.pastal_quantity),
        (report_box.value.head_pack = model.value.head_pack),
        (report_box.value.waste_quantity = model.value.waste_quantity),
        (report_box.value.fact_gramage = model.value.fact_gramage),
        report_box.value.products.push(product.value);
      FaktgramajCalculator();
    } else {
      return ToastifyService.ToastError({ msg: "Mahsulot qo'shilmagan !" });
    }
  });
};
const FaktgramajCalculator = () => {
  const initialValue = ref(0);
  model.value.total = report_box.value.products.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue.quantity),
    initialValue.value
  );
  model.value.fact_gramage =
    Number(model.value.pastal_quantity) / Number(model.value.total);
};
const Save = async () => {
  try {
    if (report_box.value.products.length <= 0) {
      return ToastifyService.ToastError({ msg: "Mahsulot qo'shilmagan !" });
    } else {
      console.log(report_box.value);
    }
  } catch (error) {}
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
    <Title>
      <template v-slot:title>
        <h3>Kesim hisobotini shakilantirish</h3>
      </template>
    </Title>
    <div class="bg-white p-1 text-[10px] rounded">
      <div
        class="flex justify-between flex-wrap font-semibold rounded text-[12px] p-1 bg-slate-100 shadow"
      >
        <div>Partya nomeri: {{ 0 }}</div>
        <div>Buyurtmachi: {{ 0 }}</div>
        <div>Artikul: {{ 0 }}</div>
      </div>
      <el-form
        :model="model"
        ref="formRef"
        label-width="auto"
        size="small"
        label-position="top"
        class="filter-box md:grid md:grid-cols-12 gap-2 sm:flex sm:flex-wrap p-1"
      >
        <div class="mb-1 col-span-4">
          <el-form-item
            label="Pastal og'irligi (kg)"
            prop="pastal_quantity"
            :rules="rules"
          >
            <el-input
              :disabled="report_box.products.length > 0"
              required
              v-model="model.pastal_quantity"
              clearable
              class="w-[100%]"
              size="smal"
              type="Number"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="mb-1 col-span-4">
          <el-form-item label="To'p boshi (kg)" prop="head_pack" :rules="rules">
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
        <div class="mb-1 col-span-4">
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
        <div class="mb-1 col-span-3">
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
        <div class="mb-1 col-span-3">
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
      </el-form>
      <div class="flex justify-end">
        <div></div>
        <el-button
          size="smal"
          @click="AddReportData(formRef)"
          style="
            background-color: #36d887;
            color: white;
            border: none;
            margin-bottom: 4px;
          "
          ><i class="mr-2 fa-solid fa-plus fa-sm"></i>Qo'shish
        </el-button>
      </div>
    </div>

    <div class="mt-3 grid grid-cols-12 gap-2">
      <div
        class="col-span-3 h-[220px] shadow-md rounded-md bg-white text-center text-slate-500 font-semibold text-[14px] p-4 cursor-pointer border-t-[1px] border-b-[1px] border-[#36d887]"
      >
        <div class="mt-5 bg-slate-200 p-2 rounded">
          Pastal og'irligi:
          {{ model.pastal_quantity ? model.pastal_quantity : 0 }} kg
        </div>
        <div class="mt-4 bg-slate-200 p-2 rounded">
          To'pboshi: {{ model.head_pack ? model.head_pack : 0 }} kg
        </div>
        <div class="mt-4 bg-slate-200 p-2 rounded">
          Qiyqim og'irligi :
          {{ model.waste_quantity ? model.waste_quantity : 0 }} kg
        </div>
      </div>
      <div class="col-span-9 shadow-md bg-white rounded min-h-[15px]">
        <el-table
          :data="report_box.products"
          load
          class="w-full"
          header-align="center"
          style="width: 100%; font-size: 12px"
          empty-text="Mahsulot tanlanmagan... "
          border
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
            prop="model_name"
            label="Model nomi"
            width="300"
            header-align="center"
            align="center"
          />

          <el-table-column
            prop="size"
            label="Razmer"
            width="200"
            header-align="center"
            align="center"
          />

          <el-table-column
            prop="quantity"
            label="Miqdori"
            width="200"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="unit"
            label="Birligi"
            width="280"
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
                {{ String(scope.row.date).substring(0, 10) }}
              </div></template
            ></el-table-column
          >

          <el-table-column
            fixed="right"
            prop="id"
            label=""
            width="150"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <router-link
                to=""
                @click="deleteById(scope.row.id)"
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
          v-if="report_box.products.length > 0"
          class="flex justify-between flex-wrap font-semibold rounded text-[12px] p-1 bg-slate-100 shadow"
        >
          <div>Jami: {{ model.total ? model.total : 0 }}</div>
          <div>Factgramaj: {{ model.fact_gramage.toFixed(3) }}</div>
        </div>
        <div class="flex justify-end col-span-10 p-1 bg-white">
          <el-button
            size="smal"
            @click="Save()"
            style="
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
  </div>
</template>
