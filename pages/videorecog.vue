<template>
  <div>
    <v-row dense align="center">
      <v-col cols="12">
        <h2 class="white--text">影像辨識</h2>
      </v-col>
      <v-col cols="12" class="cardtitle">
        <v-row>
          <!-- 養殖池 -->
          <v-col cols="12" sm="3" class="text-center my-5">
            <!-- <div class="circle">
          <span class="circletitle">{{ poolName }}</span>
        </div> -->
            <!-- <span class="circletitle headline my-5 text-center">{{
          poolName
        }}</span> -->
            <!-- {{getNodeName(maindata,poolid)}} -->
            <treeselect v-model="poolid" :options="maindata" :default-expand-level="1" placeholder="養殖池"
              :disable-branch-nodes="true" children="node" :normalizer="
                node => {
                  return { children: node.node };
                }
              " style="font-size:1.2em;">
              <div slot="value-label" slot-scope="{ node }">
                {{ `${node.raw.parent}_${node.raw.name}` }}
              </div>
              <div slot="option-label" slot-scope="{ node }">
                {{ `${node.raw.name}` }}
              </div>
            </treeselect>
          </v-col>
          <!-- 選擇起日 -->
          <v-col cols="12" md="2">
            <v-menu v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="sdate" label="選擇起日" prepend-icon="mdi-calendar" readonly dark v-bind="attrs"
                  v-on="on" clearable @click:prepend="() => (sdate = getNowDate())"></v-text-field>
              </template>
              <v-date-picker v-model="sdate" @input="menu_startdate = false" locale="zh-tw" no-title></v-date-picker>
            </v-menu>
          </v-col>
          <!-- 選擇訖日 -->
          <v-col cols="12" md="2">
            <v-menu v-model="menu_enddate" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="edate" label="選擇訖日" prepend-icon="mdi-calendar" readonly dark v-bind="attrs"
                  v-on="on" clearable @click:prepend="() => (edate = getNowDate())"></v-text-field>
              </template>
              <v-date-picker v-model="edate" @input="menu_enddate = false" locale="zh-tw" no-title></v-date-picker>
            </v-menu>
          </v-col>
          <!-- 查詢 -->
          <v-col cols="12" md="1" align-self="center">
            <v-btn color="primary" dark @click="getRecog" :disabled="!(sdate && edate)" tile large>查詢</v-btn>
          </v-col>
          <!-- 選擇類別 -->
          <v-col cols="12" md="3" align-self="center">
            <v-radio-group row dark v-model="dataClass" mandatory @change="()=>{recogData={};}">
              <v-radio v-for="(item, i) in dataClassList" :label="item.name" :value="item.name" :key="i"><span
                  slot="label">
                  <v-icon class="mr-1">{{ item.icon }}</v-icon>{{ `${item.name}` }}
                </span></v-radio>
            </v-radio-group>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-col>

      <v-col cols="12" v-if="dataClass == '觀察網'">
        <el-table ref="recogtable" style="width:100%" :data="recogData.items" highlight-current-row
          :header-cell-style="tableHeaderStyle" max-height="500" class="primary" :header-cell-name="cellClass">
          <template slot="empty"><span class="headline" style="color:lightblue;">暫無資料</span></template>
          <!-- @current-change="handleCurrentChange"
          @select="handleSelectionChange" -->
          <el-table-column label="資料" align="center">
            <div slot-scope="scope">
              {{ scope.row.id }}<br />
              {{ scope.row.inspected_date }}
            </div>
          </el-table-column>
          <el-table-column label="投餌前飼料圖(已辨識)" prop="feed_img_before_bait" align="center">
            <div slot-scope="scope">
              <img v-img="{ group: scope.row.id }" :src="scope.row.feed_img_before_bait" width="100%" />
              <!-- <el-image :src="scope.row.feed_img_before_bait"  width="100%">
                <div slot="error" class="image-slot">
                  <img :src="images.feedfish" width="64" />
                </div>
              </el-image> -->
            </div>
          </el-table-column>
          <el-table-column label="投餌後飼料圖(已辨識)" prop="feed_img_after_bait" align="center">
            <div slot-scope="scope">
              <img v-img="{ group: scope.row.id }" :src="scope.row.feed_img_after_bait" width="100%" />

            </div>
          </el-table-column>
          <el-table-column label="投餌後蝦子圖(已辨識)" prop="shrimp_img_after_bait" align="center">
            <div slot-scope="scope">
              <img v-img="{ group: scope.row.id }" :src="scope.row.shrimp_img_after_bait" width="100%" />
            </div>
          </el-table-column>
          <el-table-column label="網子面積(cm²)" prop="net_size" align="center"></el-table-column>
          <el-table-column label="投餌飼料面積(cm²)" align="center">
            <div slot-scope="scope">
              前：{{ scope.row.feed_size_before_bait }} <br />
              後：{{ scope.row.feed_size_after_bait }}
            </div>
          </el-table-column>
          <el-table-column label="飼料比例(投餌後飼料/投餌前飼料)" prop="feed_percentage" align="center">
          </el-table-column>
          <el-table-column label="蝦子面積" prop="shrimp_size" align="center">
            <div slot-scope="scope">
              {{ scope.row.shrimp_size }}
            </div>
          </el-table-column>
          <el-table-column label="檢測時間" prop="inspected_date" align="center"></el-table-column>
          <!-- <el-table-column label="循環訖日" prop="ended_date" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{
                scope.row.ended_date == null || scope.row.ended_date == ""
                  ? `執行中`
                  : scope.row.ended_date
              }}</span>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="">
              <v-btn color="primary" outlined small disabled @click="() => { }">刪除</v-btn>
            </template>
          </el-table-column>
        </el-table>
      </v-col>
      <v-col v-if="dataClass == '菌盤'">
        <beca :recogData="recogData"></beca>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import dayjs from "dayjs";
