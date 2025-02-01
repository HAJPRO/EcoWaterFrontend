<script setup>
import { ref, onMounted } from "vue";
import Title from "@/components/Title.vue";
import HeaderTabLink from "../../../../components/Provide/HeaderTabLink.vue";
import MainTable from "../../../../components/Provide/MainTable.vue";
import { ProvidePlanStore } from "../../../../stores/Provide/provideStore";
const store_provide = ProvidePlanStore();
import { storeToRefs } from "pinia";
import PaintTable from "../../../../components/Provide/PaintTable.vue";
import DetailPaintModal from "../../../../components/Provide/DetailPaintModal.vue";
import DetailWeavingModal from "../../../../components/Provide/DetailWeavingModal.vue";
import DetailSpinningModal from "../../../../components/Provide/DetailSpinningModal.vue";

const {
  is_active,
  detail_paint_modal,
  detail_weaving_modal,
  detail_spinning_modal,
} = storeToRefs(store_provide);
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Taminot reja iqtisod</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <MainTable />
    <DetailPaintModal v-if="detail_paint_modal === true" />
    <DetailWeavingModal v-if="detail_weaving_modal === true" />
    <DetailSpinningModal v-if="detail_spinning_modal === true" />
  </div>
</template>
<style>
.activeTab {
  border-bottom: 2px solid #36d887;
}
</style>
