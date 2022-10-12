<template>
  <div>
    <!-- <h2 style="color: white">
      料表執行
    </h2> -->
    <v-row align="center" dense>
      <!-- 選擇廠 -->
      <v-col cols="12" sm="2">
        <v-autocomplete
          dark
          filled
          v-model="factoryid"
          :items="factoryData"
          item-text="name"
          item-value="id"
        ></v-autocomplete>
      </v-col>
      <!-- 選擇日期sdate -->
      <v-col cols="12" sm="3">
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
              dark
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              @change="getimptimedata"
              @click:clear="
                () => {
                  (totalData = {}), (imptimedata = []);
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
      <v-col cols="12" sm="3">
        <v-autocomplete
          v-model="stime"
          dark
          filled
          item-text="time"
          item-value="time"
          :loading="stime_loading"
          :items="imptimedata"
          placeholder="選擇資料時間"
          :no-data-text="`${stime_loading?'資料載入中':'查無資料'}`"
          @change="getfeedData"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="8"></v-col>
      <!-- 當日餐別明細 -->
      <v-col cols="12">
        <v-card min-width="300">
          <v-card-title>當日餐別明細</v-card-title>
          <v-card-text class="mt-3">
            <v-row>
              <v-col
                cols="12"
                v-for="item in comboTotal"
                :key="item.combo_name"
              >
              <span>
                <v-switch
                  v-model="combomark"
                  color="#FFD600"
                  @click="combomarkclick(item.combo_name)"
                  label="" dense hide-details inset
                  :value="item.combo_name"

                ></v-switch>
              </span>
                <span class="text-h6 font-weight-black"
                  >{{ item.combo_name }}：</span
                >
                <v-chip
                  class="ma-2"
                  color="brown lighten-1"
                  text-color="white"
                  label
                  v-for="chp in Object.keys(item.main_items)"
                  :key="chp"
                >
                  {{ `${chp}：${item.main_items[chp]} g` }}
                </v-chip>
                <v-chip
                  class="ma-2"
                  color="cyan"
                  text-color="white"
                  label
                  v-for="chp in Object.keys(item.sub_items)"
                  :key="chp"
                >
                  {{ `${chp}：${item.sub_items[chp]} g` }}
                </v-chip>
                <v-chip class="ma-2" color="red lighten-1" label outlined>
                  {{ `合計：${item.total} g` }}
                </v-chip>
                <v-divider></v-divider>
              </v-col>

              <v-col v-if="comboTotal.length == 0" class="text-center">
                <h2>查無資料</h2>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 料表 -->
      <v-col cols="12" class="mb-8">
        <el-card>
          <v-row>
            <!-- 獨立拉出資料 -->
            <v-col cols="12" sm="2" align-self="center" >
              <span>獨立顯示子成份項目</span>
            </v-col>
            <v-col cols="12" sm="5">
              <v-autocomplete
                v-model="showsub"
                multiple
                chips
                clearable
                no-data-text="無項目"
                :items="sub_allitems"
                filled
                placeholder="獨立顯示子成份項目"
              ></v-autocomplete>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2"
              >
              <v-btn icon @click="cellsize += 0.1"><v-icon>mdi-format-annotation-plus</v-icon></v-btn>
              <v-btn icon @click="cellsize -= 0.1"><v-icon>mdi-format-annotation-minus</v-icon></v-btn>
              <v-btn icon @click="cellsize = 1.2"><v-icon>mdi-format-color-text</v-icon></v-btn>
              <v-btn
                tile
                small
                class="success"
                @click="downloadcsv"
                :block="$vuetify.breakpoint.name == 'xs'"
                >下載檔案</v-btn
              ></v-col
            >
            <v-col cols="12" sm="2"
              ><v-btn
                :block="$vuetify.breakpoint.name == 'xs'"
                class="primary"
                tile
                small
                @click="execsubmit"
                :disabled="multipleSelection.length == 0"
                >執行</v-btn
              >
            </v-col>
          </v-row>
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
              width="100"
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
                    class="mx-2"
                    color="purple"
                    label
                    outlined
                    v-for="(sub, idx) in scope.row.sub_items.filter(x =>
                      showsub.includes(x.name)
                    )"
                    :key="idx"
                  >
                    <span :style="`font-size:${cellsize}em`">{{ `${sub.name.substr(0,1)}:${Math.round((sub.feed_amount + Number.EPSILON) * 1) / 1}` }}</span>
                  </v-chip>
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
              width="180"
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
            <el-table-column align="right" v-if="false">
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
          </el-table>
        </el-card>
      </v-col>
    </v-row>
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
      factoryData: [], //廠架構
      factoryid: "", //廠id
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
      cellsize:1.2,
      //餐別mark
      combomark:[],
      mutitablekey:false,
    };
  },
  methods: {
    combomarkclick:function(data){
      if(this.feedData2.length>0){
        this.feedData2.forEach(element=>{
          element.children.forEach (ele2 =>{
            ele2.combomark = this.combomark.includes(ele2.feed_combo_name);
          },this)
        },this
        );
      }
      this.mutitablekey = !this.mutitablekey;
    },
    isTagColor:function(row){
      if(row.row.combomark==true){
      return {
        backgroundColor: "#FFD600",
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
    //取得廠架構
    getarchitecture: async function() {
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`;
      await this.$axios
        .get(url)
        .then(res => {
          this.factoryData = res.data;
          this.factoryid = res.data[0].id;
          //   var item = [];
          //   res.data.forEach(element => {
          //     //#[{id:1,level:"1",name:一廠,node:[area_no: "tf",id: 1,level: "2",name: "天府",node: Array(36)]}]
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
          //           .map(x => (x.factory_id = factory_id)); //把廠id放入
          //         var getdata = ele.node.filter(x => x.visible == true);
          //         item.push(..._.cloneDeep(getdata));
          //       }
          //     }
          // });
          //   this.desserts = item;
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

      this.feedData = []; //清空表格資料
      this.stime = "";
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
          this.imptimedata = res.data;
          res.data.sort(function(a,b){
            var a1 = a.time.replace(":","");
            var b1 = b.time.replace(":","");
            if(a1 > b1){return 1};
            if(a1 < b1){return -1};
            return 0;
          });
          console.log("取得帶入的資料API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        })
        .finally(() => {
          this.stime_loading = false;//loading
        });
    },
    //取得料表
    getfeedData: async function() {
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
          this.$toast.success(`取得料表成功`, { duration: 2000 });
          console.log("取得料表API:" + res.request.responseURL);
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
      console.log(parm);
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-checklist-batch-update/`;
      await this.$axios
        .post(url, parm)
        .then(res => {
          if (res.data == "修改成功") {
            this.feedData = []; //清空表格資料
            this.stime = "";
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
        console.log(sub);
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
                Math.round((value + Number.EPSILON) * 1) / 1;
            });
          }
          const tot =
            Object.values(main_items).reduce((prev, curr) => prev + curr, 0) +
            Object.values(sub_items).reduce((prev, curr) => prev + curr, 0);
          tot = Math.round((tot + Number.EPSILON) * 1) / 1;
          combo_result.push({
            combo_name: combo_name,
            main_items: main_items,
            sub_items: sub_items,
            total: tot
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
    await this.getarchitecture(); //取得廠架構
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
  }
};
</script>

<style lang="sass" scoped>

</style>
