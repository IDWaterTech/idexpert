<template>
  <div id="app">
    <h2>觀察網影像-系統開發中(限電腦使用)</h2>
    <h3>系統測試中，手機仍無法查看</h3>
    <v-btn @click="chchanel('171')" color="primary">武曲A1</v-btn>
    <v-btn @click="chchanel('170')" color="primary">武曲A2</v-btn>
    <div id="Player" style="min-height:200px;background-color:black;">
      <span style="color:white;font-size:1.5em;">請點選影像來源</span>
    </div>
  </div>
</template>
<script>
export default {
  layout: "emptynologin",
  middleware: "auth",
  // head() {
  //   return {
  //     title: "myvideo",
  //     script: [{ src: "../EasyWasmPlayer.js" }]
  //   };
  // },
  //因為綁了LAYOUT所以無法在此加入EASYWASMPLAYER
  data() {
    return {
      aspect: "16:9", //宽高比
      fluent: true, //流畅模式
      autoplay: true,
      player: undefined,
      videoUrl: "https://61.56.172.10:8443/live/171.flv"
    };
  },
  mounted() {
    this.player = new WasmPlayer(
      this.videoUrl,
      "Player" /*, this.callbackfun*/,
      // this.callbackfun
      // {BigPlay:true}
    );
    // var player = new wasmPlayer(url,ID，callbackFun,{cbUserPtr:this,cfKbs: fn, decodeType:"auto" or "soft", openAudio"1" or "0", BigPlay"true" or "false", Height:" true" or "false, HideKbs:" true" or "false});
    // 调用播放
    // this.player.destroy();
    this.player.play(this.videoUrl, 1);
  },
  methods: {
    callbackfun(e) {
      console.log("callbackfun", e);
    },
    chchanel: function(data) {
      this.player.destroy();
      this.videoUrl = `https://61.56.172.10:8443/live/${data}.flv`;
      console.log(this.videoUrl);
      this.player = new WasmPlayer(null, "Player", this.callbackfun);
      //(0：默认，1：自动播放)
      this.player.play(this.videoUrl, 1);
    }
  },
  beforeDestroy() {
    this.player.destroy();
  }
};
</script>
