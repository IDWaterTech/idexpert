<template>
    <v-card style="min-height: 800px;">

        <!-- Header -->
        <v-card-title class="d-flex justify-space-between align-center">
            <div class="text-h6">
                檢驗檢測/菌相
            </div>

            <v-btn color="#006AA6" icon title="取消" @click="closeDialog">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>

        <v-divider></v-divider>
        <!-- Tabs -->
        <v-tabs v-model="activeTab">
            <v-tab v-for="tab in tabs" :key="tab.value">
                {{ tab.label }}
            </v-tab>
        </v-tabs>
        <v-divider></v-divider>

        <!-- Tab Content -->
        <v-tabs-items v-model="activeTab">

            <v-tab-item v-for="tab in tabs" :key="tab.value">
                <v-card flat>
                    <v-card-text class="pa-0">

                        <!-- 有 component 才動態載入 -->
                        <component v-if="tab.component" :is="tab.component"
                            @closeDialog="handleEmit('closeDialog', $event)" />

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
export default {
    data() {
        return {
            activeTab: 0,
            tabs: [
                {
                    value: 'A',
                    label: '檢驗檢測',
                    component: 'inspectReport',
                },
                {
                    value: 'B',
                    label: '菌相',
                    component: 'bacteriaForm',
                },
            ],
        }
    },
    methods: {
        handleEmit(type, event) {
            switch (type) {
                case 'closeDialog':
                    this.closeDialog();
                    break;
                default:
                    this.$toast.error(`handleEmit Error=> type: ${type},event: ${JSON.stringify(event)}`, { duration: 2500 });
                    break;
            }
        },
        closeDialog() {
            this.$emit('closeDialog', true)
        },
    }
}
</script>