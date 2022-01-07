#version 300 es

precision mediump float;
in vec3 fsNormal;
in vec2 fsUV;
in vec3 fs_pos; 

uniform sampler2D in_texture;
uniform sampler2D AO_texture;

uniform float isStand;

// Primary light
uniform vec2 LAType;        // indexes: 0-direct, 1-point
uniform vec3 LAPos;
uniform vec3 LADir;
uniform vec4 LACol;
uniform float LATarget;
uniform float LADecay;

// Secondary light (fixed point light)
uniform vec2 LBType;
uniform vec3 LBPos;
uniform vec4 LBCol;
uniform float LBTarget;
uniform float LBDecay;

// Shared parameters
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float SpecShine;
uniform vec3 eyePos;

uniform vec4 ambientLightColor;
uniform vec4 ambientMatColor;

out vec4 outColor;

vec3 computeDirection(vec2 lightType, vec3 lightPos){
    // direct
    vec3 directLightDir = LADir;
    // Point
    vec3 pointLightDir = normalize(lightPos - fs_pos);

    return directLightDir * lightType.x + pointLightDir * lightType.y;
}


vec4 computeColor(vec2 lightType, vec3 lightDir, vec3 lightPos, vec4 lightCol, float lightTarget, float lightDecay){

    // Direct
    vec4 directLightCol = lightCol;
    // Point
    vec4 pointLightCol = lightCol * pow(lightTarget / length(lightPos - fs_pos), lightDecay);
    // Spot

    return directLightCol * lightType.x + pointLightCol * lightType.y;
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
    vec4 texcol = (1.0 - isStand)*(texture(in_texture, fsUV) * texture(AO_texture, fsUV)) + isStand * vec4(0.5, 0.5, 0.5, 1.0);
    vec4 diffColor = diffuseColor*0.1 + texcol*0.9;
    vec4 ambColor = ambientMatColor*0.1 + texcol*0.9;
    vec3 eyedirVec = normalize(eyePos - fs_pos);

    // Primary light 
    vec3 LADirection = computeDirection(LAType, LAPos);
    vec4 LAColor = computeColor(LAType, LADirection, LAPos, LACol, LATarget, LADecay);

    // Secondary light
    vec3 LBDirection = computeDirection(LBType, LBPos);
    vec4 LBColor = computeColor(LBType, LBDirection, LBPos, LBCol, LBTarget, LBDecay);

    // Diffuse
    vec4 diffuse = computeDiffuse(LADirection, LAColor, diffColor, normalize(fsNormal)) + 
                   computeDiffuse(LBDirection, LBColor, diffColor, normalize(fsNormal));

    // Specular
    vec4 specular = computeSpecular(LADirection, LAColor, normalize(fsNormal), eyedirVec) + 
                    computeSpecular(LBDirection, LBColor, normalize(fsNormal), eyedirVec);

    // Ambient
    vec4 ambient = computeAmbient(ambColor);

    outColor = vec4(clamp(diffuse + specular + ambient, 0.0, 1.0).rgb, 1.0);
    

}