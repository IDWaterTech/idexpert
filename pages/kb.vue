<template>
    <div>
        <div class="my-2">
            <v-row align="center" class="text-center subtitle-1">
                <!-- A池 -->
                <v-col cols="12" md="2">
                    <v-btn class="px-2 black--text" color="purple accent-1" :disabled="!((BaseParm['Factory'] + BaseParm['PondArea']+ BaseParm['Pond']) == pondNameLst['1'] && (this.$auth.$state.user != null) )" dark large min-width="100" @click="postParm(true)">A池<br/>儲存並查詢</v-btn>
                    <v-btn class="px-2" color="purple accent-1" large min-width="100" @click="setParm('a')">A池參數</v-btn>
                    <!-- <span class="white--text">gg{{ querrySelectedLst['1']  }}</span> -->
                    <v-autocomplete
                        :label="(this.$auth.$state.user == null) ? '帶入儲存參數(登入後使用)' : '帶入儲存參數'"
                        v-model="querrySelectedLst['1']"
                        :items="querryDataLst['1']"
                        item-value="created_time"
                        dense filled
                        hide-details
                        @mousedown="getQuerry2('1')"
                        @change="importQuerry2('1')"
                        clearable solo
                        class="mt-1"
                        :disabled="this.$auth.$state.user == null"
                    >
                        <template slot="item" slot-scope="data">({{data.item.id}})-{{ (data.item.input_data.BaseParm.InspectedDate)?data.item.input_data.BaseParm.InspectedDate.substring(5,10).replace('-','/') :'' }}-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                        <template slot="selection" slot-scope="data">({{data.item.id}})-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                        <template slot="append">
                            <v-icon :disabled="!this.querrySelectedLst['1']" color="red" @click="delQuerry('1')" title="刪除">mdi-delete</v-icon>
                            <v-icon :disabled="!this.querrySelectedLst['1']" color="green" @click="patchQuerry('1')" title="覆蓋">mdi-pen</v-icon>
                        </template>
                    </v-autocomplete>
                </v-col>
                <!-- B池 -->
                <v-col cols="12" md="2">
                        <v-btn class="px-2 black--text" color="purple accent-1" :disabled="!((BaseParm['Factory'] + BaseParm['PondArea'] + BaseParm['Pond']) == pondNameLst['2'] && (this.$auth.$state.user != null) )" dark large min-width="100" @click="postParm(true)">B池<br/>儲存並查詢</v-btn>
                        <v-btn class="px-2" color="purple accent-1" large min-width="100" @click="setParm('b')">B池參數</v-btn>
                        <v-autocomplete
                            :label="(this.$auth.$state.user == null) ? '帶入儲存參數(登入後使用)' : '帶入儲存參數'"
                            v-model="querrySelectedLst['2']"
                            :items="querryDataLst['2']"
                            item-value="created_time"
                            dense filled
                            hide-details
                            @mousedown="getQuerry2('2')"
                            @change="importQuerry2('2')"
                            clearable solo
                            class="mt-1"
                            :disabled="this.$auth.$state.user == null"
                        >
                        <template slot="item" slot-scope="data">({{data.item.id}})-{{ (data.item.input_data.BaseParm.InspectedDate)?data.item.input_data.BaseParm.InspectedDate.substring(5,10).replace('-','/') :'' }}-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                        <template slot="selection" slot-scope="data">({{data.item.id}})-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                        <template slot="append">
                                <v-icon :disabled="!this.querrySelectedLst['2']" color="red" @click="delQuerry('2')" title="刪除">mdi-delete</v-icon>
                                <v-icon :disabled="!this.querrySelectedLst['2']" color="green" @click="patchQuerry('2')" title="覆蓋">mdi-pen</v-icon>
                            </template>
                        </v-autocomplete>
                    </v-col>
                <!-- 中間項目 -->
                    <v-col cols="12" md="3">
                        <div class="white--text display-1" v-text="ShowPoolName"></div>
                        <V-btn class="px-2 subtitle-1" color="orange lighten-1" style="border:1px white solid !important;" large @click="postParm()">查詢</V-btn>
                        <V-btn class="px-2 subtitle-1" color="orange lighten-1" style="border:1px white solid !important;" large @click="resetParm()">重設</V-btn>
                    </v-col>
                 <!-- C池 -->
                <v-col cols="12" md="2">
                        <v-btn class="px-2 black--text" color="purple accent-1" :disabled="!((BaseParm['Factory'] + BaseParm['PondArea'] + BaseParm['Pond']) == pondNameLst['3'] && (this.$auth.$state.user != null))" dark large min-width="100" @click="postParm(true)">C池<br/>儲存並查詢</v-btn>
                        <v-btn class="px-2" color="purple accent-1" large min-width="100" @click="setParm('c')">C池參數</v-btn>
                        <v-autocomplete
                            :label="(this.$auth.$state.user == null) ? '帶入儲存參數(登入後使用)' : '帶入儲存參數'"
                            v-model="querrySelectedLst['3']"
                            :items="querryDataLst['3']"
                            item-value="created_time"
                            dense filled
                            hide-details
                            @mousedown="getQuerry2('3')"
                            @change="importQuerry2('3')"
                            clearable solo
                            class="mt-1"
                            :disabled="this.$auth.$state.user == null"
                        >
                        <template slot="item" slot-scope="data">({{data.item.id}})-{{ (data.item.input_data.BaseParm.InspectedDate)?data.item.input_data.BaseParm.InspectedDate.substring(5,10).replace('-','/') :'' }}-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                        <template slot="selection" slot-scope="data">({{data.item.id}})-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                        <template slot="append">
                                <v-icon :disabled="!this.querrySelectedLst['3']" color="red" @click="delQuerry('3')" title="刪除">mdi-delete</v-icon>
                                <v-icon :disabled="!this.querrySelectedLst['3']" color="green" @click="patchQuerry('3')" title="覆蓋">mdi-pen</v-icon>
                        </template>
                        </v-autocomplete>
                    </v-col>
                <!-- D池 -->
                <v-col cols="12" md="2">
                    <v-btn class="px-2 black--text" color="purple accent-1" :disabled="!((BaseParm['Factory'] + BaseParm['PondArea']+ BaseParm['Pond']) == pondNameLst['4'] && (this.$auth.$state.user != null) )" dark large min-width="100" @click="postParm(true)">D池<br/>儲存並查詢</v-btn>
                    <v-btn class="px-2" color="purple accent-1" large min-width="100" @click="setParm('d')">D池參數</v-btn>
                    <v-autocomplete
                        :label="(this.$auth.$state.user == null) ? '帶入儲存參數(登入後使用)' : '帶入儲存參數'"
                        v-model="querrySelectedLst['4']"
                        :items="querryDataLst['4']"
                        item-value="created_time"
                        dense filled
                        hide-details
                        @mousedown="getQuerry2('4')"
                        @change="importQuerry2('4')"
                        clearable solo
                        class="mt-1"
                        :disabled="this.$auth.$state.user == null"
                    >
                    <template slot="item" slot-scope="data">({{data.item.id}})-{{ (data.item.input_data.BaseParm.InspectedDate)?data.item.input_data.BaseParm.InspectedDate.substring(5,10).replace('-','/') :'' }}-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                    <template slot="selection" slot-scope="data">({{data.item.id}})-{{ data.item.input_data.BaseParm.InspectedTime }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                    <template slot="append">
                            <v-icon :disabled="!this.querrySelectedLst['4']" color="red" @click="delQuerry('4')" title="刪除">mdi-delete</v-icon>
                            <v-icon :disabled="!this.querrySelectedLst['4']" color="green" @click="patchQuerry('4')" title="覆蓋">mdi-pen</v-icon>
                    </template>
                    </v-autocomplete>
                </v-col>
                <!-- 其他 -->
                <v-col cols="12" md="1">
                    <v-icon @click="expandPanel(true)" title="展開" dark>mdi-view-dashboard</v-icon>
                    <v-icon @click="expandPanel(false)" title="收縮" dark>mdi-view-stream</v-icon>
                </v-col>
            </v-row>
           
            
            
            
            
        </div>
        <v-row>
            <!-- 第一層 -->
            <v-col cols="12">
                <!-- 藍 -->
                <v-row>
                    <!-- 第1排 -->
                    <v-col cols="12" md="3" class="px-2">
                        <v-row dense>
                            <v-col cols="12" class="pa-0">
                                <v-expansion-panels accordion multiple v-model="panel.panel_row11">
                                    <v-expansion-panel>
                                        <v-expansion-panel-header color="#BBDEFB" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">養殖基本數據</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="BaseParm">
                                                        <v-text-field v-model="BaseParm['Factory']" disabled dense hide-details class="mt-0 blue lighten-5"><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">養殖場</span></v-text-field>
                                                        <v-text-field v-model="BaseParm['PondArea']" disabled dense hide-details class="mt-0 blue lighten-5"><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">養殖區域</span></v-text-field>
                                                        <v-text-field v-model="BaseParm['Pond']" disabled dense hide-details class="mt-0 blue lighten-3"><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">養殖池</span></v-text-field>
                                                        <v-menu v-model="menu_inspecteddate" :close-on-content-click="false" :nudge-right="40"
                                                            transition="scale-transition" offset-y min-width="auto">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="BaseParm['InspectedDate']" class="mt-0 blue lighten-1" dark clearable readonly dense hide-details 
                                                                    v-bind="attrs" v-on="on"><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">資料日期<v-icon @click="() => (BaseParm['InspectedDate'] = getNowDate())">mdi-calendar</v-icon></span></v-text-field>
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
                                                            @click:prepend="() => (BaseParm['InspectedTime'] = getNowTime())"
                                                            ><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">資料時間<v-icon @click="() => (BaseParm['InspectedTime'] = getNowTime())">mdi-timeline-clock-outline</v-icon></span></v-text-field>

                                                        <v-text-field v-if="false" v-model="BaseParm['Shape']" dense hide-details class="mt-0 blue lighten-3"><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">水池型狀</span></v-text-field>
                                                        <v-select v-model="BaseParm['Shape']" clearable :items="optData.Shape" filled dense hide-details class="mt-0 blue lighten-3" item-value="name_en" item-text="name_ch"><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">水池形狀</span></v-select>

                                                        <v-text-field v-if="false" v-model="BaseParm['StartedDate']" dense hide-details class="mt-0 blue lighten-1" dark><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">養殖起始日</span></v-text-field>
                                                        <v-menu v-model="menu_startdate" :close-on-content-click="false" :nudge-right="40"
                                                            transition="scale-transition" offset-y min-width="auto">
                                                            <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field v-model="BaseParm['StartedDate']" class="mt-0 blue lighten-1" dark clearable readonly dense hide-details
                                                                v-bind="attrs" v-on="on"><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">養殖起始日</span></v-text-field>
                                                            </template>
                                                            <v-date-picker v-model="BaseParm['StartedDate']" locale="zh-tw" no-title @input="
                                                            menu_startdate = false;
                                                            "></v-date-picker>
                                                        </v-menu>
                                                        <v-text-field v-if="false" v-model="BaseParm['WaterSource']" dense hide-details class="mt-0 blue lighten-1" dark><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">水源</span></v-text-field>
                                                        <v-select v-model="BaseParm['WaterSource']" clearable :items="optData.WaterSource" filled dense hide-details class="mt-0 blue lighten-1" dark item-value="name_en" item-text="name_ch"><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">水源</span></v-select>

                                                        <v-text-field v-model.number="BaseParm['WaterSourceSalinity']" dense hide-details class="mt-0 blue white--text" dark><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">鹽度(ppt)</span></v-text-field>
                                                        <v-text-field v-model.number="BaseParm['WaterBody']" dense hide-details class="mt-0 blue white--text" dark><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">水體體積(m3)</span></v-text-field>
                                                        <v-text-field v-model.number="BaseParm['Density']" dense hide-details class="mt-0 blue darken-1 white--text" dark><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">放養密度(隻/噸水)</span></v-text-field>
                                                        <v-text-field v-model.number="BaseParm['Days']" dense hide-details class="mt-0 blue darken-1 white--text" dark><span style="width:150px;" class="pa-0 ma-0 text-center" slot="prepend">養殖天數</span></v-text-field>
                                                    </v-form>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!-- 第2排 -->
                    <v-col cols="12" md="3" class="px-2">
                        <v-row dense>
                            <v-col cols="12" class="pa-0">
                                <v-expansion-panels accordion multiple v-model="panel.panel_row12">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#BBDEFB" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">養殖參數</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content>
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="BreedingParm">
                                                        <v-text-field v-model.number="BreedingParm['CN']" dense hide-details class="mt-0 blue lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">目標CN比</span></v-text-field>
                                                        <v-text-field v-model.number="BreedingParm['EstimatedFCR']" dense hide-details class="mt-0 blue lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">預測FCR</span></v-text-field>
                                                        <v-text-field v-model.number="BreedingParm['EstimatedADG']" dense hide-details class="mt-0 blue lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">預測ADG</span></v-text-field>
                                                        <v-text-field v-model.number="BreedingParm['InitialLength']" dense hide-details class="mt-0 blue lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">放養初始長度(cm)</span></v-text-field>
                                                        <v-text-field v-model.number="BreedingParm['EstimatedSurvivalRate']" dense hide-details class="mt-0 blue lighten-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">預估存活率(%)</span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue lighten-1" dark disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue white--text" dark disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue white--text" dark disabled><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue darken-1 white--text" dark disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue darken-1 white--text" dark disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                    </v-form>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                          
                        </v-row>
                    </v-col>
                    <!-- 第3排 -->
                    <v-col cols="12" md="3" class="px-2">
                        <v-row dense>
                            <v-col cols="12" class="pa-0">
                                <v-expansion-panels accordion multiple v-model="panel.panel_row13">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#BBDEFB" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">飼料參數</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content>
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="FeedParm">
                                                        <v-text-field v-model="FeedParm['Brand']" dense hide-details class="mt-0 blue lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">廠牌</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['Price']" dense hide-details class="mt-0 blue lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">價格(10KG/包)(元)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['CrudeProteinPct']" dense hide-details class="mt-0 blue lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">粗蛋白含量(%)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['Nitrogen']" dense hide-details class="mt-0 blue lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">含氮量(%)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['SugarSourcePurity']" dense hide-details class="mt-0 blue lighten-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖(碳源)純度(%)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['SugarSourceCarbonPct']" dense hide-details class="mt-0 blue lighten-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖(碳源)含碳量(%)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['FeedCN']" dense hide-details class="mt-0 blue white--text" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">飼料CN比(依照飼料)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['LastFeedInput']" dense hide-details class="mt-0 blue white--text" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">前一餐飼料量(kg)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['CumulativeFeedAmountInput']" dense hide-details class="mt-0 blue darken-1 white--text" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">累計飼料量(kg)<v-btn class="ml-2" fab x-small color="cyan" @click="addFeedQty"> <v-icon>mdi-plus</v-icon></v-btn></span></v-text-field>
                                                        <v-select v-model="BaseParm['NextFeedIncrementPct']" clearable :items="optData.NextFeedIncrementPct" filled dense hide-details class="mt-0 blue darken-1" dark item-value="name_en" item-text="name_ch"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">下餐飼料增加百分比</span></v-select>
                                                    </v-form>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!-- 第4排 -->
                    <v-col cols="12" md="3" class="px-2">
                        <v-row dense>
                            <v-col cols="12" class="pa-0">
                                <v-expansion-panels accordion multiple v-model="panel.panel_row14">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#BBDEFB" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">做水期參數</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content>
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="MakeWaterParm">
                                                        <!-- <v-text-field v-model.number="MakeWaterParm['Urea']" dense hide-details class="mt-0 blue lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">尿素(g)</span></v-text-field> -->
                                                        <v-text-field v-model.number="MakeWaterParm['UreaEffectiveConcentration']" dense hide-details class="mt-0 blue lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">尿素有效濃度(%)</span></v-text-field>
                                                        <v-text-field v-model.number="MakeWaterParm['BleachingPowderEffectiveConcentration']" dense hide-details class="mt-0 blue lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">漂白粉有效濃度(%)</span></v-text-field>
                                                        <v-text-field v-model.number="MakeWaterParm['Chlorine']" dense hide-details class="mt-0 blue lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">水體餘氯(ppm)</span></v-text-field>
                                                        <v-text-field v-model.number="MakeWaterParm['HypoEffectiveConcentration']" dense hide-details class="mt-0 blue lighten-3" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">海波有效濃度(%)</span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue lighten-1" dark disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue lighten-1 white--text" dark disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue white--text" dark disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue darken-1 white--text" readonly disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue darken-1 white--text" readonly disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                    </v-form>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
            <!-- 第二層 -->
            <v-col cols="12">
                <v-row>
                    <!-- 第1排 -->
                    <v-col cols="12" md="9" class="px-2">
                        <v-row dense>
                            <!-- 黃1 -->
                            <v-col cols="12" md="4" class="pa-0 pr-1">
                                <v-expansion-panels accordion multiple v-model="panel.panel_row21">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#FFFDE7" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">水質資訊</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="WaterQualityData">
                                                        <v-text-field v-model.number="WaterQualityData['Do']" dense hide-details class="mt-0 yellow lighten-5" @blur="valueCheck('Do',WaterQualityData['Do'])"><span style="width:140px;" class="pa-0 ma-0 text-center" slot="prepend">溶氧Do(ppm)<v-badge title="紅：危險值，橘：警告值，綠：正常值" class="mx-1 ml-2" inline :color="lightColor['Do']"></v-badge></span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['pH']" dense hide-details class="mt-0 yellow lighten-5" @blur="valueCheck('pH',WaterQualityData['pH'])"><span style="width:140px;" class="pa-0 ma-0 text-center" slot="prepend">酸鹼值(pH)<v-badge title="紅：危險值，橘：警告值，綠：正常值" class="mx-1 ml-5" inline :color="lightColor['pH']"></v-badge></span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['Temp']" dense hide-details class="mt-0 yellow lighten-3" @blur="valueCheck('Temp',WaterQualityData['Temp'])"><span style="width:140px;" class="pa-0 ma-0 text-center" slot="prepend">水溫(°C)<v-badge title="紅：危險值，橘：警告值，綠：正常值" class="mx-1 ml-10" inline :color="lightColor['Temp']"></v-badge></span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['Salinity']" dense hide-details class="mt-0 yellow lighten-3" @blur="valueCheck('Salinity',WaterQualityData['Salinity'])"><span style="width:140px;" class="pa-0 ma-0 text-center" slot="prepend">鹽度(ppt)<v-badge title="紅：危險值，橘：警告值，綠：正常值" class="mx-1 ml-8" inline :color="lightColor['Salinity']"></v-badge></span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['AmmoniaN']" dense hide-details class="mt-0 yellow lighten-1" @blur="valueCheck('AmmoniaN',WaterQualityData['AmmoniaN'])"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">氨氮NH3/NH4+(ppm)<v-badge title="紅：危險值，橘：警告值，綠：正常值" class="mx-1 ml-2" inline :color="lightColor['AmmoniaN']"></v-badge></span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['NO2']" dense hide-details class="mt-0 yellow lighten-1" @blur="valueCheck('NO2',WaterQualityData['NO2'])"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">亞硝酸鹽NO2-(ppm)<v-badge title="紅：危險值，橘：警告值，綠：正常值" class="mx-1 ml-5" inline :color="lightColor['NO2']"></v-badge></span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['Mg']" dense hide-details class="mt-0 yellow" @blur="valueCheck('Mg',WaterQualityData['Mg'])"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">鎂離子Mg2+(ppm)<v-badge title="紅：危險值，橘：警告值，綠：正常值" class="mx-1 ml-7" inline :color="lightColor['Mg']"></v-badge></span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['Ca']" dense hide-details class="mt-0 yellow" @blur="valueCheck('Ca',WaterQualityData['Ca'])"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">鈣離子Ca2+(ppm)<v-badge title="紅：危險值，橘：警告值，綠：正常值" class="mx-1 ml-8" inline :color="lightColor['Ca']"></v-badge></span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['Alk']" dense hide-details class="mt-0 yellow darken-1" @blur="valueCheck('Alk',WaterQualityData['Alk'])"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">鹼度Alk(ppm)<v-badge title="紅：危險值，橘：警告值，綠：正常值" class="mx-1 ml-16" inline :color="lightColor['Alk']"></v-badge></span></v-text-field>
                                                        <v-text-field v-if="false"  dense hide-details class="mt-0 yellow darken-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">水的顏色</span></v-text-field>
                                                        <v-select v-model="WaterQualityData['WaterColor']" clearable :items="optData.WaterColor" filled dense hide-details class="mt-0 yellow darken-1" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">水的顏色</span></v-select>
                                                    </v-form>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                            <!-- 黃2 -->
                            <v-col cols="12" md="4" class="pa-0 px-1">
                                <v-expansion-panels accordion multiple v-model="panel.panel_row22">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#FFFDE7" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">觀察網資訊</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="ObservationData">
                                                        <v-text-field v-if="false" v-model.number="ObservationData['IsMoultingPeriod']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否為脫殼期</span></v-text-field>
                                                        <v-select v-model="ObservationData['IsMoultingPeriod']" clearable :items="optData.IsMoultingPeriod" filled dense hide-details class="mt-0 yellow lighten-5" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否為脫殼期</span></v-select>

                                                        <v-text-field v-if="false" v-model="ObservationData['IntestinalColor']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">腸線顏色</span></v-text-field>
                                                        <v-select v-model="ObservationData['IntestinalColor']" clearable :items="optData.IntestinalColor" filled dense hide-details class="mt-0 yellow lighten-5" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">腸線顏色</span></v-select>

                                                        <v-text-field v-if="false" v-model="ObservationData['HepatopancreasColor']" dense hide-details class="mt-0 yellow lighten-3"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">肝胰臟顏色</span></v-text-field>
                                                        <v-select v-model="ObservationData['HepatopancreasColor']" clearable :items="optData.HepatopancreasColor" filled dense hide-details class="mt-0 yellow lighten-3" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">肝胰臟顏色</span></v-select>

                                                        <v-text-field v-if="false" v-model="ObservationData['MuscleColor']" dense hide-details class="mt-0 yellow lighten-3"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">肌肉顏色</span></v-text-field>
                                                        <v-select v-model="ObservationData['MuscleColor']" clearable :items="optData.MuscleColor" filled dense hide-details class="mt-0 yellow lighten-3" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">肌肉顏色</span></v-select>

                                                        <v-text-field v-if="false" v-model="ObservationData['BodyIllnessLocation']" dense hide-details class="mt-0 yellow lighten-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">軀體異色位置</span></v-text-field>
                                                        <v-select v-model="ObservationData['BodyIllnessLocation']" clearable :items="optData.BodyIllnessLocation" filled dense hide-details class="mt-0 yellow lighten-1" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">軀體異色位置</span></v-select>

                                                        <v-text-field v-if="false" v-model="ObservationData['Moulting']" dense hide-details class="mt-0 yellow lighten-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">蝦殼狀況</span></v-text-field>
                                                        <v-select v-model="ObservationData['Moulting']" clearable :items="optData.Moulting" filled dense hide-details class="mt-0 yellow lighten-1" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">蝦殼狀況</span></v-select>

                                                        <v-text-field v-model.number="ObservationData['LeftoverRate']" dense hide-details class="mt-0 yellow darken-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">觀察網殘餌量(%)</span></v-text-field>
                                                        <v-text-field v-model.number="ObservationData['DeadShrimpQty']" dense hide-details class="mt-0 yellow darken-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">死蝦數量</span></v-text-field>
                                                        <v-text-field v-model.number="ObservationData['ShrimpLength']" dense hide-details class="mt-0 yellow darken-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">蝦子長度(cm)</span></v-text-field>
                                                        <!-- <v-text-field v-model.number="ObservationData['ObsFeed']" dense hide-details class="mt-0 yellow darken-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">觀察網投餌量(g)</span></v-text-field> -->
                                                    </v-form>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                            <!-- 黃3 -->
                            <v-col cols="12" md="4" class="pa-0 pl-1">
                                <v-expansion-panels accordion multiple v-model="panel.panel_row23">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#FFFDE7" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">水中菌相資訊</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="BacteriaData">
                                                        <v-text-field v-model.number="BacteriaData['Biofloc']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">生物絮團(ml)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['TotalPlateCount']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">總菌(CFU)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['BacillusSubtilis']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">枯草桿菌(CFU)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['VibrioAlginolyticus']" dense hide-details class="mt-0 yellow lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">溶藻弧菌(白)(CFU)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['VibrioVulnificus']" dense hide-details class="mt-0 yellow lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">創傷弧菌(藍)(CFU)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['VibrioEnteritidis']" dense hide-details class="mt-0 yellow lighten-1"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">腸炎弧菌(紫)(CFU)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['VibrioCholerae']" dense hide-details class="mt-0 yellow lighten-1"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">霍亂弧菌(靛)(CFU)</span></v-text-field>
                                                        <v-text-field v-if="false" v-model.number="BacteriaData['IsEMSInfected']" dense hide-details class="mt-0 yellow"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">是否EMS感染</span></v-text-field>
                                                        <v-select v-model="BacteriaData['IsEMSInfected']" clearable :items="optData.IsEMSInfected" filled dense hide-details class="mt-0 yellow" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否EMS感染</span></v-select>

                                                        <v-text-field v-if="false" v-model.number="BacteriaData['IsEHPInfected']" dense hide-details class="mt-0 yellow"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">是否EHP感染</span></v-text-field>
                                                        <v-select v-model="BacteriaData['IsEHPInfected']" clearable :items="optData.IsEHPInfected" filled dense hide-details class="mt-0 yellow" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否EHP感染</span></v-select>

                                                        <v-text-field v-if="false" v-model.number="BacteriaData['IsVirusInfected']" dense hide-details class="mt-0 yellow darken-1"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">是否病毒性感染</span></v-text-field>
                                                        <v-select v-model="BacteriaData['IsVirusInfected']" clearable :items="optData.IsVirusInfected" filled dense hide-details class="mt-0 yellow darken-1" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否病毒性感染</span></v-select>

                                                        <v-text-field v-if="false" v-model.number="BacteriaData['IsBacteriumInfected']" dense hide-details class="mt-0 yellow darken-1"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">是否細菌性感染</span></v-text-field>
                                                        <v-select v-model="BacteriaData['IsBacteriumInfected']" clearable :items="optData.IsBacteriumInfected" filled dense hide-details class="mt-0 yellow darken-1" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否細菌性感染</span></v-select>

                                                    </v-form>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!-- 第2排 output-->
                    <v-col cols="12" md="3" class="px-2">
                        <v-row dense>
                            <!-- 紅1 -->
                            <v-col cols="12" class="pa-0">
                                <v-expansion-panels accordion multiple v-model="panel.panel_row24">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#ffe0b2" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">動態數據資訊</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#FFF3E0">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-text-field v-model="suggData.DynamicData['FCR']" dense hide-details class="mt-0 orange lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend"  title="累計飼料量、蝦子長度、水體體積、放養密度">FCR(換肉率)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['ADG']" dense hide-details class="mt-0 orange lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="蝦子長度、養殖天數、養殖起始日">ADG(每日增重量)(g/day)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['BiomassOfShrimp']" dense hide-details class="mt-0 orange lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算內存量，因為需要每日體重投餌率">內存量(累積料量)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['SurvivalRate']" dense hide-details class="mt-0 orange lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，才能計算存活率，因為需要內存量">存活率(%)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['EstimatedFeedTotal']" dense hide-details class="mt-0 orange lighten-1" dark><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="尚無法計算">預估所需飼料量(g)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['EstimatedProduction']" dense hide-details class="mt-0 orange lighten-1" dark><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="尚無法計算">預估產量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['EstimatedCatchingDate']" dense hide-details class="mt-0 orange" dark><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="養殖起始日">預計間補日期</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['EstimatedCatchingAmount']" dense hide-details class="mt-0 orange" dark><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="尚無法計算">預計間補量</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['FeedAmountInObservation']" dense hide-details class="mt-0 orange darken-1" dark><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="蝦子長度、水體體積、放養密度、前一餐飼料量、觀察網殘餌量 # 蝦長 >= 2.5cm，小蝦不會用觀察網">觀察網網上料量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['WeightFeedRate']" dense hide-details class="mt-0 orange darken-1" dark><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="蝦子長度">每日體重投餌率(%)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['ShrimpWeight']" dense hide-details class="mt-0 orange darken-1" dark><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="蝦子長度">蝦子重量(g)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['Drain']" dense hide-details class="mt-0 orange darken-1" dark><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="尚無法計算">排汙量(噸)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['CumulativeDrainAmount']" dense hide-details class="mt-0 orange darken-1" dark><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend" title="尚無法計算">累計排汙量(噸)</span></v-text-field>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                           
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
            <!-- 第三層 -->
            <v-col cols="12">
                <v-row>
                    <!-- 第1排 -->
                    <v-col cols="12" md="9" class="px-2">
                        <v-row dense>
                            <v-col cols="12" md="12" class="pa-0">
                                <v-expansion-panels accordion multiple v-model="panel.panel_row31">
                                    <!-- 綠1 -->
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="teal" class="pa-3 font-weight-black white--text" style="min-height: 20px;" expand-icon="mdi-menu-down">AI 養殖建議 - 水質</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-simple-table fixed-header dense height="200px" class="teal lighten-5">
                                                        <template v-slot:default>
                                                            <thead>
                                                                <tr>
                                                                <th class="text-center teal lighten-4">
                                                                    狀態作動
                                                                </th>
                                                                <th class="text-center teal lighten-4">
                                                                    可能影響原因
                                                                </th>
                                                                <th class="text-center teal lighten-4">
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
                                    </v-expansion-panel>
                                    <!-- 綠2 -->
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="teal" class="pa-3 font-weight-black white--text" style="min-height: 20px;" expand-icon="mdi-menu-down">AI 養殖建議 - 觀察網</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-simple-table fixed-header dense height="200px" class="teal lighten-5">
                                                        <template v-slot:default>
                                                            <thead>
                                                                <tr>
                                                                <th class="text-center teal lighten-4">
                                                                    狀態作動
                                                                </th>
                                                                <th class="text-center teal lighten-4">
                                                                    可能影響原因
                                                                </th>
                                                                <th class="text-center teal lighten-4">
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
                                                                <!-- <td v-if="false">{{ item.status }}</td> -->
                                                                <!-- <td v-text="setBR(item.status)"></td> -->
                                                                <!-- <td>{{ setBR(item.status) }}</td> -->
                                                                <td>{{ item.factor }}</td>
                                                                <td>{{ item.result }}</td>
                                                                </tr>
                                                            </tbody>
                                                        </template>
                                                    </v-simple-table>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <!-- 綠3 -->
                                    <v-expansion-panel class="mb-10" >
                                        <v-expansion-panel-header color="teal" class="pa-3 font-weight-black white--text" style="min-height: 20px;" expand-icon="mdi-menu-down">AI 養殖建議 - 投餌量</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#BBDEFB">
                                                <v-card-text class="pa-0 mx-3">
                                                    <div class="red--text text-h5">建議：{{ suggData.Feed.status }}</div>
                                                </v-card-text>
                                                <v-card-text class="pa-0 mx-0">
                                                   <v-row>
                                                    <v-col cols="12">
                                                        <table style="width:100%;border-collapse: collapse; border: none;">
                                                            <thead>
                                                                <tr>
                                                                <th class="text-center teal lighten-4">
                                                                    項目
                                                                </th>
                                                                <th class="text-center teal lighten-4">
                                                                    數值
                                                                </th>
                                                                <th class="text-center teal lighten-4">
                                                                    單位
                                                                </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="lime lighten-5 text-center">
                                                                <tr class="red lighten-4"><td colspan="3">飼料量</td></tr>
                                                                <tr>
                                                                    <td>粉料</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.feed_amount.PowderFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>0號料</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.feed_amount.ZeroFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>1號料</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.feed_amount.OneFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>2號料</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.feed_amount.TwoFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr class="red lighten-4"><td colspan="3">統計表</td></tr>
                                                                <tr>
                                                                    <td>轉0號料第一餐</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.statistics.ZeroFeedFirstMeal"></v-text-field></td>
                                                                    <td></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>前一餐飼料量</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.statistics.LastFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>下一餐飼料量</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.statistics.NextFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>累計飼料量</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.statistics.CumulativeFeedAmount"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <hr/>
                                                        <v-simple-table fixed-header dense height="200px" class="teal lighten-5" v-if="false">
                                                        <template v-slot:default>
                                                            <thead>
                                                                <tr>
                                                                <th class="text-center teal lighten-4">
                                                                    項目
                                                                </th>
                                                                <th class="text-center teal lighten-4">
                                                                    數值
                                                                </th>
                                                                <th class="text-center teal lighten-4">
                                                                    單位
                                                                </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr class="red lighten-4"><td colspan="3">飼料量</td></tr>
                                                                <tr>
                                                                    <td>粉料</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.feed_amount.PowderFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>0號料</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.feed_amount.ZeroFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>1號料</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.feed_amount.OneFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>2號料</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.feed_amount.TwoFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr class="red lighten-4"><td colspan="3">統計表</td></tr>
                                                                <tr>
                                                                    <td>轉0號料第一餐</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.statistics.ZeroFeedFirstMeal"></v-text-field></td>
                                                                    <td></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>前一餐飼料量</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.statistics.LastFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>下一餐飼料量</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.statistics.NextFeed"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>累計飼料量</td>
                                                                    <td><v-text-field dense hide-details filled v-model="suggData.Feed.statistics.CumulativeFeedAmount"></v-text-field></td>
                                                                    <td>kg</td>
                                                                </tr>
                                                            </tbody>
                                                        </template>
                                                    </v-simple-table>
                                                    </v-col>
                                                   </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!-- 第2排 -->
                    <v-col cols="12" md="3" class="px-2">
                        <v-row dense>
                            <!-- 綠1 -->
                            <v-col cols="12" class="pa-0">
                                <v-expansion-panels accordion multiple v-model="panel.panel_row32">
                                    <!-- 綠1 -->
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="teal" class="pa-3 font-weight-black white--text" style="min-height: 20px;" expand-icon="mdi-menu-down">投料判斷列表</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="lime lighten-5">
                                                <v-card-text class="pa-0 mx-0">

                                                    <v-text-field v-model="suggData.Material['LastSugarCN']" dense hide-details class="mt-0 lime lighten-5"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">前餐砂糖量(配合飼料CN比)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarCN']" dense hide-details class="mt-0 lime lighten-5"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">下餐砂糖量 (配合飼料CN比)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarAmmoniaN']" dense hide-details class="mt-0 lime lighten-5"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">砂糖量 (降氨氮)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarNO2']" dense hide-details class="mt-0 lime lighten-5"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">砂糖量 (降亞硝酸)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarBacillusSubtilis']" dense hide-details class="mt-0 lime lighten-5"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">砂糖量 (提高枯草桿菌)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarVibrioEnteritidis']" dense hide-details class="mt-0 lime lighten-5"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">砂糖量 (降紫菌)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarVibrioCholerae']" dense hide-details class="mt-0 lime lighten-5"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">砂糖量 (降靛菌)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarTotal']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">當日總砂糖量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['CumulativeSugarAmount']" dense hide-details class="mt-0 lime lighten-5"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">累計砂糖量(kg)</span></v-text-field>
                                                </v-card-text>
                                                <v-card-text class="pa-0 mx-0 mt-3">
                                                    <v-text-field v-model="suggData.Material['Lime']" dense hide-details class="mt-0 yellow lighten-2"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">熟石灰量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['CumulativeLimeAmount']" dense hide-details class="mt-0 yellow lighten-2"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">累計熟石灰量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['CumulativeBacteriaAmount']" dense hide-details class="mt-0 lime lighten-2"><span style="width:225px;" class="pa-0 ma-0 text-right" slot="prepend">累計菌量(kg)</span></v-text-field>
                                                    
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <!-- 綠2 -->
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="teal" class="pa-3 font-weight-black white--text" style="min-height: 20px;" expand-icon="mdi-menu-down">養殖前期做水添加物</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="lime lighten-5">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-text-field v-model="suggData.MakeWater['SugarMakeWater']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend">砂糖量(做水)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.MakeWater['BleachingPowder']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend">漂白粉(30ppm濃度)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.MakeWater['Hypo']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend">海波(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.MakeWater['Urea']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-right" slot="prepend">尿素(kg)</span></v-text-field>
                                                    <!-- <v-text-field v-model="suggData.MakeWater['SugarMakeWater']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖量 (降紫菌)</span></v-text-field> -->
                                                    <!-- <v-text-field v-model="suggData.MakeWater['SugarMakeWater']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖量 (降靛菌)</span></v-text-field> -->
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

    </div>
</template>

<script>
import nerdamer from 'nerdamer';
import dayjs from "dayjs";
import _ from "lodash";
export default {
    layout: "emptynologin",
    head() {
        return {
            title: '知識庫'
        }
    },
    data() {
        return {
            UserData:{Username:'',IsSaved:false},//使用者相關資訊
            BaseParm:{InspectedTime:'',InspectedDate:''},//養殖基本參數
            BreedingParm:{},//養殖參數
            FeedParm:{},//飼料參數
            MakeWaterParm:{},//做水參數
            WaterQualityData:{},//水質資訊
            ObservationData:{},//觀察網資訊
            BacteriaData:{},//水中菌相資訊
            suggData: { DynamicData: {}, WaterQuality: {}, Observation: {}, Feed: { feed_amount: {}, "statistics": {}, "status": "" }, Material: {}, MakeWater: {} },//ai建議
            optData:{},//選項
            querryData:[],//查詢紀錄
            querryDataLst:{"1":[],"2":[],"3":[],"4":[]},//查詢紀錄lst
            querrySelected:"",
            querrySelectedLst:{"1":"","2":"","3":"","4":""},
            pondNameLst:{1:'研發一場武曲A1',2:'研發一場武曲A3',3:'研發一場紫微3-2',4:'研發一場紫微4-6'},
            panel:{panel_row11:[0],panel_row12:[0],panel_row13:[0],panel_row14:[0],
                   panel_row21:[0],panel_row22:[0],panel_row23:[0],panel_row24:[0],
                   panel_row31:[0,1,2],panel_row32:[0,1]},
            lightColor:{'Do':'teal','pH':'teal','Temp':'teal','Salinity':'teal','AmmoniaN':'teal','NO2':'teal'},
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
                    }
            },
            menu_startdate:false,//養殖起日
            rules: { require: [v => !!v || "*必要項目"] },
            menu_inspecteddate:false,//資料日
        }
    },
    methods: {
        getNowDate: function() {
        let mydate = dayjs().format("YYYY-MM-DD");
        return mydate;
        },
        getNowTime: function() {
        let mytime = dayjs().format("HH:mm");
        return mytime;
        },
        addFeedQty:function(){
            if(typeof(this.FeedParm['LastFeedInput'])=='number'){
                this.FeedParm['CumulativeFeedAmountInput'] =(this.FeedParm['CumulativeFeedAmountInput'] + this.FeedParm['LastFeedInput']).toFixed(3);
            }else{
                return;
            }
        },
        setBR:function(msg){
            var newmsg = _.cloneDeep(msg).replaceAll('。','。</br>');
            if(newmsg.slice(-5)=='</br>'){
                newmsg = newmsg.substring(0,newmsg.length-5);
            }
            return newmsg;
        },
        getlightData:async function(){
            let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/warning-range/`;
            await this.$axios.get(url).then(res => {
                if(res.status==200){
                    this.lightData = res.data;
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
                WaterQuality: [{ id: 1, status: "water正常", factor: "無", result: "無" }],//ai建議-水質
                Observation: [{ id: 1, status: "obs正常", factor: "無", result: "無" },],//ai建議-觀察網
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
                }else{
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }
            })
            .catch(error=>{
                this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            })
            .finally(() => {
                    //ObservationData
                    this.optData.IsMoultingPeriod = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    //BacteriaData
                    this.optData.IsEMSInfected = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    this.optData.IsEHPInfected = [{"name_en":false,"name_ch":"否"},{"name_en":true,"name_ch":"是"}];
                    this.optData.IsVirusInfected = [{ "name_en": false, "name_ch": "否" }, { "name_en": true, "name_ch": "是" }];
                    this.optData.IsBacteriumInfected = [{ "name_en": false, "name_ch": "否" }, { "name_en": true, "name_ch": "是" }];
                });
        },
        getQuerry2:async function(querrypool=1,forceReget=false){
            
            if(this.querryDataLst[querrypool].length>0 && forceReget==false){
                console.log("forceReget",forceReget);
                return;
            }
            let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/`;
            var allParm = {
                IsLast:false,
                Username:(this.$auth.$state.user==null)?"":this.$auth.$state.user.email,
                Factory:this.BaseParm['Factory'],
                PondArea:this.BaseParm['PondArea'],
                Pond:this.BaseParm['Pond']
            };
            switch (querrypool) {
                case "1":
                    allParm.Factory = "研發一場";
                    allParm.PondArea = "武曲";
                    allParm.Pond = "A1";
                    break;
                    case "2":
                    allParm.Factory = "研發一場";
                    allParm.PondArea = "武曲";
                    allParm.Pond = "A3";
                    break;
                    case "3":
                    allParm.Factory = "研發一場";
                    allParm.PondArea = "紫微";
                    allParm.Pond = "3-2";
                    break;
                    case "4":
                    allParm.Factory = "研發一場";
                    allParm.PondArea = "紫微";
                    allParm.Pond = "4-6";
                    break;
                default:
                    console.log("not fund,querrypool is =",querrypool,typeof(querrypool));
                    break;
            }
            if(this.$auth.$state.user==null){
                this.$toast.error(`需重新登入`, { duration: 2000 });
                return;
            }
            await this.$axios.get(url, {params:allParm}).then(res => {
                console.log("query-log API:" + res.request.responseURL);
                if(res.status==200){
                    this.querryDataLst[querrypool] = res.data;
                }
                else if(res.status == 400){
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }
                else{
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }

            }).catch(error => {
                this.$toast.error(`資料Fail:${error}\n${JSON.stringify(error.response.data)}`, { duration: 5000 });
            });
        },
        getQuerry:async function(){
            if(this.querryData.length>0){
                return;
            }
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
        importQuerry2: async function (querrypool = 1) {
            if (this.querrySelectedLst[querrypool] == null) {
                this.resetParm();
                return;
            } else {

                Object.keys(this.querrySelectedLst).forEach(element => {
                    if (querrypool != element) {
                        this.querrySelectedLst[element] = "";
                    }
                });
                console.log("querrySelectedLst['']:", this.querrySelectedLst[querrypool]);
                var input_data = this.querryDataLst[querrypool].filter(x => x.created_time == this.querrySelectedLst[querrypool])[0].input_data;
                console.log("input_data:",input_data);
                this.BaseParm = _.cloneDeep(input_data.BaseParm);
                this.BreedingParm = _.cloneDeep(input_data.BreedingParm);
                this.FeedParm = _.cloneDeep(input_data.FeedParm);
                this.MakeWaterParm = _.cloneDeep(input_data.MakeWaterParm);
                this.WaterQualityData = _.cloneDeep(input_data.WaterQualityData);
                this.ObservationData = _.cloneDeep(input_data.ObservationData);
                this.BacteriaData = _.cloneDeep(input_data.BacteriaData);
                //reset suggData
                var output_data = this.querryDataLst[querrypool].filter(x => x.created_time == this.querrySelectedLst[querrypool])[0].output_data;
                this.suggData = {
                    "DynamicData": output_data.DynamicData,
                    "WaterQuality": output_data.WaterQuality,//ai建議-水質
                    "Observation": output_data.Observation,//ai建議-觀察網
                    "Feed": output_data.Feed,//ai建議-投餌量
                    "Material": output_data.Material,//投料判斷列表
                    "MakeWater": output_data.MakeWater//養殖前期做水添加物
                };
                // this.suggData = {
                //     "DynamicData": {},
                //     "WaterQuality": [],//ai建議-水質
                //     "Observation": [],//ai建議-觀察網
                //     "Feed": { "feed_amount": {}, "statistics": {}, "status": "" },//ai建議-投餌量
                //     "Material": {},//投料判斷列表
                //     "MakeWater": {}//養殖前期做水添加物
                // };
            }
        },
        importQuerry:async function(){
            if(this.querrySelected==null){
                this.resetParm();
                return;
            }else{
                // console.log("querrySelected:",this.querrySelected);
                var input_data = this.querryData.filter(x=>x.created_time==this.querrySelected)[0].input_data;
                this.BaseParm = input_data.BaseParm;
                this.BreedingParm = input_data.BreedingParm;
                this.FeedParm = input_data.FeedParm;
                this.MakeWaterParm = input_data.MakeWaterParm;
                this.WaterQualityData = input_data.WaterQualityData;
                this.ObservationData = input_data.ObservationData;
                this.BacteriaData = input_data.BacteriaData;
            }
            
            return;
        },
        delQuerry:async function(querrypool){
            if(this.querrySelectedLst[querrypool]==null){
                this.resetParm();
                return;
            }else{
                var id = this.querryDataLst[querrypool].filter(x=>x.created_time==this.querrySelectedLst[querrypool])[0].id;
                let url =`${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/${id}/`;
                if(confirm(`是否刪除該筆紀錄？ id = ${id}`)){
                    await this.$axios
                        .delete(url)
                        .then(res => {
                            if(res.data=='刪除成功'){
                                this.$toast.success("刪除成功", { duration: 2000 });
                                this.getQuerry2(querrypool,true);//reget data
                                this.querrySelectedLst[querrypool] = "";
                                this.resetParm();
                            }else{
                                this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
                            }

                            console.log("刪除步驟API:" + res.request.responseURL);
                        })
                        .catch(error => {
                            this.$toast.error("error:" + error, { duration: 2000 });
                        })
                        .finally(() => {
                            this.getQuerry2(querrypool,true);
                        });
                }else{
                    this.$toast.error("刪除取消", { duration: 2000 });
                }
            }
        },
        patchQuerry:async function(querrypool){
            if (this.querrySelectedLst[querrypool] == null) {
                return;
            } else {
                //先查詢
                await this.postParm(false,null,true);//isSaved=false,querrypool=null,isPatch=false
                //再儲存
                    //取參數
                    this.UserData.Username = (this.$auth.$state.user==null)?"":this.$auth.$state.user.email;
                    this.UserData.IsSaved = true;
                    var input_data = {
                        'BaseParm': this.BaseParm,
                        'BreedingParm': this.BreedingParm,
                        'FeedParm': this.FeedParm,
                        'MakeWaterParm': this.MakeWaterParm,
                        'WaterQualityData': this.WaterQualityData,
                        'ObservationData': this.ObservationData,
                        'BacteriaData': this.BacteriaData,
                        'UserData': this.UserData
                    };
                    var output_data = this.suggData;
                    var allParm = {
                        input_data:input_data,
                        output_data:output_data
                    }
                var id = this.querryDataLst[querrypool].filter(x => x.created_time == this.querrySelectedLst[querrypool])[0].id;
                let url = `${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/${id}/`;
                if (confirm(`是否覆蓋該筆紀錄？ id = ${id}`)) {
                    await this.$axios
                        .patch(url, allParm)
                        .then(res => {
                            if (res.data == '修改成功') {
                                this.$toast.success("覆蓋成功!!", { duration: 2000 });
                            } else {
                                this.$toast.success("覆蓋失敗：" + res.data, { duration: 2000 });
                            }
                        })
                        .catch(error => {
                            this.$toast.error("覆蓋error:" + error, { duration: 2000 });
                        })
                        .finally(() => {
                            this.getQuerry2(querrypool, true);
                        });
                } else {
                    this.$toast.error("覆蓋取消", { duration: 2000 });
                }
            }
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
                'FeedParm':this.FeedParm,
                'MakeWaterParm':this.MakeWaterParm,
                'WaterQualityData':this.WaterQualityData,
                'ObservationData':this.ObservationData,
                'BacteriaData':this.BacteriaData,
                'UserData':this.UserData
            };
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
                        this.$toast.success(`查詢成功`, {
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
                if(querrypool!=null){
                    this.getQuerry2(querrypool);
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
                    // "LeftoverRate": 5,
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
                    // "LeftoverRate": 5,
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
                    // "LeftoverRate": 5,
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
                    // "LeftoverRate": 5,
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
            this.BaseParm = {};
            this.BreedingParm = {};
            this.FeedParm={};
            this.MakeWaterParm={};
            this.WaterQualityData = {};
            this.ObservationData = {};
            this.ObservationData = {};
            this.BacteriaData={};
            this.suggData = {
                "DynamicData": {},
                "WaterQuality": [],//ai建議-水質
                "Observation": [],//ai建議-觀察網
                "Feed": { "feed_amount": {}, "statistics": {}, "status": "" },//ai建議-投餌量
                "Material": {},//投料判斷列表
                "MakeWater": {}//養殖前期做水添加物
            };
        },
        expandPanel:async function(exand=True){
            if (exand) {
                this.panel = {
                    panel_row11: [0], panel_row12: [0], panel_row13: [0], panel_row14: [0],
                    panel_row21: [0], panel_row22: [0], panel_row23: [0], panel_row24: [0],
                    panel_row31: [0, 1, 2], panel_row32: [0, 1]
                };
            }else{
                this.panel = {
                    panel_row11: [], panel_row12: [], panel_row13: [], panel_row14: [],
                    panel_row21: [], panel_row22: [], panel_row23: [], panel_row24: [],
                    panel_row31: [], panel_row32: []
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
            console.log("ruledatastate",checkstate_bool,value,this.lightColor[item]);

        },
    },
    async created() {
        await this.getsuggData();
        await this.getOptData();
        await this.getlightData();
    },
    computed: {
        ShowPoolName(){
            
            var Factory = (this.BaseParm["Factory"]==undefined)?'':this.BaseParm["Factory"];
            var PondArea = (this.BaseParm["PondArea"]==undefined)?'':this.BaseParm["PondArea"];
            var Pond = (this.BaseParm["Pond"]==undefined)?'':this.BaseParm["Pond"];

             return Factory + "_" + PondArea + "_" + Pond;
        }
    },
    mounted() {
        
    },
}
</script>

<style scoped>
.v-expansion-panel-content>>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>

