<template>
    <div>
        <v-row  v-if="filterTemplate.length>0">
            <v-col cols="12" md="4" sm="6" style="padding: 0;">
                <div class="search" style="display: flex;align-items: center;margin-left: 16px;margin-top: 8px;">
                    <v-autocomplete :disabled="editmode!=='edit'" v-model="tempSelect" hide-details dense filled :items="filterTemplate" item-text="name_ch" item-value="id" @change="tempChange" style="min-width: 200px;">
                    
                    </v-autocomplete>
                    
                </div>
            </v-col>
            <v-col cols="12" md="8" sm="6" style="padding: 0;">
                <div class="search" style="display: flex;align-items: center;margin-left: 16px;margin-top: 8px;">
                    <v-checkbox v-model="isEnable" label="顯示已停用樣板" @change="checkTemp" hide-details style="margin-right: 16px;"></v-checkbox>
                    <div class="chevron" style="display: flex;align-items: center;">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button :class="{'disabled':editmode=='edit'}" class="btn-icon" @click="editmode='edit';tempSelect= filterTemplate[0].id;tempChange();nowExpand = true;" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-pencil</v-icon>
                                </button>
                            </template>
                            <span>編輯樣板</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button :class="{'disabled':editmode=='add'}" class="btn-icon green" @click="editmode='add';tempSelect= '';nowExpand = true;" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-plus</v-icon>
                                </button>
                            </template>
                            <span>新增樣板</span>
                        </v-tooltip>
                        
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button :class="{'disabled':editmode!=='edit'}" class="btn-icon  delete" @click="delTemp" v-bind="attrs" v-on="on">
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
                                    <v-card-title v-if="editmode=='edit'">樣板編輯 <span v-if="tempSelect&&!filterTemplate.filter(x=>x.id==tempSelect)[0].is_enable" class="error-text"> - 此樣板已停用</span></v-card-title>
                                    <v-card-title v-if="editmode=='add'">樣板新增</v-card-title>
                                <!-- </v-col> -->
                                <!-- <v-col cols="8" md="8" sm="8" style="padding: 0 8px;"> -->
                                    <div class="btn-groups" style="margin-right: 8px;">
                                        <div class="open">
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
                                <FeedTemplate v-if="editmode=='add'" @action="actionResult" :templatemode="editmode" :accdata="[]" :nowExpand="nowExpand" :waterReport="[]" :diseaseReport="[]" :eventReport="[]"></FeedTemplate>
                                <FeedTemplate v-if="editmode=='edit'" @action="actionResult" :key="editKey" :templatemode="editmode" :passObj="passObj" :accdata="[]" :nowExpand="nowExpand" :waterReport="[]" :diseaseReport="[]" :eventReport="[]"></FeedTemplate>
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
            filterTemplate:[]
        }
    },
    methods: {
        actionResult:async function(val){
            if(val=='done'){
                this.editmode = undefined;
                
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
            var url=`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/${id}/`;
            await this.$axios
                .delete(url)
                .then(res => {
                    if (res.data == '刪除成功') {
                        this.$toast.success("刪除成功", { duration: 2000 });
                    }else{
                        this.$toast.error("刪除 error:" + res.data, { duration: 2000 });
                    }
                })
                .catch(error => {
                    this.$toast.error("刪除 error:" + error, { duration: 2000 });
                })
                .finally(() => {
                    // this.tempSelect = undefined;
                    this.getTemplateData();
                });
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
            var url=`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/`;
            await this.$axios
                .get(url)
                .then(res => {
                    this.template_items = res.data.map(x=>x.tempMain);
                    this.template_all = res.data;
                    
                    this.checkTemp();
                    
                })
              .finally(() => {
                /* 不論失敗成功皆會執行 */
              });
        },
        async cancelTemp(bool) {
            var id= this.tempSelect;
            let para = _.cloneDeep(this.passObj);
            para.tempMain.is_enable = bool;
            if (confirm((bool?"請確認是否啟用 - ":"請確認是否停用 - ") + para.tempMain.name_ch+"?")) {
                await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/${id}/`, para)
                .then(res => {
                    console.log(res);
                    if(res.data=='修改成功'){
                        this.$toast.success("修改成功", { duration: 2000 });
                        this.tempSelect = this.filterTemplate[0].id;
                        this.tempChange();
                        this.editmode = 'edit';
                    }else{
                        this.$toast.error("修改樣板失敗:" + res.data, { duration: 2000 });
                    }

                    console.log("修改樣板API:" + res.request.responseURL);
                })
                .catch(error => {
                    this.$toast.error("error:" + error, { duration: 2000 });
                })
                .finally(() => {
                    this.tempSelect = undefined;
                    this.getTemplateData();
                });
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