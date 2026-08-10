<template>
    <div>
    <v-overlay :value="loading" :absolute="true">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
        <v-form v-model="editValid" ref="addform" class="pa-0">
            <v-card elevation="0" dense class="pa-0" style="min-height: 800px;">
                <v-card-title class="add-title"  v-if="false">
                    <div class="d-inline-block">
                        <span>{{nowBacteria=='add'?'新增菌相':'編輯菌相'}}</span> 
                    </div>
                    <div class="add">
                        <v-btn class="btn-secondary close"
                                title="取消" 
                                @click="closeDialog()">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
               </v-card-title>
                <div class="basic">
                    <!-- 1. 基本資料 -->
                    <div class="card-title ma-3">
                        <div class="title">
                            <v-card-title class="pa-0" style="font-size:1rem;">1. 基本資料</v-card-title>
                        </div>
                    </div>
                    <v-card-text v-if="nowBacteria=='add'" class="d-flex flex-column mb-4 py-0">
                        <v-row class="align-center pt-4">
                            <v-col cols="6" class="pa-0 pl-2">
                                <locate-select :dataScope="'pool'" defaultSelect="" :isMulti="false"
                                    @scopeSel_data="get_scopeDataAdd($event)" class="select-template"></locate-select>
                                <div v-if="isPoolError" class="error-text">*必要項目</div>
                            </v-col>
                            <v-col cols="6" class="pa-0 pl-2" style="padding: 0;padding-left: 8px;">
                                <div class="date-time-picker">
                                    <span style="font-size: 12px;margin-right: 9px;">檢測結果時間</span>
                                </div>
                                <div class="date-time-picker full-width">
                                    <v-icon
                                        @click="showDate = false; editItem.inspected_time = getNowDateTime(); showDate = true;">mdi-calendar</v-icon>
                                    <a-date-picker v-model="editItem.inspected_time"
                                        size="small"
                                        format="yyyy-MM-DD HH:mm" :show-time="{ format: 'HH:mm' }" placeholder="檢測結果時間"
                                        @change="onChange" />
                                </div>
                                <span v-if="isInspectedTime" class="error-text ml-2 mb-2"
                                    style="font-size: 12px;">*必要項目</span>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-text class="d-flex flex-column py-0 mb-4">
                      <v-row class="align-center pt-4">
                        <v-col cols="6" class="pa-0 pl-2">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">水樣稀釋倍率(X)</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.dilution"
                            :rules="rules.require"
                            placeholder="水樣稀釋倍率"
                            autocompleted="false"
                            step="0.1"
                            class="mr-2 mt-0 pt-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" class="pa-0 pl-2">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">塗盤體積(ul)</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.volume"
                            :rules="rules.require"
                            placeholder="塗盤體積"
                            autocompleted="false"
                            class="mr-2 mt-0 pt-0"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <!-- 2. 輸入菌數 -->
                    <div class="card-title ma-3">
                      <div class="title">
                          <v-card-title class="pa-0" style="font-size:1rem;">2. 輸入菌數<span style="color: red">(*請輸入盤上菌落數)</span></v-card-title>
                      </div>
                    </div>
                    <v-card-text class="d-flex flex-column mb-4">
                      <v-row class="align-center pt-4">
                        <v-col cols="6" class="pa-0 pl-2">
                          <v-radio-group class="my-1" row v-model="nowAdd" label="菌盤" mandatory @change="addChange" hide-details>
                            <v-radio v-for="(item, i) in ['chormager','nb']" :label="item" :value="item" :key="i">
                              <span slot="label" class="flex-align-center">
                                {{ item }}
                              </span></v-radio>
                          </v-radio-group>
                        </v-col>
                        <v-col cols="6" class="pa-0 pl-2">
                          <div class="date-time-picker"><span style="font-size: 16px;margin-right: 9px;">有無加熱{{ nowAdd=='chormager'?'(不可選擇)':'' }}</span></div>
                          <v-checkbox v-model="editItem.is_heated" class="mt-0" :label="editItem.is_heated?'有':'無'" hide-details :disabled="nowAdd=='chormager'"></v-checkbox>
                          <!-- <v-switch v-model="editItem.is_heated" hide-details :label="editItem.is_heated?'有':'無'" style="margin-top: 0;" :disabled="nowAdd=='chormager'"></v-switch> -->
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <!-- 白 藍 菌 -->
                    <v-card-text v-if="nowAdd=='chormager'" class="d-flex flex-column pt-0 mb-4">
                      <v-row class="align-center pt-4">
                        <v-col cols="6" class="pa-0 pl-2">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">溶藻弧菌(<span style="background-color: black; color: white;">白菌</span>)</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.class1"
                            placeholder="溶藻弧菌(白菌)"
                            autocompleted="false"
                            class="mr-2 mt-0 pt-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" class="pa-0 pl-2">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">創傷弧菌(<span style="background-color: blue; color: white;">藍菌</span>)</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.class4"
                            placeholder="創傷弧菌(藍菌)"
                            autocompleted="false"
                            class="mr-2 mt-0 pt-0"
                          ></v-text-field>
                        </v-col>
                        
                      </v-row>
                    </v-card-text>
                    <!-- 靛 紫 菌 -->
                     <v-card-text v-if="nowAdd=='chormager'" class="d-flex flex-column pt-0 mb-4">
                      <v-row class="align-center pt-4">
                        <v-col cols="6" class="pa-0 pl-2">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">霍亂弧菌(<span style="background-color: Indigo; color: white;">靛菌</span>)</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.class2"
                            placeholder="霍亂弧菌(靛菌)"
                            autocompleted="false"
                            class="mr-2 mt-0 pt-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" class="pa-0 pl-2">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">腸炎弧菌(<span style="background-color: purple; color: white;">紫菌</span>)</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.class3"
                            placeholder="腸炎弧菌(紫菌)"
                            autocompleted="false"
                            class="mr-2 mt-0 pt-0"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <!-- NB 菌 / 影像上傳-->
                    <v-card-text class="d-flex flex-column pt-0 mb-4">
                      <v-row class="align-center pt-4">
                        <v-col v-if="nowAdd=='nb'" cols="6" class="pa-0 pl-2">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">{{editItem.is_heated?'枯草桿菌(加熱)的數量':'總菌數(不加熱)'}}</span>
                          </div>
                          <v-text-field
                            type="number"
                            min="0"
                            v-model="editItem.class5"
                            :placeholder="editItem.is_heated?'枯草桿菌數量':'總菌數'"
                            autocompleted="false"
                            class="mr-2 mt-0 pt-0"
                          ></v-text-field>
                        </v-col>
                        <v-col :cols="nowAdd=='nb'?'12':'12'" class="pa-0 pl-2">
                          <div class="date-time-picker">
                            <span style="font-size: 16px;margin-right: 9px;">影像</span>
                          </div>
                          <span v-if="nowBacteria=='edit'" class="error-text ml-2" style="font-size: 12px;">*欲編輯影像請刪除後重新新增</span>
                          <v-file-input v-if="nowBacteria=='add'" v-model="editItem.img" class="mt-0 full-width" :rules="rules.require" accept="image/*" label="上傳影像(限*jpg/*png)"></v-file-input>
                        </v-col>
                      </v-row>
                    </v-card-text>
                </div>
                <v-card-actions>
                    <v-spacer spacer></v-spacer>
                    <v-btn class="btn-secondary" @click="closeDialog()">取消</v-btn>
                    <v-btn class="btn-primary" @click="save">{{nowBacteria=='add'?'新增':'修改'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </div>
</template>
<script>
import "element-ui/lib/theme-chalk/index.css";
import dayjs from "dayjs";
import _ from "lodash";
export default {
    data() {
        return {
            loading: false,
            editValid: false,
            nowBacteria: 'add',
            editItem:{
                pond_id: '',
                inspected_time: '',
                dilution: '',
                volume: '',
                class1: null,
                class2: null,
                class3: null,
                class4: null,
                class5: null,
                is_heated: false,
                img: null,
            },
            showDate: false,
            nowAdd:'chormager',
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
            isPoolError: false,
            isInspectedTime: false,
        }
    },
    methods: {
        save:async function() {
            var valid = this.$refs.addform.validate();
            if (this.editItem.inspected_time == '' || this.editItem.inspected_time == null) {
                this.isInspectedTime = true;
            }
            if (this.editItem.pond_id == null || this.editItem.pond_id == '') {
                this.isPoolError = true;
            }
            if (valid && !this.isInspectedTime && !this.isPoolError) {
                this.loading = true;
                let parm = _.cloneDeep(this.editItem);
                parm.inspected_time = dayjs(new Date(parm.inspected_time)).format("YYYY-MM-DD HH:mm") + ':00';
                for (let i = 0; i < 5; i++) {
                    if (parm['class' + (i + 1)] == null) {
                        parm['class' + (i + 1)] = '';
                    }
                }

                parm.dilution = parseFloat(parm.dilution).toFixed(1);
                parm.created_user = this.$auth.$state.user.email;
                parm.name = parm.img.name;
                delete parm.img;
                delete parm.class;
                let formData = new FormData();
                Object.keys(parm).forEach(x => {
                    formData.append(x, parm[x]);
                })
                formData.append("img", this.editItem.img);
                
                switch (this.nowBacteria) {
                    case 'add':
                        var res = false;
                        res = await this.postBacteriaImageDataList(formData);
                        setTimeout(() => {
                            if (res) {
                                this.closeDialog();
                            }
                            this.loading = false;
                        }, 50)
                        break;
                    case 'edit':
                        this.loading = false;
                        break;
                    default:
                        this.loading = false;
                        break;
                }
            }

        },
        addChange() {
            this.editItem.class1 = null;
            this.editItem.class2 = null;
            this.editItem.class3 = null;
            this.editItem.class4 = null;
            this.editItem.class5 = null;
            if (this.nowAdd == 'chormager') {
                this.editItem.is_heated = false;
            }
        },
        onChange(value, dateString) {
            if (value !== null) {
                this.editItem.inspected_time = this.$moment(new Date(value), 'YYYY-MM-DD HH:mm');
                this.isInspectedTime = false;
            } else {
                this.editItem.inspected_time = '';
            }

        },
        getNowDateTime() {
            return this.$moment(new Date(), 'YYYY-MM-DD HH:mm');
        },
        get_scopeDataAdd(evt) {
            this.editItem.pond_id = evt.toString();
            this.isPoolError = false;
        },
        closeDialog() {
            this.$emit('closeDialog', true);
        },
    },
    created() {
        this.loading = false;
    },
}
</script>
