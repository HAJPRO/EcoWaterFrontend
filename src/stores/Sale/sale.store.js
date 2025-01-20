import { SaleService } from "../../ApiServices/Sale/sale.service";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { defineStore } from "pinia";

export const SaleStore = defineStore("saleStore", {
  state: () => {
    return {
      model: {},
      length: "",
      items: [],
      card_id: "",
      is_modal: false,
      is_create_modal: false,
      model: "",
      proccess_modal: false,
      proccess_data: {
        order: [],
        paint: [],
        weaving: [],
        spinning: [],
      },
      paint_process: [],
      is_active: "",
      plus_name_modal: false,
      plus_type_modal: false,
      pro_names: [],
      pro_types: [],
    };
  },
  actions: {

    IsActive(payload) {
      this.is_active = payload.is_active;
    },
    async SaleCreateCardModal() {
      this.is_create_modal = true
      this.GetCardModel()
    },
    async GetCardModel() {
      const data = await SaleService.GetCardModel();
      this.model = data.data;
    },
    PlusProNameModal() {
      this.plus_name_modal = true;
    },
    PlusProTypeModal() {
      this.plus_type_modal = true;
    },
    async CreateProType(payload) {
      const type = await SaleService.CreateProType(payload);
      GetProType();
    },
    async CreateProName(payload) {
      const name = await SaleService.CreateProName(payload);
      GetProName();
    },
    async GetProName() {
      const names = await SaleService.GetProName();
      this.pro_names = names.data;
    },
    async GetProType() {
      const types = await SaleService.GetProType();
      this.pro_types = types.data;
    },
    async getAll(payload) {
      const loader = loading.show();
      const res = await SaleService.getAll(payload);
      this.active_tab = payload;
      this.length = res.data.length;
      this.items = res.data.all;
      loader.hide();
    },
    async AllOrderProccessById(payload) {
      const data = await SaleService.AllOrderProccessById(payload);

      this.proccess_modal = true;
      this.proccess_data.order = data.data.order;
      this.proccess_data.paint =
        data.data.paint.length > 0
          ? data.data.paint[0].paint_report.order_report_at_progress
          : [];
      this.proccess_data.weaving =
        data.data.weaving.length > 0
          ? data.data.weaving[0].weaving_report.order_report_at_progress
          : [];
      this.proccess_data.spinning =
        data.data.spinning.length > 0
          ? data.data.spinning[0].spinning_report.order_report_at_progress
          : [];
    },
    async openModalById(payload) {
      this.card_id = payload.id;
      this.is_modal = payload.is_modal;
      const data = await SaleService.getOne(payload.id);
      this.model = data.data;
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
        setTimeout(Refresh, 1000);
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
        this.getAll();
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
        this.getAll(this.active_tab);
      } catch (error) {
        return ToastifyService.ToastError({ msg: error.messages });
      }
    },
  },
});
