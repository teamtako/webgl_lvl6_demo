var canvas;
var gl;

var shaderProgram;

var vertexArray;
var vertexBuffer;

var positionAttribID;

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
        -0.5, -0.5, 0.0, 
        -0.5, 0.5, 0.0,
         0.5, 0.5, 0.0
    ];

    vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new this.Float32Array(vertices), gl.STATIC_DRAW);

    positionAttribID = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(positionAttribID);
    gl.vertexAttribPointer(positionAttribID, 3, gl.FLOAT, gl.FALSE, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

}