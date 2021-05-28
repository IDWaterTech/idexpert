<template>
  <v-row justify="center" align="center" class="text-center">
    <v-col cols="12">
      <h1>WelCome IDWater Expert System</h1>
      
    </v-col>
    <v-col cols="12" class="text-justify">
      <h1>ABOUT</h1>
      <div class="headline">
        We are building environmentally sustainable smart shrimp farms with AI
        plus IoT technologies to solve three major problems of traditional
        aquaculture.
      </div>
      <h2>Mangrove destruction</h2>
      <div class="headline">
        Farmers develop mangrove areas to build shrimp ponds. But every time
        when a disease outbreak, the ponds would be abandoned. In fact, shrimp
        farming is accounted for 38% of global mangrove loss (up to 10,000
        hectares each year) according to data from the Environmental Justice
        Foundation.
      </div>
      <h2>Water pollution</h2>
      <div class="headline">
        Shrimp farming generates high polluted water which contains nitrogen and
        phosphorus. In 2018, the Chinese government shut down 40,000 shrimp
        ponds due to violating water not following the standard.
      </div>
      <h2>Food safety</h2>
      <div class="headline">
        3 Billion people are relying on seafood as a primary source of protein.
        However, Antibiotics have been abused in aquaculture to fight against
        the diseases.
      </div>
      
    </v-col>
    <v-col><nuxt-link to="basic" class="display-3">Enter</nuxt-link></v-col>
  </v-row>
</template>

<script>
export default {
  layout: "emptynologin"
};
</script>

<style scoped></style>
