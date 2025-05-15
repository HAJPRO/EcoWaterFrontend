import Cookies from "js-cookie";
import { LoginService } from "../../ApiServices/Auth/login.service.js";
import { RegisterService } from "../../ApiServices/Auth/register.service.js";
import { defineStore } from "pinia";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "../../utils/Loader";

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
                // if (res.data) {
                //     Cookies.set("account", JSON.stringify(res.data.user));
                //     Cookies.set("token", res.data.accessToken);
                //     setTimeout(() => {
                //         window.location.reload();
                //     }, 500);

                // }
                loader.hide()
            } catch (err) {
                console.log(err.message);
            }

        },
        async login(payload) {
            try {
                const res = await LoginService.Login(payload);
                if (res.data.result) {
                    Cookies.set("account", JSON.stringify(res.data.user));
                    Cookies.set("token", res.data.accessToken);
                    // Sahifani yangilash o‘rniga explore sahifasiga yo‘naltirish
                    window.location.href = "/explore/dashboard/statistic/sale";
                } else {
                    this.is_alert = true
                    this.items = res.data
                }


            } catch (err) {
                console.log(err.message);
            }
        },
    },

});
