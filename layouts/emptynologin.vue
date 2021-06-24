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
                <v-list-item-subtitle>{{ this.$auth.$state.user.email }}</v-list-item-subtitle>
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
            <v-btn icon to="/calendar"
              ><v-icon>mdi-calendar-star</v-icon></v-btn
            >
            <v-btn icon to="/Indicator/edit"
              ><v-icon>mdi-file-edit</v-icon></v-btn
            >
            <v-spacer />
            <v-btn icon to="/set/" v-show="this.$auth.$state.loggedIn"
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
export default {
  beforeCreate() {
    //登入時判別身份分別導頁
    if (this.$auth.$state.loggedIn) {
      if (this.$auth.$state.user.email == "jianwei.wen@idwater.com.tw") {
        //增加身份判別---
        console.log("this.$auth.$state.user", this.$auth.$state.user);
        const updatedUser = { ...this.$auth.user };
        updatedUser.role = "admin";
        this.$auth.setUser(updatedUser);
        //--------------
      } else {
        const updatedUser = { ...this.$auth.user };
        updatedUser.role = "other";
        this.$auth.setUser(updatedUser);
      }
    }
  },
  created() {
    // console.log("auth user",this.$auth.$state.user);
  },
  data() {
    return {
      drawer: true, //一開始有無顯示drawer
      miniVariant: true, //凝结导航抽屉宽度，也接受**.sync**修饰符。这样，抽屉在点击时会重新打开(小寬度的模式)
      clipped: false,
      listitems: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/"
        },
        {
          icon: "mdi-information-outline",
          title: "intro",
          to: "/intro"
        },
        {
          icon: "mdi-login",
          title: "Login",
          to: "/login"
        },
        {
          icon: "mdi-logout",
          title: "logout"
        }
      ]
    };
  },
  methods: {
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
