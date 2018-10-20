// var IndexPage = "http://localhost:8080/xxxx.html";
// var AuthCode = "123123";
// import * as Vue from "vue"
import $ from "jquery";
import Vue from "vue";
import VeeValidate from   "vee-validate"
var IndexPage = "http://localhost:4011/homepage";
// var AuthCode = "123123";

export default function checkIn(){
    
    init();
    logRecommend();
    verifyRecommend();
    registRecommend();
}
var code;

function init(){
$(function(){
    createCode();
    $("body").css("display","block");
    console.log('ok');
    $("#verify-close-button,#login-close-button,#register-close-button").click(function(){
        $(".checkin-content").css("display","none");
        // $(".");
    })
    $(".log-button").click(function(){
        console.log('log-button');
        $(".checkin-content").css("display","block");
        $("#login-content").css("display","block");
        $("#verify-content").css("display","none");
        $("#register-content").css("display","none");
    });
    $(".verify-button").click(function(){
        $(".checkin-content").css("display","block");
        console.log('verify-button');
        $("#verify-content").css("display","block");
        $("#login-content").css("display","none");
        $("#register-content").css("display","none");
        });

    $(".register-button").click(function(){
        $(".checkin-content").css("display","block");
        console.log('register-button');
        $("#register-content").css("display","block");
        $("#login-content").css("display","none");
        $("#verify-content").css("display","none");
    });
    $("#verify-img-button").click(createCode);
    $("#verify-send-button1 button").click(function(){addCountDown($("#verify-send-button1 button"),3); return false});
    $("#verify-send-button2 button").click(function(){addCountDown($("#verify-send-button2 button"),3); return false});
  
})    


// VeeValidate.Validator.localize('zh_CN');
const config = {
    events: 'blur',//events默认是input|blur，就是在用户输入和表单失去焦点时都进行校验，这里我改成了blur，即只有失去焦点时才开始验证。
    locale: 'en',

}
Vue.use(VeeValidate,config);
VeeValidate.Validator.localize({
    zh_CN:{
        messages:{
            required: function(name){return name + '不能为空'},
        }
    }
});
// Pass options to make all validators use the arabic language, also merge the english and arabic attributes with the internal dictionary.
// Vue.use(VeeValidate, {
//   locale: 'ar',
//   dictionary: {
//     en: { attributes: attributesEn },
//     ar: { messages: messagesAr, attributes: attributesAr }
//   }
// });


VeeValidate.Validator.extend('account',{
    getMessage:function(){
        // return"请输入正确格式的邮箱或手机号"
        return"Please enter the right format of your email or phone";
    },
    validate:function(value){
        let email = /^\w+@(\w){2,10}(\.(\w){2,4}){1,3}$/;
        let phone = /^\d{7,15}$/;
        return email.test(value)||phone.test(value);//
    }
}
);
VeeValidate.Validator.extend('verify_code',{
    getMessage:function(){return"Please enter the right format of your verification code "},
    validate:function(value){return /^\d{6}/.test(value)}
},  {immediate: false});

VeeValidate.Validator.extend('password',{
    getMessage:function(){return" Wrong format! it must between 6 and 19"},
    validate:function(value){return /^\w{6,19}/.test(value)}
},  {immediate: false});


VeeValidate.Validator.extend('password_again',{
    getMessage:function(){return" Didn't match the first password"},
     validate:function(value){return /^\w{6,19}/.test(value)}
});
}
VeeValidate.Validator.extend('img_verify_code',{
    getMessage:function(){
        return"Wrong! Please check it"
    },
    validate:function(value){

         //设置一个全局的变量，便于保存验证码
         // console.log("value",value.length,value.toLowerCase(),value === code);
         // console.log('valueand code !!!');
         // value.length
    return (value.toLowerCase() === code.toLowerCase())

    }

},  {immediate: false}
)

