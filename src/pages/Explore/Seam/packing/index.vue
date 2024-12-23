<script setup>
import { SeamInFormStore } from "../../../../stores/Seam/Form/form.store";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
const { isActive } = storeToRefs(store_form);
import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/packing/HeaderTabLink.vue";
import PatoksTable from "../../../../components/Seam/packing/PatoksTable.vue";
import ProccesTable from "../../../../components/Seam/packing/ProccesTable.vue";
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Upakovka</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <PatoksTable v-if="isActive === 2" />
    <ProccesTable v-if="isActive === 1" />
  </div>
</template>
