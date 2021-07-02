<template>
  <div>
    <h1>天府廠圖</h1>
    <v-row>
      <v-col cols="12">
        <table style="border:0px solid; width:100%;" CellSpacing="15">
          <tr>
        <td class="grey lighten-2" :colspan="pools[Object.keys(pools)[0]].length">中央走道</td>
      </tr>
          <tr v-for="(item, index) in Object.keys(pools)" :key="index">
            <td
              v-for="(itm, idx) in pools[item]"
              :key="idx"
              :bgcolor="getItemColor(itm.state)"
              :style="itm.state == '無'? '': itm.state.length > 0? 'border:2px solid;': 'width:50px;'"
            >
              <span v-if="itm.state.length > 0" :style="itm.state == '無' ? 'color:white;' : ''"
                >{{ itm.name }}-{{ itm.state }}</span
              >
              <span v-else></span>
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  layout: "emptynologin",
  data() {
    return {
      pools: {
        D: [
          { name: "D1", state: "放養中" },
          { name: "D2", state: "放養中" },
          { name: "D3", state: "放養中" },
          { name: "D4", state: "放養中" },
          { name: "D5", state: "放養中" },
          { name: "D^", state: "" },
          { name: "D6", state: "無" },
          { name: "D7", state: "無" },
          { name: "D8", state: "無" }
        ],
        C: [
          { name: "C1", state: "放養中" },
          { name: "C2", state: "放養中" },
          { name: "C3", state: "放養中" },
          { name: "C4", state: "放養中" },
          { name: "C5", state: "放養中" },
          { name: "C^", state: "" },
          { name: "C6", state: "放養中" },
          { name: "C7", state: "放養中" },
          { name: "C8", state: "無" }
        ],
        B: [
          { name: "B1", state: "放養中" },
          { name: "B2", state: "集中暫養中" },
          { name: "B3", state: "尚未洗池" },
          { name: "B4", state: "已清洗" },
          { name: "B5", state: "蓄水中" },
          { name: "B^", state: "" },
          { name: "B6", state: "放養中" },
          { name: "B7", state: "放養中" },
          { name: "B8", state: "放養中" }
        ],
        A: [
          { name: "A1", state: "蓄水完畢" },
          { name: "A2", state: "消毒中" },
          { name: "A3", state: "做水中" },
          { name: "A4", state: "預備放苗" },
          { name: "A5", state: "空池" },
          { name: "A^", state: "" },
          { name: "A6", state: "放養中" },
          { name: "A7", state: "放養中" },
          { name: "A8", state: "放養中" }
        ]
      },
      statcolor: [
        { name: "default", color: "grey" },
        { name: "放養中", color: "yellow" },
        { name: "集中暫養中", color: "#0070C0" },
        { name: "尚未洗池", color: "purple" },
        { name: "已清洗", color: "red" },
        { name: "蓄水中", color: "orange" },
        { name: "蓄水完畢", color: "lightgreen" },
        { name: "消毒中", color: "green" },
        { name: "做水中", color: "#F8CBAD" },
        { name: "預備放苗", color: "#00B0F0" },
        { name: "空池", color: "grey" },
        { name: "無", color: "white" }
      ]
    };
  },
  methods: {
    getItemColor: function(data) {
      let data2 = this.statcolor.filter(x => x.name == data);
      if (data2.length == 1) {
        return data2[0].color;
      } else {
        return this.statcolor.filter(x => x.name == "default").color;
      }
    }
  }
};
</script>

<style scoped>
td {
  font-size: 1.5em;
  text-align: center;
  vertical-align: middle;
  min-width: 50px;
}
tr {
  height: 80px;
  max-height: 80px;
}
</style>
