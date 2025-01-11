import { SeamFormWarehouseService } from "../../../ApiServices/Seam/form-warehouse/warehouse.service";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { defineStore } from "pinia";
import { ref } from "vue";
export const SeamFormWarehouseStore = defineStore("SeamFormWarehouseStore", {
  state: () => {
    return {
      isActive: "",
      modal: {
        model: {},
        input_total: "",
        is_modal: false,
        title: "",
      },

      items: [],
      all_length: "",
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async GetAll(payload) {
      const data = await SeamFormWarehouseService.GetAll(payload);
      this.items = data.data.items;
    },
    async AcceptAndCreate(id) {
      const loader = loading.show();
      const data = await SeamFormWarehouseService.AcceptAndCreate(id);
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

      loader.hide();
    },
    async GetOne(id) {
      const data = await SeamFormWarehouseService.GetOne(id);
      this.modal.model = data.data;
      console.log(data.data);

      this.modal.is_modal = true;
      this.modal.title = "Mahsulot chiqarish va kiritish ";
      this.modal.card_id = id;

      const initialInput = ref(0);
      this.modal.input_total = data.data.input.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.quantity),
        initialInput.value
      );
    },
  },
});
