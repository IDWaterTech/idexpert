<template>
  <div class="poollayout" style="padding-top: 20px;">
    <div v-if="!isLoad">Loading...</div>
    <div v-else>
      <div v-if="nowAreaTag!=='setting' && ponds.length>0 && isSetting">
        <v-row  v-for="(pond,pid) in ponds" :key="pid" class="mx-0 parent-row" :id="`pid-${pid}`" >
          <div v-for="(b,bid) in pond.pond" :key="bid"
            :class="{'block':b.state!==''&& b.rows.length==0 && b.isSetting,'text-center my-1':windowWidth>=700 && b.name!=='road','road':b.id==''&&b.name=='road','rows-display':b.rows.length>0,'edit-block':showedit}"
            :style="{
              background: `${b.isSetting==false?'transparent':((b.id==''&& b.state=='')||b.rows.length||(b.id==''&&b.name=='road')>0)?'transparent':getItemColor(b.state)}`,
              minWidth: `${getWidth(b)}`,
            }" 
            style="flex-shrink: 0;"
            class="mx-3">
            <!-- ((b.id==''&&b.name=='road')||(b.id==''&&b.state==''))?`width:${getWidth(b)}`:b.state == '無'? `width: ${getWidth(b)}`: b.state.length == 0 || b.rows.length==0 ? `background: ${getItemColor(b.state)};${getWidth(b)}`: b.rows.length==0?`background:transparent;width: ${getWidth(b)}`:`background:${getItemColor(b.state)};width: ${getWidth(b)};padding-top:12px` -->
            <mappoolelement
              v-if="b.rows.length==0 && b.name!=='road' && b.isSetting"
              :item="b"
              :selitem="statcolor.filter(x => !['default', ''].includes(x.name))
                "
              :showSelect="showedit"
              :myuser="$auth.$state.user
                ? $auth.$state.user.email
                : ''
                "
              :successDataID="successDataID"
              @editPool="edit($event)"
              @saveSuccess="saveDelete($event)"
            ></mappoolelement>

            <div v-else-if="b.rows.length>0 && b.name !== 'road'&& b.isSetting" class="mx-3 sub-row">
              <v-row v-for="(row,sid) in b.rows" :key="sid">
                  <div
                      :class="{'block':row.state!=='','text-center my-1':windowWidth>=700 && row.name!=='road','road':row.id==''&&row.name=='road','edit-block':showedit}"
                      :style="
                          row.state == '無'? `width: calc(100% / ${b.rowMaxCols} * ${row.cols})`: row.state.length == 0 ? `background:${getItemColor(row.state)};width: calc(100% / ${b.rowMaxCols} * ${row.cols})`: `background:${getItemColor(row.state)};width: calc(100% / ${b.rowMaxCols} * ${row.cols})`
                      ">
                      <mappoolelement
                          :item="row"
                          :selitem="statcolor.filter(x => !['default', ''].includes(x.name))
                          "
                          :showSelect="showedit"
                          :myuser="$auth.$state.user
                          ? $auth.$state.user.email
                          : ''
                          "
                          :successDataID="successDataID"
                          @editPool="edit($event)"
                          @saveSuccess="saveDelete($event)"
                          v-if="row.name!=='road'&& row.isSetting"
                      ></mappoolelement>
                      <div v-else>
                        <div v-if="row.roadDirection=='horizontal'" class="horizontal text-center">走道</div>
                        <div
                          :class="{
                              'vertical': row.roadDirection == 'vertical'
                            }"
                          v-else
                          
                        >
                        <span v-if="row.roadDirection == 'vertical'" style="writing-mode: vertical-rl;">走道</span>
                        </div>
                          
                      </div>
                  </div>
              </v-row>
            </div>

            <div v-else-if="b.name == 'road'&&b.id==''">
              <div v-if="b.cols>1 || b.roadDirection=='horizontal'" class="horizontal text-center">走道</div>
              <div
                :class="{
                    'top': (ponds[pid+1] && ponds[pid+1].pond[b.index-(maxCols-ponds[pid+1].pond.length)<0?0: b.index-(maxCols-ponds[pid+1].pond.length)] && ponds[pid+1].pond[b.index-(maxCols-ponds[pid+1].pond.length)<0?0: b.index-(maxCols-ponds[pid+1].pond.length)].name=='road'),
                    'center': (ponds[pid+1] && ponds[pid+1].pond[b.index-(maxCols-ponds[pid+1].pond.length)<0?0: b.index-(maxCols-ponds[pid+1].pond.length)] && ponds[pid+1].pond[b.index-(maxCols-ponds[pid+1].pond.length)<0?0: b.index-(maxCols-ponds[pid+1].pond.length)].name=='road') && (ponds[pid-1] && ponds[pid-1].pond[b.index-(maxCols-ponds[pid-1].pond.length)<0?0: b.index-(maxCols-ponds[pid-1].pond.length)] && ponds[pid-1].pond[b.index-(maxCols-ponds[pid-1].pond.length)<0?0: b.index-(maxCols-ponds[pid-1].pond.length)].name=='road'),
                    'bottom': (ponds[pid-1] && ponds[pid-1].pond[b.index-(maxCols-ponds[pid-1].pond.length)<0?0: b.index-(maxCols-ponds[pid-1].pond.length)] && ponds[pid-1].pond[b.index-(maxCols-ponds[pid-1].pond.length)<0?0: b.index-(maxCols-ponds[pid-1].pond.length)].name=='road'),
                    'vertical': b.roadDirection == 'vertical'
                  }"
                v-else
                
              >
              <span v-if="b.center" style="writing-mode: vertical-rl;z-index: 1000;">走道</span>
              </div>
                
            </div>
          </div>
        </v-row>
        <v-row v-if="MaxDate" class="mx-0 parent-row">
          <div class="mx-3 my-1 update-time">
            <span>最後更新時間：{{ MaxDate }}</span>
          </div>
        </v-row>
      </div>
      <div v-else-if="nowAreaTag=='setting'" style="padding-top: 32px;margin-top: -20px;">
        <v-row style="width: 100%"
          class="mx-0"
          :class="{'parent-row':`${nowAreaTag=='setting'&&setting=='layout'}`}">
          <settingcolor v-if="setting=='color'" class="mx-3" style="width: 100%;"></settingcolor>
          <settinglayout v-if="setting=='layout'" class="mx-3" style="width: 100%;" :areas="areas1"></settinglayout>
        </v-row>
      </div>
      <div v-else-if="ponds.length==0 && isLoad">無資料!請先至<router-link to="/factory"> 資料設定頁 </router-link>進行池的設定</div>
      <div v-else-if="!isSetting">尚未設置地圖，請點選 設定 > 配置設定，選擇此區進行設定</div>
    </div>
    
  </div>
