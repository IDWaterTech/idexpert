import VCharts from "v-charts-v2";
import Vue from "vue";
//解決 TypeError: Cannot read properties of undefined (reading 'map')
Vue._watchers = Vue.prototype._watchers = [];
Vue.use(VCharts);//全域註冊使用 echart5以上不能使用
