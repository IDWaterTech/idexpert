<template>
    <div>
        <v-card class="bg-card" style="margin-bottom: 16px;padding-top: 8px;">
            <div class="content">
                <!-- 搜尋列 -->
                <div class="search">
                    <v-row style="margin-bottom: 0;align-items: center;padding-right: 16px;">
                        <!-- 搜尋 -->
                        <v-col cols="12" md="3" style="padding-bottom: 0;padding-top: 4px;">
                            <div class="search-container">
                                <locate-select 
                                    id="search"
                                    class="select-template"
                                    :dataScope="'pool'" 
                                    defaultSelect="" 
                                    :isMulti="false"
                                    @scopeSel_data="get_scopeData($event);"></locate-select>
                            </div>
                        </v-col>
                        <!-- <v-col v-if="poolData.daily&&poolData.daily[poolData.daily.length-1].todo[poolData.daily[poolData.daily.length-1].todo.length-1].execute_status!=='0'" cols="12" md="3">
                            <v-btn class="btn-primary" :class="{'disabled':!poolData.daily||poolData.daily[poolData.daily.length-1].todo[poolData.daily[poolData.daily.length-1].todo.length-1].execute_status=='0'}" @click="submitNextStep">開啟新工作</v-btn>
                        </v-col> -->
                    </v-row>
                </div>
                <div class="result" v-if="poolData.daily&&poolData.daily.length>0">
                    <span style="margin-left: 8px;">執行階段： {{ poolData.phase_name }} - {{poolData.step_name}}</span>
                    <div class="result-content">
                        <v-card class="result-card" v-for="(item,id) in poolData.daily" :key="'date_'+id">
                            <div class="card-title" style="cursor: default;margin: 8px;padding-top: 0;">
                                <div class="title">
                                    <v-card-title>{{ item.scheduling_date.slice(5) }}</v-card-title>
                                </div>
                                <div class="chevron">
                                    <v-tooltip bottom >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn class="btn-icon green" v-bind="attrs" v-on="on" @click="addEventOpen(item.scheduling_date)"><v-icon>mdi-plus</v-icon></v-btn>
                                        </template>
                                        <span>新增動作</span>
                                    </v-tooltip>
                                    
                                </div>
                            </div>
                            <div class="daily-content">
                                <div class="daily-check" v-for="(daily,did) in item.todo" :key="'daily_'+daily.id+'_'+did">
                                    <div class="check-title">
                                        <div class="title">
                                            <v-card-title>{{ daily.action_name }}</v-card-title>
                                        </div>
                                        <div class="chrevon">
                                            <span v-if="daily.execute_status=='0'" class="delay" @click="openDelay(daily,item.scheduling_date,did,true)">延遲</span>
                                            <span v-if="daily.execute_status=='0'" class="delay copy" @click="openDelay(daily,item.scheduling_date,did,false)">複製</span>
                                            <span v-else-if="daily.execute_status=='1'">已執行</span>
                                            <span v-else class="error-text">不執行</span>
                                            <v-tooltip bottom v-if="daily.execute_status=='1'||daily.execute_status=='2'">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <button class="btn-icon" @click="openEdit(daily,item.scheduling_date)" v-bind="attrs" v-on="on">
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </button>
                                                </template>
                                                <span>修改</span>
                                            </v-tooltip>
                                        </div>
                                    </div>
                                    <div class="description">
                                        {{daily.action_remark}}
                                    </div>
                                    <div class="content">
                                        <div class="remark">
                                            {{ daily.msg }}
                                        </div>
                                        <div class="excute" v-if="daily.execute_status!=='0'">
                                            <div class="date">
                                                {{ daily.execute_time.slice(0,16) }}
                                            </div>
                                            <div class="excutor">
                                                {{ daily.executor_name }}
                                            </div>
                                        </div>
                                        <div v-if="daily.execute_status=='0'" class="action">
                                            <v-btn class="btn-primary btn-small" :class="{'disabled':new Date(item.scheduling_date).getTime()>new Date().getTime()}" @click="openEdit(daily,item.scheduling_date,1)">執行</v-btn>
                                            <v-btn class="btn-secondary btn-small" :class="{'disabled':new Date(item.scheduling_date).getTime()>new Date().getTime()}" @click="openEdit(daily,item.scheduling_date,2)">不執行</v-btn>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </div>
                    
                </div>
                <div class="result" v-else style="overflow-x: hidden;">
                    <div class="result-content">
                        <v-card class="result-card" style="width: 100%;height: 72vh;display: flex;align-items: center;justify-content: center;">
                            無資料
                        </v-card>
                    </div>
                    
                </div>
            </div>
        </v-card>
        <!-- 編輯 -->
        <v-dialog v-model="editDialog" max-width="500px">
            <v-form ref="editform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title" style="display: block;width: 100%;">
                        <div style="display: inline-block;">
                            <span>執行編修</span> 
                        </div>
                        <div class="add" style="float: right;display: inline-block;">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="editDialog = false;" 
                                    style="border: none;min-width: 0;padding: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;">
                            <div class="title"><v-card-title>執行狀態</v-card-title></div>
                            <div class="title" v-if="editItem.execute_status!=='0'" style="display: flex;align-items: center;">
                                <span style="font-size: 14px;margin-right: 8px;">{{ editItem.execute_status=='1'?'已執行':'不執行' }}</span>
                                <v-btn class="btn-secondary btn-small delete" @click="editItem.execute_status = '0';editItem.msg=''">取消</v-btn>
                            </div>
                            <div class="title" v-else>
                                <v-btn class="btn-primary btn-small" @click="editItem.execute_status='1'">執行</v-btn>
                                <v-btn class="btn-secondary btn-small" @click="editItem.execute_status='2'">不執行</v-btn>
                            </div>
                        </div>
                        <!-- 財務 -->
                        <!-- <v-card-text style="display: flex;align-items: center;padding: 0;">
                            <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;width: 100%;">
                                <div class="title">
                                    <v-card-title>實際花費的人力 </v-card-title>
                                    <v-text-field v-model.number="editItem.actual_member" type="number" label="花費的人力" autocomplete="off" min="0" hide-details style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;width: 100%;">
                                <div class="title">
                                    <v-card-title>實際花費的金錢 </v-card-title>
                                    <v-text-field v-model.number="editItem.actual_spend" type="number" label="花費的金錢" autocomplete="off" min="0" hide-details style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                                    </v-text-field>
                                </div>
                            </div>
                        </v-card-text> -->
                        
                        <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="title"><v-card-title>說明 <span v-if="editItem.execute_status=='2'" class="error-text" style="margin-left: 4px;">*不執行請填入原因</span></v-card-title></div>
                            <!-- <v-text-field v-model="editItem.action_remark" label="說明" autocomplete="off" style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                            </v-text-field> -->
                            <v-textarea v-model="editItem.msg" hide-details filled clearable placeholder="說明..." style="width: 100%;"></v-textarea>
                        </div>
                    </div>
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="editDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" :class="{'disabled':(editItem.execute_status=='2'&&editItem.msg=='')}" @click="submitEdit">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 延遲執行 -->
        <v-dialog v-model="delayDialog" max-width="500px">
            <v-form ref="delayform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title" style="display: block;width: 100%;">
                        <div style="display: inline-block;">
                            <span>{{ isDelay?'延遲:':'複製:' }} {{ delayItem.ation_name }}</span> 
                        </div>
                        <div class="add" style="float: right;display: inline-block;">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="delayDialog = false;" 
                                    style="border: none;min-width: 0;padding: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="title"><v-card-title>{{ isDelay?'延遲':'複製' }}至哪天執行?</v-card-title></div>
                            <div class="calendar">
                                <span class="pa-0 ma-0" slot="prepend"><v-btn class="btn-icon just-icon"><v-icon style="font-size: 1.25rem;" @click="() => (delayDate = getNowDate())">mdi-calendar</v-icon></v-btn></span>
                                <v-menu v-model="menu_inspecteddate" :close-on-content-click="false" :nudge-right="40" 
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="delayDate" class="mt-0" clearable readonly dense :rules="rules.require"
                                            v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="delayDate" :min="delayItem.original_date" locale="zh-tw" no-title @input="
                                    menu_inspecteddate = false;
                                    "></v-date-picker>
                                </v-menu>
                            </div>
                            
                        </div>
                    </div>
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="delayDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" :class="{'disabled':(delayDate=='')}" @click="submitDelay">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 新增 -->
        <v-dialog v-model="addDialog" max-width="500px">
            <v-form ref="addform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title" style="display: block;width: 100%;">
                        <div style="display: inline-block;">
                            <span>新增動作</span> 
                        </div>
                        <div class="add" style="float: right;display: inline-block;">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="addDialog = false;" 
                                    style="border: none;min-width: 0;padding: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <!-- <div class="basic" style="display: flex;align-items: center;">
                        <v-card-text style="display: flex;align-items: center;padding: 8px 16px;">
                            <v-autocomplete v-model="addItem.action_id" dense filled :items="stepdata" item-text="name_ch"
                                    item-value="id" @change="actionInputShow = false"></v-autocomplete>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn slot="append-outer" class="btn-icon green" @click="showstep()" v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
                                </template>
                                <span>新增動作</span>
                            </v-tooltip>
                        </v-card-text>
                        
                    </div> -->
                    <div class="basic">
                        <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="title"><v-card-title>動作名稱(中文) </v-card-title></div>
                            <v-text-field v-model="addItem.name_ch" label="名稱" autocomplete="off" :rules="rules.require" style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                            </v-text-field>
                        </div>
                        <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="title"><v-card-title>動作名稱(英文) </v-card-title></div>
                            <v-text-field v-model="addItem.name_en" label="名稱" autocomplete="off" :rules="rules.require" style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                            </v-text-field>
                        </div>
                        <v-card-text style="display: flex;align-items: center;padding: 0;">
                            <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;">
                                <div class="title"><v-card-title>起始日</v-card-title></div>
                                <div class="calendar">
                                    <span class="pa-0 ma-0" slot="prepend"><v-btn class="btn-icon just-icon"><v-icon style="font-size: 1.25rem;" @click="() => (addItem.start_date = getNowDate())">mdi-calendar</v-icon></v-btn></span>
                                    <v-menu v-model="startdate" :close-on-content-click="false" :nudge-right="40" 
                                        transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="addItem.start_date" class="mt-0" clearable readonly dense :rules="rules.require"
                                                v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="addItem.start_date" :min="getNowDate()" :max="getMaxDate()" locale="zh-tw" no-title @input="
                                        startdate = false;
                                        "></v-date-picker>
                                    </v-menu>
                                </div>
                                
                            </div>
                            <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;">
                                <div class="title"><v-card-title>持續至</v-card-title></div>
                                <div class="calendar">
                                    <span class="pa-0 ma-0" slot="prepend"><v-btn class="btn-icon just-icon"><v-icon style="font-size: 1.25rem;" @click="() => (addItem.end_date = getNowDate())">mdi-calendar</v-icon></v-btn></span>
                                    <v-menu v-model="enddate" :close-on-content-click="false" :nudge-right="40" 
                                        transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="addItem.end_date" class="mt-0" clearable readonly dense :rules="rules.require"
                                                v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="addItem.end_date" :min="addItem.start_date||getNowDate()" :max="getMaxDate()" locale="zh-tw" no-title @input="
                                        enddate = false;
                                        "></v-date-picker>
                                    </v-menu>
                                </div>
                                
                            </div>
                        </v-card-text>
                        <!-- 財務 -->
                        <!-- <v-card-text style="display: flex;align-items: center;padding: 0;">
                            <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;width: 100%;">
                                <div class="title">
                                    <v-card-title>預估花費的人力 </v-card-title>
                                    <v-text-field v-model.number="addItem.estimate_member" type="number" label="花費的人力" autocomplete="off" min="0" hide-details style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;width: 100%;">
                                <div class="title">
                                    <v-card-title>預估花費的金錢 </v-card-title>
                                    <v-text-field v-model.number="addItem.estimate_spend" type="number" label="花費的金錢" autocomplete="off" min="0" hide-details style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                                    </v-text-field>
                                </div>
                            </div>
                        </v-card-text> -->
                        <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="title"><v-card-title>備註 </v-card-title></div>
                            <v-text-field v-model="addItem.remark" filled dense  label="備註" clearable style="padding-top: 0;width: 100%;"></v-text-field>
                            <!-- <v-text-field v-model="editItem.action_remark" label="說明" autocomplete="off" style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                            </v-text-field> -->
                            <!-- <v-textarea v-model="addItem.action_remark" hide-details filled clearable placeholder="備註..." style="width: 100%;"></v-textarea> -->
                        </div>
                    </div>
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="addDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" @click="submitAdd">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 開啟下一階段 -->
        <v-dialog v-model="nextStepDialog" max-width="500px">
            <v-card class="custom-dialog">
                <v-card-title class="add-title" style="display: block;width: 100%;border-bottom: none;">
                    <div style="display: inline-block;">
                        <span></span> 
                    </div>
                    <!-- <div class="add" style="float: right;display: inline-block;">
                        <v-btn class="btn-secondary close"
                                title="取消" 
                                @click="delayDialog = false;" 
                                style="border: none;min-width: 0;padding: 0 4px;">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div> -->
                </v-card-title>
                <div class="basic">
                    <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;">
                        <div class="title"><v-card-title>已完成目前工作項，按下確認開啟隔天新的工作項</v-card-title></div>
                    </div>
                </div>
                <v-card-actions style="padding: 24px 12px;">
                    <v-spacer></v-spacer>
                    <v-btn class="btn-primary" @click="submitNextStep()">確認</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    layout: "emptynologin2",
    head(){
        return {
            title:"DailyCheck",
            }
    },
    data() {
        return {
            poolData:{},
            editDialog: false,
            delayDialog: false,
            addDialog: false,
            editItem:{},
            nowPoolid: null,
            nowDaily: null,
            accdata:[],
            delayItem:{},
            delayDate:'',
            menu_inspecteddate:false,
            startdate:false,
            enddate:false,
            addItem:{},
            isDelay:true, // true=延遲 false=複製
            rules: {
                require: [v => !!v || "*必要項目"],
            },
            nextStepDialog: false, // 開啟下一階段
            stepdata:[],
            actionInputShow:false
        }
    },
    async created() {
        await this._pageCheck(); //驗證頁面是否可檢視
        // this.getaccList();//取得所有帳號，比對執行者用
        this.getstepdata();
    },
    methods: {
        // 取得所有帳號
        getaccList: async function() {
            let getuserData = await this.getUserList();
            var data = Array.isArray(getuserData)?getuserData:[];
            var mydata = data.filter(x=>x.is_active == true).map(x=>({username:x.username,id:x.id,account_name:x.account_name,position:x.position[0].department}));//只要正常啟用帳號
            this.accdata = Object.assign([],mydata.filter(x=>x.id!==1));//排除特殊人物
        },
        get_scopeData:function(evt){
            console.log(evt);
            this.nowPoolid = evt;
            this.searchPool();
        },
        // 取得池dailycheck
        async searchPool() {
            // this.poolData = {
            //     status: '養殖審核',
            //     daily:[{
            //             date: dayjs( new Date()).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 1111,
            //                 item: '訂苗',
            //                 execute: 1,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss"),
            //                 remark: '聯絡廠商確定送苗時間',
            //                 executor: 'shihya.hsu@idwater.com.tw',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 2222,
            //                 item: '訂飼料',
            //                 execute: 2,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss"),
            //                 remark: '聯絡廠商下單',
            //                 executor: 'shihya.hsu@idwater.com.tw',
            //                 executor_name: '',
            //                 msg:'飼料還有剩',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 3333,
            //                 item: '訂砂糖',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 4444,
            //                 item: '訂海波',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 5555,
            //                 item: '訂尿素',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 6666,
            //                 item: '訂次氯酸鈣',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             }]
            //         },{
            //             date: dayjs(new Date().getTime()+1000*60*60*24).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 7777,
            //                 item: '訂葵四',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 8888,
            //                 item: '訂弧立滅',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },]
            //         },{
            //             date: dayjs(new Date().getTime()+1000*60*60*24*2).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 9999,
            //                 item: '訂粉料',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 11111,
            //                 item: '訂0號料',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 22222,
            //                 item: '訂1號料',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },]
            //         },{
            //             date: dayjs(new Date().getTime()+1000*60*60*24*3).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 33333,
            //                 item: '訂紅料',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 44444,
            //                 item: '訂砂糖',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },]
            //         },{
            //             date: dayjs(new Date().getTime()+1000*60*60*24*4).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 55555,
            //                 item: '訂xxx',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 66666,
            //                 item: '訂yyy',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },]
            //         },{
            //             date: dayjs(new Date().getTime()+1000*60*60*24*5).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 1234,
            //                 item: '訂aaa',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 5678,
            //                 item: '訂bbb',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },]
            //         }]
            // }
            let param={pond_id:this.nowPoolid}
            let getDailyCheckList = await this.getDailyCheckList(param);
            let data = typeof (getDailyCheckList)=='string'?[]:getDailyCheckList;
            this.poolData = _.cloneDeep(data);
            if(this.poolData.daily) {
                this.poolData.daily.forEach(d=>{
                    // d.todo.forEach(t=>{
                    //     if(t.executor!=='' &&t.executor!==null) {
                    //         t.executor_name = this.accdata.filter(x=>x.username==t.executor)[0].position+'-'+this.accdata.filter(x=>x.username==t.executor)[0].account_name;
                    //     }
                        
                    // })
                    if(dayjs(new Date(d.scheduling_date)).format("YYYY-MM-DD")==dayjs(new Date()).format("YYYY-MM-DD")) {
                        // 排序
                        let array1=[];
                        let array2=[];
                        d.todo.forEach(x=>{
                            if(x.execute_time&&x.execute_time!=='') {
                                array1.push(x);
                            }else {
                                array2.push(x);
                            }
                        })
                        array1.sort((a,b)=>{
                            return new Date(a.execute_time) - new Date(b.execute_time)
                        });
                        d.todo = [...array2,...array1];
                    }
                })
                // if(this.poolData.daily[this.poolData.daily.length-1].todo[this.poolData.daily[this.poolData.daily.length-1].todo.length-1].execute_status!=='0') {
                //     this.nextStepDialog = true;
                // }
            }
            

        },
        openEdit(item,date,num=0) {
            // 0 尚未選擇,1 執行,2 不執行,
            console.log('open',item);
            this.editItem = _.cloneDeep(item);
            this.nowDaily = date;
            if(this.editItem.actual_member>0){}else {
                this.editItem.actual_member=0;
            }
            if(this.editItem.actual_spend>0) {}else{
                this.editItem.actual_spend=0;
            }
            if(num==1||num==2) {
                this.editItem.execute_status = num;
            }
            this.editItem.execute_status = this.editItem.execute_status.toString();
            if(this.editItem.executor==''||this.editItem.executor==null) {
                if(num==2) {
                    this.editDialog = true;
                }else {
                    this.submitEdit();
                }
            }else {
                this.editDialog = true;
            }
            // 財務
            // this.editDialog = true;
            
            
        },
        async submitEdit() {
            console.log('submit edit',this.editItem);
            var valid = this.$refs.editform?.validate();
            if(valid||this.editItem.execute_status=='1') {
                this.editItem.execute_time = this.editItem.execute_status=='0'?null:dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.editItem.executor = this.editItem.execute_status=='0'?'':this.$auth.$state.user.email;
                this.editItem.msg = this.editItem.execute_status=='0'?'':this.editItem.msg;
                let parm = _.cloneDeep(this.editItem);
                parm.scheduling_date = this.nowDaily;
                parm.updated_user = this.$auth.$state.user.email;
                delete parm.id;
                console.log('parm',parm);
                var res = false;
                res = await this.patchDailyCheckList(parm,this.editItem.id);
                setTimeout(()=>{
                    if(res) {
                        this.editDialog = false;
                        this.searchPool();
                    }
                },50)
                // this.editDialog = false;
                // let data = _.cloneDeep(this.poolData.daily);
                // this.poolData.daily = [];
                // data.forEach(d=>{
                //     if(d.scheduling_date==this.nowDaily) {
                //         d.todo.forEach(x=>{
                //             if(x.id==this.editItem.id) {
                //                 x.execute_status = this.editItem.execute_status;
                //                 x.execute_time = this.editItem.execute_time;
                //                 x.msg = this.editItem.msg;
                //                 x.executor = this.editItem.executor;
                //                 if(x.executor!=='') {
                //                     x.executor_name = this.accdata.filter(x=>x.username==this.editItem.executor)[0].position+'-'+this.accdata.filter(x=>x.username==this.editItem.executor)[0].account_name
                //                 }else {
                //                     x.executor_name = '';
                //                 }
                //                 if(this.editItem.actual_member>0) {
                //                     x.actual_member = this.editItem.actual_member;
                //                 }else {
                //                     x.actual_member = 0;
                //                 }
                //                 if(this.editItem.actual_spend>0) {
                //                     x.actual_spend = this.editItem.actual_spend;
                //                 }else {
                //                     x.actual_spend = 0;
                //                 }
                                
                //             }
                //         })
                //         // 排序
                //         let array1=[];
                //         let array2=[];
                //         d.todo.forEach(x=>{
                //             if(x.execute_time&&x.execute_time!=='') {
                //                 array1.push(x);
                //             }else {
                //                 array2.push(x);
                //             }
                //         })
                //         array1.sort((a,b)=>{
                //             return new Date(a.execute_time) - new Date(b.execute_time)
                //         });
                //         d.todo = [...array1,...array2];
                //     }
                // })

                // this.poolData.daily = data;
                // if(this.poolData.daily[this.poolData.daily.length-1].todo[this.poolData.daily[this.poolData.daily.length-1].todo.length-1].execute_status!==0) {
                //     this.nextStepDialog = true;
                // }
                // console.log('poolData',data);
            }
            
        },
        // 打開延遲/複製的視窗bool=true為延遲 bool=false為複製
        openDelay(item,date,id,bool) {
            this.delayItem = _.cloneDeep(item);
            this.delayItem.original_date = date;
            this.delayItem.index = id;
            this.delayDate = dayjs(new Date(date)).format("YYYY-MM-DD");
            this.isDelay = bool;
            this.delayDialog = true;
        },
        getNowDate: function() {
            let mydate = dayjs().format("YYYY-MM-DD");
            return mydate;
        },
        getMaxDate() {
            let date;
            if(this.poolData.daily) {
                date = this.poolData.daily[this.poolData.daily.length-1].scheduling_date;
            }
            return date;
        },
        async submitDelay() {
            var valid = this.$refs.delayform.validate();
            var isItem = false;
            // 判斷該天是否有重複的動作
            this.poolData.daily.forEach(d=>{
                if(new Date(d.scheduling_date).getTime()==new Date(this.delayDate).getTime()) {
                    d.todo.forEach(t=>{
                        if(t.action_id==this.delayItem.action_id) {
                            isItem=true;
                            alert(d.scheduling_date+'已有此動作!請選擇其他天')
                        }
                    })
                    
                }
            })
            
            if(valid&&!isItem) {
                if(this.isDelay) {
                    let parm = _.cloneDeep(this.delayItem);
                    parm.scheduling_date = this.delayDate;
                    parm.updated_user = this.$auth.$state.user.email;
                    parm.execute_time = null;
                    parm.executor = '';
                    delete parm.original_date;
                    delete parm.id;
                    delete parm.index;
                    console.log('parm',parm);
                    var res = false;
                    res = await this.patchDailyCheckList(parm,this.delayItem.id);
                    setTimeout(()=>{
                        if(res) {
                            this.delayDialog = false;
                            this.searchPool();
                        }
                    },50)
                    // this.poolData.daily.forEach(d=>{
                    //     if(new Date(d.scheduling_date).getTime()==new Date(this.delayItem.original_date).getTime()) {
                    //         d.todo.splice(this.delayItem.index,1);
                    //     }
                    //     if(new Date(d.scheduling_date).getTime()==new Date(this.delayDate).getTime()) {
                    //         d.todo.push(this.delayItem);
                    //     }
                    // })

                }else {
                    let parm = _.cloneDeep(this.delayItem);
                    parm.scheduling_date = this.delayDate;
                    parm.created_user = this.$auth.$state.user.email;
                    parm.execute_time = null;
                    delete parm.original_date;
                    delete parm.id;
                    delete parm.action_name;
                    delete parm.action_remark;
                    delete parm.updated_user;
                    delete parm.index;
                    console.log('parm',parm);
                    var res = false;
                    res = await this.postDailyCheckList(parm);
                    setTimeout(()=>{
                        if(res) {
                            this.delayDialog = false;
                            this.searchPool();
                        }
                    },50)
                    // this.poolData.daily.forEach(d=>{
                    //     if(new Date(d.scheduling_date).getTime()==new Date(this.delayDate).getTime()) {
                    //         d.todo.push(this.delayItem);
                    //     }
                    // })
                }
                
            }
            
        },
        addEventOpen(date) {
            this.addItem = {
                name_ch:'',
                name_en:'',
                start_date: dayjs(new Date(date)).format("YYYY-MM-DD"),
                end_date: dayjs(new Date(date)).format("YYYY-MM-DD"),
                remark:'',
                estimate_member:0,
                estimate_spend:0,
                step_id:this.poolData.step_id
            };
            this.addDialog = true;
        },
        async submitAdd() {
            var valid = this.$refs.addform.validate();
            if(valid) {
                let item = {
                    "step_id": this.poolData.step_id,
                    "name_ch": this.addItem.name_ch,
                    "name_en": this.addItem.name_en,
                    "remark": this.addItem.remark,
                    "started_date": this.addItem.start_date,
                    "ended_date": this.addItem.end_date,
                    "estimated_member": 0,
                    "estimated_spend": 0,
                    "created_user": this.$auth.$state.user.email
                }
                var res = false;
                res = await this.postDailyCheckActionList(item);
                setTimeout(()=>{
                    if(res) {
                        this.addDialog=false;
                        this.searchPool();
                    }
                },50)
                // if(!this.actionInputShow) {
                    // let item = {
                    //     action_id: this.addItem.action_id,
                    //     scheduling_date: this.addItem.start_date,
                    //     execute_status: '0',// 0 尚未選擇,1 執行,2 不執行,
                    //     execute_time: null,
                    //     executor: '',
                    //     msg: '',
                    //     actual_member:0,
                    //     actual_spend:0,
                    //     created_user: this.$auth.$state.user.email
                    // }
                    // console.log('parm',item);
                    // var res = false;
                    // res = await this.postDailyCheckList(item);
                    // setTimeout(()=>{
                    //     if(res) {
                    //         this.addDialog=false;
                    //         this.getstepdata();
                    //     }
                    // },50)
                // }
                
                
                
                // this.poolData.daily.forEach(x=>{
                //     if(new Date(x.scheduling_date).getTime()>= new Date(this.addItem.start_date).getTime()&&
                //         new Date(this.addItem.end_date).getTime()>=new Date(x.scheduling_date).getTime()) {
                //         x.todo.push(item);
                //     }
                // })
                // this.addDialog=false;
            }
            
        },
        submitNextStep() {
            // 提示開啟隔天新工作的視窗
            this.nextStepDialog = false;
        },
        // 取得步驟清單
        getstepdata: async function () {
            let getBreedingStepList = await this.getBreedingStepList2();
            let stepData = typeof (getBreedingStepList)=='string'?[]:getBreedingStepList;
            this.stepdata = [];
            stepData.forEach(s=>{
                this.stepdata.push(s);
            })
            console.log('getStep',this.stepdata)
        },
        showstep() {
            if(!this.actionInputShow) {
                this.actionInputShow = true;
                this.addItem.action_id = null;
            }else {
                this.actionInputShow = false;
            }
            
        }
    },
    watch: {
    }
}
</script>

