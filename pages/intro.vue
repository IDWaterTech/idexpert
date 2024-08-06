<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <div class="text-center">
        <h1>intro Page</h1>
        <nuxt-link to="/page1">
          go page1
        </nuxt-link>
        <!-- <ul>
          <li>user---{{$auth.$state.user}}</li>
           <li>email---{{$auth.$state.user.email}}</li>
            <li>name---{{$auth.$state.user.name}}</li>
           
        </ul> -->
      </div>
    </v-col>
    <v-col>
      <v-btn @click="btnck">click</v-btn>
       <!-- <v-btn @click="()=>{this.$store.commit('mydata/set_listitems', 'internal')}">click</v-btn> -->
       <v-btn @click="setItem('internal')">click in</v-btn>
       <v-btn @click="setItem('external')">click ex</v-btn>
       <v-btn @click="getPrice">get Price</v-btn>
    </v-col>
    <v-col>
      {{priceData}}
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "emptynologin",
  // middleware: 'auth',
  created() {
  },
  data() {
    return {
      priceData:[]
    }
  },
  methods: {
    btnck:function(){

      console.log("store api:",this.$store.state.mydata.gobal_api.apiUrl);

    },
    setItem(data){
        this.setSite(data);
    },
    getPrice:async function(){
      //${this.$store.state.mydata.gobal_api.apiUrl}
      await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiIIS82}/idapi.asmx/getAquaticTransData`)
      .then(res => {
      this.priceData = res.data;
    });
    }
  },
  mounted() {
    console.log("internal",process.env.internal);
    console.log("NODE_ENV",process.env.NODE_ENV);
    console.log("apiUrl",process.env.apiUrl);//猜測會被複蓋
    console.log("NUXT_ENV_API",process.env.NUXT_ENV_API);
    console.log("NUXT_ENV_ME",process.env.NUXT_ENV_ME);
  },
};
</script>
