import { useRef, useContext, useState, useEffect } from "react";
import { CoinModel } from "../3DModels/CoinModel";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars, SoftShadows, Html, Environment } from "@react-three/drei";
import { AppContext } from "../../context/AppContext";
import { IconParticles } from './IconParticles';
import Model from "../../context/Models";
import * as THREE from "three";
import OptimizedModel from "../3DModels/OptimizedModel";

const COIN_LIGHT_LAYER = 1;

// Rig de luces dedicado a la moneda (oro/metal): key cálida + fill neutra + rim fría + ambient suave.
// Se limita a la moneda usando layers de three.js (las demás meshes no tienen habilitada esta layer).
const CoinLightRig = () => {
  const { coinRef } = useContext(AppContext);
  const rigRef = useRef();
  const ambientRef = useRef();
  const hemiRef = useRef();
  const keyRef = useRef();
  const fillRef = useRef();
  const rimRef = useRef();
  const bounceRef = useRef();
  const sparkleARef = useRef();
  const sparkleBRef = useRef();
  const frontRef = useRef();

  useEffect(() => {
    // Nota: las layers se configuran por Object3D, así que lo aplicamos a cada luz.
    [ambientRef, hemiRef, keyRef, fillRef, rimRef, bounceRef, sparkleARef, sparkleBRef, frontRef].forEach((r) => {
      if (r.current) r.current.layers.set(COIN_LIGHT_LAYER);
    });
  }, []);

  useFrame(() => {
    // Hace que el rig acompañe el recorrido de la coin para mantener el look consistente.
    if (rigRef.current && coinRef?.current) {
      rigRef.current.position.copy(coinRef.current.position);
    }
  });

  return (
    <group ref={rigRef}>
      {/* Base suave (sin "lavar" el contraste) */}
      <ambientLight ref={ambientRef} intensity={0.22} color={"#fff4db"} />
      <hemisphereLight
        ref={hemiRef}
        intensity={0.42}
        color={"#ffffff"}
        groundColor={"#c98a3a"} // rebote cálido, ayuda a "oro"
      />

      {/* Key principal cálida */}
      <directionalLight
        ref={keyRef}
        position={[4.2, 2.4, 5.2]}
        intensity={2.1}
        color={"#ffd39a"}
        castShadow={false}
      />

      {/* Fill neutra para levantar sombras */}
      <pointLight
        ref={fillRef}
        position={[-4.0, 1.4, 3.2]}
        intensity={1.35}
        color={"#ffffff"}
        distance={80}
        decay={2}
        castShadow={false}
      />

      {/* Rim/back fría para recortar bordes */}
      <pointLight
        ref={rimRef}
        position={[0.0, 3.8, -5.2]}
        intensity={1.55}
        color={"#d7e8ff"}
        distance={80}
        decay={2}
        castShadow={false}
      />

      {/* Bounce desde abajo (rebote cálido) */}
      <pointLight
        ref={bounceRef}
        position={[0.0, -2.2, 2.2]}
        intensity={1.0}
        color={"#ffcf8a"}
        distance={60}
        decay={2}
        castShadow={false}
      />

      {/* Spots "rasantes" para highlights tipo metal al girar */}
      <spotLight
        ref={sparkleARef}
        position={[2.2, 0.6, 3.6]}
        intensity={3.2}
        color={"#ffffff"}
        angle={0.55}
        penumbra={0.65}
        distance={90}
        decay={2}
        castShadow={false}
      />
      <spotLight
        ref={sparkleBRef}
        position={[-2.4, 1.2, 3.8]}
        intensity={2.4}
        color={"#fff2cf"}
        angle={0.5}
        penumbra={0.7}
        distance={90}
        decay={2}
        castShadow={false}
      />

      {/* Luz frontal más intensa para "levantar" el dorado cuando está de frente */}
      <pointLight
        ref={frontRef}
        position={[0.0, 0.2, 6.5]}
        intensity={2.4}
        color={"#ffe2b5"}
        distance={120}
        decay={2}
        castShadow={false}
      />
    </group>
  );
};

// Añade este componente justo después de la definición de Scene
const RotatingGroup = ({ children }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};


const FloatingModel = ({ position = [0, 0, 0], offset = 0, children ,character}) => {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if(character === 1){
      ref.current.position.y = Math.sin(t * 1.1 + offset) * 0.08 // flotación con desfase

    }
    else {
      ref.current.position.y = Math.sin(t * 1.1 + offset) * 0.1 // flotación con desfase

    }
  })

  return <group ref={ref} position={position}>{children}</group>
}


