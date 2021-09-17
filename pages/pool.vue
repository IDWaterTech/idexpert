<template>
  <div>
    <!-- <v-card elevation="1" outlined tile min-height="200"> -->
    <v-row no-gutters justify="center">
      <v-col cols="12" sm="3" class="text-center my-5">
        <!-- <div class="circle">
          <span class="circletitle">{{ poolName }}</span>
        </div> -->
        <!-- <span class="circletitle headline my-5 text-center">{{
          poolName
        }}</span> -->
        <!-- {{getNodeName(maindata,poolid)}} -->
        <treeselect
          v-model="poolid"
          :options="maindata"
          :default-expand-level="1"
          placeholder="請選擇職位"
          :disable-branch-nodes="true"
          children="node"
          :normalizer="
            node => {
              return { children: node.node };
            }
          "
          @input="mainchange"
        >
          <div slot="value-label" slot-scope="{ node }">
            {{ `${node.raw.parent}_${node.raw.name}` }}
          </div>
          <div slot="option-label" slot-scope="{ node }">
            {{ `${node.raw.name}` }}
          </div>
        </treeselect>
      </v-col>
      <v-col cols="12" sm="9" style="border:3px dashed red;">警示區</v-col>
      <v-col cols="12" sm="3">
        <!-- 選擇起日 -->
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
              v-model="started_date"
              label="選擇起日"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              @click:prepend="() => (started_date = getNowDate())"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="started_date"
            @input="menu_startdate = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="3">
        <!-- 選擇訖日 -->
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
              v-model="ended_date"
              label="選擇訖日"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              @click:prepend="() => (ended_date = getNowDate())"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="ended_date"
            @input="menu_enddate = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="3">
        <v-btn tile class="mt-2" color="primary" @click="getCircleData"
          >查詢</v-btn
        >
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12">
        <v-btn color="primary" tile @click="showadd"
          ><v-icon>mdi-plus</v-icon>新增循環</v-btn
        >
        <v-dialog v-model="addDialog" max-width="500px">
          <v-form v-model="addvalid">
            <v-card>
              <v-card-title>新增-養殖循環</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="addparm.name"
                  label="名稱/批號"
                  :rules="rules.require"
                  autocomplete="off"
                ></v-text-field>
                <v-menu
                  v-model="menu_adddate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="addparm.started_date"
                      label="選擇起日"
                      :rules="rules.require"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:prepend="
                        () => (addparm.started_date = getNowDate())
                      "
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="addparm.started_date"
                    @input="menu_adddate = false"
                  ></v-date-picker>
                </v-menu>
              </v-card-text>
              <v-card-text>
                <v-row align="center">
                  <!-- 體積 -->
                  <v-col cols="3">
                    <v-text-field
                      v-model="add_volume"
                      label="體積(水量)"
                      type="number"
                      disabled
                      background-color="blue-grey lighten-4"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1"  class="text-center">X</v-col>
                  <!-- 密度 -->
                  <v-col cols="3">
                    <v-text-field
                      v-model.number="addparm.num_per_unit"
                      label="密度"
                      type="number"
                      :rules="rules.require"
                      @change="()=>{addparm.estimated_num= add_volume * addparm.num_per_unit}"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" class="text-center">=</v-col>
                  <!-- 初始放苗量(估計) -->
                  <v-col cols="4">
                    <v-text-field
                      v-model="addparm.estimated_num"
                      label="初始放苗量(估計)"
                      type="number"
                      :rules="rules.require"
                      disabled
                      background-color="blue-grey lighten-4"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submitadd">確認</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-col>
      <v-col cols="12" sm="12" class="my-3">
        <el-table
          ref="circletable"
          style="width:100%"
          :data="circleData"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
          :header-cell-style="tableHeaderStyle"
          height="250"
          @select="handleSelectionChange"
          :header-cell-name="cellClass"
        >
          <!-- <el-table-column type="selection" label="123" width="55"></el-table-column> -->
          <el-table-column
            label="循環起日"
            prop="started_date"
            align="center"
          ></el-table-column>
          <el-table-column label="循環訖日" prop="ended_date" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{
                scope.row.ended_date == null || scope.row.ended_date == ""
                  ? `執行中`
                  : scope.row.ended_date
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="養殖天數"
            prop="days"
            align="center"
          ></el-table-column>
          <el-table-column
            label="名稱/批號"
            prop="name"
            align="center"
          ></el-table-column>
           <el-table-column
            label="養殖密度"
            prop="num_per_unit"
            align="center"
          ></el-table-column>
          <el-table-column
            label="預估放養隻數"
            prop="estimated_num"
            align="center"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
              <v-btn
                color="primary"
                outlined
                small
                @click="delcircle(scope.row)"
                :disabled="scope.row.ended_date != null"
                >刪除</v-btn
              >
            </template>
          </el-table-column>
        </el-table>
      </v-col>
      <!-- 蝦況 -->
      <v-col cols="12" sm="4">
        <v-card min-height="300px" elevation="3" class="mx-3" tile>
          <v-card-title
            class="py-2"
            style="background-color:#64B5F6;color:white;"
          >
            蝦況
            <v-spacer></v-spacer>
            <v-icon
              @click="showdialog_imgdialog"
              :disabled="!poolid"
              color="white"
              >mdi-image-plus</v-icon
            >
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title>
            <div v-if="shirimpData.length > 0">
              <v-row>
                <v-col
                  cols="12"
                  lg="6"
                  v-for="(item, index) in shirimpData[0].item"
                  :key="index"
                  class="py-1"
                >
                  <v-btn
                    block
                    color="#64B5F6"
                    outlined
                    style="font-size:0.8em;"
                  >
                    {{ `${item.name_ch}:${item.value}` }}
                  </v-btn>
                  <!-- <v-chip class="ma-2" color="#64B5F6" label outlined>
                    {{ item.name_ch }}：{{ item.value }}
                  </v-chip> -->
                </v-col>
                <v-col cols="12" sm="12" class="text-center">
                  <h5>
                    {{ shirimpData[0].inspected_time }}
                  </h5>
                  <!-- 圖：{{shirimpData[0].image_url}}<br/> -->
                </v-col>
                <v-col cols="12" sm="12">
                  <img
                    v-img
                    :src="shirimpData[0].image_url"
                    v-if="shirimpData[0].image_url"
                    width="100%"
                    height="300px"
                  />
                </v-col>
              </v-row>
            </div>
            <div class="text-center my-2" v-else>
              <h4 style="color:#666666;">查無資料</h4>
            </div>
          </v-card-title>
        </v-card>
        <v-dialog v-model="imgdialog" max-width="500px">
          <v-form ref="imgform" v-model="imgvalid" lazy-validation>
            <v-card>
              <!-- style="background-color:#64B5F6;color:white;" -->
              <v-card-title>蝦況</v-card-title><v-divider></v-divider>
              <v-card-text>
                <!-- 日期時間 -->
                <v-row>
                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="menu_imgdate"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="imgdata.imgdate"
                          label="選擇日期(必選)"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="rules.require"
                          @click:prepend="
                            () => (imgdata.imgdate = getNowDate())
                          "
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="imgdata.imgdate"
                        @input="menu_imgdate = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="時間(必選)"
                      v-model="imgdata.imgtime"
                      value=""
                      type="time"
                      prepend-icon="mdi-timeline-clock-outline"
                      @click:prepend="() => (imgdata.imgtime = getNowTime())"
                      :rules="rules.require"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-file-input
                  v-model="imgfiles"
                  :rules="rules.filesize"
                  accept="image/*"
                  show-size
                  placeholder="請選擇欲上傳圖片檔"
                  prepend-icon="mdi-camera"
                  label="蝦況圖片(必選)"
                  @change="chgimgurl"
                ></v-file-input>
                <img
                  v-img
                  :key="imgurlkey"
                  :src="showimgurl"
                  v-if="showimgurl !== ''"
                  width="100%"
                />
                <!-- <v-img v-img :key="imgurlkey" :src="showimgurl" v-if="showimgurl!==''" width="100%"></v-img> -->
              </v-card-text>
              <v-card-text>
                <div v-for="(item, index) in imgdata.item" :key="index">
                  <v-row>
                    <v-col cols="12" sm="6">
                      {{ item.name }}
                    </v-col>
                    <v-col cols="12" sm="6">
                      <el-input-number
                        :id="item.name"
                        :ref="item.name"
                        class="ml-2"
                        v-model="
                          imgdata.item.filter(x => x.name == item.name)[0].value
                        "
                        size="mini"
                        :precision="2"
                        :step="1"
                        :min="num_min"
                        :max="num_max"
                      ></el-input-number>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  tile
                  color="primary"
                  @click="submit_imgdialog"
                  :disabled="false"
                  >上傳</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-col>
      <!-- 數據 -->
      <v-col cols="12" sm="8" style="height:500px;">
        <v-card min-height="500px" elevation="3" class="mx-3" tile>
          <v-card-title
            class="py-2"
            style="background-color:#64B5F6;color:white;"
          >
            數據
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="currentItem">
              <v-tab
                v-for="(item, index) in tabitems"
                :key="index"
                :href="'#tab-' + item"
              >
                {{ item }}
              </v-tab>
              <v-tabs-items v-model="currentItem">
                <v-tab-item :value="'tab-' + tabitems[0]">
                  <v-row>
                    <v-col cols="12">
                      <div
                        class="text-center mt-5"
                        v-if="detectData.length == 0"
                      >
                        <h2>查無資料</h2>
                      </div>
                      <v-slide-group
                        v-model="slidemodel"
                        :show-arrows="'always'"
                      >
                        <v-slide-item
                          v-for="(item, index) in detectData"
                          :key="index"
                          v-slot="{ active, toggle }"
                        >
                          <v-card
                            elevation="3"
                            class="mx-2 my-2 text-center"
                            @click="toggle"
                            :min-width="150"
                            :max-width="200"
                          >
                            <v-card-title class="justify-center">
                              {{ item.name_ch }}<br />
                              {{ item.value }}
                            </v-card-title>
                            <div style="height:120px;" class="px-2">
                              <vue-speedometer
                                :value="item.value"
                                :needleHeightRatio="0.7"
                                :minValue="item.min"
                                :maxValue="item.max"
                                :customSegmentStops="[
                                  item.min,
                                  item.critical_min,
                                  item.warning_min,
                                  item.warning_max,
                                  item.critical_max,
                                  item.max
                                ]"
                                :segmentColors="[
                                  '#F197B3',
                                  '#FFEC8B',
                                  '#89E0B6',
                                  '#FFEC8B',
                                  '#F197B3'
                                ]"
                                :needleTransitionDuration="3333"
                                needleTransition="easeElastic"
                                :ringWidth="20"
                                :width="180"
                                :forceRender="true"
                              ></vue-speedometer>
                            </div>
                            <v-divider></v-divider>
                            <v-card-subtitle class=" py-2 px-2">
                              共：{{ item.rows }}筆
                            </v-card-subtitle>
                            <v-scale-transition>
                              <v-icon
                                v-if="active"
                                color="blue"
                                size="48"
                                v-text="'mdi-close-circle-outline'"
                              ></v-icon>
                            </v-scale-transition>
                          </v-card>
                        </v-slide-item>
                      </v-slide-group>
                    </v-col>
                    <v-spacer></v-spacer>
                  </v-row>
                </v-tab-item>
                <v-tab-item :value="'tab-' + tabitems[1]">
                  <v-row>
                    <v-col class="text-center mt-5"><h2>建置中</h2></v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item :value="'tab-' + tabitems[2]">
                  <v-row>
                    <v-col class="text-center mt-5"><h2>建置中</h2></v-col>
                  </v-row>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- 重要事件紀錄 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="3" tile>
          <v-card-title
            class="py-2"
            style="background-color:#64B5F6;color:white;"
            >重要事件紀錄</v-card-title
          >
          <v-divider></v-divider>
          <v-card-title>
            <ol>
              <li>2020/01/01 asdfasdf</li>
              <li>2020/01/01 asdfasdf</li>
              <li>2020/01/01 asdfasdf</li>
              <li>2020/01/01 asdfasdf</li>
            </ol>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <!-- 養殖歷程 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="3" tile>
          <v-card-title
            class="py-2"
            style="background-color:#64B5F6;color:white;"
            >養殖歷程</v-card-title
          >
          <v-divider></v-divider>
          <v-card-title>
            <ol>
              <li>2020/01/01 asdfasdf</li>
              <li>2020/01/01 asdfasdf</li>
              <li>2020/01/01 asdfasdf</li>
              <li>2020/01/01 asdfasdf</li>
            </ol>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
