import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./App.css";

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Esfera central
    const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x0077ff,
      emissive: 0x003366,
      emissiveIntensity: 1,
      metalness: 0.5,
      roughness: 0.5,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Luz ambiente y direccional
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6699ff, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Material del fuego
    const fireMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x0077ff) },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uColor;

        // Perlin Noise para animación
        float random(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);

          f = f * f * (3.0 - 2.0 * f);

          return mix(
            mix(
              mix(random(i), random(i + vec3(1.0, 0.0, 0.0)), f.x),
              mix(random(i + vec3(0.0, 1.0, 0.0)), random(i + vec3(1.0, 1.0, 0.0)), f.x),
              f.y
            ),
            mix(
              mix(random(i + vec3(0.0, 0.0, 1.0)), random(i + vec3(1.0, 0.0, 1.0)), f.x),
              mix(random(i + vec3(0.0, 1.0, 1.0)), random(i + vec3(1.0, 1.0, 1.0)), f.x),
              f.y
            ),
            f.z
          );
        }

        void main() {
          float dist = length(vPosition);
          float flame = noise(vPosition * 4.0 + vec3(uTime * 1.5, uTime * 0.5, 0.0)) * 2.0;
          float intensity = smoothstep(0.5, 0.8, flame - dist);

          gl_FragColor = vec4(uColor * intensity, intensity);
        }
      `,
      transparent: true,
      side: THREE.BackSide, // Para que el contorno rodee la esfera
    });

    // Geometría del contorno flameante
    const fireGeometry = new THREE.SphereGeometry(0.55, 64, 64);
    const fire = new THREE.Mesh(fireGeometry, fireMaterial);
    scene.add(fire);

    // Animación
    let previousTime = 0;
    function animate(currentTime) {
      const deltaTime = (currentTime - previousTime) / 1000;
      previousTime = currentTime;

      fireMaterial.uniforms.uTime.value += deltaTime;

      sphere.rotation.y += deltaTime * 0.5; // Rotación de la esfera
      fire.rotation.y += deltaTime * 0.3; // Rotación del fuego

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate(0);

    // Responsividad
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="root3d"></div>;
}

export default App;
