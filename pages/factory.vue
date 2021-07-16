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
            <v-btn icon :disabled="!sel_area" color="success"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn
              icon
              :disabled="!sel_pool"
              color="error"
              @click="delsubmit('pool', pooldata[sel_pool - 1].name)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="primary">池基本參數設定</v-btn>
      </v-col>
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
            <ul>
              <li v-for="it in Object.keys(item)" :key="it">
                {{ it }}:{{ item[it] }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog.main" width="500px">
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
            autocomplete="off"
          ></v-text-field>
          <v-text-field
            v-if="edititem.class == 'area'"
            placeholder="請輸入英文代稱(wc、tf、zw...)"
            v-model="edititem.value_en"
            autocomplete="off"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="editsubmit">送出</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false
});

export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
    return {
      maindata: [],
      sel_main: "",
      sel_area: "",
      sel_pool: "",
      pooldata: [],
      dialog: {
        main: false
      },
      edititem: {
        type: "add", //add新增還是del刪除
        class: "", //新增廠、區、池
        value: ""
      }
    };
  },
  async created() {
    await this.getmain();
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
                  this.sel_area="";
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
            this.edititem.value_en = (data == "add")?"": (data == "edit")? this.areadata.filter(x => x.id == this.sel_area)[0].area_no:"";
          break;
        default:
          break;
      }

      this.dialog.main = true;
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
              this.sel_pool = "";
              this.$toast.success("刪除成功", { duration: 2000 });
            } else {
              this.$toast.error("刪除失敗:" + res.data, { duration: 2000 });
            }
          })
          .catch(error => {
            this.$toast.error("error:" + error, { duration: 2000 });
          });
      }
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
          let yitem = { id: y.id, name: y.name,area_no:y.area_no };
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
