<template>
    <div>
        <v-overlay :value="!isLoading" :absolute="true">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card class="bg-card mb-4 pt-2">
            <div class="content pb-1">
                <!-- 搜尋列 -->
                <div class="search">
                    <v-row class="mb-0 pr-4 align-center">
                        <!-- 搜尋 -->
                        <v-col cols="6" md="3" class="pb-0 pt-1">
                            <!-- <div class="search-container">
                                <locate-select 
                                    id="search"
                                    class="select-template"
                                    :dataScope="'pool'" 
                                    defaultSelect="" 
                                    :isMulti="false"
                                    @scopeSel_data="get_scopeData($event);"></locate-select>
                            </div> -->
                            <treeselect
                                @input="changeEvent"
                                id="addpool"
                                v-model="nowPoolid"
                                :options="maindataScope"
                                :default-expand-level="1"
                                :disable-branch-nodes="true"
                                children="node"
                                placeholder="請選擇養殖池"
                                :normalizer="
                                node => {
                                    return { children: node.node };
                                }
                                "
                                class="select-template font-size-large"
                                >
                                <!-- <div slot="value-label" slot-scope="{ node }"  class="font-size-large"  v-text="node.raw.parent != undefined && node.raw.parent.length > 0 ?node.raw.parent + '_'+node.raw.name:''+node.raw.name"></div> -->
                                <div slot="value-label" slot-scope="{ node }"  class="font-size-large"  v-text="node.raw.parent != undefined && node.raw.parent.length > 0 ?node.raw.parent[node.raw.parent.length-1]=='*'?node.raw.parent.substr(0, node.raw.parent.length-1) + '_'+node.raw.name:node.raw.parent + '_'+node.raw.name:''+node.raw.name"></div>
                                <div slot="option-label" slot-scope="{ node }" v-text="getText(node)"></div>
                            </treeselect>
                        </v-col>
                        <v-btn class="btn-secondary"  @click="changePool('pre')">上一池</v-btn>
                        <v-btn class="btn-primary"  @click="changePool('next')">下一池</v-btn>
                        <v-col v-if="userData.length>0 && userData.filter(x=>x.username == $auth.$state.user.email)[0].department.filter(y=>y=='技術部').length>0" cols="12" md="3" class="flexCenter">
                            <!-- <v-btn v-if="!isDisable" class="btn-primary green"  @click="isDisable=!isDisable">測試模式</v-btn>
                            <v-btn v-else class="btn-secondary green"  @click="isDisable=!isDisable">一般模式</v-btn> -->
                            <v-switch
                                v-model="isDisable"
                                :label="`模式: ${isDisable?'測試':'一般'}`"
                                hide-details
                            ></v-switch>
                        </v-col>
                        <!-- <v-col v-if="poolData.daily&&poolData.daily[poolData.daily.length-1].todo[poolData.daily[poolData.daily.length-1].todo.length-1].execute_status!=='0'" cols="12" md="3">
                            <v-btn class="btn-primary" :class="{'disabled':!poolData.daily||poolData.daily[poolData.daily.length-1].todo[poolData.daily[poolData.daily.length-1].todo.length-1].execute_status=='0'}" @click="submitNextStep">開啟新工作</v-btn>
                        </v-col> -->
                    </v-row>
                </div>
                <div class="result pb-0" v-if="poolData.daily&&poolData.daily.length>0">
                    <div class="exe flex-align-center">
                        <span class="flex-align-center ml-2">執行階段： {{ poolData.phase_name }} - {{poolData.step_name}} <v-btn class="btn-secondary btn-small green" @click="getNextWork" style="margin-left: 8px;">檢視下一工作</v-btn></span>
                        <div class="execute flex-align-center">
                            <span class="mx-2">隱藏執行/不執行</span>
                            <v-select v-model="hiddenList" clearable multiple deletable-chips chips dense hide-details
                                    placeholder="選擇要隱藏的日期" :items="dateList" class="mt-0" max-width="200px"
                                    :disabled="dateList.length==0" @change="dataHidden">
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip v-if="index === 0">
                                            <span>{{ item }}</span>
                                        </v-chip>
                                        <span
                                            v-if="index === 1 && !hiddenList.includes('全部')"
                                            class="grey--text text-caption"
                                            >
                                            (+{{ hiddenList.length - 1 }})
                                        </span>
                                    </template>
                                </v-select>
                        </div>
                    </div>
                    
                    
                    <!-- 隱藏執行/不執行 -->
                    <!-- <v-row class="hidden flex-align-center mutiselect" style="margin: 0;margin-top: 8px;">
                        <v-col cols="12" sm="1" style="padding: 0;padding-left: 8px;">
                            <span style="margin-right: 8px;">隱藏執行/不執行</span>
                        </v-col>
                        <v-col cols="12" sm="2" style="padding: 0;padding-left: 8px;">
                            <v-select v-model="hiddenList" clearable multiple deletable-chips chips dense hide-details
                                placeholder="選擇要隱藏的日期" :items="dateList"
                                :disabled="dateList.length==0" @change="dataHidden">
                                <template v-slot:selection="{ item, index }">
                                    <v-chip v-if="index === 0">
                                        <span>{{ item }}</span>
                                    </v-chip>
                                    <span
                                        v-if="index === 1 && !hiddenList.includes('全部')"
                                        class="grey--text text-caption"
                                        >
                                        (+{{ hiddenList.length - 1 }})
                                    </span>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row> -->
                    <!-- 排程清單 -->
                    <div class="result-content mt-4">
                        <v-card class="result-card mr-4 d-flex flex-column" v-for="(item,id) in poolData.daily" :key="'date_'+id">
                            <div class="card-title mx-1 my-1 pt-0" style="cursor: default;">
                                <div class="title">
                                    <v-card-title>{{ item.scheduling_date.slice(5).replace('-','/') }}</v-card-title>
                                </div>
                                <div class="chevron flex-align-center">
                                    <v-tooltip bottom >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn class="btn-icon green" v-bind="attrs" v-on="on" @click="addEventOpen(item.scheduling_date)"><v-icon>mdi-plus</v-icon></v-btn>
                                        </template>
                                        <span>新增動作</span>
                                    </v-tooltip>
                                    
                                    <v-tooltip bottom >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn class="btn-icon" v-bind="attrs" v-on="on" @click="delayAllOpen(item)"><v-icon>mdi-timeline-clock-outline</v-icon></v-btn>
                                        </template>
                                        <span v-if="item.scheduling_date">指定{{item.scheduling_date.slice(5).replace('-','/')}}之後未執行的所有動作的移動天數</span>
                                    </v-tooltip>
                                    <v-tooltip bottom >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn class="btn-icon clear" v-bind="attrs" v-on="on" @click="copyAllOpen(item)"><v-icon>mdi-content-copy</v-icon></v-btn>
                                        </template>
                                        <span v-if="item.scheduling_date">一鍵複製</span>
                                    </v-tooltip>
                                </div>
                            </div>
                            <div class="daily-content">
                                <div class="daily-check mx-3 my-1 mb-2 px-1 py-1" v-for="(daily,did) in item.todo" :key="'daily_'+daily.id+'_'+did">
                                    <div class="check-title mx-2 my-2 mt-0">
                                        <div class="title" style="max-width: 50%;">
                                            <v-card-title>{{ daily.action_name }}</v-card-title>
                                        </div>
                                        <div class="chrevon">
                                            <span v-if="daily.execute_status=='0'" class="delay" @click="openDelay(daily,item.scheduling_date,did,true)">指定</span>
                                            <span v-if="daily.execute_status=='0'" class="delay copy" @click="openDelay(daily,item.scheduling_date,did,false)">複製</span>
                                            <span v-else-if="daily.execute_status=='1'">已執行</span>
                                            <span v-else class="error-text">不執行</span>
                                            <v-tooltip bottom v-if="daily.execute_status=='1'||daily.execute_status=='2'">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <button class="btn-icon" @click="openEdit(daily,item.scheduling_date)" v-bind="attrs" v-on="on">
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </button>
                                                </template>
                                                <span>修改</span>
                                            </v-tooltip>
                                            <v-tooltip bottom v-if="daily.log.length>0">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <button class="btn-icon-secondary" @click="openLog(daily.action_name,daily.log)" v-bind="attrs" v-on="on">
                                                        <v-icon>mdi-clipboard-search-outline</v-icon>
                                                    </button>
                                                </template>
                                                <span>動作資訊</span>
                                            </v-tooltip>
                                        </div>
                                    </div>
                                    <div class="description mx-2 my-2 ml-3">
                                        {{daily.action_remark}}
                                    </div>
                                    <div class="content mt-1 pt-2">
                                        <div class="remark">
                                            {{ daily.msg }}
                                        </div>
                                        <div class="excute" v-if="daily.execute_status!=='0'">
                                            <div class="date d-inline-block">
                                                {{ daily.execute_time.slice(0,16) }}
                                            </div>
                                            <div class="excutor d-inline-block">
                                                {{ daily.executor_name }}
                                            </div>
                                        </div>
                                        <div v-if="daily.execute_status=='0'" class="action flex-align-center">
                                            <v-btn class="btn-primary btn-small" :class="{'disabled':new Date(item.scheduling_date).getTime()>new Date().getTime()&&!isDisable||!isLoading}" @click="openEdit(daily,item.scheduling_date,1)">執行</v-btn>
                                            <v-btn class="btn-secondary btn-small" :class="{'disabled':new Date(item.scheduling_date).getTime()>new Date().getTime()&&!isDisable||!isLoading}" @click="openEdit(daily,item.scheduling_date,2)">不執行</v-btn>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <button class="btn-icon-secondary delete" :class="{'disabled':new Date(item.scheduling_date).getTime()>new Date().getTime()&&!isDisable||!isLoading}" @click="openEdit(daily,item.scheduling_date,3)" v-bind="attrs" v-on="on">
                                                        <v-icon>mdi-timer-pause-outline</v-icon>
                                                    </button>
                                                </template>
                                                <span>此動作之後均不執行</span>
                                            </v-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </div>
                    
                </div>
                <div class="result px-2 py-2" v-else style="overflow-x: hidden;">
                    <div class="result-content mt-4">
                        <v-card class="result-card d-flex flex-column flex-all-center" style="width: 100%;height: 74vh;">
                            無資料
                        </v-card>
                    </div>
                </div>
            </div>
        </v-card>
        <!-- 編輯 -->
        <v-dialog v-model="editDialog" max-width="500px">
            <v-overlay :value="!dialogLoading" :absolute="true">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-form ref="editform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title">
                        <div class="d-inline-block" style="max-width: 80%;">
                            <span>{{editItem.num==3?nowDaily.slice(5).replace('-','/')+'之後的「'+editItem.action_name+'」(所有相同名稱的動作) 均不執行':'執行編修'}}</span> 
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
                        <div v-if="editItem.num!==3" class="card-title flex-column cursor-pointer">
                            <div class="title"><v-card-title>執行狀態</v-card-title></div>
                            <div class="title flex-align-center" v-if="editItem.execute_status!=='0'">
                                <span class="mr-2" style="font-size: 14px">{{ editItem.execute_status=='1'?'已執行':'不執行' }}</span>
                                <v-btn  class="btn-secondary btn-small delete" @click="editItem.execute_status = '0';editItem.msg=''">取消</v-btn>
                            </div>
                            <div class="title" v-else>
                                <v-btn class="btn-primary btn-small" @click="editItem.execute_status='1'">執行</v-btn>
                                <v-btn class="btn-secondary btn-small" @click="editItem.execute_status='2'">不執行</v-btn>
                            </div>
                        </div>
                        <!-- 財務 -->
                        <!-- <v-card-text style="display: flex;align-items: center;padding: 0;">
                            <div class="card-title flex-align-start" style="cursor: pointer;flex-direction: column;width: 100%;">
                                <div class="title">
                                    <v-card-title>實際花費的人力 </v-card-title>
                                    <v-text-field v-model.number="editItem.actual_member" type="number" label="花費的人力" autocomplete="off" min="0" hide-details style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="card-title flex-align-start" style="cursor: pointer;flex-direction: column;width: 100%;">
                                <div class="title">
                                    <v-card-title>實際花費的金錢 </v-card-title>
                                    <v-text-field v-model.number="editItem.actual_spend" type="number" label="花費的金錢" autocomplete="off" min="0" hide-details style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                                    </v-text-field>
                                </div>
                            </div>
                        </v-card-text> -->
                        
                        <div class="card-title flex-align-start flex-column cursor-pointer">
                            <div class="title"><v-card-title>說明 <span v-if="editItem.execute_status=='2'" class="error-text ml-1">*{{editItem.num==3?'':'不執行'}}請填入原因</span></v-card-title></div>
                            <!-- <v-text-field v-model="editItem.action_remark" label="說明" autocomplete="off" style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                            </v-text-field> -->
                            <v-textarea v-model="editItem.msg" class="full-width" hide-details filled clearable placeholder="說明..."></v-textarea>
                        </div>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="editDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" :class="{'disabled':(editItem.execute_status=='2'&&editItem.msg=='')}" @click="submitEdit">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 延期執行 -->
        <v-dialog v-model="delayDialog" max-width="500px">
            <v-overlay :value="!dialogLoading" :absolute="true">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-form ref="delayform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title">
                        <div class="d-inline-block">
                            <span>{{ isDelay?'指定:':'複製:' }} {{ delayItem.action_name }}</span> 
                        </div>
                        <div class="add">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="delayDialog = false;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <div class="card-title flex-column flex-align-start cursor-pointer">
                            <div class="title"><v-card-title>{{ isDelay?'指定':'複製' }}至哪天執行?</v-card-title></div>
                            <div class="calendar full-width">
                                <span class="pa-0 ma-0" slot="prepend"><v-btn class="btn-icon just-icon"><v-icon style="font-size: 1.25rem;" @click="() => (delayDate = getNowDate())">mdi-calendar</v-icon></v-btn></span>
                                <v-menu v-model="menu_inspecteddate" :close-on-content-click="false" :nudge-right="40" 
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="delayDate" class="mt-0" clearable readonly dense :rules="rules.require" full-width
                                            v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="delayDate" locale="zh-tw" no-title @input="
                                    menu_inspecteddate = false;
                                    "></v-date-picker>
                                </v-menu>
                            </div>
                            
                        </div>
                        <div class="card-title flex-align-start flex-column cursor-pointer">
                            <div class="title"><v-card-title>{{ isDelay?'指定':'複製' }}原因 </v-card-title></div>
                            <v-text-field v-model="delayItem.operation_reason" label="原因" autocomplete="off" class="mr-1 mt-1 pt-0 full-width">
                            </v-text-field>
                        </div>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="delayDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" :class="{'disabled':(delayDate==null)}" @click="submitDelay">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 新增 -->
        <v-dialog v-model="addDialog" max-width="500px">
            <v-overlay :value="!dialogLoading" :absolute="true">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-form ref="addform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title">
                        <div class="d-inline-block">
                            <span>新增動作</span> 
                        </div>
                        <div class="add">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="addDialog = false;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <!-- <div class="basic" style="display: flex;align-items: center;">
                        <v-card-text style="display: flex;align-items: center;padding: 8px 16px;">
                            <v-autocomplete v-model="addItem.action_id" dense filled :items="stepdata" item-text="name_ch"
                                    item-value="id" @change="actionInputShow = false"></v-autocomplete>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn slot="append-outer" class="btn-icon green" @click="showstep()" v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
                                </template>
                                <span>新增動作</span>
                            </v-tooltip>
                        </v-card-text>
                        
                    </div> -->
                    <div class="basic">
                        <div class="card-title flex-align-start flex-column cursor-pointer">
                            <div v-if="!actionInputShow" class="title"><v-card-title>動作名稱 </v-card-title></div>
                            <div v-if="!actionInputShow" class="content flex-align-center full-width">
                                <v-text-field v-model="addItem.name_ch" label="名稱" autocomplete="off" :rules="rules.require" class="mr-1 mt-1 pt-0 full-width" style="flex:1">
                                </v-text-field>
                                <v-btn class="btn-secondary btn-small" @click="actionInputShow=true">帶入</v-btn>
                            </div>
                            <div v-if="actionInputShow" class="title"><v-card-title>選擇帶入的動作 </v-card-title></div>
                            <div v-if="actionInputShow" class="content flex-align-center full-width">
                                <v-autocomplete v-model="addItem.name_ch" dense filled :items="stepdata" item-text="name_ch"
                                    item-value="name_ch" :rules="rules.require" class="full-width"></v-autocomplete>
                                <v-btn class="btn-secondary btn-small" @click="actionInputShow=false;addItem.name_ch=''">取消</v-btn>
                            </div>
                            
                        </div>
                        <!-- <div class="card-title flex-align-start" style="cursor: pointer;flex-direction: column;">
                            <div class="title"><v-card-title>動作名稱(英文) </v-card-title></div>
                            <v-text-field v-model="addItem.name_en" label="名稱" autocomplete="off" :rules="rules.require" style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                            </v-text-field>
                        </div> -->
                        <v-card-text class="flex-align-center px-0 py-0">
                            <div class="card-title flex-align-start flex-column cursor-pointer">
                                <div class="title"><v-card-title>起始日</v-card-title></div>
                                <div class="calendar">
                                    <span class="pa-0 ma-0" slot="prepend"><v-btn class="btn-icon just-icon"><v-icon style="font-size: 1.25rem;" @click="() => (addItem.start_date = getNowDate())">mdi-calendar</v-icon></v-btn></span>
                                    <v-menu v-model="startdate" :close-on-content-click="false" :nudge-right="40" 
                                        transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="addItem.start_date" class="mt-0" clearable readonly dense :rules="rules.require"
                                                v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="addItem.start_date" :min="poolData.daily?poolData.daily[0].scheduling_date:getNowDate()" :max="addItem.end_date" locale="zh-tw" no-title @input="
                                        startdate = false;
                                        "></v-date-picker>
                                    </v-menu>
                                </div>
                                
                            </div>
                            <div class="card-title flex-align-start flex-column cursor-pointer">
                                <div class="title"><v-card-title>持續至</v-card-title></div>
                                <div class="calendar">
                                    <span class="pa-0 ma-0" slot="prepend"><v-btn class="btn-icon just-icon"><v-icon style="font-size: 1.25rem;" @click="() => (addItem.end_date = getNowDate())">mdi-calendar</v-icon></v-btn></span>
                                    <v-menu v-model="enddate" :close-on-content-click="false" :nudge-right="40" 
                                        transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="addItem.end_date" class="mt-0" clearable readonly dense :rules="rules.require"
                                                v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="addItem.end_date" :min="addItem.start_date||getNowDate()"  locale="zh-tw" no-title @input="
                                        enddate = false;
                                        "></v-date-picker>
                                    </v-menu>
                                </div>
                                
                            </div>
                            
                        </v-card-text>
                        <!-- 財務 -->
                        <!-- <v-card-text style="display: flex;align-items: center;padding: 0;">
                            <div class="card-title flex-align-start" style="cursor: pointer;flex-direction: column;width: 100%;">
                                <div class="title">
                                    <v-card-title>預估花費的人力 </v-card-title>
                                    <v-text-field v-model.number="addItem.estimated_member" type="number" label="花費的人力" autocomplete="off" min="0" hide-details style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="card-title flex-align-start" style="cursor: pointer;flex-direction: column;width: 100%;">
                                <div class="title">
                                    <v-card-title>預估花費的金錢 </v-card-title>
                                    <v-text-field v-model.number="addItem.estimated_spend" type="number" label="花費的金錢" autocomplete="off" min="0" hide-details style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                                    </v-text-field>
                                </div>
                            </div>
                        </v-card-text> -->
                        <div class="card-title flex-align-start flex-column cursor-pointer">
                            <div class="title"><v-card-title>備註 </v-card-title></div>
                            <v-text-field v-model="addItem.remark" class="pt-0 full-width" filled dense  label="備註" clearable></v-text-field>
                            <!-- <v-text-field v-model="editItem.action_remark" label="說明" autocomplete="off" style="margin-right: 4px;padding-top: 0;width: 100%;margin-top: 4px;">
                            </v-text-field> -->
                            <!-- <v-textarea v-model="addItem.action_remark" hide-details filled clearable placeholder="備註..." style="width: 100%;"></v-textarea> -->
                        </div>
                        <div class="card-title flex-align-start flex-column cursor-pointer">
                            <div class="title"><v-card-title>新增原因 </v-card-title></div>
                            <v-text-field v-model="addItem.operation_reason" label="原因" autocomplete="off" class="mr-1 mt-1 pt-0 full-width">
                            </v-text-field>
                        </div>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="addDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" :class="{'disabled':(addItem.name_ch==''||addItem.start_date==null||addItem.end_date==null)}" @click="submitAdd">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 開啟下一階段 -->
        <v-dialog v-model="nextStepDialog" max-width="500px">
            <v-card class="custom-dialog">
                <v-card-title class="add-title" style="border-bottom: none;">
                    <div class="d-inline-block">
                        <span></span> 
                    </div>
                    <!-- <div class="add" style="float: right;display: inline-block;">
                        <v-btn class="btn-secondary close"
                                title="取消" 
                                @click="delayDialog = false;">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div> -->
                </v-card-title>
                <div class="basic">
                    <div class="card-title flex-align-start flex-column cursor-pointer">
                        <div class="title"><v-card-title>已完成目前工作項，按下確認開啟隔天新的工作項</v-card-title></div>
                    </div>
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="btn-primary" @click="nextStepDialog=false;searchPool();">確認</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- 指定全部 -->
        <v-dialog v-model="delayAllDialog" max-width="500px">
            <v-overlay :value="!dialogLoading" :absolute="true">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-form ref="delayAllform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title">
                        <div class="d-inline-block">
                            <span v-if="delayAll.scheduling_date">指定{{delayAll.scheduling_date.slice(5).replace('-','/')}}之後未執行的所有動作</span> 
                        </div>
                        <div class="add">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="delayAllDialog = false;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <div class="card-title flex-align-start flex-column cursor-pointer">
                            <div class="title"><v-card-title>指定天數</v-card-title></div>
                            <div class="calendar full-width">
                                <v-text-field
                                    v-model.number="delayAll.delay_day"
                                    type="number" dense hide-details
                                    class="mt-0"
                                    @change="changeDelayDay"><span class="pa-0 ma-0"
                                    slot="append">天</span></v-text-field>
                                <span style="margin-left: 8px;">(指定至{{nowChangeData}})</span>
                            </div>
                            
                        </div>
                        <div class="card-title flex-align-start flex-column cursor-pointer">
                            <div class="title"><v-card-title>指定原因 </v-card-title></div>
                            <v-text-field v-model="delayAll.operation_reason" label="原因" autocomplete="off" class="mr-1 mt-1 pt-0 full-width">
                            </v-text-field>
                        </div>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="delayAllDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" :class="{'disabled':(delayAll.delay_day==0)}" @click="submitDelayAll">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 檢視下一工作 -->
        <v-dialog v-model="nextWorkDialog" max-width="500px">
            <v-form ref="delayAllform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title">
                        <div class="d-inline-block">
                            <span>下一工作</span> 
                        </div>
                        <div class="add">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="nextWorkDialog = false;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <div v-if="nextWork.length>0" class="card-title flex-align-start flex-column cursor-pointer">
                            <!-- <div class="title" v-for="(action,id) in nextWork" :key="'next_action_'+id">
                                {{ action }}
                            </div> -->
                            <v-row class="border-bottom flex-align-center full-width">
                                <v-col cols="3"><span style="font-weight:bold">動作</span></v-col>
                                <v-col cols="3"><span style="font-weight:bold">第幾天開始執行</span></v-col>
                                <v-col cols="3"><span style="font-weight:bold">持續執行至第幾天</span></v-col>
                                <v-col cols="3"><span style="font-weight:bold">說明</span></v-col>
                            </v-row>
                            <v-row class="content border-bottom flex-align-center full-width" v-for="(action,id) in nextWork" :key="'next_action_'+id">
                                <v-col cols="3"><span>{{ action.name_ch }}</span></v-col>
                                <v-col cols="3"><span>Day {{action.start_on_which_day}}<br/></span></v-col>
                                <v-col cols="3"><span>Day {{action.end_on_which_day}}<br/></span></v-col>
                                <v-col cols="3"><span>{{action.remark}}<br/></span></v-col>
                            </v-row>
                        </div>
                        <div v-else class="card-title flex-align-start flex-column pt-2" style="width:200px;">無資料</div>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="btn-primary" @click="nextWorkDialog=false">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 動作資訊(log) -->
        <v-dialog v-model="logDialog" max-width="500px">
            <v-form ref="delayAllform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title">
                        <div class="d-inline-block">
                            <span>{{logData.action_name}}資訊</span> 
                        </div>
                        <div class="add">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="logDialog = false;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <div v-if="logData.log.length>0" class="card-title flex-align-start flex-column cursor-pointer">
                            <!-- <div class="title" v-for="(action,id) in nextWork" :key="'next_action_'+id">
                                {{ action }}
                            </div> -->
                            <v-row class="border-bottom flex-align-center full-width">
                                <v-col cols="3"><span style="font-weight:bold">動作</span></v-col>
                                <v-col cols="3"><span style="font-weight:bold">原因</span></v-col>
                                <v-col cols="3"><span style="font-weight:bold">時間</span></v-col>
                                <v-col cols="3"><span style="font-weight:bold">人員</span></v-col>
                            </v-row>
                            <v-row class="content border-bottom flex-align-center full-width" v-for="(action,id) in logData.log" :key="'log_'+id">
                                <v-col cols="3"><span>{{ action.operation=='rescheduled'?'指定':action.operation=='copy'?'複製':'新增' }}</span></v-col>
                                <v-col cols="3"><span>{{action.operation_reason}}<br/></span></v-col>
                                <v-col cols="3"><span>{{action.operation_time}}<br/></span></v-col>
                                <v-col cols="3"><span>{{action.operator}}<br/></span></v-col>
                            </v-row>
                        </div>
                        <div v-else class="card-title flex-align-start flex-column pt-2" style="width:200px;">無資料</div>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="btn-primary" @click="logDialog = false;">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <!-- 一鍵複製 -->
        <v-dialog v-model="copyDialog" max-width="500px">
            <v-form ref="copyAllform">
                <v-card class="custom-dialog">
                    <v-card-title class="add-title">
                        <div class="d-inline-block">
                            <span>一鍵複製</span> 
                        </div>
                        <div class="add">
                            <v-btn class="btn-secondary close"
                                    title="取消" 
                                    @click="copyDialog = false;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>
                    <div class="basic">
                        <div class="card-title flex-align-start flex-column cursor-pointer">
                            <div class="title"><v-card-title>複製至哪天執行?</v-card-title></div>
                            <div class="calendar full-width">
                                <span class="pa-0 ma-0" slot="prepend"><v-btn class="btn-icon just-icon"><v-icon style="font-size: 1.25rem;" @click="() => (delayDate = getNowDate())">mdi-calendar</v-icon></v-btn></span>
                                <v-menu v-model="copy_inspecteddate" :close-on-content-click="false" :nudge-right="40" 
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="copyCheckData.date" class="mt-0" clearable readonly dense :rules="rules.require"
                                            v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="copyCheckData.date" locale="zh-tw" no-title @input="
                                    copy_inspecteddate = false;
                                    "></v-date-picker>
                                </v-menu>
                            </div>
                            
                        </div>
                        <div class="card-title flex-align-start flex-column cursor-pointer">
                            <div class="title"><v-card-title>原因 </v-card-title></div>
                            <v-text-field v-model="copyCheckData.operation_reason" label="原因" autocomplete="off" class="mr-1 mt-1 pt-0 full-width">
                            </v-text-field>
                        </div>
                        <div class="card-title flex-align-start flex-column cursor-pointer" style="max-height: 200px;overflow-y: scroll;">
                            <div class="title flex-align-center"><v-card-title>選擇要複製的動作 </v-card-title> <v-checkbox v-model="checkAll" label="全選" hide-details class="mt-0 ml-2" @change="changeCopy()"></v-checkbox></div>
                            <div class="copy_list px-1 py-1 border-bottom full-width" v-for="(copy,id) in copyList" :key="'copy_'+id">
                                <v-checkbox v-model="copy.checked" :label="`${copy.action_name+(copy.action_remark!==''?'：':'')}`" hide-details class="mt-0" @change="changeCopy(copy.action_id)"></v-checkbox>
                                <span v-if="copy.action_remark!==''" class="ml-8" @click="changeCopy(copy.action_id)">{{ (copy.action_remark!==''?copy.action_remark:'') }}</span>
                            </div>
                        </div>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="btn-secondary" @click="copyDialog=false">取消</v-btn>
                        <v-btn class="btn-primary" :class="{'disabled':(copyCheckData.date==null||copyCheckData.list.length==0)}" @click="submitCopy">確認</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    layout: "emptynologin2",
    middleware: "auth",
    head(){
        return {
            title:"DailyCheck",
            }
    },
    data() {
        return {
            poolData:{},
            editDialog: false,
            delayDialog: false,
            addDialog: false,
            editItem:{},
            nowPoolid: null,
            nowDaily: null,
            accdata:[],
            delayItem:{},
            delayDate:'',
            menu_inspecteddate:false,
            startdate:false,
            enddate:false,
            addItem:{},
            isDelay:true, // true=延遲 false=複製
            rules: {
                require: [v => !!v || "*必要項目"],
            },
            nextStepDialog: false, // 開啟下一階段
            stepdata:[],
            actionInputShow:false,
            userData:[],
            isDisable:false,
            isLoading: false,
            delayAll:{daily_check_ids:[],delay_day:0},
            delayAllDialog: false,
            addPoolData:[],
            nextWorkDialog: false,
            nextWork:[],
            logData:{action_name:'',log:[]},
            logDialog: false,
            nowChangeData: new Date(),
            dialogLoading:true,
            nonExecute:[],
            hiddenList:[],
            hiddenListOld:[],
            dateList:[],
            poolDataAll:{},
            copyDialog: false,
            copyCheckData: {list:[]},
            copyList: [],
            checkAll: false,
            copy_inspecteddate:false,
        }
    },
    async created() {
        await this._pageCheck(); //驗證頁面是否可檢視
        // await this.getAllUser();
        this.getaccList();//取得所有帳號，比對執行者用
        this.getstepdata();
        await this.getSelectPoolData(); //取得非空池的池
        
        
    },
    methods: {
        // 取得所有帳號
        getaccList: async function() {
            let getuserData = await this.getUserList();
            this.userData = typeof (getuserData)=='string'?[]:getuserData;
            this.userData = this.userData.filter(x=>x.is_active==true);
            var data = Array.isArray(getuserData)?getuserData:[];
            var mydata = data.filter(x=>x.is_active == true).map(x=>({username:x.username,id:x.id,account_name:x.account_name,position:x.position[0]?.department}));//只要正常啟用帳號
            this.accdata = Object.assign([],mydata.filter(x=>x.id!==1));//排除特殊人物
        },
        // 取得非空池的池
        async getSelectPoolData() {
            let getArchitecture = await this.getArchitecture(null,true); //空池資料
            let getArchitectureAll = await this.getArchitecture(null); // 所有資料
            let data = typeof (getArchitecture)=='string'?[]:getArchitecture;
            let dataAll = typeof (getArchitectureAll)=='string'?[]:getArchitectureAll;
            let mainData = [];
            let nullDataid = [];
            if(localStorage.getItem('factory_id')) {
                // console.log('locoal',localStorage.getItem('factory_id'))
                let factory_id = JSON.parse(localStorage.getItem('factory_id'));
                // 取出所有空池id
                data.forEach(factory=>{
                    factory_id.forEach(f=>{
                        if(factory.id==f) {
                            // mainData.push(factory);
                            factory.node.forEach(n=>{
                                n.node.forEach(n2=>{
                                    if(!nullDataid.includes(n2.id)) {
                                        nullDataid.push(n2.id);
                                    }
                                    
                                })
                            })
                        }
                    })
                })
                // console.log('null',nullDataid);
                // 比對非空池資料且池visible=true
                dataAll.forEach((f,fid)=>{
                    let factoryData = _.cloneDeep(f);
                    f.node.forEach((n,nid)=>{
                        factoryData.node[nid].node = new Array();
                        let nodeData=[];
                        n.node.forEach(n2=>{
                            if(!nullDataid.includes(n2.id)&&n2.visible) {
                                nodeData.push(n2);
                            }
                        })
                        factoryData.node[nid].node = _.cloneDeep(nodeData);
                    })
                    mainData.push(factoryData);
                })
                
            }
            // 取得當日還有未執行的池
            this.nonExecute = [];
            // for(let i=0;i<Math.floor(Math.random()*(10-1+1))+1;i++) {
            //     this.nonExecute.push(Math.floor(Math.random()*(100-1+1))+1)
            // }
            // console.log('non-execute',this.nonExecute);

            // 將空陣列去除
            let pooldata = [];
            mainData.forEach((main,mid)=>{
                let data = _.cloneDeep(main);
                pooldata.push(data);
                pooldata[mid].node = [];
                let subdata = [];
                main.node.forEach(sub=>{
                    if(sub.node.length>0) {
                        subdata.push(sub);
                    }
                })
                pooldata[mid].node = subdata;
            })
            // 當日未執行的場區池名稱+'*'
            let endpool = pooldata.filter(x=>x.node.length!==0);
            endpool.forEach(main=>{
                main.node.forEach(sub=>{
                    sub.node.forEach(x=>{
                        if(this.nonExecute.includes(x.id)&&x.visible) {
                            if(sub.name[sub.name.length-1]!=='*') {
                                sub.name+='*';
                            }
                            if(main.name[main.name.length-1]!=='*') {
                                main.name+='*';
                            }
                        }
                    })
                })
            })
            this.addPoolData = this.setNestedDisabled(_.cloneDeep(endpool), "");
            
            this.isLoading = true;
            
        },
        changePool(type) {
            let ids = [0,0,0];
            this.maindataScope.forEach((main,mid)=>{
                main.node.forEach((sub,sid)=>{
                    sub.node.forEach((child,cid)=>{
                        if(child.id==this.nowPoolid) {
                            ids[2] = cid;
                            ids[1] = sid;
                            ids[0] = mid;
                        }
                    })
                })
            })
            if(type == 'pre') {
                if(ids[2]==0) {
                    if(ids[1]==0) {
                        if(ids[0]==0) {
                            this.nowPoolid = this.maindataScope[this.maindataScope.length-1].node[this.maindataScope[this.maindataScope.length-1].node.length-1].node[this.maindataScope[this.maindataScope.length-1].node[this.maindataScope[this.maindataScope.length-1].node.length-1].node.length-1].id;
                        }else {
                            if((ids[1]-1)>=0) {
                                this.nowPoolid = this.maindataScope[ids[0]].node[ids[1]-1].node[(this.maindataScope[ids[0]].node[ids[1]-1].node.length)-1].id;
                            }else {
                                this.nowPoolid = this.maindataScope[ids[0]-1].node[this.maindataScope[ids[0]-1].node.length-1].node[this.maindataScope[ids[0]-1].node[this.maindataScope[ids[0]-1].node.length-1].node.length-1].id;
                            }
                            
                        }
                    }else {
                        this.nowPoolid = this.maindataScope[ids[0]].node[ids[1]-1].node[(this.maindataScope[ids[0]].node[ids[1]-1].node.length)-1].id;
                    }
                }else {
                    this.nowPoolid = this.maindataScope[ids[0]].node[ids[1]].node[ids[2]-1].id;
                }
            }else {
                if(ids[2]==this.maindataScope[ids[0]].node[ids[1]].node.length-1) {
                    if(ids[1]==this.maindataScope[ids[0]].node.length-1) {
                        if(ids[0]==this.maindataScope.length-1) {
                            this.nowPoolid = this.maindataScope[0].node[0].node[0].id;
                        }else {
                            this.nowPoolid = this.maindataScope[ids[0]+1].node[0].node[0].id
                        }
                    }else { 
                        this.nowPoolid = this.maindataScope[ids[0]].node[ids[1]+1].node[0].id;
                    }
                }else {
                    this.nowPoolid = this.maindataScope[ids[0]].node[ids[1]].node[ids[2]+1].id;
                }
            }
        },
        getText(node) {
            // console.log('node',node);
            let label = node.raw.name;
            if(this.nonExecute.includes(node.raw.id)) {
                label+='*'
            }
            return label;
            // return node.raw.parent != undefined && node.raw.parent.length > 0 ?node.level==2?node.raw.name+'_'+node.raw.id:node.raw.name:node.raw.name;
        },
        get_scopeData:function(evt){
            this.isLoading = false;
            // console.log(evt);
            this.nowPoolid = evt;
            this.searchPool();
        },
        // 取得池dailycheck
        async searchPool() {
            // this.poolData = {
            //     status: '養殖審核',
            //     daily:[{
            //             date: dayjs( new Date()).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 1111,
            //                 item: '訂苗',
            //                 execute: 1,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss"),
            //                 remark: '聯絡廠商確定送苗時間',
            //                 executor: 'shihya.hsu@idwater.com.tw',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 2222,
            //                 item: '訂飼料',
            //                 execute: 2,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss"),
            //                 remark: '聯絡廠商下單',
            //                 executor: 'shihya.hsu@idwater.com.tw',
            //                 executor_name: '',
            //                 msg:'飼料還有剩',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 3333,
            //                 item: '訂砂糖',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 4444,
            //                 item: '訂海波',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 5555,
            //                 item: '訂尿素',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 6666,
            //                 item: '訂次氯酸鈣',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             }]
            //         },{
            //             date: dayjs(new Date().getTime()+1000*60*60*24).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 7777,
            //                 item: '訂葵四',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 8888,
            //                 item: '訂弧立滅',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },]
            //         },{
            //             date: dayjs(new Date().getTime()+1000*60*60*24*2).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 9999,
            //                 item: '訂粉料',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 11111,
            //                 item: '訂0號料',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 22222,
            //                 item: '訂1號料',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },]
            //         },{
            //             date: dayjs(new Date().getTime()+1000*60*60*24*3).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 33333,
            //                 item: '訂紅料',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 44444,
            //                 item: '訂砂糖',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },]
            //         },{
            //             date: dayjs(new Date().getTime()+1000*60*60*24*4).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 55555,
            //                 item: '訂xxx',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 66666,
            //                 item: '訂yyy',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },]
            //         },{
            //             date: dayjs(new Date().getTime()+1000*60*60*24*5).format("YYYY-MM-DD"),
            //             todo:[{
            //                 id: 1234,
            //                 item: '訂aaa',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },{
            //                 id: 5678,
            //                 item: '訂bbb',
            //                 execute: 0,// 0 尚未選擇,1 執行,2 不執行,
            //                 execute_time: '',
            //                 remark: '聯絡廠商下單',
            //                 executor: '',
            //                 executor_name: '',
            //                 msg:'',
            //                 actual_member: 0,
            //                 actual_spend:0
            //             },]
            //         }]
            // }
            this.isLoading = false;
            this.hiddenList = [];
            this.dateList = [];
            let param={pond_id:this.nowPoolid}
            let getDailyCheckList = await this.getDailyCheckList(param);
            let data = typeof (getDailyCheckList)=='string'?[]:getDailyCheckList;
            this.poolDataAll = _.cloneDeep(data);
            if(this.poolDataAll.daily) {
                this.poolDataAll.daily.forEach(d=>{
                    // if(new Date(d.scheduling_date).getTime()<=new Date().getTime()){
                        this.dateList.push(dayjs(new Date(d.scheduling_date)).format("MM/DD"));
                    // }
                    // if(dayjs(new Date(d.scheduling_date)).format("YYYY-MM-DD")==dayjs(new Date()).format("YYYY-MM-DD")) {
                        // 排序
                        let array1=[];
                        let array2=[];
                        d.todo.forEach(x=>{
                            if(x.execute_time&&x.execute_time!=='') {
                                array1.push(x);
                                // if(new Date(d.scheduling_date).getTime()>new Date().getTime()){
                                //     if(!this.dateList.includes(dayjs(new Date(d.scheduling_date)).format("MM/DD"))) {
                                //         this.dateList.push(dayjs(new Date(d.scheduling_date)).format("MM/DD"));
                                //     }
                                // }
                                
                            }else {
                                array2.push(x);
                            }
                        })
                        array1.sort((a,b)=>{
                            return new Date(a.execute_time) - new Date(b.execute_time)
                        });
                        d.todo = [...array2,...array1];
                    // }
                })
                if(this.dateList.length>0) {
                    this.dateList.unshift('全部');
                }
            }
            this.poolData = _.cloneDeep(this.poolDataAll);
            this.isLoading = true;
            

        },
        openEdit(item,date,num=0) {
            // 0 尚未選擇,1 執行,2 不執行,
            console.log('open',item);
            this.editItem = _.cloneDeep(item);
            this.nowDaily = date;
            this.editItem.num = num;
            if(this.editItem.actual_member>0){}else {
                this.editItem.actual_member=0;
            }
            if(this.editItem.actual_spend>0) {}else{
                this.editItem.actual_spend=0;
            }
            if(num==1||num==2) {
                this.editItem.execute_status = num;
            }else {
                this.editItem.execute_status = 2;
            }
            this.editItem.execute_status = this.editItem.execute_status.toString();
            if(this.editItem.executor==''||this.editItem.executor==null) {
                if(num!==1) {
                    this.editDialog = true;
                }else {
                    this.submitEdit();
                }
            }else {
                this.editDialog = true;
            }
            // 財務
            // this.editDialog = true;
        },
        async submitEdit() {
            console.log('submit edit',this.editItem);
            var valid = this.$refs.editform?.validate();
            if(valid||this.editItem.execute_status=='1') {
                this.dialogLoading = false;
                this.editItem.execute_time = this.editItem.execute_status=='0'?null:dayjs( new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.editItem.executor = this.editItem.execute_status=='0'?'':this.$auth.$state.user.email;
                this.editItem.msg = this.editItem.execute_status=='0'?'':this.editItem.msg;
                let parm = _.cloneDeep(this.editItem);
                parm.scheduling_date = this.nowDaily;
                parm.updated_user = this.$auth.$state.user.email;
                delete parm.num;
                delete parm.id;
                console.log('parm',parm);
                this.isLoading = false;
                var res = false;
                let num = 0;
                let x = 0;
                if(this.editItem.num!==3) {
                    res = await this.patchDailyCheckList(parm,this.editItem.id);
                    setTimeout(()=>{
                        this.isSubmit();
                    },50);
                }else {
                    this.poolData.daily.forEach(d=>{
                        if(new Date(d.scheduling_date).getTime()>=new Date(this.nowDaily).getTime()) {
                            d.todo.forEach(async t=>{
                                if(t.action_id==this.editItem.action_id&&t.execute_status==0) {
                                    num++;
                                }
                            })
                        }
                    })
                    this.poolData.daily.forEach(d=>{
                        if(new Date(d.scheduling_date).getTime()>=new Date(this.nowDaily).getTime()) {
                            d.todo.forEach(async t=>{
                                if(t.action_id==this.editItem.action_id&&t.execute_status==0) {
                                    parm.scheduling_date = d.scheduling_date;
                                    res = await this.patchDailyCheckList(parm,t.id);
                                    setTimeout(()=>{
                                        if(res) {
                                            x++;
                                            if(x==num) {
                                                this.isSubmit();
                                            }
                                        }
                                    },50)
                                }
                            })
                        }
                    })
                }
                
                // setTimeout(()=>{
                //     console.log('submit',res,num,x);
                //     if(res || num==x) {
                //         let isAllCheck=true;
                //         if(this.editItem.num!==3) {
                //             this.poolData.daily.forEach(d=>{
                //                 d.todo.forEach(t=>{
                //                     if(t.execute_status=='0'&&t.id!==this.editItem.id) {
                //                         isAllCheck = false;
                //                     }
                //                 })
                //             })
                //         }else {
                //             this.poolData.daily.forEach(d=>{
                //                 if(new Date(d.scheduling_date).getTime()>=new Date(this.nowDaily).getTime()) {
                //                     d.todo.forEach(t=>{
                //                         if(t.execute_status=='0'&&t.action_id!==this.editItem.action_id) {
                //                             isAllCheck = false;
                //                         }
                //                     })
                //                 }
                                
                //             })
                //         }
                //         console.log('>>>>>>',isAllCheck);
                //         if(isAllCheck) {
                //             this.editDialog = false;
                //             // this.nextStepDialog = true;
                //             this.$toast.success("修改成功!此工作項已完成，已開啟隔天新的工作項", { duration: 5000 });
                //             this.searchPool();
                //         }else {
                //             this.editDialog = false;
                //             this.$toast.success("修改成功", { duration: 2000 });
                //             this.searchPool();
                //         }
                //     }
                //     this.dialogLoading = true;
                //     this.editDialog = false;
                // },200)
            }
            
        },
        isSubmit() {
            let isAllCheck=true;
            this.dialogLoading = true;
            if(this.editItem.num!==3) {
                this.poolData.daily.forEach(d=>{
                    d.todo.forEach(t=>{
                        if(t.execute_status=='0'&&t.id!==this.editItem.id) {
                            isAllCheck = false;
                        }
                    })
                })
            }else {
                this.poolData.daily.forEach(d=>{
                    if(new Date(d.scheduling_date).getTime()>=new Date(this.nowDaily).getTime()) {
                        d.todo.forEach(t=>{
                            if(t.execute_status=='0'&&t.action_id!==this.editItem.action_id) {
                                isAllCheck = false;
                            }
                        })
                    }
                    
                })
            }
            this.isLoading = false;
            this.getSelectPoolData();
            if(isAllCheck) {
                this.editDialog = false;
                // this.nextStepDialog = true;
                this.$toast.success("修改成功!此工作項已完成，已開啟隔天新的工作項", { duration: 5000 });
                this.searchPool();
            }else {
                this.editDialog = false;
                this.$toast.success("修改成功", { duration: 2000 });
                this.searchPool();
            }
        },
        // 打開延遲/複製的視窗bool=true為延遲 bool=false為複製
        openDelay(item,date,id,bool) {
            this.delayItem = _.cloneDeep(item);
            this.delayItem.original_date = date;
            this.delayItem.index = id;
            this.delayDate = dayjs(new Date(date)).format("YYYY-MM-DD");
            this.isDelay = bool;
            this.delayItem.operation=bool?'rescheduled':'copy';
            this.delayItem.operation_reason = '';
            this.delayDialog = true;
        },
        getNowDate: function() {
            let mydate = dayjs().format("YYYY-MM-DD");
            return mydate;
        },
        getMaxDate() {
            let date;
            if(this.poolData.daily) {
                date = this.poolData.daily[this.poolData.daily.length-1].scheduling_date;
            }
            return date;
        },
        // 指定/複製 isDelay=true 指定 / isDelay=false 複製
        async submitDelay() {
            var valid = this.$refs.delayform.validate();
            var isItem = false;
            // 判斷該天是否有重複的動作
            this.poolData.daily.forEach(d=>{
                if(new Date(d.scheduling_date).getTime()==new Date(this.delayDate).getTime()) {
                    d.todo.forEach(t=>{
                        if(t.action_id==this.delayItem.action_id) {
                            isItem=true;
                            alert(d.scheduling_date+'已有此動作!請選擇其他天')
                        }
                    })
                    
                }
            })
            
            if(valid&&!isItem) {
                this.dialogLoading = false;
                if(this.isDelay) {
                    let parm = _.cloneDeep(this.delayItem);
                    parm.scheduling_date = this.delayDate;
                    parm.updated_user = this.$auth.$state.user.email;
                    parm.execute_time = null;
                    parm.executor = '';
                    delete parm.original_date;
                    delete parm.id;
                    delete parm.index;
                    console.log('parm',parm);
                    var res = false;
                    res = await this.patchDailyCheckList(parm,this.delayItem.id);
                    setTimeout(()=>{
                        if(res) {
                            this.$toast.success("修改成功", { duration: 2000 });
                            this.delayDialog = false;
                            this.searchPool();
                        }
                        this.dialogLoading = true;
                    },50)

                }else {
                    let parm = _.cloneDeep(this.delayItem);
                    parm.scheduling_date = this.delayDate;
                    parm.created_user = this.$auth.$state.user.email;
                    parm.execute_time = null;
                    delete parm.original_date;
                    delete parm.id;
                    delete parm.action_name;
                    delete parm.action_remark;
                    delete parm.updated_user;
                    delete parm.index;
                    console.log('parm',parm);
                    var res = {action:false,msg:''};
                    res = await this.postDailyCheckList(parm);
                    setTimeout(()=>{
                        if(res.action) {
                            this.$toast.success("新增成功", {
                                duration: 2000
                            });
                            this.delayDialog = false;
                            this.searchPool();
                        }else {
                            this.$toast.error("新增失敗:"+res.msg, {
                                duration: 2000
                            });
                        }
                        this.dialogLoading = true;
                    },50)
                }
                
            }
            
        },
        addEventOpen(date) {
            this.actionInputShow = false;
            this.addItem = {
                name_ch:'',
                name_en:'',
                start_date: dayjs(new Date(date)).format("YYYY-MM-DD"),
                end_date: dayjs(new Date(date)).format("YYYY-MM-DD"),
                remark:'',
                estimated_member:0,
                estimated_spend:0,
                step_id:this.poolData.step_id,
                operation:'create',
                operation_reason:''
            };
            this.addDialog = true;
        },
        async submitAdd() {
            var valid = this.$refs.addform.validate();
            if(valid) {
                this.dialogLoading = false;
                let item = {
                    "step_id": this.poolData.step_id,
                    "name_ch": this.addItem.name_ch,
                    "name_en": this.addItem.name_ch,
                    "remark": this.addItem.remark,
                    "started_date": this.addItem.start_date,
                    "ended_date": this.addItem.end_date,
                    'operation':'create',
                    'operation_reason':this.addItem.operation_reason,
                    "estimated_member": this.addItem.estimated_member,
                    "estimated_spend":this.addItem.estimated_spend,
                    "created_user": this.$auth.$state.user.email
                }
                var res = false;
                res = await this.postDailyCheckActionList(item);
                setTimeout(()=>{
                    if(res) {
                        this.addDialog=false;
                        this.searchPool();
                    }
                    this.dialogLoading = true;
                },50)
            }
            
        },
        // submitNextStep() {
        //     // 提示開啟隔天新工作的視窗
        //     this.nextStepDialog = false;
        // },
        // 取得步驟清單
        getstepdata: async function () {
            let getBreedingStepList = await this.getBreedingStepList2();
            let stepData = typeof (getBreedingStepList)=='string'?[]:getBreedingStepList;
            this.stepdata = [];
            stepData.forEach(s=>{
                this.stepdata.push(s);
            })
            console.log('getStep',this.stepdata)
        },
        showstep() {
            if(!this.actionInputShow) {
                this.actionInputShow = true;
                this.addItem.action_id = null;
            }else {
                this.actionInputShow = false;
            }
            
        },
        // async getAllUser() {
        //     let getuserData = await this.getUserList();
        //     this.userData = typeof (getuserData)=='string'?[]:getuserData;
        //     this.userData = this.userData.filter(x=>x.is_active==true);
        //     console.log('User',this.userData);
        // },
        // 全部指定
        delayAllOpen(item) {
            this.delayAll = {daily_check_ids:new Array(),delay_day:1,scheduling_date:item.scheduling_date,operation:'rescheduled',operation_reason:''}
            let index = this.poolData.daily.map(x=>x.scheduling_date).indexOf(item.scheduling_date);
            this.nowChangeData = dayjs(new Date(item.scheduling_date)).add(this.delayAll.delay_day,'day').format("YYYY-MM-DD");
            // console.log(this.poolData.daily.map(x=>x.scheduling_date),item['scheduling_date']);
            this.poolData.daily.forEach((d,did)=>{
                if(did>=index) {
                    d.todo.forEach(t=>{
                        if(t.execute_status=='0') {
                            this.delayAll.daily_check_ids.push(t.id);
                        }
                    })
                    
                }
            })
            this.delayAllDialog=true;
        },
        changeDelayDay(evt) {
            this.nowChangeData = dayjs(new Date(this.delayAll.scheduling_date)).add(evt,'day').format("YYYY-MM-DD");
        },
        async submitDelayAll() {
            this.dialogLoading = false;
            let parm = _.cloneDeep(this.delayAll);
            parm.updated_user=(this.$auth.$state.user)?this.$auth.$state.user.email:undefined;
            delete parm.scheduling_date;
            console.log('一次指定',parm);
            var res = false;
            res = await this.postDelayStepList(parm);
            setTimeout(()=>{
                if(res) {
                    this.delayAllDialog=false;
                    this.searchPool();
                }
                this.dialogLoading = true;
            },50)
            
        },
        // 池選擇
        setNestedDisabled: function (obj, name) {
            //全部都設成disabled
            var deleteindex = [];
            var objj = obj;
            objj.forEach((itm, index) => {
                // console.log(itm.parent);//所有node(含leaf)的名稱
                itm.parent = itm.hasOwnProperty("parent")
                        ? itm.parent
                        : name;
                const nodelst = ["1", "2"]; //第1、2層
                if (nodelst.filter(x => x == itm.level) > 0) {
                    itm.id = itm.name + "_" + itm.id;
                }
                if (itm.visible == false) {
                    //visible的不顯示
                    deleteindex.push(index);
                    
                }
                if (itm.hasOwnProperty("node")) {
                    this.setNestedDisabled(itm.node, itm.name);
                }
            });
            // for (let i = 0; i < deleteindex.length; i++) {
            //   const element = deleteindex[i];
            //   obj.splice(element, 1);
            // }
            //刪除 走道
            for (var i = deleteindex.length - 1; i >= 0; i--) {
                objj.splice(deleteindex[i], 1);
            }
            // console.log(objj);
            return objj;
        },
        //池選擇，計算資料範圍
        nestedMain: function (obj, level) {
            // console.log('obj',obj);
            if(obj) {
                obj.forEach(itm => {
                    if (itm.level == level) {
                        if (itm.hasOwnProperty("node")) {
                            delete itm.node;
                        }
                    }
                    if (itm.hasOwnProperty("node")) {
                        this.nestedMain(itm.node, level);
                    }
                    
                });
            }
            
            return obj;
        },
        // 新增循環的池選擇，資料改變時，傳出數值
        changeEvent:function(){
            // this.$emit('scopeSel_data',nowPoolid);
            this.get_scopeData(this.nowPoolid);
        },
        // 檢視下一個工作
        async getNextWork() {
            // 重新整理資料
            // this.searchPool();
            this.nextWork = [];
            // get next work 
            let parm = {step_id: this.poolData.step_id,displayed_next_one: true}
            let getWork = await this.getNextWorkList(parm);
            let data = typeof (getWork)=='string'?[]:getWork;
            this.nextWork = _.cloneDeep(data);
            this.nextWorkDialog = true;
        },
        openLog(name,log) {
            this.logDialog = true;
            this.logData.action_name = name;
            this.logData.log = _.cloneDeep(log);
            this.logData.log.forEach(l=>{
                l.operator = l.operator?this.filterUserData(l.operator):'';
            })
        },
        filterUserData(user) {
            let position = this.accdata.filter(x=>x.username==user)[0].position?this.accdata.filter(x=>x.username==user)[0].position:'';
            let name = this.accdata.filter(x=>x.username==user)[0].account_name?this.accdata.filter(x=>x.username==user)[0].account_name:''
            return position+'-'+name;
        },
        dataHidden(evt) {
            // console.log('evt',evt);
            this.$nextTick(()=>{
                if(evt.includes('全部')) {
                    if(!this.hiddenListOld.includes('全部')) {
                        this.hiddenList = [];
                        this.hiddenList = _.cloneDeep(this.dateList);
                    }else {
                        if(this.hiddenList.length!==this.dateList.length) {
                            let index = this.hiddenList.indexOf('全部');
                            this.hiddenList.splice(index,1);
                        }
                    }
                }else {
                    if(this.hiddenListOld.includes('全部')) {
                        this.hiddenList = [];
                    }else {
                        if(this.hiddenList.length==this.dateList.length-1) {
                            this.hiddenList.unshift(this.dateList[0]);
                        }
                    }
                }
                if(this.hiddenList.length>0) {
                    let data = _.cloneDeep(this.poolDataAll);
                    data.daily.forEach(d=>{
                        let list = [];
                        if(this.hiddenList.includes(dayjs(new Date(d.scheduling_date)).format("MM/DD"))) {
                            d.todo.forEach(t=>{
                                if(t.execute_time&&t.execute_time!=='') {}else {
                                    list.push(t);
                                }
                            })
                            d.todo = _.cloneDeep(list);
                        }
                    })
                    this.poolData.daily=[];
                    data.daily.forEach(d=>{
                        if(d.todo.length>0) {
                            this.poolData.daily.push(d);
                        }
                    })
                }else {
                    this.poolData = _.cloneDeep(this.poolDataAll);
                }
                this.hiddenListOld = _.cloneDeep(this.hiddenList);
            })
            
        },
        // 一鍵複製
        copyAllOpen(item) {
            this.copyDialog = true;
            this.copyCheckData = {date: this.getNowDate(),remark:'',list:[]}
            this.copyList = _.cloneDeep(item.todo);
            this.copyList.forEach(c=>c.checked=false);
            this.checkAll = false;
        },
        changeCopy(action=null) {
            if(action!==null) {
                if(this.copyCheckData.list.includes(action)) {
                    let index = this.copyCheckData.list.indexOf(action);
                    let copyid = this.copyList.map(x=>x.action_id).indexOf(action);
                    this.copyCheckData.list.splice(index,1);
                    this.copyList[copyid].checked = false;
                    this.checkAll = false;
                }else {
                    this.copyCheckData.list.push(action);
                    let copyid = this.copyList.map(x=>x.action_id).indexOf(action);
                    this.copyList[copyid].checked = true;
                    if(!this.checkAll&&this.copyCheckData.list.length == this.copyList.length) {
                        this.checkAll = true;
                    }
                }
            }else {
                // this.checkAll = !this.checkAll;
                if(this.checkAll) {
                    this.copyCheckData.list = [];
                    this.copyList.forEach(c=>this.copyCheckData.list.push(c.action_id));
                    this.copyList.forEach(c=>c.checked=true);
                }else {
                    this.copyCheckData.list = [];
                    this.copyList.forEach(c=>c.checked=false);
                }
                
            }
            
            // console.log('change copy',event)
        },
        submitCopy() {
            let parm = {
                "scheduling_date": this.copyCheckData.date,
                "execute_status": "0",
                "execute_time": "",
                "executor": "", 
                "msg": "",
                "actual_member": 0,
                "actual_spend": 0,
                "created_user": this.$auth.$state.user.email,
                "operation": "copy",
                "operation_reason": this.copyCheckData.operation_reason,
            }
            let num = 0;
            let success = 0;
            let failed = 0;
            let dup = 0;
            let msg = '';
            this.copyCheckData.list.forEach(async l=>{
                console.log(l)
                let index = this.copyList.map(x=>x.action_id).indexOf(l);
                let data = _.cloneDeep(parm);
                // data['msg'] = this.copyList[index].action_remark;
                data['action_id'] = l;
                console.log(data);
                let isItem = false;
                // 判斷該天是否有重複的動作
                this.poolData.daily.forEach(d=>{
                    if(new Date(d.scheduling_date).getTime()==new Date(this.copyCheckData.date).getTime()) {
                        d.todo.forEach(t=>{
                            if(t.action_id==l) {
                                isItem=true;
                            }
                        })
                    }
                })
                if(isItem) {
                    num++;
                    dup++;
                    if(num == this.copyCheckData.list.length) {
                        this.copyMsg(success,failed,dup,msg);
                    }
                }else {
                    var res = {action:false,msg:''};
                    res = await this.postDailyCheckList(data);
                    setTimeout(()=>{
                        num++;
                        if(res.action) {
                            success++;
                        }else {
                            failed++;
                            msg = res.msg;
                        }
                        if(num == this.copyCheckData.list.length) {
                            this.copyMsg(success,failed,dup,msg);
                        }
                    },50)
                }
                
            })
        },
        copyMsg(success,failed,dup,msg) {
            if(success==this.copyCheckData.list.length) {
                this.$toast.success("新增成功", {
                    duration: 2000
                });
            }else if(failed==this.copyCheckData.list.length) {
                this.$toast.error("新增失敗:"+msg, {
                    duration: 2000
                });
            }else if(dup == this.copyCheckData.list.length) {
                alert(this.copyCheckData.date+'已有這些動作!請選擇其他天')
            }else {
                if(dup>0) {
                    if(failed>0) {
                        this.$toast.error("部分新增失敗:"+msg, {
                            duration: 2000
                        });
                    }else {
                        this.$toast.success("新增成功，重複的動作未新增", {
                            duration: 2000
                        });
                    }
                }else {
                    this.$toast.error("部分新增失敗:"+msg, {
                        duration: 2000
                    });
                }
                
            }
            if(dup !== this.copyCheckData.list.length) {
                this.copyDialog = false;
                this.searchPool();
                this.dialogLoading = true;
            }
            
        },
    },
    watch: {
    },
    computed: {
        // 新增循環的池選擇
        maindataScope:function(){
            var data = _.cloneDeep(this.addPoolData);
            var level = 3;
            return this.nestedMain(data,level);
        }
    }
}
</script>

