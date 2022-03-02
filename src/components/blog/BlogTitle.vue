<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <router-link :to="'/article' + data.id">{{ data.title }}</router-link>
    </div>
    <div class="text item">{{ data.abstract }}</div>
    <div class="time"><i class="el-icon-user"></i>&nbsp;作者:&nbsp;{{ data.author }}&nbsp;<i class="el-icon-time"></i>&nbsp;发布时间:&nbsp;{{ data.publishdate }}&nbsp;</div>
  </el-card>
</template>

<script>
export default {
  name: 'BlogTitle',
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
  },
}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
  color: #000;
}
.text {
  font-size: 18px;
}

.item {
  margin-bottom: 10px;
}
.time {
  font-size: 12px;
}
.clearfix {
  font-size: 22px;
  font-weight: 700;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 90%;
  margin-left: 10px;
  text-align: left;
}
</style>
