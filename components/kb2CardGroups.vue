<template>
    <div style="overflow-y: scroll;" id="waterObservation">
        <!-- {{cardData}} -->
        <v-row style="margin-bottom: 0;height: 72vh;align-items: stretch;width: 100%;">
            <!-- 警示 -->
            <v-col cols="12" md="3" style="padding-right: 0;">
                <v-card class="kb-card"
                    style="display: flex;flex-direction: column;align-items: flex-start;">
                    <div class="top alert-line">
                        <div class="title">
                            <div class="number"><span>{{(cardData.water.length+cardData.observation.length)}}</span></div>
                            <div class="main">警示</div>
                        </div>
                        <div class="subtitle">水質{{cardData.water.length}} / 觀察網{{cardData.observation.length}}</div>
                    </div>
                    <div v-if="alert.length>0" class="cata">
                        <div class="judge-cata">
                            {{ judgeCata(alert[nowAlert]) }}
                        </div>
                    </div>
                    
                    <div class="content" style="height: 100%;">
                        <div class="chrevon">
                            <v-btn class="btn-icon just-icon" :class="{'disabled':alert.length==0}" @click="alertChange('left')"><v-icon>mdi-menu-left</v-icon></v-btn>
                        </div>
                        <div class="main-content" v-if="alert.length>0" style="width: 100%;">
                            <v-card-text class="dialog-text"
                                style="display: flex;align-items: flex-start;flex-direction: column;padding: 8px 16px;border-bottom:1px solid rgba(0,0,0,0.1);margin-bottom: 24px;">
                                <b>狀態作動</b>
                                <span style="padding-top: 8px;">
                                    {{alert[nowAlert].status }}</span>
                            </v-card-text>
                            <v-card-text class="dialog-text"
                                style="display: flex;align-items: flex-start;flex-direction: column;padding: 8px 16px;border-bottom:1px solid rgba(0,0,0,0.1);margin-bottom: 24px;">
                                <b>可能影響原因</b>
                                <span style="padding-top: 8px;">
                                    {{alert[nowAlert].factor }}</span>
                            </v-card-text>
                            <v-card-text class="dialog-text"
                                style="display: flex;align-items: flex-start;flex-direction: column;padding: 8px 16px;border-bottom:1px solid rgba(0,0,0,0.1);margin-bottom: 24px;">
                                <b>會造成結果</b> 
                                <span style="padding-top: 8px;">
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
            <v-col cols="12" md="2">
                <v-row style="margin-bottom: 0;height: 100%;">
                    <v-col cols="12" style="height: 50%;padding: 0 0 6px 0;">
                        <v-card class="kb-card"
                            style="display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        下一餐飼料量
                                    </div>
                                </div>
                            </div>
                            <div class="content" style="display: flex;flex-direction: column;align-items: center;padding-top: 16px;">
                                <div class="main-content" style="display: flex;align-items: center;justify-content: space-between;width: 100%;">
                                    <div class="choose">
                                        <span style="font-size: 0.85rem;color: #40657A;font-weight: bold;">{{cardData.nextFeed.length>0?cardData.nextFeed[0].FeedSize:''}}</span>
                                    </div>
                                    <div class="feed">
                                        <span style="font-size: 0.85rem;color:#40657A;font-weight: bold;">方案：{{cardData.nextFeed.length>0?cardData.nextFeed[0].Name:''}}</span>
                                    </div>
                                    
                                </div>
                                <div class="main-content" style="display: flex;align-items: center;justify-content: space-between;width: 100%;">
                                    <div class="choose" style="">
                                        <!-- <span style="font-size: 0.85rem;color:#40657A;font-weight: bold;">方案：{{cardData.nextFeed.length>0?cardData.nextFeed[0].Name:''}}</span><br>
                                        <span style="font-size: 0.85rem;color: #00324E;font-weight: bold;">{{cardData.nextFeed.length>0?cardData.nextFeed[0].FeedSize:''}}</span> -->
                                        <span style="font-size: 0.85rem;color: #A60017;font-weight: bold;">{{cardData.nextFeed.length>0?'+':''}}
                                            <span style="font-size: 1.5rem;color: #A60017;font-weight: bold;">{{cardData.nextFeed.length>0?cardData.nextFeed[0].NextFeedIncrementPct:''}}</span>
                                        </span><br>
                                    </div>
                                    <div class="feed">
                                        <span class="number-of-data" style="padding-top: 0;">
                                            {{cardData.nextFeed.length>0?cardData.nextFeed[0].NextFeed:'-'}}
                                        </span> g
                                    </div>
                                    
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" style="height: 50%;padding: 6px 0 0 0;">
                        <v-card class="kb-card"
                            style="display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        ADG(每日增重)
                                    </div>
                                </div>
                            </div>
                            <div class="content number-of-content">
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
            <v-col cols="12" md="2">
                <v-row style="margin-bottom: 0;height: 100%;">
                    <v-col cols="12" style="height: 50%;padding: 0 0 6px 0;">
                        <v-card class="kb-card"
                            style="display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        石灰量
                                    </div>
                                </div>
                            </div>
                            <div class="content number-of-content">
                                <div class="main-content">
                                    <span class="number-of-data">
                                        {{cardData.lime}} 
                                    </span> g
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" style="height: 50%;padding: 6px 0 0 0;">
                        <v-card class="kb-card"
                            style="display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        砂糖量
                                    </div>
                                </div>
                            </div>
                            <div class="content number-of-content">
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
            <v-col cols="12" md="2">
                <v-row style="margin-bottom: 0;height: 100%;">
                    <v-col cols="12" style="height: 50%;padding: 0 0 6px 0;">
                        <v-card class="kb-card"
                            style="display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        建議網上料量
                                    </div>
                                </div>
                            </div>
                            <div class="content number-of-content">
                                <div class="main-content">
                                    <span class="number-of-data">
                                        {{cardData.observationFeed}} 
                                    </span> g
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" style="height: 50%;padding: 6px 0 0 0;">
                        <v-card class="kb-card"
                            style="display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="top">
                                <div class="title">
                                    <div class="main">
                                        內存量
                                    </div>
                                </div>
                            </div>
                            <div class="content number-of-content">
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
                <v-row style="margin-bottom: 0;height: 100%;">
                    <v-col cols="12" style="height: 50%;padding: 0 6px 6px 0;">
                        <v-card class="kb-card"
                            style="display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="top alert-line">
                                <div class="title">
                                    <div class="main">
                                        存活率
                                    </div>
                                </div>
                            </div>
                            <div class="content ring" style="width: 100%;display: flex;align-items: center;justify-content: center;">
                                <div class="ring-of-data">
                                    <!-- <ve-ring v-if="isChart" :data="chartDataSurvival" :settings="chartSetting" :extend="chartExtend" width="150px" height="150px"></ve-ring> -->
                                    <RingChart :chartData="chartDataSurvival" :colors="chartSurvivalColor"></RingChart>
                                </div>
                                
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" style="height: 50%;padding: 6px 6px 0 0;">
                        <v-card class="kb-card"
                            style="display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="top alert-line">
                                <div class="title">
                                    <div class="main">
                                        每日體重投餌率
                                    </div>
                                </div>
                            </div>
                            <div class="content ring" style="width: 100%;display: flex;align-items: center;justify-content: center;">
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
        padding: 8px 16px;
        height: 100%;
        justify-content: center;
        *{
            color: $color-dark;
        }
        
        .top {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            border-bottom: 1px solid $color-primary;
            border-radius: 0;
            padding-bottom: 8px;
            &.alert-line {
                align-items: center;
                border-bottom: 1px solid rgba(0,0,0,0.1);
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
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: $color-accent;
                position: relative;
                margin-right: 4px;
                span {
                    color: #fff;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
            }
        }
        .content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            // height: 100%;
            &.number-of-content {
                padding-top: 24px;
                text-align: right;
                display: flex;
                justify-content: center;
                width: 100%;
            }
            .num-of-alert {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                color: $color-dark-75;
            }
            .number-of-data {
                padding-top: 16px;
                font-size: 2rem;
                font-weight: bold;

            }
        }
        .cata {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 16px;
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