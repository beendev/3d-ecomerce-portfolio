/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, CameraControls, ContactShadows, Float } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import Model from './model';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

function CameraManager({ step }: { step: number }) {
  const controls = useRef<CameraControls>(null);

  useEffect(() => {
    if (!controls.current) return;

    const transition = true; 
    
    if (step === 0) {
      controls.current.setLookAt(-3, 0, 6, 0, 0, 0, transition);
    } 
    else if (step === 1) {
      controls.current.setLookAt(3.5, 1, 4.5, 0, 0, 0, transition);
    } 
    else if (step === 2) {
      controls.current.setLookAt(-3, 0.5, 3, 0, 0, 0, transition);
    }
    else if (step === 3) {
  // EXPLICATION DES CHIFFRES :
// 1er (-15) : C'est la distance. Plus tu es proche de 0, plus c'est ZOOMÉ. (Avant c'était -30)
// 2ème (0)  : Hauteur caméra (reste à 0)
// 3ème (0)  : Axe Z (reste à 0)
// 5ème (-3) : C'est la HAUTEUR à l'écran. Si tu veux monter/descendre les lunettes, change ce -3.

    controls.current.setLookAt(-15, 0, 0, 0, -1.8, 0, transition);
    }

  }, [step]);

  return <CameraControls ref={controls} enabled={false} smoothTime={0.15} />;
}

export default function Scene({ step, color, lensType }: { step: number, color: string, lensType: 'optical' | 'sun' }) {
  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 7], fov: 35 }}>
      <color attach="background" args={['#EBEAE5']} />
      <Environment preset="city" environmentIntensity={0.8} />
      <ambientLight intensity={0.6} />
      <spotLight position={[5, 8, 5]} intensity={2.5} angle={0.25} penumbra={0.5} castShadow />

      <CameraManager step={step} />

      {/* CORRECTION ROTATION : 
          Au step 3, rotationIntensity = 0.
          Les lunettes seront parfaitement de face, sans bouger d'un millimètre. 
      */}
      <Float 
        speed={step === 3 ? 0 : 4} 
        rotationIntensity={step === 3 ? 0 : 0.1} 
        floatIntensity={step === 3 ? 0 : 0.1}
      >
        <Suspense fallback={null}>
          <Model color={color} lensType={lensType} />
        </Suspense>
      </Float>

      <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={15} blur={2.5} frames={1} />

      {/* @ts-ignore */}
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.5} radius={0.6} /> 

        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}