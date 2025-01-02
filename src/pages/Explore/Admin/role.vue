<script setup>
import { ref, onMounted } from "vue";
import Title from "@/components/Title.vue";
import HeaderTabLink from "../../../components/Admin/role/HeaderTabLink.vue";
import AddPermissionModal from "../../../components/Admin/role/AddPermissionModal.vue";
import { PermissionStore } from "../../../stores/Admin/permission.store";
const store_permission = PermissionStore();
import { storeToRefs } from "pinia";
const { is_modal } = storeToRefs(store_permission);
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
  </div>
</template>
<style>
.activeTab {
  border-bottom: 2px solid #36d887;
}
</style>
../../../components/Admin/role/AddPermissionModal.vue
