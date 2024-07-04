<template>
  <v-app dark class="adjust-height">
    <v-card class="bg-card">
      <div class="img-error"></div>
      <div class="content" style="width: 100%;">
        <div class="bg404">{{ error.statusCode }}</div>
        <div v-if="error.statusCode === 404" class="not-found">
          <h1>
            {{ pageNotFound }}
          </h1>
          <h3>迷路了？似乎沒有此頁面</h3>
        </div>
        <div v-else class="other-error">
          <h1>
            {{ otherError }}
          </h1>
          <h3>似乎有東西出錯了! 請返回首頁</h3>
        </div>
        
        <v-btn class="btn-primary" @click="toHomePage()" style="margin-top: 24px;">
            返回首頁
        </v-btn>
        
      </div>
    </v-card>
    
  </v-app>
</template>

<script>
export default {
  layout: 'emptynologin2',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  methods: {
    toHomePage() {
      window.location.href='/';
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style lang="scss" scoped>
#app{
  background-color: transparent !important;
  height: 100%;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,calc(-50% - 64px));
  @include flexAlignCenter();
  flex-direction: column;
}
.img-error {
  background-image: url('../assets/Error-bg.png');
  @include size(auto,100%);
  object-fit: cover;
  background-size: cover;
  background-position: 60% bottom;
}
.bg404 {
  font-size: 280px;
  font-weight: bold;
  @include positionCenter();
  color: rgba($color-primary-25,0.2);
  z-index: -1;
}
.not-found,.other-error {
  text-align: center;
  h1,h3 {
    color: $color-dark;
    font-weight: bold;
  }
  
}
::v-deep .v-application--wrap {
  min-height: fit-content;
}
@media (max-width: 768px) {
  .bg404 {
    font-size: 240px;
  }
}
@media (max-width: 425px) {
  .bg404 {
    font-size: 200px;
  }
}
/* h1 {
  font-size: 20px;
} */
</style>
