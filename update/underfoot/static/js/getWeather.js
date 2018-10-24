
// var weatherList ={};
// console.log('当前位置信息',returnCitySN['cip']+returnCitySN['cname']);
// $.ajax({
//     url:'/weather',
//     data:{
//         Request:"POST",
//         cityName:returnCitySN['cname'],
//     },
//     type:'POST',
//     dataType: "json",
//     success:function(data){
//         if(data){
//             weatherList = data;
//             if(weatherList)  for(let i in weatherList) console.log(i);
//             else console.log('can\'t pass through');
//             console.log("i got the data");
//         }
//         else//等会替换成默认的设置，这块先检错
//             // window.location.href = IndexPage;
//             console.log("出错了，没拿到数据");
//     }
// });

// export {
//     weatherList
// }