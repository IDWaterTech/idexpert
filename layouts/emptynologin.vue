<template>
<client-only>
  <v-app>
    <v-main class="mainbg">
      <v-navigation-drawer
        dark
        app
        class="mainnav"
        v-model="drawer"
        :mini-variant="miniVariant"
        :clipped="clipped"
        :mini-variant-width="this.$auth.$state.loggedIn ? '60' : '0'"
      >
        <v-list><a href="set/profile" style="text-decoration: none;">
          <v-list-item>
            
            <v-list-item-avatar v-if="this.$auth.$state.loggedIn" size="36">
              <v-img contain :src="this.$auth.$state.user.picture" ></v-img>
            </v-list-item-avatar>
            <v-list-item-icon v-if="!this.$auth.$state.loggedIn">
              <v-icon large>mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content v-if="this.$auth.$state.loggedIn" size="36">
              <v-list-item-title class="h6">
                {{ this.$auth.$state.user.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                {{ this.$auth.$state.user.email }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
</a>
          <!-- <v-list-item
            v-for="(item, i) in listitems"
            :key="i"
            :to="item.to"
            v-show="
              ($auth.$state.user &&
                superaccount.includes($auth.$state.user.email) &&
                 ['廠域設定','觀察網影像'].includes(item.title)) ||
                !['廠域設定','觀察網影像'].includes(item.title)
            "
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item> -->
        </v-list>
        <sidelist :myitem="listitems" titleName="name" urlName="url" active="is_drop_down"></sidelist>
        <!--  -->
      </v-navigation-drawer>
      <v-container fluid>
        <v-app-bar app class="mainnav" dark>
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
            v-show="this.$auth.$state.loggedIn"
          ></v-app-bar-nav-icon>
          <v-btn
            icon
            @click.stop="miniVariant = !miniVariant"
            v-show="this.$auth.$state.loggedIn && drawer==true"
          >
            <v-icon
              >mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon
            >
          </v-btn>
          <nuxt-link to="/" style="color:white;text-decoration:none;"><v-icon>mdi-home-outline</v-icon>艾滴科技</nuxt-link>
          <weather></weather>
          <!-- <v-btn text to="/"><v-icon>mdi-home-outline</v-icon>艾滴科技</v-btn> -->
          <v-spacer></v-spacer>
          <!-- <v-btn
            icon
            to="/set/"
            v-show="
              this.$auth.$state.loggedIn &&
                superaccount.includes(this.$auth.$state.user.email)
            "
            ><v-icon>mdi-cog-outline</v-icon></v-btn
          > -->
          <div v-if="this.$auth.$state.loggedIn">
            <!-- {{ this.$auth.$state.user.name }} -->
            <v-btn icon @click="logout"><v-icon>mdi-home-export-outline</v-icon></v-btn>
          </div>
          <div v-show="!this.$auth.$state.loggedIn">
            <v-btn icon to="/login"><v-icon>mdi-home-import-outline</v-icon></v-btn>
          </div>
        </v-app-bar>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
  </client-only>
</template>

<script>
export default {
  async beforeCreate() {
    //登入時判別身份分別導頁
    if (this.$auth.$state.loggedIn) {
      let acclist = [];
      await this.$axios
        .get(`${process.env.apiUrl}/user-access/account/`)//所有使用者的清單
        .then(res => {
          acclist = res.data;
        });
      var acc = acclist.filter(
        x => x.username.toLowerCase() == this.$auth.$state.user.email.toLowerCase()
      );
      //登入成功
      if (acc.length == 1) {
        //增加身份判別---
        const updatedUser = { ...this.$auth.user };
        updatedUser.role = "user"; //允許登入的
        updatedUser.authcheck = true; //授權可登入
        // this.$auth.setUser(updatedUser); //會造成Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        //--------------
      } else {
        //登入失敗
        const updatedUser = { ...this.$auth.user };
        updatedUser.role = "guest";
        updatedUser.authcheck = false;
        // this.$auth.setUser(updatedUser); //會造成Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        this.$router.push({ name: "loginfail" });
      }
    }
  },
  data() {
    return {
      drawer: false, //一開始有無顯示drawer
      miniVariant: true, //凝结导航抽屉宽度，也接受**.sync**修饰符。这样，抽屉在点击时会重新打开(小寬度的模式)
      clipped: false,
      listitems: [
        // {
        //   icon: "mdi-apps",
        //   title: "首頁",
        //   to: "/"
        // },
        // {
        //   icon: "mdi-chart-bell-curve",
        //   title: "監測數據",
        //   to: "/basic"
        // },
      ],
      superaccount: [
                  'jianwei.wen@idwater.com.tw',
                  'jeff.wang@idwater.com.tw',//前驊
                  'alex.chen@idwater.com.tw',//廷宇
                  'steven.huang@idwater.com.tw',//璿中
                  'eric.cheung@idwater.com.tw',//星希
                  'eason.lin@idwater.com.tw',//奕昇
                  'cf.chien@idwater.com.tw',//靖芳
                ]
    };
  },
  async mounted() {
    let acclist = [];
    if (this.$auth.$state.loggedIn) {
      let accheader ={account:this.$auth.$state.user.email}
      await this.$axios
        .get(`${process.env.apiUrl}/user-access/authorization-menu/`,{headers:accheader})//帳號被授權進入的項目
        .then(res => {
          acclist = res.data;
        })
        .catch(err => {
              // this.$toast.error("讀取api失敗：" + err.message, { duration: 2000 });
              alert(`讀取api失敗：${err.message}`);
            });
    }
    this.listitems = acclist;
    console.log("被授權進入的項目",this.listitems);
  },
  methods: {
    logout: function() {
      this.drawer = false;
      $nuxt.$auth.logout();
    }
  }
};
</script>
