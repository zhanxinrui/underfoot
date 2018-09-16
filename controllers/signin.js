module.exports = {
    //render相关的页面
        'POST/signin':async(ctx,next)=>{
            var email =  ctx.request.body.email || '',
                password = ctx.request.password || '',
            //在这需要进行验证， 利用mysql验证    
            if (email === 'admin@example.com' && password === '123456') {
                console.log('signin OK!');
                ctx.render('signin-ok.html',{
                    title: 'sign In OK',
                    name:'Mr Node'
                });
            }
            else {
                console.log('signin failed');
                ctx.render('signin-failed.html', {
                    title: 'Sign In Failed'
                });
            }
            
        }
    };