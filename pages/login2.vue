<template>
  <v-container style="height: 100%;">
    <!-- <h1 style="color:lightblue;">登入</h1> -->
    <!-- <strong>{{ $auth.$state.redirect }}</strong> -->
    <v-tabs centered grow icons-and-text v-if="false">
      <v-tab class="primary--text" :href="'#tab-2'">
        第三方登入<v-icon>mdi-google</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs" style="background-color: transparent;height: 100%;position: relative;">
      <v-tab-item :value="'tab-2'" class="text-center mt-5">
        <!-- <v-row> -->
          <img class="tech-bg" src="../assets/login_bg.png">
          <v-card  class="login">
            <div class="card-title">
                <div class="title">
                    <img src="../assets/logo.jpg" style="max-height: 120px;" />
                    <h3>專家系統</h3>
                </div>
            </div>
            <div class="content">
              <v-row>
                <!-- 帳密輸入 -->
                <!-- <v-col cols="12">
                  <v-form ref="formjwt" v-model="validjwt" lazy-validation>
                    <div>
                        <v-text-field
                        v-model="loginjwt.username"
                        :rules="rules.require"
                        label="使用者名稱"
                        required filled dense clearable disabled
                      ></v-text-field>
                    </div>
                    <div>
                      <v-text-field
                        v-model="loginjwt.password"
                        :rules="rules.require"
                        label="密碼"
                        required filled dense clearable disabled
                      ></v-text-field>
                    </div>
                    <div>
                      
                      <v-btn color="primary" block
                      large tile @click="loginJWT" disabled
                      style="border:0px;"><v-icon size="24">mdi-water-outline</v-icon>{{`　本地登入(開發測試中)`}}</v-btn>
                    </div>
                  </v-form>
                </v-col> -->
                
                <!-- Google登入 -->
                <v-col cols="12">
                  <v-btn
                    dark
                    large tile
                    style="border:0px;height: 40px;"
                    @click="loginGoogle"
                    :style="{ background: '#4284f4' }"
                    color="error" block
                    class="google-btn"
                    ><v-icon size="24">mdi-google</v-icon>{{`　以Google登入`}}</v-btn
                  >
                </v-col>
            </v-row>
            </div>
          </v-card>
        <!-- </v-row> -->
      </v-tab-item>
    </v-tabs-items>
    <!-- <v-tabs v-model="tabs" centered grow icons-and-text>
      <v-tab class="primary--text" :href="'#tab-1'" v-if="false">
        本地登入<v-icon>mdi-home-circle-outline</v-icon>
      </v-tab>
      <v-tab class="primary--text" :href="'#tab-2'">
        第三方登入<v-icon>mdi-google</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item :value="'tab-1'"  v-if="false">
        <UserAuthForm buttonText="Login" :submitForm="loginUser" />
      </v-tab-item>
      <v-tab-item :value="'tab-2'"  class="text-center mt-5">
        <br />
        <v-btn
          dark
          style="border:0px;"
          @click="loginGoogle"
          :style="{ background: '#4284f4' }"
          >以Google登入</v-btn
        >
      </v-tab-item>
    </v-tabs-items> -->
  </v-container>
</template>
<script>
import UserAuthForm from "@/components/UserAuthForm";

