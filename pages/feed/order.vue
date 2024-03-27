<template>
  <div>
    <v-card 
      class="bg-card" 
      style="margin-bottom: 12px;"
      :style="{'minHeight':`${windowHeight>880?'88vh':'84vh'}`}">
      <!-- <div class="card-title">
          <v-row style="margin-bottom: 0;">
              <div class="title">
                  <v-icon>mdi-file-edit-outline</v-icon>
                  <v-card-title>料量設定</v-card-title>
              </div>
          </v-row>
      </div> -->
      <div class="content" style="padding-top:12px">
        <!-- 搜尋欄 -->
        <div class="search">
          <v-row style="margin-bottom: 12px;">
            <v-col cols="12" md="6">
              <div class="search-container">
                <!-- 選擇場 -->
                <locate-select :dataScope="'field'" :defaultSelect="factoryData.length>0?factoryData[0].name+'_'+factoryData[0].id:''" :isMulti="false" @scopeSel_data="get_scopeData($event)" class="select-template"></locate-select>
                <!-- 放養中 -->
                <v-checkbox
                  v-model="showFeeding"
                  dense hide-details
                  :label="`只顯示放養中`"
                  class="checkbox-feed"
                ></v-checkbox>
              </div>
            </v-col>
          </v-row>
        </div>
        <!-- 搜尋結果 -->
        <div class="result">
          <v-row style="margin-bottom: 0;">
            <v-col cols="12">
              <v-card class="result-card" style="height: 100%">
                <v-data-table
                  ref="feedtable"
                  :headers="headers"
                  :items="(showFeeding)?desserts.filter(x => x.factory_id == factoryid && [`放養中`,`放養中(鎖排汙)`].includes(x.state)):desserts.filter(x => x.factory_id == factoryid)"
                  item-key="pond_id"
                  sort-by="pond_name"
                  group-by="area_name"
                  class="elevation-1"
                  :height="`${windowHeight>880?'56vh':'48vh'}`"
                  :show-group-by="false"
                  :footer-props="{
                    'items-per-page-text': '每頁',
                    'items-per-page-options': [-1, 25, 50, 100]
                  }"
                  no-data-text="查無資料"
                >
                  <!-- group -->
                  <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
                    <th :colspan="headers.length"  style="margin-top: 12px;">
                      <v-icon @click="toggle"
                        >{{ isOpen ? "mdi-chevron-up" : "mdi-chevron-down" }}
                      </v-icon>
                      {{ items[0].area_name }}
                    </th>
                  </template>
                  <!-- initial_val投餵量 -->
                  <template v-slot:[`item.initial_val`]="{ item }">
                    <v-row style="margin: 8px 0;">
                      <v-col cols="12" sm="9" style="padding: 0 8px;">
                        <v-autocomplete
                          v-model="item.feed_combo_id"
                          :items="combo_sorted"
                          dense
                          hide-details
                          filled
                          clearable
                          item-text="name_ch"
                          item-value="id"
                          placeholder="選擇飼料(套餐)"
                          @change="setformula_val(item)"
                        >
                        <template v-slot:item="data">
                          
                          {{data.item.name_ch}}
                          <span class="ml-3" style="color:red;" v-if="data.item.is_absoluteTop">
                            <!-- <v-icon color="red">mdi-new-box</v-icon> -->
                            <v-btn class="pa-0"  x-small outlined color="red darken-3" style="color:#C62828 !important;" disabled width="30">new</v-btn>
                          </span>
                          <span class="ml-3" v-else>
                            <!-- <v-chip x-small outlined color="amber darken-3" label v-if="data.item.usage_count>0">{{data.item.usage_count}}</v-chip> -->
                            <v-btn class="pa-0" x-small outlined color="amber darken-3" style="color:#FF8F00 !important;" disabled width="30"  v-if="data.item.usage_count>0">{{data.item.usage_count}}</v-btn>
                          <!-- <v-progress-circular :rotate="360" :value="(data.item.usage_count)?data.item.usage_count:0" color="teal">
                            {{ (data.item.usage_count)?data.item.usage_count:0 }}
                          </v-progress-circular> -->
                          </span>
                        </template>
                        </v-autocomplete>
                        <v-text-field
                          clearable
                          dense
                          filled
                          hide-details
                          placeholder="數值"
                          v-model.number="item.initial_val"
                          type="number"
                          @input="setformula_val(item)"
                          ><span slot="append">g</span>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" style="padding: 0 8px;">
                        <v-btn tile class="btn-primary btn-secondary" @click="()=>{item.initial_val = formula_eval(item.initial_val, formula);setformula_val(item);}" :disabled="!formula || !item.initial_val">
                          計算
                        </v-btn>
                      </v-col>
                      <!-- <v-spacer></v-spacer> -->
                    </v-row>
                  </template>
                  <!-- 主成分-->
                  <template v-slot:[`item.main_items`]="{ item }">
                    <v-row class="ma-1" dense>
                      <div class="chip" style="display: flex;flex-direction:column">
                        <v-row style="margin-bottom: 0;" :style="{justifyContent:`${windowWidth<599.98?'flex-end':'flex-start'}`}">
                          <v-chip
                            v-for="mfla in item.main_items"
                            :key="item.id+'_main_'+mfla.id"
                            :color="item.color"
                            style="font-size: 12px;margin: 2px;"
                            :style="Number(mfla.feed_amount) <= 0 ? 'color:red;' : 'color:white;backgroundColor:#408FBC'"
                            class="main"
                          >
                            {{ mfla.name }}： {{ mfla.feed_amount }}g
                          </v-chip>
                        </v-row>
                      </div>
                    </v-row>
                  </template>
                  <!-- 次成分 -->
                  <template v-slot:[`item.sub_items`]="{ item }">
                    <v-row class="ma-1" dense>
                      <div class="chip" style="display: flex;flex-direction:column">
                        <v-row  style="margin-bottom: 0;" :style="{justifyContent:`${windowWidth<599.98?'flex-end':'flex-start'}`}">
                          <v-chip
                            v-for="fla in item.sub_items"
                            :key="item.id+'_sub_'+fla.id"
                            :color="item.color"
                            style="font-size: 12px;margin: 2px;"
                            :style="Number(fla.feed_amount) <= 0 ? 'color:red;' : 'backgroundColor:#BFCBD2;color: #00324E;'"
                            class="sub"
                          >
                            {{ fla.name }}： {{ fla.feed_amount }}g
                          </v-chip>
                        </v-row>
                      </div>
                    </v-row>
                  </template>
                  <!-- feed_combo_id 套餐id-->
                  <!-- <template v-slot:[`item.feed_combo_id`]="{ item }">
                    <v-row class="ma-1" dense>
                      <v-col cols="12" sm="4">
                    </v-col>
                      <div class="chip" style="display: flex;flex-direction:column">
                        <v-row style="margin-bottom: 0;">
                          <v-chip
                            v-for="mfla in item.main_items"
                            :key="mfla.id"
                            :color="item.color"
                            style="font-size: 12px;margin: 2px;"
                            :style="Number(mfla.feed_amount) <= 0 ? 'color:red;' : 'color:white;backgroundColor:#408FBC'"
                            class="main"
                          >
                            {{ mfla.name }}： {{ mfla.feed_amount }}g
                          </v-chip>
                        </v-row>
                        <v-row  style="margin-bottom: 0;">
                          <v-chip
                            v-for="fla in item.sub_items"
                            :key="fla.id"
                            :color="item.color"
                            style="font-size: 12px;margin: 2px;"
                            :style="Number(fla.feed_amount) <= 0 ? 'color:red;' : 'backgroundColor:#BFCBD2;color: #00324E;'"
                            class="sub"
                          >
                            {{ fla.name }}： {{ fla.feed_amount }}g
                          </v-chip>
                        </v-row>
                      </div>
                    </v-row>
                  </template> -->
                  <!-- 事件 -->
                  <template v-slot:[`item.feed_event_settings_id`]="{item}">
                    <v-autocomplete v-model="item.feed_event_settings_id" filled dense hide-details :items="eventSetData" item-text="title" item-value="id" clearable >
                    </v-autocomplete>
                  </template>
                  <!-- has_observation 放置觀察網 -->
                  <template v-slot:[`item.has_observation`]="{ item }">
                    <div class="observe">
                      <v-simple-checkbox v-model="item.has_observation"></v-simple-checkbox>
                      <div title='觀察網飼料量=投餵量*觀察網飼料百分比'>{{ item.observation_feed_pct }}%</div>
                      <!-- <span v-if="item.is_executed" style="color:red;">已執行</span> -->
                    </div>
                  </template>
                  
                  <template v-slot:[`header.has_observation`]="{ header }">
                    <div class="observe">
                      <v-simple-checkbox
                        v-model="has_observe"
                        @click="has_observe_click"
                        title="有輸入完整資料(投餵量、選擇飼料餐號)才會勾選"
                      ></v-simple-checkbox
                      ><span>{{ header.text }}</span>
                    </div>
                    
                  </template>
                  <!-- top -->
                  <template v-slot:top>
                    <v-toolbar elevation="1" class="header-bar" :style="{height:`${windowWidth<599.98?'88px':'64px'}`}">
                      <v-row :style="{marginBottom:`${windowWidth<599.98?'0':'12px'}`}">
                        <!-- 左側 -->
                        <v-col cols="12" sm="6" style="padding: 8px 12px;">
                          <div class="header-left" style="max-width: 300px;">
                            <!-- 計算 -->
                            <div class="caculator"><v-text-field v-model="formula" title="新值=[原值]*[公式]" placeholder="公式範例:[原值]*[8*(2+5)]，預設相乘" outlined dense hide-details clearable></v-text-field></div>
                            
                          </div>
                        </v-col>
                        <!-- 右側 -->
                        <v-col cols="12" sm="6" style="padding: 8px 12px;">
                          <div class="header-right" :style="{justifyContent:`${windowWidth<599.98?'flex-start':'flex-end'}`}">
                            <!-- 計算 -->
                            <!-- <div class="caculator"><v-text-field v-model="formula" title="新值=[原值]*[公式]" placeholder="公式範例:[原值]*[8*(2+5)]，預設相乘" outlined dense hide-details clearable></v-text-field></div> -->
                            <!-- windowwidth>958.98 icon+文字 -->
                            <div class="data-time">
                              <span style="margin-right: 4px;">資料時間：{{ imptimeidx?sdate+ '-' +imptimeidx:'無' }}</span>
                              <v-tooltip v-if="imptimeidx" bottom >
                                  <template v-slot:activator="{ on, attrs }">
                                      <button class="btn-icon just-icon delete" 
                                        @click="delimpsubmit" 
                                        v-bind="attrs" v-on="on"
                                        style="width: 24px;height: 24px;"
                                        >
                                          <v-icon>mdi-trash-can</v-icon>
                                      </button>
                                  </template>
                                  <span>刪除此場[{{ imptimeidx }}]資料</span>
                              </v-tooltip>
                              <button v-else
                                class="btn-add delete disabled"
                                style="width: 24px;height: 24px;">
                                <v-icon>mdi-trash-can</v-icon>
                              </button>
                            </div>
                            
                            <div v-if="windowWidth>959.98" class="btn-groups">
                              <v-btn class="btn-primary" tile @click="showimport"
                                ><v-icon left>mdi-database-import</v-icon>匯入
                              </v-btn>
                              <v-btn class="btn-primary green" tile @click="showsubmitdig">
                                <v-icon left >mdi-circle-edit-outline</v-icon>設定
                              </v-btn>
                              <v-btn class="btn-primary clear" tile @click="dataclear">
                                <v-icon left>mdi-shimmer</v-icon>清除
                              </v-btn>
                            </div>
                            <!-- windowwidth>958.98 icon+tooltips -->
                            <div v-else class="btn-groups" style="justify-content: flex-start;">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button class="btn-icon" @click="showimport" v-bind="attrs" v-on="on">
                                        <v-icon>mdi-database-import</v-icon>
                                    </button>
                                </template>
                                <span>匯入</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button class="btn-icon green" @click="showsubmitdig" v-bind="attrs" v-on="on">
                                        <v-icon>mdi-circle-edit-outline</v-icon>
                                    </button>
                                </template>
                                <span>設定</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button class="btn-icon clear" @click="dataclear" v-bind="attrs" v-on="on">
                                        <v-icon>mdi-shimmer</v-icon>
                                    </button>
                                </template>
                                <span>清除</span>
                              </v-tooltip>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-toolbar>
                    <v-divider></v-divider>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
    <!-- 匯入資料 -->
    <v-dialog v-model="importdialog" width="400">
      <v-card class="card-dialog custom-dialog" min-height="350">
        <v-card-title>匯入料表</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row align-content="center" class="my-2">
            <!-- 選擇日期sdate -->
            <v-col cols="12" sm="7">
              <v-menu
                v-model="menu_date"
                :close-on-content-click="true"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="sdate"
                    label="選擇日期"
                    filled
                    dense
                    prepend-icon="mdi-calendar"
                    readonly
                    hide-details
                    v-bind="attrs"
                    v-on="on"
                    clearable
                    @click:prepend="() => (sdate = getNowDate())"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="sdate" locale="zh-tw"
                  no-title
                  hide-details
                  @input="menu_sdate = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- 取得料表 -->
            <v-col cols="12" sm="5" align-self="center">
              <v-btn
                class="btn-primary"
                tile
                title="取得料表清單"
                @click="getimptimedata"
                :disabled="!sdate"
                :loading="imploading"
                ><v-icon style="color: #fff;">mdi-reload</v-icon>取得料表</v-btn
              >
            </v-col>
            <!-- 料表清單 -->
            <v-col cols="12">
              <v-list>
                <v-list-item v-for="item in imptimedata" :key="item.time">
                  <v-list-item-content class="text-h5">{{ item.time }}</v-list-item-content>
                  <v-list-item-action
                    ><v-btn class="btn-secondary btn-add" style="width: 40px;height: 40px;min-width: initial;" @click="settabledata(item)" title="帶入此資料"
                      ><v-icon style="font-size: 1.25rem;">mdi-database-export-outline</v-icon></v-btn
                    >
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- 操作 -->
    <v-dialog v-model="submitdig" width="450">
      <v-card min-height="250" class="card-dialog  custom-dialog">
        <v-card-title>設定</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row class="my-2" justify="center">
            <!-- 日期 adate-->
            <v-col cols="12" sm="12">
              <v-menu
                v-model="menu_adate"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="adate"
                    label="選擇日期"
                    filled
                    dense
                    hide-details
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    clearable
                    @click:prepend="() => (adate = getNowDate())"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="adate"
                  no-title
                  locale="zh-tw"
                  @input="menu_adate = false"
                  hide-details
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- 時間 atime-->
            <v-col cols="12" md="7">
              <v-text-field
                v-model="atime"
                value=""
                style="font-color: white"
                dense
                filled
                clearable
                type="time"
                prepend-icon="mdi-timeline-clock-outline"
                hide-details
                @click:prepend="() => (atime = getNowTime())"
              ></v-text-field>
            </v-col>
            <!-- 新增按鈕 -->
            <v-col cols="5">
              <v-btn
                class="btn-primary mb-3"
                tile
                :disabled="!atime || !adate"
                large
                @click="feedsubmit"
                >設定此時間{{ atime }}</v-btn
              >
            </v-col>
            <v-col cols="12" style="font-size:1.2em;line-height: 150%;">
              <span style="color:red;">若已執行修改後需重新執行</span><br/>
              <!-- <span style="color:red;">✔觀察網 = (主成分*0.03) 跟 (次成分*0) 且 (排除 糖)</span> -->
              <span style="color:red;">✔觀察網 = (主成分*[觀察網設定百分比]) 跟 (次成分*0) 且 (排除 糖)</span>
              <!-- <v-btn
                class="primary mb-3"
                tile small
                @click="
                  () => {
                    atime = imptimeidx;
                    adate = sdate;
                  }
                "
                :disabled="!imptimeidx"
                >↑使用原帶入日期時間{{ imptimeidx }}</v-btn
              > -->
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import mee from "math-expression-evaluator";
import dayjs from "dayjs";
import _ from "lodash";
export default {
  layout: "emptynologin2",
  middleware: "auth",
  head(){
    return {
      title:"料量設定",
    }
  },
  data() {
    return {
      headers: [
        //  { text: "區域", value: "factory", align: "right", sortable: false },
        { text: "區域", value: "area_name", align: "right", sortable: false },
        {
          text: "養殖池",
          align: "start",
          value: "pond_name",
          width: 100,
          sortable: false
        },
        {
          text: "投餵量",
          value: "initial_val",
          align: "center",
          width: 300,
          sortable: false
        },
        // { text: "主成份", value: "feedmain", align: "center", width: 200 },
        // {
        //   text: "成份",
        //   value: "feed_combo_id",
        //   align: "center",
        //   sortable: false
        // },
        {
          text: "主成份",
          value: "main_items",
          align: "left",
          width: 200,
          sortable: false
        },
        {
          text: "次成份",
          value: "sub_items",
          align: "left",
          width: 200,
          sortable: false
        },
        {
          text: "事件",
          value: "feed_event_settings_id",
          align: "center",
          width: 150,
          sortable: false
        },
        {
          text: "觀察網",
          value: "has_observation",
          align: "center",
          width: 100,
          sortable: false
        }
        // { text: "Actions", value: "actions", sortable: false }
      ],
      desserts: [
        {
          area: "武曲",
          id: 1,
          name: "A1"
        },
        {
          area: "武曲",
          id: 2,
          name: "A2"
        },
        {
          area: "天府",
          id: 3,
          name: "A1"
        },
        {
          area: "武曲",
          id: 4,
          name: "A3"
        },
        {
          area: "天府",
          id: 5,
          name: "A2"
        }
      ],
      showFeeding:false,//顯示養殖中
      has_observe: false,
      factoryData: [], //場架構
      factoryid: "", //場id
      combo: [],
      //---日曆
      menu_date: false,
      sdate: "",
      //----帶入資料
      importdialog: false,
      imptimedata: [], //取得帶入的資料
      imploading:false,
      //----
      menu_adate: false,
      adate: "",
      atime: "",
      submitdig: false,
      imptimeidx: "",
      //---公式
      formula:"",
      //事件
      eventSetData:[],
      feed_pct_list:[],
      windowWidth:window.innerWidth,
      windowHeight:window.innerHeight,
    };
  },
  computed:{
    combo_sorted(){
      // let nowDate =  dayjs(new Date())
      //   .add(-7, "day")
      //   .format("YYYY-MM-DD");
      //   console.log(nowDate);
      var data = this.combo.sort(function(a,b){return (a.created_time > b.created_time)?1:-1;});
      let days=-7;
      var ddd = new Date(Date.now() + days * 24*60*60*1000);
      //PART 1先做小於指定日期(7天內)的部分
      var data_part1 = data.filter(x=>new Date(x.created_time)>=ddd).sort(function(a,b){
        var a1 = new Date(a.created_time);
        var b1 = new Date(b.created_time);
        a['is_absoluteTop']= true;
        b['is_absoluteTop']= true;
        if (a1 > b1) {  return -1; }
        if (a1 < b1) { return 1 }
        if (a1 == b1) { return 0 }
      });
      //part 2做計數最大的排上面 先排序usage_count
      var data_part2 = data.filter(x=>new Date(x.created_time)<ddd).sort(function(a,b){
        var a1 = a.usage_count;
        var b1 = b.usage_count;
        if (a1 > b1) { return -1 }
        if (a1 < b1) { return 1 }
        if (a1 == b1) { return 0 }
      });
      var data_final = data_part1.concat(data_part2);
      // //a 是第2個，b 是當前這個, return 1 b(當前值)放到後面 -1不換，相等為0
      // var result = data.sort(function(a,b){
      // //   let days=-7;
      // //  var ddd = new Date(Date.now() + days * 24*60*60*1000);
      //   var bb = new Date(b.created_time);
      //   // var aa = new Date(aa.created_time);
      //   if(bb >= ddd){
      //     console.log("★★★★★★★★★★★★★★★★",b.created_time);
      //     //7天內的項目(b會大於ddd)，愈接近現在，數值會愈大
      //     return 1;
      //   }else{
      //     return -1;
      //   }
      // });
      return  data_final;
    }
  },
  methods: {
    get_scopeData(evt) {
      // console.log('Change Field',evt.split('_')[0]);
      // console.log('factory data',this.factoryData);
      this.dataclear();
      this.sdate = '';
      this.imptimedata = [];
      let fieldId = evt.split('_')[evt.split('_').length-1];
      this.factoryid = fieldId;
      // console.log('Change Field',fieldId);
    },
    // 飼料表設定-清單
    eventSetGet:async function(){
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-event-settings/`)
        .then(res => {
          this.eventSetData = res.data;
          console.log("飼料表設定-清單 api:", res.request.responseURL);
        })
        .catch(err => {
          this.$toast.error(`飼料表設定-清單 失敗:${err.message}`, { duration: 2000 });
        });
    },
    //觀察網全選
    has_observe_click: async function() {
      if (this.has_observe) {
        var data = this.desserts.filter(
          x =>
            x.feed_combo_id > 0 &&
            x.initial_val > 0 &&
            x.factory_id == this.factoryid
        ); //抓有選飼料餐號、填投餵量
        // 放置觀察網 打勾
        data.forEach(element => {
          element.has_observation = true;
        });
      } else {
        var data = this.desserts.filter(
          x =>
            x.feed_combo_id > 0 &&
            x.initial_val > 0 &&
            x.factory_id == this.factoryid
        ); //抓有選飼料餐號、填投餵量
        // 放置觀察網 打勾
        data.forEach(element => {
          element.has_observation = false;
        });
      }
    },
    //取得套餐清單(飼料設定)
    getcombodata: async function() {
      this.combo = [];
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/`;
      await this.$axios
        .get(url)
        .then(res => {
          this.combo = res.data.filter(x=>x.is_enable==true);
          this.comboidx = null;
          this.combofield = {};
          console.log("取得得套餐清單(飼料設定)API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error(`取得得套餐清單(飼料設定)失敗:${error}`, {
            duration: 2000
          });
        })
        .finally(() => {
          //this.getdata();
        });
    },
    showimport: function() {
      this.importdialog = true;
    },
    setformula_val: async function(item) {
      var item = item;

      var initial_val = item.initial_val;
      if (this.combo.filter(x => x.id == item.feed_combo_id).length > 0) {
        //選到餐點
        var subitem = this.combo.filter(x => x.id == item.feed_combo_id)[0]
          .sub_items;
        var main_items = this.combo.filter(x => x.id == item.feed_combo_id)[0]
          .main_items;
        //主成份
        var my_main_items = [];
        main_items.forEach(element => {
          var val = this.formula_eval(initial_val, element.formula);
          var ele = Object.assign({}, element);
          ele["feed_amount"] = Number(val); //數值為feed_amount
          my_main_items.push(ele);
        });
        // 次成份
        var my_sub_items = [];
        subitem.forEach(element => {
          var val = this.formula_eval(initial_val, element.formula);
          var ele = Object.assign({}, element);
          ele["feed_amount"] = Number(val); //數值為feed_amount
          my_sub_items.push(ele);
        });
      } else {
        // debugger;
      }
      item.main_items = my_main_items;
      item.sub_items = my_sub_items;
    },
    getNowTime: function() {
      let mytime = dayjs().format("HH:mm");
      return mytime;
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    formula_eval: function(feed, formula) {
      feed = feed == undefined || isNaN(feed) || feed == null ? 0 : feed;
      var data = isNaN(formula.substr(0, 1))
        ? `${feed}${formula}`
        : `${feed}*${formula}`;
      var result;
      try {
        //避免出現其他無法解決符號
        result = mee.eval(data).toFixed(2);
      } catch (error) {
        result = 0;
      }
      return result;
    },
    //送出新增料表
    feedsubmit: async function() {
      //先確認投餵資料筆數是否已有資料
      let feedurl = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-record-rows/`;
      var feedparm = {
        feed_time: `${this.adate} ${this.atime}`,
        factory_id: this.factoryid
      }
      var datecount = 0;
      var errormsg = "";
      await this.$axios
      .get(feedurl,{params:feedparm})
      .then(res=>{
        if(res.status==200){
          datecount = res.data.data_rows;
          this.imptimedata = []; //清空取得的帶入資料
          this.sdate = '';
          this.stime = '';
          console.log('feedparm',feedparm);
        }else{
          datecount = -1;
          errormsg = res.data;
        }
      })
      .catch(error=>{
        datecount=-1;
        errormsg = error
      });
      if(datecount==-1){
        this.$toast.error(`發生錯誤：${errormsg}`,{duration:2000});
          return
      }
      if(datecount>0 && confirm(`當日已有資料是否覆蓋資料，原資料${datecount}筆將被刪除`)==false) {
        return;
      }
      var data = this.desserts.filter(
        x =>
          x.feed_combo_id > 0 &&
          x.initial_val > 0 &&
          x.factory_id == this.factoryid
      ); //抓有選飼料餐號、填投餵量
      // console.log('儲存資料',data);
      var parm = {
        feed_time: `${this.adate} ${this.atime}`,
        factory_id:Number(this.factoryid),
        created_user: this.$auth.$state.user.email,
        data: data
      };
      console.log("parm", parm);
      // 有資料再進行新增
      if(data.length>0) {
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-record/`;
        await this.$axios
          .post(url, parm)
          .then(res => {
            if (res.data == "新增成功") {
              this.dataclear(); //清除資料
              this.submitdig = false;//關閉dialog
              this.$toast.success(`新增成功`, {
                duration: 2000
              });
            } else {
              this.$toast.error(`新增失敗:${res.data}`, {
                duration: 2000
              });
            }
            console.log("新增API:" + res.request.responseURL);
          })
          .catch(error => {
            this.$toast.error(`新增失敗:${error}`, {
              duration: 2000
            });
          })
          .finally(() => {
            //
          });
      }else {
        this.$toast.success(`新增失敗:請先設定養殖池的料量`, {
          duration: 2000
        });
      }
      
    },
    //取得的觀察網飼料百分比
    getfeedpct:async function(){
      let pondurl = `${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`;
      await this.$axios
        .get(pondurl)
        .then(res=>{
          if(res.data.length>0){
            this.feed_pct_list = res.data;
          }
        })
        .catch(error => {
          this.$toast.error(`取得觀察網飼料百分比失敗:${error}`, {
            duration: 2000
          });
        });
        
    },
    //取得場架構
    getarchitecture: async function() {
      //抓水池的觀察網飼料百分比
      await this.getfeedpct();
      
      // var wc_state=[];
      // var tf_state=[];
      // var zw_state=[];
      // var sp_state=[];
      var all_state=[];
      //#region 池狀態
      //all
      await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/state-of-all-pools/`)
        .then(res => {
          all_state = res.data;
          /**
           * [
              {id: 82, name: '0-1', area_name: '紫微', state: '無'},...
              ]
           */
        });
      /*
      await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/wc-state/`)
        .then(res => {
          var keys = Object.keys(res.data);
          for (var key in keys) {
            key = keys[key];
            wc_state.push(...res.data[key]);
          }
          // 
          // [
          //  {
          //    id: 3
          //    name: "C1"
          //    state: "放養中(鎖排汙)"
          //    updated_time: "2023-08-24 14:15:29"
          //    updated_user: ""
          //  },...
          // ]
          // 
        });
      await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/tf-state/`)
        .then(res => {
          var keys = Object.keys(res.data);
          for (var key in keys) {
            key = keys[key];
            tf_state.push(...res.data[key]);
          }
        });
      await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/zw-state/`)
        .then(res => {
          var keys = Object.keys(res.data);
          for (var key in keys) {
            key = keys[key];
            var keys2 = Object.keys(res.data[key]);
            for (var key2 in keys2) {
              key2 = keys2[key2];
              zw_state.push(...res.data[key][key2]);  
            }
            
          }
        });
      await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/sp-state/`)
        .then(res => {
          var keys = Object.keys(res.data);
          
          for (var key in keys) {
            key = keys[key];
            var keys3 = Object.keys(res.data[key]);
            for (var key3 in keys3) {
              key3 = keys3[key3];
              sp_state.push(res.data[key][key3]);  
            }
            
          }
        });
      */

      // let url = `${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`;
      // await this.$axios
      //   .get(url)
      //   .then(res => {
      //     this.factoryData = res.data;
      //     // this.factoryid = res.data[0].id;
      //     var item = [];
          
      //     res.data.forEach(element => {
      //       //[{id:1,level:"1",name:一場,node:[area_no: "tf",id: 1,level: "2",name: "天府",node: Array(36)]}]
      //       if (element.hasOwnProperty("node")) {
      //         const factory_id = element.id;
      //         for (let i = 0; i < element.node.length; i++) {
      //           const ele = element.node[i];
      //           // ele.node
      //           //   .filter(x => x.visible == true)
      //           //   .map(x => (x.area_name = ele.name));
      //           //把天府名稱放入area_name,把池名稱放入pond_name
      //           //把事件放入feed_event_settings_id
      //           //把放置觀察網放入has_observation
      //           //把是否執行放入is_executed
      //           ele.node
      //             .filter(x => x.visible == true)
      //             .map(x => {
      //               (x.area_name = ele.name),
      //                 (x.pond_name = x.name),
      //                 (x.pond_id = x.id),
      //                 (x.feed_event_settings_id = ""),
      //                 (x.has_observation = false),
      //                 (x.is_executed = false);
      //             }); //把天府名稱放入area_name,把池名稱放入pond_name,池id放入pond_id

                
                
      //           ele.node
      //             .filter(x => x.visible == true)
      //             .map(x => (x.factory_id = factory_id)); //把場id放入
                
      //           ele.node.filter(x=>x.visible==true)//把飼料百分比放入
      //               .map(x=>(
      //                 x.observation_feed_pct = (this.feed_pct_list.filter(y=>y.id==x.id).length==1)?this.feed_pct_list.filter(y=>y.id==x.id)[0].observation_feed_pct:0
      //               ));

      //             // ele.node內容
      //             //{
      //             //     "id": 1,
      //             //     "name": "A1",
      //             //     "level": "3",
      //             //     "visible": true,
      //             //     "area_name": "武曲",
      //             //     "pond_name": "A1",
      //             //     "pond_id": 1,
      //             //     "feed_event_settings_id": "",
      //             //     "has_observation": false,
      //             //     "is_executed": false,
      //             //     "factory_id": 1,
      //             //     "observation_feed_pct": 40
      //             // }
                    
                    
      //           //把池狀態放入
      //           //all
      //           ele.node.filter(x=>x.visible== true)
      //             .map(x=>{
      //               x.state = (all_state.filter(y => y.id == x.pond_id).length == 1)? (all_state.filter(y => y.id == x.id)[0].state) : ""
      //             });
      //             /*
      //           //wc
      //           ele.node.filter(x => x.visible == true && x.area_name=='武曲')
      //             .map(x => (
      //               x.state = (wc_state.filter(y => y.id == x.pond_id).length == 1) ? (wc_state.filter(y => y.id == x.id)[0].state) : ""
      //             ));
      //           //tf
      //           ele.node.filter(x => x.visible == true && x.area_name=='天府')
      //             .map(x => (
      //               x.state = (tf_state.filter(y => y.id == x.pond_id).length == 1) ? (tf_state.filter(y => y.id == x.id)[0].state) : ""
      //             ));
      //           //zw
      //           ele.node.filter(x => x.visible == true && x.area_name=='紫微')
      //             .map(x => (
      //               x.state = (zw_state.filter(y => y.id == x.pond_id).length == 1) ? (zw_state.filter(y => y.id == x.id)[0].state) : ""
      //             ));
      //           //sp
      //           ele.node.filter(x => x.visible == true && x.area_name=='救地球')
      //             .map(x => (
      //               x.state = (sp_state.filter(y => y.id == x.pond_id).length == 1) ? (sp_state.filter(y => y.id == x.id)[0].state) : ""
      //             ));
      //           */

      //           var getdata = ele.node.filter(x => x.visible == true);
      //           item.push(..._.cloneDeep(getdata));
                  
      //         }
      //       }
      //     });
      //     this.desserts = item;
      //     this.has_observe = false;
      //     // console.log("完整資料：",this.desserts);
      //     console.log("取得場架構API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.$toast.error(`取得場架構失敗:${error}`, {
      //       duration: 2000
      //     });
      //   })
      //   .finally(() => {
      //     //this.getdata();
      //   });
      
      let architectureData = await this.getArchitecture();
      this.factoryData = typeof (architectureData)=='string'?[]:architectureData;
      // this.factoryid = res.data[0].id;
      var item = [];
      let data = _.cloneDeep(this.factoryData);
      data.forEach(element => {
        //[{id:1,level:"1",name:一場,node:[area_no: "tf",id: 1,level: "2",name: "天府",node: Array(36)]}]
        if (element.hasOwnProperty("node")) {
          const factory_id = element.id;
          for (let i = 0; i < element.node.length; i++) {
            const ele = element.node[i];
            // ele.node
            //   .filter(x => x.visible == true)
            //   .map(x => (x.area_name = ele.name));
            //把天府名稱放入area_name,把池名稱放入pond_name
            //把事件放入feed_event_settings_id
            //把放置觀察網放入has_observation
            //把是否執行放入is_executed
            ele.node
              .filter(x => x.visible == true)
              .map(x => {
                (x.area_name = ele.name),
                  (x.pond_name = x.name),
                  (x.pond_id = x.id),
                  (x.feed_event_settings_id = ""),
                  (x.has_observation = false),
                  (x.is_executed = false);
              }); //把天府名稱放入area_name,把池名稱放入pond_name,池id放入pond_id

            
            
            ele.node
              .filter(x => x.visible == true)
              .map(x => (x.factory_id = factory_id)); //把場id放入
            
            ele.node.filter(x=>x.visible==true)//把飼料百分比放入
                .map(x=>(
                  x.observation_feed_pct = (this.feed_pct_list.filter(y=>y.id==x.id).length==1)?this.feed_pct_list.filter(y=>y.id==x.id)[0].observation_feed_pct:0
                ));

              // ele.node內容
              //{
              //     "id": 1,
              //     "name": "A1",
              //     "level": "3",
              //     "visible": true,
              //     "area_name": "武曲",
              //     "pond_name": "A1",
              //     "pond_id": 1,
              //     "feed_event_settings_id": "",
              //     "has_observation": false,
              //     "is_executed": false,
              //     "factory_id": 1,
              //     "observation_feed_pct": 40
              // }
                
                
            //把池狀態放入
            //all
            ele.node.filter(x=>x.visible== true)
              .map(x=>{
                x.state = (all_state.filter(y => y.id == x.pond_id).length == 1)? (all_state.filter(y => y.id == x.id)[0].state) : ""
              });
              /*
            //wc
            ele.node.filter(x => x.visible == true && x.area_name=='武曲')
              .map(x => (
                x.state = (wc_state.filter(y => y.id == x.pond_id).length == 1) ? (wc_state.filter(y => y.id == x.id)[0].state) : ""
              ));
            //tf
            ele.node.filter(x => x.visible == true && x.area_name=='天府')
              .map(x => (
                x.state = (tf_state.filter(y => y.id == x.pond_id).length == 1) ? (tf_state.filter(y => y.id == x.id)[0].state) : ""
              ));
            //zw
            ele.node.filter(x => x.visible == true && x.area_name=='紫微')
              .map(x => (
                x.state = (zw_state.filter(y => y.id == x.pond_id).length == 1) ? (zw_state.filter(y => y.id == x.id)[0].state) : ""
              ));
            //sp
            ele.node.filter(x => x.visible == true && x.area_name=='救地球')
              .map(x => (
                x.state = (sp_state.filter(y => y.id == x.pond_id).length == 1) ? (sp_state.filter(y => y.id == x.id)[0].state) : ""
              ));
            */

            var getdata = ele.node.filter(x => x.visible == true);
            item.push(..._.cloneDeep(getdata));
              
          }
        }
      });
      this.desserts = item;
      this.has_observe = false;
    },
    //刪除帶入的資料
    delimpsubmit: async function() {
      const factory_name = this.factoryData.filter(
        x => x.id == this.factoryid
      )[0].name;
      var parm = {
        factory_id: this.factoryid,
        feed_time: `${this.sdate} ${this.imptimeidx}`
      };
      if (
        confirm(
          `是否刪除所有資料\n注意：包含已確認執行的資料!!!\n場：${factory_name}\n時間：${parm.feed_time}`
        )
      ) {
        console.log(parm);
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-record-batch-delete/`;
        await this.$axios
          .post(url, parm)
          .then(res => {
            if (res.data == "刪除成功") {
              this.dataclear(); //清除資料
              this.imptimedata = []; //清空取得的帶入資料
              this.sdate = '';
              this.stime = '';
              this.$toast.success(
                `刪除${factory_name}[${parm.feed_time}]成功`,
                {
                  duration: 2000
                }
              );
            } else {
              this.$toast.success(`刪除失敗:${res.data}`, {
                duration: 2000
              });
            }
            console.log("刪除API:" + res.request.responseURL);
          })
          .catch(error => {
            this.$toast.error(`刪除失敗:${error}`, {
              duration: 2000
            });
          })
          .finally(() => {
            //
          });
      }
    },
    //取得帶入的資料-取得料表
    getimptimedata: async function() {
      // this.imptimedata = [
      //   {
      //     id: 1, //資料id
      //     time: "01:00",
      //     data: [
      //       {
      //         id: 115, //池id
      //         area_name: "武曲",
      //         pond_name: "A1",
      //         factory_id: 1, //場id
      //         level: "1", //不需要
      //         visible: true,
      //         initial_val: 111, //投餵量
      //         feed_combo_id: 3, //套餐id
      //         main_items: [
      //           //主成份
      //           {
      //             id: 1, //要紀錄的主成份id
      //             name: "蝦料1",
      //             item_no: "10001",
      //             formula: "*0.7",
      //             remark: "",
      //             val: "77.70" //要紀錄的主成份值
      //           },
      //           {
      //             id: 2,
      //             name: "蝦料2",
      //             item_no: "10002",
      //             formula: "*0.3",
      //             remark: "",
      //             val: "33.30"
      //           }
      //         ],
      //         sub_items: [
      //           //次成份
      //           {
      //             id: 8,
      //             name: "水1",
      //             item_no: "10025",
      //             formula: "*1.2",
      //             remark: "",
      //             val: "133.20"
      //           },
      //           {
      //             id: 6,
      //             name: "糖1",
      //             item_no: "10005",
      //             formula: "*0.8",
      //             remark: "",
      //             val: "88.80"
      //           }
      //         ]
      //       },
      //       {
      //         id: 115,
      //         area_name: "test",
      //         pond_name: "A1",
      //         level: "3",
      //         visible: true,
      //         factory_id: 30
      //       }
      //     ]
      //   },
      //   {
      //     id: 2,
      //     time: "15:00",
      //     data: [
      //       {
      //         id: 115,
      //         name: "A1",
      //         level: "3",
      //         visible: true,
      //         area: "test",
      //         factory_id: 30
      //       }
      //     ]
      //   }
      // ];
      this.imploading=true;//載入中
      this.imptimedata=[];//清空清單
      var para = {
        feed_date: this.sdate,
        factory_id: this.factoryid
      };
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-record/`, {
          params: para
        })
        .then(res => {
          this.imptimedata = res.data;
          res.data.sort(function(a,b){
            var a1 = a.time.replace(":","");
            var b1 = b.time.replace(":","");
            if(a1 > b1){return 1};
            if(a1 < b1){return -1};
            return 0;
          });
          console.log("取得帶入的資料API:" + res.request.responseURL);
          console.log("取資料",this.imptimedata);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        })
        .finally(() => {
          this.imploading=false;
        });
    },
    //設定帶入資料
    settabledata: async function(item) {
      console.log('帶入資料',item);
      console.log('dessert',this.desserts)
      await this.dataclear(); //歸零
      var data = _.cloneDeep(item.data);
      this.imptimeidx = item.time; //time即index
      this.factoryid = data[0].factory_id; //第1筆資料即為首選場
      var desserts = this.desserts;
      let thisfeed_pct_list = this.feed_pct_list;
      for (let idx = 0; idx < data.length; idx++) {
        //資料塞進去
        const pond_id = data[idx].pond_id;
        data[idx].is_executed = false;//強制把執行狀態刪除
        var dessitem = desserts.filter(x => x.pond_id == pond_id);
        var dataitem = data.filter(x => x.pond_id == pond_id);//取代資料
        //帶入觀察網百分比
        data[idx]['observation_feed_pct'] = (thisfeed_pct_list.filter(y=>y.id==data[idx]['pond_id']).length==1)?thisfeed_pct_list.filter(y=>y.id==data[idx]['pond_id'])[0].observation_feed_pct:0;
        if (dessitem.length == 0) {

          //沒有這id，塞進去
          desserts.push(data[idx]);
        } else {
          // 有這id，蓋上去
          // console.log(
          //   "covered:",
          //   pond_id,
          //   data[idx].area_name,
          //   data[idx].pond_name,
          //   data[idx]
          // );
          if(data[idx].area_name=='救地球'){
            // debugger;
          }
          var deleteidx = desserts.indexOf(dessitem[0]);
          //有帶入的資料與原本的不同，不能直接刪然後塞上，要補回資料
          data[idx].feed_event_settings_id = dataitem[0].feed_event_settings_id;
          data[idx].has_observation = dataitem[0].has_observation;
          data[idx].observation_feed_pct = dataitem[0].observation_feed_pct;
          
          data[idx].is_executed = dessitem[0].is_executed;
          data[idx].state = dessitem[0].state;
          data[idx].id = dessitem[0].pond_id;
          data[idx].level = dessitem[0].level;
          data[idx].visible = dessitem[0].visible;

          desserts.splice(deleteidx, 1);
          desserts.push(data[idx]);
          // desserts.filter(x => x.id == id)[0] = _.cloneDeep(data[idx]);
        }
      }

      var setdata = new Set(data.map(x => x.factory_id));
      var listdata = [...setdata];
      var tostmsg = [];
      listdata.forEach(factory => {
        var facname = this.factoryData.filter(x => x.id == factory)[0].name;
        var cnt = data.filter(x => x.factory_id == factory).length;
        tostmsg.push(`${facname}帶入${cnt}筆資料`);
      });
      
      this.$toast.success(`${tostmsg.join("<br/>")}`, { duration: 2000 });
      this.desserts = desserts;
      this.importdialog = false;
    },
    //顯示送出視窗
    showsubmitdig: function() {
      this.submitdig = true;
    },
    //清除資料
    dataclear: async function() {
      this.imptimeidx = null;
      await this.getarchitecture(); //取得場架構
    },
  },

  async mounted() {
    await this.eventSetGet();//取得事件清單
    await this.getcombodata(); //取得套餐清單(飼料設定)
    await this.getarchitecture(); //取得場架構
    //表格group預設是false
    let table = this.$refs.feedtable;
    // 表格尚未準備好時換頁，造成vnode undefined，因為此時table為undefined，因此需要另外判斷，避免錯誤
    if(table) {
      let keys = Object.keys(table.$vnode.componentInstance.openCache);
      keys.forEach(x => {
        table.$vnode.componentInstance.openCache[x] = false;
      });
    }
    
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    });
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
  },
  watch: {
    windowWidth() {
      this.windowWidth = window.innerWidth;
    },
    windowHeight() {
      this.windowWidth = window.innerHeight;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-application--is-ltr {
  .search {
    .search-container {
      display: flex;
      align-items: center;
    }
    .checkbox-feed {
      flex: 1;
      .v-input--selection-controls__input {
        margin-right: 4px;
      }
    }
  }
  .v-sheet.result-card.v-card:not(.v-sheet--outlined) {
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .v-card.result-card {
    padding: 12px 24px;
    padding-bottom: 8px;
    background-color: #E6F5FA;
    .data-time {
      display: flex;
      align-items: center;
    }
    .btn-groups {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      // width: 100%;
      max-width: 280px;
    }
    button {
      &.v-btn:not(.v-btn--round).v-size--default {
        padding: 0 12px;
      }
      .theme--light.v-data-table {
        background-color: $color-lighten;
      }
      .result-content {
        padding: 0 24px;

      }
    }
  }
}
.v-application .elevation-1{
  box-shadow: none !important;
  // & table {
  //   min-height: 48vh;
  // }
}
.v-application--is-ltr .v-input--selection-controls__input {
  margin-right: 0;
}
::v-deep {
  .result {
    margin-top: -8px;
    
    // .v-data-table__wrapper {
      // height: 40vh;
      // overflow: scroll;
    // }
    .theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
      background: transparent;
    }
    .theme--light.v-card {
      background-color: $color-lighten;
    }
    .theme--light.v-data-table,.theme--light.v-data-table thead th {
      background: $color-lighten;
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
      border-bottom: none;
    }
    .theme--light.v-data-table tbody {
      border-radius: 4px;
      color: $color-dark;
    }
    .theme--light.v-data-table .v-row-group__header {
      background: $color-primary-25;
      border-radius: 4px 4px 0 0 !important;
      margin-bottom: 4px;
      th {
        border-radius: 4px 4px 0 0 !important;
      }
      button {
        background-color: transparent;
      }
      
      .mdi:before {
        color: $color-dark;
      }
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
      background: rgba($color-primary-25,0.3);
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr.v-row-group__header:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
      background: $color-primary-25;
    }
    .v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot,
    .v-text-field--filled.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot {
      min-height: 36px;
    }
    .theme--light.v-text-field--filled:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot:hover {
      background: transparent;
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table .observe {
      display: flex;
      align-items: center;
    }

    // header
    .header-bar {
      background-color: $color-lighten;
      padding: 12px 0 !important;
      .theme--light.v-tabs > .v-tabs-bar,.theme--light.v-tabs-items,
      .theme--light.v-data-table,.v-toolbar__content, .v-toolbar__extension {
        background-color: $color-lighten;
      }
      .theme--light.v-data-table,.theme--light.v-toolbar.v-sheet {
          background-color: $color-lighten;
      }
      .v-toolbar__content, .v-toolbar__extension {
        padding: 0;
        button {
          // height: 36px;
          border-radius: 4px;
        }
        .v-btn--is-elevated {
          box-shadow: none;
          background-color: $color-primary;
          color: #fff;
        }
        .theme--light.v-btn.v-btn--disabled {
          color: $color-dark-50;
        }
      }
      .v-toolbar__content {
        width: 100%;
      }
      .v-tab {
        font-size: 18px;
        font-weight: bold;
        color: $color-dark-50 !important;
        .icons {
          margin-right: 4px;
          i {
            color: $color-dark-50;
          }
          
        }
      }
      .v-tab.v-tab--active {
        color: $color-primary !important;
        .icons {
          margin-right: 4px;
          i {
            color: $color-primary;
          }
          
        }
      }
      .theme--light.v-tabs .v-tab--active:hover::before,.theme--light.v-tabs .v-tab:hover::before {
        border-radius: 4px;
      }
      
      // top
      .header-right,.header-left {
        display: flex;
        align-items: center;
        width: 100%;
      }
      // .header-right {
        // justify-content: flex-end;
      // }
      .caculator {
        width: 100%;
        // max-width: 300px;
        margin: 4px;
        .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
          color: $color-form;
        }
      }
    }
  }
  // .v-card.card-dialog {
  //   .theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
  //     background: transparent;
  //   }
  // }  
}

</style>
