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
              console.log("ACC DATA:",acc);
              //登入成功
              if (acc.length == 1) {
                //增加身份判別---
                //帳號被授權進入的項目
                let accheader = { account: this.$auth.$state.user.email };
                let accPagelst = [];
                await this.$axios
                  .get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/authorization-menu/`, {
                    headers: accheader
                  }) 
                  .then(res => {
                    accPagelst = res.data;
                    console.log("accPagelst:",accPagelst);
                    console.log("accPage api:",res.request.responseURL);
                    this.$store.commit('mydata/set_listitems', accPagelst);
                  });
                  let urlpath = $nuxt.$route.path;
                  function getallpath(item){
                    let tmplst=[];
                    item.forEach(element => {
                      tmplst.push(element.url);
                      if(element.hasOwnProperty("other_children")){
                        tmplst.push(...element["other_children"].map(x=>{return x.url}));
                      }
                      if(element.hasOwnProperty("children")){
                        tmplst.push(...getallpath(element["children"]));
                      }
                    });
                    return tmplst;
                  }
                  let accPagelstNew= getallpath(accPagelst).map((x)=>{return x.toLowerCase();});
                  //排除根目錄、個人頁、登入頁
                  var isallowPath =(accPagelstNew.filter(x=>x == urlpath.toLowerCase()).length == 1) || ["/","/set/profile","/login"].includes(urlpath);
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
          }
      },
      
    }); 
  }