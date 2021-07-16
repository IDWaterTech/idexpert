<template>
  <div>
    <h2>觀察網影像</h2>
    <span>內嵌：192.168.50.171 公司內網限定</span>
    <embed type="text/html" src="http://192.168.50.171/cgi-bin/mjpg/video.cgi?channel=1&subtype=1" width="100%" height="600" />
  </div>
</template>

<script>
export default {
  layout: "emptynologin",
  data() {
    return {
      id: "1",
      rtsp:
        "rtsp://admin:dh123456@192.168.50.171:554/cam/realmonitor?channel=1&subtype=1",
      player: null
    };
  }
};
</script>

<style scoped></style>
