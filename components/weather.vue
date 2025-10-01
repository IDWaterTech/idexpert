<template>
  <el-popover placement="top-start" width="300">
        <v-row style="color:#FFF;" justify="center" align="center" dense >
            <v-col cols="12" class="border-bottom pb-2">
                <h3>氣象資訊</h3>
            </v-col>
            <v-col cols="12" justify="center">
              <!-- {{ toggle_weather }}_{{ toggle_weather2 }}<br/> -->
              <v-btn-toggle
                  v-model="toggle_weather" @change="changeloc(toggle_weather)"
                  class="field-toggle mt-2"
                >
                <!-- <v-btn :value="1" :class="{'v-btn--active':toggle_weather==1}">研發<br/>一場</v-btn> -->
                <v-btn :value="2" :class="{'v-btn--active':toggle_weather==2}">彰化<br/>芳苑</v-btn>
                <v-btn :value="3" :class="{'v-btn--active':toggle_weather==3}">台南<br/>北門</v-btn>
                <v-btn :value="4" :class="{'v-btn--active':toggle_weather==4}">高雄<br/>湖內</v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col cols="12" class="border-bottom" style="line-height: 24px;">
              <span style="font-weight: 400;">地區：</span><span>{{location.map(x=>x.name).join()}}</span><br/>  <!--  _({{ loc.longitude }}/{{ loc.latitude }}) -->
              <span style="font-weight: 400;">天氣概況：</span>{{weatherdata.weather[0].main}}<br/>
              <span style="font-weight: 400;">說明：</span>{{weatherdata.weather[0].description}}<br/>
              <span style="font-weight: 400;">資料來源：</span><a target="_blank" style="color:#40C4FF;text-decoration: underline;" href="http://openweathermap.org/">Open Weather Map </a>(ver 2.5)
            </v-col>
            <v-col cols="12" sm="4">
              <span style="font-weight: 600;">溫度</span><br/>{{`${weatherdata.main.temp} °C`}}
            </v-col>
            <v-col cols="12" sm="4">
              <span style="font-weight: 600;">氣壓</span><br/>{{`${weatherdata.main.pressure} hPa`}}
            </v-col>
            <v-col cols="12" sm="4">
              <span style="font-weight: 600;">體感溫度</span><br/>{{`${weatherdata.main.feels_like} °C`}}
            </v-col>
            <v-col cols="12" sm="4">
              <span style="font-weight: 600;">濕度</span><br/>{{`${weatherdata.main.humidity} %`}}
            </v-col>
            <v-col cols="12" sm="4">
              <span style="font-weight: bold;">最低溫度</span><br/>{{`${weatherdata.main.temp_min} °C`}}
            </v-col>
            <v-col cols="12" sm="4">
              <span style="font-weight: bold;">最高溫度</span><br/>{{`${weatherdata.main.temp_max} °C`}}
            </v-col>
            <!-- <v-col cols="12" sm="4">
              <span style="font-weight: bold;">海平面氣壓</span><br/>{{`${weatherdata.main.sea_level} hPa`}}
            </v-col> -->
            <!-- <v-col cols="12" sm="4">
              <span style="font-weight: bold;">地面大氣壓</span><br/>{{`${weatherdata.main.grnd_level} hPa`}}
            </v-col> -->
            <v-col cols="12" sm="4">
              <span style="font-weight: bold;">風速</span><br/>{{`${weatherdata.wind.speed}`}}<br/>miles/hour
            </v-col>
            <v-col cols="12" sm="4">
              <span style="font-weight: bold;">風向</span><br/>{{`${weatherdata.wind.deg}`}}
            </v-col>
            <!-- <v-col cols="12" sm="4">
              <span style="font-weight: bold;">陣風</span>{{`: ${weatherdata.wind.gust} meter/sec`}},localStorage:{{ localData }}
            </v-col> -->
            <!-- <v-col cols="12" sm="4">
              {{`雲量: ${weatherdata.clouds.all} %`}}
            </v-col> -->
        </v-row>
        
    <!-- <i slot="reference" class="el-icon-sunrise-1"></i> -->
    <v-btn slot="reference" text dark><v-img max-width="30" :src="`http://openweathermap.org/img/w/${weatherdata.weather[0].icon}.png`"></v-img>{{weatherdata.main.temp}}°C</v-btn>
    <!-- <v-icon slot="reference" dark>mdi-weather-partly-cloudy</v-icon> -->
  </el-popover>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import https from "https";
const agent = new https.Agent({
        rejectUnauthorized: false
      });
