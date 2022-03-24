<template>
  <div class="blog-container" v-loading.fullscreen.lock="fullscreenLoading">
    <Banner></Banner>
    <div class="blog-main" ref="box">
      <!-- 博客内容导航栏 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="原创" name="first">
          <Title
            class="title"
            v-for="item in currentPage"
            :key="item.id"
            :data="item"
            v-loading="loading"
          ></Title>
          <!-- 分页 -->
          <div class="block">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :page-size="10"
              layout="total, prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
          <!-- 返回顶部 -->
          <el-backtop></el-backtop>
        </el-tab-pane>
        <el-tab-pane label="转载" name="second">
          <el-empty description="还没添加内容"></el-empty>
        </el-tab-pane>
        <el-tab-pane label="日记" name="third">
          <el-empty description="还没添加内容"></el-empty>
        </el-tab-pane>
      </el-tabs>
      <Search class="search" @getSearchResult="getSearchResult"></Search>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/blog/BlogBanner.vue'
import Title from '@/components/blog/BlogTitle.vue'
import Detail from '@/components/content/BlogDetail.vue'
import Search from '@/components/search/Search.vue'

export default {
  name: 'Myblog',
  components: {
    Banner,
    Title,
    Detail,
    Search
  },
  data() {
    return {
      activeName: 'first',
      // 文章列表
      blogList: [],
      // 当前文章列表
      currentPage: [],
      // 文章总条数
      total: 0,
      // 是否为搜索结果
      search: 0,
      fullscreenLoading: false
    }
  },
  async created() {
    // 获取第一页10条数据
    this.getBlogList(0)
    // 获取博客总条数
    this.getTotal()
  },
  methods: {
    async handleCurrentChange(val) {
      // 跳转到头部
      window.scrollTo({
        left: 0,
        top: this.$refs.box.offsetTop - 10,
        behavior: 'smooth'
      })
      if (this.search === 1) {
        this.currentPage = this.blogList.slice((val - 1) * 10, val * 10)
        this.total = this.blogList.length
        return
      }
      // 1 ---> 显示1-10条
      // 如果文章列表的长度少于当前页数*10 那么就请求数据 （当前页 - 1） * 10 到 当前页 * 10 条数据
      if (this.blogList.length < val * 10) {
        this.fullscreenLoading = true
        const { data: res } = await this.$http.get('/blog/getblogs', {
          params: { start: (val - 1) * 10 }
        })
        if (res.status === 0) {
          this.fullscreenLoading = false

          // 将数据传入当前页数据
          this.currentPage = res.data
          // 判断当前页是否跳页， 跳页则不加入总文章列表，不跳页则加入文章列表
          // 不跳页
          if (this.blogList.length + 10 <= val * 10 && this.blogList.length + 10 > (val - 1) * 10) {
            // 添加文章
            for (var item of res.data) {
              this.blogList.push(item)
            }
          }
        } else {
        }
      } else {
        // 如果文章列表的长度da于当前页数*10 ,证明总文章列表已经存在该页面的数据，不用发送请求，直接截取
        this.currentPage = this.blogList.slice((val - 1) * 10, val * 10)
      }
    },
    async getBlogList(start) {
      this.fullscreenLoading = true
      const { data: res } = await this.$http.get('/blog/getblogs', { params: { start } })
      if (res.status !== 0) return console.log('获取数据失败')
      else {
        this.fullscreenLoading = false
        this.blogList = res.data
        this.currentPage = res.data
      }
    },
    async getTotal() {
      // 全都不为空可以发送请
      const { data: res } = await this.$http.get('/getnumber', { params: { table: 't_blog' } })
      if (res.status === 0) {
        this.total = res.count
      }
    },
    // 接受search的数据
    getSearchResult(data) {
      this.blogList = JSON.parse(JSON.stringify(data))
      this.total = JSON.parse(JSON.stringify(data)).length
      this.currentPage = this.blogList.slice(0, 10)
      this.search = 1
    }
  }
}
</script>

<style lang="less" scoped>
.blog-container {
  margin: 0;
  padding: 0;
}
.blog-main {
  position: relative;
  overflow: hidden;
  width: 70%;
  margin: 10px auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 2px #ccc;
}
.el-tabs {
  position: relative;
  margin-top: 10px;
  text-align: center;
}
/deep/.el-tabs__nav {
  height: 60px;
  margin-left: 50px;
  line-height: 60px;
}

/deep/ .el-tabs__nav-scroll {
  height: 60px;
}
/deep/ .el-tabs__nav-wrap {
  height: 60px;
}
/deep/ .el-tabs__item {
  font-size: 18px;
}
.title {
  margin-bottom: 10px;
}
.block {
  margin: 20px;
}
.search {
  position: absolute;
  top: 22px;
  right: 0;
  z-index: 10;
}
</style>
