import colors from "vuetify/es5/util/colors";
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "ID Expert - %s",
    title: "idwater",
    htmlAttrs: {
      lang: "en"
    },
    // script:[{src:'/static/js/flv.min.js'}]
    //script:[{src:'./EasyWasmPlayer.js'}],
    //因為使用layout所以要放nuxt.config.js裡，無法單頁使用
    script: [
      { src: "../hls.js", body: true },
      { src: "../DPlayer.min.js", body: true },
      {src:'./EasyWasmPlayer.js'}
    ],
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
      // {
      //   "http-equiv": "Content-Security-Policy",
      //   content: "upgrade-insecure-requests"
      // }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/axios",
    "~/plugins/v-charts-v2",
    "~/plugins/echarts",
    "~/plugins/vimg",
    "~/plugins/elementui",
    "~/plugins/json2excel",
    { src: "~/plugins/vue-tree-select.js", ssr: false },
    { src: "~/plugins/mymethod.js", ssr: false },
    // { src: '@/plugins/vue-video.js', ssr: false } //vue-flv-player
    // { src: "~/plugins/vue-preview", ssr: false }
    // { src: "~/plugins/chart", mode: 'client' },
    // { src: "~/plugins/vue-chartjs", mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    //nuxt auth用
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "@nuxtjs/proxy",
    "@nuxtjs/toast"
  ],
  axios: {
    proxy: true,
    //prefix:'/api',//：用來配置 baseUrl。以上面的程式碼為例，baseUrl default 會是 https://localhost:3000/api
    credentials: true
  },
  auth: {
    //nuxt auth用
    redirect: {
      login: "/login", //需要登入時會導到此路徑
      logout: "/", //登出後，會導到此路徑
      home: "/" //登入後，會導到此路徑
    },
    strategies: {
      local: {
        token: {
          property: "access_token"
          // required: true,
          // type: 'Bearer'
        },
        user: {
          //property: 'UserId',//依據回傳的json去取得資料，回傳的欄位寫UserId就可取得UserId裡面所有的物件 $auth.user.*
          property: "user",
          autoFetch: true
        },
        endpoints: {
          //login: { url: '/api/auth/login', method: 'post' },
          //login: { url: '/sessions', method: 'post',propertyName:'token' },
          login: { url: "/mapi/token", method: "post" },
          logout: { url: "/mapi/api/logout", method: "post" },
          user: { url: "/mapi/api/user", method: "get" }
        }
      },
      // google:{
      //   clientId:'124586677050-g0uduqd4ci0of7n80bsu2r7uhbguv1f1.apps.googleusercontent.com',
      //   responseType: 'code',
      //   scope: ['openid', 'profile', 'email'],
      //   accessType:'offline',
      //   grantType:'authorization_code',
      //   codeChallengeMethod: 'S256',
      //   endpoints:{
      //     //token:'/gapi/token'//https://oauth2.googleapis.com/token
      //     authorization: 'https://accounts.google.com/o/oauth2/auth',
      //     token: undefined,
      //     userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
      //     logout: 'https://example.com/logout'
      //   },
      //   refreshToken: {
      //     property: 'refresh_token',
      //     maxAge: 60 * 60 * 24 * 30
      //   },
      // }
      google: {
        scheme: "oauth2",
        endpoints: {
          authorization: "https://accounts.google.com/o/oauth2/auth",
          token: undefined,
          userInfo: "https://www.googleapis.com/oauth2/v3/userinfo"
          //logout: 'https://example.com/logout'
        },
        token: {
          property: "access_token",
          type: "Bearer",
          maxAge: 1800
        },
        refreshToken: {
          property: "refresh_token",
          maxAge: 60 * 60 * 24 * 30
        },
        //responseType: 'token',
        responseType: "id_token permission token",
        grantType: "authorization_code",
        accessType: undefined,
        redirectUri: undefined,
        logoutRedirectUri: undefined,
        clientId:
          "124586677050-g0uduqd4ci0of7n80bsu2r7uhbguv1f1.apps.googleusercontent.com",
        scope: ["openid", "profile", "email"],
        state: "UNIQUE_AND_NON_GUESSABLE",
        codeChallengeMethod: "",
        responseMode: "",
        acrValues: ""
        // autoLogout: false
      }
    }
  },
  proxy: {
    "/mapi": {
      //表示 api url 當中的 path 部分，將會以 ‘api’ 開頭，例如：http://localhost:3000/api/
      target: "http://localhost:3031/", //表示要被代理請求的 api url ( server 地址）當請求/api/users時，從請求 http://localhost:3000/api/users 代理到 https://example.com/api/users
      changeOrigin: true,
      pathRewrite: {
        //定義 url 中 path 的重寫規則。當請求/api/users時，其實是想對 https://example.com/api/users 發出請求，這時就必須把前綴 path api刪除（如果 api url當中有api就刪除，沒有api就讓它為空）
        "^/mapi": ""
      }
    },
    "/gapi": {
      target: "https://oauth2.googleapis.com/",
      changeOrigin: true,
      pathRewrite: {
        "^/gapi": ""
      }
    },
    //設定代理
    "/idapi": {
      target: "http://61.56.172.10", // 介面的域名
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        "^/idapi/": "" //萬用字元
      }
    }
  },
  router: {
    base: "/"
    //middleware: ['auth']
  },
  toast: {
    position: "top-center",
    register: [
      // Register custom toasts
      {
        name: "my-error",
        message: "Oops...Something went wrong",
        options: {
          type: "error"
        }
      }
    ]
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
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

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
