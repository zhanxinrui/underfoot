$(()=>{
  var numData = [
    "1111/1001/1001/1001/1001/1001/1111", //0
    "0001/0001/0001/0001/0001/0001/0001", //1
    "1111/0001/0001/1111/1000/1000/1111", //2
    "1111/0001/0001/1111/0001/0001/1111", //3
    "1001/1001/1001/1111/0001/0001/0001", //4
    "1111/1000/1000/1111/0001/0001/1111", //5
    "1111/1000/1000/1111/1001/1001/1111", //6
    "1111/0001/0001/0001/0001/0001/0001", //7
    "1111/1001/1001/1111/1001/1001/1111", //8
    "1111/1001/1001/1111/0001/0001/1111", //9
    "0000/0000/0010/0000/0010/0000/0000" //:
  ]

  var canvas = document.getElementById("cas"),
      bgcanvas = document.getElementById("bgcas"),
      ctx = canvas.getContext('2d');
  var P_radius = 2, Gravity = 9.8;
  var Particle = function() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.color = "";
    this.newColor = "";
    this.visible = false;
    this.drop = false;
  }
  var lastColor;
  Particle.prototype = {
    constructors: Particle,
    paint: function() {		//绘制自身
      if (lastColor !== this.color) {
        ctx.fillStyle = lastColor = this.color;
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
    },
    reset: function(x, y, color) {		//重置
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.color = color;
      this.visible = true;
      this.drop = false;
      this.radius = 0;
    },
    isDrop: function() {		//落下
      this.drop = true;
      var vx = Math.random() * 15 + 10
      var vy = -Math.random() * 50 + 10;
      this.vx = Math.random() >= 0.5 ? -vx : vx;
      this.vy = vy;
    },
    update: function(time,newColor) {		//每一帧的动作
      // let colors = ["#FF0000","#FF7F00","#FFFF00","#00FF00","#00FFFF","#0000FF","#8B00FF"]
      
      if (this.drop) {

        if(this.newColor==""){
          this.color = newColor;
          this.newColor = newColor;
        }

        else
          this.color = this.newColor
      this.radius = 3;


      // 红色 #FF0000
      // 橙色 #FF7F00
      // 黄色 #FFFF00
      // 绿色 #00FF00
      // 青色 #00FFFF
      // 蓝色 #0000FF
      // 紫色 #8B00FF
        this.x += this.vx * time;
        this.y += this.vy * time;

        var vy = this.vy + Gravity * time;

        if (this.y >= canvas.height - P_radius) {
          this.y = canvas.height - P_radius
          vy = -vy * 0.8;
        }

        this.vy = vy;

        if (this.x < -P_radius || this.x > canvas.width + P_radius || this.y > canvas.height + P_radius) {
          this.visible = false;
        }
      }

      if (this.radius < P_radius) {
        this.radius += 0.5;
      }
    }
  }

  window.RAF = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  var timeCount_0 = 0, timeCount_1 = 0, particles = [];
  function initAnimate() {
    for (var i = 0; i < 200; i++) {
      var p = new Particle();
      particles.push(p);
    }

    timeCount_0 = new Date();
    timeCount_1 = new Date();

    // drawBg();

    setTime(timeCount_0);
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var timeCount_2 = new Date();

    if (timeCount_1 - timeCount_0 >= 1000) {
      setTime(timeCount_1);
      timeCount_0 = timeCount_1;
    }

    particles.forEach(function(p) {
      let colors = ["#FF0000","#FF7F00","#FFFF00","#00FF00","#00FFFF","#0000FF","#8B00FF"];
      newColor = colors[Math.floor(Math.random()*7)];
      if (p.visible) {
        p.update(16 / 60,newColor);
        p.paint();
      }
    });

    timeCount_1 = timeCount_2;

    RAF(animate)
  }


  var X_J = 2;       //圆点间距
  var xjg = 5;       //各个字母之间的距离
  var yjg = 5;       //每一栏上下距离

  var lastDate;
  function setTime(time) {
    var h = time.getHours() + "",
        m = time.getMinutes() + "",
        s = time.getSeconds() + "";
    h = h.length === 1 ? "0" + h : h;//一位的话补充
    m = m.length === 1 ? "0" + m : m;
    s = s.length === 1 ? "0" + s : s;

    var nowdate = h + ":" + m + ":" + s;

    var color = "";
    var i = 0;

//        跟上一次的时间进行比较，获取改变的字符点
    if (lastDate) {
      for (var k = 0; k < nowdate.length; k++) {
        if (lastDate.charAt(k) !== nowdate.charAt(k)) {
          i = k;
          break;
        }
      }
    }
    lastDate = nowdate;

    var tx = (canvas.width - ((P_radius * 2 + X_J) * 4 * 8 + 7 * xjg)) / 2; //计算时间的x轴值
    var ty = (canvas.height - ((P_radius + yjg) * 6)) / 2;  //计算时间的y轴值
//        遍历时间字符
    for (; i < nowdate.length; i++) {
      var charX = tx + i * (xjg + 4 * (P_radius * 2 + X_J));   //计算该字符的X轴值
      var charY = ty;

      var timeChar = nowdate.charAt(i);
      var text = numData[timeChar === ":" ? 10 : +timeChar];     //获取该字符的映射表

      if (i < 3) {
        color = "#fff";
      } else if (i < 6) {
        color = "#fff";
      } else {
        color = "#fff";
      }

      for (var j = 0; j < text.length; j++) {
        var tt = text.charAt(j);
        if (tt === "/") {
          charY += yjg;
        } else {
          var x = charX + j % 5 * (P_radius * 2 + X_J);
          var y = charY;
          var pp = null;
          var usefullp = null;
          // var uselessp = null;
          for (var ref = 0; ref < particles.length; ref++) {
            var p = particles[ref];
            if (p.visible && p.x === x && p.y === y) {
              pp = p;
            } else if (!p.visible && !usefullp) {
              usefullp = p;
            }
          }
          if (pp && tt == 0) {
            pp.isDrop();

          } else if (!pp && tt == 1) {
            usefullp.reset(x, y, color);
          }
        }
      }
    }
  }

    initAnimate();
});
