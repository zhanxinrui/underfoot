const Koa  = require('koa');//导入koa我们导入的是一个class所以用大写的Koa表示
const templating = require('./templating'); 

const bodyParser = require('koa-bodyparser');//对于post请求的数据，nod不提供解析requestbody的功能，bodyparser自动解析
const staticFiles = require('./static-files');//用来读取static下的静态文件
const isProduction = process.env.NODE_ENV === 'development';
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
});

// 静态文件
if (! isProduction) {
    app.use(staticFiles('/static', __dirname + '/static'));
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


