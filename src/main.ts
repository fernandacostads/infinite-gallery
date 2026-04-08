import "./style.css";
import { DemoManager } from "./demos/core/DemoManager";

const manager = new DemoManager();

document.getElementById("demo1")?.addEventListener("click", () => {
  manager.start("vertical");
});

document.getElementById("demo2")?.addEventListener("click", () => {
  manager.start("horizontal");
});

document.getElementById("demo3")?.addEventListener("click", () => {
  manager.start("distortion");
});

document.getElementById("demo4")?.addEventListener("click", () => {
  manager.start("hover");
});

document.getElementById("demo5")?.addEventListener("click", () => {
  manager.start("parallax");
});

manager.start("vertical");
