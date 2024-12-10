export default /*glsl*/`\
#version 300 es
#define SHADER_NAME geo-circle-layer-vertex-shader

in vec3 positions;

in vec3 instanceCenter;
in float instanceRadius;
in vec4 instanceColor;
uniform mat4 pixelUnprojectionMatrix;
uniform vec2 viewportSize;

out vec4 vColor;
out vec2 unitPosition;
out float radius;
out vec2 center;

vec4 pixelsToWorld(vec3 pixel) {
  pixel.xy += 1.0;
  pixel.xy *= 0.5;
  pixel.y = 1.0 - pixel.y;
  vec4 a = vec4(pixel.xy * viewportSize, 1.0, 1.0);
  vec4 result =  pixelUnprojectionMatrix * a;
  return result / result.w;
}

void main(void) {

  vColor = instanceColor;
  radius = instanceRadius;
  unitPosition = pixelsToWorld(positions).xy;
  center = instanceCenter.xy;
  //unitPosition = worldPositions;
  gl_Position = vec4(positions.xyz, 1.0);
}
`;