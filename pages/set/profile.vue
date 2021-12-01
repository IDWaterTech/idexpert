<template>
  <div>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="8">
        <!-- <div v-if="!location.href.includes('expert.idwatertech.com')">{{`目前網址[${location.href}]無法使用本頁功能`}}</div>
        <v-card tile :disabled="!location.href.includes('expert.idwatertech.com')"> -->
        <v-card tile dark color="primary">
          <v-card-title class="cardtitle">個人設定</v-card-title
          >
          <v-overlay :value="$route.query.hasOwnProperty('code')" :absolute="true">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
          <v-card-text class="pt-2 pb-10 white--text">
            <v-subheader dark
              ><v-icon class="mx-2">mdi-account-circle-outline</v-icon
              >個人資訊</v-subheader
            ><v-divider class="mb-2"></v-divider>
            <v-row>
              <!-- <v-col cols="12" sm="2" align-self="center" class="text-center" style="font-size:2em">
                    使用者
                  </v-col> -->
              <v-spacer></v-spacer>
              <v-col
                cols="12"
                sm="8"
                align-self="center"
                class="text-center title"
              >
                <span class="title">{{ $auth.$state.user.name }}</span
                ><br />
                <span class="subtitle-1">{{ $auth.$state.user.email }}</span>
              </v-col>
              <v-col cols="12" sm="2" align-self="center">
                <v-avatar color="primary" size="76"
                  ><v-img :src="this.$auth.$state.user.picture"></v-img
                ></v-avatar>
              </v-col>
            </v-row>
            <v-subheader dark
              ><v-icon class="mx-2">mdi-bell-circle-outline</v-icon
              >接收通知</v-subheader
            ><v-divider class="mb-2"></v-divider>
            <v-row>
              <v-spacer></v-spacer>
              <v-col
                cols="12"
                sm="8"
                align-self="center"
                class="text-left title"
              >
                <v-icon color="#EA4335" class="mr-2">mdi-gmail</v-icon>Mail
                <el-switch
                  v-model="profile.is_personal_enable_email"
                  active-color="#13ce66"
                  inactive-color="#eee"
                  @change="statchange()"
                  :disabled="!profile.is_sys_enable_email"
                ></el-switch
                ><br />
                <v-icon color="#00B900" class="mr-2"
                  >mdi-alpha-l-circle-outline</v-icon
                >Line
                <el-switch
                  v-model="profile.is_personal_enable_line"
                  active-color="#13ce66"
                  inactive-color="#eee"
                  @change="statchange()"
                  :disabled="!profile.is_sys_enable_line"
                ></el-switch>

                <v-btn
                  color="#13ce66"
                  style="color:white;"
                  tile
                  :href="interactionLink"
                  :disabled="
                    !profile.is_personal_enable_line ||
                      profile.line_token.length != 0
                  "
                  v-if="!profile.line_token"
                  >尚未綁定Line</v-btn
                >
                <v-btn
                  color="#EA4335"
                  style="color:white;"
                  tile
                  @click="revoke"
                  :disabled="!profile.line_token"
                  v-if="profile.line_token"
                >
                  <v-icon :disabled="!profile.line_token"
                    >mdi-vector-polyline-remove</v-icon
                  >解除綁定
                </v-btn>
                <v-icon color="#13ce66" :disabled="!profile.line_token"
                  >mdi-check-bold</v-icon
                >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="orange"
                      v-bind="attrs"
                      v-on="on"
                      @click="testMsg"
                      :disabled="!profile.line_token"
                      >mdi-information-outline</v-icon
                    >
                  </template>
                  <span>發送測試訊息</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="2" align-self="center"> </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import dayjs from "dayjs";
