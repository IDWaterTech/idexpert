<template>
  <div>
    <h1>監測設定</h1>
    <v-row>
      <v-col
        cols="4"
        v-for="(item, index) in Object.keys(allcols)"
        :key="index"
      >
        <v-card>
          <v-card-title
            >{{ item }}<v-spacer></v-spacer>
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
              :items="newitem.filter(x => x.class == item)"
              :headers="headers"
              :footer-props="footerProps"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editShow(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small>
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
          <span class="text-h5">編輯項目-{{ editedItem.class }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.item"
                  label="項目"
                  disabled
                  autocomplate="off"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.value"
                  label="顯示文字"
                  autocomplate="off"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  label="下限"
                  :value="editedItem.lmtmin"
                  type="number"
                  step="1"
                  min="0"
                  max="999"
                  @input="edit_lmtmincheck"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                ~
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="editedItem.lmtmax"
                  label="上限"
                  autocomplate="off"
                  type="number"
                  step="1"
                  min="0"
                  max="999"
                  @input="edit_lmtmaxcheck"
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
          text: "項目",
          align: "center",
          sortable: false,
          value: "item"
        },
        {
          text: "顯示文字",
          align: "center",
          sortable: false,
          value: "value"
        },
        { text: "Actions", value: "actions", sortable: false }
      ],
      footerProps: {
        "items-per-page-text": "每頁",
        "items-per-page-options": [25, 50, 75, 100]
      },
      allcols: {
        water: {
          排汙耗時: "排汙耗時(s)",
          進水量: "進水量(L)"
        },
        feed: {
          排汙耗時feed: "排汙耗時(s)"
        }
      },
      editDialog: false,
      editedItem: {
        class: "",
        item: "",
        value: "",
        lmtmin: 0,
        lmtmax: 999
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
    await this.$axios
      .get("https://61.56.172.10/all-col-name/", {
        httpsAgent: agent
      })
      .then(res => {
        this.allcols = Object.assign({}, res.data);
      });
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
    }
  },
  methods: {
    editShow: function(data) {
      data.lmtmax = 999;
      data.lmtmin = 0;
      this.editedItem = Object.assign({}, data);
      this.editDialog = true;
    },
    editsubmit: function() {
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
        console.log(parm);
        await this.$axios
          .post("https://61.56.172.10/all-col-name/", parm, {
            httpsAgent: agent
          })
          .then(res => {
            if (res.data == "新增成功") {
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
    edit_lmtmincheck(val) {
      this.editedItem.lmtmin = val ? parseFloat(val) : 0;
      this.$nextTick(() => {
        var objitem = this.editedItem.lmtmin;
        this.editedItem.lmtmin =
          objitem < 0
            ? 0
            : objitem > this.editedItem.lmtmax
            ? Number(this.editedItem.lmtmax)
            : objitem;
      });
    },
    edit_lmtmaxcheck(val) {
      this.editedItem.lmtmax = val ? parseFloat(val) : 0;
      this.$nextTick(() => {
        var objitem = this.editedItem.lmtmax;
        this.editedItem.lmtmax =
          objitem > 999
            ? 999
            : objitem < this.editedItem.lmtmin
            ? Number(this.editedItem.lmtmin)
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
    }
  }
};
</script>

<style scoped></style>
