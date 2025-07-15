<script setup>
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const permissions = ref(JSON.parse(Cookies.get("account")).permissions);
const actions = ref(JSON.parse(Cookies.get("account")).actions);
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import { CustomerManagmentStore } from "../../../stores/Customers/c-managment/customer.store";
import CustomModal from "../../../components/Customers/customerManagment/AddCustomModal.vue";
import DetailInfoModal from "./DetailInfoModal.vue";
import moment from "moment-timezone";

const store = CustomerManagmentStore();
import { storeToRefs } from "pinia";
const { custom_modal, modal, customers, all_length, isActive } =
  storeToRefs(store);
const AddCustomModal = () => {
  store.AddCustomModal({
    action: "create",
    title: "Mijoz kartasini shakillantirish",
  });
};
const AddDetailModal = (id) => {
  store.AddDetailModal({ id });
};
const handleCurrentChange = (page) => {
  store.GetAll({ status: isActive.value, page: page, limit: 10 });
};
const deleteById = (id) => {
  store.DeleteById({ id });
};
const UpdateById = (id) => {
  store.AddCustomModal({
    id,
    action: "update",
    title: "Mijoz kartasini o'zgartirish",
  });
};
const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      ElMessage.success("Telefon raqam nusxalandi: " + text);
    })
    .catch(() => {
      ElMessage.error("Nusxalashda xatolik yuz berdi");
    });
};
const filter = ref({
  fullname: null,
  sort: "",
});
const FilterByFullname = () => {
  store.GetAll({ filter: filter.value });
};
const formatPrice = (num) => {
  const val = Number(num);
  return isNaN(val) ? "0" : val.toLocaleString("uz-UZ");
};
</script>
<template>
  <Custom-Modal />
  <DetailInfoModal />
  <div class="">
    <div class="">
      <div class="rounded-md text-[11px]">
        <el-table
          :header-cell-style="{
            background: '#e8eded',
            border: '0.2px solid #e1e1e3',
          }"
          stripe
          highlight-current-row
          load
          style="font-size: 12px"
          size="small"
          class="w-full"
          header-align="right"
          :max-height="600"
          empty-text="Mahsulot qo'shilmagan... "
          :data="customers"
          border
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
            label="F.I.O"
            :min-width="250"
            :max-width="400"
            header-align="center"
            ><template #default="{ row }">
              <div class="text-red-500 cursor-pointer hover:underline">
                <router-link
                  to=""
                  class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
                >
                  <i class="fas fa-user text-gray-500 fa-sm mr-2"></i>
                  {{ row.fullname }}
                </router-link>
              </div></template
            ></el-table-column
          >
          <!-- <el-table-column
            align="center"
            header-align="center"
            prop="artikul"
            label="Artikul"
            :min-width="100"
            :max-width="400"
          />
          <el-table-column
            label="Kategoriyasi"
            :min-width="200"
            :max-width="400"
            header-align="center"
            ><template #default="scope">{{
              scope.row.category
            }}</template></el-table-column
          > -->
          <el-table-column
            align="center"
            header-align="center"
            prop="address.region"
            label="Viloyat"
            :min-width="100"
            :max-width="400"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="address.district"
            label="Tuman"
            :min-width="100"
            :max-width="400"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="address.neighborhood"
            label="Mahalla"
            :min-width="100"
            :max-width="400"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="address.street"
            label="Ko'cha"
            :min-width="100"
            :max-width="400"
          />
          <el-table-column
            header-align="center"
            prop="phoneNumber"
            label="Telefon"
            :min-width="150"
            :max-width="400"
            ><template #default="{ row }">
              <div
                class="text-blue-600 cursor-pointer hover:underline"
                @click="copyToClipboard(row.phoneNumber)"
              >
                <router-link
                  to=""
                  class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
                >
                  <i class="fas fa-phone text-gray-500 fa-sm mr-2"></i>
                  {{ row.phoneNumber }}
                </router-link>
              </div></template
            ></el-table-column
          >

          <el-table-column
            label="Bonus ball"
            :min-width="100"
            header-align="center"
            align="center"
            ><template #default="scope">{{ 0 }}</template></el-table-column
          >
          <el-table-column
            label="Kredit (sum)"
            :min-width="100"
            header-align="center"
            align="center"
            ><template #default="scope"
              ><div class="bg-red-200 text-gray-600 p-1 rounded-md">
                <i class="fa-solid fa-hand-holding-dollar mr-2 fa-md"></i>
                {{ formatPrice(150000) }}
              </div></template
            ></el-table-column
          >
          <el-table-column
            label="Debitor (sum)"
            :min-width="100"
            header-align="center"
            align="center"
            ><template #default="scope"
              ><div class="bg-green-200 text-gray-600 p-1 rounded-md">
                <i class="fa-solid fa-circle-dollar-to-slot mr-2 fa-md"></i>
                {{ formatPrice(0) }}
              </div></template
            ></el-table-column
          >
          <el-table-column
            label="Registratsiya vaqti"
            :min-width="150"
            :max-width="400"
            header-align="center"
            align="center"
            ><template #default="scope">
              {{
                scope.row.createdAt
                  ? moment
                      .utc(scope.row.createdAt) // 🟢 UTC formatda olish
                      .tz("Asia/Tashkent") // 🟢 UTC+5 ga aylantirish
                      .format("DD.MM.YYYY HH:mm:ss") // 🟢 To‘g‘ri formatda chiqarish
                  : "-"
              }}
            </template></el-table-column
          >
          <el-table-column
            fixed="right"
            label="Holati"
            :min-width="100"
            :max-width="400"
            header-align="center"
            align="center"
          >
            <template #default="{ row }">
              <router-link
                to=""
                :class="[
                  'cursor-pointer inline-flex items-center gap-1 hover:bg-opacity-90 font-medium rounded-md text-[12px] w-full p-[5px] sm:w-auto text-center',
                  row.status === `Aktiv`
                    ? 'bg-green-200 text-green-900'
                    : 'bg-red-200 text-red-900',
                ]"
              >
                <i
                  :class="
                    row.status === `Aktiv`
                      ? 'fa-solid fa-circle-check text-green-700'
                      : 'fa-solid fa-hourglass-start text-red-700'
                  "
                ></i>
                {{ row.status }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="id"
            label=""
            width="60"
            header-align="center"
            align="center"
          >
            <template #default="{ row }">
              <!-- Dropdown -->
              <el-dropdown
                trigger="click"
                class="relative"
                :popper-options="{
                  modifiers: [
                    {
                      name: 'preventOverflow',
                      options: { boundary: 'window' },
                    },
                  ],
                }"
              >
                <el-button type="text" class="text-sm; text-gray-500">
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu slot="dropdown" append-to-body class="z-50">
                    <el-dropdown-item
                      class="text-[13px] text-green-600"
                      @click="AddDetailModal(row._id)"
                      ><template #default=""
                        ><div>
                          <i
                            class="text-black fa-solid fa-magnifying-glass fa-sm mr-2"
                          ></i
                          >Batafsil
                        </div>
                      </template></el-dropdown-item
                    >
                    <!-- <el-dropdown-item
                      class="text-[13px]"
                      @click="updateById(row._id)"
                      ><template #default="{}"
                        ><div>
                          <i
                            class="text-black fa-solid fa-xmark fa-sm mr-1"
                          ></i>
                          Bekor qilish
                        </div>
                      </template></el-dropdown-item
                    > -->

                    <el-dropdown-item
                      class="text-[13px] text-indigo-600"
                      @click="UpdateById(row._id)"
                      ><template #default="{}"
                        ><div>
                          <i
                            class="text-black fa-solid fa-pen-to-square fa-pen-to-square fa-sm mr-1"
                          ></i>
                          O'zgatirish
                        </div>
                      </template></el-dropdown-item
                    >
                    <el-dropdown-item
                      class="text-[13px] text-yellow-500"
                      @click="ExportExcel(row._id)"
                      ><template #default="{}"
                        ><div>
                          <i
                            class="text-black fa-solid fa-file-excel fa-sm mr-1"
                          ></i>
                          Excel
                        </div>
                      </template></el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="deleteById(row._id)"
                      class="text-red-500 text-[13px]"
                    >
                      <template #default=""
                        ><div>
                          <i
                            class="text-black fa-solid fa-trash fa-sm mr-1"
                          ></i>
                          O'chirish
                        </div>
                      </template>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div
          class="flex justify-between flex-wrap font-semibold text-[11px] p-1 shadow border-b-[1px] border-[#36d887]"
        >
          <div
            class="sticky flex justify-between flex-wrap bg-white pr-2 pl-2 w-full mx-auto"
          >
            <div class="flex gap-2 flex-wrap">
              <div
                class="my-2 text-[11px] items-center font-medium text-center text-white"
              >
                <el-tooltip
                  content="Mijozni F.I.O va Telefon nomeri bilan izlash!"
                  placement="bottom"
                  effect="dark"
                >
                  <el-input
                    @input="FilterByFullname()"
                    v-model="filter.fullname"
                    clearable
                    size="smal"
                    type="String"
                    placeholder="F.I.O/Tel nomer bo'yicha izlash..."
                    style="width: 150px; font-size: 12px"
                  />
                </el-tooltip>
              </div>

              <!-- <div
                class="my-2 text-[11px] items-center font-medium text-center text-white"
              >
                <el-input
                  clearable
                  size="smal"
                  type="String"
                  placeholder="Yil bo'yicha..."
                  style="width: 150px; font-size: 12px"
                />
              </div> -->

              <el-select placeholder="Excel" class="w-32 my-2">
                <el-option @click="ExportExcel()" label="Excel" value="excel">
                  <i class="fa-solid fa-file-excel mr-2 fa-xm"></i
                  >Excel</el-option
                >
                <el-option label="Pdf" value="pdf">
                  <i class="fa-solid fa-file-pdf mr-2 fa-xm"></i>Pdf</el-option
                >
                <el-option label="Word" value="word">
                  <i class="fa-solid fa-file-word mr-2 fa-xm"></i
                  >Word</el-option
                >
              </el-select>
              <div class="mt-2.5">
                <el-button
                  @click="AddCustomModal()"
                  size="small"
                  style="
                    background-color: #36d887;
                    color: white;
                    border: none;
                    padding: 15px;
                  "
                >
                  <i class="mr-2 fa-solid fa-plus fa-sm"></i>Mijoz
                  qo'shish</el-button
                >
              </div>
            </div>

            <div class="block pt-3">
              <!-- Pagination -->
              <el-pagination
                small
                @current-change="handleCurrentChange"
                :page-size="10"
                layout="prev, pager, next"
                :total="all_length.all"
                class="custom-pagination"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.col_span {
  display: grid;
  grid-column: 7;
}
.custom-pagination .el-pager li.is-active {
  background-color: #36d887 !important;
  color: white !important;
  border-radius: 5px;
}
</style>
