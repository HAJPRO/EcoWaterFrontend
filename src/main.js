import { createApp } from "vue";
import { createPinia } from "pinia";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import QrReader from 'vue3-qr-reader';
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import toast from "vue3-toastify";
import Loading from 'vue-loading-overlay';

import router from "./router/index";
import App from "./App.vue";
import "./css/style.css";

const app = createApp(App);

app.use(router);
app.use(createPinia());
// Tilni import qilish
import en from 'element-plus/es/locale/lang/en'  // Inglizcha
app.use(ElementPlus, { locale: en }); // ✅ To‘g‘ri versiya
app.use(QrReader);
app.use(toast);
app.use(Loading);

app.mount("#app");
