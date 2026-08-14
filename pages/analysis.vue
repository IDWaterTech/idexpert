<template>
  <div class="basic">
    <v-card class="bg-card mb-4">
        <!-- <div class="card-title">
            <v-row style="margin-bottom: 0;">
                <div class="title">
                    <v-icon>mdi-chart-bell-curve</v-icon>
                    <v-card-title>監測數據</v-card-title>
                </div>
            </v-row>
        </div> -->
        <div class="content pt-3">
          <!-- 搜尋 -->
          <div class="search">
            <v-row class="align-center mb-1">
              <!-- 選擇場區 -->
              <v-col cols="12" md="4" sm="12" style="position: relative;">
                <locate-select class="select-template mr-0" :dataScope="'area'" :defaultSelect="defaultPool" :isMulti="false" @scopeSel_data="get_scopeData($event);resultListOpen=true;closepanel();"></locate-select>
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
                  <v-date-picker v-model="sdate" locale="zh-tw" :max="edate" no-title @input="
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
                  <v-date-picker v-model="edate" locale="zh-tw" :min="sdate" no-title @input="
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
              <!-- 圖表 -->
              <v-row class="mb-0">
                <v-col cols="12" class="pt-0">
                  <v-card class="result-card">
                    <div class="content">
                      <div class="header-bar py-3 px-0 pt-1">
                        <v-tabs v-model="currenttab" show-arrows @change="closepanel()">
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
                              <v-card-text class="px-0 py-3">
                                <!-- 搜尋 -->
                                <v-row class="mb-0">
                                  <!-- 指定項目 -->
                                  <v-col cols="12" md="6" align-self="center" class="mutiselect">
                                    <v-select v-model="defitem" clearable multiple filled deletable-chips chips dense hide-details
                                      placeholder="指定項目" :items="Object.keys(allcols.water)" v-if="allcols.water"
                                      :disabled="waterloading == true">
                                    </v-select>
                                    <div  v-if="windowWidth<959.98" class="spector pt-1 cursor-pointer" @click="setDefitem">主要觀測項目

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
                                  <v-col cols="12" md="1" class="d-flex full-width" align-self="center" v-if="windowWidth>959.98"
                                    :style="{'justifyContent':`${windowWidth<599.98?'flex-start':'flex-end'}`}">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                </v-row>
                                <!-- 觀測項目/圖表顯示控制 -->
                                <v-row class="mb-0">
                                  <v-col cols="6"  md="6" sm="4" class="pt-0" align-self="center" v-if="windowWidth<959.98">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <!-- 主要觀測項目 -->
                                  <v-col v-if="windowWidth>959.98" cols="6" md="6" sm="4" class="pt-0" align-self="center">
                                    <div class="spector cursor-pointer" @click="setDefitem">主要觀測項目

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
                                  <v-col cols="6" md="6" sm="8" class="flex-center-end pt-0 full-width">
                                    <div class="chart-toggle flex-align-center">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        class="mt-0 ml-2"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row d-flex flex-column">
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
                                <v-row class="mb-0">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in waterdata"
                                    :key="item.id" v-show="
                                      defPool.水質.includes(item.name) || defPool.水質.length == 0
                                    ">
                                    <h1 class="pool-name pl-1">{{ item.name }}</h1>
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
                                <v-row v-if="waterdata.length < 1 && waterloading == false" class="mb-0" style="min-height: 47vh;">
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
                              <v-card-text class="px-0 py-3">
                                <!-- 搜尋 -->
                                <v-row class="mb-0">
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
                                    class="d-flex full-width"
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
                                <v-row class="mb-0">
                                  <v-col cols="6" class="pt-0" align-self="center"  v-if="windowWidth<959.98">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" class="flex-center-end pt-0 full-width">
                                    
                                    <div class="chart-toggle flex-align-center">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        class="mt-0 ml-2"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row d-flex flex-column">
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
                                    <h1 class="pool-name pl-1">{{ item.name }}</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.env" xColName="inspected_date"
                                      :defaultitem="defalutItemList_env" :loading="envloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <v-row v-if="envdata.length < 1 && envloading == false" style="margin-bottom: 0;min-height: 47vh;">
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
                              <v-card-text class="px-0 py-3">
                                <!-- 搜尋 -->
                                <v-row class="mb-0">
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
                                    class="d-flex full-width"
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
                                <v-row class="mb-0">
                                  <v-col cols="6" align-self="center" class="pt-0" v-if="windowWidth<959.98" >
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" class="flex-center-end pt-0 full-width">
                                    <div class="chart-toggle flex-align-center">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        class="mt-0 ml-2"
                                        style="margin-top: 0;margin-left: 8px;"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row d-flex flex-column">
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
                                <v-row class="mb-0">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in feeddata"
                                    :key="item.id" v-show="
                                      defPool.飼料.includes(item.name) || defPool.飼料.length == 0
                                    ">
                                    <h1 class="pool-name pl-1">{{ item.name }}</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.feed" xColName="inspected_date"
                                      :defaultitem="defalutItemList_feed" :loading="feedloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <v-row v-if="feeddata.length < 1 && feedloading == false" class="mb-0" style="min-height: 47vh;">
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
                              <v-card-text class="px-0 py-3">
                                <!-- 搜尋 -->
                                <v-row class="mb-0">
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
                                    class="d-flex full-width"
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
                                <v-row class="mb-0">
                                  <v-col cols="6" align-self="center"  v-if="windowWidth<959.98" class="pt-0">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" class="flex-center-end pt-0 full-width">
                                    <div class="chart-toggle flex-align-center">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        class="mt-0 ml-2"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row d-flex flex-column">
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
                                <v-row class="mb-0">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in obsdata"
                                    :key="item.id" v-show="
                                      defPool.觀察.includes(item.name) || defPool.觀察.length == 0
                                    ">
                                    <h1 class="pool-name pl-1">{{ item.name }}</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.obs" xColName="inspected_date"
                                      :defaultitem="defalutItemList_obs" :loading="obsloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <v-row v-if="obsdata.length < 1 && obsloading == false" class="mb-0" style="min-height: 47vh;">
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
                              <v-card-text class="px-0 py-3">
                                <!-- 搜尋 -->
                                <v-row class="mb-0">
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
                                    class="d-flex full-width"
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
                                <v-row class="mb-0">
                                  <v-col cols="6" align-self="center"  v-if="windowWidth<959.98" class="pt-0">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" class="flex-center-end pt-0 full-width">
                                    <div class="chart-toggle flex-align-center">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        class="mt-0 ml-2"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row d-flex flex-column">
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
                                <v-row class="mb-0">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in advdata"
                                    :key="item.id" v-show="
                                      defPool.進階.includes(item.name) || defPool.進階.length == 0
                                    ">
                                    <h1 class="pool-name pl-1">{{ item.name }}</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.adv" xColName="inspected_date"
                                      :defaultitem="defalutItemList_adv" :loading="advloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <v-row v-if="advdata.length < 1 && advloading == false" class="mb-0" style="min-height: 47vh;">
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
                              <v-card-text class="px-0 py-3">
                                <!-- 搜尋 -->
                                <v-row class="mb-0">
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
                                    class="d-flex full-width"
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
                                <v-row class="mb-0">
                                  <v-col cols="6" align-self="center"  v-if="windowWidth<959.98" class="pt-0">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" class="flex-center-end pt-0 full-width">
                                    <div class="chart-toggle flex-align-center">
                                      區塊顯示
                                      <v-switch
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                        class="mt-0 ml-2"
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row d-flex flex-column">
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
                                <v-row class="mb-0">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in pbiodata"
                                    :key="item.id" v-show="
                                      defPool.益生菌.includes(item.name) ||
                                      defPool.益生菌.length == 0
                                    ">
                                    <h1 class="pool-name pl-1">{{ item.name }}</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.pbio" xColName="inspected_date"
                                      :defaultitem="defalutItemList_pbio" :loading="pbioloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <v-row v-if="pbiodata.length < 1 && pbioloading == false" class="mb-0" style="min-height: 47vh;">
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
                              <v-card-text class="px-0 py-3">
                                <!-- 搜尋 -->
                                <v-row class="mb-0">
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
                                    class="d-flex full-width"
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
                                  <v-col cols="6" align-self="center"  v-if="windowWidth<959.98" class="pt-0">
                                    <v-btn class="btn-primary" :disabled="!(sel_main && sel_area)" @click="closepanel">查詢</v-btn>
                                  </v-col>
                                  <v-col cols="6" md="12" class="flex-center-end pt-0 full-width">
                                    <div class="chart-toggle flex-align-center">
                                      區塊顯示
                                      <v-switch
                                        class="mt-0 ml-2"
                                        v-model="chartToggle"
                                        label="" dense hide-details inset
                                      ></v-switch>
                                    </div>
                                    
                                    <div v-if="windowWidth>959.98" class="change-row d-flex flex-column">
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
                                <v-row class="mb-0">
                                  <v-col cols="12" :md="colstyle == 2 ? '4' : colstyle == 1 ? '6' : '12'" v-for="item in materialdata"
                                    :key="item.id" v-show="
                                      defPool.用料.includes(item.name) ||
                                      defPool.用料.length == 0
                                    ">
                                    <h1 class="pool-name pl-1">{{ item.name }}</h1>
                                    <WaterQuality_Vcharts2 :chartToggle="chartToggle" :rowsData="item.items" :legendAliasOut="allcols.breeding_material" xColName="inspected_date"
                                      :defaultitem="defalutItemList_material" :loading="materialloading" :title="item.name" :urldata="{
                                        sel_main: sel_main,
                                        sel_area: sel_area,
                                        sel_pool: item.id
                                      }"></WaterQuality_Vcharts2>
                                  </v-col>
                                </v-row>
                                <!-- 無資料 -->
                                <v-row v-if="materialdata.length < 1 && materialloading == false" class="mb-0" style="min-height: 47vh;">
                                  <v-spacer></v-spacer>
                                  <v-col cols="4" class="text-center">
                                    <h4>暫無資料</h4>
                                  </v-col>
                                  <v-spacer></v-spacer>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <!-- 菌相 -->
                           <v-tab-item :value="'菌相'">
                             <v-overlay :value="bacloading" :absolute="true">
                              <v-progress-circular indeterminate size="64"></v-progress-circular>
                            </v-overlay>
                            <v-card elevation="0">
                              <component :is="currentChart" :pond_area_id="sel_area" :startDate="sdate" :endDate="edate" :loading="bacloading"></component>
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
import bacteriaCharts from "@/pages/bacteriaCharts.vue";
import dayjs from "dayjs";
import https from "https";
//-----
import "element-ui/lib/theme-chalk/index.css";
export default {
  layout: "emptynologin2",
  // middleware: "auth",
  components: {
    WaterQuality_Vcharts2,
  },
  head(){
    return{
      title:'數據分析'
    }
  },
  data() {
    return {
      currentChart: bacteriaCharts,
      chartToggle:true,
      mypanel: 0,
      sel_main: "",
      sel_area: "",
      clickeditem: "",
      defitem: ["亞硝酸鹽濃度", "氨氮濃度", "水溫", "溶氧濃度", "酸鹼值"],
      defPool: { 水質: [], 環境: [], 飼料: [], 觀察: [], 進階: [], 益生菌: [],用料:[] },
      //items: ["A1", "A2"],
      tabs: [
        { name: "水質監測" },
        { name: "環境監測" },
        { name: "投餵飼料" },
        //{ name: "飼料觀察網" },
        { name: "進階值" },
        { name: "養殖用料" },
        { name: "菌相" }
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
      //bac
      bacloading: false,
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
        this.defPool= { 水質: [], 環境: [], 飼料: [], 觀察: [], 進階: [], 益生菌: [],用料:[] };
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
          const getAnalyzeDataListWater = await this.getAnalyzeDataList(parm);
          const dataWater = typeof (getAnalyzeDataListWater)=='string'?[]:getAnalyzeDataListWater;
          this.waterdata = [];
          this.waterdata = dataWater;
          // await this.$axios
          //   .get(apiURL, { params: parm }, { httpsAgent: agent })
          //   .then(res => {
          //     console.log("select:", res.request.responseURL);
          //     this.waterdata = res.data;
          //     // this.goAnchor('#chart');
          //   })
          //   .catch(err => {
          //     alert("失敗：" + err.message);
          //   });
          setTimeout(()=>{
            this.waterloading = false;
          },500)
          
          break;
        case "feed": //飼料
          this.feedloading = true;
          const getAnalyzeDataListFeed = await this.getAnalyzeDataList(parm);
          const dataFeed = typeof (getAnalyzeDataListFeed)=='string'?[]:getAnalyzeDataListFeed;
          this.feeddata = [];
          this.feeddata = dataFeed;
          // await this.$axios
          //   .get(apiURL, { params: parm }, { httpsAgent: agent })
          //   .then(res => {
          //     console.log("select:", res.request.responseURL);
          //     this.feeddata = res.data;
          //     // this.goAnchor('#chart');
          //   })
          //   .catch(err => {
          //     alert("失敗：" + err.message);
          //   });
          setTimeout(()=>{
            this.feedloading = false;
          },500)
          break;
        case "env": //環境
          this.envloading = true;
          const getAnalyzeDataListEnv = await this.getAnalyzeDataList(parm);
          const dataEnv = typeof (getAnalyzeDataListEnv)=='string'?[]:getAnalyzeDataListEnv;
          this.envdata = [];
          this.envdata = dataEnv;
          // await this.$axios
          //   .get(apiURL, { params: parm }, { httpsAgent: agent })
          //   .then(res => {
          //     console.log("select:", res.request.responseURL);
          //     this.envdata = res.data;
          //     // this.goAnchor('#chart');
          //   })
          //   .catch(err => {
          //     alert("失敗：" + err.message);
          //   });
          setTimeout(()=>{
            this.envloading = false;
          },500)
          break;
        case "obs": //觀察網
          this.obsloading = true;
          const getAnalyzeDataListObs = await this.getAnalyzeDataList(parm);
          const dataObs = typeof (getAnalyzeDataListObs)=='string'?[]:getAnalyzeDataListObs;
          this.obsdata = [];
          this.obsdata = dataObs;
          // await this.$axios
          //   .get(apiURL, { params: parm }, { httpsAgent: agent })
          //   .then(res => {
          //     console.log("select:", res.request.responseURL);
          //     this.obsdata = res.data;
          //     // this.goAnchor('#chart');
          //   })
          //   .catch(err => {
          //     alert("失敗：" + err.message);
          //   });
          setTimeout(()=>{
            this.obsloading = false;
          },500)
          break;
        case "adv": //進階值
          this.advloading = true;
          const getAnalyzeDataListAdv = await this.getAnalyzeDataList(parm);
          const dataAdv = typeof (getAnalyzeDataListAdv)=='string'?[]:getAnalyzeDataListAdv;
          this.advdata = [];
          this.advdata = dataAdv;
          // await this.$axios
          //   .get(apiURL, { params: parm }, { httpsAgent: agent })
          //   .then(res => {
          //     console.log("select:", res.request.responseURL);
          //     this.advdata = res.data;
          //     // this.goAnchor('#chart');
          //   })
          //   .catch(err => {
          //     alert("失敗：" + err.message);
          //   });
          setTimeout(()=>{
            this.advloading = false;
          },500)
          break;
        case "pbio": //益生菌
          this.pbioloading = true;
          const getAnalyzeDataListPbio = await this.getAnalyzeDataList(parm);
          const dataPbio = typeof (getAnalyzeDataListPbio)=='string'?[]:getAnalyzeDataListPbio;
          this.pbiodata = [];
          this.pbiodata = dataPbio;
          // await this.$axios
          //   .get(apiURL, { params: parm }, { httpsAgent: agent })
          //   .then(res => {
          //     console.log("select:", res.request.responseURL);
          //     this.pbiodata = res.data;
          //     // this.goAnchor('#chart');
          //   });
          setTimeout(()=>{
            this.pbioloading = false;
          },500)
          break;
        case "material"://養殖用料
          this.materialloading = true;
          parm.data_group = 'breeding_material';
          const getAnalyzeDataListMaterial = await this.getAnalyzeDataList(parm);
          const dataMaterial = typeof (getAnalyzeDataListMaterial)=='string'?[]:getAnalyzeDataListMaterial;
          this.materialdata = [];
          this.materialdata = dataMaterial;
          // await this.$axios
          //   .get(apiURL, { params: parm }, { httpsAgent: agent })
          //   .then(res => {
          //     console.log("select:", res.request.responseURL);
          //     this.materialdata = res.data;
          //     // this.goAnchor('#chart');
          //   });
          setTimeout(()=>{
            this.materialloading = false;
          },500)
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
        '水溫',
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
    // await this.$axios
    //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`, { httpsAgent: agent })
    //   .then(res => {
    //     console.log("architecture:", res.request.responseURL);
    //     this.maindata = res.data;
    //     this.sel_main = undefined;
    //     this.defaultPool = '';
    //     if(this.maindata.length>0) {
    //       this.defaultPool = this.maindata[0].node[0].name+'_'+this.maindata[0].node[0].id;
    //     }else {
    //       this.defaultPool = '';
    //     }
    //     console.log(this.defaultPool);
    //   });
    // let architectureData = await this.getArchitecture();
    // this.maindata = typeof (architectureData)=='string'?[]:architectureData;
    this.maindata = JSON.parse(localStorage.getItem('architecture'))?JSON.parse(localStorage.getItem('architecture')):await this.getArchitecture();
    this.sel_main = undefined;
    this.defaultPool = '';
    if(this.maindata.length>0) {
      this.defaultPool = this.maindata[0].node[0].name+'_'+this.maindata[0].node[0].id;
    }else {
      this.defaultPool = '';
    }
    console.log(this.defaultPool);
      
    //get all cols
    let allcolData = await this.getAllColNameList();
    this.allcols = typeof (allcolData)=='string'?[]:allcolData;
    // await this.$axios
    //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/all-col-name/`, { httpsAgent: agent })
    //   .then(res => {
    //     console.log("all-col-name:", res.request.responseURL);
    //     this.allcols = res.data;
    //   });
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

.spector {
  color: $color-primary;
  padding-bottom: 2px;
  border-bottom: 1px solid $color-primary;
  width: 88px;
}
.pool-name {
  color: $color-dark;
}
</style>
