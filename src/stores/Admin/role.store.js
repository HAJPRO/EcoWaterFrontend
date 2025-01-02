import { RoleService } from "../../ApiServices/Admin/role.service";

import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { defineStore } from "pinia";

export const RoleStore = defineStore("RoleStore", {
    state: () => {
        return {

            is_modal_role: false,
            model: {
                role_name: "",
                value: ""
            },


        };
    },
    actions: {
        AddRoleModal() {
            this.is_modal_role = true
        },
        async CreateRole(payload) {
            const loader = loading.show();
            const data = await RoleService.CreateRole(payload)
            this.model.role_name = "",
                this.model.value = "",
                this.is_modal_role = false
            ToastifyService.ToastSuccess({
                msg: data.data.msg,
            });
            loader.hide();
        },
        async GetRoles() {
            const data = await RoleService.GetRoles()
        },
    },
});
