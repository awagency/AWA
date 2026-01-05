import { useState } from "react";
import { motion } from "motion/react";
import FeaturesList from "../../../../hexagon/FeaturesList";
import HeroFeatureCard from "../../../../hexagon/HeroFeatureCard";
import { SectionData } from "../data/data";
import "./Section.css";

export default function Section({ handleBack, position = "right", section }) {
  const data = SectionData[section];
  const allFeatures = data.features || [];

  // Detalle inicial: A7
  const initialActive = allFeatures.find(f => f.id === "A7") || allFeatures[allFeatures.length - 1];

  // Lista lateral: todos menos el detalle
  const initialList = allFeatures.filter(f => f.id !== initialActive.id);

  const [activeFeature, setActiveFeature] = useState(initialActive);
  const [listFeatures, setListFeatures] = useState(initialList);

  const handleButtonClick = (clickedId) => {
    const clickedIndex = listFeatures.findIndex(f => f.id === clickedId);
    if (clickedIndex === -1) return;

    const clickedFeature = listFeatures[clickedIndex];

    // Intercambiamos contenido: el detalle pasa al lateral
    const newList = [...listFeatures];
    newList[clickedIndex] = activeFeature;

    setActiveFeature(clickedFeature);
    setListFeatures(newList);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`motion-section ${position}`}
    >
      <div className="section-content">
        <div className="section-inner">
          <img
            onClick={handleBack}
            className="back-arrow"
            src="/BackArrowWhite.svg"
            alt="Volver"
          />

          <header className="section-header">
            <h1>{data.ui?.title || ""}</h1>
            <p>{data.ui?.subtitle || ""}</p>
          </header>

          <div className="section-layout">
            {/* Lista lateral: siempre 6 items */}
            <FeaturesList
              features={listFeatures}
              onSelect={handleButtonClick}
              activeId={activeFeature.id}
            />

            {/* Detalle principal */}
            {activeFeature?.hero && (
              <HeroFeatureCard
                key={activeFeature.id}
                title={activeFeature.hero.title || ""}
                subtitle={activeFeature.hero.subtitle || ""}
                description={activeFeature.hero.description || ""}
                image={activeFeature.hero.image || "/A7.png"}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
