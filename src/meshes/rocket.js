import * as THREE from "three";
import * as TWEEN from "../util/Tween";

//创建火箭模型主体
var rocketGroup =new THREE.Group();
function initObject() {
    //车床数据
    var points = [],
        points1 = [];
    for ( var i = 0; i < 10; i ++ ) {
    points1.push( new THREE.Vector2( 3*(Math.sin( i * 0.2 ) *8+1.1) , 3*(( i - 5 ) * 2 )));//小一点的火箭头
    points.push( new THREE.Vector2( 3.5*(Math.sin( i * 0.2 ) *8+1.1) , 3.5*(( i - 5 ) * 2 )));//大一点的火箭头
    }
    //Geometry
    var headGeometry = new THREE.LatheBufferGeometry( points ),
        headGeometryM = new THREE.CylinderBufferGeometry( 31.3,31.3,50,100),//头底部一个小柱体
        headGeometryB = new THREE.CylinderBufferGeometry( 26.5,31.3,10,100),//头底部一个小柱体
        headGeometry1 = new THREE.LatheBufferGeometry( points1 ),

        bodyGeometry = new THREE.CylinderBufferGeometry( 26.5,26.5,702,100),//中间柱体
        bodyGeometry1 = new THREE.CylinderBufferGeometry( 26.5,26.5,500,100),
        ringGeometry = new THREE.CylinderBufferGeometry( 27.5,27.5,20,100),//装饰环
        holderGeometry =  new THREE.CylinderBufferGeometry( 20.5,10.5,25,100),//底部喷嘴
        panelGeometry = new THREE.CylinderBufferGeometry( 12.5,1.5,25,100);//三个翼片
        panelGeometry.thetaLength = Math.PI*87.5/180;
        panelGeometry.thetaStart = Math.PI*45/180; 
       

       // var geometry  =new  THREE.ConeGeometry(30,50,8,1);
       // var geometry  = new THREE.ConeGeometry(100,100,100,10,newfalse,0,Math.PI*3/2)

    //material
    var material = new THREE.MeshPhongMaterial( { color:0xffffff,//用于机身
        shininess:0,
       // specular: 0x101010,
        reflectivity:0,
       // refractionRation:0,
      blending: THREE.NoBlending,     
       transparent: true,

    } ),
        material1 =  new THREE.MeshLambertMaterial(0xffffff);
        material1.transparent = true;
 
        material1.blending =THREE.NoBlending;       

    var materia3 = new THREE.MeshPhongMaterial( { color:0xbf5959 ,//红色装饰
        shininess:10,
       // specular: 0x101010,
        reflectivity:0,
      //  refractionRation:0.5,
        transparent:true,
  
        blending:THREE.NoBlending            
           
    } );
     
    //Mesh
    var headCube =  new THREE.Mesh( headGeometry,material),
        headCube1 = new THREE.Mesh( headGeometry1,material),
        headCube2 = new THREE.Mesh( headGeometry1,material),//两个副头 
        headCubeM = new THREE.Mesh( headGeometryM,material),//中间平滑头
        headCubeB = new THREE.Mesh( headGeometryB,material),//底部圆台头
        bodyCube = new THREE.Mesh(bodyGeometry,material),
        bodyCube1 = new THREE.Mesh(bodyGeometry1,material),
        bodyCube2 = new THREE.Mesh(bodyGeometry1,material),
        holderCube = new  THREE.Mesh(holderGeometry,material1),
        holderCube1 = new  THREE.Mesh(holderGeometry,material1),
        holderCube2 =  new  THREE.Mesh(holderGeometry,material1),
        panelCube = new  THREE.Mesh(panelGeometry,materia3),
        panelCube1 = new  THREE.Mesh(panelGeometry,materia3),
        panelCube2 = new  THREE.Mesh(panelGeometry,materia3),
        ringCube = new THREE.Mesh(ringGeometry,materia3),
        ringCube1 = new THREE.Mesh(ringGeometry,materia3),
        ringCube2 = new THREE.Mesh(ringGeometry,materia3);

    //panelCube.rotation.z = Math.PI*3/2;

    //设置位置
    headCube.position.set(0,-265,0);
    headCube1.position.set(55,0,0);
    headCube2.position.set(-55,0,0);
    headCubeM.position.set(0,-219,0);
    headCubeB.position.set(0,-189,0);
    bodyCube.position.set(0,164,0);
    ringCube.position.set(0,-150,0);//环位置
    ringCube1.position.set(55,25,0);//环位置
    ringCube2.position.set(-55,25,0);//环位置

    bodyCube1.position.set(55,265,0);
    bodyCube2.position.set(-55,265,0);//因为后面的旋转，x和y互换了
    holderCube.position.set(0,525,0);
    holderCube1.position.set(55,525,0);
    holderCube2.position.set(-55,525,0);
    panelCube.position.set(0,495,25);
    panelCube1.position.set(82,495,0);
    panelCube2.position.set(-82,495,0);
    rocketGroup.add(headCube );
    rocketGroup.add(headCube1);
    rocketGroup.add(headCube2);
    rocketGroup.add(headCubeM);
    rocketGroup.add(headCubeB);
    rocketGroup.add(bodyCube);
    rocketGroup.add(bodyCube1);
    rocketGroup.add(bodyCube2);
    rocketGroup.add(holderCube);
    rocketGroup.add(holderCube1);
    rocketGroup.add(holderCube2);
    rocketGroup.add(panelCube);
    rocketGroup.add(panelCube1);
    rocketGroup.add(panelCube2);
    rocketGroup.add(ringCube); 
    rocketGroup.add(ringCube1);   
    rocketGroup.add(ringCube2);         
    rocketGroup.rotation.z = Math.PI*3/2;

   // cube.position = new THREE.Vector3(0,0,1);
  //  rocketGroup.position.set(0,0,0);
   // scene.add(rocketGroup);
}
//每一个火苗的创建
function initFire(){
    var fireGroup = new THREE.Group();
    var material = new THREE.SpriteMaterial( {
        map: new THREE.CanvasTexture( generateSprite() ),
        blending: THREE.AdditiveBlending,//火苗需要addictive不知道为什么
        transparent:true,
 
    } );
    for ( var i = 0; i < 200; i++ ) {

        var particle = new THREE.Sprite( material );

        fireGroup.add(particle);
        initParticle( particle, i * 10 );
    
        }
        return fireGroup;
    // var fireGroup1 =fireGroup.clone();
    // rocketGroup.add(fireGroup1);
    // fireGroup1.position.set(66,556,0);
    // fireGroup1.rotation.z= Math.PI;

        
    }
    //创建三个火苗
