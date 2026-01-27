import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const CAM_POS_START = new THREE.Vector3(0, 0, 5);
const CAM_POS_OPTIONS = new THREE.Vector3(0, 0, 15);
const CAM_POS_CARDS = new THREE.Vector3(0, 0, 24);
const CAM_POS_FINAL = new THREE.Vector3(0, -0.03, 15);

// Control de la cámara
export const SectionCameraControls = ({
  scrollProgress,
  cameraTarget,
  setCameraTarget,
  activeInfo,
  setActiveInfo,
} : {
  scrollProgress: number,
  cameraTarget: number[],
  setCameraTarget: (target: number[]) => void,
  activeInfo: string,
  setActiveInfo: (info: string) => void
}) => {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const targetVec = useRef(new THREE.Vector3());
  // Ref para evitar llamadas repetidas a setActiveInfo
  const lastActiveInfoReset = useRef<string | null>(null);

  // Función para interpolar la posición de la cámara
  const interpolateCameraPosition = (targetPosition, lerpFactor) => {
    camera.position.lerp(targetPosition, lerpFactor);
    lookAtTarget.current.lerp(targetPosition, lerpFactor);
    camera.lookAt(lookAtTarget.current);
  };

  // Función helper para resetear activeInfo solo cuando es necesario
  const resetActiveInfoIfNeeded = () => {
    if (activeInfo !== "" && lastActiveInfoReset.current !== "reset") {
      lastActiveInfoReset.current = "reset";
      setActiveInfo("");
    }
  };

  useFrame(() => {
    if (scrollProgress <= 0.1) {
      camera.position.copy(CAM_POS_START); // Posición inicial
      resetActiveInfoIfNeeded();
    } else if (scrollProgress >= 0.4 && scrollProgress < 0.55) {
      lastActiveInfoReset.current = null; // Permitir futuros resets
      if (activeInfo === "") {
        interpolateCameraPosition(CAM_POS_OPTIONS, 0.03);
      } else {
        targetVec.current.set(...cameraTarget);
        interpolateCameraPosition(targetVec.current, 0.03);
      }
    } else if (scrollProgress >= 0.55 && scrollProgress < 0.9) {
      resetActiveInfoIfNeeded();
      interpolateCameraPosition(CAM_POS_CARDS, 0.03);
    } else if (scrollProgress >= 0.9) {
      interpolateCameraPosition(CAM_POS_FINAL, 0.05);
    } else {
      resetActiveInfoIfNeeded();
      interpolateCameraPosition(CAM_POS_START, 0.03);
    }
  });

  return null;
};
