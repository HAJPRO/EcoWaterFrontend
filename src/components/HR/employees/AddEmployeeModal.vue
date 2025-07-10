<script setup>
import MapView from "../../Customers/customerManagment/MapView.vue";
import { ElMessage } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { EmployeeManagmentStore } from "../../../stores/HR/employee/employee.store";
import { RoleStore } from "../../../stores/Admin/role.store.js";

import { AddressStore } from "../../../stores/Helpers/address/address.store";
import { AuthStore } from "../../../stores/Auth/auth.js";

const store_address = AddressStore();
const store_employee = EmployeeManagmentStore();
const store_auth = AuthStore();
const store_role = RoleStore();

import { storeToRefs } from "pinia";
const { regions, districts, neighborhoods } = storeToRefs(store_address);
const { employee_modal, modal_action, cardId, modal, action } =
  storeToRefs(store_employee);
const { roles } = storeToRefs(store_role);
const dialogWidth = ref("");
window.addEventListener("devicemotion", () => {
  dialogWidth.value =
    window.innerWidth > 1400
      ? "1200"
      : window.innerWidth > 1000
      ? "1000"
      : window.innerWidth > 800
      ? "800"
      : window.innerWidth > 600
      ? "600"
      : "450";
});
window.addEventListener("resize", () => {
  dialogWidth.value =
    window.innerWidth > 1400
      ? "1400"
      : window.innerWidth > 1000
      ? "1000"
      : window.innerWidth > 800
      ? "800"
      : window.innerWidth > 600
      ? "600"
      : "450";
});
const handleLocation = (coords) => {
  modal.value.model.location.lat = coords.lat;
  modal.value.model.location.long = coords.long;
};
const SelectRegion = () => {
  store_address.Regions();
};
const SelectNeighborhood = () => {
  store_address.Neighborhoods();
};
const categoryes = ref([
  { id: 1, name: "Jismoniy shaxs" },
  { id: 2, name: "Davlat tashkiloti" },
  { id: 3, name: "Nodavlat notijorat tashkiloti (NNT)" },
  { id: 4, name: "Xususiy tadbirkor (XT)" },
  { id: 5, name: "Oilaviy korxona (OK)" },
  { id: 6, name: "Qo‘shma korxona (QK)" },
  { id: 7, name: "Aksiyadorlik jamiyati (AJ)" },
  { id: 8, name: "Mas'uliyati cheklangan jamiyat (MChJ)" },
  { id: 9, name: "Qo‘shimcha mas'uliyatli jamiyat (QMJ)" },
  { id: 10, name: "Yopiq aksiyadorlik jamiyati (YoAJ)" },
  { id: 11, name: "Ochiq aksiyadorlik jamiyati (OAJ)" },
]);
const departments = ref([
  { _id: 1, name: "Adminstratsiya" },
  { _id: 2, name: "Sotuv" },
  { _id: 3, name: "Buhgalterya" },
  { _id: 4, name: "Kadrlar" },
  { _id: 5, name: "Ombor" },
  { _id: 6, name: "Lagistika" },
  { _id: 7, name: "Ishlab chiqarish" },
  { _id: 8, name: "Mijozlar" },
  { _id: 9, name: "Agentlar" },
  { _id: 10, name: "Ishchi xodimlar" },
]);

const positions = ref([
  { _id: 1, name: "Direktor" },
  { _id: 2, name: "Buhgalter" },
  { _id: 3, name: "Menejer" },
  { _id: 4, name: "Sotuvchi" },
  { _id: 5, name: "Xodim" },
  { _id: 6, name: "Omborchi" },
  { _id: 7, name: "Sotuv bo'yicha menejer" },
  { _id: 8, name: "Marketing bo'yicha menejer" },
  { _id: 10, name: "SMM mutaxassisi" },
  { _id: 11, name: "Xavfsizlik xodimi" },
  { _id: 12, name: "Haydovchi" },
  { _id: 13, name: "Admin" },
]);

const genders = ref([
  { _id: 1, name: "Erkak" },
  { _id: 2, name: "Ayol" },
]);

