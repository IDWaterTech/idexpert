<template>
    <div>
        <v-row>
            <v-col cols="12" sm="6">
                <v-select v-model="SeedlingModel" dense filled :items="SeedlingData" item-value="id" item-text="name_ch" clearable>
                </v-select>
            </v-col>
            <v-col cols="12" sm="6">
                <v-btn icon color="green" @click="openEdit" :disabled="!SeedlingModel"><v-icon>mdi-pencil-box</v-icon></v-btn>
                <v-btn icon color="blue" @click="openAdd"><v-icon>mdi-plus-box</v-icon></v-btn>
                <v-btn icon color="red" @click="delSeedling" :disabled="!SeedlingModel"><v-icon>mdi-close-box</v-icon></v-btn>
            </v-col>
            <v-dialog v-model="dialog.seedForm" width="400">
                <v-form  ref="manform"
                  v-model="manvalid"
                  >
                    <v-card >
                        <v-card-title>種苗</v-card-title>
                        <v-divider></v-divider>
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
                            <v-autocomplete v-model="seedFormData.manufacturer_id" :rules="rules.require" style="width" :items="manu" item-text="name_ch" item-value="id" dense filled
                                label="選擇廠商" clearable><span style="width:100px" slot="prepend">廠商id<v-icon class="mx-1" @click="getmanudata">
                                        mdi-reload</v-icon></span></v-autocomplete>
                            <v-text-field filled dense v-model="seedFormData.remark" :rules="rules.require">
                                <span style="width:100px" slot="prepend">備註</span>
                            </v-text-field>
                            <v-text-field filled dense v-model.number="seedFormData.price" :rules="rules.require" type="number">
                                <span style="width:100px" slot="prepend">市價</span>
                            </v-text-field>
                            <v-text-field dense disabled v-model="seedFormData.updated_time" :rules="rules.require" v-if="seedFormData.mode=='edit'" >
                                <span style="width:100px" slot="prepend">修改時間</span>
                            </v-text-field>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn tile @click="editsave" v-if="seedFormData.mode=='edit'" class="primary">修改</v-btn>
                            <v-btn tile @click="addsave" v-if="seedFormData.mode=='add'" class="primary">新增</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-row>
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
                    updated_time: ""
                },
                manvalid: true,
                //廠商
                manu:[],

            }
        },
        methods: {
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
                        created_user: this.$auth.$state.user.email
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
            delSeedling:async function(){
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
                this.seedFormData.mode ='add';
                this.dialog.seedForm=true;
                if (this.$refs.manform != undefined) {
                    this.$refs.manform.reset();
                    }
                
            },
            //打開苗清單編輯
            openEdit:function(){
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
                    })
                    .finally(() => {
                /* 不論失敗成功皆會執行 */ 
                    });
            }
        },
        mounted() {
            this.getSeedlingData();//取得苗清單
            this.getmanudata();//取得廠商清單
        },
    }
</script>

<style scoped>

</style>