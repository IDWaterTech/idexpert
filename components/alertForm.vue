<template>
    <div>

        <v-card dense style="min-height: 500px;">
            <v-card-title>
               <span class="headline">警示訊息</span>
                <v-btn icon color="primary">
                    <v-icon>mdi-refresh</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row dense>
                        
                        <v-col cols="12" class="d-flex justify-end">
                            <v-btn color="primary">btn btn btn ...</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
                <v-data-table dense
                    :headers="[{ text: '養殖循環', value: 'cycle' }, { text: '起日', value: 'start_date' }, { text: '結束日', value: 'end_date' }, { text: '操作', value: 'action' }]"
                    :items="[{ cycle: '循環1', start_date: '2024-01-01', end_date: '2024-02-01' }, { cycle: '循環2', start_date: '2024-02-02', end_date: '2024-03-01' }]"
                    class="elevation-0">
                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn color="primary" icon >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

    </div>
</template>
<script>
export default {
    name: 'alertForm',
    data() {
        return {
            valid: false
        };
    }
};
</script>
