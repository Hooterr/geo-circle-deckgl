export default /*glsl*/`\
#version 300 es
#define SHADER_NAME geo-circle-layer-vertex-shader

in vec3 positions;

in vec3 instanceCenter;
in float instanceRadius;
in vec4 instanceColor;

out vec4 vColor;
out vec2 unitPosition;
out float radius;
out vec2 center;

void main(void) {

  vColor = instanceColor;
  radius = instanceRadius;
  center = instanceCenter.xy;

  vec3 positionsGeo = positions * vec3(180.0, 85.0, 0.0);
  gl_Position = project_position_to_clipspace(positionsGeo, vec3(0.0), vec3(0.0), geometry.position);
  unitPosition = geometry.position.xy;
}
`;