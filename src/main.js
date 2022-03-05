import Vue from 'vue'
import App from './App.vue'
// 导入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入路由模块
import router from '@/router/index.js'
//
import axios from 'axios'
import TopNav from '@/components/blog/BlogTopNav.vue'

import MarkdownItToc from 'vue-markdown-it-toc'
Vue.use(MarkdownItToc)

// 添加默认服务器地址
axios.defaults.baseURL = 'http://127.0.0.1:3001'
// 设置拦截器，添加token

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (config.url.indexOf('/blog/') === -1) {
    // 为当前的请求配置 Token认证字段
    config.headers.Authorization = 'Bearer ' + token
    // 固定写法，必须返回
  }
  return config
})

Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('TopNav', TopNav)
new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app')
