
var fs = require('fs');
var url = require('url');
var http= require('http');
// var exec = require('child_process').exec;
// var spawn = require('child_process').spawn;
//格式说明
//var format={fa:图片1,fb：图片2,fc:温度1,fd：温度2,fe:风向1,ff：风向2,fg:风力1,fh：风力2,fi:日出日落};  
//定义天气类型
// var weatherArr={"00":"晴","01":"多云","02":"阴","03":"阵雨","04":"雷阵雨","05":"雷阵雨伴有冰雹","06":"雨夹雪","07":"小雨","08":"中雨","09":"大雨","10":"暴雨","11":"大暴雨","12":"特大暴雨","13":"阵雪","14":"小雪","15":"中雪","16":"大雪","17":"暴雪","18":"雾","19":"冻雨","20":"沙尘暴","21":"小到中雨","22":"中到大雨","23":"大到暴雨","24":"暴雨到大暴雨","25":"大暴雨到特大暴雨","26":"小到中雪","27":"中到大雪","28":"大到暴雪","29":"浮尘","30":"扬沙","31":"强沙尘暴","53":"霾","99":""}; 
var weatherArr={"晴":"00","多云":"01","阴":"02","阵雨":"03","雷阵雨":"04","雷阵雨伴有冰雹":"05","雨夹雪":"06","小雨":"07","中雨":"08","大雨":"09","暴雨":"10","大暴雨":"11","特大暴雨":"12","阵雪":"13","小雪":"14","中雪":"15","大雪":"16","暴雪":"17","雾":"18","冻雨":"19","沙尘暴":"20","小到中雨":"21","中到大雨":"22","大到暴雨":"23","暴雨到大暴雨":"24","大暴雨到特大暴雨":"25","小到中雪":"26","中到大雪":"27","大到暴雪":"28","浮尘":"29","扬沙":"30","强沙尘暴":"31","霾":"53","":"99"}; 

