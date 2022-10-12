<!-- 
    養殖歷程-設定
 -->
<template>
    <div>
        <!-- <h1 style="color:white;">養殖設定</h1>
        <span ></span> -->
        <v-row dense class="mx-14">
            <!-- 下拉 -->
            <v-col cols="12">
                <v-select dark v-model="settingModel" :items="modelitems" dense filled hide-details item-value="id" item-text="name">
                    <span slot="prepend" style="width:80px;">設定項目</span>
                </v-select>
            </v-col>
            <v-col cols="12" v-if="settingModel">
                <v-card min-height="500">
                    <v-card-title>{{modelitems.filter(x=>x.id==settingModel)[0].name}}設定</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <seedlings v-if="modelitems.filter(x=>x.id==settingModel)[0].name=='種苗'"></seedlings>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col sm="6" class="pa-0 pr-1">
                <v-card tile>
                    <v-toolbar color="cyan" dark dense>
                        <v-toolbar-title>模板清單</v-toolbar-title>
                    </v-toolbar>
                    <v-list dense>
                        <!-- <v-subheader>模板清單</v-subheader> -->
                        <v-list-item-group v-model="template_selected" color="primary">
                            <v-list-item v-for="item in template_items" :key="item.id">
                                <v-list-item-content>
                                    <v-list-item-title v-text="item.text"></v-list-item-title>
                                    <v-list-item-subtitle v-text="item.date"></v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
            <v-col sm="6" class="pa-0">
                
                <v-card class="mx-auto" tile min-height="100">
                    <v-toolbar color="cyan" dark dense>
                        <v-toolbar-title>模板清單</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="template_isdisabled=!template_isdisabled" v-if="templatemode=='add'"><v-icon>mdi-plus</v-icon></v-btn>
                        <v-btn icon @click="template_isdisabled=!template_isdisabled" v-else>
                            <v-icon>mdi-pencil-outline</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="templateform" :disabled="template_isdisabled" v-model="valid" lazy-validation>
                            <v-text-field></v-text-field>{{template_isdisabled}}
                        </v-form>
                    </v-card-text>
                     <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary">
                            儲存
                        </v-btn>
                        <v-btn color="error">
                            刪除
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import seedlings from "@/pages/breeding/seedlings.vue";
export default {
    layout: "emptynologin",
    components: {
        seedlings
    },
    head(){
    return{
      title:'養殖設定'
    }
  },
    data() {
        return {
            //templateform
            valid:true,
            templatemode:'add',
            template_isdisabled:true,
            //---
            template_selected: 1,
            template_items: [],
            //下拉
            settingModel:1,
            modelitems:[{id:1,name:'種苗'},{id:2,name:'苗2'}]
        };
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
        this.getTemplateData();
    },
};
</script>
