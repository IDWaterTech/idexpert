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
      <div class="content notify pt-4 mb-10 flex-column" v-if="!UserData.is_customer">
        <v-subheader class="title pa-0">
          <v-icon class="mx-2">mdi-bell-circle-outline</v-icon>接收通知
        </v-subheader>
        <div class="notify-item flex-column pl-1">
          <!-- <v-icon color="#EA4335" class="mr-2">mdi-gmail</v-icon> -->
          <div class="mail mx-2 my-2">
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
          <div class="mail ma-2 line flex-align-center">
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
                  profile.line_user_id != null
              "
              v-if="profile.line_user_id==null"
              >尚未綁定</v-btn
            >
            <v-btn
              color="#EA4335"
              style="color:white;"
              tile
              @click="revoke"
              :disabled="profile.line_user_id==null"
              v-else
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
                <button class="btn-icon just-icon cursor-pointer" :disabled="profile.line_user_id==null" v-bind="attrs"
                    v-on="on" @click="testMsg">
                  <v-icon style="font-size: 2rem;">mdi-send-circle-outline</v-icon>
                </button>

              </template>
              <span>發送測試訊息</span>
            </v-tooltip>
          </div>
          <div class="mail mx-2 mb-4 line d-flex flex-column line_note pa-2 full-width">
            <span style="font-size: 0.85rem;" class="d-flex align-center">1.確認綁定狀態： {{ profile.line_user_id==null?'未綁定': '綁定成功'}}</span>
            <span style="font-size: 0.85rem;">2.加入Line帳號：<strong class="mr-2">@176jtagf</strong><a href="https://lin.ee/w0836yv" target="_blank"><img src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png" alt="加入好友" height="24" border="0"></a>
              <div class="d-flex justify-center align-center">
              <img src="https://qr-official.line.me/sid/L/176jtagf.png" :style="{height:`${innerWidth>768?'81px':'64px'}`}" />
            </div>
            </span>
            <span style="font-size: 0.85rem;">3.輸入Line驗證碼：「<span id="text">{{"綁定艾滴科技專家系統驗證碼：" + profile.line_vcode }}</span>」<v-btn class="btn-icon just-icon" @click="copy()"><v-icon>mdi-content-copy</v-icon></v-btn></span>
            
            <span class="d-flex align-center" style="font-size: 0.85rem;">4.發送測試訊息：
              <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <button class="btn-icon just-icon cursor-pointer" :disabled="profile.line_user_id==null" v-bind="attrs"
                    v-on="on" @click="testMsgCloud">
                  <v-icon v-if="profile.line_user_id!=null">mdi-lightning-bolt-circle</v-icon>
                </button>

              </template>
              <span>發送測試訊息</span>
            </v-tooltip>
            </span>
          </div>

          <span></span>
        </div>
      </div>
      <div v-else class="content notify pt-4 mb-0 flex-column align-center">
        <v-subheader class="title pa-0">
          歡迎使用 艾滴科技專家系統！
        </v-subheader>
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
      UserData:{Username:'',IsSaved:false},//使用者相關資訊
      profile: {
        user_id: undefined,
        email: undefined,
        is_personal_enable_email: false,
        is_personal_enable_line: false,
        is_sys_enable_email: false,
        is_sys_enable_line: false,
        line_user_id:null,
        line_vcode:'',
        line_token: undefined
      },
      interactionLink: ``,
      req: this.$route.query,
      innerWidth: window.innerWidth,
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
        updated_user: this.$auth.$state.user.email
      };
      var res = false;
      res = await this.patchPersonalSettingList(parm,this.profile.user_id);
      setTimeout(()=>{
          if(res) {
            this.getUser();
          }
      },50)
      // await this.$axios
      //   .patch(
      //     `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/personal-settings/${this.profile.user_id}/`,
      //     parm,
      //     {
      //       headers: accheader
      //     }
      //   )
      //   .then(res => {
      //     if (res.data == "修改成功") {
      //       if (data != "nomsg") {
      //         this.$toast.success(`修改成功`, { duration: 2000 });
      //       }
      //     } else {
      //       if (data != "nomsg") {
      //         this.$toast.error(`修改失敗:${res.data}`, { duration: 2000 });
      //       }
      //     }
      //     // this.profile = res.data;
      //     // this.$toast.success(`成功:${res.data}`, { duration: 2000 });
      //   })
      //   .catch(error => {
      //     if (data != "nomsg") {
      //       this.$toast.error(`失敗:${error.message}`, { duration: 2000 });
      //     }
      //   })
      //   .finally(() => {
      //     this.getUser();
      //   });
    },
    // 取得使用者資料
    getUserData: async function() {
      // this.isLoading = false;
      let userDataList = await this.getUserList();
      var userDataListCheck = typeof (userDataList)=='string'?[]:userDataList;
      var acc = userDataListCheck.filter(x=>x.username == this.$auth.$state.user.email)[0];
      this.UserData = _.cloneDeep(acc);
      /*
      {
          "id": 3,
          "username": "XXX@idwater.com.tw",
          "account_name": "XXX",
          "department": [
              "技術部"
          ],
          "position": [
              {
                  "position_id": 124,
                  "department": "技術部",
                  "name": "軟體工程師"
              }
          ],
          "is_active": true,
          "is_sys_enable_line": true,
          "is_sys_enable_email": false,
          "is_sys_enable_line_kb": false,
          "is_personal_enable_line": true,
          "factory_id": [2,40,30],
          "pond_id": [49,50],
          "line_vcode": "XXXX",
          "line_user_id": "XXXXXXXXXXXXXX",
          "is_customer": false,
          "highest_position_id": 124
      }
      */
    },
    // 取得個別帳號資料
    getUser: async function() {
      let accheader = { account: this.$auth.$state.user.email };
      let getPersinalSettingList = await this.getPersinalSettingList(accheader);
      let data = typeof (getPersinalSettingList)=='string'?{}:getPersinalSettingList;
      console.log('getPersinalSettingList:',getPersinalSettingList);
      this.profile = data;
      /*
      {
          "user_id": XXX,
          "email": "XXXXXXXXXXXXX@idwater.com.tw",
          "is_sys_enable_line": true,
          "is_sys_enable_email": false,
          "is_personal_enable_line": true,
          "is_personal_enable_email": false,
          "line_vcode": "XXXXXX",
          "line_user_id": "XXXXXXXXXXXXX"
      }
      */
    },
    testMsgCloud: async function() {
      let msg = `這是您由系統主動發送的測試訊息，時間：${dayjs(
        new Date()
      ).format("YYYY-MM-DD HH:mm:ss")}`;
      // let line_token = this.profile.line_token;
      if (confirm(`是否測試發送訊息 [${msg}]`)) {
        await this.sentMsgCloud(msg);
      } else {
        this.$toast.info(`取消發送訊息`, { duration: 2000 });
      }
    },
    sentMsgCloud: async function(message) {
      var parm = {
        sender:this.$auth.$state.user.email,
        receivers:[`${this.$auth.$state.user.email}`],
        content: message,
      };
      var header = {'x-api-key': '16069c362a26aa860be9c11bf791a05cdebe9bbec3f504df77dd0275c82adfa3',
      };

      await this.$axios
        .post(`${this.$store.state.mydata.gobal_api.apiUrl}/line/push/`,parm/*,{headers:header}*/)
        .then(res => {
          console.log(res);
          this.$toast.success(`成功:${res.data.detail}`, { duration: 2000 });
        })
        .catch(error => {
          console.log('error',error)
          this.$toast.error(`失敗:${error}`, { duration: 2000 });
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
    },
    copy() {
      var node = document.getElementById("text");
      if (document.body.createTextRange) {
          var range = document.body.createTextRange();
          range.moveToElementText(node);
          range.select();
          document.execCommand("copy");
          alert("複製成功!");
      } else if (window.getSelection) {
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(node);
          selection.removeAllRanges();
          selection.addRange(range);
          document.execCommand("copy");
          this.$toast.success("複製成功!!，請將文字內容貼入「艾滴科技專家系統」Line對話框內進行綁定作業！", { duration: 5000 });
          // alert("複製成功!!");
          
      } else {
          alert('無法複製內容、瀏覽器不支援');
      }
    }
  },
  async mounted() {
    // let re_uri = `http://expert.idwatertech.com/set/profile`;
    let re_uri = location.href;
    let client_id = `nNb2Igb0DnnmWsauU5mWoP`;
    this.interactionLink = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${re_uri}&scope=notify&state=abcd`;
    this.getUser();// 取得個別帳號資料
    await this.getUserData();// 取得使用者資料
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
      &.line_note {
        border: 1px solid $color-primary;
        border-radius: 4px;
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
