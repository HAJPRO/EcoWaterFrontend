import api from "@/helpers/api";
// import $api from "../../helpers/$api";

export const UserService = {
    CreateUser(data) {
        let url = "admin/create_user";
        return api.post(url, data);
    },
    GetUsers(status) {
        let url = "admin/users";
        return api.post(url, status);
    },
    GetPermissions() {
        let url = "admin/permissions";
        return api.post(url);
    },
    GetRoles() {
        let url = "admin/roles";
        return api.post(url);
    },

};
