<template>
  <div>
    <v-row dense>
      <v-col cols="12"><h1 class="white--text">觀察網影像辨識</h1></v-col>
      <v-col cols="12">
        <v-btn color="primary" @click="getRecog">getData</v-btn>
      </v-col>
      <v-col cols="12">
      </v-col>
      <v-col cols="12">
        <el-table
          ref="recogtable"
          style="width:100%"
          :data="recogData"
          highlight-current-row
          :header-cell-style="tableHeaderStyle"
          height="300"
          class="primary"
          :header-cell-name="cellClass"
        >
          <!-- @current-change="handleCurrentChange"
          @select="handleSelectionChange" -->
          <el-table-column
            label="水池"
            align="center"
          >
          <div slot-scope="scope">
              ({{scope.row.id}})-{{scope.row.name}}
          </div>
          </el-table-column>
          <el-table-column
            label="資料id"
            prop="items.id"
            align="center"
          ></el-table-column>
          <el-table-column
            label="原圖"
            prop="items.original_img"
            align="center"
          >
            <div slot-scope="scope">
              <el-image :src="scope.row.items.original_img">
                <div slot="error" class="image-slot">
                  <img :src="images.feedfish" width="64" />
                </div>
              </el-image>
            </div>
          </el-table-column>
          <el-table-column
            label="飼料辨識後的圖"
            prop="items.feed_result_img"
            align="center"
          >
            <div slot-scope="scope">
              <el-image :src="scope.row.items.feed_result_img">
                <div slot="error" class="image-slot">
                  <img :src="images.feedfish" width="64" />
                </div>
              </el-image>
            </div>
          </el-table-column>
          <el-table-column
            label="蝦子辨識後的圖"
            prop="items.shrimp_result_img"
            align="center"
          >
            <div slot-scope="scope">
              <el-image :src="scope.row.items.shrimp_result_img">
                <div slot="error" class="image-slot">
                  <img :src="images.shrimp" width="64" />
                </div>
              </el-image>
            </div>
          </el-table-column>
          <el-table-column
            label="網子大小(pixel)"
            prop="items.net_size"
            align="center"
          ></el-table-column>
          <el-table-column
            label="飼料大小(pixel)"
            prop="items.feed_size"
            align="center"
          ></el-table-column>
          <el-table-column
            label="蝦子大小"
            prop="items.shrimp_size"
            align="center"
          >
          <div slot-scope="scope">
              {{scope.row.items.shrimp_size}}
          </div>
          </el-table-column>
          <el-table-column
            label="飼料比例"
            prop="items.feed_perccentage"
            align="center"
          ></el-table-column>
          <el-table-column
            label="蝦子座標"
            prop="items.shrimp_coordinate"
            align="center"
          >
          <div slot-scope="scope">
              {{scope.row.items.shrimp_coordinate}}
          </div>
          </el-table-column>
          <el-table-column
            label="檢測時間"
            prop="items.inspected_date"
            align="center"
          ></el-table-column>
          <!-- <el-table-column label="循環訖日" prop="ended_date" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{
                scope.row.ended_date == null || scope.row.ended_date == ""
                  ? `執行中`
                  : scope.row.ended_date
              }}</span>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="">
              <v-btn
                color="primary"
                outlined
                small
                disabled
                @click="() => {}"
                >刪除</v-btn
              >
            </template>
          </el-table-column>
        </el-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
export default {
  layout: "emptynologin",
  data() {
    return {
      recogData: [
        {
          id: 1,
          name: "A1",
          items: {
            id: 1,
            original_img:
              "https://localhost.idwatertech.com/.well-known/observation/20211028093910_1_1/feed/original.jpg",
            feed_result_img:
              "https://localhost.idwatertech.com/.well-known/observation/20211028093910_1_1/feed/result.jpg",
            shrimp_result_img:
              "https://localhost.idwatertech.com/.well-known/observation/20211028093910_1_1/shrimp/result.jpg",
            net_size: 1902345,
            feed_size: 24233,
            shrimp_size: [2222, 3333, 4444, 5555],
            feed_percentage: 6.234,
            shrimp_coordinate: [
              [318, 581, 1723, 2386],
              [1039, 1816, 1395, 2005],
              [1183, 1184, 1531, 1406],
              [1107, 1533, 1368, 1695]
            ],
            inspected_date: "2021-01-01 00:00:00"
          }
        }
      ],
      images: {
        feedfish: require("~/assets/feedfish.png"),
        shrimp: require("~/assets/shrimp.png")
      }
    };
  },
  methods: {
    cellClass: function(row) {
      if (row.columnIndex == 0) {
        return "disableSelection";
      }
    },
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      let bgcolor = $nuxt.$vuetify.theme.themes.light.cardtitle;
      if (rowIndex == 0) {
        return `background-color:${bgcolor};color:#fff;font-weight:500;`;
      } else {
        return `background-color:${bgcolor};`;
      }
    },
    getRecog: async function() {
      var parm = {
        started_date: "2021-01-01",
        ended_date: "2021-01-01",
        pond_id: "1"
      };
      await this.$axios
        .get(
          `${this.$store.state.mydata.gobal_api.apiUrl}/observation-image-data/`,
          parm
        )
        .then(res => {
          debugger;
          this.recogData = res.data;
          //   if (res.data == "修改成功") {
          //     if (data != "nomsg") {
          //       this.$toast.success(`修改成功`, { duration: 2000 });
          //     }
          //   } else {
          //     if (data != "nomsg") {
          //       this.$toast.error(`修改失敗:${res.data}`, { duration: 2000 });
          //     }
          //   }
          // this.profile = res.data;
          // this.$toast.success(`成功:${res.data}`, { duration: 2000 });
        })
        .catch(error => {
          this.$toast.error(`失敗:${error.message}`, { duration: 2000 });
        });
    }
  }
};
</script>

<style scoped></style>
