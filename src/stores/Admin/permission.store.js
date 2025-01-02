import { UserService } from "../../ApiServices/Admin/user.service";
import { PermissionService } from "../../ApiServices/Admin/permission.service";

import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { defineStore } from "pinia";

export const PermissionStore = defineStore("PermissionStore", {
    state: () => {
        return {

            is_modal: false,
            model: {
                permission_name: "",
                actions: []
            },
            options: [
                { id: 1, name: "Create" },
                { id: 2, name: "Read" },
                { id: 3, name: "Update" },
                { id: 4, name: "Delete" },

            ]

        };
    },
    actions: {
        AddPermissionModal() {
            this.is_modal = true
        },
        async GetPermissions() {
            const data = await PermissionService.GetPermissions()
        },
        async CreatePermission(payload) {
            const loader = loading.show();
            const data = await PermissionService.CreatePermission(payload)
            this.model.permission_name = "",
                this.model.actions = [],
                this.is_modal = false
            ToastifyService.ToastSuccess({
                msg: data.data.msg,
            });
            loader.hide();
        },
    },
});
