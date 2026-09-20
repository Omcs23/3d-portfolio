import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Banana3D = ({ onDiscover, ...props }) => {
  const bananaRef = useRef();
  const [isFound, setIsFound] = useState(false);

  // Create curved banana shape
  const createBananaGeometry = () => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, -0.2, 0),
      new THREE.Vector3(-0.2, 0.3, 0),
      new THREE.Vector3(0.3, 0.4, 0),
      new THREE.Vector3(0.7, 0.1, 0),
    ]);

    return new THREE.TubeGeometry(curve, 16, 0.18, 8, false);
  };

  const geometry = useRef(createBananaGeometry()).current;

  // Floating & subtle rotation animation
  useFrame((state) => {
    if (bananaRef.current && !isFound) {
      bananaRef.current.rotation.y += 0.02;
      bananaRef.current.position.y = (props.position?.[1] || 9.5) + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.12;
    }
  });

  const handleClick = (e) => {
    if (e) {
      e.stopPropagation();
    }
    if (isFound) return;

    setIsFound(true);
    localStorage.setItem("banana_found", "true");
    document.body.style.cursor = "auto";

    // Dispatch global custom event for Bhola Guru reaction
    window.dispatchEvent(
      new CustomEvent("banana_discovered", {
        detail: {
          timestamp: Date.now(),
        },
      })
    );

    if (onDiscover) onDiscover();
  };

  if (isFound) return null;

  return (
    <group
      ref={bananaRef}
      {...props}
      onClick={handleClick}
      onPointerDown={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Invisible Large Hit Box for 100% Reliable Clicking */}
      <mesh onClick={handleClick} onPointerDown={handleClick}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Main Glowing Yellow Banana Mesh */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#facc15"
          roughness={0.25}
          metalness={0.15}
          emissive="#f59e0b"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Stem Tip (Green) */}
      <mesh position={[-0.65, -0.22, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.15, 6]} />
        <meshStandardMaterial color="#65a30d" roughness={0.5} />
      </mesh>

      {/* Crown Tip (Brown) */}
      <mesh position={[0.73, 0.08, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.12, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
    </group>
  );
};

export default Banana3D;
