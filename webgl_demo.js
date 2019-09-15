var canvas;
var gl;

var shaderProgram;

var vertexArray;
var vertexBuffer;
var iindexBuffer;
var positionAttribID;
var uvCoordID
var checkTexture;

window.onload = function(){
    canvas = document.getElementById("canvasID");
    gl = canvas.getContext("webgl2");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.5, 0.7, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let vertShader = document.getElementById("basicVertexID").text;
    let fragShader = document.getElementById("basicFragmentID").text;

    shaderProgram = compileGLShader(gl, vertShader, fragShader);
    gl.useProgram(shaderProgram);

    let vertices = [
        -0.5, -0.5, 0.0, 0.0,0.0,
        -0.5, 0.5, 0.0, 0.0, 1.0,
         0.5, 0.5, 0.0, 1,0 ,1.0,
         0.5,-0.5,0.0,1.0,0.0
    ];

    let indices = [
        0,1,2,2,3,0
    ];

    let texPixels = [
        0,0,0,255, 255,255,255,255,
        255,255,255,255, 0,0,0,255
    ]
    

    vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new this.Float32Array(vertices), gl.STATIC_DRAW);
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(indices),gl.STATIC_DRAW);

    checkTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,checkTexture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,2,2,0,gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(texPixels));
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR)
    positionAttribID = gl.getAttribLocation(shaderProgram, "position");
    uvCoordID = gl.getAttribLocation(shaderProgram, "uvCoordinate");
    gl.enableVertexAttribArray(positionAttribID);
    gl.enableVertexAttribArray(uvCoordID);
    gl.vertexAttribPointer(positionAttribID, 3, gl.FLOAT, gl.FALSE, 20, 0);
    gl.vertexAttribPointer(uvCoordID,2,gl.FLOAT,gl.FALSE,20,12)

    //gl.drawArrays(gl.TRIANGLES, 0, 3);
    //gl.drawArrays(gl.TRIANGLES,0,3);
    gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_INT,0);
}