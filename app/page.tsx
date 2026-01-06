/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import Scene from './components/Scene';

export default function Home() {
  const [step, setStep] = useState(0); 
  const [frameColor, setFrameColor] = useState('#1a1a1a');
  const [lensType, setLensType] = useState<'optical' | 'sun'>('optical');
  
  // Panier
  const [bagCount, setBagCount] = useState(0);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Scroll Logic
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < 1000) return;

      if (e.deltaY > 0) {
        if (step < 2) {
            setStep((s) => s + 1);
            lastScrollTime.current = now;
        }
      } else {
        if (step > 0) {
            setStep((s) => s - 1);
            lastScrollTime.current = now;
        }
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [step]);


  const stepsConfig = [
    { 
      id: 0, 
      label: '01. Concept', 
      title: 'BenDev\nModel 01', 
      desc: 'Développement Web 3D Immersif.\nArchitecture Next.js 15 & WebGL.' 
    },
    { 
      id: 1, 
      label: '02. Finition', 
      title: 'Custom\nMaterial', 
      desc: 'Sélectionnez la finition du titane.\nRendu physique (PBR) réaliste.' 
    },
    { 
      id: 2, 
      label: '03. Optique', 
      title: 'Zeiss™\nLenses', 
      desc: 'Configuration des verres.\nClarté optique ou solaire.' 
    },
  ];

  const colors = [
    { name: 'Onyx Matte', hex: '#1a1a1a', tailwind: 'bg-zinc-900', desc: 'Matte' },
    { name: 'Gold Brushed', hex: '#C5A059', tailwind: 'bg-[#C5A059]', desc: 'Metal' },
    { name: 'Silver Polished', hex: '#E0E0E0', tailwind: 'bg-gray-200', desc: 'Chrome' },
    { name: 'Copper Patina', hex: '#8B4513', tailwind: 'bg-[#8B4513]', desc: 'Aged' },
  ];

  const addToBag = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setBagCount(prev => prev + 1);
      setIsAnimating(false);
      setIsBagOpen(true);
    }, 200);
  };

  const currentColorObj = colors.find(c => c.hex === frameColor);

  return (
    <main className="relative w-full h-screen bg-[#EBEAE5] text-[#1a1a1a] overflow-hidden font-sans selection:bg-black selection:text-white">
      
      {/* 3D BACKGROUND */}
      <div className="absolute inset-0 z-0">
         <Scene step={step} color={frameColor} lensType={lensType} />
      </div>

      {/* ================= PANIER SLIDE-OVER (RESPONSIVE) ================= */}
      <div 
        className={`fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] transition-opacity duration-300 ${isBagOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsBagOpen(false)}
      ></div>

      {/* Note: w-full sur mobile, w-[450px] sur desktop (md:) */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#F5F5F0] z-50 shadow-2xl transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${isBagOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         
         <div className="p-6 md:p-8 flex justify-between items-center border-b border-black/5 bg-white">
            <h2 className="text-2xl md:text-3xl font-serif font-medium">Your Selection</h2>
            <button onClick={() => setIsBagOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">✕</button>
         </div>

         <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            {bagCount === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                    <span className="text-6xl">🕸️</span>
                    <p className="font-serif text-xl">Panier vide</p>
                </div>
            ) : (
                <div className="animate-in slide-in-from-right duration-500 fade-in">
                    <div className="bg-white p-6 rounded-none shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="font-serif text-xl md:text-2xl mb-1">BenDev One</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Limited Edition</p>
                            </div>
                            <span className="font-serif text-lg md:text-xl">450 €</span>
                        </div>
                        <div className="flex gap-4 items-center mb-6 relative z-10">
                             <div className="flex flex-col gap-2">
                                <span className="text-[9px] uppercase font-bold text-gray-400">Frame</span>
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-inner border-2 border-white ring-1 ring-gray-100" style={{ backgroundColor: frameColor }}></div>
                                <span className="text-[10px] font-bold">{currentColorObj?.name}</span>
                             </div>
                             <div className="w-[1px] h-10 bg-gray-100"></div>
                             <div className="flex flex-col gap-2">
                                <span className="text-[9px] uppercase font-bold text-gray-400">Lens</span>
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full shadow-inner border-2 border-white ring-1 ring-gray-100 flex items-center justify-center ${lensType === 'sun' ? 'bg-black' : 'bg-blue-50/50 backdrop-blur-sm'}`}>
                                    {lensType === 'sun' ? '🕶️' : '👓'}
                                </div>
                                <span className="text-[10px] font-bold">{lensType === 'optical' ? 'Clear' : 'Sun'}</span>
                             </div>
                        </div>
                        <div className="bg-gray-50 p-4 text-[10px] text-gray-500 leading-relaxed relative z-10">
                            Configuration sauvegardée.
                        </div>
                    </div>
                </div>
            )}
         </div>

         <div className="p-6 md:p-8 bg-white border-t border-black/5">
            <button className="w-full bg-[#1a1a1a] text-white py-4 md:py-5 text-xs font-bold uppercase tracking-[0.25em] hover:bg-black transition active:scale-[0.99]">Valider le devis</button>
         </div>
      </div>


      {/* --- UI PRINCIPALE (Responsive) --- */}
      {/* p-6 sur mobile, p-12 sur desktop */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-12 pointer-events-none">
        
        {/* 1. HEADER */}
        <nav className="flex justify-between items-center pointer-events-auto">
          <div className="flex gap-4 items-center">
             <div className="flex flex-col gap-1.5 cursor-pointer group w-6 md:w-8">
                <div className="w-full h-[2px] bg-black transition-all group-hover:w-1/2"></div>
                <div className="w-2/3 h-[2px] bg-black transition-all group-hover:w-full"></div>
             </div>
          </div>
          
          <div className="text-3xl md:text-5xl font-serif font-bold tracking-tighter absolute left-1/2 -translate-x-1/2 cursor-pointer hover:scale-105 transition-transform">
            BenDev.
          </div>
          
          <div onClick={() => setIsBagOpen(true)} className="cursor-pointer flex items-center gap-2 group">
            {/* On cache le texte "Bag" sur mobile, on garde le compteur */}
            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em] group-hover:underline">Bag</span>
            <span className="bg-black text-white text-[10px] w-6 h-6 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold">{bagCount}</span>
          </div>
        </nav>

        {/* 2. ZONE CENTRALE (Menu Flottant) */}
        {/* Sur mobile, on le centre en bas (items-end justify-center). Sur Desktop, à droite (md:justify-end md:items-center) */}
        <div className="flex-1 relative w-full pointer-events-auto flex flex-col justify-end items-center md:flex-row md:items-center md:justify-end pb-8 md:pb-0">
          
          {/* MENU CONFIGURATEUR */}
          {/* Positionnement responsive : w-full sur mobile, w-[300px] sur desktop */}
          <div className={`transition-all duration-500 transform w-full md:w-auto 
              ${step === 0 ? 'opacity-0 translate-y-20 md:translate-y-0 md:translate-x-20 pointer-events-none' : 'opacity-100 translate-y-0 md:translate-x-0'}`}>
               
               <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] md:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] w-full md:w-[300px] border border-white rounded-xl md:rounded-none">
                  
                  {step === 1 && (
                    <div className="animate-in fade-in zoom-in duration-300">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 text-gray-400 text-center md:text-left">Choose Material</h3>
                      <div className="grid grid-cols-4 md:grid-cols-2 gap-2 md:gap-3">
                          {colors.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => setFrameColor(c.hex)}
                                className={`relative p-2 md:p-3 border transition-all duration-200 hover:bg-white rounded-lg md:rounded-none
                                  ${frameColor === c.hex ? 'border-black bg-white shadow-lg md:scale-105' : 'border-transparent bg-gray-50/50'}
                                `}
                            >
                                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full mb-1 md:mb-2 mx-auto shadow-sm ${c.tailwind}`} style={{ backgroundColor: c.hex }}></div>
                                <span className="hidden md:block text-center text-[9px] font-bold uppercase">{c.desc}</span>
                            </button>
                          ))}
                      </div>
                      <p className="md:hidden text-center text-[9px] font-bold uppercase mt-2 text-gray-500">{currentColorObj?.desc}</p>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="animate-in fade-in zoom-in duration-300">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 text-gray-400 text-center md:text-left">Lens Technology</h3>
                      <div className="flex md:block gap-3 space-y-0 md:space-y-3">
                         {['optical', 'sun'].map((type) => (
                             <button 
                                key={type}
                                onClick={() => setLensType(type as any)} 
                                className={`w-full p-3 md:p-4 border flex flex-col md:flex-row justify-between items-center transition-all hover:shadow-md rounded-lg md:rounded-none
                                  ${lensType === type ? 'bg-black text-white border-black md:scale-105' : 'bg-white text-gray-500 border-gray-100'}
                                `}
                             >
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{type === 'optical' ? 'Optical' : 'Sun'}</span>
                                {lensType === type && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mt-1 md:mt-0"></span>}
                             </button>
                         ))}
                      </div>
                    </div>
                  )}
                  
               </div>
          </div>
        </div>

        {/* 3. FOOTER (DESCRIPTION + NAV STEPS) */}
        <div className="pointer-events-auto">
            
            {/* DESCRIPTION (Responsive text size) */}
            {/* Sur mobile, on réduit la hauteur min (min-h-[80px]) et la taille de police */}
            <div className="mb-4 md:mb-8 min-h-[100px] md:min-h-[120px] relative">
               {stepsConfig.map((s) => (
                   s.id === step && (
                    <div key={s.id} className="absolute bottom-0 left-0 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full md:w-auto">
                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2 text-gray-400">{s.label}</p>
                        <h1 className="text-4xl md:text-6xl font-serif leading-[0.9] mb-2 md:mb-4 whitespace-pre-line">
                            {s.title.split('\n').join(' ')} {/* Sur mobile on met sur une ligne si possible ou on laisse wrap */}
                        </h1>
                        <div className="h-[1px] w-8 md:w-12 bg-black mb-2 md:mb-4"></div>
                        <p className="text-[10px] md:text-xs text-gray-600 leading-relaxed max-w-full md:max-w-md">
                            {s.desc.replace('\n', ' ')} {/* Enlever les sauts de ligne forcés sur mobile */}
                        </p>
                    </div>
                   )
               ))}
            </div>

            {/* BARRE DE NAVIGATION EN BAS */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-t border-black/5 pt-4 md:pt-6 gap-4 md:gap-0">
            
                {/* Steps Scrollable horizontalement sur mobile */}
                <div className="flex gap-8 md:gap-16 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {stepsConfig.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setStep(s.id)}
                            className="relative pb-2 md:pb-3 group flex-shrink-0"
                        >
                            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 
                            ${step === s.id ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>
                            0{s.id + 1}. {s.title.split('\n')[0]}
                            </span>
                            <span className={`absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-500 ease-out
                            ${step === s.id ? 'w-full' : 'w-0 group-hover:w-1/3'}`}></span>
                        </button>
                    ))}
                </div>

                {/* BOUTON D'ACTION (Pleine largeur sur mobile) */}
                <div className="flex gap-0 shadow-2xl transition-transform hover:-translate-y-1 w-full md:w-auto">
                    <div className="bg-white px-4 md:px-6 py-4 flex flex-col justify-center border-r border-gray-100 hidden md:flex">
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider">Starting at</span>
                        <span className="text-sm font-bold">450.00 €</span>
                    </div>
                    <button 
                        onClick={addToBag}
                        className={`bg-[#1a1a1a] text-white w-full md:w-auto px-6 md:px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 flex items-center justify-center md:justify-start gap-3
                        ${isAnimating ? 'bg-emerald-600' : ''}
                        `}
                    >
                        {isAnimating ? 'Saved' : 'Add to Project'}
                        <span className="text-lg leading-none mb-0.5">&rarr;</span>
                    </button>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}