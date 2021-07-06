<template>
  <div>
    <v-row>
      <v-col
        cols="2"
        v-for="(item, idx) in link"
        :key="idx"
        @click="$nuxt.$router.push(`${item.to}`)"
      >
        <v-container fill-height>
          <v-layout align-center>
            <v-flex
              class="text-center"
              :style="`background-color:${item.color}`"
            >
              <v-row>
                <v-col cols="12">
                  <v-icon size="100" color="white">
                    {{ item.icon }}
                  </v-icon>
                </v-col>
              </v-row>
              <h2>
                <span style="color:white;">{{ item.title }}</span>
              </h2>
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
          icon: "mdi-cog-box",
          title: "狀態設定",
          to: "/map/setting",
          color: "grey"
        },
        {
          icon: "mdi-flare",
          title: "武曲",
          to: "/map/wc",
          color: "#26c6da"
        },
        {
          icon: "mdi-square-circle",
          title: "天府",
          to: "/map/tf",
          color: "#1DE9B6"
        },
        {
          icon: "mdi-octagram-outline",
          title: "紫微",
          to: "/map/zw",
          color: "#E040FB"
        }
      ]
    };
  }
};
</script>

<style scoped></style>
