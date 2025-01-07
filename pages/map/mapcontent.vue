<template>
    <div>
        <!-- <div v-if="!isLoad">Loading...</div> -->
        <div v-if="isLoad" class="content pa-6">
            <v-row>
                <v-col class="d-flex"
                        cols="12"
                        sm="6">
                    <v-select v-if="!isError && isField" class="pl-3 mt-0" :items="fatorys" hide-details :disabled="isField" v-model="nowFactory" @change="changeFactory($event)">                
                    </v-select>   
                    <div v-if="!isError && !isField">
                        <locate-select class="select-template" :dataScope="'field'" :defaultSelect="nowField" :isMulti="false" @scopeSel_data="changeFactory($event)"></locate-select>
                        <!-- <label v-if="nowField!==''" class="label-select">場</label> -->
                    </div>
                </v-col>
            </v-row>
            <v-row class="mt-0">
                <v-col cols="12"
                        sm="12">
                    <div v-if="areas.length > 0" class="tabs">
                        <v-tabs class="mb-2" v-model="nowAreaTag" show-arrows :style="{paddingLeft: isField?'12px':'0'}" style="overflow-x: hidden;">
                            <div v-if="!isField" class="icons flex-align-center mr-4">
                                <!-- <v-icon v-show="nowAreaTag!=='setting'" :class="{'edit-action':mapshowedit}" @click="mapshowedit = !mapshowedit" class="my-3">mdi-pencil</v-icon> -->
                                <v-icon v-show="nowAreaTag!=='setting'" :class="{'edit-action':mapshowedit}" @click="userDialog" class="my-3 ma-4 cursor-pointer">mdi-pencil</v-icon>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="btn-icon" v-show="editData.length>0" @click="selectchecked()" v-bind="attrs"
                                        v-on="on">
                                            <v-icon>mdi-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>全部儲存</span>
                                </v-tooltip>
                            </div>
                            <v-tab
                                v-for="area in areas"
                                :key="area.areaNo"
                                :href="`#` + area.areaNo"
                                class="title"
                            >
                            <v-icon v-if="area.areaNo=='setting'" class="mr-1">mdi-cog-outline</v-icon>
                            {{ area.name }}
                            </v-tab>

                            <v-tabs-items class="pt-6" v-model="nowAreaTag" touchless>
                                <v-tab-item v-for="area in areas"
                                    :key="area.areaNo" 
                                    :value="area.areaNo"
                                    :style="{overflowX:`${nowAreaTag=='setting'&& nowLayout=='color'?'initial':'scroll'}`}"
                                    class="mb-4"
                                    style="overflow-x: scroll;overflow-y: hidden;"
                                >
                                    <poollayout :water="[]"  id="layout" :areas="areas" :layout="layout" :nowAreaTag="nowAreaTag" :nowAreaId="nowAreaId" :showedit="mapshowedit" :statcolor="statcolor" :successData="successData" :setting="setting" @editPoolOuter="edit($event)" @saveSuccess="saveDelete($event)"></poollayout>
                                    <!-- <setting v-else class="mt-3" @update="settingUpdated"></setting> -->
                                </v-tab-item>
                            
                            </v-tabs-items>
                            
                        </v-tabs>
                    </div>
                    <div v-show="areas.length == 0 && !$route.query.field" class="nodata tabs pl-6">無資料!請先至<router-link to="/factory"> 資料設定頁 </router-link>進行區的設定</div>
                    <div v-show="areas.length == 0 && $route.query.field" class="nodata tabs pl-6">無資料!</div>
                    <!-- <v-row v-if="areas.length > 0 && nowAreaTag!=='setting'" class="mx-0 parent-row">
                    <div class="mx-3 my-1 update-time">
                        <span>最後更新時間：{{ MaxDate }}</span>
                    </div>
                </v-row> -->
                </v-col>
            </v-row>
        </div>
        <v-dialog v-model="openUserDialog" width="350" class="indicator-dialog">
            <v-card height="230">
                <v-card-title>管理員密碼</v-card-title>
                <v-card-text>
                    <v-text-field v-model="ipadminpwd" color="red" outlined hide-details dense clearable><span slot="prepend-inner" class="text--red">管理密碼<v-icon>mdi-key</v-icon></span></v-text-field>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="btn-secondary" @click="captchacancel">取消</v-btn>
                <v-btn class="btn-primary" @click="captchacheck">確認</v-btn>
                
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import poollayout from "@/pages/map/poolslayout.vue";
import setting from "~/pages/map/settingcolor.vue";
import { Doughnut } from 'vue-chartjs';
import md5 from "md5";
export default {
    layout: 'emptynologin',
    middleware: "auth",
    components: {
        poollayout,
        setting
    },
    data() {
        return {
            mydialog: false,
            fatorys: [],
            areas: [],
            pools: [],
            mapshowedit: false,
            fatoryData: [],
            nowFactory: '',
            nowArea: '',
            nowAreaTag: '',
            nowAreaId:{
            factory_id: null,
            pond_area_id: null
            },
            nowField: '',
            editData: [],// 要變更的資料，全部儲存用
            oldEditDataLength: 0,// 全部儲存的按鈕顯示時，tab的底線位置用
            statcolor: [
            //   { name_ch: "無", color: "#fff", id: 1 },
            //   { name_ch: "default", color: "#00273E" },
            //   { name_ch: "放養中", color: "#F1E78D", id: 4 },
            //   { name_ch: "放養中(鎖排汙)", color: "#CBAAE5", id: 32 },
            //   { name_ch: " 集中暫養", color: "#8DA0E5", id: 31 },
            //   { name_ch: "尚未洗池", color: "#E8DDBF", id: 6 },
            //   { name_ch: "已清洗", color: "#A8E6DB", id: 7 },
            //   { name_ch: "蓄水中", color: "#D3B280", id: 8 },
            //   { name_ch: "蓄水完畢", color: "#A5D380", id: 9 },
            //   { name_ch: "消毒中", color: "#80D3AB", id: 10 },
            //   { name_ch: "做水中", color: "#C5E8E6", id: 11 },
            //   { name_ch: "預備放苗", color: "#83C9F0", id: 12 },
            //   { name_ch: "空池", color: "#BFDAE8", id: 3 },
            //   { name_ch: "養殖審核", color: "#D3808F", id: 33 }
            ],
            myuser: "web",
            successData: [],
            cmpkey: { wc: 0, tf: 0, zw: 0 ,sp: 0},
            setting: 'color',
            layout: [],
            nowLayout:'',
            oldAreaTag: '',
            MaxDate:"-",
            // 判斷url的參數
            isField: false,
            isLoad: false,
            isError: false,
            openUserDialog: false,
            ipadminpwd:''
        }
    },
    props:{
        auth:{
            type: Boolean,
            default: false
        },
        field:{
        default: null
        }
    },
    async created() {
        await this._pageCheck(); //驗證頁面是否可檢視
        this.getFactoryData();
        this.myuser = this.$auth.$state.user ? this.$auth.$state.user.email : '';
        if(!this.auth && this.field==null) {
            window.location.href='/login';
        }
        if(this.field!==null) {
            if(document.getElementsByTagName('header')) {
                let nav = document.getElementsByTagName('header');
                let main = document.getElementsByTagName('main');
                let map = document.getElementsByClassName('map');
                nav[0].style.display = 'none';
                main[0].style.paddingTop = '24px';
                for(let i=0;i<map.length;i++) {
                    map[i].style.minHeight = '88vh';
                }
                // console.log('nav',nav);
                
            }
        }
        
        console.log('index Created');
    },
    async mounted() {
        console.log('index Mounted');
        await this.getStateColor();
    },
    methods: {
        showcard: function () {
            this.mydialog = true;
            //this.$toast.success(`hello`, { duration: 2000 });
        },
        getFactoryData: async function () {
            // await this.$axios
            //     .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
            //     .then(res => {
            //         console.log("architecture data", res);
            //         let isData = false;
            //         this.fatoryData = res.data;
            //         for (let i = 0; i < this.fatoryData.length; i++) {
            //         if(this.field!==null) {
            //             if(this.fatoryData[i].id==this.field) {
            //                 this.fatorys.push(this.fatoryData[i].name);
            //                 this.nowFactory = this.fatoryData[i].name;
            //                 isData = true;
            //                 this.isField = true;
            //             }
            //         }else {
            //             this.fatorys.push(this.fatoryData[i].name);
            //         }
            //         }
            //         if(this.field !== null && !isData) {
            //             this.$toast.error(`取得結果：欄位資料有誤`, { duration: 2000 });
            //             this.isError = true;
            //             // window.location.href='/map';
            //         }else {
            //             this.nowFactory = this.fatorys[0];
            //             this.nowAreaId.factory_id = this.fatoryData[0].id;

            //             this.changeFactory(this.nowFactory);
            //             console.log('factorys', this.fatorys);
            //         }
            //         this.isLoad = true;
            //     })
            //     .catch(error => {
            //         if(this.field !== null && !isData) {

            //         }else {
            //             // this.$toast.error("error:" + error, { duration: 2000 });
            //             console.log('error', error);
            //         }
                    
            //     })
            let isData = false;
            let architectureData = await this.getArchitecture(this.field);
            this.fatoryData = typeof (architectureData)=='string'?[]:architectureData;
            for (let i = 0; i < this.fatoryData.length; i++) {
            if(this.field!==null) {
                if(this.fatoryData[i].id==this.field) {
                    this.fatorys.push(this.fatoryData[i].name);
                    this.nowFactory = this.fatoryData[i].name;
                    isData = true;
                    this.isField = true;
                }
            }else {
                this.fatorys.push(this.fatoryData[i].name);
            }
            }
            if(this.field !== null && !isData) {
                this.$toast.error(`取得結果：欄位資料有誤`, { duration: 2000 });
                console.log(this.fatoryData);
                this.isError = true;
                // window.location.href='/map';
            }else {
                this.nowFactory = this.fatorys[0];
                this.nowAreaId.factory_id = this.fatoryData[0].id;

                this.changeFactory(this.nowFactory);
                console.log('factorys', this.fatorys);
            }
            this.isLoad = true;
        },
        changeFactory(evt) {
            console.log('changeFactory',evt.split('_')[0]);
            this.nowFactory = evt.split('_')[0];
            this.nowField = '';
            this.areas = [];
            this.layout = [];
            for (let i = 0; i < this.fatoryData.length; i++) {
                if (this.fatoryData[i].name == this.nowFactory) {
                this.nowAreaId.factory_id = this.fatoryData[i].id;
                    for (let x = 0; x < this.fatoryData[i].node.length; x++) {
                        // this.areas.push(this.fatoryData[i].node[x].name);
                        this.areas.push({
                            areaNo: this.fatoryData[i].node[x].area_no,
                            name: this.fatoryData[i].node[x].name,
                            id: this.fatoryData[i].node[x].id
                        });
                    }
                }
            }
            this.nowField = this.nowFactory+'_'+this.nowAreaId.factory_id;
            console.log('areas', this.areas);
            if (this.areas.length > 0) {
                this.areas.forEach(a=>this.layout.push(a.name));
                this.nowArea = this.areas[0].name;
                this.nowAreaTag = this.areas[0].areaNo;
                this.nowAreaId.pond_area_id = this.areas[0].id;
                this.changeArea(this.nowAreaTag);
            }
            if(!this.isField) {
                this.areas.push({
                    areaNo: 'setting',
                    name: '設定'
                })
            }
            
        },
        changeArea(evt) {
            //   console.log(evt);
            this.nowAreaTag = '';
            this.pools = [];
            this.nowArea = evt;
            for (let i = 0; i < this.fatoryData.length; i++) {
                if (this.nowFactory !== '' && this.nowFactory == this.fatoryData[i].name) {
                    for (let x = 0; x < this.fatoryData[i].node.length; x++) {
                        if (this.nowArea !== '' && this.fatoryData[i].node[x].area_no == evt) {
                            this.nowAreaTag = this.fatoryData[i].node[x].area_no;
                            this.nowAreaId.pond_area_id = this.fatoryData[i].node[x].id;
                        //   console.log('changeArea', this.fatoryData[i].node[x],evt,this.nowAreaId);
                        }
                    }
                }
            }
            
        },
        async getStateColor() {
            //取得池況顏色設定
            let getPondStateList = await this.getPondStateList();
            let data = typeof (getPondStateList)=='string'?[]:getPondStateList;
            this.statcolor = data;
            // await this.$axios
            //     .get(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`)
            //     .then(res => {
            //     // console.log('getColor',res.data);
            //         this.statcolor = res.data;
            //     })
            //     .catch(error => {
            //     alert("error:" + error.message);
            //     });
        },
        userDialog() {
            if(this.mapshowedit) {
                this.mapshowedit = false;
            }else {
                this.openUserDialog = true;
            }
        },
        captchacheck() {
            var input_ipadminpwd = md5(this.ipadminpwd);

            //idwadmin56651588
            if(input_ipadminpwd=='0df860f9cad0c35e96feeb0e3cf3619c'){
                this.mapshowedit = true;
                this.ipadminpwd = '';
                this.openUserDialog = false;
            }else {
                this.$toast.error(`密碼錯誤`, { duration: 2000 });
            }
        },
        captchacancel() {
            this.ipadminpwd = '';
            this.openUserDialog = false;
        },
        edit(evt) {
            // 全部儲存用，接收子元件(更改池)的資料，儲存至editData
            // console.log('index edit',evt)
            let editID = [];
            this.editData.forEach(data => { editID.push(data.id) });
            //   console.log('id', editID);
            if (this.editData.length > 0) {
                for (let x = 0; x < evt.length; x++) {
                    if (editID.includes(evt[x].id)) {
                        for (let i = 0; i < this.editData.length; i++) {
                            if (this.editData[i].id == evt[x].id && this.editData[i].value !== evt[x].value) {
                                this.editData[i].value = evt[x].value;
                            }
                        }
                    } else {
                        this.editData.push(evt[x]);
                    }
                }

            } else {
                this.editData = evt;
            }

            // console.log('EditTop',this.editData);
        },
        saveDelete(evt) {
            // 當子元件更改池，各自儲存後，需到父層變更editData資料，全部儲存時，再次丟出
            this.editData = this.editData.filter(x => x.id !== evt.item.id);
            if(evt.isSend) {
                this.mapshowedit = false;
            }
            
            //   console.log('save Delete Data', this.editData);
        },
        selectchecked: async function () {
            // 全部儲存丟出api
            let apiNum = 0;
            let success = [];
            //   console.log('user',this.myuser)

            for (let i = 0; i < this.editData.length; i++) {
                let newItems = this.statcolor.filter(x => x.name_ch == this.editData[i].value); //抓到修改後的狀態id
                if (newItems.length == 1) {
                    const parm = {
                        id: newItems[0].id,
                        updated_user: this.myuser
                    };
                    var res = false;
                    res = await this.patchPondStateList(this.editData[i].id,parm);
                    if(res) {
                        success.push(this.editData[i]);
                        if (i !== this.editData.length - 1) {
                            apiNum++;
                        } else {
                            this.alertNowEdit(success);
                        }
                    }else {
                        if (i !== this.editData.length - 1) {
                            apiNum++;
                        } else {
                            this.alertNowEdit(success);
                        }
                    }
                    // console.log('check',parm);
                    // await this.$axios
                    //     .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-to-state/${this.editData[i].id}/`, parm)
                    //     .then(res => {
                    //         if (res.data == "修改成功") {
                    //             success.push(this.editData[i]);
                    //             if (i !== this.editData.length - 1) {
                    //                 apiNum++;
                    //             } else {
                    //                 this.alertNowEdit(success);
                    //             }

                    //         } else {
                    //             // alert(res.data);
                    //             if (i !== this.editData.length - 1) {
                    //                 apiNum++;
                    //             } else {
                    //                 this.alertNowEdit(success);
                    //             }
                    //         }
                    //     })
                    //     .catch(error => {
                    //         alert("error:" + error.message);
                    //     });
                } else {
                    this.$toast.error(`修改失敗，找不到狀態id`, { duration: 2000 });
                }
            }
            this.mapshowedit = false;

        },
        alertNowEdit(success) {
            // 全部儲存後統一彈跳視窗
            if (success.length > 0) {
                // this.successData = [];
                this.successData = _.cloneDeep(success);
                console.log('index successData',this.successData);
                if (this.successData.length == this.editData.length) {
                    this.$toast.success(`修改成功`, { duration: 2000 });
                    this.editData = [];
                } else {
                    let fail = [];
                    let successId = [];
                    this.successData.forEach(data => { successId.push(data.id) });
                    for (let i = 0; i < this.editData.length; i++) {
                        if (!successId.includes(this.editData[i].id)) {
                            fail.push(this.editData[i]);
                        }
                    }
                    alert('部分修改失敗!請稍後再試!');
                }
                let newEdit = [];
                for (let i = 0; i < this.editData.length; i++) {
                    if (this.successId.includes(this.editData[i].id)) {
                        newEdit.push(this.editData[i]);
                    }
                }
                this.editData = newEdit;
            } else {
                alert('修改失敗!請稍後再試!');
            }
        },
    },
    watch: {
        mapshowedit() {
            // 取消編輯需要清除原本暫存的資料
            if (!this.mapshowedit) {
                this.editData = [];
                this.successData = [];
                this.oldEditDataLength = 0;
                // console.log('Cancel Edit');
            }
        },
        editData() {
            // 因為全部儲存的按鈕顯示會為動態的，而tabs的底線會停止不跟著文字移動，因此需要額外推底線24px(按鈕大小)
            let tabBottom = document.getElementsByClassName('v-tabs-slider-wrapper');
            //   console.log('old', this.oldEditDataLength);
            //   console.log('now', this.editData);
            if (this.oldEditDataLength !== this.editData.length) {
                if (this.editData.length == 1 && this.oldEditDataLength == 0) {
                    for (let i = 0; i < tabBottom.length; i++) {
                        // console.log('left',tabBottom[i].style.left);
                        tabBottom[i].style.left = (parseInt(tabBottom[i].style.left.split('px')[0]) + 24) + 'px';
                    }
                } else if (this.editData.length == 0) {
                    for (let i = 0; i < tabBottom.length; i++) {
                        // console.log('left',tabBottom[i].style.left);
                        tabBottom[i].style.left = (parseInt(tabBottom[i].style.left.split('px')[0]) - 24) + 'px';
                    }
                }
                this.oldEditDataLength = this.editData.length;
            }

        },
        nowAreaTag() {
            //   console.log('nowAreaTag',this.nowAreaTag)
            if(this.oldAreaTag!==this.nowAreaTag && this.nowAreaTag!=='setting') {
            this.changeArea(this.nowAreaTag);
            }
            setTimeout(()=>{
                if(document.getElementById(this.nowAreaTag)) {
                    let area = document.getElementById(this.nowAreaTag);
                    area.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth',
                    });
                    // console.log('scroll',area)
                }
                if(this.nowAreaTag=='setting') {
                    // 如果點選設定，編輯的icon消失，且原本暫存資料清空
                    if (this.mapshowedit) {
                        this.editData = [];
                        this.successData = [];
                        this.oldEditDataLength = 0;
                        this.mapshowedit = false;
                        // console.log('Cancel Edit');
                    }
                    // 點選設定時，如果此時的tabs超出寬(出現左右箭頭)，則需要位移-112px('顏色設定'+'配置設定'的寬度)，讓整個設定的子項都顯示在螢幕上
                    if(document.getElementsByClassName('v-slide-group__content')) {
                        let a = document.getElementsByClassName('v-slide-group__content');
                        for(let i=0;i<a.length;i++) {
                            if(a[i].style.transform) {
                                let trans = parseInt(a[i].style.transform.split('translateX(')[1].split('px)')[0]);
                                if(trans!==0) {
                                    a[i].style.transform = 'translateX('+(trans-112)+'px)';
                                }
                            } 
                        }
                    }
                }else {
                    this.setting = 'color';
                }
                // 如前一個點選設定，且有位移，則需要歸位+112px
                if(this.oldAreaTag=='setting' && this.nowAreaTag!=='setting') {
                    let a = document.getElementsByClassName('v-slide-group__content');
                    for(let i=0;i<a.length;i++) {
                        if(a[i].style.transform) {
                            let trans = parseInt(a[i].style.transform.split('translateX(')[1].split('px)')[0]);
                            if(trans!==(112)) {
                                a[i].style.transform = 'translateX('+(trans+112)+'px)';
                            }
                        }
                    }
                }
                this.oldAreaTag = this.nowAreaTag;
            },50)
        }
    }
}
</script>

<style lang="scss" scoped>
.v-card.map {
    .content {
        height: 100%;
        min-height: 100%;
    }
    .my-3 {
        &.theme--light.v-icon {
            color: rgba(0, 0, 0, 0.54);
            &.edit-action {
                color:$color-form;
            }
        }
    }
    .edit-action.theme--light.v-icon:hover::after,.mdi-pencil.theme--light.v-icon:hover::after {
        opacity: 0.1;
    }
}
  </style>