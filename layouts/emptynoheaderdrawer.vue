<template>
<client-only>
  <v-app>
    <v-main class="papper">
      <v-container fluid class="my-5">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
  </client-only>
</template>

<script>
export default {
  data() {
    return {
     
    };
  },
  async mounted() {
    
  },
};
</script>
<style scoped>
.papper {
  background: url('~/assets/bg_blue_papper.jpg')
    repeat center center fixed !important;
    background-repeat: repeat !important;
  background-size: cover;
}
</style>