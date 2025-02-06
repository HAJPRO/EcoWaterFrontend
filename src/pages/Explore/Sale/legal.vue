<script setup>
import { ref, onMounted } from "vue";
import Title from "@/components/Title.vue";
import ProccessModal from "../../../components/Sale/ProccessModal.component.vue";
import { SaleService } from "../../../ApiServices/Sale/sale.service";
import { ToastifyService } from "../../../utils/Toastify";
import SaleCreateCardModal from "../../../components/Sale/SaleCreateCardModal.vue";
import SaleUpdateCardModal from "../../../components/Sale/UpdateCardModal.vue";
import DetailModal from "../../../components/Sale/DetailModal.vue";
import HeaderTabLink from "../../../components/Sale/HeaderTabLink.vue";
import MainTable from "../../../components/Sale/MainTable.vue";
import { SaleStore } from "../../../stores/Sale/sale.store";
const store_sale = SaleStore();
import { storeToRefs } from "pinia";
const { is_create_modal, is_detail_modal, is_update_modal } =
  storeToRefs(store_sale);
const is_status_info_modal = ref(false);

const Export_Excel = async (id) => {
  try {
    const data = await SaleService.export_excel({ id });
  } catch (error) {
    return ToastifyService.ToastError({ msg: error.messages });
  }
};

onMounted(async () => {
  try {
  } catch (err) {
    console.log(err);
  }
});
</script>

<template>
  <div>
    <Title>
      <template v-slot:title>
        <h3>Sotuvlar</h3>
      </template>
    </Title>
    <HeaderTabLink />
    <MainTable />
    <!-- // Proccess Modal -->
    <ProccessModal />
    <!-- ////// -->
    <!-- // create Modal -->
    <SaleCreateCardModal v-if="is_create_modal === true" />
    <SaleUpdateCardModal v-if="is_update_modal === true" />
    <!-- // -->
    <DetailModal v-if="is_detail_modal === true" />
  </div>
</template>
