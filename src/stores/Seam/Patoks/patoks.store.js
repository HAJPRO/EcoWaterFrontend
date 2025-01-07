import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { SeamInPatoksService } from "../../../ApiServices/Seam/patoks/patoks.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export const SeamInPatoksStore = defineStore("SeamInPatoksStore", {
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
        report_box_patoks: [],
        last_status: "",
        patoks_process: [],
        done_patoks: "",
        done_classification: "",
        done_notConfirm: "",
        classification: {},
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
      const data = await SeamInPatoksService.GetAll(payload);
      this.items = data.data.items;
      loader.hide();
    },
    async ConfirmAndCreteProcess(id) {
      const loader = loading.show();
      const data = await SeamInPatoksService.ConfirmAndCreteProcess(id);
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      const Refresh = () => {
        window.location.href = "/explore/department/seam/patoks";
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
      const data = await SeamInPatoksService.AcceptReportItem({
        index,
        card_id: this.card_id,
      });
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      loader.hide();
      this.GetOneReport(this.card_id);
    },
    async AcceptFromPatok(index) {
      const loader = loading.show();
      const data = await SeamInPatoksService.AcceptFromPatok({
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
      const data = await SeamInPatoksService.GetOneReport(id);
      this.reports.warehouse = data.data[0].warehouse;
      this.report = data.data[0];
      const classification_report_length =
        data.data[0].classification.report_box.length;
      this.reports.last_status =
        data.data[0].classification.report_box[
          classification_report_length - 1
        ].status;
      this.reports.classification = data.data[0].classification;
      this.reports.patoks_process = data.data[0].patoks_process;
      this.reports.report_box_patoks = data.data[0].report_box;
      const initialValue1 = ref(0);
      this.reports.done_classification =
        data.data[0].classification.report_box.reduce(
          (accumulator, currentValue) =>
            accumulator + Number(currentValue.quantity),
          initialValue1.value
        );
      const initialValue2 = ref(0);
      this.reports.done_patoks = data.data[0].report_box.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.quantity),
        initialValue2.value
      );
      const initialValue3 = ref(0);
      this.reports.done_notConfirm = data.data[0].patoks_process.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.quantity),
        initialValue3.value
      );
    },

    async CreateDayReport(items) {
      const loader = loading.show();
      const data = await SeamInPatoksService.CreateDayReport({
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
      const data = await SeamInPatoksService.CreaetInfoToForm({
        data: paload,
        id: this.card_id,
      });
      this.is_modal = false;

      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      const Refresh = () => {
        window.location.href = "/explore/department/seam/form";
      };
      setTimeout(Refresh, 1000);
      loader.hide();
    },
  },
});
