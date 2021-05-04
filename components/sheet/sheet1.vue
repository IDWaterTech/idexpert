<template>
  <div>
    <!-- <h3>水質 <a href="/indicator/ind1" target="_blank"><v-btn color="grey" fab x-small dark><v-icon>mdi-open-in-new</v-icon></v-btn></a></h3> -->
    <h3>
      水質
      <v-tooltip v-model="show" right>
        <template v-slot:activator="{ on, attrs }">
          <a href="Indicator/ind1" v-bind="attrs" v-on="on" target="_blank"
            ><v-btn color="grey" fab x-small dark
              ><v-icon>mdi-open-in-new</v-icon></v-btn
            ></a
          >
        </template>
        <span>另開視窗</span>
      </v-tooltip>
    </h3>
    <v-select
      v-model="slt_1"
      :items="slt_1_items"
      label="Select"
      v-on:change="slt1_chg"
      clearable
      single-line
    ></v-select>
    <ve-line :data="chtData_new_1" :settings="set"></ve-line>
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
        legendAlias: {
          鹽度: "鹽度(ppt)",
          溶氧: "溶氧(ppm)",
          氨氮: "氨氮(ppm)",
          亞硝酸: "亞硝酸(ppm)",
          溫度: "溫度(°C)",
          酸鹼度: "酸鹼度(ph)"
        }
      },
      slt_1_items: ["鹽度", "溶氧", "氨氮", "亞硝酸", "溫度", "酸鹼度"], //下拉所有項目
      slt_1: "", //下拉的項目-選到的
      chtData_Ora_1: {
        columns: [
          "default",
          "鹽度",
          "溶氧",
          "氨氮",
          "亞硝酸",
          "溫度",
          "酸鹼度"
        ],
        rows: [
          {
            id: "A1",
            data: [
              {
                default: "20200101",
                鹽度: 123,
                溶氧: 452,
                氨氮: 123,
                亞硝酸: 345,
                溫度: 345,
                酸鹼度: 122
              },
              {
                default: "20200102",
                鹽度: 223,
                溶氧: 652,
                氨氮: 362,
                亞硝酸: 111,
                溫度: 111,
                酸鹼度: 111
              },
              {
                default: "20200103",
                鹽度: 223,
                溶氧: 855,
                氨氮: 214,
                亞硝酸: 254,
                溫度: 254,
                酸鹼度: 254
              },
              {
                default: "20200104",
                鹽度: 312,
                溶氧: 528,
                氨氮: 215,
                亞硝酸: 487,
                溫度: 487,
                酸鹼度: 567
              },
              {
                default: "20200105",
                鹽度: 123,
                溶氧: 265,
                氨氮: 212,
                亞硝酸: 265,
                溫度: 265,
                酸鹼度: 265
              },
              {
                default: "20200106",
                鹽度: 333,
                溶氧: 265,
                氨氮: 526,
                亞硝酸: 555,
                溫度: 555,
                酸鹼度: 234
              },
              {
                default: "20200107",
                鹽度: 323,
                溶氧: 205,
                氨氮: 445,
                亞硝酸: 105,
                溫度: 105,
                酸鹼度: 105
              },
              {
                default: "20200108",
                鹽度: 211,
                溶氧: 982,
                氨氮: 888,
                亞硝酸: 156,
                溫度: 156,
                酸鹼度: 666
              }
            ]
          },
          {
            id: "A2",
            data: [
              {
                default: "20200201",
                鹽度: 123,
                溶氧: 452,
                氨氮: 123,
                亞硝酸: 345,
                溫度: 345,
                酸鹼度: 345
              },
              {
                default: "20200202",
                鹽度: 223,
                溶氧: 652,
                氨氮: 362,
                亞硝酸: 111,
                溫度: 111,
                酸鹼度: 788
              },
              {
                default: "20200203",
                鹽度: 223,
                溶氧: 855,
                氨氮: 214,
                亞硝酸: 254,
                溫度: 254,
                酸鹼度: 254
              },
              {
                default: "20200204",
                鹽度: 312,
                溶氧: 528,
                氨氮: 215,
                亞硝酸: 487,
                溫度: 487,
                酸鹼度: 356
              },
              {
                default: "20200205",
                鹽度: 123,
                溶氧: 265,
                氨氮: 212,
                亞硝酸: 265,
                溫度: 265,
                酸鹼度: 666
              },
              {
                default: "20200206",
                鹽度: 333,
                溶氧: 265,
                氨氮: 526,
                亞硝酸: 555,
                溫度: 555,
                酸鹼度: 555
              },
              {
                default: "20200207",
                鹽度: 323,
                溶氧: 205,
                氨氮: 445,
                亞硝酸: 105,
                溫度: 105,
                酸鹼度: 105
              },
              {
                default: "20200208",
                鹽度: 211,
                溶氧: 982,
                氨氮: 888,
                亞硝酸: 156,
                溫度: 156,
                酸鹼度: 155
              }
            ]
          }
        ]
      },
      chtData_new_1: { columns: [], rows: [] },
      show: false
    };
  },
  created() {
    //水質----------
    //解構賦值
    this.chtData_new_1.columns = [...this.chtData_Ora_1.columns];
    //直接參考，不會動到舊資料
    //this.chtData_new_1.rows = this.chtData_Ora_1.rows;
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
  props: ["sheetid"],
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
