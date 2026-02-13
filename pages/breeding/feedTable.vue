<template>
  <div>
    <v-row class="mb-0">
        <v-col cols="12" md="4" sm="6" class="pa-0">
            <div class="search flex-align-center ml-4 mt-2">
                <v-autocomplete v-model="nowCata" hide-details :items="cataSelect" @change="cataChange" style="min-width: 200px;">
                
                </v-autocomplete>
                
            </div>
        </v-col>
    </v-row>
    <v-row class="mb-0">
        <div class="content pa-0 mt-6 mx-4 full-width">
            <div class="result">
                <v-card class="result-card">
                    <div class="card-title px-4 py-3">
                        <div class="title">
                            <v-card-title>{{nowCata}}清單</v-card-title>
                            <v-btn @click="getFeedRate">get</v-btn>
                        </div>
                        <div class="chevon">
                            <v-btn class="btn-secondary green" @click="openAdd">新增{{nowCata}}</v-btn>
                        </div>
                    </div>
                    <div class="content">
                        <v-data-table light 
                            :loading="loading"
                            :headers="headers.filter(x => x.showmode.includes(nowCata))"
                            :items="nowData"
                            :no-data-text="'無資料'"
                            hide-default-footer
                            disable-pagination
                            style="overflow-y: scroll;height: 57vh;"
                            class="data-table bg-transparent">
                            <template v-slot:[`item.is_active`]="{ item }">
                                <v-icon :color="item.is_active?'#4CAF50':'#BDBDBD'">
                                    {{ item.is_active?'mdi-check-circle':'mdi-close-circle' }}
                                </v-icon>
                            </template>
                            <template v-slot:[`item.updated_user`]="{ item }">
                                <div>{{ item.updated_user.split('@')[0] }}</div>
                            </template>
                            <template v-slot:[`item.species_chip`]="{ item }">
                                <div v-if="item.species && item.species.length>0" class="items">
                                    <v-chip
                                        v-for="(chip,cid) in item.species"
                                        style="font-size: 12px;margin: 2px;color: #fff;"
                                        color="#408FBC"
                                        class="main"
                                        :key="'chip_'+chip.name_en+'_'+cid">  
                                        {{ chip }}
                                    </v-chip>
                                </div>
                                
                            </template>
                            <template v-slot:[`item.udactions`]="{ item }">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn  class="btn-icon"
                                                title="編輯" 
                                                v-bind="attrs" v-on="on"
                                                style="pointer-events: inherit;"
                                                @click="openEdit(item)">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>編輯</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn  class="btn-icon delete"
                                                title="刪除" 
                                                v-bind="attrs" v-on="on"
                                                style="pointer-events: inherit;"
                                                @click="deleteItem(item)">
                                            <v-icon>mdi-trash-can</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>刪除</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </div>
                </v-card>
            </div>
        </div>
    </v-row>
    <!-- 新增/編輯 feedRateDialog 體重投餌率 明細 -->
     <v-dialog v-model="feedRateDialog" max-width="500px">
        <v-card class="custom-dialog">
            <v-card-title class="add-title">
                <div class="d-inline-block">
                    <span>{{ nowCata }}-編輯</span> 
                </div>
                <div class="add">
                    <v-btn class="btn-secondary close"
                            title="取消" 
                            @click="feedRateDialog = false;">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>
            </v-card-title>
            <div class="basic">
                <v-card-text class="d-flex pt-0">
                       <v-row align="center">
                            <v-col cols="12" md="3" sm="3">
                                <v-text-field v-model="feedRateConfigADD.min_weight" label="起始個體重(g)" dense></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3" sm="3">
                                <v-text-field v-model="feedRateConfigADD.max_weight" label="最終個體重(g)" dense></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3" sm="3">
                                <v-text-field v-model="feedRateConfigADD.feeding_rate" label="數值/比率" dense></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3" sm="3" align="center">
                                <v-icon color="primary" @click="feedRateConfigADD = {
                                    min_weight: null,
                                    max_weight: null,
                                    feeding_rate: null
                                }">mdi-broom</v-icon>
                                <v-icon color="success" @click="feedRateConfigItemsAdd">mdi-plus-circle</v-icon>
                            </v-col>
                        </v-row>
  
                </v-card-text>
                <v-card-text>
                    <v-data-table light 
                        :headers="feedRateConfigHeaders"
                        :items="feedRateConfigItems"
                        :no-data-text="'無資料'"
                        hide-default-footer
                        disable-pagination
                        style="overflow-y: scroll;height: 57vh;"
                        class="data-table bg-transparent">
                           <template v-slot:[`item.actions`]="{ item }">
                                <v-icon color="red" class="delete-icon" title="刪除"
                                    @click="deleteFeedRateConfigItem(item)">
                                    mdi-close-circle
                                </v-icon>
                            </template>
                        </v-data-table>
                    </v-card-text>
  
            </div>
            <v-card-actions>
                <v-spacer spacer></v-spacer>
                <v-btn class="btn-secondary" @click="feedRateDialog = false">取消</v-btn>
                <v-btn class="btn-primary" @click="saveDetail">儲存明細</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog> 
    <!-- 新增/編輯 editDialog -->
    <v-dialog v-model="editDialog" max-width="500px">
        <v-form v-model="editvalid" ref="addform">
            <v-card class="custom-dialog">
                <v-card-title class="add-title">
                    <div class="d-inline-block">
                        <span>{{ nowCata }}-{{ editDialogMode === 'add' ? '新增' : '編輯' }}</span> 
                    </div>
                    <div class="add">
                        <v-btn class="btn-secondary close"
                                title="取消" 
                                @click="editDialog = false;">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <div class="basic">
                    <v-card-text class="d-flex pt-0">
                        <v-text-field
                            v-model="edititem.name"
                            :rules="rules.require"
                            label="名稱(中)" dense
                            placeholder="中文名稱"
                            autocompleted="false"
                            class="mr-2"
                        ></v-text-field>
                        <!-- <v-text-field
                            v-model="edititem.name_en"
                            :rules="rules.require"
                            label="名稱(英)"
                            placeholder="英文名稱"
                            autocompleted="false"
                            class="mr-2"
                        ></v-text-field> -->
                        <v-text-field
                            v-model="edititem.version_number"
                            :rules="rules.require"
                            label="版本" dense
                            placeholder="版本號碼"
                            autocompleted="false"
                            class="mr-2"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-text>
                        <v-switch
                            dense
                            v-model="edititem.is_active"
                            label="是否啟用"
                            class="mt-4"
                        ></v-switch>
                    </v-card-text>
                    <v-card-text v-if="nowCata=='疾病'" class="d-flex pt-0">
                        <v-select
                            v-model="edititem.species_id"
                            :rules="rules.requireSelect"
                            :items="species"
                            :menu-props="{ maxHeight: '400' }"
                            multiple
                            chips
                            filled dense class="ma-0 mb-2 full-width"
                            label="感染品種"
                            item-value="id"
                            item-text="name_ch"
                            @change="select($event,false)"
                            >
                            <template
                                v-slot:selection="{ item }">
                                <v-chip
                                    style="font-size: 12px;margin: 2px;color: #fff;"
                                    color="#408FBC"
                                    class="main"
                                    close
                                    @click:close="select(item.id,true)"
                                >
                                {{ item.name_ch }}
                                </v-chip>
                                
                            </template>
                        </v-select>
                    </v-card-text>
                    <v-card-text class="d-flex pt-0">
                        <v-textarea
                            filled 
                            v-model="edititem.remark"
                            placeholder="備註"
                            class="mr-2"
                        ></v-textarea>
                    </v-card-text>
                </div>
                <v-card-actions>
                    <v-spacer spacer></v-spacer>
                    <v-btn class="btn-secondary" @click="editDialog = false">取消</v-btn>
                    <v-btn class="btn-primary" @click="save">{{editDialogMode=='add'?'新增':'修改'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
            
  </div>
</template>

<script>
export default {
    data() {
        return {
            cataSelect:['體重投餌率'],
            nowCata: '體重投餌率',
            loading: false,
            headers: [
                {text: 'ID', value: 'id', sortable: false,width:"10%", showmode: ['體重投餌率']},
                {text: 'name', value: 'name', sortable: false,width:"10%", showmode: ['體重投餌率']},
                {text: '版本號', value: 'version_number', sortable: false, showmode: ['體重投餌率']},
                {text: '是否啟用', value: 'is_active', sortable: false, showmode: ['體重投餌率']},
                {text: '更新者', value: 'updated_user', sortable: false, showmode: ['體重投餌率']},
                {text: '更新時間', value: 'updated_time', sortable: false, showmode: ['體重投餌率']},
                { text: '操作', value: 'udactions', sortable: false,showmode: ['體重投餌率']},
                // {id: 'id', name: 'ID', version_number: 'id', is_active: false,updated_user: 'updated_user', updated_time: 'updated_time',showmode: ['體重投餌率']},
                
            ],
            nowData:[],//目前顯示資料
            feedRateDialog: false,//體重投餌率dialog
            feedRateConfigItemsID: null,//體重投餌率細項ID

            feedRateConfigADD: {
                min_weight: null,
                max_weight: null,
                feeding_rate: null,
            },//體重投餌率細項新增資料
            feedRateConfigItems: [],//體重投餌率設定細項
            feedRateConfigHeaders: [
                { text: 'ID', value: 'id', sortable: true , align: 'center' },
                { text: '起始個體重(g)', value: 'min_weight', sortable: false , align: 'center' },
                { text: '最終個體重(g)', value: 'max_weight', sortable: false , align: 'center' },
                { text: '數值/比率', value: 'feeding_rate', sortable: false , align: 'center' },
                { text: '操作', value: 'actions', sortable: false },
            ],
            editDialog: false,
            editDialogMode: 'add',//add新增 edit編輯
            editvalid: false,
            edititem: {name:'',version_number:'',is_active:true,remark:'',created_user:''},
            rules: {
                require: [v => !!v || "*必要項目"],
                requireSelect: [v =>  !!v.length || "*必要項目"],
            },
            species:[]
        }
    },
    mounted() {
        this.getFeedRate();
        // this.cataChange();
    },
    methods:{
        cataChange() {
            if(this.nowCata == '體重投餌率') {
                this.getFeedRate();
            }
        },
        // 體重投餌率資料
        async getFeedRate() {
            this.nowData = [];
            this.loading = true;
            await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiKbUrl}/weight-feeding-rate-versions/`)
            .then(res => {
                let data = typeof (res.data)=='string'?[]:res.data;
                this.nowData = _.cloneDeep(data);
                console.log("體重投餌率URL:", res.request.responseURL);
                // console.log("體重投餌率資料:", this.nowData);
            })
            .catch(err => {
                this.$toast.error(`取得體重投餌率資料失敗，${err.message}`, { duration: 2000 });
                alert("取得體重投餌率資料失敗：" + err.message);
            });
            this.loading = false;
            
        },
        //體重投餌率細項資料操作
        async deleteFeedRateConfigItem(item) {
            var newData = _.cloneDeep(this.feedRateConfigItems.filter(x => x.id !== item.id));
            this.feedRateConfigItems = newData;
        },
        //將資料加入投餌率細項
        feedRateConfigItemsAdd() {
            this.feedRateConfigItems.push({
                min_weight: this.feedRateConfigADD.min_weight,
                max_weight: this.feedRateConfigADD.max_weight,
                feeding_rate: this.feedRateConfigADD.feeding_rate,
            });
                //清空新增欄位
                this.feedRateConfigADD = {
                    min_weight: null,
                    max_weight: null,
                    feeding_rate: null,
                };
        },
        async saveDetail(item) {
            //儲存體重投餌率細項
            // console.log('儲存體重投餌率細項ID:',this.feedRateConfigItemsID);
            // console.log('儲存體重投餌率細項(應該要被改的config):',this.feedRateConfigItems);
            var updateData = {
                updated_user: this.$auth.$state.user.email,
                configs: _.cloneDeep(this.feedRateConfigItems)
            }
            // console.log('儲存體重投餌率細項(updateData):',updateData);
            await this.$axios.patch(`${this.$store.state.mydata.gobal_api.apiKbUrl}/weight-feeding-rate-versions/${this.feedRateConfigItemsID}/`, updateData).then(res => {
                console.log('修改體重投餌率細項API回傳:', res.data);
                if(res.data.detail=='Success'){
                    this.$toast.success(`修改成功`, {
                        duration: 2000
                    });
                    this.getFeedRate();//儲存成功後重新取得體重投餌率資料
                }else{
                    this.$toast.error(`修改失敗:${res.data.messages.join()}`, { duration: 2000 });
                }
                console.log("修改體重投餌率細項API:" + res.request.responseURL);
            }).catch(error => {
                this.$toast.error(`修改失敗:${error}`, { duration: 2000 });
            });










            
            this.feedRateDialog = false;
        },
        // 品種資料
        async getSpeciesData() {
            let getSpeciesList = await this.getSpeciesList();
            let data = typeof (getSpeciesList)=='string'?[]:getSpeciesList;
            this.nowData = [];
            this.species = _.cloneDeep(data);
            data.forEach(x=>{
                x.disease = [];
            })
            this.nowData = _.cloneDeep(data);
            if(this.nowCata=='疾病') {
                this.getDieaseData();
            }
        },
        // 疾病資料
        async getDieaseData() {
            let apiURL = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease/`;
            let nownum = 0 ;
            this.nowData.forEach(async n=>{
                let parm = {
                    species_id: n.id,
                };
                // await this.$axios
                // .get(apiURL, { params: parm })
                // .then(res => {
                //     res.data.forEach(d=>{
                //         n.disease.push(d);
                        
                //     })
                //     nownum++;
                //     if(nownum == this.nowData.length) {
                //         if(this.nowCata == '疾病') {
                //             this.diseaseData();
                //         }
                //     }
                    
                //     console.log('疾病檢驗',res.data,nownum)
                //     console.log("檢驗疾病清單:", res.request.responseURL)
                // })
                // .catch(err => {
                //     alert("檢驗疾病失敗：" + err.message);
                // });
                let getDiseaseList = await this.getDiseaseList(parm);
                let data = typeof (getDiseaseList)=='string'?[]:getDiseaseList;
                data.forEach(d=>{
                    n.disease.push(d);
                    
                })
                nownum++;
                if(nownum == this.nowData.length) {
                    if(this.nowCata == '疾病') {
                        this.diseaseData();
                    }
                }
            })
            
            
        },
        diseaseData() {
            let data = _.cloneDeep(this.nowData);
            let disease = [];
            let diseasedata=[];
            // console.log('diseaseData',data);
            data.forEach(x=>{
                if(x.disease.length>0) {
                    x.disease.forEach(d=>{
                        if(!disease.includes(d.id)) {
                            disease.push(d.id);
                            diseasedata.push(d);
                        }
                        let i=disease.indexOf(d.id);
                        if(!diseasedata[i].species) {
                            diseasedata[i].species = [];
                        }
                        if(!diseasedata[i].species.includes(x.name_ch)) {
                            diseasedata[i].species.push(x.name_ch);
                        }
                    })
                    
                }
            })
            this.nowData = [];
            this.nowData = _.cloneDeep(diseasedata);
            console.log(this.nowData);

        },
        openAdd() {
            // this.editDialog = true;
            // this.edititem = {};
            // if(this.nowCata=='疾病') {
            //     this.edititem.species_id = [];
            // }
            if(this.nowCata=='體重投餌率') {
                this.editDialogMode = 'add';
                this.editDialog = true;
                
            }
        },
        openEdit(item) {
            if(this.nowCata=='體重投餌率') {
                this.feedRateDialog = true;
                this.feedRateConfigItemsID = _.cloneDeep(item.id);
                this.feedRateConfigItems = _.cloneDeep(item.configs);
                console.log('體重投餌率item:',this.feedRateConfigItems);
            }else {
                return;
            }
            
        },
        select(evt,bool) {
            console.log(evt)
            if(bool) {
                let index = this.edititem.species_id.indexOf(evt);
                this.edititem.species_id.splice(index,1);
            }else {
                
            }
        },
        save() {
            if(this.editDialogMode=='add') {
                this.added();
            }else {
                this.edit();
            }
        },
        async deleteItem(item) {
            let url = '';
            var res = false;
            var title = item.name_ch;
                if(confirm(`確定刪除 ${title} ?`)){
                    if(this.nowCata=='品種') {
                        // url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/species/${item.id}/`
                        res = await this.deleteSpeciesList(item.id);
                    }else if(this.nowCata=='疾病') {
                        // url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease/${item.id}/`
                        res = await this.deleteDiseaseList(item.id);
                    }else {
                        // url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-method/${item.id}/`
                        res = await this.deleteMethodList(item.id);
                    }
                    setTimeout(()=>{
                        if(res) {
                            this.cataChange();
                        }
                    },50)
                    
                }
            
            // await this.$axios.delete(url)
            //     .then((res)=>{
            //         if(res.data=='刪除成功'){
            //             this.cataChange();
            //             this.$toast.success(`刪除成功`, { duration: 2000 });
            //         }else{
            //             this.$toast.error(`刪除失敗:${res.data}`, { duration: 2000 });
            //         }
                    
            //         console.log("刪除:", res.request.responseURL);
            //     })
            //     .catch((err)=>{
            //         this.$toast.error(`刪除失敗，${res.data}`, { duration: 2000 });
            //     })
        },
        async edit() {
            // let url = '';
            var res = false;
            let parm = _.cloneDeep(this.edititem);
            parm.updated_user = this.$auth.$state.user.name;
            delete parm.created_user;
            delete parm.created_time;
            delete parm.id;
            delete parm.species;
            delete parm.updated_time;
            delete parm.disease;
            console.log(parm)
            if(this.nowCata=='品種') {
                // url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/species/${this.edititem.id}/`
                res = await this.patchSpeciesList(parm,this.edititem.id);
            }else if(this.nowCata=='疾病') {
                // url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease/${this.edititem.id}/`
                res = await this.patchDiseaseList(parm,this.edititem.id);
            }else {
                // url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-method/${this.edititem.id}/`
                res = await this.patchMethodList(parm,this.edititem.id);
            }
            setTimeout(()=>{
                if(res) {
                    this.editDialog = false;
                    this.cataChange();//取得清單
                }
            },50)
            // await this.$axios.patch(url, parm)
            //     .then(res => {
            //         if(res.data=='修改成功'){
            //             this.editDialog = false;
            //             this.cataChange();//取得清單
            //             this.$toast.success(`修改成功`, {
            //                 duration: 2000
            //             });
            //         }else{
            //             this.$toast.error(`修改失敗:${res.data}`, { duration: 2000 });
            //         }
            //         console.log("修改API:" + res.request.responseURL);
            //     })
            //     .catch(error => {
            //         this.$toast.error(`修改失敗:${error}`, { duration: 2000 });
            //     })
            //     .finally(() => {
            //         //this.getdata();
            //     });
        },
        async added() {
            var res = false;
            if(!this.edititem.remark) {
                this.edititem.remark='';
            }
            let parm = _.cloneDeep(this.edititem);
            parm.created_user = this.$auth.$state.user.email;
            console.log("新增參數:", parm);
            return;
            switch(this.nowCata) {
                case '體重投餌率':
                        await this.$axios.post(`${this.$store.state.mydata.gobal_api.apiKbUrl}/weight-feeding-rate-versions/`, parm).then(res => {
                            console.log('新增體重投餌率API回傳:', res.data);
                            if(res.data.detail=='Success'){
                                res = true;
                                this.$toast.success(`新增成功`, {
                                    duration: 2000
                                });
                            }else{
                                this.$toast.error(`新增失敗:${res.data.messages.join()}`, { duration: 2000 });
                            }
                            console.log("新增體重投餌率API:" + res.request.responseURL);
                        }).catch(error => {
                            this.$toast.error(`新增失敗:${error}`, { duration: 2000 });
                        });
                    break;
                
            }
            this.editDialog = false;
            this.cataChange();
            
            // await this.$axios.post(url, parm)
            //     .then(res => {
            //         if(res.data=='新增成功'){
            //             this.editDialog = false;
            //             this.cataChange();
            //             this.$toast.success(`新增成功`, {
            //                 duration: 2000
            //             });
            //         }else{
            //             this.$toast.error(`新增失敗:${res.data}`, { duration: 2000 });
            //         }
            //         console.log("新增API:" + res.request.responseURL);
            //     }).catch(error => {
            //         this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            //     })
            //     .finally(() => {
            //     });
        }
    }
}
</script>

<style lang="scss" scoped>
.v-card.result-card {
    &.item-card.theme--light {
        background-color: #fff;
    }
}
::v-deep {
    .v-dialog .v-sheet.v-card.custom-dialog .v-textarea.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
        border: 1px solid $color-black-10;
        border-radius: 4px;
        padding: 0 8px;
    }
}
</style>