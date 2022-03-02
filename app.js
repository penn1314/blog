const express = require('express')
const app = express()
const { db } = require('./server/db.js')
//导入
const expressJWT = require('express-jwt')
const secretKey = 'penn is handsome!!!'
// post数据解析模块
const bodyParser = require('body-parser')
//导入路由模块
const router = require('./server/router.js')
// 打开文件
const fs = require('./server/openfile.js')

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())

app.use(expressJWT({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/blog\//, /^\/tologin/, /^\/getnumber/, /^\/getsort/] }))

// 添加cors
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

//注册路由模块
app.use(router)
//解析token 解析成功后会生成req.user属性 值为sign的用户信息，即一个参数
// app.use(expressJWT({secret: secretKey}).unless({path: [/^\/api\//]}))

// 处理错误
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.send({
      status: 1,
      message: 'token过期',
    })
  }
  next()
})

app.listen(3001, () => {
  console.log('server is running at prot 3001')
})