//-----
import dayjs from "dayjs";
import _ from "lodash";
import "element-ui/lib/theme-chalk/index.css";
// import axios from "~/plugins/axios";
export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
    return {
      req: this.$route.query,
      rules: {
        require: [v => !!v || "*必要項目"],
        filesize: [
          value => !value || value.size < 2000000 || "檔案大小必須小於 2 MB!",
          v => !!v || "*必要項目"
        ]
      },
      poolid: this.$route.query.id,
      poolName: "",
      maindata: [],
      circleData: [
        // {
        //   id: 1,
        //   started_date: "2020/01/01",
        //   ended_date: "執行中",
        //   days: 0,
        //   name: "test"
        // }
      ],
      multipleSelection: [],
      tabitems: ["檢測數據", "計算數據", "當前氣象資訊"],
      currentItem: "檢測數據",
      detectData: [
        // {
        //   name_ch: "測試",
        //   value: 678,
        //   rows: "100",
        //   min: 0,
        //   max: 999,
        //   critical_min: 200,
        //   critical_max: 800,
        //   warning_min: 300,
        //   warning_max: 500
        // }
      ],
      slidemodel: null,
      //蝦況
      shirimpData: [],
      //---日曆
      menu_startdate: false,
      menu_enddate: false,
      ended_date: this.getNowDate(),
      started_date: dayjs(this.ended_date)
        .add(-3, "month")
        .format("YYYY-MM-DD"),
      //新增視窗
      addDialog: false,
      addvalid: false,
      menu_adddate: false,
      add_volume: undefined,
      addparm: { started_date: undefined, name: undefined, num_per_unit: undefined , estimated_num: undefined },
      //蝦況
      imgvalid: false,
      imgdialog: false,
      imgfiles: [],
      menu_imgdate: false,
      imgdata: {
        imgdate: "",
        imgtime: "",
        item: [
          { name: "飼料殘餘量", value: undefined },
          { name: "健康狀況(活躍度)", value: undefined },
          { name: "腸線", value: undefined },
          { name: "均體長大小", value: undefined },
          { name: "肝胰腺顏色", value: undefined },
          { name: "增料比例", value: undefined },
          { name: "殼的狀態", value: undefined },
          { name: "均體重", value: undefined }
        ]
      },
      num_min: 0,
      num_max: 999,
      showimgurl: "",
      imgurlkey: 0 //強迫更新用
    };
  },
  methods: {
    cellClass: function(row) {
      if (row.columnIndex == 0) {
        return "disableSelection";
      }
    },
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background-color:#64B5F6;color:#fff;font-weight:500;";
      }
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    getNowTime: function() {
      let mytime = dayjs().format("HH:mm");
      return mytime;
    },
    delcircle: async function(data) {
      let id = data.id;
      await this.$axios
        .delete(`https://61.56.172.10/aquaculture-record/${id}`)
        .then(res => {
          console.log("API:" + res.request.responseURL);
          if (res.data == "刪除成功") {
            this.getCircleData();
            this.$toast.success("刪除成功", { duration: 2000 });
          } else {
            this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
          }
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
    },
    setNestedDisabled: function(obj, name) {
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
    mainchange: async function() {
      //取得循環資料
      await this.getCircleData();
    },
    getMainData: async function() {
      let reqid = this.req.id;
      let getedItem = {};
      //取得整廠架構資料
      await this.$axios.get("https://61.56.172.10/architecture/").then(res => {
        this.maindata = res.data;
        var data = this.setNestedDisabled(_.cloneDeep(this.maindata), "");
        this.maindata = data;
      });
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
    getCircleData: async function() {
      //取得循環資料-取得檢測數據、取得蝦況
      //歸零
      this.circleData = []; //循環
      this.detectData = []; //檢測
      this.shirimpData = []; //蝦況
      if (this.poolid == undefined) {
        return;
      }
      let parm = {
        pond_id: this.poolid,
        started_date: this.started_date,
        ended_date: this.ended_date
      };
      console.log(parm);
      var parm_url = Object.keys(parm)
        .map(key => key + "=" + parm[key])
        .join("&");
      await this.$axios
        .get(`https://61.56.172.10/aquaculture-record/?${parm_url}`)
        .then(res => {
          this.circleData = res.data;
          if (this.circleData.length > 0) {
            this.getDetectData();
            this.getshirimpData();
          }
        });
    },
    getDetectData: async function() {
      await this.$axios
        .get(`https://61.56.172.10/timely-data/?pond_id=${this.poolid}`)
        .then(res => {
          this.detectData = res.data;
        });
    },
    getshirimpData: async function() {
      //蝦況
      await this.$axios
        .get(
          `https://61.56.172.10/shrimp-status/?pond_id=${this.poolid}&is_last=true`
        )
        .then(res => {
          this.shirimpData = res.data;
        });
    },
    showadd: async function() {
      this.addparm.started_date = undefined;
      this.addparm.name = undefined;
      this.addparm.num_per_unit= undefined;
      this.addparm.estimated_num = undefined;
      if (this.poolid==undefined) {
        this.$toast.info(`失敗：請先選擇養殖池`, {
              duration: 2000
            });
        return;
      }
      //
      await this.$axios
        .get("https://61.56.172.10/ponds-data/")
        .then(res => {
          var items = res.data.filter(x => x.id == this.poolid);
          if (items.length == 1) {
            this.add_volume = items[0].volume;
            this.addDialog = true;
          } else {
              this.$toast.success(`失敗：無法取得體積資料，池id:${this.poolid}}`, {
              duration: 2000
            });
          }
        })
        .finally(() => {
          /* 不論失敗成功皆會執行 */
        });
    },
    submitadd: async function() {
      const updUser = this.$auth.$state.user.email;
      this.addparm.created_user = updUser;
      this.addparm.pond_id = this.poolid;
      let parm = this.addparm;
      console.log(parm);
      await this.$axios
        .post("https://61.56.172.10/aquaculture-record/", parm)
        .then(res => {
          console.log("API:" + res.request.responseURL);
          if (res.data == "新增成功") {
            this.getCircleData();
            this.addDialog = false;
            this.$toast.success("新增成功", { duration: 2000 });
          } else {
            this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
          }
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
    },
    showdialog_imgdialog: async function() {
      // this.imgdata.imgdate="";
      // this.imgdata.imgtime="";
      this.imgdata.item.forEach(item => {
        item.value = undefined;
      });
      // this.imgfiles = [];
      // this.showimgurl="";

      if (this.$refs.imgform != undefined) {
        this.$refs.imgform.reset();
      }
      this.imgdialog = true;
    },
    submit_imgdialog: async function() {
      // let parm = this.imgdata;
      let formData = new FormData();
      const updUser = this.$auth.$state.user.email;
      let additem = [];
      for (const key in Object.keys(this.imgdata.item)) {
        if (
          this.imgdata.item[key].hasOwnProperty("value") &&
          this.imgdata.item[key].value != undefined
        ) {
          additem.push(this.imgdata.item[key]);
        }
      }
      let param = {
        inspected_time: `${this.imgdata.imgdate} ${this.imgdata.imgtime}:00`,
        pond_id: this.poolid,
        created_user: updUser,
        item: additem
        // image:this.imgfiles
      };
      console.log(param);
      formData.append("param", JSON.stringify(param));
      // parm全部加入
      // for (const key in parm) {
      //   formData.append(key,parm[key]);
      // }
      if (!this.$refs.imgform.validate()) {
        return;
      }

      formData.append("image", this.imgfiles); //required

      let config = { headers: { "Content-Type": "multipart/form-data" } };
      await this.$axios
        .post("https://61.56.172.10/shrimp-status/", formData, config)
        .then(res => {
          console.log("API:" + res.request.responseURL);
          if (res.data == "新增成功") {
            this.getshirimpData(); //更新蝦況
            this.imgdialog = false;
            this.$toast.success("新增成功", { duration: 2000 });
          } else {
            this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
          }
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
    },
    chgimgurl: function() {
      this.imgurlkey += 1;
      this.showimgurl = "";
      this.showimgurl =
        this.imgfiles != null && this.imgfiles.length != 0
          ? URL.createObjectURL(this.imgfiles)
          : "";
    },
    handleSelectionChange: async function(selection, row) {
      //清除
      this.$refs.circletable.clearSelection();
      //選到當前
      if (selection.length != 0) {
        this.$refs.circletable.toggleRowSelection(row);
      }
    },
    handleCurrentChange: async function(val) {
      this.$refs.circletable.clearSelection();
      this.$refs.circletable.toggleRowSelection(val);
      if (val != null) {
        await this.getDetectData();
      }
      // this.currentRow = val;
    }
  },
  async mounted() {
    if (this.req.id == undefined) {
      //取得整廠架構資料
      await this.getMainData();
      return;
    }
    //取得整廠架構資料
    await this.getMainData();
    //取得循環資料
    await this.getCircleData();
  }
};
</script>

<style scoped>
.circle {
  border: 1px solid;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  position: relative;
}
.circletitle {
  position: relative;
  display: block;
  top: 50%;
  left: 50%;
  font-size: 1.2em;
  transform: translate(-50%, -50%);
}
</style>
<style>
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td {
  color: #000000;
  background-color: #fff09d !important;
}
</style>
