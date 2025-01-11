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
        model: {},
        output_total: "",
        is_modal: false,
        title: "",
        output: false,
        input: false,
        card_id: "",
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
      this.modal.input = true;
      this.GetModel();
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
    async Create(payload) {
      const loader = loading.show();
      const data = await SeamWarehouseService.Create(payload);
      this.form_modal = false;
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
      this.GetOne(this.modal.card_id);

      loader.hide();
    },
    // async CreateOutput(payload) {
    //   const loader = loading.show();
    //   const data = await SeamWarehouseService.CreateOutput(payload);
    //   this.form_modal = false;
    //   ToastifyService.ToastSuccess({
    //     msg: data.data.msg,
    //   });
    //   this.GetAll();
    //   loader.hide();
    // },
    async GetAll() {
      const data = await SeamWarehouseService.GetAll();
      this.items = data.data;
    },
  },
});
