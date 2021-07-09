<template>
  <div>
    <h2>廠域設定</h2>
    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <v-row no-gutters align="center">
          <v-col cols="6"
            ><v-select
              v-model="sel_main"
              :items="maindata"
              item-value="id"
              item-text="name"
              label="選擇廠"
              clearable
              @change="
                () => {
                  if(sel_main){}else{sel_area = undefined;pooldata=[];};
                }
              "
              dense
            >
            </v-select
          ></v-col>
          <v-col cols="6">
            <v-btn icon color="success"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn icon :disabled="!sel_main" color="error"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
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
              dense
              label="選擇區域"
              no-data-text="查無資料"
              @change="getPoolData"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-btn icon :disabled="!sel_main" color="success"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn icon :disabled="!sel_area" color="error"
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
              placeholder="水池"
              clearable
              dense
            ></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-btn icon :disabled="!sel_area" color="success"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <v-btn icon :disabled="!sel_area" color="error"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
        <v-col>
            <v-btn color="primary">池基本參數設定</v-btn>
        </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="3"
        v-for="item in pooldata.filter(
          x => x.id == sel_pool || sel_pool == undefined || sel_pool == ''
        )"
        :key="item.id"
      >
        <v-card tile>
          <v-card-subtitle>
            {{ item.name }}
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <ul>
              <li v-for="it in Object.keys(item)" :key="it">{{ it }}:{{ item[it] }}</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>



    <v-dialog v-model="dialog.main"></v-dialog>
  </div>
</template>

<script>
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false
});
export default {
  layout: "emptynologin",
  data() {
    return {
      maindata: [],
      sel_main: "",
      sel_area: "",
      sel_pool: "",
      pooldata: [],
      dialog:{
          main:false
      }
    };
  },
  async created() {
    await this.$axios
      .get("https://61.56.172.10/architecture/", { httpsAgent: agent })
      .then(res => {
        this.maindata = res.data;
      });
  },
  methods: {
    getPoolData: async function() {
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
          "https://61.56.172.10/ponds-data/",
          { params: para },
          { httpsAgent: agent }
        )
        .then(res => {
          console.log(res.data);
          pool = res.data;
        })
        .catch(error => {
          this.$axios.error("error:" + error, { duration: 2000 });
          pool = [];
        })
        .finally(() => {
          /* 不論失敗成功皆會執行 */ this.pooldata = pool;
        });
    }
  },
  computed: {
    areadata: function() {
      let filtermain = [];
      filtermain = this.maindata;

      if (
        //看有沒有選廠
        this.sel_main != undefined &&
        this.sel_main > 0 &&
        this.maindata.length > 0
      ) {
        filtermain = filtermain.filter(main => main.id == this.sel_main);
      }
      let area = [];
      filtermain.forEach(function(x) {
        x.node.forEach(function(y) {
          let yitem = { id: y.id, name: y.name };
          if (area.indexOf(yitem) == -1) {
            //沒找到
            area.push(yitem);
          }
        });
      });
      return area;
    }
  }
};
</script>

<style scoped></style>
