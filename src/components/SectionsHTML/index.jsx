import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useScrollManager } from "../../controllers/useScrollManager";
import { SCROLL_RANGES } from "../../controllers/scrollConfig";
import FirstText from "../Onboarding/FirstText";
import { OptionsOverlay } from "../OptionsOverlay/OptionsOverlay";
import { BladesAndReveal } from "../BladesAndReveal/BladesAndReveal";
import ServiceCards from "../ServicesCards/ServiceCards";
import ContactForm from "../ContactForm";
import HomeSection from "../HomeSection/HomeSection";
import SecondSection from "../SecondSection/SecondSection";

const SectionsHTML = () => {
  const {
    scrollProgress,
    activeInfo,
    setActiveInfo,
    setCameraTarget,
    setScrollProgress,
    contactModal,
    handleOptionClick,
  } = useContext(AppContext);
  useEffect(() => {
    console.log(contactModal, "cambio");
  }, [contactModal]);

  const { isInSection } = useScrollManager(setScrollProgress);
  
  // Mostrar HomeSection cuando la moneda está en la primera posición (después del loader)
  const showHomeSection = scrollProgress >= 0 && scrollProgress < 0.2;
  
  // Mostrar SecondSection cuando la moneda está en la segunda posición (lado izquierdo)
  // Mostrarla desde antes y después para los efectos de transición (incluye retorno desde sección 3)
  const showSecondSection = scrollProgress >= 0.05 && scrollProgress < 0.65;
  
  return (
    <>
      {showHomeSection && <HomeSection />}
      {showSecondSection && <SecondSection />}
      
      {isInSection("TITLES")(scrollProgress) && (
        <FirstText
          sectionRange={SCROLL_RANGES.SECTIONS.TITLES}
          scrollProgress={scrollProgress}
        ></FirstText>
      )}
      {isInSection("OPTIONS")(scrollProgress) && (
        <OptionsOverlay
          onOptionClick={(position, label) =>
            handleOptionClick(position, label)
          }
        />
      )}

      {isInSection("BLADES")(scrollProgress) && (
        <BladesAndReveal
          scrollProgress={scrollProgress}
          sectionRange={SCROLL_RANGES.SECTIONS.BLADES}
        />
      )}

      {isInSection("CARDS")(scrollProgress) && <ServiceCards />}
      <ContactForm></ContactForm>

    </>
  );
};

export default SectionsHTML;