// Attr = {cloudType:[0,1,2,3,4,5,6,7,8,9],cloudSize:200,cloudNum:50,wind:2,rain:0,rainNum:50,rainType:[0,1,2,3,4,5],snowType:[0,1,2,3,4],snowSize:5,snowNum:1000,fog:0,starSize:2,starNum:3000};
var cloudType = {"00":[1,3,4,6],"01":[1,2,3,4,5,6,7],"02":[1,2,3,4,5,6,7],"03":[2,8,9,10,15],"04":[2,8,9,10,15],"05":[2,8,9,10,15],"06":[2,8,9,10,15],"07":[1,2,3,4,5,6,7],"08":[2,8,9,10,15],"09":[8,9,12,13,15],"10":[12,13,14,15,16],"11":[14,15,16,17,18,19,20,21,22],"12":[14,15,16,17,18,19,20,21,22],"13":[1,2,3,4,5,6,7],"14":[1,2,3,4,5,6,7],"15":[2,8,9,10,15],"16":[12,13,14,15,16],"17":[14,15,16,17,18,19,20,21,22],"18":[1,2,8,9,10,15],"19":[1,2,8,9,10,15],"20":[1,2,8,9,10,15],"21":[1,2,8,9,10,15],"22":[1,2,8,9,10,15],"23":[1,2,8,9,10,15],"24":[1,2,8,9,10,15],"25":[1,2,8,9,10,15],"26":[1,2,8,9,10,15],"27":[1,2,8,9,10,15],"28":[1,2,8,9,10,15],"29":[1,2,8,9,10,15],"30":[1,2,8,9,10,15],"31":[1,2,8,9,10,15],"53":[1,2,8,9,10,15]},
    //	size num,wind	initCloud(cloudType,Math.log2(effectController.cloud)*500,effectController.cloud*2,effectController.wind1);
    cloudSize={"00":6,"01":8,"02":10,"03":10,"04":10,"05":10,"06":10,"07":10,"08":12,"09":13,"10":14,"11":15,"12":16,"13":9,"14":8,"15":12,"16":13,"17":15,"18":16,"19":18,"20":[1,2,8,9,10,15],"21":10,"22":10,"23":10,"24":10,"25":10,"26":10,"27":10,"28":10,"29":10,"30":10,"31":10,"53":10},
    cloudNum = {"00":7,"01":10,"02":13,"03":14,"04":14,"05":14,"06":8,"07":8,"08":9,"09":10,"10":12,"11":13,"12":14,"13":10,"14":10,"15":11,"16":13,"17":13,"18":10,"19":10,"20":10,"21":10,"22":10,"23":10,"24":10,"25":10,"26":10,"27":10,"28":10,"29":10,"30":10,"31":10,"53":10},
    wind = {"00":1,"01":1,"02":1,"03":1,"04":3,"05":1,"06":1,"07":1,"08":4,"09":5,"10":6,"11":7,"12":8,"13":1,"14":3,"15":4,"16":5,"17":7,"18":1,"19":1,"20":7,"21":3,"22":4,"23":5,"24":7,"25":3,"26":4,"27":5,"28":1,"29":1,"30":1,"31":1,"53":1},
    //initRain(rainType,2,effectController.rain*50,effectController.wind1)
    rain={"00":0,"01":0,"02":0,"03":1,"04":3,"05":3,"06":3,"07":2,"08":3,"09":10,"10":11,"11":15,"12":20,"13":1,"14":1,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":3,"22":5,"23":9,"24":11,"25":13,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"53":0},
    rainType = {"00":[],"01":[],"02":[],"03":[1,3],"04":[1,3,2],"05":[1,3,2],"06":[1,3,2],"07":[1],"08":[1,3,2],"09":[1,3,2,5,6],"10":[1,3,2,5,6],"11":[1,3,2,5,6,4],"12":[1,3,2,5,6,4],"13":[1,3],"14":[1,3],"15":[],"16":[],"17":[],"18":[],"19":[],"20":[],"21":[1,3,2],"22":[1,3,2,5],"23":[1,3,2,5,6],"24":[1,3,2,5,6],"25":[1,3,2,5,6,4],"26":[],"27":[],"28":[],"29":[],"30":[],"31":[],"53":[]},
    // initSnow(snowType,Math.floor(effectController.snow/4),effectController.snow*200,effectController.wind1);
    snowType = {"00":[],"01":[],"02":[],"03":[],"04":[],"05":[],"06":[],"07":[],"08":[],"09":[],"10":[],"11":[],"12":[],"13":[0,1,2,3,4,5],"14":[0,1,2,3],"15":[0,1,2,3,4,5],"16":[0,1,2,3,4,5,6,7],"17":[0,1,2,3,4,5,6,7],"18":[],"19":[],"20":[],"21":[],"22":[],"23":[],"24":[],"25":[],"26":[0,1,2,3,4,5],"27":[0,1,2,3,4,5,6,7],"28":[0,1,2,3,4,5,6,7],"29":[],"30":[],"31":[],"53":[]},
    snowSize = {"00":0,"01":0,"02":0,"03":0,"04":0,"05":0,"06":0,"07":0,"08":0,"09":0,"10":0,"11":0,"12":0,"13":6,"14":6,"15":8,"16":10,"17":15,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":9,"27":13,"28":18,"29":0,"30":0,"31":0,"53":0},
    // snowNum = {},
    fog={},
    starSize={"00":3,"01":2,"02":1,"03":0,"04":0,"05":0,"06":0,"07":1,"08":0,"09":0,"10":0,"11":0,"12":0,"13":1,"14":1,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"53":0};
var 
    cloudTypeTmp=[],
    cloudSizeTmp,
    cloudNumTmp,
    windTmp,
    rainTmp,
    rainTypeTmp=[],
    snowTypeTmp=[],
    snowSizeTmp,
    starSizeTmp,
    sunriseH,
    sunriseM,
    sunsetH,
    sunsetM;

var result= [];

// var f = "http://mobile.weather.com.cn/data/forecast/101300103.html";//文件地址
// var f = "http://mobile.weather.com.cn/data/forecast/";//文件地址
var f = "http://aider.meizu.com/app/weather/listWeather?cityIds=" 
var req = (f)=>{
    return new Promise((resolve,reject)=>{
        var data ={};
         http.get(f,function (res) {
            res.setEncoding("utf8");//一定要设置response的编码为binary否则会下载下来的图片打不开
                res.on("data",function (chunk) {
                // var str = chunk.replace(/\ +/g,"");
                // str = chunk.replace(/[\r\n]/g,"");
                // data =  JSON.parse(str);

                try {
                    var str = chunk.replace(/\ +/g,"");
                    // console.log('replace')
                    str = chunk.replace(/[\r\n]/g,"");
                    data =  JSON.parse(str);
                    
                }
                catch(err) {
                    data =  {"code":"200","message":"","redirect":"","value":[{"alarms":[],"city":"杭州","cityid":101210101,"indexes":[{"abbreviation":"ct","alias":"","content":"预计今日天气偏冷，出门穿建议防寒春秋装。着风衣，毛衣，防寒服，大衣等，既舒适，又时尚。","level":"风衣","name":"穿衣指数"},{"abbreviation":"pp","alias":"","content":"预计今日稍有干燥，建议选择保湿性较强的化妆品。","level":"注意保湿","name":"化妆指数"},{"abbreviation":"gm","alias":"","content":"感冒多发期，适当减少外出频率，适量补充水分，适当增减衣物。","level":"多发","name":"感冒指数"},{"abbreviation":"xc","alias":"","content":"预计今日不宜洗车，未来24小时可能有雨或风力较大，如果在此期间洗车，雨水或灰尘可能会再次弄脏您的爱车。","level":"不适宜","name":"洗车指数"},{"abbreviation":"yd","alias":"","content":"预计今日整体气象条件较差，不适宜户外锻炼，建议居家运动。","level":"很不适宜","name":"运动指数"},{"abbreviation":"uv","alias":"","content":"紫外线强度较弱，建议出门前涂擦SPF 在12-15之间、PA+的防晒护肤品。","level":"弱","name":"紫外线强度指数"}],"pm25":{"advice":"0","aqi":"95","citycount":400,"cityrank":32,"co":"1.0","color":"0","level":"0","no2":"73","o3":"15","pm10":"139","pm25":"65","quality":"良","so2":"7","timestamp":"","upDateTime":"2022-01-05 13:45:39"},"provinceName":"浙江省","realtime":{"img":"1","sD":"90","sendibleTemp":"8","temp":"9","time":"2022-01-05 13:45:40","wD":"西北风","wS":"1级","weather":"多云","ziwaixian":"N/A"},"weatherDetailsInfo":{"publishTime":"2022-01-05 13:00:00","weather3HoursDetailsInfos":[{"endTime":"2022-01-05 17:00:00","highestTemperature":"10","img":"1","isRainFall":"","lowerestTemperature":"10","precipitation":"0","startTime":"2022-01-05 14:00:00","wd":"","weather":"多云","ws":""},{"endTime":"2022-01-05 20:00:00","highestTemperature":"8","img":"2","isRainFall":"","lowerestTemperature":"8","precipitation":"0","startTime":"2022-01-05 17:00:00","wd":"","weather":"阴","ws":""},{"endTime":"2022-01-05 23:00:00","highestTemperature":"7","img":"2","isRainFall":"","lowerestTemperature":"7","precipitation":"0","startTime":"2022-01-05 20:00:00","wd":"","weather":"阴","ws":""},{"endTime":"2022-01-06 02:00:00","highestTemperature":"6","img":"2","isRainFall":"","lowerestTemperature":"6","precipitation":"0","startTime":"2022-01-05 23:00:00","wd":"","weather":"阴","ws":""},{"endTime":"2022-01-06 05:00:00","highestTemperature":"5","img":"2","isRainFall":"","lowerestTemperature":"5","precipitation":"0","startTime":"2022-01-06 02:00:00","wd":"","weather":"阴","ws":""},{"endTime":"2022-01-06 08:00:00","highestTemperature":"7","img":"2","isRainFall":"","lowerestTemperature":"7","precipitation":"0","startTime":"2022-01-06 05:00:00","wd":"","weather":"阴","ws":""},{"endTime":"2022-01-06 11:00:00","highestTemperature":"8","img":"2","isRainFall":"","lowerestTemperature":"8","precipitation":"0","startTime":"2022-01-06 08:00:00","wd":"","weather":"阴","ws":""}]},"weathers":[{"date":"2022-01-05","img":"7","sun_down_time":"17:13","sun_rise_time":"06:57","temp_day_c":"10","temp_day_f":"50.0","temp_night_c":"6","temp_night_f":"42.8","wd":"","weather":"小雨","week":"星期三","ws":""},{"date":"2022-01-06","img":"2","sun_down_time":"17:13","sun_rise_time":"06:57","temp_day_c":"10","temp_day_f":"50.0","temp_night_c":"5","temp_night_f":"41.0","wd":"","weather":"阴","week":"星期四","ws":""},{"date":"2022-01-07","img":"2","sun_down_time":"17:13","sun_rise_time":"06:57","temp_day_c":"10","temp_day_f":"50.0","temp_night_c":"5","temp_night_f":"41.0","wd":"","weather":"阴","week":"星期五","ws":""},{"date":"2022-01-08","img":"2","sun_down_time":"17:13","sun_rise_time":"06:57","temp_day_c":"10","temp_day_f":"50.0","temp_night_c":"0","temp_night_f":"32.0","wd":"","weather":"阴","week":"星期六","ws":""},{"date":"2022-01-09","img":"2","sun_down_time":"17:13","sun_rise_time":"06:57","temp_day_c":"11","temp_day_f":"51.8","temp_night_c":"2","temp_night_f":"35.6","wd":"","weather":"阴","week":"星期日","ws":""},{"date":"2022-01-10","img":"1","sun_down_time":"17:13","sun_rise_time":"06:57","temp_day_c":"12","temp_day_f":"53.6","temp_night_c":"2","temp_night_f":"35.6","wd":"","weather":"多云","week":"星期一","ws":""},{"date":"2022-01-04","img":"1","sun_down_time":"17:13","sun_rise_time":"06:57","temp_day_c":"12","temp_day_f":"53.6","temp_night_c":"7","temp_night_f":"44.6","wd":"","weather":"多云","week":"星期二","ws":""}]}]}
                    console.log('error weather get')
                }
                console.log('data', data)
                result = data['value'][0]['weathers'][0];
                wea_name = result['weather']
                wea_today = weatherArr[wea_name]
                console.log('cloudType的索引：',wea_today);
                console.log('cloudType的值',cloudType);
                cloudTypeTmp = cloudType[wea_today]||[],
                
                cloudSizeTmp = cloudSize[[wea_today]]||0,
                cloudNumTmp = cloudNum[wea_today]||0,
                windTmp = wind[wea_today]||0,
                rainTmp = rain[wea_today]||0,
                rainTypeTmp = rainType[wea_today]||[],
                snowTypeTmp = snowType[wea_today]||[],
                snowSizeTmp = snowSize[wea_today]||0,
                starSizeTmp = starSize[wea_today]||0,
                result['sun_down_time'].substring(0,2)
                sunriseH = result['sun_rise_time'].substring(0,2)||"06",
                sunriseM = result['sun_rise_time'].substring(4)||"00",
                sunsetH = result['sun_down_time'].substring(0,2)||"18",
                sunsetM = result['sun_down_time'].substring(4)||"00";
                resolve("get data successfully");


                module.exports = {
                    
                    f,
                    // weaTmp,
                    cloudTypeTmp,
                    cloudSizeTmp,
                    cloudNumTmp,
                    windTmp,
                    rainTmp,
                    rainTypeTmp,
                    snowTypeTmp,
                    snowSizeTmp,
                    starSizeTmp,
                    sunriseH,
                    sunriseM,
                    sunsetH,
                    sunsetM
                }
            });
            res.on("error",function (err) {
                reject("请求失败");
            });
            return "aa";
        }); 
        // console.log('现在应该查完了');
    })
}
module.exports = {
    req,
    f,
    // weaTmp,
    cloudTypeTmp,
    cloudSizeTmp,
    cloudNumTmp,
    windTmp,
    rainTmp,
    rainTypeTmp,
    snowTypeTmp,
    snowSizeTmp,
    starSizeTmp,
    sunriseH,
    sunriseM,
    sunsetH,
    sunsetM
}

//定义风向数组  
// var fxArr={"0":"无持续风向","1":"东北风","2":"东风","3":"东南风","4":"南风","5":"西南风","6":"西风","7":"西北风","8":"北风","9":"旋转风"};   
//定义风力数组  
// var flArr={"0":"微风","1":"3-4级","2":"4-5级","3":"5-6级","4":"6-7级","5":"7-8级","6":"8-9级","7":"9-10级","8":"10-11级","9":"11-12级"};  
// var a = {"c":{"c1":"101010100","c2":"beijing","c3":"北京","c4":"beijing","c5":"北京","c6":"beijing","c7":"北京","c8":"china","c9":"中国","c10":"1","c11":"010","c12":"100000","c13":"116.391","c14":"39.904","c15":"33","c16":"AZ9010","c17":"+8"},
// "f":{"f1":
//   [
//   {"fa":"01","fb":"03","fc":"10","fd":"5","fe":"0","ff":"0","fg":"0","fh":"0","fi":"06:21|17:40"}, 
//   {"fa":"07","fb":"07","fc":"19","fd":"12","fe":"0","ff":"0","fg":"0","fh":"0","fi":"06:22|17:38"},
//   {"fa":"02","fb":"00","fc":"15","fd":"5","fe":"8","ff":"8","fg":"3","fh":"1","fi":"06:23|17:37"},
//   {"fa":"00","fb":"00","fc":"16","fd":"4","fe":"0","ff":"0","fg":"0","fh":"0","fi":"06:24|17:35"},
//   {"fa":"00","fb":"00","fc":"18","fd":"7","fe":"0","ff":"0","fg":"0","fh":"0","fi":"06:25|17:34"},
//   {"fa":"00","fb":"01","fc":"18","fd":"8","fe":"0","ff":"0","fg":"0","fh":"0","fi":"06:26|17:32"},
//   {"fa":"01","fb":"01","fc":"16","fd":"6","fe":"0","ff":"0","fg":"0","fh":"0","fi":"06:27|17:31"}],
// "f0":"201310121100"}};

