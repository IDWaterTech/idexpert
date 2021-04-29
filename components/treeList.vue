<template>
<!-- 沒有用處，但先保留程式 -->
  <div>
    <v-list>
      <div v-for="(item, index) in items2" :key="index">
          <v-chip class="ma-2" v-if="item.type">
            {{item}}
          </v-chip>
        <v-list-item v-if="item.type">
          <v-list-item-title v-text="'123:' + item.name"></v-list-item-title>
          
        </v-list-item>
        <v-list-group v-else prepend-icon="mdi-account-circle">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(child, idx) in item.pond_area" :key="idx">
            <treeitems :items2="item.pond_area"> </treeitems>
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </div>
</template>

<script>
export default {
  props: ["items2"],
  name: "treeitems"
};
</script>

<style scoped></style>
