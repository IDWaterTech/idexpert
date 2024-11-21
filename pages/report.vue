<template>
    <div class="basic">
        <v-overlay :value="!isLoading" :absolute="true">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card class="bg-card" style="margin-bottom: 16px;">
            <div class="content" style="padding-left: 0;padding-top:12px;padding-bottom: 0;">
                <v-row>
                    <v-col cols="12" md="2" sm="5">
                        <div class="report-list">
                            <div class="report-title">請選擇欲下載的報表</div>
                            <div class="search-bar">
                                <v-text-field
                                    v-model="searchString"
                                    prepend-inner-icon="mdi-magnify"
                                    outlined
                                    value="" dense type="text"
                                    placeholder="搜尋報表.."
                                    hide-details
                                    @change="searchStringList"></v-text-field>
                            </div>
                            <div class="list">
                                <div class="item" :class="{'active':item.id==nowList.id}" v-for="(item,i) in reportList" :key="'list_'+i" @click="searchParams(item)">
                                    <span>{{ item.name_ch }}</span>
                                </div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" md="10" sm="7">
                        <div class="report-search">
                            <v-row v-if="nowList.id"><div class="report-title">{{ nowList.name_ch }}下載</div></v-row>
                            <v-form v-model="downloadvalid" ref="downloadform">
                                <v-row v-if="showStartDate">
                                    <v-col cols=12 md="6" v-for="(form,i) in download" :key="'form_'+i">
                                        <!-- 場/區/池 -->
                                        <locate-select v-if="(form.name=='pool'||form.name=='area'||form.name=='field')"  :dataScope="form.name" class="select-template" defaultSelect="" :isMulti="form.is_multi"
                                        @scopeSel_data="get_scopeData($event,form)" :class="{'error':isPoolError}"></locate-select>
                                        <span v-if="(form.name=='pool'||form.name=='area'||form.name=='field')&&!isPoolError" style="height: 14px;display: block;"></span>
                                        <!-- 開始日期 -->
                                        <v-menu v-if="form.type=='date'&&form.remark=='start'" v-model="menu_startdate[i]" :close-on-content-click="false" :nudge-right="40"
                                            transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="form.value" :label="form.name" prepend-icon="mdi-calendar" readonly dense 
                                                style="height: 20px;"
                                                v-bind="attrs" v-on="on" @click:prepend="
                                                    () => {
                                                        showStartDate = false;
                                                        form.value = getNowDate();
                                                        showStartDate = true;
                                                    }
                                                " :rules="rules.require"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="form.value" locale="zh-tw" :max="computeStartDate(i)" no-title 
                                                @input="closeDate('start',i)"></v-date-picker>
                                        </v-menu>
                                        <!-- 結束日期 -->
                                        <v-menu v-if="form.type=='date'&&form.remark=='end'" v-model="menu_enddate[i]"  :close-on-content-click="false" :nudge-right="40"
                                            transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="form.value" :label="form.name" prepend-icon="mdi-calendar" readonly dense 
                                                style="height: 20px;"
                                                v-bind="attrs" v-on="on" @click:prepend="
                                                    () => {
                                                        showStartDate = false;
                                                        form.value = getNowDate();
                                                        showStartDate = true;
                                                    }
                                                " :rules="rules.require"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="form.value" locale="zh-tw" :min="computeEndDate(i)" :max="getNowDate()" no-title @input="
                                                closeDate('end',i)"></v-date-picker>
                                        </v-menu>
                                        <!-- 開始日期+時間 -->
                                        <div v-if="form.type=='time'&&form.remark=='start'&&form.value!==null&&form.value!==''" class="date-time-picker" style="width:100%">
                                            <span class="label">{{ form.name }}</span>
                                        </div>
                                        <div v-if="form.type=='time'&&form.remark=='start'" class="date-time-picker" style="width:100%">
                                            <v-icon
                                                :class="{'error-icon':isStartTimeError}"
                                                @click="showDate=false;form.value = getNowDateTime();showDate=true;"
                                                style="margin-right: 8px;">mdi-calendar</v-icon>
                                            <a-date-picker v-if="showDate" v-model="form.value" format="yyyy-MM-DD HH:mm:ss" :class="{'error--text':isStartTimeError}" :disabled-date="disabledStartDate" show-time :placeholder="form.name" :rules="rules.require" @change="onChange($event,form.remark)" @ok="onOk" />
                                        </div>
                                        <div v-if="form.type=='time'&&form.remark=='start' && isStartTimeError" class="date-time-picker" style="width:100%">
                                            <span class="error-text">*必填項目</span>
                                        </div>
                                        <!-- 結束日期+時間 -->
                                        <div v-if="form.type=='time'&&form.remark=='end'&&form.value!==null&&form.value!==''" class="date-time-picker" style="width:100%">
                                            <span class="label">{{ form.name }}</span>
                                        </div>
                                        <div v-if="form.type=='time'&&form.remark=='end'" class="date-time-picker" style="width:100%">
                                            <v-icon
                                                :class="{'error-icon':isEndTimeError}"
                                                @click="showDate=false;form.value = getNowDateTime();showDate=true;"
                                                style="margin-right: 8px;">mdi-calendar</v-icon>
                                            <a-date-picker v-if="showDate" v-model="form.value" format="yyyy-MM-DD HH:mm:ss" :class="{'error--text':isEndTimeError}" :disabled-date="disabledEndDate" show-time :placeholder="form.name" :rules="rules.require" @change="onChange($event,form.remark)" @ok="onOk" />
                                        </div>
                                        <div v-if="form.type=='time'&&form.remark=='end' && isEndTimeError" class="date-time-picker" style="width:100%">
                                            <span class="error-text">*必填項目</span>
                                        </div>
                                        <!-- 下拉選單 -->
                                        <v-select
                                            v-if="form.type=='select'&&form.option"
                                            v-model="form.value"
                                            :items="form.option"
                                            item-text="name"
                                            item-value="value"
                                            :label="form.name"
                                            @change="formChange($event,i)"
                                            :rules="rules.require"
                                            :multiple="form.is_multi"
                                            ></v-select>
                                        <!-- 文字 -->
                                        <v-text-field
                                            v-if="form.type=='text'" col=12 md="6" :rules="rules.require" :label="form.name"
                                            v-model="form.value" dense type="text" @change="formChange($event,i)">
                                            </v-text-field>
                                        <!-- 數字 -->
                                        <v-text-field
                                            v-if="form.type=='number'" col=12 md="6" :rules="rules.require" :label="form.name"
                                            v-model.number="form.value" dense type="number" min="0" @change="formChange($event,i)">
                                            </v-text-field>
                                        <!-- true/false  -->
                                        <v-checkbox 
                                            v-if="form.type=='boolean'"
                                            v-model="form.value"
                                            dense hide-details
                                            @change="formChange($event,i)"
                                            :label="form.name"></v-checkbox>
                                        <!-- {{ nowParameter[form.para] }} -->
                                    </v-col>
                                    
                                </v-row>
                            </v-form>
                            
                            <div v-if="download.length>0" class="download">
                                <v-btn class="btn-primary download" @click="downloadReport">下載</v-btn>
                            </div>
                            <span v-else style="margin-top: -24px;display: block;">請選擇左側列表中欲下載之報表</span>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-card>
    </div>
