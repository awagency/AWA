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
  new THREE.Vector3(-2.5, 0, 1),
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
// VELOCIDADES DE MOVIMIENTO
// =========================
const FALL_SPEED = 0.012; // caída inicial
const ENTRY_SPEED = 0.02; // 🔹 primer desplazamiento lateral
const MOVE_SPEED = 0.02; // recorrido general
const FINAL_SPEED = 0.05; // salida final
const ENTRY_SCROLL_LIMIT = 0.07;
// Rango de la sección OPTIONS (ver `Scene.jsx`)
const OPTIONS_START = 0.35;
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

    const isInOptionsSection =
      scrollProgress >= OPTIONS_START && scrollProgress < OPTIONS_END;

    // =========================
    // INFO ACTIVA
    // =========================
    // Fuera de OPTIONS, mantener el comportamiento actual (mirar a cámara).
    // Dentro de OPTIONS, NO congelamos la moneda: debe mantener su rotación previa.
    if (activeInfo && !isInOptionsSection) {
      tempMatrix.lookAt(ref.current.position, camera.position, ref.current.up);
      tempQuat.setFromRotationMatrix(tempMatrix);
      tempQuat.multiply(offsetQuat);
      ref.current.quaternion.slerp(tempQuat, 0.08);
      return;
    }

      //Transicion de la seccion de opciones a la screen final
      if (scrollProgress >= 0.9) {
        const scaleFactor = 1 + (scrollProgress - 0.9) * 2200;
        tempScaleVec.current.set(scaleFactor, scaleFactor, scaleFactor);
        ref.current.scale.lerp(tempScaleVec.current, 0.03);
        const liftAmount = (scrollProgress - 0.82) *2 // Sube hasta 0.2 unidades
        const baseY = 2; // Posición base Y
        const targetY = baseY + liftAmount;
        ref.current.position.y = THREE.MathUtils.lerp(
          ref.current.position.y,
          targetY,
          0.03
        );
      } else {
        const s = getResponsiveScale();
        tempScaleVec.current.set(s, s, s);
        ref.current.scale.lerp(tempScaleVec.current, 0.1);
      }

      // POSICIÓN
      const currentCenterPosition = isMobileDevice ? CENTER_POS_MOBILE : CENTER_POS_DESKTOP;
      const currentEntryPosition = isMobileDevice ? ENTRY_POS_MOBILE : ENTRY_POS_DESKTOP;
      
      if (!hasLanded) {
        ref.current.position.lerp(currentCenterPosition, FALL_SPEED);
        // Forzar centrado en móvil
        if (isMobileDevice) ref.current.position.x = 0;
      } else if (scrollProgress < ENTRY_SCROLL_LIMIT) {
        ref.current.position.lerp(currentEntryPosition, ENTRY_SPEED);
        // Forzar centrado en móvil
        if (isMobileDevice) ref.current.position.x = 0;
      } else {
        // Sección OPTIONS: la moneda debe saltar al centro, pero seguir girando.
        if (isInOptionsSection) {
          const optsPos = isMobileDevice ? OPTIONS_CENTER_POS_MOBILE : OPTIONS_CENTER_POS_DESKTOP;
          ref.current.position.lerp(optsPos, 0.03);
          if (isMobileDevice) ref.current.position.x = 0;
        } else {
        const isFinalSection = scrollProgress >= FINAL_SECTION_START;
        if (!isFinalSection) {
          const index = Math.min(
            Math.floor(scrollProgress * (modelPositions.length - 1)),
            modelPositions.length - 2
          );
          const start = modelPositions[index];
          const end = modelPositions[index + 1];
          const rawProgress = scrollProgress * (modelPositions.length - 1);
          const localProgress = Math.min(Math.max(rawProgress - index, 0), 1);
          const easedProgress = easeOutCubic(localProgress);
          targetPosition.current.lerpVectors(start, end, easedProgress);
          ref.current.position.lerp(targetPosition.current, MOVE_SPEED);
          // Forzar centrado en móvil durante el recorrido
          if (isMobileDevice) ref.current.position.x = 0;
        } else {
          //aca se edita cuando la moneda esta al centro de las opciones
          // Mantener Y actual cuando scrollProgress >= 0.9 (se ajusta en la sección de rotación)
          if (scrollProgress >= 0.9) {
            const currentY = ref.current.position.y;
            // En móvil siempre centrada horizontalmente
            const finalX = 0;
            tempFinalVec.current.set(finalX, currentY, 10);
            ref.current.position.lerp(tempFinalVec.current, FINAL_SPEED);
            if (isMobileDevice) ref.current.position.x = 0;
          } else {
            // En móvil siempre centrada horizontalmente
            const finalX = 0;
            tempFinalVec.current.set(finalX, 0, 10);
            ref.current.position.lerp(tempFinalVec.current, FINAL_SPEED);
            if (isMobileDevice) ref.current.position.x = 0;
          }
        }
        }
      }

      // ROTACIÓN
      if (scrollProgress >= 0.82) {
        // Cuando scrollProgress >= 0.82, orientar la moneda hacia la cámara
        tempMatrix.lookAt(
          ref.current.position,
          camera.position,
          ref.current.up
        );
        tempQuat.setFromRotationMatrix(tempMatrix);
        tempQuat.multiply(offsetQuat);
        ref.current.quaternion.slerp(tempQuat, 0.08);
        
        // Subir la moneda levemente mientras se orienta hacia la cámara
        if (scrollProgress >= 0.82) {
          const liftAmount = (scrollProgress - 0.82) * 0.5; // Sube hasta 0.2 unidades
          const baseY = 0; // Posición base Y
          const targetY = baseY + liftAmount;
          ref.current.position.y = THREE.MathUtils.lerp(
            ref.current.position.y,
            targetY,
            0.05
          );
          // Forzar centrado en móvil durante la rotación
          if (isMobileDevice) ref.current.position.x = 0;
        }
      } else {
        // Rotación normal antes de llegar a 0.9
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