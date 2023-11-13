<template>
    <div>
        <v-card class="kb" 
            :style="{'minHeight':`${windowHeight>880?'90vh':'87vh'}`}">
            <div class="card-title">
                <v-row style="margin-bottom: 0;">
                    <!-- <div class="title">
                        <v-icon>mdi-database-edit-outline</v-icon>
                        <v-card-title>知識庫-鷹眼 v2.0</v-card-title>
                    </div> -->
                </v-row>
            </div>
            <div class="content">
                <!-- 搜尋 -->
                <div class="search">
                    <v-row class="my-0" 
                        :style="{'height':`${windowWidth<959.58?'260px':'initial'}`,
                            'overflowY':`${windowWidth<959.58?'scroll':'initial'}`,
                            'overflowX':`${windowWidth<959.58?'hidden':'initial'}`,
                            'display':`${windowWidth<959.58?'initial':'flex'}`}">
                        <!-- 選擇池 -->
                        <v-col cols="12" md="2" sm="12"
                            :style="{'padding':`${windowWidth>959.58?'12px':'4px 12px'}`,
                                    'marginTop':`${windowWidth>959.58?'0':'-16px'}`}">
                            <locate-select :dataScope="'pool'" defaultSelect="" :isMulti="false" @scopeSel_data="get_scopeData($event)"></locate-select>
                        </v-col>
                        <!-- 選擇參數 -->
                        <v-col cols="12" md="3" sm="12"
                        :style="{'padding':`${windowWidth>959.58?'12px':'4px 12px'}`}">
                            <v-autocomplete
                                :label="(this.$auth.$state.user == null) ? '帶入歷史紀錄(登入後使用)' : '帶入歷史紀錄'"
                                v-model="querrySelected"
                                :items="nowSelectDataLst"
                                item-value="created_time"
                                dense filled
                                hide-details
                                clearable solo
                                class="mt-1"
                                :disabled="this.$auth.$state.user == null || nowSelectPool==''"
                                @change="getSelectData($event)">
                                <!-- <template slot="item" slot-scope="data">({{data.item.id}})-{{ (data.item.input_data.BaseParm.InspectedDate)?data.item.input_data.BaseParm.InspectedDate.substring(5,10).replace('-','/') :'' }}-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                                <template slot="selection" slot-scope="data">({{data.item.id}})-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template> -->
                                <template slot="item" slot-scope="data">({{data.item.id}})-{{ (data.item.input_data.BaseParm.InspectedDate)?data.item.input_data.BaseParm.InspectedDate.substring(5,10).replace('-','/') :'' }}-{{ data.item.input_data.BaseParm.InspectedTime }}</template>
                                <template slot="selection" slot-scope="data">({{data.item.id}})-{{ (data.item.input_data.BaseParm.InspectedDate)?data.item.input_data.BaseParm.InspectedDate.substring(5,10).replace('-','/') :'' }}-{{ data.item.input_data.BaseParm.InspectedTime }}</template>
                                
                                <!-- <template slot="append">
                                    <v-icon :disabled="!this.querrySelectedLst['1']" color="red" @click="delQuerry('1')" title="刪除">mdi-delete</v-icon>
                                    <v-icon :disabled="!this.querrySelectedLst['1']" color="green" @click="patchQuerry('1')" title="覆蓋">mdi-pen</v-icon>
                                </template> -->
                            </v-autocomplete>
                        </v-col>
                        <!-- 查詢/清空/控制項 - result版面收合 -->
                        <v-col cols="12" md="7" sm="12"
                            :style="{'padding':`${windowWidth>959.58?'12px':'4px 12px'}`}"
                            style="display: flex;justify-content: space-between;align-items: center;">
                            <div class="btn-groups">
                                <!-- <v-btn
                                    tile
                                    :disabled="querrySelected==''||querrySelected==null"
                                    @click="importQuerry()"
                                    class="btn-primary">
                                    查詢
                                </v-btn> -->
                                <!-- <v-btn
                                    tile
                                    :disabled="querrySelected==''||querrySelected==null"
                                    @click="importQuerry()"
                                    class="btn-primary">
                                    帶入數據
                                </v-btn> -->
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <button class="btn-primary v-btn v-btn--is-elevated v-btn--has-bg v-btn--tile theme--light v-size--default" @click="importBasicData();" v-bind="attrs" v-on="on">
                                            基本資料
                                        </button>
                                    </template>
                                    <span>帶入基本資料</span>
                                </v-tooltip>
                                <v-btn
                                    tile
                                    class="btn-secondary reset"
                                    @click="resetParm();getSelectData(null)">
                                    清空
                                </v-btn>
                                <!-- <v-btn
                                    fab dark x-small
                                    color="blue-grey"
                                    @click="importBasicData();">
                                    <v-icon>
                                        mdi-database-import
                                    </v-icon>
                                </v-btn> -->
                                
                                
                            </div>
                            <!-- 控制項 - result版面收合 -->
                            <div class="control">
                                <v-icon v-if="!nowExpand" @click="expandPanel(true)" title="展開">mdi-view-dashboard</v-icon>
                                <v-icon v-if="nowExpand" @click="expandPanel(false)" title="收縮">mdi-view-stream</v-icon>
                            </div>
                        </v-col>
                        <!-- 控制項 - result版面收合 -->
                        <!-- <v-col v-if="windowWidth>959.58" cols="12" md="4" style="display: flex;justify-content: flex-end;"
                        :style="{'padding':`${windowWidth>959.58?'12px':'4px 12px'}`}">
                            <v-icon v-if="!nowExpand" @click="expandPanel(true)" title="展開">mdi-view-dashboard</v-icon>
                            <v-icon v-if="nowExpand" @click="expandPanel(false)" title="收縮">mdi-view-stream</v-icon>
                        </v-col> -->
                        <!-- AI 建議 警示 windowWidth<959.58 固定在上方 -->
                        <v-col cols="12" md="6" sm="12" id="ai"  v-show="windowWidth< 959.98&&isSearch"  style="padding-right: 0px;padding-left: 0;padding-bottom: 8px;">
                            <div class="result" style="padding-right: 0px;">
                                <v-card class="result-card ai-suggestion" style="padding-top: 8px;">
                                    <div class="content">
                                        <div class="table-content" style="height: 280px;overflow: hidden;">
                                            <v-expansion-panels accordion multiple v-model="panel.panel_row30" id="aiwatermin">
                                                <v-expansion-panel  class="my-1">
                                                    <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">
                                                        <div style="display: flex;align-items: center;">
                                                            <div class="circle" v-if="suggData.WaterQuality.length+suggData.Observation.length>0">
                                                                <span>{{ suggData.WaterQuality.length+suggData.Observation.length }}</span>
                                                            </div>
                                                            
                                                            警示
                                                        </div>
                                                    </v-expansion-panel-header>
                                                    <v-expansion-panel-content>
                                                        <v-card tile>
                                                            <v-card-text class="pa-3 mx-0" style="padding-right: 4px !important;">
                                                                <v-simple-table fixed-header dense height="200px">
                                                                    <template v-slot:default>

                                                                        <tbody>
                                                                            <tr v-if="suggData.WaterQuality.length>0" style="background-color:#E6B8BE;font-weight: bold;"><td colspan="3">水質</td></tr>
                                                                            <tr
                                                                            v-for="item in suggData.WaterQuality"
                                                                            :key="'water-'+item.id"
                                                                            >
                                                                                <td v-html="setBR(item.status)"></td>
                                                                                <td><div class="alertOpen" style="cursor: pointer;" @click="openDialog('水質',item)"><v-icon>mdi-dots-vertical-circle-outline</v-icon></div></td>

                                                                            </tr>
                                                                            <tr v-if="suggData.Observation.length>0" style="background-color:#E6B8BE;font-weight: bold;"><td colspan="3">觀察網</td></tr>

                                                                            <tr
                                                                            v-for="item in suggData.Observation"
                                                                            :key="'Obser-'+item.id"
                                                                            >
                                                                            <td v-html="setBR(item.status)"></td>
                                                                            <td><div class="alertOpen" style="cursor: pointer;" @click="openDialog('觀察網',item)"><v-icon>mdi-dots-vertical-circle-outline</v-icon></div></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </template>
                                                                </v-simple-table>
                                                            </v-card-text>
                                                        </v-card>
                                                    </v-expansion-panel-content>
                                                </v-expansion-panel>
                                            </v-expansion-panels>
                                        </div>
                                    </div>
                                </v-card>
                            </div>    
                        </v-col>
                    </v-row>   
                </div>
                <!-- 查詢結果 -->
                <div class="result" style="position: relative;"
                    :style="{'height':`${windowWidth<959.58?'62vh':'initial'}`,
                            'overflowY':`${windowWidth<959.58?'scroll':'initial'}`,
                            'overflowX':`${windowWidth<959.58?'hidden':'initial'}`,
                            'marginTop':`${windowWidth<959.58&&isSearch?'8px':'4px'}`}">
                    <v-row style="margin-bottom: 0;">
                        <!-- 參數設定 -->
                        <v-col cols="12" md="6" sm="12" id="params">
                            <v-card class="result-card column">
                                <!-- 表頭標題+按鈕群 -->
                                <div class="card-title"
                                    :class="{'next-line':windowWidth<425 && (nowSelectPool!==''&&nowSelectPool!==null&&querrySelected!==''&&querrySelected!==null)}">
                                    <div class="title">
                                        <v-icon>mdi-pencil</v-icon>
                                        <v-card-title>參數設定</v-card-title>
                                    </div>
                                    <div class="btn-groups">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="btn-add search" @click="postParm(false,null,true)" v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-magnify</v-icon>
                                                </button>
                                            </template>
                                            <span>查詢</span>
                                        </v-tooltip>
                                        <v-tooltip bottom v-if="nowSelectPool!==''&&nowSelectPool!==null">
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="btn-add" @click="postParm(true)" v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-plus</v-icon>
                                                </button>
                                            </template>
                                            <span>新增並查詢</span>
                                        </v-tooltip>
                                        <v-tooltip bottom v-if="nowSelectPool!==''&&nowSelectPool!==null&&querrySelected!==''&&querrySelected!==null&&isSearch">
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="btn-add save" @click="patchQuerry(nowSelectPool)" v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-check</v-icon>
                                                </button>
                                            </template>
                                            <span>儲存並查詢</span>
                                        </v-tooltip>
                                        <v-tooltip bottom v-if="nowSelectPool!==''&&nowSelectPool!==null&&querrySelected!==''&&querrySelected!==null&&isSearch">
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="btn-add delete" @click="delQuerry(nowSelectPool)" v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-trash-can</v-icon>
                                                </button>
                                            </template>
                                            <span>刪除</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <button v-if="!settingOpen" class="only-icon" @click="settingOpen=!settingOpen" v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-star-outline</v-icon>
                                                </button>
                                                <button v-else class="only-icon"  @click="settingOpen=!settingOpen" v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-star</v-icon>
                                                </button>
                                            </template>
                                            <span>錨點列表</span>
                                        </v-tooltip>
                                    </div>
                                </div>
                                <div class="content">
                                    <!-- 錨點設置 -->
                                    <v-row v-if="settingOpen">
                                        <!-- <a href="javascript:void(0)" class="tag" @click="goAnchor('#basic')"> 養殖基本數據 |</a> 
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#breed')"> 養殖參數 |</a> 
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#feed')"> 飼料參數 |</a> 
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#waterperiod')"> 做水期參數 |</a> 
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#water')"> 水質資訊 |</a> 
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#net')"> 觀察網 |</a> 
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#bacteria')"> 水中菌項資訊 </a> -->
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#feed')"> 飼料參數 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#water')"> 水質資訊 |</a> 
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#bacteria')"> 水中菌項資訊 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#bacteriaDisease')"> 傳染病 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#net')"> 觀察網資訊 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#basic')"> 養殖基本數據 |</a> 
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#breed')"> 養殖參數 |</a> 
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#waterperiod')"> 做水期參數 |</a>
                                        
                                    </v-row>
                                    <div class="table-content"
                                        :style="{'minHeight':`${windowHeight>880?'75vh':'64vh'}`,
                                                'height':`${windowWidth>959.58?'49vh':'100%'}`}">
                                        <!-- 飼料參數 -->
                                        <v-expansion-panels id="feed" accordion multiple v-model="panel.panel_row13">
                                            <v-expansion-panel  class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">飼料參數</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-form ref="FeedParm">
                                                                <v-row class="item-row">
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的飼料紀錄中所使用的飼料粗蛋白參數">粗蛋白含量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="FeedParm['CrudeProteinPct']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['CrudeProteinPct']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">粗蛋白含量</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0 text-center" slot="prepend" title="過去一天最後一筆的飼料紀錄中所使用的飼料含氮量參數">含氮量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="FeedParm['Nitrogen']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['Nitrogen']" dense hide-details class="mt-0 blue lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">含氮量(%)</span></v-text-field> -->
                                                                    </v-col>
                                                                    
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的飼料紀錄中所使用的砂糖純度參數">砂糖(碳源)純度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="FeedParm['SugarSourcePurity']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['SugarSourcePurity']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖(碳源)純度</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的飼料紀錄中所使用的砂糖含碳量參數">砂糖(碳源)含碳量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="FeedParm['SugarSourceCarbonPct']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['SugarSourceCarbonPct']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖(碳源)含碳量</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的飼料紀錄中所使用的飼料CN比參數">飼料CN比</span>
                                                                                <!-- <span class="pa-0 ma-0" slot="prepend">飼料CN比(依照飼料)</span> -->
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="FeedParm['FeedCN']" type="number" dense hide-details class="mt-0"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['FeedCN']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">飼料CN比(依照飼料)</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的飼料紀錄中飼料的投餵量">上一餐飼料量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                                <v-text-field v-model.number="FeedParm['LastFeedInput']" type="number"  dense hide-details class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft" :title="FeedParm['LastFeedInput']&&typeof(FeedParm['LastFeedInput'])=='number'?((FeedParm['LastFeedInput']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['LastFeedInput']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">上一餐飼料量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                    <!-- <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <div class="date-time-picker">
                                                                                    <span style="font-size: 16px;margin-right: 9px;">上一餐時間</span>
                                                                                </div>
                                                                                    
                                                                            </v-col> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <div class="date-time-picker">
                                                                                    <a-date-picker v-model="FeedParm['LastFeedDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk" style="min-width: none;width: calc(100% - 9px)" />
                                                                                </div>
                                                                                    
                                                                            </v-col>
                                                                        </v-row> -->
                                                                            

                                                                        <!-- <div class="date-time-picker">
                                                                            <span style="font-size: 16px;margin-right: 9px;">上一餐時間</span>
                                                                            <a-date-picker v-model="FeedParm['LastFeedDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk" style="min-width: 0 !important;width: calc(100% - 9px)" />
                                                                        </div> -->
                                                                    <!-- </v-col> -->
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天所有飼料紀錄中飼料量的總和">當日總飼料量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                                <v-text-field v-model.number="FeedParm['LastFeedOfDay']" type="number" dense hide-details class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft" :title="FeedParm['LastFeedOfDay']&&typeof(FeedParm['LastFeedOfDay'])=='number'?((FeedParm['LastFeedOfDay']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['LastFeedOfDay']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">當日飼料量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="養殖起始日~資料日期時間內所有飼料量的總和">累計飼料量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                                
                                                                                <v-text-field v-model.number="FeedParm['CumulativeFeedAmountInput']" type="number" dense hide-details class="mt-0 sum-field" append-outer-icon="mdi-plus" @click:append-outer="addFeedQty()"></v-text-field>
                                                                                <a-tooltip placement="topLeft" :title="FeedParm['CumulativeFeedAmountInput']&&typeof(FeedParm['CumulativeFeedAmountInput'])=='number'?((FeedParm['CumulativeFeedAmountInput']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                                <!-- <v-btn class="btn-icon" @click="addFeedQty()"><v-icon>mdi-plus</v-icon></v-btn> -->
                                                                                <!-- <v-text-field 
                                                                                    v-model.number="FeedParm['CumulativeFeedAmountInput']" 
                                                                                    type="number" dense hide-details 
                                                                                    class="mt-0 sum-field">
                                                                                    <span class="pa-0 ma-0" slot="append">kg</span>
                                                                                    <template v-slot:append>
                                                                                        <v-icon  @click="addFeedQty">
                                                                                            mdi-plus
                                                                                        </v-icon>
                                                                                    </template>
                                                                                </v-text-field> -->
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['CumulativeFeedAmountInput']" type="number" dense hide-details class="mt-0 sum-field" append-outer-icon="mdi-plus" @click:append-outer="addFeedQty()"><span class="pa-0 ma-0" slot="prepend">累計飼料量</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">下餐增料百分比</span>
                                                                                <!-- <span class="pa-0 ma-0" slot="prepend">下一餐飼料增加百分比</span> -->
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-select v-model="BaseParm['NextFeedIncrementPct']" type="number" clearable :items="optData.NextFeedIncrementPct" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-select v-model="BaseParm['NextFeedIncrementPct']" type="number" clearable :items="optData.NextFeedIncrementPct" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">下一餐飼料增加百分比</span></v-select> -->
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row class="item-row">
                                                                    <v-col cols=12 md="12" sm="12">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="3" sm="3">
                                                                                <div class="date-time-picker">
                                                                                    <span style="font-size: 16px;margin-right: 9px;padding-left: 4px;" title="過去一天最後一筆的飼料投餵時間">上一餐時間</span>
                                                                                </div>
                                                                                    
                                                                            </v-col> 
                                                                            <v-col cols="12" md="9" sm="9">
                                                                                <div class="date-time-picker">
                                                                                    <a-date-picker v-model="FeedParm['LastFeedDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk" style="min-width: none;width: calc(100% - 9px);margin-left: 4px;margin-right: 16px;" />
                                                                                </div>
                                                                                    
                                                                            </v-col>
                                                                        </v-row>
                                                                            

                                                                        <!-- <div class="date-time-picker">
                                                                            <span style="font-size: 16px;margin-right: 9px;">上一餐時間</span>
                                                                            <a-date-picker v-model="FeedParm['LastFeedDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk" style="min-width: 0 !important;width: calc(100% - 9px)" />
                                                                        </div> -->
                                                                    </v-col>
                                                                </v-row>
                                                            </v-form>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 水質資訊 -->
                                        <v-expansion-panels id="water" accordion multiple v-model="panel.panel_row21">
                                            <v-expansion-panel  class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">
                                                    <div class="item-title" style="display: flex;align-items: center;">
                                                        水質資訊
                                                        <!-- <v-tooltip bottom>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <button class="btn-icon just-icon" v-bind="attrs" v-on="on">
                                                                    <v-icon style="color:#006AA6 !important;font-size: 1.2rem;">mdi-information-outline</v-icon>
                                                                </button>
                                                                
                                                            </template>
                                                            <span>24小時內的資料</span>
                                                        </v-tooltip> -->
                                                    </div>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-form ref="WaterQualityData">
                                                                <v-row class="item-row item">
                                                                    <v-col cols="12" md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的溶氧資料"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Do')"></v-badge>溶氧Do</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['Do']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Do',WaterQualityData['Do'])"><span slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的酸鹼值資料"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('pH')"></v-badge>酸鹼值(pH)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['pH']" type="number" dense hide-details class="mt-0" @blur="valueCheck('pH',WaterQualityData['pH'])"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0" slot="prepend" title="過去一天最後一筆的水溫資料"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Temp')"></v-badge>水溫</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['Temp']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Temp',WaterQualityData['Temp'])"><span slot="append">°C</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0" slot="prepend" title="以上一餐時間為基準，過去一天最後一筆的水溫資料"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('LastTemp')"></v-badge>上一餐水溫</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['LastTemp']" type="number" dense hide-details class="mt-0" @blur="valueCheck('LastTemp',WaterQualityData['LastTemp'])"><span slot="append">°C</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Salinity')"></v-badge>鹽度</span>
                                                                            </v-col>
                                                                            <v-col cols="12"  md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['Salinity']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Salinity',WaterQualityData['Salinity'])"><span slot="append">ppt</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <!-- <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('AmmoniaN')"></v-badge>氨氮NH<sub>3</sub>/NH<sub>4</sub>+</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['AmmoniaN']" type="number" dense hide-details class="mt-0" @blur="valueCheck('AmmoniaN',WaterQualityData['AmmoniaN'])"><span slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('NO2')"></v-badge>亞硝酸鹽NO<sub>2</sub>-</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['NO2']" type="number" dense hide-details class="mt-0" @blur="valueCheck('NO2',WaterQualityData['NO2'])"><span slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col> -->
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Mg')"></v-badge>鎂離子Mg<sub>2</sub>+</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['Mg']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Mg',WaterQualityData['Mg'])"><span slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Ca')"></v-badge>鈣離子Ca<sub>2</sub>+</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['Ca']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Ca',WaterQualityData['Ca'])"><span slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Alk')"></v-badge>鹼度Alk</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['Alk']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Alk',WaterQualityData['Alk'])"><span slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的氨氮資料">氨氮NH<sub>3</sub>/NH<sub>4</sub>+</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['AmmoniaN']" type="number" dense hide-details class="mt-0" @blur="valueCheck('AmmoniaN',WaterQualityData['AmmoniaN'])"><span slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的亞硝酸鹽資料">亞硝酸鹽NO<sub>2</sub>-</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="WaterQualityData['NO2']" type="number" dense hide-details class="mt-0" @blur="valueCheck('NO2',WaterQualityData['NO2'])"><span slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">水的顏色</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-select v-model="WaterQualityData['WaterColor']" clearable :items="optData.WaterColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                </v-row>
                                                                <!-- <v-text-field v-model.number="WaterQualityData['Do']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Do',WaterQualityData['Do'])"><span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Do')"></v-badge>溶氧Do(ppm)</span></v-text-field>
                                                                <v-text-field v-model.number="WaterQualityData['pH']" type="number" dense hide-details class="mt-0" @blur="valueCheck('pH',WaterQualityData['pH'])"><span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('pH')"></v-badge>酸鹼值(pH)</span></v-text-field>
                                                                <v-text-field v-model.number="WaterQualityData['Temp']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Temp',WaterQualityData['Temp'])"><span class="pa-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Temp')"></v-badge>水溫(°C)</span></v-text-field>
                                                                <v-text-field v-model.number="WaterQualityData['LastTemp']" type="number" dense hide-details class="mt-0" @blur="valueCheck('LastTemp',WaterQualityData['LastTemp'])"><span class="pa-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('LastTemp')"></v-badge>上一餐水溫(°C)</span></v-text-field>
                                                                <v-text-field v-model.number="WaterQualityData['Salinity']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Salinity',WaterQualityData['Salinity'])"><span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Salinity')"></v-badge>鹽度(ppt)</span></v-text-field>
                                                                <v-text-field v-model.number="WaterQualityData['AmmoniaN']" type="number" dense hide-details class="mt-0" @blur="valueCheck('AmmoniaN',WaterQualityData['AmmoniaN'])"><span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('AmmoniaN')"></v-badge>氨氮NH3/NH4+(ppm)</span></v-text-field>
                                                                <v-text-field v-model.number="WaterQualityData['NO2']" type="number" dense hide-details class="mt-0" @blur="valueCheck('NO2',WaterQualityData['NO2'])"><span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('NO2')"></v-badge>亞硝酸鹽NO2-(ppm)</span></v-text-field>
                                                                <v-text-field v-model.number="WaterQualityData['Mg']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Mg',WaterQualityData['Mg'])"><span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Mg')"></v-badge>鎂離子Mg2+(ppm)</span></v-text-field>
                                                                <v-text-field v-model.number="WaterQualityData['Ca']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Ca',WaterQualityData['Ca'])"><span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Ca')"></v-badge>鈣離子Ca2+(ppm)</span></v-text-field>
                                                                <v-text-field v-model.number="WaterQualityData['Alk']" type="number" dense hide-details class="mt-0" @blur="valueCheck('Alk',WaterQualityData['Alk'])"><span class="pa-0 ma-0" slot="prepend"><v-badge title="紅：危險值，橘：警告值，綠：正常值" inline :color="getColor('Alk')"></v-badge>鹼度Alk(ppm)</span></v-text-field>
                                                                <v-text-field v-if="false"  dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">水的顏色</span></v-text-field>
                                                                <v-select v-model="WaterQualityData['WaterColor']" clearable :items="optData.WaterColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">水的顏色</span></v-select> -->
                                                                
                                                            </v-form>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 水中菌相資訊 -->
                                        <v-expansion-panels id="bacteria" accordion multiple v-model="panel.panel_row23">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">水中菌相資訊</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-form ref="BacteriaData">
                                                                <v-row class="item-row">
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">生物絮團</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BacteriaData['Biofloc']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">ml</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['Biofloc']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">生物絮團</span><span class="pa-0 ma-0" slot="append">ml</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的總菌數(total_plate_count)">總菌</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BacteriaData['TotalPlateCount']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['Biofloc']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">生物絮團</span><span class="pa-0 ma-0" slot="append">ml</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的枯草桿菌(bacillus_subtilis)">枯草桿菌</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BacteriaData['BacillusSubtilis']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['BacillusSubtilis']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">枯草桿菌</span><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的溶藻弧菌(白菌)(vibrio_alginolyticus)">溶藻弧菌(白)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BacteriaData['VibrioAlginolyticus']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['VibrioAlginolyticus']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">溶藻弧菌(白)</span><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的創傷弧菌(藍菌)(vibrio_vulnificus)">創傷弧菌(藍)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BacteriaData['VibrioVulnificus']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['VibrioVulnificus']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">創傷弧菌(藍)</span><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的腸炎弧菌(紫菌)(vibrio_enteritidis)">腸炎弧菌(紫)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BacteriaData['VibrioEnteritidis']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>        
                                                                        <!-- <v-text-field v-model.number="BacteriaData['VibrioEnteritidis']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">腸炎弧菌(紫)</span><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的霍亂弧菌(靛)(vibrio_cholerae)">霍亂弧菌(靛)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BacteriaData['VibrioCholerae']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        
                                                                        <!-- <v-text-field v-model.number="BacteriaData['VibrioCholerae']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">霍亂弧菌(靛)</span><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field> -->
                                                                    </v-col>
                                                                    <!-- <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">疾病感染</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-select
                                                                                    v-model="bacteriaSelect"
                                                                                    :items="bacteriaAll"
                                                                                    :menu-props="{ maxHeight: '400' }"
                                                                                    multiple
                                                                                    
                                                                                    item-value="bacteriaAll"
                                                                                    @change="select($event)"
                                                                                    filled dense hide-details class="mt-0"
                                                                                    >
                                                                                    
                                                                                    <template
                                                                                        v-slot:item="{ item }">
                                                                                        <v-icon 
                                                                                            v-if="bacteriaSelect.includes(item)" 
                                                                                            color="primary" 
                                                                                            class="mr-3">
                                                                                            mdi-checkbox-marked
                                                                                        </v-icon>
                                                                                        <v-icon v-else class="mr-3">
                                                                                            mdi-checkbox-blank-outline
                                                                                        </v-icon>
                                                                                        {{ item.split('Is')[1] }}
                                                                                    </template>
                                                                                    <template
                                                                                        v-slot:selection="{ item }">
                                                                                        
                                                                                        {{ item.split('Is')[1] }},
                                                                                    </template>
                                                                                </v-select>
                                                                            </v-col>
                                                                        </v-row> -->
                                                                        <!-- <v-select
                                                                            v-model="bacteriaSelect"
                                                                            :items="bacteriaAll"
                                                                            :menu-props="{ maxHeight: '400' }"
                                                                            multiple
                                                                            clearable
                                                                            item-value="bacteriaAll"
                                                                            @change="select($event)"
                                                                            filled dense hide-details class="mt-0"
                                                                            >
                                                                            <span class="pa-0 ma-0" slot="prepend">疾病感染</span>
                                                                            <template
                                                                                v-slot:item="{ item }">
                                                                                <v-icon 
                                                                                    v-if="bacteriaSelect.includes(item)" 
                                                                                    color="primary" 
                                                                                    class="mr-3">
                                                                                    mdi-checkbox-marked
                                                                                </v-icon>
                                                                                <v-icon v-else class="mr-3">
                                                                                    mdi-checkbox-blank-outline
                                                                                </v-icon>
                                                                                {{ item.split('Is')[1] }}
                                                                            </template>
                                                                            <template
                                                                                v-slot:selection="{ item }">
                                                                                
                                                                                {{ item.split('Is')[1] }},
                                                                            </template>
                                                                        </v-select> -->
                                                                    <!-- </v-col> -->
                                                                </v-row>

                                                                
                                                                <!-- <v-text-field v-model.number="BacteriaData['TotalPlateCount']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">總菌(CFU)</span></v-text-field>
                                                                <v-text-field v-model.number="BacteriaData['BacillusSubtilis']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">枯草桿菌(CFU)</span></v-text-field>
                                                                <v-text-field v-model.number="BacteriaData['VibrioAlginolyticus']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">溶藻弧菌(白)(CFU)</span></v-text-field>
                                                                <v-text-field v-model.number="BacteriaData['VibrioVulnificus']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">創傷弧菌(藍)(CFU)</span></v-text-field>
                                                                <v-text-field v-model.number="BacteriaData['VibrioEnteritidis']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">腸炎弧菌(紫)(CFU)</span></v-text-field>
                                                                <v-text-field v-model.number="BacteriaData['VibrioCholerae']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">霍亂弧菌(靛)(CFU)</span></v-text-field>
                                                                
                                                                <v-select
                                                                    v-model="bacteriaSelect"
                                                                    :items="bacteriaAll"
                                                                    :menu-props="{ maxHeight: '400' }"
                                                                    multiple
                                                                    clearable
                                                                    item-value="bacteriaAll"
                                                                    @change="select($event)"
                                                                    filled dense hide-details class="mt-0"
                                                                    >
                                                                    <span class="pa-0 ma-0" slot="prepend">疾病感染</span>
                                                                    <template
                                                                        v-slot:item="{ item }">
                                                                        <v-icon 
                                                                            v-if="bacteriaSelect.includes(item)" 
                                                                            color="primary" 
                                                                            class="mr-3">
                                                                            mdi-checkbox-marked
                                                                        </v-icon>
                                                                        <v-icon v-else class="mr-3">
                                                                            mdi-checkbox-blank-outline
                                                                        </v-icon>
                                                                        {{ item.split('Is')[1] }}
                                                                    </template>
                                                                    <template
                                                                        v-slot:selection="{ item }">
                                                                        
                                                                        {{ item.split('Is')[1] }},
                                                                    </template>
                                                                </v-select> -->

                                                                <!-- <v-select v-model="BacteriaData['IsWSSV']" clearable :items="optData.IsWSSV" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">是否WSSV感染</span></v-select>
                                                                <v-select v-model="BacteriaData['IsEMSPlasmid']" clearable :items="optData.IsEMSPlasmid" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">是否EMS(plasmid)感染</span></v-select>
                                                                <v-select v-model="BacteriaData['IsEMSToxin']" clearable :items="optData.IsEMSToxin" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">是否EMS(toxin)感染</span></v-select>
                                                                <v-select v-model="BacteriaData['IsEHP']" clearable :items="optData.IsEHP" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">是否EHP感染</span></v-select>
                                                                <v-select v-model="BacteriaData['IsTSV']" clearable :items="optData.IsTSV" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">是否TSV感染</span></v-select>
                                                                <v-select v-model="BacteriaData['IsIMNV']" clearable :items="optData.IsIMNV" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">是否IMNV感染</span></v-select>
                                                                <v-select v-model="BacteriaData['IsIHHNV']" clearable :items="optData.IsIHHNV" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">是否IHHNV感染</span></v-select> -->

                                                                <!-- <v-select v-model="BacteriaData['IsEMSInfected']" clearable :items="optData.IsEMSInfected" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否EMS感染</span></v-select>
                                                                <v-select v-model="BacteriaData['IsEHPInfected']" clearable :items="optData.IsEHPInfected" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否EHP感染</span></v-select>
                                                                <v-select v-model="BacteriaData['IsVirusInfected']" clearable :items="optData.IsVirusInfected" filled dense hide-details class="mt-0 darken-1" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否病毒性感染</span></v-select>
                                                                <v-select v-model="BacteriaData['IsBacteriumInfected']" clearable :items="optData.IsBacteriumInfected" filled dense hide-details class="mt-0 darken-1" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否細菌性感染</span></v-select> -->

                                                            </v-form>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 傳染病 -->
                                        <v-expansion-panels id="bacteriaDisease" accordion multiple v-model="panel.panel_row25">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">傳染病</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <!-- <v-form ref="BacteriaData"> -->
                                                                <v-row class="item-row">
                                                                    <v-col cols=12 md="12" sm="12">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="3" sm="3">
                                                                                <span class="pa-0 ma-0" slot="prepend" style="padding-left: 4px !important;">疾病感染</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="9" sm="9">
                                                                                <v-select
                                                                                    v-model="bacteriaSelect"
                                                                                    :items="bacteriaAll"
                                                                                    :menu-props="{ maxHeight: '400' }"
                                                                                    multiple
                                                                                    chips
                                                                                    item-value="bacteriaAll"
                                                                                    @change="select($event)"
                                                                                    filled dense hide-details class="mt-0"
                                                                                    >
                                                                                    
                                                                                    <template
                                                                                        v-slot:item="{ item }">
                                                                                        <v-icon 
                                                                                            v-if="bacteriaSelect.includes(item)" 
                                                                                            color="primary" 
                                                                                            class="mr-3">
                                                                                            mdi-checkbox-marked
                                                                                        </v-icon>
                                                                                        <v-icon v-else class="mr-3">
                                                                                            mdi-checkbox-blank-outline
                                                                                        </v-icon>
                                                                                        {{ item.split('Is')[1] }}
                                                                                    </template>
                                                                                    <template
                                                                                        v-slot:selection="{ item }">
                                                                                        <!-- {{ item.split('Is')[1] }} -->
                                                                                        <v-chip
                                                                                            style="font-size: 12px;margin: 2px;color: #fff;"
                                                                                            color="#408FBC"
                                                                                            class="main"
                                                                                            close
                                                                                            @click:close="select(item,true)"
                                                                                        >
                                                                                        {{ item.split('Is')[1] }}
                                                                                        </v-chip>
                                                                                        
                                                                                    </template>
                                                                                </v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-select
                                                                            v-model="bacteriaSelect"
                                                                            :items="bacteriaAll"
                                                                            :menu-props="{ maxHeight: '400' }"
                                                                            multiple
                                                                            clearable
                                                                            item-value="bacteriaAll"
                                                                            @change="select($event)"
                                                                            filled dense hide-details class="mt-0"
                                                                            >
                                                                            <span class="pa-0 ma-0" slot="prepend">疾病感染</span>
                                                                            <template
                                                                                v-slot:item="{ item }">
                                                                                <v-icon 
                                                                                    v-if="bacteriaSelect.includes(item)" 
                                                                                    color="primary" 
                                                                                    class="mr-3">
                                                                                    mdi-checkbox-marked
                                                                                </v-icon>
                                                                                <v-icon v-else class="mr-3">
                                                                                    mdi-checkbox-blank-outline
                                                                                </v-icon>
                                                                                {{ item.split('Is')[1] }}
                                                                            </template>
                                                                            <template
                                                                                v-slot:selection="{ item }">
                                                                                
                                                                                {{ item.split('Is')[1] }},
                                                                            </template>
                                                                        </v-select> -->
                                                                    </v-col>
                                                                </v-row>
                                                                <!-- <v-row class="item-row">
                                                                    <v-col cols=12 md="12" sm="12">
                                                                        <span class="pa-0 ma-1" slot="prepend">感染紀錄</span>
                                                                        <v-simple-table fixed-header dense height="80px">
                                                                            <template v-slot:default>
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>時間</th>
                                                                                        
                                                                                        <th>疾病</th>
                                                                                    </tr>
                                                                                </thead>
                    
                                                                                <tbody v-if="bacteriaRecord.length>0">
                                                                                    <tr
                                                                                        v-for="item in bacteriaRecord"
                                                                                        :key="'record-'+item.id">
                                                                                        <td>{{item.time}}</td>
                                                                                        <td>{{ item.record }}</td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </template>
                                                                        </v-simple-table>
                                                                    </v-col>
                                                                </v-row> -->
                                                            <!-- </v-form> -->
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 觀察網資訊 -->
                                        <v-expansion-panels id="net" accordion multiple v-model="panel.panel_row22">
                                            <v-expansion-panel  class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">觀察網資訊</v-expansion-panel-header>
                                                    <v-expansion-panel-content>
                                                        <v-card tile>
                                                        <v-card-text class="mx-0">
                                                            <v-form ref="ObservationData">
                                                                <v-row class="item-row">
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">是否脫殼</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-select v-model="ObservationData['IsShell']" clearable :items="optData.IsMoultingPeriod" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-select v-model="ObservationData['IsShell']" clearable :items="optData.IsMoultingPeriod" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">是否脫殼</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span  class="pa-0 ma-0" slot="prepend">腸線顏色</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-select v-model="ObservationData['IntestinalColor']" clearable :items="optData.IntestinalColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-if="false" v-model="ObservationData['IntestinalColor']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">腸線顏色</span></v-text-field> -->
                                                                        <!-- <v-select v-model="ObservationData['IntestinalColor']" clearable :items="optData.IntestinalColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span  class="pa-0 ma-0" slot="prepend">腸線顏色</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">肝胰臟顏色</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-select v-model="ObservationData['HepatopancreasColor']" clearable :items="optData.HepatopancreasColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-if="false" v-model="ObservationData['HepatopancreasColor']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">肝胰臟顏色</span></v-text-field> -->
                                                                        <!-- <v-select v-model="ObservationData['HepatopancreasColor']" clearable :items="optData.HepatopancreasColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">肝胰臟顏色</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">肌肉顏色</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-select v-model="ObservationData['MuscleColor']" clearable :items="optData.MuscleColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-if="false" v-model="ObservationData['MuscleColor']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">肌肉顏色</span></v-text-field> -->
                                                                        <!-- <v-select v-model="ObservationData['MuscleColor']" clearable :items="optData.MuscleColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">肌肉顏色</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">蝦體顏色</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-select v-model="ObservationData['BodyColor']" clearable :items="optData.BodyColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-select v-model="ObservationData['BodyColor']" clearable :items="optData.BodyColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">蝦體顏色</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">蝦體形狀</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-select v-model="ObservationData['BodyShape']" clearable :items="optData.BodyShape" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-select v-model="ObservationData['BodyShape']" clearable :items="optData.BodyShape" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">蝦體形狀</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的飼料殘餘量(feed_surplus)">觀察網殘餌量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                                <v-text-field v-model.number="ObservationData['Leftover']" type="number" dense hide-details class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft" :title="ObservationData['Leftover']&&typeof(ObservationData['Leftover'])=='number'?((ObservationData['Leftover']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['Leftover']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">觀察網殘餌量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">死蝦數量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="ObservationData['DeadShrimpQty']" type="number" dense hide-details class="mt-0"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['DeadShrimpQty']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">死蝦數量</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">蝦子長度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="ObservationData['ShrimpLength']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">cm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['ShrimpLength']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">蝦子長度</span><span class="pa-0 ma-0" slot="append">cm</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去90天最後一筆打樣到的蝦子重量(avg_weight)">蝦子重量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                                <v-text-field v-model.number="ObservationData['ShrimpWeight']" type="number" dense hide-details class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft" :title="ObservationData['ShrimpWeight']&&typeof(ObservationData['ShrimpWeight'])=='number'?((ObservationData['ShrimpWeight']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['ShrimpWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">蝦子重量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                    
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去90天倒數第二筆打樣到的蝦子重量(avg_weight)">上次蝦子重量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                                <v-text-field v-model.number="ObservationData['LastShrimpWeight']" type="number" dense hide-details class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft" :title="ObservationData['LastShrimpWeight']&&typeof(ObservationData['LastShrimpWeight'])=='number'?((ObservationData['LastShrimpWeight']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['LastShrimpWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">上次蝦子重量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                    
                                                                </v-row>
                                                                <v-row class="item-row">
                                                                    <v-col cols=12 md="12" sm="12">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="3" sm="3">
                                                                                <div class="date-time-picker">
                                                                                    <span style="font-size: 16px;margin-right: 9px;padding-left: 4px;" title="過去90天最後一筆打樣到的蝦子重量的時間">打樣時間</span>
                                                                                </div>
                                                                                    
                                                                            </v-col> 
                                                                            <v-col cols="12" md="9" sm="9">
                                                                                <div class="date-time-picker">
                                                                                    <a-date-picker v-model="ObservationData['SamplingDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk" style="min-width: none;width: calc(100% - 9px);margin-left: 4px;margin-right: 16px;" />
                                                                                </div>
                                                                                    
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <div class="date-time-picker">
                                                                            <span style="font-size: 16px;margin-right: 9px;">打樣時間</span>
                                                                            <a-date-picker v-model="ObservationData['SamplingDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk" style="min-width: none;width: calc(100% - 9px)" />
                                                                        </div> -->
                                                                    </v-col>
                                                                    
                                                                </v-row>
                                                                <v-row class="item-row">
                                                                    <v-col cols=12 md="12" sm="12">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="3" sm="3">
                                                                                <div class="date-time-picker">
                                                                                    <span style="font-size: 16px;margin-right: 9px;padding-left: 4px;" title="過去90天倒數第二筆打樣到的蝦子重量的時間">上次打樣時間</span>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" md="9" sm="9">
                                                                                <div class="date-time-picker">
                                                                                    <a-date-picker v-model="ObservationData['LastSamplingDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk"  style="min-width: none;width: calc(100% - 9px);margin-left: 4px;margin-right: 16px;" />
                                                                                </div>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <div class="date-time-picker">
                                                                            <span style="font-size: 16px;margin-right: 9px;">上次打樣時間</span>
                                                                            <a-date-picker v-model="ObservationData['LastSamplingDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk"  style="min-width: none;width: calc(100% - 9px)" />
                                                                        </div> -->
                                                                    </v-col>
                                                                </v-row>
                                                                <!-- <v-select v-model="ObservationData['IsShell']" clearable :items="optData.IsMoultingPeriod" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">是否脫殼</span></v-select>

                                                                <v-text-field v-if="false" v-model="ObservationData['IntestinalColor']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">腸線顏色</span></v-text-field>
                                                                <v-select v-model="ObservationData['IntestinalColor']" clearable :items="optData.IntestinalColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span  class="pa-0 ma-0" slot="prepend">腸線顏色</span></v-select>

                                                                <v-text-field v-if="false" v-model="ObservationData['HepatopancreasColor']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">肝胰臟顏色</span></v-text-field>
                                                                <v-select v-model="ObservationData['HepatopancreasColor']" clearable :items="optData.HepatopancreasColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">肝胰臟顏色</span></v-select>

                                                                <v-text-field v-if="false" v-model="ObservationData['MuscleColor']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">肌肉顏色</span></v-text-field>
                                                                <v-select v-model="ObservationData['MuscleColor']" clearable :items="optData.MuscleColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">肌肉顏色</span></v-select>

                                                                <v-select v-model="ObservationData['BodyColor']" clearable :items="optData.BodyColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">蝦體顏色</span></v-select>

                                                                <v-select v-model="ObservationData['BodyShape']" clearable :items="optData.BodyShape" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">蝦體形狀</span></v-select>
                                                            
                                                                <v-text-field v-model.number="ObservationData['Leftover']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">觀察網殘餌量(g)</span></v-text-field>
                                                                <v-text-field v-model.number="ObservationData['DeadShrimpQty']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">死蝦數量</span></v-text-field>
                                                                <v-text-field v-model.number="ObservationData['ShrimpLength']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">蝦子長度(cm)</span></v-text-field>
                                                                <v-text-field v-model.number="ObservationData['ShrimpWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">蝦子重量(g)</span></v-text-field>
                                                                <div class="date-time-picker">
                                                                    <span style="font-size: 16px">打樣時間</span>
                                                                    <a-date-picker v-model="ObservationData['SamplingDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk" />
                                                                </div> -->
                                                            <!-- <v-text-field v-model.number="ObservationData['SamplingDatetime']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">打樣時間</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="ObservationData['LastShrimpWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">上次蝦子重量(g)</span></v-text-field>
                                                                <div class="date-time-picker">
                                                                    <span style="font-size: 16px">上次打樣時間</span>
                                                                    <a-date-picker v-model="ObservationData['LastSamplingDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk" />
                                                                </div> -->
                                                            <!-- <v-text-field v-model.number="ObservationData['LastSamplingDatetime']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">上次打樣時間</span></v-text-field> -->
                                                            <!-- <v-text-field v-model.number="ObservationData['ObsFeed']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">觀察網投餌量(g)</span></v-text-field> -->
                                                            </v-form>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    
                                        
                                        <!-- 養殖基本數據 -->
                                        <v-expansion-panels id="basic" accordion multiple v-model="panel.panel_row11">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">養殖基本數據</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-form ref="BaseParm">
                                                                <v-row class="item-row">
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend"><v-icon @click="() => (BaseParm['InspectedDate'] = getNowDate())">mdi-calendar</v-icon>資料日期</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-menu v-model="menu_inspecteddate" :close-on-content-click="false" :nudge-right="40"
                                                                                    transition="scale-transition" offset-y min-width="auto">
                                                                                    <template v-slot:activator="{ on, attrs }">
                                                                                        <v-text-field v-model="BaseParm['InspectedDate']" class="mt-0" clearable readonly dense hide-details 
                                                                                            v-bind="attrs" v-on="on"></v-text-field>
                                                                                    </template>
                                                                                    <v-date-picker v-model="BaseParm['InspectedDate']" locale="zh-tw" no-title @input="
                                                                                    menu_inspecteddate = false;
                                                                                    "></v-date-picker>
                                                                                </v-menu>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-menu v-model="menu_inspecteddate" :close-on-content-click="false" :nudge-right="40"
                                                                            transition="scale-transition" offset-y min-width="auto">
                                                                            <template v-slot:activator="{ on, attrs }">
                                                                                <v-text-field v-model="BaseParm['InspectedDate']" class="mt-0" clearable readonly dense hide-details 
                                                                                    v-bind="attrs" v-on="on"><span class="pa-0 ma-0" slot="prepend"><v-icon @click="() => (BaseParm['InspectedDate'] = getNowDate())">mdi-calendar</v-icon>資料日期</span></v-text-field>
                                                                            </template>
                                                                            <v-date-picker v-model="BaseParm['InspectedDate']" locale="zh-tw" no-title @input="
                                                                            menu_inspecteddate = false;
                                                                            "></v-date-picker>
                                                                        </v-menu> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend"><v-icon @click="() => (BaseParm['InspectedTime'] = getNowTime())">mdi-timeline-clock-outline</v-icon>資料時間</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field
                                                                                    v-model="BaseParm['InspectedTime']"
                                                                                    value="" dense
                                                                                    type="time"
                                                                                    
                                                                                    hide-details
                                                                                    
                                                                                    ></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field
                                                                            v-model="BaseParm['InspectedTime']"
                                                                            value="" dense
                                                                            type="time"
                                                                            prepend-icon="mdi-timeline-clock-outline"
                                                                            hide-details
                                                                            @click:prepend="() => (BaseParm['InspectedTime'] = getNowTime())"
                                                                            ><span class="pa-0 ma-0" slot="prepend"><v-icon @click="() => (BaseParm['InspectedTime'] = getNowTime())">mdi-timeline-clock-outline</v-icon>資料時間</span></v-text-field> -->
                                                                            
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">養殖池底面積</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BaseParm['PondBottomArea']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">m<sup>2</sup></span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BaseParm['PondBottomArea']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">養殖池底面積</span><span class="pa-0 ma-0" slot="append">m2</span></v-text-field> -->
                                                                    </v-col>
                                                                    
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">養殖起始日</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-menu v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40"
                                                                                    transition="scale-transition" offset-y min-width="auto">
                                                                                    <template v-slot:activator="{ on, attrs }">
                                                                                    <v-text-field v-model="BaseParm['StartedDate']" class="mt-0" clearable readonly dense hide-details
                                                                                        v-bind="attrs" v-on="on"></v-text-field>
                                                                                    </template>
                                                                                    <v-date-picker v-model="BaseParm['StartedDate']" locale="zh-tw" no-title @input="
                                                                                    menu_startdate = false;
                                                                                    "></v-date-picker>
                                                                                </v-menu>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-menu v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40"
                                                                            transition="scale-transition" offset-y min-width="auto">
                                                                            <template v-slot:activator="{ on, attrs }">
                                                                            <v-text-field v-model="BaseParm['StartedDate']" class="mt-0" clearable readonly dense hide-details
                                                                                v-bind="attrs" v-on="on"><span class="pa-0 ma-0" slot="prepend">養殖起始日</span></v-text-field>
                                                                            </template>
                                                                            <v-date-picker v-model="BaseParm['StartedDate']" locale="zh-tw" no-title @input="
                                                                            menu_startdate = false;
                                                                            "></v-date-picker>
                                                                        </v-menu> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">水源</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-select v-model="BaseParm['WaterSource']" clearable :items="optData.WaterSource" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-select v-model="BaseParm['WaterSource']" clearable :items="optData.WaterSource" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">水源</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">鹽度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BaseParm['WaterSourceSalinity']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">ppt</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BaseParm['WaterSourceSalinity']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">鹽度</span><span class="pa-0 ma-0" slot="append">ppt</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">水體體積</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BaseParm['WaterBody']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">m<sup>3</sup></span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BaseParm['WaterBody']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">水體體積</span><span class="pa-0 ma-0" slot="append">m3</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">放養密度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BaseParm['Density']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append" style="width: 48px;">隻/噸水</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BaseParm['Density']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">放養密度</span><span class="pa-0 ma-0" slot="append" style="width: 56px;">隻/噸水</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="養殖循環開始日期~資料日期時間">養殖天數</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BaseParm['Days']" type="number" dense hide-details class="mt-0"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BaseParm['Days']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">養殖天數</span></v-text-field> -->
                                                                    </v-col>
                                                                </v-row>

                                                                <!-- <v-menu v-model="menu_inspecteddate" :close-on-content-click="false" :nudge-right="40"
                                                                    transition="scale-transition" offset-y min-width="auto">
                                                                    <template v-slot:activator="{ on, attrs }">
                                                                        <v-text-field v-model="BaseParm['InspectedDate']" class="mt-0" clearable readonly dense hide-details 
                                                                            v-bind="attrs" v-on="on"><span class="pa-0 ma-0" slot="prepend"><v-icon @click="() => (BaseParm['InspectedDate'] = getNowDate())">mdi-calendar</v-icon>資料日期</span></v-text-field>
                                                                    </template>
                                                                    <v-date-picker v-model="BaseParm['InspectedDate']" locale="zh-tw" no-title @input="
                                                                    menu_inspecteddate = false;
                                                                    "></v-date-picker>
                                                                </v-menu>
                                                                <v-text-field
                                                                    v-model="BaseParm['InspectedTime']"
                                                                    value="" dense
                                                                    type="time"
                                                                    prepend-icon="mdi-timeline-clock-outline"
                                                                    hide-details
                                                                    @click:prepend="() => (BaseParm['InspectedTime'] = getNowTime())"
                                                                    ><span class="pa-0 ma-0" slot="prepend"><v-icon @click="() => (BaseParm['InspectedTime'] = getNowTime())">mdi-timeline-clock-outline</v-icon>資料時間</span></v-text-field>
                                                                    <v-text-field v-model.number="BaseParm['PondBottomArea']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">養殖池底面積(m2)</span></v-text-field> -->
                                                                <!-- <v-select v-model="BaseParm['Shape']" clearable :items="optData.Shape" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">養殖池形狀</span></v-select> -->

                                                                <!-- <v-text-field v-if="false" v-model="BaseParm['StartedDate']" dense hide-details class="mt-0 blue lighten-1" dark><span class="pa-0 ma-0" slot="prepend">養殖起始日</span></v-text-field>
                                                                <v-menu v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40"
                                                                    transition="scale-transition" offset-y min-width="auto">
                                                                    <template v-slot:activator="{ on, attrs }">
                                                                    <v-text-field v-model="BaseParm['StartedDate']" class="mt-0" clearable readonly dense hide-details
                                                                        v-bind="attrs" v-on="on"><span class="pa-0 ma-0" slot="prepend">養殖起始日</span></v-text-field>
                                                                    </template>
                                                                    <v-date-picker v-model="BaseParm['StartedDate']" locale="zh-tw" no-title @input="
                                                                    menu_startdate = false;
                                                                    "></v-date-picker>
                                                                </v-menu>
                                                                <v-text-field v-if="false" v-model="BaseParm['WaterSource']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">水源</span></v-text-field>
                                                                <v-select v-model="BaseParm['WaterSource']" clearable :items="optData.WaterSource" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">水源</span></v-select>

                                                                <v-text-field v-model.number="BaseParm['WaterSourceSalinity']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">鹽度(ppt)</span></v-text-field>
                                                                <v-text-field v-model.number="BaseParm['WaterBody']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">水體體積(m3)</span></v-text-field>
                                                                <v-text-field v-model.number="BaseParm['Density']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">放養密度(隻/噸水)</span></v-text-field>
                                                                <v-text-field v-model.number="BaseParm['Days']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">養殖天數</span></v-text-field> -->
                                                            </v-form>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 養殖參數 -->
                                        <v-expansion-panels id="breed" accordion multiple v-model="panel.panel_row12">
                                            <v-expansion-panel  class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">養殖參數</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-form ref="BreedingParm">
                                                                <v-row class="item-row">
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">目標CN比</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="BreedingParm['CN']" type="number" dense hide-details class="mt-0"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BreedingParm['CN']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">目標CN比</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">放養初始重量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                                <v-text-field v-model.number="BreedingParm['InitialWeight']" type="number" dense hide-details class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft" :title="BreedingParm['InitialWeight']&&typeof(BreedingParm['InitialWeight'])=='number'?((BreedingParm['InitialWeight']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BreedingParm['InitialWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">放養初始重量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend">預估間補個體重</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                                <v-text-field v-model.number="BreedingParm['EstimatedHarvestWeight']" type="number" dense hide-details class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft" :title="BreedingParm['EstimatedHarvestWeight']&&typeof(BreedingParm['EstimatedHarvestWeight'])=='number'?((BreedingParm['EstimatedHarvestWeight']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BreedingParm['EstimatedHarvestWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">預估間補個體重</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                </v-row>

                                                                <!-- <v-text-field v-model.number="BreedingParm['CN']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">目標CN比</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="BreedingParm['EstimatedFCR']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">預測FCR</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="BreedingParm['EstimatedADG']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">預測ADG</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="BreedingParm['InitialLength']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">放養初始長度(cm)</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="BreedingParm['EstimatedSurvivalRate']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">預估存活率(%)</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="BreedingParm['InitialWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">放養初始重量(g)</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="BreedingParm['EstimatedHarvestWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">預估間補個體重(g)</span></v-text-field> -->
                                                            </v-form>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 做水期參數 -->
                                        <v-expansion-panels id="waterperiod" accordion multiple v-model="panel.panel_row14">
                                            <v-expansion-panel  class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">做水期參數</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-form ref="MakeWaterParm">
                                                                <v-row class="item-row">
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="成分產編 = '尿素' & 參數英文名稱 = 'effective concentration'">尿素有效濃度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="MakeWaterParm['UreaEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="MakeWaterParm['UreaEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">尿素有效濃度</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="成分產編 = '漂白粉' & 參數英文名稱 = 'effective concentration'">漂白粉有效濃度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="MakeWaterParm['BleachingPowderEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="MakeWaterParm['BleachingPowderEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">漂白粉有效濃度</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的餘氯資料">水體餘氯</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="MakeWaterParm['Chlorine']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="MakeWaterParm['Chlorine']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">水體餘氯</span><span class="pa-0 ma-0" slot="append">ppm</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="成分產編 = '硫代硫酸鈉' & 參數英文名稱 = 'effective concentration'">海波有效濃度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="6" sm="6">
                                                                                <v-text-field v-model.number="MakeWaterParm['HypoEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="MakeWaterParm['HypoEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">海波有效濃度</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                    </v-col>
                                                                </v-row>

                                                                <!-- <v-text-field v-model.number="MakeWaterParm['Urea']" dense hide-details class="mt-0 blue lighten-5"><span class="pa-0 ma-0" slot="prepend">尿素(g)</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="MakeWaterParm['UreaEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">尿素有效濃度(%)</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="MakeWaterParm['BleachingPowderEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">漂白粉有效濃度(%)</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="MakeWaterParm['Chlorine']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">水體餘氯(ppm)</span></v-text-field> -->
                                                                <!-- <v-text-field v-model.number="MakeWaterParm['HypoEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">海波有效濃度(%)</span></v-text-field> -->
                                                            </v-form>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </div>
                                </div>
                            </v-card>
                        </v-col>
                        <!-- AI 建議 -->
                        <v-col cols="12" md="6" sm="12" id="ai">
                            <v-card class="result-card ai-suggestion">
                                <!-- 表頭 -->
                                <div class="card-title">
                                    <div class="title">
                                        <v-icon>mdi-crosshairs-gps</v-icon>
                                        <v-card-title>AI 建議</v-card-title>
                                    </div>
                                    <div class="btn-groups" >
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <button v-if="!aiOpen" class="only-icon" @click="aiOpen=!aiOpen" v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-star-outline</v-icon>
                                                </button>
                                                <button v-else class="only-icon"  @click="aiOpen=!aiOpen" v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-star</v-icon>
                                                </button>
                                            </template>
                                            <span>錨點列表</span>
                                        </v-tooltip>
                                    </div>
                                </div>
                                <div class="content">
                                    <!-- 錨點設置 -->
                                    <v-row v-if="aiOpen">
                                        <!-- <a href="javascript:void(0)" class="tag" @click="goAnchor('#animate')"> 動態數據資訊 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#aiwater')"> 水質 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#ainet')"> 觀察網 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#aifeed')"> 投餌量 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#aijudge')"> 投料判斷列表 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#aiinput')"> 養殖前期做水添加物</a> -->
                                        <a v-if="windowWidth>959.58" href="javascript:void(0)" class="tag" @click="goAnchor('#aiwater')"> 警示 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#aifeed')"> 投餌量 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#aijudge')"> 投料判斷列表 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#animate')"> 動態數據資訊 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#aiinput')"> 養殖前期做水添加物</a>
                                    </v-row>
                                    <div class="table-content"
                                         :style="{'minHeight':`${windowHeight>880?'75vh':'64vh'}`,
                                                'height':`${windowWidth>959.58?'49vh':'100%'}`}">
                                        <!-- 警示(水質+觀察網) -->
                                        <v-expansion-panels v-if="windowWidth>959.98" accordion multiple v-model="panel.panel_row30" id="aiwater">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">
                                                    <div style="display: flex;align-items: center;">
                                                        <div class="circle" v-if="suggData.WaterQuality.length+suggData.Observation.length>0">
                                                            <span>{{ suggData.WaterQuality.length+suggData.Observation.length }}</span>
                                                        </div>
                                                        警示
                                                    </div>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0" style="padding-right: 4px !important;">
                                                            <v-simple-table fixed-header dense height="200px">
                                                                <template v-slot:default>
                                                                    <!-- <thead>
                                                                        <tr> -->
                                                                        <!-- <th>
                                                                            狀態作動
                                                                        </th> -->
                                                                        <!-- <th>
                                                                            可能影響原因
                                                                        </th>
                                                                        <th>
                                                                            會造成結果
                                                                        </th> -->
                                                                        <!-- <th>  </th>
                                                                        </tr>
                                                                    </thead> -->
        
                                                                    <tbody>
                                                                        <tr v-if="suggData.WaterQuality.length>0" style="background-color:#E6B8BE;font-weight: bold;"><td colspan="3">水質</td></tr>
                                                                        <!-- <tr v-if="suggData.WaterQuality.length==0" style="box-shadow: none;height: 24px;width:100%;text-align: center;padding: 4px;"><td colspan="3" style="color: #aaa;">暫無資料</td></tr> -->
                                                                        <tr
                                                                        v-for="item in suggData.WaterQuality"
                                                                        :key="'water-'+item.id"
                                                                        >
                                                                            <td v-html="setBR(item.status)"></td>
                                                                            <td><div class="alertOpen" style="cursor: pointer;" @click="openDialog('水質',item)"><v-icon>mdi-dots-vertical-circle-outline</v-icon></div></td>
                                                                            <!-- <td>{{ item.factor }}</td>
                                                                            <td>{{ item.result }}</td> -->
                                                                        </tr>
                                                                        <tr v-if="suggData.Observation.length>0" style="background-color:#E6B8BE;font-weight: bold;"><td colspan="3">觀察網</td></tr>
                                                                        <!-- <tr v-if="suggData.Observation.length==0" style="box-shadow: none;height: 24px;width:100%;text-align: center;padding: 4px;"><td colspan="3" style="color: #aaa;">暫無資料</td></tr> -->
                                                                        <tr
                                                                        v-for="item in suggData.Observation"
                                                                        :key="'Obser-'+item.id"
                                                                        >
                                                                        <td v-html="setBR(item.status)"></td>
                                                                        <td><div class="alertOpen" style="cursor: pointer;" @click="openDialog('觀察網',item)"><v-icon>mdi-dots-vertical-circle-outline</v-icon></div></td>
                                                                        <!-- <td>{{ item.factor }}</td>
                                                                        <td>{{ item.result }}</td> -->
                                                                        </tr>
                                                                    </tbody>
                                                                </template>
                                                            </v-simple-table>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                            <!-- 水質 -->
                                            <!-- <v-expansion-panel id="aiwater" class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">水質</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-simple-table fixed-header dense height="200px">
                                                                <template v-slot:default>
                                                                    <thead>
                                                                        <tr>
                                                                        <th>
                                                                            狀態作動
                                                                        </th>
                                                                        <th>
                                                                            可能影響原因
                                                                        </th>
                                                                        <th>
                                                                            會造成結果
                                                                        </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr
                                                                        v-for="item in suggData.WaterQuality"
                                                                        :key="item.id"
                                                                        >
                                                                        <td v-html="setBR(item.status)"></td>
                                                                        <td>{{ item.factor }}</td>
                                                                        <td>{{ item.result }}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </template>
                                                            </v-simple-table>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel> -->
                                            
                                            <!-- 觀察網 -->
                                            <!-- <v-expansion-panel id="ainet" class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">觀察網</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-simple-table fixed-header dense height="200px">
                                                                <template v-slot:default>
                                                                    <thead>
                                                                        <tr>
                                                                        <th>
                                                                            狀態作動
                                                                        </th>
                                                                        <th>
                                                                            可能影響原因
                                                                        </th>
                                                                        <th>
                                                                            會造成結果
                                                                        </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr
                                                                        v-for="item in suggData.Observation"
                                                                        :key="item.id"
                                                                        >
                                                                        <td v-html="setBR(item.status)"></td>
                                                                        <td>{{ item.factor }}</td>
                                                                        <td>{{ item.result }}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </template>
                                                            </v-simple-table>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel> -->
                                            
                                            
                                        </v-expansion-panels>
                                        <!-- 投餌量 -->
                                        <v-expansion-panels accordion multiple v-model="panel.panel_row31" id="aifeed">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">投餌量</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0" style="padding-right: 4px !important;">
                                                            <div v-if="suggData.Feed.status!==''" class="suggestion-text">*建議：{{ suggData.Feed.status }}</div>
                                                                    <v-simple-table fixed-header dense >
                                                                        <thead>
                                                                            <tr style="box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.12);height: 32px;">
                                                                                <th style="text-align:left;">
                                                                                    項目
                                                                                </th>
                                                                                <th style="text-align:left;">
                                                                                    數值
                                                                                </th>
                                                                                <th style="text-align:left;">
                                                                                    單位
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr style="background-color:#E5F2E0;"><td colspan="3">飼料量</td></tr>
                                                                            <tr>
                                                                                <td>粉料</td>
                                                                                <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.feed_amount.PowderFeed"></v-text-field></td>
                                                                                <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.feed_amount.PowderFeed&&typeof(suggData.Feed.feed_amount.PowderFeed)=='number'?((suggData.Feed.feed_amount.PowderFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>0號料</td>
                                                                                <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.feed_amount.ZeroFeed"></v-text-field></td>
                                                                                <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.feed_amount.ZeroFeed&&typeof(suggData.Feed.feed_amount.ZeroFeed)=='number'?((suggData.Feed.feed_amount.ZeroFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>1號料</td>
                                                                                <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.feed_amount.OneFeed"></v-text-field></td>
                                                                                <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.feed_amount.OneFeed&&typeof(suggData.Feed.feed_amount.OneFeed)=='number'?((suggData.Feed.feed_amount.OneFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>2號料</td>
                                                                                <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.feed_amount.TwoFeed"></v-text-field></td>
                                                                                <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.feed_amount.TwoFeed&&typeof(suggData.Feed.feed_amount.TwoFeed)=='number'?((suggData.Feed.feed_amount.TwoFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                            </tr>
                                                                            <tr style="background-color:#E5F2E0;"><td colspan="3">統計表</td></tr>
                                                                            <!-- <tr>
                                                                                <td>轉0號料第一餐</td>
                                                                                <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.statistics.ZeroFeedFirstMeal"></v-text-field></td>
                                                                                <td></td>
                                                                            </tr> -->
                                                                            <tr>
                                                                                <!-- <td>前一餐飼料量</td> -->
                                                                                <td>上一餐飼料量</td>
                                                                                <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.statistics.LastFeed"></v-text-field></td>
                                                                                <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.statistics.LastFeed&&typeof(suggData.Feed.statistics.LastFeed)=='number'?((suggData.Feed.statistics.LastFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>下一餐飼料量</td>
                                                                                <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.statistics.NextFeed"></v-text-field></td>
                                                                                <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.statistics.NextFeed&&typeof(suggData.Feed.statistics.NextFeed)=='number'?((suggData.Feed.statistics.NextFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>累計飼料量</td>
                                                                                <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.statistics.CumulativeFeedAmount"></v-text-field></td>
                                                                                <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.statistics.CumulativeFeedAmount&&typeof(suggData.Feed.statistics.CumulativeFeedAmount)=='number'?((suggData.Feed.statistics.CumulativeFeedAmount/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </v-simple-table>
                                                                    
                                                                    <v-simple-table fixed-header dense height="200px" v-if="false">
                                                                        <template v-slot:default>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th style="text-align:left;">
                                                                                        項目
                                                                                    </th>
                                                                                    <th style="text-align:left;">
                                                                                        數值
                                                                                    </th>
                                                                                    <th style="text-align:left;">
                                                                                        單位
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr style="background-color:#E5F2E0;"><td colspan="3">飼料量</td></tr>
                                                                                <tr>
                                                                                    <td>粉料</td>
                                                                                    <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.feed_amount.PowderFeed"></v-text-field></td>
                                                                                    <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.feed_amount.PowderFeed&&typeof(suggData.Feed.feed_amount.PowderFeed)=='number'?((suggData.Feed.feed_amount.PowderFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>0號料</td>
                                                                                    <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.feed_amount.ZeroFeed"></v-text-field></td>
                                                                                    <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.feed_amount.ZeroFeed&&typeof(suggData.Feed.feed_amount.ZeroFeed)=='number'?((suggData.Feed.feed_amount.ZeroFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>1號料</td>
                                                                                    <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.feed_amount.OneFeed"></v-text-field></td>
                                                                                    <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.feed_amount.OneFeed&&typeof(suggData.Feed.feed_amount.OneFeed)=='number'?((suggData.Feed.feed_amount.OneFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>2號料</td>
                                                                                    <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.feed_amount.TwoFeed"></v-text-field></td>
                                                                                    <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.feed_amount.TwoFeed&&typeof(suggData.Feed.feed_amount.TwoFeed)=='number'?((suggData.Feed.feed_amount.TwoFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                                </tr>
                                                                                <tr style="background-color:#E5F2E0;"><td colspan="3">統計表</td></tr>
                                                                                <tr>
                                                                                    <td>轉0號料第一餐</td>
                                                                                    <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.statistics.ZeroFeedFirstMeal"></v-text-field></td>
                                                                                    <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.statistics.ZeroFeedFirstMeal&&typeof(suggData.Feed.statistics.ZeroFeedFirstMeal)=='number'?((suggData.Feed.statistics.ZeroFeedFirstMeal/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>前一餐飼料量</td>
                                                                                    <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.statistics.LastFeed"></v-text-field></td>
                                                                                    <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.statistics.LastFeed&&typeof(suggData.Feed.statistics.LastFeed)=='number'?((suggData.Feed.statistics.LastFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>下一餐飼料量</td>
                                                                                    <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.statistics.NextFeed"></v-text-field></td>
                                                                                    <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.statistics.NextFeed&&typeof(suggData.Feed.statistics.NextFeed)=='number'?((suggData.Feed.statistics.NextFeed/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>累計飼料量</td>
                                                                                    <td><v-text-field disabled dense hide-details filled v-model="suggData.Feed.statistics.CumulativeFeedAmount"></v-text-field></td>
                                                                                    <td style="text-align:right;"><a-tooltip placement="topLeft" :title="suggData.Feed.statistics.CumulativeFeedAmount&&typeof(suggData.Feed.statistics.CumulativeFeedAmount)=='number'?((suggData.Feed.statistics.CumulativeFeedAmount/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </template>
                                                                    </v-simple-table>
                                                                
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 投料判斷列表 -->
                                        <v-expansion-panels accordion multiple v-model="panel.panel_row32" id="aijudge">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">投料判斷列表</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-row class="item-row">
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">前餐砂糖量(配合飼料CN比)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['LastSugarCN']" disabled dense hide-details class="mt-0 "></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['LastSugarCN']&&typeof(suggData.Material['LastSugarCN'])=='number'?((suggData.Material['LastSugarCN']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['LastSugarCN']" disabled dense hide-details class="mt-0 "><span class="pa-0 ma-0" slot="prepend">前餐砂糖量(配合飼料CN比)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">下餐砂糖量 (配合飼料CN比)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['SugarCN']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['SugarCN']&&typeof(suggData.Material['SugarCN'])=='number'?((suggData.Material['SugarCN']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarCN']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">下餐砂糖量 (配合飼料CN比)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">砂糖量 (降氨氮)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['SugarAmmoniaN']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['SugarAmmoniaN']&&typeof(suggData.Material['SugarAmmoniaN'])=='number'?((suggData.Material['SugarAmmoniaN']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarAmmoniaN']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降氨氮)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">砂糖量 (降亞硝酸)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['SugarNO2']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['SugarNO2']&&typeof(suggData.Material['SugarNO2'])=='number'?((suggData.Material['SugarNO2']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarNO2']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降亞硝酸)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">砂糖量 (提高枯草桿菌)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['SugarBacillusSubtilis']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['SugarBacillusSubtilis']&&typeof(suggData.Material['SugarBacillusSubtilis'])=='number'?((suggData.Material['SugarBacillusSubtilis']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarBacillusSubtilis']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (提高枯草桿菌)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">砂糖量 (降紫菌)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['SugarVibrioEnteritidis']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['SugarVibrioEnteritidis']&&typeof(suggData.Material['SugarVibrioEnteritidis'])=='number'?((suggData.Material['SugarVibrioEnteritidis']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarVibrioEnteritidis']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降紫菌)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">砂糖量 (降靛菌)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['SugarVibrioCholerae']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['SugarVibrioCholerae']&&typeof(suggData.Material['SugarVibrioCholerae'])=='number'?((suggData.Material['SugarVibrioCholerae']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarVibrioCholerae']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降靛菌)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">當日總砂糖量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['SugarTotal']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['SugarTotal']&&typeof(suggData.Material['SugarTotal'])=='number'?((suggData.Material['SugarTotal']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarTotal']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">當日總砂糖量</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">累計砂糖量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['CumulativeSugarAmount']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['CumulativeSugarAmount']&&typeof(suggData.Material['CumulativeSugarAmount'])=='number'?((suggData.Material['CumulativeSugarAmount']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['CumulativeSugarAmount']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">累計砂糖量</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                            </v-row>
                                                            <!-- <v-text-field v-model="suggData.Material['LastSugarCN']" disabled dense hide-details class="mt-0 "><span class="pa-0 ma-0" slot="prepend">前餐砂糖量(配合飼料CN比)(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.Material['SugarCN']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">下餐砂糖量 (配合飼料CN比)(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.Material['SugarAmmoniaN']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降氨氮)(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.Material['SugarNO2']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降亞硝酸)(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.Material['SugarBacillusSubtilis']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (提高枯草桿菌)(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.Material['SugarVibrioEnteritidis']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降紫菌)(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.Material['SugarVibrioCholerae']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降靛菌)(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.Material['SugarTotal']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">當日總砂糖量(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.Material['CumulativeSugarAmount']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">累計砂糖量(kg)</span></v-text-field> -->
                                                        </v-card-text>
                                                        <v-card-text class="pa-3 mx-0" style="padding-top: 0 !important;padding-bottom: 0 !important;">
                                                            <v-row class="item-row">
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item" style="background-color:#E5F2E0;">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">熟石灰量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['Lime']" disabled dense hide-details class="mt-0" style="background-color:#E5F2E0;"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['Lime']&&typeof(suggData.Material['Lime'])=='number'?((suggData.Material['Lime']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['Lime']" disabled dense hide-details class="mt-0" style="background-color:#E5F2E0;"><span class="pa-0 ma-0" slot="prepend">熟石灰量</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item" style="background-color:#E5F2E0;">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">累計熟石灰量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['CumulativeLimeAmount']" disabled dense hide-details class="mt-0 " style="background-color:#E5F2E0;"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['CumulativeLimeAmount']&&typeof(suggData.Material['CumulativeLimeAmount'])=='number'?((suggData.Material['CumulativeLimeAmount']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['CumulativeLimeAmount']" disabled dense hide-details class="mt-0 " style="background-color:#E5F2E0;"><span class="pa-0 ma-0" slot="prepend">累計熟石灰量</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                            </v-row>
                                                            <!-- <v-text-field v-model="suggData.Material['Lime']" disabled dense hide-details class="mt-0" style="background-color:#E5F2E0;"><span class="pa-0 ma-0" slot="prepend">熟石灰量(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.Material['CumulativeLimeAmount']" disabled dense hide-details class="mt-0 " style="background-color:#E5F2E0;"><span class="pa-0 ma-0" slot="prepend">累計熟石灰量(kg)</span></v-text-field> -->
                                                        </v-card-text>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-row class="item-row">
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">累計菌量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.Material['CumulativeBacteriaAmount']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.Material['CumulativeBacteriaAmount']&&typeof(suggData.Material['CumulativeBacteriaAmount'])=='number'?((suggData.Material['CumulativeBacteriaAmount']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['CumulativeBacteriaAmount']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">累計菌量</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                            </v-row>
                                                            <!-- <v-text-field v-model="suggData.Material['CumulativeBacteriaAmount']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">累計菌量(kg)</span></v-text-field> -->
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 動態數據資訊 -->
                                        <v-expansion-panels id="animate" accordion multiple v-model="panel.panel_row24">
                                            <v-expansion-panel  class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">動態數據資訊</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                        <!-- <v-divider></v-divider> -->
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-row class="item-row">
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"  title="累計飼料量、蝦子長度、水體體積、放養密度">FCR(換肉率)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <v-text-field v-model="suggData.DynamicData['FCR']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['FCR']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend"  title="累計飼料量、蝦子長度、水體體積、放養密度">FCR(換肉率)</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend" title="蝦子長度、養殖天數、養殖起始日">ADG(每日增重量)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.DynamicData['ADG']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.DynamicData['ADG']&&typeof(suggData.DynamicData['ADG'])=='number'?((suggData.DynamicData['ADG']/ 1000).toFixed(2)+'kg/day'):'0kg/day'"><span class="pa-0 ma-0">g/day</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['ADG']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、養殖天數、養殖起始日">ADG(每日增重量)</span><span class="pa-0 ma-0" slot="append">g/day</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算內存量，因為需要每日體重投餌率">內存量(體重投餌率)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.DynamicData['Biomass']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.DynamicData['Biomass']&&typeof(suggData.DynamicData['Biomass'])=='number'?((suggData.DynamicData['Biomass']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['Biomass']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算內存量，因為需要每日體重投餌率">內存量(體重投餌率)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算存活率，因為需要內存量">存活率</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <v-text-field v-model="suggData.DynamicData['SurvivalRate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">%</span></v-text-field>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['SurvivalRate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算存活率，因為需要內存量">存活率</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">預計間補日期</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <v-text-field v-model="suggData.DynamicData['EstimatedCatchingDate']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['EstimatedCatchingDate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="養殖起始日">預計間補日期</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，小蝦不會用觀察網">觀察網網上料量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.DynamicData['FeedAmountInObservation']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.DynamicData['FeedAmountInObservation']&&typeof(suggData.DynamicData['FeedAmountInObservation'])=='number'?((suggData.DynamicData['FeedAmountInObservation']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['FeedAmountInObservation']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，小蝦不會用觀察網">觀察網網上料量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">每日體重投餌率</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <v-text-field v-model="suggData.DynamicData['WeightFeedRate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">%</span></v-text-field>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['WeightFeedRate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度">每日體重投餌率</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">蝦子重量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.DynamicData['ShrimpWeight']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.DynamicData['ShrimpWeight']&&typeof(suggData.DynamicData['ShrimpWeight'])=='number'?((suggData.DynamicData['ShrimpWeight']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['ShrimpWeight']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度">蝦子重量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                </v-col>
                                                            </v-row>
                                                            <!-- <v-text-field v-model="suggData.DynamicData['FCR']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend"  title="累計飼料量、蝦子長度、水體體積、放養密度">FCR(換肉率)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['ADG']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、養殖天數、養殖起始日">ADG(每日增重量)(g/day)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['BiomassOfShrimp']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算內存量，因為需要每日體重投餌率">內存量(累積料量)(kg)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['Biomass']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算內存量，因為需要每日體重投餌率">內存量(體重投餌率)(kg)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['SurvivalRate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算存活率，因為需要內存量">存活率(%)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['EstimatedFeedTotal']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="尚無法計算">預估所需飼料量(g)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['EstimatedProduction']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="尚無法計算">預估產量(kg)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['EstimatedCatchingDate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="養殖起始日">預計間補日期</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['EstimatedCatchingAmount']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="尚無法計算">預計間補量</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['FeedAmountInObservation']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，小蝦不會用觀察網">觀察網網上料量(g)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['WeightFeedRate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度">每日體重投餌率(%)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['ShrimpWeight']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度">蝦子重量(g)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['Drain']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="尚無法計算">排汙量(噸)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.DynamicData['CumulativeDrainAmount']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="尚無法計算">累計排汙量(噸)</span></v-text-field> -->
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 養殖前期做水添加物 -->
                                        <v-expansion-panels accordion multiple v-model="panel.panel_row33">
                                            <v-expansion-panel id="aiinput" class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;" expand-icon="mdi-chevron-down">養殖前期做水添加物</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-row class="item-row">
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">砂糖量(做水)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.MakeWater['SugarMakeWater']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.MakeWater['SugarMakeWater']&&typeof(suggData.MakeWater['SugarMakeWater'])=='number'?((suggData.MakeWater['SugarMakeWater']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>    
                                                                    <!-- <v-text-field v-model="suggData.MakeWater['SugarMakeWater']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量(做水)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">漂白粉(30ppm濃度)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.MakeWater['BleachingPowder']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.MakeWater['BleachingPowder']&&typeof(suggData.MakeWater['BleachingPowder'])=='number'?((suggData.MakeWater['BleachingPowder']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.MakeWater['BleachingPowder']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">漂白粉(30ppm濃度)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">海波</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.MakeWater['Hypo']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.MakeWater['Hypo']&&typeof(suggData.MakeWater['Hypo'])=='number'?((suggData.MakeWater['Hypo']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.MakeWater['Hypo']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">海波</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">尿素</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.MakeWater['Urea']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.MakeWater['Urea']&&typeof(suggData.MakeWater['Urea'])=='number'?((suggData.MakeWater['Urea']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.MakeWater['Urea']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">尿素</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                            </v-row>
                                                            <!-- <v-text-field v-model="suggData.MakeWater['SugarMakeWater']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量(做水)(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.MakeWater['BleachingPowder']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">漂白粉(30ppm濃度)(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.MakeWater['Hypo']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">海波(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.MakeWater['Urea']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">尿素(kg)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.MakeWater['SugarMakeWater']" dense hide-details class="mt-0"><span class="pa-0 ma-0 text-center" slot="prepend">砂糖量 (降紫菌)</span></v-text-field> -->
                                                            <!-- <v-text-field v-model="suggData.MakeWater['SugarMakeWater']" dense hide-details class="mt-0"><span class="pa-0 ma-0 text-center" slot="prepend">砂糖量 (降靛菌)</span></v-text-field> -->
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </div>
                                    
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
                
            </div>
            <!-- 移至最上方 -->
            <div class="fixed-btn">
                <div  v-if="windowWidth>960" class="bact-to-top">
                    <!-- <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <button class="btn-primary" @click="goAnchor('top')" v-bind="attrs" v-on="on">
                                <v-icon>mdi-chevron-double-up</v-icon>
                            </button>
                        </template>
                        <span>回到上方</span>
                    </v-tooltip> -->
                </div>
                <div v-else class="to-self">
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <button class="btn-primary btn-to" @click="goAnchor('params')" v-bind="attrs" v-on="on">
                                <v-icon>mdi-pencil</v-icon>
                            </button>
                        </template>
                        <span>回到參數設定</span>
                    </v-tooltip>
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <button class="btn-primary btn-to to-ai" @click="if(windowWidth>959.58){goAnchor('#ai')}else{goAnchor('#aifeed')}" v-bind="attrs" v-on="on">
                                <v-icon>mdi-crosshairs-gps</v-icon>
                            </button>
                        </template>
                        <span>回到AI建議</span>
                    </v-tooltip>
                </div>
            </div>
        </v-card>
       <!-- AI alert dialog -->
        <v-dialog id="alertDialog" v-model="alertDialog" max-width="500px" style="z-index: 9999;">
            <v-card>
                <v-card-title class="add-title" style="display: flex;align-items: center;">
                    <div class="dialog-title">
                        {{ dialogTitle }}
                    </div>
                    <!-- <div class="btn-groups" style="display: flex;align-items: center;"
                          :style="{'justifyContent':`${windowWidth>960?'flex-end':'flex-start'}`}">
                        <v-btn icon @click="cellsize -= 0.1"><v-icon>mdi-format-annotation-minus</v-icon></v-btn>
                        <v-btn icon @click="cellsize = 0.9"><v-icon>mdi-format-color-text</v-icon></v-btn>
                        <v-btn icon @click="cellsize += 0.1"><v-icon>mdi-format-annotation-plus</v-icon></v-btn>
                    </div> -->
                </v-card-title>
                <div class="basic" style="padding: 24px 12px;">
                    <v-card-text class="dialog-text">
                        <b :style="`font-size:${cellsize+0.1}em`">狀態作動</b> <span :style="`font-size:${cellsize}em`" v-html="setBR(dialogContent.status)"></span>
                    </v-card-text>
                    <v-card-text class="dialog-text" style="display: flex;align-items: flex-start;flex-direction: column;padding: 8px 16px;border-bottom:1px solid rgba(0,0,0,0.1)">
                        <b :style="`font-size:${cellsize+0.1}em`">可能影響原因</b> <span :style="`font-size:${cellsize}em`">{{ dialogContent.factor }}</span>
                    </v-card-text>
                    <v-card-text class="dialog-text" style="display: flex;align-items: flex-start;flex-direction: column;padding: 8px 16px;border-bottom:1px solid rgba(0,0,0,0.1)">
                        <b :style="`font-size:${cellsize+0.1}em`">會造成結果</b> <span :style="`font-size:${cellsize}em`">{{dialogContent.result==''?'無':dialogContent.result }}</span>
                    </v-card-text>
                </div>
                <v-card-actions style="padding: 24px 12px;">
                    <v-spacer></v-spacer>
                    <v-btn class="btn-primary" @click="alertDialog=false">關閉</v-btn>
                </v-card-actions>
                
                <!-- <v-simple-table fixed-header dense height="200px">
                    <template v-slot:default>
                        <thead>
                            <tr>
                            <th>
                                狀態作動
                            </th>
                            <th>
                                可能影響原因
                            </th>
                            <th>
                                會造成結果
                            </th>
                            <th>  </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td v-html="setBR(dialogContent.status)"></td>
                                <td>{{ dialogContent.factor }}</td>
                                <td>{{ dialogContent.result }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table> -->
            </v-card>
        </v-dialog> 
    </div>
</template>

<script>
import nerdamer from 'nerdamer';
import dayjs from "dayjs";
import _ from "lodash";
import { number } from 'echarts/lib/export';
export default {
    layout: "emptynologin",
    head() {
        return {
            title: '知識庫-鷹眼 v2.0'
        }
    },
    data() {
        return {
            UserData:{Username:'',IsSaved:false},//使用者相關資訊
            BaseParm:{InspectedTime:'',InspectedDate:''},//養殖基本參數
            BreedingParm:{},//養殖參數
            FeedParm:{CumulativeFeedAmountInput:0},//飼料參數
            MakeWaterParm:{},//做水參數
            WaterQualityData:{},//水質資訊
            ObservationData:{Leftover:0},//觀察網資訊
            BacteriaData:{},//水中菌相資訊
            suggData: { DynamicData: {}, WaterQuality: {}, Observation: {}, Feed: { feed_amount: {}, "statistics": {}, "status": "" }, Material: {}, MakeWater: {} },//ai建議
            optData:{},//選項
            querryData:[],//查詢紀錄
            querryDataLst:{"1":[],"2":[],"3":[],"4":[]},//查詢紀錄lst
            querrySelected:"",
            querrySelectedLst:{"1":"","2":"","3":"","4":""},
            pondNameLst:{1:'研發一場武曲A1',2:'研發一場武曲A3',3:'研發一場紫微3-2',4:'研發一場紫微4-6'},
            panel:{panel_row11:[0],panel_row12:[0],panel_row13:[0],panel_row14:[0],
                   panel_row21:[0],panel_row22:[0],panel_row23:[0],panel_row24:[0],panel_row25:[0],
                   panel_row30:[0],panel_row31:[0],panel_row32:[0],panel_row33:[0,1]},
            lightColor:{'Do':'teal','pH':'teal','Temp':'teal','LastTemp':'teal','Salinity':'teal','AmmoniaN':'teal','NO2':'teal','Mg':'teal','Ca':'teal','Alk':'teal'},
            lightData: {
                    Do: {
                        warning: {1: ['4.5 <= Do', 'Do < 5']},
                        critical: {1: ['Do < 4.5']}
                    },
                    pH: {
                        critical: {1: ['pH < 7.9'], 2: ['pH > 8.6']}
                    },
                    Temp: {
                        warning: {1: ['15 <= Temp', 'Temp < 22']},
                        critical: {1: ['Temp > 32'], 2: ['Temp < 15']}
                    },
                    LastTemp: {
                        warning: {1: ['15 <= LastTemp', 'LastTemp < 22']},
                        critical: {1: ['LastTemp > 32'], 2: ['LastTemp < 15']}
                    },
            },
            menu_startdate:false,//養殖起日
            rules: { require: [v => !!v || "*必要項目"] },
            menu_inspecteddate:false,//資料日
            nowSelectPool: '',// 現在選擇的池
            allData:[], // 場區池架構，為了比對池id
            nowSelectDataLst: [],// 現在選擇的池有的編輯紀錄
            isSearch: false, // 是否有點選查詢，有才顯示編輯按鈕群
            oldSelect: '', // 未儲存時，切換不同池時要還原
            windowWidth: window.innerWidth,
            windowHeight:window.innerHeight,
            // 是否感染
            bacteriaAll:['IsWSSV','IsEMSPlasmid','IsEMSToxin','IsEHP','IsTSV','IsIMNV','IsIHHNV'],
            bacteriaSelect:[],
            bacteriaDataObject:{},
            bacteriaRecord: [],
            // Dialog
            alertDialog: false,
            dialogTitle: '',
            dialogContent: {},
            cellsize: 0.9,
            // 錨點收合
            settingOpen: false,
            aiOpen: false,
            nowExpand: true,

        }
    },
    methods: {
        onChange(value,dateString) {
            console.log(value,dateString);
        },
        onOk(value) {
            console.log(value);
        },
        // locateSelect
        async get_scopeData(evt) {
            console.log('select pool',evt);
            if(this.nowSelectPool!==evt) {
                this.nowSelectPool = evt;
                this.querrySelected = '';
                this.isSearch = false;
                this.resetParm();
                this.importBasicData();//帶入數據
            }
            this.allData.forEach(f=>{
                f.node.forEach(a=>{
                    a.node.forEach(p=>{
                        if(p.id == evt) {
                            this.BaseParm['Factory'] = f.name;
                            this.BaseParm['PondArea'] = a.name;
                            this.BaseParm['Pond'] = p.name;
                        }
                    })
                    
                })
            })
            
            this.nowSelectDataLst = this.querryDataLst[this.nowSelectPool];
            if(this.nowSelectDataLst==undefined) {
                this.resetParm();
            }
            console.log('nowSelectDataLst',this.nowSelectDataLst);
            // this.importBasicData();//帶入數據
            // this.allData.forEach(d=>{d.node.forEach(s=>{s.node.forEach(p=>{if(p.id==evt)this.nowSelectPool=s.name+'_'+p.name})})});
        },
        // 帶入參數
        getSelectData(evt) {
            console.log('Change Select',evt);
            this.isSearch = false;
            if(evt==null) {
                this.resetParm();
                this.querrySelected = evt;
                this.oldSelect = null;
            }
            if(evt!==this.oldSelect) {
                this.resetParm();
                this.oldSelect = evt;
                if(evt!==null) {
                    this.importQuerry();
                }
            }
        },
        goAnchor(selector) {
            if(selector=='top') {
                window.scrollTo({top: 0, behavior: 'smooth'});
            }else if(selector=='params' || selector=='ai') {
                let ele = document.getElementById(selector);
                let eTop = ele.offsetTop;
                ele.scrollIntoView({
                    behavior: "smooth",
                    top: eTop,
                });
            }else {
                let ele = document.querySelector(selector);
                let eTop = ele.offsetTop;
                ele.scrollIntoView({
                    behavior: "smooth",
                    top: eTop,
                });
            }
            
        },
        getAllData: async function () {
            await this.$axios
                .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
                .then(res=>{
                    this.allData = res.data;
                    this.querrySelectedLst = {};
                    this.querryDataLst = {}
                    this.allData.forEach(f=>{
                        f.node.forEach(a=>{
                            a.node.forEach(p=>{
                                this.querrySelectedLst[`${p.id}`] = '';
                                this.querryDataLst[`${p.id}`] = [];
                            })
                        })
                    })
                    console.log('architecture',res);
                    console.log('querrySelectedLst',this.querrySelectedLst);
                })
                .catch(error=>{
                    console.log(error);
                })
        },
        getNowDate: function() {
            let mydate = dayjs().format("YYYY-MM-DD");
            return mydate;
        },
        getNowTime: function() {
            let mytime = dayjs().format("HH:mm");
            return mytime;
        },
        addFeedQty:function(){
            // console.log('LastFeedInput',this.FeedParm['LastFeedInput']);
            if(typeof(this.FeedParm['LastFeedInput'])=='number'){
                this.FeedParm['CumulativeFeedAmountInput'] = (this.FeedParm['CumulativeFeedAmountInput']==undefined || this.FeedParm['CumulativeFeedAmountInput']==NaN)?0:Number(this.FeedParm['CumulativeFeedAmountInput']);
                var mynumber = Number((this.FeedParm['CumulativeFeedAmountInput'] + this.FeedParm['LastFeedInput']).toFixed(3));
                // console.log("add",this.FeedParm['CumulativeFeedAmountInput'],this.FeedParm['LastFeedInput'],mynumber);
                
                this.FeedParm['CumulativeFeedAmountInput'] = mynumber;
            }else{
                // console.log(this.FeedParm['LastFeedInput'],typeof(this.FeedParm['LastFeedInput']));
                return;
            }
        },
        setBR:function(msg){
            if(msg) {
                var newmsg = _.cloneDeep(msg).replaceAll('。','。</br>');
                if(newmsg.slice(-5)=='</br>'){
                    newmsg = newmsg.substring(0,newmsg.length-5);
                }
                return newmsg;
            }else {
                return '';
            }
            
            
        },
        getlightData:async function(){
            let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/warning-range/`;
            await this.$axios.get(url).then(res => {
                if(res.status==200){
                    this.lightData = res.data;
                    console.log(this.lightData)
                    this.lightData['LastTemp'] = _.cloneDeep(this.lightData['Temp']);
                    this.lightData['LastTemp']['critical'][1].forEach((x,i)=>{this.lightData['LastTemp']['critical'][1][i]=x.replace('Temp','LastTemp')});
                    this.lightData['LastTemp']['critical'][2].forEach((x,i)=>{this.lightData['LastTemp']['critical'][2][i]=x.replace('Temp','LastTemp')});
                    this.lightData['LastTemp']['warning'][1].forEach((x,i)=>{this.lightData['LastTemp']['warning'][1][i]=x.replace('Temp','LastTemp')});
                    //list轉成格式：{'Do':'teal','pH':'teal','Temp':'teal','Salinity':'teal','AmmoniaN':'teal','NO2':'teal'},
                    this.lightColor = Object.keys(res.data).reduce((a, v) => ({ ...a, [v]: 'teal'}), {}); 
                    console.log("get lightData ok");
                }else{
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }
            })
            .catch(error=>{
                this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            });
        },
        getsuggData:async function(){
            this.suggData = {
                DynamicData: {},
                WaterQuality: [],//ai建議-水質
                Observation: [],//ai建議-觀察網
                Feed: { feed_amount: {}, statistics: {}, status: "" },//ai建議-投餌量
                Material: {},//投料判斷列表
                MakeWater: {}//養殖前期做水添加物
            };
        },
        getOptData:async function(){
            let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/field-option/`;
            await this.$axios.get(url).then(res => {
                if(res.status==200){
                    this.optData = res.data;
                    console.log('getOptData',this.optData);
                }else{
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }
            })
            .catch(error=>{
                this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            })
            .finally(() => {
                var isYN = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    //ObservationData
                    this.optData.IsMoultingPeriod = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    //BacteriaData
                    this.optData.IsWSSV = _.cloneDeep(isYN);
                    this.optData.IsEMSPlasmid = _.cloneDeep(isYN);
                    this.optData.IsEMSToxin = _.cloneDeep(isYN);
                    this.optData.IsEHP = _.cloneDeep(isYN);
                    this.optData.IsTSV = _.cloneDeep(isYN);
                    this.optData.IsIMNV = _.cloneDeep(isYN);
                    this.optData.IsIHHNV = _.cloneDeep(isYN);
                    // this.optData.IsEMSInfected = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    // this.optData.IsEHPInfected = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    // this.optData.IsVirusInfected = [{ "name_en": false, "name_ch": "否" }, { "name_en": true, "name_ch": "是" }];
                    // this.optData.IsBacteriumInfected = [{ "name_en": false, "name_ch": "否" }, { "name_en": true, "name_ch": "是" }];
                });
        },
        getQuerry:async function(isAdd){
            // if(this.querryData.length>0){
            //     return;
            // }
            let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/`;
            var allParm = {
                IsLast:false,
                Username:(this.$auth.$state.user==null)?"":this.$auth.$state.user.email
            };
            if(this.$auth.$state.user==null){
                this.$toast.error(`需重新登入`, { duration: 2000 });
                return;
            }
            await this.$axios.get(url, {params:allParm}).then(res => {
                if(res.status==200){
                    this.querryData = res.data;
                    this.querryDataLst = {};
                    for(let i=0;i<this.querryData.length;i++) {
                        this.allData.forEach(f=>{
                            if(f.name == this.querryData[i].factory_name) {
                                f.node.forEach(a=>{
                                    if(a.name == this.querryData[i].pond_area_name){
                                        a.node.forEach(p=>{
                                            if(p.name == this.querryData[i].pond_name) {
                                                if(!this.querryDataLst[p.id]) {
                                                    this.querryDataLst[p.id] = [];
                                                }
                                                this.querryDataLst[p.id].push(this.querryData[i]);
                                            }
                                        })
                                    }
                                    
                                })
                            }
                            
                        })
                    }
                    this.nowSelectDataLst = this.querryDataLst[this.nowSelectPool];
                    console.log('querryData',this.querryData);
                    console.log('querydatalst',this.querryDataLst);
                    console.log('nowSelectDataLst',this.nowSelectDataLst);
                    this.get_scopeData(this.nowSelectPool);
                    if(isAdd) {
                        let alldate = [];
                        this.nowSelectDataLst.forEach(p=>{
                            alldate.push(p.created_time);
                        })
                        let maxDate = new Date(Math.max(...alldate.map(date => new Date(date))));
                        this.querrySelected = dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
                        this.getSelectData(this.querrySelected);
                        this.importQuerry();
                    }
                    if(this.windowWidth<959.58) {
                        setTimeout(()=>{
                            this.goAnchor('#aiwatermin');
                        },100)
                    }
                        
                }
                else if(res.status == 400){
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }
                else{
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }

            }).catch(error => {
                this.$toast.error(`資料Fail:${error}\n${JSON.stringify(error.response.data)}`, { duration: 5000 });
            })
            .finally(() => {
                    //this.getdata();
            });

        },
        importQuerry:async function(_input_data = null,bool=false){
            if(this.querrySelected==null && _input_data == null){
                this.resetParm();
                return;
            }else{
                this.isSearch = true;
                // console.log("querrySelected:",this.querrySelected);
                var input_data = {};
                if(_input_data==null){
                    input_data = _.cloneDeep(this.querryData.filter(x=>x.created_time==this.querrySelected)[0].input_data);
                }else{
                    input_data = _input_data;
                }
                console.log('import',input_data)
                this.BaseParm = input_data.BaseParm;
                this.BreedingParm = input_data.BreedingParm;
                this.FeedParm = input_data.FeedParm;
                if(this.FeedParm['LastFeedDatetime']) {
                    this.FeedParm['LastFeedDatetime'] = this.$moment(new Date(this.FeedParm['LastFeedDatetime']), 'YYYY-MM-DD HH:mm:ss');
                }
                if(this.FeedParm['CumulativeFeedAmountInput']) {}else {
                    this.FeedParm['CumulativeFeedAmountInput'] = 0;
                }
                
                this.MakeWaterParm = input_data.MakeWaterParm;
                this.WaterQualityData = input_data.WaterQualityData;
                this.ObservationData = input_data.ObservationData;
                if(this.ObservationData['SamplingDatetime']) {
                    this.ObservationData['SamplingDatetime'] = this.$moment(new Date(this.ObservationData['SamplingDatetime']), 'YYYY-MM-DD HH:mm:ss');
                }
                if(this.ObservationData['LastSamplingDatetime']) {
                    this.ObservationData['LastSamplingDatetime'] = this.$moment(new Date(this.ObservationData['LastSamplingDatetime']), 'YYYY-MM-DD HH:mm:ss');
                }
                this.BacteriaData = input_data.BacteriaData;
                console.log("DiseaseInfection:",input_data.BacteriaData.DiseaseInfection);
                
                this.bacteriaSelect = [];
                this.bacteriaDataObject = input_data.BacteriaData.DiseaseInfection;
                for(let i=0;i<this.bacteriaAll.length;i++) {
                    if(input_data.BacteriaData.DiseaseInfection != undefined && input_data.BacteriaData.DiseaseInfection[this.bacteriaAll[i]]==1) {
                        this.bacteriaSelect.push(this.bacteriaAll[i]);
                    }
                }
                //reset suggData
                //suggData: { DynamicData: {}, WaterQuality: {}, Observation: {}, Feed: { feed_amount: {}, "statistics": {}, "status": "" }, Material: {}, MakeWater: {} },//ai建議
                var output_data = { DynamicData: {}, WaterQuality: {}, Observation: {}, Feed: { feed_amount: {}, "statistics": {}, "status": "" }, Material: {}, MakeWater: {} };
                if(_input_data==null){
                    output_data = _.cloneDeep(this.querryDataLst[this.nowSelectPool].filter(x => x.created_time == this.querrySelected)[0].output_data);
                }else{
                    
                }
                console.log('querryDataLst[this.nowSelectPool]',output_data)
                this.suggData = {
                    "DynamicData": output_data.DynamicData,
                    "WaterQuality": output_data.WaterQuality,//ai建議-水質
                    "Observation": output_data.Observation,//ai建議-觀察網
                    "Feed": output_data.Feed,//ai建議-投餌量
                    "Material": output_data.Material,//投料判斷列表
                    "MakeWater": output_data.MakeWater//養殖前期做水添加物
                };
                if(this.windowWidth<959.58 && !bool) {
                    setTimeout(()=>{
                        this.goAnchor('#aiwatermin');
                    },100)
                }
            }
            
            return;
        },
        delQuerry:async function(querrypool){
            // if(this.querrySelectedLst[querrypool]==null){
            //     this.resetParm();
            //     return;
            // }else{
                var id = this.querryDataLst[querrypool].filter(x=>x.created_time==this.querrySelected)[0].id;
                let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/${id}/`;
                if(confirm(`是否刪除該筆紀錄？ id = ${id}`)){
                    await this.$axios
                        .delete(url)
                        .then(res => {
                            if(res.data=='刪除成功'){
                                this.$toast.success("刪除成功", { duration: 2000 });
                                // this.getQuerry2(querrypool,true);//reget data
                                this.getQuerry();
                                // this.querrySelectedLst[querrypool] = "";
                                this.resetParm();
                                this.querrySelected = '';
                                this.isSearch = false;
                            }else{
                                this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
                            }

                            console.log("刪除步驟API:" + res.request.responseURL);
                        })
                        .catch(error => {
                            this.$toast.error("error:" + error, { duration: 2000 });
                        })
                        .finally(() => {
                            // this.getQuerry2(querrypool,true);
                        });
                }else{
                    this.$toast.error("刪除取消", { duration: 2000 });
                }
            // }
        },
        patchQuerry:async function(querrypool){
            // if (this.querrySelectedLst[querrypool] == null) {
            //     return;
            // } else {
                //先查詢
                await this.postParm(false,null,true);//isSaved=false,querrypool=null,isPatch=false
                //再儲存
                    //取參數
                    this.UserData.Username = (this.$auth.$state.user==null)?"":this.$auth.$state.user.email;
                    this.UserData.IsSaved = true;
                    var input_data = {
                        'BaseParm': this.BaseParm,
                        'BreedingParm': this.BreedingParm,
                        'FeedParm': _.cloneDeep(this.FeedParm),
                        'MakeWaterParm': this.MakeWaterParm,
                        'WaterQualityData': this.WaterQualityData,
                        'ObservationData': _.cloneDeep(this.ObservationData),
                        'BacteriaData': this.BacteriaData,
                        'UserData': this.UserData
                    };
                    // console.log('bacteriaDataObject',this.bacteriaDataObject)
                    input_data.BacteriaData['DiseaseInfection'] = this.bacteriaDataObject;
                    if(input_data.FeedParm['LastFeedDatetime']) {
                        let maxDate = new Date(this.FeedParm['LastFeedDatetime']);
                        input_data.FeedParm['LastFeedDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
                    }
                    if(input_data.ObservationData['SamplingDatetime']) {
                        let maxDate = new Date(this.ObservationData['SamplingDatetime']);
                        input_data.ObservationData['SamplingDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
                    }
                    if(input_data.ObservationData['LastSamplingDatetime']) {
                        let maxDate = new Date(this.ObservationData['LastSamplingDatetime']);
                        input_data.ObservationData['LastSamplingDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
                    }
                    var output_data = this.suggData;
                    var allParm = {
                        input_data:input_data,
                        output_data:output_data
                    }
                var id = this.querryDataLst[querrypool].filter(x => x.created_time == this.querrySelected)[0].id;
                console.log('patch',this.querryDataLst[querrypool].filter(x => x.created_time == this.querrySelected))
                let url = `${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/${id}/`;
                if (confirm(`是否覆蓋該筆紀錄？ id = ${id}`)) {
                    await this.$axios
                        .patch(url, allParm)
                        .then(res => {
                            if (res.data == '修改成功') {
                                this.$toast.success("覆蓋成功!!", { duration: 2000 });
                                this.getQuerry();
                            } else {
                                this.$toast.success("覆蓋失敗：" + res.data, { duration: 2000 });
                            }
                        })
                        .catch(error => {
                            this.$toast.error("覆蓋error:" + error, { duration: 2000 });
                        })
                        .finally(() => {
                            
                        });
                } else {
                    this.$toast.error("覆蓋取消", { duration: 2000 });
                }
            // }
        },
        postParm:async function(isSaved=false,querrypool=null,isPatch=false){
            this.UserData.IsSaved = isSaved;
            // console.log("養殖基本參數 BaseParm",this.BaseParm);
            // console.log("養殖參數 BreedingParm",this.BreedingParm);
            // console.log("飼料參數 FeedParm",this.FeedParm);
            // console.log("做水參數 MakeWaterParm",this.MakeWaterParm);
            // console.log("水質資訊 WaterQualityData",this.WaterQualityData);
            // console.log("觀察網資訊 ObservationData",this.ObservationData);
            // console.log("水中菌相資訊 BacteriaData",this.BacteriaData);
            // console.log("使用者相關資訊 UserData",this.UserData);
            this.UserData.Username = (isSaved)?this.$auth.$state.user.email:"";
            
            var allParm = {
                'BaseParm':this.BaseParm,
                'BreedingParm':this.BreedingParm,
                'FeedParm':_.cloneDeep(this.FeedParm),
                'MakeWaterParm':this.MakeWaterParm,
                'WaterQualityData':this.WaterQualityData,
                'ObservationData':_.cloneDeep(this.ObservationData),
                'BacteriaData':this.BacteriaData,
                'UserData':this.UserData
            };
            // console.log('bacteriaDataObject',this.bacteriaDataObject)
            allParm.BacteriaData['DiseaseInfection'] = this.bacteriaDataObject;
            if(allParm.FeedParm['LastFeedDatetime']) {
                let maxDate = new Date(this.FeedParm['LastFeedDatetime']);
                allParm.FeedParm['LastFeedDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
            }
            if(allParm.ObservationData['SamplingDatetime']) {
                let maxDate = new Date(this.ObservationData['SamplingDatetime']);
                allParm.ObservationData['SamplingDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
            }
            if(allParm.ObservationData['LastSamplingDatetime']) {
                let maxDate = new Date(this.ObservationData['LastSamplingDatetime']);
                allParm.ObservationData['LastSamplingDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
            }
            console.log("all參數：",allParm);
            let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/suggestion/`;
            await this.$axios.post(url, allParm).then(res => {
                if(res.status==200){
                    this.suggData.DynamicData = res.data.DynamicData;
                    this.suggData.WaterQuality = res.data.WaterQuality;
                    this.suggData.Observation = res.data.Observation;
                    this.suggData.Feed = res.data.Feed;
                    this.suggData.Material = res.data.Material;
                    this.suggData.MakeWater = res.data.MakeWater;
                    if (isPatch == false) {
                        this.$toast.success(`新增成功`, {
                            duration: 2000
                        });
                    }
                    // console.log("suggData:",this.suggData);
                } else {
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }
                console.log("新增API:" + res.request.responseURL);
            }).catch(error => {
                this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            })
            .finally(() => {
                    //this.getdata();
            });
            if(isSaved){
                // console.log("querrypool:",querrypool);
                if(this.nowSelectPool!=null){
                    this.getQuerry(true);
                    this.isSearch = true;
                }else{
                    //clear all
                    this.querryDataLst={"1":[],"2":[],"3":[],"4":[]};
                }
                //need reget dropdownlist data
                // var pondLst = Object.keys(this.pondNameLst);
                // pondLst.forEach(element => {
                //     console.log(pondLst[element]);
                //     console.log(this.pondNameLst[pondLst[element]]);
                // });

            }
            // BaseParm['Factory'] + BaseParm['PondArea']+ BaseParm['Pond']) == ['1']
            // this.getQuerry2();
        },
        setParm: async function (poolbtn = 'a') {
            this.resetParm();
            if (poolbtn == 'a') {
                this.BaseParm = {
                    "Factory": "研發一場",
                    "PondArea": "武曲",
                    "Pond": "A1",
                    "Shape": "Rectangle",
                    "StartedDate": "2023-08-29",
                    "WaterSource": "Groundwater",
                    "WaterSourceSalinity": 15,
                    "WaterBody": 123,
                    "Density": 403,
                    "InspectedDate":this.getNowDate(),
                    "InspectedTime":this.getNowTime(),

                    //"Days": 15
                };
                this.BreedingParm = {
                    "CN": 12,
                    // "EstimatedFCR": 1.6,
                    // "EstimatedADG": 0.12,
                    "InitialLength": 0.0018,
                    // "EstimatedSurvivalRate": 90
                };
                this.FeedParm = {
                    //"Brand": "健丞",
                    //"Price": 630,
                    "CrudeProteinPct": 40,
                    "Nitrogen": 16,
                    "SugarSourcePurity": 99.6,
                    "SugarSourceCarbonPct": 42,
                    "FeedCN": 7.8,
                    // "LastFeedInput": 1.255,
                    // "CumulativeFeedAmountInput": 2.525
                };
                this.MakeWaterParm = {
                    // "Urea": 30,
                    "UreaEffectiveConcentration": 95,
                    "BleachingPowderEffectiveConcentration": 70,
                    // "Chlorine": 30,//餘氯
                    "HypoEffectiveConcentration": 67.3
                };
                this.WaterQualityData = {
                    // "Do": 6,
                    // "pH": 7.8,
                    // "Temp": 32,
                    // "Salinity": 35,
                    // "AmmoniaN": 2,
                    // "NO2": 5,
                    // "Mg": 1000,
                    // "Ca": 450,
                    // "Alk": 200,
                    // "WaterColor": "DarkGreen"
                };
                this.ObservationData = {
                    // "IsMoultingPeriod": false,
                    // "IntestinalColor": "Black",
                    // "HepatopancreasColor": "Dark",
                    // "MuscleColor": "Turbidity",
                    // "BodyIllnessLocation": "None",
                    // "Moulting": "Normal",
                    "Leftover": 0,
                    // "DeadShrimpRate": 0.9,
                    // "ShrimpLength": 2.5
                };
                this.BacteriaData = {
                    // "Biofloc": 80,
                    // "BacillusSubtilis": 4999,
                    // "VibrioAlginolyticus": 500,
                    // "VibrioCholerae": 500,
                    // "VibrioEnteritidis": 500,
                    // "VibrioVulnificus": 500,
                    // "IsEMSInfected": false,
                    // "IsEHPInfected": false,
                    // "IsVirusInfected": false,
                    // "IsBacteriumInfected": false
                };
                return;
            }
            if (poolbtn == 'b') {
                this.BaseParm = {
                    "Factory": "研發一場",
                    "PondArea": "武曲",
                    "Pond": "A3",
                    "Shape": "Rectangle",
                    "StartedDate": "2023-08-29",
                    "WaterSource": "Groundwater",
                    "WaterSourceSalinity": 15,
                    "WaterBody": 114,
                    "Density": 515,
                    "InspectedDate":this.getNowDate(),
                    "InspectedTime":this.getNowTime(),
                    //"Days": 15
                };
                this.BreedingParm = {
                    "CN": 12,
                    // "EstimatedFCR": 1.6,
                    // "EstimatedADG": 0.12,
                    "InitialLength": 0.0018,
                    // "EstimatedSurvivalRate": 90
                };
                this.FeedParm = {
                    //"Brand": "健丞",
                    //"Price": 630,
                    "CrudeProteinPct": 40,
                    "Nitrogen": 16,
                    "SugarSourcePurity": 99.6,
                    "SugarSourceCarbonPct": 42,
                    "FeedCN": 7.8,
                    // "LastFeedInput": 1.255,
                    // "CumulativeFeedAmountInput": 2.525
                };
                this.MakeWaterParm = {
                    // "Urea": 30,
                    "UreaEffectiveConcentration": 95,
                    "BleachingPowderEffectiveConcentration": 70,
                    // "Chlorine": 30,//餘氯
                    "HypoEffectiveConcentration": 67.3
                };
                this.WaterQualityData = {
                    // "Do": 6,
                    // "pH": 7.8,
                    // "Temp": 32,
                    // "Salinity": 35,
                    // "AmmoniaN": 2,
                    // "NO2": 5,
                    // "Mg": 1000,
                    // "Ca": 450,
                    // "Alk": 200,
                    // "WaterColor": "DarkGreen"
                };
                this.ObservationData = {
                    // "IsMoultingPeriod": false,
                    // "IntestinalColor": "Black",
                    // "HepatopancreasColor": "Dark",
                    // "MuscleColor": "Turbidity",
                    // "BodyIllnessLocation": "None",
                    // "Moulting": "Normal",
                    "Leftover": 0,
                    // "DeadShrimpRate": 0.9,
                    // "ShrimpLength": 2.5
                };
                this.BacteriaData = {
                    // "Biofloc": 80,
                    // "BacillusSubtilis": 4999,
                    // "VibrioAlginolyticus": 500,
                    // "VibrioCholerae": 500,
                    // "VibrioEnteritidis": 500,
                    // "VibrioVulnificus": 500,
                    // "IsEMSInfected": false,
                    // "IsEHPInfected": false,
                    // "IsVirusInfected": false,
                    // "IsBacteriumInfected": false
                };
                return;
            }
            if (poolbtn == 'c') {
                this.BaseParm = {
                    "Factory": "研發一場",
                    "PondArea": "紫微",
                    "Pond": "3-2",
                    "Shape": "Rectangle",
                    "StartedDate": "2023-08-29",
                    "WaterSource": "Groundwater",
                    "WaterSourceSalinity": 15,
                    "WaterBody": 303,
                    "Density": 223,
                    "InspectedDate":this.getNowDate(),
                    "InspectedTime":this.getNowTime(),
                    //"Days": 15
                };
                this.BreedingParm = {
                    "CN": 12,
                    // "EstimatedFCR": 1.6,
                    // "EstimatedADG": 0.12,
                    "InitialLength": 0.0018,
                    // "EstimatedSurvivalRate": 90
                };
                this.FeedParm = {
                    //"Brand": "健丞",
                    //"Price": 630,
                    "CrudeProteinPct": 40,
                    "Nitrogen": 16,
                    "SugarSourcePurity": 99.6,
                    "SugarSourceCarbonPct": 42,
                    "FeedCN": 7.8,
                    // "LastFeedInput": 1.255,
                    // "CumulativeFeedAmountInput": 2.525
                };
                this.MakeWaterParm = {
                    // "Urea": 30,
                    "UreaEffectiveConcentration": 95,
                    "BleachingPowderEffectiveConcentration": 70,
                    // "Chlorine": 30,//餘氯
                    "HypoEffectiveConcentration": 67.3
                };
                this.WaterQualityData = {
                    // "Do": 6,
                    // "pH": 7.8,
                    // "Temp": 32,
                    // "Salinity": 35,
                    // "AmmoniaN": 2,
                    // "NO2": 5,
                    // "Mg": 1000,
                    // "Ca": 450,
                    // "Alk": 200,
                    // "WaterColor": "DarkGreen"
                };
                this.ObservationData = {
                    // "IsMoultingPeriod": false,
                    // "IntestinalColor": "Black",
                    // "HepatopancreasColor": "Dark",
                    // "MuscleColor": "Turbidity",
                    // "BodyIllnessLocation": "None",
                    // "Moulting": "Normal",
                    "Leftover": 0,
                    // "DeadShrimpRate": 0.9,
                    // "ShrimpLength": 2.5
                };
                this.BacteriaData = {
                    // "Biofloc": 80,
                    // "BacillusSubtilis": 4999,
                    // "VibrioAlginolyticus": 500,
                    // "VibrioCholerae": 500,
                    // "VibrioEnteritidis": 500,
                    // "VibrioVulnificus": 500,
                    // "IsEMSInfected": false,
                    // "IsEHPInfected": false,
                    // "IsVirusInfected": false,
                    // "IsBacteriumInfected": false
                };
                return;
            }
            if (poolbtn == 'd') {
                this.BaseParm = {
                    "Factory": "研發一場",
                    "PondArea": "紫微",
                    "Pond": "4-6",
                    "Shape": "Rectangle",
                    "StartedDate": "2023-08-29",
                    "WaterSource": "Groundwater",
                    "WaterSourceSalinity": 15,
                    "WaterBody": 228,
                    "Density": 296,
                    "InspectedDate":this.getNowDate(),
                    "InspectedTime":this.getNowTime(),
                    //"Days": 15
                };
                this.BreedingParm = {
                    "CN": 12,
                    // "EstimatedFCR": 1.6,
                    // "EstimatedADG": 0.12,
                    "InitialLength": 0.0018,
                    // "EstimatedSurvivalRate": 90
                };
                this.FeedParm = {
                    //"Brand": "健丞",
                    //"Price": 630,
                    "CrudeProteinPct": 40,
                    "Nitrogen": 16,
                    "SugarSourcePurity": 99.6,
                    "SugarSourceCarbonPct": 42,
                    "FeedCN": 7.8,
                    // "LastFeedInput": 1.255,
                    // "CumulativeFeedAmountInput": 2.525
                };
                this.MakeWaterParm = {
                    // "Urea": 30,
                    "UreaEffectiveConcentration": 95,
                    "BleachingPowderEffectiveConcentration": 70,
                    // "Chlorine": 30,//餘氯
                    "HypoEffectiveConcentration": 67.3
                };
                this.WaterQualityData = {
                    // "Do": 6,
                    // "pH": 7.8,
                    // "Temp": 32,
                    // "Salinity": 35,
                    // "AmmoniaN": 2,
                    // "NO2": 5,
                    // "Mg": 1000,
                    // "Ca": 450,
                    // "Alk": 200,
                    // "WaterColor": "DarkGreen"
                };
                this.ObservationData = {
                    // "IsMoultingPeriod": false,
                    // "IntestinalColor": "Black",
                    // "HepatopancreasColor": "Dark",
                    // "MuscleColor": "Turbidity",
                    // "BodyIllnessLocation": "None",
                    // "Moulting": "Normal",
                    "Leftover": 0,
                    // "DeadShrimpRate": 0.9,
                    // "ShrimpLength": 2.5
                };
                this.BacteriaData = {
                    // "Biofloc": 80,
                    // "BacillusSubtilis": 4999,
                    // "VibrioAlginolyticus": 500,
                    // "VibrioCholerae": 500,
                    // "VibrioEnteritidis": 500,
                    // "VibrioVulnificus": 500,
                    // "IsEMSInfected": false,
                    // "IsEHPInfected": false,
                    // "IsVirusInfected": false,
                    // "IsBacteriumInfected": false
                };
                return;
            }
            
            this.$toast.error(`pool:${poolbtn}，未定義`, { duration: 2000 });
        },
        resetParm:async function(){
            this.querrySelectedLst={"1":"","2":"","3":"","4":""};
            this.BaseParm = {InspectedTime:'',InspectedDate:'',Factory:this.BaseParm['Factory']?this.BaseParm['Factory']:'',PondArea:this.BaseParm['PondArea']?this.BaseParm['PondArea']:'',Pond:this.BaseParm['Pond']?this.BaseParm['Pond']:''};
            this.BreedingParm = {};
            this.FeedParm={CumulativeFeedAmountInput:0};
            this.MakeWaterParm={};
            this.WaterQualityData = {};
            this.ObservationData = {Leftover:0};
            this.BacteriaData={};
            this.bacteriaSelect = [];
            this.suggData = {
                "DynamicData": {},
                "WaterQuality": [],//ai建議-水質
                "Observation": [],//ai建議-觀察網
                "Feed": { "feed_amount": {}, "statistics": {}, "status": "" },//ai建議-投餌量
                "Material": {},//投料判斷列表
                "MakeWater": {}//養殖前期做水添加物
            };
        },
        importBasicData:async function(){//帶入數據
            if(this.nowSelectPool==""){
                this.$toast.error(`請先選擇養殖池`, { duration: 2000 });
                return;
            }else {
                this.getSelectData(null);
            }
            var parm ={
                inspected_date:this.getNowDate(),
                inspected_time: this.getNowTime(),
                pond_id : this.nowSelectPool    
            };
            // console.log("importBasicData parm:" , parm);
            let url =`${this.$store.state.mydata.gobal_api.apiUrl}/kb/required-data/`;
            await this.$axios.get(url, {params:parm}).then(res => {
                if (res.status == 200) {
                    this.importQuerry(res.data,true);//導入資料
                    this.postParm(false,null,true);//查詢ai回饋資訊
                    this.$toast.success(`取得基本資料成功`, { duration: 2000 });
                } else {
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }
                console.log("取得基本資料API:" + res.request.responseURL);
            }).catch(error => {
                this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            })
            .finally(() => {
                    //this.getdata();
            });
        },
        expandPanel:async function(exand=True){
            this.nowExpand = exand;
            if (exand) {
                this.panel = {
                    panel_row11: [0], panel_row12: [0], panel_row13: [0], panel_row14: [0],
                    panel_row21: [0], panel_row22: [0], panel_row23: [0], panel_row24: [0],panel_row25: [0],
                    panel_row30: [0], panel_row31: [0],panel_row32: [0], panel_row33: [0, 1]
                };
            }else{
                this.panel = {
                    panel_row11: [], panel_row12: [], panel_row13: [], panel_row14: [],
                    panel_row21: [], panel_row22: [], panel_row23: [], panel_row24: [],panel_row24: [],
                    panel_row30: [], panel_row31: [],panel_row32: [], panel_row33: []
                };
            }
        },
        nerdamerCheck:function(exp,params){
            // params 應該是{Do :4.5,Ca:3,Ma:4}
            // nerdamer('5 <= Do',{Do :4.5},'numer');
            var result = nerdamer(exp,params,'numer');
            if(result.text()==0){
                return false;
            }
            if(result.text()==1){
                return true;
            }
        },
        valueCheck:async function(item,value=null){
            // 'Do': {
            //         'normal': '5 <= Do <= 10',
            //         'warning': {"rule1":["4.5 <= Do","Do < 5"]},
            //         'danger': {"rule1":["Do < 4.5"],"rule1":["Do < 4.5"]}
            //     },
            if(value == null || value == ''){
                this.lightColor[item] = 'teal';
                
                return;
            }
            // console.log(item,this.lightData[item]);
            var checkstate = ['warning','critical'];
            var checkstate_bool = [false,false];
            for(var ruledatastate in checkstate){
                var ruledata = this.lightData[item][checkstate[ruledatastate]];
                checkstate_bool[ruledatastate] = false;
                if(ruledata==null){
                    continue;
                }
                
                var keysdata = Object.keys(ruledata);
                
                keysdata.forEach(ele => {//rule
                    var trueCnt=0;
                    for(var rule in ruledata[ele]){
                        var ruleitem = ruledata[ele][rule];
                        var params = {};
                        params[item] = value;
                        var nerdreslut = this.nerdamerCheck(ruleitem,params);
                        if(nerdreslut==true){
                            trueCnt += 1;
                        }
                        if(trueCnt == ruledata[ele].length){
                        checkstate_bool[ruledatastate] = true;
                        break;
                        }
                    }
                });
            }
           
            if(checkstate_bool[1]==true){
                this.lightColor[item] = 'red';
            }else if(checkstate_bool[0]==true){
                this.lightColor[item] = 'orange';
            }else{
                this.lightColor[item] = 'teal';
            }
            // console.log("ruledatastate",checkstate_bool,value,this.lightColor[item]);

        },
        getColor(item) {
            // console.log(item,this.lightColor[item]);
            if(this.WaterQualityData[item]) {
                this.valueCheck(item,this.WaterQualityData[item]);
            }else {
                this.lightColor[item] = 'teal';
            }
            return this.lightColor[item];
        },
        select(evt,bool=false) {
            console.log(this.bacteriaSelect);
            console.log(this.BacteriaData);
            if(bool) {
                var index = this.bacteriaSelect.indexOf(evt);
                this.bacteriaSelect.splice(index,1);
            }
            for(let i=0;i<this.bacteriaAll.length;i++) {
                if(this.bacteriaSelect.includes(this.bacteriaAll[i])) {
                    this.bacteriaDataObject[this.bacteriaAll[i]] = 1;
                }else {
                    this.bacteriaDataObject[this.bacteriaAll[i]] = 0;
                }
            }
            
        },
        openDialog(title,item) {
            this.alertDialog = true;
            this.dialogTitle = title;
            this.dialogContent = item;
        }
    },
    async created() {
        for(let i=0;i<this.bacteriaAll.length;i++) {
            this.bacteriaDataObject[this.bacteriaAll[i]] = 0;            
        }
        await this.getsuggData();
        await this.getOptData();
        await this.getlightData();
        await this.getAllData();
        await this.getQuerry();
        
        if(document.getElementsByClassName('ant-calendar-picker')) {
            let calendar = document.getElementsByClassName('ant-calendar-picker');
            // console.log('calendar',calendar);
            for(let i=0;i<calendar.length;i++) {
                calendar[i].style.minWidth='0';
                // console.log('calendar',calendar[i].style.minWidth);
            }
        }
        // this.resetParm();
    },
    computed: {
        ShowPoolName(){
            var Factory = (this.BaseParm["Factory"]==undefined)?'':this.BaseParm["Factory"];
            var PondArea = (this.BaseParm["PondArea"]==undefined)?'':this.BaseParm["PondArea"];
            var Pond = (this.BaseParm["Pond"]==undefined)?'':this.BaseParm["Pond"];

             return Factory + "_" + PondArea + "_" + Pond;
        },
    },
    mounted() {
        //監控視窗
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
        });
        
        
    },
    watch: {
        windowWidth:function(){
            return window.innerWidth;
        },
        windowHeight:function(){
            return window.innerHeight;
        },
    }
}
</script>

<style lang="scss" scoped>
.v-application.v-application--is-ltr {
    .v-card.kb {
        // min-height: 84vh;
        min-height: 87vh;
        overflow: hidden;
        // margin-bottom: 24px;
        margin-bottom: 8px;
        * {
            color: #00273E;
        }
        button.v-icon, button.v-btn--icon .v-icon {
            color: #006AA6;
        }
        .red--text {
            color: #A60017 !important;
        }
        .btn-primary {
            border-radius: 4px;
            box-shadow: none;
            background-color: #006AA6;
            color: #fff;
            transition: all 0.3s;
            
            &:hover {
                background-color: lighten($color: #006AA6, $amount: 2);
            }
        }
        .reset {
            background-color: transparent;
            color: #A60017 !important;
            border: 1px solid #A60017;
            transition: all 0.3s;
            &:hover {
                background-color: rgba($color: #A60017, $alpha: 0.2);
            }
        }
        .card-title,.content {
            padding: 12px;
            .row {
                margin-left: 0;
                margin-top: 0;
                margin-bottom: 12px;
            }
            .title {
                display: flex;
                align-items: center;
                width: 100%;
                .theme--light.v-icon {
                    color: #6c9bcd;
                }
            }
        }
        .card-title {
            padding-bottom: 0;
            .v-card__title {
                color: #00273E;
                font-weight: bold;
                
            }
        }
        
        .content {
            padding-top: 0;
            padding-bottom: 2px;
            .search {
                margin-top: -4px;
            }
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
                .tag {
                    font-size: 0.85rem;
                    margin-right: 8px;
                    text-decoration: underline;
                    color: #006AA6;
                }
            }
            .result > .row {
                align-items: flex-start;
            }
        }
        .v-card.result-card {
            background-color: #E6F5FA;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);
            margin: 0 2px;
            .theme--light.v-card {
                background-color: #E6F5FA;
            }
            .card-title {
                display: flex;
                align-items: center;
                padding: 4px 16px;
                &.next-line {
                    flex-direction: column;
                    .title {
                        border-bottom: none;
                    }
                    .btn-groups {
                        justify-content: flex-start;
                    }
                }
                
                .title {
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    .v-icon.v-icon {
                        font-size: 1.1rem;
                    }
                    .theme--light.v-icon {
                        color: #006AA6;
                    }
                    .v-card__title {
                        color: #006AA6;
                        font-size: 1.1rem;
                        padding: 8px;
                    }
                }
                .btn-groups {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    padding: 8px;
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
                        
                        &.btn-add {
                            background-color: #00A660;
                            &:hover {
                                background-color: lighten($color: #00A660, $amount: 3);
                            }
                            &.search {
                                background-color: transparent;
                                border: 1px solid $color-primary;
                               
                                .theme--light.v-icon {
                                    color: $color-primary !important;
                                }
                                &:hover {
                                    background-color: rgba($color-primary,0.1);
                                }
                            }
                        }
                        &.save {
                           background-color: #006AA6;
                           &:hover {
                                background-color: lighten($color: #006AA6, $amount: 3);
                            }
                        }
                        &.delete {
                            background-color: #A60017;
                            &:hover {
                                background-color: lighten($color: rgba(#A60017,0.9), $amount: 3);
                            }
                        }
                        &.only-icon {
                            background-color: transparent;
                            border: none;
                            .theme--light.v-icon {
                                color: $color-primary;
                                font-size: 1.2rem;
                                font-weight: bold;
                            }
                        }
                    }
                }
            }
            .content {
                padding: 12px;
                padding-bottom: 8px;
                .v-card__text {
                    padding: 8px;
                    padding-left: 4px !important;
                }
                .row.item-row {
                    margin-bottom: 8px;
                    
                    & > .col-12 {
                        // padding: 0 8px;
                        padding: 0;
                        & > span {
                            display: flex;
                            align-items: center;
                        }
                        .v-input {
                            // margin: 0 8px;
                        }
                        
                    }
                    & > .col-6 {
                        padding: 0;
                    }
                    & > .col-md-7 {
                        padding: 0;
                    }
                    & > .col-md-5 {
                        padding: 0 16px;
                    }
                    &.item {
                        // display: flex;
                        // flex-direction: column;
                        & >.col-12 {
                            padding: 0;
                        }
                        & > .col-md-6 {
                        padding: 0 4px;
                        padding-right: 16px;
                    }
                    }
                    &.water {
                        padding-right: 4px;
                        & >.col-12 {
                            padding-left: 0;
                            // padding-right: 4px;
                            
                        }
                    }
                    
                }

                .btn-icon {
                    border-radius: 50%;
                    & .v-icon {
                        color: #fff !important;
                    }
                }
                .alertOpen {
                    .v-icon.v-icon {
                        color: $color-primary;
                    }
                } 
                .theme--light.v-expansion-panels .v-expansion-panel {
                    background-color: transparent;
                }
                .theme--light.v-expansion-panels .v-expansion-panel-header {
                    background-color: #BFD9E8;
                    font-weight: bold;
                    padding: 12px 8px !important;
                    .v-expansion-panel-header__icon .v-icon {
                        color: #00273E;
                    }
                }
                .v-expansion-panel::before,.v-sheet.v-card:not(.v-sheet--outlined) {
                    box-shadow: none;
                }
                .v-text-field--filled.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot {
                    min-height: 0;
                }
                .table-content {
                    height: 49vh;
                    overflow-y: scroll;
                    overflow-x: hidden;
                }
            }
        }
        .v-card.result-card.ai-suggestion {
            background-color: #E0F2F1;
            .theme--light.v-card {
                background-color: #E0F2F1;
            }
            .content {
                .theme--light.v-expansion-panels .v-expansion-panel-header {
                    background-color: #B2DFDB;
                }
                .theme--light.v-data-table {
                    background-color: transparent;
                }
                .theme--light.v-data-table.v-data-table--fixed-header thead th {
                    background: #E0F2F1;
                    font-size: 14px;
                }
                .v-expansion-panel-header {
                    border-radius: 4px 4px 0 0;
                }
                .theme--light.v-expansion-panels .v-expansion-panel:not(:first-child)::after {
                    border: none;
                }
                .v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
                    font-size: 16px;
                }
                .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
                    background: transparent;
                }
                .suggestion-text {
                    color: #A60017;
                    font-weight: bold;
                }
                
            }
        }
        .fixed-btn {
            position: fixed;
            bottom: 40px;
            right: 16px;
            z-index: 1000;
            .btn-primary {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                box-shadow: 0 0 20px rgba(0,0,0,0.2) !important;
                margin: 0;
                .v-icon.v-icon {
                    color: #fff !important;
                    font-size: 1.5rem;
                }
            }
            .to-self {
                display: flex;
                flex-direction: column;
                width: 120px;
                align-items: flex-end;
                .btn-primary.btn-to {
                    border-radius: 4px 4px 0 0 !important;
                    // background-color: #BFD9E8;
                    &.to-ai {
                        border-radius: 0 0 4px 4px !important;
                        background-color: #2fba95 !important;
                    }
                }
            }
        }
        
    }
    
}
::v-deep {
  .search {
    // locateSelect
    .font-size-large {
      font-size: 16px;
    }
    .vue-treeselect__menu {
        max-height: 200px !important;
    }
    .vue-treeselect__control,.vue-treeselect--searchable .vue-treeselect__input-container,.vue-treeselect__placeholder {
      padding-left: 0;
      padding-right: 0;
    }
    .vue-treeselect__control {
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #6c9bcd;
      .vue-treeselect__placeholder {
        color: #00273E;
        padding: 0 4px;
        &::before {
          content: '*'
        }
        &::after {
          content: '(必選)';
        }
      }
      .vue-treeselect__control-arrow, .vue-treeselect__option-arrow,.vue-treeselect__x-container {
        color: #6c9bcd;
      }
      .vue-treeselect__x-container {
        display: none;
      }
    }
    .vue-treeselect:not(.vue-treeselect--disabled):not(.vue-treeselect--focused) .vue-treeselect__control:hover {
      border-color: #6c9bcd;
    }
    .vue-treeselect--searchable .vue-treeselect__input-container,.vue-treeselect__input,.vue-treeselect--focused {
      font-size: 14px;
      color: #00273E;
    }
    // param select
    .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
        box-shadow: none;
        border: 1px solid #6c9bcd;
    }
    .theme--light.v-icon {
        color: #6c9bcd;
    }
    .theme--light.v-label {
        color: #00273E;
    }
    .v-autocomplete.v-select.v-input--is-focused input {
        min-width: 0;
    }
  }
  .result {
    .v-card.result-card {
        .content {
            .v-expansion-panel-content__wrap {
                padding: 0 0 16px;
            }
            .v-input__prepend-outer {
                width: 100% !important;
                span {
                    display: flex;
                    align-items: center;
                    button.v-icon {
                        margin-right: 4px;
                    }
                }
            }
            .v-text-field--filled.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot {
                min-height: 0;
            }
            .theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
                background-color: transparent;
            }
            .v-text-field.v-input--dense:not(.v-text-field--outlined) input {
                padding: 0px 4px 2px;
            }
            .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--single-line .v-input__prepend-outer,
            .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--single-line .v-input__append-inner {
                margin-top: 4px;
            }
            .v-text-field {
                display: flex;
                align-items: center;
            }
            .v-text-field .v-input__append-inner {
                font-size: 14px;
            }
            // 累計+按鈕
            .v-text-field.sum-field {
                display: flex;
                align-items: center;
            }   
            .v-text-field.sum-field .v-input__control {
                // margin-left: 32px;   
                
            }
            .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
                padding: 0 4px;
            }
            .v-icon.v-icon.v-icon--link.mdi-plus {
                width: 20px;
                height: 20px;
                font-size: 14px;
                background-color: #006AA6;
                border-radius: 50%;
                color: #fff;
                margin-top: 2px;
            }
            // .v-input__prepend-outer span button.v-icon.mdi-plus {
            //     width: 24px;
            //     height: 24px;
            //     background-color: #006AA6;
            //     color: #fff;
            //     border-radius: 50%;
            //     font-size: 1rem;
            // }
            // .v-btn--fab.v-size--x-small {
            //     width: 24px;
            //     height: 24px;
            // }
            // .v-btn--is-elevated.v-btn--fab {
            //     box-shadow: none;
            // }
            .v-badge__badge {
                height: 14px;
                min-width: 14px;
            }
            .date-time-picker {
                display: flex;
                align-items: center;
                // margin: 0 8px;
                & > span {
                    flex: 1;
                }
            }
            .ant-calendar-picker {
                // padding: 0 20px;
            }
            .ant-calendar-picker-input.ant-input {
                border: none;
                background-color: transparent;
                border-bottom: 1px solid rgba(0,0,0,0.42);
                border-radius: 0;
                // margin-left: 20px;
                // margin-right: 4px;
                color: rgba(0,0,0,0.87);
                padding: 4px;
            }
            .ant-calendar-picker:hover {
                border-color: $color-form;
            } 
            .ant-calendar-picker-clear {
                background: $color-lighten;
            }
            .ant-calendar-picker-icon {
                display: none;
            }
            // .theme--light.v-data-table {
            //     background-color: transparent;
            //     &.v-data-table--fixed-header thead th {
            //         background-color: transparent;
            //     }
            // }
            .v-data-table--fixed-header > .v-data-table__wrapper {
                border-radius: 4px;
                overflow-x: hidden;
            }
        }
    }
    .v-card.result-card.ai-suggestion {
        .content {
            .v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
                font-size: 16px;
            }
            .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row), .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row) {
                border: none;
            }
            .v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > tbody > tr > th, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > th, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
                padding: 0;
            }
            #aiwater,#ainet {
                .v-data-table > .v-data-table__wrapper > table > tbody > tr {
                    // border-bottom: 1px solid rgba(0,0,0,0.1);
                    box-shadow: 0 0.5px 0 rgba(0,0,0,0.1);
                }
            }
            // disable
            .theme--light.v-text-field.v-input--is-disabled .v-input__slot::before {
                border-image: none;
                border-color: rgba(0,0,0,0.1);
            }
            .theme--light.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea {
                color: #00273E;
            }
        }
    }
  }
  // dialog
  .v-dialog {
    .v-sheet.v-card {
      border-radius: 4px 0 0 4px;
    }
    .v-card__title.add-title {
      color: $color-dark;
      font-weight: bold;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      font-size: 1.1rem;
    }
    .card-title {
      display: flex;
      align-items: center;
      padding: 0;
      margin: 12px 16px;
      .title {
        width: 100%;
        .v-card__title {
          font-size: 1rem;
          padding: 0;
          font-weight: bold;
          color: $color-dark;
        }
      }
      .chevron {
        .v-icon {
          color: $color-dark;
        }
      }
    }
    
    .v-card__title + .v-card__text {
      padding-bottom: 0;
      padding-top: 0;
    }
    .v-card__text {
      padding-top: 0;
      padding-bottom: 0;
    }
    .dialog-text {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        padding: 8px 16px;
        border-bottom:1px solid rgba(0,0,0,0.1);
        font-size: 16px;
        span {
            font-size: 14px;
            margin-top: 8px;
            min-height: 40px;
        }
    }
    .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
      padding: 0;
    }
    .btn-groups {
        display: flex;
        align-items: center;
        padding-bottom: 4px;
        margin-left: 8px;
        .v-icon.v-icon {
            font-size: 1.25rem;
        }
        .theme--light.v-icon {
            color: #006AA6;
        }
        .theme--light.v-icon.mdi-format-color-text {
            padding-top: 6px;
            font-size: 1.35rem;
        }
        
    }
  }
}
.v-expansion-panel-content>>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
.circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: $color-accent;
    position: relative;
    margin-right: 4px;
    span {
        color: #fff !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        font-size: 12px;
    }
}
#params,#ai {
    padding-top: 4px;
    padding-right: 8px;
    padding-left: 0;
}
#ai {
    padding-right: 12px;
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
    background-color: $color-dark-50;
}
@media (max-width:960px) {
    .v-application.v-application--is-ltr {
        .v-card.kb {
            .card-title,.content,.v-card.result-card .card-title,.v-card.result-card .content {
                padding: 4px 8px;
            }
            .content .search > .row {
                margin-left: -4px;
                margin-right: 0;
            }
            .v-card.result-card .content {
                .v-card__text {
                    padding-bottom: 0px !important;
                }
            }
            
            // .v-card.result-card {
            //     .content {
            //         .table-content {
            //             height: inherit !important;
            //             overflow-y: inherit !important;
            //         }
            //     }
            // }
        }
    }
    // #params,#ai {
    //     padding-top: 4px;
    //     padding-right: 0;
    // }
}
@media (max-width:425px) {
    .v-application.v-application--is-ltr {
        .v-card.kb {
            .v-card.result-card {
                &.column {
                    .card-title {
                        flex-direction: column; 
                        .btn-groups {
                            justify-content: flex-start;
                        }
                        .title {
                            border-bottom: none;
                        }
                    }
                }

            }
            
        }
    }
}

</style>