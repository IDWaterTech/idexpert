import Vue from "vue";
import https from "https";
Vue.mixin({
	methods: {
        // 取得單一使用者資料
        _getUserData: async function() {
            let userDataList = await this.getUserList();
            var userDataListCheck = typeof (userDataList)=='string'?[]:userDataList;
            var acc = userDataListCheck.filter(x=>x.username == this.$auth.$state.user.email)[0];
            let UserData = _.cloneDeep(acc);
            // console.log("_UserData:",UserData);
            return UserData;
        },
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
                }else {
                    return []
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
            if(data.status==200) {
                if(data.data.messages[0]=='修改成功') {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                    return false;
                }
            }else{
                this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                return false;
            }

        }catch(error) {
            if(error.response) {
                console.error('API Error:', error.response);
                this.$toast.error("修改失敗：" + error.response.data.messages[0], { duration: 2000 });
            }
            else {
                this.$toast.error("修改失敗：" + error, { duration: 2000 });
                console.log(error);
            }
            return false;
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
                if(data.status==200) {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data.messages[0], { duration: 2000 });
                    return false;
                }
            }catch(error) {
                if(error.response) {
                    this.$toast.error("錯誤：" + error.response.data.messages[0], { duration: 2000 });
                    console.error('API Error:', error.response);
                }else {
                    this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                    console.log(error);
                }
                return false;
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
                        return false;
                    }
                }else {
                    console.log(data);
                    this.$toast.error("新增失敗：" + data.data.messages[0], {
                        duration: 2000
                    });
                    return false;
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
                return false;
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
                console.log('parm',parm)
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/personal-settings/`,{
                    headers: parm
                })
                if(data.status==200) {
                    return data.data;
                }else{
                    return {};
                }
                // console.log("個別帳號清單:" + data.request.responseURL);
                // if (data.data != "帳號資料不存在") {
                //     // console.log('getUser',res.data);'
                //     return data.data.is_personal_enable_line;
                //     // this.$toast.success(`成功:${res.data}`, { duration: 2000 });
                // } else {
                //     return false;
                // // this.$toast.error(`失敗:${res.data}`, { duration: 2000 });
                // }

            }catch(error) {
                if(error.response) {
                    this.$toast.error("錯誤：" + error.response.data.messages[0], { duration: 2000 });
                    console.error('API Error:', error.response);
                }else {
                    this.$toast.error("錯誤：" + error, { duration: 2000 });
                    console.log(error);
                }
                return {};
                // this.$toast.error("錯誤：" + error, { duration: 2000 });
                // console.log(error);
            }
        },
        // 修改個別帳號資料
        patchPersonalSettingList:async function(parm,id) {
            try {
                let accheader = { account: this.$auth.$state.user.email };
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/personal-settings/${id}/`,parm,
                    {
                      headers: accheader
                    })
                console.log("修改個別帳號資料:" + data.request.responseURL);
                if(data.status==200) {
                    if(data.data.messages[0]=='修改成功') {
                        this.$toast.success("修改成功", { duration: 2000 });
                        return true;
                    }else {
                        this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                        return false;
                    }
                }else{
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                    return false;
                }

            }catch(error) {
                if(error.response) {
                    console.error('API Error:', error.response);
                    this.$toast.error("修改失敗：" + error.response.data.messages[0], { duration: 2000 });
                }
                else {
                    this.$toast.error("修改失敗：" + error, { duration: 2000 });
                    console.log(error);
                }
                return false;
            }
        },
        // 取得授權清單
        getRoleList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/role/`)
                console.log("授權清單:" + data.request.responseURL);
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
        // 新增授權
        postRoleList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/role/`,addform,)
                console.log("新增授權:" + data.request.responseURL);
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
        // 修改授權
        patchRoleList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/role/${id}/`,parm,)
                console.log("修改授權:" + data.request.responseURL);
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
        // 刪除授權
        deleteRoleList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/user-access/role/${id}`)
                console.log("刪除授權:" + data.request.responseURL);
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
