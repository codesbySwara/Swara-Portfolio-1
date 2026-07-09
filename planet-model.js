import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.getElementById("planet-model");

if (container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / 400, 0.1, 100);
  camera.position.set(0, 0, 3.4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, 400);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dirLight = new THREE.DirectionalLight(0xdbe6ff, 1.4);
  dirLight.position.set(3, 2, 4);
  scene.add(dirLight);

  const group = new THREE.Group();
  scene.add(group);

  const loader = new GLTFLoader();
  loader.load(
    "assets/planet/scene.gltf",
    (gltf) => {
      // The original Sketchfab textures weren't included in this export,
      // so the planet + clouds meshes get flat stylized colors instead.
      gltf.scene.traverse((child) => {
        if (child.name === "Object_6") {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x1c3d8f,
            emissive: 0x0b1a4a,
            emissiveIntensity: 0.4,
            roughness: 0.55,
          });
        }
        if (child.name === "Object_4") {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xeef3ff,
            transparent: true,
            opacity: 0.16,
            depthWrite: false,
          });
        }
      });
      group.add(gltf.scene);
    },
    undefined,
    (err) => console.error("Planet model failed to load:", err)
  );

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.003; // slow auto-rotate
    renderer.render(scene, camera);
  }
  animate();

  // Keep the canvas the right width if the window is resized
  window.addEventListener("resize", () => {
    const width = container.clientWidth;
    camera.aspect = width / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(width, 400);
  });
}
