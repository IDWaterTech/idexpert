import Vue from "vue";
import https from "https";
Vue.mixin({
	methods: {
        /* 料量設定 */
        // 取得所有池況清單
        getAllPoolStateList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/state-of-all-pools/`)
                console.log("所有池況清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得料表(帶入時間)
        getFeedRecordList:async function(param) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-record/`,{
                    params: param
                })
                console.log("料表:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得飼料表設定清單
        getFeedEventSettingList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-event-settings/`)
                console.log("飼料表設定清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error(`飼料表設定-清單 失敗:${err.message}`, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得特定時間資料料表
        getFeedRecordRowsList:async function(param) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-record-rows/`,{params:param})
                console.log("特定時間資料料表:" + data.request.responseURL);
                if(data.status==200) {
                    return {
                        success: true,
                        data:data.data
                    };
                }else {
                    return {
                        success: false,
                        data:data.data
                    };
                }

            }catch(error) {
                // this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
                return {
                    success: false,
                    data:error
                };
            }
        },
        // 新增料表
        postFeedRecordList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-record/`,addform,)
                console.log("新增料表:" + data.request.responseURL);
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
        // 刪除料表
        deleteFeedRecordList:async function(param) {
            try {
                let data = await this.$axios.post(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-record-batch-delete/`, param)
                console.log("刪除料表:" + data.request.responseURL);
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
        // 取得料表資料
        getFeedCheckList:async function(param,bool) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-checklist/`,{
                    params: param
                })
                console.log("料表:" + data.request.responseURL);
                if(data.status==200) {
                    if(bool!==true) {
                        this.$toast.success(`取得料表成功`, { duration: 2000 });
                    }
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        /* 料表執行 */
        // 取得合計資料
        getRecordTotalList:async function(param) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-record-total-by-time/`,{
                    params: param
                })
                console.log("合計:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("取得合計失敗：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 執行料表
        postFeedCheckUpdateList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-checklist-batch-update/`,addform)
                console.log("執行料表:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success(`執行成功：${addform.id.length}筆`, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error(`執行失敗:${error}`, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error(`執行失敗:${error}`, {
                    duration: 2000
                });
                console.log(error);
            }
        },
        /* 飼料設定 */
        //===== 廠商 =====//
        // 取得廠商清單
        getManufacturerList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/`)
                console.log("廠商清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("取得廠商資料失敗：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增廠商
        postManufacturerList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/`,addform)
                console.log("新增廠商:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增廠商失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改廠商
        patchManufacturerList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/${id}/`,parm,)
                console.log("修改廠商:" + data.request.responseURL);
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
        // 刪除廠商
        deleteManufacturerList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/manufacturer/${id}/`)
                console.log("刪除廠商:" + data.request.responseURL);
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
        //===== 成分 =====//
        //取得成份類別清單
        getFeedIngredientCategoryList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/`)
                console.log("成份類別清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("取得成份類別清單失敗：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增成份類別
        postFeedIngredientCategoryList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/`,addform,)
                console.log("新增成份類別:" + data.request.responseURL);
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
        // 修改成份類別
        patchFeedIngredientCategoryList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/${id}/`,parm,)
                console.log("修改成份類別:" + data.request.responseURL);
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
        // 刪除成份類別
        deleteFeedIngredientCategoryList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient-category/${id}/`)
                console.log("刪除成份類別:" + data.request.responseURL);
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
        //取得成份類別及細項
        getFeedCategoryItemList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-category-and-items/`)
                console.log("成份類別及細項清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("取得成份類別及細項失敗：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        //取得成份清單
        getFeedIngredientList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/`)
                console.log("成份清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增成份
        postFeedIngredientList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/`,addform,)
                console.log("新增成份:" + data.request.responseURL);
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
        // 修改成份
        patchFeedIngredientList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/${id}/`,parm,)
                console.log("修改成份:" + data.request.responseURL);
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
        // 刪除成份
        deleteFeedIngredientList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-ingredient/${id}/`)
                console.log("刪除種苗:" + data.request.responseURL);
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
        // 取得參數清單
        getParameterList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/parameter/`)
                console.log("參數清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增參數清單
        postParameterList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/parameter/`,addform,)
                console.log("新增參數:" + data.request.responseURL);
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
        //===== 套餐設定 =====//
        // 取得套餐清單
        getFeedSettingList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/`)
                console.log("套餐清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }

            }catch(error) {
                this.$toast.error(`取得得套餐清單(飼料設定)失敗:${error}`, {
                    duration: 2000
                });
            }
        },
        // 新增套餐
        postFeedSettingList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/`,addform,)
                console.log("新增套餐:" + data.request.responseURL);
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
        // 修改套餐
        patchFeedSettingList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/${id}/`,parm,)
                console.log("修改套餐:" + data.request.responseURL);
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
        // 刪除套餐(目前無用)
        deleteFeedSettingList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/feed-settings/${id}/`)
                console.log("刪除套餐:" + data.request.responseURL);
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
    }
})