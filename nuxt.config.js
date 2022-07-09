const bodyPaser = require("body-parser");
const axios = require("axios");

export default {
  mode: "universal",
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "nuxt-pages-routing-view",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap",
      },
    ],
  },
  loading: { color: "red", height: "4px", duration: 5000 },

  loadingIndicator: {
    name: "circle",
    color: "red",
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~assets/styles/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~plugins/core-component.js", "~plugins/date-filter.js"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios"],

  axios: {
    baseURL:
      "https://nuxt-blog-2dc52-default-rtdb.asia-southeast1.firebasedatabase.app",
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  env: {
    baseUrl:
      "https://nuxt-blog-2dc52-default-rtdb.asia-southeast1.firebasedatabase.app",
    fbAPIKey: "AIzaSyBoeJThmHkGCc9QZ6pvPSbiN7pEiZuZCHM",
  },
  transition: {
    name: "fade",
    mode: "out-in",
  },

  // router: {
  //   middleware: "log",
  // },

  serverMiddleware: [bodyPaser.json(), "~/api"],

  generate: {
    routes: function () {
      return axios
        .get(
          "https://nuxt-blog-2dc52-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json"
        )
        .then((res) => {
          const routes = [];
          for (const key in res.data) {
            routes.push({
              route: "/posts/" + key,
              payload: { postData: res.data[key] },
            });
          }
          return routes;
        });
    },
  },
};
