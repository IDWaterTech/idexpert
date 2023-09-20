<template>
  <div class="input-pool" :class="{'text-center':!showSelect}">
    <button class="confirm" v-show="showSelect && item.state != '' && selectedItem !== '' && selectedItem !== item.state" @click="selectchecked">
      <v-icon>mdi-check</v-icon>
    </button>
    
    <span
      v-if="item.state.length > 0"
      v-show="item.state != '' || showSelect"
      >{{ item.name }}-{{ item.state.includes('(')?item.state.split('(')[0]:item.state}}</span>
    <span v-if="item.state.includes('(')"><br>( {{ item.state.split('(')[1] }}</span>
    
    
    <span class="update-time" v-if="item.state.length > 0" v-show="showSelect && item.state != ''"><br>{{item.updated_time}}</span>
    <v-select
      v-model="selectedItem"
      :items="selitem.filter(x => x.name != 'default')"
      item-text="name"
      label="池況"
      v-show="showSelect && item.state != ''"
      @change="changeEvent" dense
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
    },
    successDataID: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectchecked: async function() {
      if( this.item.state == this.selectedItem){
        this.$toast.error(`修改失敗，無異動「before:${this.item.state} after:${this.selectedItem}」`, { duration: 2000 }); return;
      }
      
      console.log("oradata:", this.item);
      console.log("newdata:", this.selectedItem);
      // console.log("selitem",this.selitem);
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
          .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-to-state/${this.item.id}/`, parm, {
            httpsAgent: agent
          })
          .then(res => {
            if (res.data == "修改成功") {
              let evt={
                item: this.item,
                value: this.selectedItem
              }
              this.item.state = this.selectedItem;
              this.$toast.success(`修改成功`, { duration: 2000 });
              this.$emit('saveSuccess',evt);
              this.selectedItem = '';
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
      let edit = {
        item: this.item,
        value: this.selectedItem
      }
      // console.log('emit',edit);
      this.$emit('editPool',edit);
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
  },
  watch: {
    successDataID() {
      if(this.successDataID.length>0 && this.successDataID.includes(this.item.id)) {
        // console.log(this.successDataID);
        this.selectedItem = '';
      }
    },
    showSelect() {
      if(!this.showSelect) {
        this.selectedItem ='';
      }
    }
  }
};
</script>

<style lang="scss">
.editeditem {
  border: 3px red dotted;
  padding: 4px;
}
.noediteditem {
  border: 0px red dotted;
  text-align: left;
}

.update-time {
  font-size: 12px;
}
.v-application{
  .v-card.map {
    .input-pool {
      text-align: left;
      .confirm {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        background-color: #006AA6;
        float: right;
        box-shadow: 0 0 5px rgba(0,0,0,0.15);
        transition: 0.3s;
        &:hover {
          background-color: lighten($color: #006AA6, $amount: 1.5);
        }
        .theme--light.v-icon {
          color: #fff;
          font-size: 14px;
        }
      }
      .primary--text {
          color: #00273E !important;
          caret-color: #00273E !important;
      }
    }
  }
  
}
.v-input {
  margin-top: 20px;
}


</style>
