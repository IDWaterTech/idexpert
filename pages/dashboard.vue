<template>
  <div class="basic">
    <v-overlay :value="!showAlert" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card class="bg-card mb-4">
      <div class="content pl-0 pt-3 pb-0">
        <!-- 搜尋 -->
        <div class="search">
          <v-row class="mb-1 align-center">
            <!-- 選擇場區 -->
            <v-col cols="12" md="4" sm="4" style="position: relative;">
              <locate-select class="select-template mr-0" :dataScope="'area'" :defaultSelect="defaultPool" :isMulti="false"
                @scopeSel_data="get_scopeData($event);resultListOpen=true;"></locate-select>
            </v-col>
            <v-col cols="12" md="2" sm="2" style="position: relative;">
              <v-select v-model="timeSelect" @change="getWaterData()" dense filled hide-details :items="timekb"
                item-text="name_ch" item-value="id" class="time-select"></v-select>
            </v-col>
            <v-col cols="12" md="2" sm="2" style="position: relative;">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <button class="btn-icon just-icon" @click="areachange()/*改 視為整頁資料重整 */" v-bind="attrs" v-on="on">
                    <!-- <button class="btn-icon just-icon" @click="getWaterData()" v-bind="attrs" v-on="on"></button> -->
                    <v-icon style="font-size: 24px;">mdi-reload</v-icon>
                  </button>
                </template>
                <span>重新整理</span>
              </v-tooltip>
            </v-col>
            <v-col v-if="false && sel_main&&windowWidth<959.98" cols="12" md="3" align-self="center">
              <button
               class="flex-align-center mt-n1 text-left" icon @click="showmpFun" v-if="sel_main&&windowWidth<959.98" slot="prepend"
                style="font-size: 0.85rem;color: #6c9bcd;">
                <v-icon size="1rem" style="color: #6c9bcd;">mdi-image</v-icon>查看場布局圖
              </button>
            </v-col>
          </v-row>
        </div>
        <div class="result">
          <div class="result-card">
            <!-- 按鈕列 -->
            <v-row class="mb-1">
              <v-col v-for="(btn,index) in btns" :key="btn.text" cols="6" sm="4" md="2" class="py-1">
                <v-btn outlined :color="btn.param?.color || 'indigo'" block @click="handleClick(btn)">
                  {{ index + 1 }}. {{ btn.text }}
                </v-btn>
              </v-col>
            </v-row>
            <!-- 養殖池 -->
            <v-row class="mb-3 align-stretch" style="height: 100%;" id="chart">
              <!-- 養殖池 -->
              <v-col cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">養殖池資訊</span>
                        <!-- 隱藏空池 -->
                        <v-checkbox v-if="false" v-model="isHideEmpty" class="mr-2" color="green" value="空池"
                          hide-details><span style="color:green;" slot="label">隱藏空池</span></v-checkbox>
                        <!-- 欄位顯示設定 -->
                        <v-btn color="primary" @click="ColumnDialog = true">欄位</v-btn>
                      </v-card-title>
                    </div>
                    <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                  </div>
                  <div v-if="resultListOpen" class="content">
                    <v-row class="mb-4">
                      <v-col cols="12">
                        <!-- 主要中央顯示 -->
                        <el-table :data="DashboardData" v-loading="tableloading" border stripe size="mini" class="dashboard-table">
                          <template v-for="header in headersDashboard">

                            <el-table-column v-if="header.show" :key="header.value" :prop="header.value"
                              :label="header.text" :fixed="header.fixed" :width="header.width" :align="header.align" />

                          </template>

                        </el-table>
                        
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>

            </v-row>
            <!-- 下方水質地圖 -->
            <v-row class="mb-0">
              <v-col cols="12" class="pt-0">
                <v-card class="result-card water">
                  <div class="content">
                    <div class="header-bar water-bar px-0 py-3 pt-1">
                      <v-tabs v-model="currenttab" show-arrows>
                        <v-tab v-for="(tab, idx) in tabsMap" :key="'tabs-'+idx" :href="`#` + tab.name">
                          {{ tab.name }}
                        </v-tab>
                      </v-tabs>
                    </div>
                    <poollayout v-if="sel_main!==''&&sel_area!==''" class="poollayout" :water="water"
                      :waterloading="waterloading" :areas="[]" :layout="[]" :nowAreaTag="nowAreaTag" :successData="[]"
                      :setting="''" :nowAreaId="nowAreaId" :showedit="false" :statcolor="statcolor"
                      @goIndicator="goIndicator($event)"></poollayout>
                    <span v-else class="text-center d-block full-width"
                      style="color: #999;line-height: 16vh;">暫無資料</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <!-- dialog -->
            <v-dialog v-model="dialog.show" :width="dialog.width" v-if="dialog.show">
              <!-- 根據 is 屬性的值，動態決定要渲染哪個元件 -->
               <v-card>
                 <component :is="dialog.component" v-if="dialog.component" :passArea="dialog.param?.passArea" @closeDialog="handleEmit('closeDialog',$event)" />
                 <v-card-text v-else class="text-center text-h5 pt-6">系統開發中</v-card-text>
               </v-card>
            </v-dialog>
            <!-- 欄位顯示設定 -->
            <v-dialog v-model="ColumnDialog" :width="500">
              <v-card dense>
                <v-card-title>
                  欄位顯示設定
                </v-card-title>
                <v-divider></v-divider>

                <v-card-text class="pt-4">
                  <v-row dense>
                    <v-col v-for="header in headersDashboard" :key="header.value" cols="6">
                      <v-checkbox v-model="header.show" :label="header.text" dense hide-details
                        :disabled="header.value === 'pond_id'"></v-checkbox>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

            </v-dialog>
          </div>
        </div>
      </div>
    </v-card>
    <v-overlay v-if="showmp && sel_main" :absolute="showmp" :value="showmp"
      class="custom-overlay px-6 py-6">
      <img v-img :src="mpurl" width="100%" class="grey lighten-2" />
      <v-icon @click="showmp = false" style="background-color: rgba(0,0,0,0.25);border-radius: 4px;">mdi-close</v-icon>
    </v-overlay>
  </div>
