//找到models目录下所有的.js文件然后给app提供各个角色模型
const fs = require('fs');
const db = require('./db');

let files = fs.readdirSync(__dirname+'/model');//方法将返回一个包含“指定目录下所有文件名称”的数组对象。

let js_files = files.filter((f)=>{
	return f.endsWith('.js');	
},files);

module.exports = {};

for(let f of js_files){
	console.log(`import model from file ${f}...`);
	let name = f.substring(0,f.length-3);
	module.exports[name] = require(__dirname + '/model/'+f);
	console.log("array"+typeof module.exports[name].create);
}
//console.log(module.exports);
module.exports.sync = ()=>{   //用来供自动创建的  init-db.js来调用
	db.sync();
}