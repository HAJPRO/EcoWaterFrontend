<script setup>
import { ref, onMounted } from "vue";
import { SeamFormWarehouseStore } from "../../../stores/Seam/FormWarehouse/warehouse.store";
const store_form_warehouse = SeamFormWarehouseStore();
import { HelpersStore } from "../../../stores/Helpers/helper.store";
const store_helpers = HelpersStore();
import { storeToRefs } from "pinia";
const { modal } = storeToRefs(store_form_warehouse);

const { options } = storeToRefs(store_helpers);
const isActive = ref(1);
const ActiveTabLink = (id) => {
  isActive.value = id;
};
const output = ref({
  to_where: "",
  quantity: "",
  unit: modal.value.model.warehouse.unit,
  id: modal.value.card_id,
});
const whare_options = ref([
  { id: 1, name: "Bichuvga" },
  { id: 2, name: `Xom mato skladga` },
]);

const formRef = ref();
const Save = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_form_warehouse.CreateOutput({ model: output.value, output: true });
    } else {
      return false;
    }
  });
};
const Type = (type) => {
  store_helpers.SelectType(type);
};
const Plan = (type) => {
  output.value.type = value;
};
const Plus = (data) => {
  store_helpers.PlusModal(data);
};
const ChangeTowhere = (value) => {
  output.value.to_where = value;
};
const ChangeUnit = (value) => {
  output.value.unit = value;
};

