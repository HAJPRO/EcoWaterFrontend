import { UserService } from "../../ApiServices/Admin/user.service";
import { PermissionService } from "../../ApiServices/Admin/permission.service";

import { ToastifyService } from "../../utils/Toastify";
import { Loading } from "../../utils/Loading";
const loading = Loading()
import { defineStore } from "pinia";

export const PermissionStore = defineStore("PermissionStore", {
    state: () => {
        return {
            status: "",
            permission_modal: false,
            model: {
                name: "",
                value: "",
                description: "",
            },
            permissions: []

        };
    },
    actions: {
        IsActive(payload) {
            this.status = payload
            console.log(this.status);

        },
        AddPermissionModal() {
            this.permission_modal = true
        },
        async GetAll() {
            const data = await PermissionService.GetAll()
            this.permissions = data.data.permissions

        },
        async CreatePermission(payload) {
            const loader = loading.show();
            const data = await PermissionService.CreatePermission(payload)
            console.log(data);

            ToastifyService.ToastSuccess({
                msg: data.data.msg,
            });
            loader.hide();
        },
    },
});
