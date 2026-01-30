import './style.css';
import * as THREE from 'three';
import {
  StereoEffect,
  DeviceOrientationControls,
  OrbitControls
} from 'three-stdlib';

import { createMonolith } from './objects/monolith';

class App {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private effect: StereoEffect;
  private controls: DeviceOrientationControls | OrbitControls | null = null;
  private isMobile: boolean;

  constructor() {
    this.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 0.1);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // 3. Shadow
    this.renderer.shadowMap.enabled = true;

    // 4. Stereo Effect (Eye split)
    this.effect = new StereoEffect(this.renderer);
    this.effect.setEyeSeparation(0.064);

    this.setupScene();
    this.setupListeners();
  }

  private setupScene(): void {
    this.scene.background = new THREE.Color(0x99bbff);

    // Add a soft ambient light so nothing is pitch black
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambient);

    // Add a bright directional light (like the sun) to create shadows and highlights
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(10, 20, 0);
    sun.castShadow = true;
    // Optimize shadow quality
    sun.shadow.mapSize.width = 256; // Default is 512
    sun.shadow.mapSize.height = 256;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 100;

    // This defines the "box" that shadows are calculated in
    sun.shadow.camera.left = -100;
    sun.shadow.camera.right = 100;
    sun.shadow.camera.top = 100;
    sun.shadow.camera.bottom = -100;
    this.scene.add(sun);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    groundGeometry.rotateX(Math.PI * -0.5);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xb3dd9f, });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid Helper
    const grid = new THREE.GridHelper(100, 50, 0x666666, 0x666666);
    grid.position.y = 0.01;
    this.scene.add(grid);

    for (let i = 0; i < 30; i++) {
      const x = Math.random() > 0.5 ? (5 + Math.random() * 20) : (-5 - Math.random() * 20);
      const z = Math.random() > 0.5 ? (5 + Math.random() * 20) : (-5 - Math.random() * 20);
      const mesh = createMonolith(x, z);
      this.scene.add(mesh);
    }
  }

  private setupListeners(): void {
    const overlay = document.getElementById('overlay');
    overlay?.addEventListener('click', () => this.start());

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private async start(): Promise<void> {
    const DeviceOrientation = DeviceOrientationEvent as unknown as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<string>;
    };

    // iOS Permission Handshake
    if (typeof DeviceOrientation.requestPermission === 'function') {
      const response = await DeviceOrientation.requestPermission();
      if (response === 'granted') {
        this.initControls(true);
      }
    } else {
      this.initControls(this.isMobile);
    }

    // Keep Screen On
    if ('wakeLock' in navigator) {
      try { await (navigator as any).wakeLock.request('screen'); } catch (e) { }
    }

    document.getElementById('overlay')!.style.display = 'none';
    if (this.isMobile) document.getElementById('center-line')!.style.display = 'block';

    this.animate();
  }

  private initControls(useGyro: boolean): void {
    if (useGyro) {
      this.controls = new DeviceOrientationControls(this.camera);
    } else {
      const orbit = new OrbitControls(this.camera, this.renderer.domElement);
      orbit.target.set(0, 2, 0);
      orbit.enableZoom = false;
      orbit.rotateSpeed = -0.5;
      this.controls = orbit;
    }
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.effect.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    this.controls?.update();

    if (this.isMobile) {
      this.effect.render(this.scene, this.camera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Start the app
new App();