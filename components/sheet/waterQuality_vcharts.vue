<template>
  <div>
    <!-- <h3>水質 <a href="/indicator/ind1" target="_blank"><v-btn color="grey" fab x-small dark><v-icon>mdi-open-in-new</v-icon></v-btn></a></h3> -->
    <v-row>
      <v-col cols="12"><h2>水質檢測</h2>
      <!-- <v-col cols="12"><h2>水質檢測 -{{ defaultitem }}</h2> -->
      </v-col>
      <!-- <v-col cols="12" md="6"><v-select placeholder="起日"></v-select></v-col>
      <v-col cols="12" md="6"><v-select placeholder="訖日"></v-select></v-col> -->
    </v-row>
    <v-select
      v-model="slt_1"
      :items="slt_1_items"
      label="Select"
      v-on:change="slt1_chg"
      clearable
      single-line v-if="false"
    ></v-select>
    <ve-line :data="chtData_new_1" :settings="set" :loading="loading"></ve-line>
  </div>
</template>
<style>

h3 {
  font-family: "Microsoft JhengHei UI" !important;
}
a {
  text-decoration: none;
}
</style>
<script>
export default {
  data() {
    return {
      //水質---------------------------------------------------------------------------------------
      set: {
        legendAlias: {}
      },
      slt_1_items: [], //下拉所有項目
      slt_1: "", //下拉的項目-選到的
      chtData_Ora_1: {
        columns: [],
        rows: [
          {
            id: "A1",
            data: []
          }
        ]
      },
      chtData_new_1: { columns: [], rows: [] },
      show: false
    };
  },
  // props: ["sheetid", "defaultitem"],
  props: {
    sheetid: String,
    defaultitem: String,
    loading:{
      type:Boolean,
      default:false
    },
    legendAliasOut: {
      type: Object,
      default: function() {
        return {
          鹽度: "鹽度(ppt)",
          溶氧: "溶氧(ppm)",
          氨氮: "氨氮(ppm)",
          亞硝酸: "亞硝酸(ppm)",
          溫度: "溫度(°C)",
          酸鹼度: "酸鹼度(ph)"
        };
      }
    },
    xColName: {
      type: String,
      default: "default"
    },
    rowsData: {
      type: Array,
      default: function() {
        return [
          {
            default: "20200101",
            鹽度: 700,
            溶氧: 500,
            氨氮: 200,
            亞硝酸: 400,
            溫度: 300,
            酸鹼度: 100
          },
          {
            default: "20200102",
            鹽度: 700,
            溶氧: 500,
            氨氮: 200,
            亞硝酸: 400,
            溫度: 300,
            酸鹼度: 100
          },
          {
            default: "20200103",
            鹽度: 700,
            溶氧: 500,
            氨氮: 200,
            亞硝酸: 400,
            溫度: 300,
            酸鹼度: 100
          }
        ];
      }
    }
  },
  created() {
    // //--外部參數資料帶入--
    // this.set.legendAlias = this.legendAliasOut;
    // this.slt_1_items = Object.keys(this.legendAliasOut);//取得主要欄位
    // this.chtData_Ora_1.columns = [this.xColName].concat(this.slt_1_items);
    // this.chtData_Ora_1.rows[0].data = this.rowsData;
    // //水質----------
    // this.chtData_new_1.columns = [...this.chtData_Ora_1.columns];
    // //直接參考，不會動到舊資料
    // let array = [];
    // this.chtData_Ora_1.rows.forEach(element => {
    //   array.push(...element.data);
    // });
    // this.chtData_new_1.rows = array;
    // this.chtData_new_1.rows = this.sheetdata;
  },
  updated() {
    //--外部參數資料帶入--
    this.set.legendAlias = this.legendAliasOut;
    this.slt_1_items = Object.keys(this.legendAliasOut);//取得主要欄位
    this.chtData_Ora_1.columns = [this.xColName].concat(this.slt_1_items);
    this.chtData_Ora_1.rows[0].data = this.rowsData;
    //水質----------
    this.chtData_new_1.columns = [...this.chtData_Ora_1.columns];
    //直接參考，不會動到舊資料
    let array = [];
    this.chtData_Ora_1.rows.forEach(element => {
      array.push(...element.data);
    });
    this.chtData_new_1.rows = array;
    this.chtData_new_1.rows = this.sheetdata;
  },
  computed: {
    sheetdata: function() {
      let array = [];
      this.chtData_Ora_1.rows.forEach(element => {
        if (this.sheetid === element.id) {
          array.push(...element.data);
        }
        if (this.sheetid === undefined || this.sheetid.trim() === "") {
          array.push(...element.data);
        }
      });
      return array;
    }
  },
  methods: {
    slt1_chg() {
      if (this.slt_1) {
        this.chtData_new_1.columns = ["default", this.slt_1];
      } else {
        this.chtData_new_1.columns = this.chtData_Ora_1.columns;
      }
    }
  }
};
</script>
