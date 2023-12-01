<template>
  <div class="basic">
    <v-card class="bg-card" style="margin-bottom: 16px;">
        <!-- <div class="card-title">
            <v-row style="margin-bottom: 0;">
                <div class="title">
                    <v-icon>mdi-chart-bell-curve</v-icon>
                    <v-card-title>監測數據</v-card-title>
                </div>
            </v-row>
        </div> -->
        <div class="content" style="padding-left: 0;padding-top:12px;padding-bottom: 0;">
          <!-- 搜尋 -->
          <div class="search">
            <v-row style="margin-bottom: 4px;align-items: center;">
              <!-- 選擇場區 -->
              <v-col cols="12" md="4" sm="12" style="position: relative;">
                <locate-select class="select-template" :dataScope="'area'" :defaultSelect="defaultPool" :isMulti="false" @scopeSel_data="get_scopeData($event);resultListOpen=true;closepanel();" style="margin-right: 0;"></locate-select>
              </v-col>
              <!-- 選擇起始日 -->
              <v-col cols="12" md="3" sm="12">
                <v-menu v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40"
                  transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="sdate" label="選擇起日" prepend-icon="mdi-calendar" readonly dense hide-details style="height: 20px;"
                      v-bind="attrs" v-on="on" @click:prepend="
                        () => {
                          sdate = getNowDate();
                          daysSet();
                          closepanel();
                        }
                      "></v-text-field>
                  </template>
                  <v-date-picker v-model="sdate" locale="zh-tw" no-title @input="
                    menu_startdate = false;
                  daysSet();
                  closepanel();
                  "></v-date-picker>
                </v-menu>
              </v-col>
              <!-- 選擇迄日 -->
              <v-col cols="12" md="3" sm="12">
                <v-menu v-model="menu_enddate" :close-on-content-click="false" :nudge-right="40"
                  transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="edate" label="選擇訖日" prepend-icon="mdi-calendar" readonly dense hide-details style="height: 20px;"
                      v-bind="attrs" v-on="on" @click:prepend="
                        () => {
                          edate = getNowDate();
                          daysSet();
                          closepanel();
                        }
                      "></v-text-field>
                  </template>
                  <v-date-picker v-model="edate" locale="zh-tw" no-title @input="
                    menu_enddate = false;
                  daysSet();
                  closepanel();
                  "></v-date-picker>
                </v-menu>
              </v-col>
              <v-col v-if="sel_main&&windowWidth>959.98 " cols="12" sm="1">
                <v-text-field label="天數" step="1" min="0" type="number" v-model.number="days" @input="daychange();closepanel();"
                  class="mx-1" dense hide-details></v-text-field>
              </v-col>
            </v-row>
          </div>
          <div class="result">
            <div class="result-card">
              <!-- 統整小卡 養殖池 -->
              <v-row v-if="false" style="margin-bottom: 4px;width: 100%;align-items: flex-start;height: 100%;position: relative;" id="chart">
                <!-- 統整小卡 直式 -->
                <v-col cols="12" md="3" style="padding-top: 0; padding-bottom: 4px;display: flex;flex-direction: column;">
                  <v-row style="margin-bottom: 0;">
                    <v-col cols="12" md="12" sm="4" style="padding: 0;">
                      <v-card class="dashboard">
                        <div class="icon" style="border-radius: 50%;">
                          <v-icon >mdi-focus-field</v-icon>
                        </div>
                        <div class="total-text">
                          <div class="title">
                            養殖池
                          </div>
                          <div class="content" style="padding: 0;">
                            <!-- {{ total.pool }} 個 -->
                            <number-count-up v-if="showPredict" :id="'num1'" :endVal="total.pool" suffix=" 池" :myReady="onReady"></number-count-up>
                          </div>
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="12" sm="4"
                      :style="{'padding':`${windowWidth>959.98||windowWidth<599.98?'0':'0 8px'}`}">
                      <v-card class="dashboard pond">
                        <div class="icon" style="border-radius: 50%;">
                          <v-icon >mdi-dots-grid</v-icon>
                        </div>
                        <div class="total-text">
                          <div class="title">
                            小池數
                          </div>
                          <div class="content" style="padding: 0;">
                            <!-- {{ total.pond }} 個 -->
                            <number-count-up v-if="showPredict" :id="'num2'" :endVal="total.pond" suffix=" 個" :myReady="onReady"></number-count-up>
                          </div>
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="12" sm="4" style="padding: 0;">
                      <v-card class="dashboard predict">
                        <div class="icon" style="border-radius: 50%;">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.468 8.18c-.484-.547-.04-1.404.686-1.325l6.166.675c2.095.23 3.307 2.49 2.338 4.362l-.169.326c-.969 1.871-3.514 2.187-4.91.608L6.468 8.18Zm6.984-5.654a.231.231 0 0 1-.126-.042 3.796 3.796 0 0 0-5.918 3.82.197.197 0 0 1 0 .079c-.044.206-.36.263-.403.056A4.217 4.217 0 0 1 13.6 2.162c.17.122.06.37-.148.364Z" fill="#E8956F"/><path d="M15.375 5.8a.234.234 0 0 1-.113-.067 3.794 3.794 0 0 0-6.017.618.233.233 0 0 1-.089.084c-.188.1-.402-.085-.292-.268a4.216 4.216 0 0 1 6.732-.694c.143.156-.017.379-.221.327Z" fill="#E8956F"/><path fill-rule="evenodd" clip-rule="evenodd" d="m14.739 17.26-.342.081a.306.306 0 0 0-.112.052l-.779.574a.2.2 0 0 1-.273-.034.178.178 0 0 1 .032-.257l.877-.646a.006.006 0 0 0 .003-.007l.572-.135a4.4 4.4 0 0 0-.144-.75l-.65.092a.314.314 0 0 0-.118.042l-.847.505a.204.204 0 0 1-.271-.058.177.177 0 0 1 .054-.253l.953-.569a.006.006 0 0 0 .003-.006l.76-.108a4.834 4.834 0 0 0-1.083-1.678 3.108 3.108 0 0 0 2.592-1.684 3.11 3.11 0 0 0 .353-1.372c1.555 1.018 2.59 2.62 2.675 4.461.134 2.883-2.104 5.394-5.194 6.075l-.557 1.315a.94.94 0 1 1-1.528-1.034l-.022.004a.94.94 0 1 1 .24-1.767l1.297.638-.001.01c.961-.935 1.534-2.164 1.51-3.49Zm.919-1.37a.134.134 0 0 0-.05.013c-.12.054-.099.22.033.216a2.272 2.272 0 0 0 2.155-1.82c.026-.127-.143-.17-.212-.058a.132.132 0 0 0-.016.04 2.044 2.044 0 0 1-1.91 1.61Zm.194 1.89c.083 0 .165.008.246.022a2.044 2.044 0 0 0 1.56-.386.142.142 0 0 1 .026-.017c.137-.062.26.081.142.174a2.27 2.27 0 0 1-.843.412c-.402.102-.807.09-1.18-.016-.123-.035-.083-.19.046-.19h.003Zm-3.956 3.124c-.178-.023-.24.128-.063.157.144.023.292.032.442.025.132-.006.102-.146-.03-.152a4.04 4.04 0 0 1-.349-.03Zm.596 1.569c-.13.125-.214-.016-.087-.145.083-.085.16-.172.234-.26.084-.103.213-.043.14.066a2.115 2.115 0 0 1-.287.339Z" fill="#E8956F"/></svg>
                        </div>
                        <div class="total-text">
                          <div class="title">
                            預估放養
                          </div>
                          <div class="content" style="padding: 0;">
                            <number-count-up v-if="showPredict" :id="'num3'" :endVal="total.predict" suffix=" 隻" :myReady="onReady"></number-count-up>
                          </div>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                  
                </v-col>
                <!-- 養殖池 -->
                <v-col cols="12" md="9" style="margin-bottom: 4px;padding-top: 0;padding-right: 0;padding-bottom: 0;">
                  <v-card class="result-card pool-detail" style="height: calc(100% - 14px);position: absolute;width: calc(100% / 12 * 9 - 12px);"
                    :style="{'position':`${windowWidth>959.98?'absolute':'initial'}`,
                              'width':`${windowWidth>959.98?'calc(100% / 12 * 9 - 12px)':'100%'}`}">
                    <div class="card-title" style="padding: 8px 12px;padding-bottom: 8px;">
                      <div class="title">
                          <v-card-title style="padding: 0;">養殖池資訊</v-card-title>
                      </div>
                      <!-- <div class="chevron" >
                        <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                        <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                      </div> -->
                    </div>
                    <div v-if="resultListOpen" class="content" style="padding: 0 12px;">
                      <v-row style="margin-bottom: 0;">
                        <v-col cols="12">
                          <el-table :data="mainpool.items" style="width: 100%;" max-height="200" show-summary size="mini"
                            :summary-method="getSummaries">
                            <!-- headers{ text: "name", value: "name", groupable: false }, -->
                            <el-table-column prop="labelname" label="養殖池" width="70" :fixed="true" align="center">
                              <template slot-scope="scope">
                                <a v-if="$store.state.mydata.gobal_api.apiUrl.includes(':8011')" :href="`/pool/?id=${scope.row.id}`" target="_blank">{{
                                    scope.row.name
                                }}</a>
                                <div v-else>{{
                                    scope.row.name
                                }}</div>
                              </template>
                            </el-table-column>
                            <el-table-column v-for="(item, key) in headers.filter(
                              x => x.text != fixedname
                            )" :fixed="item.text == fixedname" :prop="item.value" :label="item.text" :key="key" align="center"
                              >
                            </el-table-column>
                          </el-table>
                          <v-data-table :headers="headers" :items="mainpool.items" item-key="unit" :footer-props="footerProps"
                            no-data-text="查無資料" disable-sort :loading="tableloading" style="height: 100%;width: 100%;" v-if="false">
                          </v-data-table>
                        </v-col>
                        <!-- 圓餅圖 -->
                        <!-- <v-col cols="12" md="4">

                        </v-col> -->
                      </v-row>
                    </div>
                    
                  </v-card>
                </v-col>
              </v-row>
              <!-- 圖表 -->
              <v-row style="margin-bottom: 0;" >
                <v-col cols="12" style="padding-top: 0;">
                  <v-card class="result-card">
                    <div class="content">
                      <div class="header-bar" style="padding: 12px 0;padding-top: 4px;">
                        <v-tabs v-model="currenttab" show-arrows>
                          <!-- 上方tab -->
                          <v-tab v-for="(tab, idx) in tabs" :key="'tabs-'+idx" :href="`#` + tab.name">
                            {{ tab.name }}
                          </v-tab>
                          <!-- 水質監測 -->
                          <v-tab-item :value="'水質監測'">
                            <v-overlay :value="waterloading" :absolute="true">
                              <v-progress-circular indeterminate size="64"></v-progress-circular>
                            </v-overlay>
                            <v-card>
                              <v-card-text style="padding: 12px 0;">
                                <!-- 搜尋 -->
                                <v-row style="margin-bottom: 0;">
                                  <!-- 指定項目 -->
                                  <v-col cols="12" md="6" align-self="center" class="mutiselect">
                                    <v-select v-model="defitem" clearable multiple filled deletable-chips chips dense hide-details
                                      placeholder="指定項目" :items="Object.keys(allcols.water)" v-if="allcols.water"
                                      :disabled="waterloading == true">
                                    </v-select>
                                    <div  v-if="windowWidth<959.98" class="spector" @click="setDefitem" style="padding-top: 4px;">主要觀測項目

                                    </div>
                                  </v-col>
                                  <!-- 養殖池 -->
                                  <v-col cols="12" md="5" v-if="Object.keys(allcols).length > 0 && waterloading == false" class="mutiselect"
                                    :style="{'padding':`${windowWidth>959.98?'12px':'0 12px 12px 12px'}`}">
                                    <v-select v-model="defPool.水質" clearable multiple deletable-chips chips hide-details placeholder="顯示養殖池" 
                                      :items="waterdata.map(x => x['name'])" v-if="allcols.water" no-data-text="查無資料">
                                      <!-- <template
                                        v-slot:selection="{ item }">
                                        <v-chip
                                            style="font-size: 12px;margin: 2px;color: #fff;"
                                            color="#408FBC"
                                            class="main"
                                            close
                                        >
                                        {{ item }}
                                        </v-chip>
                                        
                                    </template> -->
                                    </v-select>
                                  </v-col>
                                  <!-- 查詢 -->
                                  <v-col cols="12" md="1" align-self="center" v-if="windowWidth>959.98"
                                    style="display: flex;align-items: center;width: 100%;"
                                    :style="{'justifyContent':`${windowWidth<599.98?'flex-start':'flex-end'}`}">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                </v-row>
                                <!-- 觀測項目/圖表顯示控制 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="6"  md="6" sm="4" align-self="center" style="padding-top: 0;" v-if="windowWidth<959.98">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <!-- 主要觀測項目 -->
                                  <v-col v-if="windowWidth>959.98" cols="6" md="6" sm="4" align-self="center" style="padding-top: 0;">
                                    <div class="spector" @click="setDefitem">主要觀測項目

                                    </div>
                                    <!-- <v-btn rounded block color="primary" @click="
                                      () => {
                                        this.defitem = [
                                          '亞硝酸鹽濃度',
                                          '氨氮濃度',
                                          '水溫',
                                          '溶氧濃度',
                                          '酸鹼濃度'
                                        ];
                                      }
                                    ">主要觀測項目</v-btn> -->
                                  </v-col>
                                  <!-- 圖表顯示控制 -->
                                  <v-col cols="6" md="6" sm="8" style="display: flex;align-items: center;width: 100%;padding-top: 0;justify-content: flex-end;">
                                    <div class="chart-toggle" style="display: flex;align-items: center;">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        style="margin-top: 0;margin-left: 8px;"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row" style="display: flex;flex-direction: column;">
                                        <!-- 顯示：{{ colstyle + 1 }}欄式 -->
                                        <v-btn-toggle v-model="colstyle" dark mandatory class="btn-toggles">
                                          <v-btn small>
                                            <v-icon>mdi-square-medium</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-pause</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-view-column</v-icon>
                                          </v-btn>
                                        </v-btn-toggle>
                                    </div>
                                    
                                  </v-col>
                                </v-row>
                                <!-- 圖表 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in waterdata"
                                    :key="item.id" v-show="
                                      defPool.水質.includes(item.name) || defPool.水質.length == 0
                                    ">
                                    <h1 class="pool-name">{{ item.name }}池</h1>
                                    <!-- defitem -->
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.water" xColName="inspected_date"
                                      :defaultitem="defalutItemList" :loading="waterloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <!-- 無資料 -->
                                <v-row v-if="waterdata.length < 1 && waterloading == false" style="margin-bottom: 0;">
                                  <v-spacer></v-spacer>
                                  <v-col cols="4" class="text-center">
                                    <h4>暫無資料</h4>
                                  </v-col>
                                  <v-spacer></v-spacer>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <!-- 環境監測 -->
                          <v-tab-item :value="'環境監測'">
                            <v-overlay :value="envloading" :absolute="true">
                              <v-progress-circular indeterminate size="64"></v-progress-circular>
                            </v-overlay>
                            <v-card>
                              <v-card-text style="padding: 12px 0;">
                                <!-- 搜尋 -->
                                <v-row style="margin-bottom: 0;">
                                  <!-- 指定項目 -->
                                  <v-col cols="12" md="6"  class="mutiselect">
                                    <v-select v-model="defitem_env" clearable multiple deletable-chips chips hide-details placeholder="指定項目"
                                      :items="Object.keys(allcols.env)" v-if="allcols.env" :disabled="envloading == true">
                                    </v-select>
                                    <!-- <v-select
                                      v-model="defitem_env"
                                      clearable
                                      multiple
                                      chips
                                      placeholder="指定項目"
                                      :items="Object.keys(envdatacols)"
                                      v-if="envdatacols"
                                    >
                                    </v-select> -->
                                  </v-col>
                                  <!-- 養殖池 -->
                                  <v-col cols="12" md="5" v-if="Object.keys(allcols).length > 0 && envloading == false" class="mutiselect"
                                    :style="{'padding':`${windowWidth>959.98?'12px':'0 12px 12px 12px'}`}">
                                    <v-select v-model="defPool.環境" clearable multiple deletable-chips chips hide-details placeholder="顯示養殖池" 
                                      :items="envdata.map(x => x['name'])" v-if="allcols.env" no-data-text="查無資料">
                                    </v-select>
                                  </v-col>
                                  <!-- <v-col cols="12" md="3" v-if="Object.keys(allcols).length > 0 && envloading == false">
                                    <v-select v-model="defPool.環境" clearable multiple chips placeholder="顯示養殖池"
                                      :items="envdata.map(x => x['name'])" v-if="allcols.env" no-data-text="查無資料">
                                    </v-select>
                                  </v-col> -->
                                  
                                  <v-col cols="12" md="1" align-self="center" v-if="windowWidth>959.98"
                                    style="display: flex;align-items: center;width: 100%;">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  
                                  
                                  <!-- <v-col cols="12" md="3">
                                    顯示：{{ colstyle + 1 }}欄式
                                    <v-btn-toggle v-model="colstyle" dense mandatory>
                                      <v-btn small>
                                        <v-icon>mdi-square-medium</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-pause</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-view-column</v-icon>
                                      </v-btn>
                                    </v-btn-toggle>
                                  </v-col> -->
                                </v-row>
                                <!-- 圖表顯示控制 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="6" align-self="center"  v-if="windowWidth<959.98" style="padding-top: 0;">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" style="display: flex;align-items: center;width: 100%;padding-top: 0;justify-content: flex-end;">
                                    
                                    <div class="chart-toggle" style="display: flex;align-items: center;">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        style="margin-top: 0;margin-left: 8px;"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row" style="display: flex;flex-direction: column;">
                                        <!-- 顯示：{{ colstyle + 1 }}欄式 -->
                                        <v-btn-toggle v-model="colstyle" dark mandatory class="btn-toggles">
                                          <v-btn small>
                                            <v-icon>mdi-square-medium</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-pause</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-view-column</v-icon>
                                          </v-btn>
                                        </v-btn-toggle>
                                    </div>
                                    
                                  </v-col>
                                </v-row>
                                <!-- 圖表 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in envdata"
                                    :key="item.id" v-show="
                                      defPool.環境.includes(item.name) || defPool.環境.length == 0
                                    ">
                                    <h1 class="pool-name">{{ item.name }}池</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.env" xColName="inspected_date"
                                      :defaultitem="defalutItemList_env" :loading="envloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <v-row v-if="envdata.length < 1 && envloading == false" style="margin-bottom: 0;">
                                  <v-spacer></v-spacer>
                                  <v-col cols="4" class="text-center">
                                    <h4>暫無資料</h4>
                                  </v-col>
                                  <v-spacer></v-spacer>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <!-- 投餵飼料 -->
                          <v-tab-item :value="'投餵飼料'">
                            <v-overlay :value="feedloading" :absolute="true">
                              <v-progress-circular indeterminate size="64"></v-progress-circular>
                            </v-overlay>
                            <v-card>
                              <v-card-text style="padding: 12px 0;">
                                <!-- 搜尋 -->
                                <v-row style="margin-bottom: 0;">
                                  <!-- 指定項目 -->
                                  <v-col cols="12" md="6" align-self="center" class="mutiselect">
                                    <v-select v-model="defitem_feed" clearable multiple filled deletable-chips chips dense hide-details
                                      placeholder="指定項目" :items="Object.keys(allcols.feed)" v-if="allcols.feed"
                                      :disabled="feedloading == true">
                                    </v-select>
                                  </v-col>
                                  <!-- 養殖池 -->
                                  <v-col cols="12" md="5" v-if="Object.keys(allcols).length > 0 && feedloading == false" class="mutiselect"
                                    :style="{'padding':`${windowWidth>959.98?'12px':'0 12px 12px 12px'}`}">
                                    <v-select v-model="defPool.飼料" clearable multiple deletable-chips chips hide-details placeholder="顯示養殖池" 
                                      :items="feeddata.map(x => x['name'])" v-if="allcols.feed" no-data-text="查無資料">
                                    </v-select>
                                  </v-col>
                                  
                                  
                                  <v-col cols="12" md="1" align-self="center"  v-if="windowWidth>959.98"
                                    style="display: flex;align-items: center;width: 100%;"
                                    :style="{'justifyContent':`${windowWidth<599.98?'flex-start':'flex-end'}`}">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  
                                  
                                  <!-- <v-col cols="12" md="3">
                                    顯示：{{ colstyle + 1 }}欄式
                                    <v-btn-toggle v-model="colstyle" dense mandatory>
                                      <v-btn small>
                                        <v-icon>mdi-square-medium</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-pause</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-view-column</v-icon>
                                      </v-btn>
                                    </v-btn-toggle>
                                  </v-col> -->
                                </v-row>
                                <!-- 圖表顯示控制 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="6" align-self="center"  v-if="windowWidth<959.98" style="padding-top: 0;">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" style="display: flex;align-items: center;width: 100%;padding-top: 0;justify-content: flex-end;">
                                    <div class="chart-toggle" style="display: flex;align-items: center;">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        style="margin-top: 0;margin-left: 8px;"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row" style="display: flex;flex-direction: column;">
                                        <!-- 顯示：{{ colstyle + 1 }}欄式 -->
                                        <v-btn-toggle v-model="colstyle" dark mandatory class="btn-toggles">
                                          <v-btn small>
                                            <v-icon>mdi-square-medium</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-pause</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-view-column</v-icon>
                                          </v-btn>
                                        </v-btn-toggle>
                                    </div>
                                    
                                  </v-col>
                                </v-row>
                                <!-- 圖表 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in feeddata"
                                    :key="item.id" v-show="
                                      defPool.飼料.includes(item.name) || defPool.飼料.length == 0
                                    ">
                                    <h1 class="pool-name">{{ item.name }}池</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.feed" xColName="inspected_date"
                                      :defaultitem="defalutItemList_feed" :loading="feedloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <v-row v-if="feeddata.length < 1 && feedloading == false" style="margin-bottom: 0;">
                                  <v-spacer></v-spacer>
                                  <v-col cols="4" class="text-center">
                                    <h4>暫無資料</h4>
                                  </v-col>
                                  <v-spacer></v-spacer>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <!-- 飼料觀察網 -->
                          <v-tab-item :value="'飼料觀察網'">
                            <v-overlay :value="envloading" :absolute="true">
                              <v-progress-circular indeterminate size="64"></v-progress-circular>
                            </v-overlay>
                            <v-card>
                              <v-card-text style="padding: 12px 0;">
                                <!-- 搜尋 -->
                                <v-row style="margin-bottom: 0;">
                                  <!-- 指定項目 -->
                                  <v-col cols="12" md="6" align-self="center" class="mutiselect">
                                    <v-select v-model="defitem_obs" clearable multiple filled deletable-chips chips dense hide-details
                                      placeholder="指定項目" :items="Object.keys(allcols.obs)" v-if="allcols.obs"
                                      :disabled="obsloading == true">
                                    </v-select>
                                  </v-col>
                                  
                                  <!-- 養殖池 -->
                                  <v-col cols="12" md="5" v-if="Object.keys(allcols).length > 0 && obsloading == false" class="mutiselect"
                                    :style="{'padding':`${windowWidth>959.98?'12px':'0 12px 12px 12px'}`}">
                                    <v-select v-model="defPool.觀察" clearable multiple deletable-chips chips hide-details placeholder="顯示養殖池" 
                                      :items="obsdata.map(x => x['name'])" v-if="allcols" no-data-text="查無資料">
                                    </v-select>
                                  </v-col>

                                  <v-col cols="12" md="1" align-self="center" v-if="windowWidth>959.98"
                                    style="display: flex;align-items: center;width: 100%;"
                                    :style="{'justifyContent':`${windowWidth<599.98?'flex-start':'flex-end'}`}">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>

                                  <!-- <v-col cols="12" md="3">
                                    顯示：{{ colstyle + 1 }}欄式
                                    <v-btn-toggle v-model="colstyle" dense mandatory>
                                      <v-btn small>
                                        <v-icon>mdi-square-medium</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-pause</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-view-column</v-icon>
                                      </v-btn>
                                    </v-btn-toggle>
                                  </v-col> -->
                                </v-row>
                                <!-- 圖表顯示控制 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="6" align-self="center"  v-if="windowWidth<959.98" style="padding-top: 0;">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" style="display: flex;align-items: center;width: 100%;padding-top: 0;justify-content: flex-end;">
                                    <div class="chart-toggle" style="display: flex;align-items: center;">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        style="margin-top: 0;margin-left: 8px;"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row" style="display: flex;flex-direction: column;">
                                        <!-- 顯示：{{ colstyle + 1 }}欄式 -->
                                        <v-btn-toggle v-model="colstyle" dark mandatory class="btn-toggles">
                                          <v-btn small>
                                            <v-icon>mdi-square-medium</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-pause</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-view-column</v-icon>
                                          </v-btn>
                                        </v-btn-toggle>
                                    </div>
                                    
                                  </v-col>
                                </v-row>
                                <!-- 圖表 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in obsdata"
                                    :key="item.id" v-show="
                                      defPool.觀察.includes(item.name) || defPool.觀察.length == 0
                                    ">
                                    <h1 class="pool-name">{{ item.name }}池</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.obs" xColName="inspected_date"
                                      :defaultitem="defalutItemList_obs" :loading="obsloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <v-row v-if="obsdata.length < 1 && obsloading == false" style="margin-bottom: 0;">
                                  <v-spacer></v-spacer>
                                  <v-col cols="4" class="text-center">
                                    <h4>暫無資料</h4>
                                  </v-col>
                                  <v-spacer></v-spacer>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <!-- 進階值 -->
                          <v-tab-item :value="'進階值'">
                            <v-overlay :value="advloading" :absolute="true">
                              <v-progress-circular indeterminate size="64"></v-progress-circular>
                            </v-overlay>
                            <v-card>
                              <v-card-text style="padding: 12px 0;">
                                <!-- 搜尋 -->
                                <v-row style="margin-bottom: 0;">
                                  <!-- 指定項目 -->
                                  <v-col cols="12" md="6" align-self="center" class="mutiselect">
                                    <v-select v-model="defitem_adv" clearable multiple filled deletable-chips chips dense hide-details
                                      placeholder="指定項目" :items="Object.keys(allcols.adv)" v-if="allcols.adv"
                                      :disabled="advloading == true">
                                    </v-select>
                                  </v-col>
                                  <!-- 養殖池 -->
                                  <v-col cols="12" md="5" v-if="Object.keys(allcols).length > 0 && advloading == false" class="mutiselect"
                                    :style="{'padding':`${windowWidth>959.98?'12px':'0 12px 12px 12px'}`}">
                                    <v-select v-model="defPool.進階" clearable multiple deletable-chips chips hide-details placeholder="顯示養殖池" 
                                      :items="advdata.map(x => x['name'])" v-if="allcols.adv" no-data-text="查無資料">
                                    </v-select>
                                  </v-col>

                                  <v-col cols="12" md="1" align-self="center" v-if="windowWidth>959.98"
                                    style="display: flex;align-items: center;width: 100%;"
                                    :style="{'justifyContent':`${windowWidth<599.98?'flex-start':'flex-end'}`}">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  
                                  <!-- <v-col cols="12" md="3">
                                    顯示：{{ colstyle + 1 }}欄式
                                    <v-btn-toggle v-model="colstyle" dense mandatory>
                                      <v-btn small>
                                        <v-icon>mdi-square-medium</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-pause</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-view-column</v-icon>
                                      </v-btn>
                                    </v-btn-toggle>
                                  </v-col> -->
                                </v-row>
                                <!-- 圖表顯示控制 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="6" align-self="center"  v-if="windowWidth<959.98" style="padding-top: 0;">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" style="display: flex;align-items: center;width: 100%;padding-top: 0;justify-content: flex-end;">
                                    <div class="chart-toggle" style="display: flex;align-items: center;">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        style="margin-top: 0;margin-left: 8px;"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row" style="display: flex;flex-direction: column;">
                                        <!-- 顯示：{{ colstyle + 1 }}欄式 -->
                                        <v-btn-toggle v-model="colstyle" dark mandatory class="btn-toggles">
                                          <v-btn small>
                                            <v-icon>mdi-square-medium</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-pause</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-view-column</v-icon>
                                          </v-btn>
                                        </v-btn-toggle>
                                    </div>
                                    
                                  </v-col>
                                </v-row>
                                <!-- 圖表 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in advdata"
                                    :key="item.id" v-show="
                                      defPool.進階.includes(item.name) || defPool.進階.length == 0
                                    ">
                                    <h1 class="pool-name">{{ item.name }}池</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.adv" xColName="inspected_date"
                                      :defaultitem="defalutItemList_adv" :loading="advloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <v-row v-if="advdata.length < 1 && advloading == false" style="margin-bottom: 0;">
                                  <v-spacer></v-spacer>
                                  <v-col cols="4" class="text-center">
                                    <h4>暫無資料</h4>
                                  </v-col>
                                  <v-spacer></v-spacer>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <!-- 投餵益生菌 -->
                          <v-tab-item :value="'投餵益生菌'">
                            <v-overlay :value="pbioloading" :absolute="true">
                              <v-progress-circular indeterminate size="64"></v-progress-circular>
                            </v-overlay>
                            <v-card>
                              <v-card-text style="padding: 12px 0;">
                                <!-- 搜尋 -->
                                <v-row style="margin-bottom: 0;">
                                  <!-- 指定項目 -->
                                  <v-col cols="12" md="6" align-self="center" class="mutiselect">
                                    <v-select v-model="defitem_pbio" clearable multiple filled deletable-chips chips dense hide-details
                                      placeholder="指定項目" :items="Object.keys(allcols.pbio)" v-if="allcols.pbio"
                                      :disabled="pbioloading == true">
                                    </v-select>
                                  </v-col>
                                  <!-- 養殖池 -->
                                  <v-col cols="12" md="5" v-if="Object.keys(allcols).length > 0 && pbioloading == false" class="mutiselect"
                                    :style="{'padding':`${windowWidth>959.98?'12px':'0 12px 12px 12px'}`}">
                                    <v-select v-model="defPool.益生菌" clearable multiple deletable-chips chips hide-details placeholder="顯示養殖池" 
                                      :items="pbiodata.map(x => x['name'])" v-if="allcols.pbio" no-data-text="查無資料">
                                    </v-select>
                                  </v-col>

                                  <v-col cols="12" md="1" align-self="center" v-if="windowWidth>959.98"
                                    style="display: flex;align-items: center;width: 100%;"
                                    :style="{'justifyContent':`${windowWidth<599.98?'flex-start':'flex-end'}`}">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  
                                  <!-- <v-col cols="12" md="3">
                                    顯示：{{ colstyle + 1 }}欄式
                                    <v-btn-toggle v-model="colstyle" dense mandatory>
                                      <v-btn small>
                                        <v-icon>mdi-square-medium</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-pause</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-view-column</v-icon>
                                      </v-btn>
                                    </v-btn-toggle>
                                  </v-col> -->
                                </v-row>
                                <!-- 圖表顯示控制 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="6" align-self="center"  v-if="windowWidth<959.98" style="padding-top: 0;">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" style="display: flex;align-items: center;width: 100%;padding-top: 0;justify-content: flex-end;">
                                    <div class="chart-toggle" style="display: flex;align-items: center;">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        style="margin-top: 0;margin-left: 8px;"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row" style="display: flex;flex-direction: column;">
                                        <!-- 顯示：{{ colstyle + 1 }}欄式 -->
                                        <v-btn-toggle v-model="colstyle" dark mandatory class="btn-toggles">
                                          <v-btn small>
                                            <v-icon>mdi-square-medium</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-pause</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-view-column</v-icon>
                                          </v-btn>
                                        </v-btn-toggle>
                                    </div>
                                    
                                  </v-col>
                                </v-row>
                                <!-- 圖表 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in pbiodata"
                                    :key="item.id" v-show="
                                      defPool.益生菌.includes(item.name) ||
                                      defPool.益生菌.length == 0
                                    ">
                                    <h1 class="pool-name">{{ item.name }}池</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.pbio" xColName="inspected_date"
                                      :defaultitem="defalutItemList_pbio" :loading="pbioloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <v-row v-if="pbiodata.length < 1 && pbioloading == false" style="margin-bottom: 0;">
                                  <v-spacer></v-spacer>
                                  <v-col cols="4" class="text-center">
                                    <h4>暫無資料</h4>
                                  </v-col>
                                  <v-spacer></v-spacer>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <!-- 養殖用料 -->
                          <v-tab-item :value="'養殖用料'">
                            <v-overlay :value="materialloading" :absolute="true">
                              <v-progress-circular indeterminate size="64"></v-progress-circular>
                            </v-overlay>
                            <v-card>
                              <v-card-text style="padding: 12px 0;">
                                <!-- 搜尋 -->
                                <v-row style="margin-bottom: 0;">
                                  <!-- 指定項目 -->
                                  <v-col cols="12" md="6" align-self="center" class="mutiselect">
                                    <v-select v-model="defitem_material" clearable multiple filled deletable-chips chips dense hide-details
                                      placeholder="指定項目" :items="Object.keys(allcols.breeding_material)" v-if="allcols.breeding_material"
                                      :disabled="materialloading == true">
                                    </v-select>
                                  </v-col>
                                  <!-- 養殖池 -->
                                  <v-col cols="12" md="5" v-if="Object.keys(allcols).length > 0 && materialloading == false" class="mutiselect"
                                    :style="{'padding':`${windowWidth>959.98?'12px':'0 12px 12px 12px'}`}">
                                    <v-select v-model="defPool.用料" clearable multiple deletable-chips chips hide-details placeholder="顯示養殖池" 
                                      :items="materialdata.map(x => x['name'])" v-if="allcols.breeding_material" no-data-text="查無資料">
                                    </v-select>
                                  </v-col>
                                  
                                  <v-col cols="12" md="1" align-self="center" v-if="windowWidth>959.98"
                                    style="display: flex;align-items: center;width: 100%;"
                                    :style="{'justifyContent':`${windowWidth<599.98?'flex-start':'flex-end'}`}">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>

                                  <!-- <v-col cols="12" md="3">
                                    顯示：{{ colstyle + 1 }}欄式
                                    <v-btn-toggle v-model="colstyle" dense mandatory>
                                      <v-btn small>
                                        <v-icon>mdi-square-medium</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-pause</v-icon>
                                      </v-btn>
                                      <v-btn small>
                                        <v-icon>mdi-view-column</v-icon>
                                      </v-btn>
                                    </v-btn-toggle>
                                  </v-col> -->
                                </v-row>
                                <!-- 圖表顯示控制 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="6" align-self="center"  v-if="windowWidth<959.98" style="padding-top: 0;">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" style="display: flex;align-items: center;width: 100%;padding-top: 0;justify-content: flex-end;">
                                    <div class="chart-toggle" style="display: flex;align-items: center;">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        style="margin-top: 0;margin-left: 8px;"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row" style="display: flex;flex-direction: column;">
                                        <!-- 顯示：{{ colstyle + 1 }}欄式 -->
                                        <v-btn-toggle v-model="colstyle" dark mandatory class="btn-toggles">
                                          <v-btn small>
                                            <v-icon>mdi-square-medium</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-pause</v-icon>
                                          </v-btn>
                                          <v-btn small>
                                            <v-icon>mdi-view-column</v-icon>
                                          </v-btn>
                                        </v-btn-toggle>
                                    </div>
                                    
                                  </v-col>
                                </v-row>
                                <!-- 圖表 -->
                                <v-row style="margin-bottom: 0;">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in materialdata"
                                    :key="item.id" v-show="
                                      defPool.用料.includes(item.name) ||
                                      defPool.用料.length == 0
                                    ">
                                    <h1 class="pool-name">{{ item.name }}池</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.breeding_material" xColName="inspected_date"
                                      :defaultitem="defalutItemList_material" :loading="materialloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <!-- 無資料 -->
                                <v-row v-if="materialdata.length < 1 && materialloading == false" style="margin-bottom: 0;">
                                  <v-spacer></v-spacer>
                                  <v-col cols="4" class="text-center">
                                    <h4>暫無資料</h4>
                                  </v-col>
                                  <v-spacer></v-spacer>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                        </v-tabs>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
    </v-card>
  </div>
