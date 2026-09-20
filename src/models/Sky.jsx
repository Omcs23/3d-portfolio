import { useRef, useEffect } from "react";
import { useGLTF, Stars } from "@react-three/drei";
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
      {/* 3D Realistic Twinkling Starfield in Night Mode */}
      {isNight && (
        <Stars
          radius={120}
          depth={60}
          count={8000}
          factor={4}
          saturation={0}
          fade
          speed={1.5}
        />
      )}
      <mesh ref={skyRef} visible={!isNight}>
        <primitive object={sky.scene} />
      </mesh>
    </group>
  );
}

