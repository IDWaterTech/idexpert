<template>
    <div>
        <v-card class="bg-card">
            <v-overlay :value="!isLoading" :absolute="true">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <div class="content pl-0 py-0">
                <div class="result">
                    <v-row class="mb-0 full-width">
                        <v-col cols="12">
                           <div class="header-bar mb-4">
                                <v-tabs v-model="tab">
                                    <v-tab v-for="item in tabItems" :key="item.tab" :value="item.tab">
                                        {{ item.tab }}
                                    </v-tab>
                                </v-tabs>
                            </div>
                            <v-tabs-items v-model="tab">
                                    <v-tab-item v-for="item in tabItems" :key="item.tab">
                                        <v-card flat>
                                        <component :is="item.component" v-if="item.component" />
                                        <div v-else>{{ item.content }}</div>
                                    </v-card>
                                    </v-tab-item>
                                </v-tabs-items>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-card>

        <el-image-viewer v-if="isOriginImg" :on-close="() => { isOriginImg = false }" :url-list="srcList" />
    </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import IndicatorEdit from '~/pages/indicator/editV2.vue';//指標資料
import Calendar from '~/pages/calendarV2.vue';//日曆
import Report from '~/pages/reportV2.vue';//報表
import OberverV2 from '~/pages/observerV2.vue';//觀察網
import bacteriaV2 from '~/pages/bacteriaV2.vue';//菌相
export default {
    layout: "emptynologin2",
    middleware: "auth",
    components: {
        "el-image-viewer": () => import("element-ui/packages/image/src/image-viewer"),
        IndicatorEdit,Calendar,Report,OberverV2,bacteriaV2
    },
    head() {
        return {
            title: '歷史數據'
        };
    },
    data() {
        return {
            poolid: '',
            isLoading: false,
            isOriginImg: false,
            srcList: [],
            nowPool: '',
            tabItems: [{ tab: '歷史數據', content: 'Tab 1 Content', component: 'IndicatorEdit' },
            { tab: '重要紀事', content: '重要紀事 開發中', component: 'Calendar' },
            { tab: '觀察網', content: '觀察網 開發中,', component: 'OberverV2' },
            { tab: '菌相', content: '菌相 開發中', component: 'bacteriaV2' },
            { tab: '報表下載', content: '報表下載 開發中', component: 'Report' },
            ],
            tab: '歷史數據',
        };
    },
    methods: {
        async getAllUser() {
            let getuserData = await this.getUserList();
            this.userData = typeof getuserData === 'string' ? [] : getuserData.filter(x => x.is_active);
            this.isLoading = true;
        },
        get_scopeData(evt) {
            this.poolid = evt;
        }
    },
    async mounted() {
        await this.getAllUser();
        window.addEventListener('resize', () => {
            this.tableHeight = window.innerHeight - 208;
            this.innerWidth = window.innerWidth;
        });
    }
};
</script>

<style lang="scss" scoped>
</style>