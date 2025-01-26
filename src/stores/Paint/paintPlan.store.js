import { SaleService } from "../../ApiServices/Sale/sale.service";
import { PaintService } from "../../ApiServices/Paint/paint.service";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { defineStore } from "pinia";

export const PaintPlanStore = defineStore("paintPlanStore", {
  state: () => {
    return {
      confirm_model: {
        pus: "",
        fike: "",
        color: "",
        color_quantity: "",
        material_name: "",
        material_type: "",
        delivery_time_provide: "",
        weaving_qauntity: "",
        delivery_time_weaving: "",
      },
      report_paint: [],
      card_id: "",
      is_modal: false,
      items: [],
      all_length: {},
      item: [],
      confirmed_orders: [],
      order_report: [],

      is_report_modal: false,
      model: "",
      is_provide: false,
      is_active: "",
      sale_order_id: "",
      DonePaint: "",
      paint_status: "",
      is_detail_modal: false,
      is_report: false,
      detail: {},
      is_report: false,
      report: {
        card: {},
      },
    };
  },
  actions: {
    IsActive(payload) {
      this.is_active = payload.is_active;
    },
    async GetModel() {
      try {
        const data = await PaintService.getModel();
        this.model = data.data;
      } catch (err) {
        console.log(err);
      }
    },
    async DetailModal(payload) {
      if (payload.report) {
        const data = await PaintService.GetOneFromSale(payload);
        this.is_report = true;
        this.is_detail_modal = true;
        this.detail = data.data.data;

        this.card_id = payload;
      } else {
        const data = await PaintService.GetOneFromSale({ id: payload });
        this.is_detail_modal = true;
        this.detail = data.data.data;
        this.card_id = payload;
      }
    },
    async ProvideModal() {
      this.is_provide = true;
    },
    async ReportModal() {
      this.is_report_modal = true;
      this.GetDayReport(this.detail.card.order_number);
    },
    async CreateDayReport(data) {
      console.log(data);

      const loader = loading.show();
      const report = await PaintService.CreateDayReport(data);
      this.GetDayReport(data.order_number);
      ToastifyService.ToastSuccess({ msg: report.data.msg });
      loader.hide();
    },
    async GetDayReport(payload) {
      const data = await PaintService.GetDayReport({ order_number: payload });
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
      const data = await PaintService.AcceptAndCreate({
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
      const data = await PaintService.GetOneOrderReport(payload);
      this.report.card = data.data[0];

      this.is_report_modal = true;
    },
    async GetAll(status) {
      try {
        const data = await PaintService.getAll(status);
        this.items = data.data.items;
        this.all_length = data.data.all_length;
      } catch (err) {
        console.log(err);
      }
    },
    async openModalById(payload) {
      this.card_id = payload.id;
      this.is_modal = payload.is_modal;
      const data = await SaleService.getOne(payload.id);
      this.item = Array(data.data);
    },
    async PaintConfirmedOrders(payload) {
      const data = await PaintService.PaintConfirmedOrders(payload.status).then(
        (items) => {
          items.map((item) => {
            return item.confirmed_orders;
          });
        }
      );

      this.confirmed_orders = Array(data.data);
    },
    async cancelSendReason(payload) {
      try {
        const loader = loading.show();
        const data = await PaintService.cancelReason({
          reason: payload.reason,
          card_id: payload.id,
        });
        loader.hide();
        const Refresh = () => {
          window.location.href = "/explore/department/paint/working/plan";
        };
        ToastifyService.ToastSuccess({ msg: data.data.msg });
        setTimeout(Refresh, 1500);
      } catch (error) {
        ToastifyService.ToastError({
          msg: error.message,
        });
      }
    },
    isConfirmModal(payload) {
      this.is_provide = payload.is_modal;
    },
    async SaveToProvide(payload) {
      try {
        const loader = loading.show();
        const data = await PaintService.create({
          items: payload.data,
          card_id: payload.id,
        });
        loader.hide();
        const TimeOut = () => {
          window.location.href = "/explore/department/paint/working/plan";
        };
        ToastifyService.ToastSuccess({ msg: data.data.msg });
        setTimeout(TimeOut, 1000);
      } catch (err) {
        console.log(err);
      }
    },
    async StatusModalById(payload) {
      this.status_modal.id = payload.id;
      this.status_modal.isModal = payload.is_modal;
      // const data = await SaleService.getOne(payload.id)
      // this.model = data.data
    },
    async Update(payload) {
      try {
        const loader = loading.show();
        const updateData = await SaleService.Edit(this.card_id, payload);
        loader.hide();
        ToastifyService.ToastSuccess({
          msg: updateData.data.msg,
        });
        const Refresh = () => {
          window.location.href = "/explore/sale/legal";
        };
        setTimeout(Refresh, 1500);
      } catch (error) {
        return ToastifyService.ToastError({ msg: error.messages });
      }
    },

    async Confirm(id) {
      try {
        const loader = loading.show();
        const confirmData = await SaleService.confirm(id);
        loader.hide();
        ToastifyService.ToastSuccess({
          msg: confirmData.data.msg,
        });
        const Refresh = () => {
          window.location.href = "/explore/sale/legal";
        };
        setTimeout(Refresh, 1500);
      } catch (error) {
        return ToastifyService.ToastError({ msg: error.messages });
      }
    },
    async OpenReportModalById(payload) {
      const data = await PaintService.getOneFromInProcess({ id: payload.id });
      this.order_report = data.data;
      (this.is_report_modal = true),
        (this.sale_order_id = data.data.sale_order_id);
      await this.getDayReportFromPaint(this.sale_order_id);
    },
    async addDayReportInProcess(items) {
      const data = await PaintService.addDayReportInProcess({
        items,
        id: this.sale_order_id,
      });
      await this.getDayReportFromPaint(this.sale_order_id);
    },
    async getDayReportFromPaint(id) {
      const data = await PaintService.getDayReportFromPaint(id);
      if (data.data.report.length > 0) {
        const initialValuePaint = 0;
        this.DonePaint = data.data.report.reduce(
          (a, b) => a + Number(b.quantity),
          initialValuePaint
        );
      }
      this.report_paint = data.data;
      this.paint_status = data.data.status;
    },
    async Finish() {
      try {
        const loader = loading.show();
        const data = await PaintService.Finish(this.sale_order_id);
        loader.hide();
        ToastifyService.ToastSuccess({
          msg: data.data.msg,
        });
        const Refresh = () => {
          window.location.href = "/explore/department/paint/working/plan";
        };
        setTimeout(Refresh, 1500);
      } catch (error) {
        return ToastifyService.ToastError({ msg: error.messages });
      }
    },
    async DeleteById(id) {
      try {
        const loader = loading.show();
        const data = await SaleService.Delete(id);
        loader.hide();
        ToastifyService.ToastSuccess({
          msg: data.data.msg,
        });
        const Refresh = () => {
          window.location.href = "/explore/sale/legal";
        };
        setTimeout(Refresh, 1500);
      } catch (error) {
        return ToastifyService.ToastError({ msg: error.messages });
      }
    },
  },
});
