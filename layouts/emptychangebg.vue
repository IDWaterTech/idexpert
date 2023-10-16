<template>
<client-only>
  <v-app>
    <v-main class="bg">
      <v-container fluid style="height: 100%;position: relative;">
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
.bg {
  background: var(--linear-gradient-dark, linear-gradient(179deg, #00324E 0.78%, #40657A 197.21%));
  /* background: linear-gradient(178deg, #00324E -29.51%, #40657A 140.55%); */
}
</style>