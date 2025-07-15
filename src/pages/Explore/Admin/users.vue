<script setup>
import { ref, onMounted } from "vue";
import Title from "@/components/Title.vue";
import HeaderTabLink from "../../../components/Admin/users/HeaderTabLink.vue";
import MainTable from "../../../components/Admin/users/MainTable.vue";
import AddUserModal from "../../../components/Admin/users/AddUserModal.vue";
import { UserStore } from "../../../stores/Admin/user.store";
const store_user = UserStore();
import { storeToRefs } from "pinia";
const { is_modal } = storeToRefs(store_user);
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Foydalanuvchilar</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <MainTable />
    <AddUserModal v-if="is_modal === true" />
  </div>
</template>
<style>
.activeTab {
  border-bottom: 2px solid #36d887;
}
</style>
