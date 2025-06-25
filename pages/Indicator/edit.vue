<template>
  <div>
    <!-- <div ref="main" id="main" style="width: 600px;height:400px;"></div> -->
    <v-card class="bg-card">
        <!-- <div class="card-title">
            <v-row style="margin-bottom: 0;">
                <div class="title">
                    <v-icon>mdi-file-edit</v-icon>
                    <v-card-title>指標資料修改</v-card-title>
                </div>
            </v-row>
        </div> -->
        <v-overlay :value="!isLoading" :absolute="true">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <div class="content" style="padding-top:12px">
          <div class="search">
            <v-row style="margin-bottom: 12px;">
              <!-- 選擇場(必選) -->
              <!-- <v-col cols="12" md="4" sm="12" class="caculate">
                <v-select
                  v-model="sel_main"
                  :items="maindata"
                  item-value="id"
                  item-text="name"
                  label="*選擇場(必選)"
                  hide-details
                  clearable 
                  class="select-color"
                  @change="factoryChange"
                >
                </v-select>
              </v-col> -->
              <!-- 選擇區域(必選) -->
              <!-- <v-col cols="12" md="4" sm="12" class="caculate">
                <v-select
                  v-model="sel_area"
                  :items="areadata"
                  item-value="id"
                  item-text="name"
                  clearable
                  @change="areachange"
                  label="*選擇區域(必選)"
                  hide-details
                  class="select-color"
                ></v-select>
              </v-col> -->
              
              <v-col cols="12" md="8" sm="12" class="caculate caculate-8" style="position: relative;">
                <locate-select :dataScope="'area'" :defaultSelect="nowArea" :isMulti="false" @scopeSel_data="get_scopeData($event)" class="select-template"></locate-select>
                <!-- <label v-if="nowArea!==''" class="label-select">*請選擇養殖區域(必選)</label> -->
              </v-col>
              <!-- 指定項目(必選) -->
              <v-col cols="12" md="4" sm="12" class="caculate">
                <v-autocomplete
                  v-model="defitem"
                  :items="waterdatacols"
                  item-text="name"
                  item-value="name"
                  no-data-text="查無資料"
                  label="*指定項目(必選)" hide-details
                  class="select-color"
                  clearable
                  @change="changeDefItem()">
                  <template v-slot:item="data">{{`　${data.item.name}`}}</template>
                </v-autocomplete>
              </v-col>
              <!-- 新增/匯出 -->
              <div style="margin-left: -8px;padding: 12px;">
                <!-- 新增 -->
                <v-btn
                  icon
                  color="success"
                  @click="openadd"
                  :disabled="
                    sel_main && sel_area && defitem != undefined && defitem.length > 0
                      ? false
                      : true
                  "
                  height=""
                  ><v-icon>mdi-text-box-plus-outline</v-icon></v-btn
                >
                <v-btn
                  icon
                  color="success"
                  :disabled="item.items == undefined || item.items.length == 0"
                >
                  <div
                    v-if="
                      sel_pool &&
                        sel_area &&
                        sel_pool &&
                        mainpool.items.filter(x => x.id == sel_pool)[0]">
                    <!-- ${mainpool.items[sel_pool].name}_ -->
                    <!-- 有水池才有功能，沒有的話就圖而已 -->
                    <download-excel
                      :data="item2.items"
                      :name="
                        `${sdate}_${edate}_${maindata.filter(x=>x.id==sel_main)[0].name}_${
                          maindata.filter(x=>x.id==sel_main)[0].node.filter(x=>x.id==sel_area)[0].name
                        }_${
                          mainpool.items.filter(x => x.id == sel_pool)[0].name
                        }_${defitem}`">
                      <v-icon>mdi-microsoft-excel</v-icon>
                    </download-excel>
                  </div>
                  <div v-else>
                    <v-icon>mdi-microsoft-excel</v-icon>
                  </div>
                </v-btn>
              </div>
            </v-row>
            <v-row style="margin-bottom: 12px;">
              <!-- 選擇起日 -->
              <v-col cols="12" md="4" sm="12" class="caculate">
                <v-menu
                  v-model="menu_startdate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="sdate"
                      label="選擇起日"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      class="select-color"
                      hide-details
                      @click:prepend="() => (sdate = getNowDate())"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="sdate" locale="zh-tw" no-title
                    @input="menu_startdate = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <!-- 選擇訖日 -->
              <v-col cols="12" md="4" sm="12" class="caculate">
                <v-menu
                  v-model="menu_enddate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="edate"
                      label="選擇訖日"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      class="select-color"
                      hide-details
                      @click:prepend="() => (edate = getNowDate())"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="edate" locale="zh-tw" no-title
                    @input="menu_enddate = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              
              <!-- 水池 -->
              <v-col cols="12" md="4" sm="12" class="caculate">
                <v-autocomplete
                  v-model="sel_pool"
                  :items="mainpool.items"
                  item-text="name"
                  item-value="id"
                  no-data-text="查無資料"
                  label="水池"
                  class="select-color"
                  hide-details
                  :loading="isParaLoading"
                  :disabled="isParaLoading"
                  :color="isParaLoading?'red':'primary'"
                ></v-autocomplete>
              </v-col>
              <!-- 查詢 -->
              <div class="align-self-center" style="padding: 12px;">
                <v-btn
                  tile
                  class="box-shadow-none"
                  @click="getdata"
                  :disabled="
                    sdate &&
                    edate &&
                    sel_pool &&
                    sel_area &&
                    sel_main &&
                    defitem != undefined &&
                    defitem.length > 0? false: true"
                  style="border-radius: 4px;background-color: #006AA6;color: #fff;"
                  >查詢</v-btn
                >
              </div>
            </v-row>
          </div>
          <!-- 搜尋結果 -->
          <div class="result">
            <v-row style="margin-bottom: 0;width: 100%;">
              <v-col cols="12">
                <v-card class="result-card" style="min-height: 48vh">
                  <div class="header-bar">
                    <v-tabs v-model="nowTab" show-arrows>
                      <!-- 上方tab -->
                      <v-tab
                          v-for="(tab,tid) in tabs"
                          :key="'tabs-'+tid"
                          :href="`#` + tab">
                          <div class="icons">
                            <v-icon v-if="tab=='圖表'">mdi-chart-bell-curve-cumulative</v-icon>
                            <v-icon v-if="tab=='編修紀錄'">mdi-text-box-edit-outline</v-icon>
                            <v-icon v-if="tab=='事件紀錄'">mdi-calendar-edit-outline</v-icon>
                            <v-icon v-if="tab=='打樣資訊'">mdi-tray-full</v-icon>
                          </div>
                          {{ tab }}
                      </v-tab>
                      <v-tab-item :value="'圖表'" class="result-content">
                        <v-row style="width: 100%;justify-content: flex-end;margin-bottom: 0;">
                          <div style="padding: 12px;">最小值：<el-input-number v-model="chartmin" controls-position="right" :min="0" style="width:100px;height: 40px;"></el-input-number></div>
                          <div style="padding: 12px;">最大值：<el-input-number v-model="chartmax" controls-position="right" :min="0" style="width:100px;height: 40px;"></el-input-number></div>
                        </v-row>
                        <v-row style="width: 100%;">
                          <WaterQuality_Vcharts2
                            :rowsData="item.items"
                            xColName="inspected_date"
                            :defaultitem="{}"
                            :loading="waterloading"
                            :title="item.name"
                            :chartmin="chartmin"
                            :chartmax="chartmax"
                            :markdata="markdata"
                            :isIndicator="true"
                            style="width: 100%;min-height: 26vh;"
                          ></WaterQuality_Vcharts2>
                        </v-row>
                      </v-tab-item>
                      <v-tab-item :value="'編修紀錄'" class="result-content">
                        <v-data-table
                          class="edit-table revise data-table bg-transparent"
                          v-model="selected"
                          :headers="headers"
                          :items="item2.items" dense
                          :footer-props="footerProps"
                          :loading="loading"
                          :show-select="showselect"
                          no-data-text="查無資料">
                          <template v-slot:[`item.actions`]="{ item }">
                            <button class="btn-icon" :disabled="['feed','pbio'].includes(item.group)" @click="editItem(item)">
                                <v-icon>mdi-pencil</v-icon>
                            </button>
                            
                            <button class="btn-icon delete" :disabled="['feed','pbio'].includes(item.group)" @click="delItem(item)">
                                <v-icon>mdi-trash-can</v-icon>
                            </button>
                            
                            <!-- <v-icon small class="mr-2" :disabled="['feed','pbio'].includes(item.group)" @click="editItem(item)">
                              mdi-pencil
                            </v-icon>
                            <v-icon small :disabled="['feed','pbio'].includes(item.group)" @click="delItem(item)"  color="red">
                              mdi-delete
                            </v-icon> -->
                          </template>
                          <template v-slot:top>
                            <v-toolbar flat>
                              <v-spacer></v-spacer>
                              <v-checkbox
                                v-model="showselect"
                                label=""
                                color="red"
                                hide-details
                                :disabled="disabledAllDel"
                              >
                              </v-checkbox>
                              <v-btn class="btn-primary delete" :disabled="selected.length==0 || !showselect" @click="opencapDialog">批次刪除</v-btn>
                            </v-toolbar>
                          </template>
                        </v-data-table>
                      </v-tab-item>
                      <v-tab-item :value="'事件紀錄'" class="result-content">
                        <v-data-table
                          v-if="nowTab == '事件紀錄'"
                          class="edit-table data-table bg-transparent"
                          :headers="eventHeaders"
                          :items="eventTableData" dense
                          :footer-props="footerProps"
                          no-data-text="查無資料"
                          style="min-height: 27vh;">
                          <template v-slot:[`item.event_level_name`]="{ item }">
                            <v-chip
                              :color="item.color"
                              style="font-size: 12px;"
                              :style="{color:item.color=='#00AC'?'white':'#00273E'}"
                              dark
                            >
                              {{ item.event_level_name }}
                            </v-chip>
                          </template>
                          <template v-slot:[`item.time`]="{ item }">
                            <div style="width:100%;text-align: left;display: flex;justify-content: center;">
                              <span v-html="item.time" style="line-height: 24px;"></span>
                            </div>
                          </template>
                          <template v-slot:[`item.content`]="{ item }">
                            <div style="text-align: left;display: flex;justify-content: flex-start;">
                              <span v-html="item.content" style="line-height: 24px;"></span>
                            </div>
                          </template>
                          <template v-slot:[`item.name`]="{ item }">
                            <div style="width:100%;text-align: left;display: flex;justify-content: flex-start;">
                              <span v-html="item.name" style="line-height: 24px;"></span>
                            </div>
                          </template>
                        </v-data-table>
                      </v-tab-item>
                      <v-tab-item :value="'打樣資訊'" class="result-content">
                        <!-- 紀錄清單 -->
                        <div class="result-list">
                          <div class="box-shadow-none border-bottom" style="border-radius: 0;">
                            <div class="added" style="display: flex;justify-content: space-between;">
                              <div class="card-title"  @click="listOpen = !listOpen" style="cursor: pointer;margin: 0;padding: 0;border-bottom: none;">
                                <div class="title">
                                    <v-card-title style="padding: 8px;font-size: 16px;">紀錄清單</v-card-title>
                                </div>
                                <div class="chevron">
                                  <v-icon v-if="listOpen">mdi-triangle-small-up</v-icon>
                                  <v-icon v-if="!listOpen">mdi-triangle-small-down</v-icon>
                                </div>
                              </div>
                              <v-btn v-if="nowTab=='打樣資訊'" class="btn-secondary green" :class="{'disabled':optData.length==0}" style="float:right" @click="editObservable('add')"><v-icon>mdi-plus</v-icon>新增</v-btn>
                            </div>
                            
                          </div>
                        </div>
                        <v-data-table
                          v-if="listOpen"
                          class="edit-table data-table bg-transparent"
                          :headers="observableHeaders"
                          :items="observableData" dense
                          :footer-props="footerProps"
                          no-data-text="查無資料"
                          fixed-header>
                          <!-- <template v-slot:[`item.is_shell`]="{ item }">
                              {{ item.is_shell?'是':'否' }}
                          </template> -->
                          <template v-slot:[`item.img`]="{ item }">
                            <img v-img="{ group: item.shrimp_id }" v-for="(img,i) in item.img" :key="item.shrimp_id+'_'+i" :src="img" style="width: 33%;min-width: 60px" />
                          </template>
                          <template v-slot:[`item.intestinal_color`]="{ item }">
                            <div v-if="item.numOfColor.IntestinalColor.length>0">
                              <v-chip v-for="(shape,id) in item.numOfColor.IntestinalColor" :key="'BodyShape'+id" :class="{'chips-value':shape.value>0}">    
                                {{ shape.name_ch}}:{{ shape.value }}
                              </v-chip>
                            </div>
                            <div v-else><v-chip>無</v-chip></div>
                          </template>
                          <template v-slot:[`item.hepatopancreas_color`]="{ item }">
                            <div v-if="item.numOfColor.HepatopancreasColor.length>0">
                              <v-chip v-for="(shape,id) in item.numOfColor.HepatopancreasColor" :key="'BodyShape'+id" :class="{'chips-value':shape.value>0}">
                                  {{ shape.name_ch}}:{{ shape.value }}
                              </v-chip>
                            </div>
                            <div v-else><v-chip>無</v-chip></div>
                          </template>
                          <template v-slot:[`item.muscle_color`]="{ item }">
                            <div v-if="item.numOfColor.MuscleColor.length>0">
                              <v-chip v-for="(shape,id) in item.numOfColor.MuscleColor" :key="'BodyShape'+id" :class="{'chips-value':shape.value>0}">
                                {{ shape.name_ch}}:{{ shape.value }}
                              </v-chip>
                            </div>
                            <div v-else><v-chip>無</v-chip></div>
                          </template>
                          <template v-slot:[`item.body_color`]="{ item }">
                            <div v-if="item.numOfColor.BodyColor.length>0">
                              <v-chip v-for="(shape,id) in item.numOfColor.BodyColor" :key="'BodyShape'+id" :class="{'chips-value':shape.value>0}">
                                {{ shape.name_ch}}:{{ shape.value }}
                              </v-chip> 
                            </div>
                            <div v-else><v-chip>無</v-chip></div>
                          </template>
                          <template v-slot:[`item.body_shape`]="{ item }">
                            <div v-if="item.numOfColor.BodyShape.length>0">
                              <v-chip v-for="(shape,id) in item.numOfColor.BodyShape" :key="'BodyShape'+id" :class="{'chips-value':shape.value>0}">
                                {{ shape.name_ch}}:{{ shape.value }}
                              </v-chip>
                            </div>
                            <div v-else><v-chip>無</v-chip></div>
                          </template>
                          <!-- 編輯/刪除 -->
                          <template v-slot:[`item.action`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn  class="btn-icon"
                                        title="編輯"
                                        @click="editObservable('edit',item)"
                                        v-bind="attrs" v-on="on"
                                        style="pointer-events: inherit;">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>編輯</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn  class="btn-icon delete"
                                        title="刪除"
                                        v-bind="attrs" v-on="on"
                                        style="pointer-events: inherit;"
                                        @click="delObservable(item)">
                                        <v-icon>mdi-trash-can</v-icon>
                                    </v-btn>
                                </template>
                                <span>刪除</span>
                            </v-tooltip>
                        </template>
                        </v-data-table>
                        <!-- 圖表 -->
                        <div v-if="observableData.length>0&&chartShow" class="result-list">
                          <div class="box-shadow-none border-bottom" style="border-radius: 0;">
                            <div class="card-title" style="cursor: pointer;margin: 0;padding: 0;border-bottom: none;">
                                <div class="title">
                                    <v-card-title style="padding: 8px;font-size: 16px;">圖表</v-card-title>
                                </div>
                            </div>
                          </div>
                        </div>
                        <v-row v-show="observableData.length>0&&chartShow" style="width: 100%;overflow-x:scroll;">
                          <!-- <v-col  v-show="observableData.length>0" cols="12" md="6" v-for="(item,id) in observeLineData" :key="'chart_'+item.name_en+id">
                            <h3 class="pool-name">{{ item.name_ch }}</h3>
                            <Stackbar :value="item.chartData.series" :xAxis="item.chartData.xAxis" :legend="item.chartData.legend" :myColors="item.chartData.colors" :min="0" :max="null"></Stackbar>
                          </v-col> -->
                          <v-col cols="12" md="6" v-for="(item,id) in observeChartData" :key="'chart_'+item.name_en+id">
                            <h3 class="pool-name">{{ item.name_ch }}{{item.name_en=='feed_amount'?'':'(%)'}}</h3>
                            <Stackbar :value="item.chartData.series" :xAxis="item.chartData.xAxis" :legend="item.chartData.legend" :myColors="item.chartData.colors" :min="0" :max="item.name_en=='feed_amount' ? null : 100 "></Stackbar>
                          </v-col>
                        </v-row>
                      </v-tab-item>
                    </v-tabs>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </div>
        <!-- 新增 -->
        <v-dialog
          v-model="addDialog"
          max-width="500px"
          :persistent="keepswitch"
          class="indicator-dialog"
        >
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card class="custom-dialog" v-if="addDialog"
              >
              <v-card-title class="add-title">
                <div style="display: inline-block;">
                  新增
                </div>
                <div class="add">
                  <v-btn  class="btn-secondary close"
                          title="取消" 
                          @click="addDialog = false" 
                          style="border: none;min-width: 0;padding: 0 4px;">
                      <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text style="padding-top: 24px">
                <div class="basic" style="padding-left: 8px;">
                  <v-card-text class="flex-align-center" style="padding-top: 0;font-size: 18px;">
                    {{maindata.filter(x=>x.id==sel_main)[0].name}}-{{maindata.filter(x=>x.id==sel_main)[0].node.filter(x=>x.id==sel_area)[0].name}}-
                    <span class="error-text font-weight-black" style="font-size: 18px;">{{defitem}}</span>
                  </v-card-text>
                </div></v-card-text>
              <v-card-text style="padding-top: 8px">
                <div class="basic" style="padding-left: 8px;font-size: 16px;">
                  <v-card-text class="flex-align-center" style="padding-top: 0;">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-switch
                          v-model="keepswitch"
                          color="red darken-3" dense
                          :label="
                            keepswitch ? '保留數值不關閉：on' : '保留數值不關閉：off'
                          "
                          hide-details
                        ></v-switch>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-autocomplete
                          v-model="defitem"
                          :items="waterdatacols"
                          item-text="name"
                          item-value="name"
                          no-data-text="查無資料"
                          placeholder="指定項目(必選)"
                          hide-details
                          dense
                        >
                          <template v-slot:item="data">{{`　${data.item.name}`}}</template>
                        </v-autocomplete>
                      </v-col>
                      <!-- 日期 -->
                      <v-col cols="12" md="6">
                        <v-menu
                          v-model="menu_adate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="adate"
                              label="選擇日期"
                              prepend-icon="mdi-calendar"
                              readonly dense
                              v-bind="attrs"
                              v-on="on"
                              :rules="rules.require"
                              @click:prepend="() => (adate = getNowDate())"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="adate" locale="zh-tw" no-title
                            @input="menu_adate = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <!-- 時間 -->
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="時間"
                          v-model="atime"
                          value="" dense
                          type="time"
                          prepend-icon="mdi-timeline-clock-outline"
                          @click:prepend="() => (atime = getNowTime())"
                          :rules="rules.require"
                        ></v-text-field>
                      </v-col>
                      <!-- 計算 -->
                      <v-col cols="12" style="border-top: 1px solid rgba(0,0,0,0.1);">
                        <v-row>
                          <v-col md="9">
                            <v-text-field v-model="formula"  hide-details dense filled clearable title="新值=[原值]*[公式]" placeholder="公式範例:[原值]*[8*(20+5)]，預設為相乘"></v-text-field>
                          </v-col>
                          <v-col md="3" style="float: right;">
                            <v-btn class="btn-primary" :disabled="!formula" @click="reCalc" tile>計算</v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </div>
              </v-card-text>
              <v-card-text style="padding-top: 16px">
                  <div class="basic" style="padding-left: 16px;font-size: 16px;">
                    <v-card-text class="flex-align-center" style="padding-top: 0;">
                      <v-row>
                        <v-col
                          cols="12"
                          md="6"
                          v-for="(item,id) in mainpool.items"
                          :key="'pool-'+id"
                        >
                          {{ item.name}}
                          <el-input-number
                            :id="item.name"
                            :ref="item.name"
                            @keyup.enter.native="gofocusNxt2(item.name)"
                            class="ml-2"
                            v-model="num[item.name]"
                            size="mini"
                            :precision="2"
                            :step="0.1"
                            :min="num_min"
                            :max="num_max"
                          ></el-input-number>
                        </v-col>
                        <!-- @keyup="getAddData" -->
                      </v-row>
                    </v-card-text>
                    
                  </div>
              </v-card-text>
              <v-card-text>
                <v-chip
                  class="ma-2 add-chip"
                  v-for="(item,id) in addData"
                  :key="'add-'+id"
                >
                  <v-icon left>
                    mdi-new-box
                  </v-icon>
                  {{ item.name }} [{{ item.value }}]
                </v-chip>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-text>
                <v-chip
                  class="ma-2 add-chip"
                  v-for="(key, index) in Object.keys(num)"
                  :key="'object-'+index"
                  v-show="typeof num[key] == 'number'"
                >
                  <div v-if="typeof num[key] == 'number'">
                    <v-icon left style="color: #fff !important">
                      mdi-new-box
                    </v-icon>
                    {{ key }} [{{ num[key] }}]
                  </div>
                </v-chip>
              </v-card-text>
              <v-card-actions style="padding: 24px 12px;">
                <v-spacer></v-spacer>
                <v-btn class="btn-secondary" @click="addDialog = false">取消</v-btn>
                <v-btn class="btn-primary" :disabled="isAddDisabled" @click="addsubmit">新增</v-btn>
              </v-card-actions>
              <!-- <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click="addDialog = false"
                  tile
                  v-show="keepswitch"
                  style="border-radius: 4px;box-shadow: none;background-color: transparent;color: #006AA6;border: 1px solid #006AA6;"
                  >取消</v-btn
                >
                <v-btn
                  @click="addsubmit"
                  tile
                  :disabled="!atime"
                  style="border-radius: 4px;box-shadow: none;background-color: #006AA6;color: #fff;"
                  >新增資料</v-btn
                >
              </v-card-actions> -->
            </v-card>
          </v-form>
        </v-dialog>
        <!-- 刪除項目 -->  
        <v-dialog v-model="delDialog" max-width="500px" class="indicator-dialog">
          <v-card class="custom-dialog">
            <v-card-title class="add-title">
              <div style="display: inline-block;">
                是否刪除該項目?
              </div>
              <div class="add">
                <v-btn  class="btn-secondary close"
                        title="取消" 
                        @click="delDialog = false" 
                        style="border: none;min-width: 0;padding: 0 4px;">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <div class="flex-align-center" style="width:100%;margin-left: 0px;line-height: 32px;font-size: 16px;"> <span style="width: 50px;">id：</span>{{ editedItem.id }}</div>
                    <div class="flex-align-center" style="width:100%;margin-left: 0px;line-height: 32px;font-size: 16px;"><span style="width: 50px;">時間：</span>{{ editedItem.inspected_date }}</div>
                    <div class="flex-align-center" style="width:100%;margin-left: 0px;line-height: 32px;font-size: 16px;"><span style="width: 50px;">值：</span>{{ editedItem.value }}</div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions style="padding: 24px 12px;">
                <v-spacer></v-spacer>
                <v-btn class="btn-secondary" @click="delDialog = false">取消</v-btn>
                <v-btn class="btn-primary" @click="delsubmit">刪除</v-btn>
            </v-card-actions>
            <!-- <v-card-actions style="justify-self: flex-end;width: 100%;">
              <v-spacer></v-spacer>
              <v-btn text @click="delDialog = false" style="border-radius: 4px;box-shadow: none;background-color: transparent;color: #006AA6;border: 1px solid #006AA6;">
                取消</v-btn>
              <v-btn text @click="delsubmit" style="border-radius: 4px;box-shadow: none;background-color: #006AA6;color: #fff;">
                確定刪除</v-btn>
            </v-card-actions> -->
          </v-card>
        </v-dialog>
        <!-- 批次刪除Dialog -->
        <v-dialog v-model="captchaDialog" width="350" class="indicator-dialog">
          <v-card height="230"  class="custom-dialog">
            <v-card-title>驗證碼</v-card-title>
            <v-card-text>
              <recaptcha />
            </v-card-text>
            <v-card-actions style="padding: 24px 12px;">
              <v-spacer></v-spacer>
              <v-btn class="btn-secondary" @click="captchaDialog = false">取消</v-btn>
              <v-btn class="btn-primary box-shadow-none" @click="captchacheck" style="border-radius: 4px;background-color: #006AA6;color: #fff;">送出</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        <!-- 編輯項目 -->
        <v-dialog v-model="editDialog" max-width="500px" class="indicator-dialog">
          <v-card class="custom-dialog">
            <v-card-title class="add-title">
              <div style="display: inline-block;">
                編輯項目
              </div>
              <div class="add">
                <v-btn  class="btn-secondary close"
                        title="取消" 
                        @click="editDialog = false" 
                        style="border: none;min-width: 0;padding: 0 4px;">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="editedItem.id"
                      disabled dense filled
                      class="edit-disabled"
                    ><span style="width:50px;" slot="prepend">id</span></v-text-field>
                    <v-text-field
                      v-model="editedItem.inspected_date"
                      disabled dense filled
                      class="edit-disabled"
                    ><span style="width:50px;" slot="prepend">日期</span></v-text-field>
                    <!-- <v-text-field
                      v-model="editedItem.value"
                      autocomplate="off"
                      type="number" dense filled
                    ><span style="width:50px;" slot="prepend">值</span></v-text-field> -->
                    <div class="flex-align-center">
                      <span style="width:50px;" slot="prepend">值</span>
                      <el-input-number
                        class="ml-2"
                        v-model="editedItem.value"
                        size="medium"
                        :precision="2"
                        :step="0.1"
                        :min="num_min"
                        :max="num_max"
                      ></el-input-number>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions style="padding: 24px 12px;">
              <v-spacer></v-spacer>
              <v-btn class="box-shadow-none" tile @click="editDialog = false" style="border-radius: 4px;background-color: transparent;color: #006AA6;border: 1px solid #006AA6;">
                取消
              </v-btn>
              <v-btn class="box-shadow-none" tile @click="editsubmit" style="border-radius: 4px;background-color: #006AA6;color: #fff;">
                確定
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- 觀察網 -->
        <v-dialog v-model="observeDialog" max-width="500px">
          <v-form ref="observeform" v-model="observevalid" lazy-validation>
            <v-overlay :value="!dialogLoading" :absolute="true">
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-card class="custom-dialog">
              <v-card-title class="add-title">
                <div style="display: inline-block;">
                  {{ nowObserve=='edit'?'編輯':'新增' }}
                </div>
                <div class="add">
                  <v-btn  class="btn-secondary close"
                          title="取消" 
                          @click="observeDialog = false" 
                          style="border: none;min-width: 0;padding: 0 4px;">
                      <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text style="padding-top: 8px">
                <div class="basic" style="padding-left: 8px;">
                  <v-card-text class="flex-align-center" v-if="showlocate" style="padding-top: 0;padding-bottom: 0;">
                    <span class="pa-0 ma-0" slot="prepend" style="width: 92px;font-size: 16px;color: rgba(0, 0, 0, 0.87);">養殖池</span>
                    <locate-select :dataScope="'pool'" :defaultSelect="observeEdit['pond_id']&&observeEdit['pond_id']!==''?observeEdit['pond_id'].toString():''" :isMulti="false" @scopeSel_data="selectObserveData($event)" class="select-template"></locate-select>
                  </v-card-text>
                  <span v-if="isPondId" class="error-text ml-2" style="font-size: 12px;margin-bottom: 8px;">*必填項目</span>
                  <v-card-text class="flex-align-center" style="padding-top: 16px;">
                    <span class="pa-0 ma-0" style="width:120px;font-size: 16px;color: rgba(0, 0, 0, 0.87);"><v-icon @click="showDate=false;observeEdit['inspected_time'] = getNowDateTime();showDate=true;" slot="prepend" style="color:#006AA6">mdi-calendar</v-icon>檢測時間</span>
                    <div class="date-time-picker" style="width:100%">
                      <a-date-picker v-model="observeEdit['inspected_time']" value="null" format="yyyy-MM-DD HH:mm" show-time placeholder="" @change="onChange" @ok="onOk"  style="min-width: none;width: 100%;" />
                    </div>                                                 
                  </v-card-text>
                  <span v-if="isInspectedTime" class="error-text ml-2" style="font-size: 12px;margin-bottom: 8px;">*必填項目</span>
                  <v-card-text class="flex-align-center" style="padding-top: 16px;">
                    <v-row style="margin-bottom: 0;">
                      <v-col cols="12" md="6">
                        <v-text-field v-model.number="observeEdit['observation_qty']" min="0" type="number" dense class="mt-0 mr-2" hide-details @change="changeQty()"><span class="pa-0 ma-0" slot="prepend" style="width: 80px;">觀察網隻數</span></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model.number="observeEdit['feed_amount']" type="number" min="0" dense class="mt-0 mr-2" hide-details><span class="pa-0 ma-0" slot="prepend" style="width: 80px;">觀察網殘餌量(g)</span></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-text class="flex-align-center" v-if="observeEdit['observation_qty']>0" style="padding-top: 0;">
                    <v-row style="margin-bottom: 0;">
                      <v-col cols="12" md="6">
                        <v-text-field v-model.number="observeEdit['shell_qty']" min="0" type="number" dense class="mt-0 mr-2" hide-details><span class="pa-0 ma-0" slot="prepend" style="width: 80px;">脫殼數量</span></v-text-field>
                        <!-- <v-select v-model="observeEdit['is_shell']" :items="isShellData" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch" style="width: calc(100% - 24px);"><span class="pa-0 ma-0" slot="prepend" style="width: 80px;">是否脫殼</span></v-select> -->
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model.number="observeEdit['dead_shrimp_qty']" type="number" min="0" filled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" style="width: 80px;">死蝦數量</span></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-text class="flex-align-center" v-if="observeEdit['observation_qty']>0" style="padding-top: 0;">
                    <v-row style="margin-bottom: 0;">
                      <v-col cols="12" md="6" @click="openShrimps()">
                        <v-text-field v-model.number="observeEdit['shrimp_weight']" type="number" min="0" dense class="mt-0 mr-2" hide-details  @click="openShrimps()"><span class="pa-0 ma-0" slot="prepend" style="width: 80px;">蝦隻重量(g)</span></v-text-field>
                        
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-checkbox class="checkbox" v-model="observeEdit['is_sample']" hide-details label="是否人工打樣" style="margin-top: 0;padding-top: 0;"></v-checkbox>
                      </v-col>
                    </v-row>
                    
                    <!-- <v-btn class="btn-secondary btn-small">填寫</v-btn> -->
                  </v-card-text>
                  <div v-if="observeEdit['observation_qty']>0" class="shrimp-statue">
                    <div class="card-title">
                      <div class="title flex-align-center">
                          <v-card-title>腸線顏色</v-card-title>
                          <span v-if="isOver.ic" class="error-text ml-2" style="font-size: 12px;">*不等於觀察網隻數</span>
                      </div>
                    </div>
                    <v-card-text class="border-bottom flex-align-center" style="padding-top: 0;">
                      <v-row style="width: 100%;align-items: center;">
                          <v-col cols="12" md="6" sm="6" v-for="(item,id) in observeEdit.IntestinalColor" :key="'IntestinalColor_'+id" style="width: 100%;">
                              <div class="chips flex-align-center" style="margin-bottom: 8px;width: 100%;">
                                <span class="pa-0 ma-0" slot="prepend" style="width:60px;min-height:inherit">{{item.name_ch}}</span>
                                  <el-input-number
                                      class="ml-2"
                                      v-model="item.value"
                                      size="mini"
                                      :step="1"
                                      :min="0"
                                      prop="number"
                                      @change="changeChips"
                                  ></el-input-number>
                              </div>
                          </v-col>
                      </v-row>
                    </v-card-text>
                    <div class="card-title">
                      <div class="title flex-align-center">
                          <v-card-title>肝胰臟顏色</v-card-title>
                          <span v-if="isOver.hc" class="error-text ml-2" style="font-size: 12px;">*不等於觀察網隻數</span>
                      </div>
                    </div>
                    <v-card-text class="border-bottom flex-align-center" style="padding-top: 0;">
                      <v-row style="width: 100%;align-items: center;">
                          <v-col cols="12" md="6" sm="6" v-for="(item,id) in observeEdit.HepatopancreasColor" :key="'HepatopancreasColor_'+id" style="width: 100%;">
                              <div class="chips flex-align-center" style="margin-bottom: 8px;width: 100%;">
                                  <span class="pa-0 ma-0" slot="prepend" style="width:60px;min-height:inherit">{{item.name_ch}}</span>
                                  <el-input-number
                                      class="ml-2"
                                      v-model="item.value"
                                      size="mini"
                                      :step="1"
                                      :min="0"
                                      prop="number"
                                  ></el-input-number>
                              </div>
                          </v-col>
                      </v-row>
                    </v-card-text>
                    <div class="card-title">
                      <div class="title flex-align-center">
                          <v-card-title>肌肉顏色</v-card-title>
                          <span v-if="isOver.mc" class="error-text ml-2" style="font-size: 12px;">*不等於觀察網隻數</span>
                      </div>
                    </div>
                    <v-card-text class="border-bottom flex-align-center" style="padding-top: 0;">
                      <v-row style="width: 100%;align-items: center;">
                          <v-col cols="12" md="6" sm="6" v-for="(item,id) in observeEdit.MuscleColor" :key="'MuscleColor_'+id" style="width: 100%;">
                              <div class="chips flex-align-center" style="margin-bottom: 8px;width: 100%;">
                                  <span class="pa-0 ma-0" slot="prepend" style="width:60px;min-height:inherit">{{item.name_ch}}</span>
                                  <el-input-number
                                      class="ml-2"
                                      v-model="item.value"
                                      size="mini"
                                      :step="1"
                                      :min="0"
                                      prop="number"
                                  ></el-input-number>
                              </div>
                          </v-col>
                      </v-row>
                    </v-card-text>
                    <div class="card-title">
                      <div class="title flex-align-center">
                          <v-card-title>蝦體顏色</v-card-title>
                          <span v-if="isOver.bc" class="error-text ml-2" style="font-size: 12px;">*不等於觀察網隻數</span>
                      </div>
                    </div>
                    <v-card-text class="border-bottom flex-align-center" v-show="showBodyColor" style="padding-top: 0;">
                      <v-row style="width: 100%;align-items: center;">
                          <v-col cols="12" md="6" sm="6" v-for="(item,id) in observeEdit.BodyColor" :key="'BodyColor_'+id" style="width: 100%;">
                              <div class="chips flex-align-center" style="margin-bottom: 8px;width: 100%;">
                                  <span class="pa-0 ma-0" slot="prepend" style="width:60px;min-height:inherit">{{item.name_ch}}</span>
                                  <el-input-number
                                      class="ml-2"
                                      v-model="item.value"
                                      size="mini"
                                      :step="1"
                                      :min="0"
                                      prop="number"
                                  ></el-input-number>
                              </div>
                          </v-col>
                      </v-row>
                    </v-card-text>
                    <div class="card-title">
                      <div class="title flex-align-center">
                          <v-card-title>蝦體形狀</v-card-title>
                          <span v-if="isOver.bs" class="error-text ml-2" style="font-size: 12px;">*不等於觀察網隻數</span>
                      </div>
                    </div>
                    <v-card-text class="border-bottom flex-align-center" style="padding-top: 0;">
                      <v-row style="width: 100%;align-items: center;">
                          <v-col cols="12" md="6" sm="6" v-for="(item,id) in observeEdit.BodyShape" :key="'BodyShape_'+id" style="width: 100%;">
                              <div class="chips flex-align-center" style="margin-bottom: 8px;width: 100%;">
                                  <span class="pa-0 ma-0" slot="prepend" style="width:60px;min-height:inherit">{{item.name_ch}}</span>
                                  <el-input-number
                                      class="ml-2"
                                      v-model="item.value"
                                      size="mini"
                                      :step="1"
                                      :min="0"
                                      prop="number"
                                      @change="change('BodyShape',item.name_en)"
                                  ></el-input-number>
                              </div>
                          </v-col>
                      </v-row>
                    </v-card-text>
                  </div>
                  
                  <div class="card-title">
                    <div class="title"  style="display: flex;align-items: center;">
                        <v-card-title>觀察網影像</v-card-title>
                        <span v-if="nowObserve=='edit'" class="error-text ml-2" style="font-size: 12px;">*欲編輯照片請刪除後重新新增</span>
                    </div>
                  </div>
                  <v-card-text style="display: flex;flex-direction:column;align-items: center;padding-top: 0;">
                    <v-file-input v-if="nowObserve=='add'" v-model="observeEdit.img_a" accept="image/*" label="上傳影像(限*jpg/*png)" style="margin-top: 0;width: 100%;"></v-file-input>
                    <v-file-input v-if="nowObserve=='add'" v-model="observeEdit.img_b" accept="image/*" label="上傳影像(限*jpg/*png)" style="margin-top: 0;width: 100%"></v-file-input>
                    <v-file-input v-if="nowObserve=='add'" v-model="observeEdit.img_c" accept="image/*" label="上傳影像(限*jpg/*png)" style="margin-top: 0;width: 100%;"></v-file-input>
                  </v-card-text>
                </div>
              </v-card-text>
              <v-card-actions style="padding: 24px 12px;">
                <v-spacer></v-spacer>
                <v-btn class="btn-secondary" @click="observeDialog = false">取消</v-btn>
                <v-btn class="btn-primary" @click="observeSubmit">{{ nowObserve=='edit'?'編輯':'新增' }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <!-- 蝦隻記錄 -->
        <v-dialog v-model="shrimpDialog" max-width="500px">
          <v-form ref="shrimpform" v-model="shrimpvalid" lazy-validation>
            <v-card class="custom-dialog" id="shrimpDialog">
              <v-card-title class="add-title">
                <div style="display: inline-block;">
                  {{ nowObserve=='edit'?'編輯':'新增' }} 蝦隻紀錄
                </div>
                <div class="add">
                  <v-btn  class="btn-secondary close"
                    title="取消" 
                    @click="shrimpDialog = false" 
                    style="border: none;min-width: 0;padding: 0 4px;">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text style="padding-top: 8px">
                <div class="basic" style="padding-left: 8px;">
                  <span v-if="isShrimp" class="error-text" style="margin-bottom: 16px;">*長度與重量須大於0</span>
                  <v-card-text class="border-bottom flex-align-center" style="padding: 0;padding-top: 16px;" v-for="(s,sid) in shrimp" :key="'shrimp_'+sid">
                    <span style="margin-top: -16px;">{{ sid+1 }}.</span>
                    <v-row style="margin-bottom: 0;">
                      <v-col cols="12" md="6" sm="12" class="flex-align-center" style="padding-right: 8px;">
                        <span class="pa-0 ma-0" style="width:60px;min-height:inherit">長度(cm)</span>
                        <el-input-number
                            class="ml-2"
                            v-model="s['length']"
                            size="mini"
                            :step="0.1"
                            :min="0"
                            prop="number"
                            :class="{'shrimp-error':isShrimp&&s['length']==0}"
                        ></el-input-number>
                      </v-col>
                      <v-col cols="12" md="6" sm="12" class="flex-align-center" style="padding-right: 8px;">
                        <span class="pa-0 ma-0" style="width:60px;min-height:inherit">重量(g)</span>
                        <el-input-number
                            class="ml-2"
                            v-model="s['weight']"
                            size="mini"
                            :step="0.1"
                            :min="0"
                            prop="number"
                            :class="{'shrimp-error':isShrimp&&s['weight']==0}"
                        ></el-input-number>
                      </v-col>
                    </v-row>
                    
                    <!-- <v-text-field v-model.number="s['length']" type="number" min="0" step="0.1" dense hide-details class="mt-0 mr-2"><span class="pa-0 ma-0" slot="prepend" style="width: 80px;">長度(cm)</span></v-text-field>
                    <v-text-field v-model.number="s['weight']" type="number" min="0" step="0.1" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" style="width: 80px;">重量(g)</span></v-text-field> -->
                  </v-card-text>
                </div>
              </v-card-text>
              <v-card-actions style="padding: 24px 12px;">
                <v-spacer></v-spacer>
                <v-btn class="btn-secondary" @click="shrimpDialog = false">取消</v-btn>
                <v-btn class="btn-primary" @click="confirmShrimps">{{ nowObserve=='edit'?'編輯':'新增' }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
    </v-card>
  </div>
</template>

<script>
import https from "https";
import dayjs from "dayjs";
import "element-ui/lib/theme-chalk/index.css";
import WaterQuality_Vcharts2 from "@/components/sheet/waterQuality_vcharts2";
import _ from "lodash";
import Stackbar from '~/components/stackbar.vue';
import { color } from "echarts/lib/export";
const agent = new https.Agent({
  rejectUnauthorized: false
});
// import { number } from "~/node_modules/echarts/lib/export";
export default {
  layout: "emptynologin2",
  middleware: "auth",
  components: {
    WaterQuality_Vcharts2,
    Stackbar,
  },
  head(){
    return{
      title:'指標資料'
    }
  },
  data() {
    return {
      req: this.$route.query,
      captchaDialog:false,
      maindata: [],
      sel_main: 0,
      sel_area: "",
      sel_pool: "",
      pooldata: [],
      mainpool: {
        id: 1,
        name: "A1",
        items: [
          // { name: "體積", item: "volume", value: 140.0, unit: "噸" },
        ]
      },
      // ['id','事件等級','事件類別','時間','內容','資料範圍']
      eventHeaders: [
      // {
      //   align: "center",
      //   groupable: false,
      //   text: "id",
      //   value: "id"
      // },{
      //   align: "center",
      //   groupable: false,
      //   text: "事件等級",
      //   value: "event_level_name"
      // },{
      //   align: "center",
      //   groupable: false,
      //   text: "事件類別",
      //   value: "event_category_name"
      // },{
      //   align: "center",
      //   groupable: false,
      //   text: "時間",
      //   value: "created_time"
      // },{
      //   align: "center",
      //   groupable: false,
      //   text: "內容",
      //   value: "content"
      // },{
      //   align: "center",
      //   groupable: false,
      //   text: "資料範圍",
      //   value: "name"
      // }
    ],
      defitem: [],
      waterdatacols: [],
      allcols: {},
      waterloading: false, //折線圖，
      item: [{ name: "", items: [] }], // 事件
      item2: [{ name: "", items: [] }], // 圖表
      //---日曆
      menu_startdate: false,
      menu_enddate:false,
      sdate: dayjs(new Date(2021, 0, 11))
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      edate:dayjs(new Date(2021, 0, 11))
        .add(-10, "day")
        .format("YYYY-MM-DD"),
      chartmin:undefined,
      chartmax:undefined,
      markdata:{maxline:-999,minline:-999},
      //編輯中或刪除中的項目
      editedItem:{},
      //刪除視窗
      delDialog:false,
      //事件資料
      eventsData:[],
      eventTableData:[],
      aptchaDialog:false,
      req: this.$route.query,
      headers: [
        //   { text: "inspected_date", value: "inspected_date", groupable: false },
      ],
      selected: [],//多選項目
      showselect:false,
      loading: false,
      footerProps: {
        "items-per-page-text": "每頁",
        "items-per-page-options": [25, 50, 75, 100]
      },
      coldata:[],//{ "group": "env", "id": 19, "name_ch": "進水量", "name_en": "inflow", "unit": "L", "max": 999, "min": 0, "warning_min": null, "warning_max": null, "critical_min": null, "critical_max": null, "is_enable_alert": false }
      //---日曆
      
      menu_adate: false,
      //新增

      adate: "",
      atime: "",
      keepswitch: false, //保留數值不關閉

      //刪除視窗
      delDialog: false,
      //編輯視窗
      editDialog: false,
      editedItem: {id:undefined,class:undefined,value:undefined}, //已編輯項目暫存這邊
      //新增視窗
      addDialog: false,
      addData: [],
      num: {},
      num_min: 0,
      num_max: 99999,
      toggle_calc:null,
      //form
      valid: true,
      rules: { require: [v => !!v || "*必要項目"] },
      //公式
      formula:"",
      //tab
      tabs: ['圖表','編修紀錄','事件紀錄','打樣資訊'],
      nowTab: '圖表',
      //編修紀錄checkbox disable判斷
      disabledAllDel:true,
      // select
      nowArea:'',
      observableHeaders:[
        {groupable: false,text: "檢測時間",value: "inspected_time",width:"10%", sortable: true},
        //{groupable: false,text: "池",value: "pond",width:"5%", sortable: false },
        {groupable: false,text: "觀察網隻數",value: "observation_qty",width:"6%", sortable: false },
        {groupable: false,text: "蝦重(g)",value: "shrimp_weight",width:"5%", sortable: false },
        {groupable: false,text: "觀察網殘餌量(g)",value: "feed_amount",width:"7%", sortable: false },
        {groupable: false,text: "腸線顏色",value: "intestinal_color",width:"5%", sortable: false },
        {groupable: false,text: "肝胰臟顏色",value: "hepatopancreas_color",width:"5%", sortable: false },
        {groupable: false,text: "肌肉顏色",value: "muscle_color",width:"5%", sortable: false },
        {groupable: false,text: "蝦體顏色",value: "body_color",width:"5%", sortable: false },
        {groupable: false,text: "蝦體形狀",value: "body_shape",width:"5%", sortable: false },
        {groupable: false,text: "脫殼數量",value: "shell_qty",width:"5%", sortable: false },
        {groupable: false,text: "死蝦數量",value: "dead_shrimp_qty",width:"5%", sortable: false },
        {groupable: false,text: "觀察網影像",value: "img",width:"25%", sortable: false },
        {groupable: false,text: "操作",value: "action",width:"15%", sortable: false },
      ],
      observableData:[
      // {
      //   "IntestinalColor": {
      //       "Brown": 3,
      //       "Black": 0,
      //       "Red": 0,
      //       "White": 0,
      //       "Empty": 0
      //   },
      //   "HepatopancreasColor": {
      //       "Black": 0,
      //       "Brown": 0,
      //       "Red": 0,
      //       "Orange": 0,
      //       "White": 0,
      //       "Gray": 0,
      //       "Yellow": 0,
      //       "Green": 0
      //   },
      //   "MuscleColor": {
      //       "Translucent": 0,
      //       "Turbidity": 0,
      //       "TurbidityCottonLike": 0
      //   },
      //   "BodyColor": {
      //       "Transparent": 0,
      //       "Red": 0
      //   },
      //   "BodyShape": {
      //       "Deformity": 0
      //   },
      //   "observation_qty": 50,
      //   "is_shell": false,
      //   "dead_shrimp_qty": 33,
      //   "shrimp_weight": 3,
      //   "inspected_time": '2024-02-06 13:22:11',
      //   "created_user": 'XXX',
      //   "feed_amount": 0.3,
      //   "pond_id": 1,
      //   "pond":'',
      //   "img_a": 'https://www.idwatertech.com:8011/media/observation/20230912192249_1_1/feed_result.jpg',
      //   "img_b":'https://www.idwatertech.com:8011/media/observation/20230913202700_1_1/feed_result.jpg',
      //   "img_c":'https://www.idwatertech.com:8011/media/observation/20230913202700_1_2/feed_result.jpg',
      //   "img":[]
      // },{
      //   "IntestinalColor": {
      //       "Brown": 3,
      //       "Black": 23,
      //       "Red": 0,
      //       "White": 22,
      //       "Empty": 0
      //   },
      //   "HepatopancreasColor": {
      //       "Black": 0,
      //       "Brown": 0,
      //       "Red": 0,
      //       "Orange": 0,
      //       "White": 0,
      //       "Gray": 0,
      //       "Yellow": 0,
      //       "Green": 0
      //   },
      //   "MuscleColor": {
      //       "Translucent": 0,
      //       "Turbidity": 0,
      //       "TurbidityCottonLike": 0
      //   },
      //   "BodyColor": {
      //       "Transparent": 0,
      //       "Red": 0
      //   },
      //   "BodyShape": {
      //       "Deformity": 0
      //   },
      //   "observation_qty": 34,
      //   "is_shell": false,
      //   "dead_shrimp_qty": 33,
      //   "shrimp_weight": 3,
      //   "inspected_time": '2024-02-02 13:22:11',
      //   "created_user": 'XXX',
      //   "feed_amount": 0.3,
      //   "pond_id": 1,
      //   "pond":'',
      //   "img_a": '',
      //   "img_b":'',
      //   "img_c":'https://www.idwatertech.com:8011/media/observation/20230913170000_1_1/feed_result.jpg',
      //   "img":[]
      //   }
      ],
      optData:[],
      editObservalbe:{},
      windowWidth: window.innerWidth,
      observeDialog: false,
      observevalid: false,
      rules: {
        require: [v => !!v || "*必要項目"]
      },
      observeEdit:{},
      nowObserve:'edit',
      isShellData:[{
        name_en: true,
        name_ch: '是'
      },{
        name_en: false,
        name_ch: '否'
      }],
      showDate: true,
      isPondId: false,
      // 送出前檢查個顏色數量有無超過隻數
      isOver:{
        ic:false,
        hc:false,
        mc:false,
        bc:false,
        bs:false
      },
      listOpen: true,
      observeChartData:[],
      observeLineData:[],
      isSearch: false,
      chartShow: false,
      isInspectedTime: false,
      isLoading: false,
      showlocate: true,
      showBodyColor: true,
      shrimpDialog: false,
      shrimp:[],
      isShrimp: false,
      shrimpvalid:true,
      dialogLoading: true,
      isParaLoading: false,
      isAddDisabled: false
    };
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    //抓欄位資料 waterdatacols ，coldata
    var myitem=[];
    let getAllColForSearchList = await this.getAllColForSearchList();
    let data = typeof (getAllColForSearchList)=='string'?[]:getAllColForSearchList;
    var group =  Array.from(new Set(data.map(x=>x.group))); 
    for (let i = 0; i < group.length; i++) {
      const element = group[i];
      if (i!=0) {
        myitem.push({ divider: true });
      }
      myitem.push({ header: element });//group name
      myitem.push(...data.filter(x=>x.group==element).map(x=>({'name':x.name_ch,'value':x.name_en})));
    }
    //  myitem = data.map(x=>({'name':x.name_ch,'value':x.name_en}));
    this.waterdatacols = myitem;
    this.coldata = Object.assign([], data);
    // await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/all-col-for-search/`).then(res=>{
    //   var group =  Array.from(new Set(res.data.map(x=>x.group))); 
    //   for (let i = 0; i < group.length; i++) {
    //     const element = group[i];
    //     if (i!=0) {
    //       myitem.push({ divider: true });
    //     }
    //     myitem.push({ header: element });//group name
    //     myitem.push(...res.data.filter(x=>x.group==element).map(x=>({'name':x.name_ch,'value':x.name_en})));
    //   }
    //   //  myitem = res.data.map(x=>({'name':x.name_ch,'value':x.name_en}));
    //   this.waterdatacols = myitem;
    //   this.coldata = Object.assign([], res.data);
    // }).catch(err => {
    //   alert("失敗：" + err.message);
    // });
    let myurl = [
      `${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`,
      `${this.$store.state.mydata.gobal_api.apiUrl}/all-col-name/`
    ];
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    const fetchURL = url =>
      this.$axios.get(url, { httpsAgent: agent }).catch(err => {
        alert("fetchURL失敗：" + err.message);
      });
    // const promiseArray = myurl.map(fetchURL);
    const promiseArray = [];
    promiseArray.push(JSON.parse(localStorage.getItem('architecture'))?JSON.parse(localStorage.getItem('architecture')):await this.getArchitecture());
    let allcolData = await this.getAllColNameList();
    let allcols = typeof (allcolData)=='string'?[]:allcolData;
    promiseArray.push(allcols);
    console.log("req", this.req,promiseArray);
    //
    this.sdate = String(this.req.sdate).length > 0 ? this.req.sdate : "";
    this.edate = this.req.hasOwnProperty('edate') && String(this.req.edate).length > 0 ? this.req.edate : this.sdate; 
    this.sel_main =
      Number(this.req.sel_main) > 0 ? Number(this.req.sel_main) : 0;
    this.sel_area =
      Number(this.req.sel_area) > 0 ? Number(this.req.sel_area) : 0;
    this.sel_pool =
      Number(this.req.sel_pool) > 0 ? Number(this.req.sel_pool) : 0;

    this.defitem = this.req.defitem != undefined && this.req.defitem.length > 0 ?  this.coldata.filter(x=>x.name_ch==this.req.defitem)[0]?.name_ch : [];
    //---
    // console.log(this.sdate,this.sel_main,this.sel_area,this.sel_pool);
    // await Promise.all(promiseArray).then(([...data]) => {
    //   let res = data[0]; // first promise resolved
    //   this.maindata = res.data;
    //   console.log("場",this.maindata);
    //   if (Number(this.req.sel_pool) > 0) {
    //     //await this.areachange();
    //     this.areadata();
    //     this.areachange();
    //     this.sel_pool = Number(this.req.sel_pool);
    //   }
    //   //抓all項目
    //   res = data[1];
    //   var allitems = [];
    //   for (let i = 0; i < Object.keys(res.data).length; i++) {
    //     let colsclass = Object.keys(res.data)[i]; //water,env....
    //     if (i!=0) {
    //           allitems.push({ divider: true });
    //         }
    //         allitems.push({ header: colsclass });//group name
    //         allitems.push(...Object.keys(res.data[colsclass]));
    //   }

    //   // this.waterdatacols = allitems;
    //   this.allcols = Object.assign({}, res.data);//{adv:{每日成長量: "每日成長量(cm)",...},...}
    //   console.log("子項目 api",this.allcols);
    //   this.isLoading = true;
    // });

    this.maindata = promiseArray[0];
    console.log("場",this.maindata);
    if (Number(this.req.sel_pool) > 0) {
      //await this.areachange();
      this.areadata();
      this.areachange();
      this.sel_pool = Number(this.req.sel_pool);
    }
    var allitems = [];
      for (let i = 0; i < Object.keys(promiseArray[1]).length; i++) {
        let colsclass = Object.keys(promiseArray[1])[i]; //water,env....
        if (i!=0) {
              allitems.push({ divider: true });
            }
            allitems.push({ header: colsclass });//group name
            allitems.push(...Object.keys(promiseArray[1][colsclass]));
      }

      // this.waterdatacols = allitems;
      this.allcols = Object.assign({}, promiseArray[1]);//{adv:{每日成長量: "每日成長量(cm)",...},...}
      console.log("子項目 api",this.allcols);
      this.isLoading = true;
    // //參數代入
    if (Object.keys(this.req).length > 0 && this.defitem && this.sdate && this.edate) {
      await this.getdata();
    }
    this.getOptData();
  },
  computed: {
  },
  methods: {
    get_scopeData:function(evt){
      this.isParaLoading = true;
      console.log(evt);
      this.areadata(evt);
    },
    factoryChange() {
      this.sel_pool = null;
    },
    areadata: function(evt) {
      let filtermain = [];
      filtermain = this.maindata;
      console.log('select evt',evt);
      console.log(this.nowArea)
      let areaId;
      let areaName;
      if(evt) {
        areaId = evt.split('_')[evt.split('_').length-1];
        if(evt.split('_').length>2) {
          for(let i=0;i<evt.split('_').length-1;i++) {
            areaName += evt.split('_')[i];
          }
        }else {
          areaName = evt.split('_')[0];
        }
        
        
      }
      
      // if (
      //   //看有沒有選場
      //   this.sel_main != undefined &&
      //   this.sel_main > 0 &&
      //   this.maindata.length > 0
      // ) {
      //   filtermain = filtermain.filter(main => main.id == this.sel_main);
      // }
      console.log('filtermain',filtermain);
      console.log('area',this.sel_main,this.sel_area )
      if (
        //看有沒有選場
        this.sel_main != undefined &&
        this.sel_main > 0 &&
        this.maindata.length > 0 && 
        this.sel_area > 0 && !evt
      ) {
        filtermain.forEach((x)=>{
          if(x.id == this.sel_main) {
            x.node.forEach((y)=> {
              if(y.id == this.sel_area) {
                this.nowArea = y.name+'_'+this.sel_area;
              }
            });
          }
        });
        console.log('nowArea',this.nowArea);
      }else {
        filtermain.forEach((x)=>{
          x.node.forEach((y)=> {
            if(y.name == areaName && y.id==areaId) {
              // 如果場或區不與原本的相同，要清空池，因為查詢按鈕要判斷disable
              if(this.sel_main!==x.id || this.sel_area!==y.id) {
                this.sel_pool = '';
              }
              this.sel_main = x.id
              this.sel_area = y.id;
              this.nowArea = y.name+'_'+this.sel_area;
            }
          });
        });
        this.areachange();
      }
    },
    areachange: async function() {
      var para = {
        id: this.sel_area
      };
      console.log('sel_area',this.sel_area);
      if (this.sel_area) {
        //水池基本資料
        let getPondDataList = await this.getPondDataList(para);
        let data = typeof (getPondDataList)=='string'?[]:getPondDataList;
        this.mainpool.items = data;
        // await this.$axios
        //   .get(
        //     `${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`,
        //     { params: para },
        //     { httpsAgent: agent }
        //   )
        //   .then(res => {
        //     console.log("ponds-data",res.data);
        //     this.mainpool.items = res.data;
        //   })
        //   .catch(err => {
        //     alert("失敗：" + err.message);
        //   });
      } else {
        this.mainpool.items = [];
      }
      this.isParaLoading = false;
    },
    changeDefItem() {
      // 清除項目
      if(this.defitem==null) {
        this.defitem=[];
      }
    },
    getdata: async function() {
      this.isLoading = false;
      // 編修事件的批次修改checkbox
      this.disabledAllDel = false;
      //mark line 先歸零
      this.markdata.maxline = -999;
      this.markdata.minline = -999;
      //清空itm
      this.item=[];
      this.item2=[];
      this.eventTableData = [];
      this.eventHeaders = [];
      console.log(
        "api 參數",
        this.sdate,
        this.edate,
        this.sel_pool,
        this.sel_area,
        this.sel_main,
      );
      console.log('def',this.defitem)
      this.chartmin = undefined;
      this.chartmax = undefined;
      //指定的項目是歸屬於哪個類別，水質/投餵
      var defitem_tmp = this.defitem; //判斷項目是屬於水質還是投餵用
      let itemclass = ``;
      let mycols = this.allcols;
      for (const idx in Object.keys(mycols)) {
        var tmp = Object.keys(mycols[Object.keys(mycols)[idx]]).find(
          keys => keys == defitem_tmp
        );
        if (tmp !== undefined && tmp == defitem_tmp) {
          itemclass = Object.keys(mycols)[idx];
        }
      }

      //抓折線圖資料囉
      let parm = {
        started_date: this.sdate,
        ended_date: this.edate,
        factory_id: this.sel_main,
        pond_area_id: this.sel_area,
        pond_id: this.sel_pool,
        items: this.defitem,
        data_group: itemclass
      };
      // let apiURL = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/`;
      // await this.$axios
      //   .get(apiURL, { params: parm }, { httpsAgent: agent })
      //   .then(res => {
      //     console.log("all-data API:", res.request.responseURL);
      //     let data2 = _.cloneDeep(res.data);
      //     res.data.items.forEach(function(x) {//給折線圖用的資料
      //       delete x.id; //"刪掉id欄位"
      //       delete x.updated_user; //"刪掉updated_user欄位"
      //       delete x.group;//"刪掉group欄位"
      //     });
          
      //     // data2.items.forEach(function(x) {//給表格用的資料
      //     // });
          
      //     this.item = res.data;
      //     this.item2 = data2;
      //     //抓上下限資料
      //     if ( res.data.items.length>0) {
      //       this.getLimitData();
      //     }
      //   })
      //   .catch(err => {
      //     alert("失敗：" + err.message);
      //   });
      

      let apiurl = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/`;
      //歸零
      this.item = "";
      this.headers = [];
      //抓資料
      let getAllDataList = await this.getAllDataList(parm);
      let data = typeof (getAllDataList)=='string'?[]:getAllDataList;
      let data2 = _.cloneDeep(data);
      this.item = _.cloneDeep(data);
      this.item.items?.forEach(function(x) {//給折線圖用的資料
        delete x.id; //"刪掉id欄位"
        delete x.updated_user; //"刪掉updated_user欄位"
        delete x.group;//"刪掉group欄位"
      });
      // this.item.items = [{
      //   inspected_date: "2024-12-08 01:37:58",
      //   device: 2.33,
      //   member: null
      // },{
      //   inspected_date: "2024-12-09 11:33:00",
      //   member: 3.98,
      //   device: null
      // },{
      //   inspected_date: "2024-12-07 22:37:45",
      //   device: 2.21,
      //   member: null
      // },{
      //   inspected_date: "2024-12-07 01:37:06",
      //   device: 0.02,
      //   member: null
      // },{
      //   inspected_date: "2024-12-06 16:37:19",
      //   device: 0.11,
      //   member: null
      // },{
      //   inspected_date: "2024-12-06 10:35:00",
      //   device: null,
      //   member: 0
      // },]
      if (data2.items.length > 0) {
        let cols = Object.keys(data2.items[0]);
        data2.items.sort((a,b)=>new Date(b.inspected_date)-new Date(a.inspected_date));
        for (const key in cols) {
          this.headers.push({
            text: cols[key],
            value: cols[key],
            align: "center",
            width: "20%",
            groupable: false
          });
        }
      }
      for(let i=0;i<this.headers.length;i++) {
        if(this.headers[i].text == 'group') {
          this.headers[i].width = '10%';
        }
      }
      this.headers.push({
        text: "動作",
        value: "actions",
        sortable: false,
        width: "20%",
      });
      
      this.item2 = data2;
      if ( this.item.items.length>0) {
        this.getLimitData();
      }
      // 批次刪除，無資料時disable1不可勾選chexkbox
      if(this.item2.items.length>0) {
        this.disabledAllDel = false;
      }else {
        this.disabledAllDel = true;
      }
      this.loading = false;
      console.log('item',this.item);
      console.log('item2',this.item2)
      console.log('headers',this.headers)
      // await this.$axios
      //   .get(apiurl, { params: parm }, { httpsAgent: agent })
      //   .then(res => {
      //     console.log("API:" + res.request.responseURL);
      //     if(res.data=='欄位資料有誤'){
      //       this.$toast.error(`取得結果：欄位資料有誤`, { duration: 2000 });
      //       window.location.href='/indicator/index2'
      //     }else{
      //       let data2 = _.cloneDeep(res.data);
      //       this.item = _.cloneDeep(res.data);
      //       this.item.items.forEach(function(x) {//給折線圖用的資料
      //         delete x.id; //"刪掉id欄位"
      //         delete x.updated_user; //"刪掉updated_user欄位"
      //         delete x.group;//"刪掉group欄位"
      //       });
      //       if (data2.items.length > 0) {
      //         let cols = Object.keys(data2.items[0]);
      //         for (const key in cols) {
      //           this.headers.push({
      //             text: cols[key],
      //             value: cols[key],
      //             align: "center",
      //             width: "20%",
      //             groupable: false
      //           });
      //         }
      //       }
      //       for(let i=0;i<this.headers.length;i++) {
      //         if(this.headers[i].text == 'group') {
      //           this.headers[i].width = '10%';
      //         }
      //       }
      //       this.headers.push({
      //         text: "動作",
      //         value: "actions",
      //         sortable: false,
      //         width: "20%",
      //       });
            
      //       this.item2 = data2;
      //       if ( this.item.items.length>0) {
      //         this.getLimitData();
      //       }
      //       // 批次刪除，無資料時disable1不可勾選chexkbox
      //       if(this.item2.items.length>0) {
      //         this.disabledAllDel = false;
      //       }else {
      //         this.disabledAllDel = true;
      //       }
      //       this.loading = false;
      //       console.log('item',this.item);
      //       console.log('item2',this.item2)
      //       console.log('headers',this.headers)
      //     }
      //   })
      //   .catch(err => {
      //     alert("查詢失敗：" + err.message);
      //   });

      //抓事件資料
      this.eventsData.splice(0,this.eventsData.length);
      this.getEventData(1);
      // var result1 = await this.getEventData(1);
      // var result2 = await this.getEventData(2);
      // var result3 = await this.getEventData(3);
      // this.eventsData = result1.concat(result2,result3);
      
      // 抓觀察網資料
      this.getObservationData();
      this.isLoading = true;
      
    },
    //抓事件資料
    async getEventData(level) {
      var parms = {};
      var poolidcpd = [];
      var result =[];
      
      // this.eventsData.splice(0,this.eventsData.length);
      // started_date=2022-01-01&ended_date=2022-01-04
      parms.started_date = this.sdate;
      parms.ended_date = this.edate;
      switch (level) {
        case 1:
          poolidcpd.push(this.sel_main);
          parms.factory_id = poolidcpd.join();
          break;
        case 2:
          poolidcpd.push(this.sel_area);
          parms.pond_area_id = poolidcpd.join();
          break;
        case 3:
          poolidcpd.push(this.sel_pool);
          parms.pond_id = poolidcpd.join();
          break;
      }
      let getEventList = await this.getEventList(parms);
      let eventData = typeof (getEventList)=='string'?[]:getEventList;
      result = eventData;
      // 因為會有重複抓取問題，需剔除重複id
      let newEvent = [];
      this.eventsData.forEach(d=>{
        if(!newEvent.includes(d.id)) {
          newEvent.push(d.id);
        }
      })
      result.forEach(r=>{
        if(!newEvent.includes(r.id)) {
          this.eventsData.push(r);
          newEvent.push(r.id);
        }
      })
      if(level==1) {
        this.getEventData(2);
      }else if(level==2) {
        this.getEventData(3);
      }else {
        // 事件資料整理，要符合表格欄位
        if(this.eventsData.length>0) {
          this.eventHeaders = [
            {align: "center",groupable: false,text: "id",value: "id",width:"10%"},
            {align: "center",groupable: false,text: "事件等級",value: "event_level_name",width:"10%"},
            {align: "center",groupable: false,text: "事件類別",value: "event_category_name",width:"10%"},
            {align: "center",groupable: false,text: "時間",value: "time",width:"20%"},
            {align: "center", groupable: false,text: "內容",value: "content",width:"30%"},
            {align: "center",groupable: false,text: "資料範圍",value: "name",width:"20%"}]
        }
        this.eventsData.sort((a,b)=>new Date(b.started_date) - new Date(a.started_date));
        for(let i=0;i<this.eventsData.length;i++) {
          this.eventTableData.push({
            id: this.eventsData[i].id,
            event_level_name: this.eventsData[i].event_level_name,
            event_category_name: this.eventsData[i].event_category_name,
            time: `起：${this.eventsData[i].started_date}<br> 訖：${this.eventsData[i].ended_date}`,
            content:`全日事件：${this.eventsData[i].is_all_day}<br> 標題：${this.eventsData[i].title}[最後編輯者：${this.eventsData[i].created_user}]<br> 內容：${this.eventsData[i].content}`,
            name: '',
            color: this.eventsData[i].color
          })
          if(this.eventsData[i].items.length>0) {
            let data = []
            for(let x=0;x<this.eventsData[i].items.length;x++) {
              data.push(this.eventsData[i].items[x].name);
            }
            this.eventTableData[i].name = data.toString().replace(',','<br>');
          }
        }
        console.log("event data:",this.eventsData);
        console.log("event table:",this.eventTableData);
      }
      // this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/event/`, {
      //     params: parms
      //   })
      //   .then(res => {
      //     result = res.data;
      //     // console.log(level,this.eventsData);
      //     // console.log('result',result);
      //     // 因為會有重複抓取問題，需剔除重複id
      //     let newEvent = [];
      //     this.eventsData.forEach(d=>{
      //       if(!newEvent.includes(d.id)) {
      //         newEvent.push(d.id);
      //       }
      //     })
      //     result.forEach(r=>{
      //       if(!newEvent.includes(r.id)) {
      //         this.eventsData.push(r);
      //         newEvent.push(r.id);
      //       }
      //     })
      //     if(level==1) {
      //       this.getEventData(2);
      //     }else if(level==2) {
      //       this.getEventData(3);
      //     }else {
      //       // 事件資料整理，要符合表格欄位
      //       if(this.eventsData.length>0) {
      //         this.eventHeaders = [
      //           {align: "center",groupable: false,text: "id",value: "id",width:"10%"},
      //           {align: "center",groupable: false,text: "事件等級",value: "event_level_name",width:"10%"},
      //           {align: "center",groupable: false,text: "事件類別",value: "event_category_name",width:"10%"},
      //           {align: "center",groupable: false,text: "時間",value: "time",width:"20%"},
      //           {align: "center", groupable: false,text: "內容",value: "content",width:"30%"},
      //           {align: "center",groupable: false,text: "資料範圍",value: "name",width:"20%"}]
      //       }
      //       for(let i=0;i<this.eventsData.length;i++) {
      //         this.eventTableData.push({
      //           id: this.eventsData[i].id,
      //           event_level_name: this.eventsData[i].event_level_name,
      //           event_category_name: this.eventsData[i].event_category_name,
      //           time: `起：${this.eventsData[i].started_date}<br> 訖：${this.eventsData[i].ended_date}`,
      //           content:`全日事件：${this.eventsData[i].is_all_day}<br> 標題：${this.eventsData[i].title}[最後編輯者：${this.eventsData[i].created_user}]<br> 內容：${this.eventsData[i].content}`,
      //           name: '',
      //           color: this.eventsData[i].color
      //         })
      //         if(this.eventsData[i].items.length>0) {
      //           let data = []
      //           for(let x=0;x<this.eventsData[i].items.length;x++) {
      //             data.push(this.eventsData[i].items[x].name);
      //           }
      //           this.eventTableData[i].name = data.toString().replace(',','<br>');
      //         }
      //       }
      //       console.log("event data:",this.eventsData);
      //       console.log("event table:",this.eventTableData);
      //     }
      //     console.log("event api:", res.request.responseURL);
          
      //   })
      //   .catch(err => {
      //     this.$toast.error(`資料取得失敗:${err.message}`, { duration: 2000 });
      //     // window.location.href='/indicator/index2'
      //   });
        return result;
    },
    gofocusNxt2: function(id) {
      var findeditem = this.mainpool.items.find(x => x.name == id);
      var idxitem = this.mainpool.items.indexOf(findeditem);
      if (idxitem + 1 == this.mainpool.items.length) {
        this.$refs[id][0].focus(); //最後一項，鎖定原位
      } else {
        let nxtName = this.mainpool.items[idxitem + 1].name;
        this.$refs[nxtName][0].focus(); //最後一項，鎖定原位
      }
      // this.$refs['A2'].$el.children[0].focus();
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    getNowTime: function() {
      let mytime = dayjs().format("HH:mm");
      return mytime;
    },
    getLimitData: async function() {
      let getColDataList = await this.getColDataList();
      let data = typeof (getColDataList)=='string'?[]:getColDataList;
      var lmtitem =  data.filter(x=>x.name_ch==this.defitem);
      if(lmtitem.length>0){//不可以有null值
        this.markdata.maxline = (lmtitem[0].critical_max==null)?-999:lmtitem[0].critical_max;
        this.markdata.minline = (lmtitem[0].critical_min==null)?-999:lmtitem[0].critical_min;
      }else{
        this.markdata.maxline = -999;
        this.markdata.minline = -999;
      }
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/`)
      //   .then(res => {
      //     // this.allcols = Object.assign([], res.data);
      //     var lmtitem =  res.data.filter(x=>x.name_ch==this.defitem);
      //     if(lmtitem.length>0){//不可以有null值
      //       this.markdata.maxline = (lmtitem[0].critical_max==null)?-999:lmtitem[0].critical_max;
      //       this.markdata.minline = (lmtitem[0].critical_min==null)?-999:lmtitem[0].critical_min;
      //     }else{
      //       this.markdata.maxline = -999;
      //       this.markdata.minline = -999;
      //     }
      //     console.log("col data:",res.request.responseURL);
      //   });
    },
    getItemClass: function(item) {//依項目回傳主要類別是什麼
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
    delItem: async function(item) {
      //編輯中的物件item
      this.editedItem.id = item.id;
      this.editedItem.inspected_date = item.inspected_date;
      this.editedItem.value = item[Object.keys(item)[3]];
      this.editedItem.class = this.getItemClass(Object.keys(item)[3]); //water,adv...
      this.delDialog = true;
    },
    delsubmit: async function() {
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/${this.editedItem.id}/`;
      let deldata = { data_group: this.editedItem.class };
      console.log("DEL data:", deldata);
      console.log("DEL:" + url);
      var res = false;
      res = await this.deleteAllDataList(this.editedItem.id,deldata);
      setTimeout(()=>{
        if(res) {
          this.delDialog = false; //close dialog
          this.$toast.success(`刪除成功`, { duration: 2000 });
          this.getdata();//重取得資料
          this.showselect = false;
        }else {
          alert("刪除失敗!");
        }
      },50)
      // await this.$axios
      //   .delete(url, { data: deldata }, { httpsAgent: agent })
      //   .then(res => {
      //     if (res.data == "刪除成功") {
      //       // this.getdata();
      //       this.delDialog = false; //close dialog
      //       this.$toast.success(`刪除成功`, { duration: 2000 });
      //       this.getdata();//重取得資料
      //     } else {
      //       alert("刪除失敗!：" + res.data);
      //     }
      //   })
      //   .catch(error => {
      //     alert("刪除失敗!：" + error.message);
      //   });
    },
    delItems:async function(){
      if(confirm(`批次刪除${this.selected.length}筆資料？`)){
        var delsuccess = 0;
        var record = 0;
        for (let i = 0; i < this.selected.length; i++) {
          const item = this.selected[i];
          const editedItem = item;
          editedItem.class = this.getItemClass(Object.keys(item)[3]); //water,adv...
          let url = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/${editedItem.id}/`;
          let deldata = { data_group: editedItem.class };
          // console.log("DEL data:", deldata);
          // console.log("DEL:" + url);
          var res = false;
          res = await this.deleteAllDataList(editedItem.id, deldata);
          // setTimeout(()=>{
            if(res) {
              record+=1;
              delsuccess += 1;
              if(record==this.selected.length) {
                this.getdata();
                this.showselect = false;
                this.$toast.success(`刪除結果 成功筆數/總筆數：${delsuccess}/${this.selected.length}`, { duration: 2000 });
                this.selected = [];
              }
              
            }else {
              record+=1;
              alert(`刪除失敗!：${editedItem.id}`);
              if(record==this.selected.length) {
                this.getdata();
                this.showselect = false;
                this.$toast.success(`刪除結果 成功筆數/總筆數：${delsuccess}/${this.selected.length}`, { duration: 2000 });
                this.selected = [];
              }
            }
            
          // },50)
          // await this.$axios
          //   .delete(url, { data: deldata }, { httpsAgent: agent })
          //   .then(res => {
          //     if (res.data == "刪除成功") {
          //       delsuccess += 1;
          //     } else {
          //       console.log(`刪除失敗：${editedItem.id}-${res.data}`);
          //       alert(`刪除失敗!：${editedItem.id}-` + res.data);
          //     }
          //   })
          //   .catch(error => {
          //      console.log(`刪除失敗：${editedItem.id}-${error.message}`);
          //     alert(`刪除失敗!：${editedItem.id}-` + error.message);
          //   });
        }
        
      }
    },
    editItem: async function(item) {
      //編輯中的物件item
      this.editedItem.inspected_date = item.inspected_date;
      this.editedItem.id = item.id;
      this.editedItem.value = item[Object.keys(item)[3]];
      this.editedItem.class = this.getItemClass(Object.keys(item)[3]); //water,adv...
     
      //{ "group": "env", "id": 19, "name_ch": "進水量", "name_en": "inflow", "unit": "L", "max": 999, "min": 0, "warning_min": null, "warning_max": null, "critical_min": null, "critical_max": null, "is_enable_alert": false }
      var colitem = this.coldata.filter(x=>x.name_ch==this.defitem);
      if (colitem.length == 1) {
        this.num = {}; //清空
        this.num_min =
          colitem[0].min != undefined || typeof colitem[0].min == "number"
            ? colitem[0].min
            : 0;
        this.num_max =
          colitem[0].max != undefined || typeof colitem[0].max == "number"
            ? colitem[0].max
            : 99999;
        this.editDialog = true;
      } else {
        this.$toast.error(`查無項目min、max資料`, { duration: 2000 });
      }
      
    },
    openadd: async function() {
      this.keepswitch = false;
      this.adate = "";
      this.addData = [];
      this.atime = "";
      
      //{ "group": "env", "id": 19, "name_ch": "進水量", "name_en": "inflow", "unit": "L", "max": 999, "min": 0, "warning_min": null, "warning_max": null, "critical_min": null, "critical_max": null, "is_enable_alert": false }
      var colitem = this.coldata.filter(x=>x.name_ch==this.defitem);
      if (colitem.length == 1) {
        this.num = {}; //清空
        this.num_min =
          colitem[0].min != undefined || typeof colitem[0].min == "number"
            ? colitem[0].min
            : 0;
        this.num_max =
          colitem[0].max != undefined || typeof colitem[0].max == "number"
            ? colitem[0].max
            : 99999;
        this.addDialog = true;
      } else {
        this.$toast.error(`查無項目min、max資料`, { duration: 2000 });
      }
    },
    editsubmit: async function() {
      if (confirm("確定修改？") == true) {
        // await this.$axios.get("${this.$store.state.mydata.gobal_api.apiUrl}/architecture/").then(res => {});
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/${this.editedItem.id}/`;
        const updUser = this.$auth.$state.user.email;
        let data = {
          val: this.editedItem.value,
          updated_user: updUser,
          data_group: this.editedItem.class
        };
        var res = false;
        res = await this.patchAllDataList(data,this.editedItem.id);
        setTimeout(()=>{
            if(res) {
              this.getdata();
              this.editDialog = false; //close dialog
            }
        },50)
        // await this.$axios
        //   .patch(url, data, { httpsAgent: agent })
        //   .then(res => {
        //     if (res.data == "修改成功") {
        //       this.getdata();
        //       this.editDialog = false; //close dialog
        //       this.$toast.success(`修改成功`, { duration: 2000 });
        //     } else {
        //       alert("修改失敗!：" + res.data);
        //     }
        //   })
        //   .catch(error => {
        //     alert("修改失敗!：" + error.message);
        //   })
        //   .finally(() => {});
      } else {
      }
    },
    opencapDialog:async function(){
      this.captchaDialog = true;
    },
    captchacheck:async function(){
      const token = await this.$recaptcha.getResponse();
      var parm = {token:token};
      let getRecaptchacheckList = await this.getRecaptchacheckList(parm);
      // console.log(getRecaptchacheckList);
      // var resdata = JSON.parse(getRecaptchacheckList);
      if(getRecaptchacheckList.success){
        this.captchaDialog=false;
        this.delItems();
      }else {
        this.$toast.error("錯誤：" + getRecaptchacheckList.error_codes[0], { duration: 2000 });
      }
        // await this.$axios
        // .get(
        //   `${this.$store.state.mydata.gobal_api.apiIIS82}/idapi.asmx/recaptchacheck`,{params : parm}
        // )
        // .then(res => {
        //   var resdata = JSON.parse(res.data);
        //   if(resdata.success){
        //     this.captchaDialog=false;
        //     this.delItems();
        //   }
        // });
      await this.$recaptcha.reset();
    },
    formula_eval: function(feed, formula) {
      feed = feed == undefined || isNaN(feed) || feed == null ? 0 : feed;
      var data = isNaN(formula.substr(0, 1))
        ? `${feed}${formula}`
        : `${feed}*${formula}`;
      var result;
      try {
        //避免出現其他無法解決符號
        // result = mee.eval(data).toFixed(2);
        result = eval(data).toFixed(2);
      } catch (error) {
        result = 0;
      }
      return result;
    },
    reCalc:function(){
      //計算公式
      for (const key in Object.keys(this.num)) {
        const element = Object.keys(this.num)[key];//A1
          if (this.num[element] != undefined) {
            var newvalue = this.formula_eval(this.num[element],this.formula);
            this.num[element] = newvalue;
      //       const el_id = this.mainpool.items.filter(x => x.name == element)[0]
      //         .id;
      //       submitData.push({ id: el_id, val: this.num[element] });
          }
        }
       this.formula="";
    },
    addsubmit: async function() {
      let valid = this.$refs.form.validate();
      if (valid) {
        this.isAddDisabled = true;
        // let colclass = this.getItemClass(this.defitem);
        var defitemall = this.coldata.filter(x=>x.name_ch==this.defitem)[0];
        let colclass = defitemall.group;
        if(['feed','pbio','breeding_material'].includes(colclass)){
          this.$toast.error(`僅供查詢，禁止新增該群資料：${colclass}`, { duration: 2000 });
          return;
        }
        let apiurl = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/`;

        let url = apiurl;
        const updUser = this.$auth.$state.user.email;
        let parms = {
          items: defitemall.name_en, //inflow (要用英文的)
          inspected_time: `${this.adate} ${this.atime}:00`, //無秒數，直接補0
          data: [],
          created_user: updUser, //建立者名稱
          data_group: colclass //water,adv,...
        };
        let submitData = [];
        //原本抓textfield的方式
        // this.addData.forEach(el => {
        //   submitData.push({ id: el.id, val: el.value });
        // });
        //送出資料重判斷########################
        //foreach Object.keys(this.num)
        for (const key in Object.keys(this.num)) {
          const element = Object.keys(this.num)[key];
          if (this.num[element] != undefined) {
            const el_id = this.mainpool.items.filter(x => x.name == element)[0]
              .id;
            submitData.push({ id: el_id, val: this.num[element] });
          }
        }
        if (submitData.length <= 0) {
          this.$toast.success(`無新增資料`, { duration: 2000 });
          return;
        }
        parms.data = submitData;
        console.log("adddata aparms", parms);
        var res = false;
          res = await this.postAllDataList(parms);
          setTimeout(()=>{
              this.isAddDisabled = false;
              if(res) {
                if(this.sdate&&this.edate&&this.sel_main&&this.sel_area&&this.sel_pool&&this.defitem) {
                  this.getdata();//新增未必有選到所有選項
                }
                
                this.atime = "";
                if (this.keepswitch == false) {
                  this.addDialog = false; //close dialog
                }
              }
          },50)
        // await this.$axios
        //   .post(url, parms, { httpsAgent: agent })
        //   .then(res => {
        //     if (res.data == "新增成功") {
        //       if(this.sdate&&this.edate&&this.sel_main&&this.sel_area&&this.sel_pool&&this.defitem) {
        //         this.getdata();//新增未必有選到所有選項
        //       }
              
        //       this.atime = "";
        //       if (this.keepswitch == false) {
        //         this.addDialog = false; //close dialog
        //       }
        //       this.$toast.success(`新增成功`, { duration: 2000 });
        //     } else {
        //       alert("新增失敗!：" + res.data);
        //     }
        //   })
        //   .catch(error => {
        //     alert("新增失敗!：" + error.message);
        //   })
        //   .finally(() => {
        //     //this.getdata();
        //   });
      }
    },
    // 觀察網
    // 取得顏色的項目
    getOptData:async function(){
      if(this.optData.length==0) {
        let getFieldOtptionList = await this.getFieldOtptionList();
        let data = typeof (getFieldOtptionList)=='string'?[]:getFieldOtptionList;
        this.optData = data;
        // console.log(this.optData);

        let datas = _.cloneDeep(this.observableData);
        this.observableData = [];
        datas.forEach(odata=>{
          this.getFilter(odata);
        })

        this.observableData = _.cloneDeep(datas);
        if(this.observableData.length>0) {
          this.getChartData();
        }else {
          this.isLoading = true;
        }
        this.isSearch = true;
        // let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/field-option/`;
        // await this.$axios.get(url).then(res => {
        //     if(res.status==200){
        //         this.optData = res.data;
        //         // console.log(this.optData);

        //         let datas = _.cloneDeep(this.observableData);
        //         this.observableData = [];
        //         datas.forEach(odata=>{
        //           this.getFilter(odata);
        //         })

        //         this.observableData = _.cloneDeep(datas);
        //         if(this.observableData.length>0) {
        //           this.getChartData();
        //         }
        //         this.isSearch = true;
                
        //       }else{
        //           this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
        //       }
        //     })
        //     .catch(error=>{
        //         this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
        //     })
        //     .finally(() => {
        //         });
      }else {
        let datas = _.cloneDeep(this.observableData);
        this.observableData = [];
        datas.forEach(odata=>{
          this.getFilter(odata);
        })
        this.observableData = _.cloneDeep(datas);
        if(this.observableData.length>0) {
          this.getChartData();
        }else {
          this.isLoading = true;
        }
        this.isSearch = true;
      }
      
      var keyLst = Object.keys(this.optData);
      this.observableData.forEach(observe=>{
        observe.numOfColor = {};
        keyLst.forEach(k=>{
          if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
            observe.numOfColor[k] = new Array();
            observe[k].forEach(color=>{
              if(color.value>0) {
                observe.numOfColor[k].push(color);
              }
            })
          }
        })
      })
      console.log('observableData',this.observableData);
    },
    async getObservationData() {
      this.chartShow = false;
      let parm = {
        started_date: this.sdate,
        ended_date: this.edate,
        pond_id: this.sel_pool,
      };
      let getObservationRecordList = await this.getObservationRecordList(parm);
      let data = typeof (getObservationRecordList)=='string'?[]:getObservationRecordList;
      this.observableData = [];
      data.sort((a,b)=>{return b.inspected_time-a.inspected_time});
      this.observableData = data;
      this.observableData.forEach(x=>{
        if(x.shrimps!==null && x.shrimps.length>0) {
          let num = 0;
          x.shrimps.forEach(y=>num=num+y.weight);
          if(num>0) {
            x.shrimp_weight = (((num / x.observation_qty)*1000)/1000).toFixed(3);
          }else {
            x.shrimp_weight = null;
          }
          
        }
      })
      this.getOptData();
      // let apiurl = `${this.$store.state.mydata.gobal_api.apiUrl}/observation-record/`;
      // await this.$axios
      //   .get(apiurl, { params: parm }, { httpsAgent: agent })
      //   .then(res=>{
      //     console.log('觀察網資料',res)
      //     console.log("觀察網資料取得API:" + res.request.responseURL);
      //     this.observableData = [];
      //     if(res.status==200 && typeof(res.data)!=='string') {
      //       res.data.sort((a,b)=>{return b.inspected_time-a.inspected_time});
      //       this.observableData = res.data;
      //       this.observableData.forEach(x=>{
      //         if(x.shrimps!==null && x.shrimps.length>0) {
      //           let num = 0;
      //           x.shrimps.forEach(y=>num=num+y.weight);
      //           if(num>0) {
      //             x.shrimp_weight = (((num / x.observation_qty)*100)/100).toFixed(2);
      //           }else {
      //             x.shrimp_weight = null;
      //           }
                
      //         }
      //       })
      //       this.getOptData();
      //     }
      //   })
      //   .catch(err => {
      //     alert("查詢失敗：" + err.message);
      //   });
    },
    getFilter(odata) {
      this.maindata.forEach(x=>{
        x.node.forEach(y=>{
          y.node.forEach(z=>{
            if(z.id==odata.pond_id) {
              odata.pond=y.name+'_'+z.name;
            }
          })
        })
      })
      var keyLst = Object.keys(this.optData);
      let num = 0;
      keyLst.forEach(k=>{
          if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
            if(odata[k]) {
              let data = [];
              var keys = Object.keys(odata[k]);
              keys.forEach((s,sid)=>{
                  this.optData[k].forEach(x=>{
                      if(x.name_en.toUpperCase() == s.toUpperCase()) {
                          data[sid] = _.cloneDeep(x);
                          data[sid].value = odata[k][s];
                      }
                  })

              })
              // console.log(k,data);
              odata[k] = data;
              odata[k].sort((a,b)=>{return b.value-a.value});
              num++;
            }else {
              odata[k] = _.cloneDeep(this.optData[k]);
              odata[k].forEach(c=>{
                    c.value=0;
                })
            }
              
              
          }
          
      })
      odata.img=[];
      if(odata.img_a!==null&&odata.img_a.length>0) {
        odata.img.push(odata.img_a);
      }
      if(odata.img_b!==null&&odata.img_b.length>0) {
        odata.img.push(odata.img_b);
      }
      if(odata.img_c!==null&&odata.img_c.length>0) {
        odata.img.push(odata.img_c);
      }
      // console.log('observabledata',odata);
    },
    getChartData() {
      var keyLst = Object.keys(this.optData);
      
      this.observeChartData = [];
      this.observeLineData = [];
      let datas = _.cloneDeep(this.observableData);
      datas.sort((a,b)=>{return new Date(a.inspected_time)-new Date(b.inspected_time)});
      // console.log('obserbe',this.observeChartData)

      // 觀察網殘餌
      this.observeLineData.push({
        name_en: 'feed_amount',
        name_ch: '觀察網殘餌量(g)',
        chartData: {
          xAxis: new Array(),
          legend: new Array(),
          series: new Array()
        }
      })
      this.observeLineData.push({
        name_en: 'shrimp_weight',
        name_ch: '蝦隻重量(g)',
        chartData: {
          xAxis: new Array(),
          legend: new Array(),
          series: new Array()
        }
      })
      this.observeLineData[0].chartData.series.push({
        name: '殘餌量',
        smooth: true,
        type: 'line',
        data: new Array()
      })
      this.observeLineData[1].chartData.series.push({
        name: '重量',
        type: 'line',
        smooth: true,
        data: new Array()
      })
      datas.forEach((observe,oid)=>{
        this.observeLineData[0].chartData.legend=['殘餌量'];
        this.observeLineData[0].chartData.xAxis.push(observe['inspected_time']);
        this.observeLineData[0].chartData.series[0].data[oid]=observe['feed_amount'];

        this.observeLineData[1].chartData.legend=['重量'];
        this.observeLineData[1].chartData.xAxis.push(observe['inspected_time']);
        this.observeLineData[1].chartData.series[0].data[oid]=observe['shrimp_weight'];
      })
      // 蝦隻狀態
      let num = 0;
      keyLst.forEach(k=>{
          if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
              let name_ch = k=='BodyColor'?'蝦體顏色':k=='BodyShape'?'蝦體形狀':k=='HepatopancreasColor'?'肝胰臟顏色':k=='IntestinalColor'?'腸線顏色':'肌肉顏色';
              this.observeChartData[num] = {
                name_en: k,
                name_ch: name_ch,
                chartData: {}
              }
              let xAxis = [];
              let series = [];
              // series= [{name: '棕色',type: 'bar',stack: 'stack分群',data: [120, 132](不同時間的棕色資料)},]
              datas.forEach((observe,oid)=>{
                this.observeChartData[num].data = _.cloneDeep(observe[k]);
                let legend = [];
                
                xAxis.push(observe['inspected_time']);
                observe[k].forEach(oitem=>{
                  // console.log(oitem.value);
                  legend.push(oitem.name_ch);
                })
                // this.observeChartData[num].chartData.legend = legend;

                // 3/8養殖組要求黑色在最下方白色在最上方
                if(k=='HepatopancreasColor') {
                  let legendFirst = legend.filter(x=>x=='黑色');
                  let legendLast = legend.filter(x=>x=='白色');
                  let legendCenter = legend.filter(x=>x!=='黑色'&&x!=='白色');
                  this.observeChartData[num].chartData.legend = [...legendFirst,...legendCenter,...legendLast];
                }else {
                  this.observeChartData[num].chartData.legend = legend;
                }
                // this.observeChartData[num].myColors = colors;
              })
              this.observeChartData[num].chartData.xAxis = xAxis;
              this.observeChartData[num].chartData.legend.forEach(l=>{
                series.push({
                  name: l,
                  type: 'bar',
                  stack: 'stack',
                  data: new Array(),
                  itemStyle:{color:'#ccc'}
                })
              })
              datas.forEach((observe,oid)=>{
                observe[k].forEach(oitem=>{
                  series.forEach(s=>{
                    if(oitem.name_ch == s.name) {
                      if(oitem.value/observe.observation_qty) {
                        s.data[oid] = ((oitem.value/observe.observation_qty)*100).toFixed(2);
                      }else {
                        s.data[oid] = 0
                      }
                    }
                  })
                })
              })
              this.observeChartData[num].chartData.series=_.cloneDeep(series);
              this.observeChartData[num].chartData.colors = [];
              // 顏色
              if(k=='IntestinalColor'||k=='HepatopancreasColor'||k=='BodyColor') {
                if(k=='IntestinalColor') {
                  this.observeChartData[num].data.forEach(color=>{
                    if(color.name_en.toLowerCase()=='empty') {
                      this.observeChartData[num].chartData.colors.push('#ccc');
                    }else if(color.name_en.toLowerCase()=='uncertain'){
                      this.observeChartData[num].chartData.colors.push('#45d8c7');
                    }else {
                      this.observeChartData[num].chartData.colors.push(color.name_en.toLowerCase());
                    }
                  })
                }else if(k=='HepatopancreasColor') {
                  // this.observeChartData[num].data.forEach(color=>{
                  //   this.observeChartData[num].chartData.colors.push(color.name_en.toLowerCase());
                  // })

                  // 3/8養殖組要求黑色在最下方白色在最上方
                  let dataFirst = this.observeChartData[num].chartData.series.filter(x=>x.name=='黑色');
                  let dataLast = this.observeChartData[num].chartData.series.filter(x=>x.name=='白色');
                  let dataCenter = this.observeChartData[num].chartData.series.filter(x=>x.name!=='黑色'&&x.name!=='白色');
                  this.observeChartData[num].chartData.series = [];
                  this.observeChartData[num].chartData.series = [...dataFirst,...dataCenter,...dataLast];
                  let colors = [];
                  this.observeChartData[num].data.forEach(color=>{
                    // this.observeChartData[num].chartData.colors.push(color.name_en.toLowerCase());
                    if(color.name_en.toLowerCase()=='uncertain'){
                      colors.push('#45d8c7');
                    }else  {
                      colors.push(color.name_en.toLowerCase());
                    }
                    
                  })
                  let colorFirst = colors.filter(x=>x=='black');
                  let colorLast = colors.filter(x=>x=='white');
                  let colorCenter = colors.filter(x=>x!=='black'&&x!=='white');
                  this.observeChartData[num].chartData.colors = [...colorFirst,...colorCenter,...colorLast];
                }else if(k=='BodyColor') {
                  this.observeChartData[num].data.forEach(color=>{
                    if(color.name_en.toLowerCase()=='transparent') {
                      this.observeChartData[num].chartData.colors.push('#ccc')
                    }else if(color.name_en.toLowerCase()=='uncertain'){
                      this.observeChartData[num].chartData.colors.push('#45d8c7');
                    }else {
                      this.observeChartData[num].chartData.colors.push(color.name_en.toLowerCase());
                    }
                  })
                }
              }else {
                this.observeChartData[num].chartData.colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
              }
              // console.log(this.observeChartData[num].chartData.series)
              // 因原本color給定陣列方式，不會依照顏色順序，因此改每筆資料指定顏色
              this.observeChartData[num].chartData.series.forEach((s,sid)=>{
                // console.log(s,sid,num,this.observeChartData[num].chartData.colors);
                s['itemStyle']['color'] = this.observeChartData[num].chartData.colors[sid];
              })
              // console.log(this.observeChartData[num].chartData.series)
              num++;
          }
      })
      this.chartShow = true;
      this.isLoading = true;
    },
    editObservable(type,item) {
      let index;
      if(type=='edit') {
        index = this.observableData.map(e => e.shrimp_id).indexOf(item.shrimp_id);
      }
      this.showlocate = false;
      this.nowObserve = type;
      this.isOver = {
        ic: false,
        hc: false,
        mc: false,
        bc: false,
        bs: false
      }
      this.isPondId = false;
      this.isInspectedTime = false;
      if(type=='edit') {
        this.observeDialog = true;
        this.observeEdit={};
        this.observeEdit = _.cloneDeep(this.observableData[index]);
        this.observeEdit['inspected_time'] = this.$moment(new Date(this.observeEdit['inspected_time']), 'YYYY-MM-DD HH:mm');
        // this.observeEdit['pond_id'] = this.observeEdit['pond_id'].toString();
        console.log('observeEdit',this.observeEdit);
      }else {
        this.observeEdit = {
          "observation_qty": 0,
          "shell_qty": 0,
          "dead_shrimp_qty": 0,
          "shrimp_weight": null,
          "inspected_time": null,
          "feed_amount": 0,
          "pond_id": '',
          "img_a": null,
          "img_b": null,
          "img_c": null,
          "shrimps":[],
          "is_sample":false,
        }
        this.getFilter(this.observeEdit);
        this.observeDialog = true;
        this.showlocate = true;
        console.log('observeEdit',this.observeEdit)
      }
    },
    selectObserveData(evt) {
      // console.log(evt);
      this.observeEdit.pond_id = evt;
    },
    onChange(value,dateString) {
        console.log(value,dateString);
    },
    onOk(value) {
        console.log(value);
    },
    getNowDateTime() {
      return this.$moment(new Date(), 'YYYY-MM-DD HH:mm');
    },
    changeQty(){
      if(this.observeEdit.observation_qty>0) {
        if(this.observeEdit.shrimps&& this.observeEdit.shrimps.length>0) {
          this.shrimp = _.cloneDeep(this.observeEdit.shrimps);
          this.caculateShrimp();
        }
      }else {
        this.shrimp = [];
        this.observeEdit.shrimps = [];
        this.shell_qty = 0;
        this.dead_shrimp_qty = 0;
        var keyLst = Object.keys(this.optData);
        keyLst.forEach(k=>{
          if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
            this.observeEdit[k].forEach(o=>{
              o.value = 0;
            })
          }
        })
      }
      
      
    },
    changeChips() {
      // 蝦隻狀態隻數更改要清空重新給定，避免資料未刷新
      let data = _.cloneDeep(this.observeEdit);
      this.observeEdit = {};
      this.observeEdit = data;
    },
    change(item,name) {
      this.showBodyColor = false;
      var num = this.observeEdit[item].filter(x=>x.name_en==name)[0].value;
      this.observeEdit[item].forEach(i=>{
        if(i.name_en!==name) {
          i.value = parseInt(this.observeEdit.observation_qty)-parseInt(num);
        }
      })
      this.showBodyColor = true;
    },
    // 蝦隻重量個別輸入長度和重量的Dialog
    openShrimps() {
      this.shrimpDialog = true;
      this.isShrimp = false;
      this.shrimp = [];
      if(this.observeEdit.shrimps&& this.observeEdit.shrimps.length>0) {
        this.shrimp = _.cloneDeep(this.observeEdit.shrimps);
        this.caculateShrimp();
      }else {
        for(let i=0;i<this.observeEdit.observation_qty;i++) {
          this.shrimp.push({length:0,weight:0})
        }
      }
      
    },
    caculateShrimp() {
      if(this.shrimp.length<this.observeEdit.observation_qty) {
        for(let i=this.shrimp.length;i<this.observeEdit.observation_qty;i++) {
          this.shrimp.push({length:0,weight:0})
        }
      }else if(this.shrimp.length>this.observeEdit.observation_qty) {
        this.shrimp = [];
        for(let i=0;i<this.observeEdit.observation_qty;i++) {
          this.shrimp.push(this.observeEdit.shrimps[i]);
        }
        this.observeEdit.shrimps = _.cloneDeep(this.shrimp);
      }
      let num=0;
      let nowShrimp=0
      this.shrimp.forEach(s=>{
        if(s.weight>0) {
          num=num+s.weight;
          nowShrimp++;
        }
        
      })
      this.observeEdit.shrimp_weight = (((num / nowShrimp)*1000)/1000).toFixed(3);
    },
    // 蝦隻重量個別輸入長度和重量
    confirmShrimps() {
      this.isShrimp = false;
      this.shrimp.forEach(x=>{
        if(x.length==0 && x.weight==0) {
          this.isShrimp=true;
        }
      })
      if(!this.isShrimp) {
        this.observeEdit.shrimps = _.cloneDeep(this.shrimp);
        let num=0;
        let nowShrimp=0
        this.shrimp.forEach(s=>{
          if(s.weight>0) {
            num=num+s.weight;
            nowShrimp++;
          }
          
        })
        this.observeEdit.shrimp_weight = (((num / nowShrimp)*1000)/1000).toFixed(3);
        this.shrimpDialog = false;
      }else {
        // alert('長度與重量須大於0');
        document.getElementById('shrimpDialog').scrollTop = 0;
      }
      
      this.$nextTick(() => {
        this.$refs.shrimpform.reset();
      })
      
    },
    // 蝦隻狀態新增/編輯
    async observeSubmit() {
      let isError = false;
      if(!this.observeEdit.pond_id || this.observeEdit.pond_id==null) {
        this.isPondId=true;
        isError = true;
      }else {
        this.isPondId = false;
      }
      if(!this.observeEdit.inspected_time||this.observeEdit.inspected_time==null) {
        this.isInspectedTime = true;
        isError = true;
      }else {
        this.isInspectedTime = false;
      }
      let parm = _.cloneDeep(this.observeEdit);
      // 計算是否超過觀察網隻數
      let num = {ic: 0,hc: 0,mc: 0,bc: 0,bs: 0}
      this.isOver = {ic: false,hc: false,mc: false,bc: false,bs: false}
      var keyLst = Object.keys(this.optData);
      keyLst.forEach(k=>{
        if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
          parm[k] = {};
          this.observeEdit[k].forEach(o=>{
            parm[k][o.name_en] = o.value;
            if(k=='BodyColor') {
              num.bc+=parseInt(o.value);
            }else if(k=='BodyShape') {
              num.bs+=parseInt(o.value);
            }else if(k=='HepatopancreasColor') {
              num.hc+=parseInt(o.value);
            }else if(k=='IntestinalColor') {
              num.ic+=parseInt(o.value);
            }else if(k=='MuscleColor') {
              num.mc+=parseInt(o.value);
            }
          })
          console.log('num',num,parm.observation_qty)
          
        }
      })
      if(!parm.is_sample&&num.bc!==parm.observation_qty) {
        this.isOver.bc = true;
        isError = true;
      }
      if(!parm.is_sample&&num.bs!==parm.observation_qty) {
        this.isOver.bs = true;
        isError = true;
      }
      if(!parm.is_sample&&num.hc!==parm.observation_qty) {
        this.isOver.hc = true;
        isError = true;
      }
      if(!parm.is_sample&&num.ic!==parm.observation_qty) {
        this.isOver.ic = true;
        isError = true;
      }
      if(!parm.is_sample&&num.mc!==parm.observation_qty) {
        this.isOver.mc = true;
        isError = true;
      }
      
      if(!isError) {
        this.dialogLoading = false;
        // 回傳資料整合
        delete parm.img;
        delete parm.feed_amount;
        delete parm.numOfColor;
        if(this.nowObserve=='edit') {
          delete parm.shrimp_id;
          delete parm.leftover_id;
        }
        parm.pond_id = parseInt(parm.pond_id);
        if(this.nowObserve=='edit') {
          parm.updated_user = this.$auth.$state.user.email;
          delete parm.created_user;
        }else {
          parm.created_user = this.$auth.$state.user.email;
        }
        
        parm.inspected_time = dayjs(parm.inspected_time).format("YYYY-MM-DD HH:mm:ss");
        let formData = new FormData();
        console.log('submit',parm)
        Object.keys(parm).forEach(x=>{
          if(x=='BodyColor'||x=='BodyShape'||x=='HepatopancreasColor'||x=='IntestinalColor'||x=='MuscleColor'||x=='shrimps') {
            formData.append(x,JSON.stringify(parm[x]));
          }else {
            formData.append(x,parm[x]);
          }
          
        })
        let config = { headers: { "Content-Type": "multipart/form-data" } };
        var res = false;
        res = this.nowObserve=='add'?await this.postObservationRecordList(formData):
          await this.patchObservationRecordList(formData,this.observeEdit.shrimp_id);
        setTimeout(()=>{
            if(res) {
              if(this.nowObserve=='add') {
                if(this.observeEdit.feed_amount!==null&&this.observeEdit.feed_amount!=='') { 
                  this.postObservable(this.observeEdit);
                }else {
                  this.observeDialog = false;
                  this.getObservationData();
                  this.$toast.success("成功", { duration: 2000 });
                }
              }else{
                let observe = this.observableData.filter(x=>x.shrimp_id==this.observeEdit.shrimp_id)[0];
                if(observe.feed_amount!==this.observeEdit.feed_amount) {
                  if(observe.feed_amount!==0&&(observe.feed_amount==null||observe.feed_amount=='')) {
                    if((this.observeEdit.feed_amount!==null && this.observeEdit.feed_amount!== '')) {
                      this.nowObserve = 'add';
                      this.postObservable(this.observeEdit);
                    }
                  }else {
                    if(this.observeEdit.feed_amount==null||this.observeEdit.feed_amount=='') {
                      this.deleteObservable(this.observeEdit.leftover_id);
                    }else {
                      this.postObservable(this.observeEdit);
                    }
                    
                  }
                  
                }else {
                  this.observeDialog = false;
                  this.getObservationData();
                }
              }
            }
            this.dialogLoading = true;
        },50)
        
        // let url =`${this.nowObserve=='add'?this.$store.state.mydata.gobal_api.apiUrl+'/shrimp-record/'
        //             :this.$store.state.mydata.gobal_api.apiUrl+'/shrimp-record/'+this.observeEdit.shrimp_id+'/'}`;
        // if(this.nowObserve=='add') {
        //   await this.$axios.post(url, formData,config)
        //   .then(res => {
        //       if(res.data=='新增成功'){
        //         // this.observeDialog = false;
        //         // this.getObservationData();
        //         // this.$toast.success("新增成功", { duration: 2000 });
        //         if(this.observeEdit.feed_amount!==null) { 
        //           this.postObservable(this.observeEdit);
        //         }else {
        //           this.observeDialog = false;
        //           this.getObservationData();
        //           this.$toast.success("成功", { duration: 2000 });
        //         }
                
        //       }else{
        //           this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
        //       }

        //       console.log("新增API:" + res.request.responseURL);
        //   })
        //   .catch(error => {
        //       this.$toast.error("error:" + error, { duration: 2000 });
        //   })
        //   .finally(() => {
        //   });
        // }else {
        //   await this.$axios.patch(url, formData,config)
        //   .then(res => {
        //       if(res.data=='修改成功'){
        //         // this.observeDialog = false;
        //         // this.getObservationData();
        //         // this.$toast.success("新增成功", { duration: 2000 });
        //         let observe = this.observableData.filter(x=>x.shrimp_id==this.observeEdit.shrimp_id)[0]
        //         if(observe.feed_amount!==this.observeEdit.feed_amount) {
        //           if(this.observeEdit.feed_amount!==null && this.observeEdit.feed_amount!== '') {
        //             this.nowObserve = 'add';
        //             this.postObservable(this.observeEdit);
        //           }else {
        //             this.deleteObservable(this.observeEdit.leftover_id);
        //           }
                  
        //         }else {
        //           this.observeDialog = false;
        //           this.getObservationData();
        //         }
                
        //       }else{
        //           this.$toast.error("修改失敗:" + res.data, { duration: 2000 });
        //       }

        //       console.log("修改API:" + res.request.responseURL);
        //   })
        //   .catch(error => {
        //       this.$toast.error("error:" + error, { duration: 2000 });
        //   })
        //   .finally(() => {
        //   });
        // }
      }else {
        alert('請再次檢查是否有數值輸入錯誤')
      }
      
    },
    // 殘餌量新增/編輯
    async postObservable(observeItem) {
      console.log('nowObserve',this.nowObserve);
      let parm = {
        feed_amount:parseFloat(observeItem.feed_amount),
        inspected_time:dayjs(observeItem.inspected_time).format("YYYY-MM-DD HH:mm:ss"),
        pond_id: parseInt(observeItem.pond_id),
        // created_user: this.$auth.$state.user.email
      }
      if(this.nowObserve=='add') {
        parm.created_user = this.$auth.$state.user.email;
      }else {
        parm.updated_user = this.$auth.$state.user.email
      }
      let url =`${this.nowObserve=='add'?this.$store.state.mydata.gobal_api.apiUrl+'/leftover-record/'
                    :this.$store.state.mydata.gobal_api.apiUrl+'/leftover-record/'+this.observeEdit.leftover_id+'/'}`;
      var res = false;
      res = this.nowObserve=='add'?await this.postLeftoverRecordList(parm):await this.patchLeftoverRecordList(parm,this.observeEdit.leftover_id);
      setTimeout(()=>{
        this.observeDialog = false;
        this.getObservationData();
      },50)
      // if(this.nowObserve=='add') {
      //   parm.created_user = this.$auth.$state.user.email;
      //   await this.$axios.post(url,parm)
      //   .then(res => {
      //       if(res.data=='新增成功'){
      //         this.observeDialog = false;
      //         this.getObservationData();
      //         this.$toast.success("成功", { duration: 2000 });
      //       }else{
      //         this.observeDialog = false;
      //         this.getObservationData();
      //         this.$toast.error("新增觀察網殘餌失敗:" + res.data, { duration: 2000 });
      //       }

      //       console.log("新增觀察網殘餌API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //       this.$toast.error("error:" + error, { duration: 2000 });
      //   })
      //   .finally(() => {
      //   });
      // }else {
      //   parm.updated_user = this.$auth.$state.user.email
      //   await this.$axios.patch(url,parm)
      //   .then(res => {
      //       if(res.data=='修改成功'){
      //         this.observeDialog = false;
      //         this.getObservationData();
      //         this.$toast.success("成功", { duration: 2000 });
      //       }else{
      //         this.observeDialog = false;
      //         this.getObservationData();
      //         this.$toast.error("修改觀察網殘餌失敗:" + res.data, { duration: 2000 });
      //       }

      //       console.log("修改觀察網殘餌API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //       this.$toast.error("error:" + error, { duration: 2000 });
      //   })
      //   .finally(() => {
      //   });
      // }
      
    },
    // 蝦隻狀態刪除
    async delObservable(item) {
      if (confirm(`確認刪除此觀察網紀錄?`)) {
        var res = false;
        let index = this.observableData.map(e => e.shrimp_id).indexOf(item.shrimp_id);
        res = await this.deleteObservationRecordList(this.observableData[index].shrimp_id);
        setTimeout(()=>{
            if(res) {
              if(this.observableData[index].leftover_id==null) {
                this.getObservationData();
              }else {
                this.deleteObservable(this.observableData[index].leftover_id);
              }
            }
        },50)
        // let url =`${this.$store.state.mydata.gobal_api.apiUrl+'/shrimp-record/'+this.observableData[index].shrimp_id+'/'}`;
        // await this.$axios.delete(url)
        //   .then(res => {
        //     if(res.data=='刪除成功'){
        //       if(this.observableData[index].leftover_id==null) {
        //         this.getObservationData();
        //       }else {
        //         this.deleteObservable(this.observableData[index].leftover_id);
        //       }
              
        //     }else{
        //         this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
        //     }

        //     console.log("修改API:" + res.request.responseURL);
        // })
        // .catch(error => {
        //     this.$toast.error("error:" + error, { duration: 2000 });
        // })
        // .finally(() => {
        // });
      }
    
    },
    // 殘餌量刪除
    async deleteObservable(id) {
      var res = false;
      res = await this.deleteLeftoverRecordList(id);
      setTimeout(()=>{
          if(res) {
            this.observeDialog = false;
            this.getObservationData();
          }
      },50)
      // let url =`${this.$store.state.mydata.gobal_api.apiUrl+'/leftover-record/'+id+'/'}`;
      //   await this.$axios.delete(url)
      //     .then(res => {
      //       if(res.data=='刪除成功'){
      //         this.observeDialog = false;
      //         this.getObservationData();
      //         this.$toast.success("成功", { duration: 2000 });
      //       }else{
      //           this.$toast.error("失敗:" + res.data, { duration: 2000 });
      //       }

      //       console.log("修改API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //       this.$toast.error("error:" + error, { duration: 2000 });
      //   })
      //   .finally(() => {
      //   });
    },
  },
  watch: {
    nowTab() {
      // console.log('tab change',this.nowTab,this.item);
      // 圖表不知為何第一次搜尋會無法顯示，因此設定一個時間重新帶入item資料
      if(this.nowTab == '圖表') {
        let data = _.cloneDeep(this.item);
        this.item = {};
        setTimeout(()=>{this.item = data},500)

      }else if(this.nowTab=='打樣資訊') {
        // if(this.observableData.length>0) {
        //   this.listOpen = false;
        // }else {
        //   this.listOpen = true;
        // }
        // this.isLoading = false;
        this.listOpen = true;
        
      }
    },
    windowWidth:function(){
        return window.innerWidth;
    },
  },
  mounted() {
    //監控視窗
    window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth;
    });

  },
};
</script>

