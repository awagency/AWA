import './features.css'

export interface Feature {
  id: string;
  hexIcon: string;
  text: string;
}

interface FeaturesListProps {
  features: Feature[];
  onSelect: (id: string) => void;
  activeId?: string;
  className?: string;
}

export default function FeaturesList({
  features,
  onSelect,
  activeId,
  className = '',
}: FeaturesListProps) {
  return (
    <div className={`features ${className}`}>
      <div className="features__icons">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`icon-item ${index % 2 === 0 ? 'icon-left' : 'icon-right'} ${index === 0 ? 'icon-first' : ''} ${feature.id === activeId ? 'icon-active' : ''}`}
          >
            <img src={feature.hexIcon} alt="" />
          </div>
        ))}
      </div>

      <div className="features__texts">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`text-item ${index % 2 === 0 ? 'text-left' : 'text-right'} ${index === 0 ? 'text-first' : ''} ${feature.id === activeId ? 'text-active' : ''}`}
            onClick={() => onSelect(feature.id)}
            style={{ cursor: 'pointer' }}
          >
            {feature.text}
          </div>
        ))}
      </div>
    </div>
  );
}
