/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, CameraControls, ContactShadows, Float } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import Model from './model';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

function CameraManager({ step }: { step: number }) {
  const controls = useRef<CameraControls>(null);

  useEffect(() => {
    if (!controls.current) return;
    const transition = true; 

    if (step === 0) {
      controls.current.setLookAt(-15, 3, 3, 0, -1, 0, transition);
    } 
    else if (step === 1) {
      controls.current.setLookAt(-15, 0, 11, 1, 0, 0, transition);
    } 
    else if (step === 2) {
      controls.current.setLookAt(-10, 0.5, -5, 0, 0, 0, transition);
    }
    else if (step === 3) {
      controls.current.setLookAt(-45, 0, 0, 0, -2, 0, transition);
    }
  }, [step]);

  return <CameraControls ref={controls} enabled={false} smoothTime={0.15} />;
}

export default function SceneMobile({ step, color, lensType }: { step: number, color: string, lensType: 'optical' | 'sun' }) {
  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 7], fov: 35 }}>
      <color attach="background" args={['#EBEAE5']} />
      <Environment preset="city" environmentIntensity={0.8} />
      <ambientLight intensity={0.6} />
      <CameraManager step={step} />
      <Float speed={step === 3 ? 0 : 4} rotationIntensity={step === 3 ? 0 : 0.1} floatIntensity={step === 3 ? 0 : 0.1}>
        <Suspense fallback={null}><Model color={color} lensType={lensType} /></Suspense>
      </Float>
      <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={15} blur={2.5} far={10} frames={1} />
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.5} radius={0.6} /> 
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}