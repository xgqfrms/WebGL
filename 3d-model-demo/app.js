import * as THREE from 'three';

// import Stats from './jsm/libs/stats.module.js';
import Stats from './stats.module.js';

// import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { OrbitControls } from './OrbitControls.js';

// FBX loader
// import { FBXLoader } from './jsm/loaders/FBXLoader.js';
import { FBXLoader } from './FBXLoader.js';
import { ColladaLoader } from './ColladaLoader.js';
import { TGALoader } from './TGALoader.js';

let camera, scene, renderer, stats;

const clock = new THREE.Clock();

let mixer;

init();
animate();

function init() {

    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 100, 200, 300 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 200, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 200, 100 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add( dirLight );

    // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );


    // 加载素材
    const tgaLoader = new TGALoader();
    // load a resource
    const texture = tgaLoader.load(
        // resource URL
        './china_caocao_BaseColor.tga',
        // called when loading is completed
        function ( texture ) {
            console.log( 'Texture is loaded' );
        },
        // called when the loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when the loading fails
        function ( error ) {
            console.log( 'An error happened' );
        }
    );

    // const material = new THREE.MeshPhongMaterial( {
    //     color: 0xffffff,
    //     map: texture,
    // });

	const textures = [];
	// forEach => loader

    // ground
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false,
        // map: texture,
        // map: textures,
    }));
    // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    // model
    const loader = new FBXLoader();
    // const loader = new ColladaLoader();
    // 加载模型
    // 斯坦福兔子
    // loader.load( 'stanford-bunny.fbx', function ( object ) {
    // 桑巴舞
    // loader.load( './china_cc_01.fbx', function ( object ) {
    // loader.load( './cc01.FBX', function ( object ) {
    // loader.load( './caocao01.fbx', function ( object ) {
    // loader.load( './cc.FBX', function ( object ) {
    loader.load( 'mario-sculpture.fbx', function ( object ) {
    // loader.load( 'cc-fbx-test.fbx', function ( object ) {
    // loader.load( './cc-fbx-test.fbx', function ( object ) {
    // loader.load( './cc-dae-fbx.dae', function ( object ) {
    // loader.load( 'Samba-Dancing.fbx', function ( object ) {

        mixer = new THREE.AnimationMixer( object );

        const action = mixer.clipAction( object.animations[ 0 ] );
        action.play();

        object.traverse( function ( child ) {

            if ( child.isMesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        } );

        scene.add( object );

    } );

    // material ???
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 100, 0 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    if ( mixer ) mixer.update( delta );

    renderer.render( scene, camera );

    stats.update();

}
