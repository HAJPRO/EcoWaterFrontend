import { defineStore } from "pinia";
import { ReadyWarehouseService } from "../../../ApiServices/Warehouses/r-warehouse/warehouse.service";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { th } from "element-plus/es/locale/index.mjs";
export const ReadyWarehouseStore = defineStore("ReadyWarehouseStore", {
  state: () => ({
    partyId: "",
    detail_modal: false,
    transfer_modal: false,
    isActive: "",
    product_modal: false,
    model: {},
    products: [],
    product: {},
    page: null,
    action: 1,
    all_length: {},
  }),
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    DetailModal(id) {
      this.partyId = id
      this.GetOne(id);
      this.detail_modal = true;
    },
    TransferModal(id) {
      this.transfer_modal = true;
    },
    async AddProductModal() {
      this.GetModel();
      this.product_modal = true;
    },
    async GetModel() {
      const data = await ReadyWarehouseService.GetModel();
      this.model = data.data.model;

    },
    async Create(payload) {
      const loader = loading.show();
      const data = await ReadyWarehouseService.Create(payload);
      loader.hide();
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
    async GetAll(payload) {
      const loader = loading.show();
      const data = await ReadyWarehouseService.GetAll(payload);
      this.products = data.data.products;
      this.all_length = data.data.all_length;

      loader.hide();

    },
    async GetOne(id) {
      const loader = loading.show();
      const data = await ReadyWarehouseService.GetOne(id);
      this.product = data.data.product;
      this.model = data.data.product;
      loader.hide();

    },
    async OutputProduct(payload) {
      // const loader = loading.show();
      const data = await ReadyWarehouseService.OutputProduct({ ...payload, partyId: this.partyId });
      this.GetOne(this.partyId)
      // loader.hide();
      if (data.data.status === 404)
        ToastifyService.ToastError({
          msg: data.data.msg,
        });
      if (data.data.status === 200)
        ToastifyService.ToastSuccess({
          msg: data.data.msg,
        });

    },
  },
});
