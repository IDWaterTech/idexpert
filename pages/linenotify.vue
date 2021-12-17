<template>
  <div>
    <h2><v-icon large>mdi-bell-outline</v-icon>LineNotify</h2>
    <v-row>
      <v-col cols="12" md="10">
        <v-text-field clearable v-model.trim="msg" dense filled autocomplete="off"
          ><span style="width:100px;" slot="prepend"
            >訊息內容</span
          ></v-text-field
        >
      </v-col>
      <v-col cols="12" md="2">
        <v-btn block tile @click="line" :disabled="!msg">發送訊息</v-btn>
      </v-col>
      <v-col cols="12">
          <v-btn block tile :href="linhref">自己指定要接收的群組</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import https from "https";
const agent = new https.Agent({
          rejectUnauthorized: false
        });
export default {
  layout: "emptynologin",
  data() {
    return {
      msg: "",
      linhref:`https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=nNb2Igb0DnnmWsauU5mWoP&redirect_uri=http://localhost:3000/linenotify&scope=notify&state=abcd`,
    };
  },
  methods: {
    line: async function() {
      var parm = {
        msg: this.msg
      };
      //使用中介服務另外中轉
      await this.$axios
        .post(`${this.$store.state.mydata.gobal_api.apiIIS82}/linenotify.asmx/LineMsg`, parm,{
            httpsAgent: agent
          })
        .then(res => {
          this.msg = "";
          this.$toast.success(`成功:${res.data.d}`, { duration: 2000 });
        })
        .catch(error => {
          this.$toast.error(`失敗:${error.message}`, { duration: 2000 });
        })
        .finally(() => {
          //this.getdata();
        });
      //axiost模式，會有cors問題
      //----------------------------------------
      //   const instance = this.$axios.create({
      //     baseURL: "/lineapi/api/",
      //     // baseURL:"https://notify-api.line.me/api/",
      //     // withCredentials: false,
      //     timeout: 3000,
      //     // crossDomain: true,
      //     headers: {
      //       Authorization: "Bearer 5lhF3YUhEsuxBhAP4l3EkzmRU0Nqf1q3Ioq9mv4Z3vG",
      //     //   "Access-Control-Allow-Origin": "*"
      //     }
      //   });

      //   await instance
      //     .post("/notify", form_data)
      //     .then(res => {
      //       this.$toast.success("成功:" + res.data.message, { duration: 2000 });
      //     })
      //     .catch(error => {
      //       this.$toast.error(
      //         "error:" + error + "-" + error.response.data.message,
      //         { duration: 2000 }
      //       );
      //     });
      //   this.msg = "";
      //---------------------------------------------------
    }
  }
};
</script>

<style scoped></style>
