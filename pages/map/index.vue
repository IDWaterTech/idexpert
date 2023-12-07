<template>
    <div>
      <v-card class="map">
          <!-- <div class="card-title">
              <v-row>
                  <div v-if="nowField==null" class="title">
                      <v-icon>mdi-map-outline</v-icon>
                      <v-card-title>養殖池況</v-card-title>
                  </div>
              </v-row>
          </div> -->
          <mapcontent :auth="$auth.$state.loggedIn" :field="nowField"></mapcontent>
      </v-card>
    </div>
  </template>
  
  <script>
  import mapcontent from "~/pages/map/mapcontent.vue";
  export default {
    layout: 'emptynologin2',
    //   middleware: "auth",
    components: {
      mapcontent
    },
    head(){
        return{
            title:'養殖池況'
        }
    },
    data() {
        return {
            nowField: null
        }
      },
    created() {
        console.log('map url',this.$route.query);
        let reqKey = Object.keys(this.$route.query);
        if(reqKey=='') {
            // this.$toast.success('no query', { duration: 2000 });
            this.nowField = null;
        }else if(reqKey=='field') {
            // this.$toast.success('取得field：'+this.$route.query.field, { duration: 2000 });
            this.nowField = this.$route.query.field;
        }else {
            this.$toast.error(`取得結果：欄位資料有誤`, { duration: 2000 });
            window.location.href='/map'
        }

    }
      
  }
  </script>
  
<style lang="scss">
.v-card.map {
    // padding: 16px;
    min-height: 84vh;
    // overflow-y: scroll;
    margin-bottom: 24px;
    overflow: hidden;
    .card-title {
        padding: 12px 24px;
        padding-bottom: 0;
        // background-color: #006AA6;
        // color: #fefefe;
        .row {
            margin-left: 0;
            margin-top: 0;
        }
        .title {
            display: flex;
            align-items: center;
        }
    }
    .v-card__title {
        color: #00273E;
        font-weight: bold;
    }
    
}
</style>