/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { Environment, CameraControls, ContactShadows, Float } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import Model from './model';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

function CameraManager({ step }: { step: number }) {
  const controls = useRef<CameraControls>(null);
  const { size } = useThree(); 

  useEffect(() => {
    if (!controls.current) return;
    const transition = true;

    // Largeur perçue par le navigateur
    const width = size.width;

    // --- FONCTION DE ZOOM INTELLIGENTE ---
    // Cette fonction calcule le recul nécessaire pour les steps 0, 1, 2
    const getResponsiveDist = (baseVal: number) => {
        // Si écran très large (2K/4K), on garde la valeur de base (le CSS gère le reste)
        if (width > 2000) return baseVal;
        // Sinon (Laptop), on adapte selon ton écran Samsung (base 1646px)
        return baseVal * (1646 / width);
    };

    if (step === 0) {
      controls.current.setLookAt(-3, 0, getResponsiveDist(7), 0, 0, 0, transition);
    } 
    else if (step === 1) {
      controls.current.setLookAt(3.5, 1, getResponsiveDist(4.5), 0, 0, 0, transition);
    } 
    else if (step === 2) {
      controls.current.setLookAt(-3, 0.5, getResponsiveDist(3), 0, 0, 0, transition);
    }
    else if (step === 3) {
      // --- RÉGLAGE MANUEL PAR RÉSOLUTION (STEP 3) ---
      
      let targetX = -13.5; // TA VALEUR SAMSUNG (Base)
      let targetY = -1.6;

      // CAS 1 : ÉCRAN 2K (2560px) et 4K (3840px)
      // Le navigateur voit > 2000px. Les lunettes paraissent énormes.
      // -> ON RECULE FORT (X plus négatif)
      if (width > 2000) {
         targetX = -22; // On passe de -13.5 à -22 pour compenser la taille
         targetY = -2.5; // On ajuste légèrement la hauteur
      }
      
      // CAS 2 : ÉCRAN FULL HD (1920px)
      else if (width >= 1900) {
         targetX = -18; // Recul modéré
         targetY = -2;
      }

      // CAS 3 : TON LAPTOP (env 1646px) et plus petit
      else {
         // On garde -13.5 mais on applique le ratio si l'écran est vraiment petit
         // (pour éviter que ça zoome sur un iPad par exemple)
         targetX = -13.5 * Math.max(1, 1646 / width); 
      }

      controls.current.setLookAt(targetX, 0, 0, 0, targetY, -0.1, transition);
    }
  }, [step, size.width]); 

  return <CameraControls ref={controls} enabled={false} smoothTime={0.15} />;
}

export default function Scene({ step, color, lensType }: { step: number, color: string, lensType: 'optical' | 'sun' }) {
  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 7], fov: 35 }}>
      <color attach="background" args={['#EBEAE5']} />
      <Environment preset="city" environmentIntensity={0.8} />
      <ambientLight intensity={0.6} />
      
      <CameraManager step={step} />

      <Float speed={step === 3 ? 0 : 4} rotationIntensity={step === 3 ? 0 : 0.1} floatIntensity={step === 3 ? 0 : 0.1}>
        <Suspense fallback={null}><Model color={color} lensType={lensType} /></Suspense>
      </Float>

      <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={15} blur={2.5} frames={1} />

      <EffectComposer  multisampling={0}>
        <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.5} radius={0.6} /> 
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}