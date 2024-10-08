export default `\
#version 300 es
#define SHADER_NAME geo-circle-layer-fragment-shader
precision highp float;

in vec4 vColor;
in vec2 unitPosition;
in float radius;

out vec4 fragColor;

const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / PI / 2.0;

vec2 mercator_to_lnglat(vec2 xy) { 
   xy /= WORLD_SCALE; 
   return degrees(vec2( 
     xy.x - PI, 
     atan(exp(xy.y - PI)) * 2.0 - PI * 0.5 
   )); 
 }

void main(void) {
    fragColor = vec4(0.0, 1.0, 0.0, 1.0);
}

`;