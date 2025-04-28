<template>
  <div>
    <v-overlay :value="!isLoading" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card class="bg-card">
      <div class="content pt-3">
        <span>
          <h2>{{ this.$options.head().title }}</h2>
        </span>
        <div class="search mb-3">
          <v-row class="mb-0">
            <v-col cols="12" md="3" sm="12" style="position: relative;">
              <locate-select :dataScope="'pool'" :isMulti="false" @scopeSel_data="get_scopeData($event)"
                class="select-template"></locate-select>
            </v-col>
            <v-col cols="1" md="1" sm="1" class="text-center">
              <v-btn class="mx-2" icon small color="primary" @click="refresh()">
                <v-icon>mdi-reload</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <div class="result">
          <div class="result-card">
            <!-- 養殖池 -->
            <v-row class="mb-3 align-stretch" style="height: 100%;" id="chart">
              <!-- 圖表 -->
              <v-col cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">圖表資訊</span>
                      </v-card-title>
                    </div>
                  </div>
                  <div class="content">
                    <v-row class="mb-4">
                      <!-- <v-col cols="12" class="text-center">
                        <el-image :src="nowPool" :preview-src-list="srcList" @click.native="isOriginImg = true"></el-image>
                      </v-col> -->
                      <v-col cols="12" class="text-center">
                        <v-row style="width: 100%;justify-content: flex-end;margin-bottom: 0;">
                          <!-- 選擇起日 -->
                          <div style="padding: 12px;">
                            <v-menu v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40"
                              transition="scale-transition" offset-y min-width="auto">
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="sdate" label="選擇起日" prepend-icon="mdi-calendar" readonly
                                  v-bind="attrs" v-on="on" class="select-color" hide-details
                                  @click:prepend="() => (sdate = getNowDate())"></v-text-field>
                              </template>
                              <v-date-picker v-model="sdate" locale="zh-tw" no-title
                                @input="menu_startdate = false"></v-date-picker>
                            </v-menu>
                          </div>
                          <!-- 選擇迄日 -->
                          <div style="padding: 12px;">
                            <v-menu v-model="menu_enddate" :close-on-content-click="false" :nudge-right="40"
                              transition="scale-transition" offset-y min-width="auto">
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="edate" label="選擇訖日" prepend-icon="mdi-calendar" readonly
                                  v-bind="attrs" v-on="on" class="select-color" hide-details
                                  @click:prepend="() => (edate = getNowDate())"></v-text-field>
                              </template>
                              <v-date-picker v-model="edate" locale="zh-tw" no-title
                                @input="menu_enddate = false"></v-date-picker>
                            </v-menu>
                          </div>
                          <div style="padding: 12px;"><v-autocomplete v-model="defitem" :items="waterdatacols"
                              item-text="name" item-value="name" no-data-text="查無資料" label="*指定項目(必選)" hide-details
                              class="select-color" clearable @change="changeDefItem()">
                              <template v-slot:item="data">{{ `　${data.item.name}` }}</template>
                            </v-autocomplete></div>
                          <div style="padding: 12px;">最小值：<el-input-number v-model="chartmin" controls-position="right"
                              :min="0" style="width:100px;height: 40px;"></el-input-number></div>
                          <div style="padding: 12px;">最大值：<el-input-number v-model="chartmax" controls-position="right"
                              :min="0" style="width:100px;height: 40px;"></el-input-number></div>
                        </v-row>
                        <v-row style="width: 100%;">
                          <WaterQuality_Vcharts2 :rowsData="item.items" xColName="inspected_date" :defaultitem="{}"
                            :loading="waterloading" :title="item.name" :chartmin="chartmin" :chartmax="chartmax"
                            :markdata="markdata" :isIndicator="true" style="width: 100%;min-height: 26vh;">
                          </WaterQuality_Vcharts2>
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <!-- 案場資訊 -->
              <v-col v-if="false" cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">案場資訊</span>
                      </v-card-title>
                    </div>
                    <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                  </div>
                  <div class="content">
                    <v-row class="mb-4">
                      <v-col cols="12">
                        <el-table :data="farmData" class="full-width" max-height="240" size="mini">
                          <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                          <el-table-column prop="item_value" label="數值" width="180"></el-table-column>
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <!-- 養殖資訊 -->
              <v-col cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">養殖資訊</span>
                      </v-card-title>
                    </div>
                    <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                  </div>
                  <div class="content">
                    <v-row class="mb-4">
                      <v-col cols="12">
                        <el-table :data="feedData" class="full-width" max-height="600">
                          <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                          <el-table-column prop="item_value" label="使用量/數值" width="180"></el-table-column>
                          <!-- <el-table-column prop="item_price" label="金額" width="180"></el-table-column> -->
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <!-- 財務-費用 -->
              <v-col v-if="false" cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">財務-累計費用</span>
                      </v-card-title>
                    </div>
                    <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                  </div>
                  <div class="content">
                    <v-row class="mb-4">
                      <v-col cols="12">
                        <el-table :data="feeData_Backup" class="full-width" max-height="500" size="mini">
                          <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                          <el-table-column prop="item_qty" label="使用量" width="180"></el-table-column>
                          <el-table-column prop="item_value" label="金額" width="180"></el-table-column>
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <!-- 財務-收入 -->
              <v-col v-if="false" cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">財務-收入</span>
                      </v-card-title>
                    </div>
                    <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                  </div>
                  <div class="content">
                    <v-row class="mb-4">
                      <v-col cols="12">
                        <el-table :data="incomeData" class="full-width" max-height="240" size="mini">
                          <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                          <el-table-column prop="item_qty" label="使用量" width="180"></el-table-column>
                          <el-table-column prop="item_value" label="金額" width="180"></el-table-column>
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>

        </div>
      </div>
    </v-card>

    <el-image-viewer v-if="isOriginImg" :on-close="() => { isOriginImg = false }" :url-list="srcList" />
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import dayjs from "dayjs";
import WaterQuality_Vcharts2 from "@/components/sheet/waterQuality_vcharts2";
export default {
    layout: "emptynologin2",
    middleware: "auth",
    components: {
        "el-image-viewer": () => import("element-ui/packages/image/src/image-viewer"),
        WaterQuality_Vcharts2,
    },
    head() {
        return {
            title: '歷史數據'
        };
    },
    data() {
      return {
        //---日曆
        menu_startdate: false,
        menu_enddate:false,
        sdate: "",
        // sdate: dayjs(new Date(2021, 0, 11))
        //   .add(-10, "day")
        //   .format("YYYY-MM-DD"),
        edate:"",
        //---chart相關
        waterloading: false, //折線圖，
        defitem: [],
        waterdatacols: [],//可選擇的水質項目
        markdata: { maxline: -999, minline: -999 },
        chartmin: undefined,
        chartmax: undefined,
        item: [{ name: "", items: [] }], // 事件
        //---
        poolid: '',
        isLoading: false,
        isOriginImg: false,
        srcList: [],
        nowPool: '',
        farmData: [{ item_name: '養殖池水位高度(%)', item_value: '15' }, { item_name: '養殖池總水體(噸)', item_value: '834' },
        { item_name: '白蝦放養密度(尾/噸)', item_value: '252' }, { item_name: '白蝦放養總量(尾/水)', item_value: '210168.00' },
        // {item_name: '目標收成重量(公克/尾)', item_value: '35'},
        { item_name: '平均蝦重(g)', item_value: '35' },
        { item_name: '當前育成率', item_qty: '-', item_value: '-' },
        ],
        feedData: [
        //{ item_name: '預估蝦子重量', item_value: '(歷史數據才有)' }, 
        // { item_name: '預估平均每日增重(adg)', item_value: '(歷史數據才有)' }
        //   , { item_name: '預估存活率', item_value: '(歷史數據才有)' }
        //----------------------
        { item_name: '用電量(度)', item_qty: '-', item_value: '10000' },
        //暫隱{ item_name: '攤提契約用電量', item_qty: '-', item_value: '300' },
        { item_name: '飼料(展開show細項)', item_qty: '-', item_value: '-' },
        { item_name: '糖(展開show細項)', item_qty: '-', item_value: '-' },
        { item_name: '益生菌(展開show細項)', item_qty: '-', item_value: '-' },
        { item_name: '水質改善劑(展開show細項)', item_qty: '-', item_value: '-' },
        //暫隱{ item_name: '當前育成率', item_qty: '-', item_value: '-' },
        //暫隱{ item_name: '目標收成蝦重(g)', item_qty: '-', item_value: '-' },
        //暫隱{ item_name: '預估育成率', item_qty: '-', item_value: '-' },
        //暫隱{ item_name: '預估收成總重(公斤)', item_qty: '2000', item_value: '-' },
          //暫隱{ item_name: '檢測費(展開show細項)', item_qty: '-', item_value: '-' }, 
          // { item_name: '檢測費(試劑、儀器)', item_qty: '-', item_value: '-' },
          // { item_name: '檢測費(疾病)', item_qty: 5, item_value: '-' }, 
          //暫隱{ item_name: '雜費(展開show細項)', item_qty: 5, item_value: '-' },
          //暫隱{ item_name: '每月人事費用', item_qty: '-', item_value: '-' },
          //{ item_name: '蝦苗(元/尾)', item_qty: '0.25', item_value: '-' },
          //暫隱{ item_name: '蝦苗(總價)', item_qty: '-', item_value: '60000' },
        ],
        feeData_Backup: [{ item_name: '用電量(度)', item_qty: '-', item_value: '10000' },
        { item_name: '契約用電量', item_qty: '-', item_value: '300' },
        { item_name: '飼料(展開show細項)', item_qty: '10', item_value: '-' },
        { item_name: '糖(展開show細項)', item_qty: '5', item_value: '-' },
        { item_name: '益生菌(展開show細項)', item_qty: '10', item_value: '-' },
        { item_name: '水質改善劑(展開show細項)', item_qty: '-', item_value: '-' },
        { item_name: '檢測費(展開show細項)', item_qty: '-', item_value: '-' },
        //  { item_name: '檢測費(試劑、儀器)', item_qty: '-', item_value: '-' },
        // { item_name: '累計檢測費(疾病)', item_qty: 5, item_value: '-' }, 
        { item_name: '雜費(展開show細項)', item_qty: 5, item_value: '-' },
        { item_name: '人事費用', item_qty: '-', item_value: '-' },
        // { item_name: '蝦苗(元/尾)', item_qty: '0.25', item_value: '-' },
        { item_name: '蝦苗(總價)', item_qty: '-', item_value: '60000' },
        ],
        incomeData: [
          { item_name: '目標收成蝦重(g)', item_qty: '-', item_value: '-' },
          { item_name: '預估育成率', item_qty: '-', item_value: '-' },
          { item_name: '預估收成總重(公斤)', item_qty: '2000', item_value: '-' },
          { item_name: '預估白蝦單價(元/公斤)', item_qty: '383.2', item_value: '-' }, { item_name: '預估收益(元/水)', item_qty: '-', item_value: '766400' },
          { item_name: '單位成本(元/公斤)', item_qty: '-', item_value: '35' },
        ],
      };
    },
  methods: {
    async refresh() {
      this.item = {
        "id": "117",
        "name": "池1",
        "items": [
          {
            "inspected_date": "2025-04-21 00:00:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:01:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:02:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:03:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:04:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:05:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:06:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:07:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:08:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:09:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:10:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:11:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:12:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:13:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:14:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:15:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:16:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:17:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:18:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:19:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:20:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:21:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:22:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:23:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:24:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:25:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:26:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:27:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:28:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:29:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:30:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:31:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:32:53",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:33:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:34:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:35:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:36:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:37:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:38:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:39:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:40:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:41:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:42:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:43:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:44:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:45:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:46:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:47:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:48:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:49:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:50:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:51:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:52:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:53:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:54:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:55:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:56:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:57:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:58:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 00:59:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:00:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:01:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:02:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:03:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:04:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:05:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:06:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:07:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:08:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:09:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:10:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:11:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:12:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:13:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:14:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:15:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:16:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:17:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:18:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:19:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:20:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:21:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:22:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:23:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:24:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:25:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:26:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:27:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:28:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:29:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:30:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:31:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:32:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:33:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:34:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:35:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:36:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:37:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:38:54",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:39:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:40:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:41:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:42:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:43:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:44:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:45:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:46:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:47:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:48:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:49:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:50:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:51:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:52:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:53:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:54:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:55:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:56:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:57:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:58:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 01:59:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:00:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:01:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:02:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:03:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:04:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:05:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:06:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:07:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:08:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:09:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:10:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:11:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:12:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:13:55",
            "水位百分比": 99
          },
          {
            "inspected_date": "2025-04-21 02:14:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:15:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:16:55",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:17:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:18:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:19:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:20:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:21:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:22:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:23:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:24:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:25:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:26:56",
            "水位百分比": 99
          },
          {
            "inspected_date": "2025-04-21 02:27:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:28:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:29:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:30:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:31:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:32:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:33:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:34:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:35:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:36:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:37:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:38:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:39:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:40:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:41:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:42:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:43:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:44:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:45:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:46:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:47:56",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:48:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:49:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:50:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:51:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:52:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:53:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:54:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:55:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:56:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:57:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:58:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 02:59:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:00:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:01:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:02:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:03:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:04:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:05:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:06:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:07:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:08:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:09:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:10:57",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:11:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:12:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:13:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:14:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:15:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:16:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:17:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:18:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:19:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:20:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:21:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:22:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:23:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:24:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:25:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:26:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:27:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:28:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:29:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:30:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:31:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:32:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:33:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:34:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:35:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:36:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:37:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:38:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:39:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:40:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:41:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:42:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:43:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:44:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:45:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:46:58",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:47:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:48:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:49:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:50:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:51:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:52:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:53:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:54:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:55:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:56:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:57:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:58:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 03:59:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:00:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:01:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:02:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:03:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:04:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:05:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:06:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:07:59",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:09:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:10:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:11:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:12:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:13:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:14:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:15:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:16:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:17:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:18:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:19:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:20:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:21:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:22:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:23:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:24:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:25:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:26:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:27:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:28:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:29:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:30:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:31:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:32:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:33:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:34:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:35:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:36:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:37:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:38:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:39:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:40:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:41:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:42:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:43:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:44:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:45:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:46:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:47:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:48:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:49:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:50:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:51:00",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:52:01",
            "水位百分比": 99
          },
          {
            "inspected_date": "2025-04-21 04:53:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:54:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:55:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:56:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:57:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:58:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 04:59:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:00:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:01:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:02:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:03:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:04:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:05:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:06:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:07:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:08:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:09:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:10:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:11:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:12:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:13:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:14:01",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:15:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:16:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:17:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:18:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:19:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:20:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:21:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:22:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:23:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:24:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:25:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:26:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:27:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:28:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:29:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:30:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:31:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:32:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:33:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:34:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:35:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:36:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:37:02",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:38:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:39:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:40:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:41:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:42:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:43:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:44:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:45:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:46:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:47:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:48:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:49:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:50:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:51:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:52:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:53:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:54:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:55:03",
            "水位百分比": 99
          },
          {
            "inspected_date": "2025-04-21 05:56:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:57:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:58:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 05:59:03",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:00:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:01:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:02:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:03:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:04:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:05:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:06:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:07:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:08:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:09:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:10:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:11:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:12:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:13:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:14:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:15:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:16:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:17:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:18:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:19:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:20:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:21:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:22:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:23:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:24:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:25:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:26:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:27:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:28:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:29:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:30:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:31:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:32:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:33:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:34:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:35:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:36:04",
            "水位百分比": 100
          },
          {
            "inspected_date": "2025-04-21 06:37:04",
            "水位百分比": 100
          }
        ]
      };
    },
    changeDefItem() {
      // 清除項目
      if (this.defitem == null) {
        this.defitem = [];
      }
    },
    //取得指標上下限資料  
    getLimitData: async function () {
      let getColDataList = await this.getColDataList();
      let data = typeof (getColDataList) == 'string' ? [] : getColDataList;
      var lmtitem = data.filter(x => x.name_ch == this.defitem);
      if (lmtitem.length > 0) {//不可以有null值
        this.markdata.maxline = (lmtitem[0].critical_max == null) ? -999 : lmtitem[0].critical_max;
        this.markdata.minline = (lmtitem[0].critical_min == null) ? -999 : lmtitem[0].critical_min;
      } else {
        this.markdata.maxline = -999;
        this.markdata.minline = -999;
      }
    },
    async getAllUser() {
      let getuserData = await this.getUserList();
      this.userData = typeof getuserData === 'string' ? [] : getuserData.filter(x => x.is_active);
      this.isLoading = true;
    },
    get_scopeData(evt) {
      this.poolid = evt;
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
  },
    async mounted() {
        await this.getAllUser();
        window.addEventListener('resize', () => {
            this.tableHeight = window.innerHeight - 208;
            this.innerWidth = window.innerWidth;
        });
    },
    async created() {
      //抓欄位資料 waterdatacols ，coldata
      var myitem = [];
      let getAllColForSearchList = await this.getAllColForSearchList();
      let data = typeof (getAllColForSearchList) == 'string' ? [] : getAllColForSearchList;
      var group = Array.from(new Set(data.map(x => x.group)));
      for (let i = 0; i < group.length; i++) {
        const element = group[i];
        if (i != 0) {
          myitem.push({ divider: true });
        }
        myitem.push({ header: element });//group name
        myitem.push(...data.filter(x => x.group == element).map(x => ({ 'name': x.name_ch, 'value': x.name_en })));
      }
      this.waterdatacols = myitem;
    },
};
</script>

<style lang="scss" scoped>
.v-sheet.result-card.pool-detail.v-card:not(.v-sheet--outlined) {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
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


</style>