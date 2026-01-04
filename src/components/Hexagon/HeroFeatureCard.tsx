import "./HeroFeatureCard.css"

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
        <img
          src={image}
          alt=""
          className="hero-feature-card__icon"
        />
      </div>

      <div className="hero-feature-card__content">
        <h2 className="hero-feature-card__title">{title}</h2>

        <p className="hero-feature-card__description">
          {description}
        </p>

        {/* 🔹 LÍNEA */}
        <div className="hero-feature-card__divider" />

        {/* 🔹 BOTÓN */}
        <button className="hero-feature-card__cta">
          Ver servicios
        </button>
      </div>
    </div>
  )
}
