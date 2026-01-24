import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

useGLTF.preload("/funcional.glb");

export const CombinedGlasses = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  visible = true,
  opacity = 1,
}) => {
  const { scene } = useGLTF("/funcional.glb");
  const groupRef = useRef();
  const opacityRef = useRef(1);

  const clonedScene = useMemo(() => {
    if (!scene) return null;
    return scene.clone(true);
  }, [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    // Conservamos los materiales originales del GLB.
    // Solo guardamos la opacidad base para animaciones suaves.
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];

        mats.forEach((mat) => {
          if (mat.userData.baseOpacity === undefined) {
            mat.userData.baseOpacity = mat.opacity ?? 1;
          }
        });
      }
    });
  }, [clonedScene]);

  useFrame(() => {
    if (!groupRef.current || !clonedScene) return;

    opacityRef.current += (opacity - opacityRef.current) * 0.1;
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        mats.forEach((mat) => {
          const baseOpacity = mat.userData.baseOpacity ?? 1;
          mat.opacity = baseOpacity * opacityRef.current;
        });
      }
    });
  });

  if (!clonedScene || !visible) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
};

CombinedGlasses.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  rotation: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.number,
  visible: PropTypes.bool,
  opacity: PropTypes.number,
};

