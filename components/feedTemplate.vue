<template>
    <div>
        <v-btn outlined color="primary" disabled block>MODE:{{templatemode}}</v-btn>
        <v-row class="mt-2">
            <v-col cols="12">
                <v-form ref="mainform">
                <v-row dense class="text-center">
                    <!-- <v-col cols="2"></v-col> -->
                    <v-spacer></v-spacer>
                    <v-col cols="5">
                        <v-text-field v-model="tempMain.name_ch" filled dense hide-details :rules="rules.require" label="樣板名稱(中)" clearable></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="tempMain.name_en" filled dense hide-details :rules="rules.require" label="樣板名稱(英)" clearable></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="tempMain.remark" filled dense hide-details label="備註" clearable></v-text-field>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col cols="1">
                        <v-btn tile icon x-large color="primary" title="儲存樣板" :disabled="!(tempMain.name_ch && tempMain.name_en)" @click="saveTemp">
                            <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
            </v-col>
            <!-- 主要樣版內容 -->
            <v-col cols="12">
                <!--:dense="$vuetify.breakpoint.smAndDown" -->
                <v-timeline align-top dense>
                    <!-- sort拿掉就是正排序 .sort((a,b)=>(a.order > b.order) ? -1 : ((b.order > a.order) ? 1 : 0))-->
                    <v-timeline-item v-for="(mitem, i) in items" :key="i" :color="mitem.color" :icon="mitem.icon" fill-dot
                        :large="[0, (items.length) - 1].includes(i)">
                        <template v-slot:icon v-if="[0, (items.length) - 1].includes(i)">
                            <span style="color:white;">{{ mitem.text }}</span>
                        </template>
                        <template v-slot:icon v-else>
                            <v-icon dark>{{mitem.icon}}</v-icon>
                        </template>
                        <v-row class="pt-1" v-if="[0, (items.length) - 1].includes(i) == false">
                            <!--不顯示開始跟結束 -->
                            <v-col cols="2" class="text-center">
                                <!-- <strong>2022/01/01</strong><br /> -->
                                <strong>{{ mitem.text }}</strong>
                            </v-col>
                            <v-col>
                                <v-card :color="mitem.color" dark>
        
                                    <v-card-title class="text-h6">
                                        {{ mitem.text }}
                                    </v-card-title>
                                    <v-card-text class="white text--primary">
                                        <!-- 選定模式會出現不同欄位 -->
                                        <v-data-table light :footer-props="footerProps"
                                            :headers="headers.filter(x => x.showmode.includes(templatemode))"
                                            :items="(mainItems.filter(x => x.phase_id == mitem.id).length == 1) ? mainItems.filter(x => x.phase_id == mitem.id)[0].stepList : []"
                                           >
                                            <template v-slot:top>
                                                <v-toolbar flat>
                                                    <v-btn small icon color="green"
                                                        @click="addsubitem(mitem.id, (mainItems.filter(x => x.phase_id == mitem.id).length > 0) ? mainItems.filter(x => x.phase_id == mitem.id)[0].stepList.length-1 : 0)">
                                                        <v-icon>mdi-plus</v-icon>
                                                    </v-btn>
                                                    <v-divider class="mx-4" inset vertical></v-divider>
        
                                                    <v-spacer></v-spacer>
                                                </v-toolbar>
                                            </template>
                                            <template v-slot:[`item.actions`]="{ index }">
                                                <v-btn small icon color="green" title="在下方新增一列"
                                                    @click="addsubitem(mitem.id,index)">
                                                    <v-icon>mdi-table-row-plus-after</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-slot:[`item.udactions`]="{ index }">
                                                <v-btn small icon color="green" title="編輯">
                                                    <v-icon>mdi-circle-edit-outline</v-icon>
                                                </v-btn>
                                                <v-btn small icon color="red" title="刪除" @click="delsubitem(mitem.id, index)">
                                                    <v-icon>mdi-delete-circle-outline</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
        
                                        <!-- <v-btn :color="item.color" class="mx-0" outlined>
                                            Button
                                        </v-btn> -->
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-timeline-item>
                </v-timeline>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog.additem" max-width="500px">
            <v-form ref="additem">
                <v-card>
                    <v-card-title>add</v-card-title>
                    <v-card-text>
                        <v-autocomplete v-model="stepitem.id" @change="selectStep" clearable dense filled :items="stepdata" item-text="name_ch"
                            item-value="id">
                            <v-btn slot="append-outer" :disabled="(stepitem.id!=undefined)" x-small outlined fab color="primary" @click="showstep('add')"><v-icon>mdi-plus</v-icon></v-btn>
                            <v-btn slot="append-outer" :disabled="(stepitem.id==undefined)" x-small outlined fab color="primary" @click="showstep('edit')"><v-icon>mdi-pencil-outline</v-icon></v-btn>
                            <v-btn slot="append-outer" :disabled="(stepitem.id==undefined)" x-small outlined fab color="red" @click="deletestep"><v-icon>mdi-close</v-icon></v-btn>
                        </v-autocomplete>

                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small tile color="primary" :disabled="!stepitem.id" @click="insertStep">加入</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <v-dialog v-model="dialog.phaseform" max-width="500px">
            <v-form ref="phaseform">
                <v-card>
                    <v-card-title>階段項目-{{(stepmode=='add')?'新增':'編輯'}}</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="stepformedit.name_ch" filled dense hide-details :rules="rules.require" label="階段名稱(中)" clearable></v-text-field>
                        <v-text-field v-model="stepformedit.name_en" filled dense hide-details :rules="rules.require" label="階段名稱(英)" clearable></v-text-field>
                        <v-text-field v-model="stepformedit.remark" filled dense hide-details label="備註" clearable></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn  color="primary" tile @click="submitstep">{{(stepmode=='add')?'新增':'修改'}}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
            </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        templatemode: {
            type: String,
            default: "add"
        }
    },
    data() {
        return {
            rules: {
                require: [v => !!v || "*必要項目"],
            },
            items: [
                {
                    id: 0,
                    order: 0,
                    color: 'red',
                    icon: 'mdi-star',
                    text: '開始'
                },
                {
                    id: 1,
                    order: 1,
                    color: 'indigo lighten-1',
                    icon: 'mdi-star',
                    text: '空池'
                },
                {
                    id: 2,
                    order: 2,
                    color: 'purple darken-1',
                    icon: 'mdi-book-variant',
                    text: '養殖審核'
                },
                {
                    id: 3,
                    order: 3,
                    color: 'green lighten-1',
                    icon: 'mdi-airballoon',
                    text: '備池'
                },
                {
                    id: 4,
                    order: 4,
                    color: 'indigo',
                    icon: 'mdi-gate-buffer',
                    text: '蓄水'
                },
                {
                    id: 5,
                    order: 5,
                    color: 'indigo',
                    icon: 'mdi-buffer',
                    text: '做水'
                },
                {
                    id: 6,
                    order: 6,
                    color: 'red lighten-2',
                    icon: 'mdi-buffer',
                    text: '放養中'
                },
                {
                    id: 7,
                    order: 7,
                    color: 'indigo',
                    icon: 'mdi-buffer',
                    text: '清池'
                },
                {
                    id: 8,
                    order: 8,
                    color: 'red',
                    icon: 'mdi-star',
                    text: '結束'
                },
            ],
            //主要項目
            tempMain:{
                name_ch:undefined,
                name_en:undefined,
                remark:undefined,
            },
            //table
            headers: [
                { text: '新增', value: 'actions', sortable: false, showmode: ['add', 'edit'] },
                { text: "step_id", value: "step_id", groupable: false, showmode: ['add', 'edit'] },
                // { text: "sort", value: "sort", groupable: false, showmode: ['add', 'edit'] },
                { text: "項目/動作", value: "step_name", groupable: false, showmode: ['add', 'edit'] },
                { text: "執行/確認人員", value: "step_exec", groupable: false, showmode: ['edit'] },
                { text: "確認時間", value: "checktime", groupable: false, showmode: ['edit'] },
                { text: "結果", value: "result", groupable: false, showmode: ['edit'] },
                { text: "訊息", value: "msg", groupable: false, showmode: ['edit'] },
                { text: '編輯', value: 'udactions', sortable: false, showmode: ['add', 'edit'] },
            ],
            mainItems: [{
                phase_id: 1,
                phase_item: "空池",
                stepList: [
                    // { id: 1, stepName: "測試", step_exec: "yahoo", sub_check: "google", checktime: "2022/01/01", result: "no no", msg: "hello" },
                    // { id: 2, stepName: "測試2", step_exec: "yahoo2", sub_check: "google2", checktime: "2022/01/01", result: "no no2", msg: "hello2" }
                ],

            },],
            footerProps: {
                "items-per-page-text": "每頁",
                "items-per-page-options": [25, 50, 75, 100]
            },
            dialog: {
                additem: false,
                phaseform:false,
            },
            //步驟清單
            stepdata: [],
            stepitem:{id:undefined,name_ch:undefined,phase_id:undefined,addidx:undefined},//id=項目id
            //step modestepmode
            stepmode:'add',
            stepformedit:{name_ch:undefined,name_en:undefined,remark:undefined,created_user:undefined},//階段項目 for 新增、編輯用
        }
    },
    methods: {
        //送出step項目
        submitstep:async function(){
            this.stepformedit.created_user =  (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
            this.stepformedit.updated_user =  (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
            console.log(this.stepformedit);
            switch (this.stepmode) {
                case 'add':
                    await this.$axios
                        .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/`, this.stepformedit)
                        .then(res => {
                            if(res.data=='新增成功'){
                                this.dialog.phaseform = false;
                                this.getstepdata();
                                this.$toast.success("新增成功", { duration: 2000 });
                            }else{
                                this.$toast.error("新增步驟失敗:" + res.data, { duration: 2000 });
                            }

                            console.log("新增步驟API:" + res.request.responseURL);
                        })
                        .catch(error => {
                            this.$toast.error("error:" + error, { duration: 2000 });
                        })
                        .finally(() => {
                        });
                    break;
                case 'edit':
                    var id = this.stepitem.id;
                    await this.$axios
                    .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/${id}/`, this.stepformedit)
                        .then(res => {
                            if(res.data=='修改成功'){
                                this.dialog.phaseform = false;
                                this.getstepdata();
                                this.$toast.success("修改成功", { duration: 2000 });
                            }else{
                                this.$toast.error("修改步驟失敗:" + res.data, { duration: 2000 });
                            }

                            console.log("修改步驟API:" + res.request.responseURL);
                        })
                        .catch(error => {
                            this.$toast.error("error:" + error, { duration: 2000 });
                        })
                        .finally(() => {
                        });
                    break;
            }
        },
        //刪除step
        deletestep:async function(){
            if (!confirm(`是否刪除？`)) {
                this.$toast.error('刪除取消', { duration: 2000 });
                return;
            }
            var id = this.stepitem.id;
            await this.$axios
                        .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/${id}/`)
                        .then(res => {
                            if(res.data=='刪除成功'){
                                this.getstepdata();
                                this.$toast.success("刪除成功", { duration: 2000 });
                            }else{
                                this.$toast.error("刪除步驟失敗:" + res.data, { duration: 2000 });
                            }

                            console.log("刪除步驟API:" + res.request.responseURL);
                        })
                        .catch(error => {
                            this.$toast.error("error:" + error, { duration: 2000 });
                        })
                        .finally(() => {
                        });
        },
        //顯示step編輯視窗(add、edit)
        showstep:function(mode){
                    this.stepmode=mode;
                    this.stepformedit = {};
                    if(mode=='edit'){//帶入資料
                        var step = this.stepdata.filter(x=>x.id==this.stepitem.id)[0];
                        this.stepformedit.name_ch = step.name_ch;
                        this.stepformedit.name_en = step.name_en;
                        this.stepformedit.remark = step.remark;
                    }
                    this.dialog.phaseform = true;              
        },
        //儲存樣板
        saveTemp:async function(){
            if(this.$refs.mainform.validate()){
                this.tempMain.create_user = (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                var para ={
                   tempMain :  this.tempMain,
                   tempContent: this.mainItems
                }
                console.log(para);
            }

        },
        addsubitem: function (phase_id, addidx = undefined) {
            // phase_id 主要項目是哪個：空池
            
            console.log("phase:", phase_id, "addidx:",addidx);
            this.stepitem.phase_id = phase_id;
            this.stepitem.addidx = addidx;
            this.dialog.additem = true;//show dialog
        },
        delsubitem: function (phase_id, index) {
            var sub_item = this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList[index];
            if (confirm(`是否刪除？ ${sub_item.step_name}`)) {
                this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList.splice(index, 1);
            }
        },
        //取得步驟清單
        getstepdata: async function () {
            await this.$axios
                .get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/`)
                .then(res => {
                    this.stepdata = res.data;

                    console.log("取得步驟清單API:" + res.request.responseURL);
                })
                .catch(error => {
                    this.$toast.error("error:" + error, { duration: 2000 });
                })
                .finally(() => {
                });
        },
        //選擇步驟
        selectStep:function(){
            if(this.stepitem.id){
                this.stepitem.name_ch = this.stepdata.filter(x=>x.id == this.stepitem.id)[0].name_ch;
            }else{
                this.stepitem.name_ch = null;
            }
        },
        insertStep:function(){
            var phaseid =  this.stepitem.phase_id;//項目的id

            var psubidx = this.stepitem.addidx +1 ;//+1
            console.log(`會在第${psubidx+1}插入`,this.stepitem.name_ch);
            
            var pushitem = {
                step_id : this.stepitem.id,//項目原始id
                // sort:undefined,
                step_name : this.stepitem.name_ch,
                step_exec:undefined,//執行/確認人員
                checktime:undefined,//確認時間
                result:undefined,//結果
                msg:undefined,//msg
            };
            if(this.mainItems.filter(x=>x.phase_id == phaseid).length==0){
                var itemName = this.items.filter(x=>x.id == phaseid)[0].text;
                var main_forPush = {
                    phase_id: phaseid,
                    phase_item:itemName,
                    stepList:[]
                };
                this.mainItems.push(main_forPush);
            }
            this.mainItems.filter(x=>x.phase_id == phaseid)[0].stepList.splice(psubidx,0,pushitem);
            this.dialog.additem = false;
        }
    },
    async mounted() {
        await this.getstepdata();//取得步驟清單
    },
}
</script>

<style scoped>

</style>