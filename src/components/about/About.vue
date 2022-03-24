<template>
  <div class="about-container">
    <h1>关于我</h1>
    <p>小白一枚</p>
    <p>2021年12月中旬刚开始学习前端</p>
    <p>在深圳读书5年，从专科到本科</p>
    <p>由于上学的时候，有开过前端的课程，对前端比较感兴趣</p>
    <p>决定学习前端</p>
    <p>这是我的第一个项目，涉及前端，后端，数据库，操作系统等知识，是一个比较好的实践项目</p>
    <p>功能还没完善，后期会慢慢补回来</p>
    <p>感谢大家的浏览</p>
    <p>❤❤❤❤❤❤❤</p>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style lang="less" scoped>
h1 {
  font-size: 35px !important;
  margin: 50px 0 20px 0;
}
p {
  margin-bottom: 5px;
  font-size: 18px;
}
.about-container {
  overflow: hidden;
  width: 70%;
  height: 600px;
  margin: 10px auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 2px #ccc;
  text-align: center;
}
</style>
