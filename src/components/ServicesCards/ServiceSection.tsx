import React, { useState } from 'react';
import { ExternalLink, UserCog, LayoutGrid, GitMerge, Headphones, ArrowRight, User, Building2, Diamond } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon } from '../Hexagon';
import { ServiceItem } from '../../../types';

// Data Definition - Puedes personalizar estos servicios
const SERVICES: ServiceItem[] = [
  {
    id: 'tercerizacion',
    title: 'Tercerizacion',
    description: 'Refuerzo estratégico para escalar sin fricción de forma inteligente.',
    icon: ExternalLink
  },
  {
    id: 'consultoria',
    title: 'Consultoría',
    description: 'Expertos a tu disposición para optimizar procesos.',
    icon: UserCog
  },
  {
    id: 'desarrollo',
    title: 'Desarrollo',
    description: 'Soluciones de software a medida.',
    icon: LayoutGrid
  },
  {
    id: 'integracion',
    title: 'Integración',
    description: 'Conectamos tus sistemas eficientemente.',
    icon: GitMerge
  }
];

export const ServiceSection = () => {
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES[0].id);

  const activeService = SERVICES.find(s => s.id === activeServiceId) || SERVICES[0];
  const otherServices = SERVICES.filter(s => s.id !== activeServiceId);

  return (
    // Main Background: Smooth gradient from image - #0D0432 to #260B98
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_center,_#260B98_100%,_#0D0432_100%)] text-white overflow-hidden font-sans selection:bg-pink-500 selection:text-white">

      {/* Background Decor Elements */}
      <div className="absolute top-0 right-0 h-full w-1/3 pointer-events-none overflow-hidden z-0">
        <Diamond size={50} className="absolute top-[8%] right-[30%] text-pink-500/30 blur-[1px] rotate-12" />
        <UserCog size={64} className="absolute top-[20%] right-[10%] text-purple-500/30 blur-[1px] -rotate-12" />
        <LayoutGrid size={50} className="absolute top-[40%] right-[22%] text-indigo-500/20 blur-[2px] rotate-45" />
        <GitMerge size={55} className="absolute top-[55%] right-[5%] text-blue-500/20 blur-[2px]" />
        <ExternalLink size={60} className="absolute top-[32%] right-[-2%] text-purple-500/20 blur-[2px] rotate-12" />
      </div>

      <div className="container mx-auto px-6  md:px-12  min-h-screen flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0">

        {/* === LEFT COLUMN === */}
        <div className="w-full lg:w-[35%] flex flex-col z-10 lg:pr-8 gap-8">

          {/* Brand Title */}
          <div className="w-full flex">
            <img src="/lgo.png" alt="logo" className="w-full object-contain max-w-full" style={{ imageRendering: 'auto' }} />
          </div>

          {/* Description Text */}
          <div className="space-y-5  text-gray-200 text-[17px] leading-relaxed font-normal  ">
            <p>
              <strong className="font-bold text-white">Conectamos talento, tecnología y oportunidad</strong> para cubrir las necesidades de la industria IT.
              Somos el <strong className="font-bold text-white">refuerzo</strong> de las empresas y startups, como tambien el <strong className="font-bold text-white">respaldo</strong> de los profecionales.
            </p>
           
          </div>

          {/* CTA Button */}
          <div className="w-full relative group cursor-pointer mt-2">
            <div className="absolute inset-0 bg-white/40 rounded-xl  opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative border border-white/80 rounded-xl px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="text-[16px] font-medium text-gray-100">Hablemos por whatsApp o</span>
                <span className="text-[16px] font-medium text-gray-100">coordinemos un Meet.</span>
              </div>
              <Headphones className="text-white w-8 h-8 opacity-90 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* === DIVIDER LINE === */}
        <img src="/divider.png" alt="divider" className=" lg:block w-[30px] h-[100vh] z-20 mx-8"></img>

        {/* === RIGHT COLUMN === */}
        <div className="w-full lg:w-[55%] flex flex-col items-start relative z-10 pt-8 lg:pt-0 ">

          {/* Header & Filters */}
          <div className="w-full mb-12">
            <h3 className="text-[2.7rem] font-light italic text-white mb-3 tracking-wide drop-shadow-lg">
              Nuestros servicios segun
            </h3>

            <div className="flex flex-wrap gap-3">
              {/* Filter Pills */}
              <button className="flex items-center gap-2 px-5 py-1 rounded-lg border border-white/60 text-[16px] font-normal tracking-wider hover:bg-white/40 uppercase transition-all bg-white/20">
                <User size={16} strokeWidth={1.5} /> PROFECIONALES
              </button>

              <button className="flex items-center gap-2 px-5 py-1 rounded-lg border border-white/60 text-[16px] font-normal tracking-wider hover:bg-white/40 uppercase transition-all bg-white/20">
                <Building2 size={16} strokeWidth={1.5} /> EMPRESAS
              </button>

              <button className="flex items-center gap-2 px-5 py-1 rounded-lg bg-white/20 border border-white text-[16px] font-normal tracking-wider hover:bg-white/40 uppercase transition-all shadow-lg backdrop-blur-sm">
                <Diamond size={16} strokeWidth={1.5} /> EXCLUSIVOS
              </button>
            </div>
          </div>
          
          {/* HEXAGON INTERACTION AREA */}
          <div className="w-full relative flex flex-col items-start">
            {/* Top Section: Big Hexagon + Text */}
            <div className="flex flex-row gap-10 mb-6 w-full items-start">
              <div className="relative shrink-0 flex flex-col gap-6 items-center">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeService.id}
                    layoutId={`container-${activeService.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Hexagon
                      size="lg"
                      isActive={true}
                      layoutId={`hex-${activeService.id}`}
                    >
                      <activeService.icon strokeWidth={1.2} size={110} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                    </Hexagon>
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-3 items-end">
                {otherServices.map((service, index) => (
                  <div 
                    key={service.id} 
                    onClick={() => setActiveServiceId(service.id)} 
                    className="cursor-pointer"
                    style={{ marginBottom: index === 1 ? '10px' : '0' }}
                  >
                    <Hexagon
                      size="sm"
                      layoutId={`hex-${service.id}`}
                    >
                      <service.icon strokeWidth={1.5} size={36} className="text-white opacity-90" />
                    </Hexagon>
                  </div>
                ))}
              </div>
              </div>

              <motion.div
                key={`text-${activeService.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col text-left mt-8"
              >
                <h4 className="text-[2.75rem] font-bold mb-4 text-white leading-tight drop-shadow-lg">{activeService.title}</h4>
                <p className="text-[1.15rem] font-light italic text-gray-200 leading-relaxed max-w-[340px]">
                  {activeService.description}
                </p>
              </motion.div>
            </div>

            {/* Bottom Section: Small Hexagons + Link */}
            <div className="flex flex-row items-center w-full gap-10">
              <div className="flex-grow flex justify-end pr-2">
                <button className="flex items-center gap-2 text-lg font-light italic text-gray-100 hover:text-white transition-colors group">
                  Ver beneficios
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
      
    </div>
  );
};

