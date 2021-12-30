#version 300 es

precision mediump float;
in vec3 fsNormal;
in vec2 fsUV;
in vec3 fs_pos; 

uniform sampler2D in_texture;

out vec4 outColor;

void main() {
    outColor = texture(in_texture, fsUV);
}
