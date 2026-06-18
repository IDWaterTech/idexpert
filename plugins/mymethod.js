import Vue from "vue";
import https from "https";

// Make sure to pick a unique name for the flag
// so it won't conflict with any other mixin.
  if (!Vue.__my_mixin__) {
    Vue.__my_mixin__ = true;
    Vue.mixin({
      data () {
        return {
          moment_format: 'DD/MM/YYYY HH:mm',
          isUser: false
        }
      },
      methods: {
          hmix: function() {
              console.log("mixin methods");
            },
          _pageCheck:async function(){
            if (this.$auth.$state.loggedIn) {
              let acclist = [];

              let getuserData = await this.getUserList();
              acclist = typeof (getuserData)=='string'?[]:getuserData;

              if(!acclist) { acclist = []}else {
                var acc = acclist.filter(
                  x => x.username.toLowerCase() == this.$auth.$state.user.email.toLowerCase() && x.is_active == true
                );
                console.log("ACC DATA:",acc);
                //登入成功
                if (acc.length == 1) {
                  this.isUser = true;
                  //增加身份判別---
                  //帳號被授權進入的項目
                  localStorage.setItem('factory_id',JSON.stringify(acc[0].factory_id));
                  //帳號是否是加盟者
                  localStorage.setItem('is_customer',JSON.stringify(acc[0].is_customer));
                  //帳號被授權進入的池子(限定加盟者才用到)
                  localStorage.setItem('pond_id',JSON.stringify(acc[0].pond_id));
                  let accheader = { account: this.$auth.$state.user.email };
                  let accPagelst = [];
                  let datalst;
                  try {
                    datalst = await this.getMenuAuthorization(false);
                  }catch {
                    console.log(error);
                  }
                  if(datalst) {
                    accPagelst = _.cloneDeep(datalst.data);
                    console.log("accPagelst:",accPagelst);
                    console.log("accPage api:",datalst.request.responseURL);
                    let user = await this._getUserData();
                    //User資料結構
                    //   {
                    //     "id": 3,
                    //     "username": "jianwei.wen@idwater.com.tw",
                    //     "account_name": "溫健偉",
                    //     "department": [
                    //         "技術部"
                    //     ],
                    //     "position": [
                    //         {
                    //             "position_id": 124,
                    //             "department": "技術部",
                    //             "name": "軟體工程師"
                    //         }
                    //     ],
                    //     "is_active": true,
                    //     "is_sys_enable_line": true,
                    //     "is_sys_enable_email": false,
                    //     "is_sys_enable_line_kb": false,
                    //     "is_personal_enable_line": true,
                    //     "factory_id": [
                    //         2,
                    //         40,
                    //         30
                    //     ],
                    //     "line_vcode": "RfQZZqIq",
                    //     "line_user_id": "U97475a8613ee871944c4dc42b7eaf63e",
                    //     "is_customer": true,
                    //     "highest_position_id": 124
                    // }
                    let data = [];
                    let nowmainid = 0;
                    accPagelst.forEach(main=>{
                      if(main.is_show) {
                        data[nowmainid] = _.cloneDeep(main);
                        if(main.children) {
                          data[nowmainid].children = new Array();
                          main.children.forEach(child=>{
                            if(child.is_show) {
                              data[nowmainid].children.push(child);
                            }
                          })
                          if(data[nowmainid].children.length==0) {
                            delete data[nowmainid].children;
                          }
                        }
                        nowmainid++;
                      }
                    })
                    if(user.is_customer==true) {//加盟者
                      accPagelst = data.filter(x=>x.is_client_accessible==true || (user.department.includes('技術部') && x.name=="管理"));//只顯示加盟者可見的頁面
                    }else{
                      accPagelst = data;
                    }
                    this.$store.commit('mydata/set_listitems', accPagelst);
                  }
                  // await this.$axios
                  //   .get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/authorization-menu/`, {
                  //     headers: accheader
                  //   }) 
                  //   .then(res => {
                  //     accPagelst = res.data;
                  //     console.log("accPagelst:",accPagelst);
                  //     console.log("accPage api:",res.request.responseURL);
                  //     this.$store.commit('mydata/set_listitems', accPagelst);
                  //   });
                    let urlpath = $nuxt.$route.path;
                    function getallpath(item){
                      let tmplst=[];
                      // item.forEach(element => {
                      //   tmplst.push(element.url);
                      //   if(element.hasOwnProperty("other_children")){
                      //     tmplst.push(...element["other_children"].map(x=>{return x.url}));
                      //   }
                      //   if(element.hasOwnProperty("children")){
                      //     tmplst.push(...getallpath(element["children"]));
                      //   }
                      // });
                      item.forEach(element => {
                        if(element.type.toLowerCase() =='menu' || element.type.toLowerCase() =='page') {
                          tmplst.push(element.url);
                        }
                        if(element.hasOwnProperty("children")) {
                          tmplst.push(...getallpath(element["children"]));
                        }
                      });
                      // console.log('tmplst',tmplst);
                      return tmplst;
                    }
                    let accPagelstNew= getallpath(datalst.data).map((x)=>{return x.toLowerCase();});
                    //排除根目錄、個人頁、登入頁
                    urlpath = (urlpath.substr(-1)=='/')?urlpath.substr(0,urlpath.length-1):urlpath;
                    var isallowPath =(accPagelstNew.filter(x=>x == urlpath.toLowerCase()).length == 1) || ["","/","/set/profile","/login"].includes(urlpath);
                    console.log(`是否允許進入頁面:${isallowPath}[${urlpath}]`);
                    if (isallowPath == false) {
                      this.$router.push({ name: "pagefail" });
                    }
                  //--
                } else {
                  //登入失敗
                  this.$router.push({ name: "loginfail" });
                }
              }
              
              
            }
          },
          getSite:function(){//return external or internal
            //強迫設定內網
            localStorage.setItem('site', 'internal');
            this.$store.commit('mydata/set_api', process.env['internal']);
            return localStorage.getItem('site');

            if(localStorage.getItem('site')==null){
              localStorage.setItem('site', 'internal');
            }
            if (localStorage.getItem('site')=='external') {
              this.$store.commit('mydata/set_api', process.env['external']);
            }else{
              this.$store.commit('mydata/set_api', process.env['internal']);
            }
            return localStorage.getItem('site');
          },
          setSite:function(data){
            localStorage.setItem('site', data);
            if (localStorage.getItem('site')=='external') {
              this.$store.commit('mydata/set_api', process.env['external']);
            }else{
              this.$store.commit('mydata/set_api', process.env['internal']);
            }
            console.log("設定網路：",)
          },
          // 取得授權清單
          getMenuAuthorization:async function(bool){
            //bool=true 代表取得全部授權清單(包含disabled的)，bool=false 代表只取得啟用的授權清單
            let menu = [];
            const agent = new https.Agent({
              rejectUnauthorized: false
            });
            const accheader = { account: this.$auth.$state.user.email };
            console.log('getMenuAuthorization 取得的帳號：',accheader);
            const url = bool?`/user-access/authorization-items/?is_all=true`:`/user-access/authorization-items/`;
            console.log("getMenuAuthorization isUser:",this.isUser);
            //每個頁面都判斷一次使用者是否有權限，確保安全性，暫時移除
            //if(this.isUser) {
            if(true) {
              const apiUrl = this.$store.state.mydata.gobal_api.apiUrl + url;
              return this.$axios
                .get(`${apiUrl}`, {
                  httpsAgent: agent,
                  headers: accheader,
                })
                .then((res) => {
                  console.log("取得的res:", JSON.stringify(res));
                  console.log("getMenuAuthorization", menu, accheader);
                  return res;
                })
                .catch((error) => {
                  this.$toast.error(
                    "錯誤：" +
                      (error.response?.data?.message ||
                        error.response?.status ||
                        error.message),
                    { duration: 2000 }
                  );
                });
            }
            
          },
          // 取得授權清單_NEW
          getMenuAuthorizationV2:async function(bool){
            // return this.getMenuAuthorization(bool);//測試舊版用
            //bool=true 代表取得全部授權清單(包含disabled的)，bool=false 代表只取得啟用的授權清單
            //V2不分is_ALL 要用資料內容來判斷
            let menu = [];
            const agent = new https.Agent({
              rejectUnauthorized: false
            });
            const accheader = { account: this.$auth.$state.user.email };
            // const url = `/user-access/v3/authorization-items/`;
            const url = bool?`/user-access/v3/authorization-items/?is_all=true`:`/user-access/v3/authorization-items/`;
            
            //每個頁面都判斷一次使用者是否有權限，確保安全性，暫時移除
            //if(this.isUser) {
            if(true) {
              const apiUrl = this.$store.state.mydata.gobal_api.apiUrl + url;
              return this.$axios
                .get(`${apiUrl}`, {
                  httpsAgent: agent,
                  headers: accheader,
                })
                .then((res) => {
                  return res;
                  //res.data資料結構
                  // [
                  //   {
                  //   "id": 2,
                  //   "name": "即時數據",
                  //   "url": "/basic",
                  //   "icon": "mdi-monitor-dashboard",
                  //   "type": "Menu",
                  //   "is_client_accessible": false,
                  //   "is_drop_down": false,
                  //   "is_show": true
                  // }
                  //]
                })
                .catch((error) => {
                  this.$toast.error(
                    "錯誤：" +
                      (error.response?.data?.message ||
                        error.response?.status ||
                        error.message),
                    { duration: 2000 }
                  );
                });
            }
            
          },
          
      },
      
    }); 
  }