<template>
    <div>
        <v-row class="mt-2" no-gutters >
            <v-col cols="12" v-if="templatemode!='cycleedit'">
                <v-form ref="mainform">
                    <v-row dense class="text-center">
                        <v-col cols="12" md="2" sm="3">
                            <v-text-field v-model="tempMain.name_ch" filled dense hide-details :rules="rules.require" :disabled="templatemode!=='add'&&!passObj.tempMain.is_enable||tempMain.id==1" 
                                label="樣板名稱(中)" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2" sm="3">
                            <v-text-field v-model="tempMain.name_en" filled dense hide-details :rules="rules.require" :disabled="templatemode!=='add'&&!passObj.tempMain.is_enable||tempMain.id==1"
                                label="樣板名稱(英)" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2" sm="3">
                            <v-text-field v-model="tempMain.remark" filled dense hide-details label="備註" clearable :disabled="templatemode!=='add'&&!passObj.tempMain.is_enable||tempMain.id==1"></v-text-field>
                        </v-col>
                        <v-col cols="2" v-if="templatemode=='add'" style="display: flex;align-items: center;justify-content: flex-start;">
                            <v-btn class="btn-primary" title="儲存樣板"
                                :class="{'disabled':!(tempMain.name_ch && tempMain.name_en) || templatemode=='edit'&&!passObj.tempMain.is_enable}"
                                @click="saveTemp"
                                style="padding: 0 8px;">
                                <v-icon style="font-size: 1.5rem;">mdi-content-save</v-icon>儲存
                            </v-btn>
                            <v-btn class="btn-secondary delete" title="清空樣板"
                                @click="clearTemp"
                                style="padding: 0 8px;">清空樣板
                            </v-btn>
                        </v-col>
                        <v-col cols="2" v-if="templatemode=='edit'" style="display: flex;align-items: center;justify-content: flex-start;">
                            <v-btn class="btn-primary" title="儲存編輯"
                                :class="{'disabled':!(tempMain.name_ch && tempMain.name_en)|| templatemode=='edit'&&!passObj.tempMain.is_enable}"
                                @click="saveEdit"
                                style="padding: 0 8px;">
                                <v-icon style="font-size: 1.5rem;">mdi-content-save</v-icon>儲存
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
            <!-- 主要樣版內容 -->
            <v-col cols="12">
                <div v-if="passObj.nowEnd" class="error-text" style="padding: 12px;"><b>此循環已結束({{ passObj.ended_date }})</b></div>
                <div v-for="(mitem,id) in mainItems" :key="'status_'+mitem.phase_id+'_'+Math.floor(Math.random() * 1000)" class="timeline">
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
                        <div class="right"
                            :style="{'width':`${windowWidth<834 || templatemode!=='cycleedit'?'100%':'calc(100% - 72px - 8px)'}`,
                                    'marginLeft':`${windowWidth<834?'8px':'0'}`}">
                            <!-- 時間軸：因有顏色變換，無法使用偽元素 -->
                            <div class="circle-line">
                                <div v-if="id !== (mainItems.length-1)" class="line"
                                    :style="{'borderColor':`${templatemode=='cycleedit'?(mitem.newest&&mitem.newest!==''?mitem.color:'#BFCBD2'):status[id].color}`,
                                            'borderStyle':`${(mitem.newest&&mitem.newest!=='')||templatemode!=='cycleedit'?'solid':'dashed'}`,
                                            'top':`${windowWidth<834?'0':'16px'}`,}"></div>
                                <div class="circle"
                                    :style="{'borderColor':`${templatemode=='cycleedit'?mitem.color:status[id].color}`}"></div>
                            </div>
                            <!-- 表格 -->
                            <div class="content" style="width: 100%;padding: 12px 24px;">
                                <!-- {{mitem}} -->
                                <v-card class="result-card item-card">
                                    <!-- 表頭 -->
                                    <div class="card-title"
                                        :style="{'backgroundColor':`${templatemode=='cycleedit'?mitem.color:status[id].color}`}"
                                        @click="open(mitem,id)" >
                                        <div class="title">
                                            <v-btn v-if="judgePhase(id)" class="btn-icon green" @click="open(mitem,id);addWorkDialogOpen(templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id,0)"><v-icon>mdi-plus</v-icon></v-btn>
                                            <v-card-title>
                                                {{ templatemode=='cycleedit'?mitem.phase_name_ch:mitem.phase_name }}
                                                <span v-if="templatemode!=='cycleedit'"> ． {{ mitem.day }} 天</span>
                                                <span v-else> ． {{computedTotalDay(mitem)}} 天</span>
                                            </v-card-title>
                                        </div>
                                        <div class="chevron">
                                            <v-icon v-if="adjustOpen(mitem,id)">mdi-triangle-small-up</v-icon>
                                            <v-icon v-else>mdi-triangle-small-down</v-icon>
                                        </div>
                                    </div>
                                    <!-- 內容 -->
                                    <div v-if="adjustOpen(mitem,id)&&mitem.stepList&&mitem.stepList.length>0" class="content">
                                        <div class="work-content" v-for="(work,wid) in mitem.stepList" :key="'work_'+mitem.phase_id+'_'+wid">
                                            <div class="card-title">
                                                <div class="title" @click="openWork(id,wid)" >
                                                    <v-icon v-if="work.open">mdi-triangle-small-up</v-icon>
                                                    <v-icon v-else>mdi-triangle-small-down</v-icon>
                                                    <v-tooltip v-if="work.remark&&work.remark!==''" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-card-title style="font-size: 0.9rem;" v-bind="attrs" v-on="on">{{work.step_name }}
                                                                <span v-if="work.actionList&&work.actionList.length>0&&templatemode!=='cycleedit'">． {{computedDay(work)}} 天</span> 
                                                                <span v-else-if="passObj.tempContent[id].stepList&&passObj.tempContent[id].stepList.length>0&&passObj.tempContent[id].stepList[wid].actionList&&passObj.tempContent[id].stepList[wid].actionList.length>0&&templatemode=='cycleedit'">． {{computedDay(work)}} 天</span>
                                                                <span v-else>． 0 天 </span>
                                                            </v-card-title>
                                                        </template>
                                                        <span>{{ work.remark }}</span>
                                                    </v-tooltip>
                                                    
                                                    <v-card-title v-else style="font-size: 0.9rem;">{{work.step_name }}
                                                        <span v-if="work.actionList&&work.actionList.length>0&&templatemode!=='cycleedit'">． {{computedDay(work)}} 天</span>
                                                        <span v-else-if="passObj.tempContent[id].stepList&&passObj.tempContent[id].stepList.length>0&&passObj.tempContent[id].stepList[wid].actionList&&passObj.tempContent[id].stepList[wid].actionList.length>0&&templatemode=='cycleedit'">． {{ computedDay(work)}} 天</span>
                                                        <span v-else>． 0 天</span>
                                                    </v-card-title>
                                                </div>
                                                <div v-if="templatemode!=='cycleedit'" class="chevron" style="display: flex;align-items: center;">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <button class="btn-icon-secondary" v-bind="attrs" v-on="on" @click="editWorkDialogOpen(work,templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id,wid)">
                                                                <v-icon>mdi-pencil</v-icon>
                                                            </button>
                                                        </template>
                                                        <span>編輯此工作</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <button class="btn-icon-secondary green" v-bind="attrs" v-on="on" @click="addWorkDialogOpen(templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id,wid)">
                                                                <v-icon>mdi-plus</v-icon>
                                                            </button>
                                                        </template>
                                                        <span>在此之後新增工作</span>
                                                    </v-tooltip>
                                                </div>
                                                <div v-else class="chevron" style="display: flex;align-items: center;">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <button class="btn-icon green" :class="{'disabled':judgeWork(templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id,wid,'add')}" v-bind="attrs" v-on="on" @click="addWorkDialogOpen(templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id,wid)">
                                                                <v-icon>mdi-plus</v-icon>
                                                            </button>
                                                        </template>
                                                        <span>在此之後新增工作</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn slot="append-outer" class="btn-icon delete" :class="{'disabled':judgeWork(templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id,wid,'delete')}" @click="deleteCycleWork(templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id,wid)" v-bind="attrs" v-on="on"><v-icon>mdi-trash-can</v-icon></v-btn>
                                                        </template>
                                                        <span>移除工作</span>
                                                    </v-tooltip>
                                                </div>
                                            </div>
                                            <v-data-table v-if="work.open" light 
                                                :headers="headers.filter(x => x.showmode.includes(templatemode))"
                                                :items="work.actionList?work.actionList:[]"
                                                :no-data-text="templatemode=='cycleedit'?'無':'暫無動作，請點選編輯按鈕編輯動作'"
                                                hide-default-footer
                                                disable-pagination
                                                style="max-height: 300px;overflow-y: scroll;"
                                                :item-class="itemRowBackground"
                                                :item-key="'table_'+id"
                                                class="data-table">
                                                <template v-for="(header,hid) in headers" v-slot:[`header.${header.value}`]>
                                                    <div v-if="header.text=='操作' && templatemode=='cycleedit'" class="tool" :key="'header_'+hid+id" style="display: flex;align-items: center;">
                                                        {{ header.text }}
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on }">
                                                                <v-btn class="btn-icon just-icon" v-on="on">
                                                                    <v-icon>mdi-information-outline</v-icon>
                                                                </v-btn>
                                                            </template>
                                                            <span>僅可編輯/刪除『疾病檢驗』及『水質檢驗』項目</span>
                                                        </v-tooltip>
                                                    </div>
                                                    <span v-else :key="'header_'+hid">{{ header.text }}</span>
                                                </template>
                                                <!-- 新增 -->
                                                <!-- <template v-slot:[`item.actions`]="{ index }">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn  class="btn-icon just-icon"
                                                                title="下方新增其他" 
                                                                @click="addsubitem(mitem.phase_id,index)"
                                                                :class="{'disabled':templatemode=='edit'&&!passObj.tempMain.is_enable}"
                                                                v-bind="attrs" v-on="on">
                                                                <v-icon>mdi-table-row-plus-after</v-icon>
                                                            </v-btn>
                                                        </template>
                                                        <span>{{ templatemode=='cycleedit'?'下方新增其他':'下方新增項目'}}</span>
                                                    </v-tooltip>
                                                </template> -->
                                                <!-- 項目名稱 -->
                                                <template v-slot:[`item.step_name_ch`]="{ item }">
                                                    <v-tooltip v-if="templatemode=='cycleedit' && (item.type==1 || item.type==2)" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <span v-bind="attrs" v-on="on">{{ item.step_name }}</span>
                                                        </template>
                                                        <span>{{ item.status }}</span>
                                                    </v-tooltip>
                                                    <span v-else>{{ item.step_name }}</span>
                                                </template>
                                                <!-- 第幾天開始執行 -->
                                                <template v-slot:[`item.start_on_which_day`]="{ item }">
                                                    <span v-if="(templatemode=='cycleedit'&&item.type==0)||templatemode!=='cycleedit'">Day {{item.start_on_which_day}}</span>
                                                </template>
                                                <!-- 持續執行至第幾天 -->
                                                <template v-slot:[`item.end_on_which_day`]="{ item }">
                                                    <span v-if="(templatemode=='cycleedit'&&item.type==0)||templatemode!=='cycleedit'">Day {{item.end_on_which_day}}</span>
                                                </template>
                                                <!-- 訊息 -->
                                                <template v-slot:[`item.msg`]="{ item }">
                                                    {{ item.type==0?item.remark:item.msg }}
                                                    <div v-if="item.bacteriaSelect && item.bacteriaSelect.length>0" class="items">
                                                        <v-chip
                                                            v-for="(chip,cid) in item.bacteriaSelect"
                                                            style="font-size: 12px;margin: 2px;color: #fff;"
                                                            color="#408FBC"
                                                            class="main"
                                                            :key="'chip_'+chip+'_'+cid">  
                                                            {{ chip }}
                                                        </v-chip>
                                                    </div>
                                                    
                                                </template>
                                                <!-- 執行/不執行說明 -->
                                                <template v-slot:[`item.executed_actions`]="{ item,index }">
                                                    <div v-if="item.execute"  @click="executeDailogOpen(id,wid,index)">
                                                        <v-btn class="btn-secondary btn-small" :class="{'delete':item.execute==2}">{{ item.execute==3?'尚未完成執行':item.execute==1?'已執行':'異常' }}</v-btn>
                                                    </div>
                                                    <!-- <div v-if="item.dailyCheckList&&item.dailyCheckList.length>0" style="cursor: pointer;" @click="executeDailogOpen(id,wid,index)">
                                                        <div v-for="(exe,eid) in item.dailyCheckList" :key="'executed_'+id+'_'+'_'+wid+'_'+eid" style="display: inline-block;">
                                                            <span :style="{'color':`${exe.execute_status==2?'red':'initial'}`}" style="display: inline-block;border-bottom:1px solid #006AA6">{{ exe.execute_status==1?'已執行':'不執行' }}/</span>
                                                        </div>
                                                    </div> -->
                                                    <div class="btn-groups" v-if="item.type && item.type !== 0 && item.type !== null">
                                                        <v-btn  class="btn-secondary btn-small green"
                                                            @click="if(item.file || item.type == 3){viewOpen=true;viewDetail=item}" 
                                                            :class="{'disabled':item.type !== 3 && !item.file}"
                                                            style="pointer-events: inherit;">
                                                            檢視
                                                        </v-btn>
                                                    </div>
                                                </template>
                                                
                                                <!-- 執行 -->
                                                <template v-slot:[`item.deft_executor`]="{ item }">
                                                    
                                                    <span v-if="item.execute_time&&item.execute_time!==''" v-text="dateFormat(item.execute_time)"></span>
                                                    <!-- <span v-if="item.type==0&&templatemode=='cycleedit'&&item.dailyCheckList&&item.dailyCheckList.length>0" v-text="dateFormat(item.dailyCheckList[0].execute_time)"></span> -->
                                                    <!-- <span v-if="item.type!==3&&item.type!==1&&item.type!==2">{{ item.deft_executor }} </span> -->
                                                    <!-- {{ dateFormat(item.execute_time) }} -->
                                                </template>
                                                <!-- 編輯/刪除 -->
                                                <template v-slot:[`item.udactions`]="{ index }">
                                                    <v-tooltip v-if="templatemode=='cycleedit'" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn  class="btn-icon"
                                                                title="編輯" 
                                                                @click="editsubitem(templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id,wid, index)"
                                                                :class="{'disabled':(work.actionList[index].type==0||work.actionList[index].type==3)}" 
                                                                v-bind="attrs" v-on="on">
                                                                <v-icon>mdi-pencil</v-icon>
                                                            </v-btn>
                                                        </template>
                                                        <!-- <span v-if="(mitem.stepList[index].type==0||mitem.stepList[index].type==3)&&templatemode=='cycleedit'">僅可編輯『其他』、『疾病檢驗』、『水質檢驗』項目</span> -->
                                                        <span>編輯</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn  class="btn-icon delete"
                                                                title="刪除" 
                                                                @click="delsubitem(templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id,wid, index)" 
                                                                v-bind="attrs" v-on="on"
                                                                :class="{'disabled':(work.actionList[index].type==0||work.actionList[index].type==3)}">
                                                                <v-icon>mdi-trash-can</v-icon>
                                                            </v-btn>
                                                        </template>
                                                        <!-- <span v-if="(mitem.stepList[index].type==0||mitem.stepList[index].type==3)&&templatemode=='cycleedit'">僅可刪除『其他』、『疾病檢驗』、『水質檢驗』項目</span> -->
                                                        <span>刪除</span>
                                                    </v-tooltip>
                                                </template>
                                            </v-data-table>
                                            
                                        </div>
                                        
                                        
                                    </div>
                                    
                                    <div v-if="adjustOpen(mitem,id)&&(mitem.stepList==undefined||mitem.stepList.length==0)" class="content no-work">尚未設定工作</div>
                                </v-card>
                                <div v-if="templatemode=='cycleedit' && id == (mainItems.length-1) && !passObj.nowEnd" style="padding: 12px 16px;">
                                    <v-btn class="btn-primary btn-small"  @click="endCycle()" >結束循環</v-btn>
                                    <!-- <v-btn v-if="authorization.verify" class="btn-primary btn-small"  @click="endCycle()" >結束循環</v-btn>
                                    <v-tooltip v-else bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn class="btn-primary btn-small disabled"
                                                v-bind="attrs" v-on="on"
                                                style="pointer-events: initial;"
                                                >
                                                結束循環
                                            </v-btn>
                                        </template>
                                        <span>未授權</span>
                                    </v-tooltip> -->
                                </div>
                            </div>
                        </div>
                    </v-row>
                </div>
            </v-col>
        </v-row>
        <!-- 檢視pdf -->
        <v-dialog v-model="viewOpen" :max-width="`${viewDetail.type==3?'500px':'75%'}`">
            <v-card class="custom-dialog">
                <v-card-title class="add-title" style="display: block;width: 100%;">
                    <div style="display: inline-block;"
                        :style="{'color':`${viewDetail.status&&viewDetail.status=='異常'?'#A60017':viewDetail.status&&viewDetail.status=='警告'?'#f79c2b':'#00324E'}`}">
                        <span v-text="viewDetail.type==1?'疾病報告':viewDetail.type==2?'水質報告':viewDetail.type==3?'事件':''"></span>
                        <span v-if="viewDetail.status"> - {{ viewDetail.status }}</span>
                    </div>
                    <div class="add" style="float: right;display: inline-block;">
                        <!-- <v-btn  class="btn-primary"
                                title="下載" 
                                @click="viewOpen = false" 
                                style="border: none;min-width: 0;padding: 0 4px;">
                            <v-icon>mdi-tray-arrow-down</v-icon>
                        </v-btn> -->
                        <v-btn  class="btn-secondary close"
                                title="取消" 
                                @click="viewOpen = false" 
                                style="border: none;min-width: 0;padding: 0 4px;">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <div class="basic" v-if="viewDetail.type && viewDetail.type!==3" style="padding-bottom: 24px;">
                    <!-- <div class="card-title" style="margin-bottom: 0;">
                        <div class="title">
                            <v-card-title>基本資訊</v-card-title>
                        </div>
                    </div> -->
                    <v-card-text>
                        <div class="content">
                            <!-- 檢疫時間： {{ viewDetail.execute_date }}<br> -->
                            <!-- 檢疫狀況：{{ viewDetail.status }}<br> -->
                            <!-- <span v-if="viewDetail.type==1">感染疾病：{{ viewDetail.bacteriaSelect.toString() }}<br></span> -->
                            訊息：{{ viewDetail.msg }}
                        </div>
                        
                    </v-card-text>
                    <v-card-text>
                        <!-- <embed :src="viewDetail.file" style="overflow:scroll;height:500px;width:100%;max-width:500px"> -->
                        <v-responsive>
                            <iframe :src="viewDetail.file" style="overflow:hidden;height:600px;width:100%;" ></iframe>
                        </v-responsive>
                    </v-card-text>
                </div>
                <div class="basic" v-else>
                    <div class="card-title">
                        <div class="title">
                            <v-card-title>{{ viewDetail.msg }}</v-card-title>
                        </div>
                    </div>
                    <v-card-text>
                        <div class="content" style="margin-bottom: 40px;">
                            事件起訖： {{ viewDetail.started_date }} ~ {{ viewDetail.ended_date }} <br>
                            創建人員： {{ viewDetail.created_user }} <br>
                            事件等級：{{ viewDetail.event_level_name }}<br>
                            事件內容：{{ viewDetail.content }}
                        </div>
                    </v-card-text>
                </div>
            </v-card>
        </v-dialog>
        <!-- 編輯工作項目 -->
        <v-dialog v-model="editWorkDialog" max-width="500px">
            <v-form v-model="editWorkvalid" ref="editWorkform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title" style="display: block;width: 100%;">
                        <div style="display: inline-block;">
                            <span>編輯：{{ editItem.step_name }}</span> 
                        </div>
                        <div class="add" style="float: right;display: inline-block;">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="editWorkDialog = false" 
                                    style="border: none;min-width: 0;padding: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <div class="card-title" style="margin-bottom: 0;">
                            <div class="title">
                                <v-card-title>備註說明</v-card-title>
                            </div>
                        </div>
                        <v-card-text style="display: flex;align-items: center;padding-top: 0;">
                            <v-text-field v-model="editItem.remark" label="備註" autocomplete="off" style="margin-right: 4px;padding-top: 0;margin-top: 4px;">
                            </v-text-field>
                        </v-card-text>
                        <div class="card-title" style="margin-bottom: 8px;border-bottom: 1px solid rgba(0,0,0,0.1)">
                            <div class="title">
                                <v-card-title>預設動作</v-card-title>
                            </div>
                            <div class="chevron">
                                <v-btn class="btn-icon green" @click="editActionItemDialogOpen()"><v-icon>mdi-plus</v-icon></v-btn>
                                <!-- <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <button class="btn-icon" v-bind="attrs" v-on="on">
                                            <v-icon>mdi-plus</v-icon>
                                        </button>
                                    </template>
                                    <span>新增動作</span>
                                </v-tooltip> -->
                            </div>
                        </div>
                        <div class="content" style="max-height:30vh; overflow-y: scroll;">
                            <v-card-text v-if="editItem.actionList&&editItem.actionList.length>0">
                                <span class="error-text">*說明：工作({{editItem.step_name}})開始後第「{{editItem.actionList[0].start_on_which_day}}」天開始執行動作({{editItem.actionList[0].action_name}})，持續執行到第「{{editItem.actionList[0].end_on_which_day}}」天</span>
                            </v-card-text>
                            <v-card-text v-for="(item,id) in editItem.actionList" :key="'editAction_'+item.action_id+'_'+id" class="work-item" style="padding-top: 0;" >
                                <v-row style="display: flex;align-items: center;padding-top: 0;">
                                    <v-col cols="3" style="padding: 4px 8px;">{{ item.action_name }}</v-col>
                                    <v-col cols="4" style="padding: 4px 8px;">
                                        <v-text-field v-model="item.start_on_which_day" type="number" :rules="rules.require" label="第幾天開始執行" @change="detectEndDay(id)" autocomplete="off" style="margin-right: 4px;padding-top: 0;">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="4" style="padding: 4px 8px;">
                                        <v-text-field v-model="item.end_on_which_day" type="number" @change="sortDay" :rules="rules.require" label="持續執行至第幾天" autocomplete="off" style="margin-right: 4px;padding-top: 0;">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="1" style="padding: 0;"><v-btn class="btn-icon delete" @click="removeAction(item.action_id,id)"><v-icon>mdi-trash-can</v-icon></v-btn></v-col>
                                </v-row>
                                <!-- 財務 -->
                                <!-- <v-row style="display: flex;align-items: center;padding-top: 0;margin-bottom: 8px;">
                                    <v-col cols="12" style="padding: 4px 8px;">
                                        {{ item.step_name }}
                                    </v-col>
                                    <div style="padding: 4px 8px;width: calc(30% - 32px )">
                                        <v-text-field v-model="item.start" type="number" :rules="rules.require" label="第幾天開始執行" @change="detectEndDay(id)" autocomplete="off" style="margin-right: 4px;padding-top: 0;margin-top: 0;">
                                        </v-text-field>
                                    </div>
                                    <div style="padding: 4px 8px;width: calc(30% - 32px )">
                                        <v-text-field v-model="item.end" type="number" @change="sortDay" :rules="rules.require" label="持續執行至第幾天" autocomplete="off" style="margin-right: 4px;padding-top: 0;margin-top: 0;">
                                        </v-text-field>
                                    </div>
                                    <div style="padding: 4px 8px;width: calc(30% - 32px )">
                                        <v-text-field type="number" v-model.number="item.estimated_member" min="0" filled dense  label="預估人力" style="margin-right: 4px;margin-top: 0;"><span class="pa-0 ma-0" slot="append">人</span></v-text-field>
                                    </div>
                                    <div style="padding: 4px 8px;width: calc(30% - 32px )">
                                        <v-text-field type="number" v-model.number="item.estimated_spend" filled dense  label="預估金額" style="margin-right: 4px;margin-top: 0;"><span class="pa-0 ma-0" slot="prepend">$</span></v-text-field>
                                    </div>
                                    <div style="padding: 0;"><v-btn class="btn-icon delete" @click="removeAction(item.step_id)"><v-icon>mdi-trash-can</v-icon></v-btn></div>
                                </v-row> -->
                            </v-card-text>
                        </div>
                        
                    </div>
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <!-- <v-btn class="btn-secondary" @click="editWorkDialog=false">取消</v-btn> -->
                        <v-btn class="btn-primary" @click="editWorkSubmit">確認</v-btn>
                        <v-btn class="btn-primary delete" @click="deleteWork">移除項目</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 調整動作項目增刪修 -->
        <v-dialog v-model="editActionItemDialog" max-width="500px">
            <v-form v-model="editActionItemvalid" ref="editActionItemform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title" style="display: block;width: 100%;">
                        <div style="display: inline-block;">
                            <span>加入動作</span> 
                        </div>
                        <div class="add" style="float: right;display: inline-block;">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="editActionItemDialog = false" 
                                    style="border: none;min-width: 0;padding: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <v-card-text style="display: flex;align-items: center;">
                            <v-autocomplete v-model="stepitem.id" dense filled :items="stepdata" item-text="name_ch"
                                    item-value="id" @change="actionChange"></v-autocomplete>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn slot="append-outer" class="btn-icon" @click="showstep('edit')" v-bind="attrs" v-on="on"><v-icon>mdi-pencil-outline</v-icon></v-btn>
                                </template>
                                <span>編輯動作</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn slot="append-outer" class="btn-icon green" @click="showstep('add')" v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
                                </template>
                                <span>新增動作</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn slot="append-outer" :class="{'disabled':(stepitem.id==undefined)}" class="btn-icon delete" @click="deletestep" v-bind="attrs" v-on="on"><v-icon>mdi-trash-can</v-icon></v-btn>
                                </template>
                                <span>刪除動作</span>
                            </v-tooltip>
                        </v-card-text>
                        <div v-if="stepmode!==''" class="card-title" style="margin-bottom: 0;">
                            <div class="title">
                                <v-card-title>{{stepmode=='edit'?'編輯動作':'新增動作'}}</v-card-title>
                            </div>
                        </div>
                        <v-card-text v-if="actionInputShow">
                            <v-text-field v-model="stepformedit.name_ch" @change="checkValue('name_ch')" filled dense :rules="rules.require" label="動作名稱(中)" clearable style="padding-top: 12px;"></v-text-field>
                            <v-text-field v-model="stepformedit.name_en" @change="checkValue('name_en')" filled dense :rules="rules.require" label="動作名稱(英)" clearable style="padding-top: 12px;"></v-text-field>
                        </v-card-text>
                        <v-card-text style="padding-top: 0;">
                            <v-text-field v-model="stepformedit.remark" :disabled="stepmode==''" @change="checkValue('remark')" filled dense  label="備註" clearable style="padding-top: 12px;"></v-text-field>
                        </v-card-text>
                        
                    </div>
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="editActionItemDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" @click="editActionItemSubmit">新增</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 新增工作項目 -->
        <v-dialog v-model="addWorkDialog" max-width="500px">
            <v-form v-model="addWorkvalid" ref="addWorkform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title" style="display: block;width: 100%;">
                        <div style="display: inline-block;">
                            <span>加入工作</span> 
                        </div>
                        <div class="add" style="float: right;display: inline-block;">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="addWorkDialog = false" 
                                    style="border: none;min-width: 0;padding: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <div class="card-title" style="margin-bottom: 0;">
                            <v-autocomplete v-model="editItem.step_id" dense filled :rules="rules.require" :items="addWorkList" item-text="name_ch"
                                    item-value="id" @change="addWorkItemChange"></v-autocomplete>
                            <div class="chevron" v-if="templatemode!=='cycleedit'">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn slot="append-outer" class="btn-icon green" @click="addWorkActionDialogOpen" v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
                                    </template>
                                    <span>新增</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn slot="append-outer" :class="{'disabled':(editItem.step_id==undefined)}" class="btn-icon delete" @click="deleteWorkItem" v-bind="attrs" v-on="on"><v-icon>mdi-trash-can</v-icon></v-btn>
                                    </template>
                                    <span>永久刪除</span>
                                </v-tooltip>
                            </div>
                        </div>
                        
                        <div class="card-title" style="margin-bottom: 0;">
                            <div class="title">
                                <v-card-title>工作說明</v-card-title>
                            </div>
                        </div>
                        <v-card-text style="display: flex;align-items: center;padding-top: 0;">
                            <v-text-field v-model="editItem.remark" disabled autocomplete="off" style="margin-right: 4px;padding-top: 0;margin-top: 4px;">
                            </v-text-field>
                        </v-card-text>
                        <div class="card-title" style="margin-bottom: 8px;border-bottom: 1px solid rgba(0,0,0,0.1)">
                            <div class="title">
                                <v-card-title>預設動作</v-card-title>
                            </div>
                        </div>
                        <div class="content" v-if="editItem.actionList&&editItem.actionList.length>0" style="max-height: 30vh;overflow-y: scroll;">
                            <v-card-text v-for="item in editItem.actionList" :key="'addAction_'+templatemode=='cycleedit'?item.id:item.action_id+'_'+Math.floor(Math.random()*999)+100" style="display: flex;align-items: center;padding-top: 0;" >
                                <v-row style="display: flex;align-items: center;padding-top: 0;">
                                    <v-col cols="6">{{ item.action_name }}</v-col>
                                    <v-col cols="6">Day {{ item.start_on_which_day }} ~ Day {{ item.end_on_which_day }}</v-col>
                                    <!-- 財務 -->
                                    <!-- <v-col cols="3">預估花費 {{item.estimated_member}} 人</v-col>
                                    <v-col cols="3">預估花費 $ {{item.estimated_member}} </v-col> -->
                                </v-row>
                            </v-card-text>
                        </div>
                        <div class="content" v-else>
                            <v-card-text>
                                未設定預設動作，請新增工作後，點選編輯進行動作設定
                            </v-card-text>
                        </div>
                        
                    </div>
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <!-- <v-btn class="btn-secondary" @click="editWorkDialog=false">取消</v-btn> -->
                        <v-btn class="btn-secondary" @click="addWorkDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" @click="addWorkSubmit">加入</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 新增未曾新增的工作 -->
        <v-dialog v-model="addWorkActionDialog" max-width="500px">
            <v-form v-model="addWorkActionvalid" ref="addWorkActionform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title" style="display: block;width: 100%;">
                        <div style="display: inline-block;">
                            <span>新增工作</span> 
                        </div>
                        <div class="add" style="float: right;display: inline-block;">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="addWorkActionDialog = false" 
                                    style="border: none;min-width: 0;padding: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <!-- <div class="card-title" style="margin-bottom: 0;">
                            <div class="title">
                                <v-card-title>工作名稱</v-card-title>
                            </div>
                        </div>
                        <v-card-text style="display: flex;align-items: center;padding-top: 0;">
                            <v-text-field v-model="addItem.step_name" label="名稱" autocomplete="off" :rules="rules.require" style="margin-right: 4px;padding-top: 0;margin-top: 4px;">
                            </v-text-field>
                        </v-card-text> -->
                        <v-card-text>
                            <v-text-field v-model="addItem.name_ch" filled dense :rules="rules.require" label="工作名稱(中)" clearable style="padding-top: 12px;"></v-text-field>
                            <v-text-field v-model="addItem.name_en" filled dense :rules="rules.require" label="工作名稱(英)" clearable style="padding-top: 12px;"></v-text-field>
                        </v-card-text>
                        <v-card-text style="padding-top: 0;">
                            <v-text-field v-model="addItem.remark" filled dense  label="備註" clearable style="padding-top: 12px;"></v-text-field>
                        </v-card-text>
                        <div class="card-title" style="margin-bottom: 8px;border-bottom: 1px solid rgba(0,0,0,0.1)">
                            <div class="title">
                                <v-card-title>預設動作</v-card-title>
                            </div>
                            <div class="chevron">
                                <v-btn class="btn-icon green" @click="editActionItemDialogOpen()"><v-icon>mdi-plus</v-icon></v-btn>
                                <!-- <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <button class="btn-icon" v-bind="attrs" v-on="on">
                                            <v-icon>mdi-plus</v-icon>
                                        </button>
                                    </template>
                                    <span>新增動作</span>
                                </v-tooltip> -->
                            </div>
                        </div>
                        <div class="content"  style="max-height:30vh; overflow-y: scroll;">
                            <v-card-text v-if="addItem.actionList&&addItem.actionList.length>0">
                                <span class="error-text">*說明：工作({{addItem.name_ch}})開始後第「{{addItem.actionList[0].start_on_which_day}}」天開始執行動作({{addItem.actionList[0].action_name}})，持續執行到第「{{addItem.actionList[0].end_on_which_day}}」天</span>
                            </v-card-text>
                            <v-card-text v-for="(item,id) in addItem.actionList"  class="work-item" :key="'addWorkAction_'+item.action_id" style="display: flex;align-items: center;padding-top: 0;" >
                                <v-row style="display: flex;align-items: center;padding-top: 0;">
                                    <v-col cols="3" style="padding: 4px 8px;">{{ item.action_name }}</v-col>
                                    <v-col cols="4" style="padding: 4px 8px;">
                                        <v-text-field v-model="item.start_on_which_day" type="number" :rules="rules.require" label="第幾天開始執行" @change="detectEndDay(id)" autocomplete="off" style="margin-right: 4px;padding-top: 0;">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="4" style="padding: 4px 8px;">
                                        <v-text-field v-model="item.end_on_which_day" type="number" @change="sortDay" :rules="rules.require" label="持續執行至第幾天" autocomplete="off" style="margin-right: 4px;padding-top: 0;">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="1" style="padding: 0;"><v-btn class="btn-icon delete" @click="removeAction(item.action_id,id)"><v-icon>mdi-trash-can</v-icon></v-btn></v-col>
                                </v-row>
                                <!-- 財務 -->
                                <!-- <v-row style="display: flex;align-items: center;padding-top: 0;margin-bottom: 8px;">
                                    <v-col cols="12" style="padding: 4px 8px;">
                                        {{ item.step_name }}
                                    </v-col>
                                    <div style="padding: 4px 8px;width: calc(30% - 32px )">
                                        <v-text-field v-model="item.start" type="number" :rules="rules.require" label="第幾天開始執行" @change="detectEndDay(id)" autocomplete="off" style="margin-right: 4px;padding-top: 0;margin-top: 0;">
                                        </v-text-field>
                                    </div>
                                    <div style="padding: 4px 8px;width: calc(30% - 32px )">
                                        <v-text-field v-model="item.end" type="number" @change="sortDay" :rules="rules.require" label="持續執行至第幾天" autocomplete="off" style="margin-right: 4px;padding-top: 0;margin-top: 0;">
                                        </v-text-field>
                                    </div>
                                    <div style="padding: 4px 8px;width: calc(30% - 32px )">
                                        <v-text-field type="number" v-model.number="item.estimated_member" filled dense  label="預估人力" style="margin-right: 4px;margin-top: 0;"><span class="pa-0 ma-0" slot="append">人</span></v-text-field>
                                    </div>
                                    <div style="padding: 4px 8px;width: calc(30% - 32px )">
                                        <v-text-field type="number" v-model.number="item.estimated_spend" filled dense  label="預估金額" style="margin-right: 4px;margin-top: 0;"><span class="pa-0 ma-0" slot="prepend">$</span></v-text-field>
                                    </div>
                                    <div style="padding: 0;"><v-btn class="btn-icon delete" @click="removeAction(item.step_id)"><v-icon>mdi-trash-can</v-icon></v-btn></div>
                                </v-row> -->
                            </v-card-text>
                        </div>
                    </div>
                    <v-card-actions style="padding: 24px 12px;">
                        <v-spacer></v-spacer>
                        <!-- <v-btn class="btn-secondary" @click="editWorkDialog=false">取消</v-btn> -->
                        <v-btn class="btn-secondary" @click="addWorkActionDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" @click="addWorkActionSubmit">新增</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 執行狀態 -->
        <v-dialog v-model="executeDialog" max-width="500px">
            <v-card class="custom-dialog">
                <v-card-title class="add-title" style="display: block;width: 100%;">
                    <div style="display: inline-block;">
                        <span>{{executeList.action_name}}</span>
                    </div>
                    <div class="add" style="float: right;display: inline-block;">
                        <v-btn  class="btn-secondary close"
                                title="取消" 
                                @click="executeDialog = false" 
                                style="border: none;min-width: 0;padding: 0 4px;">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <div class="basic" style="padding-bottom: 48px;">
                    <!-- <div class="card-title" style="margin-bottom: 0;">
                        <div class="title">
                            <v-card-title>執行狀態</v-card-title>
                        </div>
                    </div> -->
                    <v-card-text>
                        <v-row style="border-bottom: 1px solid rgba(0,0,0,0.1);width: 100%;">
                            <v-col cols="3"><span style="font-weight:bold">時間</span></v-col>
                            <v-col cols="2"><span style="font-weight:bold">狀態</span></v-col>
                            <v-col cols="3"><span style="font-weight:bold">說明</span></v-col>
                            <v-col cols="4"><span style="font-weight:bold">人員</span></v-col>
                        </v-row>
                        <v-row class="content" v-for="(daily,did) in executeList.dailyCheckList" :key="'daily_'+did" style="border-bottom: 1px solid rgba(0,0,0,0.1);width: 100%;">
                            <v-col cols="3"><span>{{daily.execute_time}}</span></v-col>
                            <v-col cols="2"><span :style="{'color':`${daily.execute_status==2?'red':'initial'}`}">{{ daily.execute_status==1?'已執行':'不執行' }}</span></v-col>
                            <v-col cols="3"><span>{{daily.msg}}</span></v-col>
                            <v-col cols="4"><span>{{daily.executor}}</span></v-col>
                        </v-row>
                        
                    </v-card-text>
                </div>
            </v-card>
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
                    ],
                    nowEnd: false,
                    nowId: 0,
                    filter: [1,2,3],
                    authorization: {
                        execute: false,
                        verify: false
                    }
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
        },
        diseaseReport:{
            type: Array,
            default: []
        },
        waterReport:{
            type: Array,
            default: []
        },
        eventReport:{
            type: Array,
            default: []
        },
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
                    id: 1,
                    order: 1,
                    color: 'purple darken-1',
                    icon: 'mdi-book-variant',
                    text: '養殖審核'
                },
                {
                    id: 2,
                    order: 2,
                    color: 'green lighten-1',
                    icon: 'mdi-airballoon',
                    text: '備池'
                },
                {
                    id: 3,
                    order: 3,
                    color: 'indigo',
                    icon: 'mdi-gate-buffer',
                    text: '蓄水'
                },
                {
                    id: 4,
                    order: 4,
                    color: 'indigo',
                    icon: 'mdi-buffer',
                    text: '做水'
                },
                {
                    id: 5,
                    order: 5,
                    color: 'red lighten-2',
                    icon: 'mdi-buffer',
                    text: '放養中'
                },
                {
                    id: 6,
                    order: 6,
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
                // { text: '新增', value: 'actions', sortable: false,width:"5%",showmode: ['cycleedit']},
                // { text: "step_id", value: "step_id", groupable: false, showmode: ['add', 'edit'] },
                // { text: "sort", value: "sort", groupable: false, showmode: ['add', 'edit'] },
                { text: "動作", value: "action_name", groupable: false, sortable: false,width:"15%",showmode: ['cycleedit']},
                { text: "動作", value: "action_name", groupable: false, sortable: false,width:"15%",showmode: ['add', 'edit']},
                { text: "總執行天數", value: "total_day", groupable: false, sortable: false,width:"10%",showmode: ['cycleedit']},
                { text: "第幾天開始執行", value: "start_on_which_day", groupable: false, sortable: false,width:"10%",showmode: ['add', 'edit']},
                { text: "持續執行至第幾天", value: "end_on_which_day", groupable: false, sortable: false,width:"10%",showmode: ['add', 'edit']},
                // { text: "執行/確認人員", value: "step_exec", groupable: false, showmode: ['edit2'] },
                { text: "訊息", value: "msg", groupable: false, sortable: false,width:"20%",showmode: ['cycleedit']},
                // { text: "執行時間", value: "execute_time", groupable: false, sortable: false,width:"20%",showmode: ['cycleedit']},
                // { text: "執行", value: "executed_actions", groupable: false, sortable: false,width:"20%",showmode: ['cycleedit']},
                { text: "執行狀態", value: "executed_actions", groupable: false, sortable: false,width:"20%",showmode: ['cycleedit']},
                { text: '執行時間', value: 'deft_executor', sortable: false,width:"15%",showmode: ['cycleedit']},
                // { text: '執行時間/人員', value: 'deft_executor', sortable: false,width:"15%",showmode: ['cycleedit']},
                // 財務
                // { text: "預估花費人力", value: "estimated_member", groupable: false, sortable: false,width:"5%",showmode: ['add', 'edit','cycleedit']},
                // { text: "預估花費金額", value: "estimated_spend", groupable: false, sortable: false,width:"5%",showmode: ['add', 'edit','cycleedit']},
                // { text: "實際花費人力", value: "actual_member", groupable: false, sortable: false,width:"5%",showmode: ['cycleedit']},
                // { text: "實際花費金額", value: "actual_spend", groupable: false, sortable: false,width:"5%",showmode: ['cycleedit']},
                // { text: '確認員', value: 'deft_verifier', sortable: false,width:"15%",showmode: ['cycleedit']},
                // { text: '編輯', value: 'reactions', sortable: false,width:"7%",showmode: ['cycleedit']},
                { text: '備註', value: 'remark', sortable: false,width:"20%",showmode: ['add', 'edit']},
                { text: '操作', value: 'udactions', sortable: false,width:"10%",showmode: ['cycleedit']},
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
                // {color:'#B1DBF0',open:true,id:1,name:'空池'},
                {color:'#DD97A4',open:true,id:2,name:'養殖審核'},{color:'#92CDEE',open:true,id:3,name:'備池'},{color:'#DBC5A4',open:true,id:4,name:'蓄水'},{color:'#C5E8E6',open:true,id:5,name:'做水'},{color:'#ECE499',open:true,id:7,name:'放養中'},{color:'#8BE3D3',open:true,id:8,name:'清池'}],
            // 新增其他
            addStep:[{msg:''}],
            rules: {
                require: [v => !!v || "*必要項目"],
                requireStepEn: [v => !!v || "*必要項目",v => v !=='others' || "*Cannot Enter ' Others '"],
                requireStepCn: [v => !!v || "*必要項目",v => v!=='其他' || "*不可輸入'其他'"],
                checklength:[v => v==null?'':v.length<=100 ||  "*不可輸入超過100字元"]
            },
            addvalid: false,
            isEdit: false,// 插入項目是否修改
            otherApi:0,
            stepdataAll:[],
            justStep:[],
            viewOpen: false,
            viewDetail:{},
            editem: false,
            editvalid:false,
            authorization: {
                execute: false,
                verify: false
            },
            editWorkDialog:false, // 編輯工作
            editWorkvalid:false,
            editActionItemDialog:false,// 動作
            editActionItemvalid:false,
            addWorkDialog: false, // 新增工作
            addWorkvalid:false,
            addWorkActionDialog: false, // 新增未有的工作
            addWorkActionvalid:false,
            editItem:{}, // 編輯工作資料暫存
            addWorkList:[], // 所有的工作清單
            addItem:{}, // 新增工作資料暫存
            workType: 'edit', // 區別現在是在編輯還是新增，動作編輯用
            addWorkIndex:{}, // 新增工作從哪一index往下新增
            actionInputShow: false, // 編輯/新增動作 顯示欄位
            workOpenStatus:[], // 養殖循環工作收合紀錄
            dateList:[], // 額外儲存所有水質/疾病/事件順序資料，避免filter更動時階段時間跟著變動
            executeDialog: false, // 養殖循環執行狀態
            executeList:[],
            nowStepId:null,
            dailyList:[]
        }
    },
    async created(){
        console.log("created");
        if(this.templatemode=="cycleedit"){
            // this.tempMain = this.passObj.tempMain;
            // this.mainItems = this.passObj.tempContent;

            // this.tempMain = _.cloneDeep(this.passObj.tempMain);
            this.mainItems = _.cloneDeep(this.passObj.tempContent);
            this.mainItems.forEach(m=>m.open=this.nowExpand);
            this.mainItems.forEach((mitem,mid)=>{
                this.workOpenStatus.push({
                    phase_id:mitem.phase_original_id,
                    open: new Array()
                })
                if(mitem.stepList&&mitem.stepList.length>0) {
                    mitem.stepList.forEach(step=>{
                        this.workOpenStatus[mid].open.push(step.open);
                    })
                }else {
                    mitem.stepList=new Array();
                    mitem.stepList.push({actionList:new Array()});
                }
            })
            let param={pond_id:this.passObj.poolid}
            let getDailyCheckList = await this.getDailyCheckList(param);
            let data = typeof (getDailyCheckList)=='string'?[]:getDailyCheckList;
            if(data.step_id) {
                this.nowStepId = data.step_id;
                this.dailyList = data;
            }
            this.authorization = _.cloneDeep(this.passObj.authorization);
            // console.log('mainItems',this.mainItems);
            // this.getAuth();
            // if(this.templatemode == 'cycleedit') {
            this.sortData();
            // };
        }else {
            // 因為抓取出來的資料stepList為空的不會儲存，因此得額外比對整體流程，並塞進stepList，這樣模板上才可以新增其他流程
            this.mainItems = [];
            this.items.forEach(data=>{
                this.mainItems.push({
                    phase_id: data.id,
                    phase_name: data.text,
                    stepList: new Array(),
                    open: this.nowExpand,
                    day: 0
                })
            })
            if(this.templatemode=="edit"){
                this.tempMain = _.cloneDeep(this.passObj.tempMain);
                let main = _.cloneDeep(this.passObj.tempContent);
                this.mainItems.forEach((data,id)=>{
                    main.forEach(m=>{
                        if(data.phase_id == m.phase_id) {
                            data.stepList = m.stepList;
                            data.stepList.forEach(step=>{
                                if(step.actionList&&step.actionList.length>0) {
                                    let max = 1;
                                    step.actionList.forEach(action=>{
                                        if(action.end_on_which_day>max) {
                                            max=action.end_on_which_day;
                                        }
                                    })
                                    data.day+=max-step.actionList[0].start_on_which_day+1;
                                    // data.day+=step.actionList[step.actionList.length-1].end_on_which_day-step.actionList[0].start_on_which_day+1;
                                }
                                
                            })
                        }
                    })
                })
                // console.log(this.passObj.tempMain,this.mainItems);
                // tempMain :  this.tempMain,
                //        tempContent: this.mainItems
            }else if(this.templatemode=="add"){
                // this.tempMain = _.cloneDeep(this.passObj.tempMain);
                let main = _.cloneDeep(this.passObj.tempContent);
                this.mainItems.forEach((data,id)=>{
                    main.forEach(m=>{
                        if(data.phase_id == m.phase_id) {
                            data.stepList = m.stepList;
                            data.stepList.forEach(step=>{
                                if(step.actionList&&step.actionList.length>0) {
                                    let max = 1;
                                    step.actionList.forEach(action=>{
                                        if(action.end_on_which_day>max) {
                                            max=action.end_on_which_day;
                                        }
                                    })
                                    data.day+=max-step.actionList[0].start_on_which_day+1;
                                    // data.day+=step.actionList[step.actionList.length-1].end_on_which_day-step.actionList[0].start_on_which_day+1;
                                }
                                
                            })
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
        //  判斷養殖循環工作是否disabled新增/刪除(disabled true/false)
        judgeWork(phase_id,wid,type) {
            let disabled = false;
            // 已結束循環，不可新增/刪除
            if(this.passObj.nowEnd) {
                disabled = true;
            }else {
                let item = {phase_id:null,id:null};
                this.mainItems.forEach(mitem=>{
                    mitem.stepList.forEach((step,sid)=>{
                        if(step.id==this.nowStepId) {
                            item.phase_id = this.templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id;
                            item.id = sid;
                        }
                    })
                })
                this.mainItems.forEach((mitem,mid)=>{
                    if((this.templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id)==phase_id) {
                        // 如果下一階段已經開始執行，此階段均不可新增/刪除
                        if(this.mainItems[mid+1]&&this.mainItems[mid+1].newest!=='') {
                            disabled = true;
                        }else {
                            mitem.stepList.forEach(async (step,sid)=>{
                                if(wid==sid) {
                                    // 如下一工作已開始執行，此工作不可新增/刪除
                                    if(mitem.stepList[sid+1]&&mitem.stepList[sid+1].actionList[0].execute_time&&mitem.stepList[sid+1].actionList[0].execute_time!=='') {
                                        disabled = true;
                                    }else {
                                        // 判斷是否為現在生成的dailycheck之前的工作，不可新增/刪除
                                        if((this.templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id)==item.phase_id) {
                                            if(sid<item.id) {
                                                disabled=true;
                                            }
                                        }
                                        // 現在生成的dailycheck階段，不可刪除，可新增
                                        if(step.id == this.nowStepId) {
                                            if(type=='delete') {
                                                disabled = true;
                                            }
                                        }else {
                                            // 非現在生成的dailycheck階段，如果已完成執行，但後續均沒有工作了，不可刪除，不可新增
                                            if(step.actionList&&step.actionList.length>0) {
                                                let num1 = 0;
                                                let num2 = 0;
                                                let num3 = 0;
                                                step.actionList.forEach(action=>{
                                                    if(action.execute==1) {
                                                        num1++;
                                                    }else if(action.execute==2) {
                                                        num2++;
                                                    }else if(action.execute==3) {
                                                        num3++;
                                                    }
                                                })
                                                if(num3>0) {
                                                    if(type=='delete') {
                                                        disabled=true;
                                                    }
                                                }
                                                if((num1+num2)==step.actionList.length) {
                                                    disabled=true;
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    }
                    
                })
            }
            
            return disabled;
        },
        // 判斷階段上的新增是否要顯示(v-if true/false)
        judgePhase(id) {
            if(this.mainItems[id].stepList==undefined||this.mainItems[id].stepList.length==0) {
                // 樣板設定只要階段下無工作都要顯示可以新增
                if(this.templatemode!=='cycleedit') {
                    return true
                }else {
                    // 已結束循環 不顯示
                    if(this.passObj.nowEnd) {
                        return false;
                    }else {
                        // 後面階段已開始執行 不顯示，因會影響dailycheck的排程
                        if(this.mainItems[id+1]&&this.mainItems[id+1].newest!=='') {
                            return false;
                        }else {
                            let index = 0;
                            this.mainItems.forEach((mitem,mid)=>{
                                if(this.nowStepId!==null) {
                                    mitem.stepList.forEach((step,sid)=>{
                                        if(step.id==this.nowStepId) {
                                            index = mid;
                                            
                                        }
                                    })
                                }else {
                                    if(mitem.newest!=='') {
                                        index = mid;
                                    }
                                } 
                                
                            })
                            if(id<index) {
                                return false;
                            }else {
                                return true;
                            }
                        }
                    }
                    
                }
            }else{
                // if(id==this.mainItems.length-1&&this.nowStepId==null) {
                //     return true;
                // }else {
                //     return false;
                // }
                return false;
            }
            
        },
        /* 計算天數 */
        // 養殖循環計算天數
        computedDay(item) {
            if(this.templatemode!=='cycleedit') {
                let min = 1;
                let max = 1;
                if(item.actionList) {
                    // 以最大天數算，因如工作下只有一個動作且為day2~day2 用最後日-開始日+1 為1天，但實際上此工作為開始後第二天執行，代表此工作還是要持續2天
                    // 因此不可使用最後日-開始日+1，整體來說，開始日應永遠為1
                    item.actionList.forEach(action=>{
                            if(action.end_on_which_day>max) {
                                max = action.end_on_which_day;
                            }
                    })
                }
                
                return (max - min)+1;
            }else {
                // 因養殖循環會受dailycheck的延遲和複製影響，開始與結束日後端不變，但tatol_day互相相加也非正確天數，因此，需做額外判斷
                if(item.actionList&&item.actionList.length>0) {
                    let dateList = [];
                    // 判斷是否為現在當前dailycheck生成的工作，因dailyCheckList在還未執行動作下並未先生成，且此時可能已有延遲/複製產生
                    // 所以必須要將dailycheck目前工作撈取出來算生成天數
                    if(this.nowStepId==item.id) {
                        // 依據dailycheck展開的天數算
                        this.dailyList.daily.forEach(x=>{
                            if(!dateList.includes(x.scheduling_date)) {
                                dateList.push(x.scheduling_date)
                            }
                        })
                        return dateList.length;
                    }else {
                        // 非目前dailycheck生成的工作，判斷是否已有dailyCheckList，有代表已經完成執行的工作
                        if(item.actionList[0].dailyCheckList&&item.actionList[0].dailyCheckList.length>0) {
                            item.actionList.forEach(action=>{
                                action.dailyCheckList.forEach(d=>{
                                    if(!dateList.includes(d.scheduling_date)) {
                                        dateList.push(d.scheduling_date)
                                    }
                                })
                            })
                            return dateList.length;
                        }else {
                            // 無dailyCheckList代表為非執行的工作，因為還未有延遲/複製的動作，可依據最大天數算
                            let min = 1;
                            let max = 1;
                            item.actionList.forEach(action=>{
                                // if(action.dailyCheckList) {
                                    if(action.end_on_which_day>max) {
                                        max = action.end_on_which_day;
                                    }
                            })
                            return (max - min)+1;
                        }
                        
                    }
                }else {
                    return 0;
                }
            }
            
        },
        // 養殖循環計算階段天數
        computedTotalDay(mitem) {
            let num=0;
            mitem.stepList.forEach(step=>{
                num+=this.computedDay(step);
            })
            return num;
        },
        /* 資料整理 */
        // 排序執行時間
        sortData() {
            // let stepId = [];
            let data = _.cloneDeep(this.passObj.tempContent);
            this.mainItems = [];
            // data.forEach(d=>{
            //     d.stepList.forEach(step=>{
            //         step.actions = step.actions.filter(x=>x.type==0 || x.type==null);
            //     })
                
            // })
            data.forEach((d,id)=>{
                d.stepList.forEach((step,sid)=>{
                    // console.log(this.workOpenStatus[id].open[sid])
                    step.open = this.workOpenStatus[id].open[sid];
                    if(step.actionList&&step.actionList.length>0) {
                        let dateData=[];
                        let nodate=[];
                        step.actionList.forEach(action=>{
                            if(action.execute_time&&action.execute_time!=='') {
                                dateData.push(action);
                            }else {
                                nodate.push(action);
                            }
                        })
                        dateData.sort((a,b)=>{
                            return new Date(a.execute_time).getTime() - new Date(b.execute_time).getTime();
                        })
                        step.actionList=[];
                        step.actionList = [...dateData,...nodate];
                    }
                    
                })
            })
            // data.forEach((m,mid)=>{
            //     stepId.push({
            //         "phase_id": m.phase_id,
            //         "phase_name_ch": m.phase_name_ch,
            //         "open": m.open,
            //         "color": m.color,
            //         "newest": m.newest,
            //         "stepList": m.stepList,
            //     })
                
            //     // // 項目排序
            //     // stepId[mid].stepList.sort((a,b)=>{
            //     //     return parseInt(a.seq_id.split('_')[1]) - parseInt(b.seq_id.split('_')[1]);
            //     // })
                
            // })
            // this.mainItems = stepId;
            this.justStep = data;
            // this.disabledData();
            // this.dateData();
            this.sortTime();
        },
        // 排序與篩選顯示疾病/水質/事件
        sortTime(filter=false) {
            let data = _.cloneDeep(this.justStep); // 顯示篩選後的資料
            this.dateList = _.cloneDeep(this.justStep); // 額外儲存所有的，因為時間軸的最新時間要依據所有資料去篩
            // 疾病
            if(this.passObj.filter==null || [1,11,12,13].some(x => this.passObj.filter.includes(x))) {
                this.diseaseReport.forEach(dis=>{
                    let xid=0;
                    let iid=0;
                    let yid=0;
                    for(let i=0;i<data.length;i++) {
                        for(let x=0;x<data[i].stepList.length;x++) {
                            if(data[i].stepList[x].actionList&&data[i].stepList[x].actionList.length>0) {
                                for(let y=0;y<data[i].stepList[x].actionList.length;y++){
                                    if(data[i].stepList[x].actionList[y].type==0 && data[i].stepList[x].actionList[y].execute_time&&data[i].stepList[x].actionList[y].execute_time!=='') {
                                    // console.log(new Date(data[i].stepList[x].actions[y].execute_time).getTime(),new Date(dis.execute_time).getTime())
                                        if(new Date(data[i].stepList[x].actionList[y].execute_time).getTime()<new Date(dis.execute_time).getTime()) {
                                            iid = i;
                                            xid = x;
                                            yid=y+1;
                                            // break;
                                        }
                                    }
                                }
                            }
                            
                            
                        }
                    }
                    if(this.passObj.filter==null || (this.passObj.filter.includes(11) && dis.status=='異常')||(this.passObj.filter.includes(12) && dis.status=='警告')||(this.passObj.filter.includes(13) && dis.status=='正常')||(!this.passObj.filter.includes(11)&&!this.passObj.filter.includes(12)&&!this.passObj.filter.includes(13))) {
                        if(data[iid].stepList&&data[iid].stepList.length>0) {
                            if(data[iid].stepList[xid].actionList&&data[iid].stepList[xid].actionList.length>0) {
                                data[iid].stepList[xid].actionList.splice(yid,0,dis);
                            }else {
                                data[iid].stepList[xid].actionList=[];
                                data[iid].stepList[xid].actionList.push(dis);
                            }
                        }else {
                            data[iid].stepList = new Array();
                            data[iid].stepList.push({actionList:new Array()})
                            data[iid].stepList[xid].actionList.push(dis);
                        }
                        
                        
                    }
                    // if(this.passObj.filter==null || (this.passObj.filter.includes(11) && dis.status=='異常')) {
                    //     data[iid].stepList[xid].actionList.splice(yid,0,dis);
                    // }else if(this.passObj.filter==null ||(this.passObj.filter.includes(12) && dis.status=='警告')) {
                    //     data[iid].stepList[xid].actionList.splice(yid,0,dis);
                    // }else if(this.passObj.filter==null ||(this.passObj.filter.includes(13) && dis.status=='正常')) {
                    //     data[iid].stepList[xid].actionList.splice(yid,0,dis);
                    // }else if(this.passObj.filter==null || (!this.passObj.filter.includes(11)&&!this.passObj.filter.includes(12)&&!this.passObj.filter.includes(13))){
                    //     data[iid].stepList[xid].actionList.splice(yid,0,dis);
                    // }
                })
            }
            // 水質
            if(this.passObj.filter==null || [2,21,12,23].some(x => this.passObj.filter.includes(x))) {
                this.waterReport.forEach(dis=>{
                    let yid=0;
                    let wid=0;
                    let wxid=0;
                    for(let i=0;i<data.length;i++) {
                        for(let x=0;x<data[i].stepList.length;x++) {
                            if(data[i].stepList[x].actionList&&data[i].stepList[x].actionList.length>0) {
                                for(let y=0;y<data[i].stepList[x].actionList.length;y++) {
                                    if(data[i].stepList[x].actionList[y].type!==null && data[i].stepList[x].actionList[y].execute_time&&data[i].stepList[x].actionList[y].execute_time!=='') {
                                        // console.log(new Date(data[i].stepList[x].actions[y].execute_time).getTime(),new Date(dis.execute_time).getTime())
                                        if(new Date(data[i].stepList[x].actionList[y].execute_time).getTime()<new Date(dis.execute_time).getTime()) {
                                            wid = i;
                                            yid = x;
                                            wxid=y+1;
                                            // break;
                                        }
                                    }
                                }
                            }
                            
                            
                        }
                    }
                    if(this.passObj.filter==null ||(this.passObj.filter.includes(21) && dis.status=='異常')||(this.passObj.filter.includes(22) && dis.status=='警告')||(this.passObj.filter.includes(23) && dis.status=='正常')||(!this.passObj.filter.includes(21)&&!this.passObj.filter.includes(22)&&!this.passObj.filter.includes(23))) {
                        if(data[wid].stepList&&data[wid].stepList.length>0) {
                            if(data[wid].stepList[yid].actionList&&data[wid].stepList[yid].actionList.length>0) {
                                data[wid].stepList[yid].actionList.splice(wxid,0,dis);
                            }else {
                                data[wid].stepList[yid].actionList = [];
                                data[wid].stepList[yid].actionList.push(dis);
                            }
                        }else {
                            data[wid].stepList = new Array();
                            data[wid].stepList.push({actionList:new Array()});
                            data[wid].stepList[yid].actionList.push(dis);
                        }
                        
                        
                    }
                    // if(this.passObj.filter==null ||(this.passObj.filter.includes(21) && dis.status=='異常')) {
                    //     if(data[wid].stepList[yid].actionList&&data[wid].stepList[yid].actionList.length>0) {
                    //         data[wid].stepList[yid].actionList.splice(wxid,0,dis);
                    //     }else {
                    //         data[wid].stepList[yid].actionList = [];
                    //         data[wid].stepList[yid].actionList.push(dis)
                    //     }
                        
                    // }else if(this.passObj.filter==null ||(this.passObj.filter.includes(22) && dis.status=='警告')) {
                    //     data[wid].stepList[yid].actionList.splice(wxid,0,dis);
                    // }else if(this.passObj.filter==null ||(this.passObj.filter.includes(23) && dis.status=='正常')) {
                    //     data[wid].stepList[yid].actionList.splice(wxid,0,dis);
                    // }else if(this.passObj.filter==null || (!this.passObj.filter.includes(21)&&!this.passObj.filter.includes(22)&&!this.passObj.filter.includes(23))){
                    //     data[wid].stepList[yid].actionList.splice(wxid,0,dis);
                    // }
                    
                })
            }
            // 事件
            if(this.passObj.filter==null || this.passObj.filter.includes(3)) { 
                this.eventReport.forEach(dis=>{
                    let etid=0;
                    let eid=0
                    let eyid=0;
                    for(let i=0;i<data.length;i++) {
                        for(let x=0;x<data[i].stepList.length;x++) {
                            if(data[i].stepList[x].actionList&&data[i].stepList[x].actionList.length>0) {
                                for(let y=0;y<data[i].stepList[x].actionList.length;y++) {
                                    if(data[i].stepList[x].actionList[y].type!==null && data[i].stepList[x].actionList[y].execute_time&&data[i].stepList[x].actionList[y].execute_time!=='') {
                                        // console.log(new Date(data[i].stepList[x].actionList[y].execute_time).getTime(),new Date(dis.execute_time).getTime())
                                        if(new Date(data[i].stepList[x].actionList[y].execute_time).getTime()<new Date(dis.execute_time).getTime()) {
                                            eid = i;
                                            etid = x;
                                            eyid = y+1;
                                            // break;
                                        }
                                    }
                                }
                            }
                            
                            
                        }
                    }
                    // data[eid].stepList[etid].actionList.splice(eyid,0,dis);
                    if(data[eid].stepList&&data[eid].stepList.length>0) {
                        if(data[eid].stepList[etid].actionList&&data[eid].stepList[etid].actionList.length>0) {
                            data[eid].stepList[etid].actionList.splice(eyid,0,dis);
                        }else {
                            data[eid].stepList[etid].actionList=[];
                            data[eid].stepList[etid].actionList.push(dis);
                        }
                    }else {
                        data[eid].stepList=new Array();
                        data[eid].stepList.push({actionList:new Array()});
                        data[eid].stepList[etid].actionList.push(dis);
                    }
                    
                })
            }

            // 額外儲存所有
            this.diseaseReport.forEach(dis=>{
                let xid=0;
                let iid=0;
                let yid=0;
                for(let i=0;i<this.dateList.length;i++) {
                    for(let x=0;x<this.dateList[i].stepList.length;x++) {
                        if(this.dateList[i].stepList[x].actionList&&this.dateList[i].stepList[x].actionList.length>0) {
                            for(let y=0;y<this.dateList[i].stepList[x].actionList.length;y++){
                                if(this.dateList[i].stepList[x].actionList[y].type==0 && this.dateList[i].stepList[x].actionList[y].execute_time&&this.dateList[i].stepList[x].actionList[y].execute_time!=='') {
                                // console.log(new Date(this.dateList[i].stepList[x].actionList[y].execute_time).getTime(),new Date(dis.execute_time).getTime())
                                    if(new Date(this.dateList[i].stepList[x].actionList[y].execute_time).getTime()<new Date(dis.execute_time).getTime()) {
                                        iid = i;
                                        xid = x;
                                        yid=y+1;
                                        // break;
                                    }
                                }
                            }
                        }
                        
                        
                    }
                }
                // this.dateList[iid].stepList[xid].actionList.splice(yid,0,dis);
                if(this.dateList[iid].stepList&&this.dateList[iid].stepList.length>0) {
                    if(this.dateList[iid].stepList[xid].actionList&&this.dateList[iid].stepList[xid].actionList.length>0) {
                        this.dateList[iid].stepList[xid].actionList.splice(yid,0,dis);
                    }else {
                        this.dateList[iid].stepList[xid].actionList=[];
                        this.dateList[iid].stepList[xid].actionList.push(dis);
                    }
                }else {
                    this.dateList[iid].stepList=new Array();
                    this.dateList[iid].stepList.push({actionList: new Array()});
                    this.dateList[iid].stepList[xid].actionList.push(dis);
                }
                
            })
            this.waterReport.forEach(dis=>{
                let yid=0;
                let wid=0;
                let wxid=0;
                for(let i=0;i<this.dateList.length;i++) {
                    for(let x=0;x<this.dateList[i].stepList.length;x++) {
                        if(this.dateList[i].stepList[x].actionList&&this.dateList[i].stepList[x].actionList.length>0) {
                            for(let y=0;y<this.dateList[i].stepList[x].actionList.length;y++) {
                                if(this.dateList[i].stepList[x].actionList[y].type!==null && this.dateList[i].stepList[x].actionList[y].execute_time&&this.dateList[i].stepList[x].actionList[y].execute_time!=='') {
                                    // console.log(new Date(this.dateList[i].stepList[x].actionList[y].execute_time).getTime(),new Date(dis.execute_time).getTime())
                                    if(new Date(this.dateList[i].stepList[x].actionList[y].execute_time).getTime()<new Date(dis.execute_time).getTime()) {
                                        wid = i;
                                        yid = x;
                                        wxid=y+1;
                                        // break;
                                    }
                                }
                            }
                        }
                        
                        
                    }
                }
                // this.dateList[wid].stepList[yid].actionList.splice(wxid,0,dis);
                if(this.dateList[wid].stepList&&this.dateList[wid].stepList.length>0) {
                    if(this.dateList[wid].stepList[yid].actionList&&this.dateList[wid].stepList[yid].actionList.length>0) {
                        this.dateList[wid].stepList[yid].actionList.splice(wxid,0,dis);
                    }else {
                        this.dateList[wid].stepList[yid].actionList=[];
                        this.dateList[wid].stepList[yid].actionList.push(dis);
                    }
                }else {
                    this.dateList[wid].stepList=new Array();
                    this.dateList[wid].stepList.push({actionList:new Array()});
                    this.dateList[wid].stepList[yid].actionList.push(dis)
                }
                
            })
            this.eventReport.forEach(dis=>{
                let etid=0;
                let eid=0
                let eyid=0;
                for(let i=0;i<this.dateList.length;i++) {
                    for(let x=0;x<this.dateList[i].stepList.length;x++) {
                        if(this.dateList[i].stepList[x].actionList&&this.dateList[i].stepList[x].actionList.length>0) {
                            for(let y=0;y<this.dateList[i].stepList[x].actionList.length;y++) {
                                if(this.dateList[i].stepList[x].actionList[y].type!==null && this.dateList[i].stepList[x].actionList[y].execute_time&&this.dateList[i].stepList[x].actionList[y].execute_time!=='') {
                                    // console.log(new Date(this.dateList[i].stepList[x].actionList[y].execute_time).getTime(),new Date(dis.execute_time).getTime())
                                    if(new Date(this.dateList[i].stepList[x].actionList[y].execute_time).getTime()<new Date(dis.execute_time).getTime()) {
                                        eid = i;
                                        etid = x;
                                        eyid = y+1;
                                        // break;
                                    }
                                }
                            }
                        }
                        
                        
                    }
                }
                // this.dateList[eid].stepList[etid].actionList.splice(eyid,0,dis);
                if(this.dateList[eid].stepList&&this.dateList[eid].stepList.length>0) {
                    if(this.dateList[eid].stepList[etid].actionList&&this.dateList[eid].stepList[etid].actionList.length>0) {
                        this.dateList[eid].stepList[etid].actionList.splice(eyid,0,dis);
                    }else {
                        this.dateList[eid].stepList[etid].actionList=[];
                        this.dateList[eid].stepList[etid].actionList.push(dis);
                    }
                }else {
                    this.dateList[eid].stepList=new Array();
                    this.dateList[eid].stepList.push({actionList:new Array()});
                    this.dateList[eid].stepList[etid].actionList.push(dis);
                }
                
            })
            this.mainItems = data;
            // console.log('sort',this.mainItems,this.dateList);
            this.dateData();
        },
        // 整理各階段最新時間(階段圓圈旁會顯示)
        dateData() {
            this.dateList.forEach(s=>{
                s.newest = ''; // 因為更新後只有時間變動太小，需先清空再給，才會更新html
                s.stepList.forEach(p=>{
                    if(p.actionList&&p.actionList.length>0) {
                        p.actionList.forEach(action=>{
                            if(action.execute_time&&action.execute_time!=='') {
                                if(s.newest&&s.newest!=='') {
                                    let current = new Date(action.execute_time);
                                    let now = new Date(s.newest);
                                    if(current>now) {
                                        s.newest = action.execute_time;
                                    }
                                }else {
                                    s.newest = action.execute_time;
                                }
                            }
                        })
                    }
                    
                    
                })
            });
            this.mainItems.forEach((mitem,mid)=>{
                mitem.newest = this.dateList[mid].newest;
            })
            // console.log('data',this.mainItems);
            this.colorData();
        },
        // 各階段顏色存取(表頭顏色、時間軸顏色)
        colorData() {
            let index=0;
            this.mainItems.forEach((mitem,mid)=>{
                mitem.stepList.forEach(step=>{
                    if(step.id==this.nowStepId) {
                        index=mid;
                    }
                })
            })
            this.mainItems.forEach((i,id)=>{
                if(this.templatemode=='cycleedit') {
                    this.status.forEach((st,sid)=>{
                        if(st.name==i.phase_name_ch) {
                            i.open = st.open;
                            // 如果有newest參數，代表此階段已有執行項目，直接給定顏色
                            if((i.newest&& i.newest!=='')||id==index) {
                                i.color = st.color;
                            }else {
                                i.color = '#BFCBD2'
                                // if(id!==0) {
                                //     // 非第一項，需判斷前一項是否已執行，有執行給顏色，沒執行給disabled顏色(#BFCBD2)
                                //     // 判斷前項的最後一個步驟是否已執行，有執行給顏色，沒執行給disabled顏色(#BFCBD2)
                                //     if(this.mainItems[(id-1)] && this.mainItems[(id-1)].newest && this.mainItems[(id-1)] && this.mainItems[(id-1)].newest!=='') {
                                //         if(this.mainItems[(id-1)].stepList[this.mainItems[(id-1)].stepList.length-1].verify_time&&
                                //         this.mainItems[(id-1)].stepList[this.mainItems[(id-1)].stepList.length-1].verify_time!=='') {
                                //             i.color = st.color;
                                //         }else {
                                //             i.color = '#BFCBD2'
                                //         }
                                        
                                //     }else {
                                //         i.color = '#BFCBD2'
                                //     }
                                // }else {
                                //     i.color = st.color;
                                // }
                                
                            }
                        }
                    })
                }
            })
            // this.executorData();
        },
        // 階段收合
        open(data,id) {
            if(this.templatemode=='cycleedit') {
                this.status.filter(x=>x.name==data.phase_name_ch)[0].open = !this.status.filter(x=>x.name==data.phase_name_ch)[0].open;
            }else {
                this.status[id].open=!this.status[id].open;
                data.open = this.status[id].open;
            }
        },
        // 判斷階段是否有展開
        adjustOpen(data,id) {
            if(this.templatemode=='cycleedit') {
                return this.status.filter(x=>x.name==data.phase_name_ch)[0].open;
            }else {
                data.open = this.status[id].open;
                // console.log(this.status[id].open);
                return this.status[id].open;
            }
            
        },
        // 工作收合
        openWork(mid,wid) {
            this.mainItems[mid].stepList[wid].open = !this.mainItems[mid].stepList[wid].open;
            let items = _.cloneDeep(this.mainItems);
            this.mainItems = [];
            this.mainItems = items;
            if(this.templatemode=='cycleedit') {
                this.workOpenStatus[mid].open[wid] = !this.workOpenStatus[mid].open[wid];
            }
        },
        // 執行與確認disabled 整理
        // disabledData() {
        //     // 如果項目已確認(isConfirm)=>不可取消執行(disabled = true)
        //     // 因為要照著步驟，因此如果項目的前一項尚未執行(execute_time='')=>不可跳著執行(disabled = true)
        //     // 承上，如果此時為狀態的第一項目，要看前一狀態的最後一項是否執行
        //     // 不可多項取消，只有最後的一個可以點選，要從後面往前依序取消

        //     let cancelId = []; // 存取目前取消狀態id，最後一項不disabled，前面的取消都要disabled
        //     let isNowDetect = false; // 判斷是否現在已有未執行狀態，如有存在，後面的執行鈕都應disabled
        //     this.justStep.forEach((m,mid)=>{
        //         m.stepList.forEach((s,sid)=>{
        //             // 判斷現在的sid是否為0，如為0要額外判斷前一狀態的最後一項
        //             if(sid!==0) {
        //                 if(s.verify_time!=='' || this.passObj.nowEnd) {
        //                     s.execute_disabled = true;
        //                 }else {
        //                     if((m.stepList[sid-1].execute_time&&m.stepList[sid-1].execute_time!=='') || (s.execute_time&&s.execute_time!=='')) {
        //                         // if(m.stepList[sid-1].verify_time=='') {
        //                         //     s.execute_disabled = false;
        //                         // }else {
        //                         //     s.execute_disabled = false;
        //                         // }
        //                         s.execute_disabled = false;
                                
        //                     }else {
        //                         s.execute_disabled = true;
        //                     }
        //                 }
        //             }else {
        //                 if(s.verify_time!=='' || this.passObj.nowEnd) {
        //                     s.execute_disabled = true;
        //                 }else {
        //                     if(mid !==0 ) {
        //                         if((this.justStep[mid-1].stepList[this.justStep[mid-1].stepList.length-1].execute_time && 
        //                         this.justStep[mid-1].stepList[this.justStep[mid-1].stepList.length-1].execute_time!=='') || 
        //                         (this.justStep[mid].stepList[this.justStep[mid].stepList.length-1].execute_time && 
        //                         this.justStep[mid].stepList[this.justStep[mid].stepList.length-1].execute_time!=='')) {
        //                             if(this.justStep[mid-1].stepList[this.justStep[mid-1].stepList.length-1].verify_time=='') {
        //                                 s.execute_disabled = true;
        //                             }else {
        //                                 s.execute_disabled = false;
        //                             }
        //                             // s.execute_disabled = false;
        //                         }else{
        //                             s.execute_disabled = true;
        //                         }
        //                     }else {
        //                         s.execute_disabled = false;
        //                     }
        //                 }
                        
        //             }

        //             // 判斷現在狀態是否為取消狀態，是的話，額外存取，並更改disabled
        //             if(s.execute_time && s.execute_time!=='' && s.verify_time=='') {
        //                 cancelId.push({
        //                     id: mid,
        //                     index: sid
        //                 })
        //                 // console.log('cancel',cancelId);
        //             }
        //         })
        //     })
        //     if(cancelId.length>0) {
        //         cancelId.forEach((cancel,cid)=>{
        //             if(cid !== (cancelId.length-1)) {
        //                 this.justStep[cancel.id].stepList[cancel.index].execute_disabled = true;
        //             }else {
        //                 this.justStep[cancel.id].stepList[cancel.index].execute_disabled = false;
        //             }

        //         })
        //     }
            
        //     this.sortTime();
        // },
        // 執行人員email轉換成部門+帳號名稱
        executorData() {
            if(this.templatemode=='cycleedit') {
                this.mainItems.forEach(m=>{
                    m.stepList.forEach(s=>{
                        s.actionList.forEach(action=>{
                            if(action.dailyCheckList&&action.dailyCheckList.length>0) {
                                action.dailyCheckList.forEach(daily=>{
                                    if(daily.executor&&daily.executor!=='') {
                                        // console.log(this.accdata,s.executor);
                                        daily.deft_executor = this.accdata.filter(x=>x.username==daily.executor)[0].position+'-'+this.accdata.filter(x=>x.username==daily.executor)[0].account_name;
                                    }else {
                                        daily.deft_executor = '';
                                    }
                                })
                                
                            }
                            
                        })
                    })
                })
            }else {
                this.mainItems.forEach(m=>{
                    m.stepList.forEach(s=>{
                        s.actionList.forEach(action=>{
                            if(action.executor&&action.executor!=='') {
                                // console.log(this.accdata,s.executor);
                                action.deft_executor = this.accdata.filter(x=>x.username==action.executor)[0].position+'-'+this.accdata.filter(x=>x.username==action.executor)[0].account_name;
                            }else {
                                action.deft_executor = '';
                            }
                        })
                    })
                })
            }
            // console.log('mainItems',this.mainItems);
        },
        // 疾病/水質表格顏色判斷
        itemRowBackground(evt) {
            return evt.status&&evt.status=='異常'?'danger-bg':evt.status&&evt.status=='警告'?'warning-bg':'';
        },
        // 刪除整個工作
        async deleteCycleWork(phase_id,wid) {
            let index = this.mainItems.map(e => e.phase_original_id).indexOf(phase_id);
            if (confirm(`確認移除項目：${this.mainItems[index].stepList[wid].step_name_ch} ？`)) {
                var id = this.mainItems[index].stepList[wid].id;
                var res = false;
                res = await this.deleteWorkList(id);
                setTimeout(()=>{
                    if(res) {
                        this.$emit('getTemp');
                    }
                },50)
                
            }
        },
        /* 其他項目 */
        // 刪除檢驗
        delsubitem: async function (phase_id,wid, index) {
            console.log('delete',phase_id, index);
            var sub_item = this.mainItems.filter(x => this.templatemode=='cycleedit'?x.phase_original_id:x.phase_id == phase_id)[0].stepList[wid].actionList[index];
            if(this.templatemode == 'cycleedit') {
                    if (confirm(`是否刪除 ${sub_item.action_name}：${sub_item.msg} ？`)) {
                        // this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList.splice(index, 1);
                        // step_id
                        if(sub_item.type==null) {
                            var res = false;
                            res = await this.deleteRecordStepList(sub_item.action_id);
                            setTimeout(()=>{
                                if(res) {
                                    this.mainItems.forEach(mitem=>{
                                        if(this.templatemode=='cycleedit'?mitem.phase_original_id:mitem.phase_id==phase_id) {
                                            mitem.stepList[wid].actionList.splice(index,1);
                                        }
                                    })
                                }
                            },50)
                            // await this.$axios
                            // .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/${sub_item.step_id}/`)
                            // .then(res => {
                            //     if(res.data=='刪除成功'){
                            //         let stepId=[]; // 刪除其他項目id要重新給定，所以要額外存取
                            //         // let datas = _.cloneDeep(this.mainItems);
                            //         let datas = _.cloneDeep(this.justStep);
                            //         datas.forEach((item,id)=>{
                            //             // stepId.push({
                            //             //     "phase_id": item.phase_id,
                            //             //     "phase_name_ch": item.phase_name_ch,
                            //             //     "open": item.open,
                            //             //     "color": item.color,
                            //             //     "newest": item.newest,
                            //             //     "stepList": new Array(),
                            //             // })
                                        
                            //             if(item.phase_id == phase_id) {
                            //                 let sindex = 0;
                            //                 item.stepList.forEach((step,sid)=>{
                            //                     if(sub_item.step_id!==step.step_id) {
                            //                         // if(sid>index) {
                            //                         //     step.seq_id = 'step_'+(sindex);
                            //                         //     sindex++;
                            //                         // }
                            //                         stepId.push(step);
                            //                     }
                            //                 })
                            //                 this.reviseData(stepId,phase_id);
                            //             }
                                        

                            //         })
                            //         // datas = stepId;
                            //         // this.reviseCycleData(datas,phase_id,'delete');
                            //         console.log('delete',stepId);

                                    
                            //         this.$toast.success("刪除成功", { duration: 2000 });
                            //     }else{
                            //         this.$toast.error("刪除步驟失敗:" + res.data, { duration: 2000 });
                            //     }

                            //     console.log("刪除步驟API:" + res.request.responseURL);
                            // })
                            // .catch(error => {
                            //     this.$toast.error("error:" + error, { duration: 2000 });
                            // })
                            // .finally(() => {
                            // });
                        }else if(sub_item.type==1) {
                            var res = false;
                            res = await this.deleteDiseaseTestingRecordList(sub_item.id);
                            setTimeout(()=>{
                                if(res) {
                                    this.$emit('getDisease')
                                }
                            },50)
                            // await this.$axios
                            // .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-record/${sub_item.id}/`)
                            // .then(res => {
                            //     if(res.data=='刪除成功'){
                            //         this.$emit('getDisease')

                                    
                            //         this.$toast.success("刪除成功", { duration: 2000 });
                            //     }else{
                            //         this.$toast.error("刪除步驟失敗:" + res.data, { duration: 2000 });
                            //     }

                            //     console.log("刪除步驟API:" + res.request.responseURL);
                            // })
                            // .catch(error => {
                            //     this.$toast.error("error:" + error, { duration: 2000 });
                            // })
                            // .finally(() => {
                            // });
                        }else if(sub_item.type==2) {
                            var res = false;
                            res = await this.deleteWaterTestingRecordList(sub_item.id);
                            setTimeout(()=>{
                                if(res) {
                                    this.$emit('getWater')
                                }
                            },50)
                            // await this.$axios
                            // .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/water-quality-testing-record/${sub_item.id}/`)
                            // .then(res => {
                            //     if(res.data=='刪除成功'){
                            //         this.$emit('getWater')

                                    
                            //         this.$toast.success("刪除成功", { duration: 2000 });
                            //     }else{
                            //         this.$toast.error("刪除步驟失敗:" + res.data, { duration: 2000 });
                            //     }

                            //     console.log("刪除步驟API:" + res.request.responseURL);
                            // })
                            // .catch(error => {
                            //     this.$toast.error("error:" + error, { duration: 2000 });
                            // })
                            // .finally(() => {
                            // });
                        }
                    }
                
            }else {
                this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList.splice(index, 1);
            }
        },
        // 編輯檢驗
        editsubitem(phase_id,wid, index) {
            // console.log("phase:", phase_id, "addidx:",addidx);
            // this.stepitem.phase_id = phase_id;
            // this.stepitem.addidx = addidx;
            let item = _.cloneDeep(this.mainItems.filter(m=>this.templatemode=='cycleedit'?m.phase_original_id:m.phase_id==phase_id)[0].stepList[wid].actionList[index]);
            if(item.type==null) {
                this.editem = true;//show dialog
                this.addStep = [];
                this.addStep.push(item);
            }else if(item.type == 1 || item.type==2) {
                this.$emit('reportEditOpen',item);
            }
        },
        dateFormat(time) {
            // console.log('time',dayjs( new Date(time)).format("MM-DD HH:mm"));
            return dayjs( new Date(time)).format("MM-DD HH:mm");
        },
        // 結束養殖循環
        endCycle() {
            this.$emit('end');
        },
        /* 樣板編輯 */
        // 刪除step(表格)
        deletestep:async function(){
            if (!confirm(`是否刪除？`)) {
                this.$toast.error('刪除取消', { duration: 2000 });
                return;
            }
            var id = this.stepitem.id;
            var res = false;
            res = await this.deleteBreedingStepList2(id);
            setTimeout(()=>{
                if(res) {
                    this.getstepdata();
                    this.stepformedit = {};
                    this.stepitem.id = undefined;
                    // this.stepmode = 'add';
                    this.stepmode = '';
                    this.actionInputShow = false;
                    this.dialog.additem = false;
                    this.actionInputShow = false;

                }
            },50)
            // await this.$axios
            //     .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/${id}/`)
            //     .then(res => {
            //         if(res.data=='刪除成功'){
            //             this.getstepdata();
            //             this.stepformedit = {};
            //             this.stepitem.id = undefined;
            //             this.stepmode = 'add';
            //             this.dialog.additem = false;
            //             // let submit = {phase_id: this.stepitem.phase_id,addidx:this.stepitem.addidx};
            //             // this.stepitem = _.cloneDeep(this.stepdata[0]);
            //             // this.stepitem.phase_id = submit.phase_id;
            //             // this.stepitem.addidx = submit.addidx;
            //             // this.showstep('edit');
            //             this.$toast.success("刪除成功", { duration: 2000 });
            //         }else{
            //             this.$toast.error("刪除步驟失敗:" + res.data, { duration: 2000 });
            //         }

            //         console.log("刪除步驟API:" + res.request.responseURL);
            //     })
            //     .catch(error => {
            //         this.$toast.error("error:" + error, { duration: 2000 });
            //     })
            //     .finally(() => {
            //     });
        },
        // 顯示step編輯視窗(add、edit)
        showstep:function(mode){
            if(this.stepmode==mode) {
                this.stepmode = '';
                this.actionInputShow = false;
            }else {
                this.stepmode=mode;
                this.stepformedit = {};
                this.actionInputShow = true;
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
                    // this.stepformedit.name_ch = step.name_ch;
                    // this.stepformedit.name_en = step.name_en;
                    // this.stepformedit.remark = step.remark;
                    this.stepformedit.name_ch = step.name_ch;
                    this.stepformedit.name_en = step.name_en;
                    this.stepformedit.remark = step.remark;
                    console.log('showStep',this.stepitem,);
                }else {
                    this.stepitem = {phase_id: this.stepitem.phase_id,addidx:this.stepitem.addidx};
                    console.log('showStep add',this.stepformedit);
                }
                this.dialog.phaseform = true;  
            }
                        
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
                    if(m.phase_name!=='空池') {
                        // if(m.stepList.length>0){
                        //     para.tempContent.push(m)
                        // }
                        para.tempContent.push(m)
                    }
                    
                });
                console.log('Save Edit',para);
                var res = false;
                res = await this.patchTemplateList2(para,id);
                setTimeout(()=>{
                    if(res) {
                        this.updateouterAction('done');
                    }
                },100)

                // await this.$axios
                //     .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/${id}/`, para)
                //     .then(res => {
                //         console.log(res);
                //         if(res.data=='修改成功'){
                //             this.$toast.success("修改成功", { duration: 2000 });
                //             this.updateouterAction('done');
                //         }else{
                //             this.$toast.error("修改樣板失敗:" + res.data, { duration: 2000 });
                //         }

                //         console.log("修改樣板API:" + res.request.responseURL);
                //     })
                //     .catch(error => {
                //         this.$toast.error("error:" + error, { duration: 2000 });
                //     })
                //     .finally(() => {
                //     });

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
                para.tempMain.is_enable = true;
                this.mainItems.forEach(m=>{
                    if(m.phase_name!=='空池') {
                        // if(m.stepList.length>0){
                        //     para.tempContent.push(m)
                        // }
                        para.tempContent.push(m)
                    }
                });
                console.log(para);
                var res = false;
                res = await this.postTemplateList2(para);
                setTimeout(()=>{
                    if(res) {
                        this.updateouterAction('done');
                    }
                },100)
                // await this.$axios
                //         .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/`, para)
                //         .then(res => {
                //             console.log('新增',res)
                //             if(res.data=='新增成功'){
                //                 // this.dialog.phaseform = false;
                //                 // this.getstepdata();
                //                 this.$toast.success("新增成功", { duration: 2000 });
                //                 this.updateouterAction('done');
                //             }else{
                //                 this.$toast.error("新增樣板失敗:" + res.data, { duration: 2000 });
                //             }

                //             console.log("新增樣板API:" + res.request.responseURL);
                //         })
                //         .catch(error => {
                //             this.$toast.error("error:" + error, { duration: 2000 });
                //         })
                //         .finally(() => {
                //         });

            }

        },
        // 取得步驟清單
        getstepdata: async function (bool=false) {
            let getBreedingStepList = await this.getBreedingStepList2();
            let stepData = typeof (getBreedingStepList)=='string'?[]:getBreedingStepList;
            this.stepdataAll = stepData;
            let data = _.cloneDeep(this.mainItems);
            this.mainItems = [];
            data.forEach(m=>{
                m.stepList.forEach(s=>{
                    this.stepdataAll.forEach(a=>{
                        if(s.step_id == a.id) {
                            s.step_name_ch = a.name_ch;
                            s.step_name_en = a.name_en;
                            s.remark = a.remark;
                        }
                    })
                })
            })
            this.mainItems = _.cloneDeep(data);
            this.stepdata = [];
            this.stepdataAll.forEach(s=>{
                this.stepdata.push(s);
            })
            console.log('getStep',this.mainItems)
            if(bool) {
                console.log('get Step',this.stepitem,this.stepformedit,this.stepdataAll);
                // let submit = {phase_id: this.stepitem.phase_id,addidx:this.stepitem.addidx};
                // this.stepitem = _.cloneDeep(this.stepformedit);
                // this.stepitem.id = this.stepdataAll.filter(x=>x.name_ch == this.stepformedit.name_ch)[0].id;
                // this.stepitem.phase_id = submit.phase_id;
                // this.stepitem.addidx = submit.addidx;
                // this.insertStep();
                let item = this.stepdataAll.filter(x=>x.name_ch == this.stepformedit.name_ch)[0];
                if(this.workType=='edit') {
                    if(this.editItem.actionList) {
                        this.editItem.actionList.push({
                            "action_id": item.id,
                            "action_name": item.name_ch,
                            "remark":item.remark,
                            "start_on_which_day":null,
                            "end_on_which_day":null
                        });
                        this.editItem.actionList.sort((a,b)=>{
                            return a.start_on_which_day-b.start_on_which_day
                        })
                    }else {
                        this.editItem.actionList = [];
                        this.editItem.actionList.push({
                            "action_id": item.id,
                            "action_name": item.name_ch,
                            "remark":item.remark,
                            "start_on_which_day":null,
                            "end_on_which_day":null
                        });
                    }
                }else {
                    if(this.addItem.actionList) {
                        this.addItem.actionList.push({
                            "action_id": item.id,
                            "action_name": item.name_ch,
                            "remark":item.remark,
                            "start_on_which_day":null,
                            "end_on_which_day":null
                        });
                        this.addItem.actionList.sort((a,b)=>{
                            return a.start_on_which_day-b.start_on_which_day
                        })
                    }else {
                        this.addItem.actionList = [];
                        this.addItem.actionList.push({
                            "action_id": item.id,
                            "action_name": item.name_ch,
                            "remark":item.remark,
                            "start_on_which_day":null,
                            "end_on_which_day":null
                        });
                    }
                }
                
                console.log('add',item);
            }
            // await this.$axios
            //     .get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/`)
            //     .then(res => {
            //         this.stepdataAll = res.data;
            //         let data = _.cloneDeep(this.mainItems);
            //         this.mainItems = [];
            //         data.forEach(m=>{
            //             m.stepList.forEach(s=>{
            //                 this.stepdataAll.forEach(a=>{
            //                     if(s.step_id == a.id) {
            //                         s.step_name_ch = a.name_ch;
            //                         s.step_name_en = a.name_en;
            //                         s.remark = a.remark;
            //                     }
            //                 })
            //             })
            //         })
            //         this.mainItems = _.cloneDeep(data);
            //         console.log('getStep',this.mainItems)
            //         if(bool) {
            //             console.log('get Step',this.stepitem,this.stepformedit,this.stepdataAll);
            //             let submit = {phase_id: this.stepitem.phase_id,addidx:this.stepitem.addidx};
            //             this.stepitem = _.cloneDeep(this.stepformedit);
            //             this.stepitem.id = this.stepdataAll.filter(x=>x.name_ch == this.stepformedit.name_ch)[0].id;
            //             this.stepitem.phase_id = submit.phase_id;
            //             this.stepitem.addidx = submit.addidx;
            //             this.insertStep();
            //         }
            //         console.log("取得步驟清單API:" + res.request.responseURL);
            //     })
            //     .catch(error => {
            //         this.$toast.error("error:" + error, { duration: 2000 });
            //     })
            //     .finally(() => {
            //     });
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
                remark: this.stepitem.remark,
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
        },
        // 編輯工作
        editWorkDialogOpen(work,phase_id,id) {
            this.addWorkIndex = {
                phase_id:phase_id,
                id:id
            }
            this.editItem = _.cloneDeep(work);
            this.workType = 'edit';
            this.editWorkDialog = true;
        },
        // 選擇加入的動作
        editActionItemDialogOpen() {
            this.stepdata = [];
            this.stepdataAll.forEach(s=>{
                this.stepdata.push(s);
            })
            this.stepmode = '';
            this.stepformedit = {};
            this.stepitem.id = null;
            this.actionInputShow = false;
            this.editActionItemDialog = true;
        },
        actionChange() {
            this.stepformedit = this.stepdataAll.filter(x=>x.id == this.stepitem.id)[0];
        },
        // 確認加入動作
        async editActionItemSubmit() {
            var valid = this.$refs.editActionItemform.validate();
            if(valid) {
                this.stepformedit.created_user =  (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                    this.stepformedit.updated_user =  (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                    console.log('step',this.stepformedit,this.stepmode);
                    switch (this.stepmode) {
                        case 'add':
                            console.log('step add',this.stepitem);
                            var res = false;
                            res = await this.postBreedingStepList2(this.stepformedit);
                            setTimeout(()=>{
                                if(res) {
                                    this.getstepdata(true);
                                }
                            },50)
                            break;
                        case 'edit':
                            var id = this.stepitem.id;
                            var res = false;
                            res = await this.patchBreedingStepList2(this.stepformedit,id);
                            setTimeout(()=>{
                                if(res) {
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
                                }
                            },50)
                            // await this.$axios
                            // .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/${id}/`, this.stepformedit)
                            //     .then(res => {
                            //         if(res.data=='修改成功'){
                            //             this.dialog.phaseform = false;
                            //             var stepformedit = this.stepformedit;
                            //             //同步把畫面上的資料修改成一致
                            //             this.mainItems.forEach(element => {
                            //                 var step = element.stepList;
                            //                 step.filter(x=>x.step_id==id).forEach(stepele => {
                            //                     stepele.step_name_ch = stepformedit.name_ch;
                            //                 });
                            //             });
                            //             //this.stepformedit 要把同id所有名稱
                            //             this.stepitem.id = undefined;
                            //             this.getstepdata(true);
                            //             // this.$toast.success("修改成功", { duration: 2000 });
                            //         }else{
                            //             this.$toast.error("修改步驟失敗:" + res.data, { duration: 2000 });
                            //         }

                            //         console.log("修改步驟API:" + res.request.responseURL);
                            //     })
                            //     .catch(error => {
                            //         this.$toast.error("error:" + error, { duration: 2000 });
                            //     })
                            //     .finally(() => {
                            //     });
                            break;
                        case '':
                            let item = this.stepdataAll.filter(x=>x.id == this.stepitem.id)[0];
                            console.log('addddd',item);
                            if(this.workType=='edit') {
                                if(this.editItem.actionList) {
                                    this.editItem.actionList.push({
                                        "action_id": item.id,
                                        "action_name": item.name_ch,
                                        "remark":item.remark,
                                        "start_on_which_day":null,
                                        "end_on_which_day":null,
                                        "estimated_member": 0,
                                        "estimated_spend":0
                                    });
                                    this.editItem.actionList.sort((a,b)=>{
                                        return a.start_on_which_day-b.start_on_which_day
                                    })
                                }else {
                                    this.editItem.actionList = [];
                                    this.editItem.actionList.push({
                                        "action_id": item.id,
                                        "action_name": item.name_ch,
                                        "remark":item.remark,
                                        "start_on_which_day":null,
                                        "end_on_which_day":null,
                                        "estimated_member": 0,
                                        "estimated_spend":0
                                    });
                                }
                            }else {
                                if(this.addItem.actionList) {
                                    this.addItem.actionList.push({
                                        "action_id": item.id,
                                        "action_name": item.name_ch,
                                        "remark":item.remark,
                                        "start_on_which_day":null,
                                        "end_on_which_day":null,
                                        "estimated_member": 0,
                                        "estimated_spend":0
                                    });
                                    this.addItem.actionList.sort((a,b)=>{
                                        return a.start_on_which_day-b.start_on_which_day
                                    })
                                }else {
                                    this.addItem.actionList = [];
                                    this.addItem.actionList.push({
                                        "action_id": item.id,
                                        "action_name": item.name_ch,
                                        "remark":item.remark,
                                        "start_on_which_day":null,
                                        "end_on_which_day":null,
                                        "estimated_member": 0,
                                        "estimated_spend":0
                                    });
                                }
                            }
                    }
                console.log(this.addItem);
                this.editActionItemDialog = false;
            }
            
        },
        // 確認加入工作
        editWorkSubmit() {
            var valid = this.$refs.editWorkform.validate();
            if(valid) {
                this.sortDay();
                let items = _.cloneDeep(this.mainItems);
                this.editItem.actionList.forEach(action=>{
                    if(action.estimated_member>0) {

                    }else{
                        action.estimated_member=0;
                    }
                    if(action.estimated_spend>0) {
                        action.estimated_spend=0;
                    }
                })
                items.forEach((mitem,mid)=>{
                    if(this.addWorkIndex.phase_id==mitem.phase_id) {
                        mitem.day=0;
                        mitem.stepList.forEach((step,sid)=>{
                            if(sid == this.addWorkIndex.id) {
                                this.editItem.open = true;
                                items[mid].stepList[sid] = _.cloneDeep(this.editItem);
                                let max = 1;
                                if(this.editItem.actionList&&this.editItem.actionList.length>0) {
                                    this.editItem.actionList.forEach(action=>{
                                        if(action.end_on_which_day>max) {
                                            max=action.end_on_which_day;
                                        }
                                    })
                                    mitem.day+=max-1+1;
                                    // mitem.day+=parseInt(this.editItem.actionList[this.editItem.actionList.length-1].end_on_which_day)-parseInt(this.editItem.actionList[0].start_on_which_day)+1;
                                }
                            }else {
                                if(step.actionList&&step.actionList.length>0) {
                                    let max = 1;
                                    step.actionList.forEach(action=>{
                                        if(action.end_on_which_day>max) {
                                            max=action.end_on_which_day;
                                        }
                                    })
                                    mitem.day+=max-1+1;
                                    // mitem.day+=parseInt(step.actionList[step.actionList.length-1].end_on_which_day)-parseInt(step.actionList[0].start_on_which_day)+1;
                                }
                                
                            }
                            
                            
                        })
                    }
                    
                })
                this.mainItems = [];
                this.mainItems = _.cloneDeep(items);
                this.editWorkDialog = false;
            }
            
        },
        // 預設動作依據開始日排序
        sortDay() {
            if(this.workType=='edit') {
                this.editItem.actionList.sort((a,b)=>{
                    return a.start_on_which_day-b.start_on_which_day || a.end_on_which_day-b.end_on_which_day
                })
            }else {
                this.addItem.actionList.sort((a,b)=>{
                    return a.start_on_which_day-b.start_on_which_day || a.end_on_which_day-b.end_on_which_day
                })
            }
            
        },
        // 起始日>完成日，自動將完成日更改為起始日
        detectEndDay(index) {
            if(this.workType=='edit') {
                if(this.editItem.actionList[index].start_on_which_day>this.editItem.actionList[index].end_on_which_day) {
                    this.editItem.actionList[index].end_on_which_day = this.editItem.actionList[index].start_on_which_day;
                }
            }else {
                if(this.addItem.actionList[index].start_on_which_day>this.addItem.actionList[index].end_on_which_day) {
                    this.addItem.actionList[index].end_on_which_day = this.addItem.actionList[index].start_on_which_day;
                }
            }
        },
        // 移除預設動作
        removeAction(id,index) {
            // let index;
            if(this.workType=='edit') {
                // index = this.editItem.actionList.map(e => e.action_id).indexOf(id);
                let items = _.cloneDeep(this.editItem);
                items.actionList.splice(index,1);
                this.editItem = {};
                this.editItem = _.cloneDeep(items);
            }else {
                // index = this.addItem.actionList.map(e => e.action_id).indexOf(id);
                let items = _.cloneDeep(this.addItem);
                items.actionList.splice(index,1);
                this.addItem = {};
                this.addItem = _.cloneDeep(items);
            }
            
        },
        // 刪除整個工作
        deleteWork() {
            if (confirm(`確認移除項目：${this.editItem.step_name} ？`)) {
                let items = _.cloneDeep(this.mainItems);
                items.forEach((mitem,mid)=>{
                    if(mitem.phase_id==this.addWorkIndex.phase_id) {
                        mitem.stepList.forEach((step,sid)=>{
                            if(sid == this.addWorkIndex.id) {
                                    mitem.stepList.splice(sid,1);
                                    this.$toast.success("刪除成功", { duration: 2000 }); 
                            }
                        })
                    }
                    
                })
                items.forEach((mitem)=>{
                    mitem.day=0;
                    mitem.stepList.forEach((step)=>{
                        if(step.actionList&&step.actionList.length>0) {
                            let max = 1;
                            step.actionList.forEach(action=>{
                                if(action.end_on_which_day>max) {
                                    max=action.end_on_which_day;
                                }
                            })
                            mitem.day+=max-1+1;
                            // mitem.day+=parseInt(step.actionList[step.actionList.length-1].end_on_which_day)-parseInt(step.actionList[0].start_on_which_day)+1;
                        }
                        
                    })
                })
                this.mainItems = [];
                this.mainItems = _.cloneDeep(items);
                this.editWorkDialog = false;
            }
        },
        // 新增工作
        addWorkDialogOpen(phase_id,id) {
            this.addWorkIndex = {
                phase_id:phase_id,
                id:id
            };
            this.editItem = {
                "step_id": null,
                "step_name": "",
                "remark":"",
                "day":null,
                "open":true,
                "actionList":[]
            }
            
            this.workType='add';
            this.addWorkDialog = true;
        },
        addWorkItemChange(evt) {
            // console.log('change',evt,this.editItem);
            this.editItem = _.cloneDeep(this.addWorkList.filter(x=>x.id==evt)[0]);
            this.editItem.step_name = this.editItem.name_ch;
            this.editItem.step_id = evt;
        },
        // 新增尚未有的工作
        addWorkActionDialogOpen() {
            this.addItem = {
                "step_id": null,
                "step_name": "",
                "remark":"",
                "day":null,
                "open":true,
                "actionList":[]
            }
            this.addWorkActionDialog = true;
        },
        // 取得工作清單(bool=true 新增工作後重新撈取,bool=false一般撈取)
        async getWorkData(bool=false) {
            let getBreedingWorkList = await this.getBreedingWorkList();
            this.addWorkList = [];
            this.addWorkList = typeof (getBreedingWorkList)=='string'?[]:getBreedingWorkList;
            let item = this.addWorkList.filter(x=>x.name_ch == this.addItem.name_ch)[0];
            if(bool) {
                // this.addItem.step_name=this.addItem.name_ch;
                // this.addItem.step_id = item.id;
                this.editItem = _.cloneDeep(item);
                this.editItem.step_name = item.name_ch;
                this.editItem.step_id = item.id;
                console.log('editItem',this.editItem);
                this.addWorkActionDialog = false;
            }
        },
        // 確認尚未有的工作
        async addWorkActionSubmit() {
            var valid = this.$refs.addWorkActionform.validate();
            if(valid) {
                // this.addItem.step_id = Math.floor(Math.random()*999)+100;
                this.addItem.actionList.forEach(action=>{
                    if(action.estimated_member>0) {

                    }else{
                        action.estimated_member=0;
                    }
                    if(action.estimated_spend>0) {
                        action.estimated_spend=0;
                    }
                })
                this.sortDay();
                let parm = _.cloneDeep(this.addItem);
                delete parm.open;
                delete parm.day;
                delete parm.step_id;
                delete parm.step_name;
                parm.created_user = (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                console.log('parm',parm);
                var res = false;
                res = await this.postBreedingWorkList(parm);
                
                setTimeout(()=>{
                    if(res) {
                        this.getWorkData(true);
                    }
                },500)
                
            }
        },
        // 確認新增工作
        async addWorkSubmit() {
            var valid = this.$refs.addWorkform.validate();
            if(valid) {
                if(this.templatemode!=='cycleedit') {
                    this.editItem.open = true;
                    let items = _.cloneDeep(this.mainItems.filter(x=>x.phase_id == this.addWorkIndex.phase_id)[0]);
                    if(items.stepList&&items.stepList.length>0) {
                        this.mainItems.filter(x=>x.phase_id == this.addWorkIndex.phase_id)[0].stepList.splice(this.addWorkIndex.id+1,0,this.editItem);
                    }else {
                        // 階段下無工作時的新增
                        this.mainItems.filter(x=>x.phase_id == this.addWorkIndex.phase_id)[0].stepList.push(this.editItem);
                    }
                    let item = this.mainItems.filter(x=>x.phase_id == this.addWorkIndex.phase_id)[0];
                    item.day = 0;
                    let index = this.mainItems.map(e => e.phase_id).indexOf(this.addWorkIndex.phase_id);
                    this.status[index].open = true;
                    item.stepList.forEach(step=>{
                        console.log('action',step.actionList);
                        if(step.actionList&&step.actionList.length>0) {
                            let max = 1;
                            step.actionList.forEach(action=>{
                                if(action.end_on_which_day>max) {
                                    max=action.end_on_which_day;
                                }
                            })
                            item.day+=max-1+1;
                            // item.day+=parseInt(step.actionList[step.actionList.length-1].end_on_which_day)-parseInt(step.actionList[0].start_on_which_day)+1;
                        }
                    })
                }else {
                    let parm = _.cloneDeep(this.editItem);
                    let seqid0=this.mainItems.filter(x=>x.phase_original_id==this.addWorkIndex.phase_id)[0].stepList&&this.mainItems.filter(x=>x.phase_original_id==this.addWorkIndex.phase_id)[0].stepList.length>0?
                                parseFloat(this.mainItems.filter(x=>x.phase_original_id==this.addWorkIndex.phase_id)[0].stepList[this.addWorkIndex.id].seq_id):1;
                    let seqid1=this.mainItems.filter(x=>x.phase_original_id==this.addWorkIndex.phase_id)[0].stepList&&this.mainItems.filter(x=>x.phase_original_id==this.addWorkIndex.phase_id)[0].stepList.length>0?
                                (this.mainItems.filter(x=>x.phase_original_id==this.addWorkIndex.phase_id)[0].stepList[this.addWorkIndex.id+1]?
                                parseFloat(this.mainItems.filter(x=>x.phase_original_id==this.addWorkIndex.phase_id)[0].stepList[this.addWorkIndex.id+1].seq_id):parseFloat(seqid0)+1):1;
                    // console.log(seqid0,seqid1);
                    // if(this.mainItems[this.mainItems.length-1].newest!==''&&this.nowStepId==null) {
                    //     seqid0 = parseFloat(this.mainItems.filter(x=>x.phase_original_id==this.addWorkIndex.phase_id)[0].stepList[this.mainItems.filter(x=>x.phase_original_id==this.addWorkIndex.phase_id)[0].stepList.length-1].seq_id);
                    //     seqid1 = seqid0+2;
                    // }
                    parm.phase_id = this.mainItems.filter(x=>x.phase_original_id==this.addWorkIndex.phase_id)[0].phase_id;
                    parm.seq_id = parseFloat((seqid0+seqid1)/2).toString();
                    parm.step_original_id = this.editItem.step_id;
                    parm.created_user = (this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
                    delete parm.step_id;
                    delete parm.created_time;
                    delete parm.updated_time;
                    delete parm.updated_user;
                    delete parm.actionList;
                    delete parm.name_ch;
                    delete parm.name_en;
                    delete parm.remark;
                    delete parm.id;
                    delete parm.step_name;
                    console.log('新增parm',parm);
                    var res = false;
                    res = await this.postWorkList(parm);
                    setTimeout(()=>{
                        if(res) {
                            let index = this.mainItems.map(e => e.phase_original_id).indexOf(this.addWorkIndex.phase_id);
                            this.status[index].open = true;
                            this.$emit('getTemp');
                        }
                    },50)
                    
                }
                
                console.log('addWork',this.mainItems);
                this.addWorkDialog = false;
            }
            
        },
        // 刪除已存在之工作
        async deleteWorkItem() {
            let index = this.addWorkList.map(e => e.id).indexOf(this.editItem.step_id);
            if (confirm(`是否刪除工作-${this.addWorkList[index].name_ch}？`)) {
                // this.addWorkList.splice(index,1);
                // this.editItem = {
                //     "step_id": null,
                //     "step_name": "",
                //     "remark":"",
                //     "day":null,
                //     "open":true,
                //     "actionList":[]
                // }
                // this.$toast.success('刪除成功', { duration: 2000 });
                var id = this.editItem.step_id;
                var res = false;
                res = await this.deleteBreedingWorkList(id);
                setTimeout(()=>{
                    if(res) {
                        this.getWorkData();
                        this.editItem = {};
                    }
                },50)
            }
            
            
        },
        numberChange(evt) {
            console.log('Change Number',evt)
        },
        // 執行狀態細項
        executeDailogOpen(id,wid,index) {
            this.executeList = _.cloneDeep(this.mainItems[id].stepList[wid].actionList[index]);
            this.executeDialog = true;
        },
        // 清空樣板
        clearTemp() {
            this.mainItems.forEach(mitem=>{
                mitem.day = 0;
                mitem.stepList = new Array();
            })
        },
        
    },
    computed: {
    
    },
    async mounted() {
        await this.getstepdata();//取得步驟清單
        await this.getWorkData();
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
            // if(this.templatemode)
            console.log('mainItems',this.status,data,this.mainItems);
        },
        passObj: {
            handler(val){
                console.log(val);
                this.tempMain = _.cloneDeep(this.passObj.tempMain);
                this.mainItems = _.cloneDeep(this.passObj.tempContent);
                this.mainItems.forEach(m=>m.open=this.nowExpand);
                if(this.templatemode=='cycleedit') {
                    this.sortData();
                }
                
                console.log('更新passObj',this.passObj);
            // do stuff
            },
            deep: true
        },
        diseaseReport() {
            if(this.templatemode=='cycleedit') {
                this.sortData();
            }
            
        },
        waterReport() {
            if(this.templatemode=='cycleedit') {
                this.sortData();
            }
            
        },
        eventReport() {
            if(this.templatemode=='cycleedit') {
                this.sortData();
            }
            
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
    //     cursor: pointer;
        .title {
    //         width: 100%;
            .v-card__title {
    //             font-size: 1rem;
                padding: 0;
            }
        }
        
    //     .chevron {
    //         .v-icon {
    //             color: $color-dark;
    //         }
    //     }      
    } 
}
// .work-item {
//     border-bottom: 1px solid rgba(0,0,0,0.1);
//     border-radius: 4px;
//     margin-bottom: 4px;
// }
.add-step {
    text-align: center;
    margin-top: -24px;
    padding-bottom: 24px;
}
.v-application.v-application--is-ltr .v-card.bg-card .content {
    &.no-work {
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(0,0,0,0.38);
    }
}

::v-deep {
    // .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    //     background-color: rgba($color: $color-primary, $alpha: 0.1);
    // }
    
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr.danger-bg {
        background-color: #FBEEEE;
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr.warning-bg {
        background-color: #FFFAE6;
    }
}
.btn-primary.disabled.nonauth,.btn-secondary.disabled.nonauth {
    pointer-events: initial;
}

</style>