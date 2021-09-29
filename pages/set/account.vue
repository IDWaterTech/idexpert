<template>
  <div>
    <h1>帳號管理</h1>
    <v-row>
      <v-col>
        <!-- <el-button type="primary" icon="el-icon-plus" circle></el-button> -->
        <v-btn
          class="mx-2"
          fab
          dark
          small
          color="primary"
          depressed
          @click="showaddDialog"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" align-self="center">
        <el-table
          :data="accdata"
          style="width: 100%"
          max-height="600"
          row-key="id"
          :expand-row-keys="expands"
          @expand-change="expandSelect"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline>
                <el-form-item
                  >
                  <span>帳號：{{ props.row.username }}</span
                  ><br />
                  <span>姓名：{{ props.row.account_name }}</span
                  ><v-icon
                    @click="showedititemDialog(props.row, 'account_name')"
                    >mdi-square-edit-outline</v-icon
                  ><br />
                  <span>
                    <v-chip
                      class="ma-2"
                      :color="getUnitSet('color', item.department)"
                      label
                      text-color="white"
                      v-for="item in props.row.position"
                      :key="item.id"
                    >
                      <v-icon left>
                        {{getUnitSet('icon', item.department)}}
                      </v-icon>
                      {{ item.department }}-{{ item.name }} </v-chip
                    ><v-icon @click="showpositDialog(props.row)"
                      >mdi-square-edit-outline</v-icon
                    >
                  </span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, key) in accCols.filter(
              x => !accColsHide.includes(x.text)
            )"
            :prop="item.value"
            :label="item.text"
            :key="key"
            align="center"
            :width="item.width"
            v-show="false"
          >
          </el-table-column>
          <el-table-column
            prop="department"
            label="單位"
            width="250"
            align="left"
          >
            <template slot-scope="scope">
              <v-chip
                class="ma-2"
                :color="getUnitSet('color', item)"
                text-color="white"
                v-for="(item, key) in scope.row.department"
                :key="key"
                ><v-avatar left>
                  <v-icon>{{ getUnitSet("icon", item) }}</v-icon> </v-avatar
                >{{ item }}</v-chip
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="position"
            label="職位"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <v-chip
                class="ma-2"
                :color="getUnitSet('color', item.department)"
                text-color="white"
                v-for="(item, key) in scope.row.position"
                :key="key"
                >{{
                  item.department == "艾滴科技股份有限公司"
                    ? ""
                    : item.department + "-"
                }}{{ item.name }}</v-chip
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="is_active"
            label="狀態"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.is_active ? 'success' : 'danger'"
                disable-transitions
                >{{ scope.row.is_active ? "啟用中" : "停用中" }}</el-tag
              >
              <el-switch
                v-model="scope.row.is_active"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="statchange(scope.$index, scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
           <!-- 禁刪使用者所以強制隱藏 -->
          <el-table-column label="操作" v-if="['jianwei.wen@idwater.com.tw','jeff.wang@idwater.com.tw'].includes($auth.$state.user.email.toLowerCase())">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              > -->
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
              <!-- <el-button size="mini" type="warning" @click="() => {}"
                >停用</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
        
        <v-dialog v-model="addDialog" max-width="500px">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card>
              <v-toolbar flat>
                <v-toolbar-title>
                  <span class="text-h5"
                    >新增使用者帳號
                    <v-icon>mdi-account-plus-outline</v-icon></span
                  ></v-toolbar-title
                >
              </v-toolbar>
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col cols="12"
                    ><v-text-field
                      v-model="addform.username"
                      :rules="rules.require"
                      label="帳號"
                      placeholder="xxx@idwater.com.tw"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12"
                    ><v-text-field
                      v-model="addform.account_name"
                      :rules="rules.require"
                      label="使用者名稱"
                      placeholder="王小明"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="6"
                    ><v-text-field
                      v-model="addform.password"
                      :rules="rules.require"
                      label="設定密碼"
                      type="password"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="6"
                    ><v-text-field
                      v-model="addform.password2"
                      :rules="rules.require.concat(rules.eqpwd)"
                      label="確認密碼"
                      type="password"
                    ></v-text-field
                  ></v-col>

                  <v-col cols="12" md="6">
                    帳號預設狀態：
                    <el-tag
                      :type="addform.is_active ? 'success' : 'danger'"
                      disable-transitions
                      >{{ addform.is_active ? "啟用" : "停用" }}</el-tag
                    >
                    <el-switch
                      v-model="addform.is_active"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                    ></el-switch>
                  </v-col>
                  <v-col cols="12">
                    職位
                    <treeselect
                      v-model="addform.position_id"
                      :multiple="true"
                      :options="options"
                      :flat="true"
                      :default-expand-level="1"
                      placeholder="請選擇職位"
                      :disable-branch-nodes="true"
                    >
                      <div slot="value-label" slot-scope="{ node }">
                        {{ node.raw.unit }}-{{ node.raw.label }}
                      </div>
                    </treeselect>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-footer color="white">
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="addsubmit">
                  確認
                </v-btn>
              </v-footer>
            </v-card>
          </v-form>
        </v-dialog>
        <v-dialog v-model="editDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">edit</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                {{ editedData }}
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="editDialog = false">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="editDialog = false">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="edititemDialog" max-width="500px">
          <v-card>
            <v-card-title
              >修改：{{
                edititem.item == "account_name" ? "姓名" : edititem.item
              }}</v-card-title
            >
            <v-card-subtitle>{{ edititem.username }}</v-card-subtitle>
            <v-card-text>
              <v-text-field v-model="edititem.value"> </v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="submitedititem" text color="blue darken-1"
                >確認</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="positDialog" max-width="500px">
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>
                <span class="text-h5"
                  >修改：{{ (edititem.item=="position")?"職位":edititem.item }}
                </span></v-toolbar-title
              >
            </v-toolbar>
            <v-card-text>
              <v-row
                ><v-col cols="12"
                  ><treeselect
                    v-model="edititem.position"
                    :multiple="true"
                    :options="options"
                    :flat="true"
                    :default-expand-level="3"
                    placeholder="請選擇職位"
                    :disable-branch-nodes="true"
                  >
                    <div slot="value-label" slot-scope="{ node }">
                      {{ node.raw.unit }}-{{ node.raw.label }}
                    </div>
                  </treeselect></v-col
                ><v-spacer></v-spacer
              ></v-row>
              <table style="height:300px;"></table>
            </v-card-text>
            <v-divider></v-divider>
            <v-footer color="white">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="submitposit">
                確認
              </v-btn>
            </v-footer>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false
});
export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
    return {
      accdata: [
        {
          id: 1,
          帳號: "admin@1234",
          姓名: "管理者",
          單位: ["技術組", "營運組"],
          職位: [{ 單位: "技術組", 名稱: "組長" }],
          狀態: true
        },
        {
          id: 2,
          帳號: "admin@5678",
          姓名: "管理者",
          單位: ["技術組", "營運組"],
          職位: [{ 單位: "技術組", 名稱: "組長" }],
          狀態: false
        }
      ],
      accCols: [
        { text: "帳號", value: "username", width: 300 },
        { text: "姓名", value: "account_name", width: 150 },
        { text: "單位", value: "department", width: 150 },
        { text: "職位", value: "position", width: 150 },
        { text: "狀態", value: "is_active", width: 150 }
      ],
      addDialog: false,
      valid: true,
      rules: {
        require: [v => !!v || "*必要項目"],
        eqpwd: [v => v == this.addform.password || "*密碼不一致"]
      },
      accColsHide: ["單位", "職位", "狀態"], //隱藏欄位、或需要特殊建立的欄位
      editDialog: false,
      editedData: {}, //編輯中的資料
      expands: [], //Expand only one line into the current line id
      getRowKeys(row) {
        //Set row-key to show only one row
        return row.blog.id;
      },
      addform: {
        username: "",
        email: "",
        password: "",
        password2: "",
        account_name: "",
        created_user: "web",
        is_active: true,
        position_id: []
      },
      //單位顏色、ICON設定
      unit: [
        { name: "default", icon: "mdi-help", color: "lightgrey" },
        { name: "技術部", icon: "mdi-hammer-wrench", color: "primary" },
        { name: "工務組", icon: "mdi-hammer-wrench", color: "#26A69A" },
        { name: "養殖組", icon: "mdi-shaker-outline", color: "orange" },
        { name: "研發部", icon: "mdi-school", color: "success" },
        { name: "包裝組", icon: "mdi-gift", color: "pink" },
        { name: "人資部", icon: "mdi-account-group", color: "#2a4c00" },
        { name: "財務部", icon: "mdi-cash-register", color: "#D4E157" },
        { name: "出納組", icon: "mdi-cash-register", color: "#D4E157" },
        { name: "行銷部", icon: "mdi-home-city-outline", color: "#00ACC1" },
        { name: "營運部", icon: "mdi-cogs", color: "#D4E157" },
        {
          name: "艾滴科技股份有限公司",
          icon: "mdi-account-tie",
          color: "#ff0000"
        }
      ],
      options: [
        {
          id: 0,
          label: "艾滴科技",
          is_leaf: false,
          children: [
            {
              id: 1,
              label: "董事長",
              is_leaf: true
            },
            {
              id: 2,
              label: "技術組",
              is_leaf: false,
              children: [
                {
                  id: 9,
                  label: "組長",
                  unit: "技術組",
                  is_leaf: true
                },
                {
                  id: 10,
                  label: "副組長",
                  is_leaf: true
                },
                {
                  id: 11,
                  label: "組員",
                  is_leaf: true
                }
              ]
            },
            {
              id: 3,
              label: "養殖組",
              is_leaf: false,
              children: [
                {
                  id: 12,
                  label: "組長",
                  is_leaf: true
                },
                {
                  id: 13,
                  label: "副組長",
                  is_leaf: true
                },
                {
                  id: 14,
                  label: "組員",
                  is_leaf: true
                }
              ]
            }
          ]
        }
      ],
      edititemDialog: false,
      edititem: {
        id: "",
        username: "",
        item: "",
        value: "",
        position: []
      },
      editposit: [], //編輯職位選到的內容
      positDialog: false //顯示編輯職位
    };
  },
  methods: {
    getaccList: async function() {
      await this.$axios
        .get("https://61.56.172.10/user-access/account/", { httpsAgent: agent })
        .then(res => {
          this.accdata = res.data;
          console.log("api：" + res.request.responseURL);
        });
    },
    getorg: async function() {
      await this.$axios
        .get("https://61.56.172.10/user-access/organization/", {
          httpsAgent: agent
        })
        .then(res => {
          this.options = res.data;
          console.log("api：" + res.request.responseURL);
        });
    },
    getUnitSet: function(item, unitname) {
      //item項目data單位名稱
      switch (item) {
        case "color":
          var myunit = this.unit.filter(x => x.name == unitname);
          if (myunit.length == 1) {
            return myunit[0].color;
          } else {
            return this.unit.filter(x => x.name == "default")[0].color;
          }
          break;
        case "icon":
          var myunit = this.unit.filter(x => x.name == unitname);
          if (myunit.length == 1) {
            return myunit[0].icon;
          } else {
            return this.unit.filter(x => x.name == "default")[0].icon;
          }
          break;
        default:
          break;
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
      Object.assign(this.editedData, row);
      this.editDialog = true;
    },
    handleDelete:async function(index, row) {
      if (confirm('是否確認刪除？')) {
        await this.$axios
        .delete(
          `https://61.56.172.10/user-access/account/${row.id}/`,
          { httpsAgent: agent }
        )
        .then(res => {
          if (res.data == "刪除成功") {
            this.getaccList(); //改畫面的資料
            this.positDialog = false;
            this.$toast.success("刪除成功", { duration: 2000 });
          } else {
            this.$toast.success("刪除失敗：" + res.data, { duration: 2000 });
          }
          console.log("api：" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
        })
        .finally(() => {});
      }
    },
    statchange(index, row) {
      let parm = {};
      parm["is_active"] = row.is_active;
      const updUser = this.$auth.$state.user.email;
      parm["updated_user"] = updUser;
      this.postedit(row.id,parm);
    },
    expandSelect(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.id); //Expand only the current row id
        }
      } else {
        //Description is put away
        this.expands = [];
      }
      console.log("expand row:", row);
    },
    showaddDialog: function() {
      const updUser = this.$auth.$state.user.email;
      this.addform.username = "";
      this.addform.email = "";
      this.addform.password = "";
      this.addform.password2 = "";
      this.addform.account_name = "";
      this.addform.created_user = updUser;
      this.addform.is_active = true;
      this.addform.position_id = [];
      this.addDialog = true;
    },
    addsubmit: async function() {
      let valid = this.$refs.form.validate();
      if (valid) {
        this.addform.email = this.addform.username;
        console.log("新增參數", this.addform);
        await this.$axios
          .post("https://61.56.172.10/user-access/account/", this.addform, {
            httpsAgent: agent
          })
          .then(res => {
            switch (res.data) {
              case "資料建立有問題":
                alert("新增結果：" + res.data + "(帳號可能已存在)");
                break;
              case "新增成功":
                this.$toast.success("新增結果：" + res.data, {
                  duration: 2000
                });
                this.addDialog = false;
                break;
              default:
                this.$toast.success("新增結果：" + res.data, {
                  duration: 2000
                });
                break;
            }
            console.log("新增api：" + res.request.responseURL);
          })
          .catch(error => {
            this.$toast.success("新增失敗：" + error, { duration: 2000 });
          })
          .finally(() => {
            this.getaccList();
          });
      }
    },
    showedititemDialog: async function(data, item) {
      this.edititem.id = data.id;
      this.edititem.username = data.username;
      this.edititem.item = item;
      this.edititem.value = data[item];
      this.edititem.position = data.position.map(x => {
        return x["id"];
      });
      this.edititemDialog = true;
    },
    submitedititem: async function() {
      let parm = {};
      parm[this.edititem.item] = this.edititem.value;
      const updUser = this.$auth.$state.user.email;
      parm["updated_user"] = updUser;
      console.log(parm);
      await this.$axios
        .patch(
          `https://61.56.172.10/user-access/account/${this.edititem.id}/`,
          parm,
          { httpsAgent: agent }
        )
        .then(res => {
          if (res.data == "修改成功") {
            this.edititemDialog = false;
            this.accdata.filter(
              x => x.id == this.edititem.id
            )[0].account_name = this.edititem.value; //改畫面的資料
            this.$toast.success("修改成功", { duration: 2000 });
          } else {
            this.$toast.success("修改失敗：" + res.data, { duration: 2000 });
          }
          console.log("api：" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
        })
        .finally(() => {});
    },
    showpositDialog: function(data) {
      this.edititem.id = data.id;
      this.edititem.username = data.username;
      this.edititem.item = "position";
      this.edititem.value = data["position"];
      this.edititem.position = data.position.map(x => {
        return x["id"];
      });
      this.positDialog = true;
    },
    submitposit: async function() {
      let parm = {};
      parm["position_id"] = this.edititem.position;
      const updUser = this.$auth.$state.user.email;
      parm["updated_user"] = updUser;
      console.log(parm);
      this.postedit(this.edititem.id,parm);
      // await this.$axios
      //   .patch(
      //     `https://61.56.172.10/user-access/account/${this.edititem.id}/`,
      //     parm,
      //     { httpsAgent: agent }
      //   )
      //   .then(res => {
      //     if (res.data == "修改成功") {
      //       this.getaccList(); //改畫面的資料
      //       this.positDialog = false;
      //       this.$toast.success("修改成功", { duration: 2000 });
      //     } else {
      //       this.$toast.success("修改失敗：" + res.data, { duration: 2000 });
      //     }
      //     console.log("api：" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
      //   })
      //   .finally(() => {});
    },
    postedit:async function(upd_id,parm){
      await this.$axios
        .patch(
          `https://61.56.172.10/user-access/account/${upd_id}/`,
          parm,
          { httpsAgent: agent }
        )
        .then(res => {
          if (res.data == "修改成功") {
            this.getaccList(); //改畫面的資料
            this.positDialog = false;
            this.$toast.success("修改成功", { duration: 2000 });
          } else {
            this.$toast.success("修改失敗：" + res.data, { duration: 2000 });
          }
          console.log("api：" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
        })
        .finally(() => {});
    }
  },
  async created() {
    await this._pageCheck();//驗證頁面是否可檢視
    await this.getaccList();
    await this.getorg();
  }
};
</script>

<style scoped></style>
