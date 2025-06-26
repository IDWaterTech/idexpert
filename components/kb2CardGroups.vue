<template>
    <div style="overflow-y: scroll;" id="waterObservation">
        <!-- {{cardData}} -->
        <v-row class="mb-0 align-stretch full-width" style="height: 73vh;">
            <!-- 警示 -->
            <v-col cols="12" md="3" class="pr-0">
                <v-card class="kb-card pa-4 flex-column justify-center">
                    <div class="top alert-line">
                        <div class="title">
                            <div class="number"><span>{{(cardData.water.length+cardData.observation.length)}}</span></div>
                            <div class="main">警示</div>
                        </div>
                        <div class="subtitle">水質{{cardData.water.length}} / 觀察網{{cardData.observation.length}}</div>
                    </div>
                    <div v-if="alert.length>0" class="cata full-width mt-4">
                        <div class="judge-cata">
                            {{ judgeCata(alert[nowAlert]) }}
                        </div>
                    </div>
                    
                    <div class="content" style="height: 100%;">
                        <div class="chrevon">
                            <v-btn class="btn-icon just-icon" :class="{'disabled':alert.length==0}" @click="alertChange('left')"><v-icon>mdi-menu-left</v-icon></v-btn>
                        </div>
                        <div class="main-content full-width" v-if="alert.length>0">
                            <v-card-text class="dialog-text border-bottom">
                                <b>狀態作動</b>
                                <span class="pt-2">
                                    {{alert[nowAlert].status }}</span>
                            </v-card-text>
                            <v-card-text class="dialog-text border-bottom">
                                <b>可能影響原因</b>
                                <span class="pt-2">
                                    {{alert[nowAlert].factor }}</span>
                            </v-card-text>
                            <v-card-text class="dialog-text border-bottom">
                                <b>會造成結果</b> 
                                <span class="pt-2">
                                    {{alert[nowAlert].result==''?'無':alert[nowAlert].result}}</span>
                            </v-card-text>
                            <div class="num-of-alert">
                                {{nowAlert+1}} / {{alert.length}}
                            </div>
                        </div>
                        <div class="main-content" v-else>
                            無資料
                        </div>
                        <div class="chrevon">
                            <v-btn class="btn-icon just-icon" :class="{'disabled':alert.length==0}" @click="alertChange('right')"><v-icon>mdi-menu-right</v-icon></v-btn>
                        </div>
                    </div>
                    
                </v-card>
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-row class="mb-0" style="height: 100%;">
                    <v-col cols="12" class="px-0" style="height: 50%;padding-bottom: 6px;padding-top: 0;">
                        <v-card class="kb-card pa-4 flex-column justify-center">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        下一餐飼料量
                                    </div>
                                </div>
                            </div>
                            <div class="content flex-align-center flex-column pa-0 pt-3">
                                <div class="main-content flex-center-between full-width">
                                    <div class="feed" v-if="cardData.nextFeed.length>0">
                                        <span style="font-size: 0.75rem;color:#40657A;font-weight: bold;">方案{{cardData.nextFeed.length>0?cardData.nextFeed[0].Name:''}}</span>
                                    </div>
                                    <div class="choose">
                                        <span style="font-size: 0.75rem;color: #40657A;font-weight: bold;">{{cardData.nextFeed.length>0?cardData.nextFeed[0].FeedSize:''}}</span>
                                    </div>
                                    <div class="choose">
                                        <span style="font-size: 0.75rem;color: #A60017;font-weight: bold;">{{cardData.nextFeed.length>0&&(cardData.nextFeed[0].NextFeedIncrementPct!==''&&cardData.nextFeed[0]?.NextFeedIncrementPct.includes('-')==false)?'+':''}}
                                            <span v-if="cardData.nextFeed.length>0&&cardData.nextFeed[0].NextFeedIncrementPct!==''" style="font-size: 0.75rem;color: #A60017;font-weight: bold;">{{cardData.nextFeed[0].NextFeedIncrementPct}}</span>
                                        </span><br>
                                    </div>
                                </div>
                                <div class="main-content flex-center-between full-width">
                                    <!-- <div class="choose" style="">
                                        
                                        <span style="font-size: 0.85rem;color: #A60017;font-weight: bold;">{{cardData.nextFeed.length>0&&cardData.nextFeed[0].NextFeedIncrementPct!==''?'+':''}}
                                            <span v-if="cardData.nextFeed.length>0&&cardData.nextFeed[0].NextFeedIncrementPct!==''" style="font-size: 1.5rem;color: #A60017;font-weight: bold;">{{cardData.nextFeed[0].NextFeedIncrementPct}}</span>
                                        </span><br>
                                    </div> -->
                                    <div class="feed full-width flex-align-end justify-center">
                                        <span class="number-of-data pt-0" style="padding-top: 0;">
                                            {{cardData.nextFeed.length>0?cardData.nextFeed[0].NextFeed:'-'}}
                                        </span> g<v-icon class="mx-2" :disabled="cardData.nextFeed.length>0 == false" @click="isShowManualFormula = !isShowManualFormula">mdi-calculator-variant-outline</v-icon>
                                    </div>
                                </div>
                                <div class="content flex-align-center flex-column pa-0 pt-3" v-if="isShowManualFormula">
                                    <v-row>
                                        <v-col cols="12" class="pa-0">
                                            {{ this.formula_eval(cardData.nextFeed[0]?.NextFeed ?? '-',this.manualFormula) }}
                                            <v-text-field v-model="manualFormula" placeholder="人工調整，例：*2、/2、+200" outlined dense clearable></v-text-field>
                                        </v-col>
                                        <!-- <v-col cols="3">
                                            <v-btn icon>ok</v-btn>
                                        </v-col> -->
                                    </v-row>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" class="px-0" style="height: 50%;padding-top: 6px;padding-bottom: 0;">
                        <v-card class="kb-card pa-4 flex-column justify-center">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        ADG(每日增重)
                                    </div>
                                </div>
                            </div>
                            <div class="content number-of-content pt-6 text-right d-flex justify-center full-width">
                                <div class="main-content">
                                    <span class="number-of-data">
                                        {{cardData.adg}} 
                                    </span> g
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-row class="mb-0" style="height: 100%;">
                    <v-col cols="12" class="px-0" style="height: 50%;padding-bottom: 6px;padding-top: 0;">
                        <v-card class="kb-card pa-4 flex-column justify-center">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        石灰量
                                    </div>
                                </div>
                            </div>
                            <div class="content number-of-content pt-6 text-right d-flex justify-center full-width">
                                <div class="main-content">
                                    <span class="number-of-data">
                                        {{cardData.lime}} 
                                    </span> g
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" class="px-0" style="height: 50%;padding-top: 6px;padding-bottom: 0;">
                        <v-card class="kb-card pa-4 flex-column justify-center">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        砂糖量
                                    </div>
                                </div>
                            </div>
                            <div class="content number-of-content pt-6 text-right d-flex justify-center full-width">
                                <div class="main-content">
                                    <span class="number-of-data">
                                        {{cardData.sugar}} 
                                    </span> g
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-row class="mb-0" style="height: 100%;">
                    <v-col cols="12" class="px-0" style="height: 50%;padding-bottom: 6px;padding-top: 0;">
                        <v-card class="kb-card pa-4 flex-column justify-center">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        建議網上料量
                                    </div>
                                </div>
                            </div>
                            <div class="content number-of-content pt-6 text-right d-flex justify-center full-width">
                                <div class="main-content">
                                    <span class="number-of-data">
                                        {{cardData.observationFeed}} 
                                    </span> g
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" class="px-0" style="height: 50%;padding-top: 6px;padding-bottom: 0;">
                        <v-card class="kb-card pa-4 flex-column justify-center">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        內存量
                                    </div>
                                </div>
                            </div>
                            <div class="content number-of-content pt-6 text-right d-flex justify-center full-width">
                                <div class="main-content">
                                    <span class="number-of-data">
                                        {{cardData.biomass}} 
                                    </span> g
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="3">
                <v-row class="mb-0" style="height: 100%;">
                    <v-col cols="12" style="height: 50%;padding: 0 6px 6px 0;">
                        <v-card class="kb-card pa-4 flex-column justify-center">
                            <div class="top alert-line">
                                <div class="title">
                                    <div class="main">
                                        存活率
                                    </div>
                                </div>
                            </div>
                            <div class="content ring full-width">
                                <div class="ring-of-data">
                                    <!-- <ve-ring v-if="isChart" :data="chartDataSurvival" :settings="chartSetting" :extend="chartExtend" width="150px" height="150px"></ve-ring> -->
                                    <RingChart :chartData="chartDataSurvival" :colors="chartSurvivalColor"></RingChart>
                                </div>
                                
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" style="height: 50%;padding: 6px 6px 0 0;">
                        <v-card class="kb-card pa-4 flex-column justify-center">
                            <div class="top alert-line">
                                <div class="title">
                                    <div class="main">
                                        每日體重投餌率
                                    </div>
                                </div>
                            </div>
                            <div class="content ring full-width">
                                <div class="ring-of-data">
                                    <!-- <ve-ring v-if="isChart" :data="chartDataSurvival" :settings="chartSetting" :extend="chartExtend" width="150px" height="150px"></ve-ring> -->
                                    <RingChart :chartData="chartDataWeight" :colors="chartWeightColor"></RingChart>
                                </div>
                                
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import mee from "math-expression-evaluator";
export default {
    props: {
        cardData: {
            type: Object,
            default: function () {
                return {
                    adg: 0,
                    water:[],
                    observation:[],
                    biomass: 0,
                    lime: 0,
                    nextFeed: [],
                    observationFeed: 0,
                    sugar: 0,
                    survival: undefined,
                    weight: undefined,
                }
            }
        },
    },
    data() {
        return {
            isShowManualFormula: false,// 是否顯示人工調整飼料量公式
            manualFormula: '',// 人工調整飼料量公式
            alert:[],
            nowAlert:0,
            chartDataSurvival: {
                columns:['name','value'],
                rows:[
                    {'name':'存活率','value':78},
                    {'name':'','value':22}
                ]
            },
            chartSurvivalColor:['#006AA6','#BFCBD2'],
            chartDataWeight: {
                columns:['name','value'],
                rows:[
                    {'name':'每日體重投餌率','value':78},
                    {'name':'','value':22}
                ]
            },
            chartWeightColor:['#00A660','#BFCBD2'],
            isChart: false
        }
    },
    created() {
        this.alert = [];
        this.alert = [...this.cardData.water,...this.cardData.observation];
        this.getNewData();
    },
    methods: {
        formula_eval: function(feed, formula) {
            if(formula == undefined || formula == null || formula == '') {
                return feed;
            }
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
            const factor = Math.pow(10, 0);//0代表小數點後幾位
            result = _.cloneDeep(Math.ceil(result * factor) / factor);
            console.log('result factor:',factor, result);
            return result;
        },
        alertChange(type) {
            if(type=='left') {
                if(this.nowAlert!==0) {
                    this.nowAlert--;
                }else {
                    this.nowAlert = this.alert.length-1;
                }
            }else {
                if(this.nowAlert!==this.alert.length-1) {
                    this.nowAlert++;
                }else {
                    this.nowAlert=0;
                }
            }
        },
        getNewData() {
            let survival = _.cloneDeep(this.chartDataSurvival);
            let weight = _.cloneDeep(this.chartDataWeight);
            this.chartDataSurvival = [];
            this.chartDataWeight = [];
            survival.rows[0].value = this.cardData.survival?this.cardData.survival:0;
            survival.rows[1].value = this.cardData.survival?100-parseFloat(this.cardData.survival):100;
            weight.rows[0].value = this.cardData.weight?this.cardData.weight:0;
            weight.rows[1].value = this.cardData.weight?100-parseFloat(this.cardData.weight):100;
            this.chartDataSurvival = _.cloneDeep(survival);
            this.chartDataWeight = _.cloneDeep(weight);
            this.isChart = true;
        },
        judgeCata(data) {
            let isWater = false;
            this.cardData.water.forEach(w => {
                if(w.factor===data.factor) {
                    isWater = true;
                }
                
            });
            if(isWater) {
                return '水質';
            }else {
                return '觀察網'
            }
        }
    },
    watch: {
        cardData: {
            handler(val){
                this.isChart = false;
                this.alert = [];
                if (typeof this.cardData.water === "object" && this.cardData.water !== null && !Array.isArray(this.cardData.water)) {
                    this.cardData.water = [];
                }
                if (typeof this.cardData.observation === "object" && this.cardData.observation !== null && !Array.isArray(this.cardData.observation)) {
                    this.cardData.observation = [];
                }
                this.getNewData();
                this.alert = [...this.cardData.water,...this.cardData.observation];
                this.nowAlert = 0;
            },
            deep:true
            
        },
        
    }
}
</script>

