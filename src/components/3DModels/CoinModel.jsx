import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import { AppContext } from "../../context/AppContext";

const COIN_LIGHT_LAYER = 1;

const getResponsiveScale = () => {
  const baseScale = 3; // Tamaño base
  const scaleFactor = Math.min(window.innerWidth, window.innerHeight) / 800;
  const scale = baseScale * scaleFactor ;
  return scale;
};

export const CoinModel = ({ scrollProgress }) => {
  const { coinRef: ref, activeInfo, setCoinHasLanded } = useContext(AppContext);
  const [isManuallyMoved, setIsManuallyMoved] = useState(false);
  const { scene } = useGLTF("/coin2.glb");
  const [targetScale, setTargetScale] = useState(new THREE.Vector3(1, 1, 1));
  const [hasLanded, setHasLanded] = useState(false);
  const startPosition = new THREE.Vector3(2.5, 15, -3); // Posición inicial alta
  const centerPosition = new THREE.Vector3(0, 0, -3); // Posición central
  const { camera, size } = useThree();
  useEffect(() => {
    // Habilitar layer extra para que reciba el rig de luces dedicado (sin afectar otros modelos)
    if (scene) {
      scene.traverse((obj) => {
        if (obj?.isMesh) {
          obj.layers.enable(COIN_LIGHT_LAYER);
          obj.castShadow = true;
          obj.receiveShadow = true;

          // Ajuste suave para que el dorado se lea como metal (sin tocar texturas del GLB)
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (!m) return;
            if (typeof m.metalness === "number") m.metalness = Math.max(m.metalness, 0.9);
            // Un poquito menos “satinado”: subimos apenas roughness y bajamos reflejos.
            if (typeof m.roughness === "number") m.roughness = Math.min(m.roughness, 0.32);
            if (typeof m.envMapIntensity === "number") m.envMapIntensity = Math.max(m.envMapIntensity, 2.3);
            // Si el material lo soporta (MeshPhysicalMaterial / extensiones glTF), suma un “clearcoat” sutil
            if (typeof m.clearcoat === "number") m.clearcoat = Math.max(m.clearcoat, 0.45);
            if (typeof m.clearcoatRoughness === "number") m.clearcoatRoughness = Math.min(m.clearcoatRoughness, 0.18);
            m.needsUpdate = true;
          });
        }
      });
    }

    if (ref.current) {
      ref.current.position.copy(startPosition);
    }
 // Iniciar la animación de caída después de un pequeño delay
    setTimeout(() => {
      setHasLanded(true);
      setCoinHasLanded?.(true);
    }, 500);
  }, [scene, setCoinHasLanded]);

  // Posiciones de la moneda
  const modelPositions = [
    // Inicio: derecha (después de caer)
    new THREE.Vector3(2.6, 0, -2),
    // Izquierda: centrada en ese lado antes del salto
    new THREE.Vector3(-3.5, 0, 1),
    new THREE.Vector3(-3.5, 0, 1), // Repetido para que se "pause" en esta posición
    // Centro: manejado por isFinalSection (scrollProgress >= 0.4)
    new THREE.Vector3(0, 0, 10),
  ];
  

  // Estado para la posición objetivo
  const targetPosition = useRef(new THREE.Vector3());
  const floatAmplitude = 0; // Amplitud del efecto de flotación
  const floatSpeed = 1; // Velocidad del efecto de flotación

  // Función de easing para suavizar el movimiento
  const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Función para calcular un tamaño Fijo en píxeles
  const getFixedScale = () => {
    const desiredSizePx = 700;

    const aspectRatio = size.width / size.height;
    const scaleFactor = (desiredSizePx / size.height) * 2; // Ajuste por la altura
    return new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor);
  };

  useFrame((state, delta) => {
    if (!ref.current) return;

    if (activeInfo) {
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.x += delta * 0.2;
      return;
    }
    if (ref.current && !isManuallyMoved) {  // Solo animar si no fue movida manualmente
      if (scrollProgress >= 0.9) {
        // Calcular un factor de escala que va de 1 a 4 cuando scrollProgress va de 0.9 a 1
        const scaleFactor = 1 + ((scrollProgress - 0.9) * 2500);

        const newScale = new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor);
        // Aplicar la escala con una interpolación suave
        ref.current.scale.lerp(newScale, 0.05);
      } else {
        // Mantener la escala normal cuando no estamos en la sección final

        const responsiveScale = getResponsiveScale();
        // Crear un vector de escala para la interpolación
        const newScaleResponsive = new THREE.Vector3(
          responsiveScale,
          responsiveScale,
          responsiveScale
        );
        // Interpolación suave hacia la escala responsiva
        ref.current.scale.lerp(newScaleResponsive, 0.10);
      }
      // const fixedScale = getFixedScale();
      // ref.current.scale.set(fixedScale.x, fixedScale.y, fixedScale.z);
      if (!hasLanded) {
        // Animación de caída inicial
        ref.current.position.lerp(centerPosition, 0.01);
        if (ref.current.position.distanceTo(centerPosition) < 0.1) {
          setHasLanded(true);
          setCoinHasLanded?.(true);
        }
      } else {
        const isFinalSection = scrollProgress >= 0.4;
        const isStopRotation = scrollProgress >= 0.7;

        if (!isFinalSection) {
          // Calcular la posición objetivo basada en el scrollProgress
          const index = Math.min(
            Math.floor(scrollProgress * (modelPositions.length - 1)),
            modelPositions.length - 2
          );
          const start = modelPositions[index];
          const end = modelPositions[index + 1];
          const rawProgress = scrollProgress * (modelPositions.length - 1);
          const localProgress = Math.min(Math.max(rawProgress - index, 0), 1);
          

          // Aplicar easing para suavizar el movimiento
          const easedProgress = easeOutCubic(localProgress);

          // Interpolación suave hacia la posición objetivo
          targetPosition.current.lerpVectors(start, end, easedProgress);
          ref.current.position.lerp(targetPosition.current, 0.02); // Reducir la velocidad de interpolación
        } else {
          // En la sección final, mover la moneda hacia la posición central
          const finalPosition = new THREE.Vector3(0, 0, 10);
          ref.current.position.lerp(finalPosition, 0.05); // Reducir la velocidad de interpolación
        }

        // Efecto de flotación (oscilación suave)
        const floatOffset =
          Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;
        ref.current.position.y += floatOffset;

        // Rotación controlada
        if (!isStopRotation) {
          ref.current.rotation.y += delta * 0.5;
          ref.current.rotation.x += delta * 0.2;
        } else {
          // Orientar la moneda de cara cuando se detenga, rotada 45 grados sobre su eje Z
          const targetRotation = new THREE.Euler(0, Math.PI / 2, 0); // Rotar 45 grados en Z
          ref.current.rotation.x = THREE.MathUtils.lerp(
            ref.current.rotation.x,
            targetRotation.x,
            0.1
          );
          ref.current.rotation.y = THREE.MathUtils.lerp(
            ref.current.rotation.y,
            targetRotation.y,
            0.1
          );
          ref.current.rotation.z = THREE.MathUtils.lerp(
            ref.current.rotation.z,
            targetRotation.z,
            0.1
          );
        }
      }
    }
  });

  // Función para mover manualmente la moneda
  const moveCoinTo = (position) => {
    if (!ref.current || activeInfo) return; // No animar si hay activeInfo

    setIsManuallyMoved(true);
    ref.current.position.copy(position);
  };

  return <primitive  ref={ref} object={scene} scale={2} />;
};

// Define prop types;
CoinModel.propTypes = {
  scrollProgress: PropTypes.number.isRequired, // Validate scrollProgress as a required number
};
