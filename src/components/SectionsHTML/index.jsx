import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useScrollManager } from "../../controllers/useScrollManager";
import { SCROLL_RANGES } from "../../controllers/scrollConfig";
import FirstText from "../Onboarding/FirstText";
import { OptionsOverlay } from "../OptionsOverlay/OptionsOverlay";
import { BladesAndReveal } from "../BladesAndReveal/BladesAndReveal";
import ServiceCards from "../ServicesCards/ServiceCards";
import ContactForm from "../ContactForm";

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
  return (
    <>
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
