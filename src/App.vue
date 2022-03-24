<template>
  <div class="app-container">
    <TopNav></TopNav>
    <router-view></router-view>
    <div class="ICP">
      <a class="IPC" href="http://beian.miit.gov.cn/" target="_blank">粤ICP备2022021050号</a>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/blog/BlogBanner.vue'
export default {
  name: 'MyApp',
  components: { Banner },
}
</script>

<style scoped>
.app-container {
  height: 100%;
}
a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}
.ICP {
  width: 100%;
  text-align: center;
}
</style>