</template>

<script>
// import treelst from "~/components/treeList.vue";
import _ from "lodash";
import WaterQuality_Vcharts2 from "@/components/sheet/waterQuality_vcharts2";
import dayjs from "dayjs";
import https from "https";
//-----
import "element-ui/lib/theme-chalk/index.css";
export default {
  layout: "emptynologin",
  // middleware: "auth",
  components: {
    // treelst,
    WaterQuality_Vcharts2
  },
  head(){
    return{
      title:'數據分析'
    }
  },
  data() {
    return {
      chartToggle:true,
      mypanel: 0,
      sel_main: "",
      sel_area: "",
      clickeditem: "",
      defitem: ["亞硝酸鹽濃度", "氨氮濃度", "溫度", "溶氧濃度", "酸鹼值"],
      defPool: { 水質: [], 環境: [], 飼料: [], 觀察: [], 進階: [], 益生菌: [],用料:[] },
      //items: ["A1", "A2"],
      tabs: [
        { name: "水質監測" },
        { name: "環境監測" },
        { name: "投餵飼料" },
        { name: "飼料觀察網" },
        { name: "進階值" },
        { name: "養殖用料" }
        // { name: "投餵益生菌" }  pbio目前沒有先拿掉
      ],
      currenttab: "水質監測",
      tree: [],
      initiallyOpen: ["研發一場"],
      files: {
        html: "mdi-language-html5",
        js: "mdi-nodejs",
        json: "mdi-code-json",
        md: "mdi-language-markdown",
        pdf: "mdi-file-pdf",
        png: "mdi-file-image",
        txt: "mdi-file-document-outline",
        xls: "mdi-file-excel",
        group: "select-group",
        openedgroup: "select-inverse",
        pool: "mdi-pool"
      },
      items2: [
        {
          name: "研發 0 場"
        },
        {
          name: "研發 1 場",
          pond_area: [
            {
              name: "武曲",
              pond_area: [
                {
                  name: "A1",
                  type: "pool"
                },
                {
                  name: "A2",
                  type: "pool"
                }
              ]
            }
          ]
        }
      ],
      maindata: [],
      mainpool: {
        id: 1,
        name: "A1",
        items: [
          // { name: "體積", item: "volume", value: 140.0, unit: "噸" },
        ]
      },
      footerProps: {
        "items-per-page-text": "每頁",
        "items-per-page-options": [25, 50, 75, 100]
      },
      fixedname: "養殖池",
      headers: [
        { text: "養殖池", value: "name", groupable: false },
        { text: "體積/水量(噸)", value: "volume", groupable: false },
        { text: "深度(m)", value: "depth", groupable: false },
        { text: "小池數(個)", value: "num", groupable: false },
        { text: "曝氣盤數(個)", value: "aeration_tray_num", groupable: false },
        { text: "狀態", value: "state", groupable: false },
        { text: "預估放養隻數", value: "estimated_num", groupable: false },
        { text: "養殖密度", value: "num_per_unit", groupable: false }

      ],
      //---
      allcols: [],
      colstyle: 1, //0→4 or 1→6 or 2→12
      //---
      tableloading: false,
      waterdata: [],
      // waterdatacols: {},
      waterloading: false,
      //---日曆
      menu_startdate: false,
      menu_enddate: false,
      sdate: dayjs(new Date())
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      // sdate: dayjs(new Date(2021, 0, 11))
      //   .add(-10, "day")
      //   .format("YYYY-MM-DD"),
      edate: new Date().toISOString().substr(0, 10),
      // edate: new Date(2021, 0, 5).toISOString().substr(0, 10),
      days: 10, //起訖天數
      //---圖片(地圖)
      showmp: false,
      //投餵
      // feeddatacols: {}, //欄位
      feedloading: false, //是否載入中
      feeddata: [], //資料
      defitem_feed: "", //預設項目[哪些被勾選]
      //環境
      // envdatacols: {}, //欄位
      envloading: false, //是否載入中
      envdata: [], //資料
      defitem_env: "", //預設項目[哪些被勾選]
      //飼料觀察網
      // obsdatacols: {}, //欄位
      obsloading: false, //是否載入中
      obsdata: [], //資料
      defitem_obs: "", //預設項目[哪些被勾選]
      //進階值
      // advdatacols: {}, //欄位
      advloading: false, //是否載入中
      advdata: [], //資料
      defitem_adv: "", //預設項目[哪些被勾選]
      //益生菌
      // pbiodatacols: {}, //欄位
      pbioloading: false, //是否載入中
      pbiodata: [], //資料
      defitem_pbio: "", //預設項目[哪些被勾選]
      //養殖用料
      materialloading: false,
      materialdata: [],
      defitem_material: "",
      // 3張card
      total: {
        pool: 0, // 養殖池
        pond: 0, // 小池
        predict: 0, // 預估放養
      },
      resultListOpen: true,
      windowWidth: window.innerWidth,
      defaultPool: undefined,
      showPredict: true,
    };
  },
  methods: {
    //  onReady: function (instance,CountUp) {
    //         const that = this;
    //         if(instance.el == document.getElementById('num3')) {
    //           that.endVal = this.total.predict;
    //         }else if(instance.el == document.getElementById('num2')) {
    //           that.endVal = this.total.pond;
    //         }else if(instance.el == document.getElementById('num1')) {
    //           that.endVal = this.total.pool;
    //         }
    //         instance.update(that.endVal);
    // },
    get_scopeData:function(evt){
      console.log(evt);
      console.log('main',this.maindata);
      if(evt) {
        let areaName='';
        this.sel_area = evt.split('_')[evt.split('_').length-1];
        if(evt.split('_').length>2) {
          for(let i=0;i<evt.split('_').length-1;i++) {
            areaName += evt.split('_')[i];
          }
        }else {
          areaName = evt.split('_')[0];
        }
        this.maindata.forEach(f=>{
          f.node.forEach(a=>{
            if(a.id==this.sel_area && a.name == areaName) {
              this.sel_main = f.id;
            }
          })
        })
        this.showPredict = false;
        // this.areachange();
      }
    },
    closepanel: async function () {
      this.mypanel = [];
      //觸發取得水質資料
      //this.waterdata=[];
      if (this.sel_main && this.sel_area) {
        switch (this.currenttab) {
          case "水質監測":
            this.waterdata = [];
            await this.getAll(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area,
              "water"
            );
            break;
          case "投餵飼料":
            await this.getAll(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area,
              "feed"
            );
            break;
          case "環境監測":
            await this.getAll(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area,
              "env"
            );
            break;
          case "飼料觀察網":
            await this.getAll(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area,
              "obs"
            );
          case "進階值":
            await this.getAll(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area,
              "adv"
            );
            break;
          case "投餵益生菌":
            await this.getAll(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area,
              "pbio"
            );
            break;
          case "養殖用料":
            await this.getAll(
              this.sdate,
              this.edate,
              this.sel_main,
              this.sel_area,
              "material"
            );
            break;
          default:
            break;
        }
      }
    },
    // areachange: async function () {//養殖池資訊
    //   var para = {
    //     id: this.sel_area
    //   };
    //   const agent = new https.Agent({
    //     rejectUnauthorized: false
    //   });
    //   if (this.sel_area) {
    //     this.tableloading = true;
    //     await this.$axios
    //       .get(
    //         `${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`,
    //         { params: para },
    //         { httpsAgent: agent }
    //       )
    //       .then(res => {
    //         this.mainpool.items = res.data;
    //         setTimeout(()=>{
    //           if(document.getElementsByClassName('el-table__body-wrapper')) {
    //             document.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0;
    //           }
    //         },100)
    //       })
    //       .finally(() => {
    //         /* 不論失敗成功皆會執行 */ this.tableloading = false;
    //       });
    //   } else {
    //     this.mainpool.items = [];
    //   }
    // },
    //所有資料
    getAll: async function (
      start_date,
      end_date,
      sel_main,
      sel_area,
      data_group
    ) {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });

      let apiURL = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/`;
      let parm = {
        started_date: start_date,
        ended_date: end_date,
        factory_id: sel_main,
        pond_area_id: sel_area,
        data_group: data_group
      };
      switch (data_group) {
        case "water": //水質
          this.waterloading = true;
          await this.$axios
            .get(apiURL, { params: parm }, { httpsAgent: agent })
            .then(res => {
              console.log("select:", res.request.responseURL);
              this.waterdata = res.data;
              // this.goAnchor('#chart');
            })
            .catch(err => {
              alert("失敗：" + err.message);
            });
          this.waterloading = false;
          break;
        case "feed": //飼料
          this.feedloading = true;
          await this.$axios
            .get(apiURL, { params: parm }, { httpsAgent: agent })
            .then(res => {
              console.log("select:", res.request.responseURL);
              this.feeddata = res.data;
              // this.goAnchor('#chart');
            })
            .catch(err => {
              alert("失敗：" + err.message);
            });
          this.feedloading = false;
          break;
        case "env": //環境
          this.envloading = true;
          await this.$axios
            .get(apiURL, { params: parm }, { httpsAgent: agent })
            .then(res => {
              console.log("select:", res.request.responseURL);
              this.envdata = res.data;
              // this.goAnchor('#chart');
            })
            .catch(err => {
              alert("失敗：" + err.message);
            });
          this.envloading = false;
          break;
        case "obs": //觀察網
          this.obsloading = true;
          await this.$axios
            .get(apiURL, { params: parm }, { httpsAgent: agent })
            .then(res => {
              console.log("select:", res.request.responseURL);
              this.obsdata = res.data;
              // this.goAnchor('#chart');
            })
            .catch(err => {
              alert("失敗：" + err.message);
            });
          this.obsloading = false;
          break;
        case "adv": //進階值
          this.advloading = true;
          await this.$axios
            .get(apiURL, { params: parm }, { httpsAgent: agent })
            .then(res => {
              console.log("select:", res.request.responseURL);
              this.advdata = res.data;
              // this.goAnchor('#chart');
            })
            .catch(err => {
              alert("失敗：" + err.message);
            });
          this.advloading = false;
          break;
        case "pbio": //益生菌
          this.pbioloading = true;
          await this.$axios
            .get(apiURL, { params: parm }, { httpsAgent: agent })
            .then(res => {
              console.log("select:", res.request.responseURL);
              this.pbiodata = res.data;
              // this.goAnchor('#chart');
            });
          this.pbioloading = false;
          break;
        case "material"://養殖用料
          this.materialloading = true;
          parm.data_group = 'breeding_material';
          await this.$axios
            .get(apiURL, { params: parm }, { httpsAgent: agent })
            .then(res => {
              console.log("select:", res.request.responseURL);
              this.materialdata = res.data;
              // this.goAnchor('#chart');
            });
          this.materialloading = false;
        default:
          break;
      }
    },
    showmpFun: function () {
      this.showmp = !this.showmp;
    },
    showpool: function (data) {
      console.log(data.name);
    },
    getNowDate: function () {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    daychange: function () {
      let nd = dayjs(this.edate)
        .add(-this.days, "day")
        .format("YYYY-MM-DD");
      this.sdate = nd;
    },
    daysSet: function () {
      this.days = dayjs(this.edate).diff(this.sdate, "day");
    },
    // getSummaries: function (param) {
    //   // console.log('param',param);
    //   const { columns, data } = param;
    //   const sums = [];
    //   columns.forEach((column, index) => {
    //     if (index === 0) {
    //       sums[index] = `共${data.length}池`;
    //       return;
    //     }
    //     const values = data.map(item => Number(item[column.property]));
    //     var hiddenlist = ["體積(頓)", "狀態"];
    //     if (hiddenlist.filter(x => x == column.label).length > 0) {
    //       sums[index] = "";
    //       return;
    //     }
    //     if (!values.every(value => isNaN(value))) {
    //       sums[index] = values.reduce((prev, curr) => {
    //         const value = Number(curr);
    //         if (!isNaN(value)) {
    //           if(column.label == '體積/水量(噸)') {
    //             return (parseFloat(prev) + parseFloat(curr)).toFixed(2);
    //           }else {
    //             return prev + curr;
    //           }
    //         } else {
    //           if(column.label == '體積/水量(噸)') {
    //             return prev.toFixed(2);
    //           }else {
    //             return prev;
    //           }
              
    //         }
    //       }, 0);
    //       var itemunit = [
    //         { name: "深度(m)", unit: "m" },
    //         { name: "小池數(個)", unit: "個" },
    //         { name: "曝氣盤數(個)", unit: "個" },
    //         { name: "預估放養隻數", unit: "隻" }
    //       ];
    //       if (itemunit.filter(x => x.name == column.label).length > 0) {
    //         if(column.label == '小池數(個)') {
    //           this.total.pond = sums[index];
    //         }
    //         if(column.label == '預估放養隻數') {
    //           this.total.predict = sums[index];
    //           this.showPredict = true;
    //         }
    //         if(column.label == '深度(m)') {
    //           sums[index] = sums[index].toFixed(2);
    //         }
    //         sums[index] +=
    //           " " + itemunit.filter(x => x.name == column.label)[0].unit;
    //       } else {
    //         sums[index] += "";
    //       }
          
    //     } else {
    //       sums[index] = "N/A";
    //     }
    //     this.total.pool = data.length;
    //   });
    //   return sums;
    // },
    // totalSum(values,bool) {
    //   if(bool) {
    //     values.forEach(v=>{this.total.pond+=parseInt(v)});
    //   }else {
    //     values.forEach(v=>this.total.predict+=parseInt(v));
    //   }
    // },
    // goAnchor(selector) {
    //   setTimeout(()=>{
    //     console.log('>>>>>>>>>>gogo')
    //     let ele = document.querySelector(selector);
    //           let eTop = ele.offsetTop;
    //           ele.scrollIntoView({
    //               behavior: "smooth",
    //               top: eTop,
    //           });
    //   },500)
      
      
    // },
    setDefitem() {
      this.defitem = [
        '亞硝酸鹽濃度',
        '氨氮濃度',
        '溫度',
        '溶氧濃度',
        '酸鹼值'
      ];
    }
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    await this.$axios
      .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`, { httpsAgent: agent })
      .then(res => {
        console.log("architecture:", res.request.responseURL);
        this.maindata = res.data;
        this.sel_main = undefined;
        this.defaultPool = '';
        if(this.maindata.length>0) {
          this.defaultPool = this.maindata[0].node[0].name+'_'+this.maindata[0].node[0].id;
        }else {
          this.defaultPool = '';
        }
        console.log(this.defaultPool);
      });
    //get all cols
    await this.$axios
      .get(`${this.$store.state.mydata.gobal_api.apiUrl}/all-col-name/`, { httpsAgent: agent })
      .then(res => {
        console.log("all-col-name:", res.request.responseURL);
        this.allcols = res.data;
      });
  },
  computed: {
    // mpurl: function () {
    //   console.log(this.sel_main);
    //   return this.sel_main && this.showmp
    //     ? `/factory_${this.sel_main}.jpg?lazy`
    //     : "/factory_err.jpg?lazy";
    // },
    // areadata: function () {
    //   let filtermain = [];
    //   filtermain = this.maindata;
    //   // console.log("maindata node count:",this.maindata[0].node.length);

    //   if (
    //     //看有沒有選場
    //     this.sel_main != undefined &&
    //     this.sel_main > 0 &&
    //     this.maindata.length > 0
    //   ) {
    //     filtermain = filtermain.filter(main => main.id == this.sel_main);
    //   }
    //   var area = [];

    //   filtermain.forEach(function (x) {
    //     x.node.forEach(function (y) {
    //       var yitem = { id: y.id, name: y.name };
    //       if (area.indexOf(yitem) == -1) {
    //         //沒找到
    //         area.push(yitem);
    //       }
    //     });
    //   });
    //   return area;
    // },
    // pooldata: function () {
    //   let filterarea = _.cloneDeep(this.maindata);
    //   //filterarea = this.maindata;
    //   //先篩場
    //   if (
    //     this.sel_main != undefined && //非空
    //     this.sel_main > 0 && //有選到
    //     this.maindata.length > 0 //有資料
    //   ) {
    //     filterarea = filterarea.filter(main => main.id == this.sel_main);
    //   }
    //   let obj = [];
    //   //再篩區
    //   if (
    //     //如果有選區
    //     this.sel_area != undefined &&
    //     this.sel_area.length > 0 &&
    //     filterarea.length > 0
    //   ) {
    //     let astr = this.sel_area;
    //     filterarea.forEach(function (item, index) {
    //       obj.push(item);
    //       obj[index].node = item.node.filter(x => x.name == astr);
    //     });
    //     /*for (let i = 0; i < obj.length; i++) {
    //       console.log("filterarea node:",obj[i].node.length);
    //       filterarea[i].node = obj[i].node.filter(
    //         x => x.name == this.sel_area
    //       );
    //     }*/
    //   }
    //   //return this.maindata;
    //   return filterarea;
    //   //return obj;
    // },
    defalutItemList: function () {
      var item = _.cloneDeep(this.allcols.water);
      if(!item) {
        return {};
      }
      console.log('defaultItemList',item)
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem && this.defitem.length > 0) {
          // item[key] = this.defitem == key ? true : false;
          item[key] = this.defitem.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_feed: function () {
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.allcols.feed);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_feed && this.defitem_feed.length > 0) {
          item[key] = this.defitem_feed.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_env: function () {
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.allcols.env);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_env && this.defitem_env.length > 0) {
          item[key] = this.defitem_env.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_obs: function () {
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.allcols.obs);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_obs && this.defitem_obs.length > 0) {
          item[key] = this.defitem_obs.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_adv: function () {
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.allcols.adv);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_adv && this.defitem_adv.length > 0) {
          item[key] = this.defitem_adv.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_pbio: function () {
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.allcols.pbio);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_pbio && this.defitem_pbio.length > 0) {
          item[key] = this.defitem_pbio.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
    defalutItemList_material:function(){
      //多選欄位，哪些要被預設顯示
      var item = _.cloneDeep(this.allcols.breeding_material);
      for (const [key, value] of Object.entries(item)) {
        if (this.defitem_material && this.defitem_material.length > 0) {
          item[key] = this.defitem_material.includes(key) ? true : false;
        } else {
          item[key] = true;
        }
      }
      return item;
    },
  },
  mounted() {
    //監控視窗
    window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth;
    });
    // this.rndKey = Math.round( (Math.random()*100) );
  },
  watch: {
      windowWidth:function(){
          return window.innerWidth;
      },
  }
};
//                            _ooOoo_
//                           o8888888o
//                           88" . "88
//                           (| -_- |)
//                            O\ = /O
//                        ____/`---'\____
//                      .   ' \\| |// `.
//                       / \\||| : |||// \
//                     / _||||| -:- |||||- \
//                       | | \\\ - /// | |
//                     | \_| ''\---/'' | |
//                      \ .-\__ `-` ___/-. /
//                   ___`. .' /--.--\ `. . __
//                ."" '< `.___\_<|>_/___.' >'"".
//               | | : `- \`.;`\ _ /`;.`/ - ` : | |
//                 \ \ `-. \_ __\ /__ _/ .-` / /
//         ======`-.____`-.___\_____/___.-`____.-'======
//                            `=---='
//
//         .............................................
//                  佛祖保佑             永無BUG
</script>

