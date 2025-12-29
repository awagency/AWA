export const SectionData = {
    EMPRESA: {
        background: "/fondoEmp.webp",
        title: "/EmpresaTitle.png",
        heading: {
            initial: "Simplifica su gestión",
            secondary: " "
        },
        description: {
            initial: () => (
                <p className="section-description">
                    <strong>Delegá proyectos completos, o la selección y supervisión de tus profesionales. </strong>Fortalecé tus puntos débiles con nuestras <strong>consultorías,</strong> o revalidá procesos en una <strong>auditoría.</strong>Incorporá <strong>automatización inteligente</strong> para reducir la carga operativa y tener un control total y mas eficiente.
                </p>

            ),
            secondary: () => (
                <p className="section-description">
                    Nos integramos como
                    <strong>una extensión de tu equipo: </strong>flexible, eficiente y sin ataduras. Evitamos la carga de gestionar recursos internos y tambien ofrecemos automatizaciones  inteligentes, que ademas de
                    <strong> simplificar y reducir costos,</strong> potencian los resultados.
                </p>
            )
        }
    },
    EXCLUSIVO: {
        title: "/ExclusivoTitle.png",
        background: "/fondoExc.webp",
        heading: {
            initial: "Tecnologia Inteligente",
            secondary: " "
        },
        description: {
            initial: () => (
                <p className="section-description">
                    <strong>Creamos Webs, Apps y herramientas,</strong> no solo con un <strong>diseño estratégico,</strong> sino con <strong>funcionalidades avanzadas</strong> que <strong>automatizan tareas reales.</strong>  Desde atender a tus usuarios, hasta gestionar stock, ventas y procesos más <strong>específicos o complejos.</strong>
                </p>

            ),
            secondary: () => (
                <p className="section-description">
                    Detrás de cada trabajo hay una estructura diseñada para maximizar la experiencia del público de nuestros clientes, mientras
                    <strong>integramos automatizaciones inteligentes que optimizan su trabajo diario.</strong> Así, pueden enfocarse en hacer crecer su marca, negocio o exmpresa sin limites.
                </p>
            )
        }
    },
    PROFESIONAL: {
        title: "/ProTitle.png",
        background: "/fondoPro.webp",
        heading: {
            initial: "Impulsa tu carrera",
            secondary: " "
        },
        description: {
            initial: () => (
                <p className="section-description">
                    Creamos un modelo de trabajo en colavoracion, para conectar oportunidades con nuestra red de profesionales, potenciando el crecimiento en mayoria y fomentando en su capacitacion las nuevas tecnologias.
                </p>

            ),
            secondary: () => (
                <p className="section-description">
                    Forma parte de un ecosistema colaborativo donde los profesionales IT pueden compartir, delegar tareas y aprender unos de otros. Optimiza tu carga de trabajo, gestiona proyectos de forma eficiente y accede a oportunidades internacionales.
                </p>
            )
        }
    }
}