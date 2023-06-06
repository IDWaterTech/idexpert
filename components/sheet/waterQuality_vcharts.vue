<template>
  <div>
    <v-row>
      <v-col cols="12"
        ><h1 class="white--text">{{ title }}</h1>
      </v-col>
    </v-row>
    <!-- 外部更新資料必須顯示在DOM裡面才會更新資料，不得已只好放著，但不顯示 -->
    <div v-show="false">{{ defaultitem }}</div>
    <!-- <span v-if= 'chtData_new_1 != undefined && chtData_new_1.rows.length == 0'>查無資料</span> -->
    <!-- <div>defaultitem:{{ defaultitem }}</div>
    <div>chtData_new_1:{{ chtData_new_1.rows}}</div> -->
    <ve-line
      :data="chtData_new_1"
      :settings="set"
      :extend="chartExtend"
      :loading="loading"
      :events="{ click: helo.bind(this, urldata) }"
      :judge-width="true"
      v-show="chtData_new_1.rows.length > 0"
      :mark-line="markLine"
      :colors="myColors"
       :after-config="afterConfig"
    ></ve-line>
    <div class="text-center" style="font-size: 1.2em;" v-show="chtData_new_1.rows.length <= 0">查無資料</div>
  </div>
</template>
<style>
h3 {
  font-family: "Microsoft JhengHei UI" !important;
}
a {
  text-decoration: none;
}
</style>
<script>
import { number } from "echarts/lib/export";
export default {
  data() {
    return {
      
      //水質---------------------------------------------------------------------------------------
      set: {
        legendAlias: {},
        stack: {},
      },
      slt_1_items: [], //下拉所有項目
      slt_1: "", //下拉的項目-選到的
      chtData_Ora_1: {
        columns: [],
        rows: [
          {
            id: "A1",
            data: []
          }
        ]
      },
      chtData_new_1: { columns: [], rows: [] },
      show: false,
      myColors:['#91c7ae','#ffa1aa','#ff9900','#FFAB91','#fff8b8','#BCAAA4','#8BC34A','cyan','#B388FF'],
      //#91c7ae default ffa1aa 淺紅  #ff9900 橘 FFAB91 淺橘 fff8b8 淺黃 BCAAA4 淺咖 cyan 亮藍綠 8BC34A 亮綠 #B388FF 淺紫
      chartExtend: {
        legend: {
          selected: this.defaultitem,
          textStyle:{
            color:'#FFEB3B',
            fontSize:18
          },
          icon:'roundRect',//round,rec,roundRect
        },
        splitLine: {
          lineStyle: {
            opacity: 0.2,
          },
        },
      
        xAxis:{
          axisLabel: { color: "#fff" },
          
        },
        yAxis:{
          axisLabel: { color: "#fff" }
        },
      },
      chartEvent: {
        click: function(e) {
          //   this.sdate = this.req.sdate;
          //   this.sel_main = this.req.sel_main;
          //   this.sel_area = this.req.sel_area;
          //   this.sel_pool = this.req.sel_pool;
          //   this.defitem = this.req.defitem;
          // $nuxt.$emit("clickFun");
          console.log(this.show);
          var para = { sdate: e.value[0], defitem: e.seriesName };
          console.log(para);
        }
      }
    };
  },
  // props: ["sheetid", "defaultitem"],
  props: {
    sheetid: String,
    title: String,
    defaultitem: {
      type: Object,
      default: function() {
        return {};
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    legendAliasOut: {
      type: Object,
      default: function() {
        return {
          // 鹽度: "鹽度(ppt)",
          // 溶氧: "溶氧(ppm)",
          // 氨氮: "氨氮(ppm)",
          // 亞硝酸: "亞硝酸(ppm)",
          // 溫度: "溫度(°C)",
          // 酸鹼度: "酸鹼度(ph)"
        };
      }
    },
    xColName: {
      type: String,
      default: "default"
    },
    rowsData: {
      type: Array,
      default: function() {
        return [
          // {
          //   default: "20200101",
          //   鹽度: 700,
          //   溶氧: 500,
          //   氨氮: 200,
          //   亞硝酸: 400,
          //   溫度: 300,
          //   酸鹼度: 100
          // },
          // {
          //   default: "20200102",
          //   鹽度: 700,
          //   溶氧: 500,
          //   氨氮: 200,
          //   亞硝酸: 400,
          //   溫度: 300,
          //   酸鹼度: 100
          // },
          // {
          //   default: "20200103",
          //   鹽度: 700,
          //   溶氧: 500,
          //   氨氮: 200,
          //   亞硝酸: 400,
          //   溫度: 300,
          //   酸鹼度: 100
          // }
        ];
      }
    },
    urldata: {
      type: Object,
      default: function() {
        return {};
      }
    },
    chartmin: {
      type: Number,
      default: 0
    },
    chartmax: {
      type: Number,
      default: 0
    },
    markdata:{
      type:Object,
      default: function() {
        return {
        maxline:-999,
        minline:-999
      };
      }
    },
  },
  created() {
    // this.chtData_Ora_1.columns = [this.xColName].concat(this.slt_1_items); //設定欄位
    // this.chtData_new_1.columns = [...this.chtData_Ora_1.columns]; //設定欄位
  },
  updated() {
    //--外部參數資料帶入--
    this.set.legendAlias = this.legendAliasOut;
    this.set.max = [this.chartmax];
    this.set.min = [this.chartmin];
    this.slt_1_items = Object.keys(this.legendAliasOut); //取得主要欄位
    // this.chtData_Ora_1.columns = [this.xColName].concat(this.slt_1_items); //設定欄位
    var temp = this.rowsData.length > 0 ? Object.keys(this.rowsData[0]) : "";
    if (temp.indexOf(this.xColName) > -1) {
      temp.splice(temp.indexOf(this.xColName), 1); //去除default 時間欄位
    }
    let showcols = Object.keys(this.defaultitem).filter(x=>this.defaultitem[x]==true);
    if (showcols.length>0) {
      temp=showcols;
    }
    this.chtData_Ora_1.columns = [this.xColName].concat(temp); //設定欄位
    this.chtData_Ora_1.rows[0].data = this.rowsData;
    this.chartExtend.legend.selected = this.defaultitem; //選到什麼欄位
    //水質----------
    this.chtData_new_1.columns = [...this.chtData_Ora_1.columns]; //設定欄位
    
    //直接參考，不會動到舊資料
    let array = [];
    // this.chtData_Ora_1.rows.forEach(element => {
    //   array.push(...element.data);
    // });
    // this.chtData_new_1.rows = array;
    this.chtData_new_1.rows = this.sheetdata;
    console.log("chtData_new_1:",this.chtData_new_1);
  },
  computed: {
    sheetdata: function() {
      let array = [];
      this.chtData_Ora_1.rows.forEach(element => {
        if (this.sheetid === element.id) {
          array.push(...element.data);
        }
        if (this.sheetid === undefined || this.sheetid.trim() === "") {
          array.push(...element.data);
        }
      });
      return array;
    },
    markLine:function(){
      const data = {
        symbol: ["circle", "arrow"],
        data: [
          {
            yAxis: (this.markdata.maxline==null)?-999:this.markdata.maxline,
            label:{
              formatter:"危險線：{c}",
              fontSize: 18,
              position: 'insideEndTop'
            },
            lineStyle: {
              type:'dashed',
              color: "#EF5350",
              width: 2.5
            },
            emphasis: {
              lineStyle: {
                type:'dashed',
                width: 2.5,	// hover时的折线宽度
              }
            }
          },
          {
            yAxis: (this.markdata.minline==null)?-999:this.markdata.minline,
            label:{
              show:true,
              formatter:"危險線：{c}",
              fontSize: 18,
              position: 'insideEndBottom'
            },
            lineStyle: {
              type:'dashed',
              color: "#EF5350",
              width: 2.5,
            },
             emphasis: {//hover折線固定不變，所以要強設定
              lineStyle: {
                type:'dashed',
                width: 2.5,	// hover时的折线宽度
              }
            }
          }
        ]
      };
      return data;
    }
  },
  methods: {
    afterConfig (options) {
      if(options.series.length>0){
        options.series.forEach(element => {
          element.lineStyle = {width:4,/*type: 'dashed'*/};
        });
      }
      return options;
    },
    slt1_chg() {
      if (this.slt_1) {
        this.chtData_new_1.columns = ["default", this.slt_1];
      } else {
        this.chtData_new_1.columns = this.chtData_Ora_1.columns;
      }
    },
    helo(p, e) {
      // this.$router.push("indicator/?")
      // let routeData = this.$router.resolve({name: 'Indicator', query: {data: "someData"}});
      this.urldata.defitem = e.seriesName;
      this.urldata.sdate = e.value[0];
      if (Object.keys(this.urldata).length == 5) {
        let routeData = this.$router.resolve({
          name: "indicator",
          query: this.urldata
        });
        console.log(routeData);
        window.open(routeData.href, "_blank");
      }
    }
  }
};
</script>
