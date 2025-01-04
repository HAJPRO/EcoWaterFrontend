<script setup>
import { ref } from "vue";
import { UserStore } from "../../../stores/Admin/user.store";
const store = UserStore();
import { storeToRefs } from "pinia";
const { items } = storeToRefs(store);
</script>
<template>
  <div class="shadow-md rounded min-h-[15px]">
    <el-table
      load
      class="w-full"
      header-align="center"
      hight="4"
      style="width: 100%"
      empty-text="Mahsulot tanlanmagan... "
      :data="items"
      border
      min-height="300"
      max-height="400"
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
        header-align="center"
        sortable
        prop="username"
        label="Username"
        width="200"
      />

      <el-table-column
        header-align="center"
        sortable
        prop="Department"
        label="department"
        width="200"
      />
      <el-table-column
        prop="password"
        sortable
        label="Password"
        width="180"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="pro_name"
        label="Nomi"
        width="180"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="role"
        label="role"
        width="180"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="permissions"
        label="Permissions"
        width="180"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="actions"
        sortable
        label="Actions"
        width="180"
        header-align="center"
        align="center"
      />
      <el-table-column
        fixed="right"
        prop="order_status"
        sortable
        label="Holati"
        width="150"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            to=""
            @click="statusModalById(scope.row.id)"
            :class="{ status_bg: scope.row.order_status === 'Tasdiqlanmagan' }"
            class="cursor-pointer inline-flex items-center text-red bg-[#e4e9e9] hover:bg-[#d7ebeb] font-medium rounded-md text-[12px] w-ful p-[5px] sm:w-auto text-center"
          >
            Active
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="id"
        label=""
        width="200"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <router-link
            to=""
            @click="confirm(scope.row._id)"
            class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#d7ebeb] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-3 text-center"
          >
            <i class="text-red fa-solid fa-check fa-sm"></i>
          </router-link>
          <router-link
            to=""
            class="inline-flex items-center mt-4 ml-2 text-red hover:bg-[#d7ebeb] font-medium rounded-md w-full sm:w-auto px-2 py-3 text-center"
          >
            <i class="text-red fa-solid fa-trash fa-sm"></i>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- // -->
  </div>
</template>
<style scoped>
.status_bg {
  background-color: rgb(243, 147, 147);
  color: white;
}
</style>
