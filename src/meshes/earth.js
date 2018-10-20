import * as THREE from "three";
import {
    colorMix,
    generateRandomNumber,
    latLongToVector3
} from "../util"
import consts from "../consts";
let _geometry = new THREE.SphereBufferGeometry(consts.globeRadius, 64, 64);
let _geometry1 = new THREE.SphereBufferGeometry(consts.globeRadius,64,64);
//var _geometry1 = new THREE.CylinderBufferGeometry( 100, 100, 80, 32 );
_geometry.openEnded = false;
//function coreEarth()
// function innerCore() {
//     let _material = new THREE.MeshPhongMaterial({
//         color: new THREE.Color(0xFF0000),
//         transparent: true,
//         blending: THREE.AdditiveBlending
//     });

//     return new THREE.Mesh(_geometry1, _material)
// }
//function coreEarth()
function innerEarth() {
    let _material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colorMix(.65)),
    //    color: new THREE.Color(0xffff00),
        transparent: true,
        blending: THREE.NoBlending,
        side: THREE.FrontSide,
        opacity: 1,
    //fog: true,
        depthWrite: false,
        depthTest: false,
   //     renderOrder:1
    });
    let EarthObj = new THREE.Mesh(_geometry, _material);
    EarthObj.name = "innerEarth";
    EarthObj.position.set(0,0,0);
    return EarthObj;
}

/*    let images = ["dot-inverted.png", "earth-glow.jpg",
        "map_inverted.png", "map.png",
        "star.jpg", "universe.jpg"
    ];*/
function earthMap(img) {//map.png
    let _texture, _material;
    _texture = new THREE.TextureLoader().load(img.src);

    _texture.anisotropy = 16; //各向异性过滤。使用各向异性过滤能够使纹理的效果更好，但是会消耗更多的内存、CPU、GPU时间。
    _material = new THREE.MeshBasicMaterial({
        map: _texture,
        color: new THREE.Color(colorMix(.75)),//就是地图的颜色混合的均匀与否
      //  color:new THREE.Color(0x000000),
        transparent: true, 
    //opacity: 1,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
        fog: false,
        depthWrite: false,
        depthTest: false,
      //  renderOrder:2,
    });
    _material.needsUpdate = true;
    let earthMapObj =  new THREE.Mesh(_geometry1, _material);
    earthMapObj.name = "earthMap";
    earthMapObj.position.set(0,0,0);
    return earthMapObj;
}

function earthBuffer(img) {//就是那些小方块 map_inverted.png
    let globeCloudVerticesArray = [],
        globeCloud;
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < imageData.data.length; i +=4) {
        var curX = (i / 4) % canvas.width;  //四个点取一个,不明白为什么取四才有效果
        var curY = ((i / 4) - curX) / canvas.width;
        if (((i / 4)) % 2 === 1 && curY % 2 === 1) {
            var color = imageData.data[i];
            if (color === 0) {
                var x = curX;
                var y = curY;
                var lat = (y / (canvas.height / 180) - 90) / -1;
                var lng = x / (canvas.width / 360) - 180;
               // console.log('globeRAD',consts.globeRadius);
                var position = latLongToVector3(lat, lng, consts.globeRadius, 0.3);
                //console.log('position',position);
                globeCloudVerticesArray.push(position);
            }
        }
    }

    let globeCloudBufferGeometry = new THREE.BufferGeometry();
    var positions = new Float32Array(globeCloudVerticesArray.length * 3);
    for (var i = 0; i < globeCloudVerticesArray.length; i++) {
        positions[i * 3] = globeCloudVerticesArray[i].x;
        positions[i * 3 + 1] = globeCloudVerticesArray[i].y;
        positions[i * 3 + 2] = globeCloudVerticesArray[i].z;
    }
    globeCloudBufferGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

    // COLOR CHECKERED
    let globeCloudMaterial = new THREE.PointsMaterial({
        size: 0.75,
        fog: true,
        vertexColors: THREE.VertexColors,
      //  transparent:false,
   //  transparent: true,  只能有最外层是透明的，其他的必须实心
      //  opacity: 0.7,
     // side:THREE.FrontSide,
        //blending: THREE.NormalBlending,
       // blending: THREE.AdditiveBlending,
       depthWrite: false,
       depthTest: false,
        transparent: true,
        opacity: 1,
      //  color:0x000000,
        blending: THREE.NoBlending,
        side: THREE.FrontSide,
        fog: false,
        // depthWrite: false,
        // depthTest: false,
      //  renderOrder:3,
    });

    var colors = new Float32Array(globeCloudVerticesArray.length * 3);
    var globeCloudColors = [];
    for (var i = 0; i < globeCloudVerticesArray.length; i++) {
        var tempPercentage = generateRandomNumber(80, 90)*0.92 ;//0 位primary 100位 colorDaraken
       // var shadedColor = colorMix(tempPercentage, consts.colorPri);//修改过
        var shadedColor =  "#000000";
        globeCloudColors[i] = new THREE.Color(0x000000);
    }
    for (var i = 0; i < globeCloudVerticesArray.length; i++) {
        colors[i * 3] = globeCloudColors[i].r;
        colors[i * 3 + 1] = globeCloudColors[i].g;
        colors[i * 3 + 2] = globeCloudColors[i].b;
     //   console.log('r:'+globeCloudColors[i*3].r+'g:'+globeCloudColors[i*3+1].g+'b:'+globeCloudColors[i*3+2].b);
    }
    globeCloudBufferGeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    globeCloudBufferGeometry.colorsNeedUpdate = true;

    globeCloud = new THREE.Points(globeCloudBufferGeometry, globeCloudMaterial);
    globeCloud.sortParticles = true;
    globeCloud.name = 'globeCloud';
    globeCloud.position.set(0,0,0);
    return globeCloud;
}

