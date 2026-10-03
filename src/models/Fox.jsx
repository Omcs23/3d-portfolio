import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import scene from "../assets/3d/fox.glb";

// 3D Model from: https://sketchfab.com/3d-models/fox-f372c04de44640fbb6a4f9e4e5845c78
export function Fox({ currentAnimation, onClick, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(scene);
  const { actions } = useAnimations(animations, group);
  const [hovered, setHovered] = useState(false);

  const initialPos = useRef(props.position || [0.5, 0.35, 0]);
  const initialRot = useRef(props.rotation || [12.629, -0.6, 0]);

  // Update initial positions if props change dynamically
  useEffect(() => {
    if (props.position) initialPos.current = props.position;
    if (props.rotation) initialRot.current = props.rotation;
  }, [props.position, props.rotation]);

  // Play current animation track
  useEffect(() => {
    Object.values(actions).forEach((action) => action.stop());

    if (actions[currentAnimation]) {
      actions[currentAnimation].play();
    }
  }, [actions, currentAnimation]);

  // Dynamic movement effect: smooth floating levitation & mouse look-at tracking
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();

    // Natural floating bob up and down
    group.current.position.y = initialPos.current[1] + Math.sin(t * 1.8) * 0.08;
    group.current.position.z = initialPos.current[2] + Math.cos(t * 1.2) * 0.03;

    // Interactive mouse cursor tracking (Fox turns body towards user's pointer)
    const targetY = initialRot.current[1] + state.pointer.x * 0.4;
    const targetX = initialRot.current[0] - state.pointer.y * 0.2;

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.06);

    // Subtle breathing roll when hovered
    if (hovered) {
      group.current.rotation.z = Math.sin(t * 4) * 0.05;
    } else {
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.05);
    }
  });

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <group name='Sketchfab_Scene'>
        <primitive object={nodes.GLTF_created_0_rootJoint} />
        <skinnedMesh
          name='Object_7'
          geometry={nodes.Object_7.geometry}
          material={materials.PaletteMaterial001}
          skeleton={nodes.Object_7.skeleton}
        />
        <skinnedMesh
          name='Object_8'
          geometry={nodes.Object_8.geometry}
          material={materials.PaletteMaterial001}
          skeleton={nodes.Object_8.skeleton}
        />
        <skinnedMesh
          name='Object_9'
          geometry={nodes.Object_9.geometry}
          material={materials.PaletteMaterial001}
          skeleton={nodes.Object_9.skeleton}
        />
        <skinnedMesh
          name='Object_10'
          geometry={nodes.Object_10.geometry}
          material={materials.PaletteMaterial001}
          skeleton={nodes.Object_10.skeleton}
        />
        <skinnedMesh
          name='Object_11'
          geometry={nodes.Object_11.geometry}
          material={materials.PaletteMaterial001}
          skeleton={nodes.Object_11.skeleton}
        />
      </group>
    </group>
  );
}

useGLTF.preload(scene);
