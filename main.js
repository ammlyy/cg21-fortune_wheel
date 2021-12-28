var gl;
var app = {};
    app.meshes = {};

async function init(){
    this.gl = document.getElementById("canva").getContext("webgl2")

    if(!gl){
        console.log("webgl2 context not found")
        return
    }

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    await loadMesh()
}

async function loadMesh(){
    OBJ.downloadMeshes({
        'frame': 'assets/frame/frame.obj', // located in the models folder on the server
        'stand': 'assets/stand/stand.obj',
        'wheel': 'assets/wheel/wheel.obj'
      }, initMeshes);}

function initMeshes(meshes){
    app.meshes = meshes;
    // initialize the VBOs
    OBJ.initMeshBuffers(gl, app.meshes.suzanne);
    OBJ.initMeshBuffers(gl, app.meshes.sphere);
}
  
async function loadShaders(){

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