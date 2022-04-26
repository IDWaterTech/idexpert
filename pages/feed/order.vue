<template>
  <div>
    <h2 style="color:white;">飼料表作業</h2>
    <v-row align="center">
      <!-- 選擇廠 -->
      <v-col cols="12" md="3">
        <v-autocomplete dark filled v-model="factoryid" :items="factoryData" item-text="name" item-value="id"></v-autocomplete>
      </v-col>
      <!-- 選擇起日 -->
      <v-col cols="12" md="3">
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
              dark
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
      <v-col cols="12" md="3">
        <v-text-field
          label="時間"
          v-model="atime"
          value=""
          style="font-color:white;"
          dense
          filled
          dark
          clearable
          type="time"
          prepend-icon="mdi-timeline-clock-outline"
          @click:prepend="() => (atime = getNowTime())"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn class="primary mb-3" large @click="feedsubmit">新增</v-btn>
        <v-btn class="primary mb-3" large @click="showimport"
          ><v-icon>mdi-database-import</v-icon>帶入料表資料</v-btn
        >
        <v-dialog v-model="importdialog" width="300">
          <v-card>
            <v-card-title>帶入料表</v-card-title>
            <v-card-text>
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
              <v-list>
                <v-list-item v-for='item in [{"id":1,"date":"0101"},{"id":2,"date":"0102"}]' :key="item.id">
                  <v-list-item-content>{{item.date}}</v-list-item-content>
                  <v-list-item-action><v-btn tile class="primary">帶入此資料<v-icon>mdi-redo</v-icon></v-btn></v-list-item-action>
                </v-list-item>
              </v-list>
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
      :items="desserts.filter(x=>x.factory_id==factoryid)"
      item-key="id"
      sort-by="name"
      group-by="area"
      class="elevation-1"
      :show-group-by="false"
      :footer-props="{
        'items-per-page-options': [-1,25, 50, 100]
      }"
    >
      <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
        <th :colspan="headers.length">
          <v-icon @click="toggle"
            >{{ isOpen ? "mdi-minus" : "mdi-plus" }}
          </v-icon>
          {{ items[0].area }}
        </th>
      </template>
      <!-- feed_amount -->
      <template v-slot:[`item.feed_amount`]="{ item }">
        <v-row class="">
          <v-col cols="12" sm="12"
            ><v-text-field
              clearable
              dense
              filled
              hide-details
              placeholder="數值"
              v-model.number="item.feed_amount"
              type="number"
              @input="setformula_val(item)"
              ><span slot="append">g</span>
            </v-text-field></v-col
          >
          <v-spacer></v-spacer>
        </v-row>
      </template>
      <!-- combo -->
      <template v-slot:[`item.combo`]="{ item }">
        <v-row class="ma-1" dense>
          <v-col cols="12" sm="3"
            ><v-autocomplete
              v-model="item.combo"
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
            v-for="mfla in item.main_formula"
            :key="mfla.id"
            :style="Number(mfla.val) <= 0 ? 'color:red;' : ''"
            v-html="`${mfla.name}<br/>${mfla.val}g`"
            :title="`公式：${mfla.formula}`"
          >
          </v-col>
          <v-divider vertical></v-divider>
          <v-col
            v-for="fla in item.sub_formula"
            :key="fla.id"
            :style="Number(fla.val) <= 0 ? 'color:red;' : ''"
            v-html="`${fla.name}<br/>${fla.val}g`"
            :title="`公式：${fla.formula}`"
          >
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </template>

      <!-- action -->
      <!-- <template v-slot:[`item.actions`]="{ item }">
        <span v-show="false">{{ item }}</span>
        <v-icon small class="mr-2">
          mdi-pencil
        </v-icon>
        <v-icon small>
          mdi-delete
        </v-icon>
      </template> -->
    </v-data-table>
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
        { text: "區域", value: "area", align: "right", sortable: false },
        {
          text: "養殖池",
          align: "start",
          value: "name",
          width: 100,
          sortable: false
        },
        {
          text: "投餵量",
          value: "feed_amount",
          align: "center",
          width: 200,
          sortable: false
        },
        // { text: "主成份", value: "feedmain", align: "center", width: 200 },
        { text: "成份", value: "combo", align: "center", sortable: false }
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
      factoryData:[],//廠架構
      factoryid:"",//廠id
      combo: [],
      //---日曆
      menu_date: false,
      sdate: "",
      atime: "",
      //----帶入資料
      importdialog: false,
      menu_impdate:false,
      impdate:"",
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
      
      var feed_amount = item.feed_amount;
      if (this.combo.filter(x => x.id == item.combo).length > 0) {
        //選到餐點
        var subitem = this.combo.filter(x => x.id == item.combo)[0].sub_items;
        var main_items = this.combo.filter(x => x.id == item.combo)[0]
          .main_items;
        //主成份
        var main_formula = [];
        main_items.forEach(element => {
          var val = this.formula_eval(feed_amount, element.formula);
          var ele = Object.assign({}, element);
          ele["val"] = val;
          main_formula.push(ele);
        });
        // 次成份
        var sub_formula = [];
        subitem.forEach(element => {
          var val = this.formula_eval(feed_amount, element.formula);
          var ele = Object.assign({}, element);
          ele["val"] = val;
          sub_formula.push(ele);
        });
      } else {
        // debugger;
      }
      item.main_formula = main_formula;
      item.sub_formula = sub_formula;
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
    feedsubmit:async function(){
      var data = this.desserts.filter(x=>x.combo>0 && x.feed_amount>0);//抓有選飼料餐號、填投餵量
      console.log(data);
      debugger;
    },
    //取得廠架構
    getarchitecture:async function(){
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`;
      await this.$axios
        .get(url)
        .then(res => {
          this.factoryData = res.data;
          this.factoryid = res.data[0].id;
          var item=[];
          res.data.forEach(element => { //[{id:1,level:"1",name:一廠,node:[area_no: "tf",id: 1,level: "2",name: "天府",node: Array(36)]}]
            if(element.hasOwnProperty("node")){
               const factory_id = element.id;
              for (let i = 0; i < element.node.length; i++) {
                const ele = element.node[i];
                ele.node.filter(x=>x.visible==true).map(x=>x.area=ele.name);//把天府名稱放入
                ele.node.filter(x=>x.visible==true).map(x=>x.factory_id=factory_id);//把廠id放入
                var getdata = ele.node.filter(x=>x.visible==true);
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
