<template>
 <div id="app">
    <h2>觀察網影像(開發中)</h2>
    <h3>目前為：HLS模式(iphone推薦)</h3>
    <v-btn :to="'/videoflv'" color="orange" tile>切換為：flv模式</v-btn>
    <v-btn @click="chchanel('171')" color="primary" tile>武曲A1</v-btn>
    <v-btn @click="chchanel('170')" color="primary" tile>武曲A2</v-btn>
    <v-btn @click="chchanel('172')" color="primary" tile>天府C1</v-btn>
    <div id="dplayer"></div>
  </div>
</template>

<script>
export default {
  layout: "emptynologin",
  middleware: "auth",
  head() {
    return {
      title: "myvideo",
      //因為使用layout所以要放nuxt.config.js裡
      // script: [
      //   { src: "../hls.js", body: true },
      //   { src: "../DPlayer.min.js", body: true }
      // ]
      //If you want to add a script tag before closing the </body> instead of <head> tag, you can do it by adding a body: true
    };
  },
  data() {
    return {
      player: undefined,
      // url: `${process.env.apiUrl2}:8443/live/170.flv`,
      url: `${process.env.apiUrl2}:8443/live/170/index.m3u8`,
      type: "hls"
    };
  },
  async created() {
    await this._pageCheck();//驗證頁面是否可檢視
  },
  methods: {
    chchanel: function(data) {
      this.url = `${process.env.apiUrl2}:8443/live/${data}/index.m3u8`;
      // this.player.pause();
      this.player.switchVideo({
        url: this.url
      });
      this.player.play();
    }
  },
  mounted() {
    if (process.browser) {
      //因為要重新整理才抓的到所以加#reloaded來協助重新載入頁面
        if(location.href.indexOf("#reloaded")==-1){
          location.href = location.href+"#reloaded";
          location.reload();
        }
      this.player = new DPlayer({
        container: document.getElementById("dplayer"),
        autoplay: true,
        live: true,
        lang: "zh-tw",
        logo: "./favicon.ico",
        video: {
          url: this.url,
          type: "hls"
       
          // type: "customFlv",
          // customType: {
          //   customFlv: function(video, player) {
          //     const flvPlayer = flvjs.createPlayer(
          //       {
          //         type: 'hls',
          //         url: video.src,
          //         isLive: true
          //       },
          //       {
          //         enableStashBuffer: false,
          //         // fixAudioTimestampGap: false, //打印大量警告 解決辦法 [MSEController] > Failed to execute 'appendBuffer' on 'SourceBuffer': This SourceBuffer has been removed from the parent media source
          //         isLive: true
          //       }
          //     );
          //     flvPlayer.attachMediaElement(video);
          //     flvPlayer.load();
          //   }
          // }
        }
      });
      this.player.play();
    }
  },
  beforeDestroy() {
    this.player.destroy();
  }
};
</script>

<style scoped></style>
