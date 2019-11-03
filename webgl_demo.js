var canvas;
var textCanvas;
var textCtx;
var gl;

var light;
var camera;

var monkeyMesh;
var cubeMesh;
var meshes = [];

var verticalVelocity = 0;
var gravity = 1;
var jumping = false;
var cubeSpeed = 10;

var startTime = 0;
var endTime = 0;
var deltaTime = 0;

var mouseX;
var mouseY;

var mvmtSpeed=0.01;

var isDead = false;
var score = 0;

var speed=0.1;
var destZ=0;
var destY=0;
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
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    
    canvas = document.getElementById("canvasID");
    gl = canvas.getContext("webgl2");
    textCanvas = document.getElementById("textCanvasID");
    textCtx = textCanvas.getContext("2d");

    textCanvas.style.position = "absolute";
    textCanvas.style.left = "0px";
    textCanvas.style.top = "0px";
    textCanvas.width = window.innerWidth * 0.95;
    textCanvas.height = window.innerHeight * 0.95;

    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.95;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.5, 0.7, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    camera = new Camera();
    camera.setPerspectiveProjection(70.0, canvas.width / canvas.height, 0.001, 1000.0);
    camera.position = new Vector3(-5, 2, 0);
    camera.orientation = new Quaternion(0, 1, 0, 1);
    camera.updateView(0);

    initTexturedMeshRenderer();
    initSkyboxRenderer();

    loadSkyboxFaceImage(skyboxImageData[0], 256, 256, "-x");
    loadSkyboxFaceImage(skyboxImageData[1], 256, 256, "-z");
    loadSkyboxFaceImage(skyboxImageData[2], 256, 256, "+x");
    loadSkyboxFaceImage(skyboxImageData[3], 256, 256, "+z");
    loadSkyboxFaceImage(skyboxImageData[4], 256, 256, "+y");
    loadSkyboxFaceImage(skyboxImageData[5], 256, 256, "-y");

    monkeyMesh = createTexturedMesh(monkeyData[0], monkeyData[1]);
    //monkeyMesh.textureID = generateGLTexture2D(monkeyPixels, 1024, 1024);
    monkeyMesh.orientation.rotate(new Vector3(0, 1, 0), -Math.PI);

    let verts = [];
    let inds = [];
    generateUnitCubeVerticesIndexedWithNormalsTexCoords(verts, inds);
    //this.cubeMesh = createTexturedMesh(verts, inds);
    cubeMesh = createTexturedMesh(missileData[0], missileData[1]);
    cubeMesh.orientation.rotate(new Vector3(0, 1, 0), -Math.PI);
    meshes = [monkeyMesh, cubeMesh];

    startTime = new Date().getTime();
    setInterval(updateFrame, 1 );
}

function checkIntersection(m1, m2){
    dist = Vector3.sub(m1.position, m2.position);
    if(Vector3.length(dist) < 4){
        m1.verts
        gl.clearColor(1, 0, 0, 1);
    }else{
        gl.clearColor(0.5, 0.7, 1.0, 1.0);
    }
}

function updateFrame(){
    checkIntersection(monkeyMesh, cubeMesh);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    // verticalVelocity -= gravity * deltaTime;
    // cubeMesh.position.y += verticalVelocity;
    // if(cubeMesh.position.y < 0){
    //     cubeMesh.position.y = 0;
    //     jumping = false;
    // }
    
    if(cubeMesh.position.z >destZ){
        cubeMesh.position.z-=mvmtSpeed;
    }else if(cubeMesh.position.z <destZ){
        cubeMesh.position.z+=mvmtSpeed;
    }
    if(cubeMesh.position.y >destY){
        cubeMesh.position.y-=mvmtSpeed;
    }else if(cubeMesh.position.y <destY){
        cubeMesh.position.y+=mvmtSpeed;
    }

    if(monkeyMesh.position.x <= -7){
        monkeyMesh.position.x = 20;
    } else {
        monkeyMesh.position.x -= speed;
    }
    monkeyMesh.orientation.rotate(new Vector3(0,0,1), 1 * deltaTime);
    
    
    camera.updateView(deltaTime);
    renderTexturedMeshes(meshes, camera, new Vector3(4, 4, 4));
    renderSkybox(camera.projectionMatrix, camera.orientation);
    textCtx.font = "30px Arial";
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    if(isDead){
        textCtx.fillText("You're Dead!", 100, 100);
    }else{
        textCtx.fillText("Score: " + score, 100, 100);
    }
    score += deltaTime;

    endTime = new Date().getTime();
    deltaTime = (endTime - startTime) / 1000.0;
    startTime = endTime;
}
function seekMouse(){
 //   cubeMesh.position.z = (((mouseX / canvas.width) * 8) -4);
  //  cubeMesh.position.y = (((mouseY / canvas.height) * -8) +6);
  
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

function mouseMove(evt){
    mouseX = evt.x;
    mouseY = evt.y;
    destZ = (((mouseX / canvas.width) * 8) -4);
    destY = (((mouseY / canvas.height) * -8) +6);
}
function mouseDown(evt){
  speed=0.2;

console.log("down");
}
function mouseUp(evt){
    speed=0.1;

    console.log("up");
    }
var an = true;
function keyDown(event){
    switch(event.keyCode){
        
    }
}