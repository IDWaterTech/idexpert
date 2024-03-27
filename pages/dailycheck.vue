<template>
    <div>
        <v-card class="bg-card" style="margin-bottom: 16px;padding-top: 8px;">
            <div class="content">
                <!-- 搜尋列 -->
                <div class="search" style="margin-bottom: 16px;">
                    <v-row style="margin-bottom: 0;align-items: center;padding-right: 16px;">
                        <!-- 搜尋 -->
                        <v-col cols="12" md="3" style="padding-bottom: 0;padding-top: 4px;">
                            <div class="search-container">
                                <locate-select 
                                    id="search"
                                    class="select-template"
                                    :dataScope="'area'" 
                                    defaultSelect="" 
                                    :isMulti="false"
                                    @scopeSel_data="get_scopeData($event);"></locate-select>
                            </div>
                        </v-col>
                        <!-- 展開/收合 -->
                        <v-col cols="12" md="9" v-if="poolData.length>0" style="width: 100%;">
                            <div class="open" style="float: right;">
                                <v-btn class="btn-icon just-icon" v-if="!nowExpand" title="展開" @click="nowExpand = true;">
                                    <v-icon style="font-size: 1.2rem;">mdi-view-dashboard</v-icon>
                                </v-btn>
                                <v-btn class="btn-icon just-icon" v-else title="收縮" @click="nowExpand = false;">
                                    <v-icon style="font-size: 1.2rem;">mdi-view-stream</v-icon>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </div>
                <div class="result" v-if="poolData.length>0">
                    <v-card class="result-card" v-for="pool in poolData" :key="pool.poolid" style="margin-bottom: 16px;">
                        <!-- 表頭 -->
                        <div class="card-title" @click="pool.open = !pool.open">
                            <div class="title">
                                <v-card-title>{{pool.poolname}}</v-card-title>
                            </div>
                            <div class="chevron">
                                <v-icon v-if="pool.open" >mdi-triangle-small-up</v-icon>
                                <v-icon v-else>mdi-triangle-small-down</v-icon>
                            </div>
                        </div>
                        <!-- daily check -->
                        <div class="content" v-show="pool.open">
                            <div class="todolist" v-for="(daily,id) in pool.daily" :key="pool.poolid+'_daily_'+id">
                                <div class="title" style="font-size: 14px  !important;" @click="daily.open = !daily.open">
                                    {{ daily.date }}
                                    <div class="chevron">
                                        <v-icon v-if="daily.open" >mdi-triangle-small-up</v-icon>
                                        <v-icon v-else>mdi-triangle-small-down</v-icon>
                                    </div>
                                </div>
                                
                                <v-data-table light
                                    v-if="daily.open"
                                    :headers="headers"
                                    :items="daily.todo"
                                    no-data-text=""
                                    hide-default-footer
                                    disable-pagination>
                                    <template  v-slot:[`item.execute`]="{item}">
                                        <div v-if="item.check==1">已執行</div>
                                        <div v-if="item.check==2">不執行</div>
                                        <div v-if="item.check==0">
                                            <v-btn class="btn-primary btn-small" :class="{'disabled':id!==0}" @click="openEdit(item,pool.poolid,daily.date,1)">執行</v-btn>
                                            <v-btn class="btn-secondary btn-small" :class="{'disabled':id!==0}" @click="openEdit(item,pool.poolid,daily.date,2)">不執行</v-btn>
                                        </div>
                                    </template>
                                    <!-- <template  v-slot:[`item.executor`]="{item}">
                                        {{ accdata.filter(x=>x.username==item.executor)[0].position+'-'+accdata.filter(x=>x.username==item.executor)[0].account_name }}
                                    </template> -->
                                    <template  v-slot:[`item.udactions`]="{item}">
                                        <v-tooltip bottom v-if="item.checkdate!==''">
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="btn-icon" @click="openEdit(item,pool.poolid,daily.date)" v-bind="attrs" v-on="on">
                                                    <v-icon>mdi-pencil</v-icon>
                                                </button>
                                            </template>
                                            <span>修改</span>
                                        </v-tooltip>
                                    </template>
                                </v-data-table>
                            </div>
                            
                        </div>
                    </v-card>
                </div>
                <div class="result" v-else>
                    <v-card class="result-card" style="height: 72vh;display: flex;align-items: center;justify-content: center;">
                        無資料
                    </v-card>
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
                            <div class="title" v-if="editItem.check!==0" style="display: flex;align-items: center;">
                                <span style="font-size: 14px;margin-right: 8px;">{{ editItem.check==1?'已執行':'不執行' }}</span>
                                <v-btn class="btn-secondary btn-small delete" @click="editItem.check = 0;editItem.remark=''">取消</v-btn>
                            </div>
                            <div class="title" v-else>
                                <v-btn class="btn-primary btn-small" @click="editItem.check=1">執行</v-btn>
                                <v-btn class="btn-secondary btn-small" @click="editItem.check=2">不執行</v-btn>
                            </div>
                        </div>
                        <div class="card-title" style="cursor: pointer;display: flex;flex-direction: column;align-items: flex-start;">
                            <div class="title"><v-card-title>說明 <span v-if="editItem.check==2" class="error-text" style="margin-left: 4px;">*不執行請填入原因</span></v-card-title></div>
                            <v-text-field v-model="editItem.remark" label="說明" autocomplete="off" style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                            </v-text-field>
                        </div>
                    </div>
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="editDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" :class="{'disabled':(editItem.check==2&&editItem.remark=='')}" @click="submitEdit">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    layout: "emptynologin2",
    head(){
        return {
            title:"每日任務",
            }
    },
    data() {
        return {
            poolData:[],
            headers:[
                { text: '項目', value: 'item', sortable: true,width:"10%"},
                { text: '執行', value: 'execute', sortable: true,width:"20%"},
                { text: '說明', value: 'remark', sortable: true,width:"20%"},
                { text: '時間', value: 'checkdate', sortable: false,width:"20%"},
                { text: '執行人員', value: 'executor_name', sortable: false,width:"20%"},
                { text: '操作', value: 'udactions', sortable: false,width:"10%"},
            ],
            footerProps: {
                "items-per-page-text": "每頁",
                "items-per-page-options": [10,25, 50, 75, 100]
            },
            nowExpand: true,
            editDialog: false,
            editItem:{},
            nowPoolid: null,
            nowDaily: null,
            accdata:[],
        }
    },
    created() {
        this.getaccList();//取得所有帳號，比對執行者用
    },
    methods: {
        // 取得所有帳號
        getaccList: async function() {
            let getuserData = await this.getUserList();
            var data = typeof (getuserData)=='string'?[]:getuserData;
            var data = typeof (await this.getUserList())=='string'?[]:await this.getUserList();
            var mydata = data.filter(x=>x.is_active == true).map(x=>({username:x.username,id:x.id,account_name:x.account_name,position:x.position[0].department}));//只要正常啟用帳號
            this.accdata = Object.assign([],mydata.filter(x=>x.id!==1));//排除特殊人物
        },
        get_scopeData:function(evt){
            console.log(evt);
            this.searchPool();
        },
        // 取得池dailycheck
        searchPool() {
            this.poolData = [
                {
                    poolid: 1,
                    poolname: 'A1',
                    open: true,
                    daily:[{
                        date: dayjs( new Date()).format("YYYY-MM-DD"),
                        open: true,
                        todo:[{
                            id: 5555,
                            item: '訂苗',
                            check: 1,// 0 尚未選擇,1 執行,2 不執行,
                            checkdate: '2024-03-08 13:02:04',
                            remark: '',
                            executor: 'shihya.hsu@idwater.com.tw',
                            executor_name: ''
                        },{
                            id: 6666,
                            item: '訂飼料',
                            check: 2,// 0 尚未選擇,1 執行,2 不執行,
                            checkdate: '2024-03-08 14:30:34',
                            remark: '飼料還有剩',
                            executor: 'shihya.hsu@idwater.com.tw',
                            executor_name: ''
                        },{
                            id: 7777,
                            item: '訂砂糖',
                            check: 0,// 0 尚未選擇,1 執行,2 不執行,
                            checkdate: '',
                            remark: '',
                            executor: '',
                            executor_name: ''
                        }]
                    },{
                        date: dayjs(new Date().getTime()+1000*60*60*24).format("YYYY-MM-DD"),
                        open: true,
                        todo:[{
                            id: 8888,
                            item: '清潔池',
                            check: 0,// 0 尚未選擇,1 執行,2 不執行,
                            checkdate: '',
                            remark: '',
                            executor: '',
                            executor_name: ''
                        },]
                    }]
                },
                {
                    poolid: 2,
                    poolname: 'A2',
                    open: true,
                    daily:[{
                        date: dayjs( new Date()).format("YYYY-MM-DD"),
                        open: true,
                        todo:[{
                            id: 5555,
                            item: '訂苗',
                            check: 0,// 0 尚未選擇,1 執行,2 不執行,
                            checkdate: '',
                            remark: '',
                            executor: '',
                            executor_name: ''
                        },{
                            id: 6666,
                            item: '訂飼料',
                            check: 0,// 0 尚未選擇,1 執行,2 不執行,
                            checkdate: '',
                            remark: '',
                            executor: '',
                            executor_name: ''
                        },{
                            id: 7777,
                            item: '訂砂糖',
                            check: 0,// 0 尚未選擇,1 執行,2 不執行,
                            checkdate: '',
                            remark: '',
                            executor: '',
                            executor_name: ''
                        }]
                    },{
                        date: dayjs(new Date().getTime()+1000*60*60*24).format("YYYY-MM-DD"),
                        open: true,
                        todo:[{
                            id: 8888,
                            item: '清潔池',
                            check: 0,// 0 尚未選擇,1 執行,2 不執行,
                            checkdate: '',
                            remark: '',
                            executor: '',
                            executor_name: ''
                        },]
                    }]
                }
            ]
            this.poolData.forEach(pool=>{
                pool.daily.forEach(d=>{
                    d.todo.forEach(t=>{
                        if(t.executor!=='') {
                            t.executor_name = this.accdata.filter(x=>x.username==t.executor)[0].position+'-'+this.accdata.filter(x=>x.username==t.executor)[0].account_name;
                        }
                        
                    })
                })
            })
        },
        openEdit(item,id,daily,num=0) {
            // 0 尚未選擇,1 執行,2 不執行,
            console.log('open',item,id);
            this.editItem = _.cloneDeep(item);
            this.nowPoolid = id;
            this.nowDaily = daily;
            if(num==1||num==2) {
                this.editItem.check = num;
            }
            if(this.editItem.executor=='') {
                if(num==2) {
                    this.editDialog = true;
                }else {
                    this.submitEdit();
                }
            }else {
                this.editDialog = true;
            }
            
            
        },
        submitEdit() {
            console.log('submit edit',this.editItem);
            this.editItem.checkdate = this.editItem.check==0?null:dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.editItem.executor = this.editItem.check==0?'':this.$auth.$state.user.email;
            this.editItem.remark = this.editItem.check==0?'':this.editItem.remark;
            this.editDialog = false;
            let data = _.cloneDeep(this.poolData);
            this.poolData = [];
            data.forEach(pool=>{
                if(pool.poolid==this.nowPoolid) {
                    pool.daily.forEach(d=>{
                        if(d.date==this.nowDaily) {
                            d.todo.forEach(x=>{
                                if(x.id==this.editItem.id) {
                                    x.check = this.editItem.check;
                                    x.checkdate = this.editItem.checkdate;
                                    x.remark = this.editItem.remark;
                                    x.executor = this.editItem.executor;
                                    if(x.executor!=='') {
                                        x.executor_name = this.accdata.filter(x=>x.username==this.editItem.executor)[0].position+'-'+this.accdata.filter(x=>x.username==this.editItem.executor)[0].account_name
                                    }else {
                                        x.executor_name = '';
                                    }
                                    
                                }
                            })
                        }
                    })
                }
            })
            this.poolData = data;
            console.log('poolData',data);
        },
    },
    watch: {
        nowExpand() {
            if(this.poolData.length>0) {
                this.poolData.forEach(x=>x.open= this.nowExpand);
            }
        }
    }
}
</script>

<style lang="scss" scoped>

.v-card.result-card {
    .card-title {
        padding: 4px 12px !important;
        cursor: pointer;
        .title {
            width: 100%;
            .v-card__title {
                font-size: 1rem;
                padding: 0;
            }
        }
        .chevron {
            .v-icon {
                color: $color-dark;
            }
        }      
    } 
}

::v-deep {
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
        background-color: rgba($color: $color-primary, $alpha: 0.1);
    }
    .theme--light.v-data-table {
        background-color: transparent;
    }

}


</style>