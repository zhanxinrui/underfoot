$(()=>{
	if ( ! Detector.webgl ) {Detector.addGetWebGLMessage();
		console.log("can't use webgl");
	}
	var weatherList ={};
	var container, stats, camera, scene, renderer,controls;
	var sky,sunSphere,hill,sphere;
	var light,light2,lightVec,light3,light4;
	var loader;
	var hillRadius = 92000;
	var Attr;//属性
	var cloudTextures,
		snowTextures,
		rainTextures,
		rainTypeSize = [],
		snowTypeSize = [];
	var snowParticles,rainParticles;
	var Hills,Road,Ground,Rain,Snow,Stars,Clouds,Galaxy;
	var cloudType = [],snowType = [], rainType = [];
	var FirstIn = true;//用来判断是否第一次进入
	var start = async ()=>{

			await getWeather();//先要获取天气
			init();
			initTextures();
			initRenderer();
		 	initControls();
			initLight();
			initGalaxy();
			initHill();
			initGround();
			initRoad();
			initSky();
			animate();
		}


	start();
			function getWeather(){
				return new Promise((resolve,reject)=>{
					if(returnCitySN){
					console.log('当前位置信息',returnCitySN['cip']+returnCitySN['cname']);
					
					
						$.ajax({
							url:'/weather',
							data:{
								Request:"POST",
								cityName:returnCitySN['cname'],
							},
							type:'POST',
							dataType: "json",
							success:function(data){
								if(data){
									resolve("ok 200");//只有这样 后面才能await到 
									console.log("what's wrong man");
									console.log("typeof data:",typeof data);
									console.log("data:",data);
									weatherList = data;
									
									if(data)  for(let i in data) console.log(i,":",data[i]);
									else console.log('can\'t pass through');
									console.log("i got the data");

								}
								else{//等会替换成默认的设置，这块先检错
									// window.location.href = IndexPage;
									
									weatherList = null;
									console.log("出错了，没拿到数据");
									resolve("ok 201");//如果reject在 await后就需要catch进行处理 在这里和resolve逻辑没什么不同所以就resolve
								}
							}
						});
					}
				})
			}
			function init() {
					 
				container = document.getElementById("interactive")
				// scene
				scene = new THREE.Scene();
				// camera
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000000 );
				camera.position.set( 0, 50, 1500 );
				stats = new Stats();
				container.appendChild( stats.dom );
				loader = new THREE.TextureLoader();
			}
			function initTextures(){
				let cloudLength = 23;
				let snowLength = 5;
				let rainLength = 6;
				Attr = {cloudType:[0,1,2,3,4,5,6,7,8,9],cloudSize:200,cloudNum:50,wind:2,rain:0,rainNum:50,rainType:[0,1,2,3,4,5],snowType:[0,1,2,3,4],snowSize:5,snowNum:1000,fog:0,starSize:2,starNum:3000};
				cloudTextures = [];
				// console.log(Attr.cloudType[0]);
				for(let i = 0 ; i < cloudLength; i++){
					var cloudTexture = loader.load('/static/images/textures/cloud/cloud'+(i+1)+'.png');
					cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
					cloudTexture.repeat.set( 1,1 );
					cloudTexture.anisotropy = 160;
					cloudTextures.push(cloudTexture);
				}
				snowTextures = [];
				for(let i = 1 ; i <= snowLength; i++){
					var snowTexture = loader.load('/static/images/textures/sprites/snow'+i+'.png');
					snowTexture.wrapS = snowTexture.wrapT = THREE.RepeatWrapping;
					snowTexture.repeat.set( 1,1 );
					snowTexture.anisotropy = 160;
					snowTextures.push(snowTexture);
				}
				snowTypeSize = [10,20,15,5,8];

				rainTextures = [];
				for(let i = 1 ; i <= rainLength; i++){
					var rainTexture = loader.load('/static/images/textures/drip/drip'+i+'.png');
					rainTexture.wrapS = rainTextures.wrapT = THREE.RepeatWrapping;
					rainTexture.repeat.set( 1,1 );
					rainTexture.anisotropy = 160;
					rainTextures.push(rainTexture);
				}
				rainTypeSize = [10,10,10,10,10,10,10];
			}
			function initLight(){
				//太阳点光源
				light2 = new THREE.PointLight( 0xfefcee, 2.5, 100000000 );
				light3 = new THREE.DirectionalLight(0xfefcee,0.7);
				light4 = new THREE.DirectionalLight(0xfefcee,0.7);
				light = new THREE.DirectionalLight( 0xfefcee, 0.1);
				light.position.multiplyScalar( 1.3 );
				light.castShadow = true;
				light.shadow.mapSize.width = 1024;
				light.shadow.mapSize.height = 1024;
				light2.position.set( 0, 1, 0 );
				light4.position.set(0,0,-1);
				light3.position.set(0,0,1);
				light.position.set( 0, 1, 0 );
				var d = 300;
				light.shadow.camera.left = - d;
				light.shadow.camera.right = d;
				light.shadow.camera.top = d;
				light.shadow.camera.bottom = - d;
				light.shadow.camera.far = 1000;
				scene.add( light );
				scene.add(light2);
				scene.add(light3);
			}
			

			function initSky() {
				// Add Sky
				sky = new THREE.Sky();
				sky.scale.setScalar( 450000 );//设置天空大小
				scene.add( sky );
				// Add Sun Helper
				sunSphere = new THREE.Mesh(
					new THREE.SphereBufferGeometry( 20000, 16, 8 ),
					new THREE.MeshBasicMaterial( { color: 0xffffff } )
				);
				sunSphere.position.y = - 700000;
				sunSphere.visible = false;
				scene.add( sunSphere );
			//  要设置一个定时器来让天变起来
				/// GUI
				var effectController = {};
				if(weatherList) console.log("可以使用",weatherList!=null);
				if(weatherList&&weatherList!=null){
					    effectController  = {
						turbidity: 10,
						rayleigh: 2,
						mieCoefficient: 0.005,
						mieDirectionalG: 0.8,
						luminance: 1,
						inclination: 0.49, // elevation / inclination
						azimuth: 0.25, // Facing front,
						snow:weatherList.snowSize,
						rain:weatherList.rain,
						star:weatherList.starSize,
						cloud:weatherList.cloudSize,
						fog1:0,
						wind:weatherList.wind,
						cloudy:(weatherList.cloud>=10),
						sun: ! true
					};
				}
				else{
						effectController  = {
						turbidity: 10,
						rayleigh: 2,
						mieCoefficient: 0.005,
						mieDirectionalG: 0.8,
						luminance: 1,
						inclination: 0.49, // elevation / inclination
						azimuth: 0.25, // Facing front,
						snow:0,
						rain:0,
						star:0,
						cloud:5,
						fog1:0,
						wind:2,
						cloudy:false,
						sun: ! true
	
					};
				}
				//last dict to prevent too much renderers
				var last  = {
					turbidity: -1,
					rayleigh: -1,
					mieCoefficient:-1,
					mieDirectionalG:-1,
					luminance: -1,
					inclination: -1, // elevation / inclination
					azimuth: -1, // Facing front,
					snow:-1,
					rain:-1,
					star:-1,
					cloud:-1,
					fog1:-1,
					wind:-1,
					cloudy:true,
					sun: ! true

				};
				var sunriseH ;
				var sunriseM ;
				var sunsetH ;
				var sunsetM ;
				var sunMove;
				if(weatherList){
				sunMove=function(){
						sunriseH = parseInt(weatherList.sunriseH);
						sunriseM = parseInt(weatherList.sunriseM);
						sunsetH = parseInt(weatherList.sunsetH);
						sunsetM = parseInt(weatherList.sunriseM);
						let night, height=true,
							now = new Date(),
							H = now.getHours(),
							M = now.getMinutes(),
							dayTime = sunsetH-sunriseH+(sunsetM-sunriseM)/60,//白天的时间
							gap  = H-sunriseH+(M-sunriseM)/60,//距离日出的时间
							ratio = gap/dayTime;
						if((sunsetH-H+(sunsetM-M)/60)<0 || (sunriseH-H+(sunriseM-M)/60) > 0 ||(ratio<0))
							night  = true;
						else 
							night = false;
						if(!night){
								if(ratio>0.5)//下午
								height = 0+(ratio*2-1)*0.5;
								// console.log('ratio',ratio);
								else
									height = 0+(1-ratio*2)*0.5//从最亮处-(ratio两倍即为半面白天的长)
							}
						else
							height = 0.65;
							// console.log("gap now :",gap,"ratio now ",ratio);
							// console.log("inclination:",effectController.inclination);
							// console.log("height:",height);
							effectController.inclination = height;
							// 0.5太阳落山最后一刻，0.47 升起来能看到太阳最后一刻  0.44  0.46 天空
					
				}
				
				var distance = 100000;
				sunMove();
				if(weatherList&&weatherList!=null){
					setInterval(sunMove,5000);
				}
				}
				function guiChanged() {

					var uniforms = sky.material.uniforms;
					uniforms.turbidity.value = effectController.turbidity;
					uniforms.rayleigh.value = effectController.rayleigh;
					uniforms.luminance.value = effectController.luminance;
					uniforms.mieCoefficient.value = effectController.mieCoefficient;
					uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

					var theta = Math.PI * ( effectController.inclination - 0.5 );
					var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

					sunSphere.position.x = distance * Math.cos( phi );
					sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
					sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

					sunSphere.visible = effectController.sun;

					uniforms.sunPosition.value.copy( sunSphere.position );

					//control clouds differ in weathers
					let cloudFirstType = 0;
					if(effectController.cloudy){
						cloudFirstType = 13;
					}
					//clouds
					if((effectController.cloud!=-1) && (last.cloud!=effectController.cloud)){
						// console.log("now ",cloudType.length,'weatherlist.cloutype',weatherList.cloudType);
						if(FirstIn&&weatherList){
							cloudType = weatherList.cloudType;
							console.log("cloud first");

						}
						else{
							cloudType = [];
							for(let i = cloudFirstType ;i < effectController.cloud+cloudFirstType && i < 22; i++){
								cloudType.push(i);
							}
						}
							scene.remove(Clouds);	
						
						initCloud(cloudType,Math.log2(effectController.cloud)*500,effectController.cloud*2,effectController.wind);
						last.cloud = effectController.cloud;
						console.log("Scene.children.length after",scene.children.length)
					}
					//stars
					if((effectController.star!=-1)&&(last.star != effectController.star)){
						scene.remove(Stars);	
						initStar(effectController.star,effectController.star*200);
						last.star = effectController.star;
					}

					//for now i only have five textures of snow
					if((effectController.snow!=-1) &&(last.snow != effectController.snow)){
						if(FirstIn&&weatherList){
							snowType = weatherList.snowType;
						}
						else{
							snowType = [];
							for(let i = 0 ; i < Math.floor(effectController.snow/4); i++)
							snowType.push(i);
							// console.log("snow Azie",snowType);
						}

						scene.remove(Snow);
						console.log("init Snow now");
						console.log("snowType",snowType,"snow",effectController.snow);
						initSnow(snowType,Math.floor(effectController.snow/4),effectController.snow*200,effectController.wind);
						last.snow = effectController.snow;
					}
					if((effectController.rain!=-1) &&(last.rain != effectController.rain)){
						scene.remove(Rain);
						if(FirstIn && weatherList){
							rainType = weatherList.rainType;
						}
						else{
							rainType = [];
							for(let i = 0 ; i < Math.floor(effectController.rain/6); i++)
							rainType.push(i);
						}
						initRain(rainType,2,effectController.rain*50,effectController.wind)
						last.rain = effectController.rain;
					}

					//differ between day and night
					if(Stars){
						if(effectController.inclination >0.5)
							Stars.visible = true;
						else
							Stars.visible = false;
					}
					if(Galaxy){
						if(effectController.inclination > 0.5)
							Galaxy.visible = true;
						else 
							Galaxy.visible = false;
					}
					if(effectController.fog1 && (effectController.fog1 != last.fog))
						scene.fog = new THREE.Fog(0xffffff,2000-effectController.fog1*2000,80000-80000*effectController.fog1);
					FirstIn = false;//第一次初始化结束
					renderer.render( scene, camera );
				}
				var gui = new dat.GUI();
				// var gui = new dat.GUI( { autoPlace: false } );
				// dat.GUI.toggleHide();
				gui.closed = true;
				var customContainer = $('.moveGUI').append($(gui.domElement));
				gui.add( effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( guiChanged );
				gui.add( effectController, "rayleigh", 0.0, 4, 0.001 ).onChange( guiChanged );
				gui.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
				gui.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
				gui.add( effectController, "luminance", 0.0, 2 ).onChange( guiChanged );
				gui.add( effectController, "inclination", 0, 1, 0.0001 ).onChange( guiChanged );
				gui.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange( guiChanged );
				gui.add( effectController, "snow",0, 20, 1).onChange(guiChanged);
				gui.add( effectController, "rain",0, 20, 1).onChange(guiChanged);
				gui.add( effectController, "star",0, 20, 1).onChange(guiChanged);
				gui.add( effectController, "cloud",0, 20, 1).onChange(guiChanged);
				// gui.add( effectController, "fog1" , 0, 1, 0.05).onChange(guiChanged);
				gui.add( effectController, "wind", 0, 5, 1).onChange(guiChanged);
				gui.add( effectController, "sun" ).onChange( guiChanged );
				gui.add( effectController, "cloudy").onChange(guiChanged);
				guiChanged();
			}

			function initCloud(textures,size,num,wind){
				var cloudMaterial = [];
				Clouds = new THREE.Group();
				console.log('check !!',textures);
				for(let i = 0 ; i < textures.length; i++ ){
					cloudMaterial.push( new THREE.MeshLambertMaterial( {
						map: cloudTextures[textures[i]],
						blending:THREE.AddictiveBlending,
						depthWrite:false,
						depthTest: false,
						transparent:true,
						color:0xffffff,
						side:THREE.DoubleSide,
						opacity:0.9
						})
					);
				}

				var geometry = new THREE.SphereGeometry( 50, 320, 320 );
				var sphere = new THREE.Mesh( geometry, cloudMaterial[2] );
				sphere.position.set(0,0,0);
				for(let i = 0; i < num; i++ ){
					var ranMat = cloudMaterial[Math.floor(Math.random()*textures.length)];
					var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(size*5,size*5/2),ranMat);
					let x = (Math.random()-0.5)*10000,z = (Math.random()-0.5)*10000,y = (Math.random()-0.2)*1000+2500;
					mesh.position.set(x,y,z);
					Clouds.add(mesh);
					var scale = Math.random()*5;
					//位移 默认往右
					new TWEEN.Tween(mesh.position)
						.delay(10)
						.to({x:(x+(Math.random()-0.2)*2000)*wind,y:(y+(Math.random()-0.65)*1500)*wind},300000)
						.yoyo()
						.start();
					new TWEEN.Tween(mesh.ranSize)
					//存活时间
					if(Math.abs(size)<0.01){
						new TWEEN.Tween(mesh)
						.delay(10)
						.to({},0)
						.start();
					}
					new TWEEN.Tween(mesh.scale)
						.delay(10)
						.to({x:scale,y:scale},300000)
						.start();
					new TWEEN.Tween(mesh.rotation)
						.delay(10)
						.to({y:Math.PI*Math.random()*wind*0.1},100000)
						.start()

				}
				scene.add(Clouds);
				console.log("have addd now");

			}
			//snow
			function initStar(size,num){//后期可以加上闪光
				var size1 = size ,num1 = num ,wind = wind;//便于重复
				var starMaterials = [];
				Stars = new THREE.Object3D();
				var star = new THREE.Geometry();//点构成只能这样
				for(let i = 0; i < num/4; i++){
					let maxRad =200000	;//最大半径
					var vertex = new THREE.Vector3();
					vertex.y = Math.random()*maxRad;//高度随机
					let radius =Math.pow(Math.pow(maxRad,2)-Math.pow(vertex.y,2),0.5);//x,z形成半径
					let theta = Math.random()*Math.PI*2;
					vertex.x = radius*Math.cos(theta);
					vertex.z = radius*Math.sin(theta);
					star.vertices.push(vertex);
					//其实也可以用floor(random)来解决
				}
				if(size<20)size=10
					for(var i = 0; i < size%20; i++){
						let j = i;
						starMaterials[j] =  new THREE.PointsMaterial({
							size:120*j,
							color:0xfdf7a9,
							transparent:false,
							depthWrite:false,
							depthTest:false,
							opacity:1
						});
						var particle = new THREE.Points(star,starMaterials[j]);
						particle.rotation.x = Math.random()*10;
						Stars.add(particle);
					}
					scene.add(Stars);
				}	
			function initSnow(textures,size,num,wind){
				var geo = new THREE.BufferGeometry();
				var vertices = [];
				var snowMaterials = [];
				for ( var i = 0; i < num*40; i ++ ) {
					var x = Math.random() * 40000 - 20000;
					var y = Math.random() * 40000 - 20000;
					var z = Math.random() * 40000 - 20000;
					vertices.push( x, y, z );
				}
				geo.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
                Snow = new THREE.Group();
				for ( var i = 0; i < textures.length; i ++ ) {//由size来控制有多少种雪花出现
					var sprite = snowTextures[textures[i]];
					var sizeMat   = snowTypeSize[i];
					snowMaterials[ i ] = new THREE.PointsMaterial( {
					 	size: sizeMat*5,
					 	map: sprite, 
					 	blending: THREE.AdditiveBlending, 
						depthWrite:false,
						depthTest: false,
						transparent : true ,
						opacity:1
					} );
					snowParticles = new THREE.Points( geo, snowMaterials[i] );
					snowParticles.rotation.x = Math.random() * 6;
					snowParticles.rotation.y = Math.random() * 6;
					snowParticles.rotation.z = Math.random() * 6;
                    Snow.add(snowParticles);//不明白为什么要先添加这个
					new TWEEN.Tween(snowParticles.position)
						.delay(10)
						.to({y:-30000},100000)
						.repeat(Infinity)
						.start();

					new TWEEN.Tween(snowParticles.rotation)
						.delay(10)
						.to({y:Math.random()*wind*20},2000000)
						.repeat(Infinity)
						.start();
				}
				scene.add( Snow );

			}			
			function initRain(textures,size,num,wind){
				var geo = new THREE.BufferGeometry();
				var vertices = [];
				var rainMaterials = [];
				Rain = new THREE.Group();
				for ( var i = 0; i < num*170; i ++ ) {
					var x = Math.random() * 40000 - 20000;
					var y = Math.random() * 40000 - 20000;
					var z = Math.random() * 40000 - 20000;
					vertices.push( x, y, z );
				}
				geo.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
				for ( var i = 0; i < textures.length; i ++ ) {//由size来控制有多少种雪花出现
					var sprite = rainTextures[textures[i]];
                    var sizeMat   = rainTypeSize[i];
					rainMaterials[ i ] = new THREE.PointsMaterial( {
					 	size: sizeMat*10,
					 	map: sprite, 
					 	blending: THREE.AdditiveBlending, 
						depthWrite:false,
						depthTest: false,
						transparent : true ,
						opacity:1
					} );
					rainParticles = new THREE.Points( geo, rainMaterials[i] );
					rainParticles.rotation.x = Math.random() * 6;
					rainParticles.rotation.y = Math.random() * 6;
					rainParticles.rotation.z = Math.random() * 6;
					Rain.add(rainParticles);
					new TWEEN.Tween(rainParticles.position)
						.delay(10)
						.to({y:-10000},10000)//可根据雨大小调整
						// .repeat()
						.repeat(Infinity) //相当于这个过程重复，每次的position还是原来的那个Position
						.start();
					new TWEEN.Tween(rainParticles.rotation)
						.delay(10)
						.to({y:Math.random()*wind*20},1000000)
						// .onComplete(initSnow(size1,num1,wind))
						.repeat(Infinity)
						.start();
				}		
				scene.add( Rain );	
			}	
			// ground
			function initGround(){
				var groundTexture = loader.load( '/static/images/textures/terrain/grasslight-big.jpg' );
				groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
				groundTexture.repeat.set( 250, 250 );
				groundTexture.anisotropy = 160;
				var groundMaterial = new THREE.MeshLambertMaterial( { 
					map: groundTexture,
					blending:THREE.NoBlending,
					depthWrite:false,
					depthTest: false,
					transparent:true,
					opacity:1 } );
				Ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 400000, 400000 ), groundMaterial );
				Ground.position.y = - 250;
				Ground.rotation.x = - Math.PI / 2;
				Ground.receiveShadow = true;
				scene.add( Ground );
			}
				//road
			function initRoad(){
				var roadTexture = loader.load( '/static/images/textures/terrain/road.png' );
				roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
				roadTexture.repeat.set( 1, 40000 );
				roadTexture.anisotropy = 160;
				var	 roadMaterial = new THREE.MeshLambertMaterial( { 
					map: roadTexture, 
					blending:THREE.NoBlending,
					depthWrite:false,
					depthTest: false,
					transparent:true,
					opacity:1  } );

				Road = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1000, 400000 ), roadMaterial );
				Road.position.y = - 249;
				Road.rotation.x = - Math.PI / 2;
				Road.position.z = 1;
				Road.receiveShadow = true;
				Road.color = 0xeeeeee;
                scene.add( Road );
                
			}
			function initGalaxy(){
				var galaxyTexture = loader.load( '/static/images/textures/cloud/galaxy.png' );
				galaxyTexture.wrapS = galaxyTexture.wrapT = THREE.RepeatWrapping;
				galaxyTexture.repeat.set( 1, 1 );
				galaxyTexture.anisotropy = 50;

				var	 galaxyMaterial = new THREE.MeshLambertMaterial( { 
					map: galaxyTexture, 
					blending:THREE.AdditiveBlending,
					depthWrite:false,
					depthTest: false,
					transparent:true,
					side:THREE.BackSide,
					opacity: 0.4} );

			    Galaxy = new THREE.Mesh( new THREE.PlaneBufferGeometry( 12800, 6400 ), galaxyMaterial );
				Galaxy.position.y = 380000;
				Galaxy.rotation.x = - Math.PI *3/ 4;
				Galaxy.position.z = -30000;
				Galaxy.receiveShadow = true;
				Galaxy.color = 0xeeeeee;
                Galaxy.scale.x = Galaxy.scale.y = 100;
				scene.add( Galaxy );			
			}
			function initHill(){
                Hills = new THREE.Group();
				var hillTexture = loader.load('/static/images/textures/hill/1.png');
				hillTexture.wrapS = hillTexture.wrapT = THREE.RepeatWrapping;
				hillTexture.repeat.set( 1.2, 0.8 );//横纵数量设置，通过小数让他们放大
				hillTexture.anisotropy = 160;


				var hillMaterial = new THREE.MeshLambertMaterial({map:hillTexture,
					transparent:true,
					opacity:1,
					depthWrite:false,
					depthTest: false,
					color:0x777777,
			        side: THREE.BackSide,
					wrapAround : true,
					wrapRGB : THREE.Vector3(0,1,0)

				});
				var materialBottom = new THREE.MeshLambertMaterial({color: 0xffffff, side:THREE.BackSide,
					transparent:true,
					opacity:0,
				});
				var geo = new THREE.CylinderBufferGeometry(hillRadius,hillRadius,hillRadius/10,10000,0,Math.PI/2);
				geo.thetaStart  = 0;
				geo.thetaLength = Math.PI/8;
				hill = new THREE.Mesh(geo,[hillMaterial,materialBottom,materialBottom]);
				hill.position.set(0,4000,0);
                Hills.add(hill);
				scene.add(Hills);
			}
			function synPos(a,b){
				a.position.x = b.position.x;
				a.position.y = b.position.y;
				a.position.z = b.position.z;
			}
			function initRenderer(){
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				container.appendChild( renderer.domElement );

				renderer.gammaInput = true;
				renderer.gammaOutput = true;

				renderer.shadowMap.enabled = false;
				renderer.sortObjects = false;
			}
			function initControls(){
				// controls
				var controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.maxPolarAngle = Math.PI ;
				controls.minDistance = 1000;
				controls.maxDistance = 5000;
				controls.enableZoom = true;//允许伸缩
				controls.enablePan = true;//允许键盘控制
			}

				window.addEventListener( 'resize', onWindowResize, false );

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );

			}
			function animate() {
				requestAnimationFrame( animate );
				render();
				stats.update();
			    TWEEN.update();
			}
			function render() {
				lightVec =new THREE.Vector3(0,0,0);
				lightVec.x = Math.round(camera.position.x);
				lightVec.y = Math.round(camera.position.y);
				lightVec.z = Math.round(camera.position.z);
				lightVec.x -= Math.round(sunSphere.position.x);
				lightVec.y -= Math.round(sunSphere.position.y);
				lightVec.z -= Math.round(sunSphere.position.z);
				synPos(light2, sunSphere);
				camera.position.z-=5;
				renderer.render( scene, camera );
			}
});