import Vue from "vue";
import { message, Table, Tag,Divider,Icon,Tooltip} from "ant-design-vue";
import { DatePicker } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import moment from 'moment'
import 'moment/locale/zh-cn'
const components = [Table, Tag,Divider,Icon,DatePicker,Tooltip];

Vue.prototype.$message = message;
moment.locale('zh-cn')
Vue.prototype.$moment = moment
const Element = {
  install(Vue) {
    components.forEach(component => {
      Vue.component(component.name, component);
    });
  }
};

/* v1.1.3+ 自动注册Button下组件，如Button.Group */
Vue.use(Element);

//   Vue.use(Element, { locale });

/* eslint-disable no-new */
// new Vue({
//     el: '#app',
//     components: { App },
//     template: '<App/>',
//   }
