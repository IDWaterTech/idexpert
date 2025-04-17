<template>
  <div>
    <v-overlay :value="!isLoading" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <!-- <v-card class="bg-card" style="min-height: 85vh;"> -->
    <!-- 底圖裝飾 -->
    <!-- <div class="background"></div>
    <div class="background mirro"></div> -->
    <!-- <div class="background-circle"></div> -->
    <video src="~/static/video.mp4" autoplay loop playsinline muted></video>
    <div class="overlay"></div>
    <!-- <div v-if="windowHeight<windowWidth" class="video">
      <img  src='../assets/maps.gif' id='selector'/>
      <div class="overlay"></div>
    </div> -->
    
    <!-- 內容 -->
    <div class="wrapper">
      <v-row style="margin: 24px auto;transition: all 0.3s;max-width: 1340px;" justify="center">
        <!-- 主標 -->
        <v-col cols="12" md="12">
          <!-- <div class="welcome" style="padding: 24px;">
            <h2 class="text-center" style="color: #eee;">歡迎使用 IDWater 專家系統</h2>
          </div> -->
        </v-col>
        <!-- Menu -->
        <v-col cols="12" lg="2" md="4" sm="6" xs="12" v-for="menu in menuList" :key="menu.id">
          <!-- 彩色版 v-for menu要增加mid -->
          <!-- <v-card class="menu-card" 
            @click="openChild(menu.id,'',true)"
            :style="{'backgroundColor':`${bgc[mid]}`}"
            :ripple="{ class: `ripple-color` }"> -->

          <!-- 主色版 -->
          <v-card class="menu-card" 
            @click="openChild(menu.id,'',true)"
            :class="{'disabled':menu.disabled}">
            <div class="menu-content"
              :style="{'flexDirection':`${menu.children && menu.isOpen?'row':'column'}`,
                      'alignItems':`${menu.children && menu.isOpen?'flex-start':'center'}`}">
              <v-icon class="title-icon">{{menu.icon}}</v-icon>
              <div class="text">
                <div class="menu-title" 
                  @click="openChild(menu.id,'',false)">
                  {{ menu.name }}
                  
                  <v-icon v-if="menu.children && !menu.isOpen">mdi-chevron-down</v-icon>
                  <v-icon v-if="menu.children && menu.isOpen">mdi-chevron-up</v-icon>
                </div>
                <!-- 子層 -->
                <v-list v-if="menu.children && menu.isOpen">
                  <v-list-item
                    v-for="child in menu.children"
                    :key="child.id"
                    v-ripple="{ class: `ripple-color` }"
                  >
                      <v-tooltip v-if="child.disabled" right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-list-item-title  v-bind="attrs" v-on="on" class="disabled" @click="openChild(menu.id,child.id,true)">{{ child.name }}</v-list-item-title>
                        </template>
                        <span> 尚未開通此服務</span>
                    </v-tooltip>
                    <v-list-item-title v-if="!child.disabled" :class="{'disabled':child.disabled}" @click="openChild(menu.id,child.id,true)">{{ child.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
      
    <!-- </v-card> -->
  </div>
</template>

<script>
export default {
  layout: "emptynologin2",
  data() {
    return {
      isfranchise:true,//是否加盟者
      menuList: [],
      bgc:['#E6F1F7','#E6F7F2','#FCFAED','#F7EDE6','#F7E6E6','#F7E6F4','#E6E7F7','#F0E6F7',],
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      isLoading: false,
      UserData:{Username:'',IsSaved:false},//使用者相關資訊
    }
  },
  async created() {
    if(this.$auth.$state.loggedIn) {
      await this._pageCheck();
      await this.getUserData();
      await this.getAllMenu();
    }else {
      window.location.href='/login';
    }
  },
  methods: {
    // 取得使用者資料
    getUserData: async function() {
      // this.isLoading = false;
      let userDataList = await this.getUserList();
      var userDataListCheck = typeof (userDataList)=='string'?[]:userDataList;
      var acc = userDataListCheck.filter(x=>x.username == this.$auth.$state.user.email)[0];
      this.UserData = _.cloneDeep(acc);
      //console.log('UserData!!!!!!!!!!',this.UserData);
      // this.isLoading = true;
    },
    // 所有menu
    async getAllMenu() {
      this.isLoading = false;
      let dataLst = {};
      try{
        let franchiselst = {
          status: 200,
          data: [{
            "id": 2,
            "name": "近況更新",
            "url": "/recent",
            "icon": "mdi-heart",
            "type": "Menu",
            "is_drop_down": false,
            "is_show": true,
            "disabled": false
          }, {
            "id": 3,
            "name": "歷史數據",
            "url": "/history",
            "icon": "mdi-reload",
            "type": "Menu",
            "is_drop_down": false,
            "is_show": true,
            "disabled": false
          }
          ]
        };
        //datalst = this.isfranchise?franchiselst:await this.getMenuAuthorization(true);
        dataLst = await this.getMenuAuthorization(true);
        
        if(this.UserData.is_customer==true){//加盟者身份
          //var newData = _.cloneDeep(dataLst.data.filter(x=>['近況更新','歷史數據'].includes(x.name)));//篩選出disabled=false的資料
          var newData = _.cloneDeep(dataLst.data.filter(x=>x.is_client_accessible==true));//篩選出disabled=false的資料
          console.log('dataLst 原始：',dataLst.data);
          dataLst.data = newData;
        }
        console.log('dataLst!!!!!!!!!!!',dataLst);
      }catch {
        console.log(error);
      }
      if(dataLst) {
          if(dataLst.status==200 && dataLst.data.length>0) {
            this.menuList = dataLst.data;
            // 父層/子層增加disabled參數，用來跟自身帳號menu比對判斷是否可以點選
            // 有子層的父層增加isOpen參數，用來開合子層
            this.menuList.forEach(m=>{
              m.disabled = false;
              if(m.children) {
                m.isOpen = false;
                m.children.forEach(child=>{
                  child.disabled = false;
                })
              }
            })
            let menu = [];
            let nowmainid = 0;
            this.menuList.forEach(main=>{
              if(main.type.toLowerCase() == 'menu' && main.is_show) {
                menu[nowmainid] = _.cloneDeep(main);
                if(main.children) {
                  menu[nowmainid].children = new Array();
                  main.children.forEach(child=>{
                    if(child.type.toLowerCase()=="menu" && child.is_show) {
                      menu[nowmainid].children.push(child);
                    }
                  })
                  if(menu[nowmainid].children.length==0) {
                    delete menu[nowmainid].children;
                  }
                }
                nowmainid++;
              }
            })
            this.menuList = menu;
            // 父層/子層增加disabled參數，用來跟自身帳號menu比對判斷是否可以點選
            // 有子層的父層增加isOpen參數，用來開合子層
            this.menuList.forEach(m=>{
              m.disabled = false;
              if(m.children) {
                m.isOpen = false;
                m.children.forEach(child=>{
                  child.disabled = false;
                })
              }
            })
            await this.getOwnMenu();
        }
        // console.log("api：" + datalst.request.responseURL);
        this.isLoading = true;
      }
      // let accheader = { account: this.$auth.$state.user.email };
      // const url = `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/authorization-menu/?is_all=true`;
      // await this.$axios
      //   .get(url, {
      //     headers: accheader
      //   })
      //   .then(async res => {
      //     console.log(res);
      //     if(res.status==200) {
      //       this.menuList = res.data;
      //       // 父層/子層增加disabled參數，用來跟自身帳號menu比對判斷是否可以點選
      //       // 有子層的父層增加isOpen參數，用來開合子層
      //       this.menuList.forEach(m=>{
      //         m.disabled = false;
      //         if(m.children) {
      //           m.isOpen = false;
      //           m.children.forEach(child=>{
      //             child.disabled = false;
      //           })
      //         }
      //       })
      //       await this.getOwnMenu();
      //     }
      //     console.log("api：" + res.request.responseURL);
      //   });
    },
    // 自身帳號menu，用來比對所有menu，自身沒有的要加上disabled
    async getOwnMenu() {
      let datalst;
      try{
        datalst = await this.getMenuAuthorization(false);
      }catch {
        console.log(error);
      }
      if(datalst) {
        if(datalst.status==200) {
          let ownId = [];
          let data = _.cloneDeep(this.menuList);
          this.menuList = [];
          // 測試子層disabled用(飼料表->料量設定)
          // res.data[2].children.splice(1,1);
          datalst.data.forEach(own => {
            ownId.push(own.id);
            if(own.children) {
              own.children.forEach(oc=>{
                ownId.push(oc.id);
              })
            }
          });
          data.forEach(m=>{
            if(!ownId.includes(m.id)){
              m.disabled = true;
            }
            if(m.children) {
              m.children.forEach(mc=>{
                if(!ownId.includes(mc.id)) {
                  mc.disabled = true;
                }
              })
            }
          })
          this.menuList = data;
          // this.menuList.push({
          //   disabled: false,
          //   icon: "mdi-database-edit-outline",
          //   id: 99999,
          //   is_drop_down: false,
          //   name: "知識庫鷹眼",
          //   url: "/kb2"
          // },
          // {
          //   disabled: false,
          //   icon: "mdi-briefcase-eye-outline",
          //   id: 77777,
          //   is_drop_down: false,
          //   name: "模型預測",
          //   url: "/pondpredict"
          // },
          // )
        }
        console.log('menuList',this.menuList)
      }
      // let accheader = { account: this.$auth.$state.user.email };
      // await this.$axios
      //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/authorization-menu/`, {
      //     headers: accheader
      //   }) 
      //   .then(res => {
      //     console.log(res);
      //     if(res.status==200) {
      //       let ownId = [];
      //       let data = _.cloneDeep(this.menuList);
      //       this.menuList = [];
      //       // 測試子層disabled用(飼料表->料量設定)
      //       // res.data[2].children.splice(1,1);
      //       res.data.forEach(own => {
      //         ownId.push(own.id);
      //         if(own.children) {
      //           own.children.forEach(oc=>{
      //             ownId.push(oc.id);
      //           })
      //         }
      //       });
      //       data.forEach(m=>{
      //         if(!ownId.includes(m.id)){
      //           m.disabled = true;
      //         }
      //         if(m.children) {
      //           m.children.forEach(mc=>{
      //             if(!ownId.includes(mc.id)) {
      //               mc.disabled = true;
      //             }
      //           })
      //         }
      //       })
      //       this.menuList = data;
      //       this.menuList.push({
      //         disabled: false,
      //         icon: "mdi-database-edit-outline",
      //         id: 99999,
      //         is_drop_down: false,
      //         name: "知識庫鷹眼",
      //         url: "/kb2"
      //       },
      //       // {
      //       //   disabled: false,
      //       //   icon: "mdi-briefcase-eye-outline",
      //       //   id: 77777,
      //       //   is_drop_down: false,
      //       //   name: "模型預測",
      //       //   url: "/pondpredict"
      //       // },
      //       )
      //     }
      //     console.log('menuList',this.menuList)
      //   });
    },
    // id=第一層menu,cid=子層,bool=是否去連結
    openChild(id,cid,bool) {
      // 只變動true/false，變動太小導致v-if沒有渲染，因此清空menuList重新導入
      let data = _.cloneDeep(this.menuList);
      this.menuList = [];

      data.forEach(m=>{
        if(cid=='') {
          if(m.id==id && m.children && !bool && !m.disabled) {
            // 有子層開合父層，點選動作做在title上，避免子層disabled時點選後，menu關閉
            m.isOpen = !m.isOpen;
          }else {
            // 無子層直接到點選的頁面
            if(m.id==id && bool && !m.disabled) {
              this.$router.push(m.url);
            }
          }
        }else {
          if(bool && m.children && m.id==id && !m.disabled) {
            m.children.forEach(c=>{
              if(c.id==cid) {
                if(!c.disabled) {
                  // this.$router.push(c.url);
                  window.location.href = c.url;
                  // m.isOpen = true; 
                }
              }
            })
          }
        }
      })
      this.menuList = data;
    }
  },
  mounted() {
    console.log('mounted');
    
    //監控視窗
    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    });
    
  },
  watch: {
    windowHeight(){
        return window.innerHeight;
    },
    windowWidth() {
      return window.innerWidth;
    }
  }
}
</script>