</template>

<script>
import _ from "lodash";
// import WaterQuality_Vcharts2 from "@/components/sheet/waterQuality_vcharts2";
import dayjs from "dayjs";
import poollayout from "@/pages/map/poolslayout.vue";
import nerdamer from 'nerdamer';
//-----
import "element-ui/lib/theme-chalk/index.css";
export default {
  layout: "emptynologin2",
  middleware: "auth",
  components: {
    // WaterQuality_Vcharts2,
    poollayout
  },
  head(){
    return{
      title:'操作面板'
    }
  },
  data() {
    return {
      ColumnDialog:false,
      isHideEmpty:"空池",//養殖池資訊 是否隱藏空池，直接用文字判斷狀態(因為資料是用空池)
      sel_main: "",
      sel_area: "",
      tabsMap: [
        { name: "溶氧濃度" },
        { name: "酸鹼值" },
        { name: "亞硝酸鹽濃度" },
        { name: "氨氮濃度" },
        { name: "水溫" },
        { name: "水位" }
        // { name: "投餵益生菌" }  pbio目前沒有先拿掉
      ],
      currenttab: "",
      maindata: [],
      mainpool: {
        id: 1,
        name: "A1",
        items: [
          // { name: "體積", item: "volume", value: 140.0, unit: "噸" },
        ]
      },
      headersDashboard: [
        {
          text: "養殖池",
          value: "pond_id",
          show: false,
          fixed: "left",
          width: 90,
          align: "center"
        },
        {
          text: "養殖池名稱",
          value: "pond_name",
          show: true,
          fixed: "left",
          width: 100,
          align: "left"
        },
        {
          text: "最近測得水位(%)",
          value: "water_level_pct",
          show: true,
          fixed: false,
          width: 140,
          align: "right"
        },
        {
          text: "實際水深(m)",
          value: "actual_water_depth",
          show: true,
          fixed: false,
          width: 120,
          align: "right"
        },
        {
          text: "實際水體(ton)",
          value: "actual_water_body",
          show: true,
          fixed: false,
          width: 130,
          align: "right"
        },
        {
          text: "放苗日",
          value: "stocked_date",
          show: true,
          fixed: false,
          width: 120,
          align: "center"
        },
        {
          text: "最近收成日",
          value: "harvest_date",
          show: true,
          fixed: false,
          width: 120,
          align: "center"
        },
        {
          text: "放苗袋數",
          value: "seedling_bags",
          show: true,
          fixed: false,
          width: 100,
          align: "right"
        },
        {
          text: "每袋苗數",
          value: "num_per_bag",
          show: true,
          fixed: false,
          width: 100,
          align: "right"
        },
        {
          text: "放苗總量",
          value: "stocking_qty",
          show: true,
          fixed: false,
          width: 120,
          align: "right"
        },
        {
          text: "最近打樣平均蝦重(g)",
          value: "last_shrimp_weight_avg",
          show: true,
          fixed: false,
          width: 160,
          align: "right"
        },
        {
          text: "每日增重量(g/day)",
          value: "adg",
          show: true,
          fixed: false,
          width: 150,
          align: "right"
        },
        {
          text: "預估今日蝦重(g)",
          value: "shrimp_weight",
          show: true,
          fixed: false,
          width: 140,
          align: "right"
        },
        {
          text: "校正投餵水溫(%)",
          value: "temp_based_feed_reduction_rate",
          show: true,
          fixed: false,
          width: 150,
          align: "right"
        },
        {
          text: "內存量(kg)",
          value: "biomass",
          show: true,
          fixed: false,
          width: 120,
          align: "right"
        },
        {
          text: "育成率(%)",
          value: "survival_rate",
          show: true,
          fixed: false,
          width: 100,
          align: "right"
        },
        {
          text: "乘載量",
          value: "carrying_capacity",
          show: true,
          fixed: false,
          width: 100,
          align: "right"
        },
        {
          text: "換肉率",
          value: "fcr",
          show: true,
          fixed: false,
          width: 100,
          align: "right"
        },
        {
          text: "總投餵飼料量(g)",
          value: "cumulative_feed_amount",
          show: true,
          fixed: false,
          width: 160,
          align: "right"
        },
        {
          text: "收成量(kg)",
          value: "harvest_yield_kg",
          show: true,
          fixed: false,
          width: 120,
          align: "right"
        },
        {
          text: "收成量(tkg)",
          value: "harvest_yield_tkg",
          show: true,
          fixed: false,
          width: 120,
          align: "right"
        },
        {
          text: "收成尾斤數(p/tkg)",
          value: "harvest_yield_ptkg",
          show: true,
          fixed: false,
          width: 150,
          align: "right"
        },
        {
          text: "收成平均蝦重(g)",
          value: "harvest_shrimp_weight_avg",
          show: true,
          fixed: false,
          width: 160,
          align: "right"
        }
      ],
      selectedDashboardColumns:[],
      DashboardData:[],
      //---
      tableloading: false,
      //---圖片(地圖)
      showmp: false,
      //投餵
      // feeddatacols: {}, //欄位
      feedloading: false, //是否載入中
      feeddata: [], //資料
      //環境
      // envdatacols: {}, //欄位
      envloading: false, //是否載入中
      envdata: [], //資料
      //飼料觀察網
      // obsdatacols: {}, //欄位
      obsloading: false, //是否載入中
      obsdata: [], //資料
      //進階值
      // advdatacols: {}, //欄位
      advloading: false, //是否載入中
      advdata: [], //資料
      //益生菌
      // pbiodatacols: {}, //欄位
      pbioloading: false, //是否載入中
      pbiodata: [], //資料
      //養殖用料
      materialloading: false,
      materialdata: [],
      // 3張card
      total: {
        pool: 0, // 養殖池
        pond: 0, // 小池
        predict: 0, // 預估放養
        warning: 0,//警示
      },
      resultListOpen: true,
      windowWidth: window.innerWidth,
      defaultPool: undefined,
      showAlert: true,
      // 水質地圖
      statcolor: [
        // { name_ch: "無", color: "#fff", id: 1 },
        // { name_ch: "default", color: "#00273E" },
        // { name_ch: "放養中", color: "#F1E78D", id: 4 },
        // { name_ch: "放養中(鎖排汙)", color: "#CBAAE5", id: 32 },
        // { name_ch: " 集中暫養", color: "#8DA0E5", id: 31 },
        // { name_ch: "尚未洗池", color: "#E8DDBF", id: 6 },
        // { name_ch: "已清洗", color: "#A8E6DB", id: 7 },
        // { name_ch: "蓄水中", color: "#D3B280", id: 8 },
        // { name_ch: "蓄水完畢", color: "#A5D380", id: 9 },
        // { name_ch: "消毒中", color: "#80D3AB", id: 10 },
        // { name_ch: "做水中", color: "#C5E8E6", id: 11 },
        // { name_ch: "預備放苗", color: "#83C9F0", id: 12 },
        // { name_ch: "空池", color: "#BFDAE8", id: 3 },
        // { name_ch: "養殖審核", color: "#D3808F", id: 33 }
      ],
      nowAreaId:{
        factory_id: null,
        pond_area_id: null,
        range:null
      },
      nowAreaTag:'',
      water: [],
      waterParm:[],
      waterloading:false,
      lightData:[],
      timekb:[
        {id:3,name_ch:'24小時內最新數據',value:1440},
        {id:0,name_ch:'5分鐘內最新數據',value:5},
        {id:1,name_ch:'30分鐘內最新數據',value:30},
        {id:2,name_ch:'8小時內最新數據',value:480},
      ],
      timeSelect:0,
      nowClickRow:'',
      originData:[],
      colData:[],
      //----------------------
      btns: [
      { text: '重要記事 +', type: 'calendarForm',width:"500px" },
      { text: '飼料設定 +', type: 'feedOrder',width:'' },
      { text: '添加物設定 +', type: 'indicatorForm',width:'500px' },
      { text: '檢驗檢測 +', type: 'inspectReport',width:'500px' },
      { text: '觀察網 +', type: 'observeForm',width:'500px' },
      { text: '收成資料 +', type: 'harvestForm',width:'500px' ,param:{passArea:''}},//harvest
      {text: '警告訊息', type: 'alertForm',width:'500px' ,param:{passArea:'',color:'red'}},
    ],
    dialog:{show:false,component:'calendar',width:"500px"},
    //----------------------重要紀事
    
    };
  },
  methods: {
    onReady: function (instance,CountUp) {
      const that = this;
      // console.log(instance.el,CountUp);
      if(instance.el == document.getElementById('num3')) {
        that.endVal = this.total.predict;
      }else if(instance.el == document.getElementById('num2')) {
        that.endVal = this.total.pond;
      }else if(instance.el == document.getElementById('num1')) {
        that.endVal = this.total.pool;
      }else if(instance.el == document.getElementById('num4')) {
        that.endVal = this.total.warning;
      }
      // that.endVal = this.total.predict;
      instance.update(that.endVal);
      // instance.update(that.endVal);
    },
    // 池況顏色
    async getStateColor() {
      //取得池況顏色設定
      let getPondStateList = await this.getPondStateList();
      let data = typeof (getPondStateList)=='string'?[]:getPondStateList;
      this.statcolor = data;
    },
    get_scopeData:async function(evt){
      console.log('get_scopeData-evt:',evt);//紫微_10026
      console.log('get_scopeData-maindata:',this.maindata);
      if(evt) {
        let areaName='';
        this.sel_area = evt.split('_')[evt.split('_').length-1];//10026
        this.dialog.param = {passArea:evt};//紫微_10026
        if(evt.split('_').length>2) {
          for(let i=0;i<evt.split('_').length-1;i++) {
            areaName += evt.split('_')[i];
          }
        }else {
          areaName = evt.split('_')[0];
        }
        this.maindata.forEach(f=>{
          f.node.forEach(a=>{
            if(a.id==this.sel_area && a.name == areaName) {
              this.sel_main = f.id;
              this.nowAreaTag = a.area_no;
            }
          })
        })
        this.nowAreaId={
          factory_id: this.sel_main,
          pond_area_id: this.sel_area
        }
        this.showAlert = false;
        await this.getWaterWarn();//取得警戒範圍 與下方areachage有前後關係 一定要先取得警戒範圍再去設定顯示文字
        this.areachange();
      }
    },
    //取得養殖池資料
    getPondDashboard:async function(pond_area_id){
      this.DashboardData = [];
      let params = {
        pond_area_id:pond_area_id
      }
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/v3/pond-dashboard/`;
      await this.$axios.get(url, { params }).then((res) => {
        if (res.status == 200) {
          this.DashboardData = res.data;
        } else {
          this.$toast.error(`取得總失敗:${res.data.messages.join()}`);
          console.error(`取得總表失敗:`, error);
        }
      }).catch((error) => {
        this.$toast.error(`取得總失敗:${error}`);
        console.error(`取得總表失敗:`, error);
      });
    },
    areachange: async function () {
      console.log('trigger areachange.');
      var para = {
        id: this.sel_area
      };
      if (this.sel_area) {
        this.tableloading = true;
        
        this.getPondDashboard(this.sel_area);

        let getPondDataList = await this.getPondDataList(para);// plugins\service\basic.js
        let data = typeof (getPondDataList)=='string'?[]:getPondDataList;
        this.mainpool.items = _.cloneDeep(data);
        this.mainpool.items.forEach(x=>{
          x.current_stock_num = x.current_stock_num==null?x.current_stock_num:(parseFloat(x.current_stock_num).toFixed(2));
        })
        this.originData = _.cloneDeep(this.mainpool.items);
        // await this.getWaterData();
        let nowTab = ''
        switch (this.currenttab) {
          case "亞硝酸鹽濃度":
            nowTab = 'NO2';
            break;
          case "氨氮濃度":
            nowTab = 'NH4';
            break;
          case "溶氧濃度":
            nowTab = 'DO';
            break;
          case "酸鹼值":
            nowTab = 'pH';
            break;
          case "水溫":
            nowTab = 'Temperature';
            break;
          case "水位":
            nowTab = 'water_level_percentage';
            break;
          default:
            break;
        }
        this.nowAreaId.range = this.lightData[nowTab];
        console.log('range',this.nowAreaId.range,this.lightData)
        this.getWaterData();
        // this.getAlertNum();
        setTimeout(()=>{
          if(document.getElementsByClassName('el-table__body-wrapper')) {
            document.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0;
          }
        },100)
        this.tableloading = false;
       
      } else {
        this.mainpool.items = [];
      }
    },
    showmpFun: function () {
      this.showmp = !this.showmp;
    },
    showpool: function (data) {
      console.log(data.name);
    },
    // 取得時間範圍內最新的資料 
    async getWaterData() {
      console.log('trigger getWaterData.');
      if (this.sel_main && this.sel_area) {
        this.showAlert = false;
        let nowTab = ''
        switch (this.currenttab) {
          case "亞硝酸鹽濃度":
            nowTab = 'NO2';
            break;
          case "氨氮濃度":
            nowTab = 'NH4';
            break;
          case "溶氧濃度":
            nowTab = 'DO';
            break;
          case "酸鹼值":
            nowTab = 'pH';
            break;
          case "水溫":
            nowTab = 'Temperature';
            break;
          case "水位":
            nowTab = 'water_level_percentage';
            break;
          default:
            break;
        }
        let apiURL = `${this.$store.state.mydata.gobal_api.apiUrl}/last-data-in-current-time-range/`;
        let keys = ['NO2','NH4','DO','pH','Temperature','water_level_percentage'];
        let num=0;
        keys.forEach(async k=>{
          let parm = {
            factory_id: this.sel_main,
            pond_area_id: this.sel_area,
            time_range: this.timekb.filter(x=>x.id==this.timeSelect)[0].value,
            col_name: k
          };
          // if(nowTab=='NH4') {
          //   this.nowAreaId.range = this.lightData['AmmoniaN'];
          // }else if(nowTab=='Temperature') {
          //   this.nowAreaId.range = this.lightData['Temp'];
          // }else {
          //     this.nowAreaId.range = this.lightData[nowTab];
          // }
          
          this.nowAreaId.range = this.lightData[nowTab];
          this.water = [];
          this.waterParm[parm.col_name] = [];
          this.waterloading = false;
          this.mainpool.items = _.cloneDeep(this.originData);
          // console.log('water parm',parm);
          let getLastDataInCurrentTimeList = await this.getLastDataInCurrentTimeList(parm);
          let data = typeof (getLastDataInCurrentTimeList)=='string'?[]:getLastDataInCurrentTimeList;
          // data = [
          //   {
          //       "id": 178,
          //       "value": 5.89,
          //       "inspected_time": "2024-09-23 08:59"
          //   },
          //   {
          //       "id": 179,
          //       "value": 6.48,
          //       "inspected_time": "2024-09-23 08:59"
          //   },
          //   {
          //       "id": 180,
          //       "value": 0.34,
          //       "inspected_time": "2024-09-23 08:59"
          //   },
          // ]
          if(Array.isArray(data)) {
            this.waterParm[parm.col_name] = _.cloneDeep(data);
            this.waterParm[parm.col_name].forEach(w=>{
              w.level = this.checkValue(parm.col_name,w.value);
              w.parm_name = parm.col_name;
            })
            if(parm.col_name == nowTab) {
              this.water = _.cloneDeep(this.waterParm[nowTab]);
              this.waterloading = true;
            }
            num++;
            if(num==keys.length) {
              this.getAlertNum();
              
            }
            
          }
          
        })
      }  
    },
    // 檢查值範圍
    checkValue(col_name,value) {
      var checkstate = ['warning','critical'];
      var checkstate_bool = [false,false];
      // console.log('ruledata',this.lightData);
      // if(col_name == 'NH4') {
      //   col_name = 'AmmoniaN';
      // }else if(col_name == 'Temperature') {
      //   col_name = 'Temp';
      // }
     
      // console.log('ruledata',col_name);
      // console.log('ruledata',this.lightData[col_name]);
      if(this.lightData[col_name]) {
        for(var ruledatastate in checkstate){
          var ruledata = this.lightData[col_name][checkstate[ruledatastate]];
          // console.log('ruledata',ruledata);
          checkstate_bool[ruledatastate] = false;
          if(ruledata==null){
              continue;
          }
          
          var keysdata = Object.keys(ruledata);
          // console.log('keysdata',keysdata);
          keysdata.forEach(ele => {//rule
              var trueCnt=0;
              for(var rule in ruledata[ele]){
                  var ruleitem = ruledata[ele][rule];
                  var params = {};
                  params[col_name] = value;
                  var nerdreslut = this.nerdamerCheck(ruleitem,params);
                  if(nerdreslut==true){
                      trueCnt += 1;
                  }
                  if(trueCnt == ruledata[ele].length){
                    checkstate_bool[ruledatastate] = true;
                    break;
                  }
              }
          });
        }
        if(checkstate_bool[1]==true){
            return 'danger';
        }else if(checkstate_bool[0]==true){
          return 'warning';
        }else{
          return 'normal';
        }
      }else {
        return 'normal';
      }
      
    },
    nerdamerCheck:function(exp,params){
        // params 應該是{Do :4.5,Ca:3,Ma:4}
        // nerdamer('5 <= Do',{Do :4.5},'numer');
        var result = nerdamer(exp,params,'numer');
        if(result.text()==0){
            return false;
        }
        if(result.text()==1){
            return true;
        }
    },
    // 取得範圍
    async getWaterWarn() {
      console.log('trigger getWaterWarn');
      var field = this.nowAreaId.factory_id;
      let search = [{
        factory_id: field,
        // group: 'water',
        name_en: 'DO',
      },{
        factory_id: field,
        // group: 'water',
        name_en: 'NO2',
      },{
        factory_id: field,
        // group: 'water',
        name_en: 'pH',
      },{
        factory_id: field,
        // group: 'water',
        name_en: 'NH4',
      },{
        factory_id: field,
        // group: 'water',
        name_en: 'Temperature',
      },{
        factory_id: field,
        // group: 'env',
        name_en: 'water_level_percentage',
      }]
      // let getWarningRangeList = await this.getWarningRangeList();
      // let data = typeof (getWarningRangeList)=='string'?[]:getWarningRangeList;
      // this.lightData = data;
      search.forEach(async s=>{
        let getWarningRangeList = await this.getBasicWarningRangeList(s);
        let data = typeof (getWarningRangeList)=='string'?[]:getWarningRangeList;
        this.lightData[s.name_en] = data[s.name_en];
      })
      // this.lightData['DO'] = {
      //   // "warning": {
      //   //     "1": [
      //   //         "4<=Do",
      //   //         "Do<5"
      //   //     ]
      //   // },
      //   "warning": {
      //       "1": [
      //           "10.0 <= DO",
      //           "DO < 15.0"
      //       ],
      //       "2": [
      //           "DO <= 5.0",
      //           "4.0 < DO"
      //       ]
      //   },
      //   "critical": {
      //       "1": [
      //           "15.0 <= DO",
      //       ],
      //       "2": [
      //           "DO <= 4.0",
      //       ]
      //   },
      // }
      console.log('lightData',this.lightData);
      // await this.getWaterData();
      this.waterloading = true;

    },
    getAlertNum() {
      console.log('getAlertNum');
      this.showAlert = false;
      this.total.warning = 0;
      let item = Object.keys(this.waterParm);
      let num = 0;
      this.maindata.forEach(m=>{
        if(m.id==this.sel_main) {
          m.node.forEach(p=>{
            if(p.id==this.sel_area) {
              p.node.forEach(pool=>{
                for(let i=0;i<item.length;i++) {
                  this.waterParm[item[i]].forEach(water=>{
                    if(water.id==pool.id && (water.level=='danger' || water.level=='warning')) {
                      num++;
                    }
                  })
                }
              })
            }
          })
        }
      })
      this.total.warning = num;
      this.showAlert = true;
      this.checkColor();
    },
    checkColor() {
      let item = Object.keys(this.waterParm);
      let datas = _.cloneDeep(this.mainpool.items);
      this.mainpool.items = [];
      if(item.length>0) {
        datas.forEach(p=>{
          for(let i=0;i<item.length;i++) {
            this.waterParm[item[i]].forEach(w=>{
              if(p.id==w.id && w.level!=='normal' && w.level!=='') {
                if(p.level=='danger' && w.level=='warning') {
                  p.level = 'danger';
                }else {
                  p.level = w.level;
                }
              }
            })
            // p.parm_name = this.nowTab;
          }
        })
      }
      
      this.mainpool.items = datas;
      // console.log('data check',this.mainpool.items);
    },
    // row 顏色
    isTagColor(row) {
      // console.log('Row',row);
      let style = {}
      switch (row.row.level) {
        case 'warning':
          style = {
            backgroundColor: '#FCD7AA'
          }
          break;
        case 'danger':
          style = {
            backgroundColor: '#EDCCD1'
          }
          break;
      }

      return style;
    },
    goIndicator(item) {
      console.log('goIndicator',item);
      let defitem = '';
      let data = {};
      switch (this.currenttab) {
          case "亞硝酸鹽濃度":
            data = this.colData.filter(x=>x.name_en=='NO2')[0];
            defitem = data.name_ch;
            break;
          case "氨氮濃度":
            data = this.colData.filter(x=>x.name_en=='NH4')[0];
            defitem = data.name_ch;
            break;
          case "溶氧濃度":
            data = this.colData.filter(x=>x.name_en=='DO')[0];
            defitem = data.name_ch;
            break;
          case "酸鹼值":
            data = this.colData.filter(x=>x.name_en=='pH')[0];
            defitem = data.name_ch;
            break;
          case "水溫":
            data = this.colData.filter(x=>x.name_en=='Temperature')[0];
            defitem = data.name_ch;
            break;
          case "水位":
            console.log(this.colData);
            data = this.colData.filter(x=>x.name_en=='water_level_percentage')[0];
            defitem = data.name_ch;
            break;
          default:
            break;
        }
      // switch (this.currenttab) {
      //     case "亞硝酸鹽濃度":
      //       defitem = '亞硝酸鹽濃度';
      //       break;
      //     case "氨氮濃度":
      //       defitem = '氨氮濃度';
      //       break;
      //     case "溶氧濃度":
      //       defitem = '溶氧濃度';
      //       break;
      //     case "酸鹼值":
      //       defitem = '酸鹼值';
      //       break;
      //     case "水溫":
      //       defitem = '水溫';
      //       break;
      //     default:
      //       break;
      //   }
      console.log('now',this.nowTab,data,defitem)
      this.urldata= {
        sdate:  dayjs().format("YYYY-MM-DD"),
        sel_area: this.sel_area,
        sel_main: this.sel_main,
        sel_pool: item.id,
        defitem: defitem
      };
        let routeData = this.$router.resolve({
          path: "indicator/edit",
          query: this.urldata
        });
        console.log(routeData);
        window.open(routeData.href, "_blank");
      
    },
    handleClick(myBtn) {//點擊上方按鈕建議後的處理
      this.dialog.show = true;//顯示 按鈕對話框
      this.dialog.width = myBtn.width;//設定對話框的寬
      this.dialog.component = myBtn.type;//設定對話框要顯示什麼元件
      console.log('type:'+myBtn.type);
    },
    handleEmit(type,event){
      switch (type) {
        case 'closeDialog':
          this.dialog.show = false;
          // this.dialog={show:false,component:'',width:"500px"};
          break;
        default:
          //找不到任何事件對應，先跳錯誤訊息
          this.$toast.error(`handleEmit Error=> type: ${type},event: ${JSON.stringify(event)}`, { duration: 2500 });
          break;
      }
    }
  },
  async created() {
    // await this.getAlertData();
    await this.getStateColor();

    this.showAlert = false;
    this.timeSelect = this.timekb[0].id
    //await this._pageCheck(); //驗證頁面是否可檢視
    
    this.maindata = JSON.parse(localStorage.getItem('architecture'))?JSON.parse(localStorage.getItem('architecture')):await this.getArchitecture();
    this.sel_main = undefined;
    this.defaultPool = '';
    if(this.maindata.length>0) {
      console.log('localStorage.getItem', this.maindata)
      this.defaultPool = this.maindata[0].node[0].name+'_'+this.maindata[0].node[0].id;
      this.nowAreaId.factory_id = this.maindata[0].id;
      this.nowAreaId.pond_area_id = this.maindata[0].node[0].id;
    }else {
      this.defaultPool = '';
    }
    
    // console.log(this.defaultPool);

    this.currenttab = this.tabsMap[0].name;
    // await this.getWaterData();
    //await this.getWaterWarn();
    let getAllColForSearchList = await this.getAllColForSearchList();
    let data = typeof (getAllColForSearchList)=='string'?[]:getAllColForSearchList;
    this.colData = [];
    console.log('all',data);
    data.forEach(x=>{
      if((x.group=='water'&& ['DO','NH4','pH','NO2','Temperature'].includes(x.name_en))||(x.group=='env'&&x.name_en=='water_level_percentage')) {  
        this.colData.push(x);
      }
    })
    this.showAlert = true;
  },
  computed: {
    mpurl: function () {
      console.log(this.sel_main);
      return this.sel_main && this.showmp
        ? `/factory_${this.sel_main}.jpg?lazy`
        : "/factory_err.jpg?lazy";
    },
    areadata: function () {
      let filtermain = [];
      filtermain = this.maindata;
      // console.log("maindata node count:",this.maindata[0].node.length);

      if (
        //看有沒有選場
        this.sel_main != undefined &&
        this.sel_main > 0 &&
        this.maindata.length > 0
      ) {
        filtermain = filtermain.filter(main => main.id == this.sel_main);
      }
      var area = [];

      filtermain.forEach(function (x) {
        x.node.forEach(function (y) {
          var yitem = { id: y.id, name: y.name };
          if (area.indexOf(yitem) == -1) {
            //沒找到
            area.push(yitem);
          }
        });
      });
      return area;
    },
    pooldata: function () {
      let filterarea = _.cloneDeep(this.maindata);
      //filterarea = this.maindata;

      //先篩場
      if (
        this.sel_main != undefined && //非空
        this.sel_main > 0 && //有選到
        this.maindata.length > 0 //有資料
      ) {
        filterarea = filterarea.filter(main => main.id == this.sel_main);
      }
      let obj = [];
      //再篩區
      if (
        //如果有選區
        this.sel_area != undefined &&
        this.sel_area.length > 0 &&
        filterarea.length > 0
      ) {
        let astr = this.sel_area;
        filterarea.forEach(function (item, index) {
          obj.push(item);
          obj[index].node = item.node.filter(x => x.name == astr);
        });
        /*for (let i = 0; i < obj.length; i++) {
          console.log("filterarea node:",obj[i].node.length);
          filterarea[i].node = obj[i].node.filter(
            x => x.name == this.sel_area
          );
        }*/
      }
      //return this.maindata;
      return filterarea;
      //return obj;
    },
  },
  async mounted() {
    //監控視窗
    window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth;
    });
    this.selectedDashboardColumns = this.headersDashboard
        .filter(item => item.show)
        .map(item => item.value);

    //await this.getStateColor();
    // this.rndKey = Math.round( (Math.random()*100) );
  },
  watch: {
    windowWidth:function(){
        return window.innerWidth;
    },
    async currenttab() {
      // await this.getWaterData();
      let nowTab = ''
      switch (this.currenttab) {
        case "亞硝酸鹽濃度":
          nowTab = 'NO2';
          break;
        case "氨氮濃度":
          nowTab = 'NH4';
          break;
        case "溶氧濃度":
          nowTab = 'DO';
          break;
        case "酸鹼值":
          nowTab = 'pH';
          break;
        case "水溫":
          nowTab = 'Temperature';
          break;
        case "水位":
          nowTab = 'water_level_percentage';
          break;
        default:
          break;
      }
      this.water = this.waterParm[nowTab];
      // if(this.water && this.water.length>0) {
      //   this.water.forEach(w=>{
      //     if(this.newest=='') {
      //       this.newest = w.inspected_time.slice(0,10);
      //     }else {
      //       if(new Date(this.newest).getTime()<new Date(w.inspected_time.slice(0,10)).getTime()) {
      //         this.newest = w.inspected_time.slice(0,10);
      //       }
      //     }
      //   })
      // }
      
      // if(nowTab=='NH4') {
      //   this.nowAreaId.range = this.lightData['AmmoniaN'];
      // }else if(nowTab=='Temperature') {
      //   this.nowAreaId.range = this.lightData['Temp'];
      // }else {
      //     this.nowAreaId.range = this.lightData[nowTab];
      // }
      
      this.nowAreaId.range = this.lightData[nowTab];
    },
    isHideEmpty() {
      console.log('isHideEmpty');
    }
  }
};
//                            _ooOoo_
//                           o8888888o
//                           88" . "88
//                           (| -_- |)
//                            O\ = /O
//                        ____/`---'\____
//                      .   ' \\| |// `.
//                       / \\||| : |||// \
//                     / _||||| -:- |||||- \
//                       | | \\\ - /// | |
//                     | \_| ''\---/'' | |
//                      \ .-\__ `-` ___/-. /
//                   ___`. .' /--.--\ `. . __
//                ."" '< `.___\_<|>_/___.' >'"".
//               | | : `- \`.;`\ _ /`;.`/ - ` : | |
//                 \ \ `-. \_ __\ /__ _/ .-` / /
//         ======`-.____`-.___\_____/___.-`____.-'======
//                            `=---='
//
//         .............................................
//                  佛祖保佑             永無BUG
</script>

<style lang="scss" scoped>
@import "https://cdn.jsdelivr.net/npm/v-charts/lib/style.min.css";
.basic {
  .el-table__body-wrapper {
    height: 100%;
  }
  .el-table__empty-block {
    width: 100%;
  }
  .search.row {
    .col-12 {
      padding-top: 0;
      padding-bottom: 0;
    }
    .select_area .v-text-field__details {
      display: none !important;
   }
  }
}
.v-expansion-panel::before{
  box-shadow: none !important;
}

.v-sheet.result-card.pool-detail.v-card:not(.v-sheet--outlined) {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.v-card.dashboard {
  padding: 16px 24px;
  border-bottom: 4px solid $color-primary;
  flex-direction: column;
  @include flexAlignStart();
  margin-bottom: 12px;
  background-color: rgba($color-primary,0.08);
  .icon {
    border-radius: 50%;
    padding-top: 0;
    display: flex;
    text-align: center;
    margin-right: 24px;
    .v-icon {
      color: $color-primary;
    }
  }
  &.pond {
    border-bottom: 4px solid #92CF90;
    background-color: rgba(#92CF90,0.07);
    .v-icon {
      color: #92CF90;
    }
  }
  &.predict {
    border-bottom: 4px solid #E8956F;
    background-color: rgba(#E8956F,0.07);
  }
  &.warning-alert {
    border-bottom: 4px solid #E65151;
    background-color: rgba(#E65151,0.07);
    .v-icon {
      color: #E65151;
    }
  }
  .total-text {
    .title {
      margin-right: 16px;
    }
    .title,.content {
      color: $color-dark;
      font-size: 1rem !important;
    }
    .content {
      font-weight: bold;
      padding: 0;
      font-size: 1.2rem !important;
    }
    &.number-text {
      @include flexAlignStart();
      flex-direction: row;
      width: 100%;
      .content {
        padding: 0;
        @include flexAlignEnd();
        justify-content: center;
        width:100%;
      }
    }
  }
}

.v-card.result-card.pool-detail {
  background-color: #fff;
  .card-title {
    border-bottom: 1px solid $color-black-10;
    background-color: rgba($color-primary,0.1);
  }
  .content .col-12 {
    padding: 0;
    
  }
}

.v-application.v-application--is-ltr {
  .result-card.water {
    overflow-x: scroll;
    .poollayout .block {
      &:hover {
        margin-top: -20px !important;
      }
    }
  }
}
::v-deep {
  .iCountUp {
    font-size: 2rem !important;
    color: $color-dark !important;
  }
  // 養殖池table
  .el-table,.el-table tr,.el-table th.el-table__cell {
    background-color: #fff;
  }
  .el-table__footer-wrapper tbody td.el-table__cell,
  .el-table__fixed-footer-wrapper tbody td.el-table__cell {
    background-color: #f5f7fa;
  }
  .el-table__body tr.hover-row>td.el-table__cell {
    background-color: rgba($color-primary,0.1);
  }
  .el-table__fixed-footer-wrapper tbody td.el-table__cell,.el-table__footer-wrapper tbody td.el-table__cell {
    font-weight: bold;
  }
  // 布局圖
  .custom-overlay {
    position: fixed;
    .v-overlay__content {
      @include size(100%);
      .v-icon.v-icon.v-icon--link {
        position: absolute;
        top: 80px;
        right: 0;
      }
      img {
        @include positionCenter();
      }
    }
  }
  .v-card.result-card.water {
    background-color: rgba($color-primary,0.1) !important;
  }
  .result .header-bar.water-bar .theme--light.v-tabs > .v-tabs-bar,.result .header-barr.water-bar .theme--light.v-tabs-items {
    background-color: transparent;
  }
  .result .header-bar.water-bar {
    border-bottom: none;
  }
  .time-select {
    &.v-select.v-text-field--enclosed:not(.v-text-field--single-line):not(.v-text-field--outlined) .v-select__selections {
      padding-top: 0;
    }
  }
 
}
// 穿透 scoped 限制，設定水平捲軸高度
::v-deep .dashboard-table .el-table__body-wrapper::-webkit-scrollbar {
    height: 12px;
}

::v-deep .dashboard-table .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 7px;
}
</style>
