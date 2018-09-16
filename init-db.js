const model = require('./model.js');
model.sync();//调用exp对象自动创建 
//开发环境下，首次使用sync(也可以自动创建出表结构)
console.log('init db ok.');


// 需要删除init-db.js中的process.exit(0),原因我推测是因为前面的数据库操作会耗时，而process.exit(0)会让程序在数据库操作还未完成的时候就退出了。
// init-db.js这个是需要手动执行的，而且执行的命令是NODE_DEV=test node init-db.js,这样就设置好了，是在test这个数据库中创建表格。