import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const EmployeeManagmentService = {

    Create(state) {
        let url = "hr/employees/managment/create";
        return api.post(url, state);
    },
    GetAll(status) {
        let url = "hr/employees/managment/all";
        return api.post(url, status);
    },
    DeleteById(id) {
        let url = "hr/employees/managment/deleted";
        return api.post(url, id);
    },
    GetById(id) {
        let url = "hr/employees/managment/getone";
        return api.post(url, id);
    },
    GetOrdersByDriverId(id) {
        let url = "hr/employees/managment/driverId/orders";
        return api.post(url, id);
    },
};