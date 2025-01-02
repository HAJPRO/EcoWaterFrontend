import { UserService } from "../../ApiServices/Admin/user.service";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "../../utils/Loader";
import { defineStore } from "pinia";
import { RoleService } from "../../ApiServices/Admin/role.service";
import { PermissionService } from "../../ApiServices/Admin/permission.service";

export const UserStore = defineStore("UserStore", {
    state: () => {
        return {
            card_id: "",
            is_modal: false,
            items: [],
            model: {
                username: "",
                password: "",
                department: "",
                role: "",
                permissions: [],
            },
            is_provide: false,
            roles: [],
            permissions: [],
            departments: [
                { id: 1, name: "Sotuv" },
                { id: 2, name: "Bo'yoq" },
                { id: 3, name: "To'quv" },
                { id: 4, name: "Yigiruv" },
                { id: 5, name: "Tikuv" },
                { id: 6, name: "Taminot" },]
        };
    },
    actions: {
        async AddUserModal() {
            this.is_modal = true
            this.GetPermissions();
            this.GetRoles();

        },
        async GetPermissions() {
            const data = await UserService.GetPermissions()
            this.permissions = data.data
        },
        async GetRoles() {
            const data = await UserService.GetRoles()
            this.roles = data.data
        },
        async CreateUser(payload) {
            console.log(payload);
            const res = await UserService.CreateUser(payload);
            this.items = res.data;
        },
        async GetUsers(payload) {
            const res = await UserService.GetUsers(payload);
            this.items = res.data;
        },
    },
});
