const model = require('../model')
module.exports = {
    //render相关的页面
        'POST /signin':async(ctx,next)=>{
            var email =  ctx.request.body.email || '',
                password = ctx.request.body.password || '';
            //在这需要进行验证， 利用mysql验证    
            if (email === 'admin@example.com' && password === '123456') {
                // console.log('signin OK!');
                ctx.render('signin-ok.html',{
                    title: 'sign In OK',
                    name:'Mr Node'
                });
            }
            else {
                // console.log('signin failed');
                ctx.render('signin-failed.html', {
                    title: 'Sign In Failed'
                });
            }
        },
        'POST /':async(ctx,next)=>{
            var account = ctx.request.body.account ||'',
                password = ctx.request.body.password || '';
                message = ctx.request.body.message || '';
            if(message=="login"){
                // console.log('input account',account);
                // console.log('input password',password);
                var User = model.User;
                var user2;

                user2 = await User.findAll({
                    where:{
                        id:account
                    }
                    
            
                });

              // you can now access the newly created task via the variable task
                // console.log('user2[0]',user2[0].password);
                if(user2&&password==user2[0].password){
                    // console.log("passwd correct!");
                    // console.log("Signin Ok");
                    ctx.body = true;
                }
                else {
                    // console.log("passwd wrong!");
                    // console.log('signin failed');

                    ctx.body = false;
               }
                    // console.log('js?!');

            }
            
        }
        
    };



