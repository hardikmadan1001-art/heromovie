import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const EnergyRimMaterial = shaderMaterial(
  {
    uRimColor: new THREE.Color('#00e5ff'),
    uRimIntensity: 1.0,
    uRimPower: 3.0,
    uTime: 0,
  },
  // Vertex Shader
  `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  // Fragment Shader
  `
  uniform vec3 uRimColor;
  uniform float uRimIntensity;
  uniform float uRimPower;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    float rim = 1.0 - max(dot(viewDir, normal), 0.0);
    rim = pow(rim, uRimPower);
    
    // Heartbeat pulse (~60bpm)
    float pulse = 0.7 + 0.3 * sin(uTime * 3.14159); 
    vec3 finalColor = uRimColor * rim * uRimIntensity * pulse;
    
    gl_FragColor = vec4(finalColor, rim * uRimIntensity);
  }
  `
);

extend({ EnergyRimMaterial });
