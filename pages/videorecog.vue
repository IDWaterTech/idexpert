<template>
  <div>
    <v-overlay :value="!isLoading" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card class="bg-card">
        <!-- <div class="card-title">
            <v-row style="margin-bottom: 0;">
                <div class="title">
                    <v-icon>mdi-video-box</v-icon>
                    <v-card-title>影像辨識</v-card-title>
                </div>
            </v-row>
        </div> -->
        <div class="content" style="padding-top:12px">
          <div class="search" style="margin-bottom: 12px;">
            <v-row style="margin-bottom: 0;">
              <v-col cols="12" md="3" class="caculate" sm="12" style="position: relative;">
                <locate-select :dataScope="'pool'" defaultSelect="" :isMulti="false" @scopeSel_data="get_scopeData($event)" class="select-template"></locate-select>
                <!-- <label v-if="nowPool!==''" class="label-select">*請選擇養殖區域(必選)</label> -->
              </v-col>
              <!-- 選擇起日 -->
              <v-col cols="12" md="2" sm="12"  class="caculate">
                <v-menu class="my-1" v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40"
                  transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="sdate" label="選擇起日" prepend-icon="mdi-calendar" readonly v-bind="attrs" hide-details
                      v-on="on" clearable @click:prepend="() => (sdate = getNowDate())"></v-text-field>
                  </template>
                  <v-date-picker v-model="sdate" @input="menu_startdate = false" locale="zh-tw" no-title></v-date-picker>
                </v-menu>
              </v-col>
              <!-- 選擇訖日 -->
              <v-col cols="12" md="2" sm="12"  class="caculate">
                <v-menu class="my-1" v-model="menu_enddate" :close-on-content-click="false" :nudge-right="40"
                  transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="edate" label="選擇訖日" prepend-icon="mdi-calendar" readonly v-bind="attrs" hide-details
                      v-on="on" clearable @click:prepend="() => (edate = getNowDate())"></v-text-field>
                  </template>
                  <v-date-picker v-model="edate" @input="menu_enddate = false" locale="zh-tw" no-title></v-date-picker>
                </v-menu>
              </v-col>
              <!-- 選擇類別 觀察網/菌相 -->
              <v-col cols="12" md="3" sm="12" align-self="center"  class="caculate">
                <v-radio-group class="my-1" row v-model="dataClass" mandatory @change="()=>{recogData={}}" hide-details>
                  <v-radio v-for="(item, i) in dataClassList" :label="item.name" :value="item.name" :key="i">
                    <span slot="label" class="flex-align-center">
                      <v-icon class="mr-1">{{ item.icon }}</v-icon>{{ `${item.name}` }}
                    </span></v-radio>
                </v-radio-group>
              </v-col>
              <!-- 查詢 -->
              <v-col cols="12" md="2" sm="12">
                <div class="flex-align-center" style="justify-content: flex-end;margin-right: 16px;">
                  <v-btn
                    tile
                    @click="getRecog"
                    :disabled="(!(sdate && edate))||(poolid==undefined||poolid==''||poolid==null)"
                    class="btn-primary"
                    >查詢</v-btn
                  >
                  <v-tooltip v-if="dataClass == '菌相'" bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="btn-secondary green" @click="openBacteria('add')" v-bind="attrs" v-on="on">新增</v-btn>
                      </template>
                      <span>新增菌相資料</span>
                  </v-tooltip>
                  <div class="step" v-if="innerWidth <= 768">
                    <span class="subtitle-1 red--text">每日早上7:00從GCP下載所有昨日非空池狀態養殖池的觀察網資料</span>
                    <v-btn class="btn-secondary" @click="stepLoad()">同步</v-btn>
                    <!-- <v-tooltip v-if="dataClass == '菌相'" bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="btn-secondary green" @click="openBacteria('add')" v-bind="attrs" v-on="on">新增</v-btn>
                      </template>
                      <span>新增菌相資料</span>
                    </v-tooltip> -->
                  </div>
                  
                </div>
              </v-col>
            </v-row>
            <div class="step" v-if="innerWidth>768">
              <v-row class="flex-center-between" style="margin-bottom: 0;">
                <v-col cols="11" style="padding: 0 12px;width: 100%;">
                  <span class="subtitle-1 red--text">每日早上7:00從GCP下載所有昨日非空池狀態養殖池的觀察網資料</span>
                  <v-btn class="btn-secondary" @click="stepLoad()">同步</v-btn>
                </v-col>
                <!-- <v-col v-if="dataClass == '菌相'" cols="1" style="padding: 0 12px;">
                  <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="btn-secondary green" @click="openBacteria('add')" v-bind="attrs" v-on="on">新增</v-btn>
                      </template>
                      <span>新增菌相資料</span>
                  </v-tooltip>
                  
                </v-col> -->
              </v-row>
            </div>
            
          </div>
          <!-- 搜尋結果 -->
          <div class="result">
            <v-row style="margin-bottom: 0;width: 100%;">
              <v-col cols="12">
                <v-card class="result-card">
                  <!-- 觀察網 -->
                  <v-data-table
                    v-if="dataClass == '觀察網'"
                    class="edit-table data-table bg-transparent"
                    :headers="headers"
                    :items="recogData.items" dense
                    :footer-props="footerProps"
                    no-data-text="查無資料"
                    height="56vh"
                    fixed-header>
                    <template v-slot:[`item.feed_img`]="{ item }">
                      <!-- <img :src="item.feed_img" style="height:200px"> -->
                      <!-- <div slot-scope="scope"> -->
                        <img v-img="{ group: item.id }" :src="item.feed_img" :style="{height:`${innerWidth>768?'120px':'80px'}`}" />
                      <!-- </div> -->
                    </template>
                    <template v-slot:[`item.shrimp_img`]="{ item }">
                      <!-- <img :src="item.shrimp_img" style="height:200px"> -->
                      <img v-img="{ group: item.id }" :src="item.shrimp_img" :height="`${innerWidth>768?'120px':'80px'}`" />
                    </template>
                    <template v-slot:[`item.shrimp`]="{ item }">
                      <div style="text-align: left;display: flex;justify-content: flex-start;">
                        <span v-html="item.shrimp" style="line-height: 24px;word-break: break-all;" :style="{textAlign:`${innerWidth>599.98?'left':'right'}`}"></span>
                      </div>
                    </template>
                  </v-data-table>

                  <!-- 菌盤 -->
                  <v-data-table
                    v-if="dataClass == '菌相'"
                    class="edit-table"
                    :headers="headers"
                    :items="recogData.items" dense
                    :footer-props="footerProps"
                    no-data-text="查無資料"
                    height="56vh"
                    fixed-header>
                    <template v-slot:[`item.images`]="{ item }">
                        <img v-img="{ group: item.id }" v-for="(img,i) in item.images" :key="i" :src="img" :style="{height:`${innerWidth>768?'120px':'80px'}`}" />
                        <span v-if="item.images.length>0"><br>共{{item.images.length}}張</span>
                    </template>
                    <template v-slot:[`item.info`]="{item}">
                      <span>加熱：</span><span  :style="(item.is_heated)?'color:red;':''">{{ item.is_heated? '有' : '無' }}</span><br/>
                      <span>水樣稀釋倍率：{{ item.dilution }}</span><br/>
                      <span>塗盤體積：{{ item.volume }}</span><br/>
                      <span>檢驗時間：{{ item.inspected_time }}</span>
                    </template>
                    <template v-slot:[`item.class`]="{ item }">
                      <div style="text-align: left;display: flex;justify-content: flex-start;">
                        <span v-html="item.class" style="line-height: 24px;word-break: break-all;" :style="{textAlign:`${innerWidth>599.98?'left':'right'}`}"></span>
                      </div>
                    </template>
                    <template v-slot:[`item.action`]="{item}">
                      <!-- <v-btn class="btn-icon"  @click="openBacteria('edit',item)">
                          <v-icon color="white">mdi-pencil</v-icon>
                      </v-btn> -->
                      <v-btn class="btn-icon delete"  @click="delitem('bacteria',item.id)">
                          <v-icon color="white">mdi-trash-can</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-card>
                
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card>
      <!-- 新增/編輯菌相 -->
      <v-dialog v-model="editDialog" max-width="500px">
        <v-overlay :value="!dialogLoading" :absolute="true">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-form v-model="editvalid" ref="addform">
            <v-card class="custom-dialog">
                <v-card-title class="add-title">
                    <div style="display: inline-block;">
                        <span>{{nowBacteria=='add'?'新增':'編輯'}}</span> 
                    </div>
                    <div class="add">
                        <v-btn class="btn-secondary close"
                                title="取消" 
                                @click="editDialog = false;" 
                                style="border: none;min-width: 0;padding: 0 4px;">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <div class="basic">
                  <v-card-text v-if="nowBacteria=='add'" style="display: flex;flex-direction: column;margin-bottom: 16px;">
                      <v-row style="align-items: center;padding-top: 16px;">
                        <v-col cols="12" style="padding: 0;padding-left: 8px;">
                          <locate-select v-if="editDialog" :dataScope="'pool'" defaultSelect="" :isMulti="false" @scopeSel_data="get_scopeDataAdd($event)" class="select-template"></locate-select>
                        </v-col>
                        <v-col v-if="isPoolError" cols="12" style="padding: 0;padding-left: 8px;">
                          <div class="error-text">*必要項目</div>
                        </v-col>
                      </v-row>
                  </v-card-text>
                    <v-card-text style="display: flex;flex-direction: column;margin-bottom: 16px;">
                      <v-row style="align-items: center;padding-top: 16px;">
                        <v-col cols="6" style="padding: 0;padding-left: 8px;">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">檢測時間</span>
                          </div>
                          <div class="date-time-picker" style="width:100%">
                            <v-icon
                              @click="showDate=false;editItem.inspected_time = getNowDateTime();showDate=true;">mdi-calendar</v-icon>
                            <a-date-picker v-if="showDate" v-model="editItem.inspected_time" format="yyyy-MM-DD HH:mm:ss" show-time placeholder="" @change="onChange" @ok="onOk" />
                          </div>
                          <span v-if="isInspectedTime" class="error-text ml-2" style="font-size: 12px;margin-bottom: 8px;">*必要項目</span>
                        </v-col>
                        <v-col cols="6" style="padding: 0;padding-left: 8px;">
                          <div class="date-time-picker"><span style="font-size: 16px;margin-right: 9px;">有無加熱</span></div>
                          <v-switch v-model="editItem.is_heated" hide-details :label="editItem.is_heated?'有':'無'" style="padding-top: 0;margin-top: 0;"></v-switch>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-text style="display: flex;padding-top: 0;flex-direction: column;margin-bottom: 16px;">
                      <v-row style="align-items: center;padding-top: 16px;">
                        <v-col cols="6" style="padding: 0;padding-left: 8px;">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">水樣稀釋倍率</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.dilution"
                            :rules="rules.require"
                            placeholder="水樣稀釋倍率"
                            autocompleted="false"
                            step="0.1"
                            style="margin-right: 8px;margin-top: 0;padding-top: 0;"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" style="padding: 0;padding-left: 8px;">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">塗盤體積</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.volume"
                            :rules="rules.require"
                            placeholder="塗盤體積"
                            autocompleted="false"
                            style="margin-right: 8px;margin-top: 0;padding-top: 0;"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-text style="display: flex;padding-top: 0;flex-direction: column;margin-bottom: 16px;">
                      <v-row style="align-items: center;padding-top: 16px;">
                        <v-col cols="6" style="padding: 0;padding-left: 8px;">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">溶藻弧菌(白菌)</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.class1"
                            :rules="rules.require"
                            placeholder="溶藻弧菌(白菌)"
                            autocompleted="false"
                            style="margin-right: 8px;margin-top: 0;padding-top: 0;"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" style="padding: 0;padding-left: 8px;">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">霍亂弧菌(靛菌)</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.class2"
                            :rules="rules.require"
                            placeholder="霍亂弧菌(靛菌)"
                            autocompleted="false"
                            style="margin-right: 8px;margin-top: 0;padding-top: 0;"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-text style="display: flex;padding-top: 0;flex-direction: column;margin-bottom: 16px;">
                      <v-row style="align-items: center;padding-top: 16px;">
                        <v-col cols="6" style="padding: 0;padding-left: 8px;">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">腸炎弧菌(紫菌)</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.class3"
                            :rules="rules.require"
                            placeholder="腸炎弧菌(紫菌)"
                            autocompleted="false"
                            style="margin-right: 8px;margin-top: 0;padding-top: 0;"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" style="padding: 0;padding-left: 8px;">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">創傷弧菌(藍菌)</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.class4"
                            :rules="rules.require"
                            placeholder="創傷弧菌(藍菌)"
                            autocompleted="false"
                            style="margin-right: 8px;margin-top: 0;padding-top: 0;"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-text style="display: flex;padding-top: 0;flex-direction: column;margin-bottom: 16px;">
                      <v-row style="align-items: center;padding-top: 16px;">
                        <v-col cols="6" style="padding: 0;padding-left: 8px;">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">總菌數</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.class5"
                            :rules="rules.require"
                            placeholder="總菌數"
                            autocompleted="false"
                            style="margin-right: 8px;margin-top: 0;padding-top: 0;"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" style="padding: 0;padding-left: 8px;">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">影像</span>
                          </div>
                          <span v-if="nowBacteria=='edit'" class="error-text ml-2" style="font-size: 12px;">*欲編輯影像請刪除後重新新增</span>
                          <!-- <v-file-input v-if="nowBacteria=='add'" v-model="editItem.images" :rules="rules.require" accept="image/*" label="上傳影像(限*jpg/*png)" counter multiple
                          style="margin-top: 0;width: 100%;"></v-file-input> -->
                          <v-file-input v-if="nowBacteria=='add'" v-model="editItem.img" :rules="rules.require" accept="image/*" label="上傳影像(限*jpg/*png)"
                          style="margin-top: 0;width: 100%;"></v-file-input>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    
                </div>
                <v-card-actions style="padding: 24px 12px;">
                    <v-spacer spacer></v-spacer>
                    <v-btn class="btn-secondary" @click="editDialog = false">取消</v-btn>
                    <v-btn class="btn-primary" @click="save">{{nowBacteria=='add'?'新增':'修改'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import dayjs from "dayjs";
import _ from "lodash";
import beca from "@/pages/becateriarecog.vue";
export default {
  layout: "emptynologin2",
  middleware: "auth",
  components: {
    beca
  },
  head(){
    return{
      title:'影像辨識'
    }
  },
  data() {
    return {
      poolid: '',
      maindata: [],
      //
      recogData: {
        id: 1,
        name: "A1",
        items: [
          // {
          //   id: 1,
          //   feed_img_before_bait:
          //     "https://www.idwatertech.com/.well-known/observation/20211028093910_1_1/feed_result.jpg",
          //   feed_img_after_bait:
          //     "https://www.idwatertech.com/.well-known/observation/20211028093910_1_2/feed_result.jpg",
          //   shrimp_img_after_bait:
          //     "https://www.idwatertech.com/.well-known/observation/20211028093910_1_2/shrimp_result.jpg",
          //   net_size: 1600,
          //   feed_size_before_bait: 80.66,
          //   feed_size_after_bait: 40.21,
          //   feed_percentage: 6.234,
          //   shrimp_size: [2222, 3333, 4444, 5555],
          //   inspected_date: "2021-01-01 00:00:00"
          // }
        ]
      },
      images: {
        feedfish: require("~/assets/feedfish.png"),
        shrimp: require("~/assets/shrimp.png")
      },
      //---日曆
      menu_startdate: false,
      menu_enddate: false,
      sdate: "",
      edate: "",
      //---選定類別
      dataClass: "",
      dataClassList: [{ "name": "觀察網", "icon": "mdi-archive-eye-outline" }, { "name": "菌相", "icon": "mdi-bacteria-outline" }],
      tableHeight: window.innerHeight - 64 - 80 -64,
      innerWidth: window.innerWidth,
      nowPool: '',
      footerProps: {
        "items-per-page-text": "每頁",
        "items-per-page-options": [25, 50, 75, 100]
      },
      headers:[
                  {align: "center",groupable: false,text: "資料",value: "id",width:"10%"},
                  {align: "center",groupable: false,text: "觀察網飼料圖(已辨識)",value: "feed_img",width:"25%", sortable: false },
                  {align: "center",groupable: false,text: "觀察網蝦子圖(已辨識)",value: "shrimp_img",width:"25%", sortable: false },
                  {align: "center",groupable: false,text: "辨識資訊",value: "shrimp",width:"30%"},
                  {align: "center",groupable: false,text: "操作",value: "action",width:"10%", sortable: false}],
      isLoading: false,
      nowBacteria: 'add',
      editDialog: false,
      editItem:{},
      editvalid:false,
      rules: {
        require: [v => !!v || "*必要項目"],
        filesize: [
          value => !value || value.size < 2000000 || "檔案大小必須小於 2 MB!",
          v => !!v || "*必要項目"
        ],
        checklength:[v => v==null?'':v.length<=100 ||  "*不可輸入超過100字元"],
        requireSelect: [v =>  !!v.length || "*必要項目"],
        requireNum:[v=>( !!v || v > 0)|| "*請輸入>0數字"]
      },
      isInspectedTime:false,
      showDate: false,
      isPoolError: false,
      dialogLoading: true,
    };
  },
  methods: {
    delitem:async function(item,itemid){
      switch (item) {
        case 'bacteria'://菌
          if(confirm(`是否確定刪除[${itemid}]資料？`)){
            var res = false;
            res = await this.deleteBacteriaImageList(itemid);
            setTimeout(()=>{
                if(res) {
                  this.getRecog();
                }
            },50)
            // var url = `${this.$store.state.mydata.gobal_api.apiUrl}/bacteria-image-data/${itemid}/`;
            // await this.$axios.delete(url)
            //   .then(res => {
            //     if (res.data == "刪除成功") {
            //       this.getRecog();//re get data;
            //       this.$toast.success(`刪除菌相成功`, { duration: 2000 });
            //     } else {
            //       debugger;
            //       this.$toast.error(`刪除菌相失敗，${res.data}`, { duration: 2000 });
            //     }
            //   }).catch(error => {
            //     this.$toast.error("error:" + error, { duration: 2000 });
            //   })
            //   .finally(() => {
            //   });
          }else{
            this.$toast.success(`取消刪除`, { duration: 2000 });
          }
        // this.$toast.error(`刪除菌盤資料:${error.message}`, { duration: 2000 });
          break;
      
        default:
          break;
      }
    },
    get_scopeData:function(evt){
      console.log('pool',evt);
      this.maindata.forEach(f=>{
        f.node.forEach(a=>{
          a.node.forEach(p=>{
            if(p.id == evt) {
              this.nowPool = a.name+'_'+p.name;
            }
          })
        })
      })
      this.poolid = evt;
    },
    cellClass: function (row) {
      if (row.columnIndex == 0) {
        return "disableSelection";
      }
    },
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      let bgcolor = $nuxt.$vuetify.theme.themes.light.cardtitle;
      if (rowIndex == 0) {
        return `background-color:${bgcolor};color:#fff;font-weight:500;`;
      } else {
        return `background-color:${bgcolor};`;
      }
    },
    getRecog: async function () {
      this.isLoading = false;
      switch (this.dataClass) {
        case "觀察網":
          var parm = {
            started_date: this.sdate,
            ended_date: this.edate,
            pond_id: this.poolid
          };
          let getObservationImageDataList = await this.getObservationImageDataList(parm);
          let data = typeof (getObservationImageDataList)=='string'?[]:getObservationImageDataList;
          console.log("觀察網資料",data);
          this.headers = [];
          this.recogData = {
            id: data.id,
            name: data.name,
            items: []
          };
          if(data.length == 0||data.items == undefined||data.items.length == 0) {
            this.$toast.success(`查無觀察網資料`, { duration: 2000 });
          }else {
            if(data.items) {
              data.items.sort((a,b)=>new Date(b.inspected_time).getTime()-new Date(a.inspected_time).getTime());
              this.headers = [
                {align: "center",groupable: false,text: "資料",value: "id",width:"10%"},
                {align: "center",groupable: false,text: "觀察網飼料圖(已辨識)",value: "feed_img",width:"25%", sortable: false },
                {align: "center",groupable: false,text: "觀察網蝦子圖(已辨識)",value: "shrimp_img",width:"25%", sortable: false },
                {align: "center",groupable: false,text: "辨識資訊",value: "shrimp",width:"30%"},
                {align: "center",groupable: false,text: "操作",value: "action",width:"10%", sortable: false}];
              data.items.forEach(d=>{
                this.recogData.items.push({
                  shrimp:`蝦子數量(隻)：${d.shrimp_qty}<br> 
                            蝦子重量(g)：[ ${d.shrimp_weight==null?'':d.shrimp_weight} ]<br>
                            蝦子長度(cm)：[ ${d.shrimp_length==null?'':d.shrimp_length} ]<br>
                            飼料殘餌率：${d.leftover_rate}<br>
                            檢測時間：${d.inspected_time}`,
                  feed_img:d.feed_img,
                  id:d.id,
                  shrimp_img:d.shrimp_img
                })
              })
            }
            
          }
          this.isLoading = true;
          // await this.$axios
          //   .get(
          //     `${this.$store.state.mydata.gobal_api.apiUrl}/observation-image-data/`,
          //     { params: parm }
          //   )
          //   .then(res => {
          //     // this.recogData = res.data;
          //     console.log("觀察網資料",res.data);
          //     this.headers = [];
          //     this.recogData = {
          //       id: res.data.id,
          //       name: res.data.name,
          //       items: []
          //     };
          //     if (res.data.items.length == 0) {
          //       this.$toast.success(`查無觀察網資料`, { duration: 2000 });
          //     }else {
          //       res.data.items.sort((a,b)=>new Date(b.inspected_time).getTime()-new Date(a.inspected_time).getTime());
          //       this.headers = [
          //         {align: "center",groupable: false,text: "資料",value: "id",width:"10%"},
          //         {align: "center",groupable: false,text: "觀察網飼料圖(已辨識)",value: "feed_img",width:"25%", sortable: false },
          //         {align: "center",groupable: false,text: "觀察網蝦子圖(已辨識)",value: "shrimp_img",width:"25%", sortable: false },
          //         {align: "center",groupable: false,text: "辨識資訊",value: "shrimp",width:"30%"},
          //         {align: "center",groupable: false,text: "操作",value: "action",width:"10%", sortable: false}];
          //       res.data.items.forEach(d=>{
          //         this.recogData.items.push({
          //           shrimp:`蝦子數量(隻)：${d.shrimp_qty}<br> 
          //                     蝦子重量(g)：[ ${d.shrimp_weight==null?'':d.shrimp_weight} ]<br>
          //                     蝦子長度(cm)：[ ${d.shrimp_length==null?'':d.shrimp_length} ]<br>
          //                     飼料殘餌率：${d.leftover_rate}<br>
          //                     檢測時間：${d.inspected_time}`,
          //           feed_img:d.feed_img,
          //           id:d.id,
          //           shrimp_img:d.shrimp_img
          //         })
          //       })
          //     }
          //     this.isLoading = true;
          //     console.log("觀察網api：",res.request.responseURL);
          //   })
          //   .catch(error => {
          //     this.isLoading = true;
          //     this.$toast.error(`取得觀察網資料失敗:${error.message}`, { duration: 2000 });
          //   });
          break;
        case "菌相":
          var parm = {
            started_date: this.sdate,
            ended_date: this.edate,
            pond_id: this.poolid
          };
          let getBacteriaImageDataList = await this.getBacteriaImageDataList(parm);
          let dataBacteria = typeof (getBacteriaImageDataList)=='string'?[]:getBacteriaImageDataList;
          console.log("菌相資料",dataBacteria);
          this.headers = [];
          this.recogData = {
            id: dataBacteria.id,
            name: dataBacteria.name,
            items: []
          };
          // dataBacteria.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230913170000_1_1/feed_result.jpg');
          // dataBacteria.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230912192249_1_2/feed_result.jpg');
          // dataBacteria.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230913202700_1_2/feed_result.jpg');
          // dataBacteria.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230913190000_1_2/feed_result.jpg');
          //  this.recogData = dataBacteria;
          if (dataBacteria.length == 0||dataBacteria.items == undefined||dataBacteria.items.length == 0) {
            this.$toast.success(`查無菌相資料`, { duration: 2000 });
          }else {
            if(dataBacteria.items) {
              dataBacteria.items.sort((a,b)=>new Date(b.inspected_time).getTime()-new Date(a.inspected_time).getTime());
              // this.headers = ['資料','時間','加熱','class','辨識'];
              this.headers = [
                {align: "center",groupable: false,text: "資料",value: "id",width:"10%"},
                // {align: "center",groupable: false,text: "時間",value: "inspected_time",width:"20%" },
                // {align: "center",groupable: false,text: "加熱",value: "is_heated",width:"10%" },
                {align: "left",groupable: false,text: "資訊",value: "info",width:"20%" },
                {align: "center",groupable: false,text: "class",value: "class",width:"20%", sortable: false},
                {align: "left",groupable: false,text: "辨識",value: "images",width:"40%", sortable: false},
                {align: "center",groupable: false,text: "操作",value: "action",width:"10%"}];
              }
              dataBacteria.items.forEach(d=>{
                this.recogData.items.push({
                  class: `1. ${d.class1}<br> 
                          2. ${d.class2}<br>
                          3. ${d.class3}<br>
                          4. ${d.class4}<br>
                          5. ${d.class5}`,
                  dilution:d.dilution,
                  volume:d.volume,
                  images:d.images,
                  id:d.id,
                  inspected_time:d.inspected_time,
                  is_heated:d.is_heated,
                  class1:d.class1.split(':')[1],
                  class2:d.class2.split(':')[1],
                  class3:d.class3.split(':')[1],
                  class4:d.class4.split(':')[1],
                  class5:d.class5.split(':')[1],
                })
              })
          }
          this.isLoading = true;  
          // await this.$axios
          //   .get(
          //     `${this.$store.state.mydata.gobal_api.apiUrl}/bacteria-image-data/`,
          //     { params: parm }
          //   )
          //   .then(res => {
          //     console.log("菌相資料",res.data);
          //     this.headers = [];
          //     this.recogData = {
          //       id: res.data.id,
          //       name: res.data.name,
          //       items: []
          //     };
          //     // res.data.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230913170000_1_1/feed_result.jpg');
          //     // res.data.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230912192249_1_2/feed_result.jpg');
          //     // res.data.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230913202700_1_2/feed_result.jpg');
          //     // res.data.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230913190000_1_2/feed_result.jpg');
          //     //  this.recogData = res.data;
          //     if (res.data.items.length == 0) {
          //       this.$toast.success(`查無菌相資料`, { duration: 2000 });
          //     }else {
          //       res.data.items.sort((a,b)=>new Date(b.inspected_time).getTime()-new Date(a.inspected_time).getTime());
          //       // this.headers = ['資料','時間','加熱','class','辨識'];
          //       this.headers = [
          //         {align: "center",groupable: false,text: "資料",value: "id",width:"10%"},
          //         // {align: "center",groupable: false,text: "時間",value: "inspected_time",width:"20%" },
          //         // {align: "center",groupable: false,text: "加熱",value: "is_heated",width:"10%" },
          //         {align: "left",groupable: false,text: "資訊",value: "info",width:"20%" },
          //         {align: "center",groupable: false,text: "class",value: "class",width:"20%", sortable: false},
          //         {align: "left",groupable: false,text: "辨識",value: "images",width:"40%", sortable: false},
          //         {align: "center",groupable: false,text: "操作",value: "action",width:"10%"}];
          //       }
          //       res.data.items.forEach(d=>{
          //         this.recogData.items.push({
          //           class: `1. ${d.class1}<br> 
          //                   2. ${d.class2}<br>
          //                   3. ${d.class3}<br>
          //                   4. ${d.class4}<br>
          //                   5. ${d.class5}`,
          //           dilution:d.dilution,
          //           volume:d.volume,
          //           images:d.images,
          //           id:d.id,
          //           inspected_time:d.inspected_time,
          //           is_heated:d.is_heated,
          //           class1:d.class1.split(':')[1],
          //           class2:d.class2.split(':')[1],
          //           class3:d.class3.split(':')[1],
          //           class4:d.class4.split(':')[1],
          //           class5:d.class5.split(':')[1],
          //         })
          //       })
          //       this.isLoading = true;
          //       console.log("菌相api：",res.request.responseURL);
          //   })
          //   .catch(error => {
          //     this.isLoading = true;
          //     this.$toast.error(`取得菌相資料失敗:${error.message}`, { duration: 2000 });
          //   });
          break;
        default:
          break;
      }
    },
    getNowDate: function () {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    setNestedDisabled: function (obj, name) {
      //全部都設成disabled
      obj.forEach((itm, index) => {
        // console.log(itm.name);//所有node(含leaf)的名稱
        itm.parent = itm.hasOwnProperty("parent")
          ? itm.parent + "_" + name
          : name;
        const nodelst = ["1", "2"];
        if (nodelst.filter(x => x == itm.level) > 0) {
          itm.id = itm.name + "_" + itm.id;
        }
        if (itm.visible == false) {
          //隱藏走道用
          delete obj[index];
          return obj; //不用再找有無node
        }
        if (itm.hasOwnProperty("node")) {
          this.setNestedDisabled(itm.node, itm.name);
        }
      });
      return obj;
    },
    getMainData: async function () {
      let reqid = this.poolid;
      let getedItem = {};
      //取得整場架構資料
      //visible寫死名稱含^=false，寫死池的狀態=無=false
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
      //   .then(res => {
      //     this.maindata = res.data;
      //     var data = this.setNestedDisabled(_.cloneDeep(this.maindata), "");
      //     this.maindata = data;
      //     this.isLoading = true;
      //   });
      let architectureData = await this.getArchitecture();
      this.maindata = typeof (architectureData)=='string'?[]:architectureData;
      var data = this.setNestedDisabled(_.cloneDeep(this.maindata), "");
      this.maindata = data;
      this.isLoading = true;
      //用id抓到name
      this.maindata.forEach(x => {
        x.node.forEach(y => {
          var item = y.node.filter(z => z.id == reqid);
          if (item.length == 1) {
            getedItem = item[0];
            return;
          }
        });
      });
      //把區域名稱加進去
      if (getedItem.hasOwnProperty("name")) {
        this.poolName = getedItem.name;
        console.log(getedItem);
      }
    },
    stepLoad() {
      this.isLoading = false;
      // console.log('Step Load',this.isLoading);
      setTimeout(()=>{this.isLoading=true},1000);
    },
    // 菌相資料新增/編輯Dialog open
    openBacteria(type,item=null) {
      this.isPoolError = false;
      this.isInspectedTime = false;
      this.showDate = true;
      this.nowBacteria = type;
      this.editDialog = true;
      if(type=='add') {
        this.editItem = {pond_id:null,is_heated:false};
        if (this.$refs.addform != undefined) {
          this.$refs.addform.reset();
        }
      }else {
        this.editItem = _.cloneDeep(item);
        this.editItem.inspected_time = this.$moment(new Date(this.editItem.inspected_time), 'YYYY-MM-DD HH:mm:ss');
        this.editItem.dilution = parseFloat(this.editItem.dilution.replace('%',''));
      }
    },
    get_scopeDataAdd(evt) {
      this.editItem.pond_id = evt.toString();
      this.isPoolError = false;
    },
    async save() {
      this.dialogLoading = false;
      var valid = this.$refs.addform.validate();
      if(this.editItem.inspected_time==''||this.editItem.inspected_time==null) {
        this.isInspectedTime = true;
      }
      if(this.editItem.pond_id==null||this.editItem.pond_id=='') {
        this.isPoolError = true;
      }
      if(valid && !this.isInspectedTime && !this.isPoolError) {
        let parm = _.cloneDeep(this.editItem);
        parm.inspected_time =dayjs(new Date(parm.inspected_time)).format("YYYY-MM-DD HH:mm:ss");
        // parm.class1 = '溶藻弧菌(白菌): '+parm.class1;
        // parm.class2 = '霍亂弧菌(靛菌): '+parm.class2;
        // parm.class3 = '腸炎弧菌(紫菌): '+parm.class3;
        // parm.class4 = '創傷弧菌(藍菌): '+parm.class4;
        // parm.class5 = '總菌數: '+parm.class5;
        parm.dilution = parseFloat(parm.dilution).toFixed(1)+'%';
        parm.created_user = this.$auth.$state.user.email;
        parm.name = parm.img.name;
        delete parm.img;
        delete parm.class;
        let formData = new FormData();
        Object.keys(parm).forEach(x=>{
            formData.append(x,parm[x]);
        })
        formData.append("img", this.editItem.img);
        
        // files
        // for (let file of this.editItem.images) {
        //     formData.append("files", file);
        // }
        console.log('parm',parm,this.editItem);
        switch (this.nowBacteria) {
          case 'add':
          var res = false;
          res = await this.postBacteriaImageDataList(formData);
          setTimeout(()=>{
              if(res) {
                  this.editDialog = false;
                  this.getRecog();//取得苗清單
              }
              this.dialogLoading = true;
          },50)
            break;
          case 'edit':
            this.dialogLoading = true;
            break;
          default:
            this.dialogLoading = true;
            break;
        }
      }
      
    },
    getNowDateTime() {
        return this.$moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
    },
    onChange(value,dateString) {
        console.log(value,dateString);
        if(value!==null) {
          this.editItem.inspected_time = this.$moment(new Date(value), 'YYYY-MM-DD HH:mm:ss');
          this.isInspectedTime = false;
        }else {
          this.editItem.inspected_time = '';
        }
        
    },
    onOk(value) {
        console.log(value);
    },
  },
  async mounted() {
    //取得整場架構資料
    await this.getMainData();
    //監控視窗
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 64 - 80 -64;
      this.innerWidth = window.innerWidth;
    });
    
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
  },
  watch: {
    tableHeight:function(){
        return window.innerHeight - 64 - 80 -64;
    },
    innerWidth() {
      return window.innerWidth;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-application.v-application--is-ltr {
  .v-card.bg-card {
    * {
      color: $color-dark;
    }
    .red--text {
      color: $color-accent !important;
    }
    .search {
      margin-bottom: 12px;
      // .caculate {
      //   max-width: calc((100%  / 4) - (100% / 12) / 4 );
      // }
      // .caculate-8 {
      //   max-width: calc((100% / 12 * 8) - ((100% / 12) / 1.5));
      // }
    }
    .v-sheet.result-card.v-card:not(.v-sheet--outlined) {
      box-shadow: 0 0 10px $color-black-10;
    }
    .v-card.result-card {
      padding: 24px;
      padding-bottom: 8px;
      background-color: $color-lighten;
      .theme--light.v-data-table {
        background-color: $color-lighten;
      }
      .header-bar {
        width: 100%;
        @include flexAlignCenter();
        padding: 12px 24px;
        border-bottom: 1px solid $color-black-10;
        h5 {
          width: 100%;
        }
      }
    }
  }
}
::v-deep {
  .result {
    .theme--light.v-data-table.v-data-table--fixed-header thead th {
      background: $color-lighten;
    }
  }
  .edit-table {
    input[type="checkbox"] {
      accent-color: $color-primary;
    }
    .v-input--selection-controls.v-input--is-disabled:not(.v-input--indeterminate) .v-icon {
      color: $color-dark-25;
    }
    &.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
      background: rgba($color-primary,0.1);
    }
    table {
      height: 100%;
    }
  }
}
button {
  .theme--light.v-data-table {
    background-color: $color-lighten;
  }
}
.date-time-picker {
  .v-icon {
    color: $color-primary;
  }
}
@media (max-width: 768px) {
  .v-application.v-application--is-ltr {
    .v-card.video {
      .search {
        margin-bottom: 24px;
        .caculate {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
