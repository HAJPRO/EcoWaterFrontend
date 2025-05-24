<script setup>
import Cookies from "js-cookie";
const role = ref(JSON.parse(Cookies.get("account")).role);
const actions = ref(JSON.parse(Cookies.get("account")).actions);
import PermissionModal from "./AddPermissionModal.vue";
import RoleModal from "./AddRoleModel.vue";
import { ref, onMounted } from "vue";
import { PermissionStore } from "../../../../stores/Admin/permission.store";
import { RoleStore } from "../../../../stores/Admin/role.store";
import moment from "moment-timezone";

const store_role = RoleStore();
const store_permission = PermissionStore();

import { storeToRefs } from "pinia";
const { custom_modal, modal, customers, all_length, isActive } =
  storeToRefs(store_role);
const { permissions, status } = storeToRefs(store_permission);
const { roles } = storeToRefs(store_role);
const AddPermissionModal = () => {
  store_permission.AddPermissionModal();
};
const AddRoleModal = () => {
  store_role.AddRoleModal();
};
// const handleCurrentChange = (page) => {
//   store.GetAll({status : isActive.value, page : page, limit:5});
// };
// const deleteById = (id) => {
//   store.DeleteById({id});
// };
// const UpdateById = (id) => {
//   store.GetById({id});
// };
onMounted(() => {
  store_permission.GetAll();
});
</script>
<template>
  <RoleModal />
  <PermissionModal />

  <div class="">
    <div class="">
      <div class="rounded-md text-[11px]">
        <!-- ROLE TABLE -->
        <div v-if="status === 1">
          <el-table
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            style="font-size: 12px"
            size="small"
            class="w-full"
            header-align="right"
            :max-height="600"
            empty-text="Mahsulot qo'shilmagan... "
            :data="roles"
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
              prop="name"
              label="Nomi"
              :min-width="100"
              :max-width="400"
              header-align="center"
              align="center"
            />
            <el-table-column
              align="center"
              header-align="center"
              prop="value"
              label="Value"
              :min-width="100"
              :max-width="400"
            />
            <el-table-column
              label="Qo'shimcha ma'lumoti"
              :min-width="150"
              :max-width="600"
              header-align="center"
              align="center"
              ><template #default="{ row }">{{
                row.description
              }}</template></el-table-column
            >

            <el-table-column
              label="Registratsiya vaqti"
              :min-width="100"
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
              label="Status"
              :min-width="100"
              :max-width="400"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                <router-link
                  to=""
                  class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
                >
                  Aktiv
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
                    <el-dropdown-menu
                      slot="dropdown"
                      append-to-body
                      class="z-50"
                    >
                      <el-dropdown-item
                        class="text-[13px] text-green-600"
                        @click="GetOne(row._id)"
                        ><template #default=""
                          ><div>
                            <i class="text-black fa-solid fa-eye fa-sm mr-2"></i
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
                        class="text-[13px] text-indigo-600"
                        @click="UpdateById(row._id)"
                        ><template #default="{}"
                          ><div>
                            <i
                              class="text-black fa-solid fa-pen fa-sm mr-1"
                            ></i>
                            O'zgatirish
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
        </div>
        <!-- //// -->
        <!-- PERMISSION TABLE -->
        <div v-if="status === 2">
          <el-table
            :header-cell-style="{
              background: '#e8eded',
              border: '0.2px solid #e1e1e3',
            }"
            load
            style="font-size: 12px"
            size="small"
            class="w-full"
            header-align="right"
            :max-height="600"
            empty-text="Mahsulot qo'shilmagan... "
            :data="permissions"
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
              prop="name"
              label="Nomi"
              :min-width="100"
              :max-width="400"
              header-align="center"
              align="center"
            />
            <el-table-column
              align="center"
              header-align="center"
              prop="value"
              label="Value"
              :min-width="100"
              :max-width="400"
            />
            <el-table-column
              label="Qo'shimcha ma'lumoti"
              :min-width="150"
              :max-width="600"
              header-align="center"
              align="center"
              ><template #default="{ row }">{{
                row.description
              }}</template></el-table-column
            >

            <el-table-column
              label="Registratsiya vaqti"
              :min-width="100"
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
              label="Status"
              :min-width="100"
              :max-width="400"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                <router-link
                  to=""
                  class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
                >
                  Aktiv
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
                    <el-dropdown-menu
                      slot="dropdown"
                      append-to-body
                      class="z-50"
                    >
                      <el-dropdown-item
                        class="text-[13px] text-green-600"
                        @click="GetOne(row._id)"
                        ><template #default=""
                          ><div>
                            <i class="text-black fa-solid fa-eye fa-sm mr-2"></i
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
                        class="text-[13px] text-indigo-600"
                        @click="UpdateById(row._id)"
                        ><template #default="{}"
                          ><div>
                            <i
                              class="text-black fa-solid fa-pen fa-sm mr-1"
                            ></i>
                            O'zgatirish
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
        </div>
        <!-- /// -->

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
                  placeholder="Nomi bo'yicha..."
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
                  @click="AddRoleModal()"
                  size="small"
                  style="
                    background-color: #36d887;
                    color: white;
                    border: none;
                    padding: 15px;
                  "
                >
                  <i class="mr-2 fa-solid fa-plus fa-sm"></i>Rol
                  qo'shish</el-button
                >
                <el-button
                  @click="AddPermissionModal()"
                  size="small"
                  style="
                    background-color: #7c3aed;
                    color: white;
                    border: none;
                    padding: 15px;
                  "
                >
                  <i class="mr-2 fa-solid fa-plus fa-sm"></i>Ruxsat
                  qo'shish</el-button
                >
              </div>
            </div>

            <div class="block pt-3">
              <!-- Pagination -->
              <el-pagination
                small
                @current-change="handleCurrentChange"
                :page-size="5"
                layout="prev, pager, next"
                :total="15"
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