const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
</script>
<template>
  <el-dialog v-model="modal.is_modal" width="900">
    <div class="flex justify-between text-[13px]">
      <div class="mt-1">Party num:{{ modal.model.warehouse.party_number }}</div>
      <div class="mt-1">Artikul:{{ modal.model.warehouse.artikul }}</div>
      <div class="mt-1">
        Buyurtmachi:{{ modal.model.warehouse.customer_name }}
      </div>
    </div>

    <div
      class="bg-slate-100 font-semibold p-1 text-[14px] mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
    >
      Mahsulot chiqarish
    </div>
    <span>
      <el-form
        :model="output"
        ref="formRef"
        label-width="auto"
        size="small"
        label-position="top"
        class="filter-box md:grid md:grid-cols-12 gap-2 sm:flex sm:flex-wrap rounded shadow-md bg-white p-2 mt-1 mb-1 text-[12px]"
      >
        <div class="mb-1 col-span-4">
          <el-form-item label="Qayerga" prop="to_where" :rules="rules">
            <el-input
              disabled
              required
              v-model="output.to_where"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #append>
                <el-select
                  v-model="output.to_where"
                  @click="Type({ type: `material_name` })"
                  @change="ChangeTowhere($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in whare_options"
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
              v-model="output.quantity"
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
            <el-input
              required
              v-model="output.unit"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #append>
                <el-select
                  v-model="output.unit"
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
              size="smal"
              style="border: none"
              @click="Save(formRef)"
              class="inline-flex text-[12px] w-screen items-center text-center px-3 py-1 mb-1 text-sm font-medium text-white bg-[#36d887] hover:bg-[#43e293] hover:text-white text-bold rounded"
            >
              <i class="mr-2 fa-solid fa-check fa-sm"></i>Yuborish</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <div
        class="flex justify-between flex-wrap font-semibold text-[11px] p-1 bg-slate-100 shadow"
      >
        <div>
          <router-link
            to=""
            @click="ActiveTabLink(1)"
            :class="{ activeTab: isActive === 1 }"
            class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
          >
            <i class="fa-solid fa-info mr-2 fa-xm"></i> Kiritilganlar
            <div class="flex flex-shrink-0 ml-2">
              <span
                class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-1 rounded"
              >
                <span class=" ">0</span>/{{
                  (all_length ? all_length.sale_length : 0) || 0
                }}</span
              >
            </div>
          </router-link>
          <router-link
            to=""
            @click="ActiveTabLink(2)"
            :class="{ activeTab: isActive === 2 }"
            class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
          >
            <i class="fa-solid fa-info mr-2 fa-xm"></i> Chiqarilganlar
            <div class="flex flex-shrink-0 ml-2">
              <span
                class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-1 rounded"
              >
                <span class=" ">0</span>/{{
                  (all_length ? all_length.sale_length : 0) || 0
                }}</span
              >
            </div>
          </router-link>
        </div>
      </div>
      <!-- // INPUT TABLE -->
      <div v-if="isActive === 1">
        <el-table
          :data="modal.model.input"
          load
          size="small"
          class="w-full"
          header-align="center"
          empty-text="Mahsulot tanlanmagan... "
          border
          style="font-size: 12px"
          min-height="300"
          max-height="300"
        >
          <el-table-column
            align="center"
            header-align="center"
            type="index"
            prop="index"
            fixed="left"
            label="№"
            width="60"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="from_where"
            label="Yuboruvchi"
            width="150"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="quantity"
            label="Miqdori"
            width="120"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="unit"
            label="Birligi"
            width="100"
          />
          <el-table-column
            align="center"
            header-align="center"
            label="Vaqti"
            width="150"
            ><template #default="scope">{{
              String(scope.row.transactionDateOutput).substring(0, 10)
            }}</template></el-table-column
          >
          <el-table-column
            align="center"
            header-align="center"
            label="Holati"
            width="200"
            ><template #default="scope">
              <router-link
                to=""
                class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
              >
                {{ scope.row.status }}
              </router-link>
            </template></el-table-column
          >
          <el-table-column
            fixed="right"
            align="center"
            header-align="center"
            width="100"
            ><template #default="">
              <router-link
                to=""
                class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#d7ebeb] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i
                  class="text-red fa-solid fa-pen fa-sm"
                ></i> </router-link></template
          ></el-table-column>
        </el-table>
        <div
          class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow"
        >
          <div>Kiritilgan : {{ modal.input_total }}</div>

          <div>
            Skladda bor:
            {{ modal.model.warehouse.quantity }}
          </div>
        </div>
      </div>
      <!-- /// -->
      <!-- //  OUTPUT TABLE -->
      <div v-if="isActive === 2">
        <el-table
          :data="modal.model.output"
          load
          size="small"
          class="w-full"
          header-align="center"
          empty-text="Mahsulot tanlanmagan... "
          border
          style="font-size: 12px"
          min-height="300"
          max-height="300"
        >
          <el-table-column
            align="center"
            header-align="center"
            type="index"
            prop="index"
            fixed="left"
            label="№"
            width="60"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="to_where"
            label="Qabul qiluvchi"
            width="150"
            ><template #default="scope">{{
              scope.row.to_where.substring(0, 6)
            }}</template></el-table-column
          >
          <el-table-column
            align="center"
            header-align="center"
            prop="quantity"
            label="Miqdori"
            width="120"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="unit"
            label="Birligi"
            width="100"
          />
          <el-table-column
            align="center"
            header-align="center"
            label="Vaqti"
            width="150"
            ><template #default="scope">{{
              String(scope.row.transactionDateOutput).substring(0, 10)
            }}</template></el-table-column
          >
          <el-table-column
            align="center"
            header-align="center"
            label="Holati"
            width="200"
            ><template #default="scope">
              <router-link
                to=""
                class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
              >
                {{ scope.row.status }}
              </router-link>
            </template></el-table-column
          >
          <el-table-column
            fixed="right"
            align="center"
            header-align="center"
            width="100"
            ><template #default="">
              <router-link
                to=""
                class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#d7ebeb] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
              >
                <i
                  class="text-red fa-solid fa-pen fa-sm"
                ></i> </router-link></template
          ></el-table-column>
        </el-table>
        <div
          class="flex justify-between flex-wrap font-semibold text-[12px] p-1 bg-slate-100 shadow"
        >
          <div>Chiqarilgan : {{ modal.output_total }}</div>

          <div>
            Skladda bor:
            {{ modal.model.warehouse.quantity }}
          </div>
        </div>
      </div>
    </span>
    <el-dialog
      v-model="innerVisible"
      width="600"
      title="Inner Dialog"
      append-to-body
    >
    </el-dialog>
    <template #footer> </template>
  </el-dialog>
</template>
<style>
.activeTab {
  border-bottom: 2px solid #36d887;
}
</style>
