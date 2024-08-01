<template>
  <div>
    <v-card class="bg-card img-error">
        <div class="content">
            <h1>
              帳號未授權登入
            </h1>
            <!-- <h3>{{ ($auth.$state.user)?$auth.$state.user.email:'usermail' }} <br>請向主管提出申請 或 以其他帳號登入</h3> -->
            <h3>{{ (loginfailData.account)?loginfailData.account[0]:'usermail' }} 
              <br>請向主管提出申請 或 以其他帳號登入
              <br>{{ (loginfailData.non_field_errors)?loginfailData.non_field_errors[0]:'error' }}
            </h3>
            <v-btn class="btn-primary" @click="toHomePage()" style="margin-top: 24px;">
                返回首頁
            </v-btn>
        </div>
        
    </v-card>
  </div>
</template>

<script>
export default {
  layout: "emptynologin2",
  data() {
    return {
      loginfailData:{ },
    }
  },
  methods: {
      toHomePage() {
        window.location.href='/';
      }
  },
  mounted(){
    this.loginfailData = JSON.parse(sessionStorage.getItem('loginfailData'));
    console.error(sessionStorage.getItem('loginfailData'));
  }
  
}
</script>

<style lang="scss" scoped>
form {
  background: #f7f2ec url("/letter_bg.jpg");
  height: 200px;
  padding: 20px;
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  box-shadow: 10px 5px 5px grey;
  font-family: DFKai-sb;
}
.contenttxt {
  font: 16px normal normal uppercase helvetica, arial, serif;
  color: #7c7873;
  padding: 0px 10px;
  margin: 0 0 10px 0;
  border: 0px solid #f8f8f1;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-box-shadow: inset 0 0 1px #726959;
  -webkit-box-shadow: inset 0 0 1px #b3a895;
  box-shadow: inset 0 0 1px #b3a895;
}
.img-error {
  background-image: url('../assets/Error-bg.png');
  @include size(auto,100%);
  object-fit: cover;
  background-size: cover;
  background-position: 60% bottom;
}
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,calc(-50% - 64px));
  @include flexAlignCenter();
  flex-direction: column;
  width: 100%;
  h1,h3 {
    color: $color-dark;
    font-weight: bold;
    text-align: center;
  }
}
</style>
