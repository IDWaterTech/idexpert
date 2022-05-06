<template>
  <div>
    <h2 style="color: white">飼料表作業</h2>
    <v-row align="center">
      <!-- 選擇廠 -->
      <v-col cols="12" md="3">
        <v-autocomplete
          dark
          filled
          v-model="factoryid"
          :items="factoryData"
          item-text="name"
          item-value="id"
        ></v-autocomplete>
      </v-col>

      <v-col cols="12" md="3">
        <v-btn class="primary mb-3" large @click="showimport"
          ><v-icon>mdi-database-import</v-icon>帶入料表資料</v-btn
        >
        <v-dialog v-model="importdialog" width="400">
          <v-card min-height="350">
            <v-card-title>帶入料表</v-card-title>
            <v-card-text>
              <v-row align-content="center">
                <!-- 選擇日期sdate -->
                <v-col cols="12" sm="8">
                  <v-menu
                    v-model="menu_date"
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
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                        @click:prepend="() => (sdate = getNowDate())"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="sdate"
                      @input="menu_sdate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="4" v-if="false">
                  <v-menu
                    v-model="menu_impdate"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="impdate"
                        label="選擇日期"
                        filled
                        dense
                        hide-details
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                        @click:prepend="() => (impdate = getNowDate())"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="impdate"
                      @input="menu_impdate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="3" align-self="center">
                  <v-btn
                    class="primary"
                    tile
                    title="取得料表清單"
                    @click="getimptimedata"
                    :disabled="!sdate"
                    ><v-icon>mdi-reload</v-icon>取得料表</v-btn
                  >
                </v-col>
                <v-col cols="12">
                  <v-list>
                    <v-list-item v-for="item in imptimedata" :key="item.time">
                      <v-list-item-content>{{ item.time }}</v-list-item-content>
                      <v-list-item-action
                        ><v-btn tile class="primary" @click="settabledata(item)"
                          >帶入此資料<v-icon>mdi-redo</v-icon></v-btn
                        ></v-list-item-action
                      >
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <!-- 表格 -->
    <v-data-table
      ref="feedtable"
      :headers="headers"
      :items="desserts.filter(x => x.factory_id == factoryid)"
      item-key="pond_id"
      sort-by="pond_name"
      group-by="area_name"
      class="elevation-1"
      :show-group-by="false"
      :footer-props="{
        'items-per-page-options': [-1, 25, 50, 100]
      }"
    >
      <!-- group -->
      <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
        <th :colspan="headers.length">
          <v-icon @click="toggle"
            >{{ isOpen ? "mdi-minus" : "mdi-plus" }}
          </v-icon>
          {{ items[0].area_name }}
        </th>
      </template>
      <!-- initial_val投餵量 -->
      <template v-slot:[`item.initial_val`]="{ item }">
        <v-row class="">
          <v-col cols="12" sm="12"
            ><v-text-field
              clearable
              dense
              filled
              hide-details
              placeholder="數值"
              v-model.number="item.initial_val"
              type="number"
              @input="setformula_val(item)"
              ><span slot="append">g</span>
            </v-text-field></v-col
          >
          <v-spacer></v-spacer>
        </v-row>
      </template>
      <!-- feed_combo_id 套餐id-->
      <template v-slot:[`item.feed_combo_id`]="{ item }">
        <v-row class="ma-1" dense>
          <v-col cols="12" sm="3"
            ><v-autocomplete
              v-model="item.feed_combo_id"
              :items="combo"
              dense
              hide-details
              filled
              clearable
              item-text="name_ch"
              item-value="id"
              label="選擇飼料(套餐)"
              @change="setformula_val(item)"
            ></v-autocomplete
          ></v-col>
          <!-- <div v-if="item.combo"> -->
          <!-- {{item}}
            <v-col v-for="mainitems in combo.filter(x=>x.id==item.combo)[0].main_items" :key="mainitems.id">
                {{mainitems.name}}
            </v-col>
          </div> -->
          <v-col
            v-for="mfla in item.main_items"
            :key="mfla.id"
            :style="Number(mfla.feed_amount) <= 0 ? 'color:red;' : ''"
            v-html="`${mfla.name}<br/>${mfla.feed_amount}g`"
            :title="`公式：${mfla.formula}`"
          >
          </v-col>
          <v-divider vertical></v-divider>
          <v-col
            v-for="fla in item.sub_items"
            :key="fla.id"
            :style="Number(fla.feed_amount) <= 0 ? 'color:red;' : ''"
            v-html="`${fla.name}<br/>${fla.feed_amount}g`"
            :title="`公式：${fla.formula}`"
          >
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </template>
      <!-- top -->
      <template v-slot:top>
        <v-toolbar elevation="1">
          <span v-if="imptimeidx">帶入的資料時間：{{ imptimeidx }}</span>
          <v-spacer></v-spacer>
          <v-btn color="primary" icon @click="dataclear"
            ><v-icon title="清除資料">mdi-shimmer</v-icon></v-btn
          >
          <v-btn color="primary" icon @click="showsubmitdig"
            ><v-icon title="操作">mdi-circle-edit-outline</v-icon></v-btn
          >
        </v-toolbar>
      </template>
    </v-data-table>
    <v-dialog v-model="submitdig" width="400">
      <v-card min-height="250">
        <v-card-title>操作</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row class="my-2" justify="center">
            <!-- 時間 -->
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
                @click:prepend="() => (atime = getNowTime())"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-btn
                class="error mb-3"
                tile
                :disabled="!atime"
                large
                @click="feedsubmit"
                >以此時間新增</v-btn
              >
            </v-col>
            <v-col cols="12" style="font-size:1.2em">
              <span
                >帶入資料時間：{{
                  !imptimeidx
                    ? "無"
                    : imptimedata.filter(x => x.time == imptimeidx)[0].time
                }}</span
              >
              <v-btn class="primary mb-3" tile large :disabled="!imptimeidx"
                >修改此帶入資料</v-btn
              >
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
  layout: "emptynologin",
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
          width: 200,
          sortable: false
        },
        // { text: "主成份", value: "feedmain", align: "center", width: 200 },
        {
          text: "成份",
          value: "feed_combo_id",
          align: "center",
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
      factoryData: [], //廠架構
      factoryid: "", //廠id
      combo: [],
      //---日曆
      menu_date: false,
      sdate: "",
      atime: "",
      //----帶入資料
      importdialog: false,
      menu_impdate: false,
      impdate: "",
      imptimedata: [], //取得帶入的資料
      //----
      submitdig: false,
      imptimeidx: ""
    };
  },
  methods: {
    //取得套餐清單(飼料設定)
    getcombodata: async function() {
      this.combo = [];
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/`;
      await this.$axios
        .get(url)
        .then(res => {
          this.combo = res.data;
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
          ele["feed_amount"] = val; //數值為feed_amount
          my_main_items.push(ele);
        });
        // 次成份
        var my_sub_items = [];
        subitem.forEach(element => {
          var val = this.formula_eval(initial_val, element.formula);
          var ele = Object.assign({}, element);
          ele["feed_amount"] = val; //數值為feed_amount
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
      var data = this.desserts.filter(
        x =>
          x.feed_combo_id > 0 &&
          x.initial_val > 0 &&
          x.factory_id == this.factoryid
      ); //抓有選飼料餐號、填投餵量
      console.log(data);
      debugger;
    },
    //取得廠架構
    getarchitecture: async function() {
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`;
      await this.$axios
        .get(url)
        .then(res => {
          this.factoryData = res.data;
          this.factoryid = res.data[0].id;
          var item = [];
          res.data.forEach(element => {
            //[{id:1,level:"1",name:一廠,node:[area_no: "tf",id: 1,level: "2",name: "天府",node: Array(36)]}]
            if (element.hasOwnProperty("node")) {
              const factory_id = element.id;
              for (let i = 0; i < element.node.length; i++) {
                const ele = element.node[i];
                // ele.node
                //   .filter(x => x.visible == true)
                //   .map(x => (x.area_name = ele.name)); //把天府名稱放入area_name,把池名稱放入pond_name
                ele.node
                  .filter(x => x.visible == true)
                  .map(x => {
                    (x.area_name = ele.name), (x.pond_name = x.name), (x.pond_id = x.id);
                  }); //把天府名稱放入area_name,把池名稱放入pond_name,池id放入pond_id
                ele.node
                  .filter(x => x.visible == true)
                  .map(x => (x.factory_id = factory_id)); //把廠id放入
                var getdata = ele.node.filter(x => x.visible == true);
                item.push(..._.cloneDeep(getdata));

                // if(ele.hasOwnProperty("node")){
                //   debugger;
                //   item.push(..._.cloneDeep(getdata));
                // }
              }
              // element.node.forEach(ele => {
              //   if(ele.hasOwnProperty("node")){
              //     ele.node.filter(x=>x.visible==true).map(x=>x.area=ele.name);//.map(x=>x.factory=element.name);
              //     debugger;
              //     var getdata = ele.node.filter(x=>x.visible==true);
              //     item.push(..._.cloneDeep(getdata));
              //   }
              // });
            }
          });
          this.desserts = item;
          console.log("取得廠架構API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error(`取得廠架構失敗:${error}`, {
            duration: 2000
          });
        })
        .finally(() => {
          //this.getdata();
        });
    },
    //取得帶入的資料
    getimptimedata: async function() {
      this.imptimedata = [
        {
          id: 1, //資料id
          time: "01:00",
          data: [
            {
              id: 115, //池id
              area_name: "武曲",
              pond_name: "A1",
              factory_id: 1, //廠id
              level: "1", //不需要
              visible: true,
              initial_val: 111, //投餵量
              feed_combo_id: 3, //套餐id
              main_items: [
                //主成份
                {
                  id: 1, //要紀錄的主成份id
                  name: "蝦料1",
                  item_no: "10001",
                  formula: "*0.7",
                  remark: "",
                  val: "77.70" //要紀錄的主成份值
                },
                {
                  id: 2,
                  name: "蝦料2",
                  item_no: "10002",
                  formula: "*0.3",
                  remark: "",
                  val: "33.30"
                }
              ],
              sub_items: [
                //次成份
                {
                  id: 8,
                  name: "水1",
                  item_no: "10025",
                  formula: "*1.2",
                  remark: "",
                  val: "133.20"
                },
                {
                  id: 6,
                  name: "糖1",
                  item_no: "10005",
                  formula: "*0.8",
                  remark: "",
                  val: "88.80"
                }
              ]
            },
            {
              id: 115,
              area_name: "test",
              pond_name: "A1",
              level: "3",
              visible: true,
              factory_id: 30
            }
          ]
        },
        {
          id: 2,
          time: "15:00",
          data: [
            {
              id: 115,
              name: "A1",
              level: "3",
              visible: true,
              area: "test",
              factory_id: 30
            }
          ]
        }
      ];
      var para = {
        feed_date: this.sdate
      };
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-record/`, {
          params: para
        })
        .then(res => {
          this.imptimedata = res.data;
          console.log("取得帶入的資料API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        })
        .finally(() => {});
    },
    //設定帶入資料
    settabledata: async function(item) {
      var data = item.data;
      this.imptimeidx = item.time; //time即index
      this.factoryid = data[0].factory_id; //第1筆資料即為首選廠
      var desserts = this.desserts;
      // console.log(this.desserts.length,desserts.length);
      for (let idx = 0; idx < data.length; idx++) {
        // console.log(this.desserts.length,desserts.length);
        //資料塞進去
        const pond_id = data[idx].pond_id;
        
        var dessitem = desserts.filter(x => x.pond_id == pond_id);
        if (dessitem.length == 0) {
          //沒有這id，塞進去
          desserts.push(data[idx]);
          // console.log("add:",id,data[idx].area_name,data[idx].pond_name);
        } else {
          console.log(desserts.length);
          // 有這id，蓋上去
          console.log("covered:",pond_id,data[idx].area_name,data[idx].pond_name,data[idx]);
          var deleteidx = desserts.indexOf(dessitem[0]);
          desserts.splice(deleteidx,1);
          desserts.push(data[idx]);
          // desserts.filter(x => x.id == id)[0] = _.cloneDeep(data[idx]);
        }
      }

      var setdata = new Set(data.map(x=>x.factory_id));
      var listdata  =[...setdata];
      var tostmsg = [];
      listdata.forEach(factory => {
        var facname = this.factoryData.filter(x=>x.id==factory)[0].name;
        var cnt = data.filter(x=>x.factory_id==factory).length;
        tostmsg.push(`${facname}帶入${cnt}筆資料`);
      });
      console.log(tostmsg);
      this.$toast.success(`${tostmsg.join('<br/>')}`, { duration: 2000 });
      // this.$toast.success(`帶入${data.length}筆資料`, { duration: 2000 });
       this.desserts = desserts;
    },
    //顯示送出視窗
    showsubmitdig: function() {
      this.submitdig = true;
    },
    dataclear: async function() {
      this.imptimeidx = null;
      await this.getarchitecture(); //取得廠架構
    }
  },

  async mounted() {
    await this.getcombodata(); //取得套餐清單(飼料設定)
    await this.getarchitecture(); //取得廠架構
    //表格group預設是false
    let table = this.$refs.feedtable;
    let keys = Object.keys(table.$vnode.componentInstance.openCache);
    keys.forEach(x => {
      table.$vnode.componentInstance.openCache[x] = false;
    });
  }
};
</script>

<style scoped></style>
