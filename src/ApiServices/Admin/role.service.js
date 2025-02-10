import api from "../../helpers/api";
// import $api from "../../helpers/$api";

export const RoleService = {

    CreateRole(data) {
        let url = "admin/create_role";
        return api.post(url, data);
    },

};
