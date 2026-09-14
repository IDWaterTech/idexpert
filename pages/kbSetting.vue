<template>
    <div>
        <v-overlay :value="isLoading" :absolute="true">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card class="bg-card">
            <div class="content pt-3">
                <span>
                    <h2>{{ this.$options.head().title }}</h2>
                </span>
                <div class="search mb-3">
                    <v-row class="mb-0">
                        <v-col cols="12" md="4" sm="4" style="position: relative;">
                            <v-select></v-select>
                        </v-col>
                     
                        <v-spacer></v-spacer>
                    </v-row>
                </div>
                <div class="result">
                    <v-row class="mb-0 full-width">
                        <v-col cols="12">
                            <v-card class="result-card pa-6 pb-2">
                                <v-card v-for="kb in kbData" :key="kb.id" class="mb-4" color="white">
                                    <v-card-title>{{ kb.name_ch }}</v-card-title>
                                    <v-card-text>
                                        <v-row>
                                            <v-col v-for="field in kb.fields" :key="field.name_en" cols="12" md="6" sm="12">
                                                <div class="field-label mb-2">
                                                    {{ field.name_ch }}
                                                    <span v-if="field.unit" class="unit-label">({{ field.unit }})</span>
                                                </div>
                                                
                                                <!-- Number Input -->
                                                <v-text-field
                                                    v-if="['number','float'].includes(field.frontend_type)"
                                                    type="number"
                                                    :value="field.default_value"
                                                    :min="field.validation_rules.min"
                                                    :max="field.validation_rules.max"
                                                    :required="field.validation_rules.required"
                                                ></v-text-field>
                                                
                                                <!-- Int Input 整數 -->
                                                <v-text-field
                                                    v-if="field.frontend_type === 'int'"
                                                    type="number"
                                                    step="1"
                                                    dense
                                                   :rules="[
                                                        v => v !== '' && v !== null || '請輸入數量',
                                                        v => Number.isInteger(Number(v)) || '只能輸入整數',
                                                        v => Number(v) >= 0 || '不可小於 0'
                                                    ]"
                                                    :value="field.default_value"
                                                    :min="field.validation_rules.min"
                                                    :max="field.validation_rules.max"
                                                    :required="field.validation_rules.required"
                                                ></v-text-field>

                                                <!-- Select Input -->
                                                <v-select v-if="field.frontend_type === 'select'"
                                                    :value="field.default_value"
                                                    :items="fieldOptions[field.name_en] || []" 
                                                    item-text="name"
                                                    item-value="value" 
                                                    :required="field.validation_rules.required"
                                                    :loading="fieldLoading[field.name_en]"
                                                    no-data-text="查無資料"
                                                    @focus="loadSelectOptions(field)"
                                                    clearable
                                                ></v-select>

                                                <!-- switch -->
                                                 <v-switch v-if="['switch','bool'].includes(field.frontend_type)"
                                                    v-model="field.default_value"
                                                    ></v-switch>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script>

