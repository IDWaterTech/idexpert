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
    <v-col>
      <v-btn @click="btnck">click</v-btn>
       <!-- <v-btn @click="()=>{this.$store.commit('mydata/set_listitems', 'internal')}">click</v-btn> -->
       <v-btn @click="setItem('internal')">click in</v-btn>
       <v-btn @click="setItem('external')">click ex</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "emptynologin",
  middleware: 'auth',
  created() {
  },
  methods: {
    btnck:function(){

      console.log("store api:",this.$store.state.mydata.gobal_api.apiUrl);

    },
    setItem(data){
        this.setSite(data);
    }
  },
};
</script>
