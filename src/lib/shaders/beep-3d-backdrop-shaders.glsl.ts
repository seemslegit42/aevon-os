
export const vs = `precision highp float;

in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;

export const fs = `precision highp float;

out vec4 fragmentColor;

uniform vec2 resolution;
uniform float rand;

void main() {
  // This shader is no longer used, as the background is now transparent.
  // The functionality is kept here in case it's needed for other effects.
  fragmentColor = vec4(0.0, 0.0, 0.0, 0.0);
}
`;
