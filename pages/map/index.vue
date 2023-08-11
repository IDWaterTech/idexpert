<template>
  <div>
    <v-card>
        <div class="card-title">
            <v-row>
                <div class="title">
                    <v-icon>mdi-map-outline</v-icon>
                    <v-card-title>養殖池況</v-card-title>
                </div>
            </v-row>
        </div>
        <div class="content">
            <v-row>
                <v-col class="d-flex"
                        cols="12"
                        sm="6">
                    <v-select :items="fatorys" label="場" v-model="nowFactory" @change="changeFactory($event)">                
                    </v-select>   
                </v-col>
            </v-row>
            <v-row style="margin-top: 0;">
                <v-col cols="12"
                        sm="12">
                    <div v-if="areas.length > 0" class="tabs">
                        <v-tabs v-model="nowAreaTag">
                            <div class="icons">
                                <v-icon :class="{'edit-action':mapshowedit}" @click="mapshowedit = !mapshowedit" class="my-3">mdi-pencil</v-icon>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <button class="confirm" v-show="editData.length>0" @click="selectchecked" v-bind="attrs"
                                        v-on="on">
                                            <v-icon>mdi-check</v-icon>
                                        </button>
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
                            {{ area.name }}
                            </v-tab>
                            <v-tab-item v-for="area in areas" :key="area.areaNo" :value="area.areaNo">
                                <!-- <div class="pool-content">{{ pool }}</div> -->
                                <wc v-if="area.name == '武曲'" :showedit="mapshowedit" :statcolor="statcolor" :successData="successData" style="margin-bottom: 80px;" @editPoolOuter="edit($event)" @saveSuccess="saveDelete($event)" @getUser="getUser($event)"></wc>
                                <sp v-else-if="area.name == '救地球'" :showedit="mapshowedit" :statcolor="statcolor" :successData="successData" style="margin-bottom: 80px;" @editPoolOuter="edit($event)" @saveSuccess="saveDelete($event)"></sp>
                                <tf v-else-if="area.name == '天府'" :showedit="mapshowedit" :statcolor="statcolor" :successData="successData" style="margin-bottom: 80px;" @editPoolOuter="edit($event)" @saveSuccess="saveDelete($event)"></tf>
                                <zw v-else-if="area.name == '紫微'" :showedit="mapshowedit" :statcolor="statcolor" :successData="successData" style="margin-bottom: 80px;" @editPoolOuter="edit($event)" @saveSuccess="saveDelete($event)"></zw>
                                <div v-else class="nodata tabs">無資料</div>
                            </v-tab-item>
                            
                        </v-tabs>
                    </div>
                    <div v-show="areas.length == 0" class="nodata tabs">無資料</div>
                </v-col>
            </v-row>
        </div> 
    </v-card>
  </div>
</template>

