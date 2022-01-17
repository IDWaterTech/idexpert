<template>
  <div>
    <v-row class="fill-height">
      <v-col cols="12" class="white--text"><h2>重要紀事</h2></v-col>
      <v-col cols="12">
        <v-row align-content="center">
          <v-col cols="12" sm="3">
            <v-autocomplete
              auto-select-first
              dark
              dense
              outlined
              :items="datarange"
              item-text="name"
              item-value="level"
              v-model="level"
              @change="rangechange"
            >
              <template slot="prepend"
                ><span style="width:70px;">資料範圍</span></template
              >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="3">
            <treeselect
              v-model="poolid"
              :options="maindatacpd"
              :default-expand-level="1"
              :disable-branch-nodes="true"
              children="node"
              :multiple="true"
              :normalizer="
                node => {
                  return { children: node.node };
                }
              "
              style="font-size:1.2em;"
            >
              <div slot="value-label" slot-scope="{ node }">
                {{
                  `${
                    node.raw.parent != undefined && node.raw.parent.length > 0
                      ? node.raw.parent + "_"
                      : ""
                  }${node.raw.name}`
                }}
              </div>
              <div slot="option-label" slot-scope="{ node }">
                {{ `${node.raw.name}` }}
              </div>
            </treeselect>
          </v-col>
          <!-- 起日 -->
          <v-col cols="12" sm="2" v-show="false">
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
                  dense
                  dark
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
          <!-- 訖日 -->
          <v-col cols="12" sm="2" v-show="false">
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
                  dense dark :disabled="true"
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
          <v-col cols="12" sm="2">
            <v-btn
              tile
              dark
              color="primary"
              :disabled="!poolidcpd || poolidcpd.length == 0"
              @click="getEventData"
              >確認</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
      <!-- 日曆 -->
      <v-col cols="12">
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              今天
            </v-btn>
            <!-- 新增紀事 -->
            <v-btn icon large @click="dialog.add=true"><v-icon>mdi-calendar-plus</v-icon>新增</v-btn>
            <v-dialog v-model="dialog.add" width="500px">
              <v-form ref="mainform" v-model="addvalid" lazy-validation>
                <v-card >
                  <v-card-title class="cardtitle" style="color:white;">新增紀事</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    test
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="primary" dark tile>新增</v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="type" group color="mainbg">
              <v-btn value="day">日</v-btn>
              <v-btn value="week">週</v-btn>
              <v-btn value="month">月</v-btn>
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
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
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
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="`[${selectedEvent.event_level_name}]_${selectedEvent.name}`"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-subtitle v-if="selectedEvent.start">
                <span v-html="`起：${selectedEvent.start}<br/>訖：${selectedEvent.end}<br/>建立者：${selectedEvent.created_user}<br/>全日：${selectedEvent.timed}`"></span>
              </v-card-subtitle>
              <v-card-text v-if="selectedEvent.event_category_id">
                <span v-html="`事件等級：${selectedEvent.event_level_name}<br/>事件類別：${selectedEvent.event_category_name}<br/>事件範圍：${this.selectedEvent.items.map(x=>x.name).join()}`"></span>
                <div v-html="`事件內容：${selectedEvent.content}`"></div>
              </v-card-text>
              <v-card-actions>
                <v-btn :color="selectedEvent.color" dark tile @click="selectedOpen = false">
                  關閉
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
    <v-card width="100%" min-height="600px" v-if="false">
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=Asia%2FTaipei&amp;src=Y19xNmpmMHNlYW1ncjk5bnF0bnRrOTQ4czM0a0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%239E69AF&amp;showTitle=0&amp;showNav=1&amp;showDate=1&amp;showPrint=0&amp;showTabs=1&amp;showCalendars=0&amp;showTz=1"
        style="border:solid 1px #777"
        width="100%"
        height="600"
        frameborder="0"
        scrolling="no"
      ></iframe>
    </v-card>
  </div>
</template>

<script>
import _ from "lodash";
import dayjs from "dayjs";
export default {
  layout: "emptynologin",
  // middleware: "auth",
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
          title: "停電",
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
        { level: 1, name: "廠" },
        { level: 2, name: "區" },
        { level: 3, name: "池" }
      ],
      level: 1,
      //treeselect
      poolid: ["研發一廠_1"],
      maindata: [],
      //起訖日
      sdate: dayjs(new Date())
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      edate: new Date().toISOString().substr(0, 10),
      menu_startdate: false,
      menu_enddate: false
    };
  },
  async mounted() {
    this.$refs.calendar.checkChange();
    //取得整廠架構資料
    await this.getMainData();
  },
  methods: {
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
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
      // this.sdate = start.date;
      // this.edate = end.date;
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
      //取得整廠架構資料
      //visible寫死名稱含^=false，寫死池的狀態=無=false
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
        .then(res => {
          this.maindata = res.data;
          var data = this.setNestedDisabled(
            _.cloneDeep(this.maindata),
            "",
            this.level
          );
          this.maindata = data;
        })
        .catch(error=>{
          this.$toast.error(`資料取得失敗:${error.message}`, { duration: 2000 });
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
      var parms = {};
      // started_date=2022-01-01&ended_date=2022-01-04
      parms.started_date = this.sdate;
      parms.ended_date = this.edate;
      switch (this.level) {
        case 1:
          parms.factory_id = this.poolidcpd.join();
          break;
        case 2:
          parms.pond_area_id = this.poolidcpd.join();
          break;
        case 3:
          parms.pond_id = this.poolidcpd.join();
          break;
      }
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/event/`, {
          params: parms
        })
        .then(res => {
          this.eventsData = res.data;
          if (res.data.length==0) {
             this.$toast.success(`查無資料`, { duration: 2000 });
          }
          console.log("event api:", res.request.responseURL);
        })
        .catch(err => {
          this.$toast.error(`資料取得失敗:${err.message}`, { duration: 2000 });
        });
    }
  },
  computed: {
    events: function() {
      var dataa = this.eventsData;
      let tempArray = [];
      dataa.forEach(ele => {
        var item = {
          name: ele.title,
          start: (ele.is_all_day)?ele.started_date.substr(0,10):ele.started_date,
          end: (ele.is_all_day)?ele.ended_date.substr(0,10):ele.started_date,
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
      return this.nestedMain(data, this.level);
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
    }
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
  }
};
</script>

<style scoped></style>
