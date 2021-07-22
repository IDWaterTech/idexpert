<template>
  <client-only>
    <div>
      <h2>觀察網影像</h2>
      <span>內嵌：192.168.50.171 公司內網限定</span>
      <hr />
      <!-- <video-player :src="flv" /> -->
      <vue-flv-player
        :autoplay="true"
        :controls="true"
        :muted="true"
        ref="myPlayer"
        :source="flv"
        type="flv"
      />
      <hr />
    </div>
  </client-only>
</template>
<script>
export default {
  layout: "emptynologin",
  data() {
    return {
      // http: "http://192.168.50.171/cgi-bin/mjpg/video.cgi?channel=1&subtype=1",
      flv: "http://localhost:8000/live/STREAM_NAME.flv"
      // rtsp:
      //   "rtsp://admin:dh123456@192.168.50.171:554/cam/realmonitor?channel=1&subtype=1",
      // rtmp: "rtmp://localhost/live/STREAM_NAME",
    };
  }
};
</script>

<style scoped></style>
