import Vue from "vue";
import https from "https";
Vue.mixin({
	methods: {
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
                return [];
            }
        },
        // 取得水質監測的警告範圍
        getWarningRangeList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiKbUrl}/warning-range/`)
                console.log("水質監測的警告範圍清單:" + data.request.responseURL);
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
        // 取得AI建議
        getSuggestionList:async function(parm) {
            try {
                let data =  await this.$axios.post(`${this.$store.state.mydata.gobal_api.apiKbUrl}/suggestion/`, parm)
                console.log("AI建議:" + data.request.responseURL);
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
        // 取得所有查詢紀錄
        getQueryLogList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/`, { params: parm })
                console.log("所有查詢紀錄清單:" + data.request.responseURL);
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
        // 修改紀錄
        patchQueryLogList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/${id}/`,parm,)
                console.log("修改紀錄:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("覆蓋成功!!", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("覆蓋失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除紀錄
        deleteQueryLogList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiKbUrl}/query-log/${id}/`)
                console.log("刪除紀錄:" + data.request.responseURL);
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
        // 取得初始紀錄
        getRequiredDataList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/kb/required-data/`, { params: parm })
                console.log("初始紀錄清單:" + data.request.responseURL);
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
    }
})