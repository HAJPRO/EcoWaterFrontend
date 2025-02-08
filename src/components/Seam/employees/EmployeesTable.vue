<script setup>
import { format } from "date-fns";
import { ref, onMounted } from "vue";
import { SeamEmployeesStore } from "../../../stores/Seam/Employees/employees.store";
const store_employees = SeamEmployeesStore();
import { storeToRefs } from "pinia";
const getOneEployeeReport = async (id) => {
  store_employees.getOneEployeeReport(id);
};
const { items, is_active } = storeToRefs(store_employees);
const DetailModal = async (id) => {
  store_employees.DetailModal({ id });
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
      min-height="300"
      max-height="350"
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
        <template #default="">
          <router-link
            to=""
            class="inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#e1e1e3] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
          >
            Aktive
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="id"
        label=""
        :min-width="100"
        :max-width="200"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            to=""
            @click="getOneEployeeReport(scope.row._id)"
            class="inline-flex items-center ml-2 text-red hover:bg-[#e1e1e3] font-medium rounded-md text-sm w-full sm:w-auto px-3 py-3 text-center"
          >
            <i class="text-black fa-sharp fa-solid fa-check fa-xs"></i>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
