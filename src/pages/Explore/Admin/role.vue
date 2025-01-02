<script setup>
import { ref, onMounted } from "vue";
import Title from "@/components/Title.vue";
import HeaderTabLink from "../../../components/Admin/role/HeaderTabLink.vue";
import AddPermissionModal from "../../../components/Admin/role/AddPermissionModal.vue";
import AddRoleModal from "../../../components/Admin/role/AddRoleModel.vue";

import { RoleStore } from "../../../stores/Admin/role.store";
const store_role = RoleStore();
import { PermissionStore } from "../../../stores/Admin/permission.store";
const store_permission = PermissionStore();
import { storeToRefs } from "pinia";
const { is_modal } = storeToRefs(store_permission);
const { is_modal_role } = storeToRefs(store_role);
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Role</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <AddPermissionModal v-if="is_modal === true" />
    <AddRoleModal v-if="is_modal_role === true" />
  </div>
</template>
<style>
.activeTab {
  border-bottom: 2px solid #36d887;
}
</style>