export default {
  // layout: "emptynologin",
  layout: "emptychangebg",
  data() {
    return {
      tabs: "tab-2",
      rules: { require: [v => !!v || "*必要項目"] },
      loginjwt:{
        username:'',//jeff.wang@idwater.com.tw
        password:'',//idw12345
      },
      validjwt:true,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    };
  },
  components: {
    UserAuthForm
  },
  computed: {
    redirect() {
      console.log("redirect!", this.$route.query.redirect);
      return (
        this.$route.query.redirect &&
        decodeURIComponent(this.$route.query.redirect)
      );
    },
    isCallback() {
      console.log("iscallback!", this.$route.query.callback);
      return Boolean(this.$route.query.callback);
    }
  },
  methods: {
    loginUser(loginInfo) {
      //一般正常可post取得資料方式
      // var apilink = '/mapi/api/user';
      // var head= {
      //   Authorization:'Basic AGOEqDPJ9OHZKqjMF0-yohzIq_btc2OVOmAycIcnKGmpd8CWlygIWrQxwd6nUEdEI-IVcC9CWoxoOqN55PYW6h66vf5bpRV3fRF15sYehbITZuCKVVCw5GROhwd99LoG9qHLMeXwdGEHfXy_THz_94EIeDDHatGlDb-ue4ULIsLX_p2GDUJG1elSknx1Ncwq2ufoJ3vBuAghYO4f78GBa77KkJ8wpQtNXjs5A9JXXSo'
      // }
      // this.$axios.get(apilink,{headers:head}).then((response)=>{
      //   console.log(response);
      // })
      // .catch((e) => { console.log(e)
      // debugger;
      // })
      // .finally(() => { /* 不論失敗成功皆會執行 */ });

      //loginInfo物件組成url型式→ "email=email@domain.com&password=password&grant_type=password"
      //使用auth登入方式
      var a = this.$auth
        .loginWith("local", {
          //  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },  //與header無關
          data: Object.entries(loginInfo)
            .map(e => e.join("="))
            .join("&")
        })
        .catch(errors => {
          //errors.response.data;//可抓到錯誤
          this.$toast.error("登入發生錯誤!", { duration: 3000 });
        });
      //.then(() => this.$toast.success('Logged In!',{duration:3000}));
    },
    async loginGoogle() {
      try {
        await this.$auth.loginWith("google", {
          params: { prompt: "select_account" }
        });
        // .then(res =>
        //   this.$toast.success("Logged In!" + res.data, { duration: 3000 })
        // )
        // .catch(errors => {
        //   debugger;
        //   //errors.response.data;//可抓到錯誤
        //   this.$toast.error("登入發生錯誤!:" + errors.message, {
        //     duration: 3000
        //   });
        //   console.log("error:" + errors.response.data);
        //   console.log("google", a);
        // });
      } catch (err) {
        console.log(err);
        this.$toast.error("登入發生錯誤!:" + err, {
          duration: 5000
        });
      }
    },
    async loginJWT() {
      if (this.$refs.formjwt.validate()==false) {
        
        return;
      }
      console.log(this.loginjwt);
      var parm = {
        username:this.loginjwt.username,
        password:this.loginjwt.password
      }
      try {
        await this.$auth.loginWith("localjwt", {data: this.loginjwt})
        .then(() => {
          this._pageCheck();//驗證頁面是否可檢視，並取得全域可檢視清單
          this.$toast.success('Logged In!',{duration:3000});
          })
        .catch(err=>{
          this.$toast.error(`登入發生錯誤!:${err.message}-[${err.response.data.detail}]`, {
            duration: 3000
          });
        });
        // .then(res =>
        //   this.$toast.success("Logged In!" + res.data, { duration: 3000 })
        // )
        // .catch(errors => {
        //   debugger;
        //   //errors.response.data;//可抓到錯誤
        //   this.$toast.error("登入發生錯誤!:" + errors.message, {
        //     duration: 3000
        //   });
        //   console.log("error:" + errors.response.data);
        //   console.log("google", a);
        // });
      } catch (err) {
        console.log(err);
        this.$toast.error("登入發生錯誤!:" + err, {
          duration: 5000
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-application.v-application--is-ltr {
  .tech-bg {
    // max-height: 480px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 80%;
    margin-left: -24px;
  }
  .v-card.login {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow: hidden;
    margin-bottom: 24px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.10), 0px 0px 10px 0px rgba(255,255,255,0.4);
    .card-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 48px;
      .title {
        color: #006AA6;
        h3 {
          margin-top: -12px;
        }
      }
    }
    .content {
      margin-bottom: 32px;
      .google-btn {
        border-radius: 4px;
      }
    }
  }
}
@media (max-width: 959.98px) {
  .v-application.v-application--is-ltr {
    .tech-bg {
      width: 90%;
    }
  }
}
@media (max-width: 768px) {
  .v-application.v-application--is-ltr {
    .tech-bg {
      display: none;
    }
  }
}
</style>
