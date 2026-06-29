<template>
    <div>
        <v-overlay :value="!isLoading" :absolute="true">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-form v-model="reportvalid" ref="addform">
            <v-card class="custom-dialog">
                <v-card-title class="add-title">
                    <div class="d-inline-block">
                        <span>{{ addReport[0].pond_ids ? '修改' : '新增' }}檢驗報告</span>
                    </div>
                    <div class="add">
                        <v-btn class="btn-secondary close" title="取消" @click="addReport = [{ msg: '' }]; closeDialog();">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <div class="basic">
                    <v-card-text v-for="(add, id) in addReport" :key="'add_' + id"
                        class="d-flex flex-column px-4 py-2 mt-2" style="position: relative;border-radius: 4px;">
                        <div class="textfield flex-align-start flex-column">
                            <div class="select-type" style="width: 50%;">
                                <v-select v-model="add.type" dense filled :items="addOtherType" item-text="name_ch"
                                    class="pt-2" item-value="id" label="檢驗類型" style="margin-right: 16px;"
                                    @change="selectadd($event, id)"></v-select>
                            </div>
                            <div class="select-item full-width">
                                <div class="select-bacteria flex-align-end full-width">
                                    <v-select v-model="add.status" :items="addStatus" :menu-props="{ maxHeight: '400' }"
                                        item-value="name_ch" item-text="name_ch" filled dense
                                        class="mt-0 select-sample mr-4 full-width" label="檢驗結果">
                                    </v-select>
                                    <v-text-field v-model="add.position" filled dense class="pt-2 mt-0 full-width"
                                        label="檢驗單位" placeholder="XXX公司、XXX檢驗所" :rules="rules.require"
                                        autocomplete="off"></v-text-field>
                                </div>
                                <div class="select-bacteria flex-align-end mb-3 full-width">
                                    <div class="date-time-picker flex-align-start flex-column mr-4 full-width"
                                        style="color: #6c9bcd;">
                                        <v-menu v-model="menu_reportdate" :close-on-content-click="false"
                                            :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="add.execute_date" label="檢驗時間"
                                                    :rules="rules.require" prepend-icon="mdi-calendar"
                                                    class="pt-0 mb-3 full-width" hide-details readonly v-bind="attrs"
                                                    v-on="on" @click:prepend="
                                                        () => (add.execute_date = getNowDate())
                                                    "></v-text-field>
                                            </template>
                                            <v-date-picker v-model="add.execute_date" no-title locale="zh-tw"
                                                :max="getNowDate()" @input="menu_reportdate = false">
                                            </v-date-picker>
                                        </v-menu>
                                        <!-- <span style="font-size: 12px;line-height: 12px;">檢驗時間</span>
                                <a-date-picker v-model="add.execute_date" :defaultValue="add.execute_date" label="檢驗時間" value="null" format="yyyy-MM-DD" show-time placeholder="檢驗時間" @change="onChange" @ok="onOk" style="min-width: none;margin-left: 4px;margin-right: 16px;width: 100%;" /> -->
                                    </div>
                                </div>
                                <div v-if="add.type == 1" class="select-bacteria flex-align-end mb-3 full-width">
                                    <v-select v-model="add.species_id" :items="bacteriaAll"
                                        :menu-props="{ maxHeight: '400' }" item-value="id" item-text="name_ch"
                                        @change="getReportDisease" filled dense class="mt-0 full-width" label="檢驗物種"
                                        hide-details>
                                    </v-select>
                                    <v-select v-model="add.method_id"
                                        :items="add.species_id != undefined ? bacteriaAll.filter(x => x.id == add.species_id)[0]?.test : []"
                                        :menu-props="{ maxHeight: '400' }" item-value="id" item-text="name_ch"
                                        @change="select($event, id, false, 'method')" filled dense class="mt-0 full-width"
                                        label="檢驗方式" hide-details>
                                    </v-select>

                                </div>
                                <!-- <div class="select-bacteria" style="display: flex;align-items: flex-end;width: 100%;">
                            <v-text-field v-model="add.sample_deco" label="樣品包裝" :rules="rules.require" autocomplete="off" style="padding-top: 8px;margin-top: 0;width: 100%;margin-right: 16px;"></v-text-field>
                            <v-text-field v-model="add.sample_store" label="樣品保存" :rules="rules.require" autocomplete="off" style="padding-top: 8px;margin-top: 0;width: 100%;"></v-text-field>
                        </div> -->
                                <!-- 感染項目 -->
                                <v-select v-if="add.type == 1" v-model="add.disease_id"
                                    :items="add.species_id != undefined ? bacteriaAll.filter(x => x.id == add.species_id)[0]?.test.filter(y => y.id == add.method_id)[0].disease : []"
                                    :menu-props="{ maxHeight: '400' }" multiple chips
                                    @change="select($event, id, false, 'disease')" filled dense class="mx-0 my-8"
                                    label="感染項目" hide-details item-value="id" item-text="name_en">
                                    <template v-slot:selection="{ item }">
                                        <v-chip style="font-size: 12px;margin: 2px;color: #fff;" color="#408FBC"
                                            class="main" close @click:close="select(item, id, true)">
                                            {{ item.name_en }}
                                        </v-chip>

                                    </template>
                                </v-select>
                                <!-- 檢驗項目 直接使用感染項目清單 -->
                                <!-- 拿掉@change用意不明 -->
                                <v-select v-if="add.type == 1" v-model="add.test_id"
                                    :items="add.species_id != undefined ? bacteriaAll.filter(x => x.id == add.species_id)[0]?.test.filter(y => y.id == add.method_id)[0].disease : []"
                                    :menu-props="{ maxHeight: '400' }" multiple chips filled dense class="mx-0 my-8"
                                    label="檢驗項目" hide-details item-value="id" item-text="name_en">
                                    <!-- 移除用，不搞這個 -->
                                    <!-- <template
                              v-slot:selection="{ item }">
                              <v-chip
                                  style="font-size: 12px;margin: 2px;color: #fff;"
                                  color="#408FBC"
                                  class="main"
                                  close
                                  @click:close="select(item,id,true)"
                              >
                              {{ item.name_en }}
                              </v-chip>
                              
                          </template> -->
                                </v-select>
                                <div class="search-container mb-3">
                                    <span style="font-size: 12px;line-height: 12px;color: #6c9bcd;"
                                        :style="{ 'color': `${isSelectPool ? '#6c9bcd' : 'red'}` }">採樣池</span>
                                    <locate-select ref="poolSelect" id="reportpool" class="select-template"
                                        :dataScope="'pool'" :defaultSelect="add.pond_ids ? add.pond_ids : add.pond_id"
                                        :isMulti="true" @scopeSel_data="sampledata($event, id)"
                                        :class="{ 'error-text': !isSelectPool }" limit="1"></locate-select>
                                    <span v-if="(!isSelectPool)" class="error-text"
                                        style="font-size: 12px;">*必填項目</span>

                                </div>
                                <!-- <v-text-field v-model="add.position" label="檢驗單位" :rules="rules.require" autocomplete="off" style="padding-top: 8px;margin-top: 0;"></v-text-field> -->
                            </div>
                            <div class="select-item full-width">
                                <v-text-field v-model="add.msg" class="pt-2 mt-0" label="項目說明"
                                    :rules="rules.checklength" autocomplete="off"></v-text-field>
                                <!-- <v-file-input v-if="add.type==1" v-model="add.files" multiplelabel="File input"></v-file-input> -->
                                <v-file-input v-if="add.type !== 0 && !add.id" v-model="add.file" class="mt-0" accept=".pdf"
                                    :rules="rules.require" label="上傳文件(限*pdf)"
                                    @change="submitFiles($event, id)"></v-file-input>
                                <v-text-field v-else v-model="add.filename" class="pt-2 mt-0 full-width" label="檢驗報告"
                                    disabled hide-details></v-text-field>
                                <span v-if="add.pond_ids" class="error-text">*欲修改報告，請先刪除此檢驗報告重新新增</span>
                            </div>
                        </div>
                    </v-card-text>
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="btn-secondary" @click="reportDialog = false">取消</v-btn>
                    <v-btn class="btn-primary" @click="submitreport">{{ addReport[0].pond_ids ? '修改' : '新增' }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </div>
</template>
<script>
import dayjs from "dayjs";
export default{
    data() {
        return {
            reportvalid: false,
            isLoading:false,
            addReport: [{ msg: '', type: undefined }],
            bacteriaAll: [{
                sample: '白蝦',
                test: [
                    { method: 'iiPCR', disease: ['IsWSSV', 'IsEMSPlasmid', 'IsEMSToxin', 'IsEHP', 'IsTSV', 'IsIMNV', 'IsIHHNV', 'IsYHV'] },
                    { method: 'PCR', disease: ['IsWSSVFirst', 'IsWSSVNested', 'IsAHPNSPirA', 'IsAHPNSPirB', 'IsEHP', 'IsTSV', 'IsIMNV', 'IsIHHNV', 'IsYHV'] }
                ]
            }, {
                sample: '鱘龍魚',
                test: [
                    { method: '鱘龍魚iiPCR', disease: ['IsWSSV鱘龍魚', 'IsEMSPlasmid鱘龍魚', 'IsEMSToxin鱘龍魚', 'IsEHP鱘龍魚', 'IsTSV鱘龍魚', 'IsIMNV鱘龍魚', 'IsIHHNV鱘龍魚', 'IsYHV鱘龍魚'] },
                    { method: '鱘龍魚PCR', disease: ['IsWSSVFirst鱘龍魚', 'IsWSSVNested鱘龍魚', 'IsAHPNSPirA鱘龍魚', 'IsAHPNSPirB鱘龍魚', 'IsEHP鱘龍魚', 'IsTSV鱘龍魚', 'IsIMNV鱘龍魚', 'IsIHHNV鱘龍魚', 'IsYHV鱘龍魚'] }
                ]
            }, {
                sample: '紅蟳', test: [
                    { method: '紅蟳iiPCR', disease: ['IsWSSV紅蟳', 'IsEMSPlasmid紅蟳', 'IsEMSToxin紅蟳', 'IsEHP紅蟳', 'IsTSV紅蟳', 'IsIMNV紅蟳', 'IsIHHNV紅蟳', 'IsYHV紅蟳'] },
                    { method: '紅蟳PCR', disease: ['IsWSSVFirst紅蟳', 'IsWSSVNested紅蟳', 'IsAHPNSPirA紅蟳', 'IsAHPNSPirB紅蟳', 'IsEHP紅蟳', 'IsTSV紅蟳', 'IsIMNV紅蟳', 'IsIHHNV紅蟳', 'IsYHV紅蟳'] }
                ]
            },
            ],
            addOtherType: [{id:1,name_ch:'疾病檢驗',name_en:'disease'},{id:2,name_ch:'水質檢驗',name_en:'water'}],
            addStatus:[{name_ch:'正常',name:'normal'},{name_ch:'警告',name:'warning'},{name_ch:'異常',name:'danger'}],
            menu_reportdate: false,
            isSelectPool:true,
            rules: {
                require: [v => !!v || "*必要項目"],
                filesize: [
                    value => !value || value.size < 2000000 || "檔案大小必須小於 2 MB!",
                    v => !!v || "*必要項目"
                ],
                checklength: [v => v == null ? '' : v.length <= 100 || "*不可輸入超過100字元"],
                requireSelect: [v => !!v.length || "*必要項目"],
                requireNum: [v => (!!v || v > 0) || "*請輸入>0數字"]
            },
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog', true);//關閉dialog
        },
        // 取得物種清單
        async getType() {
            this.isLoading = false;
            let getSpeciesList = await this.getSpeciesList();//api:/breeding/species/
            //檢驗物種：白蝦、吳郭魚、...
            let data = typeof (getSpeciesList) == 'string' ? [] : getSpeciesList;
            if (data.length > 0) {
                this.bacteriaAll = data;
                this.addReport[0].species_id = this.bacteriaAll[0].id;
                await this.getMethod();
            } else {
                this.isLoading = true;
            }
        },
        // 取得檢驗方法
        async getMethod() {

            console.log('getMethod!!!');
            let getMethodList = await this.getMethodList();
            let data = typeof (getMethodList) == 'string' ? [] : getMethodList;
            // 跟著目前的池物種
            this.bacteriaAll.forEach(x => x.test = data);
            await this.getReportDisease();
        },
        // 取得疾病-清單
        async getReportDisease() {
            let parm = {
                species_id: this.addReport[0].species_id,
            };
            // 疾病-清單:
            //[{
            // "id": 1,
            // "name_ch": "白點病",
            // "name_en": "WSSV",
            // "remark": "感染大小不同之蝦隻，病蝦食慾明顯減退或廢絕，游動遲緩，浮游於水面或 靠岸，感染初期蝦隻全身顏色變暗或呈紅色，外殼出現小白斑。",
            // "created_user": "jeff",
            // "created_time": "2023-12-25 05:00:00",
            // "updated_user": "jeff",
            // "updated_time": "2023-12-25 05:00:00"
            // }, ...
            let getDiseaseList = await this.getDiseaseList(parm);//api:/breeding/disease/?species_id=XXXXXXX
            let data = typeof (getDiseaseList) == 'string' ? [] : getDiseaseList;
            //把疾病放到對應的物種方法裡
            // 使用map重設整個bacteriaAll，避免forEach塞疾病時，y.disease會被覆蓋掉 2
            this.bacteriaAll = this.bacteriaAll.map(x => {
                if (x.id === this.addReport[0].species_id) {
                    return {
                        ...x,
                        test: x.test.map(y => ({
                            ...y,
                            disease: _.cloneDeep(data)
                        }))
                    };
                }
                return x;
            });

            this.addReport[0].method_id = this.bacteriaAll.filter(x => x.id == this.addReport[0].species_id)[0].test[0].id;
            this.isLoading = true;
        },
        // 感染選擇
        select(item, id, bool = false, type) {
            console.log(item);
            if (bool) {
                var index = this.addReport[id].disease_id.indexOf(item);
                this.addReport[id].disease_id.splice(index, 1);
                // console.log('select',index,this.addReport[id].disease_id);
            } else {
                if (type == 'method') {
                    //filter先用物種ID抓出該物種的所有檢驗方法[0] 並從該方法的疾病中抓出第一個疾病ID??
                    // this.addReport[id].method_id = this.bacteriaAll.filter(x=>x.id==this.addReport[id].species_id)[0].test[0].id;
                    //清空疾病清單
                    this.addReport[id].disease_id = [];
                    //清空檢驗清單
                    this.addReport[id].test_id = [];

                }
            }
        },
        // 新增的項目類型切換
        selectadd(evt, id) {
            console.log('selectadd', evt, id);
            if (evt == 1) {
                this.addReport[id].method_id = this.bacteriaAll[0].test[0].id;
                this.addReport[id].execute_date = dayjs(new Date()).format("YYYY-MM-DD");
            } else {
                // this.addReport[id].sample = '';
                this.addReport[id].method_id = '';
                if (evt == 2) {
                    this.addReport[id].execute_date = dayjs(new Date()).format("YYYY-MM-DD");
                } else {
                    this.addReport[id].execute_date = null;
                }

            }
            this.addReport[id].pond_id = null;
            this.addReport[id].disease_id = [];
            this.addReport[id].file = null;
            this.addReport[id].position = '';
            this.addReport[id].status = this.addStatus[0].name_ch;
            this.isSelectPool = true;
        },
        submitFiles(evt, id) {
            if (this.addReport[id].file) {
                console.log('upload', this.addReport[id].file, this.nowViewer);
            } else {
                console.log("there are no files.");
            }
        },
        getNowDate: function (addnum, type) {
            var mydate;
            if (type == undefined) {
                type = 'day';
            }
            if (addnum != undefined && addnum > 0) {
                mydate = dayjs().add(addnum, type).format("YYYY-MM-DD");
            } else {
                mydate = dayjs().format("YYYY-MM-DD");
            }
            return mydate;
        },
        async submitreport() {
            let formData = new FormData();
            let parm = _.cloneDeep(this.addReport[0]);
            this.isSelectPool = true;
            if (parm.pond_ids) {

            } else {
                if (parm.pond_id == null || parm.pond_id.length == 0) {
                    this.isSelectPool = false;
                }
            }

            var valid = this.$refs.addform.validate();

            if (valid && this.isSelectPool) {
                if (this.addReport[0].pond_ids) {
                    //編輯
                    // parm.name_ch = parm.step_name_ch;
                    // parm.name_en = parm.step_name_en;
                    parm.updated_user = this.$auth.$state.user.email;
                    delete parm.pond_ids;
                    delete parm.type;
                    delete parm.species;
                    delete parm.file;
                    delete parm.filename;
                    delete parm.deft_executor;
                    delete parm.deft_verifier;
                    delete parm.execute_time;
                    delete parm.id;
                    delete parm.step_name_ch;
                    delete parm.step_name_en;

                    Object.keys(parm).forEach(x => {
                        formData.append(x, parm[x]);
                    });

                    let config = { headers: { "Content-Type": "multipart/form-data" } };
                    let url = this.addReport[0].type == 1 ? `/breeding/disease-testing-record/${this.addReport[0].id}/` : `/breeding/water-quality-testing-record/${this.addReport[0].id}/`;
                    console.log('parm', parm);
                    var res = false;
                    res = this.addReport[0].type == 1 ? await this.patchDiseaseTestingRecordList(formData, this.addReport[0].id) : await this.patchWaterTestingRecordList(formData, this.addReport[0].id);
                    setTimeout(async () => {
                        if (res) {
                            this.reportDialog = false;
                            if (this.addReport[0].type == 1) {
                                // await this.getDisease(); 改元件式新增，不需要
                            } else if (this.addReport[0].type == 2) {
                                // await this.getWater(); 改元件式新增，不需要
                            }
                        }
                    }, 50)
                } else {
                    //新增
                    parm.created_user = this.$auth.$state.user.email;

                    delete parm.type;
                    delete parm.species;
                    delete parm.file;
                    if (this.addReport[0].type == 2) {
                        delete parm.disease_id;
                        delete parm.method_id;
                    }
                    Object.keys(parm).forEach(x => {
                        formData.append(x, parm[x]);
                    });

                    formData.append("file", this.addReport[0].file);
                    let config = { headers: { "Content-Type": "multipart/form-data" } };
                    let url = this.addReport[0].type == 1 ? '/breeding/disease-testing-record/' : '/breeding/water-quality-testing-record/';

                    var res = false;
                    //postDiseaseTestingRecordList api:breeding/disease-testing-record/
                    //postWaterTestingRecordList api:breeding/water-quality-testing-record/
                    res = this.addReport[0].type == 1 ? await this.postDiseaseTestingRecordList(formData) : await this.postWaterTestingRecordList(formData);
                    // setTimeout(async () => {
                    //     if (res) {
                    //         console.log("setTimeout!!");
                    //         // this.reportDialog = false;
                    //         if (this.addReport[0].type == 1) {
                    //             // await this.getDisease();改元件式新增，不需要
                    //         } else if (this.addReport[0].type == 2) {
                    //             // await this.getWater();改元件式新增，不需要
                    //         }
                    //     }
                    // }, 5000)
                    // console.log('submit report', this.addReport);
                }

            }
            this.closeDialog();
        },
        sampledata(evt,id) {
        this.addReport[id].pond_id = evt;
        if(evt!==null&&this.addReport[id].pond_id.length>0) {
            this.isSelectPool = true;
        }else {
            this.isSelectPool = false;
        }
    },
    },
    async created() {
        await this.getType();//物種清單
    },
}
</script>