</template>

<script>
import dayjs from "dayjs";
import XLSX from "xlsx/xlsx.js";
import FileSaver from "file-saver";
export default {
    layout: "emptynologin2",
    middleware: "auth",
    head(){
        return{
            title:'報表下載'
        }
    },
    data() {
        return {
            allReportList:[],//儲存列表所有
            reportList:[],//列表顯示(因應搜尋)
            nowParameter:[],//現在點選的列表之表單格式(get api取得)
            searchString:'',//搜尋列的輸入文字
            nowList:{}, //列表選擇
            download:[],//表單內容
            menu_startdate: [],//開始日期menu用
            menu_enddate: [],//結束日期menu用
            showDate: true,//ant design的時間日期
            rules: { require: [v => !!v || "*必要項目"] },
            downloadvalid: false,
            isPoolError:false,// 場區池未選擇
            isStartTimeError:false,// 開始時間日期未選擇
            isEndTimeError:false,// 結束時間日期未選擇
            showStartDate:true,
            showEndDate:[],
            isLoading: false,
            file:''
        }
    },
    async created() {
        this.isLoading = false;
        // this.allReportList = [{name: '飼料報表',id:1,tag: ['飼料','套餐']},{name:'循環紀錄',id:2,tag:['養殖','報表']},{name:'財務報表',id:3,tag:['錢']}];
        await this.getReports();
        await this._pageCheck(); //驗證頁面是否可檢視
        
    },
    methods: {
        // 取得報表清單
        async getReports() {
            let getReportList = await this.getReportList();
            let data = typeof (getReportList)=='string'?[]:getReportList;
            this.allReportList = _.cloneDeep(data);
            this.allReportList.forEach(report=>{
                report.tag = [];
                report.tags.forEach(t=>{
                    report.tag.push(t.name_en.toLowerCase());
                    report.tag.push(t.name_ch);
                })
            })
            this.reportList = _.cloneDeep(this.allReportList);
            console.log('報表',this.allReportList);
            this.isLoading = true;
        },
        // 搜尋
        searchStringList(evt) {
            let s = evt.toLowerCase();
            // console.log('>>>>>>>search',s)
            this.reportList = this.allReportList.filter(item=>item.name_ch.match(evt)||item.tag.indexOf(s)!==-1);
        },
        // 點選列表
        searchParams(item) {
            this.isLoading = false;
            this.download = [];
            this.nowParameter = {};
            // 為了重置locateselect元件設定timeout
            setTimeout(()=>{
                this.isPoolError = false;
                this.isStartTimeError = false;
                this.isEndTimeError = false;
                this.menu_startdate = [];
                this.menu_enddate = [];
                this.showStartDate = true;
                if(this.nowList.id!==item.id) {
                    this.nowList = {};
                    this.get_scopeData(null,'');
                    // type 決定欄位樣式，name 欄位名稱，para: key值，
                    // type=select-range name須為field/arae/pool三擇一，type=date/time需搭配remark(標註start/end)，type='select'需搭配option(要有name,id)
                    this.nowList = _.cloneDeep(item);
                    // if(this.nowList.id==1) {
                    //     this.nowParameter = {
                    //         range:{type: 'select_range',name:'field',is_multi:true},
                    //         startdate:{type: 'date',name:'開始日期',remark:'start'},
                    //         enddate:{type: 'date',name:'結束日期',remark:'end'},
                    //         startdate1:{type: 'date',name:'開始日期1',remark:'start'},
                    //         enddate1:{type: 'date',name:'結束日期1',remark:'end'},
                    //         starttime:{type:'time',name:'開始日期時間',remark:'start'},
                    //         endtime:{type:'time',name:'結束日期時間',remark:'end'},
                    //         text:{type:'text',name:'字串'},
                    //         number:{type:'number',name:'數字'},
                    //         checkbox:{type:'boolean',name:'I \'m a checkbox'},
                    //         select:{type:'select',name:'I \'m a selection',is_multi:false,option:[{name:'option1',id:1},{name:'option2',id:2}]}
                    //     }
                    // }else if(this.nowList.id==2) {
                    //     this.nowParameter = {
                    //         range:{type: 'select_range',name:'area'},
                    //         startdate:{type: 'date',name:'開始日期',remark:'start'},
                    //         enddate:{type: 'date',name:'結束日期',remark:'end'}
                    //     }
                    // }else if(this.nowList.id==3) {
                    //     this.nowParameter = {
                    //         range:{type: 'select_range',name:'pool'},
                    //         starttime:{type:'time',name:'開始日期時間',remark:'start'},
                    //         endtime:{type:'time',name:'結束日期時間',remark:'end'},
                    //         text:{type:'text',name:'打串文字'},
                    //         select:{type:'select',name:'選選選',option:[{name:'史瑞克',id:1},{name:'費歐娜',id:2}]}
                    //     }
                    // }
                    // item.input_config['select'] = {type:'select',name:'I \'m a selection',option:[{name:'option1',id:1},{name:'option2',id:2}],is_multi:true}
                    this.nowParameter = _.cloneDeep(item.input_config);
                    var keyLst = Object.keys(this.nowParameter);
                    keyLst.forEach((k,i)=>{
                        if(this.nowParameter[k].type=='text'){
                            this.nowParameter[k].value = '';
                        }else if(this.nowParameter[k].type=='boolean') {
                            this.nowParameter[k].value = false;
                        }else if(this.nowParameter[k].type=='time'){
                            this.nowParameter[k].value = null;
                        }else if(this.nowParameter[k].type=='date'){
                            if(this.nowParameter[k].remark=='start') {
                                this.menu_startdate[i] = false;
                            }else {
                                this.showEndDate[i] = true;
                            }
                            this.nowParameter[k].value = null;
                        }else if(this.nowParameter[k].type=='select_range'){
                            // this.nowParameter[k].name = 'pool';
                            // this.nowParameter[k].is_multi = true;
                            this.nowParameter[k].value = [];
                        }else if(this.nowParameter[k].type=='select'){
                            // this.nowParameter[k].name = 'pool';
                            // this.nowParameter[k].is_multi = true;
                            if(this.nowParameter[k].is_multi) {
                                this.nowParameter[k].value = [];
                            }else {
                                this.nowParameter[k].value = null;
                            }
                            
                        }else {
                            this.nowParameter[k].value = null;
                        }
                        this.nowParameter[k].para=k;
                        this.download.push(this.nowParameter[k]);
                    })
                    this.get_scopeData(null,this.download.filter(x=>x.type=='select_range').length>0?this.download.filter(x=>x.type=='select_range')[0].name:'');
                }else {
                    this.nowList = {};
                    this.get_scopeData(null,this.download.filter(x=>x.type=='select_range').length>0?this.download.filter(x=>x.type=='select_range')[0].name:'');
                }
                this.isLoading = true;
            },1)
            if (this.$refs.downloadform != undefined) {
                this.$refs.downloadform.reset();
            }

        },
        // 選擇範圍(場/區/池)
        get_scopeData(evt,form) {
            if(evt!==null) {
                this.isPoolError = false;
            }
            if(evt!==null && form.name!=='') {
                if(form.name=='pool') {
                    // pool evt=>id
                    if(form.is_multi) {
                        this.download.filter(x=>x.name==form.name)[0].value = evt;
                    }else {
                        this.download.filter(x=>x.name==form.name)[0].value = [];
                        this.download.filter(x=>x.name==form.name)[0].value.push(evt);
                    }
                    this.file='';
                    let area = []
                    let maindata = JSON.parse(localStorage.getItem('architecture'));
                    maindata.forEach(m=>{m.node.forEach(a=>a.node.forEach(p=>{
                        if(this.download.filter(x=>x.name==form.name)[0].value.includes(p.id)){
                            if(!area.map(x=>x.name).includes(p.name)){
                                area.push({name:a.name,id:a.id,pool:[p.name]})
                            }else{
                                area.forEach(data=>{
                                    if(data.id==a.id){
                                        data.pool.push(p.name)
                                    }
                                })
                            }
                        }
                    }))})
                    area.forEach(x=>{
                        this.file+=x.name;
                        x.pool.forEach(p=>{
                            this.file+=p
                        })
                        this.file+='_';
                    })
                    
                }else if(form.name=='area' || form.name=='field') {
                    // area evt=>區名_id; field evt=>場名_id
                    if(form.is_multi) {
                        this.download.filter(x=>x.name==form.name)[0].value = [];
                        this.download.filter(x=>x.name==form.name)[0].value = evt.map(x=>parseInt(x.split('_')[x.split('_').length-1]))
                        this.file = '';
                        evt.forEach(x=>{
                            this.file+=x.split('_')[0]+'_'
                        })
                    }else {
                        this.download.filter(x=>x.name==form.name)[0].value = [];
                        this.download.filter(x=>x.name==form.name)[0].value.push(parseInt(evt.split('_')[evt.split('_').length-1]))
                        this.file = x.split('_')[0]+'_';
                    }
                    
                    // this.download.filter(x=>x.name==form.name)[0].value = evt.split('_')[evt.split('_').length-1]; 
                }
            }
            
            // console.log(this.download.filter(x=>x.name==form.name))
        },
        // 日期
        getNowDate: function() {
            let mydate = dayjs().format("YYYY-MM-DD");
            return mydate;
        },
        closeDate(type,i) {
            this.showStartDate = false;
            console.log('>>>>>>>>closed',this.menu_startdate[i])
            if(type=='start') {
                this.menu_startdate[i] = false;
                this.showStartDate = true;
                
            }else {
                this.menu_enddate[i] = false;
                this.showStartDate = true;
            }
        },
        computeStartDate(i) {
            let now=true;
            let value = null;
            for(let x=i;x<this.download.length;x++) {
                if(this.download[x].remark=='end'&&this.download[x].type=='date') {
                    if(this.download[x].value!==null&&this.download[x].value!=='') {
                        now=false;
                        value = this.download[x].value;
                    }
                    break;
                }
                    
            }
            return now?this.getNowDate():value;
        },
        computeEndDate(i) {
            let now=true;
            let value = null;
            for(let x=i;x>=0;x--) {
                if(this.download[x].remark=='start'&&this.download[x].type=='date') {
                    if(this.download[x].value!==null&&this.download[x+1].value!=='') {
                        now=false;
                        value = this.download[x].value;
                    }
                    break;
                }
            }
            return now?null:value;
        },
        // 日期+時間
        onChange(evt,type) {
            console.log(evt);
            this.showDate = false;
            if(evt!==null) {
                this.download.filter(x=>x.remark==type&& x.type=='time')[0].value = this.$moment(new Date(evt), 'YYYY-MM-DD HH:mm:ss');
                if(type=='start') {this.isStartTimeError=false}else{this.isEndTimeError=false}
            }else {
                this.download.filter(x=>x.remark==type&& x.type=='time')[0].value = '';
            }
            this.showDate = true;
        },
        onOk(value) {
        },
        getNowDateTime() {
            return this.$moment(new Date(), 'YYYY-MM-DD HH:mm');
            
        },
        // date+time 開始日期時間的disabled
        disabledStartDate(date) {
            let now = this.$moment(new Date(), 'YYYY-MM-DD HH:mm');
            let d = this.$moment(new Date(date), 'YYYY-MM-DD HH:mm');
            let end;
            if(this.download.filter(x=>x.remark=='end'&&x.type=='time').length>0&&this.download.filter(x=>x.remark=='end'&&x.type=='time')[0].value!==null) {
                end = this.$moment(new Date(this.download.filter(x=>x.remark=='end')[0].value), 'YYYY-MM-DD HH:mm');
            }
            return this.download.filter(x=>x.remark=='end'&&x.type=='time').length>0&&this.download.filter(x=>x.remark=='end'&&x.type=='time')[0].value!==null? end<d:now<d;
        },
        // date+time 結束日期時間的disabled
        disabledEndDate(date) {
            // download.filter(x=>x.para=='startdate').length>0
            let now = this.$moment(new Date(), 'YYYY-MM-DD HH:mm');
            let d = this.$moment(new Date(date), 'YYYY-MM-DD HH:mm');
            let start;
            if(this.download.filter(x=>x.remark=='start'&&x.type=='time').length>0&&this.download.filter(x=>x.remark=='start'&&x.type=='time')[0].value!==null) {
                start = this.$moment(new Date(this.download.filter(x=>x.remark=='start'&&x.type=='time')[0].value), 'YYYY-MM-DD HH:mm');
                if(start>now) {
                    start = now;
                }
            }
            return this.download.filter(x=>x.remark=='start'&&x.type=='time').length>0&&this.download.filter(x=>x.remark=='start'&&x.type=='time')[0].value!==null? start>d || now<d :now<d;
        },
        // text select checkbox
        formChange(evt,i) {
            if(this.download.length>0) {
                let parm = _.cloneDeep(this.download);
                this.download = [];
                parm[i].value = evt;
                this.download = parm;
            }
            
        },
        // 下載
        async downloadReport() {
            let parm={};
            if(this.download.filter(x=>x.type=='select_range').length>0) {
                if(this.download.filter(x=>x.type=='select_range')[0].value==null||this.download.filter(x=>x.type=='select_range')[0].value.length==0) {
                    this.isPoolError = true;
                }else {
                    // this.download.filter(x=>x.type=='select_range')[0].value = parseInt(this.download.filter(x=>x.type=='select_range')[0].value);
                }
            }
            if(this.download.filter(x=>x.remark=='start'&&x.type=='time').length>0) {
                if(this.download.filter(x=>x.remark=='start'&&x.type=='time')[0].value==null) {
                    this.isStartTimeError = true;
                }
            }
            if(this.download.filter(x=>x.remark=='end'&&x.type=='time').length>0) {
                if(this.download.filter(x=>x.remark=='end'&&x.type=='time')[0].value==null) {
                    this.isEndTimeError = true;
                }
            }
            var valid = this.$refs.downloadform.validate();
            if(valid&&!this.isPoolError&&!this.isStartTimeError&&!this.isEndTimeError) {
                this.download.forEach(d=>{
                    if(d.type=='time'){
                        parm[d.para]=dayjs(new Date(d.value)).format('YYYY-MM-DD HH:mm:ss')
                    }else if(d.type=='select_range'){
                        let maindata = JSON.parse(localStorage.getItem('architecture'));
                        maindata.forEach(m=>{m.id=parseInt(m.id.split('_')[m.id.split('_').length-1]);m.node.forEach(a=>a.id=parseInt(a.id.split('_')[a.id.split('_').length-1]))})
                        console.log(d.value,maindata)
                        if(d.name=='area') {
                            let value_area = [];
                            maindata.forEach(m=>{
                                m.node.forEach(a=>{
                                    if(d.value.includes(a.id)) {
                                        value_area = [...value_area,...a.node.map(p=>p.id)]
                                    }
                                })
                            })
                            parm[d.para] = _.cloneDeep(value_area);
                        }else if(d.name=='field'){
                            
                            let value_field = [];
                            maindata.forEach(m=>{
                                if(d.value.includes(m.id)) {
                                    m.node.forEach(a=>{
                                        value_field = [...value_field,...a.node.map(p=>p.id)]
                                    })
                                }
                            })
                            parm[d.para] = _.cloneDeep(value_field);
                        }else {
                            parm[d.para]=d.value
                        }
                    }else{parm[d.para]=d.value}
                });
                console.log(parm);
                let data = [
                    {
                        name: '123',
                        total:10
                    },{
                        name: '456',
                        total:20
                    }
                ]

                // data.push(parm);
                // 下載
                let url = this.nowList.url.split('/api')[1];
                console.log('url',url, `${this.nowList.name_ch}_${this.file}${dayjs().format("YYYY-MM-DD")}.xlsx`)
                await this.$axios
                    .get(`${this.$store.state.mydata.gobal_api.apiUrl}${url}`, { params: parm })
                    .then(async res => {
                        console.log('res',res);
                        // let archiData = JSON.parse(localStorage.getItem('architecture'));
                        // console.log(archiData);
                        // let file = '';
                        // let select = '';
                        // let para = '';
                        // var keyLst = Object.keys(this.nowParameter);
                        // keyLst.forEach((k,i)=>{
                        //     if(this.nowParameter[k].type=='select_range'){
                        //         select = this.nowParameter[k].name;
                        //         para = k;
                        //     }
                        // })
                        // console.log(select,para,this.nowParameter[para])
                        // if(select) {
                        //     archiData.forEach(main=>{
                        //         if(select=='field'){
                        //             if(main.id==this.nowParameter[para].value) {
                        //                 file = main.name;
                        //             }
                        //         }else if(select=='area') {
                        //             main.node.forEach(area=>{
                        //                 if(area.id==this.nowParameter[para].value) {
                        //                     file = main.name+'_'+area.name;
                        //                 }
                        //             })
                        //         }else {
                        //             main.node.forEach(area=>{
                        //                 area.node.forEach(pool=>{
                        //                     if(pool.id==this.nowParameter[para].value) {
                        //                         file = main.name+'_'+area.name+'_'+pool.name;
                        //                     }
                        //                 })
                        //             })
                        //         }
                        //     })
                        // }
                        if(res.data.messages) {
                            this.$toast.error("錯誤：" + res.data.messages[0], { duration: 2000 });
                        }else {
                            var ws = XLSX.utils.json_to_sheet(res.data);
                            var wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, "");
                            XLSX.writeFile(wb,`${this.nowList.name_ch}_${this.file}${dayjs().format("YYYY-MM-DD")}.xlsx`);
                        }
                    })
                    .catch(error => {
                        if(error.response) {
                            this.$toast.error("錯誤：" + error.response.data.messages[0], { duration: 2000 });
                            console.error('API Error:', error.response);
                        }else {
                            this.$toast.error("錯誤：" + error, { duration: 2000 });
                            console.log(error);
                        }
                        // console.log("error:" + error.message);
                    })
                // var ws = XLSX.utils.json_to_sheet(data);
                // var wb = XLSX.utils.book_new();
                // XLSX.utils.book_append_sheet(wb, ws, "");
                // XLSX.writeFile(wb,`下載_${this.nowList.name}_${dayjs().format("YYYY-MM-DD")}.xlsx`);
                
            }
            
        },
        
    },
    computed: {
        
    },
    watch: {
        searchString() {
            this.searchStringList(this.searchString);
        }
    }
}
</script>

