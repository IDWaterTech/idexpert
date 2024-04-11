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
            }
        },
    }
})