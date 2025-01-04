<script setup>
import { SeamInCWarehouseStore } from "../../../../stores/Seam/C-Warehouse/c-warehouse.store";
const store_c_warehouse = SeamInCWarehouseStore();
import { storeToRefs } from "pinia";
const { isActive } = storeToRefs(store_c_warehouse);
import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/c-warehouse/HeaderTabLink.vue";
import PackingTable from "../../../../components/Seam/c-warehouse/PackingTable.vue";
import ProductsTable from "../../../../components/Seam/c-warehouse/ProductsTable.vue";
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Tayyor mahsulot skladi</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <PackingTable v-if="isActive === 2" />
    <ProductsTable v-if="isActive === 1" />
  </div>
</template>
