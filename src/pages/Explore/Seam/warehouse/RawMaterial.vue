<script setup>
import { ref, onMounted } from "vue";
import Title from "@/components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/HeaderTabLink.vue";
import BillOfLoad from "../../../../components/Seam/BillOfLoad.vue";
import AddOptionModal from "../../../../components/Helpers/AddOptionsModal.vue";
import { HelpersStore } from "../../../../stores/Helpers/helper.store";
const store = HelpersStore();
import { storeToRefs } from "pinia";
const { is_modal } = storeToRefs(store);
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Xom mato skladi</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <BillOfLoad />
    <AddOptionModal v-if="is_modal === true" />
  </div>
</template>
<style>
.activeTab {
  border-bottom: 2px solid #36d887;
}
</style>
../../../../components/Helpers/AddOptionsModal.vue
