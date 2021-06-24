<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <div class="text-center">
        <h1>intro Page</h1>
        <nuxt-link to="/page1">
          go page1
        </nuxt-link>
        <ul>
          <li>user---{{$auth.$state.user}}</li>
           <li>email---{{$auth.$state.user.email}}</li>
            <li>name---{{$auth.$state.user.name}}</li>
        </ul>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "emptynologin",
  middleware: 'auth',
  created() {
    
    // console.log(this.$auth.$state.user);
  },
};
</script>
