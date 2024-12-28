<script setup>
import { SeamInPatoksStore } from "../../../../stores/Seam/Patoks/patoks.store";
const store_patoks = SeamInPatoksStore();
import { storeToRefs } from "pinia";
const { isActive, is_modal } = storeToRefs(store_patoks);
import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/patoks/HeaderTabLink.vue";
import ClassificationTable from "../../../../components/Seam/patoks/ClassificationTable.vue";
import ProccesTable from "../../../../components/Seam/patoks/ProccesTable.vue";
import ReportDayModal from "../../../../components/Seam/patoks/ReportDayModal.vue";
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
    <ReportDayModal v-if="is_modal === true" />
  </div>
</template>
