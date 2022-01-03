#version 300 es

precision mediump float;
in vec3 fsNormal;
in vec2 fsUV;
in vec3 fs_pos; 

uniform sampler2D in_texture;
uniform bool isStand;

out vec4 outColor;

void main() {
    if(isStand){
        outColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    else{
        outColor = texture(in_texture, fsUV);
    }
}
