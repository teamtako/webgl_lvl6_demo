var canvas;
var gl;

var shaderProgram;

var vertexArray;
var vertexBuffer;
var iindexBuffer;
var positionAttribID;
var normalID;
var uvCoordID;
var checkTexture;
var monkeyTexture;

var projectionViewMatrixID;
var modelMatrixID;

var lightColorID;
var lightPositionID;
var cameraPositionID;

var lightColor;
var lightPosition;

var indices;

var camera;

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

class TexturedMesh {
    constructor(){
        this.indexCount;
        this.indexOffset;
    }
}

window.onload = function(){
    window.addEventListener("keyup", keyUp);
    window.addEventListener("keydown", keyDown);

    canvas = document.getElementById("canvasID");
    gl = canvas.getContext("webgl2");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.5, 0.7, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    let vertShader = document.getElementById("basicVertexID").text;
    let fragShader = document.getElementById("basicFragmentID").text;

    shaderProgram = compileGLShader(gl, vertShader, fragShader);
    gl.useProgram(shaderProgram);

    let texPixels = [
        0, 0, 0, 255,   255, 255, 255, 255,
        255, 255, 255, 255,     0, 0, 0, 255
    ]
    verts = [];
    inds = [];
    generateUnitCubeVerticesIndexedWithNormalsTexCoords(verts, inds);


    checkTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, checkTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(texPixels));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    monkeyTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, monkeyTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(monkeyPixels));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    
    vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(monkeyData[0]), gl.STATIC_DRAW);
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(monkeyData[1]), gl.STATIC_DRAW);

    positionAttribID = gl.getAttribLocation(shaderProgram, "position");
    normalID = gl.getAttribLocation(shaderProgram, "normal");
    uvCoordID = gl.getAttribLocation(shaderProgram, "uvCoordinate");

    projectionViewMatrixID = gl.getUniformLocation(shaderProgram, "projectionViewMatrix");
    modelMatrixID = gl.getUniformLocation(shaderProgram, "modelMatrix");

    lightColorID = gl.getUniformLocation(shaderProgram, "lightColor");
    lightPositionID = gl.getUniformLocation(shaderProgram, "lightPosition");
    cameraPositionID = gl.getUniformLocation(shaderProgram, "cameraPosition");

    camera = new Camera();
    camera.setPerspectiveProjection(70.0, canvas.width / canvas.height, 0.001, 1000.0);
    camera.position.z += 5;
    camera.updateView(0);

    lightColor = new Vector3(1, 1, 1);
    lightPosition = new Vector3(2, 2, 2);
    
    gl.uniformMatrix4fv(projectionViewMatrixID, gl.FALSE, camera.viewMatrix.m);    
    gl.uniformMatrix4fv(modelMatrixID, gl.FALSE, new Matrix4().m);

    gl.enableVertexAttribArray(positionAttribID);
    gl.enableVertexAttribArray(normalID);
    gl.enableVertexAttribArray(uvCoordID);
    gl.vertexAttribPointer(positionAttribID, 3, gl.FLOAT, gl.FALSE, 32, 0);
    gl.vertexAttribPointer(normalID, 3, gl.FLOAT, gl.FALSE, 32, 12);
    gl.vertexAttribPointer(uvCoordID, 2, gl.FLOAT, gl.FALSE, 32, 24);

    gl.drawElements(gl.TRIANGLES, monkeyData[1].length, gl.UNSIGNED_INT, 0);

    setInterval(updateFrame, 1);
}

function updateFrame(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    camera.updateView(0.01);
    
    gl.uniform3fv(cameraPositionID, camera.position.toArray());
    gl.uniform3fv(lightPositionID, lightPosition.toArray());
    gl.uniform3fv(lightColorID, lightColor.toArray());

    gl.uniformMatrix4fv(projectionViewMatrixID, gl.FALSE, camera.viewMatrix.m);    
    gl.uniformMatrix4fv(modelMatrixID, gl.FALSE, new Matrix4().m);

    gl.drawElements(gl.TRIANGLES, monkeyData[1].length, gl.UNSIGNED_INT, 0);
}

function keyUp(event){ 
    switch(event.keyCode){
        case KEY_W:{
            camera.moveForward = false;
            break;
        }
        case KEY_A:{
            camera.moveLeft = false;
            break;
        }
        case KEY_S:{
            camera.moveBack = false;
            break;
        }
        case KEY_D:{
            camera.moveRight = false;
            break;
        }
        case KEY_R:{
            camera.moveUp = false;
            break;
        }
        case KEY_F:{
            camera.moveDown = false;
            break;
        }
        case KEY_UP:{
            camera.pitchUp = false;
            break;
        }
        case KEY_DOWN:{
            camera.pitchDown = false;
            break;
        }
        case KEY_LEFT:{
            camera.yawLeft = false;
            break;
        }
        case KEY_RIGHT:{
            camera.yawRight = false;
            break;
        }
        case KEY_Q:{
            camera.rollLeft = false;
            break;
        }
        case KEY_E:{
            camera.rollRight = false;
            break;
        }
    }
}

var an = true;
function keyDown(event){
    switch(event.keyCode){
        case KEY_W:{
            camera.moveForward = true;
            break;
        }
        case KEY_A:{
            camera.moveLeft = true;
            break;
        }
        case KEY_S:{
            camera.moveBack = true;
            break;
        }
        case KEY_D:{
            camera.moveRight = true;
            break;
        }
        case KEY_R:{
            camera.moveUp = true;
            break;
        }
        case KEY_F:{
            camera.moveDown = true;
            break;
        }
        case KEY_UP:{
            camera.pitchUp = true;
            break;
        }
        case KEY_DOWN:{
            camera.pitchDown = true;
            break;
        }
        case KEY_LEFT:{
            camera.yawLeft = true;
            break;
        }
        case KEY_RIGHT:{
            camera.yawRight = true;
            break;
        }
        case KEY_Q:{
            camera.rollLeft = true;
            break;
        }
        case KEY_E:{
            camera.rollRight = true;
            break;
        }
    }
}