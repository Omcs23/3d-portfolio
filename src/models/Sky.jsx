import { useRef, useEffect } from "react";
import { useGLTF, Stars, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import skyScene from "../assets/3d/sky.glb";

export function Sky({ isRotating, isNight }) {
  const sky = useGLTF(skyScene);
  const skyRef = useRef();

  // Darken GLTF sky dome in night mode
  useEffect(() => {
    if (sky.scene) {
      sky.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          if (isNight) {
            child.material.color = new THREE.Color("#050b18");
          } else {
            child.material.color = new THREE.Color("#ffffff");
          }
        }
      });
    }
  }, [sky.scene, isNight]);

  useFrame((_, delta) => {
    if (isRotating && skyRef.current) {
      skyRef.current.rotation.y += 0.25 * delta;
    }
  });

  return (
    <group>
      {/* 3D Floating Particles & Atmospheric Sparkles */}
      {isNight ? (
        <>
          <Stars
            radius={120}
            depth={60}
            count={8000}
            factor={4}
            saturation={0}
            fade
            speed={1.5}
          />
          <Sparkles
            count={90}
            scale={50}
            size={4}
            speed={0.5}
            opacity={0.7}
            color="#818cf8"
          />
        </>
      ) : (
        <Sparkles
          count={50}
          scale={40}
          size={3}
          speed={0.3}
          opacity={0.5}
          color="#38bdf8"
        />
      )}

      <mesh ref={skyRef} visible={!isNight}>
        <primitive object={sky.scene} />
      </mesh>
    </group>
  );
}


