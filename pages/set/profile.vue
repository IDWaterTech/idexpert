<template>
  <div style="width: 100%;height: 100%;">
    <v-card  class="login profile px-6 py-10">
      <v-overlay :value="$route.query.hasOwnProperty('code')" :absolute="true">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <div class="card-title mb-0 pb-4 border-bottom">
        <!-- {{ this.$auth.$state.user.picture }} -->
          <div class="title flex-align-center">
            <v-avatar size="60"
              ><v-img :src="this.$auth.$state.user.picture"></v-img
            ></v-avatar>
            <div class="information flex-column pa-3">
              <span class="title">{{ $auth.$state.user.name }}</span>
              <span style="max-width: 200px;font-size: 0.85rem;font-weight: 500;">{{ $auth.$state.user.email }}</span>
            </div>
          </div>
      </div>
      <v-divider></v-divider>
      <div class="content notify pt-4 mb-10 flex-column">
        <v-subheader class="title pa-0">
          <v-icon class="mx-2">mdi-bell-circle-outline</v-icon>接收通知
        </v-subheader>
        <div class="notify-item flex-column pl-1">
          <!-- <v-icon color="#EA4335" class="mr-2">mdi-gmail</v-icon> -->
          <div class="mail mx-2 my-4">
            <!-- {{ profile.is_sys_enable_email }} -->
            <span>Mail</span>
            <el-switch
              v-model="profile.is_personal_enable_email"
              active-color="#006AA6"
              inactive-color="#BFCBD2"
              @change="statchange()"
              :disabled="!profile.is_sys_enable_email"
            ></el-switch
            >
          </div>
          
          <!-- <v-icon color="#00B900" class="mr-2"
            >mdi-alpha-l-circle-outline</v-icon> -->
          <div class="mail mx-2 my-4 line flex-align-center">
            <span>Line</span>
            <el-switch
              class="mx-2"
              v-model="profile.is_personal_enable_line"
              active-color="#006AA6"
              inactive-color="#BFCBD2"
              @change="statchange()"
              :disabled="!profile.is_sys_enable_line"
            ></el-switch>

            <v-btn
              class="btn-primary green mx-2"
              tile
              :href="interactionLink"
              :disabled="
                !profile.is_personal_enable_line ||
                  profile.line_token.length != 0
              "
              v-if="!profile.line_token"
              >尚未綁定</v-btn
            >
            <v-btn
              color="#EA4335"
              style="color:white;"
              tile
              @click="revoke"
              :disabled="!profile.line_token"
              v-if="profile.line_token"
              class="btn-primary delete mx-2"
            >
              <!-- <v-icon :disabled="!profile.line_token">mdi-vector-polyline-remove</v-icon> -->
              解除綁定
            </v-btn>
            <!-- <v-icon color="#13ce66" :disabled="!profile.line_token"
              >mdi-check-bold</v-icon
            > -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <button class="btn-icon just-icon cursor-pointer" :disabled="!profile.line_token" v-bind="attrs"
                    v-on="on" @click="testMsg">
                  <v-icon style="font-size: 2rem;">mdi-send-circle-outline</v-icon>
                </button>
                
              </template>
              <span>發送測試訊息</span>
            </v-tooltip>
          </div>
                  
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import dayjs from "dayjs";
import https from "https";
const agent = new https.Agent({
          rejectUnauthorized: false
        });
export default {
  layout: "emptynologinprofile",
  middleware: 'auth',
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
  async created() {
    await this._pageCheck();//驗證頁面是否可檢視
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
          `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/personal-settings/${this.profile.user_id}/`,
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
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/personal-settings/`, {
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
        .post(`${this.$store.state.mydata.gobal_api.apiIIS82}/line/LineMsg`, parm,{
            httpsAgent: agent
          })
        .then(res => {
          console.log(res);
          this.$toast.success(`成功:${res.data.message}`, { duration: 2000 });
        })
        .catch(error => {
          console.log('error',error)
          this.$toast.error(`失敗:${error}`, { duration: 2000 });
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
        .post(`${this.$store.state.mydata.gobal_api.apiIIS82}/line/revoke`, parm,{
            httpsAgent: agent
          })
        .then(res => {
          // let revokedata = JSON.parse(res.data.d);
          let revokedata = res.data;
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
        .post(`${this.$store.state.mydata.gobal_api.apiIIS82}/line/getToken`, parm,{
            httpsAgent: agent
          })
        .then(res => {
          console.log('getToken',res)
          // let linetoken = JSON.parse(res.data.d);
          let linetoken = res.data;
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
            this.$toast.error(`錯誤:${res.data.message[0]}`, { duration: 2000 });
          }
        })
        .catch(error => {
          console.log('error',error)
          this.$toast.error(`失敗:${error}`, { duration: 2000 });
        })
        .finally(() => {
          //重導頁不要有code
          
        });
        location.href = location.href.replace(location.search, "");
    }
  },
};
</script>

<style lang="scss" scoped>
.v-subheader {
  font-size: 1.5em;
}
.v-application.v-application--is-ltr .v-card.login.profile {
  .notify {
    @include flexAlignStart();
    width: 100%;
    .title {
      &.theme--light.v-subheader {
        color: $color-primary;
        font-weight: bold;
      }
      & .v-icon {
        color: $color-primary;
      }
      
    }
    .notify-item {
      @include flexAlignStart();
    }
    .mail {
      & > span {
        font-size: 1rem;
        font-weight: bold;
        color: $color-primary;
        margin-right: 8px;
      }
    }
  }
  .information {
    @include flexAlignStart();
    .title {
      font-weight: bold;
    }
  }
}

</style>
