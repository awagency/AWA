// src/components/ServiceCards/index.jsx
import { AnimatePresence, motion } from "framer-motion";
import "./ServiceCards.css";
import LeftColumn from "./components/LeftColumn";
import CardRows from "./components/cardRows";
import { RenderCarousel } from "./components/renderCarousel.jsx";
import { useContext, useEffect, useState } from "react";
import { ServicesContext } from "./hooks/ServicesContext.js";

const ServiceCards = () => {

  const {
    expandedCard,
    showContainer,
    showLeftColumnBackground,
    leftColumnZIndex,
    handleBack,
    handleCardClick,
    getCardVariants,
    selectedCard,
    DataServices,
    setLeftColumnZIndex,
    setShowLeftColumnBackground
  } = useContext(ServicesContext);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    if (expandedCard) {
      setTimeout(() => {
        setShowLeftColumnBackground(true);
        setLeftColumnZIndex(1);
      }, 800);
    } else if (showContainer) {
      const timer = setTimeout(() => {
        setShowLeftColumnBackground(false);
        setLeftColumnZIndex(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, expandedCard, showContainer]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="overlay"
        >
          {expandedCard && (
            <motion.img src="/BackArrowWhite.svg" style={{width:26,height:26}} onClick={handleBack} className="back-button">
              
            </motion.img>
          )}
          <div className="main-wrapper">
            <LeftColumn
              zIndex={leftColumnZIndex}
              showBackground={showLeftColumnBackground}
            />
            <img src="/rightshadow2.webp" className="right-shadow" />
            <motion.div className="right-column">
              <AnimatePresence>{expandedCard && <RenderCarousel expandedCard={expandedCard}/>}</AnimatePresence>
              <AnimatePresence>
                {showContainer && (
                  <CardRows
                    DataServices={DataServices}
                    selectedCard={selectedCard}
                    handleCardClick={handleCardClick}
                    getCardVariants={getCardVariants}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceCards;