import _ from "lodash";
import beca from "@/pages/becateriarecog.vue";
export default {
  layout: "emptynologin",
  middleware: "auth",
  components: {
    beca
  },
  data() {
    return {
      poolid: 1,
      maindata: [],
      //
      recogData: {
        id: 1,
        name: "A1",
        items: [
          // {
          //   id: 1,
          //   feed_img_before_bait:
          //     "https://www.idwatertech.com/.well-known/observation/20211028093910_1_1/feed_result.jpg",
          //   feed_img_after_bait:
          //     "https://www.idwatertech.com/.well-known/observation/20211028093910_1_2/feed_result.jpg",
          //   shrimp_img_after_bait:
          //     "https://www.idwatertech.com/.well-known/observation/20211028093910_1_2/shrimp_result.jpg",
          //   net_size: 1600,
          //   feed_size_before_bait: 80.66,
          //   feed_size_after_bait: 40.21,
          //   feed_percentage: 6.234,
          //   shrimp_size: [2222, 3333, 4444, 5555],
          //   inspected_date: "2021-01-01 00:00:00"
          // }
        ]
      },
      images: {
        feedfish: require("~/assets/feedfish.png"),
        shrimp: require("~/assets/shrimp.png")
      },
      //---日曆
      menu_startdate: false,
      menu_enddate: false,
      sdate: "",
      edate: "",
      //---選定類別
      dataClass: "",
      dataClassList: [{ "name": "觀察網", "icon": "mdi-archive-eye-outline" }, { "name": "菌盤", "icon": "mdi-bacteria-outline" }]
    };
  },
  methods: {
    cellClass: function (row) {
      if (row.columnIndex == 0) {
        return "disableSelection";
      }
    },
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      let bgcolor = $nuxt.$vuetify.theme.themes.light.cardtitle;
      if (rowIndex == 0) {
        return `background-color:${bgcolor};color:#fff;font-weight:500;`;
      } else {
        return `background-color:${bgcolor};`;
      }
    },
    getRecog: async function () {
      switch (this.dataClass) {

        case "觀察網":
          var parm = {
            started_date: this.sdate,
            ended_date: this.edate,
            pond_id: this.poolid
          };
          await this.$axios
            .get(
              `${this.$store.state.mydata.gobal_api.apiUrl}/observation-image-data/`,
              { params: parm }
            )
            .then(res => {
              this.recogData = res.data;
              if (res.data.items.length == 0) {
                this.$toast.success(`查無觀察網資料`, { duration: 2000 });
              }
                console.log("觀察網api：",res.request.responseURL);
            })
            .catch(error => {
              this.$toast.error(`取得觀察網資料失敗:${error.message}`, { duration: 2000 });
            });
          break;
        case "菌盤":
          var parm = {
            started_date: this.sdate,
            ended_date: this.edate,
            pond_id: this.poolid
          };
          await this.$axios
            .get(
              `${this.$store.state.mydata.gobal_api.apiUrl}/bacteria-image-data/`,
              { params: parm }
            )
            .then(res => {
               this.recogData = res.data;
              if (res.data.items.length == 0) {
                this.$toast.success(`查無菌盤資料`, { duration: 2000 });
              }
                console.log("菌盤api：",res.request.responseURL);
            })
            .catch(error => {
              this.$toast.error(`取得菌盤資料失敗:${error.message}`, { duration: 2000 });
            });
          break;
        default:
          break;
      }

    },
    getNowDate: function () {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    setNestedDisabled: function (obj, name) {
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
    getMainData: async function () {
      let reqid = this.poolid;
      let getedItem = {};
      //取得整廠架構資料
      //visible寫死名稱含^=false，寫死池的狀態=無=false
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
        .then(res => {
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
    }
  },
  async mounted() {
    //取得整廠架構資料
    await this.getMainData();
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
  }
};
</script>

<style scoped>
</style>
