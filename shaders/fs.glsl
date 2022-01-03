#version 300 es

precision mediump float;
in vec3 fsNormal;
in vec2 fsUV;
in vec3 fs_pos; 

uniform sampler2D in_texture;
uniform bool isStand;

// Lights
uniform vec3 lightPos;
uniform vec3 lightDir;
uniform float lightDecay;    
uniform vec3 lightType;         // indexes: 0-direct, 1-point, 2-spot
uniform vec2 diffuseType;       // indexes: 0-Lambert, 1-Toon
uniform vec2 specularType;      // indexes: 0-Phong, 1-Blinn    
uniform vec4 lightColor;
uniform vec4 diffuseColor;
uniform float DTexMix;
uniform float DToonTh;
uniform vec4 specularColor;
uniform float SpecShine;

uniform float lightTarget;

uniform float coneIn;
uniform float coneOut;

uniform vec4 ambientLightColor;
uniform vec4 ambientMatColor;

uniform vec3 eyePos;

out vec4 outColor;

vec3 computeDirection(){
    // Direct
    vec3 directLightDir = lightDir;
    // Point
    vec3 pointLightDir = normalize(lightPos - fs_pos);
    // Spot
    vec3 spotLightDir = pointLightDir;

    return directLightDir * lightType.x + pointLightDir * lightType.y + spotLightDir * lightType.z;
}

vec4 computeColor(){
    float LCosOut = cos(radians(coneOut / 2.0));
	float LCosIn = cos(radians(coneOut * coneIn / 2.0));

    // Direct
    vec4 directLightCol = lightColor;
    // Point
    vec4 pointLightCol = lightColor * pow(lightTarget / length(lightPos - fs_pos), lightDecay);
    // Spot
    vec4 spotLightCol = lightColor * pow(lightTarget / length(lightPos - fs_pos), lightDecay) *
                        clamp((dot(normalize(lightPos - fs_pos), lightDir) - LCosOut) / (LCosIn - LCosOut), 0.0, 1.0);

    return directLightCol * lightType.x + pointLightCol * lightType.y + spotLightCol * lightType.z;
}

vec4 computeDiffuse(vec3 lightDir, vec4 lightCol, vec4 diffColor, vec3 normalVec) {
    float LdotN = max(0.0, dot(normalVec, lightDir));
    vec4 LDcol = lightCol * diffColor;

    // Lambert
    vec4 diffuseLambert = LDcol * LdotN;
    // Toon
    vec4 diffuseToon = max(sign(LdotN - DToonTh), 0.0) * LDcol;

    return diffuseLambert * diffuseType.x + diffuseToon * diffuseType.y;
}

vec4 computeSpecular(vec3 lightDir, vec4 lightCol, vec3 normalVec, vec3 eyedirVec) {
    float LdotN = max(0.0, dot(normalVec, lightDir));
	vec3 reflection = -reflect(lightDir, normalVec);
	float LdotR = max(dot(reflection, eyedirVec), 0.0);
	vec3 halfVec = normalize(lightDir + eyedirVec);
	float HdotN = max(dot(normalVec, halfVec), 0.0);
	
	vec4 LScol = lightCol * specularColor * max(sign(LdotN),0.0);
	// --> Phong
	vec4 specularPhong = LScol * pow(LdotR, SpecShine);
	// --> Blinn
	vec4 specularBlinn = LScol * pow(HdotN, SpecShine);

    return specularPhong * specularType.x + specularBlinn * specularType.y;
}

vec4 computeAmbient(vec4 ambColor) {
    return ambientLightColor * ambColor;
}

void main() {
    vec4 texcol = texture(in_texture, fsUV);
    vec4 diffColor = diffuseColor*(1.0 - DTexMix) + texcol*DTexMix; 
    vec4 ambColor = ambientMatColor*(1.0 - DTexMix) + texcol*DTexMix;
    vec3 normalVec = normalize(fsNormal);
    vec3 eyedirVec = normalize(eyePos - fs_pos);

    // lights
    vec3 lightDirection = computeDirection();
    vec4 lightColor = computeColor();

    // diffuse
    vec4 diffuse = computeDiffuse(lightDirection, lightColor, diffColor, normalVec);

    // specular
    vec4 specular = computeSpecular(lightDirection, lightColor, normalVec, eyedirVec);

    // ambient
    vec4 ambient = computeAmbient(ambColor);

    vec4 color = clamp(ambient + diffuse + specular, 0.0, 1.0);

    outColor = vec4(color.rgb, 1.0);
}
