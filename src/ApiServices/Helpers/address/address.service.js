import api from "@/helpers/api";

export const AddressService = {
    Regions(data) {
        let url = "helpers/regions";
        return api.post(url,data);
    },
    Districts(data) {
        let url = "helpers/districts";
        return api.post(url,data);
    },
    Neighborhoods(data) {
        let url = "helpers/neighborhoods";
        return api.post(url,data);
    },
   
};