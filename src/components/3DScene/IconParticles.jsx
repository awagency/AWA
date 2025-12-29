import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { AppContext } from "../../context/AppContext";

// Íconos (tal cual están en /public). Importante: los espacios se deben URL-encodear.
const ICON_URLS = [
  "/Group%20578.png",
  "/Group%20578%20(1).png",
  "/Group%20579.png",
  "/Group%20581.png",
  "/Group%20582.png",
  "/Group%20583.png",
  "/Group%20584.png",
  "/Group%20585.png",
  "/Group%20586.png",
  "/Group%20587.png",
  "/Group%20588.png",
  "/Group%20591.png",
];

const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smoothstep = (edge0, edge1, x) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

// Helper para generar Z con sesgo + chance de íconos "apenas más cerca" (sutilmente).
const pickZ = ({ zMin, zMax, closeChance = 0.25, closeBoost = 3.5 }) => {
  // zMax es el más cercano (menos negativo, e.g. -14). "Más cerca" => subir z (menos negativo).
  if (Math.random() < closeChance) {
    const zCloserMax = Math.min(zMax + closeBoost, -8); // cap para no meterse demasiado al frente
    return rand(zMax, zCloserMax);
  }
  // Sesgo a cerca dentro del rango normal
  const depthBias = Math.pow(Math.random(), 0.7);
  return lerp(zMax, zMin, depthBias);
};

