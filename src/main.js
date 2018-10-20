import "./css/normalize.min.css";
import "./css/layout.css";
import "./css/socialicons.css"

import * as fp from "lodash/fp"
import * as THREE from "three";
import consts from "./consts";
import $ from "jquery";
import Vue from "vue";
import VeeValidate from   "vee-validate"

// import projector  from"./util/Projector"; 
// import {dataMap} from "./dataMap";
// import {checkDistance}from "./threed";
import {
    innerEarth,
    earthMap,
    earthBuffer,
    outerEarth,
    universe,
    createRings,
    spike,
    createRocket,
    createCitys,
} from "./meshes"
import {
    checkIn,
    autoAdapt,
    countTag,
    animloop
}from"./run"
import {
    deviceSettings,
    cacheImages,
    cacheFonts,
    colorMix,
    interpolation,
    TWEEN,
    latLongToVector3,
} from "./util";
import TrackballControls from "./util/TrackballControls";

import State from "./util/state"

let {
    innerWidth: WIDTH,
    innerHeight: HEIGHT
} = window,
 {
    scene,
cameraMaxView,
    camera,
    cameraTarget,
    globeMaxZoom,
    globeMinZoom,
    targetCameraZ,

    renderer,


    rotationObject,


    globeRadius,
    earthObject,
    toRAD,

    mouse,

    mouse: {
        isMouseDown,
        mouseXOnMouseDown,
        mouseYOnMouseDown,
        targetRotationX,
        targetRotationY,
        targetRotationXOnMouseDown,
        targetRotationYOnMouseDown,
        mouseXOnWorldCS, //世界坐标系下的x,y坐标
        mouseYOnWorldCS
    },
    touch,
    touch:{
        isTouchDown,
        touchXOnTouchDown,
        touchYOnTouchDown,
        targetRotationXOnTouchDown,
        targetRotationYOnTouchDown,
        touchDisOnTouchDown,
        touchDisOnTouchMove,
        touchXOnWorldCS,
        touchYOnWorldCS
    },


} = consts,

container = document.getElementById("interactive"), trackballControls,
    state = new State();
var rocketObj;
document.body.appendChild(state.dom);

$( ()=> init().then(function(){console.log('end the init')}));
async function init() {
    //auto adapt to the window
    autoAdapt();
    //load bar
    countTag($("#load-count"),60);
    animloop();
    // $("#load-bar").css("display","none");

    // $("#interactive").css("display","block");

    let cacheF = cacheImages();
    let cacheF1 = cacheFonts();
    let imgs = await cacheF();
    // container.style.background = imgs[5];
    // document.getElementsByTagName('body').setAttribute('backgoround', 'red');
  // container.style.background =url()
    let universeUrl = imgs[5];
    console.log("地址：", 'background: url('+universeUrl.src+') top  fixed no-repeat; background-size:40px 40px ');
    container.setAttribute('style', 'background: url('+universeUrl.src+')center  fixed no-repeat;  ');

    let _initStage = fp.flow(setScene, setCamera, setRender, setLights, animate);
    
    _initStage();
    initDomEvent();
    checkIn();
    let fonts = await cacheF1();

    countTag($("#load-count"),80);

    /*    let images = ["dot-inverted.png", "earth-glow.jpg",
        "map_inverted.png", "map.png",
        "star.jpg", "universe.jpg"
    ];*/
    let earthRotation = setEarthObject();
    earthRotation.add(innerEarth());
    earthRotation.add(earthMap (imgs[3]));//每个img都是一个dom元素，传进去通过.src获取路径
    earthRotation.add(earthBuffer(imgs[2]));
    //    let fonts = ["gentilis_bold.typeface.json","gentilis_regular.typeface.json",
   // "helvetiker_regular.typeface.json","optimer_bold.typeface.json","optimer_regular.typeface.json"];
   var cityObj = createCitys(fonts[3]);
    earthRotation.add(cityObj);
  //  earthRotation.add(outerEarth(imgs[1]))//地球外面的一些装饰和光
    // console.log(cityObj);
  //  await scene.add(universe(imgs[5]))
    rocketObj = createRocket(fonts[2]);
    rocketObj.name = "Rocket";
    console.log('before await');
    scene.add(rocketObj);
    console.log('after await');
    //   await scene.add(createRsings());
    earthRotation.add(spike());//那个中央环
    scene.add(earthRotation);
    // await scene.add(createRings());//多层环，no need
   console.log('ok after add');
   countTag($("#load-count"),99);
   var watchInt = setInterval(function(){
       if($("#load-count").text()=="100%"){
            $("#load-bar").css("display","none");
            $("#interactive").css("display","block");
            clearInterval(watchInt);
       }
   },1000)


}

