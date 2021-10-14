<template>
  <div>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="8">
        <v-card tile >
          <v-card-title style="background-color:#64B5F6;color:white;"
            >個人設定</v-card-title
          >
          <v-card-text class="pt-2 pb-10">
            <v-subheader><v-icon class="mx-2">mdi-account-circle-outline</v-icon>個人資訊</v-subheader
            ><v-divider class="mb-2"></v-divider>
            <v-row>
              <!-- <v-col cols="12" sm="2" align-self="center" class="text-center" style="font-size:2em">
                    使用者
                  </v-col> -->
              <v-spacer></v-spacer>
              <v-col
                cols="12"
                sm="8"
                align-self="center"
                class="text-center title"
              >
                <h3>{{ $auth.$state.user.name }}</h3>
                {{ $auth.$state.user.email }}
              </v-col>
              <v-col cols="12" sm="2" align-self="center">
                <v-avatar color="primary" size="76"
                  ><v-img :src="this.$auth.$state.user.picture"></v-img
                ></v-avatar>
              </v-col>
            </v-row>
            <v-subheader><v-icon class="mx-2">mdi-bell-circle-outline</v-icon>接收通知</v-subheader
            ><v-divider class="mb-2"></v-divider>
            <v-row>
              <v-spacer></v-spacer>
              <v-col
                cols="12"
                sm="8"
                align-self="center"
                class="text-left title"
              >
                <v-icon color="#EA4335" class="mr-2">mdi-gmail</v-icon>Mail
                <el-switch
                  active-color="#13ce66"
                  inactive-color="#eee"
                  @change="statchange()"
                ></el-switch
                ><br />
                <v-icon color="#00B900" class="mr-2">mdi-alpha-l-circle-outline</v-icon>Line
                <el-switch
                  active-color="#13ce66"
                  inactive-color="#eee"
                  @change="statchange()"
                ></el-switch>
              </v-col>
              <v-col cols="12" sm="2" align-self="center"> </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
      return {
          
      }
  },
  methods: {
      statchange:function() {
          return;
          }
  },
};
</script>

<style scoped>
.v-subheader{
    font-size: 1.5em;
}
</style>
