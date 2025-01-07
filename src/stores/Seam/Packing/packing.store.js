import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { SeamInPackingService } from "../../../ApiServices/Seam/packing/packing.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export const SeamInPackingStore = defineStore("SeamInPackingStore", {
  state: () => {
    return {
      isActive: "",
      items: [],
      is_modal: false,
      model: {
        head_pack: "",
        pastal_quantity: "",
        waste_quantity: "",
        fact_gramage: "",
      },
      reports: {
        report: {},
        warehouse: {},
        last_status: "",
        report_box_packing: [],
        done_patoks: "",
        done_packing: "",
        patoks: {},
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
      const data = await SeamInPackingService.GetAll(payload);
      this.items = data.data.items;
      loader.hide();
    },
    async ConfirmAndCreteProcess(id) {
      const loader = loading.show();
      const data = await SeamInPackingService.ConfirmAndCreteProcess(id);
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      const Refresh = () => {
        window.location.href = "/explore/department/seam/packing";
      };
      setTimeout(Refresh, 1000);
      loader.hide();
    },
    ConfirmModal(id) {
      this.is_modal = true;
      this.card_id = id;
      this.GetOneReport(id);
    },
    async Accept(index) {
      const loader = loading.show();
      const data = await SeamInPackingService.AcceptReportItem({
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
      const data = await SeamInPackingService.GetOneReport(id);
      this.report = data.data[0];
      this.reports.warehouse = data.data[0].warehouse;
      const patoks_report_length = data.data[0].patoks.report_box.length;
      this.reports.last_status =
        data.data[0].patoks.report_box[patoks_report_length - 1].status;
      this.reports.patoks = data.data[0].patoks;
      this.reports.report_box_packing = data.data[0].report_box;
      const initialValue1 = ref(0);
      this.reports.done_packing = data.data[0].report_box.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.quantity),
        initialValue1.value
      );
      const initialValue2 = ref(0);
      this.reports.done_patoks = data.data[0].patoks.report_box.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.quantity),
        initialValue2.value
      );
    },

    async CreateDayReport(items) {
      const loader = loading.show();
      const data = await SeamInPackingService.CreateDayReport({
        items,
        id: this.card_id,
      });
      this.report.is_modal = false;

      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      this.GetOneReport(this.card_id);
      loader.hide();
    },

    async CreaetInfoToForm(paload) {
      const loader = loading.show();
      const data = await SeamInPackingService.CreaetInfoToForm({
        data: paload,
        id: this.card_id,
      });
      this.is_modal = false;

      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      const Refresh = () => {
        window.location.href = "/explore/department/seam/packing";
      };
      setTimeout(Refresh, 1000);
      loader.hide();
    },
  },
});
