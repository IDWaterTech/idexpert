<template>
  <v-container>
    <h1>Register</h1>

    <UserAuthForm buttonText="Login" :submitForm="registerUser" hasName="true" />
  </v-container>
</template>

<script>
  import UserAuthForm from '@/components/UserAuthForm'
  
  export default {
    layout:'empty',
    components: {
      UserAuthForm
    },
    methods: {
      async registerUser(registrationInfo){
          await this.$axios.get('http://localhost:3031/api/user',registrationInfo)
                           .then((res)=>{console.log("res",res);});
            this.$auth.loginWith('local',{data:registrationInfo});
        alert(registrationInfo);
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>