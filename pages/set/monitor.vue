<template>
  <div  id="top">
    <h1>監測設定</h1>
    <v-chip class="mx-2" v-for="(item, index) in cols" :key="index" @click="$vuetify.goTo(`#${item}`, {duration:1500,offset:2,easing:'easeInOutCubic'})">#{{getgroupname(item)}}</v-chip>
    <v-row>
      <v-col cols="12" sm="12" v-for="(item, index) in cols" :key="index" :id="item">
        <v-card>
          <v-card-title
            >{{ getgroupname(item) }}
            <v-icon @click="$vuetify.goTo(`#top`, {duration:500,offset:2,easing:'easeInOutCubic'})">mdi-format-vertical-align-top</v-icon>
            <v-spacer></v-spacer>
            <v-btn icon @click="addShow(item)"
              ><v-icon>mdi-plus</v-icon></v-btn
            ></v-card-title
          >

          <v-divider></v-divider>
          <v-card-text>
            <!-- <ul>
              <li v-for="(item2, idx) in Object.keys(allcols[item])" :key="idx">
                項目：{{ item2 }}=>{{ allcols[item][item2] }}
              </li>
            </ul> -->
            <v-data-table
              :items="allcols.filter(x => x.group == item)"
              :headers="headers"
              :footer-props="footerProps"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editShow(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small class="mr-2" @click="delsubmit(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">編輯項目-{{ editedItem.group }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="editedItem.name_en"
                  label="項目英文"
                  disabled
                  autocomplate="off"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="editedItem.name_ch"
                  label="項目中文"
                  autocomplate="off"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="editedItem.unit"
                  label="單位"
                  autocomplate="off"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  label="下限"
                  :value="editedItem.min"
                  type="number"
                  step="1"
                  min="0"
                  max="999"
                  @input="edit_mincheck"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                ~
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="editedItem.max"
                  label="上限"
                  autocomplate="off"
                  type="number"
                  step="1"
                  min="0"
                  max="999"
                  @input="edit_maxcheck"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editDialog = false">
            取消
          </v-btn>
          <v-btn color="blue darken-1" text @click="editsubmit">
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addDialog" max-width="500px">
      <v-form ref="addform" v-model="valid" lazy-validation>
        <v-card>
          <v-card-title>
            <span class="text-h5">新增項目-{{ this.addItem.class }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="addItem.name_en"
                    label="項目(英文)"
                    autocomplate="off"
                    :rules="rules.require"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="addItem.name_ch"
                    label="項目(中文)"
                    autocomplate="off"
                    :rules="rules.require"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="addItem.unit"
                    label="單位(ppm、°c...)"
                    :rules="rules.require"
                    autocomplate="off"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="addItem.lmtmin"
                    label="下限"
                    autocomplate="off"
                    type="number"
                    step="1"
                    min="0"
                    max="999"
                    @input="add_lmtmincheck"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  ~
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="addItem.lmtmax"
                    label="上限"
                    autocomplate="off"
                    type="number"
                    step="1"
                    min="0"
                    max="999"
                    @input="add_lmtmaxcheck"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="addsubmit">
              確定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
      headers: [
        {
          text: "項目英文",
          align: "center",
          sortable: false,
          value: "name_en"
        },
        {
          text: "項目中文",
          align: "center",
          sortable: false,
          value: "name_ch"
        },

        {
          text: "單位",
          align: "center",
          sortable: false,
          value: "unit"
        },
        {
          text: "最小值",
          align: "center",
          sortable: false,
          value: "min"
        },
        {
          text: "最大值",
          align: "center",
          sortable: false,
          value: "max"
        },
        { text: "Actions", value: "actions", sortable: false }
      ],
      footerProps: {
        "items-per-page-text": "每頁",
        "items-per-page-options": [25, 50, 75, 100]
      },
      groupmap:[
        {item:"water",value:"水質監測"},{item:"env",value:"環境監測"},
        {item:"feed",value:"投餵飼料"},{item:"obs",value:"飼料觀察網"},
        {item:"adv",value:"進階值"},{item:"pbio",value:"投餵益生菌"}
      ],
      allcols: [
        {
          group: "water",
          name_ch: "亞硝酸鹽清洗電壓",
          name_en: "亞硝酸鹽清洗電壓",
          unit: "V",
          min: null,
          max: null
        },
        {
          group: "water",
          name_ch: "亞硝酸鹽測試電壓",
          name_en: "亞硝酸鹽測試電壓",
          unit: "V",
          min: null,
          max: null
        }
      ],
      editDialog: false,
      editedItem: {
        class: "",
        item: "",
        value: "",
        min: 0,
        max: 999
      },
      addDialog: false,
      addItem: {
        class: "",
        item: "",
        value: "",
        lmtmin: 0,
        lmtmax: 999
      },
      //form
      valid: true,
      rules: { require: [v => !!v || "*必要項目"] }
    };
  },
  async created() {
    await this.getListData();
  },
  computed: {
    newitem: function(val) {
      let myobj = [];
      let colclass = Object.keys(this.allcols); //[water,feed]
      //item value class:water item:排汙耗時,value:排汙耗時(s)
      for (let i = 0; i < colclass.length; i++) {
        myobj[colclass[i]] = [];
        let cols = Object.keys(this.allcols[colclass[i]]); //["排汙耗時", "進水量"]
        let vals = Object.values(this.allcols[colclass[i]]); //["排汙耗時(s)", "進水量.."]
        for (let j = 0; j < cols.length; j++) {
          let item = { class: colclass[i], item: cols[j], value: vals[j] };
          myobj.push(item);
        }
      }
      return myobj;
    },
    cols: function() {
      let col = [];
      this.allcols.forEach(item => {
        if (!col.includes(item.group)) {
          col.push(item.group);
        }
      });
      return col; //["water", "feed", "env", "obs", "adv", "pbio"]
    }
  },
  methods: {
    getListData: async function() {
      await this.$axios
        .get("https://61.56.172.10/col-data/", {
          httpsAgent: agent
        })
        .then(res => {
          this.allcols = Object.assign([], res.data);
        });
    },
    editShow: function(data) {
      // data
      // group: "water"
      // lmtmax: 999
      // lmtmin: 0
      // max: null
      // min: null
      // name_ch: "亞硝酸鹽清洗電壓"
      // name_en: "亞硝酸鹽清洗電壓"
      // unit: "V"
      data.min = (data.min==null)?0:data.min;
      data.max = (data.max==null)?999:data.max;
      this.editedItem = Object.assign({}, data);
      // console.log(this.editedItem);
      this.editDialog = true;
    },
    editsubmit:async function() {
      const updUser = this.$auth.$state.user.email;
      let parm = {
          name_ch:this.editedItem.name_ch,
          unit:this.editedItem.unit,
          max:this.editedItem.max,
          min:this.editedItem.min,
          data_group:this.editedItem.group,
          updated_user:updUser
        };
         console.log(parm);
        await this.$axios
          .patch(
            `https://61.56.172.10/col-data/${this.editedItem.id}/`,
            parm,
            {
              httpsAgent: agent
            }
          )
          .then(res => {
            if (res.data == "修改成功") {
              this.getListData();
              this.$toast.success(`修改成功`, { duration: 2000 });
            } else {
              this.$toast.error(`修改失敗` + res.data, { duration: 2000 });
            }
            console.log("修改api:" + res.request.responseURL, res);
          })
          .catch(error => {
            this.$toast.error(`修改失敗` + error.message, { duration: 2000 });
          })
          .finally(() => {
            //this.getdata();
          });

      this.editDialog = false;
    },
    addsubmit: async function() {
      if (this.$refs.addform.validate()) {
        const updUser = this.$auth.$state.user.email;
        let parm = {
          name_en: this.addItem.name_en,
          name_ch: this.addItem.name_ch,
          unit: this.addItem.unit,
          min: this.addItem.lmtmin,
          max: this.addItem.lmtmax,
          data_group: this.addItem.class,
          created_user: updUser
        };
        await this.$axios
          .post("https://61.56.172.10/col-data/", parm, {
            httpsAgent: agent
          })
          .then(res => {
            if (res.data == "新增成功") {
              this.getListData();
              this.addDialog = false;
              this.$toast.success(`新增成功`, { duration: 2000 });
            } else {
              this.$toast.error(`新增失敗` + res.data, { duration: 2000 });
            }
          })
          .catch(error => {
            this.$toast.error(`新增失敗` + error.message, { duration: 2000 });
          })
          .finally(() => {
            //this.getdata();
          });
      }
    },
    addShow: function(data) {
      this.addItem.class = data;
      this.addItem.name_en = this.addItem.name_ch = this.addItem.unit = "";
      this.addItem.lmtmin = 0;
      this.addItem.lmtmax = 999;
      this.addDialog = true;
    },
    edit_mincheck(val) {
      this.editedItem.min = val ? parseFloat(val) : 0;
      this.$nextTick(() => {
        var objitem = this.editedItem.min;
        this.editedItem.min =
          objitem < 0
            ? 0
            : objitem > this.editedItem.max
            ? Number(this.editedItem.max)
            : objitem;
      });
    },
    edit_maxcheck(val) {
      this.editedItem.max = val ? parseFloat(val) : 0;
      this.$nextTick(() => {
        var objitem = this.editedItem.max;
        this.editedItem.max =
          objitem > 999
            ? 999
            : objitem < this.editedItem.min
            ? Number(this.editedItem.min)
            : objitem;
      });
    },
    add_lmtmincheck(val) {
      this.addItem.lmtmin = val ? parseFloat(val) : 0;
      this.$nextTick(() => {
        var objitem = this.addItem.lmtmin;
        this.addItem.lmtmin =
          objitem < 0
            ? 0
            : objitem > this.addItem.lmtmax
            ? Number(this.addItem.lmtmax)
            : objitem;
      });
    },
    add_lmtmaxcheck(val) {
      this.addItem.lmtmax = val ? parseFloat(val) : 0;
      this.$nextTick(() => {
        var objitem = this.addItem.lmtmax;
        this.addItem.lmtmax =
          objitem > 999
            ? 999
            : objitem < this.addItem.lmtmin
            ? Number(this.addItem.lmtmin)
            : objitem;
      });
    },
    delsubmit: async function(data) {
      console.log(data);
      if (confirm(`確定刪除[ ${data.name_ch} ]?`)) {
        let parm = {
          data_group: data.group
        };
        await this.$axios
          .delete(
            `https://61.56.172.10/col-data/${data.id}/`,
            { data: parm },
            {
              httpsAgent: agent
            }
          )
          .then(res => {
            if (res.data == "刪除成功") {
              this.getListData();
              this.$toast.success(`刪除成功`, { duration: 2000 });
            } else {
              this.$toast.error(`刪除失敗` + res.data, { duration: 2000 });
            }
            console.log("刪除api:" + res.request.responseURL, res);
          })
          .catch(error => {
            this.$toast.error(`刪除失敗` + error.message, { duration: 2000 });
          })
          .finally(() => {
            //this.getdata();
          });
      }
    },
    getgroupname:function(val){
      var item = this.groupmap.filter(x=>x.item==val);
      if (item.length==1) {
        return item[0].value;
      }else{
        return val;
      }
    }
  }
};
</script>

<style scoped></style>