<style lang="scss" scoped>
.result {
    overflow-x: scroll;
}
.result-content {
    @include flexAlignCenter();
}
.v-card.result-card {
    @include size(280px,64vh);
    min-width: 280px;
    .card-title {
        border: none;
    }

}
.daily-content {
    overflow-y: scroll;
}
.daily-check{
    background-color: #fff;
    box-shadow: 0 0 4px $color-black-10;
    border-radius: 4px;
    .check-title {
        @include flexCenterBetween();
        .title {
            .v-card__title {
                font-size: 1rem;
                padding: 0;
            }
        }
        .chrevon {
            span {
                margin-right: 4px;
                font-size: 0.85rem;
                &.delay {
                    color: $color-green;
                    text-decoration: underline;
                    cursor: pointer;
                }
                &.copy {
                    color: $color-primary;
                }
            }
            @include flexAlignCenter();
        }
    }
    .description {
        color: $color-dark-75;
    }
    .content {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        .excute {
            @include flexCenterBetween();
        }
    }
}
.calendar {
    @include flexAlignCenter();
}
::v-deep {
    .v-sheet.v-card.custom-dialog .v-textarea.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
        border: 1px solid $color-black-10;
        border-radius: 4px;
        padding: 0 8px;
    }
    .v-sheet.v-card.custom-dialog .v-textarea.theme--light.v-text-field > .v-input__control > .v-input__slot:before,
    .v-sheet.v-card.custom-dialog .v-textarea.theme--light.v-text-field > .v-input__control > .v-input__slot:before, 
    .v-sheet.v-card.custom-dialog .v-textarea.theme--light.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before {
        border-color: transparent;
    }
    .v-dialog .v-sheet.v-card.custom-dialog .card-title {
        margin: 4px 16px;
    }

}


</style>