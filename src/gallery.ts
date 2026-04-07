import * as THREE from "three";

import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";

export class Gallery {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  images: string[];
  meshes: THREE.Mesh[] = [];

  scroll = 0;
  speed = 0.02;

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );

    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#webgl") as HTMLCanvasElement,
      antialias: true,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.images = [
      "/images/1.jpg",
      "/images/2.jpg",
      "/images/3.jpg",
      "/images/4.jpg",
    ];

    this.createGallery();

    this.animate();

    window.addEventListener("resize", this.onResize.bind(this));
  }

  createGallery() {
    const loader = new THREE.TextureLoader();

    const geometry = new THREE.PlaneGeometry(2, 1.5);

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

      mesh.position.y = index * 2;

      this.scene.add(mesh);

      this.meshes.push(mesh);
    });
  }

  updateScroll() {
    this.scroll += this.speed;

    this.meshes.forEach((mesh) => {
      mesh.position.y -= this.speed;

      if (mesh.position.y < -4) {
        mesh.position.y += this.meshes.length * 2;
      }
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.updateScroll();

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
