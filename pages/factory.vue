<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <v-row no-gutters align="center" dense>
          <v-col cols="6"
            ><v-select
              v-model="sel_main"
              :items="maindata"
              item-value="id"
              item-text="name"
              placeholder="選擇場"
              clearable dark
              @change="
                () => {
                  sel_area = undefined;
                  sel_pool = undefined;
                  pooldata = [];
                  // if (sel_main) {
                  // } else {
                  //   sel_area = undefined;
                  //   pooldata = [];
                  // }
                }
              "
              dense
            >
            </v-select
          ></v-col>
          <v-col cols="6">
            <v-btn icon color="success" @click="showdialog('add', 'main')" dark
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn
              icon
              color="success"
              :disabled="!sel_main"
              @click="showdialog('edit', 'main')" dark
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
              " dark
              ><v-icon>mdi-delete</v-icon></v-btn
            >
            <v-btn dark color="info" icon :disabled="!sel_main" @click="showdialog('','ip')"><v-icon>mdi-ip</v-icon></v-btn>
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
              dense dark
              placeholder="選擇區域"
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
              @click="showdialog('add', 'area')" dark
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn
              icon
              color="success"
              :disabled="!sel_area"
              @click="showdialog('edit', 'area')" dark
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
              " dark
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
              dense dark
            ></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-btn
              icon
              :disabled="!sel_area"
              color="success"
              @click="showdialog_pool('add')" dark
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn
              icon
              :disabled="!sel_pool"
              color="success"
              @click="showdialog_pool('edit')" dark
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
              " dark
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-col cols="12"><v-checkbox v-model="sortbyid" dark label="以id排序"></v-checkbox></v-col>
      <v-col
        cols="12"
        sm="3"
        v-for="item in ((sortbyid)?pooldata_sorted:pooldata)"
        :key="item.id"
      >
      <!-- v-for="item in pooldata.filter(
          x => x.id == sel_pool || sel_pool == undefined || sel_pool == ''
        )" -->
        <v-card tile>
          <v-card-subtitle>
            {{ item.name }}
            <v-btn
              icon
              color="success"
              @click="()=>{sel_pool=item.id;showdialog_pool('edit');}" dark
              ><v-icon>mdi-pencil-outline</v-icon></v-btn
            >
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <ol>
              <div
                v-for="it in Object.keys(item).filter(
                  x => !['estimated_num', 'num_per_unit'].includes(x)
                )"
                :key="it"
              >
                <li
                  v-if="
                    itemname.filter(x => x.name == it).length > 0 &&
                      itemname.filter(x => x.name == it)[0].visible == true
                  "
                  style="font-weight:500;"
                >
                  {{ itemname.filter(x => x.name == it)[0].text }}：{{
                    item[it]
                  }}
                </li>
                <li v-if="itemname.filter(x => x.name == it).length == 0">
                  {{ it }}-{{ item[it] }}
                </li>
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
                ? "場"
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
              autocomplete="off" clearable filled dense
            ><span style="width:50px;" slot="prepend">名稱</span></v-text-field>
            <v-text-field
              v-if="edititem.class == 'area'"
              placeholder="請輸入英文代稱(wc、tf、zw...)"
              v-model="edititem.value_en"
              :rules="rules.require"
              autocomplete="off" clearable filled dense
            ><span style="width:100px;" slot="prepend">英文代稱</span></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn tile color="primary" @click="editsubmit">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- 池編輯/新增 -->
    <v-dialog v-model="dialog.pool" width="500px">
      <v-form ref="poolform" v-model="poolvalid" lazy-validation>
        <v-card v-if="sel_area && areadata">
          <v-card-title
            >{{ areadata.filter(x => x.id == sel_area)[0].name }}-養殖池-{{
              edititem_pool.type == "add" ? "新增" : "編輯"
            }}</v-card-title
          >
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <!-- 名稱 -->
              <v-col cols="12">
                <v-text-field
                  autocomplete="off"
                  v-model="edititem_pool.parm.name"
                  :rules="rules.require"
                  clearable
                  filled
                  dense
                >
                  <span style="width:50px;" slot="prepend">名稱</span>
                </v-text-field>
              </v-col>
              <!-- 體積 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.volume"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                >
                  <span style="width:50px;" slot="prepend">體積</span>
                </v-text-field>
              </v-col>
              <!-- 深度 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.depth"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                >
                  <span style="width:50px;" slot="prepend">深度</span>
                </v-text-field>
              </v-col>
              <!-- 池子數 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.num"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  @keypress="(evt)=>{if(evt.key=='.'){ evt.preventDefault();}else{return true;}}"
                  filled
                  dense
                  ><span style="width:50px;" slot="prepend">池子數</span>
                </v-text-field>
              </v-col>
              <!-- 曝氣盤數 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.aeration_tray_num"
                  @keypress="(evt)=>{if(evt.key=='.'){ evt.preventDefault();}else{return true;}}"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                >
                  <span style="width:50px;" slot="prepend">曝氣盤</span>
                </v-text-field>
              </v-col>
              <!-- 最大水位高度 v-model.number=""-->
              <v-col cols="12" sm="6">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.max_water_level"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                >
                  <span style="width:70px;" slot="prepend">最大水位高度</span>
                </v-text-field>
              </v-col>
              <!-- 感測到水底高度 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.sensor_to_pond_bottom"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                >
                  <span style="width:70px;" slot="prepend">感測到水底高度</span>
                </v-text-field>
              </v-col>
              <!-- 底面積 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.bottom_area"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                >
                  <span style="width:70px;" slot="prepend">底面積</span>
                </v-text-field>
              </v-col>
              <!-- 觀察觀飼料百分比 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  autocomplete="off"
                  v-model.number="edititem_pool.parm.observation_feed_pct"
                  :rules="rules.requireNum"
                  type="number"
                  clearable
                  filled
                  dense
                  required
                >
                  <span style="width:70px;" slot="prepend">觀察觀飼料百分比</span>
                  <span style="width:10px;" slot="append">%</span>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
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
              v-model="edititem_pool.parm.video_url"
              clearable
              placeholder="輸入影像IP(例：武曲171)"
            >
              <template slot="prepend"
                ><span style="width:50px;">觀察網影像</span></template
              >
            </v-text-field>
            <!-- v-if="edititem_pool.type == `add`" -->
            <v-select
              v-model="edititem_pool.parm.pond_state_id"
              :items="poolstat"
              :rules="rules.require"
              item-text="name"
              item-value="id"
              :disabled="true"
              ><template slot="prepend"
                ><span style="width:50px;">狀態</span></template
              ></v-select
            >
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn tile color="primary" @click="poolsubmit(edititem_pool.type)"
              >送出</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- 場 ip設定 -->
    <v-dialog v-model="dialog.ip" width="500px">
      <v-form ref="ipform" v-model="ipvalid" lazy-validation>
        <v-card >
          <v-card-title>ip設定</v-card-title>
          <v-card-text>
            <!-- <span>{{ `${this.selected_ip.factory_name}_${this.selected_ip.pond_area_name}` }}</span> -->
            <div>
                  <v-textarea
                    height="400"
                    outlined
                    name="input-7-4"
                    label=""
                    v-model="editedip_content"
                    hide-details
                    placeholder='{"factory_name": "案場名稱-XXXXID001","version": 1.0}'
                  >
                </v-textarea>  
                </div>
          </v-card-text>
          <v-card-actions>
            <v-text-field v-model="ipadminpwd" color="red" outlined hide-details dense clearable><span slot="prepend-inner" class="text--red">管理密碼<v-icon>mdi-key</v-icon></span></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="updateip">更新</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import https from "https";
