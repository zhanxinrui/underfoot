/*config-default.js：存储默认的配置；
config-override.js：存储特定的配置； 实际配置
config-test.js：存储用于测试的配置。*/
const defaultConfig = './config-default.js';
//也可以是绝对路径
const overrideConfig = './config-override.js';
const testConfig = './config-test.js';
const fs = require('fs');
var config = null;
if(process.env.NODE_ENV === 'test'){
	console.log(`Load ${testConfig}...`);
	config = require(testConfig);
}else{
	console.log(`Load ${defaultConfig}...`);
	config = require(defaultConfig);
	try{
		if(fs.statSync(overrideConfig).isFile()){
			console.log(`Load ${overrideConfig}...`);
			config = Object.assign(config,require(overrideConfig));
		}
	}catch(err){
		console.log(`Cannot load ${overrideConfig}`);
	}
}


module.exports = config;