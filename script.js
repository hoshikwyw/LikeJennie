import * as THREE from "three"

const canvas = document.getElementById("canvas")
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xe3e3db)
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.z = 5

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
}

const slideWidth = 3.0
const slideHeight = 1.5
const gap = 0.1
const slideCount = 10
const imagesCount = 5
const totalWidth = slideCount * (slideWidth + gap)
const slideUnit = slideWidth + gap

const slides = []
let currentPosition = 0
let targetPosition = 0
let isScrolling = false
let autoScrollSpeed = 0
let lastTime = 0
let touchStartX = 0
let touchLastX = 0
let prevPosition = 0

let currentDistortionFactor = 0
let targetDistortionFactor = 0
let peakVelocity = 0
let velocityHistory = [0, 0, 0, 0, 0]

const correctImageColor = (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
}
