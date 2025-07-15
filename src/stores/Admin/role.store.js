import { RoleService } from "../../ApiServices/Admin/role.service";

import { ToastifyService } from "../../utils/Toastify";
import { Loading } from "../../utils/Loading";
const loading = Loading()
import { defineStore } from "pinia";

export const RoleStore = defineStore("RoleStore", {
    state: () => {
        return {
            roles: [],
            role_modal: false,
            model: {
                name: "",
                value: "",
                description: "",
                permissions: []
            },


        };
    },
    actions: {
        AddRoleModal() {
            this.role_modal = true
        },
        async Create(payload) {
            const loader = loading.show();
            const data = await RoleService.Create(payload)
            ToastifyService.ToastSuccess({
                msg: data.data.msg,
            });
            loader.hide();
        },
        async GetAll() {
            const data = await RoleService.GetAll()
            this.roles = data.data.roles
        },
    },
});
