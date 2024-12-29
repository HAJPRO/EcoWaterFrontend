<script setup>
import { SeamInFormStore } from "../../../../stores/Seam/Form/form.store";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
const { isActive } = storeToRefs(store_form);
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
