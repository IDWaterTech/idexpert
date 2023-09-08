<template>
  <div>
    <v-card class="indicator">
        <div class="card-title">
            <v-row style="margin-bottom: 0;">
                <div class="title">
                    <v-icon>mdi-file-edit</v-icon>
                    <v-card-title>指標資料修改</v-card-title>
                </div>
            </v-row>
        </div>
        <div class="content">
          <div class="search">
            <v-row>
              <!-- 選擇場(必選) -->
              <v-col cols="12" md="4" sm="12" class="caculate">
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
              </v-col>
              <!-- 選擇區域(必選) -->
              <v-col cols="12" md="4" sm="12" class="caculate">
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
                  clearable>
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
                <v-dialog
                  v-model="addDialog"
                  max-width="500px"
                  :persistent="keepswitch"
                  class="indicator-dialog"
                >
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card v-if="addDialog"
                      ><v-card-title>新增</v-card-title>
                      <v-card-subtitle class="title"
                        >{{maindata.filter(x=>x.id==sel_main)[0].name}}-{{maindata.filter(x=>x.id==sel_main)[0].node.filter(x=>x.id==sel_area)[0].name}}-<span class="font-weight-black" style="color:red;">{{
                          defitem
                        }}</span
                        ></v-card-subtitle>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-switch
                              v-model="keepswitch"
                              color="red darken-3" dense
                              :label="
                                keepswitch ? '保留數值不關閉：on' : '保留數值不關閉：off'
                              "
                            ></v-switch>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              v-model="defitem"
                              :items="waterdatacols"
                              item-text="name"
                              item-value="value"
                              no-data-text="查無資料"
                              placeholder="指定項目(必選)"
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
                          <v-col cols="12">
                            <v-row>
                              <v-col md="9">
                                <v-text-field v-model="formula"  hide-details dense filled clearable title="新值=[原值]*[公式]" placeholder="公式範例:[原值]*[8*(20+5)]，預設為相乘"></v-text-field>
                              </v-col>
                              <v-col md="3">
                                <v-btn block color="primary" :disabled="!formula" @click="reCalc" tile>計算</v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-row>
                          <v-col
                            cols="12"
                            md="6"
                            v-for="item in mainpool.items"
                            :key="item.id"
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

                      <v-card-text>
                        <v-chip
                          class="ma-2"
                          color="indigo darken-3"
                          outlined
                          v-for="item in addData"
                          :key="item.name"
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
                          class="ma-2"
                          color="indigo darken-3"
                          outlined
                          v-for="(key, index) in Object.keys(num)"
                          :key="index"
                          v-show="typeof num[key] == 'number'"
                        >
                          <div v-if="typeof num[key] == 'number'">
                            <v-icon left>
                              mdi-new-box
                            </v-icon>
                            {{ key }} [{{ num[key] }}]
                          </div>
                        </v-chip>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
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
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </v-dialog>
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
            <v-row>
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
                ></v-autocomplete>
              </v-col>
              
              <div class="align-self-center" style="padding: 12px;">
                <v-btn
                  tile
                  @click="getdata"
                  :disabled="
                    sdate &&
                    edate &&
                    sel_pool &&
                    sel_area &&
                    sel_main &&
                    defitem != undefined &&
                    defitem.length > 0? false: true"
                  style="border-radius: 4px;box-shadow: none;background-color: #006AA6;color: #fff;"
                  >查詢</v-btn
                >
              </div>
              <v-col cols="12">
              <!-- 批次刪除Dialog -->
              <v-dialog v-model="captchaDialog" width="350" class="indicator-dialog">
                <v-card height="230">
                  <v-card-title>驗證碼</v-card-title>
                  <v-card-text>
                    <recaptcha />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn tile @click="captchacheck" style="border-radius: 4px;box-shadow: none;background-color: #006AA6;color: #fff;">送出</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </div>
          <!-- 搜尋結果 -->
          <div class="result">
            <!-- 編修紀錄 -->
            <div class="edit">
              <v-row>
                <v-col cols="12">
                  <!-- 編輯項目 -->
                  <v-dialog v-model="editDialog" max-width="500px" class="indicator-dialog">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">編輯項目</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" md="12">
                              <v-text-field
                                v-model="editedItem.id"
                                disabled dense filled
                              ><span style="width:50px;" slot="prepend">id</span></v-text-field>
                              <v-text-field
                                v-model="editedItem.inspected_date"
                                disabled dense filled
                              ><span style="width:50px;" slot="prepend">日期</span></v-text-field>
                              <!-- <v-text-field
                                v-model="editedItem.value"
                                autocomplate="off"
                                type="number" dense filled
                              ><span style="width:50px;" slot="prepend">值</span></v-text-field> -->
                              <div style="display: flex;align-items: center;">
                                <span style="width:50px;" class="mx-4" slot="prepend">值</span>
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
                      <v-card-actions style="justify-self: flex-end;width: 100%;">
                        <v-spacer></v-spacer>
                        <v-btn tile @click="editDialog = false" style="border-radius: 4px;box-shadow: none;background-color: transparent;color: #006AA6;border: 1px solid #006AA6;">
                          取消
                        </v-btn>
                        <v-btn tile @click="editsubmit" style="border-radius: 4px;box-shadow: none;background-color: #006AA6;color: #fff;">
                          確定
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-card class="result-card"
                    :style="{borderRadius:`${isEdit?'4px':'4px 4px 0 0'}`}">
                    <div class="header-bar">
                      <h5>編修紀錄</h5>
                      <v-btn icon @click="isEdit=!isEdit">
                        <v-icon v-show="isEdit">mdi-triangle-small-down</v-icon>
                        <v-icon v-show="!isEdit">mdi-triangle-small-up</v-icon>
                      </v-btn>
                    </div>
                    <div v-show="isEdit" class="result-content" style="padding-top: 12px;">
                      <v-data-table
                        class="edit-table"
                        v-model="selected"
                        :headers="headers"
                        :items="item2.items" dense
                        :footer-props="footerProps"
                        :loading="loading"
                        :show-select="showselect"
                        no-data-text="查無資料">
                        <!-- <template v-slot:[`item2.actions`]="{ aitem }">
                          <v-icon small class="mr-2" :disabled="['feed','pbio'].includes(aitem.group)" @click="editItem(aitem)" color="success">
                            mdi-pencil
                          </v-icon>
                          <v-icon small @click="delItem(aitem)" :disabled="['feed','pbio'].includes(aitem.group)" color="red">
                            mdi-delete
                          </v-icon>
                        </template> -->
                        <template v-slot:item.actions="{ item }">
                          <v-icon small class="mr-2" :disabled="['feed','pbio'].includes(item.group)" @click="editItem(item)">
                            mdi-pencil
                          </v-icon>
                          <v-icon small :disabled="['feed','pbio'].includes(item.group)" @click="delItem(item)"  color="red">
                            mdi-delete
                          </v-icon>
                        </template>
                        <template v-slot:top>
                          <v-toolbar flat>
                            <v-spacer></v-spacer>
                            <v-checkbox
                              v-model="showselect"
                              label=""
                              color="red"
                              hide-details
                            >
                            </v-checkbox>
                            <v-btn class="primary" tile small :disabled="selected.length==0 || !showselect" @click="opencapDialog">批次刪除</v-btn>
                          </v-toolbar>
                          
                          <!-- 刪除項目 -->  
                          <v-dialog v-model="delDialog" max-width="500px" class="indicator-dialog">
                            <!-- <v-card>
                              <v-card-title class="text-h5"> 是否刪除該項目?</v-card-title>
                              <v-card-text class="text-h5">
                                id:{{ editedItem.id }}<br />
                                時間：{{ editedItem.inspected_date }}<br />
                                值：{{ editedItem.value }}
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text @click="delDialog = false" style="border-radius: 4px;box-shadow: none;background-color: transparent;color: #006AA6;border: 1px solid #006AA6;"
                                  >取消</v-btn>
                                <v-btn text @click="delsubmit" style="border-radius: 4px;box-shadow: none;background-color: #006AA6;color: #fff;"
                                  >確定刪除</v-btn
                                >
                                <v-spacer></v-spacer>
                              </v-card-actions>
                            </v-card> -->
                            <v-card>
                              <v-card-title>
                                <span class="text-h5">是否刪除該項目?</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12" md="12">
                                      <div style="width:100%;margin-left: 0px;line-height: 32px;font-size: 16px;display: flex;align-items: center;"> <span style="width: 50px;">id：</span>{{ editedItem.id }}</div><br>
                                      <div style="width:100%;margin-left: 0px;line-height: 32px;font-size: 16px;display: flex;align-items: center;"><span style="width: 50px;">時間：</span>{{ editedItem.inspected_date }}</div><br>
                                      <div style="width:100%;margin-left: 0px;line-height: 32px;font-size: 16px;display: flex;align-items: center;"><span style="width: 50px;">值：</span>{{ editedItem.value }}</div>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                              <v-card-actions style="justify-self: flex-end;width: 100%;">
                                <v-spacer></v-spacer>
                                <v-btn text @click="delDialog = false" style="border-radius: 4px;box-shadow: none;background-color: transparent;color: #006AA6;border: 1px solid #006AA6;">
                                  取消</v-btn>
                                <v-btn text @click="delsubmit" style="border-radius: 4px;box-shadow: none;background-color: #006AA6;color: #fff;">
                                  確定刪除</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </template>
                      </v-data-table>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            <!-- 事件紀錄 -->
            <div class="event">
              <v-row>
                <v-col cols="12">
                  <v-card class="result-card">
                    <div class="header-bar">
                      <h5>事件紀錄</h5>
                      <v-btn icon @click="isEvent=!isEvent">
                        <v-icon v-show="isEvent">mdi-triangle-small-down</v-icon>
                        <v-icon v-show="!isEvent">mdi-triangle-small-up</v-icon>
                      </v-btn>
                    </div>
                    <div v-show="isEvent" class="result-content" style="padding-top: 12px;">
                      <!-- <el-table class="event-table" :data="eventsData" :header-row-style="{ background: '#F4FBFF' }" style="width: 100%;background-color: #F4FBFF;" max-height="300">
                        <el-table-column label="id" width="50" prop="id" align="center" style="background: #F4FBFF;font-size: 0.75rem;"></el-table-column>
                        <el-table-column label="事件等級" width="80" prop="event_level_name" align="center" style="background: #F4FBFF;font-size: 0.75rem;">
                          <template slot-scope="scope">
                            <v-chip dark :color="scope.row.color">{{scope.row.event_level_name}}</v-chip>
                          </template>

                        </el-table-column>
                        <el-table-column label="事件類別" width="80" prop="event_category_name" align="center" style="background: #F4FBFF;font-size: 0.75rem;"></el-table-column>
                        <el-table-column label="時間" width="200" align="center" style="background: #F4FBFF;font-size: 0.75rem;">
                          <template slot-scope="scope">
                            起：{{scope.row.started_date}}<br/>訖：{{scope.row.ended_date}}
                          </template>
                        </el-table-column>
                        <el-table-column label="內容" align="left" style="background: #F4FBFF;font-size: 0.75rem;">
                          <template slot-scope="scope">
                            全日事件：{{scope.row.is_all_day?'Yes':'No'}}<br/>
                            標題：{{scope.row.title}} [最後編輯： {{scope.row.created_user}}]<br/>
                            內容：<div style="white-space: pre-wrap;">{{scope.row.content}}</div>
                          </template>
                        </el-table-column>
                        <el-table-column label="資料範圍" width="200" align="center" style="background: #F4FBFF;font-size: 0.75rem;">
                          <template slot-scope="scope">
                            {{scope.row.items.map(x=>x.name).join()}}
                          </template>
                        </el-table-column>
                      </el-table> -->

                      <v-data-table
                        class="edit-table"
                        :headers="eventHeaders"
                        :items="eventTableData" dense
                        :footer-props="footerProps"
                        no-data-text="查無資料">
                        <template v-slot:item.event_level_name="{ item }">
                          <v-chip
                            :color="item.color"
                            style="font-size: 12px;"
                            dark
                          >
                            {{ item.event_level_name }}
                          </v-chip>
                        </template>
                        <template v-slot:item.time="{ item }">
                          <div style="width:100%;text-align: left;display: flex;justify-content: center;">
                            <span v-html="item.time" style="line-height: 24px;"></span>
                          </div>
                        </template>
                        <template v-slot:item.content="{ item }">
                          <div style="width:100%;text-align: left;display: flex;justify-content: center;">
                            <span v-html="item.content" style="line-height: 24px;"></span>
                          </div>
                        </template>
                        <template v-slot:item.name="{ item }">
                          <div style="width:100%;text-align: left;display: flex;justify-content: center;">
                            <span v-html="item.name" style="line-height: 24px;"></span>
                          </div>
                        </template>
                      </v-data-table>
                      
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            <!-- 圖表 -->
            <div class="charts">
              <v-row>
                <v-col cols="12">
                  <v-card class="result-card">
                    <div class="header-bar">
                      <h5 v-if="defitem.length>0">{{ defitem }}</h5>
                      <h5 v-else>圖表</h5>
                      <v-btn icon @click="isChart=!isChart">
                        <v-icon v-show="isChart">mdi-triangle-small-down</v-icon>
                        <v-icon v-show="!isChart">mdi-triangle-small-up</v-icon>
                      </v-btn>
                    </div>
                    <div v-show="isChart" class="result-content">
                      <v-row style="width: 100%;justify-content: flex-end;">
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
                          style="width: 100%;"
                        ></WaterQuality_Vcharts2>
                      </v-row>
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
import https from "https";
import dayjs from "dayjs";
import "element-ui/lib/theme-chalk/index.css";
import WaterQuality_Vcharts2 from "@/components/sheet/waterQuality_vcharts2";
import _ from "lodash";
const agent = new https.Agent({
  rejectUnauthorized: false
});
// import { number } from "~/node_modules/echarts/lib/export";
export default {
  layout: "emptynologin",
  middleware: "auth",
  components: {
    WaterQuality_Vcharts2
  },
  head(){
    return{
      title:'指標資料明細'
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
      item: [{ name: "", items: [] }],
      item2: [{ name: "", items: [] }],
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
      //查詢結果內容收合
      isEdit: true,
      isEvent: true,
      isChart: true,
      areas: [],
    };
  },
  async created() {
    // await this._pageCheck(); //驗證頁面是否可檢視
    //抓欄位資料 waterdatacols ，coldata
    var myitem=[];
     await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/all-col-for-search/`).then(res=>{
       var group =  Array.from(new Set(res.data.map(x=>x.group))); 
       for (let i = 0; i < group.length; i++) {
        const element = group[i];
        if (i!=0) {
           myitem.push({ divider: true });
        }
         myitem.push({ header: element });//group name
         myitem.push(...res.data.filter(x=>x.group==element).map(x=>({'name':x.name_ch,'value':x.name_en})));
       }
      //  myitem = res.data.map(x=>({'name':x.name_ch,'value':x.name_en}));
       this.waterdatacols = myitem;
       this.coldata = Object.assign([], res.data);
     }).catch(err => {
        alert("失敗：" + err.message);
    });
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
    const promiseArray = myurl.map(fetchURL);
    console.log("req", this.req);
    //
    this.sdate = String(this.req.sdate).length > 0 ? this.req.sdate : "";
    this.edate = this.req.hasOwnProperty('edate') && String(this.req.edate).length > 0 ? this.req.edate : this.sdate; 
    this.sel_main =
      Number(this.req.sel_main) > 0 ? Number(this.req.sel_main) : 0;
    this.sel_area =
      Number(this.req.sel_area) > 0 ? Number(this.req.sel_area) : 0;
    this.sel_pool =
      Number(this.req.sel_pool) > 0 ? Number(this.req.sel_pool) : 0;
    // if (Number(this.req.sel_pool) > 0) {
    //   //await this.areachange();
    //   this.areachange();
    //   this.sel_pool = Number(this.req.sel_pool);
    // }
    

    // this.defitem =this.req.defitem != undefined && this.req.defitem.length > 0 ? this.req.defitem : [];
    
    this.defitem = this.req.defitem != undefined && this.req.defitem.length > 0 ?  this.coldata.filter(x=>x.name_ch==this.req.defitem)[0].name_ch : [];
    console.log('defitem',this.defitem);
    console.log('defitem',this.coldata);
    //---
    // console.log(this.sdate,this.sel_main,this.sel_area,this.sel_pool);
    await Promise.all(promiseArray).then(([...data]) => {
      let res = data[0]; // first promise resolved
      this.maindata = res.data;
      console.log("場",this.maindata);
      if (Number(this.req.sel_pool) > 0) {
        //await this.areachange();
        this.areachange();
        this.sel_pool = Number(this.req.sel_pool);
      }
      //抓all項目
      res = data[1];
      var allitems = [];
      for (let i = 0; i < Object.keys(res.data).length; i++) {
        let colsclass = Object.keys(res.data)[i]; //water,env....
        if (i!=0) {
              allitems.push({ divider: true });
            }
             allitems.push({ header: colsclass });//group name
             allitems.push(...Object.keys(res.data[colsclass]));
      }
      console.log('sel',Object.keys(this.req).length)

      // this.waterdatacols = allitems;
      this.allcols = Object.assign({}, res.data);//{adv:{每日成長量: "每日成長量(cm)",...},...}
      console.log("子項目 api",this.allcols);
    });

    // //參數代入
    if (Object.keys(this.req).length > 0) {
      await this.getdata();
    }
  },
  computed: {
    areadata: function() {
      let filtermain = [];
      filtermain = this.maindata;
      console.log('areadata',filtermain,this.sel_main);
      if (
        //看有沒有選場
        this.sel_main != undefined &&
        this.sel_main > 0 &&
        this.maindata.length > 0
      ) {
        filtermain = filtermain.filter(main => main.id == this.sel_main);
      }
      var area = [];

      filtermain.forEach(function(x) {
        x.node.forEach(function(y) {
          var yitem = { id: y.id, name: y.name };
          if (area.indexOf(yitem) == -1) {
            //沒找到
            area.push(yitem);
          }
        });
      });
      console.log('area',area);
      
      this.areas = area;
      return area;
    }
  },
  methods: {
    factoryChange() {
      console.log('change',this.sel_main,this.areas);
      this.sel_pool = null;
    },
    areachange: async function() {
      var para = {
        id: this.sel_area
      };
      console.log('sel_area',this.sel_area)
      if (this.sel_area) {
        //水池基本資料
        await this.$axios
          .get(
            `${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`,
            { params: para },
            { httpsAgent: agent }
          )
          .then(res => {
            console.log("ponds-data",res.data);
            this.mainpool.items = res.data;
          })
          .catch(err => {
            alert("失敗：" + err.message);
          });
      } else {
        this.mainpool.items = [];
      }
    },
    getdata: async function() {
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
      await this.$axios
        .get(apiurl, { params: parm }, { httpsAgent: agent })
        .then(res => {
          console.log("API:" + res.request.responseURL);
          if(res.data=='欄位資料有誤'){
            this.$toast.error(`取得結果：欄位資料有誤`, { duration: 2000 });
            window.location.href='/indicator/index2'
          }else{
            let data2 = _.cloneDeep(res.data);
            // res.data.items.forEach(function(x) {//給折線圖用的資料
            //   delete x.id; //"刪掉id欄位"
            //   delete x.updated_user; //"刪掉updated_user欄位"
            //   delete x.group;//"刪掉group欄位"
            // });
            this.item = _.cloneDeep(res.data);
            this.item.items.forEach(function(x) {//給折線圖用的資料
              delete x.id; //"刪掉id欄位"
              delete x.updated_user; //"刪掉updated_user欄位"
              delete x.group;//"刪掉group欄位"
            });
            if (data2.items.length > 0) {
              let cols = Object.keys(data2.items[0]);
              for (const key in cols) {
                this.headers.push({
                  text: cols[key],
                  value: cols[key],
                  align: "center",
                  groupable: false
                });
              }
            }

            this.headers.push({
              text: "動作",
              value: "actions",
              sortable: false
            });
            
            this.item2 = data2;
            if ( this.item.items.length>0) {
              this.getLimitData();
            }
            this.loading = false;
            console.log('item',this.item);
            console.log('item2',this.item2)
            console.log('headers',this.headers)
          }
        })
        .catch(err => {
          alert("查詢失敗：" + err.message);
        });

      //抓事件資料
      this.eventsData.splice(0,this.eventsData.length);
      var result1 = await this.getEventData(1);
      var result2 = await this.getEventData(2);
      var result3 = await this.getEventData(3);
      this.eventsData = result1.concat(result2,result3);
      if(this.eventsData.length>0) {
        this.eventHeaders = [{
          align: "center",groupable: false,text: "id",value: "id"
        },{
          align: "center",groupable: false,text: "事件等級",value: "event_level_name"
        },{
          align: "center",groupable: false,text: "事件類別",value: "event_category_name"
        },{
          align: "center",groupable: false,text: "時間",value: "time"
        },{
          align: "center", groupable: false,text: "內容",value: "content"
        },{
          align: "center",groupable: false,text: "資料範圍",value: "name"
        }]
      }
      for(let i=0;i<this.eventsData.length;i++) {
        this.eventTableData.push({
          id: this.eventsData[i].id,
          event_level_name: this.eventsData[i].event_level_name,
          event_category_name: this.eventsData[i].event_category_name,
          time: `起：${this.eventsData[i].started_date}<br> 迄：${this.eventsData[i].ended_date}`,
          content:`全日事件：${this.eventsData[i].is_all_day}<br> 標題：${this.eventsData[i].title}[最後編輯者：${this.eventsData[i].created_user}]<br> 內容：${this.eventsData[i].content}`,
          name: '',
          color: this.eventsData[i].color
        })
        if(this.eventsData[i].items.length>0) {
          let data = []
          // this.eventsData[i].items = [{
          //   name:'研發一場'
          // },{
          //   name:'研發二場'
          // }]
          for(let x=0;x<this.eventsData[i].items.length;x++) {
            data.push(this.eventsData[i].items[x].name);
          }
          this.eventTableData[i].name = data.toString().replace(',','<br>');
        }
      }
      console.log("event data:",this.eventsData);
      console.log("event table:",this.eventTableData);
    },
    //抓事件資料
    getEventData: async function(level=1) {
      var parms = {};
      var poolidcpd = [];
      var result =[];
      
      this.eventsData.splice(0,this.eventsData.length);
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
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/event/`, {
          params: parms
        })
        .then(res => {
          result = res.data;
          console.log("event api:", res.request.responseURL);
          
        })
        .catch(err => {
          this.$toast.error(`資料取得失敗:${err.message}`, { duration: 2000 });
          // window.location.href='/indicator/index2'
        });
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
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/`)
        .then(res => {
          // this.allcols = Object.assign([], res.data);
          var lmtitem =  res.data.filter(x=>x.name_ch==this.defitem);
          if(lmtitem.length>0){//不可以有null值
            this.markdata.maxline = (lmtitem[0].critical_max==null)?-999:lmtitem[0].critical_max;
            this.markdata.minline = (lmtitem[0].critical_min==null)?-999:lmtitem[0].critical_min;
          }else{
            this.markdata.maxline = -999;
            this.markdata.minline = -999;
          }
          console.log("col data:",res.request.responseURL);
        });
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
      await this.$axios
        .delete(url, { data: deldata }, { httpsAgent: agent })
        .then(res => {
          if (res.data == "刪除成功") {
            // this.getdata();
            this.delDialog = false; //close dialog
            this.$toast.success(`刪除成功`, { duration: 2000 });
            this.getdata();//重取得資料
          } else {
            alert("刪除失敗!：" + res.data);
          }
        })
        .catch(error => {
          alert("刪除失敗!：" + error.message);
        });
    },
    delItems:async function(){
      if(confirm(`批次刪除${this.selected.length}筆資料？`)){
        var delsuccess = 0;
        for (let i = 0; i < this.selected.length; i++) {
          const item = this.selected[i];
          const editedItem = item;
          editedItem.class = this.getItemClass(Object.keys(item)[3]); //water,adv...
          let url = `${this.$store.state.mydata.gobal_api.apiUrl}/all-data/${editedItem.id}/`;
          let deldata = { data_group: editedItem.class };
          // console.log("DEL data:", deldata);
          // console.log("DEL:" + url);
          await this.$axios
            .delete(url, { data: deldata }, { httpsAgent: agent })
            .then(res => {
              if (res.data == "刪除成功") {
                delsuccess += 1;
              } else {
                console.log(`刪除失敗：${editedItem.id}-${res.data}`);
                alert(`刪除失敗!：${editedItem.id}-` + res.data);
              }
            })
            .catch(error => {
               console.log(`刪除失敗：${editedItem.id}-${error.message}`);
              alert(`刪除失敗!：${editedItem.id}-` + error.message);
            });
        }
        this.getdata();
        this.showselect = false;
        this.$toast.success(`刪除結果 成功筆數/總筆數：${delsuccess}/${this.selected.length}`, { duration: 2000 });
        this.selected = [];
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
      console.log('colitem',colitem);
      console.log('colitem',this.coldata);
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
        console.log("edit data:", data);
        await this.$axios
          .patch(url, data, { httpsAgent: agent })
          .then(res => {
            if (res.data == "修改成功") {
              this.getdata();
              this.editDialog = false; //close dialog
              this.$toast.success(`修改成功`, { duration: 2000 });
            } else {
              alert("修改失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("修改失敗!：" + error.message);
          })
          .finally(() => {});
      } else {
      }
    },
    opencapDialog:async function(){
      this.captchaDialog = true;
    },
    captchacheck:async function(){
      const token = await this.$recaptcha.getResponse();
      var parm = {token:token};
        await this.$axios
        .get(
          `${this.$store.state.mydata.gobal_api.apiIIS82}/idapi.asmx/recaptchacheck`,{params : parm}
        )
        .then(res => {
          var resdata = JSON.parse(res.data);
          if(resdata.success){
            this.captchaDialog=false;
            this.delItems();
          }
        });
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
        result = mee.eval(data).toFixed(2);
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
      console.log('addSubmit')
      if (valid) {
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
        await this.$axios
          .post(url, parms, { httpsAgent: agent })
          .then(res => {
            if (res.data == "新增成功") {
              if(this.sdate&&this.edate&&this.sel_main&&this.sel_area&&this.sel_pool&&this.defitem) {
                this.getdata();//新增未必有選到所有選項
              }
              
              this.atime = "";
              if (this.keepswitch == false) {
                this.addDialog = false; //close dialog
              }
              this.$toast.success(`新增成功`, { duration: 2000 });
            } else {
              alert("新增失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("新增失敗!：" + error.message);
          })
          .finally(() => {
            //this.getdata();
          });
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.v-application.v-application--is-ltr {
  .v-card.indicator {
    min-height: 80vh;
    overflow: hidden;
    margin-bottom: 24px;
    * {
      color: #00273E;
    }
    button.v-icon, button.v-btn--icon .v-icon {
      color: #006AA6;
    }
    .red--text {
      color: #A60017 !important;
    }
    .card-title,.content {
        padding: 12px 24px;
        .row {
            margin-left: 0;
            margin-top: 0;
            margin-bottom: 24px;
        }
        .title {
            display: flex;
            align-items: center;
            .theme--light.v-icon {
              color: #6c9bcd;
            }
        }
    }
    .v-card__title {
        color: #00273E;
        font-weight: bold;
    }
    .content {
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
          color: #BFCBD2 !important;
        }
        .theme--light.v-btn.v-btn--disabled .v-btn__loading,.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
          background-color: #BFCBD2 !important;
        }
      }
    }
    // .select-color.theme--light {
    //   & .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
    //     border-color: #6c9bcd !important;
    //   }
    //   & .theme--light.v-input input, &.theme--light.v-input textarea {
    //     color: #00273E !important;
    //   }
    //   & .theme--light.v-label {
    //     color: #6c9bcd !important;
    //   }
    //   & .v-icon.v-icon {
    //     color: #6c9bcd;
    //   }
    // }
    .search {
      margin-bottom: 24px;
      .caculate {
        max-width: calc((100%  / 3) - (100% / 12) / 3 );
      }
    }
    .v-sheet.result-card.v-card:not(.v-sheet--outlined) {
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .v-card.result-card {
      background-color: #F4FBFF;
      .header-bar {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 12px 24px;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        h5 {
          width: 100%;
        }
      }
      .result-content {
        padding: 0 24px;
        .theme--light.v-data-table,.theme--light.v-toolbar.v-sheet {
          background-color: #F4FBFF !important;
        }
        .v-toolbar__content, .v-toolbar__extension {
          padding: 0;
          button {
            height: 36px;
            border-radius: 4px;
          }
          .v-btn--is-elevated {
            box-shadow: none;
            background-color: #006AA6 !important;
            color: #fff;
          }
          .theme--light.v-btn.v-btn--disabled {
            color: #7F98A6 !important;
          }
        }
      }
    }
    
  }
}
::v-deep {
  .select-color{
    &.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
      border-color: #6c9bcd;
    }
    & .theme--light.v-input input, &.theme--light.v-input textarea,& .theme--light.v-label {
      color: #00273E;
    }
    & .theme--light.v-label.v-label--active {
      color: #6c9bcd;
    }
    & .v-icon.v-icon {
      color: #6c9bcd;
    }
    & .v-select__selection--comma,.theme--light.v-select .v-select__selections {
      color: #00273E;
    }
    & .v-select__slot {
      border-color: #6c9bcd;
    }
  }
  .edit-table {
    &.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper),
    &.theme--light.v-data-table tbody tr.v-data-table__selected {
      background: #BFD9E8;
    }
    input[type="checkbox"] {
      accent-color: #006AA6;
    }
  }
}
// scrollbar
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: none; 
}
::-webkit-scrollbar-thumb {
  background-color: #BFD9E8;
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
      
      
// div /deep/ .el-input__inner{
//   border-radius:0px !important;
// }
</style>
