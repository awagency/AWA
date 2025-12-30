import './FeaturesList.css'

export interface Feature {
  iconSrc: string
  text: string
}

interface FeaturesListProps {
  features: Feature[]
  className?: string
}

export default function FeaturesList({
  features,
  className = ''
}: FeaturesListProps) {
  return (
    <div className={`features ${className}`}>
      
      {/* COLUMNA DE ICONOS */}
      <div className="features__icons">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`icon-item ${index % 2 === 0 ? 'icon-left' : 'icon-right'} ${index === 0 ? 'icon-first' : ''}`}
          >
            <img src={feature.iconSrc} alt="" />
          </div>
        ))}
      </div>

      {/* COLUMNA DE TEXTOS */}
      <div className="features__texts">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`text-item ${index % 2 === 0 ? 'text-left' : 'text-right'} ${index === 0 ? 'text-first' : ''}`}
          >
            {feature.text}
          </div>
        ))}
      </div>

    </div>
  )
}
