<template>
  <div>
    <v-row>
      <v-col cols="12" md="2">
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
      </v-col>
      <v-col cols="12" md="2">
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
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="sel_main"
          :items="maindata"
          item-value="id"
          item-text="name"
          label="選擇廠(必選)"
          clearable
          background-color="light-green lighten-4"
        >
        </v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="sel_area"
          :items="areadata"
          item-value="id"
          item-text="name"
          clearable
          @change="areachange"
          label="選擇區域(必選)"
          background-color="light-green lighten-4"
        ></v-select>
      </v-col>
      <v-col cols="12" md="1">
        <v-autocomplete
          v-model="sel_pool"
          :items="this.mainpool.items"
          item-text="name"
          item-value="id"
          no-data-text="查無資料"
          placeholder="水池"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="2">
        <v-autocomplete
          v-model="defitem"
          :items="Object.keys(waterdatacols)"
          no-data-text="查無資料"
          placeholder="指定項目(必選)"
          background-color="light-green lighten-4"
          clearable
        ></v-autocomplete>
        <!-- <v-select
          v-model="defitem"
          clearable
          placeholder="指定項目(必選)"
          :items="Object.keys(waterdatacols)"
          v-if="waterdatacols"
          no-data-text="查無資料"
          background-color="light-green lighten-4"
        >
        </v-select> -->
      </v-col>
      <v-col cols="12" md="1">
        <v-btn
          block
          color="primary"
          @click="getdata"
          :disabled="
            sdate &&
            edate &&
            sel_pool &&
            sel_area &&
            sel_main &&
            defitem != undefined &&
            defitem.length > 0
              ? false
              : true
          "
          >查詢</v-btn
        >
      </v-col>
      <v-col cols="12" md="12">
        <v-btn
          icon
          color="success"
          @click="openadd"
          :disabled="
            sel_main && sel_area && defitem != undefined && defitem.length > 0
              ? false
              : true
          "
          height=""
          ><v-icon>mdi-text-box-plus-outline</v-icon></v-btn
        >
        <v-dialog
          v-model="addDialog"
          max-width="500px"
          :persistent="keepswitch"
        >
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card v-if="addDialog"
              ><v-card-title>新增</v-card-title>
              <v-card-subtitle class="title"
                >{{ maindata[sel_main - 1].name }}-{{
                  maindata[sel_main - 1].node[sel_area - 1].name
                }}-<span class="font-weight-black" style="color:red;">{{
                  defitem
                }}</span
                ><v-switch
                  v-model="keepswitch"
                  color="red darken-3"
                  :label="
                    keepswitch ? '保留數值不關閉：on' : '保留數值不關閉：off'
                  "
                ></v-switch
              ></v-card-subtitle>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="menu_adate"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="adate"
                          label="選擇日期"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="rules.require"
                          @click:prepend="() => (adate = getNowDate())"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="adate"
                        @input="menu_adate = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="時間"
                      v-model="atime"
                      value=""
                      type="time"
                      prepend-icon="mdi-timeline-clock-outline"
                      @click:prepend="() => (atime = getNowTime())"
                      :rules="rules.require"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    v-for="item in mainpool.items"
                    :key="item.id"
                    >
                    <!-- <v-text-field
                      class="addinput"
                      type="number"
                      :id="item.name"
                      @keyup.enter="gofocusNxt(item.name)"
                      @change="getAddData"
                      @keyup="getAddData"
                      ><p slot="prepend">{{ item.name }}</p></v-text-field
                    > -->
                    {{item.name}}<el-input-number
                      :id="item.name"
                      :ref="item.name"
                      @keyup.enter.native="gofocusNxt2(item.name)"
                      class="ml-2"
                      v-model="num[item.name]"
                      size="mini"
                      :precision="2"
                      :step="0.1"
                      :min="num_min"
                      :max="num_max"
                    ></el-input-number>
                  </v-col>
                  <!-- @keyup="getAddData" -->
                </v-row>
              </v-card-text>
            
              <v-card-text>
                <v-chip
                  class="ma-2"
                  color="indigo darken-3"
                  outlined
                  v-for="item in addData"
                  :key="item.name"
                >
                  <v-icon left>
                    mdi-new-box
                  </v-icon>
                  {{ item.name }} [{{ item.value }}]
                </v-chip>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-text>
                <v-chip
                  class="ma-2"
                  color="indigo darken-3"
                  outlined
                  v-for="(key, index) in Object.keys(num)"
                  :key="index"
                  v-show="typeof num[key] == 'number'"
                >
                  <div v-if="typeof num[key] == 'number'">
                    <v-icon left>
                      mdi-new-box
                    </v-icon>
                    {{ key }} [{{ num[key] }}]
                  </div>
                </v-chip>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click="addDialog = false"
                  color="blue darken-1"
                  text
                  v-show="keepswitch"
                  >取消</v-btn
                >
                <v-btn
                  @click="addsubmit"
                  color="blue darken-1"
                  text
                  :disabled="!atime"
                  >確定</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <v-btn
          icon
          color="success"
          :disabled="item.items == undefined || item.items.length == 0"
        >
          <div
            v-if="
              sel_pool &&
                sel_area &&
                sel_pool &&
                mainpool.items.filter(x => x.id == sel_pool)[0]
            "
          >
            <!-- ${mainpool.items[sel_pool].name}_ -->
            <!-- 有水池才有功能，沒有的話就圖而已 -->
            <download-excel
              :data="item.items"
              :name="
                `${sdate}_${edate}_${maindata[sel_main - 1].name}_${
                  maindata[sel_main - 1].node[sel_area - 1].name
                }_${
                  mainpool.items.filter(x => x.id == sel_pool)[0].name
                }_${defitem}`
              "
            >
              <v-icon>mdi-export-variant</v-icon>
            </download-excel>
          </div>
          <div v-else>
            <v-icon>mdi-export-variant</v-icon>
          </div>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="item.items"
          :footer-props="footerProps"
          class="elevation-1"
          v-if="headers.length > 0 || loading == true"
          :loading="loading"
          no-data-text="查無資料"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="delItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:top>
            <v-dialog v-model="editDialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">編輯項目</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-text-field
                          v-model="editedItem.id"
                          label="ID"
                          disabled
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.inspected_date"
                          label="日期"
                          disabled
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.value"
                          label="值"
                          autocomplate="off"
                          type="number"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="editDialog = false">
                    取消
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="editsubmit">
                    確定
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="delDialog" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"> 是否刪除該項目?</v-card-title>
                <v-card-text class="text-h5">
                  id:{{ editedItem.id }}<br />
                  時間：{{ editedItem.inspected_date }}<br />
                  值：{{ editedItem.value }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="delDialog = false"
                    >取消</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="delsubmit"
                    >確定刪除！</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import dayjs from "dayjs";
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false
});
// import WaterQuality_Vcharts from "@/components/sheet/waterQuality_vcharts";
// import { number } from "~/node_modules/echarts/lib/export";
import "element-ui/lib/theme-chalk/index.css";
export default {
  layout: "emptynologin",
  middleware: "auth",
  // components: {
  //   WaterQuality_Vcharts
  // },
  data() {
    return {
      req: this.$route.query,
      maindata: [],
      sel_main: 0,
      sel_area: "",
      sel_pool: "",
      pooldata: [],
      mainpool: {
        id: 1,
        name: "A1",
        items: [
          // { name: "體積", item: "volume", value: 140.0, unit: "噸" },
        ]
      },
      headers: [
        //   { text: "inspected_date", value: "inspected_date", groupable: false },
      ],
      loading: false,
      footerProps: {
        "items-per-page-text": "每頁",
        "items-per-page-options": [25, 50, 75, 100]
      },
      defitem: [],
      waterdatacols: {},
      allcols: {},
      waterloading: false, //折線圖，
      item: [{ name: "", items: [] }],
      //---日曆
      menu_startdate: false,
      menu_enddate: false,
      menu_adate: false,
      //新增
      sdate: "",
      edate: "",
      adate: "",
      atime: "",
      keepswitch: false, //保留數值不關閉
      //編輯視窗
      editDialog: false,
      editedItem: {}, //已編輯項目暫存這邊
      //刪除視窗
      delDialog: false,
      //新增視窗
      addDialog: false,
      addData: [],
      num: {},
      num_min: 0,
      num_max: 999,
      //form
      valid: true,
      rules: { require: [v => !!v || "*必要項目"] }
    };
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    //抓廠資料
    await this.$axios
      .get("https://61.56.172.10/architecture/", { httpsAgent: agent })
      .then(res => {
        console.log("廠");
        this.maindata = res.data;
        this.sdate = String(this.req.sdate).length > 0 ? this.req.sdate : "";
        this.sel_main =
          Number(this.req.sel_main) > 0 ? Number(this.req.sel_main) : 0;
        this.sel_area =
          Number(this.req.sel_area) > 0 ? Number(this.req.sel_area) : 0;
        this.sel_pool =
          Number(this.req.sel_pool) > 0 ? Number(this.req.sel_pool) : 0;
        if (Number(this.req.sel_pool) > 0) {
          //await this.areachange();
          this.areachange();
          this.sel_pool = Number(this.req.sel_pool);
        }
        this.defitem =
          this.req.defitem != undefined && this.req.defitem.length > 0
            ? this.req.defitem
            : [];
      })
      .catch(err => {
        alert("失敗：" + err.message);
      });
    //抓all項目
    await this.$axios
      .get("https://61.56.172.10/all-col-name/", {
        httpsAgent: agent
      })
      .then(res => {
        console.log("all項目");
        for (let i = 0; i < Object.keys(res.data).length; i++) {
          let colsclass = Object.keys(res.data)[i]; //water;
          Object.assign(this.waterdatacols, res.data[colsclass]);
        }
        this.allcols = Object.assign({}, res.data);
      })
      .catch(err => {
        alert("失敗：" + err.message);
      });
  },
  computed: {
    areadata: function() {
      let filtermain = [];
      filtermain = this.maindata;
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
    }
  },
  methods: {
    areachange: async function() {
      var para = {
        id: this.sel_area
      };
      this.sel_pool = ""; //重選區域重置水池
      if (this.sel_area) {
        //水池基本資料
        await this.$axios
          .get(
            "https://61.56.172.10/ponds-data/",
            {
              params: para
            },
            {
              httpsAgent: agent
            }
          )
          .then(res => {
            this.mainpool.items = res.data;
          })
          .catch(err => {
            alert("失敗：" + err.message);
          })
          .finally(() => {
            /* 不論失敗成功皆會執行 */
          });
      } else {
        this.mainpool.items = [];
      }
    },
    getItemClass: function(item) {
      let colclass = "";
      for (let i = 0; i < Object.keys(this.allcols).length; i++) {
        let inclass = Object.keys(this.allcols)[i]; //water;
        let checkclass = Object.keys(this.allcols[inclass]).includes(item);
        if (checkclass == true) {
          colclass = inclass;
          return colclass;
        }
      }
    },
    getdata: async function() {
      console.log(
        "api 參數",
        this.sdate,
        this.edate,
        this.sel_pool,
        this.sel_area,
        this.sel_main,
        this.defitem
      );
      this.loading = true;
      //指定的項目是歸屬於哪個類別，水質/投餵
      var defitem_tmp = this.defitem; //判斷項目是屬於水質還是投餵用
      let itemclass = ``;
      let mycols = this.allcols;

      for (const idx in Object.keys(mycols)) {
        var tmp = Object.keys(mycols[Object.keys(mycols)[idx]]).find(
          keys => keys == defitem_tmp
        );
        if (tmp !== undefined && tmp == defitem_tmp) {
          itemclass = Object.keys(mycols)[idx];
        }
      }

      //抓折線圖資料囉
      let para = {
        started_date: this.sdate,
        ended_date: this.edate,
        factory_id: this.sel_main,
        pond_area_id: this.sel_area,
        pond_id: this.sel_pool,
        items: this.defitem,
        data_group: itemclass
      };
      let apiurl = `https://61.56.172.10/all-data/`;
      //歸零
      this.item = "";
      this.headers = [];
      //抓資料
      await this.$axios
        .get(apiurl, { params: para }, { httpsAgent: agent })
        .then(res => {
          this.item = res.data;
          if (res.data.items.length > 0) {
            let cols = Object.keys(res.data.items[0]);
            for (const key in cols) {
              this.headers.push({
                text: cols[key],
                value: cols[key],
                align: "center",
                groupable: false
              });
            }
          }

          this.headers.push({
            text: "動作",
            value: "actions",
            sortable: false
          });
          console.log("API:" + res.request.responseURL);
        })
        .catch(err => {
          alert("查詢失敗：" + err.message);
        });
      this.loading = false;
    },
    editItem: async function(item) {
      //編輯中的物件item
      this.editedItem.inspected_date = item.inspected_date;
      this.editedItem.id = item.id;
      this.editedItem.value = item[Object.keys(item)[3]];
      this.editedItem.class = this.getItemClass(Object.keys(item)[3]); //water,adv...
      this.editDialog = true;
    },
    delItem: async function(item) {
      //編輯中的物件item
      this.editedItem.id = item.id;
      this.editedItem.inspected_date = item.inspected_date;
      this.editedItem.value = item[Object.keys(item)[3]];
      this.editedItem.class = this.getItemClass(Object.keys(item)[3]); //water,adv...
      this.delDialog = true;
    },
    addItem: async function() {},
    gofocusNxt2:function(id){
      var findeditem = this.mainpool.items.find(x => x.name == id);
      var idxitem = this.mainpool.items.indexOf(findeditem);
      if (idxitem + 1 == this.mainpool.items.length) {
        this.$refs[id][0].focus();//最後一項，鎖定原位
      }else{
        let nxtName = this.mainpool.items[idxitem + 1].name;
        this.$refs[nxtName][0].focus();//最後一項，鎖定原位
      }
      // this.$refs['A2'].$el.children[0].focus();
    },
    // gofocusNxt_OLD: async function(id) {
    //   //document.getElementById(id).focus();
    //   var findeditem = this.mainpool.items.find(x => x.name == id);
    //   var idxitem = this.mainpool.items.indexOf(findeditem);
    //   if (idxitem + 1 == this.mainpool.items.length) {
    //     //最後一項，鎖定原位
    //     document.getElementById(id).focus();
    //   } else {
    //     //鎖定下一項
    //     let nxtItem = this.mainpool.items[idxitem + 1];
    //     document.getElementById(nxtItem.name).focus();
    //   }
    // },
    // getAddData: function() {
    //   let adddatatmp = [];
    //   for (const key in this.mainpool.items) {
    //     let item = this.mainpool.items[key];
    //     let myValue = document.getElementById(item.name).value.trim();
    //     if (myValue.length > 0) {
    //       adddatatmp.push({ name: item.name, value: myValue, id: item.id });
    //     }
    //   }
    //   this.addData = adddatatmp;
    // },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    getNowTime: function() {
      let mytime = dayjs().format("HH:mm");
      return mytime;
    },
    openadd: async function() {
      this.keepswitch = false;
      this.adate = "";
      this.addData = [];
      this.atime = "";
      //this.getItemClass(this.defitem);
      let coldata = [];
      //抓項目的限制
      await this.$axios.get("https://61.56.172.10/col-data/").then(res => {
        coldata = Object.assign([], res.data);
      });
      var colitem = coldata.filter(
        x =>
          x.group == this.getItemClass(this.defitem) &&
          x.name_ch == this.defitem
      );
      if (colitem.length == 1) {
        this.num = {};//清空
        this.num_min = (colitem[0].min!=undefined || typeof(colitem[0].min)=='number')?colitem[0].min:0;
        this.num_max = (colitem[0].max!=undefined || typeof(colitem[0].max)=='number')?colitem[0].max:999;
        this.addDialog = true;
      } else {
        this.$toast.error(`查無項目min、max資料`, { duration: 2000 });
      }
    },
    addsetnow: function() {
      this.sdate = getNowDate();
    },
    addsubmit: async function() {
      let valid = this.$refs.form.validate();

      if (valid) {
        let colclass = this.getItemClass(this.defitem);
        let apiurl = "https://61.56.172.10/all-data/";

        let url = apiurl;
        const updUser = this.$auth.$state.user.email;
        let parms = {
          items: this.defitem, //亞硝酸鹽濃度
          inspected_time: `${this.adate} ${this.atime}:00`, //無秒數，直接補0
          data: [],
          created_user: updUser, //建立者名稱
          data_group: colclass //water,adv,...
        };
         let submitData = [];
        //原本抓textfield的方式
        // this.addData.forEach(el => {
        //   submitData.push({ id: el.id, val: el.value });
        // });
        //送出資料重判斷########################
        //foreach Object.keys(this.num)
        for (const key in Object.keys(this.num)) {
            const element = Object.keys(this.num)[key];
            if (this.num[element]!= undefined) {
              const el_id = this.mainpool.items.filter(x=>x.name==element)[0].id;
              submitData.push({ id: el_id, val: this.num[element] });
            }
        }
        if (submitData.length <= 0) {
          this.$toast.success(`無新增資料`, { duration: 2000 });
          return;
        }
        parms.data = submitData;
        console.log("adddata aparms", parms);
        await this.$axios
          .post(url, parms, { httpsAgent: agent })
          .then(res => {
            if (res.data == "新增成功") {
              //this.getdata();新增未必有選到所有選項
              this.atime = "";
              if (this.keepswitch == false) {
                this.addDialog = false; //close dialog
              }
              this.$toast.success(`新增成功`, { duration: 2000 });
            } else {
              alert("新增失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("新增失敗!：" + error.message);
          })
          .finally(() => {
            //this.getdata();
          });
      }
    },
    editsubmit: async function() {
      if (confirm("確定修改？") == true) {
        // await this.$axios.get("https://61.56.172.10/architecture/").then(res => {});
        let url = `https://61.56.172.10/all-data/${this.editedItem.id}/`;
        const updUser = this.$auth.$state.user.email;
        let data = {
          val: this.editedItem.value,
          updated_user: updUser,
          data_group: this.editedItem.class
        };
        console.log("edit data:", data);
        await this.$axios
          .patch(url, data, { httpsAgent: agent })
          .then(res => {
            if (res.data == "修改成功") {
              this.getdata();
              this.editDialog = false; //close dialog
              this.$toast.success(`修改成功`, { duration: 2000 });
            } else {
              alert("修改失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("修改失敗!：" + error.message);
          })
          .finally(() => {});
      } else {
      }
    },
    delsubmit: async function() {
      let url = `https://61.56.172.10/all-data/${this.editedItem.id}/`;
      let deldata = { data_group: this.editedItem.class };
      console.log("DEL data:", deldata);
      console.log("DEL:" + url);
      await this.$axios
        .delete(url, { data: deldata }, { httpsAgent: agent })
        .then(res => {
          if (res.data == "刪除成功") {
            this.getdata();
            this.delDialog = false; //close dialog
            this.$toast.success(`刪除成功`, { duration: 2000 });
          } else {
            alert("刪除失敗!：" + res.data);
          }
        })
        .catch(error => {
          alert("刪除失敗!：" + error.message);
        });
    }
  }
};
</script>

<style scoped></style>
