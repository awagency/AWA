import { useEffect, useRef } from "react"
import "./ContactScreen.css"

import contactoTitle from "../../assets/contactoT.svg"
import { FaWhatsapp, FaEnvelope, FaVideo } from "react-icons/fa"

export default function ContactScreen() {
  const backgroundRef = useRef(null)
  const cardsRef = useRef([])
  const hoveredIndex = useRef(null)

  useEffect(() => {
    let mouseX = 0
    let mouseY = 0
    let time = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5
      mouseY = e.clientY / window.innerHeight - 0.5
    }

    const animate = () => {
      time += 0.015

      /* ---------- FONDO ---------- */
      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `
          translate3d(${mouseX * 14}px, ${mouseY * 14}px, 0)
        `
      }

      /* ---------- ONDAS SUAVES ---------- */
      const baseWave = Math.sin(time) * 5
      const centerWave = Math.sin(time * 1.2) * 3

      /* ---------- CARDS ---------- */
      cardsRef.current.forEach((card, i) => {
        if (!card) return

        const isCenter = i === 1
        const isHovered = hoveredIndex.current === i

        const floatY = isHovered
          ? 0
          : isCenter
          ? centerWave
          : baseWave

        const rotateX = isHovered
          ? 0
          : mouseY * (isCenter ? 3 : 8)

        const rotateY = isHovered
          ? 0
          : mouseX * (isCenter ? 3 : 8)

        const z = isHovered ? 150 : isCenter ? 120 : 40
        const scale = isHovered ? 1.03 : 1

        const offsetX = isCenter ? 0 : i === 0 ? -28 : 28

        card.style.transform = `
          translateX(${offsetX}px)
          translateY(${floatY}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateZ(${z}px)
          scale(${scale})
        `
      })

      requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMouseMove)
    animate()

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [])

  return (
    <section className="contact-screen">
      {/* ---------- FONDO ---------- */}
      <div className="contact-background" ref={backgroundRef}>
        <div className="contact-title">
          <img src={contactoTitle} alt="Contacto" />
        </div>

        <footer className="contact-footer">
          Apolo Web Agency
        </footer>
      </div>

      {/* ---------- CARDS ---------- */}
      <div className="contact-cards">
        {[
          {
            title: "WhatsApp",
            text:
              "Ideal para consultas rápidas, mantener un diálogo fluido o resolver temas puntuales",
            icon: <FaWhatsapp />,
            className: "whatsapp",
          },
          {
            title: "Correo",
            text:
              "Perfecto si querés compartir información detallada o enviar documentación importante",
            icon: <FaEnvelope />,
            className: "email",
          },
          {
            title: "Google Meet",
            text:
              "Reservá un espacio en video llamada para avanzar en tu proceso rápidamente",
            icon: <FaVideo />,
            className: "meet",
          },
        ].map((item, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className={`contact-card ${item.className}`}
            onMouseEnter={() => (hoveredIndex.current = i)}
            onMouseLeave={() => (hoveredIndex.current = null)}
          >
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <div className="icon">{item.icon}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
