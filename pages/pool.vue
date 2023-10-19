<template>
  <div>
    <!-- <v-card elevation="1" outlined tile min-height="200"> -->
    <v-row no-gutters justify="center" dense>
      <!-- 主功能：查詢、新增循環 功能按鈕 要加底色在這primary -->
      <v-col cols="12" sm="12"> 
        <v-row class="pa-0">
          <!-- 養殖池(下拉) -->
          <v-col cols="12" sm="12">
            <!-- <v-span v-if="$route.query.id!=undefined"  style="color:white;">
              <v-chip class="mx-0 py-0 px-3" color="white" label large  text-color="white" outlined >
                {{getNodeName(poolid)}}
              </v-chip>
              </v-span> -->
            <!-- <div class="circle">
                      <span class="circletitle">{{ poolName }}</span>
                    </div> -->
            <!-- <span class="circletitle headline my-5 text-center">{{
                      poolName
                      }}</span> -->
            <treeselect v-if="$route.query.id==undefined" v-model="poolid" :options="maindata" :default-expand-level="1" placeholder="養殖池"
              :disable-branch-nodes="true" children="node" :normalizer="
                        node => {
                          return { children: node.node };
                        }
                      " @input="mainchange" style="font-size:1.2em;">
              <div slot="value-label" slot-scope="{ node }">
                {{ `${node.raw.parent}_${node.raw.name}` }}
              </div>
              <div slot="option-label" slot-scope="{ node }">
                {{ `${node.raw.name}` }}
              </div>
            </treeselect>
            
          </v-col>
          
        
        </v-row>
      </v-col>



      <!-- 下方tabs -->
      <v-col cols="12" class="mt-0 mb-5">
        <v-tabs dark background-color="rgb(0, 0, 0, 0)" show-arrows vertical>
          <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
          <!-- <v-chip class="mx-0 py-0 px-3" color="white" label large  text-color="blue" outlined >
                {{getNodeName(poolid)}}
              </v-chip> -->
            <span class="mx-0 py-0 px-3 headline" style="color:lime;"> {{getNodeName(poolid)}}</span>
          <v-tab v-for="(tab, idx) in tabs" dark :key="idx" :href="`#` + tab.name" style="font-size:0.8em;">
            {{ tab.name }}
          </v-tab>
          <v-tab-item :value="'即時數據'">
            <!-- <v-overlay :value="materialloading" :absolute="true">
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay> -->
            <v-card flat tile class="papper">
              <v-card-text>
                <v-row>
                  <!-- 數據(24H) -->
                  <v-col cols="12" sm="12" class="pr-0 pt-0">
                    <v-row>
                      <!-- 數據(24H) -->
                      <v-col cols="12" sm="12" style="min-height:300px;">
                        <v-card min-height="300px" elevation="3" tile dark color="primary">
                          <v-card-title class="py-1 cardtitle" v-if="false">
                            數據(24H)
                          </v-card-title>
                          <v-divider v-if="false"></v-divider>
                          <v-card-text class="pa-0">
                            <v-tabs v-model="currentItem" background-color="primary">
                              <v-tab v-for="(item, index) in tabitems" :key="index" :href="'#tab-' + item" class="primary">
                                {{ item }}
                              </v-tab>
                              <v-tabs-items v-model="currentItem" class="primary">
                                <v-tab-item :value="'tab-' + tabitems[0]">
                                  <v-overlay :value="detectloading" :absolute="true">
                                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                                  </v-overlay>
                                  <v-row>
                                    <v-col cols="12">
                                      <div class="text-center mt-5" v-if="detectData.length == 0">
                                        <h2>查無資料</h2>
                                      </div>
                                      <v-slide-group v-model="slidemodel" :show-arrows="'always'">
                                        <v-slide-item v-for="(item, index) in detectData" :key="index" v-slot="{ active, toggle }">
                                          <v-card elevation="3" class="mx-1 mt-1 text-center" @click="toggle" :min-width="150"
                                            :max-width="200">
                                            <v-card-text class="justify-center">
                                              <span class="font-weight-bold">{{ `${item.name_ch}:${ item.value }` }}</span>
                                            </v-card-text>
                                            <div style="height:120px;" class="px-2">
                                              <!-- 車速圖 -->
                                              <vue-speedometer :value="parseFloat(item.value)" :needleHeightRatio="0.7" :minValue="item.min"
                                                :maxValue="item.max" :customSegmentStops="[
                                                          item.min,
                                                          item.critical_min,
                                                          item.warning_min,
                                                          item.warning_max,
                                                          item.critical_max,
                                                          item.max
                                                        ]" :segmentColors="[
                                                          '#F197B3',
                                                          '#FFEC8B',
                                                          '#89E0B6',
                                                          '#FFEC8B',
                                                          '#F197B3'
                                                        ]" :needleTransitionDuration="3333" needleTransition="easeElastic" :ringWidth="20"
                                                :width="180" :forceRender="true" v-if="
                                                          item.name_en != 'water_level_percentage'
                                                        "></vue-speedometer>
                                              <!-- 水球圖 -->
                                              <v-card-text v-if="
                                                          item.name_en == 'water_level_percentage'
                                                        ">
                                                <waterball :value="parseFloat(item.value) / 100"></waterball>
                                              </v-card-text>
                                            </div>
                                            <v-divider></v-divider>
                                            <v-card-subtitle class=" py-2 px-2">
                                              共：{{ item.rows }}筆
                                              <!-- <span v-if="
                                                          item.name_en == 'water_level_percentage'
                                                        ">
                                                <br />{{ `警戒上限：${item.critical_max}%`
                                                }}<br />
                                                {{ `警戒下限：${item.critical_min}%` }}
                                                <br />{{ item.last_time }}</span> -->
                    
                                              <!--限水位才有資料 -->
                                            </v-card-subtitle>
                                            <v-scale-transition>
                                              <v-icon v-if="active" color="blue" size="48" >mdi-close-circle-outline</v-icon>
                                            </v-scale-transition>
                                          </v-card>
                                        </v-slide-item>
                                      </v-slide-group>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                  </v-row>
                                </v-tab-item>
                                <!-- 計算數據 -->
                                <!-- <v-tab-item :value="'tab-' + tabitems[1]">
                                  <v-row>
                                    <v-col class="text-center mt-5">
                                      <h2>建置中</h2>
                                    </v-col>
                                  </v-row>
                                </v-tab-item> -->
                                <!-- <v-tab-item :value="'tab-' + tabitems[2]">
                                        <v-row>
                                          <v-col class="text-center mt-5"><h2>建置中</h2></v-col>
                                        </v-row>
                                      </v-tab-item> -->
                              </v-tabs-items>
                            </v-tabs>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="7" class="pt-0 pr-0">
                    <v-card class="pa-0 ma-0" min-height="300px" elevation="3" tile dark color="primary">
                      <v-card-title class="py-1 ma-0 primary">養殖池資訊
                          <v-spacer></v-spacer>
                          <v-btn icon :disabled="true"><v-icon>mdi-reload</v-icon></v-btn>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-row class="mt-1 text-center px-2" >
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>總飼料量<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>套餐<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>最近投餵時間<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>最近打樣日期<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>最近打樣-克數<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>最近打樣-水溫<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>ADG<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>最近打樣-內存量/理論投餵量<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>丞載量(KG)<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>達每噸水3 Kg需耗時（天）<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>放養量（隻)<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>存活率<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>假定FCR<br/>開發中</v-card-text></v-card>
                          <v-card class="light-blue darken-4" width="100" tile><v-card-text>累計投餵量<br/>開發中</v-card-text></v-card>
                        </v-row>
                        
                      </v-card-text>
                      </v-card>
                  </v-col>
                  <!-- 氣象 -->
                  <v-col cols="12" sm="3" class="py-0">
                    <v-card class="pa-0" min-height="300px" elevation="3" tile dark color="primary">
                      <v-card-title class="py-1 primary">氣象<v-img max-width="25"
                          :src="`http://openweathermap.org/img/w/${weatherdata.weather[0].icon}.png`"></v-img>{{weatherdata.weather[0].main}}
                          <v-spacer></v-spacer>
                          <v-btn icon @click="getWeather"><v-icon>mdi-reload</v-icon></v-btn>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-row style="color:#FFF;" justify="center" align="center" dense>
                          <v-col cols="12">
                            地區:<span>{{location.map(x=>x.name).join()}}</span><br/>
                            <!-- 天氣概況：{{weatherdata.weather[0].main}}_ -->
                            說明：{{weatherdata.weather[0].description}}
                          </v-col>
                          <v-col cols="12" sm="12">
                            溫度：{{`${weatherdata.main.temp} °C`}}{{`(${weatherdata.main.temp_min}~${weatherdata.main.temp_max})`}}<br />
                            體感溫度：{{`${weatherdata.main.feels_like} °C`}}<br />
                            濕度：{{`${weatherdata.main.humidity} %`}}<br />
                            氣壓：{{`${weatherdata.main.pressure} hPa`}}<br />
                            海平面氣壓：{{`${weatherdata.main.sea_level} hPa`}}<br/>
                            地面大氣壓：{{`${weatherdata.main.grnd_level} hPa`}}<br />
                            <!-- 風速：{{`${weatherdata.wind.speed}`}}m/h<br /> -->
                            <!-- 風向：{{`${weatherdata.wind.deg}`}}<br /> -->
                            <!-- 陣風：{{`${weatherdata.wind.gust} m/s`}}<br /> -->
                            <!-- 雲量：{{`${weatherdata.clouds.all} %`}} -->
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- 警示區 -->
                  <v-col cols="12" sm="2" class="">
                    <!-- 水平置中要加這個 align-self="center" -->
                    <v-row>
                    <v-col cols="12" sm="12" style="min-height:300px;border:0px dashed red;" class="py-0 px-0">
                      <v-card min-height="300px" elevation="3" tile dark color="primary">
                        <v-card-title class="py-1 primary" title="(24小時內且目前有啟用警示項目最新一列資料)" >
                          警示區
                          <v-spacer></v-spacer>
                          <span class="subtitle-2">更新時間：{{
                            warnDataDt.length == 0 ? "00:00:00" : ""
                          }}{{ warnDataDt }}</span>
                          <v-btn :loading="warnLoading" :disabled="!poolid || warnLoading" class=" white--text" icon
                          @click="getwarnData">
                          <v-icon dark>
                            mdi-reload
                          </v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="mb-0">
                          <!-- <span class="mt-0" style="font-size: 1em;color:#C62828;">(24小時內且目前有啟用警示項目最新一列資料)</span> -->
                          <v-sheet class="overflow-y-auto mainbg" min-height="100px" max-height="100" v-if="warnData.length != 0">
                            <v-card-text>
                              <!-- <v-chip-group column dark> -->
                              <!-- @click="showwarning(item)" 拿掉處理的視窗-->
                              <v-chip class="mr-1" v-for="item in warnData" :key="item.id" :color="
                                      item.warning_level.toLowerCase() == 'critical'
                                        ? `red`
                                        : `orange`
                                    ">{{
                                `${item.inspected_time.match(/[^\s]*$/)[0]}-[等級：${
                                item.warning_level
                                }]：${item.warning_content}`
                                }}
                              </v-chip>
                              <!-- </v-chip-group> -->
                            </v-card-text>
                          </v-sheet>
                          <div class="text-center my-5 white--text h1" v-if="warnData.length == 0">
                            暫無警示
                          </div>
                        </v-card-text>
                      </v-card>
                      <!-- <span class="subtitle">警示資料時間：{{ warnDataDt }}</span>
                          <v-btn
                            :loading="warnLoading"
                            :disabled="warnLoading"
                            color="green"
                            class="ma-2 white--text"
                            icon
                            @click="getwarnData"
                            v-if="poolid"
                          >
                            <v-icon dark>
                              mdi-reload
                            </v-icon>
                          </v-btn> -->
                      <v-dialog v-model="warnDialog" max-width="500px">
                        <v-form ref="warnform" v-model="warnvalid" lazy-validation>
                          <v-card>
                            <v-card-title>警示等級：「{{ warnDataSel.warning_level }}」</v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                              <v-row dense>
                                <v-col cols="12">警示時間：{{ warnDataSel.inspected_time }}</v-col>
                                <v-col cols="12">警示內容：{{ warnDataSel.warning_content }}</v-col>
                                <v-col cols="12">警示來源(資料/設備 層面)：{{
                                  warnDataSel.warning_resource
                                  }}</v-col>
                                <v-col cols="12">警示建立者：{{ warnDataSel.created_user }}</v-col>
                              </v-row>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-text>
                              <v-row dense>
                                <v-col cols="12">
                                  <v-text-field dense v-model="warnDataSel.maintenance_user" clearable filled :rules="rules.require">
                                    <span style="width:100px;" slot="prepend" @click="
                                            warnDataSel.maintenance_user = $auth.$state.user.name
                                          ">
                                      <v-tooltip bottom><template v-slot:activator="{ on, attrs }"><span v-bind="attrs" v-on="on"
                                            style="color:darkblue;">最後處理人員</span></template><span>點擊可直接帶入登入者姓名</span></v-tooltip>
                                    </span>
                                  </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-text-field dense v-model="warnDataSel.warning_reason" clearable filled :rules="rules.require"><span
                                      style="width:100px;" slot="prepend">判定原因</span></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-textarea clearable filled v-model="warnDataSel.handling_method" auto-grow row="2" row-height="20"
                                    clear-icon="mdi-close-circle" :rules="rules.require"><span style="width:100px;"
                                      slot="prepend">處理方式</span></v-textarea>
                                  <!-- <v-text-field dense clearable
                                      ><span style="width:100px;" slot="prepend" 
                                        >處理方式</span
                                      ></v-text-field
                                    > -->
                                </v-col>
                              </v-row>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" @click="warnsubmit(false)" tile>暫存</v-btn>
                            </v-card-actions>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-switch v-model="warnDataSel.is_add_to_event_log" :label="`結案時一併加入重要紀事`" dense color="error"></v-switch>
                              <v-btn color="error" @click="warnsubmit(true)" tile>結案</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-form>
                      </v-dialog>
                    </v-col>
                  </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <!--  數據圖 -->
                  <v-col cols="12" sm="12" class="px-0" style="min-height:200px;" v-if="false">
                    <v-card min-height="500px" elevation="3" tile dark color="primary">
                      <v-card-title class="py-2 cardtitle">
                        數據圖
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-row>
                          <!-- 選擇起日 -->
                          <v-col cols="12" sm="2">
                            <v-menu v-model="menu_chart_startdate" :close-on-content-click="false" :nudge-right="40"
                              transition="scale-transition" offset-y min-width="auto">
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="chart_started_date" label="選擇起日" prepend-icon="mdi-calendar" readonly dark dense
                                  v-bind="attrs" v-on="on" @click:prepend="
                                            () => (chart_started_date = getNowDate())
                                          "></v-text-field>
                              </template>
                              <v-date-picker v-model="chart_started_date" locale="zh-tw" no-title @input="menu_startdate = false">
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <!-- 選擇訖日 -->
                          <v-col cols="12" sm="2">
                            <v-menu v-model="menu_chart_enddate" :close-on-content-click="false" :nudge-right="40"
                              transition="scale-transition" offset-y min-width="auto">
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="chart_ended_date" label="選擇訖日" prepend-icon="mdi-calendar" readonly dark dense
                                  v-bind="attrs" v-on="on" @click:prepend="
                                            () => (chart_ended_date = getNowDate())
                                          "></v-text-field>
                              </template>
                              <v-date-picker v-model="chart_ended_date" no-title locale="zh-tw" @input="menu_chart_enddate = false">
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <!-- 指定項目 -->
                          <v-col cols="12" sm="2">
                            <v-autocomplete v-model="defitem" :items="waterdatacols" no-data-text="查無資料" placeholder="指定項目" clearable
                              dark dense></v-autocomplete>
                          </v-col>
                          <!-- 確認鈕 -->
                          <v-col cols="12" md="1">
                            <v-btn tile dark color="cardtitle" @click="getdata" :disabled="
                                        poolid &&
                                        defitem &&
                                        defitem != undefined &&
                                        defitem.length > 0
                                          ? false
                                          : true
                                      ">確認</v-btn>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12">
                            顯示最小值：<el-input-number v-model="chartmin" controls-position="right" :min="0"></el-input-number>
                            顯示最大值：<el-input-number v-model="chartmax" controls-position="right" :min="0"></el-input-number>
                            <WaterQuality_Vcharts :rowsData="item.items" xColName="inspected_date" :defaultitem="{}"
                              :loading="waterloading" :title="item.name" :chartmin="chartmin" :chartmax="chartmax" :markdata="markdata">
                            </WaterQuality_Vcharts>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'觀察網'" v-if="false">
            <v-card flat tile class="papper">
              <v-card-text>
            <v-row>
              <!--觀察網(蝦況) -->
              <v-col cols="12" sm="12" class="px-0">
                <v-card min-height="300px" elevation="3" tile dark color="primary">
                  <v-card-title class="py-2 cardtitle">
                    觀察網(蝦況)
                    <v-spacer></v-spacer>
                    <v-icon @click="showdialog_imgdialog" :disabled="!poolid">mdi-image-plus</v-icon>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-title>
                    <div v-if="shirimpData.length > 0">
                      <v-row>
                        <v-col cols="12" lg="6" v-for="(item, index) in shirimpData[0].item" :key="index" class="py-1">
                          <v-btn block color="#64B5F6" outlined style="font-size:0.8em;">
                            {{ `${item.name_ch}:${item.value}` }}
                          </v-btn>
                          <!-- <v-chip class="ma-2" color="#64B5F6" label outlined>
                                {{ item.name_ch }}：{{ item.value }}
                              </v-chip> -->
                        </v-col>
                        <v-col cols="12" sm="12" class="text-center">
                          <h5>
                            {{ shirimpData[0].inspected_time }}
                          </h5>
                          <!-- 圖：{{shirimpData[0].image_url}}<br/> -->
                        </v-col>
                        <v-col cols="12" sm="12">
                          <img v-img :src="shirimpData[0].image_url" v-if="shirimpData[0].image_url" width="100%" height="300px" />
                        </v-col>
                      </v-row>
                    </div>
                    <div class="text-center my-2" v-else>
                      查無資料
                    </div>
                  </v-card-title>
                </v-card>
                <v-dialog v-model="imgdialog" max-width="500px">
                  <v-form ref="imgform" v-model="imgvalid" lazy-validation>
                    <v-card>
                      <!-- style="background-color:#64B5F6;color:white;" -->
                      <v-card-title>觀察網(蝦況)</v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <!-- 日期時間 -->
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-menu v-model="menu_imgdate" :close-on-content-click="false" :nudge-right="40"
                              transition="scale-transition" offset-y min-width="auto">
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="imgdata.imgdate" label="選擇日期(必選)" prepend-icon="mdi-calendar" readonly
                                  v-bind="attrs" v-on="on" :rules="rules.require" @click:prepend="
                                            () => (imgdata.imgdate = getNowDate())
                                          "></v-text-field>
                              </template>
                              <v-date-picker v-model="imgdata.imgdate" locale="zh-tw" no-title @input="menu_imgdate = false">
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field label="時間(必選)" v-model="imgdata.imgtime" value="" type="time"
                              prepend-icon="mdi-timeline-clock-outline" @click:prepend="
                                        () => (imgdata.imgtime = getNowTime())
                                      " :rules="rules.require"></v-text-field>
                          </v-col>
                        </v-row>
                        <v-file-input v-model="imgfiles" :rules="rules.filesize" accept="image/*" show-size placeholder="請選擇欲上傳圖片檔"
                          prepend-icon="mdi-camera" label="蝦況圖片(必選)" @change="chgimgurl"></v-file-input>
                        <img v-img :key="imgurlkey" :src="showimgurl" v-if="showimgurl !== ''" width="100%" />
                        <!-- <v-img v-img :key="imgurlkey" :src="showimgurl" v-if="showimgurl!==''" width="100%"></v-img> -->
                      </v-card-text>
                      <v-card-text>
                        <div v-for="(item, index) in imgdata.item" :key="index">
                          <v-row>
                            <v-col cols="12" sm="6">
                              {{ item.name }}
                            </v-col>
                            <v-col cols="12" sm="6">
                              <el-input-number :id="item.name" :ref="item.name" class="ml-2" v-model="
                                          imgdata.item.filter(x => x.name == item.name)[0]
                                            .value
                                        " size="mini" :precision="2" :step="1" :min="num_min" :max="num_max"></el-input-number>
                            </v-col>
                          </v-row>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn tile color="primary" @click="submit_imgdialog" :disabled="false">上傳</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </v-dialog>
              </v-col>
            </v-row>
            </v-card-text>  
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'養殖循環'">
            <v-card flat tile class="papper">
              <v-card-title>
                <v-row>
                  <!-- 選擇起日 -->
                  <v-col cols="12" md="2" class="text-center">
                    <v-menu v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                      offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="started_date" label="選擇起日" filled hide-details prepend-icon="mdi-calendar" readonly dark
                          dense v-bind="attrs" v-on="on" @click:prepend="() => (started_date = getNowDate())"></v-text-field>
                      </template>
                      <v-date-picker v-model="started_date" no-title locale="zh-tw" @input="menu_startdate = false">
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- 選擇訖日 -->
                  <v-col cols="12" md="2" class="text-center">
                    <v-menu v-model="menu_enddate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                      offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="ended_date" label="選擇訖日" filled hide-details prepend-icon="mdi-calendar" readonly dark
                          dense v-bind="attrs" v-on="on" @click:prepend="() => (ended_date = getNowDate())"></v-text-field>
                      </template>
                      <v-date-picker v-model="ended_date" no-title locale="zh-tw" @input="menu_enddate = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- 按鈕-查詢 -->
                  <!-- 按鈕-新增循環 -->
                  <v-col cols="12" md="2">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-btn tile class="mt-2" color="cardtitle" dark @click="getCircleData" :block="$vuetify.breakpoint.mobile">查詢
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-btn dark color="cardtitle" tile class="mt-2" @click="showadd" :block="$vuetify.breakpoint.mobile">
                          <v-icon>mdi-plus</v-icon>新增循環
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                
                  <!-- 新增循環的dialog -->
                  <v-col cols="12" sm="5" class="text-center mt-3" hidden>
                    <v-col cols="12" sm="12">
                      <v-dialog v-model="addDialog" max-width="500px">
                        <v-form v-model="addvalid" ref="cycleform">
                          <v-card>
                            <v-card-title>新增-養殖循環</v-card-title>
                            <v-card-text>
                              <v-text-field v-model="addparm.name" label="名稱/批號" :rules="rules.require" autocomplete="off">
                              </v-text-field>
                              <v-menu v-model="menu_adddate" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field v-model="addparm.started_date" label="選擇起日" :rules="rules.require"
                                    prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" @click:prepend="
                                                              () => (addparm.started_date = getNowDate())
                                                            "></v-text-field>
                                </template>
                                <v-date-picker v-model="addparm.started_date" no-title locale="zh-tw" @input="menu_adddate = false">
                                </v-date-picker>
                              </v-menu>
                            </v-card-text>
                            <v-card-text>
                              <v-row align="center">
                                <!-- 體積 -->
                                <v-col cols="3">
                                  <v-text-field v-model="add_volume" label="體積(水量)" type="number" disabled
                                    background-color="blue-grey lighten-4" autocomplete="off"></v-text-field>
                                </v-col>
                                <v-col cols="1" class="text-center">X</v-col>
                                <!-- 密度 -->
                                <v-col cols="3">
                                  <v-text-field v-model.number="addparm.num_per_unit" label="密度" type="number" :rules="rules.require"
                                    @change="
                                                              () => {
                                                                addparm.estimated_num =
                                                                  add_volume * addparm.num_per_unit;
                                                              }
                                                            " autocomplete="off"></v-text-field>
                                </v-col>
                                <v-col cols="1" class="text-center">=</v-col>
                                <!-- 初始放苗量(估計) -->
                                <v-col cols="4">
                                  <v-text-field v-model="addparm.estimated_num" label="初始放苗量(估計)" type="number" :rules="rules.require"
                                    disabled background-color="blue-grey lighten-4" autocomplete="off">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-select v-model="addparm.seedling_id" dense filled :items="SeedlingData" item-value="id" hide-details
                                    item-text="name_ch" clearable :rules="rules.require">
                                    <span slot="prepend" style="width:80px">選擇種苗</span>
                                  </v-select>
                                </v-col>
                                <v-col cols="12">
                                  <v-menu v-model="menu_stockeddate" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field v-model="addparm.stocked_date" label="放苗日" :rules="rules.require"
                                    prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" @click:prepend="
                                                              () => (addparm.stocked_date = getNowDate())
                                                            "></v-text-field>
                                </template>
                                <v-date-picker v-model="addparm.stocked_date" no-title locale="zh-tw" @input="menu_stockeddate = false">
                                </v-date-picker>
                              </v-menu>
                                </v-col>
                                <v-col cols="12">
                                  <v-autocomplete v-model="addparm.person_in_charge" dense filled :items="accdata" item-value="username" hide-details
                                    :filter="filterincharge" clearable :rules="rules.require">
                                    <span slot="prepend" style="width:80px">養殖負責</span>
                                    <span slot="selection" slot-scope="data">{{data.item.position}}-{{data.item.account_name}}</span>
                                    <span slot="item" slot-scope="data">{{data.item.position}}-{{data.item.account_name}}</span>
                                  </v-autocomplete>
                                </v-col>
                                <v-col>
                                  <v-select v-model="addparm.water_source" clearable :items="optData.WaterSource" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch" :rules="rules.require"><span style="width:80px;" class="pa-0 ma-0 text-center" slot="prepend">水源</span></v-select>
                                  <v-text-field v-model.number="addparm.water_source_salinity" type="number" dense hide-details filled class="mt-5" :rules="rules.require"><span style="width:80px;" class="pa-0 ma-0 text-center" slot="prepend">鹽度(度)</span></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-row>
                                    <v-col cols="6">
                                      <v-text-field filled dense type="number" v-model.number="addparm.estimated_harvest_weight" hide-details>
                                        <span slot="prepend" style="width:80px">預估收成個體重(g)(選)</span>
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                      <v-text-field filled dense type="number" v-model.number="addparm.estimated_survival_rate" hide-details>
                                        <span slot="prepend" style="width:80px">預估存活率(%)(選)</span>
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                      <v-text-field filled dense type="number" v-model.number="addparm.cn" hide-details>
                                        <span slot="prepend" style="width:80px">目標CN比(選)</span>
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                      <v-text-field filled dense type="number" v-model.number="addparm.estimated_fcr" hide-details>
                                        <span slot="prepend" style="width:80px">預估FCR(選)</span>
                                      </v-text-field>
                                    </v-col>
                                    <!-- <v-col cols="6">
                                      <v-text-field filled dense type="number" v-model.number="addparm.estimated_adg" hide-details>
                                        <span slot="prepend" style="width:80px">預測ADG(選)</span>
                                      </v-text-field>
                                    </v-col> -->
                                    <v-col cols="6">
                                      <v-text-field filled dense type="number" v-model.number="addparm.initial_weight" hide-details>
                                        <span slot="prepend" style="width:80px">放養初始重量(選)</span>
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                </v-col>
                                <v-col cols="12">
                                  <v-text-field filled dense v-model="addparm.remark" hide-details><span slot="prepend"
                                      style="width:80px">備註(選)</span>
                                  </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <!-- 樣板 先暫時拿掉-->
                                  <v-autocomplete disabled v-model="tempSelect" dense filled :items="template_items" item-text="name_ch" item-value="id" hide-details
                                    clearable @change="tempChange">
                                    <span slot="prepend"  style="width:100px">選擇樣板(選)</span>
                                  </v-autocomplete>
                                </v-col>
                              </v-row>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn tile color="primary" @click="submitadd">確認新增</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-form>
                      </v-dialog>
                    </v-col>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
            <v-row>
               <!-- 循環清單 -->
              <v-col cols="12" sm="12" class="px-0">
                <v-row>
                  <!-- 循環清單 -->
                  <v-col cols="12" sm="12">
                    <v-card  flat dark tile class="primary">
                      <v-card-title class="py-2 cardtitle">循環清單</v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <el-table ref="circletable" style="width:100%" :data="circleData" highlight-current-row
                          @current-change="handleCurrentChange" :header-cell-style="tableHeaderStyle" height="300" class="primary"
                          @select="handleSelectionChange" :header-cell-name="cellClass">
                          <!-- 名稱/批號 -->
                          <!-- <el-table-column label="名稱/批號" prop="name" align="center"></el-table-column> -->
                          <el-table-column label="[id]名稱/批號" prop="name" align="center">
                            <template slot-scope="scope">
                              <span>{{ `[${scope.row.id}]` }}<br/>{{ scope.row.name }}</span>
                            </template>
                          </el-table-column>
                          <!-- 循環起日 -->
                          <el-table-column label="循環起日" prop="started_date" align="center"></el-table-column>
                          <!-- 循環訖日 -->
                          <el-table-column label="循環訖日" prop="ended_date" align="center">
                            <template slot-scope="scope">
                              <span style="margin-left: 10px">{{
                                scope.row.ended_date == null || scope.row.ended_date == ""
                                ? `執行中`
                                : scope.row.ended_date
                                }}</span>
                            </template>
                          </el-table-column>
                          <!-- id -->
                          <el-table-column label="id" prop="id" align="center"></el-table-column>
                          <!-- 水源 -->
                          <el-table-column label="水源" prop="water_source2" align="center">
                            <template slot-scope="scope">
                              <span style="margin-left: 10px">
                                {{  (optData.WaterSource.filter(x=>x.name_en==scope.row.water_source).length==0)?scope.row.water_source:optData.WaterSource.filter(x=>x.name_en==scope.row.water_source)[0].name_ch  }}
                              </span>
                            </template>
                          </el-table-column>
                          <!-- 鹽度 -->
                          <el-table-column label="鹽度" prop="water_source_salinity" align="center"></el-table-column>
                          <!-- 養殖天數 -->
                          <el-table-column label="養殖天數" prop="days" align="center"></el-table-column>
                          <!-- 養殖密度 -->
                          <el-table-column label="養殖密度" prop="num_per_unit" align="center"></el-table-column>
                          <!-- 預估放養隻數 -->
                          <el-table-column label="預估放養隻數" prop="total" align="center"></el-table-column>
                          <!-- 目標CN比 -->
                          <el-table-column label="目標CN比" prop="cn" align="center"></el-table-column>
                          <!-- 預估FCR -->
                          <el-table-column label="預估FCR" prop="estimated_fcr" align="center"></el-table-column>
                          <!-- 預測ADG -->
                          <!-- <el-table-column label="預測ADG" prop="estimated_adg" align="center"></el-table-column> -->
                          <!-- 放養初始長度 -->
                          <!-- <el-table-column label="放養初始長度" prop="initial_length" align="center"></el-table-column> -->
                          <!-- 放養初始重量 -->
                          <el-table-column label="放養初始重量" prop="initial_weight" align="center"></el-table-column>

                          <el-table-column label="養殖負責" prop="person_in_charge" align="center">
                          </el-table-column>
                          <el-table-column fixed="right" label="操作" width="80">
                            <template slot-scope="scope">
                              <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
                              <v-btn color="primary" outlined small @click="delcircle(scope.row)" :disabled="scope.row.ended_date != null">
                                刪除</v-btn>
                            </template>
                          </el-table-column>
                        </el-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <!-- 養殖歷程 -->
              <v-col cols="12" sm="12" class="px-0">
                <!-- 養殖歷程 -->
                <v-row class="mb-10">
                  <v-col cols="12">
                    <v-card elevation="3" tile dark class="primary">
                      <v-card-title class="py-2 cardtitle"><span>養殖歷程</span>
                        <v-spacer></v-spacer><span>
                          <v-btn :disabled="true" icon title="養殖歷程設定" to="" target="_blank">
                            <v-icon>mdi-cog</v-icon>
                          </v-btn>
                        </span>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <FeedTemplate v-if="(feededitmode=='cycleedit' && passObj.tempContent.length>0)" :key="editKey" :templatemode="feededitmode" :passObj="passObj"></FeedTemplate>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              </v-row>
          </v-card-text>
            </v-card>
            </v-tab-item>
          <v-tab-item :value="'事件'" v-if="false">
            <v-card flat tile class="papper">
              <v-card-text>
            <!-- 事件紀錄 -->
            <v-row>
              <v-col cols="12">
                <v-card elevation="3" tile dark class="primary">
                  <v-card-title class="py-2 cardtitle">事件紀錄
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="mx-3" dark v-bind="attrs" v-on="on" @click="geteventData" :disabled="!poolid || !cirid">
                          mdi-reload
                        </v-icon>
                      </template>
                      <span>立即重新取得事件紀錄</span>
                    </v-tooltip>
                  </v-card-title>
          
                  <v-divider></v-divider>
                  <v-card-title>
                    <v-btn class="info" tile :disabled="!poolid || !cirid" @click="showlogDialog">新增紀錄<v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-dialog v-model="logDialog" max-width="500px">
                      <v-form ref="logform" v-model="logvalid" lazy-validation>
                        <v-card>
                          <v-card-title>新增紀錄</v-card-title>
                          <v-card-text>
                            <v-row>
                              <!-- 事件類型 -->
                              <v-col cols="12">
                                {{ logData.event_category_id }}
                                <v-autocomplete v-model="logData.event_category_id" :items="eventCategory" item-text="name_ch"
                                  item-value="id" dense filled clearable :rules="rules.require"><span style="width:80px;"
                                    slot="prepend">事件類型</span></v-autocomplete>
                              </v-col>
                              <!-- 標題 -->
                              <v-col cols="12">
                                <v-text-field autocomplete="off" v-model="logData.title" :rules="rules.require" clearable filled
                                  dense>
                                  <span style="width:80px;" slot="prepend">標題</span>
                                </v-text-field>
                              </v-col>
                              <!-- 內容 -->
                              <v-col cols="12">
                                <v-textarea autocomplete="off" v-model="logData.content" :rules="rules.require" clearable filled
                                  dense auto-grow row="2" row-height="20">
                                  <span style="width:80px;" slot="prepend">內容</span>
                                </v-textarea>
                              </v-col>
                            </v-row>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" tile @click="submitlog">新增</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-form>
                    </v-dialog>
                  </v-card-title>
                  <v-card-title>
                    <el-table ref="eventtable" style="width:100%" :data="eventData" class="primary"
                      :header-cell-style="tableHeaderStyle" height="250">
                      <template slot="empty">
                        <span>
                          <v-btn tile color="info0" @click="geteventData" :disabled="!poolid || !cirid">暫無資料，手動重新整理<v-icon
                              class="mx-3" @click="geteventData">
                              mdi-reload
                            </v-icon>
                          </v-btn>
                        </span>
                      </template>
                      <el-table-column label="時間" prop="created_time" align="center"></el-table-column>
                      <el-table-column label="分類" prop="event_category" align="center"></el-table-column>
                      <el-table-column label="標題" prop="title" align="center"></el-table-column>
                      <el-table-column label="內容" prop="content" align="center"></el-table-column>
                      <el-table-column label="資料建立人員" prop="created_user" align="center"></el-table-column>
                      <el-table-column fixed="right" label="操作" width="150">
                        <template slot-scope="scope">
                          <v-btn color="primary" outlined small :disabled="scope.row.ended_date != null"
                            @click="dellog(scope.row)">刪除</v-btn>
                          <!-- @click="delcircle(scope.row)" -->
                        </template>
                      </el-table-column>
                    </el-table>
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          </v-card>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </div>
</template>

