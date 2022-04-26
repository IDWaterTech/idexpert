<template>
  <div>
    <h2 style="color:white;">飼料表設定</h2>
    <v-tabs v-model="tablindex" background-color="cardtitle" center-active dark>
      <v-tab :href="`#廠商設定`">廠商設定</v-tab>
      <v-tab :href="`#成份設定`">成份設定</v-tab>
      <v-tab :href="`#飼料設定(套餐)`">飼料設定(套餐)</v-tab>
    </v-tabs>
    <!-- tabe的主要內容 -->
    <v-tabs-items v-model="tablindex">
      <!-- 廠商設定 -->
      <v-tab-item value="廠商設定" class="tabitembg">
        <v-row class="mx-3 my-3 mt-3">
          <v-spacer></v-spacer>
          <v-col cols="12" sm="8" class="my-2">
            <v-autocomplete
              v-model="manuidx"
              style="width"
              :items="manu"
              item-text="name_ch"
              item-value="id"
              dense filled
              label="選擇廠商"
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
      <v-tab-item value="成份設定" class="tabitembg">
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
              filled
              clearable
              @change="ficselect"
            ><v-icon slot="prepend" @click="getficdata">mdi-reload</v-icon></v-autocomplete>
            成份清單
            <v-chip-group
              v-model="fingchip"
              active-class="primary--text"
              column
              @change="fingchipclick" 
            >
              <v-chip class="mx-3" v-for="n in fing.filter(x=>x.feed_ingredient_category_id==fic_idx)"
                      :key="n.id" :value="n.id">
                {{n.name}}</v-chip>
            </v-chip-group>
            
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
                  @click="ficdelete" small
                >
                  確認刪除
                </v-btn>
                <v-btn
                  v-if="ficmode=='edit'"
                  :disabled="!ficisEditing"
                  color="primary"
                  @click="ficedit" small
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
                  @click="fingeditchange"
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
                  <v-text-field v-show="false" v-model="fingfield.feed_ingredient_category_id" dense placeholder="feed_ingredient_category_id" filled :rules="rules.require" :disabled="true">
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
                    v-model.number="fingfield.price"
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
                    v-model.number="fingfield.unit_quantity"
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
                    ><v-btn slot="append-outer" x-small outlined dark fab color="primary" @click="showparam">+</v-btn></v-autocomplete>
                    <v-row v-for="item in fingparam" :key="item">
                      <v-col cols="12" align-self="center">
                        <v-text-field v-model="fingparamitem[item]" filled dense clearable :rules="rules.require" placeholder="90%,0.85,...">
                          <span slot="prepend" style="width:50px;">{{parmdata.filter(x=>x.id==item)[0].name_ch}}</span>
                        </v-text-field>
                      </v-col>
                    </v-row>
                </v-form>
                <!-- 新增參數視窗 -->
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
                  :disabled="!fingisEditing"
                  color="primary"
                  @click="fingsubmit"
                  v-if="fingmode=='add'"
                >
                  確定
                </v-btn>
                <v-btn
                  :disabled="!fingisEditing"
                  color="error"
                  small
                  v-if="fingmode=='edit'"
                  @click="fingdelete"
                >確認刪除</v-btn>
                <v-btn
                  :disabled="!fingisEditing"
                  color="primary"
                  small
                  @click="fingedit"
                  v-if="fingmode=='edit'"
                >確認修改</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
      <!-- 飼料資訊(套餐) -->
      <v-tab-item value="飼料設定(套餐)" class="tabitmbg">
        <v-row class="mx-3 my-3 mt-3">
          <v-spacer></v-spacer>
          <v-col cols="12" sm="10" class="my-2">
            <!-- 選擇飼料(套餐) -->
            <v-autocomplete
              v-model="comboidx"
              style="width"
              :items="combo"
              item-text="name_ch"
              item-value="id"
              dense
              label="選擇飼料(套餐)"
              filled
              clearable
              @change="comboselect"
            ><v-icon slot="prepend" @click="getcombodata">mdi-reload</v-icon></v-autocomplete>
            <v-card>
              <v-toolbar flat color="lightblue" dark>
                <v-icon class="mx-2">mdi-food</v-icon>
                <v-toolbar-title class="font-weight-light">
                  飼料資訊(套餐){{
                    combo.filter(x => x.id == comboidx).length > 0
                      ? "：" + combo.filter(x => x.id == comboidx)[0].name_ch
                      : ""
                  }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="()=>{main_formula={};sub_formula = {},comboisEditing = !comboisEditing;}"
                  v-if="combo.filter(x => x.id == comboidx).length == 0"
                >
                  <v-icon v-if="comboisEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-hamburger-plus
                  </v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  fab
                  small
                  @click="()=>{comboisEditing = !comboisEditing;}"
                  v-if="combo.filter(x => x.id == comboidx).length > 0"
                >
                  <v-icon v-if="comboisEditing">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form ref="comboform" v-model="combovalid" :disabled="!comboisEditing">
                  <v-text-field
                    v-model="combofield.name_ch"
                    filled
                    clearable
                    placeholder="1號套餐"
                    :rules="rules.require"
                  ><span slot="prepend" style="width:100px;">飼料名稱</span></v-text-field>
                  <v-text-field
                    v-model="combofield.name_en"
                    filled
                    clearable
                    placeholder="Meal No.1"
                    :rules="rules.require"
                    :disabled="combomode=='edit'"
                  ><span slot="prepend" style="width:100px;">飼料名稱(英)</span></v-text-field>
                  <v-text-field
                    v-model="combofield.remark"
                    label="備註"
                    clearable outlined
                    placeholder="memo"
                  ></v-text-field>
                  <v-divider></v-divider>
                  <h2 class="my-2">配方</h2>
                  主成份
                  <v-autocomplete
                    v-model="combofield.main_items"
                    style="width"
                    :items="ficwithdetail_main"
                    item-text="name"
                    item-value="id"
                    dense
                    chips
                    deletable-chips
                    label="選擇主成份"
                    filled
                    clearable
                    multiple
                    @change="mainchange"
                    ><span slot="prepend" style="width:50px;"
                      >主成份</span
                    ></v-autocomplete
                  >
                  <v-row v-for="item in combofield.main_items" :key="item.id">
                    <v-col cols="12" sm="4" >
                      <v-alert
                        outlined dense
                        color="purple"
                      >
                        <div class="body-1">
                          {{ficwithdetail_main.filter(x => x.id == item)[0].name}}
                        
                        <v-chip v-for="parmitem in ficwithdetail_main.filter(x => x.id == item)[0].parameters"
                        :key="parmitem.id" small
                        >{{`${parmitem.name}:${parmitem.value}`}}</v-chip>
                        <span v-if="ficwithdetail_main.filter(x => x.id == item)[0].hasOwnProperty('parameters') == false" style="font-size:12px;">
                            無相關參數資料
                          </span>
                        </div>
                      </v-alert>
                    </v-col>
                    <v-col cols="12" sm="8">
                        <v-text-field
                        v-model="main_formula[item]"
                        filled
                        dense
                        clearable
                        placeholder="公式範例：100%,90%,0.5,0.8...."
                        :rules="rules.require"
                      ></v-text-field>
                      <v-text-field
                        v-model="main_formula_remark[item]"
                        filled
                        dense
                        clearable
                        placeholder="備註範例：該混料只需8成"
                      ></v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>
                  </v-row>
                   <!-- 次成份 -->
                  <v-autocomplete
                    v-model="combofield.sub_items"
                    style="width"
                    :items="ficwithdetail_sub"
                    item-text="name"
                    item-value="id"
                    dense
                    chips
                    deletable-chips
                    label="選擇次成份"
                    filled
                    clearable
                    multiple
                    @change="subchange"
                    ><span slot="prepend" style="width:50px;"
                      >次成份</span
                    ></v-autocomplete
                  >
                  <span v-show="combofield.sub_items && combofield.sub_items.length>0">比例</span>
                  
                  <v-row dense   v-for="item in combofield.sub_items" :key="item" justify="center"  align="center" align-content="center">
                    <v-col cols="2">
                      <div
                        class="subtitle-1 text-center mb-3"
                        style="border: 2px grey solid;"
                      >
                        {{ficwithdetail_sub.filter(x=>x.id==item)[0].name}}
                      </div>
                    </v-col>
                    <v-col cols="2" class="algin-center text-center mb-3">
                        = sum(主成份) *
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        v-model="sub_formula[item]"
                        filled
                        dense
                        clearable
                        placeholder="範例：*0.5*1.5*300%*1(2+50)"
                        :rules="rules.require"
                      ></v-text-field>
                       <v-text-field
                        v-model="sub_formula_remark[item]"
                        filled
                        dense
                        clearable
                        placeholder="公式備註：粗蛋白率*CN比*含氮率"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-0">
                      <v-chip v-for="parmitem in ficwithdetail_sub.filter(x => x.id == item)[0].parameters"
                        :key="parmitem.id" small
                        >{{`${parmitem.name}:${parmitem.value}`}}</v-chip>
                     </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!comboisEditing"
                  color="primary"
                  @click="combosubmit"
                  v-if="combomode=='add'"
                >
                  確定
                </v-btn>
                <!-- 編輯模式 -->
                <v-btn
                  :disabled="!comboisEditing"
                  color="error" tile
                  @click="combodelete"
                  v-if="combomode=='edit'"
                >
                  確認刪除
                </v-btn>
                <v-btn
                  :disabled="!comboisEditing"
                  color="primary" tile
                  @click="comboedit"
                  v-if="combomode=='edit'"
                >
                  修改送出
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
      fingparamitem:{},
      fingchip:{},//成份清單  
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
      //---套餐清單(飼料設定)
      combofield:{},
      comboidx:"",
      combo:[],
      comboisEditing:false,
      combovalid:true,
      main_formula:{},
      main_formula_remark:{},//主成份公式備註
      sub_formula:{},//次成份公式
      sub_formula_remark:{},//次成份公式備註
      combomode:'add',
      //--
      isEditing: false,
      //--成份類別及細項 清單
      ficwithdetail:[]
    };
  },
  async mounted() {
    await this.getmanudata();//取得廠商資料
    await this.getficdata();//取得成份類別
    await this.getfingdata();//取得成份清單
    await this.getficwithdetaildata();//取得成份類別及細項
    await this.getcombodata();//取得套餐清單(飼料設定)
  },
  computed: {
    ficwithdetail_main:function(){
      // var oraitems  = _.cloneDeep(this.ficwithdetail['main_items']);
      var oraitems  = this.ficwithdetail['main_items'];
      var items = [];
      if (oraitems!= undefined && oraitems.length>0) {
        oraitems.forEach(element => {
        items.push({ header: element.name,id:`${element.name}_${element.id}` });
        //delete element.items.parameters;參數細項內容
        items.push(...element.items)
        items.push({ divider: true })
      }); 
      }
      return items;
    },
    ficwithdetail_sub:function(){
          //var oraitems  = _.cloneDeep(this.ficwithdetail['sub_items']);
          var oraitems  = this.ficwithdetail['sub_items'];
          var items = [];
          if (oraitems!= undefined && oraitems.length>0) {
            oraitems.forEach(element => {
            items.push({ header: element.name,id:`${element.name}_${element.id}` });
            //delete element.items.parameters;參數細項內容
            items.push(...element.items)
            items.push({ divider: true })
          }); 
          }
          return items;
        }
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
      this.fingparam = [],//成份參數
      this.ficisEditing=false;//只要select change就關閉編輯成份類別
      this.fingisEditing=false;//只要select change就關閉編輯成份清單
      this.getparmdata();//參數清單
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
              this.ficisEditing = false;
              this.fic_idx=null;
              this.ficfield = {};
              this.ficmode='add';//回到新增模式
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
        if(this.ficfield.hasOwnProperty("is_main")==false){
          parms["is_main"]=false;
          }
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
    //取得成份類別及細項
    getficwithdetaildata:async function(){
      // this.ficwithdetail = [];
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-category-and-items/`;
      await this.$axios
          .get(url)
          .then(res => {
            this.ficwithdetail =res.data;
            console.log("取得成份類別及細項API:" + res.request.responseURL);
          })
          .catch(error => {
            this.ficwithdetail = [];
            this.$toast.error(`取得成份類別及細項失敗:${error}`, { duration: 2000 });
          })
          .finally(() => {
            //this.getdata();
          });
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
    mainchange:async function(){
      var formula={};
        var formula_remark={};
        for (let i = 0; i < this.combofield.main_items.length; i++) {
         var parmid = this.combofield.main_items[i];
          formula[parmid] = this.main_formula[parmid];
          formula_remark[parmid] = this.main_formula[parmid];
        }
        //{6: '0.8*154'} 糖1的id:糖1的公式
        this.main_formula = formula;
        this.main_formula_remark = formula_remark;
    },
    subchange:async function(){
      // var items = Object.keys(this.sub_formula);
        var formula={};
        var formula_remark={};
        for (let i = 0; i < this.combofield.sub_items.length; i++) {
         var parmid = this.combofield.sub_items[i];
          formula[parmid] = this.sub_formula[parmid];
          formula_remark[parmid] = this.sub_formula[parmid];
        }
        //{6: '0.8*154'} 糖1的id:糖1的公式
        this.sub_formula = formula;
        this.sub_formula_remark = formula_remark;
    },
    //編輯套餐清單(飼料設定)
    comboedit:async function(){
      let val = this.$refs.comboform.validate();
      if(val){
        var id = this.combofield.id;
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/${id}/`;
        var parms = _.cloneDeep(this.combofield);
        //主成份
        delete parms.main_items;
        var main = [];
        // this.combofield.main_items.forEach(element => {
        //   main.push({id:element});
        // });
        for (let i = 0; i < Object.keys(this.main_formula).length; i++) {
          const id = Object.keys(this.main_formula)[i];
          const value  = this.main_formula[id];
          const remark = this.main_formula_remark[id];
          main.push({id:id,formula:value,remark:remark});
        }
        parms.main_items =  main;
        //次成份
        delete parms.sub_items;
        var sub = [];
        for (let i = 0; i < Object.keys(this.sub_formula).length; i++) {
          const id = Object.keys(this.sub_formula)[i];
          const value  = this.sub_formula[id];
          const remark = this.sub_formula_remark[id];
          sub.push({id:id,formula:value,remark:remark});
          
        }
        parms.sub_items = sub;
        parms.updated_user= this.$auth.$state.user.email;
        //刪掉不要的
        delete parms.created_time;
        delete parms.created_user;
        delete parms.id;
        delete parms.updated_time;

        await this.$axios
          .patch(url,parms)
          .then(res => {
            if(res.data=="修改成功"){
              this.$toast.success(`修改套餐清單(飼料設定)成功`, { duration: 2000 });
              this.combofield = {};
              this.comboidx = null;
              this.comboisEditing = false;
              this.combomode='add';
              this.getcombodata();
              console.log("修改套餐清單(飼料設定)API:" + res.request.responseURL);
            }else{
              this.$toast.error(`修改套餐清單(飼料設定)失敗:${res.data}`, { duration: 2000 });
            }
          })
          .catch(error => {
            this.$toast.error(`修改套餐清單(飼料設定)失敗:${error}`, { duration: 2000 });
          })
          .finally(() => {
            
          });
      }
      
      
    },
    //刪除套餐清單(飼料設定)
    combodelete:async function(){
      var id = this.combofield.id;
      var name = this.combofield.name_ch;
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/${id}/`;
      if(confirm("是否刪除?-" + name)){
        await this.$axios
          .delete(url)
          .then(res => {
            if (res.data == "刪除成功") {
              this.$toast.success(`刪除成功`, { duration: 2000 });
              this.comboisEditing = false;
              this.comboidx=null;
              this.combofield = {};
              this.combomode='add';//回到新增模式
            }else{
              this.$toast.error(`刪除失敗${ res.data}`, { duration: 2000 });
            }
          }
          ).catch(error => {
            alert("刪除失敗!：" + error.message);
          })
          .finally(() => {
            this.getcombodata();
          });

      }
    },
    //選擇套餐清單(飼料設定)
    comboselect:async function(){
      if(this.combo.filter(x => x.id == this.comboidx).length>0){
        //edit mode
        this.combomode= 'edit';
        this.combofield = _.cloneDeep(this.combo.filter(x => x.id == this.comboidx)[0]);
        //主成份
        var main=[];
        var m_formula = {};
        var m_formula_remark = {};
        this.combofield.main_items.forEach(element => {
          main.push(element.id);
          m_formula[element.id]=element.formula;//公式
          m_formula_remark[element.id] =element.remark;//公式備註
        });
        this.combofield.main_items = main;
        this.main_formula = m_formula;
        this.main_formula_remark = m_formula_remark;
        //次成份
        //sub_formula
        var sub_items  = [];
        var sub = {};
        var sub_fla_remark = {};
        this.combofield.sub_items.forEach(element => {
          sub_items.push(element.id);
          //公式
          sub[element.id]=element.formula;
          //公式備註
          sub_fla_remark[element.id] = element.remark;
        });
        this.combofield.sub_items = sub_items;
        this.sub_formula = sub;
        this.sub_formula_remark = sub_fla_remark;
      }else{
        //add mode
        this.combomode= 'add';
        this.combofield={};
      }
      // if (this.feed_ingredient_category.filter(x => x.id == this.fic_idx).length > 0) {
      //   //edit mode
      //   this.ficmode='edit';
      //   this.ficfield = this.feed_ingredient_category.filter(x => x.id == this.fic_idx)[0];
      //   var tmpfic = this.feed_ingredient_category.filter(x => x.id == this.fic_idx)[0].id;
      //   var newid = _.cloneDeep(tmpfic);
      //   this.fingfield.feed_ingredient_category_id = newid;
        
      // }else{
      //   this.ficmode='add';
      //   this.ficfield = {};
      //   this.fingfield.feed_ingredient_category_id = undefined;
      // }
      // this.fingparam = [],//成份參數
      // this.ficisEditing=false;//只要select change就關閉編輯成份類別
      this.comboisEditing=false;//只要select change就關閉編輯套餐清單
      // this.getparmdata();//參數清單
    },
    //新增套餐清單(飼料設定)
    combosubmit:async function(){
      let val = this.$refs.comboform.validate();
      if(val){
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/`;
        var parms = _.cloneDeep(this.combofield);
        //主成份
        delete parms.main_items;
        var main = [];
        // this.combofield.main_items.forEach(element => {
        //   main.push({id:element});
        // });
        for (let i = 0; i < Object.keys(this.main_formula).length; i++) {
          const id = Object.keys(this.main_formula)[i];
          const value  = this.main_formula[id];
          const remark = this.main_formula_remark[id];
          main.push({id:id,formula:value,remark:remark});
        }
        parms.main_items =  main;
        //次成份
        delete parms.sub_items;
        var sub = [];
        for (let i = 0; i < Object.keys(this.sub_formula).length; i++) {
          const id = Object.keys(this.sub_formula)[i];
          const value  = this.sub_formula[id];
          const remark = this.sub_formula_remark[id];
          sub.push({id:id,formula:value,remark:remark});
          
        }
        parms.sub_items = sub;
        parms.created_user= this.$auth.$state.user.email;

        await this.$axios
          .post(url,parms)
          .then(res => {
            if(res.data=="新增成功"){
              this.$toast.success(`新增套餐清單(飼料設定)成功`, { duration: 2000 });
              this.combofield = {};
              this.comboidx = null;
              this.comboisEditing = false;
              this.getcombodata();
              console.log("新增套餐清單(飼料設定)API:" + res.request.responseURL);
            }else{
              this.$toast.error(`新增套餐清單(飼料設定)失敗:${res.data}`, { duration: 2000 });
            }
          })
          .catch(error => {
            this.$toast.error(`新增套餐清單(飼料設定)失敗:${error}`, { duration: 2000 });
          })
          .finally(() => {
            
          }); 

      }
      
    },
    //取得套餐清單(飼料設定)
    getcombodata:async function(){
      this.combo=[];
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/`;
      await this.$axios
          .get(url)
          .then(res => {
            this.combo =res.data;
            this.comboidx=null;
            this.combofield={};
            console.log("取得得套餐清單(飼料設定)API:" + res.request.responseURL);
          })
          .catch(error => {
            this.$toast.error(`取得得套餐清單(飼料設定)失敗:${error}`, { duration: 2000 });
          })
          .finally(() => {
            //this.getdata();
          }); 
    },
    //成份編輯狀態改變
    fingeditchange:function(){
      this.fingisEditing = !this.fingisEditing;
      if(this.fingisEditing==false){
        this.fingfield={};
      }
    },
    //成份清單，單一項目被選到
    fingchipclick:function(){
      console.log(this.fingchip);
      if (this.fingchip==null || this.fingchip == undefined) {
        this.fingmode = 'add';
        this.fingfield = {};
      }else{
        this.fingmode = 'edit';
        var parms = _.cloneDeep(this.fing.filter(x=>x.id==this.fingchip)[0]);
        // this.fingfield.name = this.fing[this.fingchip].name;
        delete parms["created_time"];//刪去不必要欄位
        delete parms["created_user"];
        delete parms["updated_user"];
        delete parms["updated_time"];
        this.fingfield = parms;
        // parms["parameters"] = 
          //參數下拉清單 - 重新指定
        this.fingparam =  parms["parameters"].map(x=>x.id);
         this.fingparamitem = {};
        this.fingparam.forEach(element => {
          this.fingparamitem[element] = parms["parameters"].filter(x=>x.id==element)[0].value;
        });
      }
    },
    //編輯成份
    fingedit:async function(){
      console.log(this.fingfield);
      let parameters =[];
      this.fingparam.forEach(element => {
        parameters.push({"id":element,"value":this.fingparamitem[element]});
      });
      this.fingfield.parameters = parameters;
      let parms = _.cloneDeep(this.fingfield);
      parms.updated_user= this.$auth.$state.user.email;   
      let val = this.$refs.fingform.validate();
      if (val) {
        let id = parms["id"];
        delete parms["id"];
        
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/${id}/  `; 
        await this.$axios
          .patch(url, parms)
          .then(res => {
            if (res.data == "修改成功") {
              this.$toast.success(`新增成功`, { duration: 2000 });
              this.fingfield = {};
              this.fingisEditing = false;
              this.fingchip=null;
            } else {
              alert("修改失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("新增失敗!：" + error.message);
          })
          .finally(() => {
            this.getfingdata();//成份清單
            this.getficwithdetaildata();//取得成份類別及細項
          });
      }
    },
    //刪除成份
    fingdelete:async function(){
      let id = this.fingfield["id"];
      let name = this.fingfield["name"];
       let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/${id}/`;
      if(confirm("是否刪除?-" + name)){
        await this.$axios
          .delete(url)
          .then(res => {
            if (res.data == "刪除成功") {
              this.$toast.success(`刪除成功`, { duration: 2000 });
              this.fingfield = {};
              this.fingisEditing = false;
            }else{
              this.$toast.error(`刪除失敗${ res.data}`, { duration: 2000 });
            }
          }
          ).catch(error => {
            alert("刪除失敗!：" + error.message);
          })
          .finally(() => {
            this.getfingdata();//成份清單
            this.getficwithdetaildata();//取得成份類別及細項
          });

      }
    },
    //新增成份
    fingsubmit:async function(){
      
      let parameters =[];
      this.fingparam.forEach(element => {
        parameters.push({"id":element,"value":this.fingparamitem[element]});
      });
      this.fingfield.parameters = parameters;
      console.log(this.fingfield);
      let val = this.$refs.fingform.validate();
      if (val) {
        this.fingfield.created_user = this.$auth.$state.user.email;
        //--
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/`;
        let parms = this.fingfield;
        parms.created_user= this.$auth.$state.user.email;
        await this.$axios
          .post(url, parms)
          .then(res => {
            if (res.data == "新增成功") {
              this.$toast.success(`新增成功`, { duration: 2000 });
              this.fingfield = {};
              this.fingisEditing = false;
            } else {
              alert("新增失敗!：" + res.data);
            }
          })
          .catch(error => {
            alert("新增失敗!：" + error.message);
          })
          .finally(() => {
            this.getfingdata();
          });
      }
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
    //顯示參數視窗
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
      // getRnd:function(){
      //     return Math.floor(Math.random() * 1000);
      // },
  },
   async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
  }
};
</script>
<style scoped>
.tabitembg{
   background-color:#FAFAFA;
}
</style>