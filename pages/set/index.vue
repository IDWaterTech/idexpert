<template>
  <div>
    <!-- <NuxtLink to="/set/account">
      帳號管理
    </NuxtLink>
    <NuxtLink to="/set/account">
      授權管理
    </NuxtLink> -->
    <v-row>
      <v-col cols="2" v-for="(item, idx) in link" :key="idx" @click="$nuxt.$router.push(`${item.to}`)">
        <v-container fill-height>
          <v-layout align-center>
            <v-flex class="text-center" :style="`background-color:${item.color}`">
              <v-row>
                <v-col cols="12">
                  <v-icon size="100" color="white">
                    {{ item.icon }}
                  </v-icon>
                </v-col>
              </v-row>
              <h2><span style="color:white;">{{ item.title }}</span></h2>
            </v-flex>
          </v-layout>
        </v-container>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
export default {
  layout: "emptynologin",
  data() {
    return {
      link: [
        {
          icon: "mdi-account-edit",
          title: "帳號管理",
          to: "/set/account",
          color: "#26c6da"
        },
        {
          icon: "mdi-account-key",
          title: "授權管理",
          to: "/set/authorization",
          color: "#FF80AB"
        },
        {
          icon: "mdi-monitor-dashboard",
          title: "監測設定",
          to: "/set/mointor",
          color: "#EA80FC"
        }
      ]
    };
  }
};
</script>

<style scoped></style>
