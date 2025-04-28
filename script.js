import * as THREE from "three";

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  preserveDrawingBuffer: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe3e3db);
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;

const settings = {
  wheelSensitivity: 0.01,
  touchSensitivity: 0.01,
  momentumMultiplier: 2,
  smoothing: 0.1,
  slideLerp: 0.075,
  distortionDecay: 0.95,
  maxDistortion: 2.5,
  distortionSensitivity: 0.15,
  distortionSmoothing: 0.075,
};

const slideWidth = 3.0;
const slideHeight = 1.5;
const gap = 0.1;
const slideCount = 10;
const imagesCount = 5;
const totalWidth = slideCount * (slideWidth + gap);
const slideUnit = slideWidth + gap;

const slides = [];
let currentPosition = 0;
let targetPosition = 0;
let isScrolling = false;
let autoScrollSpeed = 0;
let lastTime = 0;
let touchStartX = 0;
let touchLastX = 0;
let prevPosition = 0;

let currentDistortionFactor = 0;
let targetDistortionFactor = 0;
let peakVelocity = 0;
let velocityHistory = [0, 0, 0, 0, 0];

const correctImageColor = (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const createSlide = (index) => {
  const geometry = new THREE.PlaneGeometry(slideWidth, slideHeight, 32, 16);

  const colors = ["#ff5733", "#33ff57", "#f3ff33", "#ff33f3"];
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(colors[index % colors.length]),
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = index * (slideWidth + gap);
  mesh.userData = {
    originalVertices: [...geometry.attributes.position.array],
    index,
  };

  const imageIndex = (index % imagesCount) + 1;
  const imagePath = `/img${imageIndex}.jpg`;

  new THREE.TextureLoader().load(
    imagePath,
    (texture) => {
      correctImageColor(texture);
      material.map = texture;
      material.color.set(0xffffff);
      material.needsUpdate = true;

      const imgAspect = texture.image.width / texture.image.height;
      const slideAspect = slideWidth / slideHeight;

      if (imgAspect > slideAspect) {
        mesh.scale.y = slideAspect / imgAspect;
      } else {
        mesh.scale.x = imgAspect / slideAspect;
      }
    },
    undefined,
    (err) => console.warn(`Couldn't load image ${imagePath}`, err)
  );

  scene.add(mesh);
  slides.push(mesh);
};

for (let i = 0; i < slideCount; i++) {
  createSlide(1);
}

slides.forEach((slide) => {
  slide.position.x -= totalWidth / 2;
  slide.userData.target = slide.position.x;
  slide.userData.currentX = slide.position.x;
});

const updateCurve = (mesh, worldPositionX, distortionFactor) => {
  const distortionCenter = new THREE.Vector2(0, 0);
  const distortionRadius = 2.0;
  const maxCurvature = settings.maxDistortion * distortionFactor;

  const positionAttribute = mesh.geometry.attributes.position;
  const originalVertices = mesh.userData.originalVertices;

  for (let i = 0; i < positionAttribute.count; i++) {
    const x = originalVertices(i * 3);
    const y = originalVertices(i * 3 + 1);

    const vertexWorldPosX = worldPositionX + x;
    const distFromCenter = Math.sqrt(
      Math.pow(vertexWorldPosX - distortionCenter.x, 2) +
        Math.pow(y - distortionCenter.y, 2)
    );

    const distortionStrength = Math.max(
      0,
      1 - distFromCenter / distortionRadius
    );
    // const curveZ =
  }
};