function createFire(){
    var fireGroup = initFire();
    fireGroup.rotation.z= Math.PI;
    fireGroup.position.set(0,556,0);
    var fireGroup1 = initFire();
    fireGroup1.rotation.z= Math.PI;
    fireGroup1.position.set(55,556,0);
    var fireGroup2 = initFire();
    fireGroup2.rotation.z= Math.PI;
    fireGroup2.position.set(-55,556,0);
    fireGroup2.rotation.z= Math.PI;
    rocketGroup.add(fireGroup);
    rocketGroup.add(fireGroup1);
    rocketGroup.add(fireGroup2);
}



function generateSprite() {

    //创建canvas并设置大小
    var canvas = document.createElement( 'canvas' );
    canvas.width = 16;
    canvas.height = 16;

    //得到2d，canvas
    var context = canvas.getContext( '2d' );
    //渐变方式
    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );

    gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
    gradient.addColorStop( 0.6, 'rgba(0,255,255,.5)' );
    gradient.addColorStop( 0.8, 'rgba(0,53,169,1)' );
    gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

    // gradient.addColorStop( 0, 'rgba(69,154,192,.01)' );
    // gradient.addColorStop( 0.6, 'rgba(69,154,192,.05)' );
    //  gradient.addColorStop( 0.8, 'rgba(0,53,169,1)' );
    // gradient.addColorStop( 1, 'rgba(195,206,214,0.1)' );
    //填充方式
    context.fillStyle = gradient;
    //填充矩形
    context.fillRect( 0, 0, canvas.width, canvas.height );

    return canvas;

}
/**
 * 粒子 延迟发散
 * @param particle
 * @param delay
 */