<script>
import sp from "@/pages/map/sp.vue";
import tf from "@/pages/map/tf.vue";
import wc from "@/pages/map/wc.vue";
import zw from "@/pages/map/zw.vue";
export default {
    layout:'emptynologin',
    // middleware: "auth",
    components:{
        wc,
        sp,
        tf,
        zw
    },
    data() {
        return {
            mydialog: false,
            fatorys:[],
            areas:[],
            pools:[],
            mapshowedit: false,
            fatoryData:[],
            nowFactory: '',
            nowArea: '',
            nowAreaTag: '',
            editData:[],// 要變更的資料，全部儲存用
            oldEditDataLength:0,// 全部儲存的按鈕顯示時，tab的底線位置用
            statcolor: [
                { name: "無", color: "#D3DCE1",id: 1 },
                { name: "default", color: "#00273E" },
                { name: "放養中", color: "#F1E78D",id: 4 },
                { name: "放養中(鎖排汙)", color: "#CBAAE5",id: 32 },
                { name: " 集中暫養", color: "#8DA0E5",id: 31},
                { name: "尚未洗池", color: "#E8DDBF",id: 6 },
                { name: "已清洗", color: "#A8E6DB",id: 7 },
                { name: "蓄水中", color: "#D3B280",id: 8 },
                { name: "蓄水完畢", color: "#A5D380",id: 9 },
                { name: "消毒中", color: "#80D3AB",id: 10 },
                { name: "做水中", color: "#C5E8E6",id: 11 },
                { name: "預備放苗", color: "#83C9F0",id: 12 },
                { name: "空池", color: "#BFDAE8",id: 3 },
                { name: "養殖審核", color: "#D3808F",id: 33 }
            ],
            myuser: "web",
            successData:[]
        }
    },
    created() {
        this.getFactoryData();
        console.log('index Created');
    },
    mounted() {
        console.log('index Mounted')
    },
    methods: {
        showcard:function(){
            this.mydialog = true;
            //this.$toast.success(`hello`, { duration: 2000 });
        },
        getFactoryData:async function () {
            await this.$axios
                .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
                .then(res => {
                    console.log("architecture data", res);
                    this.fatoryData = res.data;
                    for(let i=0;i<this.fatoryData.length;i++) {
                        this.fatorys.push(this.fatoryData[i].name);
                    }
                    this.nowFactory = this.fatorys[0];
                    this.changeFactory(this.nowFactory);
                    console.log('factorys',this.fatorys);
                })
                .catch(error => {
                    this.$toast.error("error:" + error, { duration: 2000 });
                    console.log('error',error);
                })
        },
        changeFactory(evt) {
            // console.log(evt);
            this.nowFactory = evt; 
            this.areas = [];
            for(let i=0;i<this.fatoryData.length;i++) {
                if(this.fatoryData[i].name == evt) {
                    for(let x=0;x<this.fatoryData[i].node.length;x++) {
                        // this.areas.push(this.fatoryData[i].node[x].name);
                        this.areas.push({
                            areaNo: this.fatoryData[i].node[x].area_no,
                            name:this.fatoryData[i].node[x].name
                        });
                    }
                }
            }
            console.log('areas',this.areas);
            if(this.areas.length>0) {
                this.nowArea = this.areas[0].name;
                this.nowAreaTag = this.areas[0].areaNo;
                this.changeArea(this.nowArea);
            }
        },
        changeArea(evt) {
            console.log(evt);
            this.nowAreaTag = '';
            this.pools = [];
            this.nowArea = evt;
            for(let i=0;i<this.fatoryData.length;i++) {
                if(this.nowFactory!=='' && this.nowFactory == this.fatoryData[i].name) {
                    for(let x=0;x<this.fatoryData[i].node.length;x++) {
                        if(this.nowArea !== '' && this.fatoryData[i].node[x].name == evt) {
                            this.nowAreaTag = this.fatoryData[i].node[x].area_no;
                        }
                    }
                } 
            }
            // console.log(this.nowAreaTag);
        },
        edit(evt) {
            // 全部儲存用，接收子元件(更改池)的資料，儲存至editData
            let editID = [];
            this.editData.forEach(data=>{editID.push(data.id)});
            if(this.editData.length>0) {
                for(let x=0;x<evt.length;x++) {
                    if(editID.includes(evt[x].id)) {
                        for(let i=0;i<this.editData.length;i++) {
                            if(this.editData[i].id == evt[x].id && this.editData[i].value!==evt[x].value) {
                                this.editData[i].value = evt[x].value;
                            }
                        }
                    }else {
                        this.editData.push(evt[x]);
                    }
                }
                  
            }else {
                this.editData = evt;
            }
                  
            // console.log('EditTop',this.editData);
        },
        saveDelete(evt) {
            // 當子元件更改池，各自儲存後，需到父層變更editData資料，全部儲存時，再次丟出
            this.editData = this.editData.filter(x=>x.id!==evt.item.id);
            console.log('save Delete Data',this.editData);
        },
        selectchecked: async function() {
            // 全部儲存丟出api
            let apiNum = 0;
            let success = [];
            for(let i=0;i<this.editData.length;i++) {
                let newItems = this.statcolor.filter(x => x.name == this.editData[i].value); //抓到修改後的狀態id
                if (newItems.length == 1) {
                    const parm = {
                        id: newItems[0].id,
                        updated_user: this.myuser
                    };
                    // console.log('check',parm);
                    await this.$axios
                    .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-to-state/${this.editData[i].id}/`, parm)
                    .then(res => {
                        if (res.data == "修改成功") {
                            success.push(this.editData[i]);
                            if(i!==this.editData.length-1) {
                                apiNum++;
                            }else {
                                this.alertNowEdit(success);
                            }
                            
                        } else {
                            // alert(res.data);
                            if(i!==this.editData.length-1) {
                                apiNum++;
                            }else{
                                this.alertNowEdit(success);
                            }
                        }
                    })
                    .catch(error => {
                        alert("error:" + error.message);
                    });
                }else{
                    this.$toast.error(`修改失敗，找不到狀態id`, { duration: 2000 });
                }
            }
            
        },
        alertNowEdit(success) {
            // 全部儲存後統一彈跳視窗
            if(success.length>0) {
                this.successData = success;
                // console.log('index successData',this.successData);
                if(this.successData.length==this.editData.length) {
                    this.$toast.success(`修改成功`, { duration: 2000 });
                    this.editData = [];
                }else {
                    let fail = [];
                    let successId = [];
                    this.successData.forEach(data=>{successId.push(data.id)});
                    for(let i=0;i<this.editData.length;i++) {
                        if(!successId.includes(this.editData[i].id)) {
                            fail.push(this.editData[i]);
                        }
                    }
                    alert('部分修改失敗!請稍後再試!');
                }
                let newEdit = [];
                for(let i=0;i<this.editData.length;i++) {
                    if(this.successId.includes(this.editData[i].id)) {
                        newEdit.push(this.editData[i]);
                    }
                }
                this.editData = newEdit;
            }else{
                alert('修改失敗!請稍後再試!');
            }
        }
    },
    watch: {
        mapshowedit() {
            if(!this.mapshowedit) {
                this.editData=[];
                this.successData=[];
                // console.log('Cancel Edit');
            }
        },
        editData() {
            let tabBottom = document.getElementsByClassName('v-tabs-slider-wrapper');
            if(this.oldEditDataLength !== this.editData.length) {
                if(this.editData.length==1) {
                    for(let i=0;i<tabBottom.length;i++) {
                        // console.log('left',tabBottom[i].style.left);
                        tabBottom[i].style.left = (parseInt(tabBottom[i].style.left.split('px')[0])+24)+'px';
                    }
                }else if(this.editData.length==0) {
                    for(let i=0;i<tabBottom.length;i++) {
                        // console.log('left',tabBottom[i].style.left);
                        tabBottom[i].style.left = (parseInt(tabBottom[i].style.left.split('px')[0])-24)+'px';
                    }
                }
                    this.oldEditDataLength = this.editData.length;
            }
            
        }
    }
}
</script>

<style lang="scss">
    .v-card {
        // padding: 16px;
        height: 80vh;
        // overflow-y: scroll;
        overflow: hidden;
        .card-title {
            padding: 12px 24px;
            // background-color: #006AA6;
            // color: #fefefe;
            .row {
                margin-left: 0;
                margin-top: 0;
            }
            .title {
                display: flex;
                align-items: center;
            }
        }
        .v-card__title {
            color: #00273E;
            font-weight: bold;
        }
        .content {
            padding: 12px 24px;
            height: 100%;
            overflow-y: scroll;
        }
    }
    .v-select__selection--comma {
        color: #00273E;
    }
    .theme--light.v-label,.theme--light.v-icon,.theme--light.v-input {
        color: #6c9bcd;
    }
    .theme--light.v-text-field > .v-input__control > .v-input__slot:before,.theme--light.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before {
     
        border-color: #6c9bcd;
    }
    .input-pool {
        input,.update-time,.theme--light.v-label,.theme--light.v-icon,.theme--light.v-input {
            color: #1b375b;
        }
        .theme--light.v-text-field > .v-input__control > .v-input__slot:before, .theme--light.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before {
            border-color: #00273E;
        }
    }
    .v-select.v-text-field:not(.v-text-field--single-line) input {
        cursor: pointer;
    }
    .pool-content {
        width: 100%;
        height: 120px;
        border: #002134;
        border-radius: 4px;
        color:#002134;
        padding: 20px;
    }
    .v-main__wrap {
        padding: 24px;
    }
    .tabs {
        // .tab-item {
        //     overflow-y: scroll;
        // }
        .v-tabs {
            margin-bottom: 8px;
        }
        .theme--light.v-tabs-items {
            padding-top: 24px;
        }
    }
    .my-3 {
        &.theme--light.v-icon {
            margin: 16px;
            cursor: pointer;
            color: rgba(0, 0, 0, 0.54);
            &.edit-action {
                color:#6c9bcd;
            }
        }
    }
    .block {
        color: #00273E;
    }
    .road,.block {
        border-radius: 6px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .road {
        font-size: 14px;
        padding: 12px;
        margin: 0 12px;
    }
    .nodata {
        padding-left: 24px;
    }
    .last-update {
        font-size: 14px;
        color: #00273E;
        padding-right: 28px;
    }
    .edit-action.theme--light.v-icon:hover::after {
        opacity: 0.1;
    }
    .mdi-pencil.theme--light.v-icon:hover::after {
        opacity: 0.1;
    }
    .icons {
        display: flex;
        align-items: center;
        margin-right: 16px;
        .confirm {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            background-color: #006AA6;
            float: right;
            box-shadow: 0 0 5px rgba(0,0,0,0.15);
            transition: 0.3s;
            &:hover {
                background-color: lighten($color: #006AA6, $amount: 1.5);
            }
            .theme--light.v-icon {
                color: #fff;
                font-size: 14px;
            }
        }
    }
    
    // scrollbar
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    ::-webkit-scrollbar-track {
        background: #fefefe; 
    }
    ::-webkit-scrollbar-thumb {
        background-color: #1b375b;
    }
    // ::-webkit-scrollbar-button {
    //     border-radius: 4px;
    //     background: transparent;
    // }
</style>