import { v4 as uuidv4 } from "uuid";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "../../utils/Loader";
import { HelpersService } from "../../ApiServices/Helpers/helper.service";
import { defineStore } from "pinia";
import { ref } from "vue";
export const HelpersStore = defineStore("HelpersStore", {
  state: () => {
    return {
      material_names: [],
      colors: [],
      is_modal_name: false,
      model: {
        id: uuidv4(),
        head_pack: "",
        pastal_quantity: "",
        waste_quantity: "",
        fact_gramage: "",
        status: false,
      },
    };
  },
  actions: {
    PlusMaterialNameModal() {
      this.is_modal_name = true;
      this.GetAllMaterialNames();
    },
    PlusColor() {
      this.is_modal_name = true;
      this.GetAllColors();
    },
    async CreateMaterialName(payload) {
      const loader = loading.show();
      const data = await HelpersService.CreateMaterialName(payload);
      this.is_modal = false;
      this.GetAllMaterialNames();
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
      loader.hide();
    },
    async GetAllMaterialNames(payload) {
      const data = await HelpersService.GetAllMaterialNames(payload);
      this.material_names = data.data;
    },
    async GetAllColors(payload) {
      // const data = await HelpersService.GetAllMaterialNames(payload);
      // this.material_names = data.data;
    },
  },
});
