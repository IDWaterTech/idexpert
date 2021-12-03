<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-btn tile color="primary" @click="showdevdialog()">新增</v-btn>
      </v-col>
      <v-col cols="12">
        <el-table
          :data="devicedata"
          style="width: 100%"
          max-height="300"
          :header-cell-style="tableHeaderStyle"
        >
          <!-- <el-table-column prop="id" label="ID" align="center">
          </el-table-column> -->
          <el-table-column prop="device_no" label="機台編號" align="center">
          </el-table-column>
          <el-table-column prop="channel" label="通道" align="center">
          </el-table-column>
          <el-table-column prop="name" label="匿名" align="center">
          </el-table-column>
          <!-- <el-table-column prop="pond_id" label="pond_id" align="center">
          </el-table-column> -->
          <el-table-column prop="pond_name" label="池名" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <v-btn tile color="primary" @click="showdevdialog(false,scope.row)">編輯</v-btn>
              <v-btn tile color="error" @click="deldev(scope.row)">刪除</v-btn>
            </template>
          </el-table-column>
        </el-table>
      </v-col>
      <v-dialog v-model="dialog.dev" width="500px">
        <v-form ref="devform" v-model="dialog.valid" lazy-validation>
          <v-card>
            <v-card-title
              >設備-{{ dialog.addmode ? "新增" : "編輯" }}</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text>
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
              >
                <div slot="value-label" slot-scope="{ node }">
                  {{ `${node.raw.parent}_${node.raw.name}` }}
                </div>
                <div slot="option-label" slot-scope="{ node }">
                  {{ `${node.raw.name}` }}
                </div>
              </treeselect>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                tile
                @click="submitdevdialog(dialog.addmode)"
                >確定</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import _ from "lodash";
import "element-ui/lib/theme-chalk/index.css";
export default {
  layout: "emptynologin",
  middleware: "auth",
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
      }
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
        await this.$axios
          .post(`${this.$store.state.mydata.gobal_api.apiUrl}/device/`, parm)
          .then(res => {
            console.log("新增 API:" + res.request.responseURL);
            if (res.data == "新增成功") {
              this.dialog.dev = false;
              this.$toast.success("新增成功", { duration: 2000 });
            } else {
              this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
            }
          })
          .catch(error => {
            this.$toast.error("error:" + error, { duration: 2000 });
          });
      } else {
        //edit mode
        let parm = _.cloneDeep(this.dialog.parm);
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/device/${parm.id}`;
        parm.updated_user = parm.created_user;
        delete parm.created_user;
        delete parm.id;
        delete parm.pond_name;
        // console.log(parm);
        await this.$axios
          .patch(url, parm)
          .then(res => {
            console.log("修改 API:" + res.request.responseURL);
            if (res.data == "修改成功") {
              this.dialog.dev = false;
              this.$toast.success("修改成功", { duration: 2000 });
            } else {
              this.$toast.error("修改失敗:" + res.data, { duration: 2000 });
            }
          })
          .catch(error => {
            this.$toast.error("error:" + error, { duration: 2000 });
          });
        
      }
      this.getDevice();
    },
    deldev:async function(data){
      if (confirm('確定刪除？')) {
        await this.$axios
        .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/device/${data.id}`)
        .then(res => {
          if (res.data=="刪除成功") {
            this.$toast.success("刪除成功", { duration: 2000 });
          }else{
            this.$toast.success("刪除失敗："+res.data, { duration: 2000 });
          }
          console.log("刪除 API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
        
        await this.getDevice();
      }

    },
    getDevice: async function() {
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/device/`)
        .then(res => {
          this.devicedata = res.data;
          console.log("device清單 API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
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
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`)
        .then(res => {
          // this.maindata = res.data;
          var data = this.setNestedDisabled(_.cloneDeep(res.data), "");
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
          console.log("廠 API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
    }
  },
  async mounted() {
    await this.getmain();
    await this.getDevice();
  }
};
</script>

<style scoped></style>
