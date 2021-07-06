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
export default {
  data() {
    return {
      selectedItem: "",
      divclass: "noediteditem",
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

    showSelect: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectchecked: function() {
      console.log("oradata:", this.item);
      console.log("newdata:", this.selectedItem);
      this.item.state = this.selectedItem;
    },
    changeEvent: function() {
      if (this.showSelect && this.selectedItem) {
        this.divclass = "editeditem";
      }else{
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
