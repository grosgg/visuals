precision highp float;

uniform sampler2D tex0;
varying vec2 vTexCoord;

uniform float time;
uniform float brightness;

float bayer2x2(vec2 coord) {
  vec2 pos = mod(coord, 2.0);
  int x = int(pos.x);
  int y = int(pos.y);
  int i = x + y * 2;
  
  float thresholds[4];
  thresholds[0] = 0.03125;
  thresholds[1] = 0.15625;
  thresholds[2] = 0.21875;
  thresholds[3] = 0.09375;
  
  if (i == 0) {
    return thresholds[0];
  } else if (i == 1) {
    return thresholds[1];
  } else if (i == 2) {
    return thresholds[2];
  } else if (i == 3) {
    return thresholds[3];
  }
  
}

void main() {
  vec4 col = texture2D(tex0, vTexCoord);
  // float lum = dot(col.rgb, vec3(0.299, 0.587, 0.114)); // Luminance
  float lum = dot(col.rgb, vec3(brightness)); // Luminance

  float threshold = bayer2x2(gl_FragCoord.xy);
  float result = step(threshold, lum);
  gl_FragColor = vec4(vec3(result), 1.0);
}