//为了处理URL，我们需要引入koa-router这个middleware，让它负责处理URL映射。

const fs = require('fs');

// add url-route in /controllers:

function addMapping(router, mapping) {//进行映射
    for (var url in mapping) {//in只取key controller中的各文件url:方法 对应映射
        if (url.startsWith('GET ')) {
            var path = url.substring(4);//后半部分
            router.get(path, mapping[url]);//router的get方法每当传入用户输入值时调用就是用对应的controller/下各文件对象'xxx xxx'的方法
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir) {
    fs.readdirSync(__dirname + '/' + dir).filter((f) => {
        return f.endsWith('.js');
    }).forEach((f) => {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/' + dir + '/' + f);//mapping选出 默认controllers下的文件名相符的文件加入mapping
        addMapping(router, mapping);
    });
}

module.exports = function (dir) {//导出
    let
        controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};
