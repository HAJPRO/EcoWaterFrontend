import api from "../../helpers/api";
// import $api from "../../helpers/$api";

export const PermissionService = {

    CreatePermission(data) {
        let url = "admin/create_permission";
        return api.post(url, data);
    },

};
