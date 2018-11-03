//统一Model的定义：   而不是针对一个对象进行定义  给User.js提供
const Sequelize = require('sequelize');
const config = require('./config');
const uuid = require('node-uuid');//通用唯一识别码，使分布式系统中的所有元素都有唯一辨识的信息
console.log('init sequulize...');
function generateId(){
	return uuid.v4();
}


//定义Sequelize的通用属性
var sequelize = new Sequelize(config.database,config.username,config.password,{
	host:config.host,
	port:3306 ,//指定非默认的主机和端口
	dialect:'mysql',
	pool:{
		max:5,//不知道什么的最大是max
		min:0,
		idle:30000//最大等待连接中的数量
	},
	define:{ //相当于在用sequelize中的默认设置
		underscored:false,
		freezeTableName:true,
		syncOnAssociation:true,
		charset:'utf8',
		dialectOptions:{
			collate:'utf8_general_ci'
		},
		timestamps:false
	}
});

// var ex = db.defineModel('pets', {
//     ownerId: db.ID,
//     name: db.STRING(100),
//     gender: db.BOOLEAN,
//     birth: db.STRING(10),
// });


const ID_TYPE = Sequelize.STRING(50);
//定义通用模型
function defineModel(name,attributes){
	var attrs = {};
	for(let key in attributes){
		let value = attributes[key];
		if(typeof value==='object' && value['type']){//属性是一个对象有多个属性构成的 ‘type’对应的例如STRING(100)
			value.allowNull = value.allowNull ||false;
			attrs[key] = value;
		}else{
			attrs[key] = {
				type: value, //转换成那种每个属性都是一个对象，包含了指示类型type的属性，进行区分
				allowNull:false
			};
		}
	}
	//推几个通用的attr
	attrs.id = {
		type:ID_TYPE,
		primaryKey: true
	};
	attrs.createdAt = {
		type:Sequelize.BIGINT,
		allowNull: false
	};
	attrs.updatedAt = {
		type:Sequelize.BIGINT,
		allowNull:false
	};
	attrs.version = {
		type:Sequelize.BIGINT,
		AllowNull:false
	};
	console.log('create table success');

	return sequelize.define(name,attrs,{
		tableName: name,
		timestamps:false,
		hooks:{
			//在beforeValidate这个事件中根据是否是isNewRecord设置主键(如果主键Null或undefined),设置时间戳和版本号
			beforeValidate:function(obj){
				let now = Date.now();
				if(obj.isNewRecord){
					if(!obj.id){
						obj.id = generateId();
					}
					obj.createdAt = now;
					obj.updatedAt = now;
					obj.version = 1;
				}else{
					obj.updatedAt = Date.now();
					obj.version++;
				}
			}
		}
	})
}







const TYPES = ['STRING','INTEGER','BIGINT','TEXT','DOUBLE','DATEONLY','BOOLEAN'];

var exp = {
	defineModel: defineModel,
	sync:()=>{  //测试环境下创建表结构  （ 同步Model结构到数据库中，即：在数据库中创建表。执行成功后，会在回调中返回模弄的实例（this）。）
		//只在非生产环境下
		if(process.env.NODE_ENV !== 'production'){
			sequelize.sync({force:true});
		}else{
			throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
		}
	}
};
for(let type of TYPES){
	exp[type] = Sequelize[type]; //Sequelize的各类型给exp   就是说import了这个的就可以直接用exp.STRING了而不用 Sequlize再import一遍
}
exp.ID = ID_TYPE;
exp.generateId = generateId();
module.exports = exp;


