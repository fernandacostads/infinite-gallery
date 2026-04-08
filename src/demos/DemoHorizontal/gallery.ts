import * as THREE from "three";

import vertexShader from "../../shaders/vertex.glsl?raw";
import fragmentShader from "../../shaders/fragment.glsl?raw";

export class HorizontalGallery {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  images: string[];
  meshes: THREE.Mesh[] = [];

  scroll = 0;
  speed = 0.004;

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.3,
      100,
    );

    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#webgl") as HTMLCanvasElement,
      antialias: true,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.images = [
      "/images/1.jpg",
      "/images/2.jpg",
      "/images/3.jpg",
      "/images/4.jpg",
      "/images/5.jpg",
      "/images/6.jpg",
    ];

    this.createGallery();

    this.animate();

    window.addEventListener("resize", this.onResize.bind(this));
  }

  createGallery() {
    const loader = new THREE.TextureLoader();

    const geometry = new THREE.PlaneGeometry(2, 1.5, 1, 1);

    this.images.forEach((img, index) => {
      const texture = loader.load(img);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
        },

        vertexShader,
        fragmentShader,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // distribuição horizontal
      mesh.position.x = index * 2.5;

      this.scene.add(mesh);

      this.meshes.push(mesh);
    });
  }

  updateScroll() {
    this.scroll += this.speed;

    const spacing = 2.5;
    const total = this.meshes.length;
    const totalWidth = total * spacing;

    this.meshes.forEach((mesh, index) => {
      let x = index * spacing - this.scroll;

      while (x < -spacing) {
        x += totalWidth;
      }

      while (x > totalWidth - spacing) {
        x -= totalWidth;
      }

      mesh.position.x = x;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.updateScroll();

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
