#version 300 es

precision mediump float;
in vec3 fsNormal;
in vec2 fsUV;
in vec3 fs_pos; 

uniform sampler2D in_texture;
uniform sampler2D AO_texture;
uniform mat4 tMatrix;


uniform bool isStand;

out vec4 outColor;

void main() {
    vec2 uv = (tMatrix * vec4(fsUV.x, fsUV.y, 0.0, 1.0)).xy;

    if(isStand){
        outColor = vec4(1.0, 0.3, 0.2, 1.0);
    }
    else
    {
   vec4 color0 = texture(in_texture, uv);
   vec4 color1 = texture(AO_texture, uv);
   outColor = color0 * color1;    
   }
}
