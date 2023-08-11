<template>
  <div>
    <v-row>
      <v-col cols="12" >
        <v-row v-for="item in Object.keys(pools.area1)" :key="item" class="mx-1">
          <v-col
            v-for="(itm, idx) in pools.area1[item]"
            :key="idx"
            :bgcolor="getItemColor(itm.state)"
            :class="{'block':itm.state!=='','text-center':windowWidth<700 , 'text-center mx-3 my-1':windowWidth>=700}"
            :style="
              itm.state == '無'
                ? ''
                : itm.state.length > 0
                ? `background:${getItemColor(
                    itm.state
                  )};`
                : `background:${getItemColor(itm.state)};`
            "
          >
            <mappoolelement
              :item="itm"
              :selitem="statcolor.filter(x => x.name != 'default')"
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
      <v-col cols="12">
        <v-row v-for="item in Object.keys(pools.area2)" :key="item" class="mx-1">
          <v-col
            v-for="(itm, idx) in pools.area2[item]"
            :key="idx"
            :bgcolor="getItemColor(itm.state)"
            :class="{'block':itm.state!=='','text-center':windowWidth<700 , 'text-center mx-3 my-1':windowWidth>=700}"
            :style="
              itm.state == '無'
                ? ''
                : itm.state.length > 0
                ? `background:${getItemColor(
                    itm.state
                  )};`
                : `background:${getItemColor(itm.state)};`
            "
          >
            <mappoolelement
              :item="itm"
              :selitem="statcolor.filter(x => x.name != 'default')"
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
  layout: "emptynoheaderdrawer",
  // middleware: "auth",
  components: {
    mappoolelement
  },
  data() {
    return {
      windowWidth:window.innerWidth,
      pools: {
        area1: {
          c: [
            { name: "c1", state: "無" },
            { name: "c2", state: "無" },
            { name: "c3", state: "無" },
            { name: "c^", state: "" },
            { name: "3-5", state: "放養中" },
            { name: "3-6", state: "放養中" }
          ],
          b: [
            { name: "2^", state: "" },
            { name: "1-5", state: "集中暫養中" },
            { name: "1-6", state: "尚未洗池" },
            { name: "b^", state: "" },
            { name: "3-3", state: "蓄水中" },
            { name: "3-4", state: "蓄水中" }
          ],
          a: [
            { name: "1-1", state: "集中暫養中" },
            { name: "1-2", state: "消毒中" },
            { name: "1-3", state: "做水中" },
            { name: "a^", state: "" },
            { name: "3-1", state: "空池" },
            { name: "3-2", state: "空池" }
          ]
        },
        area2: {
          f: [
            { name: "C1", state: "無" },
            { name: "C2", state: "無" },
            { name: "C3", state: "無" },
            { name: "C^", state: "" },
            { name: "C4", state: "放養中" },
            { name: "C5", state: "放養中" }
          ],
          e: [
            { name: "", state: "無" },
            { name: "2-3", state: "放養中" },
            { name: "2-4", state: "放養中" },
            { name: "b^", state: "" },
            { name: "4-3", state: "放養中" },
            { name: "4-4", state: "放養中" }
          ],
          d: [
            { name: "", state: "無" },
            { name: "2-1", state: "消毒中" },
            { name: "2-2", state: "做水中" },
            { name: "a^", state: "" },
            { name: "4-1", state: "預備放苗" },
            { name: "4-2", state: "空池" }
          ]
        }
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
      let keys = Object.keys(this.pools);
      for(let i=0;i<keys.length;i++) {
        let key2 = Object.keys(this.pools[keys[i]]);
        for(let z=0;z<key2.length;z++) {
          for(let x=0;x<this.pools[keys[i]][key2[z]].length;x++) {
            if(this.pools[keys[i]][key2[z]][x].id == evt.item.id) {
              if(this.pools[keys[i]][key2[z]][x].state == evt.value) {
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
    await this.$axios
      .get(`${this.$store.state.mydata.gobal_api.apiUrl}/zw-state/`, { httpsAgent: agent })
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
        // this.statcolor = res.data.filter(x => x.name != ""); //不提供保留項
      })
      .catch(error => {
        alert("error:" + error.message);
      });
  },
  computed: {
    MaxDate: function() {
      var rows1 = Object.keys(this.pools.area1); //[a,b,c,d]
      var rows2 = Object.keys(this.pools.area2); //[a,b,c,d]

      let alldate = [];
      rows1.forEach(row =>
        alldate.push(
          ...this.pools.area1[row]
            .filter(
              x => x.state !== "default" && x.state !== "無" && x.state !== ""
            )
            .map(x => {
              return x.updated_time;
            })
        )
      );
      rows2.forEach(row =>
        alldate.push(
          ...this.pools.area2[row]
            .filter(
              x => x.state !== "default" && x.state !== "無" && x.state !== ""
            )
            .map(x => {
              return x.updated_time;
            })
        )
      );
      // let minDate = new Date(Math.min(...alldate.map(date => new Date(date))));
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
          let key2 = Object.keys(this.pools[keys[i]]);
          for(let z=0;z<key2.length;z++) {
            for(let x=0;x<this.pools[keys[i]][key2[z]].length;x++) {
              for(let y=0;y<this.successData.length;y++) {
                if(this.pools[keys[i]][key2[z]][x].id == this.successData[y].id) {
                  this.pools[keys[i]][key2[z]][x].state = this.successData[y].value;
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
  min-width: 150px;
}
tr {
  height: 50px;
  max-height: 80px;
}
</style>
