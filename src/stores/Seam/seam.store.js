import { SeamWarehouseService } from "../../ApiServices/Seam/warehouse/warehouse.service";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "../../utils/Loader";
import { defineStore } from "pinia";

export const SeamStore = defineStore("SeamPlan", {
  state: () => {
    return {
      isActive: "",
      form_modal: false,
      model: {},
      items: [],
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async AddFormModal() {
      this.form_modal = true;
      this.GetFormMode();
    },
    async GetFormMode() {
      const data = await SeamWarehouseService.GetFormMode();
      this.model = data.data;
    },
    async CreaetToForm(payload) {
      const data = await SeamWarehouseService.CreaetToForm(payload);
    },
    async GetAllForm() {
      const data = await SeamWarehouseService.GetAllForm();
      this.items = data.data;
    },
  },
});
