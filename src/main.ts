import "./style.css";

import { VerticalGallery } from "./demos/DemoVertical/gallery";
import { HorizontalGallery } from "./demos/DemoHorizontal/gallery";

let currentApp: any = null;

function startVertical() {
  if (currentApp) dispose();

  currentApp = new VerticalGallery();
}

function startHorizontal() {
  if (currentApp) dispose();

  currentApp = new HorizontalGallery();
}

function dispose() {
  const canvas = document.querySelector("#webgl") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl");

  if (gl) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  currentApp = null;
}

document.getElementById("demo1")?.addEventListener("click", startVertical);

document.getElementById("demo2")?.addEventListener("click", startHorizontal);

startVertical();
