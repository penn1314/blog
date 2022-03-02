const fs = require('fs')

module.exports = {
  // 封装文件读取函数
  openFile: function (filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  },
}
