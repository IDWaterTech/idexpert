<template>
  <div>
    <v-row style="margin-bottom: 0;">
        <v-col cols="12" md="4" sm="6" style="padding: 0;">
            <div class="search flex-align-center" style="margin-left: 16px;margin-top: 8px;">
                <v-autocomplete v-model="nowCata" hide-details :items="cataSelect" @change="cataChange" style="min-width: 200px;">
                
                </v-autocomplete>
                
            </div>
        </v-col>
    </v-row>
    <v-row style="margin-bottom: 0;">
        <div class="content" style="padding: 0;margin-top: 24px;width: 100%;margin-right: 16px;margin-left: 16px;">
            <div class="result">
                <v-card class="result-card">
                    <div class="card-title">
                        <div class="title">
                            <v-card-title>{{nowCata}}清單</v-card-title>
                        </div>
                        <div class="chevon">
                            <v-btn class="btn-secondary green" @click="openAdd">新增{{nowCata}}</v-btn>
                        </div>
                    </div>
                    <div class="content">
                        <v-data-table light 
                            :headers="headers.filter(x => x.showmode.includes(nowCata))"
                            :items="nowData"
                            :no-data-text="'無資料'"
                            hide-default-footer
                            disable-pagination
                            style="overflow-y: scroll;height: 57vh;"
                            class="data-table bg-transparent">
                            <template v-slot:[`item.disease_chip`]="{ item }">
                                <div v-if="item.disease && item.disease.length>0" class="items">
                                    <v-chip
                                        v-for="(chip,cid) in item.disease"
                                        style="font-size: 12px;margin: 2px;color: #fff;"
                                        color="#408FBC"
                                        class="main"
                                        :key="'chip_'+chip.name_en+'_'+cid">  
                                        {{ chip.name_en }}
                                    </v-chip>
                                </div>
                                
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
                                <!-- <v-btn class="btn-icon delete" title="刪除" @click="delsubitem(mitem.id, index)">
                                    <v-icon>mdi-trash-can</v-icon>
                                </v-btn> -->
                            </template>
                        </v-data-table>
                    </div>
                </v-card>
            </div>
        </div>
    </v-row>
    <!-- 新增/編輯 -->
    <v-dialog v-model="editDialog" max-width="500px">
        <v-form v-model="editvalid" ref="addform">
            <v-card class="custom-dialog">
                <v-card-title class="add-title">
                    <div class="d-inline-block">
                        <span>{{ nowCata }}編輯</span> 
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
                    <v-card-text style="display: flex;padding-top: 0;">
                        <v-text-field
                            v-model="edititem.name_ch"
                            :rules="rules.require"
                            label="中文名稱"
                            placeholder="中文名稱"
                            autocompleted="false"
                            style="margin-right: 8px;"
                        ></v-text-field>
                        <v-text-field
                            v-model="edititem.name_en"
                            :rules="rules.require"
                            label="英文名稱"
                            placeholder="英文名稱"
                            autocompleted="false"
                            style="margin-right: 8px;"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-text v-if="nowCata=='疾病'" style="display: flex;padding-top: 0;">
                        <v-select
                            v-model="edititem.species_id"
                            :rules="rules.requireSelect"
                            :items="species"
                            :menu-props="{ maxHeight: '400' }"
                            multiple
                            chips
                            filled dense class="mt-0"
                            style="width: 100%;margin: 8px 0;"
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
                    <v-card-text style="display: flex;padding-top: 0;">
                        <v-textarea
                            filled 
                            v-model="edititem.remark"
                            placeholder="備註"
                            style="margin-right: 8px;"
                        ></v-textarea>
                    </v-card-text>
                </div>
                <v-card-actions>
                    <v-spacer spacer></v-spacer>
                    <v-btn class="btn-secondary" @click="editDialog = false">取消</v-btn>
                    <v-btn class="btn-primary" @click="save">{{edititem.created_time?'修改':'新增'}}</v-btn>
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
            cataSelect:['品種','疾病','檢驗'],
            nowCata: '品種',
            headers: [
                { text: '名稱(中)', value: 'name_ch', sortable: false,width:"10%",showmode: ['品種', '疾病','檢驗']},
                { text: '名稱(英)', value: 'name_en', sortable: false,width:"10%",showmode: ['品種', '疾病','檢驗']},
                // { text: '疾病感染', value: 'disease_chip', sortable: false,width:"20%",showmode: ['品種']},
                { text: '受感染品種', value: 'species_chip', sortable: false,width:"15%",showmode: ['疾病']},
                { text: '備註', value: 'remark', sortable: false,width:"15%",showmode: ['品種', '疾病','檢驗']},
                { text: '更新時間', value: 'updated_time', sortable: false,width:"10%",showmode: ['品種', '疾病','檢驗']},
                { text: '操作', value: 'udactions', sortable: false,width:"10%",showmode: ['品種', '疾病','檢驗']},
            ],
            nowData:[],
            editDialog: false,
            editvalid: false,
            edititem: {},
            rules: {
                require: [v => !!v || "*必要項目"],
                requireSelect: [v =>  !!v.length || "*必要項目"],
            },
            species:[]
        }
    },
    mounted() {
        this.cataChange();
    },
    methods:{
        cataChange() {
            if(this.nowCata == '檢驗') {
                this.getMethodData();
            }else {
                this.getSpeciesData();
            }
        },
        // 檢驗資料
        async getMethodData() {
            // await this.$axios
            //     .get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-method/`)
            //     .then(async res => {
            //         this.nowData = _.cloneDeep(res.data);
            //         console.log("檢驗方法清單:", res.request.responseURL);
            //         console.log('now Data',this.nowData);
            //     })
            //     .catch(error => {
            //         console.log("error:" + error.message);
            //     });
            let getMethodList = await this.getMethodList();
            let data = typeof (getMethodList)=='string'?[]:getMethodList;
            this.nowData = _.cloneDeep(data);
        },
        // 品種資料
        async getSpeciesData() {
            // await this.$axios
            //     .get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/species/`)
            //     .then(async res => {
            //         this.nowData = [];
            //         let data = res.data;
            //         this.species = _.cloneDeep(res.data);
            //         data.forEach(x=>{
            //             x.disease = [];
            //         })
            //         this.nowData = _.cloneDeep(data);
            //         if(this.nowCata=='疾病') {
            //             this.getDieaseData();
            //         }
                    
            //         console.log("物種清單:", res.request.responseURL);
            //         console.log('species',this.nowData);
            //     })
            //     .catch(error => {
            //     console.log("error:" + error.message);
            //     });
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
            this.editDialog = true;
            this.edititem = {};
            if(this.nowCata=='疾病') {
                this.edititem.species_id = [];
            }
        },
        openEdit(item) {
            this.editDialog = true;
            this.edititem = _.cloneDeep(item);
            if(this.nowCata=='疾病') {
                this.edititem.species_id = [];
                this.edititem.species.forEach(x=>{
                    this.species.forEach(s=>{   
                        if(x==s.name_ch) {
                            this.edititem.species_id.push(s.id);
                        }
                    })
                })
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
            if(this.edititem.created_time) {
                this.edit();
            }else {
                this.added();
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
            parm.created_user = this.$auth.$state.user.name;
            console.log(parm);
            let url = '';
            if(this.nowCata=='品種') {
                // url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/species/`
                res = await this.postSpeciesList(parm);
            }else if(this.nowCata=='疾病') {
                // url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease/`
                res = await this.postDiseaseList(parm);
            }else {
                // url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-method/`
                res = await this.postMethodList(parm);
            }
            setTimeout(()=>{
                if(res) {
                    this.editDialog = false;
                    this.cataChange();
                }
            },50)
            
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
    .card-title {
        padding: 12px 16px !important;
     
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