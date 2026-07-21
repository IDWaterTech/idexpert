<template>
    <div>

        <v-card dense style="min-height: 500px;">
            <v-card-title>
                <span class="headline">收成紀錄</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row dense>
                        <!-- 選擇養殖場 -->
                        <v-col cols="12">
                            <locate-select :dataScope="'pool'" :defaultSelect="''" :isMulti="false"
                                @scopeSel_data="get_scopeData($event)" class="select-template"></locate-select>
                        </v-col>
                        <!-- 起日 -->
                        <v-col cols="12" md="6">
                            <v-menu v-model="menu_sDate" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="search.started_date" label="選擇起日" prepend-icon="mdi-calendar"
                                        dense filled v-bind="attrs" v-on="on" :rules="rules.require" @click:prepend="
                                            () => {
                                                search.started_date = getNowDate();
                                            }
                                        "></v-text-field>
                                </template>
                                <v-date-picker v-model="search.started_date"
                                    @input="menu_sDate = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <!-- 結束日 -->
                        <v-col cols="12" md="6">
                            <v-menu v-model="menu_eDate" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="search.ended_date" label="選擇結束日" prepend-icon="mdi-calendar"
                                        dense filled v-bind="attrs" v-on="on" :rules="rules.require" @click:prepend="
                                            () => {
                                                search.ended_date = getNowDate();
                                            }
                                        "></v-text-field>
                                </template>
                                <v-date-picker v-model="search.ended_date" @input="menu_eDate = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" class="d-flex justify-end">
                            <v-btn color="primary" @click="get_harvestLst()">查詢養殖收成</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
                <v-data-table dense show-expand item-key="id" :headers="headers" :items="harvestList"
                    class="elevation-1" no-data-text="無養殖循環" :loading="harvestLoading">
                    <!-- 養殖循環名稱 -->
                    <template v-slot:[`item.seedling_name`]="{item}">
                                    <span>{{ item.seedling_name }}</span><br/>
                                    <span>批號：{{ item.name }}</span>
                                </template>
                    <!-- 操作欄位 -->
                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn color="success" icon @click="showAddDlg(item)">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <!-- 展開內容 -->
                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length">

                            <v-data-table dense :headers="harvestRecordHeaders" :items="item.harvest_records"
                                hide-default-footer disable-pagination class="elevation-0">
                                <!-- 無資料 -->
                                <template v-slot:no-data>
                                    <div class="text-center grey--text py-3">
                                        尚無收成紀錄
                                    </div>
                                </template>
                                <!-- 收成操作(先不要) -->
                                <template v-slot:[`item.action`]="{ item: record }">
                                    <v-btn icon small color="primary" @click="editHarvest(record)">
                                        <v-icon small>
                                            mdi-pencil
                                        </v-icon>
                                    </v-btn>

                                    <v-btn icon small color="error" @click="deleteHarvest(record)">
                                        <v-icon small>
                                            mdi-delete
                                        </v-icon>
                                    </v-btn>
                                </template>
                            </v-data-table>

                        </td>
                    </template>


                </v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog v-model="addDlg" width="400px">
            <v-card dense>
                <v-card-title>
                    <span class="headline">新增收成紀錄</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="addDlgForm" v-model="addValid" lazy-validation>
                        <v-row dense>
                            <!-- 收成日日期 -->
                            <v-col cols="12" md="12">
                                <v-menu v-model="menu_aDate" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="addItem.harvest_date" :label="`選擇收成日(${addItem.min}~${(addItem.max)?addItem.max:''})`" prepend-icon="mdi-calendar"
                                            dense filled v-bind="attrs" v-on="on" :rules="rules.require" @click:prepend="
                                                () => {
                                                    addItem.harvest_date = getNowDate();
                                                }
                                            "></v-text-field>
                                    </template>
                                    <v-date-picker v-model="addItem.harvest_date" @input="menu_aDate = false" :min="addItem.min" :max="addItem.max"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="addItem.harvest_yield" type="number" label="收成總量" :rules="rules.require" dense><span class="pa-0 ma-0" slot="append">Kg</span></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="addItem.single_weight" type="number" label="個體重" :rules="rules.require" dense><span class="pa-0 ma-0" slot="append">g</span></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-textarea v-model="addItem.remark" label="說明" class="full-width" hide-details filled clearable placeholder="說明..."></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submitAdd()">新增</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import dayjs from 'dayjs';
