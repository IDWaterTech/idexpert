<template>
  <div id="top">
    <v-overlay :value="!isLoading" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card class="bg-card">
      <v-row class="flex-center-between mb-4">
        <div class="content pt-3">
          <v-col cols="12">
            <v-tabs v-model="currentTab" show-arrows>
              <!-- 上方tab -->
              <v-tab v-for="(tab, idx) in tabsMap" :key="idx" :href="`#` + tab.name">
                {{ tab.name }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="currentTab">
              <!-- 1.案場指標 -->
              <v-tab-item :value="tabsMap[0].name">
                <div>
                  <!-- 選擇場區 -->
                  <v-col cols="12" sm="4" style="position: relative;" class="pt-3">
                    <locate-select class="select-template mr-0" :dataScope="'field'" :defaultSelect="defaultPool"
                      :isMulti="false" @scopeSel_data="get_scopeData($event); resultListOpen = true;"></locate-select>
                  </v-col>
                  <!-- 主要深藍區域 -->
                  <v-card class="result-card full-width">
                    <!-- 工具列 -->
                    <div class="title border-bottom flex-center-between">
                      <v-card-title style="font-size: 14px;">
                        <span @click="getFieldItems">案場指標</span>
                      </v-card-title>
                      <div class="chevron mr-4">
                        <v-btn class="btn-icon green" @click="() => {
                          fieldItemsFormMode = 'add';
                          if ($refs.fieldItemsForm) {$refs.fieldItemsForm.reset();}
                          getMyItemsGroup(true, '指標');
                          fieldItemsDialog = true;
                        }"><v-icon>mdi-plus</v-icon></v-btn>
                      </div>
                    </div>
                    <!-- 表格 -->
                    <div class="content">
                      <v-data-table :items="col_settings" :headers="col_headers" :loading="!isLoading"
                        loading-text="載入中..." no-data-text="無資料" class="edit-table data-table bg-transparent">
                        <!-- 警戒範圍 -->
                        <template v-slot:[`item.warning`]="{ item }">
                          <v-row class="px-3 py-0">
                            <v-col cols="2"
                              style="background-color:#EA4335;color:white;text-align: center">{{item.minimum??'-'}}</v-col>
                            <v-col cols="2"
                              style="background-color:#FBBC05;color:white;text-align: center">{{item.critical_min??'-'}}</v-col>
                            <v-col cols="2"
                              style="background-color:#34A853;color:white;text-align: center">{{item.warning_min??'-'}}</v-col>
                            <v-col cols="2"
                              style="background-color:#34A853;color:white;text-align: center">{{item.warning_max??'-'}}</v-col>
                            <v-col cols="2"
                              style="background-color:#FBBC05;color:white;text-align: center">{{item.critical_max??'-'}}</v-col>
                            <v-col cols="2"
                              style="background-color:#EA4335;color:white;text-align: center">{{item.maximum??'-'}}</v-col>
                          </v-row>
                        </template>
                        <!-- 通知 -->
                        <template v-slot:[`item.is_enable_alert`]="{ item }">
                          <div class="d-flex justify-center">
                            <v-icon v-if="item.is_enable_alert" color="success">mdi-bell-outline</v-icon>
                            <v-icon v-else>mdi-bell-off</v-icon>
                            <v-switch v-if="false" :input-value="item.is_enable_alert" dense color="success"
                              class="ml-2" @click.native.prevent.stop.capture
                              :label="`${(item.is_enable_alert)?'啟用':'停用'}`"></v-switch>
                          </div>
                        </template>
                        <!-- 加盟者 -->
                        <template v-slot:[`item.is_visible_to_franchisee`]="{ item }">
                          <div class="d-flex justify-center">
                            <v-icon v-if="item.is_visible_to_franchisee" color="success">mdi-bell-outline</v-icon>
                            <v-icon v-else>mdi-bell-off</v-icon>
                            <v-switch v-if="false" v-model="item.is_visible_to_franchisee" dense color="success"
                              class="ml-2" @click.native.prevent.stop.capture
                              :label="`${(item.is_visible_to_franchisee)?'可檢視':'禁止檢視'}`"></v-switch>
                          </div>
                        </template>
                        <!-- 操作 -->
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-btn class="btn-icon" @click="fieldItemsDialogAction(item)">
                            <v-icon>
                              mdi-pencil
                            </v-icon>
                          </v-btn>
                          <v-btn class="btn-icon delete" @click="delFieldItem(item)">
                            <v-icon>
                              mdi-trash-can
                            </v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </div>
                  </v-card>
                  <!-- 新增OR修改 案場指標 -->
                  <v-dialog v-model="fieldItemsDialog" width="600px" scrollable>
                    <v-form ref="fieldItemsForm" v-model="fieldItemsValid" lazy-validation>
                      <v-card>
                        <v-card-title>{{(fieldItemsFormMode=='add')?`新增`:`修改`}}-案場指標</v-card-title>
                        <v-card-text scrollable style="max-height: 500px;">
                          <v-select class="align-center mt-2" clearable outlined dense :items="myItemsData.indicator"
                            v-model="fieldItemsForm.data_col_id" item-text="name_ch" item-value="id" required
                            :disabled="fieldItemsFormMode=='edit'" :rules="[v => !!v || '此欄位必填']"
                            label="選擇欲加入的指標..."></v-select>
                          <v-row class="px-3 py-0 my-2">
                            <v-col class="d-flex align-center text-center" cols="2">最小值</v-col>
                            <v-col class="d-flex align-center text-center" cols="2">危險下限值</v-col>
                            <v-col class="d-flex align-center text-center" cols="2">警戒下限值</v-col>
                            <v-col class="d-flex align-center text-center" cols="2">警戒上限值</v-col>
                            <v-col class="d-flex align-center text-center" cols="2">危險上限值</v-col>
                            <v-col class="d-flex align-center text-center" cols="2">最大值</v-col>

                            <v-col cols="2" style="background-color:#EA4335;color:white;text-align: center">
                              <v-text-field dense hide-details solo flat color="white" placeholder="輸入"
                                style="color: white" type="number"
                                v-model.number="fieldItemsForm.minimum"></v-text-field>
                            </v-col>
                            <v-col cols="2" style="background-color:#FBBC05;color:white;text-align: center">
                              <v-text-field dense hide-details solo flat color="white" placeholder="輸入"
                                style="color: white" type="number"
                                v-model.number="fieldItemsForm.critical_min"></v-text-field>
                            </v-col>
                            <v-col cols="2" style="background-color:#34A853;color:white;text-align: center">
                              <v-text-field dense hide-details solo flat color="white" placeholder="輸入"
                                style="color: white" type="number"
                                v-model.number="fieldItemsForm.warning_min"></v-text-field>
                            </v-col>
                            <v-col cols="2" style="background-color:#34A853;color:white;text-align: center">
                              <v-text-field dense hide-details solo flat color="white" placeholder="輸入"
                                style="color: white" type="number"
                                v-model.number="fieldItemsForm.warning_max"></v-text-field>
                            </v-col>
                            <v-col cols="2" style="background-color:#FBBC05;color:white;text-align: center">
                              <v-text-field dense hide-details solo flat color="white" placeholder="輸入"
                                style="color: white" type="number"
                                v-model.number="fieldItemsForm.critical_max"></v-text-field>
                            </v-col>
                            <v-col cols="2" style="background-color:#EA4335;color:white;text-align: center">
                              <v-text-field dense hide-details solo flat color="white" placeholder="輸入"
                                style="color: white" type="number"
                                v-model.number="fieldItemsForm.maximum"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-switch v-model="fieldItemsForm.is_enable_alert" label="警報通知"></v-switch>
                              <span style="color:red;">接收訊息條件：被授權接收通知功能+本人開啟接收+所屬場別+項目啟用通知警報+養殖池狀態限定<br><strong>※
                                全部指標通知規則：做水、放養中<br/>※
                                限定指標通知規則(水位百分比)：蓄水、做水、放養中</strong></span><br/>
                              <v-switch v-model="fieldItemsForm.is_visible_to_franchisee" label="加盟客戶檢視"></v-switch>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn class="btn-secondary" @click="fieldItemsDialogSubmit">送出</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-form>
                  </v-dialog>
                </div>
              </v-tab-item>
              <!-- 2.指標基本檔設定 -->
              <v-tab-item :value="tabsMap[1].name">
                <div class="d-flex align-center">
                  <span>我要設定：</span>
                  <v-radio-group v-model="myItemsRadio" row
                    @change="getMyItemsGroup(true,myItemsRadio);mainFormReset();">
                    <v-radio label="群組" value="群組"></v-radio>
                    <v-radio label="指標" value="指標"></v-radio>
                  </v-radio-group>
                  <v-select class="align-center" clearable outlined dense hide-details :items="myItems"
                    @change="changeMainFormData" v-model="RadioListItem" item-text="name_ch" item-value="id"
                    label="請選擇..."></v-select>
                </div>
                <div>

                  <v-card max-width="400" elevation="5" tile class="ma-3 pa-3">
                    <v-card-text>
                      <v-btn color="success" small :disabled="!!RadioListItem" @click="mainFormAdd">新增+</v-btn>
                    </v-card-text>
                    <!-- 主要表單form -->
                    <v-form ref="mainForm" v-model="mainFormValid" :disabled="!RadioListItem">
                      <div>
                        <v-card-text>
                          <span v-show="RadioListItem && mainFormMode!='add'">ID:{{ mainForm?.id ?? "" }} </span>
                          <v-text-field v-model="mainForm.name_ch" dense filled required label="名稱(中)*" class="mb-3"
                            :rules="[v => !!v || '此欄位必填']"></v-text-field>
                          <v-text-field v-model="mainForm.name_en" dense filled required label="名稱(英)*" class="mb-3"
                            :rules="[v => !!v || '此欄位必填']"></v-text-field>
                          <div v-show="myItemsRadio == '指標'">
                            <v-text-field v-model="mainForm.unit" dense outlined hide-details label="單位(度、包、箱...)"
                              class="mb-3"></v-text-field>
                            <v-select class="align-center mb-3" clearable outlined dense hide-details
                              :items="myItemsData.group" v-model="mainForm.data_col_group_id" item-text="name_ch"
                              item-value="id" label="指標群組..."></v-select>
                          </div>
                          <span v-if="mainFormMode!='add'">{{ mainForm.updated_user ?? "" }} </span>
                          <span v-if="mainFormMode!='add'">{{ mainForm.updated_time ?? "" }} </span>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn class="btn-secondary delete" @click="mainFormDel"
                            :disabled="(!RadioListItem || mainFormMode=='add')">刪除</v-btn>
                          <v-btn class="btn-secondary" @click="mainFormReset" :disabled="!RadioListItem">取消</v-btn>
                          <v-btn class="btn-primary" @click="mainFormSubmit" :disabled="!RadioListItem">送出</v-btn>
                        </v-card-actions>
                      </div>
                    </v-form>
                    <!-- end -->
                  </v-card>

                </div>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </div>
      </v-row>
    </v-card>
    
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
      fieldItemsFormMode: "add", //場的指標form模式 add or edit
      fieldItemsForm: {
        "data_col_id": undefined,
        "maximum": undefined,
        "minimum": undefined,
        "warning_max": undefined,
        "warning_min": undefined,
        "critical_max": undefined,
        "critical_min": undefined,
        "is_enable_alert": false,
        "is_visible_to_franchisee": false,
        "created_user": undefined
      },
      fieldItemsValid:true,
      fieldItemsDialog: false, //場的指標dialog
      field: undefined, //場區
      headers: [
        // { text: "項目英文", sortable: false, value: "name_en" },
        { text: "項目名稱", sortable: false, value: "name_ch" },
        { text: "單位", align: "center", sortable: false, value: "unit" },
        { text: "最小值", align: "center", sortable: false, value: "min" },
        { text: "最大值", align: "center", sortable: false, value: "max" },
        { text: "啟用警示", align: "center", sortable: false, value: "is_enable_alert" },
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
        max: 99999,
        is_visible_to_franchisee:false,//加盟客戶是否可檢視
      },
      addDialog: false,
      addItem: {
        class: "",
        item: "",
        value: "",
        is_enable_alert:false,
        is_visible_to_franchisee:false,//加盟客戶是否可檢視
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
      expandArray:[],
      isLoading: false,
      defaultPool:undefined, //預設場區
      currentTab: "",
      tabsMap: [
        { name: "案場指標" },
        { name: "指標基本檔設定" },
      ],
      myItemsRadio: "群組", //群組 或 指標
      myItems:[],//群組 或 指標 的 清單
      myItemsData:{group:[], indicator:[]}, //群組 或 指標 的 清單 資料
      RadioListItem: undefined, //選擇的群組或指標 下拉清單選到的項目
      mainForm:{
        id: '', //主表單id
        name_ch: '',
        name_en: '',
        updated_user: '',
        updated_time: '',
        data_col_group_id: '', //指標群組
        unit: '' //單位
      },
      mainFormValid: true, //主表單驗證
      mainFormMode: "edit", //主表單模式 add/edit
      col_settings: [//表格欄位內容
      ],
      col_headers:[//表格欄位標題名稱
        {text: "id", value: "id", sortable: false, align: "center"},
        {text: "項目名稱", value: "data_col_name_ch", sortable: false, align: "center"},
        {text: "警戒", value: "warning", sortable: false, align: "center"},
        // {text: "最大值", value: "maximum", sortable: false, align: "center"},
        // {text: "最小值", value: "minimum", sortable: false, align: "center"},
        // {text: "警戒上限值", value: "warning_max", sortable: false, align: "center"},
        // {text: "警戒下限值", value: "warning_min", sortable: false, align: "center"},
        // {text: "危險上限值", value: "critical_max", sortable: false, align: "center"},
        // {text: "危險下限值", value: "critical_min", sortable: false, align: "center"},
        {text: "警報通知", value: "is_enable_alert", sortable: false, align: "center"},
        {text: "加盟客戶檢視", value: "is_visible_to_franchisee", sortable: false, align: "center"},
        { text: "Actions", value: "actions", sortable: false, align: "center" }
      ]
    };
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    this.defaultPool = '彰化芳苑-CHFYGY001_2';
    this.currentTab = this.tabsMap[0].name;
    await this.getListData();//取得清潬的資料-群組或指標
    await this.getMyItemsGroup(true,'群組');//取得群組或指標清單
    //await this.getFieldItems(); //取得場的指標清單
    //組合文字 先mark
    // if(this.maindata.length>0) {
    //   console.log('localStorage.getItem', this.maindata)
    //   this.defaultPool = this.maindata[0].node[0].name+'_'+this.maindata[0].node[0].id;
    //   this.nowAreaId.factory_id = this.maindata[0].id;
    //   this.nowAreaId.pond_area_id = this.maindata[0].node[0].id;
    // }else {
    //   this.defaultPool = '';
    // }
  },
  computed: {
    
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
    fieldItemsDialogAction: function (item) {
      this.fieldItemsFormMode = 'edit'; 
      this.fieldItemsForm = _.cloneDeep(item); 
      this.getMyItemsGroup(true, '指標'); 
      this.fieldItemsDialog = true;
    },
    //fieldItemsForm送出
    fieldItemsDialogSubmit:async function() {
      console.log('fieldItemsDialogSubmit-資料:',this.fieldItemsFormMode, this.fieldItemsForm);
      
      var field = this.field;
      var data = {
        data_col_id: this.fieldItemsForm.data_col_id,
        maximum: this.fieldItemsForm.maximum,
        minimum: this.fieldItemsForm.minimum,
        warning_max: this.fieldItemsForm.warning_max,
        warning_min: this.fieldItemsForm.warning_min,
        critical_max: this.fieldItemsForm.critical_max,
        critical_min: this.fieldItemsForm.critical_min,
        is_enable_alert: this.fieldItemsForm.is_enable_alert,
        is_visible_to_franchisee: this.fieldItemsForm.is_visible_to_franchisee,
        //created_user: this.$auth.$state.user.email
      }
      if(this.fieldItemsFormMode == 'add') {
        data.created_user = this.$auth.$state.user.email; 
      }
      if(this.fieldItemsFormMode == 'edit') {
        data.updated_user = this.$auth.$state.user.email;
      }
      
      //驗證
      this.fieldItemsValid = this.$refs.fieldItemsForm.validate();
      console.log('fieldItemsDialogSubmit-驗證結果:', this.fieldItemsValid);
      
      if(this.fieldItemsValid) {
        // var data = this.fieldItemsForm;
        // data.created_user = this.$auth.$state.user.email;
        var url = '';
        if(this.fieldItemsFormMode == 'add') {
          url = `${this.$store.state.mydata.gobal_api.apiUrl}/factory/${this.field}/data-col/`;
          await this.$axios
          .post(url, data, { httpsAgent: agent })
          .then(res => {
            console.log('fieldItemsDialogSubmit-res:', res.data);
            if(res.data.detail == "Success") {
              this.$toast.success(`${this.fieldItemsFormMode=='add'?"新增成功":"修改成功"}`, { duration: 2000 });
              this.getFieldItems();
              this.fieldItemsDialog = false;
            }else{
              console.error('fieldItemsDialogSubmit-err:', res.data.messages);
              this.$toast.error(`${this.fieldItemsFormMode=='add'?"新增失敗:":"修改失敗:"}`+ res.data.messages, { duration: 2000 });
              return;
            }
            
          })
          .catch(err => {
            const errorMsg =
                  err?.response?.data?.message ||            // 後端自己傳的錯誤訊息
                  err?.message ||                            // Axios 內建訊息
                  '未知錯誤';
            this.$toast.error(`${(this.fieldItemsFormMode=='add')?"新增失敗":"修改失敗"}` +`:${errorMsg}`, { duration: 2000 });
          });
        }
        if(this.fieldItemsFormMode == 'edit') {
          var id = this.fieldItemsForm.id;
          url = `${this.$store.state.mydata.gobal_api.apiUrl}/factory/${this.field}/data-col/${id}/`;
          await this.$axios
          .patch(url, data, { httpsAgent: agent })
          .then(res => {
            console.log('fieldItemsDialogSubmit-res:', res.data);
            if(res.data.detail == "Success") {
              this.$toast.success(`${this.fieldItemsFormMode=='add'?"新增成功":"修改成功"}`, { duration: 2000 });
              this.getFieldItems();
              this.fieldItemsDialog = false;
            }else{
              console.error('fieldItemsDialogSubmit-err:', res.data.messages);
              this.$toast.error(`${this.fieldItemsFormMode=='add'?"新增失敗:":"修改失敗:"}`+ res.data.messages, { duration: 2000 });
              return;
            }
            
          })
          .catch(err => {
            const errorMsg =
                  err?.response?.data?.message ||            // 後端自己傳的錯誤訊息
                  err?.message ||                            // Axios 內建訊息
                  '未知錯誤';
            this.$toast.error(`${(this.fieldItemsFormMode=='add')?"新增失敗":"修改失敗"}` +`:${errorMsg}`, { duration: 2000 });
          });
        }
        
      }
    },
    //刪除-案場指標
    delFieldItem:async function(item) {
      if(confirm(`確定刪除此案場指標?-${item.data_col_name_ch}`) == false) {
        return;
      }
      var field = this.field;
      var id =item.id;
      console.log('delFieldItem-item:', field, id);
      var url = `${this.$store.state.mydata.gobal_api.apiUrl}/factory/${field}/data-col/${id}/`;
      await this.$axios
        .delete(url, { httpsAgent: agent })
        .then(res => {
          console.log('delFieldItem-res:', res.data);
          this.$toast.success("刪除成功", { duration: 2000 });
          this.getFieldItems();
        })
        .catch(err => {
          const errorMsg =
                err?.response?.data?.message ||            // 後端自己傳的錯誤訊息
                err?.message ||                            // Axios 內建訊息
                '未知錯誤';
          this.$toast.error(`刪除失敗:${errorMsg}`, { duration: 2000 });
        });
    },
    //取得-案場指標清單
    getFieldItems: async function () {
      this.isLoading = false;
      this.col_settings = []; //清空

      await this.$nextTick();// 等畫面真的重繪為空

      var id = this.field;
      var url = `${this.$store.state.mydata.gobal_api.apiUrl}/factory/${id}/data-col/`;
      this.$axios
        .get(url, { httpsAgent: agent })
        .then(res => {
          this.col_settings = res.data;

        })
        .catch(err => {
          console.error('getFieldItems-err:', err);
          this.$toast.error("取得案場指標清單失敗");

        })
        .finally(() => {
          this.isLoading = true;
        });


    },
    //主表單 送出
    mainFormSubmit:async function() {
      // if (this.$refs.mainForm.validate() == false) {
      //   return;
      // }
      //this.mainFormMode = "edit";

      this.mainFormValid = this.$refs.mainForm.validate();
      console.log('mainFormSubmit-驗證結果:', this.mainFormValid,this.mainFormMode);
      //先寫完新增 待處理編輯 刪除★
      if(this.mainFormValid) {

        switch(this.mainFormMode) {
          case 'add':
            //群組新增資料(3項)
            var data = {
              name_ch: this.mainForm.name_ch,
              name_en: this.mainForm.name_en,
              created_user: this.$auth.$state.user.email
            };
            //指標新增資料(3+2=5項)
            if(this.myItemsRadio=='指標') {
              data.unit = this.mainForm.unit;
              data.data_col_group_id = this.mainForm.data_col_group_id;
            }
            
            var urlName = '';
            urlName = (this.myItemsRadio == '群組') ? 'data-col-group' : `data-col`;
            console.log('mainFormSubmit-資料:', data);
            console.log('mainFormSubmit-URL:', urlName);
            await this.$axios
              .post(`${this.$store.state.mydata.gobal_api.apiUrl}/${urlName}/`, data)
              .then(res => {
                if (res.data.detail == "Invalid fields") {
                  console.error('mainFormSubmit-err:', res.data.messages);
                  this.$toast.error("新增失敗，請檢查輸入資料"+ res.data.messages, { duration: 2000 });
                  return;

                }
                console.log('mainFormSubmit-res url:', res.config.url);
                this.$refs.mainForm.reset();
                this.mainForm.updated_time = "";
                this.mainForm.updated_user = "";
                this.RadioListItem = undefined;
                this.getListData();
                //this.myItemsData.group = [];//清空群組資料
                // this.myItemsData.indicator = [];//清空指標資料
                this.getMyItemsGroup(true,this.myItemsRadio);//重新取得群組或指標清單
                this.$toast.success("新增成功", { duration: 2000 });
              })
              .catch(err => {
                console.error('mainFormSubmit-err:', err);
                this.$toast.error("新增失敗");
              });
              // .finally(() => {
              //   console.log('mainFormSubmit-api done.');
              //   this.mainFormMode = "edit";
              // });
            break;
          case 'edit':
            console.log('mainFormSubmit-mainForm:', this.mainForm);
            var id = this.mainForm.id;
            //群組資料(3項)
            var data  = {
              name_ch: this.mainForm.name_ch,
              name_en: this.mainForm.name_en,
              updated_user: this.$auth.$state.user.email
            }
            //指標資料(3+2=5項)
            if(this.myItemsRadio=='指標') {
              data.unit = this.mainForm.unit;
              data.data_col_group_id = this.mainForm.data_col_group_id;
            }
            console.log('mainFormSubmit-表單資料:', data);
            var urlName = '';
            urlName = (this.myItemsRadio == '群組') ? 'data-col-group' : `data-col`;
            await this.$axios.patch(`${this.$store.state.mydata.gobal_api.apiUrl}/${urlName}/${id}/`, data)
              .then(res => {
                if (res.data.detail == "Invalid fields") {
                  console.error('mainFormSubmit-err:', res.data.messages);
                  this.$toast.error("編輯失敗，請檢查輸入資料" + res.data.messages, { duration: 2000 });
                  return;
                }
                //下面整包跟add一樣
                console.log('mainFormSubmit-res url:', res.config.url);
                this.$refs.mainForm.reset();
                this.RadioListItem = undefined;
                this.getListData();
                //this.myItemsData.group = [];//清空群組資料
                // this.myItemsData.indicator = [];//清空指標資料
                this.getMyItemsGroup(true,this.myItemsRadio);//重新取得群組或指標清單
                this.$toast.success("編輯成功", { duration: 2000 });
              })
              .catch(err => {
                console.error('mainFormSubmit-err:', err);
                this.$toast.error("編輯失敗");
              })
              .finally(() => {
                console.log('mainFormSubmit-api done.');
              });
            break;
          
        }
        
        
      }else {
        console.error('mainFormValid-驗證失敗'); 
      }
    },
    //主表單新增-開啟表單
    mainFormAdd:function(){
      this.RadioListItem = true;
      this.mainFormMode = "add";
    },
    //主表單刪除
    mainFormDel:async function() {
      var id = this.mainForm.id;
      var name = this.mainForm.name_ch;
      if(confirm(`確定要刪除嗎？:${name}(${id})`)===false) {
        return;
      }
      var urlName = '';
      urlName = (this.myItemsRadio == '群組') ? 'data-col-group' : `data-col`;
      console.log('mainFormDel-刪除ID:', id);
      await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/${urlName}/${id}/`)
        .then(res => {
          console.log('mainFormDel-res:', res);
          this.$toast.success("刪除成功", { duration: 2000 });
          this.getListData();
          //this.myItemsData.group = [];//清空群組資料
          // this.myItemsData.indicator = [];//清空指標資料
          this.getMyItemsGroup(true,this.myItemsRadio);//重新取得群組或指標清單
        })
        .catch(err => {
          const errorMsg =
                err?.response?.data?.message ||            // 後端自己傳的錯誤訊息
                err?.message ||                            // Axios 內建訊息
                '未知錯誤';
          this.$toast.error(`刪除失敗:${errorMsg}`, { duration: 2000 });
        })
        .finally(() => {
          console.log('mainFormDel-api done.');
          this.mainFormReset();
        });
    },
    //重設主表單
    mainFormReset:function() {
      this.RadioListItem = undefined;
      this.mainFormMode = "add";
      this.$refs.mainForm.reset();
      // this.mainForm = {
      //   name_ch: undefined,
      //   name_en: "",
      //   updated_user: "",
      //   updated_time: ""
      // };
      // this.myItemsRadio = "群組";
    },
    //更新下拉清單資料群組或指標
    changeMainFormData:function() {
      if(this.RadioListItem=="" || this.RadioListItem==undefined) {
        this.RadioListItem = undefined;
        this.mainForm = {
          id: '',
          name_ch: '',
          name_en: '',
          updated_user: '',
          updated_time: '',
          data_col_group_id: '', //指標群組
          unit: '' //單位
        };
        this.mainFormMode = "add";
        this.$refs.mainForm.reset();
        return;

      }
      this.mainFormMode = "edit";
      switch(this.myItemsRadio) {
        case '群組':
          var data = this.myItems.filter(x=>x.id==this.RadioListItem)[0];
          this.mainForm = _.cloneDeep(data);
          // this.mainForm.name_ch = this.RadioListItem.group_name;
          // this.mainForm.name_en = this.RadioListItem.group_name_en;
          break;
        case '指標':
          var data = this.myItems.filter(x=>x.id==this.RadioListItem)[0];
          this.mainForm = _.cloneDeep(data);
          break;
      }

      
    },
    //選擇場區後取得場的動作
    get_scopeData:function(evt){
      //console.log('get_scopeData-evt★★:',evt);//彰化芳苑-CHFYGY001_2
      if(evt) {
       var field = evt.split('_')[evt.split('_').length-1];
       this.field = field;
       this.getFieldItems(); //取得場的指標清單
      //  console.log('get_scopeData-field:',field);//2
      }
    },
    //取得欄位清單
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
    //取得清潬的資料-群組或指標
    getMyItemsGroup:async function(reGetData=false,dataItem="群組") {
      console.log("getMyItemsGroup-開始抓取群組或指標清單");
      this.myItems = [];
      // 選單
      var radio = "";
      if(dataItem == "群組"){radio = "data-col-group"};
      if(dataItem == "指標"){radio = "data-col"};
      
      if(reGetData) {
        if(dataItem=="群組"){this.myItemsData.group = [];radio = "data-col-group"}
        if(dataItem=="指標"){this.myItemsData.indicator = [];radio = "data-col"}
      }
      switch(dataItem){
        case "群組":
          if(this.myItemsData.group.length>0) {
            this.myItems = this.myItemsData.group;
            return;//不再往下抓資料
          }
          break;
        case "指標":
          if(this.myItemsData.indicator.length>0) {
            this.myItems = this.myItemsData.indicator;
            return;//不再往下抓資料
          }
          break;
      }
      //抓資料
      try {
        let data = await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/${radio}/`)
        // console.log("群組清單:" + data.request.responseURL);
        if (data.status == 200) {
          switch (dataItem) {
            case "群組":
              this.myItemsData.group = _.cloneDeep(data.data).sort(function (a, b) {
                return a.id - b.id;
              });;
              this.myItems = this.myItemsData.group;
              break;
            case "指標":
              this.myItemsData.indicator = _.cloneDeep(data.data).sort(function (a, b) {
                return a.id - b.id;
              });;
              this.myItems = this.myItemsData.indicator;
              break;
          }
        } else {
          this.myItems = [];
        }

      } catch (error) {
        this.$toast.error("錯誤：" + error, { duration: 2000 });
        console.log(error);
      }
      //排序資料
      const sorted = this.myItems.sort(function (a, b) {
        return a.id - b.id;
      });
      this.myItems = sorted;
    },
  },
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
