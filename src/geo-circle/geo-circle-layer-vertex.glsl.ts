export default `\
#version 300 es
#define SHADER_NAME geo-circle-layer-vertex-shader

in vec3 positions;
in vec2 worldPositions;

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

  //geometry.worldPosition = instanceCenter;
  //geometry.uv = positions.xy;
  unitPosition = worldPositions;
  //vec3 offset = positions * 5.0;
  //gl_Position = project_common_position_to_clipspace(vec4(positions.xy, 0.0, 1.0));
 // unitPosition = positions.xy * 256.0 + 100.0;
  gl_Position = vec4(positions.xyz, 1.0);
   //project_position_to_clipspace(instanceCenter, instanceCenter64Low, offset, geometry.position);
}
`;