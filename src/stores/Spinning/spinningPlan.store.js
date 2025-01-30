import { SaleService } from "../../ApiServices/Sale/sale.service";
import { SpinningService } from "../../ApiServices/Spinning/spinning.service";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "../../utils/Loader";
import { defineStore } from "pinia";

export const SpinningPlanStore = defineStore("SpinningPlan", {
  state: () => {
    return {
      confirm_model: {
        begunok_name: "",
        begunok_type: "",
        begunok_quantity: "",
        latun_name: "",
        latun_type: "",
        latun_quantity: "",
        delivery_time_provide: "",
      },
      all_length: {},
      card_id: "",
      is_active: "",
      items: [],
      model: "",
      is_provide: false,
      is_report_modal: false,
      is_detail_modal: false,
      is_report: false,
      is_report: false,
      detail: {},
      DoneSpinning: "",
    };
  },
  actions: {
    IsActive(payload) {
      this.is_active = payload.is_active;
    },
    async GetModel() {
      try {
        const data = await SaleService.getModel();
        this.model = data.data;
      } catch (err) {
        console.log(err);
      }
    },
    async GetAll(status) {
      try {
        const data = await SpinningService.getAll(status);
        this.items = data.data.items;
        this.all_length = data.data.all_length;
      } catch (err) {
        console.log(err);
      }
    },
    async DetailModal(payload) {
      if (payload.report) {
        const data = await SpinningService.GetOneFromWeaving(payload);
        this.is_report = true;
        this.is_detail_modal = true;
        this.detail = data.data.data;
        this.card_id = payload;
      } else {
        const data = await SpinningService.GetOneFromWeaving({ id: payload });
        this.is_detail_modal = true;
        this.is_report = false;
        this.detail = data.data;
        this.card_id = payload;
        console.log(this.detail);
      }
    },
    async ProvideModal() {
      this.is_provide = true;
    },
    async ReportModal() {
      this.is_report_modal = true;
      this.GetDayReport(this.detail.order_number);
    },
    async CreateDayReport(data) {
      const loader = loading.show();
      const report = await SpinningService.CreateDayReport(data);
      this.GetDayReport(data.order_number);
      ToastifyService.ToastSuccess({ msg: report.data.msg });
      loader.hide();
    },
    async GetDayReport(payload) {
      const data = await SpinningService.GetDayReport({
        order_number: payload,
      });
      this.report_paint = data.data.res;

      if (this.report_paint.length > 0) {
        const initialValuePaint = 0;
        this.DonePaint = this.report_paint.reduce(
          (a, b) => a + Number(b.quantity),
          initialValuePaint
        );
      }
    },
    async AcceptAndCreate(payload) {
      const loader = loading.show();
      const data = await SpinningService.AcceptAndCreate({
        id: this.card_id,
        items: this.detail,
        provide: payload,
      });

      this.GetAll({ is_active: this.is_active });
      this.is_detail_modal = false;
      ToastifyService.ToastSuccess({ msg: data.data.msg });
      loader.hide();
    },
    async GetOneOrderReport(payload) {
      const data = await SpinningService.GetOneOrderReport(payload);
      this.report.card = data.data[0];
      this.is_report_modal = true;
    },
  },
});