function logRecommend(){
    var classList = new Vue({
        el:"#login-content",
        data: function(){
            return {
                account:"",
                password:"",
                img_verify_code:"",

            }
        },
        methods:{
            validateBeforeSubmit(){
                this.$validator.validateAll().then((result) => {
                    if(result){
                        $.ajax({
                            url:'/',
                            data:{
                                Request:"POST",
                                message:'login',
                                account: this.account,
                                password:this.password
                            },
                            type:'POST',
                            dataType: "json",
                            success:function(data){
                                if(data)
                                window.location.href = IndexPage;
                            else
                                window.location.href = IndexPage;
                            }
                        });
                        return;
                    }
                    alert("请输入完整推荐信息");
                });
            }
        },
        delimiters: ['[[', ']]']
    })
}
function verifyRecommend(AuthCode){
    // console.log('ok');
    var classList = new Vue({
        el:"#verify-content",
        data: function(){
            return {
                account:"",
                verify_code:"",
            }
        },
        methods:{
            validateBeforeSubmit(){
                this.$validator.validateAll().then((result) => {
                    if(result){
                        $.ajax({
                            url:'/',
                            data:{
                                Request:"POST",
                                account: this.account,
                                message:'verify',
                                verify_code:this.verify_code
                            },
                            type:'POST',
                            dataType: "json",
                            success:function(data){
                                // $("html").html(data);
                                if(data)
                                    window.location.href = IndexPage;
                                else
                                    window.location.href = IndexPage;
                                // console.log(data);
                                // var msg = data.msg;
                                // alert(msg);
                               // window.location.href = IndexPage;
                            }
                        });
                        return;
                    }
                    alert("请输入完整推荐信息");
                });
            }
        },
        delimiters: ['[[', ']]']
    })
}
function registRecommend(AuthCode){
    var classList = new Vue({
        el:"#register-content",
        data: function(){
            return {
                account:"",
                verify_code:"",
                password:"",
                password_again:"",
            }
        },
        methods:{
            validateBeforeSubmit(){
                this.$validator.validateAll().then((result) => {
                    if(result){
                        $.ajax({
                            url:'/',
                            data:{
                                Request:"POST",
                                message:'register',
                                account: this.account,
                                password:this.password,
                                verify_code:this.verify_code,
                                password_again:this.password_again

                            },
                            type:'POST',
                            dataType: "json",
                            success:function(data){
                                if(data)
                                    window.location.href = IndexPage;
                                else
                                    window.location.href = IndexPage;
                            }
                        });
                        return;
                    }
                    alert("请输入完整推荐信息");
                });
            }
        },
        delimiters: ['[[', ']]']
    })
}
//创建验证码
function createCode(){
    console.log("press the button");
  //首先默认code为空字符串
    code = '';
    //设置长度，这里看需求，我这里设置了4
    var codeLength = 4;
    console.log(document);
    var codeV = document.getElementById('verify-img-button');
    console.log('!!!!!!!',codeV);
    //设置随机字符
    var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R', 'S','T','U','V','W','X','Y','Z');
    //循环codeLength 我设置的4就是循环4次
    for(var i = 0; i < codeLength; i++){
        //设置随机数范围,这设置为0 ~ 36
         var index = Math.floor(Math.random()*36);
         //字符串拼接 将每次随机的字符 进行拼接
         code += random[index]; 
    }
    //将拼接好的字符串赋值给展示的Value
    codeV.value = code;
 }
// 倒计时
  function addCountDown(el,time){
    // console.log("addCountDown Start");
  

    let count  = time;
    console.log('el',el);
    // el.disabled = "disabled";
    el.css("background","#ebebed");


    // el.attr("readonly", true);
    console.log("el.jquery",el.jquery);
    el.prop("disabled",true);

    var int = setInterval(function(){
        console.log('el.text()',el.text());
        console.log('el.text()',parseInt(el.text()));
        if(parseInt(el.text())==1){
            el.text('Send');
            count = time;
            // console.log('stop');
            el.prop("disabled",false);
            el.css("background","#918e6f");
            // el.value = 'Send';
            clearInterval(int);
        }
        else  {  
            // console.log(count.toString());
            el.text(count) ;
            count -= 1; 
            console.log(count);
        }
        },1000);
    return false;
 }