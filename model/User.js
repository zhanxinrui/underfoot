
const db = require('../db');
 //映射表结构
 module.exports = db.defineModel('user',{
	id:{
	type:db.STRING(50),
	primaryKey:true
	},
	password:db.STRING(50),
	name:db.STRING(100),//数据库中定义的对应到Sequelize的的string
	gender:db.BOOLEAN,
	birth:db.STRING(10),
	vocation:db.STRING(50)
 });

