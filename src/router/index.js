import Vue from 'vue'
import vueRouter from 'vue-router'

import Blog from '@/components/blog/Blog.vue'
import Login from '@/components/login/Login.vue'
import About from '@/components/about/About.vue'
import Comment from '@/components/comment/Comment.vue'
import Detail from '@/components/content/BlogDetail.vue'
import Manege from '@/components/manege/Manege.vue'
import ManegeIndex from '@/components/manege/ManegeIndex.vue'
import ArticleEdit from '@/components/manege/ArticleEdit.vue'
import AritcleUpdate from '@/components/manege/AriticleUpdate.vue'
import Sort from '@/components/manege/Sort.vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://pennspace.top:3001'

// 将vueRouter作为Vue的插件
Vue.use(vueRouter)
// 创建实例并共享出去
const router = new vueRouter({
  routes: [
    //hash地址与组件的对应关系
    { path: '/', component: Blog },
    { path: '/home', component: Blog },
    { path: '/login', component: Login },
    { path: '/about', component: About },
    { path: '/comment', component: Comment },
    { path: '/article:id', component: Detail, props: true },
    {
      path: '/manege',
      component: Manege,
      redirect: '/manege/index',
      children: [
        { path: 'index', component: ManegeIndex },
        { path: 'sort', component: Sort },
        { path: 'edit', component: ArticleEdit },
        { path: 'update', component: AritcleUpdate }
      ]
    }
  ]
})

//设置全局前置守卫
router.beforeEach(async (to, from, next) => {
  let reg = /\/manege/
  // 判断是否登录后台
  if (reg.test(to.path)) {
    // 获取token
    const token = localStorage.getItem('token')

    // 判断token是否存在
    if (token) {
      // 如果存在，发送请求判断token是否过期
      const { data: res } = await axios
        .get('/check', {
          headers: { Authorization: 'Bearer ' + token }
        })
        .catch((err) => {
          // 出现错误则，证明token过期，返回登录页面

          next(false)
        })
      // token没有过期，则进入后台管理
      if (res.status === 0) {
        next()
      } else {
      }
      // token不存在则转至登录页
    } else {
      next('/login')
    } // 其他页面放行
  } else next()
})

export default router
