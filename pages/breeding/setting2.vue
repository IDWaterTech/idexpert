<!-- 
    養殖歷程-設定
 -->
<template>
    <div>
        <!-- <h1 style="color:white;">養殖設定</h1>
        <span ></span> -->
        <v-card class="bg-card" style="margin-bottom: 16px;">
            <div class="content" style="padding-left: 0;padding-top:0;padding-bottom: 0;">
                <div class="result">
                    <!-- <div class="result-card" style="background-color: #fff;"> -->
                        <v-row style="margin-bottom: 4px;align-items: center;">
                            <v-col cols="12">
                                <div class="header-bar">
                                    <v-tabs show-arrows>
                                        <!-- 上方tab -->
                                        <v-tab v-for="tab in modelitems" :key="'tabs-'+tab.id" :href="`#` + tab.name">
                                            {{ tab.name }}設定
                                        </v-tab>
                                        <v-tab-item :value="'種苗'">
                                            <seedlings2></seedlings2>
                                        </v-tab-item>
                                        <v-tab-item :value="'樣板'">
                                            <feedTemp2></feedTemp2>
                                        </v-tab-item>
                                    </v-tabs>
                                </div>
                            </v-col>
                            
                        </v-row>
                    <!-- </div> -->
                </div>
            </div>
        </v-card>
        <!-- <v-row dense class="mx-14"> -->
            <!-- 下拉 -->
            <!-- <v-col cols="12">
                <v-row>
                    <v-col cols="8">
                        <v-select dark v-model="settingModel" :items="modelitems" dense filled hide-details item-value="id"
                            item-text="name">
                            <span slot="prepend" style="width:80px;">設定項目</span>
                        </v-select>
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
            </v-col>
            <v-col cols="12" v-if="settingModel">
                <v-card min-height="500">
                    <v-card-title>{{ modelitems.filter(x => x.id == settingModel)[0].name }}設定</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <seedlings v-if="modelitems.filter(x => x.id == settingModel)[0].name == '種苗'"></seedlings>
                        <feedTemp2 v-if="modelitems.filter(x => x.id == settingModel)[0].name == '樣板'"></feedTemp2>
                    </v-card-text>
                </v-card>
            </v-col> -->
        <!-- </v-row> -->
    </div>
</template>

<script>
import seedlings2 from "@/pages/breeding/seedlings2.vue";//種苗
import feedTemp2 from "@/pages/breeding/feedTempSetting2.vue";//樣板設定
export default {
    layout: "emptynologin",
    components: {
        seedlings2,feedTemp2
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
            // template_isdisabled:true,
            //下拉
            settingModel:1,
            modelitems:[{id:1,name:'種苗'},{id:2,name:'樣板'}]
        };
    },
    methods: {
        
    },
   
};
</script>
<style lang="scss" scoped>
</style>
