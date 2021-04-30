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
                  <v-select :items="items" label="選擇廠"></v-select>
                  <v-select :items="items" label="選擇區域"></v-select>
                  <v-select
                    :items="items"
                    label="選擇項目(溶氧,PH,...)"
                  ></v-select>
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
                    :items="items2"
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
      items: ["A1", "A2"],
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
      ]
    };
  },
  methods: {
    closepanel: function() {
      this.mypanel = [];
    }
  }
};
</script>

<style scoped></style>
