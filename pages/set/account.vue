<template>
  <div>
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
          max-height="500"
          row-key="id"
          :expand-row-keys="expands"
          @expand-change="expandSelect"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline>
                <el-form-item label="expand">
                  <span>{{ props.row }}</span>
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
          <el-table-column prop="單位" label="單位" width="250" align="left">
            <template slot-scope="scope">
              <v-chip
                class="ma-2"
                :color="getUnitSet('color', item)"
                text-color="white"
                v-for="(item, key) in scope.row.單位"
                :key="key"
                ><v-avatar left>
                  <v-icon>{{ getUnitSet("icon", item) }}</v-icon> </v-avatar
                >{{ item }}</v-chip
              >
            </template>
          </el-table-column>
          <el-table-column prop="職位" label="職位" width="150" align="center">
            <template slot-scope="scope">
              <v-chip
                class="ma-2"
                :color="getUnitSet('color', item.單位)"
                text-color="white"
                v-for="(item, key) in scope.row.職位"
                :key="key"
                >{{ item.單位 }}-{{ item.名稱 }}</v-chip
              >
            </template>
          </el-table-column>
          <el-table-column prop="狀態" label="狀態" width="150" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.狀態 ? 'success' : 'danger'"
                disable-transitions
                >{{ scope.row.狀態 ? "啟用中" : "停用中" }}</el-tag
              >
              <el-switch
                v-model="scope.row.狀態"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="statchange(scope.$index, scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
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
              <!-- <v-card-title>
                <span class="text-h5"
                  >新增使用者帳號
                  <v-icon>mdi-account-plus-outline</v-icon></span
                >
              </v-card-title> -->
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
                      :default-expand-level="3"
                      placeholder="請選擇職位"
                      :disable-branch-nodes="true"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-footer color="white">
                <v-spacer></v-spacer>
                <!-- <v-btn color="blue darken-1" text @click="editDialog = false">
                Cancel
              </v-btn> -->
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
      </v-col>
    </v-row>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import https from "https";
export default {
  layout: "emptynologin",
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
        { text: "帳號", value: "帳號", width: 150 },
        { text: "姓名", value: "姓名", width: 150 },
        { text: "單位", value: "單位", width: 150 },
        { text: "職位", value: "職位", width: 150 },
        { text: "狀態", value: "狀態", width: 150 }
      ],
      addDialog: false,
      valid: true,
      rules: {
        require: [v => !!v || "*必要項目"],
        eqpwd: [v => v == this.addform.password || "*密碼不一致"]
      },
      accColsHide: ["狀態", "單位", "職位"], //隱藏欄位、或需要特殊建立的欄位
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
        position_id:[]
      },
      //單位顏色、ICON設定
      unit: [
        { name: "default", icon: "mdi-help", color: "lightgrey" },
        { name: "技術組", icon: "mdi-hammer-wrench", color: "primary" },
        { name: "養殖組", icon: "mdi-shaker-outline", color: "orange" }
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
    };
  },
  methods: {
    getaccList: async function() {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      await this.$axios
        .get("https://61.56.172.10/user-access/account/", { httpsAgent: agent })
        .then(res => {
          this.accdata = res.data;
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
    handleDelete(index, row) {
      console.log(index, row);
    },
    statchange(index, row) {
      console.log(index, row.狀態);
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
      this.addform.username = "";
      this.addform.email = "";
      this.addform.password = "";
      this.addform.password2 = "";
      this.addform.account_name = "";
      this.addform.created_user = "web";
      this.addform.is_active = true;
      this.addDialog = true;
    },
    addsubmit: async function() {
      let valid = this.$refs.form.validate();
      if (valid) {
        const agent = new https.Agent({
          rejectUnauthorized: false
        });
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
                alert("新增結果：" + res.data);
                this.addDialog = false;
                break;
              default:
                alert("新增結果：" + res.data);
                break;
            }
            console.log("新增api：" + res.request.responseURL);
          })
          .finally(() => {
            this.getaccList();
          });
      }
    }
  },
  async created() {
    await this.getaccList();
  }
};
</script>

<style scoped></style>
