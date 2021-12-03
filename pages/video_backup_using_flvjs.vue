<template>
  <client-only>
    <div>
      <h2>觀察網影像-系統開發中(限電腦使用)-先保留放著不用，vue-flv-player元件先刪除</h2>
      <h3>系統測試中，手機仍無法查看</h3>
      <!-- <span>位置「武曲A1」：192.168.50.171 測試中</span> -->
      player:「{{ videourl }}」<br />
      <v-btn @click="chchanel('171')" color="primary">武曲A1</v-btn>
      <v-btn @click="chchanel('170')" color="primary">武曲A2</v-btn>
      <hr />
      <!-- <video-player :src="flv" /> -->
      <vue-flv-player
        :autoplay="true"
        :controls="true"
        :muted="true"
        ref="myPlayer"
        :source="videourl"
        type="flv"
      />
      <hr />
    </div>
  </client-only>
</template>
<script>
export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
    return {
      player: "",
      // http: "http://192.168.50.171/cgi-bin/mjpg/video.cgi?channel=1&subtype=1",
      // flv: "http://localhost:8000/live/STREAM_NAME.flv"
      // flv: "${this.$store.state.mydata.gobal_api.apiVideo8443}/live/171.flv"
      // al: "${this.$store.state.mydata.gobal_api.apiVideo8443}/live/171.flv",
      // a2: "${this.$store.state.mydata.gobal_api.apiVideo8443}/live/170.flv"
      videourl: `${this.$store.state.mydata.gobal_api.apiVideo8443}/live/171.flv`
      // rtsp:
      //   "rtsp://admin:dh123456@192.168.50.171:554/cam/realmonitor?channel=1&subtype=1",
      // rtmp: "rtmp://localhost/live/STREAM_NAME",
    };
  },
  methods: {
    chchanel: function(data) {
      this.videourl = `${this.$store.state.mydata.gobal_api.apiVideo8443}/live/${data}.flv`;
    }
  }
};
</script>

<style scoped></style>
