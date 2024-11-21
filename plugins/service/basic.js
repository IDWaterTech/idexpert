import Vue from "vue";

Vue.mixin({
	methods: {
        // 取得場架構
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
                    var header = {
                        'x-api-key': '16069c362a26aa860be9c11bf791a05cdebe9bbec3f504df77dd0275c82adfa3'
                    }
                    let data =  this.$auth.$state.loggedIn?await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`):
                                await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`,{headers:header});
                
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
        getPondDataList:async function(parm=undefined) {
            try {
                let data =  parm?await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`, { params: parm }):await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/ponds-data/`)
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
                var header = {
                    'x-api-key': '16069c362a26aa860be9c11bf791a05cdebe9bbec3f504df77dd0275c82adfa3'
                }
                let data = this.$auth.$state.loggedIn? await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`):
                            await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`,{headers:header})
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
        // 新增池況狀態顏色
        postPondStateColorList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/`,addform,)
                console.log("新增池況狀態顏色:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改池況狀態顏色
        patchPondStateColorList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/${id}/`,parm,)
                console.log("修改池況狀態顏色:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除池況狀態顏色
        deletePondStateColorList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-state/${id}/`)
                console.log("刪除池況狀態顏色:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
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
        //===== 指標資料 =====//
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
        // 取得水質欄位清單
        getAllColForSearchList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/all-col-for-search/`)
                console.log("水質欄位清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得水質折線圖清單
        getAllDataList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/all-data/`, { params: parm })
                console.log("折線圖清單:" + data.request.responseURL);
                if(data.data=='欄位資料有誤'){
                    this.$toast.error(`取得結果：欄位資料有誤`, { duration: 2000 });
                    return [];
                }else{
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得水質紀錄清單
        getColDataList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/`)
                console.log("水質欄位清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增水質紀錄
        postAllDataList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/all-data/`,addform,)
                console.log("新增水質紀錄:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改水質紀錄
        patchAllDataList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/all-data/${id}/`,parm,)
                console.log("修改種苗:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除水質紀錄清單
        deleteAllDataList:async function(id,parm) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/all-data/${id}/`, { data: parm })
                console.log("刪除水質紀錄:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    // this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    return false;
                    // this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 機器人確認
        getRecaptchacheckList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiIIS82}/recaptchacheck`,{params : parm})
                console.log("機器人確認:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得觀察網清單
        getObservationRecordList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/observation-record/`,{ params: parm })
                console.log("觀察網清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增觀察網
        postObservationRecordList:async function(addform) {
            try {
                let config = { headers: { "Content-Type": "multipart/form-data" } };
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/shrimp-record/`,addform,config)
                console.log("新增觀察網:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改觀察網
        patchObservationRecordList:async function(parm,id) {
            try {
                let config = { headers: { "Content-Type": "multipart/form-data" } };
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/shrimp-record/${id}/`,parm,config)
                console.log("修改觀察網:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除觀察網
        deleteObservationRecordList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/shrimp-record/${id}/`)
                console.log("刪除觀察網:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增殘餌
        postLeftoverRecordList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/leftover-record/`,addform,)
                console.log("新增殘餌:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改殘餌
        patchLeftoverRecordList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/leftover-record/${id}/`,parm,)
                console.log("修改殘餌:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除殘餌
        deleteLeftoverRecordList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/leftover-record/${id}/`)
                console.log("刪除殘餌:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    this.$toast.success("成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得水質在時間範圍內的數值
        getLastDataInCurrentTimeList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/last-data-in-current-time-range/`, { params: parm })
                console.log("水質在時間範圍內的數值清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
                return [];
            }
        },
        // 取得分析圖表資料
        getAnalyzeDataList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/all-data/`, { params: parm })
                console.log("分析圖表:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        //===== 重要紀事 =====//
        // 取得飼料事件
        getFeedEventList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-event-settings/`)
                console.log("事件清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增飼料事件
        postFeedEventList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-event-settings/`,addform,)
                console.log("新增事件:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改飼料事件
        patchFeedEventList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-event-settings/${id}/`,parm)
                console.log("修改事件:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除飼料事件清單
        deleteFeedEventList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-event-settings/${id}/`)
                console.log("刪除飼料事件:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得警戒等級
        getEventLevelList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/event-level/`)
                console.log("警戒等級清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得事件類型
        getEventCatagoryList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/event-category/`)
                console.log("事件類型清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增事件
        postEventList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/event/`,addform,)
                console.log("新增事件:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改事件
        patchEventList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/event/${id}/`,parm,)
                console.log("修改事件:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除事件
        deleteEventList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/event/${id}`)
                console.log("刪除事件:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 地圖資料
        getMapList:async function(parm) {
            try {
                var header = {
                    'x-api-key': '16069c362a26aa860be9c11bf791a05cdebe9bbec3f504df77dd0275c82adfa3'
                }
                let data =  this.$auth.$state.loggedIn?await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/map/`, { params: parm }):
                            await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/map/`,{headers:header,params: parm})
                console.log("地圖資料清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("事件錯誤：" + error, { duration: 2000 });
                console.log(error);
                return [];
            }
        },
        // 新增地圖
        postMapList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/map/`,addform,)
                console.log("新增地圖:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        //===== 場域設定 =====//
        // 新增場
        postFactoryList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/factory/`,addform,)
                console.log("新增場:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data+'! 請至「帳號管理」編輯所屬場別，方可檢視/操作此場', {
                        duration: 5000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改場
        patchFactoryList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/factory/${id}/`,parm,)
                console.log("修改場:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除場
        deleteFactoryList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/factory/${id}/`)
                console.log("刪除場:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增區
        postPondAreaList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-area/`,addform,)
                console.log("新增區:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改區
        patchPondAreaList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-area/${id}/`,parm,)
                console.log("修改區:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除區
        deletePondAreaList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/pond-area/${id}/`)
                console.log("刪除區:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增池
        postPondList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/pond/`,addform,)
                console.log("新增池:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改池
        patchPondList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/pond/${id}/`,parm,)
                console.log("修改池:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除池
        deletePondList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/pond/${id}/`)
                console.log("刪除池:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得ip清單
        getDeviceSettingList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/device-settings/`)
                console.log("ip清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增ip
        postDeviceSettingList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/device-settings/`,addform,)
                console.log("新增ip:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改ip
        patchDeviceSettingList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/device-settings/${id}/`,parm,)
                console.log("修改ip:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        //===== 設備管理 =====//
        // 取得設備清單
        getDeviceList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/device/`)
                console.log("設備清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增設備
        posDeviceList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/device/`,addform,)
                console.log("新增設備:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改設備
        patchDeviceList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/device/${id}/`,parm,)
                console.log("修改設備:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除設備
        deleteDeviceList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/device/${id}/`)
                console.log("刪除設備:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        //===== 監測管理 =====//
        // 新增水質欄位
        postColDataList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/`,addform,)
                console.log("新增水質欄位:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改水質欄位
        patchColDataList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/${id}/`,parm,)
                console.log("修改水質欄位:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除水質欄位
        deleteColDataList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/col-data/${id}/`)
                console.log("刪除水質欄位:" + data.request.responseURL);
                if(data.data == "刪除成功") {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        //===== 影像辨識 =====//
        // 同步
        postObservationImageDownloadList:async function() {
            try {
                let data =  await this.$axios.post(`${this.$store.state.mydata.gobal_api.apiUrl}/observation-image-download/`)
                console.log("同步:" + data.request.responseURL,data);
                if(data.status==200) {
                    if(data.data.detail== 'Success') {
                        this.$toast.success(data.data.messages[0], {
                            duration: 2000
                        });
                    }else {
                        this.$toast.error(data.data.messages[0], { duration: 2000 });
                    }
                    return true;
                }else {
                    this.$toast.error(data.data.messages[0], { duration: 2000 });
                    return false;
                }

            }catch(error) {
                if(error.response) {
                    this.$toast.error("錯誤：" + error.response.data.messages[0], { duration: 2000 });
                    console.error('API Error:', error.response);
                }else {
                    this.$toast.error("錯誤：" + error, { duration: 2000 });
                    console.error('API Error:', error);
                }
                return false;
            }
        },
        // 取得觀察網
        getObservationImageDataList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/observation-image-data/`, { params: parm })
                console.log("觀察網清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error(`取得觀察網資料失敗:${error.message}`, { duration: 2000 });
                console.log(error);
                return [];
            }
        },
        // 取得菌相
        getBacteriaImageDataList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/bacteria-image-data/`, { params: parm })
                console.log("菌相清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error(`取得菌相資料失敗:${error.message}`, { duration: 2000 });
                console.log(error);
                return [];
            }
        },
        // 新增菌相
        postBacteriaImageDataList:async function(addform) {
            try {
                let config = { headers: { "Content-Type": "multipart/form-data" } };
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/bacteria-image-data/`,addform,config)
                console.log("新增菌相:" + data.request.responseURL);
                if(data.status==200) {
                    console.log(data);
                    if(data.data.messages[0]=='新增成功') {
                        this.$toast.success("新增結果：" + data.data.messages[0], {
                            duration: 2000
                        });
                        return true;
                    }else {
                        this.$toast.error("新增失敗：" + data.data.messages[0], {
                            duration: 2000
                        });
                    }
                }else {
                    console.log(data);
                    this.$toast.error("新增失敗：" + data.data.messages[0], {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                if(error.response) {
                    console.error('API Error:', error.response);
                    this.$toast.error("錯誤：" + error.response.data.messages[0], { duration: 2000 });
                }
                else {
                    this.$toast.error("錯誤：" + error, { duration: 2000 });
                    console.log(error);
                }
                // this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                // console.log(error);
            }
        },
        // 刪除菌相
        deleteBacteriaImageList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/bacteria-image-data/${id}/`)
                console.log("刪除菌相:" + data.request.responseURL);
                if(data.status==200) {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data.messages[0], { duration: 2000 });
                }
    
            }catch(error) {
                if(error.response) {
                    this.$toast.error("錯誤：" + error.response.data.messages[0], { duration: 2000 });
                    console.error('API Error:', error.response);
                }else {
                    this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
                }
                
            }
        },
        // 取得水質監測的警告範圍
        getBasicWarningRangeList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/warning-range/`, { params: parm })
                console.log("水質監測的警告範圍清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    this.$toast.error("錯誤：" + data.data, { duration: 2000 });
                    return [];
                }

            }catch(error) {
                if(error.response) {
                    this.$toast.error("錯誤：" + error.response.data.messages[0], { duration: 2000 });
                    console.error('API Error:', error.response);
                }else {
                    this.$toast.error("錯誤：" + error, { duration: 2000 });
                    console.log(error);
                }
                return [];
            }
        },
	}
})
