<template>
  <div class="input-pool" :class="{'text-center':!showSelect,'basic-block':$route.path=='/basic'}">
    <button class="confirm" v-show="showSelect && item.state != '' && selectedItem !== '' && selectedItem !== item.state" @click="selectchecked">
      <v-icon>mdi-check</v-icon>
    </button>
    <span
      v-if="item.state.length > 0"
      v-show="item.state != '' || showSelect"
      style="z-index: 2;"
      :style="{
        'color':`${$route.path=='/basic'&& 
                  item.state != '無'&& 
                  item.water != ''&&
                  item.level=='danger'?'#fefefe':'#00324E'}`
      }">
      <!-- basic warning/danger icon -->
      <v-btn 
        v-if="$route.path=='/basic'&& item.state != '無'&& item.water != ''&& (item.level=='warning'||item.level=='danger')" 
        class="btn-icon just-icon"
        :class="{'danger-water-icon':item.level=='danger',
                 'warning-water-icon':item.level=='warning'}"
        style="z-index: 2;"
      ><v-icon>mdi-alert</v-icon></v-btn>

      
      <span style="z-index: 2;">{{ item.name }}-{{ item.state.includes('(')?item.state.split('(')[0]:item.state}}</span>
      <span v-if="item.state.includes('(')" style="z-index: 2;"><br>( {{ item.state.split('(')[1] }}</span>
      
    </span>
    <span v-if="item.name=='tank'" style="z-index: 2;">生化槽</span>
    <span v-if="$route.path=='/basic'&& item.state != '無'&& item.water != ''" 
        style="display: flex;align-items: center;justify-content: center;z-index: 2;"
        :class="{'danger-water':item.level=='danger','warning-water':item.level=='warning'}"
      ><span style="font-size: 1.25rem;font-weight: bold;">{{ item.water }} </span> <span style="margin-left: 4px;">{{ item.parm_name=='Do'||item.parm_name=='NO2'||item.parm_name=='NH4'?'ppm':item.parm_name=='Temperature'?'°C':'' }}</span></span>
      <span v-if="item.inspected_time" style="font-size: 12px;" :style="{'color':item.level=='danger'?'#fff':'#00324E'}">{{ item.inspected_time.slice(-5) }}</span>
      <!-- <span v-if="item.inspected_time">{{ item.inspected_time.slice(-5) }}</span> -->

      <!-- :class="{'danger-water':item.level=='danger','warning-water':item.level=='warning'}" -->
    <span v-if="$route.path=='/basic' && !item.water && item.state !== ''" style="z-index: 2;display: flex;align-items: center;justify-content: center;font-size: 1.25rem;">-</span>
    
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
    },
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
.basic-block {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  
  & .danger-water {
    span {
      color: #fefefe;
    }
  }
  & .danger-water-icon.btn-icon.just-icon {
    & .theme--light.v-icon {
      // color: $color-accent !important;
      color: #fefefe !important;
      font-size: 1.2rem;
    }
  }
  & .warning-water-icon.btn-icon.just-icon {
    & .theme--light.v-icon {
      color: #f79c2b !important;
      font-size: 1.2rem;
    }
  }
  & .danger-water-icon.btn-icon.just-icon, & .warning-water-icon.btn-icon.just-icon {
    margin: 0;
    pointer-events: none;
  }
}

</style>
