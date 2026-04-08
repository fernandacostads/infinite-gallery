uniform sampler2D uTexture;
uniform float uScroll;

varying vec2 vUv;

void main(){

  vec2 uv = vUv;

  uv.y += sin(uv.x * 10.0) * uScroll * 0.1;

  vec4 color = texture2D(uTexture, uv);

  gl_FragColor = color;

}