export default {
    layout: "emptynologin2",
    head() {
        return {
            title: '知識庫設定'
        };
    },
    data() {
        return {
            isLoading: false,
            isOriginImg: false,
            userData: [],
            fieldOptions: {},
            fieldLoading: {},
            kbData: [
                {
                    "id": 1,//要給
                    "name_en": "PRODUCTION_GOALS",
                    "name_ch": "養殖生產目標",
                    "fields": [
                        {
                            "id": 1,//要給
                            "name_en": "estimated_breeding_days",
                            "name_ch": "預估養殖天數",
                            "frontend_type": "number",
                            "unit": "天",
                            "default_value": 120,
                            "validation_rules": {
                                "min": 1,
                                "max": 365,
                                "required": true
                            },
                            "options_endpoint": null,
                            "options": []
                        }
                    ]
                },
                {
                    "id": 2,
                    "name_en": "ADVANCED_FEEDING",
                    "name_ch": "進階投餵策略",
                    "fields": [
                        {
                            "name_en": "weight_feed_ratio_id",
                            "name_ch": "體重投餌率表",
                            "frontend_type": "select",
                            "default_value": null,
                            "unit": null,
                            "validation_rules": {
                                "required": true
                            },
                            "options_endpoint": "/v3/strategy-matrices/choices/?matrix_type=WEIGHT_FEED_RATIO",
                            "options": []
                        },
                        {
                            "name_en": "SCALING_FACTOR",
                            "name_ch": "縮放參數表",
                            "frontend_type": "select",
                            "default_value": null,
                            "unit": null,
                            "validation_rules": {
                                "required": true
                            },
                            "options_endpoint": "/v3/strategy-matrices/choices/?matrix_type=SCALING_FACTOR",
                            "options": []
                        },
                        {
                            "name_en": "enable_molting_calc",
                            "name_ch": "是否使用脫殼計算法",
                            "frontend_type": "switch",
                            "default_value": false,
                            "unit": null,
                            "validation_rules": {},
                            "options_endpoint": null,
                            "options": []
                        }
                    ]
                }
            ],
        };
    },
    methods: {
        async getAllUser() {
            this.isLoading = false;
            let getuserData = await this.getUserList();
            this.userData = typeof getuserData === 'string' ? [] : getuserData.filter(x => x.is_active);
            this.isLoading = true;
        },
        async loadSelectOptions(field) {
            // 如果已經有 options 或沒有 options_endpoint，則不再調用
            if (this.fieldOptions[field.name_en] && this.fieldOptions[field.name_en].length > 0) {
                return;
            }
            
            if (!field.options_endpoint) {
                return;
            }
            
            // 設置該 field 的 loading 狀態為 true
            this.$set(this.fieldLoading, field.name_en, true);
            
            // 如果前5個文字是 "/api/"，則取代為 "/"
            let endpoint = field.options_endpoint;
            if (endpoint.substring(0, 5) === "/api/") {
                endpoint = "/" + endpoint.substring(5);
            }
            
            const fullUrl = `${this.$store.state.mydata.gobal_api.apiUrl}${endpoint}`;
            try {
                // 在此請求中覆寫 axios 的 validateStatus，不拋出異常
                const res = await this.$axios.get(fullUrl, {
                    validateStatus: () => true  // 所有狀態碼都不拋出異常，不觸發 auth.js 的 onError
                });
                
                // 檢查 HTTP 狀態碼
                if (res.status >= 200 && res.status < 300) {
                    this.$set(this.fieldOptions, field.name_en, res.data || []);
                } else {
                    throw new Error(`HTTP ${res.status}`);
                }
            } catch (err) {
                // 不拋出異常，只顯示 toast 訊息
                const statusCode = err.response?.status || err.message;
                const errorMsg = statusCode === 404 || err.message === 'HTTP 404'
                    ? `找不到 ${field.name_ch} 的選項資料` 
                    : `載入 ${field.name_ch} 選項失敗`;
                this.$toast.error(errorMsg, {duration: 3000});
                this.$set(this.fieldOptions, field.name_en, []);
                console.warn(`API Error [${statusCode}]: ${fullUrl}`, err.message);
            } finally {
                // 關閉該 field 的 loading 狀態
                this.$set(this.fieldLoading, field.name_en, false);
            }
        },
        async getKbData() {
            this.isLoading = true;
            // 這裡可以放置從後端獲取 kbData 的邏輯
            // 目前 kbData 是硬編碼的，如果需要從 API 獲取，可以在這裡實現
            this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/v3/config/form-schema/`)
                .then(res => {
                    if (res.status === 200) {
                         this.kbData = res.data;
                        console.log('載入知識庫設定成功', res.data);
                    } else {
                        this.$toast.error('載入知識庫設定失敗', {duration: 3000});
                        console.log('API Error:', res.status, res.data);
                    }
                })
                .catch(err => {
                    this.$toast.error('載入知識庫設定失敗', {duration: 3000});
                    console.error('API Error:', err);
                });
            this.isLoading = false;
            }
    },
    async mounted() {
        await this.getKbData();
        // await this.getAllUser();
        window.addEventListener('resize', () => {
            this.tableHeight = window.innerHeight - 208;
            this.innerWidth = window.innerWidth;
        });
    }
};
</script>

<style lang="scss" scoped>
.v-application.v-application--is-ltr {
    .v-card.bg-card {
        * {
            color: $color-dark;
        }

        .v-card.result-card {
            background-color: $color-lighten;
            box-shadow: 0 0 10px $color-black-10;
        }
    }
}
</style>