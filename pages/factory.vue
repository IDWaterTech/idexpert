<template>
  <div>
    <h2>廠域設定</h2>
    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <v-row no-gutters align="center">
          <v-col cols="6"
            ><v-select
              v-model="sel_main"
              :items="maindata"
              item-value="id"
              item-text="name"
              label="選擇廠"
              clearable
              @change="
                () => {
                  if (sel_main) {
                  } else {
                    sel_area = undefined;
                    pooldata = [];
                  }
                }
              "
              dense
            >
            </v-select
          ></v-col>
          <v-col cols="6">
            <v-btn icon color="success" @click="showdialog('add', 'main')"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn
              icon
              color="success"
              :disabled="!sel_main"
              @click="showdialog('edit', 'main')"
              ><v-icon>mdi-pencil-outline</v-icon></v-btn
            >
            <v-btn
              icon
              :disabled="!sel_main"
              color="error"
              @click="
                delsubmit(
                  'main',
                  maindata.filter(x => x.id == sel_main)[0].name
                )
              "
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </v-col>
        </v-row>

        <!-- @change="sel_main > 0 ? '' : (showmp = false)" -->
      </v-col>
      <v-col cols="12" sm="4">
        <v-row no-gutters align="center">
          <v-col cols="6">
            <v-select
              v-model="sel_area"
              :items="areadata"
              item-value="id"
              item-text="name"
              clearable
              dense
              label="選擇區域"
              no-data-text="查無資料"
              :disabled="!sel_main"
              @change="getPoolData"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-btn
              icon
              :disabled="!sel_main"
              color="success"
              @click="showdialog('add', 'area')"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn
              icon
              color="success"
              :disabled="!sel_area"
              @click="showdialog('edit', 'area')"
              ><v-icon>mdi-pencil-outline</v-icon></v-btn
            >
            <v-btn
              icon
              :disabled="!sel_area"
              color="error"
              @click="
                delsubmit(
                  'area',
                  areadata.filter(x => x.id == sel_area)[0].name
                )
              "
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="4">
        <v-row no-gutters align="center">
          <v-col cols="6">
            <v-autocomplete
              v-model="sel_pool"
              :items="pooldata"
              item-text="name"
              item-value="id"
              no-data-text="查無資料"
              placeholder="請選擇養殖池"
              :disabled="!sel_area"
              clearable
              dense
            ></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-btn
              icon
              :disabled="!sel_area"
              color="success"
              @click="showdialog_pool('add')"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn
              icon
              :disabled="!sel_pool"
              color="success"
              @click="showdialog_pool('edit')"
              ><v-icon>mdi-pencil-outline</v-icon></v-btn
            >
            <v-btn
              icon
              :disabled="!sel_pool"
              color="error"
              @click="
                delsubmit(
                  'pool',
                  pooldata.filter(x => x.id == sel_pool)[0].name
                )
              "
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="3"
        v-for="item in pooldata.filter(
          x => x.id == sel_pool || sel_pool == undefined || sel_pool == ''
        )"
        :key="item.id"
      >
        <v-card tile>
          <v-card-subtitle>
            {{ item.name }}
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <ol>
              <div v-for="it in Object.keys(item)" :key="it">
                <li
                  v-if="itemname.filter(x => x.name == it).length>0 && itemname.filter(x => x.name == it)[0].visible == true"
                  style="font-weight:500;"
                >
                  {{ itemname.filter(x => x.name == it)[0].text }}：{{
                    item[it]
                  }}
                </li>
                <li v-if="itemname.filter(x => x.name == it).length==0">{{it}}-{{item[it]}}</li>
              </div>
            </ol>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog.main" width="500px">
      <v-form ref="mainform" v-model="mainvalid" lazy-validation>
        <v-card>
          <v-card-title
            >{{
              edititem.type == "add"
                ? "新增"
                : edititem.type == "edit"
                ? "編輯"
                : "刪除"
            }}-{{
              edititem.class == "main"
                ? "廠"
                : edititem.class == "area"
                ? "區域"
                : "養殖池"
            }}</v-card-title
          >
          <v-card-text>
            <v-text-field
              placeholder="請輸入名稱"
              v-model="edititem.value"
              :rules="rules.require"
              autocomplete="off"
            ></v-text-field>
            <v-text-field
              v-if="edititem.class == 'area'"
              placeholder="請輸入英文代稱(wc、tf、zw...)"
              v-model="edititem.value_en"
              :rules="rules.require"
              autocomplete="off"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="editsubmit">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="dialog.pool" width="500px">
      <v-form ref="poolform" v-model="poolvalid" lazy-validation>
        <v-card v-if="sel_area">
          <v-card-title
            >{{ areadata.filter(x => x.id == sel_area)[0].name }}-養殖池-{{
              edititem_pool.type == "add" ? "新增" : "編輯"
            }}</v-card-title
          >
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field
              autocomplete="off"
              v-model="edititem_pool.parm.name"
              :rules="rules.require"
              clearable
              dense
            >
              <template slot="prepend"
                ><span style="width:50px;">名稱</span></template
              >
            </v-text-field>
            <v-text-field
              autocomplete="off"
              v-model="edititem_pool.parm.volume"
              :rules="rules.require"
              type="number"
              clearable
            >
              <template slot="prepend"
                ><span style="width:50px;">體積</span></template
              >
            </v-text-field>
            <v-text-field
              autocomplete="off"
              v-model="edititem_pool.parm.depth"
              :rules="rules.require"
              type="number"
              clearable
            >
              <template slot="prepend"
                ><span style="width:50px;">深度</span></template
              >
            </v-text-field>
            <!-- <v-text-field
              autocomplete="off"
              v-model="edititem_pool.parm.density"
              :rules="rules.require"
              clearable
            >
              <template slot="prepend"
                ><span style="width:50px;">密度</span></template
              >
            </v-text-field> -->
            <v-text-field
              autocomplete="off"
              v-model="edititem_pool.parm.num"
              :rules="rules.require"
              type="number"
              clearable
            >
              <template slot="prepend"
                ><span style="width:50px;">池子數</span></template
              >
            </v-text-field>
            <v-text-field
              autocomplete="off"
              v-model="edititem_pool.parm.aeration_tray_num"
              :rules="rules.require"
              type="number"
              clearable
            >
              <template slot="prepend"
                ><span style="width:50px;">曝氣盤數</span></template
              >
            </v-text-field>
            <v-text-field
              autocomplete="off"
              v-model="edititem_pool.parm.video_url"
              clearable
              placeholder="輸入包含https的連結"
            >
              <template slot="prepend"
                ><span style="width:50px;">觀察網影像</span></template
              >
            </v-text-field>
            <v-select
              v-model="edititem_pool.parm.pond_state_id"
              :items="poolstat"
              :rules="rules.require"
              item-text="name"
              item-value="id"
              :disabled="true"
              v-if="edititem_pool.type == `add`"
              ><template slot="prepend"
                ><span style="width:50px;">狀態</span></template
              ></v-select
            >
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="poolsubmit(edititem_pool.type)">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import https from "https";
import _ from "lodash";
const agent = new https.Agent({
  rejectUnauthorized: false
});

