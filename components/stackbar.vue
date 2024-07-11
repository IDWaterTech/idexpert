<template>
  <div>
    <div style="width: 100%;height: 400px;" ref="mymain"></div>
  </div>
  
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: Array,
      default: function() {
        return [{
          name:'1',
          type: 'bar',
          stack:'bar',
          data:[1]
        }];
      }
    },
    xAxis:{
      type: Array,
      default: function() {
        return [];
      }
    },
    legend: {
      type: Array,
      default: function() {
        return [];
      }
    },
    myColors:{
      type: Array,
      default:function() {
        return ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
      }
    },
    min:{
      type: Number,
      default:null
    },
    max:{
      type: Number,
      default:null
    }
  },
  computed: {
    option: function() {
      var optdata = [];
      optdata.push(this.value);
      let myopt = {
        color:this.myColors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
              data: this.legend,
              left: 20
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [
              {
                  type: 'category',
                  data: this.xAxis,
                  // axisLabel: {
                  //   interval: 0,
                  // }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  min:this.min,
                  max:this.max
              }
          ],
          series: this.value
      };
      return myopt;
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = this.$echarts.init(this.$refs.mymain);
    myChart.setOption(this.option);
  },
  watch: {
    value: {
      // 開合面板循環清單的刪除會跑版 
      handler() {
        this.$nextTick(()=>{
          var myChart = this.$echarts.init(this.$refs.mymain);
          myChart.setOption(this.option);
        })
      },
      deep: true
    },
  }
};
</script>
<style lang="scss" scoped></style>
