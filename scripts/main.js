var gl;
var meshes = {};
var textures = {};
var buffers = []
var viewMatrix;
var worldMatrices = []
var perspectiveMatrix;

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

    buffers.push(addMesh(meshes.frame))
    buffers.push(addMesh(meshes.stand))
    buffers.push(addMesh(meshes.wheel))

    draw()
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
    gl.useProgram(program);
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

function draw(){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  viewMatrix = utils.MakeView(3.0, 3.0, 2.5, -45.0, 0);
  perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width/gl.canvas.height, 0.1, 100.0);

  for (var i=0; i<3; i++) {
    worldMatrices[i] = utils.MakeWorld(0.0, 0.0, -3.0, 0.0, 0.0, 0.5);
    var worldViewMatrix = utils.multiplyMatrices(viewMatrix, worldMatrices[i]);
    var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);

    var normalTransformationMatrix = utils.invertMatrix(utils.transposeMatrix(worldMatrices[i])); 

    const uniforms = {
      matrix: utils.transposeMatrix(projectionMatrix),
      normalMatrix: utils.transposeMatrix(normalTransformationMatrix),
      posMatrix: utils.transposeMatrix(worldViewMatrix)
    }

    twgl.setBuffersAndAttributes(gl, program, buffers[i]);
    twgl.setUniforms(program, uniforms);
    twgl.drawBufferInfo(gl, buffers[i]);
    requestAnimationFrame(draw);

  }


}


window.onload = init;  