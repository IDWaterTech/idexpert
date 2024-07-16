<template>
    <div class="setting-layout pa-3" style="margin: 0!important;width: calc(100% - 24px);">
        <!-- 欄位 -->
        <v-row v-if="areas.ponds?.length>0" style="align-items: center;margin-bottom: 12px;flex-wrap: nowrap;">
            <div class="icon-group" style="width: 60px;margin-bottom: 8px;">
                <!-- <div v-if="!edit" class="icons">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <button class="edit" v-bind="attrs"
                            v-on="on" @click="edit=true">
                                <v-icon>mdi-pencil</v-icon>
                            </button>
                        </template>
                        <span>編輯</span>
                    </v-tooltip>
                </div> -->
                <div class="icons" style="justify-content: center;">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="btn-icon" v-bind="attrs"
                            v-on="on" @click="save()" style="margin: 0 4px;">
                                <v-icon>mdi-check</v-icon>
                            </v-btn>
                        </template>
                        <span>儲存</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="btn-icon delete" v-bind="attrs"
                            v-on="on" @click="cancelEdit()" style="margin: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </template>
                        <span>取消</span>
                    </v-tooltip>
                </div>
            </div>
            <div class="title-col text-center mx-3"
                v-for="c in maxCols" :key="c"
                style="margin-bottom: 8px;width: 120px;min-width: 120px;">
                <div v-if="maxCols > 1" class="icon-group">
                    <div class="icons">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button class="col-row-minus" v-bind="attrs" v-on="on" @click="editCols((c-1),false)">-</button>
                            </template>
                            <span>刪除欄</span>
                        </v-tooltip>
                    </div>
                </div>
                <span style="width: 100%;">欄 {{ c }}</span>
                <div class="icon-group">
                    <div class="icons">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button class="col-row-plus" v-bind="attrs" v-on="on" @click="editCols((c-1),true)">+</button>
                            </template>
                            <span>右方增加欄</span>
                        </v-tooltip>
                    </div>
                </div>
            </div>
        </v-row>
        <div v-if="areas.ponds?.length>0" style="width: 100%;">
            <v-row v-for="(pond,pid) in ponds" :key="pid" class="parent-row" id="rowL">
            <!-- 列 -->
                <div class="title-col text-center" style="min-width: 60px;justify-content: center;">
                    <div class="icon-group">
                        列 {{ pid+1 }}
                        <div class="icons">
                            <v-tooltip v-if="ponds.length > 1" bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button class="col-row-minus" v-bind="attrs" v-on="on" @click="editRows(pid,false)">-</button>
                                </template>
                                <span>刪除列</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button class="col-row-plus" v-bind="attrs" v-on="on" @click="editRows(pid,true)">+</button>
                                </template>
                                <span>下方增加列</span>
                            </v-tooltip>
                        </div>
                    </div>
                </div>
                    
                <div v-for="(b,bid) in pond.pond" :key="bid"
                    class="mx-3 my-1 text-center setting-block"
                    style="cursor: pointer;flex-shrink: 0;"
                    :style="{ 
                        minWidth: `${getWidth(b)}`,
                        borderColor:`${b.rows.length==0?'rgba(#00273E,0.5)':'#00273E'}`,
                        borderStyle:`${b.rows.length>0||(b.id==''&&b.name=='road')?'none':b.id==''?'dotted':'solid'}`,
                        borderWidth:`${b.rows.length>0||(b.id==''&&b.name=='road')?'none':'2px'}`,
                        backgroundColor:`${b.name=='road'&&b.id==''?'transparent':'white'}`,
                        }"
                    :class="{'block':b.rows.length==0 && (b.id!==''||b.name!=='road'),'road':b.id==''&&b.name=='road'}">
                    <div v-if="b.rows.length>0" style="width: 100%;height: 100%;" :style="{marginLeft:`${ $route.path=='/map'?'12px':'0' }`}">
                        <v-row v-for="(row,rid) in b.rows" :key="rid" style="width: 100%;margin-bottom: 0;">
                            <div style="width: 100%;border-width: 2px;margin: 4px 0;"
                                class="road-width flex-align-center"
                                :style="{
                                    borderColor:`${row.state==''&& row.name !=='road' && row.rows.length==0?'rgba(#00273E,0.5)':'#00273E'}`,
                                    borderStyle:`${row.rows.length>0||(row.id==''&&row.name=='road')?'none':row.state=='' && row.name !== 'road'?'dotted':'solid'}`,
                                    backgroundColor:`${row.name=='road' && row.id==''?'#e4e4e4':'white'}`,
                                    borderWidth:`${row.rows.length>0||(row.id==''&&row.name=='road')?'none':'2px'}`,}"
                                :class="{'block':row.rows.length==0 && (row.id!==''||row.name!=='road'),'road':row.id==''&&row.name=='road'}">
                                <div style="width: 100%;height: 100%;" @click="openDialog(pid,bid,rid)">
                                    <div v-if="row.name=='road'" style="width: 100%;z-index: 1000;">走道</div>
                                    <div v-else-if="row.name=='tank'">生化槽</div>
                                    <div v-else-if="row.state!==''">{{ row.name }}</div>
                                    <div v-else>空白</div>
                                </div>
                                <div class="icon-group">
                                    <div class="icons">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <button class="col-row-minus" v-bind="attrs" v-on="on" @click="deleteSubRow(pid,bid,rid)">-</button>
                                            </template>
                                            <span>刪除子項</span>
                                        </v-tooltip>
                                    </div>
                                </div>
                            </div>
                        </v-row>
                    </div>
                    <div v-else @click="openDialog(pid,bid)" style="height: 100%;margin: 0;"
                        :style="{padding:`${b.id==''&&b.name=='road'?'0':'12px'}`,}">
                        <!-- <div v-if="b.name=='road' && b.id==''">走道</div> -->
                        <div v-if="b.name == 'road' && b.id==''" style="width: 100%;height: 100%;">
                            <div v-if="b.cols>1 || b.roadDirection=='horizontal'" class="horizontal text-center">走道</div>
                            <div v-else
                                :class="{
                                    'top': (ponds[pid+1] && ponds[pid+1].pond[b.index-(maxCols-ponds[pid+1].pond.length)<0?0: b.index-(maxCols-ponds[pid+1].pond.length)] && ponds[pid+1].pond[b.index-(maxCols-ponds[pid+1].pond.length)<0?0: b.index-(maxCols-ponds[pid+1].pond.length)].name=='road'),
                                    'center': (ponds[pid+1] && ponds[pid+1].pond[b.index-(maxCols-ponds[pid+1].pond.length)<0?0: b.index-(maxCols-ponds[pid+1].pond.length)] && ponds[pid+1].pond[b.index-(maxCols-ponds[pid+1].pond.length)<0?0: b.index-(maxCols-ponds[pid+1].pond.length)].name=='road') && (ponds[pid-1] && ponds[pid-1].pond[b.index-(maxCols-ponds[pid-1].pond.length)<0?0: b.index-(maxCols-ponds[pid-1].pond.length)] && ponds[pid-1].pond[b.index-(maxCols-ponds[pid-1].pond.length)<0?0: b.index-(maxCols-ponds[pid-1].pond.length)].name=='road'),
                                    'bottom': (ponds[pid-1] && ponds[pid-1].pond[b.index-(maxCols-ponds[pid-1].pond.length)<0?0: b.index-(maxCols-ponds[pid-1].pond.length)] && ponds[pid-1].pond[b.index-(maxCols-ponds[pid-1].pond.length)<0?0: b.index-(maxCols-ponds[pid-1].pond.length)].name=='road'),
                                    'vertical': b.roadDirection == 'vertical'
                                    }">
                                <span v-if="b.center || b.roadDirection == 'vertical'" style="writing-mode: vertical-rl;">走道</span>
                            </div>
                        </div>
                        <div v-else-if="b.name=='tank'">生化槽</div>
                        <div v-else-if="b.id!==''">{{ b.name }}</div>
                        <div v-else>空白</div>
                    </div>    
                </div>
            </v-row>
        </div>
        <div v-if="areas.ponds?.length==0">無資料!請先至<router-link to="/factory"> 資料設定頁 </router-link>進行池的設定</div>
        <!-- dialog -->
        <v-dialog v-model="addDialog">
            <v-card style="max-height: inherit;">
                <v-card-title>編輯</v-card-title>
                <v-card-text>
                    <div class="select type">
                        <span>類型：</span>
                        <v-select
                            :items="type"
                            v-model="nowType"
                            class="select-area"
                            @change="selectType($event)"
                        ></v-select>  
                    </div>
                    <div v-if="nowType=='池' && !isSub" class="select sub-row">
                        <span>子項目：</span>
                        <v-select
                            :items="subRow"
                            v-model="nowSelectRow"
                            class="select-area"
                            @change="selectRow($event)"
                            return-object>
                        </v-select>
                    </div>
                    <div v-if="!isSub && nowDirection!=='直向'" class="select select-col">
                        <span>欄位占比：</span>
                        <v-select
                            :items="col"
                            v-model="nowCol"
                            name="name"
                            @change="selectCol($event)"
                            return-object>
                        </v-select>
                    </div>
                    <div v-if="nowType=='池' && (nowSelectRow==1 || isSub)" class="select pond">
                        <span>名稱：</span>
                        <v-select
                            :items="pondData"
                            v-model="nowPondName"
                            name="name"
                            item-text="name"
                            class="select-area"
                            @change="selectPond($event)"
                            return-object
                            aria-required="請選擇池的名稱">
                        </v-select>
                    </div>
                    <div v-if="isShowDirection && nowType=='走道'&&!isSub&&nowCol==1" class="select pond">
                        <span>走向：</span>
                        <v-select
                            :items="direction"
                            v-model="nowDirection"
                            item-text="name"
                            class="select-area"
                            @change="selectDirection($event)"
                            return-object>
                        </v-select>
                    </div>
                    <span v-if="isPondName" class="note">注意：其他池已使用此名稱，按下確認鈕後，原使用此名稱的池會變成 '空白' !</span>
                    
                    <v-card-actions>
                        <div class="buttons flex-align-center" style="width:100%;justify-content: flex-end;">
                            <button class="cancel" @click="cancelEditBlock()">取消</button>
                            <button class="confirm" @click="saveBlock()">確認</button>
                        </div>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import https from "https";
