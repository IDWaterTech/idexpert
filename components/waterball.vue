<template>
  <div style="width: 100px;height: 100px;" ref="mymain"></div>
</template>
<script>
import "echarts-liquidfill";
export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  computed: {
    option: function() {
      var optdata = [];
      optdata.push(this.value);
      let myopt = {
        series: [
          {
            radius: '95%',
            type: "liquidFill",
            data: optdata,
            color: ['#4d7ee3'],
            shape: "circle", //'container','circle'圓, 'rect'正方, 'roundRect'圓角正方, 'triangle'三角, 'diamond'菱形, 'pin'地圖標點, 'arrow'箭頭
            label: {
              align: "center",
              baseline: "middle",
              normal:{
                position:['50%','50%'],
                textStyle:{
                    fontSize:20,
                    
                }
            }
            },
            //內框線
            backgroundStyle: {
              show:false,
              borderColor: "#156ACF",
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.4)",
              shadowBlur: 0
            },
            //外框
            outline: {
              // show: false,
              borderDistance: 0,//與內框距
              itemStyle: {
                borderWidth: 3,
                borderColor: '#156ACF',
                shadowBlur: 20,
                 shadowColor: 'rgba(0, 0, 0, 0)'
            }
        },
          }
        ]
      };
      return myopt;
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = this.$echarts.init(this.$refs.mymain);
    myChart.setOption(this.option);
  }
};
</script>
<style lang="stylus" scoped></style>
<style lang="stylus"></style>
