/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import Scene from './components/Scene';
import SceneMobile from './components/SceneMobile'; 
import Loader from './components/Loader';

export default function Home() {
  const [step, setStep] = useState(0); 
  const [frameColor, setFrameColor] = useState('#1a1a1a');
  const [lensType, setLensType] = useState<'optical' | 'sun'>('optical');
  
  const [bagCount, setBagCount] = useState(0);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const lastScrollTime = useRef(0);
  
  // --- VARIABLES POUR LE TOUCH (MOBILE) ---
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); 
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- GESTION UNIFIÉE DU SCROLL ET DU SWIPE ---
  useEffect(() => {
    
    // Fonction pour aller à l'étape suivante
    const goNext = () => {
        const now = Date.now();
        // Protection anti-spam (0.8s entre chaque action)
        if (now - lastScrollTime.current < 800) return;
        if (step < 3) {
            setStep((s) => s + 1);
            lastScrollTime.current = now;
        }
    };

    // Fonction pour aller à l'étape précédente
    const goPrev = () => {
        const now = Date.now();
        if (now - lastScrollTime.current < 800) return;
        if (step > 0) {
            setStep((s) => s - 1);
            lastScrollTime.current = now;
        }
    };

    // 1. GESTION SOURIS (Desktop)
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) goNext();
      else goPrev();
    };

    // 2. GESTION TOUCH (Mobile) - DÉBUT DU TOUCH
    const handleTouchStart = (e: TouchEvent) => {
        touchStart.current = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };
    };

    // 3. GESTION TOUCH (Mobile) - FIN DU TOUCH
    const handleTouchEnd = (e: TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchStart.current.x - touchEndX;
        const deltaY = touchStart.current.y - touchEndY;

        // On regarde si le mouvement est plutôt Horizontal ou Vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // --- Mouvement HORIZONTAL ---
            // Si on a bougé de plus de 50px
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) goNext(); // Swipe vers la Gauche (-> Suivant)
                else goPrev();            // Swipe vers la Droite (-> Précédent)
            }
        } else {
            // --- Mouvement VERTICAL ---
            if (Math.abs(deltaY) > 50) {
                if (deltaY > 0) goNext(); // Swipe vers le Haut (-> Suivant)
                else goPrev();            // Swipe vers le Bas (-> Précédent)
            }
        }
    };

    // Ajout des écouteurs
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    // Nettoyage
    return () => {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
    };
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
    <main className="relative w-full h-[100dvh] bg-[#EBEAE5] text-[#1a1a1a] overflow-hidden font-sans selection:bg-black selection:text-white">
      <Loader />
      
      <div className="absolute inset-0 z-0">
         {isMobile ? (
            <SceneMobile step={step} color={frameColor} lensType={lensType} />
         ) : (
            <Scene step={step} color={frameColor} lensType={lensType} />
         )}
      </div>

      <div className={`fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${isBagOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsBagOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-[#F5F5F0] z-[70] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${isBagOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-8 flex justify-between items-center border-b border-black/5 bg-white">
            <h2 className="text-3xl font-serif">Your Bag ({bagCount})</h2>
            <button onClick={() => setIsBagOpen(false)} className="text-xl p-2 hover:scale-110 transition">✕</button>
         </div>
         <div className="flex-1 p-8 overflow-y-auto">
            {bagCount > 0 ? (
                <div className="flex gap-6 animate-in fade-in slide-in-from-right duration-500">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white flex items-center justify-center border border-black/5">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-inner" style={{ backgroundColor: frameColor }}></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                            <h3 className="font-serif text-xl md:text-2xl italic">Model RG0091</h3>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Titanium Edition</p>
                        </div>
                        <p className="text-[10px] font-bold uppercase">Price: 450.00 €</p>
                    </div>
                </div>
            ) : (
              <p className="text-center italic opacity-30 mt-20">Your bag is empty.</p>
            )}
         </div>
         <div className="p-8 bg-white border-t border-black/5">
            <button className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition active:scale-95">Checkout</button>
         </div>
      </div>

      <div className="relative z-10 h-full w-full flex flex-col justify-between p-6 md:p-12 pointer-events-none">
        
        <nav className="flex justify-between items-center pointer-events-auto">
          <div className="flex gap-4 items-center">
             <div className="flex flex-col gap-1.5 cursor-pointer group w-8">
                <div className="w-full h-[2px] bg-black"></div>
                <div className="w-2/3 h-[2px] bg-black transition-all group-hover:w-full"></div>
             </div>
          </div>
          <div className="text-3xl md:text-5xl font-serif font-bold tracking-tighter absolute left-1/2 -translate-x-1/2">BenDev.</div>
          <div onClick={() => setIsBagOpen(true)} className="cursor-pointer flex items-center gap-2 group pointer-events-auto">
            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em]">Bag</span>
            <span className="bg-black text-white text-[10px] w-6 h-6 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold">{bagCount}</span>
          </div>
        </nav>

        <div className={`flex-1 relative w-full flex flex-col justify-center transition-all duration-1000 ${step === 3 ? 'opacity-0 -translate-y-[100vh]' : 'opacity-100 translate-y-0'}`}>
          <div className="absolute left-0 bottom-12 md:bottom-24 w-full md:max-w-sm pointer-events-auto text-center md:text-left">
             {step < 3 && (
               <div key={step} className="animate-in fade-in slide-in-from-left duration-700">
                  <h1 className="text-5xl md:text-7xl font-serif leading-[0.8] mb-4 md:mb-6 uppercase italic">
                    {step === 0 ? 'Concept' : step === 1 ? 'Customize' : 'Lenses'}
                  </h1>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 md:mb-4">BenDev Model 01 / 2026</p>
                  <p className="text-[11px] md:text-sm leading-relaxed text-gray-600 max-w-[280px] mx-auto md:mx-0">
                    {step === 0 && "Une structure en titane sculptée à la main pour une élégance brute."}
                    {step === 1 && "Choisissez parmi nos finitions artisanales en métal précieux."}
                    {step === 2 && "Verres optiques ou solaires traités par les laboratoires Zeiss™."}
                  </p>
               </div>
             )}
          </div>

          <div className="absolute top-20 right-0 md:top-auto md:right-0 flex flex-col items-end pointer-events-auto">
            {step === 1 && (
              <div className="bg-white/80 backdrop-blur-xl p-4 md:p-8 shadow-2xl w-[160px] md:w-[280px] border border-white animate-in zoom-in fade-in duration-500">
                <p className="text-[9px] font-bold uppercase mb-4 tracking-widest text-gray-400">Select Finish</p>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {colors.map((c) => (
                    <button key={c.name} onClick={() => setFrameColor(c.hex)} className={`group flex flex-col items-center gap-2 p-2 md:p-3 border transition-all ${frameColor === c.hex ? 'border-black bg-white shadow-lg' : 'border-transparent'}`}>
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full" style={{ backgroundColor: c.hex }}></div>
                      <span className="text-[7px] md:text-[8px] font-bold uppercase">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="bg-white/80 backdrop-blur-xl p-4 md:p-8 shadow-2xl w-[180px] md:w-[280px] border border-white animate-in zoom-in fade-in duration-500">
                <p className="text-[9px] font-bold uppercase mb-4 tracking-widest text-gray-400">Lens Type</p>
                <div className="space-y-2">
                  <button onClick={() => setLensType('optical')} className={`w-full p-3 md:p-4 border text-[9px] md:text-[10px] font-bold uppercase transition-all ${lensType === 'optical' ? 'bg-black text-white border-black' : 'bg-white hover:border-black'}`}>Optical Clear</button>
                  <button onClick={() => setLensType('sun')} className={`w-full p-3 md:p-4 border text-[9px] md:text-[10px] font-bold uppercase transition-all ${lensType === 'sun' ? 'bg-black text-white border-black' : 'bg-white hover:border-black'}`}>Sun Tinted</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[100vh]'}`}>
            <div className="text-center w-full max-w-6xl px-4 pointer-events-auto">
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] mb-8 md:mb-12 text-gray-400 italic">L&apos;essence redéfinie</p>
                
                <h2 className="text-3xl md:text-8xl font-serif leading-tight mb-8 uppercase tracking-tighter text-black flex flex-col md:block items-center">
                    NOTRE <span className="inline-block h-[40px] md:h-auto w-[100px] md:w-[320px]"></span> VISION
                    <br className="hidden md:block"/>
                    <span className="md:inline-block">ALLIE DESIGN & PERFORMANCE</span>
                </h2>
                
                <div className="h-[1px] w-16 md:w-24 bg-black mx-auto mb-8 md:mb-12 opacity-20"></div>
                
                <button className="text-[9px] font-bold uppercase tracking-[0.3em] border-b border-black pb-2 hover:opacity-50 transition">
                    Découvrir l&apos;histoire
                </button>
            </div>
        </div>

        <div className={`flex flex-col md:flex-row md:items-end justify-between border-t border-black/5 pt-8 pointer-events-auto transition-all duration-700 ${step === 3 ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
            <div className="flex gap-8 md:gap-16 justify-center md:justify-start overflow-x-auto no-scrollbar pb-4 md:pb-0">
                {stepsConfig.map((s) => (
                    <button key={s.id} onClick={() => setStep(s.id)} className="relative pb-4 group flex-shrink-0">
                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${step === s.id ? 'text-black' : 'text-gray-400'}`}>
                          {s.label}. {s.title}
                        </span>
                        <span className={`absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-500 ${step === s.id ? 'w-full' : 'w-0'}`}></span>
                    </button>
                ))}
            </div>
            <div className="flex shadow-2xl mt-4 md:mt-0 w-full md:w-auto">
                <div className="bg-white px-6 md:px-8 py-4 flex flex-col justify-center border-r border-gray-100 hidden md:flex">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">450.00 €</span>
                </div>
                <button onClick={() => { setIsAnimating(true); setTimeout(addToBag, 200); }} className="bg-black text-white flex-1 md:flex-none px-8 md:px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] active:scale-95 transition">
                    {isAnimating ? 'Added ✓' : 'Add to Bag →'}
                </button>
            </div>
        </div>

      </div>
    </main>
  );
}