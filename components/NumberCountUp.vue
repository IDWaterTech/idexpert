<template>
    <div class="iCountUp">
    <ICountUp
      :delay="delay"
      :endVal="endVal"
      :options="options"
      :id="id"
      @ready="myReady"
    />
  </div>
</template>

<script>
import ICountUp from 'vue-countup-v2';
export default {
    components: {
        ICountUp
    },
    props: {
        value: {
            type: Number,
            default: 0
        },
        prefix:{
            type:String,
            default:''
        },
        suffix:{
            type:String,
            default:''
        },
        myReady: {
            type: Function,
            default: function (instance, CountUp) {
                const that = this;
                instance.update(that.endVal + 100);
                // instance.update(this.endVal + 100);
            }
        },
        id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            delay: -1, //幾秒之後開始跳數字(1000=1sec);設置為-1就不會延遲跳數字
            endVal: this.value,
            options: {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                decimalPlaces: 0,//保留小數點位數
                duration:3,//動畫耗時
                prefix: this.prefix,
                suffix: this.suffix,
                enableScrollSpy:true,//畫面顯示重新跳數字
            }
        }
    },
    methods: {
        onReady: function (instance, CountUp) {
            const that = this;
            instance.update(that.endVal + 100);
            // instance.update(that.endVal);
        }
    },
}
</script>

<style lang="scss" scoped>
.iCountUp {
    font-size: 1.2em;
    margin: 0;
    color: #4d63bc;
}
</style>

<!-- ********************************* -->
<!-- 使用方式 -->
<!--
頁面引用 
    <number-count-up :value="total.predict" suffix="隻" :myReady="onReady"></number-count-up>

外部引用一定要加入function
methods: {
     onReady: function (instance,CountUp) {
            const that = this;
            that.endVal = this.total.predict;  //此處需要帶入value的值
            instance.update(that.endVal + 100);
            // instance.update(that.endVal);
        },
    }


 -->