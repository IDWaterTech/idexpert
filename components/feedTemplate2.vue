<template>
    <div>
        <v-row class="mt-2" no-gutters >
            <v-col cols="12" v-if="templatemode!='cycleedit'">
                <v-form ref="mainform">
                    <v-row dense class="text-center">
                        <!-- <v-col cols="2"></v-col> -->
                        <!-- <v-col cols="12"></v-col> -->
                        <!-- <v-spacer></v-spacer> -->
                        <v-col cols="12" md="2" sm="3">
                            <v-text-field v-model="tempMain.name_ch" filled dense hide-details :rules="rules.require"
                                label="樣板名稱(中)" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2" sm="3">
                            <v-text-field v-model="tempMain.name_en" filled dense hide-details :rules="rules.require"
                                label="樣板名稱(英)" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2" sm="3">
                            <v-text-field v-model="tempMain.remark" filled dense hide-details label="備註" clearable></v-text-field>
                        </v-col>
                        <v-col cols="2" v-if="templatemode=='add'" style="display: flex;align-items: center;justify-content: flex-start;">
                            <v-btn class="btn-primary" title="儲存樣板"
                                :class="{'disabled':!(tempMain.name_ch && tempMain.name_en)}"
                                @click="saveTemp"
                                style="padding: 0 8px;">
                                <v-icon style="font-size: 1.5rem;">mdi-content-save</v-icon>儲存
                            </v-btn>
                        </v-col>
                        <v-col cols="2" v-if="templatemode=='edit'" style="display: flex;align-items: center;justify-content: flex-start;">
                            <v-btn class="btn-primary" title="儲存編輯"
                                :class="{'disabled':!(tempMain.name_ch && tempMain.name_en)}"
                                 @click="saveEdit"
                                 style="padding: 0 8px;">
                                <v-icon style="font-size: 1.5rem;">mdi-content-save</v-icon>儲存
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
            <!-- 主要樣版內容 -->
            <!-- <v-col cols="12"  style="padding-left: 12px;"><b>資料架構(!!!!最後要上要記得清除!!!!)：</b>[{ "phase_id": 1, "phase_name_ch": "空池", "stepList": [ <br>&nbsp;&nbsp;&nbsp;{ "step_id": 23, "seq_id": 23, "step_name_ch": "新增循環", "execute_time": "2023-10-25 10:12:12", verify_time: '',executor:'',confirm:''},<br>&nbsp;&nbsp; { "step_id": 40,"seq_id": "23_01", "step_name_ch": "其他", "msg": "i am msg 1.", "execute_time": "", "verify_time": '',executor:'',confirm:''},]}]<br><br></v-col> -->
            <v-col cols="12">
                <!-- {{ tempMain }}<br>
                {{ mainItems }} -->
                <!--:dense="$vuetify.breakpoint.smAndDown" -->
                <div v-for="(mitem,id) in mainItems" :key="'status_'+mitem.phase_id" class="timeline">
                    <v-row class="template-outer" 
                        style="align-items: flex-start;margin-bottom: 0;"
                        :style="{'flexDirection':`${windowWidth<834?'column':'row'}`}">
                        <!-- 狀態+最新執行時間 -->
                        <div v-if="templatemode=='cycleedit'" class="left">
                            <div class="status"
                                :class="`${windowWidth<834?'flex-adjust':''}`">
                                <!-- <div class="status-title">
                                    {{ mitem.phase_name_ch }}
                                </div> -->
                                <div class="newest-date"
                                    :class="`${windowWidth<834?'flex-adjust':''}`">
                                    <span>{{ mitem.newest&&mitem.newest!==''?mitem.newest.substring(0,10):'' }}</span>
                                    <span>{{ mitem.newest&&mitem.newest!==''?mitem.newest.substring(11):'' }}</span>
                                    
                                </div>
                            </div>
                        </div>
                        <!-- 表格+時間軸 -->
                        <div class="right" :id="'right_'+mitem.phase_id"
                            :style="{'width':`${windowWidth<834 || templatemode!=='cycleedit'?'100%':'calc(100% - 72px - 8px)'}`,
                                    'marginLeft':`${windowWidth<834?'8px':'0'}`}">
                            <!-- 時間軸：因有顏色變換，無法使用偽元素 -->
                            <div class="circle-line">
                                <div v-if="id !== (mainItems.length-1)" class="line"
                                    :style="{'borderColor':`${templatemode=='cycleedit'?(mitem.newest&&mitem.newest!==''?mitem.color:'#BFCBD2'):status.filter(x=>x.id==mitem.phase_id)[0].color}`,
                                            'borderStyle':`${(mitem.newest&&mitem.newest!=='')||templatemode!=='cycleedit'?'solid':'dashed'}`,
                                            'top':`${windowWidth<834?'0':'16px'}`,}"></div>
                                <div class="circle"
                                    :style="{'borderColor':`${templatemode=='cycleedit'?mitem.color:status.filter(x=>x.id==mitem.phase_id)[0].color}`}"></div>
                            </div>
                            <!-- 表格 -->
                            <div class="content" style="width: 100%;padding: 12px 24px;">
                                <!-- {{mitem}} -->
                                <v-card class="result-card item-card">
                                    <!-- 表頭 -->
                                    <div class="card-title"
                                        :style="{'backgroundColor':`${templatemode=='cycleedit'?mitem.color:status.filter(x=>x.id==mitem.phase_id)[0].color}`}"
                                        @click="status[id].open = !status[id].open" >
                                        <div class="title">
                                            <v-card-title>{{ templatemode=='cycleedit'?mitem.phase_name_ch:mitem.phase_name }}</v-card-title>
                                        </div>
                                        <div class="chevron">
                                            <v-icon v-if="status[id].open">mdi-triangle-small-up</v-icon>
                                            <v-icon v-else>mdi-triangle-small-down</v-icon>
                                        </div>
                                    </div>
                                    <!-- 內容 -->
                                    <div v-if="status[id].open" class="content">
                                        <v-data-table light 
                                            :headers="headers.filter(x => x.showmode.includes(templatemode))"
                                            :items="mitem.stepList"
                                            no-data-text=""
                                            hide-default-footer
                                            disable-pagination
                                            style="max-height: 300px;overflow-y: scroll;">
                                            <!-- <template v-slot:[`column.udactions`]="{ column }">
                                                <v-icon>plus-circle-outline</v-icon>{{ column.text }}123
                                            </template> -->
                                            <template v-for="header in headers" v-slot:[`header.${header.value}`]>
                                                <div v-if="header.text=='刪除' && templatemode=='cycleedit'" class="tool" :key="header.value" style="display: flex;align-items: center;">
                                                    {{ header.text }}
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-btn class="btn-icon just-icon" v-on="on">
                                                                <v-icon>mdi-information-outline</v-icon>
                                                            </v-btn>
                                                        </template>
                                                        <span>僅可刪除『其他』項目</span>
                                                    </v-tooltip>
                                                </div>
                                                
                                                <span v-else :key="header.value">{{ header.text }}</span>
                                            </template>
                                            <!-- <template v-slot:[`item.name`]="{ item }">
                                                <v-tooltip bottom>
                                                    <span>{{ templatemode=='cycleedit'?item.step_name_ch:item.step_name}}</span>
                                                </v-tooltip>
                                            </template> -->
                                            <!-- 新增 -->
                                            <template v-slot:[`item.actions`]="{ index }">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn  class="btn-icon just-icon"
                                                             title="下方新增其他" 
                                                             @click="addsubitem(mitem.phase_id,index)" 
                                                             v-bind="attrs" v-on="on">
                                                            <v-icon>mdi-table-row-plus-after</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>{{ templatemode=='cycleedit'?'下方新增其他':'下方新增項目'}}</span>
                                                </v-tooltip>
                                                <!-- <v-btn  class="btn-icon" title="在下方新增一列" @click="addsubitem(mitem.id,index)">
                                                    <v-icon>mdi-table-row-plus-after</v-icon>
                                                </v-btn> -->
                                            </template>
                                            <!-- 執行 -->
                                            <template v-slot:[`item.deft_executor`]="{ item }">
                                               {{ item.deft_executor }} 
                                               <span v-if="item.execute_time&&item.execute_time!==''" v-text="dateFormat(item.execute_time)"></span>
                                               <!-- {{ dateFormat(item.execute_time) }} -->
                                            </template>
                                            <!-- 確認 -->
                                            <template v-slot:[`item.deft_verifier`]="{ item }">
                                               {{ item.deft_verifier }} 
                                               <span v-if="item.verify_time&&item.verify_time!==''" v-text="dateFormat(item.verify_time)"></span>
                                               <!-- {{ dateFormat(item.execute_time) }} -->
                                            </template>
                                            <!-- 執行/確認 -->
                                            <template v-slot:[`item.executed_actions`]="{ index }">
                                                <v-btn class="btn-secondary btn-small"
                                                    :class="{'disabled':mitem.stepList[index].execute_disabled}"
                                                    @click="execute(id,index)">
                                                    {{ mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''?mitem.stepList[index].verify_time!==''?'已執行':'取消':'執行' }}
                                                </v-btn>
                                                <v-btn class="btn-primary btn-small"
                                                    :class="`${mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''&&mitem.stepList[index].verify_time==''?'':'disabled'}`"
                                                    @click="executeConfirm(id,index)">
                                                    {{ mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''&&mitem.stepList[index].verify_time!==''?'已確認':'確認' }}
                                                </v-btn>
                                            </template>
                                            <!-- 刪除 -->
                                            <template v-slot:[`item.udactions`]="{ index }">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn  class="btn-icon delete"
                                                             title="刪除" 
                                                             @click="delsubitem(mitem.phase_id, index)" 
                                                             v-bind="attrs" v-on="on"
                                                             :class="{'disabled':mitem.stepList[index].step_name_ch!=='其他'&&templatemode=='cycleedit'}"
                                                             style="pointer-events: inherit;">
                                                            <v-icon>mdi-trash-can</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span v-if="mitem.stepList[index].step_name_ch!=='其他'&&templatemode=='cycleedit'">僅可刪除『其他』項目</span>
                                                    <span v-else>刪除</span>
                                                </v-tooltip>
                                                <!-- <v-btn class="btn-icon delete" title="刪除" @click="delsubitem(mitem.id, index)">
                                                    <v-icon>mdi-trash-can</v-icon>
                                                </v-btn> -->
                                            </template>
                                        </v-data-table>
                                        <div v-if="templatemode!=='cycleedit' && mitem.stepList.length==0" class="add-step">
                                            <v-btn class="btn-secondary" @click="addsubitem(mitem.phase_id, (mainItems.filter(x => x.phase_id == mitem.phase_id).length > 0) ? mainItems.filter(x => x.phase_id == mitem.phase_id)[0].stepList.length-1 : 0)">
                                                <v-icon>mdi-plus</v-icon>
                                                新增項目
                                            </v-btn>
                                        </div>
                                        <!-- <span><b>最上方資料結構中的stepList資料整理(!!!!最後要上要記得清除!!!!)</b></span>
                                        <span class="error-text"><b>Note:新增/刪除 其他 需重新給api資料 因seq_id會變更</b></span>
                                        <div class="list" v-for="(step,i) in mitem.stepList" :key="'step_'+i">
                                            {{ step }}
                                        </div> -->
                                    </div>
                                </v-card>
                            </div>
                        </div>
                    </v-row>
                </div>
            </v-col>
        </v-row>
        <!-- 新增其他項目的dialog -->
        <v-dialog v-model="dialog.additem" max-width="500px">
            <v-form v-model="addvalid" ref="addform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title" style="display: block;width: 100%;">
                        <div style="display: inline-block;">
                            <span v-if="templatemode=='cycleedit'">新增其他項目</span> 
                            <span v-else>加入項目</span> 
                        </div>
                        <div v-if="templatemode=='cycleedit'" class="add" style="float: right;display: inline-block;">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn  class="btn-secondary"
                                            title="新增其他項目" 
                                            @click="addStep.push({msg:''})" 
                                            v-bind="attrs" v-on="on"
                                            style="border: none;">
                                        <v-icon>mdi-plus</v-icon>
                                        新增
                                    </v-btn>
                                </template>
                                <span>新增項目</span>
                            </v-tooltip>
                        </div>
                        <div v-else class="add" style="float: right;display: inline-block;">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="dialog.additem = false" 
                                    style="border: none;min-width: 0;padding: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic" v-if="templatemode=='cycleedit'">
                        <v-card-text v-for="(add,id) in addStep" :key="'add_'+id" style="display: flex;flex-direction: column;padding: 8px 16px;">
                            <!-- <div class="minus" style="width: 100%;">
                                <span>其他</span>
                                <v-tooltip v-if="addStep.length>1"  bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn  class="btn-secondary delete"
                                                title="刪除項目" 
                                                @click="addStep.push({msg:''})" 
                                                v-bind="attrs" v-on="on"
                                                style="border: none;float: right;">
                                            <v-icon>mdi-minus</v-icon>
                                            刪除
                                        </v-btn>
                                    </template>
                                    <span>刪除項目</span>
                                </v-tooltip>
                            </div> -->
                            <div class="textfield" style="display: flex;align-items: center;">
                                <v-text-field v-model="add.msg" label="項目說明" :rules="rules.require" autocomplete="off" style="padding-top: 8px;margin-top: 0;"></v-text-field>
                                <v-tooltip v-if="addStep.length>1"  bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn  class="btn-icon-secondary delete"
                                                title="刪除" 
                                                @click="addStep.splice(id,1)" 
                                                v-bind="attrs" v-on="on"
                                                style="border-radius: 50%;border: none !important;;">
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>刪除</span>
                                </v-tooltip>
                            </div>
                        </v-card-text>
                    </div>
                    <div class="basic" v-else>
                        <v-card-text>
                            <div class="search" style="display: flex;align-items: center;margin-bottom: 16px;">
                                <v-select :disabled="stepmode=='add'" v-model="stepitem.id" @change="selectStep" dense filled hide-details :items="stepdata" item-text="name_ch"
                                    item-value="id">
                                    
                                    <!-- <v-btn slot="append-outer"  class="btn-icon" @click="showstep('edit')"><v-icon>mdi-pencil-outline</v-icon></v-btn>
                                    <v-btn slot="append-outer"  class="btn-icon green" @click="showstep('add')"><v-icon>mdi-plus</v-icon></v-btn>
                                    <v-btn slot="append-outer" :class="{'disabled':(stepitem.id==undefined)}" class="btn-icon delete" @click="deletestep"><v-icon>mdi-trash-can</v-icon></v-btn> -->
                                </v-select>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn slot="append-outer" :class="{'disabled':(stepitem.id!==undefined||stepdata.length==0)}" class="btn-icon" @click="showstep('edit')" v-bind="attrs" v-on="on"><v-icon>mdi-pencil-outline</v-icon></v-btn>
                                    </template>
                                    <span>編輯項目</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn slot="append-outer" :class="{'disabled':(stepitem.id==undefined)}" class="btn-icon green" @click="showstep('add')" v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
                                    </template>
                                    <span>新增項目</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn slot="append-outer" :class="{'disabled':(stepitem.id==undefined)}" class="btn-icon delete" @click="deletestep" v-bind="attrs" v-on="on"><v-icon>mdi-trash-can</v-icon></v-btn>
                                    </template>
                                    <span>刪除項目</span>
                                </v-tooltip>
                            </div>
                            
                            <v-text-field v-model="stepformedit.name_ch" @change="checkValue('name_ch')" filled dense :rules="rules.requireStepCn" label="階段名稱(中)" clearable style="padding-top: 12px;"></v-text-field>
                            <v-text-field v-model="stepformedit.name_en" @change="checkValue('name_en')" filled dense :rules="rules.requireStepEn" label="階段名稱(英)" clearable style="padding-top: 12px;"></v-text-field>
                            <v-text-field v-model="stepformedit.remark" @change="checkValue('remark')" filled dense  label="備註" clearable style="padding-top: 12px;"></v-text-field>
                        </v-card-text>
                    </div>
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="dialog.additem = false">取消</v-btn>
                        <v-btn class="btn-primary" @click="submitstep">{{ stepitem.id!==undefined?isEdit?'修改並加入':'加入':templatemode=='cycleedit'?'新增':'新增並加入'}}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    props: {
        templatemode: {
            type: String,
            default: "add"
        },
        passObj:{
            type: Object,
            default: function () {
                return {
                    tempMain: {
                        id: undefined,
                        name_ch: undefined,
                        name_en: undefined,
                        remark: undefined,
                        created_user: undefined,
                        created_time: undefined,
                        updated_user: undefined,
                        updated_time: undefined,
                    },
                    tempContent: [
                    ]
                };
            }
        },
        nowExpand: {
            type: Boolean,
            default: true
        },
        accdata: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            items: [
                // {
                //     id: 1,
                //     order: 1,
                //     color: 'indigo lighten-1',
                //     icon: 'mdi-star',
                //     text: '空池'
                // },
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
                    id: 7,
                    order: 7,
                    color: 'red lighten-2',
                    icon: 'mdi-buffer',
                    text: '放養中'
                },
                {
                    id: 8,
                    order: 8,
                    color: 'indigo',
                    icon: 'mdi-buffer',
                    text: '清池'
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
                { text: '新增', value: 'actions', sortable: false,width:"5%",showmode: ['add', 'edit','cycleedit']},
                // { text: "step_id", value: "step_id", groupable: false, showmode: ['add', 'edit'] },
                // { text: "sort", value: "sort", groupable: false, showmode: ['add', 'edit'] },
                { text: "項目", value: "step_name_ch", groupable: false, sortable: false,width:"15%",showmode: ['cycleedit']},
                { text: "項目", value: "step_name", groupable: false, sortable: false,width:"15%",showmode: ['add', 'edit']},
                // { text: "執行/確認人員", value: "step_exec", groupable: false, showmode: ['edit2'] },
                { text: "訊息", value: "msg", groupable: false, sortable: false,width:"20%",showmode: ['cycleedit']},
                // { text: "執行時間", value: "execute_time", groupable: false, sortable: false,width:"20%",showmode: ['cycleedit']},
                { text: "執行", value: "executed_actions", groupable: false, sortable: false,width:"20%",showmode: ['cycleedit']},
                { text: '執行員', value: 'deft_executor', sortable: false,width:"15%",showmode: ['cycleedit']},
                { text: '確認員', value: 'deft_verifier', sortable: false,width:"15%",showmode: ['cycleedit']},
                { text: '刪除', value: 'udactions', sortable: false,width:"10%",showmode: ['add', 'edit','cycleedit']},
            ],
            mainItems: [{
                phase_id: 1,
                phase_name_ch: "空池",
                executed_date:undefined,
                stepList: [
                    // { id: 1, stepName: "測試", step_exec: "yahoo", sub_check: "google", checktime: "2022/01/01", result: "no no", msg: "hello" },
                    // { id: 2, stepName: "測試2", step_exec: "yahoo2", sub_check: "google2", checktime: "2022/01/01", result: "no no2", msg: "hello2" }
                ],

            },],
            footerProps: {
                "items-per-page-text": "每頁",
                "items-per-page-options": [10,25, 50, 75, 100]
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
            windowWidth: window.innerWidth,
            // 各狀態顏色
            status:[
                // {color:'#B1DBF0',open:true,id:1},
                {color:'#DD97A4',open:true,id:2},{color:'#92CDEE',open:true,id:3},{color:'#DBC5A4',open:true,id:4},{color:'#C5E8E6',open:true,id:5},{color:'#ECE499',open:true,id:7},{color:'#8BE3D3',open:true,id:8}],
            // 新增其他
            addStep:[{msg:''}],
            rules: {
                require: [v => !!v || "*必要項目"],
                requireStepEn: [v => !!v || "*必要項目",v => v !=='others' || "*Cannot Enter ' Others '"],
                requireStepCn: [v => !!v || "*必要項目",v => v!=='其他' || "*不可輸入'其他'"],
            },
            addvalid: false,
            isEdit: false,// 插入項目是否修改
            otherApi:0,
            stepdataAll:[],
        }
    },
    created(){
       console.log("created");
        if(this.templatemode=="cycleedit"){
            // this.tempMain = this.passObj.tempMain;
            // this.mainItems = this.passObj.tempContent;

            // this.tempMain = _.cloneDeep(this.passObj.tempMain);
            this.mainItems = _.cloneDeep(this.passObj.tempContent);
            this.mainItems.forEach(m=>m.open=this.nowExpand);
            console.log('mainItems',this.mainItems);
            // if(this.templatemode == 'cycleedit') {
                this.sortData()
            // };
        }else {
            // 因為抓取出來的資料stepList為空的不會儲存，因此得額外比對整體流程，並塞進stepList，這樣模板上才可以新增其他流程
            this.mainItems = [];
            this.items.forEach(data=>{
                this.mainItems.push({
                    phase_id: data.id,
                    phase_name: data.text,
                    stepList: new Array()
                })
            })
            if(this.templatemode=="edit"){
                this.tempMain = _.cloneDeep(this.passObj.tempMain);
                let main = _.cloneDeep(this.passObj.tempContent);
                this.mainItems.forEach((data,id)=>{
                    main.forEach(m=>{
                        if(data.phase_id == m.phase_id) {
                            data.stepList = m.stepList;
                        }
                    })
                })
                // console.log(this.passObj.tempMain,this.mainItems);
                // tempMain :  this.tempMain,
                //        tempContent: this.mainItems
            }
        }
       
    },
    methods: {
        /* 資料整理 */
        // 排序其他
        sortData() {
            // 因有排序重整問題，須另外存取再取代原資料
            let stepId = [];
            this.mainItems.forEach((m,mid)=>{
                stepId.push({
                    "phase_id": m.phase_id,
                    "phase_name_ch": m.phase_name_ch,
                    "open": m.open,
                    "color": m.color,
                    "newest": m.newest,
                    "stepList": new Array(),
                })
                let step=[]; // 存取其他的項目{id:'隸屬的step_id',step:'隸屬此id下的其他'}
                let list=[]; // 因有排序問題另外存取再取代原資料
                m.stepList.forEach(s=>{
                    if(s.step_name_ch=='其他') {
                        step.forEach(tt=>{
                            // 其他的項目比對同一隸屬的id，將項目放進step中
                            if(tt.id == parseInt(s.seq_id.split('_')[0])) {
                                tt.step.push(s);
                            }
                        })
                    }else {
                        // 非其他的項目新增隸屬的結構
                        step.push({
                            id: s.seq_id,
                            step: new Array(),
                        })
                    }
                })
                // 項目排序
                step.forEach(t=>{
                    t.step.sort(function(a, b) {
                        return parseInt(a.seq_id.split('_')[1]) - parseInt(b.seq_id.split('_')[1]);
                    });
                })
                // 重新帶入stepList中的資料，因為排序有異動
                m.stepList.forEach((s,sid)=>{
                    if(s.step_name_ch!=='其他') {
                        list.push(s);
                        step.forEach(tt=>{
                            if(tt.id == s.seq_id) {
                                tt.step.forEach(z=>list.push(z));
                            }
                        })
                    }
                    
                })
                stepId[mid].stepList = list;
            })
            this.mainItems = stepId;
            this.dateData();
        },
        // 整理各階段最新時間
        dateData() {
            this.mainItems.forEach(s=>{
                s.newest = ''; // 因為更新後只有時間變動太小，需先清空再給，才會更新html
                s.stepList.forEach(p=>{
                    if(p.execute_time&&p.execute_time!=='') {
                        if(s.newest&&s.newest!=='') {
                            let current = new Date(p.execute_time);
                            let now = new Date(s.newest);
                            if(current>now) {
                                s.newest = p.execute_time;
                            }
                        }else {
                            s.newest = p.execute_time;
                        }
                    }
                })
            });
            console.log('data',this.mainItems);
            this.colorData();
        },
        // 各階段顏色存取(表頭顏色、時間軸顏色)
        colorData() {
            this.mainItems.forEach((i,id)=>{
                i.open = this.status[id].open;
                // 如果有newest參數，代表此階段已有執行項目，直接給定顏色
                if(i.newest&& i.newest!=='') {
                   i.color = this.status[id].color;
                }else {
                    if(id!==0) {
                        // 非第一項，需判斷前一項是否已執行，有執行給顏色，沒執行給disabled顏色(#BFCBD2)
                        // 判斷前項的最後一個步驟是否已執行，有執行給顏色，沒執行給disabled顏色(#BFCBD2)
                        if(this.mainItems[(id-1)] && this.mainItems[(id-1)].newest && this.mainItems[(id-1)] && this.mainItems[(id-1)].newest!=='') {
                            if(this.mainItems[(id-1)].stepList[this.mainItems[(id-1)].stepList.length-1].verify_time&&
                            this.mainItems[(id-1)].stepList[this.mainItems[(id-1)].stepList.length-1].verify_time!=='') {
                                i.color = this.status[id].color;
                            }else {
                                i.color = '#BFCBD2'
                            }
                            
                        }else {
                            i.color = '#BFCBD2'
                        }
                    }else {
                        i.color = this.status[id].color;
                    }
                    
                }
            })
            
            this.disabledData();
        },
        // 執行與確認disabled 整理
        disabledData() {
            // 如果項目已確認(isConfirm)=>不可取消執行(disabled = true)
            // 因為要照著步驟，因此如果項目的前一項尚未執行(execute_time='')=>不可跳著執行(disabled = true)
            // 承上，如果此時為狀態的第一項目，要看前一狀態的最後一項是否執行
            // 不可多項取消，只有最後的一個可以點選，要從後面往前依序取消

            let cancelId = []; // 存取目前取消狀態id，最後一項不disabled，前面的取消都要disabled
            let isNowDetect = false; // 判斷是否現在已有未執行狀態，如有存在，後面的執行鈕都應disabled
            this.mainItems.forEach((m,mid)=>{
                m.stepList.forEach((s,sid)=>{
                    // 判斷現在的sid是否為0，如為0要額外判斷前一狀態的最後一項
                    if(sid!==0) {
                        if(s.verify_time!=='') {
                            s.execute_disabled = true;
                        }else {
                            if((m.stepList[sid-1].execute_time&&m.stepList[sid-1].execute_time!=='') || (s.execute_time&&s.execute_time!=='')) {
                                if(m.stepList[sid-1].verify_time=='') {
                                    s.execute_disabled = true;
                                }else {
                                    s.execute_disabled = false;
                                }
                                
                                
                            }else {
                                s.execute_disabled = true;
                            }
                        }
                    }else {
                        if(s.verify_time!=='') {
                            s.execute_disabled = true;
                        }else {
                            if(mid !==0 ) {
                                if((this.mainItems[mid-1].stepList[this.mainItems[mid-1].stepList.length-1].execute_time && 
                                this.mainItems[mid-1].stepList[this.mainItems[mid-1].stepList.length-1].execute_time!=='') || 
                                (this.mainItems[mid].stepList[this.mainItems[mid].stepList.length-1].execute_time && 
                                this.mainItems[mid].stepList[this.mainItems[mid].stepList.length-1].execute_time!=='')) {
                                    if(this.mainItems[mid-1].stepList[this.mainItems[mid-1].stepList.length-1].verify_time=='') {
                                        s.execute_disabled = true;
                                    }else {
                                        s.execute_disabled = false;
                                    }
                                }else{
                                    s.execute_disabled = true;
                                }
                            }else {
                                s.execute_disabled = false;
                            }
                        }
                        
                    }
                    // if(sid!==0) {
                    //     // 已確認狀態一律disabled
                    //     if(s.isConfirm) {
                    //         s.execute_disabled = true;
                    //     }else {
                    //         // 非已確認狀態判斷前一項是否已執行
                    //         if((m.stepList[sid-1].execute_time&&m.stepList[sid-1].execute_time!=='')) {
                    //             // 此時狀態為取消先讓他非disabled(後續有額外判斷)
                    //             if((s.execute_time&&s.execute_time!=='')) {
                    //                 s.execute_disabled = false;
                    //             }else {
                    //                 // 如此時還尚未執行，需判斷是不是已經有未執行的項目(isNowDetect)，如果還沒有不要disabled，如果有，要disabled，因為要照著順序，只會出現一個未執行項目
                    //                 // 此多出的判斷，是因為如果中間確認者未按照步驟確認，變成中間項目已執行已確認，但前面的取消執行時，造成前面開啟未執行項目，後面也會有未執行項目的奇怪現象
                    //                 if(!isNowDetect) {
                    //                     s.execute_disabled = false;
                    //                     isNowDetect = true;
                    //                 }else {
                    //                     s.execute_disabled = true;
                                        
                    //                 }
                    //             }
                                
                                
                    //         }else {
                    //             // 前面項未執行，後面項都disabled
                    //             s.execute_disabled = true;
                    //         }
                    //     }
                    // }else {
                    //     if(s.isConfirm) {
                    //         s.execute_disabled = true;
                    //     }else {
                    //         if(mid !==0 ) {
                    //             if((this.mainItems[mid-1].stepList[this.mainItems[mid-1].stepList.length-1].execute_time && 
                    //             this.mainItems[mid-1].stepList[this.mainItems[mid-1].stepList.length-1].execute_time!=='')) {
                    //                 if((s.execute_time&&s.execute_time!=='')) {
                    //                     s.execute_disabled = false;
                    //                 }else {
                    //                     if(!isNowDetect) {
                    //                         s.execute_disabled = false;
                    //                         isNowDetect = true;
                    //                     }else {
                    //                         s.execute_disabled = true;
                                            
                    //                     }
                    //                 }
                    //             }else{
                    //                 s.execute_disabled = true;
                    //             }
                    //         }else {
                    //             // this.mainItems[0].stepList[0]
                    //             if((s.execute_time&&s.execute_time!=='')) {
                    //                 s.execute_disabled = false;
                    //             }else {
                    //                 if(!isNowDetect) {
                    //                     s.execute_disabled = false;
                    //                     isNowDetect = true;
                    //                 }else {
                    //                     s.execute_disabled = true;
                                        
                    //                 }
                    //             }
                    //         }
                    //     }
                        
                    // }

                    // 判斷現在狀態是否為取消狀態，是的話，額外存取，並更改disabled
                    if(s.execute_time && s.execute_time!=='' && s.verify_time=='') {
                        cancelId.push({
                            id: mid,
                            index: sid
                        })
                        console.log('cancel',cancelId);
                    }
                })
            })
            if(cancelId.length>0) {
                cancelId.forEach((cancel,cid)=>{
                    if(cid !== (cancelId.length-1)) {
                        this.mainItems[cancel.id].stepList[cancel.index].execute_disabled = true;
                    }else {
                        this.mainItems[cancel.id].stepList[cancel.index].execute_disabled = false;
                    }

                 })
            }
            
            this.executorData();
        },
        // 執行人員/確認人員的比對轉換
        executorData() {
            this.mainItems.forEach(m=>{
                m.stepList.forEach(s=>{
                    if(s.executor!=='') {
                        // console.log(this.accdata.filter(x=>x.username==s.executor));
                        s.deft_executor = this.accdata.filter(x=>x.username==s.executor)[0].position+'-'+this.accdata.filter(x=>x.username==s.executor)[0].account_name;
                    }else {
                        s.deft_executor = '';
                    }
                    if(s.verifier!=='') {
                        s.deft_verifier = this.accdata.filter(x=>x.username==s.verifier)[0].position+'-'+this.accdata.filter(x=>x.username==s.verifier)[0].account_name;
                    }else {
                        s.deft_verifier = '';
                    }
                })
            })
        },
        /* 其他項目 */
        // 新增項目Dialog打開
        addsubitem: function (phase_id, addidx = undefined) {
            // phase_id 主要項目是哪個：空池
            console.log("phase:", phase_id, "addidx:",addidx);
            this.stepitem.phase_id = phase_id;
            this.stepitem.addidx = addidx;
            this.dialog.additem = true;//show dialog
            
            this.addStep = [{msg:''}];
            if(this.templatemode !== 'cycleedit') {
                // console.log(this.stepdata)
                let phase = [];
                this.mainItems.forEach(m=>{
                    if(m.phase_id==phase_id){
                        m.stepList.forEach(s=>phase.push(s.step_id));
                    }
                })
                this.stepdata = [];
                this.stepdataAll.forEach(s=>{
                    if(!phase.includes(s.id)) {
                        this.stepdata.push(s);
                    }
                })
                
                // this.showstep('edit');
                if(this.stepdata.length>0) {
                    this.stepitem = _.cloneDeep(this.stepdata[0]);
                    this.stepitem.phase_id = phase_id;
                    this.stepitem.addidx = addidx;
                    console.log('openDialog',this.stepitem);
                    this.stepmode = 'edit';
                    this.selectStep();
                }else {
                    // this.stepmode = 'add';
                    this.stepitem.phase_id = phase_id;
                    this.stepitem.addidx = addidx;
                    this.showstep(this.add);
                }
                
                
            }else {
                // 關掉Dialog重新開啟，原先的表格判斷或資料要清除
                if (this.$refs.addform != undefined) {
                    this.$refs.addform.reset();
                }
            }
           
            console.log('step add',this.mainItems);
        },
        // 新增項目確認!!送出step項目
        submitstep:async function(){
            var valid = this.$refs.addform.validate();
            const updUser = this.$auth.$state.user.email;
            console.log('valid form',valid);
            if(valid) {
                if(this.templatemode=='cycleedit') {
                    let datas = _.cloneDeep(this.mainItems);// 因要確認是否成功傳出，需額外存參數，避免失敗但頁面資料更改的狀況
                    let stepId = [];// 因會有其他的排序id問題，必須要另外存取(主要是新增的項目下)
                    let other = _.cloneDeep(this.addStep);// 不能直接用addStep，如果重新開dialog新增會清空會連動影響
                    other.forEach(step=>{
                        step.phase_id =  this.stepitem.phase_id;
                        step.seq_id = '';
                        step.msg = step.msg;
                        step.step_name_ch = '其他';
                        step.step_name_en = 'others';
                        step.verify_time='';
                        step.executor = '';
                        step.verifier = '';
                        step.created_user = this.$auth.$state.user.name;
                    })
                    datas.forEach((item,id)=>{
                        stepId.push({
                            "phase_id": item.phase_id,
                            // "phase_name_ch": item.phase_name_ch,
                            "open": item.open,
                            "color": item.color,
                            "newest": item.newest,
                            "stepList": new Array(),
                        })
                        let step=[]; // 存取其他的項目{id:'隸屬的seq_id',step:'隸屬此id下的其他'}
                        let list=[]; // 因有排序問題另外存取再取代原資料
                        if(item.phase_id == this.stepitem.phase_id) {
                            item.stepList.forEach((s,sid)=>{
                                // 非其他的項目，自動新增一個資料，主要用來存取他底下的其他項目
                                if(s.step_name_ch!=='其他') {
                                    if(this.stepitem.addidx==sid) {
                                        step.push({
                                            id: s.seq_id,
                                            step: new Array(),
                                        })
                                        other.forEach(a=>{
                                            // 如果新增的項目在最後項，需要比對下一個狀態是否已經開始執行或確認，如有，新增的項目自動變成已執行或已確認
                                            if((datas[id].stepList.length-1)==sid) {
                                                if(datas[id+1] && datas[id+1].newest && datas[id+1].newest!=='') {
                                                    // step.isConfirm = true;
                                                    a.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                    a.executor = updUser; 
                                                    if(datas[id+1].stepList[0].verify_time!=='') {
                                                        a.verify_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                        a.verifier = updUser;
                                                    }
                                                }                                                    
                                            }else {
                                                // 如果新增的項目不在最後項，需要比對下一個項目是否已經開始執行或確認，如有，新增的項目自動變成已執行或已確認
                                                if(datas[id].stepList[sid+1].execute_time &&
                                                    datas[id].stepList[sid+1].execute_time!=='') {
                                                        // step.isConfirm = true;
                                                        a.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                        a.executor = updUser; 
                                                        if(datas[id].stepList[sid+1].verify_time!=='') {
                                                            a.verify_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                            a.verifier = updUser;
                                                        }
                                                }
                                            }
                                            step[step.length-1].step.push(a);
                                        })
                                    }else {
                                        step.push({
                                            id: s.seq_id,
                                            step: new Array(),
                                        })
                                    }
                                }else {
                                    // 其他的項目，比對隸屬的項目
                                    step.forEach(tt=>{
                                        // 如index剛好為新增的index下，要將此其他後續接新增的其他，並判斷是否執行和確認
                                        if(this.stepitem.addidx==sid) {
                                            if(tt.id == parseInt(s.seq_id.split('_')[0])) {
                                                tt.step.push(s);
                                                other.forEach(a=>{
                                                    if((datas[id].stepList.length-1)==sid) {
                                                        if(datas[id+1] && datas[id+1].newest && datas[id+1].newest!=='') {
                                                            // step.isConfirm = true;
                                                            a.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                            a.executor = updUser; 
                                                            if(datas[id+1].stepList[0].verify_time!=='') {
                                                                a.verify_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                                a.verifier = updUser;
                                                            }
                                                        }                                                    
                                                    }else {
                                                        if(datas[id].stepList[sid+1].execute_time &&
                                                            datas[id].stepList[sid+1].execute_time!=='') {
                                                                // step.isConfirm = true;
                                                                a.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                                a.executor = updUser; 
                                                                if(datas[id].stepList[sid+1].verify_time!=='') {
                                                                    a.verify_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                                    a.verifier = updUser;
                                                                }
                                                        }
                                                    }
                                                    tt.step.push(a);
                                                })
                                            }
                                        }else {
                                            // 非index的新增，直接比對是哪個id項目push進去即可
                                            if(tt.id == parseInt(s.seq_id.split('_')[0])) {
                                                tt.step.push(s);
                                            }
                                        }
                                        
                                    })
                                }
                                    
                                
                            })
                            // console.log('Step',step);
                            // 因為有新增其他項目，必須重新給id
                            step.forEach(step=>{
                                step.step.forEach((tt,tid)=>{
                                    let stepid = '';
                                    if((tid+1)<10) {
                                        stepid = '0'+(tid+1);
                                    }else {
                                        stepid = tid+1;
                                    }
                                    tt.seq_id = step.id+'_'+stepid;
                                })
                            })
                            // 因為項目有順序，因此依照項目順序及旗下的其他項目依序push
                            item.stepList.forEach(s=>{
                                if(s.step_name_ch!=='其他') {
                                    list.push(s);
                                    step.forEach(tt=>{
                                        if(tt.id == s.seq_id) {
                                            if(tt.step.length>0) {
                                                tt.step.forEach(z=>list.push(z));
                                            }
                                            
                                        }
                                    })
                                }
                            })
                            stepId[id].stepList = list;
                        }else {
                            // 非新增項目，不影響排序直接用原本的資料
                            stepId[id] = item;
                        }
                    })
                    datas = stepId;
                    
                    console.log('other',other);
                    this.addSubmitApi(other,datas,this.stepitem.phase_id);
                    
                    // 串api成功 
                    // if(true) {
                    //     // 要重新給dateData，因為新加入的其他項目時間有更新
                    //     this.mainItems = datas;
                    //     this.dateData();
                    //     this.dialog.additem = false;
                    // }
                }else {
                    this.stepformedit.created_user =  (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                    this.stepformedit.updated_user =  (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                    console.log('step',this.stepformedit);
                    switch (this.stepmode) {
                        case 'add':
                            console.log('step add',this.stepitem);
                            
                            await this.$axios
                                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/`, this.stepformedit)
                                .then(res => {
                                    if(res.data=='新增成功'){
                                        this.dialog.additem = false;
                                        this.dialog.phaseform = false;
                                        this.getstepdata(true);
                                        
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
                                        var stepformedit = this.stepformedit;
                                        //同步把畫面上的資料修改成一致
                                        this.mainItems.forEach(element => {
                                            var step = element.stepList;
                                            step.filter(x=>x.step_id==id).forEach(stepele => {
                                                stepele.step_name_ch = stepformedit.name_ch;
                                            });
                                        });
                                        //this.stepformedit 要把同id所有名稱
                                        this.stepitem.id = undefined;
                                        this.getstepdata(true);
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
                }
                
                
            }
            // this.stepformedit.created_user =  (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
            // this.stepformedit.updated_user =  (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
            // console.log(this.stepformedit);
            // switch (this.stepmode) {
            //     case 'add':
            //         await this.$axios
            //             .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/`, this.stepformedit)
            //             .then(res => {
            //                 if(res.data=='新增成功'){
            //                     this.dialog.phaseform = false;
            //                     this.getstepdata();
            //                     this.$toast.success("新增成功", { duration: 2000 });
            //                 }else{
            //                     this.$toast.error("新增步驟失敗:" + res.data, { duration: 2000 });
            //                 }

            //                 console.log("新增步驟API:" + res.request.responseURL);
            //             })
            //             .catch(error => {
            //                 this.$toast.error("error:" + error, { duration: 2000 });
            //             })
            //             .finally(() => {
            //             });
            //         break;
            //     case 'edit':
            //         var id = this.stepitem.id;
            //         await this.$axios
            //         .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/${id}/`, this.stepformedit)
            //             .then(res => {
            //                 if(res.data=='修改成功'){
            //                     this.dialog.phaseform = false;
            //                     var stepformedit = this.stepformedit;
            //                     //同步把畫面上的資料修改成一致
            //                     this.mainItems.forEach(element => {
            //                         var step = element.stepList;
            //                         step.filter(x=>x.step_id==id).forEach(stepele => {
            //                             stepele.step_name_ch = stepformedit.name_ch;
            //                         });
            //                     });
            //                     //this.stepformedit 要把同id所有名稱
            //                     this.stepitem.id = undefined;
            //                     this.getstepdata();
            //                     this.$toast.success("修改成功", { duration: 2000 });
            //                 }else{
            //                     this.$toast.error("修改步驟失敗:" + res.data, { duration: 2000 });
            //                 }

            //                 console.log("修改步驟API:" + res.request.responseURL);
            //             })
            //             .catch(error => {
            //                 this.$toast.error("error:" + error, { duration: 2000 });
            //             })
            //             .finally(() => {
            //             });
            //         break;
            // }
        },
        // 送出新增的項目
        addSubmitApi(other,datas,id) {
            this.otherApi = 0;
            let api = [];
            let fail = [];
            other.forEach(async o=>{
                await this.$axios
                    .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/`, o)
                    .then(res => {
                        console.log(res);
                        if(res.data=='新增成功'){
                            this.otherApi++;
                            api.push(o);
                            if(this.otherApi == other.length) {
                                if(api.length == other.length) {
                                    // 新增成功後，因其他項目的seq_id更改，需串api修改
                                    this.reviseCycleData(datas,id,'add');
                                    this.dialog.additem = false;
                                    this.$toast.success("新增成功", { duration: 2000 });
                                }else {
                                    this.$toast.error("部分新增失敗，請重新新增", { duration: 2000 });
                                }
                            }
                            
                        }else{
                            this.otherApi++;
                            fail.push(o);
                            if(this.otherApi==other.length) {
                                if(fail.length==other.length) {
                                    this.$toast.error("新增步驟失敗", { duration: 2000 });
                                }else {
                                    this.$toast.error("部分新增失敗，請重新新增", { duration: 2000 });
                                }
                            }
                        }

                        console.log("新增步驟API:" + res.request.responseURL);
                    })
                    .catch(error => {
                        this.$toast.error("error:" + error, { duration: 2000 });
                    })
                    .finally(() => {
                    });
                
            })
        },
        // 新增/刪除多個修改
        reviseCycleData(datas,id,title) {
            datas.forEach(d=>{
                if(d.phase_id==id) {
                    let item = 0;
                    d.stepList.forEach(async step=>{
                        if(step.step_name_ch=='其他' && step.step_id) {
                            step.updated_user = this.$auth.$state.user.name;
                            console.log('step',step);
                            delete step.deft_executor;
                            delete step.deft_verifier;
                            delete step.execute_disabled;
                            await this.$axios
                                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/${step.step_id}/`, step)
                                    .then(res => {
                                        if(res.data=='修改成功'){
                                            item++;
                                            if(item == d.stepList.length) {
                                                // if(title=='add') {
                                                    // 需重新取得歷程，因為新增的項目需取得step_id
                                                    this.$emit('getTemp');
                                                // }
                                                
                                            }
                                            
                                        }
                                        
                                    })
                                    .catch(error => {
                                        this.$toast.error("error:" + error, { duration: 2000 });
                                    })
                                    .finally(() => {
                                    });
                        }else {
                            item++;
                            if(item == d.stepList.length) {
                                this.$emit('getTemp');
                            }
                        }
                            
                    })
                }
            })
        },
        // 刪除其他項目
        delsubitem: async function (phase_id, index) {
            console.log('delete',phase_id, index);
            var sub_item = this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList[index];
            if(this.templatemode == 'cycleedit') {
                if(sub_item.step_name_ch=='其他') {
                    if (confirm(`是否刪除 ${sub_item.step_name_ch}：${sub_item.msg} ？`)) {
                        // this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList.splice(index, 1);
                        // step_id
                        await this.$axios
                            .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step//${sub_item.step_id}/`)
                            .then(res => {
                                if(res.data=='刪除成功'){
                                    let stepId=[]; // 刪除其他項目id要重新給定，所以要額外存取
                                    let datas = _.cloneDeep(this.mainItems);
                                    datas.forEach((item,id)=>{
                                        stepId.push({
                                            "phase_id": item.phase_id,
                                            "phase_name_ch": item.phase_name_ch,
                                            "open": item.open,
                                            "color": item.color,
                                            "newest": item.newest,
                                            "stepList": new Array(),
                                        })
                                        if(item.phase_id == phase_id) {
                                            // item.stepList.splice(index,1);
                                            let step=[];
                                            let list=[];
                                            item.stepList.forEach((s,sid)=>{
                                                if(s.step_name_ch!=='其他') {
                                                    step.push({
                                                        id: s.seq_id,
                                                        step: new Array(),
                                                    })
                                                }else {
                                                    if(sid!==index) {
                                                        step.forEach(tt=>{
                                                        // 其他的項目比對同一隸屬的id，將項目放進step中
                                                        if(tt.id == parseInt(s.seq_id.split('_')[0])) {
                                                            tt.step.push(s);
                                                        }
                                                    })
                                                    }
                                                }
                                            })
                                            step.forEach(step=>{
                                                step.step.forEach((tt,tid)=>{
                                                    let stepid = '';
                                                    if((tid+1)<10) {
                                                        stepid = '0'+(tid+1);
                                                    }else {
                                                        stepid = tid+1;
                                                    }
                                                    tt.seq_id = step.id+'_'+stepid;
                                                })
                                            })
                                            item.stepList.forEach(s=>{
                                                if(s.step_name_ch!=='其他') {
                                                    list.push(s);
                                                    step.forEach(tt=>{
                                                        if(tt.id == s.seq_id){
                                                            tt.step.forEach(z=>list.push(z));
                                                        }
                                                    })
                                                }
                                            })
                                            stepId[id].stepList = list;

                                        }else {
                                            stepId[id].stepList = item.stepList;
                                        }

                                    })
                                    datas = stepId;
                                    this.reviseCycleData(datas,phase_id,'delete');
                                    // datas.forEach(d=>{
                                    //     if(d.phase_id==phase_id) {
                                    //         d.stepList.forEach(async step=>{
                                    //             if(step.step_name_ch=='其他') {
                                    //                 step.updated_user = this.$auth.$state.user.name;
                                    //                 await this.$axios
                                    //                     .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/${step.step_id}/`, step)
                                    //                         .then(res => {
                                    //                             if(res.data=='修改成功'){
                                    //                                 // if(true) {
                                    //                                 // 重新送出id
                                    //                                 this.mainItems = datas;
                                    //                                 // 刪除後，可能會影響最新執行的日期及disabled及狀態顏色，因此要重新整理資料
                                    //                                 this.dateData();
                                    //                             // }
                                    //                             }
                                                                
                                    //                         })
                                    //                         .catch(error => {
                                    //                             this.$toast.error("error:" + error, { duration: 2000 });
                                    //                         })
                                    //                         .finally(() => {
                                    //                         });
                                    //             }
                                                
                                    //         })
                                    //     }
                                    // })
                                    
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
                        
                        
                    }
                }
                
            }else {
                this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList.splice(index, 1);
            }
            
        },

        /* 執行/確認 */
        // 執行鈕
        async execute(id,index) {
            // 需判斷目前是甚麼狀態下：
            // 已執行(isConfirm)->不可作動
            // 取消(execute_time && execute_time!=='')-> 退回執行(刪除execute_time)
            // 執行 => 串api後撈取execute_time
            const updUser = this.$auth.$state.user.email;
            if(!this.mainItems[id].stepList[index].verify_time!=='') {
                if(this.mainItems[id].stepList[index].execute_time && this.mainItems[id].stepList[index].execute_time!=='') {
                    if (confirm(`取消執行 ${this.mainItems[id].stepList[index].step_name_ch=='其他'?this.mainItems[id].stepList[index].step_name_ch+'：'+this.mainItems[id].stepList[index].msg:this.mainItems[id].stepList[index].step_name_ch} ？`)) {
                        let items = _.cloneDeep(this.mainItems);
                        this.mainItems = []
                        items[id].stepList[index].execute_time = '';
                        items[id].stepList[index].executor = '';
                        items[id].stepList[index].updated_user = this.$auth.$state.user.name;
                        // // 取消後面的步驟已執行的均取消
                        // for(let i=id;i<items.length;i++) {
                        //     if(i==id) {
                        //         if(index!==items[i].stepList.length-1) {
                        //             for(let x=index;x<items[i].stepList.length;x++) {
                        //                 items[i].stepList[x].execute_time = '';
                        //                 items[i].stepList[x].verify_time='';
                        //             }
                                    
                        //         }
                                
                        //     }else {
                        //         items[i].stepList.forEach(x=>{
                        //             x.execute_time = '';
                        //             x.verify_time='';
                        //         })
                        //     }
                        //     this.reviseCycleData(items,items[i].phase_id,'cancel');
                        // }

                        // this.mainItems = items;
                        
                        // if(index == 0) {
                        //     this.mainItems[id].newest = '';
                        // }
                        await this.updateStatus(items[id].stepList[index],'cancel');
                        // this.dateData();
                        
                    }
                    
                }else {
                    if (confirm(`確認已執行 ${this.mainItems[id].stepList[index].step_name_ch=='其他'?this.mainItems[id].stepList[index].step_name_ch+'：'+this.mainItems[id].stepList[index].msg:this.mainItems[id].stepList[index].step_name_ch} ？`)) {
                        
                        this.mainItems[id].stepList[index].execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                        this.mainItems[id].stepList[index].executor = updUser;
                        this.mainItems[id].stepList[index].deft_executor = this.accdata.filter(x=>x.username==updUser)[0].position+'-'+this.accdata.filter(x=>x.username==updUser)[0].account_name;
                        this.mainItems[id].stepList[index].updated_user = this.$auth.$state.user.name;
                        await this.updateStatus(this.mainItems[id].stepList[index],'execute');
                        // this.dateData();
                    }
                }
            }
        },
        dateFormat(time) {
            // console.log('time',dayjs( new Date(time)).format("MM-DD HH:mm"));
            return dayjs( new Date(time)).format("MM-DD HH:mm");
        },
        // 確認鈕
        executeConfirm(id,index) {
            const updUser = this.$auth.$state.user.email;
            // console.log('Confirm',this.$auth.$state.user);
            // 確認
            if (confirm(`已確認 ${this.mainItems[id].stepList[index].step_name_ch=='其他'?this.mainItems[id].stepList[index].step_name_ch+'：'+this.mainItems[id].stepList[index].msg:this.mainItems[id].stepList[index].step_name_ch} 之前的項目已執行 ？`)) {
                this.mainItems[id].stepList[index].verify_time=dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.mainItems[id].stepList[index].verifier = updUser;
                this.mainItems[id].stepList[index].updated_user = this.$auth.$state.user.name;
                this.mainItems[id].stepList[index].deft_verifier = this.accdata.filter(x=>x.username==updUser)[0].position+'-'+this.accdata.filter(x=>x.username==updUser)[0].account_name;
                let submitData = [];
                submitData.push(this.mainItems[id].stepList[index]);
                // this.updateStatus(this.mainItems[id].stepList[index]);
                // 確認前面的均一起確認
                for(let i=0;i<=id;i++) {
                    if(i!==id) {
                        this.mainItems[i].stepList.forEach(x=>{
                            if(x.execute_time&&x.execute_time!=='' && x.verify_time=='') {
                                x.verify_time=dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                x.verifier = updUser;
                                x.updated_user = this.$auth.$state.user.name;
                                x.deft_verifier = this.accdata.filter(x=>x.username==updUser)[0].position+'-'+this.accdata.filter(x=>x.username==updUser)[0].account_name;
                                submitData.push(x);
                                // this.updateStatus(this.mainItems[i].stepList[x]);
                            }
                        })
                    }else {
                        if(index !== 0) {
                            for(let x=0;x<index;x++) {
                                if(this.mainItems[i].stepList[x].execute_time&&this.mainItems[i].stepList[x].execute_time!=='' && this.mainItems[i].stepList[x].verify_time=='') {
                                   this.mainItems[i].stepList[x].verify_time=dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                   this.mainItems[i].stepList[x].verifier = updUser;
                                   this.mainItems[i].stepList[x].updated_user = this.$auth.$state.user.name;
                                   this.mainItems[i].stepList[x].deft_verifier = this.accdata.filter(x=>x.username==updUser)[0].position+'-'+this.accdata.filter(x=>x.username==updUser)[0].account_name;
                                //    this.updateStatus(this.mainItems[id].stepList[index]);
                                    submitData.push(this.mainItems[i].stepList[x]);
                                }
                                
                            }
                        }
                        
                    }
                    
                }
                submitData.forEach(async s=>{
                    await this.updateStatus(s,'verify');
                })
                // this.colorData();
            }
            
        },
        // 確認/執行/取消 單個修改
        async updateStatus(item,title) {
            console.log(item);
            delete item.deft_executor;
            delete item.deft_verifier; 
            delete item.execute_disabled;
            // delete item.step_id;

            await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/${item.step_id}/`, item)
                    .then(res => {
                        if(res.data=='修改成功'){
                            // this.$emit('getTemp');
                            // this.$toast.success("更新成功!",{ duration: 2000 });
                            if(title=='cancel') {
                                this.$emit('getTemp');
                            }else {
                                this.dateData();
                            }
                            
                        }
                        
                    })
                    .catch(error => {
                        this.$toast.error("error:" + error, { duration: 2000 });
                    })
                    .finally(() => {
                    });
        },
        /* 樣板編輯 */
        // 刪除step(表格)
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
                        this.stepformedit = {};
                        this.stepitem.id = undefined;
                        this.stepmode = 'add';
                        // let submit = {phase_id: this.stepitem.phase_id,addidx:this.stepitem.addidx};
                        // this.stepitem = _.cloneDeep(this.stepdata[0]);
                        // this.stepitem.phase_id = submit.phase_id;
                        // this.stepitem.addidx = submit.addidx;
                        // this.showstep('edit');
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
        // 顯示step編輯視窗(add、edit)
        showstep:function(mode){
            this.stepmode=mode;
            this.stepformedit = {};
            if(mode=='edit'){//帶入資料
                var step ;
                console.log(this.stepitem);
                if(!this.stepitem.id) {
                    let submit = {phase_id: this.stepitem.phase_id,addidx:this.stepitem.addidx};
                    this.stepitem = _.cloneDeep(this.stepdata[0]);
                    this.stepitem.phase_id = submit.phase_id;
                    console.log('showStep Undefined',this.stepitem);
                    this.stepitem.addidx = submit.addidx;
                    this.stepdata = _.cloneDeep(this.stepdataAll);
                    step = this.stepdata[0];
                }else {
                    // this.stepdata = _.cloneDeep(this.stepdataAll);
                    step = this.stepdata.filter(x=>x.id==this.stepitem.id)[0];
                }
                this.stepformedit.name_ch = step.name_ch;
                this.stepformedit.name_en = step.name_en;
                this.stepformedit.remark = step.remark;
                console.log('showStep',this.stepitem,);
            }else {
                this.stepitem = {phase_id: this.stepitem.phase_id,addidx:this.stepitem.addidx};
                console.log('showStep add',this.stepformedit);
            }
            this.dialog.phaseform = true;              
        },
        // 通知上層重新撈取資料
        updateouterAction:function(val){
            this.$emit("action", val);
        },
        // 樣板儲存編輯
        saveEdit:async function(){
            if(this.$refs.mainform.validate()){
                if(confirm('是否儲存編輯？')==false){
                    return;
                }
                this.tempMain.updated_user = (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                var id = this.tempMain.id;
                var para ={
                   tempMain :  this.tempMain,
                   tempContent: new Array()
                }
                this.mainItems.forEach(m=>{
                    if(m.stepList.length>0){
                        para.tempContent.push(m)
                    }
                });
                console.log('Save Edit',para);
                await this.$axios
                    .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/${id}/`, para)
                    .then(res => {
                        console.log(res);
                        if(res.data=='修改成功'){
                            this.$toast.success("修改成功", { duration: 2000 });
                            this.updateouterAction('done');
                        }else{
                            this.$toast.error("修改樣板失敗:" + res.data, { duration: 2000 });
                        }

                        console.log("修改樣板API:" + res.request.responseURL);
                    })
                    .catch(error => {
                        this.$toast.error("error:" + error, { duration: 2000 });
                    })
                    .finally(() => {
                    });

            }
        },
        // 新增樣板
        saveTemp:async function(){
            if(this.$refs.mainform.validate()){
                this.tempMain.created_user = (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                var para ={
                   tempMain :  this.tempMain,
                   tempContent: new Array()
                }
                this.mainItems.forEach(m=>{
                    if(m.stepList.length>0){
                        para.tempContent.push(m)
                    }
                });
                // console.log(para);
                await this.$axios
                        .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/`, para)
                        .then(res => {
                            console.log('新增',res)
                            if(res.data=='新增成功'){
                                // this.dialog.phaseform = false;
                                // this.getstepdata();
                                this.$toast.success("新增成功", { duration: 2000 });
                                this.updateouterAction('done');
                            }else{
                                this.$toast.error("新增樣板失敗:" + res.data, { duration: 2000 });
                            }

                            console.log("新增樣板API:" + res.request.responseURL);
                        })
                        .catch(error => {
                            this.$toast.error("error:" + error, { duration: 2000 });
                        })
                        .finally(() => {
                        });

            }

        },
        // 取得步驟清單
        getstepdata: async function (bool=false) {
            await this.$axios
                .get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/`)
                .then(res => {
                    this.stepdataAll = res.data;
                    this.mainItems.forEach(m=>{
                        m.stepList.forEach(s=>{
                            this.stepdataAll.forEach(a=>{
                                if(s.step_id == a.id) {
                                    s.step_name_ch = a.name_ch;
                                    s.step_name_en = a.name_en;
                                }
                            })
                        })
                    })
                    if(bool) {
                        console.log('get Step',this.stepitem,this.stepformedit,this.stepdataAll);
                        let submit = {phase_id: this.stepitem.phase_id,addidx:this.stepitem.addidx};
                        this.stepitem = _.cloneDeep(this.stepformedit);
                        this.stepitem.id = this.stepdataAll.filter(x=>x.name_ch == this.stepformedit.name_ch)[0].id;
                        this.stepitem.phase_id = submit.phase_id;
                        this.stepitem.addidx = submit.addidx;
                        this.insertStep();
                    }
                    console.log("取得步驟清單API:" + res.request.responseURL);
                })
                .catch(error => {
                    this.$toast.error("error:" + error, { duration: 2000 });
                })
                .finally(() => {
                });
        },
        // 選擇步驟
        selectStep:function(){
            console.log('Select Step',this.stepitem);
            if(this.stepitem.id){
                this.showstep(this.stepmode);
                this.isEdit = false;
                // this.stepitem = this.stepdata.filter(x=>x.id == this.stepitem.id)[0];
                // this.stepitem.name_ch = this.stepdata.filter(x=>x.id == this.stepitem.id)[0].name_ch;
                // console.log(this.stepitem);
            }else{
                this.stepitem.name_ch = null;
            }
        },
        // 插入步驟(表格)
        insertStep:function(){
            var phaseid =  this.stepitem.phase_id;//項目的id
            var psubidx = this.stepitem.addidx +1 ;//+1
            console.log(`會在第${psubidx+1}插入`,this.stepitem.name_ch);
            
            var pushitem = {
                step_id : this.stepitem.id,//項目原始id
                seq_id : this.stepitem.id,
                // sort:undefined,
                step_name : this.stepitem.name_ch,
                step_name_ch : this.stepitem.name_ch,
                step_name_en : this.stepitem.name_en,
                step_exec:undefined,//執行/確認人員
                checktime:undefined,//確認時間
                result:undefined,//結果
                msg:undefined,//msg
            };
            if(this.mainItems.filter(x=>x.phase_id == phaseid).length==0){
                var itemName = this.items.filter(x=>x.id == phaseid)[0].text;
                var main_forPush = {
                    phase_id: phaseid,
                    phase_name:itemName,
                    stepList:[]
                };
                this.mainItems.push(main_forPush);
            }
            this.mainItems.filter(x=>x.phase_id == phaseid)[0].stepList.splice(psubidx,0,pushitem);
            this.dialog.additem = false;
        },
        // 檢查編輯項目，是否有更改(按鈕文字改變用)
        checkValue(name) {
            if(this.stepmode == 'edit') {
                let origin = _.cloneDeep(this.stepdataAll.filter(x=>{return x.id == this.stepitem.id}))[0];
                if(origin.name_ch !== this.stepformedit.name_ch || origin.name_en !== this.stepformedit.name_en || origin.remark !== this.stepformedit.remark) {
                    this.isEdit = true;
                }
            }
        }
    },
    computed: {
    
    },
    async mounted() {
        await this.getstepdata();//取得步驟清單
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
        });
    },
    watch: {
        windowWidth() {
            this.windowWidth = window.innerWidth;
        },
        // 養殖歷程中的狀態面板收合
        nowExpand() {
            // console.log('expand',this.nowExpand);
            let data = _.cloneDeep(this.mainItems);
            this.status.forEach(m=>{
                m.open = this.nowExpand;
            })
            this.mainItems = [];
            this.mainItems = data;
            
            console.log('mainItems',this.mainItems);
        },
        passObj: {
            handler(val){
                
                this.mainItems = _.cloneDeep(this.passObj.tempContent);
                this.mainItems.forEach(m=>m.open=this.nowExpand);
                this.sortData();
                console.log('更新passObj',this.passObj);
            // do stuff
            },
            deep: true
        }
        
    },
}
</script>

