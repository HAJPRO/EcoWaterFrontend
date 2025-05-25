<script setup>
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const permissions = ref(JSON.parse(Cookies.get("account")).permissions);
const actions = ref(JSON.parse(Cookies.get("account")).actions);
import { ElMessage } from "element-plus";

import { ref, onMounted } from "vue";
import { EmployeeManagmentStore } from "../../../stores/HR/employee/employee.store";

import EmployeeModal from "../../../components/HR/employees/AddEmployeeModal.vue";
import DetailInfoEmployeeModal from "../../../components/HR/employees/DetailInfoEmployeeModal.vue";
import moment from "moment-timezone";

const store = EmployeeManagmentStore();
import { storeToRefs } from "pinia";
const { custom_modal, modal, employees, all_length, isActive } =
  storeToRefs(store);
const AddEmployeeModal = () => {
  store.AddEmployeeModal();
};
const detailInfoEmployeeModal = (id) => {
  store.DetailInfoEmployeeModal({ id });
};
const handleCurrentChange = (page) => {
  store.GetAll({ status: isActive.value, page: page, limit: 10 });
};
const deleteById = (id) => {
  store.DeleteById({ id });
};
const UpdateById = (id) => {
  store.GetById({ id, status: "update" });
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
</script>
<template>
  <EmployeeModal />
  <DetailInfoEmployeeModal />
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
          :data="employees"
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
            prop="fullname"
            label="F.I.O"
            :min-width="200"
            :max-width="800"
            header-align="center"
            align="left"
            ><template #default="{ row }"
              ><div class="text-red-500 cursor-pointer hover:underline">
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
          <el-table-column
            align="center"
            header-align="center"
            prop="department"
            label="Bo'lim"
            :min-width="100"
            :max-width="400"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="position"
            label="Lavozim"
            :min-width="100"
            :max-width="400"
          />
          <el-table-column
            align="center"
            header-align="center"
            prop="role"
            label="Rol"
            :min-width="100"
            :max-width="400"
          >
            <template #default="{ row }">
              <el-tooltip placement="left" effect="light">
                <template #content>
                  <div
                    class="bg-[#e8eded] text-white p-4 rounded text-left space-y-3"
                    style="width: 300px; max-height: 1200px; overflow-y: auto"
                  >
                    <div v-if="row.roles && row.roles.length">
                      <div
                        class="bg-white p-2 rounded mb-2"
                        v-for="(role, index) in row.roles"
                        :key="index"
                      >
                        <div
                          class="text-center font-semibold text-[16px] text-white p-2 bg-purple-500 rounded mb-1"
                        >
                          {{ role.name }}
                        </div>
                        <ul class="ml-4 list-disc mb-3 text-purple-600">
                          <div
                            class=""
                            v-for="(permission, pIndex) in role.permissions"
                            :key="pIndex"
                          >
                            {{ permission }}
                          </div>
                        </ul>
                      </div>
                    </div>
                    <div class="text-center font-semibold text-gray-800" v-else>
                      Rol topilmadi
                    </div>
                  </div>
                </template>

                <div class="text-purple-500 cursor-pointer hover:underline">
                  Ko'rish
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

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
            ><template #default="{ row }"
              ><div
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
            label="Ishga qabul qilingan sana"
            :min-width="150"
            :max-width="400"
            header-align="center"
            align="center"
            ><template #default="scope">
              {{
                scope.row.registeredAt
                  ? moment
                      .utc(scope.row.registeredAt) // 🟢 UTC formatda olish
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
                  row.status === `Online`
                    ? 'bg-green-200 text-green-900'
                    : 'bg-red-200 text-red-900',
                ]"
              >
                <i
                  :class="
                    row.status === `Online`
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
                      @click="detailInfoEmployeeModal(row._id)"
                      ><template #default=""
                        ><div>
                          <i
                            class="text-black fa-solid fa-magnifying-glass fa-sm mr-2"
                          ></i
                          >Batafsil
                        </div>
                      </template></el-dropdown-item
                    >

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
                      class="text-[13px]"
                      @click="updateById(row._id)"
                    >
                      <template #default>
                        <div>
                          <i
                            class="text-black fa-solid fa-box-archive fa-sm mr-1"
                          ></i>
                          Arxivlash
                        </div>
                      </template>
                    </el-dropdown-item>

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
                <el-input
                  clearable
                  size="smal"
                  type="String"
                  placeholder="F.I.O bo'yicha..."
                  style="width: 150px; font-size: 12px"
                />
              </div>

              <div
                class="my-2 text-[11px] items-center font-medium text-center text-white"
              >
                <el-input
                  clearable
                  size="smal"
                  type="String"
                  placeholder="Bo'lim bo'yicha..."
                  style="width: 150px; font-size: 12px"
                />
              </div>

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
                  @click="AddEmployeeModal()"
                  size="small"
                  style="
                    background-color: #36d887;
                    color: white;
                    border: none;
                    padding: 15px;
                  "
                >
                  <i class="mr-2 fa-solid fa-plus fa-sm"></i>Xodim
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
