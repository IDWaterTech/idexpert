import Vue from "vue";
import https from "https";
Vue.mixin({
	methods: {
        /* 養殖設定 */
        //===== 種苗 =====//
        // 取得種苗清單
        getSeedlingList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/seedling/`)
                console.log("種苗清單:" + data.request.responseURL);
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
        // 新增種苗
        postSeedlingList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/seedling/`,addform,)
                console.log("新增種苗:" + data.request.responseURL);
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
        // 修改種苗
        patchSeedlingList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/seedling/${id}/`,parm,)
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
        // 刪除種苗
        deleteSeedlingList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/seedling/${id}/`)
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
        //=====品種=====//
	    // 取得品種清單
        getSpeciesList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/species/`)
                console.log("品種清單:" + data.request.responseURL);
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
        // 新增品種
        postSpeciesList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/species/`,addform,)
                console.log("新增品種:" + data.request.responseURL);
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
        // 修改品種資訊
        patchSpeciesList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/species/${id}/`,parm,)
                console.log("修改品種:" + data.request.responseURL);
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
        // 刪除品種
        deleteSpeciesList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/species/${id}/`)
                console.log("刪除品種:" + data.request.responseURL);
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
        //===== 疾病 =====//
        // 取得疾病檢驗清單
        getDiseaseList:async function(parm) {
            //下列三個欄位需至少輸入一個欄位
            // species_id: 品種id (ex: 1)
            // species_name_ch: 品種中文名稱 (ex: 白蝦)
            // species_name_en: 品種英文名稱 (ex: WhiteShrimp)
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease/`, { params: parm })
                console.log("疾病檢驗清單:" + data.request.responseURL);
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
        // 新增疾病檢驗
        postDiseaseList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease/`,addform,)
                console.log("新增疾病檢驗:" + data.request.responseURL);
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
        // 修改疾病檢驗資訊
        patchDiseaseList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease/${id}/`,parm,)
                console.log("修改疾病檢驗:" + data.request.responseURL);
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
        // 刪除疾病檢驗
        deleteDiseaseList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease/${id}/`)
                console.log("刪除疾病檢驗:" + data.request.responseURL);
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
        //===== 檢驗 =====//
        // 取得檢驗方法清單
        getMethodList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-method/`)
                console.log("檢驗方法清單:" + data.request.responseURL);
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
        // 新增檢驗方法
        postMethodList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-method/`,addform,)
                console.log("新增檢驗方法:" + data.request.responseURL);
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
        // 修改檢驗方法資訊
        patchMethodList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-method/${id}/`,parm,)
                console.log("修改檢驗方法:" + data.request.responseURL);
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
        // 刪除檢驗方法
        deleteMethodList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-method/${id}/`)
                console.log("刪除檢驗方法:" + data.request.responseURL);
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
        //===== 樣板設定 =====//
        // 取得樣板清單
        // getTemplateList:async function() {
        //     try {
        //         let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/`)
        //         console.log("樣板清單:" + data.request.responseURL);
        //         if(data.status==200) {
        //             return data.data;
        //         }else {
        //             return [];
        //         }

        //     }catch(error) {
        //         this.$toast.error("錯誤：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 取得樣板清單
        getTemplateList2:async function(bool=false) {
            try {
                let url = bool?`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template2/?id=1`:`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template2/`
                let data =  await this.$axios.get(url)
                console.log("樣板清單:" + data.request.responseURL);
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
        // 新增樣板
        // postTemplateList:async function(addform) {
        //     try {
        //         let data = await this.$axios
        //         .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/`,addform,)
        //         console.log("新增樣板:" + data.request.responseURL);
        //         if(data.data == "新增成功") {
        //             this.$toast.success("新增結果：" + data.data, {
        //                 duration: 2000
        //             });
        //             return true;
        //         }else {
        //             this.$toast.error("新增失敗：" + data.data, {
        //                 duration: 2000
        //             });
        //         }
    
        //     }catch(error) {
        //         this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 新增樣板
        postTemplateList2:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template2/`,addform,)
                console.log("新增樣板:" + data.request.responseURL);
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
        // 修改樣板
        // patchTemplateList:async function(parm,id) {
        //     try {
        //         let data = await this.$axios
        //         .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/${id}/`,parm,)
        //         console.log("修改檢驗方法:" + data.request.responseURL);
        //         if(data.data == "修改成功") {
        //             this.$toast.success("修改成功", { duration: 2000 });
        //             return true;
        //         }else {
        //             this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
        //         }
    
        //     }catch(error) {
        //         this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 修改樣板
        patchTemplateList2:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template2/${id}/`,parm,)
                console.log("修改檢驗方法:" + data.request.responseURL);
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
        // 刪除樣板
        // deleteTemplateList:async function(id) {
        //     try {
        //         let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template/${id}/`)
        //         console.log("刪除樣板:" + data.request.responseURL);
        //         if(data.data == "刪除成功") {
        //             this.$toast.success("刪除成功", { duration: 2000 });
        //             return true;
        //         }else {
        //             this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
        //         }
    
        //     }catch(error) {
        //         this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 刪除樣板
        deleteTemplateList2:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/template2/${id}/`)
                console.log("刪除樣板:" + data.request.responseURL);
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
        // 取得項目
        // getBreedingStepList:async function() {
        //     try {
        //         let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/`)
        //         console.log("項目清單:" + data.request.responseURL);
        //         if(data.status==200) {
        //             return data.data;
        //         }else {
        //             return [];
        //         }

        //     }catch(error) {
        //         this.$toast.error("錯誤：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 取得項目
        getBreedingStepList2:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/action2/`)
                console.log("項目清單:" + data.request.responseURL);
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
        // 新增項目
        // postBreedingStepList:async function(addform) {
        //     try {
        //         let data = await this.$axios
        //         .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/`,addform,)
        //         console.log("新增項目:" + data.request.responseURL);
        //         if(data.data == "新增成功") {
        //             this.$toast.success("新增結果：" + data.data, {
        //                 duration: 2000
        //             });
        //             return true;
        //         }else {
        //             this.$toast.error("新增失敗：" + data.data, {
        //                 duration: 2000
        //             });
        //         }
    
        //     }catch(error) {
        //         this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 新增項目
        postBreedingStepList2:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/action2/`,addform,)
                console.log("新增項目:" + data.request.responseURL);
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
        // 修改項目
        // patchBreedingStepList:async function(parm,id) {
        //     try {
        //         let data = await this.$axios
        //         .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/${id}/`,parm,)
        //         console.log("修改項目:" + data.request.responseURL);
        //         if(data.data == "修改成功") {
        //             this.$toast.success("修改成功", { duration: 2000 });
        //             return true;
        //         }else {
        //             this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
        //         }
    
        //     }catch(error) {
        //         this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 修改項目
        patchBreedingStepList2:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/action2/${id}/`,parm,)
                console.log("修改項目:" + data.request.responseURL);
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
        // 刪除項目
        // deleteBreedingStepList:async function(id) {
        //     try {
        //         let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step/${id}/`)
        //         console.log("刪除項目:" + data.request.responseURL);
        //         if(data.data == "刪除成功") {
        //             this.$toast.success("刪除成功", { duration: 2000 });
        //             return true;
        //         }else {
        //             this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
        //         }
    
        //     }catch(error) {
        //         this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 刪除項目
        deleteBreedingStepList2:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/action2/${id}/`)
                console.log("刪除項目:" + data.request.responseURL);
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
        // 取得工作
        getBreedingWorkList:async function() {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step2/`)
                console.log("工作清單:" + data.request.responseURL);
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
        // 新增工作
        postBreedingWorkList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step2/`,addform,)
                console.log("新增工作:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增結果：" + data.data, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data, {
                        duration: 2000
                    });
                    return false;
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改項目
        patchBreedingWorkList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step2/${id}/`,parm,)
                console.log("修改工作:" + data.request.responseURL);
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
        // 刪除項目
        deleteBreedingWorkList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/step2/${id}/`)
                console.log("刪除工作:" + data.request.responseURL);
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
        /* 養殖循環 */
        // 取得循環資料清單
        // getBreedingRecordList:async function(parm_url) {
        //     try {
        //         let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record/?${parm_url}`)
        //         console.log("循環資料清單:" + data.request.responseURL);
        //         if(data.status==200) {
        //             return data.data;
        //         }else {
        //             return [];
        //         }

        //     }catch(error) {
        //         this.$toast.error("錯誤：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 取得循環資料清單
        getBreedingRecordList2:async function(parm_url) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record2/?${parm_url}`)
                console.log("循環資料清單:" + data.request.responseURL);
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
        // 新增循環
        // postBreedingRecordList:async function(addform) {
        //     try {
        //         let data = await this.$axios
        //         .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record/`,addform,)
        //         console.log("新增循環:" + data.request.responseURL);
        //         if(data.data == "新增成功") {
        //             this.$toast.success("新增結果：" + data.data, {
        //                 duration: 2000
        //             });
        //             return true;
        //         }else {
        //             this.$toast.error("新增失敗：" + data.data, {
        //                 duration: 2000
        //             });
        //         }
    
        //     }catch(error) {
        //         this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 新增循環
        postBreedingRecordList2:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record2/`,addform,)
                console.log("新增循環:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    this.$toast.success("新增成功，自動調整池狀態", { duration: 2000 });
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
        // 修改循環資料
        // patchBreedingRecordList:async function(parm,id) {
        //     try {
        //         let data = await this.$axios
        //         .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record/${id}/`,parm,)
        //         console.log("修改循環資料:" + data.request.responseURL);
        //         if(data.data == "修改成功") {
        //             this.$toast.success("修改成功", { duration: 2000 });
        //             return true;
        //         }else {
        //             this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
        //         }
    
        //     }catch(error) {
        //         this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 修改循環資料
        patchBreedingRecordList2:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record2/${id}/`,parm,)
                console.log("修改循環資料:" + data.request.responseURL);
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
        // 刪除循環資料
        // deleteBreedingRecordList:async function(id) {
        //     try {
        //         let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record/${id}/`)
        //         console.log("刪除循環資料:" + data.request.responseURL);
        //         if(data.data == "刪除成功") {
        //             this.$toast.success("刪除成功", { duration: 2000 });
        //             return true;
        //         }else {
        //             this.$toast.success("刪除失敗：" + data.data, { duration: 2000 });
        //         }
    
        //     }catch(error) {
        //         this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 刪除循環資料
        deleteBreedingRecordList2:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record2/${id}/`)
                console.log("刪除循環資料:" + data.request.responseURL);
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
        // 取得循環樣板
        // getBreedingRecordTemplateList:async function(parm) {
        //     try {
        //         let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-template/`, { params: parm })
        //         console.log("循環樣板:" + data.request.responseURL);
        //         if(data.data=='養殖循環樣板資料不存在') {
        //             this.$toast.error("error:" + data.data, { duration: 2000 });
        //         }else if(data.status==200) {
        //             return data.data;
        //         }else {
        //             return [];
        //         }

        //     }catch(error) {
        //         this.$toast.error("錯誤：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 取得循環樣板
        getBreedingRecordTemplateList2:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-template2/`, { params: parm })
                console.log("循環樣板:" + data.request.responseURL);
                if(data.data=='養殖循環樣板資料不存在') {
                    this.$toast.error("error:" + data.data, { duration: 2000 });
                }else if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得疾病檢驗報告清單
        getDiseaseTestingRecordList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-record/`, { params: parm })
                console.log("疾病檢驗報告清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("疾病檢驗報告錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增疾病檢驗報告
        postDiseaseTestingRecordList:async function(addform) {
            try {
                let config = { headers: { "Content-Type": "multipart/form-data" } };
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-record/`,addform,config)
                console.log("新增疾病檢驗報告:" + data.request.responseURL);
                if(data.data.detail == "Success") {
                    this.$toast.success("新增結果：" + data.data.messages, {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("新增失敗：" + data.data.messages, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改疾病檢驗報告
        patchDiseaseTestingRecordList:async function(parm,id) {
            try {
                let config = { headers: { "Content-Type": "multipart/form-data" } };
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-record/${id}/`,parm,config)
                console.log("修改疾病檢驗報告:" + data.request.responseURL);
                if(data.data.detail == "Success") {
                    this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.error("修改失敗：" + data.data, { duration: 2000 });
                    console.error("修改失敗：",data);
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除疾病檢驗報告
        deleteDiseaseTestingRecordList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/disease-testing-record/${id}/`)
                console.log("刪除疾病檢驗報告:" + data.request.responseURL);
                if(data.data.detail == "Success") {
                    this.$toast.success("刪除成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("刪除失敗：" + data.data.messages, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 取得水質檢驗報告清單
        getWaterTestingRecordList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/water-quality-testing-record/`, { params: parm })
                console.log("水質檢驗報告清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("水質檢驗報告錯誤：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增水質檢驗報告
        postWaterTestingRecordList:async function(addform) {
            try {
                let config = { headers: { "Content-Type": "multipart/form-data" } };
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/water-quality-testing-record/`,addform,config)
                console.log("新增水質檢驗報告:" + data.request.responseURL);
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
        // 修改水質檢驗報告
        patchWaterTestingRecordList:async function(parm,id) {
            try {
                let config = { headers: { "Content-Type": "multipart/form-data" } };
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/water-quality-testing-record/${id}/`,parm,config)
                console.log("修改水質檢驗報告:" + data.request.responseURL);
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
        // 刪除水質檢驗報告
        deleteWaterTestingRecordList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/water-quality-testing-record/${id}/`)
                console.log("刪除水質檢驗報告:" + data.request.responseURL);
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
        // 新增工作
        postWorkList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step2/`,addform,)
                console.log("新增工作:" + data.request.responseURL);
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
        // 刪除工作
        deleteWorkList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step2/${id}/`)
                console.log("刪除工作:" + data.request.responseURL);
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
        //===== 循環的其他 =====//
        // 新增樣板項目
        // postRecordStepList:async function(addform) {
        //     try {
        //         let data = await this.$axios
        //         .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/`,addform,)
        //         console.log("新增樣板項目:" + data.request.responseURL);
        //         if(data.data == "新增成功") {
        //             // this.$toast.success("新增結果：" + data.data, {
        //             //     duration: 2000
        //             // });
        //             return true;
        //         }else {
        //             this.$toast.error("新增失敗：" + data.data, {
        //                 duration: 2000
        //             });
        //         }
    
        //     }catch(error) {
        //         this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
        //         console.log(error);
        //     }
        // },
        // 批次延遲
        postDelayStepList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/daily-check2-set-delay/`,addform,)
                console.log("批次延遲:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    this.$toast.success("指定成功", {
                        duration: 2000
                    });
                    return true;
                }else {
                    this.$toast.error("指定失敗：" + data.data, {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 修改樣板項目
        patchRecordStepList:async function(parm,id,isShow=false) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/${id}/`,parm,)
                console.log("修改樣板項目:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    if(isShow) {
                        this.$toast.success("修改成功", { duration: 2000 });
                    }
                    
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 刪除樣板項目
        deleteRecordStepList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-step/${id}/`)
                console.log("刪除樣板項目:" + data.request.responseURL);
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
        /* dailycheck */
        // 取得每日清單
        getDailyCheckList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/daily-check2/`,{ params: parm })
                console.log("每日清單:" + data.request.responseURL);
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
        // 新增每日清單
        postDailyCheckList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/daily-check2/`,addform,)
                console.log("新增每日:" + data.request.responseURL);
                if(data.data == "新增成功") {
                    // this.$toast.success("新增結果：" + data.data, {
                    //     duration: 2000
                    // });
                    return {action:true,msg:data.data};
                }else {
                    // this.$toast.error("新增失敗：" + data.data, {
                    //     duration: 2000
                    // });
                    return {action:false,msg:data.data};
                }
    
            }catch(error) {
                this.$toast.error("新增失敗ERR：" + error, { duration: 2000 });
                console.log(error);
                return {action:false,msg:error};
            }
        },
        // 修改每日清單(執行/不執行)
        patchDailyCheckList:async function(parm,id) {
            try {
                let data = await this.$axios
                .patch(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/daily-check2/${id}/`,parm,)
                console.log("修改每日清單:" + data.request.responseURL);
                if(data.data == "修改成功") {
                    // this.$toast.success("修改成功", { duration: 2000 });
                    return true;
                }else {
                    this.$toast.success("修改失敗：" + data.data, { duration: 2000 });
                }
    
            }catch(error) {
                this.$toast.error("修改失敗ERR：" + error, { duration: 2000 });
                console.log(error);
            }
        },
        // 新增動作清單
        postDailyCheckActionList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-action2/`,addform,)
                console.log("新增動作:" + data.request.responseURL);
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
        // 取得下一工作清單
        getNextWorkList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/record-action2/`,{ params: parm })
                console.log("每日清單:" + data.request.responseURL);
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
        //===== 養殖紀錄 =====//
        // 取得間補/收成紀錄
        getHarvestRecordList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/harvest-record2/`,{ params: parm })
                console.log("間補/收成清單:" + data.request.responseURL);
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
        // 新增間補/收成紀錄
        postHarvestRecordList:async function(addform) {
            try {
                let data = await this.$axios
                .post(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/harvest-record2/`,addform)
                console.log("新增間補/收成:" + data.request.responseURL);
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
        // 刪除間補/收成紀錄
        deleteHarvestRecordList:async function(id) {
            try {
                let data = await this.$axios.delete(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/harvest-record2/${id}/`)
                console.log("刪除間補/收成紀錄:" + data.request.responseURL);
                if(data.status==200) {
                    console.log(data);
                    if(data.data.messages[0]=='刪除成功') {
                        this.$toast.success("刪除結果：" + data.data.messages[0], {
                            duration: 2000
                        });
                        return true;
                    }else {
                        this.$toast.error("刪除失敗：" + data.data.messages[0], {
                            duration: 2000
                        });
                    }
                }else {
                    console.log(data);
                    this.$toast.error("刪除失敗：" + data.data.messages[0], {
                        duration: 2000
                    });
                }
    
            }catch(error) {
                if(error.response) {
                    console.error('API Error:', error.response);
                    this.$toast.error("刪除失敗ERR：" + error.response.data.messages[0], { duration: 2000 });
                }
                else {
                    this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                    console.log(error);
                }
                // this.$toast.error("刪除失敗ERR：" + error, { duration: 2000 });
                // console.log(error);
            }
        },
        // 取得水質紀錄
        getWaterRecordList:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/water-quality-record2/`,{ params: parm })
                console.log("水質紀錄清單:" + data.request.responseURL);
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
        // 取得投餌/料紀錄
        getFeedRecord2List:async function(parm) {
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/breeding/feed-record2/`,{ params: parm })
                console.log("投餌/料紀錄清單:" + data.request.responseURL);
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