<style lang="scss" scoped>
.left,.right {
    display: flex;
    align-items: flex-start;
}

.left,.right {
    height: 100%;
    position: relative;
    .col-12,.col-md-2 {
        padding: 0;
    }
}

.left {
    padding-left: 8px;
}
.status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    // padding: 2px;
    padding-right: 4px;
    min-width: 72px;
    .status-title {
        font-size: 1rem;
    }
    .newest-date {
        font-size: 0.8rem;
        display: flex;
        flex-direction: column;
        align-items: self-end;
        margin-bottom: 8px;
        
    }
}
.status.flex-adjust,.status .newest-date.flex-adjust {
    display: flex;
    flex-direction: row;
    align-items: center;
    & > span {
        margin-left: 4px;
    }
}
.right {
    // margin-left: 8px;
    position: relative;
    width: calc(100% - 72px - 8px);
    .circle-line {
        position: absolute;
        height: 100%;
        .circle {
            width: 16px;
            height: 16px;
            background-color: #fff;
            border: 5px solid $color-primary;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
        }
        .line {
            height: 100%;
            border: 1px solid $color-primary;
            position: absolute;
            top: 16px;
            left: 6px;
        }
    }
    // &:before {
    //     content: '';
    //     position: absolute;
    //     width: 100%;
    //     height: 100%;
    //     border-left: 2px solid $color-primary;
    // }
    // &:after {
    //     content: '';
    //     width: 16px;
    //     height: 16px;
    //     border-radius: 50%;
    //     background-color: #fff;
    //     border: 5px solid $color-primary;
    //     position: absolute;
    //     top: 0;
    //     left: -7px;
    // }

}
.v-card.result-card {
    &.item-card.theme--light {
        background-color: #fff;
    }
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
.add-step {
    text-align: center;
    margin-top: -24px;
    padding-bottom: 24px;
}
::v-deep {
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
        background-color: rgba($color: $color-primary, $alpha: 0.1);
    }
}


</style>