const carTypes = ref([
  { _id: 1, name: "Damas" },
  { _id: 2, name: "Labo" },
  { _id: 3, name: "Matiz" },
  { _id: 4, name: "Spark" },
  { _id: 5, name: "Cobalt" },
  { _id: 6, name: "Nexia 2" },
  { _id: 6, name: "Nexia 3" },
  { _id: 6, name: "Boshqa" },
]);
const carColors = ref([
  { _id: 1, name: "Qora" },
  { _id: 2, name: "Oq" },
  { _id: 3, name: "Qizil" },
  { _id: 4, name: "Yashil" },
  { _id: 5, name: "Moviy" },
  { _id: 6, name: "Sariq" },
  { _id: 7, name: "Boshqa" },
]);
const validateRoles = (rule, value, callback) => {
  // 1. Bo‘sh bo‘lishi mumkin emas
  if (!Array.isArray(value) || value.length === 0) {
    return callback(
      new Error("Rol tanlanmagan! Rolni boshqatdan tanlab keyin o'zgartiring")
    );
  }

  // 2. Har bir element string bo‘lishi kerak
  const allValid = value.every(
    (id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id)
  );

  // 3. Agar noto‘g‘ri bo‘lsa, xatolik
  if (!allValid) {
    return callback(
      new Error(
        "Rol noto‘g‘ri formatda tanlangan! Rolni boshqatdan tanlab keyin o'zgartiring"
      )
    );
  }

  // 4. Hammasi OK bo‘lsa
  callback();
};

