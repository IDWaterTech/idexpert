<template>
  <v-row justify="center" align="center" class="text-center mb-5"  style="color:white;">
    <v-col cols="12">
      <h1>歡迎使用 IDWater 專家系統</h1>
      <h1>WelCome IDWater Expert System</h1>
    </v-col>
    <v-col cols="12" class="text-justify px-16">
      <h2>關於-ABOUT</h2>
      <div class="headline">
        我們正在通過人工智能和物聯網技術建設環境可持續的智能養蝦場，以解決傳統水產養殖的三大問題。
      </div>
      <div class="headline">
        We are building environmentally sustainable smart shrimp farms with AI
        plus IoT technologies to solve three major problems of traditional
        aquaculture.
      </div>
    </v-col>
    <v-col cols="12">
      <div v-show="!this.$auth.$state.loggedIn">
            <!-- <v-btn
          dark
          large tile
          style="border:0px;"
          @click="loginGoogle"
          :style="{ background: '#4284f4' }"
          color="primary"
          >歡迎使用本系統Login</v-btn
        > -->
        <v-btn
                    dark
                    large tile
                    style="border:0px;"
                    @click="loginGoogle"
                    :style="{ background: '#4284f4' }"
                    color="error" 
                    ><v-icon size="24">mdi-google</v-icon>{{`　以Google登入`}}</v-btn
                  >
          </div>
    </v-col>
    <!-- <v-col cols="12"><nuxt-link to="basic" class="headline">Enter</nuxt-link></v-col> -->
    <v-col cols="12" md="4" class="text-justify">
      <v-card min-height="550px" tile dark color="primary" class="papper_item">
        <!-- <v-card-title class="blue" style="color:black">紅樹林破壞-Mangrove destruction</v-card-title> -->
        <v-card-text class="blue" style="color:black;font-size: 1.2em;">紅樹林破壞-Mangrove destruction</v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-text style="font-size:1.2em;">
          <div align="center">
            <img src="~/assets/Mangrove.png"  height="200px"/>
          </div>
          <div>
            農民開發紅樹林區來建造蝦塘。但每次疾病爆發時，池塘都會被廢棄。事實上，根據環境正義基金會的數據，對蝦養殖佔全球紅樹林損失的 38%（每年高達 10,000 公頃）。
          </div>
          <div>
            Farmers develop mangrove areas to build shrimp ponds. But every time
            when a disease outbreak, the ponds would be abandoned. In fact,
            shrimp farming is accounted for 38% of global mangrove loss (up to
            10,000 hectares each year) according to data from the Environmental
            Justice Foundation.
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4" class="text-justify">
      <v-card min-height="550px" tile dark color="primary" class="papper_item">
        <!-- <v-card-title class="blue" style="color:black">水污染-Water pollution</v-card-title> -->
        <v-card-text class="blue" style="color:black;font-size: 1.2em;">水污染-Water pollution</v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-text style="font-size:1.2em;">
          <div align="center">
            <img src="~/assets/gomi_grease_trap_pit.png"  height="200px"/>
          </div>
          <div>
            養蝦會產生含有氮和磷的高污染水。2018年，中國政府因水質不達標關閉了4萬個蝦池。
          </div>
          <div>
            Shrimp farming generates high polluted water which contains nitrogen
            and phosphorus. In 2018, the Chinese government shut down 40,000
            shrimp ponds due to violating water not following the standard.
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4" class="text-justify">
      <v-card min-height="550px" tile dark color="primary" class="papper_item">
        <!-- <v-card-title class="blue" style="color:black">食品安全-Food safety</v-card-title> -->
        <v-card-text class="blue" style="color:black;font-size: 1.2em;">食品安全-Food safety</v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-text style="font-size:1.2em;">
          <div align="center">
            <img src="~/assets/foodsafety.png"  height="200px"/>
          </div>
          <div>
            30 億人依賴海鮮作為蛋白質的主要來源。然而，在水產養殖中濫用抗生素來對抗疾病。
          </div>
          <div>
            3 Billion people are relying on seafood as a primary source of
            protein. However, Antibiotics have been abused in aquaculture to
            fight against the diseases.
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    
  </v-row>
</template>

<script>
export default {
  layout: "emptynologin",
  methods: {
    async loginGoogle() {
      try {
        await this.$auth.loginWith("google", {
          params: { prompt: "select_account" }
        });
      } catch (err) {
        console.log(err);
        this.$toast.error("登入發生錯誤!:" + err, {
          duration: 5000
        });
      }
    }
  },
  async created() {
    await this._pageCheck();//驗證頁面是否可檢視
  },
};
</script>

<style scoped>
.questionTitle{
  background-color: #055394;
  color: white;
}
.papper_item {
  background: url('~/assets/papper_grape.jpg')
    repeat center center fixed !important;
  background-size: cover;
}
.papper_blue {
  background: url('~/assets/papper_blue.jpg')
    repeat center center fixed !important;
  background-size: cover;
}

</style>
