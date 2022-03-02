// 路由模块
const express = require('express')
const { db } = require('./db')
//创建路由实例
const router = express.Router()
const querystring = require('querystring')
const expressJWT = require('express-jwt')
const jwt = require('jsonwebtoken')
const { query } = require('express')
// token密钥
const secretKey = 'penn is handsome!!!'

//挂载路由
// 验证登录
router.all('/tologin', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.body.username !== 'penn123' || req.body.password !== '123123') {
    let resData = {
      status: 1,
      message: '请求失败',
    }
    return res.send(JSON.stringify(resData))
  } else {
    //使用jwt.sign()生成token  sign第一个参数是用户信息，第二个参数是密钥，第三个参数是token有效期
    const token = jwt.sign({ username: req.body.username, password: req.body.password }, secretKey, { expiresIn: '1h' })
    resData = {
      status: 0,
      message: '请求成功',
      token,
    }
    res.send(resData)
  }
  // 响应内容
})

// 登录
router.post('/api/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.body.username !== 'penn123' || req.body.password !== '123123') {
    let resData = {
      status: 1,
      message: '请求失败',
    }
    return res.send(JSON.stringify(resData))
  } else {
    let resData = {
      status: 0,
      message: '请求成功',
    }
    return res.send(JSON.stringify(resData))
  }
})

// 检查token
router.get('/check', (req, res) => {
  if (!req.user) {
    res.send({
      status: 1,
      message: 'token过期',
    })
  } else {
    res.send({
      status: 0,
      message: '验证成功',
    })
  }
})
//

// 获取所有博客信息
router.get('/blog/getblogs', async (req, res) => {
  const sql = 'select * from t_blog limit ' + req.query.start + ', 10'
  const data = await db(sql).catch((err) => err)
  if (!Array.isArray(data)) {
    return res.send({
      status: 1,
      message: '获取数据失败',
    })
  } else {
    res.send({
      status: 0,
      message: '获取数据成功',
      data: JSON.parse(JSON.stringify(data)),
    })
  }
})

// 获取博客标题，叙述，时间，作者
router.get('/blog/getblogabstract', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const sql = 'select id,title,abstract,author,publishdate from t_blog'
  const data = await db(sql).catch((err) => err)
  if (!Array.isArray(data)) {
    return res.send({
      status: 1,
      message: '获取数据失败',
      err: data,
    })
  } else {
    res.send({
      status: 0,
      message: '获取数据成功',
      data,
    })
  }
})

// 根据id获取博客
router.get('/blog/getblog', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const sql = 'select title,content,tag,author,publishdate from t_blog where id = ?'
  const data = await db(sql, req.query.id).catch((err) => err)
  if (!Array.isArray(data) || data.length == 0) {
    return res.send({
      status: 1,
      message: '获取数据失败',
      err: data,
    })
  } else {
    res.send({
      status: 0,
      message: '获取数据成功',
      data,
    })
  }
})

// 添加分类
router.post('/addsort', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  const sql = 'insert into t_sort set ?'
  const sqlParams = { id: req.body.id, name: req.body.name, nickname: req.body.nickname }
  const data = await db(sql, sqlParams)
  if (data) {
    res.send({
      status: 0,
      message: '插入数据成功',
    })
  } else {
    res.send({
      status: 1,
      message: '插入数据失败',
    })
  }
})

// 删除分类、博客
router.post('/delete', async (req, res) => {
  const sql = 'delete from ' + req.body.table + ' where id = ?'
  const data = await db(sql, req.body.id)
  if (data) {
    res.send({
      status: 0,
      message: '删除成功',
    })
  } else {
    res.send({
      status: 1,
      message: '删除失败',
    })
  }
})

// 修改分类
router.post('/updatesort', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const sql = 'update t_sort set name=?,nickname=? where id = ?'
  const sqlParams = [req.body.name, req.body.nickname, req.body.id]
  const data = await db(sql, sqlParams)
  if (data) {
    res.send({
      status: 0,
      message: '更新成功',
    })
  } else {
    res.send({
      status: 1,
      message: '更新失败',
    })
  }
})

// 获取分类
router.get('/getsort', async (req, res) => {
  const sql = 'select * from t_sort'
  const data = await db(sql)
  if (data) {
    res.send({
      status: 0,
      data,
      message: '获取成功',
    })
  } else {
    res.send({
      status: 1,
      message: '更新失败',
    })
  }
})
// 获取id最大值
router.get('/getcount', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  const sql = 'select max(id) as count from ' + req.query.table
  const data = await db(sql)
  if (data) {
    res.send({
      status: 0,
      count: data[0].count,
      message: '成功',
    })
  } else {
    res.send({
      status: 1,
      message: '更新失败',
    })
  }
})
// 获取总数量
router.get('/getnumber', async (req, res) => {
  const sql = 'select count(id) as count from ' + req.query.table
  const data = await db(sql)
  if (data) {
    res.send({
      status: 0,
      count: data[0].count,
      message: '成功',
    })
  } else {
    res.send({
      status: 1,
      message: '失败',
    })
  }
})

// 添加博客
router.post('/addblog', async (req, res) => {
  const sql = 'insert into t_blog set ?'
  const sqlParams = req.body
  const data = await db(sql, sqlParams)
  if (data) {
    res.send({
      status: 0,
      message: '添加成功',
    })
  } else {
    res.send({
      status: 1,
      message: '添加失败',
    })
  }
})
// 修改博客
router.post('/updateblog', async (req, res) => {
  const sql = 'update t_blog set ? where id = ?'
  const sqlParams = [req.body, req.body.id]
  const data = await db(sql, sqlParams)
  if (data) {
    res.send({
      status: 0,
      message: '修改成功',
    })
  } else {
    res.send({
      status: 1,
      message: '修改失败',
    })
  }
})
// 搜索博客
router.get('/blog/search', async (req, res) => {
  let sql = ''
  let sqlParams = ''
  // 匹配分类
  if (req.query.title === '%%' && req.query.sort !== '%%') {
    sql = 'select * from t_blog where sort like ?'
    sqlParams = req.query.sort
    // 匹配标题
  } else if (req.query.title !== '%%' && req.query.sort === '%%') {
    sql = 'select * from t_blog where title like ?'
    sqlParams = req.query.title
    // 匹配分类和标题
  } else if (req.query.title !== '%%' && req.query.sort !== '%%') {
    sql = 'select * from t_blog where title like ? and sort like ?'
    sqlParams = [req.query.title, req.query.sort]
  } else return
  const data = await db(sql, sqlParams)
  if (data) {
    res.send({
      status: 0,
      data,
      message: '修改成功',
    })
  } else {
    res.send({
      status: 1,
      message: '修改失败',
    })
  }
})

//向外导出路由对象
module.exports = router
