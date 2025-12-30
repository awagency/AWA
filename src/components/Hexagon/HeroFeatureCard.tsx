interface HeroFeatureCardProps {
  title: string
  description: string
  image: string
}

export default function HeroFeatureCard({
  title,
  description,
  image
}: HeroFeatureCardProps) {
  return (
    <div className="hero-feature-card">
      <div className="hero-feature-card__icon-wrapper">
        <img src={image} className="hero-feature-card__icon" />
      </div>

      <div className="hero-feature-card__content">
        <h2 className="hero-feature-card__title">{title}</h2>
        <p className="hero-feature-card__description">{description}</p>
      </div>
    </div>
  )
}
