import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import { AppContext } from "../../context/AppContext";

// Vectores/constantes fuera del componente para evitar recreación
const START_POS_DESKTOP = new THREE.Vector3(2.5, 15, -3);
const CENTER_POS_DESKTOP = new THREE.Vector3(0, 0, -3);
const ENTRY_POS_DESKTOP = new THREE.Vector3(2.6, 0, -2);
const OPTIONS_CENTER_POS_DESKTOP = new THREE.Vector3(0, 0, 10);

const START_POS_MOBILE = new THREE.Vector3(0, 15, -5);
const CENTER_POS_MOBILE = new THREE.Vector3(0, 0, -2);
const ENTRY_POS_MOBILE = new THREE.Vector3(0, 1, -1);
const OPTIONS_CENTER_POS_MOBILE = new THREE.Vector3(0, 0, 10);

const DESKTOP_PATH_POSITIONS = [
  new THREE.Vector3(2.6, 0, -2),
  new THREE.Vector3(-2.5, 0, -1),
  new THREE.Vector3(-3.5, 0, 1),
  new THREE.Vector3(0, 0, 20),
];

const MOBILE_PATH_POSITIONS = [
  new THREE.Vector3(10, 0, -2),
  new THREE.Vector3(0, -1.3, 1),
  new THREE.Vector3(0, -4, 5),
  new THREE.Vector3(0, 0, 20),
];

// =========================
// CONFIGURACIÓN DE SECCIONES
// =========================
const ENTRY_SCROLL_LIMIT = 0.07;
// Rango de la sección OPTIONS (ver `Scene.jsx`)
const OPTIONS_START = 0.38;
const OPTIONS_END = 0.55;
// Inicio del tramo final (pantalla final / zoom)
const FINAL_SECTION_START = 0.82;
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

// Detectar si estamos en móvil
const isMobile = () => {
  return window.innerWidth <= 768;
};

// =========================
// PARTICULAS TIPO RÍO (actualmente desactivadas: no se están creando partículas)
// =========================

