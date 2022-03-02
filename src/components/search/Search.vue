<template>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item label="标题:" style="width: 250px">
      <el-input placeholder="内容" style="width: 200px" v-model="content"></el-input>
    </el-form-item>
    <el-form-item label="类型:" style="width: 150px">
      <el-select placeholder="类型" style="width: 100px" v-model="sort">
        <el-option label="无" value=""></el-option>
        <el-option v-for="item in sortList" :label="item.name" :value="item.name" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Search',
  created() {
    this.getSort()
  },
  data() {
    return {
      sortList: [],
      content: '',
      sort: '',
    }
  },
  methods: {
    // 获取分类列表
    async getSort() {
      const { data: res } = await this.$http.get('/getsort')
      if (res.status === 0) {
        this.sortList = res.data
      } else {
        this.$message.error('获取列表失败')
      }
    },
    async submit() {
      if (this.content === '' && this.sort === '') return this.$message.error('搜索内容不能都为空')
      else {
        const { data: res } = await this.$http.get('/blog/search', { params: { title: '%' + this.content + '%', sort: '%' + this.sort + '%' } })
        if (res.status === 0) {
          // 将数据传给blog父组件
          this.$emit('getSearchResult', res.data)
        }
      }
    },
  },
}
</script>

<style></style>
