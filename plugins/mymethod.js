import Vue from "vue";
// Make sure to pick a unique name for the flag
// so it won't conflict with any other mixin.
  if (!Vue.__my_mixin__) {
    Vue.__my_mixin__ = true;
    Vue.mixin({
      data () {
        return {
          moment_format: 'DD/MM/YYYY HH:mm'
        }
      },
      methods: {
          hmix: function() {
              console.log("mixin methods");
            },
          _pageCheck:async function(){
           if (this.$auth.$state.loggedIn) {
              let acclist = [];
              await this.$axios
                .get(`${process.env.apiUrl}/user-access/account/`) //所有使用者的清單
                .then(res => {
                  acclist = res.data;
                });
              var acc = acclist.filter(
                x => x.username.toLowerCase() == this.$auth.$state.user.email.toLowerCase() && x.is_active == true
              );
              //登入成功
              if (acc.length == 1) {
                //增加身份判別---
                //帳號被授權進入的項目
                let accheader = { account: this.$auth.$state.user.email };
                let accPagelst = [];
                await this.$axios
                  .get(`${process.env.apiUrl}/user-access/authorization-menu/`, {
                    headers: accheader
                  }) 
                  .then(res => {
                    accPagelst = res.data;
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
                  var isallowPath =accPagelstNew.filter(x=>x == urlpath.toLowerCase()).length == 1;
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
      
    }); 
  }