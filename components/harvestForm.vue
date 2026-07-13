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
                            <v-btn color="primary">查詢養殖循環</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
                <v-data-table dense
                    :headers="[{ text: '養殖循環', value: 'cycle' }, { text: '起日', value: 'start_date' }, { text: '結束日', value: 'end_date' }, { text: '操作', value: 'action' }]"
                    :items="[{ cycle: '循環1', start_date: '2024-01-01', end_date: '2024-02-01' }, { cycle: '循環2', start_date: '2024-02-02', end_date: '2024-03-01' }]"
                    class="elevation-1">
                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn color="primary" icon @click="showAddDlg(item)">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
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
                    <v-form>
                        <v-row dense>
                            <!-- 收成日日期 -->
                            <v-col cols="12" md="12">
                                <v-menu v-model="menu_aDate" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="addItem.收成日" :label="`選擇收成日(${addItem.min}~${addItem.max})`" prepend-icon="mdi-calendar"
                                            dense filled v-bind="attrs" v-on="on" :rules="rules.require" @click:prepend="
                                                () => {
                                                    addItem.收成日 = getNowDate();
                                                }
                                            "></v-text-field>
                                    </template>
                                    <v-date-picker v-model="addItem.收成日" @input="menu_aDate = false" :min="addItem.min" :max="addItem.max"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="addItem.收成重量" type="number" label="收成總重量" :rules="rules.require" dense><span class="pa-0 ma-0" slot="append">Kg</span></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="addItem.平均個重量" type="number" label="平均個重量" :rules="rules.require" dense><span class="pa-0 ma-0" slot="append">Kg</span></v-text-field>
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
            menu_sDate: false,
            menu_eDate: false,
            search: { started_date: '', ended_date: '' },
            rules: { require: [v => !!v || "*必要項目"] },
            addDlg: false,
            menu_aDate: false,
            addItem: {
                min:'',//日期限縮上下限
                max:'',
                收成日: '',
                收成重量: '',
                平均個重量:'',
                remark:'',
            }
        };
    },
    methods: {
        get_scopeData(data) {
            console.log('get_scopeData', data);
        },
        getNowDate: function () {
            return dayjs().format("YYYY-MM-DD");
        },
        //顯示新增對話框
        showAddDlg(item) {
            this.addItem.min = item.start_date;
            this.addItem.max =item.end_date;
            this.addDlg = true;
        },
        submitAdd:async function() {
            console.log("送出新增!");
        }
    }
};
</script>
