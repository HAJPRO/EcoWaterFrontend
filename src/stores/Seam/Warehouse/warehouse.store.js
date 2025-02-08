import { SeamWarehouseService } from "../../../ApiServices/Seam/warehouse/warehouse.service";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { defineStore } from "pinia";
import { ref } from "vue";
export const SeamWarehouseStore = defineStore("SeamWarehouseStore", {
  state: () => {
    return {
      isActive: "",
      modal: {
        model: {
          customer_name: "",
          order_number: "",
          material_name: "",
          material_type: "",
          artikul: "",
          color: "",
          width: "",
          grammage: "",
          quantity: "",
          unit: "",
        },
        output_total: "",
        is_modal: false,
        title: "",
        output: false,
        input: false,
        card_id: "",
      },
      form_modal: false,


      items: [],
      total_product: "",
      all_length: "",
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async AddFormModal() {
      this.GetModel();
      this.modal.is_modal = true;
    },
    async GetOne(id) {
      const data = await SeamWarehouseService.GetOne(id);
      this.modal.card_id = id;
      this.modal.model = data.data;
      this.modal.title = "Skladdan mato chiqarish";
      this.modal.output = true;

      const initialOutput = ref(0);
      this.modal.output_total = data.data.output.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.quantity),
        initialOutput.value
      );
    },
    async GetModel() {
      const data = await SeamWarehouseService.GetModel();
      this.modal.model = data.data;
    },
    async create(payload) {
      const loader = loading.show();
      const data = await SeamWarehouseService.create(payload);
      if (data.data.status === 200) {
        ToastifyService.ToastSuccess({
          msg: data.data.msg,
        });
      }
      if (data.data.status === 404) {
        ToastifyService.ToastError({
          msg: data.data.msg,
        });
      }
      this.GetAll();
      this.modal.is_modal = false
      loader.hide();
    },

    async GetAll(item) {
      if (item) {
        const loader = loading.show();
        const data = await SeamWarehouseService.GetAll(item);
        this.items = data.data.items;
        this.total_product = data.data.total
        loader.hide();
      } else {
        const loader = loading.show();
        const data = await SeamWarehouseService.GetAll({ page: 1, status: 1, limit: 10 });
        this.items = data.data.items;
        this.total_product = data.data.total
        loader.hide();
      }



    },
  },
});
