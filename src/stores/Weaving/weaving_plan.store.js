import { ProvideService } from "../../ApiServices/Provide/provide.service";
import { WeavingService } from "../../ApiServices/Weaving/weaving.service";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { defineStore } from "pinia";

export const WeavingPlanStore = defineStore("WeavingPlan", {
  state: () => {
    return {
      is_detail_modal: false,
      detail: {},
      card_id: "",
      is_provide: false,
      is_report_modal: false,
      item: [],
      confirm_model: {
        yarn_name: "",
        yarn_type: "",
        yarn_quantity: "",
        delivery_time_spinning: "",
        likra_type: "",
        likra_quantity: "",
        melaks_type: "",
        melaks_quantity: "",
        polister_quantity: "",
        polister_type: "",
        delivery_time_provide: "",
      },
      card_id: "",
      is_modal: false,
      items: [],
      model: "",
      is_report: false,
      is_active: "",
      order_id: "",
      paint_process_id: "",
      all_length: {},
      order_report: [],

      is_report_modal: false,
      sale_order_id: "",
      DoneWeaving: "",
      report_weaving: [],
      report_spinning: [],
      DoneSpinning: "",
      detail_provide: {},
      detail_weaving_modal: false,
    };
  },
  actions: {
    async GetModel() {
      try {
        const data = await WeavingService.getModel();
        this.model = data.data;
      } catch (err) {
        console.log(err);
      }
    },
    IsActive(payload) {
      this.is_active = payload.is_active;
    },
    async GetAll(status) {
      try {
        const data = await WeavingService.getAll(status);
        this.items = data.data.items;
        this.all_length = data.data.all_length;
      } catch (err) {
        console.log(err);
      }
    },
    async DetailModal(payload) {
      if (payload.report) {
        const data = await WeavingService.GetOneFromPaint(payload);
        this.is_report = true;
        this.is_detail_modal = true;
        this.detail = data.data;
      } else {
        const data = await WeavingService.GetOneFromPaint(payload);
        this.is_report = false;
        this.is_detail_modal = true;
        this.detail = data.data;
      }
    },
    async ReportModal() {
      this.is_report_modal = true;
      this.GetDayReport(this.detail.order_number);
    },
    async CreateDayReport(data) {
      const loader = loading.show();
      const report = await WeavingService.CreateDayReport(data);
      this.GetDayReport(data.order_number);
      ToastifyService.ToastSuccess({ msg: report.data.msg });
      loader.hide();
    },
    async GetDayReport(payload) {
      const data = await WeavingService.GetDayReport({ order_number: payload });
      this.report_weaving = data.data.weaving;
      this.report_spinning = data.data.spinning;

      if (this.report_spinning.length > 0) {
        const initialValueSpinning = 0;
        this.DoneSpinning = this.report_spinning.reduce(
          (a, b) => a + Number(b.quantity),
          initialValueSpinning
        );
      } else {
        this.DoneSpinning = 0;
      }
      if (this.report_weaving.length > 0) {
        const initialValuePaint = 0;
        this.DoneWeaving = this.report_weaving.reduce(
          (a, b) => a + Number(b.quantity),
          initialValuePaint
        );
      } else {
        this.DoneWeaving = 0;
      }
    },
    async ProvideModal() {
      this.is_provide = true;
    },
    async AcceptAndCreate(provide) {
      const loader = loading.show();
      const data = await WeavingService.AcceptAndCreate({
        provide,
        card: this.detail,
      });
      this.GetAll({ status: this.is_active });
      this.is_provide = false;
      this.is_detail_modal = false;
      ToastifyService.ToastSuccess({ msg: data.data.msg });
      loader.hide();
    },
    async DetailModalProvide(payload) {
      try {
        const data = await ProvideService.getOne(payload);
        this.detail_provide = data.data;
        this.detail_weaving_modal = true;
      } catch (err) {
        console.log(err);
      }
    },
  },
});
