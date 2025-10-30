<template>
  <div>
    <v-overlay :value="!isLoading" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card class="bg-card mb-3" style="min-height:86vh">
      <div class="content pl-0 pt-3 pb-0">
        <!-- 搜尋 -->
        <div class="search">
          <v-row class="mb-0 ml-1">
            <!-- 選場 -->
            <v-col cols="12" md="4" sm="5">
              <v-row no-gutters align="center" dense class="mb-0">
                <v-col cols="6">
                  <v-select
                    v-model="sel_main"
                    :items="maindata"
                    item-value="id"
                    item-text="name"
                    placeholder="選擇場"
                    clearable
                    hide-details
                    @change="
                      () => {
                        sel_area = undefined;
                        sel_pool = undefined;
                        pooldata = [];
                        // if (sel_main) {
                        // } else {
                        //   sel_area = undefined;
                        //   pooldata = [];
                        // }
                      }
                    "
                    dense
                  >
                  </v-select
                ></v-col>
                <v-col cols="6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="btn-icon green"
                        @click="showdialog('add', 'main')"
                        v-bind="attrs" v-on="on"
                        ><v-icon>mdi-plus</v-icon></v-btn
                      >
                    </template>
                    <span>新增</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="btn-icon"
                        :disabled="!sel_main"
                        @click="showdialog('edit', 'main')"
                        v-bind="attrs" v-on="on"
                        ><v-icon>mdi-pencil-outline</v-icon></v-btn
                      >
                    </template>
                    <span>修改</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="btn-icon delete"
                        :disabled="!sel_main"
                        v-bind="attrs" v-on="on"
                        @click="
                          delsubmit(
                            'main',
                            maindata.filter(x => x.id == sel_main)[0].name
                          )
                        " 
                        ><v-icon>mdi-trash-can</v-icon></v-btn
                      >
                    </template>
                    <span>刪除</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="btn-icon clear" v-bind="attrs" v-on="on" :disabled="!sel_main" @click="showdialog('','ip')" style="color: #fff !important;">IP</v-btn>
                    </template>
                    <span>IP設定</span>
                  </v-tooltip>
                  
                </v-col>
              </v-row>
            </v-col>
            <!-- 選區 -->
            <v-col cols="12" md="4" sm="5">
              <v-row no-gutters align="center" class="mb-0">
                <v-col cols="6">
                  <v-select
                    v-model="sel_area"
                    :items="areadata"
                    item-value="id"
                    item-text="name"
                    clearable
                    dense
                    hide-details
                    placeholder="選擇區域"
                    no-data-text="查無資料"
                    :disabled="!sel_main"
                    @change="getPoolData"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="btn-icon green"
                        :disabled="!sel_main"
                        @click="showdialog('add', 'area')"
                        v-bind="attrs" v-on="on"
                        ><v-icon>mdi-plus</v-icon></v-btn
                      >
                    </template>
                    <span>新增</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="btn-icon"
                        :disabled="!sel_area"
                        @click="showdialog('edit', 'area')"
                        v-bind="attrs" v-on="on"
                        ><v-icon>mdi-pencil-outline</v-icon></v-btn
                      >
                    </template>
                    <span>修改</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="btn-icon delete"
                        :disabled="!sel_area"
                        v-bind="attrs" v-on="on"
                        @click="
                          delsubmit(
                            'area',
                            areadata.filter(x => x.id == sel_area)[0].name
                          )
                        "
                        ><v-icon>mdi-trash-can</v-icon></v-btn
                      >
                    </template>
                    <span>刪除</span>
                  </v-tooltip>
                  
                </v-col>
              </v-row>
            </v-col>
            <!-- 池資料/地圖配置 -->
            <v-col v-if="userData.length>0 && userData.filter(x=>x.username == $auth.$state.user.email)[0].department.filter(y=>y=='技術部').length>0" cols="12" md="2" sm="2" class="flex-align-center">
              <v-btn v-if="nowSetting=='map'" class="btn-secondary" :class="{'disabled':!sel_main||!sel_area}" @click="nowSetting = 'pool';getPoolData()">池資料</v-btn>
              <v-btn v-if="nowSetting=='pool'" class="btn-secondary" :class="{'disabled':!sel_main||!sel_area}" @click="getMapData()">配置</v-btn>
            </v-col>
          </v-row>
        </div>
        <!-- 搜尋結果 -->
        <div class="content">
          <div class="result">
            <!-- 池 -->
            <v-card v-if="nowSetting=='pool'" class="result-card">
              <!-- 表頭 -->
              <div class="card-title">
                <div class="title flex-align-center">
                  <v-card-title class="mr-6">池清單</v-card-title>
                  <div class="search flex-align-center">
                    <!-- <v-autocomplete
                      v-model="sel_pool"
                      :items="pooldata"
                      item-text="name"
                      item-value="id"
                      no-data-text="查無資料"
                      placeholder="請選擇養殖池"
                      :disabled="!sel_area"
                      clearable
                      hide-details
                      style="margin-top: 0;padding-top: 0;margin-left: 8px;"
                      @change="changePool"
                    ></v-autocomplete> -->

                    <v-btn class="btn-small" :class="{'btn-primary':!tableview,'btn-secondary':tableview}" @click="tableview=false">卡片式</v-btn>
                    <v-btn class="btn-small" :class="{'btn-primary':tableview,'btn-secondary':!tableview}" @click="tableview=true">表格式</v-btn>
                    
                  </div>
                </div>
                
                <div class="chevron flex-align-center" style="margin-left: 8px;">
                  <v-btn class="btn-secondary green px-2 py-0" :class="{'disabled':!sel_area}" @click="showdialog_pool('add')" style="background-color: transparent !important;">
                      <v-icon>mdi-plus</v-icon>新增池
                  </v-btn>
                  
                </div>
                
              </div>
              <div class="content">
                <v-row v-if="pooldata.length>0 && !tableview">
                  <v-col cols="12"><v-checkbox v-model="sortbyid" hide-details label="以id排序" class="mt-0 pt-0 d-inline-block"></v-checkbox></v-col>
                  
                  <v-col cols="12" md="3" sm="6"
                    v-for="item in ((sortbyid)?pooldata_sorted:pooldata)"
                    :key="item.id"
                  >
                    <v-card style="background-color: #fff;">
                      <v-card-subtitle class="flex-center-between">
                        {{ item.name }}
                        <div class="btn-groups">
                          <v-btn
                            class="btn-icon "
                            @click="showdialog_pool('edit',item)" 
                            ><v-icon>mdi-pencil</v-icon></v-btn
                          >
                          <v-btn
                            class="btn-icon delete"
                            @click="delsubmit(
                                    'pool',
                                    pooldata.filter(x => x.id == item.id)[0].name
                                  )" 
                            ><v-icon>mdi-trash-can</v-icon></v-btn
                          >
                        </div>
                        
                      </v-card-subtitle>
                      <v-divider></v-divider>
                      <v-card-text>
                        <ol>
                          <div
                            v-for="it in Object.keys(item).filter(
                              x => !['estimated_num', 'num_per_unit'].includes(x)
                            )"
                            :key="it"
                          >
                            <li
                              v-if="
                                itemname.filter(x => x.name == it).length > 0 &&
                                  itemname.filter(x => x.name == it)[0].visible == true
                              "
                              style="font-weight:500;"
                            >
                              {{ itemname.filter(x => x.name == it)[0].text }}：{{
                                item[it]
                              }}
                            </li>
                            <li v-if="itemname.filter(x => x.name == it).length == 0">
                              {{ it }}-{{ item[it] }}
                            </li>
                          </div>
                        </ol>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row v-if="pooldata.length==0 && !tableview"><div class="content flex-all-center full-width" style="height: 56vh;">無資料</div></v-row>
                <v-data-table light
                  v-if="tableview"
                  class="flex-table data-table bg-transparent"
                  :headers="headers"
                  :items="nowpooldata"
                  no-data-text="無資料"
                  hide-default-footer
                  disable-pagination
                  style="height: 64vh;overflow-y: scroll;"
                  fixed-header>
                    <template  v-slot:[`item.udactions`]="{item}">
                      <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                              <button class="btn-icon" @click="showdialog_pool('edit',item)" v-bind="attrs" v-on="on">
                                  <v-icon>mdi-pencil</v-icon>
                              </button>
                          </template>
                          <span>修改</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                              <button class="btn-icon delete" 
                              @click="
                                delsubmit(
                                  'pool',
                                  pooldata.filter(x => x.id == item.id)[0].name
                                )" v-bind="attrs" v-on="on">
                                  <v-icon>mdi-trash-can</v-icon>
                              </button>
                          </template>
                          <span>刪除</span>
                      </v-tooltip>
                  </template>
                </v-data-table>
              </div>
            </v-card>
            <!-- 配置 -->
            <div v-else class="header-bar">
              <v-tabs v-model="nowTab" show-arrows>
                <v-tab
                  v-for="(tab,tid) in tabs"
                  :key="'tabs-'+tid"
                  :href="`#` + tab">
                  {{ tab }}
                </v-tab>
                <v-tabs-items v-model="nowTab" touchless>
                  <v-tab-item 
                    v-for="(tab,tid) in tabs"
                    :key="'tab-'+tid"
                    :value="tab">
                    <!-- 圖表 -->
                    <div v-show="nowTab=='地圖配置'">
                      <settinglayout  class="pt-8 full-width" :areas="areas1"></settinglayout>
                    </div>
                    <div v-show="nowTab=='池況顏色'">
                      <settingcolor class="pt-8 full-width"></settingcolor>
                    </div>
                  </v-tab-item>
              </v-tabs-items>
              </v-tabs>
              
            </div>
            
            
          </div>
        </div>
      </div>
    </v-card>
    <!-- 場區編輯/新增 -->
    <v-dialog v-model="dialog.main" width="500px">
      <v-form ref="mainform" v-model="mainvalid" lazy-validation>
        <v-card class="custom-dialog">
          <v-card-title class="add-title">
            <div class="d-inline-block">
              {{
              edititem.type == "add"
                ? "新增"
                : edititem.type == "edit"
                ? "編輯"
                : "刪除"
            }}-{{
              edititem.class == "main"
                ? "場"
                : edititem.class == "area"
                ? "區域"
                : "養殖池"
            }}
            </div>
            <div class="add">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="dialog.main = false">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="basic search pl-2 pt-2">
              <v-card-text class="d-flex flex-column pt-0">
                <v-text-field
                  placeholder="請輸入名稱"
                  v-model="edititem.value"
                  :rules="rules.require"
                  autocomplete="off" clearable filled dense
                ><span style="width:80px;" slot="prepend">名稱</span></v-text-field>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0">
                <v-text-field
                  v-if="edititem.class == 'area'"
                  placeholder="請輸入英文代稱(wc、tf、zw...)"
                  v-model="edititem.value_en"
                  :rules="rules.require"
                  autocomplete="off" clearable filled dense
                ><span style="width:80px;" slot="prepend">英文代稱</span></v-text-field>
              </v-card-text>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="dialog.main = false">取消</v-btn>
            <v-btn class="btn-primary" @click="editsubmit">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- 池編輯/新增 -->
    <v-dialog v-model="dialog.pool" width="500px">
      <v-form ref="poolform" v-model="poolvalid" lazy-validation>
        <v-card v-if="sel_area && areadata" class="custom-dialog">
          <v-card-title class="add-title">
            <div class="d-inline-block">
              {{ areadata.filter(x => x.id == sel_area)[0].name }}-養殖池-{{
                edititem_pool.type == "add" ? "新增" : "編輯"
              }}
            </div>
            <div class="add">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="dialog.pool = false">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="basic search pl-2 pt-2">
              <v-card-text class="d-flex flex-column pt-0">
                <v-text-field
                  autocomplete="off"
                  v-model="edititem_pool.parm.name"
                  :rules="rules.require"
                  clearable
                  filled
                  dense
                  style="margin-right: 16px;"
                >
                  <span style="width:50px;" slot="prepend">名稱</span>
                </v-text-field>
              </v-card-text>
              <v-card-text class="d-flex pt-0">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.volume"
                  :rules="rules.requireNum0"
                  min="0"
                  type="number"
                  clearable
                  filled
                  dense
                  class="mr-4"
                >
                  <span style="width:50px;" slot="prepend">體積</span>
                  <span style="width:25px;" slot="append">m<sup>3</sup></span>
                </v-text-field>
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.depth"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  class="mr-4"
                >
                  <span style="width:50px;" slot="prepend">深度</span>
                  <span style="width:25px;" slot="append">m</span>
                </v-text-field>
              </v-card-text>
              <v-card-text class="d-flex pt-0">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.num"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  @keypress="(evt)=>{if(evt.key=='.'){ evt.preventDefault();}else{return true;}}"
                  filled
                  dense
                  class="mr-4"
                  ><span style="width:50px;" slot="prepend">池子數</span>
                  <span style="width:25px;" slot="append">個</span>
                </v-text-field>
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.aeration_tray_num"
                  @keypress="(evt)=>{if(evt.key=='.'){ evt.preventDefault();}else{return true;}}"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                  class="mr-4"
                >
                  <span style="width:50px;" slot="prepend">曝氣盤</span>
                  <span style="width:25px;" slot="append">個</span>
                </v-text-field>
              </v-card-text>
              <v-card-text style="display: flex;padding-top: 0;">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.max_water_level"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                  class="mr-4"
                >
                  <span style="width:70px;" slot="prepend">最大水位高度</span>
                  <span style="width:25px;" slot="append">cm</span>
                </v-text-field>
                </v-card-text>
              <v-card-text style="display: flex;padding-top: 0;">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.sensor_to_full_level"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                  class="mr-4"
                >
                  <span style="width:70px;background-color: #E1C0FA;" title="與案場本機控制相關參數" slot="prepend">感測到滿水高度</span>
                  <span style="width:25px;" slot="append">cm</span>
                </v-text-field>
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.sensor_to_pond_bottom"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                  class="mr-4"
                >
                  <span style="width:70px;background-color: #E1C0FA;" title="與案場本機控制相關參數" slot="prepend">感測到水底高度</span>
                  <span style="width:25px;" slot="append">cm</span>
                </v-text-field>
              </v-card-text>
              <v-card-text style="display: flex;padding-top: 0;">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.bottom_area"
                  :rules="rules.requireNum0"
                  min="0"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                  class="mr-4"
                >
                  <span style="width:70px;" slot="prepend">底面積</span>
                  <span style="width:25px;" slot="append">m<sup>2</sup></span>
                </v-text-field>
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.observation_feed_pct"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                  class="mr-4"
                >
                  <span style="width:70px;" slot="prepend">觀察觀飼料百分比</span>
                  <span style="width:10px;" slot="append">%</span>
                </v-text-field>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0">
                <v-text-field
                  autocomplete="off"
                  v-model="edititem_pool.parm.video_url"
                  clearable
                  placeholder="輸入影像IP(例：武曲171)"
                  class="mr-4 mt-0"
                >
                  <template slot="prepend"
                    ><span style="width:50px;">觀察網影像</span></template
                  >
                </v-text-field>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0">
                <v-select
                  v-model="edititem_pool.parm.pond_state_id"
                  :items="poolstat"
                  :rules="rules.require"
                  item-text="name_ch"
                  item-value="id"
                  :disabled="true"
                  class="mr-4 mt-0"
                  ><template slot="prepend"
                    ><span style="width:50px;">狀態</span></template
                  ></v-select
                >
              </v-card-text>
            </div>
          </v-card-text>
          <!-- <v-card-text> -->
            <!-- <v-text-field
              autocomplete="off"
              v-model="edititem_pool.parm.density"
              :rules="rules.require"
              clearable
            >
              <template slot="prepend"
                ><span style="width:50px;">密度</span></template
              >
            </v-text-field> -->

            
            <!-- v-if="edititem_pool.type == `add`" -->
            
          <!-- </v-card-text> -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="dialog.pool = false">取消</v-btn>
            <v-btn class="btn-primary" @click="poolsubmit(edititem_pool.type)">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- 場 ip設定 -->
    <v-dialog v-model="dialog.ip" width="500px">
      <v-form ref="ipform" v-model="ipvalid" lazy-validation>
        <v-card class="custom-dialog">
          <v-card-title class="add-title">
            <div class="d-inline-block">ip設定</div>
            <div class="add">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="dialog.ip = false">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          
          <v-card-text>
            <!-- <span>{{ `${this.selected_ip.factory_name}_${this.selected_ip.pond_area_name}` }}</span> -->
            <div class="basic search pl-2 pt-2" style="padding-left: 8px;padding-top: 8px;">
              <v-card-text class="d-flex flex-column pt-0">
                <v-textarea
                  height="400"
                  outlined
                  name="input-7-4"
                  label=""
                  v-model="editedip_content"
                  hide-details
                  placeholder='{"factory_name": "案場名稱-XXXXID001","version": 1.0}'
                  class="text-area"
                >
                </v-textarea>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0">
                <v-text-field class="text-area" v-model="ipadminpwd" color="red" outlined hide-details dense clearable><span slot="prepend-inner" class="text--red">管理密碼<v-icon>mdi-key</v-icon></span></v-text-field>
              </v-card-text>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="dialog.ip = false">取消</v-btn>
            <v-btn class="btn-primary" @click="updateip">更新</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    

    
  </div>
