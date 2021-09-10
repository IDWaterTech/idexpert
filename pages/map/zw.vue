<template>
  <div>
    <v-row>
      <v-col cols="12">
        <!-- <v-icon @click="editState = !editState">mdi-pencil</v-icon> -->
        <table style="border:0px solid; width:100%;" CellSpacing="15">
          <tr v-for="item in Object.keys(pools.area1)" :key="item">
            <td
              v-for="(itm, idx) in pools.area1[item]"
              :key="idx"
              :bgcolor="getItemColor(itm.state)"
              :style="
                itm.state == '無'
                  ? ''
                  : itm.state.length > 0
                  ? 'border:1px solid;border-radius: 5px;'
                  : 'max-width:50px;'
              "
            >
              <mappoolelement
                :item="itm"
                :selitem="statcolor.filter(x => x.name != 'default')"
                :showSelect="showedit"
                :myuser="$auth.$state.user.email"
              ></mappoolelement>
              <!-- <span v-if="itm.state.length > 0"
                >{{ itm.name }}-{{ itm.state }}</span
              >
              <span v-else></span> -->
            </td>
          </tr>
          <tr>
            <td
              class="grey lighten-2"
              :colspan="pools.area1[Object.keys(pools.area1)[0]].length"
            >
              中央走道
            </td>
          </tr>
          <tr v-for="item in Object.keys(pools.area2)" :key="item">
            <td
              v-for="(itm, idx) in pools.area2[item]"
              :key="idx"
              :bgcolor="getItemColor(itm.state)"
              :style="
                itm.state == '無'
                  ? ''
                  : itm.state.length > 0
                  ? 'border:1px solid;border-radius: 5px;'
                  : 'max-width:50px;'
              "
            >
              <mappoolelement
                :item="itm"
                :selitem="statcolor.filter(x => x.name != 'default')"
                :showSelect="showedit"
                :myuser="$auth.$state.user.email"
              ></mappoolelement>
              <!-- <span
                v-if="itm.state.length > 0"
                :style="itm.state == '無' ? 'color:white;' : ''"
                >{{ itm.name }}-{{ itm.state }}</span
              >
              <span v-else></span> -->
            </td>
          </tr>
          <tr>
            <td class="text-right" :colspan="pools.area2[Object.keys(pools.area2)[0]].length">
              最後更新時間：{{ MaxDate }}
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import mappoolelement from "@/components/mapPoolElement.vue";
import dayjs from "dayjs";
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
        { name: "無", color: "white" },
        { name: "default", color: "grey" }
      ],
      editState: false //編輯池況
    };
  },
  props: {
    showedit: {
      type: Boolean,
      default: false
    }
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
      .get("https://61.56.172.10/zw-state/", { httpsAgent: agent })
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
        this.statcolor = res.data.filter(x => x.name != ""); //不提供保留項
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
