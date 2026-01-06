'use client';

import React from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshPhysicalMaterial } from 'three';

interface ModelProps {
  color: string;
  lensType: 'optical' | 'sun';
}

export default function Model({ color, lensType }: ModelProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGLTF('/glasses.glb?v=rigards') as any;

  // Matériau Verre Premium
  const glassMaterial = new MeshPhysicalMaterial({
    color: lensType === 'sun' ? '#000000' : '#ffffff',
    transmission: lensType === 'sun' ? 0 : 1, // 0 = Opaque, 1 = Transparent
    opacity: lensType === 'sun' ? 0.85 : 0.2,
    metalness: 0.1,
    roughness: 0,
    clearcoat: 1,
    transparent: true,
  });

  return (
    // SCALE MIS À 2 ICI
    <group dispose={null} scale={2} rotation={[0, -Math.PI / 2, 0]}> 
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.696}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_5.geometry}
            material={materials.Frame}
            material-color={color}
            material-roughness={0.15} // Brillant
            material-metalness={0.5}
          />
          
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_7.geometry}
            material={materials.Handles}
            material-color={color}
            material-roughness={0.15}
            material-metalness={0.5}
          />
          
          <mesh
            geometry={nodes.Object_9.geometry}
            material={glassMaterial}
          />

        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/glasses.glb?v=rigards');