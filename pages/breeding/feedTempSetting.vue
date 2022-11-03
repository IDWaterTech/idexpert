<template>
    <v-row>
        <v-col cols="12">
            <div>
                <span>養殖樣板設定</span>
            </div>
        </v-col>
        <v-col cols="12">
            <v-row>
                <v-col cols="8">
                    <v-autocomplete dense filled :items="template_items" item-text="text" item-value="id">
                        <span slot="append-outer">
                            <v-btn icon color="blue" @click="editmode='add'"><v-icon>mdi-plus-box</v-icon></v-btn>
                        </span>
                    </v-autocomplete>
                    <div>
                        <FeedTemplate v-if="editmode=='add'"></FeedTemplate>
                    </div>
                </v-col>
                <v-col cols="4"></v-col>
            </v-row>
             
        </v-col>
    </v-row>

</template>

<script>
export default {
    data() {
        return {
            template_items: [],//樣版清單
            template_selected: 1,//已選到的樣版
            editmode:undefined,//目前是要新增樣版還是編輯
        }
    },
    methods: {
        getTemplateData: function () {
            var data = [
                { id: 1, text: "養殖模板A", date: "2020/01/01" },
                { id: 2, text: "養殖模板B", date: "2020/01/01" },
                { id: 3, text: "養殖模板C", date: "2020/01/01" }
            ];
            this.template_items = data;
            // var url=`${this.$store.state.mydata.gobal_api.apiUrl}/????????????/`;
            // await this.$axios
            //   .get(url,{ params: para },)
            //   .then(res => {
            //     this.template_items = res.data;
            //   })
            //   .finally(() => {
            //     /* 不論失敗成功皆會執行 */ this.tableloading = false;
            //   });
        }
    },
    mounted() {
        this.getTemplateData();//樣版清單
    },
}
</script>

<style scoped>

</style>