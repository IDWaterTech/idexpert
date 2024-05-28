<template>
    <div>
        <v-row  v-if="filterTemplate.length>0">
            <v-col cols="12" md="4" sm="6" style="padding: 0;">
                <div class="search" style="display: flex;align-items: center;margin-left: 16px;margin-top: 8px;">
                    <v-autocomplete :disabled="editmode!=='edit'||isEditDefault" v-model="tempSelect" hide-details dense filled :items="filterTemplate" item-text="name_ch" item-value="id" @change="tempChange" style="min-width: 200px;">
                    
                    </v-autocomplete>
                    
                </div>
            </v-col>
            <v-col cols="12" md="8" sm="6" style="padding: 0;">
                <div class="search" style="display: flex;align-items: center;margin-left: 16px;margin-top: 8px;">
                    <v-checkbox v-model="isEnable" label="顯示已停用樣板" @change="checkTemp" hide-details style="margin-right: 16px;"></v-checkbox>
                    <div class="chevron" style="display: flex;align-items: center;">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button :class="{'disabled':editmode=='edit'&&!isEditDefault}" class="btn-icon" @click="editmode='edit';tempSelect= filterTemplate[0].id;tempChange();nowExpand = true;isEditDefault=false;" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-pencil</v-icon>
                                </button>
                            </template>
                            <span>編輯樣板</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button :class="{'disabled':editmode=='add'}" class="btn-icon green" @click="clickAdd();isEditDefault=false;" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-plus</v-icon>
                                </button>
                            </template>
                            <span>新增樣板</span>
                        </v-tooltip>
                        
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button :class="{'disabled':editmode!=='edit'||isEditDefault}" class="btn-icon  delete" @click="delTemp" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-trash-can</v-icon>
                                </button>
                            </template>
                            <span>刪除樣板</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="tempSelect&&filterTemplate.filter(x=>x.id==tempSelect)[0].is_enable">
                            <template v-slot:activator="{ on, attrs }">
                                <button :class="{'disabled':editmode!=='edit'}" class="btn-icon just-icon delete" @click="cancelTemp(false)" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-cancel</v-icon>
                                </button>
                            </template>
                            <span>停用</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="tempSelect&&!filterTemplate.filter(x=>x.id==tempSelect)[0].is_enable">
                            <template v-slot:activator="{ on, attrs }">
                                <button :class="{'disabled':editmode!=='edit'}" class="btn-icon just-icon green" @click="cancelTemp(true)" v-bind="attrs" v-on="on">
                                    <v-icon style="font-size: 1.5rem;">mdi-lock-open-check-outline</v-icon>
                                </button>
                            </template>
                            <span>啟用</span>
                        </v-tooltip>
                        <!-- <v-btn v-if="editmode=='edit'" class="btn-icon green" @click="editmode='add'"><v-icon>mdi-plus</v-icon></v-btn>
                        <v-btn v-if="editmode=='add'" class="btn-icon" @click="editmode='edit'"><v-icon>mdi-pencil</v-icon></v-btn>
                        <v-btn v-if="editmode=='edit'" class="btn-icon delete" @click="editmode='delTemp'"><v-icon>mdi-trash-can</v-icon></v-btn> -->
                    </div>
                </div>
            </v-col>
        </v-row>
        <div class="content" style="padding: 0;margin-top: 24px;margin-right: 16px;margin-left: 16px;">
            <div class="result">
                <v-card class="result-card">
                    <!-- 表頭 -->
                    <div class="card-title">
                        <div class="title">
                            <v-row style="align-items: center;margin-bottom: 0;justify-content: space-between;">
                                <!-- <v-col cols="4" md="4" sm="4" style="padding: 0;"> -->
                                    <!-- <v-card-title>養殖歷程</v-card-title> -->
                                    <v-card-title v-if="isEditDefault">預設樣板編輯</v-card-title>
                                    <v-card-title v-else-if="editmode=='edit' && !isEditDefault">樣板編輯 <span v-if="tempSelect&&!filterTemplate.filter(x=>x.id==tempSelect)[0].is_enable" class="error-text"> - 此樣板已停用</span></v-card-title>
                                    <v-card-title v-else-if="editmode=='add' && !isEditDefault">樣板新增</v-card-title>
                                    
                                <!-- </v-col> -->
                                <!-- <v-col cols="8" md="8" sm="8" style="padding: 0 8px;"> -->
                                    <div class="btn-groups" style="margin-right: 8px;">
                                        <div class="open">
                                            <v-btn v-if="!isEditDefault" class="btn-secondary" @click="clickTemp(1)">編輯預設樣板</v-btn>
                                            <v-btn v-if="isEditDefault" class="btn-secondary delete" @click="editmode='edit';tempSelect= filterTemplate[0].id;tempChange();nowExpand = true;isEditDefault=false;">取消編輯預設樣板</v-btn>
                                            <v-btn class="btn-icon just-icon" v-if="!nowExpand" title="展開" @click="nowExpand = true;">
                                                <v-icon style="font-size: 1.2rem;">mdi-view-dashboard</v-icon>
                                            </v-btn>
                                            <v-btn class="btn-icon just-icon" v-else title="收縮" @click="nowExpand = false;">
                                                <v-icon style="font-size: 1.2rem;">mdi-view-stream</v-icon>
                                            </v-btn>
                                        </div>
                                    </div>
                                    
                                <!-- </v-col> -->
                            </v-row>    
                        </div>
                    </div>
                    <div class="content">
                        <div class="search">
                            <!-- <v-autocomplete v-model="tempSelect" dense filled :items="template_items" item-text="name_ch" item-value="id" clearable @change="tempChange"> -->
                                <!-- <span slot="append-outer">
                                    <v-btn icon color="blue" @click="editmode='add'"  :disabled="tempSelect!=undefined" ><v-icon>mdi-plus-box</v-icon></v-btn>
                                </span>
                                <span slot="append-outer">
                                    <v-btn icon color="error" @click="delTemp" :disabled="tempSelect==undefined"><v-icon>mdi-delete</v-icon></v-btn>
                                </span> -->
                                <!-- <span slot="prepend">
                                    <v-btn icon color="blue" @click="getTemplateData"><v-icon>mdi-reload</v-icon></v-btn>
                                </span> -->
                            <!-- </v-autocomplete> -->
                            <div>
                                <FeedTemplate2 v-if="editmode=='add'" @action="actionResult" :templatemode="editmode" :accdata="[]" :nowExpand="nowExpand" :passObj="passObj"  :waterReport="[]" :diseaseReport="[]" :eventReport="[]"></FeedTemplate2>
                                <FeedTemplate2 v-if="editmode=='edit'" @action="actionResult" :key="editKey" :templatemode="editmode" :passObj="passObj" :accdata="[]" :nowExpand="nowExpand" :waterReport="[]" :diseaseReport="[]" :eventReport="[]"></FeedTemplate2>
                            </div>
                        </div>
                        
                    </div>
                </v-card>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
            editKey:0,
            template_items: [],//樣版清單
            template_all:[],
            tempSelect: undefined,//已選到的樣版
            editmode:undefined,//目前是要新增樣版還是編輯
            passObj:{},
            nowExpand: true,
            isEnable: false,
            filterTemplate:[],
            isEditDefault: false
        }
    },
    methods: {
        actionResult:async function(val){
            if(val=='done'){
                this.editmode = undefined;
                this.isEditDefault = false;
                await this.getTemplateData();//樣版清單
            }
        },
        // 選擇樣板
        tempChange:function(){
            if(this.tempSelect!=undefined){
                this.editmode='edit';
                this.editKey = Math.floor(Math.random() * 100);//隨機key值0~100
                var myMain =this.template_items.filter(x=>x.id==this.tempSelect)[0];
                var temp = this.template_all.filter(x=>x.tempMain==myMain)[0];
                this.passObj= _.cloneDeep(temp);
                this.passObj.tempContent.forEach(mitem=>{
                    mitem.stepList.forEach(step=>{
                        step.open = false;
                    })
                })
            }else{
                this.editmode=undefined;
                this.passObj={};
            }

        },
        //刪除樣板
        delTemp:async function(){
            if(confirm(`是否刪除？`)==false){
                return;
            }
            var id= this.tempSelect;
            var res = false;
            res = await this.deleteTemplateList2(id);
            setTimeout(()=>{
                if(res) {
                    this.getTemplateData();
                }
            },50)
            this.isEditDefault=false;
            
            // var url=`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/${id}/`;
            // await this.$axios
            //     .delete(url)
            //     .then(res => {
            //         if (res.data == '刪除成功') {
            //             this.$toast.success("刪除成功", { duration: 2000 });
            //         }else{
            //             this.$toast.error("刪除 error:" + res.data, { duration: 2000 });
            //         }
            //     })
            //     .catch(error => {
            //         this.$toast.error("刪除 error:" + error, { duration: 2000 });
            //     })
            //     .finally(() => {
            //         // this.tempSelect = undefined;
            //         this.getTemplateData();
            //     });
        },
        //樣版清單
        getTemplateData:async function () {
            // var data = [
            //     {
            //         id: 1,
            //         name_ch: "樣板AAAA",
            //         name_en: "template_a",
            //         remark: "this is a test",
            //         created_user: "jeff",
            //         created_time: "2022-11-03 12:02:37",
            //         updated_user: null,
            //         updated_time: "2022-11-03 12:02:37"
            //     }
            // ];
            this.tempSelect = undefined;
            // let getTemplateList = await this.getTemplateList();
            let getTemplateList = await this.getTemplateList2();
            let data = typeof (getTemplateList)=='string'?[]:getTemplateList;
            console.log('getTemplate',data);
            this.template_items = data.map(x=>x.tempMain).filter(y=>y.id!==1);
            this.template_all = data;
            this.checkTemp();
            // var url=`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/`;
            // await this.$axios
            //     .get(url)
            //     .then(res => {
            //         this.template_items = res.data.map(x=>x.tempMain);
            //         this.template_all = res.data;
                    
            //         this.checkTemp();
                    
            //     })
            //   .finally(() => {
            //     /* 不論失敗成功皆會執行 */
            //   });
        },
        async cancelTemp(bool) {
            var id= this.tempSelect;
            let para = _.cloneDeep(this.passObj);
            para.tempMain.is_enable = bool;
            if (confirm((bool?"請確認是否啟用 - ":"請確認是否停用 - ") + para.tempMain.name_ch+"?")) {
                var res = false;
                res = await this.patchTemplateList2(para,id);
                setTimeout(()=>{
                    if(res) {
                        this.tempSelect = this.filterTemplate[0].id;
                        this.tempChange();
                        this.editmode = 'edit';
                    }
                    this.tempSelect = undefined;
                    this.getTemplateData();
                },50)
                
                // await this.$axios
                // .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/${id}/`, para)
                // .then(res => {
                //     console.log(res);
                //     if(res.data=='修改成功'){
                //         this.$toast.success("修改成功", { duration: 2000 });
                //         this.tempSelect = this.filterTemplate[0].id;
                //         this.tempChange();
                //         this.editmode = 'edit';
                //     }else{
                //         this.$toast.error("修改樣板失敗:" + res.data, { duration: 2000 });
                //     }

                //     console.log("修改樣板API:" + res.request.responseURL);
                // })
                // .catch(error => {
                //     this.$toast.error("error:" + error, { duration: 2000 });
                // })
                // .finally(() => {
                //     this.tempSelect = undefined;
                //     this.getTemplateData();
                // });
            }
            
        },
        checkTemp() {
            console.log('Enable',this.isEnable,this.template_items)
            if(this.isEnable) {
                this.filterTemplate = _.cloneDeep(this.template_items);
            }else {
                this.filterTemplate = _.cloneDeep(this.template_items.filter(x=>x.is_enable==true));
            }
            if(this.filterTemplate.length>0) {
                this.tempSelect = this.filterTemplate[0].id;
                this.tempChange();
                this.editmode = 'edit';
            }else {
                this.editmode = 'add';
            }
        },
        async clickAdd() {
            this.editmode='add';
            this.tempSelect= '';
            this.nowExpand = true;
            this.passObj.tempMain={};
            // // 取得預設樣板
            // this.passObj.tempContent=[
            //     {
            //         "phase_id": 2,
            //         "phase_name": "養殖審核",
            //         "stepList": [
            //             {
            //                 "step_id": 1,
            //                 "step_name": "提交養殖計畫書",
            //                 "remark":"建立循環後系統給出",
            //                 "day":1,
            //                 "actions":[{
            //                     "step_id": 1,
            //                     "step_name": "預計購買苗量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 2,
            //                     "step_name": "預計購買次氯酸鈣量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 3,
            //                     "step_name": "預計購買海波量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 4,
            //                     "step_name": "預計購買尿素量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 5,
            //                     "step_name": "預計購買葵四量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 6,
            //                     "step_name": "預計購買弧立滅量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 7,
            //                     "step_name": "預計購買粉料量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 8,
            //                     "step_name": "預計購買0號料量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 9,
            //                     "step_name": "預計購買1號料量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 10,
            //                     "step_name": "預計購買紅料量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 11,
            //                     "step_name": "預計購買砂糖量",
            //                     "remark":"建立循環後系統給出",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },{
            //                 "step_id": 2,
            //                 "step_name": "採購",
            //                 "remark":"",
            //                 "day":1,
            //                 "actions":[{
            //                     "step_id": 12,
            //                     "step_name": "訂苗",
            //                     "remark":"聯絡廠商確定送苗時間",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 13,
            //                     "step_name": "購買次氯酸鈣",
            //                     "remark":"聯絡廠商下單",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 14,
            //                     "step_name": "購買海波",
            //                     "remark":"聯絡廠商下單",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 15,
            //                     "step_name": "購買葵四",
            //                     "remark":"聯絡廠商下單",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 16,
            //                     "step_name": "購買弧立滅",
            //                     "remark":"聯絡廠商下單",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 17,
            //                     "step_name": "購買粉料",
            //                     "remark":"聯絡廠商下單",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 18,
            //                     "step_name": "購買砂糖",
            //                     "remark":"聯絡廠商下單",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 }]
            //             },
                        
            //         ]
            //     },
            //     {
            //         "phase_id": 3,
            //         "phase_name": "備池",
            //         "stepList": [
            //             {
            //                 "step_id": 3,
            //                 "step_name": "檢查系統",
            //                 "remark":"建立循環後系統給出",
            //                 "day":1,
            //                 "actions":[{
            //                     "step_id": 19,
            //                     "step_name": "檢查進水系統",
            //                     "remark":"測試進水系統是否正常運作，管路、設備是否老舊失修",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 20,
            //                     "step_name": "檢查曝氣系統",
            //                     "remark":"測試曝氣系統是否正常運作，管路、設備是否老舊失修",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 21,
            //                     "step_name": "檢查排污系統",
            //                     "remark":"測試排污系統是否正常運作，管路、設備是否老舊失修",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },{
            //                 "step_id": 4,
            //                 "step_name": "使用農用噴霧器進行氯消毒",
            //                 "remark":"建立循環後系統給出",
            //                 "day":1,
            //                 "actions":[{
            //                     "step_id": 22,
            //                     "step_name": "池體",
            //                     "remark":"製備 30 ppm 次氯酸鈣水溶液噴灑於表面",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 23,
            //                     "step_name": "走道",
            //                     "remark":"製備 30 ppm 次氯酸鈣水溶液噴灑於表面",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },{
            //                 "step_id": 5,
            //                 "step_name": "使用農用噴霧器進行鹼消毒",
            //                 "remark":"建立循環後系統給出",
            //                 "day":1,
            //                 "actions":[{
            //                     "step_id": 24,
            //                     "step_name": "池體",
            //                     "remark":"製備飽和石灰水（pH14）溶液噴灑於表面",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 25,
            //                     "step_name": "走道",
            //                     "remark":"製備飽和石灰水（pH14）溶液噴灑於表面",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },
                        
            //         ]
            //     },
            //     {
            //         "phase_id": 4,
            //         "phase_name": "蓄水",
            //         "stepList": [
            //             {
            //                 "step_id": 6,
            //                 "step_name": "蓄水",
            //                 "remark":"",
            //                 "day":1,
            //                 "actions":[{
            //                     "step_id": 26,
            //                     "step_name": "池體注滿水",
            //                     "remark":"",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 27,
            //                     "step_name": "於池體內潑灑次氯酸鈣",
            //                     "remark":"系統給出次氯酸鈣用量，使水體滿足 30 ppm 次氯酸鈣水溶液",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 28,
            //                     "step_name": "開啟池子曝氣",
            //                     "remark":"",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },
                        
            //         ]
            //     },
            //     {
            //         "phase_id": 5,
            //         "phase_name": "做水",
            //         "stepList": [
            //             {
            //                 "step_id": 7,
            //                 "step_name": "做水",
            //                 "remark":"",
            //                 "day":7,
            //                 "actions":[{
            //                     "step_id": 29,
            //                     "step_name": "測定池水餘氯濃度",
            //                     "remark":"",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 30,
            //                     "step_name": "於池體內潑灑海波",
            //                     "remark":"系統根據水體餘氯濃度給出海波用量。",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 31,
            //                     "step_name": "醒菌",
            //                     "remark":"系統根據水體給出用量，並加入 9 倍重量鹽度與池水相同且消毒過的水進行醒菌",
            //                     "start":1,
            //                     "end":7,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 32,
            //                     "step_name": "潑灑尿素、砂糖",
            //                     "remark":"待海波潑灑1小時後，根據系統給出的尿素、砂糖進行潑灑",
            //                     "start":1,
            //                     "end":7,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 33,
            //                     "step_name": "潑灑益生菌",
            //                     "remark":"根據系統用量，以10倍重量之菌液進行潑灑。",
            //                     "start":1,
            //                     "end":7,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },
            //         ]
            //     },
            //     {
            //         "phase_id": 7,
            //         "phase_name": "放養中",
            //         "stepList": [
            //             {
            //                 "step_id": 8,
            //                 "step_name": "預備放養",
            //                 "remark":"",
            //                 "day":1,
            //                 "actions":[{
            //                     "step_id": 52,
            //                     "step_name": "準備氨氮水質機台",
            //                     "remark":"",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 53,
            //                     "step_name": "準備亞硝酸水質機台",
            //                     "remark":"",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 54,
            //                     "step_name": "準備鹽度計",
            //                     "remark":"",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 55,
            //                     "step_name": "準備手持式溶氧筆",
            //                     "remark":"",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 56,
            //                     "step_name": "準備體長體重測量工具",
            //                     "remark":"",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 57,
            //                     "step_name": "準備瑞基海洋疾病檢測套組",
            //                     "remark":"",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 58,
            //                     "step_name": "準備氧氣瓶",
            //                     "remark":"",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 59,
            //                     "step_name": "準備對水用具",
            //                     "remark":"每個池子適宜的對水工具不同，請廠長負責",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 60,
            //                     "step_name": "檢測苗袋內水體氨氮",
            //                     "remark":"紀錄苗袋資訊，以利後續跟苗商溝通",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 61,
            //                     "step_name": "檢測苗袋內水體亞硝酸",
            //                     "remark":"紀錄苗袋資訊，以利後續跟苗商溝通",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 62,
            //                     "step_name": "檢測苗袋內水體鹽度",
            //                     "remark":"紀錄苗袋資訊，以利後續跟苗商溝通",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 63,
            //                     "step_name": "檢測苗袋內水體溶氧及溫度",
            //                     "remark":"紀錄苗袋資訊，以利後續跟苗商溝通",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 64,
            //                     "step_name": "量長秤重",
            //                     "remark":"紀錄苗袋資訊，以利後續跟苗商溝通",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 65,
            //                     "step_name": "檢測蝦苗疾病",
            //                     "remark":"紀錄蝦苗檢測結果（WSSV、EMS toxic、EMS plasmid、EHP、INNV、IMNV、TSV、YHV），以利後續跟苗商溝通",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 66,
            //                     "step_name": "對水",
            //                     "remark":"待苗袋內的水體與池水水溫相同即可",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 67,
            //                     "step_name": "拆袋倒苗",
            //                     "remark":"待苗袋內的水體與池水水溫相同即可",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 68,
            //                     "step_name": "整理收拾",
            //                     "remark":"待苗袋內的水體與池水水溫相同即可",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },{
            //                 "step_id": 9,
            //                 "step_name": "粉料期",
            //                 "remark":"",
            //                 "day":14,
            //                 "actions":[{
            //                     "step_id": 69,
            //                     "step_name": "粉料期第一餐",
            //                     "remark":"系統給出該餐料量",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 70,
            //                     "step_name": "粉料期測水質",
            //                     "remark":"使用機台檢測池水氨氮、亞硝酸、pH值、塗盤、點菌等參數",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 71,
            //                     "step_name": "粉料期拌料",
            //                     "remark":"根據系統提供之商品、數量、方法進行拌料。",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 72,
            //                     "step_name": "粉料期醒菌",
            //                     "remark":"系統根據水體給出用量，並加入 9 倍重量鹽度與池水相同且消毒過的水進行醒菌",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 73,
            //                     "step_name": "粉料期第二餐",
            //                     "remark":"系統給出該餐料量",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 74,
            //                     "step_name": "粉料期潑灑益生菌",
            //                     "remark":"根據系統用量，以10倍重量之菌液進行潑灑。",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 75,
            //                     "step_name": "粉料期第三餐",
            //                     "remark":"系統給出該餐料量。",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 76,
            //                     "step_name": "粉料期第四餐",
            //                     "remark":"系統給出該餐料量。",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },{
            //                 "step_id": 10,
            //                 "step_name": "第一次打樣",
            //                 "remark":"",
            //                 "day":1,
            //                 "actions":[{
            //                     "step_id": 77,
            //                     "step_name": "第一次打樣",
            //                     "remark":"放養第12~16天，進行蝦隻長度測量及群秤",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },{
            //                 "step_id": 11,
            //                 "step_name": "粉料期",
            //                 "remark":"",
            //                 "day":14,
            //                 "actions":[{
            //                     "step_id": 78,
            //                     "step_name": "粉料期第一餐",
            //                     "remark":"系統給出該餐料量",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 79,
            //                     "step_name": "粉料期測水質",
            //                     "remark":"使用機台檢測池水氨氮、亞硝酸、pH值、塗盤、點菌等參數",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 80,
            //                     "step_name": "粉料期排污",
            //                     "remark":"根據系統提供之排污時數進行排污。",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 81,
            //                     "step_name": "粉料期拌料",
            //                     "remark":"根據系統提供之商品、數量、方法進行拌料。",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 82,
            //                     "step_name": "粉料期醒菌",
            //                     "remark":"系統根據水體給出用量，並加入 9 倍重量鹽度與池水相同且消毒過的水進行醒菌。",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 83,
            //                     "step_name": "粉料期第二餐",
            //                     "remark":"系統給出該餐料量",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 84,
            //                     "step_name": "粉料期蝦隻觀察",
            //                     "remark":"對觀察網上的蝦隻進行觀察，並將蝦況提供給系統",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 85,
            //                     "step_name": "粉料期潑灑益生菌",
            //                     "remark":"根據系統用量，以10倍重量之菌液進行潑灑。",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 86,
            //                     "step_name": "粉料期第三餐",
            //                     "remark":"系統給出該餐料量",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 87,
            //                     "step_name": "粉料期排污",
            //                     "remark":"根據系統提供之排污時數進行排污。",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 88,
            //                     "step_name": "粉料期第四餐",
            //                     "remark":"系統給出該餐料量",
            //                     "start":1,
            //                     "end":14,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },{
            //                 "step_id": 12,
            //                 "step_name": "第二次打樣",
            //                 "remark":"",
            //                 "day":1,
            //                 "actions":[{
            //                     "step_id": 89,
            //                     "step_name": "第二次打樣",
            //                     "remark":"距第一次打樣後 1 週，進行蝦隻長度測量及群秤",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             },
                        
                    
            //         ]
            //     },
            //     {
            //         "phase_id": 8,
            //         "phase_name": "清池",
            //         "stepList": [
            //             {
            //                 "step_id": 13,
            //                 "step_name": "清池",
            //                 "remark":"",
            //                 "day":1,
            //                 "actions":[{
            //                     "step_id": 90,
            //                     "step_name": "高壓水槍沖洗池壁",
            //                     "remark":"將養殖期間的附著物清除",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 91,
            //                     "step_name": "高壓水槍沖洗曝氣盤",
            //                     "remark":"將養殖期間的附著物清除",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 92,
            //                     "step_name": "高壓水槍沖洗管線",
            //                     "remark":"將養殖期間的附著物清除",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 93,
            //                     "step_name": "高壓水槍沖觀察網",
            //                     "remark":"將養殖期間的附著物清除",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },{
            //                     "step_id": 94,
            //                     "step_name": "大管水沖洗池底",
            //                     "remark":"將高壓水槍沖洗下的附著物沖進排污管道",
            //                     "start":1,
            //                     "end":1,
            //                     "estimate_member": 0,
            //                     "estimate_spend":0
            //                 },]
            //             }
                        
            //         ]
            //     }
            // ];
            let getTemplateList = await this.getTemplateList2(true);
            let data = typeof (getTemplateList)=='string'?[]:getTemplateList;
            this.passObj.tempContent = data[0].tempContent;
            // console.log('Add',this.passObj.tempContent)
            this.passObj.tempContent.forEach(mitem=>{
                // 計算各階段的天數
                mitem.day=0;
                // 各工作預設為收起，並計算各工作天數
                mitem.stepList.forEach(step=>{
                    step.open = false;
                    if(step.actionList&&step.actionList.length>0) {
                        // mitem.day+=step.actionList[step.actionList.length-1].end_on_which_day;
                        mitem.day+=((step.actionList[step.actionList.length-1].end_on_which_day-step.actionList[0].start_on_which_day)+1);
                    }
                    
                })
            })

        },
        clickTemp(id) {
            this.passObj = {};
            var tempid = this.template_all.map(x=>x.tempMain).filter(y=>y.id==1)[0];
            var temp = this.template_all.filter(x=>x.tempMain==tempid)[0];
            this.passObj= _.cloneDeep(temp);
            this.passObj.tempContent.forEach(mitem=>{
                // 計算各階段的天數
                mitem.day=0;
                mitem.stepList.forEach(step=>{
                    step.open = false;
                    if(step.actionList&&step.actionList.length>0) {
                        // mitem.day+=step.actionList[step.actionList.length-1].end_on_which_day;
                        mitem.day+=((step.actionList[step.actionList.length-1].end_on_which_day-step.actionList[0].start_on_which_day)+1);
                    }
                })
            })
            this.editmode='edit';
            this.isEditDefault = true;
        }
    },
    async mounted() {
        await this.getTemplateData();//樣版清單
    },
}
</script>

<style lang="scss" scoped>
.v-card.result-card {
    &.item-card.theme--light {
        background-color: #fff;
    }
    .card-title {
        padding: 12px 16px !important;
     
    } 
}
::v-deep {
    .theme--light.v-data-table {
        background-color: transparent;
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
        background-color: rgba($color: $color-primary, $alpha: 0.1);
    }
}
</style>