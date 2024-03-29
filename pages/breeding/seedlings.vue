<template>
    <div>
        <v-overlay :value="!isLoading" :absolute="true">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <div class="content" style="padding: 0;margin-top: 24px;margin-right: 16px;margin-left: 16px;">
            <div class="result">
                <v-card class="result-card">
                    <!-- 表頭 -->
                    <div class="card-title">
                        <div class="title">
                            <v-card-title>種苗清單</v-card-title>
                        </div>
                        <div class="chevron" style="display: flex;align-items: center;margin-left: 8px;">
                            <v-btn class="btn-secondary green" @click="openAdd" style="padding: 0 8px;">
                                <v-icon>mdi-plus</v-icon>新增種苗
                            </v-btn>
                            <!-- <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button class="btn-secondary green" @click="openAdd" v-bind="attrs" v-on="on">
                                        <v-icon>mdi-plus</v-icon>新增種苗
                                    </button>
                                </template>
                                <span>新增種苗</span>
                            </v-tooltip> -->
                            <!-- <v-btn class="btn-icon green" @click="openAdd"><v-icon>mdi-plus</v-icon></v-btn> -->
                            <!-- <v-icon v-if="listOpen">mdi-triangle-small-up</v-icon>
                            <v-icon v-if="!listOpen">mdi-triangle-small-down</v-icon> -->
                        </div>
                    </div>
                    <div class="content">
                        <v-data-table light 
                            :headers="headers"
                            :items="SeedlingData"
                            no-data-text=""
                            hide-default-footer
                            disable-pagination
                            style="height: 64vh;overflow-y: scroll;"
                            class="data-table bg-transparent">
                            <template v-slot:[`item.species_id`]="{item}">
                                <span v-if="item.species_id">{{ species.filter(x=>x.id==item.species_id)[0].name_ch }}</span>
                            </template>
                            <template v-slot:[`item.manufacturer_id`]="{item}">
                                <span v-if="manu.length>0">{{ manu.filter(x=>x.id==item.manufacturer_id)[0].name_ch }}</span>
                            </template>
                            <template  v-slot:[`item.udactions`]="{item}">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <button class="btn-icon" @click="openEdit(item.id)" v-bind="attrs" v-on="on">
                                            <v-icon>mdi-pencil</v-icon>
                                        </button>
                                    </template>
                                    <span>修改</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <button class="btn-icon delete" @click="delSeedling(item.id)" v-bind="attrs" v-on="on">
                                            <v-icon>mdi-trash-can</v-icon>
                                        </button>
                                    </template>
                                    <span>刪除</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </div>
                    
                </v-card>
            </div>
        </div>
        
        <v-dialog v-model="dialog.seedForm"  max-width="500px">
            <v-form  ref="manform"
                v-model="manvalid"
                >
                <v-card class="custom-dialog">
                    <v-card-title class="add-title" style="display: block;width: 100%;">
                        <div v-if="seedFormData.mode=='add'" style="display: inline-block;">
                            新增種苗
                        </div>
                        <div v-else style="display: inline-block;">
                            修改種苗
                        </div>
                        <div class="add" style="float: right;display: inline-block;">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="dialog.seedForm = false" 
                                    style="border: none;min-width: 0;padding: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <!-- <v-divider></v-divider> -->
                    <v-card-text class="pt-5">
                        <v-text-field filled dense v-model="seedFormData.name_ch" :rules="rules.require">
                            <span style="width:100px" slot="prepend">名稱(中)</span>
                        </v-text-field>
                        <v-text-field filled dense v-model="seedFormData.name_en" :rules="rules.require">
                            <span style="width:100px" slot="prepend">名稱(英)</span>
                        </v-text-field>
                        <v-text-field filled dense v-model="seedFormData.origin" :rules="rules.require">
                            <span style="width:100px" slot="prepend">產地</span>
                        </v-text-field>
                        <v-text-field filled dense v-model="seedFormData.characteristic" :rules="rules.require">
                            <span style="width:100px" slot="prepend">品牌特性</span>
                        </v-text-field>
                        <v-autocomplete v-model="seedFormData.species_id" :rules="rules.require" style="width" :items="species" item-text="name_ch" item-value="id" dense filled
                            label="選擇品種" clearable><span style="width:100px" slot="prepend">品種<v-icon class="mx-1" @click="getSpeciesData(true)">
                                    mdi-reload</v-icon></span></v-autocomplete>
                        <v-autocomplete v-model="seedFormData.manufacturer_id" :rules="rules.require" style="width" :items="manu" item-text="name_ch" item-value="id" dense filled
                            label="選擇廠商" clearable><span style="width:100px" slot="prepend">廠商id<v-icon class="mx-1" @click="getmanudata">
                                    mdi-reload</v-icon></span></v-autocomplete>
                        <v-text-field filled dense v-model="seedFormData.remark">
                            <span style="width:100px" slot="prepend">備註</span>
                        </v-text-field>
                        <v-text-field filled dense v-model.number="seedFormData.price" :rules="rules.requireNum" type="number">
                            <span style="width:100px" slot="prepend">市價</span>
                        </v-text-field>
                        <v-text-field dense disabled v-model="seedFormData.updated_time" :rules="rules.require" v-if="seedFormData.mode=='edit'" >
                            <span style="width:100px" slot="prepend">修改時間</span>
                        </v-text-field>
                    </v-card-text>
                    <!-- <v-divider></v-divider> -->
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <v-btn tile @click="dialog.seedForm = false" class="btn-secondary">取消</v-btn>
                        <v-btn tile @click="editsave" v-if="seedFormData.mode=='edit'" class="btn-primary">修改</v-btn>
                        <v-btn tile @click="addsave" v-if="seedFormData.mode=='add'" class="btn-primary">新增</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

    </div>
