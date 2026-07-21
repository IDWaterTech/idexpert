<template>
  <div>
    <v-overlay :value="isLoading" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card class="bg-card result-card mb-3" style="min-height:86vh">
      <!-- 表頭 -->
      <div class="card-title mx-2 my-0 pa-3 border-bottom cursor-pointer">
        <div class="title full-width">
              <v-card-title class="pa-0" style="font-size: 1.1rem;">{{ this.$options.head().title }}</v-card-title>
          </div>
          <div class="chevron">
            <v-btn class="btn-secondary green px-2 py-0"><v-icon>mdi-plus</v-icon> 新增</v-btn>
          </div>
      </div>
      <!-- 清單 -->
      <div class="content full-width">
        <v-data-table no-data-text="無資料" :loading="stockLoading">

        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: "emptynologin",
  middleware: "auth",
  head(){
    return {
      title:"物料庫存",
    }
  },
  data() {
    return {
      isLoading: false,
      stockLoading:false,
    };
  },
  async mounted() {
  }
};
</script>

<style lang="scss" scoped>
.v-card.result-card {
  &.bg-card {
    background-color: #fff;
  }
  .card-title {
    .title {
      font-size: 1rem;
    }
    .chevron {
      @include flexAlignCenter();
    }
  }
}
</style>
