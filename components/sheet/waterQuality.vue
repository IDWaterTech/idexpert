<template>
  <div id="echarts">
    <h2>{{ chartId }}</h2>
    <div id="chartId"></div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "Echarts",
  props: ["chartId"],
  data() {
    return { linedata: [] };
  },
  methods: {
    echartsInit() {
      // 找到容器
      let myChart = this.$echarts.init(document.getElementById("chartId"));
      var option = {
        title: {
          text: "水質"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["nitrite", "ph"],
          formatter:function(name){
            if(name == "nitrite"){return "亞硝酸鹽"}
            if(name == "ph"){return "PH值"}
            return name;
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false
          //data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "nitrite",
            type: "line",
            stack: "tiled",//tiled stack
            data: [
              ["2019-10-10 12:00", 200],
              ["2019-10-11 12:01", 560],
              ["2019-10-11 12:02",],
              ["2019-10-11 12:03", 560],
              ["2019-10-11 12:04", 460]
            ]
          },
          {
            name: "ph",
            type: "line",
            stack: "stack",
            data: [
              ["2019-10-10 12:00", 211],
              ["2019-10-11 12:01", 560],
              ["2019-10-11 12:02", 560],
              ["2019-10-11 12:03", 560],
              ["2019-10-11 12:04", 360]
            ]
          }
        ]
      };
      myChart.setOption(option);
    }
  },
  mounted() {
    this.echartsInit();
  }
};
</script>
<style scoped>
#chartId {
  width: 100%;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
  float: left;
}
</style>
