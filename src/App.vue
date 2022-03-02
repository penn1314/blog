<template>
  <div class="app-container">
    <TopNav></TopNav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'MyApp',
  components: {},
}
</script>

<style scoped>
.app-container {
  height: 100%;
}
</style>
