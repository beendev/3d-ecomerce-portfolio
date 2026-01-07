/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import Scene from './components/Scene';
import Loader from './components/Loader';

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
      if (now - lastScrollTime.current < 800) return; // 800ms de délai entre les scrolls

      if (e.deltaY > 0) {
        if (step < 3) {
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
    { id: 0, title: 'Concept', label: '01' },
    { id: 1, title: 'Customize', label: '02' },
    { id: 2, title: 'Lenses', label: '03' }
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

  return (
    <main className="relative w-full h-screen bg-[#EBEAE5] text-[#1a1a1a] overflow-hidden font-sans">
      <Loader />
      
      {/* 3D BACKGROUND */}
      <div className="absolute inset-0 z-0">
         <Scene step={step} color={frameColor} lensType={lensType} />
      </div>

      {/* PANIER SLIDE-OVER */}
      <div className={`fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${isBagOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsBagOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-[#F5F5F0] z-[70] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${isBagOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-8 flex justify-between items-center border-b border-black/5 bg-white">
            <h2 className="text-3xl font-serif">Your Bag ({bagCount})</h2>
            <button onClick={() => setIsBagOpen(false)} className="text-xl">✕</button>
         </div>
         <div className="flex-1 p-8 overflow-y-auto">
            {bagCount > 0 && (
                <div className="flex gap-6 animate-in fade-in slide-in-from-right duration-500">
                    <div className="w-32 h-32 bg-white flex items-center justify-center border border-black/5">
                        <div className="w-16 h-16 rounded-full shadow-inner" style={{ backgroundColor: frameColor }}></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                            <h3 className="font-serif text-2xl">Model RG0091</h3>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Titanium Edition</p>
                        </div>
                        <p className="text-[10px] font-bold uppercase">Price: 450.00 €</p>
                    </div>
                </div>
            )}
         </div>
         <div className="p-8 bg-white border-t border-black/5">
            <button className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition">Checkout</button>
         </div>
      </div>

      {/* ================= UI LAYER ================= */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between p-6 md:p-12 pointer-events-none">
        
        {/* HEADER */}
        <nav className="flex justify-between items-center pointer-events-auto">
          <div className="flex gap-4 items-center">
             <div className="flex flex-col gap-1.5 cursor-pointer group w-8">
                <div className="w-full h-[2px] bg-black"></div>
                <div className="w-2/3 h-[2px] bg-black"></div>
             </div>
          </div>
          <div className="text-4xl md:text-5xl font-serif font-bold tracking-tighter absolute left-1/2 -translate-x-1/2">BenDev.</div>
          <div onClick={() => setIsBagOpen(true)} className="cursor-pointer flex items-center gap-2 group">
            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em]">Bag</span>
            <span className="bg-black text-white text-[10px] w-6 h-6 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold">{bagCount}</span>
          </div>
        </nav>

        {/* SECTION 1 : CONFIGURATION (Steps 0, 1, 2) */}
        {/* Cette section disparaît vers le haut quand on passe au step 3 */}
        <div className={`flex-1 relative w-full flex flex-col justify-center transition-all duration-1000 ${step === 3 ? 'opacity-0 -translate-y-[100vh]' : 'opacity-100 translate-y-0'}`}>
          
          <div className="absolute left-0 bottom-24 max-w-sm pointer-events-auto">
             {step < 3 && (
               <div key={step} className="animate-in fade-in slide-in-from-left duration-700">
                  <h1 className="text-6xl md:text-8xl font-serif leading-[0.8] mb-6">
                    {step === 0 ? 'Concept' : step === 1 ? 'Customize' : 'Lenses'}
                  </h1>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">BenDev Model 01 / 2026</p>
                  <p className="text-sm leading-relaxed text-gray-600 max-w-[280px]">
                    {step === 0 && "Une structure en titane sculptée à la main pour une élégance brute."}
                    {step === 1 && "Choisissez parmi nos finitions artisanales en métal précieux."}
                    {step === 2 && "Verres optiques ou solaires traités par les laboratoires Zeiss™."}
                  </p>
               </div>
             )}
          </div>

          <div className="absolute right-0 flex flex-col items-end pointer-events-auto">
            {step === 1 && (
              <div className="bg-white/80 backdrop-blur-xl p-8 shadow-2xl w-[280px] border border-white animate-in zoom-in fade-in duration-500">
                <p className="text-[10px] font-bold uppercase mb-6 tracking-widest text-gray-400">Select Finish</p>
                <div className="grid grid-cols-2 gap-4">
                  {colors.map((c) => (
                    <button key={c.name} onClick={() => setFrameColor(c.hex)} className={`group flex flex-col items-center gap-2 p-3 border transition-all ${frameColor === c.hex ? 'border-black bg-white shadow-lg' : 'border-transparent'}`}>
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: c.hex }}></div>
                      <span className="text-[8px] font-bold uppercase">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="bg-white/80 backdrop-blur-xl p-8 shadow-2xl w-[280px] border border-white animate-in zoom-in fade-in duration-500">
                <p className="text-[10px] font-bold uppercase mb-6 tracking-widest text-gray-400">Lens Type</p>
                <div className="space-y-3">
                  <button onClick={() => setLensType('optical')} className={`w-full p-4 border text-[10px] font-bold uppercase transition-all ${lensType === 'optical' ? 'bg-black text-white' : 'bg-white hover:border-black'}`}>Optical Clear</button>
                  <button onClick={() => setLensType('sun')} className={`w-full p-4 border text-[10px] font-bold uppercase transition-all ${lensType === 'sun' ? 'bg-black text-white' : 'bg-white hover:border-black'}`}>Sun Tinted</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2 : L'INCRUSTATION (Step 3) */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[100vh]'}`}>
            <div className="text-center w-full max-w-6xl px-6 pointer-events-auto">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] mb-12 text-gray-400 italic">L&apos;essence redéfinie</p>
                
                {/* MODIFICATION : 
                   J'ai passé la largeur du trou (w) à 320px sur desktop pour être LARGE.
                   J'ai ajouté 'leading-relaxed' pour écarter un peu les lignes si ça touche en haut/bas.
                */}
                <h2 className="text-5xl md:text-8xl font-serif leading-snug mb-8 uppercase tracking-tighter text-black flex flex-col md:block items-center">
                    NOTRE <span className="inline-block h-[60px] md:h-auto w-[150px] md:w-[320px]"></span> VISION
                    <br className="hidden md:block"/>
                    <span className="md:inline-block">ALLIE DESIGN & PERFORMANCE</span>
                </h2>
                
                <div className="h-[1px] w-24 bg-black mx-auto mb-12 opacity-20"></div>
                
                <button className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-black pb-2 hover:opacity-50 transition">
                    Découvrir l&apos;histoire
                </button>
            </div>
        </div>

        {/* FOOTER BAR */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between border-t border-black/5 pt-8 pointer-events-auto transition-all duration-700 ${step === 3 ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
            <div className="flex gap-12 md:gap-16">
                {stepsConfig.map((s) => (
                    <button key={s.id} onClick={() => setStep(s.id)} className="relative pb-4 group">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${step === s.id ? 'text-black' : 'text-gray-400'}`}>
                          {s.label}. {s.title}
                        </span>
                        <span className={`absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-500 ${step === s.id ? 'w-full' : 'w-0'}`}></span>
                    </button>
                ))}
            </div>
            <div className="flex shadow-2xl mt-4 md:mt-0">
                <div className="bg-white px-8 py-4 flex flex-col justify-center border-r border-gray-100">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold text-center">450.00 €</span>
                </div>
                <button onClick={() => { setIsAnimating(true); setTimeout(addToBag, 200); }} className="bg-black text-white px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] active:scale-95 transition">
                    Add to Bag &rarr;
                </button>
            </div>
        </div>

      </div>
    </main>
  );
}