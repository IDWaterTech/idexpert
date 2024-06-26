<template>
    <div>
        <ve-ring :data="chartData" :settings="chartSetting" :extend="chartExtend2" width="180px" height="180px"></ve-ring>
    </div>
</template>

<script>
    export default {
        props: {
            chartData: {
                type: Object,
                default: function() {
                    return {
                        columns:['name','value'],
                        rows:[
                            {'name':'column1','value':78},
                            {'name':'column2','value':22}
                        ]
                    }
                }
            },
            colors: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                chartSetting:{
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    radius: [
                        '50', '70'
                    ],
                    offsetY: 90
                },
            }
        },
        computed: {
            chartExtend2(){
                let myChartExtend={
                    legend: {show: false},
                    color: this.colors
                    };
                myChartExtend['tooltip'] = {
                    trigger: 'item',
                    formatter: function (params) {
                        // console.log('params.name',params.name);
                        // console.log('this.chartData?',this.chartData);
                        // return `${params.value}%`
                        if(params.name!=='') {
                            return `${params.name}:${params.data.value}%`;
                        }
                        
                    }
                };
                myChartExtend['series'] = {
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,    //默认显示关闭,如果此处是true,则数据重叠
                                position: 'center',    //显示的位置,center是饼环图中间显示,
                                formatter: (params)=>{
                                    if(params.name==this.chartData?.rows[0]?.name) {
                                        return `{title|${params.data.value}%}`;
                                    }
                                },
                                rich: {
                                    title: {
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                    }, 
                                }
                            }
                        }
                };
                return myChartExtend;

            }
        },
        created() {
            if(!this.chartData.rows[0].value) {
                this.chartData.rows[0].value = 0;
                this.chartData.rows[1].value = 100;
            }
        },
        methods:{

        },
        watch:{
            chartData() {
                // console.log('chartdata change',this.chartData);
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>