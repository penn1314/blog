<template>
  <div class="sort-container">
    <!-- 列表框架 -->
    <el-card class="box-card">
      <!-- 第一行头部 -->
      <div slot="header" class="clearfix">
        <span>文章管理</span>
      </div>
      <!-- 列表标题、数据 -->
      <el-table :data="currentPage" stripe style="width: 100%">
        <el-table-column label="文章标题" width="180">
          <!-- 使用提供的插槽接受数据，数据命名为scope -->
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章类型" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.tag }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章作者" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.publishdate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 操作按钮 -->
            <el-button type="success" size="small" @click="goUpdate(scope.row)">编辑</el-button>
            <el-button type="info" size="small" @click="goDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next" :total="total"> </el-pagination>
      </div>
    </el-card>
    <!-- 对话框，title值为添加分类时，显示添加的对话框，更新则出现更新的对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="100%">
      <el-card class="box-card">
        <el-form ref="form" label-width="100px">
          <!-- 文章标题 -->
          <el-form-item label="文章标题">
            <el-input v-model="updateBlog.title"></el-input>
          </el-form-item>
          <!-- 文章分类 -->
          <el-form-item label="文章分类">
            <el-select v-model="updateBlog.sort" placeholder="请选择文章分类">
              <el-option v-for="item in sortList" :label="updateBlog.name" :value="item.name" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- 文章标签 -->
          <el-form-item label="文章标签">
            <el-input v-model="updateBlog.tag"></el-input>
          </el-form-item>
          <!-- 文章发布时间、作者 -->
          <el-form-item label="发布信息">
            <el-col :span="4">
              <el-date-picker type="date" placeholder="选择日期" v-model="updateBlog.publishdate" style="width: 100%"></el-date-picker>
            </el-col>
            <el-col class="line" :span="1">---</el-col>
            <el-col :span="5">
              <el-input placeholder="作者" style="width: 100%" v-model="updateBlog.author"></el-input>
            </el-col>
          </el-form-item>
          <!-- 文章简述 -->
          <el-form-item label="文章简述">
            <el-input type="textarea" style="width: 40%" autosize v-model="updateBlog.abstract"></el-input>
          </el-form-item>
          <!-- 文章内容 -->
          <!-- 编辑器 -->
          <mavon-editor v-model="updateBlog.content" ref="md" @change="change" style="min-height: 600px" />
          <el-form-item>
            <el-button class="submit" type="primary" @click="submit">确认修改</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import dayjs from 'dayjs'
export default {
  name: 'Sort',
  components: {
    mavonEditor,
  },

  created() {
    this.getSort()
    this.getBlogList(0)
    this.getTotal()
  },
  data() {
    return {
      title: '文章修改',
      // 文章列表
      blogList: [],
      // 修改的文章
      updateBlog: {},
      // 分类列表
      sortList: [],
      // 修改框显示
      dialogVisible: false,
      // 当前文章列表
      currentPage: [],
      // 文章总条数
      total: 0,
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    async handleCurrentChange(val) {
      // 1 ---> 显示1-10条
      // 如果文章列表的长度少于当前页数*10 那么就请求数据 （当前页 - 1） * 10 到 当前页 * 10 条数据
      if (this.blogList.length < val * 10) {
        console.log(1)
        const { data: res } = await this.$http.get('/blog/getblogs', { params: { start: (val - 1) * 10 - 1 } })
        if (res.status === 0) {
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
        this.currentPage = this.blogList.slice((val - 1) * 10, val * 10 - 1)
      }
    },
    // 显示出修改框
    goUpdate(infoObj) {
      this.dialogVisible = true
      this.updateBlog = infoObj
    },
    // 删除函数
    async goDelete(id) {
      const { data: res } = await this.$http.post('/delete', { table: 't_blog', id })
      if (res.status === 0) {
        this.$message.success('删除成功')
        // 删除后台数据，删除前端数据
        this.blogList = this.blogList.filter((item) => item.id !== id)
      } else {
        this.$message.error('删除失败')
      }
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
    // 获取博客列表
    async getBlogList(start) {
      const { data: res } = await this.$http.get('/blog/getblogs', { params: { start } })
      if (res.status !== 0) return console.log('获取数据失败')
      else {
        this.blogList = res.data
        this.currentPage = res.data
      }
    },
    // markdown 转 html
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render
    },
    async submit() {
      // 全部内容是否不为空
      var tag = true
      for (let item in this.Updateblog) {
        if (this.Updateblog[item] === '') {
          tag = false
          break
        }
      }
      // 全都不为空可以发送请求
      if (tag) {
        // 格式化时间
        this.updateBlog.publishdate = dayjs(this.updateBlog.publishdate).format('YYYY-MM-DD')
        const { data: res } = await this.$http.post('/updateblog', this.updateBlog)
        if (res.status === 0) {
          this.$message.success('修改成功')
        } else this.$message.error('修改失败')
      } else this.$message.error('内容不能为空')
    },
    // 获取博客总条数
    async getTotal() {
      // 全都不为空可以发送请
      const { data: res } = await this.$http.get('/getnumber', { params: { table: 't_blog' } })
      if (res.status === 0) {
        this.total = res.count
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-input {
  width: 200px;
}
.demo-input-suffix {
  margin-bottom: 20px;
}
.sort-container {
  width: 100%;
}
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
/deep/ .el-dialog {
  margin-top: 0 !important;
}
.block {
  position: relative;
  left: 50%;
  transform: translate(-25%);
  margin: 10px auto;
}
</style>