export const Scene = () => {
  const { scrollProgress, activeInfo, maletinRef, cajafuerteRef, astronautaRef, moveModelTo, astronauta2Ref } = useContext(AppContext);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { viewport, camera } = useThree();

  // NUEVO: referencia para el grupo del maletín
  const maletinGroupRef = useRef();

  const handleMouseMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Importante: si las luces están en otra layer, la cámara debe tenerla habilitada
    camera.layers.enable(COIN_LIGHT_LAYER);
  }, [camera]);

  const showModels = scrollProgress <= 0.01 || activeInfo;
  const positionModel = scrollProgress <= 0.1 || !activeInfo;

  return (
    <>
      <SoftShadows size={25} samples={16} focus={0.5} />
      <ambientLight intensity={0.5} />
      <IconParticles />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 2, -5]} intensity={0.5} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        castShadow
      />
      <directionalLight scale={2}
        position={[-2, 0, 5]}
        intensity={scrollProgress > 0.4 && scrollProgress < 0.8 ? 0.5 : 0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <DynamicStars
        scrollProgress={scrollProgress}
        count={4000}
      />

      {/* Reflejos (IBL) para que el metal dorado "resplandezca" */}
      <Environment preset="city" background={false} blur={0.25} />

      <CoinLightRig />
      <CoinModel scrollProgress={scrollProgress} />

      {showModels && (
        <>
          <group ref={cajafuerteRef} position={positionModel ? [0, 0, -200] : [-10, 0, 10]} >
            <Model
              position={[-0.3, -0.08, 0]}
              rotation={[mousePosition.y * 0.2, -0.6 + mousePosition.x * 0.2, 0]}
              modelType="cajafuerte"
            />
            {scrollProgress > 0.4 && (
              <Html
                position={[-0.4, -0.6, 0]} // Ajusta la distancia detrás del modelo
                style={{
                  width: '950px',
                  height: '950px',
                  pointerEvents: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                center
                zIndexRange={[-1, -1]}
              >
                <img src="/baseModel.png" alt="Fondo Cajafuerte" style={{ width: '100%', height: '100%', objectFit: "contain" }} />
              </Html>
            )}
          </group>
        </>
      )}

      {showModels && (
        <>
          <group
            ref={maletinRef}
            position={positionModel ? [0, 0, -200] : [-8, 0, 10]}
            rotation={[0.20, 0.2, 0]}
          >
            <Model
              position={[-0.2, 0, -1]}
              rotation={[-0, 17.9, 0.1]}
              modelType="maletin"
            />

            {scrollProgress > 0.4 && (
              <>
                <Html
                  position={[
                    -0.2 + mousePosition.x * 0.02,
                    0.3 + mousePosition.y * 0.05,
                    0
                  ]}
                  style={{
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  center
                  zIndexRange={[-1, -1]}

                >
                  <img src="/nubee.png" alt="Parallax 4" style={{ width: '100%', height: '100%', objectFit: "contain", imageRendering: "auto" }} />
                </Html>
                <Html
                  position={[
                    0.3 + mousePosition.x * 0.04,
                    mousePosition.y * 0.02,
                    0
                  ]}
                  style={{
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  center
                  zIndexRange={[-1, -1]}

                >
                  <img src="/nubee.png" alt="Parallax 4" style={{ width: '120%', height: '120%', objectFit: "contain", imageRendering: "auto" }} />
                </Html>
                <Html
                  position={[
                    0.1 + mousePosition.x * 0.04,
                    -0.3 + mousePosition.y * 0.02,
                    0
                  ]}
                  style={{
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  center
                  zIndexRange={[-1, -1]}

                >
                  <img src="/nubee.png" alt="Parallax 4" style={{ width: '120%', height: '120%', objectFit: "contain", imageRendering: "auto" }} />
                </Html>
                <Html
                  position={[
                    -0.1 + mousePosition.x * 0.04,
                    mousePosition.y * 0.02,
                    0
                  ]}
                  style={{
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  center
                  zIndexRange={[-1, -1]}

                >
                  <img src="/nubee.png" alt="Parallax 4" style={{ width: '120%', height: '120%', objectFit: "contain", imageRendering: "auto" }} />

                </Html>
                <Html
                  position={[
                    0.3 + mousePosition.x * 0.04,
                    0.3 + mousePosition.y * 0.02,
                    0
                  ]}
                  style={{
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  center
                  zIndexRange={[-1, -1]}

                >
                  <img src="/nubee.png" alt="Parallax 4" style={{ width: '110%', height: '110%', objectFit: "contain", imageRendering: "auto" }} />
                </Html>
              </>
            )}
          </group>
        </>
      )}

      {showModels && (
        <>
          <group
            ref={astronautaRef}
            position={positionModel ? [0, 0, -200] : [8, 0, 10]}
            rotation={[0.20, 0.2, 0]}
          >
            {/* Grupo contenedor para los astronautas con rotación */}
            <RotatingGroup>
              {/* Primer astronauta */}
              <FloatingModel character={1} position={[-0.24, 0, 0]}>
                <Model
                  modelType="astronauta"
                  rotation={[0, Math.PI, 0]} // Mirando hacia el centro
                />
              </FloatingModel >

              {/* Segundo astronauta */}
              <FloatingModel character={2} position={[0.24, 0, 0]}>
                <Model
                  modelType="astronauta2"
                  rotation={[0, 0, 0]} // Mirando hacia el centro
                />
              </FloatingModel >
            </RotatingGroup>
            {scrollProgress > 0.4 && (
              <Html
                position={[
                  0,
                  0,
                  0
                ]}
                style={{
                  width: '100vw',
                  height: '110vh',
                  pointerEvents: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                center
                zIndexRange={[-1, -1]}

              >
                <img src="/humoRojo.png" alt="Parallax 4" style={{ width: '100%', height: '100%', objectFit: "contain", imageRendering: "auto" }} />
              </Html>
            )}
          </group>
        </>
      )}



    </>
  );
};

const DynamicStars = ({ scrollProgress, count }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = scrollProgress * 100;
      ref.current.rotation.x = scrollProgress * 5;
    }
  });

  return (
    <Stars
      ref={ref}
      radius={100}
      depth={300}
      count={count}
      factor={1}
      saturation={0}
      fade
      speed={1}
    />
  );
};



// {showModels && (
//   <>
//     {/* Cajafuerte: imagen PNG fija detrás, ligada al modelo */}
//     <group position={positionModel ? [0, 0, -200] : [-10, 0, 10]} rotation={[mousePosition.y * 0.2, mousePosition.x * 0.2, 0]}>
//       <Model 
//         ref={cajafuerteRef}
//         position={[0, 0, 0]}
//         rotation={[0, 0, 0]}
//         modelType="cajafuerte"
//       />
//       <Html
//         position={[0, 0, -2]} // Ajusta la distancia detrás del modelo
//         style={{
//           width: '200px',
//           height: '200px',
//           pointerEvents: 'none',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center'
//         }}
//         center
//         transform
//         zIndexRange={[0, 0]}
//       >
//         <img src="/chica2.png" alt="Fondo Cajafuerte" style={{width: '100%', height: '100%'}} />
//       </Html>
//     </group>
//   </>
// )}

// {showModels && (
//   <>
//     {/* Maletín: 4 imágenes con parallax detrás, ligadas al modelo */}
//     <group position={positionModel ? [0, 0, -200] : [-10, -2, 10]} rotation={[0, 18, 0]}>
//       <Model 
//         ref={maletinRef}
//         position={[0, 0, 0]}
//         rotation={[0, 0, 0]}
//         modelType="maletin"
//       />
//       {[1, 2, 3, 4].map((index) => (
//         <Html
//           key={index}
//           position={[
//             0 + mousePosition.x * (index * 0.5), // Parallax X
//             0 + mousePosition.y * (index * 0.5), // Parallax Y
//             -2 - index * 0.3 // Profundidad detrás del modelo
//           ]}
//           style={{
//             width: '150px',
//             height: '150px',
//             pointerEvents: 'none',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center'
//           }}
//           center
//           transform
//           zIndexRange={[0, 0]}
//         >
//           <img src={`/maletin-bg-${index}.png`} alt={`Parallax ${index}`} style={{width: '100%', height: '100%'}} />
//         </Html>
//       ))}
//     </group>
//   </>
// )}

// const DynamicStars = ({ scrollProgress, count }) => {
//   const ref = useRef();

//   useFrame(() => {
//     if (ref.current) {
//       ref.current.position.y = scrollProgress * 100;
//       ref.current.rotation.x = scrollProgress * 5;
//     }
//   });

//   return (
//     <Stars
//       ref={ref}
//       radius={100}
//       depth={300}
//       count={count}
//       factor={1}
//       saturation={0}
//       fade
//       speed={1}
//     />
//   );
// };
// Ejemplo de cómo mover el grupo desde algún evento:
// moveModelTo(maletinGroupRef, new THREE.Vector3(0, 0, 0));

// const DynamicStars = ({ scrollProgress, count }) => {
//   const ref = useRef();

//   useFrame(() => {
//     if (ref.current) {
//       ref.current.position.y = scrollProgress * 100;
//       ref.current.rotation.x = scrollProgress * 5;
//     }
//   });

//   return (
//     <Stars
//       ref={ref}
//       radius={100}
//       depth={300}
//       count={count}
//       factor={1}
//       saturation={0}
//       fade
//       speed={1}
//     />
//   );
// };
// Ejemplo de cómo mover el grupo desde algún evento:
// moveModelTo(maletinGroupRef, new THREE.Vector3(0, 0, 0));
