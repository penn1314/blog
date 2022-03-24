<template>
  <div class="topnav-container">
    <a class="logo" href="javascript:;" @click="goto('/home')"></a>

    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="goto('/home')">首页</el-menu-item>
      <el-menu-item index="2" @click="goto('/about')">关于</el-menu-item>
      <el-menu-item index="3" @click="goto('/comment')">留言板</el-menu-item>
      <el-menu-item v-if="isLogin">
        <el-dropdown @command="goto">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          <i class="el-icon-arrow-down el-icon--right"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="exit">退出</el-dropdown-item>
            <el-dropdown-item command="/manege">进入后台</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
      <el-menu-item @click="goto('/login')" v-else>登录</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import bus from '@/js/eventbus.js'
export default {
  name: 'TopNav',
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      isLogin: false,
    }
  },
  created() {
    this.checkLogin()
    bus.on('loginChange', (data) => {
      this.checkLogin()
    })
    bus.on('toManege', (data) => {
      this.activeIndex2 = data.active
    })
  },
  methods: {
    goto(val) {
      // 返回首页，首页高亮
      if (val === '/home') {
        this.activeIndex2 = '1'
      }
      // 跳转后台，后台高亮
      if (val === '/manege') {
        this.activeIndex2 = ''
      }
      // 退出，清除token，设置isLogin为false
      if (val === 'exit') {
        localStorage.removeItem('token')
        this.isLogin = false
        return this.$router.push('/home')
      }
      this.$router.push(val)
    },
    async checkLogin() {
      const token = localStorage.getItem('token')
      // 判断token是否存在
      if (token) {
        // 如果存在，发送请求判断token是否过期
        const res = await this.$http.get('/check').catch((err) => {
          // 出现错误则，证明token过期，未登录
          this.isLogin = false
        })
        // token没有过期，则为登录状态
        if (res.data.status == 0) {
          this.isLogin = true
        } else {
          this.isLogin = false
        }
        // token不存在 为未登录状态
      } else {
        this.isLogin = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}
.topnav-container {
  position: relative;
  box-sizing: content-box;
  width: 100%;
  height: 60px;
  background-color: rgba(84, 92, 100);
}
/deep/ .el-menu-demo {
  float: right;
  vertical-align: middle;
}
.logo {
  position: absolute;
  top: 50%;
  left: 20px;
  width: 100px;
  height: 33px;
  background: url('../../../public/logo.png') no-repeat center;
  background-size: contain;
  transform: translate(0, -50%);
}
.user-img {
  float: right;
}
/deep/ .el-menu.el-menu--horizontal {
  border-bottom: 0;
}
</style>
