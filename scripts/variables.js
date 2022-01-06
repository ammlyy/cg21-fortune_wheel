// Light constants
const LIGHT_DECAY = 1.0;
const LIGHT_COLOR = [1.0, 1.0, 1.0, 1.0];
const DIFFUSE_COLOR = [1.0, 1.0, 1.0, 1.0];
const SPECULAR_COLOR = [1.0, 1.0, 1.0, 1.0];
const SPECULAR_SHINE = 150.0;
const AMBIENT_LIGHT_COLOR = [0.2, 0.2, 0.2, 1.0];
const AMBIENT_MATERIAL_COLOR = [1.0, 1.0, 1.0, 1.0];

var g_time = 0;
var startSpinning = false;
var last_rotation = 0;

var gl;
var program;
var meshes = [];
var textures = [];
var texturesURLs = ['/assets/wheel/wheelSurface_Color.png', '/assets/frame/frameSurface_color.png', '/assets/table/tableSurface_color.png']
var occlusions = []
const occURLs = ['/assets/wheel/wheelAmbient_Occlusion.png', '/assets/frame/frameAmbient_Occlusion.png']

var colors = [
    [0.411, 0.141, 0.596, 1.0], // 0 purple
    [0.117, 0.211, 0.619, 1.0], // 1 blue
    [0, 0.435, 0.745, 1.0], // 2 azure
    [0, 0.654, 0.737, 1.0], // 3 turqoise
    [0, 0.670, 0.376, 1.0], // 4 dark green
    [0.611, 0.823, 0.176, 1.0], // 5 light green
    [1, 0.949, 0, 1.0], // 6 yellow
    [1, 0.674, 0, 1.0], // 7 light orange
    [1, 0.482, 0, 1.0], // 8 orange
    [1, 0.278, 0, 1.0], // 9 dark  orange
    [1, 0.05, 0, 1.0], // 10 red
    [0.811, 0, 0.447, 1.0] // 11 pink
]