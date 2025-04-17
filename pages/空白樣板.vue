<template>
    <div>
        <v-overlay :value="!isLoading" :absolute="true">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card class="bg-card">
            <div class="content pt-3">
                <span>
                    <h2>{{ this.$options.head().title }}</h2>
                </span>
                <div class="search mb-3">
                    <v-row class="mb-0">
                        <v-col cols="12" md="3" sm="12" style="position: relative;">
                            <locate-select :dataScope="'pool'" :isMulti="false" @scopeSel_data="get_scopeData($event)"
                                class="select-template"></locate-select>
                        </v-col>
                    </v-row>
                </div>
                <div class="result">
                    <v-row class="mb-0 full-width">
                        <v-col cols="12">
                            <v-card class="result-card pa-6 pb-2">
                                <span>{{ this.$options.head().title }}</span>
                            </v-card>
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

export default {
    layout: "emptynologin2",
    middleware: "auth",
    components: {
        "el-image-viewer": () => import("element-ui/packages/image/src/image-viewer"),
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