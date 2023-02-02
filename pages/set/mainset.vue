<template>
  <div>
    <h2>現場設定</h2>
    <v-row>
      <v-col>
        <el-tree
          :data="maindata"
          node-key="id"
          :props="treeprops"
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
            <span v-if="data.level < 3">
              <el-button type="text" size="mini" @click="() => append(data)">
                增加子項目
              </el-button>
              <!-- <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                Delete
              </el-button> -->
            </span>
            <span v-if="data.level > 1"><v-btn icon ><v-icon>mdi-</v-icon></v-btn>
            </span>
          </span>
        </el-tree>
        <v-dialog v-model="adddia" scrollable>
          <v-card>
            <v-card-title
              >[{{ nowplace.name }}]增加子項目-{{
                levelitem[nowplace.level]
              }}</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text style="height: 500px;">
              <v-row align="center">
                <v-col cols="12" sm="2"
                  ><v-btn icon @click="add"
                    ><v-icon>mdi-plus</v-icon></v-btn
                  ></v-col
                >
                <v-spacer></v-spacer>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <el-table :data="addItems">
                    <el-table-column label="編號" width="50px"
                      ><template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                      </template></el-table-column
                    >
                    <el-table-column label="Name">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.name"
                          :disabled="!scope.row.edited"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="動作">
                      <template slot-scope="scope">
                        <v-btn
                          icon
                          outlined
                          color="indigo"
                          @click="handleSaveRow(scope.$index)"
                          :disabled="!scope.row.edited"
                          ><v-icon>mdi-check-underline</v-icon></v-btn
                        >
                        <v-btn
                          icon
                          outlined
                          color="indigo"
                          @click="handleEditRow(scope.$index)"
                          :disabled="scope.row.edited"
                          ><v-icon>mdi-square-edit-outline</v-icon></v-btn
                        >
                        <v-btn
                          icon
                          outlined
                          color="indigo"
                          @click="handleDelRow(scope.$index)"
                          ><v-icon>mdi-trash-can-outline</v-icon></v-btn
                        >
                        <!-- <el-button
                          type="primary"
                          icon="el-icon-edit"
                          @click="handleEditRow(scope.$index)"
                          :disabled="scope.row.edited"
                        ></el-button> -->
                      </template>
                    </el-table-column>
                  </el-table>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="dialog = false">
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

export default {
  layout: "emptynologin",
  data() {
    return {
      maindata: [],
      treeprops: { children: "node" },
      //增加項目
      adddia: false,
      level: "", //目前在第幾層
      nowplace: { level: "", name: "" },
      levelitem: ["場", "區域", "養殖池"],
      addItems: []
      //   tableData: []
    };
  },
  async created() {
    await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`).then(res => {
      this.maindata = res.data;
    });
    //await this.getwater();
  },
  methods: {
    append: function(data) {
      this.addItems = [];
      this.nowplace.level = data.level;
      this.nowplace.name = data.name;
      this.adddia = true;
    },
    handleEditRow(index) {
      this.addItems[index].edited = true;
    },
    handleSaveRow(index) {
      this.addItems[index].edited = false;
    },
    handleDelRow(index) {
      this.addItems.splice(index,1);
    //   console.log("del:" + index);
    },
    add: function() {
      this.addItems.push({ edited: true }); //預設可編輯
      console.log("addItems:" + this.addItems.length);
    }
  }
};
</script>

<style scoped></style>
