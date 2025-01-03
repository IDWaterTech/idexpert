<template>
  <div id="top">
    <v-overlay :value="!isLoading" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card class="bg-card">
      <div class="content pt-3">
        <!-- 上方列 -->
        <v-row class="flex-center-between mb-4" >
          <div class="tag-groups ml-2">
            <span 
              class="span"
              v-for="(item, index) in cols"
              :key="'tag_'+index"
              @click="
                $vuetify.goTo(`#${item}`, {
                  duration: 500,
                  offset: 2,
                  easing: 'easeInOutCubic'
                })
              ">{{ getgroupname(item) }} | </span>
          </div>
          <div class="open pr-3">
            <v-btn class="btn-icon just-icon" v-if="!nowExpand" title="展開" @click="nowExpand = true;">
              <v-icon style="font-size: 1.2rem;">mdi-view-dashboard</v-icon>
            </v-btn>
            <v-btn class="btn-icon just-icon" v-else title="收縮" @click="nowExpand = false;">
              <v-icon style="font-size: 1.2rem;">mdi-view-stream</v-icon>
            </v-btn>
          </div>
        </v-row>
        <!-- 清單 -->
        <div class="result">
          <v-row
            v-for="(item, index) in cols"
            :key="'result_card_'+index"
            :id="item"
            class="full-width">
            <v-card class="result-card full-width">
              <div class="title border-bottom flex-center-between">
                <v-card-title style="font-size: 14px;">
                  {{ getgroupname(item) }}
                  </v-card-title>
                  <div class="chevron mr-4">
                    <v-btn class="btn-icon green" @click="addShow(item)"><v-icon>mdi-plus</v-icon></v-btn>
                    <v-icon v-if="adjustOpen(index)" @click="expandArrayChange(index)">mdi-triangle-small-up</v-icon>
                    <v-icon v-else @click="expandArrayChange(index)">mdi-triangle-small-down</v-icon>
                  </div>
              </div>
              <div class="content" v-if="adjustOpen(index)">
                <v-data-table
                  :items="allcols.filter(x => x.group == item)"
                  :headers="headers"
                  :footer-props="footerProps"
                  class="edit-table data-table bg-transparent"
                >
                <template v-slot:[`item.is_enable_alert`]="{ item }">
                    <v-chip
                      :color="(item.is_enable_alert)?'green':'red'"
                      dark
                    >
                      {{ (item.is_enable_alert)?'啟用':'停用' }}
                    </v-chip>
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-btn class="btn-icon" @click="editShow(item)">
                      <v-icon>
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                    <v-btn class="btn-icon delete" @click="delsubmit(item)">
                      <v-icon>
                        mdi-trash-can
                      </v-icon>
                    </v-btn>
                    
                  </template>
                </v-data-table>
              </div>
            </v-card>
          </v-row>
          
        </div>
      </div>
      <!-- 移至最上方 -->
      <div class="fixed-btn">
        <div class="to-self">
            <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <button 
                      class="btn-primary" v-bind="attrs" v-on="on"
                      @click="
                        $vuetify.goTo(`#top`, {
                          duration: 500,
                          offset: 2,
                          easing: 'easeInOutCubic'
                        })
                      " >
                        <v-icon>mdi-format-vertical-align-top</v-icon>
                    </button>
                </template>
                <span>回到上方</span>
            </v-tooltip>
        </div>
    </div>
    </v-card>
    <!-- <v-btn class="btn-icon .just-icon" style="position: fixed;bottom: 40px;right: 40px;">
      <v-icon
      @click="
        $vuetify.goTo(`#top`, {
          duration: 500,
          offset: 2,
          easing: 'easeInOutCubic'
        })
      ">mdi-format-vertical-align-top</v-icon>
    </v-btn> -->
    
    <!-- 編輯 -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card class="custom-dialog">
        <v-card-title class="add-title">
            編輯項目 - {{ editedItem.group }}
            <div class="add">
                <v-btn class="btn-secondary close"
                        title="取消" 
                        @click="editDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
        </v-card-title>
        <v-card-text>
          <div class="basic pl-2 pt-2">
            <div class="card-title">
              <div class="title">
                  <v-card-title>基本資料</v-card-title>
              </div>
            </div>
            <v-card-text  class="d-flex flex-column">
              <div class="search flex-align-center">
                <v-text-field filled dense v-model="editedItem.name_en" disabled >
                  <span style="width:100px" slot="prepend">項目(英文)</span>
                </v-text-field>
                <v-text-field filled dense v-model="editedItem.name_ch">
                  <span style="width:100px" slot="prepend">項目(中文)</span>
                </v-text-field>
              </div>
            </v-card-text>
            <v-card-text class="d-flex flex-column pt-0">
              <div class="search flex-align-center full-width">
                <v-text-field class="full-width" label="ppm、°c、g、..." filled dense v-model="editedItem.unit">
                  <span  slot="prepend" style="width:80px">單位</span>
                </v-text-field>
              </div>
            </v-card-text>
            <v-card-text  class="d-flex flex-column pt-0 mb-4">
              <v-switch
                v-model="editedItem.is_enable_alert"
                dense
                color="success"
              ><span slot="prepend"
              style="width:100px">啟用警示</span
                  ></v-switch>
                <span style="color:red;">接收訊息條件：被授權接收通知功能+本人開啟接收+所屬場別+項目啟用通知警報+養殖池狀態限定<br><strong>※ 全部指標通知規則：做水、放養中<br>※ 限定指標通知規則(水位百分比)：蓄水、做水、放養中</strong></span>
            </v-card-text>
            <v-spacer></v-spacer>
            <div class="card-title mb-4">
              <div class="title">
                  <v-card-title>警戒範圍</v-card-title>
                  <span class="error-text">*超過範圍(最大值、最小值)(紅色方塊)，視為不合理，不發送訊息通知</span>
              </div>
            </div>
            <v-card-text class="d-flex flex-column pt-4">
              <v-row class="px-3 py-0">
                <v-col cols="2" style="background-color:#EA4335;color:white;text-align: center">{{minmax[0]}}</v-col>
                <v-col cols="2" style="background-color:#FBBC05;color:white;text-align: center">{{minmax_critical[0]}}</v-col>
                <v-col cols="2" style="background-color:#34A853;color:white;text-align: center">{{minmax_warning[0]}}</v-col>
                <v-col cols="2" style="background-color:#34A853;color:white;text-align: center">{{minmax_warning[1]}}</v-col>
                <v-col cols="2" style="background-color:#FBBC05;color:white;text-align: center">{{minmax_critical[1]}}</v-col>
                <v-col cols="2" style="background-color:#EA4335;color:white;text-align: center">{{minmax[1]}}</v-col>
              </v-row>
            </v-card-text>
            <v-card-text class="slider d-flex flex-column pt-4">
              <span class="subtitle-1  font-weight-black text-center"
                >最小值←→最大值</span
              >
              <v-row>
                <v-col cols="12" sm="2"
                  ><v-text-field
                    v-model.number="minmax[0]"
                    type="number"
                    @change="
                      () => {
                        limit.key += 1;
                      }
                    "
                  ></v-text-field
                ></v-col>
                <v-col cols="12" sm="8">
                  <el-slider
                    :key="limit.key"
                    v-model="minmax"
                    range
                    :marks="limit.marks"
                    :min="0"
                    :max="99999"
                  >
                  </el-slider>
                </v-col>
                <v-col cols="12" sm="2"
                  ><v-text-field
                    v-model.number="minmax[1]"
                    type="number"
                    @change="
                      () => {
                        limit.key += 1;
                      }
                    "
                  ></v-text-field
                ></v-col>
              </v-row>
            </v-card-text>
            <v-card-text  class="slider d-flex flex-column pt-4">
              <span class="subtitle-1 text-center" style="color:red;"
                >危險下限值←→危險上限值</span
              >
              <v-row>
                <v-col cols="12" sm="2"
                  ><v-text-field
                    v-model.number="minmax_critical[0]"
                    type="number"
                    @change="
                      () => {
                        limit_critical.key += 1;
                      }
                    "
                  ></v-text-field></v-col
                ><v-spacer></v-spacer>
                <v-col cols="12" sm="6">
                  <el-slider
                    :key="limit_critical.key"
                    v-model="minmax_critical"
                    range
                    :marks="limit_critical.marks"
                    :min="minmax[0]"
                    :max="minmax[1]"
                  >
                    <!-- 危險的min max 以minmax最大跟最小為限制 -->
                  </el-slider> </v-col
                ><v-spacer></v-spacer>
                <v-col cols="12" sm="2"
                  ><v-text-field
                    v-model.number="minmax_critical[1]"
                    type="number"
                    @change="
                      () => {
                        limit_critical.key += 1;
                      }
                    "
                  ></v-text-field
                ></v-col>
              </v-row>
            </v-card-text>
            <v-card-text  class="slider d-flex flex-column pt-4">
              <span class="subtitle-1 text-center" style="color:orange;"
                >警戒下限值←→警戒上限值</span
              >
              <v-row>
                <v-col cols="12" sm="2"
                  ><v-text-field
                    v-model.number="minmax_warning[0]"
                    type="number"
                    @change="
                      () => {
                        limit_warning.key += 1;
                      }
                    "
                  ></v-text-field></v-col
                ><v-spacer></v-spacer>
                <v-col cols="12" sm="4">
                  <el-slider
                    :key="limit_warning.key"
                    v-model="minmax_warning"
                    range
                    :marks="limit_warning.marks"
                    :min="minmax_critical[0]"
                    :max="minmax_critical[1]"
                  >
                    <!-- 危險的min max 以minmax_critical最大跟最小為限制 -->
                  </el-slider> </v-col
                ><v-spacer></v-spacer>
                <v-col cols="12" sm="2"
                  ><v-text-field
                    v-model.number="minmax_warning[1]"
                    type="number"
                    @change="
                      () => {
                        limit_warning.key += 1;
                      }
                    "
                  ></v-text-field
                ></v-col>
              </v-row>
            </v-card-text>
          </div>
            <!-- 原本的min max設定 -->
            <!-- <v-col cols="12" md="5">
              <v-text-field
                label="下限"
                :value="editedItem.min"
                type="number"
                step="1"
                min="0"
                max="99999"
                @input="edit_mincheck"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              ~
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field
                v-model="editedItem.max"
                label="上限"
                autocomplate="off"
                type="number"
                step="1"
                min="0"
                max="99999"
                @input="edit_maxcheck"
              ></v-text-field>
            </v-col> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="btn-secondary" @click="editDialog = false">取消</v-btn>
          <v-btn class="btn-primary" @click="editsubmit">確定</v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>
    <!-- 新增 -->
    <v-dialog v-model="addDialog" max-width="600px">
      <v-form ref="addform" v-model="valid" lazy-validation>
        <v-card class="custom-dialog">
          <v-card-title class="add-title">
            新增項目-{{ this.addItem.class }}
            <div class="add">
                <v-btn class="btn-secondary close"
                        title="取消" 
                        @click="addDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="basic pl-2 pt-2">
              <div class="card-title">
                <div class="title">
                    <v-card-title>基本資料</v-card-title>
                </div>
              </div>
              <v-card-text class="d-flex flex-column">
                <div class="search flex-align-center">
                  <v-text-field
                    filled dense
                    v-model="addItem.name_en"
                    :rules="rules.require"
                    ><span style="width:80px;" slot="prepend"
                      >項目(英文)</span
                    ></v-text-field
                  >
                  <v-text-field
                    filled dense
                    v-model="addItem.name_ch"
                    :rules="rules.require"
                  ><span style="width:80px;" slot="prepend"
                      >項目(中文)</span
                    ></v-text-field>
                </div>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0">
                <div class="search flex-align-center full-width">
                  <v-text-field class="full-width" label="ppm、°c、g、..." filled dense v-model="addItem.unit" :rules="rules.require">
                  <span  slot="prepend" style="width:80px">單位</span>
                </v-text-field>
                </div>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0">
                <div class="search d-flex flex-column full-width">
                  <v-switch
                  v-model="addItem.is_enable_alert"
                  dense
                  color="success"
                ><span style="width:80px;" slot="prepend"
                      >啟用警示</span
                    ></v-switch>
                  <span style="color:red;">接收訊息條件：被授權接收通知功能+本人開啟接收+所屬場別+項目啟用通知警報+養殖池狀態限定<br><strong>※ 全部指標通知規則：做水、放養中<br>※ 限定指標通知規則(水位百分比)：蓄水、做水、放養中</strong></span>
                </div>
              </v-card-text>
              <v-spacer></v-spacer>
            <div class="card-title mb-4">
              <div class="title">
                  <v-card-title>警戒範圍</v-card-title>
                  <span class="error-text">*超過範圍(最大值、最小值)(紅色方塊)，視為不合理，不發送訊息通知</span>
              </div>
            </div>
            <v-card-text class="d-flex flex-column pt-4">
              <v-row class="px-3 py-0">
                <v-col cols="2" style="background-color:#EA4335;color:white;text-align: center">{{minmax[0]}}</v-col>
                <v-col cols="2" style="background-color:#FBBC05;color:white;text-align: center">{{minmax_critical[0]}}</v-col>
                <v-col cols="2" style="background-color:#34A853;color:white;text-align: center">{{minmax_warning[0]}}</v-col>
                <v-col cols="2" style="background-color:#34A853;color:white;text-align: center">{{minmax_warning[1]}}</v-col>
                <v-col cols="2" style="background-color:#FBBC05;color:white;text-align: center">{{minmax_critical[1]}}</v-col>
                <v-col cols="2" style="background-color:#EA4335;color:white;text-align: center">{{minmax[1]}}</v-col>
              </v-row>
            </v-card-text>
            <v-card-text class="slider d-flex flex-column pt-4">
              <span class="subtitle-1  font-weight-black text-center"
                    >最小值←→最大值</span
                  >
                  <v-row>
                    <v-col cols="12" sm="2"
                      ><v-text-field
                        v-model.number="minmax[0]"
                        type="number"
                        :min="0"
                        :max="minmax[1]"
                        @input="inputchk_addmin"
                        @change="
                          () => {
                            limit.key += 1;
                          }
                        "
                      ></v-text-field
                    ></v-col>
                    <v-col cols="12" sm="8">
                      <el-slider
                        :key="limit.key"
                        v-model="minmax"
                        range
                        :marks="limit.marks"
                        :min="0"
                        :max="99999"
                      >
                      </el-slider>
                    </v-col>
                    <v-col cols="12" sm="2"
                      ><v-text-field
                        v-model.number="minmax[1]"
                        type="number"
                        :min="minmax[0]"
                        :max="99999"
                        @input="inputchk_addmax"
                        @change="
                          () => {
                            limit.key += 1;
                          }
                        "
                      ></v-text-field
                    ></v-col>
                  </v-row>
            </v-card-text>
            <v-card-text class="slider d-flex flex-column pt-4">
              <span class="subtitle-1 text-center" style="color:red;" 
                    >危險下限值←→危險上限值</span
                  >
                  <v-row>
                    <v-col cols="12" sm="2"
                      ><v-text-field
                        v-model.number="minmax_critical[0]"
                        type="number"
                        :min="minmax[0]"
                        :max="minmax[1]"
                        @change="
                          () => {
                            limit_critical.key += 1;
                          }
                        "
                      ></v-text-field></v-col
                    ><v-spacer></v-spacer>
                    <v-col cols="12" sm="6">
                      <el-slider
                        :key="limit_critical.key"
                        v-model="minmax_critical"
                        range
                        :marks="limit_critical.marks"
                        :min="minmax[0]"
                        :max="minmax[1]"
                      >
                        <!-- 危險的min max 以minmax最大跟最小為限制 -->
                      </el-slider> </v-col
                    ><v-spacer></v-spacer>
                    <v-col cols="12" sm="2"
                      ><v-text-field
                        v-model.number="minmax_critical[1]"
                        type="number"
                        :min="minmax[0]"
                        :max="minmax[1]"
                        @change="
                          () => {
                            limit_critical.key += 1;
                          }
                        "
                      ></v-text-field
                    ></v-col>
                  </v-row>
            </v-card-text>
            <v-card-text class="slider d-flex flex-column pt-4">
              <span class="subtitle-1 text-center" style="color:orange;"
                    >警戒下限值←→警戒上限值</span
                  >
                  <v-row>
                    <v-col cols="12" sm="2"
                      ><v-text-field
                        v-model.number="minmax_warning[0]"
                        type="number"
                        :min="minmax_critical[0]"
                        :max="minmax_critical[1]"
                        @change="
                          () => {
                            limit_warning.key += 1;
                          }
                        "
                      ></v-text-field></v-col
                    ><v-spacer></v-spacer>
                    <v-col cols="12" sm="4">
                      <el-slider
                        :key="limit_warning.key"
                        v-model="minmax_warning"
                        range
                        :marks="limit_warning.marks"
                        :min="minmax_critical[0]"
                        :max="minmax_critical[1]"
                      >
                        <!-- 危險的min max 以minmax_critical最大跟最小為限制 -->
                      </el-slider> </v-col
                    ><v-spacer></v-spacer>
                    <v-col cols="12" sm="2"
                      ><v-text-field
                        v-model.number="minmax_warning[1]"
                        type="number"
                        :min="minmax_critical[0]"
                        :max="minmax_critical[1]"
                        @change="
                          () => {
                            limit_warning.key += 1;
                          }
                        "
                      ></v-text-field
                    ></v-col>
                  </v-row>
              </v-card-text>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="addDialog = false">取消</v-btn>
            <v-btn class="btn-primary" @click="addsubmit">確定</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
