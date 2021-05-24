<template>
  <div>
    <v-expansion-panels class="mb-6" v-model="mypanel">
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down">
          選擇條件
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="grey lighten-5">
            <v-row>
              <v-col cols="12">
                <v-img
                  :src="mpurl"
                  class="grey lighten-2"
                  v-if="showmp && sel_main"
                ></v-img>
                <!-- <img src="~/static/test.jpg"/> -->
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="3">
                <v-card class="pa-2" outlined tile min-height="300px">
                  <v-select
                    v-model="sel_main"
                    :items="maindata"
                    item-value="id"
                    item-text="name"
                    label="選擇廠"
                    @change="sel_main > 0 ? '' : (showmp = false)"
                    clearable
                  >
                    <!-- :prepend-icon="(sel_main>0)?'mdi-image':undefined" 
                  @click:prepend="showmpFun"
                  -->
                    <v-btn
                      icon
                      color="teal lighten-2"
                      @click="showmpFun"
                      v-if="sel_main"
                      slot="prepend"
                    >
                      <v-icon>mdi-image</v-icon>
                    </v-btn>
                  </v-select>
                  <v-select
                    v-model="sel_area"
                    :items="areadata"
                    item-value="id"
                    item-text="name"
                    clearable
                    @change="areachange"
                    label="選擇區域"
                  ></v-select>
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
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="sdate"
                      @input="menu_startdate = false"
                    ></v-date-picker>
                  </v-menu>
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
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="edate"
                      @input="menu_enddate = false"
                    ></v-date-picker>
                  </v-menu>
                  <!-- 可能同池名，在不同廠，所以value= name -->
                  <v-btn tile color="blue" dark @click="closepanel">確認</v-btn>
                </v-card>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col cols="12" md="9">
                <v-data-table
                  :headers="headers"
                  :items="mainpool.items"
                  item-key="unit"
                  :footer-props="footerProps"
                  no-data-text="查無資料"
                  disable-sort
                  :loading="tableloading"
                  height="300px"
                >
                </v-data-table>
              </v-col>
              <v-col cols="12" md="5" v-if="false">
                <v-card class="pa-2" outlined tile min-height="300px">
                  <v-treeview
                    v-model="tree"
                    :open="initiallyOpen"
                    :items="pooldata"
                    item-children="node"
                    activatable
                    item-key="name"
                    open-on-click
                    :selection-type="'leaf'"
                  >
                    <!-- item顯示，前面的預掛圖示 -->
                    <template v-slot:prepend="{ item, open }">
                      <v-icon v-if="!item.type && item.node">
                        <!-- {{ open ? "mdi-folder-open" : "mdi-folder" }} 有NODE絕對不是最後一層-->
                        {{ open ? "mdi-select-group" : "mdi-select-inverse" }}
                      </v-icon>
                      <v-icon v-else-if="!item.node">
                        <!-- 沒Node當作已最後一層 -->
                        {{ files["pool"] }}
                      </v-icon>
                      <v-icon v-else>
                        {{ files[item.type] }}
                      </v-icon>
                    </template>
                    <!-- item內容 -->
                    <template slot="label" slot-scope="{ item }">
                      <div @click="openDialog(item)" v-if="!item.node">
                        {{ item.name }}
                      </div>
                      <div v-else @click="openDialog()">{{ item.name }}</div>
                    </template>
                  </v-treeview>
                </v-card>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col cols="12" md="4" v-if="false">
                <v-card class="pa-2" outlined tile min-height="300px">
                  <div v-if="clickeditem.length > 0">
                    水池:{{ clickeditem }}
                    <v-list dense>
                      <v-list-item-group color="primary">
                        <v-list-item
                          v-for="(item, i) in mainpool.items"
                          :key="i"
                        >
                          <v-list-item-icon>
                            <!-- <v-icon v-text="item.icon"></v-icon> -->
                            <v-icon>mdi-source-commit-start</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <!-- <v-list-item-title
                            v-text="item.text"
                          ></v-list-item-title> -->
                            <v-list-item-title
                              >{{ item.name }}({{ item.unit }})：{{
                                item.value
                              }}</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel> </v-expansion-panels
    >
    <v-tabs v-model="currenttab" background-color="blue lighten-2" dark>
      <v-tab v-for="(tab, idx) in tabs" :key="idx" :href="`#` + tab.name">
        {{ tab.name }}
      </v-tab>
      <!-- <v-tab-items v-model="currenttab"> -->
      <v-tab-item :value="'水質監測'">
        <v-overlay :value="waterloading" :absolute="true">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card flat min-height="900px">
          <v-card-text>
            <v-row
              v-if="
                Object.keys(waterdatacols).length > 0 && waterloading == false
              "
            >
              <v-col cols="12" md="3">
                <v-select
                  v-model="defitem"
                  clearable
                  multiple
                  chips
                  placeholder="指定項目"
                  :items="Object.keys(waterdatacols)"
                  v-if="waterdatacols"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-col cols="12" md="4"> 使用echarts
                  <water-quality defaultitem="density" chartId="mmm"></water-quality>
                </v-col> -->
              <v-col cols="12" md="4" v-for="item in waterdata" :key="item.id">
                <WaterQuality_Vcharts
                  :rowsData="item.items"
                  :legendAliasOut="waterdatacols"
                  xColName="inspected_date"
                  :defaultitem="defalutItemList"
                  :loading="waterloading"
                  :title="item.name"
                  :urldata="{
                    sel_main: sel_main,
                    sel_area: sel_area,
                    sel_pool: item.id
                  }"
                ></WaterQuality_Vcharts>
              </v-col>
            </v-row>
            <v-row v-if="waterdata.length < 1 && waterloading == false">
              <v-spacer></v-spacer>
              <v-col cols="4" class="mt-5"><h2>無資料</h2></v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :value="'投餵/池體數據'">
        <v-overlay :value="feedloading" :absolute="true">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card flat min-height="900px">
          <v-card-text>
            <v-row
              v-if="
                Object.keys(feeddatacols).length > 0 && feedloading == false
              "
            >
              <v-col cols="12" md="3">
                <v-select
                  v-model="defitem_feed"
                  clearable
                  multiple
                  chips
                  placeholder="指定項目"
                  :items="Object.keys(feeddatacols)"
                  v-if="feeddatacols"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" v-for="item in feeddata" :key="item.id">
                <WaterQuality_Vcharts
                  :rowsData="item.items"
                  :legendAliasOut="feeddatacols"
                  xColName="feed_time"
                  :defaultitem="defalutItemList_feed"
                  :loading="feedloading"
                  :title="item.name"
                  :urldata="{
                    sel_main: sel_main,
                    sel_area: sel_area,
                    sel_pool: item.id
                  }"
                ></WaterQuality_Vcharts>
              </v-col>
            </v-row>
            <v-row v-if="feeddata.length < 1 && feedloading == false">
              <v-spacer></v-spacer>
              <v-col cols="4" class="mt-5"><h2>無資料</h2></v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :value="'白蝦監測'"></v-tab-item>
      <!-- </v-tab-items> -->
    </v-tabs>
  </div>
