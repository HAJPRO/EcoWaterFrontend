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
        head_pack: "",
        pastal_quantity: "",
        waste_quantity: "",
        fact_gramage: "",
        status: false,
      },
      reports: {
        is_modal: false,
        id: "",
        form: {},
        report: "",
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
      this.GetOneReport(id);
    },
    async GetOneReport(id) {
      const data = await SeamInFormService.GetOneReport(id);
      this.reports.form = data.data[0];
      // this.reports.report = data.data[0];
      // this.reports.warehouse = data.data[0].warehouse;

      // const initialValue = ref(0);
      // this.reports.done = data.data[0].report_box.reduce(
      //   (accumulator, currentValue) =>
      //     accumulator + Number(currentValue.quantity),
      //   initialValue.value
      // );
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
