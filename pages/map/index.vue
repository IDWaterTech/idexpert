<template>
  <div>
    <v-row>
      <!-- <v-col
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
      </v-col> -->
      <v-col cols="12">
        <v-tabs v-model="currenttab" background-color="">
          <v-tab
            v-for="(tab, idx) in link"
            :key="idx"
            :href="`#` + tab.title"
            class="title"
          >
            <v-icon left> {{ tab.icon }} </v-icon>{{ tab.title }}
          </v-tab>
          <v-tab-item v-for="(tab, idx) in link" :key="idx" :value="tab.title">
            <!-- <v-overlay :value="waterloading" :absolute="true">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay> -->
            <v-icon @click="mapshowedit = !mapshowedit">mdi-pencil</v-icon>
            <wc v-if="tab.title == '武曲'" :key="cmpkey.wc" :showedit="mapshowedit"></wc>
            <tf v-if="tab.title == '天府'" :key="cmpkey.tf" :showedit="mapshowedit"></tf>
            <zw v-if="tab.title == '紫微'" :key="cmpkey.zw" :showedit="mapshowedit"></zw>
            <setting
              v-if="tab.title == '狀態設定'"
              @update="settingUpdated"
            ></setting>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import wc from "@/pages/map/wc.vue";
import tf from "@/pages/map/tf.vue";
import zw from "@/pages/map/zw.vue";
import setting from "@/pages/map/setting.vue";
export default {
  layout: "emptynologin",
  middleware: "auth",
  components: {
    wc,
    tf,
    zw,
    setting
  },
  data() {
    return {
      mapshowedit:false,
      link: [
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
        },
        {
          icon: "mdi-cog-box",
          title: "狀態設定",
          to: "/map/setting",
          color: "grey"
        }
      ],
      currenttab: "武曲",
      cmpkey:{wc:0,tf:0,zw:0}
    };
  },
  methods: {
    settingUpdated: function(data) {
      // console.log(data); //強迫更新元件用
      this.cmpkey.wc += 1;
      this.cmpkey.tf += 1;
      this.cmpkey.zw += 1;
    }
  }
};
</script>

<style scoped></style>
