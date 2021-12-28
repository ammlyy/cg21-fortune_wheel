var gl;
var meshes = {};
var textures = {};
var buffers = {}

async function init(){
    this.gl = document.getElementById("canva").getContext("webgl2")

    if(!gl){
        console.log("webgl2 context not found")
        return
    }

    
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    shaderDir = baseDir+"shaders/";

    meshes.frame = await loadMeshFromFile(baseDir + '/assets/frame/frame.obj')
    meshes.stand = await loadMeshFromFile(baseDir + '/assets/stand/stand.obj')
    meshes.wheel = await loadMeshFromFile(baseDir + '/assets/wheel/wheel.obj')
    await loadShaders(shaderDir)
    
    textures = await loadTextures()

    buffers.frame = addMesh(meshes.frame)
    buffers.stand = addMesh(meshes.stand)
    buffers.wheel = addMesh(meshes.wheel)

    console.log(buffers)
    
  }
  
async function loadMeshFromFile(path){
    let str = await utils.get_objstr(path);
    let mesh = new OBJ.Mesh(str);
    return mesh;
}


async function loadShaders(path){
  await utils.loadFiles([path + 'vs.glsl', path + 'fs.glsl'], function
  (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
    program = utils.createProgram(gl, vertexShader, fragmentShader);
  });
}

async function loadTextures(){
  return twgl.createTextures(gl, {
    wheel: { src: "/assets/wheel/wheelSurface_Color.png"},
    frame: { src: "/assets/frame/frameSurface_Color.png"}
  });

}

function addMesh(mesh){

  const arrays = {
    position: mesh.vertices,
    normal:   mesh.vertexNormals,
    texcoord: mesh.textures,
    indices:  mesh.indices,
  };
  return twgl.createBufferInfoFromArrays(gl, arrays);

}




init()
  
/*
setupCanvas();
setUpMouseControls();

await loadShaders();
await loadMeshes();

textScoreHandle = document.getElementById("text");
gameOverTextHandle = document.getElementById("gameOver");
gameOverDiv = document.getElementById("gameOverDiv");

dirLightAlphaHandle = document.getElementById("dirLightAlpha");
dirLightBetaHandle = document.getElementById("dirLightBeta");

pointLight_xHandle = document.getElementById("positionX");
pointLight_zHandle = document.getElementById("positionY");
pointLight_yHandle = document.getElementById("positionZ");

initializeGame();    
main();

// prepare canvas and body styles
function setupCanvas(){
  canvas = document.getElementById("canvas");
  gl = canvas.getContext("webgl2");

  if (!gl) {
    document.write("GL context not opened");
    return;
  }
  utils.resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

//load shaders
async function loadShaders() {
  // initialize resource paths
  var path = window.location.pathname;
  var page = path.split("/").pop();
  baseDir = window.location.href.replace(page, '');

  shaderDir = baseDir + "shaders/";
  modelsDir = baseDir + "models/";

   //load vertex and fragment shaders from file
  await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
    program = utils.createProgram(gl, vertexShader, fragmentShader);
  });

  gl.useProgram(program);
}

async function loadMeshes(){

  //ball
  ballMesh = await utils.loadMesh((modelsDir + "red_palette/ball_white.obj"));
  //paddle
  paddleMesh = await utils.loadMesh((modelsDir + "red_palette/normal_red_1.obj"));
  //left wall
  wallMeshLeft = await utils.loadMesh((modelsDir + "red_palette/dark_red.obj"));
  //right wall
  wallMeshRight = await utils.loadMesh((modelsDir + "red_palette/dark_red.obj"));
  //upper wall
  wallMeshUp = await utils.loadMesh((modelsDir + "red_palette/dark_red.obj"));

  allMeshes = [ballMesh,paddleMesh, wallMeshRight, wallMeshLeft, wallMeshUp];


  //two bottom lines
  for(let i = 0; i < 10; i++){
    allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/darkest.obj"));
  }
  for(let i = 0; i < 10; i++){
    allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/darkest.obj"));
  }

  // load bricks CG
  for(let i = 0; i < 9; i++){
    allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/very_light_grey.obj"));
  }
  for(let i = 0; i < 3; i++){
    allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/light_grey.obj"));
  }
  for(let i = 0; i < 5; i++){
    allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/grey.obj"));
  }
  for(let i = 0; i < 2; i++){
    allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/light_grey.obj"));
  }
  //bottom
  for(let i = 0; i < 9; i++){
    allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/very_light_grey.obj"));
  }


  //2 upper lines
  for(let i = 0; i < 10; i++){
    allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/darkest.obj"));
  }
  for(let i = 0; i < 10; i++){
    allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/darkest.obj"));
  }
}*/