</template>

<script>
import treelst from "~/components/treeList.vue";
import Ind1 from "./Indicator/ind1";
import _ from "lodash";
import WaterQuality_Vcharts from "@/components/sheet/waterQuality_vcharts";
import dayjs from "dayjs";
export default {
  layout: "emptynologin",
  components: {
    treelst,
    Ind1,
    WaterQuality_Vcharts
  },
  data() {
    return {
      mypanel: 0,
      sel_main: "",
      sel_area: "",
      clickeditem: "",
      defitem: "",
      //items: ["A1", "A2"],
      tabs: [
        { name: "水質監測" },
        { name: "投餵/池體數據" },
        { name: "白蝦監測" }
      ],
      currenttab: "水質監測",
      tree: [],
      initiallyOpen: ["研發一廠"],
      files: {
        html: "mdi-language-html5",
        js: "mdi-nodejs",
        json: "mdi-code-json",
        md: "mdi-language-markdown",
        pdf: "mdi-file-pdf",
        png: "mdi-file-image",
        txt: "mdi-file-document-outline",
        xls: "mdi-file-excel",
        group: "select-group",
        openedgroup: "select-inverse",
        pool: "mdi-pool"
      },
      items2: [
        {
          name: "研發 0 廠"
        },
        {
          name: "研發 1 廠",
          pond_area: [
            {
              name: "武曲",
              pond_area: [
                {
                  name: "A1",
                  type: "pool"
                },
                {
                  name: "A2",
                  type: "pool"
                }
              ]
            }
          ]
        }
      ],
      maindata: [],
      mainpool: {
        id: 1,
        name: "A1",
        items: [
          // { name: "體積", item: "volume", value: 140.0, unit: "噸" },
        ]
      },
      footerProps: {
        "items-per-page-text": "每頁",
        "items-per-page-options": [25, 50, 75, 100]
      },
      headers: [
        //  { text: "id", value: "id", groupable: false },
        { text: "name", value: "name", groupable: false },
        { text: "volume", value: "volume", groupable: false },
        { text: "density", value: "density", groupable: false }
      ],
      tableloading: false,
      waterdata: [],
      waterdatacols: {},
      waterloading: false,
      //---日曆
      menu_startdate: false,
      menu_enddate: false,
      sdate: dayjs(new Date(2021, 0, 11))
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      edate: new Date(2021, 0, 5).toISOString().substr(0, 10),
      //---圖片(地圖)
      showmp: false,
      //投餵
      feeddatacols: {}, //欄位
      feedloading: false, //是否載入中
      feeddata: [], //資料
      defitem_feed: "", //預設項目[哪些被勾選]
    };
  },
  methods: {
    openDialog: function(item) {
      this.clickeditem = item ? item.name : ""; //選到子項目才出現資料
      this.$axios.get("http://61.56.172.10/pond-data/").then(res => {});
    },
    closepanel: async function() {
      this.mypanel = [];
      this.waterdata = [];
      //觸發取得水質資料
      //this.waterdata=[];
      if (this.sel_main && this.sel_area) {
        switch (this.currenttab) {
          case "水質監測":
            await this.getwater(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area
            );
            break;
          case "投餵/池體數據":
            await this.getfeed(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area
            );
            break;
          case "白蝦監測":
            break;
          default:
            break;
        }
      }
    },
    areachange: async function() {
      var para = {
        id: this.sel_area
      };

      if (this.sel_area) {
        this.tableloading = true;
        await this.$axios
          .get("http://61.56.172.10/ponds-data/", { params: para })
          .then(res => {
            this.mainpool.items = res.data;
          })
          .finally(() => {
            /* 不論失敗成功皆會執行 */ this.tableloading = false;
          });
      } else {
        this.mainpool.items = [];
      }
    },
    //水質監測
    getwater: async function(start_date, end_date, sel_main, sel_area) {
      this.waterloading = true;
      //水質檢測欄位
      await this.$axios
        .get("http://61.56.172.10/water-quality-col-name/")
        .then(res => {
          this.waterdatacols = res.data;
        });
      //水質檢測資料
      var apiURL = `http://61.56.172.10/water-quality-data/?started_date=${start_date}&ended_date=${end_date}&factory_id=${sel_main}&pond_area_id=${sel_area}`;
      await this.$axios.get(apiURL).then(res => {
        this.waterdata = res.data;
      });
      this.waterloading = false;
    },
    //投餵/池體數據
    getfeed: async function(start_date, end_date, sel_main, sel_area) {
      // 載入中
      this.feedloading = true;
      //欄位
      await this.$axios.get("http://61.56.172.10/feed-col-name/").then(res => {
        this.feeddatacols = res.data;
      });
      //資料
      var apiURL = `http://61.56.172.10/feed-data/?started_date=${start_date}&ended_date=${end_date}&factory_id=${sel_main}&pond_area_id=${sel_area}`;
      await this.$axios.get(apiURL).then(res => {
        this.feeddata = res.data;
      });
      this.feedloading = false;
    },
    //顯示地圖按鈕
    showmpFun: function() {
      this.showmp = !this.showmp;
    }
  },
  async created() {
    await this.$axios.get("http://61.56.172.10/architecture/").then(res => {
      this.maindata = res.data;
    });
    //await this.getwater();
  },
  async mounted() {},
  computed: {
    mpurl: function() {
      return this.sel_main && this.showmp
        ? `/factory_${this.sel_main}.jpg?lazy`
        : "/factory_err.jpg?lazy";
    },
    areadata: function() {
      let filtermain = [];
      filtermain = this.maindata;
      // console.log("maindata node count:",this.maindata[0].node.length);

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
    },
    pooldata: function() {
      let filterarea = _.cloneDeep(this.maindata);
      //filterarea = this.maindata;

      //先篩廠
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
        filterarea.forEach(function(item, index) {
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
    defalutItemList: function() {
      var item = _.cloneDeep(this.waterdatacols);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem && this.defitem.length > 0) {
          // item[key] = this.defitem == key ? true : false;
          item[key] = this.defitem.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_feed: function() {//多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.feeddatacols);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_feed && this.defitem_feed.length > 0) {
          item[key] = this.defitem_feed.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    }
  }
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/v-charts/lib/style.min.css";
</style>
