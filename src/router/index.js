import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import ExploreLayout from "../layouts/ExploreView.vue";
import LandingLayout from "../layouts/LandingView.vue";
import Cookies from "js-cookie";

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

      },
      {
        path: "login",
        name: "Login",
        component: () => import("../pages/Landing/Login.vue"),
      },

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
