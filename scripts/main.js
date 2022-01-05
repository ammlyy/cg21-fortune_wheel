var gl;
var program;
var meshes = [];
var textures = [];
var texturesURLs = ['/assets/wheel/wheelSurface_Color.png', '/assets/frame/frameSurface_color.png', '/assets/table/tableSurface_color.png']
var occlusions = []
const occURLs = ['/assets/wheel/wheelAmbient_Occlusion.png', '/assets/frame/frameAmbient_Occlusion.png']

var viewMatrix;
var worldMatrices = []
var perspectiveMatrix;

// Light parameters
var lightPosition = [0.0, 10.0, 0.0];
var lightDirection = [0.3, 0.1, 0.7];
var lightDecay = 1.0;
var lightType = [0.0, 1.0, 0.0];    //0: direct, 1: point, 2: spot
var diffuseType = [0.0, 0.0];       //0: Lambert, 1: Toon
var specularType = [0.0, 0.0];      //0: Phong, 1: Blinn
var lightColor = [1.0, 1.0, 1.0, 1.0];
var diffuseColor = [1.0, 1.0, 1.0, 1.0];
var specularColor = [1.0, 1.0, 1.0, 1.0];
var specularShine = 150.0;

var lightTarget = 60.0;   //Distance at which light reduction is 1

var spotLight = {
  c_in: 20,
  c_out: 70
}

var ambientLightColor = [0.2, 0.2, 0.2, 1.0];
var ambientMaterialColor = [1.0, 1.0, 1.0, 1.0];
var diffuseTexMix = 1.0;      //0: full color, 1: full texture
var diffuseToonTh = 0.5;

var eyePosition = [0.0, 0.0, 0.0];

var g_time = 0;
var startSpinning = false;
var last_rotation = 0;

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

  await loadMeshFromFile(baseDir + '/assets/frame/frame.obj').then((obj) => meshes.push(obj))
  await loadMeshFromFile(baseDir + '/assets/stand/stand.obj').then((obj) => meshes.push(obj))
  await loadMeshFromFile(baseDir + '/assets/wheel/wheel.obj').then((obj) => 
  {
     meshes.push(obj)
     wheelCenterY = findCenter(obj.vertices)
  })
  await loadMeshFromFile(baseDir + 'assets/table/table.obj').then((obj)=>meshes.push(obj))
  
  vaos = new Array(3)

  await loadShaders(shaderDir)
  gl.useProgram(program);

  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  setupUniforms()

  loadImages(occURLs)
  loadTextures()

  loadImages(occURLs)
  loadOcclusions()


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
  var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

  drawScene();

  function animate() {
    var currentTime = (new Date).getTime();
    
    if (lastUpdateTime && startSpinning) {
      var t =  ( (currentTime - lastUpdateTime) / 1000.0 )
      g_time += (utils.ExponentialImpulse(g_time+t, 1.0) / 100.0 )
      last_rotation = g_time % 1.00
    }
    else{
      g_time = last_rotation
    }
    lastUpdateTime = currentTime;

  }


  function drawScene() {
    animate()
    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var viewMatrix = utils.MakeView(0.0, 7.0, 10.0, -8.0, 0.0);
    eyePosition = [0.0, 7.0, 10.0];
    lightPosition = [
      document.getElementById('lposx').value / 10.0,
      document.getElementById('lposy').value / 10.0 ,
      document.getElementById('lposz').value / 10.0,
    ]
    spotLight.c_in = document.getElementById('conein').value / 100.0
    spotLight.c_out = document.getElementById('coneout').value / 100.0
    lightTarget = document.getElementById('target_distance').value


    // Set up lights
    gl.uniform3fv(lightPositionLocation, lightPosition);
    gl.uniform3fv(lightDirectionLocation, lightDirection);
    gl.uniform1f(lightDecayLocation, lightDecay);
    gl.uniform3fv(lightTypeLocation, lightType);
    gl.uniform2fv(diffuseTypeLocation, diffuseType);
    gl.uniform2fv(specularTypeLocation, specularType);
    gl.uniform4fv(lightColorLocation, lightColor);
    gl.uniform4fv(diffuseColorLocation, diffuseColor);
    gl.uniform1f(dTexMixLocation, diffuseTexMix);
    gl.uniform1f(dToonThLocation, diffuseToonTh);
    gl.uniform4fv(specularColorLocation, specularColor);
    gl.uniform1f(specularShineLocation, specularShine);

    gl.uniform1f(lightTargetLocation, lightTarget);

    gl.uniform1f(coneInLocation, spotLight.c_in);
    gl.uniform1f(coneOutLocation, spotLight.c_out);

    gl.uniform4fv(ambientLightColorLocation, ambientLightColor);
    gl.uniform4fv(ambientMaterialColorLocation, ambientMaterialColor);

    gl.uniform3fv(eyePosLocation, eyePosition);

    for (var i = 0; i < meshes.length; i++) {
      var worldMatrix = utils.MakeWorld(0.0, 0.0, 0.0, cx, cy, cz, 1.0)

      gl.uniform1f(isStandLocation, 0)

      if (i == 0) // frame
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, frame_tex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, frame_AO);
    if (i == 1){ // stand
        gl.uniform1f(isStandLocation, 1)
      } // WHEEEEEEL
      if (i == 2  ) {
        worldMatrix = utils.multiplyMatrices(worldMatrix, createRotMatrix(g_time))
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, wheel_tex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, wheel_AO);
      }
      if (i == 3){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, table_tex);

      }
      gl.uniform1i(textLocation, 0);
  
      var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
     
      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.invertMatrix(utils.transposeMatrix(worldMatrix))); 


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

