<template>
    <div>
        <treeselect
              :disabled="disabled"
              @input="changeEvent"
              v-model="dataid"
              :options="maindataScope"
              :default-expand-level="1"
              :disable-branch-nodes="true"
              children="node"
              :placeholder="placeStr"
              :multiple="isMulti"
              :normalizer="
                node => {
                  return { children: node.node };
                }
              "
              :limit="parseInt(limit)"
              :limitText="() => `+${dataid.length - parseInt(limit)}`"
              class="font-size-large"
            >
              <div slot="value-label" slot-scope="{ node }"  class="font-size-large"  v-text="node.raw.parent != undefined && node.raw.parent.length > 0 ? node.raw.parent + '_'+node.raw.name:''+node.raw.name">
              </div>
              <div slot="option-label" slot-scope="{ node }">{{ `${node.raw.name}` }}
              </div>
        </treeselect>
    </div>
</template>

<script>
export default {
    props: {
        dataScope: {
            type: String,
            default: "field",//資料範圍：field 場 area 區 pool 池
        },
        isMulti: {
            type: Boolean,
            default: false
        },
        defaultSelect:{//預設選定項目
            type:[String,Array,Object],
            default:''
        },
        limit:{//預設選定項目
            type: String,
            default: '1'
        },
        disabled:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dataid: undefined,
            maindata: [],
            datarange: [
                { level: 1, name: "field" },
                { level: 2, name: "area" },
                { level: 3, name: "pool" }
            ],
        }
    },
    computed: {
        placeStr: function() {
            var rtnStr = "請選擇";
            switch(this.dataScope){
                case "field":
                    rtnStr+="養殖場";
                    break;
                    case "area":
                    rtnStr+="養殖區域";
                    break;
                    case "pool":
                    rtnStr+="養殖池";
                    break;
            }
            return rtnStr;
        },
        maindataScope:function(){
            var data = _.cloneDeep(this.maindata);
            var level = this.datarange.filter(x=>x.name == this.dataScope)[0].level;
            return this.nestedMain(data,level);
        }
        
      
    },
    methods: {
        setDefault:function(){
            if(this.defaultSelect=='') {
                this.dataid = undefined;
                return;
            }else{
                //console.log('locate-select  設定項目',this.defaultSelect);
                this.dataid = this.defaultSelect;
                //預設項目需回傳EMIT事件會造成無限迴圈
                this.$emit('scopeSel_data',this.dataid);
            }
        },
        // 資料改變時，傳出數值
        changeEvent:function(){
            // console.log('locate-select scopeSel_data emit!');
            this.$emit('scopeSel_data',this.dataid);
        },
        getMainData: async function () {
            console.log('trigger locate-select getMainData');
            // let reqid = this.dataid;
            // let getedItem = {};
            //取得整場架構資料
            //visible寫死名稱含^=false，寫死池的狀態=無=false
            // await this.$axios
            //     .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
            //     .then(res => {
            //         this.maindata = res.data;
            //         var data = this.setNestedDisabled(_.cloneDeep(this.maindata), "");
            //         this.maindata = data;
            //     });
            let architectureData = await this.getArchitecture();
            this.maindata = typeof (architectureData)=='string'?[]:architectureData;
            localStorage.setItem('architecture',JSON.stringify(this.maindata));
            var data = this.setNestedDisabled(_.cloneDeep(this.maindata), "");
            this.maindata = data;
            console.log('trigger getMainData:',this.maindata);
        },
        setNestedDisabled: function (obj, name, onlyshowlevel = 1) {
            //全部都設成disabled
            var deleteindex = [];
            var objj = obj;
            objj.forEach((itm, index) => {
                // console.log(itm.name);//所有node(含leaf)的名稱
                itm.parent =
                    itm != undefined && itm.hasOwnProperty("parent")
                        ? itm.parent + "_" + name
                        : name;
                const nodelst = ["1", "2"]; //第1、2層
                if (nodelst.filter(x => x == itm.level) > 0) {
                    itm.id = itm.name + "_" + itm.id;
                }
                if (itm.visible == false) {
                    //visible的不顯示
                    deleteindex.push(index);
                }
                if (itm.hasOwnProperty("node")) {
                    this.setNestedDisabled(itm.node, itm.name, onlyshowlevel);
                }
            });
            // for (let i = 0; i < deleteindex.length; i++) {
            //   const element = deleteindex[i];
            //   obj.splice(element, 1);
            // }
            //刪除 走道
            for (var i = deleteindex.length - 1; i >= 0; i--) {
                objj.splice(deleteindex[i], 1);
            }
            return objj;
        },
        //計算資料範圍
        nestedMain: function (obj, level) {
            obj.forEach(itm => {
                if (itm.level == level) {
                    if (itm.hasOwnProperty("node")) {
                        delete itm.node;
                    }
                }
                if (itm.hasOwnProperty("node")) {
                    this.nestedMain(itm.node, level);
                }
                
            });
            return obj;
        },
    },
    async mounted() {
        //取得整場架構資料
        await this.getMainData();
    },
    created() {
        this.setDefault();//預設項目
        //console.log('default select',this.defaultSelect);
    },
    watch: {
        defaultSelect() {
            // 如該頁連結有帶參數，需要預設值
            this.setDefault();
        }
    }

}
</script>

<style lang="scss" scoped>
.font-size-large {
    font-size:1.3em;
}
</style>

<!-- ★★★★★★★★★★★★★使用方式★★★★★★★★★★★★ -->
<!-- ★★★★★★★★★★★★★使用方式★★★★★★★★★★★★ -->
<!-- ★★★★★★★★★★★★★使用方式★★★★★★★★★★★★ -->

<!-- <template>
    <div>
        <locate-select :dataScope="'area'" defaultSelect="天府_1" :isMulti="false" @scopeSel_data="get_scopeData($event)"></locate-select>
    </div>
</template>

<script>
export default {
    layout: 'emptynoheaderdrawer',
    methods: {
        get_scopeData:function(evt){
            console.log(evt);
        }
    },

}
</script>-->
