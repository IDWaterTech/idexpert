<template>
    <div>
      <v-card class="predict">
            <div class="card-title">
                <v-row>
                    <div class="title">
                        <v-icon>mdi-briefcase-eye-outline</v-icon>
                        <v-card-title>預測模式</v-card-title>
                    </div>
                </v-row>
            </div>
            <div class="content">
              <div class="search">
                  <v-row style="align-items: center;">
                      <v-col cols="12" md="2">
                          <v-select :items="fatorys" label="pond" hide-details v-model="nowChoose" @change="changeFactory($event)" style="padding-left: 12px;margin-top: 0;">                
                          </v-select>  
                      </v-col>
                      <v-col cols="12" md="2">
                          <v-select :items="second" label="sensor type" hide-details v-model="nowSecondary" @change="changeSecondary($event)" style="padding-left: 12px;margin-top: 0;">                
                          </v-select>
                      </v-col>
                      <v-col cols="12" md="2">
                          <v-btn
                              tile
                              :disabled="nowChoose==''||nowSecondary==''"
                              @click="importQuerry()"
                              class="btn-primary">
                              查詢
                          </v-btn>
                      </v-col>
                  </v-row>
              </div>
              <div class="result" style="padding: 24px 12px;height: 66vh;overflow-y: scroll;">
                  <v-row style="height: 100%;margin-bottom: 24px;">
                      <v-col cols="12" md="12">
                          <div class="current" style="height: 100%;">
                              <div class="pre-content" style="height: 100%;">
                                  <v-overlay :value="predloading" :absolute="true">
                                  <v-progress-circular indeterminate size="64"></v-progress-circular>
                                  </v-overlay>
                                  <ve-line v-if="dataCurrentArrary.length>0 || dataPredictArray.length>0" :data="chartDataCurrent"></ve-line>
                                  <div v-if="dataCurrentArrary.length==0 && dataPredictArray.length==0" class="nodata">
                                      無資料
                                  </div>
                              </div>
                          </div>
                          
                      </v-col>
                      <!-- <v-col cols="12" md="6">
                          <div class="current" style="height: 100%;">
                              <div class="title">
                                  Current Data
                              </div>
                              <div class="pre-content"
                                  :style="{height:`${dataCurrentArrary.length==0?'100%':'initial'}`}">
                                  <ve-line :data="chartDataCurrent" v-if="dataCurrentArrary.length>0"></ve-line>
                                  
                                  <div v-if="dataCurrentArrary.length==0 && !dataPredict.predictions" class="nodata">
                                      無資料
                                  </div>
                              </div>
                          </div>
                      </v-col> -->
                      
                      <!-- <v-col cols="12" md="6">
                          <div class="predict"  style="height: 100%;">
                              <div class="title">
                                  Predict Data
                              </div>
  
                              <div class="pre-content"
                                  :style="{height:`${dataCurrentArrary.length==0?'100%':'initial'}`}">
                                  <v-overlay :value="predloading" :absolute="true">
                                  <v-progress-circular indeterminate size="64"></v-progress-circular>
                                  </v-overlay>
  
                                  <ve-line :data="chartDataPredict" :colors="predictColor" v-if="dataPredictArray.length>0"></ve-line>
                                  <div v-if="dataPredictArray.length==0" class="nodata">
                                      無資料
                                  </div>
                              </div>
                          </div>
                      </v-col> -->
                  </v-row>
              </div>
            </div>
        </v-card>
    </div>
  </template>
  
  <script>
  export default {
      layout: 'emptynologin',
      data() {
          return {
              fatorys: ['tainfuB2','tainfuC3','wuquA1','wuquB5','ziwei2-4','ziwei3-2'],
              nowChoose: '',
              second:['Do','Temp'],
              nowSecondary: '',
              dataCurrent:{},
              dataCurrentDo: {
                  "data":[6.43,6.54,6.52,6.48,6.72,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64],
                  "model_size":24,
                  "at":"2023-09-21T02:50:00Z"
              },
              dataCurrentTemp: {
                  "data": [
                      25,25,26,22,28,26,33,25,24,20,25,25,25,26,26,26,25,22,24,25,26,25,26,25
                  ],
                  "model_size": 24,
                  "at": "2023-09-21T02:50:00Z"
              },
              dataCurrentArrary: [],
              dataPredict:{},
              // dataPredict: {"at":"2023-09-21T02:50:00Z","pond_id":"tainfuB2","predictions":[6.65,6.65,6.65,6.65,6.65,6.65,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66],"sensor_id":"do","sensor_type":"do"},
              // dataCurrentArrary: [6.43,6.54,6.52,6.48,6.72,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64,6.64],
              dataPredictArray: [],
              predloading:false,
              chartDataCurrent:{
                  columns: [],
                  rows:[]
              },
              chartDataPredict:{
                  columns: [],
                  rows:[]
              },
              predictColor:['#5AB1EF']
          }
      },
      methods: {
          changeFactory(evt) {
              console.log(evt);
              this.nowChoose = evt;
          },
          changeSecondary(evt) {
              console.log(evt);
              this.nowSecondary = evt;
              if(evt == 'Do') {
                  // this.dataPredict = {"at":"2023-09-21T02:50:00Z","pond_id":"tainfuB2","predictions":[6.65,6.65,6.65,6.65,6.65,6.65,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66,6.66],"sensor_id":"do","sensor_type":"do"}
                  this.dataCurrent = this.dataCurrentDo;
              }else {
                  // this.dataPredict = {"at":"2023-09-21T02:50:00Z","pond_id":"tainfuB2","predictions":[25.86,25.84,25.79,25.78,25.75,25.77,25.7,25.71,25.7,25.68,25.63,25.64,25.66,25.63,25.63,25.62,25.63,25.66,25.65,25.63,25.69,25.7,25.69,25.73],"sensor_id":"temp","sensor_type":"temp"};
                  this.dataCurrent = this.dataCurrentTemp;
              }
          },
          importQuerry:async function() {
              this.predloading = true;
              // let url = 'http://34.133.224.181:10181/pond/'+this.nowChoose+'/sensor/'+this.nowSecondary.toLowerCase()+'/prediction';
              let url = 'https://www.icellars.tw/api/pond/'+this.nowChoose+'/sensor/'+this.nowSecondary.toLowerCase()+'/prediction';;
              let config = {
                  headers: {
                      'Content-Type': 'application/json',
                  }
              }
              // this.dataPredictArray = this.dataPredict.predictions;
              console.log('url',url);
              this.$axios({
                  method: 'post',
                  url: url,
                  headers: {'Content-Type': 'application/json'}, 
                  data: JSON.stringify(this.dataCurrent)
              }).then(res => {
                  console.log("res:",res.data.predictions);
                  this.dataCurrentArrary = this.dataCurrent.data;
                  this.dataPredictArray = [];  
                  this.dataPredictArray = res.data.predictions;
                  // this.dataCurrentArrary = this.dataCurrent.data;
  
                  // charts
                  // this.chartDataCurrent = {columns:[],rows:[]}
                  // this.chartDataPredict = {columns:[],rows:[]}
                  // this.chartDataCurrent.columns = ['index',`${this.nowSecondary}`];
                  // this.chartDataPredict.columns = ['index',`${this.nowSecondary}`];
                  // for(let i=0;i<this.dataCurrentArrary.length;i++) {
                  //     let id = (i+1).toString();
                  //     this.chartDataCurrent.rows.push({index:id});
                  //     this.chartDataCurrent.rows[i][this.nowSecondary] = this.dataCurrentArrary[i];
                  // }
                  // for(let i=0;i<this.dataPredictArray.length;i++) {
                  //     let pid = (i+1).toString();
                  //     this.chartDataPredict.rows.push({index:pid,});
                  //     this.chartDataPredict.rows[i][this.nowSecondary] = this.dataPredictArray[i];
                  // }
                  
                  this.chartDataCurrent = {columns:[],rows:[]}
                  
                  this.chartDataCurrent.columns = ['index','current','predict'];
                  
                  for(let i=0;i<this.dataCurrentArrary.length;i++) {
                      let id = (i+1).toString();
                      this.chartDataCurrent.rows.push({index:id,current:this.dataCurrentArrary[i]});
                  }
                  for(let i=0;i<this.dataPredictArray.length;i++) {
                      let pid = (this.dataCurrentArrary.length+i+1).toString();
                      this.chartDataCurrent.rows.push({index:pid,predict:this.dataPredictArray[i]});
                  }
  
              }).catch(error => {
                  this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
              }).finally(()=>{
                  this.predloading = false;
              })
              
              // this.$axios.post(url, this.dataCurrent,config).then(res => {
              //     console.log(res);
              // }).catch(error => {
              //     this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
              // })
              
          }
      },
  
  }
  </script>
  
  <style lang="scss" scoped>
  .v-card.predict {
      // padding: 16px;
      min-height: 84vh;
      // overflow-y: scroll;
      margin-bottom: 24px;
      overflow: hidden;
      .card-title {
          padding: 12px 24px;
          // background-color: #006AA6;
          // color: #fefefe;
          .row {
              margin-left: 0;
              margin-top: 0;
          }
          .title {
              display: flex;
              align-items: center;
          }
      }
      .card-title,.content {
        padding: 12px 24px;
      }
      .v-card__title {
          color: #00273E;
          font-weight: bold;
      }
      .content {
          padding: 12px 24px;
          height: 100%;
          min-height: 100%;
          padding-top: 0;
          color: #00273E;
      //   overflow-y: scroll;
      }
      .pre-content {
          padding-left: 0; 
          border: 1px solid rgba(0,0,0,0.1); 
          width: 100%;
          // height: 100%; 
          border-radius: 4px;
          margin-top: 12px;
          padding-top: 24px;
      }
      .nodata {
          // width: 100%;
          // position: absolute;
          // top: 50%;
          // left: 50%;
          // transform: translate(-50%,-50%);
          // text-align: center;
          padding: 24px;
          margin-top: -12px;
      }
      .v-select__selection--comma {
      color: #00273E;
      }
      .theme--light.v-label,.theme--light.v-icon,.theme--light.v-input {
          color: #6c9bcd;
      }
      // .theme--light.v-input {
      //     margin-top: 0;
      // }
      .theme--light.v-text-field > .v-input__control > .v-input__slot:before,.theme--light.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before {
      
          border-color: #6c9bcd;
      }
  }
  </style>