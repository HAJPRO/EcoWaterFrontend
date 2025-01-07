import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { SeamInCWarehouseService } from "../../../ApiServices/Seam/c-warehouse/c-warehouse.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export const SeamInCWarehouseStore = defineStore("SeamInCWarehouseStore", {
  state: () => {
    return {
      isActive: "",
      items: [],
      is_modal: false,
      reports: {
        report: [],
        status: "",
        warehouse: {},
        done_packing: 0,
      },
      report: [],
      card_id: "",
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async getAll(payload) {
      const loader = loading.show();
      const data = await SeamInCWarehouseService.GetAll(payload);
      this.items = data.data.items;

      loader.hide();
    },
    // async ConfirmAndCreateInProcess(id) {
    //   const loader = loading.show();
    //   const data = await SeamInCWarehouseService.ConfirmAndCreateInProcess(id);
    //   ToastifyService.ToastSuccess({
    //     msg: data.data.msg,
    //   });
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 500);
    //   loader.hide();
    // },
    ConfirmModal(id) {
      this.is_modal = true;
      this.card_id = id;
      this.GetOneReport(id);
    },
    async Accept(index) {
      const loader = loading.show();
      const data = await SeamInCWarehouseService.AcceptReportItem({
        index,
        card_id: this.card_id,
      });
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      loader.hide();
      this.GetOneReport(this.card_id);
    },
    async GetOneReport(id) {
      const data = await SeamInCWarehouseService.GetOneReport(id);
      this.reports.report = data.data[0].report_box;
      this.reports.status = data.data[0].status;
      this.reports.warehouse = data.data[0].warehouse;

      this.reports.report_box_packing = data.data[0].report_box;
      const initialValue1 = ref(0);
      this.reports.done_packing = data.data[0].report_box.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.quantity),
        initialValue1.value
      );
    },
  },
});
