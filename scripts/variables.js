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
var lightPosition = [0.0, 2.0, 0.0];
var lightDirection = [0.0, 1.0, 0.0];
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


var colors = [

  [1, 0.482, 0, 1.0], // 0 orange
  [1, 0.05, 0, 1.0], // 1 red
  [0.411, 0.141, 0.596, 1.0], // 2 purple
  [0.117, 0.211, 0.619, 1.0], // 3 blue
  [0, 0.435, 0.745, 1.0], // 4 azure
  [0, 0.670, 0.376, 1.0], // 5 dark green
  [1, 0.949, 0, 1.0], // 6 yellow
]


var chords = [
  [0, 3, 7],  // I major
  [0, 2, 7],
  [0, 2, 7],
  [0, 3, 7],
  [0, 3, 7],
  [0, 2, 7], // VI minor
  [0, 3, 6] // VII diminished
]

var degree = [0, 2, 4, 5, 7, 9, 11] // major