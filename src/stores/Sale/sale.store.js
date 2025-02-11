import { SaleService } from "../../ApiServices/Sale/sale.service";
import { utils, writeFileXLSX } from "xlsx";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { defineStore } from "pinia";
import { format } from "date-fns"
export const SaleStore = defineStore("saleStore", {
  state: () => {
    return {
      update_model: {},
      is_update_modal: false,
      param_id: "",
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
      current_page: "",
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
    async create(payload) {
      const loader = loading.show();
      const data = await SaleService.create(payload);
      this.getAll({ status: 1, page: this.current_page, limit: 15 });
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      loader.hide();
    },

    async CardProductById(id) {
      const data = await SaleService.GetOne({ id, product: true });
    },
    async UpdateModal(id) {
      const data = await SaleService.GetOne({ id });
      this.update_model = data.data;
      this.param_id = id;
      this.is_update_modal = true;
    },
    async CardProductById(id) {
      const data = await SaleService.GetOne({ id, product: true });
    },
    async getAll(payload) {
      const loader = loading.show();
      this.current_page = payload.page
      const data = await SaleService.getAll(payload);
      this.items = data.data.items;
      this.all_length = data.data.all_length;
      loader.hide();
    },
    async AllOrderProccessById(payload) {
      const loader = loading.show();
      const data = await SaleService.AllOrderProccessById(payload);
      this.proccess_modal = true;
      this.proccess_data = data.data;
      this.card_id = payload.id;
      loader.hide();

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
      this.getAll({ status: 1, page: this.current_page, limit: 15 });
      this.AllOrderProccessById({ id: this.card_id });
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      loader.hide();
    },


    async Confirm() {
      try {
        const loader = loading.show();
        const confirmData = await SaleService.confirm(this.card_id);
        this.getAll({ status: 1, page: this.current_page, limit: 15 });
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
        this.getAll({ status: 1, page: this.current_page, limit: 15 });

        ToastifyService.ToastSuccess({
          msg: data.data.msg,
        });
        loader.hide();
      } catch (error) {
        return ToastifyService.ToastError({ msg: error.messages });
      }
    },
    async ExportExcelById(id) {
      const data = await SaleService.GetOne({ id });
      if (data.data) {
        const card = data.data.sale_products.map((item) => {
          const products = {
            id: 1,
            customer_name: data.data.customer_name,
            artikul: data.data.artikul,
            order_number: data.data.order_number,
            material_name: item.material_name,
            material_type: item.material_type,
            color: item.color,
            width: item.width,
            grammage: item.grammage,
            order_quantity: item.order_quantity,
            unit: item.unit,
            delivery_time: format(data.data.delivery_time, "dd.MM.yyyy HH:mm"),
            received_time: data.data.received_time ? format(data.data.received_time, "dd.MM.yyyy HH:mm") : "-",
          };

          return products;
        });
        const heading = [
          [
            "№",
            "Buyurtmachi",
            "Artikul ",
            "Buyurtma nomeri",
            "Mato nomi",
            "Mato turi ",
            "Mato rangi",
            "Eni",
            "Grammage",
            "Miqdori",
            "Birligi",
            "Muddati",
            "Tasdiqlangan vaqti",
          ],
        ];

        const ws1 = utils.json_to_sheet(card);
        const wb = utils.book_new();
        utils.sheet_add_aoa(ws1, heading);
        utils.book_append_sheet(wb, ws1, `${card[0].customer_name}`);
        writeFileXLSX(wb, `${Date.now()}.xlsx`);
      } else {
        ToastifyService.ToastError({
          msg: "Exportda xatolik yuz berdi !",
        });
      }
    },
  },
});
