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

manager.start("vertical");
