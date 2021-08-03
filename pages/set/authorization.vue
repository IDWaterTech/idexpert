<template>
  <div>
    <h1>授權管理(開發中)</h1>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text>
            <el-table :data="roledata">
              <el-table-column label="ID" prop="id" fixed  width="50px">
              </el-table-column>
              <el-table-column label="角色名稱" prop="name"> </el-table-column>
              <el-table-column label="描述" prop="desc"> </el-table-column>
              <el-table-column label="被授權的" align="center">
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
                <!-- <el-table-column prop="position" label="人員" align="center">
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
                </el-table-column> -->
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
export default {
  layout: "emptynologin",
  data() {
    return {
      roledata: [
        {
          id: "12987122",
          name: "測試用角色1",
          desc: "側欄全開",
          department:[],
          position: []
        },
        {
          id: "12987123",
          name: "測試用角色2",
          desc: "側欄全開+管理頁面",
          position: ["技術部長", "廠務組長", "技術研發組長"]
        }
      ]
    };
  },
  methods: {
    getRoles: async function() {
      await this.$axios
        .get("https://61.56.172.10/user-access/role/")
        .then(res => {
          this.roledata = res.data;
          console.log("api：" + res.request.responseURL);
          console.log(this.roledata);
        });
    }
  },
  mounted() {
    this.getRoles();
  }
};
</script>

<style scoped></style>
