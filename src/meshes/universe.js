import * as THREE from "three";

function universe(img){
    let _texture,_geometry,_material,_mesh;
    _texture= new THREE.TextureLoader().load(img.src);
    _texture.anisotropy = 16;

    _geometry=new THREE.PlaneGeometry(1500, 750, 1, 1);
    _material=new THREE.MeshBasicMaterial({ 
        map: _texture,
        blending: THREE.AdditiveBlending,
        color: new THREE.Color(consts.colorPrimary),
        transparent: false,
        opacity:1,
        
        fog: false,
        side: THREE.DoubleSide,
        depthWrite: false, depthTest: false
    });

    _mesh=new THREE.Mesh( _geometry, _material );
    _mesh.position.z = -1000;
   // _mesh.scale.x
    _mesh.scale.x = _mesh.scale.y = 3;

    _mesh.name = 'universeBgMesh';
    return   _mesh

}

export  default universe