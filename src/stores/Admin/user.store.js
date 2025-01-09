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
      is_update: false,
      items: [],
      card_id: "",
      model: {
        username: "",
        password: "",
        department: "",
        role: "",
        permissions: [],
        actions: [],
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
        { id: 6, name: "Taminot" },
        { id: 7, name: "Kadrlar" },
        { id: 1000, name: "Super Admin" },
      ],
    };
  },
  actions: {
    async AddUserModal() {
      this.is_modal = true;
      this.GetPermissions();
      this.GetRoles();
    },
    async UpdateUserModal(id) {
      this.is_modal = true;
      this.GetPermissions();
      this.GetRoles();
      this.GetOneUser(id);
    },
    async GetOneUser(id) {
      const data = await UserService.GetOneUser(id);
      this.model = data.data;
      this.is_update = true;
      this.card_id = id;
    },
    async GetPermissions() {
      const data = await UserService.GetPermissions();
      this.permissions = data.data;
    },
    async GetRoles() {
      const data = await UserService.GetRoles();
      this.roles = data.data;
    },
    async CreateUser(payload) {
      const loader = loading.show();
      const res = await UserService.CreateUser(payload);
      this.items = res.data;
      this.GetUsers();
      loader.hide();
      ToastifyService.ToastSuccess({ msg: data.data.msg });
      this.is_modal = false;
    },
    async UpdateUser(payload) {
      const loader = loading.show();
      const res = await UserService.UpdateUser(payload);
      this.items = res.data;
      this.GetUsers();
      this.is_modal = false;
      loader.hide();
      ToastifyService.ToastSuccess({ msg: data.data.msg });
    },
    async GetUsers(payload) {
      const res = await UserService.GetUsers(payload);
      this.items = res.data;
      console.log(this.items);
    },
  },
});
