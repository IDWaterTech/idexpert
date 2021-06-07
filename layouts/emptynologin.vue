<template>
  <v-app dark>
    <v-main>
      <v-navigation-drawer
        app
        v-model="drawer"
        :mini-variant="miniVariant"
        :clipped="clipped"
        v-if="$auth.loggedIn"
      >
        <!-- -->
        <v-list>
          <v-list-item>
            <!-- <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
           </v-list-item-avatar> -->
            <v-list-item-icon>
              <v-icon large>mdi-account-circle</v-icon>
            </v-list-item-icon>
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
            v-if="$auth.loggedIn"
          />
          <v-btn
            icon
            @click.stop="miniVariant = !miniVariant"
            v-if="$auth.loggedIn"
          >
            <v-icon
              >mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon
            >
          </v-btn>

          <v-btn text to="/">艾滴科技</v-btn>
          <v-btn icon to="/calendar"><v-icon>mdi-calendar-star</v-icon></v-btn>
          <v-btn icon to="/Indicator/edit"><v-icon>mdi-file-edit</v-icon></v-btn>
          <v-spacer />
          
          <!-- <div v-if="$auth.loggedIn">
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
</template>

<script>
export default {
  beforeCreate() {
    //登入時判別身份分別導頁
    if (this.$auth.loggedIn) {
      if (this.$auth.state.user.email == "109085@w.tmu.edu.tw") {
        this.$router.push({ path: "page1" });
      } else {
        //this.$router.push({ path: 'intro' });
      }
    }
  },
  data() {
    return {
      drawer: true, //一開始有無顯示drawer
      miniVariant: false, //凝结导航抽屉宽度，也接受**.sync**修饰符。这样，抽屉在点击时会重新打开(小寬度的模式)
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
    logoutchk: function(item) {
      if (item == "logout") {
        $nuxt.$auth.logout();
      }
    }
  }
};
</script>