<style lang="scss" scoped>
.result {
    padding: 8px;
    overflow-x: scroll;
}
.result-content {
    display: flex;
    align-items: center;
    margin-top: 16px;
}
.v-card.result-card {
    display: flex;
    flex-direction: column;
    height: 70vh;
    width: 280px;
    min-width: 280px;
    margin-right: 16px;
    .card-title {
        border: none;
    }

}
.daily-content {
    overflow-y: scroll;
}
.daily-check{
    background-color: #fff;
    box-shadow: 0 0 4px rgba(0,0,0,0.1);
    // border-left: 4px solid $color-primary;
    margin: 4px 12px;
    margin-bottom: 8px;
    border-radius: 4px;
    padding: 4px;
    .check-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 8px;
        padding-top: 0;
        .title {
            .v-card__title {
                font-size: 1rem;
                padding: 0;
            }
        }
        .chrevon {
            span {
                margin-right: 4px;
                font-size: 0.85rem;
                &.delay {
                    color: $color-green;
                    text-decoration: underline;
                    cursor: pointer;
                }
                &.copy {
                    color: $color-primary;
                }
            }
            display: flex;
            align-items: center;
        }
    }
    .description {
        margin: 8px;
        margin-left: 12px;
        color: $color-dark-75;
    }
    .content {
        margin-top: 4px;
        padding-top: 8px !important;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        .excute {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .date,.excutor {
                display: inline-block;
            }
        }
    }
}
.calendar {
    display: flex;
    align-items: center;
}
::v-deep {
    .v-sheet.v-card.custom-dialog .v-textarea.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 4px;
        padding: 0 8px;
    }
    .v-sheet.v-card.custom-dialog .v-textarea.theme--light.v-text-field > .v-input__control > .v-input__slot:before,
    .v-sheet.v-card.custom-dialog .v-textarea.theme--light.v-text-field > .v-input__control > .v-input__slot:before, 
    .v-sheet.v-card.custom-dialog .v-textarea.theme--light.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before {
        border-color: transparent;
    }
    .v-dialog .v-sheet.v-card.custom-dialog .card-title {
        margin: 4px 16px;
    }

}


</style>