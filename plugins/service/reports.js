import Vue from "vue";

Vue.mixin({
	methods: {
        // 取得報表清單
        getReportList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/reports/report/`)
                console.log("報表清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                if(error.response) {
                    this.$toast.error("錯誤：" + error.response.data.messages[0], { duration: 2000 });
                    console.error('API Error:', error.response);
                }else {
                    this.$toast.error(`失敗:${err.message}`, { duration: 2000 });
                    console.log(error);
                }
                return [];
            }
        },
        getFeedReportList:async function (parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/reports/feed-report/`,{ params: parm })
                console.log("報表清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                if(error.response) {
                    this.$toast.error("錯誤：" + error.response.data.messages[0], { duration: 2000 });
                    console.error('API Error:', error.response);
                }else {
                    this.$toast.error(`失敗:${err.message}`, { duration: 2000 });
                    console.log(error);
                }
                return [];
            }
        },
    }
})