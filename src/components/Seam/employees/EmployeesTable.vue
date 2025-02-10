<script setup>
import { format } from "date-fns";
import { ref, onMounted } from "vue";
import { SeamEmployeesStore } from "../../../stores/Seam/Employees/employees.store";
const store_employees = SeamEmployeesStore();
import { storeToRefs } from "pinia";
const { items, is_active } = storeToRefs(store_employees);

const getOneEployeeReport = async (id) => {
  store_employees.getOneEployeeReport(id);
};

const handleCurrentChange = (page) => {
  store_employees.getAll(page);
};
</script>
<template>
  <div class="shadow-md rounded">
    <el-table
      :header-cell-style="{
        background: '#e8eded',
        border: '0.2px solid #e1e1e3',
      }"
      size="small"
      show-header="true"
      load
      border="true"
      header-align="center"
      empty-text="Ma'lumot topilmadi... "
      :data="items"
      style="width: 100%; font-size: 12px"
      :min-height="150"
      :max-height="600"
      class="w-full relative z-10"
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
        align="center"
        header-align="center"
        prop="fullname"
        label="F.I.O"
        :min-width="250"
        :max-width="400"
      />
      <el-table-column
        prop="code"
        label="Kodi"
        :min-width="100"
        :max-width="120"
        header-align="center"
        align="center"
      />
      <el-table-column
        align="center"
        header-align="center"
        prop="department"
        label="Bo'lim"
        :min-width="150"
        :max-width="200"
      />

      <el-table-column
        prop="username"
        label="Telegram"
        :min-width="150"
        :max-width="200"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="phone_number"
        label="Tel nomer"
        header-align="center"
        align="center"
        :min-width="150"
        :max-width="200"
        ><template #default="scope">
          <div class="text-red-500">+{{ scope.row.phone_number }}</div>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="Holati"
        width="200"
        header-align="center"
        align="center"
        :min-width="100"
        :max-width="200"
      >
        <template #default="scope">
          <router-link
            to=""
            class="inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#e1e1e3] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
          >
            {{ scope.row.status }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="id"
        label=""
        min-width="60"
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
                { name: 'preventOverflow', options: { boundary: 'window' } },
              ],
            }"
          >
            <el-button type="text" class="text-sm; text-gray-500">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu slot="dropdown" append-to-body class="z-50">
                <el-dropdown-item @click="getOneEployeeReport(row)"
                  ><template #default=""
                    ><div>
                      <i class="text-black fa-solid fa-eye fa-md mr-1"></i
                      >Hisotlari
                    </div>
                  </template></el-dropdown-item
                >
                <el-dropdown-item @click="updateRow(row)"
                  ><template #default="scope"
                    ><div>
                      <i class="text-black fa-solid fa-pen fa-sm mr-1"></i>
                      Yangilash
                    </div>
                  </template></el-dropdown-item
                >

                <el-dropdown-item @click="deleteRow(row)" class="text-red-500">
                  <template #default=""
                    ><div>
                      <i class="text-black fa-solid fa-trash fa-sm mr-1"></i>
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
      class="flex justify-between flex-wrap font-semibold text-[12px] shadow border-b-[1px] border-[#36d887]"
    >
      <div class="flex justify-between bg-white pr-2 pl-2 w-full mx-auto">
        <div class="flex gap-2 my-2 mt-4">
          <div
            class="text-[12px] items-center font-medium text-center text-white"
          >
            <el-input
              clearable
              size="smal"
              type="String"
              placeholder="F.I.O ..."
              style="width: 200px; font-size: 12px"
            />
          </div>
          <router-link
            @click="ExportExcel()"
            to=""
            class="py-[7px] px-5 rounded text-[11px] items-center text-center font-bold bg-gray-700 text-white"
          >
            <i class="fa-solid fa-file-excel mr-2 fa-xm"></i>
            Excel
          </router-link>
        </div>

        <div class="block pt-5">
          <el-pagination
            small
            @current-change="handleCurrentChange"
            :page-size="10"
            layout="prev, pager, next"
            :total="items.length"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.el-table__inner-wrapper {
  z-index: 0 !important;
}
</style>