export default {
data() {
  return {
    loc: {
      // longitude: "121.82030882702146",
      // latitude: "24.83616577553079",
      longitude: '120.4107148',//彰化芳苑
      latitude: '23.9968415'
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
        }],
    },
    toggle_weather2:"4",
    toggle_weather:(localStorage.getItem('locationWeather')==null)?"":localStorage.getItem('locationWeather'),
    //艾滴科技：24.83616577553079, 121.82030882702146
    localData:''
  };
},
methods: {
  changeloc:function(locid){
    // var lonlat = {longitude: "121.82030882702146",latitude: "24.83616577553079"}; //預設在頭城研發一場
    var lonlat = {longitude: "120.4107148",latitude: "23.9968415"}; //預設彰化芳苑
    switch (locid) {
      case 1://研發一場
        lonlat = {
                  longitude: "121.82030882702146",
                  latitude: "24.83616577553079"
                };
        break;
      case 2://彰化芳苑
        lonlat = {
            longitude:'120.4107148',
            latitude:'23.9968415'
          };
        break;
      case 3://台南北門
        lonlat = {
            longitude:'120.1141738',
            latitude:'23.2772886'
          };
        break;
      case 4://高雄湖內
          lonlat = {
              longitude:'120.2328442',
              latitude:'22.8913011'
            };
        break;
      default:
        break;
    }
    this.loc = lonlat;
    localStorage.setItem('locationWeather', this.toggle_weather);
    this.getWeather(true);
  },
  getWeather: async function(isChangeloc = false) {
    // console.log("★★★localStorage in:",localStorage.getItem('locationWeather'));
    if(localStorage.getItem('locationWeather')==null){
      localStorage.setItem('locationWeather', '');
      console.log("★★★localStorage is NULL");
    }else if(isChangeloc == false){
      // console.log("★★★localStorage:",localStorage.getItem('locationWeather'));
      this.toggle_weather = parseInt(localStorage.getItem('locationWeather'));//先設定值，取出來是文字要先轉換成數值區域才會改變
      this.changeloc(this.toggle_weather);//跳去抓經緯度資料，再從那邊導回來時不走此處，避免無限遞回
      return;
    }
    if(this.toggle_weather == ""){//沒按按鈕，抓定位或預設
      navigator.geolocation.getCurrentPosition(
      pos => {
        this.gettingLocation = false;
        this.loc.longitude = pos.coords.longitude;
        this.loc.latitude = pos.coords.latitude;
      },
      err => {
        this.gettingLocation = false;
        this.errorStr = err.message;
        //預設在頭城研發一場→彰化芳苑
        // this.loc.longitude = "121.82030882702146";
        // this.loc.latitude = "24.83616577553079";
        this.loc.longitude = '120.4107148';
        this.loc.latitude = '23.9968415';
      }
    );
    }
    
    var parm ={
         longitude: this.loc.longitude,
         latitude: this.loc.latitude,
    };
    await this.$axios
      .post(`${this.$store.state.mydata.gobal_api.apiIIS82}/weather`, parm,{
          httpsAgent: agent
        })
      .then(res => {
        // let weadata = JSON.parse(res.data.d);
        let weadata = res.data;
        this.weatherdata.main = weadata.main;
        this.weatherdata.wind = weadata.wind;
        this.weatherdata.weather = weadata.weather;
      //   this.weatherdata.rain.h_1 = weadata.rain.1h;
      })
      .catch(error=>{
        console.log(error.response);
      }) 
    await this.getLocation();
  },
  getLocation:async function(){
    var parm ={
         longitude: this.loc.longitude,
         latitude: this.loc.latitude,
    };
    await this.$axios
      .post(`${this.$store.state.mydata.gobal_api.apiIIS82}/location`, parm ,{
          httpsAgent: agent
        })
      .then(res => {
        // let loc = JSON.parse(res.data.d);
        let loc = res.data;
        // var max = Math.max.apply(Math, loc.map(function(o) { return o.cnt; }));
        this.location = loc.sort((a,b) => (a.cnt > b.cnt) ? 1 : ((b.cnt > a.cnt) ? -1 : 0));
        // var xx = loc.map(function(o) { return o.cnt; });
      //   this.weatherdata.rain.h_1 = weadata.rain.1h;
        // console.log("location api：" + res.request.responseURL);
      })
      .catch(error=>{
        console.log(error.response);
      }) ;
  }
},
created() {
  this.getWeather();
}
};
</script>

<style lang="scss" scoped>
.popoverColor{
  background-color: #3F6D9E !important;
}
.popoverColor .popper_arrow::after{
  border-bottom-color: #3F6D9E !important;
}
.theme--dark.field-toggle.v-btn-toggle:not(.v-btn-toggle--group) {
  border-radius: 4px;
  overflow: hidden;
  background: $color-lighten;
  border: 1px solid $color-dark;
}
.theme--dark.v-btn.v-btn--has-bg {
  background-color: $color-lighten;
  border-right: 1px solid $color-primary;
  // color: $color-dark;
}
.theme--dark.v-btn--active::before {
  opacity: 0.4;
  background-color: $color-primary;
  // border-radius: 2px 0 0 2px;
  span {
    color: #fff;
  }
}
.el-popover.el-popper {
  background-color: #fff;
  * {
    color: $color-dark;
  }
  h3 {
    font-weight: bold;
  }
}
::v-deep {
  
}
</style>
