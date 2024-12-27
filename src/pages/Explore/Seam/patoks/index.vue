<script setup>
import { SeamInPatoksStore } from "../../../../stores/Seam/Patoks/patoks.store";
const store_patoks = SeamInPatoksStore();
import { storeToRefs } from "pinia";
const { isActive } = storeToRefs(store_patoks);
import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/patoks/HeaderTabLink.vue";
import ClassificationTable from "../../../../components/Seam/patoks/ClassificationTable.vue";
import ProccesTable from "../../../../components/Seam/patoks/ProccesTable.vue";
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Patoklar</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <ClassificationTable v-if="isActive === 2" />
    <ProccesTable v-if="isActive === 1" />
  </div>
</template>
