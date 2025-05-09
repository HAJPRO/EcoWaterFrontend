import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const ReadyWarehouseService = {
    GetModel(data) {
        let url = "warehouses/r-warehouse/model";
        return api.post(url, data);
    },
    Create(data) {
        let url = "warehouses/r-warehouse/create";
        return api.post(url, data);
    },
    GetAll(status) {
        let url = "drivers/driver/all";
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