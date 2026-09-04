<template>
  <div>
    <v-row class="mb-0">
        <v-col cols="12" md="4" sm="6" class="pa-0">
            <div class="search flex-align-center ml-4 mt-2">
                   <v-autocomplete v-model="nowCata" hide-details :items="cataSelect" item-text="label"
                        item-value="value" @change="cataChange" style="min-width: 200px;">
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
                            <v-card-title @click="cataChange">{{cataSelect.filter(x => x.value === nowCata)[0]?.label || nowCata}}-清單</v-card-title>
                            <!-- <v-btn @click="cataChange">get!!</v-btn> -->
                        </div>
                        <div class="chevon">
                            <v-btn class="btn-secondary green" @click="openAdd">新增-{{cataSelect.filter(x => x.value === nowCata)[0]?.label || nowCata}}</v-btn>
                        </div>
                    </div>
                    <div class="content">
                        <v-data-table light 
                            :loading="loading"
                            :headers="headers.filter(x => x.showmode.includes(cataSelect.filter(x => x.value === nowCata)[0]?.label || nowCata))"
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
                                <div>{{ item.updated_user?.toString() }}</div>
                                <div>{{ item.updated_time }}</div>
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
    <!-- 新增/編輯 feedRateDialog 體重投餌率/觀察網常數 明細 -->
     <v-dialog v-model="feedRateDialog" max-width="500px" max-height="90vh">
        <v-card class="custom-dialog">
            <v-card-title class="add-title">
                <div class="d-inline-block">
                    <span>{{ cataSelect.filter(x => x.value === nowCata)[0]?.label || nowCata }}-編輯</span> 
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
                <v-card-text>
                    <div class="d-flex align-center">
                        <v-switch v-model="feedRateConfigItemsIsActive" label="是否啟用" filled dense class="my-1 mx-4"></v-switch>
                    </div>
                </v-card-text>
                <v-card-text>
                    <div class="d-flex align-center">
                        <v-text-field v-model="feedRateConfigItemsRemark" label="備註" filled dense class="my-1 mx-4"></v-text-field>
                        <!-- <v-text-field v-model="edititem.name" label="名稱" dense></v-text-field> -->
                    </div>
                    </v-card-text> 
                <v-card-text class="d-flex pt-0">
                       <v-row align="center">
                                <v-col cols="12" md="3" sm="3" v-if="checkTable==true">
                                    <v-text-field v-model="feedRateConfigADD.consecutive_days" label="連續天數"
                                        dense></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3" v-if="checkTable==false">
                                    <v-text-field v-model="feedRateConfigADD.min" label="起始值"
                                        dense></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" sm="3" v-if="checkTable==false">
                                    <v-text-field v-model="feedRateConfigADD.max" label="最終值"
                                        dense></v-text-field>
                                </v-col>
                            <v-col cols="12" md="3" sm="3">
                                <v-text-field v-model="feedRateConfigADD.value" label="數值/比率" dense></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3" sm="3" align="center">
                                <v-icon color="primary" @click="feedRateConfigADD = {
                                    consecutive_days: null,
                                    min: null,
                                    max: null,
                                    value: null
                                }">mdi-broom</v-icon>
                                <v-icon color="success" @click="feedRateConfigItemsAdd">mdi-plus-circle</v-icon>
                            </v-col>
                        </v-row>
  
                </v-card-text>
                <v-card-text>
                    {{ cataSelect.filter(x => x.value === nowCata)[0]?.label || nowCata }}<hr/>
                    <v-data-table light 
                        :headers="feedRateConfigHeaders.filter(x => x.showmode.includes(cataSelect.filter(x => x.value === nowCata)[0]?.label || nowCata))"
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
                        <span>{{ cataSelect.filter(x=>x.value==nowCata)[0]?.label || nowCata }}-{{ editDialogMode === 'add' ? '新增' : '編輯' }}</span> 
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
                        <v-text-field
                            v-model="edititem.remark"
                            :rules="rules.require"
                            label="備註"
                            placeholder="備註"
                            autocompleted="false"
                            class="mr-2"
                        ></v-text-field>
                        <v-switch
                            dense :disabled="true"
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
                    <!-- <v-card-text class="d-flex pt-0" v-show="false">
                        <v-textarea v-show="false"
                            filled 
                            v-model="edititem.remark"
                            placeholder="備註"
                            class="mr-2"
                        ></v-textarea>
                    </v-card-text> -->
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
            cataSelect:[{value: 'WEIGHT_FEED_RATIO', label: '體重投餌率'}],
            nowCata: '體重投餌率',
            loading: false,
            headers: [
                {text: 'ID', value: 'id', sortable: false,width:"10%", showmode: ['體重投餌率','縮放參數表','追料梯度和連續天數對照表','減料梯度和剩餘飼料量對照表','石灰和連續天數係數表']},
                {text: 'name', value: 'name', sortable: false,width:"10%", showmode: ['體重投餌率','縮放參數表','追料梯度和連續天數對照表','減料梯度和剩餘飼料量對照表','石灰和連續天數係數表']},
                {text: '版本號', value: 'version_number', sortable: false, showmode: ['體重投餌率','縮放參數表','追料梯度和連續天數對照表','減料梯度和剩餘飼料量對照表','石灰和連續天數係數表']},
                {text: '是否啟用', value: 'is_active', sortable: false, showmode: ['體重投餌率','縮放參數表','追料梯度和連續天數對照表','減料梯度和剩餘飼料量對照表','石灰和連續天數係數表']},
                {text: '備註', value: 'remark', sortable: false, showmode: ['體重投餌率','縮放參數表','追料梯度和連續天數對照表','減料梯度和剩餘飼料量對照表','石灰和連續天數係數表']},
                {text: '更新資訊', value: 'updated_user', sortable: false, showmode: ['體重投餌率','縮放參數表','追料梯度和連續天數對照表','減料梯度和剩餘飼料量對照表','石灰和連續天数係数表']},
                // {text: '更新時間', value: 'updated_time', sortable: false, showmode: ['體重投餌率']},
                { text: '操作', value: 'udactions', sortable: false,showmode: ['體重投餌率','縮放參數表','追料梯度和連續天數對照表','減料梯度和剩餘飼料量對照表','石灰和連續天數係數表'] },
                // {id: 'id', name: 'ID', version_number: 'id', is_active: false,updated_user: 'updated_user', updated_time: 'updated_time',showmode: ['體重投餌率']},
                
            ],
            nowData:[],//目前顯示資料
            feedRateDialog: false,//體重投餌率dialog
            feedRateConfigItemsID: null,//體重投餌率細項ID

            feedRateConfigADD: {
                consecutive_days: null,
                min: null,
                max: null,
                value: null,
            },//體重投餌率細項新增資料
            feedRateConfigItems: [],//體重投餌率設定細項
            feedRateConfigItemsIsActive:false,//體重投餌率細項是否啟用
            feedRateConfigItemsRemark:null,//體重投餌率細項備註
            feedRateConfigHeaders: [
                { text: 'ID', value: 'id', sortable: true , align: 'center',showmode: ['追料梯度和連續天數對照表','石灰和連續天數係數表','體重投餌率','縮放參數表','減料梯度和剩餘飼料量對照表']},
                { text: '連續天數', value: 'consecutive_days', sortable: false , align: 'center',showmode: ['追料梯度和連續天數對照表','石灰和連續天數係數表']},
                { text: '起始值', value: 'min', sortable: false , align: 'center',showmode: ['體重投餌率','縮放參數表','減料梯度和剩餘飼料量對照表']},
                { text: '最終值', value: 'max', sortable: false , align: 'center',showmode: ['體重投餌率','縮放參數表','減料梯度和剩餘飼料量對照表']},
                { text: '數值/比率', value: 'value', sortable: false , align: 'center',showmode: ['追料梯度和連續天數對照表','石灰和連續天數係數表','體重投餌率','縮放參數表','減料梯度和剩餘飼料量對照表'] },
                { text: '操作', value: 'actions', sortable: false,showmode: ['追料梯度和連續天數對照表','石灰和連續天數係數表','體重投餌率','縮放參數表','減料梯度和剩餘飼料量對照表'] },
            ],
            editDialog: false,
            editDialogMode: 'add',//add新增 edit編輯
            editvalid: false,
            edititem: {name:'',configs:[],version_number:'',is_active:true,remark:'',created_user:''},
            rules: {
                require: [v => !!v || "*必要項目"],
                requireSelect: [v =>  !!v.length || "*必要項目"],
            },
            species:[]
        }
    },
    mounted() {
        this.getFeedRate();//預設先取得體重投餌率資料
    },
    computed: {
        checkTable: function() {
            var x =['追料梯度和連續天數對照表', '石灰和連續天數係數表'].includes(this.cataSelect.filter(x => x.value === this.nowCata)[0]?.label || this.nowCata);

            return x;
        }
    },
    methods:{
        getCataSelectData:async function() {
            await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/v3/strategy-matrices/types/`)
            .then(res => {
                let data = typeof (res.data)=='string'?[]:res.data;
                this.cataSelect = _.cloneDeep(data);
                this.nowCata = this.cataSelect[0]?.value || '體重投餌率';
                // console.log("取得分類資料:", this.cataSelect);
                //[{value: 'WEIGHT_FEED_RATIO', label: '體重投餌率'}]
            })
            .catch(err => {
                this.$toast.error(`取得分類資料失敗，${err.message}`, { duration: 2000 });
                alert("取得分類資料失敗：" + err.message);
            });
        },
        cataChange() {
            // console.log(`cataChange > 目前分類:${this.nowCata}`);
            var x = this.cataSelect.filter(x => x.value === this.nowCata)[0]?.label || this.nowCata;
            switch(x) {
                case '體重投餌率':
                    this.getFeedRate();
                    break;
                case '縮放參數表':
                    this.getObConstants();//原觀察網常數
                    break;
                case '追料梯度和連續天數對照表':
                    this.getV3TableData();
                    break;
                default:
                    this.getV3TableData();
                    break;
            }
        },
        getV3TableData:async function() {
            var x = this.cataSelect.filter(x => x.value === this.nowCata)[0]?.label || this.nowCata;
            let url="";
            switch(x) {
                case '體重投餌率':
                    this.getFeedRate();
                    break;
                case '縮放參數表':
                    this.getObConstants();//原觀察網常數
                    break;
                case '追料梯度和連續天數對照表':
                    url= `feed-increases`;
                    break;
                case '減料梯度和剩餘飼料量對照表':
                    url= `feed-decreases`;
                    break;
                case '石灰和連續天數係數表':
                    url= `lime-multipliers`;
                    break;
            }
            this.nowData = [];
            this.loading = true;
            let apiUrl = this.$store.state.mydata.gobal_api.apiUrl;
            await this.$axios.get(`${apiUrl}/v3/strategy-matrices/${url}/`)
            .then(res => {
                let data = typeof (res.data)=='string'?[]:res.data;
                this.nowData = _.cloneDeep(data);
                // console.log(`${x} nowData:`, this.nowData);  
            })
            .catch(err => {
                this.$toast.error(`取得 ${x} 失敗，${err.response.data.messages.join()}`, { duration: 2000 });
                console.error(`取得 ${x} 資料失敗，${err.response.data.messages.join()}`, err);
            });
            this.loading = false;
        },
        // 縮放參數表 資料-清單
        async getObConstants() {
            this.nowData = [];
            this.loading = true;
            let apiUrl = this.$store.state.mydata.gobal_api.apiUrl;
            await this.$axios.get(`${apiUrl}/v3/strategy-matrices/scaling-factors/`)
            .then(res => {
                let data = typeof (res.data)=='string'?[]:res.data;
                this.nowData = _.cloneDeep(data);
                // console.log("縮放參數表URL:", res.request.responseURL);
                // console.log("縮放參數表資料:", this.nowData);
            })
            .catch(err => {
                this.$toast.error(`取得縮放參數表資料失敗，${err.response.data.messages.join()}`, { duration: 2000 });
                console.error(`取得縮放參數表資料失敗，${err.response.data.messages.join()}`, err);
            });
            this.loading = false;
        },
        // 體重投餌率資料-清單
        async getFeedRate() {
            this.nowData = [];
            this.loading = true;
            let apiUrl = this.$store.state.mydata.gobal_api.apiUrl;
            await this.$axios.get(`${apiUrl}/v3/strategy-matrices/weight-feed-ratios/`)
            .then(res => {
                let data = typeof (res.data)=='string'?[]:res.data;
                this.nowData = _.cloneDeep(data);
                // console.log("體重投餌率URL:", res.request.responseURL);
                // console.log("體重投餌率資料:", this.nowData);
            })
            .catch(err => {
                this.$toast.error(`取得體重投餌率資料失敗，${err.response.data.messages.join()}`, { duration: 2000 });
                console.error(`取得體重投餌率資料失敗，${err.response.data.messages.join()}`, err);
            });
            this.loading = false;
            
        },

        //體重投餌率細項資料操作
        async deleteFeedRateConfigItem(item) {
            var newData = _.cloneDeep(this.feedRateConfigItems.filter(x => x !== item));
            // var newData = _.cloneDeep(this.feedRateConfigItems.filter(x => x.id !== item.id));
            this.feedRateConfigItems = newData;
        },
        //將資料加入投餌率細項
        feedRateConfigItemsAdd() {
            this.feedRateConfigItems.push({
                consecutive_days: this.feedRateConfigADD.consecutive_days,
                min: this.feedRateConfigADD.min,
                max: this.feedRateConfigADD.max,
                value: this.feedRateConfigADD.value,
            });
                //清空新增欄位
                this.feedRateConfigADD = {
                    consecutive_days: null,
                    min: null,
                    max: null,
                    value: null,
                };
        },
        //儲存明細-體重投餌率細項
        async saveDetail(item) {
            //儲存體重投餌率細項
            // console.log('儲存體重投餌率細項ID:',this.feedRateConfigItemsID);
            // console.log('儲存體重投餌率細項(應該要被改的config):',this.feedRateConfigItems);
            var itemName = this.cataSelect.filter(x => x.value === this.nowCata)[0]?.label || this.nowCata;
            if (confirm(`確定儲存 ${itemName} id: ${this.feedRateConfigItemsID} 細項: ${this.feedRateConfigItems.length} 筆 ?`) == false) {
                return;
            }
            var updateData = {
                remark: this.feedRateConfigItemsRemark,
                is_active: this.feedRateConfigItemsIsActive,
                updated_user: this.$auth.$state.user.email,
                configs: _.cloneDeep(this.feedRateConfigItems)
            }
            var url = "";
            switch (itemName) {
                case '體重投餌率':
                    url = `strategy-matrices`;
                    break;
                case '縮放參數表':
                    url = `strategy-matrices`;
                    break;
                default:
                    url = `strategy-matrices`;
                    break;
            }
            let apiUrl = this.$store.state.mydata.gobal_api.apiUrl;
            await this.$axios.patch(`${apiUrl}/v3/${url}/${this.feedRateConfigItemsID}/`, updateData).then(res => {
                if (res.data.detail == 'Success') {
                    this.$toast.success(`修改成功`, {
                        duration: 2000
                    });
                    this.cataChange();//重新整理頁面
                    this.feedRateDialog = false;
                } else {
                    this.$toast.error(`修改失敗:${res.data.messages.join()}`, { duration: 2000 });
                    console.error(`修改失敗:${res.data.messages.join()}`, res);
                }
                // console.log(`修改-${itemName}細項API:${res.request.responseURL}`);
            }).catch(error => {
                this.$toast.error(`修改失敗:${error.response.data.messages.join()}`, { duration: 2000 });
                console.error(`修改失敗:${error.response.data.messages.join()}`, error);
            });
            
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
            var itemName = this.cataSelect.filter(x => x.value === this.nowCata)[0]?.label || this.nowCata;
            switch(itemName){
                    case '體重投餌率':
                        this.editDialogMode = 'add';
                        if(this.$refs.addform) {
                            this.edititem = {name:'',configs:[],version_number:'',is_active:true,remark:'',created_user:''};
                        }
                        // this.edititem.is_active = true;//強迫新資料預設為啟用
                        this.editDialog = true;
                        break;
                    case '縮放參數表':
                        this.editDialogMode = 'add';
                        if(this.$refs.addform) {
                            // this.$refs.addform.reset();
                            this.edititem = {name:'',configs:[],version_number:'',is_active:true,remark:'',created_user:''};
                        }
                        // this.edititem.is_active = true;//強迫新資料預設為啟用
                        this.editDialog = true;
                        break;
                    default:
                        this.editDialogMode = 'add';
                        if(this.$refs.addform) {
                            this.edititem = {name:'',configs:[],version_number:'',is_active:true,remark:'',created_user:''};
                        }
                        this.editDialog = true;
                        break;
            }
        },
        openEdit(item) {
            var x = this.cataSelect.filter(x => x.value === this.nowCata)[0]?.label || this.nowCata;
            switch(x) {
                case '體重投餌率':
                    this.feedRateDialog = true;
                    this.feedRateConfigItemsID = _.cloneDeep(item.id);
                    this.feedRateConfigItems = _.cloneDeep(item.configs);
                    this.feedRateConfigItemsRemark = _.cloneDeep(item.remark);
                    this.feedRateConfigItemsIsActive = _.cloneDeep(item.is_active);
                    break;
                case '縮放參數表':
                    this.feedRateDialog = true;
                    this.feedRateConfigItemsID = _.cloneDeep(item.id);
                    this.feedRateConfigItems = _.cloneDeep(item.configs);
                    this.feedRateConfigItemsRemark = _.cloneDeep(item.remark);
                    this.feedRateConfigItemsIsActive = _.cloneDeep(item.is_active);
                    break;
                case '追料梯度和連續天數對照表':
                    this.feedRateDialog = true;
                    this.feedRateConfigItemsID = _.cloneDeep(item.id);
                    this.feedRateConfigItems = _.cloneDeep(item.configs);
                    this.feedRateConfigItemsRemark = _.cloneDeep(item.remark);
                    this.feedRateConfigItemsIsActive = _.cloneDeep(item.is_active);
                    break;
                default:
                    this.feedRateDialog = true;
                    this.feedRateConfigItemsID = _.cloneDeep(item.id);
                    this.feedRateConfigItems = _.cloneDeep(item.configs);
                    this.feedRateConfigItemsRemark = _.cloneDeep(item.remark);
                    this.feedRateConfigItemsIsActive = _.cloneDeep(item.is_active);
                    break;
            }
            // console.log(`'${this.nowCata} item:'`, this.feedRateConfigItems);
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
                // this.edit();
                console.log('這裡沒有任何動作，請通知技術人員');
                alert('這裡沒有任何動作，請通知技術人員');
            }
        },
        async deleteItem(item) {
            var res = false;
            var title = item.name;
            var itemName = this.cataSelect.filter(x => x.value === this.nowCata)[0]?.label || this.nowCata;
            if (confirm(`確定刪除 ${itemName} name: ${title} , ID:${item.id} ?`)) {
                let url = "";
                switch (itemName) {
                    case '體重投餌率':
                        url = 'strategy-matrices';
                        break;
                    case '縮放參數表':
                        url = 'strategy-matrices';
                        break;
                    default:
                         url = 'strategy-matrices';
                        // this.$toast.error(`刪除失敗:分類 ${itemName} 無法刪除`, { duration: 2000 });
                        break;
                }
                console.log(`刪除 ${itemName} name: ${title} , ID:${item.id} API:${url}`);
                let apiUrl = this.$store.state.mydata.gobal_api.apiUrl;
                await this.$axios.delete(`${apiUrl}/v3/${url}/${item.id}/`).then(res => {
                    if (res.data.detail == 'Success') {
                        res = true;
                        this.$toast.success(`刪除成功`, {
                            duration: 2000
                        });
                    } else {
                        this.$toast.error(`刪除失敗:${res.data}`, { duration: 2000 });
                    }
                }).catch(error => {
                    this.$toast.error(`刪除失敗:${error.response.data.messages.join()}`, { duration: 3000 });
                    console.error(`刪除失敗:${error.response.data.messages.join()}`, error);
                }).finally(() => {
                    this.cataChange();
                });

            }

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
        },
        // 新增資料
        async added() {
            var res = false;
            if(!this.edititem.remark) {
                this.edititem.remark='';
            }
            let parm = _.cloneDeep(this.edititem);
            parm.created_user = this.$auth.$state.user.email;
            // console.log("新增參數:", parm);
            var url = "";
            var itemName = this.cataSelect.filter(x => x.value === this.nowCata)[0]?.label || this.nowCata;
            switch (itemName) {
                case '體重投餌率':
                    url = `weight-feed-ratios`;
                    break;
                case '縮放參數表':
                    url = `scaling-factors`;
                    break;
                case '追料梯度和連續天數對照表':
                    url = `feed-increases`;
                    break;
                case '減料梯度和剩餘飼料量對照表':
                    url = `feed-decreases`;
                    break;
                case '石灰和連續天數係數表':
                    url = `lime-multipliers`;
                    break;
                default:
                    this.$toast.error(`新增失敗:分類 ${itemName} 無法新增`, { duration: 2000 });
                    return;
            }
            let apiUrl = this.$store.state.mydata.gobal_api.apiUrl;
            await this.$axios.post(`${apiUrl}/v3/strategy-matrices/${url}/`, parm).then(res => {
                // console.log(`新增-${this.nowCata}API:` + res.request.responseURL);
                if (res.data.detail == 'Success') {
                    res = true;
                    this.$toast.success(`新增 ${itemName} 成功`, {
                        duration: 2000
                    });
                    this.editDialog = false;
                    this.cataChange();
                } else {
                    this.$toast.error(`新增失敗:${res.data.messages.join()}`, { duration: 2000 });
                }
            }).catch(error => {
                this.$toast.error(`新增失敗:${error.response.data.messages.join()}`, { duration: 3000 });
                console.error(`新增失敗:${error.response.data.messages.join()}`, error);
            });


        }
    },
    mounted() {
        this.getCataSelectData();
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