/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, CameraControls, ContactShadows, Float } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import Model from './model';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';

function CameraManager({ step, isMobile }: { step: number, isMobile: boolean }) {
  const controls = useRef<CameraControls>(null);

  useEffect(() => {
    if (!controls.current) return;

    const transition = true; 
    const dist = isMobile ? 9 : 7;
    const sideDist = isMobile ? 4 : 3;

    if (step === 0) {
      controls.current.setLookAt(-4, 0, dist, 0, 0, 0, transition);
    } 
    else if (step === 1) {
      const xPos = isMobile ? 1.5 : 3; 
      controls.current.setLookAt(xPos, 1, sideDist, 0, 0, 0, transition);
    } 
    else if (step === 2) {
      const xPos = isMobile ? -2 : -3;
      controls.current.setLookAt(xPos, 0, 2.5, 0, 0, 0, transition);
    }

  }, [step, isMobile]);

  return <CameraControls ref={controls} enabled={false} smoothTime={0.25} />;
}

export default function Scene({ step, color, lensType }: { step: number, color: string, lensType: 'optical' | 'sun' }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    // OPTIMISATION 1 : dpr={[1, 1.5]}
    // Cela empêche le site de calculer en 4K sur les écrans Retina/Haut de gamme.
    // On limite la qualité max à 1.5x, ce qui est largement suffisant avec du post-process.
    <Canvas 
        shadows 
        dpr={[1, 1.5]} 
        gl={{ antialias: false }} // On désactive l'AA natif car le Post-process s'en occupe
        camera={{ position: [0, 0, isMobile ? 9 : 7], fov: isMobile ? 45 : 35 }}
    >
      <color attach="background" args={['#EBEAE5']} />

      <Environment preset="city" environmentIntensity={0.8} />
      <ambientLight intensity={0.6} />
      <spotLight position={[5, 8, 5]} intensity={2.5} angle={0.25} penumbra={0.5} castShadow />

      <CameraManager step={step} isMobile={isMobile} />

      <Float speed={4} rotationIntensity={0.05} floatIntensity={0.1} floatingRange={[-0.05, 0.05]}>
        <Suspense fallback={null}>
          <Model color={color} lensType={lensType} />
        </Suspense>
      </Float>

      {/* OPTIMISATION 2 : frames={1} sur les ombres */}
      {/* Cela dit : "Calcule l'ombre une seule fois au début, pas à chaque image" */}
      {/* Si l'ombre doit bouger, enlève frames={1}, mais pour une scène fixe c'est top */}
      <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={15} blur={2} color="#1a1a1a" frames={1} />

      {/* OPTIMISATION 3 : disableNormalPass */}
      {/* @ts-ignore */}
      <EffectComposer disableNormalPass multisampling={0}>
        
        <Bloom luminanceThreshold={1} mipmapBlur intensity={0.9} radius={0.6} /> 
    

        
        <Vignette eskil={false} offset={0.4} darkness={0.3} />

      </EffectComposer>
    </Canvas>
  );
}