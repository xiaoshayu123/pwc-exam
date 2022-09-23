import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
Vue.config.productionTip = false

// 使用element-ui
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/fontawesome.less'
Vue.use(Element)

axios.defaults.withCredentials=true;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
