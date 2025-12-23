import Cookies from "js-cookie";
import { LoginService } from "../../ApiServices/Auth/login.service.js";
import { RegisterService } from "../../ApiServices/Auth/register.service.js";
import { defineStore } from "pinia";
import { ToastifyService } from "../../utils/Toastify";
import { Loading } from "../../utils/Loading.js";
import { jwtDecode } from "jwt-decode"; // O'rnatish shart: npm install jwt-decode

const loading = Loading();

export const AuthStore = defineStore("AuthStore", {
    state: () => {
        // Sahifa yangilanganda ham foydalanuvchi ma'lumotlarini saqlab qolamiz
        const token = Cookies.get("token");
        return {
            user: token ? jwtDecode(token) : null, // Guard aynan shu 'user'ni qidiradi
            items: "",
            is_alert: false
        }
    },
    actions: {
        async register(payload) {
            try {
                const loader = loading.show();
                const res = await RegisterService.Register(payload);
                loader.hide();
                ToastifyService.ToastSuccess({ msg: res.data.msg });
            } catch (err) {
                console.error("Register xatosi:", err);
            }
        },

        async login(payload) {
            try {
                const loader = loading.show();
                const res = await LoginService.Login(payload);
                
                if (res.data && res.data.accessToken) {
                    // 1. Ma'lumotlarni saqlash
                    Cookies.set("account", JSON.stringify(res.data.user));
                    Cookies.set("token", res.data.accessToken);

                    // 2. Store'dagi user'ni yangilash (MUHIM!)
                    this.user = jwtDecode(res.data.accessToken);

                    loader.hide();
                    
                    // 3. Yo'naltirish
                    window.location.href = "/explore/dashboard/statistic/sale";
                } else {
                    this.is_alert = true;
                    this.items = res.data;
                    loader.hide();
                }
            } catch (err) {
                loader.hide();
                console.error("Login xatosi:", err.response?.data?.message || err.message);
                ToastifyService.ToastError({ msg: "Login yoki parol xato!" });
            }
        },

        async update(payload) {
            try {
                const loader = loading.show();
                const res = await RegisterService.Update(payload);
                loader.hide();
                ToastifyService.ToastSuccess({ msg: res.data.msg });
            } catch (err) {
                console.error("Update xatosi:", err);
            }
        },

        logout() {
            this.user = null;
            Cookies.remove("token");
            Cookies.remove("account");
            window.location.href = "/login";
        }
    },
});