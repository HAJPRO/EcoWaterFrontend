<script setup>
import { SeamInFormStore } from "../../../../stores/Seam/Form/form.store";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
const { isActive, is_modal } = storeToRefs(store_form);
import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/form/HeadeTabLink.vue";
import SkladTable from "../../../../components/Seam/form/SkladTable.vue";
import ProccesTable from "../../../../components/Seam/form/ProccesTable.vue";
import AddInfoFormModal from "../../../../components/Seam/form/AddInfoFormModal.vue";
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Bichuv</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <SkladTable v-if="isActive === 2" />
    <ProccesTable v-if="isActive === 1" />
    <AddInfoFormModal v-if="is_modal" />
  </div>
</template>
