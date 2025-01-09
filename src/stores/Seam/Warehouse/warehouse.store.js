import { SeamWarehouseService } from "../../../ApiServices/Seam/warehouse/warehouse.service";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { defineStore } from "pinia";

export const SeamWarehouseStore = defineStore("SeamWarehouseStore", {
  state: () => {
    return {
      isActive: "",
      modal: {
        model: {},
        is_modal: false,
        title: "",
      },
      form_modal: false,

      items: [],
      all_length: "",
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async AddFormModal() {
      this.modal.is_modal = true;
      this.modal.title = "Skladga mato qo'shish";
      this.GetModel();
    },
    async GetOne(id) {
      const data = await SeamWarehouseService.GetOne(id);
      this.modal.model = data.data;
      this.modal.is_modal = true;
      this.modal.title = "Bichuvga mato chiqarish";
    },
    async GetModel() {
      const data = await SeamWarehouseService.GetModel();
      this.modal.model = data.data;
    },
    async Create(payload) {
      const loader = loading.show();
      const data = await SeamWarehouseService.Create(payload);
      this.form_modal = false;
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      this.GetAll();
      loader.hide();
    },
    async GetAll() {
      const data = await SeamWarehouseService.GetAll();
      this.items = data.data;
    },
  },
});
