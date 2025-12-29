import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ButtonAction } from "./Buttons";

const preloadImageTipo1 = new Image();
preloadImageTipo1.src = "/tipo1.png";
const preloadImageTipo2 = new Image();
preloadImageTipo2.src = "/tipo2.png";

export const ThirdReveal = ({ scrollProgress, isVisible }) => {
  const [showModal, setShowModal] = useState(false);
  const [mouseActive, setMouseActive] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setTimeout(() => {
      setMouseActive(true);
    }, 2000);
  }, []);

  const handleMouseMove = (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) * 0.02;
    const deltaY = (e.clientY - centerY) * 0.02;
    setOffset({ x: deltaX, y: deltaY });
  };

  const firstImage = scrollProgress >= 0.70 && scrollProgress < 0.99;
  const secondImage = scrollProgress >= 0.60 && scrollProgress < 0.99;
  const firstText = scrollProgress >= 0.71 && scrollProgress < 0.82;
  const secondText = scrollProgress >= 0.71 && scrollProgress < 0.82;
  const thirdText = scrollProgress >= 0.71 && scrollProgress < 0.82;

  return (
    <div style={{ zIndex: 30, display: isVisible ? "block" : "none" }} onMouseMove={mouseActive ? handleMouseMove : null}>
      <AnimatePresence mode="popLayout">
        {firstImage && !showModal && (
          <motion.div
            key="firstImage"
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.8 },
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            style={{
              x: offset.x * 1.1,
              y: offset.y * 1.1,
            }}
            className="background-image6"
            animate={{
              scale: 1.2,
              opacity: 0.3,
              x: -offset.x,
              y: -offset.y,
              transition: { duration: 0.8, ease: "easeOut" },
            }}
          ></motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {secondImage && !showModal && (
          <motion.div
            className="background-imageS"
            key="secondImage"
            initial={{
              x: -200,
              y: 200,
              scale: 0.8,
            }}
            exit={{
              opacity: 0,
              x: -200,
              y: 200,
              scale: 0.8,
              transition: { duration: scrollProgress > 0.26 ? 0.2 : 0.8 },
            }}
            style={{
              x: -offset.x * 1.5,
              y: -offset.y * 1.5,
              width: "25%"
            }}
            animate={
              !mouseActive
                ? {
                  x: 0,
                  y: 0,
                  scale: 1.2,
                  transition: {
                    duration: 1.5,
                    ease: "easeOut",
                  },
                }
                : {
                  x: offset.x,
                  y: offset.y,
                  scale: 1.2,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut",
                  },
                }
            }
          >
            <motion.div
              className="background-image5"
              animate={{
                y: [-10, 10, -10],
                transition: {
                  y: {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                    repeatType: "reverse"
                  }
                }
              }}
            ></motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {firstImage && showModal && (
          <motion.div
            className="background-imageS"
            key="modalImage"
            initial={{
              x: -200,
              y: 200,
              scale: 0.8,
            }}
            exit={{
              opacity: 0,
              x: -200,
              y: 200,
              scale: 0.8,
              transition: { duration: scrollProgress > 0.45 ? 1 : 0.8 },
            }}
            style={{
              x: -offset.x * 1.5,
              y: -offset.y * 1.5,
            }}
            animate={
              !mouseActive
                ? {
                  x: 0,
                  y: 0,
                  scale: 1.2,
                  transition: {
                    duration: 1.5,
                    ease: "easeOut",
                  },
                }
                : {
                  x: offset.x,
                  y: offset.y,
                  scale: 1.2,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut",
                  },
                }
            }
          >
            <motion.div
              style={{
                width: "50vw",
                position: "absolute",
                right: 0,
              }}
              animate={{
                y: [-10, 10, -10],
                transition: {
                  y: {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                    repeatType: "reverse"
                  }
                }
              }}
            >
          
              <motion.img
                style={{
                  width: 150,
                  height: 150,
                  objectFit: "contain",
                  position: "absolute",
                  right: "30vw",
                  top: "50vh"
                }}
                animate={{
                  x: mouseActive ? -offset.x * 1.2 : 0,
                  y: mouseActive ? -offset.y * 0.8 : 0,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                src={"/iapar4.webp"}
                alt="Elemento código 1"
              />
              <motion.img
                style={{
                  width: 200,
                  height: 200,
                  position: "absolute",
                  right: "20vw",
                  top: "28vh",
                  objectFit: "contain",
                }}
                animate={{
                  x: mouseActive ? offset.x * 2 : 0,
                  y: mouseActive ? offset.y * 1.5 : 0,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                src={"/iapar2.webp"}
                alt="Elemento código 2"
              />
              <motion.img
                style={{
                  width: 100,
                  height: 100,
                  position: "absolute",
                  right: "14vw",
                  top: "10vh",
                  objectFit: "contain",
                }}
                animate={{
                  x: mouseActive ? -offset.x * 0.7 : 0,
                  y: mouseActive ? offset.y * 1.2 : 0,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                src={"/iapar1.webp"}
                alt="Elemento código 3"
              />
              <motion.img
                style={{
                  width: 210,
                  height: 210,
                  position: "absolute",
                  right: "32vw",
                  top: "15vh",
                  objectFit: "contain",
                }}
                animate={{
                  x: mouseActive ? offset.x * 1.5 : 0,
                  y: mouseActive ? -offset.y * 0.9 : 0,
                  transition: { duration: 0.35, ease: "easeOut" }
                }}
                src={"/iapar3.webp"}
                alt="Tipo 1"
              />
              <motion.img
                style={{
                  width: 500,
                  height: 500,
                  position: "absolute",
                  right: -70,
                  top: "35vh",
                  objectFit: "contain",
                }}
                animate={{
                  x: mouseActive ? -offset.x * 0.4 : 0,
                  y: mouseActive ? -offset.y * 0.6 : 0,
                  transition: { duration: 0.45, ease: "easeOut" }
                }}
                src={"/iapar5.webp"}
                alt="Tipo 2"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          position: "fixed",
          height: "100vh",
          width: "50vw",
          zIndex: 99999999,
          display: "flex",
          flexDirection: "column",
          // backgroundColor: "red",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap:"4vh",
            padding: "20px 40px",
          }}
        >
          <AnimatePresence mode="popLayout">
            {firstText && (
              <motion.div
                key="firstText"
                exit={{
                  opacity: 0,
                  x: -100,
                  transition: { duration: 0.5 },
                }}
                initial={{ opacity: 0, x: -100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 1 },
                }}
                style={{
                  maxWidth: "60vw",
                  color: "white",
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 10,
                    objectFit: "contain",
                  }}
                  src={"/autonomoTitle.webp"}
                ></img>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {secondText && !showModal && (
              <motion.div
                key="secondText"
                exit={{
                  opacity: 0,
                  x: -200,
                  transition: { duration: 0.5 },
                }}
                initial={{ opacity: 0, x: -200 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 1 },
                }}
                style={{
                  maxWidth: "50vw",
                  color: "white",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    height: "250px",
                    justifyContent: "center"
                  }}
                >
                  <p
                      style={{
                        width: "fit-content",
                        padding: "20px 20px 20px 0px",
                        borderRadius: 20,
                        fontFamily: "Nunito Sans",
                      }}
                    >
                      <strong style={{ lineHeight: 3 }}>
                      Apoyate en un asistente inteligente.
                      </strong>
                      <br />
                      Sin pausas ni errores y con memoria prodigisa. Creamos sistemas autonomos que se encargan de atender y gestionar tu negocio, empresa o tareas personales, ofreciendo un alto veneficio
                    </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
              {secondText && showModal && (
                <motion.div
                  key="secondText"
                  exit={{
                    opacity: 0,
                    x: -200,
                    transition: { duration: 0.5 },
                  }}
                  initial={{ opacity: 0, x: -200 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 1 },
                  }}
                  style={{
                    maxWidth: "50vw",
                    color: "white",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      height: "250px",
                    justifyContent: "center"
                    }}
                  >
                    <p
                      style={{
                        width: "fit-content",
                        padding: "20px 20px 20px 0px",
                        borderRadius: 20,
                        fontFamily: "Nunito Sans",
                      }}
                    >
                Gestion y atencion de clientes, control de stock, ejecucion y seguimiento de ventas, manejo de agenda y reportes con metricas de progreso.
                Es solo un ejemplo de lo que pueden hacer.
                    </p>
                  </div>
                </motion.div>
              )}
           
             
            </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {thirdText && (
              <motion.div
                key="thirdText"
                exit={{
                  opacity: 0,
                  x: -300,
                  transition: { duration: 0.5 },
                }}
                initial={{ opacity: 0, x: -300 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 1 },
                }}
                style={{
                  maxWidth: "50vw",
                }}
              >
                <div
                  style={{
                    width: "35vw",
                  }}
                >
                  <ButtonAction handle={() => setShowModal(!showModal)} />

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

ThirdReveal.displayName = "ThirdReveal";