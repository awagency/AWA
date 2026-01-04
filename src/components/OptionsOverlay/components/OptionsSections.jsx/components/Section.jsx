import { motion } from "motion/react";
import useSectionGroupService from "../hooks/useSectionGroupService";
import { SectionData } from "../data/data";
import FeaturesList from "../../../../hexagon/FeaturesList";
import HeroFeatureCard from "../../../../hexagon/HeroFeatureCard";
import "./Section.css";

const Section = ({ handleBack, position = "right", section }) => {
  const { currentText, handleButtonClick } = useSectionGroupService();
  const data = SectionData[section];

  const activeFeature =
    data.features.find(f => f.id === currentText) || data.features[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`motion-section ${position}`}
    >
      {/* FONDO */}
      <div className="section-bg">
        <img src={data.background} alt="" />
      </div>

      <div className="section-content">
  <div className="section-inner">
   
        <img
          onClick={handleBack}
          className="back-arrow"
          src="/BackArrowWhite.svg"
          alt="Volver"
        />

        {/* TÍTULO REAL */}
        <header className="section-header">
          <h1>{data.ui.title}</h1>
          <p>{data.ui.subtitle}</p>
        </header>

        {/* CUERPO */}
        <div className="section-layout">
          {/* IZQUIERDA — SIEMPRE TODOS */}
          <FeaturesList
            features={data.features}
            activeId={activeFeature.id}
            onSelect={handleButtonClick}
          />

          {/* DERECHA — MISMO HEXÁGONO */}
          <HeroFeatureCard
            title={activeFeature.hero.title}
            description={activeFeature.hero.description}
            image="/hexagono.png"
          />
        </div>
        </div>
        </div>
    </motion.div>
  );
};

export default Section;
