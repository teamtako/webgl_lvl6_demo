var canvas;
var gl;

var light;
var camera;

var t;
var monkeyMesh;
var cubeMesh;
var meshes = [];
var myvar;
var verticalVelocity = 0;
var gravity = 1;
var jumping = false;
var cubeSpeed = 10;

var isDead  = false;
var startTime = 0;
var endTime = 0;
var deltaTime = 0;

const KEY_0 = 48;
const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
const KEY_5 = 53;
const KEY_6 = 54;
const KEY_7 = 55;
const KEY_8 = 56;
const KEY_9 = 57;
const KEY_A = 65;
const KEY_B = 66;
const KEY_C = 67;
const KEY_D = 68;
const KEY_E = 69;
const KEY_F = 70;
const KEY_G = 71;
const KEY_H = 72;
const KEY_I = 73;
const KEY_J = 74;
const KEY_K = 75;
const KEY_L = 76;
const KEY_M = 77;
const KEY_N = 78;
const KEY_O = 79;
const KEY_P = 80;
const KEY_Q = 81;
const KEY_R = 82;
const KEY_S = 83;
const KEY_T = 84;
const KEY_U = 85;
const KEY_V = 86;
const KEY_W = 87;
const KEY_X = 88;
const KEY_Y = 89;
const KEY_Z = 90;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_SPACE = 32;

window.onload = function(){
  
    window.addEventListener("keyup", keyUp);
    window.addEventListener("keydown", keyDown);

    canvas = document.getElementById("canvasID");
    gl = canvas.getContext("webgl2");

    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.95;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.5, 0.7, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    camera = new Camera();
    camera.setPerspectiveProjection(70.0, canvas.width / canvas.height, 0.001, 1000.0);
    camera.position = new Vector3(5, 5, 10);
    camera.orientation = new Quaternion(0.2, 0, 0, 1);
    camera.updateView(0);

    initTexturedMeshRenderer();

    monkeyMesh = createTexturedMesh(monkeyData[0], monkeyData[1]);
    monkeyMesh.textureID = generateGLTexture2D(monkeyPixels, 1024, 1024);
    monkeyMesh.orientation.rotate(new Vector3(0, 1, 0), -Math.PI);

    let verts = [];
    let inds = [];
    generateUnitCubeVerticesIndexedWithNormalsTexCoords(verts, inds);
    this.cubeMesh = createTexturedMesh(verts, inds);
    cubeMesh.position
    cubeMesh.position = new Vector3(20, 0, 0);
    meshes = [monkeyMesh, cubeMesh];

    startTime = new Date().getTime();
  myvar = setInterval(updateFrame, 1);
  
}

function checkIntersection(m1, m2){
    dist = Vector3.sub(m1.position, m2.position);
    if(Vector3.length(dist) < 1){
        gl.clearColor(1, 0, 0, 1);
       clearInterval(myvar);
      t = document.createTextNode("You are dead, press the up arrow to restart");
            isDead = true;
       document.body.appendChild(t);
        
    } else {
       if(isDead == false) { console.log("working");}
        isDead = false;
    }
       
}

function updateFrame(){
    isDead = false;
    checkIntersection(monkeyMesh, cubeMesh);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    verticalVelocity -= gravity * deltaTime;
    monkeyMesh.position.y += verticalVelocity;
    if(monkeyMesh.position.y < 0){
        monkeyMesh.position.y = 0;
        jumping = false;
    }

    cubeMesh.position.x -= cubeSpeed * deltaTime;
    if(cubeMesh.position.x <= -7){
        cubeMesh.position.x = 20;
    }

    camera.updateView(deltaTime);
    renderTexturedMeshes(meshes, camera, new Vector3(4, 4, 4));

    endTime = new Date().getTime();
    deltaTime = (endTime - startTime) / 1000.0;
    startTime = endTime;
}

function keyUp(event){ 
    console.log(camera.position);
    console.log(camera.orientation);
    switch(event.keyCode){
        case KEY_SPACE:{
            if(!jumping){
                verticalVelocity = 0.2;
                jumping = true;
            }
            break;
        }
    }
}

var an = true;
function keyDown(event){
  
    switch(event.keyCode){
        case KEY_UP:{
        
        if(isDead == true) {
        t.remove(); 
        gl.clearColor(0.5, 0.7, 1.0, 1.0);  
        cubeMesh.position = new Vector3(20, 0, 0);     
        startTime = new Date().getTime();  
        myvar = setInterval(updateFrame, 1);}
        isDead = false;
        console.log("respawned")
       }
     
    }
} 

