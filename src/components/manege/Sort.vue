<template>
  <div class="sort-container" v-loading="loading">
    <!-- 列表框架 -->
    <el-card class="box-card">
      <!-- 第一行头部 -->
      <div slot="header" class="clearfix">
        <span>分类管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="addsort_btn"
          >添加分类</el-button
        >
      </div>
      <!-- 列表标题、数据 -->
      <el-table :data="sortList" stripe style="width: 100%">
        <el-table-column label="分类名称" width="180">
          <!-- 使用提供的插槽接受数据，数据命名为scope -->
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类别名" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 操作按钮 -->
            <el-button type="success" size="small" @click="goEdit(scope.row)">编辑</el-button>
            <el-button type="info" size="small" @click="goDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 对话框，title值为添加分类时，显示添加的对话框，更新则出现更新的对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <div class="demo-input-suffix">
        分类名称：
        <el-input placeholder="请分类名称" v-model.trim="sortInfo.name" v-if="title === '添加分类'">
        </el-input>
        <el-input :value="updateInfo.name" v-model.trim="updateInfo.name" v-else></el-input>
      </div>
      <div class="demo-input-suffix">
        分类别名：
        <el-input
          placeholder="请分类别名"
          v-model.trim="sortInfo.nickname"
          v-if="title === '添加分类'"
        >
        </el-input>
        <el-input :value="updateInfo.nickname" v-model.trim="updateInfo.nickname" v-else>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSort" v-if="title === '添加分类'">确 定</el-button>
        <el-button type="primary" @click="updateSort" v-else>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Sort',
  created() {
    this.getCount()
    this.getSort()
  },
  data() {
    return {
      loading: false,
      title: '添加分类',
      sortInfo: {
        id: 0,
        name: '',
        nickname: ''
      },
      updateInfo: {},
      sortList: [],
      dialogVisible: false
    }
  },
  methods: {
    // 添加分类函数
    async addSort() {
      this.dialogVisible = false
      if (this.sortInfo.name === '' || this.sortInfo.nickname === '') {
        this.$message.error('内容不能为空')
      } else {
        const { data: res } = await this.$http.post('/addsort', this.sortInfo)
        if (res.status === 0) {
          // 添加成功后，将数据插入sortInfo
          this.sortList.push({
            id: this.sortInfo.id,
            name: this.sortInfo.name,
            nickname: this.sortInfo.nickname
          })
          this.sortInfo.id++
          this.$message.success('添加成功')
        } else {
          this.$message.error('添加失败')
        }
      }
    },
    // 更新分类函数
    async updateSort() {
      this.dialogVisible = false
      if (this.updateInfo.name === '' || this.updateInfo.nickname === '') {
        this.$message.error('内容不能为空')
      } else {
        this.loading = true
        const { data: res } = await this.$http.post('/updatesort', this.updateInfo)
        if (res.status === 0) {
          this.loading = false
          this.sortInfo.id++
          this.$message.success('更新成功')
        } else {
          this.loading = false
          this.$message.error('更新失败')
        }
      }
    },
    // 对话框转为更新框
    goEdit(infoObj) {
      this.title = '更新分类'
      ;(this.dialogVisible = true), (this.updateInfo = infoObj)
    },
    // 删除分类函数
    async goDelete(id) {
      this.loading = true
      const { data: res } = await this.$http.post('/delete', { table: 't_sort', id })
      if (res.status === 0) {
        this.loading = false
        this.sortInfo.id++
        this.$message.success('删除成功')
        // 删除后台数据，删除前端数据
        this.sortList = this.sortList.filter((item) => item.id !== id)
      } else {
        this.$message.error('删除失败')
      }
    },
    // 获取分类列表
    async getSort() {
      this.loading = true
      const { data: res } = await this.$http.get('/getsort')
      if (res.status === 0) {
        this.loading = false
        this.sortList = res.data
      } else {
        this.$message.error('获取列表失败')
      }
    },
    // 获取分类数量（id的最大值）
    async getCount() {
      const { data: res } = await this.$http.get('/getcount', { params: { table: 't_sort' } })
      if (res.status === 0) {
        // 得到最大值id + 1 作为新分类的id
        this.sortInfo.id = res.count + 1
      } else {
        this.$router.push('/login')
      }
    },
    addsort_btn() {
      this.dialogVisible = true
      this.title = '添加分类'
    }
  }
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
  width: 80%;
}
</style>
