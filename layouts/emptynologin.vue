<template>
  <no-ssr>
    <v-app dark>
      <v-main>
        <v-navigation-drawer
          app
          v-model="drawer"
          :mini-variant="miniVariant"
          :clipped="clipped"
          :mini-variant-width="this.$auth.$state.loggedIn ? '56' : '0'"
        >
          <!-- -->
          <v-list>
            <v-list-item>
              <v-list-item-avatar v-if="this.$auth.$state.loggedIn" size="36">
                <v-img :src="this.$auth.$state.user.picture"></v-img>
              </v-list-item-avatar>
              <v-list-item-icon v-else>
                <v-icon large>mdi-account-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content v-if="this.$auth.$state.loggedIn" size="36">
                <v-list-item-title class="title">
                  {{ this.$auth.$state.user.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  this.$auth.$state.user.email
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <!--指定item是link，自動使用href (当使用 href 或 to 属性) -->
            <!-- <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="title">
                  Sandra Adams
                </v-list-item-title>
                <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item> -->

            <v-divider></v-divider>

            <v-list-item
              v-for="(item, i) in listitems"
              :key="i"
              :to="item.to"
              @click="logoutchk(item.title)"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <!--  -->
        </v-navigation-drawer>
        <v-container fluid>
          <v-app-bar app color="">
            <v-app-bar-nav-icon
              @click.stop="drawer = !drawer"
              v-show="this.$auth.$state.loggedIn"
            />
            <v-btn
              icon
              @click.stop="miniVariant = !miniVariant"
              v-show="this.$auth.$state.loggedIn"
            >
              <v-icon
                >mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon
              >
            </v-btn>

            <v-btn text to="/">艾滴科技</v-btn>
            <!-- <v-btn icon to="/calendar"
              ><v-icon>mdi-calendar-star</v-icon></v-btn
            > -->
            <!-- <v-btn icon to="/Indicator/edit"
              ><v-icon>mdi-file-edit</v-icon></v-btn
            > -->
            <v-spacer />
            <v-btn
              icon
              to="/set/"
              v-show="
                this.$auth.$state.loggedIn &&
                  [
                    'jianwei.wen@idwater.com.tw',
                    'steven.huang@idwater.com.tw'
                  ].includes(this.$auth.$state.user.email)
              "
              ><v-icon>mdi-cog-outline</v-icon></v-btn
            >
            <div v-if="this.$auth.$state.loggedIn">
              {{ this.$auth.$state.user.name }}
              <v-btn icon @click="logout"><v-icon>mdi-logout</v-icon></v-btn>
            </div>
            <div v-if="!this.$auth.$state.loggedIn">
              <v-btn icon to="/login"><v-icon>mdi-login</v-icon></v-btn>
            </div>
            <!-- <div v-show="$auth.$state.loggedIn">
            {{ $auth.user.name }}－{{ $auth.user.email }}
            <v-btn text @click="$auth.logout()">Logout</v-btn>
          </div>
          <div v-else>
            <v-btn text to="/login">Login</v-btn>
            <v-btn text to="/register">Register</v-btn>
          </div> -->
          </v-app-bar>
          <nuxt />
        </v-container>
      </v-main>
    </v-app>
  </no-ssr>
</template>

<script>
import https from "https";
export default {
  async beforeCreate() {
    //登入時判別身份分別導頁
    if (this.$auth.$state.loggedIn) {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      let acclist = [];
      await this.$axios
        .get("https://61.56.172.10/user-access/account/", { httpsAgent: agent })
        .then(res => {
          acclist = res.data;
        });
      var acc = acclist.filter(x => x.帳號 == this.$auth.$state.user.email);
      //登入成功
      if (acc.length == 1) {
        //增加身份判別---
        const updatedUser = { ...this.$auth.user };
        updatedUser.role = "user"; //允許登入的
        updatedUser.authcheck = true; //授權可登入
        this.$auth.setUser(updatedUser); //會造成Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        //--------------
      } else {
        //登入失敗
        const updatedUser = { ...this.$auth.user };
        updatedUser.role = "guest";
        updatedUser.authcheck = false;
        this.$auth.setUser(updatedUser); //會造成Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        this.$router.push({ name: "loginfail" });
      }
    }
  },
  created() {
    // console.log("auth user",this.$auth.$state.user);
  },
  data() {
    return {
      drawer: false, //一開始有無顯示drawer
      miniVariant: true, //凝结导航抽屉宽度，也接受**.sync**修饰符。这样，抽屉在点击时会重新打开(小寬度的模式)
      clipped: false,
      listitems: [
        {
          icon: "mdi-apps",
          title: "首頁",
          to: "/"
        },
        {
          icon: "mdi-calendar-star",
          title: "重要紀事",
          to: "/calendar"
        },
        {
          icon: "mdi-file-edit",
          title: "指標資料修改",
          to: "/Indicator/edit"
        }
        // {
        //   icon: "mdi-information-outline",
        //   title: "intro",
        //   to: "/intro"
        // },
        // {
        //   icon: "mdi-login",
        //   title: "Login",
        //   to: "/login"
        // },
        // {
        //   icon: "mdi-logout",
        //   title: "logout"
        // }
      ]
    };
  },
  methods: {
    getaccList: async function() {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      await this.$axios
        .get("https://61.56.172.10/user-access/account/", { httpsAgent: agent })
        .then(res => {
          this.acclist = res.data;
        });
    },
    logout: function() {
      this.drawer = false;
      $nuxt.$auth.logout();
    },
    logoutchk: function(item) {
      if (item == "logout") {
        $nuxt.$auth.logout();
      }
    }
  }
};
</script>