</template>

<script>
import mappoolelement from "@/components/mapPoolElement.vue";
import dayjs from "dayjs";
import https from "https";
import settingcolor from "~/pages/map/settingcolor.vue";
import settinglayout from "@/pages/map/settinglayout.vue";
export default {
  layout: "emptynoheaderdrawer2",
  middleware: "auth",
  components: {
    mappoolelement,
    settingcolor,
    settinglayout
  },
  data() {
    return {
      windowWidth:window.innerWidth,
      allData:[],
      ponds:[
        {
          // 布局測試
          pond: [
            { id: "", name: "", updated_time: '', state: '',cols: 1, rows: [
              { id: "C1", name: "C1", updated_time: '2022-02-20 11:21:58',state: "放養中",cols: 1, rows: [] },
              { id: "", name: "road", updated_time: '',state: "",cols: 1, rows: [], roadDirection: 'horizontal' }           
            ]},
            { id: "C3", name: "C3", updated_time: '2022-02-15 11:21:58', state: "放養中",cols: 1, rows: [] },
            { id: "", name: "road", updated_time: '', state: "",cols: 1, rows: [], roadDirection: '' },
            { id: "", name: "road", updated_time: '', state: "",cols: 1, rows: [], roadDirection: 'vertical' },
            { id: "", name: "road", updated_time: '', state: "",cols: 1, rows: [], roadDirection: '' },
          ]
        },{
          pond: [
            { id: "B1", name: "B1", updated_time: '2022-02-15 11:21:58', state: "放養中",cols: 2, rows: [] },
            { id: "", name: "road", updated_time: '', state: "",cols: 1, rows: [], roadDirection: '' },
            { id: "B4", name: "B4", updated_time: '2022-02-15 11:21:58', state: "已清洗",cols: 1, rows: [] },
            { id: "", name: "road", updated_time: '', state: "",cols: 1, rows: [], roadDirection: '' },
          ]
        },{
          pond:[
            { id: "", name: "road", updated_time: '', state: "",cols: 5, rows: [], roadDirection: '' },
          ]
        },{
          pond: [
            { id: "A1", name: "A1", updated_time: '2022-02-15 11:21:58', state: "蓄水完畢",cols: 1, rows: [] },
            { id: "", name: "road", updated_time: '', state: "",cols: 1, rows: [], roadDirection: 'horizontal' },
            { id: "", name: "road", updated_time: '', state: "",cols: 1, rows: [], roadDirection: '' },
            { id: "A5", name: "A5", updated_time: '2022-02-15 11:21:58', state: "空池",cols: 1, rows: [] },
            { id: "", name: "road", updated_time: '', state: "",cols: 1, rows: [], roadDirection: '' },
          ]
        },
        {
          pond:[
            { id: "", name: "road", updated_time: '', state: "",cols: 5, rows: [] },
          ]
        }
      ],
      pondsWc:[
        {
          // wc
          pond: [
            { id: "C1", name: "C1", updated_time: '2022-02-15 11:21:58', state: "放養中(鎖排汙)", cols: 1, rows: []},
            { id: "C2", name: "C2", updated_time: '2022-02-15 11:21:58', state: "放養中(鎖排汙)", cols: 1, rows: [] },
            { id: "C3", name: "C3", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
            { id: "C4", name: "C4", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] },
            { id: "C5", name: "C5", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] }
          ]
        },{
          pond: [
            { id: "B1", name: "B1", updated_time: '2022-02-15 11:21:58', state: "養殖審核", cols: 1, rows: [] },
            { id: "B2", name: "B2", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] },
            { id: "B3", name: "B3", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] },
            { id: "B4", name: "B4", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] },
            { id: "B5", name: "B5", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] }
          ]
        },{
          pond: [
            { id: "A1", name: "A1", updated_time: '2022-02-15 11:21:58', state: "養殖審核", cols: 1, rows: [] },
            { id: "A2", name: "A2", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
            { id: "A3", name: "A3", updated_time: '2022-02-15 11:21:58', state: "養殖審核", cols: 1, rows: [] },
            { id: "A4", name: "A4", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] },
            { id: "A5", name: "A5", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] }
          ]
        },{
          pond:[
            { id: "", name: "road", updated_time: '', state: "", cols: 5, rows: [], roadDirection: '' },
          ]
        }
      ],
      pondsTf:[
        {
          // tf
          pond: [
            { id: "", name: "road", updated_time: '2022-02-15 11:21:58', state: "", cols: 9, rows: [], roadDirection: '' }
          ]
        },{
          pond: [
          { id: "49", name: "A1", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "50", name: "A2", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "51", name: "A3", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "52", name: "A4", updated_time: '2022-02-15 11:21:58', state: "已清洗", cols: 1, rows: [] },
          { id: "53", name: "A5", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
          { id: "", name: "", updated_time: '', state: "", cols: 1, rows: [] },
          { id: "18", name: "A6", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
          { id: "21", name: "A7", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
          { id: "A8", name: "A8", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
          ]
        },{
          pond: [
          { id: "B1", name: "B1", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "", name: "road", updated_time: '2022-02-15 11:21:58', state: "放養中",roadDirection:'vertical', cols: 1, rows: [] },
          { id: "B3", name: "B3", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "B4", name: "B4", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "B5", name: "B5", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
          { id: "", name: "", updated_time: '', state: "", cols: 1, rows: [] },
          { id: "B6", name: "B6", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
          { id: "B7", name: "B7", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
          { id: "B8", name: "B8", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
          ]
        },{
          pond: [
          { id: "C1", name: "C1", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "C2", name: "C2", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "C3", name: "C3", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "C4", name: "C4", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
          { id: "C5", name: "C5", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
          { id: "", name: "", updated_time: '', state: "", cols: 1, rows: [] },
          { id: "C6", name: "C6", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] },
          { id: "C7", name: "C7", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] },
          { id: "C8", name: "C8", updated_time: '2022-02-15 11:21:58', state: " 集中暫養", cols: 1, rows: [] },
          ]
        },{
          pond: [
          { id: "D1", name: "D1", updated_time: '2022-02-15 11:21:58', state: "養殖審核", cols: 1, rows: [] },
          { id: "D2", name: "D2", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "D3", name: "D3", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          { id: "D4", name: "D4", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
          { id: "D5", name: "D5", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
          { id: "", name: "", updated_time: '', state: "", cols: 1, rows: [] },
          { id: "D6", name: "D6", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] },
          { id: "D7", name: "D7", updated_time: '2022-02-15 11:21:58', state: "預備放苗", cols: 1, rows: [] },
          { id: "D8", name: "D8", updated_time: '2022-02-15 11:21:58', state: " 集中暫養", cols: 1, rows: [] },
          ]
        }
      ],
      pondsZw: [
        {
          // zw
          pond: [
            { id: "1-7", name: "1-7", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
            { id: "1-8", name: "1-8", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
            { id: "1-9", name: "1-9", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
            { id: "", name: "", updated_time: '', state: "", cols: 1, rows: [] },
            { id: "3-5", name: "3-5", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
            { id: "3-6", name: "3-6", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          ]
        },{
          pond: [
            { id: "1-4", name: "1-4", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
            { id: "1-5", name: "1-5", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
            { id: "1-6", name: "1-6", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
            { id: "", name: "", updated_time: '', state: "", cols: 1, rows: [] },
            { id: "3-3", name: "3-3", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
            { id: "3-4", name: "3-4", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
          ]
        },{
          pond: [
            { id: "1-1", name: "1-1", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
            { id: "1-2", name: "1-2", updated_time: '2022-02-15 11:21:58', state: "做水中", cols: 1, rows: [] },
            { id: "1-3", name: "1-3", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
            { id: "", name: "", updated_time: '', state: "", cols: 1, rows: [] },
            { id: "3-1", name: "3-3", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
            { id: "3-2", name: "3-4", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
          ]
        },{
          pond: [
            { id: "", name: "road", updated_time: '2022-02-15 11:21:58', state: "", cols: 6, rows: [] },
          ]
        },{
          pond: [
            { id: "C-1", name: "C-1", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
            { id: "C-2", name: "C-2", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
            { id: "C-3", name: "C-3", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
            { id: "", name: "", updated_time: '', state: "", cols: 1, rows: [] },
            { id: "4-5", name: "4-5", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
            { id: "4-6", name: "4-6", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          ]
        },{
          pond: [
            { id: "0-1", name: "0-1", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
            { id: "2-3", name: "2-3", updated_time: '2022-02-15 11:21:58', state: "做水中", cols: 1, rows: [] },
            { id: "2-4", name: "2-4", updated_time: '2022-02-15 11:21:58', state: "做水中", cols: 1, rows: [] },
            { id: "", name: "", updated_time: '', state: "", cols: 1, rows: [] },
            { id: "4-3", name: "4-3", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
            { id: "4-4", name: "4-4", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
          ]
        },{
          pond: [
            { id: "0-2", name: "0-2", updated_time: '2022-02-15 11:21:58', state: "無", cols: 1, rows: [] },
            { id: "2-1", name: "2-1", updated_time: '2022-02-15 11:21:58', state: "做水中", cols: 1, rows: [] },
            { id: "2-2", name: "2-2", updated_time: '2022-02-15 11:21:58', state: "做水中", cols: 1, rows: [] },
            { id: "", name: "", updated_time: '', state: "", cols: 1, rows: [] },
            { id: "4-1", name: "4-1", updated_time: '2022-02-15 11:21:58', state: "空池", cols: 1, rows: [] },
            { id: "4-2", name: "4-2", updated_time: '2022-02-15 11:21:58', state: "放養中", cols: 1, rows: [] },
          ]
        }
      ],
      pondsSp:[
        {
          // sp
          pond: [
            {
              id: "", name: "", updated_time: '', state: '',cols: 1, rows:[
                { id: "S1", name: "S1", updated_time: '2022-02-15 11:21:58', state: "放養中",cols: 1, rows: [] },
                { id: "S2", name: "S2", updated_time: '2022-02-15 11:21:58', state: "放養中",cols: 1, rows: [] },
              ]
            },
            { id: "L1", name: "L1", updated_time: '2022-02-15 11:21:58', state: "放養中",cols: 1, rows: [] },
            { id: "L2", name: "L2", updated_time: '2022-02-15 11:21:58', state: "放養中",cols: 1, rows: [] },
            { id: "L3", name: "L3", updated_time: '2022-02-15 11:21:58', state: "放養中",cols: 1, rows: [] },
            { id: "L4", name: "L4", updated_time: '2022-02-15 11:21:58', state: "尚未洗池",cols: 1, rows: [] },
            { id: "L5", name: "L5", updated_time: '2022-02-15 11:21:58', state: "放養中",cols: 1, rows: [] },
          ]
        }
      ],
      ponds2: {
        C: [
          { id: "C1", name: "C1", updated_time: '2022-02-15 11:21:58', state: "放養中" },
          { id: "C2", name: "C2", updated_time: '2022-02-15 11:21:58', state: "放養中" },
          { id: "C3", name: "C3", updated_time: '2022-02-15 11:21:58', state: "放養中" },
          { id: "C4", name: "C4", updated_time: '2022-02-15 11:21:58', state: "放養中" },
          { id: "C5", name: "C5", updated_time: '2022-02-15 11:21:58', state: "放養中" }
        ],
        B: [
          { id: "B1", name: "B1", updated_time: '2022-02-15 11:21:58', state: "放養中" },
          { id: "B2", name: "B2", updated_time: '2022-02-15 11:21:58', state: "集中暫養中" },
          { id: "B3", name: "B3", updated_time: '2022-02-15 11:21:58', state: "尚未洗池" },
          { id: "B4", name: "B4", updated_time: '2022-02-15 11:21:58', state: "已清洗" },
          { id: "B5", name: "B5", updated_time: '2022-02-15 11:21:58', state: "蓄水中" }
        ],
        A: [
          { id: "A1", name: "A1", updated_time: '2022-02-15 11:21:58', state: "蓄水完畢" },
          { id: "A2", name: "A2", updated_time: '2022-02-15 11:21:58', state: "消毒中" },
          { id: "A3", name: "A3", updated_time: '2022-02-15 11:21:58', state: "做水中" },
          { id: "A4", name: "A4", updated_time: '2022-02-15 11:21:58', state: "預備放苗" },
          { id: "A5", name: "A5", updated_time: '2022-02-15 11:21:58', state: "空池" }
        ]
      },
      statcolor: [
          { name: "無", color: "#D3DCE1",id: 1 },
          { name: "default", color: "#00273E" },
          { name: "放養中", color: "#F1E78D",id: 4 },
          { name: "放養中(鎖排汙)", color: "#CBAAE5",id: 32 },
          { name: " 集中暫養", color: "#8DA0E5",id: 31},
          { name: "尚未洗池", color: "#E8DDBF",id: 6 },
          { name: "已清洗", color: "#A8E6DB",id: 7 },
          { name: "蓄水中", color: "#D3B280",id: 8 },
          { name: "蓄水完畢", color: "#A5D380",id: 9 },
          { name: "消毒中", color: "#80D3AB",id: 10 },
          { name: "做水中", color: "#C5E8E6",id: 11 },
          { name: "預備放苗", color: "#83C9F0",id: 12 },
          { name: "空池", color: "#BFDAE8",id: 3 },
          { name: "養殖審核", color: "#D3808F",id: 33 }
      ],
      maxCols: 12,
      editState: false, //編輯池況
      editData: [],
      successDataID:[],
      areas1:[],
      oldAreaTag:'',
      isLoad: false,
      isSetting: false
    };
  },
  props: {
    showedit: {
      type: Boolean,
      default: false
    },
  //   statcolor: {
  //     type: Array,
  //     default: []
  //   },
    successData: {
      type: Array,
      default: []
    },
    nowAreaTag: {
      type: String,
      default: ''
    },
    setting: {
      type: String,
      default: ''
    },
    areas:{
      type: Array,
      default: []
    },
    nowLayout: {
      type: String,
      default: ''
    },
    nowAreaId: {
      type: Object,
      default: {
        factory_id: null,
        pond_area_id: null
      }
    }
  },
  created() {
    // this.nowLayout();
    // this.getPondData();
    this.getPondData();
  },
  async mounted() {
    //監控視窗
     window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    });
    // if(this.nowAreaTag!=='setting') {
    //   this.getPondData();
    // }
    
  },
  methods: {
    getItemColor: function(data) {
      // console.log('getItemColor',data);
      if (data == "") {
        return "white";
      }
      let data2 = this.statcolor.filter(x => x.name == data);
      if (data2.length == 1) {
        return data2[0].color;
      } else {
        return this.statcolor.filter(x => x.name == "default")[0].color;
      }
    },
    getPondData: async function() {
      // let now = this.nowAreaTag+'-state';
      let now = this.nowAreaTag[0].toLowerCase()+this.nowAreaTag.slice(1)+'-state'
      // console.log(now)
      const agent = new https.Agent({
        rejectUnauthorized: false
      });

      //取得水池狀態
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/${now}/`, { httpsAgent: agent })
      //   .then(res => {
      //     // this.ponds = res.data;
      //     // console.log(this.nowAreaTag,now);
      //     // console.log(res.data);
      //     if(this.nowAreaTag=='zw') this.ponds=this.pondsZw
      //     else if(this.nowAreaTag=='tf') this.ponds=this.pondsTf
      //     else if(this.nowAreaTag=='wc') this.ponds=this.pondsWc
      //     else if(this.nowAreaTag=='sp') this.ponds=this.pondsSp
      //   })
      //   .catch(error => {
      //     // alert("error:" + error.message);
      //   });
      let parm = {
        factory_id: this.nowAreaId.factory_id,
        pond_area_id: null

      }
      this.isLoad = false;
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/map/`,{params:parm}, { httpsAgent: agent })
        .then(res => {
          // this.ponds = res.data;
          console.log('getData',res.data);
          this.allData = res.data;
          
          this.dataPrepare();
          this.getLayoutData();
          this.isLoad = true;
        })
        .catch(error => {
          // alert("error:" + error.message);
        });
      //取得池況顏色設定
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`, { httpsAgent: agent })
        .then(res => {
          // console.log('getColor',res.data);
          this.statcolor = res.data;
        })
        .catch(error => {
          alert("error:" + error.message);
        });
    },
    getLayoutData() {
      // 將地圖資料傳遞給配置設定
      let areaid = null;
      this.areas.forEach(a=>{
        if(a.name == this.nowLayout) {
          areaid = a.id;
        }
      })
      this.allData.forEach(data=>{
        if(data.id==areaid) {
          this.areas1 = {
            areaNo: data.area_no,
            name: this.nowLayout,
            id: data.id,
            ponds: data.ponds
          }
        }
      })
      console.log('getLayout',this.areas,this.allData);
    },
    editStateFun: function(data) {
      this.editState[data] = this.editState[data]
        ? !this.editState[data]
        : true;
      console.log(this.editState);
    },
    edit(evt) {
      // 各池更改要觸發上層(影響全部儲存的資料)
      for(let x=0;x<this.ponds.length;x++) {
        for(let y=0;y<this.ponds[x].pond.length;y++) {
          if(this.ponds[x].pond[y].rows.length>0) {
            for(let z=0;z<this.ponds[x].pond[y].rows.length;z++) {
              if(this.ponds[x].pond[y].rows[z].id == evt.item.id) {
                this.editDataChange(this.ponds[x].pond[y].rows[z],evt,'single');
              }
            }
          }else {
            if(this.ponds[x].pond[y].id == evt.item.id) {
              this.editDataChange(this.ponds[x].pond[y],evt,'single');
            }
          }
        }
      }
      // console.log('editData',this.editData);
    },
    editDataChange(pondData,evt,type) {
      if(type=='single') {
        let isInculde = false;
        if(pondData.state == evt.value) {
          this.saveDelete(evt);
          // this.$emit('saveSuccess',evt);
        }else {
          if(this.editData.length>0) {
            for(let i=0;i<this.editData.length;i++) {
              if(this.editData[i].id == evt.item.id && this.editData[i].value !== evt.value) {
                this.editData[i].value = evt.value;
                isInculde = true;
              }
            }
          }
          if(!isInculde) {
            this.editData.push({
              id: evt.item.id,
              value: evt.value
            });
          }
          if(this.editData.length>0) {
            // console.log('sub edit')
            this.$emit('editPoolOuter',this.editData);
          }
        }
      }else {
        for(let y=0;y<this.successData.length;y++) {
          if(pondData.id == this.successData[y].id) {
            pondData.state = this.successData[y].value;
            let evt = {
              item:{
                id:this.successData[y].id,
                value:this.successData[y].value
              },
            }
            this.saveDelete(evt);
          }
        }
      }
      
    },
    saveDelete(evt) {
      // 各池更動送出成功後，需更改儲存的資料並告知上層更改資料(影響全部儲存)
      this.editData = this.editData.filter(x=>{
        // console.log('tf',evt,x);
        x.id!==evt.item.id
      });
      this.$emit('saveSuccess',evt);
      this.getPondData();
      // console.log('wc',this.editData);
    },
    getMaxCols() {
      // 取得欄位數，並給定指定index(road判斷用)
      this.maxCols = this.ponds[0].pond.reduce((total,p)=>total+p.cols,0);
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
      this.getCenter();
      return this.maxCols;
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
          if(this.ponds[i].pond[x].name=='road' && this.ponds[i].pond[x].cols==1) {
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
      
    },
    getWidth(data) {
        // 計算每格寬度
        let w = ((120 * data.cols)+(data.id=='' && data.name=='road'? (data.cols-1)*24:(data.cols==1?0:(data.cols-1)*24))) +'px';
        // console.log('w '+data.name,w);
        return w;
    },
    dataPrepare() {
      this.isSetting = false;
      // 資料一開始撈取出來後，進行資料的整理，取出目前選取的區
      this.allData.forEach(data=>{
        if(this.nowAreaTag==data.area_no) {
          this.ponds = data.ponds;
        }
      })
      this.ponds.forEach(p=>{
        p.pond.forEach(b=>{
          if(b.rows>0) {
            b.rows.forEach(r=>{
              if(!r.updated_time) {
                r.updated_time='';
                r.state = ''
              }
              if(r.id!==''&&r.state=='') {
                r.state = '無'
              }
              if(r.isSetting) {
                this.isSetting = true;
              }
            })
          }else {
            if(!b.updated_time) {
              b.updated_time='';
              b.state = ''
            }
            if(b.id!==''&&b.state=='') {
              b.state = '無'
            }
            if(b.isSetting) {
              this.isSetting = true;
            }
          }
          b.center = false;
        })
      })
      this.oldAreaTag=this.nowAreaTag;
      this.getMaxCols();
      console.log('data prepare',this.ponds);
      // this.getCenter();
    },     
  },
  computed: {
    MaxDate: function() {
      // var rows1 = Object.keys(this.ponds); //[a,b,c,d]

      let alldate = [];
      // rows1.forEach(row =>
      //   alldate.push(
      //     ...this.ponds[row]
      //       .filter(
      //         x => x.state !== "default" && x.state !== "無" && x.state !== ""
      //       )
      //       .map(x => {
      //         return x.updated_time;
      //       })
      //   )
      // );

      this.ponds.forEach(pondrow=>{
        pondrow.pond.forEach(row=>{
          if(row.rows.length>0){
            row.rows.forEach(sub=>{
              if(sub.state !== "default" && sub.state !== "" && sub.updated_time) {
                alldate.push(sub.updated_time);
              }
            })
            
          }else {
            if(row.state !== "default" && row.state !== "" && row.updated_time) {
                alldate.push(row.updated_time);
              }
          }
        })
        
      })
      let maxDate = new Date(Math.max(...alldate.map(date => new Date(date))));
      // console.log(dayjs(minDate).format('YYYY-MM-DD HH:mm:ss'),dayjs(maxDate).format('YYYY-MM-DD HH:mm:ss'));
      // return dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
      return dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");
    },
    
  },
  watch: {
    successData() {
      // 全部儲存後，需更改原本的資料以及池況還原
      // console.log('success',this.successData);
      if(this.successData.length>0) {
        let ids = []
        this.successData.forEach(data=>{ids.push(data.id);});
        this.successDataID = ids;
        // console.log('success ids',ids);
        for(let x=0;x<this.ponds.length;x++) {
          for(let i=0;i<this.ponds[x].pond.length;i++) {
            if(this.ponds[x].pond[i].rows.length>0) {
              for(let z=0;z<this.ponds[x].pond[i].rows.length;z++) {
                this.editDataChange(this.ponds[x].pond[i].rows[z],this.successData,'muti');
              }
            }else {
              this.editDataChange(this.ponds[x].pond[i],this.successData,'muti');
            }
          }
        }
        this.getPondData();
      }
    },
    showedit() {
      // 非編輯狀態，清除原本要更改的池況狀態
      if(!this.showedit) {
        this.editData = [];
        this.successDataID = [];
        
      }
    },
    nowAreaTag() {
      // 如果前一個是點選setting後，點選池，需重新撈取資料，避免設定修改未即時呈現
      if(this.oldAreaTag=='setting' && this.oldAreaTag!==this.nowAreaTag) {
        this.getPondData();
      }
      this.dataPrepare();
      
      // console.log('any change?',this.oldAreaTag,this.nowAreaTag);
    },
    nowLayout() {
      this.getLayoutData();
      // console.log('change layout',this.areas1);
    }
  }
};
</script>

<style lang="scss" scoped>
td {
  font-size: 1.2em;
  text-align: center;
  vertical-align: middle;
  min-width: 80px;
}
tr {
  height: 50px;
  max-height: 80px;
}
v-row > div{
  justify-content: center;
  align-items: center;  
}
.parent-row {
  width: 100%;
  margin-bottom: 12px;
  height: 100%;
  flex-wrap: nowrap;
  // min-width: 1200px;
}
.col-m-b {
  margin-bottom: 12px;
}
.rows-display {
  display: flex;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
}
.block {
  width: 100%;
  padding: 12px 0;
  width: 120px;
  &.edit-block {
    padding: 12px;
  }
}
.road {
  position: relative;
  padding: 0;
  // width: 100%;
  // min-width: 120px;
  & > div {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .horizontal,.top,.center,.bottom,.vertical {
      padding: 0;
      width: 100%;
      height: 36px;
      background-color: #e4e4e4;
      margin: 0;
      // margin-right: -12px;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vertical {
    border-radius: 4px;
    // height: auto;
    // margin-top: -24px;
  }
  .center {
      border-radius: 0;
      margin-top: 0;
      height: calc(100% + 84px);
  }
  
  .top {
      border-radius: 4px 4px 0 0;
      margin-top: 24px;
      // margin-top: 0;
  }
  
  
  .bottom {
    border-radius: 0 0 4px 4px;
    margin-top: 0;
  }

}
.sub-row {
  width: 100%;
  .block {
    padding: 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    &.edit-block {
      padding: 12px;
    }
  }
  .road {
    .horizontal {
      margin: 0;
      width: 100%;
    }
    .vertical {
      width: 36px;
      height: 100%;
      padding: 12px;
    }
  }
}
.update-time {
  width: 100%;
  // text-align: right;
  font-size: 14px;
  color: #00273E;
}

</style>
