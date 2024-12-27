<script setup>
import { SeamInClassificationStore } from "../../../../stores/Seam/Classification/classification.store";
const store_classification = SeamInClassificationStore();
import { storeToRefs } from "pinia";
const { isActive, is_modal } = storeToRefs(store_classification);

import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/classification/HeaderTabLink.vue";
import FormTable from "../../../../components/Seam/classification/FormTable.vue";
import ProcessTable from "../../../../components/Seam/classification/ProcessTable.vue";
import ReportDayModal from "../../../../components/Seam/classification/ReportDayModal.vue";
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Tasnif</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <FormTable v-if="isActive === 2" />
    <ProcessTable v-if="isActive === 1" />
    <ReportDayModal v-if="is_modal === true" />
  </div>
</template>