//-----
import "element-ui/lib/theme-chalk/index.css";
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false
});
export default {
  layout: "emptynologin2",
  middleware: "auth",
  head(){
    return {
      title:"監測管理",
    }
  },
  data() {
    return {
      headers: [
        {
          text: "項目英文",
          //align: "center",
          sortable: false,
          value: "name_en"
        },
        {
          text: "項目中文",
          // align: "center",
          sortable: false,
          value: "name_ch"
        },

        {
          text: "單位",
          align: "center",
          sortable: false,
          value: "unit"
        },
        {
          text: "最小值",
          align: "center",
          sortable: false,
          value: "min"
        },
        {
          text: "最大值",
          align: "center",
          sortable: false,
          value: "max"
        },
        {
          text: "啟用警示",
          align: "center",
          sortable: false,
          value: "is_enable_alert"
        },
        { text: "Actions", value: "actions", sortable: false }
      ],
      footerProps: {
        "items-per-page-text": "每頁",
        "items-per-page-options": [25, 50, 75, 100]
      },
      groupmap: [
        { item: "water", value: "水質監測" },
        { item: "env", value: "環境監測" },
        { item: "feed", value: "投餵飼料" },
        { item: "obs", value: "飼料觀察網" },
        { item: "adv", value: "進階值" },
        { item: "pbio", value: "投餵益生菌" }
      ],
      allcols: [
        {
          group: "water",
          name_ch: "亞硝酸鹽清洗電壓",
          name_en: "亞硝酸鹽清洗電壓",
          unit: "V",
          min: null,
          max: null
        },
        {
          group: "water",
          name_ch: "亞硝酸鹽測試電壓",
          name_en: "亞硝酸鹽測試電壓",
          unit: "V",
          min: null,
          max: null
        }
      ],
      editDialog: false,
      editedItem: {
        class: "",
        item: "",
        value: "",
        min: 0,
        max: 99999
      },
      addDialog: false,
      addItem: {
        class: "",
        item: "",
        value: "",
        is_enable_alert:false,
        min: 0,
        max: 99999,
        critical_min: 0,
        critical_max: 99999,
        warning_min: 0,
        warning_max: 99999
      },
      //form
      valid: true,
      rules: { require: [v => !!v || "*必要項目"] },
      //最大最小值
      limit: {
        key: 0,
        // minmax: [0, 99999],
        marks: {
          // 0: "0",
          // 1000: "1000",
          // 2000: "2000",
          // 4000: "4000",
          // 6000: "6000",
          // 8000: "8000",
          // 10000: "10000"
        }
      },
      //危險min max
      limit_critical: {
        key: 0,
        marks: {
          // 0: "0",
          // 1000: "1000",
          // 2000: "2000",
          // 4000: "4000",
          // 6000: "6000",
          // 8000: "8000",
          // 10000: "10000"
        }
      },
      //警戒min max
      limit_warning: {
        key: 0,
        marks: {
          // 0: "0",
          // 1000: "1000",
          // 2000: "2000",
          // 4000: "4000",
          // 6000: "6000",
          // 8000: "8000",
          // 10000: "10000"
        }
      },
      nowExpand: true,
      expandArray:[],
      isLoading: false
    };
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    await this.getListData();
  },
  computed: {
    newitem: function(val) {
      let myobj = [];
      let colclass = Object.keys(this.allcols); //[water,feed]
      //item value class:water item:排汙耗時,value:排汙耗時(s)
      for (let i = 0; i < colclass.length; i++) {
        myobj[colclass[i]] = [];
        let cols = Object.keys(this.allcols[colclass[i]]); //["排汙耗時", "進水量"]
        let vals = Object.values(this.allcols[colclass[i]]); //["排汙耗時(s)", "進水量.."]
        for (let j = 0; j < cols.length; j++) {
          let item = { class: colclass[i], item: cols[j], value: vals[j] };
          myobj.push(item);
        }
      }
      return myobj;
    },
    cols: function() {
      let col = [];
      col = [...new Set(this.allcols.map(x=>x.group))];
      col = col.filter(x=>x!='feed');//排除項目
      return col; //["water", "feed", "env", "obs", "adv", "pbio"]
    },
    minmax: {
      get: function() {
        if (this.addDialog == true) {
          return [this.addItem.min, this.addItem.max];
        } else {
          return [this.editedItem.min, this.editedItem.max];
        }
      },
      set: function(newValue) {
        if (this.addDialog == true) {
          this.addItem.min = newValue[0];
          this.addItem.max = newValue[1];
        } else {
          this.editedItem.min = newValue[0];
          this.editedItem.max = newValue[1];
        }
      }
    },
    minmax_critical: {
      get: function() {
        if (this.addDialog == true) {
          return [this.addItem.critical_min, Number(this.addItem.critical_max)];
        } else {
          return [
            this.editedItem.critical_min,
            Number(this.editedItem.critical_max)
          ];
        }
      },
      set: function(newValue) {
        if (this.addDialog == true) {
          this.addItem.critical_min = Number(newValue[0]);
          this.addItem.critical_max = Number(newValue[1]);
        } else {
          this.editedItem.critical_min = Number(newValue[0]);
          this.editedItem.critical_max = Number(newValue[1]);
        }
      }
    },
    minmax_warning: {
      get: function() {
        if (this.addDialog == true) {
          return [this.addItem.warning_min, this.addItem.warning_max];
        } else {
          return [this.editedItem.warning_min, this.editedItem.warning_max];
        }
      },
      set: function(newValue) {
        if (this.addDialog == true) {
          this.addItem.warning_min = newValue[0];
          this.addItem.warning_max = newValue[1];
        } else {
          this.editedItem.warning_min = newValue[0];
          this.editedItem.warning_max = newValue[1];
        }
      }
    }
  },
  methods: {
    adjustOpen(index) {
      return this.expandArray[index];
    },
    expandArrayChange(index,bool=false) {
      let now = true;
      if(!bool) {
        now = !this.expandArray[index];
      }else {
        now = this.nowExpand;
      }
       
      let data = _.cloneDeep(this.expandArray);
      this.expandArray = [];
      data.forEach((x,xid)=>{
        if(xid==index){
          this.expandArray.push(now);
        }else {
          this.expandArray.push(x);
        }
      })
      console.log('expand',this.expandArray);
    },
    getListData: async function() {
      this.isLoading = false;
      let getColDataList = await this.getColDataList();
      let data = typeof (getColDataList)=='string'?[]:getColDataList;
      this.allcols = Object.assign([], data);
      let col = [];
      col = [...new Set(this.allcols.map(x=>x.group))];
      col = col.filter(x=>x!='feed');//排除項目
      this.expandArray = [];
      col.forEach(x=>{this.expandArray.push(true)});
      console.log('allcols',this.allcols,this.expandArray);
      this.isLoading = true;
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/`, {
      //     httpsAgent: agent
      //   })
      //   .then(res => {
      //     this.allcols = Object.assign([], res.data);
      //     let col = [];
      //     col = [...new Set(this.allcols.map(x=>x.group))];
      //     col = col.filter(x=>x!='feed');//排除項目
      //     this.expandArray = [];
      //     col.forEach(x=>{this.expandArray.push(true)});
      //     console.log('allcols',this.allcols,this.expandArray);
      //   });
    },
    editShow: function(data) {
      // data
      // group: "water"
      // lmtmax: 99999
      // lmtmin: 0
      // max: null
      // min: null
      // critical_min
      // critical_max
      // name_ch: "亞硝酸鹽清洗電壓"
      // name_en: "亞硝酸鹽清洗電壓"
      // unit: "V"
      data.min = data.min == null ? 0 : data.min;
      data.max = data.max == null ? 99999 : data.max;
      data.critical_min =
        data.critical_min == null ? data.min : data.critical_min;
      data.critical_max =
        data.critical_max == null ? data.max : data.critical_max;
      data.warning_min =
        data.warning_min == null ? data.critical_min : data.warning_min;
      data.warning_max =
        data.warning_max == null ? data.critical_max : data.warning_max;
      this.editedItem = Object.assign({}, data);
      // console.log(this.editedItem);
      this.editDialog = true;
    },
    editsubmit: async function() {
      const updUser = this.$auth.$state.user.email;
      let parm = {
        name_en: this.editedItem.name_en,
        name_ch: this.editedItem.name_ch,
        unit: this.editedItem.unit,
        max: this.editedItem.max,
        min: this.editedItem.min,
        critical_max: this.editedItem.critical_max,
        critical_min: this.editedItem.critical_min,
        warning_max: this.editedItem.warning_max,
        warning_min: this.editedItem.warning_min,
        data_group: this.editedItem.group,
        is_enable_alert:this.editedItem.is_enable_alert,
        updated_user: updUser
      };
      console.log(parm);
      var id = this.editedItem.id;
      var res = false;
      res = await this. patchColDataList(parm,id);
      setTimeout(()=>{
          if(res) {
            this.getListData();
          }
      },50)
      // await this.$axios
      //   .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/${this.editedItem.id}/`, parm, {
      //     httpsAgent: agent
      //   })
      //   .then(res => {
      //     if (res.data == "修改成功") {
      //       this.getListData();
      //       this.$toast.success(`修改成功`, { duration: 2000 });
      //     } else {
      //       this.$toast.error(`修改失敗` + res.data, { duration: 2000 });
      //     }
      //     console.log("修改api:" + res.request.responseURL, res);
      //   })
      //   .catch(error => {
      //     this.$toast.error(`修改失敗` + error.message, { duration: 2000 });
      //   })
      //   .finally(() => {
      //     //this.getdata();
      //   });

      this.editDialog = false;
    },
    addsubmit: async function() {
      if (this.$refs.addform.validate()) {
        const updUser = this.$auth.$state.user.email;
        let parm = {
          name_en: this.addItem.name_en,
          name_ch: this.addItem.name_ch,
          unit: this.addItem.unit,
          min: this.addItem.min,
          max: this.addItem.max,
          critical_max: this.addItem.critical_max,
          critical_min: this.addItem.critical_min,
          warning_max: this.addItem.warning_max,
          warning_min: this.addItem.warning_min,
          data_group: this.addItem.class,
          is_enable_alert:this.addItem.is_enable_alert,
          created_user: updUser
        };
        var res = false;
        res = await this.postColDataList(parm);
        setTimeout(()=>{
            if(res) {
              this.getListData();
              this.addDialog = false;
            }
        },50)
        // await this.$axios
        //   .post(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/`, parm, {
        //     httpsAgent: agent
        //   })
        //   .then(res => {
        //     if (res.data == "新增成功") {
        //       this.getListData();
        //       this.addDialog = false;
        //       this.$toast.success(`新增成功`, { duration: 2000 });
        //     } else {
        //       this.$toast.error(`新增失敗` + res.data, { duration: 2000 });
        //     }
        //   })
        //   .catch(error => {
        //     this.$toast.error(`新增失敗` + error.message, { duration: 2000 });
        //   })
        //   .finally(() => {
        //     //this.getdata();
        //   });
      }
    },
    addShow: function(data) {
      // if (this.$refs.addform != undefined) {
      //   this.$refs.addform.reset();
      // }
      this.addItem.class = data;
      this.addItem.name_en = this.addItem.name_ch = this.addItem.unit = "";
      this.addItem.min = 0;
      this.addItem.max = 99999;
      this.addItem.critical_min = 0;
      this.addItem.critical_max = 99999;
      this.addItem.warning_min = 0;
      this.addItem.warning_max = 99999;

      this.addDialog = true;
    },
    edit_mincheck(val) {
      this.editedItem.min = val ? parseFloat(val) : 0;
      this.$nextTick(() => {
        var objitem = this.editedItem.min;
        this.editedItem.min =
          objitem < 0
            ? 0
            : objitem > this.editedItem.max
            ? Number(this.editedItem.max)
            : objitem;
      });
    },
    edit_maxcheck(val) {
      this.editedItem.max = val ? parseFloat(val) : 0;
      this.$nextTick(() => {
        var objitem = this.editedItem.max;
        this.editedItem.max =
          objitem > 99999
            ? 99999
            : objitem < this.editedItem.min
            ? Number(this.editedItem.min)
            : objitem;
      });
    },
    inputchk_addmin(val) {
      //add min 最小值 check
      this.addItem.min = val ? parseFloat(val) : 0;
      var objitem = this.addItem.min;
      this.$nextTick(() => {
        //小於零時，等於零
        //大於最大值時，等於最大值
        //其餘等於原值
        this.addItem.min =
          objitem < 0
            ? 0
            : objitem >= this.addItem.max
            ? Number(this.addItem.max)
            : objitem;
      });
    },
    inputchk_addmax(val) {
      //add max 最大值 check
      this.addItem.max = val ? parseFloat(val) : 0;
      var objitem = this.addItem.max;
      this.$nextTick(() => {
        //大於999，等於99999
        //小於最小值時，等於最小值
        //其餘等於原值
        this.addItem.max =
          objitem > 99999
            ? 99999
            : objitem <= this.addItem.min
            ? Number(this.addItem.min)
            : objitem;
      });
    },
    delsubmit: async function(data) {
      console.log(data);
      if (confirm(`確定刪除[ ${data.name_ch} ]?`)) {
        let parm = {
          data_group: data.group
        };
        var id = data.id;
        var res = false;
        res = await this.deleteColDataList(id);
        setTimeout(()=>{
            if(res) {
              this.getListData();
            }
        },50)
        // await this.$axios
        //   .delete(
        //     `${this.$store.state.mydata.gobal_api.apiUrl}/col-data/${data.id}/`,
        //     { data: parm },
        //     {
        //       httpsAgent: agent
        //     }
        //   )
        //   .then(res => {
        //     if (res.data == "刪除成功") {
        //       this.getListData();
        //       this.$toast.success(`刪除成功`, { duration: 2000 });
        //     } else {
        //       this.$toast.error(`刪除失敗` + res.data, { duration: 2000 });
        //     }
        //     console.log("刪除api:" + res.request.responseURL, res);
        //   })
        //   .catch(error => {
        //     this.$toast.error(`刪除失敗` + error.message, { duration: 2000 });
        //   })
        //   .finally(() => {
        //     //this.getdata();
        //   });
      }
    },
    getgroupname: function(val) {
      var item = this.groupmap.filter(x => x.item == val);
      if (item.length == 1) {
        return item[0].value;
      } else {
        return val;
      }
    }
  },
  watch: {
    nowExpand() {
      this.expandArray.forEach((x,xid)=>{
        this.expandArrayChange(xid,true)
      })
      
    }
  }
};
</script>

<style lang="scss" scoped>
.tag-groups {
  span {
    color: $color-primary;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }
}

::v-deep {
  .chevron {
      .v-icon {
          color: $color-dark;
      }
  } 
  .slider .theme--light.v-input {
    margin-top: 0;
    padding-top: 0;
  }
}
</style>
