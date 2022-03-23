<template>
  <div>
    <h2 style="color:white;">投餵飼料-管理</h2>
    <v-tabs v-model="tablindex" background-color="cardtitle" center-active dark>
      <v-tab :href="`#廠商設定`">廠商設定</v-tab>
      <v-tab :href="`#成份設定`">成份設定</v-tab>
      <v-tab :href="`#飼料設定(套餐)`">飼料設定(套餐)</v-tab>
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
              item-text="name_ch"
              item-value="id"
              dense
              label="選擇廠商"
              solo
              clearable
              @change="manselect"
            ><v-icon slot="prepend" @click="getmanudata">mdi-reload</v-icon></v-autocomplete>
            <v-card >
              <v-toolbar flat color="lightblue" dark>
                <v-icon class="mx-2">mdi-account-group</v-icon>
                <v-toolbar-title class="font-weight-light">
                  廠商資訊{{
                    manu.filter(x => x.id == manuidx).length > 0
                      ? "：" + manu.filter(x => x.id == manuidx)[0].name_ch
                      : (manisEditing)?"：新增模式":""
                  }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="manopenaddEdit"
                  v-if="manmode == 'add'"
                >
                <!-- 是否編輯中 -->
                  <v-icon v-if="manisEditing">
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
                  @click="manisEditing = !manisEditing"
                  v-if="manmode == 'edit'"
                >
                  <v-icon v-if="manisEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form ref="manform" v-model="manvalid" :disabled="!manisEditing">
                  <v-text-field
                    v-model="manfield.name_ch"
                    filled
                    clearable
                    placeholder="name_ch"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">廠商名稱</span></v-text-field>
                  <v-text-field
                    v-model="manfield.name_en"
                    filled
                    clearable
                    placeholder="name_en"
                    :rules="rules.require"
                    :disabled="manmode=='edit'"
                  ><span slot="prepend" style="width:100px;">廠商名稱(英)</span></v-text-field>
                  <v-text-field
                    v-model="manfield.tax_id"
                    filled
                    clearable
                    counter="8"
                    maxlength="8"
                    placeholder="tax_id"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">統編</span></v-text-field>
                  <v-text-field
                  v-model="manfield.address"
                    filled
                    clearable
                    placeholder="address"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">住址</span></v-text-field>
                   <v-text-field
                    v-model="manfield.phone"
                    filled
                    clearable
                    placeholder="phone"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">聯絡電話</span></v-text-field>
                   <v-text-field
                    v-model="manfield.contact"
                    filled
                    clearable
                    placeholder="contact"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">聯絡人</span></v-text-field>
                  <v-text-field
                  v-model="manfield.remark"
                    label="備註"
                    clearable outlined
                    placeholder="remark"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="manmode=='edit'"
                  :disabled="!manisEditing"
                  color="error"
                  @click="manudelete"
                >
                  確認刪除
                </v-btn>
                <v-btn
                  v-if="manmode=='edit'"
                  :disabled="!manisEditing"
                  color="primary"
                  @click="manuedit"
                >
                  確認修改
                </v-btn>
                <v-btn
                  v-if="manmode=='add'"
                  :disabled="!manisEditing"
                  color="primary"
                  @click="manusubmit"
                >
                  新增
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
              v-model="fic_idx"
              style="width"
              :items="feed_ingredient_category"
              item-text="name_ch"
              item-value="id"
              dense
              label="選擇成份類別"
              solo
              clearable
              @change="ficselect"
            ><v-icon slot="prepend" @click="getficdata">mdi-reload</v-icon></v-autocomplete>
            成份清單<v-chip class="mx-3" v-for="n in fing.filter(x=>x.feed_ingredient_category_id==fic_idx)" :key="n.id">#{{n.name}}</v-chip>
             <v-card class="mt-1">
              <v-toolbar flat color="lightblue" dark>
                <v-icon class="mx-2">mdi-food-drumstick</v-icon>
                <v-toolbar-title class="font-weight-light">
                  成份類別{{feed_ingredient_category.filter(x => x.id == fic_idx).length > 0
                      ? "：" + feed_ingredient_category.filter(x => x.id == fic_idx)[0].name_ch
                      : (ficisEditing)?"：新增模式":""}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="ficisEditing = !ficisEditing"
                  v-if="ficmode == 'add'"
                >
                  <v-icon v-if="ficisEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-playlist-plus
                  </v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="ficisEditing = !ficisEditing"
                  v-if="ficmode == 'edit'"
                >
                  <v-icon v-if="ficisEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form ref="ficform" v-model="ficvalid" :disabled="!ficisEditing">
                  <v-text-field
                    v-model="ficfield.name_ch"
                    filled
                    clearable
                    placeholder="糖,水,..."
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">類別名稱</span></v-text-field>
                  <v-text-field
                    v-model="ficfield.name_en"
                    filled
                    clearable
                    placeholder="suger,water,..."
                    :rules="rules.require"
                    :disabled="ficisEditing && ficmode=='edit'"
                  ><span slot="prepend" style="width:100px;">類別名稱(英)</span></v-text-field>
                  <v-switch
                        v-model="ficfield.is_main"
                        :label="`主類別(主成份)/一般類別(次成份)`"
                    ></v-switch>
                    
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="ficmode=='edit'"
                  :disabled="!ficisEditing"
                  color="error"
                  @click="ficdelete"
                >
                  確認刪除
                </v-btn>
                <v-btn
                  v-if="ficmode=='edit'"
                  :disabled="!ficisEditing"
                  color="primary"
                  @click="ficedit"
                >
                  確認修改
                </v-btn>
                <v-btn
                  color="primary"
                  @click="ficsubmit"
                  v-if="ficmode=='add'"
                   :disabled="!ficisEditing"
                >
                  新增
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" class="my-2">
              <v-card :disabled="fic_idx==null || fic_idx == undefined">
              <v-toolbar flat color="lightblue" dark>
                <v-icon class="mx-2">mdi-soy-sauce</v-icon>
                <v-toolbar-title class="font-weight-light">
                  成份{{(fingisEditing)?"：新增模式":""}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="fingisEditing = !fingisEditing"
                  v-if="fingmode=='add'"
                >
                  <v-icon v-if="fingisEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-water-plus
                  </v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="fingisEditing = !fingisEditing"
                  v-if="fingmode=='edit'"
                >
                  <v-icon v-if="fingisEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form ref="fingform" v-model="fingvalid" :disabled="!fingisEditing">
                  <v-text-field v-model="fingfield.feed_ingredient_category_id" dense placeholder="feed_ingredient_category_id" filled :rules="rules.require" :disabled="true">
                  <span slot="prepend" style="width:100px;">正在新增(之後不show)</span>
                  </v-text-field>
                  <v-text-field
                    v-model="fingfield.name"
                    filled
                    clearable
                    placeholder="1號料_cn15,1號料_cn22,..."
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">成份名稱</span></v-text-field>
                  <v-text-field
                    v-model="fingfield.item_no"
                    filled
                    clearable
                    placeholder="10001,10002..."
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">飼料成分產編</span></v-text-field>
                  <v-autocomplete
                    style="width"
                    dense
                    v-model="fingfield.manufacturer_id"
                    :items="manu"
                    item-text="name_ch"
                    item-value="id"
                    label="選擇廠商"
                    filled
                    clearable
                  ><span slot="prepend" style="width:100px;">廠商</span></v-autocomplete>
                  <v-text-field
                    v-model="fingfield.price"
                    filled
                    clearable
                    placeholder="15,20,150,..."
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">價格/單位數量</span></v-text-field>
                  <v-text-field
                    v-model="fingfield.unit"
                    filled
                    clearable
                    placeholder="個,包,盒..."
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">單位</span></v-text-field>
                  <v-text-field
                    v-model="fingfield.unit_quantity"
                    filled
                    clearable
                    placeholder="100,6,50,..."
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">單位數量</span></v-text-field>
                  <!-- <v-text-field
                    label="備註"
                    clearable outlined
                    placeholder="memo"
                  ></v-text-field> -->
                  <v-divider></v-divider>
                  <h2 class="my-2">詳細內容
                      <v-btn class="mx-3"  x-small fab dark color="primary" @click="ingitemcrease('+')">+</v-btn>
                  </h2>
                  <v-autocomplete
                    v-model="fingparam"
                    :items="parmdata"
                    item-text="name_ch"
                    item-value="id"
                    dense
                    chips
                    deletable-chips
                    label="選擇參數內容"
                    filled
                    clearable
                    multiple
                    ><span slot="prepend" style="width:100px;"
                      >成份參數</span
                    ><v-btn slot="append-outer" x-small fab class="primary" @click="showparam">+</v-btn></v-autocomplete>
                    <v-row v-for="item in fingparam" :key="item">
                      <v-col cols="12" align-self="center">
                        <v-text-field filled dense clearable :rules="rules.require" placeholder="90%,0.85,...">
                          <span slot="prepend" style="width:50px;">{{item}}</span>
                        </v-text-field>
                      </v-col>
                    </v-row>
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
                <v-dialog v-model="dialog.param" width="400px">
                  <v-card>
                    <v-toolbar flat color="lightblue" dark dense>
                      <v-toolbar-title class="font-weight-light">
                        新增參數
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                      <v-form ref="parmform" v-model="parmvalid">
                      <v-card-text>
                        <v-text-field
                          v-model="parmfield.name_ch"
                          filled
                          clearable
                          placeholder="純度,粗蛋白率..."
                          :rules="rules.require"
                        ><span slot="prepend" style="width:100px;">參數(中文)</span></v-text-field>
                      <v-text-field
                          v-model="parmfield.name_en"
                          filled
                          clearable
                          placeholder="pure,..."
                          :rules="rules.require"
                        ><span slot="prepend" style="width:100px;">參數(英文)</span></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn dark color="primary" @click="parmsubmit">新增</v-btn>
                      </v-card-actions>
                    </v-form> 
                  </v-card>
                </v-dialog>
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
      <!-- 飼料資訊(套餐) -->
      <v-tab-item value="飼料設定(套餐)">
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
                <v-form ref="" v-model="manvalid">
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
                  :disabled="!manisEditing"
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
     
    </v-tabs-items>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
    return {
      rules: { require: [v => !!v || "*必要項目"],
               min: v => v.length >= 8 || '至少8個字符',
             },
      tablindex: "",
      manfield:{},
      manmode:'add',
      manisEditing:false,
      manu: [
        { name_ch: "廠商1", id: "1" },
        { name_ch: "廠商2", id: "2" }
      ],
      manuidx: -1,
      manvalid: true,
      //成份類別
      feed_ingredient_category: [
        { name_ch: "0號料_a餐", id: "1" },
        { name_ch: "0號料_b餐", id: "2" }
      ],
      ficvalid:true,
      fic_idx: "",
      ficmode:'add',
      ficisEditing:false,
      ficfield:{},
      //成份清單(detail)
      fing:[],
      fingvalid:true,
      fingidx:'',
      fingmode:'add',
      fingisEditing:false,
      fingfield:{},
      fingparam:[],//成份參數
      //---參數設定
      dialog:{
        param :false,
      },
      parmfield:{},
      parmvalid:true,
      parmdata:[],
      //---
      mingidx: "",
      //---
      comboidx:"",
      combo:[],
      //--
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
              name: "糖1",
              id: 2,
              other: [
                { name: "廠商", value: "全聯" },
                { name: "純度", value: "10" },
                { name: "C%", value: "11" }
              ]
            },
            {
              name: "糖2",
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
  async mounted() {
    await this.getmanudata();//取得廠商資料
    await this.getficdata();//取得成份類別
    await this.getfingdata();//取得成份清單
  },
  methods: {
    //選擇廠商
    manselect:function(){
      if (this.manu.filter(x => x.id == this.manuidx).length > 0) {
        //edit mode
        this.manmode='edit';
        this.manfield = this.manu.filter(x => x.id == this.manuidx)[0];
      }else{
        this.manmode='add';
        this.manfield = {};
      }
      this.manisEditing=false;//只要select change就關閉編輯
    },
    manopenaddEdit:function(){//manmode = add
      this.manisEditing = !this.manisEditing;
      this.manfield = {};//reset
    },
    //新增廠商
    manusubmit: async function() {
      console.log(this.manfield);
      let val = this.$refs.manform.validate();
      if (val) {
        //--
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/`;
        let parms = this.manfield;
        parms.created_user= this.$auth.$state.user.email;
        await this.$axios
          .post(url, parms)
          .then(res => {
            if (res.data == "新增成功") {
              //this.getdata();新增未必有選到所有選項
              this.$toast.success(`新增成功`, { duration: 2000 });
              this.manisEditing = false;
              this.manfield = {};
            } else {
              alert("新增失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("新增失敗!：" + error.message);
          })
          .finally(() => {
            //this.getdata();
          });
      }
    },
    //刪除廠商
    manudelete:async function(){
      let id = this.manfield["id"];
      let name = this.manfield["name_ch"];
       let url = `${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/${id}/`;
      if(confirm("是否刪除?-" + name)){
        await this.$axios
          .delete(url)
          .then(res => {
            if (res.data == "刪除成功") {
              this.$toast.success(`刪除成功`, { duration: 2000 });
            }else{
              this.$toast.error(`刪除失敗${ res.data}`, { duration: 2000 });
            }
          }
          ).catch(error => {
            alert("刪除失敗!：" + error.message);
          })
          .finally(() => {
            this.getmanudata();
          });

      }
    },
    // 修改廠商
    manuedit:async function(){
      console.log(this.manfield);
      let parms =  {};
      let id = this.manfield["id"];
      Object.assign(parms, this.manfield);
      delete parms["id"];//刪去不必要欄位
      delete parms["created_time"];
      delete parms["created_user"];
      delete parms["updated_time"];
      parms["updated_user"] = this.$auth.$state.user.email;
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/${id}/`;
      await this.$axios
          .patch(url, parms)
          .then(res => {
            if (res.data == "修改成功") {
              //this.getdata();新增未必有選到所有選項
              this.$toast.success(`修改成功`, { duration: 2000 });
              this.manisEditing = false;
              this.manuidx=null;
              this.manfield = {};
            } else {
              alert("修改失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("修改失敗!：" + error.message);
          })
          .finally(() => {
            this.getmanudata();
          });
      
    },
    //選擇成份類別
    ficselect:function(){
      if (this.feed_ingredient_category.filter(x => x.id == this.fic_idx).length > 0) {
        //edit mode
        this.ficmode='edit';
        this.ficfield = this.feed_ingredient_category.filter(x => x.id == this.fic_idx)[0];
        var tmpfic = this.feed_ingredient_category.filter(x => x.id == this.fic_idx)[0].id;
        var newid = _.cloneDeep(tmpfic);
        this.fingfield.feed_ingredient_category_id = newid;
        
      }else{
        this.ficmode='add';
        this.ficfield = {};
        this.fingfield.feed_ingredient_category_id = undefined;
      }
      this.ficisEditing=false;//只要select change就關閉編輯成份類別
      this.fingisEditing=false;//只要select change就關閉編輯成份清單
    },
    //取得廠商清單
    getmanudata:async function(){
      this.manuidx=null;//還原成未選
      this.manmode = 'add';//還原成add
      this.manfield={};//還原成空白
      this.manu = [];
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/`;
      await this.$axios
          .get(url)
          .then(res => {
            this.manu =res.data;
            // if (res.data == "新增成功") {
            //   //this.getdata();新增未必有選到所有選項
            //   this.$toast.success(`新增成功`, { duration: 2000 });
            //   this.manisEditing = false;
            //   this.manfield = {};
            // } else {
            //   alert("新增失敗!：" + res.data);
            // }
            console.log("取得廠商資料API:" + res.request.responseURL);
          })
          .catch(error => {
            this.$toast.error(`取得廠商資料失敗:${error}`, { duration: 2000 });
          })
          .finally(() => {
            //this.getdata();
          });
      
    },
    //刪除成份類別
    ficdelete:async function(){
      let id = this.ficfield["id"];
      let name = this.ficfield["name_ch"];
       let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/${id}/`;
      if(confirm("是否刪除?-" + name)){
        await this.$axios
          .delete(url)
          .then(res => {
            if (res.data == "刪除成功") {
              this.$toast.success(`刪除成功`, { duration: 2000 });
            }else{
              this.$toast.error(`刪除失敗${ res.data}`, { duration: 2000 });
            }
          }
          ).catch(error => {
            alert("刪除失敗!：" + error.message);
          })
          .finally(() => {
            this.getficdata();
          });

      }
    },
    //修改成份類別
    ficedit:async function(){
      console.log(this.ficfield);
      let parms =  {};
      let id = this.ficfield["id"];
      Object.assign(parms, this.ficfield);
      delete parms["id"];//刪去不必要欄位
      delete parms["created_time"];
      delete parms["created_user"];
      delete parms["updated_time"];
      parms["updated_user"] = this.$auth.$state.user.email;
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/${id}/`;
      await this.$axios
          .patch(url, parms)
          .then(res => {
            if (res.data == "修改成功") {
              //this.getdata();新增未必有選到所有選項
              this.$toast.success(`修改成功`, { duration: 2000 });
              this.ficisEditing = false;
              this.fic_idx=null;
              this.ficfield = {};
            } else {
              alert("修改失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("修改失敗!：" + error.message);
          })
          .finally(() => {
            this.getficdata();
          });
    },
    //新增成份類別清單
    ficsubmit:async function(){
      let val = this.$refs.ficform.validate();
      if (val) {
        //--
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/`;
        let parms = this.ficfield;
        parms.created_user= this.$auth.$state.user.email;
        await this.$axios
          .post(url, parms)
          .then(res => {
            if (res.data == "新增成功") {
              //this.getdata();新增未必有選到所有選項
              this.$toast.success(`新增成功`, { duration: 2000 });
              this.ficisEditing = false;
              this.ficfield = {};
            } else {
              alert("新增失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("新增失敗!：" + error.message);
          })
          .finally(() => {
            this.getficdata();
          });
      }
    },
    //取得成份類別清單
    getficdata:async function(){
      this.fic_idx=null;//還原成未選
      this.feed_ingredient_category = [];
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/`;
      await this.$axios
          .get(url)
          .then(res => {
            this.feed_ingredient_category =res.data;
            console.log("取得成份類別清單API:" + res.request.responseURL);
          })
          .catch(error => {
            this.$toast.error(`取得成份類別清單失敗:${error}`, { duration: 2000 });
          })
          .finally(() => {
            //this.getdata();
          });
      
    
    },
    //取得成份清單
    getfingdata:async function(){
      // this.fiidx=null;//還原成未選
      this.fing = [];
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/`;
       await this.$axios
          .get(url)
          .then(res => {
            this.fing =res.data;
            console.log("取得成份清單API:" + res.request.responseURL);
          })
          .catch(error => {
            this.$toast.error(`取得成份清單失敗:${error}`, { duration: 2000 });
          })
          .finally(() => {
            //this.getdata();
          });
    },
    showparam:function(){
      this.parmfield = {};
      this.dialog.param = true;
    },
    //取得參數清單
    getparmdata:async function(){
      this.parmdata = [];
       let url = `${this.$store.state.mydata.gobal_api.apiUrl}/parameter/`;
       await this.$axios
          .get(url)
          .then(res => {
            this.parmdata =res.data;
            console.log("取得參數清單API:" + res.request.responseURL);
          })
          .catch(error => {
            this.$toast.error(`取得參數清單失敗:${error}`, { duration: 2000 });
          })
          .finally(() => {
          });
    },
    //新增參數
    parmsubmit:async function(){
      let val = this.$refs.parmform.validate();
      if(val){
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/parameter/`;
        let parms = this.parmfield;
        parms.created_user= this.$auth.$state.user.email;
        await this.$axios
          .post(url, parms)
          .then(res => {
            if (res.data == "新增成功") {
              //this.getdata();新增未必有選到所有選項
              this.parmfield = {};
              this.dialog.param=false;
              this.$toast.success(`新增成功`, { duration: 2000 });
            } else {
              this.$toast.error(`新增失敗:${res.data}`, { duration: 2000 });
            }
          })
          .catch(error => {
            alert("新增失敗!：" + error.message);
          })
          .finally(() => {
            this.getparmdata();
          });
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
