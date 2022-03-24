<template>
  <div class="login-container" v-loading="loading">
    <a class="logo" href="javascript:;" @click="goHome"></a>
    <!-- 登录注册区域 -->
    <div class="loginAndRegBox">
      <div class="title-box"></div>
      <el-form :model="info" :rules="rules" ref="form">
        <el-form-item label="用户名:" label-width="80px" prop="username">
          <el-input placeholder="请输入用户名" v-model.trim="info.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" label-width="80px" prop="password">
          <el-input placeholder="请输入密码" v-model.trim="info.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" label-width="80px" v-if="isreg">
          <el-input placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="center" type="primary" v-if="isreg">注册</el-button>
          <el-button class="center" type="primary" v-else @click="goto">登录</el-button>
        </el-form-item>
      </el-form>
      <el-link
        class="login"
        target="_blank"
        :underline="false"
        v-if="isreg"
        @click.prevent="goLogin"
        >去登录</el-link
      >
      <el-link class="login" target="_blank" :underline="false" v-else @click.prevent="goRegister"
        >去注册</el-link
      >
    </div>
  </div>
</template>

<script>
import bus from '@/js/eventbus.js'
export default {
  name: 'Login',
  data() {
    return {
      // 是否为注册
      isreg: false,
      info: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    goLogin() {
      this.isreg = !this.isreg
    },
    goRegister() {
      this.isreg = !this.isreg
    },
    goHome() {
      this.$router.push('/home')
    },
    async goto() {
      // 表单验证，查看格式是否正确
      this.$refs['form'].validate(async (value) => {
        if (value) {
          // 表单验证通过，则发起登录请求
          const { data: res } = await this.$http.post('/tologin', {
            username: this.info.username,
            password: this.info.password
          })
          // 验证登录成功，保存token，并跳转到登录页
          if (res.status === 0) {
            localStorage.setItem('token', res.token)
            bus.emit('loginChange', { isLogin: true, active: '' })
            this.$router.push('/home')
          } else {
            // 验证失败，提示用户或者密码错误
            this.$message({ showClose: true, message: '用户名或密码错误，请重试', type: 'error' })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: absolute;
  top: 0;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: url('../../assets/images/login_bg.jpg') no-repeat center;
  background-size: cover;
}
.loginAndRegBox {
  width: 450px;
  height: 350px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.title-box {
  height: 60px;
  background: url('../../assets/images/login_title.png') no-repeat center;
}
.el-form {
  position: absolute;
  width: 75%;
  top: 25%;
  left: 50%;
  transform: translate(-50%);
}
.el-input {
  width: 250px;
}
.center {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}
.login {
  position: absolute;
  bottom: 50px;
  right: 50px;
}
.logo {
  position: absolute;
  top: 13px;
  left: 20px;
  width: 100px;
  height: 33px;
  background: url('../../../public/logo.png') no-repeat center;
  background-size: contain;
}
</style>
