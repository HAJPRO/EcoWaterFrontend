import Cookies from "js-cookie";
import { LoginService } from "../../ApiServices/Auth/login.service.js";
import { RegisterService } from "../../ApiServices/Auth/register.service.js";
import { defineStore } from "pinia";
import { ToastifyService } from "../../utils/Toastify";
import { Loading } from "../../utils/Loading.js";
const loading = Loading()

export const AuthStore = defineStore("AuthStore", {
    state: () => {
        return {
            items: "",
            is_alert: false
        }
    },
    actions: {
        async register(payload) {
            try {
                const loader = loading.show()
                const res = await RegisterService.Register(payload);
                loader.hide()
                ToastifyService.ToastSuccess({
                    msg: res.data.msg,
                });

                loader.hide()
            } catch (err) {
                console.log(err.message);
            }

        },
        async login(payload) {
            try {
                const loader = loading.show()
                const res = await LoginService.Login(payload);
                if (res.data.result) {
                    Cookies.set("account", JSON.stringify(res.data.user));
                    Cookies.set("token", res.data.accessToken);
                    // Sahifani yangilash o‘rniga explore sahifasiga yo‘naltirish
                    window.location.href = "/explore/dashboard/statistic/sale";
                    loader.hide()
                } else {
                    this.is_alert = true
                    this.items = res.data
                }


            } catch (err) {
                console.log(err.message);
            }
        },
        async update(payload) {
            try {
                const loader = loading.show()
                const res = await RegisterService.Update(payload);
                loader.hide()
                ToastifyService.ToastSuccess({
                    msg: res.data.msg,
                });

                loader.hide()
            } catch (err) {
                console.log(err.message);
            }

        },
    },

});
