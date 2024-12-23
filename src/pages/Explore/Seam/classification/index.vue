<script setup>
import { SeamInFormStore } from "../../../../stores/Seam/Form/form.store";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
const { isActive } = storeToRefs(store_form);
import Title from "../../../../components/Title.vue";
import HeaderTabLink from "../../../../components/Seam/classification/HeaderTabLink.vue";
import FormTable from "../../../../components/Seam/classification/FormTable.vue";
import ProccesTable from "../../../../components/Seam/classification/ProccesTable.vue";
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
    <ProccesTable v-if="isActive === 1" />
  </div>
</template>