function initParticle( particle, delay ) {
    //粒子
    var particle = this instanceof THREE.Sprite ? this : particle;
    var delay = delay !== undefined ? delay : 0;
    //粒子大小以及位置
    particle.position.set( 0, 0, 0 );
// particle.rotation.z = Math.PI*3/2;
    particle.scale.x = particle.scale.y = Math.random() * 32 + 16;
    //下面是一系列的动画
    var xx = Math.random()* 400 -200;
    var yy = -Math.cos((Math.PI/400) * xx)*500;
    //位移
    new TWEEN.Tween( particle.position )
        .delay( delay )
       // .to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
        .to({x:xx,y:yy,z:Math.random()*-100 + 50},3000)
        .start();
    //理解为存活时间    x加一个判断
    if(Math.abs(xx) > 150){//大于150就消失(控制多少)，小于就等会消失(控制火焰大小)，
        new TWEEN.Tween(particle)
            .delay(delay)
            .to({}, 0)
            .onComplete(initParticle)
            .start();
    }else {
        new TWEEN.Tween(particle)
            .delay(delay)
            .to({}, 1000)
            .onComplete(initParticle)
            .start();
    }
    //大小要不断变小，到了焰尾
    new TWEEN.Tween( particle.scale )
        .delay( delay )
        .to( { x: 0.01, y: 0.01 }, 1000 )//也控制火焰的焰尾大小
        .start();
              // particle.rotation.z = Math.PI*3/2;
}
// 创建文字
function createText(font) {
    var text = new THREE.FontLoader().load(font.src, function(text) {
        console.log(font.src);
        var gem = new THREE.TextGeometry('UF', {
            size: 20, //字号大小，一般为大写字母的高度
            height: 0, //文字的厚度
            weight: 'normal', //值为'normal'或'bold'，表示是否加粗
            font: text, //字体，默认是'helvetiker'，需对应引用的字体文件
            style: 'normal', //值为'normal'或'italics'，表示是否斜体
            bevelThickness: 1, //倒角厚度
            bevelSize: 1, //倒角宽度
            curveSegments: 30,//弧线分段数，使得文字的曲线更加光滑
            bevelEnabled: true, //布尔值，是否使用倒角，意为在边缘处斜切
        });
        gem.center();
        var mat = new THREE.MeshPhongMaterial( { color:0x917f7f,
            shininess:30,
           // specular: 0x101010,
            reflectivity:0,
        //    refractionRation:1 ,
           blending: THREE.NoBlending , 
           transparent:true,
          depthWrite: false,
          depthTest: false,

        
        } );
        var textObj = new THREE.Mesh(gem, mat);
        textObj.castShadow = true;
        textObj.position.set(0,-200,35);
        rocketGroup.add(textObj);
        textObj.rotation.z = Math.PI*1/2;
    });//不懂为什么要用回调函数
    var text1 = new THREE.FontLoader().load(font.src, function(text) {
        var gem1 = new THREE.TextGeometry('LOG IN', {
            size: 40, //字号大小，一般为大写字母的高度
            height: 10, //文字的厚度
            weight: 'normal', //值为'normal'或'bold'，表示是否加粗
            font: text, //字体，默认是'helvetiker'，需对应引用的字体文件
            style: 'normal', //值为'normal'或'italics'，表示是否斜体
            bevelThickness: 1, //倒角厚度
            bevelSize: 1, //倒角宽度
            curveSegments: 30,//弧线分段数，使得文字的曲线更加光滑
            bevelEnabled: true, //布尔值，是否使用倒角，意为在边缘处斜切
        });
        gem1.center();
        var mat = new THREE.MeshPhongMaterial( { color:0x33ccff,
            shininess:30,
           // specular: 0x101010,
            reflectivity:0,
        //    refractionRation:1 ,       
           transparent:true,

            blending: THREE.NoBlending   ,    
           depthWrite: false,
           depthTest: false,
  
        } );
        var textObj = new THREE.Mesh(gem1, mat);
        textObj.castShadow = true;
        textObj.position.set(0,300,25);
        rocketGroup.add(textObj);
        textObj.rotation.z = Math.PI*1/2;

    });
}


// function threeStart() {
//     initThree();
//     initCamera();
//     initScene();
    
//     setLights();
//     initLight();
//     createFire();
//     initObject();

//  //   createText();
   

//     animation();

// }

// function rocketObj(font){
//     console.log('rocket ok');
//     console.log(font.src);
// 	createFire();
//     initObject();
//     createText(font);
// 	return rocketGroup;
// }

function resizeRocket(){
    rocketGroup.scale.x = rocketGroup.scale.y = 0.48;
    rocketGroup.position.set(-20,-160,300);

}
export default function createRocket(font){

    resizeRocket();
    console.log('rocket ok');
   //` console.log(font.src);
	createFire();
    initObject();
    createText(font);
   // console.log('in rocket rocketGroup is '+typeof rocketGroup);5

	return rocketGroup;
}