export const CoinModel = ({ scrollProgress }) => {
  const { coinRef: ref, activeInfo, setCoinHasLanded } = useContext(AppContext);

  const { scene } = useGLTF("/coin2.glb");
  const { camera } = useThree();

  const [hasLanded, setHasLanded] = useState(false);
  
  const targetPosition = useRef(new THREE.Vector3());
  const blendedTarget = useRef(new THREE.Vector3());
  const tempScaleVec = useRef(new THREE.Vector3());
  const tempFinalVec = useRef(new THREE.Vector3());
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // =========================
  // Detectar cambios de tamaño de pantalla
  // =========================
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(isMobile());
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // =========================
  // Inicialización de moneda y escena
  // =========================
  useEffect(() => {


    // Usar posición inicial según el dispositivo
    const initialPosition = isMobile() ? START_POS_MOBILE : START_POS_DESKTOP;
    if (ref.current) ref.current.position.copy(initialPosition);

    setTimeout(() => {
      setHasLanded(true);
      setCoinHasLanded?.(true);

    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, setCoinHasLanded]);

  const modelPositions = isMobileDevice ? MOBILE_PATH_POSITIONS : DESKTOP_PATH_POSITIONS;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // =========================
  // Loop principal de frame
  // =========================
  useFrame((state, delta) => {
    if (!ref.current) return;

    // Damping framerate-independent (velocidad constante y suave)
    const MOVE_DAMPING = 3.5; // Velocidad de movimiento uniforme
    const damp = (lambda) => 1 - Math.exp(-lambda * delta);

    // Transición suave hacia/desde OPTIONS
    const OPTIONS_BLEND_WINDOW = 0.04;
    const enterW = THREE.MathUtils.smoothstep(
      scrollProgress,
      OPTIONS_START - OPTIONS_BLEND_WINDOW,
      OPTIONS_START + OPTIONS_BLEND_WINDOW
    );
    const exitW = THREE.MathUtils.smoothstep(
      scrollProgress,
      OPTIONS_END - OPTIONS_BLEND_WINDOW,
      OPTIONS_END + OPTIONS_BLEND_WINDOW
    );
    const optionsWeight = THREE.MathUtils.clamp(enterW * (1 - exitW), 0, 1);

    const isInOptionsSection =
      scrollProgress >= OPTIONS_START && scrollProgress < OPTIONS_END;

    // =========================
    // INFO ACTIVA
    // =========================
    if (activeInfo && !isInOptionsSection) {
      tempMatrix.lookAt(ref.current.position, camera.position, ref.current.up);
      tempQuat.setFromRotationMatrix(tempMatrix);
      tempQuat.multiply(offsetQuat);
      ref.current.quaternion.slerp(tempQuat, 0.08);
      return;
    }

    // =========================
    // ESCALA (suave y continua)
    // =========================
    if (scrollProgress >= 0.9) {
      const scaleFactor = 1 + (scrollProgress - 0.9) * 2200;
      tempScaleVec.current.set(scaleFactor, scaleFactor, scaleFactor);
      ref.current.scale.lerp(tempScaleVec.current, damp(4.0));
    } else {
      const s = getResponsiveScale();
      tempScaleVec.current.set(s, s, s);
      ref.current.scale.lerp(tempScaleVec.current, damp(5.0));
    }

    // =========================
    // POSICIÓN (sistema unificado y continuo)
    // =========================
    const currentCenterPosition = isMobileDevice ? CENTER_POS_MOBILE : CENTER_POS_DESKTOP;
    const currentEntryPosition = isMobileDevice ? ENTRY_POS_MOBILE : ENTRY_POS_DESKTOP;
    const optsPos = isMobileDevice ? OPTIONS_CENTER_POS_MOBILE : OPTIONS_CENTER_POS_DESKTOP;
    
    // Calcular target de posición según el scrollProgress
    if (!hasLanded) {
      // Caída inicial
      ref.current.position.lerp(currentCenterPosition, damp(2.0));
      if (isMobileDevice) ref.current.position.x = 0;
    } else if (scrollProgress < ENTRY_SCROLL_LIMIT) {
      // Entrada inicial
      ref.current.position.lerp(currentEntryPosition, damp(2.5));
      if (isMobileDevice) ref.current.position.x = 0;
    } else {
      // Recorrido principal: calcular posición base del path
      const isFinalSection = scrollProgress >= FINAL_SECTION_START;
      
      if (!isFinalSection) {
        // Path continuo sin saltos: usar interpolación continua en lugar de índices discretos
        const pathProgress = THREE.MathUtils.clamp(
          (scrollProgress - ENTRY_SCROLL_LIMIT) / (FINAL_SECTION_START - ENTRY_SCROLL_LIMIT),
          0,
          1
        );
        
        // Interpolación continua a lo largo de todos los puntos del path
        const totalSegments = modelPositions.length - 1;
        const continuousIndex = pathProgress * totalSegments;
        const segmentIndex = Math.floor(continuousIndex);
        const clampedIndex = Math.min(segmentIndex, totalSegments - 1);
        const localT = continuousIndex - clampedIndex;
        
        const start = modelPositions[clampedIndex];
        const end = modelPositions[clampedIndex + 1];
        const easedT = easeOutCubic(localT);
        
        targetPosition.current.lerpVectors(start, end, easedT);
      } else {
        // Sección final: posición hacia adelante con elevación suave
        const finalProgress = THREE.MathUtils.clamp(
          (scrollProgress - FINAL_SECTION_START) / (1.0 - FINAL_SECTION_START),
          0,
          1
        );
        
        // Elevación suave desde 0.82
        const liftAmount = (scrollProgress - 0.82) * 2.5;
        const baseY = 0;
        const targetY = baseY + Math.max(0, liftAmount);
        
        const finalX = 0;
        const finalZ = THREE.MathUtils.lerp(10, 20, finalProgress);
        tempFinalVec.current.set(finalX, targetY, finalZ);
        targetPosition.current.copy(tempFinalVec.current);
      }

      // Mezclar con posición de OPTIONS si estamos en esa sección
      blendedTarget.current.copy(targetPosition.current);
      if (optionsWeight > 0) {
        blendedTarget.current.lerp(optsPos, optionsWeight);
      }

      // Aplicar movimiento suave y uniforme
      ref.current.position.lerp(blendedTarget.current, damp(MOVE_DAMPING));
      
      // Forzar centrado en móvil
      if (isMobileDevice) ref.current.position.x = 0;
    }

    // =========================
    // ROTACIÓN (suave y continua)
    // =========================
    if (scrollProgress >= 0.82) {
      // Orientar hacia la cámara con transición suave
      tempMatrix.lookAt(
        ref.current.position,
        camera.position,
        ref.current.up
      );
      tempQuat.setFromRotationMatrix(tempMatrix);
      tempQuat.multiply(offsetQuat);
      ref.current.quaternion.slerp(tempQuat, damp(4.0));
    } else {
      // Rotación normal antes de 0.82
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <primitive ref={ref} object={scene} scale={2} />
    </>
  );
};

CoinModel.propTypes = {
  scrollProgress: PropTypes.number.isRequired,
};