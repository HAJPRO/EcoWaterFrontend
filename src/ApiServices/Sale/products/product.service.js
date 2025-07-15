import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const ProductManagmentService = {
   
    Create(state) {
        let url = "sale/products/managment/create";
        return api.post(url, state);
    },
    UpdateById(state) {
        let url = "sale/managment/update";
        return api.post(url, state);
    },
    GetAll(status) {
        let url = "sale/products/managment/all";
        return api.post(url, status);
    },
    DeleteById(id) {
        let url = "sale/products/managment/delete";
        return api.post(url, id);
    },
   GetOne(id) {
        let url = "sale/products/managment/getone";
        return api.post(url, id);
    },
};