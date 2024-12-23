// import { ToastifyService } from "../../utils/Toastify";
// import { loading } from "../../utils/Loader";
import { defineStore } from "pinia";

export const SeamInFormStore = defineStore("SeamInFormStore", {
  state: () => {
    return {
      isActive: "",
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    getAll(payload) {
      console.log(payload);
    },
  },
});
