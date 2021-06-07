<template>
  <div>
    <v-container fluid>
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
                label="選擇日期"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="sdate"
              @input="menu_startdate = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="sel_main"
            :items="maindata"
            item-value="id"
            item-text="name"
            label="選擇廠"
            clearable
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
            label="選擇區域"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            v-model="sel_pool"
            :items="this.mainpool.items"
            item-text="name"
            item-value="id"
            no-data-text="查無資料"
            placeholder="選擇水池"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="defitem"
            clearable
            placeholder="指定項目"
            :items="Object.keys(waterdatacols)"
            v-if="waterdatacols"
            no-data-text="查無資料"
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="1">
          <v-btn
            block
            color="primary"
            @click="getdata"
            :disabled="
              sel_pool &&
              sel_area &&
              sel_main &&
              defitem != undefined &&
              defitem.length > 0
                ? false
                : true
            "
            >確認</v-btn
          >
        </v-col>
        <v-col cols="12" md="1">
          <v-btn
            block
            icon
            color="primary"
            @click="addDialog = true"
            :disabled="
              sel_pool &&
              sel_area &&
              sel_main &&
              defitem != undefined &&
              defitem.length > 0
                ? false
                : true
            "
            ><v-icon>mdi-text-box-plus-outline</v-icon></v-btn
          >
          <v-dialog v-model="addDialog" max-width="500px"
            ><v-card><v-card-title>新增項目</v-card-title>
            <v-card-text>test</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="addDialog=false" color="blue darken-1" text>確定</v-btn>
            </v-card-actions>
            </v-card></v-dialog
          >
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
          >
            <template v-slot:item.actions="{ item }">
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
                            v-model="editedItem.inspected_date"
                            label="日期"
                            disabled
                          ></v-text-field>
                          <v-text-field
                            v-model="editedItem.value"
                            label="值"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="editDialog = false"
                    >
                      取消
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="editDialog = false"
                    >
                      確定
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="delDialog" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"> 是否刪除該項目?</v-card-title>
                  <v-card-text class="text-h5">
                    時間：{{ editedItem.inspected_date }}<br />
                    值：{{ editedItem.value }}
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="delDialog = false"
                      >取消</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="delDialog = false"
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
    </v-container>
  </div>
</template>

<script>
import dayjs from "dayjs";
import WaterQuality_Vcharts from "@/components/sheet/waterQuality_vcharts";
import { number } from "~/node_modules/echarts/lib/export";
export default {
  layout: "emptynologin",
  components: {
    WaterQuality_Vcharts
  },
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
      sdate: dayjs(new Date(2021, 0, 11))
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      //編輯視窗
      editDialog: false,
      editedItem: {}, //已編輯項目暫存這邊
      //刪除視窗
      delDialog: false,
      //新增視窗
      addDialog: false
    };
  },
  mounted() {
    console.log(Object.keys(this.req));
  },
  async created() {
    //抓廠資料
    await this.$axios.get("http://61.56.172.10/architecture/").then(res => {
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
    });
    //抓水質項目
    await this.$axios
      .get("http://61.56.172.10/water-quality-col-name/")
      .then(res => {
        this.waterdatacols = res.data;
        this.allcols["water"] = Object.assign({}, res.data);
        this.defitem =
          this.req.defitem != undefined && this.req.defitem.length > 0
            ? this.req.defitem
            : [];
      });
    // var defitem_tmp = this.defitem;//判斷項目是屬於水質還是投餵用

    //抓投餵項目
    await this.$axios.get("http://61.56.172.10/feed-col-name/").then(res => {
      this.allcols["feed"] = Object.assign({}, res.data);
      Object.assign(this.waterdatacols, res.data);
    });
    //抓環境項目
    await this.$axios.get("http://61.56.172.10/env-col-name/").then(res => {
      this.allcols["env"] = Object.assign({}, res.data);
      Object.assign(this.waterdatacols, res.data);
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

      if (this.sel_area) {
        //水池基本資料
        await this.$axios
          .get("http://61.56.172.10/ponds-data/", { params: para })
          .then(res => {
            this.mainpool.items = res.data;
          })
          .finally(() => {
            /* 不論失敗成功皆會執行 */
          });
      } else {
        this.mainpool.items = [];
      }
    },
    getdata: async function() {
      console.log(
        "api 參數",
        this.sdate,
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
        ended_date: this.sdate,
        factory_id: this.sel_main,
        pond_area_id: this.sel_area,
        pond_id: this.sel_pool,
        items: this.defitem
      };
      let apiurl = ``;
      switch (itemclass) {
        case "water":
          apiurl = `http://61.56.172.10/water-quality-data/`; //await this.$axios.get(apiurl,{ params: para }).then(res => {
          break;
        case "feed":
          apiurl = `http://61.56.172.10/feed-data/`;
          break;
        case "env":
          apiurl = `http://61.56.172.10/env-data/`;
          break;
        default:
          break;
      }
      //歸零
      this.item = "";
      this.headers = [];
      //抓資料
      await this.$axios.get(apiurl, { params: para }).then(res => {
        this.item = res.data;
        let cols = Object.keys(res.data.items[0]);
        for (const key in cols) {
          this.headers.push({
            text: cols[key],
            value: cols[key],
            groupable: false
          });
        }
        this.headers.push({ text: "動作", value: "actions", sortable: false });
        console.log("API:" + res.request.responseURL);
      });
      this.loading = false;
    },
    editItem: async function(item) {
      //編輯中的物件item
      this.editedItem.inspected_date = item.inspected_date;
      this.editedItem.value = item[Object.keys(item)[1]];
      this.editDialog = true;
    },
    delItem: async function(item) {
      //編輯中的物件item
      this.editedItem.inspected_date = item.inspected_date;
      this.editedItem.value = item[Object.keys(item)[1]];
      this.delDialog = true;
    },
    addItem: async function() {}
  }
};
</script>

<style scoped></style>
