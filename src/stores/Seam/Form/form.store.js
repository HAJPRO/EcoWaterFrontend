import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { SeamInFormService } from "../../../ApiServices/Seam/form/form.service";
import { defineStore } from "pinia";

export const SeamInFormStore = defineStore("SeamInFormStore", {
  state: () => {
    return {
      isActive: "",
      items: [],
      is_modal: false,
      model: {
        pastal_quantity: "",
        waste_quantity: "",
        fact_gramage: "",
      },
      report: {
        is_modal: false,
        id: "",
      },

      card_id: "",
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    FormModal(id) {
      this.is_modal = true;
      this.card_id = id;
    },
    ReportModal(id) {
      this.report.is_modal = true;
      this.report.id = id;
    },
    async CreateDayReport(items) {
      const loader = loading.show();
      const data = await SeamInFormService.CreateDayReport({
        items,
        id: this.report.id,
      });
      this.report.is_modal = false;

      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      const Refresh = () => {
        window.location.href = "/explore/department/seam/form";
      };
      setTimeout(Refresh, 1000);
      loader.hide();
    },
    async getAll(payload) {
      const loader = loading.show();
      const data = await SeamInFormService.GetAll(payload);
      this.items = data.data.items;
      loader.hide();
    },
    async CreaetInfoToForm(paload) {
      const loader = loading.show();
      const data = await SeamInFormService.CreaetInfoToForm({
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
