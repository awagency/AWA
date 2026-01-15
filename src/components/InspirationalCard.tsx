import React from 'react';
import { ArrowUp } from 'lucide-react';
import RocketIcon from './RocketIcon';

const InspirationalCard: React.FC = () => {
  return (
    <div className="relative w-full max-w-[1200px] h-[600px] flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-lg">
      
      {/* Left Panel: Typography */}
      <div className="relative z-20 w-full md:w-[45%] bg-[#200096] flex flex-col justify-center px-8 md:px-16 py-12 shadow-[10px_0_30px_rgba(0,0,0,0.4)]">
        
        {/* Top Gradient Overlay for subtle lighting */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#3a1da8] to-transparent opacity-50 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-center space-y-8">
          
          {/* Quote Block */}
          <div className="relative">
            {/* Opening Quote Mark */}
            <span className="absolute -top-4 -left-6 text-5xl md:text-6xl font-black text-metallic opacity-80 leading-none">
              ”
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide leading-[1.1] text-metallic">
              Las excusas<br />
              de hoy son el<br />
              futuro de<br />
              mañana. <span className="inline-block align-top text-4xl">”</span>
            </h1>
          </div>

          {/* Secondary Text */}
          <p className="text-lg md:text-xl text-gray-300 font-light italic tracking-wider mt-4">
            No llegues tarde.
          </p>

          {/* Attribution */}
          <div className="mt-auto pt-8">
            <p className="text-gray-400 text-sm md:text-base font-light tracking-wide">
              — Apolo Web Agency
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Rocket Illustration */}
      <div className="relative w-full md:w-[55%] bg-[#12005e] flex items-center justify-center overflow-hidden">
        
        {/* Dot Grid Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #808080 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        ></div>

        {/* The Rocket Graphic */}
        <div className="relative w-[120%] h-auto transform -rotate-[0deg] md:-translate-x-12 translate-x-0 scale-90 md:scale-100 transition-transform duration-700 hover:scale-105">
           <RocketIcon />
        </div>

        {/* Bottom Right Arrow Button */}
        <div className="absolute bottom-8 right-8">
          <button className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-95 cursor-pointer group">
            <ArrowUp className="text-black w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default InspirationalCard;