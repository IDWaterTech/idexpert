<template>
  <client-only>
    <div>
      <h2>觀察網影像-系統開發中(限電腦使用)</h2>
      <h3>系統測試中，手機仍無法查看</h3>
      <!-- <span>位置「武曲A1」：192.168.50.171 測試中</span> -->
      player:「{{ videoUrl }}」<br />
      <v-btn @click="chchanel('171')" color="primary">武曲A1</v-btn>
      <v-btn @click="chchanel('170')" color="primary">武曲A2</v-btn>
      <hr />
      <div id="Player" style="min-height:200px;background-color:black;"><span style="color:white;font-size:1.5em;">請點選影像來源</span></div>
      <hr />
    </div>
  </client-only>
</template>
<script>
export default {
  layout: "emptynologin",
  middleware: "auth",
  mounted() {
    // 实例化播放器
    this.player = new WasmPlayer(
      this.videoUrl,
      "Player" /*, this.callbackfun*/
    );
    // var player = new wasmPlayer(url,ID，callbackFun,{cbUserPtr:this,cfKbs: fn, decodeType:"auto" or "soft", openAudio"1" or "0", BigPlay"true" or "false", Height:" true" or "false, HideKbs:" true" or "false});
    // 调用播放
    this.player.destroy();
    this.player.play(this.videoUrl, 1);
  },
  data() {
    return {
      aspect: "16:9", //宽高比
      fluent: true, //流畅模式
      autoplay: true,
      player: undefined,
      videoUrl: "https://61.56.172.10:8443/live/171.flv"
    };
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

<style scoped></style>
