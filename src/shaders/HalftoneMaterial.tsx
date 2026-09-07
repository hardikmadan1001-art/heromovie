import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const HalftoneMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    uDotSize: 0.01,
    uColor: new THREE.Color('#ffffff'),
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDotSize;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv * uResolution / uDotSize;
    float dot = sin(uv.x * 3.14159) * sin(uv.y * 3.14159);
    float mask = smoothstep(0.0, 0.1, dot);
    
    gl_FragColor = vec4(uColor * mask, mask);
  }
  `
);

extend({ HalftoneMaterial });
