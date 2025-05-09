import { defineStore } from "pinia";
import { ReadyWarehouseService } from "../../../ApiServices/Warehouses/r-warehouse/warehouse.service";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
export const ReadyWarehouseStore = defineStore("ReadyWarehouseStore", {
  state: () => ({
    product_modal: false,
    model: {},
  }),
  actions: {
    async AddProductModal() {
      this.GetModel();
      this.product_modal = true;
    },
    async GetModel() {
      const data = await ReadyWarehouseService.GetModel();

      this.model = data.data.model;
      console.log(this.model);
    },
    async Create(payload) {
      const loader = loading.show();
      const data = await ReadyWarehouseService.Create(payload);
      loader.hide();
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
  },
});
