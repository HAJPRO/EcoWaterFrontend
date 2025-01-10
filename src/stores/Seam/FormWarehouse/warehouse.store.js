import { SeamFormWarehouseService } from "../../../ApiServices/Seam/form-warehouse/warehouse.service";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { defineStore } from "pinia";
import { ref } from "vue";
export const SeamFormWarehouseStore = defineStore("SeamFormWarehouseStore", {
  state: () => {
    return {
      isActive: "",
      items: [],
      all_length: "",
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
      console.log(payload);
    },
    async GetAll(payload) {
      const data = await SeamFormWarehouseService.GetAll(payload);

      this.items = data.data.items;
    },
    async Create(payload) {
      const loader = loading.show();
      const data = await SeamFormWarehouseStore.Create(payload);
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
  },
});
