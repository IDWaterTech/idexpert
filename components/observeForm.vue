<template>
    <div>
        <v-form ref="obsForm" v-model="obsValid" lazy-validation>
            <v-overlay :value="!dialogLoading" :absolute="true">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-card class="custom-dialog">
                <v-card-title class="add-title">
                    <div style="display: inline-block;">
                        {{ nowObserve == 'edit' ? '編輯' : '新增' }}
                    </div>
                    <div class="add">
                        <v-btn class="btn-secondary close" title="取消" @click="closeDialog()"
                            style="border: none;min-width: 0;padding: 0 4px;">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <v-card-text style="padding-top: 8px">
                    <div class="basic" style="padding-left: 8px;">
                        <v-card-text class="flex-align-center" v-if="showlocate"
                            style="padding-top: 0;padding-bottom: 0;">
                            <span class="pa-0 ma-0" slot="prepend"
                                style="width: 92px;font-size: 16px;color: rgba(0, 0, 0, 0.87);">養殖池</span>
                            <locate-select :dataScope="'pool'" :defaultSelect="''" :isMulti="false"
                                @scopeSel_data="selectObserveData($event)" class="select-template"></locate-select>
                        </v-card-text>
                        <span v-if="isPondId" class="error-text ml-2"
                            style="font-size: 12px;margin-bottom: 8px;">*必填項目</span>
                        <v-card-text class="flex-align-center" style="padding-top: 16px;">
                            <span class="pa-0 ma-0"
                                style="width:120px;font-size: 16px;color: rgba(0, 0, 0, 0.87);"><v-icon
                                    @click="showDate = false; observeEdit['inspected_time'] = getNowDateTime(); showDate = true;"
                                    slot="prepend" style="color:#006AA6">mdi-calendar</v-icon>檢測時間</span>
                            <div class="date-time-picker" style="width:100%">
                                <a-date-picker v-model="observeEdit['inspected_time']" value="null"
                                    format="yyyy-MM-DD HH:mm" show-time placeholder=""
                                    style="min-width: none;width: 100%;" />
                            </div>
                        </v-card-text>
                        <span v-if="isInspectedTime" class="error-text ml-2"
                            style="font-size: 12px;margin-bottom: 8px;">*必填項目</span>
                        <v-card-text class="flex-align-center" style="padding-top: 16px;">
                            <v-row style="margin-bottom: 0;">
                                <!-- 觀察網隻數 -->
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.number="observeEdit['observation_qty']" min="0" type="number"
                                        dense class="mt-0 mr-2" hide-details @change="changeQty()"><span
                                            class="pa-0 ma-0" slot="prepend"
                                            style="width: 80px;">觀察網隻數</span></v-text-field>
                                </v-col>
                                <!-- 觀察網殘餌量 -->
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.number="observeEdit['feed_amount']" type="number" min="0"
                                        dense class="mt-0 mr-2" hide-details><span class="pa-0 ma-0" slot="prepend"
                                            style="width: 80px;">觀察網殘餌量(g)</span></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text class="flex-align-center" v-if="observeEdit['observation_qty'] > 0"
                            style="padding-top: 0;">
                            <v-row style="margin-bottom: 0;">
                                <!-- 脫殼數量 -->
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.number="observeEdit['shell_qty']" min="0" type="number" dense
                                        class="mt-0 mr-2" hide-details><span class="pa-0 ma-0" slot="prepend"
                                            style="width: 80px;">脫殼數量</span></v-text-field>
                                </v-col>
                                <!-- 死蝦數量 -->
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.number="observeEdit['dead_shrimp_qty']" type="number" min="0"
                                        filled dense hide-details class="mt-0"><span class="pa-0 ma-0" slot="prepend"
                                            style="width: 80px;">死蝦數量</span></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text class="flex-align-center" v-if="observeEdit['observation_qty'] > 0"
                            style="padding-top: 0;">
                            <v-row style="margin-bottom: 0;">
                                <!-- 蝦隻重量 -->
                                <v-col cols="12" md="6" @click="openShrimps()">
                                    <v-text-field v-model.number="observeEdit['shrimp_weight']" type="number" min="0"
                                        dense class="mt-0 mr-2" hide-details @click="openShrimps()"><span
                                            class="pa-0 ma-0" slot="prepend"
                                            style="width: 80px;">蝦隻重量(g)</span></v-text-field>

                                </v-col>
                                <!-- 是否人工打樣 -->
                                <v-col cols="12" md="6">
                                    <v-checkbox class="checkbox" v-model="observeEdit['is_sample']" hide-details
                                        label="是否人工打樣" style="margin-top: 0;padding-top: 0;"></v-checkbox>
                                </v-col>
                            </v-row>

                            <!-- <v-btn class="btn-secondary btn-small">填寫</v-btn> -->
                        </v-card-text>
                        <div v-if="observeEdit['observation_qty'] > 0" class="shrimp-statue">
                            <!-- 腸線顏色 -->
                            <div class="card-title">
                                <div class="title flex-align-center">
                                    <v-card-title>腸線顏色</v-card-title>
                                    <span v-if="isOver.ic" class="error-text ml-2"
                                        style="font-size: 12px;">*不等於觀察網隻數</span>
                                </div>
                            </div>
                            <v-card-text class="border-bottom flex-align-center" style="padding-top: 0;">
                                <v-row style="width: 100%;align-items: center;">
                                    <v-col cols="12" md="6" sm="6" v-for="(item, id) in observeEdit.IntestinalColor"
                                        :key="'IntestinalColor_' + id" style="width: 100%;">
                                        <div class="chips flex-align-center" style="margin-bottom: 8px;width: 100%;">
                                            <span class="pa-0 ma-0" slot="prepend"
                                                style="width:60px;min-height:inherit">{{ item.name_ch }}</span>
                                            <el-input-number class="ml-2" v-model="item.value" size="mini" :step="1"
                                                :min="0" prop="number" @change="changeChips"></el-input-number>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <!-- 肝胰臟顏色 -->
                            <div class="card-title">
                                <div class="title flex-align-center">
                                    <v-card-title>肝胰臟顏色</v-card-title>
                                    <span v-if="isOver.hc" class="error-text ml-2"
                                        style="font-size: 12px;">*不等於觀察網隻數</span>
                                </div>
                            </div>
                            <v-card-text class="border-bottom flex-align-center" style="padding-top: 0;">
                                <v-row style="width: 100%;align-items: center;">
                                    <v-col cols="12" md="6" sm="6" v-for="(item, id) in observeEdit.HepatopancreasColor"
                                        :key="'HepatopancreasColor_' + id" style="width: 100%;">
                                        <div class="chips flex-align-center" style="margin-bottom: 8px;width: 100%;">
                                            <span class="pa-0 ma-0" slot="prepend"
                                                style="width:60px;min-height:inherit">{{ item.name_ch }}</span>
                                            <el-input-number class="ml-2" v-model="item.value" size="mini" :step="1"
                                                :min="0" prop="number"></el-input-number>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>

                            <!-- 肌肉顏色 -->
                            <div class="card-title">
                                <div class="title flex-align-center">
                                    <v-card-title>肌肉顏色</v-card-title>
                                    <span v-if="isOver.mc" class="error-text ml-2"
                                        style="font-size: 12px;">*不等於觀察網隻數</span>
                                </div>
                            </div>
                            <v-card-text class="border-bottom flex-align-center" style="padding-top: 0;">
                                <v-row style="width: 100%;align-items: center;">
                                    <v-col cols="12" md="6" sm="6" v-for="(item, id) in observeEdit.MuscleColor"
                                        :key="'MuscleColor_' + id" style="width: 100%;">
                                        <div class="chips flex-align-center" style="margin-bottom: 8px;width: 100%;">
                                            <span class="pa-0 ma-0" slot="prepend"
                                                style="width:60px;min-height:inherit">{{ item.name_ch }}</span>
                                            <el-input-number class="ml-2" v-model="item.value" size="mini" :step="1"
                                                :min="0" prop="number"></el-input-number>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <!-- 蝦體顏色 -->
                            <div class="card-title">
                                <div class="title flex-align-center">
                                    <v-card-title>蝦體顏色</v-card-title>
                                    <span v-if="isOver.bc" class="error-text ml-2"
                                        style="font-size: 12px;">*不等於觀察網隻數</span>
                                </div>
                            </div>
                            <v-card-text class="border-bottom flex-align-center" v-show="showBodyColor"
                                style="padding-top: 0;">
                                <v-row style="width: 100%;align-items: center;">
                                    <v-col cols="12" md="6" sm="6" v-for="(item, id) in observeEdit.BodyColor"
                                        :key="'BodyColor_' + id" style="width: 100%;">
                                        <div class="chips flex-align-center" style="margin-bottom: 8px;width: 100%;">
                                            <span class="pa-0 ma-0" slot="prepend"
                                                style="width:60px;min-height:inherit">{{ item.name_ch }}</span>
                                            <el-input-number class="ml-2" v-model="item.value" size="mini" :step="1"
                                                :min="0" prop="number"></el-input-number>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <!-- 蝦體形狀 -->
                            <div class="card-title">
                                <div class="title flex-align-center">
                                    <v-card-title>蝦體形狀</v-card-title>
                                    <span v-if="isOver.bs" class="error-text ml-2"
                                        style="font-size: 12px;">*不等於觀察網隻數</span>
                                </div>
                            </div>
                            <v-card-text class="border-bottom flex-align-center" style="padding-top: 0;">
                                <v-row style="width: 100%;align-items: center;">
                                    <v-col cols="12" md="6" sm="6" v-for="(item, id) in observeEdit.BodyShape"
                                        :key="'BodyShape_' + id" style="width: 100%;">
                                        <div class="chips flex-align-center" style="margin-bottom: 8px;width: 100%;">
                                            <span class="pa-0 ma-0" slot="prepend"
                                                style="width:60px;min-height:inherit">{{ item.name_ch }}</span>
                                            <el-input-number class="ml-2" v-model="item.value" size="mini" :step="1"
                                                :min="0" prop="number"
                                                @change="change('BodyShape', item.name_en)"></el-input-number>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </div>
                        <!-- 觀察網影像 -->
                        <div class="card-title">
                            <div class="title" style="display: flex;align-items: center;">
                                <v-card-title>觀察網影像</v-card-title>
                                <span v-if="nowObserve == 'edit'" class="error-text ml-2"
                                    style="font-size: 12px;">*欲編輯照片請刪除後重新新增</span>
                            </div>
                        </div>
                        <v-card-text style="display: flex;flex-direction:column;align-items: center;padding-top: 0;">
                            <v-file-input v-if="nowObserve == 'add'" v-model="observeEdit.img_a" accept="image/*"
                                label="上傳影像(限*jpg/*png)" style="margin-top: 0;width: 100%;"></v-file-input>
                            <v-file-input v-if="nowObserve == 'add'" v-model="observeEdit.img_b" accept="image/*"
                                label="上傳影像(限*jpg/*png)" style="margin-top: 0;width: 100%"></v-file-input>
                            <v-file-input v-if="nowObserve == 'add'" v-model="observeEdit.img_c" accept="image/*"
                                label="上傳影像(限*jpg/*png)" style="margin-top: 0;width: 100%;"></v-file-input>
                        </v-card-text>
                    </div>
                </v-card-text>
                <v-card-actions style="padding: 24px 12px;">
                    <v-spacer></v-spacer>
                    <v-btn class="btn-secondary" @click="closeDialog()">取消</v-btn>
                    <v-btn class="btn-primary" @click="observeSubmit">{{ nowObserve == 'edit' ? '編輯' : '新增' }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
        <v-dialog v-model="shrimpDialog" max-width="500px">
          <v-form ref="shrimpform" v-model="shrimpValid" lazy-validation>
            <v-card class="custom-dialog" id="shrimpDialog">
              <v-card-title class="add-title">
                <div style="display: inline-block;">
                  {{ nowObserve=='edit'?'編輯':'新增' }} 蝦隻紀錄
                </div>
                <div class="add">
                  <v-btn  class="btn-secondary close"
                    title="取消" 
                    @click="shrimpDialog = false" 
                    style="border: none;min-width: 0;padding: 0 4px;">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text style="padding-top: 8px">
                <div class="basic" style="padding-left: 8px;">
                  <span v-if="isShrimp" class="error-text" style="margin-bottom: 16px;">*長度與重量須大於0</span>
                  <v-card-text class="border-bottom flex-align-center" style="padding: 0;padding-top: 16px;" v-for="(s,sid) in shrimp" :key="'shrimp_'+sid">
                    <span style="margin-top: -16px;">{{ sid+1 }}.</span>
                    <v-row style="margin-bottom: 0;">
                      <v-col cols="12" md="6" sm="12" class="flex-align-center" style="padding-right: 8px;">
                        <span class="pa-0 ma-0" style="width:60px;min-height:inherit">長度(cm)</span>
                        <el-input-number
                            class="ml-2"
                            v-model="s['length']"
                            size="mini"
                            :step="0.1"
                            :min="0"
                            prop="number"
                            :class="{'shrimp-error':isShrimp&&s['length']==0}"
                        ></el-input-number>
                      </v-col>
                      <v-col cols="12" md="6" sm="12" class="flex-align-center" style="padding-right: 8px;">
                        <span class="pa-0 ma-0" style="width:60px;min-height:inherit">重量(g)</span>
                        <el-input-number
                            class="ml-2"
                            v-model="s['weight']"
                            size="mini"
                            :step="0.1"
                            :min="0"
                            prop="number"
                            :class="{'shrimp-error':isShrimp&&s['weight']==0}"
                        ></el-input-number>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </div>
              </v-card-text>
              <v-card-actions style="padding: 24px 12px;">
                <v-spacer></v-spacer>
                <v-btn class="btn-secondary" @click="shrimpDialog = false">取消</v-btn>
                <v-btn class="btn-primary" @click="confirmShrimps">{{ nowObserve=='edit'?'編輯':'確認' }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            nowObserve: 'add',
            obsValid: false,
            dialogLoading: true,
            showlocate: true,
            observeEdit: {
                "observation_qty": 0,
                "shell_qty": 0,
                "dead_shrimp_qty": 0,
                "shrimp_weight": null,
                "inspected_time": null,
                "feed_amount": 0,
                "pond_id": '',
                "img_a": null,
                "img_b": null,
                "img_c": null,
                "shrimps": [],
                "is_sample": false,
            },
            showDate: true,
            //顯示*星號文字
            isPondId: false,
            isInspectedTime: false,
            // 送出前檢查個顏色數量有無超過隻數
            isOver: {
                ic: false,
                hc: false,
                mc: false,
                bc: false,
                bs: false
            },
            shrimpDialog:false,
            shrimp:[],
            isShrimp: false,
            optData:[],
            showBodyColor: true,
            shrimpValid:true,
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog', true);//關閉dialog
        },
        getNowDateTime() {
            return this.$moment(new Date(), 'YYYY-MM-DD HH:mm');
        },
        selectObserveData(evt) {
            // console.log(evt);
            this.observeEdit.pond_id = evt;
        },
        changeQty() {
            console.log("changeQty");
            // 觀察網隻數>0
            if (this.observeEdit.observation_qty > 0) {
                if (this.observeEdit.shrimps && this.observeEdit.shrimps.length > 0) {
                    this.shrimp = _.cloneDeep(this.observeEdit.shrimps);
                    this.caculateShrimp();
                }
            } else {
                this.shrimp = [];
                this.observeEdit.shrimps = [];
                this.shell_qty = 0; //???????????????????
                this.dead_shrimp_qty = 0; //????????????????????????
                const resetKeys = [
                    'BodyColor',
                    'BodyShape',
                    'HepatopancreasColor',
                    'IntestinalColor',
                    'MuscleColor',
                ];
                this.observeEdit.shrimp_weight = null;//蝦重沒有
                Object.keys(this.optData).forEach(key => {
                    if (resetKeys.includes(key)) {
                        this.observeEdit[key].forEach(item => {
                            item.value = 0;
                        });
                    }
                });
            }
        },
        changeChips() {
            // 蝦隻狀態隻數更改要清空重新給定，避免資料未刷新
            let data = _.cloneDeep(this.observeEdit);
            this.observeEdit = {};
            this.observeEdit = data;
        },
        caculateShrimp() {
            if (this.shrimp.length < this.observeEdit.observation_qty) {
                for (let i = this.shrimp.length; i < this.observeEdit.observation_qty; i++) {
                    this.shrimp.push({ length: 0, weight: 0 })
                }
            } else if (this.shrimp.length > this.observeEdit.observation_qty) {
                this.shrimp = [];
                for (let i = 0; i < this.observeEdit.observation_qty; i++) {
                    this.shrimp.push(this.observeEdit.shrimps[i]);
                }
                this.observeEdit.shrimps = _.cloneDeep(this.shrimp);
            }
            let num = 0;
            let nowShrimp = 0
            this.shrimp.forEach(s => {
                if (s.weight > 0) {
                    num = num + s.weight;
                    nowShrimp++;
                }

            })
            this.observeEdit.shrimp_weight = (((num / nowShrimp) * 1000) / 1000).toFixed(3);
        },
        getFilter(odata) {
            // this.maindata.forEach(x => {
            //     x.node.forEach(y => {
            //         y.node.forEach(z => {
            //             if (z.id == odata.pond_id) {
            //                 odata.pond = y.name + '_' + z.name;
            //             }
            //         })
            //     })
            // })
            const targetKeys = new Set([
                'BodyColor',
                'BodyShape',
                'HepatopancreasColor',
                'IntestinalColor',
                'MuscleColor'
            ]);

            let num = 0;

            Object.keys(this.optData).forEach(key => {
                if (!targetKeys.has(key)) return;

                // 沒有資料時，建立預設值
                if (!odata[key]) {
                    odata[key] = _.cloneDeep(this.optData[key]).map(item => ({
                        ...item,
                        value: 0
                    }));
                    return;
                }

                // 建立 name_en 對照表，加快查找速度
                const optionMap = new Map(
                    this.optData[key].map(item => [
                        item.name_en.toUpperCase(),
                        item
                    ])
                );

                const data = Object.entries(odata[key])
                    .map(([name, value]) => {
                        const option = optionMap.get(name.toUpperCase());
                        if (!option) return null;

                        const item = _.cloneDeep(option);
                        item.value = value;
                        return item;
                    })
                    .filter(Boolean)
                    .sort((a, b) => b.value - a.value);

                odata[key] = data;
                num++;
            });
            odata.img = [];
            if (odata.img_a !== null && odata.img_a.length > 0) {
                odata.img.push(odata.img_a);
            }
            if (odata.img_b !== null && odata.img_b.length > 0) {
                odata.img.push(odata.img_b);
            }
            if (odata.img_c !== null && odata.img_c.length > 0) {
                odata.img.push(odata.img_c);
            }
        },
        // 蝦隻重量個別輸入長度和重量的Dialog
        openShrimps() {
            this.shrimpDialog = true;
            this.isShrimp = false;
            this.shrimp = [];
            if (this.observeEdit.shrimps && this.observeEdit.shrimps.length > 0) {
                this.shrimp = _.cloneDeep(this.observeEdit.shrimps);
                this.caculateShrimp();
            } else {
                for (let i = 0; i < this.observeEdit.observation_qty; i++) {
                    this.shrimp.push({ length: 0, weight: 0 })
                }
            }

        },
        // 蝦隻重量個別輸入長度和重量
        confirmShrimps() {
            this.isShrimp = false;
            this.shrimp.forEach(x => {
                if (x.length == 0 && x.weight == 0) {
                    this.isShrimp = true;
                }
            })
            if (!this.isShrimp) {
                this.observeEdit.shrimps = _.cloneDeep(this.shrimp);
                let num = 0;
                let nowShrimp = 0
                this.shrimp.forEach(s => {
                    if (s.weight > 0) {
                        num = num + s.weight;
                        nowShrimp++;
                    }

                })
                this.observeEdit.shrimp_weight = (((num / nowShrimp) * 1000) / 1000).toFixed(3);
                this.shrimpDialog = false;
            } else {
                // alert('長度與重量須大於0');
                document.getElementById('shrimpDialog').scrollTop = 0;
            }
            this.$nextTick(() => {
                this.$refs.shrimpform.reset();
            })
        },
        // 蝦隻狀態新增/編輯
        async observeSubmit() {
            this.$toast.info("observeSubmit!!!", { duration: 2000 });
            return;
            let isError = false;
            if (!this.observeEdit.pond_id || this.observeEdit.pond_id == null) {
                this.isPondId = true;
                isError = true;
            } else {
                this.isPondId = false;
            }
            if (!this.observeEdit.inspected_time || this.observeEdit.inspected_time == null) {
                this.isInspectedTime = true;
                isError = true;
            } else {
                this.isInspectedTime = false;
            }
            let parm = _.cloneDeep(this.observeEdit);
            // 計算是否超過觀察網隻數
            let num = { ic: 0, hc: 0, mc: 0, bc: 0, bs: 0 }
            this.isOver = { ic: false, hc: false, mc: false, bc: false, bs: false }
            var keyLst = Object.keys(this.optData);
            keyLst.forEach(k => {
                if (k == 'BodyColor' || k == 'BodyShape' || k == 'HepatopancreasColor' || k == 'IntestinalColor' || k == 'MuscleColor') {
                    parm[k] = {};
                    this.observeEdit[k].forEach(o => {
                        parm[k][o.name_en] = o.value;
                        if (k == 'BodyColor') {
                            num.bc += parseInt(o.value);
                        } else if (k == 'BodyShape') {
                            num.bs += parseInt(o.value);
                        } else if (k == 'HepatopancreasColor') {
                            num.hc += parseInt(o.value);
                        } else if (k == 'IntestinalColor') {
                            num.ic += parseInt(o.value);
                        } else if (k == 'MuscleColor') {
                            num.mc += parseInt(o.value);
                        }
                    })
                    console.log('num', num, parm.observation_qty)

                }
            })
            if (!parm.is_sample && num.bc !== parm.observation_qty) {
                this.isOver.bc = true;
                isError = true;
            }
            if (!parm.is_sample && num.bs !== parm.observation_qty) {
                this.isOver.bs = true;
                isError = true;
            }
            if (!parm.is_sample && num.hc !== parm.observation_qty) {
                this.isOver.hc = true;
                isError = true;
            }
            if (!parm.is_sample && num.ic !== parm.observation_qty) {
                this.isOver.ic = true;
                isError = true;
            }
            if (!parm.is_sample && num.mc !== parm.observation_qty) {
                this.isOver.mc = true;
                isError = true;
            }

            if (!isError) {
                this.dialogLoading = false;
                // 回傳資料整合
                delete parm.img;
                delete parm.feed_amount;
                delete parm.numOfColor;
                if (this.nowObserve == 'edit') {
                    delete parm.shrimp_id;
                    delete parm.leftover_id;
                }
                parm.pond_id = parseInt(parm.pond_id);
                if (this.nowObserve == 'edit') {
                    parm.updated_user = this.$auth.$state.user.email;
                    delete parm.created_user;
                } else {
                    parm.created_user = this.$auth.$state.user.email;
                }

                parm.inspected_time = dayjs(parm.inspected_time).format("YYYY-MM-DD HH:mm:ss");
                let formData = new FormData();
                console.log('submit', parm)
                Object.keys(parm).forEach(x => {
                    if (x == 'BodyColor' || x == 'BodyShape' || x == 'HepatopancreasColor' || x == 'IntestinalColor' || x == 'MuscleColor' || x == 'shrimps') {
                        formData.append(x, JSON.stringify(parm[x]));
                    } else {
                        formData.append(x, parm[x]);
                    }

                })
                let config = { headers: { "Content-Type": "multipart/form-data" } };
                var res = false;
                res = this.nowObserve == 'add' ? await this.postObservationRecordList(formData) :
                    await this.patchObservationRecordList(formData, this.observeEdit.shrimp_id);
                setTimeout(() => {
                    if (res) {
                        if (this.nowObserve == 'add') {
                            if (this.observeEdit.feed_amount !== null && this.observeEdit.feed_amount !== '') {
                                this.postObservable(this.observeEdit);
                            } else {
                                this.observeDialog = false;
                                this.getObservationData();
                                this.$toast.success("成功", { duration: 2000 });
                            }
                        } else {
                            let observe = this.observableData.filter(x => x.shrimp_id == this.observeEdit.shrimp_id)[0];
                            if (observe.feed_amount !== this.observeEdit.feed_amount) {
                                if (observe.feed_amount !== 0 && (observe.feed_amount == null || observe.feed_amount == '')) {
                                    if ((this.observeEdit.feed_amount !== null && this.observeEdit.feed_amount !== '')) {
                                        this.nowObserve = 'add';
                                        this.postObservable(this.observeEdit);
                                    }
                                } else {
                                    if (this.observeEdit.feed_amount == null || this.observeEdit.feed_amount == '') {
                                        this.deleteObservable(this.observeEdit.leftover_id);
                                    } else {
                                        this.postObservable(this.observeEdit);
                                    }

                                }

                            } else {
                                this.observeDialog = false;
                                this.getObservationData();
                            }
                        }
                    }
                    this.dialogLoading = true;
                }, 50)
            } else {
                alert('請再次檢查是否有數值輸入錯誤')
            }

        },
        // 觀察網
        // 取得顏色的項目
        getOptData: async function () {
            if (this.optData.length == 0) {
                let getFieldOtptionList = await this.getFieldOtptionList();
                let data = typeof (getFieldOtptionList) == 'string' ? [] : getFieldOtptionList;
                this.optData = data;
                // console.log("getOptData:",this.optData);


                //觀察網資料
                // let datas = _.cloneDeep(this.observableData);
                // this.observableData = [];
                // datas.forEach(odata => {
                //     this.getFilter(odata);
                // })

                // this.observableData = _.cloneDeep(datas);
                // if (this.observableData.length > 0) {
                //     this.getChartData();
                // } else {
                //     this.isLoading = true;
                // }
                // this.isSearch = true;
            } else {
                // let datas = _.cloneDeep(this.observableData);
                // this.observableData = [];
                // datas.forEach(odata => {
                //     this.getFilter(odata);
                // })
                // this.observableData = _.cloneDeep(datas);
                // if (this.observableData.length > 0) {
                //     this.getChartData();
                // } else {
                //     this.isLoading = true;
                // }
                // this.isSearch = true;
            }

            // var keyLst = Object.keys(this.optData);
            // this.observableData.forEach(observe => {
            //     observe.numOfColor = {};
            //     keyLst.forEach(k => {
            //         if (k == 'BodyColor' || k == 'BodyShape' || k == 'HepatopancreasColor' || k == 'IntestinalColor' || k == 'MuscleColor') {
            //             observe.numOfColor[k] = new Array();
            //             observe[k].forEach(color => {
            //                 if (color.value > 0) {
            //                     observe.numOfColor[k].push(color);
            //                 }
            //             })
            //         }
            //     })
            // })
            // console.log('observableData', this.observableData);
        },
        change(item, name) {
            this.showBodyColor = false;
            var num = this.observeEdit[item].filter(x => x.name_en == name)[0].value;
            this.observeEdit[item].forEach(i => {
                if (i.name_en !== name) {
                    i.value = parseInt(this.observeEdit.observation_qty) - parseInt(num);
                }
            })
            this.showBodyColor = true;
        },
    },
    async created() {
        await this.getOptData();//取得顏色項目
        this.getFilter(this.observeEdit);
    },
}
</script>