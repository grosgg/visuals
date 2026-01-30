import * as THREE from 'three';

export const createMonolith = (x: number, z: number) => {
  const width = 1 + Math.random() * 8;
  const height = 1 + Math.random() * 30;
  const geometry = new THREE.BoxGeometry(width, height, width);

  const color = new THREE.Color("hsla(0, 0%, 63%, 0.32)");
  color.setHSL(Math.random(), Math.random() * 0.2, Math.random());
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, height * 0.5, z);
  mesh.castShadow = true; // It throws a shadow
  mesh.receiveShadow = true; // It can have shadows thrown on it

  return mesh;
};