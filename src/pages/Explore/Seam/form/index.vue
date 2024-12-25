<script setup>
import { SeamInFormStore } from "../../../../stores/Seam/Form/form.store";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
const { isActive, is_modal, report } = storeToRefs(store_form);
import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/form/HeadeTabLink.vue";
import SkladTable from "../../../../components/Seam/form/SkladTable.vue";
import ProcessTable from "../../../../components/Seam/form/ProcessTable.vue";
import ClassificationTable from "../../../../components/Seam/form/ClassificatonTable.vue";
import AddInfoFormModal from "../../../../components/Seam/form/AddInfoFormModal.vue";
import DayReportModal from "../../../../components/Seam/form/DayReportModal.vue";
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Bichuv</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <ProcessTable v-if="isActive === 1" />
    <SkladTable v-if="isActive === 2" />
    <ClassificationTable v-if="isActive === 3" />
    <AddInfoFormModal v-if="is_modal" />
    <DayReportModal v-if="report.is_modal" />
  </div>
</template>
