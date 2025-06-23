<template>
  <div>
    <v-overlay :value="!isLoading" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card 
      class="bg-card mb-3">
      <div class="content pt-3">
        <!-- 搜尋欄 -->
        <div class="search">
          <v-row class="mb-0">
            <!-- 場/區/池 -->
            <v-col cols="12" md="2" sm="3">
              <v-autocomplete
                auto-select-first
                hide-details
                :items="datarange"
                item-text="name"
                item-value="level"
                v-model="level"
                label="資料範圍"
                @change="rangechange"
              >
              </v-autocomplete>
            </v-col>
            <!-- 場/區/池 二階-->
            <v-col cols="12" md="4" sm="5">
              <treeselect
                class="select-template"
                v-model="poolid"
                :options="maindatacpd"
                :default-expand-level="1"
                :disable-branch-nodes="true"
                children="node"
                placeholder="請選擇資料範圍"
                :multiple="true"
                :normalizer="
                  node => {
                    return { children: node.node };
                  }
                "
                :limit="1"
                :limitText="() => `+${poolid.length - 1}`"
                style="font-size:1rem;"
              >
                <div slot="value-label" slot-scope="{ node }" style="font-size:1.3em;" v-text="node.raw.parent != undefined && node.raw.parent.length > 0 ? node.raw.parent + '_'+node.raw.name:''+node.raw.name">
                </div>
                <div slot="option-label" slot-scope="{ node }">{{ `${node.raw.name}` }}
                </div>
              </treeselect>
            </v-col>
            <!-- 起(暫無用) -->
            <v-col cols="12" md="3" v-show="false">
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
                    v-bind="attrs" :disabled="true"
                    v-on="on"
                    @click:prepend="
                      () => {
                        sdate = getNowDate();
                      }
                    "
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="sdate"
                  @input="menu_startdate = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- 訖(暫無用) -->
            <v-col cols="12" md="3" v-show="false">
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
                    :disabled="true"
                    v-bind="attrs"
                    v-on="on"
                    @click:prepend="
                      () => {
                        edate = getNowDate();
                      }
                    "
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="edate"
                  @input="menu_enddate = false"
                ></v-date-picker>
              </v-menu>
            </v-col>  
            <v-col cols="12" md="3" sm="4">
              <v-btn
                tile
                class="btn-primary"
                :class="{'disabled':!poolidcpd || poolidcpd.length == 0}"
                @click="getEventData"
                >確認</v-btn
              >
              <v-btn tile class="btn-secondary" @click="()=>{dialog.eventSet=true;this.eventSetGet();}">飼料表事件設定</v-btn>
            </v-col>
          </v-row>
        </div>
        <!-- 搜尋結果 -->
        <div class="result">
          <v-row class="fill-height pb-0">
            <v-col class="pt-0" style="border-radius: 4px;background-color: white;">
              <v-sheet height="64" class="pa-1">
                <v-toolbar flat height="56">
                  <!-- 新增紀事 -->
                  <v-btn class="btn-secondary green mr-4" @click="openedit('add')"><v-icon>mdi-calendar-plus</v-icon>新增</v-btn>
                  <!-- 今天 -->
                  <v-btn
                    outlined
                    class="mr-4"
                    color="grey darken-2"
                    @click="setToday"
                  >
                    今天
                  </v-btn>
                  <!-- 前/後月 -->
                  <v-btn fab text small color="grey darken-2" @click="prev">
                    <v-icon small>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                  </v-toolbar-title>
                  <v-btn fab text small color="grey darken-2" @click="next">
                    <v-icon small>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn-toggle v-model="type" group color="mainbg">
                    <v-btn value="day" style="border-radius: 4px;">日</v-btn>
                    <v-btn value="week" style="border-radius: 4px;">週</v-btn>
                    <v-btn value="month" style="border-radius: 4px;">月</v-btn>
                  </v-btn-toggle>
                  <v-menu bottom right v-if="false">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right>
                          mdi-menu-down
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="type = 'day'">
                        <v-list-item-title>Day</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'week'">
                        <v-list-item-title>Week</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'month'">
                        <v-list-item-title>Month</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = '4day'">
                        <v-list-item-title>4 days</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-toolbar>
              </v-sheet>
              <v-sheet height="500" class="pa-1" >
                <v-calendar
                  ref="calendar"
                  v-model="focus"
                  color="primary"
                  :events="events"
                  :event-color="getEventColor"
                  :type="type"
                  style="border-radius: 4px;"
                  @click:event="showEvent"
                  @click:more="viewDay"
                  @click:date="viewDay"
                  @change="updateRange"
                  locale="zh-tw"
                ></v-calendar>
                <v-menu
                  v-model="selectedOpen"
                  :close-on-content-click="false"
                  :activator="selectedElement"
                  offset-x
                  max-width="400px"
                >
                <!-- 紀事內容 -->
                  <v-card color="grey lighten-4" min-width="350px" flat>
                    <v-toolbar :color="selectedEvent.color" dark  class="box-shadow-none">
                      
                      <v-toolbar-title class="pl-2 ml-2"><span v-html="`【${selectedEvent.event_level_name}】${selectedEvent.name}`"></span></v-toolbar-title>
                      <!-- <v-toolbar-title v-html="`[${selectedEvent.event_level_name}]_${selectedEvent.name}`"></v-toolbar-title> -->
                      <v-spacer></v-spacer>
                      <v-btn class="mr-2 box-shadow-none px-1 py-0" style="border: none;min-width: 0;background-color: transparent;"  @click="selectedOpen = false" >
                        <v-icon style="color: #fff">mdi-close</v-icon>
                      </v-btn>
                      
                      <!-- <v-btn icon>
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn> -->
                    </v-toolbar>
                    <v-card-subtitle v-if="selectedEvent.start">
                      <span v-html="`起：${selectedEvent.start}<br/>訖：${selectedEvent.end}<br/>建立者：${selectedEvent.created_user}<br/>全日：${selectedEvent.timed}`"></span>
                    </v-card-subtitle>
                    <v-card-text v-if="selectedEvent.event_category_id">
                      <span v-html="`事件等級：${selectedEvent.event_level_name}<br/>事件類別：${selectedEvent.event_category_name}<br/>事件範圍：${this.selectedEvent.items.map(x=>x.name).join()}`"></span>
                      <div style="white-space: pre-wrap;" v-html="`事件內容：${selectedEvent.content}`"></div>
                    </v-card-text>
                    <v-card-actions class="ml-2 pb-2">
                      <v-btn @click="openedit('edit')" class="btn-secondary">
                        <v-icon>mdi-pencil</v-icon>編輯
                      </v-btn>
                      <v-btn @click="deleteEvent(selectedEvent.id)" class=" btn-secondary delete">
                        <v-icon>mdi-trash-can</v-icon>刪除
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-sheet>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <span>
                資料範圍：「場→可顯示場、區、池事件」、「區→可顯示區、池事件」、「池→可顯示池事件」
              </span>
            </v-col>
          </v-row>
          <v-card width="100%" min-height="600px" v-if="false">
            <iframe
              src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=Asia%2FTaipei&amp;src=Y19xNmpmMHNlYW1ncjk5bnF0bnRrOTQ4czM0a0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%239E69AF&amp;showTitle=0&amp;showNav=1&amp;showDate=1&amp;showPrint=0&amp;showTabs=1&amp;showCalendars=0&amp;showTz=1"
              style="border:solid 1px #777;"
              width="100%"
              height="600"
              frameborder="0"
              scrolling="no"
            ></iframe>
          </v-card>
        </div>
      </div>
    </v-card>
    <!-- 飼料表事件 -->
    <v-dialog v-model="dialog.eventSet" width="500px">
      <v-form ref="eventSetform" v-model="eventSetvalid" lazy-validation>
        <v-card class="custom-dialog">
          <v-card-title class="add-title">
            <div class="d-inline-block">
              飼料表事件設定
            </div>
            <div class="add">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="dialog.eventSet = false">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="basic pl-2 pt-2">
              <!-- 選擇事件 -->
              <v-card-text class="flex-align-center mb-3">
                <v-autocomplete class="reload" v-model="eventSetList" label="選擇事件進行編輯" filled dense :items="eventSetData" item-text="title" item-value="id" clearable @change="eventSetChange">
                  <v-btn slot="append" class="btn-icon just-icon" @click="eventSetGet"><v-icon style="font-size: 1.3rem;">mdi-reload</v-icon></v-btn>
                  <!-- <v-tooltip bottom slot="append">
                    <template v-slot:activator="{ on, attrs }">
                        <button class="btn-icon just-icon" @click="eventSetGet" v-bind="attrs" v-on="on">
                          <v-icon style="font-size: 24px;">mdi-reload</v-icon>
                        </button>
                    </template>
                    <span>重新整理</span>
                  </v-tooltip> -->
                </v-autocomplete>
                
                <!-- <v-btn v-if="eventSet.mode=='add'" tile class="btn-secondary green" @click="eventSet_isEdit = !eventSet_isEdit">新增</v-btn>
                <v-btn v-else tile class="btn-secondary" @click="eventSet_isEdit = !eventSet_isEdit">編輯</v-btn> -->
              </v-card-text>
              <!-- 事件等級/類型 -->
              <v-card-text class="flex-align-center">
                <v-autocomplete
                  dense
                  :items="eventLevelData"
                  item-text="name_ch"
                  item-value="id"
                  v-model="eventSet.event_level_id"
                  label="事件等級"
                >
                  <!-- <template slot="prepend"
                    ><span style="width:70px;">事件等級</span></template
                  > -->
                </v-autocomplete>
                <v-autocomplete
                  dense
                  :rules="rules.require"
                  :items="eventCategoryData"
                  item-text="name_ch"
                  item-value="id"
                  v-model="eventSet.event_category_id"
                  label="事件類型"
                >
                  <!-- <template slot="prepend"
                    ><span style="width:70px;">事件類型</span></template
                  > -->
                </v-autocomplete>
              </v-card-text>
              <!-- 標題 -->
              <v-card-text class="flex-align-center">
                <v-text-field v-model="eventSet.title" dense filled clearable :rules="rules.require" label="標題">
                  <!-- <span slot="prepend" style="width:70px;">標題</span> -->
                </v-text-field>
              </v-card-text>
              <!-- 內容 -->
              <v-card-text class="flex-align-center">
                <v-textarea v-model="eventSet.content" placeholder="內容" class="text-area" outlined :rules="rules.require">
                  <!-- <span slot="prepend" style="width:70px;">內容</span> -->
                </v-textarea>
              </v-card-text>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="eventSet.mode=='add'" tile class="btn-secondary" @click="dialog.eventSet = false">取消</v-btn>
            <v-btn v-if="eventSet.mode=='add'" tile class="btn-primary" @click="eventSetAdd">新增</v-btn>
            
            <span v-else>
              <v-btn tile  class="btn-primary" @click="eventSetEdit">確認修改</v-btn>
              <v-btn tile  class="btn-secondary delete" @click="eventSetDel">刪除</v-btn>
            </span>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- 日曆事件 -->
    <v-dialog v-model="dialog.add" width="500px">
      <v-form ref="editform" v-model="addvalid" lazy-validation>
        <v-card class="custom-dialog">
          <v-card-title class="add-title">
            <div class="d-inline-block">
              {{(edited.mode=="add")?"新增":"編輯"}}紀事
            </div>
            <div class="add">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="dialog.add = false">
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
                  <!-- <font style="background-color:#E539;color:white;"></font><br/>
                  <font style="background-color:#00AC;color:white;"></font><br/>
                  <font style="background-color:#7575;color:white;"></font><br/> -->
                </span>
              </v-card-text>
              <v-card-text class="flex-align-center">
                <v-text-field v-model="edited.title" dense filled clearable :rules="rules.require" label="標題">
                  <!-- <span slot="prepend" style="width:70px;">標題</span> -->
                </v-text-field>
              </v-card-text>
              <v-card-text class="flex-align-center">
                <v-textarea class="text-area" placeholder="內容" v-model="edited.content" outlined :rules="rules.require">
                  <!-- <span slot="prepend" style="width:70px;">內容</span> -->
                </v-textarea>
              </v-card-text>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="dialog.add = false">取消</v-btn>
            <v-btn class="btn-primary" @click="editsubmit(edited.mode)">確認</v-btn>
          </v-card-actions>
          
        </v-card>
      </v-form>
    </v-dialog>

  </div>
