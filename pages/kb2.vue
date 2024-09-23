<template>
    <div>
        <v-card class="kb bg-card" :style="{'minHeight':`${windowHeight>880?'90vh':'86vh'}`}">
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
                <div class="search" id="dashboard">
                    <v-row class="my-0" :style="{'height':`${windowWidth<959.58?'260px':'initial'}`,
                            'overflowY':`${windowWidth<959.58?'scroll':'initial'}`,
                            'overflowX':`${windowWidth<959.58?'hidden':'initial'}`,
                            'display':`${windowWidth<959.58?'initial':'flex'}`}">
                        <!-- 選擇池 -->
                        <v-col cols="12" md="2" sm="12" :style="{'padding':`${windowWidth>959.58?'12px':'4px 12px'}`,
                                    'marginTop':`${windowWidth>959.58?'0':'-16px'}`}">
                            <locate-select :dataScope="'pool'" class="select-template" defaultSelect="" :isMulti="false"
                                @scopeSel_data="get_scopeData($event)"></locate-select>
                        </v-col>
                        <!-- 限技術部顯示元件 -->
                        <v-col cols="12" md="2" sm="12"
                            v-if="userData.length>0 && userData.filter(x=>x.username == $auth.$state.user.email)[0].department.filter(y=>y=='技術部').length>0">
                            <v-autocomplete v-model="nowUser" :items="userData" item-value="username" clearable dense
                                filled hide-details solo class="mt-1" @change="getUserQueryData()"
                                :filter="customFilter">
                                <!-- item-text="account_name" -->
                                <template slot="item" slot-scope="data">{{data.item.account_name}}({{
                                    data.item.username.match(/(.*)@/)[1] }})</template>
                                <template slot="selection" slot-scope="data">{{data.item.account_name}}</template>
                            </v-autocomplete>
                        </v-col>
                        <!-- 同部門 -->
                        <v-col v-else cols="12" md="2" sm="12">
                            <v-autocomplete v-model="nowUser" :items="nowUserData" item-value="username" clearable dense
                                filled hide-details solo class="mt-1" @change="getUserQueryData()"
                                :filter="customFilter">
                                <!-- item-text="account_name" -->
                                <template slot="item" slot-scope="data">{{data.item.account_name}}({{
                                    data.item.username.match(/(.*)@/)[1] }})</template>
                                <template slot="selection" slot-scope="data">{{data.item.account_name}}</template>
                            </v-autocomplete>
                        </v-col>
                        <!-- 選擇參數 -->
                        <v-col cols="12" md="2" sm="12" :style="{'padding':`${windowWidth>959.58?'12px':'4px 12px'}`}">
                            <v-autocomplete :label="(this.$auth.$state.user == null) ? '歷史紀錄(需登入)' : '歷史紀錄'"
                                v-model="querrySelected" :items="nowSelectDataLst" item-value="created_time" dense
                                filled hide-details clearable solo class="mt-1"
                                :disabled="this.$auth.$state.user == null || nowSelectPool==''||isParaLoading"
                                @change="getSelectData($event)"
                                :loading="isParaLoading"
                                :color="isParaLoading?'red':'primary'">
                                <!-- <template slot="item" slot-scope="data">({{data.item.id}})-{{ (data.item.input_data.BaseParm.InspectedDate)?data.item.input_data.BaseParm.InspectedDate.substring(5,10).replace('-','/') :'' }}-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                                <template slot="selection" slot-scope="data">({{data.item.id}})-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template> -->
                                <template slot="item" slot-scope="data">({{data.item.id}})-{{
                                    (data.item.input_data.BaseParm.InspectedDate)?data.item.input_data.BaseParm.InspectedDate.substring(5,10).replace('-','/')
                                    :'' }}-{{ data.item.input_data.BaseParm.InspectedTime }}</template>
                                <template slot="selection" slot-scope="data">({{data.item.id}})-{{
                                    (data.item.input_data.BaseParm.InspectedDate)?data.item.input_data.BaseParm.InspectedDate.substring(5,10).replace('-','/')
                                    :'' }}-{{ data.item.input_data.BaseParm.InspectedTime }}</template>

                                <!-- <template slot="append">
                                    <v-icon :disabled="!this.querrySelectedLst['1']" color="red" @click="delQuerry('1')" title="刪除">mdi-delete</v-icon>
                                    <v-icon :disabled="!this.querrySelectedLst['1']" color="green" @click="patchQuerry('1')" title="覆蓋">mdi-pen</v-icon>
                                </template> -->
                            </v-autocomplete>
                        </v-col>
                        <!-- 查詢/清空/控制項 - result版面收合 -->
                        <!-- v-if="userData.length>0 && userData.filter(x=>x.username == $auth.$state.user.email)[0].department.filter(y=>y=='技術部').length>0" -->
                        <v-col
                            cols="12" md="6" sm="12" :style="{'padding':`${windowWidth>959.58?'12px':'4px 12px'}`}"
                            class="flex-center-between">
                            <div class="btn-groups">
                                <!-- <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <button
                                            class="btn-primary v-btn v-btn--is-elevated v-btn--has-bg v-btn--tile theme--light v-size--default"
                                            @click="importBasicData();" v-bind="attrs" v-on="on">
                                            帶入資料
                                        </button>
                                    </template>
                                    <span>帶入養殖池的基本資料</span>
                                </v-tooltip> -->
                                <v-btn tile class="btn-secondary delete" @click="resetParm();getSelectData(null)">
                                    清空
                                </v-btn>
                            </div>
                            <!-- 控制項 - result版面收合 -->
                            <div class="control">
                                <v-btn class="btn-icon"><v-icon @click="dialog.pdf=true" title="公式">mdi-square-root</v-icon></v-btn>
                                <v-btn class="btn-icon just-icon" v-if="!nowExpand" title="展開" @click="expandPanel(true)"><v-icon>mdi-view-dashboard</v-icon></v-btn>
                                <v-btn class="btn-icon just-icon" v-if="nowExpand" @click="expandPanel(false)" title="收縮"><v-icon>mdi-view-stream</v-icon></v-btn>
                            </div>
                            <v-dialog v-model="dialog.pdf" scrollable max-width="75%" width="75%">
                                <v-card>
                                    <v-card-title class="add-title" style="display: flex;width: 100%;">
                                        <div class="flex-align-center" style="width: calc(100% - 40px);">
                                            <span><a :href="url.xls" target="_blank">計算公式</a></span>
                                            <v-switch v-model="formulaData" :label="formulaData?'pdf':'xls'"></v-switch>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <a :href="formulaUrl" target="_blank" v-bind="attrs" v-on="on" style="margin-left: 16px;"><v-icon>mdi-link</v-icon></a>
                                                </template>
                                                <span>在新分頁中開啟</span>
                                            </v-tooltip>
                                            
                                        </div>
                                        <div class="add" style="float: right;">
                                            <v-btn class="btn-secondary close" title="取消" @click="dialog.pdf = false;"
                                                style="border: none;min-width: 0;padding: 0 4px;">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                        </div>
                                    </v-card-title>
                                    <!-- <v-card-title>計算公式
                                        <v-switch
                                            v-model="formulaData"
                                            :label="formulaData?'pdf':'xls'"
                                            ></v-switch>
                                    </v-card-title> -->
                                    <v-card-text style="height: 600px;">
                                        <v-responsive>
                                            <iframe :src="formulaUrl"
                                                style="overflow:hidden;height:600px;width:100%;"></iframe>
                                        </v-responsive>
                                    </v-card-text>
                                    <!-- <v-card-actions>
                                        <v-btn>Close</v-btn>
                                    </v-card-actions> -->
                                </v-card>
                            </v-dialog>
                        </v-col>
                        <!-- 查詢/清空/控制項 - result版面收合 -->
                        <!-- <v-col v-else cols="12" md="8" sm="12"
                            :style="{'padding':`${windowWidth>959.58?'12px':'4px 12px'}`}"
                            class="flex-center-between">
                            <div class="btn-groups">
                                <v-btn tile class="btn-secondary delete" @click="resetParm();getSelectData(null)">
                                    清空
                                </v-btn>
                            </div>
                            <div class="control">
                                <v-icon @click="dialog.pdf=true" title="公式">mdi-square-root-box</v-icon>
                                <v-icon v-if="!nowExpand" @click="expandPanel(true)"
                                    title="展開">mdi-view-dashboard</v-icon>
                                <v-icon v-if="nowExpand" @click="expandPanel(false)" title="收縮">mdi-view-stream</v-icon>
                            </div>
                            <v-dialog v-model="dialog.pdf" scrollable max-width="75%" width="75%">
                                <v-card>
                                    <v-card-title class="add-title" style="display: flex;width: 100%;">
                                        <div class="flex-align-center" style="width: calc(100% - 40px);">
                                            <span><a :href="url.xls" target="_blank">計算公式</a></span>
                                            <v-switch v-model="formulaData" :label="formulaData?'pdf':'xls'"></v-switch>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <a :href="formulaUrl" target="_blank" v-bind="attrs" v-on="on" style="margin-left: 16px;"><v-icon>mdi-link</v-icon></a>
                                                </template>
                                                <span>在新分頁中開啟</span>
                                            </v-tooltip>
                                            
                                        </div>
                                        <div class="add" style="float: right;">
                                            <v-btn class="btn-secondary close" title="取消" @click="dialog.pdf = false;"
                                                style="border: none;min-width: 0;padding: 0 4px;">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                        </div>
                                    </v-card-title>
                                    <v-card-text style="height: 600px;">
                                        <v-responsive>
                                            <iframe :src="formulaUrl"
                                                style="overflow:hidden;height:600px;width:100%;"></iframe>
                                        </v-responsive>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                        </v-col> -->
                    </v-row>
                </div>
                <div class="result">
                    <v-overlay :value="!isLoading" :absolute="true">
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-overlay>
                    <div class="result-content" >
                        <v-card class="result-card" style="padding-bottom: 12px">
                            <Kb2CardGroups :cardData="cardData2"></Kb2CardGroups>
                            <div class="timeline flex-align-center" style="margin: 0 16px;">
                                <span v-if="!isSearchDate" @click="searchDate" style="cursor: pointer">{{BaseParm['InspectedDate']}} {{BaseParm['InspectedTime']}}</span>
                                <v-row v-else style="margin-bottom: 0;">
                                    <v-col cols=12 md="3" sm="3">
                                        <v-row class="item-row item" style="margin-bottom: 0;">
                                            <v-col cols="12" md="4" sm="4">
                                                <span class="pa-0 ma-0" slot="prepend" :style="{'color':`${BaseParm['InspectedDate']&&BaseParm['InspectedDate']!==''&&BaseParm['InspectedDate']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"><v-icon @click="() => (BaseParm['InspectedDate'] = getNowDate())">mdi-calendar</v-icon>資料日期</span>
                                            </v-col>
                                            <v-col cols="12" md="8" sm="8">
                                                <v-menu v-model="menu_inspecteddate"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y min-width="auto">
                                                    <template
                                                        v-slot:activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="BaseParm['InspectedDate']"
                                                            class="mt-0" clearable
                                                            readonly dense hide-details
                                                            v-bind="attrs"
                                                            v-on="on"
                                                            ></v-text-field>
                                                    </template>
                                                    <v-date-picker
                                                        v-model="BaseParm['InspectedDate']"
                                                        :max="userData.filter(x=>x.username == $auth.$state.user.email)[0].department.filter(y=>y=='技術部').length>0?null:getNowDate()"
                                                        locale="zh-tw" no-title @input="
                                                    menu_inspecteddate = false;
                                                    "></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols=12 md="3" sm="3">
                                        <v-row class="item-row item" style="margin-bottom: 0;">
                                            <v-col cols="12" md="4" sm="4">
                                                <span class="pa-0 ma-0"
                                                    slot="prepend" :style="{'color':`${BaseParm['InspectedTime']&&BaseParm['InspectedTime']!==''&&BaseParm['InspectedTime']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"><v-icon
                                                        @click="() => (BaseParm['InspectedTime'] = getNowTime())">mdi-timeline-clock-outline</v-icon>資料時間</span>
                                            </v-col>
                                            <v-col cols="12" md="8" sm="8">
                                                <v-text-field
                                                    v-model="BaseParm['InspectedTime']"
                                                    value="" dense type="time"
                                                    hide-details></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12" md="3" sm="3">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <button
                                                    class="btn-primary v-btn btn-small"
                                                    @click="importBasicData();isSearchDate=false;" v-bind="attrs" v-on="on">
                                                    帶入
                                                </button>
                                            </template>
                                            <span>帶入養殖池的基本資料</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <button
                                                    class="btn-secondary v-btn btn-small"
                                                    @click="cancelSearchDate()" v-bind="attrs" v-on="on">
                                                    取消
                                                </button>
                                            </template>
                                            <span>取消</span>
                                        </v-tooltip>
                                    </v-col>

                                </v-row>
                                <span v-if="BaseParm['InspectedTime']&&BaseParm['InspectedTime']!==null&&!isSearchDate" @click="isShowResult=!isShowResult" style="margin-left: 16px;color:#006AA6;cursor: pointer;text-decoration:underline;margin-right: 8px;">詳細資訊</span>
                                <v-tooltip v-if="BaseParm['InspectedTime']&&BaseParm['InspectedTime']!==null&&!isSearchDate" bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <button
                                            class="btn-primary v-btn btn-small"
                                            @click="importBasicData();isSearchDate=false;" v-bind="attrs" v-on="on">
                                            帶入
                                        </button>
                                    </template>
                                    <span>帶入養殖池的基本資料</span>
                                </v-tooltip>
                            </div>
                            
                        </v-card>
                    </div>
                </div>
                <!-- 查詢結果 -->
                <div v-if="isShowResult" class="result" style="position: relative;" :style="{'height':`${windowWidth<959.58?'62vh':'initial'}`,
                            'overflowY':`${windowWidth<959.58?'scroll':'initial'}`,
                            'overflowX':`${windowWidth<959.58?'hidden':'initial'}`,
                            'marginTop':`${windowWidth<959.58&&isSearch?'8px':'4px'}`}">
                    <!-- <v-overlay :value="!isLoading" :absolute="true">
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-overlay> -->
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
                                                <button class="btn-icon-secondary" @click="postParm(false)" v-bind="attrs"
                                                    v-on="on">
                                                    <v-icon>mdi-magnify</v-icon>
                                                </button>
                                            </template>
                                            <span>查詢</span>
                                        </v-tooltip>
                                        <v-tooltip bottom
                                            v-if="nowSelectPool!==''&&nowSelectPool!==null&&nowUser==$auth.$state.user.email">
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="btn-icon green" @click="postParm(true)" v-bind="attrs"
                                                    v-on="on">
                                                    <v-icon>mdi-plus</v-icon>
                                                </button>
                                            </template>
                                            <span>新增並查詢</span>
                                        </v-tooltip>
                                        <v-tooltip bottom
                                            v-if="nowSelectPool!==''&&nowSelectPool!==null&&querrySelected!==''&&querrySelected!==null&&isSearch&&nowUser==$auth.$state.user.email">
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="btn-icon" @click="patchQuerry(nowSelectPool)"
                                                    v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-check</v-icon>
                                                </button>
                                            </template>
                                            <span>儲存並查詢</span>
                                        </v-tooltip>
                                        <v-tooltip bottom
                                            v-if="nowSelectPool!==''&&nowSelectPool!==null&&querrySelected!==''&&querrySelected!==null&&isSearch&&nowUser==$auth.$state.user.email">
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="btn-icon delete" @click="delQuerry(nowSelectPool)"
                                                    v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-trash-can</v-icon>
                                                </button>
                                            </template>
                                            <span>刪除</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <button v-if="!settingOpen" class="btn-icon just-icon"
                                                    @click="settingOpen=!settingOpen" v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-bookmark-outline</v-icon>
                                                </button>
                                                <button v-else class="btn-icon just-icon" @click="settingOpen=!settingOpen"
                                                    v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-bookmark</v-icon>
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
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#bacteria')"> 水中菌項資訊
                                            |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#bacteriaDisease')">
                                            傳染病 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#net')"> 觀察網資訊 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#basic')"> 養殖基本數據
                                            |</a>
                                        <!-- <a href="javascript:void(0)" class="tag" @click="goAnchor('#breed')"> 養殖參數 |</a> -->
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#waterperiod')">
                                            做水期參數 |</a>
                                    </v-row>
                                    
                                    <div class="table-content" :style="{'minHeight':`${windowHeight>880?'75vh':'64vh'}`,
                                                'height':`${windowWidth>959.58?'49vh':'100%'}`}">
                                        <!-- <v-row style="margin-bottom: 0;">
                                            <v-col cols=12 md="5" sm="5">
                                                <v-row class="item-row item">
                                                    <v-col cols="12" md="4" sm="4">
                                                        <span class="pa-0 ma-0" slot="prepend" :style="{'color':`${BaseParm['InspectedDate']&&BaseParm['InspectedDate']!==''&&BaseParm['InspectedDate']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"><v-icon @click="() => (BaseParm['InspectedDate'] = getNowDate())">mdi-calendar</v-icon>資料日期</span>
                                                    </v-col>
                                                    <v-col cols="12" md="8" sm="8" class="pb-0">
                                                        <v-menu v-model="menu_inspecteddate"
                                                            :close-on-content-click="false"
                                                            :nudge-right="40"
                                                            transition="scale-transition"
                                                            offset-y min-width="auto">
                                                            <template
                                                                v-slot:activator="{ on, attrs }">
                                                                <v-text-field
                                                                    v-model="BaseParm['InspectedDate']"
                                                                    class="mt-0" clearable
                                                                    readonly dense hide-details
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                    ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="BaseParm['InspectedDate']"
                                                                :max="getNowDate()"
                                                                locale="zh-tw" no-title @input="
                                                            menu_inspecteddate = false;
                                                            "></v-date-picker>
                                                        </v-menu>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col cols=12 md="5" sm="5">
                                                <v-row class="item-row item">
                                                    <v-col cols="12" md="4" sm="4">
                                                        <span class="pa-0 ma-0"
                                                            slot="prepend" :style="{'color':`${BaseParm['InspectedTime']&&BaseParm['InspectedTime']!==''&&BaseParm['InspectedTime']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"><v-icon
                                                                @click="() => (BaseParm['InspectedTime'] = getNowTime())">mdi-timeline-clock-outline</v-icon>資料時間</span>
                                                    </v-col>
                                                    <v-col cols="12" md="8" sm="8">
                                                        <v-text-field
                                                            v-model="BaseParm['InspectedTime']"
                                                            value="" dense type="time"
                                                            hide-details></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col cols="12" md="2" sm="2">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <button
                                                            class="btn-primary v-btn v-btn--is-elevated v-btn--has-bg v-btn--tile theme--light v-size--default"
                                                            @click="importBasicData();" v-bind="attrs" v-on="on">
                                                            帶入
                                                        </button>
                                                    </template>
                                                    <span>帶入養殖池的基本資料</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row> -->

                                        <!-- 飼料參數 -->
                                        <v-expansion-panels id="feed" accordion multiple v-model="panel.panel_row13">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">飼料參數</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-form ref="FeedParm">
                                                                <v-row class="item-row" dense>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend" :style="{'color':`${FeedParm['CrudeProteinPct']&&FeedParm['CrudeProteinPct']!==''&&FeedParm['CrudeProteinPct']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去24小時最後一筆的飼料紀錄中所使用的飼料粗蛋白參數->砂糖量(做水)、尿素、前餐砂糖量、下餐砂糖量">粗蛋白含量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="FeedParm['CrudeProteinPct']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @change="changeCrudeProteinPct"><span
                                                                                        class="pa-0 ma-0"
                                                                                        slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['CrudeProteinPct']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">粗蛋白含量</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col v-if="false" cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0 text-center"
                                                                                    slot="prepend"
                                                                                    :style="{'color':`${FeedParm['Nitrogen']&&FeedParm['Nitrogen']!==''&&FeedParm['Nitrogen']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的飼料紀錄中所使用的飼料含氮量參數">含氮量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="FeedParm['Nitrogen']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['Nitrogen']" dense hide-details class="mt-0 blue lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">含氮量(%)</span></v-text-field> -->
                                                                    </v-col>

                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    :style="{'color':`${FeedParm['SugarSourcePurity']&&FeedParm['SugarSourcePurity']!==''&&FeedParm['SugarSourcePurity']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去24小時最後一筆的飼料紀錄中所使用的砂糖純度參數->砂糖量(降氨氮)、砂糖量(降亞硝酸)、砂糖量(做水)、前餐砂糖量、下餐砂糖量">純度(砂糖-碳源)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="FeedParm['SugarSourcePurity']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['SugarSourcePurity']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖(碳源)純度</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                    </v-col>
                                                                    <!-- <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend" title="過去一天最後一筆的飼料紀錄中所使用的砂糖含碳量參數->砂糖量(降氨氮)、砂糖量(降亞硝酸)、砂糖量(做水)、前餐砂糖量、下餐砂糖量">砂糖(碳源)含碳量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field v-model.number="FeedParm['SugarSourceCarbonPct']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col> -->
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    title="根據粗蛋白含量自動計算cn比，過去一天最後一筆的飼料紀錄中所使用的飼料CN比參數"><a
                                                                                        :style="{'color':`${FeedParm['FeedCN']&&FeedParm['FeedCN']!==''&&FeedParm['FeedCN']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                        href="https://www.tfrin.gov.tw/News_Content.aspx?n=310&s=236373"
                                                                                        target="_blank">飼料CN比</a></span>
                                                                                <!-- <span class="pa-0 ma-0" slot="prepend">飼料CN比(依照飼料)</span> -->
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="FeedParm['FeedCN']"
                                                                                    :key="FeedCNKey" type="number" dense
                                                                                    hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['FeedCN']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">飼料CN比(依照飼料)</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    :style="{'color':`${FeedParm['LastFeedInput']&&FeedParm['LastFeedInput']!==''&&FeedParm['LastFeedInput']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去24小時最後一筆的飼料紀錄中飼料的投餵量->0號料、1號料、2號料、上一餐飼料量">上一餐飼料量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8" class="flex-align-center">
                                                                                <v-text-field
                                                                                    v-model.number="FeedParm['LastFeedInput']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft"
                                                                                    :title="FeedParm['LastFeedInput']&&typeof(FeedParm['LastFeedInput'])=='number'?((FeedParm['LastFeedInput']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                        class="pa-0 ma-0">g</span></a-tooltip>
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
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${FeedParm['LastFeedOfDay']&&FeedParm['LastFeedOfDay']!==''&&FeedParm['LastFeedOfDay']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去24小時所有飼料紀錄中飼料量的總和">24時內總飼料量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8" class="flex-align-center">
                                                                                <v-text-field
                                                                                    v-model.number="FeedParm['LastFeedOfDay']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft"
                                                                                    :title="FeedParm['LastFeedOfDay']&&typeof(FeedParm['LastFeedOfDay'])=='number'?((FeedParm['LastFeedOfDay']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                        class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="FeedParm['LastFeedOfDay']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">當日飼料量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${FeedParm['CumulativeFeedAmountInput']&&FeedParm['CumulativeFeedAmountInput']!==''&&FeedParm['CumulativeFeedAmountInput']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="養殖起始日~資料日期時間內所有飼料量的總和->FCR(換肉率)">累計飼料量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8" class="flex-align-center">

                                                                                <v-text-field
                                                                                    v-model.number="FeedParm['CumulativeFeedAmountInput']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0 sum-field"
                                                                                    append-outer-icon="mdi-plus"
                                                                                    @click:append-outer="addFeedQty()"></v-text-field>
                                                                                <a-tooltip placement="topLeft"
                                                                                    :title="FeedParm['CumulativeFeedAmountInput']&&typeof(FeedParm['CumulativeFeedAmountInput'])=='number'?((FeedParm['CumulativeFeedAmountInput']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                        class="pa-0 ma-0">g</span></a-tooltip>
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
                                                                    <!-- <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item"> 
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend">下餐增料百分比</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-select v-model="BaseParm['NextFeedIncrementPct']" type="number" clearable :items="optData.NextFeedIncrementPct" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col> -->
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                    :style="{'color':`${FeedParm['FeedingPlan']&&FeedParm['FeedingPlan'].length!==0&&FeedParm['FeedingPlan']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend">投餌方案</span>
                                                                                <!-- <span class="pa-0 ma-0" slot="prepend">下一餐飼料增加百分比</span> -->
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-select
                                                                                    v-model="FeedParm['FeedingPlan']"
                                                                                    type="string" chips clearable
                                                                                    :items="optData.FeedingPlan" filled
                                                                                    dense hide-details class="mt-0"
                                                                                    item-value="name_en"
                                                                                    item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                    :style="{'color':`${FeedParm['LastFeedDatetime']&&FeedParm['LastFeedDatetime']!==''&&FeedParm['LastFeedDatetime']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend"
                                                                                    title="過去四天的資料找過去每天的最後一餐投餵資料">過去四天單餐投餌量：</span>
                                                                                <!-- <span class="pa-0 ma-0" slot="prepend">下一餐飼料增加百分比</span> -->
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <span>{{(FeedRecordData.FeedAmountForFourMeals!=undefined)?Object.values(FeedRecordData.FeedAmountForFourMeals).join(','):''}}</span>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row class="item-row" dense>
                                                                    <v-col cols=12 md="12" sm="12">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="2" sm="2">
                                                                                <div class="date-time-picker">
                                                                                    <!-- FeedParm['LastFeedDatetime'] = $moment(new Date(), 'YYYY-MM-DD HH:mm') -->
                                                                                    <v-icon
                                                                                        @click="showDate=false;FeedParm['LastFeedDatetime'] = getNowDateTime();showDate=true">mdi-calendar</v-icon>
                                                                                    <span
                                                                                    :style="{'color':`${FeedParm['LastFeedDatetime']&&FeedParm['LastFeedDatetime']!==''&&FeedParm['LastFeedDatetime']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                        style="font-size: 14px;margin-right: 9px;padding-left: 4px;"
                                                                                        title="過去一天最後一筆的飼料投餵時間->內存量(體重投餌率)、存活率、預計間補日期、0號料">上一餐時間</span>
                                                                                </div>

                                                                            </v-col>
                                                                            <v-col cols="12" md="10" sm="10">
                                                                                <div class="date-time-picker">
                                                                                    <a-date-picker v-if="showDate"
                                                                                        v-model="FeedParm['LastFeedDatetime']"
                                                                                        value="null"
                                                                                        format="yyyy-MM-DD HH:mm"
                                                                                        show-time placeholder=""
                                                                                        @change="onChange" @ok="onOk"
                                                                                        style="min-width: none;width: calc(100% - 9px);margin-left: 4px;margin-right: 16px;" />
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
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">
                                                    <div class="item-title flex-align-center">
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
                                                                <v-row class="item-row item" dense>
                                                                    <v-col cols="12" md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="4" sm="4"
                                                                                style="display: flex;"
                                                                                :style="{'flexDirection':`${windowWidth<1263.98&&windowWidth>959.98?'column':'row'}`,'alignItems':`${windowWidth<1263.98&&windowWidth>959.98?'flex-start':'center'}`}">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    title="過去一天最後一筆的溶氧資料"
                                                                                    :style="{'color':`${WaterQualityData['Do']&&WaterQualityData['Do']!==''&&WaterQualityData['Do']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"><v-badge
                                                                                        title="紅：危險值，橘：警告值，綠：正常值" inline
                                                                                        :color="getColor('Do')"></v-badge>溶氧</span><span
                                                                                    style="font-size: 12px;"
                                                                                    :style="{'paddingLeft':`${windowWidth<1263.98&&windowWidth>959.98?'24px':'0'}`,
                                                                                            'color':`${WaterQualityData['Do']&&WaterQualityData['Do']!==''&&WaterQualityData['Do']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">Do</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="WaterQualityData['Do']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @blur="valueCheck('Do',WaterQualityData['Do'])"><span
                                                                                        slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="4" sm="4" class="flex-align-center"
                                                                                :style="{'flexDirection':`${windowWidth<1263.98&&windowWidth>959.98?'column':'row'}`,'alignItems':`${windowWidth<1263.98&&windowWidth>959.98?'flex-start':'center'}`}">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${WaterQualityData['pH']&&WaterQualityData['pH']!==''&&WaterQualityData['pH']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的酸鹼值資料->熟石灰量"><v-badge
                                                                                        title="紅：危險值，橘：警告值，綠：正常值" inline
                                                                                        :color="getColor('pH')"></v-badge>酸鹼值</span><span
                                                                                    style="font-size: 12px;"
                                                                                    :style="{'paddingLeft':`${windowWidth<1263.98&&windowWidth>959.98?'24px':'0'}`,
                                                                                            'color':`${WaterQualityData['pH']&&WaterQualityData['pH']!==''&&WaterQualityData['pH']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">(pH)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="WaterQualityData['pH']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @blur="valueCheck('pH',WaterQualityData['pH'])"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0" slot="prepend"
                                                                                    :style="{'color':`${WaterQualityData['Temp']&&WaterQualityData['Temp']!==''&&WaterQualityData['Temp']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的水溫資料->粉料、砂糖量(做水)、尿素"><v-badge
                                                                                        title="紅：危險值，橘：警告值，綠：正常值" inline
                                                                                        :color="getColor('Temp')"></v-badge>水溫</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="WaterQualityData['Temp']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @blur="valueCheck('Temp',WaterQualityData['Temp'])"><span
                                                                                        slot="append" :style="{'color':`${WaterQualityData['Temp']&&WaterQualityData['Temp']!==''&&WaterQualityData['Temp']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">°C</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0" slot="prepend"
                                                                                :style="{'color':`${WaterQualityData['LastTemp']&&WaterQualityData['LastTemp']!==''&&WaterQualityData['LastTemp']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="以上一餐時間為基準，往前推24小時最後一筆資料→內存量(體重投餌率)、存活率"><v-badge
                                                                                        title="紅：危險值，橘：警告值，綠：正常值" inline
                                                                                        :color="getColor('LastTemp')"></v-badge>上一餐水溫</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="WaterQualityData['LastTemp']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @blur="valueCheck('LastTemp',WaterQualityData['LastTemp'])"><span
                                                                                        slot="append" :style="{'color':`${WaterQualityData['LastTemp']&&WaterQualityData['LastTemp']!==''&&WaterQualityData['LastTemp']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">°C</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" :style="{'color':`${WaterQualityData['Salinity']&&WaterQualityData['Salinity']!==''&&WaterQualityData['Salinity']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend"
                                                                                        title="循環內最後一筆資料"><v-badge
                                                                                        title="紅：危險值，橘：警告值，綠：正常值" inline
                                                                                        :color="getColor('Salinity')"></v-badge>鹽度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="WaterQualityData['Salinity']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @blur="valueCheck('Salinity',WaterQualityData['Salinity'])"><span
                                                                                        slot="append" :style="{'color':`${WaterQualityData['Salinity']&&WaterQualityData['Salinity']!==''&&WaterQualityData['Salinity']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">ppt</span></v-text-field>
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
                                                                            <v-col cols="12" md="4" sm="4" class="flex-align-center"
                                                                                :style="{'flexDirection':`${windowWidth<1263.98&&windowWidth>959.98?'column':'row'}`,'alignItems':`${windowWidth<1263.98&&windowWidth>959.98?'flex-start':'center'}`}">
                                                                                <span class="pa-0 ma-0" :style="{'color':`${WaterQualityData['Mg']&&WaterQualityData['Mg']!==''&&WaterQualityData['Mg']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend"><v-badge
                                                                                        title="紅：危險值，橘：警告值，綠：正常值" inline
                                                                                        :color="getColor('Mg')"></v-badge>鎂離子</span><span
                                                                                    style="font-size: 12px;"
                                                                                    :style="{'paddingLeft':`${windowWidth<1263.98&&windowWidth>959.98?'24px':'0'}`,
                                                                                            'color':`${WaterQualityData['Mg']&&WaterQualityData['Mg']!==''&&WaterQualityData['Mg']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">Mg<sub>2</sub>+</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="WaterQualityData['Mg']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @blur="valueCheck('Mg',WaterQualityData['Mg'])"><span
                                                                                        slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="4" sm="4" class="flex-align-center"
                                                                                :style="{'flexDirection':`${windowWidth<1263.98&&windowWidth>959.98?'column':'row'}`,'alignItems':`${windowWidth<1263.98&&windowWidth>959.98?'flex-start':'center'}`}">
                                                                                <span class="pa-0 ma-0" :style="{'color':`${WaterQualityData['Ca']&&WaterQualityData['Ca']!==''&&WaterQualityData['Ca']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend"><v-badge
                                                                                        title="紅：危險值，橘：警告值，綠：正常值" inline
                                                                                        :color="getColor('Ca')"></v-badge>鈣離子</span><span
                                                                                    style="font-size: 12px;"
                                                                                    :style="{'paddingLeft':`${windowWidth<1263.98&&windowWidth>959.98?'24px':'0'}`,
                                                                                            'color':`${WaterQualityData['Ca']&&WaterQualityData['Ca']!==''&&WaterQualityData['Ca']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">Ca<sub>2</sub>+</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="WaterQualityData['Ca']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @blur="valueCheck('Ca',WaterQualityData['Ca'])"><span
                                                                                        slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="4" sm="4" class="flex-align-center"
                                                                                :style="{'flexDirection':`${windowWidth<1263.98&&windowWidth>959.98?'column':'row'}`,'alignItems':`${windowWidth<1263.98&&windowWidth>959.98?'flex-start':'center'}`}">
                                                                                <span class="pa-0 ma-0" :style="{'color':`${WaterQualityData['Alk']&&WaterQualityData['Alk']!==''&&WaterQualityData['Alk']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend"><v-badge
                                                                                        title="紅：危險值，橘：警告值，綠：正常值" inline
                                                                                        :color="getColor('Alk')"></v-badge>鹼度</span><span
                                                                                    style="font-size: 12px;"
                                                                                    :style="{'paddingLeft':`${windowWidth<1263.98&&windowWidth>959.98?'24px':'0'}`,
                                                                                            'color':`${WaterQualityData['Alk']&&WaterQualityData['Alk']!==''&&WaterQualityData['Alk']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">Alk</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="WaterQualityData['Alk']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @blur="valueCheck('Alk',WaterQualityData['Alk'])"><span
                                                                                        slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="4" sm="4" class="flex-align-center"
                                                                                :style="{'flexDirection':`${windowWidth<1263.98&&windowWidth>959.98?'column':'row'}`,'alignItems':`${windowWidth<1263.98&&windowWidth>959.98?'flex-start':'center'}`}">
                                                                                <span class="pa-0 ma-0" slot="prepend" :style="{'color':`${WaterQualityData['AmmoniaN']&&WaterQualityData['AmmoniaN']!==''&&WaterQualityData['AmmoniaN']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的氨氮資料->砂糖量(降氨氮)">氨氮</span><span
                                                                                    style="font-size: 12px;" :style="{'color':`${WaterQualityData['AmmoniaN']&&WaterQualityData['AmmoniaN']!==''&&WaterQualityData['AmmoniaN']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">NH<sub>3</sub>/NH<sub>4</sub>+</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="WaterQualityData['AmmoniaN']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @blur="valueCheck('AmmoniaN',WaterQualityData['AmmoniaN'])"><span
                                                                                        slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="4" sm="4" class="flex-align-center"
                                                                                :style="{'flexDirection':`${windowWidth<1263.98&&windowWidth>959.98?'column':'row'}`,'alignItems':`${windowWidth<1263.98&&windowWidth>959.98?'flex-start':'center'}`}">
                                                                                <span class="pa-0 ma-0" slot="prepend" :style="{'color':`${WaterQualityData['NO2']&&WaterQualityData['NO2']!==''&&WaterQualityData['NO2']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的亞硝酸鹽資料">亞硝酸鹽</span><span
                                                                                    style="font-size: 12px;" :style="{'color':`${WaterQualityData['NO2']&&WaterQualityData['NO2']!==''&&WaterQualityData['NO2']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">NO<sub>2</sub>-</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="WaterQualityData['NO2']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"
                                                                                    @blur="valueCheck('NO2',WaterQualityData['NO2'])"><span
                                                                                        slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row water">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                    slot="prepend"
                                                                                    :style="{'color':`${WaterQualityData['WaterColor']&&WaterQualityData['WaterColor'].length!==0&&WaterQualityData['WaterColor']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">水的顏色</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-select
                                                                                    v-model="WaterQualityData['WaterColor']"
                                                                                    clearable
                                                                                    :items="optData.WaterColor" filled
                                                                                    dense hide-details class="mt-0"
                                                                                    item-value="name_en"
                                                                                    item-text="name_ch"></v-select>
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
                                        <v-expansion-panels id="bacteria" accordion multiple
                                            v-model="panel.panel_row23">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">水中菌相資訊</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-form ref="BacteriaData">
                                                                <v-row class="item-row" dense>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                    slot="prepend"
                                                                                    :style="{'color':`${BacteriaData['Biofloc']&&BacteriaData['Biofloc']!==''&&BacteriaData['Biofloc']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">生物絮團</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BacteriaData['Biofloc']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">ml</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['Biofloc']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">生物絮團</span><span class="pa-0 ma-0" slot="append">ml</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    title="過去一天最後一筆的總菌數(total_plate_count)"
                                                                                    :style="{'color':`${BacteriaData['TotalPlateCount']&&BacteriaData['TotalPlateCount']!==''&&BacteriaData['TotalPlateCount']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">總菌</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BacteriaData['TotalPlateCount']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['Biofloc']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">生物絮團</span><span class="pa-0 ma-0" slot="append">ml</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BacteriaData['BacillusSubtilis']&&BacteriaData['BacillusSubtilis']!==''&&BacteriaData['BacillusSubtilis']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的枯草桿菌(bacillus_subtilis)->砂糖量(提高枯草桿菌)">枯草桿菌</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BacteriaData['BacillusSubtilis']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['BacillusSubtilis']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">枯草桿菌</span><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BacteriaData['VibrioAlginolyticus']&&BacteriaData['VibrioAlginolyticus']!==''&&BacteriaData['VibrioAlginolyticus']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的溶藻弧菌(白菌)(vibrio_alginolyticus)">溶藻弧菌(白)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BacteriaData['VibrioAlginolyticus']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['VibrioAlginolyticus']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">溶藻弧菌(白)</span><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BacteriaData['VibrioVulnificus']&&BacteriaData['VibrioVulnificus']!==''&&BacteriaData['VibrioVulnificus']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的創傷弧菌(藍菌)(vibrio_vulnificus)->砂糖量(降靛菌)">創傷弧菌(藍)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BacteriaData['VibrioVulnificus']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['VibrioVulnificus']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">創傷弧菌(藍)</span><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BacteriaData['VibrioEnteritidis']&&BacteriaData['VibrioEnteritidis']!==''&&BacteriaData['VibrioEnteritidis']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的腸炎弧菌(紫菌)(vibrio_enteritidis)->砂糖量(降紫菌)">腸炎弧菌(紫)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BacteriaData['VibrioEnteritidis']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">CFU/mL</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BacteriaData['VibrioEnteritidis']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">腸炎弧菌(紫)</span><span class="pa-0 ma-0" slot="append">CFU/mL</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BacteriaData['VibrioCholerae']&&BacteriaData['VibrioCholerae']!==''&&BacteriaData['VibrioCholerae']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的霍亂弧菌(靛)(vibrio_cholerae)">霍亂弧菌(靛)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BacteriaData['VibrioCholerae']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">CFU/mL</span></v-text-field>
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
                                        <v-expansion-panels id="bacteriaDisease" accordion multiple
                                            v-model="panel.panel_row25">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">傳染病</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <!-- <v-form ref="BacteriaData"> -->
                                                            <v-row class="item-row">
                                                                <v-col cols=12 md="12" sm="12">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="2" sm="2">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                style="padding-left: 4px !important;"
                                                                                :style="{'color':`${bacteriaSelect&&bacteriaSelect.length!==0&&bacteriaSelect!==null?'#00324E':'rgba(0,0,0,0.5)'}`}">疾病感染</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="10" sm="10">
                                                                            <v-select v-model="bacteriaSelect"
                                                                                :items="bacteriaAll"
                                                                                :menu-props="{ maxHeight: '400' }"
                                                                                multiple chips item-value="bacteriaAll"
                                                                                @change="select($event)" filled dense
                                                                                hide-details class="mt-0">

                                                                                <template v-slot:item="{ item }">
                                                                                    <v-icon
                                                                                        v-if="bacteriaSelect.includes(item)"
                                                                                        color="primary" class="mr-3">
                                                                                        mdi-checkbox-marked
                                                                                    </v-icon>
                                                                                    <v-icon v-else class="mr-3">
                                                                                        mdi-checkbox-blank-outline
                                                                                    </v-icon>
                                                                                    {{ item.split('Is')[1] }}
                                                                                </template>
                                                                                <template v-slot:selection="{ item }">
                                                                                    <!-- {{ item.split('Is')[1] }} -->
                                                                                    <v-chip
                                                                                        style="font-size: 12px;margin: 2px;color: #fff;"
                                                                                        color="#408FBC" class="main"
                                                                                        close
                                                                                        @click:close="select(item,true)">
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
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">觀察網資訊</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="mx-0">
                                                            <v-form ref="ObservationData">
                                                                <v-row class="item-row" dense>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${ObservationData['ObservationNum']&&ObservationData['ObservationNum']!==''&&ObservationData['ObservationNum']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去30天最後一筆資料">觀察網隻數</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="ObservationData['ObservationNum']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['DeadShrimpQty']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">死蝦數量</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <!-- <span class="pa-0 ma-0" slot="prepend">是否脫殼</span> -->
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${ObservationData['ShellQty']&&ObservationData['ShellQty']!==''&&ObservationData['ShellQty']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去30天最後一筆資料">脫殼數量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="ObservationData['ShellQty']"
                                                                                    min="0" type="number" dense
                                                                                    class="mt-0 mr-2"
                                                                                    hide-details></v-text-field>
                                                                                <!-- <v-select v-model="ObservationData['IsShell']" clearable :items="optData.IsMoultingPeriod" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select> -->
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-select v-model="ObservationData['IsShell']" clearable :items="optData.IsMoultingPeriod" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">是否脫殼</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    :style="{'color':`${judgeColor('IntestinalColor')?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去30天最後一筆資料">腸線顏色</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <div class="input-chips"
                                                                                    @click="chipsOpen('IntestinalColor')">
                                                                                    <v-chip
                                                                                        v-for="(item,id) in ObservationData.IntestinalColor"
                                                                                        :key="'IntestinalColor'+id"
                                                                                        :class="{'chips-value':item.value>0}">
                                                                                        {{ item.name_ch }}:{{ item.value
                                                                                        }}
                                                                                    </v-chip>
                                                                                </div>
                                                                                <!-- <v-select v-model="ObservationData['IntestinalColor']" clearable :items="optData.IntestinalColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select> -->
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-if="false" v-model="ObservationData['IntestinalColor']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">腸線顏色</span></v-text-field> -->
                                                                        <!-- <v-select v-model="ObservationData['IntestinalColor']" clearable :items="optData.IntestinalColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span  class="pa-0 ma-0" slot="prepend">腸線顏色</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    :style="{'color':`${judgeColor('HepatopancreasColor')?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去30天最後一筆資料">肝胰臟顏色</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <div class="input-chips"
                                                                                    @click="chipsOpen('HepatopancreasColor')">
                                                                                    <v-chip
                                                                                        v-for="(item,id) in ObservationData.HepatopancreasColor"
                                                                                        :key="'HepatopancreasColor'+id"
                                                                                        :class="{'chips-value':item.value>0}">
                                                                                        {{ item.name_ch }}:{{ item.value
                                                                                        }}
                                                                                    </v-chip>
                                                                                </div>
                                                                                <!-- <v-select v-model="ObservationData['HepatopancreasColor']" clearable :items="optData.HepatopancreasColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select> -->
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-if="false" v-model="ObservationData['HepatopancreasColor']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">肝胰臟顏色</span></v-text-field> -->
                                                                        <!-- <v-select v-model="ObservationData['HepatopancreasColor']" clearable :items="optData.HepatopancreasColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">肝胰臟顏色</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    :style="{'color':`${judgeColor('MuscleColor')?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去30天最後一筆資料">肌肉顏色</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <div class="input-chips"
                                                                                    @click="chipsOpen('MuscleColor')">
                                                                                    <v-chip
                                                                                        v-for="(item,id) in ObservationData.MuscleColor"
                                                                                        :key="'MuscleColor'+id"
                                                                                        :class="{'chips-value':item.value>0}">
                                                                                        {{ item.name_ch }}:{{ item.value
                                                                                        }}
                                                                                    </v-chip>
                                                                                </div>
                                                                                <!-- <v-select v-model="ObservationData['MuscleColor']" clearable :items="optData.MuscleColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select> -->
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-if="false" v-model="ObservationData['MuscleColor']" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">肌肉顏色</span></v-text-field> -->
                                                                        <!-- <v-select v-model="ObservationData['MuscleColor']" clearable :items="optData.MuscleColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">肌肉顏色</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    :style="{'color':`${judgeColor('BodyColor')?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去30天最後一筆資料">蝦體顏色</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <div class="input-chips"
                                                                                    @click="chipsOpen('BodyColor')">
                                                                                    <v-chip
                                                                                        v-for="(item,id) in ObservationData.BodyColor"
                                                                                        :key="'BodyColor'+id"
                                                                                        :class="{'chips-value':item.value>0}">
                                                                                        {{ item.name_ch }}:{{ item.value
                                                                                        }}
                                                                                    </v-chip>
                                                                                </div>
                                                                                <!-- <v-select v-model="ObservationData['BodyColor']" clearable :items="optData.BodyColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select> -->
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-select v-model="ObservationData['BodyColor']" clearable :items="optData.BodyColor" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">蝦體顏色</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    :style="{'color':`${judgeColor('BodyShape')?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去30天最後一筆資料">蝦體形狀</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <div class="input-chips"
                                                                                    @click="chipsOpen('BodyShape')">
                                                                                    <v-chip
                                                                                        v-for="(item,id) in ObservationData.BodyShape"
                                                                                        :key="'BodyShape'+id"
                                                                                        :class="{'chips-value':item.value>0}">
                                                                                        {{ item.name_ch }}:{{ item.value
                                                                                        }}
                                                                                    </v-chip>
                                                                                </div>
                                                                                <!-- <v-select v-model="ObservationData['BodyShape']" clearable :items="optData.BodyShape" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"></v-select> -->
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-select v-model="ObservationData['BodyShape']" clearable :items="optData.BodyShape" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">蝦體形狀</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    :style="{'color':`${ObservationData['Leftover']&&ObservationData['Leftover']!==''&&ObservationData['Leftover']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去24小時內最後一筆的飼料殘餘量(feed_surplus)->0號料、1號料、2號料">觀察網殘餌量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8" class="flex-align-center">
                                                                                <v-text-field
                                                                                    v-model.number="ObservationData['Leftover']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft"
                                                                                    :title="ObservationData['Leftover']&&typeof(ObservationData['Leftover'])=='number'?((ObservationData['Leftover']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                        class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['Leftover']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">觀察網殘餌量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${ObservationData['DeadShrimpQty']&&ObservationData['DeadShrimpQty']!==''&&ObservationData['DeadShrimpQty']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去30天最後一筆資料">死蝦數量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="ObservationData['DeadShrimpQty']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['DeadShrimpQty']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">死蝦數量</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col v-if="false" cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    :style="{'color':`${ObservationData['ShrimpLength']&&ObservationData['ShrimpLength']!==''&&ObservationData['ShrimpLength']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去30天最後一筆資料">蝦子長度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="ObservationData['ShrimpLength']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">cm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['ShrimpLength']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">蝦子長度</span><span class="pa-0 ma-0" slot="append">cm</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                    :style="{'color':`${ObservationData['ShrimpWeight']&&ObservationData['ShrimpWeight']!==''&&ObservationData['ShrimpWeight']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去90天最後一筆打樣到的蝦子重量(avg_weight)->ADG(每日增重量)、內存量(體重投餌率)、存活率、預計間補日期、觀察網網上料量、每日體重投餌率、蝦子重量、粉料、0號料、1號料、2號料">蝦子重量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8" class="flex-align-center">
                                                                                <v-text-field
                                                                                    v-model.number="ObservationData['ShrimpWeight']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft"
                                                                                    :title="ObservationData['ShrimpWeight']&&typeof(ObservationData['ShrimpWeight'])=='number'?((ObservationData['ShrimpWeight']/ 1000).toFixed(3)+'kg'):'0kg'"><span
                                                                                        class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['ShrimpWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">蝦子重量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>

                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${ObservationData['LastShrimpWeight']&&ObservationData['LastShrimpWeight']!==''&&ObservationData['LastShrimpWeight']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去90天倒數第二筆打樣到的蝦子重量(avg_weight)->ADG(每日增重量)、內存量(體重投餌率)、存活率、預計間補日期、0號料">上次蝦子重量</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8" class="flex-align-center">
                                                                                <v-text-field
                                                                                    v-model.number="ObservationData['LastShrimpWeight']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft"
                                                                                    :title="ObservationData['LastShrimpWeight']&&typeof(ObservationData['LastShrimpWeight'])=='number'?((ObservationData['LastShrimpWeight']/ 1000).toFixed(3)+'kg'):'0kg'"><span
                                                                                        class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="ObservationData['LastShrimpWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">上次蝦子重量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>

                                                                </v-row>
                                                                <v-row class="item-row" dense>
                                                                    <v-col cols=12 md="12" sm="12">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="2" sm="2">
                                                                                <div class="date-time-picker">
                                                                                    <v-icon
                                                                                        @click="showDate=false;ObservationData['SamplingDatetime'] = getNowDateTime();showDate=true;">mdi-calendar</v-icon>
                                                                                    <span
                                                                                        style="font-size: 14px;margin-right: 9px;padding-left: 4px;"
                                                                                        :style="{'color':`${ObservationData['SamplingDatetime']&&ObservationData['SamplingDatetime']!==''&&ObservationData['SamplingDatetime']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                        title="過去90天最後一筆打樣到的蝦子重量的時間->ADG(每日增重量)、內存量(體重投餌率)、存活率、預計間補日期、0號料">打樣時間</span>
                                                                                </div>

                                                                            </v-col>
                                                                            <v-col cols="12" md="10" sm="10">
                                                                                <div class="date-time-picker">
                                                                                    <a-date-picker
                                                                                        v-model="ObservationData['SamplingDatetime']"
                                                                                        value="null"
                                                                                        format="yyyy-MM-DD HH:mm"
                                                                                        show-time placeholder=""
                                                                                        @change="onChange" @ok="onOk"
                                                                                        style="min-width: none;width: calc(100% - 9px);margin-left: 4px;margin-right: 16px;" />
                                                                                </div>

                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <div class="date-time-picker">
                                                                            <span style="font-size: 16px;margin-right: 9px;">打樣時間</span>
                                                                            <a-date-picker v-model="ObservationData['SamplingDatetime']" value="null" show-time placeholder="" @change="onChange" @ok="onOk" style="min-width: none;width: calc(100% - 9px)" />
                                                                        </div> -->
                                                                    </v-col>

                                                                </v-row>
                                                                <v-row class="item-row" dense>
                                                                    <v-col cols=12 md="12" sm="12">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="2" sm="2">
                                                                                <div class="date-time-picker">
                                                                                    <v-icon
                                                                                        @click="showDate=false;ObservationData['LastSamplingDatetime'] = getNowDateTime();showDate=true;">mdi-calendar</v-icon>
                                                                                    <span
                                                                                        style="font-size: 14px;margin-right: 9px;padding-left: 4px;"
                                                                                        :style="{'color':`${ObservationData['LastSamplingDatetime']&&ObservationData['LastSamplingDatetime']!==''&&ObservationData['LastSamplingDatetime']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                        title="過去90天倒數第二筆打樣到的蝦子重量的時間->ADG(每日增重量)、內存量(體重投餌率)、存活率、預計間補日期、0號料">上次打樣時間</span>
                                                                                </div>
                                                                            </v-col>
                                                                            <v-col cols="12" md="10" sm="10">
                                                                                <div class="date-time-picker">
                                                                                    <a-date-picker
                                                                                        v-model="ObservationData['LastSamplingDatetime']"
                                                                                        value="null"
                                                                                        format="yyyy-MM-DD HH:mm"
                                                                                        show-time placeholder=""
                                                                                        @change="onChange" @ok="onOk"
                                                                                        style="min-width: none;width: calc(100% - 9px);margin-left: 4px;margin-right: 16px;" />
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
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">養殖基本數據</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-form ref="BaseParm">
                                                                <v-row class="item-row" dense>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                :style="{'color':`${BaseParm['InspectedDate']&&BaseParm['InspectedDate']!==''&&BaseParm['InspectedDate']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend">資料日期</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                            v-model="BaseParm['InspectedDate']"
                                                                                            class="mt-0" clearable
                                                                                            readonly dense hide-details disabled></v-text-field>
                                                                                <!-- <v-menu v-model="menu_inspecteddate"
                                                                                    :close-on-content-click="false"
                                                                                    :nudge-right="40"
                                                                                    transition="scale-transition"
                                                                                    offset-y min-width="auto">
                                                                                    <template
                                                                                        v-slot:activator="{ on, attrs }">
                                                                                        <v-text-field
                                                                                            v-model="BaseParm['InspectedDate']"
                                                                                            class="mt-0" clearable
                                                                                            readonly dense hide-details
                                                                                            v-bind="attrs"
                                                                                            v-on="on"></v-text-field>
                                                                                    </template>
                                                                                    <v-date-picker
                                                                                        v-model="BaseParm['InspectedDate']"
                                                                                        :max="getNowDate()"
                                                                                        locale="zh-tw" no-title @input="
                                                                                    menu_inspecteddate = false;
                                                                                    "></v-date-picker>
                                                                                </v-menu> -->
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
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                :style="{'color':`${BaseParm['InspectedTime']&&BaseParm['InspectedTime']!==''&&BaseParm['InspectedTime']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend">資料時間</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model="BaseParm['InspectedTime']"
                                                                                    value="" dense type="time" disabled
                                                                                    hide-details></v-text-field>
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
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                :style="{'color':`${BaseParm['StockedDate']&&BaseParm['StockedDate']!==''&&BaseParm['StockedDate']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend">放苗日</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model="BaseParm['StockedDate']"
                                                                                    class="mt-0" clearable
                                                                                    readonly dense hide-details></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BaseParm['PondBottomArea']&&BaseParm['PondBottomArea']!==''&&BaseParm['PondBottomArea']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="->觀察網網上料量、0號料、1號料、2號料">養殖池底面積</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BaseParm['PondBottomArea']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">m<sup>2</sup></span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BaseParm['PondBottomArea']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">養殖池底面積</span><span class="pa-0 ma-0" slot="append">m2</span></v-text-field> -->
                                                                    </v-col>

                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                :style="{'color':`${BaseParm['StartedDate']&&BaseParm['StartedDate']!==''&&BaseParm['StartedDate']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend">養殖起始日</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-menu v-model="menu_startdate"
                                                                                    :close-on-content-click="false"
                                                                                    :nudge-right="40"
                                                                                    transition="scale-transition"
                                                                                    offset-y min-width="auto">
                                                                                    <template
                                                                                        v-slot:activator="{ on, attrs }">
                                                                                        <v-text-field
                                                                                            v-model="BaseParm['StartedDate']"
                                                                                            class="mt-0" clearable
                                                                                            readonly dense hide-details
                                                                                            v-bind="attrs"
                                                                                            v-on="on"></v-text-field>
                                                                                    </template>
                                                                                    <v-date-picker
                                                                                        v-model="BaseParm['StartedDate']"
                                                                                        locale="zh-tw" no-title @input="
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
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                :style="{'color':`${BaseParm['WaterSource']&&BaseParm['WaterSource'].length>0&&BaseParm['WaterSource']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend">水源</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-select
                                                                                    v-model="BaseParm['WaterSource']"
                                                                                    clearable
                                                                                    :items="optData.WaterSource" filled
                                                                                    dense hide-details class="mt-0"
                                                                                    item-value="name_en"
                                                                                    item-text="name_ch"></v-select>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-select v-model="BaseParm['WaterSource']" clearable :items="optData.WaterSource" filled dense hide-details class="mt-0" item-value="name_en" item-text="name_ch"><span class="pa-0 ma-0" slot="prepend">水源</span></v-select> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                :style="{'color':`${BaseParm['WaterSourceSalinity']&&BaseParm['WaterSourceSalinity']!==''&&BaseParm['WaterSourceSalinity']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend">鹽度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BaseParm['WaterSourceSalinity']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">ppt</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BaseParm['WaterSourceSalinity']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">鹽度</span><span class="pa-0 ma-0" slot="append">ppt</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BaseParm['WaterBody']&&BaseParm['WaterBody']!==''&&BaseParm['WaterBody']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="->存活率、粉料、0號料、砂糖量(降氨氮)、砂糖量(降亞硝酸)、砂糖量(提高枯草桿菌)、砂糖量(降紫菌)、砂糖量(降靛菌)、熟石灰量、砂糖量(做水)、漂白粉(30ppm濃度)、海波、尿素">水體體積</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BaseParm['WaterBody']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">m<sup>3</sup></span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BaseParm['WaterBody']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">水體體積</span><span class="pa-0 ma-0" slot="append">m3</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BaseParm['Density']&&BaseParm['Density']!==''&&BaseParm['Density']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="->存活率、粉料、0號料、砂糖量(做水)、尿素">放養密度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BaseParm['Density']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append"
                                                                                        style="width: 48px;">隻/噸水</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BaseParm['Density']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">放養密度</span><span class="pa-0 ma-0" slot="append" style="width: 56px;">隻/噸水</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BaseParm['Days']&&BaseParm['Days']!==''&&BaseParm['Days']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="養殖循環開始日期~資料日期時間->粉料">養殖天數</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BaseParm['Days']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BaseParm['Days']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">養殖天數</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BreedingParm['CN']&&BreedingParm['CN']!==''&&BreedingParm['CN']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="->前餐砂糖量(配合飼料CN比)、下餐砂糖量(配合飼料CN比)、砂糖量(降氨氮)、砂糖量(降亞硝酸)、砂糖量(做水)">目標CN比</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="BreedingParm['CN']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BreedingParm['CN']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">目標CN比</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${BreedingParm['InitialWeight']&&BreedingParm['InitialWeight']!==''&&BreedingParm['InitialWeight']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="->砂糖量(做水)、尿素">放養初始重量(單隻)</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8" class="flex-align-center">
                                                                                <v-text-field
                                                                                    v-model.number="BreedingParm['InitialWeight']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft"
                                                                                    :title="BreedingParm['InitialWeight']&&typeof(BreedingParm['InitialWeight'])=='number'?((BreedingParm['InitialWeight']/ 1000).toFixed(3)+'kg'):'0kg'"><span
                                                                                        class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BreedingParm['InitialWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">放養初始重量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0"
                                                                                :style="{'color':`${BreedingParm['EstimatedHarvestWeight']&&BreedingParm['EstimatedHarvestWeight']!==''&&BreedingParm['EstimatedHarvestWeight']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    slot="prepend">預估收成個體重</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8" class="flex-align-center">
                                                                                <v-text-field
                                                                                    v-model.number="BreedingParm['EstimatedHarvestWeight']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"></v-text-field>
                                                                                <a-tooltip placement="topLeft"
                                                                                    :title="BreedingParm['EstimatedHarvestWeight']&&typeof(BreedingParm['EstimatedHarvestWeight'])=='number'?((BreedingParm['EstimatedHarvestWeight']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                        class="pa-0 ma-0">g</span></a-tooltip>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="BreedingParm['EstimatedHarvestWeight']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">預估間補個體重</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                    </v-col>
                                                                </v-row>
                                                            </v-form>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 做水期參數 -->
                                        <v-expansion-panels id="waterperiod" accordion multiple
                                            v-model="panel.panel_row14">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">做水期參數</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-form ref="MakeWaterParm">
                                                                <v-row class="item-row" dense>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${MakeWaterParm['UreaEffectiveConcentration']&&MakeWaterParm['UreaEffectiveConcentration']!==''&&MakeWaterParm['UreaEffectiveConcentration']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="成分產編 = '尿素' & 參數英文名稱 = 'effective concentration'->砂糖量(做水)、尿素">尿素有效濃度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="MakeWaterParm['UreaEffectiveConcentration']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="MakeWaterParm['UreaEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">尿素有效濃度</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${MakeWaterParm['BleachingPowderEffectiveConcentration']&&MakeWaterParm['BleachingPowderEffectiveConcentration']!==''&&MakeWaterParm['BleachingPowderEffectiveConcentration']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="成分產編 = '漂白粉' & 參數英文名稱 = 'effective concentration'->漂白粉(30ppm濃度)">漂白粉有效濃度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="MakeWaterParm['BleachingPowderEffectiveConcentration']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">%</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="MakeWaterParm['BleachingPowderEffectiveConcentration']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">漂白粉有效濃度</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${MakeWaterParm['Chlorine']&&MakeWaterParm['Chlorine']!==''&&MakeWaterParm['Chlorine']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="過去一天最後一筆的餘氯資料->海波">水體餘氯</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="MakeWaterParm['Chlorine']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">ppm</span></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                        <!-- <v-text-field v-model.number="MakeWaterParm['Chlorine']" type="number" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">水體餘氯</span><span class="pa-0 ma-0" slot="append">ppm</span></v-text-field> -->
                                                                    </v-col>
                                                                    <v-col cols=12 md="6" sm="6">
                                                                        <v-row class="item-row item">
                                                                            <v-col cols="12" md="4" sm="4">
                                                                                <span class="pa-0 ma-0" slot="prepend"
                                                                                :style="{'color':`${MakeWaterParm['HypoEffectiveConcentration']&&MakeWaterParm['HypoEffectiveConcentration']!==''&&MakeWaterParm['HypoEffectiveConcentration']!==null?'#00324E':'rgba(0,0,0,0.5)'}`}"
                                                                                    title="成分產編 = '硫代硫酸鈉' & 參數英文名稱 = 'effective concentration'->海波">海波有效濃度</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="8" sm="8">
                                                                                <v-text-field
                                                                                    v-model.number="MakeWaterParm['HypoEffectiveConcentration']"
                                                                                    type="number" dense hide-details
                                                                                    class="mt-0"><span class="pa-0 ma-0"
                                                                                        slot="append">%</span></v-text-field>
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
                                    <div class="btn-groups">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <button @click="openRemark" v-bind="attrs" v-on="on"
                                                    :class="{'btn-icon-secondary':inputRemark.DynamicData==''&&inputRemark.WaterQuality==''&&inputRemark.Material==''&&inputRemark.MakeWater==''&&inputRemark.Feed=='',
                                                    'btn-icon':inputRemark.DynamicData!==''||inputRemark.WaterQuality!==''||inputRemark.Material!==''||inputRemark.MakeWater!==''||inputRemark.Feed!==''}">
                                                    <v-icon>mdi-clipboard-edit-outline</v-icon>
                                                </button>
                                            </template>
                                            <span>實際作動紀錄</span>
                                        </v-tooltip>
                                        <v-tooltip bottom
                                            v-if="nowSelectPool!==''&&nowSelectPool!==null&&nowUser==$auth.$state.user.email">
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="btn-icon green" @click="postParm(true)" v-bind="attrs"
                                                    v-on="on">
                                                    <v-icon>mdi-plus</v-icon>
                                                </button>
                                            </template>
                                            <span>新增並查詢</span>
                                        </v-tooltip>
                                        <v-tooltip bottom
                                            v-if="nowSelectPool!==''&&nowSelectPool!==null&&querrySelected!==''&&querrySelected!==null&&isSearch&&nowUser==$auth.$state.user.email">
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="btn-icon" @click="patchQuerry(nowSelectPool)"
                                                    v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-check</v-icon>
                                                </button>
                                            </template>
                                            <span>儲存並查詢</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <button v-if="!aiOpen" class="btn-icon just-icon" @click="aiOpen=!aiOpen"
                                                    v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-bookmark-outline</v-icon>
                                                </button>
                                                <button v-else class="btn-icon just-icon" @click="aiOpen=!aiOpen" v-bind="attrs"
                                                    v-on="on">
                                                    <v-icon>mdi-bookmark</v-icon>
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
                                        <a v-if="windowWidth>959.58" href="javascript:void(0)" class="tag"
                                            @click="goAnchor('#aiwater')"> 警示 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#aifeed')"> 投餌量 |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#aijudge')"> 投料判斷列表
                                            |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#animate')"> 動態數據資訊
                                            |</a>
                                        <a href="javascript:void(0)" class="tag" @click="goAnchor('#aiinput')">
                                            養殖前期做水添加物</a>
                                    </v-row>
                                    <div class="table-content" :style="{'minHeight':`${windowHeight>880?'75vh':'64vh'}`,
                                                'height':`${windowWidth>959.58?'49vh':'100%'}`}">
                                        <!-- 警示(水質+觀察網) -->
                                        <v-expansion-panels accordion multiple
                                            v-model="panel.panel_row30" id="aiwater">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">
                                                    <div  class="flex-align-center">
                                                        <div class="circle"
                                                            v-if="suggData.WaterQuality.length+suggData.Observation.length>0">
                                                            <span>{{
                                                                suggData.WaterQuality.length+suggData.Observation.length
                                                                }}</span>
                                                        </div>
                                                        警示
                                                    </div>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0"
                                                            style="padding-right: 4px !important;">
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
                                                                        <tr v-if="suggData.WaterQuality.length>0"
                                                                            style="background-color:#E6B8BE;font-weight: bold;">
                                                                            <td colspan="3">水質</td>
                                                                        </tr>
                                                                        <!-- <tr v-if="suggData.WaterQuality.length==0" style="box-shadow: none;height: 24px;width:100%;text-align: center;padding: 4px;"><td colspan="3" style="color: #aaa;">暫無資料</td></tr> -->
                                                                        <tr v-for="item in suggData.WaterQuality"
                                                                            :key="'water-'+item.id">
                                                                            <td v-html="setBR(item.status)"></td>
                                                                            <td>
                                                                                <div class="alertOpen flex-center-end"
                                                                                    style="cursor: pointer;"
                                                                                    @click="openDialog('水質',item)">
                                                                                    <v-icon>mdi-dots-vertical-circle-outline</v-icon>
                                                                                </div>
                                                                            </td>
                                                                            <!-- <td>{{ item.factor }}</td>
                                                                            <td>{{ item.result }}</td> -->
                                                                        </tr>
                                                                        <tr v-if="suggData.Observation.length>0"
                                                                            style="background-color:#E6B8BE;font-weight: bold;">
                                                                            <td colspan="3">觀察網</td>
                                                                        </tr>
                                                                        <!-- <tr v-if="suggData.Observation.length==0" style="box-shadow: none;height: 24px;width:100%;text-align: center;padding: 4px;"><td colspan="3" style="color: #aaa;">暫無資料</td></tr> -->
                                                                        <tr v-for="item in suggData.Observation"
                                                                            :key="'Obser-'+item.id">
                                                                            <td v-html="setBR(item.status)"></td>
                                                                            <td>
                                                                                <div class="alertOpen flex-center-end"
                                                                                    style="cursor: pointer;"
                                                                                    @click="openDialog('觀察網',item)">
                                                                                    <v-icon>mdi-dots-vertical-circle-outline</v-icon>
                                                                                </div>
                                                                            </td>
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
                                        <!-- 投餌方案 -->
                                        <v-expansion-panels accordion multiple v-model="panel.panel_row31" id="aifeed">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">投餌方案
                                                    <div style="margin-left: 4px;" title="計算方式">
                                                        <v-btn class="btn-icon" style="border-radius: 4px;"
                                                            @click="panel.panel_row31=!panel.panel_row31;feedDialog=true"><v-icon>mdi-application-cog-outline</v-icon></v-btn>
                                                    </div>
                                                </v-expansion-panel-header>

                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <!-- 養殖多方案 -->
                                                        <v-card-text class="pa-3 mx-0"
                                                            style="padding-right: 4px !important;">
                                                            <!-- <div v-if="suggData.Feed.status!==''" class="suggestion-text">*建議：{{ suggData.Feed.status }}</div> -->
                                                            <v-data-table light :headers="headers"
                                                                :items="suggData.Feed.FeedingPlan"
                                                                no-data-text="查無方案，或請檢查1.資料時間往前推4天內是否有投餵紀錄、2.「資料日期/時間、上一餐飼料量、觀察網殘餌量、蝦子重量、池底面積、養殖方案」是否皆有值"
                                                                hide-default-footer disable-pagination></v-data-table>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 投料建議 -->
                                        <v-expansion-panels accordion multiple v-model="panel.panel_row32" id="aijudge">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">投料建議</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-row class="item-row">
                                                                <v-col cols=12 md="6" sm="6" v-if="false">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="前一餐飼料量、粗蛋白含量、目標CN比、飼料CN比、砂糖純度、砂糖含碳量">前餐砂糖量(配合飼料CN比)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['LastSugarCN']"
                                                                                disabled dense hide-details
                                                                                class="mt-0 "></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['LastSugarCN']&&typeof(suggData.Material['LastSugarCN'])=='number'?((suggData.Material['LastSugarCN']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['LastSugarCN']" disabled dense hide-details class="mt-0 "><span class="pa-0 ma-0" slot="prepend">前餐砂糖量(配合飼料CN比)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6" v-if="false">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="下一餐飼料量、粗蛋白含量、目標CN比、飼料CN比、砂糖純度、砂糖含碳量">下餐砂糖量
                                                                                (配合飼料CN比)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['SugarCN']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['SugarCN']&&typeof(suggData.Material['SugarCN'])=='number'?((suggData.Material['SugarCN']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarCN']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">下餐砂糖量 (配合飼料CN比)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6" v-if="false">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="氨氮、目標CN比、水體體積、砂糖純度、砂糖含碳量">砂糖量
                                                                                (降氨氮)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['SugarAmmoniaN']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['SugarAmmoniaN']&&typeof(suggData.Material['SugarAmmoniaN'])=='number'?((suggData.Material['SugarAmmoniaN']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarAmmoniaN']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降氨氮)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6" v-if="false">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="亞硝酸、目標CN比、水體體積、砂糖純度、砂糖含碳量">砂糖量
                                                                                (降亞硝酸)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['SugarNO2']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['SugarNO2'] && typeof (suggData.Material['SugarNO2']) == 'number' ? ((suggData.Material['SugarNO2'] / 1000).toFixed(2) + 'kg') : '0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarNO2']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降亞硝酸)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6" v-if="false">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="枯草桿菌、水體體積">砂糖量 (提高枯草桿菌)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['SugarBacillusSubtilis']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['SugarBacillusSubtilis'] && typeof (suggData.Material['SugarBacillusSubtilis']) == 'number' ? ((suggData.Material['SugarBacillusSubtilis'] / 1000).toFixed(2) + 'kg') : '0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarBacillusSubtilis']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (提高枯草桿菌)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6" v-if="false">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="腸炎弧菌、水體體積">砂糖量 (降紫菌)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['SugarVibrioEnteritidis']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['SugarVibrioEnteritidis'] && typeof (suggData.Material['SugarVibrioEnteritidis']) == 'number' ? ((suggData.Material['SugarVibrioEnteritidis'] / 1000).toFixed(2) + 'kg') : '0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarVibrioEnteritidis']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降紫菌)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6" v-if="false">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="創傷弧菌、水體體積">砂糖量 (降靛菌)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['SugarVibrioCholerae']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['SugarVibrioCholerae'] && typeof (suggData.Material['SugarVibrioCholerae']) == 'number' ? ((suggData.Material['SugarVibrioCholerae'] / 1000).toFixed(2) + 'kg') : '0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['SugarVibrioCholerae']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降靛菌)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>

                                                                <!-- 單餐砂糖量 -->
                                                                <v-col cols=12>
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0"
                                                                                slot="prepend">單餐砂糖量<v-btn class="ma-0 btn-icon just-icon"
                                                                                    @click="sugerdlg = !sugerdlg">
                                                                                    <v-icon style="font-size: 1.25rem;">mdi-message-text</v-icon>
                                                                                </v-btn>
                                                                            </span>
                                                                            <v-dialog v-model='sugerdlg' width="500">
                                                                                <v-card>
                                                                                    <v-card-title>砂糖量計算</v-card-title>
                                                                                    <v-card-text>
                                                                                        <v-row class="item-row" dense>
                                                                                            <v-col cols=12 md="12"
                                                                                                sm="12">
                                                                                                <v-row
                                                                                                    class="item-row item">
                                                                                                    <v-col cols="12"
                                                                                                        md="6" sm="6">
                                                                                                        <span
                                                                                                            class="pa-0 ma-0"
                                                                                                            slot="prepend">累計砂糖量</span>
                                                                                                    </v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="6" sm="6" class="flex-align-center">
                                                                                                        <v-text-field
                                                                                                            v-model="suggData.Material['CumulativeSugarAmount']"
                                                                                                            disabled
                                                                                                            dense
                                                                                                            hide-details
                                                                                                            class="mt-0"></v-text-field>
                                                                                                        <a-tooltip
                                                                                                            placement="topLeft"
                                                                                                            :title="suggData.Material['CumulativeSugarAmount']&&typeof(suggData.Material['CumulativeSugarAmount'])=='number'?((suggData.Material['CumulativeSugarAmount']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                                                class="pa-0 ma-0">g</span></a-tooltip>
                                                                                                    </v-col>
                                                                                                </v-row>
                                                                                            </v-col>
                                                                                            <v-col cols=12 md="12"
                                                                                                sm="12">
                                                                                                <v-row
                                                                                                    class="item-row item">
                                                                                                    <v-col cols="12"
                                                                                                        md="6" sm="6">
                                                                                                        <span
                                                                                                            class="pa-0 ma-0"
                                                                                                            slot="prepend"
                                                                                                            title="前一餐飼料量、粗蛋白含量、目標CN比、飼料CN比、砂糖純度、砂糖含碳量">前餐砂糖量(配合飼料CN比)</span>
                                                                                                    </v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="6" sm="6" class="flex-align-center">
                                                                                                        <v-text-field
                                                                                                            v-model="suggData.Material['LastSugarCN']"
                                                                                                            disabled
                                                                                                            dense
                                                                                                            hide-details
                                                                                                            class="mt-0 "></v-text-field>
                                                                                                        <a-tooltip
                                                                                                            placement="topLeft"
                                                                                                            :title="suggData.Material['LastSugarCN'] && typeof (suggData.Material['LastSugarCN']) == 'number' ? ((suggData.Material['LastSugarCN'] / 1000).toFixed(2) + 'kg') : '0kg'"><span
                                                                                                                class="pa-0 ma-0">g</span></a-tooltip>
                                                                                                    </v-col>
                                                                                                </v-row>
                                                                                            </v-col>
                                                                                            <v-col cols=12 md="12">
                                                                                                <span>單餐砂糖量</span><span class="ml-5">{{suggData.Material['SugarTotal']}} = </span>
                                                                                            </v-col>
                                                                                            <v-col class="ml-1" cols=12 md="12">
                                                                                                <v-row
                                                                                                    class="item-row item">
                                                                                                    <v-spacer></v-spacer>
                                                                                                    
                                                                                                    <v-col cols="12"
                                                                                                        md="6">
                                                                                                        <span
                                                                                                            class="pa-0 ma-0"
                                                                                                            slot="prepend"
                                                                                                            title="下一餐飼料量、粗蛋白含量、目標CN比、飼料CN比、砂糖純度、砂糖含碳量">下餐砂糖量 
                                                                                                            (配合飼料CN比)</span>
                                                                                                    </v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="3" class="flex-align-center">
                                                                                                        <v-text-field
                                                                                                            v-model="suggData.Material['SugarCN']"
                                                                                                            disabled
                                                                                                            dense
                                                                                                            hide-details
                                                                                                            class="mt-0"></v-text-field>
                                                                                                        <a-tooltip
                                                                                                            placement="topLeft"
                                                                                                            :title="suggData.Material['SugarCN'] && typeof (suggData.Material['SugarCN']) == 'number' ? ((suggData.Material['SugarCN'] / 1000).toFixed(2) + 'kg') : '0kg'"><span
                                                                                                                class="pa-0 ma-0">g</span></a-tooltip>
                                                                                                    </v-col>
                                                                                                </v-row>
                                                                                            </v-col>
                                                                                            <v-col class="ml-1" cols=12 md="12">
                                                                                                <v-row
                                                                                                    class="item-row item">
                                                                                                    <v-spacer></v-spacer>
                                                                                                    <v-col cols="1">+</v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="6">
                                                                                                        <span
                                                                                                            class="pa-0 ma-0"
                                                                                                            slot="prepend"
                                                                                                            title="氨氮、目標CN比、水體體積、砂糖純度、砂糖含碳量，系統自動除3餐">砂糖量(降氨氮)</span>
                                                                                                    </v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="3" class="flex-align-center">
                                                                                                        <v-text-field
                                                                                                            v-model="suggData.Material['SugarAmmoniaN']"
                                                                                                            disabled
                                                                                                            dense
                                                                                                            hide-details
                                                                                                            class="mt-0"></v-text-field>
                                                                                                        <a-tooltip
                                                                                                            placement="topLeft"
                                                                                                            :title="suggData.Material['SugarAmmoniaN'] && typeof (suggData.Material['SugarAmmoniaN']) == 'number' ? ((suggData.Material['SugarAmmoniaN'] / 1000).toFixed(2) + 'kg') : '0kg'"><span
                                                                                                                class="pa-0 ma-0">g</span></a-tooltip>
                                                                                                    </v-col>
                                                                                                </v-row>
                                                                                                <!-- <v-text-field v-model="suggData.Material['SugarAmmoniaN']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降氨氮)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                                            </v-col>
                                                                                            <v-col class="ml-1" cols=12 md="12">
                                                                                                <v-row
                                                                                                    class="item-row item">
                                                                                                    <v-spacer></v-spacer>
                                                                                                    <v-col cols="1">+</v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="6">
                                                                                                        <span
                                                                                                            class="pa-0 ma-0"
                                                                                                            slot="prepend"
                                                                                                            title="亞硝酸、目標CN比、水體體積、砂糖純度、砂糖含碳量、鹽度，系統自動除3餐">砂糖量(降亞硝酸)</span>
                                                                                                    </v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="3" class="flex-align-center">
                                                                                                        <v-text-field
                                                                                                            v-model="suggData.Material['SugarNO2']"
                                                                                                            disabled
                                                                                                            dense
                                                                                                            hide-details
                                                                                                            class="mt-0"></v-text-field>
                                                                                                        <a-tooltip
                                                                                                            placement="topLeft"
                                                                                                            :title="suggData.Material['SugarNO2'] && typeof (suggData.Material['SugarNO2']) == 'number' ? ((suggData.Material['SugarNO2'] / 1000).toFixed(2) + 'kg') : '0kg'"><span
                                                                                                                class="pa-0 ma-0">g</span></a-tooltip>
                                                                                                    </v-col>
                                                                                                </v-row>
                                                                                                <!-- <v-text-field v-model="suggData.Material['SugarNO2']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降亞硝酸)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                                            </v-col>
                                                                                            <v-col class="ml-1" cols=12 md="12">
                                                                                                <v-row
                                                                                                    class="item-row item">
                                                                                                    <v-spacer></v-spacer>
                                                                                                    <v-col cols="1">+</v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="6">
                                                                                                        <span
                                                                                                            class="pa-0 ma-0"
                                                                                                            slot="prepend"
                                                                                                            title="枯草桿菌、水體體積，系統自動除3餐">砂糖量(提高枯草桿菌)</span>
                                                                                                    </v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="3" class="flex-align-center">
                                                                                                        <v-text-field
                                                                                                            v-model="suggData.Material['SugarBacillusSubtilis']"
                                                                                                            disabled
                                                                                                            dense
                                                                                                            hide-details
                                                                                                            class="mt-0"></v-text-field>
                                                                                                        <a-tooltip
                                                                                                            placement="topLeft"
                                                                                                            :title="suggData.Material['SugarBacillusSubtilis']&&typeof(suggData.Material['SugarBacillusSubtilis'])=='number'?((suggData.Material['SugarBacillusSubtilis']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                                                class="pa-0 ma-0">g</span></a-tooltip>
                                                                                                    </v-col>
                                                                                                </v-row>
                                                                                                <!-- <v-text-field v-model="suggData.Material['SugarBacillusSubtilis']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (提高枯草桿菌)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                                            </v-col>
                                                                                            <v-col class="ml-1" cols=12 md="12">
                                                                                                <v-row
                                                                                                    class="item-row item">
                                                                                                    <v-spacer></v-spacer>
                                                                                                    <v-col cols="1">+</v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="6">
                                                                                                        <span
                                                                                                            class="pa-0 ma-0"
                                                                                                            slot="prepend"
                                                                                                            title="腸炎弧菌、水體體積，系統自動除3餐">砂糖量(降紫菌)</span>
                                                                                                    </v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="3" class="flex-align-center">
                                                                                                        <v-text-field
                                                                                                            v-model="suggData.Material['SugarVibrioEnteritidis']"
                                                                                                            disabled
                                                                                                            dense
                                                                                                            hide-details
                                                                                                            class="mt-0"></v-text-field>
                                                                                                        <a-tooltip
                                                                                                            placement="topLeft"
                                                                                                            :title="suggData.Material['SugarVibrioEnteritidis']&&typeof(suggData.Material['SugarVibrioEnteritidis'])=='number'?((suggData.Material['SugarVibrioEnteritidis']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                                                class="pa-0 ma-0">g</span></a-tooltip>
                                                                                                    </v-col>
                                                                                                </v-row>
                                                                                                <!-- <v-text-field v-model="suggData.Material['SugarVibrioEnteritidis']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降紫菌)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                                            </v-col>
                                                                                            <v-col class="ml-1" cols=12 md="12">
                                                                                                <v-row
                                                                                                    class="item-row item">
                                                                                                    <v-spacer></v-spacer>
                                                                                                    <v-col cols="1">+</v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="6">
                                                                                                        <span
                                                                                                            class="pa-0 ma-0"
                                                                                                            slot="prepend"
                                                                                                            title="霍亂弧菌、水體體積，系統自動除3餐">砂糖量(降靛菌)</span>
                                                                                                    </v-col>
                                                                                                    <v-col cols="12"
                                                                                                        md="3" class="flex-align-center">
                                                                                                        <v-text-field
                                                                                                            v-model="suggData.Material['SugarVibrioCholerae']"
                                                                                                            disabled
                                                                                                            dense
                                                                                                            hide-details
                                                                                                            class="mt-0"></v-text-field>
                                                                                                        <a-tooltip
                                                                                                            placement="topLeft"
                                                                                                            :title="suggData.Material['SugarVibrioCholerae']&&typeof(suggData.Material['SugarVibrioCholerae'])=='number'?((suggData.Material['SugarVibrioCholerae']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                                                class="pa-0 ma-0">g</span></a-tooltip>
                                                                                                    </v-col>
                                                                                                </v-row>
                                                                                                <!-- <v-text-field v-model="suggData.Material['SugarVibrioCholerae']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量 (降靛菌)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                                            </v-col>
                                                                                            <v-col cols="12">
                                                                                                <span class="error-text">
                                                                                                    水質砂糖/3餐，因砂糖限人工所以除3
                                                                                                </span>
                                                                                            </v-col>
                                                                                        </v-row>
                                                                                    </v-card-text>
                                                                                    <br/>
                                                                                </v-card>
                                                                            </v-dialog>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6"  class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['SugarTotal']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['SugarTotal']&&typeof(suggData.Material['SugarTotal'])=='number'?((suggData.Material['SugarTotal']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                </v-col>

                                                                <v-col cols=12 md="6" sm="6"  v-if="false">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0"
                                                                                slot="prepend">累計砂糖量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['CumulativeSugarAmount']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['CumulativeSugarAmount']&&typeof(suggData.Material['CumulativeSugarAmount'])=='number'?((suggData.Material['CumulativeSugarAmount']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['CumulativeSugarAmount']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">累計砂糖量</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                        <!-- 石灰 -->
                                                        <v-card-text class="pa-3 mx-0"
                                                            style="padding-top: 0 !important;padding-bottom: 0 !important;">
                                                            <v-row class="item-row">
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item"
                                                                        style="background-color:#E5F2E0;">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="酸鹼值、水體體積">熟石灰量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['Lime']"
                                                                                disabled dense hide-details class="mt-0"
                                                                                style="background-color:#E5F2E0;"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['Lime']&&typeof(suggData.Material['Lime'])=='number'?((suggData.Material['Lime']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['Lime']" disabled dense hide-details class="mt-0" style="background-color:#E5F2E0;"><span class="pa-0 ma-0" slot="prepend">熟石灰量</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item"
                                                                        style="background-color:#E5F2E0;">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0"
                                                                                slot="prepend">累計熟石灰量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['CumulativeLimeAmount']"
                                                                                disabled dense hide-details
                                                                                class="mt-0 "
                                                                                style="background-color:#E5F2E0;"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['CumulativeLimeAmount']&&typeof(suggData.Material['CumulativeLimeAmount'])=='number'?((suggData.Material['CumulativeLimeAmount']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.Material['CumulativeLimeAmount']" disabled dense hide-details class="mt-0 " style="background-color:#E5F2E0;"><span class="pa-0 ma-0" slot="prepend">累計熟石灰量</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                            </v-row>
                                                            <!-- <v-text-field v-model="suggData.Material['Lime']" disabled dense hide-details class="mt-0" style="background-color:#E5F2E0;"><span class="pa-0 ma-0" slot="prepend">熟石灰量(kg)</span></v-text-field>
                                                            <v-text-field v-model="suggData.Material['CumulativeLimeAmount']" disabled dense hide-details class="mt-0 " style="background-color:#E5F2E0;"><span class="pa-0 ma-0" slot="prepend">累計熟石灰量(kg)</span></v-text-field> -->
                                                        </v-card-text>
                                                        <!-- 沒用到先隱藏 -->
                                                        <v-card-text class="pa-3 mx-0" v-if="false">
                                                            <v-row class="item-row">
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0"
                                                                                slot="prepend">累計菌量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.Material['CumulativeBacteriaAmount']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.Material['CumulativeBacteriaAmount']&&typeof(suggData.Material['CumulativeBacteriaAmount'])=='number'?((suggData.Material['CumulativeBacteriaAmount']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <!-- 動態數據資訊 -->
                                        <v-expansion-panels id="animate" accordion multiple v-model="panel.panel_row24">
                                            <v-expansion-panel class="my-1">
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">動態數據資訊</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                        <!-- <v-divider></v-divider> -->
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-row class="item-row" dense>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="累計飼料量、水體體積、放養密度">FCR(換肉率)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <v-text-field
                                                                                v-model="suggData.DynamicData['FCR']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['FCR']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend"  title="累計飼料量、蝦子長度、水體體積、放養密度">FCR(換肉率)</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="蝦子重量、打樣時間、上次蝦子重量、上次打樣時間">ADG(每日增重量)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.DynamicData['ADG']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.DynamicData['ADG']&&typeof(suggData.DynamicData['ADG'])=='number'?((suggData.DynamicData['ADG']/ 1000).toFixed(2)+'kg/day'):'0kg/day'"><span
                                                                                    class="pa-0 ma-0">g/day</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['ADG']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、養殖天數、養殖起始日">ADG(每日增重量)</span><span class="pa-0 ma-0" slot="append">g/day</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="當日飼料量、上一餐時間、上一餐水溫、蝦子重量、打樣時間、上次蝦子重量、上次打樣時間">內存量(體重投餌率)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.DynamicData['Biomass']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.DynamicData['Biomass']&&typeof(suggData.DynamicData['Biomass'])=='number'?((suggData.DynamicData['Biomass']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['Biomass']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算內存量，因為需要每日體重投餌率">內存量(體重投餌率)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="水體體積、放養密度、當日飼料量、上一餐時間、上一餐水溫、蝦子重量、打樣時間、上次蝦子重量、上次打樣時間">存活率</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <v-text-field
                                                                                v-model="suggData.DynamicData['SurvivalRate']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"><span class="pa-0 ma-0"
                                                                                    slot="append">%</span></v-text-field>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['SurvivalRate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算存活率，因為需要內存量">存活率</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0"
                                                                                slot="prepend">預計間補日期</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <v-text-field
                                                                                v-model="suggData.DynamicData['EstimatedCatchingDate']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['EstimatedCatchingDate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="養殖起始日">預計間補日期</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="下一餐飼料量、養殖池底面積、蝦子重量、養殖天數 > 14天">建議觀察網上料量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.DynamicData['FeedAmountInObservation']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.DynamicData['FeedAmountInObservation']&&typeof(suggData.DynamicData['FeedAmountInObservation'])=='number'?((suggData.DynamicData['FeedAmountInObservation']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['FeedAmountInObservation']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，小蝦不會用觀察網">觀察網網上料量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0"
                                                                                slot="prepend">每日體重投餌率</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <v-text-field
                                                                                v-model="suggData.DynamicData['WeightFeedRate']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"><span class="pa-0 ma-0"
                                                                                    slot="append">%</span></v-text-field>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.DynamicData['WeightFeedRate']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" title="蝦子長度">每日體重投餌率</span><span class="pa-0 ma-0" slot="append">%</span></v-text-field> -->
                                                                </v-col>
                                                                <!-- 蝦長換算蝦重用先隱藏 -->
                                                                <!-- <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend">蝦子重量</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" style="display: flex;align-items: center;">
                                                                            <v-text-field v-model="suggData.DynamicData['ShrimpWeight']" disabled dense hide-details class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft" :title="suggData.DynamicData['ShrimpWeight']&&typeof(suggData.DynamicData['ShrimpWeight'])=='number'?((suggData.DynamicData['ShrimpWeight']/ 1000).toFixed(2)+'kg'):'0kg'"><span class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                </v-col> -->
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
                                                <v-expansion-panel-header class="pa-3" style="min-height: 20px;"
                                                    expand-icon="mdi-chevron-down">養殖前期做水添加物</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card tile>
                                                        <v-card-text class="pa-3 mx-0">
                                                            <v-row class="item-row" dense>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="水體體積、放養密度、水溫、放養初始重量、粗蛋白含量、尿素有效濃度、目標CN比、砂糖純度、放苗日>資料日">砂糖量(做水)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.MakeWater['SugarMakeWater']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.MakeWater['SugarMakeWater']&&typeof(suggData.MakeWater['SugarMakeWater'])=='number'?((suggData.MakeWater['SugarMakeWater']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.MakeWater['SugarMakeWater']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">砂糖量(做水)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="水體體積、漂白粉有效濃度">漂白粉(30ppm濃度)</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.MakeWater['BleachingPowder']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.MakeWater['BleachingPowder']&&typeof(suggData.MakeWater['BleachingPowder'])=='number'?((suggData.MakeWater['BleachingPowder']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.MakeWater['BleachingPowder']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">漂白粉(30ppm濃度)</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="水體體積、水體餘氯、海波有效濃度">海波</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.MakeWater['Hypo']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.MakeWater['Hypo']&&typeof(suggData.MakeWater['Hypo'])=='number'?((suggData.MakeWater['Hypo']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!-- <v-text-field v-model="suggData.MakeWater['Hypo']" disabled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend">海波</span><span class="pa-0 ma-0" slot="append">kg</span></v-text-field> -->
                                                                </v-col>
                                                                <v-col cols=12 md="6" sm="6">
                                                                    <v-row class="item-row item">
                                                                        <v-col cols="12" md="6" sm="6">
                                                                            <span class="pa-0 ma-0" slot="prepend"
                                                                                title="水體體積、放養密度、水溫、放養初始重量、粗蛋白含量、尿素有效濃度">尿素</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" sm="6" class="flex-align-center">
                                                                            <v-text-field
                                                                                v-model="suggData.MakeWater['Urea']"
                                                                                disabled dense hide-details
                                                                                class="mt-0"></v-text-field>
                                                                            <a-tooltip placement="topLeft"
                                                                                :title="suggData.MakeWater['Urea']&&typeof(suggData.MakeWater['Urea'])=='number'?((suggData.MakeWater['Urea']/ 1000).toFixed(2)+'kg'):'0kg'"><span
                                                                                    class="pa-0 ma-0">g</span></a-tooltip>
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
                <div class="bact-to-top">
                    
                </div>
                <div class="to-self">
                    <v-tooltip bottom left>
                        <template v-slot:activator="{ on, attrs }">
                            <button class="btn-primary" :style="{'border-radius':`${windowWidth<960&&isShowResult?'4px 4px 0 0 !important':'4px !important'}`}" @click="goAnchor('top')" v-bind="attrs" v-on="on">
                                <v-icon>mdi-format-vertical-align-top</v-icon>
                            </button>
                        </template>
                        <span>回到上方</span>
                    </v-tooltip>
                    <v-tooltip v-if="windowWidth<960&&isShowResult" left>
                        <template v-slot:activator="{ on, attrs }">
                            <button class="btn-primary btn-to" style="background-color: #408fbc !important;" @click="goAnchor('params')" v-bind="attrs" v-on="on">
                                <v-icon>mdi-pencil</v-icon>
                            </button>
                        </template>
                        <span>回到參數設定</span>
                    </v-tooltip>
                    
                    <v-tooltip v-if="windowWidth<960&&isShowResult" left>
                        <template v-slot:activator="{ on, attrs }">
                            <button class="btn-primary btn-to to-ai"
                                @click="goAnchor('#ai')" v-bind="attrs"
                                v-on="on">
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
            <v-card class="custom-dialog">
                <v-card-title class="add-title">
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
                        <b :style="`font-size:${cellsize+0.1}em`">狀態作動</b> <span :style="`font-size:${cellsize}em`"
                            v-html="setBR(dialogContent.status)"></span>
                    </v-card-text>
                    <v-card-text class="dialog-text border-bottom"
                        style="display: flex;align-items: flex-start;flex-direction: column;padding: 8px 16px;">
                        <b :style="`font-size:${cellsize+0.1}em`">可能影響原因</b> <span :style="`font-size:${cellsize}em`">{{
                            dialogContent.factor }}</span>
                    </v-card-text>
                    <v-card-text class="dialog-text border-bottom"
                        style="display: flex;align-items: flex-start;flex-direction: column;padding: 8px 16px;">
                        <b :style="`font-size:${cellsize+0.1}em`">會造成結果</b> <span
                            :style="`font-size:${cellsize}em`">{{dialogContent.result==''?'無':dialogContent.result
                            }}</span>
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
        <!-- 參數設定選項填入視窗 -->
        <v-dialog id="chipsDialog" v-model="chipsDialog" max-width="500px" style="z-index: 9999;">
            <v-card class="custom-dialog">
                <v-card-title class="add-title">
                    <div style="display: inline-block;">
                        <span>{{ chipsDialogTitle.name }}</span>
                    </div>
                    <div class="add">
                        <v-btn class="btn-secondary close" title="取消" @click="chipsDialog = false;"
                            style="border: none;min-width: 0;padding: 0 4px;">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <div class="basic" style="padding: 24px 12px;">
                    <v-card-text class="dialog-text" style="border-bottom: none;">
                        <v-row  class="flex-align-center" style="width: 100%;">
                            <v-col cols="6" v-for="(item,id) in chipsDialogData" :key="'dialog'+id"
                                style="width: 100%;">
                                <div class="chips flex-align-center"
                                    style="margin-bottom: 8px;width: 100%;">
                                    <span class="pa-0 ma-0" slot="prepend"
                                        style="width:60px;min-height:inherit">{{item.name_ch}}</span>
                                    <el-input-number class="ml-2" v-model="item.value" size="mini" :step="1" :min="0"
                                        prop="number"></el-input-number>
                                </div>
                            </v-col>
                        </v-row>


                        <!-- <v-text-field v-for="(item,id) in chipsDialogData" :key="'dialog'+id" v-model.number="item.value" dense hide-details class="mt-0" style="width: 100%;"><span class="pa-0 ma-0" slot="prepend" style="width:80px;">{{item.name_ch}}</span></v-text-field> -->
                    </v-card-text>
                </div>
                <v-card-actions style="padding: 24px 12px;">
                    <v-spacer></v-spacer>
                    <v-btn class="btn-secondary" @click="chipsDialog=false;">取消</v-btn>
                    <v-btn class="btn-primary" @click="confirmChips">確認</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- 備註欄 -->
        <v-dialog id="remarkDialog" v-model="remarkDialog" max-width="500px" width="500" style="z-index: 9999;">
            <v-card class="custom-dialog">
                <v-card-title class="add-title">
                    <div style="display: inline-block;">
                        <span>紀錄</span>
                    </div>
                    <div class="add">
                        <v-btn class="btn-secondary close" title="取消" @click="remarkDialog = false;"
                            style="border: none;min-width: 0;padding: 0 4px;">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <div class="basic" style="padding:  0 12px 24px 12px;">
                    <v-card-text style="padding: 0 8px;">
                        <div class="card-title">
                            <div class="title">
                                <v-card-title>警示：</v-card-title>
                                <!-- <span v-for="item in suggData.Observation" :key="'ob'+item.id" style="font-size: 0.85rem;line-height: 14px">‧ {{ item.status }}<br></span> -->
                                <span class="record-title">水質：</span>
                                <span v-for="(item,id) in suggData.WaterQuality" :key="'water'+item.id"
                                    style="font-size: 0.85rem;line-height: 14px">{{ id+1 }}. {{ item.status
                                    }}<br></span>
                                <v-textarea v-model="remark.WaterQuality" hide-details filled clearable
                                    placeholder="請輸入實際作動..." style="overflow-y: scroll;"
                                    :disabled="nowUser!==$auth.$state.user.email"></v-textarea>
                            </div>

                        </div>
                        <div class="card-title">
                            <div class="title">
                                <!-- <span v-for="item in suggData.WaterQuality" :key="'water'+item.id" style="font-size: 0.85rem;line-height: 14px">‧ {{ item.status }}<br></span> -->
                                <span class="record-title">觀察網：</span>
                                <span v-for="(item,id) in suggData.Observation" :key="'ob'+item.id"
                                    style="font-size: 0.85rem;line-height: 14px">{{ id+1 }}. {{ item.status
                                    }}<br></span>
                                <v-textarea v-model="remark.Observation" hide-details filled clearable
                                    placeholder="請輸入實際作動..." style="overflow-y: scroll;"
                                    :disabled="nowUser!==$auth.$state.user.email"></v-textarea>
                            </div>
                        </div>

                    </v-card-text>
                    <v-card-text style="padding: 0 8px;">
                        <div class="card-title">
                            <div class="title">
                                <v-card-title>投餌量：</v-card-title>
                                <v-textarea v-model="remark.Feed" hide-details filled clearable placeholder="請輸入實際作動..."
                                    style="overflow-y: scroll;"
                                    :disabled="nowUser!==$auth.$state.user.email"></v-textarea>
                                <!-- <v-text-field v-model.number="remark.Feed" type="number" min="0" dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend" style="width:80px">實際投餌量</span><span class="pa-0 ma-0" slot="append">g</span></v-text-field> -->
                            </div>
                        </div>

                    </v-card-text>
                    <v-card-text style="padding: 0 8px;">
                        <div class="card-title">
                            <div class="title">
                                <v-card-title>投料判斷列表：</v-card-title>
                                <v-textarea v-model="remark.Material" hide-details filled clearable
                                    placeholder="請輸入實際作動..." style="overflow-y: scroll;"
                                    :disabled="nowUser!==$auth.$state.user.email"></v-textarea>
                            </div>
                        </div>

                    </v-card-text>
                    <v-card-text style="padding: 0 8px;">
                        <div class="card-title">
                            <div class="title">
                                <v-card-title>動態數據資訊：</v-card-title>
                                <v-textarea v-model="remark.DynamicData" hide-details filled clearable
                                    placeholder="請輸入實際作動..." style="overflow-y: scroll;"
                                    :disabled="nowUser!==$auth.$state.user.email"></v-textarea>
                            </div>
                        </div>

                    </v-card-text>
                    <v-card-text style="padding: 0 8px;">
                        <div class="card-title">
                            <div class="title">
                                <v-card-title>養殖前期做水添加物：</v-card-title>
                                <v-textarea v-model="remark.MakeWater" hide-details filled clearable
                                    placeholder="請輸入實際作動..." style="overflow-y: scroll;"
                                    :disabled="nowUser!==$auth.$state.user.email"></v-textarea>
                            </div>
                        </div>

                    </v-card-text>
                    <v-card-text style="padding: 0 8px;">
                        <div class="card-title">
                            <div class="title">
                                <v-card-title>其他：</v-card-title>
                                <v-textarea v-model="remark.Others" hide-details filled clearable
                                    placeholder="請輸入其他作動..." style="overflow-y: scroll;"
                                    :disabled="nowUser!==$auth.$state.user.email"></v-textarea>
                            </div>
                        </div>

                    </v-card-text>
                </div>
                <v-card-actions style="padding: 24px 12px;">
                    <v-spacer spacer></v-spacer>
                    <v-btn class="btn-secondary" @click="remarkDialog = false;">取消</v-btn>
                    <v-btn class="btn-primary" v-if="nowUser==$auth.$state.user.email" @click="saveRemark()">確認</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- 投餌料公式 -->
        <v-dialog v-model="feedDialog" scrollable max-width="75%">
            <v-card>
                <!-- <v-card-title>計算公式
                <v-switch
                    v-model="formulaData"
                    :label="formulaData?'pdf':'xls'"
                    ></v-switch>
            </v-card-title> -->
                <v-card-title class="add-title" style="display: block;width: 100%;">
                    <div style="display: inline-block;">
                        <span>計算方式</span>
                    </div>
                    <div class="add" style="float: right;display: inline-block;">
                        <v-btn class="btn-secondary close" title="取消" @click="feedDialog = false;"
                            style="border: none;min-width: 0;padding: 0 4px;">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <v-card-text>
                    <span class="error-text">
                        粉料/3餐，其他料/4餐，粉料只能人工所以除3
                    </span>
                </v-card-text>
                <v-card-text style="height: 600px;">
                    <v-responsive>
                        <iframe :src="url.feed.xls" style="overflow:hidden;height:600px;width:100%;"></iframe>
                    </v-responsive>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import nerdamer from 'nerdamer';
import dayjs from "dayjs";
import _ from "lodash";
// import { number } from 'echarts/lib/export';
export default {
    layout: "emptynologin2",
    head() {
        return {
            title: '知識庫'
        }
    },
    data() {
        return {
            sugerdlg:false,
            FeedRecordData:{FeedAmountForFourMeals:{}},//過去四天單餐投餌量，從required-data api獲得，請附加在suggestion api
            UserData:{Username:'',IsSaved:false},//使用者相關資訊
            BaseParm:{InspectedTime:'',InspectedDate:''},//養殖基本參數
            BreedingParm:{},//養殖參數
            FeedParm:{FeedCN:undefined,CumulativeFeedAmountInput:0},//飼料參數
            FeedCNKey:0,
            MakeWaterParm:{},//做水參數
            WaterQualityData:{},//水質資訊
            ObservationData:{Leftover:0},//觀察網資訊
            BacteriaData:{},//水中菌相資訊
            suggData: { DynamicData: {}, WaterQuality: {}, Observation: {}, Feed: { feed_amount: {}, "statistics": {}, "status": "" }, Material: {}, MakeWater: {},FeedingPlan:[] },//ai建議
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
            bacteriaDataObject:{'IsWSSV': 0,'IsEMSPlasmid': 0,'IsEMSToxin': 0,'IsEHP': 0,'IsTSV': 0,'IsIMNV': 0,'IsIHHNV': 0},
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
            chips:{},
            chipsDialog: false,
            chipsDialogData:[],
            chipsDialogTitle:{
                param: '',
                name: ''
            },
            //pdf
            formulaData:false,//true is pdf else is xls
            dialog:{
                pdf:false
            },
            // formulaUrl:'https://drive.google.com/file/d/1bX5klfM74SNV06tM55A5YGTXRO0sER-9/preview',
            url:{
                all: {
                    pdf:'https://drive.google.com/file/d/1bX5klfM74SNV06tM55A5YGTXRO0sER-9/preview',
                    xls:'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLS_4p8BhJ1yNhmqv4_pVEt7CUCDueo6r51pyT7fcaNIVdGWYA2b6oCTBQSoH-rrBrEMdQ05QVGebk/pubhtml?widget=true&amp;headers=false'
                },
                feed: {
                    xls:'https://docs.google.com/spreadsheets/d/e/2PACX-1vRzEivBAKUhwQ4bL1h8TjIUz9p7sVBEtjSHtJejMUpH2cCPl_M2rtW3CxtM36o87qLpbwa4lEc-_dIR/pubhtml?widget=true&amp;headers=false'
                }
                
            },
            observationKey:{},
            remarkDialog: false,
            remark:{ DynamicData: '', WaterQuality: '', Feed: '', Material: '', MakeWater: '', Other:''},
            inputRemark:{ DynamicData: '', WaterQuality: '', Feed: '', Material: '', MakeWater: '', Other:''},
            userData:[],
            nowUser: (this.$auth.$state.user==null)?"":this.$auth.$state.user.email,
            showDate: true,
            isLoading:false,
            headers:[
                { text: '方案', value: 'Name', sortable: true,},
                { text: '建議此餐飼料(g)', value: 'NextFeed', sortable: true,},
                { text: '增料百分比(%)', value: 'NextFeedIncrementPct', sortable: true,},
                { text: '建議料號', value: 'FeedSize', sortable: false,},
            ],
            feedDialog: false,
            isShowResult: false,
            isSearchDate: false,
            oldSearchDate:[],
            nowUserData:[],
            isParaLoading: false,
        }
    },
    methods: {
        //補上客制搜尋
        customFilter(item, queryText, itemText) {
            const searchText = queryText.toLowerCase();
            const username = item.username.toLowerCase();
            const account_name = item.account_name.toLowerCase();
            // console.log(`customFilter:item=${JSON.stringify(item)},queryText=${queryText},itemText=${itemText}`);
            return username.indexOf(searchText) > -1 || account_name.indexOf(searchText) > -1;
            // return true;
            // const textOne = item.name.toLowerCase()
            // const textTwo = item.abbr.toLowerCase()
            // return textOne.indexOf(searchText) > -1 ||
            //     textTwo.indexOf(searchText) > -1
        },
        onChange(value,dateString) {
            console.log(value,dateString);
        },
        onOk(value) {
            console.log(value);
        },
        // 下拉選擇，切換池 locateSelect
        async get_scopeData(evt) {
            this.isShowResult = false;
            this.isLoading = false;
            this.goAnchor('top');
            // await this.getQuerry();
            if(this.nowSelectPool!==evt) {
                this.nowSelectPool = evt;
                this.querrySelected = '';
                this.isSearch = false;
                this.resetParm();

                await this.importBasicData();//帶入數據, 後端帶入養殖池的最新資料
                // await this.postParm(false);//按下查詢ai回饋
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
            //現在選擇的池有的編輯紀錄
            this.nowSelectDataLst = this.querryDataLst[this.nowSelectPool];
            
            if(this.nowSelectDataLst==undefined) {
                this.nowSelectDataLst = [];
                //this.resetParm();
            }
            if(this.nowSelectPool==evt) {
                this.isLoading = true;
            }
            
            // console.log('nowSelectDataLst',this.nowSelectDataLst);
            // this.importBasicData();//帶入數據
            // this.allData.forEach(d=>{d.node.forEach(s=>{s.node.forEach(p=>{if(p.id==evt)this.nowSelectPool=s.name+'_'+p.name})})});
        },
        // 帶入參數
        getSelectData(evt) {
            console.log('Change Select',evt);
            this.isSearch = false;
            this.isShowResult = false;
            this.goAnchor('top');
            if(evt==null) {
                //如果BaseParm['InspectedDate']有資料，即保留下去查詢ai回饋
                var tempDate = _.cloneDeep(this.BaseParm['InspectedDate']);
                var tempTime = _.cloneDeep(this.BaseParm['InspectedTime']);
                if(['',null,undefined].includes(tempDate)==false){//有日期，照日期資料下去查詢回饋
                    tempTime = (tempTime!='')?tempTime:'00:00';//有日期，但時間是空白，就給預設00:00
                }
                this.resetParm();//重設
                this.BaseParm['InspectedDate'] = (['',null,undefined].includes(tempDate))?this.getNowDate():tempDate;//沒有日期，設定現在日期
                this.BaseParm['InspectedTime'] = (['',null,undefined].includes(tempDate))?this.getNowTime():tempTime;//沒有日期，設定現在時間
                // console.log("evt parm2:",this.BaseParm['InspectedDate'],this.BaseParm['InspectedTime']);
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
                let ele = document.getElementById('waterObservation');
                ele.scrollTop=0;
                window.scrollTo({top: 0, behavior: 'smooth'});
            }else if(selector=='params' || selector=='ai'||selector=='dashboard') {
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
            // await this.$axios
            //     .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
            //     .then(res=>{
            //         this.allData = res.data;
            //         this.querrySelectedLst = {};
            //         this.querryDataLst = {}
            //         this.allData.forEach(f=>{
            //             f.node.forEach(a=>{
            //                 a.node.forEach(p=>{
            //                     this.querrySelectedLst[`${p.id}`] = '';
            //                     this.querryDataLst[`${p.id}`] = [];
            //                 })
            //             })
            //         })
            //         console.log('architecture',res);
            //         // console.log('querrySelectedLst',this.querrySelectedLst);
            //     })
            //     .catch(error=>{
            //         console.log(error);
            //     })
            let architectureData = await this.getArchitecture();
            this.allData = typeof (architectureData)=='string'?[]:architectureData;
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
        },
        getNowDate: function() {
            let mydate = dayjs().format("YYYY-MM-DD");
            return mydate;
        },
        getNowTime: function() {
            let mytime = dayjs().format("HH:mm");
            return mytime;
        },
        getNowDateTime() {
            console.log('FeedParm',this.FeedParm['LastFeedDatetime']);

            return this.$moment(new Date(), 'YYYY-MM-DD HH:mm');
            
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
            let getWarningRangeList = await this.getWarningRangeList();
            let data = typeof (getWarningRangeList)=='string'?[]:getWarningRangeList;
            console.log('getLight',data);
            this.lightData = data;
            if(this.lightData) {
                this.lightData['LastTemp'] = _.cloneDeep(this.lightData['Temp']);
                this.lightData['LastTemp']['critical'][1].forEach((x,i)=>{this.lightData['LastTemp']['critical'][1][i]=x.replace('Temp','LastTemp')});
                this.lightData['LastTemp']['critical'][2].forEach((x,i)=>{this.lightData['LastTemp']['critical'][2][i]=x.replace('Temp','LastTemp')});
                this.lightData['LastTemp']['warning'][1].forEach((x,i)=>{this.lightData['LastTemp']['warning'][1][i]=x.replace('Temp','LastTemp')});
                //list轉成格式：{'Do':'teal','pH':'teal','Temp':'teal','Salinity':'teal','AmmoniaN':'teal','NO2':'teal'},
                this.lightColor = Object.keys(data).reduce((a, v) => ({ ...a, [v]: 'teal'}), {}); 
            }
            
            // await this.$axios.get(url).then(res => {
            //     if(res.status==200){
            //         this.lightData = res.data;
            //         console.log(this.lightData)
            //         this.lightData['LastTemp'] = _.cloneDeep(this.lightData['Temp']);
            //         this.lightData['LastTemp']['critical'][1].forEach((x,i)=>{this.lightData['LastTemp']['critical'][1][i]=x.replace('Temp','LastTemp')});
            //         this.lightData['LastTemp']['critical'][2].forEach((x,i)=>{this.lightData['LastTemp']['critical'][2][i]=x.replace('Temp','LastTemp')});
            //         this.lightData['LastTemp']['warning'][1].forEach((x,i)=>{this.lightData['LastTemp']['warning'][1][i]=x.replace('Temp','LastTemp')});
            //         //list轉成格式：{'Do':'teal','pH':'teal','Temp':'teal','Salinity':'teal','AmmoniaN':'teal','NO2':'teal'},
            //         this.lightColor = Object.keys(res.data).reduce((a, v) => ({ ...a, [v]: 'teal'}), {}); 
            //         console.log("get lightData ok");
            //     }else{
            //         this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
            //     }
            // })
            // .catch(error=>{
            //     this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            // });
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
            let getFieldOtptionList = await this.getFieldOtptionList();
            let data = typeof (getFieldOtptionList)=='string'?[]:getFieldOtptionList;
            this.optData = data;
            var keyLst = [];
            if(this.optData) {
                keyLst = Object.keys(this.optData);
                keyLst.forEach(k=>{
                    if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
                        this.ObservationData[k] = _.cloneDeep(this.optData[k]);
                        this.ObservationData[k].forEach(c=>{
                            c.value=0;
                        })
                    }
                    
                })
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
            }
            
            
            // await this.$axios.get(url).then(res => {
            //     if(res.status==200){
            //         this.optData = res.data;
            //         var keyLst = Object.keys(this.optData);
            //         keyLst.forEach(k=>{
            //             if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
            //                 this.ObservationData[k] = _.cloneDeep(this.optData[k]);
            //                 this.ObservationData[k].forEach(c=>{
            //                     c.value=0;
            //                 })
            //             }
                        
            //         })
            //         console.log('getOptData',this.optData);
            //     }else{
            //         this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
            //     }
            // })
            // .catch(error=>{
            //     this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            // })
            // .finally(() => {
            //     var isYN = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
            //         //ObservationData
            //         this.optData.IsMoultingPeriod = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
            //         //BacteriaData
            //         this.optData.IsWSSV = _.cloneDeep(isYN);
            //         this.optData.IsEMSPlasmid = _.cloneDeep(isYN);
            //         this.optData.IsEMSToxin = _.cloneDeep(isYN);
            //         this.optData.IsEHP = _.cloneDeep(isYN);
            //         this.optData.IsTSV = _.cloneDeep(isYN);
            //         this.optData.IsIMNV = _.cloneDeep(isYN);
            //         this.optData.IsIHHNV = _.cloneDeep(isYN);
            //         // this.optData.IsEMSInfected = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
            //         // this.optData.IsEHPInfected = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
            //         // this.optData.IsVirusInfected = [{ "name_en": false, "name_ch": "否" }, { "name_en": true, "name_ch": "是" }];
            //         // this.optData.IsBacteriumInfected = [{ "name_en": false, "name_ch": "否" }, { "name_en": true, "name_ch": "是" }];
            //     });
        },
        async getAllUser() {
            let getuserData = await this.getUserList();
            this.userData = typeof (getuserData)=='string'?[]:getuserData;
            this.userData = this.userData.filter(x=>x.is_active==true);
            this.isLoading = true;
            this.nowUserData = [];
            let userDepartment = this.userData.filter(x=>x.username == this.$auth.$state.user.email)[0].department;
            this.userData.forEach(user=>{
                let isIncludes = false;
                user.department.forEach(d=>{
                    if(userDepartment.includes(d)) {
                        isIncludes = true;
                    }
                })
                if(isIncludes) {
                    this.nowUserData.push(user);
                }
            })
            console.log('User',this.userData,userDepartment);
        },
        async getUserQueryData() {
            this.isParaLoading = true;
            await this.getQuerry();
            this.querrySelected='';
            // await this.importBasicData();
        },
        getQuerry:async function(isAdd){
            // if(this.querryData.length>0){
            //     return;
            // }
            let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/`;
            var allParm = {
                IsLast:false,
                Username: this.nowUser
            };
            if(this.$auth.$state.user==null){
                this.$toast.error(`需重新登入`, { duration: 2000 });
                window.location.href='/login';
                this.isParaLoading = false;
                // return;
            }else {
                let getQueryLogList = await this.getQueryLogList(allParm);
                let data = typeof (getQueryLogList)=='string'?[]:getQueryLogList;
                this.querryData = data;
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
                this.isParaLoading = false;
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
                // await this.$axios.get(url, {params:allParm}).then(res => {
                //     if(res.status==200){
                //         this.querryData = res.data;
                //         this.querryDataLst = {};
                //         for(let i=0;i<this.querryData.length;i++) {
                //             this.allData.forEach(f=>{
                //                 if(f.name == this.querryData[i].factory_name) {
                //                     f.node.forEach(a=>{
                //                         if(a.name == this.querryData[i].pond_area_name){
                //                             a.node.forEach(p=>{
                //                                 if(p.name == this.querryData[i].pond_name) {
                //                                     if(!this.querryDataLst[p.id]) {
                //                                         this.querryDataLst[p.id] = [];
                //                                     }
                //                                     this.querryDataLst[p.id].push(this.querryData[i]);
                //                                 }
                //                             })
                //                         }
                                        
                //                     })
                //                 }
                                
                //             })
                //         }
                //         this.nowSelectDataLst = this.querryDataLst[this.nowSelectPool];
                //         console.log('querryData',this.querryData);
                //         console.log('querydatalst',this.querryDataLst);
                //         console.log('nowSelectDataLst',this.nowSelectDataLst);
                //         this.get_scopeData(this.nowSelectPool);
                //         if(isAdd) {
                //             let alldate = [];
                //             this.nowSelectDataLst.forEach(p=>{
                //                 alldate.push(p.created_time);
                //             })
                //             let maxDate = new Date(Math.max(...alldate.map(date => new Date(date))));
                //             this.querrySelected = dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
                //             this.getSelectData(this.querrySelected);
                //             this.importQuerry();
                //         }
                //         if(this.windowWidth<959.58) {
                //             setTimeout(()=>{
                //                 this.goAnchor('#aiwatermin');
                //             },100)
                //         }
                            
                //     }
                //     else if(res.status == 400){
                //         this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                //     }
                //     else{
                //         this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                //     }

                // }).catch(error => {
                //     this.$toast.error(`資料Fail:${error}\n${JSON.stringify(error.response.data)}`, { duration: 5000 });
                // })
                // .finally(() => {
                //         //this.getdata();
                // });
            }
            

        },
        importQuerry:async function(_input_data = null,bool=false){
            console.log("importQuerry: _input_data + bool",_input_data,bool);
            if(this.querrySelected==null && _input_data == null){
                console.log("importQuerry resetParm!");
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
                //console.log('importQuerry input_data:',input_data);
                this.BaseParm = input_data.BaseParm;
                this.BreedingParm = input_data.BreedingParm;
                this.FeedParm = _.cloneDeep(input_data.FeedParm);
                this.FeedRecordData = _.cloneDeep(input_data.FeedRecordData?input_data.FeedRecordData:{});//用來附加到suggestion api
                if(input_data.remark) {
                    this.inputRemark = _.cloneDeep(input_data.remark);
                }else {
                    this.inputRemark = { DynamicData: '', WaterQuality: '', Feed: '', Material: '', MakeWater: '', Other:''}
                }
                //console.log('新增',input_data,this.inputRemark);
                //自動查表計算飼料CN比
                this.changeCrudeProteinPct();
                if(this.FeedParm['LastFeedDatetime']) {
                    this.FeedParm['LastFeedDatetime'] = this.$moment(new Date(this.FeedParm['LastFeedDatetime']), 'YYYY-MM-DD HH:mm');
                }
                if(this.FeedParm['CumulativeFeedAmountInput']) {}else {
                    this.FeedParm['CumulativeFeedAmountInput'] = 0;
                }
                
                this.MakeWaterParm = input_data.MakeWaterParm;
                this.WaterQualityData = input_data.WaterQualityData;
                this.ObservationData = _.cloneDeep(input_data.ObservationData);
                var keyLst = Object.keys(this.optData);
                keyLst.forEach(k=>{
                    if(['BodyColor','BodyShape','HepatopancreasColor','IntestinalColor','MuscleColor'].includes(k)){
                        // k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
                        if(this.ObservationData[k]) {
                            let data = [];
                            var keys = Object.keys(this.ObservationData[k]);
                            keys.forEach((s,sid)=>{
                                this.optData[k].forEach(x=>{
                                    if(x.name_en.toUpperCase() == s.toUpperCase()) {
                                        data[sid] = _.cloneDeep(x);
                                        data[sid].value = this.ObservationData[k][s];
                                    }
                                })
                            })
                            this.ObservationData[k] = data;
                                
                            
                        }else {
                            this.ObservationData[k] = _.cloneDeep(this.optData[k]);
                            this.ObservationData[k].forEach(c=>{
                                c.value=0;
                            })
                        }
                        
                        
                    }
                    
                })
                //console.log('Input Observation',this.ObservationData);
                
                if(this.ObservationData['SamplingDatetime']) {
                    this.ObservationData['SamplingDatetime'] = this.$moment(new Date(this.ObservationData['SamplingDatetime']), 'YYYY-MM-DD HH:mm');
                }
                if(this.ObservationData['LastSamplingDatetime']) {
                    this.ObservationData['LastSamplingDatetime'] = this.$moment(new Date(this.ObservationData['LastSamplingDatetime']), 'YYYY-MM-DD HH:mm');
                }
                this.BacteriaData = input_data.BacteriaData;
                console.log("DiseaseInfection:",input_data.BacteriaData.DiseaseInfection);
                
                this.bacteriaSelect = [];
                this.bacteriaDataObject = (input_data.BacteriaData.DiseaseInfection==undefined)?this.bacteriaDataObject:input_data.BacteriaData.DiseaseInfection;
                for(let i=0;i<this.bacteriaAll.length;i++) {
                    if(input_data.BacteriaData.DiseaseInfection != undefined && input_data.BacteriaData.DiseaseInfection[this.bacteriaAll[i]]==1) {
                        this.bacteriaSelect.push(this.bacteriaAll[i]);
                    }
                }
                //reset suggData
                //suggData: { DynamicData: {}, WaterQuality: {}, Observation: {}, Feed: { feed_amount: {}, "statistics": {}, "status": "" }, Material: {}, MakeWater: {} },//ai建議
                var output_data = { DynamicData: {}, WaterQuality: {}, Observation: {}, Feed: { feed_amount: {}, "statistics": {}, "status": "" }, Material: {}, MakeWater: {}};
                if(_input_data==null){
                    output_data = _.cloneDeep(this.querryDataLst[this.nowSelectPool].filter(x => x.created_time == this.querrySelected)[0].output_data);
                }else{
                    
                }
                console.log('querryDataLst[this.nowSelectPool]',this.ObservationData,this.FeedParm);
                // 預設投餌方案
                this.FeedParm['FeedingPlan'] = this.optData.FeedingPlan[0]['name_ch'];

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
        changeCrudeProteinPct:function(){
            this.FeedParm['FeedCN'] = this.calcFeedCN(this.FeedParm['CrudeProteinPct']);
            this.FeedCNKey =  Math.floor(Math.random() * 100);
        },
        //填入粗蛋白回傳結果
        calcFeedCN:function(CrudeProteinPct){
            const cnTable = [{"CrudeProtein":15,"cn":20.8},
                                {"CrudeProtein":20,"cn":15.6},
                                {"CrudeProtein":25,"cn":12.5},
                                {"CrudeProtein":30,"cn":10.4},
                                {"CrudeProtein":35,"cn":8.9},
                                {"CrudeProtein":40,"cn":7.8},
                                {"CrudeProtein":45,"cn":6.9},
                                {"CrudeProtein":50,"cn":6.3},
                                {"CrudeProtein":55,"cn":5.7},
                                {"CrudeProtein":60,"cn":5.2},
                                ];
                if(typeof(CrudeProteinPct)!="undefined" && CrudeProteinPct != ""){
                    var thisCrudeProteinPct = Number(CrudeProteinPct);//粗蛋白含量
                    var currentCN = null;
                    cnTable.forEach((item,i,array)=>{
                        var min = item['CrudeProtein'] - 3;
                        var max = item['CrudeProtein'] + 2;
                        if(thisCrudeProteinPct >= min && thisCrudeProteinPct <= max){
                            currentCN = item['cn'];
                        }
                    });
                    return _.cloneDeep(currentCN);
                }else{
                    return null;
                }
        },
        delQuerry:async function(querrypool){
            // if(this.querrySelectedLst[querrypool]==null){
            //     this.resetParm();
            //     return;
            // }else{
                var id = this.querryDataLst[querrypool].filter(x=>x.created_time==this.querrySelected)[0].id;
                let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/${id}/`;
                if(confirm(`是否刪除該筆紀錄？ id = ${id}`)){
                    var res = false;
                    res = await this.deleteQueryLogList(id);
                    setTimeout(()=>{
                        if(res) {
                            // this.getQuerry2(querrypool,true);//reget data
                            this.getQuerry();
                            // this.querrySelectedLst[querrypool] = "";
                            this.resetParm();
                            this.querrySelected = '';
                            this.BaseParm['InspectedDate'] = this.getNowDate();//沒有日期，設定現在日期
                            this.BaseParm['InspectedTime'] = this.getNowTime();//沒有日期，設定現在時間
                            this.isSearch = false;
                            this.isSearchDate = false;
                        }
                    },50)
                    // await this.$axios
                    //     .delete(url)
                    //     .then(res => {
                    //         if(res.data=='刪除成功'){
                    //             this.$toast.success("刪除成功", { duration: 2000 });
                    //             // this.getQuerry2(querrypool,true);//reget data
                    //             this.getQuerry();
                    //             // this.querrySelectedLst[querrypool] = "";
                    //             this.resetParm();
                    //             this.querrySelected = '';
                    //             this.isSearch = false;
                    //         }else{
                    //             this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
                    //         }

                    //         console.log("刪除步驟API:" + res.request.responseURL);
                    //     })
                    //     .catch(error => {
                    //         this.$toast.error("error:" + error, { duration: 2000 });
                    //     })
                    //     .finally(() => {
                    //         // this.getQuerry2(querrypool,true);
                    //     });
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
                await this.postParm(false);//isSaved=false,querrypool=null,isPatch=false
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
                        'UserData': this.UserData,
                        'remark': _.cloneDeep(this.inputRemark),
                        'FeedRecordData':this.FeedRecordData,//從required-data api獲得，請附加在suggestion api
                    };
                    // console.log('bacteriaDataObject',this.bacteriaDataObject)
                    input_data.BacteriaData['DiseaseInfection'] = this.bacteriaDataObject;
                    if(input_data.FeedParm['LastFeedDatetime']) {
                        let maxDate = new Date(this.FeedParm['LastFeedDatetime']);
                        input_data.FeedParm['LastFeedDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm");
                    }
                    if(input_data.ObservationData['SamplingDatetime']) {
                        let maxDate = new Date(this.ObservationData['SamplingDatetime']);
                        input_data.ObservationData['SamplingDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm");
                    }
                    if(input_data.ObservationData['LastSamplingDatetime']) {
                        let maxDate = new Date(this.ObservationData['LastSamplingDatetime']);
                        input_data.ObservationData['LastSamplingDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm");
                    }
                    var keyLst = Object.keys(this.optData);
                    keyLst.forEach(k=>{
                        if(['BodyColor','BodyShape','HepatopancreasColor','IntestinalColor','MuscleColor'].includes(k)){
                        // if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
                            let data = _.cloneDeep(input_data.ObservationData);
                            input_data.ObservationData[k] = {};
                            data[k].forEach(d=>{
                                input_data.ObservationData[k][d.name_en] = d.value;
                            })
                        }
                    })
                    var output_data = this.suggData;
                    var allParm = {
                        input_data:input_data,
                        output_data:output_data
                    }
                var id = this.querryDataLst[querrypool].filter(x => x.created_time == this.querrySelected)[0].id;
                console.log('patch',this.querryDataLst[querrypool].filter(x => x.created_time == this.querrySelected))
                let url = `${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/${id}/`;
                if (confirm(`是否覆蓋該筆紀錄？ id = ${id}`)) {
                    var res = false;
                    res = await this.patchQueryLogList(allParm,id);
                    setTimeout(()=>{
                        if(res) {
                            this.getQuerry();
                        }
                        this.isLoading = true;
                    },50)
                    // await this.$axios
                    //     .patch(url, allParm)
                    //     .then(res => {
                    //         if (res.data == '修改成功') {
                    //             this.$toast.success("覆蓋成功!!", { duration: 2000 });
                    //             this.getQuerry();
                    //         } else {
                    //             this.$toast.success("覆蓋失敗：" + res.data, { duration: 2000 });
                    //         }
                    //     })
                    //     .catch(error => {
                    //         this.$toast.error("覆蓋error:" + error, { duration: 2000 });
                    //     })
                    //     .finally(() => {
                            
                    //     });
                } else {
                    this.$toast.error("覆蓋取消", { duration: 2000 });
                    this.isLoading = true;
                }
            // }
        },
        postParm:async function(isSaved=false){
            this.isLoading = false;
            //資料送回後端查詢ai回饋，issaved=true，會同時紀錄該比資料
            //isSaved是否新增
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
                'UserData':this.UserData,
                'remark': _.cloneDeep(this.inputRemark),
                'FeedRecordData':this.FeedRecordData,//從required-data api獲得，請附加在suggestion api
            };
            // console.log('bacteriaDataObject',this.bacteriaDataObject)
            allParm.BacteriaData['DiseaseInfection'] = this.bacteriaDataObject;
            if(allParm.FeedParm['LastFeedDatetime']) {
                let maxDate = new Date(this.FeedParm['LastFeedDatetime']);
                allParm.FeedParm['LastFeedDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm");
            }
            if(allParm.ObservationData['SamplingDatetime']) {
                let maxDate = new Date(this.ObservationData['SamplingDatetime']);
                allParm.ObservationData['SamplingDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm");
            }
            if(allParm.ObservationData['LastSamplingDatetime']) {
                let maxDate = new Date(this.ObservationData['LastSamplingDatetime']);
                allParm.ObservationData['LastSamplingDatetime'] = dayjs(maxDate).format("YYYY-MM-DD HH:mm");
            }
            var keyLst = Object.keys(this.optData);
            keyLst.forEach(k=>{
                if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
                    let data = _.cloneDeep(allParm.ObservationData);
                    allParm.ObservationData[k] = {};
                    data[k].forEach(d=>{
                        allParm.ObservationData[k][d.name_en] = d.value;
                    })
                }
            })
            // console.log("all參數：",allParm);
            let getSuggestionList = await this.getSuggestionList(allParm);
            let suggestionData = typeof (getSuggestionList)=='string'?[]:getSuggestionList;
            this.suggData.DynamicData = suggestionData.DynamicData;
            this.suggData.WaterQuality = suggestionData.WaterQuality;
            this.suggData.Observation = suggestionData.Observation;
            this.suggData.Feed = suggestionData.Feed;
            this.suggData.Material = suggestionData.Material;
            this.suggData.MakeWater = suggestionData.MakeWater;
            this.$toast.success(`${(isSaved)?'新增':'查詢'}知識庫成功`, {
                duration: 2000
            });
            
            if(isSaved){ 
                this.isLoading = true;
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
            
            // await this.$axios.post(`${this.$store.state.mydata.gobal_api.apiKbUrl}/suggestion/`, allParm).then(res => {
            //     if(res.status==200){
            //         this.suggData.DynamicData = res.data.DynamicData;
            //         this.suggData.WaterQuality = res.data.WaterQuality;
            //         this.suggData.Observation = res.data.Observation;
            //         this.suggData.Feed = res.data.Feed;
            //         this.suggData.Material = res.data.Material;
            //         this.suggData.MakeWater = res.data.MakeWater;
            //         this.$toast.success(`${(isSaved)?'新增':'查詢'}知識庫成功`, {
            //                 duration: 2000
            //             });
            //     } else {
            //         this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
            //     }
            //     console.log(`${(isSaved)?'新增':'查詢'} 知識庫api:` + res.request.responseURL);
            // }).catch(error => {
            //     this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            // })
            // .finally(() => {
            //         //this.getdata();
            // });
            
            // BaseParm['Factory'] + BaseParm['PondArea']+ BaseParm['Pond']) == ['1']
            // this.getQuerry2();
        },
        
        resetParm:async function(){
            this.querrySelectedLst={"1":"","2":"","3":"","4":""};
            this.BaseParm = {InspectedTime:'',InspectedDate:'',Factory:this.BaseParm['Factory']?this.BaseParm['Factory']:'',PondArea:this.BaseParm['PondArea']?this.BaseParm['PondArea']:'',Pond:this.BaseParm['Pond']?this.BaseParm['Pond']:''};
            this.BreedingParm = {};
            this.FeedParm={FeedCN:undefined,CumulativeFeedAmountInput:0};
            this.MakeWaterParm={};
            this.WaterQualityData = {};
            this.ObservationData = {Leftover:0};
            this.BacteriaData={};
            for(let i=0;i<this.bacteriaAll.length;i++) {
                this.bacteriaDataObject[this.bacteriaAll[i]] = 0;            
            }
            this.bacteriaSelect = [];
            this.FeedRecordData = {"FeedAmountForFourMeals": {}};
            this.suggData = {
                "DynamicData": {},
                "WaterQuality": [],//ai建議-水質
                "Observation": [],//ai建議-觀察網
                "Feed": { "feed_amount": {}, "statistics": {}, "status": "" },//ai建議-投餌量
                "Material": {},//投料判斷列表
                "MakeWater": {},//養殖前期做水添加物
            };
            this.inputRemark={ DynamicData: '', WaterQuality: '', Feed: '', Material: '', MakeWater: '', Other:''}
            var keyLst = Object.keys(this.optData);
            keyLst.forEach(k=>{
                if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
                    this.ObservationData[k] = _.cloneDeep(this.optData[k]);
                    this.ObservationData[k].forEach(c=>{
                        c.value=0;
                    })
                }
                
            })
        },
        importBasicData:async function(){//帶入數據
            this.isLoading = false;
            console.log("importBasicData!!");
            if(this.nowSelectPool==""){
                this.isLoading = true;
                this.$toast.error(`請先選擇養殖池`, { duration: 2000 });
                return;
            }else {
                this.getSelectData(null);
            }
            var parm ={
                inspected_date:this.BaseParm['InspectedDate'],
                inspected_time:this.BaseParm['InspectedTime'],
                // inspected_date:this.getNowDate(),
                // inspected_time: this.getNowTime(),
                pond_id : this.nowSelectPool    
            };
            let url =`${this.$store.state.mydata.gobal_api.apiUrl}/kb/required-data/`;
            let getRequiredDataList = await this.getRequiredDataList(parm);
            let data = typeof (getRequiredDataList)=='string'?[]:getRequiredDataList;
            this.importQuerry(data,true);//導入資料
            // 先不幫查ai回饋資訊
            this.postParm(false);//查詢ai回饋資訊
            this.isLoading = true;
            // await this.$axios.get(url, {params:parm}).then(res => {
            //     if (res.status == 200) {
            //         // 取得上次填入資料，現在觀察往已自動帶入，不須取得上次填入的資料
            //         // this.getSampleData();
            //         // res.data.ObservationData['LastShrimpWeight'] = this.ObservationData['LastShrimpWeight'];
            //         // res.data.ObservationData['LastSamplingDatetime'] = this.ObservationData['LastSamplingDatetime'];
            //         this.importQuerry(res.data,true);//導入資料
            //         // 先不幫查ai回饋資訊
            //         this.postParm(false);//查詢ai回饋資訊
            //         // var keyLst = Object.keys(this.optData);
            //         // keyLst.forEach(k=>{
            //         //     if(k=='BodyColor'||k=='BodyShape'||k=='HepatopancreasColor'||k=='IntestinalColor'||k=='MuscleColor') {
            //         //         this.ObservationData[k] = _.cloneDeep(this.optData[k]);
            //         //         this.ObservationData[k].forEach(c=>{
            //         //             c.value=0;
            //         //         })
            //         //     }
                        
            //         // })
            //         //console.log('FeedParm',this.FeedParm);
            //         this.$toast.success(`帶入基本資料成功`, { duration: 2000 });
            //     } else {
            //         this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
            //     }
            //     console.log("取得基本資料API:" + res.request.responseURL);
            // }).catch(error => {
            //     this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            // })
            // .finally(() => {
            //         //this.getdata();
            // });
        },
        async getSampleData() {
            let factory = '';
            let area = '';
            let pond = '';
            this.allData.forEach(f=>{
                f.node.forEach(a=>{
                    a.node.forEach(p=>{
                        if(p.id==this.nowSelectPool) {
                            pond = p.name;
                            area = a.name;
                            factory = f.name;
                        }
                    })
                })
            })
            var parm ={
                Username: this.$auth.$state.user.email,
                Factory: factory,
                PondArea : area,
                Pond:  pond
            };
            let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/last-sampling-data/`;
            await this.$axios.get(url, {params:parm}).then(res => {
                if (res.status == 200) {
                    if(res.data.LastShrimpWeight || res.data.LastSamplingDatetime) {
                        if(res.data.LastShrimpWeight!==null) {
                            this.ObservationData['LastShrimpWeight'] = res.data.LastShrimpWeight;
                        }
                        if(res.data.LastSamplingDatetime!==null) {
                            this.ObservationData['LastSamplingDatetime'] = this.$moment(new Date(res.data.LastSamplingDatetime), 'YYYY-MM-DD HH:mm');
                        }
                    }
                    
                    
                    // this.$toast.success(`取得基本資料成功`, { duration: 2000 });
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
                this.lightColor[item] = 'grey';
            }
            return this.lightColor[item];
        },
        select(evt,bool=false) {
            console.log(this.bacteriaSelect);
            console.log(this.bacteriaDataObject);
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
        },
        // 蝦體顏色/形狀等的chips Dialog
        chipsOpen(title) {
            if(this.ObservationData['ObservationNum']) {
                this.chipsDialog = true;
                this.chipsDialogData = _.cloneDeep(this.ObservationData[title]);
                this.chipsDialogTitle.param = title;
                if(title == 'IntestinalColor') {
                    this.chipsDialogTitle.name = '腸線顏色';
                }else if(title == 'HepatopancreasColor') {
                    this.chipsDialogTitle.name = '肝胰臟顏色';
                }else if(title == 'MuscleColor') {
                    this.chipsDialogTitle.name = '肌肉顏色';
                }else if(title == 'BodyColor') {
                    this.chipsDialogTitle.name = '蝦體顏色';
                }else if(title == 'BodyShape') {
                    this.chipsDialogTitle.name = '蝦體形狀';
                }
                console.log('Open',this.chipsDialogData)
                this.chipsDialogData.sort((a,b)=>{return b.value-a.value});
            }else {
                this.$toast.error("請輸入觀察網隻數", { duration: 2000 });
            }
        },
        confirmChips() {
            let chips = 0
            this.chipsDialogData.forEach(c=>{chips+=c.value});
            if(chips>this.ObservationData['ObservationNum']) {
                alert('輸入隻數與觀察網隻數不符!');

            }else {
                this.chipsDialog=false;
                this.chipsDialogData.forEach(c=>{
                    if(c.value==null||c.value=='') {
                        c.value = 0;
                    }
                })
                this.chipsDialogData.sort((a,b)=>{return b.value-a.value});
                this.ObservationData[this.chipsDialogTitle.param] = _.cloneDeep(this.chipsDialogData);
            }
        },
        openRemark() {
            this.remarkDialog = true;
            this.remark = _.cloneDeep(this.inputRemark);
        },
        save() {
            this.inputRemark = _.cloneDeep(this.remark);
            this.remarkDialog = false;
        },
        saveRemark() {
            this.inputRemark = _.cloneDeep(this.remark);
            this.remarkDialog = false;
        },
        judgeColor(type) {
            let isColor = false;
            if(this.ObservationData[type]&&this.ObservationData[type].length>0) {
                this.ObservationData[type].forEach(x=>{
                    if(x.value>0) {
                        isColor = true;
                    }
                })
            }
            
            return isColor;
        },
        searchDate() {
            this.isSearchDate = true;
            this.oldSearchDate[0] = this.BaseParm['InspectedDate'];
            this.oldSearchDate[1] = this.BaseParm['InspectedTime'];
        },
        cancelSearchDate() {
            this.isSearchDate = false;
            this.BaseParm['InspectedDate'] = this.oldSearchDate[0];
            this.BaseParm['InspectedTime'] = this.oldSearchDate[1];
        }, 
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
        await this.getAllUser();
        
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
        formulaUrl(){
            return this.formulaData?this.url.all.pdf:this.url.all.xls;
        },
        ShowPoolName(){
            var Factory = (this.BaseParm["Factory"]==undefined)?'':this.BaseParm["Factory"];
            var PondArea = (this.BaseParm["PondArea"]==undefined)?'':this.BaseParm["PondArea"];
            var Pond = (this.BaseParm["Pond"]==undefined)?'':this.BaseParm["Pond"];

            return Factory + "_" + PondArea + "_" + Pond;
        },
        cardData2(){
            var mycardData = {};
            mycardData.water = (this.suggData?.WaterQuality)?this.suggData.WaterQuality:[];
            mycardData.observation = (this.suggData?.Observation)?this.suggData.Observation:[];
            mycardData.sugar = (this.suggData?.Material['SugarTotal'])?this.suggData.Material['SugarTotal']:0;
            mycardData.nextFeed = (this.suggData?.Feed?.FeedingPlan)?this.suggData.Feed.FeedingPlan:[];
            mycardData.lime = (this.suggData?.Material['Lime'])?this.suggData.Material['Lime']:0;
            mycardData.adg = (this.suggData?.DynamicData['ADG'])?this.suggData.DynamicData['ADG']:0;
            mycardData.observationFeed = (this.suggData?.DynamicData['FeedAmountInObservation'])?this.suggData.DynamicData['FeedAmountInObservation']:0;
            mycardData.biomass = (this.suggData?.DynamicData['Biomass'])?this.suggData.DynamicData['Biomass']:0;
            mycardData.weight = this.suggData?.DynamicData['WeightFeedRate'];
            mycardData.survival = this.suggData?.DynamicData['SurvivalRate'];
            return mycardData;
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
    },
}
</script>

<style lang="scss" scoped>
.v-application.v-application--is-ltr {
    .v-card.kb {
        * {
            color: $color-dark;
        }
        button.v-icon {
            color: $color-primary;
        }
        .content {
            padding-top: 0;
            padding-bottom: 2px;
            .search {
                margin-top: -4px;
            }
            .row {
                .tag {
                    font-size: 0.85rem;
                    margin-right: 8px;
                    text-decoration: underline;
                    color: $color-primary;
                }
            }
            .result > .row {
                align-items: flex-start;
            }
        }
        .v-card.result-card {
            background-color: $color-lighten;
            box-shadow: 0px 0px 10px 0px $color-black-10;
            margin: 0 2px;
            .theme--light.v-card {
                background-color: $color-lighten;
            }
            .card-title {
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
                    //border-bottom: 1px solid rgba(0,0,0,0.1);
                    .v-icon.v-icon {
                        font-size: 1.1rem;
                    }
                    .theme--light.v-icon {
                        color: $color-primary;
                    }
                    .v-card__title {
                        color: $color-primary;
                        font-size: 1.1rem;
                        padding: 8px;
                    }
                }
                .btn-groups {
                    width: 100%;
                    @include flexCenterEnd();
                    // border-bottom: 1px solid rgba(0,0,0,0.1);
                    padding: 8px;
                    button {
                        &.btn-icon.just-icon {
                            .theme--light.v-icon {
                                font-size: 1.2rem;
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
                    & > .col-12,& > .col-6,& > .col-md-7,& > .col-md-5 {
                        padding: 0;
                    }
                    & > .col-12 {
                        & > span {
                            @include flexAlignCenter();
                        }
                    }
                    &.item {
                        & >.col-12 {
                            padding: 0;
                        }
                        & > .col-md-6,& > .col-md-8,& > .col-sm-8 {
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
                .alertOpen {
                    .v-icon.v-icon {
                        color: $color-primary;
                    }
                } 
                // panels
                .theme--light.v-expansion-panels .v-expansion-panel {
                    background-color: transparent;
                }
                .theme--light.v-expansion-panels .v-expansion-panel-header {
                    background-color: $color-primary-25;
                    font-weight: bold;
                    padding: 12px 8px !important;
                    .v-expansion-panel-header__icon .v-icon {
                        color: $color-dark;
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
                .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
                    background: transparent;
                }
                .suggestion-text {
                    color: $color-accent;
                    font-weight: bold;
                }
                
            }
        }
        
    }
    
}
::v-deep {
    .result {
        .v-card.result-card {
            .content {
                .v-expansion-panel-content__wrap {
                    padding: 0 0 16px;
                }
                .theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
                    background-color: transparent;
                }
                .v-text-field.v-input--dense:not(.v-text-field--outlined) input {
                    padding: 0px 4px 2px;
                }
                .v-text-field .v-input__append-inner {
                    font-size: 14px;
                }
                // 累計+按鈕
                .v-text-field.sum-field {
                    @include flexAlignCenter();
                }   
                .v-text-field.sum-field .v-input__control {
                    // margin-left: 32px;   
                    
                }
                .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
                    padding: 0 4px;
                }
                .v-icon.v-icon.v-icon--link.mdi-plus {
                    @include size(20px);
                    font-size: 14px;
                    background-color: $color-primary;
                    border-radius: 50%;
                    color: #fff;
                    margin-top: 2px;
                }
                .v-badge__badge {
                    height: 14px;
                    min-width: 14px;
                }

                .v-data-table--fixed-header > .v-data-table__wrapper {
                    border-radius: 4px;
                    overflow-x: hidden;
                }

                .input-chips {
                    max-height: 48px;
                    overflow-y: scroll;
                    border-bottom: 1px solid rgba(0,0,0,0.4);
                    cursor: pointer;
                    .v-chip.v-size--default {
                        cursor: pointer;
                        font-size: 12px;
                        height: 20px;
                        padding: 0 8px;
                        background: rgba($color-dark-50,0.8);
                        color: #fff;
                    }
                    .v-chip.chips-value.v-size--default {
                        background: $color-primary-75;
                        // background: rgba($color-accent,0.35);
                        // color: $color-dark;
                    }
                }
            }
        }
        .v-card.result-card.ai-suggestion {
            .content {
                // disable
                .theme--light.v-text-field.v-input--is-disabled .v-input__slot::before {
                    border-image: none;
                    border-color: $color-black-10;
                }
                .theme--light.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea {
                    color: $color-dark;
                }
            }
            #aiwater,#ainet,#aiwatermin {
                .v-data-table > .v-data-table__wrapper > table > tbody > tr {
                    // border-bottom: 1px solid rgba(0,0,0,0.1);
                    box-shadow: 0 0.5px 0 $color-black-10;
                }
            }
        }
    
    }
  // dialog
    .v-dialog {
        .v-sheet.v-card.custom-dialog .v-textarea.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
            border: 1px solid $color-black-10;
            border-radius: 4px;
            padding: 0 8px;
        }
        .v-card__title.add-title {
            color: $color-dark;
            font-weight: bold;
            border-bottom: 1px solid $color-black-10;
            font-size: 1.1rem;
        }
        .dialog-text {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            padding: 8px 16px;
            border-bottom:1px solid $color-black-10;
            font-size: 16px;
            span {
                font-size: 14px;
                margin-top: 8px;
                min-height: 40px;
            }
            // 顏色輸入
            .el-input-number__decrease,
            .el-input-number__increase {
                margin-top: 0;
                min-height: inherit;
            }
            .el-input-number--mini {
                width: initial;
                max-width: 130px;
            }
        }
        .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
            padding: 0;
            padding: 0;
        }
    }
}
.v-expansion-panel-content>>> .v-expansion-panel-content__wrap {
    padding: 0 !important;
}
.circle {
    @include size(20px);
    border-radius: 50%;
    background-color: $color-accent;
    position: relative;
    margin-right: 4px;
    span {
        color: #fff !important;
        @include positionCenter();
        font-size: 12px;
    }
}
.nonItem {
    background-color: rgba($color-dark-25,0.5);
}
#params,#ai {
    padding-top: 4px;
    padding-right: 8px;
    padding-left: 0;
}
#ai {
    padding-right: 12px;
}
.record-title {
    font-size: 14px;
    background-color:#E6B8BE;
    font-weight: bold;
    display:block;
    margin-bottom:8px;
    border-radius:4px 4px 0 0;
    padding-left: 4px;
    margin-right: 4px;
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
        }
    }
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