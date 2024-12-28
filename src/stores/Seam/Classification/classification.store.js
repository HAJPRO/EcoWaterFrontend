import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { SeamInClassificationService } from "../../../ApiServices/Seam/classification/classification.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export const SeamInClassificationStore = defineStore(
  "SeamInClassificationStore",
  {
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
          done_form: "",
          done_classification: "",
          form: {},
          report_box_classification: [],
          status: "",
        },
        report: [],
        card_id: "",
      };
    },
    actions: {
      GetIsActive(payload) {
        this.isActive = payload;
      },
      async ConfirmAndCreteProcess(id) {
        const loader = loading.show();
        const data = await SeamInClassificationService.ConfirmAndCreteProcess(
          id
        );
        ToastifyService.ToastSuccess({
          msg: data.data.msg,
        });
        const Refresh = () => {
          window.location.href = "/explore/department/seam/classification";
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
        const data = await SeamInClassificationService.AcceptReportItem({
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
        const data = await SeamInClassificationService.GetOneReport(id);
        this.reports.form = data.data[0].form;
        this.reports.report_box_classification = data.data[0].report_box;
        const initialValue = ref(0);
        this.reports.done_form = data.data[0].form.report_box.reduce(
          (accumulator, currentValue) =>
            accumulator + Number(currentValue.quantity),
          initialValue.value
        );
        const initialValueClass = ref(0);
        this.reports.done_classification = data.data[0].report_box.reduce(
          (accumulator, currentValue) =>
            accumulator + Number(currentValue.quantity),
          initialValueClass.value
        );
      },

      async CreateDayReport(items) {
        const loader = loading.show();
        const data = await SeamInClassificationService.CreateDayReport({
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
      async getAll(payload) {
        const loader = loading.show();
        const data = await SeamInClassificationService.GetAll(payload);
        this.items = data.data.items;
        loader.hide();
      },
      async CreaetInfoToForm(paload) {
        const loader = loading.show();
        const data = await SeamInClassificationService.CreaetInfoToForm({
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
  }
);
