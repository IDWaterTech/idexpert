import Vue from "vue";
import https from "https";
Vue.mixin({
	methods: {
	    // 取得使用者清單
        getUserList:async function() {
            try {
                const agent = new https.Agent({
                rejectUnauthorized: false
                });
                let data = await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/`, { httpsAgent: agent }) //所有使用者的清單
                console.log("所有使用者的清單:" + data.request.responseURL);
                if(data.status==200) {
                return data.data;
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改使用者資訊
        patchUserList:async function(parm,id) {
        try {
            const agent = new https.Agent({
            rejectUnauthorized: false
            });
            let data = await this.$axios
            .patch(
            `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/${id}/`,
            parm,
            { httpsAgent: agent }
            )
            console.log("修改使用者的清單:" + data.request.responseURL);
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
        // 刪除使用者
        deleteUserList:async function(id) {
            try {
                const agent = new https.Agent({
                rejectUnauthorized: false
                });
                let data = await this.$axios
                .delete(
                    `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/${id}/`,
                    {
                    httpsAgent: agent
                    }
                )
                console.log("刪除使用者的清單:" + data.request.responseURL);
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
        // 新增使用者
        postUserList:async function(addform) {
            try {
                const agent = new https.Agent({
                rejectUnauthorized: false
                });
                let data = await this.$axios
                .post(
                    `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/`,addform,
                    {
                        httpsAgent: agent
                    }
                )
                console.log("新增使用者:" + data.request.responseURL);
                if (data.data == "資料建立有問題") {
                    alert("新增結果：" + data.data + "(帳號可能已存在)");
                }else if(data.data == "新增成功") {
                this.$toast.success("新增結果：" + data.data, {
                    duration: 2000
                });
                return true;
                }else {
                this.$toast.success("新增結果：" + data.data, {
                    duration: 2000
                });
                }

            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得組織清單
        getOrganizationList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/organization/`)
                console.log("組織清單:" + data.request.responseURL);
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
        // 發送line通知
        postLineNotifyList:async function(addform) {
            try {
                const agent = new https.Agent({
                rejectUnauthorized: false
                });
                let data = await this.$axios
                .post(
                    `${this.$store.state.mydata.gobal_api.apiUrl}/line-notify/`,addform,
                    {
                        httpsAgent: agent
                    }
                )
                console.log("新增使用者:" + data.request.responseURL);
                this.$toast.success(`發送結果：${(res.data=='發送結束')?'成功':res.data}`, {
                    duration: 2000
                });
                return data.data;

            }catch(error) {
                this.$toast.success("發送失敗：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得個別帳號資料
        getPersinalSettingList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/personal-settings/`,{
                    headers: parm
                })
                console.log("個別帳號清單:" + data.request.responseURL);
                if (data.data != "帳號資料不存在") {
                    // console.log('getUser',res.data);'
                    return data.data.is_personal_enable_line;
                    this.accdata[id].line_notify = res.data.is_personal_enable_line
                    
                    // this.$toast.success(`成功:${res.data}`, { duration: 2000 });
                } else {
                    return false;
                // this.$toast.error(`失敗:${res.data}`, { duration: 2000 });
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
	}
})
