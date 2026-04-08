import * as THREE from "three";

import vertexShader from "../../shaders/vertex.glsl?raw";
import fragmentShader from "../../shaders/fragment.glsl?raw";

export class GalleryParallax {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  meshes: THREE.Mesh[] = [];

  images: string[];

  scroll = 0;
  scrollTarget = 0;

  mouse = new THREE.Vector2();
  parallax = new THREE.Vector2();

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

    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("wheel", this.onWheel.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));

    this.animate();
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

  onMouseMove(event: MouseEvent) {
    this.mouse.x = event.clientX / window.innerWidth - 0.5;
    this.mouse.y = event.clientY / window.innerHeight - 0.5;
  }

  onWheel(event: WheelEvent) {
    this.scrollTarget += event.deltaY * 0.002;
  }

  updateScroll() {
    this.scroll += (this.scrollTarget - this.scroll) * 0.08;

    const spacing = 2;
    const total = this.meshes.length;
    const totalHeight = total * spacing;

    this.meshes.forEach((mesh, index) => {
      let y = index * spacing - this.scroll;

      while (y < -spacing) {
        y += totalHeight;
      }

      while (y > totalHeight - spacing) {
        y -= totalHeight;
      }

      mesh.position.y = y;
    });
  }

  updateParallax() {
    this.parallax.x += (this.mouse.x - this.parallax.x) * 0.1;
    this.parallax.y += (this.mouse.y - this.parallax.y) * 0.1;

    this.meshes.forEach((mesh, index) => {
      const depth = index * 0.05;

      mesh.position.x = this.parallax.x * depth;
      mesh.rotation.y = this.parallax.x * 0.2;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.updateScroll();
    this.updateParallax();

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
