import { motion } from "motion/react";
import { Buttons } from '../../Buttons';
import useSectionGroupService from '../hooks/useSectionGroupService';
import { getTextContent } from '../handles';
import { SectionData } from "../data/data";

const Section = ({ handleBack,position = "right",section = "EMPRESA" }) => {

    const { currentText, handleButtonClick } = useSectionGroupService()

    return (
        <motion.div
            initial={{ opacity: 0, transition: { duration: 2 } }}
            animate={{ opacity: 1, transition: { duration: 2 } }}
            className={`motion-section ${position}`}
        >
            <motion.div style={{ position: "fixed", top: 0, right: 0, width: "100vw", height: "100vh", zIndex: 1 }}>
                <img className="section-img" src={SectionData[section].background} />
            </motion.div>
            <div className="section-content">
                <img
                    onClick={handleBack}
                    className="back-arrow"
                    src="/BackArrowWhite.svg"
                />
                <img className="section-title-img" src={SectionData[section].title} />
                <motion.div
                    key={`empresa-${currentText}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 ,transition: { duration: 2 }}}
                    exit={{ opacity: 0 }}
                    // transition={{ duration: 2 }}
                    className="section-text"
                >
                    <p className="section-heading">{SectionData[section].heading[currentText]}</p>
                    {SectionData[section].description[currentText]()}

                </motion.div>
                <div className="button-wrapper">
                    <Buttons onClick={() => handleButtonClick(section)}
                        onDesclick={() => handleButtonClick(`${section}2`)}
                        gradient={section} />
                </div>
            </div>
        </motion.div>
    );
};

export default Section;
