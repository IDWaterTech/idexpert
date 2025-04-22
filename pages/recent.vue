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
            <v-col cols="11" md="3" sm="11" style="position: relative;">
              <locate-select :dataScope="'pool'" :isMulti="false" @scopeSel_data="get_scopeData($event)"
                class="select-template"></locate-select>
            </v-col>
            <v-col cols="1" md="1" sm="1" class="text-center">
              <v-btn class="mx-2" icon small color="primary">
                          <v-icon>mdi-reload</v-icon>
                        </v-btn>
              </v-col>  
          </v-row>
        </div>
        <div class="result">
          <div class="result-card">
            <!-- 養殖池 -->
            <v-row class="mb-3 align-stretch" style="height: 100%;" id="chart">

              <!-- 案場資訊 -->
              <v-col cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">案場資訊</span>
                        <v-btn v-if="false" class="mx-2" icon small color="primary" @click="dlg_farmData = true">
                          <v-icon>mdi-pen</v-icon>
                        </v-btn>
                      </v-card-title>
                    </div>
                    <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                  </div>
                  <div class="content">
                    <v-row class="mb-4">
                      <v-col cols="3" class="text-center">
                          <div>
                            <img src="https://test.idwatertech.com/media/shrimp_record/20241209105823_117/LINE_ALBUM_2024_%E8%9D%A6%E6%B3%81%E7%85%A7%E7%89%87%E6%97%A5%E5%B8%B8%E8%A7%80%E5%AF%9F%E6%89%93%E6%A8%A3%E6%94%BE%E8%8B%97%E6%94%B6%E6%88%90%E7%AD%89%E8%88%87%E8%9D%A6%E9%9A%BB%E6%9C%89%E9%97%9C%E7%9A%84%E7%85%A7%E7%89%87%E7%B4%80%E9%8C%84_241209_9.jpg" 
                            style="max-height: 300px;" @click="viewOrigin('https://test.idwatertech.com/media/shrimp_record/20241209105823_117/LINE_ALBUM_2024_%E8%9D%A6%E6%B3%81%E7%85%A7%E7%89%87%E6%97%A5%E5%B8%B8%E8%A7%80%E5%AF%9F%E6%89%93%E6%A8%A3%E6%94%BE%E8%8B%97%E6%94%B6%E6%88%90%E7%AD%89%E8%88%87%E8%9D%A6%E9%9A%BB%E6%9C%89%E9%97%9C%E7%9A%84%E7%85%A7%E7%89%87%E7%B4%80%E9%8C%84_241209_9.jpg',undefined)" /><br/>
                            <span>2024-12-09 10:58:23</span>
                          </div>
                      </v-col>
                      <v-col cols="9">
                        <el-table :data="farmData" class="full-width" max-height="240" size="mini">
                          <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                          <el-table-column prop="item_value" label="數值" width="180"></el-table-column>
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <!-- 養殖資訊 -->
              <v-col cols="12" class="mb-1 pt-0 pb-0">
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
                        <el-table :data="feedData" class="full-width" max-height="600" size="mini">
                          <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                          <el-table-column prop="item_value" label="使用量/數值" width="180"></el-table-column>
                          <!-- <el-table-column prop="item_price" label="金額" width="180"></el-table-column> -->
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <!--隱藏 財務-費用 -->
              <v-col v-if="false" cols="12" class="mb-1 pt-0 pb-0">
                <v-card class="result-card pool-detail" style="height: calc(100% - 14px);">
                  <div class="card-title px-3 py-2">
                    <div class="title">
                      <v-card-title class="px-0 py-0"><span class="mr-1">財務-費用</span>
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
                        <el-table :data="feeData_Backup" class="full-width" max-height="550" size="mini">
                          <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                          <el-table-column prop="item_qty" label="使用量" width="180"></el-table-column>
                          <el-table-column prop="item_value" label="金額" width="180"></el-table-column>
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <!--隱藏 財務-收入 -->
              <v-col v-if="false" cols="12" class="mb-1 pt-0 pb-0">
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
                        <el-table :data="incomeData" class="full-width" max-height="240" size="mini">
                          <el-table-column prop="item_name" label="項目" :fixed="true" align="center"></el-table-column>
                          <el-table-column prop="item_qty" label="使用量" width="180"></el-table-column>
                          <el-table-column prop="item_value" label="金額" width="180"></el-table-column>
                        </el-table>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <!-- 一堆dialog -->
            </v-row>
          </div>
          <v-dialog v-model="dlg_farmData" scrollable max-width="300px">
            <v-card>
              <v-card-title>Select Country</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 300px;">
                <v-radio-group column>
                  <v-radio label="Bahamas, The" value="bahamas"></v-radio>
                  <v-radio label="Bahrain" value="bahrain"></v-radio>
                  <v-radio label="Bangladesh" value="bangladesh"></v-radio>
                  <v-radio label="Barbados" value="barbados"></v-radio>
                  <v-radio label="Belarus" value="belarus"></v-radio>
                  <v-radio label="Belgium" value="belgium"></v-radio>
                  <v-radio label="Belize" value="belize"></v-radio>
                  <v-radio label="Benin" value="benin"></v-radio>
                  <v-radio label="Bhutan" value="bhutan"></v-radio>
                  <v-radio label="Bolivia" value="bolivia"></v-radio>
                  <v-radio label="Bosnia and Herzegovina" value="bosnia"></v-radio>
                  <v-radio label="Botswana" value="botswana"></v-radio>
                  <v-radio label="Brazil" value="brazil"></v-radio>
                  <v-radio label="Brunei" value="brunei"></v-radio>
                  <v-radio label="Bulgaria" value="bulgaria"></v-radio>
                  <v-radio label="Burkina Faso" value="burkina"></v-radio>
                  <v-radio label="Burma" value="burma"></v-radio>
                  <v-radio label="Burundi" value="burundi"></v-radio>
                </v-radio-group>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- 圖片預覽 -->
          <el-image-viewer
            v-if="isOriginImg"
            :on-close="()=>{isOriginImg=false}"
            :url-list="srcList"
          />
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
            title: '近況更新'
        };
    },
    data() {
        return {
            srcList: [],
            isOriginImg: false,
            poolid: '',
            isLoading: false,
            isOriginImg: false,
            srcList: [],
            nowPool: '',
            farmData: [{item_name: '養殖池水位高度(m)', item_value: '15'}, {item_name: '養殖池總水體(噸)', item_value: '834'},
                        {item_name: '白蝦放養密度(尾/噸)', item_value: '252'}, {item_name: '白蝦放養總量(尾/水)', item_value: '210168.00'},
                        // {item_name: '目標收成重量(公克/尾)', item_value: '35'},
                        {item_name: '平均蝦重(g)', item_value: '35'},
                        
                      ],
          feedData: [{ item_name: '溶氧(ppm)', item_value: '28.5' }, { item_name: '酸鹼值', item_value: '7.8' },
          { item_name: '氨氮(ppm)', item_value: '5.2' }, { item_name: '水位(%)', item_value: '0.02' },
          { item_name: '水溫(°C)', item_value: '30' }, { item_name: '亞硝酸(ppm)', item_value: '0.1' },
          //{ item_name: '預估蝦子重量', item_value: '(歷史數據才有)' }, 
          // { item_name: '預估平均每日增重(adg)', item_value: '(歷史數據才有)' }
          //   , { item_name: '預估存活率', item_value: '(歷史數據才有)' }
          //----------------------
          { item_name: '用電量(度)', item_qty: '-', item_value: '10000' },
          //暫隱{ item_name: '攤提契約用電量', item_qty: '-', item_value: '300' },
          { item_name: '飼料(展開show細項)', item_qty: '-', item_value: '-' },
          { item_name: '糖(展開show細項)', item_qty: '-', item_value: '-' },
          { item_name: '益生菌(展開show細項)', item_qty: '-', item_value: '-' },
          { item_name: '水質改善劑(展開show細項)', item_qty: '-', item_value: '-' }, 
          { item_name: '當前育成率', item_qty: '-', item_value: '-' },
          { item_name: '目標收成蝦重(g)', item_qty: '-', item_value: '-' },
          { item_name: '預估育成率', item_qty: '-', item_value: '-' },
          { item_name: '預估收成總重(公斤)', item_qty: '2000', item_value: '-' },
          //暫隱{ item_name: '檢測費(展開show細項)', item_qty: '-', item_value: '-' }, 
          // { item_name: '檢測費(試劑、儀器)', item_qty: '-', item_value: '-' },
          // { item_name: '檢測費(疾病)', item_qty: 5, item_value: '-' }, 
          //暫隱{ item_name: '雜費(展開show細項)', item_qty: 5, item_value: '-' },
          //暫隱{ item_name: '每月人事費用', item_qty: '-', item_value: '-' },
          //{ item_name: '蝦苗(元/尾)', item_qty: '0.25', item_value: '-' },
          //暫隱{ item_name: '蝦苗(總價)', item_qty: '-', item_value: '60000' },
          ],
          feeData_Backup: [{ item_name: '用電量(度)', item_qty: '-', item_value: '10000' },
          //暫隱{ item_name: '攤提契約用電量', item_qty: '-', item_value: '300' },
          { item_name: '飼料(展開show細項)', item_qty: '-', item_value: '-' },
          { item_name: '糖(展開show細項)', item_qty: '-', item_value: '-' },
          { item_name: '益生菌(展開show細項)', item_qty: '-', item_value: '-' },
          { item_name: '水質改善劑(展開show細項)', item_qty: '-', item_value: '-' }, 
          //暫隱{ item_name: '檢測費(展開show細項)', item_qty: '-', item_value: '-' }, 
          // { item_name: '檢測費(試劑、儀器)', item_qty: '-', item_value: '-' },
          // { item_name: '檢測費(疾病)', item_qty: 5, item_value: '-' }, 
          //暫隱{ item_name: '雜費(展開show細項)', item_qty: 5, item_value: '-' },
          //暫隱{ item_name: '每月人事費用', item_qty: '-', item_value: '-' },
          //{ item_name: '蝦苗(元/尾)', item_qty: '0.25', item_value: '-' },
          { item_name: '蝦苗(總價)', item_qty: '-', item_value: '60000' },
          ],
          incomeData: [
          // { item_name: '目標收成蝦重(g)', item_qty: '-', item_value: '-' },
          // { item_name: '預估育成率', item_qty: '-', item_value: '-' },
          // { item_name: '預估收成總重(公斤)', item_qty: '2000', item_value: '-' },
          { item_name: '預估白蝦單價(元/公斤)', item_qty: '383.2', item_value: '-' }, { item_name: '預估收益(元/水)', item_qty: '-', item_value: '766400' },
          { item_name: '單位成本(元/公斤)', item_qty: '-', item_value: '35' }, 
          ],
          dlg_farmData: false,
        };
    },
    methods: {
      //看圖片
        viewOrigin(item,type) {
          this.srcList = [];//清空
          this.isOriginImg = true;
          this.srcList.push(item);//放入圖片
        },
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