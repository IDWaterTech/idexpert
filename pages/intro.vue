<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <div class="text-center">
        <h1>intro Page</h1>
        <nuxt-link to="/page1">
          go page1
        </nuxt-link>
        <table border="1">
          <tr><td>user</td><td>{{$auth.user}}</td></tr>
          <tr><td>email</td><td>{{$auth.user.email}}</td></tr>
          <tr><td>name</td><td>{{$auth.user.name}}</td></tr>

        </table>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "empty",
  middleware: 'auth',
  components: {},
  created() {
    
    console.log(this.$auth.user);
  },
};
</script>
