#version 300 es

precision mediump float;
in vec3 fsNormal;
in vec2 fsUV;
in vec3 fs_pos; 

out vec4 outColor;

void main() {
    outColor = vec4(1.0,0.0,0.0,1.0);
}
