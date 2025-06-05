<script setup>
import MapView from "../../../components/Customers/customerManagment/MapView.vue";
import { ElMessage } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
import { AddressStore } from "../../../stores/Helpers/address/address.store";
const store_address = AddressStore();
const store_customers = CustomerManagmentStore();

import { storeToRefs } from "pinia";
const { regions, districts, neighborhoods } = storeToRefs(store_address);
const { custom_modal, modal, action, TitleAction } =
  storeToRefs(store_customers);
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

const positions = ref([
  { _id: 1, name: "Bronza" },
  { _id: 2, name: "Kumush" },
  { _id: 3, name: "Tilla" },
]);

const genders = ref([
  { _id: 1, name: "Erkak" },
  { _id: 2, name: "Ayol" },
]);

const formRef = ref();
const PlusValidate = async (formRef) => {
  await formRef.validate((valid) => {
    if (valid === true) {
      store_customers.Create(modal.value.model);
    } else {
      ElMessage.error("Iltimos barcha maydonlarni to'ldiring !");
      return false;
    }
  });
};

const rules = ref({
  required: true,
  message: `Maydon to'ldirilishi zarur !`,
  trigger: "blur",
});
const onInput = (value) => {
  // faqat raqamlarni qoldiramiz
  modal.model.artikul = value.replace(/[^0-9]/g, "").slice(0, 4);
  modal.model.inn = value.replace(/[^0-9]/g, "").slice(0, 9);
};
const ChangeRegion = async (e) => {
  modal.value.model.address.region = e.name;
  await store_address.Districts(e.id);
};
const ChangeDistrict = async (e) => {
  modal.value.model.address.district = e.name;
  await store_address.Neighborhoods(e.id);
};
const ChangeNeighborhood = async (e) => {
  modal.value.model.address.neighborhood = e.name;
  await store_address.Neighborhoods(e.id);
};
const is_map = ref(false);
let map = ref(null);
onMounted(async () => {
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
    <el-dialog v-model="custom_modal" :width="dialogWidth" class="mt-4">
      <span>
        <div
          class="bg-slate-100 font-semibold text-[15px] p-1 mt-1 align-center text-center shadow rounded border-t-[1px] border-[#36d887]"
        >
          <i class="fa-solid fa-user-plus fa-md mr-3"></i>
          {{ TitleAction.title }}
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
          <!-- <div
            class="mb-1 col-span-4 p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <h1
              class="font-semibold bg-slate-100 text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Asosiy ma'lumotlar
            </h1>
            <div class="grid grid-cols-12 gap-1">
              <div class="mb-1 col-span-12">
                <el-form-item
                  label="F.I.O / Korxona nomi"
                  prop="fullname"
                  :rules="rules"
                >
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
                <el-form-item
                  label="Kategoryasi"
                  prop="category"
                  :rules="rules"
                >
                  <el-select
                    v-model="modal.model.category"
                    placeholder="..."
                    size="smal"
                    style="width: 100%"
                    @click="Type({ type: `category` })"
                    @change="ChangeOrderDirection($event)"
                  >
                    <template #prefix>
                      <i
                        @click.stop="
                          Plus({
                            title: `Buyurtmachi kategoryasini qo'shish`,
                            state: `category`,
                          })
                        "
                        class="fa-solid fa-plus cursor-pointer"
                      ></i>
                    </template>
                    <el-option
                      v-for="item in categoryes"
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
                  label="Artikul"
                  prop="artikul"
                  :rules="[
                    {
                      required: true,
                      message: 'Artikul kiritilishi shart',
                      trigger: 'blur',
                    },
                    {
                      pattern: /^[0-9]*$/,
                      message: 'Faqat raqam kiriting',
                      trigger: 'blur',
                    },
                    {
                      min: 4,
                      max: 4,
                      message: 'Artikul 4 xonali bo‘lishi kerak',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="modal.model.artikul"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="text"
                    maxlength="4"
                    placeholder="..."
                    @input="onInput"
                  />
                </el-form-item>
              </div>

              <div class="mb-1 col-span-6">
                <el-form-item label="Darajasi" prop="position" :rules="rules">
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
                  label="Registratsiya vaqti"
                  prop="registeredAt"
                  :rules="rules"
                >
                  <el-date-picker
                    v-model="modal.model.registeredAt"
                    type="date"
                    placeholder="..."
                    size="smal"
                  />
                </el-form-item>
              </div>
              <div class="col-span-3 p-1 rounded-md">
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
              </div>
            </div>
          </div> -->
          <!-- //  Identifikatsiya ma’lumotlari -->
          <div
            class="mb-1 col-span-12 bg-[#e8eded] p-2 rounded-md border-[1px] border-[#36d887]"
          >
            <!-- <h1
              class="bg-slate-100 font-semibold text-[13px] p-1 mt-1 align-center text-center rounded-md border-t-[1px] border-[#36d887]"
            >
              Identifikatsiya ma’lumotlari
            </h1> -->
            <div class="grid grid-cols-12 gap-1">
              <!-- <div class="mb-1 col-span-3">
                <el-form-item label="INN" prop="inn">
                  <el-input
                    required
                    v-model="modal.model.inn"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    type="text"
                    maxlength="9"
                    placeholder="546789878"
                    @input="onInput"
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-3">
                <el-form-item
                  label="Pasport seriyasi"
                  prop="passportNumber"
                  :rules="[
                    {
                      required: true,
                      message: 'Pasport seriyasi kiritilishi shart',
                      trigger: 'blur',
                    },
                    {
                      pattern: /^[A-Za-z]{2}[0-9]{7}$/,
                      message: 'Format: 2 harf + 7 raqam (masalan: AA1234567)',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="modal.model.passportNumber"
                    maxlength="9"
                    placeholder="AA1234567"
                    size="smal"
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-3">
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
                  label="F.I.O / Korxona nomi"
                  prop="fullname"
                  :rules="rules"
                >
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
                    @change="ChangeDistrict($event)"
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
              <div class="mb-1 col-span-3">
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
              <div class="mb-1 col-span-3">
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
              <div class="mb-1 col-span-3">
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
              <div class="mb-1 col-span-3">
                <el-form-item label="Telefon" prop="phoneNumber" :rules="rules">
                  <el-input
                    v-model="modal.model.phoneNumber"
                    clearable
                    class="w-[100%]"
                    size="smal"
                    placeholder="93 _____ __ __"
                    maxlength="9"
                    type="number"
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
              <div class="mb-1 col-span-12">
                <el-form-item label="Qo'shimcha ma'lumot" prop="discription">
                  <el-input
                    type="textarea"
                    v-model="modal.model.discription"
                    placeholder="Bu yerga yozing..."
                    :rows="4"
                    clearable
                  />
                </el-form-item>
              </div>
              <div class="mb-1 col-span-12 gap-3">
                <el-form-item
                  label="Manzilni xaritadan belgila"
                  prop="location"
                  :rules="rules"
                >
                  <!-- <div v-if="is_map === false" >  <MapView  @locationSelected="handleLocation" /></div> -->

                  <el-dialog
                    class="mt-10"
                    v-model="is_map"
                    title="Manzilni tanlang"
                    width="1500px"
                  >
                    <MapView @locationSelected="handleLocation" />
                  </el-dialog>
                  <!-- Xarita -->

                  <div
                    class="mb-1 mt-2 col-span-3 w-auto text-white font-semibold bg-purple-600 rounded-[4px] items-center text-center px-4 py-[5px] hover:bg-purple-700 mr-2 cursor-pointer"
                    @click="is_map = !is_map"
                  >
                    <i class="fa-solid fa-map mr-2 fa-md"></i> Xaritani ochish
                  </div>
                  <div
                    class="bg-green-200 col-span-3 w-auto p-[5px] text-[12px] font-semibold rounded-[4px]"
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
                  <div class="col-span-2">
                    <el-form-item
                      prop="is_location"
                      :rules="rules"
                      class="col-span-3 flex items-center mt-0 text-center"
                      size="small"
                    >
                      <el-tooltip
                        :content="`Mijozni aniq kordinatasini belgiladingizmi ?`"
                        placement="top"
                        size="slal"
                      >
                        <label
                          class="relative inline-flex cursor-pointer items-center"
                        >
                          <input
                            required
                            type="checkbox"
                            v-model="modal.model.is_location"
                            class="sr-only peer"
                          />
                          <div
                            class="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-green-400 transition-all"
                          ></div>
                          <p
                            class="ml-1 text-[12px] font-semibold text-slate-600 peer-checked:text-green-500"
                          >
                            Location
                          </p>
                          <div
                            class="absolute left-1 top-1 w-4 h-4 bg-white border rounded-full shadow-md peer-checked:translate-x-5 transition-all"
                          ></div>
                        </label>
                      </el-tooltip>
                    </el-form-item>
                  </div>
                </el-form-item>
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
            >{{ TitleAction.action === "create" ? "Saqlash" : "O'zgartirish" }}
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
