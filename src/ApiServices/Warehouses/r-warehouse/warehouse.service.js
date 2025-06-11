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
        let url = "warehouses/r-warehouse/all";
        return api.post(url, status);
    },
    DeleteById(id) {
        let url = "customers/managment/deleted";
        return api.post(url, id);
    },
    GetOne(id) {
        let url = "warehouses/r-warehouse/getone";
        return api.post(url, id);
    },
    OutputProduct(data) {
        let url = "warehouses/r-warehouse/output";
        return api.post(url, data);
    },
};