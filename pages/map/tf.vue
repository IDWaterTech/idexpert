<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-icon @click="editState = !editState">mdi-pencil</v-icon>
        <table style="border:0px solid; width:100%;" CellSpacing="15">
          <tr>
            <td
              class="grey lighten-2"
              :colspan="pools[Object.keys(pools)[0]].length"
            >
              中央走道
            </td>
          </tr>
          <tr v-for="(item, index) in Object.keys(pools)" :key="index">
            <td
              v-for="(itm, idx) in pools[item]"
              :key="idx"
              :bgcolor="getItemColor(itm.state)"
              :style="
                itm.state == '無'
                  ? ''
                  : itm.state.length > 0
                  ? 'border:2px solid;'
                  : 'max-width:50px;'
              "
            >
              <mappoolelement
                :item="itm"
                :selitem="statcolor.filter(x => x.name != 'default')"
                :showSelect="editState"
                :myuser="$auth.$state.user.email"
              ></mappoolelement>
              <!-- <span
                v-if="itm.state.length > 0"
                :style="['無', ''].includes(itm.state) ? 'color:white;' : ''"
                >{{ itm.name }}-{{ itm.state }}</span
              >
              <span v-else></span> -->
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import mappoolelement from "@/components/mapPoolElement.vue";
import https from "https";
export default {
  layout: "emptynologin",
  middleware: "auth",
  components: {
    mappoolelement
  },
  data() {
    return {
      pools: {
        D: [
          { id: "D1",name: "D1", state: "放養中" },
          { id: "D2",name: "D2", state: "放養中" },
          { id: "D3",name: "D3", state: "放養中" },
          { id: "D4",name: "D4", state: "放養中" },
          { id: "D5",name: "D5", state: "放養中" },
          { id: "D^",name: "D^", state: "" },
          { id: "D6",name: "D6", state: "無" },
          { id: "D7",name: "D7", state: "無" },
          { id: "D8",name: "D8", state: "無" }
        ],
        C: [
          { id: "C1",name: "C1", state: "放養中" },
          { id: "C2",name: "C2", state: "放養中" },
          { id: "C3",name: "C3", state: "放養中" },
          { id: "C4",name: "C4", state: "放養中" },
          { id: "C5",name: "C5", state: "放養中" },
          { id: "C^",name: "C^", state: "" },
          { id: "C6",name: "C6", state: "放養中" },
          { id: "C7",name: "C7", state: "放養中" },
          { id: "C8",name: "C8", state: "無" }
        ],
        B: [
          { id: "B1",name: "B1", state: "放養中" },
          { id: "B2",name: "B2", state: "集中暫養中" },
          { id: "B3",name: "B3", state: "尚未洗池" },
          { id: "B4",name: "B4", state: "已清洗" },
          { id: "B5",name: "B5", state: "蓄水中" },
          { id: "B^",name: "B^", state: "" },
          { id: "B6",name: "B6", state: "放養中" },
          { id: "B7",name: "B7", state: "放養中" },
          { id: "B8",name: "B8", state: "放養中" }
        ],
        A: [
          { id: "A1",name: "A1", state: "蓄水完畢" },
          { id: "A2",name: "A2", state: "消毒中" },
          { id: "A3",name: "A3", state: "做水中" },
          { id: "A4",name: "A4", state: "預備放苗" },
          { id: "A5",name: "A5", state: "空池" },
          { id: "A^",name: "A^", state: "" },
          { id: "A6",name: "A6", state: "放養中" },
          { id: "A7",name: "A7", state: "放養中" },
          { id: "A8",name: "A8", state: "放養中" }
        ]
      },
      statcolor: [
        { name: "無", color: "white" },
        { name: "default", color: "#AAAAAA" }
        // { name: "放養中", color: "yellow" },
        // { name: "集中暫養中", color: "#0070C0" },
        // { name: "尚未洗池", color: "purple" },
        // { name: "已清洗", color: "red" },
        // { name: "蓄水中", color: "orange" },
        // { name: "蓄水完畢", color: "lightgreen" },
        // { name: "消毒中", color: "green" },
        // { name: "做水中", color: "#F8CBAD" },
        // { name: "預備放苗", color: "#00B0F0" },
        // { name: "空池", color: "grey" },
      ],
      editState: false //編輯池況
    };
  },
  methods: {
    getItemColor: function(data) {
      if (data == "") {
        return "white";
      }
      let data2 = this.statcolor.filter(x => x.name == data);
      if (data2.length == 1) {
        return data2[0].color;
      } else {
        return this.statcolor.filter(x => x.name == "default")[0].color;
      }
    }
  },
  async mounted() {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    //取得水池狀態
    await this.$axios
      .get("https://61.56.172.10/tf-state/", { httpsAgent: agent })
      .then(res => {
        this.pools = res.data;
      })
      .catch(error => {
        alert("error:" + error.message);
      });
    //取得池況顏色設定
    await this.$axios
      .get("https://61.56.172.10/pond-state/", { httpsAgent: agent })
      .then(res => {
        this.statcolor = res.data.filter(x=>x.name!="");//不提供保留項
      })
      .catch(error => {
        alert("error:" + error.message);
      });
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
