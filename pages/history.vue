<template>
    <div>
        <v-overlay :value="!isLoading" :absolute="true">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card class="bg-card">
            <div class="content pt-3">
                <span>
                    <h2>{{ this.$options.head().title }}</h2>
                </span>
                <div class="search mb-3">
                    <v-row class="mb-0">
                        <v-col cols="12" md="3" sm="12" style="position: relative;">
                            <locate-select :dataScope="'pool'" :isMulti="false" @scopeSel_data="get_scopeData($event)"
                                class="select-template"></locate-select>
                        </v-col>
                    </v-row>
                </div>
                <div class="result">
                    <div class="result-card">
                        <!-- 養殖池 -->
            <v-row class="mb-3 align-stretch" style="height: 100%;" id="chart">
            
              <!-- 案場資訊 -->
              <v-col v-if="false" cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">案場資訊</span>
                      </v-card-title>
                    </div>
                    <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                  </div>
                  <div class="content">
                    <v-row class="mb-4">
                      <v-col cols="12">
                        <el-table :data="farmData" class="full-width" max-height="240"  size="mini">
                                                <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                                                <el-table-column prop="item_value" label="數值" width="180"></el-table-column>
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <!-- 養殖資訊 -->
              <v-col v-if="false" cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">養殖資訊</span>
                      </v-card-title>
                    </div>
                    <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                  </div>
                  <div class="content">
                    <v-row class="mb-4">
                      <v-col cols="12">
                        <el-table :data="feedData" class="full-width" max-height="240"  size="mini">
                                                <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                                                <el-table-column prop="item_value" label="使用量/數值" width="180"></el-table-column>
                                                <el-table-column prop="item_price" label="金額" width="180"></el-table-column>
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
              </v-card>
              </v-col>
              <!-- 財務-費用 -->
              <v-col cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">財務-累計費用</span>
                      </v-card-title>
                    </div>
                    <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                  </div>
                  <div class="content">
                    <v-row class="mb-4">
                      <v-col cols="12">
                        <el-table :data="feeData_Backup" class="full-width" max-height="500"  size="mini">
                                                <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                                                <el-table-column prop="item_qty" label="使用量" width="180"></el-table-column>
                                                <el-table-column prop="item_value" label="金額" width="180"></el-table-column>
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
              </v-card>
              </v-col>
              <!-- 財務-收入 -->
              <v-col cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">財務-收入</span>
                      </v-card-title>
                    </div>
                    <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                  </div>
                  <div class="content">
                    <v-row class="mb-4">
                      <v-col cols="12">
                        <el-table :data="incomeData" class="full-width" max-height="240"  size="mini">
                                                <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                                                <el-table-column prop="item_qty" label="使用量" width="180"></el-table-column>
                                                <el-table-column prop="item_value" label="金額" width="180"></el-table-column>
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
              </v-card>
              </v-col>
            </v-row>
                    </div>
                    
                </div>
            </div>
        </v-card>

        <el-image-viewer v-if="isOriginImg" :on-close="() => { isOriginImg = false }" :url-list="srcList" />
    </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";

