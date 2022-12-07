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
                    <v-autocomplete v-model="tempSelect" dense filled :items="template_items" item-text="name_ch" item-value="id" clearable @change="tempChange">
                        <span slot="append-outer">
                            <v-btn icon color="blue" @click="editmode='add'"  :disabled="tempSelect!=undefined" ><v-icon>mdi-plus-box</v-icon></v-btn>
                        </span>
                        <span slot="append-outer">
                            <v-btn icon color="error" @click="delTemp" :disabled="tempSelect==undefined"><v-icon>mdi-delete</v-icon></v-btn>
                        </span>
                        <!-- <span slot="prepend">
                            <v-btn icon color="blue" @click="getTemplateData"><v-icon>mdi-reload</v-icon></v-btn>
                        </span> -->
                    </v-autocomplete>
                    <div>
                        <FeedTemplate v-if="editmode=='add'" @action="actionResult" :templatemode="editmode"></FeedTemplate>
                        <FeedTemplate v-if="editmode=='edit'" @action="actionResult" :key="editKey" :templatemode="editmode" :passObj="passObj"></FeedTemplate>
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
            editKey:0,
            template_items: [],//樣版清單
            template_all:[],
            tempSelect: undefined,//已選到的樣版
            editmode:undefined,//目前是要新增樣版還是編輯
            passObj:{},
            
        }
    },
    methods: {
        actionResult:async function(val){
            if(val=='done'){
                this.editmode = undefined;
                
                await this.getTemplateData();//樣版清單
            }
        },
        // 選擇樣板
        tempChange:function(){
            if(this.tempSelect!=undefined){
                this.editmode='edit';
                this.editKey = Math.floor(Math.random() * 100);//隨機key值0~100
                var myMain =this.template_items.filter(x=>x.id==this.tempSelect)[0];
                var temp = this.template_all.filter(x=>x.tempMain==myMain)[0];
                this.passObj= temp;
            }else{
                this.editmode=undefined;
                this.passObj={};
            }

        },
        //刪除樣板
        delTemp:async function(){
            if(confirm(`是否刪除？`)==false){
                return;
            }
            var id= this.tempSelect;
            var url=`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/${id}/`;
            await this.$axios
                .delete(url)
                .then(res => {
                    if (res.data == '刪除成功') {
                        this.$toast.success("刪除成功", { duration: 2000 });
                    }else{
                        this.$toast.error("刪除 error:" + res.data, { duration: 2000 });
                    }
                })
                .catch(error => {
                    this.$toast.error("刪除 error:" + error, { duration: 2000 });
                })
                .finally(() => {
                    this.tempSelect = undefined;
                    this.getTemplateData();
                });
        },
        //樣版清單
        getTemplateData:async function () {
            // var data = [
            //     {
            //         id: 1,
            //         name_ch: "樣板AAAA",
            //         name_en: "template_a",
            //         remark: "this is a test",
            //         created_user: "jeff",
            //         created_time: "2022-11-03 12:02:37",
            //         updated_user: null,
            //         updated_time: "2022-11-03 12:02:37"
            //     }
            // ];
            this.tempSelect = undefined;
            var url=`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/`;
            await this.$axios
                .get(url)
                .then(res => {
                    this.template_items = res.data.map(x=>x.tempMain);
                    this.template_all = res.data;
                })
              .finally(() => {
                /* 不論失敗成功皆會執行 */
              });
        }
    },
    async mounted() {
        await this.getTemplateData();//樣版清單
    },
}
</script>

<style scoped>

</style>