</template>

<script>
import _ from "lodash";
import dayjs from "dayjs";
// import axios from '~/plugins/axios';
export default {
  layout: "emptynologin2",
  middleware: "auth",
  head(){
    return{
      title:'重要紀事'
    }
  },
  data() {
    return {
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days"
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      //dialog
      dialog: {
        add: false,
        eventSet:false,//飼料表事件
      },
      addvalid:true,
      // events: [],
      eventsData: [
        {
          id: 2,
          started_date: "2022-01-01",
          ended_date: "2022-01-02",
          factory_id: [1],
          pond_area_id: [1],
          pond_id: [1, 2, 3],
          data_col_id: [1, 2],
          event_level_id: 1,
          event_level_name: "重要",
          event_category_id: 4,
          event_category_name: "緊急發生",
          color: "#FF0000",
          title: "停電(local test)",
          content: "變電箱故障",
          is_all_day: true,
          created_user: "技術部-王前驊",
          created_time: "2022-01-04 11:00:00",
          items:[]
        }
      ],
      colors: [
        "grey darken-1",//#7575
        "red darken-1",//#E539
        "cyan darken-1",//#00AC
        "teal darken-1",
        "indigo darken-2",
        "deep-purple darken-2",
        "green darken-2",
        "blue-grey darken-1"
      ],
      names: [
        "不重要",
        "重要",
        "一般",
        "PTO",
        "Travel",
        "Event",
        "Birthday",
        "Conference",
        "Party",
        "停電"
      ],
      //資料範圍
      datarange: [
        { level: 1, name: "場" },
        { level: 2, name: "區" },
        { level: 3, name: "池" }
      ],
      level: 1,
      //treeselect
      poolid: [], //可預設場，例：研發一場_1 
      maindata: [],
      //起訖日
      sdate: dayjs(new Date())
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      edate: new Date().toISOString().substr(0, 10),
      menu_startdate: false,
      menu_enddate: false,
      //edited event
      edited:{
        mode:"add",//add,edit
        level:1,//範圍
        poolid:[],//範圍id，
        started_date:undefined,
        ended_date:undefined,
        stime:"00:00",
        etime:"00:00",
        factory_id:[],//場id
        pond_area_id:[],//區域id
        pond_id:[],//池id
        event_level_id:3,//事件等級
        event_category_id:undefined,//事件類型id
        title:"",
        content:"",
        is_all_day:true,
        created_user:"",
      },
      menu_edit_sdate:false,
      menu_edit_edate:false,
      eventLevelData:[],//警戒等級
      eventCategoryData:[],//事件類型
      rules: { require: [v => !!v || "*必要項目"] },
      //飼料表事件設定
      eventSetvalid:true,
      eventSet:{
        mode:"add",
        event_level_id:3,//事件等級
        event_category_id:undefined,//事件類型id,
        title:"",
        content:"",
      },
      eventSetData:[],
      eventSetList:"",
      eventSet_isEdit:false,
      isLoading: false,
    };
  },
  async mounted() {
    this.isLoading = false;
    this.$refs.calendar.checkChange();
    //取得整場架構資料
    await this.getMainData();
    //取得警戒等級
    await this.getEventLevelData();
    //取得事件類型
    await this.getEventCategoryData();
    this.isLoading = true;
  },
  methods: {
    //清單-刪除
    eventSetDel:async function(){
      var id = this.eventSet.id;
      var res = false;
      res = await this.deleteFeedEventList(id);
      setTimeout(()=>{
          if(res) {
            this.eventSet = {mode:'add'};
            this.eventSet_isEdit = false;
          }
      },50)
      // await this.$axios
      //     .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-event-settings/${id}/`)
      //     .then(res => {
      //       if (res.data=="刪除成功") {
      //         this.eventSet = {mode:'add'};
      //         this.eventSet_isEdit = false;
      //         this.$toast.success(`刪除成功`, { duration: 2000 });
      //       }else{
      //         this.$toast.error(`資料刪除失敗:${res.data}`, { duration: 2000 });
      //       }
      //       console.log("飼料表設定-刪除 api:", res.request.responseURL);
      //     })
      //     .catch(err => {
      //       debugger;
      //       this.$toast.error(`資料刪除失敗:${err.message}`, { duration: 2000 });
      //     });
          this.eventSetGet();
    },
    //清單-修改
    eventSetEdit:async function(){
      var parm = {
        title:this.eventSet.title,
        content:this.eventSet.content,
        event_category_id:this.eventSet.event_category_id,
        event_level_id:this.eventSet.event_level_id,
        updated_user:this.$auth.$state.user.email
      }
      var id = this.eventSet.id;
      var res = false;
      res = await this.patchFeedEventList(parm,id);
      setTimeout(()=>{
          if(res) {
              this.dialog.seedForm = false;
              this.getSeedlingData();//取得苗清單
          }
      },50)
      // await this.$axios
      //     .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-event-settings/${id}/`,parm)
      //     .then(res => {
      //       if (res.data=="修改成功") {
      //         this.$toast.success(`修改成功`, { duration: 2000 });
      //       }else{
      //         this.$toast.error(`資料修改失敗:${res.data}`, { duration: 2000 });
      //       }
      //       console.log("飼料表設定-修改 api:", res.request.responseURL);
      //     })
      //     .catch(err => {
      //       debugger;
      //       this.$toast.error(`資料修改失敗:${err.message}`, { duration: 2000 });
      //     });
          this.eventSet = {mode:'add'};
          this.eventSetList = null;
          this.eventSet_isEdit = false;
          this.eventSetGet();
    },
    // 清單-change select
    eventSetChange:function(){
      this.eventSet.mode = (this.eventSetList==null)?"add":"edit";
      if(this.eventSet.mode=="edit"){
        var data = this.eventSetData.filter(x=>x.id==this.eventSetList)[0];
        this.eventSet.id = data.id;
        this.eventSet.title = data.title;
        this.eventSet.content = data.content;
        this.eventSet.event_category_id = data.event_category_id;
        this.eventSet.event_level_id = data.event_level_id;
      }else{
        this.eventSet = {mode:'add'};
      }

    },
    // 飼料表設定-清單
    eventSetGet:async function(){
      let getFeedEventList = await this.getFeedEventList();
      let data = typeof (getFeedEventList)=='string'?[]:getFeedEventList;
      this.eventSetData = data;
      // await this.$axios
      //     .get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-event-settings/`)
      //     .then(res => {
      //       this.eventSetData = res.data;
      //       console.log("飼料表設定-清單 api:", res.request.responseURL);
      //     })
      //     .catch(err => {
      //       this.$toast.error(`飼料表設定-清單 失敗:${err.message}`, { duration: 2000 });
      //     });
    },
    // 飼料表設定-新增
    eventSetAdd:async function(){
      var parm = Object.assign({},this.eventSet) ;
      const user = this.$auth.$state.user.email;
      delete parm.mode;
      parm.created_user = user;
      var res = false;
      res = await this.postFeedEventList(parm);
      setTimeout(()=>{
          if(res) {
            this.eventSet = {mode:'add'};
            this.eventSetList = null;
            this.eventSet_isEdit = false;
            this.eventSetGet();
          }
      },50)
      // await this.$axios
      //     .post(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-event-settings/`,parm)
      //     .then(res => {
      //       if (res.data=="新增成功") {
      //         this.eventSet = {mode:'add'};
      //         this.eventSetList = null;
      //         this.eventSet_isEdit = false;
      //         this.eventSetGet();
      //         this.$toast.success(`新增成功`, { duration: 2000 });
      //       }else{
      //         this.$toast.error(`資料新增失敗:${res.data}`, { duration: 2000 });
      //       }
      //       console.log("飼料表設定-新增 api:", res.request.responseURL);
      //     })
      //     .catch(err => {

      //       this.$toast.error(`資料新增失敗:${err.message}`, { duration: 2000 });
      //     });
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    getNowTime: function() {
      let mytime = dayjs().format("HH:mm");
      return mytime;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange: async function({ start, end }) {
      this.sdate = start.date;
      this.edate = end.date;
      console.log("updateRange!!!");
      console.log("sdate",this.sdate);
      console.log("edate",this.edate);
      await this.getEventData();
      // const events = [];
      // const min = new Date(`${start.date}T00:00:00`);
      // const max = new Date(`${end.date}T23:59:59`);
      // const days = (max.getTime() - min.getTime()) / 86400000;
      // const eventCount = this.rnd(days, days + 20);
      // for (let i = 0; i < eventCount; i++) {
      //   const allDay = this.rnd(0, 3) === 0;
      //   const firstTimestamp = this.rnd(min.getTime(), max.getTime());
      //   const first = new Date(firstTimestamp - (firstTimestamp % 900000));
      //   const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
      //   const second = new Date(first.getTime() + secondTimestamp);
      //   var pushdata = {
      //     name: this.names[this.rnd(0, this.names.length - 1)],
      //     start: first,
      //     end: second,
      //     color: this.colors[this.rnd(0, this.colors.length - 1)],
      //     timed: !allDay
      //   };
      //   events.push(pushdata);
      // }
      // this.events = events;
    },
    // rnd(a, b) {
    //   return Math.floor((b - a + 1) * Math.random()) + a;
    // }
    rangechange: function() {
      // var data = this.setNestedDisabled(this.maindata, "",this.level);
      // this.maindata = data;
      this.poolid = null;
      this.edited.poolid=null;
    },
    setNestedDisabled: function(obj, name, onlyshowlevel = 1) {
      //全部都設成disabled
      var deleteindex =[];
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
      for (var i = deleteindex.length -1; i >= 0; i--)
          {
            objj.splice(deleteindex[i],1);
          }
      return objj;
    },
    getMainData: async function() {
      let reqid = this.poolid;
      let getedItem = {};
      //取得整場架構資料
      //visible寫死名稱含^=false，寫死池的狀態=無=false
      let architectureData = await this.getArchitecture();
      this.maindata = typeof (architectureData)=='string'?[]:architectureData;
      var data = this.setNestedDisabled(
        _.cloneDeep(this.maindata),
        "",
        this.level
      );
      this.maindata = data;
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
      //   .then(res => {
      //     this.maindata = res.data;
      //     var data = this.setNestedDisabled(
      //       _.cloneDeep(this.maindata),
      //       "",
      //       this.level
      //     );
      //     this.maindata = data;
      //   })
      //   .catch(error=>{
      //     this.$toast.error(`資料取得失敗:${error.message}`, { duration: 2000 });
      //   });
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
    nestedMain: function(obj, level) {
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
    getEventData: async function() {
      this.isLoading = false;
      var parms = {};
      
      this.eventsData.splice(0,this.eventsData.length);
      // started_date=2022-01-01&ended_date=2022-01-04
      parms.started_date = this.sdate;
      parms.ended_date = this.edate;
      switch (this.level) {
        case 1:
          parms.factory_id = this.poolidcpd.join();
          if (parms.factory_id == "") {
            this.isLoading = true;
            return;
          }
          break;
        case 2:
          parms.pond_area_id = this.poolidcpd.join();
          break;
        case 3:
          parms.pond_id = this.poolidcpd.join();
          break;
      }
      let getEventList = await this.getEventList(parms);
      let data = typeof (getEventList)=='string'?[]:getEventList;
      this.eventsData = data;
      this.isLoading = true;
      if (this.eventsData.length==0) {
          this.$toast.success(`查無資料`, { duration: 2000 });
      }
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/event/`, {
      //     params: parms
      //   })
      //   .then(res => {
      //     this.eventsData = res.data;
      //     if (res.data.length==0) {
      //        this.$toast.success(`查無資料`, { duration: 2000 });
      //     }
          
      //     console.log("parms:",parms);
      //     console.log("event api:", res.request.responseURL);
      //   })
      //   .catch(err => {
      //     this.$toast.error(`資料取得失敗:${err.message}`, { duration: 2000 });
      //   });
    },
    //取得警戒等級
    getEventLevelData:async function(){
      let getEventLevelList = await this.getEventLevelList();
      let data = typeof (getEventLevelList)=='string'?[]:getEventLevelList;
      this.eventLevelData = data;
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/event-level/`)
      //   .then(res => {
      //     this.eventLevelData = res.data;

      //     console.log("event api:", res.request.responseURL);
      //   })
      //   .catch(err => {
      //     this.$toast.error(`資料取得失敗:${err.message}`, { duration: 2000 });
      //   });
    
    },
    //取得事件類型
    getEventCategoryData:async function(){
      let getEventCatagoryList = await this.getEventCatagoryList();
      let data = typeof (getEventCatagoryList)=='string'?[]:getEventCatagoryList;
      this.eventCategoryData = data;
      this.isLoading = true;
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/event-category/`)
      //   .then(res => {
      //     this.eventCategoryData = res.data;

      //     console.log("event api:", res.request.responseURL);
      //   })
      //   .catch(err => {
      //     this.$toast.error(`資料取得失敗:${err.message}`, { duration: 2000 });
      //   });
    },
    //打開紀事(新增)
    openedit:function(mode){
      this.edited = {
        mode:mode,//add,edit
        level:1,//範圍
        poolid:[],//範圍id
        started_date:undefined,
        ended_date:undefined,
        stime:"00:00",
        etime:"00:00",
        factory_id:[],//場id
        pond_area_id:[],//區域id
        pond_id:[],//池id
        event_level_id:3,//事件等級
        event_category_id:undefined,//事件類型id
        title:"",
        content:"",
        is_all_day:true,
        created_user:"",
      }
      if (mode=="add") {
        if (this.$refs.editform != undefined) {
          // this.$refs.editform.reset();
        }
        this.dialog.add=true;
        
      }
      if(mode=="edit"){
        const updUser = this.$auth.$state.user.email;
        console.log("",this.selectedEvent);
        this.edited = {
        mode:mode,//add,edit
        id:this.selectedEvent.id,//edit的話就有id
        level:this.selectedEvent.level,//選中的範圍
        poolid:this.selectedEvent.items.map(x=>(this.selectedEvent.level==1)?x.name + '_' + x.id:this.selectedEvent.level==2?x.name.split(' ')[x.name.split(' ').length-1]+'_'+x.id:x.id),//範圍id
        started_date:this.selectedEvent.start.substr(0,10),
        ended_date:this.selectedEvent.end.substr(0,10),
        stime:(this.selectedEvent.timed)?'00:00':this.selectedEvent.start.substr(-8,5),
        etime:(this.selectedEvent.timed)?'00:00':this.selectedEvent.end.substr(-8,5),
        factory_id: [],//場id
        pond_area_id:[],//區域id
        pond_id:[],//池id
        event_level_id:Number(this.selectedEvent.event_level_id),//事件等級
        event_category_id:Number(this.selectedEvent.event_category_id),//事件類型id
        title:this.selectedEvent.name,
        content:this.selectedEvent.content,
        is_all_day:this.selectedEvent.timed,
        created_user:updUser,
      }
        this.dialog.add=true;
      }
    },
    //送出事件
    editsubmit:async function(mode){
      let valid = this.$refs.editform.validate();
      if (this.edited.poolid.length==0) {
        this.$toast.error(`您尚未選擇資料範圍`, { duration: 2000 }); return;
      }
      if (valid) {
        const updUser = this.$auth.$state.user.email;
        if (mode=="add") {
          var parm = {
            started_date: `${this.edited.started_date} ${(this.edited.is_all_day)?'00:00':this.edited.stime}:00`,
            ended_date: `${this.edited.ended_date} ${(this.edited.is_all_day)?'00:00':this.edited.etime}:00`,
            factory_id: (this.edited.level==1)?this.poolidcpd_edited:null,//去除_前面的例：[研發一場_1]
            pond_area_id: (this.edited.level==2)?this.poolidcpd_edited:null,
            pond_id: (this.edited.level==3)?this.poolidcpd_edited:null,
            event_level_id: this.edited.event_level_id,
            event_category_id: this.edited.event_category_id,
            title: this.edited.title,
            content: this.edited.content,
            is_all_day: this.edited.is_all_day,
            created_user: updUser
          };
          var res = false;
          res = await this.postEventList(parm);
          setTimeout(()=>{
              if(res) {
                this.dialog.add = false;
              }
          },50)
          // await this.$axios
          // .post(`${this.$store.state.mydata.gobal_api.apiUrl}/event/`,parm)
          // .then(res => {
          //   if (res.data=="新增成功") {
          //     this.dialog.add = false;
          //     this.$toast.success(`新增成功`, { duration: 2000 });
          //   }else{
          //     console.log("parm:",parm);
          //     console.log("res:",res);

          //     this.$toast.error(`資料新增失敗:${res.data}`, { duration: 2000 });
          //   }
          //   console.log("event api:", res.request.responseURL);
          // })
          // .catch(err => {
          //   console.log("parm:",parm);
          //   this.$toast.error(`資料新增錯誤:${err.message}`, { duration: 2000 });
          // });
          this.getEventData();//更新畫面資料
         }
        if (mode=="edit") {
          var parm = {
            started_date: `${this.edited.started_date} ${(this.edited.is_all_day)?'00:00':this.edited.stime}:00`,
            ended_date: `${this.edited.ended_date} ${(this.edited.is_all_day)?'00:00':this.edited.etime}:00`,
            factory_id: (this.edited.level==1)?this.poolidcpd_edited:null,//去除_前面的例：[研發一場_1]
            pond_area_id: (this.edited.level==2)?this.poolidcpd_edited:null,//this.edited.poolid
            pond_id: (this.edited.level==3)?this.edited.poolid:null,//this.edited.poolid
            event_level_id: this.edited.event_level_id,
            event_category_id: this.edited.event_category_id,
            title: this.edited.title,
            content: this.edited.content,
            is_all_day: this.edited.is_all_day,
            updated_user: updUser
          };
          var id = this.edited.id;
          var res = false;
          res = await this.patchEventList(parm,id);
          setTimeout(()=>{
            if(res) {
              this.dialog.add = false;
              this.selectedOpen = false;
              this.selectedEvent.start = parm.started_date;
              this.selectedEvent.end = parm.ended_date;
              this.selectedEvent.created_user = this.$auth.$state.user.name;
              this.selectedEvent.event_level_id = parm.event_level_id;
              this.selectedEvent.event_category_id= parm.event_category_id;
              this.selectedEvent.title = parm.title;
              this.selectedEvent.content = parm.content;
              this.selectedEvent.is_all_day = parm.is_all_day;
              this.selectedEvent.stime = `${(this.edited.is_all_day)?'00:00':this.edited.stime}`;
              this.selectedEvent.etime = `${(this.edited.is_all_day)?'00:00':this.edited.etime}`;
            }
          },50)
          // await this.$axios
          // .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/event/${this.edited.id}/`,parm)
          // .then(res => {
          //   if (res.data=="修改成功") {
          //     this.dialog.add = false;
          //     this.selectedOpen = false;
          //     this.selectedEvent.start = parm.started_date;
          //     this.selectedEvent.end = parm.ended_date;
          //     this.selectedEvent.created_user = this.$auth.$state.user.name;
          //     this.selectedEvent.event_level_id = parm.event_level_id;
          //     this.selectedEvent.event_category_id= parm.event_category_id;
          //     this.selectedEvent.title = parm.title;
          //     this.selectedEvent.content = parm.content;
          //     this.selectedEvent.is_all_day = parm.is_all_day;
          //     this.selectedEvent.stime = `${(this.edited.is_all_day)?'00:00':this.edited.stime}`;
          //     this.selectedEvent.etime = `${(this.edited.is_all_day)?'00:00':this.edited.etime}`;
          //     this.$toast.success(`修改成功`, { duration: 2000 });
          //   }else{
          //     this.$toast.error(`資料修改失敗:${res.data}`, { duration: 2000 });
          //   }
          //   console.log("event api:", res.request.responseURL);
          // })
          // .catch(err => {
          //   this.$toast.error(`資料修改失敗:${err.message}`, { duration: 2000 });
          // });
          this.getEventData();//更新畫面資料
        }
      }
    },
    //刪除事件
    deleteEvent:async function(id){
      if (confirm(`是否刪除?[會刪除所有事件範圍：${this.selectedEvent.items.map(x=>x.name).join()}]`)==false) {
        return;
      }
      var res = false;
      res = await this.deleteEventList(id);
      setTimeout(()=>{
          if(res) {
            this.selectedOpen = false;
          }
          this.getEventData();//更新畫面資料
      },50)
      // await this.$axios
      //   .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/event/${id}`)
      //   .then(res => {
      //     if (res.data=="刪除成功") {
      //       this.selectedOpen = false;
      //       this.$toast.success(`刪除成功`, { duration: 2000 });
      //     }else{
      //       this.$toast.error(`資料刪除失敗:${res.data}`, { duration: 2000 });
      //     }
      //     this.getEventData();//更新畫面資料
      //     console.log("event api:", res.request.responseURL);
      //   })
      //   .catch(err => {
      //     this.$toast.error(`資料刪除失敗:${err.message}`, { duration: 2000 });
      //   });
    },

    // addEventData:async function(){
    //   await this.$axios
    //           .post(`${this.$store.state.mydata.gobal_api.apiUrl}/event/`,parm)
    //           .then(res => {
    //             if (res.data=="新增成功") {
    //               this.$toast.success(`新增成功`, { duration: 2000 });
    //             }else{
    //               this.$toast.error(`資料新增失敗:${res.data}`, { duration: 2000 });
    //             }
    //             console.log("event api:", res.request.responseURL);
    //           })
    //           .catch(err => {
    //             this.$toast.error(`資料新增失敗:${err.message}`, { duration: 2000 });
    //           });
    // }
  },
  computed: {
    events: function() {
      var dataa = this.eventsData;
      let tempArray = [];
      dataa.forEach(ele => {
        var item = {
          id:ele.id,
          level:ele.level,
          name: ele.title,
          start: (ele.is_all_day)?ele.started_date.substr(0,10):ele.started_date,
          end: (ele.is_all_day)?ele.ended_date.substr(0,10):ele.ended_date,
          // color: this.colors[this.rnd(0, this.colors.length - 1)],
          color: ele.color,
          // color:
          //   this.names.indexOf(ele.event_level_name) > this.colors.length ||
          //   this.names.indexOf(ele.event_level_name) == -1
          //     ? this.colors[0]
          //     : this.colors[this.names.indexOf(ele.event_level_name)],
          timed: ele.is_all_day,
          content: `${ele.content}`,
          event_level_id: `${ele.event_level_id}`,
          event_level_name: `${ele.event_level_name}`,
          created_user: `${ele.created_user}`,
          event_category_id: `${ele.event_category_id}`,
          event_category_name: `${ele.event_category_name}`,
          items: ele.items
        };
        tempArray.push(item);
      });

      return tempArray;
    },
    maindatacpd: function() {
      var data = _.cloneDeep(this.maindata);
      if(this.level==3) {
        this.maindata.forEach(main=>{
          main.node.forEach(child=>{
            let children = [];
            child.node.forEach(c=>{
              if(c.visible) {
                children.push(c);
              }
            })
            child.node = children;
          })
        })
        data = _.cloneDeep(this.maindata);
      }
      return this.nestedMain(data, this.level);
    },
    maindatacpd_edited: function() {
      var data = _.cloneDeep(this.maindata);
      return this.nestedMain(data, this.edited.level);
    },
    poolidcpd: function() {
      //重組選到的id，去除_線
      var poolid = this.poolid;
      var poolidreg = [];
      if (!this.poolid) {
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
    },
    poolidcpd_edited: function() {
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
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .select-template.vue-treeselect .vue-treeselect__multi-value-label,
  .select-template.vue-treeselect .vue-treeselect__multi-value-label div {
    line-height: 0;
  }
  .select-template .vue-treeselect__control .vue-treeselect__placeholder::before,
  .select-template .vue-treeselect__control .vue-treeselect__placeholder::after {
    content: '';
  }
  .select-template.vue-treeselect .vue-treeselect__multi-value-label {
    font-size: 0.65rem;
  }
  .select-template .vue-treeselect__control .vue-treeselect__placeholder {
    font-size: 1rem;
  }
  .v-toolbar__content {
    padding: 0;
  }
  .v-textarea.v-text-field--enclosed.text-area .v-text-field__slot textarea,
  .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined.text-area .v-input__prepend-inner {
    margin-left: 8px;
  }
  .v-dialog .v-sheet.v-card.custom-dialog .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo) .v-input__append-inner,
  .v-dialog .v-sheet.v-card.custom-dialog .v-input--is-label-active.v-text-field--filled:not(.v-text-field--single-line) input {
    margin-top: 0;
    padding-top: 0;
  }
  .v-text-field.v-input--is-focused .v-input__icon--clear {
    padding-top: 8px;
  }
  .v-dialog .v-sheet.v-card.custom-dialog .v-input {
    margin-top: 0;
  }
}
</style>
