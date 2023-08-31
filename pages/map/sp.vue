<template>
  <div>
    <v-row >
      <v-col
        cols="12" v-if="false"
        class="grey lighten-2 text-center road"
        style="font-size:1.2em;"
        >中央走道</v-col
      >
      <v-col cols="12">
        <v-row  class="mx-0">
          <!-- A -->
          <v-col v-for="item in Object.keys(pools).filter(x=>x=='A')" cols="2" :key="item"  class="mx-0">
            <v-row>
              <v-col
                :class="`${windowWidth < 700 ? 'text-center block' : 'text-center mx-3 my-1 block'}`"
                :style="itm.state == '無'
                    ? ''
                    : itm.state.length > 0
                      ? `background:${getItemColor(itm.state)}`
                      : `background:${getItemColor(itm.state)};`
                  "
                v-for="(itm, idx) in pools[item]"
                :key="idx" cols="12"
                  >
                   <mappoolelement
                    :item="itm"
                    :selitem="statcolor.filter(x => !['default', ''].includes(x.name))
                      "
                    :showSelect="showedit"
                    :myuser="$auth.$state.user
                      ? $auth.$state.user.email
                      : ''
                      "
                    :successDataID="successDataID"
                    @editPool="edit($event)"
                    @saveSuccess="saveDelete($event)"
                  ></mappoolelement>
                </v-col>
            </v-row>
          </v-col>
          <!-- B -->
          <v-col v-for="item in Object.keys(pools).filter(x=>x=='B')" cols="10" :key="item"  class="mx-0 pl-5 colspan">
            <v-row>
              <v-col
                :class="`${windowWidth < 700 ? 'text-center block' : 'text-center mx-3 my-1 block'}`"
                :style="itm.state == '無'
                    ? ''
                    : itm.state.length > 0
                      ? `background:${getItemColor(itm.state)};`
                      : `background:${getItemColor(itm.state)};`
                  "
                v-for="(itm, idx) in pools[item]"
                :key="idx" cols="2"
                  >
                   <mappoolelement
                  :item="itm"
                  :selitem="statcolor.filter(x => !['default', ''].includes(x.name))
                    "
                  :showSelect="showedit"
                  :myuser="$auth.$state.user
                    ? $auth.$state.user.email
                    : ''
                    "
                  :successDataID="successDataID"
                  @editPool="edit($event)"
                  @saveSuccess="saveDelete($event)"
                ></mappoolelement>
                </v-col>
            </v-row>
          </v-col>

        </v-row>

        </v-col>
      <v-col
        cols="12"
        class="text-right last-update"
        >最後更新時間：{{ MaxDate }}</v-col
      >
    </v-row>
  </div>
</template>

