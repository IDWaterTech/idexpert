<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- 選擇起日 -->
        <v-col cols="12" md="2">
          <v-menu
            v-model="menu_startdate"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="sdate"
                label="選擇起日"
                prepend-icon="mdi-calendar"
                readonly dark dense
                v-bind="attrs"
                v-on="on"
                @click:prepend="() => (sdate = getNowDate())"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="sdate" no-title locale="zh-tw"
              @input="menu_startdate = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <!-- 選擇訖日 -->
        <v-col cols="12" md="2">
          <v-menu
            v-model="menu_enddate"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="edate"
                label="選擇訖日"
                prepend-icon="mdi-calendar"
                readonly dark dense
                v-bind="attrs"
                v-on="on"
                @click:prepend="() => (edate = getNowDate())"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="edate" no-title locale="zh-tw"
              @input="menu_enddate = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <!-- 選擇場 -->
        <v-col cols="12" md="2">
          <v-select
            v-model="sel_main"
            :items="maindata"
            item-value="id"
            item-text="name"
            label="選擇場"
            clearable dark dense
          >
          </v-select>
        </v-col>
        <!-- 選擇區域 -->
        <v-col cols="12" md="2">
          <v-select
            v-model="sel_area"
            :items="areadata"
            item-value="id"
            item-text="name"
            clearable dark dense
            @change="areachange"
            label="選擇區域"
          ></v-select>
        </v-col>
        <!-- 選擇水池 -->
        <v-col cols="12" md="2">
          <v-autocomplete
            v-model="sel_pool"
            :items="this.mainpool.items"
            item-text="name"
            item-value="id"
            no-data-text="查無資料"
            placeholder="選擇水池"
             dark dense
          ></v-autocomplete>
        </v-col>
        <!-- 指定項目 -->
        <v-col cols="12" md="2">
           <v-autocomplete
          v-model="defitem"
          :items="waterdatacols"
          v-if="waterdatacols"
          no-data-text="查無資料"
          placeholder="指定項目"
          clearable dark dense
        ></v-autocomplete>
        </v-col>
        <!-- 確認鈕 -->
        <v-col cols="12" md="1">
          <v-btn
            block tile dark
            color="primary"
            @click="getdata"
            :disabled="
              sel_pool &&
              sel_area &&
              sel_main &&
              defitem != undefined &&
              defitem.length > 0
                ? false
                : true
            "
            >確認</v-btn
          >
        </v-col>
        <v-col cols="12" md="2" class="white--text">顯示最小值：<el-input-number v-model="chartmin" controls-position="right" :min="0" style="width:100px;"></el-input-number></v-col>
        <v-col cols="12" md="2" class="white--text">顯示最大值：<el-input-number v-model="chartmax" controls-position="right" :min="0" style="width:100px;"></el-input-number></v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="white--text">
          <WaterQuality_Vcharts
            :rowsData="item.items"
            xColName="inspected_date"
            :defaultitem="{}"
            :loading="waterloading"
            :title="item.name"
            :chartmin="chartmin"
            :chartmax="chartmax"
            :markdata="markdata"
          ></WaterQuality_Vcharts>
        </v-col>
        <v-col cols="12">
          <el-table :data="eventsData" style="width: 100%" max-height="300">
            <el-table-column label="ID" width="50" prop="id" align="center"></el-table-column>
            <el-table-column label="事件等級" width="80" prop="event_level_name" align="center">
              <template slot-scope="scope">
                <v-chip dark :color="scope.row.color">{{scope.row.event_level_name}}</v-chip>
              </template>

            </el-table-column>
            <el-table-column label="事件類別" width="80" prop="event_category_name" align="center"></el-table-column>
            <el-table-column label="時間" width="200" align="center">
              <template slot-scope="scope">
                起：{{scope.row.started_date}}<br/>訖：{{scope.row.ended_date}}
              </template>
            </el-table-column>
            <el-table-column label="內容" align="left">
              <template slot-scope="scope">
                全日事件：{{scope.row.is_all_day?'Yes':'No'}}<br/>
                標題：{{scope.row.title}} [最後編輯： {{scope.row.created_user}}]<br/>
                內容：<div style="white-space: pre-wrap;">{{scope.row.content}}</div>
              </template>
            </el-table-column>
            <el-table-column label="資料範圍" width="200" align="center">
              <template slot-scope="scope">
                {{scope.row.items.map(x=>x.name).join()}}
              </template>
            </el-table-column>
          </el-table>
        </v-col>
        <v-col cols="12" v-if="item.items">
          <el-table
            :data="item2.items"
            style="width: 100%"
            max-height="500"
            row-key="id"
            v-if="item.items && item.items.length > 0"
          >
            <el-table-column
              v-for="(item, key) in Object.keys(item2.items[0]).filter(
                x => !['hide_col_name_put_here'].includes(x)
              )"
              :prop="item"
              :label="item"
              :key="key"
              align="center"
            >
            </el-table-column>
             <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <v-icon small :disabled="['feed','pbio'].includes(scope.row.group)" @click="delItem(scope.row)" color="red">mdi-delete</v-icon>
                  <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                  <el-button type="text" size="small">编辑</el-button> -->
                </template>
              </el-table-column>
          </el-table>
           <!-- 刪除項目 -->
            <v-dialog v-model="delDialog" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"> 是否刪除該項目?</v-card-title>
                <v-card-text class="text-h5">
                  id:{{ editedItem.id }}<br />
                  時間：{{ editedItem.inspected_date }}<br />
                  值：{{ editedItem.value }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="delDialog = false"
                    >取消</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="delsubmit"
                    >確定刪除！</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import https from "https";
import dayjs from "dayjs";
import "element-ui/lib/theme-chalk/index.css";
import WaterQuality_Vcharts from "@/components/sheet/waterQuality_vcharts";
import _ from "lodash";
const agent = new https.Agent({
  rejectUnauthorized: false
});
// import { number } from "~/node_modules/echarts/lib/export";
export default {
  layout: "emptynologin",
  middleware: "auth",
  components: {
    WaterQuality_Vcharts
  },
  head(){
    return{
      title:'指標資料明細'
    }
  },
  data() {
    return {
      req: this.$route.query,
      maindata: [],
      sel_main: 0,
      sel_area: "",
      sel_pool: "",
      pooldata: [],
      mainpool: {
        id: 1,
        name: "A1",
        items: [
          // { name: "體積", item: "volume", value: 140.0, unit: "噸" },
        ]
      },
      defitem: [],
      waterdatacols: [],
      allcols: {},
      waterloading: false, //折線圖，
      item: [{ name: "", items: [] }],
      item2: [{ name: "", items: [] }],
      //---日曆
      menu_startdate: false,
      menu_enddate:false,
      sdate: dayjs(new Date(2021, 0, 11))
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      edate:dayjs(new Date(2021, 0, 11))
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      chartmin:undefined,
      chartmax:undefined,
      markdata:{maxline:-999,minline:-999},
      //編輯中或刪除中的項目
      editedItem:{},
      //刪除視窗
      delDialog:false,
      //事件資料
      eventsData:[]
    };
  },
  mounted() {
    // this.maindata;this.sel_main;
    // 參數代入
    //this.sel_main = 1;
    // if (Object.keys(this.req).length > 0) {
    //   this.sdate = this.req.sdate;
    //   this.sel_main = this.req.sel_main;
    //   this.sel_area = this.req.sel_area;
    //   this.sel_pool = this.req.sel_pool;
    //   this.defitem = this.req.defitem;
    //    await this.getdata();
    // }
    console.log(Object.keys(this.req));
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    let myurl = [
      `${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`,
      `${this.$store.state.mydata.gobal_api.apiUrl}/all-col-name/`
    ];
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    const fetchURL = url =>
      this.$axios.get(url, { httpsAgent: agent }).catch(err => {
        alert("fetchURL失敗：" + err.message);
      });
    const promiseArray = myurl.map(fetchURL);
    console.log("req", this.req);
    //
    this.sdate = String(this.req.sdate).length > 0 ? this.req.sdate : "";
    this.edate = this.req.hasOwnProperty('edate') && String(this.req.edate).length > 0 ? this.req.edate : this.sdate; 
    this.sel_main =
      Number(this.req.sel_main) > 0 ? Number(this.req.sel_main) : 0;
    this.sel_area =
      Number(this.req.sel_area) > 0 ? Number(this.req.sel_area) : 0;
    this.sel_pool =
      Number(this.req.sel_pool) > 0 ? Number(this.req.sel_pool) : 0;
    if (Number(this.req.sel_pool) > 0) {
      //await this.areachange();
      this.areachange();
      this.sel_pool = Number(this.req.sel_pool);
    }
    this.defitem =
      this.req.defitem != undefined && this.req.defitem.length > 0
        ? this.req.defitem
        : [];
    //---
    // console.log(this.sdate,this.sel_main,this.sel_area,this.sel_pool);
    await Promise.all(promiseArray).then(([...data]) => {
      let res = data[0]; // first promise resolved
      this.maindata = res.data;
      console.log("場",this.maindata);

      //抓all項目
      res = data[1];
      var allitems = [];
      for (let i = 0; i < Object.keys(res.data).length; i++) {
        let colsclass = Object.keys(res.data)[i]; //water,env....
        if (i!=0) {
              allitems.push({ divider: true });
            }
             allitems.push({ header: colsclass });//group name
             allitems.push(...Object.keys(res.data[colsclass]));
      }
      this.waterdatacols = allitems;
      this.allcols = Object.assign({}, res.data);//{adv:{每日成長量: "每日成長量(cm)",...},...}
      console.log("子項目 api",this.allcols);
    });

    // //參數代入
    if (Object.keys(this.req).length > 0) {
      await this.getdata();
    }
  },
  computed: {
    areadata: function() {
      let filtermain = [];
      filtermain = this.maindata;
      if (
        //看有沒有選場
        this.sel_main != undefined &&
        this.sel_main > 0 &&
        this.maindata.length > 0
      ) {
        filtermain = filtermain.filter(main => main.id == this.sel_main);
      }
      var area = [];

      filtermain.forEach(function(x) {
        x.node.forEach(function(y) {
          var yitem = { id: y.id, name: y.name };
          if (area.indexOf(yitem) == -1) {
            //沒找到
            area.push(yitem);
          }
        });
      });
      return area;
    }
  },
  methods: {
    areachange: async function() {
      var para = {
        id: this.sel_area
      };
      
      if (this.sel_area) {
        //水池基本資料
        await this.$axios
          .get(
            `${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`,
            { params: para },
            { httpsAgent: agent }
          )
          .then(res => {
            console.log("ponds-data",res.data);
            this.mainpool.items = res.data;
          })
          .catch(err => {
            alert("失敗：" + err.message);
          });
      } else {
        this.mainpool.items = [];
      }
    },
    getdata: async function() {
      //mark line 先歸零
      this.markdata.maxline = -999;
      this.markdata.minline = -999;
      //清空itm
      this.item=[];
      console.log(
        "api 參數",
        this.sdate,
        this.edate,
        this.sel_pool,
        this.sel_area,
        this.sel_main,
        this.defitem
      );
      this.chartmin = undefined;
      this.chartmax = undefined;
      //指定的項目是歸屬於哪個類別，水質/投餵
      var defitem_tmp = this.defitem; //判斷項目是屬於水質還是投餵用
      let itemclass = ``;
      let mycols = this.allcols;
      for (const idx in Object.keys(mycols)) {
        var tmp = Object.keys(mycols[Object.keys(mycols)[idx]]).find(
          keys => keys == defitem_tmp
        );
        if (tmp !== undefined && tmp == defitem_tmp) {
          itemclass = Object.keys(mycols)[idx];
        }
      }

      //抓折線圖資料囉
      let parm = {
        started_date: this.sdate,
        ended_date: this.edate,
        factory_id: this.sel_main,
        pond_area_id: this.sel_area,
        pond_id: this.sel_pool,
        items: this.defitem,
        data_group: itemclass
      };
      let apiURL = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/`;
      await this.$axios
        .get(apiURL, { params: parm }, { httpsAgent: agent })
        .then(res => {
          console.log("all-data API:", res.request.responseURL);
          let data2 = _.cloneDeep(res.data);
          res.data.items.forEach(function(x) {//給折線圖用的資料
            delete x.id; //"刪掉id欄位"
            delete x.updated_user; //"刪掉updated_user欄位"
            delete x.group;//"刪掉group欄位"
          });
          
          // data2.items.forEach(function(x) {//給表格用的資料
          // });
          
          this.item = res.data;
          this.item2 = data2;
          //抓上下限資料
          if ( res.data.items.length>0) {
            this.getLimitData();
          }
        })
        .catch(err => {
          alert("失敗：" + err.message);
        });
      //抓事件資料
      this.eventsData.splice(0,this.eventsData.length);
      var result1 = await this.getEventData(1);
      var result2 = await this.getEventData(2);
      var result3 = await this.getEventData(3);
      this.eventsData = result1.concat(result2,result3);
      console.log("event data:",this.eventsData);
    },
    //抓事件資料
    getEventData: async function(level=1) {
      var parms = {};
      var poolidcpd = [];
      var result =[];
      
      this.eventsData.splice(0,this.eventsData.length);
      // started_date=2022-01-01&ended_date=2022-01-04
      parms.started_date = this.sdate;
      parms.ended_date = this.edate;
      switch (level) {
        case 1:
          poolidcpd.push(this.sel_main);
          parms.factory_id = poolidcpd.join();
          break;
        case 2:
          poolidcpd.push(this.sel_area);
          parms.pond_area_id = poolidcpd.join();
          break;
        case 3:
          poolidcpd.push(this.sel_pool);
          parms.pond_id = poolidcpd.join();
          break;
      }
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/event/`, {
          params: parms
        })
        .then(res => {
          result = res.data;
          console.log("event api:", res.request.responseURL);
          
        })
        .catch(err => {
          this.$toast.error(`資料取得失敗:${err.message}`, { duration: 2000 });
        });
        return result;
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    getLimitData: async function() {
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/`)
        .then(res => {
          // this.allcols = Object.assign([], res.data);
          var lmtitem =  res.data.filter(x=>x.name_ch==this.defitem);
          if(lmtitem.length>0){//不可以有null值
            this.markdata.maxline = (lmtitem[0].critical_max==null)?-999:lmtitem[0].critical_max;
            this.markdata.minline = (lmtitem[0].critical_min==null)?-999:lmtitem[0].critical_min;
          }else{
            this.markdata.maxline = -999;
            this.markdata.minline = -999;
          }
          console.log("col data:",res.request.responseURL);
        });
    },
    getItemClass: function(item) {//依項目回傳主要類別是什麼
      let colclass = "";
      for (let i = 0; i < Object.keys(this.allcols).length; i++) {
        let inclass = Object.keys(this.allcols)[i]; //water;
        let checkclass = Object.keys(this.allcols[inclass]).includes(item);
        if (checkclass == true) {
          colclass = inclass;
          return colclass;
        }
      }
    },
    delItem: async function(item) {
      //編輯中的物件item
      this.editedItem.id = item.id;
      this.editedItem.inspected_date = item.inspected_date;
      this.editedItem.value = item[Object.keys(item)[3]];
      this.editedItem.class = this.getItemClass(Object.keys(item)[3]); //water,adv...
      this.delDialog = true;
    },
    delsubmit: async function() {
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/${this.editedItem.id}/`;
      let deldata = { data_group: this.editedItem.class };
      console.log("DEL data:", deldata);
      console.log("DEL:" + url);
      await this.$axios
        .delete(url, { data: deldata }, { httpsAgent: agent })
        .then(res => {
          if (res.data == "刪除成功") {
            this.getdata();
            this.delDialog = false; //close dialog
            this.$toast.success(`刪除成功`, { duration: 2000 });
            this.getdata();//重取得資料
          } else {
            alert("刪除失敗!：" + res.data);
          }
        })
        .catch(error => {
          alert("刪除失敗!：" + error.message);
        });
    }
  }
};
</script>

<style scoped>
div /deep/ .el-input__inner{
  border-radius:0px !important;
}
</style>
