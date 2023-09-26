<template>
  <div>
    <v-card class="video">
        <div class="card-title">
            <v-row style="margin-bottom: 0;">
                <div class="title">
                    <v-icon>mdi-video-box</v-icon>
                    <v-card-title>影像辨識</v-card-title>
                </div>
            </v-row>
        </div>
        <div class="content">
          <div class="search">
            <v-row style="margin-bottom: 12px;">
              <v-col cols="12" md="3" class="caculate" sm="12" style="position: relative;">
                <locate-select :dataScope="'pool'" defaultSelect="" :isMulti="false" @scopeSel_data="get_scopeData($event)" class="select-template"></locate-select>
                <label v-if="nowPool!==''" class="label-select">*請選擇養殖區域(必選)</label>
              </v-col>
              <!-- 選擇起日 -->
              <v-col cols="12" md="3" sm="12"  class="caculate">
                <v-menu class="my-1" v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40"
                  transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="sdate" label="選擇起日" prepend-icon="mdi-calendar" readonly v-bind="attrs" hide-details
                      v-on="on" clearable @click:prepend="() => (sdate = getNowDate())"></v-text-field>
                  </template>
                  <v-date-picker v-model="sdate" @input="menu_startdate = false" locale="zh-tw" no-title></v-date-picker>
                </v-menu>
              </v-col>
              <!-- 選擇訖日 -->
              <v-col cols="12" md="3" sm="12"  class="caculate">
                <v-menu class="my-1" v-model="menu_enddate" :close-on-content-click="false" :nudge-right="40"
                  transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="edate" label="選擇訖日" prepend-icon="mdi-calendar" readonly v-bind="attrs" hide-details
                      v-on="on" clearable @click:prepend="() => (edate = getNowDate())"></v-text-field>
                  </template>
                  <v-date-picker v-model="edate" @input="menu_enddate = false" locale="zh-tw" no-title></v-date-picker>
                </v-menu>
              </v-col>
              <!-- 選擇類別 觀察網/菌盤 -->
              <v-col cols="12" md="3" sm="12" align-self="center"  class="caculate">
                <v-radio-group class="my-1" row v-model="dataClass" mandatory @change="()=>{recogData={}}" hide-details>
                  <v-radio v-for="(item, i) in dataClassList" :label="item.name" :value="item.name" :key="i">
                    <span slot="label" style="display: flex;align-items: center;">
                      <v-icon class="mr-1">{{ item.icon }}</v-icon>{{ `${item.name}` }}
                    </span></v-radio>
                </v-radio-group>
              </v-col>
              <!-- 查詢 -->
              <v-col cols="12" md="1" sm="12">
                <div class="align-self-center" >
                  <v-btn
                    tile
                    @click="getRecog"
                    :disabled="(!(sdate && edate))||(poolid==undefined||poolid==''||poolid==null)"
                    class="btn-primary"
                    >查詢</v-btn
                  >
                </div>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </div>
          <!-- 搜尋結果 -->
          <div class="result">
            <v-row style="margin-bottom: 0;">
              <v-col cols="12">
                <v-card class="result-card">
                  <!-- 觀察網 -->
                  <v-data-table
                    v-if="dataClass == '觀察網'"
                    class="edit-table"
                    :headers="headers"
                    :items="recogData.items" dense
                    :footer-props="footerProps"
                    no-data-text="查無資料"
                    height="47vh"
                    fixed-header>
                    <template v-slot:[`item.feed_img`]="{ item }">
                      <!-- <img :src="item.feed_img" style="height:200px"> -->
                      <!-- <div slot-scope="scope"> -->
                        <img v-img="{ group: item.id }" :src="item.feed_img" :style="{height:`${innerWidth>768?'120px':'80px'}`}" />
                      <!-- </div> -->
                    </template>
                    <template v-slot:[`item.shrimp_img`]="{ item }">
                      <!-- <img :src="item.shrimp_img" style="height:200px"> -->
                      <img v-img="{ group: item.id }" :src="item.shrimp_img" :height="`${innerWidth>768?'120px':'80px'}`" />
                    </template>
                    <template v-slot:[`item.shrimp`]="{ item }">
                      <div style="text-align: left;display: flex;justify-content: flex-start;">
                        <span v-html="item.shrimp" style="line-height: 24px;word-break: break-all;" :style="{textAlign:`${innerWidth>599.98?'left':'right'}`}"></span>
                      </div>
                    </template>
                  </v-data-table>

                  <!-- 菌盤 -->
                  <v-data-table
                    v-if="dataClass == '菌盤'"
                    class="edit-table"
                    :headers="headers"
                    :items="recogData.items" dense
                    :footer-props="footerProps"
                    no-data-text="查無資料"
                    height="47vh"
                    fixed-header>
                    <template v-slot:[`item.images`]="{ item }">
                        <img v-img="{ group: item.id }" v-for="(img,i) in item.images" :key="i" :src="img" :style="{height:`${innerWidth>768?'120px':'80px'}`}" />
                        <span v-if="item.images.length>0"><br>共{{item.images.length}}張</span>
                    </template>
                    <template v-slot:[`item.info`]="{item}">
                      <span>加熱：</span><span  :style="(item.is_heated)?'color:red;':''">{{ item.is_heated? '有' : '無' }}</span><br/>
                      <span>水樣稀釋倍率：{{ item.dilution }}</span><br/>
                      <span>塗盤體積：{{ item.volume }}</span><br/>
                      <span>檢驗時間：{{ item.inspected_time }}</span>
                    </template>
                    <template v-slot:[`item.class`]="{ item }">
                      <div style="text-align: left;display: flex;justify-content: flex-start;">
                        <span v-html="item.class" style="line-height: 24px;word-break: break-all;" :style="{textAlign:`${innerWidth>599.98?'left':'right'}`}"></span>
                      </div>
                    </template>
                  </v-data-table>
                </v-card>
                
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card>
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
  head(){
    return{
      title:'影像辨識'
    }
  },
  data() {
    return {
      poolid: '',
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
      dataClassList: [{ "name": "觀察網", "icon": "mdi-archive-eye-outline" }, { "name": "菌盤", "icon": "mdi-bacteria-outline" }],
      tableHeight: window.innerHeight - 64 - 80 -64,
      innerWidth: window.innerWidth,
      nowPool: '',
      footerProps: {
        "items-per-page-text": "每頁",
        "items-per-page-options": [25, 50, 75, 100]
      },
      headers:[]
    };
  },
  methods: {
    get_scopeData:function(evt){
      console.log('pool',evt);
      this.maindata.forEach(f=>{
        f.node.forEach(a=>{
          a.node.forEach(p=>{
            if(p.id == evt) {
              this.nowPool = a.name+'_'+p.name;
            }
          })
        })
      })
      this.poolid = evt;
    },
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
              // this.recogData = res.data;
              console.log("觀察網資料",res.data);
              this.headers = [];
              this.recogData = {
                id: res.data.id,
                name: res.data.name,
                items: []
              };
              if (res.data.items.length == 0) {
                this.$toast.success(`查無觀察網資料`, { duration: 2000 });
              }else {
                this.headers = [
                  {align: "center",groupable: false,text: "資料",value: "id",width:"10%"},
                  {align: "center",groupable: false,text: "觀察網飼料圖(已辨識)",value: "feed_img",width:"30%", sortable: false },
                  {align: "center",groupable: false,text: "觀察網蝦子圖(已辨識)",value: "shrimp_img",width:"30%", sortable: false },
                  {align: "center",groupable: false,text: "辨識資訊",value: "shrimp",width:"30%"}];
                res.data.items.forEach(d=>{
                  this.recogData.items.push({
                    shrimp:`蝦子數量(隻)：${d.shrimp_qty}<br> 
                              蝦子重量(g)：[ ${d.shrimp_weight==null?'':d.shrimp_weight} ]<br>
                              蝦子長度(cm)：[ ${d.shrimp_length==null?'':d.shrimp_length} ]<br>
                              飼料殘餌率：${d.leftover_rate}<br>
                              檢測時間：${d.inspected_date}`,
                    feed_img:d.feed_img,
                    id:d.id,
                    shrimp_img:d.shrimp_img
                  })
                })
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
              console.log("菌盤資料",res.data);
              this.headers = [];
              this.recogData = {
                id: res.data.id,
                name: res.data.name,
                items: []
              };
              // res.data.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230913170000_1_1/feed_result.jpg');
              // res.data.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230912192249_1_2/feed_result.jpg');
              // res.data.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230913202700_1_2/feed_result.jpg');
              // res.data.items[0].images.push('https://www.idwatertech.com:8011/media/observation/20230913190000_1_2/feed_result.jpg');
              //  this.recogData = res.data;
              if (res.data.items.length == 0) {
                this.$toast.success(`查無菌盤資料`, { duration: 2000 });
              }else {
                // this.headers = ['資料','時間','加熱','class','辨識'];
                this.headers = [
                  {align: "center",groupable: false,text: "資料",value: "id",width:"10%"},
                  // {align: "center",groupable: false,text: "時間",value: "inspected_time",width:"20%" },
                  // {align: "center",groupable: false,text: "加熱",value: "is_heated",width:"10%" },
                  {align: "left",groupable: false,text: "資訊",value: "info",width:"20%" },
                  {align: "center",groupable: false,text: "class",value: "class",width:"20%", sortable: false},
                  {align: "left",groupable: false,text: "辨識",value: "images",width:"40%", sortable: false}];
                }
                res.data.items.forEach(d=>{
                  this.recogData.items.push({
                    class: `1. ${d.class1}<br> 
                            2. ${d.class2}<br>
                            3. ${d.class3}<br>
                            4. ${d.class4}<br>
                            5. ${d.class5}`,
                    dilution:d.dilution,
                    volume:d.volume,
                    images:d.images,
                    id:d.id,
                    inspected_time:d.inspected_time,
                    is_heated:d.is_heated
                  })
                })
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
      //取得整場架構資料
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
    //取得整場架構資料
    await this.getMainData();
    //監控視窗
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 64 - 80 -64;
      this.innerWidth = window.innerWidth;
    });
    
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
  },
  watch: {
    tableHeight:function(){
        return window.innerHeight - 64 - 80 -64;
    },
    innerWidth() {
      return window.innerWidth;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-application.v-application--is-ltr {
  .v-card.video {
    min-height: 84vh;
    overflow: hidden;
    margin-bottom: 24px;
    * {
      color: $color-dark;
    }
    button.v-icon, button.v-btn--icon .v-icon {
      color: $color-primary;
    }
    .red--text {
      color: $color-accent !important;
    }
    .card-title,.content {
      padding: 12px 24px;
      .row {
        margin-left: 0;
        margin-top: 0;
        margin-bottom: 24px;
      }
      .title {
        display: flex;
        align-items: center;
        .theme--light.v-icon {
          color: $color-form;
        }
      }
    }
    .card-title {
     padding-bottom: 0;
    }
    .v-card__title {
      color: $color-dark;
      font-weight: bold;
    }
    .content {
      padding-top: 0;
      .row {
        align-items: center;
        .v-input {
          margin-top: 0;
          padding-top: 0;
          &.primary {
            background-color: transparent !important;;
          }
        }
        .theme--light.v-btn.v-btn--disabled .v-icon {
          color: $color-dark-25 !important;
        }
        .theme--light.v-btn.v-btn--disabled .v-btn__loading,.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
          background-color: $color-dark-25 !important;
        }
      }
    }
    .search {
      margin-bottom: 12px;
      .caculate {
        max-width: calc((100%  / 4) - (100% / 12) / 4 );
      }
      .caculate-8 {
        max-width: calc((100% / 12 * 8) - ((100% / 12) / 1.5));
      }
    }
    .v-sheet.result-card.v-card:not(.v-sheet--outlined) {
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .v-card.result-card {
      padding: 24px;
      padding-bottom: 8px;
      background-color: $color-lighten;
      .theme--light.v-data-table {
        background-color: $color-lighten;
      }
      .header-bar {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 12px 24px;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        h5 {
          width: 100%;
        }
      }
      .result-content {
        padding: 0 24px;
        &.event {
          margin-top: 24px;
        }
      }
    }
  }
}
::v-deep {
  .search {
    .font-size-large {
      font-size: 16px;
    }
    
    .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
      border-color: $color-form;
    }
  
    .theme--light.v-input input {
      font-size: 14px;
      color: $color-dark;
    }
    .label-select {
      font-size: 10px;
      color: $color-form !important;
      position: absolute;
      left: 18px;
      top: 0;
    }
    .theme--light.v-label {
      color: $color-dark;
    }
    .theme--light.v-icon,.theme--light.v-label.v-label--active {
      color: $color-form;
    }
  }
  .result {
    .theme--light.v-data-table.v-data-table--fixed-header thead th {
      background: $color-lighten;
    }
    .header-bar {
      .theme--light.v-tabs > .v-tabs-bar,.theme--light.v-tabs-items,
      .theme--light.v-data-table,.v-toolbar__content, .v-toolbar__extension {
        background-color: $color-lighten;
      }
      .theme--light.v-data-table,.theme--light.v-toolbar.v-sheet {
          background-color: $color-lighten;
      }
      .v-toolbar__content, .v-toolbar__extension {
        padding: 0;
        button {
          height: 36px;
          border-radius: 4px;
        }
        .v-btn--is-elevated {
          box-shadow: none;
          background-color: $color-primary;
          color: #fff;
        }
        .theme--light.v-btn.v-btn--disabled {
          color: $color-dark-50;
        }
      }
      .v-tab {
        font-size: 18px;
        font-weight: bold;
        color: $color-dark-50 !important;
        .icons {
          margin-right: 4px;
          i {
            color: $color-dark-50;
          }
          
        }
      }
      .v-tab.v-tab--active {
        color: $color-primary !important;
        .icons {
          margin-right: 4px;
          i {
            color: $color-primary;
          }
          
        }
      }
      .theme--light.v-tabs .v-tab--active:hover::before,.theme--light.v-tabs .v-tab:hover::before {
        border-radius: 4px;
      }
    }
  }
  .select-color{
    &.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
      border-color: $color-form;
    }
    & .theme--light.v-input input, &.theme--light.v-input textarea,& .theme--light.v-label {
      color: $color-dark;
    }
    & .theme--light.v-label.v-label--active {
      color: $color-form;
    }
    & .v-icon.v-icon {
      color: $color-form;
    }
    & .v-select__selection--comma,.theme--light.v-select .v-select__selections {
      color: $color-dark;
    }
    & .v-select__slot {
      border-color: $color-form;
    }
  }
  .edit-table {
    &.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper),
    &.theme--light.v-data-table tbody tr.v-data-table__selected {
      background: $color-primary-25;
    }
    input[type="checkbox"] {
      accent-color: $color-primary;
    }
    .v-input--selection-controls.v-input--is-disabled:not(.v-input--indeterminate) .v-icon {
      color: $color-dark-25;
    }
    table {
      height: 100%;
    }
  }
  .edit-disabled {
    &.theme--light.v-text-field.v-input--is-disabled .v-input__slot::before {
      border-image: none;
      border: none;
    }
    &.theme--light.v-text-field--filled > .v-input__control > .v-input__slot,&.theme--light.v-text-field--filled:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot:hover {
      background: $color-dark-25;
      color: $color-dark-50;
    }
    &.v-text-field .v-input__slot {
      border-radius: 4px;
    }
  }
}

@media (max-width: 768px) {
  .v-application.v-application--is-ltr {
    .v-card.video {
      .search {
        margin-bottom: 24px;
        .caculate {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