<style lang="scss" scoped>
.v-card.bg-card .content .row {
    display: flex;
    align-items: flex-start !important;
}
.content {
    .report-list {
        * {
            color: $color-dark;
        }
        .report-title {
            font-size: 1rem;
            font-weight: bold;
            padding-bottom: 8px;
            border-bottom: 1px solid $color-black-10;
            
        }
        .search-bar {
            padding: 8px;
            margin-top: 8px;
        }
        .list {
            padding: 16px 8px;
            height: 60vh;
            overflow-y: scroll;
            .item {
                padding: 16px;
                cursor: pointer;
                transition: all 0.3s;
                border-radius: 4px;
                &.active {
                    background-color: $color-primary-25;
                }
                &:hover {
                    background-color: rgba($color-primary,0.1);
                }
            }
        }
    }
    .report-search {
        @include size(100%,72vh);
        border: 1px solid $color-primary;
        border-radius: 4px;
        padding: 16px;
        overflow-y: scroll;
        .download {
            margin-top: 24px;
            @include flexCenterEnd();
        }
        .error-text {
            margin-left: 32px;
            font-size: 0.75rem;
        }
        .error-icon {
            &.v-icon {
                color: red;
            }
        }
        .date-time-picker {
            .label {
                font-size: 0.75rem;
                margin-left: 36px;
                color: rgba(0,0,0,0.6);
                margin-top: -12px;
            }
        }
        .report-title {
            font-size: 1.25rem;
            font-weight: bold;
            // padding-bottom: 8px;
            color: $color-dark;
            
        }
        
    }
}
::v-deep {
    // ant-design date-picker
    .ant-input::placeholder {
        color: rgba(0,0,0,0.6);
        font-size: 1rem;
    }
    .error--text {
        .ant-calendar-picker-input.ant-input,.ant-calendar-picker:hover .ant-calendar-picker-input:not(.ant-input-disabled) {
            border-color: red !important;
        }
        .ant-input::placeholder {
            color: red;
        }
    }
    
}
@media (max-width:599.98px) {
    .content {
        .report-list {
            .list {
                height: 30vh;
                overflow-y: scroll;
            }
            
        }
    }    
}
</style>