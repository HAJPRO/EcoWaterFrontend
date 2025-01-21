import { v4 as uuidv4 } from "uuid";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { SeamInFormService } from "../../../ApiServices/Seam/form/form.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export const SeamInFormStore = defineStore("SeamInFormStore", {
  state: () => {
    return {
      isActive: "",
      items: [],
      is_modal: false,
      model: {
        id: uuidv4(),
        pastal_quantity: "",
        head_pack: "",
        waste_quantity: "",
        fact_gramage: "",
        model_name: "",
        quantity: "",
        size: "",
        unit: "",
        status: "Tasnifga yuborildi",
      },
      reports: {
        is_modal: false,
        id: "",
        products: [],
        product: {},
        total: "",
        report: {},
        update: false,
        report_product_id: "",
        done: "",
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
      this.reports.is_modal = true;
      this.reports.id = id;
      this.model = {
        id: uuidv4(),
        pastal_quantity: "",
        head_pack: "",
        waste_quantity: "",
        fact_gramage: "",
        model_name: "",
        quantity: "",
        size: "",
        unit: "",
        status: "Tasnifga yuborildi",
      };
      this.GetOneReport(id);
    },
    async GetOneReport(id) {
      const data = await SeamInFormService.GetOneReport(id);

      this.reports.report = data.data;

      this.GetOneReportPastal();
    },
    async GetOneReportPastal(data) {
      const res = await SeamInFormService.GetOneReportPastal(data);
      this.reports.product = res.data;
    },

    async CreateDayReport(items) {
      const loader = loading.show();
      const data = await SeamInFormService.CreateDayReport({
        items,
        id: this.reports.id,
      });
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      this.GetOneReport(this.reports.id);
      this.getAll(this.isActive);
      loader.hide();
    },
    async UpdateReport(items) {
      const loader = loading.show();
      const data = await SeamInFormService.Update({
        items,
        id: this.reports.report_product_id,
      });
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      this.GetOneReport(this.reports.id);
      this.getAll(this.isActive);
      loader.hide();
    },
    async GetOneForUpdate(id) {
      const loader = loading.show();
      const data = await SeamInFormService.GetOneForUpdate(id);
      this.reports.report_product_id = id;
      this.reports.update = true;
      this.model = {
        pastal_quantity: data.data.form.pastal_quantity,
        head_pack: data.data.form.head_pack,
        waste_quantity: data.data.form.waste_quantity,
        fact_gramage: data.data.form.fact_gramage,
        model_name: data.data.product.model_name,
        quantity: data.data.product.quantity,
        size: data.data.product.size,
        unit: data.data.product.unit,
        status: "Tasnifga yuborildi",
        id: uuidv4(),
      };
      loader.hide();
    },
    async getAll(payload) {
      const loader = loading.show();
      const data = await SeamInFormService.GetAll(payload);
      this.items = data.data.items;

      loader.hide();
    },
    async AcceptAndCreate(id) {
      const loader = loading.show();
      const data = await SeamInFormService.AcceptAndCreate(id);
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      this.GetAll(this.isActive);
      loader.hide();
    },
  },
});
