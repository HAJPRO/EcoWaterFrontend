<script setup>
import { SeamInFormStore } from "../../../../stores/Seam/Form/form.store";
const store_form = SeamInFormStore();
import { storeToRefs } from "pinia";
const { isActive } = storeToRefs(store_form);
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
