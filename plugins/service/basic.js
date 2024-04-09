import Vue from "vue";

Vue.mixin({
	methods: {
	    getArchitecture: async function(_factoryid,isAll=false) {
            // _factoryid 預設只帶該場資料，其他不需要
            try {
                if(isAll) {
                    let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/?is_pond_empty=true`);
                    if(data.status==200) {
                        console.log("場區池整體資料架構API:" + data.request.responseURL);
                        return data.data;
                    }else {
                        return [];
                    }
                }else {
                    let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`);
                
                    if(data.status==200) {
                        console.log("場區池整體資料架構API:" + data.request.responseURL);
                        let mainData = [];
                        let resdata = _.cloneDeep(data.data);
                        if(_factoryid!=null){
                            mainData = resdata.filter(x=>x.id==_factoryid);
                            return (this.$route.path=='/set/account')?data.data:mainData;
                        }
                        if(localStorage.getItem('factory_id')) {
                            // console.log('locoal',localStorage.getItem('factory_id'))
                            let factory_id = JSON.parse(localStorage.getItem('factory_id'));
                            resdata.forEach(factory=>{
                                factory_id.forEach(f=>{
                                    if(factory.id==f) {
                                        mainData.push(factory);
                                    }
                                })
                            })
                        }
                        // console.log('url',this.$route.path)
                        return (this.$route.path=='/set/account')?data.data:mainData;
                    }else {
                        console.log(data);
                        return [];
                    }
                }
                
            }catch(err) {
                console.log(err);
            }
            
        },
        // 取得池資料清單
        getPondDataList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`)
                console.log("池資料清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    this.$toast.error("錯誤：" + error, { duration: 2000 });
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得池況狀態顏色
        getPondStateList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`)
                console.log("池況狀態顏色清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    this.$toast.error("錯誤：" + error, { duration: 2000 });
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改池況狀態
        patchPondStateList:async function(x,parm) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-to-state/${x}/`, parm)
                console.log("修改池況狀態:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    // this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    return false;
                    // this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                // this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得水源/蝦況選項項目
        getFieldOtptionList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiKbUrl}/field-option/`)
                console.log("取得水源/蝦況選項項目清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    this.$toast.error("錯誤：" + error, { duration: 2000 });
                    return [];
                }
            }catch(error) {
                this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
            }
        },
        // 取得事件清單
        getEventList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/event/`, { params: parm })
                console.log("事件清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("事件錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
	}
})
