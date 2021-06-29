<template>
  <div>
    <v-expansion-panels class="mb-6" v-model="mypanel">
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down">
          選擇條件
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="grey lighten-5">
            <v-row v-if="showmp && sel_main">
              <v-col cols="12" v-if="sel_main">
                <!-- <v-img v-img
                  :src="mpurl"
                  class="grey lighten-2"
                  v-if="showmp && sel_main"
                ></v-img> -->
                <!-- <img preview="0"  :preview-text="maindata[sel_main-1].name" v-img -->
                <img
                  v-img
                  :src="mpurl"
                  width="100%"
                  :alt="maindata[sel_main - 1].name"
                  class="grey lighten-2"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12">
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
                        @click:prepend="() => (sdate = getNowDate())"
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
                        @click:prepend="() => (edate = getNowDate())"
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
              <!-- <v-divider vertical></v-divider> -->
              <v-col cols="12">
                <!-- <wj-flex-grid
                  id="sample-grid"
                  :frozenRows="2"
                  :frozenColumns="1"
                  :itemsSource="mainpool.items"
                >
                </wj-flex-grid> -->
                <el-table
                  :data="mainpool.items"
                  style="width: 100%"
                  max-height="300"
                >
                  <!-- headers{ text: "name", value: "name", groupable: false }, -->
                  <el-table-column
                    v-for="(item, key) in headers"
                    :fixed="item.text == fixedname"
                    :prop="item.value"
                    :label="item.text"
                    :key="key"
                    align="center"
                    :width="item.text == fixedname ? 70 : 150"
                  >
                  </el-table-column>
                </el-table>
                <v-data-table
                  :headers="headers"
                  :items="mainpool.items"
                  item-key="unit"
                  :footer-props="footerProps"
                  no-data-text="查無資料"
                  disable-sort
                  :loading="tableloading"
                  height="300px"
                  v-if="false"
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
              <v-col cols="12" md="3">
                <v-select
                  v-model="defPool.水質"
                  clearable
                  multiple
                  chips
                  placeholder="顯示養殖池"
                  :items="waterdata.map(x=>x['name'])"
                  v-if="waterdatacols"
                  no-data-text="查無資料"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-col cols="12" md="4"> 使用echarts
                  <water-quality defaultitem="density" chartId="mmm"></water-quality>
                </v-col> -->
              <v-col cols="12" md="4" v-for="item in waterdata" :key="item.id" v-show="(defPool.水質.includes(item.name) || (defPool.水質.length==0) )">
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
      <v-tab-item :value="'投餵飼料'">
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
               <v-col cols="12" md="3">
                <v-select
                  v-model="defPool.飼料"
                  clearable
                  multiple
                  chips
                  placeholder="顯示養殖池"
                  :items="feeddata.map(x=>x['name'])"
                  v-if="feeddatacols"
                  no-data-text="查無資料"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" v-for="item in feeddata" :key="item.id" v-show="(defPool.飼料.includes(item.name) || (defPool.飼料.length==0) )">
                <WaterQuality_Vcharts
                  :rowsData="item.items"
                  :legendAliasOut="feeddatacols"
                  xColName="inspected_date"
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
      <v-tab-item :value="'環境監測'">
        <v-overlay :value="envloading" :absolute="true">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card flat min-height="900px">
          <v-card-text>
            <v-row
              v-if="Object.keys(envdatacols).length > 0 && envloading == false"
            >
              <v-col cols="12" md="3">
                <v-select
                  v-model="defitem_env"
                  clearable
                  multiple
                  chips
                  placeholder="指定項目"
                  :items="Object.keys(envdatacols)"
                  v-if="envdatacols"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="defPool.環境"
                  clearable
                  multiple
                  chips
                  placeholder="顯示養殖池"
                  :items="envdata.map(x=>x['name'])"
                  v-if="envdatacols"
                  no-data-text="查無資料"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" v-for="item in envdata" :key="item.id" v-show="(defPool.環境.includes(item.name) || (defPool.環境.length==0) )">
                <WaterQuality_Vcharts
                  :rowsData="item.items"
                  :legendAliasOut="envdatacols"
                  xColName="inspected_date"
                  :defaultitem="defalutItemList_env"
                  :loading="envloading"
                  :title="item.name"
                  :urldata="{
                    sel_main: sel_main,
                    sel_area: sel_area,
                    sel_pool: item.id
                  }"
                ></WaterQuality_Vcharts>
              </v-col>
            </v-row>
            <v-row v-if="envdata.length < 1 && envloading == false">
              <v-spacer></v-spacer>
              <v-col cols="4" class="mt-5"><h2>無資料</h2></v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :value="'飼料觀察網'">
        <v-overlay :value="envloading" :absolute="true">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card flat min-height="900px">
          <v-card-text>
            <v-row
              v-if="Object.keys(obsdatacols).length > 0 && obsloading == false"
            >
              <v-col cols="12" md="3">
                <v-select
                  v-model="defitem_obs"
                  clearable
                  multiple
                  chips
                  placeholder="指定項目"
                  :items="Object.keys(obsdatacols)"
                  v-if="obsdatacols"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="defPool.觀察"
                  clearable
                  multiple
                  chips
                  placeholder="顯示養殖池"
                  :items="obsdata.map(x=>x['name'])"
                  v-if="obsdatacols"
                  no-data-text="查無資料"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" v-for="item in obsdata" :key="item.id" v-show="(defPool.觀察.includes(item.name) || (defPool.觀察.length==0) )">
                <WaterQuality_Vcharts
                  :rowsData="item.items"
                  :legendAliasOut="obsdatacols"
                  xColName="inspected_date"
                  :defaultitem="defalutItemList_obs"
                  :loading="obsloading"
                  :title="item.name"
                  :urldata="{
                    sel_main: sel_main,
                    sel_area: sel_area,
                    sel_pool: item.id
                  }"
                ></WaterQuality_Vcharts>
              </v-col>
            </v-row>
            <v-row v-if="obsdata.length < 1 && obsloading == false">
              <v-spacer></v-spacer>
              <v-col cols="4" class="mt-5"><h2>無資料</h2></v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :value="'進階值'">
        <v-overlay :value="advloading" :absolute="true">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card flat min-height="900px">
          <v-card-text>
            <v-row
              v-if="Object.keys(advdatacols).length > 0 && advloading == false"
            >
              <v-col cols="12" md="3">
                <v-select
                  v-model="defitem_adv"
                  clearable
                  multiple
                  chips
                  placeholder="指定項目"
                  :items="Object.keys(advdatacols)"
                  v-if="advdatacols"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="defPool.進階"
                  clearable
                  multiple
                  chips
                  placeholder="顯示養殖池"
                  :items="advdata.map(x=>x['name'])"
                  v-if="advdatacols"
                  no-data-text="查無資料"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" v-for="item in advdata" :key="item.id" v-show="(defPool.進階.includes(item.name) || (defPool.進階.length==0) )">
                <WaterQuality_Vcharts
                  :rowsData="item.items"
                  :legendAliasOut="advdatacols"
                  xColName="inspected_date"
                  :defaultitem="defalutItemList_adv"
                  :loading="advloading"
                  :title="item.name"
                  :urldata="{
                    sel_main: sel_main,
                    sel_area: sel_area,
                    sel_pool: item.id
                  }"
                ></WaterQuality_Vcharts>
              </v-col>
            </v-row>
            <v-row v-if="advdata.length < 1 && advloading == false">
              <v-spacer></v-spacer>
              <v-col cols="4" class="mt-5"><h2>無資料</h2></v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :value="'投餵益生菌'">
        <v-overlay :value="pbioloading" :absolute="true">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card flat min-height="900px">
          <v-card-text>
            <v-row
              v-if="
                Object.keys(pbiodatacols).length > 0 && pbioloading == false
              "
            >
              <v-col cols="12" md="3">
                <v-select
                  v-model="defitem_pbio"
                  clearable
                  multiple
                  chips
                  placeholder="指定項目"
                  :items="Object.keys(pbiodatacols)"
                  v-if="pbiodatacols"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="defPool.益生菌"
                  clearable
                  multiple
                  chips
                  placeholder="顯示養殖池"
                  :items="pbiodata.map(x=>x['name'])"
                  v-if="pbiodatacols"
                  no-data-text="查無資料"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" v-for="item in pbiodata" :key="item.id" v-show="(defPool.益生菌.includes(item.name) || (defPool.益生菌.length==0) )">
                <WaterQuality_Vcharts
                  :rowsData="item.items"
                  :legendAliasOut="pbiodatacols"
                  xColName="inspected_date"
                  :defaultitem="defalutItemList_pbio"
                  :loading="pbioloading"
                  :title="item.name"
                  :urldata="{
                    sel_main: sel_main,
                    sel_area: sel_area,
                    sel_pool: item.id
                  }"
                ></WaterQuality_Vcharts>
              </v-col>
            </v-row>
            <v-row v-if="pbiodata.length < 1 && pbioloading == false">
              <v-spacer></v-spacer>
              <v-col cols="4" class="mt-5"><h2>無資料</h2></v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import treelst from "~/components/treeList.vue";
