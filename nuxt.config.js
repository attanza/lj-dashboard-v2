import colors from "vuetify/es5/util/colors"
require("dotenv").config()
export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "Langsung Jalan Dashboard",
    title: "Langsung Jalan Dashboard",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"
      },
      {
        hid: "Langsung Jalan Dashboard",
        name: "Langsung Jalan Dashboard",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/images/logo.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Montserrat"
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      }
    ]
  },
  server: {
    port: process.env.PORT,
    host: process.env.HOST
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#EF6C00" },
  /*
   ** Global CSS
   */
  css: [
    "~/node_modules/noty/src/noty.scss",
    "~/node_modules/noty/src/themes/metroui.scss",
    "~/static/css/custom.css"
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/veevalidate.js",
    "~/plugins/eventBus.js",
    "~/plugins/messages.js",
    "~/plugins/gmaps.js",
    { src: "~plugins/chart.js", ssr: false },
    { src: "~/plugins/datePicker", ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxtjs/vuetify",
    "@nuxtjs/moment",
    "@nuxtjs/dotenv",
    "@nuxtjs/moment"
  ],
  moment: {
    locales: ["id"]
  },
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/dotenv", "@nuxtjs/auth"],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_URL
  },

  router: {
    middleware: ["auth"]
  },

  auth: {
    // Options
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/login",
            method: "post",
            propertyName: "data.token"
          },
          logout: false,
          user: {
            url: "/me",
            method: "get",
            propertyName: "data"
          }
        }
        // tokenRequired: true,
        // tokenType: 'bearer'
      }
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],

    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.orange.darken3,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    transpile: ["vee-validate/dist/rules"],
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
    }
  }
}