<script>
//-----
import dayjs from "dayjs";
import _ from "lodash";
import "element-ui/lib/theme-chalk/index.css";
import waterball from "~/components/waterball.vue";
import WaterQuality_Vcharts from "@/components/sheet/waterQuality_vcharts";
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false
});
// import axios from "~/plugins/axios";
export default {
  
  components: { waterball },
  layout: "emptynologin",
  middleware: "auth",
  components: {
    WaterQuality_Vcharts
  },
  head(){
    return {
      title:"養殖池",
    }
  },
  data() {
    return {
      tabs: [
        { name: "即時數據" },
        //{ name: "觀察網" },
        { name: "養殖循環" },
        // { name: "事件" },
      ],
      title: 'Home page',
      req: this.$route.query,
      rules: {
        require: [v => !!v || "*必要項目"],
        filesize: [
          value => !value || value.size < 2000000 || "檔案大小必須小於 2 MB!",
          v => !!v || "*必要項目"
        ]
      },
      poolid: this.$route.query.id,
      cirid: undefined, //循環id
      poolName: "",
      maindata: [],
      circleData: [
        // {
        //   id: 1,
        //   started_date: "2020/01/01",
        //   ended_date: "執行中",
        //   days: 0,
        //   name: "test"
        // }
      ],
      multipleSelection: [],
      tabitems: ["檢測數據"],//, "計算數據(建置中)"
      currentItem: "檢測數據",
      detectloading: false, //是否正在取得24時資料
      detectData: [
        // {
        //   name_ch: "測試",
        //   value: 678,
        //   rows: "100",
        //   min: 0,
        //   max: 999,
        //   critical_min: 200,
        //   critical_max: 800,
        //   warning_min: 300,
        //   warning_max: 500
        // }
      ],
      slidemodel: null,
      //蝦況
      shirimpData: [],
      //數據圖相關
      menu_chart_startdate: false,
      menu_chart_enddate: false,
      chart_ended_date: this.getNowDate(),
      chart_started_date: dayjs(this.ended_date)
        .add(-7, "day")
        .format("YYYY-MM-DD"),
      defitem: [], //指定項目
      allcols: {}, //項目主清單
      waterdatacols: [], //項目子清單
      markdata: { maxline: -999, minline: -999 },
      chartmin: undefined,
      chartmax: undefined,
      item: [{ name: "", items: [] }], //線圖的主資料項
      waterloading: false, //折線圖
      //---日曆
      menu_startdate: false,
      menu_enddate: false,
      ended_date: this.getNowDate(3,'month'),
      started_date: dayjs(this.ended_date)
        .add(-3, "month")
        .format("YYYY-MM-DD"),
      //新增視窗
      addDialog: false,
      addvalid: false,
      menu_adddate: false,
      menu_stockeddate:false,
      add_volume: undefined,
      addparm: {
        started_date: undefined,//開始日期，有ended_date結束日期，但新增不需使用
        stocked_date:undefined, //放苗日
        name: undefined,//名稱或批號
        num_per_unit: undefined,//放養密度
        estimated_num: undefined, //放養隻數，改由後端算，但這裡是畫面呈現用
        seedling_id:undefined,//種苗id
        //estimated_harvest_catty:undefined,//預計收成斤數
        estimated_harvest_weight:undefined,//預估收成個體重
        estimated_survival_rate:70,//預計存活率
        remark:"",//備註
        person_in_charge:undefined,//負責人
      },
      //種苗
      SeedlingData:[],
      //蝦況
      imgvalid: false,
      imgdialog: false,
      imgfiles: [],
      menu_imgdate: false,
      imgdata: {
        imgdate: "",
        imgtime: "",
        item: [
          { name: "飼料殘餘量", value: undefined },
          { name: "健康狀況(活躍度)", value: undefined },
          { name: "腸線", value: undefined },
          { name: "均體長大小", value: undefined },
          { name: "肝胰腺顏色", value: undefined },
          { name: "增料比例", value: undefined },
          { name: "殼的狀態", value: undefined },
          { name: "均體重", value: undefined }
        ]
      },
      num_min: 0,
      num_max: 999,
      showimgurl: "",
      imgurlkey: 0, //強迫更新用
      //警示
      warnvalid: false, //警示的form
      warnDialog: false,
      warnData: [],
      warnDataSel: { is_add_to_event_log: false }, //加入重要紀事(處理警示)
      warnLoading: false,
      warnDataDt: "", //警示資料什麼時候取得的
      addimport: false, //加入重要紀事(處理警示)
      //紀事
      eventData: [],
      logDialog: false, //
      logvalid: true,
      logData: {
        title: undefined,
        content: undefined,
        event_category_id: undefined
      },
      eventCategory: [], //事件類型
      accdata:[],//帳號清單
      //氣像
      loc: {
        longitude: "121.82030882702146",
        latitude: "24.83616577553079"
      },
      location:[],
      weatherdata:{
          main:{
                feels_like: 0,
                grnd_level: 0,
                humidity: 0,
                pressure: 0,
                sea_level: 0,
                temp: 0,
                temp_max: 0,
                temp_min: 0,
          },
          wind:{
              speed:0,
              deg:0,
              gust:0
          },
          clouds:{
              all:0
          },
          weather:[{
                    description: "overcast clouds",
                    icon: "04d",
                    id: 0,
                    main: "Clouds"
          }]
       
      },
      // 樣板
      template_items: [],//樣版清單
      template_all:[],
      tempSelect: undefined,//已選到的樣版
      passObj:{tempMain:{},tempContent:[]},
      feededitmode:'cycleedit',
      editKey:0,
      optData:{},//選項
    };
  },
  methods: {
    //取得pooid的池子名稱
    getNodeName:function(id){
      if(this.maindata.length>0 && this.poolid!=undefined){
        let this_id = id;
        var area_list = this.maindata.flatMap(x=>x.node);
        var poolName = area_list.flatMap(x=>x.node).filter(x=>x.id==this_id)[0].name;
        var poolParent = area_list.flatMap(x=>x.node).filter(x=>x.id==this_id)[0].parent;
        return `${poolParent} ${poolName}`;
      }
    },
    //負責人搜尋
    filterincharge:function(item, queryText, itemText){
      // This is optional. You might want to remove this if you want to search for items with case sensitivity
      const searchText = queryText.toLowerCase();
      // define your custom logic of your filter
      const name = item.account_name.toLowerCase();
      const position = item.position.toString();
      const mail = item.username.toString();

      return (
        name.indexOf(searchText) > -1 ||
        position.indexOf(searchText) > -1 ||
        mail.indexOf(searchText) > -1
      );
    },
    //取得苗清單
    getSeedlingData:async function(){
                this.SeedlingModel = undefined;
                var url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/seedling/`;
                await this.$axios
                    .get(url)
                    .then(res => {
                        this.SeedlingData = res.data;
                    })
                    .finally(() => {
                /* 不論失敗成功皆會執行 */ 
                    });
            },
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
    getNowDate: function(addnum,type) {
      var mydate;
      if(type==undefined){
        type='day';
      }
      if(addnum!=undefined && addnum > 0){
        mydate = dayjs().add(addnum,type).format("YYYY-MM-DD");
      }else{
        mydate = dayjs().format("YYYY-MM-DD");
      }
      return mydate;
    },
    getNowTime: function() {
      let mytime = dayjs().format("HH:mm");
      return mytime;
    },
    geteventData: async function() {
      //取得事件紀錄清單
      //this.poolid
      // this.cirid
      console.log("事件紀錄");
      await this.$axios
        .get(
          `${this.$store.state.mydata.gobal_api.apiUrl}/pond-event-log/?pond_record_head_id=${this.cirid}`
        )
        .then(res => {
          this.eventData = res.data;
          console.log("event api:", res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
    },
    delcircle: async function(data) {
      await this.$confirm(
        `將永久删除該循環所有紀錄(包含事件紀錄、養殖歷程), 是否繼續?`,
        "警告",
        {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let id = data.id;
          this.$axios
            .delete(
              `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record/${id}/`
            )
            .then(res => {
              console.log("循環刪除 API:" + res.request.responseURL);
              if (res.data == "刪除成功") {
                this.getCircleData();
                this.$toast.success("刪除成功", { duration: 2000 });
              } else {
                this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
              }
            })
            .catch(error => {
              this.$toast.error("error:" + error, { duration: 2000 });
            });
        })
        .catch(err => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
          this.$toast.error("已取消删除" + err, { duration: 2000 });
        });
    },
    setNestedDisabled: function(obj, name) {
      //全部都設成disabled
      obj.forEach((itm, index) => {
        // console.log(itm.name);//所有node(含leaf)的名稱
        itm.parent = itm.hasOwnProperty("parent")
          ? itm.parent + "_" + name
          : name;
        const nodelst = ["1", "2"];
        if (nodelst.filter(x => x == itm.level) > 0) {
          itm.id = itm.name + "_" + itm.id;
        }
        if (itm.visible == false) {
          //隱藏走道用
          delete obj[index];
          return obj; //不用再找有無node
        }
        if (itm.hasOwnProperty("node")) {
          this.setNestedDisabled(itm.node, itm.name);
        }
      });
      return obj;
    },
    mainchange: async function() {
      //取得循環資料
      await this.getCircleData();
    },
    getMainData: async function() {
      let reqid = this.req.id;
      let getedItem = {};
      //取得整場架構資料
      //visible寫死名稱含^=false，寫死池的狀態=無=false
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
        .then(res => {
          this.maindata = res.data;
          var data = this.setNestedDisabled(_.cloneDeep(this.maindata), "");
          this.maindata = data;
        });
      //用id抓到name
      this.maindata.forEach(x => {
        x.node.forEach(y => {
          var item = y.node.filter(z => z.id == reqid);
          if (item.length == 1) {
            getedItem = item[0];
            return;
          }
        });
      });
      //把區域名稱加進去
      if (getedItem.hasOwnProperty("name")) {
        this.poolName = getedItem.name;
        console.log(getedItem);
      }
    },
    //取得項目子清單
    getItemData: async function() {
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/all-col-name/`)
        .then(res => {
          //拆主要類別，保留子項目
          var allitems = [];
          for (let i = 0; i < Object.keys(res.data).length; i++) {
            let colsclass = Object.keys(res.data)[i]; //water,env...;
            if (i != 0) {
              allitems.push({ divider: true });
            }
            allitems.push({ header: colsclass }); //group name
            allitems.push(...Object.keys(res.data[colsclass]));
          }
          this.waterdatacols = allitems;
          this.allcols = Object.assign({}, res.data);
          console.log("子項目 api", res.request.responseURL);
          // console.log("waterdatacols 子項目", this.waterdatacols);
        });
    },
    getCircleData: async function() {
      //取得循環資料-取得檢測數據、取得蝦況
      //歸零
      this.warnData = []; //警示
      this.circleData = []; //循環
      this.detectData = []; //檢測
      this.shirimpData = []; //蝦況
      if (this.poolid == undefined) {
        return;
      }
      let parm = {
        pond_id: this.poolid,
        started_date: this.started_date,
        ended_date: this.ended_date
      };
      var parm_url = Object.keys(parm)
        .map(key => key + "=" + parm[key])
        .join("&");
        await this.$axios
        .get(
          `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record/?${parm_url}`
        )
        .then(res => {
          this.circleData = res.data;
          console.log("循環資料 api",res.request.responseURL);
          if (this.circleData.length > 0) {
            this.getwarnData();
            // this.getDetectData();
            this.getshirimpData();
          }
        })
        .catch(error=>{
          this.$toast.error("error:" + error, { duration: 2000 });
        })
        .finally(() => {
          this.editKey = Math.floor(Math.random() * 100);//隨機key值0~100
          this.passObj = {tempMain:{},tempContent:[]};
        });

      // this.getDetectData(); //無論如何都要抓 事件紀錄清單
    },
    getDetectData: async function() {
      this.detectloading = true;
      await this.$axios
        .get(
          `${this.$store.state.mydata.gobal_api.apiUrl}/timely-data/?pond_id=${this.poolid}`
        )
        .then(res => {
          this.detectData = res.data;
          console.log("24小時資料 api:", res.request.responseURL);
        })
        .catch(error=>{
          console.log("24小時資料-" + error);
          console.log("24小時資料 api:", error.config.url);
        })
        .finally(() => {
          this.detectloading = false;
        });
    },
    getshirimpData: async function() {
      //暫無蝦況api
      //蝦況
      // await this.$axios
      //   .get(
      //     `${this.$store.state.mydata.gobal_api.apiUrl}/shrimp-status/?pond_id=${this.poolid}&is_last=true`
      //   )
      //   .then(res => {
      //     this.shirimpData = res.data;
      //   });
    },
    getwarnData: async function() {
      //警示區
      this.warnLoading = true;
      this.warnData = []; //clear
      await this.$axios
        .get(
          `${this.$store.state.mydata.gobal_api.apiUrl}/pond-abnormal-log/?pond_id=${this.poolid}`
        )
        .then(res => {
          this.warnData = res.data;
          this.warnDataDt = dayjs().format("HH:mm:ss");
          console.log("警示區api:", res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
      this.warnLoading = false;
    },
    showadd: async function() {
      this.addparm.started_date = undefined;
      this.addparm.name = undefined;
      this.addparm.num_per_unit = undefined;
      this.addparm.estimated_num = undefined;
      if (this.poolid == undefined) {
        this.$toast.info(`失敗：請先選擇養殖池`, {
          duration: 2000
        });
        return;
      }
      //
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`)
        .then(res => {
          var items = res.data.filter(x => x.id == this.poolid);
          if (items.length == 1) {
            this.add_volume = items[0].volume;
            this.addDialog = true;
          } else {
            this.$toast.success(
              `失敗：無法取得體積資料，池id:${this.poolid}}`,
              {
                duration: 2000
              }
            );
          }
        })
        .finally(() => {
          /* 不論失敗成功皆會執行 */
        });
    },
    showlogDialog: async function() {
      if (this.$refs.logform != undefined) {
        this.$refs.logform.reset();
      }
      if (this.eventCategory.length <= 0) {
        await this.$axios
          .get(`${this.$store.state.mydata.gobal_api.apiUrl}/event-category/`)
          .then(res => {
            console.log("事件類型 API:" + res.request.responseURL);
            this.eventCategory = res.data;
          })
          .catch(error => {
            this.$toast.error("error:" + error, { duration: 2000 });
          });
      }
      this.logDialog = true;
    },
    submitlog: async function() {
      if (!this.$refs.logform.validate()) {
        return;
      }
      var parm = this.logData;
      parm.pond_record_head_id = this.cirid;
      parm.created_user = this.$auth.$state.user.email;
      // console.log(parm);
      await this.$axios
        .post(
          `${this.$store.state.mydata.gobal_api.apiUrl}/pond-event-log/`,
          parm
        )
        .then(res => {
          console.log("新增 log API:" + res.request.responseURL);
          if (res.data == "新增成功") {
            this.geteventData(); //取得事件紀錄清單
            this.logDialog = false;
            this.$toast.success("新增成功", { duration: 2000 });
          } else {
            this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
          }
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
    },
    dellog: async function(data) {
      console.log(data);
      this.$confirm(`將永久删除該紀錄[${data.title}], 是否繼續?`, "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(
              `${this.$store.state.mydata.gobal_api.apiUrl}/pond-event-log/${data.id}`
            )
            .then(res => {
              console.log("刪除 log API:" + res.request.responseURL);
              if (res.data == "刪除成功") {
                this.geteventData(); //取得事件紀錄清單
                this.$toast.success("刪除成功", { duration: 2000 });
              } else {
                this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
              }
            })
            .catch(error => {
              this.$toast.error("error:" + error, { duration: 2000 });
            });
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(err => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
          this.$toast.error(err, { duration: 2000 });
        });
    },
    //帳號清單
    getaccList: async function() {
      await this.$axios
        .get(
          `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/`,
          { httpsAgent: agent }
        )
        .then(res => {
          var data = res.data;
          var mydata = data.filter(x=>x.is_active == true).map(x=>({username:x.username,id:x.id,account_name:x.account_name,position:x.position[0].department}));//只要正常啟用帳號
          this.accdata = Object.assign([],mydata.filter(x=>x.id!==1));//排除特殊人物
          console.log("accList api：" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("accList api ERR：" + error, { duration: 2000 });
        });
    },
    //取得選項-水源、水源鹽度
    getOptData:async function(){
      let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/field-option/`;
            await this.$axios.get(url).then(res => {
                if(res.status==200){
                    this.optData = res.data;
                    
                    //ObservationData
                    this.optData.IsMoultingPeriod = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];

                    //BacteriaData
                    this.optData.IsEMSInfected = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    this.optData.IsEHPInfected = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    this.optData.IsVirusInfected = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    this.optData.IsBacteriumInfected = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    
                    console.log("opt",this.optData);
                }else{
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }
            })
            .catch(error=>{
                this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            });
    },
    //新增循環
    submitadd: async function() {
      const updUser = this.$auth.$state.user.email;
      this.addparm.created_user = updUser;
      this.addparm.pond_id = parseInt(this.poolid); //需要int
      //樣板資料
      var tempMain = {};
      var tempContent = [];
      if(this.tempSelect!=undefined){
        var id = this.tempSelect;
        var temp = this.template_all.filter(x=>x.tempMain.id==id)[0];
        tempMain = temp.tempMain;
        tempContent = temp.tempContent;
      }
      this.addparm['tempMain'] = tempMain;
      this.addparm['tempContent'] = tempContent;
      let parm = Object.assign({},this.addparm);
      // return;
      delete parm.estimated_num;//刪除初始放苗量
      console.log(parm);
      // debugger;
      // return;
      var valid = this.$refs.cycleform.validate();
        if(valid){
          await this.$axios
            .post(
              `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record/`,
              parm
            )
            .then(res=>{
              if (res.data == "新增成功") {
                this.addDialog = false;
                this.$refs.cycleform.reset();
                this.getCircleData();
                this.$toast.success("新增成功，自動調整池狀態：「養殖審核」", { duration: 2000 });
              }else{
                this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
                console.log(res.data);
              }
            })
            .catch(error=>{
              this.$toast.error("新增失敗:" +error, { duration: 2000 });
              console.log(error);
            })
        }
    },
    showdialog_imgdialog: async function() {
      // this.imgdata.imgdate="";
      // this.imgdata.imgtime="";
      this.imgdata.item.forEach(item => {
        item.value = undefined;
      });
      // this.imgfiles = [];
      // this.showimgurl="";

      if (this.$refs.imgform != undefined) {
        this.$refs.imgform.reset();
      }
      this.imgdialog = true;
    },
    showwarning: function(data) {
      this.warnDataSel = data;
      this.warnDataSel.is_add_to_event_log = false; //switch 結案時加入重要紀事
      this.warnDialog = true;
    },
    warnsubmit: async function(pra_is_closed = false) {
      if (pra_is_closed == true && !confirm("結案後[警示區]不再顯示")) {
        return;
      }
      const updUser = this.$auth.$state.user.email;
      let parm = {
        warning_reason: this.warnDataSel.warning_reason,
        handling_method: this.warnDataSel.handling_method,
        maintenance_user: this.warnDataSel.maintenance_user,
        is_closed: pra_is_closed,
        is_add_to_event_log: this.warnDataSel.is_add_to_event_log,
        updated_user: updUser
      };
      console.log(this.warnDataSel.id, parm);
      await this.$axios
        .patch(
          `${this.$store.state.mydata.gobal_api.apiUrl}/pond-abnormal-log/${this.warnDataSel.id}`,
          parm
        )
        .then(res => {
          console.log("警示修改API:" + res.request.responseURL);
          if (res.data == "修改成功") {
            this.getwarnData(); //重取得警示資料
            this.warnDialog = false;
            this.$toast.success("修改成功", { duration: 2000 });
          } else {
            this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
          }
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
    },
    submit_imgdialog: async function() {
      // let parm = this.imgdata;
      let formData = new FormData();
      const updUser = this.$auth.$state.user.email;
      let additem = [];
      for (const key in Object.keys(this.imgdata.item)) {
        if (
          this.imgdata.item[key].hasOwnProperty("value") &&
          this.imgdata.item[key].value != undefined
        ) {
          additem.push(this.imgdata.item[key]);
        }
      }
      let param = {
        inspected_time: `${this.imgdata.imgdate} ${this.imgdata.imgtime}:00`,
        pond_id: parseInt(this.poolid), //需要int
        created_user: updUser,
        item: additem
        // image:this.imgfiles
      };
      console.log(param);
      formData.append("param", JSON.stringify(param));
      // parm全部加入
      // for (const key in parm) {
      //   formData.append(key,parm[key]);
      // }
      if (!this.$refs.imgform.validate()) {
        return;
      }

      formData.append("image", this.imgfiles); //required

      let config = { headers: { "Content-Type": "multipart/form-data" } };
      await this.$axios
        .post(
          `${this.$store.state.mydata.gobal_api.apiUrl}/shrimp-status/`,
          formData,
          config
        )
        .then(res => {
          console.log("API:" + res.request.responseURL);
          if (res.data == "新增成功") {
            this.getshirimpData(); //更新蝦況
            this.imgdialog = false;
            this.$toast.success("新增成功", { duration: 2000 });
          } else {
            this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
          }
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
    },
    chgimgurl: function() {
      this.imgurlkey += 1;
      this.showimgurl = "";
      this.showimgurl =
        this.imgfiles != null && this.imgfiles.length != 0
          ? URL.createObjectURL(this.imgfiles)
          : "";
    },
    handleSelectionChange: async function(selection, row) {
      //清除
      this.$refs.circletable.clearSelection();
      //選到當前
      if (selection.length != 0) {
        this.$refs.circletable.toggleRowSelection(row);
      }
    },
    handleCurrentChange: async function(val) {
      //清除
      this.$refs.circletable.clearSelection();
      // this.eventData = []; //清除事件紀錄清單
      this.$refs.circletable.toggleRowSelection(val);
      if(this.circleData.filter(x=>x.id==val.id).length==1){
        var tempMain = this.circleData.filter(x=>x.id==val.id)[0].tempMain;
        var tempContent = this.circleData.filter(x=>x.id==val.id)[0].tempContent;
        tempMain = (tempMain==undefined)?{}:[];
        tempContent= (tempContent==undefined)?{}:[];
        this.passObj["tempMain"] = tempMain;
        this.passObj["tempContent"] = tempContent;
      }
      // return;
      //下面不做，之前有做事件紀錄
      // if (val != null) {
      //   this.cirid = val.id; //循環id
      //   await this.getDetectData();
      // } else {
      //   this.cirid = undefined;
      // }
      // // this.currentRow = val;
      // await this.geteventData();//取得事件紀錄清單
    },
    //依項目回傳主要類別是什麼
    getItemClass: async function(item) {
      let colclass = "";
      for (let i = 0; i < Object.keys(this.allcols).length; i++) {
        let inclass = Object.keys(this.allcols)[i]; //water;
        let checkclass = Object.keys(this.allcols[inclass]).includes(item);
        if (checkclass == true) {
          colclass = inclass;
          return colclass;
        }
      }
    },
    //
    getLimitData: async function(item) {
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/`)
        .then(res => {
          // this.allcols = Object.assign([], res.data);
          var lmtitem = res.data.filter(x => x.name_ch == item);
          if (lmtitem.length > 0) {
            //不可以有null值
            this.markdata.maxline =
              lmtitem[0].critical_max == null ? -999 : lmtitem[0].critical_max;
            this.markdata.minline =
              lmtitem[0].critical_min == null ? -999 : lmtitem[0].critical_min;
          } else {
            this.markdata.maxline = -999;
            this.markdata.minline = -999;
          }
        });
    },
    //折線圖資料
    getdata: async function() {
      //mark line 先歸零
      this.markdata.maxline = -999;
      this.markdata.minline = -999;
      //清空itm
      this.item = [];

      this.chartmin = undefined;
      this.chartmax = undefined;
      //指定的項目是歸屬於哪個類別，水質/投餵
      let itemclass = await this.getItemClass(this.defitem); //判斷項目是屬於水質還是投餵用
      //判斷項目是屬於水質還是投餵用
      //抓折線圖資料囉
      let parm = {
        started_date: this.chart_started_date,
        ended_date: this.chart_ended_date,
        // factory_id: this.sel_main,
        // pond_area_id: this.sel_area,
        pond_id: this.poolid,
        items: this.defitem,
        data_group: itemclass
      };
      this.waterloading = true;
      let apiURL = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/`;
      await this.$axios
        .get(apiURL, { params: parm }, { httpsAgent: agent })
        .then(res => {
          console.log("chart data api:", res.request.responseURL);
          // let data2 = _.cloneDeep(res.data); //原始資料
          //整理資料長相
          res.data.items.forEach(function(x) {
            //給折線圖用的資料
            delete x.id; //"刪掉id欄位"
            delete x.updated_user; //"刪掉updated_user欄位"
            delete x.group; //"刪掉group欄位"
          });

          this.item = res.data;
          console.log("chart data count:", this.item.items.length);
          // this.item2 = data2;
          //抓上下限資料
          if (res.data.items.length > 0) {
            this.getLimitData(this.defitem);
          }
        })
        .catch(err => {
          alert("失敗：" + err.message);
        })
        .finally(() => {
          this.waterloading = false;
        });
    },
    //氣象
    getWeather: async function() {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.gettingLocation = false;
          this.loc.longitude = pos.coords.longitude;
          this.loc.latitude = pos.coords.latitude;
        },
        err => {
          this.gettingLocation = false;
          this.errorStr = err.message;
          //預設在公司
          this.loc.longitude = "121.82030882702146";
          this.loc.latitude = "24.83616577553079";
        }
      );
      var parm ={
           longitude: this.loc.longitude,
           latitude: this.loc.latitude,
      };
      await this.$axios
        .post(`${this.$store.state.mydata.gobal_api.apiIIS82}/weather.asmx/weatherData`, parm,{
            httpsAgent: agent
          })
        .then(res => {
          let weadata = JSON.parse(res.data.d);
          this.weatherdata.main = weadata.main;
          this.weatherdata.wind = weadata.wind;
          this.weatherdata.weather = weadata.weather;
        //   this.weatherdata.rain.h_1 = weadata.rain.1h;
          console.log("weather api：" + res.request.responseURL);
          this.getLocation();
        })
        .catch(error => {
          this.$toast.error("weather error:" + error, { duration: 2000 });
        });
     
    },
    getLocation:async function(){
      var parm ={
           longitude: this.loc.longitude,
           latitude: this.loc.latitude,
      };
      await this.$axios
        .post(`${this.$store.state.mydata.gobal_api.apiIIS82}/weather.asmx/location`, parm ,{
            httpsAgent: agent
          })
        .then(res => {
          let loc = JSON.parse(res.data.d);
          // var max = Math.max.apply(Math, loc.map(function(o) { return o.cnt; }));
          this.location = loc.sort((a,b) => (a.cnt > b.cnt) ? 1 : ((b.cnt > a.cnt) ? -1 : 0));
          // var xx = loc.map(function(o) { return o.cnt; });
        //   this.weatherdata.rain.h_1 = weadata.rain.1h;
          console.log("location api：" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("location error:" + error, { duration: 2000 });
        });
    },
    //樣板
    //樣版清單
    getTemplateData: async function () {
      this.tempSelect = undefined;
      var url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/`;
      await this.$axios
        .get(url)
        .then(res => {
          this.template_items = res.data.map(x => x.tempMain);
          this.template_all = res.data;
        })
        .finally(() => {
          /* 不論失敗成功皆會執行 */
        });
    },
    // 選擇樣板
    tempChange: function () {
      if (this.tempSelect != undefined) {
        this.editmode = 'edit';
        this.editKey = Math.floor(Math.random() * 100);//隨機key值0~100
        var myMain = this.template_items.filter(x => x.id == this.tempSelect)[0];
        //本來要show passObj 裡面的東西
        // var temp = this.template_all.filter(x => x.tempMain == myMain)[0];
        // this.passObj = temp; 
      } else {
        this.editmode = undefined;
        // this.passObj = {};
      }

    },
  },
  async mounted() {
   
    if (this.req.id != undefined){
      
      await this.getwarnData();//取得警示區資料
      await this.getCircleData();//取得循環資料
    }
    
    await this.getMainData();//取得整場架構資料
    await this.getItemData(); //取得指標子項目
    
    await this.getSeedlingData();//取得苗清單
    await this.getaccList();//帳號清單
    await this.getTemplateData();//樣版清單
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    await this.getWeather(); //氣象
    await this.getOptData(); //選項
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
<style>
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td {
  color: #000000;
  background-color: #fff09d !important;
}
</style>
