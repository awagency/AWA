import './FeatureItem.css'

interface FeatureItemProps {
  /** Ruta de la imagen del hexágono completo */
  iconSrc: string
  /** Texto descriptivo del feature */
  text: string
  /** Posición horizontal del hexágono: 'left' o 'right' (para efecto zigzag) */
  position?: 'left' | 'right'
  /** Si es el primer elemento (para evitar margin negativo arriba) */
  isFirst?: boolean
  /** Clase CSS adicional */
  className?: string
}

/**
 * Componente de feature individual con hexágono y texto.
 * Los hexágonos alternan entre izquierda y derecha creando un zigzag,
 * y se enciman verticalmente entre ellos.
 */
export default function FeatureItem({
  iconSrc,
  text,
  position = 'left',
  isFirst = false,
  className = ''
}: FeatureItemProps) {
  return (
    <div className={`feature-item feature-item--${position} ${isFirst ? 'feature-item--first' : ''} ${className}`}>
      <div className="feature-item__hexagon-wrapper">
        <img 
          src={iconSrc} 
          alt="" 
          className="feature-item__hexagon"
        />
      </div>
      <p className="feature-item__text">{text}</p>
    </div>
  )
}

