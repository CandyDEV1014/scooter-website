import Vue from "vue";
import AdminLayout from "@/layouts/Admin";
import Dashboard from "@/views/dashboard/Dashboard";
import Error from "@/views/Error";
import i18n from "../../helpers/i18n";
import store from "../store/index";

/**
 * Error component
 */
Vue.component("Error", Error);

export default {
  path: "/admin",
  redirect: "/admin/dashboard",
  component: AdminLayout,
  meta: {
    title: i18n.t("routes.home"),
  },
  children: [
    {
      path: "/admin/profile",
      name: "profile",
      component: () => import("@/views/profile/Detail"),
      meta: {
        title: i18n.t("routes.profile"),
      },
    },
    {
      path: "/admin/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        title: i18n.t("routes.dashboard"),
      },
    },
    {
      path: "/admin/scooter",
      name: "scooter",
      component: () => import("@/views/scooter/List"),
      meta: {
        title: "Scooters",
      },
    },
    {
      path: "/admin/user",
      name: "user",
      component: () => import("@/views/users/List"),
      meta: {
        title: "Users",
      },
    },
    {
      path: "*",
      component: Error,
      meta: {
        title: i18n.t("routes.not_found"),
      },
    },
  ],
  beforeEnter: (to, from, next) => {
    if (store.getters.getTokenId) {
      next();
    } else {
      next({ path: "/login" });
    }
  },
};