import _ from "lodash";
export default {
    middleware: "auth",
    data() {
        return {
            ponds: [],
            maxCols:0,
            edit: false,
            originalData: {},// 紀錄原先的data，取消用
            newData: {},
            addDialog: false,
            nowChangeObject:{},
            type:['池','走道','空白','生化槽'],
            nowType:'',
            pondData:[],
            nowPondName:'',
            isPondName: false,
            isDoubleName:{},
            nowChageid:{pid:0,bid:0},
            nowChange:{
                id: '',
                name: '',
                cols: 1,
                rows: []
            },
            subRow:[1,2,3],
            nowSelectRow:1,
            col:[],
            nowCol:1,
            deleteData:[],
            deleteDataId:[],
            isSub: false,
            isShowDirection:false,
            direction:['直向','橫向'],
            nowDirection:'橫向',
            rowL:0,
            isSetting: false
        }
    },
    props:{
        areas:{
            type: Object,
            default(rawProps) {
            return { }
            }
        }
    },
    created() {
        this.dataPrepare();
        this.getMaxCols();
        console.log('配置設定pond',this.ponds);
    },
    methods: {
        getMaxCols() {
            // 取得欄位數，並給定指定index(road判斷用)
            if(this.isSetting) {
                this.maxCols = this.ponds[0].pond.reduce((total,p)=>total+p.cols,0);
            }else {
                this.ponds[0].pond[0].cols = 1;
                this.maxCols = 1;
                this.isSetting = true;
            }
            
            // console.log('getMaxcol',this.maxCols)
            if(!this.isSetting) {
                this.maxCols = 1;
            }
            // 垂直走道設計，因為要判斷上下資料是否也為road，因此需增加參數計算上下列的實際index
            for(let i=0;i<this.ponds.length;i++) {
                let nowIndex=0; 
                for(let x=0;x<this.ponds[i].pond.length;x++) {
                if(x==0) {
                    this.ponds[i].pond[x].index = 0;
                }else {
                    this.ponds[i].pond[x].index = nowIndex;
                }
                nowIndex+=this.ponds[i].pond[x].cols;
                }
            }
            this.ponds.forEach(p=>{
                p.pond.forEach(s=>{
                    if(s.rows.length>0) {
                        let num = 0;
                        s.rows.forEach(r=>{
                        if(r.cols>num) {
                            num = r.cols;
                        }
                        })
                        s.rowMaxCols=num;
                    }
                })
            })
            // this.col = Array.from({length:this.maxCols},(v,i)=>i);
            this.getCenter();
            this.detectCols();
            return this.maxCols;
        },
        getWidth(data) {
            // 計算每格寬度
            let w = (!this.isSetting?120:(120 * data.cols)+(data.id=='' && data.name=='road'? (data.cols-1)*24:(data.cols==1?0:(data.cols-1)*24))) +'px';
            // console.log('w',w)
            return w;
        },
        getCenter() {
            // 取得直向中央走道中間格，要顯示'中央走道'文字用

            // 全部road資料
            let centerData=[];
            // 依照column數存放(因為直向走道欄位index可能會與本身不一樣ex有寫cols>1，需要進行比對再設定中央那格center=true)
            for(let i=0;i<this.maxCols;i++) {
                centerData.push({
                passIndex: i,
                data:[]
                })
            }
            for(let i=0;i<this.ponds.length;i++) {
                for(let x=0;x<this.ponds[i].pond.length;x++) {
                if(this.ponds[i].pond[x].name=='road' && this.ponds[i].pond[x].cols==1 && this.ponds[i].pond[x].roadDirection=='') {
                    for(let y=0;y<centerData.length;y++) {
                    if(this.ponds[i].pond[x].index==centerData[y].passIndex) {
                        this.ponds[i].pond[x].center = false;
                        centerData[y].data.push({
                        pid: i,
                        bid: x
                        })
                    }
                    }
                }
                }
            }
            centerData.forEach(d=>{
                if(d.data.length>0) {
                let num = parseInt(d.data.length/2)>(d.data.length-1)?(d.data.length-1):parseInt(d.data.length/2);
                let center = d.data[num];
                this.ponds[center.pid].pond[center.bid].center = true;
                }
            })
            // console.log('center',centerData);
        },
        editCols(index,bool) {
            // 新增(bool=true)/刪除欄(bool=false)
            // console.log('edit cols maxcols',this.maxCols,index);
            for(let i=0;i<this.ponds.length;i++) {
                let data = [];
                let o = 0;
                let n = 0;//目前加總的欄位數
                let isPush = false;
                for(let x=0;x<this.ponds[i].pond.length;x++) {
                    // 池的長度不為最大欄位值，代表傳進來的實際index和各欄index不同，需另外進行判斷，才能知道要在那邊新增或刪除欄
                    // 檢查目前的index是否在新舊儲存的index之前(因為有欄位合併問題，所以必須要額外比對)
                    if(this.ponds[i].pond.length!==this.maxCols) {
                        n+=this.ponds[i].pond[x].cols;
                        if(bool) {
                        // console.log('data push',n,index);
                        data.push(this.ponds[i].pond[x]);
                        if(index<n && index>=o && !isPush) {
                            data.push({id:'',name:'',state:'',updated_time:'',cols:1,rows:[]});
                            isPush = true;
                        }
                        }else {
                            // console.log('index n o',index,n,o);
                            if(index<n && index>=o) {
                                if(this.ponds[i].pond[x].cols>1 && !isPush) {
                                    this.ponds[i].pond[x].cols-=1;
                                    isPush = true;
                                    data.push(this.ponds[i].pond[x]);
                                }
                            }else {
                                data.push(this.ponds[i].pond[x]);
                            }
                        }
                        o = n;
                    }else {
                        if(bool) {
                            // console.log(x);
                            data.push(this.ponds[i].pond[x]);
                            if(x==index) {
                                data.push({id:'',name:'',state:'',updated_time:'',cols:1,rows:[]});
                            }
                        }else {
                            if(this.ponds.length==1 && this.ponds[0].pond.length==1) {
                                data.push(this.ponds[i].pond[x]);
                            }else {
                                if(x!==index) {
                                    data.push(this.ponds[i].pond[x]);
                                }
                            }
                            
                        }
                    }
                        
                }
                this.ponds[i].pond = data;
            }
            // console.log('col-p',this.ponds);
            // console.log('col-o',this.originalData);
            this.getMaxCols();
        },
        editRows(index,bool) {
            // 新增(bool=true)/刪除列(bool=false)
            if(bool) {
                let data = {pond:[]};
                for(let i=0;i<this.maxCols;i++) {
                    data.pond.push({id:'',name:'',state:'',updated_time:'',cols:1,rows:[]});
                }
                this.ponds.splice((index+1),0,data);
            }else {
                this.ponds.splice(index,1);
            }
            this.getMaxCols();
            // console.log(this.ponds);
            // console.log(this.originalData);
        },
        openDialog(pid,bid,rid) {
            // ponds[pid].pond[bid].rows[rid]
            this.addDialog = true;
            this.nowChageid = {
                pid: pid,
                bid: bid,
                rid: rid
            }
            if(rid!==undefined) {
                this.isSub = true;
                this.nowChangeObject = this.ponds[pid].pond[bid].rows[rid];
                this.nowSelectRow = 1;
                
            }else {
                this.nowChangeObject = this.ponds[pid].pond[bid];
                this.nowSelectRow = this.ponds[pid].pond[bid].rows.length==0?1:this.ponds[pid].pond[bid].rows.length;
            }
            this.nowChange = {
                id: this.nowChangeObject.id,
                name: this.nowChangeObject.name,
                cols: this.isSetting?this.nowChangeObject.cols:1,
                state: this.nowChangeObject.state,
                roadDirection: this.nowChangeObject.roadDirection,
                rows: []
            }
            // 判斷走道方向
            if(this.nowChangeObject.roadDirection!=='') {
                this.isShowDirection = true;
                if(this.nowChangeObject.roadDirection=='vertical') {
                    this.nowDirection = '直向';
                }else {
                    this.nowDirection = '橫向';
                }
                
            }else {
                this.nowDirection = '橫向';
            }
            console.log('nowChange',this.nowChange);
            
            // 判斷目前的欄位數和類型
            this.nowCol = this.isSetting?this.nowChange.cols:1;
            if(this.nowChange.state&&this.nowChange.state!=='') {
                this.nowType = '池';
                this.nowPondName = this.nowChange.name;
                
            }else {
                if(this.nowChange.name == 'road') {
                    this.nowType = '走道';
                }else if(this.nowChange.name == ''){
                    this.nowType = '空白';
                }else {
                this.nowType = '生化槽'
                }
            }
            
        },
        selectType(evt) {
            if(evt=='走道') {
                this.nowChange.id='';
                this.nowChange.name = 'road';
                this.nowChange.state = '';
                if(this.nowChange.cols==1) this.showDirection();
                this.isPondName = false;
                this.isDoubleName = {};
            }else if(evt=='空白' || evt=='生化槽') {
                this.nowChange.id='';
                this.nowChange.name = '';
                this.nowChange.state = '';
                this.isPondName = false;
                this.isDoubleName = {};
                if(evt=='生化槽') {
                this.nowChange.name = 'tank';
                }
            }else {
                // console.log(this.nowChage.id);
                // this.nowPondName = this.pondData[0].name;
                // this.nowChange.id = this.pondData[0].id;
                // this.nowChange.name = this.pondData[0].name;
                // this.nowChange.state = this.pondData[0].state;
                let data = {
                    name: this.pondData[0].name,
                    id: this.pondData[0].id,
                    state: this.pondData[0].state
                }
                this.selectPond(data);
            }
        },
        selectRow(evt) {
            if(evt!==this.nowChange.rows.length) {
                this.nowChange.rows=[];
                for(let i=0;i<evt;i++) {
                    if(i<this.nowChangeObject.rows.length) {
                        this.nowChange.rows.push(this.nowChangeObject[i]);
                        
                    }else {
                        this.nowChange.rows.push({
                            "id": '',
                            "name": '',
                            "updated_time": '',
                            "state": '',
                            "cols": 1,
                            "rows": [],
                            "roadDirection": '',
                        })

                    }
                    
                }
                this.nowPondName = '';
                this.isPondName = false;
                this.isDoubleName = {};
            }
        },
        selectCol(evt) {
            this.nowChange.cols = evt;
            if(this.evt==1) {
                this.showDirection();
            }
            // console.log(this.nowChange);
        },
        selectPond(evt) {
            this.isPondName = false;
            this.nowPondName = evt.name;
            this.ponds.forEach((p,pid)=>{
                p.pond.forEach(b=>{
                    if(b.rows.length>0) {
                        b.rows.forEach(r=>{
                            if(r.id==evt.id) {this.isDoubleName = r;this.isPondName=true;}
                        })
                    }else {
                        if(b.id==evt.id) {this.isDoubleName = b;this.isPondName = true;}
                    }
                })
            })
        //   console.log('isPond',this.ponds)
            if(this.isPondName) {
                if(this.nowChangeObject.id == evt.id) {
                    this.isPondName = false;
                    this.isDoubleName = {};
                }
            }
            // console.log('now',this.nowChangeObject.id);
            // console.log('selectPond',evt);

            this.nowChange.id = evt.id;
            this.nowChange.name = evt.name;
            this.nowChange.state = evt.state;
        //   console.log('select',this.nowChange,this.isDoubleName,this.isPondName);
        },
        selectDirection(evt) {
            // console.log('方向',evt);
            if(evt=='直向') {
                this.nowChange.roadDirection = 'vertical';
            }else if(evt=='橫向') {
                this.nowChange.roadDirection = 'horizontal';
            }
        },
        saveBlock() {
            // let newObject={};
            // let oldObject={};
            // newObject = this.nowChange;
            // oldObject = this.nowChangeObject
            // console.log('save',this.nowChange,this.ponds[this.nowChageid.bid].pond[this.nowChageid.bid]);
            
            this.nowChangeObject.id = this.nowChange.id;
            this.nowChangeObject.name = this.nowChange.name;
            this.nowChangeObject.rows = this.nowChange.rows;
            this.nowChangeObject.state = this.nowChange.state;
            console.log('save block',this.nowChange);
            if(this.isShowDirection) {
                if(this.nowDirection=='橫向') {
                    this.nowChangeObject.roadDirection = 'horizontal'; 
                }else {
                    this.nowChangeObject.roadDirection = 'vertical';
                }
            }

            if(this.ponds[this.nowChageid.pid].pond[this.nowChageid.bid].rows.length>0) {
                this.ponds[this.nowChageid.pid].pond[this.nowChageid.bid].id = '';
                this.ponds[this.nowChageid.pid].pond[this.nowChageid.bid].name = '';
                this.ponds[this.nowChageid.pid].pond[this.nowChageid.bid].state = '';
                this.ponds[this.nowChageid.pid].pond[this.nowChageid.bid].roadDirection = '';
            }
            if(this.nowChange.id!==''&&this.nowChange.name!=='road') {
                this.ponds[this.nowChageid.pid].pond[this.nowChageid.bid].roadDirection = '';
            }
            if(!this.isSub) {
                this.caculateCol();
            }
            if(this.isPondName) {
            this.isDoubleName.id = '';
            this.isDoubleName.name = '';
            this.isDoubleName.state = '';
            this.isDoubleName.rows = [];
            }
            
            // console.log('edit',this.ponds);
            // this.getMaxCols();
            if(this.nowChange.name=='road'&&this.nowChange.id=='' && !this.isSub) {
                this.caculateRoad();
                this.getCenter();
            }
            
            this.cancelEditBlock();
        },
        caculateCol() {
            let pid = this.nowChageid.pid;
            let bid = this.nowChageid.bid;
            let maxNum = 0;
            if(this.nowChange.cols>this.nowChangeObject.cols) {
                // cols相差值(多新增的欄位數)
                let num = this.nowChange.cols - this.nowChangeObject.cols;
                this.ponds[pid].pond[bid].cols = this.nowChange.cols;
                let pre = 0;
                let lessNum = [];
                let isFrontedCol = false;
                if(bid!==this.ponds[pid].pond.length-1) {
                    //先判斷後半，相加值(pre)是否為相差值(num)
                    for(let i=bid+1;i<this.ponds[pid].pond.length;i++) {
                        pre+=this.ponds[pid].pond[i].cols;
                        if(pre!==num) {
                            if(pre>num) {
                                // 相加後大於相差值，代表此欄位數量較多，因此將原欄位數-多出的欄位數
                            this.ponds[pid].pond[i].cols = pre-num;
                            break;
                            }else {
                                if(!lessNum.includes(i)) lessNum.push(i);
                                //判斷前半
                                isFrontedCol = true;
                            }

                        }else {
                            // console.log('pre==max')
                            if(!lessNum.includes(i)) lessNum.push(i);
                            break;
                            // this.ponds[pid].pond.splice(i);
                        }
                    }
                }else {
                    isFrontedCol = true;
                }
            //   console.log('lessNum',lessNum);
            //    console.log('front',pre,num,this.ponds[pid],isFrontedCol);
                // 判斷前半
                if(isFrontedCol) {
                    if(bid==0) {
                    
                    }else {
                    
                        for(let i=bid-1;i>=0;i--) {
                        // console.log(bid,i);
                        pre+=this.ponds[pid].pond[i].cols;
                        
                        if(pre!==num) {
                            if(pre>num) {
                                this.ponds[pid].pond[i].cols = pre-num;
                                break;
                            }else {
                                if(!lessNum.includes(i)) lessNum.push(i);
                            }
                        }else {
                            console.log('pre==max front');
                            if(!lessNum.includes(i)) lessNum.push(i);
                            break;
                        }
                        }
                    }
                    
                }
                if(lessNum.length>0) {
                    let data = [];
                    for(let i=0;i<this.ponds[pid].pond.length;i++) {
                        if(!lessNum.includes(i)) {
                            data.push(this.ponds[pid].pond[i]);
                        }
                    }
                    this.ponds[pid].pond = data;
                //   console.log('pond',this.ponds[pid]);
                }  
            }else {
                let num = this.nowChangeObject.cols - this.nowChange.cols;
                this.ponds[pid].pond[bid].cols = this.nowChange.cols;
                for(let i=0;i<num;i++) {
                    this.ponds[pid].pond.push({
                        "id": '',
                        "name": '',
                        "updated_time": '',
                        "state": '',
                        "cols": 1,
                        "rows": [],
                        "roadDirection": '',
                    })
                }
                
            }
            // console.log('caculate col',this.nowChange);
        },
        caculateRoad() {
        //   console.log('caculate road',this.nowChageid);
        let pid = this.nowChageid.pid;
        let bid = this.nowChageid.bid;
        let init = [];
        let roadcols=[];
        let deleteid = [];
        this.ponds[pid].pond.forEach(p=>roadcols.push(0));
        for(let i=0;i<this.ponds[pid].pond.length;i++) {
            if(this.ponds[pid].pond[i].name=='road' && this.ponds[pid].pond[i].id=='' && this.ponds[pid].pond[i].roadDirection!=='vertical') {
                if(i==0) {
                    init.push(i);
                    roadcols[i] = this.ponds[pid].pond[i].cols;
                }else {
                    // 前一格是走道
                    if((this.ponds[pid].pond[i-1].name=='road' && this.ponds[pid].pond[i-1].id==''&& this.ponds[pid].pond[i-1].roadDirection!=='vertical')) {
                        roadcols[init[init.length-1]]+=this.ponds[pid].pond[i].cols;
                        deleteid.push(i);
                        roadcols.splice(i,1);
                    }else {
                        // 前一格不是走道(新走道的起始點)
                        init.push(i);
                        roadcols[i] = this.ponds[pid].pond[i].cols;
                    }
                }
                
            }            
        }
        if(init.length>0) {
            let data = [];
            this.ponds[pid].pond.forEach((p,pid)=>{
                if(!deleteid.includes(pid)) {
                    data.push(p);
                }
            })
            this.ponds[pid].pond = data;
            for(let i=0;i<init.length;i++) {
                if(roadcols[init[i]]>1) {
                    this.ponds[pid].pond[init[i]].cols = roadcols[init[i]];
                }
            }
        }

        
        },
        cancelEditBlock() {
            this.addDialog = false;
            this.isDoubleName = {};
            this.isPondName = false;
            this.nowChange = {id: '',name: '',state:'',cols: 1,rows: []}
            this.nowChangeObject = {};
            this.isSub = false;
            this.nowDirection = '橫向';
            this.isShowDirection = false;
        },
        showDirection() {
            // 檢查上下左右是否有走道
            let pid = this.nowChageid.pid;
            let bid = this.nowChageid.bid;
            let isAnyRoad = false;
            if(this.ponds[pid].pond[bid].cols>1) {
                if((this.ponds[pid].pond[bid+1] && this.ponds[pid].pond[bid+1].id==''&&this.ponds[pid].pond[bid+1].name=='road')||
                    (this.ponds[pid].pond[bid-1] && this.ponds[pid].pond[bid-1].id==''&&this.ponds[pid].pond[bid-1].name=='road')) {
                        isAnyRoad = true;
                }
                if(this.ponds[pid+1]) {
                    let cols=0;
                    let o=0;
                    for(let i=0;i<this.ponds[pid+1].length;i++) {
                        cols+=this.ponds[pid+1].pond[i].cols;
                        if(bid>o && bid<=cols) {
                            if(this.ponds[pid+1].pond[i].id==''&&this.ponds[pid+1].pond[i].id=='road') {
                                isAnyRoad = true;
                            }
                        }
                    }
                }
                if(this.ponds[pid-1]) {
                    let cols=0;
                    let o=0;
                    for(let i=0;i<this.ponds[pid-1].length;i++) {
                        cols+=this.ponds[pid-1].pond[i].cols;
                        if(bid>o && bid<=cols) {
                            if(this.ponds[pid-1].pond[i].id==''&&this.ponds[pid-1].pond[i].id=='road') {
                                isAnyRoad = true;
                            }
                        }
                    }
                }
                
            }
            
            if(!isAnyRoad) {
                this.isShowDirection = true;
                if(this.nowChangeObject.roadDirection!=='') {
                    this.nowChange.roadDirection = this.nowChangeObject.roadDirection;
                }else {
                    this.nowChange.roadDirection = 'horizontal';
                    this.nowDirection = '橫向'
                }
                if(this.nowChange.roadDirection == 'vertical') {
                    this.nowDirection = '直向';
                }else {
                    this.nowDirection = '橫向'
                }
                
            }else {
                this.isShowDirection = false;
            }
            // console.log('showDirection',isAnyRoad,this.nowDirection);
        },
        save: async function() {
            this.originalData = [];
            let saveData = [];
            for(let i=0;i<this.ponds.length;i++) {
                this.originalData.push({pond:[]});
                let data = [];
                saveData.push({pond:[]});
                for(let x=0;x<this.ponds[i].pond.length;x++) {
                    data.push({
                        "id": this.ponds[i].pond[x].id,
                        "name": this.ponds[i].pond[x].name,
                        "updated_time": this.ponds[i].pond[x].update_time,
                        "state": this.ponds[i].pond[x].state,
                        "cols": this.ponds[i].pond[x].cols,
                        "rows": this.ponds[i].pond[x].rows,
                        "roadDirection": this.ponds[i].pond[x].roadDirection,
                    });
                    if(this.ponds[i].pond[x].cols>0) {
                        saveData[i].pond.push({
                            "id": this.ponds[i].pond[x].id,
                            "name": this.ponds[i].pond[x].name,
                            "cols": this.ponds[i].pond[x].cols,
                            "rows": [],
                            "state": this.ponds[i].pond[x].state,
                            "roadDirection": this.ponds[i].pond[x].roadDirection,
                            "isSetting": true
                        })
                    }
                    
                    let row = [];
                    if(this.ponds[i].pond[x].rows.length>0) {
                        for(let y=0;y<this.ponds[i].pond[x].rows.length;y++) {
                            if(this.ponds[i].pond[x].rows[y].cols>0) {
                                row.push({
                                    "id": this.ponds[i].pond[x].rows[y].id,
                                    "name": this.ponds[i].pond[x].rows[y].name,
                                    "cols": this.ponds[i].pond[x].rows[y].cols,
                                    "rows": [],
                                    "state": this.ponds[i].pond[x].rows[y].state,
                                    "roadDirection": this.ponds[i].pond[x].rows[y].roadDirection,
                                    "isSetting": true
                                })
                            }
                            
                        }
                        saveData[i].pond[x].rows = row;
                    }
                }
                this.originalData[i].pond = data;
            }
            this.edit = false;
            this.newData = {
                "id": this.areas.id,
                "area_no": this.areas.areaNo,
                "ponds": saveData,
                "created_user": this.$auth.$state.user ? this.$auth.$state.user.name : ''
            };
            console.log('save',this.newData);
            const agent = new https.Agent({
                rejectUnauthorized: false
            });
            var res = false;
            res = await this.postMapList(this.newData);
            // await this.$axios
            // .post(`${this.$store.state.mydata.gobal_api.apiUrl}/map/`,this.newData, { httpsAgent: agent })
            // .then(res => {
            //     // console.log('save Change',res);
            //     if(res.data=='新增成功') {
            //         this.$toast.success('修改成功', {
            //             duration: 2000
            //         });
            //     }
            //     // this.$emit('getPondData');
            // })
            // .catch(error => {
            // // alert("error:" + error.message);
            // });
        },
        cancelEdit() {
            this.edit = false;
            this.newData = {};
            this.ponds = [];
            this.dataPrepare();
            // for(let i=0;i<this.originalData.length;i++) {
            //     this.ponds.push({pond:[]});
            //     let data = [];
            //     for(let x=0;x<this.originalData[i].pond.length;x++) {
            //         data.push({
            //             "id": this.originalData[i].pond[x].id,
            //             "name": this.originalData[i].pond[x].name,
            //             "updated_time": this.originalData[i].pond[x].update_time,
            //             "state": this.originalData[i].pond[x].state,
            //             "cols": this.originalData[i].pond[x].cols,
            //             "rows": this.originalData[i].pond[x].rows,
            //             "roadDirection": this.originalData[i].pond[x].roadDirection,
            //         });
            //     }
            //     this.ponds[i].pond = data;
            // }
            // if(!this.isSetting) {
            //     this.maxCols = 1;
            // }
            // this.getMaxCols();
            // console.log(this.ponds,this.isSetting);
            
        },
        deleteSubRow(pid,bid,rid) {
        console.log('delete sub row',this.ponds[pid].pond[bid],rid);
        this.ponds[pid].pond[bid].rows.splice(rid,1);
        if(this.ponds[pid].pond[bid].rows.length==1) {
            this.ponds[pid].pond[bid].id = this.ponds[pid].pond[bid].rows[0].id;
            this.ponds[pid].pond[bid].name = this.ponds[pid].pond[bid].rows[0].name;
            this.ponds[pid].pond[bid].state = this.ponds[pid].pond[bid].rows[0].state;
            this.ponds[pid].pond[bid].cols = this.ponds[pid].pond[bid].rows[0].cols;
            this.ponds[pid].pond[bid].rows = [];
            if(this.ponds[pid].pond[bid].name == 'road') {
                this.ponds[pid].pond[bid].roadDirection = 'horizontal';
            }
            console.log('del after',this.ponds[pid].pond[bid])
        }
        },
        dataPrepare() {
        // 所有的池資料
        this.pondData = [];
        this.ponds = [];
        this.originalData = [];
        this.isSetting = false;
        let areaData = _.cloneDeep(this.areas);
        let deleteSet = [];
        for(let i=0;i<areaData.ponds?.length;i++) {
            this.ponds.push({pond:[]});
            this.originalData.push({pond:[]});
            let data1 = [];
            let data2 = [];
            let isSet = false;
            for(let x=0;x<areaData.ponds[i].pond.length;x++) {
                if(areaData.ponds[i].pond[x].isSetting || (areaData.ponds[i].pond[x].name=='road'&&areaData.ponds[i].pond[x].id=='')) {
                    this.isSetting = true;
                    isSet = true;
                    data1.push({
                        "id": areaData.ponds[i].pond[x].id,
                        "name": areaData.ponds[i].pond[x].name,
                        "updated_time": areaData.ponds[i].pond[x].update_time,
                        "state": areaData.ponds[i].pond[x].state,
                        "cols": areaData.ponds[i].pond[x].cols,
                        "rows": areaData.ponds[i].pond[x].rows,
                        "roadDirection": areaData.ponds[i].pond[x].roadDirection,
                    });
                    data2.push({
                        "id": areaData.ponds[i].pond[x].id,
                        "name": areaData.ponds[i].pond[x].name,
                        "updated_time": areaData.ponds[i].pond[x].update_time,
                        "state": areaData.ponds[i].pond[x].state,
                        "cols": areaData.ponds[i].pond[x].cols,
                        "rows": areaData.ponds[i].pond[x].rows,
                        "roadDirection": areaData.ponds[i].pond[x].roadDirection,
                    });
                }
                // 取得池的資料
                if(areaData.ponds[i].pond[x].rows.length>0) {
                    for(let y=0;y<areaData.ponds[i].pond[x].rows.length;y++) {
                        if(areaData.ponds[i].pond[x].rows[y].isSetting) {
                            this.isSetting = true;
                        }
                        if(areaData.ponds[i].pond[x].rows[y].id!==''&& areaData.ponds[i].pond[x].rows[y].name!=='road') {
                            this.pondData.push({
                                id: areaData.ponds[i].pond[x].rows[y].id,
                                name: areaData.ponds[i].pond[x].rows[y].name,
                                state: areaData.ponds[i].pond[x].rows[y].state
                            })
                        }
                    } 
                }else {
                    if(areaData.ponds[i].pond[x].id!==''&& areaData.ponds[i].pond[x].name!=='road') {
                        this.pondData.push({
                            id: areaData.ponds[i].pond[x].id,
                            name: areaData.ponds[i].pond[x].name,
                            state: areaData.ponds[i].pond[x].state
                        })
                    }
                }
            }
            if(isSet) {
                this.ponds[i].pond = data1;
                this.originalData[i].pond = data2; 
            }else {
                deleteSet.push(i);
            }
        }
        if(!this.isSetting) {
            this.ponds = [{
                pond: [{
                    "id": '',
                    "name": '',
                    "updated_time": '',
                    "state": '',
                    "cols": 0,
                    "rows": [],
                    "roadDirection": '',
                }]
            }]
            this.originalData = [{
                pond: [{
                    "id": '',
                    "name": '',
                    "updated_time": '',
                    "state": '',
                    "cols": 0,
                    "rows": [],
                    "roadDirection": '',
                }]
            }];
        }else {
            if(deleteSet.length>0) {
                let data=[];
                for(let i=0;i<this.ponds.length;i++) {
                    if(!deleteSet.includes(i)) {
                        data.push(this.ponds[i]);
                    } 
                }
                this.ponds = data;
                this.originalData = data;
            }
        }
        // console.log('pond',this.ponds)
        },
        detectCols() {
        // console.log('MaxCols',this.maxCols);
        for(let i=0;i<this.ponds.length;i++) {
            let cols = 0;
            for(let x=0;x<this.ponds[i].pond.length;x++) {
                if(this.ponds[i].pond[x].cols!==0){
                    cols+=this.ponds[i].pond[x].cols;
                }
            }
            // console.log('col',cols);
            if(cols<this.maxCols) {
                for(let y=0;y<this.maxCols-cols;y++) {
                    this.ponds[i].pond.push({
                        "id": '',
                        "name": '',
                        "updated_time": '',
                        "state": '',
                        "cols": 1,
                        "rows": [],
                        "roadDirection": '',
                    })
                }
            }
        }
        }
    },
    watch: {
    areas() {
        this.dataPrepare();
        this.getMaxCols();
    },
    maxCols() {
        this.col = Array.from({ length: this.maxCols}, (num, i) => i+1);
    },
    ponds() {
        this.getMaxCols();
    }
    }
}
</script>
  
