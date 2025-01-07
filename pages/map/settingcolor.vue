<template>
  <div>
    <v-row class="ml-0 mr-0 align-start">
      <v-col md="4" sm="6">
        <v-card>
          <v-list class="overflow-hidden pb-0" dense style="overflow: hidden;">
            <v-subheader
              ><h2>養殖池狀態-清單</h2>
              <v-spacer></v-spacer
              ><v-icon
                @click="
                  () => {
                    adddialog = true;
                    addItem = {};
                  }
                "
                >mdi-plus</v-icon
              ></v-subheader
            >
            <!-- <v-card-title>
              <h2 style="font-size: 1.2rem;color:rgba(0, 0, 0, 0.6)">養殖池狀態-清單</h2>
              <v-spacer></v-spacer
              ><v-icon
                @click="
                  () => {
                    adddialog = true;
                    addItem = '';
                  }
                "
                >mdi-plus</v-icon
              >
            </v-card-title>
            <div class="content">
              <v-row>
                <v-col cols="4"  v-for="(item, index) in statLst" :key="index" @click="chgcolor(item);selectedItem = index">
                  <v-divider v-if="index < 1" :key="index" light></v-divider>
                  <div class="color-card" style="border-radius: 4px;background-color: #fff;box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <div :key="item.id"
                      class="color-pallete"
                      style="padding: 32px 12px 12px 12px;border-radius: 4px 4px 0 0;"
                      :style="`background-color:${item.color};`">
                      {{ item.name }}
                    </div>
                    <v-divider v-if="index < 1" :key="index" light></v-divider>
                    <div class="color-hex" style="padding: 12px;border-radius: 0 0 4px 4px;font-size: 14px;">
                      {{ item.color }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div> -->

            <v-list-item-group v-model="selectedItem" class="full-width" style=" max-width: inherit;">
              <template v-for="(item, index) in statLst">
                <v-divider v-if="index < 1" :key="index" light></v-divider>
                
                <v-list-item
                  :key="item.id"
                  :style="`background-color:${item.color};`"
                  @click="chgcolor(item)"
                >
                  <!-- <template v-slot:default="{ active }"> -->
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name_ch }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text
                      >{{ item.action }}</v-list-item-action-text>
                      {{ item.color }}
                    </v-list-item-action>
                  <!-- </template> -->
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
        
        
      </v-col>
      <v-col md="6" sm="6">
        <!-- <v-card> -->
          <div
          class="pa-3"
          :disabled="!(selectedItem != undefined && selectedItem > -1)"
        >
            <v-row class="ma-0 mb-3">
              <div
                class="title choose-color pa-1 mr-1"
                :style="
                  `background-color:${
                    selectedItem != undefined && selectedItem > -1
                      ? color
                      : 'lightgrey'
                  }`
                "
                style="max-width: calc(300px - 88px);width: 300px;}"
              >
                <!-- {{(selectedItem!=undefined && selectedItem  > -1)}}-{{selectedItem}} -->
                {{
                  selectedItem != undefined && selectedItem > -1
                    ? `${statLst[selectedItem].name_ch}_${color}`
                    : "請先選擇左側狀態"
                }}
              </div>
              <div
              >
                <v-icon color="green" @click="colorsubmit" size="40"
                  >mdi-checkbox-marked-outline</v-icon
                >
                <v-icon color="red" @click="colordelete" size="40"
                  >mdi-trash-can-outline</v-icon
                >
              </div>
            </v-row>

            <v-color-picker
              v-model="color"
              :disabled="!(selectedItem != undefined && selectedItem > -1)"
              
              mode="hexa"
              canvas-height="300"
              hide-mode-switch
            ></v-color-picker>
          </div>
        <!-- </v-card> -->
        
      </v-col>
    </v-row>
    <!-- 新增狀態顏色 -->
    <v-dialog v-model="adddialog" max-width="500px">
      <v-card class="custom-dialog" style="max-height: inherit;">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-title class="add-title">
            <div class="d-inline-block">
                <span>新增狀態項目</span>
            </div>
            <div class="add">
                <v-btn class="btn-secondary close" title="取消" @click="adddialog = false;">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
          </v-card-title>
          <div class="basic px-3 py-6">
            <v-card-text
            ><v-text-field
              v-model="addItem.name_ch"
              label="新增項目(中文)" filled dense
              :rules="rules.require"
            ></v-text-field
          ></v-card-text>
          <v-card-text
            ><v-text-field
              v-model="addItem.name_en"
              label="新增項目(英文)" filled dense
              :rules="rules.require"
            ></v-text-field
          ></v-card-text>
          </div>
          <v-card-actions
            ><v-spacer></v-spacer
            ><v-btn tile color="primary" @click="coloradd"
              >新增</v-btn
            ></v-card-actions
          >
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import https from "https";
export default {
  layout: "emptynologin",
  middleware: "auth",
  data() {
    return {
      statLst: [],
      selectedItem: -1,
      color: "",
      nochangecolor: ["無", "default"],
      adddialog: false,
      addItem: {},
      valid: true,
      rules: { require: [v => !!v || "*必要項目"] }
    };
  },
  async mounted() {
    //取得水池狀態-清單
    await this.getStatData();
  },
  methods: {
    chgcolor: function(data) {
      if (data.color.substr(0, 1) == "#") {
        this.color = data.color;
      } else {
        this.color = "#BABABA";
      }
    },
    colorsubmit: async function() {
      if (this.nochangecolor.includes(this.statLst[this.selectedItem].name_ch)) {
        this.$toast.error(
          `修改失敗-[ ${
            this.statLst[this.selectedItem].name_ch
          } ]該項目系統禁止修改`,
          { duration: 2000 }
        );
        return;
      }
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      const updUser = this.$auth.$state.user.email;
      let parm = {
        name_ch: this.statLst[this.selectedItem].name_ch,
        name_en:this.statLst[this.selectedItem].name_en,
        color: this.color,
        updated_user: updUser
      };
      let id = this.statLst[this.selectedItem].id;
      var res = false;
      res = await this.patchPondStateColorList(parm,id);
      setTimeout(()=>{
        if(res) {
          this.getStatData();
          this.selectedItem = -1; //設定不選任何項目
          this.$emit('update', parm); 
        }
      },50)
      // await this.$axios
      //   .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/${id}/`, parm, {
      //     httpsAgent: agent
      //   })
      //   .then(res => {
      //     if (res.data == "修改成功") {
      //       this.getStatData();
      //       this.selectedItem = -1; //設定不選任何項目
      //       this.$toast.success(`修改成功`, { duration: 2000 });
      //       this.$emit('update', parm); 
      //     } else {
      //       this.$toast.success(`修改失敗：${res.data}`, { duration: 2000 });
      //     }
      //   })
      //   .catch(error => {
      //     alert("error:" + error.message);
      //   });
    },
    colordelete: async function() {
      if (this.nochangecolor.includes(this.statLst[this.selectedItem].name_ch)) {
        this.$toast.error(
          `刪除失敗-[ ${
            this.statLst[this.selectedItem].name_ch
          } ]該項目系統禁止刪除`,
          { duration: 2000 }
        );
        return;
      }
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      const updUser = this.$auth.$state.user.email;
      // let parm = {
      //   name_ch: this.statLst[this.selectedItem].name_ch,
      //   name_en: this.statLst[this.selectedItem].name_en,
      //   color: this.color,
      //   updated_user: updUser
      // };
      let id = this.statLst[this.selectedItem].id;
      var res = false;
      res = await this.deletePondStateColorList(id);
      setTimeout(()=>{
          if(res) {
            this.getStatData();
            this.selectedItem = -1; //設定不選任何項目
          }
      },50)
      // await this.$axios
      //   .delete(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/${id}/`, parm, {
      //     httpsAgent: agent
      //   })
      //   .then(res => {
      //     if (res.data == "刪除成功") {
      //       this.getStatData();
      //       this.selectedItem = -1; //設定不選任何項目
      //       this.$toast.success("刪除成功", { duration: 2000 });
      //     } else {
      //       this.$toast.success(`刪除失敗：${res.data}`, { duration: 2000 });
      //     }
      //   })
      //   .catch(error => {
      //     alert("error:" + error.message);
      //   });
    },
    coloradd: async function() {
      if (this.nochangecolor.includes(this.addItem.name_ch)) {
        this.$toast.error(`新增失敗-[ ${this.addItem.name_ch} ]該項目系統禁止新增`, {
          duration: 2000
        });
        return;
      }
      let valid = this.$refs.form.validate();
      if (valid) {
        const agent = new https.Agent({
          rejectUnauthorized: false
        });
        const updUser = this.$auth.$state.user.email;
        let parm = {
          name_ch: this.addItem.name_ch,
          name_en:this.addItem.name_en,
          color: "#FFFFFF",
          created_user: updUser
        };
        var res = false;
        res = await this.postPondStateColorList(parm);
        setTimeout(()=>{
            if(res) {
              this.getStatData();
              this.adddialog = false;
              this.selectedItem = -1; //設定不選任何項目
            }
        },50)
        // await this.$axios
        //   .post(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`, parm, {
        //     httpsAgent: agent
        //   })
        //   .then(res => {
        //     if (res.data == "新增成功") {
        //       this.getStatData();
        //       this.adddialog = false;
        //       this.selectedItem = -1; //設定不選任何項目
        //       this.$toast.success(`新增成功`, { duration: 2000 });
        //     } else {
        //       this.$toast.success(`新增失敗：${res.data}`, { duration: 2000 });
        //     }
        //   })
        //   .catch(error => {
        //     alert("error:" + error.message);
        //   });
      } else {
        alert(valid);
      }
    },
    getStatData: async function() {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      let getPondStateList = await this.getPondStateList();
      let data = typeof (getPondStateList)=='string'?[]:getPondStateList;
      this.statLst = data.filter(x => x.name_ch != ""); //不提供保留項;
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`, { httpsAgent: agent })
      //   .then(res => {
      //     this.statLst = res.data.filter(x => x.name_ch != ""); //不提供保留項;
      //   })
      //   .catch(error => {
      //     alert("error:" + error.message);
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-sheet.v-card {
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 4px !important;
}
.choose-color {
  width: calc(100% - 88px);
  border-radius: 4px;
}
.v-color-picker__canvas {
  border-radius: 4px;
}
.v-dialog__content {
  width: inherit;
  @include positionCenter();
}
</style>
