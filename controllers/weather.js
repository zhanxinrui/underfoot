const cityCode = require('../cityList');
var weather  = require('../run/getWeather');//一旦引入就是局部的，不是引用
module.exports = {
    'POST /weather':async(ctx,next)=>{
        console.log('at weather roter')
        var cityName = ctx.request.body.cityName ||'';
        var str1='';
        for(i of cityName){
            if(i=='市') break;
            str1 += i;
            if(i=='省') 
                str1='';
                // console.log(i,' ');
        }
        if(cityName = '') 
            str1 = '西安';
        console.log('str1', str1)
        if(cityCode[str1])
            console.log('城市的编码是:',cityCode[str1]);
        if(!cityCode[str1]){
            console.log("wrong here");
            ctx.body = null;

        }
        else{
            //查询天气
            console.log('地址',weather.f);
            // var f= weather.f+cityCode[str1]+'.html';//不知道为什么原来的weather给const了,修改不了
            var f = weather.f+cityCode[str1]
            var value = await weather.req(f);
            // setInterval();
            let weather1  = require('../run/getWeather');//重新require之前的不适用
            console.log("返回值",value);
            console.log("参数weather1：",
                weather1.cloudTypeTmp,
                weather1.cloudSizeTmp,
                weather1.cloudNumTmp,
                weather1.windTmp,
                weather1.rainTmp,
                weather1.rainTypeTmp,

                weather1.snowTypeTmp,
                weather1.snowSizeTmp,
                weather1.starSizeTmp);
            let tmp1 = weather1.cloudTypeTmp;
                // Attr = {cloudType:[0,1,2,3,4,5,6,7,8,9],cloudSize:200,cloudNum:50,wind:2,rain:0,rainNum:50,rainType:[0,1,2,3,4,5],snowType:[0,1,2,3,4],snowSize:5,snowNum:1000,fog:0,starSize:2,starNum:3000};

            ctx.body = JSON.stringify({cloudType:weather1.cloudTypeTmp,cloudSize:weather1.cloudSizeTmp,cloudNum:weather1.cloudNumTmp,wind:weather1.windTmp,rain:weather1.rainTmp,rainType:weather1.rainTypeTmp,snowType:weather1.snowTypeTmp,snowSize:weather1.snowSizeTmp,starSize:weather1.starSizeTmp ,sunriseH:weather1.sunriseH,
                sunriseM:weather1.sunriseM,
                sunsetH:weather1.sunsetH,
                sunsetM:weather1.sunsetM});
        }
    }
}