<style lang="scss">
    * {
        box-sizing: border-box;
    }
    .parent-row {
        @include size(100%);
        margin-bottom: 12px;
        flex-wrap: nowrap;
    //   min-width: 1200px;
    }
        .row + .row {
            align-items: center;
        }
        .v-card.map, .v-card.bg-card {
        .block {
            color: #00273E;
            border-radius: 6px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            width: 100%;
            width: 120px;
        }
        .icon-group {
            .icons {
                display: flex;
                margin-right: 0;
                justify-content: space-around;
                .confirm {
                    transition: all 0.3s;
                    &:hover {
                        background-color: lighten($color: $color-primary, $amount: 2);
                    }
                    &.close {
                        background-color: $color-accent;
                        &:hover {
                            background-color: lighten($color: $color-accent, $amount: 2);
                        }
                    }
                    
                }
                .col-row-plus,.col-row-minus {
                    @include size(24px);
                    color: $color-accent;
                    border: 1px solid $color-accent;
                    margin: 2px;
                    border-radius: 12px;
                    transition: all 0.3s;
                    &:hover {
                        background-color: rgba($color-accent,0.25);
                    }
                }
                .col-row-plus {
                    color: $color-primary;
                    border-color: $color-primary;
                    &:hover {
                        background-color: rgba($color-primary,0.25);
                    }
                }
                .edit i {
                    color: rgba(0, 0, 0, 0.54);
                }
            }
        }
    }

    .title-col {
        @include flexCenterBetween();
        padding: 4px;
        border: 1px solid rgba($color-dark,0.5);
        border-radius: 4px;
        // width: 120px;
    }
    // road
    .road {
        position: relative;
        padding: 0;
    //   width: 100%;
        border: none;
        background-color: transparent;
        border-radius: 4px;
    //   width: 120px;
        & > div {
        position: relative;
        @include size(100%);
        @include flexAlignCenter();
        }
        & > div.icon-group {
        width: initial;
        }
        &:hover {
        background-color: #c6c6c6;
        }
        .horizontal,.top,.center,.bottom,.vertical {
            padding: 0;
            @include size(100%,36px);
            background-color: #e4e4e4;
            margin: 0;
            margin-right: -12px;
            border-radius: 4px;
        }
        .horizontal {
        padding: 6px;
        // margin: 0 12px;
        // width: calc(100% - 24px);
        }
        .top,.center,.bottom, .vertical {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 36px;
        height: calc(100% + 32px);
        @include flexAllCenter();
        }
        .vertical {
        border-radius: 4px;
        height: auto;
        // height: calc(100% + 56px);
        margin-top: -24px;
        span {
            padding: 8px 0;
        }
        }
        .center {
            border-radius: 0;
            margin-top: 0;
            height: calc(100% + 84px);
        }
        
        .bottom {
        border-radius: 0 0 4px 4px;
        margin-top: 0;
        &.vertical {
            margin-top: -48px;
            height: calc(100% + 84px);
        }
        }
        .top {
            border-radius: 4px 4px 0 0;
            margin-top: -24px;
            &.vertical {
            margin-top: -24px;
            //   height: calc(100% + 12px);
            }
            // margin-top: 0;
        }
        .center.bottom{
        margin-top: -56px;
        height: calc(100% + 120px);
        }
        
    }

    // dialog
    .v-dialog__content {
        width: inherit;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .v-card {
            min-height: inherit;
            .v-card__title {
                color: #00273E;
                font-weight: bold;
            }
        }
        .buttons {
            margin-bottom: 12px;
            button {
                padding: 8px 16px;
                margin: 4px;
                background-color: $color-primary;
                color: #fff;
                border-radius: 4px;
                &.cancel {
                    background-color: #fff;
                    border: 1px solid $color-primary;
                    color: $color-primary;
                }
            }
        }
        .select {
            @include flexAlignCenter();
            margin-bottom: 8px;
            .theme--light.v-label, .theme--light.v-icon, .theme--light.v-input {
                margin-top: 0;
                .select-area .theme--light.v-label, .select-area .theme--light.v-icon, .select-area .theme--light.v-input {
                    margin-top: 0;
                }
                .v-select__selection--comma {
                    color: $color-form;
                }
                .select-area .theme--light.v-label, .select-area .theme--light.v-icon, .select-area .theme--light.v-input {
                    margin-top: 0;
                }
    
            }
        }
        .note {
            color: $color-accent;
        }
        
    }

</style>