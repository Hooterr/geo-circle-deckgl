export default /*glsl*/`\
#version 300 es
#define SHADER_NAME geo-circle-layer-fragment-shader

precision highp float;

in vec4 vColor;
in vec2 unitPosition;
in float radius;
in vec2 center;

out vec4 fragColor;

const float R = 6371.0;
const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / PI / 2.0;

float smoothedge(float edge, float x, float radius) {
  return smoothstep(edge - radius, edge + radius, x);
}

vec2 mercator_to_lnglat(vec2 xy) { 
   xy /= WORLD_SCALE; 
   return degrees(vec2( 
     xy.x - PI, 
     atan(exp(xy.y - PI)) * 2.0 - PI * 0.5 
   ));
 }

float distance_lnglat(float lng1, float lat1, float lng2, float lat2) {
  float dLat = radians(lat2 - lat1);
  float dLng = radians(lng2 - lng1);
  float a = sin(dLat / 2.0) * sin(dLat / 2.0) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLng / 2.0) * sin(dLng / 2.0);
  float c = 2.0 * atan(sqrt(a), sqrt(1.0 - a));
  return R * c;
}

void main(void) {

  vec2 pos = mercator_to_lnglat(unitPosition);
  float dist = distance_lnglat(center.x, center.y, pos.x, pos.y) * 1e3;
  float inCircle = smoothedge(dist, radius, 500.0);

  if (inCircle == 0.0) {
    discard;
  }

  fragColor = vColor;
  fragColor.a *= inCircle;
}
`;