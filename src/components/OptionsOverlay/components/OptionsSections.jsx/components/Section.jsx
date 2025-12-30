import { motion } from "motion/react";
import useSectionGroupService from "../hooks/useSectionGroupService";
import { SectionData } from "../data/data";

import FeaturesList from "../../../../hexagon/FeaturesList";
import HeroFeatureCard from "../../../../hexagon/HeroFeatureCard";


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
    <motion.div
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none" // 🔑 CLAVE
  }}
>
  <img
    className="section-img"
    src={SectionData[section].background}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }}
  />
</motion.div>


      <div className="section-content">
        <img
          onClick={handleBack}
          className="back-arrow"
          src="/BackArrowWhite.svg"
        />

        <img className="section-title-img" src={data.title} />

        <div className="section-block">
          <div className="section-block__body">
            <FeaturesList
              features={data.features}
              activeId={activeFeature.id}
              onSelect={handleButtonClick}
            />

            <HeroFeatureCard
              title={activeFeature.hero.title}
              description={activeFeature.hero.description}
              image={activeFeature.hero.image}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Section;
