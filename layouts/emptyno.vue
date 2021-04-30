<template>
  <v-app dark>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  beforeCreate() {//登入時判別身份分別導頁
        if (this.$auth.loggedIn) {
          if (this.$auth.state.user.email=="109085@w.tmu.edu.tw") {
                  this.$router.push({ path: 'page1' });
              }else{
                 //this.$router.push({ path: 'intro' });
              }
        }
  },
  data() {
    return {
    
    };
  }
};
</script>
