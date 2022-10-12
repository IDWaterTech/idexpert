<template>
  <div>
    <!-- <v-card elevation="1" outlined tile min-height="200"> -->
    <v-row no-gutters justify="center">
      <!-- 警示區 -->
      <v-col cols="12" sm="12" style="border:0px dashed red;" class="py-1">
        <v-card min-height="100px" elevation="3" tile dark color="primary">
          <v-card-title class="py-0 ">
            警示區<span style="font-size: 0.8em;color:darkred;"
              >(24小時內且目前有啟用警示項目最新一列資料)</span
            >
            <v-spacer></v-spacer>
            <span class="subtitle-3"
              >警示資料時間：{{
                warnDataDt.length == 0 ? "0000-00-00 00:00:00" : ""
              }}{{ warnDataDt }}</span
            >
            <v-btn
              :loading="warnLoading"
              :disabled="!poolid || warnLoading"
              class="ma-2 white--text"
              icon
              @click="getwarnData"
            >
              <v-icon dark>
                mdi-reload
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-sheet
              class="overflow-y-auto mainbg"
              min-height="100px"
              max-height="100"
              v-if="warnData.length != 0"
            >
              <v-card-text>
                <!-- <v-chip-group column dark> -->
                <!-- @click="showwarning(item)" 拿掉處理的視窗-->
                <v-chip
                  class="mr-1"
                  v-for="item in warnData"
                  :key="item.id"
                  :color="
                    item.warning_level.toLowerCase() == 'critical'
                      ? `red`
                      : `orange`
                  "
                  >{{
                    `${item.inspected_time.match(/[^\s]*$/)[0]}-[等級：${
                      item.warning_level
                    }]：${item.warning_content}`
                  }}
                </v-chip>
                <!-- </v-chip-group> -->
              </v-card-text>
            </v-sheet>
            <div class="text-center my-5" v-if="warnData.length == 0">
              <h2>查無資料</h2>
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
              <v-card-title
                >警示等級：「{{ warnDataSel.warning_level }}」</v-card-title
              >
              <v-divider></v-divider>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12"
                    >警示時間：{{ warnDataSel.inspected_time }}</v-col
                  >
                  <v-col cols="12"
                    >警示內容：{{ warnDataSel.warning_content }}</v-col
                  >
                  <v-col cols="12"
                    >警示來源(資料/設備 層面)：{{
                      warnDataSel.warning_resource
                    }}</v-col
                  >
                  <v-col cols="12"
                    >警示建立者：{{ warnDataSel.created_user }}</v-col
                  >
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      dense
                      v-model="warnDataSel.maintenance_user"
                      clearable
                      filled
                      :rules="rules.require"
                    >
                      <span
                        style="width:100px;"
                        slot="prepend"
                        @click="
                          warnDataSel.maintenance_user = $auth.$state.user.name
                        "
                        ><v-tooltip bottom
                          ><template v-slot:activator="{ on, attrs }"
                            ><span
                              v-bind="attrs"
                              v-on="on"
                              style="color:darkblue;"
                              >最後處理人員</span
                            ></template
                          ><span>點擊可直接帶入登入者姓名</span></v-tooltip
                        ></span
                      ></v-text-field
                    >
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      dense
                      v-model="warnDataSel.warning_reason"
                      clearable
                      filled
                      :rules="rules.require"
                      ><span style="width:100px;" slot="prepend"
                        >判定原因</span
                      ></v-text-field
                    >
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      clearable
                      filled
                      v-model="warnDataSel.handling_method"
                      auto-grow
                      row="2"
                      row-height="20"
                      clear-icon="mdi-close-circle"
                      :rules="rules.require"
                      ><span style="width:100px;" slot="prepend"
                        >處理方式</span
                      ></v-textarea
                    >
                    <!-- <v-text-field dense clearable
                    ><span style="width:100px;" slot="prepend" 
                      >處理方式</span
                    ></v-text-field
                  > -->
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions
                ><v-spacer></v-spacer
                ><v-btn color="primary" @click="warnsubmit(false)" tile
                  >暫存</v-btn
                ></v-card-actions
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-switch
                  v-model="warnDataSel.is_add_to_event_log"
                  :label="`結案時一併加入重要紀事`"
                  dense
                  color="error"
                ></v-switch>
                <v-btn color="error" @click="warnsubmit(true)" tile>結案</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-col>
      <!-- 主功能：查詢、新增循環 功能按鈕 -->
      <v-col cols="12" sm="2">
        <v-row class="mx-3">
          <!-- 養殖池 -->
          <v-col cols="12" sm="12" class="text-center my-5">
            <!-- <div class="circle">
          <span class="circletitle">{{ poolName }}</span>
        </div> -->
            <!-- <span class="circletitle headline my-5 text-center">{{
          poolName
        }}</span> -->
            <!-- {{getNodeName(maindata,poolid)}} -->
            <treeselect
              v-model="poolid"
              :options="maindata"
              :default-expand-level="1"
              placeholder="養殖池"
              :disable-branch-nodes="true"
              children="node"
              :normalizer="
                node => {
                  return { children: node.node };
                }
              "
              @input="mainchange"
              style="font-size:1.2em;"
            >
              <div slot="value-label" slot-scope="{ node }">
                {{ `${node.raw.parent}_${node.raw.name}` }}
              </div>
              <div slot="option-label" slot-scope="{ node }">
                {{ `${node.raw.name}` }}
              </div>
            </treeselect>
          </v-col>
          <!-- 選擇起日 -->
          <v-col cols="12">
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
                  v-model="started_date"
                  label="選擇起日"
                  prepend-icon="mdi-calendar"
                  readonly
                  dark
                  dense
                  v-bind="attrs"
                  v-on="on"
                  @click:prepend="() => (started_date = getNowDate())"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="started_date"
                no-title locale="zh-tw"
                @input="menu_startdate = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <!-- 選擇訖日 -->
          <v-col cols="12" sm="12">
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
                  v-model="ended_date"
                  label="選擇訖日"
                  prepend-icon="mdi-calendar"
                  readonly
                  dark
                  dense
                  v-bind="attrs"
                  v-on="on"
                  @click:prepend="() => (ended_date = getNowDate())"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="ended_date"
                no-title locale="zh-tw"
                @input="menu_enddate = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <!-- 按鈕 -->
          <v-col cols="12" sm="12">
            <v-btn tile class="mt-2" color="primary" @click="getCircleData" block
              >查詢</v-btn
            >
            <v-btn color="primary" tile class="mt-2" @click="showadd" block
              ><v-icon>mdi-plus</v-icon>新增循環</v-btn
            >
            <v-dialog v-model="addDialog" max-width="500px">
              <v-form v-model="addvalid" ref="cycleform">
                <v-card>
                  <v-card-title>新增-養殖循環</v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="addparm.name"
                      label="名稱/批號"
                      :rules="rules.require"
                      autocomplete="off"
                    ></v-text-field>
                    <v-menu
                      v-model="menu_adddate"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="addparm.started_date"
                          label="選擇起日"
                          :rules="rules.require"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          @click:prepend="
                            () => (addparm.started_date = getNowDate())
                          "
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="addparm.started_date"
                        no-title locale="zh-tw"
                        @input="menu_adddate = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-card-text>
                  <v-card-text>
                    <v-row align="center">
                      <!-- 體積 -->
                      <v-col cols="3">
                        <v-text-field
                          v-model="add_volume"
                          label="體積(水量)"
                          type="number"
                          disabled
                          background-color="blue-grey lighten-4"
                          autocomplete="off"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="1" class="text-center">X</v-col>
                      <!-- 密度 -->
                      <v-col cols="3">
                        <v-text-field
                          v-model.number="addparm.num_per_unit"
                          label="密度"
                          type="number"
                          :rules="rules.require"
                          @change="
                            () => {
                              addparm.estimated_num =
                                add_volume * addparm.num_per_unit;
                            }
                          "
                          autocomplete="off"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="1" class="text-center">=</v-col>
                      <!-- 初始放苗量(估計) -->
                      <v-col cols="4">
                        <v-text-field
                          v-model="addparm.estimated_num"
                          label="初始放苗量(估計)"
                          type="number"
                          :rules="rules.require"
                          disabled
                          background-color="blue-grey lighten-4"
                          autocomplete="off"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-select v-model="addparm.seedling_id" dense filled :items="SeedlingData" item-value="id" item-text="name_ch" clearable :rules="rules.require">
                          <span slot="prepend" style="width:80px">選擇種苗</span>
                        </v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete v-model="addparm.person_in_charge" dense filled :items="accdata" item-value="username" :filter="filterincharge" clearable :rules="rules.require">
                          <span slot="prepend" style="width:80px">養殖負責</span>
                          <span slot="selection" slot-scope="data">{{data.item.position}}-{{data.item.account_name}}</span>
                          <span slot="item" slot-scope="data">{{data.item.position}}-{{data.item.account_name}}</span>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-row>
                          <v-col cols="6">
                            <v-text-field filled dense type="number" v-model.number="addparm.estimated_harvest_catty"><span slot="prepend" style="width:80px">預計收成斤數(kg)(選)</span></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field filled dense type="number" v-model.number="addparm.estimated_survival_rate"><span slot="prepend" style="width:80px">預計存活率(%)(選)</span></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12">
                            <v-text-field filled dense v-model="addparm.remark"><span slot="prepend" style="width:80px">備註(選)</span></v-text-field>
                          </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn tile color="primary" @click="submitadd">確認</v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" sm="10">
        <v-row>
          <!-- 數據(24H) -->
          <v-col cols="12" sm="12" style="min-height:500px;">
            <v-card min-height="500px" elevation="3" tile dark color="primary">
              <v-card-title class="py-2">
                數據(24H)
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-tabs v-model="currentItem" background-color="cardtitle">
                  <v-tab
                    v-for="(item, index) in tabitems"
                    :key="index"
                    :href="'#tab-' + item"
                    class="cardtitle"
                  >
                    {{ item }}
                  </v-tab>
                  <v-tabs-items v-model="currentItem" class="primary">
                    <v-tab-item :value="'tab-' + tabitems[0]">
                      <v-overlay :value="detectloading" :absolute="true">
                        <v-progress-circular
                          indeterminate
                          size="64"
                        ></v-progress-circular>
                      </v-overlay>
                      <v-row>
                        <v-col cols="12">
                          <div
                            class="text-center mt-5"
                            v-if="detectData.length == 0"
                          >
                            <h2>查無資料</h2>
                          </div>
                          <v-slide-group
                            v-model="slidemodel"
                            :show-arrows="'always'"
                          >
                            <v-slide-item
                              v-for="(item, index) in detectData"
                              :key="index"
                              v-slot="{ active, toggle }"
                            >
                              <v-card
                                elevation="3"
                                class="mx-2 my-2 text-center"
                                @click="toggle"
                                :min-width="150"
                                :max-width="200"
                              >
                                <v-card-title class="justify-center">
                                  {{ item.name_ch }}<br />
                                  {{ item.value }}
                                </v-card-title>
                                <div style="height:120px;" class="px-2">
                                  <!-- 車速圖 -->
                                  <vue-speedometer
                                    :value="parseFloat(item.value)"
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
                                    :segmentColors="[
                                      '#F197B3',
                                      '#FFEC8B',
                                      '#89E0B6',
                                      '#FFEC8B',
                                      '#F197B3'
                                    ]"
                                    :needleTransitionDuration="3333"
                                    needleTransition="easeElastic"
                                    :ringWidth="20"
                                    :width="180"
                                    :forceRender="true"
                                    v-if="
                                      item.name_en != 'water_level_percentage'
                                    "
                                  ></vue-speedometer>
                                  <!-- 水球圖 -->
                                  <v-card-text
                                    v-if="
                                      item.name_en == 'water_level_percentage'
                                    "
                                  >
                                    <waterball
                                      :value="parseFloat(item.value) / 100"
                                    ></waterball>
                                  </v-card-text>
                                </div>
                                <v-divider></v-divider>
                                <v-card-subtitle class=" py-2 px-2">
                                  共：{{ item.rows }}筆
                                  <span
                                    v-if="
                                      item.name_en == 'water_level_percentage'
                                    "
                                  >
                                    <br />{{ `警戒上限：${item.critical_max}%`
                                    }}<br />
                                    {{ `警戒下限：${item.critical_min}%` }}
                                    <br />{{ item.last_time }}</span
                                  >

                                  <!--限水位才有資料 -->
                                </v-card-subtitle>
                                <v-scale-transition>
                                  <v-icon
                                    v-if="active"
                                    color="blue"
                                    size="48"
                                    v-text="'mdi-close-circle-outline'"
                                  ></v-icon>
                                </v-scale-transition>
                              </v-card>
                            </v-slide-item>
                          </v-slide-group>
                        </v-col>
                        <v-spacer></v-spacer>
                      </v-row>
                    </v-tab-item>
                    <!-- 計算數據 -->
                    <v-tab-item :value="'tab-' + tabitems[1]">
                      <v-row>
                        <v-col class="text-center mt-5"><h2>建置中</h2></v-col>
                      </v-row>
                    </v-tab-item>
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
          <!-- 折線圖 -->
          <v-col cols="12" sm="12" style="min-height:200px;">
            <v-card min-height="500px" elevation="3" tile dark color="primary">
              <v-card-title class="py-2">
                數據圖
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
                <v-row>
                  <!-- 選擇起日 -->
                  <v-col cols="12" sm="2">
                    <v-menu
                      v-model="menu_chart_startdate"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="chart_started_date"
                          label="選擇起日"
                          prepend-icon="mdi-calendar"
                          readonly
                          dark
                          dense
                          v-bind="attrs"
                          v-on="on"
                          @click:prepend="
                            () => (chart_started_date = getNowDate())
                          "
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="chart_started_date" locale="zh-tw" no-title
                        @input="menu_startdate = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- 選擇訖日 -->
                  <v-col cols="12" sm="2">
                    <v-menu
                      v-model="menu_chart_enddate"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="chart_ended_date"
                          label="選擇訖日"
                          prepend-icon="mdi-calendar"
                          readonly
                          dark
                          dense
                          v-bind="attrs"
                          v-on="on"
                          @click:prepend="
                            () => (chart_ended_date = getNowDate())
                          "
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="chart_ended_date"
                        no-title locale="zh-tw"
                        @input="menu_chart_enddate = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- 指定項目 -->
                  <v-col cols="12" sm="2">
                    <v-autocomplete
                      v-model="defitem"
                      :items="waterdatacols"
                      no-data-text="查無資料"
                      placeholder="指定項目"
                      clearable
                      dark
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <!-- 確認鈕 -->
                  <v-col cols="12" md="1">
                    <v-btn
                      tile
                      dark
                      color="cardtitle"
                      @click="getdata"
                      :disabled="
                        poolid &&
                        defitem &&
                        defitem != undefined &&
                        defitem.length > 0
                          ? false
                          : true
                      "
                      >確認</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-actions>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    顯示最小值：<el-input-number
                      v-model="chartmin"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                    顯示最大值：<el-input-number
                      v-model="chartmax"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                    <WaterQuality_Vcharts
                      :rowsData="item.items"
                      xColName="inspected_date"
                      :defaultitem="{}"
                      :loading="waterloading"
                      :title="item.name"
                      :chartmin="chartmin"
                      :chartmax="chartmax"
                      :markdata="markdata"
                    ></WaterQuality_Vcharts>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- 循環表格 -->
          <v-col cols="12" sm="8" class="py-0 pr-2">
            <el-table
              ref="circletable"
              style="width:100%"
              :data="circleData"
              highlight-current-row
              @current-change="handleCurrentChange"
              :header-cell-style="tableHeaderStyle"
              height="300"
              class="primary"
              @select="handleSelectionChange"
              :header-cell-name="cellClass"
            >
              <!-- 循環起日 -->
              <el-table-column
                label="循環起日"
                prop="started_date"
                align="center"
              ></el-table-column>
              <!-- 循環訖日 -->
              <el-table-column
                label="循環訖日"
                prop="ended_date"
                align="center"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{
                    scope.row.ended_date == null || scope.row.ended_date == ""
                      ? `執行中`
                      : scope.row.ended_date
                  }}</span>
                </template>
              </el-table-column>
              <!-- 養殖天數 -->
              <el-table-column
                label="養殖天數"
                prop="days"
                align="center"
              ></el-table-column>
              <!-- 名稱/批號 -->
              <el-table-column
                label="名稱/批號"
                prop="name"
                align="center"
              ></el-table-column>
              <!-- 養殖密度 -->
              <el-table-column
                label="養殖密度"
                prop="num_per_unit"
                align="center"
              ></el-table-column>
              <!-- 預估放養隻數 -->
              <el-table-column
                label="預估放養隻數"
                prop="total"
                align="center"
              ></el-table-column>
              <el-table-column label="養殖負責" prop="person_in_charge" align="center">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="80">
                <template slot-scope="scope">
                  <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
                  <v-btn
                    color="primary"
                    outlined
                    small
                    @click="delcircle(scope.row)"
                    :disabled="scope.row.ended_date != null"
                    >刪除</v-btn
                  >
                </template>
              </el-table-column>
            </el-table>
          </v-col>
          <!--觀察網(蝦況) -->
          <v-col cols="12" sm="4" class="py-0 pl-0">
            <v-card min-height="300px" elevation="3" tile dark color="primary">
              <v-card-title class="py-2 cardtitle">
                觀察網(蝦況)
                <v-spacer></v-spacer>
                <v-icon @click="showdialog_imgdialog" :disabled="!poolid"
                  >mdi-image-plus</v-icon
                >
              </v-card-title>
              <v-divider></v-divider>
              <v-card-title>
                <div v-if="shirimpData.length > 0">
                  <v-row>
                    <v-col
                      cols="12"
                      lg="6"
                      v-for="(item, index) in shirimpData[0].item"
                      :key="index"
                      class="py-1"
                    >
                      <v-btn
                        block
                        color="#64B5F6"
                        outlined
                        style="font-size:0.8em;"
                      >
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
                      <img
                        v-img
                        :src="shirimpData[0].image_url"
                        v-if="shirimpData[0].image_url"
                        width="100%"
                        height="300px"
                      />
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
                  <v-card-title>觀察網(蝦況)</v-card-title
                  ><v-divider></v-divider>
                  <v-card-text>
                    <!-- 日期時間 -->
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-menu
                          v-model="menu_imgdate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="imgdata.imgdate"
                              label="選擇日期(必選)"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              :rules="rules.require"
                              @click:prepend="
                                () => (imgdata.imgdate = getNowDate())
                              "
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="imgdata.imgdate" locale="zh-tw" no-title
                            @input="menu_imgdate = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="時間(必選)"
                          v-model="imgdata.imgtime"
                          value=""
                          type="time"
                          prepend-icon="mdi-timeline-clock-outline"
                          @click:prepend="
                            () => (imgdata.imgtime = getNowTime())
                          "
                          :rules="rules.require"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-file-input
                      v-model="imgfiles"
                      :rules="rules.filesize"
                      accept="image/*"
                      show-size
                      placeholder="請選擇欲上傳圖片檔"
                      prepend-icon="mdi-camera"
                      label="蝦況圖片(必選)"
                      @change="chgimgurl"
                    ></v-file-input>
                    <img
                      v-img
                      :key="imgurlkey"
                      :src="showimgurl"
                      v-if="showimgurl !== ''"
                      width="100%"
                    />
                    <!-- <v-img v-img :key="imgurlkey" :src="showimgurl" v-if="showimgurl!==''" width="100%"></v-img> -->
                  </v-card-text>
                  <v-card-text>
                    <div v-for="(item, index) in imgdata.item" :key="index">
                      <v-row>
                        <v-col cols="12" sm="6">
                          {{ item.name }}
                        </v-col>
                        <v-col cols="12" sm="6">
                          <el-input-number
                            :id="item.name"
                            :ref="item.name"
                            class="ml-2"
                            v-model="
                              imgdata.item.filter(x => x.name == item.name)[0]
                                .value
                            "
                            size="mini"
                            :precision="2"
                            :step="1"
                            :min="num_min"
                            :max="num_max"
                          ></el-input-number>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      tile
                      color="primary"
                      @click="submit_imgdialog"
                      :disabled="false"
                      >上傳</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- 事件紀錄 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="3" tile dark class="primary">
          <v-card-title class="py-2 "
            >事件紀錄
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="mx-3"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="geteventData"
                  :disabled="!poolid || !cirid"
                >
                  mdi-reload
                </v-icon>
              </template>
              <span>立即重新取得事件紀錄</span>
            </v-tooltip>
          </v-card-title>

          <v-divider></v-divider>
          <v-card-title>
            <v-btn
              class="info"
              tile
              :disabled="!poolid || !cirid"
              @click="showlogDialog"
              >新增紀錄<v-icon>mdi-plus</v-icon></v-btn
            >
            <v-dialog v-model="logDialog" max-width="500px">
              <v-form ref="logform" v-model="logvalid" lazy-validation>
                <v-card>
                  <v-card-title>新增紀錄</v-card-title>
                  <v-card-text>
                    <v-row>
                      <!-- 事件類型 -->
                      <v-col cols="12">
                        {{ logData.event_category_id }}
                        <v-autocomplete
                          v-model="logData.event_category_id"
                          :items="eventCategory"
                          item-text="name_ch"
                          item-value="id"
                          dense
                          filled
                          clearable
                          :rules="rules.require"
                          ><span style="width:80px;" slot="prepend"
                            >事件類型</span
                          ></v-autocomplete
                        >
                      </v-col>
                      <!-- 標題 -->
                      <v-col cols="12">
                        <v-text-field
                          autocomplete="off"
                          v-model="logData.title"
                          :rules="rules.require"
                          clearable
                          filled
                          dense
                        >
                          <span style="width:80px;" slot="prepend">標題</span>
                        </v-text-field>
                      </v-col>
                      <!-- 內容 -->
                      <v-col cols="12">
                        <v-textarea
                          autocomplete="off"
                          v-model="logData.content"
                          :rules="rules.require"
                          clearable
                          filled
                          dense
                          auto-grow
                          row="2"
                          row-height="20"
                        >
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
            <el-table
              ref="eventtable"
              style="width:100%"
              :data="eventData"
              class="primary"
              :header-cell-style="tableHeaderStyle"
              height="250"
            >
              <template slot="empty">
                <span
                  ><v-btn
                    tile
                    color="info0"
                    @click="geteventData"
                    :disabled="!poolid || !cirid"
                    >暫無資料，手動重新整理<v-icon
                      class="mx-3"
                      @click="geteventData"
                    >
                      mdi-reload
                    </v-icon></v-btn
                  ></span
                >
              </template>
              <el-table-column
                label="時間"
                prop="created_time"
                align="center"
              ></el-table-column>
              <el-table-column
                label="分類"
                prop="event_category"
                align="center"
              ></el-table-column>
              <el-table-column
                label="標題"
                prop="title"
                align="center"
              ></el-table-column>
              <el-table-column
                label="內容"
                prop="content"
                align="center"
              ></el-table-column>
              <el-table-column
                label="資料建立人員"
                prop="created_user"
                align="center"
              ></el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <v-btn
                    color="primary"
                    outlined
                    small
                    :disabled="scope.row.ended_date != null"
                    @click="dellog(scope.row)"
                    >刪除</v-btn
                  >
                  <!-- @click="delcircle(scope.row)" -->
                </template>
              </el-table-column>
            </el-table>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <!-- 養殖歷程 -->
    <v-row class="mb-10">
      <v-col cols="12">
        <v-card elevation="3" tile dark class="primary">
          <v-card-title class="py-2"
            ><span>養殖歷程</span><v-spacer></v-spacer
            ><span
              ><v-btn :disabled="true" icon title="養殖歷程設定" to="" target="_blank"
                ><v-icon>mdi-cog</v-icon></v-btn
              ></span
            ></v-card-title
          >
          <v-divider></v-divider>
          <v-card-title>
            <br />
            建置中<br />
          </v-card-title>
        </v-card>
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
      tabitems: ["檢測數據", "計算數據(建置中)"],
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
      add_volume: undefined,
      addparm: {
        started_date: undefined,//開始日期，有ended_date結束日期，但新增不需使用
        name: undefined,//名稱或批號
        num_per_unit: undefined,//放養密度
        estimated_num: undefined, //放養隻數，改由後端算，但這裡是畫面呈現用
        seedling_id:undefined,//種苗id
        estimated_harvest_catty:undefined,//預計收成斤數
        estimated_survival_rate:undefined,//預計存活率
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
    };
  },
  methods: {
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
          // this.$axios
          //   .delete(
          //     `${this.$store.state.mydata.gobal_api.apiUrl}/aquaculture-record/${id}`
          //   )
          //   .then(res => {
          //     console.log("循環刪除 API:" + res.request.responseURL);
          //     if (res.data == "刪除成功") {
          //       this.getCircleData();
          //       this.$toast.success("刪除成功", { duration: 2000 });
          //     } else {
          //       this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
          //     }
          //   })
          //   .catch(error => {
          //     this.$toast.error("error:" + error, { duration: 2000 });
          //   });
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
      //取得整廠架構資料
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
          if (this.circleData.length > 0) {
            this.getwarnData();
            // this.getDetectData();
            this.getshirimpData();
          }
        })
        .catch(error=>{
          this.$toast.error("error:" + error, { duration: 2000 });
        });
      // await this.$axios
      //   .get(
      //     `${this.$store.state.mydata.gobal_api.apiUrl}/aquaculture-record/?${parm_url}`
      //   )
      //   .then(res => {
      //     this.circleData = res.data;
      //     if (this.circleData.length > 0) {
      //       this.getwarnData();
      //       // this.getDetectData();
      //       this.getshirimpData();
      //     }
      //   });

      this.getDetectData(); //無論如何都要抓
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
      //蝦況
      await this.$axios
        .get(
          `${this.$store.state.mydata.gobal_api.apiUrl}/shrimp-status/?pond_id=${this.poolid}&is_last=true`
        )
        .then(res => {
          this.shirimpData = res.data;
        });
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
          this.warnDataDt = dayjs().format("YYYY-MM-DD HH:mm:ss");
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
    //新增循環
    submitadd: async function() {
      const updUser = this.$auth.$state.user.email;
      this.addparm.created_user = updUser;
      this.addparm.pond_id = parseInt(this.poolid); //需要int
      let parm = Object.assign({},this.addparm);
      delete parm.estimated_num;//刪除初始放苗量
      console.log(parm);
      var valid = this.$refs.cycleform.validate();
      // if (this.$refs.logform != undefined) {
      //   this.$refs.logform.reset();
      // }
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

      if (val != null) {
        this.cirid = val.id; //循環id
        await this.getDetectData();
      } else {
        this.cirid = undefined;
      }
      // this.currentRow = val;
      await this.geteventData();//取得事件紀錄清單
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
    }
  },
  async mounted() {
    if (this.req.id == undefined) {
      //取得整廠架構資料
      await this.getMainData();
      //取得指標子項目
      await this.getItemData();
      return;
    }
    //取得整廠架構資料
    await this.getMainData();
    //取得指標子項目
    await this.getItemData();
    //取得警示區資料
    await this.getwarnData();
    //取得循環資料
    await this.getCircleData();
    await this.getSeedlingData();//取得苗清單
    await this.getaccList();//帳號清單
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
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
