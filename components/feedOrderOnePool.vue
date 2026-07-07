<template>
    <div>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-card class="my-3" elevation="0">
                <v-card-title>
                    <span class="headline">單池設定</span>
                </v-card-title> 
                <v-card-text>
                    <v-row>
                        <!-- 選擇養殖池 -->
                       <v-col cols="12" md="4">
                            <locate-select :dataScope="'pool'" :defaultSelect="''" :isMulti="false"
                                @scopeSel_data="get_scopeData($event)" class="select-template" />
                       </v-col>
                       <!-- 餵食日期date -->
                        <v-col cols="12" md="4">
                                <v-menu v-model="menu_date" :close-on-content-click="true" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="feed_date" label="餵食日期" filled dense
                                            prepend-icon="mdi-calendar" readonly hide-details v-bind="attrs" v-on="on"
                                            clearable @click:prepend="() => (feed_date = getNowDate())" :rules="rules.require"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="feed_date" locale="zh-tw" no-title hide-details
                                        @input="menu_date = false"></v-date-picker>
                                </v-menu>
                        </v-col>
                        <!-- 餵時時間 feed_time-->
                        <v-col cols="12" md="2">
                            <v-text-field v-model="feed_time" value="" style="font-color: white" dense filled clearable
                                type="time" prepend-icon="mdi-timeline-clock-outline" hide-details :rules="rules.require"
                                @click:prepend="() => (feed_time = getNowTime())"></v-text-field>
                        </v-col>
                        <!-- 是否飼料有放觀察網-->
                        <v-col cols="12" md="2" class="justify-center">
                            <v-checkbox v-model="item.has_observation" label="是否有觀察飼料" hide-details></v-checkbox>
                            <span>當前觀察網百分比：{{ obsPercent }}%</span>
                        </v-col>
                        <!-- ------------------------------------------------------------- -->
                        <!-- 選擇餐數 -->
                        <v-col cols="12" md="2">
                            <v-select v-model="item.meals_per_day" :items="[1, 2, 3, 4, 5, 6, 7, 8]" dense hide-details filled
                                label="餐數" :rules="rules.require"
                                clearable placeholder="選擇餐數" />
                        </v-col>
                        <!-- 選擇飼料(套餐) -->
                        <v-col cols="12" md="3">
                            <v-autocomplete v-model="item.feed_combo_id" :items="combo_sorted" dense hide-details filled
                                clearable item-text="name_ch" item-value="id" placeholder="選擇飼料(套餐)" label="套餐"
                                :rules="rules.require"
                                @change="setformula_val(item)"
                                >
                                <template v-slot:item="data">
                                    {{ data.item.name_ch }}
                                    <span class="ml-3" style="color:red;" v-if="data.item.is_absoluteTop">
                                        <v-btn class="pa-0" x-small outlined color="red darken-3"
                                            style="color:#C62828 !important;" disabled width="30">new</v-btn>
                                    </span>
                                    <span class="ml-3" v-else>
                                        <v-btn class="pa-0" x-small outlined color="amber darken-3"
                                            style="color:#FF8F00 !important;" disabled width="30"
                                            v-if="data.item.usage_count > 0">{{ data.item.usage_count }}</v-btn>
                                    </span>
                                </template>
                            </v-autocomplete>
                        </v-col>
                       <!-- 投餵量 數值xxxx g -->
                        <v-col cols="12" md="2">
                            <v-text-field clearable dense filled hide-details inputmode="decimal" placeholder="請輸入數字" label="投餵量"
                                v-model.number="item.initial_val" type="number" :rules="rules.require" @input="setformula_val(item)"><span
                                    slot="append">g</span>
                            </v-text-field>
                        </v-col>
                         <!-- 主成分-->
                        <v-col cols="12" md="3" class="teal lighten-5">
                            <v-row class="ma-1" dense>
                                <div class="chip d-flex flex-column" >
                                    <v-row class="mb-0"
                                        :style="{ justifyContent: `${windowWidth < 599.98 ? 'flex-end' : 'flex-start'}` }">
                                        <v-col cols="12" class="my-0 py-0">主成份</v-col>
                                        <v-col cols="12" class="my-0 py-0">
                                        <v-chip v-for="mfla in item.main_items" :key="item.id + '_main_' + mfla.id"
                                            :color="item.color" style="font-size: 16px;margin: 2px;"
                                            :style="Number(mfla.feed_amount) <= 0 ? 'color:red;' : 'color:white;backgroundColor:#408FBC'"
                                            class="main">
                                            {{ mfla.name }}： {{ mfla.feed_amount }}g
                                        </v-chip>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-row>
                        </v-col>
                        <!-- 次成分-->
                        <v-col cols="12" md="2" class="teal lighten-5">
                            <v-row class="ma-1" dense>
                                <div class="chip d-flex flex-column">
                                    <v-row class="mb-0"
                                        :style="{ justifyContent: `${windowWidth < 599.98 ? 'flex-end' : 'flex-start'}` }">
                                        <v-col cols="12" class="my-0 py-0">次成份</v-col>
                                        <v-col cols="12" class="my-0 py-0">
                                            <v-chip v-for="fla in item.sub_items" :key="item.id + '_sub_' + fla.id"
                                                :color="item.color" style="font-size: 16px;margin: 2px;"
                                                :style="Number(fla.feed_amount) <= 0 ? 'color:red;' : 'backgroundColor:#BFCBD2;color: #00324E;'"
                                                class="sub">
                                                {{ fla.name }}： {{ fla.feed_amount }}g
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-row>
                        </v-col>
                        <!-- ------------------------------------- -->
                        <!-- 事件 -->
                       <v-col cols="12" md="4">
                            <v-autocomplete v-model="item.feed_event_settings_id" filled dense hide-details
                                placeholder="事件(選)" label="事件(選)" :items="eventSetData" item-text="title" item-value="id"
                                clearable>
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="12" md="2">
                            <v-btn color="#006AA6" class="white--text" @click="closeDialog()">取消</v-btn>
                            <v-btn color="#006AA6" class="white--text" @click="submitOrder()">送出新增</v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
            <v-divider></v-divider>
            <v-card elevation="0">
                <v-card-title>近期資訊
                    <!-- <v-icon class="ml-2" color="grey darken-1" @click="getFeedInfo()">mdi-reload</v-icon> -->
                </v-card-title>
                <v-card-text class="text-h6" v-if="recent_feed_records.length>0">過去兩天內近三餐的投料紀錄</v-card-text>
               <v-card-text class="d-flex flex-wrap" style="min-height:100px; gap:16px;">
                    <v-card v-for="item in recent_feed_records" :key="item.id" outlined width="300">
                        <v-card-text>
                            <div class="d-flex justify-space-between align-center">
                                <v-chip color="primary" text-color="white">
                                    {{ dayjs(item.feed_time).format('M/D HH:mm') }}
                                </v-chip>

                                <div class="text-h5 font-weight-bold primary--text">
                                    {{ item.total_feed_amount.toLocaleString() }} g
                                </div>
                            </div>

                            <div class="mt-3">
                                {{ item.feed_combo_name_ch }}
                            </div>
                        </v-card-text>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-form>
    </div>
