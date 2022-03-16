<template>
  <div>
    <h2 style="color:white;">投餵飼料-管理</h2>
    <v-tabs v-model="tablindex" background-color="cardtitle" center-active dark>
      <v-tab :href="`#廠商設定`">廠商設定</v-tab>
      <v-tab :href="`#飼料設定`">飼料設定(套餐)</v-tab>
      <v-tab :href="`#成份設定`">成份設定</v-tab>
    </v-tabs>
    <!-- tabe的主要內容 -->
    <v-tabs-items v-model="tablindex">
      <!-- 廠商設定 -->
      <v-tab-item value="廠商設定">
        <v-row class="mx-3 my-3 mt-3">
          <v-col cols="12" sm="6" class="my-2">
            <v-autocomplete
              v-model="manuidx"
              style="width"
              :items="manu"
              item-text="name"
              item-value="value"
              dense
              label="選擇廠商"
              solo
              clearable
              @change="isEditing = false"
            ></v-autocomplete>
            <v-card>
              <v-toolbar flat color="lightblue" dark>
                <v-icon class="mx-2">mdi-account-group</v-icon>
                <v-toolbar-title class="font-weight-light">
                  廠商資訊：{{
                    manu.filter(x => x.value == manuidx).length > 0
                      ? manu.filter(x => x.value == manuidx)[0].name
                      : ""
                  }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="isEditing = !isEditing"
                  v-if="manu.filter(x => x.value == manuidx).length == 0"
                >
                  <v-icon v-if="isEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-account-multiple-plus
                  </v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="isEditing = !isEditing"
                  v-if="manu.filter(x => x.value == manuidx).length > 0"
                >
                  <v-icon v-if="isEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form ref="manform" v-model="manvalid">
                  <v-text-field
                    filled
                    clearable
                    placeholder="廠商A股份有限公司"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">廠商名稱</span></v-text-field>
                  <v-text-field
                    filled
                    clearable
                    placeholder="manufacturer_a"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">廠商名稱(英)</span></v-text-field>
                   <v-text-field
                    filled
                    clearable
                    placeholder="manufacturer_tel"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">聯絡電話</span></v-text-field>
                   <v-text-field
                    filled
                    clearable
                    placeholder="manufacturer_man"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">聯絡人</span></v-text-field>
                   <v-text-field
                    filled
                    clearable
                    placeholder="manufacturer_addr"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">住址</span></v-text-field>
                  <v-text-field
                    filled
                    clearable
                    placeholder="manufacturer_id"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">統編</span></v-text-field>
                  <v-text-field
                    label="備註"
                    clearable outlined
                    placeholder="memo"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!isEditing"
                  color="primary"
                  @click="manusubmit"
                >
                  確定
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-tab-item>
      <!-- 飼料設定 -->
      <v-tab-item value="飼料設定">
        <v-row class="mx-3 my-3 mt-3">
          <v-col cols="12" sm="6" class="my-2">
            <v-autocomplete
              v-model="comboidx"
              style="width"
              :items="combo"
              item-text="name"
              item-value="value"
              dense
              label="選擇飼料(套餐)"
              solo
              clearable
              @change="isEditing = false"
            ></v-autocomplete>
            <v-card>
              <v-toolbar flat color="lightblue" dark>
                <v-icon class="mx-2">mdi-food</v-icon>
                <v-toolbar-title class="font-weight-light">
                  飼料資訊(套餐)：{{
                    combo.filter(x => x.value == comboidx).length > 0
                      ? combo.filter(x => x.value == comboidx)[0].name
                      : ""
                  }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="isEditing = !isEditing"
                  v-if="manu.filter(x => x.value == manuidx).length == 0"
                >
                  <v-icon v-if="isEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-account-multiple-plus
                  </v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="isEditing = !isEditing"
                  v-if="manu.filter(x => x.value == manuidx).length > 0"
                >
                  <v-icon v-if="isEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form ref="manform" v-model="manvalid">
                  <v-text-field
                    filled
                    clearable
                    placeholder="0號料"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">飼料名稱</span></v-text-field>
                  <v-text-field
                    filled
                    clearable
                    placeholder="feed0"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">飼料名稱(英)</span></v-text-field>
                  <v-text-field
                    label="備註"
                    clearable outlined
                    placeholder="memo"
                  ></v-text-field>
                  <v-divider></v-divider>
                  <h2 class="my-2">配方</h2>
                  <v-autocomplete
                    v-model="mingidx"
                    style="width"
                    :items="maining"
                    item-text="name"
                    item-value="value"
                    dense
                    label="選擇主成份"
                    filled
                    clearable
                    @change="isEditing = false"
                    ><span slot="prepend" style="width:50px;"
                      >主成份</span
                    ></v-autocomplete
                  >
                  <v-autocomplete
                    v-model="ingidx"
                    style="width"
                    :items="ingredients"
                    item-text="name"
                    item-value="value"
                    dense
                    chips
                    deletable-chips
                    label="選擇次成份"
                    filled
                    clearable
                    multiple
                    @change="isEditing = false"
                    ><span slot="prepend" style="width:50px;"
                      >次成份</span
                    ></v-autocomplete
                  >
                  <span v-show="ingidx.length>0">比例</span>
                  <v-row
                    v-for="item in ingidx"
                    :key="item"
                    align="center"
                    align-content="center"
                  >
                    <v-col cols="2">
                      <div
                        class="headline text-center mb-3"
                        style="border: 2px grey solid;"
                      >
                        {{ ingredients.filter(x => x.value == item)[0].name }}
                      </div>
                    </v-col>
                    <v-col cols="3" align-self="center">
                      <v-autocomplete
                        v-model="
                          ingredientsItem[
                            ingredients.filter(x => x.value == item)[0].value
                          ]
                        "
                        filled
                        dense
                        :rules="rules.require"
                        item-text="name"
                        :items="
                          ingredients.filter(x => x.value == item)[0].items
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="3">
                      <div class="text-center">= 飼料(主成份) X</div>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        filled
                        dense
                        clearable
                        placeholder="範例：*0.5*1.5*300%*1(2+50)"
                        :rules="rules.require"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">{{
                      ingredients
                        .filter(x => x.value == item)[0]
                        .items.filter(
                          x =>
                            x.name ==
                            ingredientsItem[
                              ingredients.filter(x => x.value == item)[0].value
                            ]
                        )
                    }}</v-col>
                  </v-row>
                  
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!isEditing"
                  color="primary"
                  @click="manusubmit"
                >
                  確定
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-tab-item>
      <!-- 成份設定 -->
      <v-tab-item value="成份設定">
        <v-row class="mx-3 my-3 mt-3">
          <v-col cols="12" sm="6" class="my-2">
            <v-autocomplete
              v-model="comboidx"
              style="width"
              :items="combo"
              item-text="name"
              item-value="value"
              dense
              label="選擇成份類別"
              solo
              clearable
              @change="isEditing = false"
            ></v-autocomplete>
            成份清單<v-chip class="mx-3" v-for="n in ['糖1','糖2','三菌1','三菌2']" :key="n">#{{n}}</v-chip>
             <v-card class="mt-1">
              <v-toolbar flat color="lightblue" dark>
                <v-icon class="mx-2">mdi-food-drumstick</v-icon>
                <v-toolbar-title class="font-weight-light">
                  成份類別
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="isEditing = !isEditing"
                  v-if="manu.filter(x => x.value == manuidx).length == 0"
                >
                  <v-icon v-if="isEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-account-multiple-plus
                  </v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="isEditing = !isEditing"
                  v-if="manu.filter(x => x.value == manuidx).length > 0"
                >
                  <v-icon v-if="isEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form ref="manform" v-model="manvalid">
                  <v-text-field
                    filled
                    clearable
                    placeholder="糖,水,..."
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">類別名稱</span></v-text-field>
                  <v-text-field
                    filled
                    clearable
                    placeholder="suger,water,..."
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">類別名稱(英)</span></v-text-field>
                  <v-switch
                        :label="`主類別(主成份)/一般類別(次成份)`"
                    ></v-switch>
                    
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!isEditing"
                  color="primary"
                  @click="manusubmit"
                >
                  確定
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" class="my-2">
              <v-card>
              <v-toolbar flat color="lightblue" dark>
                <v-icon class="mx-2">mdi-food-drumstick</v-icon>
                <v-toolbar-title class="font-weight-light">
                  成份：糖1
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="isEditing = !isEditing"
                  v-if="manu.filter(x => x.value == manuidx).length == 0"
                >
                  <v-icon v-if="isEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-account-multiple-plus
                  </v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="isEditing = !isEditing"
                  v-if="manu.filter(x => x.value == manuidx).length > 0"
                >
                  <v-icon v-if="isEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form ref="manform" v-model="manvalid">
                  <v-text-field
                    filled
                    clearable
                    placeholder="糖1,糖2,..."
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">成份名稱</span></v-text-field>
                  <v-text-field
                    filled
                    clearable
                    placeholder="suger1,suger2,..."
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">成份名稱(英)</span></v-text-field>
                  <v-autocomplete
                    style="width"
                    dense
                    label="選擇廠商"
                    filled
                    clearable
                    @change="isEditing = false"
                  ><span slot="prepend" style="width:100px;">廠商</span></v-autocomplete>
                  
                  <v-text-field
                    label="備註"
                    clearable outlined
                    placeholder="memo"
                  ></v-text-field>
                  <v-divider></v-divider>
                  <h2 class="my-2">詳細內容
                      <v-btn class="mx-3"  x-small fab dark color="primary" @click="ingitemcrease('+')">+</v-btn>
                      </h2>
                      <v-row v-for="item in ingitem" :key="item.id">
                          <v-col cols="3" align-self="center">
                              <v-text-field v-model="item.item_name" filled dense clearable :rules="rules.require"><span slot="prepend" style="width:50px;">項目</span></v-text-field>
                          </v-col>
                          <v-col cols="4">
                              <v-text-field v-model="item.item_en" filled dense clearable :rules="rules.require"><span slot="prepend" style="width:50px;">項目(英)</span></v-text-field>
                          </v-col>
                          <v-col cols="4">
                              <v-text-field v-model="item.value" filled dense clearable :rules="rules.require"><span slot="prepend" style="width:50px;">內容</span></v-text-field>
                          </v-col>
                          <v-col cols="1">
                              <v-btn  x-small fab dark color="primary" @click="ingitemcrease(item.id)">-</v-btn>
                          </v-col>
                      </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!isEditing"
                  color="primary"
                  @click="manusubmit"
                >
                  確定
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  layout: "emptynologin",
  data() {
    return {
      rules: { require: [v => !!v || "*必要項目"] },
      tablindex: "",
      manu: [
        { name: "廠商1", value: "1" },
        { name: "廠商2", value: "2" }
      ],
      manuidx: "",
      manvalid: true,
      combo: [
        { name: "0號料_a餐", value: "1" },
        { name: "0號料_b餐", value: "2" }
      ],
      comboidx: "",
      mingidx: "", //主成份
      maining: [
        { name: "0號料", value: "1" },
        { name: "1號料", value: "2" },
        { name: "2號料", value: "3" }
      ],
      ingidx: "", //次成份
      ingredients: [
        {
          name: "糖",
          value: "suger",
          items: [
            {
              name: "default",
              id: 1,
              other: [
                { name: "廠商", value: "喜互惠" },
                { name: "純度", value: "10" },
                { name: "C%", value: "11" }
              ]
            },
            {
              name: "全聯品牌",
              id: 2,
              other: [
                { name: "廠商", value: "全聯" },
                { name: "純度", value: "10" },
                { name: "C%", value: "11" }
              ]
            }
          ]
        },
        {
          name: "水",
          value: "water",
          items: [
            {
              name: "default",
              id: 1,
              other: [
                { name: "廠商", value: "喜互惠" },
                { name: "純度", value: "10" },
                { name: "C%", value: "11" }
              ]
            }
          ]
        },
        {
          name: "三菌總帥",
          value: "probiotics",
          items: [
            {
              name: "default",
              id: 1,
              other: [
                { name: "廠商", value: "喜互惠" },
                { name: "純度", value: "10" },
                { name: "C%", value: "11" }
              ]
            }
          ]
        }
      ],
      ingredientsItem: {},
      isEditing: false,
      customFilter: "",
      ingitem:[],//成份詳細內容
    };
  },
  methods: {
    manusubmit: async function() {
      let val = this.$refs.manform.validate();
      if (val) {
        alert("ok");
      }
    },
    getRnd:function(){
        return Math.floor(Math.random() * 1000);
    },
    ingitemcrease:async function(data){
        switch(data){
            case "+":
                var newid = this.getRnd();
                while (this.ingitem.filter(x=>x.id==newid).length!=0) {
                    newid = getRnd();
                }
                this.ingitem.push({"id":newid,"item_name":"","item_en":"","value":""});
                break;
            default:
                var itemidx = this.ingitem.indexOf(this.ingitem.find(x=>x.id==data));
                this.ingitem.splice(itemidx,1);
                break;
        }
    }
  }
};
</script>
