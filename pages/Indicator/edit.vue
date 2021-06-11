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
            label="選擇廠"
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
            label="選擇區域"
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
          <v-select
            v-model="defitem"
            clearable
            placeholder="指定項目"
            :items="Object.keys(waterdatacols)"
            v-if="waterdatacols"
            no-data-text="查無資料"
            background-color="light-green lighten-4"
          >
          </v-select>
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
            >確認</v-btn
          >
        </v-col>
        <v-col cols="12" md="12">
          <v-btn
            icon
            color="success"
            @click="addDialog = true"
            :disabled="
              sel_main && sel_area && defitem != undefined && defitem.length > 0
                ? false
                : true
            "
            height=""
            ><v-icon>mdi-text-box-plus-outline</v-icon></v-btn
          >
          <v-dialog v-model="addDialog" max-width="500px">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card v-if="addDialog"
                ><v-card-title>新增</v-card-title>
                <v-card-subtitle class="title"
                  >{{ maindata[sel_main - 1].name }}-{{
                    maindata[sel_main - 1].node[sel_area - 1].name
                  }}-<span class="font-weight-black" style="color:red;">{{
                    defitem
                  }}</span></v-card-subtitle
                >
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
                      :key="item.name"
                      ><v-text-field
                        class="addinput"
                        type="number"
                        :id="item.name"
                        @keyup.enter="gofocusNxt(item.name)"
                        @keyup="getAddData"
                        ><p slot="prepend">{{ item.name }}</p></v-text-field
                      ></v-col
                    >
                  </v-row>
                </v-card-text>
                <v-divider></v-divider>
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
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn @click="addsubmit" color="blue darken-1" text
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
            <div v-if="sel_pool && sel_area">
              <!-- 有水池才有功能，沒有的話就圖而已 -->
              <download-excel
                :data="item.items"
                :name="
                  `${sdate}_${edate}_${maindata[sel_main - 1].name}_${
                    maindata[sel_main - 1].node[sel_area - 1].name
                  }_${mainpool.items[sel_pool].name}_${defitem}`
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
      menu_enddate: false,
      menu_adate: false,
      //新增
      sdate: "",
      edate: "",
      adate: "",
      atime: "",
      //編輯視窗
      editDialog: false,
      editedItem: {}, //已編輯項目暫存這邊
      //刪除視窗
      delDialog: false,
      //新增視窗
      addDialog: false,
      addData: [],
      //form
      valid: true,
      rules: { require: [v => !!v || "*必要項目"] }
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
    addItem: async function() {},
    gofocusNxt: async function(id) {
      //document.getElementById(id).focus();
      var findeditem = this.mainpool.items.find(x => x.name == id);
      var idxitem = this.mainpool.items.indexOf(findeditem);
      if (idxitem + 1 == this.mainpool.items.length) {
        //最後一項，鎖定原位
        document.getElementById(id).focus();
      } else {
        //鎖定下一項
        let nxtItem = this.mainpool.items[idxitem + 1];
        document.getElementById(nxtItem.name).focus();
      }
    },
    getAddData: function() {
      let adddatatmp = [];
      for (const key in this.mainpool.items) {
        let item = this.mainpool.items[key];
        let myValue = document.getElementById(item.name).value.trim();
        if (myValue.length > 0) {
          adddatatmp.push({ name: item.name, value: myValue });
        }
      }
      this.addData = adddatatmp;
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    getNowTime:function(){
      let mytime = dayjs().format("HH:mm");
      return mytime;
    },
    addsubmit: async function() {
      let valid = this.$refs.form.validate();
      if (valid) {
        this.addDialog = false;
      }
    }
  }
};
</script>

<style scoped></style>
