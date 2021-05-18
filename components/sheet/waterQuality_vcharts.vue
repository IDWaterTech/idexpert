<template>
  <div>
    <v-row>
      <v-col cols="12"
        ><h2>{{ title }}</h2>
      </v-col>
    </v-row>
    <v-select
      v-model="slt_1"
      :items="slt_1_items"
      label="Select"
      v-on:change="slt1_chg"
      clearable
      single-line
      v-if="false"
    ></v-select>
    <div v-show="false">{{ defaultitem }}</div>
    <!-- 外部更新資料必須顯示在DOM裡面才會更新資料，不得已只好放著，但不顯示 -->
    <ve-line
      :data="chtData_new_1"
      :settings="set"
      :extend="chartExtend"
      :loading="loading"
      :events="chartEvent"
      :judge-width="true"
    ></ve-line>
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
        legendAlias: {},
        stack: {}
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
      show: false,
      chartExtend: {
        legend: {
          selected: this.defaultitem
        }
      },
      chartEvent: {
        click: function(e) {
          alert("Item:" + e.seriesName + "\r\nValue:" + e.value);
        }
      }
    };
  },
  // props: ["sheetid", "defaultitem"],
  props: {
    sheetid: String,
    title: String,
    defaultitem: {
      type: Object,
      default: function() {
        return {};
      }
    },
    loading: {
      type: Boolean,
      default: false
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
    // this.chtData_Ora_1.columns = [this.xColName].concat(this.slt_1_items); //設定欄位
    // this.chtData_new_1.columns = [...this.chtData_Ora_1.columns]; //設定欄位
  },
  updated() {
    //--外部參數資料帶入--
    this.set.legendAlias = this.legendAliasOut;
    this.slt_1_items = Object.keys(this.legendAliasOut); //取得主要欄位
    // this.chtData_Ora_1.columns = [this.xColName].concat(this.slt_1_items); //設定欄位
    var temp = Object.keys(this.rowsData[0]);
    if (temp.indexOf(this.xColName)>-1) {
      temp.splice(temp.indexOf(this.xColName),1);//去除default 時間欄位
    }
    this.chtData_Ora_1.columns = [this.xColName].concat(temp); //設定欄位
    this.chtData_Ora_1.rows[0].data = this.rowsData;
    this.chartExtend.legend.selected = this.defaultitem; //選到什麼欄位
    //水質----------
    this.chtData_new_1.columns = [...this.chtData_Ora_1.columns]; //設定欄位
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
