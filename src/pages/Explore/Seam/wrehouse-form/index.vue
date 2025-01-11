<script setup>
import { ref, onMounted } from "vue";
import { SeamFormWarehouseStore } from "../../../../stores/Seam/FormWarehouse/warehouse.store";
const store_form_warehouse = SeamFormWarehouseStore();
const { isActive, modal } = storeToRefs(store_form_warehouse);
import Title from "@/components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/warehouse-form/HeaderTabLink.vue";
import ProductsTable from "../../../../components/Seam/warehouse-form/ProductsTable.vue";
import RawSkladTable from "../../../../components/Seam/warehouse-form/RawSkladTable.vue";
import OutputModal from "../../../../components/Seam/warehouse-form/R-OutputModal.vue";

import { HelpersStore } from "../../../../stores/Helpers/helper.store";
const store = HelpersStore();
import { storeToRefs } from "pinia";
const { is_modal } = storeToRefs(store);
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Bichuv skladi</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <ProductsTable v-if="isActive === 1" />
    <RawSkladTable v-if="isActive === 2" />
    <OutputModal v-if="modal.is_modal === true" />
  </div>
</template>
<style>
.activeTab {
  border-bottom: 2px solid #36d887;
}
</style>
