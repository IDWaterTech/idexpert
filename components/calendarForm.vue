<template>
    <div>
        <v-form ref="editform" v-model="addvalid" lazy-validation>
        <v-card class="custom-dialog">
          <v-card-title class="add-title">
            <div class="d-inline-block">
              {{(edited.mode=="add")?"新增":"編輯"}}紀事
            </div>
            <div class="add">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="closeDialog()">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="basic pl-2 pt-2">
              <v-card-text class="flex-align-center">
                <v-switch
                  v-model="edited.is_all_day"
                  :label="`全日事件: ${edited.is_all_day}`"
                ></v-switch>
              </v-card-text>
              <v-card-text class="flex-align-center">
                <v-menu
                  v-model="menu_edit_sdate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="edited.started_date"
                      label="選擇起日"
                      prepend-icon="mdi-calendar"
                      dense filled
                      v-bind="attrs" 
                      v-on="on"
                      :rules="rules.require"
                      @click:prepend="
                        () => {
                          edited.started_date = getNowDate();
                        }
                      "
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="edited.started_date"
                    @input="menu_edit_sdate = false"
                  ></v-date-picker>
                </v-menu>
                <v-text-field
                  label="時間"
                  v-model="edited.stime"
                  dense filled
                  type="time"
                  :disabled="edited.is_all_day"
                  prepend-icon="mdi-timeline-clock-outline"
                  :rules="rules.require"
                  @click:prepend="() => (edited.stime = getNowTime())"
                ></v-text-field>
              </v-card-text>
              <v-card-text class="flex-align-center">
                <v-menu 
                  v-model="menu_edit_edate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="edited.ended_date"
                      label="選擇訖日"
                      prepend-icon="mdi-calendar"
                      dense filled
                      v-bind="attrs" 
                      v-on="on"
                      :rules="rules.require"
                      @click:prepend="
                        () => {
                          edited.ended_date = getNowDate();
                        }
                      "
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="edited.ended_date"
                    @input="menu_edit_edate = false"
                  ></v-date-picker>
                </v-menu>
                <v-text-field
                  label="時間"
                  v-model="edited.etime"
                  dense filled
                  type="time"
                  :disabled="edited.is_all_day"
                  :rules="rules.require"
                  prepend-icon="mdi-timeline-clock-outline"
                  @click:prepend="() => (edited.etime = getNowTime())"
                ></v-text-field>
              </v-card-text>
              <v-card-text class="flex-align-center">
                <v-autocomplete
                  auto-select-first
                  :items="datarange"
                  item-text="name"
                  item-value="level"
                  v-model="edited.level"
                  @change="rangechange"
                  label="資料範圍"
                  hide-details
                  style="flex:1"
                >
                  <!-- <template slot="prepend"
                    ><span style="width:70px;">資料範圍</span></template
                  > -->
                </v-autocomplete>
                <treeselect
                  class="select-template mt-2"
                  v-model="edited.poolid"
                  :options="maindatacpd_edited"
                  :default-expand-level="1"
                  :disable-branch-nodes="true"
                  children="node"
                  placeholder="請選擇資料範圍"
                  :multiple="true"
                  :normalizer="
                    node => {
                      return {children: node.node };
                    }
                  "
                  :limit="1"
                  :limitText="() => `+${edited.poolid.length - 1}`"
                  style="font-size:1rem;"
                  >
                    <!-- <div slot="value-label" slot-scope="{ node }">
                      {{
                        `${
                          node.raw.parent != undefined && node.raw.parent.length > 0
                            ? node.raw.parent + "_"
                            : ""
                        }${node.raw.name}`
                      }}
                    </div> -->
                    <div slot="value-label" slot-scope="{ node }" style="font-size:1.3em;" v-text="node.raw.parent != undefined && node.raw.parent.length > 0 ? node.raw.parent + '_'+node.raw.name:''+node.raw.name">
                    </div>
                    <div slot="option-label" slot-scope="{ node }">
                      {{ `${node.raw.name}` }}
                    </div>
                  </treeselect>
              </v-card-text>
              <v-card-text class="flex-align-center">
                <v-autocomplete
                  :rules="rules.require"
                  :items="eventCategoryData"
                  item-text="name_ch"
                  item-value="id"
                  v-model="edited.event_category_id"
                  label="事件類型"
                >
                  <!-- <template slot="prepend"
                    ><span style="width:70px;">事件類型</span></template
                  > -->
                </v-autocomplete>
                <v-autocomplete
                  :items="eventLevelData"
                  item-text="name_ch"
                  item-value="id"
                  v-model="edited.event_level_id"
                  label="事件等級"
                >
                  <!-- <template slot="prepend"
                    ><span style="width:70px;">事件等級</span></template
                  > -->
                </v-autocomplete>
              </v-card-text>
              <v-card-text class="flex-align-center">
                
              </v-card-text>
              <v-card-text class="flex-align-center">
                <span>
                  <h3>【事件等級(定義說明)】</h3>
                  <v-alert color="#E539" dense>
                    ● 重要→會直接影響到"經濟損失"的，一般來說就是跟蝦子有關，如溶氧過低，會造成蝦子死亡，此類列為重要
                  </v-alert>
                  <v-alert color="#00AC" dense style="color:white">
                    ● 一般→會影響到部分項目，但不影響"經濟損失"。如把機台拿回來維護，這段時間不會有數據上傳但不影響蝦子
                  </v-alert>
                  <v-alert color="#7575" dense>
                    ● 不重要→如機台定期添加試劑、純水等，完全不影響資料上傳或是蝦子，列為此類
                  </v-alert>
                </span>
              </v-card-text>
              <v-card-text class="flex-align-center">
                <v-text-field v-model="edited.title" dense filled clearable :rules="rules.require" label="標題">
                  <!-- <span slot="prepend" style="width:70px;">標題</span> -->
                </v-text-field>
              </v-card-text>
              <v-card-text class="flex-align-center">
                <v-textarea class="text-area" placeholder="內容" v-model="edited.content" outlined :rules="rules.require">
                </v-textarea>
              </v-card-text>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="closeDialog()">取消</v-btn>
            <v-btn class="btn-primary" @click="editsubmit(edited.mode)">確認</v-btn>
          </v-card-actions>
          
        </v-card>
      </v-form>
    </div>