<style lang="scss" scoped>
@import "https://cdn.jsdelivr.net/npm/v-charts/lib/style.min.css";
.basic {
  .el-table__body-wrapper {
    height: 100%;
  }
  .el-table__empty-block {
    width: 100%;
  }
  .search.row {
    .col-12 {
      padding-top: 0;
      padding-bottom: 0;
    }
    .select_area .v-text-field__details {
      display: none !important;
   }
  }
}
.papper_blue {
  background: url('~/assets/papper_grape.jpg')
    repeat center center fixed !important;
  background-size: cover;
}
.v-expansion-panel::before{
  box-shadow: none !important;
}

.v-sheet.result-card.pool-detail.v-card:not(.v-sheet--outlined) {
  // box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.v-card.dashboard {
  // padding: 24px;
  padding: 8px 12px;
  // border-bottom: 4px solid $color-primary;
  border-left: 4px solid $color-primary;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  background-color: rgba($color-primary,0.08);
  .icon {
    width: 40px;
    height: 40px;
    // background-color: rgba($color-primary,0.1);
    text-align: center;
    padding-top: 8px;
    margin-right: 24px;
    .v-icon {
      color: $color-primary;
    }
  }
  &.pond {
    // border-bottom: 4px solid #92CF90;
    border-left: 4px solid #92CF90;
    background-color: rgba(#92CF90,0.07);
    .icon {
      // background-color: rgba(#92CF90,0.1);
    }
    .v-icon {
      color: #92CF90;
    }
  }
  &.predict {
    // border-bottom: 4px solid #E8956F;
    border-left: 4px solid #E8956F;
    background-color: rgba(#E8956F,0.07);
    .icon {
      // background-color: rgba(#E8956F,0.1);
    }
  }
  .total-text {
    .title,.content {
      color: $color-dark;
      font-size: 1rem !important;
    }
    .content {
      font-weight: bold;
      padding: 0;
      font-size: 1.2rem !important;
    }
  }
}
.v-card.result-card.pool-detail {
  background-color: #fff;
  .card-title {
    border-bottom: 1px solid rgba(0,0,0,0.1);
    background-color: rgba($color-primary,0.1);
  }
  .v-card__title {
    font-size: 1rem;
  }
  .title {
    width: 100%;
  }
  .chevron {
    // padding: 16px;
    .v-icon {
      color: $color-dark;
    }
  }
  .content .col-12 {
    padding: 0;
    
  }
}
.spector {
  color: $color-primary;
  // text-decoration: underline;
  cursor: pointer;
  padding-bottom: 2px;
  border-bottom: 1px solid $color-primary;
  width: 88px;
}
.pool-name {
  color: $color-dark;
  padding-left: 4px;
}

::v-deep {
  .iCountUp {
    font-size: 1.2rem !important;
    color: $color-dark !important;
  }
  // 養殖池table
  .el-table,.el-table tr,.el-table th.el-table__cell {
    background-color: #fff;
  }
  .el-table__footer-wrapper tbody td.el-table__cell,
  .el-table__fixed-footer-wrapper tbody td.el-table__cell {
    background-color: #f5f7fa;
  }
  .el-table__body tr.hover-row>td.el-table__cell {
    background-color: rgba($color-primary,0.1);
  }
  .el-table__fixed-footer-wrapper tbody td.el-table__cell,.el-table__footer-wrapper tbody td.el-table__cell {
    font-weight: bold;
  }
  // 布局圖
  .custom-overlay {
    position: fixed;
    .v-overlay__content {
      width: 100%;
      height: 100%;
      .v-icon.v-icon.v-icon--link {
        position: absolute;
        top: 80px;
        // right: 0;
        // width: 24px;
        // height: 24px;
        // background-color: $color-primary;
        // border-radius: 4px;
      }
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }
}
</style>