function outerEarth(img) {

    let globeGlowSize, globeGlowTexture, globeGlowBufferGeometry, globeGlowMaterial, globeGlowMesh;

    globeGlowSize = 1200;
    globeGlowTexture = new THREE.TextureLoader().load(img.src);
    globeGlowTexture.anisotropy = 2;

    globeGlowTexture.wrapS = globeGlowTexture.wrapT = THREE.RepeatWrapping;
    globeGlowTexture.magFilter = THREE.NearestFilter;
    globeGlowTexture.minFilter = THREE.NearestMipMapNearestFilter;

    globeGlowBufferGeometry = new THREE.PlaneBufferGeometry(globeGlowSize, globeGlowSize, 1, 1);
    globeGlowMaterial = new THREE.MeshBasicMaterial({
        map: globeGlowTexture,
       // color: consts.colorPrimary,
       color:0xffffff,
        transparent: true,
        opacity: 1,

        fog: true,
        blending: THREE.AdditiveBlending,

        depthWrite: false ,
        depthTest: false
    });
    globeGlowMesh = new THREE.Mesh(globeGlowBufferGeometry, globeGlowMaterial);
    globeGlowMesh.name = 'globeGlowMesh';
    //globeGlowMesh.position.set(0,consts.globeRadius,0);
    return globeGlowMesh
}


function spike() {
    let spikesObject, spikesVerticesArray = [],
        spikesMaterial, spikesBufferGeometry, spikesMesh,
        spikeRadius = consts.globeRadius + 25,
        sphereSpikeRadius = consts.globeRadius + 40;

    spikesObject = new THREE.Group();
    spikesObject.name = 'spikesObject';

    // FLAT SPIKE RING
    var spikeTotal = 400;
    var spikeAngle = 2 * Math.PI / spikeTotal;
    for (i = 0; i < spikeTotal; i++) {
        var vertex1 = new THREE.Vector3();
        vertex1.x = spikeRadius * Math.cos(spikeAngle * i);
        vertex1.y = 40;
        vertex1.z = spikeRadius * Math.sin(spikeAngle * i);
        vertex1.normalize();
        vertex1.multiplyScalar(spikeRadius);
        var vertex2 = vertex1.clone();
        if (i % 10 === 1) {
            vertex2.multiplyScalar(1.02);
        } else {
            vertex2.multiplyScalar(1.01);
        }
        spikesVerticesArray.push(vertex1);
        spikesVerticesArray.push(vertex2);
    }

    var positions = new Float32Array(spikesVerticesArray.length * 3);
    for (var i = 0; i < spikesVerticesArray.length; i++) {
        positions[i * 3] = spikesVerticesArray[i].x;
        positions[i * 3 + 1] = spikesVerticesArray[i].y;
        positions[i * 3 + 2] = spikesVerticesArray[i].z;
    }

    spikesMaterial = new THREE.LineBasicMaterial({
        linewidth: 1,
        color: new THREE.Color(colorMix(.5)),
        transparent: true,
        opacity: 0.7,

        blending: THREE.AdditiveBlending,

        side: THREE.DoubleSide,
        fog: true,
        depthWrite: false,
        depthTest: false,
        //renderOrder:0
    });

    spikesBufferGeometry = new THREE.BufferGeometry();
    spikesBufferGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    spikesMesh = new THREE.LineSegments(spikesBufferGeometry, spikesMaterial);
    spikesObject.add(spikesMesh);
    spikesObject.position.set(0,0,0);
    return spikesObject
}

export {
    innerEarth,
    earthMap,
    earthBuffer,
    outerEarth,
    spike,
   // innerCore
}