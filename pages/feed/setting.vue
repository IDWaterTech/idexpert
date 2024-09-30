<template>
  <div>
    <v-card class="bg-card">
      <v-overlay :value="!isLoading" :absolute="true">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <div class="content" style="padding-left: 0;padding-top:0;padding-bottom: 0;">
        <div class="result">
          <v-row style="margin-bottom: 8px;">
            <v-col cols="12">
              <div class="header-bar" style="margin-bottom: 16px;">
                <v-tabs v-model="tablindex" show-arrows @change="changeTabs">
                  <v-tab :href="`#廠商設定`">廠商設定</v-tab>
                  <v-tab :href="`#成份設定`">成份設定</v-tab>
                  <v-tab :href="`#套餐設定`">套餐設定</v-tab>
                </v-tabs>
              </div>
              <!-- {{ this.manuFilterData }} -->
              <!-- {{ manu }} -->
              <v-tabs-items v-model="tablindex">
                <!-- 廠商設定 -->
                <v-tab-item value="廠商設定">
                  <div class="search">
                    <v-row>
                      <v-col cols="7" md="3" sm="6" style="padding: 0;padding-left: 8px;">
                          <v-autocomplete v-model="manuidx" hide-details dense filled clearable :items="manu" placeholder="選擇廠商" item-text="name_ch" item-value="id" @change="manselect" style="min-width: 200px;">
                    
                          </v-autocomplete>
                      </v-col>
                      <v-col cols="5" md="3" sm="6" style="padding: 0;">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                              <button class="btn-icon just-icon" @click="getmanudata" v-bind="attrs" v-on="on">
                                <v-icon style="font-size: 24px;">mdi-reload</v-icon>
                              </button>
                          </template>
                          <span>重新整理</span>
                        </v-tooltip>
                        
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                              <button class="btn-icon green" @click="openAdd" v-bind="attrs" v-on="on">
                                <v-icon>mdi-plus</v-icon>
                              </button>
                          </template>
                          <span>新增廠商</span>
                        </v-tooltip>
                        <!-- <v-btn class="btn-icon just-icon" @click="getmanudata">
                            <v-icon style="font-size: 24px;">mdi-reload</v-icon>
                        </v-btn> -->
                        <!-- <v-btn class="btn-icon green" @click="openAdd">
                            <v-icon style="font-size: 24px;">mdi-plus</v-icon>
                        </v-btn> -->
                      </v-col>
                    </v-row>
                  </div>
                  <!-- <div class="content"> -->
                    <div class="result">
                      <v-card class="result-card">
                        <div class="card-title">
                          <div class="title">
                            <v-card-title style="width: 100%;">廠商資訊</v-card-title>
                            <!-- <div class="chevron" style="display: flex;align-items: center;margin-left: 8px;">
                              <v-btn class="btn-secondary green" @click="openAdd" style="padding: 0 8px;">
                                  <v-icon>mdi-plus</v-icon>新增廠商
                              </v-btn>
                            </div> -->
                          </div>
                        </div>
                        <div v-if="tablindex == '廠商設定'" class="content">
                          <v-data-table light 
                            :headers="manuHeaders"
                            :items="manuFilterData" dense
                            :id="'table-manu'"
                            hide-default-footer
                            disable-pagination
                            no-data-text="查無資料"
                            fixed-header
                            maxHeight="55vh"
                            style="height: 55vh;overflow-y: scroll;"
                            class="data-table bg-transparent">
                            <template  v-slot:[`item.actions`]="{item}">
                                  <v-tooltip bottom>
                                      <template v-slot:activator="{ on, attrs }">
                                          <button class="btn-icon" @click="openEdit(item.id)" v-bind="attrs" v-on="on">
                                              <v-icon>mdi-pencil</v-icon>
                                          </button>
                                      </template>
                                      <span>修改</span>
                                  </v-tooltip>
                                  <v-tooltip bottom>
                                      <template v-slot:activator="{ on, attrs }">
                                          <button class="btn-icon delete" @click="manudelete(item.id)" v-bind="attrs" v-on="on">
                                              <v-icon>mdi-trash-can</v-icon>
                                          </button>
                                      </template>
                                      <span>刪除</span>
                                  </v-tooltip>
                              </template>
                          </v-data-table>
                        </div>
                      </v-card>
                    </div>
                  <!-- </div> -->
                </v-tab-item>
                
                <!-- 成份設定 -->
                <v-tab-item value="成份設定">
                  <div class="search">
                    <v-row>
                      <v-col cols="12" lg="3" md="3" sm="6" class="flex-align-center" style="padding: 0;padding-left: 8px;">
                        <v-chip v-if="fic_idx&&fic_idx!==null"
                            :color="`${nowtag.is_main?'#408FBC':'#BFCBD2'}`"
                            style="font-size: 12px;margin: 2px;"
                            :style="{'color':`${nowtag.is_main?'#fff':'#00324E'}`}"
                          >{{ (nowtag.is_main)?'主':'次' }}</v-chip>
                          <v-chip v-if="fic_idx&&fic_idx!==null"
                            :color="`${nowtag.is_feed?'#7FB4D2':'#7F98A6'}`"
                            style="font-size: 12px;margin: 2px;"
                            :style="{'color':`${nowtag.is_feed?'#fff':'#fff'}`}"
                          >{{ (nowtag.is_feed)?'餌':'料' }}</v-chip>
                          <v-autocomplete v-model="fic_idx" hide-details dense filled clearable placeholder="選擇成份類別" :items="feed_ingredient_category" 
                            @click:clear="
                              () => {
                                fingfield = {};
                              }
                            "
                            @change="ficselect" item-text="name_ch" item-value="id" style="min-width: 160px;">
                      
                          </v-autocomplete>
                          
                      </v-col>
                      
                      <v-col cols="12" lg="3" md="3" sm="6" style="padding: 0;">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                              <button class="btn-icon just-icon" @click="getficdata" v-bind="attrs" v-on="on">
                                <v-icon style="font-size: 24px;">mdi-reload</v-icon>
                              </button>
                          </template>
                          <span>重新整理</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                              <button class="btn-icon" :class="{'disabled':!fic_idx||fic_idx==null}" @click="ficmode = 'edit';ficEdit()" v-bind="attrs" v-on="on">
                                <v-icon>mdi-pencil</v-icon>
                              </button>
                          </template>
                          <span>編輯類別</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                              <button class="btn-icon green" @click="ficmode = 'add';ficEdit()" v-bind="attrs" v-on="on">
                                <v-icon>mdi-plus</v-icon>
                              </button>
                          </template>
                          <span>新增類別</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                              <button class="btn-icon delete" :class="{'disabled':!fic_idx||fic_idx==null}" @click="ficdelete" v-bind="attrs" v-on="on">
                                <v-icon>mdi-trash-can</v-icon>
                              </button>
                          </template>
                          <span>刪除類別</span>
                        </v-tooltip>
                        <!-- <v-btn class="btn-icon just-icon" @click="getficdata">
                            <v-icon style="font-size: 24px;">mdi-reload</v-icon>
                        </v-btn> -->
                        
                      </v-col>
                    </v-row>
                    
                      <v-form
                          ref="ficform"
                          v-model="ficvalid"
                          v-if="ficfield && ficEditOpen"
                        >
                        <v-row >
                          <!-- {{ ficfield }} -->
                          <v-col cols="12" md="3">
                            
                            <div class="search">
                              <v-text-field 
                                v-model="ficfield.name_ch" 
                                hide-details dense filled clearable 
                                label="類別名稱" :rules="rules.require"
                                :disabled="ficmode=='edit'">
                              </v-text-field>
                            </div>
                          </v-col>
                          <v-col cols="12" md="3">
                            <div class="search">
                              <v-text-field
                                v-model="ficfield.name_en"
                                filled
                                clearable
                                hide-details dense
                                label="類別名稱(英)"
                                :rules="rules.require"
                                :disabled="ficisEditing && ficmode == 'edit'"
                                ></v-text-field>
                            </div>
                          </v-col>
                          <v-col cols="12" md="2">
                            <div class="search">
                              <v-switch
                                v-model="ficfield.is_main"
                                color="#006AA6"
                                :label="`類別(次/主)：${(ficfield.is_main)?'主成份':'次成份'}`" dense hide-details inset
                                
                              ></v-switch>
                            </div>
                          </v-col>
                          <v-col cols="12" md="2">
                            <div class="search">
                              <v-switch
                                v-model="ficfield.is_feed"
                                color="#006AA6"
                                :label="`歸屬(料/餌)：${(ficfield.is_feed)?'投餌':'投料'}`" dense hide-details inset
                                
                              ></v-switch>
                              
                            </div>
                          </v-col>
                          <v-col cols="12" md="2">
                            <div class="search">
                              <v-btn class="btn-primary" v-if="ficmode == 'edit'" @click="ficedit">修改</v-btn>
                              <v-btn class="btn-primary" v-if="ficmode == 'add'" @click="ficsubmit">新增</v-btn>
                              <v-btn class="btn-secondary" @click="ficEditOpen=false">取消</v-btn>
                            </div>
                          </v-col>
                        </v-row>
                        
                      </v-form>
                      
                   
                  </div>
                  <!-- <div class="content"> -->
                    <div class="result">
                      <v-card class="result-card">
                        <div class="card-title">
                          <div class="title">
                            <v-card-title style="width: 100%;">成份資訊</v-card-title>
                            <div class="chevron flex-align-center" style="margin-left: 8px;">
                              <v-btn class="btn-secondary green" @click="openAdd" style="padding: 0 8px;">
                                  <v-icon>mdi-plus</v-icon>新增成份
                              </v-btn>
                              
                            </div>
                          </div>
                        </div>
                        <div  v-if="tablindex == '成份設定'" class="content">
                          
                          <v-data-table light 
                            :headers="ficHeaders"
                            :items="manuFilterData" dense
                            :id="'table-fic'"
                            hide-default-footer
                            disable-pagination
                            no-data-text="查無資料"
                            fixed-header
                            maxHeight="55vh"
                            style="height: 55vh;overflow-y: scroll;"
                            class="data-table bg-transparent">
                            <template v-slot:[`item.manufacturer`]="{ item }">
                                {{manu.filter(x=>x.id==item.manufacturer_id)[0].name_ch}}
                            </template>
                            <template  v-slot:[`item.parameters`]="{item}">
                              <v-chip
                                v-for="(p,pid) in item.parameters"
                                :key="'para-'+pid"
                                style="font-size: 12px;margin: 2px;color: #fff;"
                                color="#408FBC"
                                class="main"
                              >
                                {{ p.name_ch }}： {{ p.value }}
                              </v-chip>
                            </template>
                            <template  v-slot:[`item.actions`]="{item}">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <button class="btn-icon" @click="openEdit(item.id)" v-bind="attrs" v-on="on">
                                            <v-icon>mdi-pencil</v-icon>
                                        </button>
                                    </template>
                                    <span>修改</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <button class="btn-icon delete" @click="fingdelete(item.id)" v-bind="attrs" v-on="on">
                                            <v-icon>mdi-trash-can</v-icon>
                                        </button>
                                    </template>
                                    <span>刪除</span>
                                </v-tooltip>
                            </template>
                          </v-data-table>
                        </div>
                        
                       
                      </v-card>
                    </div>
                </v-tab-item>

                <!-- 套餐設定 -->
                <v-tab-item value="套餐設定">
                    <div class="search">
                      <!-- {{ combo }} -->
                      <v-row>
                        <v-col cols="12" md="3" sm="6" style="padding: 0;padding-left: 8px;">
                          <v-autocomplete
                            v-model="comboidx"
                            style="min-width: 200px;"
                            :items="combodatas"
                            item-text="name_ch"
                            item-value="id"
                            dense
                            placeholder="選擇套餐"
                            filled
                            clearable
                            hide-details
                            @change="comboselect"
                            ></v-autocomplete>
                        </v-col>
                        
                        <v-col cols="12" md="3" sm="6" class="flex-align-center" style="padding: 0;">
                          <v-checkbox v-model="isEnable" label="顯示已停用套餐" @change="checkTemp" hide-details style="margin-right: 16px;"></v-checkbox>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button class="btn-icon just-icon" @click="getcombodata" v-bind="attrs" v-on="on">
                                  <v-icon style="font-size: 24px;">mdi-reload</v-icon>
                                </button>
                            </template>
                            <span>重新整理</span>
                          </v-tooltip>
                          
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button class="btn-icon green" @click="openAdd" v-bind="attrs" v-on="on">
                                  <v-icon>mdi-plus</v-icon>
                                </button>
                            </template>
                            <span>新增套餐</span>
                          </v-tooltip>
                          
                          <!-- <v-btn class="btn-icon just-icon" @click="getficdata">
                              <v-icon style="font-size: 24px;">mdi-reload</v-icon>
                          </v-btn> -->
                          
                        </v-col>
                      </v-row>
                    </div>
                    <div class="result">
                      <v-card class="result-card">
                        <div class="card-title">
                          <div class="title">
                            <v-card-title style="width: 100%;">套餐資訊</v-card-title>
                            <!-- <div class="chevron" style="display: flex;align-items: center;margin-left: 8px;">
                              <v-btn class="btn-secondary green" @click="openAdd" style="padding: 0 8px;">
                                  <v-icon>mdi-plus</v-icon>新增廠商
                              </v-btn>
                            </div> -->
                          </div>
                        </div>
                        <div v-if="tablindex == '套餐設定'" class="content">
                          <v-data-table light 
                            :headers="comboHeaders"
                            :items="manuFilterData" dense
                            :id="'table-combo'"
                            hide-default-footer
                            disable-pagination
                            no-data-text="查無資料"
                            fixed-header
                            maxHeight="55vh"
                            style="height: 55vh;overflow-y: scroll;"
                            class="data-table bg-transparent">
                            
                            <template  v-slot:[`item.main`]="{item}">
                              <v-chip
                                  v-for="(imain, key) in item.main_items"
                                  :key="'main_items_'+key"
                                  color="#408FBC"
                                  style="color:#fff;font-size: 12px;margin: 2px;"
                                  >{{ imain.name }}</v-chip>
                            </template>
                            <template  v-slot:[`item.sub`]="{item}">
                              <v-chip
                                  v-for="(smain, key) in item.sub_items"
                                  :key="'sub_items_'+key"
                                  color="#BFCBD2"
                                  style="color:#00324E;font-size: 12px;margin: 2px;"
                                  >{{ smain.name }}</v-chip>
                            </template>
                            <template  v-slot:[`item.actions`]="{item}">
                                <v-tooltip bottom>
                                      <template v-slot:activator="{ on, attrs }">
                                          <button class="btn-icon" :class="{'disabled':!item.is_enable}" @click="openEdit(item.id)" v-bind="attrs" v-on="on">
                                              <v-icon>mdi-pencil</v-icon>
                                          </button>
                                      </template>
                                      <span>修改</span>
                                  </v-tooltip>
                                  <v-tooltip v-if="item.is_enable" bottom>
                                      <template v-slot:activator="{ on, attrs }">
                                          <button class="btn-icon just-icon delete"  @click="comboenable(item,false)" v-bind="attrs" v-on="on">
                                              <v-icon>mdi-cancel</v-icon>
                                          </button>
                                      </template>
                                      <span>停用</span>
                                  </v-tooltip>
                                  <v-tooltip v-else bottom>
                                      <template v-slot:activator="{ on, attrs }">
                                          <button class="btn-icon just-icon green" @click="comboenable(item,true)" v-bind="attrs" v-on="on">
                                              <v-icon style="font-size: 1.5rem;">mdi-lock-open-check-outline</v-icon>
                                          </button>
                                      </template>
                                      <span>啟用</span>
                                  </v-tooltip>
                                  
                            </template>
                          </v-data-table>
                          <!-- <el-table
                            :data="manuFilterData"
                            style="width: 100%"
                            height="55vh"
                            row-key="id"
                            :expand-row-keys="expands"
                            @expand-change="expandSelect">
                            <el-table-column type="expand">
                              <template slot-scope="props">
                                <el-form label-position="left" inline style="width:100%">
                                  <el-form-item style="margin: 0 48px 24px 48px;width:80%">
                                    <el-table
                                      :data="props.row.main_items"
                                      style="width: 100%"
                                      row-key="id"
                                      class="main-table">
                                      <el-table-column
                                        prop="name"
                                        label="主成分">
                                      </el-table-column>
                                      <el-table-column
                                        prop="name"
                                        label="參數">
                                        <template slot-scope="scope">
                                          <v-chip
                                            class="mx-1"
                                            v-for="parmitem in ficwithdetail_main.filter(
                                              x => x.id == scope.row.id
                                            )[0].parameters"
                                            :key="'main_parm_'+parmitem.id"
                                            color="#408FBC"
                                            style="color:#fff;font-size: 12px;margin: 2px;"
                                            >{{ `${parmitem.name}:${parmitem.value}` }}</v-chip>
                                        </template>
                                        
                                      </el-table-column>
                                      <el-table-column
                                        prop="formula"
                                        label="公式">
                                      </el-table-column>
                                      <el-table-column
                                        prop="remark"
                                        label="備註">
                                      </el-table-column>
                                    </el-table>
                                    <el-table
                                      :data="props.row.sub_items"
                                      style="width: 100%"
                                      row-key="id"
                                      class="sub-table">
                                      <el-table-column
                                        prop="name"
                                        label="次成分">
                                      </el-table-column>
                                      <el-table-column
                                        prop="name"
                                        label="參數">
                                        <template slot-scope="scope">
                                          <v-chip
                                            v-for="parmitem in ficwithdetail_sub.filter(
                                              x => x.id == scope.row.id
                                            )[0].parameters"
                                            :key="'sub_parm_'+parmitem.id"
                                            color="#BFCBD2"
                                            style="color:#00324E;font-size: 12px;margin: 2px;"
                                            >{{ `${parmitem.name}:${parmitem.value}` }}</v-chip>
                                        </template>
                                        
                                      </el-table-column>

                                      
                                      <el-table-column
                                        prop="formula"
                                        label="公式">
                                        <template slot-scope="scope">
                                          sum(主成分) <span v-if="scope.row.formula.replace(/\s+/g, ' ')[0]!=='*'"> * </span>{{ scope.row.formula}}
                                        </template>
                                      </el-table-column>
                                      <el-table-column
                                        prop="remark"
                                        label="備註">
                                      </el-table-column>
                                    </el-table>
                                  </el-form-item>
                                </el-form>
                              </template>
                            </el-table-column>

                            <el-table-column
                              prop="name_ch"
                              label="名稱">
                            </el-table-column>

                            <el-table-column
                              prop="name_en"
                              label="名稱(英)">
                            </el-table-column>

                            <el-table-column
                              prop="main_items"
                              label="主成分">
                              <template slot-scope="scope">
                                <v-chip
                                  v-for="(item, key) in scope.row.main_items"
                                  :key="'main_items_'+key"
                                  color="#408FBC"
                                  style="color:#fff;font-size: 12px;margin: 2px;"
                                  >{{ item.name }}</v-chip>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="sub_items"
                              label="次成分">
                              <template slot-scope="scope">
                                <v-chip
                                  v-for="(item, key) in scope.row.sub_items"
                                  :key="'sub_items_'+key"
                                  color="#BFCBD2"
                                  style="color:#00324E;font-size: 12px;margin: 2px;"
                                  >{{ item.name }}</v-chip>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="remark"
                              label="備註">
                            </el-table-column>
                            <el-table-column
                              label="操作">
                              <template slot-scope="scope">
                                <v-tooltip bottom>
                                      <template v-slot:activator="{ on, attrs }">
                                          <button class="btn-icon" @click="openEdit(scope.row.id)" v-bind="attrs" v-on="on">
                                              <v-icon>mdi-pencil</v-icon>
                                          </button>
                                      </template>
                                      <span>修改</span>
                                  </v-tooltip>
                                  <v-tooltip bottom>
                                      <template v-slot:activator="{ on, attrs }">
                                          <button class="btn-icon delete" @click="combodelete(scope.row.id)" v-bind="attrs" v-on="on">
                                              <v-icon>mdi-trash-can</v-icon>
                                          </button>
                                      </template>
                                      <span>刪除</span>
                                  </v-tooltip>
                              </template>
                            </el-table-column>
                            <template slot="empty">
                              <span>查無資料</span>
                            </template>
                          </el-table> -->
                        </div>
                      </v-card>
                    </div>
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
    <!-- 新增/編輯 Dialog (廠商/成分 資料存於editItem;套餐設定 資料存於combofield，因需要分開主/次成分 ) -->
    <v-dialog v-model="editForm"  max-width="500px">
      <v-form ref="manform" v-model="manvalid" >
        <v-card class="custom-dialog">
          <v-card-title class="add-title">
            <div v-if="mode=='edit'" class="edit" style="display: inline-block;">
              編輯{{tablindex.split('設定')[0]}}
            </div>
            <div v-else class="edit" style="display: inline-block;">
              新增{{tablindex.split('設定')[0]}}
            </div>
            <div class="add">
                <v-btn class="btn-secondary close"
                        title="取消" 
                        @click="editForm = false" 
                        style="border: none;min-width: 0;padding: 0 4px;">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
          </v-card-title>
          <!-- <v-divider></v-divider> -->
          <v-card-text v-if="tablindex=='廠商設定'"  class="pt-5">
              <v-text-field filled dense v-model="editItem.name_ch" :rules="rules.require">
                  <span style="width:100px" slot="prepend">名稱(中)</span>
              </v-text-field>
              <v-text-field filled dense v-model="editItem.name_en" :rules="rules.require">
                  <span style="width:100px" slot="prepend">名稱(英)</span>
              </v-text-field>
              <v-text-field filled dense v-model="editItem.tax_id" :rules="rules.require" counter="8"
                maxlength="8">
                  <span style="width:100px" slot="prepend">統編</span>
              </v-text-field>
              <v-text-field filled dense v-model="editItem.address" :rules="rules.require">
                  <span style="width:100px" slot="prepend">住址</span>
              </v-text-field>
              <v-text-field filled dense v-model="editItem.phone" :rules="rules.require">
                  <span style="width:100px" slot="prepend">聯絡電話</span>
              </v-text-field>
              <v-text-field filled dense v-model="editItem.contact" :rules="rules.require">
                  <span style="width:100px" slot="prepend">聯絡人</span>
              </v-text-field>
              <v-text-field filled dense v-model="editItem.remark">
                  <span style="width:100px" slot="prepend">備註</span>
              </v-text-field>
          </v-card-text>
          <v-card-text v-else-if="tablindex=='成份設定'" class="pt-5">
            <v-autocomplete v-if="mode=='add'" v-model="editItem.feed_ingredient_category_id" hide-details dense filled placeholder="選擇成份類別" :items="feed_ingredient_category"
              item-text="name_ch" item-value="id"
              :rules="rules.require">
              <span slot="prepend" style="width:100px;"
                >成份類別</span
              >
            </v-autocomplete>
            <!-- <v-text-field
              v-show="false"
              v-model="editItem.feed_ingredient_category_id"
              dense
              placeholder="feed_ingredient_category_id"
              filled
              :rules="rules.require"
              :disabled="true"
            >
              <span slot="prepend" style="width:100px;"
                >正在新增(之後不show)</span
              >
            </v-text-field> -->
            <v-text-field
              v-model="editItem.name"
              filled
              clearable
              placeholder="1號料_cn15,1號料_cn22,..."
              :rules="rules.require"
              ><span slot="prepend" style="width:100px;"
                >成份名稱</span
              ></v-text-field
            >
            <v-text-field
              v-model="editItem.item_no"
              filled
              clearable
              placeholder="10001,10002..."
              :rules="rules.require"
              ><span slot="prepend" style="width:100px;"
                >飼料成分產編</span
              ></v-text-field
            >
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
              :rules="rules.require"
              ><span slot="prepend" style="width:100px;"
                >廠商</span
              ></v-autocomplete
            >
            <v-text-field
              v-model.number="editItem.price"
              filled
              clearable
              placeholder="15,20,150,..."
              :rules="rules.require"
              ><span slot="prepend" style="width:100px;"
                >價格/單位數量</span
              ></v-text-field
            >
            <v-text-field
              v-model="editItem.unit"
              filled
              clearable
              placeholder="個,包,盒..."
              :rules="rules.require"
              ><span slot="prepend" style="width:100px;"
                >單位</span
              ></v-text-field
            >
            <v-text-field
              v-model.number="editItem.unit_quantity"
              filled
              clearable
              placeholder="100,6,50,..."
              :rules="rules.require"
              ><span slot="prepend" style="width:100px;"
                >單位數量</span
              ></v-text-field
            >
            <!-- <v-text-field
              label="備註"
              clearable outlined
              placeholder="memo"
            ></v-text-field> -->
            <v-divider style="margin-bottom:16px"></v-divider>
            
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
              hide-details
              class="items"
              style="align-items: center;"
              >
              <div  slot="prepend" class="card-title" style="margin: 12px 0;width:100px;">
                <div class="title">
                    <v-card-title>成份參數</v-card-title>
                </div>
              </div>
              <!-- <span slot="prepend" style="width:100px;">成份參數</span> -->
              
              <v-btn
                slot="append-outer"
                class="btn-icon"
                @click="showparam"
                style="border-radius: 12px;"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
            </v-autocomplete>
            <v-row v-for="item in fingparam" :key="item">
              <v-col cols="12" align-self="center">
                <v-text-field
                  v-model="fingparamitem[item]"
                  filled
                  dense
                  clearable
                  :rules="rules.require"
                  placeholder="90%,0.85,..."
                >
                  <span slot="prepend" style="width:50px;">{{
                    parmdata.filter(x => x.id == item)[0].name_ch
                  }}</span>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else-if="tablindex=='套餐設定'" class="pt-5">
            <div class="card-title" style="margin: 0 0 12px;">
              <div class="title">
                  <v-card-title>基本資料</v-card-title>
              </div>
            </div>
            <v-text-field
              v-model="combofield.name_ch"
              filled
              clearable
              placeholder="1號套餐"
              :rules="rules.require"
              counter maxlength="50"
              ><span slot="prepend" style="width:100px;"
                >套餐名稱</span
              ></v-text-field
            >
            <v-text-field
              v-model="combofield.name_en"
              filled
              clearable
              placeholder="Meal No.1"
              :rules="rules.require"
              counter maxlength="50"
              :disabled="mode == 'edit'"
              ><span slot="prepend" style="width:100px;"
                >套餐名稱(英)</span
              ></v-text-field
            >
            <v-text-field
              v-model="combofield.remark"
              filled
              clearable
              placeholder="memo"
            ><span slot="prepend" style="width:100px;"
                >備註</span
              ></v-text-field>
            <v-divider></v-divider>
            <div class="card-title" style="margin: 12px 0;">
              <div class="title">
                  <v-card-title style="display: inline-block;">配方</v-card-title>
                  <span v-if="comboNull" class="error-text">*請填寫配方</span>
              </div>
            </div>
            <!-- 主成分 -->
            <div class="main-items">
              <v-autocomplete
                v-model="combofield.main_items"
                style="align-items: center;"
                :items="ficwithdetail_main"
                item-text="name"
                item-value="id"
                dense
                chips
                deletable-chips
                filled
                clearable
                multiple
                hide-details
                label="選擇主成分"
                class="items"
                @change="mainchange"
                >
                <div  slot="prepend" class="card-title" style="margin: 12px 0;width:50px;">
                  <div class="title">
                      <v-card-title>主成份</v-card-title>
                  </div>
                </div>
              <!-- <span slot="prepend" style="width:50px;"
                  >主成份</span> -->
              </v-autocomplete>
              <!-- <v-row v-for="item in combofield.main_items" :key="item.id" style="align-items: center;margin: 0 8px;border-bottom: 1px solid rgba(0,0,0,0.1)">
                <div style="width: 100px; padding: 12px;">
                    <div style="display: flex;flex-direction:column;margin-top: 4px;">
                      <span style="width:100px;margin-bottom: 12px;">{{
                        ficwithdetail_main.filter(x => x.id == item)[0].name
                      }}</span>
                      <div class="chips" style="width: 100%;">
                        <v-chip
                          class="mx-1"
                          v-for="parmitem in ficwithdetail_main.filter(
                            x => x.id == item
                          )[0].parameters"
                          :key="'add_main_parm_'+parmitem.id"
                          color="#408FBC"
                          style="color:#fff;font-size: 12px;margin: 2px;"
                          >{{ `${parmitem.name}:${parmitem.value}` }}</v-chip
                        >
                      </div>
                      
                    </div>
                </div>
                <div style="padding: 12px;">
                  <v-text-field
                    v-model="main_formula[item]"
                    filled
                    dense
                    clearable
                    hide-details
                    @keyup="limitcharacter"
                    placeholder="範例：1,0.2,0.5,0.8...."
                    :rules="rules.require"
                  >
                    <span slot="prepend" style="width:100px;"
                    >公式</span>
                  </v-text-field>
                  <v-text-field
                    v-model="main_formula_remark[item]"
                    filled
                    dense
                    clearable
                    hide-details
                    placeholder="備註：該混料只需8成"
                  >
                    <span slot="prepend" style="width:100px;"
                    >備註</span>
                  </v-text-field>
                </div>
              </v-row> -->
              
              <v-row v-for="item in combofield.main_items" :key="item.id" class="meal-item">
                <v-col cols="12" style="padding-bottom: 0;">
                    <div class="flex-align-center" style="margin-top: 4px;">
                      <span>{{
                        ficwithdetail_main.filter(x => x.id == item)[0].name
                      }}</span>
                      <div class="chips">
                        <v-chip
                          class="mx-1 params"
                          v-for="parmitem in ficwithdetail_main.filter(
                            x => x.id == item
                          )[0].parameters"
                          :key="'add_main_parm_'+parmitem.id"
                          color="#408FBC"
                          style="color:#fff;font-size: 12px;margin: 2px;"
                          >{{ `${parmitem.name}:${parmitem.value}` }}</v-chip
                        >
                      </div>
                      
                    </div>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="main_formula[item]"
                    filled
                    dense
                    clearable
                    @keyup="limitcharacter"
                    placeholder="範例：1,0.2,0.5,0.8...."
                    :rules="rules.require"
                  >
                    <span slot="prepend" style="width:50px;"
                    >公式</span>
                  </v-text-field>
                  <v-text-field
                    v-model="main_formula_remark[item]"
                    filled
                    dense
                    clearable
                    hide-details
                    placeholder="備註：該混料只需8成"
                  >
                    <span slot="prepend" style="width:50px;"
                    >備註</span>
                  </v-text-field>
                </v-col>
              </v-row>
            </div>
            
            <!-- 次成份 -->
            <div class="main-items sub-border">
              <v-autocomplete
                v-model="combofield.sub_items"
                style="align-items: center;margin-top: 4px;"
                :items="ficwithdetail_sub"
                item-text="name"
                item-value="id"
                dense
                chips
                deletable-chips
                filled
                clearable
                multiple
                hide-details
                label="選擇次成分"
                class="items sub_chips"
                @change="subchange"
                >
                <div  slot="prepend" class="card-title" style="margin: 12px 0;width:50px;">
                  <div class="title">
                      <v-card-title>次成份</v-card-title>
                  </div>
                </div>
                <!-- <span slot="prepend" style="width:50px;"
                  >次成份</span> -->
              </v-autocomplete>
              <!-- <span
                v-show="
                  combofield.sub_items && combofield.sub_items.length > 0
                "
                >比例</span
              > -->

              <!-- <v-row v-for="item in combofield.sub_items" :key="item.id" style="align-items: center;margin: 0 8px;border-bottom: 1px solid rgba(0,0,0,0.1);">
                <div style="width: 100px; padding: 12px;">
                    <div style="display: flex;flex-direction:column;margin-top: 4px;">
                      <span style="width:100px;margin-bottom: 12px;">{{
                      ficwithdetail_sub.filter(x => x.id == item)[0].name
                    }}</span>
                      <div class="chips" style="width: 100%;">
                        <v-chip
                          v-for="parmitem in ficwithdetail_sub.filter(
                            x => x.id == item
                          )[0].parameters"
                          :key="'add_sub_items_'+parmitem.id"
                          color="#BFCBD2"
                          style="color:#00324E;font-size: 12px;margin: 2px;"
                          >{{ `${parmitem.name}:${parmitem.value}` }}</v-chip
                        >
                      </div>
                    </div>
                </div>
                <div style="padding: 12px;">
                  <v-text-field
                    v-model="sub_formula[item]"
                    filled
                    dense
                    clearable
                    hide-details
                    placeholder="範例：*0.5*1.5*300%*1(2+50)"
                    :rules="rules.require"
                  >
                    <span slot="prepend" style="width:100px;"
                    >公式 = sum(主成份) *</span>
                  </v-text-field>
                  <v-text-field
                    v-model="sub_formula_remark[item]"
                    filled
                    dense
                    clearable
                    hide-details
                    placeholder="備註：粗蛋白率*CN比*含氮率"
                  >
                    <span slot="prepend" style="width:100px;"
                    >備註</span>
                  </v-text-field>
                </div>
              </v-row> -->
              <v-row class="border-bottom" v-for="item in combofield.sub_items" :key="item.id" style="align-items: center;margin: 0 8px;">
                <v-col cols="12" style="padding-bottom: 0;">
                    <div class="flex-align-center" style="margin-top: 4px;">
                      <span>{{
                      ficwithdetail_sub.filter(x => x.id == item)[0].name
                    }}</span>
                      <div class="chips">
                        <v-chip
                          class="mx-1 params"
                          v-for="parmitem in ficwithdetail_sub.filter(
                            x => x.id == item
                          )[0].parameters"
                          :key="'add_sub_parm_'+parmitem.id"
                          color="#BFCBD2"
                          style="color:#00324E;font-size: 12px;margin: 2px;"
                          >{{ `${parmitem.name}:${parmitem.value}` }}</v-chip
                        >
                      </div>
                    </div>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="sub_formula[item]"
                    filled
                    dense
                    clearable
                    placeholder="範例：1,0.2,0.5,0.8...."
                    :rules="rules.require"
                  >
                    <span slot="prepend" style="width:50px;"
                    >公式</span>
                    <span slot="prepend" style="width:120px;"
                    > = sum(主成份) * </span>
                  </v-text-field>
                  <v-text-field
                    v-model="sub_formula_remark[item]"
                    filled
                    dense
                    clearable
                    hide-details
                    placeholder="備註：該混料只需8成"
                  >
                    <span slot="prepend" style="width:50px;"
                    >備註</span>
                  </v-text-field>
                </v-col>
              </v-row>
            </div>
            
          </v-card-text>
          <!-- <v-divider></v-divider> -->
          <v-card-actions style="padding: 24px 12px;">
              <v-spacer></v-spacer>
              <v-btn tile @click="editForm = false" class="btn-secondary">取消</v-btn>
              <v-btn tile @click="editsave" v-if="mode=='edit'" class="btn-primary">修改</v-btn>
              <v-btn tile @click="addsave" v-if="mode=='add'" class="btn-primary">新增</v-btn>
          </v-card-actions>
      </v-card>
    </v-form>
      
  </v-dialog>
  <!-- 新增參數視窗 -->
  <v-dialog v-model="dialog.param" width="400px">
    <v-card class="custom-dialog">
      <v-card-title class="add-title">
        新增參數
      </v-card-title>
      
      <v-form ref="parmform" v-model="parmvalid">
        <v-card-text>
          <v-text-field
            v-model="parmfield.name_ch"
            filled
            clearable
            placeholder="純度,粗蛋白率..."
            :rules="rules.require"
            ><span slot="prepend" style="width:100px;"
              >參數(中文)</span
            ></v-text-field
          >
          <v-text-field
            v-model="parmfield.name_en"
            filled
            clearable
            placeholder="pure,..."
            :rules="rules.require"
            ><span slot="prepend" style="width:100px;"
              >參數(英文)</span
            ></v-text-field
          >
        </v-card-text>
        <v-card-actions style="padding: 24px 12px;">
          <v-spacer></v-spacer>
          <v-btn tile @click="dialog.param = false" class="btn-secondary">取消</v-btn>
          <v-btn tile @click="parmsubmit" class="btn-primary">新增</v-btn>
        </v-card-actions>
        
      </v-form>
    </v-card>
  </v-dialog>

  </div>
