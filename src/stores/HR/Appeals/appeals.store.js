import { HRAppealsService } from "../../../ApiServices/HR/Appeals/appeals.service";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { defineStore } from "pinia";
import { ref } from "vue";
export const HRAppealsStore = defineStore("HRAppealsStore", {
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
    },

    async GetAll(payload) {
      const data = await HRAppealsService.GetAll(payload);
      this.items = data.data.items;
    },
  },
});
