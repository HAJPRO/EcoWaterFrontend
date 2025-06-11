import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const CustomerManagmentService = {

    Create(state) {
        let url = "customers/managment/create";
        return api.post(url, state);
    },
    GetAll(status) {
        let url = "customers/managment/customers";
        return api.post(url, status);
    },
    DeleteById(id) {
        let url = "customers/managment/deleted";
        return api.post(url, id);
    },
    GetById(id) {
        let url = "customers/managment/getone";
        return api.post(url, id);
    },
    GetOrdersByCustomerId(id) {
        let url = "customers/managment/customerId/orders";
        return api.post(url, id);
    },
};