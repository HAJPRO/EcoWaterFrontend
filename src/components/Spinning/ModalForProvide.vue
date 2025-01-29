<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { ToastifyService } from "../../utils/Toastify";
import AddOptionModal from "../../components/Helpers/AddOptionsModal.vue";
import { storeToRefs } from "pinia";
import { WeavingPlanStore } from "../../stores/Weaving/weaving_plan.store";
import { HelpersStore } from "../../stores/Helpers/helper.store.js";
const weaving_store = WeavingPlanStore();
const { is_provide, confirm_model, card_id, item, detail } =
  storeToRefs(weaving_store);
const store_helpers = HelpersStore();
const { options, is_modal } = storeToRefs(store_helpers);
const Type = (type) => {
  store_helpers.SelectType(type);
};
const Plus = (data) => {
  store_helpers.PlusModal(data);
};
const ChangeYarnName = (value) => {
  confirm_model.yarns_name = value;
};
const ChangeYarnType = (value) => {
  confirm_model.yarns_type = value;
};
const ChangeLikra = (value) => {
  confirm_model.likra_type = value;
};
const ChangeMelaks = (value) => {
  confirm_model.melaks_type = value;
};
const ChangePolister = (value) => {
  confirm_model.polister_type = value;
};
const RefProvide = ref();
const products = ref([]);
const AddProvide = async (RefProvide) => {
  await RefProvide.validate((valid) => {
    if (
      valid === true &&
      confirm_model.value.likra_quantity > 0 &&
      confirm_model.value.melaks_quantity > 0 &&
      confirm_model.value.polister_quantity > 0
    ) {
      products.value.push({
        id: uuidv4(),
        likra_type: confirm_model.value.likra_type,
        likra_quantity: confirm_model.value.likra_quantity,
        melaks_type: confirm_model.value.melaks_type,
        melaks_quantity: confirm_model.value.melaks_quantity,
        polister_quantity: confirm_model.value.polister_quantity,
        polister_type: confirm_model.value.polister_type,
        delivery_time_provide: confirm_model.value.delivery_time_provide,
      });
    } else {
      return false;
    }
  });
};
const RefSpinning = ref();
const total_yarn = ref();
const spinning = ref([]);
const AddSpinning = async (RefSpinning) => {
  await RefSpinning.validate((valid) => {
    if (valid === true && confirm_model.value.yarn_qauntity > 0) {
      spinning.value.push({
        id: uuidv4(),
        yarn_name: confirm_model.value.yarn_name,
        yarn_type: confirm_model.value.yarn_type,
        yarn_quantity: confirm_model.value.yarn_qauntity,
        delivery_time_spinning: confirm_model.value.delivery_time_spinning,
      });
    } else {
      return false;
    }
  });
};
const total = ref();
const SaveToProvideAndAccept = async () => {
  const initialValue = ref(0);
  total.value = spinning.value.reduce(
    (accumulator, currentValue) =>
      accumulator + Number(currentValue.yarn_qauntity),
    initialValue.value
  );
  if (products.value.length > 0 && spinning.value.length > 0) {
    weaving_store.AcceptAndCreate({
      products: products.value,
      spinning: spinning.value,
    });
    is_provide.value = false;
    confirm_model.value = {};
  } else {
    return ToastifyService.ToastError({
      msg: "Taminot uchun kerakli mahsulotlar qo'shilmagan",
    });
  }
};
const deleteByIdProvide = (id) => {
  const filterLoad = products.value.filter((item) => {
    return item.id !== id;
  });
  products.value = filterLoad;
};
const deleteByIdSpinning = (id) => {
  const filterLoad = spinning.value.filter((item) => {
    return item.id !== id;
  });
  spinning.value = filterLoad;
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
    <div class="border-b-[1px] border-[#36d887]">
      <div
        class="font-semibold rounded text-[14px] p-1 mb-2 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887] mt-2"
      >
        <h3>Yigiruv uchun talabnoma qo'shish</h3>
      </div>

      <el-form
        ref="RefSpinning"
        :model="confirm_model"
        label-width="auto"
        class="filter-box bg-white md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
        size="small"
        label-position="top"
      >
        <div class="col-span-3">
          <el-form-item label="Ip nomi" prop="yarn_name" :rules="rules">
            <el-input
              required
              v-model="confirm_model.yarn_name"
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
                        title: `Ip nomini qo'shish`,
                        state: `yarn_name`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.yarn_name"
                  @click="Type({ type: `yarn_name` })"
                  @change="ChangeYarnName($event)"
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
          <el-form-item label="Ip Turi" prop="yarn_type" :rules="rules">
            <el-input
              required
              v-model="confirm_model.yarn_type"
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
                        title: `Ip turi qo'shish`,
                        state: `yarn_type`,
                      })
                    "
                    class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                  ></i>
                </div>
              </template>
              <template #append>
                <el-select
                  v-model="confirm_model.yarn_type"
                  @click="Type({ type: `yarn_type` })"
                  @change="ChangeYarnType($event)"
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
            label="Miqdori (kg)"
            prop="yarn_qauntity"
            :rules="[
              { required: true, message: `Maydon to'ldirilishi zarur !` },
              { type: 'number', message: `Qiymat musbat bo'lishi zarur` },
            ]"
          >
            <el-input
              v-model.number="confirm_model.yarn_qauntity"
              clearable
              class="w-[100%]"
              size="smal"
              type="String"
              placeholder="..."
            />
          </el-form-item>
        </div>
        <div class="col-span-3">
          <el-form-item
            label="Muddati"
            prop="delivery_time_spinning"
            :rules="rules"
          >
            <el-date-picker
              style="width: 100%"
              v-model="confirm_model.delivery_time_spinning"
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
          @click="AddSpinning(RefSpinning)"
          style="
            background-color: #36d887;
            color: white;
            border: none;
            width: 210px;
            margin-bottom: 4px;
            font-size: 12px;
          "
          ><i class="mr-2 fa-solid fa-plus fa-sm"></i>Qo'shish
        </el-button>
      </div>
      <div class="mt-3 grid grid-cols-12 gap-2">
        <div class="col-span-12 shadow-md bg-white rounded min-h-[15px]">
          <el-table
            :data="spinning"
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
              prop="yarn_name"
              label="Ip nomi"
              width="200"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="yarn_type"
              label="Ip turi"
              width="150"
              header-align="center"
              align="center"
            />

            <el-table-column
              prop="yarn_qauntity"
              label="Miqdori"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="delivery_time_spinning"
              label="Muddati"
              width="200"
              header-align="center"
              align="center"
              ><template #default="scope">
                {{ String(scope.row.delivery_time_spinning).substring(0, 15) }}
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
                    @click="deleteByIdSpinning(scope.row.id)"
                    class="inline-flex items-center mt-4 ml-2 text-white hover:bg-slate-300 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
                  >
                    <i class="text-black fa-sharp fa-solid fa-trash fa-xs"></i>
                  </router-link>
                </div> </template
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="border-b-[1px] border-[#36d887]">
      <div
        class="font-semibold rounded text-[14px] p-1 text-center bg-slate-100 shadow border-t-[1px] border-[#36d887] mt-2"
      >
        <h3>Taminot uchun talabnoma qo'shish</h3>
      </div>
      <div>
        <el-form
          ref="RefProvide"
          :model="confirm_model"
          label-width="auto"
          class="filter-box bg-white md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 mb-2 text-[13px]"
          size="small"
          label-position="top"
        >
          <div class="col-span-3">
            <el-form-item label="Likra turi" prop="likra_type" :rules="rules">
              <el-input
                required
                v-model="confirm_model.likra_type"
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
                          title: `Likra turini qo'shish`,
                          state: `likra`,
                        })
                      "
                      class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                    ></i>
                  </div>
                </template>
                <template #append>
                  <el-select
                    v-model="confirm_model.likra_type"
                    @click="Type({ type: `likra` })"
                    @change="ChangeLikra($event)"
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
              label="Likra miqdori (kg)"
              prop="likra_quantity"
              :rules="[
                { required: true, message: `Maydon to'ldirilishi zarur !` },
                { type: 'number', message: `Qiymat musbat bo'lishi zarur` },
              ]"
            >
              <el-input
                v-model.number="confirm_model.likra_quantity"
                clearable
                class="w-[100%]"
                size="smal"
                type="String"
                placeholder="..."
              />
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item
              label="Melaks ip turi"
              prop="melaks_type"
              :rules="rules"
            >
              <el-input
                required
                v-model="confirm_model.melaks_type"
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
                          title: `Melaks turini qo'shish`,
                          state: `melaks`,
                        })
                      "
                      class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                    ></i>
                  </div>
                </template>
                <template #append>
                  <el-select
                    v-model="confirm_model.melaks_type"
                    @click="Type({ type: `melaks` })"
                    @change="ChangeMelaks($event)"
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
              label="Melaks ip miqdori (kg)"
              prop="melaks_quantity"
              :rules="[
                { required: true, message: `Maydon to'ldirilishi zarur !` },
                { type: 'number', message: `Qiymat musbat bo'lishi zarur` },
              ]"
            >
              <el-input
                v-model.number="confirm_model.melaks_quantity"
                clearable
                class="w-[100%]"
                size="smal"
                type="String"
                placeholder="..."
              />
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
                          title: `Polister turini qo'shish`,
                          state: `polister`,
                        })
                      "
                      class="fa-solid fa-plus mr-2 fa-md cursor-pointer"
                    ></i>
                  </div>
                </template>
                <template #append>
                  <el-select
                    v-model="confirm_model.polister_type"
                    @click="Type({ type: `polister` })"
                    @change="ChangePolister($event)"
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
              label="Polister miqdori (kg)"
              prop="polister_quantity"
              :rules="[
                { required: true, message: `Maydon to'ldirilishi zarur !` },
                { type: 'number', message: `Qiymat musbat bo'lishi zarur` },
              ]"
            >
              <el-input
                v-model.number="confirm_model.polister_quantity"
                clearable
                class="w-[100%]"
                size="smal"
                type="String"
                placeholder="..."
              />
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item
              label="Muddati"
              prop="delivery_time_provide"
              :rules="rules"
            >
              <el-date-picker
                style="width: 100%"
                v-model="confirm_model.delivery_time_provide"
                clearable
                type="date"
                placeholder="..."
                size="smal"
              />
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item label=".">
              <el-button
                size="smal"
                @click="AddProvide(RefProvide)"
                style="
                  background-color: #36d887;
                  color: white;
                  border: none;
                  width: 100%;
                  margin-bottom: 4px;
                  font-size: 12px;
                "
                ><i class="mr-2 fa-solid fa-plus fa-sm"></i>Qo'shish
              </el-button>
            </el-form-item>
          </div>
        </el-form>
        <!-- <div class="flex justify-end">
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
      </div> -->

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
              prop="likra_type"
              label="Likra turi"
              width="200"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="likra_quantity"
              label="Likra miqdori (kg)"
              width="150"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="melaks_type"
              label="Melaks turi"
              width="200"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="melaks_quantity"
              label="Melaks miqdori (kg)"
              width="200"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="polister_type"
              label="Polister turi"
              width="200"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="polister_quantity"
              label="Polister miqdori (kg)"
              width="200"
              header-align="center"
              align="center"
            />
            <el-table-column
              prop="delivery_time_provide"
              label="Muddati"
              width="160"
              header-align="center"
              align="center"
              ><template #default="scope">{{
                String(scope.row.delivery_time_provide).substring(0, 15)
              }}</template>
            </el-table-column>
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
    </div>
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
