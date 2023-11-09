<template>
  <div>
    <v-card class="bg-card" style="margin-bottom: 12px;min-height:86vh">
      <div class="content" style="padding-top:12px">
        <!-- 搜尋 -->
        <div class="search">
          <v-row style="margin-bottom: 0;align-items: center;">
            <v-col cols="12" md="8" style="padding: 0;">
              <v-row style="margin-bottom: 0;align-items: center;">
                <v-col cols="12" md="3" style="padding-bottom: 0;padding-top: 4px;">
                  <!-- 選擇池 -->
                  <div class="search-container">
                    <locate-select 
                      class="select-template"
                      :class="{'disabled':$route.query.id&&$route.query.id!==''}" 
                      :dataScope="'pool'" 
                      :defaultSelect="$route.query.id&&$route.query.id!==''?$route.query.id:'49'" 
                      :isMulti="false"
                      @scopeSel_data="get_scopeData($event)"
                      ></locate-select>
                  </div>
                </v-col>
                <!-- 選擇起日 -->
                <v-col cols="12" md="3" class="text-center" style="padding-bottom: 0;">
                  <v-menu v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                    offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="started_date" label="選擇起日" filled hide-details prepend-icon="mdi-calendar" readonly
                        dense v-bind="attrs" v-on="on" @click:prepend="() => (started_date = getNowDate())"></v-text-field>
                    </template>
                    <v-date-picker v-model="started_date" no-title locale="zh-tw" @input="menu_startdate = false">
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <!-- 選擇訖日 -->
                <v-col cols="12" md="3" class="text-center" style="padding-bottom: 0;">
                  <v-menu v-model="menu_enddate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                    offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="ended_date" label="選擇訖日" filled hide-details prepend-icon="mdi-calendar" readonly
                        dense v-bind="attrs" v-on="on" @click:prepend="() => (ended_date = getNowDate())"></v-text-field>
                    </template>
                    <v-date-picker v-model="ended_date" no-title locale="zh-tw" @input="menu_enddate = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- 按鈕-查詢 -->
                <v-col cols="12" md="3">
                  <v-btn tile class="btn-primary" @click="getCircleData">
                    查詢
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <!-- 按鈕-新增/執行 -->
            <v-col cols="12" md="4" style="padding: 0;">
              <v-row style="margin-bottom: 0;align-items: center;">
                <v-col cols="12" style="padding: 0;padding-right: 24px;">
                  <div class="btn-groups">
                    <v-btn tile class="btn-secondary" @click="showadd" style="padding: 0 8px;">
                      <v-icon>mdi-plus</v-icon>
                      新增循環
                    </v-btn>
                    <v-btn tile class="btn-secondary green" style="padding: 0 8px;" @click="mutiExecuteDialog">
                      <v-icon>mdi-check</v-icon>
                      批次執行
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              
            </v-col>
            
          </v-row>
        </div>
        <!-- 結果 -->
        <div class="result" style="padding: 0;padding-top: 4px;">
          <!-- 循環清單 -->
          <div class="result-list">
            <v-card class="result-card" >
              <!-- 表頭 -->
              <div class="card-title"  @click="resultListOpen = !resultListOpen" style="cursor: pointer;margin: 8px;">
                  <div class="title">
                      <v-card-title>循環清單</v-card-title>
                  </div>
                  <div class="chevron">
                    <v-icon v-if="resultListOpen">mdi-triangle-small-up</v-icon>
                    <v-icon v-if="!resultListOpen">mdi-triangle-small-down</v-icon>
                  </div>
              </div>
              <!-- 清單 -->
              <div v-show="resultListOpen" class="content">
                <el-table ref="circletable" style="width:100%" :data="circleData" highlight-current-row
                   height="62vh"
                  @cell-click="clickRow"
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
                  <!-- id 名稱批號有id 重複資訊 先拿掉 -->
                  <!-- <el-table-column label="id" prop="id" align="center"></el-table-column> -->
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
                      <!-- <v-btn color="primary" outlined small @click="delcircle(scope.row)" :disabled="scope.row.ended_date != null">
                        刪除</v-btn> -->
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <button class="btn-add delete" @click="delcircle(scope.row)" v-bind="attrs" v-on="on">
                                <v-icon>mdi-trash-can</v-icon>
                            </button>
                        </template>
                        <span>刪除</span>
                      </v-tooltip>
                    </template>
                    
                  </el-table-column>
                </el-table>
              </div>
            </v-card>                                   
          </div>
          <!-- 養殖歷程 -->
          <div class="result-list">
            <v-card v-if="currentDataId!==null && currentDataId!==''" class="result-card" >
              <!-- 表頭 -->
              <div class="card-title" style="cursor: pointer;margin: 8px" @click="resultCycleOpen = !resultCycleOpen" >
                  <div class="title">
                      <v-card-title>養殖歷程</v-card-title>
                  </div>
                  <div class="btn-groups">
                    <div class="open">
                      <v-btn class="btn-icon just-icon" v-if="!nowExpand" title="展開" @click="nowExpand = true;resultCycleOpen = !resultCycleOpen">
                        <v-icon style="font-size: 1.2rem;">mdi-view-dashboard</v-icon>
                      </v-btn>
                      <v-btn class="btn-icon just-icon" v-else title="收縮" @click="nowExpand = false;resultCycleOpen = !resultCycleOpen">
                        <v-icon style="font-size: 1.2rem;">mdi-view-stream</v-icon>
                      </v-btn>
                    </div>
                    <div class="chevron">
                      <v-icon v-if="resultCycleOpen">mdi-triangle-small-up</v-icon>
                      <v-icon v-if="!resultCycleOpen">mdi-triangle-small-down</v-icon>
                    </div>
                  </div>
                  
                  
              </div> 
              <div v-show="resultCycleOpen" style="padding-bottom: 12px;">
                <FeedTemplate2 :passObj="passObj" :nowExpand="nowExpand"></FeedTemplate2>
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </v-card>
    <!-- 新增循環的dialog -->
    <v-dialog id="addDialog" v-model="addDialog" max-width="500px">
      <v-form v-model="addvalid" ref="cycleform">
        <v-card style="min-height:80vh" class="custom-dialog">
          <v-card-title class="add-title" style="display: block;width: 100%;">
            <div style="display: inline-block;">
              新增-養殖循環
            </div>
            <div class="add" style="float: right;display: inline-block;">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="addDialog = false" 
                      style="border: none;min-width: 0;padding: 0 4px;">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <!-- 基本資料 -->
          <div class="card-title" @click="addbasicDataOpen = !addbasicDataOpen" style="cursor: pointer">
              <div class="title">
                  <v-card-title>基本資料設定</v-card-title>
              </div>
              <div class="chevron" >
                <v-icon v-if="addbasicDataOpen">mdi-triangle-small-up</v-icon>
                <v-icon v-if="!addbasicDataOpen">mdi-triangle-small-down</v-icon>
              </div>
          </div>
          <div v-show="addbasicDataOpen" class="basic">
            <v-card-text style="display: flex;align-items: center;">
              <v-text-field v-model="addparm.name" label="名稱/批號" :rules="rules.require" autocomplete="off" style="padding-top: 0;">
              </v-text-field>
              <v-menu v-model="menu_adddate" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="addparm.started_date" label="選擇起日" :rules="rules.require"
                    prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" @click:prepend="
                                              () => (addparm.started_date = getNowDate())
                                            " style="padding-top: 0;"></v-text-field>
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
                    autocomplete="off"></v-text-field>
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
                    disabled autocomplete="off">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text style="display: flex;align-items: center;">
              <v-row style="align-items: center;padding-top: 16px;">
                <v-col cols="6" style="padding: 0;padding-left: 12px;">
                  <v-select v-model="addparm.seedling_id" dense filled :items="SeedlingData" item-value="id" 
                    item-text="name_ch" clearable :rules="rules.require" label="選擇種苗">
                  </v-select>
                </v-col>
                <v-col cols="6" style="padding: 0;padding-right: 12px;">
                  <v-menu v-model="menu_stockeddate" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="addparm.stocked_date" label="放苗日" :rules="rules.require"
                        prepend-icon="mdi-calendar" style="padding-top: 0;margin-top: -4px;" readonly v-bind="attrs" v-on="on" @click:prepend="
                                                  () => (addparm.stocked_date = getNowDate())
                                                "></v-text-field>
                    </template>
                    <v-date-picker v-model="addparm.stocked_date" no-title locale="zh-tw" @input="menu_stockeddate = false">
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text style="display: flex;align-items: center;">
              <v-row style="align-items: center;padding-top: 16px;">
                <v-col cols="6" style="padding: 0;padding-left: 12px;">
                  <v-select v-model="addparm.water_source" clearable :items="optData.WaterSource" filled dense item-value="name_en" item-text="name_ch" :rules="rules.require" label="水源" style="margin-right: 4px;"></v-select>
                </v-col>
                <v-col cols="6" style="padding: 0;padding-right: 12px;">
                  <v-text-field v-model.number="addparm.water_source_salinity" type="number" dense filled :rules="rules.require" label="鹽度(度)"></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>    
            <v-card-text style="display: flex;">
              <v-text-field filled dense type="number" v-model.number="addparm.estimated_harvest_weight" label="預估收成個體重(g)(選)" hide-details style="margin-right: 4px;">
              </v-text-field>
              <v-text-field filled dense type="number" v-model.number="addparm.estimated_survival_rate" label="預估存活率(%)(選)">
              </v-text-field>
            </v-card-text>
            <v-card-text style="display: flex;align-items: center;">
              <v-text-field filled dense type="number" v-model.number="addparm.cn" label="目標CN比(選)" style="margin-right: 4px;">
              </v-text-field>
              <v-text-field filled dense type="number" v-model.number="addparm.estimated_fcr" label="預估FCR(選)">
              </v-text-field>
            </v-card-text>      
            <v-card-text style="display: flex;align-items: center;">
              <v-text-field filled dense type="number" v-model.number="addparm.initial_weight" label="放養初始重量(選)" style="margin-right: 4px;">
              </v-text-field>
            </v-card-text>
            <v-card-text>
              <v-autocomplete v-model="addparm.person_in_charge" dense filled :items="accdata" item-value="username"
                :filter="filterincharge" clearable :rules="rules.require" label="養殖負責">
                <span slot="selection" slot-scope="data">{{data.item.position}}-{{data.item.account_name}}</span>
                <span slot="item" slot-scope="data">{{data.item.position}}-{{data.item.account_name}}</span>
              </v-autocomplete>
            </v-card-text>
            <v-card-text>
              <v-text-field filled dense v-model="addparm.remark" hide-details label="備註(選)">
              </v-text-field>
            </v-card-text>
            <v-card-text>
              <v-autocomplete v-model="tempSelect" dense filled :items="template_items" item-text="name_ch" item-value="id" hide-details
                clearable @change="tempChange" label="選擇樣板(選)">
              </v-autocomplete>
            </v-card-text>
            <!-- <v-col cols="12"> -->
              <!-- 樣板 先暫時拿掉-->
              <!-- <v-autocomplete v-model="tempSelect" dense filled :items="template_items" item-text="name_ch" item-value="id" hide-details
                clearable @change="tempChange" label="選擇樣板(選)">
              </v-autocomplete> -->
            <!-- </v-col> -->
          </div>
          <!-- 選擇池 -->
          <div class="card-title" style="cursor: pointer;">
            <div class="title">
                <v-card-title>選擇池</v-card-title>
            </div>
            <!-- <div class="chevron" >
              <v-icon v-if="addChooseOpen">mdi-triangle-small-up</v-icon>
              <v-icon v-if="!addChooseOpen">mdi-triangle-small-down</v-icon>
            </div> -->
          </div>
          <div v-if="addChooseOpen" class="basic" style="padding-left: 12px;">
            <v-card-text style="display: flex;align-items: center;padding-top: 0;">
              <!-- {{ addparm.pool_id }} -->
              <!-- <locate-select 
                class="select-template"
                v-model="addparm.pool_id"
                :dataScope="'pool'" 
                :isMulti="true" 
                @scopeSel_data="get_selectData($event)" 
                ></locate-select> -->
                <treeselect
                    @input="changeEvent"
                    v-model="addparm.dataid"
                    :options="maindataScope"
                    :default-expand-level="1"
                    :disable-branch-nodes="true"
                    children="node"
                    placeholder="請選擇養殖池"
                    multiple
                    :rules="rules.length"
                    :normalizer="
                      node => {
                        return { children: node.node };
                      }
                    "
                    class="select-template font-size-large"
                    :class="{'error':isDataidError}"
                  >
                  <div slot="value-label" slot-scope="{ node }"  class="font-size-large"  v-text="node.raw.parent != undefined && node.raw.parent.length > 0 ? node.raw.parent + '_'+node.raw.name:''+node.raw.name"></div>
                  <div slot="option-label" slot-scope="{ node }">{{ `${node.raw.name}` }}</div>
                </treeselect>
              
            </v-card-text>
            <span style="padding-left: 12px;"><b>(!!!!最後要上要記得清除!!!!)</b></span><br>
            <span style="padding-left: 12px;"><b>Note:需撈取出可新增循環的池，資料架構與/api/architecture相同</b><br></span>
            <span style="padding-left: 12px;color: red"><b>Note:多池選擇下，體積水量可能會不同數值，影響初始放苗數，待討論</b><br></span>
          </div>
          <v-card-actions style="padding: 24px 12px;">
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="cancelDialog">取消</v-btn>
            <v-btn class="btn-primary" @click="submitadd">新增</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- 批次執行的dialog -->
    <v-dialog v-model="mutiExecute" max-width="500px">
      <v-form v-model="executevalid" ref="executeform">
        <v-card class="custom-dialog">
          <v-card-title class="add-title" style="display: block;width: 100%;">
              <div style="display: inline-block;">
              批次執行
              </div>
              <div class="add" style="float: right;display: inline-block;">
                <v-btn  class="btn-secondary close"
                        title="取消" 
                        @click="mutiExecute = false" 
                        style="border: none;min-width: 0;padding: 0 4px;">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
          </v-card-title>
          <div class="basic" style="min-height: 300px;">
            <v-card-text  style="display: flex;align-items: center;padding: 8px 16px;">
              <div class="search-container">
                <locate-select
                  class="select-template"
                  :dataScope="'area'" 
                  :defaultSelect="nowExeArea" 
                  :isMulti="false" 
                  @scopeSel_data="get_scopeExecuteData($event)" 
                  style="margin-right: 0;"
                  ></locate-select>
              </div>
            </v-card-text>
            <v-card-text v-if="nowExeArea && nowExeArea !== ''"  style="display: flex;align-items: center;padding: 8px 16px;">
              <div class="search-container" style="width: 100%;">
                <v-tabs v-model="nowTab" show-arrows>
                  <!-- 上方tab -->
                  <v-tab
                      v-for="(tab,tid) in executeTabs"
                      :key="'tabs-'+tid"
                      :href="`#` + tab">
                      {{ tab }}
                  </v-tab>
                  <!-- tab內容 -->
                  <v-tabs-items v-model="nowTab" touchless>
                    <v-tab-item 
                      v-for="(tab,tid) in executeTabs"
                      :key="'tab-'+tid"
                      :value="tab"
                      style="margin-bottom: 16px;margin-top: 16px;">
                      <!-- 執行 -->
                      <div v-show="nowTab=='執行'" class="result-content">
                        <!-- <v-card-text  style="padding: 8px 16px;"> -->
                          <div v-for="item in mutiExecuteData" :key="item.pond_id" class="list" style="display: flex;align-items: center;">
                            <v-checkbox
                              v-model="item.checked"
                              dense hide-details
                              :label="item.pond_name"
                            ></v-checkbox>
                            <div class="status" style="margin-left: 12px;">{{ item.status }} - {{ item.item }} <span v-if="item.msg!==''"> - {{ item.msg }}</span></div>
                            <!-- <div class="execute">
                              <span>{{ item.execute_time&&item.execute_time!==''?'已執行':'未執行' }}</span>
                              <span>{{ item.execute_time&&item.execute_time!==''&&item.isConfirm?'已確認':'未確認' }}</span>
                            </div> -->
                          </div>
                          <div v-if="mutiExecuteData.length==0">無資料</div>
                      </div>
                      
                      <!-- 確認 -->
                      <div v-show="nowTab=='確認'" class="result-content">
                        <!-- <v-card-text  style="padding: 8px 16px;"> -->
                          <div v-for="item in mutiConfirmData" :key="item.pond_id" class="list" style="display: flex;align-items: center;">
                            <v-checkbox
                              v-model="item.checked"
                              dense hide-details
                              :label="item.pond_name"
                            ></v-checkbox>
                            <div class="status" style="margin-left: 12px;">{{ item.status }} - {{ item.item }} <span v-if="item.msg!==''"> - {{ item.msg }}</span></div>
                            <!-- <div class="execute">
                              <span>{{ item.execute_time&&item.execute_time!==''?'已執行':'未執行' }}</span>
                              <span>{{ item.execute_time&&item.execute_time!==''&&item.isConfirm?'已確認':'未確認' }}</span>
                            </div> -->
                          </div>
                          <div v-if="mutiConfirmData.length==0">無資料</div>
                        <!-- </v-card-text> -->
                      </div>
                      
                    </v-tab-item>
                  </v-tabs-items>
                </v-tabs>
              </div>
            </v-card-text>
            <br>
            <v-card-text  style="padding: 8px 16px;">
              <b>Note:資料撈取(!!!!最後要上要記得清除!!!!)</b><br>
              <span>撈取正在循環的池，每按執行/確認後，因步驟會改變，需重新撈取資料</span><br><br>
              <div v-if="nowTab == '執行'">
                <span>各池 執行撈取第一個 尚未執行(execute_time = " ")的步驟</span><br><br>
                <hr><br>
                <span v-for="item in mutiExecuteData" :key="'exe_'+item.pond_id">{{ item }}<br></span>
              </div>
              <div v-else>
                <span>各池 確認撈取第一個 已執行(execute_time != " ") 未確認(isConfirm=false)的步驟</span><br><br>
                <hr><br>
                <span v-for="item in mutiConfirmData" :key="'con_'+item.pond_id">{{ item }}<br></span>
              </div>
            </v-card-text>
          </div>
          <v-card-actions style="padding: 24px 12px;">
              <v-spacer></v-spacer>
              <!-- <v-btn  v-if="nowTab == '執行'" class="btn-secondary" @click="mutiExecuteStep(false)">上一步</v-btn> -->
              <!-- <v-btn class="btn-secondary" @click="mutiExecute = false">取消</v-btn> -->
              <v-btn class="btn-primary" @click="mutiExecuteStep()">{{ nowTab=='執行'?'執行':'確認' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
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
import FeedTemplate2 from '~/components/feedTemplate2.vue';
const agent = new https.Agent({
  rejectUnauthorized: false
});
// import axios from "~/plugins/axios";
export default {
  
  components: { waterball },
  layout: "emptynologin",
  middleware: "auth",
  components: {
    WaterQuality_Vcharts,
    FeedTemplate2
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
        ],
      },
      poolid: this.$route.query.id,
      nowPool: '',
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
        pool_id: [],
        dataid: [],// 多選
      },
      isDataidError: false,
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
      optData:{WaterSource:[{ "name_en": "Groundwater", "name_ch": "地下水" }, { "name_en": "Seawater", "name_ch": "海水" }]},//選項
      // 收合板控制
      resultListOpen: true,
      resultCycleOpen: true,
      addbasicDataOpen: true,
      addChooseOpen: true,
      // 紀錄當前顯示歷程的id，清除點選用
      currentDataId: null,
      // 批次執行
      mutiExecute: false,
      executevalid: false,
      executeTabs: ['執行','確認'],
      nowTab: '執行',
      nowExeArea: '',
      mutiExecuteData:[{
        pond_id: 50,
        pond_name: 'A2',
        status: '空池',
        item: '新增循環',
        item_id: 23,
        execute_time: '',
        isConfirm: false,
        msg:''
      },{
        pond_id: 51,
        pond_name: 'A3',
        status: '養殖審核',
        item: '養殖審核1',
        item_id: 27,
        execute_time: '',
        isConfirm: false,
        msg:''
        
      }],
      mutiConfirmData:[{
        pond_id: 49,
        pond_name: 'A1',
        status: '空池',
        item: '設備正常',
        item_id: 24,
        execute_time: '2023-10-25 11:22:11',
        isConfirm: false,
        msg:''
      },],
      addPoolData:[],
      dataid: undefined,
      // 養殖歷程收合
      nowExpand: true, 
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
        this.nowPool = poolParent+'_'+poolName;
        return `${poolParent}_${poolName}`;
      }
    },
    get_scopeData(evt) {
      console.log('change pool',evt)
      this.poolid = evt;
    },
    get_selectData(evt) {
      // console.log(evt);
      this.addparm.pool_id = evt;
    },
    // 批次執行選區
    get_scopeExecuteData(evt) {
      console.log(evt);
      this.nowExeArea = evt;
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
          // this.circleData.push({
            
          //   "id": 99999,
          //   "name": "1112",
          //   "num_per_unit": 222,
          //   "started_date": "2023-10-19",
          //   "ended_date": null,
          //   "stocked_date": "2023-10-02",
          //   "water_source": "Seawater",
          //   "water_source_salinity": 1,
          //   "cn": 0,
          //   "initial_weight": 0,
          //   "estimated_survival_rate": "70.0%",
          //   "estimated_fcr": 0,
          //   "estimated_harvest_weight": 0,
          //   "remark": "",
          //   "pond_id": 1,
          //   "seedling_id": 5,
          //   "seedling_name": "A-2苗",
          //   "person_in_charge": "技術部-李遠菖",
          //   "created_user": "技術部-溫健偉",
          //   "created_time": "2023-10-19 08:24:58",
          //   "updated_user": "技術部-溫健偉",
          //   "updated_time": "2023-10-19 08:24:58",
          //   "total": 31080,
          //   "days": 5

          // })
          console.log(res.data);
          console.log("循環資料 api",res.request.responseURL);
          if (this.circleData.length > 0) {
            this.getwarnData();
            // this.getDetectData();
            this.getshirimpData();
            this.resultListOpen = true;
            this.resultCycleOpen = false;
            this.currentDataId = null;
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
      if (this.$refs.logform != undefined) {
        this.$refs.logform.reset();
      }
      // 關掉Dialog重新開啟，原先的表格判斷或資料要清除
      if (this.$refs.cycleform != undefined) {
        this.$refs.cycleform.reset();
        this.addparm.dataid = [];
        this.isDataidError = false;
      }
      // if (this.poolid == undefined) {
      //   this.$toast.info(`失敗：請先選擇養殖池`, {
      //     duration: 2000
      //   });
      //   return;
      // }
      //

      // 新增循環的池選擇
      var data = this.setNestedDisabled(_.cloneDeep(this.maindata), "");
      this.addPoolData = data;
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`)
        .then(res => {
          var items = res.data.filter(x => x.id == this.poolid);
          if (items.length == 1) {
            this.addDialog = true;
            this.add_volume = items[0].volume;
            this.addparm.estimated_survival_rate = 70;

            // 關掉Dialog再開啟不會重置scrollbar位置 
            setTimeout(()=>{
              if(document.getElementsByClassName('v-dialog--active')) {
                document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0;
              }
            },100)
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
    cancelDialog() {
      this.addDialog = false;
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
      console.log('valid',valid);
      if(this.addparm.dataid.length>0) {
        this.isDataidError = false;
      }else {
        this.isDataidError = true;
      }
      if(valid && !this.isDataidError) {
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
      }else {
        if(!this.addbasicDataOpen) {
          this.addbasicDataOpen = true;
        }
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
      console.log('select',selection,row)
      //清除
      this.$refs.circletable.clearSelection();
      //選到當前
      if (selection.length != 0) {
        this.$refs.circletable.toggleRowSelection(row);
      }
    },
    handleCurrentChange: async function(val) {
      console.log('current',val,this.currentDataId);
      //清除
      this.$refs.circletable.clearSelection();
      // this.eventData = []; //清除事件紀錄清單
      this.$refs.circletable.toggleRowSelection();
      // this.$refs.circletable.setCurrentRow(val);
      if(this.circleData.filter(x=>x.id==val.id).length==1) {
        var tempMain = this.circleData.filter(x=>x.id==val.id)[0].tempMain;
        var tempContent = this.circleData.filter(x=>x.id==val.id)[0].tempContent;
        tempMain = (tempMain==undefined)?{}:[];
        tempContent= (tempContent==undefined)?{}:[];
        this.passObj["tempMain"] = tempMain;
        this.passObj["tempContent"] = tempContent;
        this.resultListOpen = false;
        // this.currentDataId = val.id;
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
    // 循環清單點擊
    clickRow(val) {
      console.log('click',val);
      if(val.id==this.currentDataId) {
        // 與原本點選的相同，取消點選
        let data = _.cloneDeep(this.circleData);
        this.circleData = [];
        this.circleData = data;
        this.currentDataId = null;
      }else {
        //清除
        this.$refs.circletable.clearSelection();
        // this.eventData = []; //清除事件紀錄清單
        this.$refs.circletable.toggleRowSelection();
        // this.$refs.circletable.setCurrentRow(val);
        if(this.circleData.filter(x=>x.id==val.id).length==1) {
          var tempMain = this.circleData.filter(x=>x.id==val.id)[0].tempMain;
          var tempContent = this.circleData.filter(x=>x.id==val.id)[0].tempContent;
          tempMain = (tempMain==undefined)?{}:[];
          tempContent = (tempContent==undefined)?{}:[];
          tempMain = {
            "id": 30,
            "name_ch": "樣板A",
            "name_en": "template_a",
            "remark": "this is a test",
            "created_user": "jeff",
            "created_time": "2022-12-27 15:17:05",
            "updated_user": "jianwei.wen@idwater.com.tw",
            "updated_time": "2023-10-26 08:49:03"
          }
          tempContent = [
          {
            "phase_id": 1,
            "phase_name": "空池",
            "stepList": [
                {
                    "step_id": 23,
                    "step_name": "新增循環",
                    isConfirm:false,
                    // "execute_time": '2023-10-25 10:12:12',
                    // "isConfirm": true,
                },
                {
                    "step_id": '23_02',
                    "step_name": "其他",
                    // isConfirm:false,
                    "msg":'i am msg 2.',
                    // "execute_time": '2023-10-25 10:25:12',
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": '23_01',
                    "step_name": "其他",
                    // isConfirm:false,
                    "msg":'i am msg 1.',
                    // "execute_time": '2023-10-25 10:20:12',
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": 24,
                    "step_name": "設備正常",
                    // "execute_time": '2023-10-31 10:30:12',
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": 25,
                    "step_name": "消毒養殖池",
                    // "execute_time": '2023-10-31 10:50:12',
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": 26,
                    "step_name": "擺曝氣盤",
                    // "execute_time": '2023-11-01 01:50:12',
                    "execute_time": '',
                    "isConfirm": false,
                }
              ]
            },
            {
              "phase_id": 2,
              "phase_name": "養殖審核",
              "stepList": [
                {
                    "step_id": 27,
                    "step_name": "養殖審核1",
                    // "execute_time": '2023-11-01 01:50:12',
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": 28,
                    "step_name": "養殖審核2",
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": 29,
                    "step_name": "養殖審核4",
                    "execute_time": '',
                    "isConfirm": false,
                }
              ]
            },
            {
              "phase_id": 3,
              "phase_name": "備池",
              "stepList": [
                {
                    "step_id": 30,
                    "step_name": "備池1",
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": 31,
                    "step_name": "備池2",
                    "execute_time": '',
                    "isConfirm": false,
                }
              ]
            },
            {
              "phase_id": 4,
              "phase_name": "蓄水",
              "stepList": [
                {
                    "step_id": 32,
                    "step_name": "蓄水1",
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": 33,
                    "step_name": "蓄水2",
                    "execute_time": '',
                    "isConfirm": false,
                }
              ]
            },
            {
              "phase_id": 5,
              "phase_name": "做水",
              "stepList": [
                {
                    "step_id": 34,
                    "step_name": "做水1",
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": 35,
                    "step_name": "做水2",
                    "execute_time": '',
                    "isConfirm": false,
                }
              ]
            },
            {
              "phase_id": 6,
              "phase_name": "放養中",
              "stepList": [
                {
                    "step_id": 36,
                    "step_name": "放養中1",
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": 37,
                    "step_name": "放養中2",
                    "execute_time": '',
                    "isConfirm": false,
                }
              ]
            },
            {
              "phase_id": 7,
              "phase_name": "清池",
              "stepList": [
                {
                    "step_id": 38,
                    "step_name": "清池1",
                    "execute_time": '',
                    "isConfirm": false,
                },
                {
                    "step_id": 39,
                    "step_name": "清池2",
                    "execute_time": '',
                    "isConfirm": false,
                }
              ]
            },
          ]
          this.passObj["tempMain"] = tempMain;
          this.passObj["tempContent"] = tempContent;
          this.resultListOpen = false;
          this.resultCycleOpen = true;
          this.currentDataId = val.id;
        }
        // this.currentDataId = val.id;
      }
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
          console.log('template',this.template_all)
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
    // 批次執行Dialog
    mutiExecuteDialog() {
      this.mutiExecute = true;
      this.nowExeArea = this.maindata[0].node[0].id;
      this.nowTab = '執行';
      this.mutiExecuteData=[{
        pond_id: 50,
        pond_name: 'A2',
        status: '空池',
        item: '新增循環',
        item_id: 23,
        execute_time: '',
        isConfirm: false,
        msg:''
      },{
        pond_id: 51,
        pond_name: 'A3',
        status: '養殖審核',
        item: '養殖審核1',
        item_id: 27,
        execute_time: '',
        isConfirm: false,
        msg:''
        
      }];
      this.mutiConfirmData=[{
        pond_id: 49,
        pond_name: 'A1',
        status: '空池',
        item: '設備正常',
        item_id: 24,
        execute_time: '2023-10-25 11:22:11',
        isConfirm: false,
        msg:''
      },];
    },
    // 批次執行
    mutiExecuteStep() {
      let data = [];
      if(this.nowTab == '執行') {
        let mssssg = [];
        this.mutiExecuteData.forEach(m=>{
          if(m.checked) {
            mssssg.push(m.pond_name);
          }
        })
        if(mssssg.length>0) {
          if (confirm(`確認 ${mssssg.toString()} 已執行？`)) {
            this.mutiExecuteData.forEach(m=>{
              if(m.checked) {
                data.push(m);
                // m.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                if(m.item == '新增循環') {
                  m.item_id = '23_01';
                  m.item = '其他';
                  m.msg = 'i am msg1.'
                  m.checked = false;
                }else if(m.item == '養殖審核1') {
                  m.item_id = 28;
                  m.item = '養殖審核2'
                  m.checked = false;
                }
              }
            })
          }
        }
        
      }else {
        let mssssg = [];
        this.mutiConfirmData.forEach(m=>{
          if(m.checked) {
            mssssg.push(m.pond_name);
          }
        })
        if(mssssg.length>0) {
          if (confirm(`已確認 ${mssssg.toString()} 已執行？`)) {
            this.mutiConfirmData.forEach((m,mid)=>{
              if(m.checked) {
                data.push(m);
                // if(m.item == '設備正常') {
                //   m.item_id = 25;
                //   m.item = '消毒養殖池';
                //   m.msg = ''
                //   m.checked = false;
                // }
                this.mutiConfirmData.splice(mid,1);
              }
            })
          }
        }
        
        
        
      }
    },
    // 新增循環的池選擇
    setNestedDisabled: function (obj, name, onlyshowlevel = 1) {
        //全部都設成disabled
        var deleteindex = [];
        var objj = obj;
        objj.forEach((itm, index) => {
            // console.log(itm.name);//所有node(含leaf)的名稱
            itm.parent =
                itm != undefined && itm.hasOwnProperty("parent")
                    ? itm.parent + "_" + name
                    : name;
            const nodelst = ["1", "2"]; //第1、2層
            if (nodelst.filter(x => x == itm.level) > 0) {
                itm.id = itm.name + "_" + itm.id;
            }
            if (itm.visible == false) {
                //visible的不顯示
                deleteindex.push(index);
            }
            if (itm.hasOwnProperty("node")) {
                this.setNestedDisabled(itm.node, itm.name, onlyshowlevel);
            }
        });
        // for (let i = 0; i < deleteindex.length; i++) {
        //   const element = deleteindex[i];
        //   obj.splice(element, 1);
        // }
        //刪除 走道
        for (var i = deleteindex.length - 1; i >= 0; i--) {
            objj.splice(deleteindex[i], 1);
        }
        return objj;
    },
    //新增循環的池選擇，計算資料範圍
    nestedMain: function (obj, level) {
      // console.log('obj',obj);
        obj.forEach(itm => {
            if (itm.level == level) {
                if (itm.hasOwnProperty("node")) {
                    delete itm.node;
                }
            }
            if (itm.hasOwnProperty("node")) {
                this.nestedMain(itm.node, level);
            }
            
        });
        return obj;
    },
    // 新增循環的池選擇，資料改變時，傳出數值
    changeEvent:function(){

      console.log('dataid',this.dataid)
      if(this.addparm.dataid.length>0) {
        this.isDataidError = false;
      }
      this.$emit('scopeSel_data',this.dataid);
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
    // await this._pageCheck(); //驗證頁面是否可檢視
    await this.getWeather(); //氣象
    await this.getOptData(); //選項
    if(this.poolid!==''&&this.poolid!==undefined) {
      this.get_scopeData(this.poolid);
    }else {
      this.poolid = 49;
      this.get_scopeData(this.poolid);
      this.getCircleData();
    }
  },
  watch: {
    resultListOpen: {
      // 開合面板循環清單的刪除會跑版 
      handler() {
        this.$nextTick(()=>{
          this.$refs.circletable.doLayout();
        })
      },
      deep: true
    }
  },
  computed: {
    // 新增循環的池選擇
    maindataScope:function(){
      var data = _.cloneDeep(this.addPoolData);
      var level = 3;
      return this.nestedMain(data,level);
    }
  }
};
</script>

<style lang="scss" scoped>
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
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td {
  color: #000000;
  background-color: #fff09d !important;
}
.v-card.bg-card {
  .btn-groups {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    button {
      margin-right: 8px;
    }
  }
  .result {
    padding: 8px 12px;
    .v-card.result-card {
      .card-title {
        border-bottom: 1px solid rgba(0,0,0,0.1);
        padding: 0;
        margin: 12px 16px;
        .title {
          width: 100%;
          .v-card__title {
            font-size: 1rem;
            padding: 12px;
          }
        }
        .chevron {
          .v-icon {
            color: $color-dark;
          }
        }
      }
      button {
        width: 24px;
        height: 24px;
        background-color: #006AA6;
        border-radius: 4px;
        position: relative;
        margin: 4px;
        transition: all 0.3s;
        &:hover {
            background-color: lighten($color: #006AA6, $amount: 3);
        }
        .theme--light.v-icon {
            font-size: 1rem;
            color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
        &.delete {
          background-color: #A60017;
          &:hover {
              background-color: lighten($color: rgba(#A60017,0.9), $amount: 3);
          }
        }
      }
    }
  }
  
}

.close {
  width: 24px;
  height: 24px !important;
  & .v-icon {
    margin: 0;
    // color: $color-accent !important;
  }
}
::v-deep {
  .el-table, .el-table__expanded-cell,.el-table tr,.el-table th.el-table__cell {
    background: $color-lighten;
    background-color: $color-lighten;
  }
  .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  .el-table .el-table__header-wrapper td.el-table__cell, .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }

  .el-table .cell {
    padding: 0 16px;
  }
  .el-table thead {
    color: rgba(0,0,0,0.6);
    font-size: 0.8rem;
  }
  .el-table tr.el-table__row--level-0 {
    font-size: 0.65rem;
    height: 40px;
    font-weight: bold;
    color: $color-dark;
    
    & td {
      background-color: $color-primary-25;
      padding: 0 16px;
    }
    & td:nth-child(1) {
      border-radius: 4px 0 0 0;
    }
    & td:last-child {
      border-radius: 0 4px 0 0;
    }
    & i::before {
      color: $color-dark;
      font-weight: bold;
      font-size: 1rem;
    }
  }
  .el-table__row.el-table__row--level-1 .cell {
    // font-size: 0.875rem;
    // min-height: 48px;
    display: flex;
    align-items: center;
    padding: 8px;
  }
  .el-table__body tr.el-table__row.el-table__row--level-1.hover-row>td.el-table__cell {
    background-color: transparent;
  }
  .el-table__body tr.hover-row>td.el-table__cell,
  .el-table__body tr.current-row>td.el-table__cell {
    background-color: rgba($color-primary-25,0.3);
  }
  .el-checkbox.is-disabled {
    display: none;
  }
  .el-table-column--selection .cell {
    justify-content: center;
  }


  .theme--light.v-input {
    margin-top: 0;
  }
  
  .theme--light.v-text-field--filled > .v-input__control > .v-input__slot,.theme--light.v-text-field--filled:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot:hover {
    background: transparent;
  }
  .v-text-field--filled.v-input--dense > .v-input__control > .v-input__slot,.v-text-field--filled > .v-input__control > .v-input__slot {
    min-height: 36px;
  }
  .v-text-field--filled:not(.v-text-field--single-line) input {
    margin-top: 0;
  }
  .v-input--is-label-active.v-text-field--filled:not(.v-text-field--single-line) input {
    margin-top: 4px;
  }
  .v-text-field input {
    // padding: 0;
  }
  .v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
    align-items: center;
  }
  .v-text-field--filled.v-input--dense .v-label {
    top: 8px;
  }
  .v-text-field--filled.v-input--dense .v-label.v-label--active {
    top: 0;
    color: $color-form;
  }
  
  .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
      box-shadow: none;
      border: 1px solid $color-form;
  }
  .theme--light.v-icon {
    color: $color-form;
  }
  .theme--light.v-text-field > .v-input__control > .v-input__slot:before,.theme--light.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before {
    border-color: $color-form;
  }
  .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo) .v-input__append-inner,
  .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo) .v-input__prepend-outer {
    margin-top: 8px;
  }
  .theme--light.v-input--is-disabled input {
    background-color: transparent;
  }
  .theme--light.v-input--is-disabled.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before,
  .theme--light.v-text-field.v-input--is-disabled .v-input__slot::before {
    border: 1px solid $color-dark-25;
    border-width: thin 0 0 0;
  }
  .v-label.theme--light {
    color: $color-dark;
  }
  .v-label.v-label--active.theme--light {
    color: $color-form;
  }
  .v-select.v-text-field--enclosed:not(.v-text-field--single-line):not(.v-text-field--outlined) .v-select__selections {
    padding-top: 0;
  }
  .v-label.v-label--is-disabled.theme--light {
    color: $color-dark-25;
  }
  
  .v-input--dense > .v-input__control > .v-input__slot {
    margin-bottom: 8px;
  }
  .v-text-field.v-input--dense:not(.v-text-field--outlined) input {
    padding: 4px 0;
  }
}

@media(max-width:960) {
  .v-card.bg-card {
    .btn-groups {
      justify-content: flex-start;
    }
  } 

}
</style>
