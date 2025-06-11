import { defineStore } from "pinia";
import { ReadyWarehouseService } from "../../../ApiServices/Warehouses/r-warehouse/warehouse.service";
import { ToastifyService } from "../../../utils/Toastify";
import { Loading } from "../../../utils/Loading";
const loading = Loading()
export const ReadyWarehouseStore = defineStore("ReadyWarehouseStore", {
  state: () => ({
    ModalAction: {
      title: "",
      action: ""
    },
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
    UpdateModal(id) {
      this.partyId = id
      this.GetOne(id);
      this.product_modal = true;
      this.ModalAction = {
        title: `Partyani o'zgartirish`,
        action: 'update'
      }

    },
    TransferModal(id) {
      this.transfer_modal = true;
    },
    async AddProductModal() {
      this.GetModel();
      this.product_modal = true;
      this.ModalAction = {
        title: `Mahsulot qo'shish`,
        action: 'create'
      }
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
      console.log(data.data);

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
    async OutputProduct(output) {
      // const loader = loading.show();
      const data = await ReadyWarehouseService.OutputProduct({ output, partyId: this.partyId });
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