</template>

<script>
import _ from "lodash";
export default {
  layout: "emptynologin2",
  middleware: "auth",
  head(){
    return {
      title:"飼料設定",
    }
  },
  data() {
    return {
      rules: {
        require: [v => !!v || "*必要項目"],
        min: v => v.length >= 8 || "至少8個字符"
      },
      tablindex: "",
      manfield: {},
      manmode: "add",
      manisEditing: false,
      manu: [
        { name_ch: "廠商1", id: "1" },
        { name_ch: "廠商2", id: "2" }
      ],
      manuidx: null,
      manvalid: true,
      //成份類別
      feed_ingredient_category: [
        { name_ch: "0號料_a餐", id: "1" },
        { name_ch: "0號料_b餐", id: "2" }
      ],
      ficEditOpen:false,//編輯
      ficvalid: true,
      fic_idx: "",
      ficmode: "add",
      ficmodeOrigin: "add",
      ficisEditing: false,
      ficfield: {},
      ficfieldOrigin: {},
      fingparamitem: {},
      fingchip: {}, //成份清單
      //成份清單(detail)
      fing: [],
      fingvalid: true,
      fingidx: "",
      fingmode: "add",
      fingisEditing: false,
      fingfield: {},
      fingparam: [], //成份參數
      //---參數設定
      dialog: {
        param: false
      },
      parmfield: {},
      parmvalid: true,
      parmdata: [],
      //---
      //---套餐清單(飼料設定)
      combofield: {},
      comboidx: "",
      combo: [],
      comboisEditing: false,
      combovalid: true,
      main_formula: {},
      main_formula_remark: {}, //主成份公式備註
      sub_formula: {}, //次成份公式
      sub_formula_remark: {}, //次成份公式備註
      combomode: "add",
      //--
      isEditing: false,
      //--成份類別及細項 清單
      ficwithdetail: [],

      // 廠商資料(表格呈現用)
      manuFilterData: [],
      manuHeaders: [
        { text: '名稱(中)', value: 'name_ch', sortable: true,width:"15%"},
        { text: '名稱(英)', value: 'name_en', sortable: true,width:"15%"},
        { text: '統編', value: 'tax_id', sortable: false,width:"10%"},
        { text: '住址', value: 'address', sortable: false,width:"20%"},
        { text: '聯絡電話', value: 'phone', sortable: false,width:"10%"},
        { text: '聯絡人', value: 'contact', sortable: false,width:"10%"},
        { text: '備註', value: 'remark', sortable: false,width:"10%"},
        { text: '操作', value: 'actions', sortable: false,width:"10%"},
      ],
      ficHeaders:[
        { text: '名稱', value: 'name', sortable: true,width:"15%"},
        { text: '產編', value: 'item_no', sortable: true,width:"10%"},
        { text: '廠商', value: 'manufacturer', sortable: false,width:"15%"},
        { text: '價格/單位數量', value: 'price', sortable: false,width:"10%"},
        { text: '單位', value: 'unit', sortable: false,width:"5%"},
        { text: '單位數量', value: 'unit_quantity', sortable: false,width:"10%"},
        { text: '成分參數', value: 'parameters', sortable: false,width:"25%"},
        { text: '操作', value: 'actions', sortable: false,width:"10%"},
      ],
      comboHeaders:[
        { text: '名稱(中)', value: 'name_ch', sortable: true,width:"15%"},
        { text: '名稱(英)', value: 'name_en', sortable: true,width:"15%"},
        { text: '主成分', value: 'main', sortable: false,width:"25%"},
        { text: '次成分', value: 'sub', sortable: false,width:"25%"},
        { text: '操作', value: 'actions', sortable: false,width:"10%"},
      ],
      manvalid: true,
      editForm: false,
      editItem: {},
      mode: 'edit',
      tablindexOrigin: "",
      expands: [], //Expand only one line into the current line id
      nowtag:{is_main:true,is_feed:true},
      isEnable: false,
      combodatas:[],
      isLoading: false,
      comboNull: false,
    };
  },
  async mounted() {
    
    await this.getficdata(); //取得成份類別
    await this.getfingdata(); //取得成份清單
    // await this.getficwithdetaildata(); //取得成份類別及細項
    await this.getcombodata(); //取得套餐清單(飼料設定)
    await this.getmanudata(); //取得廠商資料
  },
  computed: {
    ficwithdetail_main: function() {
      // var oraitems  = _.cloneDeep(this.ficwithdetail['main_items']);
      var oraitems = this.ficwithdetail["main_items"];
      var items = [];
      if (oraitems != undefined && oraitems.length > 0) {
        oraitems.forEach(element => {
          items.push({
            header: element.name,
            id: `${element.name}_${element.id}`
          });
          //delete element.items.parameters;參數細項內容
          items.push(...element.items);
          items.push({ divider: true });
        });
      }
      return items;
    },
    ficwithdetail_sub: function() {
      //var oraitems  = _.cloneDeep(this.ficwithdetail['sub_items']);
      var oraitems = this.ficwithdetail["sub_items"];
      var items = [];
      if (oraitems != undefined && oraitems.length > 0) {
        oraitems.forEach(element => {
          items.push({
            header: element.name,
            id: `${element.name}_${element.id}`
          });
          //delete element.items.parameters;參數細項內容
          items.push(...element.items);
          items.push({ divider: true });
        });
      }
      return items;
    },
  },
  methods: {
    changeTabs() {
      this.manuFilterData = [];
    },
    //限制特殊字元
    limitcharacter:function(e){
       e.target.value = e.target.value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g,"");
    },
    //選擇廠商
    manselect: function() {
      // console.log(this.manuidx,this.manu.filter(x => x.id == this.manuidx));
      if(this.manuidx && this.manuidx !== null) {
        let data = this.manu.filter(x => x.id == this.manuidx);
        // console.log('filter',data);
        this.manuFilterData = _.cloneDeep(data);
      }else {
        this.manuFilterData = _.cloneDeep(this.manu);
      }
      console.log('man Select',this.manuFilterData,this.manuidx);
      // if (this.manu.filter(x => x.id == this.manuidx).length > 0) {
      //   //edit mode
      //   this.manmode = "edit";
      //   this.manfield = this.manu.filter(x => x.id == this.manuidx)[0];
      // } else {
      //   this.manmode = "add";
      //   this.manfield = {};
      // }
      // this.manisEditing = false; //只要select change就關閉編輯
    },
    manopenaddEdit: function() {
      //manmode = add
      this.manisEditing = !this.manisEditing;
      this.manfield = {}; //reset
    },
    //新增廠商
    manusubmit: async function() {
      // console.log(this.manfield);
      let val = this.$refs.manform.validate();
      if (val) {
        //--
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/`;
        let parms = this.editItem;
        parms.created_user = this.$auth.$state.user.email;
        var res = false;
        res = this.postManufacturerList(parms);
        setTimeout(()=>{
            if(res) {
              this.manisEditing = false;
              this.manfield = {};
              this.editForm = false;
            }
            this.getmanudata(); //取得廠商資料
        },50)
        // await this.$axios
        //   .post(url, parms)
        //   .then(res => {
        //     if (res.data == "新增成功") {
        //       //this.getdata();新增未必有選到所有選項
        //       this.$toast.success(`新增成功`, { duration: 2000 });
        //       this.manisEditing = false;
        //       this.manfield = {};
        //       this.editForm = false;
        //     } else {
        //       alert("新增廠商失敗：" + res.data);
        //     }
        //   })
        //   .catch(error => {
        //     alert("新增廠商失敗：" + error.message);
        //   })
        //   .finally(() => {
        //     this.getmanudata(); //取得廠商資料
        //   });
      }
    },
    //刪除廠商
    manudelete: async function(i) {
      let id = i;
      let name = this.manu.filter(x=>x.id==i)[0].name_ch;
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/${id}/`;
      if (confirm("是否刪除?-" + name)) {
        var res = false;
        res = this.deleteManufacturerList(id);
        setTimeout(()=>{
          this.getmanudata();
        },50)
        // await this.$axios
        //   .delete(url)
        //   .then(res => {
        //     if (res.data == "刪除成功") {
        //       this.$toast.success(`刪除成功`, { duration: 2000 });
        //     } else {
        //       this.$toast.error(`刪除失敗${res.data}`, { duration: 2000 });
        //     }
        //   })
        //   .catch(error => {
        //     alert("刪除失敗!：" + error.message);
        //   })
        //   .finally(() => {
        //     this.getmanudata();
        //   });
      }
    },
    // 修改廠商
    manuedit: async function() {
      // console.log(this.manfield);
      let parms = {};
      // let id = this.manfield["id"];
      // Object.assign(parms, this.manfield);
      let id = this.editItem["id"];
      Object.assign(parms, this.editItem);
      delete parms["id"]; //刪去不必要欄位
      delete parms["created_time"];
      delete parms["created_user"];
      delete parms["updated_time"];
      parms["updated_user"] = this.$auth.$state.user.email;
      // console.log('edit',parms);
      var res = false;
      res = this.patchManufacturerList(parms,id);
      setTimeout(()=>{
          if(res) {
            this.manisEditing = false;
            this.editForm = false;
            this.manfield = {};
          }
          this.getmanudata();
      },50)
      
      
      // let url = `${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/${id}/`;
      // await this.$axios
      //   .patch(url, parms)
      //   .then(res => {
      //     if (res.data == "修改成功") {
      //       //this.getdata();新增未必有選到所有選項
      //       this.$toast.success(`修改成功`, { duration: 2000 });
      //       this.manisEditing = false;
      //       // this.manuidx = null;
      //       this.editForm = false;
      //       this.manfield = {};
      //     } else {
      //       alert("修改失敗!：" + res.data);
      //     }
      //   })
      //   .catch(error => {
      //     alert("修改失敗!：" + error.message);
      //   })
      //   .finally(() => {
      //     this.getmanudata();
      //   });
    },
    //選擇成份類別
    ficselect: function() {
      if (this.feed_ingredient_category.filter(x => x.id == this.fic_idx).length > 0) {
        //edit mode
        this.ficmode = "edit";
        this.ficmodeOrigin = this.ficmode;
        this.ficfield = this.feed_ingredient_category.filter(
          x => x.id == this.fic_idx
        )[0];
        this.ficfieldOrigin = _.cloneDeep(this.ficfield);
        this.nowtag = {
          is_main:this.ficfield.is_main,
          is_feed:this.ficfield.is_feed
        };
        var tmpfic = this.feed_ingredient_category.filter(
          x => x.id == this.fic_idx
        )[0].id;
        var newid = _.cloneDeep(tmpfic);
        this.fingfield = {};
        this.fingfield.feed_ingredient_category_id = newid;
        this.manuFilterData = this.fing.filter(x => x.feed_ingredient_category_id == this.fic_idx);
      } else {
        this.ficmode = "add";
        this.ficmodeOrigin = this.ficmode;
        this.ficfield = {};
        this.fingfield.feed_ingredient_category_id = undefined;
        this.manuFilterData = [];
      }
      this.fingparam = []; //成份參數
      this.ficisEditing = false; //只要select change就關閉編輯成份類別
      this.fingisEditing = false; //只要select change就關閉編輯成份清單
      this.getparmdata(); //參數清單
    },
    ficEdit() {
      if(this.ficmode == this.ficmodeOrigin || !this.ficEditOpen) {
        this.ficEditOpen = !this.ficEditOpen;
      }
      
      if(!this.ficEditOpen) {
        this.ficCancelEdit();
      }else {
        if(this.ficmode == 'edit') {
          this.ficfield = _.cloneDeep(this.ficfieldOrigin);
        }else {
          this.ficfield = {};
          // this.fic_idx = null;
        }
      }
      this.ficmodeOrigin = this.ficmode;
    },
    // 取消編輯
    ficCancelEdit() {
      this.ficfield = _.cloneDeep(this.ficfieldOrigin);
    },
    //取得廠商清單
    getmanudata: async function() {
      // this.manuidx = null; //還原成未選
      this.manmode = "add"; //還原成add
      this.manfield = {}; //還原成空白
      this.manu = [];
      let getManufacturerList = await this.getManufacturerList();
      let data = typeof (getManufacturerList)=='string'?[]:getManufacturerList;
      this.manu = data;
      this.manu.forEach(m=>m.name = m.name_ch);
      if(this.tablindex=='廠商設定') {
        this.manuFilterData = _.cloneDeep(data);
      }
      this.manselect();
      // let url = `${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/`;
      // await this.$axios
      //   .get(url)
      //   .then(res => {
      //     this.manu = res.data;
      //     this.manu.forEach(m=>m.name = m.name_ch);
      //     if(this.tablindex=='廠商設定') {
      //       this.manuFilterData = _.cloneDeep(res.data);
      //     }
          
          
      //     // if (res.data == "新增成功") {
      //     //   //this.getdata();新增未必有選到所有選項
      //     //   this.$toast.success(`新增成功`, { duration: 2000 });
      //     //   this.manisEditing = false;
      //     //   this.manfield = {};
      //     // } else {
      //     //   alert("新增失敗!：" + res.data);
      //     // }
      //     console.log('get manu',this.manu);
      //     console.log("取得廠商資料API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.$toast.error(`取得廠商資料失敗:${error}`, { duration: 2000 });
      //   })
      //   .finally(() => {
      //     //this.getdata();
      //     this.manselect();
      //   });
    },
    //刪除成份類別
    ficdelete: async function() {
      let id = this.fic_idx;
      let name = this.feed_ingredient_category.filter(x=>x.id==id)[0].name_ch;
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/${id}/`;
      if (confirm("是否刪除?-" + name)) {
        var res = false;
        res = this.deleteFeedIngredientCategoryList(id);
        setTimeout(()=>{
            if(res) {
              this.ficisEditing = false;
              this.fic_idx = null;
              this.ficfield = {};
              this.ficmode = "add"; //回到新增模式
            }
            this.getficdata();
        },50)
        // await this.$axios
        //   .delete(url)
        //   .then(res => {
        //     if (res.data == "刪除成功") {
        //       this.$toast.success(`刪除成功`, { duration: 2000 });
        //       this.ficisEditing = false;
        //       this.fic_idx = null;
        //       this.ficfield = {};
        //       this.ficmode = "add"; //回到新增模式
        //     } else {
        //       if(res.data == "資料正在使用，無法刪除") {
        //         this.$toast.error(`刪除失敗，請先刪除此類別下的成分`, { duration: 2000 });
        //       }else {
        //         this.$toast.error(`刪除失敗${res.data}`, { duration: 2000 });
        //       }
        //     }
        //   })
        //   .catch(error => {
        //     alert("刪除失敗!：" + error.message);
        //   })
        //   .finally(() => {
        //     this.getficdata();
        //   });
      }
    },
    //修改成份類別
    ficedit: async function() {
      console.log(this.ficfield);
      let parms = {};
      let id = this.ficfield["id"];
      Object.assign(parms, this.ficfield);
      delete parms["id"]; //刪去不必要欄位
      delete parms["created_time"];
      delete parms["created_user"];
      delete parms["updated_time"];
      parms["updated_user"] = this.$auth.$state.user.email;
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/${id}/`;
      let val = this.$refs.ficform.validate();
      if (val) {
        var res = false;
        res = this.patchFeedIngredientCategoryList(parms,id);
        setTimeout(()=>{
            if(res) {
              this.ficisEditing = false;
              this.ficfieldOrigin = _.cloneDeep(this.ficfield);
              this.ficEditOpen = false;
            }
            this.getficdata();
        },50)
        // await this.$axios
        //   .patch(url, parms)
        //   .then(res => {
        //     if (res.data == "修改成功") {
        //       //this.getdata();新增未必有選到所有選項
        //       this.$toast.success(`修改成功`, { duration: 2000 });
        //       this.ficisEditing = false;
        //       // this.fic_idx = null;
        //       // this.ficfield = {};
        //       this.ficfieldOrigin = _.cloneDeep(this.ficfield);
        //       this.ficEditOpen = false;
        //     } else {
        //       alert("修改失敗!：" + res.data);
        //     }
        //   })
        //   .catch(error => {
        //     alert("修改失敗!：" + error.message);
        //   })
        //   .finally(() => {
        //     this.getficdata();
        //   });
      }
      
    },
    //新增成份類別清單
    ficsubmit: async function() {
      let val = this.$refs.ficform.validate();
      if (val) {
        //--
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/`;
        let parms = this.ficfield;
        parms.created_user = this.$auth.$state.user.email;
        if (this.ficfield.hasOwnProperty("is_main") == false) {
          parms["is_main"] = false;
        }
        if (this.ficfield.hasOwnProperty("is_feed") == false) {
          parms["is_feed"] = false;
        }
        var res = false;
        res = this.postFeedIngredientCategoryList(parms);
        setTimeout(()=>{
            if(res) {
              this.ficisEditing = false;
              this.ficfield = {};
              this.ficEditOpen = false;
            }
            this.getficdata();
        },50)
        // await this.$axios
        //   .post(url, parms)
        //   .then(res => {
        //     if (res.data == "新增成功") {
        //       //this.getdata();新增未必有選到所有選項
        //       this.$toast.success(`新增成功`, { duration: 2000 });
        //       this.ficisEditing = false;
        //       this.ficfield = {};
        //       this.ficEditOpen = false;
        //     } else {
        //       alert("新增失敗!：" + res.data);
        //     }
        //   })
        //   .catch(error => {
        //     alert("新增失敗!：" + error.message);
        //   })
        //   .finally(() => {
        //     this.getficdata();
        //   });
      }
    },
    //取得成份類別及細項
    getficwithdetaildata: async function() {
      this.ficwithdetail = [];
      let getFeedCategoryItemList = await this.getFeedCategoryItemList();
      let data = typeof (getFeedCategoryItemList)=='string'?[]:getFeedCategoryItemList;
      this.ficwithdetail = data;
      console.log('成份細項',this.ficwithdetail);
      if(this.tablindex=='成份設定') {
        this.manuFilterData = this.fing.filter(x => x.feed_ingredient_category_id == this.fic_idx);
      }
      this.isLoading = true;
      // let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-category-and-items/`;
      // await this.$axios
      //   .get(url)
      //   .then(res => {
      //     this.ficwithdetail = res.data;
          
      //     console.log('成份細項',this.ficwithdetail);
      //     if(this.tablindex=='成份設定') {
      //       this.manuFilterData = this.fing.filter(x => x.feed_ingredient_category_id == this.fic_idx);
            
      //     }
      //     this.isLoading = true;
      //     console.log("取得成份類別及細項API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.ficwithdetail = [];
      //     this.$toast.error(`取得成份類別及細項失敗:${error}`, {
      //       duration: 2000
      //     });
      //   })
      //   .finally(() => {
      //     //this.getdata();
      //   });
    },
    //取得成份類別清單
    getficdata: async function() {
      // this.fic_idx = null; //還原成未選
      this.feed_ingredient_category = [];
      let getFeedIngredientCategoryList = await this.getFeedIngredientCategoryList();
      let data = typeof (getFeedIngredientCategoryList)=='string'?[]:getFeedIngredientCategoryList;
      this.feed_ingredient_category = data;
      this.ficselect();
      // let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/`;
      // await this.$axios
      //   .get(url)
      //   .then(res => {
      //     this.feed_ingredient_category = res.data;
      //     this.ficselect();
      //     console.log('成份類別',this.feed_ingredient_category);
      //     console.log("取得成份類別清單API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.$toast.error(`取得成份類別清單失敗:${error}`, {
      //       duration: 2000
      //     });
      //   })
      //   .finally(() => {
      //     //this.getdata();
      //   });
    },
    mainchange: async function() {
      var formula = {};
      var formula_remark = {};
      for (let i = 0; i < this.combofield.main_items.length; i++) {
        var parmid = this.combofield.main_items[i];
        formula[parmid] = this.main_formula[parmid];
        formula_remark[parmid] = this.main_formula[parmid];
      }
      //{6: '0.8*154'} 糖1的id:糖1的公式
      this.main_formula = formula;
      this.main_formula_remark = formula_remark;
    },
    subchange: async function() {
      // var items = Object.keys(this.sub_formula);
      var formula = {};
      var formula_remark = {};
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
    comboedit: async function() {
      let val = this.$refs.manform.validate();
      let isNull = true;
      if((this.combofield.main_items&&this.combofield.main_items.length>0)||(this.combofield.sub_items&&this.combofield.sub_items.length>0)) {
        isNull = false;
      }
      this.comboNull = isNull;
      if (val&&!this.comboNull) {
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
          const value = this.main_formula[id];
          const remark = this.main_formula_remark[id];
          main.push({ id: id, formula: value, remark: remark });
        }
        parms.main_items = main;
        //次成份
        delete parms.sub_items;
        var sub = [];
        for (let i = 0; i < Object.keys(this.sub_formula).length; i++) {
          const id = Object.keys(this.sub_formula)[i];
          const value = this.sub_formula[id];
          const remark = this.sub_formula_remark[id];
          sub.push({ id: id, formula: value, remark: remark });
        }
        parms.sub_items = sub;
        parms.updated_user = this.$auth.$state.user.email;
        //刪掉不要的
        delete parms.created_time;
        delete parms.created_user;
        delete parms.id;
        delete parms.updated_time;
        var res = false;
        res = this.patchFeedSettingList(parms,id);
        setTimeout(()=>{
            if(res) {
              this.combofield = {};
              this.comboisEditing = false;
              this.combomode = "add";
              this.editForm = false;
              this.getcombodata();
            }
        },50)
        // await this.$axios
        //   .patch(url, parms)
        //   .then(res => {
        //     if (res.data == "修改成功") {
        //       this.$toast.success(`修改套餐清單(飼料設定)成功`, {
        //         duration: 2000
        //       });
        //       this.combofield = {};
        //       // this.comboidx = null;
        //       this.comboisEditing = false;
        //       this.combomode = "add";
        //       this.editForm = false;
        //       this.getcombodata();
        //       console.log(
        //         "修改套餐清單(飼料設定)API:" + res.request.responseURL
        //       );
        //     } else {
        //       this.$toast.error(`修改套餐清單(飼料設定)失敗:${res.data}`, {
        //         duration: 2000
        //       });
        //     }
        //   })
        //   .catch(error => {
        //     this.$toast.error(`修改套餐清單(飼料設定)失敗:${error}`, {
        //       duration: 2000
        //     });
        //   })
        //   .finally(() => {});
      }
    },
    expandSelect(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.id); //Expand only the current row id
        }
      } else {
        //Description is put away
        this.expands = [];
      }
      // console.log("expand row:", row);
    },
    //刪除套餐清單(飼料設定)
    combodelete: async function(id) {
      // var id = this.combofield.id;
      var name = this.combo.filter(x=>x.id==id)[0].name_ch;
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/${id}/`;
      if (confirm("是否刪除?-" + name)) {
        var res = false;
        res = this.deleteFeedSettingList(id);
        setTimeout(()=>{
            if(res) {
              this.comboisEditing = false;
              this.comboidx = null;
              this.combofield = {};
              this.combomode = "add"; //回到新增模式
              this.getcombodata();
            }
        },50)
        // await this.$axios
        //   .delete(url)
        //   .then(res => {
        //     if (res.data == "刪除成功") {
        //       this.$toast.success(`刪除成功`, { duration: 2000 });
        //       this.comboisEditing = false;
        //       this.comboidx = null;
        //       this.combofield = {};
        //       this.combomode = "add"; //回到新增模式
        //       this.getcombodata();
        //     } else {
        //       this.$toast.error(`刪除失敗${res.data}`, { duration: 2000 });
        //     }
        //   })
        //   .catch(error => {
        //     alert("刪除失敗!：" + error.message);
        //   })
        //   .finally(() => {
        //     // this.getcombodata();
        //   });
      }
    },
    async comboenable(item,bool) {
      if (confirm((bool?"請確認是否啟用 - ":"請確認是否停用 - ") + item.name_ch+"?")) {
        var id = item.id;
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/${id}/`;
        var parms = _.cloneDeep(item);
        parms.is_enable = bool;
        //主成份
        delete parms.main_items;
        var main = [];
        // this.combofield.main_items.forEach(element => {
        //   main.push({id:element});
        // });
        for (let i = 0; i < Object.keys(this.main_formula).length; i++) {
          const id = Object.keys(this.main_formula)[i];
          const value = this.main_formula[id];
          const remark = this.main_formula_remark[id];
          main.push({ id: id, formula: value, remark: remark });
        }
        parms.main_items = main;
        //次成份
        delete parms.sub_items;
        var sub = [];
        for (let i = 0; i < Object.keys(this.sub_formula).length; i++) {
          const id = Object.keys(this.sub_formula)[i];
          const value = this.sub_formula[id];
          const remark = this.sub_formula_remark[id];
          sub.push({ id: id, formula: value, remark: remark });
        }
        parms.sub_items = sub;
        parms.updated_user = this.$auth.$state.user.email;
        //刪掉不要的
        delete parms.created_time;
        delete parms.created_user;
        delete parms.id;
        delete parms.updated_time;
        var res = false;
        res = this.patchFeedSettingList(parms,id);
        setTimeout(()=>{
            if(res) {
              this.getcombodata();
            }
        },50)
        // await this.$axios
        //   .patch(url, parms)
        //   .then(res => {
        //     if (res.data == "修改成功") {
        //       this.$toast.success(`修改套餐清單(飼料設定)成功`, {
        //         duration: 2000
        //       });
        //       this.getcombodata();
        //       console.log(
        //         "修改套餐清單(飼料設定)API:" + res.request.responseURL
        //       );
        //     } else {
        //       this.$toast.error(`修改套餐清單(飼料設定)失敗:${res.data}`, {
        //         duration: 2000
        //       });
        //     }
        //   })
        //   .catch(error => {
        //     this.$toast.error(`修改套餐清單(飼料設定)失敗:${error}`, {
        //       duration: 2000
        //     });
        //   })
        //   .finally(() => {});
      }
      
    },
    //停用套餐清單(飼料設定)
    //選擇套餐清單(飼料設定)
    comboselect: async function() {
      console.log('combo select',this.comboidx);
      if (this.combo.filter(x => x.id == this.comboidx).length > 0) {
        //edit mode
        this.combomode = "edit";
        this.combofield = _.cloneDeep(
          this.combo.filter(x => x.id == this.comboidx)[0]
        );
        this.combofingData();
      } else {
        //add mode
        this.combomode = "add";
        this.combofield = {};
        this.manuFilterData = [];
      }
      if(this.comboidx && this.comboidx!==null) {
        this.manuFilterData =  _.cloneDeep(this.combo.filter(x => x.id == this.comboidx));
      }else {
        this.manuFilterData = _.cloneDeep(this.combo);
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
      this.comboisEditing = false; //只要select change就關閉編輯套餐清單
      
      this.checkTemp();
      // this.getparmdata();//參數清單
    },
    // 整理主/次成分資料
    combofingData() {
      //主成份
      var main = [];
      var m_formula = {};
      var m_formula_remark = {};
      this.combofield.main_items.forEach(element => {
        main.push(element.id);
        m_formula[element.id] = element.formula; //公式
        m_formula_remark[element.id] = element.remark; //公式備註
      });
      this.combofield.main_items = main;
      this.main_formula = m_formula;
      this.main_formula_remark = m_formula_remark;
      //次成份
      //sub_formula
      var sub_items = [];
      var sub = {};
      var sub_fla_remark = {};
      this.combofield.sub_items.forEach(element => {
        sub_items.push(element.id);
        //公式
        sub[element.id] = element.formula;
        //公式備註
        sub_fla_remark[element.id] = element.remark;
      });
      this.combofield.sub_items = sub_items;
      this.sub_formula = sub;
      this.sub_formula_remark = sub_fla_remark;
    },
    //新增套餐清單(飼料設定)
    combosubmit: async function() {
      let val = this.$refs.manform.validate();
      let isNull = true;
      if((this.combofield.main_items&&this.combofield.main_items.length>0)||(this.combofield.sub_items&&this.combofield.sub_items.length>0)) {
        isNull = false;
      }
      this.comboNull = isNull;
      if (val && !isNull) {
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/`;
        var parms = _.cloneDeep(this.combofield);
        parms.is_enable = true;
        //主成份
        delete parms.main_items;
        var main = [];
        // this.combofield.main_items.forEach(element => {
        //   main.push({id:element});
        // });
        for (let i = 0; i < Object.keys(this.main_formula).length; i++) {
          const id = Object.keys(this.main_formula)[i];
          const value = this.main_formula[id];
          const remark = this.main_formula_remark[id];
          main.push({ id: id, formula: value, remark: remark });
        }
        parms.main_items = main;
        //次成份
        delete parms.sub_items;
        var sub = [];
        for (let i = 0; i < Object.keys(this.sub_formula).length; i++) {
          const id = Object.keys(this.sub_formula)[i];
          const value = this.sub_formula[id];
          const remark = this.sub_formula_remark[id];
          sub.push({ id: id, formula: value, remark: remark });
        }
        parms.sub_items = sub;
        parms.created_user = this.$auth.$state.user.email;
        var res = false;
        res = this.postFeedSettingList(parms);
        setTimeout(()=>{
            if(res) {
              this.combofield = {};
              // this.comboidx = null;
              this.comboisEditing = false;
              this.editForm = false;
              this.getcombodata();
            }
        },50)
        // await this.$axios
        //   .post(url, parms)
        //   .then(res => {
        //     if (res.data == "新增成功") {
        //       this.$toast.success(`新增套餐清單(飼料設定)成功`, {
        //         duration: 2000
        //       });
        //       this.combofield = {};
        //       // this.comboidx = null;
        //       this.comboisEditing = false;
        //       this.editForm = false;
        //       this.getcombodata();
        //       console.log(
        //         "新增套餐清單(飼料設定)API:" + res.request.responseURL
        //       );
        //     } else {
        //       this.$toast.error(`新增套餐清單(飼料設定)失敗:${res.data}`, {
        //         duration: 2000
        //       });
        //     }
        //   })
        //   .catch(error => {
        //     this.$toast.error(`新增套餐清單(飼料設定)失敗:${error}`, {
        //       duration: 2000
        //     });
        //   })
        //   .finally(() => {});
      }
    },
    //取得套餐清單(飼料設定)
    getcombodata: async function() {
      this.combo = [];
      let getFeedSettingList = await this.getFeedSettingList();
      let feedSettingData = typeof (getFeedSettingList)=='string'?[]:getFeedSettingList;
      this.combo = feedSettingData;
      this.combofield = {};
      this.comboselect();
      // let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/`;
      // await this.$axios
      //   .get(url)
      //   .then(res => {
      //     this.combo = res.data;
      //     // this.comboidx = null;
      //     this.combofield = {};
      //     this.comboselect();
      //     // if(this.comboidx==null) {
      //     //   this.manuFilterData = _.cloneDeep(this.combo);
      //     // }else {
      //     //   this.manuFilterData = _.cloneDeep(this.combo.filter(x=>x.id==this.comboidx)[0]);
      //     // }
          
      //     console.log("取得得套餐清單(飼料設定)API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.$toast.error(`取得得套餐清單(飼料設定)失敗:${error}`, {
      //       duration: 2000
      //     });
      //   })
      //   .finally(() => {
      //     //this.getdata();
      //   });
    },
    //成份編輯狀態改變
    fingeditchange: function() {
      this.fingisEditing = !this.fingisEditing;
      if (this.fingisEditing == false) {
        this.fingfield = {};
        this.fingfield.feed_ingredient_category_id=this.fic_idx;
      }
    },
    //成份清單，單一項目被選到
    fingchipclick: function() {
      if (this.fingchip == null || this.fingchip == undefined) {
        this.fingmode = "add";
        this.fingfield = {};
        this.fingparam = []; //成份參數(下拉選項)
        this.fingparamitem = {};//下拉後的細部數值
        this.fingfield.feed_ingredient_category_id = this.fic_idx;
      } else {
        this.fingmode = "edit";
        var parms = _.cloneDeep(
          this.fing.filter(x => x.id == this.fingchip)[0]
        );
        // this.fingfield.name = this.fing[this.fingchip].name;
        delete parms["created_time"]; //刪去不必要欄位
        delete parms["created_user"];
        delete parms["updated_user"];
        delete parms["updated_time"];
        this.fingfield = parms;
        // parms["parameters"] =
        //參數下拉清單 - 重新指定
        this.fingparam = parms["parameters"].map(x => x.id);
        this.fingparamitem = {};
        this.fingparam.forEach(element => {
          this.fingparamitem[element] = parms["parameters"].filter(
            x => x.id == element
          )[0].value;
        });
      }
    },
    //編輯成份
    fingedit: async function() {
      console.log(this.editItem);
      let parameters = [];
      this.fingparam.forEach(element => {
        parameters.push({ id: element, value: this.fingparamitem[element] });
      });
      this.editItem.parameters = parameters;
      let parms = _.cloneDeep(this.editItem);
      parms.updated_user = this.$auth.$state.user.email;
      let val = this.$refs.manform.validate();
      if (val) {
        let id = parms["id"];
        delete parms["id"];
        var res = false;
        res = this.patchFeedIngredientList(parms,id);
        setTimeout(()=>{
          if(res) {
            this.fingfield = {};
            this.editItem = {};
            this.fingisEditing = false;
            this.fingchip = null;
            this.fingparam = []; //成份參數
            this.fingparamitem = {};
            this.editForm = false;
          }
          this.getfingdata(); //成份清單
        },50)
        // let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/${id}/  `;
        // await this.$axios
        //   .patch(url, parms)
        //   .then(res => {
        //     if (res.data == "修改成功") {
        //       this.$toast.success(`修改成功`, { duration: 2000 });
        //       this.fingfield = {};
        //       this.editItem = {};
        //       this.fingisEditing = false;
        //       this.fingchip = null;
        //       this.fingparam = []; //成份參數
        //       this.fingparamitem = {};
        //       this.editForm = false;
        //     } else {
        //       alert("修改失敗!：" + res.data);
        //     }
        //   })
        //   .catch(error => {
        //     alert("修改失敗!：" + error.message);
        //   })
        //   .finally(() => {
        //     this.getfingdata(); //成份清單
        //     // this.getficwithdetaildata(); //取得成份類別及細項
        //   });
      }
    },
    //刪除成份
    fingdelete: async function(id) {
      // let id = this.fingfield["id"];
      // console.log('delete',this.manuFilterData.filter(x=>x.id==id))
      let name = this.manuFilterData.filter(x=>x.id==id)[0].name;
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/${id}/`;
      if (confirm("是否刪除?-" + name)) {
        var res = false;
        res = this.deleteFeedIngredientList(id);
        setTimeout(()=>{
            if(res) {
              this.fingfield = {};
              this.fingisEditing = false;
            }
            this.getfingdata(); //成份清單
        },50)
        // await this.$axios
        //   .delete(url)
        //   .then(res => {
        //     if (res.data == "刪除成功") {
        //       this.$toast.success(`刪除成功`, { duration: 2000 });
        //       this.fingfield = {};
        //       this.fingisEditing = false;
        //     } else {
        //       this.$toast.error(`刪除失敗${res.data}`, { duration: 2000 });
        //     }
        //   })
        //   .catch(error => {
        //     alert(`刪除失敗：${error.message}`);
        //   })
        //   .finally(() => {
        //     this.getfingdata(); //成份清單
        //     // this.getficwithdetaildata(); //取得成份類別及細項
        //   });
      }
    },
    //新增成份
    fingsubmit: async function() {
      let parameters = [];
      this.fingfield = _.cloneDeep(this.editItem);
      this.fingparam.forEach(element => {
        parameters.push({ id: element, value: this.fingparamitem[element] });
      });
      this.fingfield.parameters = parameters;
      
      let val = this.$refs.manform.validate();
      console.log(val,this.fingfield);
      if (val) {
        this.fingfield.created_user = this.$auth.$state.user.email;
        //--
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/`;
        let parms = this.fingfield;
        parms.created_user = this.$auth.$state.user.email;
        var res = false;
        res = this.postFeedIngredientList(parms);
        setTimeout(()=>{
            if(res) {
              this.fingfield = {};
              this.fingfield.feed_ingredient_category_id = this.fic_idx;//並沒有清空類別，所以保留
              this.fingparam = []; //成份參數
              this.fingparamitem = {};
              this.fingisEditing = false;
              this.editForm = false;
            }
            this.getfingdata();
        },50)
        // await this.$axios
        //   .post(url, parms)
        //   .then(res => {
        //     if (res.data == "新增成功") {
        //       this.$toast.success(`新增成功`, { duration: 2000 });
        //       this.fingfield = {};
        //       this.fingfield.feed_ingredient_category_id = this.fic_idx;//並沒有清空類別，所以保留
        //       this.fingparam = []; //成份參數
        //       this.fingparamitem = {};
        //       this.fingisEditing = false;
        //       this.editForm = false;
        //     } else {
        //       alert("新增失敗!：" + res.data);
        //     }
        //   })
        //   .catch(error => {
        //     alert("新增失敗!：" + error.message);
        //   })
        //   .finally(() => {
        //     this.getfingdata();
        //     // this.getficwithdetaildata(); //取得成份類別及細項
        //   });
      }
    },
    //取得成份清單
    getfingdata: async function() {
      // this.fiidx=null;//還原成未選
      this.fing = [];
      let getFeedIngredientList = await this.getFeedIngredientList();
      let data = typeof (getFeedIngredientList)=='string'?[]:getFeedIngredientList;
      this.fing = data;
      this.getficwithdetaildata();
      // let url = `${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/`;
      // await this.$axios
      //   .get(url)
      //   .then(res => {
      //     this.fing = res.data;
      //     console.log("取得成份清單API:" + res.request.responseURL);
      //     this.getficwithdetaildata();
      //   })
      //   .catch(error => {
      //     this.$toast.error(`取得成份清單失敗:${error}`, { duration: 2000 });
      //   })
      //   .finally(() => {
      //     //this.getdata();
      //   });
    },
    //顯示參數視窗
    showparam: function() {
      this.parmfield = {};
      this.dialog.param = true;
    },
    //取得參數清單
    getparmdata: async function() {
      this.parmdata = [];
      let getParameterList = await this.getParameterList();
      let data = typeof (getParameterList)=='string'?[]:getParameterList;
      this.parmdata = data;
      // let url = `${this.$store.state.mydata.gobal_api.apiUrl}/parameter/`;
      // await this.$axios
      //   .get(url)
      //   .then(res => {
      //     this.parmdata = res.data;
      //     console.log("取得參數清單API:" + res.request.responseURL);
      //   })
      //   .catch(error => {
      //     this.$toast.error(`取得參數清單失敗:${error}`, { duration: 2000 });
      //   })
      //   .finally(() => {});
    },
    //新增參數
    parmsubmit: async function() {
      let val = this.$refs.parmform.validate();
      if (val) {
        let url = `${this.$store.state.mydata.gobal_api.apiUrl}/parameter/`;
        let parms = this.parmfield;
        parms.created_user = this.$auth.$state.user.email;
        var res = false;
        res = this.postParameterList(parms);
        setTimeout(()=>{
            if(res) {
              this.parmfield = {};
              this.dialog.param = false;
            }
            this.getparmdata();
        },50)
        // await this.$axios
        //   .post(url, parms)
        //   .then(res => {
        //     if (res.data == "新增成功") {
        //       //this.getdata();新增未必有選到所有選項
        //       this.parmfield = {};
        //       this.dialog.param = false;
        //       this.$toast.success(`新增成功`, { duration: 2000 });
        //     } else {
        //       this.$toast.error(`新增失敗:${res.data}`, { duration: 2000 });
        //     }
        //   })
        //   .catch(error => {
        //     alert("新增成份參數失敗!：" + error.message);
        //   })
        //   .finally(() => {
        //     this.getparmdata();
        //   });
      }
    },
    // getRnd:function(){
    //     return Math.floor(Math.random() * 1000);
    // },
    openEdit(id) {
      this.editForm = true;
      this.comboNull = false;
      this.mode = 'edit';
      if(this.tablindex == '廠商設定') {
        this.editItem = _.cloneDeep(this.manu.filter(x=>x.id==id)[0]);
      }else if(this.tablindex == '成份設定') {
        this.editItem = _.cloneDeep(this.manuFilterData.filter(x=>x.id==id)[0]);
        this.fingchip = this.editItem.id;
        this.fingchipclick();
        console.log('open edit',this.editItem,this.parmdata);
      }else if(this.tablindex == '套餐設定') {
        this.combofield = _.cloneDeep(
          this.combo.filter(x => x.id == id)[0]
        );
        this.combofingData();
        console.log('open edit',this.combofield);
      }
    },
    editsave() {
      if(this.tablindex == '廠商設定') {
        this.manuedit();
      }else if(this.tablindex == '成份設定') {
        this.editItem.manufacturer_id = this.fingfield.manufacturer_id
        this.fingedit();
      }else if(this.tablindex == '套餐設定') {
        this.comboedit();
      }
      // this.editForm = false;
    },
    openAdd() {
      this.editForm = true;
      this.comboNull = false;
      this.mode = 'add';
      if (this.$refs.manform != undefined) {
          this.$refs.manform.reset();
      }
      this.editItem = {};
      if(this.tablindex == '成份設定') {
        if(this.fic_idx) {
          this.editItem.feed_ingredient_category_id = _.cloneDeep(this.fic_idx);
        }else {
          this.editItem.feed_ingredient_category_id = _.cloneDeep(this.feed_ingredient_category[0].id);
        }
        this.fingfield.manufacturer_id = null;
        
        console.log('add open',this.parmdata);
      }else if(this.tablindex == '套餐設定') {
        this.combofield = {};
        this.fingparam = []; //成份參數
        this.fingparamitem = {};
        this.sub_formula = {};
        this.main_formula = {};
      }
      // if(this.tablindex == '廠商設定') {
      //   this.editItem = {};
      //   // this.editItem = this.manu.filter(x=>x.id==id)[0];
      // }else if(this.tablindex == '廠商設定') {
      //   this.editItem = {};
      //   // this.editItem = this.manu.filter(x=>x.id==id)[0];
      // }
      
    },
    addsave() {
      if(this.tablindex == '廠商設定') {
        this.manusubmit();
      }else if(this.tablindex == '成份設定') {
        // console.log('add',this.editItem,this.fingparam,this.fingparamitem);
        this.editItem.manufacturer_id = this.fingfield.manufacturer_id
        this.fingsubmit();
      }else if(this.tablindex == '套餐設定') {
        this.combosubmit()
      }
      // this.editForm = false;
    },
    // 過濾套餐是否顯示停用
    checkTemp() {
      console.log('Enable',this.comboidx,this.isEnable,this.combo)
      let nowData = _.cloneDeep(this.comboidx==null?this.combo:this.combo.filter(x => x.id == this.comboidx));
      if(this.isEnable) {
          this.manuFilterData = _.cloneDeep(nowData);
          this.combodatas = _.cloneDeep(this.combo);
      }else {
          this.manuFilterData = _.cloneDeep(nowData.filter(x => x.is_enable==true));
          this.combodatas = _.cloneDeep(this.combo.filter(x => x.is_enable==true));
      }
        
    }
  },
  async created() {
    await this._pageCheck(); //驗證頁面是否可檢視
  },
  watch:{
    tablindex() {
      if(this.tablindex == '廠商設定') {
        this.manuidx = undefined;
        this.manuFilterData = [];
        this.manuFilterData = _.cloneDeep(this.manu);
        // this.manselect();

      }else if(this.tablindex == '成份設定') {
        this.fic_idx = this.feed_ingredient_category[0].id;
        this.manuFilterData = [];
        this.ficselect();
        // this.manuFilterData = _.cloneDeep(this.ficwithdetail);
      }else if(this.tablindex == '套餐設定') {
        // this.comboidx = this.combo[0].id;
        this.comboidx = null;
        // this.manuFilterData = [];
        this.isEnable = false;
        this.comboselect();

      }
      console.log('tabs change',this.manuFilterData);
    }
  }
};
</script>
<style lang="scss" scoped>
/* .tabitembg {
  background-color: #fafafa;
} */
.v-card.result-card {
    &.item-card.theme--light {
        background-color: #fff;
    }
}
.chips {
  margin: 0 8px;
}

