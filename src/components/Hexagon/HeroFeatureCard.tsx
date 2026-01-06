import { useEffect, useRef } from "react";
import "./HeroFeatureCard.css";

interface HeroFeatureCardProps {
  title: string;
  description: string;
  image: string;
}

export default function HeroFeatureCard({
  title,
  description,
  image
}: HeroFeatureCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const current = useRef({ rotateX: 0, rotateY: 0 });
  const target = useRef({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const MAX_ROTATION = 26;
    const LERP = 0.08;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;

      target.current.rotateY = (x / window.innerWidth) * MAX_ROTATION;
      target.current.rotateX = (y / window.innerHeight) * -MAX_ROTATION;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let frameId: number;
    const start = performance.now();

    const animate = (time: number) => {
      const floatY = Math.sin((time - start) * 0.001) * 10;

      current.current.rotateX +=
        (target.current.rotateX - current.current.rotateX) * LERP;
      current.current.rotateY +=
        (target.current.rotateY - current.current.rotateY) * LERP;

      if (tiltRef.current) {
        tiltRef.current.style.transform = `
          translateY(${floatY}px)
          rotateX(${current.current.rotateX}deg)
          rotateY(${current.current.rotateY}deg)
          translateZ(24px)
        `;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.src = image;
    }
  }, [image]);

  return (
    <div className="hero-feature-card">
      <div className="hero-feature-card__icon-wrapper" ref={tiltRef}>
        <img
          ref={imgRef}
          src={image}
          alt=""
          className="hero-feature-card__icon"
        />
      </div>

      <div className="hero-feature-card__content">
        <h2 className="hero-feature-card__title">{title}</h2>

        <p className="hero-feature-card__description">{description}</p>

        <div className="hero-feature-card__divider" />

        <button className="hero-feature-card__cta">
          Ver beneficios
        </button>
      </div>
    </div>
  );
}