export default {
    name: 'harvestForm',
    data() {
        return {
            valid: false,
            addValid:false,
            menu_sDate: false,
            menu_eDate: false,
            search: { pond_id:'',started_date: '', ended_date: '' },
            rules: { require: [v => !!v || "*必要項目"] },
            addDlg: false,
            menu_aDate: false,
            addItem: {
                min:'',//日期限縮上下限
                max:'',
                harvest_date: '',//收成日
                harvest_yield: '',//收成量(kg)
                single_weight:'',//平均個重量
                remark:'',
                breeding_record_id: undefined,//養殖循環id
            },
            headers: [
                {
                    text: '養殖循環',
                    value: 'seedling_name',
                     width: '200px'
                },
                {
                    text: '起日',
                    value: 'started_date'
                },
                {
                    text: '結束日',
                    value: 'ended_date'
                },
                {
                    text: '操作',
                    value: 'action',
                    sortable: false
                },
                {
                    text: '',
                    value: 'data-table-expand'
                }
            ],
            harvestRecordHeaders: [
                {
                    text: '收成日期',
                    value: 'harvest_date'
                },
                {
                    text: '個體重(g)',
                    value: 'single_weight'
                },
                {
                    text: '收成總量(kg)',
                    value: 'harvest_yield'
                },
                //先不給細項操作
                // {
                //     text: '操作',
                //     value: 'action',
                //     sortable: false
                // }
            ],
            harvestList:[
                // {
                //     ended_date: null
                //     harvest_records: (2) [{…}, {…}]
                //     id: 198
                //     name: "20260707200536"
                //     pond_id: 146
                //     seedling_name: "SPF_白蝦_快大_王順永"
                //     started_date: "2026-06-01"
                // }
            ],
            harvestLoading:false,
        };
    },
    methods: {
        //取得養殖收成詳細資料
        get_harvestLst:async function(){
            let valid = this.$refs.form.validate();
            if(!valid){
                return;
            }

            if(!this.search.pond_id){
                this.$toast.error("請選擇養殖池",{duration:2000});
                return;
            }
            this.harvestLoading = true;
            this.harvestList = [];
            let params = {
                pond_id:this.search.pond_id,
                started_date:this.search.started_date,
                ended_date:this.search.ended_date
            };
             let url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/v3/harvest-records/`;
            await this.$axios.get(url, { params: params })
                .then((res) => {
                    if (res.status == 200) {
                        this.harvestList = res.data;
                        // console.log("harvestList:",harvestList);
                        
                    } else {
                        this.$toast.error({ message: '取得養殖收成資料失敗：' + res, duration: 2000 });
                    }
                })
                .catch((error) => {
                    this.$toast.error('取得養殖收成資料錯誤：'+res.data, { duration: 2000 });
                    console.error('取得養殖收成資料錯誤：',res.data);
                });

            // console.log('get harvest params:',params);
            this.harvestLoading = false;
        },
        get_scopeData(data) {
            this.search.pond_id = data;
            // console.log('get_scopeData', data);
        },
        getNowDate: function () {
            return dayjs().format("YYYY-MM-DD");
        },
        //顯示新增對話框
        showAddDlg(item) {
            if (this.$refs.addDlgForm) {
                this.$refs.addDlgForm.reset();
            }
            this.addItem.min = item.started_date?? "";
            this.addItem.max =item.ended_date?? "";
            this.addItem.breeding_record_id = item.id;
            this.addDlg = true;
        },
        submitAdd:async function() {
            let valid = this.$refs.addDlgForm.validate();
            if(!valid){
                return;
            }
            let params = {
                harvest_date:this.addItem.harvest_date,
                harvest_yield:this.addItem.harvest_yield,
                single_weight:this.addItem.single_weight,
                remark:this.addItem.remark,
                breeding_record_id:Number(this.addItem.breeding_record_id),
            }
            const url = `${this.$store.state.mydata.gobal_api.apiUrl}/breeding/v3/harvest-records/`;

            try {
                const res = await this.$axios.post(url, params);
                if (res.status === 200 || res.status === 201) {
                    this.$toast.success("收成新增成功", {duration: 2000,});
                    this.get_harvestLst();// 重新查詢
                    this.addDlg = false; // 關閉 Dialog
                } else {
                    const msg = res.data?.messages?.join("、") || "未知錯誤";
                    this.$toast.error(`收成新增失敗：${msg}`, {duration: 2000,});
                    console.error("收成新增失敗", res);
                }
            } catch (error) {
                const msg =
                    error.response?.data?.messages?.join("、") ||
                    error.response?.data?.message ||
                    error.message;

                this.$toast.error(`收成新增錯誤：${msg}`, {duration: 2000,});
                console.error("收成新增錯誤", error);
            }

        }
    }
};
</script>