</template>

<script>
    export default {
        layout: "emptynologin",
        middleware: "auth",
        data() {
            return {
                rules: {
                    require: [v => !!v || "*必要項目"],
                    requireNum:[v=>(!isNaN(v) && v != undefined  && typeof(v) == "number" && v >= 0)|| "*請輸入>=0數字"]
                },
                SeedlingModel:'',
                SeedlingData:[],
                dialog:{
                    seedForm:false
                },
                seedFormData:{
                    mode:'add',
                    id:'',
                    name_ch: "",
                    name_en: "",
                    origin: "",
                    characteristic: "",
                    manufacturer_id: null,
                    remark: "",
                    price: 0.0,
                    created_user: "",
                    created_time: "",
                    updated_user: null,
                    updated_time: "",
                    species_id: null
                },
                manvalid: true,
                //廠商
                manu:[{
                    address: "",
                    contact: "",
                    created_time: "",
                    created_user: "",
                    id: undefined,
                    name_ch: "",
                    name_en: "",
                    phone: "",
                    remark: null,
                    tax_id: "",
                    updated_time: "",
                    updated_user: ""}],
                headers:[
                    { text: '名稱(中)', value: 'name_ch', sortable: true,width:"10%"},
                    { text: "名稱(英)", value: "name_en", groupable: false, sortable: true,width:"10%"},
                    { text: "產地", value: "origin", groupable: false, sortable: true,width:"10%"},
                    { text: "品種", value: "species_id", groupable: false, sortable: false,width:"5%"},
                    { text: "品牌特行", value: "characteristic", groupable: false, sortable: false,width:"15%"},
                    { text: '廠商', value: 'manufacturer_id', sortable: true,width:"10%"},
                    { text: '市價', value: 'price', sortable: true,width:"5%"},
                    { text: '備註', value: 'remark', sortable: false,width:"10%"},
                    { text: '修改時間', value: 'updated_time', sortable: true,width:"15%"},
                    { text: '操作', value: 'udactions', sortable: false,width:"10%"},
                ],
                species:[],
                isLoading: false
            }
        },
        methods: {
            // 品種資料
            async getSpeciesData(bool=false) {
                await this.$axios
                    .get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/species/`)
                    .then(async res => {
                        this.species = _.cloneDeep(res.data);
                        console.log("物種清單:", res.request.responseURL);
                        console.log('species',this.nowData);
                    })
                    .catch(error => {
                        console.log("error:" + error.message);
                    })
                    .finally(()=>{
                        if(!bool) {
                            this.getSeedlingData();//取得苗清單
                        }
                        
                    })
            },
            addsave:async function(){
                let val = this.$refs.manform.validate();
                if(val){
                    var parm = {
                        name_ch: this.seedFormData.name_ch,
                        name_en: this.seedFormData.name_en,
                        origin: this.seedFormData.origin,
                        characteristic: this.seedFormData.characteristic,
                        manufacturer_id: this.seedFormData.manufacturer_id,
                        remark: this.seedFormData.remark,
                        price: this.seedFormData.price,
                        created_user: this.$auth.$state.user.email,
                        species_id: this.seedFormData.species_id
                    };
                    let url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/seedling/`;
                    await this.$axios.post(url, parm).then(res => {
                        if(res.data=='新增成功'){
                            this.dialog.seedForm = false;
                            this.getSeedlingData();//取得苗清單
                            this.$toast.success(`新增成功`, {
                                duration: 2000
                            });
                        }else{
                            this.$toast.error(`新增失敗:${res.data}`, { duration: 2000 });
                        }
                        console.log("新增API:" + res.request.responseURL);
                    }).catch(error => {
                        this.$toast.error(`新增失敗:${error}`, { duration: 2000 });
                    })
                        .finally(() => {
                            //this.getdata();
                        });
                }
            },
            //刪除
            delSeedling:async function(evt){
                this.SeedlingModel = evt;
                var title = this.SeedlingData.filter(x=>x.id==this.SeedlingModel)[0].name_ch;
                if(confirm(`確定刪除? [${title}]`)){
                    var id = this.SeedlingModel;
                    let url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/seedling/${id}/`;
                    await this.$axios
                        .delete(url)
                        .then(res => {
                            if(res.data=='刪除成功'){
                                this.getSeedlingData();//取得苗清單
                                this.$toast.error(`刪除成功`, { duration: 2000 });
                            }else{
                                this.$toast.error(`刪除失敗:${error}`, { duration: 2000 });
                            }
                        })
                        .catch(error => {
                            this.$toast.error(`刪除失敗:${error}`, { duration: 2000 });
                        })
                        .finally(() => {
                            //this.getdata();
                        });
                }
            },
            //編輯
            editsave:async function(){
                let val = this.$refs.manform.validate();
                if(val){
                    var parm = {
                        name_ch: this.seedFormData.name_ch,
                        name_en: this.seedFormData.name_en,
                        origin: this.seedFormData.origin,
                        characteristic: this.seedFormData.characteristic,
                        manufacturer_id: this.seedFormData.manufacturer_id,
                        remark: this.seedFormData.remark,
                        price: this.seedFormData.price,
                        species_id: this.seedFormData.species_id,
                        updated_user: this.$auth.$state.user.email
                    };
                    var id = this.seedFormData.id;
                    let url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/seedling/${id}/`;
                    await this.$axios.patch(url, parm).then(res => {
                        if(res.data=='修改成功'){
                            this.dialog.seedForm = false;
                            this.getSeedlingData();//取得苗清單
                            this.$toast.success(`修改成功`, {
                                duration: 2000
                            });
                        }else{
                            this.$toast.error(`修改失敗:${res.data}`, { duration: 2000 });
                        }
                        console.log("修改API:" + res.request.responseURL);
                    }).catch(error => {
                        this.$toast.error(`修改失敗:${error}`, { duration: 2000 });
                    })
                        .finally(() => {
                            //this.getdata();
                        });
                }
            },
            //打開新增
            openAdd:function(){
                this.getSpeciesData(true);
                this.seedFormData.mode ='add';
                this.dialog.seedForm=true;
                if (this.$refs.manform != undefined) {
                    this.$refs.manform.reset();
                }
                setTimeout(()=>{
                    this.seedFormData = {
                        mode:'add',
                        id:'',
                        name_ch: "",
                        name_en: "",
                        origin: "",
                        characteristic: "",
                        manufacturer_id: null,
                        remark: "",
                        price: 0.0,
                        created_user: "",
                        created_time: "",
                        updated_user: null,
                        updated_time: "",
                        species_id: null
                    };
                },100)
                
            },
            //打開苗清單編輯
            openEdit:function(evt){
                this.getSpeciesData(true);
                console.log('Edit',evt);
                this.SeedlingModel = evt;
                Object.assign(this.seedFormData,this.SeedlingData.filter(x=>x.id==this.SeedlingModel)[0]);
                this.seedFormData.mode ='edit';
                this.dialog.seedForm=true;

            },
            //取得廠商清單
            getmanudata: async function() {
            this.seedFormData.manufacturer_id = null; //還原成未選
            // this.manmode = "add"; //還原成add
            // this.manfield = {}; //還原成空白
            this.manu = [];
            let url = `${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/`;
            await this.$axios
                .get(url)
                .then(res => {
                    this.manu = res.data;
                    
                    console.log("取得廠商資料API:" + res.request.responseURL);
                })
                .catch(error => {
                    this.$toast.error(`取得廠商資料失敗:${error}`, { duration: 2000 });
                })
                .finally(() => {
                    this.getSpeciesData();
                    //this.getdata();
                });
            },
            //取得苗清單
            getSeedlingData:async function(){
                this.SeedlingModel = undefined;
                var url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/seedling/`;
                await this.$axios
                    .get(url)
                    .then(res => {
                        this.SeedlingData = res.data;
                        console.log("取得苗資料API:" + res.request.responseURL);
                    })
                    .finally(() => {
                        /* 不論失敗成功皆會執行 */ 
                        this.isLoading = true;
                    });
            }
        },
        mounted() {
            this.getmanudata();//取得廠商清單
            
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
        cursor: pointer;
        border-bottom: 1px solid rgba(0,0,0,0.1);
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

</style>