<template>
    <div>
        <v-row dense align="center">
            <v-col cols="12">
                <h1 class="white--text">菌盤辨識</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <el-table ref="recogtable" style="width:100%" :data="recogData.items" highlight-current-row
                    :header-cell-style="tableHeaderStyle" max-height="500" class="primary" :header-cell-name="cellClass">
                    <template slot="empty"><span class="headline" style="color:lightblue;">暫無資料</span></template>
                    <el-table-column label="資料" align="center">
                        <div slot-scope="scope">
                            {{ scope.row.id }}<br />
                            {{ scope.row.inspected_date }}
                        </div>
                    </el-table-column>
                </el-table>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
export default {
    layout: "emptynologin",
    data() {
        return {
            recogData: {
                id: 1,
                name: "A1",
                items: []
            }
        }
    },
    methods: {
        cellClass: function (row) {
            if (row.columnIndex == 0) {
                return "disableSelection";
            }
        },
        tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
            let bgcolor = $nuxt.$vuetify.theme.themes.light.cardtitle;
            if (rowIndex == 0) {
                return `background-color:${bgcolor};color:#fff;font-weight:500;`;
            } else {
                return `background-color:${bgcolor};`;
            }
        },
    },
}
</script>

<style lang="scss" scoped>
</style>