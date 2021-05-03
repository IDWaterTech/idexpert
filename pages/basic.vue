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
                    open-all
                    :items="pooldata"
                    item-children="pond_area"
                    activatable
                    item-key="name"
                    open-on-click
                    :selection-type="'leaf'"
                  >
                    <template v-slot:prepend="{ item, open }">
                      <v-icon v-if="!item.type">
                        <!-- {{ open ? "mdi-folder-open" : "mdi-folder" }} -->
                        {{ open ? "mdi-select-group" : "mdi-select-inverse" }}
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
      initiallyOpen: ["public"],
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
                },
                {
                  name: "A3",
                  type: "pool"
                },
                {
                  name: "A4",
                  type: "pool"
                },
                {
                  name: "A5",
                  type: "pool"
                },
                {
                  name: "A6",
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
    this.$axios.get("idapi/architecture/").then(res => {
      //maindata
      this.maindata = res.data;
    });
    console.log("maindata:", this.maindata);
  },
  computed: {
    areadata: function() {
      var filtermain=this.maindata;
      if (
        this.sel_main != undefined &&
        this.sel_main > 0 &&
        this.maindata.length > 0
      ) {
        filtermain = this.maindata.filter(main => main.id == this.sel_main);
      }
      var area=[];
      filtermain.forEach(function(x) {
          x.pond_area.forEach(function(y) {
            var yitem = {id:y.id,name:y.name};
            if (area.indexOf(yitem)==-1) {//沒找到
              area.push({id:y.id, name:y.name});
            }
          });
        });
        return area;
    },
    pooldata:function(){
      var filtermain=this.maindata;
      //先篩廠
      if (
        this.sel_main != undefined &&//非空
        this.sel_main > 0 &&//有選到
        this.maindata.length > 0//有資料
      ) {
        filtermain = this.maindata.filter(main => main.id == this.sel_main);
        
      }
      //再篩區
       if (
        this.sel_area != undefined &&
        this.sel_area.length > 0 &&
        filtermain.length > 0
      ) {
          for (let i = 0; i < filtermain.length; i++) {
            filtermain[i].pond_area = filtermain[i].pond_area.filter(x=>x.name == this.sel_area);
          }
        }
      return filtermain;
    }
  }
};
</script>

<style scoped></style>
