<template>
  <div>
    <v-card class="bg-card" style="margin-bottom: 24px;">
      <div class="card-title">
        <v-row style="margin-bottom: 0;">
          <div class="title">
            <v-icon>mdi-file-check-outline</v-icon>
            <v-card-title>料表執行</v-card-title>
          </div>
        </v-row>
      </div>
      <div class="content">
        <div class="search" style="margin-top: -20px;">
          <v-row style="margin-bottom: 0;">
            <v-col cols="12" md="2">
              <!-- 選擇場 -->
              <div class="search-container">
                <locate-select :dataScope="'field'" defaultSelect="研發一場-YLTCID001_1" :isMulti="false" @scopeSel_data="get_scopeData($event)" class="select-template"></locate-select>
              </div>
            </v-col>
            <!-- 選擇日期sdate -->
            <v-col cols="12" md="2">
              <v-menu
                v-model="menu_sdate"
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
                    filled
                    dense
                    hide-details
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    @change="getimptimedata"
                    @click:clear="
                      () => {
                        (totalData = {}), (imptimedata = []),(feedData = []),(stime = '');
                      }
                    "
                    clearable
                    @click:prepend="() => ((sdate = getNowDate()), getimptimedata())"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="sdate" locale="zh-tw"
                  @change="getimptimedata" no-title
                  @input="menu_sdate = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- 選擇時間點imptimedata -->
            <v-col cols="12" md="2">
              <v-autocomplete
                v-model="stime"
                dense filled
                item-text="time"
                item-value="time"
                
                :items="imptimedata"
                label="選擇資料時間"
                hide-details
                solo
                :no-data-text="`${stime_loading?'資料載入中':'查無資料'}`"
                :disabled = "!sdate"
                @change="getfeedData"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </div>
        <div class="result">
          <v-row style="margin-bottom: 0;">
            <v-col cols="12">
              <!-- 當日餐別明細 -->
              <v-expansion-panels accordion multiple v-model="mealDetails" class="result-card">
                <v-expansion-panel class="my-1">
                    <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-triangle-small-down">當日餐別明細</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-data-table
                        ref="feedtable"
                        :headers="detailHeaders"
                        :items="comboTotal"
                        class="elevation-1"
                        no-data-text="查無資料"
                        :footer-props="{
                          'items-per-page-text': '每頁',
                          'items-per-page-options': [-1, 25, 50, 100]
                        }"
                      >
                      
                      <template v-slot:[`item.combomark`]="{ item }">
                        <v-switch
                          v-model="item.combomark"
                          color="#f5d564"
                          @click="combomarkclick(item.combo_name,item.combomark)"
                          label="" dense hide-details inset
                          
                        ></v-switch>
                      </template>
                      <template v-slot:[`item.combo_name`]="{ item }">
                        <span>{{ item.combo_name }}</span>
                      </template>
                      <template v-slot:[`item.total`]="{ item }">
                        <span>{{ item.total }}g</span>
                      </template>
                      <!-- <template v-slot:[`item.feed_combo_id`]="{ item }">
                        <v-row class="ma-1" dense>
                          <div class="chip" style="display: flex;flex-direction:column">
                            <v-row style="margin-bottom: 0;">
                              <v-chip
                                v-for="(mfla,mid) in item.main_items"
                                :key="mid"
                                style="font-size: 12px;margin: 2px;color: #fff;"
                                color="#408FBC"
                                class="main"
                              >
                                {{ mid }}： {{ mfla }}g
                              </v-chip>
                            </v-row>
                            <v-row  style="margin-bottom: 0;">
                              <v-chip
                                v-for="(fla,fid) in item.sub_items"
                                :key="fid"
                                style="font-size: 12px;margin: 2px;color: #00324E;"
                                color="#BFCBD2"
                                class="sub"
                              >
                                {{ fid }}： {{ fla }}g
                              </v-chip>
                            </v-row>
                          </div>
                        </v-row>
                      </template> -->
                      <template v-slot:[`item.main_items`]="{ item }">
                        <v-row class="ma-1" dense>
                          <div class="chip" style="display: flex;flex-direction:column">
                            <v-row style="margin-bottom: 0;">
                              <v-chip
                                v-for="(mfla,mid) in item.main_items"
                                :key="mid"
                                style="font-size: 12px;margin: 2px;color: #fff;"
                                color="#408FBC"
                                class="main"
                              >
                                {{ mid }}： {{ mfla }}g
                              </v-chip>
                            </v-row>
                          </div>
                        </v-row>
                      </template>
                      <template v-slot:[`item.sub_items`]="{ item }">
                        <v-row class="ma-1" dense>
                          <div class="chip" style="display: flex;flex-direction:column">
                            <v-row  style="margin-bottom: 0;">
                              <v-chip
                                v-for="(fla,fid) in item.sub_items"
                                :key="fid"
                                style="font-size: 12px;margin: 2px;color: #00324E;"
                                color="#BFCBD2"
                                class="sub"
                              >
                                {{ fid }}： {{ fla }}g
                              </v-chip>
                            </v-row>
                          </div>
                        </v-row>
                      </template>
                    </v-data-table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <!-- 料表 -->
              <v-card class="result-card" >
                <!-- 表頭 -->
                <div class="card-title">
                  <div class="title">
                    <v-row style="margin-right: 12px;margin-left: 12px;margin-bottom: 12px;">
                      <v-col cols="12" md="6">
                        <v-autocomplete
                          v-model="showsub"
                          multiple
                          chips
                          clearable
                          no-data-text="無項目"
                          :items="sub_allitems"
                          filled
                          hide-details
                          label="獨立顯示子成份項目"
                          class="items"
                          :style="{'width':`${windowWidth>375?'100%':'calc(100% - 56px)'}`}"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="6"
                        :style="{'padding-top':`${windowWidth>960?'0':'12px'}`}">
                        <div class="right"
                          style="display: flex;align-items: center;"
                          :style="{'justifyContent':`${windowWidth>960?'flex-end':'flex-start'}`}"
                        >
                          <v-btn icon @click="cellsize -= 0.1"><v-icon>mdi-format-annotation-minus</v-icon></v-btn>
                          <v-btn icon @click="cellsize = 1"><v-icon>mdi-format-color-text</v-icon></v-btn>
                          <v-btn icon @click="cellsize += 0.1"><v-icon>mdi-format-annotation-plus</v-icon></v-btn>
                          <v-btn
                            tile
                            class="btn-primary"
                            @click="downloadcsv"
                            style="margin: 0 4px;"
                            :disabled="feedData.length==0"
                            >下載</v-btn>
                          <v-btn
                            class="btn-primary green"
                            tile
                            @click="execsubmit"
                            :disabled="multipleSelection.length == 0"
                            style="margin: 0 4px;"
                            >執行</v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <!-- 清單 -->
                <div class="result-list">
                  <el-table
                    id="outTable"
                    ref="mutitable"
                    :data="feedData2"
                    :row-style="isTagColor"
                    row-key="id"
                    default-expand-all
                    @selection-change="handleSelectionChange"
                    @select-all="selectall"
                    :cell-style="cellStyle"
                    :key="mutitablekey"
                  >
                    <!-- 減少一欄佔空間所以用area_name2解決 -->
                    <el-table-column
                      prop="area_name2"
                      label="區域"
                      sortable
                      :sort-by="['area_name2']"
                      fixed="left"
                    >
                      <!-- <template slot-scope="scope">{{(scope.row.hasOwnProperty('children'))?scope.row.area_name:''}}</template> -->
                    </el-table-column>
                    <!-- <el-table-column
                      prop="pond_name"
                      label="養殖池"
                      sortable
                      width="100"
                    /> -->
                    <!-- 總量(主+次) -->
                    <el-table-column
                      prop="feed_total"
                      label="總量(主+次)"
                      width="100"
                    />
                    <!-- 獨立項目 -->
                    <el-table-column label="獨立項目" v-if="showsub.length > 0" width="200">
                      <template #default="scope">
                        <div v-if="scope.row.hasOwnProperty('sub_items')">
                          <v-chip
                            class="item-chip"
                            label
                            
                            v-for="(sub, idx) in scope.row.sub_items.filter(x =>
                              showsub.includes(x.name)
                            )"
                            :key="idx"
                          >
                            <span :style="`font-size:${cellsize}em`">{{ `${sub.name.substr(0,1)}：${Math.round((sub.feed_amount + Number.EPSILON) * 1) / 1}` }}</span>
                          </v-chip>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 觀察網 -->
                    <el-table-column label="是否有觀察網" width="120">
                      <template #default="scope">
                        <div v-if="!scope.row.hasOwnProperty('children')">
                          <span>{{ `${scope.row.has_observation?'有':'無'}` }}</span>
                        </div>
                      </template>
                    </el-table-column>

                    <!-- 觀察網(不含糖) -->
                    <el-table-column
                      prop="observation_total"
                      label="觀察網(不含糖)"
                      width="120"
                    />
                    
                    <!-- 餐別 -->
                    <el-table-column
                      prop="feed_combo_name"
                      label="餐別"
                      min-width="150"
                    />
                    <el-table-column
                      prop="executed_user"
                      label="執行人員"
                    />
                    <el-table-column
                      align="center"
                      type="selection"
                      :selectable="checkSelectable"
                      width="55"
                      fixed="right"
                    >
                    </el-table-column>
                    <!-- 本來要弄button按鈕，目前不需要 -->
                    <el-table-column align="right" v-if="false" style="justify-content: center;">
                      <!-- <template #header>
                      <el-input
                        v-model="search"
                        size="small"
                        placeholder="Type to search"
                      />
                    </template> -->
                      <template #default="scope">
                        <el-button
                          size="small"
                          @click="handleEdit(scope.$index, scope.row)"
                          v-if="!scope.row.hasOwnProperty('children')"
                          :disabled="scope.row.is_executed"
                          >{{ scope.row.is_executed ? "已執行" : "執行" }}</el-button
                        >
                      </template>
                    </el-table-column>
                    <!-- <el-table-column prop="id" label="ID" width="180"> </el-table-column> -->
                    <template slot="empty">
                      <span>查無資料</span>
                    </template>
                  </el-table>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card> 
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx/xlsx.js";
import dayjs from "dayjs";
export default {
  layout: "emptynologin",
  middleware: "auth",
  head(){
    return {
      title:"料表執行",
    }
  },
  data() {
    return {
      factoryData: [], //場架構
      factoryid: "1", //場id
      //---日曆
      menu_sdate: false,
      sdate: "",
      stime: "",
      stime_loading:false,
      //--帶入資料
      imptimedata: [],
      //料表資料
      feedData: [],
      //tablesetting
      multipleSelection: [],
      checkedkeys: false,
      //獨立顯示子成份項目
      showsub: [],
      //餐別合計
      totalData: [],
      //table cell size
      cellsize:1,
      //餐別mark
      combomark:[],
      mutitablekey:false,
      mealDetails: [0],
      // 表格title
      detailHeaders:[
        { text: "", value: "combomark", align: "right", width: 80,sortable: false },
        { text: "套餐",align: "start",value: "combo_name",width: 200,sortable: false},
        // { text: "成分",align: "start",value: "feed_combo_id",width: 200,sortable: false},
        { text: "主成分",align: "start",value: "main_items",width: 200,sortable: false},
        { text: "次成分",align: "start",value: "sub_items",width: 200,sortable: false},
        { text: "合計",value: "total",align: "center",width: 200,sortable: false},],
      feedHeaders:[{ text: "區域",align: "start",sortable: false},
        {text: "養殖池",align: "start",value: "pond_name2",width: 100,sortable: false},
        { text: "總量(主+次)",align: "start",value: "feed_total",width: 100,sortable: false},
        { text: "獨立項目",align: "start",value: "sub_items",width: 200,sortable: false},
        { text: "是否有觀察網",value: "has_observation",align: "center",width: 120,sortable: false},
        { text: "是否有觀察網",value: "has_observation",align: "center",width: 200,sortable: false},
        { text: "觀察網(不含糖)",value: "observation_total",align: "center",width: 200,sortable: false},
        { text: "餐別",value: "feed_combo_name",align: "center",width: 200,sortable: false},
        { text: "執行人員",value: "executed_user",align: "center",width: 200,sortable: false},
        { text: "",value: "is_executed",align: "center",width: 50,sortable: false}],
      windowWidth: window.innerWidth
    };
  },
  methods: {
    get_scopeData(evt) {
      console.log('Change Field',evt);
      // console.log('factory data',this.factoryData);
      let fieldId = evt.split('_')[evt.split('_').length-1];
      this.factoryid = fieldId;
      this.getimptimedata();
    },
    combomarkclick:function(data,bool){
      if(bool) {
        if(!this.combomark.includes(data)) {
          this.combomark.push(data);
        }
      }else {
        if(this.combomark.includes(data)) {
          let index = this.combomark.indexOf(data);
          this.combomark.splice(index,1);
        }
      }
      if(this.feedData2.length>0){
        this.feedData2.forEach(element=>{
          element.children.forEach (ele2 =>{
            ele2.combomark = this.combomark.includes(ele2.feed_combo_name);
          },this)
        },this);
      }
      this.mutitablekey = !this.mutitablekey;
      
      // console.log(data,this.combomark,this.feedData2);
    },
    isTagColor:function(row){
      if(row.row.combomark==true){
        return {
          backgroundColor: "#f5d564",
          color: "#827717",
        }
      }
    },
    downloadcsv: function() {
      // 如果表格中没有fixed属性固定列，直接取表格id就行
      // const table = document.querySelector(‘#outTable’)
      // 如果表格中有fixed属性固定列，需要像下面这样做一下处理，要不然下载的excel数据会重复2次！参考：https://blog.csdn.net/WYA1993/article/details/85319138
      const tb = document.querySelector("#outTable").cloneNode(true);
      if (tb.querySelector(".el-table__fixed")) {
        tb.removeChild(tb.querySelector(".el-table__fixed"));
      }
      //fixed=right就要加這段
      if (tb.querySelector(".el-table__fixed-right")) {
        tb.removeChild(tb.querySelector(".el-table__fixed-right"));
        debugger
      }
      var wb = XLSX.utils.table_to_book(tb);
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          `下載_${dayjs().format("YYYY-MM-DD")}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //取得場架構
    getarchitecture: async function() {
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`;
      await this.$axios
        .get(url)
        .then(res => {
          this.factoryData = res.data;
          this.factoryid = res.data[0].id;
          //   var item = [];
          //   res.data.forEach(element => {
          //     //#[{id:1,level:"1",name:一場,node:[area_no: "tf",id: 1,level: "2",name: "天府",node: Array(36)]}]
          //     if (element.hasOwnProperty("node")) {
          //       const factory_id = element.id;
          //       for (let i = 0; i < element.node.length; i++) {
          //         const ele = element.node[i];
          //         //# ele.node
          //         //#   .filter(x => x.visible == true)
          //         //#   .map(x => (x.area_name = ele.name)); //把天府名稱放入area_name,把池名稱放入pond_name
          //         ele.node
          //           .filter(x => x.visible == true)
          //           .map(x => {
          //             (x.area_name = ele.name),
          //               (x.pond_name = x.name),
          //               (x.pond_id = x.id);
          //           }); //#把天府名稱放入area_name,把池名稱放入pond_name,池id放入pond_id
          //         ele.node
          //           .filter(x => x.visible == true)
          //           .map(x => (x.factory_id = factory_id)); //把場id放入
          //         var getdata = ele.node.filter(x => x.visible == true);
          //         item.push(..._.cloneDeep(getdata));
          //       }
          //     }
          // });
          //   this.desserts = item;
          console.log("取得場架構API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error(`取得場架構失敗:${error}`, {
            duration: 2000
          });
        })
        .finally(() => {
          //this.getdata();
        });
    },
    //取得帶入的資料
    getimptimedata: async function() {
      console.log('stime',this.stime);
      this.feedData = []; //清空表格資料
      // this.stime = "";
      this.stime_loading = true;//loading
      if (!this.sdate) {
        this.imptimedata = [];
        // this.totalData = {};
        return;
      }
      var para = {
        feed_date: this.sdate
      };

      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-record/`, {
          params: para
        })
        .then(res => {
          console.log('get record',res);
          let newData = [];
          res.data.forEach((d,id)=>{
            newData.push({
              time: d.time,
              data: new Array()
            })
            d.data.forEach(s=>{
              if(s.factory_id == this.factoryid) {
                newData[id].data.push(s);
              }
            })
          })
          // this.imptimedata = res.data;
          this.imptimedata = [];
          newData.forEach(n=>{
            if(n.data.length>0) {
              this.imptimedata.push(n);
            }
          })
          res.data.sort(function(a,b){
            var a1 = a.time.replace(":","");
            var b1 = b.time.replace(":","");
            if(a1 > b1){return 1};
            if(a1 < b1){return -1};
            return 0;
          });
          // if(this.sdate && this.stime) {
          //   this.getfeedData();
          // }else {
            this.stime = ''
            this.gettotalData();
          // }
          console.log("取得帶入的資料API:" + res.request.responseURL);
          // console.log("取出資料",this.imptimedata);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        })
        .finally(() => {
          this.stime_loading = false;//loading
        });
    },
    //取得料表
    getfeedData: async function(bool) {
      console.log('getFeedData',bool);
      this.combomark=[];
      // this.feedData = [
      //   {
      //     id: 1,
      //     time: "01:00",
      //     area_name: "武曲",
      //     pond_name: "A1",
      //     pond_id: 1,
      //     feed_combo_id: 1,
      //     feed_combo_name: "1號餐",
      //     feed_total: 1000,
      //     ovserve_total: 30,
      //     is_executed: false,
      //     main_items: [
      //       { main_id: 1, main_name: "蝦料1", feed_amount: 100 },
      //       { main_id: 2, main_name: "蝦料2", feed_amount: 110 }
      //     ],
      //     sub_items: [
      //       { sub_id: 1, sub_name: "糖", feed_amount: 1 },
      //       { sub_id: 2, sub_name: "水", feed_amount: 2 }
      //     ]
      //   },
      // ];
      //取得料表
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-checklist/`;
      var parm = {
        factory_id: this.factoryid,
        feed_time: `${this.sdate} ${this.stime}`
      };
      await this.$axios
        .get(url, { params: parm })
        .then(res => {
          this.feedData = res.data;
          this.gettotalData(); //取得合計

          // 點選執行成功後，不顯示取得料表成功，太多資訊
          if(bool!==true) {
            this.$toast.success(`取得料表成功`, { duration: 2000 });
          }
          
          console.log("取得料表API:" + res.request.responseURL);
          console.log('取得料表',this.feedData);
        })
        .catch(error => {
          this.$toast.error(`取得料表失敗:${error}`, {
            duration: 2000
          });
        })
        .finally(() => {
          //this.getdata();
        });
    },
    //取得合計
    gettotalData: async function() {
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-record-total-by-time/`;
      var parm = {
        feed_date: `${this.sdate}`,
        factory_id: this.factoryid
      };
      await this.$axios
        .get(url, { params: parm })
        .then(res => {
          // this.feedData = res.data;
          this.totalData = res.data;

          // this.$toast.success(`取得合計成功`, { duration: 2000 });
          console.log("取得合計API:" + res.request.responseURL);
          console.log("取得合計",this.totalData);
        })
        .catch(error => {
          this.$toast.error(`取得合計失敗:${error}`, {
            duration: 2000
          });
        })
        .finally(() => {});
    },
    //執行
    execsubmit: async function() {
      var parm = {
        executed_user: this.$auth.$state.user.email,
        id: this.multipleSelection.map(x => x.id),
        is_executed: true
      };
      // console.log(parm);
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-checklist-batch-update/`;
      await this.$axios
        .post(url, parm)
        .then(res => {
          if (res.data == "修改成功") {
            // this.feedData = []; //清空表格資料
            // this.stime = "";

            // 原本是清空資料，怪怪der，因此更改為重新撈取資料(因為要執行者和是否執行的資訊)
            this. getfeedData(true);

            this.$toast.success(`執行成功：${parm.id.length}筆`, {
              duration: 2000
            });
          } else {
            this.$toast.error(`執行失敗：${res.data}`, { duration: 2000 });
          }
          console.log("執行API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error(`執行失敗:${error}`, {
            duration: 2000
          });
        })
        .finally(() => {
          //this.getdata();
        });
    },
    //多選用
    handleSelectionChange(val) {
      console.log("val", val);

      this.multipleSelection = val;
    },
    //多選用
    selectall() {
      this.checkedkeys = !this.checkedkeys;
      this.select(this.feedData2, this.checkedkeys);
    },
    //多選用
    select(data, flag) {
      data.forEach(row => {
        if (
          row.hasOwnProperty("children") == false &&
          row.hasOwnProperty("is_executed") &&
          row.is_executed == false
        ) {
          //子類 且 有可執行flag 且 未執行
          this.$refs.mutitable.toggleRowSelection(row, flag);
          console.log(row.is_executed);
        }
        if (row.children != undefined) {
          this.select(row.children, this.checkedkeys);
        }
      });
    },
    //是否可選
    checkSelectable(row) {
      if (row.hasOwnProperty("children")) {
        return false;
      } else {
        return row.is_executed == false;
      }
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    }
  },
  computed: {
    cellStyle:function(){
      let r = {
        "font-size":this.cellsize + 'em',
        // "height":"20px",
        // "margin-top":"5px",
        "ine-height":"none",
        "padding":"0px",
      }
      return r;
    },
    feedData2: function() {
      var arealst = Array.from(new Set(this.feedData.map(x => x.area_name)));
      var items = [];
      for (let idx = 0; idx < arealst.length; idx++) {
        const area_name = arealst[idx];
        //把水池名組合到area_name2
        this.feedData
          .filter(x => x.area_name == area_name)
          .map(x => (x.area_name2 = x.pond_name));
        
        const children = this.feedData.filter(x => x.area_name == area_name);
        var sub = this.showsub;
        // console.log(sub);
        // console.log('feedData',this.feedData);
        // console.log('combo',this.combomark);
        //扣除獨立顯示項目的量

        children.forEach(element => {
          
          //主成份total
          var main_total = (element.main_items.length==0)?0:element.main_items
            .map(x => x.feed_amount)
            .reduce((a, b) => {
              return a + b;
            });
          //子成份total
          var sub_total = (element.sub_items.length==0)?0:element.sub_items
            .map(x => x.feed_amount)
            .reduce((a, b) => {
              return a + b;
            });
          var total = main_total + sub_total;
          element.feed_total = Math.round((total + Number.EPSILON) * 1) / 1;
          //子成份查找有無包含獨立顯示，有的話再去改total
          if (element.sub_items.filter(x => sub.includes(x.name)).length > 0) {
            //陣列裡每個項目(次項目)

            //陣列裡面每個數字加起來(限獨立項目)
            var value = element.sub_items
              .filter(x => sub.includes(x.name))
              .map(x => x.feed_amount)
              .reduce((a, b) => {
                return a + b;
              });
            //total扣除
            //小數點2位
            // Math.round((total - value + Number.EPSILON) * 100) / 100;
            //小數點0位
            element.feed_total =
              Math.round((total - value + Number.EPSILON) * 1) / 1;
          }
          // observation_total 小數點去掉
          element.observation_total = Math.round((element.observation_total + Number.EPSILON) * 1) / 1;
          element.combomark = false;
          // tag 
          for(let i=0;i<this.combomark.length;i++) {
            if(element.feed_combo_name == this.combomark[i]) {
              element.combomark = true;
            } 
          }
          // has_observation 是否有觀察網
          let ob_data = {};
          this.imptimedata.forEach(d=>{d.data.forEach(s=>{
            if(s.id == element.id) {
              ob_data = s;
            }
          })})
          // console.log('ob_data',ob_data);
          element.has_observation = ob_data.has_observation;
        });
        //以id排序
        // children.sort(function(a,b){return a.feed_combo_id - b.feed_combo_id})
        //以name排序
        //children.sort(function(a,b){return a.feed_combo_name.localeCompare(b.feed_combo_name)})/
        var item = {
          id: `${idx}_${area_name}`,
          area_name2: area_name,
          children: children
        };
        items.push(item);
      }
      console.log('data2',items);
      return items.sort();
    },
    //當明餐別合計
    comboTotal: function() {
      //[{time:'01:00',feed:[{feed_combo_name: [{…}],
      // main_items: [{…}],
      // sub_items},{..........}]}]
      // var data = this.feedData;
      let data = this.totalData;
      if (this.totalData.length > 0) {
        //['1號餐', '2號餐']
        // var combo_list = Array.from(
        //   new Set(this.totalData.map(x => x.feed_combo_name))
        // );
        let combo_list2 = []; //展開成單一一筆
        data.forEach(dataelement => {
          var name_list = dataelement.feed; //.map(x=>x.feed_combo_id);
          combo_list2.push(...name_list);
        });
        //['1號餐', '2號餐']
        var combo_list = Array.from(
          new Set(combo_list2.map(x => x.feed_combo_name))
        ); //feed_combo_name
        let combo_result = [];
        for (let idx = 0; idx < combo_list.length; idx++) {
          //每種餐下去算各別的量
          var totaldata = data;
          const combo_name = combo_list[idx];
          // const combo_item = this.totalData.filter(
          //   x => x.feed_combo_name == combo_name
          // );
          //抓1號餐所有資料
          const combo_item = combo_list2.filter(
            x => x.feed_combo_name == combo_name
          );
          const main_items = {};
          const sub_items = {};
          for (let mainidx = 0; mainidx < combo_item.length; mainidx++) {
            const mitem = combo_item[mainidx].main_items;
            const sitem = combo_item[mainidx].sub_items;
            mitem.forEach(element => {
              var pre =
                main_items[element.name] == undefined
                  ? 0.0
                  : main_items[element.name];
              // var value = pre + element.feed_amount;
              var value = pre + element.total_amount;
              //math用來解決浮點數相加會出現10.000000000001的狀況
              main_items[element.name] =
                Math.round((value + Number.EPSILON) * 1) / 1;
            });
            sitem.forEach(element => {
              var pre =
                sub_items[element.name] == undefined
                  ? 0
                  : sub_items[element.name];
              // var value = pre + element.feed_amount;
              var value = pre + element.total_amount;
              sub_items[element.name] =
                Math.round((value + Number.EPSILON) * 100) / 100;
              console.log("sub_items:",element.name,sub_items[element.name],value);
            });
          }
          //const 2023.09.03突然網頁報錯，調整成var
          var tot =
            Object.values(main_items).reduce((prev, curr) => prev + curr, 0) +
            Object.values(sub_items).reduce((prev, curr) => prev + curr, 0);
            tot = Math.round((tot + Number.EPSILON) * 1) / 1;
            combo_result.push({
            combo_name: combo_name,
            main_items: main_items,
            sub_items: sub_items,
            total: tot,
            combomark: false
          });
        }
        return combo_result;
      }
      return [];
    },
    sub_allitems: function() {
      var sub = this.comboTotal.map(x => Object.keys(x.sub_items));
      var sub2 = [];
      for (let i = 0; i < sub.length; i++) {
        //[['w1','w2'],[..]]
        sub[i].forEach(ele => {
          if (sub2.includes(ele) == false) {
            sub2.push(ele);
          }
        });
      }
      return sub2;
    }
  },
  async mounted() {
    await this.getarchitecture(); //取得場架構
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
  },
  watch: {
    windowWidth() {
      this.windowWidth = window.innerWidth;
    },
    // 獨立項目造成表格錯位，因此需要另外監測data變換時，doLayout(官方提供的)，另fixed相鄰的欄位不設定寬度，即可解決
    // doLayout() 对 Table 进行重新布局。当 Table 或元素由隐藏切换为显示时，需要调用此方法。參考：https://blog.csdn.net/NMGWAP/article/details/126026337
    feedData2: {
      handler() {
        this.$nextTick(()=>{
          this.$refs.mutitable.doLayout();
        })
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.v-application--is-ltr {
  .v-sheet.result-card.v-card:not(.v-sheet--outlined),.v-expansion-panel::before {
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .v-card.result-card {
    padding: 12px;
    padding-bottom: 8px;
    background-color: #E6F5FA;
    .card-title {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 !important;
      .title {
        // border-bottom: 1px solid rgba(0,0,0,0.1);
        width: 100%;
        .col-12 {
          padding: 0;
        }
        .v-icon.v-icon {
            font-size: 1rem;
        }
        .theme--light.v-icon {
            color: #006AA6;
        }
        .v-card__title {
            color: #006AA6;
            font-size: 1rem;
            padding: 8px;
        }
        // .right {
        //   padding: 0 12px;
        // }
      }
    }
    .content {
      min-height: 39vh;
    }
    .result-list {
      padding: 0 12px 12px;
      min-height: 21vh;
    }
    
  }
}
.v-application.v-application--is-ltr .v-card.bg-card .content .title .theme--light.v-icon {
 font-size: 1.25rem;
}
.v-application.v-application--is-ltr .v-card.bg-card .content .title .theme--light.v-icon.mdi-format-color-text {
  padding-top: 6px;
  font-size: 1.35rem;
}
::v-deep {
  .search {
    // locateselect
    .select-template {
      flex: 1;
      margin-right: 16px;
      .font-size-large {
        font-size: 16px;
      }
      .vue-treeselect__control,.vue-treeselect--searchable .vue-treeselect__input-container,.vue-treeselect__placeholder {
        padding-left: 0;
        padding-right: 0;
      }
      .vue-treeselect__control {
        border: none;
        border-radius: 0;
        border-bottom: 1px solid $color-form;
        .vue-treeselect__placeholder {
          color: $color-dark;
          &::before {
            content: '*'
          }
          &::after {
            content: '(必選)';
          }
        }
        .vue-treeselect__control-arrow, .vue-treeselect__option-arrow,.vue-treeselect__x-container {
          color: $color-form;
        }
        .vue-treeselect__x-container {
          display: none;
        }
      }
      .vue-treeselect:not(.vue-treeselect--disabled):not(.vue-treeselect--focused) .vue-treeselect__control:hover,
      .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
        border-color: $color-form;
      }
      .vue-treeselect--searchable .vue-treeselect__input-container,.vue-treeselect__input,.vue-treeselect--focused,
      .theme--light.v-input input {
        font-size: 14px;
        color: $color-dark;
      }
    }
    // 搜尋欄
    .theme--light.v-text-field--filled > .v-input__control > .v-input__slot,.theme--light.v-text-field--filled:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot:hover {
      background: transparent;
    }
    .v-text-field--filled.v-input--dense > .v-input__control > .v-input__slot,.v-text-field--filled > .v-input__control > .v-input__slot {
      min-height: 36px;
    }
    .v-text-field--filled:not(.v-text-field--single-line) input {
      margin-top: 0;
    }
    .v-input--is-label-active.v-text-field--filled:not(.v-text-field--single-line) input {
      margin-top: 4px;
    }
    .v-text-field input {
      padding: 0;
    }
    .v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
      align-items: center;
    }
    .v-text-field--filled.v-input--dense .v-label {
      top: 8px;
    }
    .v-text-field--filled.v-input--dense .v-label.v-label--active {
      top: 0;
      color: $color-form;
    }
    
    .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
        box-shadow: none;
        border: 1px solid $color-form;
    }
    .theme--light.v-icon {
      color: $color-form;
    }
    .theme--light.v-text-field > .v-input__control > .v-input__slot:before,.theme--light.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before {
      border-color: $color-form;
    }
    .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo) .v-input__append-inner,
    .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo) .v-input__prepend-outer {
      margin-top: 8px;
    }
  }
  .result {
    // 當日餐點明細
    .theme--light.v-expansion-panels {
      margin-bottom: 16px;
    }
    .theme--light.v-expansion-panels .v-expansion-panel {
      background-color: $color-lighten;
      color: $color-dark;
      padding: 12px 8px;
    }
    .theme--light.v-expansion-panels .v-expansion-panel-header {
      border-bottom: 1px solid rgba(0,0,0,0.1);
      margin: 0 12px;
      width: calc(100% - 24px);
    }
    .theme--light.v-expansion-panels .v-expansion-panel-header,.v-expansion-panel--active > .v-expansion-panel-header {
      font-weight: bold;
      .v-expansion-panel-header__icon .v-icon {
        color: $color-dark;
      }
    }
    .theme--light.v-data-table {
      background-color: transparent;
      box-shadow: none !important;
    }
    .v-expansion-panel-content__wrap {
      padding: 0 12px 16px;
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
      background: rgba($color-primary-25,0.3);
    }
    .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
      font-size: 0.8rem;
    }
    // 料表
    .right .theme--light.v-icon {
      color: $color-primary;
    }
    .theme--light.v-text-field--filled > .v-input__control > .v-input__slot,
    .theme--light.v-text-field--filled:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot:hover {
      background: $color-lighten;
    }
    .theme--light.v-label {
      font-size: 15px;
    }
    .theme--light.v-label.v-label--active {
      color: $color-form;
    }
    .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
      border-color: $color-form;
    }
    .v-select.v-select--chips:not(.v-text-field--single-line).v-text-field--enclosed .v-select__selections {
      min-height: 36px;
    }
    .v-text-field--filled > .v-input__control > .v-input__slot {
      min-height: 48px;
    }
    .v-text-field--filled .v-label.v-label--active {
      top: 12px;
    }
    .el-table, .el-table__expanded-cell,.el-table tr,.el-table th.el-table__cell {
      background: $color-lighten;
      background-color: $color-lighten;
    }
    .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    .el-table .el-table__header-wrapper td.el-table__cell, .el-table th.el-table__cell.is-leaf {
      border-bottom: 1px solid transparent;
    }
    // .el-table .el-table__fixed-header-wrapper th.el-table__cell.is-leaf {
    //   border-bottom: 1px solid transparent;
    // }
    .el-table .cell {
      padding: 0 16px;
    }
    .el-table thead {
      color: rgba(0,0,0,0.6);
      font-size: 0.8rem;
    }
    .el-table tr.el-table__row--level-0 {
      font-size: 0.65rem;
      height: 40px;
      font-weight: bold;
      color: $color-dark;
      
      & td {
        background-color: $color-primary-25;
        padding: 0 16px;
      }
      & td:nth-child(1) {
        border-radius: 4px 0 0 0;
      }
      & td:last-child {
        border-radius: 0 4px 0 0;
      }
      & i::before {
        color: $color-dark;
        font-weight: bold;
        font-size: 1rem;
      }
    }
    .el-table__row.el-table__row--level-1 .cell {
      // font-size: 0.875rem;
      // min-height: 48px;
      display: flex;
      align-items: center;
      padding: 8px;
    }
    .el-table__body tr.el-table__row.el-table__row--level-1.hover-row>td.el-table__cell {
      background-color: rgba($color-primary-25,0.3);
    }
    .el-checkbox.is-disabled {
      display: none;
    }
    .el-table-column--selection .cell {
      justify-content: center;
    }
    .items {
      .v-chip.v-size--default {
        height: 24px;
        background-color: $color-primary-25;
        color: $color-dark;
        span {
          font-size: 0.8rem;
        }
      }
    }
    .v-chip.v-chip--outlined.v-chip.v-chip,.v-chip.v-chip.v-chip.item-chip {
      height: 24px;
      margin: 4px 2px;
      // border-color: $color-primary;
      // color: $color-primary;
      background-color: $color-primary-25;
      color: $color-dark;
      border-color: transparent;
      span {
        font-size: 0.8rem;
      }
    }
    .v-chip--label {
      border-radius: 12px !important;
    }
    .el-table__empty-block {
      width: 100%;
      border-top: 1px solid rgba(0,0,0,0.1);
    }
    .el-table__expand-icon {
      transform: rotate(0deg);
      transition: all 0.3s;
      &:active {
        // content: "";
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgba(0,0,0,0.12);
      }
    }
    .el-icon-arrow-right:before {
      content: "\e6df";
    }
    .el-table__expand-icon--expanded .el-icon-arrow-right:before {
      content: "\e6e1";
    }
    
  }
}

</style>
