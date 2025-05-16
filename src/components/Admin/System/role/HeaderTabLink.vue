<script setup>
import { ref, onMounted } from "vue";
// import Cookies from "js-cookie";
// const dep = ref(JSON.parse(Cookies.get("account")).department);
// import { PermissionStore } from "../../../../stores/Admin/permission.store";
// const store_permission = PermissionStore();
// import { RoleStore } from "../../../../stores/Admin/role.store";
// const store_role = RoleStore();
// import { storeToRefs } from "pinia";
// const AddPermissionModal = () => {
//   store_permission.AddPermissionModal();
// };
// const AddRoleModal = () => {
//   store_role.AddRoleModal();
// };

// // const getAll = async () => {
// //   await store.getAll({ status: isActive.value, department: dep.value });
// // };
// const is_Active = () => {
//   store.IsActive({ is_active: isActive.value });
// };
const isActive = ref(1);
// const ActiveTabLink = (num) => {
//   if (num === 0) {
//     isActive.value = 0;
//     is_Active();
//     getAll();
//   }
//   if (num === 1) {
//     isActive.value = 1;
//     is_Active();
//     getAll();
//   }
//   if (num === 2) {
//     isActive.value = 2;
//     is_Active();
//     getAll();
//   }
//   if (num === 3) {
//     isActive.value = 3;
//     is_Active();
//     getAll();
//   }
//   if (num === 4) {
//     isActive.value = 4;
//     is_Active();
//     getAll();
//   }
//   if (num === 5) {
//     isActive.value = 5;
//     is_Active();
//     getAll();
//   }
// };
// onMounted(async () => {
//   try {
//   } catch (err) {
//     console.log(err);
//   }
// });
</script>
<template>
  <div
    class="grid grid-cols-12 grid-flow-col justify-between bg-white rounded-md shadow-md p-3 mb-2"
  >
    <div class="col-span-12 grid-flow-col flex-wrap">
      <router-link
        to=""
        @click="ActiveTabLink(1)"
        :class="{ activeTab: isActive === 1 }"
        class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-list-ul mr-2 fa-md"></i>
        Barchasi
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 1 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            {{ (all_length ? all_length.all : 0) || 0 }}</span
          >
        </div>
      </router-link>
      <router-link
        to=""
        @click="ActiveTabLink(2)"
        :class="{ activeTab: isActive === 2 }"
        class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-shield mr-2 fa-md"></i>
        Rollar
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 2 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            {{ (all_length ? all_length.all : 0) || 0 }}</span
          >
        </div>
      </router-link>
      <router-link
        to=""
        @click="ActiveTabLink(3)"
        :class="{ activeTab: isActive === 3 }"
        class="inline-flex text-[12px] items-center mr-2 px-4 py-1 mb-1 font-medium text-center text-red hover:border-b-2 border-solid border-[#36d887] bg-[#e4e9e9] text-bold rounded"
      >
        <i class="fa-solid fa-unlock mr-2 fa-md"></i>
        Ruxsatlar
        <div class="flex flex-shrink-0 ml-2">
          <span
            :class="{ activeTabIcon: isActive === 3 }"
            class="inline-flex items-center justify-center h-5 text-[11px] font-medium text-white bg-[#36d887] px-3 py-2 rounded"
          >
            {{ (all_length ? all_length.all : 0) || 0 }}</span
          >
        </div>
      </router-link>
    </div>
   
  </div>
</template>
<style scoped>
.activeTab {
  transition-duration: 0.6s;
  background: #36d887;
  color: whitesmoke;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: bold;
}
.activeTabIcon {
  background: whitesmoke;
  color: black;
}
</style>
