<template>
  <div class="manege-container">
    <el-row class="tac">
      <el-col class="col" :span="4">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1" @click="goto('/manege/index')">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>博客管理</span>
            </template>
            <el-menu-item index="2-1" @click="goto('/manege/sort')">文章分类</el-menu-item>
            <el-menu-item index="2-2" @click="goto('/manege/update')">文章修改</el-menu-item>
            <el-menu-item index="2-3" @click="goto('/manege/edit')">文章发布</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col class="main" :span="19">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import bus from '@/js/eventbus.js'

export default {
  name: 'MyMenege',
  mounted() {
    bus.emit('toManege', '')
  },
  methods: {
    goto(val) {
      this.$router.push(val)
    }
  }
}
</script>

<style lang="less" scoped>
.el-col,
.manege-container,
.el-row {
  height: 100% !important;
}
.el-col {
  background-color: #545c64;
}
.main {
  background-color: #fff;
  padding: 20px 0 0 20px;
}
</style>
