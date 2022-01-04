#version 300 es

precision mediump float;
in vec3 fsNormal;
in vec2 fsUV;
in vec3 fs_pos; 

uniform sampler2D in_texture;
uniform sampler2D AO_texture;

uniform float isStand;

// SPOT lights
uniform vec3 lightPos; // using as direction
uniform float lightDecay;    
uniform vec4 lightColor;
uniform float lightTarget;
uniform float coneIn;
uniform float coneOut;
uniform vec4 diffuseColor;

uniform vec4 ambientLightColor;
uniform vec4 ambientMatColor;

uniform vec3 eyePos;
uniform float SpecShine;
uniform vec4 specularColor;

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

vec4 computeSpecular(vec3 lightDir, vec4 lightCol, vec3 normalVec, vec3 eyedirVec) {
    float LdotN = max(0.0, dot(normalVec, lightDir));
	vec3 reflection = -reflect(lightDir, normalVec);
	float LdotR = max(dot(reflection, eyedirVec), 0.0);
	vec3 halfVec = normalize(lightDir + eyedirVec);
	
	vec4 LScol = lightCol * specularColor * max(sign(LdotN),0.0);
	// --> Phong
	vec4 specularPhong = LScol * pow(LdotR, SpecShine);

    return specularPhong;
}

vec4 computeAmbient(vec4 ambColor) {
    return ambientLightColor * ambColor;
}

void main(){   
    vec4 texcol = (1.0 - isStand)*(texture(in_texture, fsUV) * texture(AO_texture, fsUV)) + isStand * vec4(0.2, 0.2, 0.2, 1.0);
    vec4 diffColor = diffuseColor*0.1 + texcol*0.9;
    vec4 ambColor = ambientMatColor*0.1 + texcol*0.9;
    vec3 eyedirVec = normalize(eyePos - fs_pos);

    vec3 lightDirection = computeDirection();
    vec4 lightColor = computeColor(lightDirection);

    vec4 diffuse = computeDiffuse(lightDirection, lightColor, diffColor, normalize(fsNormal));
    vec4 specular = computeSpecular(lightDirection, lightColor, normalize(fsNormal), eyedirVec);
    vec4 ambient = computeAmbient(ambColor);

    outColor = vec4(clamp(diffuse + specular + ambient, 0.0, 1.0).rgb, 1.0);
    

}