<template>
    <div>
        <v-row class="mt-2" no-gutters >
            <!-- 主要樣版內容 -->
            <v-col cols="12"  style="padding-left: 12px;"><b>資料架構(!!!!最後要上要記得清除!!!!)：</b>[{ "phase_id": 1, "phase_name": "空池", "stepList": [ <br>&nbsp;&nbsp;&nbsp;{ "step_id": 23, "sort_id": 23, "step_name": "新增循環", "execute_time": "2023-10-25 10:12:12", confirm_time: '',executor:'',confirm:''},<br>&nbsp;&nbsp; { "step_id": 40,"sort_id": "23_01", "step_name": "其他", "msg": "i am msg 1.", "execute_time": "", "confirm_time": '',executor:'',confirm:''},]}]<br><br></v-col>
            <v-col cols="12">
                <!-- {{ tempMain }}<br>
                {{ mainItems }} -->
                <!--:dense="$vuetify.breakpoint.smAndDown" -->
                <div v-for="(mitem,id) in mainItems" :key="'status_'+mitem.phase_id" class="timeline">
                    <v-row class="template-outer" 
                        style="align-items: flex-start;margin-bottom: 0;"
                        :style="{'flexDirection':`${windowWidth<834?'column':'row'}`}">
                        <!-- 狀態+最新執行時間 -->
                        <div class="left">
                            <div class="status"
                                :class="`${windowWidth<834?'flex-adjust':''}`">
                                <!-- <div class="status-title">
                                    {{ mitem.phase_name }}
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
                            :style="{'width':`${windowWidth<834?'100%':'calc(100% - 72px - 8px)'}`,
                                    'marginLeft':`${windowWidth<834?'8px':'0'}`}">
                            <!-- 時間軸：因有顏色變換，無法使用偽元素 -->
                            <div class="circle-line">
                                <div v-if="mitem.phase_name!=='清池'" class="line"
                                    :style="{'borderColor':`${mitem.newest&&mitem.newest!==''?mitem.color:'#BFCBD2'}`,
                                            'borderStyle':`${mitem.newest&&mitem.newest!==''?'solid':'dashed'}`,
                                            'top':`${windowWidth<834?'0':'16px'}`,}"></div>
                                <div class="circle"
                                    :style="{'borderColor':mitem.color}"></div>
                            </div>
                            <!-- 表格 -->
                            <div class="content" style="width: 100%;padding: 12px 24px;">
                                <!-- {{mitem}} -->
                                <v-card class="result-card item-card">
                                    <!-- 表頭 -->
                                    <div class="card-title"
                                        :style="{'backgroundColor':mitem.color}"
                                        @click="status[id].open = !status[id].open" >
                                        <div class="title">
                                            <v-card-title>{{ mitem.phase_name }}</v-card-title>
                                        </div>
                                        <div class="chevron">
                                            <v-icon v-if="status[id].open">mdi-triangle-small-up</v-icon>
                                            <v-icon v-else>mdi-triangle-small-down</v-icon>
                                        </div>
                                    </div>
                                    <!-- 內容 -->
                                    <div v-if="status[id].open" class="content">
                                        <v-data-table light 
                                            :headers="headers"
                                            :items="mitem.stepList"
                                            
                                            hide-default-footer
                                            disable-pagination
                                            style="max-height: 300px;overflow-y: scroll;">
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
                                                    <span>下方新增其他</span>
                                                </v-tooltip>
                                                <!-- <v-btn  class="btn-icon" title="在下方新增一列" @click="addsubitem(mitem.id,index)">
                                                    <v-icon>mdi-table-row-plus-after</v-icon>
                                                </v-btn> -->
                                            </template>
                                            
                                            <!-- 執行/確認 -->
                                            <template v-slot:[`item.executed_actions`]="{ index }">
                                                <v-btn class="btn-secondary btn-small"
                                                    :class="{'disabled':mitem.stepList[index].execute_disabled}"
                                                    @click="execute(id,index)">
                                                    {{ mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''?mitem.stepList[index].confirm_time!==''?'已執行':'取消':'執行' }}
                                                </v-btn>
                                                <v-btn class="btn-primary btn-small"
                                                    :class="`${mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''&&mitem.stepList[index].confirm_time==''?'':'disabled'}`"
                                                    @click="executeConfirm(id,index)">
                                                    {{ mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''&&mitem.stepList[index].confirm_time!==''?'已確認':'確認' }}
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
                                                             :class="{'disabled':mitem.stepList[index].step_name!=='其他'}">
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
                                        <span><b>最上方資料結構中的stepList資料整理(!!!!最後要上要記得清除!!!!)</b></span>
                                        <span class="error-text"><b>Note:新增/刪除 其他 需重新給api資料 因sort_id會變更</b></span>
                                        <div class="list" v-for="step in mitem.stepList" :key="'step_'+step.sort_id">
                                            {{ step }}
                                        </div>
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
                        新增其他項目 
                        </div>
                        <div class="add" style="float: right;display: inline-block;">
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
                    </v-card-title>
                    <div class="basic">
                        <v-card-text v-for="(add,id) in addStep" :key="'add_'+id" style="display: flex;flex-direction: column;padding: 8px 16px;"
                            >
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
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="dialog.additem = false">取消</v-btn>
                        <v-btn class="btn-primary" @click="submitstep">新增</v-btn>
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
                //     id: 0,
                //     order: 0,
                //     color: 'red',
                //     icon: 'mdi-star',
                //     text: '開始'
                // },
                // {
                //     id: 1,
                //     order: 1,
                //     color: 'indigo lighten-1',
                //     icon: 'mdi-star',
                //     text: '空池'
                // },
                // {
                //     id: 2,
                //     order: 2,
                //     color: 'purple darken-1',
                //     icon: 'mdi-book-variant',
                //     text: '養殖審核'
                // },
                // {
                //     id: 3,
                //     order: 3,
                //     color: 'green lighten-1',
                //     icon: 'mdi-airballoon',
                //     text: '備池'
                // },
                // {
                //     id: 4,
                //     order: 4,
                //     color: 'indigo',
                //     icon: 'mdi-gate-buffer',
                //     text: '蓄水'
                // },
                // {
                //     id: 5,
                //     order: 5,
                //     color: 'indigo',
                //     icon: 'mdi-buffer',
                //     text: '做水'
                // },
                // {
                //     id: 6,
                //     order: 6,
                //     color: 'red lighten-2',
                //     icon: 'mdi-buffer',
                //     text: '放養中'
                // },
                // {
                //     id: 7,
                //     order: 7,
                //     color: 'indigo',
                //     icon: 'mdi-buffer',
                //     text: '清池'
                // },
                // {
                //     id: 8,
                //     order: 8,
                //     color: 'red',
                //     icon: 'mdi-star',
                //     text: '結束'
                // },
            ],
            //主要項目
            tempMain:{
                name_ch:undefined,
                name_en:undefined,
                remark:undefined,
            },
            //table
            headers: [
                { text: '新增', value: 'actions', sortable: false,width:"5%"},
                // { text: "step_id", value: "step_id", groupable: false, showmode: ['add', 'edit'] },
                // { text: "sort", value: "sort", groupable: false, showmode: ['add', 'edit'] },
                { text: "項目", value: "step_name", groupable: false, sortable: false,width:"10%"},
                // { text: "執行/確認人員", value: "step_exec", groupable: false, showmode: ['edit2'] },
                { text: "訊息", value: "msg", groupable: false, sortable: false,width:"20%"},
                { text: "執行時間", value: "execute_time", groupable: false, sortable: false,width:"20%"},
                { text: "執行", value: "executed_actions", groupable: false, sortable: false,width:"20%"},
                { text: '執行員', value: 'executor_name', sortable: false,width:"10%"},
                { text: '確認員', value: 'confirm_name', sortable: false,width:"10%"},
                { text: '刪除', value: 'udactions', sortable: false,width:"5%"},
            ],
            mainItems: [{
                phase_id: 1,
                phase_name: "空池",
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
            status:[{color:'#B1DBF0',open:true},{color:'#DD97A4',open:true},{color:'#92CDEE',open:true},{color:'#DBC5A4',open:true},{color:'#C5E8E6',open:true},{color:'#ECE499',open:true},{color:'#8BE3D3',open:true}],
            // 新增其他
            addStep:[{msg:''}],
            rules: {
                require: [v => !!v || "*必要項目"],
            },
            addvalid: false,
            
        }
    },
    created(){
       console.log("created");
       this.tempMain = this.passObj.tempMain;
       this.mainItems = this.passObj.tempContent;
       this.mainItems.forEach(m=>m.open=this.nowExpand);
    //    console.log(this.accdata);
       this.sortData();
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
                    "phase_name": m.phase_name,
                    "open": m.open,
                    "color": m.color,
                    "newest": m.newest,
                    "stepList": new Array(),
                })
                let step=[]; // 存取其他的項目{id:'隸屬的step_id',step:'隸屬此id下的其他'}
                let list=[]; // 因有排序問題另外存取再取代原資料
                m.stepList.forEach(s=>{
                    if(s.step_name=='其他') {
                        step.forEach(tt=>{
                            // 其他的項目比對同一隸屬的id，將項目放進step中
                            if(tt.id == parseInt(s.sort_id.split('_')[0])) {
                                tt.step.push(s);
                            }
                        })
                    }else {
                        // 非其他的項目新增隸屬的結構
                        step.push({
                            id: s.sort_id,
                            step: new Array(),
                        })
                    }
                })
                // 項目排序
                step.forEach(t=>{
                    t.step.sort(function(a, b) {
                        return parseInt(a.sort_id.split('_')[1]) - parseInt(b.sort_id.split('_')[1]);
                    });
                })
                // 重新帶入stepList中的資料，因為排序有異動
                m.stepList.forEach((s,sid)=>{
                    if(s.step_name!=='其他') {
                        list.push(s);
                        step.forEach(tt=>{
                            if(tt.id == s.sort_id) {
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
                            if(this.mainItems[(id-1)].stepList[this.mainItems[(id-1)].stepList.length-1].confirm_time&&
                            this.mainItems[(id-1)].stepList[this.mainItems[(id-1)].stepList.length-1].confirm_time!=='') {
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
                        if(s.confirm_time!=='') {
                            s.execute_disabled = true;
                        }else {
                            if((m.stepList[sid-1].execute_time&&m.stepList[sid-1].execute_time!=='') || (s.execute_time&&s.execute_time!=='')) {
                                if(m.stepList[sid-1].confirm_time=='') {
                                    s.execute_disabled = true;
                                }else {
                                    s.execute_disabled = false;
                                }
                                
                                
                            }else {
                                s.execute_disabled = true;
                            }
                        }
                    }else {
                        if(s.confirm_time!=='') {
                            s.execute_disabled = true;
                        }else {
                            if(mid !==0 ) {
                                if((this.mainItems[mid-1].stepList[this.mainItems[mid-1].stepList.length-1].execute_time && 
                                this.mainItems[mid-1].stepList[this.mainItems[mid-1].stepList.length-1].execute_time!=='') || 
                                (this.mainItems[mid].stepList[this.mainItems[mid].stepList.length-1].execute_time && 
                                this.mainItems[mid].stepList[this.mainItems[mid].stepList.length-1].execute_time!=='')) {
                                    if(this.mainItems[mid-1].stepList[this.mainItems[mid-1].stepList.length-1].confirm_time=='') {
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
                    if(s.execute_time && s.execute_time!=='' && s.confirm_time=='') {
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
                        s.executor_name = this.accdata.filter(x=>x.username==s.executor)[0].position+'-'+this.accdata.filter(x=>x.username==s.executor)[0].account_name;
                    }else {
                        s.executor_name = '';
                    }
                    if(s.confirm!=='') {
                        s.confirm_name = this.accdata.filter(x=>x.username==s.confirm)[0].position+'-'+this.accdata.filter(x=>x.username==s.confirm)[0].account_name;
                    }else {
                        s.confirm_name = '';
                    }
                })
            })
        },

        /* 其他項目 */
        // 新增其他項目Dialog打開
        addsubitem: function (phase_id, addidx = undefined) {
            // phase_id 主要項目是哪個：空池
            console.log("phase:", phase_id, "addidx:",addidx);
            this.stepitem.phase_id = phase_id;
            this.stepitem.addidx = addidx;
            this.dialog.additem = true;//show dialog

            // 關掉Dialog重新開啟，原先的表格判斷或資料要清除
            if (this.$refs.addform != undefined) {
                this.$refs.addform.reset();
            }
            this.addStep = [{msg:''}]
        },
        // 新增其他項目確認!!送出step項目
        submitstep:async function(){
            var valid = this.$refs.addform.validate();
            const updUser = this.$auth.$state.user.email;
            // console.log('valid form',valid);
            if(valid) {
                let datas = _.cloneDeep(this.mainItems);// 因要確認是否成功傳出，需額外存參數，避免失敗但頁面資料更改的狀況
                let stepId = [];// 因會有其他的排序id問題，必須要另外存取(主要是新增的項目下)
                let other = _.cloneDeep(this.addStep);// 不能直接用addStep，如果重新開dialog新增會清空會連動影響
                other.forEach(step=>{
                    step.sort_id = '';
                    step.msg = step.msg;
                    step.step_name = '其他';
                    step.confirm_time='';
                    step.executor = '';
                    step.confirm = '';
                })
                datas.forEach((item,id)=>{
                    stepId.push({
                        "phase_id": item.phase_id,
                        "phase_name": item.phase_name,
                        "open": item.open,
                        "color": item.color,
                        "newest": item.newest,
                        "stepList": new Array(),
                    })
                    let step=[]; // 存取其他的項目{id:'隸屬的sort_id',step:'隸屬此id下的其他'}
                    let list=[]; // 因有排序問題另外存取再取代原資料
                    if(item.phase_id == this.stepitem.phase_id) {
                        item.stepList.forEach((s,sid)=>{
                            // 非其他的項目，自動新增一個資料，主要用來存取他底下的其他項目
                            if(s.step_name!=='其他') {
                                if(this.stepitem.addidx==sid) {
                                    step.push({
                                        id: s.sort_id,
                                        step: new Array(),
                                    })
                                    other.forEach(a=>{
                                        // 如果新增的項目在最後項，需要比對下一個狀態是否已經開始執行或確認，如有，新增的項目自動變成已執行或已確認
                                        if((datas[id].stepList.length-1)==sid) {
                                            if(datas[id+1] && datas[id+1].newest && datas[id+1].newest!=='') {
                                                // step.isConfirm = true;
                                                a.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                a.executor = updUser; 
                                                if(datas[id+1].stepList[0].confirm_time!=='') {
                                                    a.confirm_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                    a.confirm = updUser;
                                                }
                                            }                                                    
                                        }else {
                                            // 如果新增的項目不在最後項，需要比對下一個項目是否已經開始執行或確認，如有，新增的項目自動變成已執行或已確認
                                            if(datas[id].stepList[sid+1].execute_time &&
                                                datas[id].stepList[sid+1].execute_time!=='') {
                                                    // step.isConfirm = true;
                                                    a.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                    a.executor = updUser; 
                                                    if(datas[id].stepList[sid+1].confirm_time!=='') {
                                                        a.confirm_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                        a.confirm = updUser;
                                                    }
                                            }
                                        }
                                        step[step.length-1].step.push(a);
                                    })
                                }else {
                                    step.push({
                                        id: s.sort_id,
                                        step: new Array(),
                                    })
                                }
                            }else {
                                // 其他的項目，比對隸屬的項目
                                step.forEach(tt=>{
                                    // 如index剛好為新增的index下，要將此其他後續接新增的其他，並判斷是否執行和確認
                                    if(this.stepitem.addidx==sid) {
                                        if(tt.id == parseInt(s.sort_id.split('_')[0])) {
                                            tt.step.push(s);
                                            other.forEach(a=>{
                                                if((datas[id].stepList.length-1)==sid) {
                                                    if(datas[id+1] && datas[id+1].newest && datas[id+1].newest!=='') {
                                                        // step.isConfirm = true;
                                                        a.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                        a.executor = updUser; 
                                                        if(datas[id+1].stepList[0].confirm_time!=='') {
                                                            a.confirm_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                            a.confirm = updUser;
                                                        }
                                                    }                                                    
                                                }else {
                                                    if(datas[id].stepList[sid+1].execute_time &&
                                                        datas[id].stepList[sid+1].execute_time!=='') {
                                                            // step.isConfirm = true;
                                                            a.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                            a.executor = updUser; 
                                                            if(datas[id].stepList[sid+1].confirm_time!=='') {
                                                                a.confirm_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                                a.confirm = updUser;
                                                            }
                                                     }
                                                }
                                                tt.step.push(a);
                                            })
                                        }
                                    }else {
                                        // 非index的新增，直接比對是哪個id項目push進去即可
                                        if(tt.id == parseInt(s.sort_id.split('_')[0])) {
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
                                tt.sort_id = step.id+'_'+stepid;
                            })
                        })
                        // 因為項目有順序，因此依照項目順序及旗下的其他項目依序push
                        item.stepList.forEach(s=>{
                            if(s.step_name!=='其他') {
                                list.push(s);
                                step.forEach(tt=>{
                                    if(tt.id == s.sort_id) {
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
                // console.log('data',this.mainItems);
                
                
                // 串api成功 
                if(true) {
                    // 要重新給dateData，因為新加入的其他項目時間有更新
                    this.mainItems = datas;
                    this.dateData();
                    this.dialog.additem = false;
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
            //                             stepele.step_name = stepformedit.name_ch;
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
        // 刪除其他項目
        delsubitem: function (phase_id, index) {
            console.log('delete',phase_id, index);
            var sub_item = this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList[index];
            if (confirm(`是否刪除 ${sub_item.step_name}：${sub_item.msg} ？`)) {
                // this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList.splice(index, 1);
                let stepId=[]; // 刪除其他項目id要重新給定，所以要額外存取
                let datas = _.cloneDeep(this.mainItems);
                datas.forEach((item,id)=>{
                    stepId.push({
                        "phase_id": item.phase_id,
                        "phase_name": item.phase_name,
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
                            if(s.step_name!=='其他') {
                                step.push({
                                    id: s.sort_id,
                                    step: new Array(),
                                })
                            }else {
                                if(sid!==index) {
                                    step.forEach(tt=>{
                                    // 其他的項目比對同一隸屬的id，將項目放進step中
                                    if(tt.id == parseInt(s.sort_id.split('_')[0])) {
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
                                tt.sort_id = step.id+'_'+stepid;
                            })
                        })
                        item.stepList.forEach(s=>{
                            if(s.step_name!=='其他') {
                                list.push(s);
                                step.forEach(tt=>{
                                    if(tt.id == s.sort_id){
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

                if(true) {
                    // 重新送出id
                    this.mainItems = datas;
                    // 刪除後，可能會影響最新執行的日期及disabled及狀態顏色，因此要重新整理資料
                    this.dateData();
                }
                
            }
        },

        /* 執行/確認 */
        // 執行鈕
        execute(id,index) {
            // 需判斷目前是甚麼狀態下：
            // 已執行(isConfirm)->不可作動
            // 取消(execute_time && execute_time!=='')-> 退回執行(刪除execute_time)
            // 執行 => 串api後撈取execute_time
            const updUser = this.$auth.$state.user.email;
            if(!this.mainItems[id].stepList[index].confirm_time!=='') {
                if(this.mainItems[id].stepList[index].execute_time && this.mainItems[id].stepList[index].execute_time!=='') {
                    if (confirm(`取消執行 ${this.mainItems[id].stepList[index].step_name=='其他'?this.mainItems[id].stepList[index].step_name+'：'+this.mainItems[id].stepList[index].msg:this.mainItems[id].stepList[index].step_name} ？`)) {
                        let items = _.cloneDeep(this.mainItems);
                        this.mainItems = []
                        items[id].stepList[index].execute_time = '';
                        // 取消後面的步驟已執行的均取消
                        for(let i=id;i<items.length;i++) {
                            if(i==id) {
                                if(index!==items[i].stepList.length-1) {
                                    for(let x=index;x<items[i].stepList.length;x++) {
                                        items[i].stepList[x].execute_time = '';
                                        items[i].stepList[x].confirm_time='';
                                    }
                                }
                                
                            }else {
                                items[i].stepList.forEach(x=>{
                                    x.execute_time = '';
                                    x.confirm_time='';
                                })
                            }
                        }

                        this.mainItems = items;
                        
                        if(index == 0) {
                            this.mainItems[id].newest = '';
                        }
                        this.dateData();
                    }
                    
                }else {
                    if (confirm(`確認已執行 ${this.mainItems[id].stepList[index].step_name=='其他'?this.mainItems[id].stepList[index].step_name+'：'+this.mainItems[id].stepList[index].msg:this.mainItems[id].stepList[index].step_name} ？`)) {
                        
                        this.mainItems[id].stepList[index].execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                        this.mainItems[id].stepList[index].executor = updUser;
                        this.dateData();
                    }
                }
            }
        },
        // 確認鈕
        executeConfirm(id,index) {
            const updUser = this.$auth.$state.user.email;
            // console.log('Confirm',updUser);
            // 確認
            if (confirm(`已確認 ${this.mainItems[id].stepList[index].step_name=='其他'?this.mainItems[id].stepList[index].step_name+'：'+this.mainItems[id].stepList[index].msg:this.mainItems[id].stepList[index].step_name} 之前的項目已執行 ？`)) {
                this.mainItems[id].stepList[index].confirm_time=dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.mainItems[id].stepList[index].confirm = updUser;
                // 確認前面的均一起確認
                for(let i=0;i<=id;i++) {
                    if(i!==id) {
                        this.mainItems[i].stepList.forEach(x=>{
                            if(x.execute_time&&x.execute_time!=='') {
                                x.confirm_time=dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                x.confirm = updUser;
                            }
                        })
                    }else {
                        if(index !== 0) {
                            for(let x=0;x<index;x++) {
                                if(this.mainItems[i].stepList[x].execute_time&&this.mainItems[i].stepList[x].execute_time!=='') {
                                   this.mainItems[i].stepList[x].confirm_time=dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                   this.mainItems[i].stepList[x].confirm = updUser;
                                }
                                
                            }
                        }
                        
                    }
                    
                }
                
                this.colorData();
            }
            
        },
        
        /* (目前無用)樣板編輯 */
        // (目前無用)刪除step
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
        // (目前無用)顯示step編輯視窗(add、edit)
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
        // (目前無用)
        updateouterAction:function(val){
            this.$emit("action", val);
        },
        // (目前無用)樣板儲存編輯
        saveEdit:async function(){
            if(this.$refs.mainform.validate()){
                if(confirm('是否儲存編輯？')==false){
                    return;
                }
                this.tempMain.updated_user = (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                var id = this.tempMain.id;
                var para ={
                   tempMain :  this.tempMain,
                   tempContent: this.mainItems
                }
                await this.$axios
                        .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/${id}/`, para)
                        .then(res => {
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
        // (目前無用)新增樣板
        saveTemp:async function(){
            if(this.$refs.mainform.validate()){
                this.tempMain.created_user = (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                var para ={
                   tempMain :  this.tempMain,
                   tempContent: this.mainItems
                }
                console.log(para);
                await this.$axios
                        .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/`, para)
                        .then(res => {
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
        // (目前無用)取得步驟清單
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
        // (目前無用)選擇步驟
        selectStep:function(){
            if(this.stepitem.id){
                this.stepitem.name_ch = this.stepdata.filter(x=>x.id == this.stepitem.id)[0].name_ch;
            }else{
                this.stepitem.name_ch = null;
            }
        },
        // (目前無用)
        insertStep:function(){
            var phaseid =  this.stepitem.phase_id;//項目的id
            var psubidx = this.stepitem.addidx +1 ;//+1
            console.log(`會在第${psubidx+1}插入`,this.stepitem.name_ch);
            
            var pushitem = {
                sort_id : this.stepitem.id,//項目原始id
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
                    phase_name:itemName,
                    stepList:[]
                };
                this.mainItems.push(main_forPush);
            }
            this.mainItems.filter(x=>x.phase_id == phaseid)[0].stepList.splice(psubidx,0,pushitem);
            this.dialog.additem = false;
        },
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
::v-deep {
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
        background-color: rgba($color: $color-primary, $alpha: 0.1);
    }
}


</style>