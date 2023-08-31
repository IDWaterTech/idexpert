<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-row
          v-for="(item, index) in Object.keys(pools)"
          :key="index"
          class="mx-1"
        >
          <v-col
            :class="
              `${windowWidth < 700 ? 'text-center block' : 'text-center mx-3 my-1 block'}`
            "
            :style="
              itm.state == '無'
                ? ''
                : itm.state.length > 0
                ? `background:${getItemColor(
                    itm.state
                  )};`
                : `background:${getItemColor(itm.state)};`
            "
            v-for="(itm, idx) in pools[item]"
            :key="idx"
          >
             <mappoolelement
                :item="itm"
                :selitem="
                  statcolor.filter(x => !['default', ''].includes(x.name))
                "
                :showSelect="showedit"
                :myuser="($auth.$state.user)?$auth.$state.user.email:''"
                :successDataID="successDataID"
                @editPool="edit($event)"
                @saveSuccess="saveDelete($event)"
              ></mappoolelement>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        class=""
        ><div class="grey lighten-2 text-center road">中央走道</div></v-col
      >
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
export default {
  layout: "emptynoheaderdrawer2",
  middleware: "auth",
  components: {
    mappoolelement
  },
  data() {
    return {
      windowWidth:window.innerWidth,
      pools: {
        C: [
          { id: "C1", name: "C1", state: "放養中" },
          { id: "C2", name: "C2", state: "放養中" },
          { id: "C3", name: "C3", state: "放養中" },
          { id: "C4", name: "C4", state: "放養中" },
          { id: "C5", name: "C5", state: "放養中" }
        ],
        B: [
          { id: "B1", name: "B1", state: "放養中" },
          { id: "B2", name: "B2", state: "集中暫養中" },
          { id: "B3", name: "B3", state: "尚未洗池" },
          { id: "B4", name: "B4", state: "已清洗" },
          { id: "B5", name: "B5", state: "蓄水中" }
        ],
        A: [
          { id: "A1", name: "A1", state: "蓄水完畢" },
          { id: "A2", name: "A2", state: "消毒中" },
          { id: "A3", name: "A3", state: "做水中" },
          { id: "A4", name: "A4", state: "預備放苗" },
          { id: "A5", name: "A5", state: "空池" }
        ]
      },
      
      editState: false, //編輯池況
      editData: [],
      successDataID:[]
    };
  },
  props: {
    showedit: {
      type: Boolean,
      default: false
    },
    statcolor: {
      type: Array,
      default: []
    },
    successData: {
      type: Array,
      default: []
    }
  },
  async mounted() {
    console.log('wc Mounted')
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    //監控視窗
     window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    });
    //取得水池狀態
    await this.$axios
      .get(`${this.$store.state.mydata.gobal_api.apiUrl}/wc-state/`, { httpsAgent: agent })
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
        // console.log('getColor',res.data);
        this.statcolor = res.data;
      })
      .catch(error => {
        alert("error:" + error.message);
      });
  },
  methods: {
    getItemColor: function(data) {
      // console.log('getItemColor',data);
      if (data == "") {
        return "white";
      }
      let data2 = this.statcolor.filter(x => x.name == data);
      if (data2.length == 1) {
        return data2[0].color;
      } else {
        return this.statcolor.filter(x => x.name == "default")[0].color;
      }
    },
    editStateFun: function(data) {
      this.editState[data] = this.editState[data]
        ? !this.editState[data]
        : true;
      console.log(this.editState);
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
    }
  },
  watch: {
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
  }
};
</script>

<style scoped>
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
</style>
