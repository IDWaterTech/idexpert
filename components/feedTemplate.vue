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
                <div v-if="passObj.nowEnd" class="error-text" style="padding: 12px;"><b>此循環已結束({{ passObj.ended_date }})</b></div>
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
                                            <v-card-title>{{ templatemode=='cycleedit'?mitem.phase_name_ch:mitem.phase_name }}</v-card-title>
                                        </div>
                                        <div class="chevron">
                                            <v-icon v-if="adjustOpen(mitem,id)">mdi-triangle-small-up</v-icon>
                                            <v-icon v-else>mdi-triangle-small-down</v-icon>
                                        </div>
                                    </div>
                                    <!-- 內容 -->
                                    <div v-if="adjustOpen(mitem,id)" class="content">
                                        <v-data-table light 
                                            :headers="headers.filter(x => x.showmode.includes(templatemode))"
                                            :items="mitem.stepList"
                                            :no-data-text="templatemode=='cycleedit'?'無':''"
                                            hide-default-footer
                                            disable-pagination
                                            style="max-height: 300px;overflow-y: scroll;"
                                            :item-class="itemRowBackground"
                                            :item-key="'table_'+id">
                                            <!-- <template v-slot:[`column.udactions`]="{ column }">
                                                <v-icon>plus-circle-outline</v-icon>{{ column.text }}123
                                            </template> -->
                                            <template v-for="(header,hid) in headers" v-slot:[`header.${header.value}`]>
                                                <div v-if="header.text=='操作' && templatemode=='cycleedit'" class="tool" :key="'header_'+hid+id" style="display: flex;align-items: center;">
                                                    {{ header.text }}
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-btn class="btn-icon just-icon" v-on="on">
                                                                <v-icon>mdi-information-outline</v-icon>
                                                            </v-btn>
                                                        </template>
                                                        <span>僅可編輯/刪除『其他』、『疾病檢驗』、『水質檢驗』項目</span>
                                                    </v-tooltip>
                                                </div>
                                                <span v-else :key="'header_'+hid+id">{{ header.text }}</span>
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
                                            <!-- 項目名稱 -->
                                            <template v-slot:[`item.step_name_ch`]="{ item }">
                                                <v-tooltip v-if="templatemode=='cycleedit' && (item.type==1 || item.type==2)" bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <span v-bind="attrs" v-on="on">{{ item.step_name_ch }}</span>
                                                    </template>
                                                    <span>{{ item.status }}</span>
                                                </v-tooltip>
                                                <span v-else>{{ item.step_name_ch }}</span>
                                                <!-- <v-btn  class="btn-icon" title="在下方新增一列" @click="addsubitem(mitem.id,index)">
                                                    <v-icon>mdi-table-row-plus-after</v-icon>
                                                </v-btn> -->
                                            </template>
                                            
                                            <!-- 訊息 -->
                                            <template v-slot:[`item.msg`]="{ item }">
                                                {{ item.msg }}
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
                                            <!-- 執行 -->
                                            <template v-slot:[`item.deft_executor`]="{ item }">
                                               <span v-if="item.type!==3&&item.type!==1&&item.type!==2">{{ item.deft_executor }} </span>
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
                                                <div class="btn-groups" v-if="mitem.stepList[index].type == 0 || mitem.stepList[index].type == null">
                                                    <v-tooltip v-if="!authorization.execute" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn class="btn-secondary btn-small nonauth disabled"
                                                                v-bind="attrs" v-on="on"
                                                                >
                                                                {{ mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''?mitem.stepList[index].verify_time!==''?'已執行':'取消':'執行' }}
                                                            </v-btn>
                                                        </template>
                                                        <span>未授權</span>
                                                    </v-tooltip>
                                                    <v-btn v-else class="btn-secondary btn-small"
                                                        :class="{'disabled':mitem.stepList[index].execute_disabled}"
                                                        @click="execute(id,index)">
                                                        {{ mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''?mitem.stepList[index].verify_time!==''?'已執行':'取消':'執行' }}
                                                    </v-btn>
                                                    <v-tooltip v-if="!authorization.verify" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn class="btn-primary btn-small nonauth disabled"
                                                                v-bind="attrs" v-on="on">
                                                                {{ mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''&&mitem.stepList[index].verify_time!==''?'已確認':'確認' }}
                                                            </v-btn> 
                                                        </template>
                                                        <span>未授權</span>
                                                    </v-tooltip>
                                                    <v-btn  v-else class="btn-primary btn-small"
                                                        :class="`${(mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''&&mitem.stepList[index].verify_time=='')?'':'disabled'}`"
                                                        @click="executeConfirm(id,index)">
                                                        {{ mitem.stepList[index].execute_time&&mitem.stepList[index].execute_time!==''&&mitem.stepList[index].verify_time!==''?'已確認':'確認' }}
                                                    </v-btn> 
                                                </div>
                                                <div class="btn-groups" v-if="mitem.stepList[index].type && mitem.stepList[index].type !== 0 && mitem.stepList[index].type !== null">
                                                    <v-btn  class="btn-secondary btn-small green"
                                                        @click="if(mitem.stepList[index].file || mitem.stepList[index].type == 3){viewOpen=true;viewDetail=mitem.stepList[index]}" 
                                                        :class="{'disabled':mitem.stepList[index].type !== 3 && !mitem.stepList[index].file}"
                                                        style="pointer-events: inherit;">
                                                        檢視
                                                    </v-btn>
                                                </div>
                                            </template>
                                            
                                            <!-- 編輯/刪除 -->
                                            <template v-slot:[`item.udactions`]="{ index }">
                                                <v-tooltip v-if="templatemode=='cycleedit'" bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn  class="btn-icon"
                                                             title="編輯" 
                                                             @click="editsubitem(mitem.phase_id, index)" 
                                                             v-bind="attrs" v-on="on"
                                                             :class="{'disabled':(mitem.stepList[index].type==0||mitem.stepList[index].type==3)&&templatemode=='cycleedit'}"
                                                             style="pointer-events: inherit;">
                                                            <v-icon>mdi-pencil</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span v-if="(mitem.stepList[index].type==0||mitem.stepList[index].type==3)&&templatemode=='cycleedit'">僅可編輯『其他』、『疾病檢驗』、『水質檢驗』項目</span>
                                                    <span v-else>編輯</span>
                                                </v-tooltip>
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn  class="btn-icon delete"
                                                             title="刪除" 
                                                             @click="delsubitem(mitem.phase_id, index)" 
                                                             v-bind="attrs" v-on="on"
                                                             :class="{'disabled':(mitem.stepList[index].type==0||mitem.stepList[index].type==3)&&templatemode=='cycleedit'}"
                                                             style="pointer-events: inherit;">
                                                            <v-icon>mdi-trash-can</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span v-if="(mitem.stepList[index].type==0||mitem.stepList[index].type==3)&&templatemode=='cycleedit'">僅可刪除『其他』、『疾病檢驗』、『水質檢驗』項目</span>
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
                                        <div v-if="templatemode=='cycleedit' && id == (mainItems.length-1) && !passObj.nowEnd" style="padding: 12px 16px;">
                                            <v-btn class="btn-primary btn-small" @click="endCycle()">結束循環</v-btn>
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
                        <v-card-text v-for="(add,id) in addStep" :key="'addc_'+id" style="display: flex;flex-direction: column;padding: 8px 16px;">
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
                                <v-text-field v-model="add.msg" label="項目說明" :rules="rules.require.concat(rules.checklength)" autocomplete="off" style="padding-top: 8px;margin-top: 0;"></v-text-field>
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
                                <v-autocomplete :disabled="stepmode=='add'" v-model="stepitem.id" @change="selectStep" dense filled hide-details :items="stepdata" item-text="name_ch"
                                    item-value="id">
                                    
                                    <!-- <v-btn slot="append-outer"  class="btn-icon" @click="showstep('edit')"><v-icon>mdi-pencil-outline</v-icon></v-btn>
                                    <v-btn slot="append-outer"  class="btn-icon green" @click="showstep('add')"><v-icon>mdi-plus</v-icon></v-btn>
                                    <v-btn slot="append-outer" :class="{'disabled':(stepitem.id==undefined)}" class="btn-icon delete" @click="deletestep"><v-icon>mdi-trash-can</v-icon></v-btn> -->
                                </v-autocomplete>
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
        <!-- 編輯其他項目的dialog -->
        <v-dialog v-model="editem" max-width="500px">
            <v-form v-model="editvalid" ref="editform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title" style="display: block;width: 100%;">
                        <div style="display: inline-block;">
                            <span v-if="templatemode=='cycleedit'">編輯項目</span>
                        </div>
                        <div class="add" style="float: right;display: inline-block;">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="editem = false; addReport=[{msg:''}]" 
                                    style="border: none;min-width: 0;padding: 0 4px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <v-card-text v-for="(add,id) in addStep" :key="'addc_'+id" style="display: flex;flex-direction: column;padding: 8px 16px;">
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
                                <v-text-field v-model="add.msg" label="項目說明" :rules="rules.require.concat(rules.checklength)" autocomplete="off" style="padding-top: 8px;margin-top: 0;"></v-text-field>
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
                        <v-btn class="btn-primary" @click="submitedit">修改</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
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
                    filter: [1,2,3]
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
                { text: "訊息", value: "msg", groupable: false, sortable: false,width:"15%",showmode: ['cycleedit']},
                // { text: "執行時間", value: "execute_time", groupable: false, sortable: false,width:"20%",showmode: ['cycleedit']},
                { text: "執行", value: "executed_actions", groupable: false, sortable: false,width:"20%",showmode: ['cycleedit']},
                { text: '執行員', value: 'deft_executor', sortable: false,width:"15%",showmode: ['cycleedit']},
                { text: '確認員', value: 'deft_verifier', sortable: false,width:"15%",showmode: ['cycleedit']},
                // { text: '編輯', value: 'reactions', sortable: false,width:"7%",showmode: ['cycleedit']},
                { text: '操作', value: 'udactions', sortable: false,width:"10%",showmode: ['add', 'edit','cycleedit']},
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
            }
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
            this.getAuth();
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
                    open: this.nowExpand
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
        /* 取得授權 */
        async getAuth() {
            let datalst;
            let auth = [];
            this.authorization = {
                execute: false,
                verify: false
            }
            try{datalst = await this.getMenuAuthorization(false)}catch{console.log(error)}
            if(datalst) {
                auth = datalst.data;
            }
            for(let i=0;i<auth.length;i++) {
                if(auth[i].id==14) {
                    if(auth[i].children) {
                        for(let x=0;x<auth[i].children.length;x++) {
                            if(auth[i].children[x].name == '執行') {
                                this.authorization.execute = true;
                            }else if(auth[i].children[x].name == '確認') {
                                this.authorization.verify = true;
                            }
                        }
                    }
                }else {
                    if(auth[i].children) {
                        for(let x=0;x<auth[i].children.length;x++) {
                            if(auth[i].children[x].id == 14) {
                                if(auth[i].children[x].children) {
                                    for(let y=0;y<auth[i].children[x].children.length;y++) {
                                        if(auth[i].children[x].children[y].name == '執行') {
                                            this.authorization.execute = true;
                                        }else if(auth[i].children[x].children[y].name == '確認') {
                                            this.authorization.verify = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                }
            }
        },
        /* 資料整理 */
        // 排序其他
        sortData() {
             // 因有排序重整問題，須另外存取再取代原資料
            let stepId = [];
            let data = _.cloneDeep(this.passObj.tempContent);
            this.mainItems = [];
            data.forEach(d=>{
                d.stepList = d.stepList.filter(x=>x.type==0 || x.type==null);
            })
            data.forEach((m,mid)=>{
                stepId.push({
                    "phase_id": m.phase_id,
                    "phase_name_ch": m.phase_name_ch,
                    "open": m.open,
                    "color": m.color,
                    "newest": m.newest,
                    "stepList": m.stepList,
                })
                
                // 項目排序
                stepId[mid].stepList.sort((a,b)=>{
                    return parseInt(a.seq_id.split('_')[1]) - parseInt(b.seq_id.split('_')[1]);
                })
                
            })
            // this.mainItems = stepId;
            this.justStep = data;
            this.disabledData();
            // this.dateData();
        },
        
        sortTime() {
            let data = _.cloneDeep(this.justStep);
            if(this.passObj.filter==null || this.passObj.filter.includes(1) || this.passObj.filter.includes(11)|| this.passObj.filter.includes(12)|| this.passObj.filter.includes(13)) {
                this.diseaseReport.forEach(dis=>{
                    let xid=0;
                    let iid=0
                    for(let i=0;i<data.length;i++) {
                        for(let x=0;x<data[i].stepList.length;x++) {
                            if(data[i].stepList[x].type==0 && data[i].stepList[x].execute_time && data[i].stepList[x].execute_time!=='') {
                                // console.log(new Date(data[i].stepList[x].execute_time).getTime(),new Date(dis.execute_time).getTime())
                                if(new Date(data[i].stepList[x].execute_time).getTime()<new Date(dis.execute_time).getTime()) {
                                    iid = i;
                                    xid = x+1;
                                    
                                    // break;
                                }
                            }
                        }
                    }
                    if(this.passObj.filter==null || (this.passObj.filter.includes(11) && dis.status=='異常')) {
                        data[iid].stepList.splice(xid,0,dis);
                    }else if(this.passObj.filter==null ||(this.passObj.filter.includes(12) && dis.status=='警告')) {
                        data[iid].stepList.splice(xid,0,dis);
                    }else if(this.passObj.filter==null ||(this.passObj.filter.includes(13) && dis.status=='正常')) {
                        data[iid].stepList.splice(xid,0,dis);
                    }else if(this.passObj.filter==null || (!this.passObj.filter.includes(11)&&!this.passObj.filter.includes(12)&&!this.passObj.filter.includes(13))){
                        data[iid].stepList.splice(xid,0,dis);
                    }
                    
                })
            }
            if(this.passObj.filter==null || this.passObj.filter.includes(2)|| this.passObj.filter.includes(21)|| this.passObj.filter.includes(22)|| this.passObj.filter.includes(23)) {
                this.waterReport.forEach(dis=>{
                    let yid=0;
                    let wid=0
                    for(let i=0;i<data.length;i++) {
                        for(let x=0;x<data[i].stepList.length;x++) {
                            if(data[i].stepList[x].type!==null && data[i].stepList[x].execute_time && data[i].stepList[x].execute_time!=='') {
                                // console.log(new Date(data[i].stepList[x].execute_time).getTime(),new Date(dis.execute_time).getTime())
                                if(new Date(data[i].stepList[x].execute_time).getTime()<new Date(dis.execute_time).getTime()) {
                                    wid = i;
                                    yid = x+1;
                                    
                                    // break;
                                }
                            }
                        }
                    }
                    if(this.passObj.filter==null ||(this.passObj.filter.includes(21) && dis.status=='異常')) {
                        data[wid].stepList.splice(yid,0,dis);
                    }else if(this.passObj.filter==null ||(this.passObj.filter.includes(22) && dis.status=='警告')) {
                        data[wid].stepList.splice(yid,0,dis);
                    }else if(this.passObj.filter==null ||(this.passObj.filter.includes(23) && dis.status=='正常')) {
                        data[wid].stepList.splice(yid,0,dis);
                    }else if(this.passObj.filter==null || (!this.passObj.filter.includes(21)&&!this.passObj.filter.includes(22)&&!this.passObj.filter.includes(23))){
                        data[wid].stepList.splice(yid,0,dis);
                    }
                    
                })
            }
            if(this.passObj.filter==null || this.passObj.filter.includes(3)) { 
                this.eventReport.forEach(dis=>{
                    let etid=0;
                    let eid=0
                    for(let i=0;i<data.length;i++) {
                        for(let x=0;x<data[i].stepList.length;x++) {
                            if(data[i].stepList[x].type!==null && data[i].stepList[x].execute_time && data[i].stepList[x].execute_time!=='') {
                                // console.log(new Date(data[i].stepList[x].execute_time).getTime(),new Date(dis.execute_time).getTime())
                                if(new Date(data[i].stepList[x].execute_time).getTime()<new Date(dis.execute_time).getTime()) {
                                    eid = i;
                                    etid = x+1;
                                    // break;
                                }
                            }
                        }
                    }
                    data[eid].stepList.splice(etid,0,dis);
                })
            }
            
            this.mainItems = data;
            console.log('sort',this.mainItems);
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
                if(this.templatemode=='cycleedit') {
                    this.status.forEach((st,sid)=>{
                        if(st.name==i.phase_name_ch) {
                            i.open = st.open;
                            // 如果有newest參數，代表此階段已有執行項目，直接給定顏色
                            if(i.newest&& i.newest!=='') {
                                i.color = st.color;
                            }else {
                                if(id!==0) {
                                    // 非第一項，需判斷前一項是否已執行，有執行給顏色，沒執行給disabled顏色(#BFCBD2)
                                    // 判斷前項的最後一個步驟是否已執行，有執行給顏色，沒執行給disabled顏色(#BFCBD2)
                                    if(this.mainItems[(id-1)] && this.mainItems[(id-1)].newest && this.mainItems[(id-1)] && this.mainItems[(id-1)].newest!=='') {
                                        if(this.mainItems[(id-1)].stepList[this.mainItems[(id-1)].stepList.length-1].verify_time&&
                                        this.mainItems[(id-1)].stepList[this.mainItems[(id-1)].stepList.length-1].verify_time!=='') {
                                            i.color = st.color;
                                        }else {
                                            i.color = '#BFCBD2'
                                        }
                                        
                                    }else {
                                        i.color = '#BFCBD2'
                                    }
                                }else {
                                    i.color = st.color;
                                }
                                
                            }
                        }
                    })
                }else {

                }
                
                
            })
            
            this.executorData();
        },
        open(data,id) {
            if(this.templatemode=='cycleedit') {
                this.status.filter(x=>x.name==data.phase_name_ch)[0].open = !this.status.filter(x=>x.name==data.phase_name_ch)[0].open;
            }else {
                this.status[id].open=!this.status[id].open;
                data.open = this.status[id].open;
            }
        },
        adjustOpen(data,id) {
            if(this.templatemode=='cycleedit') {
                return this.status.filter(x=>x.name==data.phase_name_ch)[0].open;
            }else {
                data.open = this.status[id].open;
                // console.log(this.status[id].open);
                return this.status[id].open;
            }
            
        },
        // 執行與確認disabled 整理
        disabledData() {
            // 如果項目已確認(isConfirm)=>不可取消執行(disabled = true)
            // 因為要照著步驟，因此如果項目的前一項尚未執行(execute_time='')=>不可跳著執行(disabled = true)
            // 承上，如果此時為狀態的第一項目，要看前一狀態的最後一項是否執行
            // 不可多項取消，只有最後的一個可以點選，要從後面往前依序取消

            let cancelId = []; // 存取目前取消狀態id，最後一項不disabled，前面的取消都要disabled
            let isNowDetect = false; // 判斷是否現在已有未執行狀態，如有存在，後面的執行鈕都應disabled
            this.justStep.forEach((m,mid)=>{
                m.stepList.forEach((s,sid)=>{
                    // 判斷現在的sid是否為0，如為0要額外判斷前一狀態的最後一項
                    if(sid!==0) {
                        if(s.verify_time!=='' || this.passObj.nowEnd) {
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
                        if(s.verify_time!=='' || this.passObj.nowEnd) {
                            s.execute_disabled = true;
                        }else {
                            if(mid !==0 ) {
                                if((this.justStep[mid-1].stepList[this.justStep[mid-1].stepList.length-1].execute_time && 
                                this.justStep[mid-1].stepList[this.justStep[mid-1].stepList.length-1].execute_time!=='') || 
                                (this.justStep[mid].stepList[this.justStep[mid].stepList.length-1].execute_time && 
                                this.justStep[mid].stepList[this.justStep[mid].stepList.length-1].execute_time!=='')) {
                                    if(this.justStep[mid-1].stepList[this.justStep[mid-1].stepList.length-1].verify_time=='') {
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

                    // 判斷現在狀態是否為取消狀態，是的話，額外存取，並更改disabled
                    if(s.execute_time && s.execute_time!=='' && s.verify_time=='') {
                        cancelId.push({
                            id: mid,
                            index: sid
                        })
                        // console.log('cancel',cancelId);
                    }
                })
            })
            if(cancelId.length>0) {
                cancelId.forEach((cancel,cid)=>{
                    if(cid !== (cancelId.length-1)) {
                        this.justStep[cancel.id].stepList[cancel.index].execute_disabled = true;
                    }else {
                        this.justStep[cancel.id].stepList[cancel.index].execute_disabled = false;
                    }

                 })
            }
            
            this.sortTime();
        },
        // 執行人員/確認人員的比對轉換
        executorData() {
            this.mainItems.forEach(m=>{
                m.stepList.forEach(s=>{
                    if(s.executor&&s.executor!=='') {
                        console.log(this.accdata,s.executor);
                        s.deft_executor = this.accdata.filter(x=>x.username==s.executor)[0].position+'-'+this.accdata.filter(x=>x.username==s.executor)[0].account_name;
                    }else {
                        s.deft_executor = '';
                    }
                    if(s.verifier&&s.verifier!=='') {
                        s.deft_verifier = this.accdata.filter(x=>x.username==s.verifier)[0].position+'-'+this.accdata.filter(x=>x.username==s.verifier)[0].account_name;
                    }else {
                        s.deft_verifier = '';
                    }
                })
            })
        },
        // 表格顏色判斷
        itemRowBackground(evt) {
            return evt.status&&evt.status=='異常'?'danger-bg':evt.status&&evt.status=='警告'?'warning-bg':'';
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
                    this.showstep('add');
                }
                
            }else {
                // 關掉Dialog重新開啟，原先的表格判斷或資料要清除
                if (this.$refs.addform != undefined) {
                    this.$refs.addform.reset();
                    
                }
                 
                
            }
           
            console.log('step add',this.mainItems,this.stepitem);
        },
        // 新增項目確認!!送出step項目
        submitstep:async function(){
            var valid = this.$refs.addform.validate();
            const updUser = this.$auth.$state.user.email;
            console.log('valid form',valid);
            if(valid) {
                if(this.templatemode=='cycleedit') {
                    let datas = _.cloneDeep(this.justStep);// 因要確認是否成功傳出，需額外存參數，避免失敗但頁面資料更改的狀況
                    let stepId = [];// 因會有其他的排序id問題，必須要另外存取(主要是新增的項目下)
                    let other = _.cloneDeep(this.addStep);// 不能直接用addStep，如果重新開dialog新增會清空會連動影響
                    other.forEach((step,sid)=>{
                        step.phase_id =  this.stepitem.phase_id;
                        step.seq_id = '';
                        step.msg = step.msg;
                        step.step_name_ch = '其他';
                        step.step_name_en = 'others';
                        step.verify_time='';
                        step.executor = '';
                        step.verifier = '';
                        step.created_user = this.$auth.$state.user.email;
                    })
                    let addidx = this.getId();
                    console.log('now',addidx)
                    datas.forEach((data,did)=>{
                        if(data.phase_id == this.stepitem.phase_id) {
                            if(addidx==-1) {
                                other.forEach((o,oid)=>{
                                    // o.seq_id = 'step_'+(this.stepitem.addidx+1+oid);
                                    if(datas[did].stepList[0].execute_time&&datas[did].stepList[0].execute_time!=='' || this.passObj.nowEnd) {
                                        o.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                        o.executor = updUser; 
                                    }
                                    if(datas[did]&&datas[did].stepList[0].verify_time&&datas[did].stepList[0].verify_time!=='' || this.passObj.nowEnd) {
                                        o.verify_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                        o.verifier = updUser; 
                                    }
                                    console.log('now addidx=-1');
                                    
                                })
                                data.stepList = other.concat(data.stepList);
                                
                            }else {
                                data.stepList.forEach((step,sid)=>{
                                
                                    if(sid==addidx) {
                                        if(sid==data.stepList.length-1) {
                                            other.forEach((o,oid)=>{
                                                // o.seq_id = 'step_'+(this.stepitem.addidx+1+oid);
                                                if(datas[did+1]&&datas[did+1].stepList[0].execute_time&&datas[did+1].stepList[0].execute_time!=='' || this.passObj.nowEnd) {
                                                    o.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                    o.executor = updUser; 
                                                }
                                                if(datas[did+1]&&datas[did+1].stepList[0].verify_time&&datas[did+1].stepList[0].verify_time!=='' || this.passObj.nowEnd) {
                                                    o.verify_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                    o.verifier = updUser; 
                                                }
                                                console.log('sid==length');
                                                data.stepList.splice((addidx+1+oid),0,o);
                                                // data.stepList.splice((this.stepitem.addidx+1+oid),0,o);
                                            })
                                        }else {
                                            // for(let i=addidx+1;i<data.stepList.length;i++) {
                                                    other.forEach((o,oid)=>{
                                                            if(data.stepList[addidx+1]&&data.stepList[addidx+1].execute_time&&data.stepList[addidx+1].execute_time!=='' || this.passObj.nowEnd) {
                                                                o.execute_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                                o.executor = updUser; 
                                                            }
                                                            if(data.stepList[addidx+1]&&data.stepList[addidx+1].verify_time&&data.stepList[addidx+1].verify_time!=='' || this.passObj.nowEnd) {
                                                                o.verify_time = dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                                o.verifier = updUser; 
                                                            }
                                                            data.stepList.splice((addidx+1+oid),0,o);
                                                        // o.seq_id = 'step_'+(this.stepitem.addidx+1+oid);
                                                        // data.stepList.splice((this.stepitem.addidx+1+oid),0,o);
                                                    })

                                            // }
                                            console.log('sid!==length');
                                        } 
                                    }
                                
                                })
                            }
                            

                            // 給排序id因為新增會要輸入
                            data.stepList.forEach((step,sid)=>{
                                if(step.seq_id=='' || step.seq_id.split('_')[1] !== sid.toString()) {
                                    step.seq_id = 'step_'+sid;
                                }
                            })
                            // console.log('other',data);
                            this.addSubmitApi(other,data.stepList,this.stepitem.phase_id);
                        }
                        
                        
                        
                    })
                    
                    
                    
                    
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
                    console.log('step',this.stepformedit,this.stepmode);
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
                                        // this.$toast.success("修改成功", { duration: 2000 });
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
        getId() {
            let stepid=null;
            let data = [];
            let nowid = 0;
            this.mainItems.forEach(m=>{
                if(m.phase_id==this.stepitem.phase_id) {
                    data = _.cloneDeep(m.stepList);
                    m.stepList.forEach((step,sid)=>{
                        if(sid==this.stepitem.addidx) {
                            if(step.step_id) {
                                stepid=step.step_id;
                            }
                        }
                    })
                }
            })
            
            if(stepid==null) {
                for(let i=this.stepitem.addidx;i>0;i--) {
                    if(data[i].step_id) {
                        stepid = data[i].step_id;
                        break;
                    }
                }
            }
            
            this.justStep.forEach(j=>{
                if(j.phase_id==this.stepitem.phase_id) {
                    j.stepList.forEach((step,sid)=>{
                        if(step.step_id == stepid) {
                            nowid = sid;
                        }
                    })
                }
            })
            if(stepid==null&&nowid==0) {
                nowid=-1;
            }
            return nowid
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
                                    this.reviseData(datas,id);
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
            let item = 0;
            datas.forEach(async d=>{
                // if(d.phase_id==id) {
                    // d.stepList.forEach(async (step,sid)=>{
                        if(d.step_id) {
                            d.updated_user = this.$auth.$state.user.email;
                            console.log('step',d);
                            // d.seq_id = 'step_'+sid;
                            delete d.deft_executor;
                            delete d.deft_verifier;
                            delete d.execute_disabled;
                            await this.$axios
                                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/${d.step_id}/`, d)
                                    .then(res => {
                                        if(res.data=='修改成功'){
                                            item++;
                                            console.log(datas.length,item);
                                            if(item == datas.length) {
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
                            if(item == datas.length) {
                                this.$emit('getTemp');
                            }
                        }
                            
                    // })
                // }
            })
        },
        // 新增/取消 資料比對，有差異的再進行reviseCycleData
        reviseData(datas,id) {
            let apiData=[];
            let ids = [];
            console.log('revised',datas);
            this.justStep.forEach(item=>{
                if(item.phase_id==id) {
                    item.stepList.forEach(step=>{
                        ids.push(step.step_id);
                    })
                }
            }) 
            // 比對修改的資料排序id是否有更改
            datas.forEach((data,did)=>{
                data.seq_id='step_'+did;
                this.justStep.forEach(item=>{
                    if(item.phase_id==id) {
                        // console.log(id,item.stepList);
                        item.stepList.forEach(step=>{
                            if(!ids.includes(data.step_id)) {
                                ids.push(data.step_id);
                                apiData.push(data);
                            }else {
                                if(step.step_id==data.step_id) {
                                    if(step === data) {
                                        
                                    }else {
                                        console.log(step.seq_id,data.seq_id)
                                        apiData.push(data);
                                    }
                                }
                            }
                        })
                    }
                })
                
            })
            console.log('apiData',apiData,datas);
            this.reviseCycleData(apiData,id);
        },
        // 刪除其他項目
        delsubitem: async function (phase_id, index) {
            console.log('delete',phase_id, index);
            var sub_item = this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList[index];
            if(this.templatemode == 'cycleedit') {
                    if (confirm(`是否刪除 ${sub_item.step_name_ch}：${sub_item.msg} ？`)) {
                        // this.mainItems.filter(x => x.phase_id == phase_id)[0].stepList.splice(index, 1);
                        // step_id
                        if(sub_item.type==null) {
                            await this.$axios
                            .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/${sub_item.step_id}/`)
                            .then(res => {
                                if(res.data=='刪除成功'){
                                    let stepId=[]; // 刪除其他項目id要重新給定，所以要額外存取
                                    // let datas = _.cloneDeep(this.mainItems);
                                    let datas = _.cloneDeep(this.justStep);
                                    datas.forEach((item,id)=>{
                                        // stepId.push({
                                        //     "phase_id": item.phase_id,
                                        //     "phase_name_ch": item.phase_name_ch,
                                        //     "open": item.open,
                                        //     "color": item.color,
                                        //     "newest": item.newest,
                                        //     "stepList": new Array(),
                                        // })
                                        
                                        if(item.phase_id == phase_id) {
                                            let sindex = 0;
                                            item.stepList.forEach((step,sid)=>{
                                                if(sub_item.step_id!==step.step_id) {
                                                    // if(sid>index) {
                                                    //     step.seq_id = 'step_'+(sindex);
                                                    //     sindex++;
                                                    // }
                                                    stepId.push(step);
                                                }
                                            })
                                            this.reviseData(stepId,phase_id);
                                        }
                                        

                                    })
                                    // datas = stepId;
                                    // this.reviseCycleData(datas,phase_id,'delete');
                                    console.log('delete',stepId);

                                    
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
                        }else if(sub_item.type==1) {
                            await this.$axios
                            .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-record/${sub_item.id}/`)
                            .then(res => {
                                if(res.data=='刪除成功'){
                                    this.$emit('getDisease')

                                    
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
                        }else if(sub_item.type==2) {
                            await this.$axios
                            .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/water-quality-testing-record/${sub_item.id}/`)
                            .then(res => {
                                if(res.data=='刪除成功'){
                                    this.$emit('getWater')

                                    
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
        // 編輯
        editsubitem(phase_id, index) {
            // console.log("phase:", phase_id, "addidx:",addidx);
            // this.stepitem.phase_id = phase_id;
            // this.stepitem.addidx = addidx;
            let item = _.cloneDeep(this.mainItems.filter(m=>m.phase_id==phase_id)[0].stepList[index]);
            if(item.type==null) {
                this.editem = true;//show dialog
                this.addStep = [];
                this.addStep.push(item);
            }else if(item.type == 1 || item.type==2) {
                this.$emit('reportEditOpen',item);
            }
            
        },
        async submitedit() {
            let parm = _.cloneDeep(this.addStep[0]);
            var valid = this.$refs.editform.validate();
            if(valid) {
                delete parm.execute_disabled;
                delete parm.type;
                delete parm.deft_executor;
                delete parm.deft_verifier;
                delete parm.step_id;
                parm.updated_user = this.$auth.$state.user.email;
                await this.$axios
                    .patch(
                    `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/${this.addStep[0].step_id}/`,
                        parm
                    )
                    .then(res => {
                    // console.log("警示修改API:" + res.request.responseURL);
                    if (res.data == "修改成功") {
                        this.$emit('getTemp');
                        this.editem = false;
                        this.$toast.success("修改成功", { duration: 2000 });
                    } else {
                        this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
                    }
                    })
                    .catch(error => {
                    this.$toast.error("error:" + error, { duration: 2000 });
                    });
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
                        items[id].stepList[index].updated_user = this.$auth.$state.user.email;
                        this.justStep.forEach(s=>{
                            if(s.phase_id==items[id].phase_id) {
                                s.stepList.forEach(async (step,sid)=>{
                                    if(step.step_id==items[id].stepList[index].step_id) {
                                        step.execute_time = items[id].stepList[index].execute_time;
                                        step.executor =  items[id].stepList[index].executor;
                                        step.updated_user = items[id].stepList[index].updated_user;
                                        if(sid==0) {
                                            if(id-1>=0) {
                                                let statusid = this.status.filter(x=>x.name == this.justStep[id-1].phase_name_ch)[0].name;
                                                const parm = {
                                                    id: new Array(),
                                                    status: statusid
                                                };
                                                parm.id.push(this.passObj.nowId);
                                                this.$emit("compareStatus",parm);
                                            }
                                            
                                            
                                        }
                                    }
                                })
                            }
                        })
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
                        this.mainItems[id].stepList[index].updated_user = this.$auth.$state.user.email;
                        this.justStep.forEach(s=>{
                            if(s.phase_id==this.mainItems[id].phase_id) {
                                s.stepList.forEach(async (step,sid)=>{
                                    if(step.step_id==this.mainItems[id].stepList[index].step_id) {
                                        step.execute_time = this.mainItems[id].stepList[index].execute_time;
                                        step.executor = updUser;
                                        step.deft_executor = this.mainItems[id].stepList[index].deft_executor;
                                        step.updated_user = this.$auth.$state.user.emil;

                                        if(sid==0) {
                                            if(sid==0 && id!==0) {
                                                let statusid = this.status.filter(x=>x.name == this.justStep[id].phase_name_ch)[0].name;
                                                const parm = {
                                                    id: new Array(),
                                                    status: statusid,
                                                };
                                                parm.id.push(this.passObj.nowId);
                                                this.$emit("compareStatus",parm);
                                                
                                            }
                                        }
                                    }
                                })
                            }
                        })
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
                this.justStep[id].stepList.forEach(async (x,xid)=>{
                    if(this.mainItems[id].stepList[index].step_id==x.step_id) {
                        if(x.execute_time&&x.execute_time!=='' && x.verify_time=='') {
                            x.verify_time=dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                            x.verifier = updUser;
                            x.updated_user = this.$auth.$state.user.email;
                            x.deft_verifier = this.accdata.filter(x=>x.username==updUser)[0].position+'-'+this.accdata.filter(x=>x.username==updUser)[0].account_name;
                            submitData.push(x);
                            // this.updateStatus(this.mainItems[i].stepList[x]);
                        }
                        
                    }
                    
                })
                
                // submitData.push(this.mainItems[id].stepList[index]);
                // this.updateStatus(this.mainItems[id].stepList[index]);
                // 確認前面的均一起確認
                for(let i=0;i<=id;i++) {
                    if(i!==id) {
                        this.justStep[i].stepList.forEach(x=>{
                            if(x.execute_time&&x.execute_time!=='' && x.verify_time=='') {
                                x.verify_time=dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                x.verifier = updUser;
                                x.updated_user = this.$auth.$state.user.email;
                                x.deft_verifier = this.accdata.filter(x=>x.username==updUser)[0].position+'-'+this.accdata.filter(x=>x.username==updUser)[0].account_name;
                                submitData.push(x);
                                // this.updateStatus(this.mainItems[i].stepList[x]);
                            }
                        })
                    }else {
                        if(index !== 0) {
                            let nowsid = 0;
                            this.justStep[i].stepList.forEach((step,sid)=>{
                                if(this.mainItems[id].stepList[index].step_id==step.step_id) {
                                    nowsid = sid;
                                }                                
                            })
                            for(let x=0;x<nowsid;x++) {
                                    this.justStep[i].stepList.forEach(step=>{
                                        if(this.justStep[i].stepList[x].execute_time&&this.justStep[i].stepList[x].execute_time!=='' && this.justStep[i].stepList[x].verify_time=='') {
                                            if(step.step_id == this.justStep[i].stepList[x].step_id) {
                                                step.verify_time=dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                                                step.verifier = updUser;
                                                step.updated_user = this.$auth.$state.user.email;
                                                step.deft_verifier = this.accdata.filter(x=>x.username==updUser)[0].position+'-'+this.accdata.filter(x=>x.username==updUser)[0].account_name;
                                                submitData.push(this.justStep[i].stepList[x]);
                                            }
                                        }
                                        
                                    })
                                    
                                //    this.updateStatus(this.mainItems[id].stepList[index]);
                                    
                                
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
                                this.disabledData();
                            }
                            
                        }
                        
                    })
                    .catch(error => {
                        this.$toast.error("error:" + error, { duration: 2000 });
                    })
                    .finally(() => {
                    });
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
            await this.$axios
                .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/${id}/`)
                .then(res => {
                    if(res.data=='刪除成功'){
                        this.getstepdata();
                        this.stepformedit = {};
                        this.stepitem.id = undefined;
                        this.stepmode = 'add';
                        this.dialog.additem = false;
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
                    if(m.phase_name!=='空池') {
                        if(m.stepList.length>0){
                        //     var pushitem = {
                        //         step_id : 0,//項目原始id
                        //         seq_id : '',
                        //         // sort:undefined,
                        //         step_name : m.phase_name,
                        //         step_name_ch : m.phase_name,
                        //         step_exec:undefined,//執行/確認人員
                        //         checktime:undefined,//確認時間
                        //         result:undefined,//結果
                        //         msg: '',//msg
                        //     };
                        //     m.stepList.push(pushitem);
                            para.tempContent.push(m)
                        }
                        
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
                    if(m.phase_name!=='空池') {
                        if(m.stepList.length>0){
                        //     var pushitem = {
                        //         step_id : 0,//項目原始id
                        //         seq_id : '',
                        //         // sort:undefined,
                        //         step_name : m.phase_name,
                        //         step_name_ch : m.phase_name,
                        //         step_exec:undefined,//執行/確認人員
                        //         checktime:undefined,//確認時間
                        //         result:undefined,//結果
                        //         msg: '',//msg
                        //     };
                        //     m.stepList.push(pushitem);
                            para.tempContent.push(m)
                        }
                        
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
            // if(this.templatemode)
            console.log('mainItems',this.status,data,this.mainItems);
        },
        passObj: {
            handler(val){
                console.log(val)
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
                this.sortTime();
            }
            
        },
        waterReport() {
            if(this.templatemode=='cycleedit') {
                this.sortTime();
            }
            
        },
        eventReport() {
            if(this.templatemode=='cycleedit') {
                this.sortTime();
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