function setScene() {
    scene = new THREE.Scene();
   // scene.fog = new THREE.Fog(0x000000, 0, 500);
    console.log(scene)
}
function initDomEvent(){
    console.log('initDomeEventNow');
    window.addEventListener('resize', onWindowResize, false);
    document.getElementById("interactive").addEventListener('mousewheel', onMouseWheel, false);
    document.getElementById("interactive").addEventListener('mousedown', onMouseDown, false);
    document.getElementById("interactive").addEventListener('mousemove', onMouseMove, false);
    document.getElementById("interactive").addEventListener('mouseup', onMouseUp, false);
    document.getElementById("interactive").addEventListener('mouseleave', onMouseLeave, false);
    
    document.getElementById("interactive").addEventListener('touchstart', onTouchDown, false);
    document.getElementById("interactive").addEventListener('touchmove', onTouchMove, false);
    document.getElementById("interactive").addEventListener('touchcancel', onTouchLeave, false);
    document.getElementById("interactive").addEventListener('touchend', onTouchUp, false);
}
function setCamera() {
    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, cameraMaxView);//可能是因为相机是透视的，所以不能完全遮盖住
    //var camera = new THREE.OrthographicCamera( WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 1, cameraMaxView );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = targetCameraZ;
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    console.log(camera.position.z);
 //   console.log("this is ok");
//console.log('camera aspect:'+camera.aspect);
    //trackballControls = new TrackballControls(camera)
}

function setRender() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true //透明的话，画布就可以可以显示出css
    });
    //  renderer.sortObjects = true;

    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xffffff, 0);  //
    container.appendChild(renderer.domElement);


  //
//  renderer.sortObjects = true;
    camera.position.set(0,0,0);

   // renderer1.setClearColor(0xFFFFFF, 1.0);

 //   container.appendChild(renderer1.domElement);
   //
// //第一个参数是剔除哪个面  CullFaceNone 不剔除 CullFaceBack剔除后面 CullFaceFront 前面 CullFaceFrontBack都
// //第二个指定顺时针还是逆时针  CCW是 counter-clock-wise逆时针 
}
var light;
function setLights() {
    let colorBase = new THREE.Color(new THREE.Color(consts.colorPrimary));
    let {
        lights: {
            lightShieldIntensity,
            lightShieldDistance,
            lightShieldDecay
        }
    } = consts;

    // let lightShield1 = new THREE.PointLight(colorBase,
    //     lightShieldIntensity, lightShieldDistance, lightShieldDecay);
    // lightShield1.position.x = -50;
    // lightShield1.position.y = 150;
    // lightShield1.position.z = 75;
    // lightShield1.name = 'lightShield1';
    // scene.add(lightShield1);

    // let lightShield2 = new THREE.PointLight(colorBase,
    //     lightShieldIntensity, lightShieldDistance, lightShieldDecay);
    // lightShield2.position.x = 100;
    // lightShield2.position.y = 50;
    // lightShield2.position.z = 50;
    // lightShield2.name = 'lightShield2';
    // scene.add(lightShield2);

    // let lightShield3 = new THREE.PointLight(colorBase,
    //     lightShieldIntensity, lightShieldDistance, lightShieldDecay);
    // lightShield3.position.x = 0;
    // lightShield3.position.y = -300;
    // lightShield3.position.z = 50;
    // lightShield3.name = 'lightShield3';
    // scene.add(lightShield3);

    light = new THREE.DirectionalLight(0xFFFFFF,0.91);
    light.position.set(0, 0, 1000);
    scene.add(light);
   
}


function setEarthObject() {
    rotationObject = new THREE.Group();
    rotationObject.name = 'rotationObject';
    rotationObject.rotation.x = targetRotationX;
    rotationObject.rotation.y = targetRotationY;

    // earthObject = new THREE.Group();
    // earthObject.name = 'earthObject';
    // earthObject.rotation.y = -90 * toRAD;
    // rotationObject.add(earthObject);

    return rotationObject

}