import _ from "lodash";
import md5 from "md5";
const agent = new https.Agent({
  rejectUnauthorized: false
});

export default {
  layout: "emptynologin",
  middleware: "auth",
  head(){
    return {
      title:"場域設定",
    }
  },
  data() {
    return {
      rules: {
        require: [v => !!v || "*必要項目"],
        requireNum: [
          v => {
            if (!!v || !isNaN(parseFloat(v))) return true;
            return "必要項目";
          }
        ]
      },
      maindata: [],
      sel_main: "",
      sel_area: "",
      sel_pool: "",
      pooldata: [],
      dialog: {
        main: false,
        pool: false,
        ip:false
      },
      edititem: {
        type: "add", //add新增還是del刪除
        class: "", //新增場、區、池
        value: ""
      },
      edititem_pool: {
        type: "add", //add新增還是del刪除
        parm: {}
      },
      poolstat: [],
      ipvalid:true,
      poolvalid: true,
      mainvalid: true,
      itemname: [
        //estimated_num初始投放隻數、num_per_unit放養密度
        { name: "id", text: "id", visible: true },
        { name: "name", text: "名稱", visible: true },
        { name: "volume", text: "體積(頓)", visible: true },
        { name: "depth", text: "深度(m)", visible: true },
        { name: "max_water_level", text: "最大水位高度", visible: true },
        { name: "sensor_to_pond_bottom", text: "感測到水底高度", visible: true },
        { name: "num", text: "小池數(個)", visible: true },
        { name: "aeration_tray_num", text: "曝氣盤數(個)", visible: true },
        { name: "state", text: "狀態", visible: true },
        { name: "video_url", text: "觀察網影像", visible: true },
        { name: "observation_feed_pct", text: "觀察觀飼料百分比", visible: true },
        { name: "bottom_area", text: "底面積", visible: true }
      ],
      sortbyid:false,
      ipdata:[],
      selected_ip:{},
      ipadminpwd:'',
      editedip_content:''
    };
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
    await this.getmain();
    await this.getpoolstat(); //取得池狀態清單
    await this.getipdata();//取得ip設定
  },
  methods: {
    getmain: async function() {
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`, { httpsAgent: agent })
        .then(res => {
          this.maindata = res.data;
          console.log("API:" + res.request.responseURL);
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
        });
    },
    getpoolstat: async function() {
      //取得池狀態清單
      await this.$axios
        .get(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`)
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
          `${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`,
          { params: para },
          { httpsAgent: agent }
        )
        .then(res => {
          console.log("API:" + res.request.responseURL);
          pool = res.data;
        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
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
              .post(`${this.$store.state.mydata.gobal_api.apiUrl}/factory/`, parm, {
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
              .post(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-area/`, parm, {
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
              .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/factory/${id}/`, parm, {
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
              .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-area/${id}/`, parm, {
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
              this.dialog.main = true;
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
          this.dialog.main = true;
          break;
        case "ip":
            //設定資料到畫面上
            var selected_name = this.maindata.filter(x => x.id == this.sel_main)[0].name;
            this.selected_ip = this.ipdata.filter(x=>x.factory_name==selected_name)[0];
            this.ipadminpwd = "";//reset pwd
            this.editedip_content = JSON.stringify(this.selected_ip, null, "\t");
            this.dialog.ip = true;
          default:
          break;
      }

      
    },
    showdialog_pool: function(data) {
      // if (this.$refs.poolform != undefined) {
      //     this.$refs.poolform.reset();
      //   }
      //data is add or edit
      this.edititem_pool.type = data;
      this.edititem_pool.parm = {};
      this.edititem_pool.parm.pond_area_id = this.sel_area;
      this.edititem_pool.parm.pond_state_id = 3; //預設狀態=空池，id=3
      if (data == "add") {
        //重驗證
        
      }
      if (data == "edit") {
        var pool = this.pooldata.filter(x => x.id == this.sel_pool)[0];
        this.edititem_pool.parm = _.cloneDeep(pool);
        var mystatename = this.edititem_pool.parm.state;
        this.edititem_pool.parm.pond_state_id = (mystatename=="")?3:this.poolstat.filter(x=>x.name==mystatename)[0].id;
        // this.edititem_pool.parm.pond_state_id = 3;
        //不需要的項目state狀態、estimated_num初始投放隻數、num_per_unit放養密度
        delete this.edititem_pool.parm.state;
        delete this.edititem_pool.parm.estimated_num;
        delete this.edititem_pool.parm.num_per_unit;
        // delete this.edititem_pool.parm.pond_state_id; //水池狀態不在這修改，但還是要補
        for (const key in this.edititem_pool.parm) {
          var getvalue = this.edititem_pool.parm[key];
          //排除規則不使用regexp的清單
          const outreg = ["name", "video_url"];
          // console.log(key,typeof(getvalue));
          this.edititem_pool.parm[key] =
            typeof getvalue == "number" ||
            outreg.filter(x => x == key).length > 0
              ? getvalue
              : getvalue.match(/^[\d\.]+/) == null
              ? null
              : getvalue.match(/^[\d\.]+/)[0];
        }
      }
      this.dialog.pool = true;
    },
    delsubmit: async function(location, value) {
      if (confirm(`是否刪除 ${value}`)) {
        //  location, //main場、區、水池
        //  value //研發一場

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
          .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/${apiUrl}/${id}`, {
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
        if (data == "add") {
          //新增池
          this.edititem_pool.parm.created_user = user;
          var parm = this.edititem_pool.parm;
          await this.$axios
            .post(`${this.$store.state.mydata.gobal_api.apiUrl}/pond/`, parm)
            .then(res => {
              console.log("API:" + res.request.responseURL);
              if (res.data == "新增成功") {
                this.getPoolData(); //重取得養殖池資料
                this.dialog.pool = false; //close dialog
                this.$toast.success(`新增成功`, { duration: 2000 });
              } else {
                 this.$toast.error(`新增失敗:${res.data}`, { duration: 3000 });

              }
            })
            .catch(error => {
              this.$toast.error("error:" + error, { duration: 2000 });
            });
        } else {
          //編輯池
          this.edititem_pool.parm.updated_user = user;
          const id = this.edititem_pool.parm.id;
          this.edititem_pool.parm.video_url =
            this.edititem_pool.parm.video_url == null
              ? ""
              : this.edititem_pool.parm.video_url;
          var parm = this.edititem_pool.parm;
          await this.$axios
            .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond/${id}/`, parm)
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
              this.$toast.error("error:" + error, { duration: 2000 });
            });
        }
      }else{
              this.$toast.error(`尚有參數未填`, { duration: 2000 });
      }
      console.log(this.edititem_pool.parm);
    },
    getipdata: async function () {
      await this.$axios
        .get(
          `${this.$store.state.mydata.gobal_api.apiUrl}/device-settings/`)
        .then(res => {
          this.ipdata = res.data;
          console.log("API ipdata:" + res.request.responseURL);

        })
        .catch(error => {
          this.$toast.error("error:" + error, { duration: 2000 });
          pool = [];
        })
        .finally(() => {
          /* 不論失敗成功皆會執行 */
        });
    },
    updateip: async function(){
      var input_ipadminpwd = md5(this.ipadminpwd);
      //idwadmin56651588
      if(input_ipadminpwd=='0df860f9cad0c35e96feeb0e3cf3619c'){
        if(confirm('是否確認修改ip設定？')){
          const apiurl = `${this.$store.state.mydata.gobal_api.apiUrl}/device-settings/`;
          var parm = this.editedip_content;
          //新增 找不到之前新增的id
          if(this.selected_ip==undefined){
            await this.$axios
            .post(apiurl,parm)
            .then(res => {
              console.log("API:" + res.request.responseURL);
              if (res.data == "新增成功") {
                this.getipdata();//re get data
                this.dialog.ip = false; //close dialog
                this.$toast.success(`新增成功`, { duration: 2000 });
              } else {
                 this.$toast.error(`新增失敗:${res.data}`, { duration: 3000 });
              }
            })
            .catch(error => {
              this.$toast.error("error:" + error, { duration: 2000 });
            });
            return;
          }
          //修改
          var id = this.selected_ip.id;
          await this.$axios
          .patch(`${apiurl}${id}/`,parm)
          .then(res => {
            if(res.data=='修改成功'){
              this.getipdata();//re get data
              this.dialog.ip = false;
              this.$toast.success('修改成功', { duration: 2000 });
            }else{
              this.$toast.error('修改失敗'+ res.data, { duration: 5000 });
            }
          })
          .catch(error => {
            this.$toast.error('error:'+ error.message, { duration: 2000 });
          });
          

        }else{
          this.$toast.error('取消修改', { duration: 2000 });
        }
      }else{
        this.$toast.error('管理密碼錯誤', { duration: 2000 });
          }
    }
  },
  computed: {
    areadata: function() {
      let filtermain = [];
      filtermain = this.maindata;

      if (
        //看有沒有選場
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
    },
    pooldata_sorted:function(){
     var temp  = _.cloneDeep(this.pooldata); 
     return temp.sort((a1,b1)=>{return (a1.id<b1.id)?-1:1});
    }
  }
};
</script>

<style scoped></style>
