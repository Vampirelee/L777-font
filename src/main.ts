import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'normalize.css'
import '@css/common.css'
import '@assets/iconfont/iconfont.css'

Vue.config.productionTip = false; // 开发提示

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
