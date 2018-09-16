const fs = require('mz/fs');//检验文件是否存在，读文件
const mine = require('mine');//使用lookup获取文件的类型
const path = require('path');//用来连接路径



function staticFiles(url,dir){//用来读取static静态文件的
    return async(ctx,next)=>{
        rpath = ctx.request.path;
        if(rpath.startWith(url)){
            let fp = path.join(dir,rpath.substring(url.length));
            if(await fs.exists(fp)){//fs要基于await读写文件
                ctx.request.type = mine.lookup(rpath);
                ctx.request.body = await fs.readFile(fp);
            }else{
                ctx.response.status = 404;
            }
        }else{
            await next();
        }
    }
}
module.exports = staticFiles;