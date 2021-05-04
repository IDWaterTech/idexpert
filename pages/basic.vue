<template>
  <div>
    <v-expansion-panels class="mb-6" v-model="mypanel">
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down">
          選擇條件
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="grey lighten-5">
            <v-row no-gutters>
              <v-col cols="3">
                <v-card class="pa-2" outlined tile>
                  <v-select
                    :items="maindata"
                    item-value="id"
                    item-text="name"
                    label="選擇廠"
                    clearable
                    v-model="sel_main"
                  ></v-select>
                  <v-select
                    v-model="sel_area"
                    :items="areadata"
                    item-value="name"
                    item-text="name"
                    clearable
                    label="選擇區域"
                  ></v-select>
                  <!-- 可能同池名，在不同廠，所以value= name -->
                  <v-btn tile color="blue" dark @click="closepanel">確認</v-btn>
                </v-card>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <v-card class="pa-2" outlined tile>
                  <v-treeview
                    v-model="tree"
                    :open="initiallyOpen"
                    :items="pooldata"
                    item-children="node"
                    activatable
                    item-key="name"
                    open-on-click
                    :selection-type="'leaf'"
                  >
                    <template v-slot:prepend="{ item, open }">
                        
                      <v-icon v-if="!item.type && item.node">
                        <!-- {{ open ? "mdi-folder-open" : "mdi-folder" }} 有NODE絕對不是最後一層-->
                        {{ open ? "mdi-select-group" : "mdi-select-inverse" }}
                      </v-icon>
                      <v-icon v-else-if="!item.node">
                        <!-- 沒Node當作已最後一層 -->
                        {{ files["pool"] }}
                      </v-icon>
                      <v-icon v-else>
                        {{ files[item.type] }}
                      </v-icon>
                    </template>
                  </v-treeview>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-tabs v-model="currenttab" background-color="blue lighten-2" dark>
      <v-tab v-for="(tab, idx) in tabs" :key="idx" :href="'#tab-' + tab.name">
        {{ tab.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="currenttab">
      <v-tab-item
        v-for="(tab, idx) in tabs"
        :key="idx"
        :value="'tab-' + tab.name"
      >
        <v-card flat>
          <v-card-text>
            <h2>{{ tab.name }}</h2>

            <v-row>
              <v-col cols="12" md="4">
                <Ind1></Ind1>
              </v-col>
              <v-col cols="12" md="4">
                <Ind1></Ind1>
              </v-col>
              <v-col cols="12" md="4">
                <Ind1></Ind1>
              </v-col>
              <v-col cols="12" md="4">
                <Ind1></Ind1>
              </v-col>
              <v-col cols="12" md="4">
                <Ind1></Ind1>
              </v-col>
              <v-col cols="12" md="4">
                <Ind1></Ind1>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import treelst from "~/components/treeList.vue";
import Ind1 from "./Indicator/ind1";
import _ from "lodash";
export default {
  layout: "emptynologin",
  components: {
    treelst,
    Ind1
  },
  data() {
    return {
      mypanel: [],
      sel_main: "",
      sel_area: "",
      //items: ["A1", "A2"],
      tabs: [
        { name: "水質監測" },
        { name: "投餵/池體數據" },
        { name: "白蝦監測" }
      ],
      currenttab: "水質監測",
      tree: [],
      initiallyOpen: ["研發一廠"],
      files: {
        html: "mdi-language-html5",
        js: "mdi-nodejs",
        json: "mdi-code-json",
        md: "mdi-language-markdown",
        pdf: "mdi-file-pdf",
        png: "mdi-file-image",
        txt: "mdi-file-document-outline",
        xls: "mdi-file-excel",
        group: "select-group",
        openedgroup: "select-inverse",
        pool: "mdi-pool"
      },
      items2: [
        {
          name: "研發 0 廠"
        },
        {
          name: "研發 1 廠",
          pond_area: [
            {
              name: "武曲",
              pond_area: [
                {
                  name: "A1",
                  type: "pool"
                },
                {
                  name: "A2",
                  type: "pool"
                }
              ]
            }
          ]
        }
      ],
      maindata: []
    };
  },
  methods: {
    closepanel: function() {
      this.mypanel = [];
    }
  },
  created() {
    // this.$axios.get("/idapi/architecture/").then(res => {
    //   //maindata
    //   this.maindata = res.data;
    // });
    this.$axios.get("http://61.56.172.10/architecture/").then(res => {
      this.maindata = res.data;
    });
  },
  computed: {
    areadata: function() {
      let filtermain = [];
      filtermain = this.maindata;
      // console.log("maindata node count:",this.maindata[0].node.length);

      if (
        //看有沒有選廠
        this.sel_main != undefined &&
        this.sel_main > 0 &&
        this.maindata.length > 0
      ) {
        filtermain = filtermain.filter(main => main.id == this.sel_main);
      }
      var area = [];

      filtermain.forEach(function(x) {
        x.node.forEach(function(y) {
          var yitem = { id: y.id, name: y.name };
          if (area.indexOf(yitem) == -1) {
            //沒找到
            area.push(yitem);
          }
        });
      });
      return area;
    },
    pooldata: function() {
      let filterarea = _.cloneDeep(this.maindata);
      //filterarea = this.maindata;

      //先篩廠
      if (
        this.sel_main != undefined && //非空
        this.sel_main > 0 && //有選到
        this.maindata.length > 0 //有資料
      ) {
        filterarea = filterarea.filter(main => main.id == this.sel_main);
      }
      let obj = [];
      //再篩區
      if (
        //如果有選區
        this.sel_area != undefined &&
        this.sel_area.length > 0 &&
        filterarea.length > 0
      ) {
        let astr = this.sel_area;
        filterarea.forEach(function(item, index) {
          obj.push(item);
          console.log("item", item);
          obj[index].node = item.node.filter(x => x.name == astr);
        });
        /*for (let i = 0; i < obj.length; i++) {
          console.log("filterarea node:",obj[i].node.length);
          filterarea[i].node = obj[i].node.filter(
            x => x.name == this.sel_area
          );
        }*/
      }
      //return this.maindata;
      return filterarea;

      //return obj;
    }
  }
};
</script>

<style scoped></style>
