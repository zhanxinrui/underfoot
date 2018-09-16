// index: get时 的welcome界面
module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html', {
            title: 'Search'
        });
    }
};