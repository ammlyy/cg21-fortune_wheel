// LIGHT CONSTANTS
const LA_DECAY = 1.0;
const LA_COLOR = [1.0, 1.0, 1.0, 1.0];

// Secondary light is fixed point light in the back with color changing according to the wheel result
const LB_TYPE = [0.0, 1.0];
const LB_POSITION = [0.0, 15.0, -15.0];
const LB_TARGET = 30.0;
const LB_DECAY = 1.0;

const DIFFUSE_COLOR = [1.0, 1.0, 1.0, 1.0];
const SPECULAR_COLOR = [1.0, 1.0, 1.0, 1.0];
const SPECULAR_SHINE = 150.0;
const AMBIENT_LIGHT_COLOR = [0.2, 0.2, 0.2, 1.0];
const AMBIENT_MATERIAL_COLOR = [1.0, 1.0, 1.0, 1.0];

// Textures
const TEXTURE_URLS = ['/assets/wheel/wheelSurface_Color.png', '/assets/frame/frameSurface_color.png', '/assets/table/tableSurface_color.png', '/assets/button/buttonSurface_Color.png']
const OCCLUSION_URLS = ['/assets/wheel/wheelAmbient_Occlusion.png', '/assets/frame/frameAmbient_Occlusion.png']

var LBColor = [1.0, 1.0, 1.0, 1.0];   
var g_time = 0;
var startSpinning = false;
var last_rotation = 0;

var gl;
var program;
var meshes = [];
var textures = [];
var occlusions = [];

var worldMatrix;
var viewMatrix;
var projectionMatrix;
var buttonRaycastPlane;
var raycastCoordinates;

const colors = [
  [1, 0.482, 0, 1.0], // 0 orange
  [1, 0.05, 0, 1.0], // 1 red
  [0.411, 0.141, 0.596, 1.0], // 2 purple
  [0.117, 0.211, 0.619, 1.0], // 3 blue
  [0, 0.435, 0.745, 1.0], // 4 azure
  [0, 0.670, 0.376, 1.0], // 5 dark green
  [1, 0.949, 0, 1.0], // 6 yellow
]

const CHORDS = [
  [0, 4, 7],  // I major
  [0, 3, 7],  // II minor
  [0, 3, 7],  // III minor
  [0, 4, 7],  // IV major
  [0, 4, 7], // V major
  [0, 3, 7], // VI minor
  [0, 3, 6] // VII diminished
]

const CHORDS_text = [
  "I maj",
  "II min",
  "III min",
  "IV maj",
  "V maj",
  "VI min",
  "VII dim",
]

const degree = [0, 2, 4, 5, 7, 9, 11] // major
const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

var sz = 1.0 

var raycast = {
  dot: function (a, b) {
      return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n)
  },
  addVector: function (a, b){
  return a.map((e,i) => e + b[i]);
  },
  scaleVector: function (vec, s){
      return vec.map((e) => e * s);
  },

  // fast and easy algorithm for calculating the intersection between a plane and a line.
  // Note: the line cannot be coplanar with the plane
  linePlaneIntersection: function (planePoints, rayPoint1, rayDirection) {
      // l_a = rayPoint1
      // l_b = rayPoint2
      // l_ab = rayDir
      let rayPoint2 = this.addVector(rayDirection, rayPoint1);
      let rayDir = utils.subtractVectors(rayPoint2, rayPoint1);
      let planeDir01 = utils.subtractVectors(planePoints.p1, planePoints.p0);
      let planeDir02 = utils.subtractVectors(planePoints.p2, planePoints.p0);

      let planeCross = utils.cross(planeDir01, planeDir02);
      let numerator = this.dot(planeCross, utils.subtractVectors(rayPoint1, planePoints.p0));
      let denominator = this.dot(utils.subtractVectors([0, 0, 0], rayDir), planeCross);
      let t = numerator / denominator;
      return this.addVector(rayPoint1, this.scaleVector(rayDir, t));
  }
}