</template>

<script>
import https from "https";
import _ from "lodash";
import md5 from "md5";
import settinglayout from "@/pages/map/settinglayout.vue";
import settingcolor from "@/pages/map/settingcolor.vue";
import { get } from "lodash";
import { del } from "vue";
const agent = new https.Agent({
  rejectUnauthorized: false
});

export default {
  layout: "emptynologin2",
  middleware: "auth",
  components: {
    settinglayout,
    settingcolor
  },
  head(){
    return {
      title:"場域設定",
    }
  },
  data() {
    return {
      rules: {
        require: [v => !!v || "*必要項目"],
        requireNum: [
          v => {
            if (!!v || !isNaN(parseFloat(v))) return true;
            return "必要項目";
          }
        ],
        requireNum0: [
          v => {
            if (!!v && v > 0) return true;
            return "必要項目須大於0";
          }
        ]
      },
      maindata: [],
      sel_main: "",
      sel_area: "",
      sel_pool: "",
      pooldata: [],
      dialog: {
        main: false,
        pool: false,
        ip:false
      },
      edititem: {
        type: "add", //add新增還是del刪除
        class: "", //新增場、區、池
        value: ""
      },
      edititem_pool: {
        type: "add", //add新增還是del刪除
        parm: {}
      },
      poolstat: [],
      ipvalid:true,
      poolvalid: true,
      mainvalid: true,
      itemname: [
        //estimated_num初始投放隻數、num_per_unit放養密度
        { name: "id", text: "ID", visible: true },
        { name: "name", text: "名稱", visible: true },
        { name: "volume", text: "體積(噸)", visible: true },
        { name: "depth", text: "深度(m)", visible: true },
        { name: "max_water_level", text: "最大水位高度", visible: false },/* 先隱藏，之後有用到再開 */
        { name: "sensor_to_full_level", text: "感測到滿水高度", visible: true },
        { name: "sensor_to_pond_bottom", text: "感測到水底高度", visible: true },/* 先隱藏，之後有用到再開 */
        { name: "num", text: "小池數(個)", visible: true },
        { name: "aeration_tray_num", text: "曝氣盤數(個)", visible: true },
        { name: "pond_state_id", text: "池的狀態的id", visible: false },/* 先隱藏 */
        { name: "pond_area_id", text: "池的區的id", visible: false },/* 先隱藏 */
        { name: "state", text: "狀態", visible: true },
        { name: "video_url", text: "觀察網影像", visible: true },
        { name: "observation_feed_pct", text: "觀察觀飼料百分比", visible: true },
        { name: "bottom_area", text: "底面積", visible: true },
        { name: "created_user", text: "created_user", visible: false },/* 先隱藏 */
        { name: "created_time", text: "created_time", visible: false },/* 先隱藏 */
        { name: "updated_user", text: "更新人員", visible: true },/* 先隱藏 */
        { name: "updated_time", text: "更新時間", visible: true },/* 先隱藏 */
      ],
      sortbyid:false,
      ipdata:[],
      selected_ip:{},
      ipadminpwd:'',
      editedip_content:'',
      headers:[
        { value: "name", text: "名稱", visible: true, sortable: true },
        { value: "id", text: "id", visible: true, sortable: true },
        { value: "volume", text: "體積(噸)", visible: true, sortable: false },
        { value: "depth", text: "深度(m)", visible: true, sortable: false },
        { value: "max_water_level", text: "最大水位高", visible: false, sortable: false },/* 先隱藏，之後有用到再開 */
        { name: "sensor_to_full_level", text: "感測到滿水高度", visible: true },
        { value: "sensor_to_pond_bottom", text: "感測到水底高度", visible: true, sortable: false },
        { value: "num", text: "小池數(個)", visible: true, sortable: false },
        { value: "aeration_tray_num", text: "曝氣盤數(個)", visible: true, sortable: false },
        { value: "state", text: "狀態", visible: true, sortable: true },
        { value: "video_url", text: "觀察網影像", visible: true, sortable: false },
        { value: "observation_feed_pct", text: "觀察觀飼料百分比", visible: true, sortable: false },
        { value: "bottom_area", text: "底面積", visible: true },
        { text: '操作', value: 'udactions', sortable: false,width:"10%"},
        // { text: 'id', value: 'id', sortable: true,width:"10%"},
        // { text: "名稱(英)", value: "name_en", groupable: false, sortable: true,width:"10%"},
        // { text: "產地", value: "origin", groupable: false, sortable: true,width:"10%"},
        // { text: "品牌特行", value: "characteristic", groupable: false, sortable: false,width:"15%"},
        // { text: '廠商', value: 'manufacturer_id', sortable: true,width:"10%"},
        // { text: '市價', value: 'price', sortable: true,width:"10%"},
        // { text: '備註', value: 'remark', sortable: false,width:"10%"},
        // { text: '修改時間', value: 'updated_time', sortable: true,width:"15%"},
        // { text: '操作', value: 'udactions', sortable: false,width:"10%"},
      ],
      nowpooldata:[],
      nowSetting: 'pool',
      areas:[],
      layout:[],
      nowAreaId:{
        factory_id: null,
        pond_area_id: null
      },
      nowAreaTag:'',
      allData: [],
      areas1:{
        areaNo: '',
        name: '',
        id: null,
        ponds: []},
      userData: [],
      tableview: false,
      // 配置
      nowTab: '地圖配置',
      tabs: ['地圖配置','池況顏色'],
      isLoading: false,
    };
  },
  async created() {
    this.isLoading = false;
    await this._pageCheck(); //驗證頁面是否可檢視
    await this.getmain();
    await this.getpoolstat(); //取得池狀態清單
    await this.getipdata();//取得ip設定
    await this.getAllUser(); // 取得所有使用者資料，比對是否為技術部
  },
  methods: {
    async getAllUser() {
      let getuserData = await this.getUserList();
      this.userData = typeof (getuserData)=='string'?[]:getuserData;
        this.userData = this.userData.filter(x=>x.is_active==true);
        // this.isLoading = true;
        console.log('User',this.userData);
    },
    getmain: async function(bool=false) {
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`, { httpsAgent: agent })
      //   .then(res => {
      //     this.maindata = res.data;
      //     console.log("API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.$toast.error("error:" + error, { duration: 2000 });
      //   });
      // let architectureData = await this.getArchitecture();
      // this.maindata = typeof (architectureData)=='string'?[]:architectureData;
      if(bool) {
        let architectureData = await this.getArchitecture();
        this.maindata = typeof (architectureData)=='string'?[]:architectureData;
      }else {
        this.maindata = JSON.parse(localStorage.getItem('architecture'))?JSON.parse(localStorage.getItem('architecture')):await this.getArchitecture();
      }
      
    },
    getpoolstat: async function() {
      //取得池狀態清單
      let getPondStateList = await this.getPondStateList();
      let data = typeof (getPondStateList)=='string'?[]:getPondStateList;
      this.poolstat = data.filter(x => x.name_ch != "");
      this.isLoading = true;
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`)
      //   .then(res => {
      //     this.poolstat = res.data.filter(x => x.name_ch != ""); //不提供保留項;
      //   })
      //   .catch(error => {
      //     alert("error:" + error.message);
      //   });
    },
    getPoolData: async function() {
      this.isLoading = false;
      if(this.nowSetting=='pool') {
        this.sel_pool = "";
        let pool = [];
        if (!this.sel_area) {
          this.pooldata = pool;
          this.nowpooldata = pool;
          this.isLoading = true;
          return;
        }
        var para = {
          id: this.sel_area
        };
        //let getPondDataList = await this.getPondDataList(para);//api:ponds-data
        let getPondList = await this.getPondList(para);//api:pond
        let data = typeof (getPondList)=='string'?[]:getPondList;
        pool = data;
        // 2024/12/19先拿掉shape
        pool.forEach(x=>{delete x['shape']});
        this.pooldata = pool;
        this.nowpooldata = _.cloneDeep(pool);
        this.isLoading = true;
      }else {
        this.getMapData();
      }
      
    },
    async getMapData() {
      this.isLoading = false;
      this.nowSetting = 'map';
      this.areas = []
      for (let i = 0; i < this.maindata.length; i++) {
        if (this.maindata[i].id == this.sel_main) {
        this.nowAreaId.factory_id = this.maindata[i].id;
          for (let x = 0; x < this.maindata[i].node.length; x++) {
            // this.areas.push(this.maindata[i].node[x].name);
            this.areas.push({
                areaNo: this.maindata[i].node[x].area_no,
                name: this.maindata[i].node[x].name,
                id: this.maindata[i].node[x].id
            });
          }
        }
      }
      console.log("areas:",this.areas)
      this.layout = [];
      if (this.areas.length > 0) {
        this.areas.forEach(a=>this.layout.push(a.name));
        this.nowAreaId.pond_area_id = this.sel_area;
        this.nowAreaTag = this.areas.filter(x=>x.id==this.sel_area)[0].areaNo;
      }
      let parm = {
        factory_id: this.nowAreaId.factory_id,
        pond_area_id: null

      }
      if(this.nowAreaId.factory_id!==null) {
        let getMapList = await this.getMapList(parm);
        let data = typeof (getMapList)=='string'?[]:getMapList;
        this.allData = data;
        this.getLayoutData();
        // await this.$axios
        //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/map/`,{params:parm}, { httpsAgent: agent })
        //   .then(res => {
        //     // this.ponds = res.data;
        //     console.log('getData',res.data);
        //     this.allData = res.data;
        //     this.getLayoutData();
            
        //   })
        //   .catch(error => {
        //     // alert("error:" + error.message);
        //   });
      }
      this.isLoading = true;    
      console.log("areas:" + this.areas,this.nowAreaId,this.nowAreaTag);
    },
    getLayoutData() {
      // 將地圖資料傳遞給配置設定
      let areaid = null;
      let name = '';
      // this.nowLayout = this.areas[0].name;
      this.areas.forEach(a=>{
        if(a.id == this.sel_area) {
          areaid = a.id;
          name = a.name;
        }
      })
      this.allData.forEach(data=>{
        if(data.id==areaid) {
          this.areas1 = {
            areaNo: data.area_no,
            name: name,
            id: data.id,
            ponds: data.ponds
          }
        }
      })
      
      console.log('getLayout',this.areas1);
    },
    editsubmit: async function() {
      if (this.$refs.mainform.validate() == false) {
        return;
      }
      const updUser = this.$auth.$state.user.email;
      console.log(this.edititem);
      let id = this.edititem.id;
      if (this.edititem.type == "add") {
        let parm = {
          name: this.edititem.value,
          created_user: updUser
        };
        switch (this.edititem.class) {
          case "main":
            var res = false;
            res = await this.postFactoryList(parm);
            setTimeout(()=>{
                if(res) {
                  this.dialog.main = false;
                  this.getmain(true);
                }
            },50)
            // await this.$axios
            //   .post(`${this.$store.state.mydata.gobal_api.apiUrl}/factory/`, parm, {
            //     httpsAgent: agent
            //   })
            //   .then(res => {
            //     console.log("API:" + res.request.responseURL);
            //     if (res.data == "新增成功") {
            //       this.dialog.main = false;
            //       this.getmain();
            //       this.$toast.success("新增成功", { duration: 2000 });
            //     } else {
            //       this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
            //     }
            //   })
            //   .catch(error => {
            //     this.$toast.error("error:" + error, { duration: 2000 });
            //   });
            break;
          case "area":
            parm = {
              area_no: this.edititem.value_en,
              name: this.edititem.value,
              factory_id: this.sel_main,
              created_user: updUser
            };
            var res = false;
            res = await this.postPondAreaList(parm);
            setTimeout(()=>{
                if(res) {
                  this.dialog.main = false;
                  this.getmain(true);
                }
            },50)
            // await this.$axios
            //   .post(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-area/`, parm, {
            //     httpsAgent: agent
            //   })
            //   .then(res => {
            //     console.log("API:" + res.request.responseURL);
            //     if (res.data == "新增成功") {
            //       this.dialog.main = false;
            //       this.getmain();
            //       this.$toast.success("新增成功", { duration: 2000 });
            //     } else {
            //       this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
            //     }
            //   })
            //   .catch(error => {
            //     this.$toast.error("error:" + error, { duration: 2000 });
            //   });
            break;
          default:
            break;
        }
      } else if (this.edititem.type == "edit") {
        let parm = {
          name: this.edititem.value,
          updated_user: updUser
        };
        switch (this.edititem.class) {
          case "main":
            var res = false;
            res = await this.patchFactoryList(parm,id);
            setTimeout(()=>{
                if(res) {
                  this.dialog.main = false;
                  this.getmain(true);
                  this.sel_main = "";
                  this.sel_area = "";
                  this.pooldata = [];
                }
            },50)
            // await this.$axios
            //   .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/factory/${id}/`, parm, {
            //     httpsAgent: agent
            //   })
            //   .then(res => {
            //     console.log("API:" + res.request.responseURL);
            //     if (res.data == "修改成功") {
            //       this.dialog.main = false;
            //       this.getmain();
            //       this.sel_main = "";
            //       this.$toast.success("修改成功", { duration: 2000 });
            //     } else {
            //       this.$toast.error("修改失敗:" + res.data, { duration: 2000 });
            //     }
            //   })
            //   .catch(error => {
            //     this.$toast.error("error:" + error, { duration: 2000 });
            //   });
            break;
          case "area":
            parm = {
              area_no: this.edititem.value_en,
              name: this.edititem.value,
              updated_user: updUser
            };
            var res = false;
            res = await this.patchPondAreaList(parm,id);
            setTimeout(()=>{
                if(res) {
                  this.dialog.main = false;
                  this.getmain(true);
                  this.sel_main = "";
                  this.sel_area = "";
                  this.pooldata = [];
                }
            },50)
            // await this.$axios
            //   .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-area/${id}/`, parm, {
            //     httpsAgent: agent
            //   })
            //   .then(res => {
            //     console.log("API:" + res.request.responseURL);
            //     if (res.data == "修改成功") {
            //       this.dialog.main = false;
            //       this.getmain();
            //       this.sel_main = "";
            //       this.sel_area = "";
            //       this.$toast.success("修改成功", { duration: 2000 });
            //     } else {
            //       this.$toast.error("修改失敗:" + res.data, { duration: 2000 });
            //     }
            //   })
            //   .catch(error => {
            //     this.$toast.error("error:" + error, { duration: 2000 });
            //   });
            break;
          default:
            break;
        }
      }
    },
    showdialog: function(data, location) {
      this.edititem.type = data; //add edit
      this.edititem.class = location; //main area pool

      switch (location) {
        case "main":
          this.edititem.id = this.sel_main;
          this.edititem.value =
            data == "add"
              ? ""
              : data == "edit"
              ? this.maindata.filter(x => x.id == this.sel_main)[0].name
              : ""; //add 空 del：帶項目值
              this.dialog.main = true;
          break;
        case "area":
          this.edititem.id = this.sel_area;
          this.edititem.value =
            data == "add"
              ? ""
              : data == "edit"
              ? this.areadata.filter(x => x.id == this.sel_area)[0].name
              : ""; //add 空 del：帶項目值
          //英文代稱
          this.edititem.value_en =
            data == "add"
              ? ""
              : data == "edit"
              ? this.areadata.filter(x => x.id == this.sel_area)[0].area_no
              : "";
          this.dialog.main = true;
          break;
        case "ip":
            //設定資料到畫面上
            var selected_name = this.maindata.filter(x => x.id == this.sel_main)[0].name;
            this.selected_ip = this.ipdata.filter(x=>x.factory_name==selected_name)[0];
            this.ipadminpwd = "";//reset pwd
            this.editedip_content = JSON.stringify(this.selected_ip, null, "\t");
            this.dialog.ip = true;
          default:
          break;
      }

      
    },
    showdialog_pool: function(data,item=null) {
      // if (this.$refs.poolform != undefined) {
      //     this.$refs.poolform.reset();
      //   }
      //data is add or edit
      this.edititem_pool.type = data;
      this.edititem_pool.parm = {};
      this.edititem_pool.parm.pond_area_id = this.sel_area;
      this.edititem_pool.parm.pond_state_id = 3; //預設狀態=空池，id=3
      if (data == "add") {
        //重驗證
        
      }
      if (data == "edit") {
        var pool = this.pooldata.filter(x => x.id == item.id)[0];
        this.edititem_pool.parm = _.cloneDeep(pool);
        var mystatename = this.edititem_pool.parm.state;
        this.edititem_pool.parm.pond_state_id = (mystatename=="")?3:this.poolstat.filter(x=>x.name_ch==mystatename)[0].id;
        // this.edititem_pool.parm.pond_state_id = 3;
        //不需要的項目state狀態、estimated_num初始投放隻數、num_per_unit放養密度
        delete this.edititem_pool.parm.state;
        //delete this.edititem_pool.parm.estimated_num;
        delete this.edititem_pool.parm.num_per_unit;
        // delete this.edititem_pool.parm.pond_state_id; //水池狀態不在這修改，但還是要補
        for (const key in this.edititem_pool.parm) {
          var getvalue = this.edititem_pool.parm[key];
          //console.log(`key:${key}, value:${getvalue}`);
          
          //排除規則不使用regexp的清單
          const outreg = ["name", "video_url"];
          // console.log(key,typeof(getvalue));
          this.edititem_pool.parm[key] =
            typeof getvalue == "number" ||
              outreg.filter(x => x == key).length > 0
              ? getvalue //如果是數字或不使用regexp的欄位，直接帶入
              : getvalue == null
                ? null // 如果是null，直接帶入
                : getvalue.match(/^[\d\.]+/) == null
                  ? null // 如果沒符合數字格式，帶null
                  : getvalue.match(/^[\d\.]+/)[0];
        }
      }
      console.log("edititem_pool.parm:", this.edititem_pool.parm);
      this.dialog.pool = true;
    },
    changePool() {
      this.nowpooldata = [];
      console.log(this.pooldata)
      if(this.sel_area) {
        if(this.sel_pool!==null) {
          let pool = _.cloneDeep(this.pooldata);
          pool = pool.filter(x=>x.id==this.sel_pool);
          this.nowpooldata = pool;
        }else {
          this.nowpooldata = _.cloneDeep(this.pooldata);
        }
        
      }
    },
    delsubmit: async function(location, value) {
      if (confirm(`是否刪除 ${value}`)) {
        //  location, //main場、區、水池
        //  value //研發一場

        let id = "";
        let apiUrl = "";
        switch (location) {
          case "main":
            id = this.sel_main;
            // apiUrl = "factory";
            var res = false;
            res = await this.deleteFactoryList(id);
            setTimeout(()=>{
                if(res) {
                  this.getmain(true);
                  this.sel_main = "";
                  this.sel_area = "";
                }
            },50)
            break;
          case "area":
            id = this.sel_area;
            // apiUrl = "pond-area";
            var res = false;
            res = await this.deletePondAreaList(id);
            setTimeout(()=>{
                if(res) {
                  this.getmain(true);
                  this.sel_main = "";
                  this.sel_area = "";
                }
            },50)
            break;
          case "pool":
            // id = this.sel_pool;
            id = _.cloneDeep(this.pooldata.filter(x=>x.name==value)[0].id);
            // apiUrl = "pond";
            var res = false;
            res = await this.deletePondList(id);
            setTimeout(()=>{
                if(res) {
                  this.getmain(true);
                  // this.sel_main = "";
                  // this.sel_area = "";
                  this.sel_pool = "";
                  this.getPoolData(); //重取得清單
                }
            },50)
            break;
          default:
            break;
        }
        // await this.$axios
        //   .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/${apiUrl}/${id}`, {
        //     httpsAgent: agent
        //   })
        //   .then(res => {
        //     console.log("API:" + res.request.responseURL);
        //     if (res.data == "刪除成功") {
        //       this.getmain();
        //       this.sel_main = "";
        //       this.sel_area = "";

        //       if (location == "pool") {
        //         this.sel_pool = "";
        //         this.getPoolData(); //重取得清單
        //       }
        //       this.$toast.success("刪除成功", { duration: 2000 });
        //     } else {
        //       this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
        //     }
        //   })
        //   .catch(error => {
        //     this.$toast.error("error:" + error, { duration: 2000 });
        //   });
      }
    },
    poolsubmit: async function(data) {
      const user = this.$auth.$state.user.email;
      if (this.$refs.poolform.validate()) {
        if (data == "add") {
          //新增池
          this.$toast.info('新增中，請稍後...', { duration: 2000 });
          this.edititem_pool.parm.created_user = user;
          var parm = this.edititem_pool.parm;
          var res = false;
          res = await this.postPondList(parm);
          setTimeout(()=>{
              if(res) {
                this.getPoolData(); //重取得養殖池資料
                this.dialog.pool = false; //close dialog
              }
          },50)
          // await this.$axios
          //   .post(`${this.$store.state.mydata.gobal_api.apiUrl}/pond/`, parm)
          //   .then(res => {
          //     console.log("API:" + res.request.responseURL);
          //     if (res.data == "新增成功") {
          //       this.getPoolData(); //重取得養殖池資料
          //       this.dialog.pool = false; //close dialog
          //       this.$toast.success(`新增成功`, { duration: 2000 });
          //     } else {
          //        this.$toast.error(`新增失敗:${res.data}`, { duration: 3000 });

          //     }
          //   })
          //   .catch(error => {
          //     this.$toast.error("error:" + error, { duration: 2000 });
          //   });
        } else {
          this.$toast.info('修改中，請稍後...', { duration: 2000 });
          //編輯池
          this.edititem_pool.parm.updated_user = user;
          const id = this.edititem_pool.parm.id;
          this.edititem_pool.parm.video_url =
            this.edititem_pool.parm.video_url == null
              ? ""
              : this.edititem_pool.parm.video_url;
          var parm = _.cloneDeep(this.edititem_pool.parm);
          delete parm.created_user;
          delete parm.created_time;
          var res = false;
          res = await this.patchPondList(parm,id);
          setTimeout(()=>{
              if(res) {
                this.getPoolData(); //重取得養殖池資料
                this.dialog.pool = false; //close dialog
              }
          },50)
          // await this.$axios
          //   .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond/${id}/`, parm)
          //   .then(res => {
          //     console.log("API:" + res.request.responseURL);
          //     if (res.data == "修改成功") {
          //       this.getPoolData(); //重取得養殖池資料
          //       this.dialog.pool = false; //close dialog
          //       this.$toast.success(`修改成功`, { duration: 2000 });
          //     } else {
          //       alert("修改失敗!：" + res.data);
          //     }
          //   })
          //   .catch(error => {
          //     this.$toast.error("error:" + error, { duration: 2000 });
          //   });
        }
      }else{
              this.$toast.error(`尚有參數未填`, { duration: 2000 });
      }
      console.log(this.edititem_pool.parm);
    },
    getipdata: async function () {
      let getDeviceSettingList = await this.getDeviceSettingList();
      let data = typeof (getDeviceSettingList)=='string'?[]:getDeviceSettingList;
      this.ipdata = data;
      // await this.$axios
      //   .get(
      //     `${this.$store.state.mydata.gobal_api.apiUrl}/device-settings/`)
      //   .then(res => {
      //     this.ipdata = res.data;
      //     console.log("API ipdata:" + res.request.responseURL);

      //   })
      //   .catch(error => {
      //     this.$toast.error("error:" + error, { duration: 2000 });
      //     pool = [];
      //   })
      //   .finally(() => {
      //     /* 不論失敗成功皆會執行 */
      //   });
    },
    updateip: async function(){
      var input_ipadminpwd = md5(this.ipadminpwd);
      //idwadmin56651588
      if(input_ipadminpwd=='0df860f9cad0c35e96feeb0e3cf3619c'){
        if(confirm('是否確認修改ip設定？')){
          const apiurl = `${this.$store.state.mydata.gobal_api.apiUrl}/device-settings/`;
          var parm = this.editedip_content;
          //新增 找不到之前新增的id
          if(this.selected_ip==undefined){
            var res = false;
            res = await this.postDeviceSettingList(parm);
            setTimeout(()=>{
                if(res) {
                  this.getipdata();//re get data
                  this.dialog.ip = false; //close dialog
                }
            },50)
            // await this.$axios
            // .post(apiurl,parm)
            // .then(res => {
            //   console.log("API:" + res.request.responseURL);
            //   if (res.data == "新增成功") {
            //     this.getipdata();//re get data
            //     this.dialog.ip = false; //close dialog
            //     this.$toast.success(`新增成功`, { duration: 2000 });
            //   } else {
            //      this.$toast.error(`新增失敗:${res.data}`, { duration: 3000 });
            //   }
            // })
            // .catch(error => {
            //   this.$toast.error("error:" + error, { duration: 2000 });
            // });
            return;
          }
          //修改
          var id = this.selected_ip.id;
          var res = false;
          res = await this.patchDeviceSettingList(parm,id);
          setTimeout(()=>{
              if(res) {
                this.getipdata();//re get data
                this.dialog.ip = false;
              }
          },50)
          // await this.$axios
          // .patch(`${apiurl}${id}/`,parm)
          // .then(res => {
          //   if(res.data=='修改成功'){
          //     this.getipdata();//re get data
          //     this.dialog.ip = false;
          //     this.$toast.success('修改成功', { duration: 2000 });
          //   }else{
          //     this.$toast.error('修改失敗'+ res.data, { duration: 5000 });
          //   }
          // })
          // .catch(error => {
          //   this.$toast.error('error:'+ error.message, { duration: 2000 });
          // });
          

        }else{
          this.$toast.error('取消修改', { duration: 2000 });
        }
      }else{
        this.$toast.error('管理密碼錯誤', { duration: 2000 });
          }
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
      let area = [];
      filtermain.forEach(function(x) {
        x.node.forEach(function(y) {
          let yitem = { id: y.id, name: y.name, area_no: y.area_no };
          if (area.indexOf(yitem) == -1) {
            //沒找到
            area.push(yitem);
          }
        });
      });
      return area;
    },
    pooldata_sorted:function(){
     var temp  = _.cloneDeep(this.pooldata); 
     return temp.sort((a1,b1)=>{return (a1.id<b1.id)?-1:1});
    }
  },
  watch: {
    sel_area() {
      this.sel_pool = null;
      this.nowpooldata = [];
    },
    sel_main() {
      this.sel_pool = null;
      this.nowpooldata = [];
    }
  }
};
</script>

<style lang="scss" scoped>


::v-deep {
  .v-textarea.v-text-field--enclosed.text-area .v-text-field__slot textarea,
  .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined.text-area .v-input__prepend-inner {
    margin-left: 8px;
  }
  .v-data-table .v-data-table__wrapper {
    overflow: unset;
  }
  .theme--light.v-data-table.v-data-table--fixed-header thead th {
    background: $color-lighten;
  }
  .result .header-bar .theme--light.v-tabs > .v-tabs-bar,
  .result .header-bar .theme--light.v-tabs-items {
    background-color: #fff;
  }
  .v-window__container {
    overflow: scroll;
  }
}        
</style>
