import { VerticalGallery } from "../DemoVertical/gallery";
import { HorizontalGallery } from "../DemoHorizontal/gallery";
import { GalleryScrollDistortion } from "../DemoScrollDistortion/gallery";
import { GalleryHover } from "../DemoHoverEffect/gallery";
import { GalleryParallax } from "../DemoParallax/gallery";

export class DemoManager {
  currentDemo: any = null;

  demos = {
    vertical: VerticalGallery,
    horizontal: HorizontalGallery,
    distortion: GalleryScrollDistortion,
    hover: GalleryHover,
    parallax: GalleryParallax,
  };

  start(name: string) {
    this.dispose();

    const DemoClass = this.demos[name as keyof typeof this.demos];

    if (DemoClass) {
      this.currentDemo = new DemoClass();
    }
  }

  dispose() {
    if (!this.currentDemo) return;

    const canvas = document.querySelector("#webgl") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");

    if (gl) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }

    this.currentDemo = null;
  }
}
