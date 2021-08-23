<template>
  <div>
    <!-- <v-card elevation="1" outlined tile min-height="200"> -->
    <v-row no-gutters justify="center">
      <v-col cols="3" class="text-center">
        <div class="circle">
          <span class="circletitle">{{ poolName }}</span>
        </div>
      </v-col>
      <v-col cols="9" style="border:3px dashed red;">警示區</v-col>
      <v-col cols="12" sm="8" class="mt-3">
        <el-table
          style="width:100%"
          :data="circleData"
          border
          :header-cell-style="tableHeaderStyle"
        >
          <el-table-column
            label="循環起日"
            prop="c_sdate"
            align="center"
          ></el-table-column>
          <el-table-column
            label="循環訖日"
            prop="c_edate"
            align="center"
          ></el-table-column>
          <el-table-column
            label="狀態"
            prop="status"
            align="center"
          ></el-table-column>
        </el-table>
      </v-col>
      <v-col cols="12" sm="6" style="">
        <v-card min-height="300px" elevation="3" class="mx-3">
          <v-card-title>
            蝦況
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title>
            <ul>
              <li>大小</li>
              <li>數量</li>
              <li>檢疫</li>
            </ul>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card min-height="300px" elevation="3" class="mx-3">
          <v-card-title>
            <v-tabs v-model="currentItem">
              <v-tab
                v-for="(item, index) in tabitems"
                :key="index"
                :href="'#tab-' + item"
              >
                {{ item }}
              </v-tab>
              <v-tabs-items v-model="currentItem">
                <v-tab-item :value="'tab-' + tabitems[0]">
                  <v-row>
                    <v-col
                      cols="12"
                      sm="3"
                      v-for="(item, index) in detectData"
                      :key="index"
                    >
                      <v-card elevation="2" class="my-2 text-center">
                        <v-card-title class="justify-center py-2">
                          {{ item.name }}<br />
                          {{ item.value }}
                          </v-card-title>
                          <vue-speedometer
                            :value="item.value"
                            :needleHeightRatio="0.7"
                            :minValue="item.min"
                            :maxValue="item.max"
                            :customSegmentStops="[
                              item.min,
                              item.critical_min,
                              item.warning_min,
                              item.warning_max,
                              item.critical_max,
                              item.max
                            ]"
                            :segmentColors='["#F197B3", "#FFEC8B","#89E0B6", "#FFEC8B","#F197B3"]'
                            :needleTransitionDuration="3333"
                            needleTransition="easeElastic"
                            :ringWidth="20"
                            :fluidWidth="true"
                          ></vue-speedometer>
                        
                        <v-divider></v-divider>
                        <v-card-subtitle class=" py-2 px-2">
                          {{ item.valuetime.substr(0, 10) }}<br />
                          {{ item.valuetime.substr(11) }}
                        </v-card-subtitle>
                      </v-card>
                    </v-col>
                    <v-spacer></v-spacer>
                  </v-row>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- </v-card> -->
  </div>
</template>

<script>
//-----
import "element-ui/lib/theme-chalk/index.css";
export default {
  layout: "emptynologin",
  data() {
    return {
      req: this.$route.query,
      poolName: "A1",
      circleData: [
        { c_sdate: "2020/01/01", c_edate: "2020/05/23", status: "完成" },
        { c_sdate: "2020/05/26", c_edate: "", status: "執行中" }
      ],
      tabitems: ["檢測數據", "計算數據"],
      currentItem: "檢測數據",
      detectData: [
        {
          name: "溶氧濃度",
          value: 678,
          valuetime: "2020/01/01 12:00:00",
          min: 0,
          max: 999,
          critical_min: 200,
          critical_max: 800,
          warning_min: 300,
          warning_max: 500
        },
        {
          name: "溶養2",
          value: 567,
          valuetime: "2020/01/01 12:00:00",
          min: 0,
          max: 999,
          critical_min: 200,
          critical_max: 800,
          warning_min: 300,
          warning_max: 500
        },
        {
          name: "鹽度",
          value: 567,
          valuetime: "2020/01/01 12:00:00",
          min: 0,
          max: 999,
          critical_min: 200,
          critical_max: 800,
          warning_min: 300,
          warning_max: 500
        },
        {
          name: "溶養2",
          value: 567,
          valuetime: "2020/01/01 12:00:00",
          min: 0,
          max: 999,
          critical_min: 200,
          critical_max: 800,
          warning_min: 300,
          warning_max: 500
        },
        {
          name: "酸鹼值",
          value: 567,
          valuetime: "2020/01/01 12:00:00",
          min: 0,
          max: 999,
          critical_min: 200,
          critical_max: 800,
          warning_min: 300,
          warning_max: 500
        },
        {
          name: "溶養2",
          value: 567,
          valuetime: "2020/01/01 12:00:00",
          min: 0,
          max: 800,
          critical_min: 100,
          warning_min: 200,
          warning_max: 650,
          critical_max: 750,
          
          
        }
      ]
    };
  },
  methods: {
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background-color:lightblue;color:#fff;font-weight:500;";
      }
    }
  }
};
</script>

<style scoped>
.circle {
  border: 1px solid;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  position: relative;
}
.circletitle {
  position: relative;
  display: block;
  top: 50%;
  left: 50%;
  font-size: 1.2em;
  transform: translate(-50%, -50%);
}
</style>
