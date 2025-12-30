import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import { AppContext } from "../../context/AppContext";

const COIN_LIGHT_LAYER = 1;

// =========================
// VELOCIDADES DE MOVIMIENTO
// =========================
const FALL_SPEED = 0.012;     // caída inicial
const ENTRY_SPEED = 0.02;    // 🔹 primer desplazamiento lateral
const MOVE_SPEED = 0.02;      // recorrido general
const FINAL_SPEED = 0.04;     // salida final
const ENTRY_SCROLL_LIMIT = 0.08;
// =========================

const tempMatrix = new THREE.Matrix4();
const tempQuat = new THREE.Quaternion();
const offsetQuat = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(0, Math.PI / 2, 0)
);

const getResponsiveScale = () => {
  const baseScale = 3;
  const scaleFactor = Math.min(window.innerWidth, window.innerHeight) / 800;
  return baseScale * scaleFactor;
};

export const CoinModel = ({ scrollProgress }) => {
  const { coinRef: ref, activeInfo, setCoinHasLanded } =
    useContext(AppContext);

  const { scene } = useGLTF("/coin2.glb");
  const { camera } = useThree();

  const [isManuallyMoved, setIsManuallyMoved] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);

  const startPosition = new THREE.Vector3(2.5, 15, -3);
  const centerPosition = new THREE.Vector3(0, 0, -3);

  // 🔹 nueva posición explícita de entrada
  const entryPosition = new THREE.Vector3(2.6, 0, -2);

  const targetPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    if (scene) {
      scene.traverse((obj) => {
        if (obj?.isMesh) {
          obj.layers.enable(COIN_LIGHT_LAYER);
          obj.castShadow = true;
          obj.receiveShadow = true;

          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];

          mats.forEach((m) => {
            if (!m) return;
            m.metalness = Math.max(m.metalness ?? 0, 0.92);
            m.roughness = Math.min(m.roughness ?? 1, 0.28);
            m.envMapIntensity = Math.max(m.envMapIntensity ?? 1, 2.7);
            m.clearcoat = Math.max(m.clearcoat ?? 0, 0.55);
            m.clearcoatRoughness = Math.min(
              m.clearcoatRoughness ?? 1,
              0.15
            );
            m.needsUpdate = true;
          });
        }
      });
    }

    if (ref.current) {
      ref.current.position.copy(startPosition);
    }

    setTimeout(() => {
      setHasLanded(true);
      setCoinHasLanded?.(true);
    }, 500);
  }, [scene, setCoinHasLanded]);

  const modelPositions = [
    new THREE.Vector3(2.6, 0, -2),
    new THREE.Vector3(-3.5, 0, 1),
    new THREE.Vector3(-3.5, 0, 1),
    new THREE.Vector3(0, 0, 10),
  ];

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  useFrame((state, delta) => {
    if (!ref.current) return;

    // =========================
    // INFO ACTIVA
    // =========================
    if (activeInfo) {
      tempMatrix.lookAt(
        ref.current.position,
        camera.position,
        ref.current.up
      );
      tempQuat.setFromRotationMatrix(tempMatrix);
      tempQuat.multiply(offsetQuat);
      ref.current.quaternion.slerp(tempQuat, 0.08);
      return;
    }

    if (!isManuallyMoved) {
      // =========================
      // ESCALA
      // =========================
      if (scrollProgress >= 0.9) {
        const scaleFactor = 1 + (scrollProgress - 0.9) * 2500;
        ref.current.scale.lerp(
          new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor),
          0.05
        );
      } else {
        const s = getResponsiveScale();
        ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
      }

      // =========================
      // POSICIÓN
      // =========================
      if (!hasLanded) {
        ref.current.position.lerp(centerPosition, FALL_SPEED);
      }

      // 🔹 TRAMO INICIAL CONTROLADO
      else if (scrollProgress < ENTRY_SCROLL_LIMIT) {
        ref.current.position.lerp(entryPosition, ENTRY_SPEED);
      }

      // 🔹 LÓGICA ORIGINAL DE SCROLL
      else {
        const isFinalSection = scrollProgress >= 0.4;

        if (!isFinalSection) {
          const index = Math.min(
            Math.floor(scrollProgress * (modelPositions.length - 1)),
            modelPositions.length - 2
          );

          const start = modelPositions[index];
          const end = modelPositions[index + 1];

          const rawProgress =
            scrollProgress * (modelPositions.length - 1);
          const localProgress = Math.min(
            Math.max(rawProgress - index, 0),
            1
          );

          const easedProgress = easeOutCubic(localProgress);

          targetPosition.current.lerpVectors(
            start,
            end,
            easedProgress
          );

          ref.current.position.lerp(
            targetPosition.current,
            MOVE_SPEED
          );
        } else {
          ref.current.position.lerp(
            new THREE.Vector3(0, 0, 10),
            FINAL_SPEED
          );
        }
      }

      // =========================
      // ROTACIÓN
      // =========================
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.x += delta * 0.2;
    }
  });

  const moveCoinTo = (position) => {
    if (!ref.current || activeInfo) return;
    setIsManuallyMoved(true);
    ref.current.position.copy(position);
  };

  return <primitive ref={ref} object={scene} scale={2} />;
};

CoinModel.propTypes = {
  scrollProgress: PropTypes.number.isRequired,
};