// Partículas de íconos: pocas, aleatorias, flotando verticalmente de abajo hacia arriba.
export const IconParticles = ({
  // Pocas partículas, pero cubriendo todo el ancho del viewport en total (no "amontonadas").
  count = 9,
  // Profundidad donde viven los íconos (ajustable según tu escena).
  zMin = -26,
  zMax = -14,
}) => {
  const { coinHasLanded, scrollProgress } = useContext(AppContext);
  const textures = useTexture(ICON_URLS);
  const spriteRefs = useRef([]);
  const initializedRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const planeRef = useRef(new THREE.Plane());
  const hitRef = useRef(new THREE.Vector3());
  const { camera, viewport } = useThree();
  
  // Boost temporal cuando el usuario hace scroll hacia abajo
  const scrollBoost = useRef(0);

  useEffect(() => {
    // Asegura que los PNG se vean "nítidos" y con color correcto.
    textures.forEach((tex) => {
      if (!tex) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;
    });
  }, [textures]);

  useEffect(() => {
    // Capturar eventos de wheel para controlar dirección de partículas
    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        // Scroll hacia ABAJO: partículas suben más rápido
        scrollBoost.current = Math.min(scrollBoost.current + 3.5, 10);
      } else {
        // Scroll hacia ARRIBA: partículas bajan momentáneamente (boost negativo)
        scrollBoost.current = Math.max(scrollBoost.current - 3.5, -6);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Medimos el ancho/alto real del viewport al Z donde van los íconos
  // para que el rango de aparición ocupe todo el width, independiente de la pantalla.
  const vpAtZ = useMemo(() => {
    const z = (zMin + zMax) * 0.5;
    // getCurrentViewport devuelve width/height visibles a esa profundidad aprox.
    return viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, z));
  }, [camera, viewport, zMin, zMax]);

  const particles = useMemo(() => {
    const xHalf = vpAtZ.width * 0.5;
    const yHalf = vpAtZ.height * 0.5;
    // Menos padding para que el rango ocupe prácticamente todo el width
    const xPadding = Math.max(0.25, vpAtZ.width * 0.02);
    const yPadding = Math.max(1.2, vpAtZ.height * 0.12);
    const yBottom = -yHalf - yPadding;
    const yTop = yHalf + yPadding;
    const ySpan = yTop - yBottom;
    const spawnSpacing = ySpan / Math.max(1, count);

    // Carriles fijos distribuidos para cubrir todo el ancho y evitar acumulación.
    const laneXs = Array.from({ length: count }, (_, i) => {
      const t = (i + 0.5) / count;
      const base = lerp(-xHalf + xPadding, xHalf - xPadding, t);
      return base;
    });

      return Array.from({ length: count }, (_, i) => {
        // "Capas" de profundidad para un look más UX: algunas cerca (más grandes), otras lejos (más chicas)
        const z = pickZ({ zMin, zMax });
        const depth01 = clamp01((z - zMax) / (zMin - zMax)); // 0 cerca, 1 lejos

      const iconIdx = randInt(0, ICON_URLS.length - 1);
      const baseScale = Math.max(0.65, Math.min(1.05, vpAtZ.width / 22));

      // Tamaños: jugamos con 3 tiers (chico/medio/grande) + corrección por profundidad.
      const tierPick = Math.random();
      const tier =
        tierPick < 0.2 ? 1.25 : tierPick < 0.65 ? 1.0 : 0.82; // 20% grandes, 45% medios, 35% chicos
      const depthScale = lerp(1.2, 0.85, depth01);
      const scale = baseScale * tier * depthScale * rand(0.92, 1.12);

      // Rotación: todos giran lento, algunos un poco más (por tier).
      const rotBase = lerp(0.05, 0.18, 1 - depth01) * lerp(0.9, 1.25, tierPick);
      const rotSpeed = rotBase * (Math.random() < 0.5 ? -1 : 1);

      // Opacidad: cerca un poquito más visible
      const opacity = lerp(0.98, 0.75, depth01) * rand(0.92, 1.0);

      // IMPORTANTE: inicializar TODAS las partículas DEBAJO del viewport
      // para que "broten" desde abajo cuando la moneda aterrice.
      const startY = yBottom - spawnSpacing * (i + rand(0.3, 1.2));

      return {
        iconIdx,
        laneBaseX: laneXs[i],
        position: new THREE.Vector3(
          laneXs[i],
          startY, // Todas empiezan debajo
          z
        ),
        baseZ: z,
        // Movimiento: vertical constante, con leve variación (más cerca = un toque más rápido)
        speed: lerp(0.55, 0.9, 1 - depth01) * rand(0.92, 1.08),
        wobble: lerp(0.09, 0.03, depth01) * rand(0.85, 1.15), // micro wobble lateral
        phase: rand(0, Math.PI * 2),
        scale,
        rotSpeed,
        opacityBase: opacity,
        yTop,
        yBottom,
        spawnSpacing,
        xJitter: rand(-0.45, 0.45),
        depth01,
        // Repulsión con inercia (sensación “dedo en agua”)
        repulse: new THREE.Vector2(0, 0), // x,z offset
        repulseVel: new THREE.Vector2(0, 0),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, vpAtZ.width, vpAtZ.height, zMin, zMax]);

  useFrame((state, delta) => {
    // Fade-out cuando la moneda se centra (scrollProgress >= 0.4)
    // Definimos un rango suave para la transición
    const fadeOutStart = 0.38; // empieza a desaparecer
    const fadeOutEnd = 0.45;   // completamente oculto
    let globalFade = 1;
    
    if (scrollProgress >= fadeOutStart) {
      if (scrollProgress >= fadeOutEnd) {
        // Completamente oculto: no animar (ahorro de recursos)
        return;
      }
      // Fade suave usando smoothstep
      globalFade = 1 - smoothstep(fadeOutStart, fadeOutEnd, scrollProgress);
    }

    // Decay suave del boost: vuelve a 0 gradualmente (sea positivo o negativo)
    const decaySpeed = 4.5;
    if (scrollBoost.current > 0) {
      scrollBoost.current = Math.max(0, scrollBoost.current - delta * decaySpeed);
    } else if (scrollBoost.current < 0) {
      scrollBoost.current = Math.min(0, scrollBoost.current + delta * decaySpeed);
    }

    const t = state.clock.elapsedTime;
    const xHalf = vpAtZ.width * 0.5;
    const xPadding = Math.max(0.25, vpAtZ.width * 0.02);
    const xMin = -xHalf + xPadding;
    const xMax = xHalf - xPadding;
    // Parámetros “onda”: suaves, responsivos, sin brusquedad.
    const stiffness = 22; // qué tan rápido sigue el target (más alto = más pegado)
    const damping = 12; // amortiguación (más alto = menos “rebote”)
    for (let i = 0; i < particles.length; i++) {
      const sprite = spriteRefs.current[i];
      if (!sprite) continue;

      const p = particles[i];
      // Aplicar velocidad base + boost de scroll (cuando el usuario scrollea hacia abajo)
      const speedWithBoost = p.speed + scrollBoost.current;
      sprite.position.y += speedWithBoost * delta;
      // Base X: carril fijo + jitter + wobble (sin acumularse en el centro)
      const baseX =
        (p.laneBaseX ?? 0) + (p.xJitter ?? 0) + Math.sin(t * 0.6 + p.phase) * p.wobble;

      // Rotación muy suave, cada ícono a su ritmo
      sprite.material.rotation += p.rotSpeed * delta;

      // Interacción UX: “dedo en agua” => target de repulsión + spring (sin saltos)
      {
        const rc = raycasterRef.current;
        // Plane Z constante: normal (0,0,1) y constante -z (ax+by+cz+d=0)
        planeRef.current.set(new THREE.Vector3(0, 0, 1), -(p.baseZ ?? sprite.position.z));
        rc.setFromCamera(state.pointer, camera);
        const hit = rc.ray.intersectPlane(planeRef.current, hitRef.current);

        let targetX = 0;
        let targetZ = 0;
        if (hit) {
          const dx = baseX - hit.x;
          const dy = sprite.position.y - hit.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          const radius = 4.0; // zona de influencia (más “onda”)
          if (dist < radius) {
            const k = 1 - dist / radius;
            // Falloff más orgánico (cúbico)
            const falloff = k * k * k;
            const strength = 7.2; // más notorio, pero suavizado por spring
            const nx = dx / dist;
            targetX = nx * strength * falloff;
            // Profundidad: se “hunde”/se aleja un poco del cursor
            targetZ = -strength * falloff * 0.34;
          }
        }

        // Spring crítico estable hacia el target
        const rx = p.repulse?.x ?? 0;
        const rz = p.repulse?.y ?? 0; // usamos Vector2(y) como Z
        const vx = p.repulseVel?.x ?? 0;
        const vz = p.repulseVel?.y ?? 0;

        // a = k(x_target - x) - c v
        const ax = stiffness * (targetX - rx) - damping * vx;
        const az = stiffness * (targetZ - rz) - damping * vz;

        const nextVx = vx + ax * delta;
        const nextVz = vz + az * delta;
        const nextRx = rx + nextVx * delta;
        const nextRz = rz + nextVz * delta;

        p.repulse.set(nextRx, nextRz);
        p.repulseVel.set(nextVx, nextVz);

        sprite.position.x = Math.max(xMin, Math.min(xMax, baseX + nextRx));
        // Z base + offset suave (no acumulativo)
        sprite.position.z = (p.baseZ ?? sprite.position.z) + nextRz;
      }

      // Fade-in/out suave (más "premium", evita pops) + fade global por scroll
      const yN = (sprite.position.y - p.yBottom) / (p.yTop - p.yBottom); // 0..1
      const fadeIn = smoothstep(0.03, 0.16, yN);
      const fadeOut = 1 - smoothstep(0.84, 0.97, yN);
      sprite.material.opacity = (p.opacityBase ?? 0.9) * fadeIn * fadeOut * globalFade;

      if (sprite.position.y > p.yTop) {
        // “Brotado” continuo: respawn más espaciado (debajo del borde inferior),
        // así no aparecen en grupo aunque varias desaparezcan cerca en el tiempo.
        const spacing = p.spawnSpacing ?? (p.yTop - p.yBottom) / Math.max(1, count);
        sprite.position.y = p.yBottom - rand(0.6, 2.4) * spacing;
        // Evitar acumulación: mantener el carril fijo; solo re-jitter leve
        p.xJitter = rand(-0.45, 0.45);
        sprite.position.x = (p.laneBaseX ?? 0) + p.xJitter;
        p.baseZ = rand(zMin, zMax);
        sprite.position.z = p.baseZ;
        if (p.repulse) p.repulse.set(0, 0);
        if (p.repulseVel) p.repulseVel.set(0, 0);

        // Re-seed look para mantener variedad (tamaño/velocidad/rotación)
        const z = pickZ({ zMin, zMax });
        p.depth01 = clamp01((z - zMax) / (zMin - zMax));
        p.baseZ = z;
        sprite.position.z = z;

        const baseScale = Math.max(0.65, Math.min(1.05, vpAtZ.width / 22));
        const tierPick = Math.random();
        const tier = tierPick < 0.2 ? 1.25 : tierPick < 0.65 ? 1.0 : 0.82;
        const depthScale = lerp(1.2, 0.85, p.depth01);
        p.scale = baseScale * tier * depthScale * rand(0.92, 1.12);
        sprite.scale.set(p.scale, p.scale, 1);

        const rotBase = lerp(0.05, 0.18, 1 - p.depth01) * lerp(0.9, 1.25, tierPick);
        p.rotSpeed = rotBase * (Math.random() < 0.5 ? -1 : 1);

        p.speed = lerp(0.55, 0.9, 1 - p.depth01) * rand(0.92, 1.08);
        p.wobble = lerp(0.09, 0.03, p.depth01) * rand(0.85, 1.15);
        p.opacityBase = lerp(0.98, 0.75, p.depth01) * rand(0.92, 1.0);

        // Cambiar icono al respawn (sin re-render): actualizamos el map del material directamente
        if (Math.random() < 0.7) {
          const nextIdx = randInt(0, ICON_URLS.length - 1);
          p.iconIdx = nextIdx;
          if (sprite.material?.map !== textures[nextIdx]) {
            sprite.material.map = textures[nextIdx];
            sprite.material.needsUpdate = true;
          }
        }
      }
    }
  });

  // No renderizar nada hasta que la moneda haya aterrizado
  if (!coinHasLanded) return null;

  return (
    <group>
      {particles.map((p, i) => (
        <sprite
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          ref={(el) => {
            if (!el) return;
            spriteRefs.current[i] = el;
            // Importante: NO resetear posición en cada render (p.ej. al mover el mouse).
            if (!initializedRef.current[i]) {
              el.position.copy(p.position);
              // Seteamos el map inicial una sola vez para que después podamos mutarlo en runtime.
              if (el.material?.map !== textures[p.iconIdx]) {
                el.material.map = textures[p.iconIdx];
                el.material.needsUpdate = true;
              }
              initializedRef.current[i] = true;
            }
          }}
          scale={[p.scale, p.scale, 1]}
        >
          <spriteMaterial
            map={textures[p.iconIdx]}
            transparent
            opacity={p.opacityBase ?? 0.9}
            depthWrite={false}
            depthTest={false}
            color={"#ffffff"}
            blending={THREE.NormalBlending}
          />
        </sprite>
      ))}
    </group>
  );
};


