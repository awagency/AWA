import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const useCameraTransition = () => {
  const { setCameraTarget, setCameraLookAtTarget } = useContext(AppContext);

  const focusOnModel = (modelRef) => {
    if (!modelRef.current) return;
    
    const position = modelRef.current.position;
    
    // Posición de la cámara: ligeramente arriba y al frente del modelo
    const cameraPosition = [
      position.x,
      position.y + 2, // 2 unidades arriba
      position.z + 5  // 5 unidades al frente
    ];
    
    // Punto de mira: directamente al centro del modelo
    const lookAtPosition = [
      position.x,
      position.y,
      position.z
    ];
    
    setCameraTarget(cameraPosition);
    setCameraLookAtTarget(lookAtPosition);
  };

  return { focusOnModel };
};