export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
    return {
      profile: {
        user_id: undefined,
        email: undefined,
        is_personal_enable_email: false,
        is_personal_enable_line: false,
        is_sys_enable_email: false,
        is_sys_enable_line: false,
        line_token: undefined
      },
      interactionLink: ``,
      req: this.$route.query
    };
  },
  methods: {
    statchange: async function(data) {
      let accheader = { account: this.$auth.$state.user.email };
      let parm = {
        is_personal_enable_email: this.profile.is_personal_enable_email,
        is_personal_enable_line: this.profile.is_personal_enable_line,
        line_token: this.profile.line_token
      };
      await this.$axios
        .patch(
          `${process.env.apiUrl}/user-access/personal-settings/${this.profile.user_id}`,
          parm,
          {
            headers: accheader
          }
        )
        .then(res => {
          if (res.data == "修改成功") {
            if (data != "nomsg") {
              this.$toast.success(`修改成功`, { duration: 2000 });
            }
          } else {
            if (data != "nomsg") {
              this.$toast.error(`修改失敗:${res.data}`, { duration: 2000 });
            }
          }
          // this.profile = res.data;
          // this.$toast.success(`成功:${res.data}`, { duration: 2000 });
        })
        .catch(error => {
          if (data != "nomsg") {
            this.$toast.error(`失敗:${error.message}`, { duration: 2000 });
          }
        })
        .finally(() => {
          this.getUser();
        });
    },
    getUser: async function() {
      let accheader = { account: this.$auth.$state.user.email };
      await this.$axios
        .get(`${process.env.apiUrl}/user-access/personal-settings/`, {
          headers: accheader
        })
        .then(res => {
          if (res.data != "帳號資料不存在") {
            this.profile = res.data;
            // this.$toast.success(`成功:${res.data}`, { duration: 2000 });
          } else {
            this.$toast.error(`失敗:${res.data}`, { duration: 2000 });
          }
        })
        .catch(error => {
          this.$toast.error(`失敗:${error.message}`, { duration: 2000 });
        })
        .finally(() => {
          //this.getdata();
        });
    },
    testMsg: async function() {
      let msg = `這是您由系統主動發送的測試訊息，時間：${dayjs(
        new Date()
      ).format("YYYY-MM-DD HH:mm:ss")}`;
      let line_token = this.profile.line_token;
      if (confirm(`是否測試發送訊息 [${msg}]`)) {
        await this.sentMsg(msg, line_token);
      } else {
        this.$toast.info(`取消發送訊息`, { duration: 2000 });
      }
    },
    sentMsg: async function(message, line_token) {
      var parm = {
        msg: message,
        token: line_token
      };
      //使用中介服務另外中轉
      await this.$axios
        .post(`${process.env.apiIIS82}/linenotify.asmx/LineMsg`, parm)
        .then(res => {
          this.$toast.success(`成功:${res.data.d}`, { duration: 2000 });
        })
        .catch(error => {
          this.$toast.error(`失敗:${error.message}`, { duration: 2000 });
        })
        .finally(() => {
          //this.getdata();
        });
    },
    revoke: async function() {
      var parm = {
        token: this.profile.line_token
      };
      //使用中介服務另外中轉
      await this.$axios
        .post(`${process.env.apiIIS82}/linenotify.asmx/revoke`, parm)
        .then(res => {
          let revokedata = JSON.parse(res.data.d);
          if (revokedata.message == "ok") {
            this.profile.line_token = "";
            this.statchange("nomsg");
            this.$toast.success(`成功解除:${revokedata.message}`, {
              duration: 2000
            });
          } else if (revokedata.message == "Invalid access token") {
            this.profile.line_token = "";
            this.statchange("nomsg");
            this.$toast.success(`已曾解除連動:${revokedata.message}`, {
              duration: 2000
            });
          } else {
            this.$toast.success(`other:${revokedata.message}`, {
              duration: 2000
            });
          }
        })
        .catch(error => {
          this.$toast.error(`失敗:${error.message}`, { duration: 2000 });
        })
        .finally(() => {
          //this.getdata();
        });
    }
  },
  async mounted() {
    // let re_uri = `http://expert.idwatertech.com/set/profile`;
    let re_uri = location.href;
    let client_id = `nNb2Igb0DnnmWsauU5mWoP`;
    this.interactionLink = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${re_uri}&scope=notify&state=abcd`;
    this.getUser();
    if (this.$route.query.hasOwnProperty("error")) {
      this.$toast.error(`錯誤:${this.$route.query.error}`, { duration: 5000 });
    }
    if (this.$route.query.hasOwnProperty("code")) {
      // let code = this.$route.query.code;//i4QGmPw2tEgMfEJ44g6WoT

      let parm = { code: this.$route.query.code,re_uri :location.href.replace(location.search, "") };
      await this.$axios
        .post(`${process.env.apiIIS82}/linenotify.asmx/getToken`, parm)
        .then(res => {
          let linetoken = JSON.parse(res.data.d);
          if (
            linetoken.hasOwnProperty("access_token") &&
            linetoken.access_token != null
          ) {
            this.profile.line_token = linetoken.access_token;
            this.statchange("nomsg");
            // this.$toast.success(`成功:${linetoken.access_token}`, {
            //   duration: 2000
            // });
          } else {
            this.$toast.error(`錯誤:${res.data.d}`, { duration: 2000 });
          }
        })
        .catch(error => {
          this.$toast.error(`失敗:${error.message}`, { duration: 2000 });
        })
        .finally(() => {
          //重導頁不要有code
          
        });
        location.href = location.href.replace(location.search, "");
    }
  }
};
</script>

<style scoped>
.v-subheader {
  font-size: 1.5em;
}
</style>
