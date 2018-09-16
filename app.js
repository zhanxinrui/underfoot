const Koa  = require('koa');//导入koa我们导入的是一个class所以用大写的Koa表示
const templating = require('./templating');
const bodyParser = require('koa-bodyparser');//对于post请求的数据，nod不提供解析requestbody的功能，bodyparser自动解析
const staticFiles = require('./static-files');//用来读取static下的静态文件
const isProduction = process.env.NODE_ENV === 'production';
const controller = require('./controller');
const app = new Koa();//创建一个Koa对象表示webapp本身
const model = require('./model')




//记录登陆方式，url并记录时间
app.use(async (ctx, next) => {
    console.log(`process ${ctx.request.method} url:${ctx.request.url}`);
    var 
        start  = new Date().getTime(),
        exectTime;
    await next();
    exectTime = new Date().getTime()-start;//等会查看是不是对每一个都是有效的
    console.log('time exect:',exectTime);
});

// 静态文件
if (! isProduction) {
    app.use(staticFiles('/static/', __dirname + '/static'));
}

//解析post等request的body
app.use(bodyParser());

//使用nunjuncks作为视图
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));
// 控制器
app.use(controller());

//监听
app.listen(4011);






var User = model.User;

(async() => {
    var user = await User.create({
	id : 'usertest'+Date.now(),
	password:'12345678',
    name: 'Roger',
    gender: false,
    birth: '1981-08-08',
    vocation:'student',
    version: 0
	});
    console.log('created: ' + JSON.stringify(user));
})();


//查询数据
(async() => {
    var user2 = await User.findAll({
        where:{
            name:'Roger'
        }

    });
    console.log(`find ${user2.length} user:`);
    for(let p of user2){
        console.log(JSON.stringify(p));
        console.log('update user...');
        p.gender = true;
        p.updateAt = Date.now();
        p.version ++;
        await p.save();
        if(p.version ===3){
            await p.destroy();
            console.log(`${p.name}was destroyed`);
        }
    }
})();