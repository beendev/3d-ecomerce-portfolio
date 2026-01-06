'use client';
import { useProgress } from '@react-three/drei';

export default function Loader() {
  const { progress } = useProgress(); // Hook magique de Drei
  
  return (
    <div className={`fixed inset-0 z-50 bg-[#EBEAE5] flex items-center justify-center transition-opacity duration-1000 pointer-events-none
      ${progress === 100 ? 'opacity-0' : 'opacity-100'}
    `}>
      <div className="flex flex-col items-center">
        <div className="text-6xl font-serif font-bold mb-4">{Math.round(progress)}%</div>
        <div className="w-64 h-[2px] bg-black/10 overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-widest text-gray-400">Loading Experience</p>
      </div>
    </div>
  );
}