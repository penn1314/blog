<template>
  <div class="detail-container" v-loading.fullscreen.lock="fullscreenLoading">
    <el-col :span="6"><div class="none"></div></el-col>
    <el-col :span="17">
      <!--返回按钮-->
      <el-button class="btn-back" type="info" round size="small" @click="gotoBack">返回</el-button>
      <div class="article_title">{{ article.title }}</div>
      <!--文章信息-->
      <div class="article_info">
        <span class="article_author">作者：{{ article.author }}&nbsp; </span>
        <span class="article_info_date">发表于：{{ article.publishdate }}&nbsp;</span>
        <span class="article_info_label"
          >标签: &nbsp;
          <el-tag type="success" size="mini" v-for="(item, index) in article.tag" :key="index">{{
            item
          }}</el-tag>
        </span>
      </div>
      <template>
        <mavon-editor
          class="md"
          ref="edit"
          id="markDown"
          :value="article.content"
          :subfield="false"
          :defaultOpen="'preview'"
          :toolbarsFlag="false"
          :editable="true"
          :scrollStyle="true"
          :ishljs="true"
          :navigation="true"
        >
        </mavon-editor>
      </template>
    </el-col>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
// markdonw转html
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'BlogDetail',
  components: {
    mavonEditor
  },
  data() {
    return {
      article: {},
      aData: [],
      fullscreenLoading: false
    }
  },
  props: ['id'],
  created() {
    this.getBlog()
  },
  updated() {
    this.addUrl()
  },
  methods: {
    // markdown转html
    // 返回上一次的记录
    gotoBack() {
      this.$router.back()
    },
    // 获取博客
    async getBlog() {
      this.fullscreenLoading = true
      const { data: res } = await this.$http.get('blog/getblog', {
        params: {
          id: this.id
        }
      })
      if (res.status !== 0) return
      else {
        this.fullscreenLoading = false
        this.article = res.data[0]
        let tag = []
        this.article.tag = this.article.tag.split(',')
      }
    },
    // 给目录添加锚点
    addUrl() {
      this.$nextTick(function () {
        let aData = document.querySelectorAll('.v-note-navigation-content  a')
        aData.forEach((item) => {
          item.parentNode.addEventListener('click', () => {
            document.getElementById(item.id).scrollIntoView({
              behavior: 'smooth' // 平滑过渡
            })
          })
        })
      })
    }
  }
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
  position: relative;
  margin: 0;
  padding: 0;
  overflow: hidden;
  margin: 10px auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 2px #ccc;
}

.btn-back {
  position: absolute;
  top: 0;
  left: 0;
  margin: 5px 0 0 5px;
}
.el-tag {
  margin-left: 5px;
}
.md {
  margin-top: 10px;
}
.markdown-it-wrap {
  width: 1140px;
  margin: 0 auto;
  padding-right: 165px;
  box-sizing: border-box;
}
.none {
  visibility: hidden;
  width: 100px;
  height: 100px;
}
/deep/ .v-note-navigation-wrapper {
  position: absolute !important;
  top: 0 !important;
  left: -250px !important;
  z-index: 99999 !important;
}

/deep/ .v-note-panel {
  overflow: unset !important;
}
.el-backtop {
  z-index: 99999;
}
</style>
