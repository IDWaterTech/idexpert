<template>
  <div>
    <h1>授權管理(開發中)</h1>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text>
            <v-btn tile color="primary" @click="showadd">+ 新增角色</v-btn>
            <!-- 新增角色 -->
            <v-dialog v-model="adddialog" max-width="500px">
              <v-form ref="addform" v-model="valid" lazy-validation>
                <v-card>
                  <v-card-title>新增角色</v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="addform.name"
                      :rules="rules.require"
                      label="角色名稱"
                      placeholder="管理員"
                      autocompleted="false"
                    ></v-text-field>
                    <v-text-field
                      v-model="addform.desc"
                      :rules="rules.require"
                      label="角色描述"
                      placeholder="全部的功能都有"
                      autocompleted="false"
                    ></v-text-field>
                    <el-switch
                      v-model="addform.is_active"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="啟用"
                    ></el-switch
                    ><br />
                    職位
                    <treeselect
                      v-model="addform.position_id"
                      :multiple="true"
                      :options="positdata"
                      :flat="true"
                      :default-expand-level="2"
                      placeholder="已授權的職位"
                      :disable-branch-nodes="true"
                    >
                      <div slot="value-label" slot-scope="{ node }">{{ node.raw.unit }}-{{ node.raw.label }}</div>
                    </treeselect>
                    <!-- {{positdata.filter(x=>x.is_leaf==false)}} -->

                    單位
                    <treeselect
                      v-model="addform.department_id"
                      :multiple="true"
                      :options="depdata"
                      :flat="true"
                      :default-expand-level="1"
                      placeholder="被授權的單位"
                      :disable-branch-nodes="false"
                    >
                    </treeselect>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="addsubmit">新增</v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
            <!-- 編輯角色 -->
            <v-dialog v-model="editdialog" max-width="500px">
              <v-form ref="editform" v-model="editvalid" lazy-validation>
                <v-card>
                  <v-card-title>編輯角色</v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="editform.name"
                      :rules="rules.require"
                      label="角色名稱"
                      placeholder="管理員"
                      autocompleted="false"
                    ></v-text-field>
                    <v-text-field
                      v-model="editform.desc"
                      :rules="rules.require"
                      label="角色描述"
                      placeholder="全部的功能都有"
                      autocompleted="false"
                    ></v-text-field>
                    <el-switch
                      v-model="editform.is_active"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="啟用"
                    ></el-switch
                    ><br />
                    職位
                    <treeselect
                      v-model="editform.position_id"
                      :multiple="true"
                      :options="positdata"
                      :flat="true"
                      :default-expand-level="2"
                      placeholder="已授權的職位"
                      :disable-branch-nodes="true"
                    >
                      <div slot="value-label" slot-scope="{ node }">{{ node.raw.unit }}-{{ node.raw.label }}</div>
                    </treeselect>
                    單位
                    <treeselect
                      v-model="editform.department_id"
                      :multiple="true"
                      :options="depdata"
                      :flat="true"
                      :default-expand-level="1"
                      placeholder="被授權的單位"
                      :disable-branch-nodes="false"
                    >
                    </treeselect>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="editsubmit">確認修改</v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
            <el-table :data="roledata" class="mt-3">
              <el-table-column label="ID" prop="id" fixed width="50px">
              </el-table-column>
              <!-- <el-table-column label="角色名稱" prop="name"> </el-table-column> -->
              <el-table-column label="角色名稱" align="center">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>角色狀態: {{ (scope.row.is_active)?"啟用中":"停用" }}</p>
                    <div slot="reference" class="name-wrapper">
                      <v-btn outlined  style="cursor:default;" :color="(scope.row.is_active)?'success':'error'">{{ scope.row.name }}</v-btn>
                      <!-- <el-tag size="medium" color="warning">{{ scope.row.name }}</el-tag> -->
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="描述" prop="desc"> </el-table-column>
              <el-table-column label="已授權的" align="center">
                <el-table-column prop="department" label="單位" align="center">
                  <template slot-scope="scope">
                    <v-chip
                      class="ma-2"
                      :color="'primary'"
                      text-color="white"
                      v-for="(item, key) in scope.row.department"
                      :key="key"
                      >{{ item.name }}</v-chip
                    >
                  </template>
                </el-table-column>
                <el-table-column prop="position" label="職位" align="center">
                  <template slot-scope="scope">
                    <v-chip
                      class="ma-2"
                      :color="'primary'"
                      text-color="white"
                      v-for="(item, key) in scope.row.position"
                      :key="key"
                      >{{ item.name }}</v-chip
                    >
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                  <template slot-scope="scope">
                    <v-btn text color="primary" @click="showedit(scope.row)"
                      >編輯</v-btn
                    >
                    <v-btn text color="error" @click="showdel(scope.row)"
                      >刪除</v-btn
                    >
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css"; //element ui css
import _ from "lodash";
import dayjs from "dayjs";
export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
    return {
      roledata: [
        {
          id: "12987122",
          name: "測試用角色1",
          desc: "側欄全開",
          is_active: true,
          department: [],
          position: []
        }
      ],
      positdata: [], //職位
      adddialog: false,
      editdialog: false,
      addform: {
        name: "",
        desc: "",
        started_date: this.getNowDate(),
        ended_date: this.getNowDate(),
        is_active: true,
        position_id: [],
        department_id: [],
        created_user: this.$auth.$state.user.email
      },
      editform: {},
      valid: true,
      editvalid: true,
      rules: {
        require: [v => !!v || "*必要項目"]
      }
    };
  },
  methods: {
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    getRoles: async function() {
      await this.$axios
        .get("https://61.56.172.10/user-access/role/")
        .then(res => {
          this.roledata = res.data;
          console.log("api：" + res.request.responseURL);
          console.log(this.roledata);
        });
    },
    showadd: function() {
      this.addform.position_id=[];
      this.addform.department_id=[];
      this.adddialog = true;
    },
    showedit: function(data) {
      console.log(data);

      this.editform = {
        id: data.id,
        name: data.name,
        desc: data.desc,
        // started_date: this.getNowDate(),
        // ended_date: this.getNowDate(),
        is_active: data.is_active,
        position_id: data.position.map(item => {
          return item.id;
        }),
        department_id: data.department.map(item => {
          return item.id;
        }),
        updated_user: this.$auth.$state.user.email
      };

      this.editdialog = true;
    },
    showdel: async function(data) {
      const str = `是否刪除? ${data.name}`;

      if (confirm(str)) {
        const url = `https://61.56.172.10/user-access/role/${data.id}`;
        await this.$axios
          .delete(url)
          .then(res => {
            if (res.data == "刪除成功") {
              this.getRoles(); //更新畫面
              this.$toast.success(`刪除成功`, { duration: 2000 });
            } else {
              alert("刪除失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("刪除失敗!：" + error.message);
          });
      }
    },
    getorg: async function() {
      await this.$axios
        .get("https://61.56.172.10/user-access/organization/")
        .then(res => {
          this.positdata = res.data;
          console.log("api：" + res.request.responseURL);
        });
    },
    addsubmit: async function() {
      let valid = this.$refs.addform.validate();
      if (valid) {
        console.log(this.addform);
        const url = "https://61.56.172.10/user-access/role/";
        let parms = this.addform;
        await this.$axios
          .post(url, parms)
          .then(res => {
            if (res.data == "新增成功") {
              this.adddialog = false;
              this.getRoles(); //更新畫面
              this.$toast.success(`新增成功`, { duration: 2000 });
            } else {
              alert("新增失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("新增失敗!：" + error.message);
          })
          .finally(() => {
            //this.getdata();
          });
      }
    },
    editsubmit: async function() {
      let valid = this.$refs.editform.validate();
      let parms = _.cloneDeep(this.editform);
      delete parms.id; //"刪掉id欄位"

      if (valid) {
        const url = `https://61.56.172.10/user-access/role/${this.editform.id}/`;
        await this.$axios
          .patch(url, parms)
          .then(res => {
            if (res.data == "修改成功") {
              this.editdialog = false;
              this.getRoles(); //更新畫面
              this.$toast.success(`修改成功`, { duration: 2000 });
            } else {
              alert("修改失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("修改失敗!：" + error.message);
          })
          .finally(() => {});
      }
    }
  },
  computed: {
    depdata: function() {
      return JSON.parse(
        JSON.stringify(this.positdata).replaceAll("is_leaf", "isDisabled")
      );
    }
  },
  mounted() {
    this.getRoles();
  },
  async created() {
    await this.getorg();
  }
};
</script>

<style scoped></style>
