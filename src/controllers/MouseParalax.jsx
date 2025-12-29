// MouseParallax.js
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";

const MouseParallax = ({ targetRef }) => {
  const { camera, size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  // Guarda la posición original de la cámara para sumar el offset
  const initialPosition = useRef(camera.position.clone());

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalizamos la posición del mouse a un rango de -1 a 1
      mouse.current.x = (event.clientX / size.width) * 2 - 1;
      mouse.current.y = -(event.clientY / size.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size.width, size.height]);

  useFrame(() => {
    // Factor que controla la intensidad del parallax; ajusta según lo necesites
    const parallaxFactor = 0.3;
    const offsetX = mouse.current.x * parallaxFactor;
    const offsetY = mouse.current.y * parallaxFactor;

    // Actualiza la posición de la cámara sumando el offset a la posición original
    camera.position.x = initialPosition.current.x + offsetX;
    camera.position.y = initialPosition.current.y + offsetY;

    // Opcional: Si deseas que la cámara apunte siempre al centro
    camera.lookAt(targetRef.current.position);
  });

  return null;
};

export default MouseParallax;
