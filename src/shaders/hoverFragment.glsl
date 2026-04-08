uniform sampler2D uTexture;
uniform float uHover;

varying vec2 vUv;

void main(){

    vec2 uv = vUv;

    // distortion
    uv += (uv - 0.5) * uHover * 0.2;

    vec4 color = texture2D(uTexture, uv);

    gl_FragColor = color;

}
