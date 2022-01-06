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


var colors = [
    '692498', // 0 purple
    '1e369e', // 1 blue
    '006fbe', // 2 azure
    '00a7bc', // 3 turqoise
    '00ab60', // 4 dark green
    '9cd22d', // 5 light green
    'fff200', // 6 yellow
    'ffac00', // 7 light orange
    'ff7b00', // 8 orange
    'ff4700', // 9 dark  orange
    'ff0000', // 10 red
    'cf0072', // 11 pink


]