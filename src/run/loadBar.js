import $ from "jquery";
var particle_no = 25;
//更新动画的兼容
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     ||  
    function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();
//
var canvas = document.getElementsByTagName("canvas")[0];
var loadTag = document.getElementById("load-tag"); 
var ctx = canvas.getContext("2d");

var counter = 0;
var countLoop = 0;
var particles = [];
var w = 400, h = 200;
canvas.width = w;
canvas.height = h;
var count = 0;

//重置初始位置和颜色
function reset(){
  ctx.fillStyle = "#272822";//大一点框
  ctx.fillRect(0,0,w,h);
  
  ctx.fillStyle = "#9b9ba3";
  ctx.fillRect(25,80,350,25);//度条
  // ctx.font="2rem Arial";
  //   ctx.fillStyle="#9b7a44"
// ctx.fillText("Loading",40,40);
}

function progressbar(){
  this.widths = 0;
  this.hue = 0;
  
  this.draw = function(){
    ctx.fillStyle = "#ffc";
    ctx.fillRect(25,80,this.widths,25);
    var grad = ctx.createLinearGradient(0,0,0,130);
    grad.addColorStop(0,"transparent");//从亮到暗的一个渐变从，和createGradient结合，0->1 表示相应的百分比位置，
 // gradient.addColorStop("0","magenta");
// gradient.addColorStop("0.5","blue");
// gradient.addColorStop("1.0","red");
    grad.addColorStop(1,"rgba(0,0,0,0.6)");
    ctx.fillStyle = grad;
    ctx.fillRect(25,80,this.widths,25);
  }
}

function particle(){
  this.x = 23 + bar.widths;
  this.y = 82;
  
  this.vx = 0.8 + Math.random()*1;//横向移动速度  0.8-1.8
  this.v = Math.random()*5;                     //0-5 
  this.g = 2 + Math.random()*3;//自己定义加速度   2-5
  this.down = false;//是否在下方了

  
  this.draw = function(){
    ctx.fillStyle = '#9b9ba3';
    var size = Math.random()*3;
    ctx.fillRect(this.x, this.y, size, size);
  }
}

var bar = new progressbar();

function draw(){
  reset();
  counter++
  
  bar.hue += 0.8;
  
  bar.widths += 2;
  if(bar.widths > 350){//进度条慢了
    if(counter > 215){//counter计数大于215就重俩一遍
      reset();
      bar.hue = 0;
      bar.widths = 0;
      counter = 0;
      particles = [];
    }
    else{
      bar.hue = 126;
      bar.widths = 351;
      bar.draw();
    }
  }
  else{
    bar.draw();
    for(var i=0;i<particle_no;i+=10){
      particles.push(new particle());
    }
  }
  update();
}

function update(){
  for(var i=0;i<particles.length;i++){
    var p = particles[i];
    p.x -= p.vx; //给抛出去的粒子向左的惯性
    if(p.down == true){
      p.g += 0.1;
      p.y += p.g;
    }
    else{
      if(p.g<0){  //后来p.g小于0  就切换成直接下降+负值
        p.down = true;
        p.g += 0.1;
        p.y += p.g;
      }
      else{  //开始 p.g大于0 y要不断减少 ，g也减少
        p.y -= p.g;
        p.g -= 0.1;
      }
    }
    p.draw();
  }
}
var flag;
function countTag(el,toValue){
  //清除上一次的interval
    clearInterval(flag);
    console.log('let"s count',el.text());
    var flag = setInterval(function(){
    if(parseInt(el.text())>=toValue){
        clearInterval(flag);
    }
    el.text(count+'%');
    count++;

    },30);

  return false;
}

function animloop() {
  countLoop += 1 ;
  draw();
  requestAnimFrame(animloop);
  if(!(countLoop%80))
    loadTag.style.cssText="color:transparent; text-shadow:0 0 .1em white, 0 0 .3em white;";
  else if(!(countLoop%40))
    loadTag.style.cssText="color:#ffc;text-shadow:0 0 .1rem ,0 0 .3rem;";
}
// countTag($("#load-count"),100);
// animloop();
export{
    animloop,
    countTag

}
