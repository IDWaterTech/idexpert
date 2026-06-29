<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title>
          添加物-新增
        </v-card-title>

        <v-card-text class="content-area">
          <!-- 內容 -->
          <v-row>
            <!-- 選擇養殖場 -->
            <v-col cols="12">
              <locate-select :dataScope="'area'" :defaultSelect="nowArea" :isMulti="false"
                @scopeSel_data="get_scopeData($event)" class="select-template"></locate-select>
            </v-col>
            <!-- 養殖池 -->
            <v-col cols="12" class="caculate" v-if="false">
                <v-autocomplete
                  v-model="sel_pool"
                  :items="mainpool.items"
                  item-text="name"
                  item-value="id"
                  no-data-text="查無資料"
                  label="水池"
                  class="select-color"
                  hide-details
                  :loading="isParaLoading"
                  :disabled="isParaLoading"
                  :color="isParaLoading?'red':'primary'"
                ></v-autocomplete>
              </v-col>
            <!-- 指標項目 -->
            <v-col cols="12">
              <v-autocomplete v-model="defitem" :items="waterdatacols" item-text="name" item-value="value"
                no-data-text="查無資料" placeholder="指定項目(必選)" :rules="rules.require" hide-details dense>
                <template v-slot:item="data">{{ `　${data.item.name}` }}</template>
              </v-autocomplete>
            </v-col>
            <!-- 選擇日期與時間 -->
            <!-- 日期 -->
            <v-col cols="12" md="6">
              <v-menu v-model="menu_adate" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="adate" label="選擇日期" prepend-icon="mdi-calendar" readonly dense v-bind="attrs"
                    v-on="on" :rules="rules.require" @click:prepend="() => (adate = getNowDate())"></v-text-field>
                </template>
                <v-date-picker v-model="adate" locale="zh-tw" no-title @input="menu_adate = false"></v-date-picker>
              </v-menu>
            </v-col>
            <!-- 時間 -->
            <v-col cols="12" md="6">
              <v-text-field label="時間" v-model="atime" value="" dense type="time"
                prepend-icon="mdi-timeline-clock-outline" @click:prepend="() => (atime = getNowTime())"
                :rules="rules.require"></v-text-field>
            </v-col>
            <!-- 填寫數值 -->
            <v-col cols="12" class="my-2">
              <el-input-number :id="item.name" :ref="item.name" @keyup.enter.native="gofocusNxt2(item.name)"
                class="ml-2" v-model="num[item.name]" size="large" :precision="2" :step="0.1" :min="num_min"
                v-if="false"
                :max="num_max"></el-input-number>
              <v-row>
                <v-col cols="12" md="6" v-for="(item, id) in mainpool.items" :key="'pool-' + id">
                  {{ item.name }}
                  <el-input-number :id="item.name" :ref="item.name" @keyup.enter.native="gofocusNxt2(item.name)"
                    class="ml-2" v-model="num[item.name]" size="mini" :precision="2" :step="0.1" :min="num_min"
                    :max="num_max">
                  </el-input-number>
                </v-col>
                <!-- @keyup="getAddData" -->
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- 新增鈕 -->
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="addSubmit">
            新增
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import dayjs from "dayjs";
import _ from "lodash";
export default {
  data() {
    return {
      //日期menu
      menu_adate: false,
      //日期
      adate: "",
      //時間
      atime: "",
      //form
      valid: true,
      rules: { require: [v => !!v || "*必要項目"] },
      num: {},
      num_min: 0,
      num_max: 99999,
      item: [{ name: "", items: [] }], // 事件
      //指標清單
      defitem: '',
      waterdatacols: [],
      coldata:[],//{ "group": "env", "id": 19, "name_ch": "進水量", "name_en": "inflow", "unit": "L", "max": 999, "min": 0, "warning_min": null, 
      nowArea:'',
      maindata: [],//架構資料
      sel_area: "",
      sel_pool: "",
      isParaLoading:false,
      mainpool: {
        id: 1,
        name: "A1",
        items: [
          // { name: "體積", item: "volume", value: 140.0, unit: "噸" },
        ]
      },
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', true);//關閉dialog
    },
    openDialog(){
      this.$refs.form.reset();
    },
    get_scopeData:async function(evt){
      this.isParaLoading = true;
      let areaId = evt;//選中回傳回來的場 ID
      await this.getPoolList(areaId);
      this.isParaLoading = false;
    },
    getNowDate: function() {
      return dayjs().format("YYYY-MM-DD");
    },
    getNowTime: function() {
      return dayjs().format("HH:mm");
    },
    gofocusNxt2: function(id) {
      // 按下enter後會鎖定下一個項目
      var findItem = this.mainpool.items.find(x => x.name == id);
      var idxItem = this.mainpool.items.indexOf(findItem);
      if (idxItem + 1 == this.mainpool.items.length) {
        this.$refs[id][0].focus(); //最後一項，鎖定原位
      } else {
        let nxtName = this.mainpool.items[idxItem + 1].name;
        this.$refs[nxtName][0].focus(); //最後一項，鎖定原位
      }
      // this.$refs['A2'].$el.children[0].focus();
    },
    //取得指標清單
    async getWaterList(){
      var myItem = [];
      let getAllColForSearchList = await this.getAllColForSearchList();
      let data = typeof (getAllColForSearchList) == 'string' ? [] : getAllColForSearchList;
      //組合成元件所需格式
      var group = Array.from(new Set(data.map(x => x.group)));
      for (let i = 0; i < group.length; i++) {
        const element = group[i];
        if (i != 0) {
          myItem.push({ divider: true });
        }
        myItem.push({ header: element });//group name
        myItem.push(...data.filter(x => x.group == element).map(x => ({ 'name': x.name_ch, 'value': x.id })));
      }
      this.waterdatacols = myItem;//放入清單

      this.coldata = Object.assign([], data);
      //原頁面下面還有一堆 
    },
    //池清單
    async getPoolList(evt){
      let filterMain = [];
      filterMain = this.maindata;
      let areaId;
      let areaName;
      areaId = evt.split('_')[evt.split('_').length - 1];////原資料會有底線
      if (evt.split('_').length > 2) {
        for (let i = 0; i < evt.split('_').length - 1; i++) {
          areaName += evt.split('_')[i];
        }
      } else {
        areaName = evt.split('_')[0];
      }
      // ("areaId:",areaId);//區域的ID
      // ("areaName:",areaName);//區域的中文
      // ("filterMain:",filterMain);//整場架構
      //過濾出要的池清單
      if (areaId) {

        var para = {
          id: areaId
        };
        let getPondDataList = await this.getPondDataList(para);
        let data = typeof (getPondDataList) == 'string' ? [] : getPondDataList;
        this.mainpool.items = data;
      } else {
        this.mainpool.items = [];
      }

      //整段搬過來 不需要sel_main??????????????
      // if (
      //   //看有沒有選場
      //   // this.sel_main != undefined &&
      //   // this.sel_main > 0 &&
      //   this.maindata.length > 0 && 
      //   this.sel_area > 0 && !evt
      // ) {
      //   filtermain.forEach((x)=>{
      //     if(x.id == this.sel_main) {
      //       x.node.forEach((y)=> {
      //         if(y.id == this.sel_area) {
      //           this.nowArea = y.name+'_'+this.sel_area;
      //         }
      //       });
      //     }
      //   });
      //   console.log('nowArea',this.nowArea);
      // }else {
      //   filtermain.forEach((x)=>{
      //     x.node.forEach((y)=> {
      //       if(y.name == areaName && y.id==areaId) {
      //         // 如果場或區不與原本的相同，要清空池，因為查詢按鈕要判斷disable
      //         if(this.sel_main!==x.id || this.sel_area!==y.id) {
      //           this.sel_pool = '';
      //         }
      //         this.sel_main = x.id
      //         this.sel_area = y.id;
      //         this.nowArea = y.name+'_'+this.sel_area;
      //       }
      //     });
      //   });

        // this.areachange();
      //}

    },
    //架構資料
    getMainData:async function(){
       const promiseArray = [];
      promiseArray.push(JSON.parse(localStorage.getItem('architecture'))?JSON.parse(localStorage.getItem('architecture')):await this.getArchitecture());
      let allcolData = await this.getAllColNameList();
      let allcols = typeof (allcolData)=='string'?[]:allcolData;
      promiseArray.push(allcols);
      this.maindata = promiseArray[0];
    },
    //新增
    addSubmit:async function(){
      let valid = this.$refs.form.validate();
      if(!valid){
        this.$toast.error('請重新檢查是否有未填項目', { duration: 2000 });
        return;
      }
      // console.log("addsubmit:pool=",this.pool);
      // console.log("addsubmit:defitem=",this.defitem);
      // console.log("addsubmit:menu_adate=",this.menu_adate);
      // console.log("addsubmit:atime=",this.atime);
      // console.log("addsubmit:item=", this.item);
      let defitemall = this.coldata.filter(x => x.id == this.defitem)[0];
      let colClass = defitemall.group;
      let colId = Number(this.defitem.split("_")[this.defitem.split("_").length - 1]);//資料長這樣"env_19",要取19
      //部分群組禁止新增
        if(['feed','pbio','breeding_material'].includes(colClass)){
          this.$toast.error(`僅供查詢，禁止新增該群資料：${colClass}`, { duration: 2000 });
          return;
        }
      //組合參數
      let params = {
          id:colId,
          inspected_time: `${this.adate} ${this.atime}:00`, //無秒數，直接補0
          data: [],
          created_user: this.$auth.$state.user.email, //建立者名稱
          data_group: colClass //water,adv,...
        };
      let submitData = [];
      for (const key in Object.keys(this.num)) {
        const element = Object.keys(this.num)[key];
        if (this.num[element] != undefined) {
          const el_id = this.mainpool.items.filter(x => x.name == element)[0]
            .id;
          submitData.push({ id: el_id, val: this.num[element] });
        }
      }
      if (submitData.length <= 0) {
        this.$toast.success(`無新增資料`, { duration: 3000 });
        return;
      }
      params.data = submitData;
      var res = await this.postAllDataList(params);
      this.closeDialog();
    }
  },
  async created() {
    await this.getWaterList();//取得指標清單
    await this.getMainData();
  },
}
</script>

<style scoped>
.content-area {
  height: 400px;
  overflow-y: auto;
}
</style>