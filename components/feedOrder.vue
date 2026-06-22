<template>
    <v-card>

        <!-- Header -->
        <v-card-title class="d-flex justify-space-between align-center">
            <div class="text-h6">
                料量設定
            </div>

            <v-btn
                color="#006AA6"
                icon
                title="取消"
                @click="closeDialog"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Tabs -->
        <v-tabs v-model="activeTab">
            <v-tab
                v-for="tab in tabs"
                :key="tab.value"
            >
                {{ tab.label }}
            </v-tab>
        </v-tabs>

        <v-divider></v-divider>

        <!-- Tab Content -->
        <v-tabs-items v-model="activeTab">

            <v-tab-item
                v-for="tab in tabs"
                :key="tab.value"
            >
                <v-card flat>
                    <v-card-text>

                        <!-- 有 component 才動態載入 -->
                        <component
                            v-if="tab.component"
                            :is="tab.component"
                        />

                        <!-- 沒 component 就顯示靜態內容 -->
                        <div v-else>
                            A頁籤內容
                        </div>

                    </v-card-text>
                </v-card>
            </v-tab-item>

        </v-tabs-items>

    </v-card>
</template>

<script>
import feedSetting from '@/pages/feed/order.vue'

export default {
    components: {
        feedSetting,
    },

    data() {
        return {
            activeTab: 0,

            tabs: [
                {
                    value: 'A',
                    label: 'A',
                    component: null, // 靜態頁
                },
                {
                    value: 'B',
                    label: 'B',
                    component: 'feedSetting', // 對應 components key
                },
            ],
        }
    },

    methods: {
        closeDialog() {
            this.$emit('closeDialog', true)
        },
    },
}
</script>