async function loadImages(urls) {
  var imgs = []
  urls.forEach((url) => {
    var image = new Image();
    image.src = url;
    image.onload = function () {
      imgs.push(image)
    };

  })
}

function loadTextures() {
  wheel_tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, wheel_tex);

  var image = new Image();
  image.src = baseDir + texturesURLs[0];
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, wheel_tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  };

  frame_tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, frame_tex);

  var image2 = new Image();
  image2.src = baseDir + texturesURLs[1];
  image2.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, frame_tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  };


    table_tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, table_tex);
  
    var image3 = new Image();
    image3.src = baseDir + texturesURLs[2];
    image3.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, table_tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image3);
  
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  };
  

}

function loadOcclusions() {
  wheel_AO = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, wheel_AO);

  var image = new Image();
  image.src = baseDir + occURLs[0];
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, wheel_AO);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  };

  frame_AO = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, frame_AO);

  var image2 = new Image();
  image2.src = baseDir + occURLs[1];
  image2.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, frame_AO);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  };

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
  AOLocation = gl.getUniformLocation(program, "AO_texture")

  isStandLocation = gl.getUniformLocation(program, "isStand");

  // Lights
  lightTypeLocation = gl.getUniformLocation(program, "lightType");
  lightPositionLocation = gl.getUniformLocation(program, "lightPos");
  lightDirectionLocation = gl.getUniformLocation(program, "lightDir");
  lightDecayLocation = gl.getUniformLocation(program, "lightDecay");
  diffuseTypeLocation = gl.getUniformLocation(program, "diffuseType");
  specularTypeLocation = gl.getUniformLocation(program, "specularType");
  specularShineLocation = gl.getUniformLocation(program, "SpecShine")
  lightColorLocation = gl.getUniformLocation(program, "lightColor");
  diffuseColorLocation = gl.getUniformLocation(program, "diffuseColor");
  specularColorLocation = gl.getUniformLocation(program, "specularColor");
  lightTargetLocation = gl.getUniformLocation(program, "lightTarget");
  coneInLocation = gl.getUniformLocation(program, "coneIn");
  coneOutLocation = gl.getUniformLocation(program, "coneOut");
  ambientLightColorLocation = gl.getUniformLocation(program, "ambientLightColor");
  ambientMaterialColorLocation = gl.getUniformLocation(program, "ambientMatColor");
  dTexMixLocation = gl.getUniformLocation(program, "DTexMix");
  dToonThLocation = gl.getUniformLocation(program, "DThoonTh");
  eyePosLocation = gl.getUniformLocation(program, "eyePos");

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

function createRotMatrix(t){

	var translate_center = utils.MakeTranslateMatrix(0,wheelCenterY,0);	
	var rotation = utils.MakeRotateZMatrix(t*360);	

	
	var out = utils.multiplyMatrices(translate_center, utils.multiplyMatrices(rotation, utils.invertMatrix(translate_center)));
	return out;
}

function findCenter(vertices){
  const min = vertices.slice(0, 3);
  const max = vertices.slice(0, 3);
  for (let i = 3; i < vertices.length; i += 3) {
    for (let j = 0; j < 3; ++j) {
      const v = vertices[i + j];
      min[j] = Math.min(v, min[j]);
      max[j] = Math.max(v, max[j]);
    }
  }
  var cy = (max[1] - min[1]) / 2 + min[1]
  return cy;

}


window.onload = init;  