<script>
import mappoolelement from "@/components/mapPoolElement.vue";
import dayjs from "dayjs";
import https from "https";
import Index from "../index.vue";
export default {
  layout: "emptynoheaderdrawer",
  // middleware: "auth",
  components: {
    mappoolelement,
    Index
  },
  data() {
    return {
      windowWidth:window.innerWidth,
      pools: {
        D: [
          { id: "D1", name: "D1", state: "放養中" },
          { id: "D2", name: "D2", state: "放養中" },
          { id: "D3", name: "D3", state: "放養中" },
          { id: "D4", name: "D4", state: "放養中" },
          { id: "D5", name: "D5", state: "放養中" },
          { id: "D^", name: "D^", state: "" },
          { id: "D6", name: "D6", state: "無" },
          { id: "D7", name: "D7", state: "無" },
          { id: "D8", name: "D8", state: "無" }
        ],
        C: [
          { id: "C1", name: "C1", state: "放養中" },
          { id: "C2", name: "C2", state: "放養中" },
          { id: "C3", name: "C3", state: "放養中" },
          { id: "C4", name: "C4", state: "放養中" },
          { id: "C5", name: "C5", state: "放養中" },
          { id: "C^", name: "C^", state: "" },
          { id: "C6", name: "C6", state: "放養中" },
          { id: "C7", name: "C7", state: "放養中" },
          { id: "C8", name: "C8", state: "無" }
        ],
        B: [
          { id: "B1", name: "B1", state: "放養中" },
          { id: "B2", name: "B2", state: "集中暫養中" },
          { id: "B3", name: "B3", state: "尚未洗池" },
          { id: "B4", name: "B4", state: "已清洗" },
          { id: "B5", name: "B5", state: "蓄水中" },
          { id: "B^", name: "B^", state: "" },
          { id: "B6", name: "B6", state: "放養中" },
          { id: "B7", name: "B7", state: "放養中" },
          { id: "B8", name: "B8", state: "放養中" }
        ],
        A: [
          { id: "A1", name: "A1", state: "蓄水完畢" },
          { id: "A2", name: "A2", state: "消毒中" },
          { id: "A3", name: "A3", state: "做水中" },
          { id: "A4", name: "A4", state: "預備放苗" },
          { id: "A5", name: "A5", state: "空池" },
          { id: "A^", name: "A^", state: "" },
          { id: "A6", name: "A6", state: "放養中" },
          { id: "A7", name: "A7", state: "放養中" },
          { id: "A8", name: "A8", state: "放養中" }
        ]
      },
      statcolor: [
        { name: "無", color: "#D3DCE1",id: 1 },
        { name: "default", color: "#00273E" },
        { name: "放養中", color: "#F1E78D",id: 4 },
        { name: "放養中(鎖排汙)", color: "#CBAAE5",id: 32 },
        { name: " 集中暫養", color: "#8DA0E5",id: 31},
        { name: "尚未洗池", color: "#E8DDBF",id: 6 },
        { name: "已清洗", color: "#A8E6DB",id: 7 },
        { name: "蓄水中", color: "#D3B280",id: 8 },
        { name: "蓄水完畢", color: "#A5D380",id: 9 },
        { name: "消毒中", color: "#80D3AB",id: 10 },
        { name: "做水中", color: "#C5E8E6",id: 11 },
        { name: "預備放苗", color: "#83C9F0",id: 12 },
        { name: "空池", color: "#BFDAE8",id: 3 },
        { name: "養殖審核", color: "#D3808F",id: 33 }
      ],
      editState: false, //編輯池況
      editData: [],
      successDataID:[]
    };
  },
  watch: {
    windowWidth:function(){
      return window.innerWidth;
    },
    successData() {
      // 全部儲存後，需更改原本的資料以及池況還原
      // console.log('success',this.successData);
      if(this.successData.length>0) {
        let keys = Object.keys(this.pools);
        let ids = []
        this.successData.forEach(data=>{ids.push(data.id);});
        this.successDataID = ids;
        // console.log('success ids',ids);
        for(let i=0;i<keys.length;i++) {
          for(let x=0;x<this.pools[keys[i]].length;x++) {
            for(let y=0;y<this.successData.length;y++) {
              if(this.pools[keys[i]][x].id == this.successData[y].id) {
                this.pools[keys[i]][x].state = this.successData[y].value;
                let evt = {
                  item:{
                    id:this.successData[y].id,
                    value:this.successData[y].value
                  },
                }
                this.saveDelete(evt);
              }
            }
          }
        }
      }
    },
    showedit() {
      // 非編輯狀態，清除原本要更改的池況狀態
      if(!this.showedit) {
        this.editData = [];
        this.successDataID = [];
      }
    }
  },
  props: {
    showedit: {
      type: Boolean,
      default: false
    },
    successData: {
      type: Array,
      default: []
    }
  },
  methods: {
    getItemColor: function(data) {
      if (data == "") {
        return "primary";
      }
      let data2 = this.statcolor.filter(x => x.name == data);
      if (data2.length == 1) {
        return data2[0].color;
      } else {
        return this.statcolor.filter(x => x.name == "default")[0].color;
      }
    },
    edit(evt) {
      // console.log(evt);
      this.isEdit = true;
      let isInculde = false;
      let keys = Object.keys(this.pools)
        for(let i=0;i<keys.length;i++) {
          for(let x=0;x<this.pools[keys[i]].length;x++) {
            if(this.pools[keys[i]][x].id == evt.item.id) {
              if(this.pools[keys[i]][x].state == evt.value) {
                this.saveDelete(evt);
                // this.$emit('saveSuccess',evt);
              }else {
                if(this.editData.length>0) {
                  for(let i=0;i<this.editData.length;i++) {
                    if(this.editData[i].id == evt.item.id && this.editData[i].value !== evt.value) {
                      this.editData[i].value = evt.value;
                      isInculde = true;
                    }
                  }
                }
                
                if(!isInculde) {
                  this.editData.push({
                    id: evt.item.id,
                    value: evt.value
                  });
                }
                if(this.editData.length>0) {
                  this.$emit('editPoolOuter',this.editData);
                }
              }
            }

          }
        }
      // console.log(this.editData);
    },
    saveDelete(evt) {
      this.editData = this.editData.filter(x=>{
        // console.log('tf',evt,x);
        x.id!==evt.item.id
      });
      this.$emit('saveSuccess',evt);
      // console.log('wc',this.editData);
    },
  },

  async mounted() {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    //監控視窗
     window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    });
    //取得水池狀態
    // var pools = {
    //             "A": [
    //                 {
    //                     "id": 137,
    //                     "name": "S1",
    //                     "state": "放養中",
    //                     "updated_user": "養殖組-鍾曜澤",
    //                     "updated_time": "2023-02-25 13:02:41"
    //                 },
    //                 {
    //                     "id": 138,
    //                     "name": "S2",
    //                     "state": "放養中",
    //                     "updated_user": "養殖組-鍾曜澤",
    //                     "updated_time": "2023-02-25 13:02:42"
    //                 },
    //               ],
    //               "B":[
    //                 {
    //                       "id": 139,
    //                       "name": "L1",
    //                       "state": "放養中",
    //                       "updated_user": "養殖組-鍾曜澤",
    //                       "updated_time": "2023-02-25 13:02:41"
    //                   },
    //                   {
    //                       "id": 140,
    //                       "name": "L2",
    //                       "state": "放養中",
    //                       "updated_user": "養殖組-鍾曜澤",
    //                       "updated_time": "2023-02-25 13:02:41"
    //                   },
    //                   {
    //                       "id": 141,
    //                       "name": "L3",
    //                       "state": "放養中",
    //                       "updated_user": "養殖組-鍾曜澤",
    //                       "updated_time": "2023-02-25 13:02:41"
    //                   },
    //                   {
    //                       "id": 142,
    //                       "name": "L4",
    //                       "state": "放養中",
    //                       "updated_user": "養殖組-鍾曜澤",
    //                       "updated_time": "2023-02-25 13:02:41"
    //                   },
    //                   {
    //                       "id": 143,
    //                       "name": "L5",
    //                       "state": "放養中",
    //                       "updated_user": "養殖組-鍾曜澤",
    //                       "updated_time": "2023-02-25 13:02:41"
    //                   },
    //               ]
    //   };
    //   this.pools = pools;

    await this.$axios
      .get(`${this.$store.state.mydata.gobal_api.apiUrl}/sp-state/`, { httpsAgent: agent })
      .then(res => {
        this.pools = res.data;
      })
      .catch(error => {
        alert("error:" + error.message);
      });
    //取得池況顏色設定
    await this.$axios
      .get(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`, { httpsAgent: agent })
      .then(res => {
        this.statcolor = res.data.filter(x => x.name != ""); //不提供保留項
      })
      .catch(error => {
        alert("error:" + error.message);
      });
  },
  computed: {
    MaxDate: function() {
      var rows1 = Object.keys(this.pools); //[a,b,c,d]

      let alldate = [];
      rows1.forEach(row =>
        alldate.push(
          ...this.pools[row]
            .filter(
              x => x.state !== "default" && x.state !== "無" && x.state !== ""
            )
            .map(x => {
              return x.updated_time;
            })
        )
      );

      let maxDate = new Date(Math.max(...alldate.map(date => new Date(date))));
      // console.log(dayjs(minDate).format('YYYY-MM-DD HH:mm:ss'),dayjs(maxDate).format('YYYY-MM-DD HH:mm:ss'));
      return dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="scss" scoped>
td {
  font-size: 1.2em;
  text-align: center;
  vertical-align: middle;
  min-width: 80px;
}
tr {
  height: 50px;
  max-height: 80px;
}
.colspan {
  margin-bottom: -24px;
  & >.row {
    justify-content: space-between;
    height: 100%;
    margin-left: 16px;
  }
}
@media (max-width: 1000px) {
  .colspan {
    & >.row {
      justify-content: initial;
    }
    .block {
      height: 110px;
    }
  }
}
</style>
