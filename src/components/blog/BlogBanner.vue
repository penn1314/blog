<template>
  <div class="banner-container">
    <div class="banner-content">
      <h1>Welcome to penn's blog</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogBanner',
}
</script>

<style scoped>
.banner-container {
  background: url('../../assets/images/banner.gif') no-repeat center;
  background-size: contain;
  position: relative;
  width: 100%;
  height: 300px;
  background-color: #545c64;
}
.banner-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
}
</style>
