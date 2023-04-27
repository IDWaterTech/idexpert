<template>
    <div>
        <div class="my-2">
            <v-row align="center">
                <v-col cols="12" md="2">
                    <v-switch
                        v-model="UserData.IsSaved"
                        :label="(this.$auth.$state.user == null) ? '儲存本次查詢參數(登入後使用)' : '儲存本次查詢參數'"
                        color="orange"
                        hide-details dense dark
                        :disabled="this.$auth.$state.user == null"
                    ></v-switch>
                </v-col>
                <v-col cols="12" md="1">
                   <v-btn tile x-large color="purple darken-2" style="border:1px white solid !important;" dark @click="postParm()">查詢</v-btn>
                </v-col>
                <v-col cols="12" md="4">
                    <v-autocomplete
                        :label="(this.$auth.$state.user == null) ? '帶入儲存參數(登入後使用)' : '帶入儲存參數'"
                        v-model="querrySelected"
                        :items="querryData"
                        item-value="created_time"
                        dense filled
                        chips hide-details
                        small-chips
                        @mousedown="getQuerry()"
                        @change="importQuerry()"
                        clearable solo
                        class="ml-2 my-0"
                        :disabled="this.$auth.$state.user == null"
                    >
                        <template slot="item" slot-scope="data">{{ data.item.created_time }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                        <template slot="selection" slot-scope="data">{{ data.item.created_time }}-{{ data.item.input_data.BaseParm.PondArea }}-{{ data.item.input_data.BaseParm.Pond }}</template>
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" md="2" v-if="false">
                    <v-btn tile x-large color="purple darken-2" style="border:1px white solid !important;" dark @click="setParm()">設定測試數值</v-btn>
                </v-col>
                <v-col cols="12" md="1">
                    <v-btn tile x-large color="purple darken-2" style="border:1px white solid !important;" dark @click="resetParm()">重設</v-btn>
                </v-col>
                <v-col cols="12" md="2">
                    <v-icon @click="expandPanel(true)" title="展開">mdi-view-dashboard</v-icon>
                    <v-icon @click="expandPanel(false)" title="收縮">mdi-view-stream</v-icon>
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
                                <v-expansion-panels accordion tile multiple v-model="panel.panel_row11">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#BBDEFB" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">養殖基本數據</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="BaseParm">
                                                        <v-text-field v-model="BaseParm['Factory']" dense hide-details class="mt-0 blue lighten-5"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">養殖場</span></v-text-field>
                                                        <v-text-field v-model="BaseParm['PondArea']" dense hide-details class="mt-0 blue lighten-5"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">養殖區域</span></v-text-field>
                                                        <v-text-field v-model="BaseParm['Pond']" dense hide-details class="mt-0 blue lighten-3"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">養殖池</span></v-text-field>
                                                        <v-text-field v-model="BaseParm['Shape']" dense hide-details class="mt-0 blue lighten-3"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">水池型狀</span></v-text-field>
                                                        <v-text-field v-model="BaseParm['StartedDate']" dense hide-details class="mt-0 blue lighten-1" dark><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">養殖起始日</span></v-text-field>
                                                        <v-text-field v-model="BaseParm['WaterSource']" dense hide-details class="mt-0 blue lighten-1" dark><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">水源</span></v-text-field>
                                                        <v-text-field v-model.number="BaseParm['WaterSourceSalinity']" dense hide-details class="mt-0 blue white--text" dark><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">鹽度(度)</span></v-text-field>
                                                        <v-text-field v-model.number="BaseParm['WaterBody']" dense hide-details class="mt-0 blue white--text" dark><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">水體體積(m3)</span></v-text-field>
                                                        <v-text-field v-model.number="BaseParm['Density']" dense hide-details class="mt-0 blue darken-1 white--text" dark><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">放養密度(隻/噸水)</span></v-text-field>
                                                        <v-text-field v-model.number="BaseParm['Days']" dense hide-details class="mt-0 blue darken-1 white--text" dark><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">養殖天數</span></v-text-field>
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
                                <v-expansion-panels accordion tile multiple v-model="panel.panel_row12">
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
                                <v-expansion-panels accordion tile multiple v-model="panel.panel_row13">
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
                                                        <v-text-field v-model.number="FeedParm['CarbonSourceCarbonPct']" dense hide-details class="mt-0 blue lighten-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">碳源含碳量(%)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['CarbonSourcePurity']" dense hide-details class="mt-0 blue lighten-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">碳源純度(%)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['SugarSourcePurity']" dense hide-details class="mt-0 blue white--text" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖純度(%)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['FeedCN']" dense hide-details class="mt-0 blue white--text" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">飼料CN比(依照飼料)</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['LastFeedInput']" dense hide-details class="mt-0 blue darken-1 white--text" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">前一餐飼料量</span></v-text-field>
                                                        <v-text-field v-model.number="FeedParm['CumulativeFeedAmountInput']" dense hide-details class="mt-0 blue darken-1 white--text" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">累計飼料量</span></v-text-field>
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
                                <v-expansion-panels accordion tile multiple v-model="panel.panel_row14">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#BBDEFB" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">做水期參數</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content>
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="MakeWaterParm">
                                                        <v-text-field v-model.number="MakeWaterParm['Urea']" dense hide-details class="mt-0 blue lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">尿素(g)</span></v-text-field>
                                                        <v-text-field v-model.number="MakeWaterParm['UreaEffectiveConcentration']" dense hide-details class="mt-0 blue lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">尿素有效濃度(%)</span></v-text-field>
                                                        <v-text-field v-model.number="MakeWaterParm['BleachingPowderEffectiveConcentration']" dense hide-details class="mt-0 blue lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">漂白粉有效濃度(%)</span></v-text-field>
                                                        <v-text-field v-model.number="MakeWaterParm['Chlorine']" dense hide-details class="mt-0 blue lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">水體餘氯(ppm)</span></v-text-field>
                                                        <v-text-field v-model.number="MakeWaterParm['HypoEffectiveConcentration']" dense hide-details class="mt-0 blue lighten-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">海波有效濃度(%)</span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue lighten-1" dark disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
                                                        <v-text-field dense hide-details class="mt-0 blue white--text" dark disabled><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend"></span></v-text-field>
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
                                <v-expansion-panels accordion tile multiple v-model="panel.panel_row21">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#FFFDE7" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">水質資訊</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="WaterQualityData">
                                                        <v-text-field v-model.number="WaterQualityData['Do']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">溶氧Do(ppm)</span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['pH']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">酸鹼值pH</span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['Temp']" dense hide-details class="mt-0 yellow lighten-3"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">氣溫(°C)</span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['Salinity']" dense hide-details class="mt-0 yellow lighten-3"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">鹽度(ppt)</span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['AmmoniaN']" dense hide-details class="mt-0 yellow lighten-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">氨氮NH3/NH4+(ppm)</span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['NO2']" dense hide-details class="mt-0 yellow lighten-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">亞硝酸鹽NO2-(ppm)</span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['Mg']" dense hide-details class="mt-0 yellow"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">鎂離子Mg2+(ppm)</span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['Ca']" dense hide-details class="mt-0 yellow"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">鈣離子Ca2+(ppm)</span></v-text-field>
                                                        <v-text-field v-model.number="WaterQualityData['Alk']" dense hide-details class="mt-0 yellow darken-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">鹼度Alk(ppm)</span></v-text-field>
                                                        <v-text-field v-if="false"  dense hide-details class="mt-0 yellow darken-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">水的顏色</span></v-text-field>
                                                        <v-select v-model="WaterQualityData['WaterColor']" :items="optData.WaterColor" filled dense hide-details class="mt-0 yellow darken-1" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">水的顏色</span></v-select>
                                                    </v-form>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                            <!-- 黃2 -->
                            <v-col cols="12" md="4" class="pa-0 px-1">
                                <v-expansion-panels accordion tile multiple v-model="panel.panel_row22">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#FFFDE7" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">觀察網資訊</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#BBDEFB">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-form ref="ObservationData">
                                                        <v-text-field v-model.number="ObservationData['IsMoultingPeriod']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">是否為脫殼期</span></v-text-field>
                                                        <v-text-field v-if="false" v-model="ObservationData['IntestinalColor']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">腸線顏色</span></v-text-field>
                                                        <v-select v-model="ObservationData['IntestinalColor']" :items="optData.IntestinalColor" filled dense hide-details class="mt-0 yellow lighten-5" item-value="name_en" item-text="name_ch"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">腸線顏色</span></v-select>

                                                        <v-text-field v-model="ObservationData['4HepatopancreasColor2']" dense hide-details class="mt-0 yellow lighten-3"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">肝胰臟顏色</span></v-text-field>
                                                        <v-text-field v-model="ObservationData['MuscleColor']" dense hide-details class="mt-0 yellow lighten-3"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">肌肉顏色</span></v-text-field>
                                                        <v-text-field v-model="ObservationData['BodyIllnessLocation']" dense hide-details class="mt-0 yellow lighten-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">軀體異色位置</span></v-text-field>
                                                        <v-text-field v-model="ObservationData['Moulting']" dense hide-details class="mt-0 yellow lighten-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">脫殼狀況</span></v-text-field>
                                                        <v-text-field v-model.number="ObservationData['LeftoverRate']" dense hide-details class="mt-0 yellow"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">觀察網殘餌量(%)</span></v-text-field>
                                                        <v-text-field v-model.number="ObservationData['DeadShrimpRate']" dense hide-details class="mt-0 yellow"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">死蝦%數(%)</span></v-text-field>
                                                        <v-text-field v-model.number="ObservationData['ShrimpLength']" dense hide-details class="mt-0 yellow darken-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">蝦子長度(cm)</span></v-text-field>
                                                        <v-text-field v-model.number="ObservationData['ObsFeed']" dense hide-details class="mt-0 yellow darken-1"><span style="width:120px;" class="pa-0 ma-0 text-center" slot="prepend">觀察網投餌量(g)</span></v-text-field>
                                                    </v-form>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                            <!-- 黃3 -->
                            <v-col cols="12" md="4" class="pa-0 pl-1">
                                <v-expansion-panels accordion tile multiple v-model="panel.panel_row23">
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
                                                        <v-text-field v-model.number="BacteriaData['BacillusSubtilis']" dense hide-details class="mt-0 yellow lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">枯草桿菌(CFU)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['VibrioAlginolyticus']" dense hide-details class="mt-0 yellow lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">溶藻弧菌(白)(CFU)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['VibrioCholerae']" dense hide-details class="mt-0 yellow lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">霍亂弧菌(藍)(CFU)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['VibrioEnteritidis']" dense hide-details class="mt-0 yellow lighten-1"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">腸炎弧菌(紫)(CFU)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['VibrioVulnificus']" dense hide-details class="mt-0 yellow lighten-1"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">創傷弧菌(靛)(CFU)</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['IsEMSInfected']" dense hide-details class="mt-0 yellow"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">是否EMS感染</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['IsEHPInfected']" dense hide-details class="mt-0 yellow"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">是否EHP感染</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['IsVirusInfected']" dense hide-details class="mt-0 yellow darken-1"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">是否病毒性感染</span></v-text-field>
                                                        <v-text-field v-model.number="BacteriaData['IsBacteriumInfected']" dense hide-details class="mt-0 yellow darken-1"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">是否細菌性感染</span></v-text-field>
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
                                <v-expansion-panels accordion tile multiple v-model="panel.panel_row24">
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="#FFFDE7" class="pa-3 font-weight-black" style="min-height: 20px;" expand-icon="mdi-menu-down">動態數據資訊</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="#FFF3E0">
                                                <!-- <v-card-title class="pa-2">養殖基本數據</v-card-title> -->
                                                <!-- <v-divider></v-divider> -->
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-text-field v-model="suggData.DynamicData['FCR']" dense hide-details class="mt-0 orange lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">FCR(換肉率)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['ADG']" dense hide-details class="mt-0 orange lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">ADG(每日增重量)(g/day)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['BiomassOfShrimp']" dense hide-details class="mt-0 orange lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">內存量(累積料量)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['SurvivalRate']" dense hide-details class="mt-0 orange lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">存活率(%)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['EstimatedFeedTotal']" dense hide-details class="mt-0 orange lighten-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">預估所需飼料量(g)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['EstimatedProduction']" dense hide-details class="mt-0 orange lighten-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">預估產量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['EstimatedCatchingDate']" dense hide-details class="mt-0 orange" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">預計間補日期</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['EstimatedCatchingAmount']" dense hide-details class="mt-0 orange" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">預計間補量</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['FeedAmountInObservation']" dense hide-details class="mt-0 orange darken-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">觀察網網上料量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['WeightFeedRate']" dense hide-details class="mt-0 orange darken-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">每日體重投餌率(%)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['ShrimpWeight']" dense hide-details class="mt-0 orange darken-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">蝦子重量(g)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['Drain']" dense hide-details class="mt-0 orange darken-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">排汙量(噸)</span></v-text-field>
                                                    <v-text-field v-model="suggData.DynamicData['CumulativeDrainAmount']" dense hide-details class="mt-0 orange darken-1" dark><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">累計排汙量(噸)</span></v-text-field>
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
                            <!-- 綠1 -->
                            <v-col cols="12" md="12" class="pa-0">
                                <v-expansion-panels accordion tile multiple v-model="panel.panel_row31">
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
                                                                <td>{{ item.status }}</td>
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
                                                                <td>{{ item.status }}</td>
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
                                                        <table style="width:100%;">
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
                                                            <tbody class="lime lighten-5">
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
                                <v-expansion-panels accordion tile multiple v-model="panel.panel_row32">
                                    <!-- 綠1 -->
                                    <v-expansion-panel >
                                        <v-expansion-panel-header color="teal" class="pa-3 font-weight-black white--text" style="min-height: 20px;" expand-icon="mdi-menu-down">投料判斷列表</v-expansion-panel-header>
                                        <v-divider class="grey"></v-divider>
                                        <v-expansion-panel-content color="red">
                                            <v-card tile color="lime lighten-5">
                                                <v-card-text class="pa-0 mx-0">
                                                    <v-text-field v-model="suggData.Material['CumulativeLimeAmount']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">累計熟石灰量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['CumulativeBacteriaAmount']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">累計菌量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarCN']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖量 (配合飼料CN比)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarAmmoniaN']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖量 (降氨氮)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarNO2']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖量 (降亞硝酸)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarBacillusSubtilis']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖量 (提高枯草桿菌)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarVibrioEnteritidis']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖量 (降紫菌)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarVibrioVulnificus']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖量 (降靛菌)(kg)</span></v-text-field>
                                                </v-card-text>
                                                <v-card-text class="pa-0 mx-0 mt-3">
                                                    <v-text-field v-model="suggData.Material['CumulativeSugarAmount']" dense hide-details class="mt-0 lime lighten-3"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">累計砂糖量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['Lime']" dense hide-details class="mt-0 yellow lighten-2"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">熟石灰量(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.Material['SugarTotal']" dense hide-details class="mt-0 yellow lighten-2"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">當日總砂糖量(kg)</span></v-text-field>
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
                                                    <v-text-field v-model="suggData.MakeWater['SugarMakeWater']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">砂糖量(做水)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.MakeWater['BleachingPowder']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">漂白粉(30ppm濃度消毒)(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.MakeWater['Hypo']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">海波(kg)</span></v-text-field>
                                                    <v-text-field v-model="suggData.MakeWater['UreaN']" dense hide-details class="mt-0 lime lighten-5"><span style="width:200px;" class="pa-0 ma-0 text-center" slot="prepend">尿素(kg)</span></v-text-field>
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
import { relativeTimeRounding } from 'moment';


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
            BaseParm:{},//養殖基本參數
            BreedingParm:{},//養殖參數
            FeedParm:{},//飼料參數
            MakeWaterParm:{},//做水參數
            WaterQualityData:{},//水質資訊
            ObservationData:{},//觀察網資訊
            BacteriaData:{},//水中菌相資訊
            suggData:{DynamicData:{},WaterQuality:{},Observation:{},Feed:{},Material:{},MakeWater:{}},//ai建議
            optData:{},//選項
            querryData:[],//查詢紀錄
            querrySelected:"",
            panel:{panel_row11:[0],panel_row12:[0],panel_row13:[0],panel_row14:[0],
                   panel_row21:[0],panel_row22:[0],panel_row23:[0],panel_row24:[0],
                   panel_row31:[0,1,2],panel_row32:[0,1]},
        }
    },
    methods: {
        getsuggData:async function(){
            this.suggData={
                "DynamicData":{},
                "WaterQuality":[{"id":1,"status":"water正常","factor":"無","result":"無"},],//ai建議-水質
                "Observation":[{"id":1,"status":"obs正常","factor":"無","result":"無"},],//ai建議-觀察網
                "Feed":{"feed_amount":{},"statistics":{},"status":""},//ai建議-投餌量
                "Material":{},//投料判斷列表
                "MakeWater":{}//養殖前期做水添加物
            }
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
                    debugger;
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }
                else{
                    debugger;
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }

            }).catch(error => {
                this.$toast.error(`資料Fail:${error}\n${JSON.stringify(error.response.data)}`, { duration: 5000 });
            })
            .finally(() => {
                    //this.getdata();
            });

        },
        importQuerry:async function(){
            if(this.querrySelected==null){
                this.resetParm();
                return;
            }else{
                console.log("querrySelected:",this.querrySelected);
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
        postParm:async function(){
            console.log("養殖基本參數 BaseParm",this.BaseParm);
            console.log("養殖參數 BreedingParm",this.BreedingParm);
            console.log("飼料參數 FeedParm",this.FeedParm);
            console.log("做水參數 MakeWaterParm",this.MakeWaterParm);
            console.log("水質資訊 WaterQualityData",this.WaterQualityData);
            console.log("觀察網資訊 ObservationData",this.ObservationData);
            console.log("水中菌相資訊 BacteriaData",this.BacteriaData);
            console.log("使用者相關資訊 UserData",this.UserData);
            this.UserData.Username = (this.UserData.IsSaved)?this.$auth.$state.user.email:"";
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
            debugger;
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

                    this.$toast.success(`查詢成功`, {
                        duration: 2000
                    });
                    console.log("suggData:",this.suggData);
                } else {
                    debugger;
                    this.$toast.error(`發生錯誤:${res.data}`, { duration: 2000 });
                }
                console.log("新增API:" + res.request.responseURL);
            }).catch(error => {
                this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            })
            .finally(() => {
                    //this.getdata();
            });
        },
        setParm: async function () {
            this.BaseParm = {
                "Factory": "宜蘭場",
                "PondArea": "武曲",
                "Pond": "A1",
                "Shape": "圓形",
                "StartedDate": "2023-01-03",
                "WaterSource": "地下水",
                "WaterSourceSalinity": 1.5,
                "WaterBody": 1000,
                "Density": 300,
                "Days": 15
            };
            this.BreedingParm = {
                "CN": 12,
                "EstimatedFCR": 1.6,
                "EstimatedADG": 0.12,
                "InitialLength": 0.01,
                "EstimatedSurvivalRate": 90
            };
            this.FeedParm = {
                "Brand": "太子",
                "Price": 600,
                "CrudeProteinPct": 30,
                "Nitrogen": 16,
                "CarbonSourceCarbonPct": 80,
                "CarbonSourcePurity": 90,
                "SugarSourcePurity": 90,
                "FeedCN": 7.8,
                "LastFeedInput": 1.255,
                "CumulativeFeedAmountInput": 2.525
            };
            this.MakeWaterParm = {
                "Urea": 30,
                "UreaEffectiveConcentration": 90,
                "BleachingPowderEffectiveConcentration": 90,
                "Chlorine": 30,
                "HypoEffectiveConcentration": 90
            };
            this.WaterQualityData = {
                "Do": 6,
                "pH": 7.8,
                "Temp": 32,
                "Salinity": 35,
                "AmmoniaN": 2,
                "NO2": 5,
                "Mg": 1000,
                "Ca": 450,
                "Alk": 200,
                "WaterColor": "DarkGreen"
            };
            this.ObservationData = {
                "IsMoultingPeriod": 0,
                "IntestinalColor": "Black",
                "HepatopancreasColor": "dark",
                "MuscleColor": "Turbidity",
                "BodyIllnessLocation": "None",
                "Moulting": "Normal",
                "LeftoverRate": 5,
                "DeadShrimpRate": 0.9,
                "ShrimpLength": 2.5
            };
            this.BacteriaData = {
                "Biofloc": 80,
                "BacillusSubtilis": 4999,
                "VibrioAlginolyticus": 500,
                "VibrioCholerae": 500,
                "VibrioEnteritidis": 500,
                "VibrioVulnificus": 500,
                "IsEMSInfected": 0,
                "IsEHPInfected": 0,
                "IsVirusInfected": 0,
                "IsBacteriumInfected": 0
            };
        },
        resetParm:async function(){
            this.BaseParm = {};
            this.BreedingParm = {};
            this.FeedParm={};
            this.MakeWaterParm={};
            this.WaterQualityData = {};
            this.ObservationData = {};
            this.ObservationData = {};
            this.BacteriaData={};
            this.suggData={
                "DynamicData":{},
                "WaterQuality":[],//ai建議-水質
                "Observation":[],//ai建議-觀察網
                "Feed":{"feed_amount":{},"statistics":{},"status":""},//ai建議-投餌量
                "Material":{},//投料判斷列表
                "MakeWater":{}//養殖前期做水添加物
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
        }
    },
    async created() {
        await this.getsuggData();
        await this.getOptData();
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