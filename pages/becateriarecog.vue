<template>
        <!-- <v-row dense align="center">
            <v-col cols="12">
                <h1 class="white--text">菌盤辨識</h1>
            </v-col>
        </v-row> -->
        <v-row>
            <v-col cols="12">
                <el-table ref="recogtable" style="width:100%" :data="recogData.items" highlight-current-row
                    :header-cell-style="tableHeaderStyle" max-height="500" class="primary"
                    :header-cell-name="cellClass">
                    <template slot="empty"><span class="headline" style="color:lightblue;">暫無資料</span></template>
                    <el-table-column label="資料" align="center" width="200">
                        <div slot-scope="scope">
                            {{ scope.row.id }}<br />
                            {{ scope.row.inspected_time }}
                        </div>
                    </el-table-column>
                    <el-table-column label="加熱" align="left" width="50">
                       <span slot-scope="scope">
                            <span v-if="scope.row.is_heated" style="color:red;">加熱</span>
                            <span v-else>無</span>
                       </span>
                    </el-table-column>
                    <el-table-column label="Class" align="left" width="200">
                        <div slot-scope="scope">
                            <ol>
                                <li>{{scope.row.class1}}</li>
                                <li>{{scope.row.class2}}</li>
                                <li>{{scope.row.class3}}</li>
                                <li>{{scope.row.class4}}</li>
                                <li>{{scope.row.class5}}</li>
                            </ol>
                        </div>
                    </el-table-column>
                    <el-table-column label="辨識" align="left">
                        <span slot-scope="scope">
                            共{{scope.row.images.length}}張
                            <!-- <img v-img="{group: scope.row.id}" :src="scope.row.images[0]" width="100%" :hidden="false" /> -->
                            <img v-img="{group: scope.row.id }" v-for="(item,i) in scope.row.images" :key="i" :src="scope.row.images[i]" width="100%" :hidden="false" />
                        </span>
                    </el-table-column>
                    <!-- 使用fixed會造成表重複 -->
                    <el-table-column align="right" label="操作" width="80">
                        <template slot-scope="">
                        <v-btn color="primary" outlined small disabled @click="() => { }">刪除</v-btn>
                        </template>
                    </el-table-column>
                </el-table>
            </v-col>
        </v-row>
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
                items: [
                    {
                        id: 1,
                        class1: "3.6000E+01",
                        class2: "0.0000E+00",
                        class3: ".0000E+00",
                        class4: ".0000E00",
                        class5: ".2000E00",
                        is_heated: true,
                        inspected_time: "2022-08-18 11:00:00",
                        images: ["https://www.idwatertech.com:8011/.well-known/bacteria/a.jpg", "https://www.idwatertech.com:8011/.well-known/bacteria/b.jpg"]
                    },
                    {
                        id: 2,
                        class1: "4.8000E+01",
                        class2: "2.3000E+00",
                        class3: "0.0000E+00",
                        class4: "1.8000E+00",
                        class5: "0.0000E+00",
                        is_heated: false,
                        inspected_time: "2022-08-18 11:00:00",
                        images: ["https://www.idwatertech.com:8011/.well-known/bacteria/c.jpg", "https://www.idwatertech.com:8011/.well-known/bacteria/d.jpg", "https://www.idwatertech.com:8011/.well-known/bacteria/e.jpg"]
                    }
                ]
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