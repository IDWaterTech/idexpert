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
          
        }
      },
      methods: {
          hmix: function() {
              console.log("mixin methods");
            },
          _pageCheck:async function(){
            if (this.$auth.$state.loggedIn) {
              let acclist = [];
              const agent = new https.Agent({
                rejectUnauthorized: false
              });
              await this.$axios
                .get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/`, { httpsAgent: agent }) //所有使用者的清單
                .then(res => {
                  acclist = res.data;
                  console.log("accList api：" + res.request.responseURL);
                })
                .catch(error => {
                  this.$toast.error("錯誤：" + error, { duration: 2000 });
                });
              var acc = acclist.filter(
                x => x.username.toLowerCase() == this.$auth.$state.user.email.toLowerCase() && x.is_active == true
              );
              localStorage.setItem('factory_id',JSON.stringify(acc[0].factory_id));
              console.log("ACC DATA:",acc);
              //登入成功
              if (acc.length == 1) {
                //增加身份判別---
                //帳號被授權進入的項目
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
                  accPagelst = data;
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
          getMenuAuthorization:async function(bool){
            let menu = [];
            const agent = new https.Agent({
              rejectUnauthorized: false
            });
            const accheader = { account: this.$auth.$state.user.email };
            const url = bool?`/user-access/authorization-items/?is_all=true`:`/user-access/authorization-items/`;
            return await this.$axios
              .get(`${this.$store.state.mydata.gobal_api.apiUrl+url}`, { httpsAgent: agent,headers:accheader }) //所有使用者的清單
              // .then(res => {
              //   console.log("authorization-items api：" + res.request.responseURL);
              //   console.log('getMenuAuthorization',menu,accheader);
              // })
              // .catch(error => {
              //   this.$toast.error("錯誤：" + error, { duration: 2000 });
              // });
        },
      },
      
    }); 
  }