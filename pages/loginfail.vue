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
            <v-btn class="btn-primary mt-6" @click="toHomePage()">
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
