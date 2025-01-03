<template>
  <div>
    <v-overlay :value="!isLoading" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card class="bg-card result-card mb-3" style="min-height:86vh">
      <!-- 表頭 -->
      <div class="card-title ma-2 pa-3 border-bottom cursor-pointer">
          <div class="title">
              <v-card-title style="padding: 0;">帳號清單</v-card-title>
          </div>
          <div class="chevron">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                  <button class="btn-icon green" @click="showaddDialog" v-bind="attrs" v-on="on">
                      <v-icon>mdi-plus</v-icon>
                  </button>
              </template>
              <span>新增帳號</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                  <button class="btn-icon" @click="showannDialog" v-bind="attrs" v-on="on">
                      <v-icon>mdi-cellphone-message</v-icon>
                  </button>
              </template>
              <span>發布公告</span>
            </v-tooltip>
          </div>
      </div>
      <!-- 清單 -->
      <div class="content pt-3 full-width">
        <el-table
          :data="accdata"
          class="full-width"
          height="67vh"
          row-key="id"
          :expand-row-keys="expands"
          @expand-change="expandSelect"
          :header-cell-style="tableHeaderStyle"
        >
          <!-- <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline>
                <div class="space-icon" style="width: 48px;"></div>
                <el-form-item style="padding-left: 16px;">
                  <span>帳號：{{ props.row.username }}</span
                  ><br />
                  <span>姓名：{{ props.row.account_name }}</span
                  ><v-icon
                    @click="showedititemDialog(props.row, 'account_name')"
                    >mdi-square-edit-outline</v-icon
                  ><br />
                  <div class="position" style="display: flex;align-items: center;">
                    職位：
                    <span style="display: inline-block;">
                      <div
                        class="ma-2"
                        style="display: inline-block;"
                        v-for="item in props.row.position"
                        :key="item.id"
                      >
                        {{ item.department }}-{{ item.name }} </div
                      >
                      <v-icon @click="showpositDialog(props.row)"
                        >mdi-square-edit-outline</v-icon
                      >
                    </span>
                  </div>
                  <span>
                    <span>所屬場別：</span>
                    <v-chip
                      class="ma-2"
                      label
                      color="teal"
                      text-color="white"
                      v-for="item in props.row.factory_id"
                      :key="item"
                    >
                      {{ maindata.filter(x=>x.id == item).length==1?maindata.filter(x=>x.id == item)[0].name:item}} </v-chip
                    ><v-icon slot="append" @click="showedititemDialog(props.row, 'factory_id')"
                      >mdi-square-edit-outline</v-icon
                    >
                  </span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column> -->
          <el-table-column
            v-for="(item, key) in accCols.filter(
              x => !accColsHide.includes(x.text)
            )"
            :prop="item.value"
            :label="item.text"
            :key="key"
            :width="item.width"
            v-show="false"
          >
          </el-table-column>
          <el-table-column
            prop="department"
            label="單位"
            width="200"
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
            prop="factory_id"
            label="所屬場別"
            width="200"
          >
            <template slot-scope="scope">
              <v-chip
                class="ma-2"
                label
                color="teal"
                text-color="white"
                v-for="item in scope.row.factory_id"
                :key="item"
              >
                {{ maindata.filter(x=>x.id == item).length==1?maindata.filter(x=>x.id == item)[0].name:item}} </v-chip
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="position"
            label="職位"
          >
            <template slot-scope="scope">
              <div
                class="ma-2"
                
                v-for="(item, key) in scope.row.position"
                :key="key"
                >{{
                  item.department == "艾滴科技股份有限公司"
                    ? ""
                    : item.department + "-"
                }}{{ item.name }}</div
              >
              <!-- <v-chip
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
              > -->
            </template>
          </el-table-column>
          <el-table-column
            prop="is_active"
            label="狀態"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.is_active ? 'success' : 'danger'"
                disable-transitions
                >{{ scope.row.is_active ? "啟用中" : "停用中" }}</el-tag
              >
              <!-- <el-switch
                v-model="scope.row.is_active"
                active-color="#13ce66"
                inactive-color="#eee"
                @change="statchange(scope.$index, scope.row)"
              ></el-switch> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="is_active"
            label="允許接收通知"
            align="left"
          >
            <template slot-scope="scope">
              <!-- <v-icon color="#EA4335">mdi-gmail</v-icon> -->
              <span class="d-inline-block" style="width: 36px;">Mail</span>
              <v-tooltip v-if="scope.row.is_sys_enable_email" bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-circle" 
                              v-bind="attrs" v-on="on"
                              style="pointer-events: inherit;">
                          <v-icon>mdi-check-circle</v-icon>
                      </v-btn>
                  </template>
                  <span>允許接收</span>
              </v-tooltip>
              <v-tooltip v-else bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-circle delete" 
                              v-bind="attrs" v-on="on"
                              style="pointer-events: inherit;">
                          <v-icon>mdi-close-circle-outline</v-icon>
                      </v-btn>
                  </template>
                  <span>禁止接收</span>
              </v-tooltip>
              <!-- <v-btn v-if="scope.row.is_sys_enable_email" class="btn-circle"><v-icon>mdi-check-circle</v-icon></v-btn>
              <v-btn v-else  class="btn-circle delete"><v-icon >mid-close-circle</v-icon></v-btn> -->
              <!-- <el-switch
                v-model="scope.row.is_sys_enable_email"
                active-color="#13ce66"
                inactive-color="#eee"
                @change="statchange(scope.$index, scope.row)"
              ></el-switch
              > -->
              <br />
              <!-- <v-icon color="#00B900">mdi-alpha-l-circle-outline</v-icon> -->
              <span class="d-inline-block" style="width: 36px;">Line</span>
              <v-tooltip v-if="scope.row.is_sys_enable_line" bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-circle" 
                              v-bind="attrs" v-on="on"
                              style="pointer-events: inherit;">
                          <v-icon>mdi-check-circle</v-icon>
                      </v-btn>
                  </template>
                  <span>允許接收</span>
              </v-tooltip>
              <v-tooltip v-else bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-circle delete" 
                              v-bind="attrs" v-on="on"
                              style="pointer-events: inherit;">
                          <v-icon>mdi-close-circle-outline</v-icon>
                      </v-btn>
                  </template>
                  <span>禁止接收</span>
              </v-tooltip>
              <!-- <v-btn v-if="scope.row.is_sys_enable_line" class="btn-circle"><v-icon>mdi-check-circle</v-icon></v-btn>
              <v-btn v-else  class="btn-circle delete"><v-icon >mid-close-circle</v-icon></v-btn> -->
              <!-- <el-switch
                v-model="scope.row.is_sys_enable_line"
                active-color="#13ce66"
                inactive-color="#eee"
                @change="statchange(scope.$index, scope.row)"
              ></el-switch> -->
              <br />
              <!-- <v-icon color="#009688">mdi-database-edit-outline</v-icon> -->
              <span class="d-inline-block" style="width: 36px;">KB</span>
              <v-tooltip v-if="scope.row.is_sys_enable_line_kb" bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-circle" 
                              v-bind="attrs" v-on="on"
                              style="pointer-events: inherit;">
                          <v-icon>mdi-check-circle</v-icon>
                      </v-btn>
                  </template>
                  <span>允許接收</span>
              </v-tooltip>
              <v-tooltip v-else bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-circle delete" 
                              v-bind="attrs" v-on="on"
                              style="pointer-events: inherit;">
                          <v-icon>mdi-close-circle-outline</v-icon>
                      </v-btn>
                  </template>
                  <span>禁止接收</span>
              </v-tooltip>
              <!-- <v-btn v-if="scope.is_sys_enable_line_kb" class="btn-circle"><v-icon>mdi-check-circle</v-icon></v-btn>
              <v-btn v-else  class="btn-circle delete"><v-icon >mid-close-circle</v-icon></v-btn> -->
              <!-- <el-switch
                v-model="scope.row.is_sys_enable_line_kb"
                active-color="#13ce66"
                inactive-color="#eee"
                @change="statchange(scope.$index, scope.row)"
              ></el-switch> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="line_notify"
            label="個人通知允許"
            align="left"
          >
            <template slot-scope="scope">
              <!-- <v-icon color="#EA4335">mdi-gmail</v-icon> -->
              <span class="d-inline-block" style="width: 36px;">Line</span>
              <v-tooltip v-if="scope.row.line_notify" bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-circle" 
                              v-bind="attrs" v-on="on"
                              style="pointer-events: inherit;">
                          <v-icon>mdi-check-circle</v-icon>
                      </v-btn>
                  </template>
                  <span>允許接收</span>
              </v-tooltip>
              <v-tooltip v-else bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-circle delete" 
                              v-bind="attrs" v-on="on"
                              style="pointer-events: inherit;">
                          <v-icon>mdi-close-circle-outline</v-icon>
                      </v-btn>
                  </template>
                  <span>禁止接收</span>
              </v-tooltip>
            </template>
          </el-table-column>
          <!-- 禁刪使用者所以強制隱藏 -->
          <!-- <el-table-column
            label="操作"
            v-if="
              [
                'jianwei.wen@idwater.com.tw',
                'jeff.wang@idwater.com.tw'
              ].includes($auth.$state.user.email.toLowerCase())
            "
          > -->
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-icon"
                              title="編輯" 
                              v-bind="attrs" v-on="on"
                              style="pointer-events: inherit;"
                              @click="handleEdit(scope.$index, scope.row)">
                          <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                  </template>
                  <span>編輯</span>
              </v-tooltip>
              <v-tooltip v-if="
                  [
                    'jianwei.wen@idwater.com.tw',
                    'jeff.wang@idwater.com.tw'
                  ].includes($auth.$state.user.email.toLowerCase())
                " bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn  class="btn-icon delete"
                              title="刪除" 
                              v-bind="attrs" v-on="on"
                              style="pointer-events: inherit;"
                              @click="handleDelete(scope.$index, scope.row)">
                          <v-icon>mdi-trash-can</v-icon>
                      </v-btn>
                  </template>
                  <span>刪除</span>
              </v-tooltip>
              <!-- <el-button
                  v-if="
                  [
                    'jianwei.wen@idwater.com.tw',
                    'jeff.wang@idwater.com.tw'
                  ].includes($auth.$state.user.email.toLowerCase())
                "
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              > -->
              <!-- <el-button size="mini" type="warning" @click="() => {}"
                >停用</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </v-card>
    <!-- 發布公告 -->
    <v-dialog v-model="annDialog" max-width="500px">
      <v-form ref="annform" v-model="annvalid" lazy-validation>
        <v-card class="custom-dialog">
          <v-card-title class="add-title">
            <div class="d-inline-block">
              發佈公告
            </div>
            <div class="add">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="annDialog = false">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="card-title">
              <div class="title">
                  <v-card-title>＊模擬畫面＊</v-card-title>
              </div>
              <!-- <div class="chevron" >
                <v-icon v-if="addChooseOpen">mdi-triangle-small-up</v-icon>
                <v-icon v-if="!addChooseOpen">mdi-triangle-small-down</v-icon>
              </div> -->
            </div>
            <div class="basic pl-2">
              <v-card-text class="flex-align-center pt-0" style="padding-top: 0;">
                <v-alert
                  type="success"
                  dense
                  icon="mdi-bell-outline"
                  class="multi-line"
                  >【IDWaterExpert】 
                  公告者：{{
                    $auth.$state.user.name.replace(
                      $auth.$state.user.family_name,
                      ""
                    )
                  }}
                  內容：{{ (annmsg!= undefined && annmsg.length>0)?annmsg:'...' }}
                </v-alert>
              </v-card-text>
            </div>
          </v-card-text>
          <v-card-text>
            <!-- <div class="card-title">
              <div class="title">
                  <v-card-title>公告內容</v-card-title>
              </div>
            </div> -->
            <div class="basic" style="padding-left: 8px;">
              <v-card-text class="flex-align-center pt-0">
                <v-textarea v-model="annmsg" filled clearable placeholder="請輸入內容..."> </v-textarea>
              </v-card-text>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="annDialog = false">取消</v-btn>
            <v-btn class="btn-primary" :loading="annsubmitbtn" @click="annsubmit" :class="{'disabled':annmsg== undefined || annmsg.length<=0}">發佈</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- 新增帳號 -->
    <v-dialog v-model="addDialog" max-width="500px">
      <v-overlay :value="!dialogLoading" :absolute="true">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card class="custom-dialog">
          <v-card-title class="add-title">
            <div class="d-inline-block">
              新增使用者帳號
            </div>
            <div class="add">
              <v-btn  class="btn-secondary close"
                      title="取消" 
                      @click="addDialog = false">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <!-- <div class="card-title">
              <div class="title">
                  <v-card-title>＊模擬畫面＊</v-card-title>
              </div>
              
            </div> -->
            <div class="basic" style="padding-left: 8px;">
              <v-card-text class="d-flex flex-column pt-0">
                <v-text-field
                  v-model="addform.username"
                  :rules="rules.require"
                  label="帳號"
                  placeholder="xxx@idwater.com.tw"
                ></v-text-field>
                <v-text-field
                  v-model="addform.account_name"
                  :rules="rules.require"
                  label="使用者名稱"
                  placeholder="王小明"
                ></v-text-field>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0">
                <v-text-field
                  v-model="addform.password"
                  :rules="rules.require"
                  label="設定密碼"
                  type="password"
                ></v-text-field>
                <v-text-field
                  v-model="addform.password2"
                  :rules="rules.require.concat(rules.eqpwd)"
                  label="確認密碼"
                  type="password"
                ></v-text-field>
              </v-card-text>
              <v-card-text class="flex-align-center pt-0">
                帳號預設狀態：
                <div class="input-group ml-2">
                  <el-tag
                    :type="addform.is_active ? 'success' : 'info'"
                    disable-transitions
                    >{{ addform.is_active ? "啟用" : "停用" }}</el-tag
                  >
                  <el-switch
                    v-model="addform.is_active"
                    active-color="#13ce66"
                    inactive-color="#eee"
                  ></el-switch>
                </div>
                
              </v-card-text>
              <v-card-text class="flex-align-center pt-0">
                允許接收通知：
                <div class="input-group flex-align-center">
                  <!-- <v-icon color="#EA4335">mdi-gmail</v-icon>Mail -->
                  Mail<el-switch
                    v-model="addform.is_sys_enable_email"
                    active-color="#13ce66"
                    inactive-color="#eee"
                    class="my-4 mr-4 ml-2"
                  ></el-switch>
                  <!-- <v-icon color="#00B900">mdi-alpha-l-circle-outline</v-icon>Line -->
                  Line<el-switch
                    v-model="addform.is_sys_enable_line"
                    active-color="#13ce66"
                    inactive-color="#eee"
                    class="my-4 mr-4 ml-2"
                  ></el-switch>
                  <!-- <v-icon color="#009688">mdi-database-edit-outline</v-icon>KB -->
                  KB<el-switch
                    v-model="addform.is_sys_enable_line_kb"
                    active-color="#13ce66"
                    inactive-color="#eee"
                    class="my-4 mr-4 ml-2"
                  ></el-switch>
                </div>
              </v-card-text>
              <v-card-text class="d-flex flex-column pt-0 full-width">
                <v-select
                  :items="maindata"
                  item-text="name"
                  item-value="id"
                  v-model="addform.factory_id"
                  multiple
                  chips
                  placeholder="所屬場別"
                  class="mutiselect full-width"
                ></v-select>
                <treeselect
                  v-model="addform.position_id"
                  :multiple="true"
                  :options="options"
                  :flat="true"
                  :default-expand-level="1"
                  placeholder="請選擇職位"
                  :disable-branch-nodes="true"
                  class="select-template full-width"
                  :rules="rules.length"
                  :class="{error:isDataidError}" 
                >
                  <div slot="value-label" slot-scope="{ node }">
                    {{ node.raw.unit }}-{{ node.raw.label }}
                  </div>
                </treeselect>
              </v-card-text>
            </div>
            
          </v-card-text>
          <v-card-actions >
            <v-spacer></v-spacer>
            <v-btn class="btn-secondary" @click="addDialog = false">取消</v-btn>
            <v-btn class="btn-primary" @click="addsubmit">確認</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- 修改 -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-overlay :value="!dialogLoading" :absolute="true">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card  class="custom-dialog">
        <v-card-title class="add-title">
          <div class="d-inline-block">
            修改
          </div>
          <div class="add">
            <v-btn  class="btn-secondary close"
                    title="取消" 
                    @click="editDialog = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="basic pl-2">
            <v-card-text>
              <v-card-subtitle class="pl-0">{{ editedData.username }}</v-card-subtitle>
              <v-text-field :rules="rules.require"
                  label="使用者名稱" v-model="editedData.account_name"> </v-text-field>
              <v-autocomplete
                v-model="editedData.factory_id"
                filled
                clearable
                multiple
                :items="maindata"
                item-text="name"
                item-value="id"
                dense
                deletable-chips
                chips
                style="width:600px;"
                class="mutiselect mt-2"
                label="所屬場別"
                ></v-autocomplete>
              <treeselect
                v-model="editedData.position"
                :multiple="true"
                :options="options"
                :flat="true"
                :default-expand-level="3"
                placeholder="請選擇職位"
                label="職位"
                :disable-branch-nodes="true"
                class="select-template"
                :rules="rules.length"
                :class="{error:isDataidError}"
              >
                <div slot="value-label" slot-scope="{ node }">
                  {{ node.raw.unit }}-{{ node.raw.label }}
                </div>
              </treeselect>
            </v-card-text>
            <v-card-text class="flex-align-center pt-0">
              帳號狀態：
              <div class="input-group ml-2" style="margin-left: 8px;">
                <el-tag
                  :type="editedData.is_active ? 'success' : 'info'"
                  disable-transitions
                  >{{ editedData.is_active ? "啟用" : "停用" }}</el-tag
                >
                <el-switch
                  v-model="editedData.is_active"
                  active-color="#13ce66"
                  inactive-color="#eee"
                  @change="changeState()"
                ></el-switch>
              </div>
              
            </v-card-text>
            <v-card-text class="flex-align-center pt-0">
                允許接收通知：
                <div class="input-group flex-align-center">
                  <!-- <v-icon color="#EA4335">mdi-gmail</v-icon>Mail -->
                  Mail<el-switch
                    v-model="editedData.is_sys_enable_email"
                    active-color="#13ce66"
                    inactive-color="#eee"
                    class="my-4 mr-4 ml-2"
                    @change="changeState()"
                  ></el-switch>
                  <!-- <v-icon color="#00B900">mdi-alpha-l-circle-outline</v-icon>Line -->
                  Line<el-switch
                    v-model="editedData.is_sys_enable_line"
                    active-color="#13ce66"
                    inactive-color="#eee"
                    class="my-4 mr-4 ml-2"
                    @change="changeState()"
                  ></el-switch>
                  <!-- <v-icon color="#009688">mdi-database-edit-outline</v-icon>KB -->
                  KB<el-switch
                    v-model="editedData.is_sys_enable_line_kb"
                    active-color="#13ce66"
                    inactive-color="#eee"
                    class="my-4 mr-4 ml-2"
                    @change="changeState()"
                  ></el-switch>
                </div>
              </v-card-text>
          </div>
        </v-card-text>
        <v-card-actions style="padding-bottom: 24px;">
          <v-spacer></v-spacer>
          <v-btn class="btn-secondary" @click="editDialog = false">取消</v-btn>
          <v-btn @click="submitEdit" class="btn-primary" tile
            >修改</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false
});
export default {
  layout: "emptynologin2",
  middleware: "auth",
  head(){
    return {
      title:'帳號管理'
    }
  },
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
        { text: "姓名", value: "account_name", width: 150},
        { text: "單位", value: "department", width: 150 },
        { text: "職位", value: "position", width: 150 },
        { text: "狀態", value: "is_active", width: 150},
        { text: "所屬場別", value: "factory_id", width: 150 }
      ],
      addDialog: false,
      valid: true,
      rules: {
        require: [v => !!v || "*必要項目"],
        eqpwd: [v => v == this.addform.password || "*密碼不一致"]
      },
      accColsHide: ["單位", "職位", "狀態","所屬場別"], //隱藏欄位、或需要特殊建立的欄位
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
        is_sys_enable_email: false,
        is_sys_enable_line: false,
        is_sys_enable_line_kb: false,
        position_id: [],
        factory_id: [],
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
      positDialog: false, //顯示編輯職位
      maindata: [],
      sel_main: [],
      annDialog: false, //公告
      annsubmitbtn:false,//發送鈕loading用
      annvalid: true,
      annmsg: "",
      isLoading: false,
      isDataidError: false,
      dialogLoading: true,
    };
  },
  methods: {
    getaccList: async function() {
      this.isLoading = false;
      let getuserData = await this.getUserList();
      this.accdata = typeof (getuserData)=='string'?[]:getuserData;
      this.accdata.forEach(async (acc,cid)=>{
        await this.getUser(acc.username,cid);
      })
      this.isLoading = true;
      console.log('acc',this.accdata);
      // await this.$axios
      //   .get(
      //     `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/`,
      //     { httpsAgent: agent }
      //   )
      //   .then(res => {
      //     this.accdata = res.data;
      //     this.accdata.forEach(async (acc,cid)=>{
      //       await this.getUser(acc.username,cid);
      //     })
      //     console.log('acc',this.accdata);
      //     console.log("accList api：" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.$toast.error("accList api ERR：" + error, { duration: 2000 });
      //   });
    },
    getorg: async function() {
      let getOrganizationList = await this.getOrganizationList();
      let data = typeof (getOrganizationList)=='string'?[]:getOrganizationList;
      this.options = data;
      // await this.$axios
      //   .get(
      //     `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/organization/`,
      //     {
      //       httpsAgent: agent
      //     }
      //   )
      //   .then(res => {
      //     this.options = res.data;
      //     console.log("api：" + res.request.responseURL);
      //   });
    },
    getmainData: async function() {
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`, {
      //     httpsAgent: agent
      //   })
      //   .then(res => {
      //     this.maindata = res.data;
      //     // this.sel_main = 1;
      //   });
      this.isLoading = false;
      let architectureData = await this.getArchitecture();
      this.maindata = typeof (architectureData)=='string'?[]:architectureData;
      this.isLoading = true;
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
      // this.editedData.value = row.account_name;
      this.editedData.position = row.position.map(x => {
        return x["position_id"];
      });
      this.isDataidError = false;
      this.editDialog = true;
    },
    changeState() {
      console.log('change state',this.editedData);
      let data = _.cloneDeep(this.editedData);
      this.editedData = {};
      this.editedData = _.cloneDeep(data);
    },
    async submitEdit() {
      const updUser = this.$auth.$state.user.email;
      this.editedData["updated_user"] = updUser;
      let parm = _.cloneDeep(this.editedData);
      parm.position_id = _.cloneDeep(parm.position);
      delete parm.position;
      delete parm.department;
      delete parm.highest_position_id;
      delete parm.id;
      console.log(parm);
      this.isDataidError = true;
      if(parm.position_id.length>0) {
        this.dialogLoading = false;
        this.isDataidError = false;
        var res = await this.patchUserList(parm,this.editedData.id);
        setTimeout(async ()=>{
          if(res) {
            console.log('accdata',this.accdata);
            await this.getaccList();
            this.editDialog = false;
          }
          this.dialogLoading = true;
        },50)
      }
      
      
      // await this.$axios
      //   .patch(
      //     `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/${this.editedData.id}/`,
      //     parm,
      //     { httpsAgent: agent }
      //   )
      //   .then(async res => {
      //     if (res.data == "修改成功") {
      //       this.editDialog = false;
      //       console.log('accdata',this.accdata);
      //       await this.getaccList();
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
    handleDelete: async function(index, row) {
      if (confirm("是否確認刪除？")) {
        var res = this.deleteUserList(row.id);
        if(res) {
          this.getaccList(); //改畫面的資料
          this.positDialog = false;
        }
        // await this.$axios
        //   .delete(
        //     `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/${row.id}/`,
        //     {
        //       httpsAgent: agent
        //     }
        //   )
        //   .then(res => {
        //     if (res.data == "刪除成功") {
        //       this.getaccList(); //改畫面的資料
        //       this.positDialog = false;
        //       this.$toast.success("刪除成功", { duration: 2000 });
        //     } else {
        //       this.$toast.success("刪除失敗：" + res.data, { duration: 2000 });
        //     }
        //     console.log("api：" + res.request.responseURL);
        //   })
        //   .catch(error => {
        //     this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
        //   })
        //   .finally(() => {});
      }
    },
    statchange(index, row) {
      let parm = {};
      parm["is_active"] = row.is_active;
      parm["is_sys_enable_email"] = row.is_sys_enable_email;
      parm["is_sys_enable_line"] = row.is_sys_enable_line;
      parm["is_sys_enable_line_kb"] = row.is_sys_enable_line_kb;
      const updUser = this.$auth.$state.user.email;
      parm["updated_user"] = updUser;
      this.postedit(row.id, parm);
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
    showannDialog: function() {
      this.annmsg = "";
      this.annDialog = true;
    },
    annsubmit: async function() {
      this.annsubmitbtn = true;
      var pcontent = `\n公告者：${this.$auth.$state.user.name.replace(
        this.$auth.$state.user.family_name,
        ""
      )}\n內容：${this.annmsg}`;
      if(this.annmsg.length<=0){
       this.$toast.success(`未填入訊息`, {duration: 2000});
        return;
      }
      const updUser = this.$auth.$state.user.email;
      var parm = {
        sender:updUser,
        content:pcontent
      }
      let postLineNotifyList = await this.postLineNotifyList();
      switch (postLineNotifyList) {
        case "發送結束":
          this.annDialog = false;
          break;
        default:
          break;
      }
      this.annsubmitbtn = false;
      // await this.$axios
      //     .post(
      //       `${this.$store.state.mydata.gobal_api.apiUrl}/line-notify/`,
      //       parm
      //     )
      //     .then(res => {
      //       this.$toast.success(`發送結果：${(res.data=='發送結束')?'成功':res.data}`, {
      //             duration: 2000
      //           });
      //       switch (res.data) {
      //         case "發送結束":
      //           this.annDialog = false;
      //           break;
      //         default:
      //           break;
      //       }
      //       console.log("發送api：" + res.request.responseURL);
      //     })
      //     .catch(error => {
      //       this.$toast.success("發送失敗：" + error, { duration: 2000 });
      //     })
      //     .finally(() => {
      //       this.annsubmitbtn = false;
      //     });
    },
    showaddDialog: function() {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
        this.addform.position_id = [];
        this.isDataidError = false;
      }

      const updUser = this.$auth.$state.user.email;
      // this.addform.username = "";
      // this.addform.email = "";
      // this.addform.password = "";
      // this.addform.password2 = "";
      // this.addform.account_name = "";
      this.addform.created_user = updUser;
      // this.addform.is_active = true;
      // this.addform.is_sys_enable_email=false;
      // this.addform.is_sys_enable_line=false;
      // this.addform.position_id = [];
      this.addDialog = true;
    },

    addsubmit: async function() {
      let valid = this.$refs.form.validate();
      this.isDataidError = true;
      if(this.addform.position_id.length>0) {
        this.isDataidError = false;
      }
      if (valid&&!this.isDataidError) {
        this.dialogLoading = false;
        this.addform.email = this.addform.username;
        console.log("新增參數", this.addform);
        var res = await this.postUserList(this.addform);
        if(res) {
          
          this.addDialog = false;
          this.getaccList();
        }
        this.dialogLoading = true;
        // await this.$axios
        //   .post(
        //     `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/`,
        //     this.addform,
        //     {
        //       httpsAgent: agent
        //     }
        //   )
        //   .then(res => {
        //     switch (res.data) {
        //       case "資料建立有問題":
        //         alert("新增結果：" + res.data + "(帳號可能已存在)");
        //         break;
        //       case "新增成功":
        //         this.$toast.success("新增結果：" + res.data, {
        //           duration: 2000
        //         });
        //         this.addDialog = false;
        //         break;
        //       default:
        //         this.$toast.success("新增結果：" + res.data, {
        //           duration: 2000
        //         });
        //         break;
        //     }
        //     console.log("新增api：" + res.request.responseURL);
        //   })
        //   .catch(error => {
        //     this.$toast.success("新增失敗：" + error, { duration: 2000 });
        //   })
        //   .finally(() => {
        //     this.getaccList();
        //   });
      }
    },
    showedititemDialog: async function(data, item) {
      this.edititem.id = data.id;
      this.edititem.username = data.username;
      this.edititem.item = item;
      this.edititem.value = data[item];
      // this.edititem.position = data.position.map(x => {
      //   return x["id"];
      // });
      this.edititemDialog = true;
      console.log('field',this.edititem,this.options);
    },
    // submitedititem: async function() {
    //   let parm = {};
    //   parm[this.edititem.item] = this.edititem.value;//項目=值
    //   const updUser = this.$auth.$state.user.email;
    //   parm["updated_user"] = updUser;
    //   console.log(parm);
    //   await this.$axios
    //     .patch(
    //       `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/${this.edititem.id}/`,
    //       parm,
    //       { httpsAgent: agent }
    //     )
    //     .then(res => {
    //       if (res.data == "修改成功") {
    //         this.edititemDialog = false;
    //         this.accdata.filter(
    //           x => x.id == this.edititem.id
    //         )[0][this.edititem.item] = this.edititem.value; //改畫面的資料
    //         this.$toast.success("修改成功", { duration: 2000 });
    //       } else {
    //         this.$toast.success("修改失敗：" + res.data, { duration: 2000 });
    //       }
    //       console.log("api：" + res.request.responseURL);
    //     })
    //     .catch(error => {
    //       this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
    //     })
    //     .finally(() => {});
    // },
    showpositDialog: function(data) {
      //編輯單位
      this.edititem.id = data.id;
      this.edititem.username = data.username;
      this.edititem.item = "position";
      this.edititem.value = data["position"];
      this.edititem.position = data.position.map(x => {
        return x["position_id"];
      });
      this.positDialog = true;
    },
    submitposit: async function() {
      let parm = {};
      parm["position_id"] = this.edititem.position;
      const updUser = this.$auth.$state.user.email;
      parm["updated_user"] = updUser;
      console.log(parm);
      this.postedit(this.edititem.id, parm);
      // await this.$axios
      //   .patch(
      //     `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/${this.edititem.id}/`,
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
    // postedit: async function(upd_id, parm) {
    //   console.log("修改參數：", parm);
    //   await this.$axios
    //     .patch(
    //       `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/${upd_id}/`,
    //       parm,
    //       {
    //         httpsAgent: agent
    //       }
    //     )
    //     .then(res => {
    //       if (res.data == "修改成功") {
    //         this.getaccList(); //改畫面的資料
    //         this.positDialog = false;
    //         this.$toast.success("修改成功", { duration: 2000 });
    //       } else {
    //         this.$toast.success("修改失敗：" + res.data, { duration: 2000 });
    //       }
    //       console.log("api：" + res.request.responseURL);
    //     })
    //     .catch(error => {
    //       this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
    //     })
    //     .finally(() => {});
    // },
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      let bgcolor = $nuxt.$vuetify.theme.themes.light.cardtitle;
      return `font-weight:500;`;
      // if (rowIndex == 0) {
      //   return `background-color:${bgcolor};color:#fff;font-weight:500;`;
      //   return `font-weight:500;`;
      // }else{
      //   return `background-color:${bgcolor};`;
      // }
    },
    getUser: async function(account,id) {
      let accheader = { account: account };
      let getPersinalSettingList = await this.getPersinalSettingList(accheader);
      let data = typeof (getPersinalSettingList)=='string'?false:getPersinalSettingList;
      this.accdata[id].line_notify = data;
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/personal-settings/`, {
      //     headers: accheader
      //   })
      //   .then(res => {
      //     if (res.data != "帳號資料不存在") {
      //       // console.log('getUser',res.data);
      //       this.accdata[id].line_notify = res.data.is_personal_enable_line
            
      //       // this.$toast.success(`成功:${res.data}`, { duration: 2000 });
      //     } else {
      //       return false;
      //       // this.$toast.error(`失敗:${res.data}`, { duration: 2000 });
      //     }
      //   })
      //   .catch(error => {
      //     this.$toast.error(`失敗:${error.message}`, { duration: 2000 });
      //   })
      //   .finally(() => {
      //     //this.getdata();
      //   });
    },
  },
  async created() {
    this.isLoading = false;
    await this._pageCheck(); //驗證頁面是否可檢視
    await this.getaccList();
    await this.getorg();
    await this.getmainData(); //get 場資料
  }
};
</script>

<style lang="scss" scoped>
.multi-line {
  white-space: pre-line;
  width: 100%;
}

.v-card.result-card {
  &.bg-card {
    background-color: #fff;
  }
  .card-title {
    .title {
      width: 100%;
    }
    .chevron {
      @include flexAlignCenter();
    }
  }
}

::v-deep {
  .v-dialog .v-sheet.v-card.custom-dialog .v-textarea.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
    border: 1px solid $color-black-10;
    border-radius: 4px;
    padding: 0 8px;
  }
  .v-dialog .v-sheet.v-card.custom-dialog .v-textarea.theme--light.v-text-field > .v-input__control > .v-input__slot:before,
  .v-dialog .v-sheet.v-card.custom-dialog .v-textarea.theme--light.v-text-field > .v-input__control > .v-input__slot:before, 
  .v-dialog .v-sheet.v-card.custom-dialog .v-textarea.theme--light.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before {
    border-color: transparent;
  }
  .v-dialog.v-dialog--active {
    overflow-y: initial;
  }
  .v-input {
    margin-top: 0;
  }
  .select-template.vue-treeselect {
    .vue-treeselect__multi-value-label {
      line-height: 0;
    }
  }
  .mutiselect .v-chip .v-chip__content {
    font-size: 12px;
    .mdi-close-circle::before {
      color: white;
    }
  }
  .v-dialog .v-sheet.v-card.custom-dialog .v-text-field .v-chip .theme--light.v-icon {
      color: #fff;
  }
  .v-dialog .v-select.v-text-field--enclosed:not(.v-text-field--single-line):not(.v-text-field--outlined) .v-select__selections {
      padding-top: 0;
  }
  .select-template .vue-treeselect__control .vue-treeselect__placeholder::before,
  .select-template .vue-treeselect__control .vue-treeselect__placeholder::after {
    content:'';
  }
  .v-btn.btn-circle {
    @include size(24px);
    min-width: 24px;
    background-color: transparent;
    box-shadow: none;
    .theme--light.v-icon {
      color: $color-green !important;
    }
    &.delete {
      .theme--light.v-icon {
        color: $color-accent !important;
      }
    }
  }
}
</style>
