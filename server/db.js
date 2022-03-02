// 导入mysql模块
const mysql = require('mysql')

// 数据库参数配置
const config = {
  database: 'blog',
  user: 'root',
  password: '',
}

exports.db = (sql, sqlParams) => {
  // 判断sqlParams是否为null 为null的话改为空数组
  sqlParams = sqlParams || []
  return new Promise((resolve, reject) => {
    // 创建数据库实例
    const pool = mysql.createPool(config)
    // 连接数据库
    pool.getConnection((err, conn) => {
      if (!err) {
        // 数据库查询
        conn.query(sql, sqlParams, (e, result) => {
          if (!e) {
            resolve(result)
            // 断开连接
            conn.destroy()
          } else {
            reject(e)
            console.log('mysql query err', e)
          }
        })
      } else {
        console.log('mysql connect err:', err)
        reject(err)
      }
    })
  })
}
