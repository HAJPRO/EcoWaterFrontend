import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const OrderManagmentService = {
   
    Create(state) {
        let url = "sale/managment/create";
        return api.post(url, state);
    },
    UpdateById(state) {
        let url = "sale/managment/update";
        return api.post(url, state);
    },
    GetAll(status) {
        let url = "sale/managment/all";
        return api.post(url, status);
    },
    DeleteById(id) {
        let url = "customers/managment/deleted";
        return api.post(url, id);
    },
    OrderGetById(id) {
        let url = "sale/managment/getone";
        return api.post(url, id);
    },
};