import Ind1 from "./Indicator/ind1";
import _ from "lodash";
import WaterQuality_Vcharts from "@/components/sheet/waterQuality_vcharts";
import dayjs from "dayjs";
import https from "https";
//-----
import "element-ui/lib/theme-chalk/index.css";
export default {
  layout: "emptynologin",
  middleware: "auth",
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
      defPool: {水質:[],環境:[],飼料:[],觀察:[],進階:[],益生菌:[]},
      //items: ["A1", "A2"],
      tabs: [
        { name: "水質監測" },
        { name: "環境監測" },
        { name: "投餵飼料" },
        { name: "飼料觀察網" },
        { name: "進階值" },
        { name: "投餵益生菌" }
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
      fixedname: "養殖池",
      headers: [
        //  { text: "id", value: "id", groupable: false },
        { text: "養殖池", value: "name", groupable: false },
        { text: "體積", value: "volume", groupable: false },
        { text: "密度", value: "density", groupable: false },
        { text: "深度", value: "depth", groupable: false },
        { text: "小池數", value: "num", groupable: false },
        { text: "狀態", value: "state", groupable: false },
        { text: "放養日期", value: "started_date", groupable: false },
        {
          text: "預估收成日期",
          value: "eliminated_ended_date",
          groupable: false
        },
        { text: "初始放養隻數", value: "init_num", groupable: false },
        { text: "累積飼料量", value: "feed_accumulation", groupable: false }
      ],
      tableloading: false,
      waterdata: [],
      waterdatacols: {},
      waterloading: false,
      //---日曆
      menu_startdate: false,
      menu_enddate: false,
      sdate: dayjs(new Date())
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      // sdate: dayjs(new Date(2021, 0, 11))
      //   .add(-10, "day")
      //   .format("YYYY-MM-DD"),
      edate: new Date().toISOString().substr(0, 10),
      // edate: new Date(2021, 0, 5).toISOString().substr(0, 10),
      //---圖片(地圖)
      showmp: false,
      //投餵
      feeddatacols: {}, //欄位
      feedloading: false, //是否載入中
      feeddata: [], //資料
      defitem_feed: "", //預設項目[哪些被勾選]
      //環境
      envdatacols: {}, //欄位
      envloading: false, //是否載入中
      envdata: [], //資料
      defitem_env: "", //預設項目[哪些被勾選]
      //飼料觀察網
      obsdatacols: {}, //欄位
      obsloading: false, //是否載入中
      obsdata: [], //資料
      defitem_obs: "", //預設項目[哪些被勾選]
      //進階值
      advdatacols: {}, //欄位
      advloading: false, //是否載入中
      advdata: [], //資料
      defitem_adv: "", //預設項目[哪些被勾選]
      //益生菌
      pbiodatacols: {}, //欄位
      pbioloading: false, //是否載入中
      pbiodata: [], //資料
      defitem_pbio: "" //預設項目[哪些被勾選]
    };
  },
  methods: {
    openDialog: function(item) {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      this.clickeditem = item ? item.name : ""; //選到子項目才出現資料
      this.$axios
        .get("https://61.56.172.10/pond-data/", { httpsAgent: agent })
        .then(res => {});
    },
    closepanel: async function() {
      this.mypanel = [];

      //觸發取得水質資料
      //this.waterdata=[];
      if (this.sel_main && this.sel_area) {
        switch (this.currenttab) {
          case "水質監測":
            this.waterdata = [];
            await this.getwater(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area
            );
            break;
          case "投餵飼料":
            await this.getfeed(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area
            );
            break;
          case "環境監測":
            await this.getenv(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area
            );
            break;
          case "飼料觀察網":
            await this.getobs(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area
            );
            break;
          case "進階值":
            await this.getadv(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area
            );
            break;
          case "投餵益生菌":
            await this.getpbio(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area
            );
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
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      if (this.sel_area) {
        this.tableloading = true;
        await this.$axios
          .get(
            "https://61.56.172.10/ponds-data/",
            { params: para },
            { httpsAgent: agent }
          )
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
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      //水質檢測欄位
      await this.$axios
        .get("https://61.56.172.10/water-quality-col-name/", {
          httpsAgent: agent
        })
        .then(res => {
          this.waterdatacols = res.data;
        });
      //水質檢測資料
      var apiURL = `https://61.56.172.10/water-quality-data/?started_date=${start_date}&ended_date=${end_date}&factory_id=${sel_main}&pond_area_id=${sel_area}`;
      await this.$axios.get(apiURL, { httpsAgent: agent }).then(res => {
        this.waterdata = res.data;
      });
      this.waterloading = false;
    },
    //投餵/池體數據
    getfeed: async function(start_date, end_date, sel_main, sel_area) {
      // 載入中
      this.feedloading = true;
      //欄位
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      await this.$axios
        .get("https://61.56.172.10/feed-col-name/", { httpsAgent: agent })
        .then(res => {
          this.feeddatacols = res.data;
        });
      //資料
      var apiURL = `https://61.56.172.10/feed-data/?started_date=${start_date}&ended_date=${end_date}&factory_id=${sel_main}&pond_area_id=${sel_area}`;
      await this.$axios.get(apiURL, { httpsAgent: agent }).then(res => {
        this.feeddata = res.data;
      });
      this.feedloading = false;
    },
    //環境
    getenv: async function(start_date, end_date, sel_main, sel_area) {
      // 載入中
      this.envloading = true;
      //欄位
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      await this.$axios
        .get("https://61.56.172.10/env-col-name/", { httpsAgent: agent })
        .then(res => {
          this.envdatacols = res.data;
        });
      //資料
      var apiURL = `https://61.56.172.10/env-data/?started_date=${start_date}&ended_date=${end_date}&factory_id=${sel_main}&pond_area_id=${sel_area}`;
      await this.$axios.get(apiURL, { httpsAgent: agent }).then(res => {
        this.envdata = res.data;
      });
      this.envloading = false;
    },
    //飼料觀察網
    getobs: async function(start_date, end_date, sel_main, sel_area) {
      // 載入中
      this.obsloading = true;
      //欄位
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      await this.$axios
        .get("https://61.56.172.10/observation-col-name/", {
          httpsAgent: agent
        })
        .then(res => {
          this.obsdatacols = res.data;
        });
      //資料
      var apiURL = `https://61.56.172.10/observation-data/?started_date=${start_date}&ended_date=${end_date}&factory_id=${sel_main}&pond_area_id=${sel_area}`;
      await this.$axios.get(apiURL, { httpsAgent: agent }).then(res => {
        this.obsdata = res.data;
      });
      this.obsloading = false;
    },
    //進階值
    getadv: async function(start_date, end_date, sel_main, sel_area) {
      // 載入中
      this.advloading = true;
      //欄位
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      await this.$axios
        .get("https://61.56.172.10/advance-col-name/", { httpsAgent: agent })
        .then(res => {
          this.advdatacols = res.data;
        });
      //資料
      var apiURL = `https://61.56.172.10/advance-data/?started_date=${start_date}&ended_date=${end_date}&factory_id=${sel_main}&pond_area_id=${sel_area}`;
      await this.$axios.get(apiURL, { httpsAgent: agent }).then(res => {
        this.advdata = res.data;
        console.log(this.advdata);
      });
      this.advloading = false;
    },
    //投餵益生菌
    getpbio: async function(start_date, end_date, sel_main, sel_area) {
      // 載入中
      this.advloading = true;
      //欄位
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      await this.$axios
        .get("https://61.56.172.10/probiotics-col-name/", { httpsAgent: agent })
        .then(res => {
          this.pbiodatacols = res.data;
        });
      //資料
      var apiURL = `https://61.56.172.10/probiotics-data/?started_date=${start_date}&ended_date=${end_date}&factory_id=${sel_main}&pond_area_id=${sel_area}`;
      await this.$axios.get(apiURL, { httpsAgent: agent }).then(res => {
        this.pbiodata = res.data;
        console.log(this.pbiodata);
      });
      this.pbioloading = false;
    },
    //顯示地圖按鈕
    showmpFun: function() {
      this.showmp = !this.showmp;
    },
    showpool: function(data) {
      console.log(data.name);
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    }
  },
  async created() {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    await this.$axios
      .get("https://61.56.172.10/architecture/", { httpsAgent: agent })
      .then(res => {
        this.maindata = res.data;
      });
  },
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
    defalutItemList_feed: function() {
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.feeddatacols);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_feed && this.defitem_feed.length > 0) {
          item[key] = this.defitem_feed.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_env: function() {
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.envdatacols);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_env && this.defitem_env.length > 0) {
          item[key] = this.defitem_env.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_obs: function() {
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.obsdatacols);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_obs && this.defitem_obs.length > 0) {
          item[key] = this.defitem_obs.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_adv: function() {
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.advdatacols);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_adv && this.defitem_adv.length > 0) {
          item[key] = this.defitem_adv.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_pbio: function() {
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.pbiodatacols);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_pbio && this.defitem_pbio.length > 0) {
          item[key] = this.defitem_pbio.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    }
  },
  async beforeCreate() {
    if (this.$auth.$state.loggedIn) {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      let acclist = [];
      await this.$axios
        .get("https://61.56.172.10/user-access/account/", { httpsAgent: agent })
        .then(res => {
          acclist = res.data;
        });
      var acc = acclist.filter(x => x.帳號 == this.$auth.$state.user.email && x.狀態 == true);
      //登入成功
      if (acc.length == 1) {
        //增加身份判別---
        const updatedUser = { ...this.$auth.user };
        updatedUser.role = "user"; //允許登入的
        updatedUser.authcheck = true; //授權可登入
        this.$auth.setUser(updatedUser); //會造成Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        //--------------
      } else {
        //登入失敗
        const updatedUser = { ...this.$auth.user };
        updatedUser.role = "guest";
        updatedUser.authcheck = false;
        this.$auth.setUser(updatedUser); //會造成Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        this.$router.push({ name: "loginfail" });
      }
    }
  }
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/v-charts/lib/style.min.css";
</style>
