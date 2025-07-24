import Vue from "vue";
import https from "https";
import { color } from "echarts/lib/export";
import { reduce } from "lodash";
Vue.mixin({
	methods: {
        // 取得水源/蝦況選項項目
        getFieldOtptionList:async function() {
            let para = {
                "WaterSource": [
                    {
                        "name_en": "Groundwater",
                        "name_ch": "地下水"
                    },
                    {
                        "name_en": "Seawater",
                        "name_ch": "海水"
                    }
                ],
                "WaterColor": [
                    {
                        "name_en": "DarkGreen",
                        "name_ch": "深綠"
                    },
                    {
                        "name_en": "LightGreen",
                        "name_ch": "淺綠"
                    },
                    {
                        "name_en": "DarkBrown",
                        "name_ch": "棕色偏深"
                    },
                    {
                        "name_en": "LightBrown",
                        "name_ch": "棕色偏淺"
                    },
                    {
                        "name_en": "Clear",
                        "name_ch": "清澈"
                    }
                ],
                "IntestinalColor": [
                    {
                        "name_en": "Brown",
                        "name_ch": "棕色"
                    },
                    {
                        "name_en": "Black",
                        "name_ch": "黑色"
                    },
                    {
                        "name_en": "Red",
                        "name_ch": "紅色"
                    },
                    {
                        "name_en": "White",
                        "name_ch": "白色"
                    },
                    {
                        "name_en": "Empty",
                        "name_ch": "空腸"
                    },
                    {
                        "name_en": "Uncertain",
                        "name_ch": "未定義"
                    }
                ],
                "HepatopancreasColor": [
                    {
                        "name_en": "Black",
                        "name_ch": "黑色"
                    },
                    {
                        "name_en": "Brown",
                        "name_ch": "棕色"
                    },
                    {
                        "name_en": "Red",
                        "name_ch": "紅色"
                    },
                    {
                        "name_en": "Orange",
                        "name_ch": "橘色"
                    },
                    {
                        "name_en": "White",
                        "name_ch": "白色"
                    },
                    {
                        "name_en": "Gray",
                        "name_ch": "灰色"
                    },
                    {
                        "name_en": "Yellow",
                        "name_ch": "黃色"
                    },
                    {
                        "name_en": "Green",
                        "name_ch": "綠色"
                    },
                    {
                        "name_en": "Uncertain",
                        "name_ch": "未定義"
                    }
                ],
                "MuscleColor": [
                    {
                        "name_en": "Translucent",
                        "name_ch": "透亮"
                    },
                    {
                        "name_en": "Turbidity",
                        "name_ch": "均勻白濁"
                    },
                    {
                        "name_en": "TurbidityCottonLike",
                        "name_ch": "白濁呈棉絮狀分布"
                    },
                    {
                        "name_en": "Uncertain",
                        "name_ch": "未定義"
                    }
                ],
                "BodyColor": [
                    {
                        "name_en": "Transparent",
                        "name_ch": "透明"
                    },
                    {
                        "name_en": "Red",
                        "name_ch": "紅色"
                    },
                    {
                        "name_en": "Uncertain",
                        "name_ch": "未定義"
                    }
                ],
                "BodyShape": [
                    {
                        "name_en": "Normal",
                        "name_ch": "正常"
                    },
                    {
                        "name_en": "Deformity",
                        "name_ch": "畸形"
                    }
                ],
                "FeedingPlan": []
            }
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiKbUrl}/field-option/`)
                console.log("取得水源/蝦況選項項目清單:" + data.request.responseURL);
                if(data.status==200) {
                    return data.data;
                }else {
                    this.$toast.error("錯誤：" + error, { duration: 2000 });
                    return para;
                }
            }catch(error) {
                this.$toast.error(`資料Fail:${error}`, { duration: 2000 });
                console.log(`${this.$store.state.mydata.gobal_api.apiKbUrl}/field-option/ 錯誤，使用預設資料`, error);

                return para;
            }
        },
        // 取得水質監測的警告範圍
        getWarningRangeList:async function(field_id) {
            try {
                var parm = { factory_id: field_id };
                if(field_id == undefined || field_id == null) {
                    return [];
                }
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/warning-range/`,{params: parm})
                // console.log("水質監測的警告範圍參數:" , parm);
                // console.log("水質監測的警告範圍URL:" , data.request.responseURL);
                // console.log("水質監測的警告範圍DATA:" , data.data);
                if(data.status==200) {
                    return data.data;
                }else {
                    return [];
                }

            }catch(error) {
                this.$toast.error("錯誤：" + error, { duration: 2000 });
                //console.log(error);
                console.error(`${data.request.responseURL} 錯誤，使用預設資料`, error);
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