import { SaleService } from "../../ApiServices/Sale/sale.service";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { defineStore } from "pinia";

export const SaleStore = defineStore("saleStore", {
  state: () => {
    return {
      model: {},
      detail: {},
      all_length: {},
      items: [],
      card_id: "",
      is_modal: false,
      is_create_modal: false,
      is_detail_modal: false,
      model: "",
      proccess_modal: false,
      proccess_data: [],
      DonePaint: "",
      DoneWeaving: "",
      DoneSpinning: "",
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
    async DetailModal(payload) {
      const data = await SaleService.GetOne({ id: payload });
      this.is_detail_modal = true;
      this.detail = data.data;
      this.card_id = payload;
    },
    async SaleCreateCardModal() {
      this.is_create_modal = true;
      this.GetCardModel();
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
      const data = await SaleService.getAll(payload);
      this.items = data.data.items;
      this.all_length = data.data.all_length;
      loader.hide();
    },
    async AllOrderProccessById(payload) {
      const data = await SaleService.AllOrderProccessById(payload);
      this.proccess_modal = true;
      this.proccess_data = data.data;
      this.card_id = payload.id;

      if (this.proccess_data.ReportPaint.length > 0) {
        const initialValuePaint = 0;
        this.DonePaint = this.proccess_data.ReportPaint.reduce(
          (a, b) => a + Number(b.quantity),
          initialValuePaint
        );
      } else {
        this.DonePaint = 0;
      }
      if (this.proccess_data.ReportWeaving.length > 0) {
        const initialValueWeaving = 0;
        this.DoneWeaving = this.proccess_data.ReportWeaving.reduce(
          (a, b) => a + Number(b.quantity),
          initialValueWeaving
        );
      } else {
        this.DoneWeaving = 0;
      }
      if (this.proccess_data.ReportSpinning.length > 0) {
        const initialValueSpinning = 0;
        this.DoneSpinning = this.proccess_data.ReportSpinning.reduce(
          (a, b) => a + Number(b.quantity),
          initialValueSpinning
        );
      } else {
        this.DoneSpinning = 0;
      }
    },

    async FinishParty() {
      const loader = loading.show();
      const data = await SaleService.FinishParty({ id: this.card_id });
      this.getAll({ status: 1 });
      this.AllOrderProccessById({ id: this.card_id });
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      loader.hide();
    },
    async Update(payload) {
      try {
        const loader = loading.show();
        const updateData = await SaleService.Edit(this.card_id, payload);

        ToastifyService.ToastSuccess({
          msg: updateData.data.msg,
        });
        const Refresh = () => {
          window.location.href = "/explore/sale/legal";
        };
        setTimeout(Refresh, 1000);
        loader.hide();
      } catch (error) {
        return ToastifyService.ToastError({ msg: error.messages });
      }
    },

    async Confirm() {
      try {
        const loader = loading.show();
        const confirmData = await SaleService.confirm(this.card_id);
        this.getAll({ status: 1 });
        this.is_detail_modal = false;
        ToastifyService.ToastSuccess({
          msg: confirmData.data.msg,
        });
        loader.hide();
      } catch (error) {
        return ToastifyService.ToastError({ msg: error.messages });
      }
    },

    async DeleteById(id) {
      try {
        const loader = loading.show();
        const data = await SaleService.Delete(id);
        this.getAll({ status: 1 });

        ToastifyService.ToastSuccess({
          msg: data.data.msg,
        });
        loader.hide();
      } catch (error) {
        return ToastifyService.ToastError({ msg: error.messages });
      }
    },
  },
});
