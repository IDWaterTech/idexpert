import Vue from "vue";

Vue.mixin({
	methods: {
	    getArchitecture: async function(_factoryid) {
            // _factoryid 預設只帶該場資料，其他不需要
            try {
                let data =  await this.$axios.get(`${this.$store.state.mydata.gobal_api.apiUrl}/architecture/`);
                
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
            }catch(err) {
                console.log(err);
            }
            
        },
	}
})
