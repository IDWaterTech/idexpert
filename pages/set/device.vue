<template>
  <div>
    <v-overlay :value="!isLoading" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card class="bg-card result-card mb-3" style="min-height:86vh">
      <!-- 表頭 -->
      <div class="card-title mx-2 my-0 pa-3 border-bottom cursor-pointer">
        <div class="title full-width">
              <v-card-title class="pa-0" style="font-size: 1.1rem;">設備清單</v-card-title>
          </div>
          <div class="chevron">
            <v-btn class="btn-secondary green px-2 py-0" @click="showdevdialog()"><v-icon>mdi-plus</v-icon> 新增設備</v-btn>
          </div>
      </div>
      <!-- 清單 -->
      <div class="content full-width">
        <el-table
          :data="devicedata"
          class="full-width"
          max-height="300"
        >
          <!-- <el-table-column prop="id" label="ID" align="center">
          </el-table-column> -->
          <el-table-column prop="device_no" label="機台編號" >
          </el-table-column>
          <el-table-column prop="channel" label="通道">
          </el-table-column>
          <el-table-column prop="name" label="匿名" >
          </el-table-column>
          <!-- <el-table-column prop="pond_id" label="pond_id" align="center">
          </el-table-column> -->
          <el-table-column prop="pond_name" label="池名">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn  class="btn-icon"
                          @click="showdevdialog(false,scope.row)"
                          v-bind="attrs" v-on="on"
                          style="pointer-events: inherit;">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </template>
                <span>編輯</span>
              </v-tooltip>
              <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-icon delete"
                        @click="deldev(scope.row)"
                        v-bind="attrs" v-on="on"
                        :class="{'disabled':scope.row.id == 1}"
                        style="pointer-events: inherit;">
                          <v-icon>mdi-trash-can</v-icon>
                      </v-btn>
                  </template>
                  <span>刪除</span>
              </v-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </v-card>
    <v-dialog v-model="dialog.dev" width="500px">
      <v-form ref="devform" v-model="dialog.valid" lazy-validation>
        <v-card class="custom-dialog">
          <v-card-title class="add-title">
            <div class="d-inline-block">
              設備-{{ dialog.addmode ? "新增" : "編輯" }}
            </div>
            <div class="add">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="dialog.dev = false">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="basic pl-2">
              <v-card-text class="d-flex flex-column pt-4">
                <!-- 機台編號 -->
                <v-text-field
                  autocomplete="off"
                  v-model="dialog.parm.device_no"
                  clearable
                  filled
                  :rules="rules.require"
                  dense
                  :disabled="!dialog.addmode"
                  placeholder="fe12::5c2:331ea:asdfe:3d5"
                >
                  <template slot="prepend"
                    ><span style="width:80px;">機台編號</span></template
                  >
                </v-text-field>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0">
                <!-- 通道 -->
                <v-text-field
                  autocomplete="off"
                  v-model="dialog.parm.channel"
                  clearable
                  filled
                  :rules="rules.require"
                  dense
                  :disabled="!dialog.addmode"
                  placeholder="001"
                >
                  <template slot="prepend"
                    ><span style="width:80px;">通道</span></template
                  >
                </v-text-field>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0">
                <!-- 暱名 -->
                <v-text-field
                  autocomplete="off"
                  v-model="dialog.parm.name"
                  clearable
                  filled
                  :rules="rules.require"
                  dense
                  placeholder="DEV001"
                >
                  <template slot="prepend"
                    ><span style="width:80px;">匿名</span></template
                  >
                </v-text-field>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0">
                <treeselect
                  v-model="dialog.parm.pond_id"
                  :options="maindata"
                  :default-expand-level="1"
                  placeholder="養殖池"
                  :disable-branch-nodes="true"
                  children="node"
                  :normalizer="
                    node => {
                      return { children: node.node };
                    }
                  "
                  style="font-size:1.2em;"
                  class="select-template"
                >
                  <div slot="value-label" slot-scope="{ node }">
                    {{ `${node.raw.parent}_${node.raw.name}` }}
                  </div>
                  <div slot="option-label" slot-scope="{ node }">
                    {{ `${node.raw.name}` }}
                  </div>
                </treeselect>
              </v-card-text>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="dialog.dev = false">取消</v-btn>
            <v-btn class="btn-primary" @click="submitdevdialog(dialog.addmode)">確定</v-btn>
          </v-card-actions>
          
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import "element-ui/lib/theme-chalk/index.css";
export default {
  layout: "emptynologin",
  middleware: "auth",
  head(){
    return {
      title:"設備設定",
    }
  },
  data() {
    return {
      maindata: [],
      devicedata: [
        {
          id: 0,
          device_no: 0,
          channel: 0,
          name: "Dev_test",
          pond_id: 0,
          pond_name: "test_t1"
        }
      ],
      rules: { require: [v => !!v || "*必要項目"] },
      dialog: {
        dev: false,
        valid: true,
        addmode: true,
        parm: {
          device_no: undefined,
          channel: undefined,
          name: undefined,
          pond_id: undefined,
          created_user: undefined
        }
      },
      isLoading: false,
    };
  },
  methods: {
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      let bgcolor=$nuxt.$vuetify.theme.themes.light.cardtitle;
      if (rowIndex == 0) {
        return `background-color:${bgcolor};color:#fff;font-weight:500;`;
      }else{
        return `background-color:${bgcolor};`;
      }
    },
    showdevdialog: function(mode = true,data) {
      
      if (this.$refs.devform != undefined && mode==true) {
        this.dialog.parm.pond_id = undefined;
        delete this.dialog.parm.pond_name;
        this.$refs.devform.reset();
      }
      this.dialog.addmode = mode;
      if (mode==false) {//編輯狀態
        this.dialog.parm =  _.cloneDeep(data);
        delete this.dialog.parm.pond_name;
        console.log(this.dialog.parm );
      }
      this.dialog.dev = true;
    },
    submitdevdialog: async function(mode = true) {
      if (!this.$refs.devform.validate()) {
        return;
      }
      this.dialog.parm.created_user = this.$auth.$state.user.email;
      if (mode == true) {
        let parm = this.dialog.parm;
        var res = false;
        res = await this.posDeviceList(parm);
        setTimeout(()=>{
            if(res) {
              this.dialog.dev = false;
            }
        },50)
        // await this.$axios
        //   .post(`${this.$store.state.mydata.gobal_api.apiUrl}/device/`, parm)
        //   .then(res => {
        //     console.log("新增 API:" + res.request.responseURL);
        //     if (res.data == "新增成功") {
        //       this.dialog.dev = false;
        //       this.$toast.success("新增成功", { duration: 2000 });
        //     } else {
        //       this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
        //     }
        //   })
        //   .catch(error => {
        //     this.$toast.error("error:" + error, { duration: 2000 });
        //   });
      } else {
        //edit mode
        let parm = _.cloneDeep(this.dialog.parm);
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/device/${parm.id}/`;
        parm.updated_user = parm.created_user;
        delete parm.created_user;
        delete parm.id;
        delete parm.pond_name;
        var id = this.dialog.parm.id;
        var res = false;
        res = await this.patchDeviceList(parm,id);
        setTimeout(()=>{
            if(res) {
              this.dialog.dev = false;
            }
        },50)
        // console.log(parm);
        // await this.$axios
        //   .patch(url, parm)
        //   .then(res => {
        //     console.log("修改 API:" + res.request.responseURL);
        //     if (res.data == "修改成功") {
        //       this.dialog.dev = false;
        //       this.$toast.success("修改成功", { duration: 2000 });
        //     } else {
        //       this.$toast.error("修改失敗:" + res.data, { duration: 2000 });
        //     }
        //   })
        //   .catch(error => {
        //     this.$toast.error("error:" + error, { duration: 2000 });
        //   });
        
      }
      this.getDevice();
    },
    deldev:async function(data){
      if (confirm('確定刪除？')) {
        var id = data.id;
        var res = false;
        res = await this.deleteDeviceList(id);
        
        // await this.$axios
        // .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/device/${data.id}`)
        // .then(res => {
        //   if (res.data=="刪除成功") {
        //     this.$toast.success("刪除成功", { duration: 2000 });
        //   }else{
        //     this.$toast.success("刪除失敗："+res.data, { duration: 2000 });
        //   }
        //   console.log("刪除 API:" + res.request.responseURL);
        // })
        // .catch(error => {
        //   this.$toast.error("error:" + error, { duration: 2000 });
        // });
        
        await this.getDevice();
      }

    },
    getDevice: async function() {
      this.isLoading = false;
      let getDeviceList = await this.getDeviceList();
      let data = typeof (getDeviceList)=='string'?[]:getDeviceList;
      this.devicedata = data;
      this.isLoading = true;
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/device/`)
      //   .then(res => {
      //     this.devicedata = res.data;
      //     console.log("device清單 API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.$toast.error("error:" + error, { duration: 2000 });
      //   });
    },
    setNestedDisabled: function(obj, name) {
      //全部都設成disabled
      obj.forEach((itm, index) => {
        // console.log(itm.name);//所有node(含leaf)的名稱
        itm.parent = itm.hasOwnProperty("parent")
          ? itm.parent + "_" + name
          : name;
        const nodelst = ["1", "2"];
        if (nodelst.filter(x => x == itm.level) > 0) {
          itm.id = itm.name + "_" + itm.id;
        }
        if (itm.visible == false) {
          //隱藏走道用
          delete obj[index];
          return obj; //不用再找有無node
        }
        if (itm.hasOwnProperty("node")) {
          this.setNestedDisabled(itm.node, itm.name);
        }
      });
      return obj;
    },
    getmain: async function() {
      let reqid = "";
      let getedItem = {};
      let architectureData = await this.getArchitecture();
      var data = this.setNestedDisabled(_.cloneDeep(typeof (architectureData)=='string'?[]:architectureData), "");
      this.maindata = data;
      //用id抓到name
      this.maindata.forEach(x => {
        x.node.forEach(y => {
          var item = y.node.filter(z => z.id == reqid);
          if (item.length == 1) {
            getedItem = item[0];
            return;
          }
        });
      });
      //把區域名稱加進去
      if (getedItem.hasOwnProperty("name")) {
        this.poolName = getedItem.name;
        console.log(getedItem);
      }
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
      //   .then(res => {
      //     // this.maindata = res.data;
      //     var data = this.setNestedDisabled(_.cloneDeep(res.data), "");
      //     this.maindata = data;
      //     //用id抓到name
      //     this.maindata.forEach(x => {
      //       x.node.forEach(y => {
      //         var item = y.node.filter(z => z.id == reqid);
      //         if (item.length == 1) {
      //           getedItem = item[0];
      //           return;
      //         }
      //       });
      //     });
      //     //把區域名稱加進去
      //     if (getedItem.hasOwnProperty("name")) {
      //       this.poolName = getedItem.name;
      //       console.log(getedItem);
      //     }
      //     console.log("場 API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.$toast.error("error:" + error, { duration: 2000 });
      //   });
    }
  },
  async mounted() {
    await this.getmain();
    await this.getDevice();
  }
};
</script>

<style lang="scss" scoped>
.v-card.result-card {
  &.bg-card {
    background-color: #fff;
  }
  .card-title {
    .title {
      font-size: 1rem;
    }
    .chevron {
      @include flexAlignCenter();
    }
  }
}
</style>
