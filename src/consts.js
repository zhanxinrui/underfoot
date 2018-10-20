
window.consts = {

    scene: null,


    camera: null,
    cameraTarget: "auto",

    // globeMaxZoom: 70,
    // globeMinZoom: 5000,
    // targetCameraZ: 2000,
    globeMaxZoom: 700,//无论如何镜头距离底面都比这个值大 1000
    globeMinZoom: 2500,
    targetCameraZ: 1500,
    cameraMaxView:1500*0.93,//和targetCameraZ一致
    globeRadius: 500,
    renderer: null,

    rotationObject: null,
    earthObject: null,

    colorPrimary: "#104e8b",
    colorDarken: "#191970",

    toRAD: Math.PI / 180,

    mouse: {
        isMouseDown: false,
        isMouseMoved: false,

        mouseXOnMouseDown: 0,
        mouseYOnMouseDown: 0,

        targetRotationX: .45,  //初始旋转x弧度
        targetRotationY: 0,
        targetRotationXOnMouseDown: 0,
        targetRotationYOnMouseDown: 0
    },

    lights: {
        lightShieldIntensity: 1.25,
        lightShieldDistance: 400,
        lightShieldDecay: 2.0,
    },
    stars:{
        maxDistance:400,
        minDistance:100,
        number:500,
        size:2,
    },
    touch:{
        isTouchDown:false,
        touchXOnTouchDown:0,
        touchYOnTouchDown:0,
        targetRotationXOnTouchDown:0,
        targetRotationYOnTouchDown:0,
        touchDisOnTouchMove:0,
        touchDisOnTouchDown:0,
        touchXOnWorldCS:0,
        touchYOnWorldCS:0
    }
}

export default consts