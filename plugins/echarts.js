import Vue from "vue";
import echarts from "echarts"; // 引入echarts 4 的寫法
//import * as echarts from "echarts";// 引入echarts 5 的寫法
Vue.prototype.$echarts = echarts; // 引入组件（将echarts注册为全局）