function addAxis() {
    scene.add(new THREE.AxesHelper(600))
}

function animate() {
    requestAnimationFrame(animate);
    render();

}

function render() {
 renderer.render(scene, camera);
    TWEEN.update();
   // renderer1.setFaceCulling(THREE.CullFaceBack,THREE.FrontFaceDirectionCW);//剔除正面或者反面
    //trackballControls.update();
    state.update()
    // console.log(scene.getObjectByName("rotationObject"));
    if (targetCameraZ < globeMaxZoom) {targetCameraZ = globeMaxZoom;cameraMaxView=targetCameraZ*0.93;}
    if (targetCameraZ > globeMinZoom) {targetCameraZ = globeMinZoom;cameraMaxView=targetCameraZ*0.93;}

    // camera.position.z = interpolation(camera.position.z, targetCameraZ, 0.1);
    camera.position.z = targetCameraZ;

    // if (targetRotationX > 75 * toRAD) targetRotationX = 75 * toRAD;
    // if (targetRotationX < -75 * toRAD) targetRotationX = -75 * toRAD;

    if (scene.getObjectByName("rotationObject")&&!isMouseDown&&!isTouchDown) {

        rotationObject.rotation.y +=0.005;

    }
    camera.updateProjectionMatrix();

    if (isMouseDown) return;
  //var globeEarthObject=  scene.getObjectByName("rotationObject")

    // //targetRotationY += 0.002
    // rotationObject.rotation.z +=0.1;
    // rotationObject.rotation.y +=0.1;
    // rotationObject.rotation.x +=0.1;


}

