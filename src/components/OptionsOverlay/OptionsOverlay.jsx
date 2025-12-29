import { motion } from "motion/react";
import { useState, useEffect, useContext } from "react";
import Options from "./components/Options";
import SectionsGroup from "./components/OptionsSections.jsx/SectionsGroup";
import GlassGroup from "./components/GlassGroup";

import { AppContext } from "../../context/AppContext";

export const OptionsOverlay = ({ onOptionClick }) => {
  const { setCameraTarget, setActiveInfo, activeInfo } = useContext(AppContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [pressedIndex, setPressedIndex] = useState(null);
  const [sectionHover, setSectionHover] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (activeInfo) {
      const timer = setTimeout(() => {
        setIsVisible2(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible2(false); // Resetear isVisible2 cuando activeInfo está vacío
    }
  }, [activeInfo]);

  const handleBackClick = () => {
    setActiveInfo("");
    setCameraTarget([0, 0, 15]);

    setIsVisible(false); // Ocultar opciones antes de volver a mostrarlas
    setTimeout(() => {
      setIsVisible(true); // Volver a mostrar opciones después de 2 segundos
    }, 2000);
  };

  return (
    <motion.div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 20,
      }}
    >
      <GlassGroup
        sectionHover={sectionHover}
        activeInfo={activeInfo} />
      {isVisible && !activeInfo && (
        <Options
          sectionHover={sectionHover}
          setSectionHover={setSectionHover}
          onOptionClick={onOptionClick}
          setPressedIndex={setPressedIndex}
          pressedIndex={pressedIndex}
        />
      )}
      <SectionsGroup
        activeInfo={activeInfo}
        isVisible2={isVisible2}
        handleBackClick={handleBackClick}
      />
    </motion.div>
  );
};
