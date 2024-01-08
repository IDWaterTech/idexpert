<template>
  <div>
    <v-card class="bg-card result-card" style="margin-bottom: 12px;min-height:86vh">
      <!-- 表頭 -->
      <div class="card-title" style="cursor: pointer;margin: 0 8px;padding: 12px;">
        <div class="title">
              <v-card-title style="padding: 0;font-size: 1.1rem;">角色清單</v-card-title>
          </div>
          <div class="chevron">
            <v-btn class="btn-secondary green" @click="showadd" style="padding: 0 8px;"><v-icon>mdi-plus</v-icon> 新增角色</v-btn>
            <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                  <button class="btn-secondary green" @click="showadd" v-bind="attrs" v-on="on" style="padding: 4px 8px;display: flex;align-items: center;">
                      <v-icon>mdi-plus</v-icon> 新增角色
                  </button>
              </template>
              <span>新增角色</span>
            </v-tooltip> -->
          </div>
      </div>
      <!-- 清單 -->
      <div class="content" style="width: 100%;">
        <!-- 表格 -->
        <el-table
          :data="roledata"
          class="mt-3"
          row-key="id"
          :expand-row-keys="expands"
          @expand-change="expandSelect"
        >
          <el-table-column type="expand" fixed width="30px">
            <template slot-scope="props">
              <v-row>
                <v-col cols="11" style="padding:0 16px">
                  <div style="min-height:250px;margin-left: 48px;">
                    <div v-show="false">{{ props.row.privilege }}</div>
                    <!-- {{props.row.privilege.map(item => {return item.id;})}} -->
                    <span>授權項目</span>
                    <treeselect
                      :multiple="true"
                      :clearable="true"
                      :searchable="false"
                      :flat="true"
                      :open-on-click="true"
                      :clear-on-select="true"
                      :close-on-select="true"
                      :always-open="true"
                      :openDirection="'bottom'"
                      :options="privdatadisable"
                      :sort-value-by="'INDEX'"
                      :default-expand-level="2"
                      :max-height="200"
                      placeholder="無授權項目"
                      zIndex="0"
                      v-model="expandtree"
                      :value-consists-of="'ALL_WITH_INDETERMINATE'"
                      style="margin-top: 8px;"
                    >
                      <div slot="value-label" slot-scope="{ node }">{{ node.raw.name }}</div>
                      <div slot="option-label" slot-scope="{ node }">{{ node.raw.name }}</div>
                    </treeselect>
                  </div>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
            </template>
          </el-table-column>
          <!-- <el-table-column label="ID" prop="id" fixed width="50px">
          </el-table-column> -->
          <!-- <el-table-column label="角色名稱" prop="name"> </el-table-column> -->
          <el-table-column label="角色名稱" width="200px">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>
                  角色狀態: {{ scope.row.is_active ? "啟用中" : "停用" }}
                </p>
                <div slot="reference" class="name-wrapper">
                  <v-btn
                    outlined
                    style="cursor:default;border: none;"
                    :color="scope.row.is_active ? 'success' : 'error'"
                    >{{ scope.row.name }}</v-btn
                  >
                  <!-- <el-tag size="medium" color="warning">{{ scope.row.name }}</el-tag> -->
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="desc"> </el-table-column>
          <!-- <el-table-column label="已授權的" align="center"> -->
            <el-table-column prop="department" label="授權單位">
              <template slot-scope="scope">
                <v-chip
                  class="ma-2"
                  color="#408FBC"
                  text-color="white"
                  v-for="(item, key) in scope.row.department"
                  :key="key"
                  style="font-size: 13px;"
                  >{{ item.name }}</v-chip
                >
              </template>
            </el-table-column>
            <el-table-column prop="position" label="授權職位">
              <template slot-scope="scope">
                <v-chip
                  class="ma-2"
                  color="#408FBC"
                  text-color="white"
                  v-for="(item, key) in scope.row.position"
                  :key="key"
                  style="font-size: 13px;"
                  >{{ item.name }}</v-chip
                >
              </template>
            </el-table-column>
          <!-- </el-table-column> -->
          <el-table-column
            fixed="right"
            label="操作"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn  class="btn-icon"
                          @click="showedit(scope.row)"
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
                        @click="showdel(scope.row)"
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
    <!-- 新增角色 -->
    <v-dialog v-model="adddialog" max-width="500px">
      <v-form ref="addform" v-model="valid" lazy-validation>
        <v-card class="custom-dialog">
          <v-card-title class="add-title" style="display: block;width: 100%;">
            <div style="display: inline-block;">
              新增角色
            </div>
            <div class="add" style="float: right;display: inline-block;">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="adddialog = false" 
                      style="border: none;min-width: 0;padding: 0 4px;">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          
          <v-card-text>
            <div class="basic" style="padding-left: 8px;">
              <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                <v-text-field
                  v-model="addform.name"
                  :rules="rules.require"
                  label="角色名稱"
                  placeholder="管理員"
                  autocompleted="false"
                ></v-text-field>
                </v-card-text>
                <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                  <v-text-field
                    v-model="addform.desc"
                    :rules="rules.require"
                    label="角色描述"
                    placeholder="全部的功能都有"
                    autocompleted="false"
                    style="margin-top: 0;padding-top: 0;"
                  ></v-text-field>
                </v-card-text>
                <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                  職位
                  <treeselect
                    v-model="addform.position_id"
                    :multiple="true"
                    :options="positdata"
                    :flat="true"
                    :default-expand-level="2"
                    placeholder="已授權的職位"
                    :sort-value-by="'INDEX'"
                    :disable-branch-nodes="true"
                    class="select-template"
                  >
                    <div slot="value-label" slot-scope="{ node }">
                      {{ node.raw.unit }}-{{ node.raw.label }}
                    </div>
                  </treeselect>
                </v-card-text>
                <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                  單位
                  <treeselect
                    v-model="addform.department_id"
                    :multiple="true"
                    :options="depdata"
                    :flat="true"
                    :default-expand-level="1"
                    placeholder="被授權的單位"
                    :sort-value-by="'INDEX'"
                    :disable-branch-nodes="false"
                    class="select-template"
                  >
                  </treeselect>
                </v-card-text>
                <!-- {{positdata.filter(x=>x.is_leaf==false)}} -->
                <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                  授權
                  <treeselect
                    :flat="true"
                    v-model="addform.privilege_id"
                    :multiple="true"
                    :options="privdata"
                    :default-expand-level="1"
                    placeholder="被授權的項目"
                    :sort-value-by="'INDEX'"
                    :value-consists-of="'ALL_WITH_INDETERMINATE'"
                    :disable-branch-nodes="false"
                    class="select-template"
                    :limit="3"
                    :limitText="() => `+ ${addform.privilege_id.length-3}`"
                  >
                    <div slot="value-label" slot-scope="{ node }">{{ node.raw.name }}</div>
                    <div slot="option-label" slot-scope="{ node }">{{ node.raw.name }}</div>
                  </treeselect>
                </v-card-text>
                <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                  <el-switch
                    v-model="addform.is_active"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="角色授權是否啟用"
                  ></el-switch
                  >
                </v-card-text>
            </div> 
          </v-card-text>
          <v-card-actions style="padding: 24px 12px;">
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="adddialog = false">取消</v-btn>
            <v-btn class="btn-primary" @click="addsubmit">新增</v-btn>
          </v-card-actions>
          
        </v-card>
      </v-form>
    </v-dialog>
    <!-- 編輯角色 -->
    <v-dialog v-model="editdialog" max-width="500px">
      <v-form ref="editform" v-model="editvalid" lazy-validation>
        <v-card  class="custom-dialog">
          <v-card-title class="add-title" style="display: block;width: 100%;">
            <div style="display: inline-block;">
              編輯角色
            </div>
            <div class="add" style="float: right;display: inline-block;">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="editdialog = false" 
                      style="border: none;min-width: 0;padding: 0 4px;">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          
          <v-card-text>
            <div class="basic" style="padding-left: 8px;">
              <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                <v-text-field
                    v-model="editform.name"
                    :rules="rules.require"
                    label="角色名稱"
                    placeholder="管理員"
                    autocompleted="false"
                  ></v-text-field>
              </v-card-text>
              <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                <v-text-field
                    v-model="editform.desc"
                    :rules="rules.require"
                    label="角色描述"
                    placeholder="全部的功能都有"
                    autocompleted="false"
                    style="margin-top: 0;padding-top: 0;"
                  ></v-text-field>
              </v-card-text>  
              
              <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                職位
                <treeselect
                  v-model="editform.position_id"
                  :multiple="true"
                  :options="positdata"
                  :flat="true"
                  :default-expand-level="2"
                  placeholder="已授權的職位"
                  :sort-value-by="'INDEX'"
                  :disable-branch-nodes="true"
                  class="select-template"
                ><div slot="value-label" slot-scope="{ node }">{{ node.raw.unit }}-{{ node.raw.label }}</div>
                </treeselect>
              </v-card-text>
              <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                單位
                  <treeselect
                  v-model="editform.department_id"
                  :multiple="true"
                  :options="depdata"
                  :flat="true"
                  :default-expand-level="1"
                  placeholder="被授權的單位"
                  :sort-value-by="'INDEX'"
                  :disable-branch-nodes="false"
                  class="select-template"
                >
                </treeselect>
              </v-card-text>  
              <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                授權項目
                <treeselect
                  :flat="true"
                  v-model="editform.privilege_id"
                  :multiple="true"
                  :options="privdata"
                  :default-expand-level="1"
                  placeholder="被授權的項目"
                  :sort-value-by="'INDEX'"
                  :value-consists-of="'ALL_WITH_INDETERMINATE'"
                  :disable-branch-nodes="false"
                  class="select-template"
                  :limit="3"
                  :limitText="() => `+ ${editform.privilege_id.length-3}`"
                >
                  <div slot="value-label" slot-scope="{ node }">{{ node.raw.name }}</div>
                  <div slot="option-label" slot-scope="{ node }">{{ node.raw.name }}</div>
                </treeselect>
              </v-card-text>    
              <v-card-text style="display: flex;flex-direction:column;padding-top: 0;">
                <el-switch
                    v-model="editform.is_active"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="角色授權是否啟用"
                  ></el-switch
                  >
              </v-card-text>  
                
            </div>
            
          </v-card-text>
          <v-card-actions style="padding: 24px 12px;">
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="editdialog = false">取消</v-btn>
            <v-btn class="btn-primary" @click="editsubmit">修改</v-btn>
          </v-card-actions>
          
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css"; //element ui css
import _ from "lodash";
import dayjs from "dayjs";
export default {
  layout: "emptynologin2",
  middleware: "auth",
  data() {
    return {
      value: [ 'c', 'aaa', 'bb' ],
      // options: generateOptions(3),
      sortValueBy: 'ORDER_SELECTED',
      roledata: [
        // {
        //   id: "12987122",
        //   name: "測試用角色1",
        //   desc: "側欄全開",
        //   is_active: true,
        //   department: [],
        //   position: []
        // }
      ],
      expands: [],
      expandtree: [],
      positdata: [], //職位
      privdata: [], //授權
      privdatadisable: [],
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
  head(){
    return {
      title:"授權管理",
    }
  },
  methods: {
    expandSelect(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expandtree = row.privilege.map(item => {
            return item.id;
          });
          this.expands.push(row.id); //Expand only the current row id
        }
      } else {
        //Description is put away
        this.expands = [];
      }
      console.log("expand row:", row);
    },
    getNowDate: function() {
      let mydate = dayjs().format("YYYY-MM-DD");
      return mydate;
    },
    getRoles: async function() {
      //角色的清單
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/role/`)
        .then(res => {
          this.roledata = res.data;
          console.log("api：" + res.request.responseURL);
          console.log(this.roledata);
        });
    },
    setNestedDisabled: function(obj) {
      //全部都設成disabled
      obj.forEach(itm => {
        // console.log(itm.name);//所有node(含leaf)的名稱
        itm.isDisabled = true;
        if (itm.hasOwnProperty("children")) {
          this.setNestedDisabled(itm.children);
        }
      });
      return obj;
    },
    getPrivilege: async function() {
      let data;
      //授權項目的清單
      try {
        data = await this.getMenuAuthorization(true);
        console.log("authorization-items api：" + data.request.responseURL);
      }catch {
        this.$toast.error("錯誤：" + error, { duration: 2000 });
      }
      if(data) {
        this.privdata = data.data;
        if(this.privdata&&this.privdata.length>0) {
          this.privdatadisable = this.setNestedDisabled(
            _.cloneDeep(this.privdata)
          );
        }
      }
      
      
      console.log('menu data',this.privdata)
      // let accheader = { account: this.$auth.$state.user.email };
      // const url = `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/authorization-menu/?is_all=true`;
      // await this.$axios
      //   .get(url, {
      //     headers: accheader
      //   })
      //   .then(res => {
      //     this.privdata = res.data;
      //     this.privdatadisable = this.setNestedDisabled(
      //       _.cloneDeep(this.privdata)
      //     );
      //     console.log("api：" + res.request.responseURL);
      //   });
    },
    showadd: function() {
      this.addform.position_id = [];
      this.addform.department_id = [];
      if (this.$refs.addform != undefined) {
        this.$refs.addform.reset();
      }
      this.adddialog = true;
    },
    showedit: function(data) {
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
        privilege_id: data.privilege.map(item => {
          return item.id;
        }),
        updated_user: this.$auth.$state.user.email
      };

      this.editdialog = true;
    },
    showdel: async function(data) {
      const str = `是否刪除? ${data.name}`;

      if (confirm(str)) {
        const url = `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/role/${data.id}`;
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
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/organization/`)
        .then(res => {
          this.positdata = res.data;
          console.log("api：" + res.request.responseURL);
        });
    },
    addsubmit: async function() {
      let valid = this.$refs.addform.validate();
      if (valid) {
        console.log(this.addform);
        debugger;
        const url = `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/role/`;
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
      console.log(parms);
      if (valid) {
        const url = `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/role/${this.editform.id}/`;
        await this.$axios
          .patch(url, parms)
          .then(res => {
            if (res.data == "修改成功") {
              this.editdialog = false;
              this.getRoles(); //更新畫面
              this.$toast.success(`修改成功`, { duration: 2000 });
              this.expandtree = this.editform.privilege_id;
            } else {
              alert("修改失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("修改失敗!：" + error.message);
          })
          .finally(() => {});
        //  this.expands = [];//展開close
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
    this.getRoles(); //所有角色的清單
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    await this.getorg(); //單位與職位清單
    await this.getPrivilege(); //授權項目清單
  }
};
</script>

<style lang="scss" scoped>
.v-card.result-card {
  &.bg-card {
    background-color: #fff;
  }
  .card-title {
    border-bottom: 1px solid rgba(0,0,0,0.1);
    .title {
      width: 100%;
      font-size: 1rem;
    }
    .chevron {
      display: flex;
      align-items: center;
    }
  }
}
::v-deep {
  .select-template.vue-treeselect .vue-treeselect__multi-value-label,
  .select-template.vue-treeselect .vue-treeselect__multi-value-label div {
    line-height: 0;
  }
  .select-template .vue-treeselect__control .vue-treeselect__placeholder::before,
  .select-template .vue-treeselect__control .vue-treeselect__placeholder::after {
    content: '';
  }
}
/* .el-table__expanded-cell {
    padding: 2px 5px !important;
} */
</style>
