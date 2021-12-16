<template>
<v-row>
    <el-popover placement="top-start" width="300" trigger="hover" popper-class="popoverColor">
      
          <v-row style="color:#FFF;" justify="center" align="center" >
              <v-col cols="12">
                  <h3>氣像資訊</h3>
              </v-col>
              <v-col cols="12">
                  地區:<span>{{location.map(x=>x.name).join()}}</span>_({{ loc.longitude }}/{{ loc.latitude }})<br/>
                  天氣概況：{{weatherdata.weather[0].main}}<br/>
                  說明：{{weatherdata.weather[0].description}}
              </v-col>
              <v-col cols="12" sm="4">
                溫度<br/>{{`${weatherdata.main.temp} °C`}}
              </v-col>
              <v-col cols="12" sm="4">
                氣壓<br/>{{`${weatherdata.main.pressure} hPa`}}
              </v-col>
              <v-col cols="12" sm="4">
                體感溫度<br/>{{`${weatherdata.main.feels_like} °C`}}
              </v-col>
              <v-col cols="12" sm="4">
                濕度<br/>{{`${weatherdata.main.humidity} %`}}
              </v-col>
              <v-col cols="12" sm="4">
                最低溫度<br/>{{`${weatherdata.main.temp_min} °C`}}
              </v-col>
              <v-col cols="12" sm="4">
                最高溫度<br/>{{`${weatherdata.main.temp_max} °C`}}
              </v-col>
              <v-col cols="12" sm="4">
                海平面氣壓<br/>{{`${weatherdata.main.sea_level} hPa`}}
              </v-col>
              <v-col cols="12" sm="4">
                地面大氣壓<br/>{{`${weatherdata.main.grnd_level} hPa`}}
              </v-col>
              <v-col cols="12" sm="4">
                風速<br/>{{`${weatherdata.wind.speed}`}}<br/>miles/hour
              </v-col>
              <v-col cols="12" sm="4">
                風向<br/>{{`${weatherdata.wind.deg}`}}
              </v-col>
              <v-col cols="12" sm="4">
                {{`陣風: ${weatherdata.wind.gust} meter/sec`}}
              </v-col>
              <!-- <v-col cols="12" sm="4">
                {{`雲量: ${weatherdata.clouds.all} %`}}
              </v-col> -->
          </v-row>
          
      <!-- <i slot="reference" class="el-icon-sunrise-1"></i> -->
      <v-btn slot="reference" text dark><v-img max-width="30" :src="`http://openweathermap.org/img/w/${weatherdata.weather[0].icon}.png`"></v-img>{{weatherdata.main.temp}}°C</v-btn>
      <!-- <v-icon slot="reference" dark>mdi-weather-partly-cloudy</v-icon> -->
    </el-popover>
    </v-row>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
const agent = new https.Agent({
          rejectUnauthorized: false
        });
export default {
  data() {
    return {
      loc: {
        longitude: "121.82030882702146",
        latitude: "24.83616577553079"
      },
      location:[],
      weatherdata:{
          main:{
                feels_like: 0,
                grnd_level: 0,
                humidity: 0,
                pressure: 0,
                sea_level: 0,
                temp: 0,
                temp_max: 0,
                temp_min: 0,
          },
          wind:{
              speed:0,
              deg:0,
              gust:0
          },
          clouds:{
              all:0
          },
          weather:[{
                    description: "overcast clouds",
                    icon: "04d",
                    id: 0,
                    main: "Clouds"
          }]
       
      }
      //艾滴科技：24.83616577553079, 121.82030882702146
    };
  },
  methods: {
    getWeather: async function() {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.gettingLocation = false;
          this.loc.longitude = pos.coords.longitude;
          this.loc.latitude = pos.coords.latitude;
        },
        err => {
          this.gettingLocation = false;
          this.errorStr = err.message;
          //預設在公司
          this.loc.longitude = "121.82030882702146";
          this.loc.latitude = "24.83616577553079";
        }
      );
      var parm ={
           longitude: this.loc.longitude,
           latitude: this.loc.latitude,
      };
      await this.$axios
        .post(`${this.$store.state.mydata.gobal_api.apiIIS82}/weather.asmx/weatherData`, parm,{
            httpsAgent: agent
          })
        .then(res => {
          let weadata = JSON.parse(res.data.d);
          this.weatherdata.main = weadata.main;
          this.weatherdata.wind = weadata.wind;
          this.weatherdata.weather = weadata.weather;
        //   this.weatherdata.rain.h_1 = weadata.rain.1h;
          console.log("weather api：" + res.request.responseURL);
        });
      await this.getLocation();
    },
    getLocation:async function(){
      var parm ={
           longitude: this.loc.longitude,
           latitude: this.loc.latitude,
      };
      await this.$axios
        .post(`${this.$store.state.mydata.gobal_api.apiIIS82}/weather.asmx/location`, parm ,{
            httpsAgent: agent
          })
        .then(res => {
          let loc = JSON.parse(res.data.d);
          // var max = Math.max.apply(Math, loc.map(function(o) { return o.cnt; }));
          this.location = loc.sort((a,b) => (a.cnt > b.cnt) ? 1 : ((b.cnt > a.cnt) ? -1 : 0));
          // var xx = loc.map(function(o) { return o.cnt; });
        //   this.weatherdata.rain.h_1 = weadata.rain.1h;
          console.log("location api：" + res.request.responseURL);
        });
    }
  },
  created() {
    this.getWeather();
  }
};
</script>

<style >
  .popoverColor{
    background-color: #3F6D9E !important;
  }
  .popoverColor .popper_arrow::after{
    border-bottom-color: #3F6D9E !important;
  }
</style>
