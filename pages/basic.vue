<template>
  <div>
    <v-expansion-panels class="mb-6" v-model="mypanel">
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down">
          選擇條件
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="grey lighten-5">
            <v-row no-gutters>
              
              <v-col cols="12" md="3">
                <v-card class="pa-2" outlined tile min-height="300px">
                  <v-select
                    :items="maindata"
                    item-value="id"
                    item-text="name"
                    label="選擇廠"
                    clearable
                    v-model="sel_main"
                  ></v-select>
                  <v-select
                    v-model="sel_area"
                    :items="areadata"
                    item-value="id"
                    item-text="name"
                    clearable
                    @change="areachange"
                    label="選擇區域"
                  ></v-select>
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
      </v-expansion-panel>
    </v-expansion-panels>
    <v-tabs v-model="currenttab" background-color="blue lighten-2" dark>
      <v-tab v-for="(tab, idx) in tabs" :key="idx" :href="'#tab-' + tab.name">
        {{ tab.name }}
      </v-tab>

      <v-tabs-items v-model="currenttab">
        <v-tab-item
          v-for="(tab, idx) in tabs"
          :key="idx"
          :value="'tab-' + tab.name"
        >
          <v-card flat>
            <v-card-text>
              <h2>{{ tab.name }}</h2>

              <v-row>
                <v-col cols="12" md="4">
                  <water-quality defaultitem="density" chartId="mmm"></water-quality>
                </v-col>
                <v-col cols="12" md="4">
                  <WaterQuality_Vcharts></WaterQuality_Vcharts>
                </v-col>
                <v-col cols="12" md="4">
                  <Ind1></Ind1>
                </v-col>
                <v-col cols="12" md="4">
                  <Ind1></Ind1>
                </v-col>
                <v-col cols="12" md="4">
                  <Ind1></Ind1>
                </v-col>
                <v-col cols="12" md="4">
                  <Ind1></Ind1>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item> </v-tabs-items
    ></v-tabs>
  </div>
</template>

<script>
import treelst from "~/components/treeList.vue";
import Ind1 from "./Indicator/ind1";
import _ from "lodash";
import WaterQuality from "@/components/sheet/waterQuality";
import WaterQuality_Vcharts from "@/components/sheet/waterQuality_vcharts";
export default {
  layout: "emptynologin",
  components: {
    treelst,
    Ind1,
    WaterQuality,WaterQuality_Vcharts
  },
  data() {
    return {
      mypanel: [],
      sel_main: "",
      sel_area: "",
      clickeditem: "",
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
        { text: "density", value: "density", groupable: false },
      ],
      tableloading:false
    };
  },
  methods: {
    openDialog: function(item) {
      this.clickeditem = item ? item.name : ""; //選到子項目才出現資料
      this.$axios.get("http://61.56.172.10/pond-data/").then(res => {
        console.log(res.data);
      });
    },
    closepanel: function() {
      this.mypanel = [];
    },
    areachange:async function() {
      var para = {
        id: this.sel_area
      };

      if (this.sel_area) {
        this.tableloading = true;
        await this.$axios.get("http://61.56.172.10/ponds-data/",{ params: para })
        .then(res => {
          this.mainpool.items=res.data;
        })
        .finally(() => { /* 不論失敗成功皆會執行 */this.tableloading = false; })
        ;
      }else{
        this.mainpool.items=[];
      }

    }
  },
  created() {
    // this.$axios.get("/idapi/architecture/").then(res => {
    //   //maindata
    //   this.maindata = res.data;
    // });
    this.$axios.get("http://61.56.172.10/architecture/").then(res => {
      this.maindata = res.data;
    });
  },
  computed: {
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
          console.log("item", item);
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
    }
  }
};
</script>

<style scoped></style>