</template>
<script>
import _ from "lodash";
import dayjs from "dayjs";
export default{
    data(){
        return {
            addvalid: true,
            edited: {
                mode: "add",//add,edit
                level: 1,//範圍
                poolid: [],//範圍id，
                started_date: undefined,
                ended_date: undefined,
                stime: "00:00",
                etime: "00:00",
                factory_id: [],//場id
                pond_area_id: [],//區域id
                pond_id: [],//池id
                event_level_id: 3,//事件等級
                event_category_id: undefined,//事件類型id
                title: "",
                content: "",
                is_all_day: true,
                created_user: "",
            },
            menu_edit_sdate: false,
            menu_edit_edate: false,
            rules: { require: [v => !!v || "*必要項目"] },
            //資料範圍
            datarange: [
                { level: 1, name: "場" },
                { level: 2, name: "區" },
                { level: 3, name: "池" }
            ],
            eventCategoryData:[],//事件類型
            eventLevelData:[],//警戒等級
            maindata: [],
            level: 1,
        }
    },
    computed: {
    maindatacpd_edited: function () {
      var data = _.cloneDeep(this.maindata);
      return this.nestedMain(data, this.edited.level);
    },
    poolidcpd_edited: function () {
      //重組選到的id，去除_線
      var poolid = this.edited.poolid;
      var poolidreg = [];
      if (!this.edited.poolid) {
        return [];
      }
      poolid.forEach(element => {
        //數值型態直接納入
        if (typeof element == "number") {
          poolidreg.push(element);
        } else {
          //其他自己算
          var elereg = element.match("[^_]+$");
          if (elereg != null && elereg != 0) {
            poolidreg.push(elereg[0]);
          }
        }
      });
      return poolidreg;
    }
  },
   methods: {
    closeDialog() {
      this.$emit('closeDialog', true);//關閉dialog
    },
    getNowDate: function () {
      return dayjs().format("YYYY-MM-DD");
    },
    rangechange: function () {
      this.edited.poolid = null;
    },
    getMainData: async function () {
      //let reqid = this.poolid; 用不上
      let getedItem = {};//用不上
      //取得整場架構資料
      //visible寫死名稱含^=false，寫死池的狀態=無=false
      let architectureData = await this.getArchitecture();
      this.maindata = typeof (architectureData) == 'string' ? [] : architectureData;
      var data = this.setNestedDisabled(
        _.cloneDeep(this.maindata),
        "",
        this.level
      );
      this.maindata = data;

      return;
      //下面好像沒用上
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
    setNestedDisabled: function (obj, name, onlyshowlevel = 1) {
      //全部都設成disabled
      var deleteindex = [];
      var objj = obj;
      objj.forEach((itm, index) => {
        // console.log(itm.name);//所有node(含leaf)的名稱
        itm.parent =
          itm != undefined && itm.hasOwnProperty("parent")
            ? itm.parent + "_" + name
            : name;
        const nodelst = ["1", "2"]; //第1、2層
        if (nodelst.filter(x => x == itm.level) > 0) {
          itm.id = itm.name + "_" + itm.id;
        }
        if (itm.visible == false) {
          //visible的不顯示
          deleteindex.push(index);
        }
        if (itm.hasOwnProperty("node")) {
          this.setNestedDisabled(itm.node, itm.name, onlyshowlevel);
        }
      });
      // for (let i = 0; i < deleteindex.length; i++) {
      //   const element = deleteindex[i];
      //   obj.splice(element, 1);
      // }
      //刪除 走道
      for (var i = deleteindex.length - 1; i >= 0; i--) {
        objj.splice(deleteindex[i], 1);
      }
      return objj;
    },
    nestedMain: function (obj, level) {
      obj.forEach(itm => {
        if (itm.level == level) {
          if (itm.hasOwnProperty("node")) {
            delete itm.node;
          }
        }
        if (itm.hasOwnProperty("node")) {
          this.nestedMain(itm.node, level);
        }
      });
      return obj;
    },
    //送出事件
    editsubmit: async function (mode) {
      // console.log(`edited.poolid:${this.edited.poolid}`);
      let valid = this.$refs.editform.validate();
      if (this.edited.poolid.length == 0) {
        this.$toast.error(`您尚未選擇資料範圍`, { duration: 2000 }); return;
      }
      if (valid) {
        const updUser = this.$auth.$state.user.email;
        if (mode == "add") {
          var parm = {
            started_date: `${this.edited.started_date} ${(this.edited.is_all_day) ? '00:00' : this.edited.stime}:00`,
            ended_date: `${this.edited.ended_date} ${(this.edited.is_all_day) ? '00:00' : this.edited.etime}:00`,
            factory_id: (this.edited.level == 1) ? this.poolidcpd_edited : null,//去除_前面的例：[研發一場_1]
            pond_area_id: (this.edited.level == 2) ? this.poolidcpd_edited : null,
            pond_id: (this.edited.level == 3) ? this.poolidcpd_edited : null,
            event_level_id: this.edited.event_level_id,
            event_category_id: this.edited.event_category_id,
            title: this.edited.title,
            content: this.edited.content,
            is_all_day: this.edited.is_all_day,
            created_user: updUser
          };
          var res = false;
          res = await this.postEventList(parm);
          setTimeout(() => {
            if (res) {
              console.log(`submit res:${res}`);
              // this.$toast.info(`送出 ok`, { duration: 2500 });
              this.closeDialog();//關閉dialog
            }
          }, 50)
          
          // this.getEventData();//更新畫面資料
        }
        if (mode == "edit") {
          this.$toast.error('目前沒有edit mode.',{duration:2000});
          return;
          var parm = {
            started_date: `${this.edited.started_date} ${(this.edited.is_all_day) ? '00:00' : this.edited.stime}:00`,
            ended_date: `${this.edited.ended_date} ${(this.edited.is_all_day) ? '00:00' : this.edited.etime}:00`,
            factory_id: (this.edited.level == 1) ? this.poolidcpd_edited : null,//去除_前面的例：[研發一場_1]
            pond_area_id: (this.edited.level == 2) ? this.poolidcpd_edited : null,//this.edited.poolid
            pond_id: (this.edited.level == 3) ? this.edited.poolid : null,//this.edited.poolid
            event_level_id: this.edited.event_level_id,
            event_category_id: this.edited.event_category_id,
            title: this.edited.title,
            content: this.edited.content,
            is_all_day: this.edited.is_all_day,
            updated_user: updUser
          };
          var id = this.edited.id;
          var res = false;
          res = await this.patchEventList(parm, id);
          setTimeout(() => {
            if (res) {
              this.dialog.add = false;
              this.selectedOpen = false;
              this.selectedEvent.start = parm.started_date;
              this.selectedEvent.end = parm.ended_date;
              this.selectedEvent.created_user = this.$auth.$state.user.name;
              this.selectedEvent.event_level_id = parm.event_level_id;
              this.selectedEvent.event_category_id = parm.event_category_id;
              this.selectedEvent.title = parm.title;
              this.selectedEvent.content = parm.content;
              this.selectedEvent.is_all_day = parm.is_all_day;
              this.selectedEvent.stime = `${(this.edited.is_all_day) ? '00:00' : this.edited.stime}`;
              this.selectedEvent.etime = `${(this.edited.is_all_day) ? '00:00' : this.edited.etime}`;
            }
          }, 50)
          this.getEventData();//更新畫面資料
        }
      }
    },
    //取得警戒等級
    getEventLevelData:async function(){
      let getEventLevelList = await this.getEventLevelList();
      let data = typeof (getEventLevelList)=='string'?[]:getEventLevelList;
      this.eventLevelData = data;
    },
    //取得事件類型
    getEventCategoryData:async function(){
      let getEventCatagoryList = await this.getEventCatagoryList();
      let data = typeof (getEventCatagoryList)=='string'?[]:getEventCatagoryList;
      this.eventCategoryData = data;
      this.isLoading = true;
    },
  },
    async mounted() {
    //取得整場架構資料
    await this.getMainData();
    //取得警戒等級
    await this.getEventLevelData();
    //取得事件類型
    await this.getEventCategoryData();
  }
}
</script>