const ChangeRoleDirection = (roles) => {
  console.log(roles);

  const isValid =
    Array.isArray(roles) && roles.every((id) => /^[a-f\d]{24}$/i.test(id));
  if (!isValid) {
    ElMessage.error(
      "Rol tanlanmagan yoki noto'g'ri formatda.Rolni boshqatdan tanlab keyin o'zgartiring!"
    );
    return;
  }
};
const formRef = ref();
const PlusValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      if (modal_action.value.action === "create") {
        store_auth.register(modal.value.model);
      }
      if (modal_action.value.action === "update") {
        store_auth.update({ id: cardId.value, model: modal.value.model });
      }
    } else {
      ElMessage.error("Iltimos barcha maydonlarni to'ldiring !");
      return false;
    }
  });
};
// const Save = async () => {
//   try {
//     if (
//       order.value.products.length <= 0 &&
//       order.value.accessorys.length <= 0
//     ) {
//       return ToastifyService.ToastError({ msg: "Mahsulot qo'shilmagan !" });
//     } else {
//       store_orders.Create({ ...order.value, create: true });
//     }
//   } catch (error) {
//     return ToastifyService.ToastError({ msg: error.message });
//   }
// };
const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
const ChangeRegion = async (e) => {
  modal.value.model.address.region = e.name;
  const districts = await store_address.Districts(e.id);
};
const ChangeNeighborhood = async (e) => {
  modal.value.model.address.district = e.name;
  const neighborhoods = await store_address.Neighborhoods(e.id);
};
const ChangeStreet = async (e) => {
  modal.value.model.address.neighborhood = e.name;
};
const is_map = ref(false);
let map = ref(null);
onMounted(async () => {
  store_role.GetAll();
  try {
    SelectRegion();
  } catch (error) {
    console.log(error);
  }
});
</script>
<template>
  <!-- <AddOptionModal v-if="is_modal === true" /> -->
  <div>
    <el-dialog v-model="employee_modal" :width="dialogWidth" class="mt-4">
      <span>
        <div
          class="bg-slate-100 font-semibold text-[15px] p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          <i class="fa-solid fa-user-plus fa-md mr-3"></i>
          {{ modal_action.title }}
        </div>
        <el-form
          ref="formRef"
          :model="modal.model"
          label-width="auto"
          class="filter-box bg-[#e8eded] md:grid md:grid-cols-12 gap-1 sm:flex sm:flex-wrap rounded shadow-sm p-2 mt-2 text-[13px]"
          size="small"
          label-position="top"
        >
          <!-- //  Asosiy ma'lumotlar -->
          <div
            class="mb-1 col-span-4 p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="font-semibold bg-slate-100 text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Asosiy ma'lumotlar
            </h1>
            <div class="grid grid-cols-12 gap-1">
              <div class="mb-1 col-span-12">
                <el-form-item label="F.I.O " prop="fullname" :rules="rules">
                  <el-input
                    required
                    v-model="modal.model.fullname"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="String"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-6">
                <el-form-item label="Bo'lim" prop="department" :rules="rules">
                  <el-select
                    v-model="modal.model.department"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    clearable
                    @click="Type({ type: `department` })"
                    @change="ChangeCustomerPosition($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi darajasini qo'shish`,
                            state: `department`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in departments"
                      :key="item._id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-6">
                <el-form-item label="Lavozim" prop="position" :rules="rules">
                  <el-select
                    v-model="modal.model.position"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `position` })"
                    @change="ChangeCustomerPosition($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi darajasini qo'shish`,
                            state: `position`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in positions"
                      :key="item._id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-6">
                <el-form-item
                  label="Rol"
                  prop="roles"
                  :rules="[
                    {
                      required: true,
                      validator: validateRoles,
                      trigger: 'change',
                    },
                  ]"
                >
                  <el-select
                    multiple
                    v-model="modal.model.roles"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `permission` })"
                    @change="ChangeRoleDirection($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `permission`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in roles"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="mb-1 col-span-6">
                <el-form-item
                  label="Ishga qabul qilingan sana"
                  prop="registeredAt"
                >
                  <el-date-picker
                    required
                    v-model="modal.model.registeredAt"
                    style="width: 100%"
                    clearable
                    type="date"
                    placeholder="..."
                    size="smal"
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-6">
                <el-form-item label="Login " prop="username">
                  <el-input
                    v-model="modal.model.username"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="String"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-6">
                <el-form-item label="Parol" prop="password">
                  <el-input
                    v-model="modal.model.password"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="String"
                    placeholder="..."
                  />
                </el-form-item>
              </div>

              <!-- <div class="col-span-3 p-1 rounded-md">
                <el-form-item label="Rasm" prop="imageUrl">
                  <el-upload
                    class="w-full"
                    v-model:file-list="ImagesList"
                    list-type="picture-card"
                    :before-upload="handleBeforeUpload"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-change="handleFileChange"
                    :limit="limit"
                    :on-exceed="handleExceed"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </el-upload>

                  <el-dialog
                    class="mt-16"
                    v-model="dialogVisible"
                    width="500"
                    :style="{ height: '650px' }"
                  >
                    <img
                      class="w-full h-[600px] rounded-md"
                      :src="dialogImageUrl"
                      alt="Preview Image"
                    />
                  </el-dialog>
                </el-form-item>
              </div> -->
            </div>
          </div>
          <!-- //  Identifikatsiya ma’lumotlari -->
          <div
            class="mb-1 col-span-8 bg-[#e8eded] p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="bg-slate-100 font-semibold text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Identifikatsiya ma’lumotlari
            </h1>
            <div class="grid grid-cols-12 gap-1">
              <!-- <div class="mb-1 col-span-3">
                <el-form-item label="INN" prop="inn">
                  <el-input
                    v-model="modal.model.inn"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="text"
                    maxlength="9"
                    placeholder="546789878"
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-3">
                <el-form-item label="Pasport serya" prop="passportNumber">
                  <el-input
                    required
                    v-model="modal.model.passportNumber"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="String"
                    placeholder="AB4567898"
                  />
                </el-form-item>
              </div> -->
              <!-- <div class="mb-1 col-span-3">
                <el-form-item label="Jinsi" prop="gender" :rules="rules">
                  <el-select
                    v-model="modal.model.gender"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `gender` })"
                    @change="ChangeMaterialType($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Jins qo'shish`,
                            state: `gender`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in genders"
                      :key="item._id"
                      :label="item.name"
                      :value="item.name"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div> -->
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Viloyat"
                  prop="address.region"
                  :rules="rules"
                >
                  <el-select
                    v-model="modal.model.address.region"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @change="ChangeRegion($event)"
                    @click="Type()"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Mato rangi qo'shish`,
                            state: `doc_type`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in regions"
                      :key="item.id"
                      :label="item.name"
                      :value="item"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Tuman"
                  prop="address.district"
                  :rules="rules"
                >
                  <el-select
                    v-model="modal.model.address.district"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `color` })"
                    @change="ChangeNeighborhood($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Mato rangi qo'shish`,
                            state: `doc_type`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in districts"
                      :key="item._id"
                      :label="item.name"
                      :value="item"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Mahalla"
                  prop="address.neighborhood"
                  :rules="rules"
                >
                  <el-select
                    v-model="modal.model.address.neighborhood"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `color` })"
                    @change="ChangeStreet($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Mato rangi qo'shish`,
                            state: `doc_type`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in neighborhoods"
                      :key="item.districtId"
                      :label="item.name"
                      :value="item"
                    >
                      <template #default>
                        <div class="flex justify-between items-center w-full">
                          <span>{{ item.name }}</span>
                          <i
                            class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                            @click.stop="RemoveItem(item._id)"
                          ></i>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item
                  label="Ko'cha"
                  prop="address.street"
                  :rules="rules"
                >
                  <el-input
                    required
                    v-model="modal.model.address.street"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="text"
                    placeholder="..."
                  />
                </el-form-item>
              </div>

              <div class="mb-1 col-span-4">
                <el-form-item label="Uy" prop="address.house">
                  <el-input
                    v-model="modal.model.address.house"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="Number"
                    placeholder="..."
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-4">
                <el-form-item label="Telefon" prop="phoneNumber" :rules="rules">
                  <el-input
                    v-model="modal.model.phoneNumber"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    placeholder="93 _____ __ __"
                    maxlength="9"
                    type="Number"
                  >
                    <template #prefix>
                      <span>+998</span>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
              <!-- <div class="mb-1 col-span-4">
                <el-form-item label="Email" prop="email">
                  <el-input
                    v-model="modal.model.email"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    placeholder="ecowather@gmail.com"
                    maxlength="50"
                    @input="onEmailInput"
                    :mask="'email'"
                  ></el-input>
                </el-form-item>
              </div> -->
              <!-- <div class="mb-1 col-span-4">
                <el-form-item label="Telegram" prop="telegram">
                  <el-input
                    v-model="modal.model.telegram"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    placeholder="@username"
                    maxlength="50"
                    @input="onEmailInput"
                    :mask="'email'"
                  ></el-input>
                </el-form-item>
              </div> -->

              <div class="col-span-12 p-1 rounded-md">
                <el-form-item
                  label="Manzilni xaritadan belgila"
                  prop="location"
                >
                  <el-dialog
                    class="mt-10"
                    v-model="is_map"
                    title="Manzilni tanlang"
                    width="1700px"
                  >
                    <MapView @locationSelected="handleLocation" />
                  </el-dialog>
                  <!-- Xarita -->
                  <div
                    class="mb-1 mt-2 col-span-3 w-auto text-center text-white font-semibold bg-purple-600 rounded-[4px] px-4 py-[5px] hover:bg-purple-700 mr-2 cursor-pointer"
                    @click="is_map = !is_map"
                  >
                    <i class="fa-solid fa-map mr-2 fa-md"></i> Xaritani ochish
                  </div>
                  <div class="flex justify-end gap-2">
                    <div
                      class="bg-green-200 col-span-1 w-auto p-[5px] text-[12px] font-semibold rounded-[4px]"
                    >
                      Kordinata (lat)
                      <el-input
                        v-model="modal.model.location.lat"
                        clearable
                        class="w-[100%]"
                        size="smal"
                        type="Number"
                        placeholder="..."
                      />
                    </div>
                    <div
                      class="bg-red-200 col-span-1 w-auto p-[5px] text-[12px] font-semibold rounded-[4px]"
                    >
                      Kordinata (long)

                      <el-input
                        v-model="modal.model.location.long"
                        clearable
                        class="w-[100%]"
                        size="smal"
                        type="Number"
                        placeholder="..."
                      />
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
            <!-- //Qo'shimcha malumotlar -->
            <div
              v-if="
                modal.model.position === `Haydovchi` ||
                modal.model.position === `Yosh haydovchi`
              "
              class="mb-1 col-span-4 p-2 rounded-md"
            >
              <h1
                class="font-semibold bg-slate-100 text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
              >
                Qo'shimcha malumotlar
              </h1>
              <div class="grid grid-cols-12 gap-1">
                <div class="mb-1 col-span-4">
                  <el-form-item label="Mashina rusumi" prop="carType" action>
                    <el-select
                      v-model="modal.model.carType"
                      placeholder="..."
                      size="smal"
                      style="width: 100%"
                      @click="Type({ type: `carType` })"
                      @change="ChangeCustomerPosition($event)"
                    >
                      <template #prefix>
                        <i
                          @click.stop="
                            Plus({
                              title: `Buyurtmachi darajasini qo'shish`,
                              state: `carType`,
                            })
                          "
                          class="fa-solid fa-plus cursor-pointer"
                        ></i>
                      </template>
                      <el-option
                        v-for="item in carTypes"
                        :key="item._id"
                        :label="item.name"
                        :value="item.name"
                      >
                        <template #default>
                          <div class="flex justify-between items-center w-full">
                            <span>{{ item.name }}</span>
                            <i
                              class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                              @click.stop="RemoveItem(item._id)"
                            ></i>
                          </div>
                        </template>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="mb-1 col-span-4">
                  <el-form-item label="Mashina raqami " prop="carNumber" action>
                    <el-input
                      required
                      v-model="modal.model.carNumber"
                      clearable
                      class="w-[100%]"
                      size="smal"
                      type="String"
                      placeholder="..."
                    />
                  </el-form-item>
                </div>
                <div class="mb-1 col-span-4">
                  <el-form-item label="Mashina rangi" prop="carColor" action>
                    <el-select
                      v-model="modal.model.carColor"
                      placeholder="..."
                      size="smal"
                      style="width: 100%"
                      @click="Type({ type: `carColor` })"
                      @change="ChangeOrderDirection($event)"
                    >
                      <template #prefix>
                        <i
                          @click.stop="
                            Plus({
                              title: `Buyurtmachi kategoryasini qo'shish`,
                              state: `carColor`,
                            })
                          "
                          class="fa-solid fa-plus cursor-pointer"
                        ></i>
                      </template>
                      <el-option
                        v-for="item in carColors"
                        :key="item._id"
                        :label="item.name"
                        :value="item.name"
                      >
                        <template #default>
                          <div class="flex justify-between items-center w-full">
                            <span>{{ item.name }}</span>
                            <i
                              class="fa-solid fa-trash text-red-500 cursor-pointer fa-xs ml-8"
                              @click.stop="RemoveItem(item._id)"
                            ></i>
                          </div>
                        </template>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>

                <!-- <div class="mb-1 col-span-6">
                  <el-form-item
                    label="Haydovchilik guvohnoamsi seryasi"
                    prop="driverLicenseNumber"
                    action
                  >
                    <el-input
                      required
                      v-model="modal.model.driverLicenseNumber"
                      clearable
                      class="w-[100%]"
                      size="smal"
                      type="String"
                      placeholder="..."
                    />
                  </el-form-item>
                </div>
                <div class="mb-1 col-span-6">
                  <el-form-item
                    label="Haydovchilik guvohnomasi berilgan sana"
                    prop="driverLicenseDate"
                    action
                  >
                    <el-date-picker
                      required
                      v-model="modal.model.driverLicenseDate"
                      style="width: 100%"
                      clearable
                      type="date"
                      placeholder="..."
                      size="smal"
                    />
                  </el-form-item>
                </div> -->
              </div>
            </div>
          </div>
        </el-form>
        <div class="flex justify-end bg-[#e8eded] p-2 rounded">
          <el-button
            @click="PlusValidate(formRef)"
            style="
              width: 190px;
              background-color: #36d887;
              color: white;
              border: none;
              cursor: pointer;
              padding: 15px;
            "
          >
            <i class="fa-solid fa-check mr-2 fa-md"></i
            >{{ modal_action.action === "create" ? "Saqlash" : "O'zgartirish" }}
          </el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.image-uploader-card {
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.image-uploader {
  width: 100%;
  min-height: 200px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 32px;
  color: #409eff;
  margin-bottom: 10px;
}
#map {
  height: 300px;
  width: 100%;
}
</style>
