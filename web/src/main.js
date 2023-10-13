import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import axios from 'axios';
import {
  Button,
  Row,
  Col,
  Table,
  TableColumn,
  Input,
  Pagination,
  Dialog,
  Form,
  FormItem,
  Select,
  Option,
  TimePicker,
  DatePicker,
  Loading,
  Message
} from 'element-ui';
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(TimePicker)
Vue.use(DatePicker)
Vue.use(Loading)
Vue.use(Message)

Vue.prototype.$message=Message


Vue.config.productionTip = false

// axios.defaults.baseURL = "http://8.134.109.183:8888"
axios.defaults.baseURL = "/api"
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App),
  beforeCreate () {
    Vue.prototype.$bus = this
  },
}).$mount('#app')