.main-items {
  @include size(100%);
  border: 1px solid $color-primary;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
}
.sub-border {
  border-color: $color-dark-25;
}
.meal-item {
  align-items: center;
  margin: 0 8px;
  border-bottom: 1px solid $color-black-10;
  margin-bottom: 8px;
 
}
::v-deep {
  .result .header-bar .theme--light.v-tabs > .v-tabs-bar {
    background: #fff;
  }
  
  .theme--light.v-data-table.v-data-table--fixed-header thead th {
    background: $color-lighten;
  }
  .theme--light.v-data-table,.v-toolbar__content, .v-toolbar__extension {
    background-color: $color-lighten;
  }
  .theme--light.v-data-table,.theme--light.v-toolbar.v-sheet {
      background-color: $color-lighten;
  }
  .v-data-table > .v-data-table__wrapper > table {
    height: 100%;
  }
  .v-dialog .v-sheet.v-card.custom-dialog .v-text-field.items {
      .v-chip.v-size--default {
        padding: 0 8px;
        background-color: $color-primary-75;
        color: #fff;
        margin: 2px;
        height: 24px;
        span {
          font-size: 0.8rem;
        }
      }
      .theme--light.v-icon {
        color: #fff;
      }
      &.v-select.v-text-field--enclosed:not(.v-text-field--single-line):not(.v-text-field--outlined) .v-select__selections {
        padding-top: 12px;
      }
      &.sub_chips {
        .v-chip.v-size--default {
          background: $color-dark-25;
          color: $color-dark;
        }
      }
    }
  .v-chip.v-chip--outlined.v-chip.v-chip,.v-chip.v-chip.v-chip.item-chip {
    height: 24px;
    margin: 4px 2px;
    // border-color: $color-primary;
    // color: $color-primary;
    background-color: $color-primary-25;
    color: $color-dark;
    border-color: transparent;
    span {
      font-size: 0.8rem;
    }
  }
  .v-chip--label {
    border-radius: 12px !important;
  }

  .v-chip .v-chip__content {
    justify-content: center;
  }
  .v-select.v-text-field--enclosed:not(.v-text-field--single-line):not(.v-text-field--outlined) .v-select__selections {
    padding-top: 8px;
  }
  .v-data-table--fixed-header > .v-data-table__wrapper {
    overflow-y: hidden;
  }

}
</style>
