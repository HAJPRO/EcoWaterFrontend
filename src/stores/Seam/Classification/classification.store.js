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
        report_form: {
          done: "",
          report_box: [],
          party_number: "",
          customer_name: "",
          status: ""
        },
        report: [],
        card_id: "",
      };
    },
    actions: {
      GetIsActive(payload) {
        this.isActive = payload;
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
        this.report_form.report_box = data.data[0].report_box;
        this.report_form.customer_name = data.data[0].warehouse.customer_name;
        this.report_form.party_number = data.data[0].warehouse.party_number;
        this.report_form.status = data.data[0].status;

        const initialValue = ref(0);
        this.report_form.done = data.data[0].report_box.reduce(
          (accumulator, currentValue) =>
            accumulator + Number(currentValue.quantity),
          initialValue.value
        );
      },

      async CreateDayReport(items) {
        const loader = loading.show();
        const data = await SeamInClassificationService.CreateDayReport({
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
