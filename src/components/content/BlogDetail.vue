<template>
  <div class="detail-container">
    <!--返回按钮-->
    <div><el-button class="btn-back" type="info" round size="small" @click="gotoBack">返回</el-button></div>
    <div class="article_title">{{ article.title }}</div>
    <!--文章信息-->
    <div class="article_info">
      <span class="article_author">作者：{{ article.author }}&nbsp; </span>
      <span class="article_info_date">发表于：{{ article.publishdate }}&nbsp;</span>
      <span class="article_info_label"
        >标签: &nbsp;
        <el-tag type="success" size="mini" v-for="(item, index) in article.tag" :key="index">{{ item }}</el-tag>
      </span>
    </div>
    <div class="article_detail_content" v-html="compiledMarkdown()"></div>
  </div>
</template>

<script>
// markdonw转html
import _ from 'lodash'
import { marked } from 'marked'
import hightlight from 'highlight.js'
import '../../assets/atom-one-light.css'
marked.setOptions({
  highlight: function (code) {
    return hightlight.highlightAuto(code).value
  },
})

export default {
  name: 'BlogDetail',
  data() {
    return {
      article: {},
    }
  },
  props: ['id'],
  created() {
    this.getBlog()
  },
  methods: {
    // markdown转html
    compiledMarkdown: function () {
      return marked.parse(this.article.content)
    },
    // 返回上一次的记录
    gotoBack() {
      this.$router.back()
    },
    // 获取博客
    async getBlog() {
      const { data: res } = await this.$http.get('blog/getblog', {
        params: {
          id: this.id,
        },
      })
      if (res.status !== 0) return
      else {
        this.article = res.data[0]
        let tag = []
        this.article.tag = this.article.tag.split(',')
      }
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .el-page-header {
  margin-left: 10px;
}

.article_title {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}
.article_info {
  margin-top: 10px;
  font-size: 10px !important;
  text-align: center;
  vertical-align: middle;
}
.article_detail_content {
  margin-top: 50px;
  padding: 0 20px;
}
.detail-container {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 70%;
  height: 600px;
  margin: 10px auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 2px #ccc;
}
.btn-back {
  margin: 5px 0 0 5px;
}
.el-tag {
  margin-left: 5px;
}
</style>