<style lang="scss" scoped>
    .v-card.result-card .theme--light.v-card.kb-card {
        background-color: #fff !important;
        height: 100%;
        @include flexAlignStart();        *{
            color: $color-dark;
        }
        
        .top {
            @include flexAllCenter();
            flex-direction: column;
            width: 100%;
            border-bottom: 1px solid $color-primary;
            border-radius: 0;
            padding-bottom: 8px;
            &.alert-line {
                align-items: center;
                border-bottom: 1px solid $color-black-10;
            }
            
            .title {
                font-weight: bold;
                * {
                    font-size: 1.1rem;
                }
                
            }
            .subtitle {
                color: $color-dark-75;
                font-weight: bold;
                font-size: 0.85rem;
            }
            .number {
                @include size(24px);
                border-radius: 50%;
                background-color: $color-accent;
                position: relative;
                margin-right: 4px;
                span {
                    color: #fff;
                    @include positionCenter();
                }
            }
        }
        .content {
            @include flexCenterBetween();
            width: 100%;
            &.ring {
                @include flexAllCenter();
            }
            .num-of-alert {
                width: 100%;
                @include flexCenterEnd();
                color: $color-dark-75;
            }
            .number-of-data {
                padding-top: 16px;
                font-size: 2rem;
                font-weight: bold;
                word-break: break-all;
            }
            .dialog-text {
                @include flexAlignStart();
                flex-direction: column;
                padding: 8px 16px;
                margin-bottom: 24px;
            }
        }
        .cata {
            @include flexCenterEnd();
            .judge-cata {
                padding: 2px 8px;
                background-color: $color-primary;
                border-radius: 20px;
                color: #fff;
                font-size: 0.85rem;
            }
        }
    }
    ::v-deep {
        .btn-icon.just-icon .theme--light.v-icon {
            font-size: 24px;
        }
    }
</style>