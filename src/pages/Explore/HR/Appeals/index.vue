<script setup>
import { ref, onMounted } from "vue";
import Title from "@/components/Title.vue";
import HeaderTabLink from "../../../../components/HR/Appeals/HeaderTabLink.vue";
import AppealsTable from "../../../../components/HR/Appeals/AppealsTable.vue";
import { HRAppealsStore } from "../../../../stores/HR/Appeals/appeals.store";
const store_appeals = HRAppealsStore();
import { storeToRefs } from "pinia";
const { isActive, modal } = storeToRefs(store_appeals);
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Murojaatlar</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <AppealsTable v-if="isActive === 2" />
  </div>
</template>
<style>
.activeTab {
  border-bottom: 2px solid #36d887;
}
</style>
