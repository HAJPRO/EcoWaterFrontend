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
      chat: {
        id: "",
        is_modal: false,
      },
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
    async ReplyMessageModal(id) {
      this.chat.id = id;
      this.chat.is_modal = true;
    },
    async ReplyMessageCreate(model) {
      const data = await HRAppealsService.ReplyMessageCreate({
        model,
        id: this.chat.id,
      });
      this.chat.is_modal = false;
    },
    async Delete(id) {
      const loader = loading.show();
      const data = await HRAppealsService.Delete(id);
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      this.GetAll(this.isActive);
      loader.hide();
    },
  },
});
