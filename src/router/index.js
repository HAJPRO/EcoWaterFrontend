import { createRouter, createWebHistory } from "vue-router";
import ExploreLayout from "../layouts/ExploreView.vue";
import LandingLayout from "../layouts/LandingView.vue";
import Cookies from "js-cookie";

const routes = [
  {
    path: "/",
    name: "home",
    component: LandingLayout,
    children: [
      {
        path: "",
        name: "landingPage",
        component: () => import("../pages/Landing/index.vue"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("../pages/Landing/Register.vue"),
      },
      {
        path: "login",
        name: "Login",
        component: () => import("../pages/Landing/Login.vue"),
      },
    ],
    beforeEnter(to, from, next) {
      if (Cookies.get("token") && to.path === "/") {
        next("/explore");
      } else {
        next();
      }
    },
  },

  {
    path: "/explore",
    name: "Explore",
    component: ExploreLayout,
    children: [

      // Dashboard
      {
        path: "dashboard/statistic/sale",
        name: "StatisticSale",
        component: () => import("../pages/Explore/Dashboard/statistic/sale/index.vue"),
        beforeEnter(to, from, next) {
          const account = Cookies.get("account") ? JSON.parse(Cookies.get("account")) : null;
          if (account) {
            next();
          } else {
            next("/explore");
          }
        },
      },
      //Admin
      {
        path: "/admin/users",
        name: "Users",
        component: () => import("../pages/Explore/Admin/users.vue"),
        beforeEnter(to, from, next) {
          const account = Cookies.get("account") ? JSON.parse(Cookies.get("account")) : null;
          if (account) {
            next();
          } else {
            next("/explore");
          }
        },
      },
      {
        path: "admin/system/role",
        name: "RoleManagment",
        component: () => import("../pages/Explore/Admin/system/index.vue"),
        beforeEnter(to, from, next) {
          const account = Cookies.get("account") ? JSON.parse(Cookies.get("account")) : null;
          if (account) {
            next();
          } else {
            next("/explore");
          }
        },
      },
      //Profile
      {
        path: "profile",
        name: "profile_card",
        component: () => import("../pages/Explore/Profile/profile.vue"),
      },
      {
        path: "profile_settings",
        name: "profile_settings",
        component: () => import("../pages/Explore/Profile/Settings.vue"),
      },
      //HR
      {
        path: "employees",
        name: "Employees",
        component: () => import("../pages/Explore/HR/employees/index.vue"),
      },
      //Sale
      {
        path: "sale/products",
        name: "Products",
        component: () => import("../pages/Explore/Sale/products/index.vue"),
      },
      {
        path: "sale/orders",
        name: "Orders",
        component: () => import("../pages/Explore/Sale/orders/index.vue"),
      },

      // Customers
      {
        path: "customers",
        name: "CustomersManagement",
        component: () => import("../pages/Explore/Customers/customers/index.vue"),
      },

      // Drivers
      {
        path: "drivers/monitoring",
        name: "Monitoring",
        component: () => import("../pages/Explore/Drivers/monitoring/index.vue"),
      },

      // Warehouses
      {
        path: "warehouses/r-warehouse",
        name: "ReadyWarehouse",
        component: () => import("../pages/Explore/Warehouses/r-warehouse/index.vue"),
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
