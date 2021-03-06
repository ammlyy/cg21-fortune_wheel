const CAMERA_TOP_OMEGA = 105;
const CAMERA_BOTTOM_OMEGA = 40;
const CAMERA_RIGHT_PHI = 50;
const CAMERA_LEFT_PHI = 130;
const CAMERA_SPHERE_RADIUS = 2.25;
const MAX_DEPTH = 2.5;
const MIN_DEPTH = 0.8;
const Y_WHEEL = 5.0;
const Z_WHEEL = 1.0;
const DELTA = 2

// camera diff vector: updated at event keydown/up and read at each frame
var camera_diff = { x: 0, y: 0};
// camera angles
var camera_angles = { phi: 90.0, omega: 90 };
var camera_depth = 1;
var camera_pos = [0.0, Y_WHEEL, Z_WHEEL + CAMERA_SPHERE_RADIUS];

var camera_target = [0.0, Y_WHEEL, Z_WHEEL];
var camera_up = [0.0, 1.0, 0.0];

document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case "KeyW":
            camera_diff.y = -DELTA;
            break;

        case "KeyA":
            camera_diff.x = DELTA;
            break;

        case "KeyS":
            camera_diff.y = DELTA;
            break;

        case "KeyD":
            camera_diff.x = -DELTA;
            break;

        case "KeyZ":
            if(camera_depth < MAX_DEPTH) camera_depth += 0.05;       // Zoom in
            break;

        case "KeyX":
            if(camera_depth > MIN_DEPTH) camera_depth += -0.05;      // Zoom out
            break;
    }

    camera_angles.phi += camera_diff.x;
    camera_angles.omega += camera_diff.y;

    if(camera_angles.omega < CAMERA_BOTTOM_OMEGA) camera_angles.omega = CAMERA_BOTTOM_OMEGA;
    else if(camera_angles.omega > CAMERA_TOP_OMEGA) camera_angles.omega = CAMERA_TOP_OMEGA;
    if(camera_angles.phi < CAMERA_RIGHT_PHI) camera_angles.phi = CAMERA_RIGHT_PHI;
    else if(camera_angles.phi > CAMERA_LEFT_PHI) camera_angles.phi = CAMERA_LEFT_PHI;
    radius = CAMERA_SPHERE_RADIUS/camera_depth;
    camera_pos[0] = radius * Math.sin(utils.degToRad(camera_angles.omega)) * Math.cos(utils.degToRad(camera_angles.phi));
    camera_pos[1] = Y_WHEEL + radius * Math.cos(utils.degToRad(camera_angles.omega));
    camera_pos[2] = Z_WHEEL + radius * Math.sin(utils.degToRad(camera_angles.omega)) * Math.sin(utils.degToRad(camera_angles.phi));

    /*console.log(camera_pos[0])
    console.log(camera_pos[1])
    console.log(camera_pos[2])*/

    camera_diff.x = 0;
    camera_diff.y = 0;
})