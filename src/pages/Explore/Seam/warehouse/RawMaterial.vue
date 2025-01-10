<script setup>
import { ref, onMounted } from "vue";
import { SeamWarehouseStore } from "../../../../stores/Seam/Warehouse/warehouse.store";
const store_seam = SeamWarehouseStore();
const { isActive, modal } = storeToRefs(store_seam);
import Title from "@/components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/warehouse/HeaderTabLink.vue";
import BillOfLoad from "../../../../components/Seam/warehouse/BillOfLoad.vue";
import ProductsTable from "../../../../components/Seam/warehouse/ProductsTable.vue";
import OutputModal from "../../../../components/Seam/warehouse/R-OutputModal.vue";

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
    <ProductsTable v-if="isActive === 1" />
    <AddOptionModal v-if="is_modal === true" />
    <OutputModal v-if="modal.output === true" />
  </div>
</template>
<style>
.activeTab {
  border-bottom: 2px solid #36d887;
}
</style>
