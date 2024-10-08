export default `\
#version 300 es
#define SHADER_NAME geo-circle-layer-vertex-shader

in vec3 positions;

in vec3 instanceCenter;
in vec3 instanceCenter64Low;
in float instanceRadius;
in vec4 instanceColor;

out vec4 vColor;
out vec2 unitPosition;
out float radius;


void main(void) {

  vColor = instanceColor;
  radius = instanceRadius;

  geometry.worldPosition = instanceCenter;
  geometry.uv = positions.xy;
  unitPosition = positions.xy;
  vec3 offset = positions * 105.0;
  gl_Position = project_position_to_clipspace(instanceCenter, instanceCenter64Low, offset, geometry.position);
}
`;