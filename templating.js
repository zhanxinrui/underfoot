//nunjucks模板的设置
const nunjucks = require('nunjucks');
function createEnv(path,opts){
    var 
        autoescape = opts.autoescape === undefined?true:opts.autoescape; //如果在环境变量中设置了 autoescaping，所有的输出都会自动转义，但可以使用 safe 过滤器， Nunjucks 就不会转义了。反之使用escape来转义

        noCache = opts.noCache || false; //默认缓存
        watch = opts.watch || false;
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path,{
                noCache:noCache,
                watch: watch,
            }),{
                autoescape:autoescape,
                throwOnUndefined:throwOnUndefined
            });
    if (opts.filters){
        for(var f in opts.filters){
            env.addFilter(f.opts.filters[f]);
        }
    }    
    return  env;
}

function templating(path, opts) {
    var env = createEnv(path, opts);
    return async (ctx, next) => {
        ctx.render = function (view, model) {//写render
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));//创一个对象
            ctx.response.type = 'text/html';
        };
        await next();
    };
}

module.exports = templating;