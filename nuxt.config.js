import colors from "vuetify/es5/util/colors";
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "專家系統 - %s",
    title: "專家系統",
    htmlAttrs: {
      lang: "zh-TW",
    },
    // script:[{src:'/static/js/flv.min.js'}]
    //script:[{src:'./EasyWasmPlayer.js'}],
    //因為使用layout所以要放nuxt.config.js裡，無法單頁使用
    script: [
      { src: "../hls.js", body: true },
      { src: "../DPlayer.min.js", body: true },
      { src: "./EasyWasmPlayer.js" },
    ],
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      // {
      //   "http-equiv": "Content-Security-Policy",
      //   content: "upgrade-insecure-requests"
      // }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  //定義環境變數,可透過以下兩種方式使用
  //process.env.apiUrl
  //context.env.apiUrl
  env: {
    apiUrl: "https://192.168.50.77/api", //統一不要有後斜線
    apiIIS82: "https://192.168.50.77:82",
    apiVideo8443: "https://192.168.50.77:8443",
    internal: {
      //環境
      apiUrl: process.env.NUXT_ENV_APIURL,
      apiKbUrl: process.env.NUXT_ENV_KB,
      apiIIS82: process.env.NUXT_ENV_IIS,
      //www
        //正式
      // apiUrl: "https://www.idwatertech.com/api", //正式站，統一不要有後斜線
      // apiKbUrl: "https://www.idwatertech.com:8811/api", //正式站，知識庫
      // apiIIS82: "https://www.idwatertech.com:82",

        //測試
      // apiUrl: "https://www.idwatertech.com:8011/api", //測試站
      // apiKbUrl: "https://www.idwatertech.com:8911/api", //測試站
      // apiIIS82: "https://www.idwatertech.com:82",

      //// apiVideo8443: "https://www.idwatertech.com:8443",//沒在用

      //new
      // apiUrl: "https://new.idwatertech.com/api", //正式站-new
      // apiKbUrl: "https://new.idwatertech.com:8811/api", //正式站，知識庫-new
      // apiUrl: "https://new.idwatertech.com:8111/api", //測試站-new
      // apiKbUrl: "https://new.idwatertech.com:8911/api", //測試站-new
      // apiIIS82: "https://new.idwatertech.com:82",//new
      
      //test
      // apiUrl: "https://new.idwatertech.com:8511/api", //test
      // apiKbUrl: "https://new.idwatertech.com:8911/api", //test
      // apiIIS82: "https://new.idwatertech.com:82",//test

    },
    external: {
      apiUrl: "https://61.56.172.10/api", //統一不要有後斜線
      apiIIS82: "https://61.56.172.10:82",
      apiVideo8443: "https://61.56.172.10:8443",
    },
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/axios",
    "~/plugins/csrf.js",
    "~/plugins/v-charts-v2",
    "~/plugins/echarts",
    "~/plugins/vimg",
    "~/plugins/elementui",
    "~/plugins/json2excel",
    { src: "~/plugins/vue-tree-select.js", ssr: false },
    { src: "~/plugins/mymethod.js", ssr: false },
    // { src: "~/plugins/speedometer.js", ssr: false },
    { src: "~/plugins/vue-particles.js", ssr: false },
    { src: "~/plugins/antdesign.js", ssr: false }, //暫時不用
    { src: "~/plugins/service/basic.js", ssr: false },
    { src: "~/plugins/service/user.js", ssr: false },
    { src: "~/plugins/service/breeding.js", ssr: false },
    { src: "~/plugins/service/feed.js", ssr: false },
    { src: "~/plugins/service/kb.js", ssr: false },
    { src: "~/plugins/vcharts.js", ssr: false },
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
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    //nuxt auth用
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "@nuxtjs/proxy",
    "@nuxtjs/toast",
    "@nuxtjs/recaptcha",
  ],
  recaptcha: {
    ideBadge: true, // 是否隱藏badge
    siteKey: "6LfSN2weAAAAAMMb3CSwAng4z7F6uoV1JoOILo6p",
    version: 2, // 版本
  },
  axios: {
    proxy: true,
    //prefix:'/api',//：用來配置 baseUrl。以上面的程式碼為例，baseUrl default 會是 https://localhost:3000/api
    credentials: true,
  },
  auth: {
    //nuxt auth用
    plugins: [ '~/plugins/auth.js' ],
    redirect: {
      login: "/login", //需要登入時會導到此路徑
      logout: "/", //登出後，會導到此路徑
      home: "/", //登入後，會導到此路徑
    },
    strategies: {
      localjwt: {
        scheme: "refresh",
        token: {
          property: "access", //access_token
          maxAge: 60 * 60 * 24 * 3, //60秒*60*24小時*3天 令牌的到期時間
          // required: true,
          type: "Bearer",
        },
        tokenType: "JWT",
        refreshToken: {
          property: "refresh", //refresh_token
          maxAge: 60 * 60 * 24 * 30,
          type: "Bearer",
        },
        user: {
          //property: 'UserId',//依據回傳的json去取得資料，回傳的欄位寫UserId就可取得UserId裡面所有的物件 $auth.user.*
          property: "user",
          autoFetch: true,
        },
        endpoints: {
          login: {
            url: "https://localhost.idwatertech.com/api/token/",
            method: "post",
          },
          refresh: {
            url: "https://localhost.idwatertech.com/api/token/refresh/",
            method: "post",
          },
          user: {
            url: "https://localhost.idwatertech.com/api/user-data/",
            method: "get",
            headers: { Referer: "https://localhost.idwatertech.com/" },
          },
          logout: false,
        },
      },
      google: {
        endpoints: {
          //www設定
            //正
            // token: 'https://www.idwatertech.com/api/social-login/google/',
            // userInfo: 'https://www.idwatertech.com/api/auth/user/',
            //測
            // token: 'https://www.idwatertech.com:8011/api/social-login/google/',
            // userInfo: 'https://www.idwatertech.com:8011/api/auth/user/',
          //new設定
            //正
            // token: 'https://new.idwatertech.com/api/social-login/google/',
            // userInfo: 'https://new.idwatertech.com/api/auth/user/',
            //測
            // token: 'https://new.idwatertech.com:8111/api/social-login/google/',
            // userInfo: 'https://new.idwatertech.com:8111/api/auth/user/',
          //test設定
            token: 'https://new.idwatertech.com:8511/api/social-login/google/',
            userInfo: 'https://new.idwatertech.com:8511/api/auth/user/',

        },
        responseType: "code",//id_token permission token
        clientId: '124586677050-g0uduqd4ci0of7n80bsu2r7uhbguv1f1.apps.googleusercontent.com',
        codeChallengeMethod: '',
        token: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      }
      //修改授權api前的設定，先保留不刪除
      //20240723設定
      // google: {
      //   scheme: "oauth2",
      //   endpoints: {
      //     authorization: "https://accounts.google.com/o/oauth2/auth",
      //     token: undefined,
      //     userInfo: "https://www.googleapis.com/oauth2/v3/userinfo"
      //     //logout: 'https://example.com/logout'
      //   },
      //   token: {
      //     property: "access_token",
      //     type: "Bearer",
      //     maxAge: 60 * 60 * 24 * 3 //60秒*60*24小時*3天 (1 month) 令牌的到期時間
      //   },
      //   refreshToken: {
      //     property: "refresh_token",
      //     maxAge: 60 * 60 * 24 * 30
      //   },
      //   //responseType: 'token',
      //   responseType: "id_token permission token",
      //   grantType: "authorization_code",
      //   accessType: undefined,
      //   redirectUri: undefined,
      //   logoutRedirectUri: undefined,
      //   clientId:
      //     "124586677050-g0uduqd4ci0of7n80bsu2r7uhbguv1f1.apps.googleusercontent.com",
      //   scope: ["openid", "profile", "email"],
      //   state: "UNIQUE_AND_NON_GUESSABLE",
      //   codeChallengeMethod: "",
      //   responseMode: "",
      //   acrValues: ""
      //   // autoLogout: false
      // }
    },
  },
  proxy: {
    //這個代理不會在線上環境生效的.只是給開發時使用
    "/mapi": {
      //表示 api url 當中的 path 部分，將會以 ‘api’ 開頭，例如：http://localhost:3000/api/
      target: "http://localhost:3031/", //表示要被代理請求的 api url ( server 地址）當請求/api/users時，從請求 http://localhost:3000/api/users 代理到 https://example.com/api/users
      changeOrigin: true,
      pathRewrite: {
        //定義 url 中 path 的重寫規則。當請求/api/users時，其實是想對 https://example.com/api/users 發出請求，這時就必須把前綴 path api刪除（如果 api url當中有api就刪除，沒有api就讓它為空）
        "^/mapi": "",
      },
    },
    "/gapi": {
      target: "https://oauth2.googleapis.com/",
      changeOrigin: true,
      pathRewrite: {
        "^/gapi": "",
      },
    },
    "/lineapi": {
      target: "https://notify-api.line.me/",
      changeOrigin: true,
      pathRewrite: {
        "^/lineapi": "",
      },
    },
    //設定代理，目前沒用到
    // "/idapi": {
    //   target: "http://61.56.172.10", // 介面的域名
    //   changeOrigin: true,
    //   ws: true,
    //   pathRewrite: {
    //     "^/idapi/": "" //萬用字元
    //   }
    // }
  },
  router: {
    base: "/",
    // extendRoutes (routes, resolve) {
    //   routes.push({
    //     path: '/basic',component: resolve(__dirname, 'pages/basic.vue')
    //   });
    // }
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
          type: "error",
        },
      },
    ],
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    // theme: {
    //   dark: false,
    //   themes: {
    //     dark: {
    //       primary: colors.blue.darken2,
    //       accent: colors.grey.darken3,
    //       secondary: colors.amber.darken3,
    //       info: colors.teal.lighten1,
    //       warning: colors.amber.base,
    //       error: colors.deepOrange.accent4,
    //       success: colors.green.accent3
    //     }
    //   }
    // }
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
          success: colors.green.accent3,
        },
        light: {
          primary: "#6c9bcd", //3F6D9E
          mainnav: "#006aa6", //02325A 006aa6 0D47A1
          mainbg: "#075594", //063E6C
          cardtitle: "#135f9f", //055394
          lightblue: "#074C86",
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // 解決speedometer
    // [Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
    extend(config) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
    },
    //解決exceeds the max of 500KB
    // ERROR  [BABEL] Note: The code generator has deoptimised the styling of C:\Users\jianwei\Desktop\idexpert\pages\kb.vue as it exceeds the max of 500KB.
    babel: {
      compact: true,
    },
  },
  generate: {
    assetsPublicPath: "./",
  },
};
