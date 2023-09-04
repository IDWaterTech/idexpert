<template>
    <div>
      <v-card class="map">
          <div class="card-title">
              <v-row>
                  <div class="title">
                      <v-icon>mdi-map-outline</v-icon>
                      <v-card-title>養殖池況</v-card-title>
                  </div>
              </v-row>
          </div>
          <mapcontent :auth="$auth.$state.loggedIn"></mapcontent>
      </v-card>
    </div>
  </template>
  
  <script>
  import mapcontent from "~/pages/map/mapcontent.vue";
  export default {
      layout: 'emptynologin',
    //   middleware: "auth",
      components: {
        mapcontent
      },
      data() {
          return {
              
          }
      },
      
  }
  </script>
  
  <style lang="scss">
      .v-card.map {
          // padding: 16px;
          min-height: 80vh;
          // overflow-y: scroll;
          overflow: hidden;
          .card-title {
              padding: 12px 24px;
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
      
      
      // scrollbar
      ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
      }
      ::-webkit-scrollbar-track {
          background: none; 
      }
      ::-webkit-scrollbar-thumb {
          background-color: #BFD9E8;
      }
      // ::-webkit-scrollbar-button {
      //     border-radius: 4px;
      //     background: transparent;
      // }
  </style>