<style lang="scss" scoped>
#selector {
    width:100%;
    position: fixed;
    top: 0;
    left: 0;
}
.overlay{
  position: absolute;
  top: 0;
  left: 0;
  @include size(100%,100%);
  background: var(--linear-gradient-dark, linear-gradient(179deg, #00324E 0.78%, #40657A 197.21%));
  opacity: 0.5;
  backdrop-filter: blur(6px);
}
video {
  object-fit: cover;
  @include size(100vw,100vh);
  position: fixed;
  top: 0;
  left: 0;
}
.wrapper {
  width: 100%;
  // height: calc(100vh - 112px);
  position: relative;
}
.menu-card.v-sheet.v-card {
  transition: all 0.3s;
  padding: 24px 12px 48px;
  cursor: pointer;
  // height: 100%;
  //max-width: 250px;
  border-bottom: 6px solid $color-primary;
  margin-top: 0;
  position: relative;
  // background-color: rgba($color-primary,0.1);
  // background-color: #E6F1F7;
  background-color: rgba(#E6F1F7,0.8);
  transition: all 0.3s;
  backdrop-filter: blur(6px);
  &:not(.v-sheet--outlined) {
    box-shadow: 0 0 15px rgba(0,0,0,0.5);
    transition: all 0.3s;
  }
  &:focus {
    // background-color: rgba($color-primary,0.1);
    // background-color: #E6F1F7;
    background-color: #E6F1F7;
  }
  
  .menu-title {
    font-size: 1.1rem;
    transition: all 0.3s;
  }
  .title-icon {
    font-size: 1.5rem;
  }
  &:hover {
    margin-top: -12px;
    border-bottom: 6px solid lighten($color-primary,5);
    // background-color: rgba($color-primary-25,0.5);
    background-color: #fefefe;
    &:not(.v-sheet--outlined) {
      box-shadow: 0 5px 10px rgba(0,0,0,0.15), 0px 0px 20px 0px rgba(255,255,255,0.4);
    }
    .title-icon {
      // background-color: rgba($color-primary,0.1);
      // background-color: #E6F1F7;
      // background-color: #CCE1ED;
      color: lighten($color-primary,5);
      font-size: 2rem;
    }
    
    .menu-title {
      font-size: 1.2rem;
    }
  }
  &.v-card--link:before {
    background: none;
  }
  &.v-card--link:focus:before {
    background-color: transparent;
  }
  &.disabled {
    // background-color: rgba($color-dark-25,0.3);
    background-color: rgba(#CFD8DD,0.8);
    cursor: not-allowed;
    // position: relative;
    border-bottom: 6px solid $color-dark-75;
    overflow: hidden;
    // opacity: 0.9;
    * {
      color: $color-dark-50;
    }
    &:not(.v-sheet--outlined) {
      box-shadow: 0 0 15px rgba(0,0,0,0.5);
    }
    &:after {
      content: '';
      background-color: rgba(0,0,0,0.3);
      color: rgba($color-light,0);
      @include size(100%);
      @include positionCenter();
      transition: all 0.3s;
    }
    &:hover {
      margin-top: 0;
      background-color: $color-black-10;
      &:not(.v-sheet--outlined) {
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
      }
      .title-icon {
        background-color: rgba(255,255,255,0.4);
        color: $color-dark-50;
        font-size: 1.5rem;
      }
      &:before {
        background-color: transparent;
      }
      &:after {
        content: '尚未開通此服務';
        color: $color-light;
        font-weight: bold;
        @include size(100%);
        background-color: rgba(0,0,0,0.5);
        @include flexAllCenter();
      }
      .menu-title {
        font-size: 1.1rem;
      }
    }
    &:focus,&:hover {
      background-color: #EFF2F3;
    }
    &:before {
      content:'';
      @include size(100%);
      position: absolute;
      top: 0;
      left: 0;
      background-color: transparent;
    }
  }
}
.ripple-color {
  background-color: $color-primary-25;
}
.menu-content {
  @include flexAlignCenter();
  flex-direction: column;
  .title-icon {
    margin: 12px;
    @include size(40px);
    background-color: rgba(255,255,255,0.4);
    border-radius: 50%;
    color: $color-primary-75;
    font-size: 1.2rem;
  }
  .text {
    margin: 12px;
    * {
      color: $color-dark;
    }
    .theme--light.v-list {
      background: transparent;
      .v-list-item {
        padding: 0;
        min-height: 24px;
        transition: all 0.3s;
        .v-list-item__title{
          padding: 4px;
          transition: all 0.3s;
          &:hover {
            background-color: $color-primary-25;
            border-radius: 4px;
            font-weight: bold;
            &.disabled {
              background-color: transparent !important;;
              font-weight: 400;
            }
          }
          &.disabled {
            background-color: transparent !important;;
            color: rgba($color-dark-50,0.8);
            cursor: not-allowed;
          }
        }
      }
    }
    .menu-title {
      margin-top: 12px;
      @include flexAlignCenter();
      font-weight: bold;
    }
    .children {
      margin: 12px;
      margin-left: 0;
      li {
        list-style: none;
      }
    }
  }
}
</style>