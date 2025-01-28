import { v4 as uuidv4 } from "uuid";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "../../utils/Loader";
import { HelpersService } from "../../ApiServices/Helpers/helper.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export const HelpersStore = defineStore("HelpersStore", {
  state: () => {
    return {
      select_type: "",
      modal_params: {},
      options: [],
      is_modal: false,
    };
  },
  actions: {
    SelectType(payload) {
      this.select_type = payload.type;
      this.GetOptionsByType({ type: payload.type });
    },
    PlusModal(payload) {
      this.modal_params = payload;
      this.is_modal = true;
    },

    async CreateOption(model) {
      const loader = loading.show();
      const data = await HelpersService.CreateOption({
        model,
        type: this.modal_params.state,
      });
      this.is_modal = false;
      this.GetOptionsByType({ type: this.select_type });
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      loader.hide();
    },
    async GetOptionsByType(payload) {
      const loader = loading.show();
      const data = await HelpersService.GetOptionsByType(payload);
      this.options = data.data;
      loader.hide();
    },
  },
});
