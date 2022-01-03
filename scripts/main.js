var gl;
var program;
var meshes = [];
var textures = {};
var viewMatrix;
var worldMatrices = []
var perspectiveMatrix;

async function init() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  baseDir = window.location.href.replace(page, '');
  shaderDir = baseDir + "shaders/";
  gl = document.getElementById("canva").getContext("webgl2")

  if (!gl) {
    console.log("webgl2 context not found")
    return
  }

  await loadMeshFromFile(baseDir + '/assets/frame/frame.obj').then((obj)=>meshes.push(obj))
  await loadMeshFromFile(baseDir + '/assets/stand/stand.obj').then((obj)=>meshes.push(obj))
  await loadMeshFromFile(baseDir + '/assets/wheel/wheel.obj').then((obj)=>meshes.push(obj))
  vaos = new Array(3)

  await loadShaders(shaderDir)
  gl.useProgram(program);

  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  setupUniforms()

  for (let i = 0; i < meshes.length; i++) {
    fillBuffers(i)
  }

  main()

}


function main() {
  var lastUpdateTime = (new Date).getTime();
  var cx = 0.0;
  var cy = 0.0;
  var cz = 0.0;
  var cs = 0.5;
  var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

  var texture1 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  // Asynchronously load an image
  var image = new Image();
  image.src = baseDir + "assets/wheel/wheelSurface_Color.png";
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.generateMipmap(gl.TEXTURE_2D); 
  };

  var texture2 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture2);

  var image2 = new Image();
  image2.src = baseDir + "assets/frame/frameSurface_Color.png";
  image2.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.generateMipmap(gl.TEXTURE_2D); 
  };

  drawScene();

  function animate() {
    var currentTime = (new Date).getTime();
    if(lastUpdateTime){
      var deltaC = (30*(currentTime - lastUpdateTime)) / 1000.0;
      cx += deltaC;
    }

    worldMatrix = utils.MakeWorld(0.0, 0.0, 0.0, cx, cy, cz, 1.0);

    lastUpdateTime = currentTime;               

  }


  function drawScene() {
    animate();

    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var viewMatrix = utils.MakeView(0.0, 3.0, 6.0, -5.0, 0.0);

    for (var i = 0; i < 3; i++) {
      var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
     
      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniform1i(isStandLocation, 0)

      gl.activeTexture(gl.TEXTURE0);
      if (i == 0) // frame
        gl.bindTexture(gl.TEXTURE_2D, texture2);
      if (i == 1){ // stand
        gl.uniform1i(isStandLocation, 1)
      } // WHEEEEEEL
      if (i == 2  ) {
        gl.bindTexture(gl.TEXTURE_2D, texture1);
      }
      gl.uniform1i(textLocation, 0);
  
      gl.bindVertexArray(vaos[i]);
      gl.drawElements(gl.TRIANGLES, meshes[i].indices.length, gl.UNSIGNED_SHORT, 0 );
  
    }

    window.requestAnimationFrame(drawScene)

  }
}

async function loadMeshFromFile(path) {
  let str = await utils.get_objstr(path);
  let mesh = new OBJ.Mesh(str);
  return mesh;
}

async function loadShaders(path) {
  await utils.loadFiles([path + 'vs.glsl', path + 'fs.glsl'], function
    (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
    program = utils.createProgram(gl, vertexShader, fragmentShader);
  });
}


function setupUniforms() {
  positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  uvAttributeLocation = gl.getAttribLocation(program, "in_uv");

  matrixLocation = gl.getUniformLocation(program, "matrix");
  normalMatrixPositionHandle = gl.getUniformLocation(program, "normMatrix");
  vertexMatrixPositionHandle = gl.getUniformLocation(program, "posMatrix");

  textLocation = gl.getUniformLocation(program, "in_texture");

  isStandLocation = gl.getUniformLocation(program, "isStand");


}

function fillBuffers(i) {
  let mesh = meshes[i];
  let vao = gl.createVertexArray();
  vaos[i] = vao;
  gl.bindVertexArray(vao);

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(uvAttributeLocation);
  gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

}


window.onload = init;  