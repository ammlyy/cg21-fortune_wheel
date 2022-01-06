// Light constants
const LIGHT_DECAY = 1.0;
const LIGHT_COLOR = [1.0, 1.0, 1.0, 1.0];
const DIFFUSE_COLOR = [1.0, 1.0, 1.0, 1.0];
const SPECULAR_COLOR = [1.0, 1.0, 1.0, 1.0];
const SPECULAR_SHINE = 150.0;
const AMBIENT_LIGHT_COLOR = [0.2, 0.2, 0.2, 1.0];
const AMBIENT_MATERIAL_COLOR = [1.0, 1.0, 1.0, 1.0];

// Textures
const TEXTURE_URLS = ['/assets/wheel/wheelSurface_Color.png', '/assets/frame/frameSurface_color.png', '/assets/table/tableSurface_color.png']
const OCCLUSION_URLS = ['/assets/wheel/wheelAmbient_Occlusion.png', '/assets/frame/frameAmbient_Occlusion.png']

var g_time = 0;
var startSpinning = false;
var last_rotation = 0;

var gl;
var program;
var meshes = [];
var textures = [];
var occlusions = []

const colors = [
  [1, 0.482, 0, 1.0], // 0 orange
  [1, 0.05, 0, 1.0], // 1 red
  [0.411, 0.141, 0.596, 1.0], // 2 purple
  [0.117, 0.211, 0.619, 1.0], // 3 blue
  [0, 0.435, 0.745, 1.0], // 4 azure
  [0, 0.670, 0.376, 1.0], // 5 dark green
  [1, 0.949, 0, 1.0], // 6 yellow
]

const chords = [
  [0, 3, 7],  // I major
  [0, 2, 7],  // II minor
  [0, 2, 7],  // III minor
  [0, 3, 7],  // IV major
  [0, 3, 7], // V major
  [0, 2, 7], // VI minor
  [0, 3, 6] // VII diminished
]

const degree = [0, 2, 4, 5, 7, 9, 11] // major