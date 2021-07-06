<template>
  <div :class="showdotted ? divclass : ''">
    <span
      v-if="item.state.length > 0"
      :style="item.state == '無' ? 'color:white;' : ''"
      >{{ item.name }}-{{ item.state }}
    </span>

    <v-select
      v-model="selectedItem"
      :items="selitem.filter(x => x.name != 'default')"
      item-text="name"
      label="池況"
      v-show="showSelect"
      append-outer-icon="mdi-check"
      @change="changeEvent"
      @click:append-outer="selectchecked"
    ></v-select>
  </div>
</template>

<script>
import https from "https";
export default {
  data() {
    return {
      selectedItem: "",
      divclass: "noediteditem"
    };
  },
  props: {
    item: {
      type: Object,
      default: function() {
        return {
          name: "defaultname",
          state: "default"
        };
      }
    },
    selitem: {
      type: Array,
      default: function() {
        return [{ name: "default", color: "grey" }];
      }
    },
    myuser: {
      type: String,
      default: "web"
    },
    showSelect: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectchecked: async function() {
      if( this.item.state == this.selectedItem){
        this.$toast.error(`修改失敗，無異動「before:${this.item.state} after:${this.selectedItem}」`, { duration: 2000 }); return;
      }
      
      console.log("oradata:", this.item);
      console.log("newdata:", this.selectedItem);
      let newItems = this.selitem.filter(x => x.name == this.selectedItem); //抓到修改後的狀態id
      if (newItems.length == 1) {
        const parm = {
          id: newItems[0].id,
          updated_user: this.myuser
        };
        const agent = new https.Agent({
          rejectUnauthorized: false
        });
        await this.$axios
          .patch(`https://61.56.172.10/pond-to-state/${this.item.id}/`, parm, {
            httpsAgent: agent
          })
          .then(res => {
            if (res.data == "修改成功") {
              this.item.state = this.selectedItem;
              this.$toast.success(`修改成功`, { duration: 2000 });
            } else {
              alert(res.data);
            }
          })
          .catch(error => {
            alert("error:" + error.message);
          });
      }else{
        this.$toast.error(`修改失敗，找不到狀態id`, { duration: 2000 });
      }
    },
    changeEvent: function() {
      if (this.showSelect && this.selectedItem) {
        this.divclass = "editeditem";
      } else {
        this.divclass = "noediteditem";
      }
    }
  },
  computed: {
    showdotted: function() {
      if (this.showSelect == false) {
        return false;
      }
      if (this.selectedItem == this.item.state) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped>
.editeditem {
  border: 3px red dotted;
}
.noediteditem {
  border: 0px red dotted;
}
</style>
