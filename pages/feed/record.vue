<template>
  <div>
    <h2 style="color: white">
      料表執行
      <!-- <v-btn class="mx-2 my-1" to="/feed/setting">料表設定</v-btn>
      <v-btn class="mx-2 my-1" to="/feed/order">料量設定</v-btn> -->
    </h2>
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
              clearable
              @click:prepend="() => ((sdate = getNowDate()), getimptimedata())"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="sdate"
            @change="getimptimedata"
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
          :items="imptimedata"
          placeholder="選擇資料時間"
          no-data-text="查無資料"
          @change="getfeedData"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="8"></v-col>
      <!-- 餐別明細 -->
      <v-col cols="12">
        <v-card min-width="300">
          <v-card-title>餐別明細</v-card-title>
          <v-card-text class="mt-3">
            <v-row>
              <v-col
                cols="12"
                v-for="item in comboTotal"
                :key="item.combo_name"
              >
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
            <v-spacer></v-spacer>
            <v-col cols="2"
              ><v-btn
                class="primary"
                @click="execsubmit"
                :disabled="multipleSelection.length == 0"
                >執行</v-btn
              ></v-col
            >
          </v-row>
          <el-table
            ref="mutitable"
            :data="feedData2"
            row-key="id"
            default-expand-all
            @selection-change="handleSelectionChange"
            @select-all="selectall"
          >
          <!-- 減少一欄佔空間所以用area_name2解決 -->
            <el-table-column
              prop="area_name2"
              label="區域"
              sortable fixed="left"
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
            <el-table-column
              prop="feed_total"
              label="總量"
              sortable
              width="100"
            />
            <el-table-column
              prop="observation_total"
              label="觀察網總量"
              sortable
              width="100"
            />
            <el-table-column
              prop="feed_combo_name"
              label="餐別"
              sortable
              width="150"
            />
            <el-table-column
              prop="executed_user"
              label="執行人員"
              sortable
              width="180"
            />
            <el-table-column
              align="center"
              type="selection"
              :selectable="checkSelectable"
              width="55"
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
import dayjs from "dayjs";
export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
    return {
      factoryData: [], //廠架構
      factoryid: "", //廠id
      //---日曆
      menu_sdate: false,
      sdate: "",
      stime: "",
      //--帶入資料
      imptimedata: [],
      //料表資料
      feedData: [],
      //tablesetting
      multipleSelection: [],
      checkedkeys: false
    };
  },
  methods: {
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

      if (!this.sdate) {
        this.imptimedata = [];
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
          console.log("取得帶入的資料API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        })
        .finally(() => {});
    },
    //取得料表
    getfeedData: async function() {
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
      //   {
      //     id: 3,
      //     time: "01:00",
      //     area_name: "紫薇",
      //     pond_name: "A1",
      //     pond_id: 3,
      //     feed_combo_id: 1,
      //     feed_combo_name: "1號餐",
      //     feed_total: 1200,
      //     ovserve_total: 36,
      //     is_executed: true,
      //     main_items: [
      //       { main_id: 1, main_name: "蝦料1", feed_amount: 100 },
      //       { main_id: 2, main_name: "蝦料2", feed_amount: 110 }
      //     ],
      //     sub_items: [
      //       { sub_id: 1, sub_name: "糖", feed_amount: 9 },
      //       { sub_id: 2, sub_name: "水", feed_amount: 8 }
      //     ]
      //   },
      //   {
      //     id: 2,
      //     time: "01:00",
      //     area_name: "武曲",
      //     pond_name: "A2",
      //     pond_id: 2,
      //     feed_combo_id: 2,
      //     feed_combo_name: "2號餐",
      //     feed_total: 1500,
      //     ovserve_total: 45,
      //     is_executed: false,
      //     main_items: [
      //       { main_id: 1, main_name: "蝦料1", feed_amount: 100 },
      //       { main_id: 2, main_name: "蝦料2", feed_amount: 110 }
      //     ],
      //     sub_items: [
      //       { sub_id: 1, sub_name: "糖", feed_amount: 1 },
      //       { sub_id: 2, sub_name: "水", feed_amount: 2 }
      //     ]
      //   }
      // ];
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-checklist/`;
      var parm = {
        factory_id: this.factoryid,
        feed_time: `${this.sdate} ${this.stime}`
      };
      await this.$axios
        .get(url, { params: parm })
        .then(res => {
          this.feedData = res.data;
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
    //執行
    execsubmit: async function() {
      var parm = {
        executed_user: this.$auth.$state.user.email,
        id: this.multipleSelection.map(x=>x.id),
        is_executed:true
      };
      console.log(parm);
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-checklist-batch-update/`;
      await this.$axios
        .post(url, parm)
        .then(res => {
          if(res.data=='修改成功'){
            this.feedData = []; //清空表格資料
            this.stime = "";
            this.$toast.success(`執行成功：${parm.id.length}筆`,{duration:2000});
          }else{
            this.$toast.error(`執行失敗：${res.data}`,{duration:2000});
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
    feedData2: function() {
      var arealst = Array.from(new Set(this.feedData.map(x => x.area_name)));
      var items = [];
      for (let idx = 0; idx < arealst.length; idx++) {
        const area_name = arealst[idx];
        this.feedData.filter(x => x.area_name == area_name).map(x=>x.area_name2=x.pond_name);
        const children =  this.feedData.filter(x => x.area_name == area_name);
        var item = {
          id: `${idx}_${area_name}`,
          area_name2: area_name,
          children: children
        };
        items.push(item);
      }
      console.log(items);
      return items;
    },
    comboTotal: function() {
      // {
      //   id: 1,
      //   time: "01:00",
      //   area_name: "武曲",
      //   pond_name: "A1",
      //   pond_id: 1,
      //   feed_combo_id: 1,
      //   feed_combo_name: "1號餐",
      //   feed_total: 1000,
      //   ovserve_total: 30,
      //   is_executed: false,
      //   main_items:[{main_id:1,name:"蝦料1",feed_amount:100},{main_id:2,name:"蝦料2",feed_amount:110}],
      //   sub_items:[{sub_id:1,name:"糖",feed_amount:1},{sub_id:2,name:"水",feed_amount:2}]
      // }
      var data = this.feedData;
      if (this.feedData.length > 0) {
        var combo_list = Array.from(
          new Set(this.feedData.map(x => x.feed_combo_name))
        ); //['1號餐', '2號餐']
        const combo_result = [];
        for (let idx = 0; idx < combo_list.length; idx++) {
          const combo_name = combo_list[idx];
          const combo_item = this.feedData.filter(
            x => x.feed_combo_name == combo_name
          ); //抓1號餐所有資料
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
              // main_items[element.name] = pre + element.feed_amount;
              var value = pre + element.feed_amount;
              //math用來解決浮點數相加會出現10.000000000001的狀況
              main_items[element.name] =
                Math.round((value + Number.EPSILON) * 100) / 100;
            });

            sitem.forEach(element => {
              var pre =
                sub_items[element.name] == undefined
                  ? 0
                  : sub_items[element.name];
              // sub_items[element.name] = pre + element.feed_amount;
              var value = pre + element.feed_amount;
              sub_items[element.name] =
                Math.round((value + Number.EPSILON) * 100) / 100;
            });
          }
          const tot =
            Object.values(main_items).reduce((prev, curr) => prev + curr, 0) +
            Object.values(sub_items).reduce((prev, curr) => prev + curr, 0);
          combo_result.push({
            combo_name: combo_name,
            main_items: main_items,
            sub_items: sub_items,
            total: tot
          });
          // console.log("main",main_items);
          // console.log("sub",sub_items);
        }
        return combo_result;
      }
      return [];
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

<style lang="sass" scoped></style>
