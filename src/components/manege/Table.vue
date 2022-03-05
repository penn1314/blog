<template>
  <el-table :data="blogList" stripe style="width: 100%">
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
</template>

<script>
export default {
  name: 'Table',
  methods: {
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
  },
}
</script>

<style lang="less" scoped></style>
