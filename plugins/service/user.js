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
                `${this.$store.state.mydata.gobal_api.apiUrl}/user-access/account/`,
                this.addform,
                {
                httpsAgent: agent
                }
            )
            console.log("刪除使用者的清單:" + data.request.responseURL);
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
        }
	}
})
