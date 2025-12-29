import "./SectionsGroup.css";
import useSectionGroupService from "./hooks/useSectionGroupService";
import Section from "./components/Section";

export default function SectionsGroup({ activeInfo, isVisible2, handleBackClick }) {

    const { setCurrentText } = useSectionGroupService()

    const handleBack = () => {
        setCurrentText('initial');
        if (handleBackClick) handleBackClick();
    };

    return (
        <div className="section-container">
            {activeInfo === "EMPRESA" && isVisible2 && (
                <Section section="EMPRESA" handleBack={handleBack} />
            )}
            {activeInfo === "PROFESIONAL" && isVisible2 && (
                <Section section="PROFESIONAL" position="left" handleBack={handleBack} />
            )}
            {activeInfo === "EXCLUSIVO" && isVisible2 && (
                <Section section="EXCLUSIVO" handleBack={handleBack} />

            )}
        </div>
    );
};