</template>
<script>
import mee from "math-expression-evaluator";
import dayjs from "dayjs";
export default {
    data() {
        return {
            dayjs: dayjs,
           valid: true,
           item: {
                pool_id: null,
                meals_per_day: null,
                feed_combo_id: null,
                initial_val: null,//輸入的飼料克數
                has_observation:false,//是否有觀察量
                main_items: [],
                sub_items: [],
           },
           obsPercent: 0, //觀察網百分比
           // 飼料(套餐)清單
           combo: [],
           // 當前視窗寬高
           windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            //投餵日期
            menu_date: false,
            feed_date: "",
            feed_time: "",
            rules: { require: [v => !!v || "*必要項目"] },
            //事件
            eventSetData:[],
            //近期資訊
            //過去兩天內近三餐的投料紀錄
            recent_feed_records:[],
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog');
        },
        getNowDate: function () {
            let mydate = dayjs().format("YYYY-MM-DD");
            return mydate;
        },
        getNowTime: function () {
            let mytime = dayjs().format("HH:mm");
            return mytime;
        },
        get_scopeData(data) {
            this.item.pool_id = data;
            if(this.item.pool_id){
                this.getPoolData(this.item.pool_id);
            }
        },
        //取得套餐清單(飼料設定)
        getcombodata: async function () {
            this.combo = [];
            let getFeedSettingList = await this.getFeedSettingList();
            let feedSettingData = typeof (getFeedSettingList) == 'string' ? [] : getFeedSettingList;
            this.combo = feedSettingData.filter(x => x.is_enable == true);
        },
        //取得養殖池基本資料(主要用來抓觀察網百分比的設定)
        getPoolData: async function (id) {
            console.log('getPoolData id:', id);
            let getPoolList = await this.getPoolBasic("pond_id",id);
            let poolData = typeof (getPoolList) == 'string' ? [] : getPoolList;
            poolData = poolData[0];
            // 觀察網百分比
            this.obsPercent = (poolData.observation_feed_pct)?poolData.observation_feed_pct:"??";
            //近期資訊--過去兩天內近三餐的投料紀錄
            this.recent_feed_records = (poolData.recent_feed_records)?poolData.recent_feed_records:[];
        },
        getFeedInfo:async function () {
            
            return;
            // let getFeedOrderList = await this.getFeedOrderList();
            // let feedOrderData = typeof (getFeedOrderList) == 'string' ? [] : getFeedOrderList;
            // console.log('getFeedInfo', feedOrderData);
        },
        setformula_val: async function (item) {
            // console.log('setformula_val!!');
            var item = item;

            var initial_val = item.initial_val;
            
            if (this.combo.filter(x => x.id == item.feed_combo_id).length > 0) {
                //選到餐點
                var subitem = this.combo.filter(x => x.id == item.feed_combo_id)[0]
                    .sub_items;
                var main_items = this.combo.filter(x => x.id == item.feed_combo_id)[0]
                    .main_items;
                //主成份
                var my_main_items = [];
                main_items.forEach(element => {
                    var val = this.formula_eval(initial_val, element.formula);
                    var ele = Object.assign({}, element);
                    ele["feed_amount"] = Number(val); //數值為feed_amount
                    my_main_items.push(ele);
                });
                // 次成份
                var my_sub_items = [];
                subitem.forEach(element => {
                    // console.log('element.formula:', element.formula);
                    // console.log('initial_val:', initial_val);
                    var val = this.formula_eval(initial_val, element.formula);
                    var ele = Object.assign({}, element);
                    ele["feed_amount"] = Number(val); //數值為feed_amount
                    my_sub_items.push(ele);
                });
            } else {
                // debugger;
            }
            item.main_items = my_main_items;
            item.sub_items = my_sub_items;
            // console.log('item.main_items', item.main_items);
            // console.log('item.sub_items', item.sub_items);
        },
        formula_eval: function (feed, formula) {
            // console.log('formula_eval:', feed, formula);
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
        // 事件清單
        getEventLst: async function () {
            let getFeedEventSettingList = await this.getFeedEventList();
            let feedSettingData = typeof (getFeedEventSettingList) == 'string' ? [] : getFeedEventSettingList;
            this.eventSetData = feedSettingData;
        },
        //送出新增
        submitOrder: async function () {
            if(!this.item.pool_id){
                this.$toast.error("請選擇養殖池", { duration: 2500 });
                return;
            }
            let valid = this.$refs.form.validate();
            if (!valid) {
                this.$toast.error("請確認欄位是否填寫正確", { duration: 2500 });
                return;
            }
            var postData = {
                feed_time: dayjs(`${this.feed_date} ${this.feed_time}`).format("YYYY-MM-DD HH:mm"),//投餵時間 ex: 2022-04-29 12:00
                pond_id: this.item.pool_id,//養殖池id
                initial_val: this.item.initial_val,//初始設定投餵值
                feed_combo_id: this.item.feed_combo_id,//套餐id
                has_observation:this.item.has_observation,//是否有觀察紀錄
                meals_per_day: this.item.meals_per_day,//餐數
                feed_event_settings_id: this.item.feed_event_settings_id,//事件id
            };
            // console.log('postData:', postData);
            var res = await this.postFeedOrder(postData);
            if (res==true) {
                this.closeDialog();
            } else {
                //找不到任何事件對應，先跳錯誤訊息
            }
        },
    },
    computed: {
        // 飼料(套餐)清單排序
        combo_sorted(){
      // let nowDate =  dayjs(new Date())
      //   .add(-7, "day")
      //   .format("YYYY-MM-DD");
      //   console.log(nowDate);
      var data = this.combo.sort(function(a,b){return (a.created_time > b.created_time)?1:-1;});
      let days=-7;
      var ddd = new Date(Date.now() + days * 24*60*60*1000);
      //PART 1先做小於指定日期(7天內)的部分
      var data_part1 = data.filter(x=>new Date(x.created_time)>=ddd).sort(function(a,b){
        var a1 = new Date(a.created_time);
        var b1 = new Date(b.created_time);
        a['is_absoluteTop']= true;
        b['is_absoluteTop']= true;
        if (a1 > b1) {  return -1; }
        if (a1 < b1) { return 1 }
        if (a1 == b1) { return 0 }
      });
      //part 2做計數最大的排上面 先排序usage_count
      var data_part2 = data.filter(x=>new Date(x.created_time)<ddd).sort(function(a,b){
        var a1 = a.usage_count;
        var b1 = b.usage_count;
        if (a1 > b1) { return -1 }
        if (a1 < b1) { return 1 }
        if (a1 == b1) { return 0 }
      });
      var data_final = data_part1.concat(data_part2);
      return  data_final;
    }
    },
    async mounted() {
        await this.getcombodata(); //取得套餐清單(飼料設定)
        // await this.getPoolData();
        await this.getEventLst(); //取得事件清單
    },
}
</script>