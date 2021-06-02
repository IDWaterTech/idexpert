<template>
  <v-row justify="center" align="center" class="text-center">
    <v-col cols="12">
      <h1>WelCome IDWater Expert System</h1>
    </v-col>
    <v-col cols="12" class="text-justify px-16">
        <h2>ABOUT</h2>
        
          <div class="headline">
            We are building environmentally sustainable smart shrimp farms with
            AI plus IoT technologies to solve three major problems of
            traditional aquaculture.
          </div>
    </v-col>
    <v-col cols="12" md="4" class="text-justify">
      <v-card min-height="250px" color="blue-grey lighten-4" tile>
        <v-card-title>Mangrove destruction</v-card-title>
        <v-divider class="mx-4"></v-divider>
        <v-card-text>
          <div>
            Farmers develop mangrove areas to build shrimp ponds. But every time when
      a disease outbreak, the ponds would be abandoned. In fact, shrimp farming
      is accounted for 38% of global mangrove loss (up to 10,000 hectares each
      year) according to data from the Environmental Justice Foundation.
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4" class="text-justify">
      <v-card min-height="250px" color="blue-grey lighten-4" tile>
        <v-card-title>Water pollution</v-card-title>
        <v-divider class="mx-4"></v-divider>
        <v-card-text>
          <div>
            Shrimp farming generates high polluted water which contains nitrogen and
      phosphorus. In 2018, the Chinese government shut down 40,000 shrimp ponds
      due to violating water not following the standard.
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4" class="text-justify">
      <v-card min-height="250px" color="blue-grey lighten-4" tile>
        <v-card-title>Food safety</v-card-title>
        <v-divider class="mx-4"></v-divider>
        <v-card-text>
          <div>
            3 Billion people are relying on seafood as a primary source of protein.
      However, Antibiotics have been abused in aquaculture to fight against the
      diseases.
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col><nuxt-link to="basic" class="display-1">Enter</nuxt-link></v-col>
  </v-row>
</template>

<script>
export default {
  layout: "emptynologin"
};
</script>

<style scoped>
</style>
