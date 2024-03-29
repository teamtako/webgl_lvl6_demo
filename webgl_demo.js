var canvas;
var textCanvas;
var textCtx;
var gl;

var light;
var camera;

var monkeyMesh;
var cubeMesh;
var meshes = [];


var stopvar;
var verticalVelocity = 0;
var gravity = 1;
var jumping = false;
var cubeSpeed = 10;

var startTime = 0;
var endTime = 0;
var deltaTime = 0;

var mouseX;
var mouseY;

var mvmtSpeed = 0.01;

var isDead = false;
var score = 0;
var mainMenu = true;

var difficulty;

var speed = 0.1;
var destZ = 0;
var destY = 0;

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

window.onload = function () {
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
    //gl.enable(gl.CULL_FACE);
    gl.clearColor(0.5, 0.7, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    let vertices = [
        -0.5, -0.5, 0.5, 0, 0, 1, 0.0, 1.0,
        -0.5, 0.5, 0.5, 0, 0, 1, 0.0, 0.0,
        0.5, 0.5, 0.5, 0, 0, 1, 1.0, 0.0,
        0.5, -0.5, 0.5, 0, 0, 1, 1.0, 1.0,

        0.5, -0.5, -0.5, 0, 0, -1, 0.0, 1.0,
        0.5, 0.5, -0.5, 0, 0, -1, 0.0, 0.0,
        -0.5, 0.5, -0.5, 0, 0, -1, 1.0, 0.0,
        -0.5, -0.5, -0.5, 0, 0, -1, 1.0, 1.0,

        0.5, -0.5, 0.5, 1, 0, 0, 0.0, 1.0,
        0.5, 0.5, 0.5, 1, 0, 0, 0.0, 0.0,
        0.5, 0.5, -0.5, 1, 0, 0, 1.0, 0.0,
        0.5, -0.5, -0.5, 1, 0, 0, 1.0, 1.0,

        -0.5, -0.5, -0.5, -1, 0, 0, 0.0, 1.0,
        -0.5, 0.5, -0.5, -1, 0, 0, 0.0, 0.0,
        -0.5, 0.5, 0.5, -1, 0, 0, 1.0, 0.0,
        -0.5, -0.5, 0.5, -1, 0, 0, 1.0, 1.0,

        -0.5, 0.5, 0.5, 0, 1, 0, 0.0, 1.0,
        -0.5, 0.5, -0.5, 0, 1, 0, 0.0, 0.0,
        0.5, 0.5, -0.5, 0, 1, 0, 1.0, 0.0,
        0.5, 0.5, 0.5, 0, 1, 0, 1.0, 1.0,

        -0.5, -0.5, -0.5, 0, -1, 0, 0.0, 1.0,
        -0.5, -0.5, 0.5, 0, -1, 0, 0.0, 0.0,
        0.5, -0.5, 0.5, 0, -1, 0, 1.0, 0.0,
        0.5, -0.5, -0.5, 0, -1, 0, 1.0, 1.0,
    ];
    indices = [
        0, 1, 2, 2, 3, 0,
        4, 5, 6, 6, 7, 4,
        8, 9, 10, 10, 11, 8,
        12, 13, 14, 14, 15, 12,
        16, 17, 18, 18, 19, 16,
        20, 21, 22, 22, 23, 20]; camera = new Camera(); camera.setPerspectiveProjection(70.0, canvas.width / canvas.height, 0.001, 1000.0); camera.position = new Vector3(-5, 2, 0); camera.orientation = new Quaternion(0, 1, 0, 1); camera.updateView(0);
    initTexturedMeshRenderer();
    initSkyboxRenderer();

    loadSkyboxFaceImage(skyboxImageData[0], 256, 256, "-x");
    loadSkyboxFaceImage(skyboxImageData[1], 256, 256, "-z");
    loadSkyboxFaceImage(skyboxImageData[2], 256, 256, "+x");
    loadSkyboxFaceImage(skyboxImageData[3], 256, 256, "+z");
    loadSkyboxFaceImage(skyboxImageData[4], 256, 256, "+y");
    loadSkyboxFaceImage(skyboxImageData[5], 256, 256, "-y");

    monkeyMesh = createTexturedMesh(vertices, indices);
    //monkeyMesh.textureID = generateGLTexture2D(monkeyPixels, 1024, 1024);
    monkeyMesh.orientation.rotate(new Vector3(0, 1, 0), -Math.PI);
    monkeyMesh.position.y = 2;
    let verts = [];
    let inds = [];
    generateUnitCubeVerticesIndexedWithNormalsTexCoords(verts, inds);
    //this.cubeMesh = createTexturedMesh(verts, inds);
    cubeMesh = createTexturedMesh(missileData[0], missileData[1]);
    cubeMesh.orientation.rotate(new Vector3(0, 1, 0), -Math.PI);
    meshes = [monkeyMesh, cubeMesh];

    startTime = new Date().getTime();


    monkeyMesh.position.x -= (.1);
    difficulty = 1;
    setInterval(updateFrame, 1);
    stopvar = setInterval(updateFrame, 1);

}

function checkIntersection(m1, m2) {
    dist = Vector3.sub(m1.position, m2.position);
    if (Vector3.length(dist) < 1) {
        m1.verts
        gl.clearColor(1, 0, 0, 1);
        isDead = true;

        console.log("should Be dead");

    } else {
        gl.clearColor(0.5, 0.7, 1.0, 1.0);

    }
}

function updateFrame() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    if (cubeMesh.position.z > destZ) {  //cubeMesh is missile mesh
        cubeMesh.position.z -= mvmtSpeed;
    } else if (cubeMesh.position.z < destZ) {
        cubeMesh.position.z += mvmtSpeed;
    }
    if (cubeMesh.position.y > destY) {
        cubeMesh.position.y -= mvmtSpeed;
    } else if (cubeMesh.position.y < destY) {
        cubeMesh.position.y += mvmtSpeed;
    }


    // verticalVelocity -= gravity * deltaTime;
    // cubeMesh.position.y += verticalVelocity;
    // if(cubeMesh.position.y < 0){
    //     cubeMesh.position.y = 0;
    //     jumping = false;
    // }

    cubeMesh.position.z = ((mouseX / canvas.width) * 8) - 4;
    cubeMesh.position.y = ((mouseY / canvas.height) * -8) + 6;

    if (monkeyMesh.position.x <= -7) {
        monkeyMesh.position.x = 80 / (difficulty);
        monkeyMesh.orientation.rotate(new Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360), 1 * deltaTime);
        monkeyMesh.position.z = (Math.random() - .5) * 8;
        monkeyMesh.position.y = Math.random() * 3;
        console.log("" + monkeyMesh.position.y);
    } else {
        monkeyMesh.position.x -= (.1 * difficulty);
        if (difficulty < 3) {
            difficulty += .001;
        } else {
            monkeyMesh.position.y += (cubeMesh.position.y - monkeyMesh.position.y) * .01;
            monkeyMesh.position.z += (cubeMesh.position.z - monkeyMesh.position.z) * .01;
        }

    }
    monkeyMesh.orientation.rotate(new Vector3(0, 0, 1), 1 * deltaTime);

    if (Vector3.length(Vector3.sub(monkeyMesh.position, cubeMesh.position)) < 1.2) {
        score = 0;
        difficulty = 1;
    }

    if (monkeyMesh.position.x <= -7) { //monkeyMesh is asteroid mesh 
        monkeyMesh.position.x = 20;
    } else {
        monkeyMesh.position.x -= speed;
    }
    monkeyMesh.orientation.rotate(new Vector3(0, 0, 1), 1 * deltaTime);

    camera.updateView(deltaTime);
    renderTexturedMeshes(meshes, camera, new Vector3(4, 4, 4));
    renderSkybox(camera.projectionMatrix, camera.orientation);

    textCtx.font = "30px Arial";
    textCtx.fillStyle = "white";
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    if (mainMenu) {
        textCtx.font = "100px Arial";
        textCtx.fillText("Press Space to Start Epic Game", 150, 200);
        difficulty = 1;
    } else {
        if (isDead) {
            textCtx.font = "100px Arial";
            textCtx.fillText("You're Dead! Press S to restart", 170, 200);
            clearInterval(stopvar);
            difficulty = 1;
        } else {
            textCtx.fillText("Score: " + score, 100, 100);
            textCtx.font = "30px Arial";
            textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
            textCtx.fillText("Score: " + score, 100, 100);
            score += deltaTime;
            checkIntersection(monkeyMesh, cubeMesh);
        }
    }
    endTime = new Date().getTime();
    deltaTime = (endTime - startTime) / 1000.0;
    startTime = endTime;

}
function keyUp(event) {
    console.log(camera.position);
    console.log(camera.orientation);

    switch (event.keyCode) {
        case KEY_S: {
            console.log("press works");
            if (isDead == true) {
                gl.clearColor(0.5, 0.7, 1.0, 1.0);
                cubeMesh.position.z = ((mouseX / canvas.width) * 2) + -1;
                monkeyMesh.position.x = 22;
                cubeMesh.position.y = ((mouseY / canvas.height) * -2) + 3;
                score = 0;
                startTime = new Date().getTime();
                stopvar = setInterval(updateFrame, 1);
            }
            isDead = false;
            console.log("respawned")
        }

    }
}

function mouseMove(evt) {
    mouseX = evt.x;
    mouseY = evt.y;
    destZ = (((mouseX / canvas.width) * 8) - 4);
    destY = (((mouseY / canvas.height) * -8) + 6);
}
function mouseDown(evt) {
    speed = 0.2;

    console.log("down");
}
function mouseUp(evt) {
    speed = 0.1;

    console.log("up");
}
var an = true;
function keyDown(event) {
    switch (event.keyCode) {
        case KEY_SPACE:
            mainMenu = !mainMenu;
            isDead = false;
            monkeyMesh.position.x = 20;
            break;
    }
}