export default {
    layout: "emptynologin2",
    middleware: "auth",
    components: {
        "el-image-viewer": () => import("element-ui/packages/image/src/image-viewer"),
    },
    head() {
        return {
            title: '歷史數據'
        };
    },
    data() {
        return {
            poolid: '',
            isLoading: false,
            isOriginImg: false,
            srcList: [],
            nowPool: '',
            farmData: [{item_name: '養殖池水位高度(%)', item_value: '15'}, {item_name: '養殖池總水體(噸)', item_value: '834'},
                        {item_name: '白蝦放養密度(尾/噸)', item_value: '252'}, {item_name: '白蝦放養總量(尾/水)', item_value: '210168.00'},
                        // {item_name: '目標收成重量(公克/尾)', item_value: '35'},
                        {item_name: '平均蝦重(g)', item_value: '35'},
                        { item_name: '當前育成率', item_qty: '-', item_value: '-' },
                      ],
          feedData: [{ item_name: '溶氧(ppm)', item_value: '28.5' }, { item_name: '酸鹼值', item_value: '7.8' },
          { item_name: '氨氮(ppm)', item_value: '5.2' }, { item_name: '水位(%)', item_value: '0.02' },
          { item_name: '水溫(°C)', item_value: '30' }, { item_name: '亞硝酸(ppm)', item_value: '0.1' },
          { item_name: '預估蝦子重量', item_value: '(歷史數據才有)' }, { item_name: '預估平均每日增重(adg)', item_value: '(歷史數據才有)' }
            , { item_name: '預估存活率', item_value: '(歷史數據才有)' },
            //-------------------------------
            { item_name: '用電量(度)', item_qty: '-', item_value: '10000' },
          { item_name: '契約用電量', item_qty: '-', item_value: '300' },
          { item_name: '飼料(展開show細項)', item_qty: '10', item_value: '-' }, 
          { item_name: '糖(展開show細項)', item_qty: '5', item_value: '-' },
          { item_name: '益生菌(展開show細項)', item_qty: '10', item_value: '-' },
          { item_name: '水質改善劑(展開show細項)', item_qty: '-', item_value: '-' }, 
          { item_name: '檢測費(展開show細項)', item_qty: '-', item_value: '-' },
          //  { item_name: '檢測費(試劑、儀器)', item_qty: '-', item_value: '-' },
          // { item_name: '累計檢測費(疾病)', item_qty: 5, item_value: '-' }, 
          { item_name: '雜費(展開show細項)', item_qty: 5, item_value: '-' },
          { item_name: '人事費用', item_qty: '-', item_value: '-' },
          // { item_name: '蝦苗(元/尾)', item_qty: '0.25', item_value: '-' },
          { item_name: '蝦苗(總價)', item_qty: '-', item_value: '60000' },
          ],
          feeData_Backup: [{ item_name: '用電量(度)', item_qty: '-', item_value: '10000' },
          { item_name: '契約用電量', item_qty: '-', item_value: '300' },
          { item_name: '飼料(展開show細項)', item_qty: '10', item_value: '-' }, 
          { item_name: '糖(展開show細項)', item_qty: '5', item_value: '-' },
          { item_name: '益生菌(展開show細項)', item_qty: '10', item_value: '-' },
          { item_name: '水質改善劑(展開show細項)', item_qty: '-', item_value: '-' }, 
          { item_name: '檢測費(展開show細項)', item_qty: '-', item_value: '-' },
          //  { item_name: '檢測費(試劑、儀器)', item_qty: '-', item_value: '-' },
          // { item_name: '累計檢測費(疾病)', item_qty: 5, item_value: '-' }, 
          { item_name: '雜費(展開show細項)', item_qty: 5, item_value: '-' },
          { item_name: '人事費用', item_qty: '-', item_value: '-' },
          // { item_name: '蝦苗(元/尾)', item_qty: '0.25', item_value: '-' },
          { item_name: '蝦苗(總價)', item_qty: '-', item_value: '60000' },
          ],
          incomeData: [
          { item_name: '目標收成蝦重(g)', item_qty: '-', item_value: '-' },
          { item_name: '預估育成率', item_qty: '-', item_value: '-' },
          { item_name: '預估收成總重(公斤)', item_qty: '2000', item_value: '-' },
          { item_name: '預估白蝦單價(元/公斤)', item_qty: '383.2', item_value: '-' }, { item_name: '預估收益(元/水)', item_qty: '-', item_value: '766400' },
          { item_name: '單位成本(元/公斤)', item_qty: '-', item_value: '35' }, 
          ],
        };
    },
    methods: {
        async getAllUser() {
            let getuserData = await this.getUserList();
            this.userData = typeof getuserData === 'string' ? [] : getuserData.filter(x => x.is_active);
            this.isLoading = true;
        },
        get_scopeData(evt) {
            this.poolid = evt;
        }
    },
    async mounted() {
        await this.getAllUser();
        window.addEventListener('resize', () => {
            this.tableHeight = window.innerHeight - 208;
            this.innerWidth = window.innerWidth;
        });
    }
};
</script>

<style lang="scss" scoped>
.v-sheet.result-card.pool-detail.v-card:not(.v-sheet--outlined) {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.v-card.result-card.pool-detail {
  background-color: #fff;
  .card-title {
    border-bottom: 1px solid $color-black-10;
    background-color: rgba($color-primary,0.1);
  }
  .content .col-12 {
    padding: 0;
    
  }
}


</style>