export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
    return {
      rules: { require: [v => !!v || "*必要項目"] },
      maindata: [],
      sel_main: "",
      sel_area: "",
      sel_pool: "",
      pooldata: [],
      dialog: {
        main: false,
        pool: false
      },
      edititem: {
        type: "add", //add新增還是del刪除
        class: "", //新增廠、區、池
        value: ""
      },
      edititem_pool: {
        type: "add", //add新增還是del刪除
        parm: {}
      },
      poolstat: [],
      poolvalid: true,
      mainvalid: true,
      itemname: [
        { name: "id", text: "id", visible: false },
        { name: "name", text: "名稱", visible: true },
        { name: "volume", text: "體積", visible: true },
        { name: "depth", text: "深度", visible: true },
        { name: "num", text: "池子數", visible: true },
        { name: "aeration_tray_num", text: "曝氣盤數", visible: true },
        { name: "state", text: "狀態", visible: true },
        { name: "video_url", text: "觀察網影像", visible: true },

      ]
    };
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    await this.getmain();
    await this.getpoolstat(); //取得池狀態清單
  },
  methods: {
    getmain: async function() {
      await this.$axios
        .get("https://61.56.172.10/architecture/", { httpsAgent: agent })
        .then(res => {
          this.maindata = res.data;
          console.log("API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$axios.error("error:" + error, { duration: 2000 });
        });
    },
    getpoolstat: async function() {
      //取得池狀態清單
      await this.$axios
        .get("https://61.56.172.10/pond-state/")
        .then(res => {
          this.poolstat = res.data.filter(x => x.name != ""); //不提供保留項;
        })
        .catch(error => {
          alert("error:" + error.message);
        });
    },
    getPoolData: async function() {
      this.sel_pool = "";
      let pool = [];
      if (!this.sel_area) {
        this.pooldata = pool;
        return;
      }
      var para = {
        id: this.sel_area
      };

      await this.$axios
        .get(
          "https://61.56.172.10/ponds-data/",
          { params: para },
          { httpsAgent: agent }
        )
        .then(res => {
          console.log("API:" + res.request.responseURL);
          pool = res.data;
        })
        .catch(error => {
          this.$axios.error("error:" + error, { duration: 2000 });
          pool = [];
        })
        .finally(() => {
          /* 不論失敗成功皆會執行 */ this.pooldata = pool;
        });
    },
    editsubmit: async function() {
      if (this.$refs.mainform.validate() == false) {
        return;
      }
      const updUser = this.$auth.$state.user.email;
      console.log(this.edititem);
      let id = this.edititem.id;
      if (this.edititem.type == "add") {
        let parm = {
          name: this.edititem.value,
          created_user: updUser
        };
        switch (this.edititem.class) {
          case "main":
            await this.$axios
              .post("https://61.56.172.10/factory/", parm, {
                httpsAgent: agent
              })
              .then(res => {
                console.log("API:" + res.request.responseURL);
                if (res.data == "新增成功") {
                  this.dialog.main = false;
                  this.getmain();
                  this.$toast.success("新增成功", { duration: 2000 });
                } else {
                  this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
                }
              })
              .catch(error => {
                this.$toast.error("error:" + error, { duration: 2000 });
              });
            break;
          case "area":
            parm = {
              area_no: this.edititem.value_en,
              name: this.edititem.value,
              factory_id: this.sel_main,
              created_user: updUser
            };
            await this.$axios
              .post("https://61.56.172.10/pond-area/", parm, {
                httpsAgent: agent
              })
              .then(res => {
                console.log("API:" + res.request.responseURL);
                if (res.data == "新增成功") {
                  this.dialog.main = false;
                  this.getmain();
                  this.$toast.success("新增成功", { duration: 2000 });
                } else {
                  this.$toast.error("新增失敗:" + res.data, { duration: 2000 });
                }
              })
              .catch(error => {
                this.$toast.error("error:" + error, { duration: 2000 });
              });
            break;
          default:
            break;
        }
      } else if (this.edititem.type == "edit") {
        let parm = {
          name: this.edititem.value,
          updated_user: updUser
        };
        switch (this.edititem.class) {
          case "main":
            await this.$axios
              .patch(`https://61.56.172.10/factory/${id}/`, parm, {
                httpsAgent: agent
              })
              .then(res => {
                console.log("API:" + res.request.responseURL);
                if (res.data == "修改成功") {
                  this.dialog.main = false;
                  this.getmain();
                  this.sel_main = "";
                  this.$toast.success("修改成功", { duration: 2000 });
                } else {
                  this.$toast.error("修改失敗:" + res.data, { duration: 2000 });
                }
              })
              .catch(error => {
                this.$toast.error("error:" + error, { duration: 2000 });
              });
            break;
          case "area":
            parm = {
              area_no: this.edititem.value_en,
              name: this.edititem.value,
              updated_user: updUser
            };
            await this.$axios
              .patch(`https://61.56.172.10/pond-area/${id}/`, parm, {
                httpsAgent: agent
              })
              .then(res => {
                console.log("API:" + res.request.responseURL);
                if (res.data == "修改成功") {
                  this.dialog.main = false;
                  this.getmain();
                  this.sel_main = "";
                  this.sel_area = "";
                  this.$toast.success("修改成功", { duration: 2000 });
                } else {
                  this.$toast.error("修改失敗:" + res.data, { duration: 2000 });
                }
              })
              .catch(error => {
                this.$toast.error("error:" + error, { duration: 2000 });
              });
            break;
          default:
            break;
        }
      }
    },
    showdialog: function(data, location) {
      this.edititem.type = data; //add edit
      this.edititem.class = location; //main area pool

      switch (location) {
        case "main":
          this.edititem.id = this.sel_main;
          this.edititem.value =
            data == "add"
              ? ""
              : data == "edit"
              ? this.maindata.filter(x => x.id == this.sel_main)[0].name
              : ""; //add 空 del：帶項目值
          break;
        case "area":
          this.edititem.id = this.sel_area;
          this.edititem.value =
            data == "add"
              ? ""
              : data == "edit"
              ? this.areadata.filter(x => x.id == this.sel_area)[0].name
              : ""; //add 空 del：帶項目值
          //英文代稱
          this.edititem.value_en =
            data == "add"
              ? ""
              : data == "edit"
              ? this.areadata.filter(x => x.id == this.sel_area)[0].area_no
              : "";
          break;
        default:
          break;
      }

      this.dialog.main = true;
    },
    showdialog_pool: function(data) {
      //data is add or edit
      this.edititem_pool.type = data;
      this.edititem_pool.parm = {};
      this.edititem_pool.parm.pond_area_id = this.sel_area;
      this.edititem_pool.parm.pond_state_id = 3; //預設狀態=空池，id=3
      if (data == "edit") {
        var pool = this.pooldata.filter(x => x.id == this.sel_pool)[0];
        this.edititem_pool.parm = _.cloneDeep(pool);
        // this.edititem_pool.parm.pond_state_id = 3;
        delete this.edititem_pool.parm.state;//不需要的項目
        delete this.edititem_pool.parm.pond_state_id;//水池狀態不在這修改
        for (const key in this.edititem_pool.parm) {
          var getvalue = this.edititem_pool.parm[key];
          //排除規則不使用regexp的清單
          const outreg = ['name','video_url'];
          this.edititem_pool.parm[key] =(typeof(getvalue)=="number" || outreg.filter(x=>x==key).length > 0)?getvalue: getvalue.match(/^[\d\.]+/)[0];
        }
      }
      this.dialog.pool = true;
    },
    delsubmit: async function(location, value) {
      if (confirm(`是否刪除 ${value}`)) {
        //  location, //main廠、區、水池
        //  value //研發一廠

        let id = "";
        let apiUrl = "";
        switch (location) {
          case "main":
            id = this.sel_main;
            apiUrl = "factory";
            break;
          case "area":
            id = this.sel_area;
            apiUrl = "pond-area";
            break;
          case "pool":
            id = this.sel_pool;
            apiUrl = "pond";
            break;
          default:
            break;
        }
        await this.$axios
          .delete(`https://61.56.172.10/${apiUrl}/${id}`, {
            httpsAgent: agent
          })
          .then(res => {
            console.log("API:" + res.request.responseURL);
            if (res.data == "刪除成功") {
              this.getmain();
              this.sel_main = "";
              this.sel_area = "";

              if (location == "pool") {
                this.sel_pool = "";
                this.getPoolData(); //重取得清單
              }
              this.$toast.success("刪除成功", { duration: 2000 });
            } else {
              this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
            }
          })
          .catch(error => {
            this.$toast.error("error:" + error, { duration: 2000 });
          });
      }
    },
    poolsubmit: async function(data) {
      const user = this.$auth.$state.user.email;
      if (this.$refs.poolform.validate()) {
        if (data == "add") {//新增池
          this.edititem_pool.parm.created_user = user;
          var parm = this.edititem_pool.parm;
          await this.$axios
            .post("https://61.56.172.10/pond/", parm)
            .then(res => {
              console.log("API:" + res.request.responseURL);
              if (res.data == "新增成功") {
                this.getPoolData(); //重取得養殖池資料
                this.dialog.pool = false; //close dialog
                this.$toast.success(`新增成功`, { duration: 2000 });
              } else {
                alert("新增失敗!：" + res.data);
              }
            })
            .catch(error => {
              this.$axios.error("error:" + error, { duration: 2000 });
            });
        } else {//編輯池
               this.edititem_pool.parm.updated_user = user;
               const id = this.edititem_pool.parm.id;
               this.edititem_pool.parm.video_url = (this.edititem_pool.parm.video_url==null)?"":this.edititem_pool.parm.video_url;
               var parm = this.edititem_pool.parm;
               await this.$axios
            .patch(`https://61.56.172.10/pond/${id}`, parm)
            .then(res => {
              console.log("API:" + res.request.responseURL);
              if (res.data == "修改成功") {
                this.getPoolData(); //重取得養殖池資料
                this.dialog.pool = false; //close dialog
                this.$toast.success(`修改成功`, { duration: 2000 });
              } else {
                alert("修改失敗!：" + res.data);
              }
            })
            .catch(error => {
              this.$axios.error("error:" + error, { duration: 2000 });
            });
        }
      }
      console.log(this.edititem_pool.parm);
    }
  },
  computed: {
    areadata: function() {
      let filtermain = [];
      filtermain = this.maindata;

      if (
        //看有沒有選廠
        this.sel_main != undefined &&
        this.sel_main > 0 &&
        this.maindata.length > 0
      ) {
        filtermain = filtermain.filter(main => main.id == this.sel_main);
      }
      let area = [];
      filtermain.forEach(function(x) {
        x.node.forEach(function(y) {
          let yitem = { id: y.id, name: y.name, area_no: y.area_no };
          if (area.indexOf(yitem) == -1) {
            //沒找到
            area.push(yitem);
          }
        });
      });
      return area;
    }
  }
};
</script>

<style scoped></style>
