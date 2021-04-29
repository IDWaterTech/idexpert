<template>
  <v-container>
    <h1>Login</h1>
    <strong>{{ $auth.$state.redirect }}</strong>
    <v-tabs v-model="tabs" fixed-tabs icons-and-text>
      <v-tab class="primary--text" :href="'#tab-1'">
        本地登入<v-icon>mdi-home-circle-outline</v-icon>
      </v-tab>
      <v-tab class="primary--text" :href="'#tab-2'">
        第三方登入<v-icon>mdi-google</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item :value="'tab-1'">
        <UserAuthForm buttonText="Login" :submitForm="loginUser" />
      </v-tab-item>
      <v-tab-item :value="'tab-2'">
        <br />
        <v-btn
          dark
          block
          style="border:0px;"
          @click="loginGoogle"
          :style="{ background: '#4284f4' }"
          >Login with Google</v-btn
        >
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
<script>
import UserAuthForm from "@/components/UserAuthForm";

export default {
  layout: "empty",
  data() {
    return {
      tabs: null
    };
  },
  components: {
    UserAuthForm
  },
  computed: {
    redirect() {
      console.log("redirect!",this.$route.query.redirect);
      return (
        this.$route.query.redirect &&
        decodeURIComponent(this.$route.query.redirect)
      );
    },
    isCallback() {
      console.log("iscallback!",this.$route.query.callback);
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
        var a = await this.$auth.loginWith("google").catch(errors => {
          //errors.response.data;//可抓到錯誤
          this.$toast.error("登入發生錯誤!:", { duration: 3000 });
          console.log("error:" + errors.response.data);
          console.log("google",a);
        });
      } catch(err) {
          console.log(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
