<template>
    <el-popover
      placement="top-start"
      width="400"
      class="popover-bg"
    >
      <v-row style="color:#FFF;" justify="center" align="center">
        <v-col cols="12" class="border-bottom" style="padding-bottom: 8px;">
          <h3>市場資訊</h3>
        </v-col>
        <v-col style="line-height: 24px;">
          <span style="font-weight: 400;">魚貨名稱：</span>白蝦<br />
          <span style="font-weight: 400;">全台灣平均價：</span>{{ average }}元/公斤<br />
          <span style="font-weight: 400;">單位：</span>公斤<br/>
          <!-- 資料來源：漁產品交易行情(<a target="_blank" style="color:#40C4FF;" href="https://data.coa.gov.tw/open_detail.aspx?id=039">行政院農業委員會資料開放平台</a>) -->
          <span style="font-weight: 400;">資料來源：</span>漁產品交易行情(<a target="_blank" style="color:#40C4FF;text-decoration: underline;" href="https://data.moa.gov.tw/open_detail.aspx?id=039">行政院農業委員會資料開放平台</a>)
          <el-table
            :data="priceData"
            style="width: 100%"
            max-height="300"
            size="mini"
          >
            <el-table-column label="交易日期" prop="交易日期" align="center">
            </el-table-column>
            <!-- <el-table-column label="品種代碼" prop="品種代碼" align="center">
            </el-table-column> -->
            <!-- <el-table-column label="魚貨名稱" prop="魚貨名稱" align="center">
            </el-table-column> -->
            <el-table-column label="市場名稱" prop="市場名稱" align="center">
            </el-table-column>
            <el-table-column label="平均價" prop="平均價" align="center">
              <template slot-scope="scope">
                     {{(scope.row.平均價==0)?scope.row.魚貨名稱:scope.row.平均價}}
                    </template>
            </el-table-column>
            <el-table-column label="上價" prop="上價" align="center">
            </el-table-column>
            <el-table-column label="中價" prop="中價" align="center">
            </el-table-column>
            <el-table-column label="下價" prop="下價" align="center">
            </el-table-column>
            <el-table-column label="交易量" prop="交易量" align="center">
            </el-table-column>
          </el-table>
        </v-col>
      </v-row>

      <v-btn slot="reference" text dark
        ><v-icon>mdi-gold</v-icon>${{ average }}</v-btn
      >
    </el-popover>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false
});
export default {
  data() {
    return {
      priceData: ["0"]
    };
  },
  methods: {
    getPrice: async function() {
      await this.$axios
        .get(
          // `${this.$store.state.mydata.gobal_api.apiIIS82}/idapi.asmx/getAquaticTransData`
          `${this.$store.state.mydata.gobal_api.apiIIS82}/GetAquaticTransData`
        )
        .then(res => {
          this.priceData = res.data.sort(function(a, b) {
            if (a.市場名稱 == "頭城") {
              return -1;
            }
            if (Number(a.交易日期) > Number(b.交易日期)) {
              return 0;
            }
            return a.平均價 > b.平均價 ? 0 : 1;
          });

          // console.log("MarketPrice api：" + res.request.responseURL);
        });
    }
  },
  computed: {
    // 计算属性的 getter
    average: function() {
      var data = this.priceData.filter(x=>x["平均價"]!=0).map(x => x["平均價"]);
      const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
      let changeTWUnit = 1;
      var result = (average(data) * changeTWUnit).toFixed(2);
      return result;
    }
  },
  created() {
    this.getPrice();
  }
};
</script>

<style lang="scss" scoped>
.popoverColor {
  background-color: #3f6d9e !important;
}
.popoverColor .popper_arrow::after {
  border-bottom-color: #3f6d9e !important;
}
.el-popover.el-popper {
  background-color: #fff;
  * {
    color: $color-dark;
  }
  h3 {
    font-weight: bold;
  }
}
</style>