function onWindowResize() {
    let {
        innerWidth: width,//就是把window的innerWidth传给width变量
        innerHeight: height
    } = window
    // console.log(window.innerWidth);
    // console.log(window.innerHeight);
    // console.log(camera.aspect);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

function onMouseWheel(event) {
    event.preventDefault();
    targetCameraZ -= event.wheelDeltaY * 0.5;
    cameraMaxView=targetCameraZ*0.83;//和targetCameraZ一致
    camera.far = cameraMaxView;//- Math.pow(cameraMaxView,2)*0.2 ;//保证能看到的只有半个球
    camera.updateProjectionMatrix();//更改了camera参数必须使用这个更新
    //globeRadius += cameraMaxView*0.93;
}


function onMouseDown(event) {
    event.preventDefault();
    isMouseDown = true;
        //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
    mouseXOnMouseDown = event.clientX - WIDTH / 2;
    mouseYOnMouseDown = event.clientY - HEIGHT / 2;
    console.log('event.clientX:',event.clientX);
    console.log('event.clientY',event.clientY);
    targetRotationXOnMouseDown = targetRotationX;
    targetRotationYOnMouseDown = targetRotationY;
    
    
    //在世界坐标系下的按下坐标
    mouseXOnWorldCS = (event.clientX/WIDTH)*2-1;
    mouseYOnWorldCS = -(event.clientY/HEIGHT)*2+1;
  /*  推导过程：
    设A点为点击点(x1,y1),x1=e.clintX, y1=e.clientY
    设A点在世界坐标中的坐标值为B(x2,y2);
    
    由于A点的坐标值的原点是以屏幕左上角为(0,0);
    我们可以计算可得以屏幕中心为原点的B'值
    x2' = x1 - innerWidth/2
    y2' = innerHeight/2 - y1
    又由于在世界坐标的范围是[-1,1],要得到正确的B值我们必须要将坐标标准化
    x2 = (x1 -innerWidth/2)/(innerwidth/2) = (x1/innerWidth)*2-1
    同理得 y2 = -(y1/innerHeight)*2 +1*/


   
    
}

function onMouseMove(event) {
    if (!isMouseDown) return

    let mouseX = event.clientX - WIDTH / 2
    let mouseY = event.clientY - HEIGHT / 2;

    targetRotationX = targetRotationXOnMouseDown + (mouseY - mouseYOnMouseDown) * .0025;
    targetRotationY = targetRotationYOnMouseDown + (mouseX - mouseXOnMouseDown) * .0025;
    rotationObject.rotation.x = interpolation(rotationObject.rotation.x, targetRotationX, .1);
    rotationObject.rotation.y = interpolation(rotationObject.rotation.y, targetRotationY, .1);
   // rotationObject.rotation.y 
}

function onMouseUp(event) {
    event.preventDefault();
    isMouseDown = false;
    console.log('mouseup');

    //检测按下登录键  按下和弹起时都在火箭主体内就可以
    let mouseXOnMouseUp = (event.clientX/WIDTH)*2-1;
    let mouseYOnMouseUp = -(event.clientY/HEIGHT)*2+1;

        //根据照相机，把这个向量转换到视点坐标系
        var vectorUp = new THREE.Vector2(mouseXOnMouseUp,mouseYOnMouseUp);
        var vectorDown = new THREE.Vector2(mouseXOnWorldCS,mouseYOnWorldCS);
        var raycasterDown = new THREE.Raycaster();
        var raycasterUp = new THREE.Raycaster();
        // var raycasterDown = new THREE.Raycaster(camera.position,vectorDown.sub(camera.position).normalize());
        // var raycasterUp = new THREE.Raycaster(camera.position,vectorUp.sub(camera.position).normalize());
        //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
       raycasterUp.setFromCamera(vectorUp,camera);
       raycasterDown.setFromCamera(vectorDown,camera);

      //  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        //射线和模型求交，选中一系列直线
            var intersectsUp = raycasterUp.intersectObjects(rocketObj.children);//不知道为什么用scene就是识别不了rocketOBj
            var intersectsDown = raycasterDown.intersectObjects(rocketObj.children);
            // console.log('scene.children',rocketObj.children);
            // console.log( intersectsUp[0]);
            // console.log(intersectsDown);
            // console.log("当前点击（x,y）:",event.clientX,event.clientY);
            // console.log("火箭位置(x,y):",rocketObj.position.x,rocketObj.position.y);
        if (intersectsDown.length>0 && intersectsUp.length>0 ) {
            $(".checkin-content").css("display","block");
            $("#login-content").css("display","block");
                //'选中第一个射线相交的物体'
                console.log('intersect the rocket');
                // var a = $("checkin-content").css("display");
                // console.log(a);
                console.log('what"s');
                // $("#login-content").css("display","block");
            }
   
}

function onMouseLeave(event) {
    event.preventDefault();
    if (isMouseDown) {
        isMouseDown = false;
    }
    console.log('mouseleave');
}

function onTouchScale(scaleDis) {
    isTouchDown = true;
    targetCameraZ -= scaleDis * 0.3;
    cameraMaxView=targetCameraZ*0.93;//和targetCameraZ一致
    camera.far = cameraMaxView;//保证能看到的只有半个球
    camera.updateProjectionMatrix();//更改了camera参数必须使用这个更新
}


function onTouchDown(event){
	event.preventDefault();
		isTouchDown = true;

		touchXOnTouchDown = event.changedTouches[0].clientX - WIDTH/2;//对应原点在中心的坐标系
		touchYOnTouchDown = event.changedTouches[0].clientY - HEIGHT/2;
		targetRotationXOnTouchDown = targetRotationX;
        targetRotationYOnTouchDown = targetRotationY;
      //  console.log('event.clientX:',event.changedTouches[0].clientX);
      //  console.log('event.clientY',event.changedTouches[0].clientY);
    //处理缩放
    touchDisOnTouchDown = 0;
    console.log('touch count',event.touches.length);
    if(event.touches.length>=2){
        
        for(let i = 1 ;i < event.touches.length; i++){
            //计算距离
            touchDisOnTouchDown +=Math.pow( Math.pow(event.touches[i].clientX-event.touches[i-1].clientX,2)+Math.pow(event.touches[i].clientY-event.touches[i-1].clientY,2),0.5);
            //console.log('event.touches[i-1].clientX',event.touches[i-1].clientX);
            console.log('down: event.touches[i].clientX',(event.touches[i].clientX));
        }
        
        console.log('whats"s wrong');
        console.log('touchDisOnTouchDown',touchDisOnTouchDown);
    }
    console.log('touchDown');
 
 
  //  console.log('targetRotationXOnTouchDown:',targetRotationXOnTouchDown);
   // console.log('targetRotationYOnTouchDown',targetRotationYOnTouchDown);
   touchXOnWorldCS = (event.changedTouches[0].clientX/WIDTH)*2-1;
   touchYOnWorldCS = -(event.changedTouches[0].clientY/HEIGHT)*2+1;
}
function onTouchMove(event){
    if(!isTouchDown) return
    if(event.touches.length==1){
	let touchX = event.changedTouches[0].clientX - WIDTH/2;
	let touchY = event.changedTouches[0].clientY - HEIGHT/2;
	targetRotationX = targetRotationXOnTouchDown + (touchY - touchYOnTouchDown) * .0065;//后半部分是偏移的，从按下到每次移动的点
    targetRotationY = targetRotationYOnTouchDown + (touchX - touchXOnTouchDown) * .0065;
    // console.log('targetRotationXOnTouchDown:',targetRotationXOnTouchDown);
    // console.log('targetRotationYOnTouchDown',targetRotationYOnTouchDown);
    // console.log('targetRotationX',targetRotationX);
    // console.log('targetRotationY',targetRotationY);
    rotationObject.rotation.x = interpolation(rotationObject.rotation.x, targetRotationX, .1);
    rotationObject.rotation.y = interpolation(rotationObject.rotation.y, targetRotationY, .1);
  //  console.log('rotationObject.rotation.x ',rotationObject.rotation.x );
  //  console.log(' rotationObject.rotation.y ', rotationObject.rotation.y );
    console.log('touchmove')
    }
    //处理缩放问题
    if(event.touches.length>=2 && isTouchDown){//必须大于两个点并且正在触摸，否则失去意义
        touchDisOnTouchMove = 0 ;
        for(let i = 1 ;i < event.touches.length; i++){
            //计算距离
            touchDisOnTouchMove  +=Math.pow( Math.pow(event.touches[i].clientX-event.touches[i-1].clientX,2)+Math.pow(event.touches[i].clientY-event.touches[i-1].clientY,2),0.5);
            console.log('move: (event.touches[i].clientX:',event.touches[i].clientX);
        }
        onTouchScale(touchDisOnTouchMove-touchDisOnTouchDown);
    }
    
    console.log('move count',event.touches.length);
    console.log('touchDisOnTouchMove',touchDisOnTouchMove);

}
function onTouchUp(event) {
    console.log("event",event);
    event.preventDefault();
    isTouchDown = false;
    console.log('touchup');
    //检测按下登录键  按下和弹起时都在火箭主体内就可以
    console.log('up x',event.changedTouches[0].clientX);
    console.log('up y',event.changedTouches[0].clientY);
    let touchXOnTouchUp = (event.changedTouches[0].clientX/WIDTH)*2-1;
    let touchYOnTouchUp = -(event.changedTouches[0].clientY/HEIGHT)*2+1;
    var vectorUp = new THREE.Vector2(touchXOnTouchUp,touchYOnTouchUp);
    var vectorDown = new THREE.Vector2(touchXOnWorldCS,touchYOnWorldCS);
    console.log(vectorUp);
    console.log(vectorDown);
    var raycasterDown = new THREE.Raycaster();
    var raycasterUp = new THREE.Raycaster();
    raycasterUp.setFromCamera(vectorUp,camera);
    raycasterDown.setFromCamera(vectorDown,camera);

        //射线和模型求交，选中一系列直线
            var intersectsUp = raycasterUp.intersectObjects(rocketObj.children);//不知道为什么用scene就是识别不了rocketOBj
            var intersectsDown = raycasterDown.intersectObjects(rocketObj.children);
             console.log('scene.children',rocketObj.children);
             console.log( intersectsUp);
             console.log(intersectsDown);
            // console.log("当前点击（x,y）:",event.clientX,event.clientY);
            // console.log("火箭位置(x,y):",rocketObj.position.x,rocketObj.position.y);
        if (intersectsDown.length>0 && intersectsUp.length>0 ) {
                //'选中第一个射线相交的物体'
                console.log('intersect the rocket');
                $(".checkin-content").css("display","block");
                $("#login-content").css("display","block");
                // console.log($('#checkin-content').css());

            }

}

function onTouchLeave(event) {
    event.preventDefault();
    if (isTouchDown) {
        isTouchDown = false;
    }
    console.log('touchleave');
}