import api from "../../helpers/api";
// import $api from "../../helpers/$api";

export const PermissionService = {

    CreatePermission(data) {
        let url = "admin/permission/create";
        return api.post(url, data);
    },
    GetAll(data) {
        let url = "admin/permission/all";
        return api.post(url, data);
    },

};
