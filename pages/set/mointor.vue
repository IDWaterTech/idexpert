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
          <v-card-title>{{ item }}</v-card-title>
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
          <span class="text-h5">編輯項目</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                        <v-text-field
                          v-model="editedItem.class"
                          label="主項目"
                          disabled
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.item"
                          label="項目"
                          disabled
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.value"
                          label="值"
                          autocomplate="off"
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
  </div>
</template>

<script>
import https from "https";
export default {
  layout: "emptynologin",
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
        value: ""
      }
    };
  },
  async created() {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    await this.$axios
      .get("https://61.56.172.10/all-col-name/", {
        httpsAgent: agent
      })
      .then(res => {
        console.log("all項目");
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
      this.editedItem = Object.assign({},data);
      console.log(this.editedItem);
      this.editDialog = true;
    },
    editsubmit: function() {
      this.editDialog = false;
    }
  }
};
</script>

<style scoped></style>
