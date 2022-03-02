<template>
  <div class="edit-container">
    <el-card class="box-card">
      <!-- 第一行头部 -->
      <div slot="header" class="clearfix">
        <span>文章发布</span>
      </div>
      <el-form ref="form" label-width="100px">
        <!-- 文章标题 -->
        <el-form-item label="文章标题">
          <el-input v-model="blogDate.title"></el-input>
        </el-form-item>
        <!-- 文章分类 -->
        <el-form-item label="文章分类">
          <el-select v-model="blogDate.sort" placeholder="请选择文章分类">
            <el-option v-for="item in sortList" :label="item.name" :value="item.name" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 文章标签 -->
        <el-form-item label="文章标签">
          <el-input v-model="blogDate.tag"></el-input>
        </el-form-item>
        <!-- 文章发布时间、作者 -->
        <el-form-item label="发布信息">
          <el-col :span="4">
            <el-date-picker type="date" placeholder="选择日期" v-model="blogDate.publishdate" style="width: 100%"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">---</el-col>
          <el-col :span="5">
            <el-input placeholder="作者" style="width: 100%" v-model="blogDate.author"></el-input>
          </el-col>
        </el-form-item>
        <!-- 文章简述 -->
        <el-form-item label="文章简述">
          <el-input type="textarea" style="width: 40%" autosize v-model="blogDate.abstract"></el-input>
        </el-form-item>
        <!-- 文章内容 -->
        <!-- 编辑器 -->
        <mavon-editor v-model="blogDate.content" ref="md" @change="change" style="min-height: 600px" />
        <el-form-item>
          <el-button class="submit" type="primary" @click="submit">立即发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// markdonw转html
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import dayjs from 'dayjs'

export default {
  components: {
    mavonEditor,
  },
  data() {
    return {
      html: '', // 及时转的html
      // 分类列表
      sortList: [],
      // 文章信息
      blogDate: {
        id: 0,
        title: '',
        author: '',
        publishdate: '',
        tag: '',
        sort: '',
        abstract: '',
        content: '',
      },
    }
  },
  created() {
    this.getSort()
    this.getCount()
  },
  methods: {
    // markdown展示hmtl
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render
    },
    // 获取分类列表
    async getSort() {
      const { data: res } = await this.$http.get('/getsort')
      if (res.status === 0) {
        this.sortList = res.data
      } else {
        this.$message.error('获取列表失败')
      }
    },
    // 获取新文章的id
    async getCount() {
      const { data: res } = await this.$http.get('/getcount', { params: { table: 't_blog' } })
      if (res.status === 0) {
        // 得到最大值id + 1 作为新分类的id
        this.blogDate.id = res.count + 1
      } else {
        this.$message.error('获取id失败')
      }
    },
    async submit() {
      // 全部内容是否不为空
      var tag = true
      for (let item in this.blogDate) {
        if (this.blogDate[item] === '') {
          tag = false
          break
        }
      }
      // 全都不为空可以发送请求
      if (tag) {
        // 格式化时间
        this.blogDate.publishdate = dayjs(this.blogDate.publishdate).format('YYYY-MM-DD')
        const { data: res } = await this.$http.post('/addblog', this.blogDate)
        if (res.status === 0) {
          this.$message.success('添加成功')
          this.blogDate.id++
        } else this.$message.error('添加失败')
      } else this.$message.error('内容不能为空')
    },
  },
}
</script>

<style lang="less" scoped>
.edit-container {
  position: relative;
}
.el-input {
  width: 40%;
}
.line {
  text-align: center;
}
.markshow {
  position: absolute;
  width: 50% !important;
  top: 11%;
  left: 50%;
  z-index: 111;
  background-color: rgba(59, 226, 198, 0.05);
}
.submit {
  margin-top: 30px;
}
</style>
