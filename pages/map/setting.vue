<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-card class="mx-auto" max-width="300" tile>
          <v-list dense>
            <v-subheader
              ><h2>養殖池狀態-清單</h2>
              <v-spacer></v-spacer
              ><v-icon
                @click="
                  () => {
                    adddialog = true;
                    addItem = '';
                  }
                "
                >mdi-plus</v-icon
              ></v-subheader
            >

            <v-list-item-group v-model="selectedItem">
              <template v-for="(item, index) in statLst">
                <v-divider v-if="index < 1" :key="index" light></v-divider>
                <v-list-item
                  :key="item.id"
                  :style="`background-color:${item.color};`"
                  @click="chgcolor(item)"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text
                        v-text="item.action"
                      ></v-list-item-action-text>
                      {{ item.color }}
                      <!-- <v-icon color="red">
                        mdi-close-thick
                      </v-icon> -->
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
        <v-dialog v-model="adddialog" max-width="400">
          <v-card>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card-title>新增狀態項目</v-card-title>
              <v-card-text
                ><v-text-field
                  v-model="addItem"
                  placeholder="新增項目" filled dense
                  :rules="rules.require"
                ><span style="width:100px;" slot="prepend">新增項目</span></v-text-field
              ></v-card-text>
              <v-card-actions
                ><v-spacer></v-spacer
                ><v-btn tile color="primary" @click="coloradd"
                  >新增</v-btn
                ></v-card-actions
              >
            </v-form>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="6">
        <v-card
          tile
          width="400px"
          :disabled="!(selectedItem != undefined && selectedItem > -1)"
        >
          <table class="mb-3">
            <tr>
              <td
                class="title"
                :style="
                  `background-color:${
                    selectedItem != undefined && selectedItem > -1
                      ? color
                      : 'lightgrey'
                  };width:300px;`
                "
              >
                <!-- {{(selectedItem!=undefined && selectedItem  > -1)}}-{{selectedItem}} -->
                {{
                  selectedItem != undefined && selectedItem > -1
                    ? `${statLst[selectedItem].name}_${color}`
                    : "請先選擇左側狀態"
                }}
              </td>
              <td
                style="width:100px"
              >
                <v-icon color="green" @click="colorsubmit" size="40"
                  >mdi-checkbox-marked-outline</v-icon
                >
                <v-icon color="red" @click="colordelete" size="40"
                  >mdi-trash-can-outline</v-icon
                >
              </td>
            </tr>
          </table>

          <v-color-picker
            v-model="color"
            :disabled="!(selectedItem != undefined && selectedItem > -1)"
            :hide-canvas="!(selectedItem != undefined && selectedItem > -1)"
            mode="hexa"
            width="400px"
            hide-mode-switch
          ></v-color-picker>
        </v-card>
      </v-col>
    </v-row>
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
      addItem: "",
      valid: true,
      rules: { require: [v => !!v || "*必要項目"] }
    };
  },
  async mounted() {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
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
      if (this.nochangecolor.includes(this.statLst[this.selectedItem].name)) {
        this.$toast.error(
          `修改失敗-[ ${
            this.statLst[this.selectedItem].name
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
        name: this.statLst[this.selectedItem].name,
        color: this.color,
        updated_user: updUser
      };
      let id = this.statLst[this.selectedItem].id;
      await this.$axios
        .patch(`${process.env.apiUrl}/pond-state/${id}/`, parm, {
          httpsAgent: agent
        })
        .then(res => {
          if (res.data == "修改成功") {
            this.getStatData();
            this.selectedItem = -1; //設定不選任何項目
            this.$toast.success(`修改成功`, { duration: 2000 });
            this.$emit('update', parm); 
          } else {
            this.$toast.success(`修改失敗：${res.data}`, { duration: 2000 });
          }
        })
        .catch(error => {
          alert("error:" + error.message);
        });
    },
    colordelete: async function() {
      if (this.nochangecolor.includes(this.statLst[this.selectedItem].name)) {
        this.$toast.error(
          `刪除失敗-[ ${
            this.statLst[this.selectedItem].name
          } ]該項目系統禁止刪除`,
          { duration: 2000 }
        );
        return;
      }
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      const updUser = this.$auth.$state.user.email;
      let parm = {
        name: this.statLst[this.selectedItem].name,
        color: this.color,
        updated_user: updUser
      };
      let id = this.statLst[this.selectedItem].id;
      await this.$axios
        .delete(`${process.env.apiUrl}/pond-state/${id}/`, parm, {
          httpsAgent: agent
        })
        .then(res => {
          if (res.data == "刪除成功") {
            this.getStatData();
            this.selectedItem = -1; //設定不選任何項目
            this.$toast.success("刪除成功", { duration: 2000 });
          } else {
            this.$toast.success(`刪除失敗：${res.data}`, { duration: 2000 });
          }
        })
        .catch(error => {
          alert("error:" + error.message);
        });
    },
    coloradd: async function() {
      if (this.nochangecolor.includes(this.addItem)) {
        this.$toast.error(`新增失敗-[ ${this.addItem} ]該項目系統禁止新增`, {
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
          name: this.addItem,
          color: "#FFFFFF",
          created_user: updUser
        };
        await this.$axios
          .post(`${process.env.apiUrl}/pond-state/`, parm, {
            httpsAgent: agent
          })
          .then(res => {
            if (res.data == "新增成功") {
              this.getStatData();
              this.adddialog = false;
              this.selectedItem = -1; //設定不選任何項目
              this.$toast.success(`新增成功`, { duration: 2000 });
            } else {
              this.$toast.success(`新增失敗：${res.data}`, { duration: 2000 });
            }
          })
          .catch(error => {
            alert("error:" + error.message);
          });
      } else {
        alert(valid);
      }
    },
    getStatData: async function() {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      await this.$axios
        .get(`${process.env.apiUrl}/pond-state/`, { httpsAgent: agent })
        .then(res => {
          this.statLst = res.data.filter(x => x.name != ""); //不提供保留項;
        })
        .catch(error => {
          alert("error:" + error.message);
        });
    }
  }
};
</script>

<style scoped></style>
