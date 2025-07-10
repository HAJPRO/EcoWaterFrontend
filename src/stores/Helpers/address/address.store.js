import { AddressService } from "../../../ApiServices/Helpers/address/address.service";
import { ToastifyService } from "../../../utils/Toastify";
import { loading } from "../../../utils/Loader";
import { defineStore } from "pinia";
import { ref } from "vue";

export const AddressStore = defineStore("AddressStore", {
  state: () => {
    return {
      regions: [],
      districts: [],
      neighborhoods: [],
      isActive: "",
    };
  },
  actions: {
    GetIsActive(payload) {
      this.isActive = payload;
    },
    async Regions() {
      const data = await AddressService.Regions({ id: 1 });
      this.regions = data.data;
    },
    async Districts(regionId) {
      const data = await AddressService.Districts({ regionId: regionId });
      this.districts = data.data;
    },
    async Neighborhoods(districtId) {
        const data = await AddressService.Neighborhoods({ districtId: districtId });
        this.neighborhoods = data.data;
      },
  },
});
