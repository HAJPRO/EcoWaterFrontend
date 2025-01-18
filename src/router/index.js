import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import ExploreLayout from "../layouts/ExploreView.vue";
import LandingLayout from "../layouts/LandingView.vue";
import Cookies from "js-cookie";

import Dashboard from "../pages/Explore/Dashboard/Dashboard.vue";
const routes = [
  // LandingLayout
  {
    path: "/",
    name: "home",
    component: LandingLayout,
    children: [
      {
        path: "/",
        name: "landingPage",
        component: () => import("../pages/Landing/index.vue"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("../pages/Landing/Register.vue"),
        // beforeEnter(to, from, next) {
        //   if ((JSON.parse(Cookies.get("account")).role) === 1000) {
        //     next()
        //   } else {
        //     window.location.href = "/login";
        //   }
        // }
      },
      {
        path: "login",
        name: "Login",
        component: () => import("../pages/Landing/Login.vue"),
      },
      // {
      //   path: "login/forget_password",
      //   name: "ForgetPassword",
      //   component: () => import("../pages/Landing/ForgetPassword.vue"),
      //   beforeEnter(to, from, next) {
      //     if (JSON.parse(Cookies.get("account")).role === 1000) {
      //       next();
      //     } else {
      //       window.location.href = "/login";
      //     }
      //   },
      // },
    ],
    beforeEnter(to, from, next) {
      if (Cookies.get("token")) {
        window.location.href = "/explore";
      } else {
        next();
      }
    },
  },

  // ExploreLayout

  {
    path: "/explore",
    name: "Explore",
    component: ExploreLayout,
    children: [
      // Admin
      {
        path: "admin/users",
        name: "Users",
        component: () => import("../pages/Explore/Admin/users.vue"),
        beforeEnter(to, from, next) {
          if (JSON.parse(Cookies.get("account")).role === 1000) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      {
        path: "admin/role",
        name: "Role",
        component: () => import("../pages/Explore/Admin/role.vue"),
        beforeEnter(to, from, next) {
          if (JSON.parse(Cookies.get("account")).role === 1000) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      //Profile
      {
        path: "/profile",
        name: "profile_card",
        component: () => import("../pages/Explore/Profile/profile.vue"),
      },
      {
        path: "/profile_settings",
        name: "profile_settings",
        component: () => import("../pages/Explore/Profile/Settings.vue"),
      },
      // Dashboard
      {
        path: "",
        name: "Dashboard",
        component: () => import("../pages/Explore/Dashboard/Dashboard.vue"),
      },

      // Sotuv bo'limi
      {
        path: "sale/legal",
        name: "legal",
        component: () => import("../pages/Explore/Sale/legal.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 1 ||
            JSON.parse(Cookies.get("account")).role === 1000
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      {
        path: "sale/legal/create",
        name: "legal_create",
        component: () => import("../pages/Explore/Sale/legal.create.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 1 ||
            JSON.parse(Cookies.get("account")).role === 1000
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      //Bo'yoqlash bolimi
      {
        path: "department/paint/working/plan",
        name: "pain",
        component: () => import("../pages/Explore/Paint/PlanEco/plan.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 2 ||
            JSON.parse(Cookies.get("account")).role === 1000
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },

      //To'quv bolimi
      {
        path: "department/weaving/working/plan",
        name: "weaving",
        component: () => import("../pages/Explore/Weaving/PlanEco/plan.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 3 ||
            JSON.parse(Cookies.get("account")).role === 1000
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      //Yigiruv bolimi
      {
        path: "department/spinning/working/plan",
        name: "spinning",
        component: () => import("../pages/Explore/Spinning/plan.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 4 ||
            JSON.parse(Cookies.get("account")).role === 1000
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      //Tikuv bolimi
      {
        path: "department/seam/raw_material_warehouse",
        name: "RawMaterialWarehouse",
        component: () =>
          import("../pages/Explore/Seam/warehouse/RawMaterial.vue"),
        beforeEnter(to, from, next) {
          if (
            (JSON.parse(Cookies.get("account")).role === 5 &&
              JSON.parse(Cookies.get("account")).permissions.includes(
                "seam raw warehouse"
              )) ||
            JSON.parse(Cookies.get("account")).role === 1000 ||
            JSON.parse(Cookies.get("account")).permissions.includes(
              "seam accountant"
            )
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      {
        path: "department/seam/form_warehouse",
        name: "FormWarehouse",
        component: () =>
          import("../pages/Explore/Seam/wrehouse-form/index.vue"),
        beforeEnter(to, from, next) {
          if (
            (JSON.parse(Cookies.get("account")).role === 5 &&
              JSON.parse(Cookies.get("account")).permissions.includes(
                "form warehouse"
              )) ||
            JSON.parse(Cookies.get("account")).role === 1000 ||
            JSON.parse(Cookies.get("account")).permissions.includes(
              "seam accountant"
            )
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      {
        path: "department/seam/form",
        name: "SeamForm",
        component: () => import("../pages/Explore/Seam/form/index.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 1000 ||
            (JSON.parse(Cookies.get("account")).role === 5 &&
              JSON.parse(Cookies.get("account")).permissions.includes(
                "form"
              )) ||
            JSON.parse(Cookies.get("account")).permissions.includes(
              "seam accountant"
            )
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      {
        path: "department/seam/form/report_create",
        name: "ReportCreate",
        component: () => import("../pages/Explore/Seam/form/report-create.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 1000 ||
            (JSON.parse(Cookies.get("account")).role === 5 &&
              JSON.parse(Cookies.get("account")).permissions.includes(
                "form"
              )) ||
            JSON.parse(Cookies.get("account")).permissions.includes(
              "seam accountant"
            )
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      {
        path: "department/seam/classification",
        name: "SeamClassification",
        component: () =>
          import("../pages/Explore/Seam/classification/index.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 1000 ||
            (JSON.parse(Cookies.get("account")).role === 5 &&
              JSON.parse(Cookies.get("account")).permissions.includes(
                "classification"
              )) ||
            JSON.parse(Cookies.get("account")).permissions.includes(
              "seam accountant"
            )
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      {
        path: "department/seam/patoks",
        name: "SeamPatoks",
        component: () => import("../pages/Explore/Seam/patoks/index.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 1000 ||
            (JSON.parse(Cookies.get("account")).role === 5 &&
              JSON.parse(Cookies.get("account")).permissions.includes(
                "patoks"
              )) ||
            JSON.parse(Cookies.get("account")).permissions.includes(
              "seam accountant"
            )
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      {
        path: "department/seam/packing",
        name: "SeamPacking",
        component: () => import("../pages/Explore/Seam/packing/index.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 1000 ||
            (JSON.parse(Cookies.get("account")).role === 5 &&
              JSON.parse(Cookies.get("account")).permissions.includes(
                "packing"
              )) ||
            JSON.parse(Cookies.get("account")).permissions.includes(
              "seam accountant"
            )
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      {
        path: "department/seam/clothes_warehouse",
        name: "SeamClothesWarehouse",
        component: () =>
          import("../pages/Explore/Seam/clothes-warehouse/index.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 1000 ||
            (JSON.parse(Cookies.get("account")).role === 5 &&
              JSON.parse(Cookies.get("account")).permissions.includes(
                "seam clothes warehouse"
              )) ||
            JSON.parse(Cookies.get("account")).permissions.includes(
              "seam accountant"
            )
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      //Kadrlar bolimi
      {
        path: "department/hr/appeals",
        name: "HRAppeals",
        component: () => import("../pages/Explore/HR/Appeals/index.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 7 ||
            JSON.parse(Cookies.get("account")).role === 1000
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
      //Taminot bolimi
      {
        path: "department/provide/working/plan",
        name: "provide",
        component: () => import("../pages/Explore/Provide/PlanEco/plan.vue"),
        beforeEnter(to, from, next) {
          if (
            JSON.parse(Cookies.get("account")).role === 6 ||
            JSON.parse(Cookies.get("account")).role === 1000
          ) {
            next();
          } else {
            window.location.href = "/explore";
          }
        },
      },
    ],
    beforeEnter(to, from, next) {
      if (!Cookies.get("token")) {
        window.location.href = "/login";
      } else {
        next();
      }
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("../pages/Explore/NotFound/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
