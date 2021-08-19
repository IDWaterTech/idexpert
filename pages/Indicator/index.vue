<template>
  <div>
    <v-container fluid>
      <v-row>
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
                label="選擇日期"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                @click:prepend="() => (sdate = getNowDate())"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="sdate"
              @input="menu_startdate = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="sel_main"
            :items="maindata"
            item-value="id"
            item-text="name"
            label="選擇廠"
            clearable
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="sel_area"
            :items="areadata"
            item-value="id"
            item-text="name"
            clearable
            @change="areachange"
            label="選擇區域"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            v-model="sel_pool"
            :items="this.mainpool.items"
            item-text="name"
            item-value="id"
            no-data-text="查無資料"
            placeholder="選擇水池"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="defitem"
            clearable
            placeholder="指定項目"
            :items="Object.keys(waterdatacols)"
            v-if="waterdatacols"
            no-data-text="查無資料"
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="1">
          <v-btn
            block
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
      </v-row>
      <v-row>
        <v-col cols="12">
          顯示最大值：<el-input-number v-model="chartmax" controls-position="right" :min="0"></el-input-number>
          顯示最小值：<el-input-number v-model="chartmin" controls-position="right" :min="0"></el-input-number>
          <WaterQuality_Vcharts
            :rowsData="item.items"
            xColName="inspected_date"
            :defaultitem="{}"
            :loading="waterloading"
            :title="item.name"
            :chartmin="chartmin"
            :chartmax="chartmax"
          ></WaterQuality_Vcharts>
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
          </el-table>
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
// import { number } from "~/node_modules/echarts/lib/export";
export default {
  layout: "emptynologin",
  middleware: "auth",
  components: {
    WaterQuality_Vcharts
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
      waterdatacols: {},
      allcols: {},
      waterloading: false, //折線圖，
      item: [{ name: "", items: [] }],
      item2: [{ name: "", items: [] }],
      //---日曆
      menu_startdate: false,
      sdate: dayjs(new Date(2021, 0, 11))
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      chartmin:undefined,
      chartmax:undefined
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
      "https://61.56.172.10/architecture/",
      "https://61.56.172.10/all-col-name/"
    ];
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    const fetchURL = url =>
      this.$axios.get(url, { httpsAgent: agent }).catch(err => {
        alert("失敗：" + err.message);
      });
    const promiseArray = myurl.map(fetchURL);
    console.log("req", this.req);
    //
    this.sdate = String(this.req.sdate).length > 0 ? this.req.sdate : "";
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
      console.log("廠");
      let res = data[0]; // first promise resolved
      this.maindata = res.data;
      //抓all項目

      console.log("all項目");
      res = data[1];
      for (let i = 0; i < Object.keys(res.data).length; i++) {
        let colsclass = Object.keys(res.data)[i]; //water;
        Object.assign(this.waterdatacols, res.data[colsclass]);
      }
      this.allcols = Object.assign({}, res.data);
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
        //看有沒有選廠
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
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      if (this.sel_area) {
        //水池基本資料
        await this.$axios
          .get(
            "https://61.56.172.10/ponds-data/",
            { params: para },
            { httpsAgent: agent }
          )
          .then(res => {
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
      console.log(
        "api 參數",
        this.sdate,
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
        ended_date: this.sdate,
        factory_id: this.sel_main,
        pond_area_id: this.sel_area,
        pond_id: this.sel_pool,
        items: this.defitem,
        data_group: itemclass
      };
      let apiURL = `https://61.56.172.10/all-data/`;
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      await this.$axios
        .get(apiURL, { params: parm }, { httpsAgent: agent })
        .then(res => {
          console.log("AI:", res.request.responseURL);
          let data2 = _.cloneDeep(res.data);
          res.data.items.forEach(function(x) {//給折線圖用的資料
            delete x.id; //"刪掉id欄位"
            delete x.updated_user; //"刪掉updated_user欄位"
          });
          
          // data2.items.forEach(function(x) {//給表格用的資料
          // });
          this.item = res.data;
          this.item2 = data2;
        })
        .catch(err => {
          alert("失敗：" + err.message);
        });
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    }
  }
};
</script>

<style scoped></style>
