<script setup>
import { ref, onMounted } from "vue";
import { SeamFormWarehouseStore } from "../../../stores/Seam/FormWarehouse/warehouse.store";
const store_form_warehouse = SeamFormWarehouseStore();
import { HelpersStore } from "../../../stores/Helpers/helper.store";
const store_heloers = HelpersStore();
import { storeToRefs } from "pinia";
const { modal } = storeToRefs(store_form_warehouse);

const { options } = storeToRefs(store_heloers);
const output = ref({
  to_where: "",
  quantity: "",
  type: "",
  unit: modal.value.model.warehouse.unit,
  id: modal.value.card_id,
});
const whare_options = ref([
  { id: 1, name: "Bichuv skladga" },
  { id: 2, name: `Bo'yoq skladga` },
]);
const type_options = ref([
  { id: 1, name: "Mahsulot chiqarish", value: -1 },
  { id: 2, name: `Mahsulot kiritish`, value: 1 },
]);
const formRef = ref();
const Save = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_form_warehouse.Create({ model: output.value, output: true });
    } else {
      return false;
    }
  });
};
const Type = (type) => {
  output.value.type = value;
};
const Plus = (data) => {
  store_heloers.PlusModal(data);
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
  <el-dialog v-model="modal.is_modal" :title="modal.title" width="900">
    <span>
      <el-form
        :model="output"
        ref="formRef"
        label-width="auto"
        size="small"
        label-position="top"
        class="filter-box md:grid md:grid-cols-12 gap-2 sm:flex sm:flex-wrap rounded shadow-md bg-white p-2 mt-1 mb-1 text-[12px]"
      >
        <div class="mb-1 col-span-3">
          <el-form-item label="Qayerga" prop="to_where" :rules="rules">
            <el-input
              required
              v-model="output.to_where"
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
        <div class="mb-1 col-span-3">
          <el-form-item label="Turi" prop="type" :rules="rules">
            <el-input
              required
              v-model="output.type"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            >
              <template #append>
                <el-select
                  v-model="output.type"
                  @click="Type({ type: `unit` })"
                  @change="ChangeType($event)"
                  size="smal"
                  style="width: 40px"
                >
                  <el-option
                    v-for="item in type_options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div
        class="flex justify-between flex-wrap font-semibold text-[11px] p-1 bg-slate-100 shadow"
      >
        <div class="mt-1">
          Party num:{{ modal.model.warehouse.party_number }}
        </div>
        <div class="mt-1">Artikul:{{ modal.model.warehouse.artikul }}</div>
        <div class="mt-1">
          Buyurtmachi:{{ modal.model.warehouse.customer_name }}
        </div>
      </div>
      <el-table
        :data="modal.model.input"
        load
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
          label="Qabul qiluvchi"
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
        <el-table-column align="center" header-align="center" width="100"
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
        <div>Chiqarilgan : {{ modal.input_total }}</div>

        <div>
          Skladda qoldi:
          {{ modal.model.warehouse.quantity }}
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
