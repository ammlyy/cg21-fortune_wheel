#version 300 es

precision mediump float;
in vec3 fsNormal;
in vec2 fsUV;
in vec3 fs_pos; 

uniform sampler2D in_texture;
uniform sampler2D AO_texture;

uniform bool isStand;

// SPOT lights
uniform vec3 lightPos; // using as direction
uniform float lightDecay;    
uniform vec4 lightColor;
uniform float lightTarget;
uniform float coneIn;
uniform float coneOut;
uniform vec4 diffuseColor;


out vec4 outColor;

vec4 computeColor(vec3 lightDir){
    float LCosOut = cos(radians(coneOut / 2.0));
	float LCosIn = cos(radians(coneOut * coneIn / 2.0));

    // Spot
    vec4 spotLightCol = lightColor * 
                        pow(lightTarget / length(lightPos - fs_pos), 0.0)*
                        clamp((dot(normalize(lightPos - fs_pos), lightDir) - LCosOut) / (LCosIn - LCosOut), 0.0, 1.0);

    return spotLightCol;
}

vec3 computeDirection(){
    // Spot
    vec3 spotLightDir = normalize(normalize(lightPos) - fs_pos);

    vec3 DirectLightDir = lightPos;

    return spotLightDir;
}

vec4 computeDiffuse(vec3 lightDir, vec4 lightCol, vec4 diffColor, vec3 normalVec) {
    float LdotN = max(0.0, dot(normalVec, lightDir));
    vec4 LDcol = lightCol * diffColor;

    // Lambert
    vec4 diffuseLambert = LDcol * LdotN;

    return diffuseLambert;
}

void main(){   
    
    vec3 lightDirection = computeDirection();
    vec4 lightColor = computeColor(lightDirection);

    vec4 texcol = texture(in_texture, fsUV) * texture(AO_texture, fsUV);
    vec4 diffColor = diffuseColor*0.5 + texcol*0.5;

    vec4 diffuse = computeDiffuse(lightDirection, lightColor, diffColor, normalize(fsNormal));

    outColor = vec4(clamp(diffuse, 0.0, 1.0).rgb, 1.0);
    

}