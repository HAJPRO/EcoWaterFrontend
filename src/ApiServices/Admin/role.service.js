import api from "../../helpers/api";
// import $api from "../../helpers/$api";

export const RoleService = {

    Create(data) {
        let url = "admin/role/create";
        return api.post(url, data);
    },
    GetAll(data) {
        let url = "admin/role/all";
        return api.post(url, data);
    },

};