<style lang="scss" scoped>
.v-application.v-application--is-ltr {
  .v-card.bg-card {
    min-height: 84vh;
    overflow: hidden;
    margin-bottom: 24px;
    * {
      color: $color-dark;
    }
    button.v-icon, button.v-btn--icon .v-icon {
      color: $color-primary;
    }
    .red--text {
      color: $color-accent !important;
    }
    .card-title,.content {
      padding: 12px 24px;
      .row {
        margin-left: 0;
        margin-top: 0;
        margin-bottom: 24px;
      }
      .title {
        @include flexAlignCenter();
        .theme--light.v-icon {
          color: $color-form;
        }
      }
    }
    .card-title {
     padding-bottom: 0;
    }
    .v-card__title {
      color: #00273E;
      font-weight: bold;
    }
    .content {
      padding: 12px;
      .row {
        align-items: center;
        .v-input {
          margin-top: 0;
          padding-top: 0;
          &.primary {
            background-color: transparent !important;;
          }
        }
        .theme--light.v-btn.v-btn--disabled .v-icon {
          color: $color-dark-25 !important;
        }
        .theme--light.v-btn.v-btn--disabled .v-btn__loading,.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
          background-color: $color-dark-25 !important;
        }
      }
    }
    .search {
      margin-bottom: 12px;
      .caculate {
        max-width: calc((100%  / 3) - (100% / 12) / 3 );
      }
      .caculate-8 {
        max-width: calc((100% / 12 * 8) - ((100% / 12) / 1.5));
      }
    }
    .v-sheet.result-card.v-card:not(.v-sheet--outlined) {
      box-shadow: 0 0 10px $color-black-10;
    }
  }
  .result-content {
    width: 100%;
    min-height: 50vh;
  }
}
.pool-name {
  color: $color-dark;
  padding-left: 4px;
  font-weight: bold;
}
::v-deep {
  .select-color{
    &.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
      border-color: $color-form;
    }
    & .theme--light.v-input input, &.theme--light.v-input textarea,& .theme--light.v-label {
      color: #00273E;
    }
    & .theme--light.v-label.v-label--active {
      color: $color-form;
    }
    & .v-icon.v-icon {
      color: $color-form;
    }
    & .v-select__selection--comma,.theme--light.v-select .v-select__selections {
      color: #00273E;
    }
    & .v-select__slot {
      border-color: $color-form;
    }
  }
  .edit-table {
    & table {
      min-height: 27vh; 
    }
    &.revise table {
      min-height: 21vh;
    }
    input[type="checkbox"] {
      accent-color: $color-primary;
    }
    .v-input--selection-controls.v-input--is-disabled:not(.v-input--indeterminate) .v-icon {
      color: $color-dark-25;
    }
  }
  .edit-disabled {
    &.theme--light.v-text-field.v-input--is-disabled .v-input__slot::before {
      border-image: none;
      border: none;
    }
    &.theme--light.v-text-field--filled > .v-input__control > .v-input__slot,&.theme--light.v-text-field--filled:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot:hover {
      background: $color-dark-25;
      color: $color-dark-50;
    }
    &.v-text-field .v-input__slot {
      border-radius: 4px;
    }
  }
  .theme--light.v-data-table.v-data-table--fixed-header thead th {
    background: transparent;
  }
  .v-chip.add-chip.v-size--default {
    font-size: 12px;
    height: 24px;
    padding: 0 8px;
    background: $color-primary;
    color: #fff !important;
  }
  .v-chip.v-size--default {
      cursor: pointer;
      font-size: 12px;
      height: 20px;
      padding: 0 8px;
      background: rgba($color-dark-50,0.8);
      color: #fff !important;
  }
  .v-chip.chips-value.v-size--default {
      background: $color-primary-75;
      // background: rgba($color-accent,0.35);
      // color: $color-dark;
  }
  
  .shrimp-error {
    .el-input__inner {
      border-color: red;
    }
    
  }
  .checkbox .theme--light.v-label {
    color: $color-dark;
  }
}

@media (max-width: 768px) {
  .v-application.v-application--is-ltr {
    .v-card.indicator {
      .search {
        margin-bottom: 24px;
        .caculate {
          max-width: 100%;
        }
      }
    }
  }
}
// scrollbar
::-webkit-scrollbar {
  @include size(6px);
}
::-webkit-scrollbar-track {
  background: none !important; 
}
::-webkit-scrollbar-thumb {
  background-color: $color-primary-25 !important;
}     
      
// div /deep/ .el-input__inner{
//   border-radius:0px !important;
// }
</style>
