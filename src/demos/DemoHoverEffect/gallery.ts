import * as THREE from "three";

import vertexShader from "../../shaders/vertex.glsl?raw";
import fragmentShader from "../../shaders/hoverFragment.glsl?raw";

export class GalleryHover {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  images: string[];

  meshes: THREE.Mesh[] = [];
  materials: THREE.ShaderMaterial[] = [];

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  hoveredIndex = -1;

  scroll = 0;
  scrollTarget = 0;

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

    const geometry = new THREE.PlaneGeometry(2, 1.5, 1, 1);

    this.images.forEach((img, index) => {
      const texture = loader.load(img);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uHover: { value: 0 },
        },

        vertexShader,
        fragmentShader,
      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.y = index * 2;

      this.scene.add(mesh);

      this.meshes.push(mesh);
      this.materials.push(material);
    });
  }

  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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

  updateHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.meshes);

    this.hoveredIndex = -1;

    if (intersects.length > 0) {
      const mesh = intersects[0].object;

      this.hoveredIndex = this.meshes.indexOf(mesh as THREE.Mesh);
    }

    this.materials.forEach((mat, index) => {
      const target = index === this.hoveredIndex ? 1 : 0;

      mat.uniforms.uHover.value += (target - mat.uniforms.uHover.value) * 0.1;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.updateScroll();
    this.updateHover();

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
